import React from 'react';
import { EDIT_ME } from './_editMe';

class ChildrenAsFunctionComponent extends React.Component {
  render() {
    return <div>{this.props.children('passed-argument')}</div>;
  }
}

export default ChildrenAsFunctionComponent;
