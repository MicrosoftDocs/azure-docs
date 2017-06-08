---
title: Replicate Azure VMs between Azure sites | Microsoft Docs
description: Summarizes the steps you need for replicating Azure VMs between Azure regions with the Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: dab98aa5-9c41-4475-b7dc-2e07ab1cfd18
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: raynew

---

# Replicate Azure VMs between regions with Azure Site Recovery

>[!NOTE]
>
> Azure Site Recovery replication for Azure virtual machines (VMs) is currently in preview.

This article describes how to replicate Azure VMs between Azure regions by using the [Site Recovery](site-recovery-overview.md) service in the Azure portal.

Post comments and questions at the bottom of this article or on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Disaster recovery in Azure

Built-in Azure infrastructure capabilities and features contribute to a robust and resilient availability strategy for workloads that run on Azure VMs. However, there are many reasons why you need to plan for disaster recovery between Azure regions yourself:

- You need to meet compliance guidelines for specific apps and workloads that require a business continuity and disaster recovery (BCDR) strategy.
- You want to protect and recover Azure VMs based on your business decisions and not only based on built-in Azure functionality.
- You need to test failover and recovery in accordance with your business and compliance needs, with no effect on production.
- You need to fail over to the recovery region in the event of a disaster and fail back to the original source region seamlessly.

Use Site Recovery for Azure-to-Azure VM replication to help you do all these tasks.


## Why use Site Recovery?      

Site Recovery provides a simple way to replicate Azure VMs between regions:

- **Automatic deployment**. Unlike an active-active replication model, there's no need for an expensive and complex infrastructure in the secondary region. When you enable replication, Site Recovery automatically creates the required resources in the target region, based on source region settings.
- **Control regions**. With Site Recovery, you can replicate from one region to any other region within a continent. Compare this capability with read-access geo-redundant storage (RA-GRS), which replicates asynchronously between standard [paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) only. RA-GRS provides read-only access to the data in the target region.
- **Automated replication**. Site Recovery provides automated continuous replication. Failover and failback can be triggered with a single click.
- **RTO and RPO**. Site Recovery takes advantage of the Azure network infrastructure that connects regions to keep RTO and RPO very low.
- **Testing**. You can run disaster-recovery drills with on-demand test failovers, as and when needed, without affecting your production workloads or ongoing replication.
- **Recovery plans**. You can use recovery plans to orchestrate failover and failback of the entire application running on multiple VMs. The recovery plan feature has rich first-class integration with Azure automation runbooks.


## Deployment summary

Here's a summary of what you need to do to set up replication of VMs between Azure regions:

1. Create a Recovery Services vault. The vault contains configuration settings and orchestrates replication.

2. Enable replication for the Azure VMs.
3. Run a test failover to make sure that everything's working as expected.

>[!IMPORTANT]
>
> You can check the [support matrix for Azure VM replication](./site-recovery-support-matrix-azure-to-azure.md).

>[!IMPORTANT]
>
> For information on how to configure the required network outbound connectivity for Azure VMs for Site Recovery replication, see the [networking guidance document](./site-recovery-azure-to-azure-networking-guidance.md).

### Before you start

* Your Azure user account needs to have certain [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) to enable replication of an Azure virtual machine.
* Your Azure subscription should be enabled to create VMs in the target location that you want to use as the disaster recovery region. You can contact support to enable the required quota.

## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

>[!NOTE]
>
> We recommend that you create the Recovery Services vault in the location where you want your VMs to replicate. For example, if your target location is the central US, create the vault in **Central US**.

## Enable replication

In **Recovery Services vaults**, click the vault name. In the vault, click the **+Replicate** button.

### Step 1. Configure the source
1. In **Source**, select **Azure - PREVIEW**.

2. In **Source location**, select the source Azure region where your VMs are currently running.
3. Select the deployment model of your VMs: **Resource Manager** or **Classic**.
4. Select the **Source resource group** for Resource Manager VMs or **cloud service** for classic VMs.

    ![Configure the source](./media/site-recovery-azure-to-azure/source.png)

### Step 2. Select the virtual machines

1. Site Recovery retrieves VMs in the resource group or the cloud service.

2. Select the VMs you want to replicate, and then click **OK**.

    ![Select VMs](./media/site-recovery-azure-to-azure/vms.png)

### Step 3. Configure the settings

By default, Site Recovery automatically creates settings in the target location by using settings that are configured in the source location. Source location settings include a target resource group, storage accounts, virtual network, and availability sets. (All the settings are created with the suffix "asr.")

1. To override the default target settings and specify the settings of your choice, click **Customize**. For more information, see [Customize target resources](site-recovery-replicate-azure-to-azure.md##customize-target-resources).

    ![Configure settings](./media/site-recovery-azure-to-azure/settings.png)


2. By default, Site Recovery creates a replication policy that takes app-consistent snapshots every 4 hours and retains recovery points for 24 hours. To create a policy with different settings, click **Customize** next to **Replication Policy**.

    ![Customize policy](./media/site-recovery-azure-to-azure/customize-policy.png)

3. To start provisioning the target resources, click **Create target resources**. Provisioning takes a minute or so. Don't close the blade during provisioning, or you'll need to start over.

4. To trigger replication of the selected VM, click **Enable replication**.

5. You can track progress of the **Enable protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**.

6. In **Settings** > **Replicated Items**, you can view the status of VMs and the initial replication progress. Click the VM to drill down into its settings.

## Run a test failover

After you set everything up, run a test failover to make sure everything is working as expected:

1. To fail over a single machine, in **Settings** > **Replicated Items**, click the VM **+Test Failover** icon.

2. To fail over a recovery plan, in **Settings** > **Recovery Plans**, right-click the plan **Test Failover**. To create a recovery plan, [follow these instructions](site-recovery-create-recovery-plans.md). 

3. In **Test Failover**, select the target Azure virtual network to which Azure VMs are connected after the failover occurs.

4. To start the failover, click **OK**. To track progress, click the VM to open its properties. Or you can click the **Test Failover** job in the vault name > **Settings** > **Jobs** > **Site Recovery jobs**.

5. After the failover finishes, the replica Azure machine appears in the Azure portal > **Virtual Machines**. Make sure that the VM is the appropriate size, that it's connected to the appropriate network, and that it's running.

6. To delete the VMs that were created during the test failover, click **Cleanup test failover** on the replicated item or the recovery plan. In **Notes**, record and save any observations associated with the test failover. 

[Learn more](site-recovery-test-failover-to-azure.md) about test failovers.


## Next steps

After you test the deployment:

- [Learn more](site-recovery-failover.md) about different types of failovers and how to run them.
- Learn more about [using recovery plans](site-recovery-create-recovery-plans.md) to reduce RTO.
