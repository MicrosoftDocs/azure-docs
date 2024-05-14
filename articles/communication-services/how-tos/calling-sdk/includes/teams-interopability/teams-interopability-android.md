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
A Teams meeting ID will be 12 characters long and will consist of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode will consist of 6 alphabet characters (i.e. `aBcDeF`).

```java
String meetingId, passcode; 
TeamsMeetingIdLocator locator = new TeamsMeetingIdLocator(meetingId, passcode);
```

### Meeting link
```java
String meetingLink; 
TeamsMeetingLinkLocator locator = new TeamsMeetingLinkLocator(meetingLink);
```

### Meeting coordinates 
(this is currently in limited preview)

```java
Guid organizerId, tenantId;
String threadId, messageId;
TeamsMeetingCoordinatesLocator locator = new TeamsMeetingCoordinatesLocator(threadId, organizerId, tenantId, messageId);
```

## Join meeting using locators
```java
JoinCallOptions options = new JoinCallOptions();
call = agent.join(
        getApplicationContext(),
        locator,
        options);
```