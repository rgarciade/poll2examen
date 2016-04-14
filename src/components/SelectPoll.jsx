import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Spinner from './Spinner';

export default class SelectPoll extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.resetPollSearch();
  }

  handleOnChangeTitle() {
    const node = this.refs.title;
    const title =  node.value;
    this.setState({ loading: true });
    this.props.pollSearch(title);
  }

  render() {
    const { polls, auth } = this.props;
    const pollVotes = (auth && auth.settings && auth.settings.pollvotes) ?  auth.settings.pollvotes : null;
    const noResults = polls.length === 0 ? 'No results' : null;
    return (
      <div className="row">
        <div className="col-md-6">
                        {(pollVotes !== null) ?
                  Object.keys(pollVotes).map( (id) =>
                    <li className="list-group-item" >
                    <Link to={`/vote/${id}`}>{ pollVotes[id] }</Link>
                     <br/>
                    </li>
                  ) : null
                }

          <div className="input-group">
            <input type="text" className="form-control" placeholder="Pull Title" ref="title" onChange={e => this.handleOnChangeTitle(e)}/>
            <span className="input-group-btn">
              <button className="btn btn-info" type="button" onClick={e => this.handleOnChangeTitle(e)}><span className="glyphicon glyphicon-search" /></button>
            </span>
          </div>
          <br/>
          { this.state.loading ? <Spinner /> : (<div>
            <ul className="list-group">
              {
                polls.map( (poll, index) =>  <li className="list-group-item" key={index}><Link to={`/vote/${poll.id}`}>{poll.title}</Link></li> )
              }
           </ul>
           <h4>{ noResults }</h4>
          </div>)}
        </div>
      </div>
    );
  }
}

SelectPoll.propTypes = {
  polls: PropTypes.array,
  pollSearch: PropTypes.func.isRequired,
  resetPollSearch: PropTypes.func.isRequired
};

SelectPoll.defaultProps = {
  polls: []
};
