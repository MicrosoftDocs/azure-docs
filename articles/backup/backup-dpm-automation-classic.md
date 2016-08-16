<properties
	pageTitle="Azure Backup - Deploy and manage back up for DPM using PowerShell | Microsoft Azure"
	description="Learn how to deploy and manage Azure Backup for Data Protection Manager (DPM) using PowerShell"
	services="backup"
	documentationCenter=""
	authors="Nkolli1"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/01/2016"
	ms.author="jimpark; trinadhk; anuragm; markgal"/>


# Deploy and manage backup to Azure for Data Protection Manager (DPM) servers using PowerShell

> [AZURE.SELECTOR]
- [ARM](backup-dpm-automation.md)
- [Classic](backup-dpm-automation-classic.md)

This article shows you how to use PowerShell to setup Azure Backup on a DPM server, and to manage backup and recovery.

## Setting up the PowerShell environment

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)]

Before you can use PowerShell to manage backups from Data Protection Manager to Azure, you will need to have the right environment in PowerShell. At the start of the PowerShell session, ensure that you run the following command to import the right modules and allow you to correctly reference the DPM cmdlets:

```
PS C:> & "C:\Program Files\Microsoft System Center 2012 R2\DPM\DPM\bin\DpmCliInitScript.ps1"

Welcome to the DPM Management Shell!

Full list of cmdlets: Get-Command
Only DPM cmdlets: Get-DPMCommand
Get general help: help
Get help for a cmdlet: help <cmdlet-name> or <cmdlet-name> -?
Get definition of a cmdlet: Get-Command <cmdlet-name> -Syntax
Sample DPM scripts: Get-DPMSampleScript
```

## Setup and Registration
To begin:

