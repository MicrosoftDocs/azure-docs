<properties
    pageTitle="New SQL Database setup with PowerShell | Microsoft Azure"
    description="Learn now to create a SQL database with PowerShell. Common database setup tasks can be managed through PowerShell cmdlets."
    keywords="create new sql database,database setup"
	services="sql-database"
    documentationCenter=""
    authors="stevestein"
    manager="jhubbard"
    editor="cgronlun"/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="hero-article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management"
    ms.date="08/19/2016"
    ms.author="sstein"/>

# Create a SQL database and perform common database setup tasks with PowerShell cmdlets


> [AZURE.SELECTOR]
- [Azure portal](sql-database-get-started.md)
- [PowerShell](sql-database-get-started-powershell.md)
- [C#](sql-database-get-started-csharp.md)



Learn how to create a SQL database by using PowerShell cmdlets. (For creating elastic databases, see [Create a new elastic database pool with PowerShell](sql-database-elastic-pool-create-powershell.md).)


[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Database setup: Create a resource group, server, and firewall rule

Once you have access to run cmdlets against your selected Azure subscription, the next step is establishing the resource group that contains the server where the database will be created. You can edit the next command to use whatever valid location you choose. Run **(Get-AzureRmLocation | Where-Object { $_.Providers -eq "Microsoft.Sql" }).Location** to get a list of valid locations.

Run the following command to create a resource group:

	New-AzureRmResourceGroup -Name "resourcegroupsqlgsps" -Location "westus"


### Create a server

SQL databases are created inside Azure SQL Database servers. Run **New-AzureRmSqlServer** to create a server. The name for your server must be unique to all Azure SQL Database servers. If the server name is already taken, you get an error. Also worth noting is that this command may take several minutes to complete. You can edit the command to use any valid location you choose, but you should use the same location you used for the resource group created in the previous step.

	New-AzureRmSqlServer -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -Location "westus" -ServerVersion "12.0"

When you run this command, you are prompted for your user name and password. Don't enter your Azure credentials. Instead, enter the user name and password to create as the server administrator. The script at the bottom of this article shows how to set the server credentials in code.

The server details appear after the server is successfully created.

### Configure a server firewall rule to allow access to the server

To access the server, you need to establish a firewall rule. Run the following command, replacing the start and end IP addresses with valid values for your computer.

	New-AzureRmSqlServerFirewallRule -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.0" -EndIpAddress "192.168.0.0"

The firewall rule details appear after the rule is successfully created.

To allow other Azure services to access the server, add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. This rule allows Azure traffic from any Azure subscription to access the server.

For more information, see [Azure SQL Database Firewall](sql-database-firewall-configure.md).


## Create a SQL database

Now you have a resource group, a server, and a firewall rule configured so you can access the server.

The following command creates a (blank) SQL database at the Standard service tier, with an S1 performance level:


	New-AzureRmSqlDatabase -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -DatabaseName "database1" -Edition "Standard" -RequestedServiceObjectiveName "S1"


The database details appear after the database is successfully created.

## Create a SQL database PowerShell script

The following PowerShell script creates a SQL database and all its dependent resources. Replace all `{variables}` with values specific to your subscription and resources (remove the **{}** when you set your values).

    # Sign in to Azure and set the subscription to work with
    $SubscriptionId = "{subscription-id}"

    Add-AzureRmAccount
    Set-AzureRmContext -SubscriptionId $SubscriptionId

    # CREATE A RESOURCE GROUP
    $resourceGroupName = "{group-name}"
    $rglocation = "{Azure-region}"
    
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $rglocation
    
    # CREATE A SERVER
    $serverName = "{server-name}"
    $serverVersion = "12.0"
    $serverLocation = "{Azure-region}"
    
    $serverAdmin = "{server-admin}"
    $serverPassword = "{server-password}" 
    $securePassword = ConvertTo-SecureString –String $serverPassword –AsPlainText -Force
    $serverCreds = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $serverAdmin, $securePassword
    
    $sqlDbServer = New-AzureRmSqlServer -ResourceGroupName $resourceGroupName -ServerName $serverName -Location $serverLocation -ServerVersion $serverVersion -SqlAdministratorCredentials $serverCreds
    
    # CREATE A SERVER FIREWALL RULE
    $ip = (Test-Connection -ComputerName $env:COMPUTERNAME -Count 1 -Verbose).IPV4Address.IPAddressToString
    $firewallRuleName = '{rule-name}'
    $firewallStartIp = $ip
    $firewallEndIp = $ip
    
    $fireWallRule = New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroupName -ServerName $serverName -FirewallRuleName $firewallRuleName -StartIpAddress $firewallStartIp -EndIpAddress $firewallEndIp
    
    
    # CREATE A SQL DATABASE
    $databaseName = "{database-name}"
    $databaseEdition = "{Standard}"
    $databaseSlo = "{S0}"
    
    $sqlDatabase = New-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName -Edition $databaseEdition -RequestedServiceObjectiveName $databaseSlo
    
   
    # REMOVE ALL RESOURCES THE SCRIPT JUST CREATED
    #Remove-AzureRmResourceGroup -Name $resourceGroupName






## Next steps
After you create a SQL database and perform basic database setup tasks, you're ready for the following:

- [Manage SQL Database with PowerShell](sql-database-manage-powershell.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)


## Additional Resources

- [Azure SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)
