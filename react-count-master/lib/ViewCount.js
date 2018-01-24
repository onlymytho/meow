'use strict';
var React = require('react');
var Count = require('./Count');

var ViewCount = React.createClass({

  propTypes: {
    firebaseHost: React.PropTypes.string.isRequired,
    firebaseResourceId: React.PropTypes.string.isRequired,
    counterText: React.PropTypes.string,
    className: React.PropTypes.string,
  },

  render: function () {
    return (
      <Count isViewCounter={true}
             className={this.props.className}
             counterText={this.props.counterText}
             firebaseHost={this.props.firebaseHost}
             firebaseResourceId={this.props.firebaseResourceId}/>
    )
  }

});



module.exports = ViewCount;