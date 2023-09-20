---
title: Hyper-V VM disaster recovery using Azure Site Recovery and PowerShell
description: Automate disaster recovery of Hyper-V VMs to Azure with the Azure Site Recovery service using PowerShell and Azure Resource Manager.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.custom: devx-track-azurepowershell, devx-track-arm-template
manager: rochakm
ms.topic: article
ms.date: 01/10/2020
ms.author: ankitadutta 
ms.tool: azure-powershell
---

# Set up disaster recovery to Azure for Hyper-V VMs using PowerShell and Azure Resource Manager

[Azure Site Recovery](site-recovery-overview.md) contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover, and recovery of Azure virtual machines (VMs), and on-premises VMs and physical servers.

This article describes how to use Windows PowerShell, together with Azure Resource Manager, to replicate Hyper-V VMs to Azure. The example used in this article shows you how to replicate a single VM running on a Hyper-V host, to Azure.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Azure PowerShell

Azure PowerShell provides cmdlets to manage Azure using Windows PowerShell. Site Recovery PowerShell cmdlets, available with Azure PowerShell for Azure Resource Manager, help you protect and recover your servers in Azure.

You don't need to be a PowerShell expert to use this article, but you do need to understand basic concepts, such as modules, cmdlets, and sessions. For more information, see the [PowerShell Documentation](/powershell) and [Using Azure PowerShell with Azure Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md).

> [!NOTE]
> Microsoft partners in the Cloud Solution Provider (CSP) program can configure and manage protection of customer servers to their respective CSP subscriptions (tenant subscriptions).

## Before you start

Make sure you have these prerequisites in place:

