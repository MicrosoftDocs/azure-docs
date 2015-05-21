<properties
   pageTitle="Get started with Azure Batch PowerShell cmdlets"
   description="Introduces the Azure PowerShell cmdlets used to manage the Azure Batch service"
   services="batch"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor="yidingz"/>

<tags
   ms.service="batch"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="big-compute"
   ms.date="04/15/2015"
   ms.author="danlep"/>

# Get started with Azure Batch PowerShell cmdlets
This article is a quick introduction to the Azure PowerShell cmdlets you can use to manage your Batch accounts and get information about your Batch workitems, jobs, and tasks.

For detailed cmdlet syntax, type ```get-help <Cmdlet_name>```.


## Prerequisites

* **Batch Preview** - Sign up for the [Batch preview](https://account.windowsazure.com/PreviewFeatures), if you haven't already, to work with the service.
* **Azure PowerShell** - See [How to install and configure Azure PowerShell](powershell-install-configure.md) for prerequisites and download and installation instructions. Batch cmdlets were introduced in version 0.8.10 and later versions.

## Use the Batch cmdlets

Use standard procedures to start Azure PowerShell and [connect to your Azure subscriptions](powershell-install-configure.md#Connect). Additionally:

* **Select Azure subscription** - If you have more than subscription, select the subscription where you added the Batch Preview feature:

    ```
    Select-AzureSubscription -SubscriptionName <SubscriptionName>
    ```

* **Switch to AzureResourceManage mode** - The Batch cmdlets ship in the Azure Resource Manager module. See [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md) for details. To use this module, run the [Switch-AzureMode](https://msdn.microsoft.com/library/dn722470.aspx) cmdlet:

    ```
    Switch-AzureMode -Name AzureResourceManager
    ```

## Manage Batch accounts and keys

You can use Azure PowerShell cmdlets to create and manage Batch accounts and keys.

### Create a Batch account

**New-AzureBatchAccount** creates a new Batch account in a specified resource group. If you do not already have a resource group, create one by running the [New-AzureResourceGroup](https://msdn.microsoft.com/library/dn654594.aspx) cmdlet, specifying one of the Azure regions in the **Location** parameter. (You can find available regions for different Azure resources by running [Get-AzureLocation](https://msdn.microsoft.com/library/dn654582.aspx).) For example:

```
New-AzureResourceGroup –Name MyBatchResourceGroup –location "Central US"
```

Then, create a new Batch account account in the resource group, also specifying an account name for <*account_name*> and a location where the Batch service is available. Creating the account can take several minutes to complete. For example:

```
New-AzureBatchAccount –AccountName <account_name> –Location "Central US" –ResourceGroupName MyBatchResourceGroup
```

> [AZURE.NOTE] The Batch account name must be unique to Azure, contain between 3 and 24 characters, and use lowercase letters and numbers only.

### Get account access keys
**Get-AzureBatchAccountKeys** shows the access keys associated with an Azure Batch account. For example, run the following to get the primary and secondary keys of the account you created.

```
$Account = Get-AzureBatchAccountKeys –AccountName <accountname>
$Account.PrimaryAccountKey
$Account.SecondaryAccountKey
```

### Generate a new access key
**New-AzureBatchAccountKey** generates a new primary or secondary account key for an Azure Batch account. For example, to generate a new primary key for your Batch account, type:

```
New-AzureBatchAccountKey -AccountName <account_name> -KeyType Primary
```

> [AZURE.NOTE] To generate a new secondary key, specify "Secondary" for the **KeyType** parameter. You have to regenerate the primary and secondary keys separately.

### Delete a Batch account
**Remove-AzureBatchAccount** deletes a Batch account. For example:

```
Remove-AzureBatchAccount -AccountName <account_name>
```

When prompted, confirm you want to remove the account. Account removal can take some time to complete.

## Query for workitems, jobs, and tasks

Use cmdlets such as **Get-AzureBatchWorkItem**, **Get-AzureBatchJob**, **Get-AzureBatchTask**, and **Get-AzureBatchPool** to query for entities created under a Batch account.

To use these cmdlets, you first need to create an AzureBatchContext object to store your account name and keys:

```
$context = Get-AzureBatchAccountKeys "<account_name>"
```

You pass this context into cmdlets that interact with the Batch service by using the **BatchContext** parameter.

> [AZURE.NOTE] By default, the account's primary key is used for authentication, but you can explicitly select the key to use by changing your BatchAccountContext object’s **KeyInUse** property:
```$context.KeyInUse = "Secondary"```.


### Query for data

As an example, use **Get-AzureBatchWorkItem** to find your workitems. By default this queries for all workitems under your account, assuming you already stored the BatchAccountContext object in *$context*:

```
Get-AzureBatchWorkItem -BatchContext $context
```

The same can be done with other entities, such as pools:

```
Get-AzureBatchPool -BatchContext $context
```
### Use an OData filter

You can supply an OData filter using the **Filter** parameter to find only the objects you’re interested in. For example, you can find all workitems with names starting with “myWork”:

```
$filter = "startswith(name,'myWork') and state eq 'active'" 
Get-AzureBatchWorkItem -Filter $filter -BatchContext $context
``` 

This method is not as flexible as using “Where-Object” in a local pipeline. However, the query gets sent to the Batch service directly so that all filtering happens on the server side, saving Internet bandwidth. 

### Use the Name parameter

An alternative to an OData filter is to use the **Name** parameter. To query for a specific workitem named "myWorkItem":

``` 
Get-AzureBatchWorkItem -Name "myWorkItem" -BatchContext $context 

```
The **Name** parameter supports only full-name search, not wildcards or OData-style filters. 

### Use the pipleline

Batch cmdlets can leverage the PowerShell pipeline to send data between cmdlets. This has the same effect as specifying a parameter but makes listing multiple entities easier. For example, you can find all tasks under your account: 

```
Get-AzureBatchWorkItem -BatchContext $context | Get-AzureBatchJob -BatchContext $context | Get-AzureBatchTask -BatchContext $context 
```

### Use the MaxCount parameter

By default, each cmdlet returns a maximum of 1000 objects. If you reach this limit, you can either refine your filter to bring back fewer objects, or explicitly set a maximum using the **MaxCount** parameter. For example:

```
Get-AzureBatchWorkItem -MaxCount 2500 -BatchContext $context 

```

To remove the upper bound, set **MaxCount** to 0 or less. 

## Related topics
* [Batch technical overview](batch-technical-overview.md)
* [Download Azure PowerShell](http://go.microsoft.com/p/?linkid=9811175)
* [Azure cmdlet reference](https://msdn.microsoft.com/library/jj554330.aspx)
