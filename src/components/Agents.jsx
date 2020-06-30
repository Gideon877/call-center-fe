import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ListGroup, ListGroupItem, Container, Col, Row, ListGroupItemHeading, ListGroupItemText, Badge, ButtonGroup, Button, FormGroup } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

const URL = 'http://localhost:8080/agents';
const _ = require('lodash')

const getTeams = async () => await axios.get('http://localhost:8080/teams').then(result => result.data).catch(e => e);
const getAgents = async () => await axios.get(URL).then(result => result.data).catch(e => e);

const Agents = () => {
    const [data, setData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState('');
    const [showLoading, setShowLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState({});
    const [add, setAdd] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const events = await getAgents();
            const teamList = await getTeams();
            setData(events.length ? events : []);
            setTeams(teamList.length ? teamList.map(item => item['name']) : []);

            setShowLoading(_.isEmpty(events) || _.isEmpty(teamList))
            setSelectedItem(events.length ? events[0] : {});

        };
        fetchData();
    }, [])

    if (showLoading) return <h4>Loading agents....</h4>

    return <Container>
        <Row>
            <Col xs='3'>
                <ListGroup>
                    {
                        data.map(agent => {
                            return <ListGroupItem key={agent.id} tag='button' action onClick={() => setSelectedItem(agent)}>
                                {agent.firstName} {agent.lastName}
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
                        <ListGroupItemHeading>{selectedItem.firstName} {selectedItem.lastName}</ListGroupItemHeading>
                        <ListGroupItemText>
                            # {selectedItem.idNumber} <br /><Badge color='warning'>{selectedItem.team.name}</Badge>
                        </ListGroupItemText>
                    </ListGroupItem>
                </ListGroup>
                }

                {_.isEmpty(selectedItem) && add &&
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            idNumber: '',
                            team,
                            teams
                        }}

                        validationSchema={Yup.object().shape({
                            firstName: Yup.string().required('Firstname is required.'),
                            lastName: Yup.string().required('Lastname is required.'),
                            idNumber: Yup.string().required('idNumber is required.'),
                        })}


                        onSubmit={async (fields, { setErrors }) => {
                            const { firstName, lastName, idNumber } = fields;
                            console.log({ firstName, lastName, idNumber, team })
                            await axios.post('http://localhost:8080/agent', {
                                firstName,
                                lastName,
                                idNumber,
                                team
                            })
                                .then(result => {
                                    setData([...data, result.data]);
                                })
                                .catch(e => e)
                        }
                        }
                    >
                        {({ errors, status, touched, values }) => (
                            <Form>
                                <div className='form-group'>
                                    <label htmlFor='firstName'>First Name</label>
                                    <Field name='firstName' type='firstName' className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                    <ErrorMessage name='firstName' component='div' className='invalid-feedback' />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='lastName'>Last Name</label>
                                    <Field name='lastName' type='lastName' className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                    <ErrorMessage name='lastName' component='div' className='invalid-feedback' />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='idNumber'>ID Number</label>
                                    <Field name='idNumber' type='idNumber' className={'form-control' + (errors.idNumber && touched.idNumber ? ' is-invalid' : '')} />
                                    <ErrorMessage name='idNumber' component='div' className='invalid-feedback' />
                                </div>

                                <FieldArray
                                    name="teams"
                                    render={arrayHelpers => (
                                        <select 
                                            onChange={(e) => setTeam(e.target.value)}>
                                            <option name='teams' value={null} key={'select'} label='select team' />
                                            {
                                                values.teams && values.teams.length > 0 ? (
                                                    values.teams.map((team, index) => (
                                                        <option key={index} value={team} label={`${team}`} name={`teams.${index}`} className={'form-control'} />
                                                    ))
                                                )
                                                    : (
                                                        <Button type="button"
                                                            size='sm'
                                                            color='warning'
                                                            onClick={() => arrayHelpers.push('')}
                                                        > Add an agent
                                                        </Button>
                                                    )}
                                        </select>
                                    )}
                                />

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

export default Agents;
