---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 01/26/2022
ms.topic: include
ms.custom: include file
ms.author: radubulboaca
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Two or more Communication User Identities. [Create and manage access tokens](../../access-tokens.md?pivots=programming-language-csharp) or [Quick-create identities for testing](../../identity/quick-create-identity.md).
- [Python](https://www.python.org/downloads/) 3.6+ for your operating system.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/rooms-quickstart).

## Setting up

### Create a new python application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir acs-rooms-quickstart && cd acs-rooms-quickstart
```

Create a new file called `rooms-quickstart.py` and add the basic program structure.

```python
from azure.communication.rooms import (
    RoomsClient,
    RoomParticipant,
    RoleType,
    RoomJoinPolicy
)
from azure.communication.identity import CommunicationUserIdentifier

class RoomsQuickstart(object):
    #room method implementations go here

if __name__ == '__main__':
    rooms = RoomsQuickstart()
```

### Install the packages

You'll need to use the Azure Communication Rooms client library for Python [version 1.0.0b2](https://pypi.org/project/azure-communication-rooms/) or above. 

From a console prompt, navigate to the directory containing the rooms.py file, then execute the following command:

```console
pip install azure-communication-rooms
pip install azure-communication-identity
```

### Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```python
#Find your Communication Services resource in the Azure portal
self.connection_string = <COMMUNICATION_SAMPLES_CONNECTION_STRING>
self.rooms_client = RoomsClient.from_connection_string(self.connection_string)
```

### Create a room

Create a new `room` with default properties using the code snippet below:

```python
valid_from = datetime.now()
valid_until = valid_from + relativedelta(months=+1)
participants = []
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 1>")))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 2>")))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 3>")))

try:
    create_room_response = self.rooms_client.create_room(valid_from=valid_from, valid_until=valid_until, participants=participants)
except HttpResponseError as ex:
    print(ex)
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object. 

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```python
try:
    get_room_response = self.rooms_client.get_room(room_id=room_id)
except HttpResponseError as ex:
    print(ex)
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months. 

```python
# set attributes you want to change
valid_from =  datetime.now()
valid_until = valid_from + relativedelta(months=+1,days=+20)

try:
    update_room_response = self.rooms_client.update_room(room_id=room_id, valid_from=valid_from, valid_until=valid_until)
    self.printRoom(response=update_room_response)
except HttpResponseError as ex:
    print(ex)
``` 

### Add new participants 

To add new participants to a `room`, use the `add_participants` method exposed on the client.

```python
try:
    participants = []
    participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 1>"), RoleType.ATTENDEE))
    self.rooms_client.add_participants(room_id, participants)

except Exception as ex:
    print('Error in adding participants to room.', ex)
```

Participants that have been added to a `room` become eligible to join calls.

### Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```python
try:
    participants = self.rooms_client.get_participants(room_id)
except HttpResponseError as ex:
    print(ex)
```

### Remove participants

To remove a participant from a `room` and revoke their access, use the `remove_participants` method.

```python
participants = [CommunicationUserIdentifier("<ACS User MRI identity 2>")]

try:
    remove_participants_response = self.rooms_client.remove_participants(room_id=room_id, communication_identifiers=participants)
except HttpResponseError as ex:
    print(ex)
```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```python
self.rooms_client.delete_room(room_id=room)
```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [Python SDK reference](/python/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
