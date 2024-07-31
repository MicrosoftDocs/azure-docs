---
author: insravan
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/15/2024
ms.author: insravan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

`BreakoutRooms` is a `feature` of the class `Call`. First you need to import package `Features` from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```
### Create breakoutRoom feature

Then you can get the feature API object from the call instance:
```js
const breakoutRoomsFeature = mainMeetingCall.feature(Features.BreakoutRooms);
```
### Subscribe to breakoutRoom events

The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `call` instance and contains information about the breakout rooms created or assigned. 

To receive  breakoutroom details, subscribe to the `breakoutRoomsUpdated` event. 
```js
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```

### Handling breakoutRoom events

Event **breakoutRoomsUpdated** provides instance of one of the following classes as an input parameter. You can use property `type` to distinguish between individual event types.

1. Class `BreakoutRoomsEvent`: This event is triggered when a user with a role organizer, co-organizer or breakout room manager creates or updates the breakout rooms. Microsoft 365 users with role organizer, co-organizer or  breakout room manager can receive this type of event. Developers can use the breakout rooms in property `data` to render details about all breakout rooms. This class has property `type` equal to `"breakoutRooms"`.
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

2. Class `BreakoutRoomsSettingsEvent`: This event is triggered when a user with a role organizer, co-organizer or breakout room manager updates the breakout room's settings. Developers can use this information to render the time when breakout room ends or decide whether to render button to join main room. This class has property `type` equal to `"breakoutRoomSettings"`.
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

3. Class `AssignedBreakoutRoomsEvent`: This event is triggered when user is assigned to a breakout room, or assigned breakout room is updated. Users can join the breakout room when property `state` is set to `open`, leave the breakout room when property `state` is set to `closed` or render details of the breakout room. This class has property `type` equal to `"assignedBreakoutRoom"`.
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


4. Class `JoinBreakoutRoomsEvent` : This event is triggered when the participant is joining breakout room call. This can happen when user is automatically moved to breakout room (i.e., if `assignedBreakoutRoom` has property `state` set to `open` and `autoMoveParticipantToBreakoutRoom` is set to `true`) or when user explicitly joins breakout room (i.e., calls method `join` on the instance `assignedBreakoutRoom` when `autoMoveParticipantToBreakoutRoom` is set to `false`). Property `data` contains the breakout room `call` instance, that developers can use to control breakout room call. This class has property `type` equal to `"join"`.
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
      console.log(`Breakout rooms are created or updated. There are ${breakoutRooms.length} breakout rooms in total.`);
      breakoutRooms.forEach((room)=>{
      console.log(`- ${room.displayName}`);
      });    
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
      console.log(`Breakout room ends at: ${breakoutRoomSettings.roomEndTime}`);
      console.log(`Disable the user to return to main meeting from breakout room call : ${breakoutRoomSettings.disableReturnToMainMeeting}`);         
      break;
    case "join":
      const breakoutRoomCall = event.data;
      console.log(`You have joined breakout room with call ID: ${breakoutRoomCall.id}`);      
      break;
  }
}
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
To retreive all the breakoutRooms created in the Teams main meeting by the Organizer / Co-organizer / Breakout room manager use the following code. These breakout rooms are available only to the Organizer / Co-Organizer / Breakout room manager of the meeting.
```js
const breakoutRooms = breakoutRoomsFeature.breakoutRooms;
breakoutRooms.forEach((room)=>{
      console.log(`- ${room.displayName}`);
       }); 
```

### List available breakout rooms

Microsoft 365 user with role organizer, co-organizer, or breakout room manager can access all breakout rooms.

### List invitees

Microsoft 365 user with role organizer, co-organizer, or breakout room manager can access participants assigned to individual breakout rooms.
```js
breakoutRooms.forEach((room)=>{
      console.log(`${room.displayName}`);
      room.invitees.forEach((invitee) => {
          console.log(`- ${invitee.id}`);         
          })
      })
```

### Join breakout room

If the `assignedBreakoutRoom` has property `autoMoveParticipantToBreakoutRoom` set to `true`, then the user is automatically moved to the breakout room when the property `state` is set to `open`. 
This triggers `breakoutRoomsUpdated` event with class `JoinBreakoutRoomsEvent` that has property `type` set as `join`. You can use the instance of a class `call` in property `data` to manage breakout room call. 

If the assigned breakout room doesn't have enabled property `autoMoveParticipantToBreakoutRoom` and you receive event `breakoutRoomsUpdated` of a type `assignedBreakoutRooms` indicating the `state` of breakout room is set to `open`, then you can join breakout room by calling `join` method on object `breakoutRoom`.
```js
const breakoutRoom = breakoutRoomsFeature.assignedBreakoutRoom;
if(breakoutRoom.state == 'open' && !breakoutRoom.autoMoveParticipantToBreakoutRoom) {
  const breakoutRoomCall = await breakoutRoom.join();
}
```

### Leave breakout room

When the breakout room state is `closed`, then the user is automatically moved to the main meeting. User is informed about the end of breakout room by receiving event `breakoutRoomsUpdated` with class `AssignedBreakoutRoomsEvent` and property `type` equal to `assignedBreakoutRooms`, that indicates that `assignedBreakoutRoom` has property `state` set to `closed`. 

If the user wants to leave the breakout room even before the room is closed and the breakout room settings `breakoutRoomsFeature.breakoutRoomsSettings` have property `disableReturnToMainMeeting` set to `false` then user can join the main meeting call with the following code: 

```js
const breakoutRoomsSettings = breakoutRoomsFeature.breakoutRoomsSettings;
 if(breakoutRoomCall != null && !breakoutRoomsSettings.disableReturnToMainMeeting){
    breakoutRoomCall.hangUp();   
    mainMeetingCall.resume();
 }
