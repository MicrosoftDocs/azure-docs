---
title: ' Manage a Scale-out Process server | Microsoft Docs'
description: This article describes how to setup and manage a Scale-out process server.
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

Scale-out Process server acts as a coordinator for data transfer between the Site Recovery services and your on-premises infrastructure. This article describes how you can set up, configure, and manage a Scale-out Process server.

## Prerequisites
The minimum hardware, software and network configuration required to setup a Scale-out process server is as listed below.

> [!NOTE]
> [Capacity planning](site-recovery-plan-capacity-vmare.md) is an important step to ensure that you deploy the Scale-out Process server with a configuration that suites your load requirements. Read more about [Scaling characteristics for a Scale-out Process server](#sizing-requirements-for-a-configuration-server).

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-server-requirements.md)]

## Downloading the Scale-out Process server software
1. Log on to the Azure Portal and browse to your Recovery Services Vault.
2. Browse to **Site Recovery Infrastructure** > **Configuration Servers** (under For VMware & Physical Machines).
3. Select your configuration server to drill down into the configuration server's details page.
4. Click on the **+ Process Server** button.
5. In the add Process server page select **Deploy a scale out Process server on-premises** option from the **Choose where you want to deploy your process server** drop down.

  ![Add Servers Page](./media/site-recovery-vmware-to-azure-manage-scaleout-process-server/add-process-server.png)
6. Click the **Download the Microsoft Azure Site Recovery Unified Setup** link to download the latest version of the Scale-out process server nstallation.

  > [!WARNING]
  The version of your Scale-out process server should be the same as that of the Configuration Server running in your environment. A simple way to ensure version compatibility is to use the same installer bits that you recently used to install/update your Configuration Server.

## Installing and Registering a Scale-out Process Server from GUI
[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

## Installing and Registering a Configuration Server using Command-line

```
UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]
```

### Sample Usage
```
UnifiedSetup.exe /ServerMode PS /InstallDrive D:\  /VaultCredsFilePath C:\Temp\MyVault.vaultcredentials /EnvType VMWare /PSIP 10.101.23.145  /CSIP 10.101.24.126 /PassphraseFilePath C:\Temp\connection.passphrase
```

### Scale-out Process server installer command-line arguments.
[!INCLUDE [site-recovery-unified-setup-parameters](../../includes/site-recovery-unified-installer-command-parameters.md)]


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
2. Open a Admin PowerShell command window.
3. Run the following command
  ```
  $pwd = ConvertTo-SecureString -String MyProxyUserPassword
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
## Re-registering a Scale-out Process Server
[!INCLUDE [site-recovery-vmware-register-process-server](../../includes/site-recovery-vmware-register-process-server.md)]


## Decommissioning a Scale-out Process server
1. Ensure that the
  - Configuration Server's connection state shows as **Connected** in the Azure Portal
  - Process Server's is still able to communicate with the Configuration server.
2. Log-in to the process server as an administrator
3. Open up Control Panel > Program > Uninstall Programs
4. Uninstall the programs in the sequence given below.
  * Microsoft Azure Site Recovery Configuration Server/Process Server
  * Microsoft Azure Site Recovery Configuration Server Dependencies
  * Microsoft Azure Recovery Services Agent

The service follows a lazy clean up and can takes up-to 15 minutes for the Process Server entry to be deleted from the Service.

  > [!NOTE]
  If the Process server is unable to communicate with the Configuration Server (Connection State in portal is Disconnected) then you need to follow the below steps to purge it from the Configuration Server.

## Unregistering a disconnected process server from a Configuration Server

  [!INCLUDE [site-recovery-vmware-upgrade-process-server](../../includes/site-recovery-vmware-unregister-process-server.md)]



## Sizing requirements for a Scale-out Process server



## Common issues
