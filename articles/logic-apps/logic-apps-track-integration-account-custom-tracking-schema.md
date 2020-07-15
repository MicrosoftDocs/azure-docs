---
title: Custom tracking schemas for B2B messages
description: Create custom tracking schemas to monitor B2B messages in Azure Logic Apps
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 01/01/2020
---

# Create custom tracking schemas that monitor end-to-end workflows in Azure Logic A

Azure Logic Apps has built-in tracking that you can enable for parts of your workflow. However, you can set up custom tracking that logs events from the beginning to the end of workflows, for example, workflows that include a logic app, BizTalk Server, SQL Server, or any other layer. This article provides custom code that you can use in the layers outside of your logic app.

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
         "repeatItemIndex": ,
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
         "record": {}
      }
   ]
}
```

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| sourceType | Yes | String | Type of the run source with these permitted values: `Microsoft.Logic/workflows`, `custom` |
| source | Yes | String or JToken | If the source type is `Microsoft.Logic/workflows`, the source information needs to follow this schema. If the source type is `custom`, the schema is a JToken. |
| systemId | Yes | String | Logic app system ID |
| runId | Yes | String | Logic app run ID |
| operationName | Yes | String | Name of the operation, for example, action or trigger |
| repeatItemScopeName | Yes | String | Repeat item name if the action is inside a `foreach`or `until` loop |
| repeatItemIndex | Yes | Integer | Indicates that the action is inside a `foreach` or `until` loop and is the repeated item index number. |
| trackingId | No | String | Tracking ID to correlate the messages |
| correlationId | No | String | Correlation ID to correlate the messages |
| clientRequestId | No | String | Client can populate this property to correlate messages |
| eventLevel | Yes | String | Level of the event |
| eventTime | Yes | DateTime | Time of the event in UTC format: *YYYY-MM-DDTHH:MM:SS.00000Z* |
| recordType | Yes | String | Type of the track record with this permitted value only: `custom` |
| record | Yes | JToken | Custom record type with JToken format only |
|||||

## B2B protocol tracking schemas

For information about B2B protocol tracking schemas, see:

* [AS2 tracking schemas](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)
* [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md)

## Next steps

* Learn more about [monitoring B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)