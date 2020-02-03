---
title: Sample model
description: Lists SAS-URIs of the ARR sample model.
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 01/29/2020
ms.topic: sample
ms.service: azure-remote-rendering
---

# Sample model

A sample model is provided that can be used to test the Azure Remote Rendering service. This model has been converted to the proprietary binary format (*.arrAsset*) so it is ready to be used via a SAS URI.

For best loading performance, pick the SAS URI from the region that is used to initialize the rendering service.

| Location | SAS URI |
|-----------|:-----------|
| West US | https://arrprodwestus2samples.blob.core.windows.net/samples/Engine.arrAsset?st=2020-01-30T11%3A50%3A03Z&se=2025-01-31T11%3A50%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=7tmSFKrYC8Dj%2BiqnWtxQTciLu8V4dRLVd6xapGt%2FpPg%3D
| West Europe | https://arrprodwesteuropesamples.blob.core.windows.net/samples/Engine.arrAsset?st=2020-01-30T11%3A49%3A34Z&se=2025-01-31T11%3A49%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=nIog2A3%2F7yqhrwXbTkrHpFCp%2FugUXwKUkg3DxO5lc4E%3D

![Sample model](./media/sample-model.png "Sample model")

## See also

* [Khronos Group glTF sample models](https://github.com/KhronosGroup/glTF-Sample-Models)
* [Quickstart: Render a model with Unity](../quickstarts/quickstart-render-model.md)
