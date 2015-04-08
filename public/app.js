var App = React.createClass({
  getInitialState: function() {
    return {questions: [], guesses: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: 'questions.json',
      dataType: 'json',
      success: function(response) {
        this.setState({questions: response});
      }.bind(this)
    });
    $.ajax({
      url: 'guesses.json',
      dataType: 'json',
      success: function(response) {
        this.setState({guesses: response});
      }.bind(this)
    });
  },
  handleGuess: function(guess) {
    var guesses = this.state.guesses;
    guesses.push(guess);
    this.setState({guesses: guesses});
  },
  render: function() {
    var currentQuestion = this.state.questions[this.state.guesses.length];
    return (
      <div className="app">
        <Accuracy
          questions={this.state.questions}
          guesses={this.state.guesses}
        />
        <Progress
          questions={this.state.questions}
          guesses={this.state.guesses}
        />
        <Question question={currentQuestion} />
        <Options question={currentQuestion} onGuess={this.handleGuess}
        />
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
        {id: guess.id, answer: guess.choice}
      ).length > 0;
    });

    return (
      <div className="accuracy">
        {correctGuesses.length / (this.props.guesses.length || 1) * 100}
        % correct
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
      <div className="question">
        {this.props.question ? this.props.question.text : 'loading...'}
      </div>
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
    this.props.onGuess({id: this.props.question.id, choice: choice});

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
