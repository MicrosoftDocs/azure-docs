---
title: Connect environments to a lab's vnet in Azure DevTest Labs | Microsoft Docs
description: Learn how to connect an environment (like Service Fabric cluster) to your lab's virtual network in Azure DevTest Labs
services: devtest-lab,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/01/2019
ms.author: spelluru

---

# Connect an environment to your lab's virtual network in Azure DevTest Labs
Azure DevTest Labs makes it easy to create VMs in a lab with [built-in networking](devtest-lab-configure-vnet.md). It has a great deal of flexibility with the ability to [create multi-VM environments](devtest-lab-test-env.md). This article shows you how to connect VMs in an environment to the lab virtual network. One scenario where you use this feature is setting up an N-tier app with a SQL Server data tier that is connected to the lab VNet allowing test VMs in the lab to access it.  

## Sample environment that uses lab VNet
Here is a simple environment template that connects the lab's subnet. In this sample, the `DTLSubnetId` parameter represents the ID of the subnet in which the lab exists. It's assigned to: `$(LabSubnetId)`, which is automatically resolved by DevTest Labs to the ID of the lab's subnet. The **subnet** property of the **network interface** of the VM in this definition is set to `DTLSubnetId` so that it joins the same subnet. 

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"DTLEnvironVmStoretype": {
			"type": "string",
			"defaultValue": "Standard_LRS",
			"allowedValues": [
				"Standard_LRS",
				"Standard_ZRS",
				"Standard_GRS",
				"Standard_RAGRS",
				"Premium_LRS"
			]
		},
		"DTLEnvironVmName": {
			"type": "string",
			"minLength": 1
		},
		"VmAdminUserName": {
			"type": "string",
			"minLength": 1
		},
		"VmAdminUserPassword": {
			"type": "securestring"
		},
		"DTLEnvironVmOsVersion": {
			"type": "string",
			"defaultValue": "2012-R2-Datacenter",
			"allowedValues": [
				"2008-R2-SP1",
				"2012-Datacenter",
				"2012-R2-Datacenter",
				"Windows-Server-Technical-Preview"
			]
		},
		"DTLSubnetId": {
			"type": "string",
			"defaultValue": "$(LabSubnetId)"
		}
	},
	"variables": {
		"DTLEnvironStoreName": "[toLower([concat(parameters('DTLEnvironVmName'), 'storename')])]",
		"DTLEnvironVmImagePublisher": "MicrosoftWindowsServer",
		"DTLEnvironVmImageOffer": "WindowsServer",
		"DTLEnvironVmOSDiskName": "[concat(parameters('DTLEnvironVmName'), 'OSDisk')]",
		"DTLEnvironVmSize": "Standard_D2_v2",
		"DTLEnvironVmStorageAccountContainerName": "vhds",
		"DTLEnvironVmNicName": "[concat(parameters('DTLEnvironVmName'), 'NetworkInterface')]"
	},
	"resources": [{
			"name": "[variables('DTLEnvironStoreName')]",
			"type": "Microsoft.Storage/storageAccounts",
			"location": "[resourceGroup().location]",
			"apiVersion": "2016-01-01",
			"sku": {
				"name": "[parameters('DTLEnvironVmStoretype')]"
			},
			"dependsOn": [],
			"tags": {
				"displayName": "[variables('DTLEnvironStoreName')]"
			},
			"kind": "Storage"
		},
		{
			"name": "[variables('DTLEnvironVmNicName')]",
			"type": "Microsoft.Network/networkInterfaces",
			"location": "southeastasia",
			"apiVersion": "2016-03-30",
			"dependsOn": [],
			"tags": {
				"displayName": "[variables('DTLEnvironVmNicName')]"
			},
			"properties": {
				"ipConfigurations": [{
					"name": "ipconfig1",
					"properties": {
						"privateIPAllocationMethod": "Dynamic",
						"subnet": {
							"id": "[parameters('DTLSubnetId')]"
						}
					}
				}]
			}
		},
		{
			"name": "[parameters('DTLEnvironVmName')]",
			"type": "Microsoft.Compute/virtualMachines",
			"location": "[resourceGroup().location]",
			"apiVersion": "2015-06-15",
			"dependsOn": [
				"[resourceId('Microsoft.Storage/storageAccounts', variables('DTLEnvironStoreName'))]",
				"[resourceId('Microsoft.Network/networkInterfaces', variables('DTLEnvironVmNicName'))]"
			],
			"tags": {
				"displayName": "[parameters('DTLEnvironVmName')]"
			},
			"properties": {
				"hardwareProfile": {
					"vmSize": "[variables('DTLEnvironVmSize')]"
				},
				"osProfile": {
					"computerName": "[parameters('DTLEnvironVmName')]",
					"adminUsername": "[parameters('VmAdminUserName')]",
					"adminPassword": "[parameters('VmAdminUserPassword')]"
				},
				"storageProfile": {
					"imageReference": {
						"publisher": "[variables('DTLEnvironVmImagePublisher')]",
						"offer": "[variables('DTLEnvironVmImageOffer')]",
						"sku": "[parameters('DTLEnvironVmOsVersion')]",
						"version": "latest"
					},
					"osDisk": {
						"name": "[variables('DTLEnvironVmOSDiskName')]",
						"vhd": {
							"uri": "[concat(reference(resourceId('Microsoft.Storage/storageAccounts', variables('DTLEnvironStoreName')), '2016-01-01').primaryEndpoints.blob, variables('DTLEnvironVmStorageAccountContainerName'), '/', variables('DTLEnvironVmOSDiskName'), '.vhd')]"
						},
						"caching": "ReadWrite",
						"createOption": "FromImage"
					}
				},
				"networkProfile": {
					"networkInterfaces": [{
						"id": "[resourceId('Microsoft.Network/networkInterfaces', variables('DTLEnvironVmNicName'))]"
					}]
				}
			}
		}
	],
	"outputs": {}
}
```

## Next steps
See the following article for using the Azure portal to do these operations: [Restart a VM](devtest-lab-restart-vm.md).