---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Storage accounts in Azure Media Services | Microsoft Docs
description: This article gives explanation of how Media Services uses storage accounts. 
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/14/2018
ms.author: apimpm
---

# Storage accounts

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. You can have two storage accounts associated with your Media Services account: **Primary** and **Secondary**. 

## Storage account types

### Primary

Media Services relies on tables and queues as well as blobs to store [assets](assets-concept.md) and metadata. The primary storage account can only be General Purpose v1. 

### Secondary

Blob-only storage accounts can be added as secondary storage accounts. The secondary storage account can be General Purpose v1 or v2. 

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
