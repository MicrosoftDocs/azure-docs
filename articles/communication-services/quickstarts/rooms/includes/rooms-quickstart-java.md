---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/08/2022
ms.topic: include
ms.custom: include file
ms.author: antonsamson
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- [Java Development Kit (JDK)](/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/rooms-quickstart-java).

## Setting up

### Create a new Java application

In a console window (such as cmd, PowerShell, or Bash), use the `mvn` command below to create a new console app with the name `rooms-quickstart`. This command creates a simple "Hello World" Java project with a single source file: **App.java**.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

### Include the package

You'll need to use the Azure Communication Rooms client library for Java [version 1.0.0-beta.2](https://search.maven.org/artifact/com.azure/azure-communication-rooms/1.0.0-beta.2/jar) or above. 

#### Include the BOM file

Include the `azure-sdk-bom` to your project to take dependency on the General Availability (GA) version of the library. In the following snippet, replace the {bom_version_to_target} placeholder with the version number.
To learn more about the BOM, see the [Azure SDK BOM readme](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
and then include the direct dependency in the dependencies section without the version tag.

```xml
<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-rooms</artifactId>
  </dependency>
</dependencies>
```

#### Include direct dependency
If you want to take dependency on a particular version of the library that isn't present in the BOM, add the direct dependency to your project as follows.

[//]: # ({x-version-update-start;com.azure:azure-communication-rooms;current})
```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-rooms</artifactId>
  <version>1.0.0-beta.1</version>
</dependency>
```

### Set up app framework

Go to the /src/main/java/com/communication/quickstart directory and open the `App.java` file. Add the following code:

```java

package com.communication.quickstart;

import com.azure.communication.common.*;
import com.azure.communication.identity.*;
import com.azure.communication.identity.models.*;
import com.azure.core.credential.*;
import com.azure.communication.rooms.*;

import java.io.IOException;
import java.time.*;
import java.util.*;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Rooms Quickstart");
        // Quickstart code goes here
    }
}

```

## Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```java

// Initialize the rooms client
// Find your Communication Services resource in the Azure portal
String connectionString = "<connection string>";
RoomsClient roomsClient = new RoomsClientBuilder().connectionString(connectionString).buildClient();

// Create communication identities
CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .connectionString(connectionString)
    .buildClient();

List<CommunicationTokenScope> scopes = Arrays.asList(CommunicationTokenScope.VOIP);
CommunicationUserIdentifierAndToken result1 = communicationIdentityClient.createUserAndToken(scopes);
CommunicationUserIdentifier user1 = result1.getUser();
CommunicationUserIdentifierAndToken result2 = communicationIdentityClient.createUserAndToken(scopes);
CommunicationUserIdentifier user2 = result2.getUser();


```

## Create a room

Create a new `room` with default properties using the code snippet below:

```java

// Create room
OffsetDateTime validFrom = OffsetDateTime.now();
OffsetDateTime validUntil = validFrom.plusDays(30);
RoomJoinPolicy roomJoinPolicy = RoomJoinPolicy.INVITE_ONLY;

List<RoomParticipant> roomParticipants = new ArrayList<RoomParticipant>();

roomParticipants.add(new RoomParticipant().setCommunicationIdentifier(new CommunicationUserIdentifier(user1.getId())).setRole(RoleType.CONSUMER));

CommunicationRoom roomCreated = roomsClient.createRoom(
    validFrom,
    validUntil,
    roomJoinPolicy,
    roomParticipants
);

System.out.println("\nCreated a room with id: " + roomCreated.getRoomId());

```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

## Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```java

// Retrieve the room with corresponding ID
CommunicationRoom roomResult = roomsClient.getRoom(roomId);
System.out.println("\nRetrieved room with id: " + roomResult.getRoomId());

```

## Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```java

// Update room lifetime
OffsetDateTime validFrom = OffsetDateTime.now().plusDays(1);
OffsetDateTime validUntil = validFrom.plusDays(1);

CommunicationRoom roomResult = roomsClient.updateRoom(roomId, validFrom, validUntil);

System.out.println("\nUpdated room with validFrom: " + roomResult.getValidFrom() + " and validUntil: " + roomResult.getValidUntil());

```

## Add new participants

To add new participants to a `room`, use the `addParticipants` method exposed on the client.

```java

// Add participants to room
RoomParticipant newParticipant = new RoomParticipant(new CommunicationUserIdentifier(user2.getId())).setRole(RoleType.CONSUMER)
AddOrUpdateParticipantsResult updatedParticipants = roomsClient.addOrUpdateParticipants(roomId, List.of(newParticipant));
System.out.println("\nAdded participants to room:")

```

Participants that have been added to a `room` become eligible to join calls.

## Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```java

// Get list of participants
try {
     ParticipantsCollection participants = roomsClient.getParticipants(roomId);
     System.out.println("Participants: \n" + listParticipantsAsString(participants.getParticipants()));
} catch (Exception ex) {
    System.out.println(ex);
}

```

## Remove participants

To remove a participant from a `room` and revoke their access, use the `removeParticipants` method.

```java

// Remove a participant from the room
RoomParticipant existingParticipant = new RoomParticipant().setCommunicationIdentifier(new CommunicationUserIdentifier(user1.getId()));
emoveParticipantsResult removedParticipants = roomsAsyncClient.removeParticipants(roomId, Arrays.asList(existingParticipant.getCommunicationIdentifier()););
System.out.println("\nRemoved participants from room")

```

## Delete room

If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```java

// Deletes the specified room
roomsClient.deleteRoomWithResponse(roomId, Context.NONE);
System.out.println("\nDeleted the room with ID: " + roomId);

```

## Run the code

To run the code, go to the directory that contains the `pom.xml` file and compile the program.

```console

mvn compile

```

Then, build the package:

```console

mvn package

```

Execute the app

```console

mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false

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

Read about the full set of capabilities of Azure Communication Services rooms from the [Java SDK reference](/java/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
