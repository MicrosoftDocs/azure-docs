---
title: Troubleshoot allocation failures for Cloud service in Azure
description: This article shows how to resolve a LocationNotFoundForRoleSize exception when deploying a Cloud service (classic) to Azure.
services: cloud-services
author: hirenshah1
ms.author: hirshah
ms.service: cloud-services
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.custom: compute-evergreen devx-track-azurepowershell kr2b-contr-experiment
---

# Troubleshoot LocationNotFoundForRoleSize when deploying a Cloud service to Azure

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

This article troubleshoots allocation failures where a virtual machine (VM) size isn't available when you deploy an Azure Cloud service (classic).

When you deploy instances to a Cloud service (classic) or add new web or worker role instances, Microsoft Azure allocates compute resources.

You might receive errors during these operations even before you reach the Azure subscription limit.

> [!TIP]
> The information may also be useful when you plan the deployment of your services.

## Symptom

In the [Azure portal](https://portal.azure.com/), navigate to your Cloud service (classic) and in the sidebar select **Operation log (classic)** to view the logs.

:::image type="content" source="./media/cloud-services-troubleshoot-location-not-found-for-role-size/cloud-services-troubleshoot-allocation-logs.png" alt-text="Screenshot shows the Operation log (classic) pane.":::

When you inspect the logs of your Cloud service (classic), you'll see the following exception:

|Exception Type  |Error Message  |
|---------|---------|
|`LocationNotFoundForRoleSize`     |The operation '`{Operation ID}`' failed: 'The requested VM tier is currently not available in Region (`{Region ID}`) for this subscription. Please try another tier or deploy to a different location.'.|

## Cause

There's a capacity issue with the region or cluster that you're deploying to. The `LocationNotFoundForRoleSize` exception occurs when the resource SKU you've selected, the virtual machine size, isn't available for the region specified.

## Find SKUs in a region

In this scenario, you should select a different region or SKU for your Cloud service (classic) deployment. Before you deploy or upgrade your Cloud service (classic), determine which SKUs are available in a region or availability zone. Follow the [Azure CLI](#list-skus-in-region-using-azure-cli), [PowerShell](#list-skus-in-region-using-powershell), or [REST API](#list-skus-in-region-using-rest-api) processes below.

### List SKUs in region using Azure CLI

You can use the [az vm list-skus](/cli/azure/vm#az-vm-list-skus) command.

- Use the `--location` parameter to filter output to location you're using.
- Use the `--size` parameter to search by a partial size name.
- For more information, see the [Resolve error for SKU not available](../azure-resource-manager/templates/error-sku-not-available.md#solution-2---azure-cli) guide.

This sample command produces the following results:

```azurecli
az vm list-skus --location southcentralus --size Standard_F --output table
```

:::image type="content" source="./media/cloud-services-troubleshoot-constrained-allocation-failed/cloud-services-troubleshoot-constrained-allocation-failed-1.png" alt-text="Screenshot shows the Azure CLI output of running the command, which shows the available SKUs.":::

#### List SKUs in region using PowerShell

You can use the [Get-AzComputeResourceSku](/powershell/module/az.compute/get-azcomputeresourcesku) command.

- Filter the results by location.
- You must have the latest version of PowerShell for this command.
- For more information, see the [Resolve error for SKU not available](../azure-resource-manager/templates/error-sku-not-available.md#solution-1---powershell) guide.

This command filters by location:

```azurepowershell
Get-AzComputeResourceSku | where {$_.Locations -icontains "centralus"}
```

Find the locations that contain the size `Standard_DS14_v2`:

```azurepowershell
Get-AzComputeResourceSku | where {$_.Locations.Contains("centralus") -and $_.ResourceType.Contains("virtualMachines") -and $_.Name.Contains("Standard_DS14_v2")}
```

Find the locations that contain the size `V3`:

```azurepowershell
Get-AzComputeResourceSku | where {$_.Locations.Contains("centralus") -and $_.ResourceType.Contains("virtualMachines") -and $_.Name.Contains("v3")} | fc
```

#### List SKUs in region using REST API

You can use the [Resource Skus - List](/rest/api/compute/resourceskus/list) operation. It returns available SKUs and regions in the following format:

```json
{
  "value": [
    {
      "resourceType": "virtualMachines",
      "name": "Standard_A0",
      "tier": "Standard",
      "size": "A0",
      "locations": [
        "eastus"
      ],
      "restrictions": []
    },
    {
      "resourceType": "virtualMachines",
      "name": "Standard_A1",
      "tier": "Standard",
      "size": "A1",
      "locations": [
        "eastus"
      ],
      "restrictions": []
    },
      <<The rest of your file is located here>>
  ]
}
    
```

## Next steps

For more allocation failure solutions and to better understand how they're generated:

> [!div class="nextstepaction"]
> [Allocation failures - Cloud service (classic)](cloud-services-allocation-failures.md)

If your Azure issue isn't addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You also can submit an Azure support request. To submit a support request, on the [Azure support](https://azure.microsoft.com/support/options/) page, select **Get support**.
