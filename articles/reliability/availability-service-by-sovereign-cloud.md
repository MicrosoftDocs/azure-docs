---
title: Availability of services by sovereign cloud
description: Learn how services are supported for each sovereign cloud
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/19/2022
ms.author: anaharris
ms.reviewer: cynthn
ms.custom: references_regions
---

# Availability of services by sovereign cloud  

Although availability of services across Azure regions depends on a region's type, there are public clouds that may not support or only partially support certain services. The article shows which services are available for regions of particular sovereign clouds.

Azure regional services are presented in the following tables by sovereign cloud. Note that some services are non-regional, which means that they're available globally regardless of region. Non-regional services are not mentioned in these tables. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


## Microsoft Azure operated by 21Vianet

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Cognitive Services in the Azure China environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
|Azure Machine learning| See [Azure Machine Learning feature availability across Azure in China cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet). | |
| Cognitive Services: Speech| See [Cognitive Services: Azure in China - Speech service](../cognitive-services/speech-service/sovereign-clouds.md?tabs=c-sharp.md#azure-china)  ||

### Media

This section outlines variations and considerations when using Media services in the Azure China environment.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Media Services | For Azure Media Services v3 feature variations in Azure Government, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#china).  |  

### Networking

This section outlines variations and considerations when using Networking services in the Azure China environment. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Private Link| <li>For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).<li>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government). |

### Azure in China REST endpoints

| REST endpoint | Global Azure | Azure China |
|---------------|--------------|------------------|
| Management plane |	`https://management.azure.com/` |	`https://management.chinacloudapi.cn/` |
| Data plane |	`https://{location}.experiments.azureml.net`	| `https://{location}.experiments.ml.azure`.cn |
| Azure Active Directory	| `https://login.microsoftonline.com`	 | `https://login.chinacloudapi.cn` |


