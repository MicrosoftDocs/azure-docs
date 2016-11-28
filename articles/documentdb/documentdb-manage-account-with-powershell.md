---
title: DocumentDB Automation - Management with Powershell | Microsoft Docs
description: Use Azure Powershell manage your DocumentDB database accounts. DocumentDB is a cloud-based NoSQL database for JSON data.
services: documentdb
author: dmakwana
manager: jhubbard
editor: ''
tags: azure-resource-manager
documentationcenter: ''

ms.assetid: 12ea83f7-6e60-4ac5-ab59-90953c2d63f9
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/23/2016
ms.author: dimakwan

---
# Automate DocumentDB account management using Azure Powershell

The following guide describes commands based off Azure Powershell to automate management of your DocumentDB database accounts. It also includes commands to manage account keys and failover priorities in multi-region database accounts.

## Getting Started

Follow the instructions in [How to install and configure Azure PowerShell](powershell-install-configure) to install and login to your Azure Resource Manager account.

### Notes

* If you would like to execute the following commands without requiring user confirmation, append the `-Force` flag to the command.

## <a id="create-documentdb-account-powershell"></a> Create a DocumentDB Database Account

This command allows you to create a new DocumentDB database account. Configure your new database account as either single-region or [multi-region](distribute-data-globally) with a certain [consistency policy](documentdb-consistency-levels.md).

    $locations = $(@{"locationName"="<write-region-location>"; "failoverPriority"=0}, @{"locationName"="<read-region-location>"; "failoverPriority"=1})
    $consistencyPolicy = @{"defaultConsistencyLevel"="<default-consistency-level>"; "maxIntervalInSeconds"="<max-interval>"; "maxStalenessPrefix"="<max-staleness-prefix>"}
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName <resource-group-name>  -Location "<resource-group-location>" -Name <database-account-name> -PropertyObject $DocumentDBProperties
    
* `<write-region-location>` The location name of the write region of the database account. This is required to have a failover priority value of 0. There must be exactly one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This is required to have a failover priority value of greater than 0. There can be more than one read regions per database account.
* `<default-consistency-level>` The default consistency level of the DocumentDB account. See [Consistency Levels in DocumentDB](documentdb-consistency-levels.md) for more information.
* `<max-interval>` When used with Bounded Staleness consistency, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 1 - 100.
* `<max-staleness-prefix>` When used with Bounded Staleness consistency, this value represents the number of stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647.
* `<resource-group-name>` The name of the [Azure Resource Group](azure-resource-groups) to which the new DocumentDB database account belongs to.
* `<resource-group-location>` The location of the Azure Resource Group to which the new DocumentDB database account belongs to.
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example: 

    $locations = $(@{"locationName"="West US"; "failoverPriority"=0}, @{"locationName"="East US"; "failoverPriority"=1})
    $consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness"; "maxIntervalInSeconds"=5; "maxStalenessPrefix"=100}
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Location "West US" -Name "docdb-test" -PropertyObject $DocumentDBProperties

### Notes
* The example above creates a database account with two regions. It is also possible to create a database account with either one region (which will be the write region and have a failover priority value of 0) or more than two regions. For more information, see [multi-region database accounts](distribute-data-globally).
* The locations must be regions in which DocumentDB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).
* This is a synchronous call and will only successfully return once the database account is fully created.

## <a id="update-documentdb-account-powershell"></a> Update a DocumentDB Database Account

This command allows you to update your DocumentDB database account properties. This includes the consistency policy and the locations which the database account exists in. Note: This command allows you to add and remove regions but will not allow you to modify failover priorities. To modify failover priorities, see [below](#modify-failover-priority-powershell).

    $locations = $(@{"locationName"="<write-region-location>"; "failoverPriority"=0}, @{"locationName"="<read-region-location>"; "failoverPriority"=1})
    $consistencyPolicy = @{"defaultConsistencyLevel"="<default-consistency-level>"; "maxIntervalInSeconds"="<max-interval>"; "maxStalenessPrefix"="<max-staleness-prefix>"}
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy}
    Set-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName <resource-group-name>  -Location "<resource-group-location>" -Name <database-account-name> -PropertyObject $DocumentDBProperties
    
