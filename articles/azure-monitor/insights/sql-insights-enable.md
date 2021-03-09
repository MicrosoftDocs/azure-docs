---
title: Enable SQL insights
description: Enable SQL insights in Azure Monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/04/2021
---

# Enable SQL insights (preview)
This article describes how to enable [SQL insights](sql-insights-overview.md). During public preview, monitoring is performed from an Azure Virtual Machine that makes a connection to your SQL deployments and uses Dynamic Management Views (DMVs) to gather monitoring data.  This allows you to monitor PaaS versions of SQL as well as SQL running on IaaS.  In both cases, the monitoring is performed remotely. No agent is installed on the SQL Server virtual machine.

## Create Telegraf user 
You need a user named *telegraf* on the SQL deployments that you want to monitor. Follow the procedures below for different types of SQL deployments.

### SQL database
Open Azure SQL Database [via SQL Server Management Studio (SSMS)](../../azure-sql/database/connect-query-ssms.md) or Query Editor (preview) in the Azure portal. When using Query Editor, you need firewall access to use the feature. 

:::image type="content" source="media/sql-insights-enable/telegraf-user-database.png" alt-text="Create telegraf user for SQL database.":::

Run the following script to create the Telegraf user with the permissions needed. Replace *mystrongpassword* with a password.

```
CREATE USER [telegraf] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW DATABASE STATE TO [telegraf]; 
GO 
```

:::image type="content" source="media/sql-insights-enable/telegraf-user-database-script.png" alt-text="Create telegraf user script.":::

Verify the user was created.

:::image type="content" source="media/sql-insights-enable/telegraf-user-database-verify.png" alt-text="Verify telegraf user script.":::

### Azure SQL Managed Instance
Log into your Azure SQL Managed Instance and use [SSMS](../../azure-sql/database/connect-query-ssms.md) or similar tool to run the following script to create the Telegraf user with the permissions needed. Replace *mystrongpassword* with a password.

 
```
USE master; 
GO 
CREATE LOGIN [telegraf] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW SERVER STATE TO [telegraf]; 
GO 
GRANT VIEW ANY DEFINITION TO [telegraf]; 
GO 
```

### SQL Server
Log into your Azure VM running SQL Server and use [SSMS](../../azure-sql/database/connect-query-ssms.md) or similar tool to run the following script to create the Telegraf user with the permissions needed. Replace *mystrongpassword* with a password.

 
```
USE master; 
GO 
CREATE LOGIN [telegraf] WITH PASSWORD = N'mystrongpassword'; 
GO 
GRANT VIEW SERVER STATE TO [telegraf]; 
GO 
GRANT VIEW ANY DEFINITION TO [telegraf]; 
GO
```

## Create Azure Virtual Machine 
You will need to create one or more Azure VMs that will be used to collect data to monitor SQL.  

