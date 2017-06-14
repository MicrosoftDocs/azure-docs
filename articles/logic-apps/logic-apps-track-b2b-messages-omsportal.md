---
title: Track B2B messages in the Operations Management Suite portal - Azure | Microsoft Docs
description: How to track B2B messages in the Operations Management Suite portal
author: padmavc
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: bb7d9432-b697-44db-aa88-bd16ddfad23f
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/13/2016
ms.author: LADocs; padmavc

---
# Track B2B messages in the Operations Management Suite portal

![Logic Apps B2B symbol](./media/logic-apps-track-b2b-messages-omsportal/logic-apps-b2b-symbol.png)

When you set up B2B communication between running business processes 
or applications, those entities can exchange messages with each other. 
To check whether these messages are processed correctly, 
the Operations Management Suite portal provides these web-based 
tracking that you can use:

* Message count and status
* Acknowledgments status
* Correlate messages with acknowledgments
* Detailed error descriptions for failures
* Search capabilities

## Requirements

* An Azure account, if you don't have this already. You can [create a free account here](https://azure.microsoft.com/free).

* An integration account with diagnostics and logging already set up. 
Learn [how to create an integration account](logic-apps-enterprise-integration-create-integration-account.md) 
and [how to set up logging for that account](logic-apps-monitor-b2b-message.md).

