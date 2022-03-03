---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services transform portal-->

## Create a transform

> [!IMPORTANT] 
> You must encode your files with a transform in order to stream them, even if they have been encoded locally.  The Media Services encoding process creates the manifest files needed for streaming.

You'll now create a transform that uses a Built-in preset, which is like a recipe for encoding.

1. Select **Transforms + jobs**.
1. Select **Add transform**. The Add transform screen will appear.
1. Enter a transform name in the **Transform name** field.
1. Select the **Encoding** radio button.
1. Select ContentAwareEncoding from the **Built-in preset name** dropdown list.
1. Select **Add**.
