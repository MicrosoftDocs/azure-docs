---
title: Set up agentless dependency analysis in Azure Migrate Server Assessment
description:  Set up agentless dependency analysis in Azure Migrate Server Assessment.
ms.topic: how-to
ms.date: 2/24/2020
---


# Set up agentless dependency visualization 

This article describes how to set up agentless dependency analysis in Azure Migrate:Server Assessment. [Dependency analysis](concepts-dependency-visualization.md) helps you to identify and understand dependencies across machines you want to assess and migrate to Azure.


> [!IMPORTANT]
> Agentless dependency visualization is currently in preview for VMware VMs only, discovered with the Azure Migrate:Server Assessment tool.
> Features might be limited or incomplete.
> This preview is covered by customer support and can be used for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



## Before you start

- [Learn about](concepts-dependency-visualization.md#agentless-analysis) agentless dependency analysis.
- [Review](migrate-support-matrix-vmware.md#agentless-dependency-analysis-requirements) the prerequisites and support requirements for setting up agentless dependency visualization for VMware VMs
- Make sure you've [created](how-to-add-tool-first-time.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate:Server Assessment tool.
- Make sure you've set up an [Azure Migrate appliance](migrate-appliance.md) to discover your on-premises machines. Learn how to set up an appliance for [VMware](how-to-set-up-appliance-vmware.md) VMs. The appliance discovers on-premises machines, and sends metadata and performance data to Azure Migrate:Server Assessment.


## Current limitations

- Right now you can't add or remove a server from a group, in the dependency analysis view.
- A dependency map for a group of servers isn't currently not available.
- Currently, the dependency data can't be downloaded in tabular format.

## Create a user account for discovery

Set up a user account so that Server Assessment can access the VM for discovery. [Learn](migrate-support-matrix-vmware.md#agentless-dependency-analysis-requirements) about account requirements.


## Add the user account to the appliance

Add the user account to the appliance.

1. Open the appliance management app. 
2. Navigate to the **Provide vCenter details** panel.
3. In **Discover application and dependencies on VMs**, click **Add credentials**
3. Choose the **Operating system**, provide a friendly name for the account, and the **User name**/**Password**
6. Click **Save**.
7. Click **Save and start discovery**.

    ![Add VM user account](./media/how-to-create-group-machine-dependencies-agentless/add-vm-credential.png)

## Start dependency discovery

Choose the machines on which you want to enable dependency discovery.

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. Click the **Dependency analysis** icon.
3. Click **Add servers**.
3. In the **Add servers** page, choose the appliance that's discovering the relevant machines.
4. From the machine list, select the machines.
5. Click **Add servers**.

    ![Start dependency discovery](./media/how-to-create-group-machine-dependencies-agentless/start-dependency-discovery.png)

You can visualize dependencies around six hours after starting dependency discovery.

## Visualize dependencies

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. Search for the machine you want to view.
3. In the **Dependencies** column, click **View dependencies**
4. Change the time period for which you want to view the map using the **Time duration** dropdown.
5. Expand the **Client** group to list the machines with a dependency on the selected machine.
6. Expand the **Port** group to list the machines that have a dependency from the selected machine.
7. To navigate to the map view of any of the dependent machines, click on the machine name > **Load server map**

    ![Expand Server port group and load server map](./media/how-to-create-group-machine-dependencies-agentless/load-server-map.png)

    ![Expand client group ](./media/how-to-create-group-machine-dependencies-agentless/expand-client-group.png)

8. Expand the selected machine to view process-level details for each dependency.

    ![Expand server to show processes](./media/how-to-create-group-machine-dependencies-agentless/expand-server-processes.png)

> [!NOTE]
> Process information for a dependency is not always available. If it's not available, the dependency is depicted with the process marked as "Unknown process".

## Stop dependency discovery

Choose the machines on which you want to stop dependency discovery.

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. Click the **Dependency analysis** icon.
3. Click **Remove servers**.
3. In the **Remove servers** page, choose the **appliance** that is discovering the VMs on which you look to stop dependency discovery.
4. From the machine list, select the machines.
5. Click **Remove servers**.


## Next steps

[Group the machines](how-to-create-a-group.md) for assessment.
