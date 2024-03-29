import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Col, Offcanvas, Card, ToggleButton, Button, Badge, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { loadServices, generatePlaybook } from './redux/actions';
import { BsFillXCircleFill, BsBoxArrowDown } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const Home = () => {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const { services } = useSelector(state => state.data);

    const [myArray, setMyArray] = useState([]);
    const [servicesNames, setServicesNamesArray] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [visibility, setVisibility] = useState("hidden");
    const [id, setId] = useState("");

    const onChangeHandler = event => {
        setId(event.target.value);
    };

    useEffect(() => {
        dispatch(loadServices());
    }, []);

    const routeChange = () => {
        let path = `getPlabookPage`;
        navigate(path);
    }

    function toggleButton(index, serviceName) {
        if (myArray.includes(index)) {
            var array = [...myArray];
            var servicesArray = [...servicesNames];
            var indexOf = array.indexOf(index);
            if (indexOf !== -1) {
                array.splice(indexOf, 1);
                servicesArray.splice(indexOf, 1);
                setMyArray(array);
                setServicesNamesArray(servicesArray)
            }
        }
        else {
            setMyArray(myArray => [...myArray, index]);
            setServicesNamesArray(servicesNames => [...servicesNames, serviceName]);
        }
    }

    function removeServiceButton(serviceName) {
        var index = -1;
        var temp = 0;
        services.forEach(element => {
            if (element.name === serviceName) {
                index = temp;
            }
            temp++;
        });


        if (myArray.includes(index)) {
            var array = [...myArray];
            var servicesArray = [...servicesNames];

            var indexOf = array.indexOf(index);
            var indexOf2 = servicesArray.indexOf(serviceName);

            if (indexOf !== -1) {

                array.splice(indexOf, 1);
                servicesArray.splice(indexOf2, 1);
                setMyArray(array);
                setServicesNamesArray(servicesArray)
            }

            if (servicesArray.length === 0) {
                handleClose()
            }
        }
    }

    function submitGeneratePlaybook() {
        var finalList = new Array();

        if (id == '') {
            setVisibility("visible")
            return;
        }

        finalList.push(id);
        finalList = finalList.concat(servicesNames);
        dispatch(generatePlaybook(finalList));
        handleClose();
        routeChange();
    }

    return (
        <>
            <Navbar variant='dark' sticky="top" className="my_navbar d-flex justify-content-between">
                <Navbar.Brand className='nav_brand'>Get a custom-made Ansible Playbook for the services you have selected </Navbar.Brand>
                <Button variant="primary" onClick={toggleShow} className="services_notif" disabled={!myArray.length}><Badge className='my_badge' pill bg="">{myArray.length}</Badge></Button>
                <Offcanvas show={show} onHide={handleClose} key={"end_id"} placement={"end"} name={"end"} className="my_offcanvas">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>The services you have selected <BsBoxArrowDown></BsBoxArrowDown></Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ListGroup defaultActiveKey="#link1">
                            {servicesNames.map((service) => (
                                <ListGroup.Item as="li" className="d-flex justify-content-between" key={service}>
                                    <strong className='serviceName_list'>{service}</strong>
                                    <OverlayTrigger placement="left" overlay={<Tooltip id={`tooltip-left`}>Click to remove</Tooltip>}>
                                        <Button onClick={() => removeServiceButton(service)} className='remove_from_list_btn'><BsFillXCircleFill className='my_icon'></BsFillXCircleFill></Button>
                                    </OverlayTrigger>
                                </ListGroup.Item>

                            ))}
                            <Button className='generate_playbook_button' onClick={() => handleShowModal()} style={{ position: "absolute", bottom: "2%", left: "30%" }} >Generate playbook</Button>
                        </ListGroup>
                    </Offcanvas.Body>
                </Offcanvas>
            </Navbar>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Please Provide Machine ID</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>VM ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Kali-Linux-2020_1644"
                                autoFocus
                                value={id}
                                onChange={onChangeHandler}
                            />
                            <Form.Label id="VM_ID_Error" style={{ "visibility": visibility }}>Please enter VM ID!</Form.Label>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitGeneratePlaybook()}>
                        Generate Playkook
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container style={{ "flexWrap": "wrap", "display": "flex", 'justifyContent': 'center' }}>
                {services && services.map((item, index) => (
                    < Col key={item.name} style={{ 'maxWidth': 'min-content' }}>
                        <Card className='text-center my_card' style={{ "height": "22rem", "minWidth": "20rem", "margin": "0.5rem" }}>
                            <Card.Img style={{ "height": "80%" }} variant="top" src={"./images/" + item.name + ".png"} alt="Service logo" />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text><ToggleButton className="mb-2" id={index} type="checkbox" variant="outline-primary" checked={myArray.includes(index)}
                                    value={index} onChange={() => toggleButton(index, item.name)} > {myArray.includes(index) ? "Remove service" : "Add service"} </ToggleButton></Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Container>
        </>
    )
}

export default Home