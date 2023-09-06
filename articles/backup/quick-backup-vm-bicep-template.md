---
title: Quickstart - Bicep template VM Backup
description: Learn how to back up your virtual machines with a Bicep template
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 11/17/2021
ms.reviewer: Daya-Patil
ms.custom: mvc, subject-bicepqs, mode-arm, devx-track-bicep
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

#  Back up a virtual machine in Azure with a Bicep template

[Azure Backup](backup-overview.md) allows you to back up your Azure VM using multiple options - such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This article describes how to back up an Azure VM with an Azure Bicep template and Azure PowerShell. This quickstart focuses on the process of deploying a Bicep template to create a Recovery Services vault. For more information on developing Bicep templates, see the [Bicep documentation](../azure-resource-manager/bicep/deploy-cli.md) and the [template reference](/azure/templates/microsoft.recoveryservices/allversions).

Bicep is a language for declaratively deploying Azure resources. You can use Bicep instead of JSON to develop your Azure Resource Manager templates (ARM templates). Bicep syntax reduces the complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON that provides all JSON template capabilities. During deployment, the Bicep CLI converts a Bicep file into an ARM template JSON. A Bicep file states the Azure resources and resource properties, without writing a sequence of programming commands to create resources.

Resource types, API versions, and properties that are valid in an ARM template, are also valid in a Bicep file.

## Prerequisites

To set up your environment for Bicep development, see [Install Bicep tools](../azure-resource-manager/bicep/install.md).

>[!Note]
>Install the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az) and the Bicep CLI as detailed in article.

## Review the template

