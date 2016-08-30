<properties
   pageTitle="Get started with Azure Batch CLI | Microsoft Azure"
   description="Get a quick introduction to the Batch commands in Azure CLI for managing Azure Batch service resources"
   services="batch"
   documentationCenter=""
   authors="mmacy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="batch"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="powershell"
   ms.workload="big-compute"
   ms.date="08/31/2016"
   ms.author="marsma"/>

# Get started with Azure Batch CLI

The cross-platform Azure Command-Line Interface (Azure CLI) enables you to perform and script many of the tasks you carry out with the Batch APIs, Azure portal, and Azure Batch PowerShell cmdlets. This is a quick introduction to the Batch commands in the Azure CLI you can use to manage your Batch accounts and work with Batch resources such as pools, jobs, and tasks. This article is based on Azure CLI version 0.10.3.

## Prerequisites

* [Install the Azure CLI](../xplat-cli-install.md)

* [Connect to your Azure subscription from the Azure CLI](../xplat-cli-connect.md)

* Switch to **Resource Manager mode**: `azure config mode arm`

>[AZURE.TIP] We recommend that you update your Azure CLI installation frequently to take advantage of service updates and enhancements.

## Command help

You can display usage information for nearly every command in the Azure CLI by appending `-h` as the only option after the command.

For example, to get help for the `azure` command, enter: `azure -h`

To get a list of all Batch commands in the CLI, use: `azure batch -h`

To get help on creating a Batch account, enter: `azure batch account create -h`

When in doubt, use the `-h` command line option to get help on any Azure CLI command.

## Create a Batch account

* Usage:

  `azure batch account create [options] <name>`

* Example:

  ```azure batch account create --location "West US"  --resource-group "resgroup001" "batchaccount001"```

Creates a new Batch account with the specified parameters. You must specify at least a location, resource group, and account name. If you don't already have a resource group, create one by running the `azure group create` command, specifying one of the Azure regions (such as "West US") for the `--location` option. For example:

`azure group create --name "resgroup001" --location "West US"`

> [AZURE.NOTE] The Batch account name must be unique to the Azure region for the resource group, contain between 3 and 24 characters, and use lowercase letters and numbers only. You cannot use special characters like `-` or `_` in Batch account names.

### Linked storage account (autostorage)

You can (optionally) link a **General purpose** Storage account to your Batch account when you create it. The [application packages](batch-application-packages.md) feature of Batch uses blob storage in a linked General purpose Storage account, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications your Batch tasks run, and persisting the data they produce.

To link an existing Azure Storage account to a new Batch account when you create it, specify the `--autostorage-account-id` option. This option requires the fully qualified resource ID of the storage account.

First, show your storage account's details:

`azure storage account show --resource-group "resgroup001" "storageaccount001"`

Then use the **Url** value for the `--autostorage-account-id` option. The Url value starts with "/subscriptions/" and contains your subscription ID and resource path to the account:

    azure batch account create --location "West US"  --resource-group "resgroup001" --autostorage-account-id "/subscriptions/8ffffff8-4444-4444-bfbf-8ffffff84444/resourceGroups/resgroup001/providers/Microsoft.Storage/storageAccounts/storageaccount001" "batchaccount001"

## Delete a Batch account

* Usage:

  `azure batch account delete [options] <name>`

* Example:

  `azure batch account delete --resource-group "resgroup001" "batchaccount001"`

Deletes the specified Batch account. When prompted, confirm you want to remove the account. Note that account removal can take some time to complete.

## Manage account access keys

### List access keys

* Usage:

  `azure batch account keys list [options] <name>`

* Example:

  `azure batch account keys list --resource-group "resgroup001" "batchaccount001"`

Lists the account keys for the given Batch account.

### Generate a new access key

* Usage:

  `azure batch account keys renew [options] --<primary|secondary> <name>`

* Example:

  ```azure batch account keys renew --resource-group "resgroup001" --primary "batchaccount001"```

Lists the account keys for the given Batch account.

## Create and modify Batch resources

