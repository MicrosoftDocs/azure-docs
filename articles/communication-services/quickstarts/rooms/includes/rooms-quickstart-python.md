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
mkdir acs-rooms-quickstart
cd acs-rooms-quickstart
```

### Install the package

You'll need to use the Azure Communication Rooms client library for Python [version 1.0.0](https://pypi.org/project/azure-communication-rooms/) or above.

From a console prompt, navigate to the directory containing the rooms.py file, then execute the following command:

```console
pip install azure-communication-rooms
```

### Set up the app framework

Create a new file called `rooms-quickstart.py` and add the basic program structure.

```python
import os
from datetime import datetime, timedelta
from azure.core.exceptions import HttpResponseError
from azure.communication.rooms import (
    RoomsClient,
    RoomParticipant,
    ParticipantRole
)

class RoomsQuickstart(object):
    print("Azure Communication Services - Rooms Quickstart")
    #room method implementations goes here

if __name__ == '__main__':
    rooms = RoomsQuickstart()
```

## Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```python
#Find your Communication Services resource in the Azure portal
connection_string = '<connection_string>'
rooms_client = RoomsClient.from_connection_string(connection_string)
```

## Create a room

### Set up room participants
In order to set up who can join a room, you'll need to have the list of the identities of those users. You can follow the instructions [here](../../identity/access-tokens.md?pivots=programming-language-python) for creating users and issuing access tokens. Alternatively, if you want to create the users on demand, you can create them using the `CommunicationIdentityClient`.

To use the `CommunicationIdentityClient`, install the following package:

```console
pip install azure-communication-identity
```

Also, import the namespace of the package at the top of your `rooms-quickstart.py` file:

```python
from azure.communication.identity import (
    CommunicationIdentityClient
)
```

Now, the `CommunicationIdentityClient` can be initialized and used to create users:

```python
# Create identities for users who will join the room
identity_client = CommunicationIdentityClient.from_connection_string(connection_string)
user1 = identity_client.create_user()
user2 = identity_client.create_user()
user3 = identity_client.create_user()
```

Then, create the list of room participants by referencing those users:

```python
participant_1 = RoomParticipant(communication_identifier=user1, role=ParticipantRole.PRESENTER)
participant_2 = RoomParticipant(communication_identifier=user2, role=ParticipantRole.CONSUMER)
participants = [participant_1, participant_2]
```

### Initialize the room
Create a new `room` using the `participants` defined in the code snippet above:

```python
# Create a room
valid_from = datetime.now()
valid_until = valid_from + timedelta(weeks=4)

try:
    create_room = rooms_client.create_room(
        valid_from=valid_from,
        valid_until=valid_until,
        participants=participants
    )
    print("\nCreated a room with id: " + create_room.id)
except HttpResponseError as ex:
    print(ex)
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `room.id` in the storage medium of choice. You can reference the `id` to view or update the properties of a `room` object.

## Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `id`:

```python
# Retrieves the room with corresponding ID
room_id = create_room.id
try:
    get_room = rooms_client.get_room(room_id=room_id)
    print("\nRetrieved room with id: ", get_room.id)
except HttpResponseError as ex:
    print(ex)
```

## Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `valid_from` and `valid_until` parameters. A room can be valid for a maximum of six months.

```python
# Update the lifetime of a room
valid_from =  datetime.now()
valid_until = valid_from + timedelta(weeks=7)

try:
    updated_room = rooms_client.update_room(room_id=room_id, valid_from=valid_from, valid_until=valid_until)
     print("\nUpdated room with validFrom: " + updated_room.valid_from + " and validUntil: " + updated_room.valid_until)
except HttpResponseError as ex:
    print(ex)
```

## List all active rooms

To retrieve all active rooms created under your resource, use the `list_rooms` method exposed on the client.

```python
# List all active rooms
try:
    rooms = rooms_client.list_rooms()
    count = 0
    for room in rooms:
        if count == 1:
            break
        print("\nPrinting the first room in list"
            "\nRoom Id: " + room.id +
            "\nCreated date time: " + str(room.created_at) +
            "\nValid From: " + str(room.valid_from) + "\nValid Until: " + str(room.valid_until))
        count += 1
except HttpResponseError as ex:
    print(ex)
```

## Add or update participants

To add new participants or update existing participants in a `room`, use the `add_or_update_participants` method exposed on the client.

```python
# Add or update participants in a room
try:
    # Update existing user2 from consumer to attendee
    participants = []
    participants.append(RoomParticipant(communication_identifier=user2, role=ParticipantRole.ATTENDEE))

    # Add new participant user3
    participants.append(RoomParticipant(communication_identifier=user3, role=ParticipantRole.CONSUMER))
    rooms_client.add_or_update_participants(room_id=room_id, participants=participants)
    print("\nAdd or update participants in room")

except HttpResponseError as ex:
    print('Error in adding or updating participants to room.', ex)
```

Participants that have been added to a `room` become eligible to join calls.

## List participants in a room

Retrieve the list of participants for an existing `room` by referencing the `room_id`:

```python
# Get list of participants in room
try:
    participants = rooms_client.list_participants(room_id)
    print('\nParticipants in Room Id :', room_id)
    for p in participants:
        print(p.communication_identifier.properties['id'], p.role)
except HttpResponseError as ex:
    print(ex)

```

## Remove participants

To remove a participant from a `room` and revoke their access, use the `remove_participants` method.

```python
# Remove Participants
try:
    participants = [user2]
    rooms_client.remove_participants(room_id=room_id, participants=participants)
    print("\nRemoved participants from room")

except HttpResponseError as ex:
    print(ex)

```

## Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```python
# Delete Room

rooms_client.delete_room(room_id=room_id)
print("\nDeleted room with id: " + room_id)

```

## Run the code

To run the code, make sure you are on the directory where your `rooms-quickstart.py` file is.

```console

python rooms-quickstart.py

```

The expected output describes each completed action:

```console

Azure Communication Services - Rooms Quickstart

Created a room with id:  99445276259151407

Retrieved room with id:  99445276259151407

Updated room with validFrom: 2023-05-03T00:00:00+00:00  and validUntil: 2023-06-23T00:00:00+00:00

Printing the first room in list
Room Id: 99445276259151407
Created date time: 2023-05-03T00:00:00+00:00
Valid From: 2023-05-03T00:00:00+00:00
Valid Until: 2023-06-23T00:00:00+00:00

Add or update participants in room

Participants in Room Id : 99445276259151407
8:acs:42a0ff0c-356d-4487-a288-ad0aad95d504_00000018-ef00-6042-a166-563a0d0051c1 Presenter
8:acs:42a0ff0c-356d-4487-a288-ad0aad95d504_00000018-ef00-6136-a166-563a0d0051c2 Consumer
8:acs:42a0ff0c-356d-4487-a288-ad0aad95d504_00000018-ef00-61fd-a166-563a0d0051c3 Attendee

Removed participants from room

Deleted room with id: 99445276259151407

```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [Python SDK reference](/python/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms/rooms).
