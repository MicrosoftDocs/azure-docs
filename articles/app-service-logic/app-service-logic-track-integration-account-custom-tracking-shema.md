---
title: Custom tracking schema| Microsoft Docs
description: Learn more about custom tracking schema
author: padmavc
manager: erikre
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 433ae852-a833-44d3-a3c3-14cca33403a2
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2016
ms.author: padmavc

---
# Custom tracking schema
## Supported custom tracking schema
````java

        {
            "sourceType": "",
            "source": {

            "workflow": {
                "systemId": ""
            },
            "runInstance": {
                "runId": ""
            },
            "operation": {
                "operationName": "",
                "repeatItemScopeName": "",
                "repeatItemIndex": "",
                "trackingId": "",
                "correlationId": "",
                "clientRequestId": ""
                }
            },
            "events": [
            {
                "eventLevel": "",
                "eventTime": "",
                "recordType": "",
                "record": {                
                }
            }
         ]
      }

````

| Property | Type | Description |
| --- | --- | --- |
| sourceType | x | Type of the run source. Allowed values: Microsoft.Logic/workflows or custom (Mandatory) |
| Source | x | If the source type is Microsoft.Logic/workflows, the source information needs to follow this schema. If the source type is 'custom'; the schema is a JToken (Mandatory) |
| systemId | String | Logic app system ID (Mandatory) |
| runId | String | Logic app run ID (Mandatory) |
| operationName | String | Name of the operation (for example, action or trigger) (Mandatory) |
| repeatItemScopeName | String | Repeat item name if the action is inside a `foreach`/`until` loop (Mandatory) |
| repeatItemIndex | Integer | If the action is inside a `foreach`/`until` loop; it indicates the repeated item index (Mandatory) |
| trackingId | String | Tracking ID to correlate the messages |
| correlationId | String | Correlation ID, to correlate the messages |
| clientRequestId | String | Client can populate it to correlate messages |
| eventLevel | x | Level of the event (Mandatory) |
| eventTime | x | Time of the event in UTC format YYYY-MM-DDTHH:MM:SS.00000Z (Mandatory) |
| recordType | x | Type of the track record; allowed value is Custom (Mandatory) |
| record | x | Custom record type; allowed format is JToken (Mandatory) |


## Supported B2B protocol Tracking Schemas
* [AS2 tracking schema](app-service-logic-track-integration-account-as2-tracking-shemas.md)   
* [X12 tracking schema](app-service-logic-track-integration-account-x12-tracking-shemas.md)

## Next steps
[Learn more about monitoring B2B messages](app-service-logic-monitor-b2b-message.md).   
[Learn about tracking B2B messages in the Operations Management Suite portal](app-service-logic-track-b2b-messages-omsportal.md).   
[Learn more about the Enterprise Integration Pack](app-service-logic-enterprise-integration-overview.md).   
