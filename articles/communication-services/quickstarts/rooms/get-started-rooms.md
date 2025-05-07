---
title: Quickstart - Create and manage a room resource
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to create a Room within your Azure Communication Services resource.
services: azure-communication-services
author: mayssamm
manager: alexokun

ms.author: mayssamm
ms.date: 02/27/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-azcli-js-csharp-java-python
---
# Quickstart: Create and manage a room resource

This quickstart helps you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and use cases for `rooms`.

## Object model

The following table lists the main properties of `room` objects:

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `roomId`              | Unique `room` identifier.                  |
| `validFrom`           | Earliest time a `room` can be used. |
| `validUntil`          | Latest time a `room` can be used. |
| `pstnDialOutEnabled`  | Enable or disable dialing out to a PSTN number in a room.|
| `participants`        | List of participants to a `room`. Specified as a `CommunicationUserIdentifier`. |
| `roleType`            | The role of a room participant. Can be `Presenter`, `Attendee`, `Consumer` or `Collaborator`. |

::: zone pivot="platform-azcli"
[!INCLUDE[Use rooms with Azure CLI](./includes/rooms-quickstart-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
This quickstart helps you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and use cases for `rooms`.

[!INCLUDE [Use rooms with .NET SDK](./includes/rooms-quickstart-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
This quickstart helps you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and use cases for `rooms`.

[!INCLUDE [Use rooms with Java SDK](./includes/rooms-quickstart-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
This quickstart helps you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and use cases for `rooms`.

[!INCLUDE [Use rooms with Python SDK](./includes/rooms-quickstart-python.md)]
::: zone-end

::: zone pivot="programming-language-javascript"

This quickstart helps you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a predetermined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and use cases for `rooms`.

[!INCLUDE [Use rooms with JavaScript SDK](./includes/rooms-quickstart-javascript.md)]
::: zone-end

## Next steps

You can learn how to [join a rooms call](join-rooms-call.md) after creating and configuring the room.

In this section you learned how to:
> [!div class="checklist"]
> - Create a new room
> - Get the properties of a room
> - Update the properties of a room
> - Delete a room

You may also want to:
 - Learn about [rooms concept](../../concepts/rooms/room-concept.md)
 - Learn about [voice and video calling concepts](../../concepts/voice-video-calling/about-call-types.md)
 - Review Azure Communication Services [samples](../../samples/overview.md)