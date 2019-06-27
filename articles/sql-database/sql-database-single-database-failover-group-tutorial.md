---
title: "Tutorial: Add an Azure SQL Database single database to a failover group | Microsoft Docs"
description: Add an Azure SQL Database single database to a failover group using the Azure Portal, PowerShell, or Azure CLI.  
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: sstein, carlrab
manager: jroth
ms.date: 06/19/2019
---
# Tutorial: Add an Azure SQL Database single database to a failover group

Configure a failover group for an Azure SQL Database single database and test failover using either the Azure portal, PowerShell, or Azure CLI.  In this tutorial, you will learn how to:

> [!div class="checklist"]
> - Create an Azure SQL Database single database.
> - Create a [failover group](sql-database-auto-failover-group.md) for a single database between two logical SQL servers.
> - Test failover.

## Prerequisites

# [Azure Portal](#tab/azure-portal)
To complete this tutorial, make sure you have: 

- An Azure subscription. [Create a free account](https://azure.microsoft.com/free/) if you don't already have one.


# [PowerShell](#tab/powershell)
To complete the tutorial, make sure you have the following items:

- An Azure subscription. [Create a free account](https://azure.microsoft.com/free/) if you don't already have one.
- [Azure PowerShell](/powershell/azureps-cmdlets-docs)


# [AZ CLI](#tab/bash)
To complete the tutorial, make sure you have the following items:

- An Azure subscription. [Create a free account](https://azure.microsoft.com/free/) if you don't already have one.
- The latest version of [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest). 

---

## 1 - Create a single database 

[!INCLUDE [sql-database-create-single-database](includes/sql-database-create-single-database.md)]

## 2 - Create the failover group 
In this step, you will create a [failover group](sql-database-auto-failover-group.md) between an existing Azure SQL server and a new Azure SQL server in another region. Then add the sample database to the failover group. 

# [Azure Portal](#tab/azure-portal)
Create your failover group and add your single database to it using the Azure portal. 


1. Select **All Services** on the upper-left hand corner of the [Azure portal](https://portal.azure.com). 
1. Type `sql servers` in the search box. 
1. (Optional) Select the star icon next to SQL Servers to favorite **SQL servers** and add it to your left-hand navigation pane. 
    
    ![Locate SQL Servers](media/sql-database-single-database-create-failover-group-tutorial/all-services-sql-servers.png)

1. Select **SQL servers** and choose the server you created in section 1, such as `mysqlserver`.
1. Select **Failover groups** under the **Settings** pane, and then select **Add group** to create a new failover group. 

    ![Add new failover group](media/sql-database-single-database-create-failover-group-tutorial/sqldb-add-new-failover-group.png)

1. On the **Failover Group** page, enter or select the following values, and then select **Create**:
    - **Failover group name**: Type in a unique failover group name, such as `failovergrouptutorial`. 
    - **Secondary server**: Select the option to *configure required settings* and then choose to **Create a new server**. Alternatively, you can choose an already-existing server as the secondary server. After entering the following values, select **Select**. 
        - **Server name**: Type in a unique name for the secondary server, such as `mysqlsecondary`. 
        - **Server admin login**: Type `azureuser`
        - **Password**: Type a complex password that meets password requirements.
        - **Location**: Choose a location from the drop-down, such as East US 2. This location cannot be the same location as your primary server.

    > [!NOTE]
    > The server login and firewall settings must match that of your primary server. 
    
      ![Create a secondary server for the failover group](media/sql-database-single-database-create-failover-group-tutorial/create-secondary-failover-server.png)

   - **Databases within the group**: Once a secondary server is selected, this option becomes unlocked. Select it to **Select databases to add** and then choose the database you created in section 1. Adding the database to the failover group will automatically start the geo-replication process. 
        
    ![Add SQL DB to failover group](media/sql-database-single-database-create-failover-group-tutorial/add-sqldb-to-failover-group.png)
        

# [PowerShell](#tab/powershell)
Create your failover group and add your single database to it using PowerShell. 


   ```powershell-interactive
   # Set variables for your server and database
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $Location = "westus2"
   $AdminLogin = "azureuser"
   $Password = "ChangeYourAdminPassword1"
   $ServerName = "mysqlserver" # to randomize: "mysqlserver-$(Get-Random)"
   $DatabaseName = "mySampleDatabase"
   $drLocation = "eastus2"
   $drServerName = "secondaryFailover" # to randomize: "secondaryFailover-$(Get-Random)"
   $FailoverGroupName = "failovergrouptutorial" # to randomize: "failovergrouptutorial-$(Get-Random)"
   
   # Create a secondary server in the failover region
   New-AzSqlServer -ResourceGroupName $ResourceGroupName `
      -ServerName $drServerName `
      -Location $drLocation `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
         -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $Password -AsPlainText -Force))
   
   # Create a failover group between the servers
   New-AzSqlDatabaseFailoverGroup `
      –ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -PartnerServerName $drServerName  `
      –FailoverGroupName $FailoverGroupName `
      –FailoverPolicy Automatic `
      -GracePeriodWithDataLossHours 2
   
   # Add the database to the failover group
   Get-AzSqlDatabase `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -DatabaseName $DatabaseName | `
   Add-AzSqlDatabaseToFailoverGroup `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -FailoverGroupName $FailoverGroupName
   ```

# [AZ CLI](#tab/bash)
Create your failover group and add your single database to it using AZ CLI. 

   ```azurecli-interactive
   #!/bin/bash
   # Set variables
   export SubscriptionID=<Your Subscription ID>
   export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
   export Location=WestUS2
   export AdminLogin=azureuser
   export Password=ChangeYourAdminPassword1
   export ServerName="mysqlserver" # to randomize: mysqlserver-$RANDOM
   export DatabaseName=mySampleDatabase
   export drLocation=EastUS2
   export drServerName="mysqlsecondary" # to randomize: mysqlsecondary-$RANDOM
   export FailoverGroupName="failovergrouptutorial" # to randomize: failovergrouptutorial-$RANDOM

   # Create a secondary server in the DR region
   az sql server create \
      --name $drServerName \
      --resource-group $ResourceGroupName \
      --location $drLocation  \
      --admin-user $AdminLogin\
      --admin-password $Password

   # Create a failover group between the servers and add the database
   az sql failover-group create \
      --name $FailoverGroupName  \
      --partner-server $drServerName \
      --resource-group $ResourceGroupName \
      --server $ServerName \
      --failover-policy Automatic \
      --add-db $DatabaseName
   ```

---

## 3 - Test failover 
In this step, you will fail your failover group over to the secondary server, and then fail back using the Azure portal. 

# [Azure Portal](#tab/azure-portal)
Test failover using the Azure portal. 

1. Navigate to your **SQL servers** server within the [Azure portal](https://portal.azure.com). 
1. Select **Failover groups** under the **Settings** pane and then choose the failover group you created in section 2. 
  
   ![Select the failover group from the portal](media/sql-database-single-database-create-failover-group-tutorial/select-failover-group.png)

1. Select **Failover** from the task pane to failover your failover group containing your sample single database. 
1. Select **Yes** on the warning that notifies you that TDS sessions will be disconnected. 

   ![Failover your failover group containing your SQL database](media/sql-database-single-database-create-failover-group-tutorial/failover-sql-db.png)

# [PowerShell](#tab/powershell)
Test failover using PowerShell. 


Check the role of the secondary replica: 

   ```powershell-interactive
   # Set variables
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $drServerName = "mysqlsecondary" # to randomize: "mysqlsecondary-$(Get-Random)"
   $FailoverGroupName = "failovergrouptutorial" # to randomize: "failovergrouptutorial-$(Get-Random)"
   
   # Check role of secondary replica
   (Get-AzSqlDatabaseFailoverGroup `
      -FailoverGroupName $FailoverGroupName `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $drServerName).ReplicationRole
   ```


Failover to the secondary server: 

   ```powershell-interactive
   # Set variables
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $drServerName = "mysqlsecondary" # to randomize: "mysqlsecondary-$(Get-Random)"
   $FailoverGroupName = "failovergrouptutorial" # to randomize: "failovergrouptutorial-$(Get-Random)"
   
   # Failover to secondary server
   Switch-AzSqlDatabaseFailoverGroup `
     -ResourceGroupName $ResourceGroupName `
     -ServerName $drServerName `
     -FailoverGroupName $FailoverGroupName
   ```

Revert failover group back to the primary server:

   ```powershell-interactive
   # Set variables
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $drServerName = "mysqlsecondary" # to randomize: "mysqlsecondary-$(Get-Random)"
   $FailoverGroupName = "failovergrouptutorial" # to randomize: "failovergrouptutorial-$
   
   # Revert failover to primary server
   Switch-AzSqlDatabaseFailoverGroup `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -FailoverGroupName $FailoverGroupName
   ```

# [AZ CLI](#tab/bash)
Test failover using the AZ CLI. 


Verify which server is the secondary:

   
   ```azurecli-interactive
   # Set variables
   export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
   export ServerName="mysqlserver" # to randomize: mysqlserver-$RANDOM
   
   # Verify which server is secondary
   az sql failover-group list \
      --server $ServerName \
      --resource-group $ResourceGroupName \
   ```

Failover to the secondary server: 

   ```azurecli-interactive
      # Set variables
      export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
      export drServerName="mysqlsecondary" # to randomize: mysqlsecondary-$RANDOM
      export FailoverGroupName="failovergrouptutorial" # to randomize: failovergrouptutorial-$RANDOM

   
      # Failover to the secondary server
      az sql failover-group set-primary \
         --name $FailoverGroupName \
         --resource-group $ResourceGroupName \
         --server $drServerName \
   ```

Revert failover group back to the primary server:

   ```azurecli-interactive
      # Set variables
      export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
      export ServerName="mysqlserver"
      export FailoverGroupName="failovergrouptutorial" # to randomize: failovergrouptutorial-$RANDOM
      
   
      # Revert failover group back to the primary server
      az sql failover-group set-primary \
         --name $FailoverGroupName \
         --resource-group $ResourceGroupName \
         --server $ServerName \
   ```

---

## Clean up resources 
Clean up resources by deleting the resource group. 

# [Azure Portal](#tab/azure-portal)
Delete the resource group using the Azure portal. 


1. Navigate to your resource group in the [Azure portal](https://portal.azure.com).
1. Select to **Delete resource group**. 

# [PowerShell](#tab/powershell)
Delete the resource group using PowerShell. 


   ```powershell-interactive
   # Set variables
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"

   # Remove the resource group
   Remove-AzResourceGroup -ResourceGroupName $ResourceGroupName
   ```

# [AZ CLI](#tab/bash)
Delete the resource group by using AZ CLI. 


   ```azurecli-interactive
   # Set variables    
   export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
   
   # Remove the resource group
   az group delete \
      --name $ResourceGroupName \
   ```

---


## Full scripts

# [PowerShell](#tab/powershell)

```powershell-interactive
   # Set variables for your server and database
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $Location = "westus2"
   $AdminLogin = "azureuser"
   $Password = "ChangeYourAdminPassword1"
   $ServerName = "mysqlserver" # to randomize: "mysqlserver-$(Get-Random)"
   $DatabaseName = "mySampleDatabase"
   $drLocation = "eastus2"
   $drServerName = "mysqlsecondary" # to randomize: "mysqlsecondary-$(Get-Random)"
   $FailoverGroupName = "failovergrouptutorial" # to randomize: "failovergrouptutorial-$(Get-Random)"
  
   # The ip address range that you want to allow to access your server (leaving at 0.0.0.0 will prevent outside-of-azure connections)
   $startIp = "0.0.0.0"
   $endIp = "0.0.0.0"
   
   # Connect to Azure
   Connect-AzAccount

   # Set subscription ID
   Set-AzContext -SubscriptionId $subscriptionId 
   
   # Create a resource group
   $resourceGroup = New-AzResourceGroup -Name $ResourceGroupName -Location $Location
   
   # Create a server with a system wide unique server name
   $server = New-AzSqlServer -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -Location $Location `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $AdminLogin, $(ConvertTo-SecureString -String $Password -AsPlainText -Force))
   
   # Create a server firewall rule that allows access from the specified IP range
   $serverFirewallRule = New-AzSqlServerFirewallRule -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -FirewallRuleName "AllowedIPs" -StartIpAddress $startIp -EndIpAddress $endIp
   
   # Create General Purpose Gen4 database with 1 vCore
   $database = New-AzSqlDatabase  -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -DatabaseName $DatabaseName `
      -Edition GeneralPurpose `
      -VCore 1 `
      -ComputeGeneration Gen4  `
      -MinimumCapacity 1 `
      -SampleName "AdventureWorksLT" `

   # Create a secondary server in the failover region
   New-AzSqlServer -ResourceGroupName $ResourceGroupName `
      -ServerName $drServerName `
      -Location $drLocation `
      -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential `
         -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $Password -AsPlainText -Force))
   
   # Create a failover group between the servers
   New-AzSqlDatabaseFailoverGroup `
      –ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -PartnerServerName $drServerName  `
      –FailoverGroupName $FailoverGroupName `
      –FailoverPolicy Automatic `
      -GracePeriodWithDataLossHours 2
   
   # Add the database to the failover group
   Get-AzSqlDatabase `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -DatabaseName $DatabaseName | `
   Add-AzSqlDatabaseToFailoverGroup `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -FailoverGroupName $FailoverGroupName

   # Check role of secondary replica
   (Get-AzSqlDatabaseFailoverGroup `
      -FailoverGroupName $FailoverGroupName `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $drServerName).ReplicationRole

   # Failover to secondary server
   Switch-AzSqlDatabaseFailoverGroup `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $drServerName `
      -FailoverGroupName $FailoverGroupName

   # Revert failover to primary server
   Switch-AzSqlDatabaseFailoverGroup `
      -ResourceGroupName $ResourceGroupName `
      -ServerName $ServerName `
      -FailoverGroupName $FailoverGroupName

   # Clean up resources by removing the resource group
   # Remove-AzResourceGroup -ResourceGroupName $ResourceGroupName

```

# [AZ CLI](#tab/bash)

```azurecli-interactive
   #!/bin/bash
   # Set variables
   export SubscriptionID=<Your Subscription ID>
   export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
   export Location=WestUS2
   export AdminLogin=azureuser
   export Password=ChangeYourAdminPassword1
   export ServerName="mysqlserver" # to randomize: mysqlserver-$RANDOM
   export DatabaseName=mySampleDatabase
   export drLocation=EastUS2
   export drServerName="mysqlsecondary" # to randomize: mysqlsecondary-$RANDOM
   export FailoverGroupName="failovergrouptutorial" # to randomize: failovergrouptutorial-$RANDOM

   # The ip address range that you want to allow to access your DB. Leaving at 0.0.0.0 will prevent outside-of-azure connections
   export startip=0.0.0.0
   export endip=0.0.0.0
  
   # Connect to Azure
   az login

   $ Set subscription ID
   az account set --subscription $SubscriptionID
   
   # Create a resource group
   az group create \
      --name $ResourceGroupName \
      --location $Location
   
   # Create a logical server in the resource group
   az sql server create \
      --name $ServerName \
      --resource-group $ResourceGroupName \
      --location $Location  \
      --admin-user $AdminLogin\
      --admin-password $Password
   
   # Configure a firewall rule for the server
   az sql server firewall-rule create \
      --resource-group $ResourceGroupName \
      --server $ServerName \
      -n AllowYourIp \
      --start-ip-address $startip \
      --end-ip-address $endip
   
   # Create a database in the server 
   az sql db create \
      --resource-group $ResourceGroupName \
      --server $ServerName \
      --name $DatabaseName \
      --sample-name AdventureWorksLT \
      --edition GeneralPurpose \
      --family Gen4 \
      --capacity 1 \

   # Create a secondary server in the DR region
   az sql server create \
      --name $drServerName \
      --resource-group $ResourceGroupName \
      --location $drLocation  \
      --admin-user $AdminLogin\
      --admin-password $Password

   # Create a failover group between the servers and add the database
   az sql failover-group create \
      --name $FailoverGroupName  \
      --partner-server $drServerName \
      --resource-group $ResourceGroupName \
      --server $ServerName \
      --failover-policy Automatic \

   # Verify which server is secondary
   az sql failover-group list \
      --server $ServerName \
      --resource-group $ResourceGroupName \

   # Failover to the secondary server
   az sql failover-group set-primary \
      --name $FailoverGroupName \
      --resource-group $ResourceGroupName \
      --server $drServerName \

   # Revert failover group back to the primary server
   az sql failover-group set-primary \
      --name $FailoverGroupName \
      --resource-group $ResourceGroupName \
      --server $ServerName \

    # Clean up resources by removing the resource group
    # az group delete \
    #   --name $ResourceGroupName \
```

# [Azure Portal](#tab/azure-portal)
There are no scripts available for the Azure portal. 


---

## Next steps

In this tutorial, you added an Azure SQL Database single database to a failover group, and tested failover. You learned how to:

> [!div class="checklist"]
> - Create an Azure SQL Database single database. 
> - Create a [failover group](sql-database-auto-failover-group.md) for a single database for a single database between two logical SQL servers.
> - Test failover.

Advance to the next tutorial on how to migrate using DMS.

> [!div class="nextstepaction"]
> [Migrate SQL Server to Azure SQL database managed instance using DMS](../dms/tutorial-sql-server-to-managed-instance.md)
