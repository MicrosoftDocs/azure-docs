---
author: insravan
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/15/2024
ms.author: insravan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

`BreakoutRooms` is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```
### Create breakoutRoom feature

Then you can get the feature API object from the call instance:
```js
const breakoutRoomsFeature = call.feature(Features.BreakoutRooms);
```
### Subscribe to breakoutRoom events

The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `call` instance and contains information about the breakout rooms created or assigned. 

To receive  breakoutroom details, subscribe to the `breakoutRoomsUpdated` event. 

breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);

### Handling breakoutRoom events

**breakoutRoomsUpdated** event internally supports 4 event types.

1. BreakoutRoomsEvent : When the event type is `breakoutRooms`, the subscriber would be able to receive all the BreakoutRooms which are created by the Organizer / Co-Organizer of the meeting. These details are available to the Microsoft 365 User with Organizer / Co-Organizer / Breakout room Manager role.
  ```js
  export interface BreakoutRoomsEvent {
    /**
     * Breakout room event type
     */
    type: "breakoutRooms",
    /**
     * list of Breakout rooms
     */
    data: BreakoutRoom[] | undefined;
  }
```

2. AssignedBreakoutRoomsEvent :  When the event type is `assignedBreakoutRoom', the subscriber would be able to receive the details of the Breakout room assigned.
```js
export interface AssignedBreakoutRoomEvent {
  /**
   * Breakout room event type
   */
  type: "assignedBreakoutRoom";
   /**
   * Assigned breakout room details
   */
  data: BreakoutRoom | undefined;
}
```

3. BreakoutRoomsSettingsEvent: When the even type is `breakoutRoomSettings` the subscriber would be able to receive all the settings available on the breakout room which are set by the Organizer / Co-Organizer / Breakout room manager of the meeting.
```js
export interface BreakoutRoomSettingsEvent {
  /**
   * Breakout room event type
   */
  type: "breakoutRoomSettings",
   /**
   * Breakout Room setting details
   */
  data: BreakoutRoomSettings | undefined;
}
```
4. JoinBreakoutRoomsEvent : When the event type is `join`, the subscriber would be able to receive the breakout room call object of the joined room.
```js
export interface JoinBreakoutRoomEvent {
  /**
   * Breakout room event type
   */
  type: "join";
   /**
   * Breakoutroom call object
   */
  data: Call | TeamsCall;
}

const breakoutRoomsUpdatedListener = (event) => {
switch(event.type) {
    case "breakoutRooms":
      const breakoutRooms = event.data;
      console.log(`Event data is an array of Breakout rooms with ${breakoutRooms.length} elements`);      
      break;
    case "assignedBreakoutRooms":
      const assignedRoom = event.data;
      console.log(`You are assigned to breakout room named: ${assignedRoom.displayName}`);      
      console.log(`Assigned breakout room thread Id: ${assignedRoom.threadId}`);
      console.log(`Automatically move participants to breakout room: ${assignedRoom.autoMoveParticipantToBreakoutRoom}`);
      console.log(`Assigned breakout room state : ${assignedRoom.state }`);      
      break;
    case "breakoutRoomsSettings":
      const breakoutRoomSettings = event.data;
      console.log(`Event data is a settings object with the room End time: ${breakoutRoomSettings.roomEndTime}`);
      console.log(`Disable the user to return to main meeting from breakout room call : ${breakoutRoomSettings.disableReturnToMainMeeting}`);         
      break;
    case "join":
      const call = event.data;
      console.log(`Event data is a Teams call ${call.id}`);      
      break;
  }
}
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
To retreive all the breakoutRooms created in the Teams main meeting by the Organizer / Co-organizer use the following code. These breakout rooms are available only to the Organizer / Co-Organizer of the meeting.
```js
const breakoutRooms = breakoutRoomsFeature.breakoutRooms;
```
### List invitees

Invitees in the breakoutRooms are available only to the Co-Organizer / Organizer of the meeting. List of invitees can be accessed via the property 
```js
const invitees = breakoutRoomsFeature.breakoutRooms[0].invitees;
```

### Join breakout room

If the assigned breakout room has enabled property `autoMoveParticipantToBreakoutRoom`, then the user is automatically moved to the breakout room when the breakout room state is open. 
`breakoutRoomsUpdated` event is fired with type as `join`, `call` object as the event data. 

If the assigned breakout room doesn't have enabled property `autoMoveParticipantToBreakoutRoom` and the `state` of breakout room is set to `open`, then explicitly call the `join` method on object `breakoutRoom` to join the breakout room.
```js
const breakoutRoom = breakoutRoomsFeature.assignedBreakoutRoom;
if(breakoutRoom.state == 'open' && !breakoutRoom.autoMoveParticipantToBreakoutRoom) {
  const breakoutRoomCall = await breakoutRoom.join();
}
```

### Leave breakout room

When the breakout room state is `closed`, then the user is automatically moved to the main meeting. `breakoutRoomsUpdated` event is fired with type as `assignedBreakoutRooms`, `breakoutRoom` object as the event data containing the `state` property as `closed`. 

If the user wants to leave the breakout room even before the room is closed and join the main meeting call then use the below code :

```js
 if(breakoutRoomCall != null){
    breakoutRoomCall.hangUp();
    const mainMeetingCall = callAgent.calls.filter(x => x.id == mainMeetingCall.Id);
    mainMeetingCall.resume();
 }
