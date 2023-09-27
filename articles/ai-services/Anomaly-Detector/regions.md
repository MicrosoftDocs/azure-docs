---
title: Regions - Anomaly Detector service
titleSuffix: Azure AI services
description: A list of available regions and endpoints for the Anomaly Detector service, including Univariate Anomaly Detection and Multivariate Anomaly Detection.
services: cognitive-services
author: jr-MS
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: conceptual
ms.date: 11/1/2022
ms.author: jingruhan
ms.custom: references_regions
---

# Anomaly Detector service supported regions

The Anomaly Detector service provides anomaly detection technology on your time series data. The service is available in multiple regions with unique endpoints for the Anomaly Detector SDK and REST APIs.

Keep in mind the following points:

* If your application uses one of the Anomaly Detector service REST APIs, the region is part of the endpoint URI you use when making requests.
* Keys created for a region are valid only in that region. If you attempt to use them with other regions, you will get authentication errors.

> [!NOTE]
> The Anomaly Detector service doesn't store or process customer data outside the region the customer deploys the service instance in.

## Univariate Anomaly Detection

The following regions are supported for Univariate Anomaly Detection. The geographies are listed in alphabetical order.

| Geography | Region | Region identifier |
| ----- | ----- | ----- |
| Africa | South Africa North | `southafricanorth`  |
| Asia Pacific | East Asia | `eastasia`  |
| Asia Pacific | Southeast Asia | `southeastasia` |
| Asia Pacific | Australia East | `australiaeast` |
| Asia Pacific | Central India | `centralindia` |
| Asia Pacific | Japan East | `japaneast` |
| Asia Pacific | Japan West | `japanwest` |
| Asia Pacific | Jio India West | `jioindiawest` |
| Asia Pacific | Korea Central | `koreacentral`  |
| Canada | Canada Central | `canadacentral`  |
| China | China East 2 | `chinaeast2`  |
| China | China North 2 | `chinanorth2`  |
| Europe | North Europe | `northeurope` |
| Europe | West Europe | `westeurope` |
| Europe | France Central | `francecentral` |
| Europe | Germany West Central | `germanywestcentral` |
| Europe | Norway East | `norwayeast` |
| Europe | Switzerland North | `switzerlandnorth`  |
| Europe | UK South | `uksouth` |
| Middle East | UAE North | `uaenorth`  |
| Qatar  | Qatar Central | `qatarcentral` |
| South America | Brazil South | `brazilsouth`  |
| Sweden | Sweden Central | `swedencentral`  |
| US | Central US | `centralus` |
| US | East US | `eastus` |
| US | East US 2 | `eastus2` |
| US | North Central US | `northcentralus` |
| US | South Central US | `southcentralus` |
| US | West Central US | `westcentralus`  |
| US | West US | `westus`|
| US | West US 2 | `westus2` |
| US | West US 3 | `westus3` |

## Multivariate Anomaly Detection

The following regions are supported for Multivariate Anomaly Detection. The geographies are listed in alphabetical order.

| Geography | Region | Region identifier |
| ----- | ----- | ----- |
| Africa | South Africa North | `southafricanorth`  |
| Asia Pacific | East Asia | `eastasia`  |
| Asia Pacific | Southeast Asia | `southeastasia` |
| Asia Pacific | Australia East | `australiaeast` |
| Asia Pacific | Central India | `centralindia` |
| Asia Pacific | Japan East | `japaneast` |
| Asia Pacific | Jio India West | `jioindiawest` |
| Asia Pacific | Korea Central | `koreacentral`  |
| Canada | Canada Central | `canadacentral`  |
| Europe | North Europe | `northeurope` |
| Europe | West Europe | `westeurope` |
| Europe | France Central | `francecentral` |
| Europe | Germany West Central | `germanywestcentral` |
| Europe | Norway East | `norwayeast` |
| Europe | Switzerland North | `switzerlandnorth`  |
| Europe | UK South | `uksouth` |
| Middle East | UAE North | `uaenorth`  |
| South America | Brazil South | `brazilsouth`  |
| US | Central US | `centralus` |
| US | East US | `eastus` |
| US | East US 2 | `eastus2` |
| US | North Central US | `northcentralus` |
| US | South Central US | `southcentralus` |
| US | West Central US | `westcentralus`  |
| US | West US | `westus`|
| US | West US 2 | `westus2` |
| US | West US 3 | `westus3` |

## Next steps

* [Quickstart: Detect anomalies in your time series data using the Univariate Anomaly Detection](quickstarts/client-libraries.md)
* [Quickstart: Detect anomalies in your time series data using the Multivariate Anomaly Detection](quickstarts/client-libraries-multivariate.md)
* The Anomaly Detector [REST API reference](https://aka.ms/ad-api)
