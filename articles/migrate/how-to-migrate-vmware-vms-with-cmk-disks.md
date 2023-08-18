---
title: Migrate VMware virtual machines to Azure with server-side encryption(SSE) and customer-managed keys(CMK) using the Migration and modernization tool
description: Learn how to migrate VMware VMs to Azure with server-side encryption(SSE) and customer-managed keys(CMK) using the Migration and modernization tool 
author: jyothisuri
ms.author: jsuri
ms.topic: how-to
ms.date: 05/31/2023
ms.custom: devx-track-azurepowershell, engagement-fy23

---



# Migrate VMware VMs to Azure VMs enabled with server-side encryption and customer-managed keys

This article describes how to migrate VMware VMs to Azure virtual machines with disks encrypted using server-side encryption(SSE) with customer-managed keys(CMK), using Migration and modernization (agentless replication).

The Migration and modernization portal experience lets you [migrate VMware VMs to Azure with agentless replication.](tutorial-migrate-vmware.md) The portal experience supports DES/CMK. DES should be created before starting replication and must be provided while starting replication. It cannot be provided at the time of migration. In this article, you'll see how to create and deploy an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) to replicate a VMware VM and configure the replicated disks in Azure to use SSE with CMK.

The examples in this article use [Azure PowerShell](/powershell/azure/new-azureps-module-az) to perform the tasks needed to create and deploy the Resource Manager template.

[Learn more](../virtual-machines/disk-encryption.md) about server-side encryption (SSE) with customer managed keys(CMK) for managed disks.

## Prerequisites

- [Review the tutorial](tutorial-migrate-vmware.md) on migration of VMware VMs to Azure with agentless replication to understand tool requirements.
- [Follow these instructions](./create-manage-projects.md) to create an Azure Migrate project and add the **Migration and modernization** tool to the project.
- [Follow these instructions](how-to-set-up-appliance-vmware.md) to set up the Azure Migrate appliance for VMware in your on-premises environment and complete discovery.

## Prepare for replication

Once VM discovery is complete, the Discovered Servers line on the Migration and modernization tile will show a count of VMware VMs discovered by the appliance.

Before you can start replicating VMs, the replication infrastructure needs to be prepared.

1. Create a Service Bus instance in the target region. The Service Bus is used by the on-premises Azure Migrate appliance to communicate with the Migration and modernization service to coordinate replication and migration.
2. Create a storage account for transfer of operation logs from replication.
3. Create a storage account that the Azure Migrate appliance uploads replication data to.
4. Create a Key Vault and configure the Key Vault to manage shared access signature tokens for blob access on the storage accounts created in step 3 and 4.
5. Generate a shared access signature token for the service bus created in step 1 and create a secret for the token in the Key Vault created in the previous step.
6. Create a Key Vault access policy to give the on-premises Azure Migrate appliance (using the appliance AAD app) and the Migration and modernization Service access to the Key Vault.
7. Create a replication policy and configure the Migration and modernization service with details of the replication infrastructure created in the previous step.

The replication infrastructure must be created in the target Azure region for the migration and in the target Azure subscription that the VMs are being migrated to.

The Migration and modernization portal experience simplifies preparation of the replication infrastructure by automatically doing this for you when you replicate a VM for the first time in a project. In this article, we'll assume that you've already replicated one or more VMs using the portal experience and that the replication infrastructure is already created. We'll look at how to discover details of the existing replication infrastructure and how to use these details as inputs to the Resource Manager template that will be used to set up replication with CMK.

### Identifying replication infrastructure components

1. On the Azure portal, go the resource groups page and select the resource group in which the Azure Migrate project was created.
2. Select **Deployments** from the left menu and search for a deployment name beginning with the string *"Microsoft.MigrateV2.VMwareV2EnableMigrate"*. You'll see a list of Resource Manager templates created by the portal experience to set up replication for VMs in this project. We'll download one such template and use that as the base to prepare the template for replication with CMK.
3. To download the template, select any deployment matching the string pattern in the previous step > select **Template** from the left menu > Click **Download** from the top menu. Save the template.json file locally. You'll edit this template file in the last step.

## Create a Disk Encryption Set

A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE. To replicate VMs with CMK, you'll create a disk encryption set and pass it as an input to the replication operation.

