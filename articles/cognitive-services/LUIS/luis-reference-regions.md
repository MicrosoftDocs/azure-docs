---
title: Publishing regions and endpoints - LUIS
titleSuffix: Azure Cognitive Services
description: The region in which you publish your LUIS app corresponds to the region or location you specify in the Azure portal when you create an Azure LUIS endpoint key. When you publish an app, LUIS automatically generates an endpoint URL for the region associated with the key. To publish a LUIS app to more than one region, you need at least one key per region.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/11/2018
ms.author: diberry
---
# Regions and keys

The region in which you publish your LUIS app corresponds to the region or location you specify in the Azure portal when you create an Azure LUIS endpoint key. When you [publish an app](./luis-how-to-publish-app.md), LUIS automatically generates an endpoint URL for the region associated with the key. To publish a LUIS app to more than one region, you need at least one key per region. 

## LUIS website
There are three LUIS websites, based on region. You must author and publish in the same region. 

|LUIS|Region|
|--|--|
|[www.luis.ai][www.luis.ai]|U.S.<br>not Europe<br>not Australia|
|[au.luis.ai][au.luis.ai]|Australia|
|[eu.luis.ai][eu.luis.ai]|Europe|

## Regions and Azure resources
The app is published to all regions associated with the LUIS resources added in the LUIS portal. For example, for an app created on [www.luis.ai][www.luis.ai], if you create a LUIS resource in **westus** and add it to the app as a resource, the app is published in that region. 

## Public apps
A public app is published in all regions so that a user with a region-based LUIS resource key can access the app in whichever region is associated with their resource key.

## Publishing regions

LUIS apps created on https://www.luis.ai can be published to all endpoints except the [European](#publishing-to-europe) and [Australian](#publishing-to-australia) regions. 

The authoring region app can only be published to a corresponding publish region. If your app is currently in the wrong authoring region, export the app, and import it into the correct authoring region for your publishing region. 

 Global region | Authoring region<br>`API region name` | Publishing & querying region<br>`API region name`   |   LUIS website | Endpoint URL format   |
|-----|------|------|------|------|
| Asia | West US<br>`westus`| East Asia<br>`eastasia`     | [www.luis.ai][www.luis.ai] |  https://eastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| Asia | West US<br>`westus`| Southeast Asia<br>`souteastasia`     | [www.luis.ai][www.luis.ai] |   https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| *[Australia](#publishing-to-australia) | Australia East<br>`australiaeast`| Australia East<br>`australiaeast`     |   [au.luis.ai][au.luis.ai] | https://australiaeast.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| *[Europe](#publishing-to-europe)| West Europe<br>`westeurope`| North Europe<br>`northeurope`     | [eu.luis.ai][eu.luis.ai]|  https://northeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| *[Europe](#publishing-to-europe) | West Europe<br>`westeurope`| West Europe<br>`westeurope`     | [eu.luis.ai][eu.luis.ai]|  https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| North America | West US<br>`westus` | East US<br>`eastus`      |[www.luis.ai][www.luis.ai] |   https://eastus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| North America | West US<br>`westus` | East US 2<br>`eastus2`     | [www.luis.ai][www.luis.ai] |  https://eastus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| North America | West US<br>`westus` | South Central US<br>`southcentralus`     | [www.luis.ai][www.luis.ai] |  https://southcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   | 
| North America | West US<br>`westus` | West Central US<br>`westcentralus`     |[www.luis.ai][www.luis.ai] |  https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |
| North America | West US<br>`westus` | West US<br>`westus`  |  [www.luis.ai][www.luis.ai] | https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY  |
| North America | West US<br>`westus` | West US 2<br>`westus2`    | [www.luis.ai][www.luis.ai] |  https://westus2.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY  |
| South America | West US<br>`westus` | Brazil South<br>`brazilsouth`     | [www.luis.ai][www.luis.ai] |  https://brazilsouth.api.cognitive.microsoft.com/luis/v2.0/apps/YOUR-APP-ID?subscription-key=YOUR-SUBSCRIPTION-KEY   |

## Publishing to Europe

To publish to the European regions, you create LUIS apps at https://eu.luis.ai only. If you attempt to publish anywhere else using a key in the Europe region, LUIS displays a warning message. Instead, use https://eu.luis.ai. LUIS apps created at [https://eu.luis.ai][eu.luis.ai] don't automatically migrate to other regions. Export and then import the LUIS app in order to migrate it.

## Publishing to Australia

To publish to the Australian regions, you create LUIS apps at https://au.luis.ai only. If you attempt to publish anywhere else using a key in the Australian region, LUIS displays a warning message. Instead, use https://au.luis.ai. LUIS apps created at [https://au.luis.ai][au.luis.ai] don't automatically migrate to other regions. Export and then import the LUIS app in order to migrate it.

## Endpoints

LUIS currently has 2 endpoints: one for authoring and one for text analysis.

|Purpose|URL|
|--|--|
|Authoring|`https://{region}.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appID}/`|
|Text analysis (query prediction)|`https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/{appId}?q={q}[&timezoneOffset][&verbose][&spellCheck][&staging][&bing-spell-check-subscription-key][&log]`|

The following table explains the parameters, denoted with curly braces `{}`, in the previous table.

|Parameter|Purpose|
|--|--|
|region|Azure region - authoring and publishing have different regions|
|appID|LUIS app ID used in URL route and found on app dashboard|
|q|utterance text sent from client application such as chat bot|


## Next steps

> [!div class="nextstepaction"]
> [Prebuilt entities reference](./luis-reference-prebuilt-entities.md)

 [www.luis.ai]: https://www.luis.ai
 [au.luis.ai]: https://au.luis.ai
 [eu.luis.ai]: https://eu.luis.ai