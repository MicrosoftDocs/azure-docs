---
title: Overview of executing server migrations in Azure Migrate portal
description: Learn how to navigate the portal to execute server migrations.
ms.topic: how-to
author: dhananjayanr98 
ms.author: dhananjayanr
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 03/13/2026
monikerRange: migrate 
Customer intent: This article is intended to guide users on leveraging the new portal for executing and tracking server migrations. 
---

# Execute server migrations in Azure Migrate portal

Azure Migrate provides an enhanced portal experience for migrations that streamlines the end‑to‑end, application‑aware migration journey. In this article, you learn how to navigate the portal to complete the following activities for migrations:

- Start migration for servers.
- Track migration progress across the **Preparation**, **Testing**, and **Completion** stages and perform required actions at each stage.

## Execute migrations

This section explains how to start execution for your servers discovered through using the **Azure Migrate appliance sources** or **Other sources**. To get the most out of Azure Migrate, complete discovery by using Azure Migrate appliance sources. This approach enables the full suite of capabilities, including software inventory discovery, application dependency mapping, ROI and assessments, and migration wave planning. It also provides a complete end-to-end migration experience.

1. In Azure Migrate project, go to **Execute** > **Migrations**, and then select **Start execution**.
   
   :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/start-execution.png" alt-text="Screenshot on start execution from migrations page." lightbox="./media/end-to-end-portal-experience-server-migrations/start-execution.png":::

2. On **Specify intent** page, select **Servers** or **Virtual machines (VMs)**, and choose **Azure VM** as the target.
3. In **How do you select Workloads**:
     - If you have existing **Azure Migrate appliance sources**, select one of the following options and proceed to **Discovery method**.
          - From all inventory to manually select servers.
          - From an assessment to use an existing assessment.
     - If you plan to execute migrations directly by using **Other sources** without **Azure Migrate appliance sources**, select one of the following options and proceed to **Workloads**.
          - From a replication appliance (VMware)
          - From a replication appliance (Physical or others)
          - From replication provider (Hyper-V)
4. Under **Discovery method**, select the Azure Migrate appliance that matches your source environment **(VMware, Hyper‑V, or Physical)**. The list shows appliances that you already installed.

   :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/specify-intent-appliance-selection.png" alt-text="Screenshot on discovery method drop-down menu." lightbox="./media/end-to-end-portal-experience-server-migrations/specify-intent-appliance-selection.png":::

    - **VMware agentless**: Select the configured Azure Migrate VMware appliance, select **Agentless migration**, and then select **Continue**.
    - **VMware agent-based**: Select the configured Azure Migrate VMware appliance and select Agent-based migration. If the replication appliance isn't already installed, use the link provided in the portal to install it. After you configure the replication appliance, select **Continue**.
    - **Hyper-V**: Select the configured Azure Migrate Hyper-V appliance. If the replication provider isn't already installed, you can install it by using the link provided on the portal. After you configure the provider by using the provided link, select **Continue**.
    - **Physical**: Select the configured Azure Migrate physical appliance. If the replication appliance isn't already installed, use the link provided in the portal to install it. After you configure the replication appliance, select **Continue**.
5. In **Workloads**, configure the required **Target security type** and then select the servers you want to migrate.
      - For **VMware agent-based and physical servers**, select the **replication appliance** you set up from the drop-down menu. If the replication appliance isn't set up, select **Set up the replication appliance** and complete the registration by following the steps from [How to set up replication appliance for agent-based migrations](tutorial-migrate-physical-virtual-machines.md#set-up-the-replication-appliance).
          
  :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/set-up-replication-appliance.png" alt-text="Screenshot on setting up replication appliance in workloads section." lightbox="./media/end-to-end-portal-experience-server-migrations/set-up-replication-appliance.png":::
    
6. Complete the remaining configuration for **Target, Compute, Disk**, and **Tags**, review your settings, and then select **Execute migration**. 

## Track migrations

This section explains how to track server migrations.

1. In Azure Migrate project, go to **Execute** > **Migrations**. Use **View by applications** or **View by workloads** to switch how items are grouped.
2. Execution progress is shown in **Execution stage** and **Execution status**:
    - **Execution stage**: Preparation, Testing, or Completion.
    - **Execution status**: In progress, In error, Action pending, or Completed.
      
      :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/tracking-migrations-status-stage.png" alt-text="Screenshot on tracking stage and status." lightbox="./media/end-to-end-portal-experience-server-migrations/tracking-migrations-status-stage.png":::    

3. The Execution progress is tracked across three stages in the Execution stage:
   
      :::image type="content" source="./media/end-to-end-portal-experience-server-migrations/tracking-migrations-drilldown.png" alt-text="Screenshot on migrations drill down." lightbox="./media/end-to-end-portal-experience-server-migrations/tracking-migrations-drilldown.png":::
   
    1. **Preparation**:
       - Servers that are enabled for replication remain in the Preparation stage while initial replication (data replication) is in progress.
       - If needed, you can perform **Stop replication** and **Start replication** operations in this stage by using the options available in the server drill-down menu.
       - After initial replication is complete, the servers move to the **Testing** stage.
    2. **Testing**:
       - Servers for which initial replication is complete and delta replication is in progress move to the **Testing** stage.
       - You can choose to perform test migrations on a test virtual network before the actual migration (recommended).
       - You can skip the **Testing** stage and start migration directly by using the actions available in the **Completion** drop-down menu.
    3. **Completion**:
       - Servers for which test migrations are completed or skipped move to this stage. You can perform final migrations (Cutover) for these servers.
       - After migration is completed, perform **Complete migration** to clean up the migration resources by using the drop-downs available in the server drill-down blade.


## Related content

- [Learn more](server-migrate-overview.md) about different migration methods in Azure Migrate.
- [Learn more](tutorial-migrate-vmware.md) on how to migrate your VMWare Virtual Machines using Agentless method.
- [Learn more](tutorial-migrate-vmware-agent.md) on how to migrate your VMWare Virtual Machines using Agent-based method.
- [Learn more](tutorial-migrate-hyper-v.md) on how to migrate your Hyper-V Virtual Machines.
- [Learn more](tutorial-migrate-physical-virtual-machines.md) on how to migrate your Physical or other machines using the Agent-based method.
