---
title: Set up disaster recovery to Azure for on-premises VMware VMs with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery to Azure for on-premises VMware VMs with Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 04/08/2018
ms.author: raynew
ms.custom: MVC

---
# Set up disaster recovery to Azure for on-premises VMware VMs

This tutorial shows you how to set up disaster recovery to Azure for on-premises VMware VMs running
Windows. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enter the replication source and target.
> * Set up the source replication environment, including on-premises Azure Site Recovery components, and the target replication environment.
> * Create a replication policy.
> * Enable replication for a VM.

This tutorial is the third in a series. This tutorial assumes that you finished the tasks in the previous tutorials:

* [Prepare Azure](tutorial-prepare-azure.md). This tutorial describes how to set up an Azure storage account and network, make sure your Azure account has the right permissions, and create a Recovery Services vault.
* [Prepare on-premises VMware](vmware-azure-tutorial-prepare-on-premises.md). In this tutorial you prepare accounts so that Site Recovery can access VMware servers to discover VMs, and to optionally do a push installation of the Site Recovery Mobility service component when you enable replication for a VM. You also make sure that your VMware servers and VMs comply with Site Recovery requirements.

Before you start, it's helpful to [review the architecture](vmware-azure-architecture.md)
for disaster recovery scenarios.


## Select a replication goal

1. In **Recovery Services vaults**, select the vault name, **ContosoVMVault**.
2. In **Getting Started**, select Site Recovery. Then select **Prepare Infrastructure**.
3. In **Protection goal** > **Where are your machines located**, select **On-premises**.
4. In **Where do you want to replicate your machines**, select **To Azure**.
5. In **Are your machines virtualized**, select **Yes, with VMware vSphere Hypervisor**. Then select **OK**.

## Set up the source environment


To set up the source environment, you need a single, highly available, on-premises machine to host on-premises Site Recovery components. Components include the configuration server, process server, and master target server:

- The configuration server coordinates communications between on-premises and Azure and manages data replication.
- The process server acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption; and sends it to Azure storage. The process server also installs Mobility Service on VMs you want to replicate and performs automatic discovery of on-premises VMware VMs.
- The master target server handles replication data during failback from Azure.

To set up the configuration server as a highly available VMware VM, download a prepared Open Virtualization Format (OVF) template and import the template into VMware to create the VM. After you set up the configuration server, register it in the vault. After registration, Site Recovery discovers on-premises VMware VMs.

> [!TIP]
> This tutorial uses an OVF template to create the configuration server VMware VM. If you're unable to do this, you can run [manual Setup](physical-manage-configuration-server.md) to do this. 


### Download the VM template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the OVF template for the configuration server.

  > [!TIP]
  You can download the latest version of the configuration server template directly from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

## Import the template in VMware

1. Sign in to the VMware vCenter server or vSphere ESXi host by using the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the Deploy OVF Template wizard. 

     ![OVF template](./media/vmware-azure-tutorial/vcenter-wizard.png)

3. On **Select source**, enter the location of the downloaded OVF.
4. On **Review details**, select **Next**.
5. On **Select name and folder** and **Select configuration**, accept the default settings.
6. On **Select storage**, for best performance select **Thick Provision Eager Zeroed** in **Select virtual disk format**.
7. On the rest of the wizard pages, accept the default settings.
8. On **Ready to complete**:

    * To set up the VM with the default settings, select **Power on after deployment** > **Finish**.

    * If you want to add an additional network interface, clear **Power on after deployment**. Then select **Finish**. By default, the configuration server template is deployed with a single NIC. You can add additional NICs after deployment.

## Add an additional adapter

To add an additional NIC to the configuration server, add it before you register the server in the vault. Adding additional adapters isn't supported after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network. 
4. To connect the virtual NIC when the VM is turned on, select **Connect at power on**. Select **Next** > **Finish**. Then select **OK**.


## Register the configuration server 

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots up into a Windows Server 2016 installation experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.
4. The first time you sign in, the Azure Site Recovery Configuration Tool starts.
5. Enter a name that's used to register the configuration server with Site Recovery. Then select **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription. The credentials must have access to the vault in which you want to register the configuration server.
7. The tool performs some configuration tasks and then reboots.
8. Sign in to the machine again. The configuration server management wizard starts automatically.

### Configure settings and add the VMware server

