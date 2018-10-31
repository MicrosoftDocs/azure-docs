---
title: Azure Cosmos DB Automation - Management with Powershell | Microsoft Docs
description: Use Azure Powershell manage your Azure Cosmos DB accounts. 
services: cosmos-db
author: SnehaGunda
manager: kfile
editor: ''
tags: azure-resource-manager

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 04/21/2017
ms.author: sngun

---
# Create an Azure Cosmos DB account using PowerShell

The following guide describes commands to automate management of your Azure Cosmos DB database accounts using Azure Powershell. It also includes commands to manage account keys and failover priorities in [multi-region database accounts][distribute-data-globally.md]. Updating your database account allows you to modify consistency policies and add/remove regions. For cross-platform management of your Azure Cosmos DB account, you can use either [Azure CLI](cli-samples.md), the [Resource Provider REST API][rp-rest-api], or the [Azure portal](create-sql-api-dotnet.md#create-account).

## Getting Started

Follow the instructions in [How to install and configure Azure PowerShell][powershell-install-configure] to install and log in to your Azure Resource Manager account in Powershell.

### Notes

* If you would like to execute the following commands without requiring user confirmation, append the `-Force` flag to the command.
* All the following commands are synchronous.

## <a id="create-documentdb-account-powershell"></a> Create an Azure Cosmos DB Account

This command allows you to create an Azure Cosmos DB database account. Configure your new database account as either single-region or [multi-region][distribute-data-globally.md] with a certain [consistency policy](consistency-levels.md).

    $locations = @(@{"locationName"="<write-region-location>"; "failoverPriority"=0}, @{"locationName"="<read-region-location>"; "failoverPriority"=1})
    $iprangefilter = "<ip-range-filter>"
    $consistencyPolicy = @{"defaultConsistencyLevel"="<default-consistency-level>"; "maxIntervalInSeconds"="<max-interval>"; "maxStalenessPrefix"="<max-staleness-prefix>"}
    $CosmosDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy; "ipRangeFilter"=$iprangefilter}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName <resource-group-name>  -Location "<resource-group-location>" -Name <database-account-name> -Properties $CosmosDBProperties
    
* `<write-region-location>` The location name of the write region of the database account. This location is required to have a failover priority value of 0. There must be exactly one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This location is required to have a failover priority value of greater than 0. There can be more than one read regions per database account.
* `<ip-range-filter>` Specifies the set of IP addresses or IP address ranges in CIDR form to be included as the allowed list of client IPs for a given database account. IP addresses/ranges must be comma separated and must not contain any spaces. For more information, see [Azure Cosmos DB Firewall Support](firewall-support.md)
* `<default-consistency-level>` The default consistency level of the Azure Cosmos DB account. For more information, see [Consistency Levels in Azure Cosmos DB](consistency-levels.md).
* `<max-interval>` When used with Bounded Staleness consistency, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 1 - 100.
* `<max-staleness-prefix>` When used with Bounded Staleness consistency, this value represents the number of stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647.
* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<resource-group-location>` The location of the Azure Resource Group to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account to be created. It can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example: 

    $locations = @(@{"locationName"="West US"; "failoverPriority"=0}, @{"locationName"="East US"; "failoverPriority"=1})
    $iprangefilter = ""
    $consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness"; "maxIntervalInSeconds"=5; "maxStalenessPrefix"=100}
    $CosmosDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy; "ipRangeFilter"=$iprangefilter}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Location "West US" -Name "docdb-test" -Properties $CosmosDBProperties

### Notes
* The preceding example creates a database account with two regions. It is also possible to create a database account with either one region (which is designated as the write region and have a failover priority value of 0) or more than two regions. For more information, see [multi-region database accounts][distribute-data-globally.md].
* The locations must be regions in which Azure Cosmos DB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

## <a id="update-documentdb-account-powershell"></a> Update an Azure Cosmos DB database account

This command allows you to update your Azure Cosmos DB database account properties. This includes the consistency policy and the locations which the database account exists in.

> [!NOTE]
> This command allows you to add and remove regions but does not allow you to modify failover priorities. To modify failover priorities, see [below](#modify-failover-priority-powershell).

    $locations = @(@{"locationName"="<write-region-location>"; "failoverPriority"=0}, @{"locationName"="<read-region-location>"; "failoverPriority"=1})
    $iprangefilter = "<ip-range-filter>"
    $consistencyPolicy = @{"defaultConsistencyLevel"="<default-consistency-level>"; "maxIntervalInSeconds"="<max-interval>"; "maxStalenessPrefix"="<max-staleness-prefix>"}
    $CosmosDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy; "ipRangeFilter"=$iprangefilter}
    Set-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName <resource-group-name> -Name <database-account-name> -Properties $CosmosDBProperties
    
* `<write-region-location>` The location name of the write region of the database account. This location is required to have a failover priority value of 0. There must be exactly one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This location is required to have a failover priority value of greater than 0. There can be more than one read regions per database account.
* `<default-consistency-level>` The default consistency level of the Azure Cosmos DB account. For more information, see [Consistency Levels in Azure Cosmos DB](consistency-levels.md).
* `<ip-range-filter>` Specifies the set of IP addresses or IP address ranges in CIDR form to be included as the allowed list of client IPs for a given database account. IP addresses/ranges must be comma separated and must not contain any spaces. For more information, see [Azure Cosmos DB Firewall Support](firewall-support.md)
* `<max-interval>` When used with Bounded Staleness consistency, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 1 - 100.
* `<max-staleness-prefix>` When used with Bounded Staleness consistency, this value represents the number of stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647.
* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<resource-group-location>` The location of the Azure Resource Group to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account to be updated.