1. [Download latest PowerShell](https://github.com/Azure/azure-powershell/releases) (minimum version required is : 1.0.0)
2. Enable the Azure Backup commandlets by switching to *AzureResourceManager* mode by using the **Switch-AzureMode** commandlet:

```
PS C:\> Switch-AzureMode AzureResourceManager
```

The following setup and registration tasks can be automated with PowerShell:

- Create a backup vault
- Installing the Azure Backup agent
- Registering with the Azure Backup service
- Networking settings
- Encryption settings

### Create a backup vault

> [AZURE.WARNING] For customers using Azure Backup for the first time, you need to register the Azure Backup provider to be used with your subscription. This can be done by running the following command: Register-AzureProvider -ProviderNamespace "Microsoft.Backup"

You can create a new backup vault using the **New-AzureRMBackupVault** commandlet. The backup vault is an ARM resource, so you need to place it within a Resource Group. In an elevated Azure PowerShell console, run the following commands:

```
PS C:\> New-AzureResourceGroup –Name “test-rg” -Region “West US”
PS C:\> $backupvault = New-AzureRMBackupVault –ResourceGroupName “test-rg” –Name “test-vault” –Region “West US” –Storage GRS
```

You can get a list of all the backup vaults in a given subscription using the **Get-AzureRMBackupVault** commandlet.


### Installing the Azure Backup agent on a DPM Server
Before you install the Azure Backup agent, you need to have the installer downloaded and present on the Windows Server. You can get the latest version of the installer from the [Microsoft Download Center](http://aka.ms/azurebackup_agent) or from the backup vault's Dashboard page. Save the installer to an easily accessible location like *C:\Downloads\*.

To install the agent, run the following command in an elevated PowerShell console **on the DPM server**:

```
PS C:\> MARSAgentInstaller.exe /q
```

This installs the agent with all the default options. The installation takes a few minutes in the background. If you do not specify the */nu* option the **Windows Update** window will open at the end of the installation to check for any updates.

The agent will show in the list of installed programs. To see the list of installed programs, go to **Control Panel** > **Programs** > **Programs and Features**.

![Agent installed](./media/backup-dpm-automation/installed-agent-listing.png)

#### Installation options
To see all the options available via the command-line, use the following command:

```
PS C:\> MARSAgentInstaller.exe /?
```

The available options include:

| Option | Details | Default |
| ---- | ----- | ----- |
| /q | Quiet installation | - |
| /p:"location" | Path to the installation folder for the Azure Backup agent. | C:\Program Files\Microsoft Azure Recovery Services Agent |
| /s:"location" | Path to the cache folder for the Azure Backup agent. | C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch |
| /m | Opt-in to Microsoft Update | - |
| /nu | Do not Check for updates after installation is complete | - |
| /d | Uninstalls Microsoft Azure Recovery Services Agent | - |
| /ph | Proxy Host Address | - |
| /po | Proxy Host Port Number | - |
| /pu | Proxy Host UserName | - |
| /pw | Proxy Password | - |

### Registering with the Azure Backup service
Before you can register with the Azure Backup service, you need to ensure that the [prerequisites](backup-azure-dpm-introduction.md) are met. You must:

- Have a valid Azure subscription
- Have a backup vault

To download the vault credentials, run the **Get-AzureBackupVaultCredentials** commandlet in an Azure PowerShell console and store it in a convenient location like *C:\Downloads\*.

```
PS C:\> $credspath = "C:\"
PS C:\> $credsfilename = Get-AzureRMBackupVaultCredentials -Vault $backupvault -TargetLocation $credspath
PS C:\> $credsfilename
f5303a0b-fae4-4cdb-b44d-0e4c032dde26_backuprg_backuprn_2015-08-11--06-22-35.VaultCredentials
```

Registering the machine with the vault is done using the [Start-DPMCloudRegistration](https://technet.microsoft.com/library/jj612787) cmdlet:

```
PS C:\> $cred = $credspath + $credsfilename
PS C:\> Start-DPMCloudRegistration -DPMServerName "TestingServer" -VaultCredentialsFilePath $cred
```

This will register the DPM Server named “TestingServer” with Microsoft Azure Vault using the specified vault credentials.

> [AZURE.IMPORTANT] Do not use relative paths to specify the vault credentials file. You must provide an absolute path as an input to the cmdlet.

### Initial configuration settings
Once the DPM Server is registered with the Azure Backup vault, it will start with default subscription settings. These subscription settings include Networking, Encryption and the Staging area. To begin changing the subscription settings you need to first get a handle on the existing (default) settings using the [Get-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612793) cmdlet:

```
$setting = Get-DPMCloudSubscriptionSetting -DPMServerName "TestingServer"
```

All modifications are made to this local PowerShell object ```$setting```  and then the full object is committed to DPM and Azure Backup to save them using the [Set-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612791) cmdlet. You need to use the ```–Commit``` flag to ensure that the changes are persisted. The settings will not be applied and used by Azure Backup unless committed.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -Commit
```

### Networking
If the connectivity of the DPM machine to the Azure Backup service on the internet is through a proxy server, then the proxy server settings should be provided for backups to succeed. This is done by using the ```-ProxyServer```, ```-ProxyPort```, ```-ProxyUsername``` and the ```ProxyPassword``` parameters with the [Set-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612791) cmdlet. In this example, there is no proxy server so we are explicitly clearing any proxy-related information.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -NoProxy
```

Bandwidth usage can also be controlled with options of ```-WorkHourBandwidth``` and ```-NonWorkHourBandwidth``` for a given set of days of the week. In this example we are not setting any throttling.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -NoThrottle
```

### Configuring the staging Area
The Azure Backup agent running on the DPM server needs temporary storage for data restored from the cloud (local staging area). Configure the staging area using the [Set-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612791) cmdlet and the ```-StagingAreaPath``` parameter.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -StagingAreaPath "C:\StagingArea"
```

In the example above, the staging area will be set to *C:\StagingArea* in the PowerShell object ```$setting```. Ensure that the specified folder already exists, or else the final commit of the subscription settings will fail.


### Encryption settings
The backup data sent to Azure Backup is encrypted to protect the confidentiality of the data. The encryption passphrase is the "password" to decrypt the data at the time of restore. It is important to keep this information safe and secure once it is set.

In the example below, the first command converts the string ```passphrase123456789``` to a secure string and assigns the secure string to the variable named ```$Passphrase```. the second command sets the secure string in ```$Passphrase``` as the password for encrypting backups.

```
PS C:\> $Passphrase = ConvertTo-SecureString -string "passphrase123456789" -AsPlainText -Force

PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -EncryptionPassphrase $Passphrase
```

> [AZURE.IMPORTANT] Keep the passphrase information safe and secure once it is set. You will not be able to restore data from Azure without this passphrase.

At this point, you should have made all the required changes to the ```$setting``` object. Remember to commit the changes.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $setting -Commit
```

## Protect data to Azure Backup
In this section, you will add a production server to DPM and then protect the data to local DPM storage and then to Azure Backup. In the examples we will demonstrate how to back up files and folders. The logic can easily be extended to backup any DPM-supported data source. All your DPM backups are governed by a Protection Group (PG) with four parts:

1. **Group members** is a list of all the protectable objects (also known as *Datasources* in DPM) that you want to protect in the same protection group. For example, you may want to protect production VMs in one protection group and SQL Server databases in another protection group as they may have different backup requirements. Before you can back up any datasource on a production server you need to make sure the DPM Agent is installed on the server and is managed by DPM. Follow the steps for [installing the DPM Agent](https://technet.microsoft.com/library/bb870935.aspx) and linking it to the appropriate DPM Server.
2. **Data protection method** specifies the target backup locations - tape, disk, and cloud. In our example we will protect data to the local disk and to the cloud.
3. A **backup schedule** that specifies when backups need to be taken and how often the data should be synchronized between the DPM Server and the production server.
4. A **retention schedule** that specifies how long to retain the recovery points in Azure.

### Creating a protection group
Start by creating a new Protection Group using the [New-DPMProtectionGroup](https://technet.microsoft.com/library/hh881722) cmdlet.

```
PS C:\> $PG = New-DPMProtectionGroup -DPMServerName " TestingServer " -Name "ProtectGroup01"
```

The above cmdlet will create a Protection Group named *ProtectGroup01*. An existing protection group can also be modified later to add backup to the Azure cloud. However, to make any changes to the Protection Group - new or existing - we need to get a handle on a *modifiable* object using the [Get-DPMModifiableProtectionGroup](https://technet.microsoft.com/library/hh881713) cmdlet.

```
PS C:\> $MPG = Get-ModifiableProtectionGroup $PG
```

### Adding group members to the Protection Group
Each DPM Agent knows the list of datasources on the server that it is installed on. To add a datasource to the Protection Group, the DPM Agent needs to first send a list of the datasources back to the DPM server. One or more datasources are then selected and added to the Protection Group. The PowerShell steps needed to get achieve this are:

1. Fetch a list of all servers managed by DPM through the DPM Agent.
2. Choose a specific server.
3. Fetch a list of all datasources on the server.
4. Choose one or more datasources and add them to the Protection Group

The list of servers on which the DPM Agent is installed and is being managed by the DPM Server is acquired with the [Get-DPMProductionServer](https://technet.microsoft.com/library/hh881600) cmdlet. In this example we will filter and only configure PS with name *productionserver01* for backup.

```
PS C:\> $server = Get-ProductionServer -DPMServerName "TestingServer" | where {($_.servername) –contains “productionserver01”
```

Now fetch the list of datasources on ```$server``` using the [Get-DPMDatasource](https://technet.microsoft.com/library/hh881605) cmdlet. In this example we are filtering for the volume *D:\* which we want to configure for backup. This datasource is then added to the Protection Group using the [Add-DPMChildDatasource](https://technet.microsoft.com/library/hh881732) cmdlet. Remember to use the *modifable* protection group object ```$MPG``` to make the additions.

```
PS C:\> $DS = Get-Datasource -ProductionServer $server -Inquire | where { $_.Name -contains “D:\” }

PS C:\> Add-DPMChildDatasource -ProtectionGroup $MPG -ChildDatasource $DS
```

Repeat this step as many times as required, until you have added all the chosen datasources to the protection group. You can also start with just one datasource, and complete the workflow for creating the Protection Group, and at a later point add more datasources to the Protection Group.

### Selecting the data protection method
Once the datasources have been added to the Protection Group, the next step is to specify the protection method using the [Set-DPMProtectionType](https://technet.microsoft.com/library/hh881725) cmdlet. In this example, the Protection Group will be setup for local disk and cloud backup. You also need to specify the datasource that you want to protect to cloud using the [Add-DPMChildDatasource](https://technet.microsoft.com/library/hh881732.aspx) cmdlet with -Online flag.

```
PS C:\> Set-DPMProtectionType -ProtectionGroup $MPG -ShortTerm Disk –LongTerm Online
PS C:\> Add-DPMChildDatasource -ProtectionGroup $MPG -ChildDatasource $DS –Online
```

### Setting the retention range
Set the retention for the backup points using the [Set-DPMPolicyObjective](https://technet.microsoft.com/library/hh881762) cmdlet. While it might seem odd to set the retention before the backup schedule has been defined, using the ```Set-DPMPolicyObjective``` cmdlet automatically sets a default backup schedule that can then be modified. It is always possible to set the backup schedule first and the retention policy after.

In the example below, the cmdlet sets the retention parameters for disk backups. This will retain backups for 10 days, and sync data every 6 hours between the production server and the DPM server. The ```SynchronizationFrequencyMinutes``` doesn't define how often a backup point is created, but how often data is copied to the DPM server; this prevents backups from becoming too large.

```
PS C:\> Set-DPMPolicyObjective –ProtectionGroup $MPG -RetentionRangeInDays 10 -SynchronizationFrequencyMinutes 360
```

For backups going to Azure (DPM refers to these as Online backups) the retention ranges can be configured for [long term retention using a Grandfather-Father-Son scheme (GFS)](backup-azure-backup-cloud-as-tape.md). That is, you can define a combined retention policy involving daily, weekly, monthly and yearly retention policies. In this example, we create an array representing the complex retention scheme that we want, and then configure the retention range using the [Set-DPMPolicyObjective](https://technet.microsoft.com/library/hh881762) cmdlet.

```
PS C:\> $RRlist = @()
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 180, Days)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 104, Weeks)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 60, Month)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 10, Years)
PS C:\> Set-DPMPolicyObjective –ProtectionGroup $MPG -OnlineRetentionRangeList $RRlist
```

### Set the backup schedule
DPM sets a default backup schedule automatically if you specify the protection objective using the ```Set-DPMPolicyObjective``` cmdlet. To change the default schedules, use the [Get-DPMPolicySchedule](https://technet.microsoft.com/library/hh881749) cmdlet followed by the [Set-DPMPolicySchedule](https://technet.microsoft.com/library/hh881723) cmdlet.

```
PS C:\> $onlineSch = Get-DPMPolicySchedule -ProtectionGroup $mpg -LongTerm Online
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[0] -TimesOfDay 02:00
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[1] -TimesOfDay 02:00 -DaysOfWeek Sa,Su –Interval 1
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[2] -TimesOfDay 02:00 -RelativeIntervals First,Third –DaysOfWeek Sa
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $MPG -Schedule $onlineSch[3] -TimesOfDay 02:00 -DaysOfMonth 2,5,8,9 -Months Jan,Jul
PS C:\> Set-DPMProtectionGroup -ProtectionGroup $MPG
```

In the example above, ```$onlineSch``` is an array with four elements that contains the existing online protection schedule for the Protection Group in the GFS scheme:

1. ```$onlineSch[0]``` will contain the daily schedule
2. ```$onlineSch[1]``` will contain the weekly schedule
3. ```$onlineSch[2]``` will contain the monthly schedule
4. ```$onlineSch[3]``` will contain the yearly schedule

So if you need to modify the weekly schedule, you need to refer to the ```$onlineSch[1]```.

### Initial backup
When backing up a datasource for the first time, DPM needs to create an initial replica which will create a copy of the datasource to be protected on DPM replica volume. This activity can either be scheduled for a specific time, or can be triggered manually, using the [Set-DPMReplicaCreationMethod](https://technet.microsoft.com/library/hh881715) cmdlet with the parameter ```-NOW```.

```
PS C:\> Set-DPMReplicaCreationMethod -ProtectionGroup $MPG -NOW
```
### Changing the size of DPM Replica & recovery point volume
You can also change the size of DPM Replica volume as well as Shadow Copy volume using [Set-DPMDatasourceDiskAllocation](https://technet.microsoft.com/library/hh881618.aspx) cmdlet as in the below example:
Get-DatasourceDiskAllocation -Datasource $DS
Set-DatasourceDiskAllocation -Datasource $DS -ProtectionGroup $MPG -manual -ReplicaArea (2gb) -ShadowCopyArea (2gb)

### Committing the changes to the Protection Group
Finally, the changes need to be committed before DPM can take the backup per the new Protection Group configuration. This is done using the [Set-DPMProtectionGroup](https://technet.microsoft.com/library/hh881758) cmdlet.

```
PS C:\> Set-DPMProtectionGroup -ProtectionGroup $MPG
```
## View the backup points
You can use the [Get-DPMRecoveryPoint](https://technet.microsoft.com/library/hh881746) cmdlet to get a list of all recovery points for a datasource. In this example, we will:
- fetch all the PGs on the DPM server which will be stored in an array ```$PG```
- get the datasources corresponding to the ```$PG[0]```
- get all the recovery points for a datasource.

```
PS C:\> $PG = Get-DPMProtectionGroup –DPMServerName "TestingServer"
PS C:\> $DS = Get-DPMDatasource -ProtectionGroup $PG[0]
PS C:\> $RecoveryPoints = Get-DPMRecoverypoint -Datasource $DS[0] -Online
```

## Restore data protected on Azure
Restoring data is a combination of a ```RecoverableItem``` object and a ```RecoveryOption``` object. In the previous section, we got a list of the backup points for a datasource.

In the example below, we demonstrate how to restore a Hyper-V virtual machine from Azure Backup by combining backup points with the target for recovery. This includes:

- Creating a recovery option using the  [New-DPMRecoveryOption](https://technet.microsoft.com/library/hh881592) cmdlet.
- Fetching the array of backup points using the ```Get-DPMRecoveryPoint``` cmdlet.
- Choosing a backup point to restore from.

```
PS C:\> $RecoveryOption = New-DPMRecoveryOption -HyperVDatasource -TargetServer "HVDCenter02" -RecoveryLocation AlternateHyperVServer -RecoveryType Recover -TargetLocation “C:\VMRecovery”

PS C:\> $PG = Get-DPMProtectionGroup –DPMServerName "TestingServer"
PS C:\> $DS = Get-DPMDatasource -ProtectionGroup $PG[0]
PS C:\> $RecoveryPoints = Get-DPMRecoverypoint -Datasource $DS[0] -Online

PS C:\> Restore-DPMRecoverableItem -RecoverableItem $RecoveryPoints[0] -RecoveryOption $RecoveryOption
```

The commands can easily be extended for any datasource type.

## Next steps

- For more information about Azure Backup for DPM see [Introduction to DPM Backup](backup-azure-dpm-introduction.md)