1. In the configuration server management wizard, select **Setup connectivity**, and then select the NIC to receive replication traffic. Then select **Save**. You can't change this setting after it's configured.
2. In **Select Recovery Services vault**, select your Azure subscription and the relevant resource group and vault.
3. In **Install third-party software**, accept the license agreement. Select **Download and Install** to install MySQL Server.
4. Select **Install VMware PowerCLI**. Make sure all browser windows are closed before you do this. Then select **Continue**.
5. In **Validate appliance configuration**, prerequisites are verified before you continue.
6. In **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, where the VMs you want to replicate are located. Enter the port on which the server is listening. Enter a friendly name to be used for the VMware server in the vault.
7. Enter credentials to be used by the configuration server to connect to the VMware server. Site Recovery uses these credentials to automatically discover VMware VMs that are available for replication. Select **Add**, and then select **Continue**.
8. In **Configure virtual machine credentials**, enter the user name and password to be used to automatically install Mobility Service on machines, when replication is enabled. For Windows machines, the account needs local administrator privileges on the machines you want to replicate. For Linux, provide details for the root account.
9. Select **Finalize configuration** to complete registration. 
10. After registration finishes, in the Azure portal, verify that the configuration server and VMware server are listed on the **Source** page in the vault. Then select **OK** to configure target settings.


Site Recovery connects to VMware servers by using the specified settings and discovers VMs.

> [!NOTE]
> It can take 15 minutes or more for the account name to appear in the portal. To update
> immediately, select **Configuration Servers** > ***server name*** > **Refresh Server**.

## Set up the target environment

Select and verify target resources.

1. Select **Prepare infrastructure** > **Target**. Select the Azure subscription you want to use.
2. Specify whether your target deployment model is based on Azure Resource Manager or is classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target tab](./media/vmware-azure-tutorial/storage-network.png)

## Create a replication policy

1. Open the [Azure portal](https://portal.azure.com), and select **All resources**.
2. Select the Recovery Service vault named **ContosoVMVault**.
3. To create a replication policy, select **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
4. In **Create replication policy**, enter the policy name **VMwareRepPolicy**.
5. In **RPO threshold**, use the default of 60 minutes. This value defines how often recovery points are created. An alert is generated if continuous replication exceeds this limit.
6. In **Recovery point retention**, use the default of 24 hours for how long the retention window is for each recovery point. For this tutorial, use 72 hours. Replicated VMs can be recovered to any point in a window.
7. In **App-consistent snapshot frequency**, use the default of 60 minutes for the frequency that application-consistent snapshots are created. Select **OK** to create the policy.

   ![Create replication policy](./media/vmware-azure-tutorial/replication-policy.png)

The policy is automatically associated with the configuration server. A matching policy
is automatically created for failback by default. For example, if the replication policy is **rep-policy**,
then the failback policy is **rep-policy-failback**. This policy isn't used until you initiate
a failback from Azure.

## Enable replication

Site Recovery installs Mobility Service when replication is enabled for a VM. It can take 15
minutes or longer for changes to take effect and appear in the portal.

Enable replication as follows:

1. Select **Replicate application** > **Source**.
2. In **Source**, select the configuration server.
3. In **Machine type**, select **Virtual Machines**.
4. In **vCenter/vSphere Hypervisor**, select the vCenter server that manages the vSphere host, or select the host.
5. Select the process server (configuration server). Then select **OK**.
6. In **Target**, select the subscription and the resource group in which you want to create the failed-over VMs. Choose the deployment model that you want to use in Azure (classic or Resource Manager) for the failed-over VMs.
7. Select the Azure storage account you want to use to replicate data.
8. Select the Azure network and subnet to which Azure VMs connect when they're created after failover.
9. Select **Configure now for selected machines** to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine.
10. In **Virtual Machines** > **Select virtual machines**, select each machine you want to replicate. You can only select machines for which replication can be enabled. Then select **OK**.
11. In **Properties** > **Configure properties**, select the account to be used by the process server to automatically install Mobility Service on the machine.
12. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected.
13. Select **Enable Replication**.

You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.

To monitor VMs you add, check the last discovered time for VMs in **Configuration Servers** > **Last Contact At**. To add VMs without waiting for the scheduled discovery, highlight the configuration server (don't select it) and select **Refresh**.

## Next steps

> [!div class="nextstepaction"]
> [Run a disaster recovery drill](site-recovery-test-failover-to-azure.md)
