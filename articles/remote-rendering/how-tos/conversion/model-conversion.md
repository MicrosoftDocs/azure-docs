---
title: Model conversion
description: Describes the process of converting a model for rendering
author: jakrams
ms.author: jakras
ms.date: 02/04/2020
ms.topic: how-to
---

# Convert models

Azure Remote Rendering allows you to render complex models. To achieve maximum performance, the data must be preprocessed to be in an optimal format. Depending on the amount of data, this step might take a while. It would be impractical, if this time was spent during model loading. Also, it would be wasteful to repeat this process for multiple sessions.
For these reasons, ARR service provides a dedicated *conversion service*, which you can run ahead of time.
Once converted, a model can be loaded from an Azure Storage Account.

## Supported source formats

The conversion service supports these formats:

### Triangular meshes

* **FBX**  (version 2011 to version 2020)
* **GLTF**/**GLB** (version 2.x)

There are minor differences between the formats regarding material property conversion, as listed in chapter [material mapping for model formats](../../reference/material-mapping.md).

### Point clouds

* **XYZ** : Text file format where every line contains a single point, formatted as `position_x position_y position_z red green blue`
* **PLY** : Only binary PLY files are supported. Properties other than position and color are ignored. Every PLY file has a human-readable header, which can be used to verify whether the following requirements are met:
  * file must be encoded using the `binary_little_endian 1.0` format,
  * file contains a point cloud (that is, no triangles),
  * positions contain all three components (x, y, z),
  * colors contain all three components (red, green, blue). Alternatively, color components can be specified through (diffuse_red, diffuse_green, diffuse_blue) or (ambient_red, ambient_green, ambient_blue) semantics.

  In case any other properties exist, they're ignored during ingestion.
* **E57** : E57 contains two types of data: `data3d` and `image2d`. The conversion service only loads the `data3d` part of the file, while the `image2d` part of the file is being ignored.
* **LAS**, **LAZ** : In case color data isn't present, the intensity attribute is used as color.

## The conversion process

1. [Prepare two Azure Blob Storage containers](blob-storage.md): one for input, one for output
1. Upload your model to the input container (optionally under a subpath)
1. Trigger the conversion process through [the model conversion REST API](conversion-rest-api.md)
1. Poll the service for conversion progress
1. Once finished, load a model
    - from a linked storage account (see the "Link storage accounts" steps on [Create an Account](../create-an-account.md#link-storage-accounts) to link your storage account)
    - or by providing a *Shared Access Signature (SAS)*.

All model data (input and output) is stored in user provided Azure blob storage. Azure Remote Rendering gives you full control over your asset management.

## Pricing

For information about pricing for conversion, refer to the [Remote Rendering pricing](https://azure.microsoft.com/pricing/details/remote-rendering) page.


## Conversion parameters

For the various conversion options, see [this chapter](configure-model-conversion.md).

## Examples

- [Quickstart: Convert a model for rendering](../../quickstarts/convert-model.md) is a step-by-step introduction how to convert a model.
- [Example PowerShell scripts](../../samples/powershell-example-scripts.md), which demonstrate the use of the conversion service, can be found in the [ARR samples repository](https://github.com/Azure/azure-remote-rendering) in the *Scripts* folder.

## Next steps

- [Use Azure Blob Storage for model conversion](blob-storage.md)
- [The model conversion REST API](conversion-rest-api.md)
- [Configuring the model conversion](configure-model-conversion.md)
- [Laying out files for conversion](layout-files-for-conversion.md)
- [Material mapping for model formats](../../reference/material-mapping.md)
