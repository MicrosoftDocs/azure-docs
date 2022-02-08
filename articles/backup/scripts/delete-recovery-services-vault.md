---
title: Script Sample - Delete a Recovery Services vault
description: Learn about how to use a PowerShell script to delete a Recovery Services vault.
ms.topic: sample
ms.date: 01/30/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# PowerShell script to delete a Recovery Services vault

This script helps you to delete a Recovery Services vault.

## How to execute the script?

1. Save the script in the following section on your machine with a name of your choice and _.ps1_ extension.
1. In the script, change the parameters (vault name, resource group name, subscription name, and subscription ID).
1. To run it in your PowerShell environment, continue with the next steps.

   Alternatively, you can use Cloud Shell in Azure portal for vaults with fewer backups.

   :::image type="content" source="../media/backup-azure-delete-vault/delete-vault-using-cloud-shell-inline.png" alt-text="Screenshot showing to delete a vault using Cloud Shell." lightbox="../media/backup-azure-delete-vault/delete-vault-using-cloud-shell-expanded.png":::

1. To upgrade to the latest version of PowerShell 7, if not done, run the following command in the PowerShell window:

   ```azurepowershell-interactive
    iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI"
   ```

1. Launch PowerShell 7 as Administrator.
1. Before you run the script for vault deletion, run the following command to upgrade the _Az module_ to the latest version:

   ```azurepowershell-interactive
    Uninstall-Module -Name Az.RecoveryServices
    Set-ExecutionPolicy -ExecutionPolicy Unrestricted
    Install-Module -Name Az.RecoveryServices -Repository PSGallery -Force -AllowClobber
   ```

1. In the PowerShell window, change the path to the location the file is present, and then run the file using **./NameOfFile.ps1**.
1. Provide authentication via browser by signing into your Azure account.

The script will continue to delete all the backup items and ultimately the entire vault recursively.

## Script