The template used below is from [Azure quickstart templates](https://azure.microsoft.com/resources/templates/recovery-services-create-vm-and-configure-backup/). This template allows you to deploy simple Windows VM and Recovery Services vault configured with _DefaultPolicy_ for _Protection_.

```bicep
@description('Specifies a name for generating resource names.')
@maxLength(8)
param projectName string

@description('Specifies the location for all resources.')
param location string = resourceGroup().location

@description('Specifies the administrator username for the Virtual Machine.')
param adminUsername string

@description('Specifies the administrator password for the Virtual Machine.')
@secure()
param adminPassword string

@description('Specifies the unique DNS Name for the Public IP used to access the Virtual Machine.')
param dnsLabelPrefix string

@description('Virtual machine size.')
param vmSize string = 'Standard_A2'

@description('Specifies the Windows version for the VM. This will pick a fully patched image of this given Windows version.')
@allowed([
  '2008-R2-SP1'
  '2012-Datacenter'
  '2012-R2-Datacenter'
  '2016-Nano-Server'
  '2016-Datacenter-with-Containers'
  '2016-Datacenter'
  '2019-Datacenter'
  '2019-Datacenter-Core'
  '2019-Datacenter-Core-smalldisk'
  '2019-Datacenter-Core-with-Containers'
  '2019-Datacenter-Core-with-Containers-smalldisk'
  '2019-Datacenter-smalldisk'
  '2019-Datacenter-with-Containers'
  '2019-Datacenter-with-Containers-smalldisk'
])
param windowsOSVersion string = '2016-Datacenter'

var storageAccountName = '${projectName}store'
var networkInterfaceName = '${projectName}-nic'
var vNetAddressPrefix = '10.0.0.0/16'
var vNetSubnetName = 'default'
var vNetSubnetAddressPrefix = '10.0.0.0/24'
var publicIPAddressName = '${projectName}-ip'
var vmName = '${projectName}-vm'
var vNetName = '${projectName}-vnet'
var vaultName = '${projectName}-vault'
var backupFabric = 'Azure'
var backupPolicyName = 'DefaultPolicy'
var protectionContainer = 'iaasvmcontainer;iaasvmcontainerv2;${resourceGroup().name};${vmName}'
var protectedItem = 'vm;iaasvmcontainerv2;${resourceGroup().name};${vmName}'
var networkSecurityGroupName = 'default-NSG'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}

resource publicIPAddress 'Microsoft.Network/publicIPAddresses@2020-06-01' = {
  name: publicIPAddressName
  location: location
  properties: {
    publicIPAllocationMethod: 'Dynamic'
    dnsSettings: {
      domainNameLabel: dnsLabelPrefix
    }
  }
}

resource networkSecurityGroup 'Microsoft.Network/networkSecurityGroups@2020-06-01' = {
  name: networkSecurityGroupName
  location: location
  properties: {
    securityRules: [
      {
        name: 'default-allow-3389'
        properties: {
          priority: 1000
          access: 'Allow'
          direction: 'Inbound'
          destinationPortRange: '3389'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
        }
      }
    ]
  }
}

resource vNet 'Microsoft.Network/virtualNetworks@2020-06-01' = {
  name: vNetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        vNetAddressPrefix
      ]
    }
    subnets: [
      {
        name: vNetSubnetName
        properties: {
          addressPrefix: vNetSubnetAddressPrefix
          networkSecurityGroup: {
            id: networkSecurityGroup.id
          }
        }
      }
    ]
  }
}

resource networkInterface 'Microsoft.Network/networkInterfaces@2020-06-01' = {
  name: networkInterfaceName
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicIPAddress.id
          }
          subnet: {
            id: '${vNet.id}/subnets/${vNetSubnetName}'
          }
        }
      }
    ]
  }
}

resource virtualMachine 'Microsoft.Compute/virtualMachines@2020-06-01' = {
  name: vmName
  location: location
  properties: {
    hardwareProfile: {
      vmSize: vmSize
    }
    osProfile: {
      computerName: vmName
      adminUsername: adminUsername
      adminPassword: adminPassword
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsServer'
        offer: 'WindowsServer'
        sku: windowsOSVersion
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
      }
      dataDisks: [
        {
          diskSizeGB: 1023
          lun: 0
          createOption: 'Empty'
        }
      ]
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: networkInterface.id
        }
      ]
    }
    diagnosticsProfile: {
      bootDiagnostics: {
        enabled: true
        storageUri: storageAccount.properties.primaryEndpoints.blob
      }
    }
  }
}

resource recoveryServicesVault 'Microsoft.RecoveryServices/vaults@2020-02-02' = {
  name: vaultName
  location: location
  sku: {
    name: 'RS0'
    tier: 'Standard'
  }
  properties: {}
}

resource vaultName_backupFabric_protectionContainer_protectedItem 'Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems@2020-02-02' = {
  name: '${vaultName}/${backupFabric}/${protectionContainer}/${protectedItem}'
  properties: {
    protectedItemType: 'Microsoft.Compute/virtualMachines'
    policyId: '${recoveryServicesVault.id}/backupPolicies/${backupPolicyName}'
    sourceResourceId: virtualMachine.id
  }
} 

```

The resources defined in the above template are:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
- [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
- [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)
- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
- [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces)
- [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines)
- [Microsoft.RecoveryServices/vaults](/azure/templates/microsoft.recoveryservices/2016-06-01/vaults)
- [Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems](/azure/templates/microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protecteditems)

## Deploy the template

To deploy the template, select _Try it_ to open the Azure Cloud Shell, and then paste the following PowerShell script in the shell window. To paste the code, right-click the shell window and then select **Paste**.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name (limited to eight characters) that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (for example, centralus)"
$adminUsername = Read-Host -Prompt "Enter the administrator username for the virtual machine"
$adminPassword = Read-Host -Prompt "Enter the administrator password for the virtual machine" -AsSecureString
$dnsPrefix = Read-Host -Prompt "Enter the unique DNS Name for the Public IP used to access the virtual machine"

$resourceGroupName = "${projectName}rg"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.recoveryservices/recovery-services-create-vm-and-configure-backup/main.bicep"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName -adminUsername $adminUsername -adminPassword $adminPassword -dnsLabelPrefix $dnsPrefix 

```

## Validate the deployment

### Start a backup job

The template creates a VM and enables backup on the VM. After you deploy the template, you need to start a backup job. For more information, see [Start a backup job](quick-backup-vm-powershell.md#start-a-backup-job).

### Monitor the backup job

To monitor the backup job, see [Monitor the backup job](quick-backup-vm-powershell.md#monitor-the-backup-job).

## Clean up resources

- If you no longer need to back up the VM, you can clean it up.
- To try out restoring the VM, skip the clean-up process.
- If you've used an existing VM, you can skip the final [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to keep the resource group and VM.

Follow these steps:

1. Disable protection, remove the restore points and vault.

1. Delete the resource group and associated VM resources, as follows:

   ```azurepowershell
   Disable-AzRecoveryServicesBackupProtection -Item $item -RemoveRecoveryPoints
   $vault = Get-AzRecoveryServicesVault -Name "myRecoveryServicesVault"
   Remove-AzRecoveryServicesVault -Vault $vault
   Remove-AzResourceGroup -Name "myResourceGroup" 

   ```

## Next steps

In this quickstart, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point.

- [Learn how](tutorial-backup-vm-at-scale.md) to back up VMs in the Azure portal.
- [Learn how](tutorial-restore-disk.md) to quickly restore a VM
- [Learn how](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md?tabs=CLI) to create Bicep templates.
- [Learn how](../azure-resource-manager/bicep/decompile.md?tabs=azure-cli) to decompile Azure Resource Manager templates (ARM templates) to Bicep files.
