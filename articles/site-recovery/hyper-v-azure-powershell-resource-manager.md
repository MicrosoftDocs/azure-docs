---
title: Replicate Hyper-V VMs with PowerShell and Azure Resource Manager | Microsoft Docs
description: Automate the replication of Hyper-V VMs to Azure with Azure Site Recovery using PowerShell and Azure Resource Manager.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: sutalasi

---
# Set up disaster recovery to Azure for Hyper-V VMs using PowerShell and Azure Resource Manager

[Azure Site Recovery](site-recovery-overview.md) contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover, and recovery of Azure virtual machines (VMs), and on-premises VMs and physical servers.

This article describes how to use Windows PowerShell, together with Azure Resource Manager, to replicate Hyper-V VMs to Azure. The example used in this article shows you how to replicate a single VM running on a Hyper-V host, to Azure.

## Azure PowerShell

Azure PowerShell provides cmdlets to manage Azure using Windows PowerShell. Site Recovery PowerShell cmdlets, available with Azure PowerShell for Azure Resource Manager, help you protect and recover your servers in Azure.

You don't need to be a PowerShell expert to use this article, but you do need to understand basic concepts, such as modules, cmdlets, and sessions. Read [Getting started with Windows PowerShell](http://technet.microsoft.com/library/hh857337.aspx), and [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

> [!NOTE]
> Microsoft partners in the Cloud Solution Provider (CSP) program can configure and manage protection of customer servers to their respective CSP subscriptions (tenant subscriptions).
>
>

## Before you start
Make sure you have these prerequisites in place:

