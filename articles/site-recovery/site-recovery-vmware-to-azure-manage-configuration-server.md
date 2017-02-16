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

# Manage a configuration server

Configuration server acts as a coordinator between the Site Recovery services and your on-premises infrastructure. This article describes how you can set up, configure, and manage the Configuration server.

## Prerequisites
The minimum hardware, software and network configuration required to setup a configuration is as listed below.

> [!NOTE]
> [Capacity planning](site-recovery-plan-capacity-vmare.md) is an important step to ensure that you deploy the Configuration server with a configuration that suites your load requirements. Read more about [Sizing requirements for a Configuration server](#sizing-requirements-for-a-configuration-server).

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-server-requirements.md)]

## Downloading the Configuration server software
1. Log on to the Azure Portal and browse to your Recovery Services Vault.
2. Browse to **Site Recovery Infrastructure** > **Configuration Servers** (under For VMware & Physical Machines).

  ![Add Servers Page](./media/site-recovery-vmware-to-azure-manage-configuration-server/AddServers.png)
3. Click on the **+Servers** button.
4. On the **Add Server** page click on the Download button to download the Registration key. You will need this key during the Configuration server installation to register it with Azure Site Recovery service.
5. Click the **Download the Microsoft Azure Site Recovery Unified Setup** link to download the latest version of the Configuration server.

  ![Download Page](./media/site-recovery-vmware-to-azure-manage-configuration-server/downloadcs.png)

  > [!TIP]
  Latest version of the Configuration server can be downloaded directly from [Microsoft Download Center download page](http://aka.ms/unifiedsetup)

## Installing and Registering a Configuration Server from GUI
[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

## Installing and Registering a Configuration Server using Command-line

  ```
    UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]
    ```
### Configuration server installer command-line arguments.

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

### Create a MySql credentials file
You need to pass a MySQLCredsFilePath  file to the installer when you are executing it in command line mode. The file should have the following format
```
[MySQLCredentials]
MySQLRootPassword = "Password>"
MySQLUserPassword = "Password"
```
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
## Modifying Proxy Settings for Configuration server
1. Log-in into your Configuration Server.
2. Launch the cspsconfigtool.exe using the shortcut on your.
3. Click on the **Vault Registration** tab.
4. Download a new Vault Registration file from the portal and provide it as input to the tool.

  ![register-cs](./media/site-recovery-vmware-to-azure-manage-configuration-server/delete-configuration-server.PNG)
5. Provide the new Proxy Server details and click on the **Register** button.

  >[!WARNING]
  If you have Scale-out Process servers attached to this configuration server you need to [fix the proxy settings on all the scale-out process servers](site-recovery-vmware-to-azure-manage-scaleout-process-server.md) in your deployment.


## Decommissioning a  Configuration server
Ensure the following before you start decommissioning your configuration server.
1. Disable protection for all virtual machines under this Configuration server.
2. Disassociate all Replication policies from the Configuration server.
3. Delete all vCenters servers/vSphere hosts that are associated to the configruation server.
### Delete a Configuration Server
1. In Azure browse to **Site Recovery Infrastructure** > **Configuration Servers**  from the Vault menu.
2. Click on the Configuration server that you want to decommission.
3. On the Configuration server's details page click on the Delete button.

  ![delete-cs](./media/site-recovery-vmware-to-azure-manage-configuration-server/register-cs.png)
4. Click **Yes** to confirm the deletion of the server.
  >[!WARNING]
  If you still have any virtual machines, Replication policies or vCenter servers/vSphere hosts associated with this Configuration serer, you will not be allowed to delete the server. You need to delete these entities before you try to delete the vault.

### On-premises clean up
  > [!TIP]
  If you plan to re-use the Configuration Server with Azure Site Recovery again, then you can skip to step 4 directly

1. Log on to the Configuration server as an Administrator.
2. Open up Control Panel > Program > Uninstall Programs
3. Uninstall the programs in the sequence given below.
  * Microsoft Azure Site Recovery Mobility Service/Master Target server
  * Microsoft Azure Site Recovery Configuration Server/Process Server
  * Microsoft Azure Site Recovery Configuration Server Dependencies
  * Microsoft Azure Recovery Services Agent
  * Microsoft Azure Site Recovery Provider
  * MySQL Server 5.5
4. Run the below command from an Admin command prompt.
  ```
  reg delete HKLM\Software\Microsoft\Azure Site Recovery\Registration
  ```


## Sizing requirements for a Configuration server

| **CPU** | **Memory** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- | --- |
| 8 vCPUs (2 sockets * 4 cores @ 2.5GHz) |16 GB |300 GB |500 GB or less |Replicate less than 100 machines. |
| 12 vCPUs (2 sockets * 6 cores @ 2.5GHz) |18 GB |600 GB |500 GB to 1 TB |Replicate between 100-150 machines. |
| 16 vCPUs (2 sockets * 8 cores @ 2.5GHz) |32 GB |1 TB |1 TB to 2 TB |Replicate between 150-200 machines. |

  >[!TIP]
  If your daily data churn exceeds 2 TB or you plan to replicate more than 200 virtual machines, it is recommended to deploy additional process servers to load balance the replication traffic. Learn more about How to deploy Scale-out Process severs.


## Common issues
[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]
