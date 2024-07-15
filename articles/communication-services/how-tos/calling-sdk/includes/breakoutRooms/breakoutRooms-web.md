---
author: insravan
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/15/2024
ms.author: insravan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Azure Communication Services or Microsoft 365 users can leave or join breakoutRooms only in Teams meeting scenarios. Microsoft 365 Users will be able to manage the breakoutRooms when they are having Co-Organizer role.

|APIs| Co-Organizer  | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| join | ✔️ | ✔️  |✔️ |

BreakoutRooms is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:
```js
const breakoutRoomsFeature = call.feature(Features.BreakoutRooms);
```

### Handle breakoutRoom events
The `BreakoutRooms` API allows you to subscribe to `BreakoutRooms` events. A `breakoutRoomsUpdated` event comes from a `call` instance and contains information about the breakoutrooms created or assigned . It also has additional event types like join , breakoutRoomSettings available.
```js
const breakoutRoomsUpdatedListener = (event) => {
                        switch(event.type) {
                            case "breakoutRooms":
                              console.log(`Event data is an array of Breakout rooms with ${event.data.length} elements`);
                              breakoutroomsAvailableListener(event);
                              break;
                            case "assignedBreakoutRoom":
                              console.log(`event.data is a breakout room named: ${event.data.displayName}`);
                              assignedBreakoutRoomUpdatedHandler(event);
                              break;
                            case "breakoutRoomSettings":
                              console.log(`Event data is a settings object with the main meeting url: ${event.data}`);
                              breakoutRoomSettingsAvailableListener(event);
                              break;
                            case "join":
                              console.log(`Event data is a Teams call ${event.data.id}`);
                              breakoutroomsJoinedListener(event);
                              break;
                          }
                    }
breakoutRoomsFeature.on('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```

Use the following to stop receiving breakoutRooms events
```js
breakoutRoomsFeature.off('breakoutRoomsUpdated', breakoutRoomsUpdatedListener);
```
