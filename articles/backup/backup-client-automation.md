<properties
	pageTitle="Deploy and manage backup for Windows Server/Client using Windows PowerShell | Microsoft Azure"
	description="Learn how to deploy and manage Azure Backup using Windows PowerShell"
	services="backup"
	documentationCenter=""
	authors="aashishr"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/17/2015"
	ms.author="aashishr"/>


# Deploy and manage back up to Azure for Windows Server/Windows Client using Windows PowerShell
This article shows you how to use Windows PowerShell® command-line interface to set up Azure Backup on Windows Server or Windows Client and to manage backups and restores.

## Setting up the Windows PowerShell environment
Before you can use Windows PowerShell to manage Azure Backup, you will need to have the right Windows PowerShell version and environment variables setup.

## Setup and Registration
The following setup and registration tasks can be automated with Windows PowerShell
- Installing the Azure Backup agent
- Registering with the Azure Backup service
- Networking

### Installing the Azure Backup agent
In order to install the Azure Backup agent, you need to have the installer downloaded and present on the Windows Server. You can get the latest version of the installer from the [Microsoft Download Center](aka.ms/azurebackup_agent). Save the installer to an easily accessible location like *C:\Downloads\*. In order to install the agent, run the following command in an elevated Windows PowerShell console:

```
PS C:\> MARSAgentInstaller.exe /q
```

This will install the agent with all the default options. The installation takes a few minutes in the background. If you do not specify the **/nu** option then the **Windows Update** window will open at the end of the installation to check for any updates.

The agent will show in the list of installed programs. To see the list of installed programs, go to **Control Panel** > **Programs** > **Programs and Features**.

![Agent installed](./media/backup-client-automation/installed-agent-listing.png)

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
Before you can register with the Azure Backup service, ensure that the [prerequistes](https://azure.microsoft.com/documentation/articles/backup-try-azure-backup-in-10-mins/) are met:
- Have a valid Azure subscription
- Create a backup vault
- Download the vault credentials and store it in a convenient location (like *C:\Downloads\*). The vault credentials can also be renamed for your convenience.

Registering the machine with the vault is done using the [Start-OBRegistration](https://technet.microsoft.com/library/hh770398%28v=wps.630%29.aspx) cmdlet:

```
PS C:\> Start-OBRegistration -VaultCredentials "C:\Downloads\register.vaultcredentials" -Confirm:$false

CertThumbprint      : 7a2ef2caa2e74b6ed1222a5e89288ddad438df2
SubscriptionID      : ef4ab577-c2c0-43e4-af80-af49f485f3d1
ServiceResourceName : test-vault
Region              : Australia East

Machine registration succeeded.
```

> [AZURE.IMPORTANT] Do not use relative paths to specify the vault credentials file. You must provide an absolute path as an input to the cmdlet.


### Networking
When the connectivity of the Windows machine to the internet is through a proxy server, the proxy settings can also be provided to the agent. In this example, there is no proxy server so we are explicitly clearing any proxy-related information.

Bandwidth usage can also be controlled with options of *work hour bandwidth* and *non-work hour bandwidth* for a given set of days of the week.

Setting the proxy and bandwidth details is done using the [Set-OBMachineSetting](https://technet.microsoft.com/library/hh770409%28v=wps.630%29.aspx) cmdlet:

```
PS C:\> Set-OBMachineSetting -NoProxy
Server properties updated successfully.
```

```
PS C:\> Set-OBMachineSetting -NoThrottle
Server properties updated successfully.
```

### Encryption settings
The backup data sent to Azure Backup is encrypted to protect the confidentiality of the data. The encryption passphrase is the "password" to decrypt the data at the time of restore. It is important to keep this information safe and secure once it is set.

```
PS C:\> ConvertTo-SecureString -String "Complex!123_STRING" -AsPlainText -Force | Set-OBMachineSetting
Server properties updated successfully
```

## Uninstalling the Azure Backup agent
Uninstalling the Azure Backup agent can be done by using the following command:

```
PS C:\> .\MARSAgentInstaller.exe /d /q
```

Uninstalling the agent binaries from the machine has other consequences:
- It removes the file-filter from the machine, and tracking of changes is stopped.
- All policy information is removed from the machine, but the policy information continues to be stored in the service.
- All backup schedules are removed, and no further backups are taken.

However, the data stored in Azure continues to stay and is retained as per the retention policy setup by you. Older points are automatically aged out.

## Remote management
All the management around the Azure Backup agent, policies, and data sources can be done remotely through Windows PowerShell. The machine that will be managed remotely needs to be prepared correctly.

By default, the WinRM service is configured for manual startup. The startup type must be set to *Automatic* and the service should be started. To verify that the WinRM service is running, the value of the Status property should be *Running*.

```
PS C:\> Get-Service WinRM

Status   Name               DisplayName
------   ----               -----------
Running  winrm              Windows Remote Management (WS-Manag...

- Windows PowerShell should be configured for remoting.
```

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
For more information about Azure Backup for Windows Server/Client see [Introduction to Azure Backup](https://azure.microsoft.com/documentation/articles/backup-introduction-to-azure-backup/)
