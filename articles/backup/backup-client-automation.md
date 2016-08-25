<properties
	pageTitle="Deploy and manage backup for Windows Server/Client using PowerShell | Microsoft Azure"
	description="Learn how to deploy and manage Azure Backup using PowerShell"
	services="backup"
	documentationCenter=""
	authors="saurabhsensharma"
	manager="shivamg"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/23/2016"
	ms.author="markgal;jimpark;nkolli;trinadhk"/>


# Deploy and manage backup to Azure for Windows Server/Windows Client using PowerShell

> [AZURE.SELECTOR]
- [ARM](backup-client-automation.md)
- [Classic](backup-client-automation-classic.md)

This article shows you how to use PowerShell for setting up Azure Backup on Windows Server or a Windows client, and managing backup and recovery.

## Install Azure PowerShell

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)]

This article focuses on the Azure Resource Manager (ARM) PowerShell cmdlets that enable you to use a Recovery Services vault in a resource group.

In October 2015, Azure PowerShell 1.0 was released. This release succeeded the 0.9.8 release and brought about some significant changes, especially in the naming pattern of the cmdlets. 1.0 cmdlets follow the naming pattern {verb}-AzureRm{noun}; whereas, the 0.9.8 names do not include **Rm** (for example, New-AzureRmResourceGroup instead of New-AzureResourceGroup). When using Azure PowerShell 0.9.8, you must first enable the Resource Manager mode by running the **Switch-AzureMode AzureResourceManager** command. This command is not necessary in 1.0 or later.

If you want to use your scripts written for the 0.9.8 environment, in the 1.0 or later environment, you should carefully test the scripts in a pre-production environment before using them in production to avoid unexpected impact.

