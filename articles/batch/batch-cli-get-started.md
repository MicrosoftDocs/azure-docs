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
   ms.date="09/02/2016"
   ms.author="marsma"/>

# Get started with Azure Batch CLI

The cross-platform Azure Command-Line Interface (Azure CLI) enables you to manage your Batch accounts and resources such as pools, jobs, and tasks in Windows, Mac, and Linux command shells. With the Azure CLI, you can perform and script many of the same tasks you carry out with the Batch APIs, Azure portal, and Azure Batch PowerShell cmdlets.

This article is based on Azure CLI version 0.10.3.

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

Usage:

    azure batch account create [options] <name>

Example:

	azure batch account create --location "West US"  --resource-group "resgroup001" "batchaccount001"

Creates a new Batch account with the specified parameters. You must specify at least a location, resource group, and account name. If you don't already have a resource group, create one by running the `azure group create` command, specifying one of the Azure regions (such as "West US") for the `--location` option. For example:

	azure group create --name "resgroup001" --location "West US"

> [AZURE.NOTE] The Batch account name must be unique to the Azure region for the resource group, contain between 3 and 24 characters, and use lowercase letters and numbers only. You cannot use special characters like `-` or `_` in Batch account names.

### Linked storage account (autostorage)

You can (optionally) link a **General purpose** Storage account to your Batch account when you create it. The [application packages](batch-application-packages.md) feature of Batch uses blob storage in a linked General purpose Storage account, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications your Batch tasks run, and persisting the data they produce.

To link an existing Azure Storage account to a new Batch account when you create it, specify the `--autostorage-account-id` option. This option requires the fully qualified resource ID of the storage account.

First, show your storage account's details:

    azure storage account show --resource-group "resgroup001" "storageaccount001"

Then use the **Url** value for the `--autostorage-account-id` option. The Url value starts with "/subscriptions/" and contains your subscription ID and resource path to the account:

    azure batch account create --location "West US"  --resource-group "resgroup001" --autostorage-account-id "/subscriptions/8ffffff8-4444-4444-bfbf-8ffffff84444/resourceGroups/resgroup001/providers/Microsoft.Storage/storageAccounts/storageaccount001" "batchaccount001"

## Delete a Batch account

Usage:

    azure batch account delete [options] <name>

Example:

	azure batch account delete --resource-group "resgroup001" "batchaccount001"

Deletes the specified Batch account. When prompted, confirm you want to remove the account. Note that account removal can take some time to complete.

## Manage account access keys

### List access keys

Usage:

  azure batch account keys list [options] <name>

Example:

	azure batch account keys list --resource-group "resgroup001" "batchaccount001"

Lists the account keys for the given Batch account.

### Generate a new access key

Usage:

  `azure batch account keys renew [options] --<primary|secondary> <name>`

Example:

	azure batch account keys renew --resource-group "resgroup001" --primary "batchaccount001"

Lists the account keys for the given Batch account.

## Create and modify Batch resources

