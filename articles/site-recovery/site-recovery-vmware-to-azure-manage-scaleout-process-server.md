---
title: ' Manage a Scale-out Process Server in Azure Site Recovery | Microsoft Docs'
description: This article describes how to set up and manage a Scale-out Process Server in Azure Site Recovery.
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
ms.date: 06/05/2017
ms.author: anoopkv
---

# Manage a Scale-out Process Server

Scale-out Process Server acts as a coordinator for data transfer between the Site Recovery services and your on-premises infrastructure. This article describes how you can set up, configure, and manage a Scale-out Process Server.

## Prerequisites
The following are the recommended hardware, software, and network configuration required to set up a Scale-out Process Server.

> [!NOTE]
> [Capacity planning](site-recovery-capacity-planner.md) is an important step to ensure that you deploy the Scale-out Process Server with a configuration that suites your load requirements. Read more about [Scaling characteristics for a Scale-out Process Server](#sizing-requirements-for-a-configuration-server).

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Downloading the Scale-out Process Server software
1. Log on to the Azure portal and browse to your Recovery Services Vault.
2. Browse to **Site Recovery Infrastructure** > **Configuration Servers** (under For VMware & Physical Machines).
3. Select your configuration server to drill down into the configuration server's details page.
4. Click the **+ Process Server** button.
5. In the **Add Process server** page, select **Deploy a Scale-out Process Server on-premises** option from the **Choose where you want to deploy your process server** drop-down.

  ![Add Servers Page](./media/site-recovery-vmware-to-azure-manage-scaleout-process-server/add-process-server.png)
6. Click the **Download the Microsoft Azure Site Recovery Unified Setup** link to download the latest version of the Scale-out Process Server installation.

  > [!WARNING]
  The version of your Scale-out Process Server should be equal to or lesser than the Configuration Server version running in your environment. A simple way to ensure version compatibility is to use the same installer bits that you recently used to install/update your Configuration Server.

## Installing and registering a Scale-out Process Server from GUI
If you have to scale out your deployment beyond 200 source machines, or a total daily churn rate of more than 2 TB, you need additional process servers to handle the traffic volume.

Check the [size recommendations for process servers](#size-recommendations-for-the-process-server), and then follow these instructions to set up the process server. After setting up the server, you migrate source machines to use it.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-add-process-server.md)]


## Installing and registering a Scale-out Process Server using command-line

```
UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]
```

### Sample usage
```
MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /xC:\Temp\Extracted
cd C:\Temp\Extracted
UNIFIEDSETUP.EXE /AcceptThirdpartyEULA /servermode "PS" /InstallLocation "D:\" /EnvType "VMWare" /CSIP "10.150.24.119" /PassphraseFilePath "C:\Users\Administrator\Desktop\Passphrase.txt" /DataTransferSecurePort 443
```

### Scale-out Process Server installer command-line arguments.
[!INCLUDE [site-recovery-unified-setup-parameters](../../includes/site-recovery-unified-installer-command-parameters.md)]


### Create a proxy settings configuration file
ProxySettingsFilePath parameter takes a file as input. Create file using the following format and pass it as input ProxySettingsFilePath parameter.
```
* [ProxySettings]
* ProxyAuthentication = "Yes/No"
* Proxy IP = "IP Address"
* ProxyPort = "Port"
* ProxyUserName="UserName"
* ProxyPassword="Password"
```
## Modifying proxy settings for Scale-out Process Server
1. Login  into your Scale-out Process Server.
2. Open an Admin PowerShell command window.
3. Run the following command
  ```
  $pwd = ConvertTo-SecureString -String MyProxyUserPassword
  Set-OBMachineSetting -ProxyServer http://myproxyserver.domain.com -ProxyPort PortNumber –ProxyUserName domain\username -ProxyPassword $pwd
  net stop obengine
  net start obengine
  ```
4. Next browse to the directory **%PROGRAMDATA%\ASR\Agent** and run the following command
  ```
  cmd
  cdpcli.exe --registermt

  net stop obengine

  net start obengine

  exit
  ```

## Re-registering a Scale-out Process Server
[!INCLUDE [site-recovery-vmware-register-process-server](../../includes/site-recovery-vmware-register-process-server.md)]

* Next open an Admin command prompt.
* Browse to the directory **%PROGRAMDATA%\ASR\Agent** and run the command

```
cdpcli.exe --registermt

net stop obengine

net start obengine
```

## Upgrading a Scale-out Process Server
[!INCLUDE [site-recovery-vmware-upgrade -process-server](../../includes/site-recovery-vmware-upgrade-process-server-internal.md)]

## Decommissioning a Scale-out Process Server
1. Ensure that:
  - Configuration Server's connection state shows as **Connected** in the Azure portal
  - Process Server's is still able to communicate with the Configuration server.
2. Log in to the process server as an administrator
3. Open up Control Panel > Program > Uninstall Programs
4. Uninstall the programs in the sequence given following:
  * Microsoft Azure Site Recovery Configuration Server/Process Server
  * Microsoft Azure Site Recovery Configuration Server Dependencies
  * Microsoft Azure Recovery Services Agent

It can take up-to 15 minutes for the Process Server deletion to reflect in the Azure portal.

  > [!NOTE]
  If the Process server is unable to communicate with the Configuration Server (Connection State in portal is Disconnected), then you need to follow the following steps to purge it from the Configuration Server.

## Unregistering a disconnected Scale-out Process server from a Configuration Server

[!INCLUDE [site-recovery-vmware-upgrade-process-server](../../includes/site-recovery-vmware-unregister-process-server.md)]

## Sizing requirements for a Scale-out Process Server

| **Additional process server** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- |
|4 vCPUs (2 sockets * 2 cores @ 2.5 GHz), 8-GB memory |300 GB |250 GB or less |Replicate 85 or less machines. |
|8 vCPUs (2 sockets * 4 cores @ 2.5 GHz), 12-GB memory |600 GB |250 GB to 1 TB |Replicate between 85-150 machines. |
|12 vCPUs (2 sockets * 6 cores @ 2.5 GHz) 24-GB memory |1 TB |1 TB to 2 TB |Replicate between 150-225 machines. |
