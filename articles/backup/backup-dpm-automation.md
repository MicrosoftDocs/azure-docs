---
title: Use PowerShell to back up DPM workloads
description: Learn how to deploy and manage Azure Backup for Data Protection Manager (DPM) using PowerShell
ms.service: azure-backup
ms.topic: how-to
ms.date: 03/29/2024
ms.custom: devx-track-azurepowershell, engagement-fy24
author: jyothisuri
ms.author: jsuri
---
# Deploy and manage backup to Azure for Data Protection Manager (DPM) servers using PowerShell

This article describes how to use PowerShell to set up Azure Backup on a DPM server, and to manage backup and recovery.

## Set up the PowerShell environment

Before you can use PowerShell to manage backups from Data Protection Manager to Azure, you need to have the right environment in PowerShell. At the start of the PowerShell session, ensure that you run the following command to import the right modules and allow you to correctly reference the DPM cmdlets:

```powershell
& "C:\Program Files\Microsoft System Center 2012 R2\DPM\DPM\bin\DpmCliInitScript.ps1"
```

```Output
Welcome to the DPM Management Shell!

Full list of cmdlets: Get-Command
Only DPM cmdlets: Get-DPMCommand
Get general help: help
Get help for a cmdlet: help <cmdlet-name> or <cmdlet-name> -?
Get definition of a cmdlet: Get-Command <cmdlet-name> -Syntax
Sample DPM scripts: Get-DPMSampleScript
```

## Setup and Registration

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

To begin, [download the latest Azure PowerShell](/powershell/azure/install-azure-powershell).

The following setup and registration tasks can be automated with PowerShell:

* Create a Recovery Services vault
* Installing the Azure Backup agent
* Registering with the Azure Backup service
* Networking settings
* Encryption settings

## Create a Recovery Services vault

The following steps lead you through creating a Recovery Services vault. A Recovery Services vault is different than a Backup vault.

1. If you're using Azure Backup for the first time, you must use the **Register-AzResourceProvider** cmdlet to register the Azure Recovery Service provider with your subscription.

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

2. The Recovery Services vault is an ARM resource, so you need to place it within a Resource Group. You can use an existing resource group, or create a new one. When creating a new resource group, specify the name and location for the resource group.

    ```powershell
    New-AzResourceGroup –Name "test-rg" –Location "West US"
    ```

3. Use the **New-AzRecoveryServicesVault** cmdlet to create a new vault. Be sure to specify the same location for the vault as was used for the resource group.

    ```powershell
    New-AzRecoveryServicesVault -Name "testvault" -ResourceGroupName " test-rg" -Location "West US"
    ```