You can create, read, update, and delete (CRUD) Batch resources like pools, compute nodes, jobs, and tasks by using the Azure CLI. These operations require your Batch account name, access key, and endpoint (specified as the `-a`, `-k`, and `-u` options, repectively).

### Credential environment variables

You can set the `AZURE_BATCH_ACCOUNT`, `AZURE_BATCH_ACCESS_KEY`, and `AZURE_BATCH_ENDPOINT` environment variables instead of specifying the `-a`, `-k`, and `-u` options on the command line with each command.

The remainder of the examples in the article assume that you've set the `AZURE_BATCH_ACCOUNT`, `AZURE_BATCH_ACCESS_KEY`, and `AZURE_BATCH_ENDPOINT` environment variables appropriate for your account, and the `-a`, `-k`, and `-u` options are ommitted.

>[AZURE.TIP] List your keys with `azure batch account keys list`, and find your endpoint with `azure batch account show`.

## Create a pool

* Usage:

  `batch pool create [options] [json-file]`

* Examples:

  Cloud Services Configuration (PaaS, Windows only)

  ```azure batch pool create --id "pool1" --target-dedicated 1 --vm-size "small" --os-family "4"```

  Virtual Machine Configuration (IaaS, Linux and Windows)

    azure batch pool create --id "pool2" --target-dedicated 1 --vm-size "STANDARD_A1" --image-publisher "Canonical" --image-offer "UbuntuServer" --image-sku "14.04.2-LTS" --node-agent-id "batch.node.ubuntu 14.04"

Creates a pool of compute nodes in the Batch service.

When creating or updating a Batch pool, you select a Cloud Services Configuration or a Virtual Machine configuration for the operating system on the compute nodes (see [Batch feature overview](batch-api-basics.md#pool)). Your choice determines whether your compute nodes are imaged with one of the [Azure Guest OS releases](../cloud-services/cloud-services-guestos-update-matrix.md#releases) or with one of the supported Linux or Windows VM images in the Azure Marketplace.

## Query for pools, jobs, tasks, and other details

Use cmdlets such as **Get-AzureBatchPool**, **Get-AzureBatchJob**, and **Get-AzureBatchTask** to query for entities created under a Batch account.

### Query for data

As an example, use **Get-AzureBatchPools** to find your pools. By default this queries for all pools under your account, assuming you already stored the BatchAccountContext object in *$context*:

`Get-AzureBatchPool -BatchContext $context`

### Use an OData filter

You can supply an OData filter using the **Filter** parameter to find only the objects you're interested in. For example, you can find all pools with ids starting with "myPool":

```
$filter = "startswith(id,'myPool')"

Get-AzureBatchPool -Filter $filter -BatchContext $context
```

This method is not as flexible as using “Where-Object” in a local pipeline. However, the query gets sent to the Batch service directly so that all filtering happens on the server side, saving Internet bandwidth.

### Use the Id parameter

An alternative to an OData filter is to use the **Id** parameter. To query for a specific pool with id "myPool":

`Get-AzureBatchPool -Id "myPool" -BatchContext $context`

The **Id** parameter supports only full-id search, not wildcards or OData-style filters.

### Use the MaxCount parameter

By default, each cmdlet returns a maximum of 1000 objects. If you reach this limit, either refine your filter to bring back fewer objects, or explicitly set a maximum using the **MaxCount** parameter. For example:

`Get-AzureBatchTask -MaxCount 2500 -BatchContext $context`

To remove the upper bound, set **MaxCount** to 0 or less.

### Use the pipeline

Batch cmdlets can leverage the PowerShell pipeline to send data between cmdlets. This has the same effect as specifying a parameter but makes listing multiple entities easier. For example, the following finds all tasks under your account:

`Get-AzureBatchJob -BatchContext $context | Get-AzureBatchTask -BatchContext $context`

## Next steps
* For detailed cmdlet syntax and examples, see [Azure Batch cmdlet reference](https://msdn.microsoft.com/library/azure/mt125957.aspx).

* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch.