Follow the example [here](../virtual-machines/windows/disks-enable-customer-managed-keys-powershell.md) to create a disk encryption set using Azure PowerShell. Ensure that the disk encryption set is created in the target subscription that VMs are being migrated to, and in the target Azure region for the migration.

The disk encryption set can be configured to encrypt managed disks with a customer-managed key, or for double encryption with both a customer-managed key and a platform key. To use the double encryption at rest option configure the disk encryption set as described [here](../virtual-machines/windows/disks-enable-double-encryption-at-rest-powershell.md).

In the example shown below the disk encryption set is configured to use a customer-managed key.

```azurepowershell
$Location = "southcentralus"                           #Target Azure region for migration 
$TargetResourceGroupName = "ContosoMigrationTarget"
$KeyVaultName = "ContosoCMKKV"
$KeyName = "ContosoCMKKey"
$KeyDestination = "Software"
$DiskEncryptionSetName = "ContosoCMKDES"

$KeyVault = New-AzKeyVault -Name $KeyVaultName -ResourceGroupName $TargetResourceGroupName -Location $Location -EnableSoftDelete -EnablePurgeProtection

$Key = Add-AzKeyVaultKey -VaultName $KeyVaultName -Name $KeyName -Destination $KeyDestination

$desConfig = New-AzDiskEncryptionSetConfig -Location $Location -SourceVaultId $KeyVault.ResourceId -KeyUrl $Key.Key.Kid -IdentityType SystemAssigned

$des = New-AzDiskEncryptionSet -Name $DiskEncryptionSetName -ResourceGroupName $TargetResourceGroupName -InputObject $desConfig

Set-AzKeyVaultAccessPolicy -VaultName $KeyVaultName -ObjectId $des.Identity.PrincipalId -PermissionsToKeys wrapkey,unwrapkey,get

New-AzRoleAssignment -ResourceName $KeyVaultName -ResourceGroupName $TargetResourceGroupName -ResourceType "Microsoft.KeyVault/vaults" -ObjectId $des.Identity.PrincipalId -RoleDefinitionName "Reader"
```

## Get details of the VMware VM to migrate

In this step, you'll use Azure PowerShell to get the details of the VM that needs to be migrated. These details will be used to construct the Resource Manager template for replication. Specifically, the two properties of interest are:

- The machine Resource ID for the discovered VMs.
- The list of disks for the VM and their disk identifiers.

```azurepowershell

$ProjectResourceGroup = "ContosoVMwareCMK"   #Resource group that the Azure Migrate Project is created in
$ProjectName = "ContosoVMwareCMK"            #Name of the Azure Migrate Project

$solution = Get-AzResource -ResourceGroupName $ProjectResourceGroup -ResourceType Microsoft.Migrate/MigrateProjects/solutions -ExpandProperties -ResourceName $ProjectName | where Name -eq "Servers-Discovery-ServerDis
covery"

# Displays one entry for each appliance in the project mapping the appliance to the VMware sites discovered through the appliance.
$solution.Properties.details.extendedDetails.applianceNameToSiteIdMapV2 | ConvertFrom-Json | select ApplianceName, SiteId
```
```Output
ApplianceName  SiteId
-------------  ------
VMwareApplianc /subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite
```

Copy the value of the SiteId string corresponding to the Azure Migrate appliance that the VM is discovered through. In the example shown above, the SiteId is *"/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite"*

```azurepowershell

#Replace value with SiteId from the previous step
$SiteId = "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite"
$SiteName = Get-AzResource -ResourceId $SiteId -ExpandProperties | Select-Object -ExpandProperty Name
$DiscoveredMachines = Get-AzResource -ResourceGroupName $ProjectResourceGroup -ResourceType Microsoft.OffAzure/VMwareSites/machines  -ExpandProperties -ResourceName $SiteName

#Get machine details
PS /home/bharathram> $MachineName = "FPL-W19-09"     #Replace string with VMware VM name of the machine to migrate
PS /home/bharathram> $machine = $Discoveredmachines | where {$_.Properties.displayName -eq $MachineName}
PS /home/bharathram> $machine.count   #Validate that only 1 VM was found matching this name.
```

