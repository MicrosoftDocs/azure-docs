---
title: Schedule updates on Dynamic scoping.
description: In this tutorial, you learn how to group machines, dynamically apply the updates at scale.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want dynamically apply patches on the machines as per a schedule.
---

# Tutorial: Schedule updates on Dynamic scopes

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can create a dynamic scope, and apply patches based on the criteria. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and edit groups
> - Associate a schedule


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Create a Dynamic scope

To create a dynamic scope, follow these steps:

#### [Azure portal](#tab/az-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Azure Update Manager**.
1. Select **Overview** > **Schedule updates** > **Create a maintenance configuration**.
1. In the **Create a maintenance configuration** page, enter the details in the **Basics** tab and select **Maintenance scope** as *Guest* (Azure VM, Arc-enabled VMs/servers).
1. Select **Dynamic Scopes** and follow the steps to [Add Dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope). 
1. In **Machines** tab, select **Add machines** to add any individual machines to the maintenance configuration and select **Updates**.
1. In the **Updates** tab, select the patch classification that you want to include/exclude and select **Tags**.
1. Provide the tags in **Tags** tab.
1. Select  **Review** and then **Review + Create**.

> [!NOTE]
> A dynamic scope exists within the context of a schedule only. You can use one schedule to link to a machine, dynamic scope, or both. One dynamic scope cannot have more than one schedule.


#### [Azure CLI](#tab/az-cli)

```azurecli

    az maintenance assignment create-or-update-subscription --maintenance-configuration-id "/subscriptions/{subscription_id}/resourcegroups/{rg}/providers/Microsoft.Maintenance/maintenanceConfigurations/clitestmrpconfinguestadvanced" --name cli_dynamicscope_recording01 --filter-locations eastus2euap centraluseuap --filter-os-types windows linux --filter-tags {{tagKey1:[tagKey1Val1,tagKey1Val2],tagKey2:[tagKey2Val1,tagKey2Val2]}} --filter-resource-group rg1, rg2 --filter-tags-operator All -l global
```
#### [PowerShell](#tab/az-ps)

```powershell
    New-AzConfigurationAssignment -ConfigurationAssignmentName $maintenanceConfigurationName -MaintenanceConfigurationId $maintenanceConfigurationInGuestPatchCreated.Id -FilterLocation eastus2euap,centraluseuap -FilterOsType Windows,Linux -FilterTag '{"tagKey1" : ["tagKey1Value1", "tagKey1Value2"], "tagKey2" : ["tagKey2Value1", "tagKey2Value2", "tagKey2Value3"] }' -FilterOperator "Any"
```
---

## Provide the consent
Obtaining consent to apply updates is an important step in the workflow of scheduled patching and follow the steps on various ways to [provide the consent](manage-dynamic-scoping.md#provide-consent-to-apply-updates).



## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
