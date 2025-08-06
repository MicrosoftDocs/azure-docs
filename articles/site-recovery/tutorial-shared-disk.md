---
title: Shared disks in Azure Site Recovery
description: This article describes how to enable replication, failover, and failback Azure virtual machines for shared disks.
ms.topic: concept-article
ms.service: azure-site-recovery
ms.date: 05/15/2025
ms.author: jsuri
author: jyothisuri
ms.custom:
  - build-2025
# Customer intent: As a system administrator, I want to configure disaster recovery for Azure virtual machines using shared disks, so that I can ensure cluster consistency and enable efficient failover and failback processes during outages.
---

# Set up disaster recovery for Azure virtual machines using shared disk

This article describes how to protect, monitor, fail over, and reprotect your workloads that are running on Windows Server Failover Clusters (WSFC) on Azure virtual machines using a shared disk.

Azure shared disks are a feature for Azure managed disks that allow you to attach a managed disk to multiple virtual machines simultaneously. Attaching a managed disk to multiple virtual machines allows you to either deploy new or migrate existing clustered applications to Azure.

Using Azure Site Recovery for Azure shared disks, you can replicate and recover your WSFC-clusters as a single unit throughout the disaster recovery lifecycle, while you create cluster-consistent recovery points that are consistent across all the disks (including the shared disk) of the cluster.

Using Azure Site Recovery for shared disks, you can:

- Protect your clusters. 
- Create recovery points (App and Crash) that are consistent across all the virtual machines and disks of the cluster. 
- Monitor protection and health of the cluster and all its nodes from a single page. 
- Fail over the cluster with a single click. 
- Change recovery point and reprotect the cluster after failover with a single click. 
- Fail back the cluster to the primary region with minimal data loss and downtime.

>[!Note]
>Disaster recovery for Azure virtual machines using shared disk is currently applicable only to Standard and Premium SSD v1 disks.

Follow these steps to protect shared disks with Azure Site Recovery:

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

**Before you start, ensure you have:**

- A recovery services vault. If you don't have one, [create recovery services vault](./azure-to-azure-tutorial-enable-replication.md#create-a-recovery-services-vault). 
- A virtual machine as a part of the [Windows Server Failover Cluster](/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server?view=sql-server-ver16&preserve-view=true). 


## Enable replication for shared disks

To enable replication for shared disks, follow these steps:

1. Navigate to your recovery services vault that you use for protecting your cluster. 

    > [!NOTE]
    > Recovery services vault can be created in any region except the source region of the virtual machines.

1. Select **Enable Site Recovery**.

    :::image type="content" source="media/tutorial-shared-disk/enable-site-replication.png" alt-text="Screenshot showing Enable Replication.":::

1. In the **Enable replication** page, do the following:
    1. Under the **Source** tab, 
        1. Select the **Region**, **Subscription**, and the **Resource group** your virtual machines are in.
        1. Retain values for the **Virtual machine deployment model** and **Disaster recovery between availability zone?** fields.

        :::image type="content" source="media/tutorial-shared-disk/enable-replication-source.png" alt-text="Screenshot showing Select Region.":::


    1. Under the **Virtual machines** tab, select all the virtual machines that are part of your cluster. 
        > [!NOTE]
        > - If you wish to protect multiple clusters, select all the virtual machines of all the clusters in this step.
        > - If you don't select all the virtual machines, Site Recovery prompts you to choose the ones you missed. If you continue without selecting them, then the shared disks for those machines won't be protected.    
        > - Don’t select the Active Directory virtual machines as Azure Site Recovery shared disk doesn't support Active Directory virtual machines.


        :::image type="content" source="media/tutorial-shared-disk/enable-replication-machines.png" alt-text="Screenshot showing select virtual machines.":::
 

    1. Under **Replication settings** tab, retain values for all  fields. In the **Storage** section, select **View/edit storage configuration**. 
        
        :::image type="content" source="media/tutorial-shared-disk/enable-replication-settings.png" alt-text="Screenshot showing shared disk settings.":::

 
    1. If your virtual machines have a protected shared disk, on the **Customize target settings** page > **Shared disks** tab, do the following:
        1. Verify the name and recovery disk type of the shared disks. 
        1. To enable high churn, select the *Churn for the virtual machine* option for your disk.
        1. Select **Confirm Selection**. 
    
        
        :::image type="content" source="media/tutorial-shared-disk/target-settings.png" alt-text="Screenshot showing shared disk selection.":::

    1. On the **Replication settings** page, select **Next**.
    1. Under the **Manage** tab, do the following:
        1. In the **Shared disk clusters** section, assign a **Cluster name** for the group, which is used to represent the group throughout their disaster recovery lifecycle. 
        
            **Note**: The cluster name shouldn't contain special characters (for example, \/""[]:|<>+=;,?*@&), whitespace, or begin with `_` or end with `.` or `-`. 

            :::image type="content" source="media/tutorial-shared-disk/shared-disk-cluster.png" alt-text="Screenshot showing cluster name.":::

        We recommend that you use the same name as your cluster for the ease of tracking.
    1. Under **Replication policy** section, select an appropriate replication policy and extension update settings.
    1. Review the information and select **Enable replication**.  
 
    > [!NOTE]
    > The replication gets enabled in 1-2 hours.


## Run a failover

To initiate a failover, navigate to the chosen cluster page and select **Monitoring** > **Failover** for the entire cluster.
Trigger the failover through the cluster monitoring page as you can't initiate the failover of each node separately.

