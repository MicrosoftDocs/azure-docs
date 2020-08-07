---
title: "Create a managed instance (ARM template & PowerShell)"
titleSuffix: Azure SQL Managed Instance 
description: Use this Azure PowerShell example script to create a managed instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: "seo-dt-2019"
ms.devlang: PowerShell
ms.topic: sample
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
ms.date: 03/12/2019
---

# Use PowerShell with an Azure Resource Manager template to create a managed instance

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqlmi.md)]

You can create a managed instance by using the Azure PowerShell library and Azure Resource Manager templates.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, run `Connect-AzAccount` to create a connection to Azure.

Azure PowerShell commands can start deployment using a predefined Azure Resource Manager template. The following properties can be specified in the template:

- Managed instance name
- SQL administrator username and password.
- Size of the instance (number of cores and max storage size).
- VNet and subnet where the instance will be placed.
- Server-level collation of the instance (preview).

Instance name, SQL administrator username, VNet/subnet, and collation cannot be changed later. Other instance properties can be changed.

## Prerequisites

This sample assumes that you have [created a valid network environment](../virtual-network-subnet-create-arm-template.md) or [modified an existing VNet](../vnet-existing-add-subnet.md) for your managed instance. You can prepare the network environment using a separate [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-managed-instance-azure-environment), if necessary. 


The sample uses the cmdlets [New-AzResourceGroupDeployment](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroupdeployment) and [Get-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/get-azvirtualnetwork), so make sure that you have installed the following PowerShell modules:

```powershell
Install-Module Az.Network
Install-Module Az.Resources
```

## Azure Resource Manager template


Save the following script into a .json file, and note the file location: 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "instance": {
            "type": "string"
        },
        "user": {
            "type": "string"
        },
        "pwd": {
            "type": "securestring"
        },
        "subnetId": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[parameters('instance')]",
            "location": "West Central US",
            "tags": {
                "Description":"GP Instance with custom instance collation - Serbian_Cyrillic_100_CS_AS"
            },
            "sku": {
                "name": "GP_Gen5",
                "tier": "GeneralPurpose"
            },
            "properties": {
                "administratorLogin": "[parameters('user')]",
                "administratorLoginPassword": "[parameters('pwd')]",
                "subnetId": "[parameters('subnetId')]",
                "storageSizeInGB": 256,
                "vCores": 8,
                "licenseType": "LicenseIncluded",
                "hardwareFamily": "Gen5",
                "collation": "Serbian_Cyrillic_100_CS_AS"
            },
            "type": "Microsoft.Sql/managedInstances",
            "identity": {
                "type": "SystemAssigned"
            },
            "apiVersion": "2015-05-01-preview"
        }
    ]
}
```

Update the following PowerShell script with the correct file path for the .json file you saved previously, and change the names of the objects in the script:

```powershell
$subscriptionId = "ed827499-xxxx-xxxx-xxxx-xxxxxxxxxx"
Select-AzSubscription -SubscriptionId $subscriptionId

# Managed instance properties
$resourceGroup = "rg_mi"
$location = "West Central US"
$name = "managed-instance-name"
$user = "miSqlAdmin"
$secpasswd = ConvertTo-SecureString "<Put some strong password here>" -AsPlainText -Force

# Network configuration
$vNetName = "my_vnet"
$vNetResourceGroup = "rg_mi_vnet"
$subnetName = "ManagedInstances"
$vNet = Get-AzVirtualNetwork -Name $vNetName -ResourceGroupName $vNetResourceGroup
$subnet = Get-AzVirtualNetworkSubnetConfig -Name $SubnetName -VirtualNetwork $vNet
$subnetId = $subnet.Id

# Deploy instance using Azure Resource Manager template:
New-AzResourceGroupDeployment  -Name MyDeployment -ResourceGroupName $resourceGroup  `
                                    -TemplateFile 'C:\...\create-managed-instance.json' `
                                    -instance $name -user $user -pwd $secpasswd -subnetId $subnetId
```

Once the script completes, the managed instance can be accessed from all Azure services and the configured IP address.

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional PowerShell script samples for Azure SQL Managed Instance can be found in [Azure SQL Managed Instance PowerShell scripts](../../database/powershell-script-content-guide.md).
