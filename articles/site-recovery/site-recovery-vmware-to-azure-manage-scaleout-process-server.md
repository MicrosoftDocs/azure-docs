---
title: ' Manage a Configuration server | Microsoft Docs'
description: This article describes how to set and manage a Configuration Server.
services: site-recovery
documentationcenter: ''
author: AnoopVasudavan
manager: gauravd
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 2/14/2017
ms.author: anoopkv
---

# Manage a Scale-out Process server

Configuration server acts as a coordinator between the Site Recovery services and your on-premises infrastructure. This article describes how you can set up, configure, and manage the Configuration server.

## Prerequisites
The minimum hardware, software and network configuration required to setup a configuration is as listed below.

> [!NOTE]
> [Capacity planning](site-recovery-plan-capacity-vmare.md) is an important step to ensure that you deploy the Configuration server with a configuration that suites your load requirements. Read more about [Sizing requirements for a Configuration server](#sizing-requirements-for-a-configuration-server).

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-server-requirements.md)]

## Downloading the Scale-out Process server software
1. Log on to the Azure Portal and browse to your Recovery Services Vault.
2. Browse to **Site Recovery Infrastructure** > **Configuration Servers** (under For VMware & Physical Machines).

  ![Add Servers Page](./media/site-recovery-vmware-to-azure-manage-configuration-server/AddServers.png)
3. Click on the **+Servers** button.
4. On the **Add Server** page click on the Download button to download the Registration key. You will need this key during the Configuration server installation to register it with Azure Site Recovery service.
5. Click the **Download the Microsoft Azure Site Recovery Unified Setup** link to download the latest version of the Configuration server.

  ![Download Page](./media/site-recovery-vmware-to-azure-manage-configuration-server/downloadcs.png)

  > [!TIP]
  Latest version of the Configuration server can be downloaded directly from [Microsoft Download Center download page](http://aka.ms/unifiedsetup)

## Installing and Registering a Scale-out Process Server from GUI
[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

## Installing and Registering a Configuration Server using Command-line

    UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]

### Scale-out Process server installer command-line arguments.

|Parameter Name| Type | Description| Possible Values|
|-|-|-|-|
| /ServerMode|Mandatory|Specifies whether both the configuration and process servers should be installed, or the process server only|CS<br>PS|
|/InstallLocation|Mandatory|The folder in which the components are installed| Any folder on the computer|
|/MySQLCredsFilePath|Mandatory|The file path in which the MySQL server credentials are stored|The file should be the format specified below|
|/VaultCredsFilePath|Mandatory|The path of the vault credentials file|Valid file path|
|/EnvType|Mandatory|Type of envrionment that you want to protect |VMware<br>NonVMware|
|/PSIP|Mandatory|IP address of the NIC to be used for replication data transfer| Any valid IP Address|
|/CSIP|Mandatory|The IP address of the NIC on which the configuration server is listening on| Any valid IP Address|
|/PassphraseFilePath|Mandatory|The full path to location of the passphrase file|Valid file path|
|/BypassProxy|Optional|Specifies that the configuration server connects to Azure without a proxy|To do get this value from Venu|
|/ProxySettingsFilePath|Optional|Proxy settings (The default proxy requires authentication, or a custom proxy)|The file should be in the format specified below|
|DataTransferSecurePort|Optional|Port number on the PSIP to be used for replication data| Valid Port Number (default value is 9433)|
|/SkipSpaceCheck|Optional|Skip space check for cache disk| |
|/AcceptThirdpartyEULA|Mandatory|Flag implies acceptance of third-party EULA| |
|/ShowThirdpartyEULA|Optional|Displays third-party EULA. If provided as input all other parameters are ignored| |

### Create a Proxy settings configuration file
You need to pass a proxy settings configuration file to the installer when you are executing it in command line mode. The file should have the following format
```
* [ProxySettings]
* ProxyAuthentication = "Yes/No"
* Proxy IP = "IP Address"
* ProxyPort = "Port"
* ProxyUserName="UserName"
* ProxyPassword="Password"
```
## Modifying Proxy Settings for Scale-out Process server
1. Log-in into your Scale-out Process Server.
2. Open a Admin Powershell command window.
3. Run the following command
  ```
  $pwd = ConvertTo-SecureString -String ProxyUserPassword
  Set-OBMachineSetting -ProxyServer http://myproxyserver.domain.com -ProxyPort PortNumber – ProxyUserName domain\username -ProxyPassword $pwd
  net stop obengine
  net start obengine
  ```
4. Next browse to the directory **%PROGRAMDATA%\ASR\Agent** and run the following command
  ```
  cmd
  cdpcli.exe --registermt
  exit
  ```

## Decommissioning a  Scale-out Process  server

### Delete a Scale-out Process  Server


### On-premises clean up
1. Log on to the Scale-out Process server as an Administrator.
2. Open up Control Panel > Program > Uninstall Programs
3. Uninstall the programs in the sequence given below.
  * Microsoft Azure Site Recovery Mobility Service/Master Target server
  * Microsoft Azure Site Recovery Configuration Server/Process Server
  * Microsoft Azure Site Recovery Configuration Server Dependencies
  * Microsoft Azure Recovery Services Agent

## Sizing requirements for a Scale-out Process server



## Common issues
