<properties 
	pageTitle="Monitor your Integration Account | Microsoft Azure" 
	description="How to monitor Inegration Account" 
	authors="padmavc" 
	manager="erikre" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/21/2016"
	ms.author="padmavc"/>


# Custom tracking schema
Following custom tracking schema is supported 

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

| Property | Description |
| -------- | ------- |
| sourceType | Mandatory.  It containsthe type of the run source, the allowed values are Microsoft.Logic/workflows or custom |
| Source | Mandatory - If the source type is Microsoft.Logic/workflows then the source information need to follow this schema. This schema will be a JToken if the source type is 'custom' |
| systemId | Mandatory, string.  It contains the logic app system id |
| runId | Mandatory, string.  It contains the logic app run id |
| operationName | Mandatory, string.  It contains the name of the operation (for example action or trigger) |
| repeatItemScopeName | Mandatory, string. It contains the repeat item name if the action is inside a foreach/until loop |
| repeatItemIndex| Mandatory, int.  It contains the repeat item index if the action is inside a foreach/until loop |
| trackingId | Optional, string. It contains the tracking id to correlate the messages |
| correlationId | Optional, string. It contains the correlation id to correlate the messages |
| clientRequestId | Optional, string.  Client can populate it to correlate messages |
| eventLevel | Mandatory. It contains the level of the event |
| eventTime | Mandatory. It contains the time of the event in UTC format YYYY-MM-DDTHH:MM:SS.00000Z |
| recordType | Mandatory, It contains the type of the track record. The allowed values are AS2Message, AS2MDN, X12Interchange, X12FunctionalGroup, X12TransactionSet, X12InterchangeAcknowledgment, X12FunctionalGroupAcknowledgment, X12TransactionSetAcknowledgment, Custom |
| record | Mandatory.  It contains the custom record type and the allowed format is JToken |
|


## Next steps

[Learn more about tracking B2B messages](./media/app-service-logic-track-b2b-message.md "Learn more about tracking B2B messages")   
[Learn more about AS2 Tracking Schema](./media/app-service-logic-track-integration-account-as2-tracking-shemas.md "Learn about AS2 Schema")   
[Learn more about X12 Tracking Schema](./media/app-service-logic-track-integration-account-x12-tracking-schemas.md "Learn about X12 Tracking Schema")   
[Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")   
