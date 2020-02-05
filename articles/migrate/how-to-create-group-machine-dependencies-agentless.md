---
title: Group machines in Azure Migrate using agentless dependency visualization
description: Describes how to create groups using machine dependencies in an agentless manner.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 11/18/2019
ms.author: hamusa
---


# Set up agentless dependency visualization for assessment

This article describes how to set up agentless dependency mapping in Azure Migrate: Server Assessment. 

> [!IMPORTANT]
> Agentless dependency visualization is currently in preview for Azure VMware VMs discovered using an Azure Migrate appliance.
> Certain features might not be supported or might have constrained capabilities. This preview is covered by customer support and can be used for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## About dependency mapping

Dependency mapping helps you to visualize dependencies across machines that you want to assess and migrate. You typically use dependency mapping when you want to assess machines with higher levels of confidence.

- In Azure Migrate: Server Assessment, you gather machines together into groups for assessment. Groups usually consist of machines that you want to migrate together, and dependency mapping helps you to cross-check machine dependencies, so that you can group machines accurately.
- Using mapping, you can discover interdependent systems that need to migrate together. You can also identify whether a running system is still serving users, or is a candidate for decommissioning instead of migration.
- Visualizing dependencies helps ensure that nothing is left behind, and avoid surprise outages during migration.

## About agentless visualization

Agentless dependency visualization doesn't require you to install any agents on machines. It works by capturing the TCP connection data from machines for which it's enabled.

- After dependency discovery is started, the appliance gathers data from machines at a polling interval of five minutes.
- The following data is collected:
    - TCP connections
    - Names of processes that have active connections
    - Names of installed applications that run the above processes
    - No. of connections detected at every polling interval

## Current limitations

- Agentless dependency visualization is currently available for VMware VMs only.
- Right now you can't add or remove a server from a group, in the dependency analysis view.
- Dependency map for a group of servers is currently not available.
- Currently, the dependency data cannot be downloaded in tabular format.

## Before you start

- Make sure you've [created](how-to-add-tool-first-time.md) an Azure Migrate project.
- The agentless dependency analysis is currently available only for VMware machines.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Server Assessment tool.
- Make sure you have discovered your VMware machines in Azure Migrate; you can do this by setting up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md). The appliance discovers on-premises machines, and sends metadata and performance data to Azure Migrate: Server Assessment. [Learn more](migrate-appliance.md).
- [Review the requirements](migrate-support-matrix-vmware.md#agentless-dependency-visualization) for setting up agentless dependency visualization.



## Create a user account for discovery

Set up a user account that has the required permissions so that Server Assessment can access the VM for discovery. You can specify one user account.

- **Required permission on Windows VMs**: The user account requires 'Guest' access.
- **Required permission on Linux VMs**: The root privilege is required on the account. Alternately, the user account requires these two capabilities on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.

## Add the user account to the appliance

You need to add the user account to the appliance.

Add the account as follows:

1. Open the appliance management app. Navigate to the **Provide vCenter details** panel.
2. In the **Discover application and dependencies on VMs** section, click **Add credentials**
3. Choose the **Operating system**.
4. Provide a friendly name for the account.
5. Provide the **User name** and **Password**
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

You will be able to visualize dependencies 6 hours after starting dependency discovery.

## Visualize dependencies

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. Search for the machine for which you want to view the dependency map.
3. Click **View dependencies** in the **Dependencies** column.
4. Change the time period for which you want to view the map using the **Time duration** dropdown.
5. Expand the **Client** group to list the machines that have a dependency on the selected machine.
6. Expand the **Port** group to list the machines that have a dependency from the selected machine.
7. To navigate to the map view of any of the dependent machines, click on the machine name, and then click **Load server map**

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

[Group the machines](how-to-create-a-group.md)
