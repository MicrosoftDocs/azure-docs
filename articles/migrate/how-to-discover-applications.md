---
title: Discover software inventory on on-premises servers with Azure Migrate 
description: Learn how to discover software inventory on on-premises servers with Azure Migrate Discovery and assessment.
author: vikram1988
ms.author: vibansa
ms.manager: ronai
ms.service: azure-migrate
ms.topic: how-to
ms.reviewer: v-uhabiba
ms.date: 02/06/2025
ms.custom: engagement-fy23
# Customer intent: As an IT professional, I want to discover software inventory on my on-premises servers using a cloud-based assessment tool, so that I can effectively plan and implement a migration strategy to Azure for my workloads.
---

# Discover installed software inventory, web apps, and database instances

This article describes how to discover installed software, ASP.NET web apps, and SQL, PostgreSQL and MYSQL Server instances and databases on servers running in your on-premises environment, using Azure Migrate.

::: moniker range="migrate"
In this tutorial, you learn how:
- Software inventory helps identify the key software across categories such as Security & Compliance, Monitoring & operations, Business applications etc.
- Software inventory identifies Web hosting and Databases & Data platform workloads to plan the migration of your workloads to Azure
- Software insights helps identify the software running End-of-support (EoS) versions or have known vulnerabilities to prioritize them in your migration planning
- Software insights provides a list of Potential Targets (1P & 3P Azure native services) that can be considered for migration of your software to Azure
::: moniker-end

> [!NOTE]
> Software inventory is performed by the Azure Migrate appliance using server credentials. The discovery is completely agentless, that is, no agents are installed on the servers to collect this data.

## Before you start

- Ensure that you've [created an Azure Migrate project](./create-manage-projects.md).
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
    - The details of the source environment (vCenter Servers /Hyper-V host(s) or cluster(s)/physical servers) which you want to discover.
    - Server credentials, which can be domain/ Windows (non-domain)/ Linux (non-domain) credentials. [Learn more](add-server-credentials.md) about how to provide credentials and how the appliance handles them.
    - Verify the permissions required to perform software inventory. You need a guest user account for Windows servers, and a regular/normal user account (non-sudo access) for all Linux servers.

### Add credentials and initiate discovery

1. Go to the appliance configuration manager, complete the prerequisite checks and registration of the appliance.
2. Navigate to the **Manage credentials and discovery sources** panel.
3. In **Step 1: Provide credentials for discovery source**, select on **Add credentials** to  provide credentials for the discovery source that the appliance uses to discover servers running in your environment.
4. In **Step 2: Provide discovery source details**, select **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the discovery source.

:::image type="content" source="./media/how-to-discover-applications/add-server-credentials.png" alt-text="Screenshot shows how to add server credentials." lightbox="./media/how-to-discover-applications/add-server-credentials.png":::

5. In **Step 3: Provide server credentials to perform guest discovery of installed software, dependencies and workloads**, select **Add credentials** to provide multiple server credentials to perform software inventory.
6. Select **Start discovery**, to initiate discovery.

