<properties
   pageTitle="Get started with Azure Batch PowerShell | Microsoft Azure"
   description="Get a quick introduction to the Azure PowerShell cmdlets you can use to manage the Azure Batch service"
   services="batch"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""/>

<tags
   ms.service="batch"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="powershell"
   ms.workload="big-compute"
   ms.date="07/28/2016"
   ms.author="danlep"/>

# Get started with Azure Batch PowerShell cmdlets
With the Azure Batch PowerShell cmdlets, you can perform and script many of the same tasks you carry out with the Batch APIs, the Azure portal, and the Azure Command-Line Interface (CLI). This is a quick introduction to the cmdlets you can use to manage your Batch accounts and work with your Batch resources such as pools, jobs, and tasks. This article is based on cmdlets in Azure PowerShell version 1.6.0.

For a complete list of Batch cmdlets and detailed cmdlet syntax, see the [Azure Batch cmdlet reference](https://msdn.microsoft.com/library/azure/mt125957.aspx). 


## Prerequisites

* **Azure PowerShell** - See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for instructions to download and install Azure PowerShell. 
   
    * Because the Azure Batch cmdlets ship in the Azure Resource Manager module, you'll need to run the **Login-AzureRmAccount** cmdlet to connect to your subscription. 
    
    * We recommend that you update your Azure PowerShell frequently to take advantage of service updates and enhancements. 
    
* **Register with the Batch provider namespace (one-time operation)** - Before working with your Batch accounts, you have to register with the Batch provider namespace. This operation only needs to be performed once per subscription. Run the following cmdlet:

        Register-AzureRMResourceProvider -ProviderNamespace Microsoft.Batch


## Manage Batch accounts and keys

### Create a Batch account

**New-AzureRmBatchAccount** creates a new Batch account in a specified resource group. If you don't already have a resource group, create one by running the [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/azure/mt603739.aspx) cmdlet, specifying one of the Azure regions in the **Location** parameter, such as "Central US". For example:


    New-AzureRmResourceGroup –Name MyBatchResourceGroup –location "Central US"


Then, create a new Batch account account in the resource group, specifying a name for the account in <*account_name*> and the location and name of your resource group. Creating the Batch account can take some time to complete. For example:


    New-AzureRmBatchAccount –AccountName <account_name> –Location "Central US" –ResourceGroupName MyBatchResourceGroup

> [AZURE.NOTE] The Batch account name must be unique to the Azure region for the resource group, contain between 3 and 24 characters, and use lowercase letters and numbers only.

### Get account access keys
**Get-AzureRmBatchAccountKeys** shows the access keys associated with an Azure Batch account. For example, run the following to get the primary and secondary keys of the account you created.

    $Account = Get-AzureRmBatchAccountKeys –AccountName <accountname>

    $Account.PrimaryAccountKey

    $Account.SecondaryAccountKey


### Generate a new access key
**New-AzureRmBatchAccountKey** generates a new primary or secondary account key for an Azure Batch account. For example, to generate a new primary key for your Batch account, type:


    New-AzureRmBatchAccountKey -AccountName <account_name> -KeyType Primary


> [AZURE.NOTE] To generate a new secondary key, specify "Secondary" for the **KeyType** parameter. You have to regenerate the primary and secondary keys separately.

### Delete a Batch account
**Remove-AzureRmBatchAccount** deletes a Batch account. For example:


    Remove-AzureRmBatchAccount -AccountName <account_name>

When prompted, confirm you want to remove the account. Account removal can take some time to complete.

## Create a BatchAccountContext object

To authenticate using the Batch PowerShell cmdlets when you create and manage Batch pools, jobs, tasks, and other resources, first create a BatchAccountContext object to store your account name and keys:

    $context = Get-AzureRmBatchAccountKeys -AccountName <account_name>

You pass the BatchAccountContext object into cmdlets that use the **BatchContext** parameter.

> [AZURE.NOTE] By default, the account's primary key is used for authentication, but you can explicitly select the key to use by changing your BatchAccountContext object’s **KeyInUse** property: `$context.KeyInUse = "Secondary"`.



## Create and modify Batch resources
Use cmdlets such as **New-AzureBatchPool**, **New-AzureBatchJob**, and **New-AzureBatchTask** to create resources under a Batch account. There are corresponding **Get-** and **Set-** cmdlets to update the properties of existing resources, and  **Remove-** cmdlets to remove resources under a Batch account. 

When using many of these cmdlets, in addition to passing a BatchContext object, you need to create or pass objects that contain detailed resource settings, as shown in the following example. See the detailed help for each cmdlet for additional examples.

### Create a Batch pool

When creating or updating a Batch pool, you have the option to select a cloud service configuration or a virtual machine configuration for the operating system on the compute nodes (see [Batch feature overview](batch-api-basics.md#pool)). Your choice determines whether your compute nodes are imaged with one of the [Azure Guest OS releases](../cloud-services/cloud-services-guestos-update-matrix.md#releases) or with one of the supported Linux or Windows VM images in the Azure Marketplace. 

When you run **New-AzureBatchPool**, pass the operating system settings in a PSCloudServiceConfiguration or PSVirtualMachineConfiguration object. For example, the following cmdlet creates a new Batch pool with size Small compute nodes in the cloud service configuration, imaged with the latest operating system version of family 3 (Windows Server 2012). Here, the **CloudServiceConfiguration** parameter specifies the *$configuration* variable as the PSCloudServiceConfiguration object. The **BatchContext** parameter specifies a previously defined variable *$context* as the BatchAccountContext object.


    $configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSCloudServiceConfiguration" -ArgumentList @(3,"*")
    
    New-AzureBatchPool -Id "AutoScalePool" -VirtualMachineSize "Small" -CloudServiceConfiguration $configuration -AutoScaleFormula '$TargetDedicated=4;' -BatchContext $context

The target number of compute nodes in the new pool is determined by an autoscaling formula. In this case, the formula is simply **$TargetDedicated=4**, indicating the number of compute nodes in the pool is 4 at most. 

## Query for pool, jobs, tasks, and other details

Use cmdlets such as **Get-AzureBatchPool**, **Get-AzureBatchJob**, and **Get-AzureBatchTask** to query for entities created under a Batch account.


### Query for data

As an example, use **Get-AzureBatchPools** to find your pools. By default this queries for all pools under your account, assuming you already stored the BatchAccountContext object in *$context*:


    Get-AzureBatchPool -BatchContext $context

### Use an OData filter

You can supply an OData filter using the **Filter** parameter to find only the objects you’re interested in. For example, you can find all pools with ids starting with “myPool”:


    $filter = "startswith(id,'myPool')"

    Get-AzureBatchPool -Filter $filter -BatchContext $context


This method is not as flexible as using “Where-Object” in a local pipeline. However, the query gets sent to the Batch service directly so that all filtering happens on the server side, saving Internet bandwidth.

### Use the Id parameter

An alternative to an OData filter is to use the **Id** parameter. To query for a specific pool with id "myPool":


    Get-AzureBatchPool -Id "myPool" -BatchContext $context


The **Id** parameter supports only full-id search, not wildcards or OData-style filters.



### Use the MaxCount parameter

By default, each cmdlet returns a maximum of 1000 objects. If you reach this limit, either refine your filter to bring back fewer objects, or explicitly set a maximum using the **MaxCount** parameter. For example:


    Get-AzureBatchTask -MaxCount 2500 -BatchContext $context

To remove the upper bound, set **MaxCount** to 0 or less.

### Use the pipeline

Batch cmdlets can leverage the PowerShell pipeline to send data between cmdlets. This has the same effect as specifying a parameter but makes listing multiple entities easier. For example, the following finds all tasks under your account:


    Get-AzureBatchJob -BatchContext $context | Get-AzureBatchTask -BatchContext $context


## Next steps
* For detailed cmdlet syntax and examples, see [Azure Batch cmdlet reference](https://msdn.microsoft.com/library/azure/mt125957.aspx).

* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch. 
