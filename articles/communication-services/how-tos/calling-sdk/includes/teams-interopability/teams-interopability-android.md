---
author: jiyoonlee
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/14/2024
ms.author: jiyoonlee
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Meeting join methods
To join a Teams meeting, use the `CallAgent.join` method and pass application context, `JoinMeetingLocator`, and `JoinCallOptions`.

### Meeting ID and passcode
The `TeamsMeetingIdLocator` locates a meeting using a meeting ID and passcode. These can be found under a Teams meeting's join info.
A Teams meeting ID will be 12 characters long and will consist of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode will consist of 6 alphabet characters (i.e. `aBcDeF`). The passcode is case sensitive.

```java
String meetingId, passcode; 
TeamsMeetingIdLocator locator = new TeamsMeetingIdLocator(meetingId, passcode);
```

### Meeting link
The `TeamsMeetingLinkLocator` locates a meeting using a link to a Teams meeting. This can found under a Teams meeting's join info. 
```java
String meetingLink; 
TeamsMeetingLinkLocator locator = new TeamsMeetingLinkLocator(meetingLink);
```

### Meeting coordinates 
The `TeamsMeetingCoordinatesLocator` locates meetings using an organizer ID, tenant ID, thread ID, and a message ID. This information can be found using Microsoft Graph.
```java
Guid organizerId, tenantId;
String threadId, messageId;
TeamsMeetingCoordinatesLocator locator = new TeamsMeetingCoordinatesLocator(threadId, organizerId, tenantId, messageId);
```

## Join meeting using locators
After creating these Teams meeting locators, you can use it to join a Teams meeting using `CallAgent.join` as shown below.

```java
JoinCallOptions options = new JoinCallOptions();
call = agent.join(
        getApplicationContext(),
        locator,
        options);
```