After the server discovery is complete, appliance initiates the discovery of installed software, roles, and features (software inventory) on the servers. The duration depends on the number of discovered servers. For 500 servers, it takes approximately one hour for the discovered inventory to appear in the Azure Migrate portal. After the initial discovery is complete, software inventory data is collected and sent to Azure once every 24 hours. Review the [data](discovered-metadata.md#software-inventory-data) collected by appliance during software inventory.

## Review the software inventory

::: moniker range="migrate-classic"

After software inventory has completed, you can review and export the inventory in the Azure portal.
 
1. In **Azure Migrate - Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the displayed count to open the **Discovered servers** page.

    > [!NOTE]
    > At this stage you can optionally also enable dependency analysis for the discovered servers, so that you can visualize dependencies across servers you want to assess. [Learn more](concepts-dependency-visualization.md) about dependency analysis.
   
2. In **Software inventory** column, select the displayed count to review the discovered applications, roles, and features.
4. To export the inventory, in **Discovered Servers**, select **Export software inventory**.
 
The software inventory is exported and downloaded in Excel format. The **Software Inventory** sheet displays all the apps discovered across all the servers.

::: moniker-end

::: moniker range="migrate"

After software inventory has completed, you can review the inventory in the Azure portal at the project level or per server level.

### Review software at project level

1. Go to your Azure Migrate project and from the left menu, select **Software** under **Explore inventory** to review software discovered from all servers in the project.

:::image type="content" source="./media/how-to-discover-applications/security-insights-overview.png" alt-text="Screenshot shows the security insights." lightbox="./media/how-to-discover-applications/security-insights-overview.png":::

2. You can see some software **category cards** available on top of the view for quick access to some category of software.
3. By default, **All software** card is selected but you can select from **Security & compliance**, **Databases & Data platforms**, **Web hosting**, **Business applications**, **Others** to review discovered software that have been classified in that category.
4. You can view the aggregated insights for the software inventory to review **Servers with discovery issues**- selecting **View issues** takes you to the Action Center view which is prefiltered to show all servers with issues in gathering software inventory. You can either review the errors at per server level or switch to **View by issues** to review issues aggregated by Error codes and take the suggested remedial action to resolve the issues.
5. The other aggregated insight in the software view shows the count of unique **Vulnerabilities** identified across all the discovered software. You can choose to select **View all** to review identified vulnerabilities across all discovered software or review them at per software level from the table below.
6. In the table, you can review each software metadata like **Name**, **Publisher**, **Version** that have been gathered through Software inventory, performed using servers credentials you provided on the Azure Migrate appliance.
7. You can also review the additional insights like **Category**, **Subcategory**, **Support Status**, **Server count** and **Vulnerabilities** which are derived using the metadata gathered as part of software inventory.

    > [!NOTE]
    > The gathered software data is processed further to derive **Category**, **Subcategory**, **Support Status** and **Vulnerabilities** . Since this information is AI-generated, there might be inaccuracies.

8. You can select the **Server count** against each software to view the list of servers discovered from your datacenter that are running that particular software version. You can use this view to select a few or all servers to **Add and edit tags**. This will help you scope the servers running the specific software during migration planning.
9. You can select the **Vulnerabilities** count against each software to view the identified CVE (Common Vulnerabilities and Exposures) IDs for that software version along with other details such as CVSS (Common Vulnerability Scoring System), Risk Level, Age and date the CVE was published on. You can use this view to **Export** the vulnerabilities information for a particular software.

    > [!NOTE]
    > Vulnerabilities are sourced from National Vulnerability Database [NVD](https://www.nist.gov/itl/nvd) and mapped to discovered software. [Learn more](insights-overview.md#how-are-insights-derived) on how Insights (preview) are generated and for complete list of vulnerabilities, use [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

10. You can also review the list of **Potential Targets** that have been suggested to plan the migration of your software to the Azure First Party(1P) services or Third Party (3P) Independent Software Vendor (ISV) services available as [Azure Native integrations](/azure/partner-solutions/partners) through Azure Marketplace.
11. The software inventory view can be scoped by using **Search & filter** using any of the metadata like **Name**, **Publisher**, **Version** or the additional insights like **Category**, **Subcategory**, **Support Status**, **Servers count** and **Vulnerabilities**.
12. You can **Export** the software inventory data across the datacenter from **All software**. If you select any other category card, exported file will have information for those scoped sets of software.
    
    > [!NOTE]
    > You can also export scoped set of software by filtering the view using one or more filters on attributes like **Name**, **Publisher**, **Version**, **Category**, **Subcategory**, **Support Status**,**Servers count** and **Vulnerabilities**. The file is exported in CSV format and can be reviewed using Microsoft Excel.

#### Software classification & Potential Targets 

The table below shows different categories and subcategories in which the discovered software is categorized along with some examples of software found running in IT datacenters with the Potential Targets suggested for all software at a subcategory level:

| **Category**                     | **Subcategory**                  | **Software examples**                                                                                                      | **Azure Services (1P)**                                                                                          | **Azure Native integrations (3P ISV services)**                                                                                     |
|----------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **Software Runtime**    | Runtime Environment              | .NET CLR, Java Runtime (JRE), Node.js                                                                                                | Azure App Service, Azure Functions                                                                               | —                                                                                                           |
|                                  | Middleware                       | COM+, CORBA, gRPC                                                                                                                     | Azure Integration Services (Logic Apps, Service Bus), Azure Functions, Microsoft Bot Framework                   | —                                                                                                           |
|                                  | Libraries                        | Visual C++ Redistributable, DLLs                                                                                                      | Azure App Services, Azure Functions                                                                              |                                                                                                             |
| **Web Hosting**                  | Web Servers                      | Apache, IIS, Nginx, HAProxy, Varnish Cache, Squid Proxy                                                                              | Azure App Service, Azure Kubernetes Service (AKS), Azure Virtual Machine                                         | —                                                                                                           |
|                                  | Application Servers              | WebLogic, JBoss/WildFly, WebSphere, IIS with ASP.NET, TIBCO, Oracle Fusion Middleware, SAP NetWeaver                                 | Azure App Service, Azure Kubernetes Service (AKS)                                                                | —                                                                                                           |
| **Business Applications**| Enterprise Resource Planning     | SAP, Oracle Financials                                                                                                                | Dynamics 365 Finance, SAP on Azure                                                                               | —                                                                                                           |
|                                  | Business Intelligence            | Tableau, Qlik                                                                                                                         | Power BI                                                                                                          | Informatica Intelligent Data Management Cloud - An Azure Native ISV Service                                |
|                                  | Customer Support                 | Salesforce Service Cloud                                                                                                              | Dynamics 365 Customer Service                                                                                    | —                                                                                                           |
|                                  | Finance & Accounting             | Tally, QuickBooks                                                                                                                     | Dynamics 365 Finance                                                                                              | —                                                                                                           |
|                                  | Business Apps                    | Custom LOB apps                                                                                                                       | Microsoft Power Platform                                                                                          | —                                                                                                           |
| **Software Development**| Development Environment           | Eclipse, Visual Studio                                                                                                                | GitHub Codespaces, Visual Studio Codespace                                                                          | —                                                                                                           |
|                                  | Build Tools                      | GCC, MSBuild                                                                                                                          | Azure Pipelines, Visual Studio Code, Visual Studio                                                        | —                                                                                                           |
|                                  | Application Lifecycle Management | Jira, Rally                                                                                                                           | Azure Boards                                                                                               | —                                                                                                           |
|                                  | QA Automation                    | Selenium, JMeter                                                                                                                      | Azure App Testing, Azure DevOps Test Plans, Azure DevTest Labs                                                   | —                                                                                                           |
| **Infrastructure Management**| Cloud Infrastructure           | VMware Tools, Hyper-V                                                                                                                 | Azure Virtual Machines, Azure Storage, Azure Networking                                                          | —                                                                                                           |
|                                  | Backup & Availability            | Veeam, Commvault                                                                                                                      | Azure Backup, Azure Site Recovery                                                                                | —                                                                                                           |
|                                  | Orchestration & Provisioning     | Ansible, Puppet                                                                                                                       | Azure Automation, Bicep, Terraform on Azure                                                                      | —                                                                                                           |
|                                  | Cloud Management                 | vCenter, CloudHealth                                                                                                                  | Azure Policy, Azure Lighthouse, Microsoft Purview                                                                | —                                                                                                           |
|                                  | Desktop Virtualization           | Citrix, VMware Horizon                                                                                                                | Azure Virtual Desktop, Windows 365                                                                               | —                                                                                                           |
| **Productivity & Collaboration**| Document Sharing             | SharePoint, Google Drive                                                                                                              | SharePoint Online                                                                         | —                                                                                                           |
|                                  | Communication Tools              | Slack, Zoom                                                                                                                           | Microsoft Teams                                                                                                   | —                                                                                                           |
|                                  | Email & Messaging                | Exchange Server, Gmail                                                                                                                | Exchange Online, Microsoft 365                                                                                   | —                                                                                                           |
|                                  | Office Productivity              | MS Office, LibreOffice                                                                                                                | Microsoft 365, Microsoft Loop                                                                                    | —                                                                                                           |
| **Security & Compliance**| Identity and Access Management   | Active Directory, Okta                                                                                                                | Microsoft Entra ID                                                                                                | —                                                                                                           |
|                                  | Threat Detection                 | CrowdStrike, McAfee                                                                                                                   | Microsoft Defender for Cloud                                                                                      | Elastic Cloud (Elasticsearch), Cloud NGFWs by Palo Alto Networks, DataDog - An Azure Native ISV Service    |
|                                  | SIEM                             | Splunk, QRadar                                                                                                                        | Microsoft Sentinel                                                                                                | Elastic Cloud (Elasticsearch)                                                                               |
|                                  | Anti-virus & Anti-malware        | Symantec, Trend Micro                                                                                                                 | Microsoft Defender for Cloud                                                                                      | Elastic Cloud (Elasticsearch), Cloud NGFWs by Palo Alto Networks                                           |
|                                  | Patch Management                 |        SCCM, SolarWinds                                                                                                                                | Azure Update Manager                                                                                              | —                                                                                                           |
|                                  | General Security Tools           | Key Vault, DLP tools                                                                                                                  | Microsoft Purview, Azure Key Vault                                                                               | —                                                                                                           |
| **System & Software Utilities**| Operating System             | Windows Server, Linux                                                                                                                 | Azure Virtual Machines                                                                                            | —                                                                                                           |
|                                  | Content Storage                  | NAS, SAN                                                                                                                              | Azure Blob Storage, Azure Archive Storage                                                                        | Azure Native Pure Storage Cloud Service, Azure Native Qumulo, Dell PowerScale                               |
|                                  | System Drivers                   |           —                                                                                                                             | —                                                                                                                 | —                                                                                                           |
|                                  | Software Utilities               | Packages like drivers, runtimes, redistributables, patches, helpers, plugins, components, SDKs                                                |           —                                                                                                        |     —                                                                                                        |
| **Databases & Data Platforms**   | Relational Database (SQL)        |                   —                                                                                                                     | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM                                           | —                                                                                                           |
|                                  | Relational Database (MySQL)      |          —                                                                                                                              | Azure Database for MySQL (Flexible Server), MySQL on Azure VM                                                    | —                                                                                                           |
|                                  | Relational Database (PostgreSQL) |         —                                                                                                                               | Azure Database for PostgreSQL (Flexible Server), PostgreSQL on Azure VM                                          | —                                                                                                           |
|                                  | Relational Database (Oracle)     |         —                                                                                                                               | Oracle Database@Azure, Oracle on Azure VM                                                                        | —                                                                                                           |
|                                  | Relational Database (MariaDB)    |           —                                                                                                                             | Azure Database for MariaDB, MariaDB on Azure VM                                                                  | —                                                                                                           |
|                                  | NoSQL Databases                  | MongoDB, Apache Cassandra                                                                                                             | Azure Cosmos DB, Azure Managed Instance for Apache Cassandra                                                     | MongoDB Atlas                                                                                                |
| **Data Analytics & Management**| Data Analytics               | SAS, Informatica                                                                                                                      | Azure Synapse, Power BI, Azure Data Explorer                                                                     | Informatica Intelligent Data Management Cloud - An Azure Native ISV Service                                  |
|                                  | Data Management                  | MongoDB, Apache Airflow                                                                                                               | Azure Data Factory, Azure Data Lake, Azure Cosmos DB, Azure Fabric, Microsoft Purview                            | —                                                                                                           |
|                                  | Document Management              | Alfresco, OpenText                                                                                                                    | SharePoint Online                                                                                                 | —                                                                                                           |
| **Monitoring & Operations**| Observability                  | Nagios, SolarWinds                                                                                                                    | Azure Monitor, Log Analytics                                                                                      | Azure Native Dynatrace Service, Azure Native New Relic Service, DataDog - An Azure Native ISV Service       |
|                                  | IT Asset Management (ITAM)       | Lansweeper, ServiceNow                                                                                                                | Microsoft Purview                                                                                                 | —                                                                                                           |
|                                  | Remote Access                    | TeamViewer, RDP                                                                                                                       | Azure Bastion, Azure Virtual Desktop                                                                             | —                                                                                                           |
| **Industry Applications**| Healthcare                       | Epic, Cerner                                                                                                                          | Microsoft Cloud for Healthcare                                                                                     | —                                                                                                           |
|                                  | Manufacturing                    | SCADA, MES                                                                                                                            | Microsoft for Manufacturing, Azure IoT Hub, Azure Digital Twins                                                  | —                                                                                                           |
|                                  | Engineering                      | HPC clusters, CAD tools                                                                                                               | Azure HPC (High Performance Computing), Azure Digital Twins, Azure Batch                                         | —                                                                                                           |
|                                  | Industry-specific                | Custom industry apps                                                                                                                  | —                                                                                                                 | —                                                                                                           |
| 


> [!NOTE]
> You can also find two more categories- **Miscellaneous** which contains all the supporting components that are installed as part of a software package and **Unclassified** which contains software that are yet to be processed for classification. You may notice a difference in count of Unclassified software as the classification is performed periodically.

### Review software at server level

In addition to reviewing software at project level, you can also review them at per server level by following these steps:

1. Go to your Azure Migrate project and from the left menu, select **Infrastructure** under **Explore inventory** to review software discovered from each server.

:::image type="content" source="./media/how-to-discover-applications/software-inventory-infra-view.png" alt-text="Screenshot shows the software inventory view of infrastructure." lightbox="./media/how-to-discover-applications/software-inventory-infra-view.png":::

2. You can select the count of **software** for any server to get to a tab which shows all software discovered from this server.
3. In this tab, you can review each software metadata like **Name**, **Publisher**, **Version** and additional insights like **Category**, **Subcategory**, **Support Status** and **Vulnerabilities** which are derived using the metadata gathered as part of software inventory.
4. The software inventory view can be scoped by using **Search & filter** using any of the metadata like **Name**, **Publisher**, **Version** or the additional insights like **Category**, **Subcategory**, **Support Status**, and **Vulnerabilities**.
5. In addition to the software, you can select the **Roles and features** tab to view the roles and features installed on Windows servers.

::: moniker-end

## Discover SQL Server instances and databases

- Software inventory also identifies the SQL Server instances running in your VMware, Microsoft Hyper-V, and Physical/ Bare-metal environments as well as IaaS services of other public cloud.
- If you haven't provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective SQL Server instances.

    > [!NOTE]
    > Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

To discover SQL Server instances and databases, the Windows/ Domain account, or SQL Server account [requires these low privilege read permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance. You can use the [low-privilege account provisioning utility](least-privilege-credentials.md) to create custom accounts or use any existing account that is a member of the sysadmin server role for simplicity.

<!--
[!INCLUDE [Minimal Permissions for SQL Assessment](../../includes/database-migration-service-sql-permissions.md)]
--->

Once connected, the appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours, and the performance data is captured every 30 seconds. Hence, any change to the properties of the SQL Server instance and databases such as database status, compatibility level, etc. can take up to 24 hours to update on the portal.

## Discover PostgreSQL instances and databases (preview) 

- Software inventory also identifies the PostgreSQL instances running in your VMware, Microsoft Hyper-V, and Physical/Bare-metal environments as well as IaaS services of other public cloud. 

- If you haven't provided Windows or Linux authentication and PostgreSQL instance authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective PostgreSQL instances. 

    > [!NOTE]
    > Appliance can connect to only those PostgreSQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

- PostgreSQL authentication requirements: To connect to a source PostgreSQL Server instance, the sign-in must meet the following requirements:
    - You must have at least the `CONNECT` privilege on the PostgreSQL databases.
    - You must be assigned the `pg_read_all_settings role` or have equivalent permissions to read server configuration settings.
- Learn more about [minimum user privileged script](postgresql-least-privilege-configuration.md).
- After the connection, the appliance collects configuration data from PostgreSQL instances and databases. It updates the PostgreSQL configuration data every 24 hours.   
- The appliance collects detailed configuration data from the PostgreSQL Server, including server parameters from `postgresql.conf,` database properties and sizes, installed extensions, replication settings, and user and role configurations.
- Configuration data is refreshed every 24 hours. As a result, changes to the PostgreSQL Server instance—such as updates to database status, server parameters, or newly installed extensions—may take up to 24 hours to appear in the portal.

> [!IMPORTANT]
> - Ensure your PostgreSQL instances are set up to accept connections from the appliance IP address.
> - The default PostgreSQL port 5432 or the custom port is accessible if one is configured.
> - The listen_addresses parameter in postgresql.conf must include the network interface that the appliance can access.
> - Add entries in the pg_hba.conf file to allow connections from the appliance IP address.

Learn more about [PostgreSQL configuration](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html).

## Discover MySQL Server instances and databases (preview)

- Software inventory also identifies the MySQL Server instances running in your VMware, Microsoft Hyper-V, and Physical/ Bare-metal environments as well as IaaS services of other public cloud.
- If you haven't provided Windows or Linux authentication and MySQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective MySQL Server instances.

    > [!NOTE]
    > Appliance can connect to only those MySQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

Once connected, the appliance gathers configuration and performance data of MySQL Server instances and databases. The MySQL Server configuration data is updated once every 24 hours, and the performance data is captured every 30 seconds. Hence, any change to the properties of the MySQL Server instance and databases such as database status, compatibility level, etc. can take up to 24 hours to update on the portal.

## Discover ASP.NET web apps

- Software inventory identifies web server role existing on discovered servers. If a server has web server role enabled, Azure Migrate performs web apps discovery on the server.
- User can add both domain and non-domain credentials on appliance. Make sure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in source environment.
- After the appliance is connected, it gathers configuration data for IIS web server and ASP.NET web apps. Web apps configuration data is updated once every 24 hours.


## Discover File Server Instances  

- Software inventory identifies File Server role installed on discovered servers running on VMware, Microsoft Hyper-V, and physical/bare-metal environments, along with IaaS services in various public cloud platforms.   
- The File Server (FS-FileServer) role service in Windows Server is a part of the File and Storage Services role. Windows Server machines with File Server role enabled are determined to be used as file servers.  
- Users can view the discovered file servers in the **Discovered servers** screen. The File server column in **Discovered servers** indicates whether a server is a file server or not.  
- Currently, only Windows Server 2008 and later are supported. 

## Next steps

- [Create an assessment](how-to-create-assessment.md) for discovered servers.
- [Assess web apps](how-to-create-azure-app-service-assessment.md) for migration to Azure App Service.
- [Assess Spring Boot apps](how-to-create-azure-spring-apps-assessment.md) for migration to Azure Spring Apps.
