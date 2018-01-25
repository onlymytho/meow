var React = require('react');
var Count = require('../../lib/Count');
var OnlineCount = require('../../lib/OnlineCount');
var ViewCount = require('../../lib/ViewCount');

var App = React.createClass({

  render: function(){
    return (
      <div className="row content">

        <ul className="items columns small-12">
          <li className="item">
            <Count counterText="followers" actionDoText="follow" actionDoneText="followed" allowMultiple={true} firebaseHost="https://counter-button.firebaseio.com/" firebaseResourceId='followers-counter'/>
            <div className="post">
              <pre className="brush: html">
              </pre>
            </div>
          </li>
        </ul>
      </div>
    )
  }
});

React.render(
  <App />,
  document.getElementById('app')
)
