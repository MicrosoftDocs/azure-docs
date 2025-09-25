---
title: include file
description: include file
services: azure-communication-services
author: mayssamm
manager: alexokun

ms.service: azure-communication-services
ms.date: 05/15/2025
ms.topic: include
ms.author: mayssamm
ms.custom:
  - include file
  - sfi-ropc-nochange
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- [Java Development Kit (JDK)](/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Sample code

Review and download the sample code for from GitHub at [Azure Communication Services - Rooms - Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/rooms-quickstart-java).

## Set up

### Create a new Java application

In a console window (such as cmd, PowerShell, or Bash), use the `mvn` command to create a new console app with the name `rooms-quickstart`. This command creates a simple "Hello World" Java project with a single source file: **App.java**.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

### Include the package

You need to use the Azure Communication Rooms client library for Java [version 1.1.0](https://search.maven.org/artifact/com.azure/azure-communication-rooms/1.1.0/jar) or above.

#### Include the BOM file

Include the `azure-sdk-bom` to your project to take dependency on the General Availability (GA) version of the library. In the following snippet, replace the {bom_version_to_target} placeholder with the version number.

To learn more about the Bill of Materials (BOM), see the [Azure SDK BOM readme](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

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
Then include the direct dependency in the dependencies section without the version tag.

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

Go to the `/src/main/java/com/communication/quickstart` directory and open the `App.java` file. Add the following code:

```java

package com.communication.rooms.quickstart;

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

Create a new `RoomsClient` object that you need to create new rooms and manage their properties and lifecycle. Use the connection string of your Communications Service to authenticate the request. For more information on connection strings, see [Create communication resource](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```java

// Initialize the rooms client
// Find your Communication Services resource in the Azure portal
String connectionString = "<connection string>";
RoomsClient roomsClient = new RoomsClientBuilder().connectionString(connectionString).buildClient();

```

## Create a room

### Set up room participants

To set up who can join a room, you need to have the list of the identities of those users. Follow the instructions at [Access tokens](../../identity/access-tokens.md?pivots=programming-language-java) to create users and issue access tokens. Alternatively, if you want to create the users on demand, you can create them using the `CommunicationIdentityClient`. Azure Communication Services Rooms currently supports a room participant of type `CommunicationUserIdentifier` only, using other types of `CommunicationIdentity` causes a runtime error.

To use `CommunicationIdentityClient`, add the following package:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-identity</artifactId>
</dependency>
```

Import the package on top on your `App.java` file:
```java
import com.azure.communication.identity.CommunicationIdentityClient;
import com.azure.communication.identity.CommunicationIdentityClientBuilder;
```

Now, initialize `CommunicationIdentityClient` and use it to create users:

```java
CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .connectionString(connectionString)
    .buildClient();

CommunicationUserIdentifier user1 = communicationClient.createUser();
CommunicationUserIdentifier user2 = communicationClient.createUser();
CommunicationUserIdentifier user3 = communicationClient.createUser();
```

Then, create the list of room participants by referencing those users:

```java
//The default participant role is ParticipantRole.Attendee
RoomParticipant participant_1 = new RoomParticipant(user1);
RoomParticipant participant_2 = new RoomParticipant(user2);
RoomParticipant participant_3 = new RoomParticipant(user3);

List<RoomParticipant> roomParticipants = new ArrayList<RoomParticipant>();

roomParticipants.add(participant_1);
roomParticipants.add(participant_2.setRole(ParticipantRole.CONSUMER));
```

### Initialize the room

Create a new room using the `roomParticipants` defined in the preceding code snippet:

```java
OffsetDateTime validFrom = OffsetDateTime.now();
OffsetDateTime validUntil = validFrom.plusDays(30);
boolean pstnDialOutEnabled = false;

CreateRoomOptions createRoomOptions = new CreateRoomOptions()
    .setValidFrom(validFrom)
    .setValidUntil(validUntil)
    .setPstnDialOutEnabled(pstnDialOutEnabled)
    .setParticipants(roomParticipants);

CommunicationRoom roomCreated = roomsClient.createRoom(createRoomOptions);

System.out.println("\nCreated a room with id: " + roomCreated.getRoomId());

```

Rooms are server-side entities, so you should keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a room object.

### Enable PSTN dial out capability for a room

Each room has PSTN dial out disabled by default. The PSTN dial out can be enabled for a room at creation, by defining the `pstnDialOutEnabled` parameter as true. You can change this capability  for a room by issuing an update request for the `pstnDialOutEnabled` parameter.

```java
boolean pstnDialOutEnabled = true;
// Create a room with PSTN dial out capability
CreateRoomOptions createRoomOptions = new CreateRoomOptions()
    .setPstnDialOutEnabled(pstnDialOutEnabled)

CommunicationRoom roomCreated = roomsClient.createRoom(createRoomOptions);
System.out.println("\nCreated a room with PSTN dial out enabled: " + roomCreated.getPstnDialOutEnabled());

// Update a room to enable or disable PSTN dial out capability
pstnDialOutEnabled = false;
UpdateRoomOptions updateRoomOptions = new UpdateRoomOptions()
    .setPstnDialOutEnabled(pstnDialOutEnabled);

CommunicationRoom roomUpdated = roomsClient.updateRoom(roomId, updateRoomOptions);
System.out.println("\nUpdated a room with PSTN dial out enabled: " + roomUpdated.getPstnDialOutEnabled());

```

## Get properties of an existing room

Retrieve the details of an existing room by referencing the `roomId`:

```java

// Retrieve the room with corresponding ID
CommunicationRoom roomResult = roomsClient.getRoom(roomId);

System.out.println("Retrieved room with id: " + roomResult.getRoomId());
```

## Update the lifetime of a room

You can change the lifetime of a room by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```java

OffsetDateTime validFrom = OffsetDateTime.now().plusDays(1);
OffsetDateTime validUntil = validFrom.plusDays(1);
boolean pstnDialOutEnabled = true;

UpdateRoomOptions updateRoomOptions = new UpdateRoomOptions()
    .setValidFrom(validFrom)
    .setValidUntil(validUntil)
    .setPstnDialOutEnabled(pstnDialOutEnabled);

CommunicationRoom roomResult = roomsClient.updateRoom(roomId, updateRoomOptions);

System.out.println("Updated room with validFrom: " + roomResult.getValidFrom() + ", validUntil: " + roomResult.getValidUntil() + " and pstnDialOutEnabled: " + roomResult.getPstnDialOutEnabled());
```

## Add or update participants

To add or update participants to a room, use the `addOrUpdateParticipants` method exposed on the client.

```java

List<RoomParticipant> participantsToAddAOrUpdate = new ArrayList<>();

// Updating current participant
participantsToAddAOrUpdate.add(participant_1.setRole(ParticipantRole.PRESENTER));

// Adding new participant
 participantsToAddAOrUpdate.add(participant_3.setRole(ParticipantRole.COLLABORATOR));

AddOrUpdateParticipantsResult addOrUpdateParticipantsResult = roomsClient.addOrUpdateParticipants(roomId, participantsToAddAOrUpdate);

System.out.println("Participant(s) added/updated");

```

Once you add participants to a room, they're eligible to join calls.

## Get list of participants

Retrieve the list of participants for an existing room by referencing the `roomId`:

```java

// Get list of participants
try {

PagedIterable<RoomParticipant> participants = roomsClient.listParticipants(roomId);

System.out.println("Participants:/n");

for (RoomParticipant participant : participants) {
    System.out.println(participant.getCommunicationIdentifier().getRawId() + " (" + participant.getRole() + ")");
   }
} catch (Exception ex) {
    System.out.println(ex);
}

```

## Remove participants

To remove a participant from a room and revoke their access, use the `removeParticipants` method.

```java

// Remove a participant from the room
List<CommunicationIdentifier> participantsToRemove = new ArrayList<>();

participantsToRemove.add(participant_3.getCommunicationIdentifier());

RemoveParticipantsResult removeParticipantsResult = roomsClient.removeParticipants(roomId,participantsToRemove);

System.out.println("Participant(s) removed");

```

### List all active rooms

Retrieve all active rooms under your Azure Communication Services resource.

```java
try {
    Iterable<PagedResponse<CommunicationRoom>> roomPages = roomsClient.listRooms().iterableByPage();

    System.out.println("Listing all the rooms IDs in the first two pages of the list of rooms:");

    int count = 0;
    for (PagedResponse<CommunicationRoom> page : roomPages) {
        for (CommunicationRoom room : page.getElements()) {
            System.out.println("\n" + room.getRoomId());
        }

        count++;
        if (count >= 2) {
            break;
        }
    }
} catch (Exception ex) {
    System.out.println(ex);
}
```

## Delete room

To disband an existing room, issue an explicit delete request. All rooms and their associated resources are automatically deleted at the end of their validity plus a grace period.

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

Execute the app.

```console
mvn exec:java -D"exec.mainClass"="com.communication.rooms.quickstart" -D"exec.cleanupDaemonThreads"="false"
```

The expected output describes each completed action:

```console
Azure Communication Services - Rooms Quickstart

Created a room with id:  99445276259151407

Retrieved room with id:  99445276259151407

Updated room with validFrom: 2023-05-11T22:11:46.784Z, validUntil: 2023-05-11T22:16:46.784Z and pstnDialOutEnabled: true

Participant(s) added/updated

Participants:
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e901 (Presenter)
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e902 (Consumer)
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e903 (Collaborator)

Participant(s) removed

Listing all the rooms IDs in the first two pages of the list of rooms: 
99445276259151407
99445276259151408
99445276259151409

Deleted the room with ID:  99445276259151407
```

## Reference articles

Read about the full set of capabilities of Azure Communication Services rooms from the [Java SDK reference](/java/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms/rooms).