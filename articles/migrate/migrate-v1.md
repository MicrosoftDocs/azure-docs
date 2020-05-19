---
title: Work with the previous version of Azure Migrate 
description: Describes how to work with the previous version of Azure Migrate.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 11/19/2019
ms.author: raynew
ms.custom: mvc
---


# Work with the previous version of Azure Migrate

This article provides information about working with the previous version of Azure Migrate.


There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version**: If you're using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. If you still need to use Azure Migrate projects created in the previous version, this is what you can and can't do:
    - You can no longer create migration projects.
    - We recommend that you don't perform new discoveries.
    - You can still access existing projects.
    - You can still run assessments.
    

## Upgrade between versions

You can't upgrade projects or components in the previous version to the new version. You need to [create a new Azure Migrate project](how-to-add-tool-first-time.md), and add assessment and migration tools to it.

## Find projects from previous version

Find projects from the previous version as follows:

1. In the Azure portal > **All services**, search for and select **Azure Migrate**. 
2. On the Azure Migrate dashboard, there's a notification and a link to access old Azure Migrate projects.
3. Click the link to open v1 projects.


## Create an assessment

After VMs are discovered in the portal, you group them and create assessments.

- You can immediately create as on-premises assessments immediately after VMs are discovered in the portal.
- For performance-based assessments, we recommend you wait at least a day before creating a performance-based assessment, to get reliable size recommendations.

Create an assessment as follows:

1. In the project **Overview** page, click **+Create assessment**.
2. Click **View all** to review the assessment properties.
3. Create the group, and specify a group name.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.
6. After the assessment is created, view it in **Overview** > **Dashboard**.
7. Click **Export assessment**, to download it as an Excel file.

If you would like to update an existing assessment with the latest performance data, you can use the **Recalculate** command on the assessment to update it.

## Review an assessment 

An assessment has three stages:

- An assessment starts with a suitability analysis to figure out whether machines are compatible in Azure.
- Sizing estimations.
- Monthly cost estimation.

A machine only moves along to a later stage if it passes the previous one. For example, if a machine fails the suitability check, it’s marked as unsuitable for Azure, and sizing and costing isn't done.


### Review Azure readiness

The Azure readiness view in the assessment shows the readiness status of each VM.

**Readiness** | **State** | **Details**
--- | --- | ---
Ready for Azure | No compatibility issues. The machine can be migrated as-is to Azure, and it will boot in Azure with full Azure support. | For VMs that are ready, Azure Migrate recommends a VM size in Azure.
Conditionally ready for Azure | The machine might boot in Azure, but might not have full Azure support. For example, a machine with an older version of Windows Server that isn't supported in Azure. | Azure Migrate explains the readiness issues, and provides remediation steps.
Not ready for Azure |  The VM won't boot in Azure. For example, if a VM has a disk that's more than 4 TB, it can't be hosted on Azure. | Azure Migrate explains the readiness issues, and provides remediation steps.
Readiness unknown | Azure Migrate can't identify Azure readiness, usually because data isn't available.


#### Azure VM properties
Readiness takes into account a number of VM properties, to identify whether  the VM can run in Azure.


**Property** | **Details** | **Readiness**
--- | --- | ---
**Boot type** | BIOS supported. UEFI not supported. | Conditionally ready if boot type is UEFI.
**Cores** | Machines core <= the maximum number of cores (128) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores.<br/>If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores, without applying the comfort factor. | Ready if less than or equal to limits.
**Memory** | The machine memory size <= the maximum memory (3892 GB on Azure M series Standard_M128m&nbsp;<sup>2</sup>) for an Azure VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized memory.<br/><br/>If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history the allocated  memory is used, without applying the comfort factor.<br/><br/> | Ready if within limits.
**Storage disk** | Allocated size of a disk must be 4 TB (4096 GB) or less.<br/><br/> The number of disks attached to the machine must be 65 or less, including the OS disk. | Ready if within limits.
**Networking** | A machine must have 32 or less NICs attached to it. | Ready if within limits.

