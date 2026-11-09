---
title: Overview of executing direct server migrations in Azure Migrate portal
description: Learn how to navigate the portal to execute direct server migrations.
ms.topic: how-to
author: dhananjayanr98 
ms.author: dhananjayanr
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 11/06/2026
ms.update-cycle: 365-days
monikerRange: migrate 
Customer intent: This article is intended to guide users on leveraging the new portal for executing and tracking direct server migrations. 
---

# Direct server migrations in Azure Migrate

Azure Migrate supports two ways to execute migrations after discovery and planning:
 - **Wave migration**: Group applications and workloads into a migration wave and migrate them together.
 - **Direct migration**: Migrate selected servers without creating a wave. Direct migration supports servers only.

This article explains how to directly execute server migrations in Azure Migrate. 

## Start replication

Replication is the first step to migrate your servers to Azure. You can replicate servers discovered through **Azure Migrate appliance** or **Other sources**.

1. In Azure Migrate project, go to **Execute** > **Migrations**, and then select **Start execution**.
   
   :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/start-execution.png" alt-text="Screenshot on start execution from server replication page." lightbox="./media/end-to-end-portal-experience-server-migrations/start-execution.png":::

2. On **Specify intent** page, select **Servers** or **Virtual machines (VMs)**, and choose **Azure VM** as the target.
3. In **How do you select Workloads**:
     - If you have existing **Azure Migrate appliance sources**, select one of the following options and proceed to **Discovery method**.
          - From all inventory to manually select servers.
          - From an assessment to use an existing assessment.
     - If you plan to execute migrations directly by using **Other sources** without **Azure Migrate appliance sources**, select one of the following options and proceed to **Workloads**.
          - From a replication appliance (VMware)
          - From a replication appliance (Physical or others)
          - From replication provider (Hyper-V)  

   :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/appliance-other-sources.png" alt-text="Screenshot on how to select workloads." lightbox="./media/end-to-end-portal-experience-server-migrations/appliance-other-sources.png":::


4. Under **Discovery method**, select the Azure Migrate appliance that matches your source environment **(VMware, Hyper‑V, or Physical)**. The list shows appliances that you already installed.

   :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/specify-intent-appliance-selection.png" alt-text="Screenshot on discovery method drop-down menu." lightbox="./media/end-to-end-portal-experience-server-migrations/specify-intent-appliance-selection.png":::

    - **VMware agentless**: Select the configured Azure Migrate VMware appliance, select **Agentless migration**, and then select **Continue**.
    - **VMware agent-based**: Select the configured Azure Migrate VMware appliance and select Agent-based migration. If the replication appliance isn't already installed, use the link provided in the portal to install it. After you configure the replication appliance, select **Continue**.
    - **Hyper-V**: Select the configured Azure Migrate Hyper-V appliance. If the replication provider isn't already installed, you can install it by using the link provided on the portal. After you configure the provider by using the provided link, select **Continue**.
    - **Physical**: Select the configured Azure Migrate physical appliance. If the replication appliance isn't already installed, use the link provided in the portal to install it. After you configure the replication appliance, select **Continue**.
5. In **Workloads**, configure the required **Target security type** and then select the servers you want to migrate.
      - For **VMware agent-based and physical servers**, select the **replication appliance** you set up from the drop-down menu. If the replication appliance isn't set up, select **Set up the replication appliance** and complete the registration by following the steps from [How to set up replication appliance for agent-based migrations](tutorial-migrate-physical-virtual-machines.md#set-up-the-replication-appliance).
          
  :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/set-up-replication-appliance.png" alt-text="Screenshot on setting up replication appliance in workloads section." lightbox="./media/end-to-end-portal-experience-server-migrations/set-up-replication-appliance.png":::
    
6. Complete the remaining configuration for **Target, Compute, Disk**, and **Tags**, review your settings, and then select **Execute migration**. For more information on configuring these settings, refer the following documentation:
    - [Learn more](tutorial-migrate-vmware.md) about how to migrate your VMWare virtual Machines by using the agentless method.
    - [Learn more](tutorial-migrate-vmware-agent.md) about how to migrate your VMWare virtual machines by using the agent-based method.
    - [Learn more](tutorial-migrate-hyper-v.md) about how to migrate your Hyper-V virtual machines.
    - [Learn more](tutorial-migrate-physical-virtual-machines.md) about how to migrate your Physical or other machines by using the agent-based method.