Following are the two possible scenarios during a failover:

- [Recovery point is consistent across all the virtual machines](#recovery-point-is-consistent-across-all-the-virtual-machines).
- [Recovery point is consistent only for a few virtual machines](#recovery-point-is-consistent-only-for-a-few-virtual-machines).


### Recovery point is consistent across all the virtual machines

The recovery point is consistent across all the virtual machines when all the virtual machines in the cluster are available when the recovery point was taken. 

To failover to a recovery point that is consistent across all the virtual machines, follow these steps:

1. Navigate to the **Failover** page from the shared disk vault.
1. In the **Recovery point** field, select *Custom* and choose a recovery point. 
1. Retain the values in **Time span** field.
1. In the **Custom recovery point** field, select the desired time span.  

    :::image type="content" source="media/tutorial-shared-disk/recovery-point-list.png" alt-text="Screenshot showing recovery point list.":::

    > [!NOTE]
    > In the **Custom recovery point** field, the available options show the number of nodes of the cluster that were protected in a healthy state when the recovery point was taken.
1. Select **Failover**.

On failing over to this recovery point, the virtual machines come up at that same recovery point and a cluster can be started. The shared disk is also attached to all the nodes.



Once the failover is complete, the **Cluster failover** site recovery job shows all the jobs as completed.


### Recovery point is consistent only for a few virtual machines

The recovery point is consistent only for a subset of virtual machines when a few of the virtual machines in the cluster are unavailable or evicted from the cluster, down for maintenance, or shut down when a recovery point was taken. 

The virtual machines that are part of the cluster recovery point, failover at the selected recovery point with the shared disk attached to them. You can boot up the cluster in these nodes after failover.

To failover the cluster to a recovery point, follow these steps:  

1. Navigate to the **Failover** page from the shared disk vault.
1. In the **Recovery point** field, select *Custom* and choose a recovery point.
1. Retain values for the **Time span** field.
1. Select an individual recovery point for the virtual machines that are *not* part of the cluster recovery point.  
    
    These virtual machines then failover like independent virtual machines and the shared disk is attached to them. 

    :::image type="content" source="media/tutorial-shared-disk/failover-list.png" alt-text="Screenshot showing cluster recovery list."::: 

1. Select **Failover**.


Join these virtual machines back to the cluster (and shared disk) manually after validating any ongoing maintenance activity and data integrity. Once the failover is complete, the **Cluster failover** site recovery job shows all the jobs as successful.

:::image type="content" source="media/tutorial-shared-disk/cluster-failover.png" alt-text="Screenshot showing cluster recovery points.":::

## Change recovery point

After the failover, the Azure virtual machine created in the target region appears on the **Virtual machines** page. Ensure that the virtual machine is running and sized appropriately. 

If you want to use a different recovery point for the virtual machine, do the following:

1. Navigate to the virtual machine **Overview** page and select **Change recovery point**. 
    :::image type="content" source="media/tutorial-shared-disk/change-recovery-point-option.png" alt-text="Screenshot showing recovery options.":::

1. On the **Change recovery point** page, select either the lowest RTO recovery point or a custom date for the recovery point needed. 

    :::image type="content" source="media/tutorial-shared-disk/change-recovery-point-field.png" alt-text="Screenshot showing Change Recovery Point."::: 

1. Select **Change recovery point**.

    :::image type="content" source="media/tutorial-shared-disk/change-recovery-point.png" alt-text="Screenshot showing Change Recovery Point options.":::   


## Commit failover

To complete the failover, select **Commit** on the **Overview** page. This deletes seed disks with namespace ending in `-ASRReplica` from the recovery resource group.
    :::image type="content" source="media/tutorial-shared-disk/commit.png" alt-text="Screenshot showing commit.":::


## Reprotect virtual machines

Before you begin, ensure that:

- The virtual machine status is *Failover committed*. 
- You have access to the primary region and the necessary permissions to create a virtual machine. 

To reprotect the virtual machine, follow these steps:

1. Navigate to the virtual machine **Overview** page.
1. Select **Re-protect** to view protection and replication details. 
    :::image type="content" source="media/tutorial-shared-disk/reprotect.png" alt-text="Screenshot showing reprotection list.":::
1. Review the details and select **OK**.


## Monitor protection

Once the enable replication is in progress, you can view the protected cluster by navigating to the **Protected items** > **Replicated items**. 
    :::image type="content" source="media/tutorial-shared-disk/replicated-items.png" alt-text="Screenshot showing replicated items.":::


The **Replicated items** page displays a hierarchical grouping of the clusters with the *Cluster Name* you provided in the [Enable replication](#enable-replication-for-shared-disks) step.

From this page, you can monitor the protection of your cluster and its nodes, including the replication health, RPO, and replication status. You can also failover, reprotect, and disable replication actions. 

## Disable replication

To disable replication of your cluster with Azure Site Recovery, follow these steps:
 
1. Select **Cluster Monitoring** on the virtual machine **Overview** page.
1. On the **Disable Replication** page, select the applicable reason to disable protection.
1. Select **OK**. 
    
    :::image type="content" source="media/tutorial-shared-disk/disable-replication.png" alt-text="Screenshot showing disable replication.":::
 


## Next steps

Learn more about:

-  [Azure managed disk](/azure/virtual-machines/disks-shared).
-  [Support matrix for shared disk in Azure Site Recovery](./shared-disk-support-matrix.md).
