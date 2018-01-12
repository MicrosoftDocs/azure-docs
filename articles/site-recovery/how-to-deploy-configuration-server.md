---
title: ' Deploy the configuration server for VMware disaster recovery with Azure Site Recovery | Microsoft Docs'
description: This article describes how to deploy a configuration server for VMware disaster recovery with Azure Site Recovery
services: site-recovery
author: AnoopVasudavan
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.date: 01/10/2018
ms.author: anoopkv
---

# Deploy a configuration server

You deploy an on-premises configuration server when you use the [Azure Site Recovery](site-recovery-overview.md) service for disaster recovery of VMware VMs and physical servers to Azure. WThe configuration server coordinates communications between on-premises VMware and Azure, and manages data replication. This article walks you through the steps needed to deploy the configuration server.

## Prerequisites

We recommend that you deploy the configuration server as a highly available VMware VM. For physical server replication, the configuration server can be set up on a physical machine. Minimum hardware requirements are summarized in the following table.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]


## Capacity planning

The sizing requirements for the configuration server depend on the potential data change rate. Use this table as a guide.

| **CPU** | **Memory** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- | --- |
| 8 vCPUs (2 sockets * 4 cores @ 2.5 GHz) |16 GB |300 GB |500 GB or less |Replicate fewer than 100 machines. |
| 12 vCPUs (2 sockets * 6 cores @ 2.5 GHz) |18 GB |600 GB |500 GB to 1 TB |Replicate between 100-150 machines. |
| 16 vCPUs (2 sockets * 8 cores @ 2.5 GHz) |32 GB |1 TB |1 TB to 2 TB |Replicate between 150-200 machines. |


If you're replicating VMware VMs, read more about [capacity planning considerations](/site-recovery-plan-capacity-vmware.md), and run the [Deployment planner tool](site-recovery-deployment-planner.md) for VMWare replication.



## Download the template

Site Recovery provides a downloadable template to set up the configuration server as a highly available VMware VM. 

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, click **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the Open Virtualization Format (OVF) template for the configuration server.

  > [!TIP]
  The latest version of the configuration server template can be downloaded directly from [Microsoft Download Center](http://aka.ms/unifiedsetup)


## Import the template in VMware

1. Log onto the VMware vCenter server or vSphere ESXi host, using the VMWare vSphere Client.
2. On the File menu, select **Deploy OVF Template**, to launch the Deploy OVF Template wizard.  

     ![OVF template](./media/how-to-deploy-configuration-server/vcenter-wizard.png)
3. In the wizard > **Disk Format**, we recommend you choose the option **Thick Provision Eager Zeroed** for best performance.
4. In **Ready to Complete**, don't select **Power on after deployment** if you want to add an additional NIC to the VM. By default, the configuration server template is deployed with a single NIC, but you can add additional NICs after deployment.

> [!NOTE]
  You can't add an additional NIC after the configuration server is registered in the vault.
 

## Register the configuration server 

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots up into a Windows Server 2016 installation experience. Accept the license agreement, and specify an administrator password.
3. After the installation finishes, log on to the VM as the administrator.
4. The first time you log on, the Azure Site Recovery Configuration Tool launches.
5. Specify a name that's used to register the configuration server with Site Recovery. Then click **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, click **Sign in**, to log into your Azure subscription. The credentials must have access to the vault in which you want to register the configuration server.
7. The tool performs some configuration tasks, and then reboots.
8. Log onto the machine again. The configuration server management wizard will launch automatically.

### Configure settings

1. In the configuration server management wizard > **Setup connectivity**, select the NIC that will receive replication traffic. Then click **Save**. You can't change this setting after it's been configured.
2. In **Select Recovery Services vault**, select your Azure subscription, and the relevant resource group and vault.
3. In **Install third-party software**, accept the license agreeemtn, and click **Download and Install**, to install MySQL Server.
4. Click **Install VMware PowerLCI**. Make sure all browser windows are closed before you do this. Then click **Continue**
5. In **Validate appliance configuration**, prerequisites will be verified before you continue.
6. In **Configure vCenter Server/vSphere ESXi server**, specify the FQDN or IP address of the vCenter server, or vSphere host, on which VMs you want to replicate are located. Specify the port on which the server is listening, and a friendly name to be used for the VMware server in the vault.
7. Specify credentials that will be used by the configuration server to connect to the VMware server. Site Recovery uses these credentials to automatically discover VMware VMs that are available for replication. Click **Add**, and then click **Continue**.
8. In **Configure virtual machine credentials**, specify the username and password that will be used to automatically install the Mobility service on machines, when replication is enabled. For Windows machines, the account needs local administrator privileges on the machines you want to replicate. For Linux, provide details for the root account.
9. Click **Finalize configuration** to complete registration. 
10. After registration finishes, in the Azure portal, verify that the configuration server and VMware server are listed on the **Source** page in the vault. Then click **OK** to configure target settings.


## Troubleshoot deployment issues

[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issue.md)]


## Next steps

Review the tutorials for setting up disaster recovery of [VMware VMs](tutorial-vmware-to-azure.md) and [physical servers](tutorial-physical-to-azure.md) to Azure.
