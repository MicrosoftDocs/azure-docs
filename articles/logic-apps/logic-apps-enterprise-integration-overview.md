---
title: B2B enterprise integration overview - Azure Logic Apps
description: Overview about building automated B2B workflows for enterprise integration solutions by using Azure Logic Apps and Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: jonfan, divswa, LADocs
ms.topic: overview
ms.assetid: dd517c4d-1701-4247-b83c-183c4d8d8aae
ms.date: 08/01/2019
---

# Enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack

For business-to-business (B2B) workflows and seamless communication with Azure Logic Apps, you can enable enterprise integration scenarios with Microsoft's cloud-based solution, the Enterprise Integration Pack. Organizations can exchange messages electronically, even if they use different protocols and formats. The pack transforms different formats into a format that organizations' systems can interpret and process. Organizations can exchange messages through industry-standard protocols, including [AS2](../logic-apps/logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](../logic-apps/logic-apps-enterprise-integration-edifact.md). You can also secure messages with both encryption and digital signatures.

If you are familiar with BizTalk Server or Microsoft Azure BizTalk Services, 
the Enterprise Integration features are easy to use because most concepts are similar. One major difference is that Enterprise Integration uses integration accounts to simplify the storage and management of artifacts used in B2B communications. 

Architecturally, the Enterprise Integration Pack is based on "integration accounts". These accounts are cloud-based containers that store all your artifacts, like schemas, partners, certificates, maps, and agreements. You can use these artifacts to design, deploy, and maintain your B2B apps and also to build B2B workflows for logic apps. But before you can use these artifacts, you must first link your integration account to your logic app. After that, your logic app can access your integration account's artifacts.

## Why should you use enterprise integration?

* With enterprise integration, you can store all your artifacts in one place - your integration account.

* You can build B2B workflows and integrate with third-party software-as-service (SaaS) apps, on-premises apps, and custom apps 
by using the Azure Logic Apps engine and all its connectors.

* You can create custom code for your logic apps with Azure functions.

## How to get started with enterprise integration?

You can build and manage B2B apps with the 
Enterprise Integration Pack by using the Logic App Designer 
in the Azure portal. You can also manage your logic apps with Visual Studio and [PowerShell](https://docs.microsoft.com/powershell/module/az.logicapp).

Here are the high-level steps you must take before you can create apps in the Azure portal:

![overview image](media/logic-apps-enterprise-integration-overview/overview-0.png)  

## What are some common scenarios?

Enterprise Integration supports these industry standards:

* EDI - Electronic Data Interchange
* EAI - Enterprise Application Integration

## Get started

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).
* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)

To create maps and schemas, you can use the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas) and Visual Studio 2015.

## Try it now

[Deploy a fully operational sample AS2 send & receive logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/201-logic-app-as2-send-receive) that uses the B2B features for Azure Logic Apps.

## Learn more

* [Enterprise integration connectors](../connectors/apis-list.md#integration-account-connectors)

## Next steps

* [Create trading partners](logic-apps-enterprise-integration-partners.md)
* [Create agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md)
* [Add schemas](logic-apps-enterprise-integration-schemas.md)
* [Add maps](../logic-apps/logic-apps-enterprise-integration-maps.md)
* [Add certificates](logic-apps-enterprise-integration-certificates.md)
