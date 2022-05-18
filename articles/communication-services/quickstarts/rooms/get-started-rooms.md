---
title: Quickstart - Create and manage a `room` resource
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a Room within your Azure Communication Services resource.
author: radubulboaca
manager: mariusu
services: azure-communication-services

ms.author: radubulboaca
ms.date: 11/19/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
zone_pivot_groups: acs-csharp-java
---
# Quickstart: Create and manage a room resource

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

This quickstart will help you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a pre-determined duration. The [rooms conceptual documentation](../../concepts/rooms/room-concept.md) covers more details and potential use cases for `rooms`.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Use rooms with .NET SDK](./includes/rooms-quickstart-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Use rooms with Java SDK](./includes/rooms-quickstart-java.md)]
::: zone-end

## Object model

The table below lists the main properties of `room` objects: 

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `roomId`              | Unique `room` identifier.                  |
| `ValidFrom`           | Earliest time a `room` can be used. | 
| `ValidUntil`          | Latest time a `room` can be used. |
| `Participants`        | List of pre-existing participant IDs.       | 

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Create a new room
> - Get the properties of a room
> - Update the properties of a room
> - Join a room call
> - Delete a room

You may also want to:
 - Learn about [rooms concept](../../concepts/rooms/room-concept.md)
 - Learn about [voice and video calling concepts](../../concepts/voice-video-calling/about-call-types.md)
 - Review Azure Communication Services [samples](../../samples/overview.md)
