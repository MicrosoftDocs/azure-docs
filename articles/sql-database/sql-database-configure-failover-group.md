---
title: Configure a failover group for Azure SQL Database
description: Learn how to configure an auto-failover group for an Azure SQL Database single database, elastic pool, and managed instance using the Azure portal, the Az CLI, and PowerShell. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: sstein, carlrab
ms.date: 08/14/2019
---
# Configure a failover group for Azure SQL Database

This topic teaches you how to configure an [auto-failover group](sql-database-auto-failover-group.md) for an Azure SQL Database single database, elastic pool, and managed instance using the Azure portal, the Az CLI, and PowerShell. 

## Single database
You can add an Azure SQL Database single database into a failover group using the Azure portal, the Az CLI, and PowerShell. 

Consider the following:
- The server login and firewall settings for the secondary server must match that of your primary server. 

# [Portal](#tab/azure-portal)
Create your failover group and add your single database to it using the Azure portal.

1. Select **All Services** on the upper-left hand corner of the [Azure portal](https://portal.azure.com). 
1. Type `sql servers` in the search box. 
1. (Optional) Select the star icon next to SQL Servers to favorite **SQL servers** and add it to your left-hand navigation pane. 
    
    ![Locate SQL Servers](media/sql-database-single-database-create-failover-group-tutorial/all-services-sql-servers.png)

1. Select **SQL servers** and choose the SQL Server where your single database is hosted.
1. Select **Failover groups** under the **Settings** pane, and then select **Add group** to create a new failover group. 

    ![Add new failover group](media/sql-database-single-database-create-failover-group-tutorial/sqldb-add-new-failover-group.png)

1. On the **Failover Group** page, enter or select the required values, and then select **Create**.

    > [!NOTE]
    > The server login and firewall settings must match that of your primary server. 
    
   - **Databases within the group**: Once a secondary server is selected, this option becomes unlocked. Select it to **Select databases to add** and then choose the database you created in section 1. Adding the database to the failover group will automatically start the geo-replication process. 
        
    ![Add SQL DB to failover group](media/sql-database-single-database-create-failover-group-tutorial/add-sqldb-to-failover-group.png)



# [PowerShell](#tab/azure-powershell)
Create your failover group and add your single database to it using PowerShell. 

   ```powershell-interactive
   # $subscriptionId = '<SubscriptionID>'
   # $resourceGroupName = "<Resource-Group-Name>"
   # $location = "<Region>"
   # $adminLogin = "<Admin-Login>"
   # $password = "<Complex-Password>"
   # $serverName = "<Primary-Server-Name>"
   # $databaseName = "<Database-Name>"
   $drLocation = "<DR-Region>"
   $drServerName = "<Secondary-Server-Name>"
   $failoverGroupName = "<Failover-Group-Name>"

   # Create a secondary server in the failover region
   Write-host "Creating a secondary logical server in the failover region..."
   $drServer = New-AzSqlServer -ResourceGroupName $resourceGroupName `
      -ServerName $drServerName `
      -Location $drLocation `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
         -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
   $drServer
   
   # Create a failover group between the servers
   $failovergroup = Write-host "Creating a failover group between the primary and secondary server..."
   New-AzSqlDatabaseFailoverGroup `
      –ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -PartnerServerName $drServerName  `
      –FailoverGroupName $failoverGroupName `
      –FailoverPolicy Automatic `
      -GracePeriodWithDataLossHours 2
   $failovergroup
   
   # Add the database to the failover group
   Write-host "Adding the database to the failover group..." 
   Get-AzSqlDatabase `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName | `
   Add-AzSqlDatabaseToFailoverGroup `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -FailoverGroupName $failoverGroupName
   Write-host "Successfully added the database to the failover group..." 
   ```


# [Azure CLI](#tab/azure-cli)
Create your failover group and add your single database to it using AZ CLI. 

   ```azurecli-interactive
   #!/bin/bash
   # Set variables
   # subscriptionID=<SubscriptionID>
   # resourceGroupName=<Resource-Group-Name>
   # location=<Region>
   # adminLogin=<Admin-Login>
   # password=<Complex-Password>
   # serverName=<Primary-Server-Name>
   # databaseName=<Database-Name>
   drLocation=<DR-Region>
   drServerName=<Secondary-Server-Name>
   failoverGroupName=<Failover-Group-Name>

   # Create a secondary server in the failover region
   echo "Creating a secondary logical server in the DR region..."
   az sql server create \
      --name $drServerName \
      --resource-group $resourceGroupName \
      --location $drLocation  \
      --admin-user $adminLogin\
      --admin-password $password
   
   # Create a failover group between the servers and add the database
   echo "Creating a failover group between the two servers..."
   az sql failover-group create \
      --name $failoverGroupName  \
      --partner-server $drServerName \
      --resource-group $resourceGroupName \
      --server $serverName \
      --add-db $databaseName
      --failover-policy Automatic
   ```

---

## Elastic pool
You can add an Azure SQL Database elastic pool into a failover group using the Azure portal, the Az CLI, and PowerShell. 

Consider the following:
- The server login and firewall settings for the secondary server must match that of your primary server. 


# [Portal](#tab/azure-portal)
Create your failover group and add your single database to it using the Azure portal.

1. Select **All Services** on the upper-left hand corner of the [Azure portal](https://portal.azure.com). 
1. Type `sql servers` in the search box. 
1. (Optional) Select the star icon next to SQL Servers to favorite **SQL servers** and add it to your left-hand navigation pane. 
    
    ![Locate SQL Servers](media/sql-database-single-database-create-failover-group-tutorial/all-services-sql-servers.png)

1. Select **SQL servers** and choose the server that hosts the elastic pool you want to add to your failover group. 
1. Select **Failover groups** under the **Settings** pane, and then select **Add group** to create a new failover group. 

    ![Add new failover group](media/sql-database-single-database-create-failover-group-tutorial/sqldb-add-new-failover-group.png)

1. On the **Failover Group** page, enter or select the required values, and then select **Create**. Either create a new secondary server, or select an existing secondary server. 

1. Select **Databases within the group** then select the elastic pool you want to add to the failover group. If an elastic group does not already exist on the secondary server, a warning should appear prompting you to create an elastic pool on the secondary server. Select the warning, and then select **OK** to create the elastic pool on the secondary server. 
        
    ![Add elastic pool to failover group](media/sql-database-elastic-pool-create-failover-group-tutorial/add-elastic-pool-to-failover-group.png)
        
1. Select **Select** to apply your elastic pool settings to the failover group, and then select **Create** to create your failover group. Adding the elastic pool to the failover group will automatically start the geo-replication process. 

# [PowerShell](#tab/azure-powershell)
Create your failover group and add your single database to it using PowerShell. 

!!!!!! Need PowerShell commands to create a failover group for an elastic pool !!!!!!!!

# [Azure CLI](#tab/azure-cli)
Create your failover group and add your single database to it using AZ CLI. 

!!!!!! Need Az CLI commands to create a failover group for an elastic pool !!!!!!!!

---



## Next steps

- For information about SQL Database Hyperscale offering, see [Hyperscale service tier](./sql-database-service-tier-hyperscale.md).
