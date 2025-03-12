---
author: insravan
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/15/2024
ms.author: insravan
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement breakout rooms

`BreakoutRooms` is a `feature` of the class `Call`. First you need to import package `Features` from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```
### Create breakoutRoom feature

Then get the feature API object from the call instance:

```js
const breakoutRoomsFeature = mainMeetingCall.feature(Features.BreakoutRooms);
```

### Subscribe to breakoutRoom events

The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `BreakoutRoomsCallFeature` instance and contains information about the created, updated, and assigned breakout rooms. 

To receive  breakout room details, subscribe to the `breakoutRoomsUpdated` event. 
```js
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```

### Handle breakoutRoom events

Event `breakoutRoomsUpdated` provides an instance of one of the following classes as an input parameter. You can use property `type` to distinguish between individual event types.

- Class `BreakoutRoomsEvent`: This event is triggered when a user with the role organizer, co-organizer, or breakout room manager creates or updates the breakout rooms. Microsoft 365 users with role organizer, co-organizer, or  breakout room manager can receive this type of event. Developers can use the breakout rooms in property `data` to render details about all breakout rooms. This class has property `type` equal to `"breakoutRooms"`.

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

- Class `BreakoutRoomsSettingsEvent`: When a user with a role organizer, co-organizer, or breakout room manager updates the breakout room's settings, it triggers this event. Developers can use this information to render the time when breakout room ends or decide whether to render a button to join main room. This class has property `type` equal to `"breakoutRoomSettings"`.

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

- Class `AssignedBreakoutRoomsEvent`: This event is triggered when user is assigned to a breakout room, or assigned breakout room is updated. Users can join the breakout room when property `state` is set to `open`, leave the breakout room when property `state` is set to `closed`, or render details of the breakout room. This class has property `type` equal to `"assignedBreakoutRoom"`.

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

- Class `JoinBreakoutRoomsEvent`: This event is triggered when the participant is joining a breakout room call. This event can happen when a user is automatically moved to breakout room (that is, if `assignedBreakoutRoom` has property `state` set to `open` and `autoMoveParticipantToBreakoutRoom` is set to `true`) or when a user explicitly joins a breakout room (that is, calls method `join` on the instance `assignedBreakoutRoom` when `autoMoveParticipantToBreakoutRoom` is set to `false`). Property `data` contains the breakout room `call` instance, that developers can use to control breakout room call. This class has property `type` equal to `"join"`.

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

Microsoft 365 users with role organizer, co-organizer, or breakout room manager can access all breakout rooms.

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
When the user is in a breakout room and the organizer assigns a new breakout room to the user, the user gets `breakoutRoomsUpdated` event with the type `assignedBreakoutRooms`. This event contains the latest breakout room details. The user has to `hangUp()` previous breakout room call. If `autoMoveParticipantToBreakoutRoom` is set to `true`, the user is automatically moved, otherwise the user has to call the `join` method explicitly on the new breakout room.

```js
//Breakout room which is assigned initially.
const breakoutRoom = breakoutRoomsFeature.assignedBreakoutRoom;
if(breakoutRoom.state == 'open' && !breakoutRoom.autoMoveParticipantToBreakoutRoom) {
  const breakoutRoomCall = await breakoutRoom.join();
}

// `breakoutRoomsUpdated` event which contains the details of the new breakout room
let assignedRoom = undefined;
const breakoutRoomsUpdatedListener = (event) => {
     switch(event.type) {
          case "assignedBreakoutRooms":
          const assignedRoom = event.data;
          break;
     }
}

if(assignedRoom.threadId != breakoutRoom.threadId && breakoutRooms != null)
{
    await breakoutRoom.hangUp();
}
if(assignedRoom.state == 'open' && !assignedRoom.autoMoveParticipantToBreakoutRoom) {
  const breakoutRoomCall = await assignedRoom.join();
}
```
Microsoft 365 user with role organizer, co-organizer, or breakout room manager get the list of breakout rooms created by the breakout room manager or organizer of the main meeting. In this case, the behavior is slightly different. This user has to explicitly call `join()` method to join the breakout room. The user is kept on hold in the main meeting initially and eventually removed from the main meeting. The user has to initialize the breakoutRooms Feature for the `breakoutRoomCall` inorder to receive updates on the breakout room.

If the user wants to join any of the breakout rooms , then the user explicitly calls the `join` method.

```js
const breakoutRoom = breakoutRoomsFeature.breakoutRooms[0];
if(breakoutRoom.state == 'open') {
  const breakoutRoomCall = await breakoutRoom.join();
}
```
To exit a breakout room, users should execute the `hangUp()` function on the breakout room call. The user would be calling `ReturnToMainMeeting` to resume the main meeting call.

```js
breakoutRoomCall.hangUp();
const mainMeetingCall = breakoutRoomCall.returnToMainMeeting();
```

### Leave breakout room

When the breakout room state is `closed`, user is informed about the end of breakout room by receiving event `breakoutRoomsUpdated` with class `AssignedBreakoutRoomsEvent` and property `type` equal to `assignedBreakoutRooms` that indicates that `assignedBreakoutRoom` has property `state` set to `closed`. User leaves the breakout room automatically and can return to the main meeting by calling `returnToMainMeeting()` as shown above.

If the user wants to leave the breakout room even before the room is closed and the breakout room settings `breakoutRoomsFeature.breakoutRoomsSettings` have property `disableReturnToMainMeeting` set to `false` then user can return to the main meeting call with the following code: 

```js
breakoutRoomCall.hangUp();
const mainMeetingCall = breakoutRoomCall.returnToMainMeeting();
```

### Get participants of the breakout room

When you join the breakout room, you can use the following code to get the list of remote participants of the breakout room:

```js
const breakoutRoomParticipants = [breakoutRoomCall.remoteParticipants.values()].map((p: SDK.RemoteParticipant) => { p.displayName || p.identifier });
console.log(`Participants of the breakoutRoom : <br/>" + breakoutRoomParticipants.join("<br/>")`);
```

### Stop receiving breakout rooms events

Use the following code to stop receiving breakoutRooms events.

```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
### Breakout room properties