```azurepowershell-interactive
Connect-AzAccount

$VaultName = "Vault name" #enter vault name
$Subscription = "Subscription name" #enter Subscription name
$ResourceGroup = "Resource group name" #enter Resource group name
$SubscriptionId = "Subscription ID" #enter Subscription ID

Select-AzSubscription $Subscription
$VaultToDelete = Get-AzRecoveryServicesVault -Name $VaultName -ResourceGroupName $ResourceGroup
Set-AzRecoveryServicesAsrVaultContext -Vault $VaultToDelete

Set-AzRecoveryServicesVaultProperty -Vault $VaultToDelete.ID -SoftDeleteFeatureState Disable #disable soft delete
Write-Host "Soft delete disabled for the vault" $VaultName
$containerSoftDelete = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $VaultToDelete.ID | Where-Object {$_.DeleteState -eq "ToBeDeleted"} #fetch backup items in soft delete state
foreach ($softitem in $containerSoftDelete)
{
    Undo-AzRecoveryServicesBackupItemDeletion -Item $softitem -VaultId $VaultToDelete.ID -Force #undelete items in soft delete state
}
#Invoking API to disable enhanced security
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$accesstoken = Get-AzAccessToken
$token = $accesstoken.Token
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token
}
$body = @{properties=@{enhancedSecurityState= "Disabled"}}
$restUri = 'https://management.azure.com/subscriptions/'+$SubscriptionId+'/resourcegroups/'+$ResourceGroup+'/providers/Microsoft.RecoveryServices/vaults/'+$VaultName+'/backupconfig/vaultconfig?api-version=2019-05-13' #Replace "management.azure.com" with "management.usgovcloudapi.net" if your subscription is in USGov.
$response = Invoke-RestMethod -Uri $restUri -Headers $authHeader -Body ($body | ConvertTo-JSON -Depth 9) -Method PATCH


#Fetch all protected items and servers
$backupItemsVM = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $VaultToDelete.ID
$backupItemsSQL = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload -WorkloadType MSSQL -VaultId $VaultToDelete.ID
$backupItemsAFS = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureStorage -WorkloadType AzureFiles -VaultId $VaultToDelete.ID
$backupItemsSAP = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload -WorkloadType SAPHanaDatabase -VaultId $VaultToDelete.ID
$backupContainersSQL = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer -Status Registered -VaultId $VaultToDelete.ID | Where-Object {$_.ExtendedInfo.WorkloadType -eq "SQL"}
$protectableItemsSQL = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL -VaultId $VaultToDelete.ID | Where-Object {$_.IsAutoProtected -eq $true}
$backupContainersSAP = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer -Status Registered -VaultId $VaultToDelete.ID | Where-Object {$_.ExtendedInfo.WorkloadType -eq "SAPHana"}
$StorageAccounts = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -Status Registered -VaultId $VaultToDelete.ID
$backupServersMARS = Get-AzRecoveryServicesBackupContainer -ContainerType "Windows" -BackupManagementType MAB -VaultId $VaultToDelete.ID
$backupServersMABS = Get-AzRecoveryServicesBackupManagementServer -VaultId $VaultToDelete.ID| Where-Object { $_.BackupManagementType -eq "AzureBackupServer" }
$backupServersDPM = Get-AzRecoveryServicesBackupManagementServer -VaultId $VaultToDelete.ID | Where-Object { $_.BackupManagementType-eq "SCDPM" }
$pvtendpoints = Get-AzPrivateEndpointConnection -PrivateLinkResourceId $VaultToDelete.ID

foreach($item in $backupItemsVM)
    {
        Disable-AzRecoveryServicesBackupProtection -Item $item -VaultId $VaultToDelete.ID -RemoveRecoveryPoints -Force #stop backup and delete Azure VM backup items
    }
Write-Host "Disabled and deleted Azure VM backup items"

foreach($item in $backupItemsSQL) 
    {
        Disable-AzRecoveryServicesBackupProtection -Item $item -VaultId $VaultToDelete.ID -RemoveRecoveryPoints -Force #stop backup and delete SQL Server in Azure VM backup items
    }
Write-Host "Disabled and deleted SQL Server backup items"

foreach($item in $protectableItems)
    {
        Disable-AzRecoveryServicesBackupAutoProtection -BackupManagementType AzureWorkload -WorkloadType MSSQL -InputItem $item -VaultId $VaultToDelete.ID #disable auto-protection for SQL
    }
Write-Host "Disabled auto-protection and deleted SQL protectable items"

foreach($item in $backupContainersSQL)
    {
        Unregister-AzRecoveryServicesBackupContainer -Container $item -Force -VaultId $VaultToDelete.ID #unregister SQL Server in Azure VM protected server
    }
Write-Host "Deleted SQL Servers in Azure VM containers" 

foreach($item in $backupItemsSAP) 
    {
        Disable-AzRecoveryServicesBackupProtection -Item $item -VaultId $VaultToDelete.ID -RemoveRecoveryPoints -Force #stop backup and delete SAP HANA in Azure VM backup items
    }
Write-Host "Disabled and deleted SAP HANA backup items"

foreach($item in $backupContainersSAP)
    {
        Unregister-AzRecoveryServicesBackupContainer -Container $item -Force -VaultId $VaultToDelete.ID #unregister SAP HANA in Azure VM protected server
    }
Write-Host "Deleted SAP HANA in Azure VM containers"

foreach($item in $backupItemsAFS)
    {
        Disable-AzRecoveryServicesBackupProtection -Item $item -VaultId $VaultToDelete.ID -RemoveRecoveryPoints -Force #stop backup and delete Azure File Shares backup items
    }
Write-Host "Disabled and deleted Azure File Share backups"

foreach($item in $StorageAccounts)
    {   
        Unregister-AzRecoveryServicesBackupContainer -container $item -Force -VaultId $VaultToDelete.ID #unregister storage accounts
    }
Write-Host "Unregistered Storage Accounts"

foreach($item in $backupServersMARS) 
    {
    	Unregister-AzRecoveryServicesBackupContainer -Container $item -Force -VaultId $VaultToDelete.ID #unregister MARS servers and delete corresponding backup items
    }
Write-Host "Deleted MARS Servers"

foreach($item in $backupServersMABS)
    { 
	    Unregister-AzRecoveryServicesBackupManagementServer -AzureRmBackupManagementServer $item -VaultId $VaultToDelete.ID #unregister MABS servers and delete corresponding backup items
    }
Write-Host "Deleted MAB Servers"

foreach($item in $backupServersDPM) 
    {
	    Unregister-AzRecoveryServicesBackupManagementServer -AzureRmBackupManagementServer $item -VaultId $VaultToDelete.ID #unregister DPM servers and delete corresponding backup items
    }
Write-Host "Deleted DPM Servers"

#Deletion of ASR Items

$fabricObjects = Get-AzRecoveryServicesAsrFabric
if ($null -ne $fabricObjects) {
	# First DisableDR all VMs.
	foreach ($fabricObject in $fabricObjects) {
		$containerObjects = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $fabricObject
		foreach ($containerObject in $containerObjects) {
			$protectedItems = Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $containerObject
			# DisableDR all protected items
			foreach ($protectedItem in $protectedItems) {
				Write-Host "Triggering DisableDR(Purge) for item:" $protectedItem.Name
				Remove-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $protectedItem -Force
				Write-Host "DisableDR(Purge) completed"
			}
			
			$containerMappings = Get-AzRecoveryServicesAsrProtectionContainerMapping `
				-ProtectionContainer $containerObject
			# Remove all Container Mappings
			foreach ($containerMapping in $containerMappings) {
				Write-Host "Triggering Remove Container Mapping: " $containerMapping.Name
				Remove-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainerMapping $containerMapping -Force
				Write-Host "Removed Container Mapping."
			}			
		}
		$NetworkObjects = Get-AzRecoveryServicesAsrNetwork -Fabric $fabricObject 
		foreach ($networkObject in $NetworkObjects) 
		{
			#Get the PrimaryNetwork
			$PrimaryNetwork = Get-AzRecoveryServicesAsrNetwork -Fabric $fabricObject -FriendlyName $networkObject
			$NetworkMappings = Get-AzRecoveryServicesAsrNetworkMapping -Network $PrimaryNetwork
			foreach ($networkMappingObject in $NetworkMappings) 
			{
				#Get the Neetwork Mappings
				$NetworkMapping = Get-AzRecoveryServicesAsrNetworkMapping -Name $networkMappingObject.Name -Network $PrimaryNetwork
				Remove-AzRecoveryServicesAsrNetworkMapping -InputObject $NetworkMapping
			}
		}		
		# Remove Fabric
		Write-Host "Triggering Remove Fabric:" $fabricObject.FriendlyName
		Remove-AzRecoveryServicesAsrFabric -InputObject $fabricObject -Force
		Write-Host "Removed Fabric."
	}
}

foreach($item in $pvtendpoints)
	{
		$penamesplit = $item.Name.Split(".")
		$pename = $penamesplit[0]
		Remove-AzPrivateEndpointConnection -ResourceId $item.PrivateEndpoint.Id -Force #remove private endpoint connections
		Remove-AzPrivateEndpoint -Name $pename -ResourceGroupName $ResourceGroup -Force #remove private endpoints
	}	 
Write-Host "Removed Private Endpoints"

#Recheck ASR items in vault
$fabricCount = 0
$ASRProtectedItems = 0
$ASRPolicyMappings = 0
$fabricObjects = Get-AzRecoveryServicesAsrFabric
if ($null -ne $fabricObjects) {
	foreach ($fabricObject in $fabricObjects) {
		$containerObjects = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $fabricObject
		foreach ($containerObject in $containerObjects) {
			$protectedItems = Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $containerObject
			foreach ($protectedItem in $protectedItems) {
				$ASRProtectedItems++
			}
			$containerMappings = Get-AzRecoveryServicesAsrProtectionContainerMapping `
				-ProtectionContainer $containerObject
			foreach ($containerMapping in $containerMappings) {
				$ASRPolicyMappings++
			}			
		}
		$fabricCount++
	}
}
#Recheck presence of backup items in vault
$backupItemsVMFin = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $VaultToDelete.ID
$backupItemsSQLFin = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload -WorkloadType MSSQL -VaultId $VaultToDelete.ID
$backupContainersSQLFin = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer -Status Registered -VaultId $VaultToDelete.ID | Where-Object {$_.ExtendedInfo.WorkloadType -eq "SQL"}
$protectableItemsSQLFin = Get-AzRecoveryServicesBackupProtectableItem -WorkloadType MSSQL -VaultId $VaultToDelete.ID | Where-Object {$_.IsAutoProtected -eq $true}
$backupItemsSAPFin = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureWorkload -WorkloadType SAPHanaDatabase -VaultId $VaultToDelete.ID
$backupContainersSAPFin = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVMAppContainer -Status Registered -VaultId $VaultToDelete.ID | Where-Object {$_.ExtendedInfo.WorkloadType -eq "SAPHana"}
$backupItemsAFSFin = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureStorage -WorkloadType AzureFiles -VaultId $VaultToDelete.ID
$StorageAccountsFin = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -Status Registered -VaultId $VaultToDelete.ID
$backupServersMARSFin = Get-AzRecoveryServicesBackupContainer -ContainerType "Windows" -BackupManagementType MAB -VaultId $VaultToDelete.ID
$backupServersMABSFin = Get-AzRecoveryServicesBackupManagementServer -VaultId $VaultToDelete.ID| Where-Object { $_.BackupManagementType -eq "AzureBackupServer" }
$backupServersDPMFin = Get-AzRecoveryServicesBackupManagementServer -VaultId $VaultToDelete.ID | Where-Object { $_.BackupManagementType-eq "SCDPM" }
$pvtendpointsFin = Get-AzPrivateEndpointConnection -PrivateLinkResourceId $VaultToDelete.ID
Write-Host "Number of backup items left in the vault and which need to be deleted:" $backupItemsVMFin.count "Azure VMs" $backupItemsSQLFin.count "SQL Server Backup Items" $backupContainersSQLFin.count "SQL Server Backup Containers" $protectableItemsSQLFin.count "SQL Server Instances" $backupItemsSAPFin.count "SAP HANA backup items" $backupContainersSAPFin.count "SAP HANA Backup Containers" $backupItemsAFSFin.count "Azure File Shares" $StorageAccountsFin.count "Storage Accounts" $backupServersMARSFin.count "MARS Servers" $backupServersMABSFin.count "MAB Servers" $backupServersDPMFin.count "DPM Servers" $pvtendpointsFin.count "Private endpoints"
Write-Host "Number of ASR items left in the vault and which need to be deleted:" $ASRProtectedItems "ASR protected items" $ASRPolicyMappings "ASR policy mappings" $fabricCount "ASR Fabrics" $pvtendpointsFin.count "Private endpoints. Warning: This script will only remove the replication configuration from Azure Site Recovery and not from the source. Please cleanup the source manually. Visit https://go.microsoft.com/fwlink/?linkid=2182781 to learn more"
Remove-AzRecoveryServicesVault -Vault $VaultToDelete
#Finish

```

## Next steps

[Learn more](../backup-azure-delete-vault.md) about vault deletion process.