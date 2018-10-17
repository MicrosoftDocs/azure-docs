---
title: Group machines using machine dependencies with Azure Migrate | Microsoft Docs
description: Describes how to create an assessment using machine dependencies with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 09/21/2018
ms.author: raynew
---


# Group machines using machine dependency mapping

This article describes how to create a group of machines for [Azure Migrate](migrate-overview.md) assessment by visualizing dependencies of machines. You typically use this method when you want to assess groups of VMs with higher levels of confidence by cross-checking machine dependencies, before you run an assessment. Dependency visualization can help you effectively plan your migration to Azure. It helps you ensure that nothing is left behind and surprise outages do not occur when you are migrating to Azure. You can discover all interdependent systems that need to migrate together and identify whether a running system is still serving users or is a candidate for decommissioning instead of migration.


## Prepare for dependency visualization
Azure Migrate leverages Service Map solution in Log Analytics to enable dependency visualization of machines.

### Associate a Log Analytics workspace
To leverage dependency visualization, you need to associate a Log Analytics workspace, either new or existing, with an Azure Migrate project. You can only create or attach a workspace in the same subscription where the migration project is created.

- To attach a Log Analytics workspace to a project, in **Overview**, go to **Essentials** section of the project click **Requires configuration**

    ![Associate Log Analytics workspace](./media/concepts-dependency-visualization/associate-workspace.png)

- When you create a new workspace, you need to specify a name for the workspace. The workspace is then created in the same subscription as the migration project and in a region in the same [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) as the migration project.
- The **Use existing** option lists only those workspaces that are created in regions where Service Map is available. If you have a workspace in a region where Service Map is not available, it will not be listed in the drop-down.

> [!NOTE]
> You cannot change the workspace associated to a migration project.

### Download and install the VM agents
Once you configure a workspace, you need to download and install agents on each on-premises machine that you want to evaluate. In addition, if you have machines with no internet connectivity, you need to download and install [OMS gateway](../log-analytics/log-analytics-oms-gateway.md) on them.

1. In **Overview**, click **Manage** > **Machines**, and select the required machine.
2. In the **Dependencies** column, click **Install agents**.
3. On the **Dependencies** page, download and install the Microsoft Monitoring Agent (MMA), and the Dependency agent on each VM you want to evaluate.
4. Copy the workspace ID and key. You need these when you install the MMA on the on-premises machine.

> [!NOTE]
> To automate the installation of agents you can use any deployment tool like System Center Configuration Manager or use our partner tool, [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration), that has an agent deployment solution for Azure Migrate.

### Install the MMA

To install the agent on a Windows machine:

1. Double-click the downloaded agent.
2. On the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
3. In **Destination Folder**, keep or modify the default installation folder > **Next**.
4. In **Agent Setup Options**, select **Azure Log Analytics** > **Next**.
5. Click **Add** to add a new Log Analytics workspace. Paste in the workspace ID and key that you copied from the portal. Click **Next**.

[Learn more](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems) about the list of Windows operating systems support by MMA.

To install the agent on a Linux machine:

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer using scp/sftp.
2. Install the bundle by using the --install argument.

    ```sudo sh ./omsagent-<version>.universal.x64.sh --install -w <workspace id> -s <workspace key>```

[Learn more](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems) about the list of Linux operating systems support by MMA.

### Install the Dependency agent
1. To install the Dependency agent on a Windows machine, double-click the setup file and follow the wizard.
2. To install the Dependency agent on a Linux machine, install as root using the following command:

    ```sh InstallDependencyAgent-Linux64.bin```

Learn more about the Dependency agent support for the [Windows](../monitoring/monitoring-service-map-configure.md#supported-windows-operating-systems) and [Linux](../monitoring/monitoring-service-map-configure.md#supported-linux-operating-systems) operating systems.

[Learn more](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#installation-script-examples) about how you can use scripts to install the Dependency agent.

## Create a group

1. After you install the agents, go to the portal and click **Manage** > **Machines**.
2. Search for the machine where you installed the agents.
3. The **Dependencies** column for the machine should now show as **View Dependencies**. Click the column to view the dependencies of the machine.
4. The dependency map for the machine shows the following details:
    - Inbound (Clients) and outbound (Servers) TCP connections to/from the machine
        - The dependent machines that do not have the MMA and dependency agent installed are grouped by port numbers
        - The dependent machines that have the MMA and the dependency agent installed are shown as separate boxes
    - Processes running inside the machine, you can expand each machine box to view the processes
    - Properties like Fully Qualified Domain Name, Operating System, MAC Address etc. of each machine, you can click on each machine box to view these details

 ![View machine dependencies](./media/how-to-create-group-machine-dependencies/machine-dependencies.png)

4. You can look at dependencies for different time durations by clicking on the time duration in the time range label. By default the range is an hour. You can modify the time range, or specify start and end dates, and duration.
5. After you've identified dependent machines that you want to group together, use Ctrl+Click to select multiple machines on the map, and click **Group machines**.
6. Specify a group name. Verify that the dependent machines are discovered by Azure Migrate.

    > [!NOTE]
    > If a dependent machine is not discovered by Azure Migrate, you cannot add it to the group. To add such machines to the group, you need to run the discovery process again with the right scope in vCenter Server and ensure that the machine is discovered by Azure Migrate.  

7. If you want to create an assessment for this group, select the checkbox to create a new assessment for the group.
8. Click **OK** to save the group.

Once the group is created, it is recommended to install agents on all the machines of the group and refine the group by visualizing the dependency of the entire group.

## Next steps

- [Learn more](https://docs.microsoft.com/azure/migrate/resources-faq#dependency-visualization) about the FAQs on dependency visualization.
- [Learn how](how-to-create-group-dependencies.md) to refine the group by visualizing group dependencies.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
