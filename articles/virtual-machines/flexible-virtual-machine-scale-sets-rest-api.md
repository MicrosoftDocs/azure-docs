---
title: Create virtual machines in a Flexible scale set using REST API
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using REST API.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 05/24/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Create virtual machines in a Flexible scale set using REST API

**Applies to:** :heavy_check_mark: Flexible scale sets


This article steps through using the REST API to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first [register your subscription for the preview feature](flexible-virtual-machine-scale-sets.md#register-for-flexible-orchestration-mode). The registration may take several minutes to complete.


## Get started with Flexible orchestration mode

1. Create an empty scale set. The following parameters are required:
    - API version 2019-12-01 (or greater)
    - Single placement group must be `false` when creating a Flexible scale set

	```json
	{
	"type": "Microsoft.Compute/virtualMachineScaleSets",
	"name": "[parameters('virtualMachineScaleSetName')]",
	"apiVersion": "2019-12-01",
	"location": "[parameters('location')]",
	"properties": {
		"singlePlacementGroup": false,
		"platformFaultDomainCount": "[parameters('virtualMachineScaleSetPlatformFaultDomainCount')]"
		},
	"zones": "[variables('selectedZone')]"
	}
	```

2. Add virtual machines to the scale set.
    1. Assign the `virtualMachineScaleSet` property to the scale set you have previously created. You are required to specify the `virtualMachineScaleSet` property at the time of VM creation.
    1. You can use the **copy()** Azure Resource Manager template function to create multiple VMs at the same time. See [Resource iteration](../azure-resource-manager/templates/copy-resources.md#iteration-for-a-child-resource) in Azure Resource Manager templates.

    ```json
    {
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[concat(parameters('virtualMachineNamePrefix'), copyIndex(1))]",
    "apiVersion": "2019-12-01",
    "location": "[parameters('location')]",
    "copy": {
    	"name": "VMcopy",
    	"count": "[parameters('virtualMachineCount')]"
    	},
    "dependsOn": [
    	"
    	[resourceID('Microsoft.Compute/virtualMachineScaleSets', parameters('virtualMachineScaleSetName'))]",
    	"
    	[resourceID('Microsoft.Storage/storageAccounts', variables('diagnosticsStorageAccountName'))]",
    	"
    	[resourceID('Microsoft.Network/networkInterfaces', concat(parameters('virtualMachineNamePrefix'), copyIndex(1), '-NIC1'))]"
    	],
    "properties": {
    	"virtualMachineScaleSet": {
    		"id": "[resourceID('Microsoft.Compute/virtualMachineScaleSets', parameters('virtualMachineScaleSetName'))]"
        }
    }
    ```

See [Add multiple VMs into a Virtual Machine Scale Set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-vmss-flexible-orchestration-mode) for a full example.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)