> [!NOTE]
>  The [monitoring profiles](#create-sql-monitoring-profile) specifies what data you will collect from the different types of SQL you want to monitor. Each monitoring virtual machine can have only one monitoring profile associated with it. If you have a need for multiple monitoring profiles, then you need to create a virtual machine for each.

### Azure virtual machine requirements
The Azure virtual machines has the following requirements.

- Operating system: Ubuntu 18.04 
- Recommended Azure virtual machine sizes: Standard B2s (2 cpus, 4 GiB memory) will handle up to 100 connection strings.
- Supported regions
   - East US
   - West Europe
   - West US 2
   - Southeast Asia
   - Central US
   - Australia Southeast
   - East US 2
   - UK South
   - North Europe
   - West US  

The virtual machines need to be placed in the same VNET as your SQL systems so they can make network connections to collect monitoring data. If use the monitoring virtual machine to monitor SQL running on Azure virtual machines or as an Azure Managed Instance, consider placing the monitoring virtual machine in an application security group or the same virtual network as those resources so that you don’t need to provide a public network endpoint for monitoring the SQL server. 

## Configure network settings
Once you have created your monitoring virtual machines, note their internal and external IP addresses and VNET. You'll need this information if you use firewall settings to configure access to the SQL resources. 

### Azure SQL Databases  

[Tutorial - Connect to an Azure SQL server using an Azure Private Endpoint - Azure portal](../../private-link/tutorial-private-endpoint-sql-portal.md) provides an example for how to setup a private endpoint that you can use to access your database.  If you use this method, you will need to ensure your monitoring virtual machines is in the same VNET and subnet that you will be using for the private endpoint.  You can then create the private endpoint on your database if you have not already done so. 

If you use a [firewall setting](../../azure-sql/database/firewall-configure.md) to provide access to your SQL Database, you need to add a firewall rule to provide access from the public IP address of the monitoring virtual machine. You can access the firewall settings from the **Azure SQL Database Overview** page in the portal. 

:::image type="content" source="media/sql-insights-enable/set-server-firewall.png" alt-text="Set server firewall":::

:::image type="content" source="media/sql-insights-enable/firewall-settings.png" alt-text="Firewall settings.":::

### Azure SQL Managed Instances 

If your monitoring virtual machine will be in the same VNet as your SQL MI resources, then see [Connect inside the same VNet](https://docs.microsoft.com/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-the-same-vnet). If your monitoring virtual machine will be in the different VNet than your SQL MI resources, then see [Connect inside a different VNet](https://docs.microsoft.com/azure/azure-sql/managed-instance/connect-application-instance#connect-inside-a-different-vnet).


### Azure virtual machine and Azure SQL virtual machine  
If your monitoring virtual machine is in the same VNet as your SQL virtual machine resources, then see [Connect to SQL Server within a virtual network](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-within-a-virtual-network). If your monitoring virtual machine will be in the different VNet than your SQL VM resources, then see  [Connect to SQL Server over the internet](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql#connect-to-sql-server-over-the-internet).

## Store Telegraf password in Key Vault
This is not required during public preview, but it is recommended so you don't hardcode the Telegraf password into the connection string. You can create more than one secret in your Key Vault if you want to use a different login and password per connection string. 

When settings up your profile for SQL monitoring, you will need one of the following permissions on the Key Vault resource you intend to use:

- Microsoft.Authorization/roleAssignments/write 
- Microsoft.Authorization/roleAssignments/delete permissions such as User Access Administrator or Owner 

A new access policy will be automatically created as part of creating your SQL Monitoring profile that uses the Key Vault you specified. Use *Allow access from All networks* for Key Vault Networking settings.


## Create SQL monitoring profile
Open the preview of SQL insights from *https://aka.ms/sqlinsightspreview* and open the workbook labeled *SQL Server Insights*. Click **Create new profile**. 

:::image type="content" source="media/sql-insights-enable/create-new-profile.png" alt-text="Create new profile.":::

The profile will store the information that you want to collect from your SQL systems.  It has specific settings for: 

- Azure SQL Database 
- Azure SQL Managed Instances 
- SQL Server running on virtual machines  

For example, you might create one profile named *ACME SQL Production* and another named *ACME SQL Staging* with different settings for frequency of data collection, what data to collect, and which workspace to send the data to. 

The profile is stored as a [data collection rule](../agents/data-collection-rule-overview.md) resource in the subscription and resource group you select. Each profile needs the following:

- Name. Cannot be edited once created.
- Location. This is an Azure region.
- Log Analytics workspace to store the monitoring data.
- Collection settings for the frequency and type of sql monitoring data to collect.

> [!NOTE]
> The location of the profile should be in the same location as the Log Analytics workspace you plan to send the monitoring data to.


:::image type="content" source="media/sql-insights-enable/profile-details.png" alt-text="Profile details.":::

Select the monitoring profile from the combo box. You may need to use the **refresh** button in the command bar to have it refresh and appear in the list.  Then click on the manage profile tab where you can add a monitoring machine that will be associated with the new profile. 

### Add monitoring machine
Select **Add monitoring machine** to open a context panel to choose the virtual machine to setup to monitor your SQL instances and provide the connection strings.

Select the subscription and name of your monitoring virtual machine. If you're using Key Vault to store your password for the Telegraf user,  select the Key Vault resources with these secrets and enter the URL and secret name in the connection strings. See the next section for details on identifying the connection string for different SQL deployments.


:::image type="content" source="media/sql-insights-enable/add-monitoring-machine.png" alt-text="Add monitoring machine.":::


### Add connection strings 
The connection string specifies the username that Telegraf should use when logging into SQL to run the Dynamic Management Views. If you're using a Key Vault to store the password for your Telegraf user,  provide the URL and name of the secret to use. 

The connections string will vary for each type of SQL resource:

#### Azure SQL Databases 
Enter the connection string in the form:

```
sqlAzureConnections": [ 
   "Server=mysqlserver.database.windows.net;Port=1433;Database=mydatabase;User Id=$telegrafUsername;Password=$telegrafPassword;" 
}
```

Get the details from the **Connection strings** menu item for the database.

:::image type="content" source="media/sql-insights-enable/connection-string-sql-database.png" alt-text="SQL database connection string":::

To monitor a readable secondary, include the key-value `ApplicationIntent=ReadOnly` in the connection string.


#### Azure VMs running SQL Server 
Enter the connection string in the form:

```
"sqlVmConnections": [ 
   "Server=MyServerIPAddress;Port=1433;User Id=$telegrafUsername;Password=$telegrafPassword;" 
] 
```

If your monitoring virtual machine is in the same VNET, use the private IP address of the Server.  Otherwise, use the public IP address. If you're using Azure SQL virtual machine, you can see which port to use here on the **Security** page for the resource.

:::image type="content" source="media/sql-insights-enable/sql-vm-security.png" alt-text="SQL virtual machine security":::

### Azure SQL Managed Instances 
Enter the connection string in the form:

```
"sqlManagedInstanceConnections": [ 
      "Server= mysqlserver.database.windows.net;Port=1433;User Id=$telegrafUsername;Password=$telegrafPassword;", 
    ] 
```
Get the details from the **Connection strings** menu item for the managed instance.


:::image type="content" source="media/sql-insights-enable/connection-string-sql-managed-instance.png" alt-text="SQL Managed Instance connection string":::

To monitor a readable secondary, include the key-value `ApplicationIntent=ReadOnly` in the connection string.



## Profile created 
Select **Add monitoring virtual machine** to configure the virtual machine to collect data from your SQL deployments. Do not return to the **Overview** tab.  In a few minutes you should see data for the systems you have chosen to monitor.

If you do not see data, see [Troubleshooting SQL insights](sql-insights-troubleshooting.md) to identify the issue. 

:::image type="content" source="media/sql-insights-enable/profile-created.png" alt-text="Profile created":::


## Upgrade to latest version of the preview 
If you have existing Azure virtual machines configured for SQL insights, you need to perform some manual steps to upgrade to the new version. 

Navigate to the **Extensions** view on your monitoring virtual machines. Select the following extensions to see if you are running the latest versions shown below.  

- Workload.WLILinuxExtension - 0.2.120 
- AzureMonitorLinuxAgent – 1.6.2 

If you're not using the latest version, go to **Manage profile** and click **Configure**. Click **Update monitoring config**.

Once you have upgraded to the latest version of the preview, manually delete the *SqlInsights.conf* file in */etc/telegraf/telegraf.d/* to avoid double data collection. With the most recent version of the private preview, the WLI extension will now be placing the Telegraf config in  */etc/telegraf/telegraf.d/wli/*. This will allow the WLI service to more easily maintain and keep track of WLI service specific configs.  


## Next steps

- See [Troubleshooting SQL insights](sql-insights-troubleshoot.md) if SQL insights isn't working properly.