Copy the ResourceId, name and disk uuid values for the machine to be migrated.
```Output
PS > $machine.Name
10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_50098f99-f949-22ca-642b-724ec6595210
PS > $machine.ResourceId
/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite/machines/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_50098f99-f949-22ca-642b-724ec6595210

PS > $machine.Properties.disks | select uuid, label, name, maxSizeInBytes

uuid                                 label       name    maxSizeInBytes
----                                 -----       ----    --------------
6000C291-5106-2aac-7a74-4f33c3ddb78c Hard disk 1 scsi0:0    42949672960
6000C293-39a1-bd70-7b24-735f0eeb79c4 Hard disk 2 scsi0:1    53687091200
6000C29e-cbee-4d79-39c7-d00dd0208aa9 Hard disk 3 scsi0:2    53687091200

```

## Create Resource Manager template for replication

- Open the Resource Manager template file that you downloaded in the **Identifying replication infrastructure components** step in an editor of your choice.
- Remove all resource definitions from the template except for resources that are of type *"Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems"*
- If there are multiple resource definitions of the above type, remove all but one. Remove any **dependsOn** property definitions from the resource definition.
- At the end of this step, you should have a file that looks like the example below and has the same set of properties.

```
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems",
            "apiVersion": "2018-01-10",
            "name": "ContosoMigration7371rsvault/VMware104e4replicationfabric/VMware104e4replicationcontainer/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_500937f3-805e-9414-11b1-f22923456e08",
            "properties": {
                "policyId": "/Subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.RecoveryServices/vaults/ContosoMigration7371rsvault/replicationPolicies/migrateVMware104e4sitepolicy",
                "providerSpecificDetails": {
                    "instanceType": "VMwareCbt",
                    "vmwareMachineId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.OffAzure/VMwareSites/VMware104e4site/machines/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_500937f3-805e-9414-11b1-f22923456e08",
                    "targetResourceGroupId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/PayrollRG",
                    "targetNetworkId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/PayrollRG/providers/Microsoft.Network/virtualNetworks/PayrollNW",
                    "targetSubnetName": "PayrollSubnet",
                    "licenseType": "NoLicenseType",
                    "disksToInclude": [
                        {
                            "diskId": "6000C295-dafe-a0eb-906e-d47cb5b05a1d",
                            "isOSDisk": "true",
                            "logStorageAccountId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.Storage/storageAccounts/migratelsa1432469187",
                            "logStorageAccountSasSecretName": "migratelsa1432469187-cacheSas",
                            "diskType": "Standard_LRS"
                        }
                    ],
                    "dataMoverRunAsAccountId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.OffAzure/VMwareSites/VMware104e4site/runasaccounts/b090bef3-b733-5e34-bc8f-eb6f2701432a",
                    "snapshotRunAsAccountId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.OffAzure/VMwareSites/VMware104e4site/runasaccounts/b090bef3-b733-5e34-bc8f-eb6f2701432a",
                    "targetBootDiagnosticsStorageAccountId": "/subscriptions/6785ea1f-ac40-4244-a9ce-94b12fd832ca/resourceGroups/ContosoMigration/providers/Microsoft.Storage/storageAccounts/migratelsa1432469187",
                    "targetVmName": "PayrollWeb04"
                }
            }
        }
    ]
}
```

- Edit the **name** property in the resource definition. Replace the string that follows the last "/" in the name property with the value of *$machine.Name*( from the previous step).
- Change the value of the **properties.providerSpecificDetails.vmwareMachineId** property with value of *$machine.ResourceId*( from the previous step).
- Set the values for **targetResourceGroupId**, **targetNetworkId**, **targetSubnetName** to the target resource group ID, target virtual network resource ID, and target subnet name respectively.
- Set the value of **licenseType** to "WindowsServer" to apply Azure Hybrid Benefit for this VM. If this VM is not eligible for Azure Hybrid Benefit, set the value of **licenseType** to NoLicenseType.
- Change the value of the **targetVmName** property to the desired Azure virtual machine name for the migrated VM.
- Optionally add a property named **targetVmSize** below the **targetVmName** property. Set the value of the **targetVmSize** property to the desired Azure virtual machine size for the migrated VM.
- The **disksToInclude** property is a list of disk inputs for replication with each list item representing one on-premises disk. Create as many list items as the number of disks on the on-premises VM. Replace the **diskId** property in the list item to the uuid of the disks identified in the previous step. Set the **isOSDisk** value to "true" for the OS disk of the VM and "false" for all other disks. Leave the **logStorageAccountId** and the **logStorageAccountSasSecretName** properties unchanged. Set the **diskType** value to the Azure Managed Disk type (*Standard_LRS, Premium_LRS, StandardSSD_LRS*) to use for the disk. For the disks that need to be encrypted with CMK, add a property named **diskEncryptionSetId** and set the value to the resource ID of the disk encryption set created(**$des.Id**) in the *Create a Disk Encryption Set* step
- Save the edited template file. For the example above, the edited template file looks as follows:

