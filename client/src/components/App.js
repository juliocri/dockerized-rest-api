// Importing components.
import React, { Component } from 'react';
import _ from 'lodash';
import { Table, Form, Button, Grid, Container, Icon, Message } from 'semantic-ui-react';
// Importing CSS Files.
import '../../node_modules/semantic-ui-css/semantic.css';
import '../styles/App.css';

/**
 * Class App;
 *
 * Client app for consume our API.
 */
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      column: null,
      data: [],
      direction: null,
      task: {
        id: '',
        name: '',
        deadline: ''
      },
      message: {
        content: '',
        visible: false
      }
    };
  }

  /**
   * componentDidMount();
   *
   * Fetching the initial set of task from our API.
   */
  componentDidMount() {
    fetch('http://127.0.0.1:3001/API/task', {
      method: "GET"
    })
    .then((response) => response.json())
    .then((data) => this.setState({data: data}));
  }

  /**
   * componentDidMount();
   *
   * Apply a reverse operation to a single column in the table.
   */
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  /**
   * handleFormValueChange();
   *
   * Updates the current task properties from the form values.
   */
  handleFormValueChange = (e) => {
    const { task } = this.state;
    task[e.target.name] = e.target.value;
    this.setState({task: task});
  }

  /**
   * handleEdit();
   *
   * Fill the form values with the row selected vals.
   */
  handleEdit = (row) => {
    this.setState({task: row});
  }

  /**
   * handleDelete();
   *
   * Performs the delete action of a task.
   */
  handleDelete = (id) => {
    const answer = window.confirm('The record it will be deleted, you want to continue?');
    if (answer) {
      const { message } = this.state;
      fetch('http://127.0.0.1:3001/API/task/' + id, {
        method: "DELETE"
      })
      .then((response) => response.json())
      .then((data) => this.setState({data: data}));

      message.visible = true;
      message.content = 'Task Was ' + id + ' deleted.';
      this.setState({message: message});
    }
  }

  /**
   * handleSubmit();
   *
   * Performs the add/edit action of a task.
   */
  handleSubmit = (e) => {
    const { message } = this.state;

    if (this.state.task.id) {
      fetch('http://127.0.0.1:3001/API/task/' + this.state.task.id, {
        method: "PUT",
        body: JSON.stringify({
          name: this.state.task.name,
          deadline: this.state.task.deadline
        })
      })
      .then((response) => response.json())
      .then((data) => this.setState({data: data}));

      message.visible = true;
      message.content = 'Task ' + this.state.task.id + ' Was updated.'
    }
    else {
      fetch('http://127.0.0.1:3001/API/task', {
        method: "POST",
        body: JSON.stringify({
          name: this.state.task.name,
          deadline: this.state.task.deadline
        })
      })
      .then((response) => response.json())
      .then((data) => this.setState({data: data}));

      message.visible = true;
      message.content = 'Task Was created.'
    }

    this.setState({
      task: {
        id: '',
        name: '',
        deadline: ''
      },
      message: message
    });
    e.preventDefault();
  }

  /**
   * handleSubmit();
   *
   * Hides the message element from the viewport.
   */
  handleDismiss = (e) => {
    const state = this.state;
    state.message.visible = ! state.message.visible;
    this.setState(state);
  }

  render() {
    const { column, data, direction, task, message } = this.state
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <h1 className="ui header">Rest API Client example</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Field>
                  <input name="id" type="hidden" value={task.id} onChange={this.handleFormValueChange} />
                </Form.Field>
                <Form.Field>
                  <label>Name</label>
                  <input placeholder='Name' name="name" required value={task.name} onChange={this.handleFormValueChange} />
                </Form.Field>
                <Form.Field>
                  <label>Deadline</label>
                  <input placeholder='Deadline' name="deadline" required value={task.deadline} onChange={this.handleFormValueChange} />
                </Form.Field>
                <Button type='submit'>Submit</Button>
              </Form>
            </Grid.Column>
            <Grid.Column width={12}>
             {message.visible &&
                <Message onDismiss={this.handleDismiss} content={message.content}></Message>
              }
              <Table sortable celled fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign='center' sorted={column === 'id' ? direction : null} onClick={this.handleSort('id')}>
                      ID
                    </Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={this.handleSort('name')}>
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'deadline' ? direction : null} onClick={this.handleSort('deadline')}>
                      Deadline
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>
                      Edit
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>
                      Delete
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(data, (obj, i) => (
                    <Table.Row key={i}>
                      <Table.Cell textAlign='center'>{obj.id}</Table.Cell>
                      <Table.Cell>{obj.name}</Table.Cell>
                      <Table.Cell>{obj.deadline}</Table.Cell>
                      <Table.Cell textAlign='center'><Icon disabled name='edit' onClick={this.handleEdit.bind(this, obj)}/></Table.Cell>
                      <Table.Cell textAlign='center'><Icon disabled name='delete calendar' onClick={this.handleDelete.bind(this, obj.id)}/></Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
