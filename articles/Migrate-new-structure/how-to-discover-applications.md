---
title: Discover software inventory on on-premises servers with Azure Migrate 
description: Learn how to discover software inventory on on-premises servers with Azure Migrate Discovery and assessment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 11/22/2023
ms.custom: engagement-fy23
---

# Discover installed software inventory, web apps, and SQL Server instances and databases

This article describes how to discover installed software inventory, web apps, and SQL Server instances and databases on servers running in your on-premises environment, using the Azure Migrate: Discovery and assessment tool.

Performing software inventory helps identify and tailor a migration path to Azure for your workloads. Software inventory uses the Azure Migrate appliance to perform discovery, using server credentials. It's completely agentless, that is, no agents are installed on the servers to collect this data.


## Before you start

- Ensure that you've [created a project](./create-manage-projects.md) with the Azure Migrate: Discovery and assessment tool added to it.
- Review the requirements based on your environment and the appliance you're setting up to perform software inventory:

    Environment | Requirements
    --- | ---
    Servers running in VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware)<br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements) <br/> Review [software inventory requirements](migrate-support-matrix-vmware.md#software-inventory-requirements)
    Servers running in Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v)<br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access)<br/> Review [software inventory requirements](migrate-support-matrix-hyper-v.md#software-inventory-requirements)
    Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical)<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access)<br/> Review [software inventory requirements](migrate-support-matrix-physical.md#software-inventory-requirements)
- Review the Azure URLs that the appliance needs to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).

## Deploy and configure the Azure Migrate appliance

1. Deploy the Azure Migrate appliance to start discovery. To deploy the appliance, you can use the [deployment method](migrate-appliance.md#deployment-methods) as per your environment. After deploying the appliance, you need to register it with the project and configure it to initiate the discovery.
2. As you configure the appliance, you need to specify the following in the appliance configuration manager:
    - The details of the source environment (vCenter Server(s) /Hyper-V host(s) or cluster(s)/physical servers) which you want to discover.
    - Server credentials, which can be domain/ Windows (non-domain)/ Linux (non-domain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
    - Verify the permissions required to perform software inventory. You need a guest user account for Windows servers, and a regular/normal user account (non-sudo access) for all Linux servers.

### Add credentials and initiate discovery

1. Open the appliance configuration manager, complete the prerequisite checks and registration of the appliance.
2. Navigate to the **Manage credentials and discovery sources** panel.
1.  In **Step 1: Provide credentials for discovery source**, select on **Add credentials** to  provide credentials for the discovery source that the appliance uses to discover servers running in your environment.
1. In **Step 2: Provide discovery source details**, select **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the discovery source.
:::image type="content" source="./media/tutorial-discover-vmware/appliance-manage-sources.png" alt-text="Panel 3 on appliance configuration manager for vCenter Server details.":::
1. In **Step 3: Provide server credentials to perform software inventory and agentless dependency analysis**, select **Add credentials** to provide multiple server credentials to perform software inventory.
1. Select **Start discovery**, to initiate discovery.

 After the server discovery is complete, appliance initiates the discovery of installed applications, roles, and features (software inventory) on the servers. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate portal. After the initial discovery is complete, software inventory data is collected and sent to Azure once every 24 hours.Review the [data](discovered-metadata.md#software-inventory-data) collected by appliance during software inventory.

## Review and export the inventory

After software inventory has completed, you can review and export the inventory in the Azure portal.

1. In **Azure Migrate - Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the displayed count to open the **Discovered servers** page.

    > [!NOTE]
    > At this stage you can optionally also enable dependency analysis for the discovered servers, so that you can visualize dependencies across servers you want to assess. [Learn more](concepts-dependency-visualization.md) about dependency analysis.

2. In **Software inventory** column, select the displayed count to review the discovered applications, roles, and features.
4. To export the inventory, in **Discovered Servers**, select **Export software inventory**.

The software inventory is exported and downloaded in Excel format. The **Software Inventory** sheet displays all the apps discovered across all the servers.

## Discover SQL Server instances and databases

- Software inventory also identifies the SQL Server instances running in your VMware, Microsoft Hyper-V, and Physical/ Bare-metal environments as well as IaaS services of other public cloud.
- If you haven't provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective SQL Server instances.

    > [!NOTE]
    > Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

The sign-in used to connect to a source SQL Server instance requires sysadmin role.

<!--
[!INCLUDE [Minimal Permissions for SQL Assessment](../../includes/database-migration-service-sql-permissions.md)]
--->

Once connected, the appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours, and the performance data is captured every 30 seconds. Hence, any change to the properties of the SQL Server instance and databases such as database status, compatibility level etc. can take up to 24 hours to update on the portal.

## Discover ASP.NET web apps

- Software inventory identifies web server role existing on discovered servers. If a server has web server role enabled, Azure Migrate performs web apps discovery on the server.
- User can add both domain and non-domain credentials on appliance. Make sure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in source environment.
- After the appliance is connected, it gathers configuration data for IIS web server and ASP.NET web apps. Web apps configuration data is updated once every 24 hours.

## Discover Spring Boot apps (preview)

- Software inventory identifies Spring Boot role existing on discovered servers. If a server has Spring Boot role enabled, Azure Migrate performs Spring Boot apps discovery on the server.
- Users can add both domain and non-domain credentials on the appliance. Ensure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. 
  > [!Note]
  > The credentials are never sent to Microsoft and remain on the appliance running in source environment.
- After the appliance is connected, it gathers configuration data for Spring Boot apps. Spring Boot apps configuration data is updated once every 24 hours.
- Discovery of Spring Boot apps requires SSH and SFTP access from the appliance to the respective servers. The Spring Boot apps that can be discovered depend on the SSH user identity and its corresponding file permissions. Ensure the credentials you provide have the necessary privileges for the apps you target to discover.
- Currently, Windows servers aren't supported for Spring Boot app discovery, only Linux servers are supported.
- Learn more about appliance requirements on [Azure Migrate appliance requirements](migrate-appliance.md) and [discovery support](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless).

## Discover File Server Instances  

- Software inventory identifies File Server role installed on discovered servers running on VMware, Microsoft Hyper-V, and physical/bare-metal environments, along with IaaS services in various public cloud platforms.   
- The File Server (FS-FileServer) role service in Windows Server is a part of the File and Storage Services role. Windows Server machines with File Server role enabled are determined to be used as file servers.  
- Users can view the discovered file servers in the **Discovered servers** screen. The File server column in **Discovered servers** indicates whether a server is a file server or not.  
- Currently, only Windows Server 2008 and later are supported. 

## Next steps

- [Create an assessment](how-to-create-assessment.md) for discovered servers.
- [Assess web apps](how-to-create-azure-app-service-assessment.md) for migration to Azure App Service.
- [Assess Spring Boot apps](how-to-create-azure-spring-apps-assessment.md) for migration to Azure Spring Apps.