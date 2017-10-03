---
title: Move apps from BizTalk Services to Azure Logic Apps | Microsoft Docs
description: Move or migrate Azure BizTalk Services MABS to Logic Apps
services: logic-apps
documentationcenter: ''
author: jonfancey
manager: anneta
editor: ''

ms.assetid: 
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/30/2017
ms.author: ladocs; jonfan; mandia

---

# Move from BizTalk Services to Logic Apps

Microsoft Azure BizTalk Services (MABS) is retiring. Use this topic to move your MABS integration solutions to Azure Logic Apps. 

## Overview

BizTalk Services consists of two sub-services:

1.	Microsoft BizTalk Services Hybrid Connections
2.	EAI and EDI bridge-based integration

If you're looking to move hybrid connections, then [Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md) describes the changes and features of this service. Azure Hybrid Connections replaces BizTalk Services Hybrid Connections. Azure Hybrid Connections is available with Azure App Service, and is offered in the Azure portal. Azure Hybrid Connections also provides a new Hybrid Connection Manager to manage existing BizTalk Services hybrid connections, and new hybrid connections you create in the portal. Azure App Service Hybrid Connections is generally available (GA).

For EAI and EDI bridge-based integration, Logic Apps is the replacement. Logic Apps provides all the same capabilities as BizTalk Services, and more. Logic Apps provides cloud-scale consumption-based workflow and orchestration features that allow you to quickly and easily building complex integration solutions using a browser, or using tools within Visual Studio.

The following table provides a mapping of BizTalk Services capabilities to Logic Apps.

| BizTalk Services   | Logic Apps            | Purpose                  |
| ------------------ | --------------------- | ---------------------------- |
| Connector          | Connector             | Sending and receiving data   |
| Bridge             | Logic App             | Pipeline processor           |
| Validate stage     | XML Validation action      | Validate an XML document against a schema             |
| Enrich stage       | Data Tokens      | Promote properties into messages or for routing decisions             |
| Transform stage    | Transform action      | Convert XML messages from one format to another             |
| Decode stage       | Flat File Decode action      | Convert from flat file to XML             |
| Encode stage       |  Flat File Encode action      | Convert from XML to flat file             |
| Message Inspector       |  Azure Functions or API Apps      | Run custom code in your integrations             |
| Route Action      |  Condition or Switch      | Route messages to one of the specified connectors             |

There are a number of different types of artifact in BizTalk Services.

## Connectors
Connectors in BizTalk Services allow bridges to send and receive data, including two-way bridges that enabled HTTP-based request/response interactions. In Logic Apps, the same terminology is used. Connectors in logic apps serve the same purpose, and also include over 140 that can connect to a broad array of technologies and services, both on-premises using the on-premises Data Gateway (replacing the BizTalk Adapter Service used by BizTalk Services), and cloud SaaS and PaaS services such as OneDrive, Office365, Dynamics CRM and many more.

Sources in BizTalk Services are limited to FTP, SFTP, and Service Bus Queue or Topic subscription.

![](media/logic-apps-move-from-mabs/sources.png)

Each bridge has an HTTP endpoint by default, which is configured with the Runtime Address and the Relative Address properties of the bridge. To achieve the same with Logic Apps, use the [Request and Response](../connectors/connectors-native-reqres.md) actions.

