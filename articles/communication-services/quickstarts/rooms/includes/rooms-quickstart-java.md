---
title: include file
description: include file
services: azure-communication-services
author: mrayyan
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 04/25/2023
ms.topic: include
ms.custom: include file
ms.author: mrayyan
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Two or more Communication User Identities. [Create and manage access tokens](../../identity/access-tokens.md?pivots=programming-language-java) or [Quick-create identities for testing](../../identity/quick-create-identity.md).
- [Java Development Kit (JDK)](/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/rooms-quickstart-java).

## Setting up

### Create a new Java application

In a console window (such as cmd, PowerShell, or Bash), use the `mvn` command below to create a new console app with the name `rooms-quickstart`. This command creates a simple "Hello World" Java project with a single source file: **App.java**.

```console
mvn archetype:generate -DgroupId=com.contoso.app -DartifactId=rooms-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

### Include the package

You'll need to use the Azure Communication Rooms client library for Java [version 1.0.0-beta.3](https://search.maven.org/artifact/com.azure/azure-communication-rooms/1.0.0-beta.3/jar) or above. 

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

### Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```java
// Find your Communication Services resource in the Azure portal
String connectionString = "<connection string>";
RoomsClient roomsClient = new RoomsClientBuilder().connectionString(connectionString).buildClient();

// Set communication user id
static String USER_ID_1 = "<communication-user-id-1>";
static String USER_ID_2 = "<communication-user-id-2>";
static String USER_ID_3 = "<communication-user-id-3>";
```

### Create a room

Create a new `room` with default properties using the code snippet below:

```java
OffsetDateTime validFrom = OffsetDateTime.now();
OffsetDateTime validUntil = validFrom.plusDays(30);

List<RoomParticipant> roomParticipants = new ArrayList<RoomParticipant>();

roomParticipants.add(new RoomParticipant(new CommunicationUserIdentifier(USER_ID_1)).setRole(ParticipantRole.ATTENDEE));
roomParticipants.add(new RoomParticipant(new CommunicationUserIdentifier(USER_ID_2)).setRole(ParticipantRole.CONSUMER));

CreateRoomOptions roomOptions = new CreateRoomOptions()
    .setValidFrom(validFrom)
    .setValidUntil(validUntil)
    .setParticipants(roomParticipants);

return roomsClient.createRoom(roomOptions);
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```java
CommunicationRoom roomResult = roomsClient.getRoom(roomId);
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```java
OffsetDateTime validFrom = OffsetDateTime.now().plusDays(1);
OffsetDateTime validUntil = validFrom.plusDays(1);

UpdateRoomOptions updateRoomOptions = new UpdateRoomOptions()
    .setValidFrom(validFrom)
    .setValidUntil(validUntil);

CommunicationRoom roomResult = roomsClient.updateRoom(roomId, updateRoomOptions);
```

### Add or Update new participants

To add new participants or update exisiting participant to a `room`, use the `addOrUpdateParticipants` method exposed on the client.

```java
List<RoomParticipant> participantsToAddOrUpdate = new ArrayList<>();

// New participant to add
participantsToAddOrUpdate.add(new RoomParticipant(new CommunicationUserIdentifier(USER_ID_3)).setRole(ParticipantRole.PRESENTER));

// Existing participant to update from Consumer -> Attendee
participantsToAddOrUpdate.add(new RoomParticipant(new CommunicationUserIdentifier(USER_ID_2)).setRole(ParticipantRole.ATTENDEE));

AddOrUpdateParticipantsResult addOrUpdateResult = roomsClient.addOrUpdateParticipants(roomId, participantsToAddOrUpdate);  
```

Participants that have been added to a `room` become eligible to join calls.

### Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```java
try {
     PagedIterable<RoomParticipant> participants = roomsClient.listParticipants(roomId);
      for (RoomParticipant participant : participants) {
         System.out.println(participant.getCommunicationIdentifier().getRawId() + " (" + participant.getRole() + ")");
     }
} catch (Exception ex) {
    System.out.println(ex);
}
```

### Remove participants

To remove a participant from a `room` and revoke their access, use the `removeParticipants` method.

```java

List<CommunicationIdentifier> participantsToRemove = new ArrayList<>();

participantsToRemove.add(participant1.getCommunicationIdentifier());
participantsToRemove.add(participant2.getCommunicationIdentifier());

RemoveParticipantsResult removeResult = roomsClient.removeParticipants(roomId, participantsToRemove);
```

### Delete room

If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```java
roomsClient.deleteRoomWithResponse(roomId, Context.NONE);
```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [Java SDK reference](/java/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
