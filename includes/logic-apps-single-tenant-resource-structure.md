---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 10/15/2022
---

In the multi-tenant Azure Logic Apps model, the Consumption logic app resource structure can include only a single workflow. Due to this one-to-one relationship, both logic app and workflow are often considered and referenced synonymously. However, in the single-tenant Azure Logic Apps model, the Standard logic app resource structure can include multiple workflows. This one-to-many relationship means that in the same logic app, workflows can share and reuse other resources. Workflows in the same logic app and tenant also offer improved performance due to this shared tenancy and proximity to each other. This resource structure looks and works similarly to Azure Functions where a function app can host many functions.

For more information and best practices about organizing workflows, performance, and scaling in your logic app, review the similar [guidance for Azure Functions](../articles/azure-functions/functions-best-practices.md) that you can generally apply to single-tenant Azure Logic Apps.