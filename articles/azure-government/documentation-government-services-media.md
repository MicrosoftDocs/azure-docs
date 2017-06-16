---
title: Azure Government Media Services | Microsoft Docs
description: This article provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: juliako
manager: erikre

ms.assetid: 1143caf9-b9b0-4a07-ae51-1d0b88022c17
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/13/2017
ms.author: juliako

---
# Azure Government Media Services 
 
For details on this service and how to use it, see the [Azure Media Services documentation](../media-services/index.md).

Azure Media Services (AMS) is currently generally available in Azure Government.

## Connecting  

For information on how to connect to AMS, see [connecting with .NET](../media-services/media-services-dotnet-connect-programmatically.md) or [connecting with REST](../media-services/media-services-rest-connect-programmatically.md) topic.

When connecting to Media Services in Azure Government, use the following values:

### ACS scope

The context scope should be set to "urn:WindowsAzureMediaServices".

### ACS

The ACS base address should be set to "https://ams-usge-0-acs-global-1-1.accesscontrol.usgovcloudapi.net"

### REST endpoints

The API server address depends on what region you are deployed to:

- US Gov Virginia: "https://ams-usge-1-hos-rest-1-1.usgovcloudapp.net/API/"
- US Gov Iowa: "https://ams-usgc-1-hos-rest-1-1.usgovcloudapp.net/API/"

## Analyzing

The "Azure Media Indexer 2 Preview" Azure Media Analytics media processor is not available in Azure Government.
 
## CDN integration

There is no CDN integration with streaming endpoints in Azure Government DCs.

## Next Steps
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

