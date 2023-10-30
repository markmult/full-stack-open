const Notification = ({ message, positive }) => {
  const positiveStyle = {
    backgroundColor: "lightgray",
    border: "2px solid",
    borderRadius: 5,
    color: "green",
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
  };

  const negativeStyle = {
    backgroundColor: "lightgray",
    border: "2px solid",
    borderRadius: 5,
    color: "red",
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
  };

  if (message === null) {
    return null;
  }

  return (
    <div className="error" style={positive ? positiveStyle : negativeStyle}>
      {message}
    </div>
  );
};

export default Notification;
