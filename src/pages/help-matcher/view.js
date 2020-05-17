import React from 'react'
import Header from '../../components/header'
import NavHeader from '../../components/navHeader'
import Gallery from 'react-grid-gallery'
import Button from 'react-bootstrap/Button'
import Footer from '../../components/footer'
const IMAGES =
    [{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        caption: "After Rain (Jeshu John - designerspics.com)"
    },
    {
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        caption: "Boats (Jeshu John - designerspics.com)"
    },

    {
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212
    }]

export default class View extends React.Component {
    render() {
        return (
            <div>
                <Header>
                    <title>test</title>
                </Header>
                <NavHeader></NavHeader>
                <div className='pt-5 pb-5' style={{ backgroundColor: '#f7fafc' }}>
                    <div className='shadow-md container bg-white rounded p-4 d-flex' style={{ flexDirection: 'column', alignItems: 'center', maxWidth: 800 }}>
                        <div className='featured-image' style={{ backgroundImage: `url(${require('../../assets/images/obama.jpg')})` }} />
                        <div className='w-100'>
                            <div className='row'>
                                <div className='col-md-6 pb-3'>
                                    <h2>Name Lastname</h2>
                                    <span className='text-primary'><span className='material-icons'>place</span> ศาลายา นครปฐม 73170</span>
                                </div>
                            </div>
                            <div className='row'>
                            <div className='col-12 mt-3'>
                                    <Button className='w-100'>ติดต่อมอบความช่วบเหลือ</Button>
                                </div>  
                            </div>

                        </div>
                        <hr />
                        <div className='w-100'>

                            <h3>รายละเอียด</h3>
                            <p>ตอนนี้ข้อมือหลุด และไม่มีงานทำคับ มีหลาน อีก 2 คนครับ ตอนนี้ข้อมือหลุด และไม่มีงานทำคับ มีหลาน อีก 2 คนครับตอนนี้ข้อมือหลุด และไม่มีงานทำคับ มีหลาน อีก 2 คนครับตอนนี้ข้อมือหลุด และไม่มีงานทำคับ มีหลาน อีก 2 คนครับ</p>
                            <h3>ความช่วยเหลือที่ต้องการ</h3>
                            <p className='mb-0'>ต้องการนมผง Olive oil with extra cheese</p>
                        </div>
                        <hr />
                        <div className='w-100'>
                            <Gallery enableImageSelection={false} images={IMAGES} />
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}