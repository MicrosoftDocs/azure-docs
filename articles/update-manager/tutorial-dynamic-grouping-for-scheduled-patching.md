---
title: Schedule Updates on Dynamic Scopes
description: In this tutorial, you learn how to group machines and dynamically apply updates at scale.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: tutorial 
author: habibaum
ms.author: v-uhabiba
# Customer intent: As an IT administrator, I want to dynamically group machines and schedule update deployments so that I can manage patches efficiently across environments.
---

# Tutorial: Schedule updates on dynamic scopes

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

This tutorial explains how you can create a dynamic scope and apply patches based on the criteria.

In this tutorial, you:

> [!div class="checklist"]
>
> - Create and edit groups.
> - Associate a schedule.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Create a dynamic scope

A dynamic scope exists within the context of a schedule only. You can use one schedule to link to a machine, a dynamic scope, or both. One dynamic scope can't have more than one schedule.

To create a dynamic scope, follow these steps:

#### [Azure portal](#tab/az-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Overview** > **Schedule updates** > **Create a maintenance configuration**.

1. On the **Create a maintenance configuration** pane, enter the details on the **Basics** tab. For **Maintenance scope**, select **Guest (Azure VM, Arc-enabled VMs/servers)**.

1. On the **Dynamic scopes** tab, follow the [steps to add a dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope).

1. On the **Machines** tab, select **Add machines** to add any individual machines to the maintenance configuration.

1. On the **Updates** tab, select the patch classification that you want to include or exclude. Then select **Tags**.

1. On the **Tags** tab, provide the tags.

1. On the **Review + Create** tab, review your configuration and then select **Create**.

#### [Azure CLI](#tab/az-cli)

```azurecli

    az maintenance assignment create-or-update-subscription --maintenance-configuration-id "/subscriptions/{subscription_id}/resourcegroups/{rg}/providers/Microsoft.Maintenance/maintenanceConfigurations/clitestmrpconfinguestadvanced" --name cli_dynamicscope_recording01 --filter-locations eastus2euap centraluseuap --filter-os-types windows linux --filter-tags {{tagKey1:[tagKey1Val1,tagKey1Val2],tagKey2:[tagKey2Val1,tagKey2Val2]}} --filter-resource-group rg1, rg2 --filter-tags-operator All -l global
```

#### [Azure PowerShell](#tab/az-ps)

```powershell
    New-AzConfigurationAssignment -ConfigurationAssignmentName $maintenanceConfigurationName -MaintenanceConfigurationId $maintenanceConfigurationInGuestPatchCreated.Id -FilterLocation eastus2euap,centraluseuap -FilterOsType Windows,Linux -FilterTag '{"tagKey1" : ["tagKey1Value1", "tagKey1Value2"], "tagKey2" : ["tagKey2Value1", "tagKey2Value2", "tagKey2Value3"] }' -FilterOperator "Any"
```

---

## Provide the consent

Providing consent to apply updates is an important step in the workflow of scheduled patching. For steps that cover the various ways to provide consent, see [Provide consent to apply updates](manage-dynamic-scoping.md#provide-consent-to-apply-updates).

## Related content

- Learn about [managing multiple machines](manage-multiple-machines.md).
