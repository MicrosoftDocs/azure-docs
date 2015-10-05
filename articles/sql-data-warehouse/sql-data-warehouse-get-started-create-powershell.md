<properties
   pageTitle="Create SQL Data Warehouse by using Powershell | Microsoft Azure"
   description="Create SQL Data Warehouse by using Powershell"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/05/2015"
   ms.author="lodipalm"/>

# Create SQL Data Warehouse using Powershell

> [AZURE.NOTE]  In order to use Microsoft Azure Powershell with SQL Data Warehouse, you will need version 0.9.4 or greater.  You can check your version by running (Get-Module Azure).Version in Powershell.

## Get and run the Azure PowerShell cmdlets
If you're not already set-up with Powershell, you can:

1. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409).
2. To run the module, at the start window type **Microsoft Azure PowerShell**.
3. If you have not already added your account to the machine, run the following cmdlet. (For more information, see [How to install and configure Azure PowerShell][]):

            Add-AzureAccount

4. You will also need to run PowerShell in the ARM mode.  You can switch to this mode by running the following command:

            switch-azuremode AzureResourceManager

## Creating SQL Data Warehouse
After you have ensured that Powershell is successfully set-up on your account you can run the following to deploy a new SQL Data Wareouse:

        New-AzureSqlDatabase -RequestedServiceObjectiveName "<Service Objective>" -DatabaseName "<Data Warehouse Name>" -ServerName "<Server Name>" -ResourceGroupName "<ResourceGroupName>" -Edition "DataWarehouse"

The necessary parameters for this cmdlet are as follows:
 + **RequestedServiceObjectiveName**: The amount of DWU you are requesting, in the form "DWXXX" currently supported values are: 100, 200, 300, 400, 500, 600, 1000, 1200, 1500, 2000.
 + **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
 + **ServerName**: The name of the server that you are using for creation (must be V12).
 + **ResourceGroupName**: Resource group you are using.  To find available resource groups in your subscription use Get-AzureResource.
 + **Edition**: You must set edition to "DataWarehouse" to create a SQL Data Warehouse. 

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

If you're interested in more on how to manage SQL Data Warehouse programmatically, check out our [Powershell][] or [REST API][] documentation.



<!--Image references-->

<!--Article references-->
[migrate]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-migrate/
[develop]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-develop/
[load]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-load/
[load sample data]: https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-manually-load-samples/
[Powershell]: https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-reference-powershell-cmdlets/
[REST API]: https://msdn.microsoft.com/library/azure/dn505719.aspx
[MSDN]:https://msdn.microsoft.com/en-us/library/azure/dn546722.aspx
[firewall rules]:https://azure.microsoft.com/en-us/documentation/articles/sql-database-configure-firewall-settings/
[How to install and configure Azure PowerShell]: powershell-install-configure.md
