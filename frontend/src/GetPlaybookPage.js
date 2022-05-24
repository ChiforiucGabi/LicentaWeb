import React from 'react'
import { Navbar, Container, ToggleButton, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { BsSubtract } from "react-icons/bs";
import '@wcj/dark-mode';


function downloadZip(zip_str) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;base64,' + zip_str);
    element.setAttribute('download', "Dependencies.zip");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const GetPlabookPage = () => {
    const { playbook } = useSelector(state => state.data);
    const [code, setCode] = React.useState(``);

    return (
        <>
            <Navbar variant='dark' sticky="top" className="my_navbar d-flex justify-content-between">
                <Navbar.Brand className='nav_brand'>Get a custom-made Ansible Playbook for the services you have selected </Navbar.Brand>
            </Navbar>

            <div className='div_playbook'>Your playbook code is here : </div>
            <ToggleButton className='copy_button' variant="outline-dark" onClick={() => navigator.clipboard.writeText(playbook.playbook)}> <BsSubtract></BsSubtract> </ToggleButton>
            <Container className='playbook_container'>
                <CodeEditor
                    value={playbook.playbook}
                    language="yml"
                    placeholder="Please enter JS code."
                    onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    className='code_edt'

                    style={{
                        fontSize: 18,
                        backgroundColor: "#1f2930",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }} />
            </Container>
            <Button className='download_button' variant="outline-dark" onClick={() => downloadZip(playbook.zip)} >Download Dependencyes</Button>
        </>
    )
}

export default GetPlabookPage