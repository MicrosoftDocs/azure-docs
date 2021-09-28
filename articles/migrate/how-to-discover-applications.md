---
title: Discover software inventory on on-premises servers with Azure Migrate 
description: Learn how to discover software inventory on on-premises servers with Azure Migrate Discovery and assessment.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: how-to
ms.date: 03/18/2021
---

# Discover installed software inventory, web apps, and SQL Server instances and databases

This article describes how to discover installed software inventory, web apps, and SQL Server instances and databases on servers running in your VMware environment, using Azure Migrate: Discovery and assessment tool.

Performing software inventory helps identify and tailor a migration path to Azure for your workloads. Software inventory uses the Azure Migrate appliance to perform discovery, using server credentials. It is completely agentless- no agents are installed on the servers to collect this data.

## Before you start

- Ensure that you have [created a project](./create-manage-projects.md) with the Azure Migrate: Discovery and assessment tool added to it.
- Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) to perform software inventory.
- Review [appliance requirements](migrate-support-matrix-vmware.md#azure-migrate-appliance-requirements) before setting up the appliance.
- Review [application discovery requirements](migrate-support-matrix-vmware.md#software-inventory-requirements) before initiating software inventory on servers.

## Deploy and configure the Azure Migrate appliance

1. [Review](migrate-appliance.md#appliance---vmware) the requirements for deploying the Azure Migrate appliance.
2. Review the Azure URLs that the appliance will need to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).
3. [Review data](migrate-appliance.md#collected-data---vmware) that the appliance collects during discovery and assessment.
4. [Note](migrate-support-matrix-vmware.md#port-access-requirements) port access requirements for the appliance.
5. [Deploy the Azure Migrate appliance](how-to-set-up-appliance-vmware.md) to start discovery. To deploy the appliance, you download and import an OVA template into VMware to create a server running in your vCenter Server. After deploying the appliance, you need to register it with the project and configure it to initiate the discovery.
6. As you configure the appliance, you need to specify the following in the appliance configuration manager:
    - The details of the vCenter Server to which you want to connect.
    - vCenter Server credentials scoped to discover the servers in your VMware environment.
    - Server credentials, which can be domain/ Windows(non-domain)/ Linux(non-domain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how we handle them.

## Verify permissions

- You need to [create a vCenter Server read-only account](./tutorial-discover-vmware.md#prepare-vmware) for discovery and assessment. The read-only account needs privileges enabled for **Virtual Machines** > **Guest Operations**, in order to interact with the servers to perform software inventory.
- You can add multiple domain and non-domain (Windows/Linux) credentials on the appliance configuration manager for application discovery. You need a guest user account for Windows servers, and a regular/normal user account (non-sudo access) for all Linux servers.[Learn more](add-server-credentials.md) about how to provide credentials and how we handle them.

### Add credentials and initiate discovery

1. Open the appliance configuration manager, complete the prerequisite checks and registration of the appliance.
2. Navigate to the **Manage credentials and discovery sources** panel.
1.  In **Step 1: Provide vCenter Server credentials**, click on **Add credentials** to  provide credentials for the vCenter Server account that the appliance will use to discover servers running on the vCenter Server.
1. In **Step 2: Provide vCenter Server details**, click on **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the vCenter Server instance
:::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Panel 3 on appliance configuration manager for vCenter Server details":::
1. In **Step 3: Provide server credentials to perform software inventory, agentless dependency analysis, discovery of SQL Server instances and databases and discovery of ASP.NET web apps in your VMware environment.**, click **Add credentials** to provide multiple server credentials to initiate software inventory.
1. Click on **Start discovery**, to kick off vCenter Server discovery.

 After the vCenter Server discovery is complete, appliance initiates the discovery of installed applications, roles, and features (software inventory). The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate portal.

## Review and export the inventory

After software inventory has completed, you can review and export the inventory in the Azure portal.

1. In **Azure Migrate - Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, click the displayed count to open the **Discovered servers** page.

    > [!NOTE]
    > At this stage you can optionally also enable dependency analysis for the discovered servers, so that you can visualize dependencies across servers you want to assess. [Learn more](concepts-dependency-visualization.md) about dependency analysis.

2. In **Software inventory** column, click the displayed count to review the discovered applications, roles, and features.
4. To export the inventory, in **Discovered Servers**, click **Export software inventory**.

The software inventory is exported and downloaded in Excel format. The **Software Inventory** sheet displays all the apps discovered across all the servers.

## Discover SQL Server instances and databases

- Software inventory also identifies the SQL Server instances running in your VMware environment.
- If you have not provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective SQL Server instances.

    > [!NOTE]
    > Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

Once connected, appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours and the performance data are captured every 30 seconds. Hence any change to the properties of the SQL Server instance and databases such as database status, compatibility level etc. can take up to 24 hours to update on the portal.

## Discover ASP.NET web apps

Software inventory identifies web server role existing on discovered servers. If a server is found to have web server role enabled, Azure Migrate will perform web apps discovery on the server.
User can add both domain and non-domain credentials on appliance. Make sure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in source environment.
After the appliance is connected, it gathers configuration data for IIS web server and ASP.NET web apps. Web apps configuration data is updated once every 24 hours.

## Next steps

- [Create an assessment](how-to-create-assessment.md) for discovered servers.
- [Assess web apps](how-to-create-azure-app-service-assessment.md) for migration to Azure App Service.
