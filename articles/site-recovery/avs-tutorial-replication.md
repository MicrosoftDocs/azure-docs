---
title: Set up Azure Site Recovery for Azure VMware Solution VMs
description: Learn how to set up disaster recovery to Azure for Azure VMware Solution VMs, by using Azure Site Recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 08/29/2023
ms.author: ankitadutta
ms.custom: MVC, engagement-fy23

---
# Set up Azure Site Recovery for Azure VMware Solution VMs

This tutorial describes how to enable replication for Azure VMware Solution virtual machines (VMs) for disaster recovery to Azure by using the [Azure Site Recovery](site-recovery-overview.md) service.

This is the third tutorial in a series that shows you how to set up disaster recovery to Azure for Azure VMware Solution VMs. In the previous tutorial, you [prepared the Azure VMware Solution environment](avs-tutorial-prepare-avs.md) for disaster recovery to Azure.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up the source replication settings and an Azure Site Recovery configuration server in an Azure VMware Solution private cloud.
> * Set up the replication target settings.
> * Create a replication policy.
> * Enable replication for a VMware vSphere VM.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and they don't show all possible settings and paths.

## Prerequisites

Before you begin, complete the previous tutorials. Confirm that you finished these tasks:

1. [Set up Azure](avs-tutorial-prepare-azure.md) for disaster recovery to Azure.
2. [Prepare your Azure VMware Solution deployment](avs-tutorial-prepare-avs.md) for disaster recovery to Azure.

