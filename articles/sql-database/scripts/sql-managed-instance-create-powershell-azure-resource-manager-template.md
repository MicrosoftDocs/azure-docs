---
title: PowerShell example - create a managed instance in Azure SQL Database | Microsoft Docs
description: Azure PowerShell example script to create a managed instance in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
manager: craigg
ms.date: 03/12/2019
---
# Use PowerShell with Azure Resource Manager template to create a managed instance in Azure SQL Database

Azure SQL Database Managed Instance can be created using Azure PowerShell library and Azure Resource Manager templates.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires AZ PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

Azure PowerShell commands can start deployment using predefined Azure Resource Manager template. The following properties can be specified in the template:

- Instance name
- SQL administrator username and password.
- Size of the instance (number of cores and max storage size).
- VNet and subnet where the instance will be placed.
- Server-level collation of the instance (Preview).

Instance name, SQL Administrator user name, VNet/subnet, and collation cannot be changed later. Other instance properties can be changed.

## Prerequisites

This sample assumes that you have [created a valid network environment](../sql-database-managed-instance-create-vnet-subnet.md) or [modified existing VNet](../sql-database-managed-instance-configure-vnet-subnet.md) for your Managed Instance. The sample uses the cmdlets [New-AzResourceGroupDeployment](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroupdeployment) and [Get-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/get-azvirtualnetwork) so make sure that you have installed the following PowerShell modules:

```powershell
Install-Module Az.Network
Install-Module Az.Resources
```

## Azure Resource Manager template

The following content should be placed in a file that represents a template that will be used to create the instance:

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
                "name": "GP_Gen4",
                "tier": "GeneralPurpose"
            },
            "properties": {
                "administratorLogin": "[parameters('user')]",
                "administratorLoginPassword": "[parameters('pwd')]",
                "subnetId": "[parameters('subnetId')]",
                "storageSizeInGB": 256,
                "vCores": 8,
                "licenseType": "LicenseIncluded",
                "hardwareFamily": "Gen4",
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

Assumption is that Azure VNet with the properly configured subnet already exists. If you do not have a properly configured subnet, prepare the network environment using separate [Azure Resource Managed template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-managed-instance-azure-environment) that can be executed independently or included in this template.

Save the content of this file as .json file, put the file path in the following PowerShell script, and change the names of the objects in the script:

```powershell
$subscriptionId = "ed827499-xxxx-xxxx-xxxx-xxxxxxxxxx"
Select-AzSubscription -SubscriptionId $subscriptionId

# Managed Instance properties
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

# Deploy Instance using Azure Resource Manager template:
New-AzResourceGroupDeployment  -Name MyDeployment -ResourceGroupName $resourceGroup  `
                                    -TemplateFile 'C:\...\create-managed-instance.json' `
                                    -instance $name -user $user -pwd $secpasswd -subnetId $subnetId
```

Once the script has been successfully run, the SQL Database can be accessed from all Azure services and the configured IP address.

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
