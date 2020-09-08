---
title: Register the Azure VMware Solution resource provider
description: Steps to register the Azure VMware Solution resource provider.
ms.topic: include
ms.date: 09/04/2020
---

To use Azure VMware Solution, you must first register the resource provider with your subscription.

```
azurecli-interactive
az provider register -n Microsoft.AVS --subscription <your subscription ID>
```

For additional ways to register the resource provider, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).