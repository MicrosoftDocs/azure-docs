<properties
	pageTitle="Azure Backup - Deploy and manage back up for DPM using Windows PowerShell | Microsoft Azure"
	description="Learn how to deploy and manage Azure Backup for Data Protection Manager (DPM) using Windows PowerShell"
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/17/2015"
	ms.author="jimpark"/>


# Deploy and manage back up to Azure for Data Protection Manager (DPM) servers using Windows PowerShell
This article shows you how to use Windows PowerShell® command-line interface to setup Azure Backup on a DPM server, and to manage backup and recovery.

## Setting up the Windows PowerShell environment
Before you can use Windows PowerShell to manage Azure Backup, you will need to have the right Windows PowerShell version and environment variables setup.

Verify you have Windows PowerShell version 3.0 or 4.0. To find the version of Windows PowerShell, type this command at a Windows/DPM PowerShell command prompt.

```
$PSVersionTable
```

You will receive the following type of information:

| Name | Value |
| ---- | ----- |
| PSVersion | 3.0 |
| WSManStackVersion | 3.0 |
| SerializationVersion | 1.1.0.1 |
| CLRVersion | 4.0.30319.18444 |
| BuildVersion | 6.2.9200.16481 |
| PSCompatibleVersions | {1.0, 2.0, 3.0} |
| PSRemotingProtocolVersion | 2.2 |

Verify that the value of **PSVersion** is 3.0 or 4.0. If not, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

## Setup and Registration
### Installing the Azure Backup agent on DPM Server
In order to install the Azure Backup agent, you need to have the installer downloaded and present on the Windows Server. You can get the latest version of the installer from the [Microsoft Download Center](aka.ms/azurebackup_agent). Save the installer to an easily accessible location like *C:\*.

To install the agent, run the following command in an elevated DPM Windows PowerShell console:

```
PS C:\> MARSAgentInstaller.exe /q
```

This will install the agent with all the default options. The installation takes a few minutes in the background. If you do not specify the */nu* option the Windows Update window will open at the end of the installation to check for any updates.

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
Before you can register with the Azure Backup service, ensure that the following prerequisites are met:
- Have a valid Azure subscription
- Create a backup vault
- Download the vault credentials and store them in a convenient location (like *C:\Downloads\*). The vault credentials can also be renamed for convenience.

