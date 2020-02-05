---
title: Model conversion
description: Describes the process of converting a model for rendering
author: jakrams
ms.author: jakras
ms.date: 02/04/2020
ms.topic: how-to
---

# Model conversion

Azure Remote Rendering allows you to render very complex models. To achieve this, the data must be preprocessed to be in an optimal format. Depending on the amount of data, this step can take a while. It would be impractical, if this time was spent during model loading. Also, it would be wasteful to repeat this process for multiple sessions. Therefore the ARR service provides a dedicated *conversion service*, which you can run ahead of time. Afterwards, to use a model, all you need to do is to provide a SAS URI to your converted model.

## Supported source formats

At this time, the conversion service supports these formats:

- **FBX**  (version 2011 and above)
- **GLTF** (version 2.x)
- **GLB**  (version 2.x)

## The conversion process

1. [Prepare two Azure Blob Storage containers](blob-storage.md): one for input, one for output
1. Upload your model to the input container
1. Trigger the conversion process through [the model conversion REST API](conversion-rest-api.md)
1. Poll the service for progress
1. Once finished, retrieve a SAS URI for the converted model

All model data (input and output) is stored in user provided Azure blob storage. Azure Remote Rendering gives you full control over your asset management.

## Conversion parameters

For the various conversion options, see [this chapter](configure-model-conversion.md).

## Examples

- [Quickstart: Convert a model for rendering](../../quickstarts/convert-model.md) is a step-by-step introduction how to convert a model.
- [Example PowerShell scripts](../../samples/powershell-example-scripts.md), which demonstrate the use of the conversion service, can be found in the [arrClient repository](https://dev.azure.com/arrClient/arrClient/_git/arrClient) in the *Scripts* folder.

## Next steps

- [Using Azure Blob Storage for model conversion](blob-storage.md)
- [The model conversion REST API](conversion-rest-api.md)
- [Configuring the model conversion](configure-model-conversion.md)
