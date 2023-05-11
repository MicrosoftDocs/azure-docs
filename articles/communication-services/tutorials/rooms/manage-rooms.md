### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```javascript
// retrieves the room with corresponding ID
const getRoom = await roomsClient.getRoom(roomId);
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```javascript
validFrom.setTime(validUntil.getTime());
validUntil.setTime(validFrom.getTime() + 5 * 60 * 1000);

// request payload to update a room
const updateRoomOptions = {
  validFrom: validFrom,
  validUntil: validUntil
};

// updates the specified room with the request payload
const updateRoom = await roomsClient.updateRoom(roomId, updateRoomOptions);
```

### Add new participants

To add new participants to a `room`, use the `addParticipants` method exposed on the client.

```javascript
  // request payload to add participants
  const addParticipantsList = {
    participants: [
      {
        id: user2.user,
        role: "Consumer",
      },
    ],
  };

  // add user2 to the room with the request payload
  const addParticipants = await roomsClient.addParticipants(roomId, addParticipantsList);
```

Participants that have been added to a `room` become eligible to join calls.

### Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```javascript
  const participantsList = await roomsClient.getParticipants(roomId);
```

### Remove participants

To remove a participant from a `room` and revoke their access, use the `removeParticipants` method.

```javascript
  // request payload to delete both users from the room
  const removeParticipantsList = {
    participants: [user1.user, user2.user],
  };

  // remove both users from the room with the request payload
  await roomsClient.removeParticipants(roomId, removeParticipantsList);
```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```javascript
// deletes the specified room
await roomsClient.deleteRoom(roomId);
```