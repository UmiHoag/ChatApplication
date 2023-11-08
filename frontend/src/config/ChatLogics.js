export const isSameSenderMargin = (messages, m, i, userId) => {
// console.log(i === messages.length - 1);
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

// export const isSameSender = (messages, m, i, userId) => {
//   return (
//     i < messages?.length - 1 &&
//     (messages[i + 1].sender._id === m.sender._id || //Checking if the same sender of previous looped message's sender id is equal to the next message sender id
//       messages[i + 1].sender._id === undefined) &&
//     messages[i].sender._id !== userId
//   );
// };

// export const isLastMessage = (messages, i, userId) => {
//   return (
//     i === messages?.length - 1 &&
//     messages[messages.length - 1].sender._id !== userId &&
//     messages[messages.length - 1].sender._id
//   );
// };

export const isSameSender = (messages, m, i, userId) => {
  if (!messages || messages.length <= i || !m || !m.sender) {
    return false;
  }

  const nextMessage = messages[i + 1];

  if (nextMessage && nextMessage.sender && nextMessage.sender._id) {
    return (
      nextMessage.sender._id !== m.sender._id && m.sender._id !== userId
    );
  }

  return false;
};

export const isLastMessage = (messages, i, userId) => {
  if (!messages || messages.length <= i) {
    return false;
  }

  const lastMessage = messages[messages.length - 1];

  if (
    lastMessage &&
    lastMessage.sender &&
    lastMessage.sender._id &&
    lastMessage.sender._id !== userId
  ) {
    return i === messages.length - 1;
  }

  return false;
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