```

### Get participants of the breakout room

Use the below code to get the participants of the breakout room after joining the breakout room:

```js
const breakoutRoomCall = await breakoutRoom.join();
const breakoutRoomParticipants = [breakoutRoomCall.remoteParticipants.values()].map((p: SDK.RemoteParticipant) => {
            return {
                identifier: p.identifier,                
                displayName: p.displayName
            };
    });
```

### stop receiving breakout rooms events

Use the following to stop receiving breakoutRooms events
```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
### Breakout room  properties

Breakout rooms have the following properties :

```js
const displayName : string = breakoutRoom.displayName;
```
- `displayName` : Name of the breakout room.

```js
const threadId : string = breakoutRoom.threadId;
```
- `threadId` : You can use chat thread ID to join chat of the breakout room.

```js
const state : BreakoutRoomState = breakoutRoom.state;
```
- `state` : state of the breakout room. It can be either `Open` or `Closed`. Users would be able to join the breakout room only when the state is `Open`.

```js
const autoMoveParticipantToBreakoutRoom : boolean = breakoutRoom.autoMoveParticipantToBreakoutRoom;
```
- `autoMoveParticipantToBreakoutRoom` : Boolean value which indicates whether the users are moved to breakout rooms automatically when the `state` of `assignedBreakoutRoom` is set to `Open`.

```js
const call : Call | TeamsCall = breakoutRoom.call;
```
- `call` : Breakout room call object. This is returned when the user joins the breakout room call automatically or by calling `join` method on `assignedBreakoutRoom` object.

```js
const invitees : Invitee[] = breakoutRoom.invitees;
```
- `invitees` : The list of invitees who are assigned to the breakout room.

### Breakout room  settings

```js
const disableReturnToMainMeeting : boolean = breakoutRoom.disableReturnToMainMeeting;
```
- `disableReturnToMainMeeting` : Disable participants to return to the main meeting from the breakout room call.

```js
const roomEndTime : TimestampInfo = breakoutRoom.roomEndTime;
```
- `roomEndTime` : breakout room end time set by the organizer of the main meeting.

### Troubleshooting

- User trying to join a breakout room when the state of the room is closed.

  When the join() method is called on the breakout room even before the breakout rooms are opened, then an error is thrown to the user with the message"Not able to join Breakout Room as the room is closed. Please    check the state of the Breakout Room before calling join."
  Resoulution : Call join() only when the breakout room state is `open`.

- User getting an error when joining the breakout room.

  There might be a possibility that the breakout room join might fail while automatically moving the user to the breakout room. In this scenario, call breakoutRoom.join() method explicitly. Should be able to join
  the breakout room. Even if that doesn't work, please share the console logs with the Azure Communication Services team.

- User getting an error while leaving the breakout room.

  If the breakout room state is `closed` and the user has still not moved back to the main meeting , check if there are any errors or logs in the console. If no errors are found, try leaving the breakout room  
  using the code shared above for leaving the breakout room and check if that helps. If the user is still not seen in the mainmeeting room, please gather console logs and share it with the Azure communications 
  team for further debugging.

- Assigned breakout room details are not available to the user.

  Check if the user has a Teams Meeting Policy with AllowBreakoutRooms set to false. Only in this case, the user will not be assigned to any breakout room. Update the AllowBreakoutRooms property in the policy to 
  true. Only when the user joins the meeting next time this user will be assigned with breakout room.
  
  
