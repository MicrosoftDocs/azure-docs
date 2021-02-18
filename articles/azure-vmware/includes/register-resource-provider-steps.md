---
title: Register the Azure VMware Solution resource provider
description: Steps to register the Azure VMware Solution resource provider.
ms.topic: include
ms.date: 02/17/2021
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-create-private-cloud.md -->

To use Azure VMware Solution, you must first register the resource provider with your subscription. For more information about resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

### Azure CLI 

```azurecli-interactive
az provider register -n Microsoft.AVS --subscription <your subscription ID>
```

### Azure portal
 
1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the Azure portal menu, select **All services**.

1. In the **All services** box, enter **subscription**, and then select **Subscriptions**.

1. Select the subscription from the subscription list to view.

1. Select **Resource providers** and enter **Microsoft.AVS** into the search. 
 
1. If the resource provider is not registered, select **Register**.