---
title: Group machines using machine dependencies with Azure Migrate | Microsoft Docs
description: Describes how to create an assessment using machine dependencies with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 10/01/2019
ms.author: hamusa
---


# Set up dependency visualization for assessment

This article describes how to set up dependency mapping in Azure Migrate: Server Assessment.

Dependency mapping helps you to visualize dependencies across machines you want to assess and migrate.

- In Azure Migrate: Server Assessment, you gather machines together for assessment. Usually machines that you want to migrate together.
- You typically use dependency mapping when you want to assess groups with higher levels of confidence.
- Dependency mapping helps you to cross-check machine dependencies, before you run an assessment and migration.
- Mapping and visualizing dependencies helps to effectively plan your migration to Azure. It helps ensure that nothing is left behind, thus avoiding surprise outages during migration.
- Using mapping, you can discover interdependent systems that need to migrate together. You can also identify whether a running system is still serving users, or is a candidate for decommissioning instead of migration.

[Learn more](concepts-dependency-visualization.md#how-does-it-work) about dependency visualization.

## Before you start

- Make sure you've [created](how-to-add-tool-first-time.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Server Assessment tool.
- Make sure you have discovered your machines in Azure Migrate; you can do this by setting up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md). The appliance discovers on-premises machines, and sends metadata and performance data to Azure Migrate: Server Assessment. [Learn more](migrate-appliance.md).


