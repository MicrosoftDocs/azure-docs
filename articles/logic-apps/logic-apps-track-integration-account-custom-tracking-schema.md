---
title: Custom tracking schemas for B2B messages - Azure Logic Apps | Microsoft Docs
description: Create custom tracking schemas that monitor B2B messages in integration accounts for Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: 433ae852-a833-44d3-a3c3-14cca33403a2
ms.date: 01/27/2017
---

# Create custom tracking schemas that monitor end-to-end workflows in Azure Logic Apps

There is built-in tracking that you can enable for different parts of your business-to-business workflow, such as tracking AS2 or X12 messages. When you create workflows that includes a logic app, BizTalk Server, SQL Server, or any other layer, then you can enable custom tracking that logs events from the beginning to the end of your workflow. 

This article provides custom code that you can use in the layers outside of your logic app. 

## Custom tracking schema

```json
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
```

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| sourceType | Yes |   | Type of the run source. Allowed values are **Microsoft.Logic/workflows** and **custom**. |
| source | Yes |   | If the source type is **Microsoft.Logic/workflows**, the source information needs to follow this schema. If the source type is **custom**, the schema is a JToken. |
| systemId | Yes | String | Logic app system ID. |
| runId | Yes | String | Logic app run ID. |
| operationName | Yes | String | Name of the operation (for example, action or trigger). |
| repeatItemScopeName | Yes | String | Repeat item name if the action is inside a `foreach`/`until` loop. |
| repeatItemIndex | Yes | Integer | Whether the action is inside a `foreach`/`until` loop. Indicates the repeated item index. |
| trackingId | No | String | Tracking ID, to correlate the messages. |
| correlationId | No | String | Correlation ID, to correlate the messages. |
| clientRequestId | No | String | Client can populate it to correlate messages. |
| eventLevel | Yes |   | Level of the event. |
| eventTime | Yes |   | Time of the event, in UTC format YYYY-MM-DDTHH:MM:SS.00000Z. |
| recordType | Yes |   | Type of the track record. Allowed value is **custom**. |
| record | Yes |   | Custom record type. Allowed format is JToken. |
||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)   
* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)

## Next steps

* Learn more about [monitoring B2B messages](logic-apps-monitor-b2b-message.md)
* Learn about [tracking B2B messages in Azure Monitor logs](../logic-apps/logic-apps-track-b2b-messages-omsportal.md)
