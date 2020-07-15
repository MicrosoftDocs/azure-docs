---
title: B2B enterprise integration
description: Learn about building automated B2B workflows for enterprise integration by using Azure Logic Apps and Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, logicappspm
ms.topic: overview
ms.date: 08/01/2019
---

# B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack

For business-to-business (B2B) solutions and seamless communication between organizations, you can build automated scalable enterprise integration workflows by using the Enterprise Integration Pack (EIP) with [Azure Logic Apps](../logic-apps/logic-apps-overview.md). Although organizations use different protocols and formats, they can exchange messages electronically. The EIP transforms different formats into a format that your organizations' systems can process and supports industry-standard protocols, including [AS2](../logic-apps/logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](../logic-apps/logic-apps-enterprise-integration-edifact.md). You can also improve security for messages by using both encryption and digital signatures. The EIP supports these [enterprise integration connectors](../connectors/apis-list.md#integration-account-connectors) and these industry standards:

* Electronic Data Interchange (EDI)
* Enterprise Application Integration (EAI)

If you're familiar with Microsoft BizTalk Server or Azure BizTalk Services, the EIP follows similar concepts, making the features easy to use. However, one major difference is that the EIP is architecturally based on "integration accounts" to simplify the storage and management of artifacts used in B2B communications. These accounts are cloud-based containers that store all your artifacts, such as partners, agreements, schemas, maps, and certificates. 

## Why use the Enterprise Integration Pack?

* With the EIP, you can store all your artifacts in one place - your integration account.

* You can build B2B workflows and integrate with third-party software-as-service (SaaS) apps, on-premises apps, and custom apps 
by using Azure Logic Apps and connectors.

* You can create custom code for your logic apps with Azure functions.

## How do I get started?

Before you can start building B2B logic app workflows with the EIP, you need these items:

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) with the artifacts that you want to use

* To create maps and schemas, you can use the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas) and Visual Studio 2015.

After you create an integration account and add your artifacts, you can start building B2B workflows with these artifacts by creating a logic app in the Azure portal. If you're new to logic apps, try [creating a basic logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To work with these artifacts, make sure that you first link your integration account to your logic app. After that, your logic app can access your integration account. You can also create, manage, and deploy logic apps by using Visual Studio or [PowerShell](https://docs.microsoft.com/powershell/module/az.logicapp).

Here are the high-level steps to get started building B2B logic apps:

![Prerequisites for creating B2B logic apps](./media/logic-apps-enterprise-integration-overview/overview.png)  

## Try now

[Deploy a fully operational sample logic app that sends and receives AS2 messages](https://github.com/Azure/azure-quickstart-templates/tree/master/201-logic-app-as2-send-receive)

## Next steps

* [Create trading partners](logic-apps-enterprise-integration-partners.md)
* [Create agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md)
* [Add schemas](logic-apps-enterprise-integration-schemas.md)
* [Add maps](../logic-apps/logic-apps-enterprise-integration-maps.md)
* [Migrate from BizTalk Services](../logic-apps/logic-apps-move-from-mabs.md)