```
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems",
            "apiVersion": "2018-01-10",
            "name": "ContosoVMwareCMK00ddrsvault/VMwareApplianca8bareplicationfabric/VMwareApplianca8bareplicationcontainer/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_50098f99-f949-22ca-642b-724ec6595210",
            "properties": {
                "policyId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.RecoveryServices/vaults/ContosoVMwareCMK00ddrsvault/replicationPolicies/migrateVMwareApplianca8basitepolicy",
                "providerSpecificDetails": {
                    "instanceType": "VMwareCbt",
                    "vmwareMachineId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite/machines/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_50098f99-f949-22ca-642b-724ec6595210",
                    "targetResourceGroupId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoMigrationTarget",
                    "targetNetworkId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/cmkRTest/providers/Microsoft.Network/virtualNetworks/cmkvm1_vnet",
                    "targetSubnetName": "cmkvm1_subnet",
                    "licenseType": "NoLicenseType",
                    "disksToInclude": [
                        {
                            "diskId": "6000C291-5106-2aac-7a74-4f33c3ddb78c",
                            "isOSDisk": "true",
                            "logStorageAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.Storage/storageAccounts/migratelsa1671875959",
                            "logStorageAccountSasSecretName": "migratelsa1671875959-cacheSas",
                            "diskEncryptionSetId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/CONTOSOMIGRATIONTARGET/providers/Microsoft.Compute/diskEncryptionSets/ContosoCMKDES",
                            "diskType": "Standard_LRS"
                        },
                        {
                            "diskId": "6000C293-39a1-bd70-7b24-735f0eeb79c4",
                            "isOSDisk": "false",
                            "logStorageAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.Storage/storageAccounts/migratelsa1671875959",
                            "logStorageAccountSasSecretName": "migratelsa1671875959-cacheSas",
                            "diskEncryptionSetId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/CONTOSOMIGRATIONTARGET/providers/Microsoft.Compute/diskEncryptionSets/ContosoCMKDES",
                            "diskType": "Standard_LRS"
                        },
                        {
                            "diskId": "6000C29e-cbee-4d79-39c7-d00dd0208aa9",
                            "isOSDisk": "false",
                            "logStorageAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.Storage/storageAccounts/migratelsa1671875959",
                            "logStorageAccountSasSecretName": "migratelsa1671875959-cacheSas",
                            "diskEncryptionSetId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/CONTOSOMIGRATIONTARGET/providers/Microsoft.Compute/diskEncryptionSets/ContosoCMKDES",
                            "diskType": "Standard_LRS"
                        }
                    ],
                    "dataMoverRunAsAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite/runasaccounts/b090bef3-b733-5e34-bc8f-eb6f2701432a",
                    "snapshotRunAsAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.OffAzure/VMwareSites/VMwareApplianca8basite/runasaccounts/b090bef3-b733-5e34-bc8f-eb6f2701432a",
                    "targetBootDiagnosticsStorageAccountId": "/subscriptions/509099b2-9d2c-4636-b43e-bd5cafb6be69/resourceGroups/ContosoVMwareCMK/providers/Microsoft.Storage/storageAccounts/migratelsa1671875959",
                    "performAutoResync": "true",
                    "targetVmName": "FPL-W19-09"
                }
            }
        }
    ]
}
```

## Set up replication

You can now deploy the edited Resource Manager template to the project resource group to set up replication for the VM. Learn how to [deploy resource with Azure Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md)

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName $ProjectResourceGroup -TemplateFile "C:\Users\Administrator\Downloads\template.json"
```

```Output
DeploymentName          : template
ResourceGroupName       : ContosoVMwareCMK
ProvisioningState       : Succeeded
Timestamp               : 3/11/2020 8:52:00 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
Outputs                 :
DeploymentDebugLogLevel :

```

## Next steps

[Monitor replication](tutorial-migrate-vmware.md#track-and-monitor) status through the portal experience and perform Test migrations and migration.
