---
title: Set up the source environment and configuration serverfor disaster recovery of VMware VMs to Azure with Azure Site Recovery | Microsoft Docs'
description: This article describes how to set up your on-premises environment and configuration server for disaster recovery of VMware VMs to Azure with Azure Site Recovery.
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/27/2018
ms.author: ramamill

---

# Set up the source environment and configuration server

This article describes how to set up your source on-premises environment for disaster recovery of VMware VMs to Azure with [Azure Site Recovery](site-recovery-overview.md). It includes steps for setting up an on-premises machine as the Site Recovery configuration server, and automatically discovering on-premises VMs. 

## Prerequisites

Before you start, make sure you've done the following

- Planned your disaster recovery deployment using the [Azure Site Recovery Deployment Planner](site-recovery-deployment-planner.md). The Planner helps to ensure you have sufficient resources and bandwidth for disaster recovery and the recovery point objective (RPO) in your organization.
- [Set up Azure resources](tutorial-prepare-azure.md) in the [Azure portal](http://portal.azure.com).
- [Set up on-premises VMware](vmware-azure-tutorial-prepare-on-premises.md) resources, including a dedicated account for automatic discovery of on-premises VMware VMs.
- You can [review common questions](vmware-azure-common-questions.md#configuration-server) about configuration server deployment and management.


## Choose protection goals

1. In **Recovery Services vaults**, select the vault name. 
2. In **Getting Started**, select Site Recovery. Then select **Prepare Infrastructure**.
3. In **Protection goal** > **Where are your machines located**, select **On-premises**.
4. In **Where do you want to replicate your machines**, select **To Azure**.
5. In **Are your machines virtualized**, select **Yes, with VMware vSphere Hypervisor**. Then select **OK**.

## About the configuration server

You deploy an on-premises configuration server when you set up disaster recovery of VMware VMs to Azure.

- The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication.
- You deploy the configuration server as a VMware VM.
- Site Recovery provides an OVA template that you download from the Azure portal, and import into vCenter Server to set up the configuration server VM.
- [Learn more](vmware-azure-architecture.md) about the configuration server components and processes.


>[!NOTE]
Don't use these instructions if you're deploying the configuration server for disaster recovery of on-premises physical machines to Azure. For this scenario, follow [this article](physical-azure-set-up-source.md).


## Before you deploy the configuration server

If you install the configuration server as a VMware VM using the OVA template, the VM will be installed with all prerequisites. If you want to review the prerequisites, use the following articles.

- [Learn about](vmware-azure-configuration-server-requirements.md) the hardware, software, and capacity requirement for the configuration server.
- If you're replicating multiple VMware VMs, you should review the [capacity planning considerations](site-recovery-plan-capacity-vmware.md), and run the [Azure Site Recovery Deployment Planner](site-recovery-deployment-planner.md) tool for VMWare replication.
- The Windows license for the OVA template is an evaluation license that's valid for 180 days. After this time, you need to activate Windows with a valid license. 
- The OVA template provides a simple way to set up the configuration server as a VMware VM. If for some reason you need to set up the VMware VM without the template, review the prerequistes, and follow the manual instructions in [this article](physical-azure-set-up-source.md).
- Your Azure account needs permissions to create Azure AD apps.


>[!IMPORTANT]
The configuration server must be deployed as described in this article. Copying or cloning an existing configuration server isn't supported.

### Set up Azure account permissions

Either a tenant/global admin can assign permissions to create Azure AD apps to the account, or assign the Application Developer role (that has the permissions) to the account.


The tenant/global admin can grant permissions for the account as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

 > [!NOTE]
 > This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).

Alternatively the tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

 


## Download the OVA template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the Open Virtualization Application (OVA) template for the configuration server.

  > [!TIP]
>You can also download the latest version of the configuration server template from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).


## Import the OVA template in VMware

1. Sign in to the VMware vCenter server or vSphere ESXi host with the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the Deploy OVF Template wizard.

     ![OVF template](./media/vmware-azure-deploy-configuration-server/vcenter-wizard.png)

3. In **Select source**, enter the location of the downloaded OVF.
4. In **Review details**, select **Next**.
5. In **Select name and folder** and **Select configuration**, accept the default settings.
6. In **Select storage**, for best performance select **Thick Provision Eager Zeroed** in **Select virtual disk format**.
7. In the rest of the wizard pages, accept the default settings.
8. In **Ready to complete**, to set up the VM with the default settings, select **Power on after deployment** > **Finish**.
9. By default the VM is deployed with a single NIC. If you want to add an addition NIC, clear **Power on after deployment**, and click **Finish**. Then follow the next procedure.