Registering the machine with the vault is done using the [Start-DPMCloudRegistration](https://technet.microsoft.com/library/jj612787) cmdlet:

```
PS C:\> Start-DPMCloudRegistration -DPMServerName "TestingServer" -VaultCredentialsFilePath "C:\DPMTESTVault_Friday, September 5, 2014.VaultCredentials"
```

This will register the DPM Server named “TestingServer” with Microsoft Azure Vault using the vault credentials located in *C:\*.

> [AZURE.IMPORTANT] Do not use relative paths to specify the vault credentials file. You must provide an absolute path as an input to the cmdlet.

### Configuring DPM backup options (subscription settings) for Online Back Up
Once the DPM Server is registered for Online Protection it will be set with default subscription settings, which specify various backup options. If you want to change the subscription settings you need to get the existing setting and then modify as per your requirements.

#### Getting existing subscription settings for DPM Server
To configure the DPM Online subscription settings you first need to get the existing settings using the  [Get-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612793.aspx) cmdlet:

```
$Setting = Get-DPMCloudSubscriptionSetting -DPMServerName "TestingServer"
```

You need to run this command to get the subscription setting object which can be used to configure various options and then save the settings in the end. Running the command for a new DPM Server will return the default settings.

#### Modifying subscription settings
You can configure the following settings for the DPM online backup subscription using [Set-DPMCloudSubscriptionSetting](https://technet.microsoft.com/library/jj612791) cmdlet:

##### Staging Area
The Azure Backup agent running on the DPM server needs temporary storage for data restored from the cloud (local staging area).  You can use the below command to configure the staging area. This will set the staging area as “C:\StagingArea” for **$setting**, but the configuration is not yet applied to DPM Server unless you commit the settings.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $Setting -StagingAreaPath "C:\StagingArea"
```

> [AZURE.NOTE] Make sure that the folder specified in the above command already exists. Otherwise you will get an error message while saving the subscription settings

##### Networking
Connectivity from the DPM machine to the internet is through a proxy server. The proxy settings can be provided to the agent. In this example, there is no proxy server so we are explicitly clearing any proxy-related information.

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $Setting -NoProxy
```

Bandwidth usage can also be controlled with the options of *work hour bandwidth* and *non-work hour bandwidth* for a given set of days of the week. In this example we are not setting any throttling

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $Setting -NoThrottle
```

##### Encryption settings
The backup data sent to Azure Backup is encrypted to protect the confidentiality of the data. The encryption passphrase is the "password" to decrypt the data at the time of restore.

> [AZURE.IMPORTANT] Keep this information safe and secure once it is set.

In the example below, the first command converts the string passphrase123456789 to a secure string and assigns the secure string to the variable named $Passphrase. Second command sets the secure string in $Passphrase as the password for encrypting backups

```
PS C:\> $Passphrase = ConvertTo-SecureString -string "passphrase123456789" -AsPlainText -Force
```

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $Setting -EncryptionPassphrase $Passphrase
```

#### Saving Subscription settings
You need to commit the changes to DPM Server using *–Commit* option

```
PS C:\> Set-DPMCloudSubscriptionSetting -DPMServerName "TestingServer" -SubscriptionSetting $Setting -Commit
```

> [AZURE.NOTE] Settings will not be applied unless committed.

## Protecting data to Azure Backup
The next steps will show you how you can add a production server to DPM and then protect the data to disk and online to Azure. In the examples we will demonstrate how to back up files and folders. The logic can easily be extended to backup any supported data source. As a pre-requisite you need to setup and register DPM Server for Online protection.

All your DPM backups are governed by a protection group (PG) which comprises four parts

1. **Group members** is a list of all the protectable objects that you want to protect in the same PG. For example, you may want to protect production VMs in one PG and the test VMs in another PG as they may have different backup requirements.
2. **Data protection method** is used to specify where you want to protect the data. In this example we will protect data on disk and Online protection to Azure cloud.
3. A **backup schedule** that specifies when backups need to be taken and how often the data should be synchronized between DPM Server copy and the production server.
4. A **retention schedule** that specifies how long to retain the recovery points in Azure.

### Create a protecton group and back up data at scheduled intervals
#### Adding a production server to a DPM server
Before you can backup data on a production server you need to make sure the DPM Agent is installed on the production server and is managed by DPM. Please follow the steps [here](https://technet.microsoft.com/library/bb870935.aspx) for installing the DPM Agent and configuring it to be backed up by appropriate DPM Server.

#### Creating a PG
In this artlcle, since we're automating backup, we'll assume nothing has been configured. We begin by creating a new PG using the [New-DPMProtectionGroup](https://technet.microsoft.com/library/hh881722.aspx) cmdlet.

```
PS C:\> $PG = New-DPMProtectionGroup -DPMServerName " TestingServer " -Name "ProtectGroup01"
```

Before we make any changes to the PG we need to get it into modifiable mode using the  [Get-DPMModifiableProtectionGroup](https://technet.microsoft.com/library/hh881713.aspx) cmdlet.

```
PS C:\> $MPG = Get-ModifiableProtectionGroup $PG
```

The above cmdlets will create a PG named “ProtectGroup01” but they do not do any backup yet. You need to define what you want to backup, when backups will run, and where the backups will be stored.

### Adding group members to the PG
There are several steps to add a datasource to the PG

#### Getting Production Server (PS) that we want to backup
You can fetch all the PS for which DPM Agent is installed and being managed by the DPM Server using the  [Get-DPMProductionServer](https://technet.microsoft.com/library/hh881600.aspx) cmdlet. For this example we will filter and only configure PS with name “productionserver01” for backup.

```
PS C:\> $PS = Get-ProductionServer -DPMServerName "TestingServer" |where {($_.servername) –contains “productionserver01”
```

### Run an inquiry to get a list of datasources on PS
You can run an Inquiry on PS machine to get a list of all datasources that DPM can backup using the  [Get-DPMDatasource](https://technet.microsoft.com/library/hh881605.aspx) cmdlet. For this example you can filter the datasource “D:\” on the PS for which we want to configure protection.

```
PS C:\> $DS = Get-Datasource -ProductionServer $PS -Inquire | where { $_.Name -contains “D:\” }
```

#### Adding the datasource for protection
You can add the datasource to the PG “ProtectGroup01” that we created in the example above using the [Add-DPMChildDatasource](https://technet.microsoft.com/library/hh881732.aspx) cmdlet

```
PS C:\> Add-DPMChildDatasource -ProtectionGroup $MPG -ChildDatasource $DS
```

### Selecting Data Protection Method
Once you've added the datasource to the PG you need to specify the protection method. In this case we setup the PG for short term protection on Disk and Long term protection on Tape.

```
PS C:\> Set-DPMProtectionType -ProtectionGroup $PG -ShortTerm Disk –LongTerm Online
```

### Specify Recovery point goals
#### Setting retention Range
You can set the retention range for the PG using [Set-DPMPolicyObjective](https://technet.microsoft.com/library/hh881762.aspx)
The below command sets the *retentionrange* and *synchronization frequency* for disk based recovery point.

```
PS C:\> Set-DPMPolicyObjective –ProtectionGroup $MPG -RetentionRangeInDays 10 -SynchronizationFrequency 360
```

For Online recovery points you can configure retention ranges for various GFS schemes (ie. Daily, Weekly, Monthly and Yearly). In this example, we create an object with various retention ranges and then configure the Online retention range using the object as shown in the below example.

```
PS C:\> $RRlist = @()
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 180, Days)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 104, Weeks)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 60, Month)
PS C:\> $RRList += (New-Object -TypeName Microsoft.Internal.EnterpriseStorage.Dls.UI.ObjectModel.OMCommon.RetentionRange -ArgumentList 10, Years)
PS C:\> Set-DPMPolicyObjective –ProtectionGroup $MPG -OnlineRetentionRangeList $RRlist
```

#### Setting Backup schedules
DPM sets default schedules automatically if you specify the protection objective using the **Set-PolicyObjective** cmdlet. To change the default schedules, use the [Get-DPMPolicySchedule](https://technet.microsoft.com/library/hh881749.aspx) cmdlet followed by the [Set-DPMPolicySchedule](https://technet.microsoft.com/library/hh881723.aspx) cmdlet.

```
PS C:\> $onlineSch=Get-DPMPolicySchedule -ProtectionGroup $mpg -LongTermOnline
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $Mpg -Schedule $onlineSch[0] -TimesOfDay 02:00
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $Mpg -Schedule $onlineSch[1] -TimesOfDay 02:00 -DaysOfWeek Sa,Su –Interval 1
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $Mpg -Schedule $onlineSch[2] -TimesOfDay 02:00 -RelativeIntervals First,Third –DaysOfWeek Sa
PS C:\> Set-DPMPolicySchedule -ProtectionGroup $Mpg -Schedule $onlineSch[3] -TimesOfDay 02:00 -DaysOfMonth 2,5,8,9 -Months Jan,Jul
```

#### Replica Creation
If you're backing up datasource for the first time, DPM needs to create an initial replica which will create a copy of the datasource to be protected on the DPM replica volume. You can either schedule the creation of a replica automatically at a specific time, or manually, using the  [Set-DPMReplicaCreationMethod](https://technet.microsoft.com/library/hh881715.aspx) cmdlet.

```
Set-DPMReplicaCreationMethod -ProtectionGroup $MPG -NOW
```

#### Committing the PG
Finally, you need to commit the changes before DPM can take the backup per the PG configuration using the [Set-DPMProtectionGroup](https://technet.microsoft.com/library/hh881758.aspx) cmdlet.

```
PS C:\> Set-DPMProtectionGroup -ProtectionGroup $MPG
```

## Getting a list of all Online Recovery Points
You can use the  [Get-DPMRecoveryPoint](https://technet.microsoft.com/library/hh881746.aspx) cmdlet to get a list of all the recovery points for a datasource. In this example, we:
- fetch all the PGs on the DPM server which will be stored in an array $PG
- get the datasources corresponding to the $PG[0]
- get all the recovery points for a datasource.

```
PS C:\> $PG = Get-DPMProtectionGroup –DPMServerName "TestingServer"
PS C:\> $DS = Get-DPMDatasource -ProtectionGroup $PG[0]
PS C:\> $RecoveryPoints = Get-DPMRecoverypoint -Datasource $DS[0] -Online
```

## Restore data protected on Azure
In this example we demonstrate how to restore a Hyper-V VM from an Online Recovery Point but the commands can easily be extended for any datasource type.

You first need to create a recovery option using the  [New-DPMRecoveryOption](https://technet.microsoft.com/library/hh881592.aspx) cmdlet.  For the below example we will recover a Hyper-V datasource to an alternate location.

```
PS C:\> $RecoveryOption = New-DPMRecoveryOption -HyperVDatasource -TargetServer "HVDCenter02" -RecoveryLocation AlternateHyperVServer -RecoveryType Recover -TargetLocation “c:\VMRecovery”
```

Once you have configured the recovery option you'll restore the online recovery point that you fetched in the [Getting a list of all Online Recovery Points](#Getting-a-list-of-all-Online-Recovery-Points) section above.

```
PS C:\> Restore-DPMRecoverableItem -RecoverableItem $RecoveryPoints -RecoveryOption $RecoveryOption
```
## Next steps
For more information about Azure Backup for DPM see [Introduction to Azure DPM Backup](backup-azure-dpm-introduction.md)
