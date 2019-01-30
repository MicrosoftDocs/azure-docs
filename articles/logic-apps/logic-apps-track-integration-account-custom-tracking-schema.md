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

| Property | Type | Description |
| --- | --- | --- |
| sourceType |   | Type of the run source. Allowed values are **Microsoft.Logic/workflows** and **custom**. (Mandatory) |
| Source |   | If the source type is **Microsoft.Logic/workflows**, the source information needs to follow this schema. If the source type is **custom**, the schema is a JToken. (Mandatory) |
| systemId | String | Logic app system ID. (Mandatory) |
| runId | String | Logic app run ID. (Mandatory) |
| operationName | String | Name of the operation (for example, action or trigger). (Mandatory) |
| repeatItemScopeName | String | Repeat item name if the action is inside a `foreach`/`until` loop. (Mandatory) |
| repeatItemIndex | Integer | Whether the action is inside a `foreach`/`until` loop. Indicates the repeated item index. (Mandatory) |
| trackingId | String | Tracking ID, to correlate the messages. (Optional) |
| correlationId | String | Correlation ID, to correlate the messages. (Optional) |
| clientRequestId | String | Client can populate it to correlate messages. (Optional) |
| eventLevel |   | Level of the event. (Mandatory) |
| eventTime |   | Time of the event, in UTC format YYYY-MM-DDTHH:MM:SS.00000Z. (Mandatory) |
| recordType |   | Type of the track record. Allowed value is **custom**. (Mandatory) |
| record |   | Custom record type. Allowed format is JToken. (Mandatory) |
||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)   
* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)

## Next steps

* Learn more about [monitoring B2B messages](logic-apps-monitor-b2b-message.md)
* Learn about [tracking B2B messages in Log Analytics](../logic-apps/logic-apps-track-b2b-messages-omsportal.md)