import React, { Component, Fragment } from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TodoList extends Component {
  state = {
    newTodoText: ''
  }

  addTodo = () => {
    const { newTodoText } = this.state;

    this.props.addTodo({
      variables: { text: newTodoText },
      update: (proxy, { data: { createTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  deleteTodo = (id) => {
    this.props.deleteTodo({
      variables: { id: id },
      update: (proxy, { data: { deleteTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  renderTodoList = () => (
    <ul>
      { this.props.todos.allTodoes.map(todo =>
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => {
            this.deleteTodo(todo.id);
          }}>
            Deletar
          </button>
        </li>
      )}
    </ul>
  )

  render() {
    const { todos } = this.props;

    return (
      <Fragment>
        { todos.loading
          ? <p>Carregando...</p>
          : this.renderTodoList() }

        <input
          type="text"
          value={this.state.newTodoText}
          onChange={e => this.setState({ newTodoText: e.target.value })}
        />
        <input type="submit" value="Criar" onClick={this.addTodo} />
      </Fragment>
    );
  }
}

const TodosQuery = gql`
  query {
    allTodoes {
      id
      text
    }
  }
`;

const TodoMutation = gql`
  mutation ($text: String!) {
    createTodo ( text: $text ) {
      id
      text
    }
  }
`;

const DeleteTodoMutation = gql`
  mutation ($id: ID!) {
    deleteTodo ( id: $id ) {
      id
    }
  }
`;

export default compose(
  graphql(TodosQuery, { name: 'todos' }),
  graphql(TodoMutation, { name: 'addTodo' }),
  graphql(DeleteTodoMutation, { name: 'deleteTodo' }),
)(TodoList);