- A [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). In addition, you can read about [Azure Site Recovery Manager pricing](https://azure.microsoft.com/pricing/details/site-recovery/).
- Azure PowerShell. For information about this release and how to install it, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

In addition, the specific example described in this article has the following prerequisites:

- A Hyper-V host running Windows Server 2012 R2 or Microsoft Hyper-V Server 2012 R2 containing one or more VMs. Hyper-V servers should be connected to the Internet, either directly or through a proxy.
- The VMs you want to replicate should conform with [these prerequisites](hyper-v-azure-support-matrix.md#replicated-vms).

## Step 1: Sign in to your Azure account

1. Open a PowerShell console and run this command to sign in to your Azure account. The cmdlet brings up a web page prompts you for your account credentials: `Connect-AzAccount`.
   - Alternately, you can include your account credentials as a parameter in the `Connect-AzAccount` cmdlet, using the **Credential** parameter.
   - If you're a CSP partner working on behalf of a tenant, specify the customer as a tenant, by using their tenantID or tenant primary domain name. For example: `Connect-AzAccount -Tenant "fabrikam.com"`
1. Associate the subscription you want to use with the account, since an account can have several subscriptions:

   ```azurepowershell
   Set-AzContext -Subscription $SubscriptionName
   ```

1. Verify that your subscription is registered to use the Azure providers for Recovery Services and Site Recovery, using these commands:

   ```azurepowershell
   Get-AzResourceProvider -ProviderNamespace  Microsoft.RecoveryServices
   ```

1. Verify that in the command output, the **RegistrationState** is set to **Registered**, you can proceed to Step 2. If not, you should register the missing provider in your subscription, by running these commands:

   ```azurepowershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.RecoveryServices
   ```

1. Verify that the Providers registered successfully, using the following commands:

   ```azurepowershell
   Get-AzResourceProvider -ProviderNamespace  Microsoft.RecoveryServices
   ```

## Step 2: Set up the vault

1. Create an Azure Resource Manager resource group in which to create the vault, or use an existing resource group. Create a new resource group as follows. The `$ResourceGroupName` variable contains the name of the resource group you want to create, and the $Geo variable contains the Azure region in which to create the resource group (for example, "Brazil South").

   ```azurepowershell
   New-AzResourceGroup -Name $ResourceGroupName -Location $Geo
   ```

1. To obtain a list of resource groups in your subscription, run the `Get-AzResourceGroup` cmdlet.
1. Create a new Azure Recovery Services vault as follows:

   ```azurepowershell
   $vault = New-AzRecoveryServicesVault -Name <string> -ResourceGroupName <string> -Location <string>
   ```

You can retrieve a list of existing vaults with the `Get-AzRecoveryServicesVault` cmdlet.

## Step 3: Set the Recovery Services vault context

Set the vault context as follows:

```azurepowershell
Set-AzRecoveryServicesAsrVaultContext -Vault $vault
```

## Step 4: Create a Hyper-V site

1. Create a new Hyper-V site as follows:

   ```azurepowershell
   $sitename = "MySite"                #Specify site friendly name
   New-AzRecoveryServicesAsrFabric -Type HyperVSite -Name $sitename
   ```

1. This cmdlet starts a Site Recovery job to create the site, and returns a Site Recovery job object. Wait for the job to complete and verify that the job completed successfully.
1. Use the `Get-AzRecoveryServicesAsrJob` cmdlet to retrieve the job object, and check the current status of the job.
1. Generate and download a registration key for the site, as follows:

   ```azurepowershell
   $SiteIdentifier = Get-AzRecoveryServicesAsrFabric -Name $sitename | Select-Object -ExpandProperty SiteIdentifier
   $path = Get-AzRecoveryServicesVaultSettingsFile -Vault $vault -SiteIdentifier $SiteIdentifier -SiteFriendlyName $sitename
   ```

1. Copy the downloaded key to the Hyper-V host. You need the key to register the Hyper-V host to the site.

## Step 5: Install the Provider and agent

1. Download the installer for the latest version of the Provider from [Microsoft](https://aka.ms/downloaddra).
1. Run the installer on the Hyper-V host.
1. At the end of the installation continue to the registration step.
1. When prompted, provide the downloaded key, and complete registration of the Hyper-V host.
1. Verify that the Hyper-V host is registered to the site as follows:

   ```azurepowershell
   $server = Get-AzRecoveryServicesAsrFabric -Name $siteName | Get-AzRecoveryServicesAsrServicesProvider -FriendlyName $server-friendlyname
   ```

If you're running a Hyper-V core server, download the setup file and follow these steps:

1. Extract the files from _AzureSiteRecoveryProvider.exe_ to a local directory by running this command:

   ```console
   AzureSiteRecoveryProvider.exe /x:. /q
   ```

1. Run the following command:

   ```console
   .\setupdr.exe /i
   ```

   Results are logged to _%ProgramData%\ASRLogs\DRASetupWizard.log_.

1. Register the server by running this command:

   ```console
   cd  C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Friendlyname "FriendlyName of the Server" /Credentials "path to where the credential file is saved"
   ```

## Step 6: Create a replication policy

Before you start, the storage account specified should be in the same Azure region as the vault, and should have geo-replication enabled.

1. Create a replication policy as follows:

   ```azurepowershell
   $ReplicationFrequencyInSeconds = "300";        #options are 30,300,900
   $PolicyName = “replicapolicy”
   $Recoverypoints = 6                    #specify the number of recovery points
   $storageaccountID = Get-AzStorageAccount -Name "mystorea" -ResourceGroupName "MyRG" | Select-Object -ExpandProperty Id

   $PolicyResult = New-AzRecoveryServicesAsrPolicy -Name $PolicyName -ReplicationProvider “HyperVReplicaAzure” -ReplicationFrequencyInSeconds $ReplicationFrequencyInSeconds -NumberOfRecoveryPointsToRetain $Recoverypoints -ApplicationConsistentSnapshotFrequencyInHours 1 -RecoveryAzureStorageAccountId $storageaccountID
   ```

1. Check the returned job to ensure that the replication policy creation succeeds.

1. Retrieve the protection container that corresponds to the site, as follows:

   ```azurepowershell
   $protectionContainer = Get-AzRecoveryServicesAsrProtectionContainer
   ```

1. Associate the protection container with the replication policy, as follows:

   ```azurepowershell
   $Policy = Get-AzRecoveryServicesAsrPolicy -FriendlyName $PolicyName
   $associationJob = New-AzRecoveryServicesAsrProtectionContainerMapping -Name $mappingName -Policy $Policy -PrimaryProtectionContainer $protectionContainer[0]
   ```

1. Wait for the association job to complete successfully.

1. Retrieve the protection container mapping.

   ```azurepowershell
   $ProtectionContainerMapping = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $protectionContainer
   ```

## Step 7: Enable VM protection

1. Retrieve the protectable item that corresponds to the VM you want to protect, as follows:

   ```azurepowershell
   $VMFriendlyName = "Fabrikam-app"          #Name of the VM
   $ProtectableItem = Get-AzRecoveryServicesAsrProtectableItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName
   ```

1. Protect the VM. If the VM you're protecting has more than one disk attached to it, specify the operating system disk by using the **OSDiskName** parameter.

   ```azurepowershell
   $OSType = "Windows"          # "Windows" or "Linux"
   $DRjob = New-AzRecoveryServicesAsrReplicationProtectedItem -ProtectableItem $VM -Name $VM.Name -ProtectionContainerMapping $ProtectionContainerMapping -RecoveryAzureStorageAccountId $StorageAccountID -OSDiskName $OSDiskNameList[$i] -OS $OSType -RecoveryResourceGroupId $ResourceGroupID
   ```

1. Wait for the VMs to reach a protected state after the initial replication. This can take a while, depending on factors such as the amount of data to be replicated, and the available upstream bandwidth to Azure. When a protected state is in place, the job State and StateDescription are updated as follows:

   ```console
   PS C:\> $DRjob = Get-AzRecoveryServicesAsrJob -Job $DRjob

   PS C:\> $DRjob | Select-Object -ExpandProperty State
   Succeeded

   PS C:\> $DRjob | Select-Object -ExpandProperty StateDescription
   Completed
   ```

1. Update recovery properties (such as the VM role size) and the Azure network to which to attach the VM NIC after failover.

   ```console
   PS C:\> $nw1 = Get-AzVirtualNetwork -Name "FailoverNw" -ResourceGroupName "MyRG"

   PS C:\> $VMFriendlyName = "Fabrikam-App"

   PS C:\> $rpi = Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

   PS C:\> $UpdateJob = Set-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $rpi -PrimaryNic $VM.NicDetailsList[0].NicId -RecoveryNetworkId $nw1.Id -RecoveryNicSubnetName $nw1.Subnets[0].Name

   PS C:\> $UpdateJob = Get-AzRecoveryServicesAsrJob -Job $UpdateJob

   PS C:\> $UpdateJob | Select-Object -ExpandProperty state

   PS C:\> Get-AzRecoveryServicesAsrJob -Job $job | Select-Object -ExpandProperty state

   Succeeded
   ```

> [!NOTE]
> If you wish to replicate to CMK enabled managed disks in Azure, do the following steps using Az PowerShell 3.3.0 onwards:
>
> 1. Enable failover to managed disks by updating VM properties
> 1. Use the `Get-AzRecoveryServicesAsrReplicationProtectedItem` cmdlet to fetch the disk ID for each disk of the protected item
> 1. Create a dictionary object using `New-Object "System.Collections.Generic.Dictionary``2[System.String,System.String]"` cmdlet to contain the mapping of disk ID to disk encryption set. These disk encryption sets are to be pre-created by you in the target region.
> 1. Update the VM properties using `Set-AzRecoveryServicesAsrReplicationProtectedItem` cmdlet by passing the dictionary object in **DiskIdToDiskEncryptionSetMap** parameter.

## Step 8: Run a test failover

1. Run a test failover as follows:

   ```azurepowershell
   $nw = Get-AzVirtualNetwork -Name "TestFailoverNw" -ResourceGroupName "MyRG" #Specify Azure vnet name and resource group

   $rpi = Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

   $TFjob = Start-AzRecoveryServicesAsrTestFailoverJob -ReplicationProtectedItem $VM -Direction PrimaryToRecovery -AzureVMNetworkId $nw.Id
   ```

1. Verify that the test VM is created in Azure. The test failover job is suspended after creating the test VM in Azure.
1. To clean up and complete the test failover, run:

   ```azurepowershell
   $TFjob = Start-AzRecoveryServicesAsrTestFailoverCleanupJob -ReplicationProtectedItem $rpi -Comment "TFO done"
   ```

## Next steps

[Learn more](/powershell/module/az.recoveryservices) about Azure Site Recovery with Azure Resource Manager PowerShell cmdlets.
