---
title: Resource quota errors
description: Describes how to resolve resource quota errors when deploying resources with an Azure Resource Manager template (ARM template) or Bicep file.
ms.topic: troubleshooting
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 04/05/2023
---

# Resolve errors for resource quotas

This article describes resource quota errors that might occur when you deploy resources with an Azure Resource Manager template (ARM template) or Bicep file.

## Symptom

If your template creates resources that exceed your Azure quotas, you might get the following error:

```Output
Code=OperationNotAllowed
Message=Operation results in exceeding quota limits of Core.
Maximum allowed: 4, Current in use: 4, Additional requested: 2.
```

Or, you might see this error:

```Output
Code=ResourceQuotaExceeded
Message=Creating the resource of type <resource-type> would exceed the quota of <number>
resources of type <resource-type> per resource group. The current resource count is <number>,
please delete some resources of this type before creating a new one.
```

## Cause

Quotas are applied per resource group, subscriptions, accounts, and other scopes. For example, your subscription might be configured to limit the number of vCPUs for a region. If you attempt to deploy a virtual machine with more vCPUs than the permitted amount, you receive an error that the quota was exceeded.

For quota information, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use the [az vm list-usage](/cli/azure/vm#az-vm-list-usage) command to find virtual machine quotas.

```azurecli
az vm list-usage --location "West US" --output table
```

```Output
Name                                      CurrentValue    Limit
----------------------------------------  --------------  -------
Availability Sets                         0               2500
Total Regional vCPUs                      0               100
Virtual Machines                          0               25000
Virtual Machine Scale Sets                0               2500
Dedicated vCPUs                           0               3000
Cloud Services                            0               2500
Total Regional Low-priority vCPUs         0               100
Standard BS Family vCPUs                  0               100
...
```

# [PowerShell](#tab/azure-powershell)

For PowerShell, use the [Get-AzVMUsage](/powershell/module/az.compute/get-azvmusage) cmdlet to find virtual machine quotas.

```azurepowershell
Get-AzVMUsage -Location "West US"
```

```Output
Name                                     Current Value Limit  Unit
----                                     ------------- -----  ----
Availability Sets                                    0  2500 Count
Total Regional vCPUs                                 0   100 Count
Virtual Machines                                     0 25000 Count
Virtual Machine Scale Sets                           0  2500 Count
Dedicated vCPUs                                      0  3000 Count
Cloud Services                                       0  2500 Count
Total Regional Low-priority vCPUs                    0   100 Count
Standard BS Family vCPUs                             0   100 Count
...
```

---

## Solution

To request a quota increase, go to the portal and file a support issue. In the support issue, request an increase in your quota for the region into which you want to deploy.

Some quotas let you specify a quota limit that's submitted for review and either approved or rejected. If your limit is rejected, you'll see a link to open a support request.

> [!NOTE]
> Remember that for resource groups, the quota is for each individual region, not for the entire
> subscription. If you need to deploy 30 vCPUs in West US, you have to ask for 30 Resource Manager
> vCPUs in West US. If you need to deploy 30 vCPUs in any of the regions to which you have access,
> you should ask for 30 Resource Manager vCPUs in all regions.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter _subscriptions_. Or if you've recently viewed your subscription, select **Subscriptions**.

    :::image type="content" source="media/error-resource-quota/subscriptions.png" alt-text="Screenshot of the Azure portal with search box and Subscriptions highlighted.":::


1. Select the link for your subscription.

    :::image type="content" source="media/error-resource-quota/select-subscription.png" alt-text="Screenshot of the Azure portal subscriptions list, highlighting a specific subscription link.":::

1. Select **Usage + quotas**.

    :::image type="content" source="media/error-resource-quota/select-usage-quotas.png" alt-text="Screenshot of the subscription settings page, highlighting the 'Usage + quotas' option in the menu.":::

1. Select **Request increase**.

   From the quota list, you can also submit a support request for a quota increase. For quota's with a pencil icon, you can specify a quota limit.

    :::image type="content" source="media/error-resource-quota/request-increase.png" alt-text="Screenshot of the 'Usage + quotas' page, showing the 'Request increase' button and a pencil icon indicating the option to specify a quota limit.":::

1. Complete the forms for the type of quota you need to increase.

    :::image type="content" source="media/error-resource-quota/forms.png" alt-text="Screenshot of the quota increase request form, displaying various fields for users to provide details about their desired quota increase.":::