* A [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). In addition, you can read about [Azure Site Recovery Manager pricing](https://azure.microsoft.com/pricing/details/site-recovery/).
* Azure PowerShell 1.0. For information about this release and how to install it, see [Azure PowerShell 1.0.](https://azure.microsoft.com/)
* The [AzureRM.SiteRecovery](https://www.powershellgallery.com/packages/AzureRM.SiteRecovery/) and [AzureRM.RecoveryServices](https://www.powershellgallery.com/packages/AzureRM.RecoveryServices/) modules. You can get the latest versions of these modules from the [PowerShell gallery](https://www.powershellgallery.com/)

In addition, the specific example described in this article has the following prerequisites:

* A Hyper-V host running Windows Server 2012 R2 or Microsoft Hyper-V Server 2012 R2 containing one or more VMs. Hyper-V servers should be connected to the Internet, either directly or through a proxy.
* The VMs you want to replicate should conform with [these prerequisites](hyper-v-azure-support-matrix.md#replicated-vms).

## Step 1: Sign in to your Azure account

1. Open a PowerShell console and run this command to sign in to your Azure account. The cmdlet brings up a web page prompts you for your account credentials: **Connect-AzureRmAccount**.
    - Alternately, you can include your account credentials as a parameter in the **Connect-AzureRmAccount** cmdlet, using the **-Credential** parameter.
    - If you are CSP partner working on behalf of a tenant, specify the customer as a tenant, by using their tenantID or tenant primary domain name. For example: **Connect-AzureRmAccount -Tenant "fabrikam.com"**
2. Associate the subscription you want to use with the acount, since an account can have several subscriptions:

    `Select-AzureRmSubscription -SubscriptionName $SubscriptionName`

3. Verify that your subscription is registered to use the Azure providers for Recovery Services and Site Recovery, using these commands:

    `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices`
    `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery`

4. Verify that in the command output, the **RegistrationState** is set to **Registered**, you can proceed to Step 2. If not, you should register the missing provider in your subscription, by running these commands:

    `Register-AzureRmResourceProvider -ProviderNamespace Microsoft.SiteRecovery`
    `Register-AzureRmResourceProvider -ProviderNamespace Microsoft.RecoveryServices`

5. Verify that the Providers registered successfully, using the following commands:

    `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.RecoveryServices`
    `Get-AzureRmResourceProvider -ProviderNamespace  Microsoft.SiteRecovery`.

## Step 2: Set up the vault

1. Create an Azure Resource Manager resource group in which to create the vault, or use an existing resource group. Create a new resource group as follows. The $ResourceGroupName variable contains the name of the resource group you want to create, and the $Geo variable contains the Azure region in which to create the resource group (for example, "Brazil South").

    `New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Geo` 

2. To obtain a list of resource groups in your subscription run the **Get-AzureRmResourceGroup** cmdlet.
2. Create a new Azure Recovery Services vault as follows:

        $vault = New-AzureRmRecoveryServicesVault -Name <string> -ResourceGroupName <string> -Location <string>

    You can retrieve a list of existing vaults with the **Get-AzureRmRecoveryServicesVault** cmdlet.


## Step 3: Set the Recovery Services vault context

Set the vault context as follows:

`Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault`

## Step 4: Create a Hyper-V site

1. Create a new Hyper-V site as follows:

        $sitename = "MySite"                #Specify site friendly name
        New-AzureRmSiteRecoverySite -Name $sitename

2. This cmdlet starts a Site Recovery job to create the site, and returns a Site Recovery job object. Wait for the job to complete and verify that the job completed successfully.
3. Use the **Get-AzureRmSiteRecoveryJob cmdlet**, to retrieve the job object, and check the current status of the job.
4. Generate and download a registration key for the site, as follows:

    ```
    $SiteIdentifier = Get-AzureRmSiteRecoverySite -Name $sitename | Select -ExpandProperty SiteIdentifier
        Get-AzureRmRecoveryServicesVaultSettingsFile -Vault $vault -SiteIdentifier $SiteIdentifier -SiteFriendlyName $sitename -Path $Path
    ```

5. Copy the downloaded key to the Hyper-V host. You need the key to register the Hyper-V host to the site.

## Step 5: Install the Provider and agent

1. Download the installer for the latest version of the Provider from [Microsoft](https://aka.ms/downloaddra).
2. Run the installer on theHyper-V host.
3. At the end of the installation continue to the registration step.
4. When prompted, provide the downloaded key, and complete registration of the Hyper-V host.
5. Verify that the Hyper-V host is registered to the site as follows:

        $server =  Get-AzureRmSiteRecoveryServer -FriendlyName $server-friendlyname

## Step 6: Create a replication policy

Before you start, note that the storage account specified should be in the same Azure region as the vault, and should have geo-replication enabled.

1. Create a replication policy as follows:

        $ReplicationFrequencyInSeconds = "300";        #options are 30,300,900
        $PolicyName = “replicapolicy”
        $Recoverypoints = 6                    #specify the number of recovery points
        $storageaccountID = Get-AzureRmStorageAccount -Name "mystorea" -ResourceGroupName "MyRG" | Select -ExpandProperty Id

        $PolicyResult = New-AzureRmSiteRecoveryPolicy -Name $PolicyName -ReplicationProvider “HyperVReplicaAzure” -ReplicationFrequencyInSeconds $ReplicationFrequencyInSeconds  -RecoveryPoints $Recoverypoints -ApplicationConsistentSnapshotFrequencyInHours 1 -RecoveryAzureStorageAccountId $storageaccountID

2. Check the returned job to ensure that the replication policy creation succeeds.

3. Retrieve the protection container that corresponds to the site, as follows:

        $protectionContainer = Get-AzureRmSiteRecoveryProtectionContainer
3. Associate the protection container with the replication policy, as follows:

     $Policy = Get-AzureRmSiteRecoveryPolicy -FriendlyName $PolicyName
     $associationJob  = Start-AzureRmSiteRecoveryPolicyAssociationJob -Policy $Policy -PrimaryProtectionContainer $protectionContainer

4. Wait for the association job to complete successfully.

## Step 7: Enable VM protection

1. Retrieve the protection entity that corresponds to the VM you want to protect, as follows:

        $VMFriendlyName = "Fabrikam-app"                    #Name of the VM
        $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName
2. Protect the VM. If the VM you are protecting has more than one disk attached to it, specify the operating system disk by using the *OSDiskName* parameter.

        $Ostype = "Windows"                                 # "Windows" or "Linux"
        $DRjob = Set-AzureRmSiteRecoveryProtectionEntity -ProtectionEntity $protectionEntity -Policy $Policy -Protection Enable -RecoveryAzureStorageAccountId $storageaccountID  -OS $OStype -OSDiskName $protectionEntity.Disks[0].Name

3. Wait for the VMs to reach a protected state after the initial replication. This can take a while, depending on factors such as the amount of data to be replicated, and the available upstream bandwidth to Azure. When a protected state is in place, the job State and StateDescription are updated as follows: 

        PS C:\> $DRjob = Get-AzureRmSiteRecoveryJob -Job $DRjob

        PS C:\> $DRjob | Select-Object -ExpandProperty State
        Succeeded

        PS C:\> $DRjob | Select-Object -ExpandProperty StateDescription
        Completed
4. Update recovery properties (such as the VM role size,), and the Azure network to which to attach the VM NIC after failover.

        PS C:\> $nw1 = Get-AzureRmVirtualNetwork -Name "FailoverNw" -ResourceGroupName "MyRG"

        PS C:\> $VMFriendlyName = "Fabrikam-App"

        PS C:\> $VM = Get-AzureRmSiteRecoveryVM -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

        PS C:\> $UpdateJob = Set-AzureRmSiteRecoveryVM -VirtualMachine $VM -PrimaryNic $VM.NicDetailsList[0].NicId -RecoveryNetworkId $nw1.Id -RecoveryNicSubnetName $nw1.Subnets[0].Name

        PS C:\> $UpdateJob = Get-AzureRmSiteRecoveryJob -Job $UpdateJob

        PS C:\> $UpdateJob

        Name             : b8a647e0-2cb9-40d1-84c4-d0169919e2c5
        ID               : /Subscriptions/a731825f-4bf2-4f81-a611-c331b272206e/resourceGroups/MyRG/providers/Microsoft.RecoveryServices/vault
                           s/MyVault/replicationJobs/b8a647e0-2cb9-40d1-84c4-d0169919e2c5
        Type             : Microsoft.RecoveryServices/vaults/replicationJobs
        JobType          : UpdateVmProperties
        DisplayName      : Update the virtual machine
        ClientRequestId  : 805a22a3-be86-441c-9da8-f32685673112-2015-12-10 17:55:51Z-P
        State            : Succeeded
        StateDescription : Completed
        StartTime        : 10-12-2015 17:55:53 +00:00
        EndTime          : 10-12-2015 17:55:54 +00:00
        TargetObjectId   : 289682c6-c5e6-42dc-a1d2-5f9621f78ae6
        TargetObjectType : ProtectionEntity
        TargetObjectName : Fabrikam-App
        AllowedActions   : {Restart}
        Tasks            : {UpdateVmPropertiesTask}
        Errors           : {}



## Step 8: Run a test failover
1. Run a test failover as follows:

        $nw = Get-AzureRmVirtualNetwork -Name "TestFailoverNw" -ResourceGroupName "MyRG" #Specify Azure vnet name and resource group

        $protectionEntity = Get-AzureRmSiteRecoveryProtectionEntity -FriendlyName $VMFriendlyName -ProtectionContainer $protectionContainer

        $TFjob = Start-AzureRmSiteRecoveryTestFailoverJob -ProtectionEntity $protectionEntity -Direction PrimaryToRecovery -AzureVMNetworkId $nw.Id
2. Verify that the test VM is created in Azure. The test failover job is suspended after creating the test VM in Azure.
3. To clean up and complete the test failover, run:

        $TFjob = Resume-AzureRmSiteRecoveryJob -Job $TFjob

## Next steps
[Learn more](https://docs.microsoft.com/powershell/module/azurerm.siterecovery) about Azure Site Recovery with Azure Resource Manager PowerShell cmdlets.
