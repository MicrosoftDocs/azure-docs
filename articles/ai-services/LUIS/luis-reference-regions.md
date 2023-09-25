---
title: Publishing regions & endpoints - LUIS
description: The region specified in the Azure portal is the same where you will publish the LUIS app and an endpoint URL is generated for this same region.
ms.service: cognitive-services
ms.subservice: language-understanding
author: aahill
ms.author: aahi
ms.topic: reference
ms.date: 02/08/2022
ms.custom: references_regions
---

# Authoring and publishing regions and the associated keys

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


LUIS authoring regions are supported by the LUIS portal. To publish a LUIS app to more than one region, you need at least one predection key per region.

<a name="luis-website"></a>

## LUIS Authoring regions

Authoring regions are the regions where the application gets created and the training take place.

LUIS has the following authoring regions available with [paired fail-over regions](../../availability-zones/cross-region-replication-azure.md):
	
* Australia east
* West Europe
* West US
* Switzerland north

LUIS has one portal you can use regardless of region, [www.luis.ai](https://www.luis.ai).

<a name="regions-and-azure-resources"></a>

## Publishing regions and Azure resources

Publishing regions are the regions where the application will be used in runtime. To use the application in a publishing region, you must create a resource in this region and assign your application to it. For example, if you create an app with the *westus* authoring region and publish it to the *eastus* and *brazilsouth* regions, the app will run in those two regions.


## Public apps
A public app is published in all regions so that a user with a supported predection resource can access the app in all regions.

<a name="publishing-regions"></a>

## Publishing regions are tied to authoring regions

When you first create our LUIS application, you are required to choose an [authoring region](#luis-authoring-regions). To use the application in runtime, you are required to create a resource in a publishing region.

Every authoring region has corresponding prediction regions that you can publish your application to, which are listed in the tables below. If your app is currently in the wrong authoring region, export the app, and import it into the correct authoring region to match the required publishing region.


## Single data residency

Single data residency means that the data does not leave the boundaries of the region.

> [!Note]
> * Make sure to set `log=false` for [V3 APIs](https://westus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a91e54c9db63d589f433) to disable active learning. By default this value is `false`, to ensure that data does not leave the boundaries of the runtime region. 
> * If `log=true`, data is returned to the authoring region for active learning.

## Publishing to Europe

 Global region | Authoring API region | Publishing & querying region<br>`API region name`   |  Endpoint URL format   |
|-----|------|------|------|
| Europe | `westeurope`| France Central<br>`francecentral`     | `https://francecentral.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |
| Europe | `westeurope`| North Europe<br>`northeurope`     | `https://northeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |
| Europe | `westeurope`| West Europe<br>`westeurope`    |  `https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |
| Europe | `westeurope`| UK South<br>`uksouth`    |  `https://uksouth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |
| Europe | `westeurope`| Switzerland North<br>`switzerlandnorth`    |  `https://switzerlandnorth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |
| Europe | `westeurope`| Norway East<br>`norwayeast`    |  `https://norwayeast.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |

## Publishing to Australia

 Global region | Authoring API region | Publishing & querying region<br>`API region name`   |  Endpoint URL format   |
|-----|------|------|------|
| Australia | `australiaeast` | Australia East<br>`australiaeast`     |  `https://australiaeast.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY`   |

## Other publishing regions

 Global region | Authoring API region | Publishing & querying region<br>`API region name`   |  Endpoint URL format   |
|-----|------|------|------|
| Africa | `westus`<br>[www.luis.ai][www.luis.ai]| South Africa North<br>`southafricanorth` |  `https://southafricanorth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Central India<br>`centralindia` |  `https://centralindia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| East Asia<br>`eastasia`     |  `https://eastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Japan East<br>`japaneast`     |   `https://japaneast.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Japan West<br>`japanwest`     |   `https://japanwest.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Jio India West<br>`jioindiawest`     |   `https://jioindiawest.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Korea Central<br>`koreacentral`     |   `https://koreacentral.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| Southeast Asia<br>`southeastasia`     |   `https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| Asia | `westus`<br>[www.luis.ai][www.luis.ai]| North UAE<br>`northuae`     |   `https://northuae.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | Canada Central<br>`canadacentral`     |   `https://canadacentral.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | Central US<br>`centralus`     |   `https://centralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | East US<br>`eastus`      |  `https://eastus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America | `westus`<br>[www.luis.ai][www.luis.ai] | East US 2<br>`eastus2`     |  `https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America | `westus`<br>[www.luis.ai][www.luis.ai] | North Central US<br>`northcentralus`  |  `https://northcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America | `westus`<br>[www.luis.ai][www.luis.ai] | South Central US<br>`southcentralus`  |  `https://southcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | West Central US<br>`westcentralus`    |  `https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America | `westus`<br>[www.luis.ai][www.luis.ai] | West US<br>`westus`  |   `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | West US 2<br>`westus2`    |  `https://westus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| North America |`westus`<br>[www.luis.ai][www.luis.ai] | West US 3<br>`westus3`    |  `https://westus3.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |
| South America | `westus`<br>[www.luis.ai][www.luis.ai] | Brazil South<br>`brazilsouth`    |  `https://brazilsouth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY` |

## Endpoints

Learn more about the [authoring and prediction endpoints](developer-reference-resource.md).

## Failover regions

Each region has a secondary region to fail over to. Failover will only happen in the same geographical region.

Authoring regions have [paired fail-over regions](../../availability-zones/cross-region-replication-azure.md).

The following publishing regions do not have a failover region:

* Brazil South
* Southeast Asia

## Next steps


> [Prebuilt entities reference](./luis-reference-prebuilt-entities.md)

 [www.luis.ai]: https://www.luis.ai
