var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Accuracy />
        <Progress />
        <Question />
        <Options />
      </div>
    );
  }
});

var Accuracy = React.createClass({
  render: function() {
    return (
      <div className="accuracy">
        X% correct!
      </div>
    );
  }
});

var Progress = React.createClass({
  render: function() {
    return (
      <div className="progress">
        X% complete
      </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    return (
      <div className="question">
        What?
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
