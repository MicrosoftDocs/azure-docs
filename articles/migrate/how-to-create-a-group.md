---
title: Group machines for assessment with Azure Migrate | Microsoft Docs
description: Describes how to group machines before you run an assessment with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 07/17/2019
ms.author: hamusa
---

# Create a group for assessment

This article describes how to create groups of machines for assessment with Azure Migrate: Server Assessment.

[Azure Migrate](migrate-services-overview.md) helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. 

## Grouping machines

You gather machines into groups to assess whether they're suitable for migration to Azure, and to get Azure sizing and cost estimations for them. There are a couple of ways to create groups:

- If you know the machines that need be migrated together, you can manually create the group in Azure Migrate.
- If you are not sure about the machines that need to be grouped together, you can use the dependency visualization functionality in Azure Migrate to create groups. 

> [!NOTE]
> The dependency visualization functionality is not available in Azure Government.

## Create a group manually

You can create a group at the same time that you [create an assessment](how-to-create-assessment.md).

If you want to create a group manually outside of creating an assessment, do the following:

1. In the Azure Migrate project > **Overview**, click **Assess and migrate servers**. In **Azure Migrate: Server Assessment**, click **Groups**
    - If you haven't yet added the Azure Migrate: Server Assessment tool, click to add it. [Learn more](how-to-assess.md).
    - If you haven't yet created an Azure Migrate project, [learn more](how-to-add-tool-first-time.md).

    ![Select groups](./media/how-to-create-a-group/select-groups.png)

2. Click the **Group** icon.
3. In **Create group**, specify a group name, and in **Appliance name**, select the Azure Migrate appliance you're using for machine discovery.
4. From the machine list, select the machines you want to add to the group > **Create**.

    ![Create group](./media/how-to-create-a-group/create-group.png)

You can now use this group when you [create an Azure VM assessment](how-to-create-assessment.md) or [an Azure VMware Solution (AVS) assessment](how-to-create-azure-vmware-solution-assessment.md). Note that you can create an AVS assessment on groups with only VMware VMs. 

## Refine a group with dependency mapping

Dependency mapping helps you to visualize dependencies across machines. You typically use dependency mapping when you want to assess machine groups with higher levels of confidence.
- It helps you to cross-check machine dependencies, before you run an assessment. 
- It also helps to effectively plan your migration to Azure, by ensuring that nothing is left behind, and thus avoiding surprise outages during migration.
- You can discover interdependent systems that need to migrate together, and identify whether a running system is still serving users, or is a candidate for decommissioning instead of migration.

If you've already [set up dependency mapping](how-to-create-group-machine-dependencies.md), and want to refine an existing group, do the following:

1. In the **Servers** tab, in **Azure Migrate: Server Assessment** tile, click **Groups**.
2. Click the group you want to refine.
    - If you haven't yet set up dependency mapping, the **Dependencies** column will show a **Requires installation** status. For each VM for which you want to visualize dependencies, click **Requires installation**. Install a couple of agents on each VM, before you can map the machine dependencies. [Learn more](how-to-create-group-machine-dependencies.md).

        ![Add dependency mapping](./media/how-to-create-a-group/add-dependency-mapping.png)

    - If you've already set up dependency mapping, on the group page, click **View dependencies** to open the group dependency map.

3. After clicking **View dependencies**, the group dependency map shows the following:

    - Inbound (clients) and outbound (servers) TCP connections to and from all machines in the group that have the dependency agents installed.
    - Dependent machines that don't have the dependency agents installed are grouped by port numbers.
    - Dependent machines with dependency agents installed are shown as separate boxes.
    - Processes running inside the machine. Expand each machine box to view the processes.
    - Machine properties (including FQDN, operating system, MAC address). Click on each machine box to view the details.

4. To view dependencies in a time interval of your choice, modify the time range (an hour by default) by specifying  start and end dates, or the duration.

    > [!NOTE]
    > Time range can be up to an hour. If you need a longer range, use [Azure Monitor to query dependent data](how-to-create-group-machine-dependencies.md) for a longer period.

5. After you've identified the dependencies you would like to add to or remove from the group, you can modify the group. Use Ctrl+Click to add or remove machines from the group.

    - You can only add machines that have been discovered.
    - Adding and removing machines invalidates past assessments for a group.
    - You can optionally create a new assessment when you modify the group.


## Next steps

Learn how to set up and use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.

