---
title: Quickstart - Create and manage a media composition
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a media composition within your Azure Communication Services resource.
services: azure-communication-services
author: peiliu
manager: alexokun

ms.author: peiliu
ms.date: 08/18/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
zone_pivot_groups: acs-csharp
---
# Quickstart: Create and manage a media composition resource

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

::: zone pivot="programming-language-csharp"
[!INCLUDE [Use Media Composition with .NET SDK](./includes/media-comp-quickstart-net.md)]
::: zone-end

## Object model

The table below lists the main properties of media composition objects:

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `mediaCompositionId`  | Media composition identifier that can be a user-friendly string. Must be unique across a Communication Service resource. |
| `layout`              | Specifies how the media sources will be composed into a single frame. |
| `inputs`              | Defines which media sources will be used in the layout composition. |
| `outputs`             | Defines where to send the composed streams to.|

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Create a new media composition
> - Get the properties of a media composition
> - Update layout
> - Upsert and remove inputs
> - Upsert and remove outputs
> - Start and stop a media composition
> - Delete a media composition

You may also want to:
 - Learn about [media composition concept](../../concepts/voice-video-calling//media-comp.md)
 - Learn about [how to define a media composition](./define-media-composition.md)
