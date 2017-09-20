---
title: Azure SKU not available errors | Microsoft Docs
description: Describes how to troubleshoot the SKU not available error during deployment.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: support-article
ms.date: 09/13/2017
ms.author: tomfitz

---
# Resolve errors for SKU not available

This article describes how to resolve the **SkuNotAvailable** error.

## Symptom

When deploying a resource (typically a virtual machine), you receive the following error code and error message:

```
Code: SkuNotAvailable
Message: The requested tier for resource '<resource>' is currently not available in location '<location>' 
for subscription '<subscriptionID>'. Please try another tier or deploy to a different location.
```

## Cause

You receive this error when the resource SKU you have selected (such as VM size) is not available for the location you have selected.

## Solution

To resolve this issue, you need to determine which SKUs are available in a region. You can use PowerShell, the portal, or a REST operation to find available SKUs.

### Solution 1

Use the [Get-AzureRmComputeResourceSku](/powershell/module/azurerm.compute/get-azurermcomputeresourcesku) command in PowerShell. Filter the results by location. You must have the latest version of PowerShell for this command.

```powershell
Get-AzureRmComputeResourceSku | where {$_.Locations.Contains("southcentralus")}
```

The results include a list of SKUs for the location and any restrictions for that SKU.

```powershell
ResourceType                Name      Locations Restriction                      Capability Value
------------                ----      --------- -----------                      ---------- -----
availabilitySets         Classic southcentralus             MaximumPlatformFaultDomainCount     3
availabilitySets         Aligned southcentralus             MaximumPlatformFaultDomainCount     3
virtualMachines      Standard_A0 southcentralus
virtualMachines      Standard_A1 southcentralus
virtualMachines      Standard_A2 southcentralus
```

### Solution 2

Use the [portal](https://portal.azure.com). Log in to the portal, and add a resource through the interface. As you set the values, you see the available SKUs for that resource. You do not need to complete the deployment.

![available SKUs](./media/resource-manager-sku-not-available-errors/view-sku.png)

### Solution 3

Use the REST API for virtual machines. Send the following request:

```HTTP 
GET
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/skus?api-version=2016-03-30
```

It returns available SKUs and regions in the following format:

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
    ...
  ]
}
```

If you are unable to find a suitable SKU in that region or an alternative region that meets your business needs, submit a [SKU request](https://aka.ms/skurestriction) to Azure Support.