## Add an adapter to the configuration server

If you want to add an additional NIC to the configuration server, add it before you register the server in the vault. Adding additional adapters isn't supported after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network.
4. To connect the virtual NIC when the VM is turned on, select **Connect at power-on**. Then select **Next** > **Finish** > **OK**.

## Register the configuration server 
Turn on the VM and register the configuration server in the Site Recovery vault.

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots into Windows Server 2016 Installation Experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.



## Set up the configuration server

As part of the deployment, you need to install MySQL on the configuration server VM. You can do this in a couple of ways:

- Let Site Recovery download and install MySQL. If you want to use this option, you don't need to do anything before you start the configuration server setup.
- Download and install MySQL manually: Before you set up the configuration server, download the MySQL installer and put it the **C:\Temp\ASRSetup** folder. Now install MySQL. 
- Download manually and let Site Recovery install. Before you set up the configuration server, download the MySQL installer and put it in the **C:\Temp\ASRSetup** folder.


1. The first time you sign into the VM, the Azure Site Recovery Configuration Tool starts.
2. Specify a name used to register the configuration server in the Site Recovery vault. Then select **Next**.
3. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription. Note that the account must have access to the vault in which you want to register the configuration server.
4. The tool performs some configuration tasks, and then reboots.
5. Sign in to the machine again. The Configuration Server Management Wizard starts automatically within a few seconds.
6. In the wizard, select **Setup connectivity**.
7. Select the NIC that the process server (running by default on the configuration server) uses to receive replication traffic from VMs.
8. Then select **Save**. Note that you can't change vault settings after the configuration server is registered. 
9. In **Select Recovery Services vault**, sign in to Microsoft Azure, select your Azure subscription and the relevant resource group and vault. 
10. In **Install third-party software**, install MySQL:
     - If Site Recovery is handling the MySQL download and installation, click **Download and install**. Wait for the installation to complete and then proceed with the wizard.
     - If you downloaded MySQL and Site Recovery will install it, click **Download and install**. Wait for the installation to finish, and proceed with the wizard.
     - If you manually downloaded and installed MySQL, click **Download and install**. The app shows as **Already installed**. Proceed with the wizard.
11. In **Validate appliance configuration**, setup verifies the prerequisites before you continue. 
12. In **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, on which VMs you want to replicate are located. Enter the port on which the server is listening, and specify a friendly name for the VMware server in the vault.
13. Enter the credentials that will be used by the configuration server to connect to the VMware server and automatically discover VMware VMs that are available for replication. Select **Add** >  **Continue**. The credentials are saved locally.
14. In **Configure virtual machine credentials**, specify the credentials that Site Recovery will use to automatically install the Mobility Service when you enable replication for a VM.
    - For Windows machines, the account needs local administrator privileges on the machines you want to replicate.
    - For Linux, provide details for the root account.
15. Select **Finalize configuration** to complete registration.
16. After registration finishes, open the Azure portal and check that the configuration server and VMware server appear in **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.


## Exclude antivirus on the configuration server

If antivirus software is running on the configuration server VM, make sure that the following folders are excluded from antivirus operations. This ensures that replication and connectivity work as expected: 

- C:\Program Files\Microsoft Azure Recovery Services Agent
- C:\Program Files\Microsoft Azure Site Recovery Provider
- C:\Program Files\Microsoft Azure Site Recovery Configuration Manager
- C:\Program Files\Microsoft Azure Site Recovery Error Collection Tool
- C:\thirdparty
- C:\Temp
- C:\strawberry
- C:\ProgramData\MySQL
- C:\Program Files (x86)\MySQL
- C:\ProgramData\ASR
- C:\ProgramData\Microsoft Azure Site Recovery
- C:\ProgramData\ASRLogs
- C:\ProgramData\ASRSetupLogs
- C:\ProgramData\LogUploadServiceLogs
- C:\inetpub
- Site Recovery installation directory. For example: E:\Program Files (x86)\Microsoft Azure Site Recovery


## Next steps
- If you run into difficulties, review [common questions](vmware-azure-common-questions.md#configuration server) and [troubleshooting](vmware-azure-troubleshoot-configuration-server.md) for the configuration server.
- Now, [set up your target environment](./vmware-azure-set-up-target.md) in Azure.
