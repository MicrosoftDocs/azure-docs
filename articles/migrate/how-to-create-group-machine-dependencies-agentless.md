---
title: Set up Agentless Dependency Analysis in Azure Migrate
description:  Learn how to set up agentless dependency analysis in Azure Migrate for efficient server discovery and migration.
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: how-to
ms.date: 08/28/2025
ms.reviewer: v-uhabiba
ms.custom:
  - engagement-fy25
  - sfi-image-nochange
# Customer intent: As an IT administrator, I want to set up agentless dependency analysis using Azure Migrate, so that I can automatically identify and visualize server dependencies to facilitate smoother assessment and migration to the cloud.
---


# Analyze server dependencies (agentless)

This article describes how to set up agentless dependency analysis using Azure Migrate: Discovery and assessment tool. [Dependency analysis](concepts-dependency-visualization.md) helps you to identify and understand dependencies across servers for assessment and migration to Azure.

::: moniker range="migrate"
 > [!Note]
 > In this article, you'll explore the new experience with agentless dependency analysis. You should continue only if you've upgraded to the new experience by following these [prerequisites](./how-to-create-group-machine-dependencies-agentless.md#switch-to-new-visualization).
::: moniker-end

::: moniker range="migrate-classic"
## Current limitations

- In the dependency analysis view, currently you can't add or remove a server from a group.
- A dependency map for a group of servers isn't currently available.
::: moniker-end

::: moniker range="migrate"

## What's New?

- Dependency analysis runs automatically on 1,000 servers discovered by each Azure Migrate appliance that passes the prerequisite checks. You don’t need to enable it manually anymore.
- The enhanced dependency visualization helps you review additional information about the servers, connections, and processes. You can filter the view by process type to analyze key dependencies in the visualization.
- In the new visualization, after identifying key dependencies, you can group servers into an application by tagging them.
::: moniker-end

## Before you start

::: moniker range="migrate"
The existing users can follow steps provided [here](how-to-create-group-machine-dependencies-agentless.md#switch-to-new-visualization)
::: moniker-end

The new users need to follow the below steps:

1. Ensure that you've [created a project](./create-manage-projects.md) with the Azure Migrate: Discovery and assessment tool added to it.
1. Review the requirements based on your environment and the appliance you're setting up to perform agentless dependency analysis:


    |**Environment** | **Requirements**|
    |--- | --- |
    |Servers running in VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware)<br/> <br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements) <br/> <br/> Review [agentless dependency analysis requirements](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless)|
    |Servers running in Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v)<br/> <br/> <br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access)<br/>  <br/> <br/>Review [agentless dependency analysis requirements](migrate-support-matrix-hyper-v.md#dependency-analysis-requirements-agentless)|    
    |Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements) <br/> <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical)<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access)<br/> <br/> Review [agentless dependency analysis requirements](migrate-support-matrix-physical.md#dependency-analysis-requirements-agentless)|

1. Review the Azure URLs that the appliance needs to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).


## Deploy and configure the Azure Migrate appliance