#### Guest operating system

Along with VM properties, Azure Migrate also looks at the guest OS of the on-premises VM to identify if the VM can run in Azure.

- Azure Migrate considers the OS specified in vCenter Server.
- Since the discovery done by Azure Migrate is appliance-based, it does not have a way to verify if the OS running inside the VM is same as the one specified in vCenter Server.

The following logic is used.

**Operating System** | **Details** | **Readiness**
--- | --- | ---
Windows Server 2016 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 R2 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2008 R2 and all SPs | Azure provides full support.| Ready for Azure
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure
Windows Server 2003, 2003 R2 | Out-of-support and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure, consider upgrading the OS before migrating to Azure.
Windows 2000, 98, 95, NT, 3.1, MS-DOS | Out-of-support. The machine might boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Windows Client 7, 8 and 10 | Azure provides support with [Visual Studio subscription only.](https://docs.microsoft.com/azure/virtual-machines/windows/client-images) | Conditionally ready for Azure
Windows 10 Pro Desktop | Azure provides support with [Multitenant Hosting Rights.](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment) | Conditionally ready for Azure
Windows Vista, XP Professional | Out-of-support. The machine might boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Linux | Azure endorses these [Linux operating systems](../virtual-machines/linux/endorsed-distros.md). Other Linux operating systems might boot in Azure, but we recommend upgrading the OS to an endorsed version, before migrating to Azure. | Ready for Azure if the version is endorsed.<br/><br/>Conditionally ready if the version is not endorsed.
Other operating systems<br/><br/> For example,  Oracle Solaris, Apple Mac OS etc., FreeBSD, etc. | Azure doesn't endorse these operating systems. The machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate cannot identify the OS in this case. | Unknown readiness. Ensure that the OS running inside the VM is supported in Azure.
32-bit operating systems | The machine may boot in Azure, but Azure may not provide full support. | Conditionally ready for Azure, consider upgrading the OS of the machine from 32-bit OS to 64-bit OS before migrating to Azure.


### Review sizing

 The Azure Migrate size recommendation depends on the sizing criterion specified in the assessment properties.

- If sizing is performance-based, the size recommendation considers the performance history of the VMs (CPU and memory) and disks (IOPS and throughput).
- If the sizing criterion is 'as on-premises', the size recommendation in Azure is based on the size of the VM on-premises. Disk sizing is based on the Storage type specified in the assessment properties (default is premium disks). Azure Migrate doesn't consider the performance data for the VM and disks.

### Review cost estimates

Cost estimates show the total compute and storage cost of running the VMs in Azure, along with the details for each machine.

- Cost estimates are calculated using the size recommendation for a VM machine, and its disks, and the assessment properties.
- Estimated monthly costs for compute and storage are aggregated for all VMs in the group.
- The cost estimation is for running the on-premises VM as Azure Infrastructure as a service (IaaS) VMs. Azure Migrate doesn't consider Platform as a service (PaaS), or Software as a service (SaaS) costs.

### Review confidence rating (performance-based assessment)

Each performance-based assessment is associated with a confidence rating.

- A confidence rating ranges from one-star to five-star (one-star being the lowest and five-star the highest).
- The confidence rating is assigned to an assessment, based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence rating isn't available for "as-is" on-premises assessments.

For performance-based sizing, Azure Migrate needs the following:
- Utilization data for CPU.
- VM memory data.
- For every disk attached to the VM, it needs the disk IOPS and throughput data.
- For each network adapter attached to a VM, Azure Migrate needs the network input/output.
- If any of the above aren't available, size recommendations (and thus confidence ratings) might not be reliable.


Depending on the percentage of data points available, the possible confidence ratings are summarized in the table.

**Availability of data points** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star


#### Assessment issues affecting confidence ratings

An assessment might not have all the data points available due to a number of reasons:

- You didn't profile your environment for the duration of the assessment. For example, if you create the assessment with performance duration set to one day, you must wait for at least a day after you start the discovery, or all the data points to be collected.
- Some VMs were shut down during the period for which the assessment was calculated. If any VMs were powered off for part of the duration, Azure Migrate can't collect performance data for that period.
- Some VMs were created in between during the assessment calculation period. For example, if you create an assessment using the last month's performance history, but create a number of VMs in the environment a week ago, the performance history of the new VMs won't be for the entire duration.

> [!NOTE]
> If the confidence rating of any assessment is below five-stars, wait for at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't performance-based sizing might not be reliable. If you don't want to recalculate, we recommended switching to as on-premises sizing, by changing the assessment properties.



## Create groups using dependency visualization

In addition to creating groups manually, you can create groups using dependency visualization.
- You typically use this method when you want to assess groups  with higher levels of confidence by cross-checking machine dependencies, before you run an assessment.
- Dependency visualization can help you effectively plan your migration to Azure. It helps you ensure that nothing is left behind, and that surprise outages do not occur when you are migrating to Azure.
- You can discover all interdependent systems that need to migrate together and identify whether a running system is still serving users or is a candidate for decommissioning instead of migration.
- Azure Migrate uses the Service Map solution in Azure Monitor to enable dependency visualization.

> [!NOTE]
> Dependency visualization is not available in Azure Government.

To set up dependency visualization, you associate a Log Analytics workspace with an Azure Migrate project, install agents on machines for which you want to visualize dependencies, and then create groups using dependency information. 



### Associate a Log Analytics workspace

To use dependency visualization, you associate a Log Analytics workspace with a migration project. You can only create or attach a workspace in the same subscription where the migration project is created.

1. To attach a Log Analytics workspace to a project, in **Overview**, > **Essentials**, click **Requires configuration**.
2. You can create a new workspace, or attach an existing one:
  - To create a new workspace, specify a name. The workspace is created in a region in the same [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) as the migration project.
  - When you attach an existing workspace, you can pick from all the available workspaces in the same subscription as the migration project. Only those workspaces are listed which were created in a [supported Service Map region](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites). To attach a workspace, ensure that you have 'Reader' access to the workspace.

> [!NOTE]
> You can't change the workspace associated with a migration project.

### Download and install VM agents

After you configure a workspace, you download and install agents on each on-premises machine that you want to evaluate. In addition, if you have machines with no internet connectivity, you need to download and install [Log Analytics gateway](../azure-monitor/platform/gateway.md) on them.

1. In **Overview**, click **Manage** > **Machines**, and select the required machine.
2. In the **Dependencies** column, click **Install agents**.
3. On the **Dependencies** page, download and install the Microsoft Monitoring Agent (MMA), and the Dependency agent on each VM you want to assess.
4. Copy the workspace ID and key. You need these when you install the MMA on the on-premises machine.

> [!NOTE]
> To automate the installation of agents you can use a deployment tool such as Configuration Manager or a partner tool such a, [Intigua](https://www.intigua.com/intigua-for-azure-migration), that provides an agent deployment solution for Azure Migrate.


#### Install the MMA agent on a Windows machine

To install the agent on a Windows machine:

1. Double-click the downloaded agent.
2. On the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
3. In **Destination Folder**, keep or modify the default installation folder > **Next**.
4. In **Agent Setup Options**, select **Azure Log Analytics** > **Next**.
5. Click **Add** to add a new Log Analytics workspace. Paste in the workspace ID and key that you copied from the portal. Click **Next**.

You can install the agent from the command line or using an automated method such as Configuration Manager. [Learn more](../azure-monitor/platform/log-analytics-agent.md#installation-and-configuration) about using these methods to install the MMA agent.

#### Install the MMA agent on a Linux machine

To install the agent on a Linux machine:

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer using scp/sftp.
2. Install the bundle by using the --install argument.

    ```sudo sh ./omsagent-<version>.universal.x64.sh --install -w <workspace id> -s <workspace key>```

[Learn more](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems) about the list of Linux operating systems support by MMA.

### Install the MMA agent on a machine monitored by Operations Manager

For machines monitored by System Center Operations Manager 2012 R2 or later, there is no need to install the MMA agent. Service Map integrates with the Operations Manager MMA to gather the necessary dependency data. [Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/service-map-scom#prerequisites). The Dependency agent does need to be installed.

### Install the Dependency agent

1. To install the Dependency agent on a Windows machine, double-click the setup file and follow the wizard.
2. To install the Dependency agent on a Linux machine, install as root using the following command:

    ```sh InstallDependencyAgent-Linux64.bin```

- Learn more about the [Dependency agent support](../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) for the Windows and Linux operating systems.
- [Learn more](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples) about how you can use scripts to install the Dependency agent.

>[!NOTE]
> The Azure Monitor for VMs article referenced to provide an overview of the system prerequisites and methods to deploy the Dependency agent are also applicable to the Service Map solution.

### Create a group with dependency mapping

1. After you install the agents, go to the portal and click **Manage** > **Machines**.
2. Search for the machine where you installed the agents.
3. The **Dependencies** column for the machine should now show as **View Dependencies**. Click the column to view the dependencies of the machine.
4. The dependency map for the machine shows the following details:
    - Inbound (Clients) and outbound (Servers) TCP connections to/from the machine
        - The dependent machines that do not have the MMA and dependency agent installed are grouped by port numbers.
        - The dependent machines that have the MMA and the dependency agent installed are shown as separate boxes.
    - Processes running inside the machine, you can expand each machine box to view the processes
    - Machine properties, including the FQDN, operating System, MAC address are shown. You can click on each machine box to view details.

4. You can view dependencies for different time durations by clicking on the time duration in the time range label. By default the range is an hour. You can modify the time range, or specify start and end dates, and duration.

   > [!NOTE]
   >    A time range of up to an hour is supported. Use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

5. After you've identified dependent machines that you want to group together, use Ctrl+Click to select multiple machines on the map, and click **Group machines**.
6. Specify a group name. Verify that the dependent machines are discovered by Azure Migrate.

    > [!NOTE]
    > If a dependent machine is not discovered by Azure Migrate, you can't add it to the group. To add such machines to the group, you need to run the discovery process again with the right scope in vCenter Server and ensure that the machine is discovered by Azure Migrate.  

7. If you want to create an assessment for this group, select the checkbox to create a new assessment for the group.
8. Click **OK** to save the group.

Once the group is created, it is recommended to install agents on all the machines of the group and refine the group by visualizing the dependency of the entire group.

## Query dependency data from Azure Monitor logs

Dependency data captured by Service Map is available for querying in the Log Analytics workspace associated with your Azure Migrate project. [Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#log-analytics-records) about the Service Map data tables to query in Azure Monitor logs. 

To run the Kusto queries:

1. After you install the agents, go to the portal and click **Overview**.
2. In **Overview**, go to **Essentials** section of the project and click on workspace name provided next to **OMS Workspace**.
3. On the Log Analytics workspace page, click **General** > **Logs**.
4. Write your query to gather dependency data using Azure Monitor logs. Find sample queries in the next section.
5. Run your query by clicking on Run. 

[Learn more](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal) about how to write Kusto queries. 

### Sample Azure Monitor logs queries

Following are sample queries you can use to extract dependency data. You can modify the queries to extract your preferred data points. An exhaustive list of the fields in dependency data records is available [here](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#log-analytics-records). Find more sample queries [here](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#sample-log-searches).

#### Summarize inbound connections on a set of machines

The records in the table for connection metrics, VMConnection, do not represent individual physical network connections. Multiple physical network connections are grouped into a logical connection. [Learn more](https://docs.microsoft.com/azure/azure-monitor/insights/service-map#connections) about how physical network connection data is aggregated into a single logical record in VMConnection. 

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

#### Summarize volume of data sent and received on inbound connections between a set of machines

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
[Learn about](migrate-services-overview.md) the latest version of Azure Migrate.
