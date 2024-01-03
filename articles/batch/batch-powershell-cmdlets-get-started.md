---
title: Get started with PowerShell
description: A quick introduction to the Azure PowerShell cmdlets you can use to manage Batch resources.
ms.topic: how-to
ms.date: 05/24/2023
ms.custom: seodec18, devx-track-azurepowershell, devx-track-linux
---

# Manage Batch resources with PowerShell cmdlets

With the Azure Batch PowerShell cmdlets, you can perform and script many common Batch tasks. This is a quick introduction to the cmdlets you can use to manage your Batch accounts and work with your Batch resources such as pools, jobs, and tasks.

For a complete list of Batch cmdlets and detailed cmdlet syntax, see the [Azure Batch cmdlet reference](/powershell/module/az.batch).

We recommend that you update your Azure PowerShell modules frequently to take advantage of service updates and enhancements.

## Prerequisites

- [Install and configure the Azure PowerShell module](/powershell/azure/). To install a specific Azure Batch module, such as a pre-release module, see the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.Batch/).

- Run the **Connect-AzAccount** cmdlet to connect to your subscription (the Azure Batch cmdlets ship in the Azure Resource Manager module):

  ```powershell
  Connect-AzAccount
  ```

- **Register with the Batch provider namespace**. You only need to perform this operation **once per subscription**.
  
  ```powershell
  Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
  ```

## Manage Batch accounts and keys

### Create a Batch account

**New-AzBatchAccount** creates a Batch account in a specified resource group. If you don't already have a resource group, create one by running the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. Specify one of the Azure regions in the **Location** parameter, such as "Central US". For example:

```powershell
New-AzResourceGroup –Name MyBatchResourceGroup –Location "Central US"
```

Then, create a Batch account in the resource group. Specify a name for the account in <*account_name*>, and the location and name of your resource group. Creating the Batch account can take some time to complete. For example:

```powershell
New-AzBatchAccount –AccountName <account_name> –Location "Central US" –ResourceGroupName <res_group_name>
```

> [!NOTE]
> The Batch account name must be unique to the Azure region for the resource group, contain between 3 and 24 characters, and use lowercase letters and numbers only.

### Get account access keys

**Get-AzBatchAccountKeys** shows the access keys associated with an Azure Batch account. For example, run the following to get the primary and secondary keys of the account you created.

```powershell
$Account = Get-AzBatchAccountKeys –AccountName <account_name>

$Account.PrimaryAccountKey

$Account.SecondaryAccountKey
```

### Generate a new access key

**New-AzBatchAccountKey** generates a new primary or secondary account key for an Azure Batch account. For example, to generate a new primary key for your Batch account, type:

```powershell
New-AzBatchAccountKey -AccountName <account_name> -KeyType Primary
```

> [!NOTE]
> To generate a new secondary key, specify "Secondary" for the **KeyType** parameter. You have to regenerate the primary and secondary keys separately.

### Delete a Batch account

**Remove-AzBatchAccount** deletes a Batch account. For example:

```powershell
Remove-AzBatchAccount -AccountName <account_name>
```

When prompted, confirm you want to remove the account. Account removal can take some time to complete.

## Create a BatchAccountContext object

You can authenticate to manage Batch resources using either shared key authentication or Microsoft Entra authentication. To authenticate using the Batch PowerShell cmdlets, first create a BatchAccountContext object to store your account credentials or identity. You pass the BatchAccountContext object into cmdlets that use the **BatchContext** parameter.

### Shared key authentication

```powershell
$context = Get-AzBatchAccountKeys -AccountName <account_name>
```

> [!NOTE]
> By default, the account's primary key is used for authentication, but you can explicitly select the key to use by changing your BatchAccountContext object’s **KeyInUse** property: `$context.KeyInUse = "Secondary"`.

<a name='azure-active-directory-authentication'></a>

### Microsoft Entra authentication

```powershell
$context = Get-AzBatchAccount -AccountName <account_name>
```

## Create and modify Batch resources