```

### Get participants of the breakout room

Use the below code to get the participants of the breakout room after joining the breakout room:

```js
const breakoutRoomCall = await breakoutRoom.join();
const breakoutRoomParticipants = [breakoutRoomCall.remoteParticipants.values()].map((p: SDK.RemoteParticipant) => { p.displayName || p.identifier });
console.log(`Participants of the breakoutRoom : <br/>" + breakoutRoomParticipants.join("<br/>")`);
```

### Stop receiving breakout rooms events

Use the following to stop receiving breakoutRooms events
```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
### Breakout room  properties

Breakout rooms have the following properties :

```js
const displayName : string = breakoutRoom.displayName;
```
- `displayName` : Name of the breakout room. This is a read-only property.

```js
const threadId : string = breakoutRoom.threadId;
```
- `threadId` : You can use chat thread ID to join chat of the breakout room. This is a read-only property.

```js
const state : BreakoutRoomState = breakoutRoom.state;
```
- `state` : State of the breakout room. It can be either `open` or `closed`. Users would be able to join the breakout room only when the state is `open`. This is a read-only property.

```js
const autoMoveParticipantToBreakoutRoom : boolean = breakoutRoom.autoMoveParticipantToBreakoutRoom; 
```
- `autoMoveParticipantToBreakoutRoom` : Boolean value which indicates whether the users are moved to breakout rooms automatically when the `state` of `assignedBreakoutRoom` is set to `open`. This is a read-only property.

```js
const call : Call | TeamsCall = breakoutRoom.call;
```
- `call` : Breakout room call object. This is returned when the user joins the breakout room call automatically or by calling `join` method on `assignedBreakoutRoom` object. This is a read-only property.

```js
const invitees : Invitee[] = breakoutRoom.invitees;
```
- `invitees` : The list of invitees who are assigned to the breakout room. This is a read-only property.

### Breakout room  settings

```js
const disableReturnToMainMeeting : boolean = breakoutRoom.disableReturnToMainMeeting;
```
- `disableReturnToMainMeeting` : Disable participants to return to the main meeting from the breakout room call. This is a read-only property.

```js
const roomEndTime : TimestampInfo = breakoutRoom.roomEndTime;
```
- `roomEndTime`: Breakout room end time set by the Microsoft 365 user with role organizer, co-organizer or breakout room manager of the main meeting. This is a read-only property.

### Troubleshooting
## Error Codes and Description

|Error code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|400		| 46250	| ExpectedError  | Breakout Rooms feature is only available in Teams meetings. 		|
|405	| 46251 | ExpectedError  | Breakout Rooms feature is currently disabled by Azure Communication Services.  | 
|500 | 46254	| UnexpectedServerError | Unable to join breakout room due to an unexpected error. Please try again, if the issue persists, gather browser console logs and contact Azure Communication Services support. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly.|
|500| 46255 | UnexpectedServerError | Unable to hold main meeting. If the issue persists, gather browser console logs and contact Azure Communication Services support.| Ensure that the state of assignedBreakoutRoom is open and call breakoutRoomsFeature.assignedBreakoutRoom.join() method explicitly. |
|412 | 46256| ExpectedError | Unable to join Breakout Room as the room is closed. Please check the state of the Breakout Room before calling join. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly.|
|412 | 46257| UnexpectedServerError | Unable to resume main meeting. Please gather browser console logs and contact Azure Communication Services support. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. |
|412| 46258 | UnexpectedClientError | Error while trying to update the Breakoutroom details. Please gather browser console logs and contact Azure Communication Services support.|
|500 | 46259| UnexpectedServerError | Could not hang up the Breakout room call. Please gather browser console logs and contact Azure Communication Services support. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. |
|412| 46260 | UnexpectedClientError | Cannot join Breakout Room as it is not yet assigned. Can join BreakoutRoom only when assigned.| Ensure that the `breakoutRoomsFeature.assignedBreakoutRoom` is having the details of the assigned breakout room. Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. |
  
  
