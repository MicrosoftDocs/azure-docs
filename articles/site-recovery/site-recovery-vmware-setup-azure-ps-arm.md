---
title: ' Manage a Process Server running in Azure (Resource Manager) | Microsoft Docs'
description: This article describes how to set up a failback Process Server (Resource Manager) In Azure.
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
ms.date: 2/2/2017
ms.author: anoopkv
---

# Manage a Process Server running in Azure (Resource Manager)
> [!div class="op_single_selector"]
> * [Resource Manager](./site-recovery-vmware-setup-azure-ps-arm.md)
> * [Classic ](./site-recovery-vmware-setup-azure-ps-classic.md)

During failback it is recommended to deploy Process Server in the Azure if there is high latency between the Azure Virtual Network and your on-premises network. This article describes how you can set up, configure and manage the process servers runnning in Azure.

> [!NOTE]
> This article is to be used if you used **Resource Manager** as the deployment model for the virtual machines during failover. If you used **Classic** as the deployment model follow the steps in [How to set up & configure a Failback Process Server (Classic)](./site-recovery-vmware-setup-azure-ps-classic.md)

## Prerequisites

[!INCLUDE [site-recovery-vmware-process-server-prerequ](../../includes/site-recovery-vmware-azure-process-server-prereq.md)]

## Deploy a Process Server on Azure
1. In the Vault > **Site Recovery Infrastructure** (under the "Manage" heading) > **Configuration Servers** (under "For VMware and Physical Machines" heading), select the configuration server.
2. In the Configuration Server details page that opens click "+ Process server"

  ![Add Process Server](./media/site-recovery-vmware-setup-azure-ps-arm/add-ps.png)

3.  On the **Add process server** page, select the following values

  ![Add Process Server](./media/site-recovery-vmware-setup-azure-ps-arm/add-ps-page-1.png)
|**Field Name**|**Value**|
|-|-|
|Choose where you want to deploy your process server|Select the value **Deploy a failback process server in Azure** |
|Subscription|Select the Azure Subscription where you failed over the virtual machines|
|Resource Group|You can create a Resource Group to deploy this Process Server or choose to deploy the Process Server in an existing Resource Group|
|Location|Select the Azure Data Center into which the virtual machines where failed over into|
|Azure Network|Select the Azure Virtual Network(VNet) that the virtual machines where failed over into. If you failed over virtual machines into multiple Azure VNets, then you need a Process server deployed per VNet|

4. Fill in the rest of the properties for the process server

  ![Add Process Server](./media/site-recovery-vmware-setup-azure-ps-arm/add-ps-page-2.png)
|**Field Name**|**Value**|
|-|-|
|Server Name|Display name & Host name for your Process Server virtual machine|
| User Name|A user name that becomes an Administrator on that virtual machine|
|Storage Account|Name of the Storage Account where the virtual machine's virtual disk's are placed|
|Subnet|The subnet of the Azure VNet to which the virtual machine is connected|
| IP Address|IP Address that you would like the Process Server to assume once it boots up|
5. Click the OK button to start deploying the process server virtual machine.

> [!NOTE]
> In order to be able to use this Process Server for failback, you need to register it with the on-premises configuration server.

## Registering the Process Server (running in Azure) to a Configuration Server (running on-premises)

[!INCLUDE [site-recovery-vmware-register-process-server](../../includes/site-recovery-vmware-register-process-server.md)]

## Upgrading the Process Server to latest version.

[!INCLUDE [site-recovery-vmware-upgrade-process-server](../../includes/site-recovery-vmware-upgrade-process-server.md)]

## Unregistering the Process Server (running in Azure) from a Configuration Server (running on-premises)

The steps to unregister a process server differs depending on its connection status with the Configuration Server.

### Unregister a Process Server that is in a connected state

1. Remote into the Process Server as a Administrator.
2. Launch the **Control Panel** and open **Programs > Uninstall a program**
3. Uninstall a program by the name **Microsoft Azure Site Recovery Configuration/Process Server**
4. Once step 3 is completed, you can uninstall **Microsoft Azure Site Recovery Configuration/Process Server Dependencies**

Once the uninstallation is complete the Process Server should be unregistered from your configuration server.

### Unregister a Process Server that is in a disconnected state

> [!WARNING]
> Use the below steps as the last resort and you have no way to revive the virtual machine on which the Process Server was installed.

1. Logon to your Configuration Server as an Administrator.
2. Open a Administrative Command prompt and browse to the directory `%ProgramData%\ASR\home\svsystems\bin`
3. Now run the Command
```
perl Unregister-ASRComponent.pl -IPAddress <IP_of_Process_Server> -Component PS
```
4. This will purge the details of the Process Server from the system.



## Common Issues