You can create, read, update, and delete (CRUD) Batch resources like pools, compute nodes, jobs, and tasks by using the Azure CLI. These CRUD operations require your Batch account name, access key, and endpoint. You can specify these with the `-a`, `-k`, and `-u` options, or set [environment variables](#credential-environment-variables) which the CLI will use automatically.

### Credential environment variables

You can set `AZURE_BATCH_ACCOUNT`, `AZURE_BATCH_ACCESS_KEY`, and `AZURE_BATCH_ENDPOINT` environment variables instead of specifying `-a`, `-k`, and `-u` options on the command line for every command you execute. The Batch CLI uses these variables (if set) so that you can omit the `-a`, `-k`, and `-u` options. The remainder of this article assumes use of these environment variables.

>[AZURE.TIP] List your keys with `azure batch account keys list`, and display the account's endpoint with `azure batch account show`.

### JSON files

When you create Batch resources like pools and jobs, you can specify a JSON file containing the new resource's configuration instead of passing its parameters as command-line options. For example:

`batch pool create my_batch_pool.json`

While you can perform many resource creation operations using only command-line options, some features require a JSON-formatted file containing the resource details. For example, you must use a JSON file if you want to specify resource files for a start task.

To find the JSON required to create a resource, refer to the [Batch REST API reference][rest_api] documentation on MSDN. Each "Add *resource type*" topic contains example JSON for creating the resource, which you can use as templates for your JSON files. For example, JSON for pool creation can be found in [Add a pool to an account][rest_add_pool].

## Create a pool

Usage:

    batch pool create [options] [json-file]

Example (Virtual Machine Configuration):

    azure batch pool create --id "pool001" --target-dedicated 1 --vm-size "STANDARD_A1" --image-publisher "Canonical" --image-offer "UbuntuServer" --image-sku "14.04.2-LTS" --node-agent-id "batch.node.ubuntu 14.04"

Example (Cloud Services Configuration):

	azure batch pool create --id "pool002" --target-dedicated 1 --vm-size "small" --os-family "4"

Creates a pool of compute nodes in the Batch service.

As mentioned in the [Batch feature overview](batch-api-basics.md#pool), you have two options when you select an operating system for the nodes in your pool: **Virtual Machine Configuration** and **Cloud Services Configuration**. Use the `--image-*` options to create Virtual Machine Configuration pools, and `--os-family` to create Cloud Services Configuration pools. You cannot specify both `--os-family` and `--image-*` options.

You can specify pool [application packages](batch-application-packages.md) and the command line for a [start task](batch-api-basics.md#start-task). To specify resource files for the start task, however, you must instead use a [JSON file](#json-files).

Delete a pool with:

    azure batch pool delete [pool-id]

## Create a job

Usage:

    azure batch job create [options] [json-file]

Example:

    azure batch job create --id "job001" --pool-id "pool01"

Adds a job to the Batch account and specifies the pool on which its tasks will execute.

Delete a job with:

    azure batch job delete [job-id]

## List pools, jobs, tasks, and other Batch resources

Each Batch resource type supports the `list` command which, as the name implies, queries your Batch account and lists resources of that type. For example, you can list the pools in your account and the tasks in a job:

    azure batch pool list
    azure batch task list --job-id "job001"

### Listing resources efficiently

For faster querying, you can specify **select**, **filter**, and **expand** clause options for `list` operations. Use these options to limit the amount of data returned by the Batch service. Because all filtering occurs server-side, only the data you are interested in crosses the wire. Use these clauses to save bandwidth (and therefore time) when you perform list operations.

For example, this will return only pools whose ids start with "renderTask":

    azure batch task list --job-id "job001" --filter-clause "startswith(id, 'renderTask')"

The Batch CLI supports all three clauses supported by the Batch service:

* `--select-clause [select-clause]`  Return a subset of properties for each entity
* `--filter-clause [filter-clause]`  Return only entities that match the specified ODATA expression
* `--expand-clause [expand-clause]`  Obtain the entity information in a single underlying REST call. Only `stats` is currently supported by this clause.

For details on the three clauses and performing list queries with them, see [Query the Azure Batch service efficiently](batch-efficient-list-queries.md).

## Application package management

Application packages provide a simplified way to deploy applications to the compute nodes in your pools. With the Azure CLI, you can upload applications and manage package versions, set default versions, update existing versions, and delete packages.

Several package management examples appear below. See [Application deployment with Azure Batch application packages](batch-application-oackages.md) for a full discussion on the feature.

### Create an application

    azure batch application create "resgroup001" "batchaccount001" "MyTaskApplication"

### Add an application package

    azure batch application package create "resgroup001" "batchaccount001" "MyTaskApplication" "1.10-beta3" package001.zip

To use an application package, you must first **activate** it:

    azure batch application package activate "resgroup002" "azbatch002" "MyTaskApplication" "1.10-beta3" zip

You cannot currently specify which package version to deploy, so you must first set a default version for the application by using the Azure portal. See the [application packages article](batch-application-oackages.md) for more information.

### Deploy an application package

You can specify an application package for deployment when you create a pool, or update an existing pool with a new package. If you specify a package at pool creation time, it will be deployed as each node joins the pool. If you update an existing  pool with a new application package, you must reboot or reimage existing nodes in the pool to deploy the new package.

This command deploys a package at pool creation, as each node joins the new pool:

    azure batch pool create --id "pool001" --target-dedicated 0 --vm-size "small" --os-family "4" --app-package-ref "MyTaskApplication"

>[AZURE.IMPORTANT] You must [link an Azure Storage account](#inked-storage-account-autostorage) to your Batch account to use application packages.

## Next steps

*  See [Application deployment with Azure Batch application packages](batch-application-oackages.md) for full details on this helpful feature.

* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch.

[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx