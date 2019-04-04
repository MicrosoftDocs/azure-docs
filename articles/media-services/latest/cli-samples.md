---
title: Azure CLI examples - Azure Media Services | Microsoft Docs
description: Azure CLI examples for Azure Media Services service
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 03/11/2019
ms.author: juliako
ms.custom: seodec18

---

# Azure CLI examples for Azure Media Services

The following table includes links to the Azure CLI examples for Azure Media Services.

## Examples

|  |  |
|---|---|
|**Scale**||
| [Scale Media Reserved Units](media-reserved-units-cli-how-to.md)|For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. <br/>The script shows how to use CLI to scale Media Reserved Units (MRUs).|
|**Account**||
| [Create a Media Services account](create-account-cli-how-to.md) | The script creates an Azure Media Services account. |
| [Reset account credentials](./scripts/cli-reset-account-credentials.md)|Resets your account credentials and gets the app.config settings back.|
|**Assets**||
| [Create assets](./scripts/cli-create-asset.md)|Creates a Media Services Asset to upload content to.|
| [Upload a file](./scripts/cli-upload-file-asset.md)|Uploads a local file to a storage container.|
| **Transforms** and **Jobs**||
| [Create transforms](./scripts/cli-create-transform.md)|Shows how to create transforms. Transforms describe a simple workflow of tasks for processing your video or audio files (often referred to as a "recipe").<br/> You should always check if a Transform with a desired name and "recipe" already exist. If it does, reuse it. |
| [Encode with a custom transform](custom-preset-cli-howto.md) | Shows how to build a custom preset to target your specific scenario or device requirements.|
| [Create jobs](./scripts/cli-create-jobs.md)|Submits a Job to a simple encoding Transform using HTTPs URL.|
| [Create EventGrid](./scripts/cli-create-event-grid.md)|Creates an account level Event Grid subscription for Job State Changes.|
| **Deliver**||
| [Publish an asset](./scripts/cli-publish-asset.md)| Creates a  Streaming Locator and gets Streaming URLs back. |
| [Filter](filters-dynamic-manifest-cli-howto.md)| Configures a filter for a Video on-Demand asset and shows how to use CLI to create [Account Filters](https://docs.microsoft.com/cli/azure/ams/account-filter?view=azure-cli-latest) and [Asset Filters](https://docs.microsoft.com/cli/azure/ams/asset-filter?view=azure-cli-latest). 

## See also

- [Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
- [Quickstart: Stream video files - CLI](stream-files-cli-quickstart.md)