Breakout rooms have the following properties:

> [!Note]
> The following sample code efficiently displays all breakout room properties. It is not intended to be reused as shown. In practice you only use the properties needed for your breakout room scenario.

```js
const displayName : string = breakoutRoom.displayName;
const threadId : string = breakoutRoom.threadId;
const state : BreakoutRoomState = breakoutRoom.state;
const autoMoveParticipantToBreakoutRoom : boolean = breakoutRoom.autoMoveParticipantToBreakoutRoom; 
const call : Call | TeamsCall = breakoutRoom.call;
const invitees : Invitee[] = breakoutRoom.invitees;
```

| Breakout room properties | Description|
| --- | --- |
| `displayName`	| Name of the breakout room. This property is read-only. |
| `threadId` | Use the chat thread ID to join chat of the breakout room. This property is read-only. |
| `state` | State of the breakout room. It can be either `open` or `closed`. Users would be able to join the breakout room only when the state is `open`. This property is read-only. |
| `autoMoveParticipantToBreakoutRoom` | Boolean value indicating whether the users are moved to breakout rooms automatically when the `state` of `assignedBreakoutRoom` is set to `open`. This property is read-only. In the Teams UI settings for breakout rooms, the organizer, co-organizer, or breakout room manager can adjust this specific setting. By setting this option to `true`, participants are automatically transferred to their designated breakout room. Conversely, if you set this property to `false`, then you must manually call the `join` method to move participants into the breakout room. |
| `call` | Breakout room call object. This object is returned when the user joins the breakout room call automatically or by calling the `join` method on `assignedBreakoutRoom` object. This property is read-only. |
| `invitees` | The list of invitees who are assigned to the breakout room. This property is read-only. |

### Breakout room settings

Breakout rooms share setting that has the following properties:

```js
const disableReturnToMainMeeting : boolean = breakoutRoomsSettings.disableReturnToMainMeeting;
const roomEndTime : TimestampInfo = breakoutRoomsSettings.roomEndTime;
```

| Breakout room properties | Description|
| --- | --- |
| `disableReturnToMainMeeting` | Disable participants to return to the main meeting from the breakout room call. This property is read-only. In the Teams UI settings for breakout rooms, the organizer, co-organizer, or breakout room manager can adjust this specific setting to control when the participant of breakout rooms can return to the main meeting. |
| `roomEndTime` | Breakout room end time set by the Microsoft 365 user with role organizer, co-organizer, or breakout room manager of the main meeting. This property is read-only. |

### Troubleshooting

|Error code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|400		| 46250	| ExpectedError  | Breakout Rooms feature is only available in Teams meetings. | Implement your own breakout room mechanism or use Teams meetings. |
|405	| 46251 | ExpectedError  | Azure Communication Services currently disabled this feature.  | Try the APIs in a couple of days. |
|500 | 46254	| UnexpectedServerError | Unable to join breakout room due to an unexpected error. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|500| 46255 | UnexpectedServerError | Unable to hold main meeting. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|412 | 46256| ExpectedError | Unable to join Breakout Room as the room is closed. | Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly.|
|412 | 46257| UnexpectedServerError | Unable to resume main meeting. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. If the issue persists, gather browser console logs and contact Azure Communication Services support. |
|412| 46258 | UnexpectedClientError | Unable to read breakout room details. | Gather browser console logs and contact Azure Communication Services support. |
|500 | 46259| UnexpectedServerError | Could not hang up the Breakout room call. | Follow the instructions defined in the section `Leave breakout room` for manual leaving of breakout room. |
|412| 46260 | UnexpectedClientError | Cannot join Breakout Room as it is not yet assigned. | Ensure that the `breakoutRoomsFeature.assignedBreakoutRoom` is having the details of the assigned breakout room. Ensure that the `state` of `assignedBreakoutRoom` is `open` and call `breakoutRoomsFeature.assignedBreakoutRoom.join()` method explicitly. |
|412| 46261 | UnexpectedClientError | Unable to join the main meeting. | Please try again by calling the `breakoutRoomsFeature.assignedBreakoutRoom.returnToMainMeeting()` method. If the issue persists, gather browser console logs and contact Azure Communication Services support.|
|412| 46262 | ExpectedError | Already in the main meeting. | Please call this method only when the participant is in breakout room and removed from the main meeting.|
|412| 46263 | UnexpectedClientError | Existing breakout room call hangup failed. | Try to call hangup() method again to hangup the call. Call join() method to join the breakout room again. |
