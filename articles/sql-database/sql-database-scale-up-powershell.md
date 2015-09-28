<properties 
    pageTitle="Change the service tier and performance level of an Azure SQL database using PowerShell" 
    description="Change the service tier and performance level of an Azure SQL database shows how to scale your SQL database up or down with PowerShell. Changing the pricing tier of an Azure SQL database with PowerShell." 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="09/10/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Change the service tier and performance level (pricing tier) of a SQL database with PowerShell

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-scale-up.md)
- [PowerShell](sql-database-scale-up-powershell.md)


This article shows how to change the service tier and performance level of your SQL database with PowerShell.

Use the information in [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md) and [Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md) to determine the appropriate service tier and performance level for your Azure SQL Database.

> [AZURE.IMPORTANT] Changing the service tier and performance level of a SQL database is an online operation. This means your database will remain online and available during the entire operation with no downtime.

- To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
- When upgrading a database with [Standard Geo-Replication](https://msdn.microsoft.com/library/azure/dn758204.aspx) or [Active Geo-Replication](https://msdn.microsoft.com/library/azure/dn741339.aspx) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.
- When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Terminate a Continuous Copy Relationship](https://msdn.microsoft.com/library/azure/dn741323.aspx) topic to stop the replication process between the primary and the active secondary databases.
- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](https://msdn.microsoft.com/library/azure/jj650016.aspx).
- You can make up to four individual database changes (service tier or performance levels) within a 24 hour period.
- The new properties for the database are not applied until the changes are complete.



**To complete this article you need the following:**

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- Azure PowerShell. You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

The cmdlets for changing the service tier of Azure SQL databases are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	Switch-AzureMode -Name AzureResourceManager

If you run the **Switch-AzureMode** and see warning: The *Switch-AzureMode cmdlet is deprecated and will be removed in a future release*, that's okay; just go to the next step to configure your credentials.

For detailed information, see [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).

## Configure your credentials and select your subscription

First you must establish access to your Azure account so start PowerShell and then run the following cmdlet. In the login screen enter the same email and password that you use to sign in to the Azure portal.

	Add-AzureAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id or subscription name (**-SubscriptionName**). You can copy the subscription Id from the information displayed from previous step, or if you have multiple subscriptions and need more details you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	$SubscriptionId = "4cac86b0-1e56-bbbb-aaaa-000000000000"
    Select-AzureSubscription -SubscriptionId $SubscriptionId

After successfully running **Select-AzureSubscription** you are returned to the PowerShell prompt. If you have more than one subscription you can run **Get-AzureSubscription** and verify the subscription you want to use shows **IsCurrent: True**.


 


## Change the service tier and performance level of your SQL database

Run the **Set-AzureSqlDatabase** cmdlet and set the **-RequestedServiceObjectiveName** to the performance level of the desired pricing tier; for example *S0*, *S1*, *S2*, *S3*, *P1*, *P2*, ...

    $ResourceGroupName = "resourceGroupName"
    
    $ServerName = "serverName"
    $DatabaseName = "databaseName"

    $NewEdition = "Standard"
    $NewPricingTier = "S2"

    $ScaleRequest = Set-AzureSqlDatabase -DatabaseName $DatabaseName -ServerName $ServerName -ResourceGroupName $ResourceGroupName -Edition $NewEdition -RequestedServiceObjectiveName $NewPricingTier


  

   


## Sample PowerShell script to change the service tier and performance level of your SQL database

    
	Switch-AzureMode -Name AzureResourceManager
    
    $SubscriptionId = "4cac86b0-1e56-bbbb-aaaa-000000000000"
    
    $ResourceGroupName = "resourceGroupName"
    $Location = "Japan West"
    
    $ServerName = "serverName"
    $DatabaseName = "databaseName"
    
    $NewEdition = "Standard"
    $NewPricingTier = "S2"
    
    Add-AzureAccount
    Select-AzureSubscription -SubscriptionId $SubscriptionId
    
    $ScaleRequest = Set-AzureSqlDatabase -DatabaseName $DatabaseName -ServerName $ServerName -ResourceGroupName $ResourceGroupName -Edition $NewEdition -RequestedServiceObjectiveName $NewPricingTier
    
    $ScaleRequest
    
        


## Next steps

- [Scale out and in](sql-database-elastic-scale-get-started.md)
- [Connect and query a SQL database with SSMS](sql-database-connect-query-ssms.md)
- [Export an Azure SQL database](sql-database-export-powershell.md)

## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
