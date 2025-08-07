---
title: Create a room
titleSuffix: An Azure Communication Services article
description: This article describes how to create a Room within your Azure Communication Services resource.
services: azure-communication-services
author: mayssamm
manager: alexokun

ms.author: mayssamm
ms.date: 06/02/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-azcli-js-csharp-java-python
---
# Create a room resource

This article describes how to create a Room within your Azure Communication Services resource. A room is a server-managed communications space for a known, fixed, set of participants to collaborate for a predetermined duration. For more information and use cases, see [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).

## Object model

The following table lists the main properties of room objects:

| Name | Description |
| --- | --- |
| `roomId`              | Unique room identifier. |
| `validFrom`           | Earliest time a room can be used. |
| `validUntil`          | Latest time a room can be used. |
| `pstnDialOutEnabled`  | Enable or disable dialing out to a public switched telephone network (PSTN) number from a room.|
| `participants`        | List of participants in a room. Specified as a `CommunicationUserIdentifier`. |
| `roleType`            | The role of a room participant. Can be `Presenter`, `Attendee`, `Consumer`, or `Collaborator`. |

::: zone pivot="platform-azcli"
[!INCLUDE[Use rooms with Azure CLI](./includes/rooms-quickstart-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"

A room is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. For more information, see [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).

[!INCLUDE [Use rooms with .NET SDK](./includes/rooms-quickstart-net.md)]
::: zone-end

::: zone pivot="programming-language-java"

A room is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. For more information, see [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).

[!INCLUDE [Use rooms with Java SDK](./includes/rooms-quickstart-java.md)]
::: zone-end

::: zone pivot="programming-language-python"

A room is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. For more information, see [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).

[!INCLUDE [Use rooms with Python SDK](./includes/rooms-quickstart-python.md)]
::: zone-end

::: zone pivot="programming-language-javascript"

A room is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. For more information, see [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).

[!INCLUDE [Use rooms with JavaScript SDK](./includes/rooms-quickstart-javascript.md)]
::: zone-end

## Next steps

You can learn how to [join a rooms call](join-rooms-call.md) after creating and configuring the room.

This article described how to:
> [!div class="checklist"]
> - Create a new room
> - Get the properties of a room
> - Update the properties of a room
> - Delete a room

## Related articles

 - [Rooms API for structured meetings](../../concepts/rooms/room-concept.md).
 - [Voice and video calling concepts](../../concepts/voice-video-calling/about-call-types.md).
 - [Azure Communication Services samples](../../samples/overview.md).
 