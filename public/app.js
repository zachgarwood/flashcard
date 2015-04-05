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
  },
  render: function() {
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
        <Question>What?</Question>
        <Options />
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
        {correctGuesses.length / (this.props.guesses.length || 1) * 100}% correct
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
        {this.props.children}
      </div>
    );
  }
});

var Options = React.createClass({
  render: function() {
    return (
      <form className="options">
        <label>
          Yes
          <input name="answer" type="radio" value="1" ref="answerYes" />
        </label>
        <label>
          No
          <input name="answer" type="radio" value="0" ref="answerNo" />
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
