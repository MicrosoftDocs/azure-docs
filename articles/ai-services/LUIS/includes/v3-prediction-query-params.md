---
title: V3 API query string parameters
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: include
ms.date: 06/30/2020
---

V3 API query string parameters include:

|Query parameter|LUIS portal name|Type|Version|Default|Purpose|
|--|--|--|--|--|--|
|`log`|Save logs|boolean|V2 & V3|false|Store query in log file. Default value is false.|
|`query`|-|string|V3 only|No default - it is required in the GET request|**In V2**, the utterance to be predicted is in the `q` parameter. <br><br>**In V3**, the functionality is passed in the `query` parameter.|
|`show-all-intents`|Include scores for all intents|boolean|V3 only|false|Return all intents with the corresponding score in the **prediction.intents** object. Intents are returned as objects in a parent `intents` object. This allows programmatic access without needing to find the intent in an array: `prediction.intents.give`. In V2, these were returned in an array. |
|`verbose`|Include more entities details|boolean|V2 & V3|false|**In V2**, when set to true, all predicted intents were returned. If you need all predicted intents, use the V3 param of `show-all-intents`.<br><br>**In V3**, this parameter only provides entity metadata details of entity prediction.  |
|`timezoneOffset`|-|string|V2|-|Timezone applied to datetimeV2 entities.|
|`datetimeReference`|-|string|V3|-|[Timezone](../luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity) applied to datetimeV2 entities. Replaces `timezoneOffset` from V2.|
