var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {authToken: null, questions: [], guesses: []};
  },
  componentWillMount: function() {
    var authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      this.context.router.transitionTo('login');
    }
  },
  componentDidMount: function() {
    $.ajax({
      url: '/questions',
      dataType: 'json',
      success: function(response) {
        this.setState({questions: response});
      }.bind(this)
    });
    $.ajax({
      url: '/guesses',
      dataType: 'json',
      success: function(response) {
        this.setState({guesses: response});
      }.bind(this)
    });
  },
  saveGuess: function(guess) {
    var guesses = this.state.guesses;
    guesses.push(guess);
    this.setState({guesses: guesses});
    $.ajax({
      url: '/guesses',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(guess)
    });
  },
  render: function() {
    var guesses = this.state.guesses;
    var questions = this.state.questions;
    console.log(sessionStorage.getItem('authToken'));

    return (
      <RouteHandler
        questions={questions}
        guesses={guesses}
        saveGuess={this.saveGuess}
      />
    );
  }
});

var Interface = React.createClass({
  render: function() {
    var guesses = this.props.guesses;
    var questions = this.props.questions;

    var view = <Loading />;
    if (questions.length) {
      if (guesses.length == questions.length) {
        view = <Complete questions={questions} guesses={guesses} />;
      } else {
        view = <Flashcard questions={questions} guesses={guesses} saveGuess={this.props.saveGuess} />;
      }
    }

    return (
      <div className="interface">{view}</div>
    );
  }
});

var Loading = React.createClass({
  render: function() {
    return (
      <span className="loading">Loading...</span>
    );
  }
});

var Flashcard = React.createClass({
  render: function() {
    var guesses = this.props.guesses;
    var questions = this.props.questions;
    var currentQuestion = questions[guesses.length];

    return (
      <div className="flashcard">
        <Accuracy questions={questions} guesses={guesses} />
        <Progress questions={questions} guesses={guesses} />
        <Question question={currentQuestion} />
        <Options
          question={currentQuestion}
          saveGuess={this.props.saveGuess}
        />
      </div>
    );
  }
});

var Complete = React.createClass({
  componentDidMount: function() {
    sessionStorage.clear();
  },
  render: function() {
    return (
      <div className="complete">
        <Accuracy
          questions={this.props.questions}
          guesses={this.props.guesses}
        />
        <span>Congratulations, you're done!</span>
      </div>
    );
  }
});

var Accuracy = React.createClass({
  render: function() {
    var questions = this.props.questions;
    var correctGuesses = _.filter(this.props.guesses, function(guess) {
      return _.where(
        questions,
        {_id: guess.question_id, answer: guess.choice}
      ).length > 0;
    });

    return (
      <div className="accuracy">
        {Math.round(
          correctGuesses.length / (this.props.guesses.length || 1) * 100
        )}% correct
      </div>
    );
  }
});

var Progress = React.createClass({
  render: function() {
    return (
      <div className="progress">
        {Math.round(
          this.props.guesses.length / this.props.questions.length * 100
        )}% complete
      </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    return (
      <div className="question">{this.props.question.text}</div>
    );
  }
});

var Options = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var yes = React.findDOMNode(this.refs.yes);
    var no = React.findDOMNode(this.refs.no);
    var choice = null;

    if (yes.checked) {
      choice = true;
      yes.checked = false;
    } else if (no.checked) {
      choice = false;
      no.checked = false;
    } else {
      return; // noop
    }
    this.props.saveGuess(
      {question_id: this.props.question._id, choice: choice}
    );

    return;
  },
  render: function() {
    return (
      <form className="options" onSubmit={this.handleSubmit}>
        <label>
          Yes
          <input name="answer" type="radio" value="1" ref="yes"/>
        </label>
        <label>
          No
          <input name="answer" type="radio" value="0" ref="no" />
        </label>
        <button type="submit">Final Answer!</button>
      </form>
    );
  }
});

var Login = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      error: false,
      message: 'There was an error logging in! Hint: user@email.com and 12345.'
    };
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    var passphrase = this.refs.passphrase.getDOMNode().value;
    var user = {email: email, passphrase: passphrase};
    $.ajax({
      url: '/users',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: function(response) {
        sessionStorage.setItem('authToken', response.authToken);
        this.context.router.goBack();
      }.bind(this),
      error: function(response) {
        this.setState({error: true});
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="login">
        <div>{this.state.error ? this.state.message : ''}</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              Email:
              <input
                name="email"
                type="text"
                placeholder="user@email.com"
                ref="email"
              />
            </label>
          </div>
          <div>
            <label>
              Passphrase:
              <input
                name="passphrase"
                type="password"
                placeholder="12345"
                ref="passphrase"
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Interface} />
    <Route name="login" handler={Login} />
  </Route>
);

ReactRouter.run(routes, function(Handler) {
  React.render(
    <Handler />,
    document.getElementById('app')
  );
});
