import constants from "./../constants";
const { firebaseConfig, c } = constants;
import Firebase from "firebase";
import Moment from "Moment";

firebase.initializeApp(firebaseConfig);
const tickets = firebase.database().ref("tickets");

function receiveTicket(ticketFromFirebase) {
  return {
    type: c.RECIEVE_TICKET,
    ticket: ticketFromFirebase
  };
}
export function addTicket(_names, _location, _issue) {
  return () =>
    tickets.push({
      names: _names,
      location: _location,
      issue: _issue,
      timeOpen: new Date().getTime()
    });
}

export function watchFirebaseTicketsRef() {
  return function(dispatch) {
    tickets.on("child_added", data => {
      const newTicket = Object.assign({}, data.val(), {
        id: data.getKey(),
        formattedWaitTime: new Moment(data.val().timeOpen).from(new Moment())
      });
      dispatch(receiveTicket(newTicket));
    });
  };
}
