---
title: B2B enterprise integration overview - Azure Logic Apps | Microsoft Docs
description: Build automated B2B workflows for enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: dd517c4d-1701-4247-b83c-183c4d8d8aae
ms.date: 09/08/2016
---

# Overview: B2B enterprise integration scenarios in Azure Logic Apps with Enterprise Integration Pack

For business-to-business (B2B) workflows and seamless communication with Azure Logic Apps, you can enable enterprise integration scenarios with Microsoft's cloud-based solution, the Enterprise Integration Pack. Organizations can exchange messages electronically, even if they use different protocols and formats. The pack transforms different formats into a format that organizations' systems can interpret and process. 
Organizations can exchange messages through industry-standard protocols, 
including [AS2](../logic-apps/logic-apps-enterprise-integration-as2.md), 
[X12](logic-apps-enterprise-integration-x12.md), 
and [EDIFACT](../logic-apps/logic-apps-enterprise-integration-edifact.md). 
You can also secure messages with both encryption and digital signatures.

If you are familiar with BizTalk Server or Microsoft Azure BizTalk Services, 
the Enterprise Integration features are easy to use because most concepts are similar. One major difference is that Enterprise Integration uses integration accounts to simplify the storage and management of artifacts used in B2B communications. 

Architecturally, the Enterprise Integration Pack is based on "integration accounts". These accounts are cloud-based containers that store all your artifacts, like schemas, partners, certificates, maps, and agreements. You can use these artifacts to design, deploy, and maintain your B2B apps and also to build B2B workflows for logic apps. But before you can use these artifacts, you must first link your integration account to your logic app. After that, your logic app can access your integration account's artifacts.

## Why should you use enterprise integration?

* With enterprise integration, you can store all 
your artifacts in one place -- your integration account.
* You can build B2B workflows and integrate with third-party 
software-as-service (SaaS) apps, on-premises apps, and custom apps 
by using the Azure Logic Apps engine and all its connectors.
* You can create custom code for your logic apps with Azure functions.

## How to get started with enterprise integration?

You can build and manage B2B apps with the 
Enterprise Integration Pack through the Logic App Designer 
in the **Azure portal**. You can also manage your logic apps with 
[PowerShell](https://docs.microsoft.com/powershell/module/az.logicapp).

Here are the high-level steps you must take before you can create apps in the Azure portal:

![overview image](media/logic-apps-enterprise-integration-overview/overview-0.png)  

## What are some common scenarios?

Enterprise Integration supports these industry standards:

* EDI - Electronic Data Interchange
* EAI - Enterprise Application Integration

## Here's what you need to get started

* An Azure subscription with an integration account
* Visual Studio 2015 to create maps and schemas
* [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas)  

## Try it now

[Deploy a fully operational sample AS2 send & receive logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/201-logic-app-as2-send-receive) that uses the B2B features for Azure Logic Apps.

## Learn more
* [Agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md "Learn about enterprise integration agreements")
* [Business to Business (B2B) scenarios](../logic-apps/logic-apps-enterprise-integration-b2b.md "Learn how to create Logic apps with B2B features ")  
* [Certificates](logic-apps-enterprise-integration-certificates.md "Learn about enterprise integration certificates")
* [Flat file encoding/decoding](logic-apps-enterprise-integration-flatfile.md "Learn how to encode and decode flat file contents")  
* [Integration accounts](../logic-apps/logic-apps-enterprise-integration-accounts.md "Learn about integration accounts")
* [Maps](../logic-apps/logic-apps-enterprise-integration-maps.md "Learn about enterprise integration maps")
* [Partners](logic-apps-enterprise-integration-partners.md "Learn about enterprise integration partners")
* [Schemas](logic-apps-enterprise-integration-schemas.md "Learn about enterprise integration schemas")
* [XML message validation](logic-apps-enterprise-integration-xml.md "Learn how to validate XML messages with Logic apps")
* [XML transform](logic-apps-enterprise-integration-transform.md "Learn about enterprise integration maps")
* [Enterprise Integration Connectors](../connectors/apis-list.md "Learn about enterprise integration pack connectors")
* [Integration Account Metadata](../logic-apps/logic-apps-enterprise-integration-metadata.md "Learn about integration account metadata")
* [Monitor B2B messages](logic-apps-monitor-b2b-message.md "Learn more about monitoring B2B messages")
* [Tracking B2B messages in Azure Monitor logs](logic-apps-track-b2b-messages-omsportal.md "Learn more about tracking B2B messages in Azure Monitor logs")