Use cmdlets such as **New-AzBatchPool**, **New-AzBatchJob**, and **New-AzBatchTask** to create resources under a Batch account. There are corresponding **Get-** and **Set-** cmdlets to update the properties of existing resources, and  **Remove-** cmdlets to remove resources under a Batch account.

When using many of these cmdlets, in addition to passing a BatchContext object, you need to create or pass objects that contain detailed resource settings, as shown in the following example. See the detailed help for each cmdlet for additional examples.

### Create a Batch pool

When creating or updating a Batch pool, you specify a [configuration](nodes-and-pools.md#configurations). Pools should generally be configured with Virtual Machine Configuration, which lets you either specify one of the supported Linux or Windows VM images listed in the [Azure Virtual Machines Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/compute?filters=virtual-machine-images&page=1), or provide a custom image that you have prepared. Cloud Services Configuration pools provide only Windows compute nodes and do not support all Batch features.

When you run **New-AzBatchPool**, pass the operating system settings in a PSVirtualMachineConfiguration or PSCloudServiceConfiguration object. For example, the following snippet creates a Batch pool with size Standard_A1 compute nodes in the virtual machine configuration, imaged with Ubuntu Server 20.04-LTS. Here, the **VirtualMachineConfiguration** parameter specifies the *$configuration* variable as the PSVirtualMachineConfiguration object. The **BatchContext** parameter specifies a previously defined variable *$context* as the BatchAccountContext object.

```powershell
$imageRef = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSImageReference" -ArgumentList @("UbuntuServer","Canonical","20.04-LTS")

$configuration = New-Object -TypeName "Microsoft.Azure.Commands.Batch.Models.PSVirtualMachineConfiguration" -ArgumentList @($imageRef, "batch.node.ubuntu 20.04")

New-AzBatchPool -Id "mypspool" -VirtualMachineSize "Standard_a1" -VirtualMachineConfiguration $configuration -AutoScaleFormula '$TargetDedicated=4;' -BatchContext $context
```

The target number of compute nodes in the new pool is calculated by an autoscaling formula. In this case, the formula is simply **$TargetDedicated=4**, indicating the number of compute nodes in the pool is 4 at most.

## Query for pools, jobs, tasks, and other details

Use cmdlets such as **Get-AzBatchPool**, **Get-AzBatchJob**, and **Get-AzBatchTask** to query for entities created under a Batch account.

### Query for data

As an example, use **Get-AzBatchPools** to find your pools. By default this queries for all pools under your account, assuming you already stored the BatchAccountContext object in *$context*:

```powershell
Get-AzBatchPool -BatchContext $context
```

### Use an OData filter

You can supply an OData filter using the **Filter** parameter to find only the objects you’re interested in. For example, you can find all pools with IDs starting with “myPool”:

```powershell
$filter = "startswith(id,'myPool')"

Get-AzBatchPool -Filter $filter -BatchContext $context
```

This method is not as flexible as using “Where-Object” in a local pipeline. However, the query gets sent to the Batch service directly so that all filtering happens on the server side, saving Internet bandwidth.

### Use the Id parameter

An alternative to an OData filter is to use the **Id** parameter. To query for a specific pool with id "myPool":

```powershell
Get-AzBatchPool -Id "myPool" -BatchContext $context
```

The **Id** parameter supports only full-ID search; not wildcards or OData-style filters.

### Use the MaxCount parameter

By default, each cmdlet returns a maximum of 1000 objects. If you reach this limit, either refine your filter to bring back fewer objects, or explicitly set a maximum using the **MaxCount** parameter. For example:

```powershell
Get-AzBatchTask -MaxCount 2500 -BatchContext $context
```

To remove the upper bound, set **MaxCount** to 0 or less.

### Use the PowerShell pipeline

Batch cmdlets use the PowerShell pipeline to send data between cmdlets. This has the same effect as specifying a parameter, but makes working with multiple entities easier.

For example, find and display all tasks under your account:

```powershell
Get-AzBatchJob -BatchContext $context | Get-AzBatchTask -BatchContext $context
```

Restart (reboot) every compute node in a pool:

```powershell
Get-AzBatchComputeNode -PoolId "myPool" -BatchContext $context | Restart-AzBatchComputeNode -BatchContext $context
```

## Application package management

[Application packages](batch-application-packages.md) provide a simplified way to deploy applications to the compute nodes in your pools. With the Batch PowerShell cmdlets, you can upload and manage application packages in your Batch account, and deploy package versions to compute nodes.

> [!IMPORTANT]
> You must link an Azure Storage account to your Batch account to use application packages.

**Create** an application:

```powershell
New-AzBatchApplication -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication"
```

**Add** an application package:

```powershell
New-AzBatchApplicationPackage -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication" -ApplicationVersion "1.0" -Format zip -FilePath package001.zip
```

Set the **default version** for the application:

```powershell
Set-AzBatchApplication -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication" -DefaultVersion "1.0"
```

**List** an application's packages

```powershell
$application = Get-AzBatchApplication -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication"

$application.ApplicationPackages
```

**Delete** an application package

```powershell
Remove-AzBatchApplicationPackage -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication" -ApplicationVersion "1.0"
```

**Delete** an application

```powershell
Remove-AzBatchApplication -AccountName <account_name> -ResourceGroupName <res_group_name> -ApplicationId "MyBatchApplication"
```

> [!NOTE]
> You must delete all of an application's application package versions before you delete the application. You will receive a 'Conflict' error if you try to delete an application that currently has application packages.

### Deploy an application package

You can specify one or more application packages for deployment when you create a pool. When you specify a package at pool creation time, it is deployed to each node as the node joins pool. Packages are also deployed when a node is rebooted or reimaged.

Specify the `-ApplicationPackageReference` option when creating a pool to deploy an application package to the pool's nodes as they join the pool. First, create a **PSApplicationPackageReference** object, and configure it with the application ID and package version you want to deploy to the pool's compute nodes:

```powershell
$appPackageReference = New-Object Microsoft.Azure.Commands.Batch.Models.PSApplicationPackageReference

$appPackageReference.ApplicationId = "MyBatchApplication"

$appPackageReference.Version = "1.0"
```

Now create the pool, and specify the package reference object as the argument to the `ApplicationPackageReferences` option:

```powershell
New-AzBatchPool -Id "PoolWithAppPackage" -VirtualMachineSize "Small" -VirtualMachineConfiguration $configuration -BatchContext $context -ApplicationPackageReferences $appPackageReference
```

You can find more information on application packages in [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).

### Update a pool's application packages

To update the applications assigned to an existing pool, first create a PSApplicationPackageReference object with the desired properties (application ID and package version):

```powershell
$appPackageReference = New-Object Microsoft.Azure.Commands.Batch.Models.PSApplicationPackageReference

$appPackageReference.ApplicationId = "MyBatchApplication"

$appPackageReference.Version = "2.0"

```

Next, get the pool from Batch, clear out any existing packages, add the new package reference, and update the Batch service with the new pool settings:

```powershell
$pool = Get-AzBatchPool -BatchContext $context -Id "PoolWithAppPackage"

$pool.ApplicationPackageReferences.Clear()

$pool.ApplicationPackageReferences.Add($appPackageReference)

Set-AzBatchPool -BatchContext $context -Pool $pool
```

You've now updated the pool's properties in the Batch service. To actually deploy the new application package to compute nodes in the pool, however, you must restart or reimage those nodes. You can restart every node in a pool with this command:

```powershell
Get-AzBatchComputeNode -PoolId "PoolWithAppPackage" -BatchContext $context | Restart-AzBatchComputeNode -BatchContext $context
```

> [!TIP]
> You can deploy multiple application packages to the compute nodes in a pool. If you'd like to add an application package instead of replacing the currently deployed packages, omit the `$pool.ApplicationPackageReferences.Clear()` line above.

## Next steps

- Review the [Azure Batch cmdlet reference](/powershell/module/az.batch) for detailed cmdlet syntax and examples.
- Learn how to [deploy applications to compute nodes with Batch application packages](batch-application-packages.md).
