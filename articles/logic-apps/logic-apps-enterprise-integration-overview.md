---
title: B2B enterprise integration
description: Learn about building automated B2B workflows for enterprise integration by using Azure Logic Apps and Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: overview
ms.date: 09/14/2021
---

# B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack

For business-to-business (B2B) solutions and seamless communication between organizations, you can build automated, scalable, enterprise integration workflows by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md) with the Enterprise Integration Pack (EIP) capabilities. Although organizations use different protocols and formats, they can exchange messages electronically. The EIP transforms different formats into a format that your organizations' systems can process and supports industry-standard protocols, including [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), [EDIFACT](logic-apps-enterprise-integration-edifact.md), and [RosettaNet](logic-apps-enterprise-integration-rosettanet.md). You can also improve security for messages by using both encryption and digital signatures. The EIP includes [enterprise integration connectors](../connectors/managed.md#enterprise-connectors) that you can use in your workflows and supports the following industry standards:

* Electronic Data Interchange (EDI)
* Enterprise Application Integration (EAI)

If you're familiar with Microsoft BizTalk Server or Azure BizTalk Services, the EIP follows similar concepts, making the features easy to use. However, one major difference is that the EIP is architecturally based on *integration accounts* to simplify the storage and management of artifacts used in B2B communications. These accounts are cloud-based containers that store all your B2B artifacts, such as partners, agreements, maps, schemas, and certificates.

## Why use the Enterprise Integration Pack?

* You can create an integration account where you can define and store all your artifacts in one place.

* You can build B2B workflows and integration solutions using your B2B artifacts with cloud services, such as Azure, Microsoft, and other software-as-service (SaaS) apps, on-premises systems, and custom apps using Azure Logic Apps with [400+ built-in operations and managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

* You can create and run custom code from your workflows using built-in code execution operations and Azure Functions.

## What do I need to get started?

Before you can start building B2B logic app workflows with B2B operations and artifacts, you need the following items:

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account](logic-apps-enterprise-integration-create-integration-account.md) to store the B2B artifacts that you define and want to use.

* Your B2B artifacts, such as [trading partners](logic-apps-enterprise-integration-partners.md), [agreements](logic-apps-enterprise-integration-agreements.md), [maps](logic-apps-enterprise-integration-maps.md), [schemas](logic-apps-enterprise-integration-schemas.md), [certificates](logic-apps-enterprise-integration-certificates.md), and so on.

* To create maps and schemas, you can use the [Microsoft Azure Logic Apps Enterprise Integration Tools Extension](https://aka.ms/vsenterpriseintegrationtools) and Visual Studio 2019. If you're using Visual Studio 2015, you can use the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0](https://aka.ms/vsmapsandschemas) extension.

   > [!IMPORTANT]
   > Don't install this extension alongside the BizTalk Server extension. Having both extensions might 
   > produce unexpected behavior. Make sure that you only have one of these extensions installed.

   > [!NOTE]
   > On high resolution monitors, you might experience a [display problem with the map designer](/visualstudio/designers/disable-dpi-awareness) 
   > in Visual Studio. To resolve this display problem, either [restart Visual Studio in DPI-unaware mode](/visualstudio/designers/disable-dpi-awareness#restart-visual-studio-as-a-dpi-unaware-process), 
   > or add the [DPIUNAWARE registry value](/visualstudio/designers/disable-dpi-awareness#add-a-registry-entry).

After you create an integration account and add your artifacts, you can start building B2B workflows with these artifacts by creating a logic app resource in the Azure portal. If you're new to logic apps, try [creating an example basic logic app workflow](quickstart-create-first-logic-app-workflow.md). To work with your artifacts, make sure that you first link your integration account to your logic app. After that, your logic app can access your integration account. You can also create, manage, and deploy logic apps by using Visual Studio or [PowerShell](/powershell/module/az.logicapp).

The following diagram shows the high-level steps to start building B2B logic app workflows:

![Conceptual diagram showing prerequisite steps to create B2B logic app workflows.](media/logic-apps-enterprise-integration-overview/overview.png)

## Try now

[Deploy a fully operational sample logic app that sends and receives AS2 messages](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/logic-app-as2-send-receive)

## Next steps

* [Create trading partners](logic-apps-enterprise-integration-partners.md)
* [Create agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md)
* [Add schemas](logic-apps-enterprise-integration-schemas.md)
* [Add maps](../logic-apps/logic-apps-enterprise-integration-maps.md)
* [Migrate from BizTalk Services](../logic-apps/logic-apps-move-from-mabs.md)