Example: 

    $locations = @(@{"locationName"="West US"; "failoverPriority"=0}, @{"locationName"="East US"; "failoverPriority"=1})
    $iprangefilter = ""
    $consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness"; "maxIntervalInSeconds"=5; "maxStalenessPrefix"=100}
    $CosmosDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy; "ipRangeFilter"=$iprangefilter}
    Set-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Properties $CosmosDBProperties

## <a id="delete-documentdb-account-powershell"></a> Delete an Azure Cosmos DB database account

This command allows you to delete an existing Azure Cosmos DB database account.

    Remove-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"
    
* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account to be deleted.

Example:

    Remove-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="get-documentdb-properties-powershell"></a> Get properties of an Azure Cosmos DB database account

This command allows you to get the properties of an existing Azure Cosmos DB database account.

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account.

Example:

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="update-tags-powershell"></a> Update Tags of an Azure Cosmos DB Database Account

The following example describes how to set [Azure resource tags][azure-resource-tags] for your Azure Cosmos DB database account.

> [!NOTE]
> This command can be combined with the create or update commands by appending the `-Tags` flag with the corresponding parameter.

Example:

    $tags = @{"dept" = "Finance"; environment = "Production"}
    Set-AzureRmResource -ResourceType "Microsoft.DocumentDB/databaseAccounts"  -ResourceGroupName "rg-test" -Name "docdb-test" -Tags $tags

## <a id="list-account-keys-powershell"></a> List Account Keys

When you create an Azure Cosmos DB account, the service generates two master access keys that can be used for authentication when the Azure Cosmos DB account is accessed. By providing two access keys, Azure Cosmos DB enables you to regenerate the keys with no interruption to your Azure Cosmos DB account. Read-only keys for authenticating read-only operations are also available. There are two read-write keys (primary and secondary) and two read-only keys (primary and secondary).

    $keys = Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account.

Example:

    $keys = Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="list-connection-strings-powershell"></a> List Connection Strings

For MongoDB accounts, the connection string to connect your MongoDB app to the database account can be retrieved using the following command.

    $keys = Invoke-AzureRmResourceAction -Action listConnectionStrings -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account.

Example:

    $keys = Invoke-AzureRmResourceAction -Action listConnectionStrings -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="regenerate-account-key-powershell"></a> Regenerate Account Key

You should change the access keys to your Azure Cosmos DB account periodically to help keep your connections more secure. Two access keys are assigned to enable you to maintain connections to the Azure Cosmos DB account using one access key while you regenerate the other access key.

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>" -Parameters @{"keyKind"="<key-kind>"}

* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account.
* `<key-kind>` One of the four types of keys: ["Primary"|"Secondary"|"PrimaryReadonly"|"SecondaryReadonly"] that you would like to regenerate.

Example:

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Parameters @{"keyKind"="Primary"}

## <a id="modify-failover-priority-powershell"></a> Modify Failover Priority of an Azure Cosmos DB Database Account

For multi-region database accounts, you can change the failover priority of the various regions which the Azure Cosmos DB database account exists in. For more information on failover in your Azure Cosmos DB database account, see [Distribute data globally with Azure Cosmos DB][distribute-data-globally].

    $failoverPolicies = @(@{"locationName"="<write-region-location>"; "failoverPriority"=0},@{"locationName"="<read-region-location>"; "failoverPriority"=1})
    Invoke-AzureRmResourceAction -Action failoverPriorityChange -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>" -Parameters @{"failoverPolicies"=$failoverPolicies}

* `<write-region-location>` The location name of the write region of the database account. This location is required to have a failover priority value of 0. There must be exactly one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This location is required to have a failover priority value of greater than 0. There can be more than one read regions per database account.
* `<resource-group-name>` The name of the [Azure Resource Group][azure-resource-groups] to which the new Azure Cosmos DB database account belongs to.
* `<database-account-name>` The name of the Azure Cosmos DB database account.

Example:

    $failoverPolicies = @(@{"locationName"="East US"; "failoverPriority"=0},@{"locationName"="West US"; "failoverPriority"=1})
    Invoke-AzureRmResourceAction -Action failoverPriorityChange -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Parameters @{"failoverPolicies"=$failoverPolicies}

## Next steps

* To connect using .NET, see [Connect and query with .NET](create-sql-api-dotnet.md).
* To connect using Node.js, see [Connect and query with Node.js and a MongoDB app](create-mongodb-nodejs.md).

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[powershell-install-configure]: https://docs.microsoft.com/azure/powershell-install-configure
[scaling-globally]: distribute-data-globally.md#EnableGlobalDistribution
[distribute-data-globally]: distribute-data-globally.md
[azure-resource-groups]: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups
[azure-resource-tags]: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags
[rp-rest-api]: https://docs.microsoft.com/rest/api/cosmos-db-resource-provider/
