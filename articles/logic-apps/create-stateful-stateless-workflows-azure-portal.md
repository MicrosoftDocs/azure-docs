---
title: Create automation workflows (preview) in the Azure portal 
description: Create stateless or stateful automation workflows with the Azure Logic Apps (Preview) extension in the Azure portal to integrate apps, data, cloud services, and on-premises systems
services: logic-apps
ms.suite: integration
ms.reviewer: deli, sopai, logicappspm
ms.topic: conceptual
ms.date: 11/09/2020
---

# Create stateful or stateless workflows with Azure Logic Apps (Preview) - Azure portal

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and 
> is not recommended for production workloads. Certain features might not be supported or might 
> have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create logic app workflows that integrate across apps, data, cloud services, and systems, you can build and run [*stateful* and *stateless* logic app workflows](logic-apps-overview-preview.md#stateful-stateless) in the Azure portal. The logic apps that you create with the new **Logic App (Preview)** resource type, which is powered by [Azure Functions](../azure-functions/functions-overview.md). This new resource type can include multiple workflows and is similar in some ways to the **Function App** resource type, which can include multiple functions.

Meanwhile, the original **Logic Apps** resource type still exists for you to create and use in the Azure portal. The experiences to create the new resource type are separate and different from the original resource type, but you can have both **Logic Apps** and **Logic App (Preview)** resource types in your Azure subscription. You can view and access all the deployed logic apps in your subscription, but they appear and are kept separately in their own categories and sections.

This article provides a high-level [overview about this public preview](#whats-new), describes various aspects about the **Logic App (Preview)** resource type, and how to create this resource by using the Azure portal:

* How [stateful and stateless](#stateful-stateless) logic apps differ from each other.

* How to build new **Logic App (Preview)** workflows by using the Azure portal.