* A logic app with diagnostics and logging already set up. 
Learn [how to create a logic app](logic-apps-create-a-logic-app.md) 
and [how to set up logging for that logic app](logic-apps-monitor-your-logic-apps.md#azure-diagnostics-and-alerts).

## Add your Logic Apps B2B solution to the Operations Management Suite portal

1. Sign in to the [Azure portal](https://portal.azure.com), and choose **More Services**. 
Search for "log analytics", and then choose **Log Analytics** as shown here:

   ![Find Log Analytics](media/logic-apps-track-b2b-messages-omsportal/browseloganalytics.png)

2. From the **Log Analytics** list, select your analytics log.

   ![Select log analytics](media/logic-apps-track-b2b-messages-omsportal/selectla.png)

3. Choose **OMS Portal**.

   ![Choose OMS portal](media/logic-apps-track-b2b-messages-omsportal/omsportalpage.png)

4. After the Microsoft Operations Management Suite portal home page appears, 
choose **Solutions Gallery**.    

   ![Choose Solutions Gallery](media/logic-apps-track-b2b-messages-omsportal/omshomepage1.png)

5. Choose **Logic Apps B2B**.     

   ![Choose Logic Apps B2B](media/logic-apps-track-b2b-messages-omsportal/omshomepage2.png)

6. Under **Logic Apps B2B**, choose **Add**.

   ![Choose Add](media/logic-apps-track-b2b-messages-omsportal/omshomepage3.png)

   On the OMS home page, a new tile for **Logic Apps B2B Messages** now appears.

7. Choose the **Logic Apps B2B Messages** tile.

   ![On the OMS home page, choose Logic Apps B2B Messages tile](media/logic-apps-track-b2b-messages-omsportal/omshomepage4.png)

<a name="message-status-details"></a>

## Track message status and details in the Operations Management Suite portal

1. After your B2B messages are processed, the updated message count appears. 
To view message status and details, choose the **Logic Apps B2B Messages** tile.

   ![Updated message count](media/logic-apps-track-b2b-messages-omsportal/omshomepage6.png)

   The status for AS2, X12, and EDIFACT messages between partners appear here. 
   This data is based on a single day.

   ![View message status](media/logic-apps-track-b2b-messages-omsportal/omshomepage5.png)

3. To view more details for a message status, 
choose the tile for **AS2**, **X12**, or **EDIFACT**. 

   The message status list appears for the tile that you chose, for example: 

   ![View message status list](media/logic-apps-track-b2b-messages-omsportal/as2messagelist.png)

   To find property descriptions for a message status list, 
   see [Message list property descriptions](#message-list-property-descriptions).

4. To view all the actions that have the same run ID, 
   select a row in the message status list.

5. On the **Log Search** page, you can now filter these actions by column or 
create queries manually or [build them by adding filters](logic-apps-track-b2b-messages-omsportal-query-filter-control-number.md):

   1. To create queries manually on the **Log Search** page, 
   in the search box, enter `Type="AzureDiagnostics"` plus the 
   columns and values that you want to use as query filters.

      ![Log Search page](media/logic-apps-track-b2b-messages-omsportal/logsearch.png)
   

<a name="message-list-property-descriptions"></a>

## Message list property descriptions

#### AS2 message list property descriptions

| Property | Description |
| --- | --- |
| Sender | The guest partner that is configured in the receive settings, or the host partner that is configured in the send settings for an AS2 agreement. |
| Receiver | The host partner that is configured in the receive settings, or the guest partner that is configured in the send settings for an AS2 agreement. |
| Logic App | Logic app where the AS2 actions are configured. |
| Status | AS2 message status <br>Success = Received or sent a good AS2 message, no MDN is configured <br>Success = Received or sent a good AS2 message, MDN is configured and received or MDN is sent <br>Failed = Received a bad AS2 message, no MDN is configured <br>Pending = Received or sent a good AS2 message, MDN is configured and MDN is expected |
| Ack | MDN message status <br>Accepted = Received or sent a positive MDN <br>Pending = Waiting to receive or send an MDN <br>Rejected = Received or sent a negative MDN <br>Not Required = MDN is not configured in the agreement |
| Direction | AS2 message direction. |
| Correlation ID | ID to correlate all the triggers and actions within a Logic app. |
| Message ID |  AS2 message ID, from the headers of the AS2 message. |
| Timestamp | Time at which the AS2 action processes the message. |

#### X12 message list property descriptions

| Property | Description |
| --- | --- |
| Sender | The guest partner that is configured in the receive settings, or the host partner that is configured in the send settings for an X12 agreement. |
| Receiver | The host partner that is configured in the receive settings, or the guest partner that is configured in the send settings for an X12 agreement. |
| Logic App | Logic app where the AS2 actions are configured. |
| Status | X12 message status <br>Success = Received or sent a good X12 message, no functional ack is configured <br>Success = Received or sent a good X12 message, functional ack is configured and received or a functional ack is sent <br>Failed = Received or sent a bad X12 message <br>Pending = Received or sent a good X12 message, functional ack is configured and a functional ack is expected. |
| Ack | Functional Ack (997) status <br>Accepted = Received or sent a positive functional ack <br>Rejected = Received or sent a negative functional ack <br>Pending = Expecting a functional ack but didn't receive it <br>Pending = Generated a functional ack but couldn't send it to partner <br>Not Required = Functional Ack is not configured |
| Direction | X12 message direction. |
| Correlation ID | ID to correlate all of the triggers and actions within a Logic app. |
| Msg type |  EDI X12 message type. |
| ICN | Interchange Control Number of the X12 message. |
| TSCN | Transactional Set Control Number of the X12 message. |
| Timestamp | Time at which X12 action processes the message. |

#### EDIFACT message list property descriptions

| Property | Description |
| --- | --- |
| Sender | The guest partner that is configured in the receive settings, or the host partner that is configured in the send settings for an EDIFACT agreement. |
| Receiver | The host partner that is configured in the receive settings, or the guest partner that is configured in the send settings for an EDIFACT agreement. |
| Logic App | Logic app where the AS2 actions are configured. |
| Status | EDIFACT message status <br>Success = Received or sent a good X12 message, no functional ack is configured <br>Success = Received or sent a good X12 message, functional ack is configured and received or a functional ack is sent <br>Failed = Received or sent a bad X12 message <br>Pending = Received or sent a good X12 message, functional ack is configured and a functional ack is expected. |
| Ack | Functional Ack (997) status <br>Accepted = Received or sent a positive functional ack <br>Rejected = Received or sent a negative functional ack <br>Pending = Expecting a functional ack but didn't receive it <br>Pending = Generated a functional ack but couldn't send it to partner <br>Not Required = Functional Ack is not configured |
| Direction | EDIFACT message direction. |
| Correlation ID | ID to correlate all of the triggers and actions within a Logic app. |
| Msg type |  EDIFACT message type. |
| ICN | Interchange Control Number of the EDIFACT message. |
| TSCN | Transactional Set Control Number of the EDIFACT message. |
| Timestamp | Time at which EDIFACT action processes the message. |

## Next steps

[Track B2B messages with queries in Operations Management Suite](logic-apps-track-b2b-messages-omsportal-query-filter-control-number.md)
[Custom Tracking Schema](logic-apps-track-integration-account-custom-tracking-schema.md "Learn about Custom Tracking Schema")   
[AS2 Tracking Schema](logic-apps-track-integration-account-as2-tracking-schemas.md "Learn about AS2 Tracking Schema")    
[X12 Tracking Schema](logic-apps-track-integration-account-x12-tracking-schema.md "Learn about X12 Tracking Schema")  
[Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")
