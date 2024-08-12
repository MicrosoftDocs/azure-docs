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

The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `BreakoutRoomsCallFeature` instance and contains information about the created, updated and assigned breakout rooms. 

To receive  breakout room details, subscribe to the `breakoutRoomsUpdated` event. 
```js
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```

### Handle breakoutRoom events

Event **breakoutRoomsUpdated** provides instance of one of the following classes as an input parameter. You can use property `type` to distinguish between individual event types.

1. Class `BreakoutRoomsEvent`: This event is triggered when a user with a role organizer, co-organizer, or breakout room manager creates or updates the breakout rooms. Microsoft 365 users with role organizer, co-organizer or  breakout room manager can receive this type of event. Developers can use the breakout rooms in property `data` to render details about all breakout rooms. This class has property `type` equal to `"breakoutRooms"`.
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

2. Class `BreakoutRoomsSettingsEvent`: This event is triggered when a user with a role organizer, co-organizer, or breakout room manager updates the breakout room's settings. Developers can use this information to render the time when breakout room ends or decide whether to render button to join main room. This class has property `type` equal to `"breakoutRoomSettings"`.
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
```
The following code shows you valuable information received in the breakout room events:
```js
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
### List available breakout rooms

Microsoft 365 user with role organizer, co-organizer, or breakout room manager can access all breakout rooms.
```js
const breakoutRooms = breakoutRoomsFeature.breakoutRooms;
breakoutRooms.forEach((room)=>{
      console.log(`- ${room.displayName}`);
       }); 
```

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

If the `assignedBreakoutRoom` has property `autoMoveParticipantToBreakoutRoom` set to `true`, then the user is automatically moved to the breakout room when the property `state` is set to `open`. If `autoMoveParticipantToBreakoutRoom` is set to `false`, then use the following code to join breakout room.
This triggers `breakoutRoomsUpdated` event with class `JoinBreakoutRoomsEvent` that has property `type` set as `join`. You can use the instance of a class `call` in property `data` to manage breakout room call. 

```js
const breakoutRoom = breakoutRoomsFeature.assignedBreakoutRoom;
if(breakoutRoom.state == 'open' && !breakoutRoom.autoMoveParticipantToBreakoutRoom) {
  const breakoutRoomCall = await breakoutRoom.join();
}
```

### Leave breakout room

When the breakout room state is `closed`, then the user is automatically moved to the main meeting. User is informed about the end of breakout room by receiving event `breakoutRoomsUpdated` with class `AssignedBreakoutRoomsEvent` and property `type` equal to `assignedBreakoutRooms` that indicates that `assignedBreakoutRoom` has property `state` set to `closed`. 

If the user wants to leave the breakout room even before the room is closed and the breakout room settings `breakoutRoomsFeature.breakoutRoomsSettings` have property `disableReturnToMainMeeting` set to `false` then user can join the main meeting call with the following code: 

```js
const breakoutRoomsSettings = breakoutRoomsFeature.breakoutRoomsSettings;
 if(breakoutRoomCall != null && !breakoutRoomsSettings.disableReturnToMainMeeting){
    breakoutRoomCall.hangUp();   
    mainMeetingCall.resume();
 }
```

### Get participants of the breakout room

When you join the breakout room, you can use the following code to get the list of remote participants of the breakout room:

```js
const breakoutRoomParticipants = [breakoutRoomCall.remoteParticipants.values()].map((p: SDK.RemoteParticipant) => { p.displayName || p.identifier });
console.log(`Participants of the breakoutRoom : <br/>" + breakoutRoomParticipants.join("<br/>")`);
```

### Stop receiving breakout rooms events

Use the following code to stop receiving breakoutRooms events
```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
### Breakout room  properties

Breakout rooms have the following properties:

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
Breakout rooms share setting that has the following properties:
```js
const disableReturnToMainMeeting : boolean = breakoutRoomsSettings.disableReturnToMainMeeting;
```
- `disableReturnToMainMeeting` : Disable participants to return to the main meeting from the breakout room call. This is a read-only property.

```js
const roomEndTime : TimestampInfo = breakoutRoomsSettings.roomEndTime;
```
- `roomEndTime`: Breakout room end time set by the Microsoft 365 user with role organizer, co-organizer, or breakout room manager of the main meeting. This is a read-only property.

### Troubleshooting

|Error code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|400		| 46250	| ExpectedError  | Breakout Rooms feature is only available in Teams meetings. | Implement your own breakout room mechanism or use Teams meetings. |
|405	| 46251 | ExpectedError  | Breakout Rooms feature is currently disabled by Azure Communication Services.  | Try the APIs in a couple of days. |
|500 | 46254	| UnexpectedServerError | Unable to join breakout room due to an unexpected error. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|500| 46255 | UnexpectedServerError | Unable to hold main meeting. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|412 | 46256| ExpectedError | Unable to join Breakout Room as the room is closed. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly.|
|412 | 46257| UnexpectedServerError | Unable to resume main meeting. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|412| 46258 | UnexpectedClientError | Unable to read breakout room details. | Gather browser console logs and contact Azure Communication Services support. |
|500 | 46259| UnexpectedServerError | Could not hang up the Breakout room call. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. |
|412| 46260 | UnexpectedClientError | Cannot join Breakout Room as it is not yet assigned. | Ensure that the `breakoutRoomsFeature.assignedBreakoutRoom` is having the details of the assigned breakout room. Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. |
  
  