7. When you select **Execute migration**, you start replication. Replication proceeds as follows:
    1. When the start replication job finishes successfully, servers begin their initial replication to Azure. During initial replication, a VM snapshot is created. Disk data from the snapshot is copied to replica managed disks (seed disks) in Azure.
    2. After initial replication is completed, delta sync begins. Incremental changes to the source disks are periodically synced to the replica disks in Azure. The server is marked **Ready for migration** once it reaches delta sync. 

## Track and migrate replicating servers

This section explains how to monitor replicating servers and perform test and final migrations.

1. In Azure Migrate project, go to **Manage** > **Server replication**.
2. The following columns show the replication and migration status of your servers for which you initiated replication:
    - **Replication status**: Displays the current state of replication for the server. Learn more about [replication states](concepts-vmware-agentless-migration.md#replication-states).
    - **Replication health**: Indicates whether replication is Healthy, Warning, or Critical.
    - **Last sync**: Shows when the latest replication data was synchronized to Azure.
    - **Test migration status**: Indicates the current or most recent test migration status for the replicating server or shows as **Pending**.
    - **Migration status**: Displays the current or most recent migration status for the replicating server or shows as **Ready to migrate** if the initial replication is completed.
3. **Test migration**:
    - For servers that complete initial replication and are in **Delta sync**, you can run a test migration to validate your workloads and applications in Azure before final migration. Use an isolated Azure virtual network to avoid impacting your production environment. Test migration doesn't interrupt ongoing delta replication, and you can run multiple test migrations as needed. After validation is complete, ensure to clean up the test migration resources.
      1. For the server you want to test, select the menu on the right, and then select **Test migration**.
      
       :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/test-migration-and-clean-up.png" alt-text="Screenshot on performing test and clean up test." lightbox="./media/end-to-end-portal-experience-server-migrations/test-migration-and-clean-up.png":::
   
      2. In **Test migration** page, choose the **Virtual network** and **Subnet**, and then select **Test migration**.
      3. Optionally, upgrade the OS during test migration. To perform the upgrade, select **Upgrade available** (only supported for Windows OS, currently in preview). Learn more about [Upgrading Windows OS upgrade](how-to-upgrade-windows.md).
      4. After validation is complete, select the menu on the right of the server, and then select **Clean up test migration** to remove the test VM and associated resources.

1. **Migration**:
    - Servers that are ready for migration show as **Ready to migrate** under the column **Migration status**.
    - To perform migration for these servers, select **Migrate** in the **Server replication** page.
    - In the **Migrate** page,
       1. Select the servers you want to migrate.
       2. Optionally, select the **Target OS** if you want to upgrade the OS (only supported for Windows OS, currently in preview). Learn more about [Upgrading Windows OS upgrade](how-to-upgrade-windows.md).
       3. Choose to shut down virtual machines if you want to perform a planned migration with no data loss.
       4. After configuring the above settings, select **Migrate**.
  
2. View the status and migration completion time for migrated servers in the **Migration status** column.

3. **Optional replication actions**:
   The following actions are optional and needed only for specific replication or recovery scenarios. You can access them from the menu for each server.
     - **Pause replication**: Temporarily pauses replication for the server. Use this option to free up replication resources for higher-priority servers. Available only when the server is in **Delta sync**.
     - **Resume replication**: Resumes replication for a server that was previously paused.
     - **Stop replication**: Stops replication for the server when you no longer want to replicate or migrate it.
     - **Repair replication**: Repairs replication when the server encounters issues that require the replication configuration to be recovered.
     - **Complete migration**: Stops replication, and cleans up temporary migration resources after you verify that the migrated Azure VM is working as expected.
     - **Resynchronize**: Resynchronizes the server when replication needs to be re-established to bring the replica back in sync with the source.
  
  >[!NOTE]
> - **Pause replication**, **Resume replication**, **Complete migration**, and **Repair replication** are only supported for agentless migrations.
> - **Resynchronize** is only supported for agent-based migrations.
   
## Related content

- [Learn more](server-migrate-overview.md) about different migration methods in Azure Migrate.
