---
title: Set up disaster recovery to Azure for on-premises VMware VMs with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery to Azure for on-premises VMware VMs with the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 01/11/2018
ms.author: raynew
ms.custom: MVC

---
# Set up disaster recovery to Azure for on-premises VMware VMs

This tutorial shows you how to set up disaster recovery to Azure for on-premises VMware VMs running
Windows. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Specify the replication source and target.
> * Set up the source replication environment, including on-premises Site Recovery components, and the target replication environment.
> * Create a replication policy
> * Enable replication for a VM

This is the third tutorial in a series. This tutorial assumes that you have already completed the tasks in the previous tutorials:

1. [Prepare Azure](tutorial-prepare-azure.md)
2. [Prepare on-premises VMware](tutorial-prepare-on-premises-vmware.md)

Before you start, it's helpful to [review the architecture](concepts-vmware-to-azure-architecture.md)
for disaster recovery scenario.


## Select a replication goal

1. In **Recovery Services vaults**, click the vault name, **ContosoVMVault**.
2. In **Getting Started**, click Site Recovery. Then click **Prepare Infrastructure**.
3. In **Protection goal** > **Where are your machines located**, select **On-premises**.
4. In **Where do you want to replicate your machines, select **To Azure**.
5. In **Are your machines virtualized**, select **Yes, with VMware vSphere Hypervisor**. Then click **OK**.

## Set up the source environment

To set up the source environment, you need a single, highly-available, on-premises machine to host on-premises Site Recovery components. Components include the configuration server, process server, and master target server.

- The configuration server coordinates communications between on-premises and Azure, and manages data replication.
- The process server acts as a replication gateway. Receives replication data, optimizes it with caching, compression, and encryption, and sends it to Azure storage. The process server also installs the Mobility service on VMs you want to replicate, and performs automatic discovery of on-premises VMware VMs.
- The master target server handles replication data during failback from Azure.

To set up the configuration server as a highly-available VMware VM, you download a prepared OVF template, and import the template into VMware to create the VM. After setting up the configuration server, you register it in the vault. After registration, Site Recovery discovers on-premises VMware VMs.

### Download the VM template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, click **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the Open Virtualization Format (OVF) template for the configuration server.

  > [!TIP]
  The latest version of the configuration server template can be downloaded directly from [Microsoft Download Center](http://aka.ms/unifiedsetup).

## Import the template in VMware

1. Log onto the VMware vCenter server or vSphere ESXi host, using the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template**, to launch the Deploy OVF Template wizard.  

     ![OVF template](./media/tutorial-vmware-to-azure/vcenter-wizard.png)

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

### Configure settings and connect to VMware

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


Site Recovery connects to VMware servers using the specified settings, and discovers VMs.

> [!NOTE]
> It can take 15 minutes or more for the account name to appear in the portal. To update
> immediately, click **Configuration Servers** > ***server name*** > **Refresh Server**.

## Set up the target environment

Select and verify target resources.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify whether your target deployment model is Resource Manager-based, or classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/tutorial-vmware-to-azure/storage-network.png)

## Create a replication policy

1. Open the [Azure portal](https://portal.azure.com) and click on **All resources**.
2. Click on the Recovery Service vault named **ContosoVMVault**.
3. To create a replication policy, click **Site Recovery infrastructure** > **Replication
   Policies** > **+Replication Policy**.
4. In **Create replication policy**, specify a policy name **VMwareRepPolicy**.
5. In **RPO threshold**, use the default of 60 minutes. This value defines how often recovery
   points are created. An alert is generated if continuous replication exceeds this limit.
6. In **Recovery point retention**, use the default of 24 hours for how long the retention window
   is for each recovery point. For this tutorial we select 72 hours. Replicated VMs can be
   recovered to any point in a window.
7. In **App-consistent snapshot frequency**, use the default of 60 minutes for the frequency that
   application-consistent snapshots are created. Click **OK** to create the policy.

   ![Policy](./media/tutorial-vmware-to-azure/replication-policy.png)

The policy is automatically associated with the configuration server. By default, a matching policy
is automatically created for failback. For example, if the replication policy is **rep-policy**
then the failback policy will be **rep-policy-failback**. This policy isn't used until you initiate
a failback from Azure.

## Enable replication

Site Recovery installs the Mobility service when replication is enabled for a VM. It can take 15
minutes or longer for changes to take effect and appear in the portal.

Enable replication as follows:

1. Click **Replicate application** > **Source**.
2. In **Source**, select the configuration server.
3. In **Machine type**, select **Virtual Machines**.
4. In **vCenter/vSphere Hypervisor**, select the vCenter server that manages the vSphere host, or
   select the host.
5. Select the process server (configuration server). IThen click **OK**.
6. In **Target**, select the subscription and the resource group in which you want to create the
   failed over VMs. Choose the deployment model that you want to use in Azure (classic or resource
   management), for the failed over VMs.
7. Select the Azure storage account you want to use for replicating data.
8. Select the Azure network and subnet to which Azure VMs will connect, when they're created after
   failover.
9. Select **Configure now for selected machines**, to apply the network setting to all machines you
   select for protection. Select **Configure later** to select the Azure network per machine.
10. In **Virtual Machines** > **Select virtual machines**, click and select each machine you want
    to replicate. You can only select machines for which replication can be enabled. Then click **OK**.
11. In **Properties** > **Configure properties**, select the account that will be used by the
    process server to automatically install the Mobility service on the machine.
12. In **Replication settings** > **Configure replication settings**, verify that the correct
    replication policy is selected.
13. Click **Enable Replication**.

You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site
Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

To monitor VMs you add, you can check the last discovered time for VMs in **Configuration Servers**
> **Last Contact At**. To add VMs without waiting for the scheduled discovery, highlight the
configuration server (don’t click it), and click **Refresh**.

## Next steps

> [!div class="nextstepaction"]
> [Run a disaster recovery drill](site-recovery-test-failover-to-azure.md)
