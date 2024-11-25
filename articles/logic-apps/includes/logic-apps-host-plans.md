---
ms.service: azure-logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 10/14/2024
---

   | Plan | Description |
   |------|-------------|
   | **Consumption** | Creates a logic app resource that supports only one workflow that runs in multitenant Azure Logic Apps and uses the [Consumption model for billing](../logic-apps-pricing.md#consumption-pricing). |
   | **Standard** | Creates a logic app resource that supports multiple workflows. You have the following options: <br><br>- **Workflow Service Plan**: Workflows run in single-tenant Azure Logic Apps and use the [Standard model for billing](../logic-apps-pricing.md#standard-pricing). <br><br>- **App Service Environment V3**: Workflows run in single-tenant Azure Logic Apps and use an [App Service Environment plan for billing](../../app-service/environment/overview.md#pricing). <br><br>- **Hybrid** (Preview): Workflows run on premises and in multiple clouds using [Kubernetes Event-driven Autoscaling (KEDA)](/azure/aks/keda-about). For more information, see [Create Standard workflows for hybrid deployment](../create-standard-workflows-hybrid-deployment.md). |