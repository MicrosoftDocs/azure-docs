---
title: Datacenter locations - Translator Text API
titlesuffix: Azure Cognitive Services
description: Request a specific datacenter when using the Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: v-jansko
---

# Request a specific datacenter when using the Translator Text API

Microsoft Translator is served out of multiple datacenter locations. Currently they are located in 6 [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/regions):

* **Americas:** West US 2 and West Central US 
* **Asia Pacific:** Southeast Asia and Korea South
* **Europe:** North Europe and West Europe

Requests to the Microsoft Translator Text API are in most cases handled by the datacenter that is closest to where the request originated. In case of a datacenter failure, the request may be routed outside of the region.

To force the request to be handled by a specific datacenter, change the Global endpoint in the API request to the desired regional endpoint:

|Region|Endpoint|
|:--|:--|
|Global|	api.cognitive.microsofttranslator.com|
|North America|	api-nam.cognitive.microsofttranslator.com|
|Europe|	api-eur.cognitive.microsofttranslator.com|
|Asia Pacific|	api-apc.cognitive.microsofttranslator.com|


## Next steps
> [!div class="nextstepaction"]
> [Request a specific datacenter in your Translator API call](reference/v3-0-translate.md)