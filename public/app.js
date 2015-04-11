var App = React.createClass({
  getInitialState: function() {
    return {questions: [], guesses: []};
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
    console.log(JSON.stringify(guess));
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
    var view = <Loading />;
    if (questions.length) {
      if (guesses.length == questions.length) {
        view = <Complete questions={questions} guesses={guesses} />;
      } else {
        view =
          <Interface
            questions={questions}
            guesses={guesses}
            saveGuess={this.saveGuess}
          />;
      }
    }

    return (
      <div className="app">{view}</div>
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

var Interface = React.createClass({
  render: function() {
    var guesses = this.props.guesses;
    var questions = this.props.questions;
    var currentQuestion = questions[guesses.length];

    return (
      <div className="interface">
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
          <input name="answer" type="radio" value="1" ref="yes" />
        </label>
        <label>
          No
          <input name="answer" type="radio" value="0" ref="no" />
        </label>
        <input type="submit" value="Final Answer!" />
      </form>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app')
);
