---
title: Enable SQL Insights (preview)
description: Enable SQL Insights (preview) in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 1/18/2022
---

# Enable SQL Insights (preview)
This article describes how to enable [SQL Insights (preview)](sql-insights-overview.md) to monitor your SQL deployments. Monitoring is performed from an Azure virtual machine that makes a connection to your SQL deployments and uses Dynamic Management Views (DMVs) to gather monitoring data. You can control what datasets are collected and the frequency of collection using a monitoring profile.

> [!NOTE]
> To enable SQL Insights (preview) by creating the monitoring profile and virtual machine using a resource manager template, see [Resource Manager template samples for SQL Insights (preview)](resource-manager-sql-insights.md).

To learn how to enable SQL Insights (preview), you can also refer to this Data Exposed episode.
> [!VIDEO https://docs.microsoft.com/Shows/Data-Exposed/How-to-Set-up-Azure-Monitor-for-SQL-Insights/player?format=ny]

## Create Log Analytics workspace
SQL Insights stores its data in one or more [Log Analytics workspaces](../logs/data-platform-logs.md#log-analytics-workspaces). Before you can enable SQL Insights, you need to either [create a workspace](../logs/quick-create-workspace.md) or select an existing one. A single workspace can be used with multiple monitoring profiles, but the workspace and profiles must be located in the same Azure region. To enable and access the features in SQL Insights, you must have the [Log Analytics contributor role](../logs/manage-access.md) in the workspace. 

## Create monitoring user 
You need a user (login) on the SQL deployments that you want to monitor. Follow the procedures below for different types of SQL deployments.

The instructions below cover the process per type of SQL that you can monitor. To accomplish this with a script on several SQL resources at once, please refer to the following [README file](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/SQL%20Insights%20Onboarding%20Scripts/Permissions_LoginUser_Account_Creation-README.txt) and [example script](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/SQL%20Insights%20Onboarding%20Scripts/Permissions_LoginUser_Account_Creation.ps1).

### Azure SQL Database

> [!NOTE]
> SQL Insights (preview) does not support the following Azure SQL Database scenarios:
> - **Elastic pools**: Metrics cannot be gathered for elastic pools. Metrics cannot be gathered for databases within elastic pools.
> - **Low service tiers**: Metrics cannot be gathered for databases on Basic, S0, S1, and S2 [service tiers](/azure/azure-sql/database/resource-limits-dtu-single-databases)
> 
> SQL Insights (preview) has limited support for the following Azure SQL Database scenarios:
> - **Serverless tier**: Metrics can be gathered for databases using the [serverless compute tier](/azure/azure-sql/database/serverless-tier-overview). However, the process of gathering metrics will reset the auto-pause delay timer, preventing the database from entering an auto-paused state.

Connect to an Azure SQL database with [SQL Server Management Studio](/azure/azure-sql/database/connect-query-ssms), [Query Editor (preview)](/azure/azure-sql/database/connect-query-portal) in the Azure portal, or any other SQL client tool.

Run the following script to create a user with the required permissions. Replace *user* with a username and *mystrongpassword* with a strong password.

```sql
CREATE USER [user] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW DATABASE STATE TO [user]; 
GO 
```

:::image type="content" source="media/sql-insights-enable/telegraf-user-database-script.png" alt-text="Create telegraf user script." lightbox="media/sql-insights-enable/telegraf-user-database-script.png":::

Verify the user was created.

:::image type="content" source="media/sql-insights-enable/telegraf-user-database-verify.png" alt-text="Verify telegraf user script." lightbox="media/sql-insights-enable/telegraf-user-database-verify.png":::

```sql
select name as username,
       create_date,
       modify_date,
       type_desc as type,
       authentication_type_desc as authentication_type
from sys.database_principals
where type not in ('A', 'G', 'R', 'X')
       and sid is not null
order by username
```

### Azure SQL Managed Instance
Connect to your Azure SQL Managed Instance using [SQL Server Management Studio](/azure/azure-sql/database/connect-query-ssms) or a similar tool, and execute the following script to create the monitoring user with the permissions needed. Replace *user* with a username and *mystrongpassword* with a strong password.

 
```sql
USE master; 
GO 
CREATE LOGIN [user] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW SERVER STATE TO [user]; 
GO 
GRANT VIEW ANY DEFINITION TO [user]; 
GO 
```

### SQL Server
Connect to SQL Server on your Azure virtual machine and use [SQL Server Management Studio](/azure/azure-sql/database/connect-query-ssms) or a similar tool to run the following script to create the monitoring user with the permissions needed. Replace *user* with a username and *mystrongpassword* with a strong password.
 
```sql
USE master; 
GO 
CREATE LOGIN [user] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW SERVER STATE TO [user]; 
GO 
GRANT VIEW ANY DEFINITION TO [user]; 
GO
```

Verify the user was created.

```sql
select name as username,
       create_date,
       modify_date,
       type_desc as type
from sys.server_principals
where type not in ('A', 'G', 'R', 'X')
       and sid is not null
order by username
```

## Create Azure Virtual Machine 
You will need to create one or more Azure virtual machines that will be used to collect data to monitor SQL.  

> [!NOTE]
>  The [monitoring profiles](#create-sql-monitoring-profile) specifies what data you will collect from the different types of SQL you want to monitor. Each monitoring virtual machine can have only one monitoring profile associated with it. If you have a need for multiple monitoring profiles, then you need to create a virtual machine for each.

### Azure virtual machine requirements
The Azure virtual machine has the following requirements:

- Operating system: Ubuntu 18.04 using Azure Marketplace [image](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-pro-bionic). Custom images are not supported.
- Recommended minimum Azure virtual machine sizes: Standard_B2s (2 CPUs, 4 GiB memory) 
- Deployed in any Azure region [supported](../agents/azure-monitor-agent-overview.md#supported-regions) by the Azure Monitor agent, and meeting all Azure Monitor agent [prerequisites](../agents/azure-monitor-agent-manage.md#prerequisites).

> [!NOTE]
> The Standard_B2s (2 CPUs, 4 GiB memory) virtual machine size will support up to 100 connection strings. You shouldn't allocate more than 100 connections to a single virtual machine.

Depending upon the network settings of your SQL resources, the virtual machines may need to be placed in the same virtual network as your SQL resources so they can make network connections to collect monitoring data.

## Configure network settings
Each type of SQL offers methods for your monitoring virtual machine to securely access SQL. The sections below cover the options based upon the SQL deployment type.

### Azure SQL Database

SQL Insights supports accessing your Azure SQL Database via its public endpoint as well as from its virtual network.

For access via the public endpoint, you would add a rule under the **Firewall settings** page and the [IP firewall settings](/azure/azure-sql/database/network-access-controls-overview#ip-firewall-rules) section. For specifying access from a virtual network, you can set [virtual network firewall rules](/azure/azure-sql/database/network-access-controls-overview#virtual-network-firewall-rules) and set the [service tags required by the Azure Monitor agent](../agents/azure-monitor-agent-overview.md#networking). [This article](/azure/azure-sql/database/network-access-controls-overview#ip-vs-virtual-network-firewall-rules) describes the differences between these two types of firewall rules.

:::image type="content" source="media/sql-insights-enable/set-server-firewall.png" alt-text="Set server firewall" lightbox="media/sql-insights-enable/set-server-firewall.png":::

:::image type="content" source="media/sql-insights-enable/firewall-settings.png" alt-text="Firewall settings." lightbox="media/sql-insights-enable/firewall-settings.png":::

### Azure SQL Managed Instance

If your monitoring virtual machine will be in the same VNet as your SQL MI resources, then see [Connect inside the same VNet](/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-the-same-vnet). If your monitoring virtual machine will be in the different VNet than your SQL MI resources, then see [Connect inside a different VNet](/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-a-different-vnet).

### SQL Server 
If your monitoring virtual machine is in the same VNet as your SQL virtual machine resources, then see [Connect to SQL Server within a virtual network](/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-within-a-virtual-network). If your monitoring virtual machine will be in the different VNet than your SQL virtual machine resources, then see  [Connect to SQL Server over the internet](/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-over-the-internet).

## Store monitoring password in Key Vault
As a security best practice, we strongly recommend that you store your SQL user (login) passwords in a Key Vault, rather than entering them directly into your monitoring profile connection strings.

When settings up your profile for SQL monitoring, you will need one of the following permissions on the Key Vault resource you intend to use:

- Microsoft.Authorization/roleAssignments/write 
- Microsoft.Authorization/roleAssignments/delete

If you have these permissions, a new Key Vault access policy will be automatically created as part of creating your SQL Monitoring profile that uses the Key Vault you specified. 

> [!IMPORTANT]
> You need to ensure that network and security configuration allows the monitoring VM to access Key Vault. For more information, see [Access Azure Key Vault behind a firewall](../../key-vault/general/access-behind-firewall.md) and [Configure Azure Key Vault networking settings](../../key-vault/general/how-to-azure-key-vault-network-security.md).

## Create SQL monitoring profile
Open SQL Insights (preview) by selecting **SQL (preview)** from the **Insights** section of the **Azure Monitor** menu in the Azure portal. Click **Create new profile**. 

:::image type="content" source="media/sql-insights-enable/create-new-profile.png" alt-text="Create new profile." lightbox="media/sql-insights-enable/create-new-profile.png":::

The profile will store the information that you want to collect from your SQL systems.  It has specific settings for: 

- Azure SQL Database 
- Azure SQL Managed Instance
- SQL Server running on virtual machines  

For example, you might create one profile named *SQL Production* and another named *SQL Staging* with different settings for frequency of data collection, what data to collect, and which workspace to send the data to. 

The profile is stored as a [data collection rule](../essentials/data-collection-rule-overview.md) resource in the subscription and resource group you select. Each profile needs the following:

- Name. Cannot be edited once created.
- Location. This is an Azure region.
- Log Analytics workspace to store the monitoring data.
- Collection settings for the frequency and type of sql monitoring data to collect.

> [!NOTE]
> The location of the profile should be in the same location as the Log Analytics workspace you plan to send the monitoring data to.

:::image type="content" source="media/sql-insights-enable/profile-details.png" alt-text="Profile details." lightbox="media/sql-insights-enable/profile-details.png":::

Click **Create monitoring profile** once you've entered the details for your monitoring profile. It can take up to a minute for the profile to be deployed.  If you don't see the new profile listed in **Monitoring profile** combo box, click the refresh button and it should appear once the deployment is completed.  Once you've selected the new profile, select the **Manage profile** tab to add a monitoring machine that will be associated with the profile.

### Add monitoring machine
Select **Add monitoring machine** to open a context panel to choose the virtual machine to setup to monitor your SQL instances and provide the connection strings.

Select the subscription and name of your monitoring virtual machine. If you're using Key Vault to store your password for the monitoring user, select the Key Vault resources with these secrets and enter the URI and secret name for the password to be used in the connection strings. See the next section for details on identifying the connection string for different SQL deployments.

:::image type="content" source="media/sql-insights-enable/add-monitoring-machine.png" alt-text="Add monitoring machine." lightbox="media/sql-insights-enable/add-monitoring-machine.png":::

### Add connection strings 
The connection string specifies the login name that SQL Insights (preview) should use when logging into SQL to collect monitoring data. If you're using a Key Vault to store the password for your monitoring user, provide the Key Vault URI and name of the secret that contains the password.

The connections string will vary for each type of SQL resource:

#### Azure SQL Database
TCP connections from the monitoring machine to the IP address and port used by the database must be allowed by any firewalls or [network security groups](../../virtual-network/network-security-groups-overview.md) (NSGs) that may exist on the network path. For details on IP addresses and ports, see [Azure SQL Database connectivity architecture](/azure/azure-sql/database/connectivity-architecture).

Enter the connection string in the form:

```
sqlAzureConnections": [
   "Server=mysqlserver.database.windows.net;Port=1433;Database=mydatabase;User Id=$username;Password=$password;" 
]
```

Get the details from the **Connection strings** menu item for the database.

:::image type="content" source="media/sql-insights-enable/connection-string-sql-database.png" alt-text="SQL database connection string" lightbox="media/sql-insights-enable/connection-string-sql-database.png":::

To monitor a readable secondary, append `;ApplicationIntent=ReadOnly` to the connection string. SQL Insights supports monitoring a single secondary. The collected data will be tagged to reflect primary or secondary. 

#### Azure SQL Managed Instance
TCP connections from the monitoring machine to the IP address and port used by the managed instance must be allowed by any firewalls or [network security groups](../../virtual-network/network-security-groups-overview.md) (NSGs) that may exist on the network path. For details on IP addresses and ports, see [Azure SQL Managed Instance connection types](/azure/azure-sql/managed-instance/connection-types-overview).

Enter the connection string in the form:

```
"sqlManagedInstanceConnections": [
   "Server= mysqlserver.<dns_zone>.database.windows.net;Port=1433;User Id=$username;Password=$password;" 
] 
```
Get the details from the **Connection strings** menu item for the managed instance. If using managed instance [public endpoint](/azure/azure-sql/managed-instance/public-endpoint-configure), replace port 1433 with 3342.

:::image type="content" source="media/sql-insights-enable/connection-string-sql-managed-instance.png" alt-text="SQL Managed Instance connection string" lightbox="media/sql-insights-enable/connection-string-sql-managed-instance.png":::

To monitor a readable secondary, append `;ApplicationIntent=ReadOnly` to the connection string. SQL Insights supports monitoring of a single secondary. Collected data will be tagged to reflect Primary or Secondary. 

#### SQL Server 
The TCP/IP protocol must be enabled for the SQL Server instance you want to monitor. TCP connections from the monitoring machine to the IP address and port used by the SQL Server instance must be allowed by any firewalls or [network security groups](../../virtual-network/network-security-groups-overview.md) (NSGs) that may exist on the network path.

If you want to monitor SQL Server configured for high availability (using either availability groups or failover cluster instances), we recommend monitoring each SQL Server instance in the cluster individually rather than connecting via an availability group listener or a failover cluster name. This ensures that monitoring data is collected regardless of the current instance role (primary or secondary).

Enter the connection string in the form:

```
"sqlVmConnections": [
   "Server=SQLServerInstanceIPAddress;Port=1433;User Id=$username;Password=$password;" 
] 
```

Use the IP address that the SQL Server instance listens on.

If your SQL Server instance is configured to listen on a non-default port, replace 1433 with that port number in the connection string. If you're using Azure SQL virtual machine, you can see which port to use on the **Security** page for the resource.

:::image type="content" source="media/sql-insights-enable/sql-vm-security.png" alt-text="SQL virtual machine security" lightbox="media/sql-insights-enable/sql-vm-security.png":::

For any SQL Server instance, you can determine all IP addresses and ports it is listening on by connecting to the instance and executing the following T-SQL query, as long as there is at least one TCP connection to the instance:

```sql
SELECT DISTINCT local_net_address, local_tcp_port
FROM sys.dm_exec_connections
WHERE net_transport = 'TCP'
      AND
      protocol_type = 'TSQL';
```

## Monitoring profile created 

Select **Add monitoring virtual machine** to configure the virtual machine to collect data from your SQL resources. Do not return to the **Overview** tab.  In a few minutes, the Status column should change to read "Collecting", you should see data for the SQL resources you have chosen to monitor.

If you do not see data, see [Troubleshooting SQL Insights (preview)](sql-insights-troubleshoot.md) to identify the issue. 

:::image type="content" source="media/sql-insights-enable/profile-created.png" alt-text="Profile created" lightbox="media/sql-insights-enable/profile-created.png":::

> [!NOTE]
> If you need to update your monitoring profile or the connection strings on your monitoring VMs, you may do so via the SQL Insights (preview) **Manage profile** tab.  Once your updates have been saved the changes will be applied in approximately 5 minutes.

## Next steps

- See [Troubleshooting SQL Insights (preview)](sql-insights-troubleshoot.md) if SQL Insights isn't working properly after being enabled.