4. Specify the type of storage redundancy to use. You can use [Locally Redundant Storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage), [Geo-redundant Storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage), or [Zone-redundant storage (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage). The following example shows the **BackupStorageRedundancy** option for *testVault*  set to **GeoRedundant**.

   > [!TIP]
   > Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it's convenient to store the Backup Recovery Services vault object in a variable.
   >
   >

    ```powershell
    $vault1 = Get-AzRecoveryServicesVault –Name "testVault"
    Set-AzRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
    ```

## View the vaults in a subscription

Use **Get-AzRecoveryServicesVault** to view the list of all vaults in the current subscription. You can use this command to check that a new  vault was created, or to see what vaults are available in the subscription.

Run the command, Get-AzRecoveryServicesVault, and all vaults in the subscription are listed.

```powershell
Get-AzRecoveryServicesVault
```

```Output
Name              : Contoso-vault
ID                : /subscriptions/1234
Type              : Microsoft.RecoveryServices/vaults
Location          : WestUS
ResourceGroupName : Contoso-docs-rg
SubscriptionId    : 1234-567f-8910-abc
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```

## Installing the Azure Backup agent on a DPM Server

Before you install the Azure Backup agent, you need to have the installer downloaded and present on the Windows Server. You can get the latest version of the installer from the [Microsoft Download Center](https://aka.ms/azurebackup_agent) or from the Recovery Services vault's Dashboard page. Save the installer to an easily accessible location like `C:\Downloads\*`.

To install the agent, run the following command in an elevated PowerShell console **on the DPM server**:

```powershell
MARSAgentInstaller.exe /q
```

This installs the agent with all the default options. The installation takes a few minutes in the background. If you don't specify the */nu* option the **Windows Update** window opens at the end of the installation to check for any updates.

The agent shows up in the list of installed programs. To see the list of installed programs, go to **Control Panel** > **Programs** > **Programs and Features**.

![Agent installed](./media/backup-dpm-automation/installed-agent-listing.png)

### Installation options

To see all the options available via the command line, use the following command:

```powershell
MARSAgentInstaller.exe /?
```

The available options include:

| Option | Details | Default |
| --- | --- | --- |
| /q |Quiet installation |- |
| /p:"location" |Path to the installation folder for the Azure Backup agent. |C:\Program Files\Microsoft Azure Recovery Services Agent |
| /s:"location" |Path to the cache folder for the Azure Backup agent. |C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch |
| /m |Opt-in to Microsoft Update |- |
| /nu |Do not Check for updates after installation is complete |- |
| /d |Uninstalls Microsoft Azure Recovery Services Agent |- |
| /ph |Proxy Host Address |- |
| /po |Proxy Host Port Number |- |
| /pu |Proxy Host UserName |- |
| /pw |Proxy Password |- |

## Registering DPM to a Recovery Services vault

After you created the Recovery Services vault, download the latest agent and the vault credentials and store it in a convenient location like C:\Downloads.

```powershell
$credspath = "C:\downloads"
$credsfilename = Get-AzRecoveryServicesVaultSettingsFile -Backup -Vault $vault1 -Path  $credspath
$credsfilename
```

```Output
C:\downloads\testvault\_Sun Apr 10 2016.VaultCredentials
```

On the DPM server, run the [Start-OBRegistration](/powershell/module/msonlinebackup/start-obregistration) cmdlet to register the machine with the vault.

```powershell
$cred = $credspath + $credsfilename
Start-OBRegistration-VaultCredentials $cred -Confirm:$false
```

```Output
CertThumbprint      :7a2ef2caa2e74b6ed1222a5e89288ddad438df2
SubscriptionID      : aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e
ServiceResourceName: testvault
Region              :West US
Machine registration succeeded.
```

### Initial configuration settings

Once the DPM Server is registered with the Recovery Services vault, it starts with default subscription settings. These subscription settings include Networking, Encryption and the Staging area. To change subscription settings you need to first get a handle on the existing (default) settings using the [Get-DPMCloudSubscriptionSetting](/powershell/module/dataprotectionmanager/get-dpmcloudsubscriptionsetting) cmdlet:

```powershell
$setting = Get-DPMCloudSubscriptionSetting -DPMServerName "TestingServer"
```

All modifications are made to this local PowerShell object ```$setting```  and then the full object is committed to DPM and Azure Backup to save them using the [Set-DPMCloudSubscriptionSetting](/powershell/module/dataprotectionmanager/set-dpmcloudsubscriptionsetting) cmdlet. You need to use the ```–Commit``` flag to ensure that the changes are persisted. The settings won't be applied and used by Azure Backup unless committed.

```powershell
Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -Commit
```

## Networking

If the connectivity of the DPM machine to the Azure Backup service on the internet is through a proxy server, then the proxy server settings should be provided for successful backups. This is done by using the ```-ProxyServer```and ```-ProxyPort```, ```-ProxyUsername``` and the ```ProxyPassword``` parameters with the [Set-DPMCloudSubscriptionSetting](/powershell/module/dataprotectionmanager/set-dpmcloudsubscriptionsetting) cmdlet. In this example, there's no proxy server so we're explicitly clearing any proxy-related information.

```powershell
Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -NoProxy
```

Bandwidth usage can also be controlled with options of ```-WorkHourBandwidth``` and ```-NonWorkHourBandwidth``` for a given set of days of the week. In this example, we aren't setting any throttling.

```powershell
Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -NoThrottle
```

## Configure the staging Area

The Azure Backup agent running on the DPM server needs temporary storage for data restored from the cloud (local staging area). Configure the staging area using the [Set-DPMCloudSubscriptionSetting](/powershell/module/dataprotectionmanager/set-dpmcloudsubscriptionsetting) cmdlet and the ```-StagingAreaPath``` parameter.

```powershell
Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -StagingAreaPath "C:\StagingArea"
```

In the example above, the staging area will be set to *C:\StagingArea* in the PowerShell object ```$setting```. Ensure that the specified folder already exists, or else the final commit of the subscription settings will fail.

### Encryption settings

The backup data sent to Azure Backup is encrypted to protect the confidentiality of the data. The encryption passphrase is the "password" to decrypt the data at the time of restore. It's important to keep this information safe and secure once it's set.

In the example below, the first command converts the string ```passphrase123456789``` to a secure string and assigns the secure string to the variable named ```$Passphrase```. The second command sets the secure string in ```$Passphrase``` as the password for encrypting backups.

```powershell
$Passphrase = ConvertTo-SecureString -string "passphrase123456789" -AsPlainText -Force

Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -EncryptionPassphrase $Passphrase
```

> [!IMPORTANT]
> Keep the passphrase information safe and secure once it's set. You won't be able to restore data from Azure without this passphrase.
>
>

At this point, you should have made all the required changes to the ```$setting``` object. Remember to commit the changes.

```powershell
Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -Commit
```

## Protect data to Azure Backup

In this section, you'll add a production server to DPM and then protect the data to local DPM storage and then to Azure Backup. In the examples, we'll demonstrate how to back up files and folders. The logic can easily be extended to back up any DPM-supported data source. All your DPM backups are governed by a Protection Group (PG) with four parts:

1. **Group members** is a list of all the protectable objects (also known as *Datasources* in DPM) that you want to protect in the same protection group. For example, you may want to protect production VMs in one protection group and SQL Server databases in another protection group as they may have different backup requirements. Before you can back up any datasource on a production server you need to make sure the DPM Agent is installed on the server and is managed by DPM. Follow the steps for [installing the DPM Agent](/system-center/dpm/deploy-dpm-protection-agent) and linking it to the appropriate DPM Server.
2. **Data protection method** specifies the target backup locations - tape, disk, and cloud. In our example, we'll protect data to the local disk and to the cloud.
3. A **backup schedule** that specifies when backups need to be taken and how often the data should be synchronized between the DPM Server and the production server.
4. A **retention schedule** that specifies how long to retain the recovery points in Azure.

### Create a protection group

Start by creating a new Protection Group using the [New-DPMProtectionGroup](/powershell/module/dataprotectionmanager/new-dpmprotectiongroup) cmdlet.

```powershell
$PG = New-DPMProtectionGroup -DPMServerName " TestingServer " -Name "ProtectGroup01"
```

The above cmdlet will create a Protection Group named *ProtectGroup01*. An existing protection group can also be modified later to add backup to the Azure cloud. However, to make any changes to the Protection Group - new or existing - we need to get a handle on a *modifiable* object using the [Get-DPMModifiableProtectionGroup](/powershell/module/dataprotectionmanager/get-dpmmodifiableprotectiongroup) cmdlet.

```powershell
$MPG = Get-ModifiableProtectionGroup $PG
```

### Add group members to the Protection Group

Each DPM Agent knows the list of datasources on the server that it's installed on. To add a datasource to the Protection Group, the DPM Agent needs to first send a list of the datasources back to the DPM server. One or more datasources are then selected and added to the Protection Group. The PowerShell steps needed to achieve this are:

1. Fetch a list of all servers managed by DPM through the DPM Agent.
2. Choose a specific server.
3. Fetch a list of all datasources on the server.
4. Choose one or more datasources and add them to the Protection Group

The list of servers on which the DPM Agent is installed and is being managed by the DPM Server is acquired with the [Get-DPMProductionServer](/powershell/module/dataprotectionmanager/get-dpmproductionserver) cmdlet. In this example, we'll filter and only configure PowerShell with the name *productionserver01* for backup.

```powershell
$server = Get-ProductionServer -DPMServerName "TestingServer" | Where-Object {($_.servername) –contains "productionserver01"}
```

Now fetch the list of datasources on ```$server``` using the [Get-DPMDatasource](/powershell/module/dataprotectionmanager/get-dpmdatasource) cmdlet. In this example we're filtering for the volume `D:\` that we want to configure for backup. This datasource is then added to the Protection Group using the [Add-DPMChildDatasource](/powershell/module/dataprotectionmanager/add-dpmchilddatasource) cmdlet. Remember to use the *modifiable* protection group object ```$MPG``` to make the additions.

```powershell
$DS = Get-Datasource -ProductionServer $server -Inquire | Where-Object { $_.Name -contains "D:\" }

Add-DPMChildDatasource -ProtectionGroup $MPG -ChildDatasource $DS
```

Repeat this step as many times as required, until you've added all the chosen datasources to the protection group. You can also start with just one datasource, and complete the workflow for creating the Protection Group, and at a later point add more datasources to the Protection Group.

### Select the data protection method

Once the datasources have been added to the Protection Group, the next step is to specify the protection method using the [Set-DPMProtectionType](/powershell/module/dataprotectionmanager/set-dpmprotectiontype) cmdlet. In this example, the Protection Group is set up for local disk and cloud backup. You also need to specify the datasource that you want to protect to cloud using the [Add-DPMChildDatasource](/powershell/module/dataprotectionmanager/add-dpmchilddatasource) cmdlet with -Online flag.

```powershell
Set-DPMProtectionType -ProtectionGroup $MPG -ShortTerm Disk –LongTerm Online
Add-DPMChildDatasource -ProtectionGroup $MPG -ChildDatasource $DS –Online
```

### Set the retention range

Set the retention for the backup points using the [Set-DPMPolicyObjective](/powershell/module/dataprotectionmanager/set-dpmpolicyobjective) cmdlet. While it might seem odd to set the retention before the backup schedule has been defined, using the ```Set-DPMPolicyObjective``` cmdlet automatically sets a default backup schedule that can then be modified. It's always possible to set the backup schedule first and the retention policy after.

In the example below, the cmdlet sets the retention parameters for disk backups. This will retain backups for 10 days, and sync data every 6 hours between the production server and the DPM server. The ```SynchronizationFrequencyMinutes``` doesn't define how often a backup point is created, but how often data is copied to the DPM server.  This setting prevents backups from becoming too large.

```powershell
Set-DPMPolicyObjective –ProtectionGroup $MPG -RetentionRangeInDays 10 -SynchronizationFrequencyMinutes 360
```

For backups going to Azure (DPM refers to them as Online backups) the retention ranges can be configured for [long term retention using a Grandfather-Father-Son scheme (GFS)](backup-azure-backup-cloud-as-tape.md). That is, you can define a combined retention policy involving daily, weekly, monthly and yearly retention policies. In this example, we create an array representing the complex retention scheme that we want, and then configure the retention range using the [Set-DPMPolicyObjective](/powershell/module/dataprotectionmanager/set-dpmpolicyobjective) cmdlet.

```powershell
$RRlist = @()
$RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 180, Days)
$RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 104, Weeks)
$RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 60, Month)
$RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 10, Years)
Set-DPMPolicyObjective –ProtectionGroup $MPG -OnlineRetentionRangeList $RRlist
```

### Set the backup schedule

DPM sets a default backup schedule automatically if you specify the protection objective using the ```Set-DPMPolicyObjective``` cmdlet. To change the default schedules, use the [Get-DPMPolicySchedule](/powershell/module/dataprotectionmanager/get-dpmpolicyschedule) cmdlet followed by the [Set-DPMPolicySchedule](/powershell/module/dataprotectionmanager/set-dpmpolicyschedule) cmdlet.

```powershell
$onlineSch = Get-DPMPolicySchedule -ProtectionGroup $mpg -LongTerm Online
Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[0] -TimesOfDay 02:00
Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[1] -TimesOfDay 02:00 -DaysOfWeek Sa,Su –Interval 1
Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[2] -TimesOfDay 02:00 -RelativeIntervals First,Third –DaysOfWeek Sa
Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[3] -TimesOfDay 02:00 -DaysOfMonth 2,5,8,9 -Months Jan,Jul
Set-DPMProtectionGroup -ProtectionGroup $MPG
```

In the example above, `$onlineSch` is an array with four elements that contains the existing online protection schedule for the Protection Group in the GFS scheme:

1. `$onlineSch[0]` contains the daily schedule
2. `$onlineSch[1]` contains the weekly schedule
3. `$onlineSch[2]` contains the monthly schedule
4. `$onlineSch[3]` contains the yearly schedule

So if you need to modify the weekly schedule, you need to refer to the ```$onlineSch[1]```.

### Initial backup

When you back up a datasource for the first time, DPM needs creates initial replica that creates a full copy of the datasource to be protected on DPM replica volume. This activity can either be scheduled for a specific time, or can be triggered manually, using the [Set-DPMReplicaCreationMethod](/powershell/module/dataprotectionmanager/set-dpmreplicacreationmethod) cmdlet with the parameter ```-NOW```.

```powershell
Set-DPMReplicaCreationMethod -ProtectionGroup $MPG -NOW
```

### Change the size of DPM Replica & recovery point volume

You can also change the size of DPM Replica volume and Shadow Copy volume using [Set-DPMDatasourceDiskAllocation](/powershell/module/dataprotectionmanager/set-dpmdatasourcediskallocation) cmdlet as in the following example:
Get-DatasourceDiskAllocation -Datasource $DS
Set-DatasourceDiskAllocation -Datasource $DS -ProtectionGroup $MPG -manual -ReplicaArea (2gb) -ShadowCopyArea (2gb)

### Commit the changes to the Protection Group

Finally, the changes need to be committed before DPM can take the backup per the new Protection Group configuration. This can be achieved using the [Set-DPMProtectionGroup](/powershell/module/dataprotectionmanager/set-dpmprotectiongroup) cmdlet.

```powershell
Set-DPMProtectionGroup -ProtectionGroup $MPG
```

## View the backup points

You can use the [Get-DPMRecoveryPoint](/powershell/module/dataprotectionmanager/get-dpmrecoverypoint) cmdlet to get a list of all recovery points for a datasource. In this example, we will:

* fetch all the PGs on the DPM server and stored in an array ```$PG```
* get the datasources corresponding to the ```$PG[0]```
* get all the recovery points for a datasource.

```powershell
$PG = Get-DPMProtectionGroup –DPMServerName "TestingServer"
$DS = Get-DPMDatasource -ProtectionGroup $PG[0]
$RecoveryPoints = Get-DPMRecoverypoint -Datasource $DS[0] -Online
```

## Restore data protected on Azure

Restoring data is a combination of a ```RecoverableItem``` object and a ```RecoveryOption``` object. In the previous section, we got a list of the backup points for a datasource.

In the example below, we demonstrate how to restore a Hyper-V virtual machine from Azure Backup by combining backup points with the target for recovery. This example includes:

* Creating a recovery option using the  [New-DPMRecoveryOption](/powershell/module/dataprotectionmanager/new-dpmrecoveryoption) cmdlet.
* Fetching the array of backup points using the ```Get-DPMRecoveryPoint``` cmdlet.
* Choosing a backup point to restore from.

```powershell
$RecoveryOption = New-DPMRecoveryOption -HyperVDatasource -TargetServer "HVDCenter02" -RecoveryLocation AlternateHyperVServer -RecoveryType Recover -TargetLocation "C:\VMRecovery"

$PG = Get-DPMProtectionGroup –DPMServerName "TestingServer"
$DS = Get-DPMDatasource -ProtectionGroup $PG[0]
$RecoveryPoints = Get-DPMRecoverypoint -Datasource $DS[0] -Online

Restore-DPMRecoverableItem -RecoverableItem $RecoveryPoints[0] -RecoveryOption $RecoveryOption
```

The commands can easily be extended for any datasource type.

## Next steps

* For more information about DPM to Azure Backup see [Introduction to DPM Backup](backup-azure-dpm-introduction.md)
