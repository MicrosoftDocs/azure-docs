---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to Azure Media Services v3 frequently asked questions.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 05/08/2018
ms.author: juliako
---

# Azure Media Services v3 (preview) frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## Can I use the Azure portal to manage v3 resources?

Not yet. You can use one of the supported SDKs. Find samples [here](https://github.com/johndeu/BUILD2018)

## Is there an API for configuring Media Reserved Units?

The Media Services team is eliminating RUs in v3. However the necessary service work is not complete. Until then, customers have to use the Azure portal or AMS v2 APIs to set RUs (as described in [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

S3 RUs are necessary for the **VideoAnalyzerPreset** and **AudioAnalyzerPreset** V3 presets.

## Does V3 Asset have no AssetFile concept?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

## Next steps

> [!div class="nextstepaction"]
> [Media Services v3 overview](media-services-overview.md)
