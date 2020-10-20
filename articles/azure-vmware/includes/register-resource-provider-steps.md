---
title: Register the Azure VMware Solution resource provider
description: Steps to register the Azure VMware Solution resource provider.
ms.topic: include
ms.date: 09/21/2020
---

<!-- Used in avs-deployment.md and tutorial-create-private-cloud.md -->

To use Azure VMware Solution, you must first register the resource provider with your subscription.

```azurecli-interactive
az provider register -n Microsoft.AVS --subscription <your subscription ID>
```

>[!TIP]
>Alternatively, you can use the GUI to register the **Microsoft.AVS** resource provider.  For more information, see the [Register resource provider and types](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) article.  
