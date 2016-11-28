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

## Install Azure Powershell

Follow the instructions in [How to install and configure Azure PowerShell](powershell-install-configure) to install and login to your Azure Resource Manager account.

## Common

* Use the `-Force` flag to execute the commands below without user confirmation 

## Create a DocumentDB Database Account

    $locations = $(@{"locationName"="<write-region-location>"; "failoverPriority"=0}, @{"locationName"="<read-region-location>"; "failoverPriority"=1})
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName <resource-group-name>  -Location "<resource-group-location>" -Name <database-account-name> -PropertyObject $DocumentDBProperties
    
* `<write-region-location>` The location name of the write region of the database account. This is required to have a failover priority value of 0. There must be one write region per database account.
* `<read-region-location>` The location name of the read region of the database account. This is required to have a failover priority value of greater than 0. There are .
* `<resource-group-name>`
* `<resource-group-location>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.


### Notes

Example: 

    $locations = $(@{"locationName"="westus"; "failoverPriority"=0}, @{"locationName"="eastus"; "failoverPriority"=1})
    $DocumentDBProperties = @{"databaseAccountOfferType"="Standard"; "locations"=$locations}
    New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Location "westus" -Name "docdb-test" -PropertyObject $DocumentDBProperties

## Delete a DocumentDB Database Account

## Get Properties of a DocumentDB Database Account

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

Example:

    Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

## List Account Keys

    Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>"

Example:

    Invoke-AzureRmResourceAction -Action listKeys -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test"

* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.

## Regenerate Account Keys

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "<resource-group-name>" -Name "<database-account-name>" -Parameters @{"keyKind"="<key-kind>"}

* `<resource-group-name>`
* `<database-account-name>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.
* `<key-kind>` ["Primary", "Secondary", "PrimaryReadonly", "SecondaryReadonly"]

Example:

    Invoke-AzureRmResourceAction -Action regenerateKey -ResourceType "Microsoft.DocumentDb/databaseAccounts" -ApiVersion "2015-04-08" -ResourceGroupName "rg-test" -Name "docdb-test" -Parameters @{"keyKind"="Primary"}

## Modify failover priority of a DocumentDB Database Account

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