1. Deploy the Azure Migrate appliance to start discovery. To deploy the appliance, you can use the [deployment method](migrate-appliance.md#deployment-methods) as per your environment. After deploying the appliance, you need to register it with the project and configure it to initiate the discovery.
1. When you set up the appliance, you specify the following in the appliance configuration manager:
    - The details of the source environment (vCenter Server(s)/Hyper-V host(s) or cluster(s)/physical servers) which you want to discover.
    - Server credentials, which can be domain/ Windows (nondomain)/ Linux (nondomain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
    - Verify the permissions required to perform agentless dependency analysis. For Windows servers, you need to provide domain or nondomain (local) account with administrative permissions. For Linux servers, provide a sudo user account with permissions to execute ls and netstat commands or create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files. If you're providing a sudo user account, ensure that NOPASSWD is enabled for the account so commands can run without prompting for a password each time.

### Add credentials and initiate discovery

1. Go to the appliance configuration manager, complete the prerequisite checks and registration of the appliance.

2. Navigate to the **Manage credentials and discovery sources** panel.

3. In **Step 1: Provide credentials for discovery source**, select on **Add credentials** to  provide credentials for the discovery source that the appliance uses to discover servers running in your environment.

4. In **Step 2: Provide discovery source details**, select **Add discovery source** to select the friendly name for credentials from the dropdown, specify the **IP address/FQDN** of the discovery source.


:::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="The screenshot shows the panel 3 on appliance configuration manager for vCenter Server details." lightbox="./media/tutorial-discover-vmware/appliance-manage-sources.png":::

5. In **Step 3: Provide server credentials to perform software inventory and agentless dependency analysis**, select **Add credentials** to provide multiple server credentials to perform guest-based discovery like software inventory, agentless dependency analysis, and discovery of databases and web applications.

6. Select on **Start discovery**, to initiate discovery.

After the server discovery is complete, appliance initiates the discovery of installed applications, roles, and features (software inventory) on the servers. During software inventory, the discovered servers are validated to check if they meet the prerequisites and can be enabled for agentless dependency analysis.
 
::: moniker range="migrate"
 > [!Note]
 > Agentless dependency analysis feature is automatically enabled for the discovered servers when the prerequisite checks are successful. Unlike before, you no longer need to manually enable this feature on servers.
::: moniker-end

::: moniker range="migrate-classic" 
After servers are enabled for agentless dependency analysis, appliance collects dependency data from the server every 5 mins. It then sends a combined data point every six hours. You can review the [data](discovered-metadata.md#application-dependency-data) collected by appliance during analysis.
::: moniker-end

::: moniker range="migrate"
After servers are automatically enabled for agentless dependency analysis, appliance collects dependency data from the server every 5 mins. It then sends a combined data point every six hours. You can review the [data](discovered-metadata.md#application-dependency-data) collected by appliance during analysis.
::: moniker-end

## Review dependency status

After initiating discovery from the appliance, you can come to Migrate project on the Azure portal and review the dependency data. We recommend that you wait for **at least 24 hours** to allow for enough dependency data to be gathered for your servers and show in a visualization. 

In the project, you can review dependencies for each server either through the **All inventory** or **Infrastructure inventory** view. 

On reviewing the **Dependencies** column for any server, you see one of the following statuses:

- **Credentials not available:** No server credentials provided in the appliance configuration manager can be used for dependency analysis.

- **Validation in progress:** The server hasn't completed the prerequisite validation checks yet.

- **Validation failed:** The server failed the validation checks. You can click the status to view the error message, which usually mentions missing prerequisites like invalid credentials or insufficient permissions.

::: moniker range="migrate"
After the validation succeeds, dependency analysis are autoenabled and you see one of the following status:
::: moniker-end

- **View dependencies:** The server passed the validation checks and dependency analysis is enabled. You can select this to open the new visualization and check the server’s dependencies.
::: moniker range="migrate"

- **Not initiated:** Dependency analysis couldn’t be enabled because Azure Migrate reached its limit of 1,000 servers per appliance for automatic enablement. If you want to run dependency analysis on specific servers, you can disable it manually on other autoenabled servers and enable it for the required ones using the PowerShell module.
- **Disabled:** You can manually disable dependency analysis on this using the portal or the PowerShell module. You can enable it again anytime using the same module. 

- **Not supported**: Dependency data could not be collected as the server was discovered through CSV import.

    >[!Note]
    > Not enabled status is shown for servers, discovered from an appliance that has still not been upgraded to the new visualization. . [Learn more](#switch-to-new-visualization) to upgrade the appliance.
::: moniker-end

## Visualize dependencies
::: moniker range="migrate-classic"

1. In **Azure Migrate: Discovery and assessment**, select **Discovered servers**.
1. Choose the **Appliance name** whose discovery you want to review.
1. Search for the server whose dependencies, you want to review.
1. Under the **Dependencies (agentless)** column, select **View dependencies**

    > [!NOTE]
    > If you've added least privileged credentials for this server on the appliance, some network attributes might be missing from the visualization. To view complete data, provide [elevated privileges](best-practices-least-privileged-account.md#in-depth-guest-discovery).

1. Change the time period for which you want to view the map using the **Time duration** dropdown.
1. Expand the **Client** group to list the servers with a dependency on the selected server.
1. Expand the **Port** group to list the servers that have a dependency from the selected server.
1. To navigate to the map view of any of the dependent servers, select the server name > **Load server map**.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/load-server-map.png" alt-text="Screenshot to Expand Server port group and load server map.":::

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/expand-client-group.png" alt-text="Screenshot shows how to expand client group.":::

1. Expand the selected server to view process-level details for each dependency.
   
    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/expand-server-processes.png" alt-text="Screenshot shows how to expand server to show the processes.":::
    ::: moniker-end

::: moniker range="migrate"

### Visualize dependencies across servers

If dependency data collection is enabled on your servers (up to 1,000 servers per appliance), you can now visualize dependencies across all discovered servers in your Azure Migrate project. The visualization displays logically grouped server nodes and their connections, helping you understand network affinity and identify applications running in your datacenter.

#### Default visualization

1. In the left menu select **Dependency analysis** and then select **Explore Applications**.
1. The visualization shows **Resolvable** connections collected from discovered servers with dependency analysis enabled. 
    Resolvable connections are network connections identified between servers discovered by Azure Migrate.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/multi-server-default-view.png" alt-text="The screenshot shows the default multi-server dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/multi-server-default-view.png":::

    > [!NOTE]
    > The view displays aggregated dependency data from each server, starting from when dependency analysis was first enabled. To improve clarity, redundant system process connections are excluded from the visualization.

#### Visualization controls

1. The default view shows a **bird's eye view** at the lower right, providing a summary of the visualization and helping you navigate easily.
1. You can use the buttons from the lower right:
    1. View the **Legend**, pan through the visualization using **Zoom in** and **Zoom out**.
    1. Select **Zoom to fit** to return to the default view showing all nodes and connections after zooming in on a section.

#### Visualization interactions

1. At any level **hover over** a node to view basic server details including **Name**, **OS Type**, **IP address**, **Source** such as, the IP/FQDN of vCenter Server/Hyper-V host and **Tags** applied to the server.
1. Select a server node to **see the immediate dependents** of the server, which are highlighted with a dotted boundary around each dependent node. 
1. Select of a server node to display additional details such as, **Power Status**, **Software inventory** discovered on the server and information about the incoming and outgoing **Connections**.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/server-node-details.png" alt-text="The screenshot shows the details of a node in multi-server dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/server-node-details.png":::

1. In the **Connections** tab, you can see:
    1. Incoming connections (server name appears on the right) 
    1. Outgoing connections (server name on the left) 
    1. The **total count of connections** between the servers collected till date. 
1. Expand any connection to view **connections between processes** between the source destination servers. These details also include the **destination port number** used in each connection.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/server-connection-details.png" alt-text="The screenshot shows the server connection details in multi-server dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/server-connection-details.png":::

1. You can zoom in on a server node and select the **blue arrow** on the node's boundary to switch to the [visualize individual server dependencies](#visualize-individual-server-dependencies).
1. The server level visualization shows incoming and outgoing dependencies for that specific server with process and port-level details.

   > [!NOTE]
   > - When you switch from multi-server to single-server visualization, dependencies are shown for the **last 24 hours** by default.
   > - You can change the time range to **last 30 days** to view the same level of dependencies as in the multi-server view, which displays all data collected to date.


#### Customize server dependency visualization

1. You can use **Search** box to filter the visualization by server name.
1. You can also apply one or more **filters** including Server name, Port (Destination), OS Type, Connection count, and Appliance, to narrow the scope.
1. After applying filters, you can multi-select the scoped servers to add or edit tags.

#### Multi-select and tag server dependencies

1. After identifying a cluster of interconnected servers, you can **multi-select the required servers** by hitting **Ctrl** on keyboard either drag a selection box around the servers or select each server node individually.
1. When you select multiple servers, they are highlighted in blue and a side pane opens, displaying a list of all the selected servers.

   :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/multi-select-servers.png" alt-text="The screenshot shows multi-selected servers in multi-server dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/multi-select-servers.png":::

1. After selecting multiple servers, you can select **Add or edit tags** to identify and group them as an application running in your datacenter. 
1. When you select **Add or edit tags**, the tagging view shows the **selected servers and all database or web application workloads** running on the servers. 
1. You can choose to tag all the listed items together or remove any of these workloads if you don't want to tag them with this group.

### Visualize individual server dependencies

1. In the new experience, go to project overview. 
1. Select the workloads count under **All inventory** to review the discovered workloads. 
1. In the view, check the **Dependencies** column with status values as covered in section above.
1. Search for the server whose dependencies you want to review. 
1. If dependency analysis was successfully performed on that server, select on **View dependencies** to go to the dependency visualization. 

    > [!NOTE]
    > If you've added least privileged credentials for this server on the appliance, some network attributes might be missing from the visualization. To view complete data, provide [elevated privileges](best-practices-least-privileged-account.md#in-depth-guest-discovery).

1. The dependency visualization displays all incoming and outgoing dependencies for that server in a network diagram.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/default-dep-view.png" alt-text="The screenshot shows the default dependency view for a server." lightbox="./media/how-to-create-group-machine-dependencies-agentless/default-dep-view.png":::

1. The view is filtered by default to show data for the **Last 24 hours** and process type as **Resolvable**. 
1. To change the time range, use the **Time range** filter. You can select **Last 7 days**/**Last 30 days** or specify a **Custom range**. 
1. You can also change the process type by selecting from the available options.

    **Process** | **Type**
    --- | --- 
    Resolvable (Default) | To filter by processes having resolvable connections.
    Essentials | To filter by nonredundant key processes.
    All | To filter by all processes including those with unresolved connections.

1. In the view, you find the servers and connections represented as follows:

    **Representation** | **Details**
    --- | --- 
    Windows symbol | Representing a Windows server in the view.
    Linux symbol | Representing a Linux server in the view.
    Connection symbol | Representing the direction of dependency between servers with strength of the connection represented by grading of dots on the connection.
    Process count | Representing the count of processes as per the process type filter.

1. Hover over the Server name to see key information, including IP address, Source, and Tags.
    
    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/server-hover-details.png" alt-text="The screenshot illustrated how the details are shown on hover." lightbox="./media/how-to-create-group-machine-dependencies-agentless/server-hover-details.png":::

1. Hover over a connection to view key information such as the strength and frequency of connections within the selected time range. 
1. Select a server name to view  more details including:
    1. Operating system 
    1. Power Status 
    1. Software inventory discovered from the server and associated Tags.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/server-expand-details.png" alt-text="The screenshot shows the server details on expanding. " lightbox="./media/how-to-create-group-machine-dependencies-agentless/server-expand-details.png":::

1. Select a connection to view detailed information, including the source and destination processes involved and the destination port number used. 
1. Expand a server node to view list of processes based on the selected process type filter.
1. From the expanded list, select a process name to view its incoming and outgoing dependencies with processes on other servers in the visualization. The process to process dependency also indicates the destination port number on the connection.

    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/process-process-dep.png" alt-text="The screenshot shows the process to process dependencies." lightbox="./media/how-to-create-group-machine-dependencies-agentless/process-process-dep.png":::

> [!NOTE]
> Process level information for a dependency might not be always available. If it's not available, the process is depicted as **Unknown process** in the visualization.
::: moniker-end

## Export dependency data
::: moniker range="migrate-classic"

1. In **All inventory** or **Infrastructure inventory** view, select the **Manage Dependencies** drop-down.
1. Select **Export dependencies**.
1. In the **Export dependencies** page, choose the appliance name that is discovering the desired servers.
1. Select the start time and end time. You can download the data only for the last 30 days.
1. Select **Export dependency**.

The dependency data is exported and downloaded in a CSV format. The downloaded file contains the dependency data across all servers enabled for dependency analysis. 

   :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/export-dep.png" alt-text="The screenshot illustrates the Export dependencies." lightbox="./media/how-to-create-group-machine-dependencies-agentless/export-dep.png":::

::: moniker-end

::: moniker range="migrate"

> [!NOTE]
> The new export experience is powered by an upgraded datastore that supports exporting dependency data across multiple appliances registered in the project. 

1. In **All inventory** or **Infrastructure inventory** view, select the **Manage Dependencies** dropdown.
1. Select **Export dependencies**.
1. In the **Export dependencies** view, select one or more appliances for their discovered servers.
1. Select the time interval for which you want to export data. You can choose from last 7, 10, 15, 30 days.
1. The process type is set to **Resolvable** by default. This exports only resolvable connections between discovered servers.
1. Select **Generate** to generate a file with the earliest available dependency data amongst the selected appliance(s) within the chosen time interval.

   :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/new-export-dep.png" alt-text="The screenshot illustrates the Export dependencies." lightbox="./media/how-to-create-group-machine-dependencies-agentless/new-export-dep.png":::

1. After the file is generated, select **Download** to save it.

> [!NOTE]
> The data is exported in a zipped folder. The folder name includes the project name as a prefix, and the CSV file inside is named using the download timestamp.

::: moniker-end

### Dependency information

Each row in the exported CSV corresponds to a dependency observed in the specified time slot.

The following table summarizes the fields in the exported CSV. Server name, application, and process fields are populated only for servers that have agentless dependency analysis enabled.

**Field name** | **Details**
--- | --- 
Timeslot | The timeslot during which the dependency was observed. <br/> Dependency data is captured over six hour slots currently.
Source server name | Name of the source server 
Source application | Name of the application on the source server  
Source process | Name of the process on the source server  
Destination server name | Name of the destination server
Destination IP | IP address of the destination server
Destination application | Name of the application on the destination server
Destination process | Name of the process on the destination server  
Destination port | Port number on the destination server

::: moniker range="migrate"
## Switch to new visualization
If you are an existing user, you already set up an Azure Migrate project. You performed discovery and manually enabled dependency analysis on some servers. To get the new enhanced visualization, you need to follow these steps:

1. Go to the inventory view and search for a server, for which you want to review dependencies.
1. Select on **View dependencies** and you see the old visualization showing dependencies of that server.


    :::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/old-dep-view.png" alt-text="The screenshot shows the old dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/old-dep-view.png":::

1. On the dependency view, you see an information box prompting you to complete some prerequisites for switching to the new visualization. 
1. As a prerequisite, you need to ensure that the discovery agent on the appliances registered with the project is upgraded to version or later.
1. Select proceed to create a new resource in the same Resource Group as the project. Ensure that you've at least **Contributor** role on the Subscription else this step isn't complete.

> [!NOTE]
> Even if the new resource creation goes through, you might not see the new visualization if the discovery agent version on the Azure Migrate appliance isn't up to date. Ensure that autoupdate service on the appliance is enabled. [Learn more](migrate-appliance.md#appliance-upgrades)

After you've performed the required steps to upgrade to the new dependency visualization, there are two ways in which you can see server dependencies in the new visualization.

### Option 1

1. Go to the existing inventory view in your project and switch to the new inventory view as using the prompt. 
1. Select **View dependencies** for the desired server in the new inventory view to get to the new visualization directly.

### Option 2

1. Go to the old inventory view, select **View dependencies** on a server.  
1. In the old dependency view, select the prompt to get to the new enhanced visualization. 

> [!NOTE]
> We recommend using **Option 1** above to switch to the new inventory view as you're able to filter servers where dependency analysis was autoenabled and then directly review the dependency visualization. The old inventory view only shows the option to visualize dependencies for servers where you manually enabled the feature.
::: moniker-end

::: moniker range="migrate"
## Manage dependencies

Dependency analysis is autoenabled on all discovered servers (upto 1,000 servers per appliance), which have passed the validation checks. You may need to disable one or more of these servers in the following scenarios:

1. Dependency analysis is autoenabled on all discovered in your project but you want to disable it on a few servers where you don't want to gather dependency data. 
1. Dependency analysis is autoenabled on 1,000 servers concurrently in your project but you have more servers where you want to enable it, then you can disable dependency analysis one or more servers from the set of 1,000 and enable others as needed.

You can disable dependency analysis on servers that you don't want and also enable dependencies for servers that you want to use either the Portal or PowerShell utility.

## Manage dependencies using Portal

### Disable dependencies

In **All inventory** or **Infrastructure inventory** view, select the **Manage Dependencies** drop-down and then select **Disable dependencies**.

:::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/disable-dependencies.png" alt-text="The screenshot shows the disable dependency view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/disable-dependencies.png":::

Follow the steps to disable the servers where dependency analysis is autoenabled:

1. You can start by selecting an appliance from the drop-down.

    > [!NOTE] 
    > If the selected appliance isn't upgraded for the new dependency analysis, you can either meet the [prerequisites](#switch-to-new-visualization) or switch to the old experience (from Overview) to add or remove servers for dependency analysis.

2. You can filter servers to disable dependency analysis on those that were autoenabled (servers with the status as *Enabled*). Servers that aren't eligible for disablement—such as those with the status *Validation failed*, *Not initiated*, *Disabled*, or *Credentials* not available'—can't be selected.

:::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/disable-dependencies-view.png" alt-text="The screenshot shows disable dependencies view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/disable-dependencies-view.png":::

3. You can select the servers and select **Disable** to proceed.

### Enable dependencies

In **All inventory** or **Infrastructure inventory** view, select the **Manage Dependencies** drop-down and then select **Enable dependencies**.

Follow the steps to disable the servers where dependency analysis has been autoenabled:

1. You can start by selecting an appliance from the drop-down.

    > [!NOTE] 
    > If the selected appliance isn't upgraded for the new dependency analysis, you can either meet the [prerequisites](#switch-to-new-visualization) or switch to the old experience (from Overview) to add or remove servers for dependency analysis.

1. You can filter servers to disable dependency analysis on those that were autoenabled (servers with the status as *Enabled*). Servers that aren't eligible for disablement—such as those with the status *Validation failed*, *Not initiated*, *Disabled*, or *Credentials* not available'—can't be selected.

:::image type="content" source="./media/how-to-create-group-machine-dependencies-agentless/enable-dependencies-view.png" alt-text="The screenshot shows the enable dependencies view." lightbox="./media/how-to-create-group-machine-dependencies-agentless/enable-dependencies-view.png":::

1. You can select the servers and select **Enable** to proceed.

    > [!NOTE] 
    > You can't enable more than 1,000 servers per appliance concurrently so if your selection exceeds the count, you won't be able to proceed.

## Manage dependencies using PowerShell utility

You need to install the PowerShell module to disable for servers that you don't want by following the steps below:

### Log in to Azure

1. Log in to your Azure subscription using the Connect-AzAccount cmdlet.
    `Connect-AzAccount`

    If using Azure Government, use the following command.

    `Connect-AzAccount -EnvironmentName AzureUSGovernment`
1. Select the subscription in which you've created the project
    `select-azsubscription -subscription "Contoso Demo Subscription"`

1. Install the AzMig.Dependencies PowerShell module
    `Install-Module .\AzMig.Dependencies`

### Disable dependencies

Use the following commands to get the list of discovered servers in your project. In this example, the project name is ContosoDemoProject, and the resource group is ContosoDemoRG. The list of servers is saved in a file named `ContosoDemo_VMs.csv."`

```
Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
You can also add a filter to export the relevant servers using the command:
```
```
Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -Filter @{"Dependencies"="Enabled"} -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
```

The different filters available for use in the command above are:

| **Field name** | **Details** |
|---|---|
| ServerName | Provide name you want to filter with |
| Source | Appliance / Import-based |
| Dependencies | Enabled / Disabled |
| PowerStatus | On / Off |

Some of the other fields are IP Address, osType, osName, osArchitecture, osVersion

You can find discovered servers for a specific appliance by using the command:

```
Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -Filter @{"Dependencies"="Enabled"} -ApplianceName "ContosoApp" -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
```

In the file, you can see the server display name, current status of dependency collection and the ARM ID of all discovered servers.

To disable dependencies, create an input CSV file using the output file you exported in the last step. The file must have a column with the header *ARM ID*. Other headers in the CSV file are ignored. The input file should list the servers where you want to disable dependency analysis.

In the following example, dependency analysis is being disabled on the list of servers in the input file ContosoDemo_VMs_Disable.csv.

```
    PowerShell Set-AzMigDependencyMappingAgentless -Disable -InputCsvFile .\ContosoDemo_VMs_Disable.csv [-AutoEnabledDepMap]
```

### Enable dependencies

You may need to enable dependency analysis on one or more servers to start collecting data again from servers you disabled earlier using the PowerShell module.

You need to follow the same steps to export the discovered servers as mentioned above and then import the list of servers you want to enable.

In the following example, dependency analysis is being enabled on the list of servers in the input file ContosoDemo_VMs_Enable.csv.

```
Set-AzMigDependencyMappingAgentless -Enable -InputCsvFile .\ContosoDemo_VMs_Enable.csv [-AutoEnabledDepMap]

```
::: moniker-end

::: moniker range="migrate-classic"
## Disable autoenabled dependency analysis using PowerShell

Dependency analysis is autoenabled on all discovered servers, which have passed the validation checks. You may need to disable one or more of these servers in the following scenarios:

1. Dependency analysis has been autoenabled on all discovered in your project but you want to disable it on a few servers where you don't want to gather dependency data.

1. Dependency analysis is autoenabled on 1,000 servers at the same time in your project. If you have more servers to enable, you can disable it on one or more of the 1,000 servers and enable it on the ones as you need.

    > [!NOTE]
    > Currently, it isn't possible to disable dependency analysis on servers from portal so you need to install the PowerShell module to disable for servers that you don't want.
::: moniker-end

::: moniker range="migrate-classic"
### Log in to Azure

1. Log in to your Azure subscription using the Connect-AzAccount cmdlet.

    ```PowerShell
    Connect-AzAccount
    ```
    If using Azure Government, use the following command.
    ```PowerShell
    Connect-AzAccount -EnvironmentName AzureUSGovernment
    ```

1. Select the subscription in which you've created the project 

    ```PowerShell
    select-azsubscription -subscription "Contoso Demo Subscription"
    ```

1. Install the AzMig.Dependencies PowerShell module

    ```PowerShell
    Install-Module .\AzMig.Dependencies
    ```

### Disable dependency data collection

1. Get the list of discovered servers in your project using the following commands. In the example below, the project name is ContosoDemoProject, and the resource group it belongs to be ContosoDemoRG. The list of servers are saved in ContosoDemo_VMs.csv

    ```PowerShell
    Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
    ```

You can also add a filter to export the relevant servers using the command:

```PowerShell
    Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -Filter @{"Dependencies"="Enabled"} -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
```

The different filters available for use in the command above are:

**Field name** | **Details**
--- | --- 
ServerName | Provide name you want to filter with
Source |  Appliance/ Import-based
Dependencies | Enabled/Disabled
PowerStatus |  On/Off

Some of the other fields are IP Address, osType, osName, osArchitecture, osVersion

You can find discovered servers for a specific appliance by using the command:

```PowerShell
   Get-AzMigDiscoveredVMwareVMs -ResourceGroupName "ContosoDemoRG" -ProjectName "ContosoDemoProject" -Filter @{"Dependencies"="Enabled"} -ApplianceName "ContosoApp" -OutputCsvFile "ContosoDemo_VMs.csv" [-AutoEnabledDepMap]
```
    
In the file, you can see the server display name, current status of dependency collection and the ARM ID of all discovered servers. 

1. To disable dependencies, create an input CSV file from the output file you exported in the last step. The file is required to have a column with header "ARM ID". Any other headers in the CSV file are ignored. The input file should contain the list of servers where you want to disable dependency analysis.

In the following example, dependency analysis is being disabled on the list of servers in the input file ContosoDemo_VMs_Disable.csv.

``` PowerShell
    Set-AzMigDependencyMappingAgentless -Disable -InputCsvFile .\ContosoDemo_VMs_Disable.csv [-AutoEnabledDepMap]
 ```

### Enable dependency data collection

You may need to enable dependency analysis on one or more servers to restart dependency data collection from servers that you disabled using PowerShell module previously.

You need to follow the same steps to export the discovered servers as mentioned above and then import the list of servers you want to enable.

In the following example, dependency analysis is being enabled on the list of servers in the input file ContosoDemo_VMs_Enable.csv.

```PowerShell
    Set-AzMigDependencyMappingAgentless -Enable -InputCsvFile .\ContosoDemo_VMs_Enable.csv [-AutoEnabledDepMap] 
```
::: moniker-end

## Visualize network connections in Power BI

Azure Migrate offers a Power BI template that you can use to visualize network connections of many servers at once, and filter by process and server. To visualize, load the Power BI with dependency data as per the below instructions.

### Log in to Azure

1. Log in to your Azure subscription using the Connect-AzAccount cmdlet.

    ```PowerShell
    Connect-AzAccount
    ```
    If using Azure Government, use the following command.
    ```PowerShell
    Connect-AzAccount -EnvironmentName AzureUSGovernment
    ```

1. Select the subscription in which you've created the project 

    ```PowerShell
    select-azsubscription -subscription "Contoso Demo Subscription"
    ```

1. Install the AzMig.Dependencies PowerShell module

    ```PowerShell
    Install-Module .\AzMig.Dependencies
    ```

1. Run the following command. This command downloads the dependencies data in a CSV and processes it to generate a list of unique dependencies that can be used for visualization in Power BI. In the example below the project name is ContosoDemoProject, and the resource group it belongs to be ContosoDemoRG. The dependencies are downloaded for servers discovered by ContosoApp. The unique dependencies are saved in ContosoDemo_Dependencies.csv

    ```PowerShell
    Get-AzMigDependenciesAgentless -ResourceGroup ContosoDemoRG -Appliance ContosoApp -ProjectName ContosoDemoProject -OutputCsvFile "ContosoDemo_Dependencies.csv" [-AutoEnabledDepMap]
    ```

1. Open the downloaded Power BI template

1. Load the downloaded dependency data in Power BI.

    - Open the template in Power BI.
    - Select **Get Data** on the tool bar. 
    - Choose **Text/CSV** from Common data sources.
    - Choose the dependencies file downloaded.
    - Select **Load**.
    - You see a table is imported with the name of the CSV file. You can see the table in the fields bar on the right. Rename it to AzMig_Dependencies
    - Select refresh from the tool bar.

    The Network Connections chart and the Source server name, Destination server name, Source process name, Destination process name slicers should light up with the imported data.

1. Visualize the map of network connections filtering by servers and processes. Save your file.

## Next steps

[Group servers](how-to-create-a-group.md) for assessment.