* `<write-region-location>` The location name of the write region of the database account. This is required to have a failover priority value of 0. There must be exactly one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This is required to have a failover priority value of greater than 0. There can be more than one read regions per database account.
* `<default-consistency-level>` The default consistency level of the DocumentDB account. See [Consistency Levels in DocumentDB](documentdb-consistency-levels.md) for more information.
* `<max-interval>` When used with Bounded Staleness consistency, this value represents the time amount of staleness (in seconds) tolerated. Accepted range for this value is 1 - 100.
* `<max-staleness-prefix>` When used with Bounded Staleness consistency, this value represents the number of stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647.
* `<resource-group-name>` The name of the [Azure Resource Group](azure-resource-groups) to which the new DocumentDB database account belongs to.
* `<resource-group-location>` The location of the Azure Resource Group to which the new DocumentDB database account belongs to.
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example: 

    $locations = $(@{"locationName"="West US"; "failoverPriority"=0}, @{"locationName"="East US"; "failoverPriority"=1})
    $consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness"; "maxIntervalInSeconds"=5; "maxStalenessPrefix"=100}
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations; "consistencyPolicy"=$consistencyPolicy}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Location "West US" -Name "docdb-test" -PropertyObject $DocumentDBProperties


## <a id="delete-documentdb-account-powershell"></a> Delete a DocumentDB Database Account

This command allows you to delete an existing DocumentDB database account.

    Remove-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"
    
* `<resource-group-name>` The name of the [Azure Resource Group](azure-resource-groups) to which the new DocumentDB database account belongs to.
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example:

    Remove-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="get-documentdb-properties-powershell"></a> Get Properties of a DocumentDB Database Account

This command allows you to get the properties of an existing DocumentDB database account.

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

* `<resource-group-name>` The name of the [Azure Resource Group](azure-resource-groups) to which the new DocumentDB database account belongs to.
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example:

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## <a id="update-tags-powershell"></a> Update Tags of a DocumentDB Database Account

The following example describes how to set [Azure resource tags](azure-resource-tags) for your DocumentDB database account. Note: this can also be done during create and update of your database account.

Example:

    $tags = @{"dept" = "Finance”; “test” = “test1”}
    Set-AzureRmResource -ResourceType “Microsoft.DocumentDB/databaseAccounts”  -ResourceGroupName "dimakwan-test" -Name "powershell-test-3" -Tags $tags

## <a id="list-account-keys-powershell"></a> List Account Keys

    Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

Example:

    Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

## <a id="regenerate-account-keys-powershell"></a> Regenerate Account Keys

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>" -Parameters @{"keyKind"="<key-kind>"}

* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.
* `<key-kind>` ["Primary", "Secondary", "PrimaryReadonly", "SecondaryReadonly"]

Example:

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Parameters @{"keyKind"="Primary"}

## <a id="modify-failover-priority-powershell"></a> Modify Failover Priority of a DocumentDB Database Account

    $failoverPolicies = $(@{"locationName"="<write-region-location>"; "failoverPriority"=0},@{"locationName"="<read-region-location>"; "failoverPriority"=1})
    Invoke-AzureRmResourceAction -Action failoverPriorityChange -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>" -Parameters @{"failoverPolicies"=$failoverPolicies}

* `<write-region-location>` The location name of the write region of the database account. This is required to have a failover priority value of 0. There must be one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This is required to have a failover priority value of greater than 0. There are .
* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example:

    $failoverPolicies = $(@{"locationName"="East US"; "failoverPriority"=0},@{"locationName"="West US"; "failoverPriority"=1})
    Invoke-AzureRmResourceAction -Action failoverPriorityChange -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Parameters @{"failoverPolicies"=$failoverPolicies}

### Notes

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[powershell-install-configure]: https://docs.microsoft.com/en-us/azure/powershell-install-configure
[distribute-data-globally]: https://docs.microsoft.com/en-us/azure/documentdb/documentdb-distribute-data-globally#scaling-across-the-planet
[azure-resource-groups]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups
[azure-resource-tags]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags