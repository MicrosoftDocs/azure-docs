---
title: Review Discovered Inventory (Preview) in Azure Migrate 
description: This article describes how to review discovered inventory across infrastructure, databases, and web applications. 
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: how-to
ms.date: 04/11/2025
ms.custom: engagement-fy23
monikerRange: migrate

# Customer intent: As a cloud administrator, I want to review the discovered inventory of my datacenter assets in a unified view so that I can efficiently manage and assess the workloads, databases, and web applications for migration planning.
---

# Review discovered inventory (preview) in Azure Migrate

This article describes the new experience to review the inventory that you discover by using the Azure Migrate Discovery and Assessment tool. This capability is in preview.

## What's new?

You can do the following tasks in the new experience:

- Review the inventory of various types of workloads discovered from your datacenter, along with their key attributes - all in a single view.
- Expand a server and review the inventory of databases and web applications running on the server.
- Use the filtering capability with the combination of filters to scope the list of workloads.
- Add and edit tags at scale for the discovered workloads from the inventory views.
- Export the inventory of your entire datacenter to review the details offline.
- Review the discovered inventory specifically for your infrastructure (servers), databases, and web applications by switching to the inventory views.

How you open the new experience depends on whether you're an existing or new user.

# [Existing user](#tab/existing)

If you're an existing user who already created an Azure Migrate project and performed discovery of your datacenter assets, you can switch to the new **Overview** tab by using the prompt in your existing project. On the **Overview** tab, select the count of workloads to review the discovered inventory across your datacenter.

# [New user](#tab/new)

Ensure that you meet the following prerequisites:

- [Create a project](./create-manage-projects.md) with the Azure Migrate Discovery and Assessment tool added to it.
- Review the requirements based on your environment and the appliance that you set up to perform the inventory:

  Environment | Requirements
  --- | ---
  Servers running in a VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements). <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware).<br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements).
  Servers running in a Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements). <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v).<br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access).
  Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements). <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical).<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access).

- Review the Azure URLs that the appliances require you to access in the [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

---

## Deploy and configure the Azure Migrate appliance

You must deploy the Azure Migrate appliance to start discovery. To deploy the appliance, use the [deployment method](migrate-appliance.md#deployment-methods) that your environment requires. After you deploy the appliance, register it with the project and configure it to initiate the discovery.

As you configure the appliance, you must specify the following values in the appliance configuration manager:

- Details of the source environment (vCenter Servers and Hyper-V hosts, or clusters and physical servers) that you want to discover.
- Server credentials, which can be domain, Windows (non-domain), or Linux (non-domain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
- Permissions required to perform agentless dependency analysis:

  - For Windows servers, you need to provide a domain or non-domain (local) account with administrative permissions.
  - For Linux servers, provide a Sudo user account with permissions to execute `ls` and `netstat` commands. Or create a user account that has the `CAP_DAC_READ_SEARCH` and `CAP_SYS_PTRACE` permissions on `/bin/netstat` and `/bin/ls` files. If you provide a Sudo user account, ensure that you enabled `NOPASSWD` for the account to run the required commands without prompting for a password every time the Sudo command is invoked.

### Add credentials and initiate a discovery

To add credentials and initiate a discovery, follow these steps:

1. Open the appliance configuration manager, and complete the prerequisite checks and registration of the appliance.
1. Go to the **Manage credentials and discovery sources** panel.
1. In **Step 1: Provide vCenter Server credentials for discovery or VMware VMs**, select **Add credentials**. Then provide credentials for the discovery source that the appliance uses to discover servers running in your environment.
1. In **Step 2: Provide vCenter Server details**, select **Add discovery source**. Select the friendly name for credentials from the dropdown list, and then specify the **IP address/FQDN** value for the discovery source.

    :::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Screenshot that shows the panel for managing credentials and discovery sources in the appliance configuration manager for vCenter Server details." lightbox="./media/tutorial-discover-vmware/appliance-manage-sources.png":::

1. In **Step 3: Provide server credentials to perform software inventory and agentless dependency analysis**, select **Add credentials**. Then provide server credentials to perform guest-based discovery, such as software inventory, agentless dependency analysis, and discovery of databases and web applications.

    > [!NOTE]
    > If you want to perform guest-based discovery later, you can disable the slider in the appliance configuration manager and proceed to start discovery of the servers from your environment.

1. Select **Start discovery** to initiate discovery.

After the discovery is complete, go to the Azure portal and refresh the **Overview** tab in your project to see the count of the discovered workloads.

## Review all inventory

You can select the count of workloads on the **Overview** tab of your project. Or, you can select **All inventory** > **Explore inventory** on the left menu to see the list of workloads discovered from your environment through either the [Azure Migrate appliance](migrate-appliance.md) or CSV import.

The **All Inventory** view helps you review all the workloads discovered from your datacenter. The list includes workloads running on servers (VMware VMs, Hyper-V VMs, physical servers, and servers running on other public clouds), databases, and web applications. You can find these workloads inline by expanding the server.

The default view shows databases and web applications when you expand a server in a hierarchical list. However, you can also choose to view a flat list of all workloads. To switch to that view, use the action button on the upper-right corner of the pane.

:::image type="content" source="./media/how-to-review-discovered-inventory/switch-to-flat-list.png" alt-text="Screenshot that illustrates the button for switching to a flat list view of workloads." lightbox="./media/how-to-review-discovered-inventory/switch-to-flat-list.png":::

You can move across pages to review the entire inventory from a single view. Or you can go to separate views for the **Infrastructure Databases and Web apps** inventory from the left pane.

# [Default columns](#tab/default-col)

The default view shows the inventoried workloads, along with the following set of attributes:

Attribute name | Details
--- | ---
**Workload** | Name of the server, database, or web application.
**Category** | Category of the inventoried asset across the server, database, and web app.
**Type** | Type of workload. <br><br/> For instance, a server can be Windows server or a Linux server, a database can be a SQL server, and a web app can be .NET or IIS.
**Edition** | Edition of the server, database, or web app.
**Version** | Version of the server, database, or web app.
**Dependencies** | Network dependencies of the server. <br><br/> Dependency analysis is automatically enabled on up to 1,000 servers per appliance, if the validation checks succeed.
**Support Status** | Support status for the servers and databases to indicate if they're in mainstream support, end of support, or extended support. [Learn more](tutorial-discover-vmware.md#view-support-status).
**Discovery source** | Source of discovery of the workload (appliance or import).
**Tags** | Tags applied to the workload. <br><br/> Currently, Azure Migrate supports custom tags only.

# [Optional columns](#tab/optional-col)

To view more attributes that Azure Migrate gathers during the discovery process, select **Columns** on the command bar. Then, select more attributes that you want to review.

> [!NOTE]
> The [details of exported inventory data](#export-all-inventory-data) in this article show a complete list of attributes that Azure Migrate discovers.

---

## Perform actions

### Review an individual workload

You can select the name of a workload to see all the attributes and additional metadata discovered for that workload in a detailed view. You can also add tags to an individual workload.

The gathered data varies based on the individual workload type. You can find the details of each type of workload in inventory views for infrastructure, databases, and web apps, so that you can review them.

Workload type | Details
--- | ---
Server | [Server details](#review-server-data)
Database | Database details
Web app | [Web app details](#review-the-web-app-inventory)

After you review the workloads and their attributes, you can choose **Select all workloads across pages** to perform the required action on the inventory. Or you can use the search and filter capabilities to scope the list.

### Search and filter

To scope the list in the **All Inventory** view, you can search for the names of the workloads. Or you can add one or more filters on the attributes or tags associated with the workloads.

By default, when you search for a workload, it displays the associated workloads so that you select across all searched and associated work items and perform actions as needed. You can disable the slider on top of the view if you want to see only the searched workloads and not the associated ones.

:::image type="content" source="./media/how-to-review-discovered-inventory/show-associated-workloads.png" alt-text="Screenshot that shows the option to disable showing associated workloads." lightbox="./media/how-to-review-discovered-inventory/show-associated-workloads.png":::

### Perform user actions on all inventory

You can perform any of the following actions after you review the inventory:

Action name | Details
--- | ---
**Discover** | Discover by using the appliance or CSV import to inventory more workloads.
**Create assessment** | Create an assessment of all workloads or a scoped set of workloads to review suitability, mapped Azure services, cost, and readiness of your workloads.<br><br/> You must select one or more workloads to perform this action. <br><br/> [Learn how to create an assessment](how-to-create-assessment.md).
**Build business case** | Build a business case for total cost of ownership (TCO) or return on investment (ROI) analysis for all workloads or a scoped set of workloads. <br><br/> You must select one or more workloads to perform this action. <br><br/> [Learn how to build a business case](how-to-build-a-business-case.md).
**Dependency analysis** | Export dependency data for servers that automatically gather dependency data. [Learn how to export dependency data](how-to-create-group-machine-dependencies-agentless.md#export-dependency-data).
**Tags** | Add or edit tags at scale for all workloads or a scoped set of workloads. <br/> To perform this action, select one or more workloads. <br><br/> You can also import tags by using an exported list of the entire inventory and importing the tag information from that CSV file. <br><br/> [Learn how to add tags](resource-tagging.md).
**Export data** | Export the inventory data for all workloads. <br><br/> [Review exported data](#export-all-inventory-data).
**Columns** | Select optional attributes for the discovered workloads.
**Refresh** | Refresh the view to review any updates in discovery.
**Feedback** | Provide your feedback about the view and its utility.

### Export all inventory data

You can export and review all inventoried workloads with associated attributes and tags. The following table summarizes the fields in the exported CSV file:

Attribute name | Details
--- | ---
**ID** | ID of the workload.
**Parent ID** | ID of the parent workload.
**Workload** | Name of the server, database, or web application.
**Category** | Category of the inventoried asset across the server, database, and web app.
**Type** | Type of workload. <br><br/> For instance, a server can be a Windows server or a Linux server, a database can be a SQL server, and a web app can be .NET or IIS.
**Edition** | Edition of the server, database, or web app.
**Version** | Version of the server, database, or web app.
**Dependencies** | Network dependencies of the server. <br><br/> This attribute shows the status of the dependency analysis, such as **Enabled**, **Disabled**, or **Failed validation**.
**Support Status** | Support status for the servers and databases to indicate if they're in mainstream support, end of support, or extended support.
**Discovery source** | Source of discovery of the workload (appliance or import).
**Tags** | Tags applied to the workload. <br><br/> Currently, Azure Migrate supports custom tags.
**Cores** | Number of processor cores allocated to the server.
**Memory (MBs)** | Total RAM, in megabytes, allocated to the server.
**Disks** | Number of disks allocated to the server.
**Storage (GBs)** | Total storage allocated to the server.
**Operating system type** | Type of operating system (Windows or Linux).
**Support ends in (Days)** | Number of days before support ends.
**Power Status** | Power status of the server.
**Appliance** | Name of the appliance used to discover the workload.
**First discovery time** | First time stamp of when the workload was discovered.
**Last updated time** | Last known time stamp of when the workload discovery data was updated.
**Processor** | Processor details of the server.
**DB engine status** | Status of the database engine.
**User databases** | Number of databases running on the instance.
**HADR configuration** | Configuration of high availability and disaster recovery (HADR).

## Review the infrastructure inventory

To view the list of infrastructure workloads discovered from your environment through either [the Azure Migrate appliance](migrate-appliance.md) or CSV import, select **Explore inventory** > **Infrastructure inventory** on the left menu.

The **Infrastructure inventory** view helps you review all the servers discovered from your datacenter, including VMware VMs, Hyper-V VMs,  physical servers, or servers running on other public clouds.

# [Default columns](#tab/default)

The default view shows the inventoried servers, along with the following set of attributes:

Attribute name | Details
--- | ---
**Server** | Name of the server.
**Operating system** | Name of the server operating system.
**IPv6/IPv4** | IP address of the server.
**Dependencies** | Network dependencies of the server. <br><br/> Dependency analysis is automatically enabled on up to 1,000 servers per appliance, if the validation checks succeed.
**DB instances** | Number of database instances running on the server.
**Web app** | Number of web apps running on the server.
**Issues** | Number of discovery problems reported on the server.
**Support Status** | Support status for the servers and databases to indicate if they're in mainstream support, end of support, or extended support. [Learn more](tutorial-discover-vmware.md#view-support-status).
**Tags** | Tags applied to the server. <br><br/> Currently, Azure Migrate supports custom tags.

# [Optional columns](#tab/optional)

To view more attributes that Azure Migrate gathers during the discovery process, select **Columns** on the command bar. Then, select more attributes that you want to review.

> [!NOTE]
> The [details of exported inventory data](#export-all-inventory-data) in this article show a complete list of attributes that Azure Migrate discovers.

---

### Review server data

Select the name of a server to see all the attributes and additional metadata discovered for that server in a detailed view. You can also add tags to an individual server. The following table lists the details to review for each server:

Tab name | Details
--- | ---
**Overview** | Provides an overview of the server with basic details about storage, network, operating system, and hardware configuration.
**Software inventory** | Lists the installed roles and features *(Windows servers only)* and software on a Windows or Linux server.
**DB Instances** | Lists the database instances running on the server, along with attributes such as database platform, support status, and user databases.
**Web apps** | Lists the web apps running on the server, along with attributes such as web server and framework.
**Tags** | Lists the custom tags applied to the server, with an option to edit or delete the existing tags and add new tags.
**Issues** | Lists the discovery problems encountered on the server, categorized by features. The information includes error messages, possible causes, and remediation steps.

### Scope server data

After you review the servers and their attributes, you can choose **Select all workloads across pages** to perform the required action on the server inventory. Or you can use the search and filter capabilities to scope the list.

To scope the list in the **Infrastructure inventory** view, you can search for the name of the servers. Or you can add one or more filters on the attributes or tags associated with the servers.

### Perform user actions on server inventory

You can perform actions on all servers or a scoped set of servers. For more information, see [Perform user actions on all inventory](#perform-user-actions-on-all-inventory) earlier in this article.

> [!NOTE]
> When you create an assessment for discovered servers, you can also create an assessment for Azure VMs and Azure VMware Solution. [Learn more](how-to-create-azure-vmware-solution-assessment.md).

### Export server inventory data

You can export and review the server inventory with associated attributes and tags. The following table summarizes the fields in the exported CSV file:

Attribute name | Details
--- | ---
**ID** | ID of the server.
**Server** | Name of the server.
**Operating system** | Name of the server operating system.
**IPv6/IPv4** | IP address of the server.
**Dependencies** | Network dependencies of the server. <br><br/> This attribute shows the status of the dependency analysis, such as **Enabled**, **Disabled**, or **Failed validation**.
**Software inventory** | Count of the software installed on the server.
**DB instances** | Number of database instances running on the server.
**Web app** | Number of web apps running on the server.
**Issues** | Number of discovery problems reported on the server.
**Support Status** | Support status for the servers and databases to indicate if they're in mainstream support, end of support, or extended support.
**Tags** | Tags applied to the server.
**Source** | Source of discovery of the server, such as the fully qualified domain name (FQDN) of the vCenter Server or Hyper-V host.
**Memory (MBs)** | Total RAM, in megabytes, allocated to the server.
**Disks** | Number of disks allocated to the server.
**Cores** | Number of processor cores allocated to the server.
**Storage (GBs)** | Total storage allocated to the server.
**Network Adapters** | Count of network adapters associated with the server.
**MAC address** | MAC address of the server.
**Boot Type** | Boot type of the server (BIOS or UEFI).
**Operating system type** | Type of operating system (Windows or Linux).
**Operating system version** | Version of the operating system.
**Operating system architecture** | Type of operating system architecture, such as 32-bit or 64-bit.
**First discovery time** | First time stamp of when the server was discovered.
**Last updated time** | Last known time stamp of when the server discovery data was updated.
**Processor** | Processor details of the server.
**Resource type** | Type of resource created in Azure.
**Power Status** | Power status of the server.
**Machine type** | Type of the server, whether virtualized on VMware, Hyper-V, or bare metal (physical).
**Discovery source** | Source of discovery (appliance or import).
**Support ends in (Days)** | Number of days before support ends.
**Appliance name** | Name of the appliance used to discover the workload.

## Review the web app inventory

Select the name of a web app to see all the attributes and other metadata discovered for that workload in a detailed view. You can also add tags to an individual server. The following table lists the details to review each web app:

Tab name | Details
--- | ---
**Overview** | Overview of the web app, with basic details such as web app name, server, protocol framework, and discovery information.
**Tags** | List of custom tags applied to the web app, with an option to edit or delete existing tags and to add new tags.

### Scope web app data

After you review the web apps and their attributes, you can choose **Select all workloads across pages** to perform the required action on the server inventory. Or you can use the search and filter capabilities to scope the list.

To scope the list in the web apps view, you can search for the name of the web app. Or you can add one or more filters on the attributes or tags associated with the web apps.

### Perform user actions on the web app inventory

You can perform the following actions on all web apps or a scoped set of web apps after you review the inventory:

- **Discover**: Discover by using the appliance or CSV import to inventory more workloads.
- **Create assessment**: Create an assessment of all workloads or a scoped set of workloads to review suitability, mapped Azure services, cost, and readiness of your workloads.

  You must select one or more workloads to perform this action. [Learn more](how-to-create-assessment.md).
- **Dependency analysis**: Export dependency data for servers that automatically gather dependency data. [Learn how to export dependency data](how-to-create-group-machine-dependencies-agentless.md#export-dependency-data).
- **Tags**: Add or edit tags at scale for all workloads or a scoped set of workloads.
  
  To perform this action, select one or more workloads. You can also import tags by using an exported list of the entire inventory and importing the tag information from that CSV file.
- **Export data**: Export the inventory data for all web apps.
- **Refresh**: Refresh the view to review any updates in discovery.

## Review the database inventory

To see all the discovered databases from your environment, select **Databases** > **Explore inventory** on the left menu.

Use the **Databases Inventory** view to review all the discovered SQL Server databases running on the discovered servers. The default view displays all databases, but you can select specific filters (such as SQL) to filter the databases by type.

> [!NOTE]
> If you can't see all the discovered databases, ensure that the software inventory is completed for all servers. [Learn more](add-server-credentials.md).

# [Default columns](#tab/default-col)

The default view shows the discovered databases, along with the following set of attributes:

Attribute name | Details
--- | ---
**DB instance** | Name of the database instance.
**Server** | Name of the server on which the database is discovered.
**DB platform** | Type of database that's hosted on the server.
**Support status** | OEM support status for the database.
**User databases** | Number of databases hosted on the database instance.
**Issues** | Number of discovery problems reported on the database.
**Instance HADR participants** | Number of database instances nodes that are part of an HADR cluster.
**Database HADR participants** | Number of databases that are part of an HADR cluster.
**Tags** | Tags applied to the workload. <br><br/> Currently, Azure Migrate supports custom tags only. [Learn more](resource-tagging.md).
**HADR configuration** | Name of the HADR configuration.
**Discovery Source** | Method of discovery for the database (appliance or import).
**Appliance Name** | Name of the appliance.
**Total database size (MB)** | Size of the database instance in megabytes.

# [Optional columns](#tab/optional-col)

The optional view shows the following optional columns:

Attribute name | Details
--- | ---
**Version** | Version of the database instance.
**Edition** | Edition of the database instance.
**Total DB size (MB)** | Size of the database instance in megabytes.
**Max server memory (MB)** | Maximum memory of the server on which the database is hosted.
**Azure Migrate connection status** | Indication of whether the Azure Migrate appliance successfully connected to the SQL Server instance to gather information. If the value is **Not Connected**, the available information is either incomplete or outdated.
**DB engine status** | Power status of database engine if it's running or stopped.
**HADR enabled** | Status of enabling high availability and disaster recovery.
**First discovery time** | Time stamp of when the database was first discovered.
**Last updated time** | Time stamp of when Azure Migrate last received the payload for the database.

---

### Review database data

You can select the name of a database to view all the attributes and additional metadata discovered for that workload. This detailed view enables you to:

- Explore any problems encountered during the discovery of the database.
- Add, edit, or delete tags for an individual database.

You can review the following details for each database:

Tab name | Details
--- | ---
**Overview** | This tab provides an overview of the database instance, including the name of the server that hosts the database, the support status, and the database size. This tab also offers a comprehensive overview of the platform configuration, HADR configuration, and discovery details.
**Tags** | The database has a list of custom tags. You can edit or delete existing tags or add new ones.
**Issues** |This section details the problems encountered during the database discovery, their possible causes, and the recommended remediations for successful discovery.

### Scope database data

After you review the databases and their attributes, you can choose **Select all workloads across pages** to perform the necessary actions on the database inventory. Or you can use the search and filter capabilities to scope the list.

You can narrow down the list in the database view by searching for the database name or applying filters based on attributes or tags. You can also add a tag to name the scoped workload.

After you review the inventory, you can perform the following actions on all databases or a scoped set of databases:

Action name | Details
--- | ---
**Discover** |Use an appliance or import a CSV file into the inventory to discover more workloads.
**Create assessment** | Create an assessment of all workloads or a selected set of workloads to review their suitability, mapped Azure services, cost, and readiness. <br><br/> Perform this action by selecting one or more workloads. [Learn how to create an assessment](tutorial-assess-webapps.md).
**Tags** | Add or edit tags at scale by selecting all workloads or a scoped set of workloads. <br><br/> To perform this action, select one or more workloads. Import tags by using an exported list of the entire inventory and then importing the tag information from that CSV file. [Learn how to add tags](resource-tagging.md).
**Export data** | Export the inventory data for all databases.
**Columns** | Select optional attributes for the discovered workloads.
**Refresh** | Refresh the view to review any updates in discovery.

## Related content

- [Create a group for assessment](how-to-create-a-group.md)