## XML processing and bridges
A bridge in BizTalk Services is analogous to a processing pipeline. A bridge can take data received from a connector, and do some work with the data, and then send it to another system. Logic Apps does the same by supporting the same pipeline-based interaction patterns as BizTalk Services, and also provides a number of other integration patterns. The [XML Request-Reply Bridge](https://msdn.microsoft.com/library/azure/hh689781.aspx) in BizTalk Services is known as a VETER pipeline consisting of stages that can:

* (V) Validate
* (E) Enrich
* (T) Transform
* (E) Enrich
* (R) Route

As seen in the following image, the processing is split between request and reply, and allows control over the request and the reply paths separately (for example, using different maps for each):

![](media/logic-apps-move-from-mabs/xml-request-reply.png)

Additionally, an XML One-Way bridge adds Decode and Encode stages at the beginning and end of processing, and the Pass-Through bridge contains a single Enrich stage.

### Message processing and decoding/encoding
In BizTalk Services, you receive XML messages of different types, and determine the matching schema for the message received. This is performed in the **Message Types** stage of the receive processing pipeline. Then, the Decode stage uses the detected message type to decode it using the provided schema. If the schema is a flatfile schema, it converts the incoming flatfile to XML. 

Logic Apps provides similar capabilities. You receive a flatfile over a multitude of different protocols using the different connector triggers (File System, FTP, HTTP, and so on), and use the [Flat File Decode](../logic-apps/logic-apps-enterprise-integration-flatfile.md) action to convert the incoming data to XML. You can move your existing flat file schemas directly to logic apps without requiring any changes, and then upload schemas to your Integration Account.

### Validation
After the incoming data is converted to XML (or if XML was the message format received), validation runs to determine if the message adheres to your XSD schema. To do this in Logic Apps, use the [XML Validation](../logic-apps/logic-apps-enterprise-integration-xml-validation.md) action. Again, you can use the same schemas from BizTalk Services without any changes.

### Transform messages
In BizTalk Services, the Transform stage converts one XML-based message format to another. This is done by applying a map, using the TRFM-based mapper. In Logic Apps, the process is similar. The Transform action executes a map from your Integration Account. The main difference is that maps in Logic Apps are in XSLT format. XSLT includes the ability to reuse existing XSLT you already have, including maps created for BizTalk Server that contain functoids. 

### Routing rules
BizTalk Services makes a routing decision on which endpoint/connector to send incoming messages/data. The ability to select one of a number of pre-configured endpoints is possible using the routing filter option:

![](media/logic-apps-move-from-mabs/route-filter.png)

Logic Apps provides more sophisticated logic capabilities with [Condition](../logic-apps/logic-apps-use-logic-app-features.md) and [Switch](../logic-apps/logic-apps-switch-case.md), enabling advanced control flow and routing. Converting routing filters in BizTalk Services is best achieved using a **condition** *if* there are only two options. If there are more than two, then use a **switch**.

### Enrich
The Enrich stage in BizTalk Services processing adds properties to the message context associated with the data received. For example, promoting a property to use for routing (discussed below) from a database lookup, or by extracting a value using an XPath expression. Logic Apps provides access to all contextual data outputs from preceding actions, making it straightforward to replicate the same behavior. For example, using the `Get Row` SQL connection action, you return data from a SQL Server database, and use the data in a Decision action for routing. Likewise, properties on incoming Service Bus queued messages by a trigger are addressable, as well as XPath using the xpath workflow definition language expression.

### Use custom code
BizTalk Services provides the ability to [run custom code](https://msdn.microsoft.com/library/azure/dn232389.aspx) uploaded in your own assemblies. This is implemented by the [IMessageInspector](https://msdn.microsoft.com/library/microsoft.biztalk.services.imessageinspector.aspx) interface. Each stage in the bridge includes two properties (On Enter Inspector, and On Exit Inspector) that provide the .Net type you created that implements this interface. Custom code allows you to perform more complex processing on the data,  as well as reuse existing code in assemblies that perform common business logic. 

Logic Apps provides two primary ways to execute custom code: Azure Functions, and API Apps. Azure Functions can be created, and called from logic apps. See [Add and run custom code for logic apps through Azure Functions](../logic-apps/logic-apps-azure-functions.md). Use API Apps, part of Azure App Service, to create your own triggers and actions. Learn more about [Creating a custom API to use with Logic Apps](../logic-apps/logic-apps-create-api-app.md). 

If you have custom code in assmeblies that you call from BizTalk Services, you can either move this code to Azure Functions, or create custom APIs with API Apps; depending on what you're implementing. For example, if you have code that wraps another service that Logic Apps doesn't have a connector, then create an API App, and use the actions your API app provides within your logic app. If you have helper functions or libraries, then Azure Functions is likely the best fit.

### EDI processing and trading partner management
BizTalk Services includes EDI and B2B processing with support for AS2 (Applicability Statement 2), X12, and EDIFACT. So does Logic Apps. In BizTalk Services, your create EDI bridges and create/manage trading partners and agreements in the dedicated Tracking and Management portal.

In Logic Apps, this functionality is included with the [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md). This consists of the Integration Account and B2B actions for EDI and B2B processing. The [Integration Account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) is used to create and manage [trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md) and [agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md). Once you create an Integration Account, you can associate one or more logic apps to the account. Once associated, you can use the B2B actions to access trading partner information within your logic app. The following actions are provided:

* AS2 Encode
* AS2 Decode
* X12 Encode
* X12 Decode
* EDIFACT Encode
* EDIFACT Decode

Unlike BizTalk Services, these actions are decoupled from the transport protocols. So when you create your logic apps, you have more flexibility on which connectors you use to send and receive data. For example, it's possible to receive X12 files as attachments from email, and then process these files in a logic app. 

## Manage and monitor
As well as trading partner management, the dedicated portal for BizTalk Services provided tracking capabilities to monitor and troubleshoot issues. 

Logic Apps provides richer tracking and monitoring capabilities in the [Azure portal](../logic-apps/logic-apps-monitor-your-logic-apps.md), and with the [Operations Management Suite B2B solution](../logic-apps/logic-apps-monitor-b2b-message.md); including a mobile app for keeping an eye on things when you're on the move.

## High availability
To achieve high availability (HA) in BizTalk Services, you use more than one instance in a given region to share the processing load. With logic apps, in-region HA is built-in, and comes at no additional cost. For out-of-region disaster recovery for B2B processing in BizTalk Services, a backup and restore process is required. In Logic Apps, a cross-region active/passive [DR capability](../logic-apps/logic-apps-enterprise-integration-b2b-business-continuity.md) is provided; which allows the synchronization of B2B data across Integration Accounts in different regions for business continuity.

## Next
* [What are Logic Apps](logic-apps-what-are-logic-apps.md)
* [Create your first logic app](logic-apps-create-a-logic-app.md), or quickly get started using a [pre-built template](logic-apps-use-logic-app-templates.md)  
* [View all the available connectors](../connectors/apis-list.md) you can use in a logic app
