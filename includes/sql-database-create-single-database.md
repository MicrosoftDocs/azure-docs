---
author: MashaMSFT
ms.service: sql-database
ms.subservice: single-database  
ms.topic: include
ms.date: 06/19/2019
ms.author: mathoma
---

In this step, you will create your resource group and an Azure SQL Database single database. 

> [!IMPORTANT]
> Be sure to set up firewall rules to use the public IP address of the computer on which you're performing the steps in this article. Database-level firewall rules will replicate automatically to the secondary server.
>
> For information see [Create a database-level firewall rule](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database) or to determine the IP address used for the server-level firewall rule for your computer see [Create a server-level firewall](../articles/sql-database/sql-database-server-level-firewall-rule.md).  

# [Azure portal](#tab/azure-portal)
Create your resource group and single database using the Azure portal. 

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
2. Select **Databases** and then select **SQL Database** to open the **Create SQL Database** page.

   ![Create single database](../articles/sql-database/media/sql-database-get-started-portal/create-database-1.png)

3. On the **Basics** tab, in the **Project Details** section, type or select the following values:

   - **Subscription**: Drop down and select the correct subscription, if it doesn't appear.
   - **Resource group**: Select **Create new**, type `myResourceGroup`, and select **OK**.

     ![New SQL database - basic tab](../articles/sql-database/media/sql-database-get-started-portal/new-sql-database-basics.png)

4. In the **Database Details** section, type or select the following values:

   - **Database name**: Enter `mySampleDatabase`.
   - **Server**: Select **Create new** and enter the following values and then select **Select**.
       - **Server name**: Type `mysqlserver`; along with some numbers for uniqueness.
       - **Server admin login**: Type `azureuser`.
       - **Password**: Type a complex password that meets password requirements.
       - **Location**: Choose a location from the drop-down, such as `West US 2`.

         ![New server](../articles/sql-database/media/sql-database-get-started-portal/new-server.png)

      > [!IMPORTANT]
      > Remember to record the server admin login and password so you can log in to the server and databases for this and other quickstarts. If you forget your login or password, you can get the login name or reset the password on the **SQL server** page. To open the **SQL server** page, select the server name on the database **Overview** page after database creation.

        ![SQL Database details](../articles/sql-database/media/sql-database-get-started-portal/sql-db-basic-db-details.png)

   - **Want to use SQL elastic pool**: Select the **No** option.
   - **Compute + storage**: Select **Configure database** and for this quickstart, select **vCore-based purchasing options**

     ![vCore-based purchasing options](../articles/sql-database/media/sql-database-get-started-portal/create-database-vcore.png)

   - Select **Provisioned** and **Gen4**.

     ![serverless compute tier](../articles/sql-database/media/sql-database-get-started-portal/create-database-serverless.png)

   - Review the settings for **Max vCores**, **Min vCores**, **Auto-pause delay**, and **Data max size**. Change these as desired.
   - Accept the preview terms and click **OK**.
   - Select **Apply**.

5. Select the **Additional settings** tab. 
6. In the **Data source** section, under **Use existing data**, select `Sample`. 

   ![Additional SQL DB settings](../articles/sql-database/media/sql-database-get-started-portal/create-sql-database-additional-settings.png)

   > [!IMPORTANT]
   > Make sure to select the **Sample (AdventureWorksLT)** data so you can follow easily this and other Azure SQL Database quickstarts that use this data.

7. Leave the rest of the values as default and select **Review + Create** at the bottom of the form.
8. Review the final settings and select **Create**.

9. On the **SQL Database** form, select **Create** to deploy and provision the resource group, server, and database.

# [PowerShell](#tab/powershell)

[!INCLUDE [updated-for-az](updated-for-az.md)]

Create your resource group and single database using PowerShell. 

   ```powershell-interactive
   # Set variables for your server and database
   $SubscriptionId = '<Your Azure subscription ID>'
   $ResourceGroupName = "myResourceGroup" # to randomize: "myResourceGroup-$(Get-Random)"
   $Location = "westus2"
   $AdminLogin = "azureuser"
   $Password = "ChangeYourAdminPassword1"
   $ServerName = "mysqlserver" # to randomize: "mysqlserver-$(Get-Random)"
   $DatabaseName = "mySampleDatabase"
   
   
   # The ip address range that you want to allow to access your server 
   #(leaving at 0.0.0.0 will prevent outside-of-azure connections to your DB)
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
      -SampleName "AdventureWorksLT"
   ```

# [AZ CLI](#tab/bash)
Create your resource group and single database using AZ CLI. 


   ```azurecli-interactive
   #!/bin/bash
   # Set variables
   export subscriptionID=<Your Subscription ID>
   export ResourceGroupName=myResourceGroup # to randomize: myResourceGroup-$RANDOM
   export Location=WestUS2
   export AdminLogin=azureuser
   export Password=ChangeYourAdminPassword1
   export ServerName="mysqlserver" # to randomize: mysqlserver-$RANDOM
   export DatabaseName=mySampleDatabase
   
   # The ip address range that you want to allow to access your DB. 
   # (leaving at 0.0.0.0 will prevent outside-of-azure connections to your DB)
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
   ```

---