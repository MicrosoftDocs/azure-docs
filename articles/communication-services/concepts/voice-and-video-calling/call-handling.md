---
title: Call Handling
description: TODO
author: mikben    
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services

---
# Call Handling

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Describe here an overall overview and concepts 
Get rid of the object models here
also add example for ios and android
Use the CallClient to:
- Place a call.
- Receive calls.
- Join a Teams meeting.
- Join a group chat call.
- Join a group call. 

The Call object represents an Azure Communication Services call.

## Placing a call
To place a call, use the CallClient.call() API.
### 1:1 Call
To place a 1:1 call, specify the user to make an outgoing call to:
```
const currentCall: Call = this.callClient.call(["User1"], this.callOptions);
```
### 1:N Call
To place a 1:N call, specify a multiple destinations
```
const currentCall: Call = this.callClient.call(["User1", "User2", "User3"], this.callOptions);
```
## Receiving an incoming call
- Subscribe to the CallClient's 'callsUpdated' event to watch for call updates.
- When a new call is incoming, the call object representing this incoming call will be in the calls.added array and its isIncoming field will be set to true.
- When a call is ended, the call object representing this ended call will be in the calls.removed array.
```
this.callClient.on('callsUpdated', calls => {

  calls.added.forEach(addedCall => {
    this.currentCall = addedCall;
    if (this.currentCall.isIncoming) {
        console.log('Incoming call: ', this.currentCall);
    }
  });
  
  calls.removed.forEach(removedCall => {
    console.log('Call removed: ', removedCall);
  });

});
```
## Join a group call
- To join a group call, use the CallClient.join() API.
- Simply specify the groupID to join.
- If a group call with that ID does not exist, then the group will automatically be created.
### Join a group chat call.
```
const call = this.callClient.join({ threadId }, this.callOptions);
```

### Join a group call
```
const call = this.callClient.join({ groupId }, this.callOptions);
```

## Join a Teams meeting.
With Azure Communication Services, you can also join a Microsoft Teams meeting.
### Join a Teams meeting using a teams meeting link
```
const call = this.callClient.join({ teamsMeetingLink }, this.callOptions);
```

### Join a Teams meeting using a teams meeting's coordinates
A team meeting's coordinates are the tenant ID, organizer GUID, threadId, and message ID.
```
const call = this.callClient.join({ threadId, messageId, organizerId, tenantId }, this.callOptions);
```

### Schedule a teams meeting
Scheduling a teams meeting is not part of the Azure Communication Services Calling SDK, but the following is an example of how to schedule a Microsoft Teams meeting through the 'https://scheduler.teams.microsoft.com/teams/v1/meetings' Rest API.
```
const aadToken = 'exampleToken1';
const url = 'https://scheduler.teams.microsoft.com/teams/v1/meetings';
const headers = {
    Authorization: `Bearer ${aadToken}`,
    'X-MS-Skype-MLC-Telemetry-Id': guid.generate()
};
const payload = {
    meetingType: 1,
    startTime: 'startTimeExample',
    endTime: 'endTimeExample'
    pstnConference: {
        enabled: true
    }
};
const currentRetry = 0;
const maxRetry = 2;
const response = await new HttpRequestHelper().sendRequestWithRetry(
  'post', url, payload, { headers }, maxRetry, currentRetry, msg => { console.log(msg); },
  100)
  .then(response => {
      return {
          tenantId: response.data.participants.organizerInfo.tenantId,
          organizerGuid: response.data.participants.organizerInfo.objectId,
          threadId: response.data.groupContext.threadId,
          messageId: response.data.groupContext.messageId,
          meetingJoinLink: response.data.links.join
      };
  });
```        
## Communication Services Call properties
User the Call.state API to get the call's current state. An Communication Services call can be in any of the following states:
- Incoming - 
- Connecting - 
- Connected - 
- LocalHold - 
- RemoteHold - 
- InLobby - 
- EarlyMedia - 
- Disconnecting - 
- Disconnected -
