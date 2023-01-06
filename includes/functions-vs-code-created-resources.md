---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/31/2021
ms.author: glenga
---

+ A [resource group](../articles/azure-resource-manager/management/overview.md), which is a logical container for related resources.
+ A standard [Azure Storage account](../articles/storage/common/storage-account-create.md), which maintains state and other information about your projects.
+ A function app, which provides the environment for executing your function code. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources within the same hosting plan.
+ An App Service plan, which defines the underlying host for your function app.
+ An Application Insights instance connected to the function app, which tracks usage of your functions in the app.