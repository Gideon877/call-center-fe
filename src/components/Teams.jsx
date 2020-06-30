import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios';
import { ListGroup, ListGroupItem, Container, Col, Row, ListGroupItemHeading, ListGroupItemText, Button, Input, ButtonGroup } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const URL = 'http://localhost:8080/teams';
const _ = require('lodash')

const getTeams = async () => await axios.get(URL).then(result => result.data).catch(e => e);

const Teams = () => {
    const [data, setData] = useState([]);
    const [add, setAdd] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const events = await getTeams();
            setData(events.length ? events : []);
            setShowLoading(_.isEmpty(events))
            setSelectedItem(events.length ? events[0] : {});
        };
        fetchData();
    }, [])

    if (showLoading) return <h4>Loading teams....</h4>

    return <Container>
        <Row>
            <Col xs='3'>
                <ListGroup>
                    {
                        data.map(team => {
                            return <ListGroupItem key={team.id} tag='button' action onClick={() => setSelectedItem(team)}>
                                {team.name}
                            </ListGroupItem>
                        })
                    }
                    <ListGroupItem tag='button' action onClick={() => {
                        setAdd(!add);
                        setSelectedItem({});
                    }}>
                        Add
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Col>
                {!_.isEmpty(selectedItem) && <ListGroup>
                    <ListGroupItem active>
                        <ListGroupItemHeading>{selectedItem.name}</ListGroupItemHeading>
                        <ListGroupItemText>
                            # {selectedItem.id}
                        </ListGroupItemText>
                    </ListGroupItem>
                    {/** <ButtonGroup>
                        <Button outline color='danger' onClick={async (e)=> {
                            e.preventDefault();
                            const id = selectedItem.id;
                            console.log( {id})
                            await axios.delete('http://localhost:8080/team/' + id)
                                .then(async (result) => {
                                    console.log(result)
                                    const events = await getTeams();
                                    setData(events.length ? events : []);
                                    setShowLoading(_.isEmpty(events));
                                }).catch((err) => {
                                    console.log(err)
                                });
                        }}>Remove</Button>
                        <Button outline color='info'>Update</Button>
                    </ButtonGroup> */}
                </ListGroup>
            }



                {_.isEmpty(selectedItem) && add &&
                    <Formik
                        initialValues={{
                            teamName: ''
                        }}

                        validationSchema={Yup.object().shape({
                            teamName: Yup.string().required('Team name is required.'),
                        })}

                    onSubmit={async (fields, { setErrors }) => await axios.post('http://localhost:8080/team', { name: fields.teamName })
                            .then(result => {
                                setData([...data, result.data]);
                            })
                            .catch(e => e)
                        }
                    >
                        {({ errors, status, touched }) => (
                            <Form>
                                <div className='form-group'>
                                    <label htmlFor='teamName'>Team</label>
                                    <Field name='teamName' type='teamName' className={'form-control' + (errors.teamName && touched.teamName ? ' is-invalid' : '')} />
                                    <ErrorMessage name='teamName' component='div' className='invalid-feedback' />
                                </div>
                                <ButtonGroup>
                                    <Button type='submit' color='primary'>Add</Button>
                                    <Button type='reset' color='danger' >Reset</Button>
                                </ButtonGroup>
                            </Form>
                        )}

                    </Formik>
                }
            </Col>
        </Row>
    </Container >
}

export default Teams;
