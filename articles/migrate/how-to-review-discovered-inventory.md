---
title: Review discovered inventory in Azure Migrate
description:  Review discovered inventory across All inventory, Infrastructure, Databases, and web application inventory views
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: how-to
ms.date: 03/15/2025
ms.custom: engagement-fy23
---


# Review discovered inventory

This article describes the new experience to review inventory discovered using Azure Migrate: Discovery and assessment tool. 

## What's New?

- You can review the inventory of different type of workloads discovered from your datacenter along with their key attributes- all in a **single view**. 
- You can **expand a server** and review the inventory of databases and web applications running on the server. 
- You can use **filtering** capability to scope the list of workloads using a combination of filters.
- You can **add and edit tags** at scale to the discovered workloads from the inventory views.
- You can **export** the inventory of your entire datacenter to review the details offline.
- You can also review discovered inventory specifically for your **infrastructure (servers), databases, and web applications** by switching to these inventory views. 

### Existing users

The existing users who have already created an Azure Migrate project and performed discovery of their datacenter assets can switch to the new Overview by using the prompt in their existing project. From the new Overview, you can select the count of workloads to review the discovered inventory across your datacenter.

### New users

The new users need to follow steps given below:

- Ensure that you have [created a project](./create-manage-projects.md) with the Azure Migrate: Discovery and assessment tool added to it.
- Review the requirements based on your environment and the appliance you're setting up to perform inventory:

    Environment | Requirements
    --- | ---
    Servers running in VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware)<br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements) 
    Servers running in Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v)<br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access)
    Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical)<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access)
- Review the Azure URLs that the appliances need to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).


## Deploy and configure the Azure Migrate appliance

1. Deploy the Azure Migrate appliance to start discovery. To deploy the appliance, you can use the [deployment method](migrate-appliance.md#deployment-methods) as per your environment. After deploying the appliance, you need to register it with the project and configure it to initiate the discovery.
2. As you configure the appliance, you need to specify the following in the appliance configuration manager:
    - The details of the source environment (vCenter Server(s)/Hyper-V host(s) or cluster(s)/physical servers) which you want to discover.
    - Server credentials, which can be domain/ Windows (non-domain)/ Linux (non-domain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
    - Verify the permissions required to perform agentless dependency analysis. For Windows servers, you need to provide domain or non-domain (local) account with administrative permissions. For Linux servers, provide a sudo user account with permissions to execute ls and netstat commands or create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files. If you're providing a sudo user account, ensure that you have enabled NOPASSWD for the account to run the required commands without prompting for a password every time sudo command is invoked.

### Add credentials and initiate discovery

1. Open the appliance configuration manager, complete the prerequisite checks and registration of the appliance.
2. Navigate to the **Manage credentials and discovery sources** panel.
1.  In **Step 1: Provide credentials for discovery source**, select on **Add credentials** to  provide credentials for the discovery source that the appliance uses to discover servers running in your environment.
1. In **Step 2: Provide discovery source details**, select on **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the discovery source.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="The screenshot shows panel 3 on appliance configuration manager for vCenter Server details." lightbox="./media/tutorial-discover-vmware/appliance-manage-sources.png":::

1. In **Step 3: Provide server credentials to perform software inventory and agentless dependency analysis**, select **Add credentials** to provide multiple server credentials to perform guest-based discovery like software inventory, agentless dependency analysis and discovery of databases, and web applications.

    > [!Note]
    > If you want to perform guest based discovery features later, you can provide your intent by disabling the slider on the appliance configuration manager and proceed to start discovery of the servers from your environment.

1. Select **Start discovery**, to initiate discovery.

 After the discovery is complete, you can go to Azure portal and refresh the **Overview** in your project to see the count of the discovered workloads.
 
## Review All inventory

You can start by selecting the count of workloads on **Overview** of your project or select **All inventory** under **Explore inventory** from the menu on the left to see the list of workloads, discovered from your environment either by using [Azure Migrate appliance](migrate-appliance.md) or using CSV import.

**All Inventory** view helps you review all the workloads discovered from your datacenter including servers (VMware VMs/Hyper-V VMs/Physical servers/servers running in other public clouds), databases, and web applications which can be found inline by expanding the server. 

While the default view shows databases and web applications on expanding a server in a hierarchical list, you can also choose to see a flat list of all workloads by switching to that view from the action on top right of the page. 

:::image type="content" source="./media/how-to-review-discovered-inventory/switch-to-flat-list.png" alt-text="The screenshot illustrates how to switch to flat list view." lightbox="./media/how-to-review-discovered-inventory/switch-to-flat-list.png":::

You can navigate across pages to review the entire inventory from a single view or choose to go to separate views for **Infrastructure Databases and Web apps** inventory from the menu on the left.

### Default columns

The default view shows the inventoried workloads along with a set of attributes as described below:

**Attribute name** | **Details**
--- | --- 
Workload | Name of the Server, Database, or Web application 
Category | Category of the inventoried asset across Server, Database, and Web app
Type | Type of workload <br/> *For instance a Server can be Windows server/Linux server, a Database can be SQL Server, and Web app can be .NET/IIS*
Edition | Edition of the Server, Database, or Web app
Version | Version of the Server, Database, or Web app
Dependencies | Network dependencies of the server <br/> *Dependency analysis is auto-enabled on upto 1000 servers per appliance if the validation checks succeed.
Support Status | Support status for the Servers, Databases to indicate if they're in Mainstream support, End of Support, or in Extended support. [Learn more](vmware/tutorial-discover-vmware.md#view-support-status).|
Discovery source | Source of discovery of the workload between Appliance and Import
Tags | Tags applied to the workload. <br/> Currently, Azure Migrate supports custom tags. 

### Optional columns

You can choose to view more attributes that are gathered by Azure Migrate as part of the discovery by selecting **Columns** from the command bar on top and choosing the additional attributes that you're interested to review. 

:::image type="content" source="./media/how-to-review-discovered-inventory/optional-columns-list.png" alt-text="The screenshot illustrates with optional columns" lightbox="./media/how-to-review-discovered-inventory/optional-columns-list.png".:::

 > [!Note]
 > The exhaustive list of attributes discovered by Azure Migrate are covered in the [details of exported inventory data](#export-all-inventory-data)

## Perform actions

### Review individual workload

You can select the name of a workload to see all the attributes and additional metadata discovered for that workload in a detailed view. Here you can also add tags to an individual workload.

The data gathered varies as per the individual workload type. Details of each type of the workload can also be found in inventory views for Infrastructure, Databases, and Web apps and can be reviewed.

**Workload type** | **Details** 
--- | --- 
Server | [Server details](#review-server-data)
Databases | Database details
Web apps | [Web app details](#review-web-apps-inventory)

After reviewing the workloads and their attributes, you can either **Select all workloads across pages** or scope the list using **Search and Filter** capabilities to perform required action on the inventory.

### Search and filter

You can scope the list in All inventory view by searching for name of the workloads or by adding one or more filters on the attributes or tags associated with the workloads.

By default, searching for a workload also shows the associated workloads so that you select across all searched and associated work items and perform actions as needed. You can choose to disable the slider on top of the view if you only want to see the searched workloads and not the associated ones. 

:::image type="content" source="./media/how-to-review-discovered-inventory/show-associated-workloads.png" alt-text="The screenshot shows the option to disable the show associated workloads option" lightbox="./media/how-to-review-discovered-inventory/show-associated-workloads.png":::


### User actions on All inventory

You can perform any of the following actions after reviewing the inventory:

**Action name** | **Details** 
--- | --- 
Discover | Discover using appliance or CSV import to inventory more workloads
Create assessment | Create an assessment of all or scoped set of workloads to review suitability, mapped Azure services, cost, and readiness analysis of your workloads.<br/> You need to select one or more workloads to perform this action. <br/> Learn how to [create an assessment]().
Build business case | Build business case for TCO/RoI analysis for all or scoped set of workloads. <br/> You need to select one or more workloads to perform this action. <br/> Learn how to [build a business case]().
Dependency analysis | Export dependency data for servers where gathering of dependency data was auto-enabled. Learn how to [export dependency data](how-to-create-group-machine-dependencies-agentless.md#export-dependency-data).
Tags | Tags can be added/edited at scale by selecting all or a scoped set of workloads. <br/> You need to select one or more workloads to perform this action. <br/> You can also import tags using an exported list of all inventory and importing the tags information from that CSV file. <br/> Learn how to [add tags]().
Export data | Export the inventory data for all workloads. <br/> Review [exported data](#export-all-inventory-data).
Columns | Choose optional attributes for the discovered workloads
Refresh | Refresh the view to review any updates in discovery
Feedback | Provide your feedback about the view and its utility

### Export All inventory data

You can export and review all inventoried workloads with associated attributes and tags. The following table summarizes the fields in the exported CSV.

**Attribute name** | **Details**
--- | --- 
ID |
Parent ID | 
Workload | Name of the Server, Database, or Web application 
Category | Category of the inventoried asset across Server, Database, and Web app
Type | Type of workload.<br/> For instance a Server can be Windows server/Linux server, a Database can be SQL Server, and Web app can be .NET/IIS
Edition | Edition of the Server, Database, or Web app
Version | Version of the Server, Database, or Web app
Dependencies | Network dependencies of the server <br/> Shows status of the dependency analysis whether Enabled, Disabled, Failed validation, etc.
Support Status | Support status for the Servers, Databases to indicate if they are in Mainstream support, End of Support, or in Extended support.
Discovery source | Source of discovery of the workload between Appliance and Import
Tags | Tags applied to the workload. <br/> Currently, Azure Migrate supports custom tags. 
Cores | Number of processor cores allocated to the server
Memory (MBs) | Total RAM, in MB, allocated to the server
Disks | Number of disks allocated to the server
Storage (GBs) | Total storage allocated to the server
Operating system type | Type of Operating system between Windows and Linux
Support ends in (Days) | Number of days for support to end
Power Status | Power status of the server
Appliance | Name of the appliance used to discover the workload
First discovery time | First timestamp when the workload was discovered
Last updated time | Last known timestamp of when the workload discovery data was updated
Processor | Processor details of the server
DB engine status | 
User databases | Number of databases running on the instance
HADR configuration | 

## Review Infrastructure inventory

You can select **Infrastructure inventory** under **Explore inventory** from the menu on the left to see the list of infrastructure workloads, discovered from your environment either by using [Azure Migrate appliance](migrate-appliance.md) or using CSV import.

**Infrastructure Inventory** view helps you review all the servers discovered from your datacenter including VMware VMs/Hyper-V VMs/Physical servers/servers running in other public clouds.

### Default columns

The default view shows the inventoried servers, along with a set of attributes as described below:

**Attribute name** | **Details**
--- | --- 
Server | Name of the Server
Operating system | Name of the Server Operating system
IPv6/IPv4 | IP address of the server
Dependencies | Network dependencies of the server <br/> *Dependency analysis is auto-enabled on upto 1000 servers per appliance if the validation checks succeed. [Learn more]()*
DB instances | No fo DB instances found running on the server
Web app | No of web apps found running on the server
Issues | No of discovery issues reported on the server
Support Status | Support status for the Servers, Databases to indicate if they are in Mainstream support, End of Support, or in Extended support. [Learn more](vmware/tutorial-discover-vmware.md#view-support-status)
Tags | Tags applied to the server. <br/> *Currently, Azure Migrate supports custom tags. 

### Optional columns

You can choose to view more attributes that are gathered by Azure Migrate as part of the discovery by selecting **Columns** from the command bar on top and choosing the additional attributes that you're interested to review. 

 > [!Note]
 > The exhaustive list of attributes discovered by Azure Migrate are covered in the [details of exported server data](#export-all-inventory-data) below.

### Review server data

You can select the name of a server to see all the attributes and additional metadata discovered for that server in a detailed view. Here you can also add tags to an individual server. Here are the details you can review for each server:

**Tab name** | **Details**
--- | --- 
Overview | Provides overview of the server with basic details, Storage, Network, OS & Hardware configuration 
Software inventory | Provides a list of installed Roles & Features *(Windows Servers only)* and list of installed software on a Windows or Linux server
DB Instances | List of DB instances found running on the server along with attributes like DB platform, Support status, user databases, etc.
Web apps | List of web apps found running on the server along with attributes like Web server, framework, etc.
Tags | List of custom tags applied to the server with an option to edit or delete existing tags and add new tags
Issues | List of discovery issues encountered on the server categorized by features providing error message, possible causes, and remediation steps

### Scoping server data

After reviewing the servers and their attributes, you can either **Select all workloads across pages** or scope the list using **Search and Filter** capabilities to perform required action on the server inventory.

You can scope the list in Infrastructure inventory view by searching for name of the servers or by adding one or more filters on the attributes or tags associated with the servers.

### User actions on server inventory

You can perform actions on all or a scoped set of servers, similar to those listed for [All inventory](#user-actions-on-all-inventory) above.

 > [!Note]
 > When creating assessment for discovered servers, you can create assessment for Azure VMs and Azure VMware Solution (AVS) [Learn more]().

 ### Export Server inventory data

You can export and review the server inventory with their associated attributes and tags. The following table summarizes the fields in the exported CSV.

**Attribute name** | **Details**
--- | --- 
ID |
Server | Name of the Server
Operating system | Name of the Server Operating system
IPv6/IPv4 | IP address of the server
Dependencies | Network dependencies of the server <br/> Shows status of the dependency analysis whether Enabled, Disabled, Failed validation, etc.
Software inventory | Count of the installed software on the server
DB instances | No fo DB instances found running on the server
Web app | No of web apps found running on the server
Issues | No of discovery issues reported on the server
Support Status | Support status for the Servers, Databases to indicate if they are in Mainstream support, End of Support, or in Extended support.
Tags | Tags applied to the server
Source | Source of discovery of the server. For instance FQDN of vCenter server or Hyper-V host
Memory (MBs) | Total RAM, in MB, allocated to the server
Disks | Number of disks allocated to the server
Cores | Number of processor cores allocated to the server
Storage (GBs) | Total storage allocated to the server
Network Adapters | Count of NICs associated with the server
MAC address | MAC address of the server
Boot Type | Boot type of the server between BIOS and UEFI
Operating system type | Type of Operating system between Windows and Linux
Operating system version | Version of Operating system 
Operating system architecture | Type of Operating system architecture like 32-bit/64-bit
First discovery time | First timestamp when the server was discovered
Last updated time | Last known timestamp of when the server discovery data was updated
Processor | Processor details of the server
Resource type | Type of resource created in Azure 
Power Status | Power status of the server
Machine type | Type of server whether virtualized on VMware/Hyper-V or bare-metal (physical)
Discovery source | Source of discovery between appliance and import
Support ends in (Days) | Number of days for support to end
Appliance name | Name of the appliance used to discover the workload.

## Review Web apps inventory

You can select the name of a web app to see all the attributes and another metadata discovered for that workload in a detailed view. Here you can also add tags to an individual server. Here are the details you can review for each web app: 

**Tab name** | **Details**
--- | --- 
Overview    |Provides overview of the Web App with basic details like Web app name, server, protocol framework, and discovery details. 
Tags | List of custom tags applied to the web app with an option to edit or delete existing tags and add new tags. 

### Scoping Web app data 

After reviewing the web apps and their attributes, you can either **Select all workloads across pages** or scope the list using **Search** and **Filter** capabilities to perform required action on the server inventory. 

You can scope the list in Web apps view by searching for name of the web app or by adding one or more filters on the attributes or tags associated with the webapps. 

### User actions on server inventory 

You can perform following actions on all or a scoped set of web apps after reviewing the inventory: 

* **Discover**:  Discover using appliance or CSV import to inventory more workloads
* **Create assessment**: Create an assessment of all or scoped set of workloads to review suitability, mapped Azure services, cost, and readiness analysis of your workloads. You need to select one or more workloads to perform this action. [Learn more](how-to-create-assessment.md)
* **Dependency analysis**: Export dependency data for servers where gathering of dependency data was auto-enabled. Learn how to export dependency data.
* **Tags**: Tags can be added/edited at scale by selecting all or a scoped set of workloads.
    * You need to select one or more workloads to perform this action. 
    * You can also import tags using an exported list of all inventory and importing the tags     information from that CSV file
* **Export data**: Export the inventory data for all web apps.
* **Refresh**: Refresh the view to review any updates in discovery.

## Next steps

Learn more on assessment [Group servers](how-to-create-a-group.md).