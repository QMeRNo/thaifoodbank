import React from 'react'
import Header from '../../components/header'
import NavHeader from '../../components/navHeader'
import Button from 'react-bootstrap/Button'
import Footer from '../../components/footer'
import { FacebookProvider, Comments } from 'react-facebook'
import queryString from 'query-string'
import axios from 'axios'
import { apiEndpoint } from '../../components/constants'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import firebase from '../../components/firebase'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import * as moment from 'moment'
import Reaptcha from 'reaptcha'

import DonateModal from '../../components/view/donateModal'

const Donors = (props) => (
    <div>
        {props.donors && props.donors.map((donor, index) => {
            return (
                <div className='d-flex mb-3' key={index}>
                    <div className='avatar' style={{ backgroundImage: `url(${donor.displayName ? donor.photoURL : ''})` }} />
                    <div className='ml-3 flex-center'>
                        <b>{donor.displayName ? donor.displayName : 'บุคคลนิรนาม'}</b>
                        <small className='text-muted'>{moment(donor.createdAt).fromNow()}</small>
                    </div>
                </div>
            )
        })}
    </div>
)
export default class View extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: 'loading',
            images: [],
            contact: 'loading'
        }
    }

    async componentDidMount() {
        try {
            const id = queryString.parse(this.props.location.search).id
            const req = await axios.get(`${apiEndpoint}/post/${id}`)
            this.setState({ data: req.data })
            const image = `https://firebasestorage.googleapis.com/v0/b/thaifoodbank.appspot.com/o/${id}%2f1.jpg?alt=media`
            this.setState({ images: [image] })


            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    const token = await user.getIdToken()
                    this.setState({ user: user })
                    const donationReq = await axios.get(`${apiEndpoint}/post/${id}/isDonated`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    this.setState({ isDonated: donationReq.data })
                } else {
                    this.setState({ user: false })
                }
            })

        } catch (err) {
            console.log(err)
            this.setState({ data: 'error' })
        }

    }
    async confirm() {
        try {
            this.setState({ waiting: true })
            const id = queryString.parse(this.props.location.search).id
            const token = await firebase.auth().currentUser.getIdToken()
            const req = await axios.delete(`${apiEndpoint}/post/${id}/close`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(req.data)
            var temp = this.state.data
            temp.active = false
            this.setState({ confirmStatus: false, data: temp })
        }
        catch (err) {
            console.log(err)
            this.setState({ waiting: false })

        }
    }
    

    async delete() {
        const id = queryString.parse(this.props.location.search).id
        this.setState({ deleting: true })
        try {
            const token = await firebase.auth().currentUser.getIdToken()
            const req = await axios.delete(`${apiEndpoint}/post/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(req.data)
            window.location.replace("/help-matcher")

        }
        catch (err) {
            console.log(err)
        }
    }

    async removeDonation() {
        const id = queryString.parse(this.props.location.search).id
        try {
            const token = await firebase.auth().currentUser.getIdToken()
            const req = await axios.delete(`${apiEndpoint}/donate/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(req.data)
            this.setState({ isDonated: { isDonated: false } })
        }
        catch (err) {
            console.log(err)
        }
    }
    render() {
        return (
            <div>
                <Header>
                    <title>Help Matcher | ผู้ต้องการความช่วยเหลือ</title>
                </Header>
                <NavHeader></NavHeader>
                <div className='pt-5 pb-5 pl-3 pr-3' style={{ backgroundColor: '#f7fafc' }}>
                    <Modal show={this.state.confirmStatus} onHide={() => this.setState({ confirmStatus: false })}>
                        <Modal.Header>
                            <Modal.Title>
                                ยืนยันสถานะ
                            </Modal.Title>
                            <button className='btn btn-icon' onClick={() => this.setState({ confirmStatus: false })}><span className='material-icons'>close</span></button>
                        </Modal.Header>
                        <Modal.Body>
                            เมื่อท่านกดปุ่ม<b>ยืนยันการได้รับความช่วยเหลือ</b>แล้ว ข้อมูลความช่วยเหลือของคุณจะถูกเปลี่ยนสถานะเป็นได้รับความช่วยเหลือแล้ว
                            และจะถูกนำออกจากหน้าแสดงผู้ต้องการความช่วยเหลือ
                        </Modal.Body>
                        <Modal.Footer>
                            <Button disabled={this.state.waiting} variant='secondary' onClick={async () => await this.confirm()}>
                                ยืนยันการได้รับความช่วยเหลือ
                            </Button>

                        </Modal.Footer>

                    </Modal>
                    <Modal show={this.state.showDelete} onHide={() => this.setState({ showDelete: false })} >
                        <Modal.Header className='bg-danger'>
                            <Modal.Title className='text-white'>ยืนยันการลบข้อมูล</Modal.Title>
                            <button onClick={() => this.setState({ showDelete: false })} className='text-white btn btn-icon'><span className='material-icons'>close</span></button>
                        </Modal.Header>
                        <Modal.Body>
                            เมื่อท่านกดปุ่ม<b>ยืนยันการลบข้อมูลแล้ว</b> ข้อมูลของท่านจะถูกลบอย่างถาวรและไม่สามารถเรียกคืนได้
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='light' onClick={() => this.setState({ showDelete: false })}>ปิดหน้าต่างนี้</Button>
                            <Button disabled={this.state.deleting} variant='danger' onClick={async () => await this.delete()}>ยืนยันการลบข้อมูล</Button>
                        </Modal.Footer>
                    </Modal>
                    {this.state.showModal &&
                        <DonateModal
                            donationConfirmed={() => this.setState({ showModal: false, isDonated: { isDonated: true } })}
                            closeModal={() => this.setState({ showModal: false })}
                            isDonated={this.state.isDonated}
                            user={this.state.user}
                            id={queryString.parse(this.props.location.search).id}
                            showModal={this.state.showModal}
                        />
                    }
                    <div className='shadow-md container bg-white rounded p-4 d-flex' style={{ flexDirection: 'column', alignItems: 'center', maxWidth: 800 }}>
                        {(this.state.data?.uid === this.state.user?.uid) && this.state.user && this.state.data !== 'loading' &&
                            <div className='w-100 mb-3'>
                                <h4><span className='badge badge-primary'>ข้อมูลของคุณ</span></h4>
                            </div>
                        }
                        <div className='featured-image' style={{ backgroundImage: `url(${this.state.images[0]})` }} />
                        {this.state.data === 'loading' &&
                            <Spinner className='m-4' animation='border' variant='primary' />
                        }
                        {this.state.data === 'error' &&
                            <h3 className='text-muted'>ไม่พบข้อมูล</h3>
                        }
                        {this.state.data !== 'loading' && this.state.data !== 'error' &&
                            <div className='w-100'>
                                <div className='w-100'>
                                    <div className='row'>
                                        <div className='col-md-12 pb-3'>
                                            <h2>{this.state.data.name}</h2>
                                            <span className='text-primary'><span className='material-icons'>place</span> {this.state.data.placename}</span>
                                        </div>
                                    </div>
                                    {this.state.data.active === true &&
                                        <div className='row mt-3'>
                                            <div className='col-6'>
                                                {this.state.data.uid !== this.state.user?.uid &&
                                                    <Button onClick={() => this.setState({ showModal: true })} className='w-100 h-100'>ติดต่อมอบความช่วยเหลือ</Button>
                                                }
                                                {this.state.data.uid === this.state.user?.uid &&
                                                    <Button onClick={() => this.setState({ confirmStatus: true })} variant='secondary' className='w-100 h-100'>ได้รับความช่วยเหลือแล้ว</Button>
                                                }
                                            </div>

                                            <div className='col-6'>
                                                {this.state.data.uid === this.state.user?.uid &&
                                                    <Button onClick={() => this.setState({ showDelete: true })} variant='danger' className='w-100 h-100'>ลบข้อมูลของคุณ</Button>
                                                }
                                                {this.state.data.uid !== this.state.user?.uid &&
                                                    <Button target='_blank' href={`https://www.facebook.com/sharer.php?u=${this.props.location.href}`} variant='light' className='w-100 h-100'>แชร์โพสต์นี้</Button>
                                                }
                                            </div>
                                        </div>
                                    }
                                    {this.state.data.active === false &&
                                        <div className='row mt-3'>
                                            <div className='col-12'>
                                                <Alert className='text-center' variant='secondary'>ผู้รับบริจาคได้ระบุว่าได้รับความช่วยเหลือแล้ว</Alert>
                                            </div>
                                        </div>
                                    }

                                </div>
                                <hr />
                                <div className='w-100'>
                                    {this.state.isDonated && this.state.isDonated.isDonated === true &&
                                        <Alert variant='secondary' className='d-flex' style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            คุณได้แสดงความประสงค์บริจาคกับบุคคลนี้ไปแล้ว <Button variant='link' onClick={async () => await this.removeDonation()} className='ml-2 text-danger p-0'>ยกเลิก</Button>
                                        </Alert>
                                    }
                                    <h4>รายละเอียด</h4>
                                    <p>{this.state.data.description}</p>
                                    <h4>ความช่วยเหลือที่ต้องการ</h4>
                                    <p className='mb-0'>{this.state.data.need}</p>
                                </div>

                                {(this.state.data.uid === this.state.user?.uid) && this.state.user && this.state.data !== 'loading' &&
                                    <div className='w-100 mt-3'>
                                        <hr />
                                        <h4 className='mb-4'>ผู้ร่วมช่วยเหลือ <span className='badge badge-danger'>{this.state.data.donorsCount} คน</span></h4>
                                        <Donors donors={this.state.data.donors} />
                                    </div>
                                }
                            </div>
                        }

                        <hr />
                        <div className='w-100'>
                            <FacebookProvider appId="637224560162543">
                                <Comments href={`https://thaifoodbank.web.app/help-matcher/view?id=${queryString.parse(this.props.location.search).id}`} width='100%' />
                            </FacebookProvider>
                        </div>
                    </div>

                </div>

                <Footer />
            </div >
        )
    }
}