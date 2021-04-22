---
title: Enable SQL insights
description: Enable SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/15/2021
---

# Enable SQL insights (preview)
This article describes how to enable [SQL insights](sql-insights-overview.md) to monitor your SQL deployments. Monitoring is performed from an Azure virtual machine that makes a connection to your SQL deployments and uses Dynamic Management Views (DMVs) to gather monitoring data. You can control what datasets are collected and the frequency of collection using a monitoring profile.

> [!NOTE]
> To enable SQL insights by creating the monitoring profile and virtual machine using a resource manager template, see [Resource Manager template samples for SQL insights](resource-manager-sql-insights.md).

## Create Log Analytics workspace
SQL insights stores its data in one or more [Log Analytics workspaces](../logs/data-platform-logs.md#log-analytics-workspaces).  Before you can enable  SQL Insights, you need to either [create a workspace](../logs/quick-create-workspace.md) or select an existing one. A single workspace can be used with multiple monitoring profiles, but the workspace and profiles must be located in the same Azure region. To enable and access the features in SQL insights, you must have the [Log Analytics contributor role](../logs/manage-access.md) in the workspace. 

## Create monitoring user 
You need a user on the SQL deployments that you want to monitor. Follow the procedures below for different types of SQL deployments.

The instructions below cover the process per type of SQL that you can monitor.  To accomplish this with a script on several SQL resouces at once, please refer to the following [README file](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/SQL%20Insights%20Onboarding%20Scripts/Permissions_LoginUser_Account_Creation-README.txt) and [example script](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/SQL%20Insights%20Onboarding%20Scripts/Permissions_LoginUser_Account_Creation.ps1).


### Azure SQL database
Open Azure SQL Database with [SQL Server Management Studio](../../azure-sql/database/connect-query-ssms.md) or [Query Editor (preview)](../../azure-sql/database/connect-query-portal.md) in the Azure portal.

Run the following script to create a user with the required permissions. Replace *user* with a username and *mystrongpassword* with a password.

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
Log into your Azure SQL Managed Instance and use [SQL Server Management Studio](../../azure-sql/database/connect-query-ssms.md) or similar tool to run the following script to create the monitoring user with the permissions needed. Replace *user* with a username and *mystrongpassword* with a password.

 
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
Log into your Azure virtual machine running SQL Server and use [SQL Server Management Studio](../../azure-sql/database/connect-query-ssms.md) or similar tool to run the following script to create the monitoring user with the permissions needed. Replace *user* with a username and *mystrongpassword* with a password.

 
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
The Azure virtual machines has the following requirements.

- Operating system: Ubuntu 18.04 
- Recommended Azure virtual machine sizes: Standard_B2s (2 cpus, 4 GiB memory) 
- Supported regions: Any [region supported by the Azure Monitor agent](../agents/azure-monitor-agent-overview.md#supported-regions)

> [!NOTE]
> The Standard_B2s (2 cpus, 4 GiB memory) virtual machine size will support up to 100 connection strings. You shouldn't allocate more than 100 connections to a single virtual machine.

Depending upon the network settings of your SQL resources, the virtual machines may need to be placed in the same virtual network as your SQL resources so they can make network connections to collect monitoring data.  

## Configure network settings
Each type of SQL offers methods for your monitoring virtual machine to securely access SQL.  The sections below cover the options based upon the type of SQL.

### Azure SQL Databases  

SQL insights supports accessing your Azure SQL Database via it's public endpoint as well as from it's virtual network.

For access via the public endpoint, you would add a rule under the **Firewall settings** page and the [IP firewall settings](https://docs.microsoft.com/azure/azure-sql/database/network-access-controls-overview#ip-firewall-rules) section.  For specifying access from a virtual network, you can set [virtual network firewall rules](https://docs.microsoft.com/azure/azure-sql/database/network-access-controls-overview#virtual-network-firewall-rules) and set the [service tags required by the Azure Monitor agent](https://docs.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-overview#networking).  [This article](https://docs.microsoft.com/azure/azure-sql/database/network-access-controls-overview#ip-vs-virtual-network-firewall-rules) describes the differences between these two types of firewall rules.

:::image type="content" source="media/sql-insights-enable/set-server-firewall.png" alt-text="Set server firewall" lightbox="media/sql-insights-enable/set-server-firewall.png":::

:::image type="content" source="media/sql-insights-enable/firewall-settings.png" alt-text="Firewall settings." lightbox="media/sql-insights-enable/firewall-settings.png":::


### Azure SQL Managed Instances 

If your monitoring virtual machine will be in the same VNet as your SQL MI resources, then see [Connect inside the same VNet](https://docs.microsoft.com/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-the-same-vnet). If your monitoring virtual machine will be in the different VNet than your SQL MI resources, then see [Connect inside a different VNet](https://docs.microsoft.com/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-a-different-vnet).


### Azure virtual machine and Azure SQL virtual machine  
If your monitoring virtual machine is in the same VNet as your SQL virtual machine resources, then see [Connect to SQL Server within a virtual network](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-within-a-virtual-network). If your monitoring virtual machine will be in the different VNet than your SQL virtual machine resources, then see  [Connect to SQL Server over the internet](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-over-the-internet).

## Store monitoring password in Key Vault
You should store your SQL user connection passwords in a Key Vault rather than entering them directly into your monitoring profile connection strings.

When settings up your profile for SQL monitoring, you will need one of the following permissions on the Key Vault resource you intend to use:

- Microsoft.Authorization/roleAssignments/write 
- Microsoft.Authorization/roleAssignments/delete permissions such as User Access Administrator or Owner 

A new access policy will be automatically created as part of creating your SQL Monitoring profile that uses the Key Vault you specified. Use *Allow access from All networks* for Key Vault Networking settings.


## Create SQL monitoring profile
Open SQL insights by selecting **SQL (preview)** from the **Insights** section of the **Azure Monitor** menu in the Azure portal. Click **Create new profile**. 

:::image type="content" source="media/sql-insights-enable/create-new-profile.png" alt-text="Create new profile." lightbox="media/sql-insights-enable/create-new-profile.png":::

The profile will store the information that you want to collect from your SQL systems.  It has specific settings for: 

- Azure SQL Database 
- Azure SQL Managed Instances 
- SQL Server running on virtual machines  

For example, you might create one profile named *SQL Production* and another named *SQL Staging* with different settings for frequency of data collection, what data to collect, and which workspace to send the data to. 

The profile is stored as a [data collection rule](../agents/data-collection-rule-overview.md) resource in the subscription and resource group you select. Each profile needs the following:

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

Select the subscription and name of your monitoring virtual machine. If you're using Key Vault to store your password for the monitoring user,  select the Key Vault resources with these secrets and enter the URL and secret name to be used in the connection strings. See the next section for details on identifying the connection string for different SQL deployments.


:::image type="content" source="media/sql-insights-enable/add-monitoring-machine.png" alt-text="Add monitoring machine." lightbox="media/sql-insights-enable/add-monitoring-machine.png":::


### Add connection strings 
The connection string specifies the username that SQL insights should use when logging into SQL to run the Dynamic Management Views. If you're using a Key Vault to store the password for your monitoring user,  provide the URL and name of the secret to use. 

The connections string will vary for each type of SQL resource:

#### Azure SQL Databases 
Enter the connection string in the form:

```
sqlAzureConnections": [ 
   "Server=mysqlserver.database.windows.net;Port=1433;Database=mydatabase;User Id=$username;Password=$password;" 
}
```

Get the details from the **Connection strings** menu item for the database.

:::image type="content" source="media/sql-insights-enable/connection-string-sql-database.png" alt-text="SQL database connection string" lightbox="media/sql-insights-enable/connection-string-sql-database.png":::

To monitor a readable secondary, include the key-value `ApplicationIntent=ReadOnly` in the connection string. SQL Insights supports monitoring a single secondary. The collected data will be tagged to reflect primary or secondary. 


#### Azure virtual machines running SQL Server 
Enter the connection string in the form:

```
"sqlVmConnections": [ 
   "Server=MyServerIPAddress;Port=1433;User Id=$username;Password=$password;" 
] 
```

If your monitoring virtual machine is in the same VNET, use the private IP address of the Server.  Otherwise, use the public IP address. If you're using Azure SQL virtual machine, you can see which port to use here on the **Security** page for the resource.

:::image type="content" source="media/sql-insights-enable/sql-vm-security.png" alt-text="SQL virtual machine security" lightbox="media/sql-insights-enable/sql-vm-security.png":::


### Azure SQL Managed Instances 
Enter the connection string in the form:

```
"sqlManagedInstanceConnections": [ 
      "Server= mysqlserver.database.windows.net;Port=1433;User Id=$username;Password=$password;", 
    ] 
```
Get the details from the **Connection strings** menu item for the managed instance.


:::image type="content" source="media/sql-insights-enable/connection-string-sql-managed-instance.png" alt-text="SQL Managed Instance connection string" lightbox="media/sql-insights-enable/connection-string-sql-managed-instance.png":::

To monitor a readable secondary, include the key-value `ApplicationIntent=ReadOnly` in the connection string. SQL Insights supports monitoring of a single secondary and the collected data will be tagged to reflect Primary or Secondary. 


## Monitoring profile created 

Select **Add monitoring virtual machine** to configure the virtual machine to collect data from your SQL resources. Do not return to the **Overview** tab.  In a few minutes, the Status column should change to read "Collecting", you should see data for the SQL resources you have chosen to monitor.

If you do not see data, see [Troubleshooting SQL insights](sql-insights-troubleshoot.md) to identify the issue. 

:::image type="content" source="media/sql-insights-enable/profile-created.png" alt-text="Profile created" lightbox="media/sql-insights-enable/profile-created.png":::

> [!NOTE]
> If you need to update your monitoring profile or the connection strings on your monitoring VMs, you may do so via the SQL insights **Manage profile** tab.  Once your updates have been saved the changes will be applied in approximately 5 minutes.

## Next steps

- See [Troubleshooting SQL insights](sql-insights-troubleshoot.md) if SQL insights isn't working properly after being enabled.
