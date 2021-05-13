---
title: Azure Resources
description: learn more about azure resources.
services: cognitive-services
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: concepts
ms.date: 04/22/2021
---

# LUIS resources

LUIS allows three types of Azure resources and one non-Azure resource:

|Resource|Purpose|Cognitive service `kind`|Cognitive service `type`|
|--|--|--|--|
|Authoring resource|Allows you to create, manage, train, test, and publish your applications.<br>One tier is available for the LUIS authoring resource:<ul> <li>**Free F0 authoring resource**, which gives you 1 million free authoring transactions and 1,000 free testing prediction endpoint requests monthly.</li></ul> You can use [LUIS Programmatic APIs v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f) to manage Authoring resources |`LUIS.Authoring`|`Cognitive Services`|
|Prediction resource| Allows you to query prediction endpoint beyond the 1,000 requests provided by the authoring resource.<br> <br> Two tiers are available for the prediction resource:<ul><li> **Free F0 prediction resource**, which gives you 10,000 free prediction endpoint requests monthly.</li> <li>**Standard S0 prediction resource**, which is the paid tier. [Learn more about pricing.](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) </li> </ul> You can use [LUIS Endpoint API v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0-preview/operations/5f68f4d40a511ce5a7440859) to manage Prediction resources|`LUIS`|`Cognitive Services`| 
|[Cognitive Services multiservice resource key](../cognitive-services-apis-create-account-cli.md?tabs=windows#create-a-cognitive-services-resource)|Query prediction endpoint requests shared with LUIS and other supported cognitive services.|`CognitiveServices`|`Cognitive Services`|

> [!Note]
> LUIS provides two types of F0 (free tier) resources: one for authoring transactions and one for prediction transactions. If you're running out of free quota for prediction transactions, make sure you're using the F0 prediction resource, which gives you a 10,000 free transactions monthly, and not the authoring resource, which gives you 1,000 prediction transactions monthly.

> [!important]
> You should author LUIS apps in the [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

## Resource limits

### Authoring key creation limits

You can create as many as 10 authoring keys per region, per subscription. Publishing regions are different from authoring regions. Make sure you create an app in the authoring region that corresponds to the publishing region where you want your client application to be located. For information on how authoring regions map to publishing regions, see [Authoring and publishing regions](luis-reference-regions.md). 

For more information on key limits, see [key limits](luis-limits.md#key-limits).

### Errors for key usage limits

Usage limits are based on the pricing tier.

If you exceed your transactions-per-second (TPS) quota, you receive an HTTP 429 error. If you exceed your transaction-per-month (TPM) quota, you receive an HTTP 403 error.

## Next steps

* Learn more about creating and managing azure resources [here](./luis-how-to-azure-subscription.md)