[Download the latest PowerShell release](https://github.com/Azure/azure-powershell/releases) (minimum version required is : 1.0.0)


[AZURE.INCLUDE [arm-getting-setup-powershell](../../includes/arm-getting-setup-powershell.md)]

## Create a recovery services vault

The following steps lead you through creating a Recovery Services vault. A Recovery Services vault is different than a Backup vault.

1. If you are using Azure Backup for the first time, you must use the **Register-AzureRMResourceProvider** cmdlet to register the Azure Recovery Service provider with your subscription.

    ```
    PS C:\> Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

2. The Recovery Services vault is an ARM resource, so you need to place it within a Resource Group. You can use an existing resource group, or create a new one. When creating a new resource group, specify the name and location for the resource group.  

    ```
    PS C:\> New-AzureRmResourceGroup –Name "test-rg" –Location "West US"
    ```

3. Use the **New-AzureRmRecoveryServicesVault** cmdlet to create the new vault. Be sure to specify the same location for the vault as was used for the resource group.

    ```
    PS C:\> New-AzureRmRecoveryServicesVault -Name "testvault" -ResourceGroupName " test-rg" -Location "West US"
    ```

4. Specify the type of storage redundancy to use; you can use [Locally Redundant Storage (LRS)](../storage/storage-redundancy.md#locally-redundant-storage) or [Geo Redundant Storage (GRS)](../storage/storage-redundancy.md#geo-redundant-storage). The following example shows the -BackupStorageRedundancy option for testVault is set to GeoRedundant.

    > [AZURE.TIP] Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it is convenient to store the Backup Recovery Services vault object in a variable.

    ```
    PS C:\> $vault1 = Get-AzureRmRecoveryServicesVault –Name "testVault"
    PS C:\> Set-AzureRmRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
    ```

## View the vaults in a subscription
Use **Get-AzureRmRecoveryServicesVault** to view the list of all vaults in the current subscription. You can use this command to check that a new  vault was created, or to see what vaults are available in the subscription.

Run the command, Get-AzureRmRecoveryServicesVault, and all vaults in the subscription are listed.

```
PS C:\> Get-AzureRmRecoveryServicesVault
Name              : Contoso-vault
ID                : /subscriptions/1234
Type              : Microsoft.RecoveryServices/vaults
Location          : WestUS
ResourceGroupName : Contoso-docs-rg
SubscriptionId    : 1234-567f-8910-abc
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```


## Installing the Azure Backup agent
Before you install the Azure Backup agent, you need to have the installer downloaded and present on the Windows Server. You can get the latest version of the installer from the [Microsoft Download Center](http://aka.ms/azurebackup_agent) or from the Recovery Services vault's Dashboard page. Save the installer to an easily accessible location like *C:\Downloads\*.

To install the agent, run the following command in an elevated PowerShell console:

```
PS C:\> MARSAgentInstaller.exe /q
```

This installs the agent with all the default options. The installation takes a few minutes in the background. If you do not specify the */nu* option then the **Windows Update** window will open at the end of the installation to check for any updates. Once installed, the agent will show in the list of installed programs.

To see the list of installed programs, go to **Control Panel** > **Programs** > **Programs and Features**.

![Agent installed](./media/backup-client-automation/installed-agent-listing.png)

### Installation options

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


## Registering Windows Server or Windows client machine to a Recovery Services Vault

After you created the Recovery Services vault, download the latest agent and the vault credentials and store it in a convenient location like C:\Downloads.

```
PS C:\> $credspath = "C:\downloads"
PS C:\> $credsfilename = Get-AzureRmRecoveryServicesVaultSettingsFile -Backup -Vault $vault1 -Path  $credspath
PS C:\> $credsfilename C:\downloads\testvault\_Sun Apr 10 2016.VaultCredentials
```

On the Windows Server or Windows client machine, run the [Start-OBRegistration](https://technet.microsoft.com/library/hh770398%28v=wps.630%29.aspx) cmdlet to register the machine with the vault.

```
PS C:\> $cred = $credspath + $credsfilename
PS C:\> Start-OBRegistration-VaultCredentials $cred -Confirm:$false
CertThumbprint      :7a2ef2caa2e74b6ed1222a5e89288ddad438df2
SubscriptionID      : ef4ab577-c2c0-43e4-af80-af49f485f3d1
ServiceResourceName: testvault
Region              :West US
Machine registration succeeded.
```

> [AZURE.IMPORTANT] Do not use relative paths to specify the vault credentials file. You must provide an absolute path as an input to the cmdlet.

## Networking settings
When the connectivity of the Windows machine to the internet is through a proxy server, the proxy settings can also be provided to the agent. In this example, there is no proxy server, so we are explicitly clearing any proxy-related information.

Bandwidth usage can also be controlled with the options of ```work hour bandwidth``` and ```non-work hour bandwidth``` for a given set of days of the week.

Setting the proxy and bandwidth details is done using the [Set-OBMachineSetting](https://technet.microsoft.com/library/hh770409%28v=wps.630%29.aspx) cmdlet:

```
PS C:\> Set-OBMachineSetting -NoProxy
Server properties updated successfully.

PS C:\> Set-OBMachineSetting -NoThrottle
Server properties updated successfully.
```

## Encryption settings
The backup data sent to Azure Backup is encrypted to protect the confidentiality of the data. The encryption passphrase is the "password" to decrypt the data at the time of restore.

```
PS C:\> ConvertTo-SecureString -String "Complex!123_STRING" -AsPlainText -Force | Set-OBMachineSetting
Server properties updated successfully
```

> [AZURE.IMPORTANT] Keep the passphrase information safe and secure once it is set. You will not be able to restore data from Azure without this passphrase.

## Back up files and folders
All backups from Windows Servers and clients to Azure Backup are governed by a policy. The policy comprises three parts:

1. A **backup schedule** that specifies when backups need to be taken and synchronized with the service.
2. A **retention schedule** that specifies how long to retain the recovery points in Azure.
3. A **file inclusion/exclusion specification** that dictates what should be backed up.

In this document, since we're automating backup, we'll assume nothing has been configured. We begin by creating a new backup policy using the [New-OBPolicy](https://technet.microsoft.com/library/hh770416.aspx) cmdlet.

```
PS C:\> $newpolicy = New-OBPolicy
```

At this time the policy is empty and other cmdlets are needed to define what items will be included or excluded, when backups will run, and where the backups will be stored.

### Configuring the backup schedule
The first of the 3 parts of a policy is the backup schedule, which is created using the [New-OBSchedule](https://technet.microsoft.com/library/hh770401) cmdlet. The backup schedule defines when backups need to be taken. When creating a schedule you need to specify 2 input parameters:

- **Days of the week** that the backup should run. You can run the backup job on just one day, or every day of the week, or any combination in between.
- **Times of the day** when the backup should run. You can define up to 3 different times of the day when the backup will be triggered.

For instance, you could configure a backup policy that runs at 4PM every Saturday and Sunday.

```
PS C:\> $sched = New-OBSchedule -DaysofWeek Saturday, Sunday -TimesofDay 16:00
```

The backup schedule needs to be associated with a policy, and this can be achieved by using the [Set-OBSchedule](https://technet.microsoft.com/library/hh770407) cmdlet.

```
PS C:> Set-OBSchedule -Policy $newpolicy -Schedule $sched
BackupSchedule : 4:00 PM Saturday, Sunday, Every 1 week(s) DsList : PolicyName : RetentionPolicy : State : New PolicyState : Valid
```
### Configuring a retention policy
The retention policy defines how long recovery points created from backup jobs are retained. When creating a new retention policy using the [New-OBRetentionPolicy](https://technet.microsoft.com/library/hh770425) cmdlet, you can specify the number of days that the backup recovery points need to be retained with Azure Backup. The example below sets a retention policy of 7 days.

```
PS C:\> $retentionpolicy = New-OBRetentionPolicy -RetentionDays 7
```

The retention policy must be associated with the main policy using the cmdlet [Set-OBRetentionPolicy](https://technet.microsoft.com/library/hh770405):

```
PS C:\> Set-OBRetentionPolicy -Policy $newpolicy -RetentionPolicy $retentionpolicy

BackupSchedule  : 4:00 PM
                  Saturday, Sunday,
                  Every 1 week(s)
DsList          :
PolicyName      :
RetentionPolicy : Retention Days : 7

                  WeeklyLTRSchedule :
                  Weekly schedule is not set

                  MonthlyLTRSchedule :
                  Monthly schedule is not set

                  YearlyLTRSchedule :
                  Yearly schedule is not set

State           : New
PolicyState     : Valid
```
### Including and excluding files to be backed up
An ```OBFileSpec``` object defines the files to be included and excluded in a backup. This is a set of rules that scope out the protected files and folders on a machine. You can have as many file inclusion or exclusion rules as required, and associate them with a policy. When creating a new OBFileSpec object, you can:

- Specify the files and folders to be included
- Specify the files and folders to be excluded
- Specify recursive backup of data in a folder (or) whether only the top-level files in the specified folder should be backed up.

The latter is achieved by using the -NonRecursive flag in the New-OBFileSpec command.

In the example below, we'll back up volume C: and D: and exclude the OS binaries in the Windows folder and any temporary folders. To do so we'll create two file specifications using the [New-OBFileSpec](https://technet.microsoft.com/library/hh770408) cmdlet - one for inclusion and one for exclusion. Once the file specifications have been created, they're associated with the policy using the [Add-OBFileSpec](https://technet.microsoft.com/library/hh770424) cmdlet.

```
PS C:\> $inclusions = New-OBFileSpec -FileSpec @("C:\", "D:\")

PS C:\> $exclusions = New-OBFileSpec -FileSpec @("C:\windows", "C:\temp") -Exclude

PS C:\> Add-OBFileSpec -Policy $newpolicy -FileSpec $inclusions

BackupSchedule  : 4:00 PM
                  Saturday, Sunday,
                  Every 1 week(s)
DsList          : {DataSource
                  DatasourceId:0
                  Name:C:\
                  FileSpec:FileSpec
                  FileSpec:C:\
                  IsExclude:False
                  IsRecursive:True

                  , DataSource
                  DatasourceId:0
                  Name:D:\
                  FileSpec:FileSpec
                  FileSpec:D:\
                  IsExclude:False
                  IsRecursive:True

                  }
PolicyName      :
RetentionPolicy : Retention Days : 7

                  WeeklyLTRSchedule :
                  Weekly schedule is not set

                  MonthlyLTRSchedule :
                  Monthly schedule is not set

                  YearlyLTRSchedule :
                  Yearly schedule is not set

State           : New
PolicyState     : Valid


PS C:\> Add-OBFileSpec -Policy $newpolicy -FileSpec $exclusions

BackupSchedule  : 4:00 PM
                  Saturday, Sunday,
                  Every 1 week(s)
DsList          : {DataSource
                  DatasourceId:0
                  Name:C:\
                  FileSpec:FileSpec
                  FileSpec:C:\
                  IsExclude:False
                  IsRecursive:True
                  ,FileSpec
                  FileSpec:C:\windows
                  IsExclude:True
                  IsRecursive:True
                  ,FileSpec
                  FileSpec:C:\temp
                  IsExclude:True
                  IsRecursive:True

                  , DataSource
                  DatasourceId:0
                  Name:D:\
                  FileSpec:FileSpec
                  FileSpec:D:\
                  IsExclude:False
                  IsRecursive:True

                  }
PolicyName      :
RetentionPolicy : Retention Days : 7

                  WeeklyLTRSchedule :
                  Weekly schedule is not set

                  MonthlyLTRSchedule :
                  Monthly schedule is not set

                  YearlyLTRSchedule :
                  Yearly schedule is not set

State           : New
PolicyState     : Valid
```

### Applying the policy
Now the policy object is complete and has an associated backup schedule, retention policy, and an inclusion/exclusion list of files. This policy can now be committed for Azure Backup to use. Before you apply the newly created policy ensure that there are no existing backup policies associated with the server by using the [Remove-OBPolicy](https://technet.microsoft.com/library/hh770415) cmdlet. Removing the policy will prompt for confirmation. To skip the confirmation use the ```-Confirm:$false``` flag with the cmdlet.

```
PS C:> Get-OBPolicy | Remove-OBPolicy
Microsoft Azure Backup Are you sure you want to remove this backup policy? This will delete all the backed up data. [Y] Yes [A] Yes to All [N] No [L] No to All [S] Suspend [?] Help (default is "Y"):
```

Committing the policy object is done using the [Set-OBPolicy](https://technet.microsoft.com/library/hh770421) cmdlet. This will also ask for confirmation. To skip the confirmation use the ```-Confirm:$false``` flag with the cmdlet.

```
PS C:> Set-OBPolicy -Policy $newpolicy
Microsoft Azure Backup Do you want to save this backup policy ? [Y] Yes [A] Yes to All [N] No [L] No to All [S] Suspend [?] Help (default is "Y"):
BackupSchedule : 4:00 PM Saturday, Sunday, Every 1 week(s)
DsList : {DataSource
         DatasourceId:4508156004108672185
         Name:C:\
         FileSpec:FileSpec
         FileSpec:C:\
         IsExclude:False
         IsRecursive:True,

         FileSpec
         FileSpec:C:\windows
         IsExclude:True
         IsRecursive:True,

         FileSpec
         FileSpec:C:\temp
         IsExclude:True
         IsRecursive:True,

         DataSource
         DatasourceId:4508156005178868542
         Name:D:\
         FileSpec:FileSpec
         FileSpec:D:\
         IsExclude:False
         IsRecursive:True
	}
PolicyName : c2eb6568-8a06-49f4-a20e-3019ae411bac
RetentionPolicy : Retention Days : 7
              WeeklyLTRSchedule :
              Weekly schedule is not set

              MonthlyLTRSchedule :
              Monthly schedule is not set

              YearlyLTRSchedule :
              Yearly schedule is not set
State : Existing PolicyState : Valid
```

You can view the details of the existing backup policy using the [Get-OBPolicy](https://technet.microsoft.com/library/hh770406) cmdlet. You can drill-down further using the [Get-OBSchedule](https://technet.microsoft.com/library/hh770423) cmdlet for the backup schedule and the [Get-OBRetentionPolicy](https://technet.microsoft.com/library/hh770427) cmdlet for the retention policies

```
PS C:> Get-OBPolicy | Get-OBSchedule
SchedulePolicyName : 71944081-9950-4f7e-841d-32f0a0a1359a
ScheduleRunDays : {Saturday, Sunday}
ScheduleRunTimes : {16:00:00}
State : Existing

PS C:> Get-OBPolicy | Get-OBRetentionPolicy
RetentionDays : 7
RetentionPolicyName : ca3574ec-8331-46fd-a605-c01743a5265e
State : Existing

PS C:> Get-OBPolicy | Get-OBFileSpec
FileName : *
FilePath : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\
FileSpec : D:\
IsExclude : False
IsRecursive : True

FileName : *
FilePath : \?\Volume{cdd41007-a22f-11e2-be6c-806e6f6e6963}\
FileSpec : C:\
IsExclude : False
IsRecursive : True

FileName : *
FilePath : \?\Volume{cdd41007-a22f-11e2-be6c-806e6f6e6963}\windows
FileSpec : C:\windows
IsExclude : True
IsRecursive : True

FileName : *
FilePath : \?\Volume{cdd41007-a22f-11e2-be6c-806e6f6e6963}\temp
FileSpec : C:\temp
IsExclude : True
IsRecursive : True
```

### Performing an ad-hoc backup
Once a backup policy has been set the backups will occur per the schedule. Triggering an ad-hoc backup is also possible using the [Start-OBBackup](https://technet.microsoft.com/library/hh770426) cmdlet:

```
PS C:> Get-OBPolicy | Start-OBBackup
Taking snapshot of volumes...
Preparing storage...
Estimating size of backup items...
Estimating size of backup items...
Transferring data...
Verifying backup...
Job completed.
The backup operation completed successfully.
```

## Restore data from Azure Backup
This section will guide you through the steps for automating recovery of data from Azure Backup. Doing so involves the following steps:

1. Pick the source volume
2. Choose a backup point to restore
3. Choose an item to restore
4. Trigger the restore process

### Picking the source volume
In order to restore an item from Azure Backup, you first need to identify the source of the item. Since we're executing the commands in the context of a Windows Server or a Windows client, the machine is already identified. The next step in identifying the source is to identify the volume containing it. A list of volumes or sources being backed up from this machine can be retrieved by executing the [Get-OBRecoverableSource](https://technet.microsoft.com/library/hh770410) cmdlet. This command returns an array of all the sources backed up from this server/client.

```
PS C:> $source = Get-OBRecoverableSource
PS C:> $source
FriendlyName : C:\
RecoverySourceName : C:\
ServerName : myserver.microsoft.com

FriendlyName : D:\
RecoverySourceName : D:\
ServerName : myserver.microsoft.com
```

### Choosing a backup point to restore
The list of backup points can be retrieved by executing the [Get-OBRecoverableItem](https://technet.microsoft.com/library/hh770399.aspx) cmdlet with appropriate parameters. In our example, we’ll choose the latest backup point for the source volume *D:* and use it to recover a specific file.

```
PS C:> $rps = Get-OBRecoverableItem -Source $source[1]
IsDir : False
ItemNameFriendly : D:\
ItemNameGuid : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\
LocalMountPoint : D:\
MountPointName : D:\
Name : D:\
PointInTime : 18-Jun-15 6:41:52 AM
ServerName : myserver.microsoft.com
ItemSize :
ItemLastModifiedTime :

IsDir : False
ItemNameFriendly : D:\
ItemNameGuid : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\
LocalMountPoint : D:\
MountPointName : D:\
Name : D:\
PointInTime : 17-Jun-15 6:31:31 AM
ServerName : myserver.microsoft.com
ItemSize :
ItemLastModifiedTime :
```
The object ```$rps``` is an array of backup points. The first element is the latest point and the Nth element is the oldest point. To choose the latest point, we will use ```$rps[0]```.

### Choosing an item to restore
To identify the exact file or folder to restore, recursively use the [Get-OBRecoverableItem](https://technet.microsoft.com/library/hh770399.aspx) cmdlet. That way the folder hierarchy can be browsed solely using the ```Get-OBRecoverableItem```.

In this example, if we want to restore the file *finances.xls* we can reference that using the object ```$filesFolders[1]```.

```
PS C:> $filesFolders = Get-OBRecoverableItem $rps[0]
PS C:> $filesFolders
IsDir : True
ItemNameFriendly : D:\MyData\
ItemNameGuid : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\MyData\
LocalMountPoint : D:\
MountPointName : D:\
Name : MyData
PointInTime : 18-Jun-15 6:41:52 AM
ServerName : myserver.microsoft.com
ItemSize :
ItemLastModifiedTime : 15-Jun-15 8:49:29 AM

PS C:> $filesFolders = Get-OBRecoverableItem $filesFolders[0]
PS C:> $filesFolders
IsDir : False
ItemNameFriendly : D:\MyData\screenshot.oxps
ItemNameGuid : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\MyData\screenshot.oxps
LocalMountPoint : D:\
MountPointName : D:\
Name : screenshot.oxps
PointInTime : 18-Jun-15 6:41:52 AM
ServerName : myserver.microsoft.com
ItemSize : 228313
ItemLastModifiedTime : 21-Jun-14 6:45:09 AM

IsDir : False
ItemNameFriendly : D:\MyData\finances.xls
ItemNameGuid : \?\Volume{b835d359-a1dd-11e2-be72-2016d8d89f0f}\MyData\finances.xls
LocalMountPoint : D:\
MountPointName : D:\
Name : finances.xls
PointInTime : 18-Jun-15 6:41:52 AM
ServerName : myserver.microsoft.com
ItemSize : 96256
ItemLastModifiedTime : 21-Jun-14 6:43:02 AM
```

You can also search for items to restore using the ```Get-OBRecoverableItem``` cmdlet. In our example, to search for *finances.xls* we could get a handle on the file by running this command:

```
PS C:\> $item = Get-OBRecoverableItem -RecoveryPoint $rps[0] -Location "D:\MyData" -SearchString "finance*"
```

### Triggering the restore process
To trigger the restore process, we first need to specify the recovery options. This can be done by using the [New-OBRecoveryOption](https://technet.microsoft.com/library/hh770417.aspx) cmdlet. For this example, let's assume that we want to restore the files to *C:\temp*. Let's also assume that we want to skip files that already exist on the destination folder *C:\temp*. To create such a recovery option, use the following command:

```
PS C:\> $recovery_option = New-OBRecoveryOption -DestinationPath "C:\temp" -OverwriteType Skip
```

Now trigger restore by using the [Start-OBRecovery](https://technet.microsoft.com/library/hh770402.aspx) command on the selected ```$item``` from the output of the ```Get-OBRecoverableItem``` cmdlet:

```
PS C:\> Start-OBRecovery -RecoverableItem $item -RecoveryOption $recover_option
Estimating size of backup items...
Estimating size of backup items...
Estimating size of backup items...
Estimating size of backup items...
Job completed.
The recovery operation completed successfully.
```


## Uninstalling the Azure Backup agent
Uninstalling the Azure Backup agent can be done by using the following command:

```
PS C:\> .\MARSAgentInstaller.exe /d /q
```

Uninstalling the agent binaries from the machine has some consequences to consider:

- It removes the file-filter from the machine, and tracking of changes is stopped.
- All policy information is removed from the machine, but the policy information continues to be stored in the service.
- All backup schedules are removed, and no further backups are taken.

However, the data stored in Azure remains and is retained as per the retention policy setup by you. Older points are automatically aged out.

## Remote management
All the management around the Azure Backup agent, policies, and data sources can be done remotely through PowerShell. The machine that will be managed remotely needs to be prepared correctly.

By default, the WinRM service is configured for manual startup. The startup type must be set to *Automatic* and the service should be started. To verify that the WinRM service is running, the value of the Status property should be *Running*.

```
PS C:\> Get-Service WinRM

Status   Name               DisplayName
------   ----               -----------
Running  winrm              Windows Remote Management (WS-Manag...
```

PowerShell should be configured for remoting.

```
PS C:\> Enable-PSRemoting -force
WinRM is already set up to receive requests on this computer.
WinRM has been updated for remote management.
WinRM firewall exception enabled.

PS C:\> Set-ExecutionPolicy unrestricted -force
```

The machine can now be managed remotely - starting from the installation of the agent. For example, the following script copies the agent to the remote machine and installs it.

```
PS C:\> $dloc = "\\REMOTESERVER01\c$\Windows\Temp"
PS C:\> $agent = "\\REMOTESERVER01\c$\Windows\Temp\MARSAgentInstaller.exe"
PS C:\> $args = "/q"
PS C:\> Copy-Item "C:\Downloads\MARSAgentInstaller.exe" -Destination $dloc - force

PS C:\> $s = New-PSSession -ComputerName REMOTESERVER01
PS C:\> Invoke-Command -Session $s -Script { param($d, $a) Start-Process -FilePath $d $a -Wait } -ArgumentList $agent $args
```

## Next steps
For more information about Azure Backup for Windows Server/Client see

- [Introduction to Azure Backup](backup-introduction-to-azure-backup.md)
- [Back up Windows Servers](backup-configure-vault.md)
