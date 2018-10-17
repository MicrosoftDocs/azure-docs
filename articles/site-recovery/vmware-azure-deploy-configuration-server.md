---
title: Deploy the configuration server for VMware disaster recovery with Azure Site Recovery | Microsoft Docs
description: This article describes how to deploy a configuration server for VMware disaster recovery with Azure Site Recovery
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: raynew
---

# Deploy a configuration server

You deploy an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication. This article walks you through the steps needed to deploy the configuration server when you're replicating VMware VMs to Azure. [Follow this article](physical-azure-set-up-source.md) if you need to set up a configuration server for physical server replication.

>[!TIP]
You can learn about the role of Configuration server as part of Azure Site Recovery architecture [here](vmware-azure-architecture.md).

## Deployment of configuration server through OVA template

Configuration server must be set up as a highly available VMware VM with certain minimum hardware and sizing requirements. For convenient and easy deployment, Site Recovery provides a downloadable OVA (Open Virtualization Application) template to set up the configuration server that complies with all the mandated requirements listed below.

## Prerequisites

Minimum hardware requirements for a configuration server are summarized in the following table.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Capacity planning

The sizing requirements for the configuration server depend on the potential data change rate. Use this table as a guide.

| **CPU** | **Memory** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- | --- |
| 8 vCPUs (2 sockets * 4 cores \@ 2.5 GHz) |16 GB |300 GB |500 GB or less |Replicate fewer than 100 machines. |
| 12 vCPUs (2 sockets * 6 cores \@ 2.5 GHz) |18 GB |600 GB |500 GB to 1 TB |Replicate 100-150 machines. |
| 16 vCPUs (2 sockets * 8 cores \@ 2.5 GHz) |32 GB |1 TB |1 TB to 2 TB |Replicate 150-200 machines. |

If you're replicating more than one VMware VM, read [capacity planning considerations](site-recovery-plan-capacity-vmware.md). Run the [Deployment planner tool](site-recovery-deployment-planner.md) for VMWare replication.

## Download the template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the Open Virtualization Application (OVA) template for the configuration server.

  > [!TIP]
>You can also download the latest version of the configuration server template directly from [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

>[!NOTE]
The licence provided with OVA template is an evaluation licence valid for 180 days. Post this period, customer needs to activate the windows with a procured licence.

## Import the template in VMware

1. Sign in to the VMware vCenter server or vSphere ESXi host by using the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the Deploy OVF Template wizard.

     ![OVF template](./media/vmware-azure-deploy-configuration-server/vcenter-wizard.png)

3. In **Select source**, enter the location of the downloaded OVF.
4. In **Review details**, select **Next**.
5. In **Select name and folder** and **Select configuration**, accept the default settings.
6. In **Select storage**, for best performance select **Thick Provision Eager Zeroed** in **Select virtual disk format**.
7. In the rest of the wizard pages, accept the default settings.
8. In **Ready to complete**:

    * To set up the VM with the default settings, select **Power on after deployment** > **Finish**.

    * To add an additional network interface, clear **Power on after deployment**, and then select **Finish**. By default, the configuration server template is deployed with a single NIC. You can add additional NICs after deployment.

## Add an additional adapter

If you want to add an additional NIC to the configuration server, add it before you register the server in the vault. Adding additional adapters isn't supported after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network.
4. To connect the virtual NIC when the VM is turned on, select **Connect at power-on**. Then select **Next** > **Finish** > **OK**.

## Register the configuration server with Azure Site Recovery services

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots up into a Windows Server 2016 installation experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.
4. The first time you sign in, within few seconds the Azure Site Recovery Configuration Tool starts.
5. Enter a name that's used to register the configuration server with Site Recovery. Then select **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription. The credentials must have access to the vault in which you want to register the configuration server.
7. The tool performs some configuration tasks, and then reboots.
8. Sign in to the machine again. The configuration server management wizard starts **automatically** in few seconds.

### Configure settings

1. In the configuration server management wizard, select **Setup connectivity**, and then select the NIC that the process server uses to receive replication traffic from VMs. Then select **Save**. You can't change this setting after it is configured.
2. In **Select Recovery Services vault**, sign in to Microsoft Azure, select your Azure subscription and the relevant resource group and vault.

    > [!NOTE]
    > Once registered, there is no flexibility to change the recovery services vault.

3. In **Install third-party software**,

    |Scenario   |Steps to follow  |
    |---------|---------|
    |Can I download & install MySQL manually?     |  Yes. Download MySQL application & place it in the folder **C:\Temp\ASRSetup**, then install manually. Now, when you accept the terms > click on **Download and install**, the portal says *Already installed*. You can proceed to the next step.       |
    |Can I avoid download of MySQL online?     |   Yes. Place your MySQL installer application in the folder **C:\Temp\ASRSetup**. Accept the terms > click on **Download and install**, the portal will use the installer added by you and installs the application. You can proceed to the next step post installation.    |
    |I would like to download & install MySQL through Azure Site Recovery     |  Accept the license agreement & click on **Download and Install**. Then you can proceed to the next step post installation.       |
4. In **Validate appliance configuration**, prerequisites are verified before you continue.
5. In **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, where the VMs you want to replicate are located. Enter the port on which the server is listening. Enter a friendly name to be used for the VMware server in the vault.
6. Enter credentials to be used by the configuration server to connect to the VMware server. Site Recovery uses these credentials to automatically discover VMware VMs that are available for replication. Select **Add**, and then **Continue**. The credentials entered here are locally saved.
7. In **Configure virtual machine credentials**, enter the user name, and password of Virtual machines to automatically install Mobility Service during replication. For **Windows** machines, the account needs local administrator privileges on the machines you want to replicate. For **Linux**, provide details for the root account.
8. Select **Finalize configuration** to complete registration.
9. After registration finishes, open Azure portal, verify that the configuration server and VMware server are listed on **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.

## FAQ

1. Can I use the VM, where the configuration server is installed, for different purposes?

    **No**, we recommend you to use the VM for sole purpose of configuration server. Ensure you follow all the specifications mentioned in [Prerequisites](#prerequisites) for efficient management of disaster recovery.
2. Can I switch the vault already registered in the configuration server with a newly created vault?

    **No**, once a vault is registered with configuration server, it cannot be changed.
3. Can I use the same configuration server for protecting both physical and virtual machines?

    **Yes**, the same configuration server can be used for replicating physical and virtual machines. However, physical machine can be failed back only to a VMware VM.
4. What is the purpose of a configuration server and where is it used?

    Refer to [VMware to Azure replication architecture](vmware-azure-architecture.md) to learn more about configuration server and its functionalities.
5. Where can I find the latest version of Configuration server?

    For steps to upgrade the configuration server through the portal, see [Upgrade the configuration server](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server). You can also directly download it from [Microsoft Download Center](https://aka.ms/asrconfigurationserver).
6. Where can I download the passphrase for configuration server?

    Refer to [this article](vmware-azure-manage-configuration-server.md#generate-configuration-server-passphrase) to download the passphrase.
7. Where can I download vault registration keys?

    In the **Recovery Services Vault**, **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**. In Servers, select **Download registration key** to download the vault credentials file.

## Upgrade the configuration server

To upgrade the configuration server to the latest version, follow these [steps](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server).

## Manage the configuration server

To avoid interruptions in ongoing replication, ensure that IP address of the configuration server does not change after the configuration server has been registered to a vault. You can learn more about common configuration server management tasks [here](vmware-azure-manage-configuration-server.md).

## Troubleshoot deployment issues

[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]



## Next steps

Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