Also make sure that you meet all [prerequisites](vmware-azure-deploy-configuration-server.md#prerequisites) for successful setup of a configuration server.

## Considerations

This tutorial shows you how to replicate a single VM. If you're deploying multiple VMs, you should use the [Deployment Planner tool](site-recovery-deployment-planner.md).

In this tutorial, Site Recovery automatically downloads and installs MySQL to the configuration server. If you prefer, you can [set it up manually](vmware-azure-deploy-configuration-server.md#configure-settings) instead.

## Select a protection goal

1. In **Recovery Services vaults**, select the vault name. This tutorial uses **ContosoVMVault**.
2. In **Getting Started**, select **Site Recovery**. Then select **Prepare Infrastructure**.
3. In **Protection goal** > **Where are your machines located**, select **On-premises**.
4. In **Where do you want to replicate your machines**, select **To Azure**.
5. In **Are your machines virtualized**, select **Yes, with VMware vSphere Hypervisor**. Then select **OK**.

## Set up the source environment

In your source environment, you need a single, highly available, on-premises machine to host these on-premises Site Recovery components:

* **Configuration server**: This server coordinates communications between the Azure VMware Solution private cloud and Azure. It also manages data replication.
* **Process server**: This server acts as a replication gateway. It does these tasks:

  * Receives replication data, optimizes the data (with caching, compression, and encryption), and sends the data to a cache storage account in Azure.
  * Installs the Mobility Service agent on VMs that you want to replicate.
  * Performs automatic discovery of Azure VMware Solution VMs.
* **Primary target server**: This server handles replication data during failback from Azure.

All of these components are installed together on a single Azure VMware Solution machine that's known as the *configuration server*. By default, for Azure VMware Solution disaster recovery, you set up the configuration server as a highly available VMware vSphere VM. To do this, you download a prepared Open Virtualization Application (OVA) template that's based on Open Virtualization Format (OVF). Then, you import the template into VMware vCenter Server to create the VM.

The latest version of the configuration server is available in the portal. You can also download it directly from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

If you can't use an OVA template to set up a VM, you can [set up the configuration server manually](physical-manage-configuration-server.md).

The license provided with the OVA template is an evaluation license that's valid for 180 days. Windows running on the VM must be activated with the required license.

### Download the template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the OVA template for the configuration server.

### Import the template in VMware

1. Sign in to the VMware vCenter server by using the VMware vSphere client.
2. On the **File** menu, select **Deploy OVF Template** to start the **Deploy OVF Template** wizard.
3. On the **Select an OVF template** page, enter the location of the downloaded OVF file.

   ![Screenshot of the first page of the wizard for deploying an OVF template in the VMware vSphere client.](./media/vmware-azure-tutorial/vcenter-wizard.png)
4. On the **Select name and folder** and **Select a compute resource** pages, accept the default settings.
5. On the **Review details** page, select **Next**.
6. On the **Select storage** page, for best performance, select **Thick Provision Eager Zeroed** in **Select virtual disk format**.
7. On the **Ready to complete** page, to set up the VM with the default settings, select **Power on after deployment** > **Finish**.

   > [!TIP]
   > By default, the template contains a single network adapter. If you want to add an adapter, clear **Power on after deployment** before you select **Finish**. You can add adapters after deployment.

## Add a network adapter

If you want to add a network adapter to the configuration server, add it before you register the server in the vault. You can't add adapters after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network.
4. To connect the adapter when the VM is turned on, select **Connect at power on**.
5. Select **Next** > **Finish**. Then select **OK**.

## Register the configuration server

After you set up the configuration server, you register it in the vault:

1. From the VMware vSphere Client console, turn on the VM.
2. The VM starts in a Windows Server 2016 installation experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.

   The first time you sign in, the Azure Site Recovery configuration tool starts within a few seconds.
4. Enter a name that's used to register the configuration server with Azure Site Recovery. Then select **Next**.
5. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription. The credentials must have access to the vault in which you want to register the configuration server. Ensure that necessary [roles](vmware-azure-deploy-configuration-server.md#azure-active-directory-permission-requirements) are assigned to this user.

   The tool performs some configuration tasks and then restarts.
6. Sign in to the machine again. In a few seconds, the **Configuration Server Management** wizard starts automatically.

### Configure settings and add the VMware vCenter server

Finish setting up and registering the configuration server:

1. In the **Configuration Server Management** wizard, select **Setup connectivity**.

   From the dropdown lists, first select the network adapter that the in-built process server uses for discovery and push installation of mobility service on source machines. Then select the adapter that the configuration server uses for connectivity with Azure. When you finish, select **Save**.

   You can't change this setting after it's configured.
1. In **Select Recovery Services vault**, select your Azure subscription and the relevant resource group and vault.
1. In **Install third-party software**, accept the license agreement. Select **Download and Install** to install MySQL Server. If you placed MySQL in the path, you can skip this step. [Learn more about MySQL installation](vmware-azure-deploy-configuration-server.md#configure-settings).
1. In **Validate appliance configuration**, wait until prerequisites are verified before you continue.
1. In **Configure vCenter Server/vSphere ESXi server**:
   1. Enter the fully qualified domain name (FQDN) or IP address of the VMware vCenter server that contains the VMs that you want to replicate.
   1. Enter the port on which the server is listening.
   1. Enter a friendly name to be used for the VMware vCenter server in the vault.
1. Enter user credentials that the configuration server will use to connect to the VMware vCenter server.

   Ensure that the user name and password are correct. Also ensure that the user is a part of the Administrators group of the virtual machine to be protected. Azure Site Recovery uses these credentials to automatically discover VMware vSphere VMs that are available for replication.

   Select **Add**, and then select **Continue**.
1. In **Configure virtual machine credentials**, enter the user name and password that will be used to automatically install the Mobility service on VMs when replication is enabled.
   * For Windows, the account needs local administrator privileges on the machines that you want to replicate.
   * For Linux, provide details for the root account.
1. Select **Finalize configuration**.
1. After registration finishes, open the Azure portal and verify that the configuration server and VMware server are listed on **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.

After the configuration server is registered, Site Recovery connects to the VMware vCenter server by using the specified settings, and it discovers VMs.

> [!NOTE]
> It can take 15 minutes or more for the account name to appear in the portal. To update immediately, select **Configuration Servers**, select the server name, and then select **Refresh Server**.

## Set up the target environment

Select and verify target resources:

1. Select **Prepare infrastructure** > **Target**.
2. Select the Azure subscription that you want to use. The example in this tutorial uses an Azure Resource Manager model.

   Azure Site Recovery checks that you have one or more virtual networks. You should have these networks from setting up the Azure components in the [first tutorial](tutorial-prepare-azure.md) in this tutorial series.

   ![Screenshot of the pane for selecting and verifying a target virtual network.](./media/vmware-azure-tutorial/storage-network.png)

## Create a replication policy

1. Open the [Azure portal](https://portal.azure.com). Search for and select **Recovery Services vaults**.
2. Select the Recovery Services vault (**ContosoVMVault** in this tutorial).
3. To create a replication policy, select **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
4. On the **Create replication policy** pane, for **Name**, enter the policy name (**VMwareRepPolicy** in this tutorial).
5. For **RPO threshold in mins**, use the default of 60 minutes. This value defines how often recovery points are created. An alert is generated if continuous replication exceeds this limit.
6. In **Recovery point retention in hours**, specify how long each recovery point is retained (24 hours in this tutorial). Replicated VMs can be recovered to any point in a retention window.
7. In **App-consistent snapshot frequency in mins**, specify how often app-consistent snapshots are created. This tutorial uses the default of 60 minutes. Select **OK** to create the policy.

   ![Screenshot of the options for creating a replication policy.](./media/vmware-azure-tutorial/replication-policy.png)

The policy is automatically associated with the configuration server. A matching policy is automatically created for failback by default. For example, if the replication policy is **rep-policy**, the failback policy is **rep-policy-failback**. This policy isn't used until you start a failback from Azure.

> [!NOTE]
> In VMware vSphere-to-Azure scenarios, the crash-consistent snapshot is taken at 5-minute intervals.

## Enable replication

Enable replication for VMs as follows:

1. Select **Replicate application** > **Source**.
2. In **Source**, select **On-premises**, and then select the configuration server in **Source location**.
3. In **Machine type**, select **Virtual Machines**.
4. In **vCenter/vSphere Hypervisor**, select the vCenter Server that manages the host.
5. Select the process server (installed by default on the configuration server VM). Then select **OK**.

   The health status of each process server appears, based on recommended limits and other parameters. Choose a healthy process server. You can't choose a [critical](vmware-physical-azure-monitor-process-server.md#process-server-alerts) process server. You can either [troubleshoot and resolve](vmware-physical-azure-troubleshoot-process-server.md) the errors *or* set up a [scale-out process server](vmware-azure-set-up-process-server-scale.md).
6. In **Target**, select the subscription and the resource group in which you want to create the failed-over VMs. This tutorial uses the Resource Manager deployment model.
7. Select the Azure network and subnet to which Azure VMs connect when they're created after failover.
8. Select **Configure now for selected machines** to apply the network setting to all VMs on which you enable replication. Select **Configure later** to select the Azure network per machine.
9. In **Virtual Machines** > **Select virtual machines**, select each machine that you want to replicate. You can select only machines for which replication can be enabled. Then select **OK**.

   If you can't view or select any particular virtual machine, [troubleshoot the problem](./vmware-azure-troubleshoot-replication.md).
10. In **Properties** > **Configure properties**, select the account that the process server will use to automatically install the Mobility service on the machine.
11. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected.
12. Select **Enable Replication**. Site Recovery installs the Mobility service when replication is enabled for a VM.
13. Track the progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs and a recovery point generation is complete, the machine is ready for failover.

    It can take 15 minutes or longer for changes to take effect and appear in the portal.
14. To monitor VMs that you add, check the last discovered time for VMs in **Configuration Servers** > **Last Contact At**. To add VMs without waiting for the scheduled discovery, highlight the configuration server (don't select it) and select **Refresh**.

## Next step

After you enable replication, run a drill to make sure that everything works as expected.

> [!div class="nextstepaction"]
> [Run a disaster recovery drill](avs-tutorial-dr-drill-azure.md)
