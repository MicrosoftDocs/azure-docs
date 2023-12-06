---
title: v1 to v2 API Migration
titleSuffix: Azure AI services
description: The version 1 endpoint and authoring Language Understanding APIs are deprecated. Use this guide to understand how to migrate to version 2 endpoint  and authoring APIs.
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: how-to
ms.date: 04/02/2019
---

# API v1 to v2 Migration guide for LUIS apps

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

The version 1 [endpoint](https://aka.ms/v1-endpoint-api-docs) and [authoring](https://aka.ms/v1-authoring-api-docs) APIs are deprecated. Use this guide to understand how to migrate to version 2 [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) and [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) APIs.

## New Azure regions
LUIS has new [regions](./luis-reference-regions.md) provided for the LUIS APIs. LUIS provides a different portal for region groups. The application must be authored in the same region you expect to query. Applications do not automatically migrate regions. You export the app from one region then import into another for it to be available in a new region.

## Authoring route changes
The authoring API route changed from using the **prog** route to using the **api** route.


| version | route |
|--|--|
|1|/luis/v1.0/**prog**/apps|
|2|/luis/**api**/v2.0/apps|


## Endpoint route changes
The endpoint API has new query string parameters as well as a different response. If the verbose flag is true, all intents, regardless of score, are returned in an array named intents, in addition to the topScoringIntent.

| version | GET route |
|--|--|
|1|/luis/v1/application?ID={appId}&q={q}|
|2|/luis/v2.0/apps/{appId}?q={q}[&timezoneOffset][&verbose][&spellCheck][&staging][&bing-spell-check-subscription-key][&log]|


v1 endpoint success response:
```json
{
  "odata.metadata":"https://dialogice.cloudapp.net/odata/$metadata#domain","value":[
    {
      "id":"bccb84ee-4bd6-4460-a340-0595b12db294","q":"turn on the camera","response":"[{\"intent\":\"OpenCamera\",\"score\":0.976928055},{\"intent\":\"None\",\"score\":0.0230718572}]"
    }
  ]
}
```

v2 endpoint success response:
```json
{
  "query": "forward to frank 30 dollars through HSBC",
  "topScoringIntent": {
    "intent": "give",
    "score": 0.3964121
  },
  "entities": [
    {
      "entity": "30",
      "type": "builtin.number",
      "startIndex": 17,
      "endIndex": 18,
      "resolution": {
        "value": "30"
      }
    },
    {
      "entity": "frank",
      "type": "frank",
      "startIndex": 11,
      "endIndex": 15,
      "score": 0.935219169
    },
    {
      "entity": "30 dollars",
      "type": "builtin.currency",
      "startIndex": 17,
      "endIndex": 26,
      "resolution": {
        "unit": "Dollar",
        "value": "30"
      }
    },
    {
      "entity": "hsbc",
      "type": "Bank",
      "startIndex": 36,
      "endIndex": 39,
      "resolution": {
        "values": [
          "BankeName"
        ]
      }
    }
  ]
}
```

## Key management no longer in API
The subscription endpoint key APIs are deprecated, returning 410 GONE.

| version | route |
|--|--|
|1|/luis/v1.0/prog/subscriptions|
|1|/luis/v1.0/prog/subscriptions/{subscriptionKey}|

Azure [endpoint keys](luis-how-to-azure-subscription.md) are generated in the Azure portal. You assign the key to a LUIS app on the **[Publish](luis-how-to-azure-subscription.md)** page. You do not need to know the actual key value. LUIS uses the subscription name to make the assignment.

## New versioning route
The v2 model is now contained in a [version](luis-how-to-manage-versions.md). A version name is 10 characters in the route. The default version is "0.1".

| version | route |
|--|--|
|1|/luis/v1.0/**prog**/apps/{appId}/entities|
|2|/luis/**api**/v2.0/apps/{appId}/**versions**/{versionId}/entities|

## Metadata renamed
Several APIs that return LUIS metadata have new names.

| v1 route name | v2 route name |
|--|--|
|PersonalAssistantApps |assistants|
|applicationcultures|cultures|
|applicationdomains|domains|
|applicationusagescenarios|usagescenarios|


## "Sample" renamed to "suggest"
LUIS suggests utterances from existing [endpoint utterances](how-to/improve-application.md) that may enhance the model. In the previous version, this was named **sample**. In the new version, the name is changed from sample to **suggest**. This is called **[Review endpoint utterances](how-to/improve-application.md)** in the LUIS website.

| version | route |
|--|--|
|1|/luis/v1.0/**prog**/apps/{appId}/entities/{entityId}/**sample**|
|1|/luis/v1.0/**prog**/apps/{appId}/intents/{intentId}/**sample**|
|2|/luis/**api**/v2.0/apps/{appId}/**versions**/{versionId}/entities/{entityId}/**suggest**|
|2|/luis/**api**/v2.0/apps/{appId}/**versions**/{versionId}/intents/{intentId}/**suggest**|


## Create app from prebuilt domains
[Prebuilt domains](./howto-add-prebuilt-models.md) provide a predefined domain model. Prebuilt domains allow you to quickly develop your LUIS application for common domains. This API allows you to create a new app based on a prebuilt domain. The response is the new appID.

|v2 route|verb|
|--|--|
|/luis/api/v2.0/apps/customprebuiltdomains  |get, post|
|/luis/api/v2.0/apps/customprebuiltdomains/{culture}  |get|

## Importing 1.x app into 2.x
The exported 1.x app's JSON has some areas that you need to change before importing into [LUIS][LUIS] 2.0.

### Prebuilt entities
The [prebuilt entities](./howto-add-prebuilt-models.md) have changed. Make sure you are using the V2 prebuilt entities. This includes using [datetimeV2](luis-reference-prebuilt-datetimev2.md), instead of datetime.

### Actions
The actions property is no longer valid. It should be an empty

### Labeled utterances
V1 allowed labeled utterances to include spaces at the beginning or end of the word or phrase. Removed the spaces.

## Common reasons for HTTP response status codes
See [LUIS API response codes](luis-reference-response-codes.md).

## Next steps

Use the v2 API documentation to update existing REST calls to LUIS [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) and [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) APIs.

[LUIS]: ./luis-reference-regions.md