**Features** | **Note**
--- | ---
Availability | Dependency visualization isn't available in Azure Government.
Service Map | Dependency visualization uses Service Map solution in Azure Monitor. [Service Map](../azure-monitor/insights/service-map.md) automatically discovers and shows connections between servers.
Agents | To use dependency visualization, install the following agents on machines you want to map:<br/> - [Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md) agent (previously referred to as the Microsoft Monitoring Agent (MMA).<br/> - [Service Map Dependency agent](../azure-monitor/insights/vminsights-enable-overview.md#the-microsoft-dependency-agent).<br/><br/> To automate agent installation you can use a deployment tool such as Configuration Manager, that has an agent deployment solution for Azure Migrate.
Dependency agent | Review [Dependency agent support](../azure-monitor/insights/vminsights-enable-overview.md#the-microsoft-dependency-agent) for Windows and Linux.<br/><br/> [Learn more](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples) about using scripts to install the Dependency agent.
Log Analytics agent (MMA) | [Learn more](../azure-monitor/platform/log-analytics-agent.md#install-and-configure-agent) about MMA installation methods.<br/><br/> For machines monitored by System Center Operations Manager 2012 R2 or later, you don't need to install the MMA agent. Service Map integrates with Operations Manager. You can enable the integration using the guidance [here](https://docs.microsoft.com/azure/azure-monitor/insights/service-map-scom#prerequisites). Note, however, that the Dependency agent will need to installed on these machines.<br/><br/> [Review](../azure-monitor/platform/log-analytics-agent.md#supported-linux-operating-systems) the Linux operating systems supported by the Log Analytics agent.
Assessment groups | Groups for which you want to visualize dependencies shouldn't contain more than 10 machines. If you have more than 10 machines, split them into smaller groups to visualize dependencies.

## Associate a Log Analytics workspace

To use dependency visualization, you need to associate a [Log Analytics workspace](../azure-monitor/platform/manage-access.md) with an Azure Migrate project.

- You can attach a workspace in the Azure Migrate project subscription only.
- You can attach an existing workspace, or create a new one.
- You attach the workspace the first time that you set up dependency visualization for a machine.
- You can attach a workspace only after discovering machines in the Azure Migrate project. You can do this by setting up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md). The appliance discovers on-premises machines, and sends metadata and performance data to Azure Migrate: Server Assessment. [Learn more](migrate-appliance.md).

Attach a workspace as follows:

1. In **Azure Migrate: Server Assessment**, click **Overview**. If you haven't yet added the Server Assessment tool, [do that first](how-to-assess.md).
2. In **Overview**, click the down arrow to expand **Essentials**.
3. In **OMS Workspace**, click **Requires configuration**.
4. In **Configure workspace**, specify whether you want to create a new workspace, or use an existing one:

    ![Add workspace](./media/how-to-create-group-machine-dependencies/workspace.png)

    - After you specify a name for a new workspace, you can choose the [region](https://azure.microsoft.com/global-infrastructure/regions/) in which the workspace will be created.
    - When you attach an existing workspace, you can pick from all the available workspaces in the same subscription as the migration project.
    - You need Reader access to the workspace to be able to attach it.
    - You can't modify the workspace associated with a project after it's attached.

## Download and install the VM agents

Download and install the agents on each on-premises machine that you want to visualize with dependency mapping.

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. For each machine for which you want to use dependency visualization, click **Requires agent installation**.
3. In the **Dependencies** page for a machine > **Download and install MMA**, download the appropriate agent, and install it as described below.
4. In **Download and install Dependency agent**, download the appropriate agent, and install it as described below.
5. Under **Configure MMA agent**, copy the workspace ID and key. You need these when you install the MMA agent.

### Install the MMA

#### Install the agent on a Windows machine

To install the agent on a Windows machine:

1. Double-click the downloaded agent.
2. On the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
3. In **Destination Folder**, keep or modify the default installation folder > **Next**.
4. In **Agent Setup Options**, select **Azure Log Analytics** > **Next**.
5. Click **Add** to add a new Log Analytics workspace. Paste in the workspace ID and key that you copied from the portal. Click **Next**.

You can install the agent from the command line or using an automated method such as Configuration Manager or [Intigua](https://go.microsoft.com/fwlink/?linkid=2104196). [Learn more](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) about using these methods to install the MMA agent. The MMA agent can also be installed using this [script](https://go.microsoft.com/fwlink/?linkid=2104394).

[Learn more](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#supported-windows-operating-systems) about the Windows operating systems supported by MMA.

#### Install the agent on a Linux machine

To install the agent on a Linux machine:

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer using scp/sftp.
2. Install the bundle by using the --install argument.

    ```sudo sh ./omsagent-<version>.universal.x64.sh --install -w <workspace id> -s <workspace key>```

[Learn more](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#supported-linux-operating-systems) about the list of Linux operating systems support by MMA. 

### Install the Dependency agent
1. To install the Dependency agent on a Windows machine, double-click the setup file and follow the wizard.
2. To install the Dependency agent on a Linux machine, install as root using the following command:

    ```sh InstallDependencyAgent-Linux64.bin```

[Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-enable-hybrid-cloud#installation-script-examples) about how you can use scripts to install the Dependency agent.

[Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-enable-overview#supported-operating-systems) about the operating systems supported by the Dependency agent.


## Create a group using dependency visualization

1. In **Azure Migrate: Server Assessment**, click **Discovered servers**.
2. In the **Dependencies** column, click **View dependencies** for each machine you want to review.
3. On the dependency map, you can see the following:
    - Inbound (clients) and outbound (servers) TCP connections, to and from the machine.
    - Dependent machines that don't have the dependency agents installed are grouped by port numbers.
    - Dependent machines with dependency agents installed are shown as separate boxes.
    - Processes running inside the machine. Expand each machine box to view the processes.
    - Machine properties (including FQDN, operating system, MAC address). Click on each machine box to view the details.

4. You can look at dependencies for different time durations by clicking on the time duration in the time range label. By default the range is an hour. You can modify the time range, or specify start and end dates, and duration.

    > [!NOTE]
    > Time range can be up to an hour. If you need a longer range, use Azure Monitor to query dependent data for a longer period.

5. After you've identified the dependent machines that you want to group together, use Ctrl+Click to select multiple machines on the map, and click **Group machines**.
6. Specify a group name.
7. Verify that the dependent machines are discovered by Azure Migrate.

    - If a dependent machine isn't discovered by Azure Migrate: Server Assessment, you can't add it to the group.
    - To add a machine, run discovery again, and verify that the machine is discovered.

8. If you want to create an assessment for this group, select the checkbox to create a new assessment for the group.
8. Click **OK** to save the group.

After creating the group, we recommend that you install agents on all the machines in the group, and then visualize dependencies for the entire group.

## Query dependency data in Azure Monitor

You can query dependency data captured by Service Map in the Log Analytics workspace associated with your Azure Migrate project. Log Analytics is used to write and run Azure Monitor log queries.

- [Learn how to](../azure-monitor/insights/service-map.md#log-analytics-records) search for Service Map data in Log Analytics.
- [Get an overview](../azure-monitor/log-query/get-started-queries.md)  of writing log queries in [Log Analytics](../azure-monitor/log-query/get-started-portal.md).

Run a query for dependency data as follows:

1. After you install the agents, go to the portal and click **Overview**.
2. In **Azure Migrate: Server Assessment**, click **Overview**. Click the down arrow to expand **Essentials**.
3. In **OMS Workspace**, click the workspace name.
3. On the Log Analytics workspace page > **General**, click **Logs**.
4. Write your query, and click **Run**.

### Sample queries

We provide a number sample queries you can use to extract dependency data.

- You can modify the queries to extract your preferred data points.
- [Review](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#log-analytics-records) a complete list of dependency data records.
- [Review](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#sample-log-searches) additional sample queries.

#### Sample: Review inbound connections

Review inbound connections for a set of VMs.

- The records in the table for connection metrics (VMConnection) don't represent individual physical network connections.
- Multiple physical network connections are grouped into a logical connection.
- [Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#connections) about how physical network connection data is aggregated in VMConnection.

```
// the machines of interest
let ips=materialize(ServiceMapComputer_CL
| summarize ips=makeset(todynamic(Ipv4Addresses_s)) by MonitoredMachine=ResourceName_s
| mvexpand ips to typeof(string));
let StartDateTime = datetime(2019-03-25T00:00:00Z);
let EndDateTime = datetime(2019-03-30T01:00:00Z);
VMConnection
| where Direction == 'inbound'
| where TimeGenerated > StartDateTime and TimeGenerated  < EndDateTime
| join kind=inner (ips) on $left.DestinationIp == $right.ips
| summarize sum(LinksEstablished) by Computer, Direction, SourceIp, DestinationIp, DestinationPort
```

#### Sample: Summarize sent and received data

This sample summarizes the volume of data sent and received on inbound connections between a set of machines.

```
// the machines of interest
let ips=materialize(ServiceMapComputer_CL
| summarize ips=makeset(todynamic(Ipv4Addresses_s)) by MonitoredMachine=ResourceName_s
| mvexpand ips to typeof(string));
let StartDateTime = datetime(2019-03-25T00:00:00Z);
let EndDateTime = datetime(2019-03-30T01:00:00Z);
VMConnection
| where Direction == 'inbound'
| where TimeGenerated > StartDateTime and TimeGenerated  < EndDateTime
| join kind=inner (ips) on $left.DestinationIp == $right.ips
| summarize sum(BytesSent), sum(BytesReceived) by Computer, Direction, SourceIp, DestinationIp, DestinationPort
```

## Next steps

[Create an assessment](how-to-create-assessment.md) for a group.
