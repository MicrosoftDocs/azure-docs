---
title: include file
description: include file
services: azure-communication-services
author: peiliu
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 04/27/2023
ms.topic: include
ms.custom: include file
ms.author: peiliu
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/rooms-quickstart).

## Setting up

### Create a new Python application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir acs-rooms-quickstart && cd acs-rooms-quickstart
```

### Install the packages

You'll need to use the Azure Communication Rooms client library for Python [version 1.0.0b2](https://pypi.org/project/azure-communication-rooms/) or above.

From a console prompt, navigate to the directory containing the rooms.py file, then execute the following command:

```console
pip install azure-communication-rooms
pip install azure-communication-identity
```

### Set up the app framework

Create a new file called `rooms-quickstart.py` and add the basic program structure.

```python

import os
from datetime import datetime, timedelta
from azure.communication.rooms import (
    RoomsClient,
    RoomParticipant,
    ParticipantRole
)
from azure.communication.identity import CommunicationUserIdentifier

class RoomsQuickstart(object):
    print("Azure Communication Services - Rooms Quickstart")
    #room method implementations goes here

if __name__ == '__main__':
    rooms = RoomsQuickstart()
```

### Install the packages

You'll need to use the Azure Communication Rooms client library for Python [version 1.0.0b3](https://pypi.org/project/azure-communication-rooms/) or above.

From a console prompt, navigate to the directory containing the rooms.py file, then execute the following command:

```console
pip install azure-communication-rooms
pip install azure-communication-identity
```

### Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```python
#Find your Communication Services resource in the Azure portal
self.connection_string = os.getenv("COMMUNICATION_CONNECTION_STRING") or <COMMUNICATION_SAMPLES_CONNECTION_STRING>
self.rooms_client = RoomsClient.from_connection_string(self.connection_string)
```

## Create a room

Create a new `room` with default properties using the code snippet below. When defining participants, if a role is not specified, then it will be set to `Attendee` as default.

```python
# Create a Room
valid_from = datetime.now()
valid_until = valid_from + relativedelta(months=+1)

# Create identities for users
identity_client = CommunicationIdentityClient.from_connection_string(connection_string)
user1 = identity_client.create_user_and_token(scopes=[CommunicationTokenScope.VOIP])
user2 = identity_client.create_user_and_token(scopes=["voip"])

participants = []
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 1>")))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 2>"), ParticipantRole.CONSUMER))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 3>"), ParticipantRole.PRESENTER))

try:
    create_room_response = self.rooms_client.create_room(
        valid_from=valid_from,
        valid_until=valid_until,
        participants=participants
    )
    print("\nCreated a room with id: " + create_room_response.id)
except HttpResponseError as ex:
    print(ex)
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `id` to view or update the properties of a `room` object.

## Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `id`:

```python
# Retrieves the room with corresponding ID
room_id = create_room_response.id
try:
    get_room_response = self.rooms_client.get_room(room_id=room_id)
    print("\nRetrieved room with id: ", get_room_response.id);

except HttpResponseError as ex:
    print(ex)
```

### List all created rooms

To retrieve all rooms created under your resource, use the `list_rooms` method exposed on the client.

```python
try:
    list_room_response = self.rooms_client.list_rooms()
except HttpResponseError as ex:
    print(ex)
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `valid_from` and `valid_until` parameters. A room can be valid for a maximum of six months.

```python
# set attributes you want to change
valid_from =  datetime.now()
valid_until = valid_from + relativedelta(months=+1,days=+20)

try:
    update_room_response = self.rooms_client.update_room(room_id=room_id, valid_from=valid_from, valid_until=valid_until)
except HttpResponseError as ex:
    print(ex)
```

### Add new participants

To add new participants or update existing participants in a `room`, use the `add_or_update_participants` method exposed on the client.

```python

# Add Participants
participants = []
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 1>")))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 2>"), ParticipantRole.ATTENDEE))
participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 3>"), ParticipantRole.CONSUMER))
try:
    participants = []
    participants.append(RoomParticipant(CommunicationUserIdentifier("<ACS User MRI identity 1>"), RoleType.ATTENDEE))
    self.rooms_client.add_participants(room_id, participants)
    print("\nAdded participants to room")

except Exception as ex:
    print('Error in adding participants to room.', ex)
```

Participants that have been added to a `room` become eligible to join calls.

### List participants in a room

Retrieve the list of participants for an existing `room` by referencing the `room_id`:

```python

# Get list of participants in room
try:
    participants = self.rooms_client.get_participants(room_id)
    print("\nRetrieved participants for room: ", participants)
except HttpResponseError as ex:
    print(ex)

```

## Remove participants

To remove a participant from a `room` and revoke their access, use the `remove_participants` method.

```python

# Remove Participants
participants = [CommunicationUserIdentifier(user2.properties['id'])]

try:
    remove_participants_response = self.rooms_client.remove_participants(room_id=room_id, participants=participants)
    print("\nRemoved participants from room")

except HttpResponseError as ex:
    print(ex)

```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```python
# Delete Room

self.rooms_client.delete_room(room_id=room)
print("\nDeleted room with id: " + room)

```

## Run the code

To run the code, make sure you are on the directory where your `index.js` file is.

```console

python rooms-quickstart.py

```


The expected output describes each completed action:

```console

Azure Communication Services - Rooms Quickstart

Created a room with id:  99445276259151407

Retrieved room with id:  99445276259151407

Updated room with validFrom:  2023-05-11T22:11:46.784Z  and validUntil:  2023-05-11T22:16:46.784Z

Added participants to room

Retrieved participants for room:  [
  {
    id: {
      kind: 'communicationUser',
      communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e901'
    },
    role: 'Attendee'
  },
  {
    id: {
      kind: 'communicationUser',
      communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7ccc-35f3-343a0d00e902'
    },
    role: 'Consumer'
  }
]

Removed participants from room

Deleted room with id:  99445276259151407

```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [Python SDK reference](/python/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
