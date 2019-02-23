---
title: Move Azure IaaS VMs to another Azure region using the Azure Site Recovery service | Microsoft Docs
description: Use Azure Site Recovery to move Azure IaaS VMs from one Azure region to another.
services: site-recovery
author: rajani-janaki-ram
ms.service: site-recovery
ms.topic: tutorial
ms.date: 01/28/2019
ms.author: rajanaki
ms.custom: MVC
---

# Move Azure VMs to another region

There are various scenarios where you'd want to move your existing Azure IaaS virtual machines from one region to another - for improving reliability and availability of your existing VMs, or to improve manageability or due to governance reasons etc, as detailed [here](azure-to-azure-move-overview.md). In addition to using the [Azure Site Recovery](site-recovery-overview.md) service to manage and orchestrate disaster recovery of on-premises machines and Azure VMs for the purposes of business continuity and disaster recovery (BCDR), you can also use Site Recovery to manage move Azure VMs to a secondary region.       

This tutorial shows you how to move Azure VMs to another region using Azure Site Recovery. In this tutorial, you learn how to:

> [!div class="checklist"]
> * [Verify prerequisites](#verify-prerequisites)
> * [Prepare the source VMs](#prepare-the-source-vms)
> * [Prepare the target region](#prepare-the-target-region)
> * [Copy data to the target region](#copy-data-to-the-target-region)
> * [Test the configuration](#test-the-configuration) 
> * [Perform the move](#perform-the-move-to-the-target-region-and-confirm) 
> * [Discard the resources in the source region](#discard-the-resource-in-the-source-region) 

> [!IMPORTANT]
> This document guides you to move Azure VMs from one region to another as is, if your requirement is to improve availability by moving VMs in an availability set to zone pinned VMs in a different region, refer to the tutorial [here](move-azure-VMs-AVset-Azone.md).

## Verify Prerequisites

- Make sure you have Azure VMs in the Azure region from which you want to move.
- Verify if your choice of [source region - target region combination is supported](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-support-matrix#region-support) and make an informed decision on the target region
- Make sure that you understand the [scenario architecture and components](azure-to-azure-architecture.md).
- Review the [support limitations and requirements](azure-to-azure-support-matrix.md).
- Verify account permissions: If you have just created your free Azure account then you are the administrator of your subscription. If you are not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a VM and essentially copy data using Azure Site Recovery, you must have:

    1. Permissions to create a VM in Azure resources. The 'Virtual Machine Contributor' built-in role has these permissions, which include:
        - Permission to create a VM in the selected resource group
        - Permission to create a VM in the selected virtual network
        - Permission to write to the selected storage account

    2. You also need permission to manage Azure Site Recovery operations. The 'Site Recovery Contributor' role has all permissions required to manage Site Recovery operations in a Recovery Services vault.

## Prepare the source VMs

1. Check that all the latest root certificates are present on the Azure VMs you want to move. If the latest root certificates aren't present, the data copy to the target region cannot be enabled due to security constraints.

    - For Windows VMs, install all the latest Windows updates on the VM, so that all the trusted root certificates are on the machine. In a disconnected environment, follow the standard Windows Update and certificate update processes for your organization.
    - For Linux VMs, follow the guidance provided by your Linux distributor, to get the latest trusted root certificates and certificate revocation list on the VM.
2. Make sure you're not using an authentication proxy to control network connectivity for VMs you want to move.
3. If the VM you are trying to move doesn't have access to internet are is using a firewall proxy to control outbound access, please check the requirements [here](azure-to-azure-tutorial-enable-replication.md#configure-outbound-network-connectivity).
4. Identify the source networking layout and all the resources that you are currently using - including but not limited to load balancers, NSGs, public IP etc.

## Prepare the target region

1. Verify that your Azure subscription allows you to create VMs in the target region used for disaster recovery. Contact support to enable the required quota.

2. Make sure your subscription has enough resources to support VMs with sizes that match your source VMs. if you are using Site Recovery to copy data to the target, it picks the same size or the closest possible size for the target VM.

3. Ensure that you create a target resource for every component identified in the source networking layout. This is important to ensure that, post cutting over to the target region, your VMs have all the functionality & features that you had in the source.

    > [!NOTE]
    > Azure Site Recovery automatically discovers and creates a virtual network when you enable replication for the source VM, or you can also pre-create a network and assign to the VM in the user flow for enable replication. But for any other resources, as mentioned below, you need to manually create them in the target region.

     Please refer to the following documents to create the most commonly used network resources relevant for you, based on the source VM configuration.

    - [Network Security Groups](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group)
    - [Load balancers](https://docs.microsoft.com/azure/load-balancer/#step-by-step-tutorials)
    - [Public IP](https://docs.microsoft.com/azure/load-balancer/#step-by-step-tutorials)
    
    For any other networking components, refer to the networking [documentation.](https://docs.microsoft.com/azure/#pivot=products&panel=network) 

4. Manually [create a non-production network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal) in the target region if you wish to test the configuration before you perform the final cut over to the target region. This will create minimal interference with the production and is recommended.
    
## Copy data to the target region
The below steps will guide you how to use Azure Site Recovery to copy data to the target region.

### Create the vault in any region, except the source region.

1. Sign in to the [Azure portal](https://portal.azure.com) > **Recovery Services**.
2. Click **Create a resource** > **Management Tools** > **Backup and Site Recovery**.
3. In **Name**, specify the friendly name **ContosoVMVault**. If you have more than one
    a. subscription, select the appropriate one.
4. Create a resource group **ContosoRG**.
5. Specify an Azure region. To check supported regions, see geographic availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
6. In Recovery Services vaults, click **Overview** > **ConsotoVMVault** > **+Replicate**.
7. In **Source**, select **Azure**.
8. In **Source location**, select the source Azure region where your VMs are currently running.
9. Select the Resource Manager deployment model. Then select the **Source subscription** and **Source resource group**.
10. Click **OK** to save the settings.

### Enable replication for Azure VMs and start copying the data.

Site Recovery retrieves a list of the VMs associated with the subscription and resource group.

1. In the next step, . Select the VM you want to move. Then click **OK**.
3. In **Settings**, click **Disaster recovery**.
4. In **Configure disaster recovery** > **Target region** select the target region to which you'll replicate.
5. For this tutorial, accept the other default settings.
6. Click **Enable replication**. This starts a job to enable replication for the VM.

    ![enable replication](media/tutorial-migrate-azure-to-azure/settings.png)

 

## Test the configuration


1. Navigate to the vault, in **Settings** > **Replicated items**, click on the Virtual machine you intend to move to the target region, click **+Test Failover** icon.
2. In **Test Failover**, Select a recovery point to use for the failover:

   - **Latest processed**: Fails the VM over to the latest recovery point that was processed by the
     Site Recovery service. The time stamp is shown. With this option, no time is spent processing
     data, so it provides a low RTO (Recovery Time Objective)
   - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent
     recovery point. The time stamp is shown.
   - **Custom**: Select any recovery point.

3. Select the target Azure virtual network to which you want to move the Azure VMs to test the configuration. 

> [!IMPORTANT]
> We recommend that you use a separate Azure VM network for the test failure, and not the production network in teh target VM into which you want to move your VMs eventually. that was set up when you enabled replication.

4. To start testing the move, click **OK**. To track progress, click the VM to open its properties. Or,
   you can click the **Test Failover** job in the vault name > **Settings** > **Jobs** > **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual Machines**. Make sure that the VM is running, sized appropriately, and connected to the appropriate network.
6. If you wish to delete the VM created as part of testing the move, click **Cleanup test failover** on the replicated item. In **Notes**, record and save any observations associated with the test.

## Perform the move to the target region and confirm.

1.  Navigate to the vault, in **Settings** > **Replicated items**, click on the virtual machine, and then click **Failover**.
2. In **Failover**, select **Latest**. 
3. Select **Shut down machine before beginning failover**. Site Recovery attempts to shut down the source VM before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page. 
4. Once the job is complete, check that the VM appears in the target Azure region as expected.
5. In **Replicated items**, right-click the VM > **Commit**. This finishes the move process to the target region. Wait till the commit job completes.

## Discard the resource in the source region 

1. Navigate to the VM.  Click on **Disable Replication**.  This stops the process of copying the data for the VM.  

> [!IMPORTANT]
> It is important to perform this step to avoid getting charged for ASR replication.

In case you have no plans to reuse any of the source resources please proceed with the next set of steps.

1. Proceed to delete all the relevant network resources in the source region that you listed out as part of Step 4 in [Prepare the source VMs](#prepare-the-source-vms) 
2. Delete the corresponding storage account in the source region.



## Next steps

In this tutorial you moved an Azure VM to a different Azure region. Now you can configure disaster recovery for the moved VM.

> [!div class="nextstepaction"]
> [Set up disaster recovery after migration](azure-to-azure-quickstart.md)

