<properties
    pageTitle="New SQL Database setup with PowerShell | Microsoft Azure"
    description="Learn now to create a new SQL database with PowerShell. Common database setup tasks can be managed through PowerShell cmdlets."
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
    ms.date="05/09/2016"
    ms.author="sstein"/>

# Create a new SQL database and perform common database setup tasks with PowerShell cmdlets


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-get-started.md)
- [PowerShell](sql-database-get-started-powershell.md)
- [C#](sql-database-get-started-csharp.md)



Learn how to create a new SQL database by using PowerShell cmdlets. (For creating elastic databases, see [Create a new elastic database pool with PowerShell](sql-database-elastic-pool-create-powershell.md).)


[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Database setup: Create a resource group, server, and firewall rule

Once you have access to run cmdlets against your selected Azure subscription, the next step is establishing the resource group that contains the server where the database will be created. You can edit the next command to use whatever valid location you choose. Run **(Get-AzureRmLocation | Where-Object { $_.Providers -eq "Microsoft.Sql" }).Location** to get a list of valid locations.

Run the following command to create a new resource group:

	New-AzureRmResourceGroup -Name "resourcegroupsqlgsps" -Location "West US"

After successfully creating the new resource group, you see the following: **ProvisioningState : Succeeded**.


### Create a server

SQL databases are created inside Azure SQL Database servers. Run **New-AzureRmSqlServer** to create a new server. Replace *ServerName* with the name for your server. This name must be unique to all Azure SQL Database servers. You will get an error if the server name is already taken. Also worth noting is that this command may take several minutes to complete. You can edit the command to use any valid location you choose, but you should use the same location you used for the resource group created in the previous step.

	New-AzureRmSqlServer -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -Location "West US" -ServerVersion "12.0"

When you run this command, you are prompted for your user name and password. Don't enter your Azure credentials. Instead, enter the user name and password that will be the administrator credentials you want to create for the new server.

The server details appear after the server is successfully created.

### Configure a server firewall rule to allow access to the server

Establish a firewall rule to access the server. Run the following command, replacing the start and end IP addresses with valid values for your computer.

	New-AzureRmSqlServerFirewallRule -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.0" -EndIpAddress "192.168.0.0"

The firewall rule details appear after the rule is successfully created.

To allow other Azure services to access the server, add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from any Azure subscription to access the server.

For more information, see [Azure SQL Database Firewall](sql-database-firewall-configure.md).


## Create a new SQL database

Now you have a resource group, a server, and a firewall rule configured so you can access the server.

The following command creates a new (blank) SQL database at the Standard service tier, with an S1 performance level:


	New-AzureRmSqlDatabase -ResourceGroupName "resourcegroupsqlgsps" -ServerName "server1" -DatabaseName "database1" -Edition "Standard" -RequestedServiceObjectiveName "S1"


The database details appear after the database is successfully created.

## Create a new SQL database PowerShell script

The following is a new SQL database PowerShell script:

    $SubscriptionId = "4cac86b0-1e56-bbbb-aaaa-000000000000"
    $ResourceGroupName = "resourcegroupname"
    $Location = "Japan West"

    $ServerName = "uniqueservername"

    $FirewallRuleName = "rule1"
    $FirewallStartIP = "192.168.0.0"
    $FirewallEndIp = "192.168.0.0"

    $DatabaseName = "database1"
    $DatabaseEdition = "Standard"
    $DatabasePerfomanceLevel = "S1"


    Add-AzureRmAccount
    Select-AzureRmSubscription -SubscriptionId $SubscriptionId

    $ResourceGroup = New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

    $Server = New-AzureRmSqlServer -ResourceGroupName $ResourceGroupName -ServerName $ServerName -Location $Location -ServerVersion "12.0"

    $FirewallRule = New-AzureRmSqlServerFirewallRule -ResourceGroupName $ResourceGroupName -ServerName $ServerName -FirewallRuleName $FirewallRuleName -StartIpAddress $FirewallStartIP -EndIpAddress $FirewallEndIp

    $SqlDatabase = New-AzureRmSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -Edition $DatabaseEdition -RequestedServiceObjectiveName $DatabasePerfomanceLevel

    $SqlDatabase



## Next steps
After you create a new SQL database and perform basic database setup tasks, you're ready for the following:

- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md).


## Additional Resources

- [Azure SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)
