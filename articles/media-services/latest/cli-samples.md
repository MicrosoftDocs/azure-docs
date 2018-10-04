---
title: Azure CLI examples - Azure Media Services | Microsoft Docs
description: Azure CLI examples for Azure Media Services service
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 04/15/2018
ms.author: juliako
---

# Azure CLI examples for Azure Media Services

The following table includes links to the Azure CLI examples for Azure Media Services.

|  |  |
|---|---|
|**Account**||
| [Create a Media Services account](./scripts/cli-create-account.md) | Creates an Azure Media Services account. Also, creates a service principal that can be used to access APIs to programmatically manage the account. |
| [Reset account credentials](./scripts/cli-reset-account-credentials.md)|Resets your account credentials and gets the app.config settings back.|
|**Assets**||
| [Create assets](./scripts/cli-create-asset.md)|Creates a Media Services Asset to upload content to.|
| [Upload a file](./scripts/cli-upload-file-asset.md)|Uploads a local file to a storage container.|
| [Publish an asset](./scripts/cli-publish-asset.md)| Creates a  Streaming Locator and gets Streaming URLs back. |
| **Transforms** and **Jobs**||
| [Create transforms](./scripts/cli-create-transform.md)|Shows how to create transforms. Transforms describe a simple workflow of tasks for processing your video or audio files (often referred to as a "recipe").<br/> You should always check if a Transform with desired name and "recipe" already exist. If it does, reuse it. |
| [Create jobs](./scripts/cli-create-jobs.md)|Submits a Job to a simple encoding Transform using HTTPs URL.|
| [Create EventGrid](./scripts/cli-create-event-grid.md)|Creates an account level Event Grid subscription for Job State Changes.|

## See also

[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/ams?view=azure-cli-latest)
