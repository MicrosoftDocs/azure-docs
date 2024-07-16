---
author: insravan
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/15/2024
ms.author: insravan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

BreakoutRooms is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:
```js
const breakoutRoomsFeature = call.feature(Features.BreakoutRooms);
```
### Breakout room  properties

Breakout rooms have the following properties :

```js
const url : string = breakoutRoom.url;
```
- `url` : URL of the breakout room.

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
const mainMeetingUrl : string = breakoutRoom.mainMeetingUrl;
```
- `mainMeetingUrl` : Main meeting URL of the Teams meeting.

```js
const disableReturnToMainMeeting : boolean = breakoutRoom.disableReturnToMainMeeting;
```
- `disableReturnToMainMeeting` : disable participants to return to the main meeting from the breakout room call.

```js
const roomEndTime : TimestampInfo = breakoutRoom.roomEndTime;
```
- `roomEndTime` : breakout room end time set by the organizer of the main meeting.

### Handle breakout Room events
The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `call` instance and contains information about the breakout rooms created or assigned. 

To receive a breakoutroom details, subscribe to the `breakoutRoomsUpdated` event. This event internally supports 4 event types.

1. BreakoutRoomsEvent : When the event type is `breakoutRooms`, the subscriber would be able to receive all the BreakoutRooms which are created by the Organizer / Co-Organizer of the meeting. These details are available to the Microsoft 365 User with Organizer / Co-Organizer role.
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

2. AssignedBreakoutRoomEvent :  When the event type is `assignedBreakoutRoom', the subscriber would be able to receive the details of the Breakout room assigned.
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

3. BreakoutRoomSettingsEvent: When the even type is `breakoutRoomSettings` the subscriber would be able to receive all the settings available on the breakout room which are set by the Organizer / Co-Organizer of the meeting.
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
4. JoinBreakoutRoomEvent : When the event type is `join`, the subscriber would be able to receive the breakout room call object.
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
    case "assignedBreakoutRoom":
      const assignedRoom = event.data;
      console.log(`event.data is a breakout room named: ${assignedRoom.displayName}`);      
      break;
    case "breakoutRoomSettings":
      const breakoutRoomSettings = event.data;
      console.log(`Event data is a settings object with the room End time: ${breakoutRoomSettings.roomEndTime}`);      
      break;
    case "join":
      const call = event.data;
      console.log(`Event data is a Teams call ${call.id}`);      
      break;
  }
}
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
If the assigned breakoutroom doesnot have auto Move participants to BreakoutRooms set to true, then explicitly call the "Join" api to join the breakout room when the breakout room is opened.
```js
const breakoutRoom = breakoutRoomsFeature.assignedBreakoutRoom;
const breakoutRoomCall = await breakoutRoom.join();
```
To retreive all the breakoutRooms created in the Teams main meeting by the Organizer / Co-organizer use the following code. These breakout rooms are available only to the Organizer / Co-Organizer of the meeting.
```js
const breakoutRooms = breakoutRoomsFeature.breakoutRooms;
```

Use the following to stop receiving breakoutRooms events
```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
### Key things to note about using BreakoutRooms:
- For Microsoft Teams interoperability scenarios, the functionality of the feature depends on the meeting policy for the breakout room capability.
- BreakoutRooms are supported in the Web Calling SDK.
- BreakoutRooms are not currently supported in the Native SDKs.
