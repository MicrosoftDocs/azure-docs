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
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="multiple"
   ms.workload="big-compute"
   ms.date="09/06/2016"
   ms.author="marsma"/>

# Get started with Azure Batch CLI

The cross-platform Azure Command-Line Interface (Azure CLI) enables you to manage your Batch accounts and resources such as pools, jobs, and tasks in Linux, Mac, and Windows command shells. With the Azure CLI, you can perform and script many of the same tasks you carry out with the Batch APIs, Azure portal, and Batch PowerShell cmdlets.

This article is based on Azure CLI version 0.10.3.

## Prerequisites

* [Install the Azure CLI](../xplat-cli-install.md)

* [Connect the Azure CLI to your Azure subscription](../xplat-cli-connect.md)

* Switch to **Resource Manager mode**: `azure config mode arm`

>[AZURE.TIP] We recommend that you update your Azure CLI installation frequently to take advantage of service updates and enhancements.

## Command help

You can display help text for every command in the Azure CLI by appending `-h` as the only option after the command. For example:

* To get help for the `azure` command, enter: `azure -h`
* To get a list of all Batch commands in the CLI, use: `azure batch -h`
* To get help on creating a Batch account, enter: `azure batch account create -h`

When in doubt, use the `-h` command-line option to get help on any Azure CLI command.

## Create a Batch account

Usage:

    azure batch account create [options] <name>

Example:

	azure batch account create --location "West US"  --resource-group "resgroup001" "batchaccount001"

Creates a new Batch account with the specified parameters. You must specify at least a location, resource group, and account name. If you don't already have a resource group, create one by running `azure group create`, and specify one of the Azure regions (such as "West US") for the `--location` option. For example:

	azure group create --name "resgroup001" --location "West US"

> [AZURE.NOTE] The Batch account name must be unique within the Azure region the account is created. It may contain only lowercase alphanumeric characters, and must be 3-24 characters in length. You can't use special characters like `-` or `_` in Batch account names.

### Linked storage account (autostorage)

You can (optionally) link a **General purpose** Storage account to your Batch account when you create it. The [application packages](batch-application-packages.md) feature of Batch uses blob storage in a linked General purpose Storage account, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications your Batch tasks run, and persisting the data they produce.

To link an existing Azure Storage account to a new Batch account when you create it, specify the `--autostorage-account-id` option. This option requires the fully qualified resource ID of the storage account.

First, show your storage account's details:

    azure storage account show --resource-group "resgroup001" "storageaccount001"

Then use the **Url** value for the `--autostorage-account-id` option. The Url value starts with "/subscriptions/" and contains your subscription ID and resource path to the Storage account:

    azure batch account create --location "West US"  --resource-group "resgroup001" --autostorage-account-id "/subscriptions/8ffffff8-4444-4444-bfbf-8ffffff84444/resourceGroups/resgroup001/providers/Microsoft.Storage/storageAccounts/storageaccount001" "batchaccount001"

## Delete a Batch account

Usage:

    azure batch account delete [options] <name>

Example:

	azure batch account delete --resource-group "resgroup001" "batchaccount001"

Deletes the specified Batch account. When prompted, confirm you want to remove the account (account removal can take some time to complete).

## Manage account access keys

You need an access key to [create and modify resources](#create-and-modify-batch-resources) in your Batch account.

### List access keys

Usage:

	azure batch account keys list [options] <name>

Example:

	azure batch account keys list --resource-group "resgroup001" "batchaccount001"

Lists the account keys for the given Batch account.

### Generate a new access key

Usage:

    azure batch account keys renew [options] --<primary|secondary> <name>

Example:

	azure batch account keys renew --resource-group "resgroup001" --primary "batchaccount001"

Regenerates the specified account key for the given Batch account.

## Create and modify Batch resources

You can use the Azure CLI to create, read, update, and delete (CRUD) Batch resources like pools, compute nodes, jobs, and tasks. These CRUD operations require your Batch account name, access key, and endpoint. You can specify these with the `-a`, `-k`, and `-u` options, or set [environment variables](#credential-environment-variables) which the CLI uses automatically (if populated).

### Credential environment variables

You can set `AZURE_BATCH_ACCOUNT`, `AZURE_BATCH_ACCESS_KEY`, and `AZURE_BATCH_ENDPOINT` environment variables instead of specifying `-a`, `-k`, and `-u` options on the command line for every command you execute. The Batch CLI uses these variables (if set) so that you can omit the `-a`, `-k`, and `-u` options. The remainder of this article assumes use of these environment variables.

>[AZURE.TIP] List your keys with `azure batch account keys list`, and display the account's endpoint with `azure batch account show`.

### JSON files

When you create Batch resources like pools and jobs, you can specify a JSON file containing the new resource's configuration instead of passing its parameters as command-line options. For example:

`azure batch pool create my_batch_pool.json`

While you can perform many resource creation operations using only command-line options, some features require a JSON-formatted file containing the resource details. For example, you must use a JSON file if you want to specify resource files for a start task.

To find the JSON required to create a resource, refer to the [Batch REST API reference][rest_api] documentation on MSDN. Each "Add *resource type*" topic contains example JSON for creating the resource, which you can use as templates for your JSON files. For example, JSON for pool creation can be found in [Add a pool to an account][rest_add_pool].

>[AZURE.NOTE] If you specify a JSON file when you create a resource, all other parameters that you specify on the command line for that resource are ignored.

## Create a pool

Usage:

    azure batch pool create [options] [json-file]

Example (Virtual Machine Configuration):

    azure batch pool create --id "pool001" --target-dedicated 1 --vm-size "STANDARD_A1" --image-publisher "Canonical" --image-offer "UbuntuServer" --image-sku "14.04.2-LTS" --node-agent-id "batch.node.ubuntu 14.04"

Example (Cloud Services Configuration):

	azure batch pool create --id "pool002" --target-dedicated 1 --vm-size "small" --os-family "4"

Creates a pool of compute nodes in the Batch service.

As mentioned in the [Batch feature overview](batch-api-basics.md#pool), you have two options when you select an operating system for the nodes in your pool: **Virtual Machine Configuration** and **Cloud Services Configuration**. Use the `--image-*` options to create Virtual Machine Configuration pools, and `--os-family` to create Cloud Services Configuration pools. You can't specify both `--os-family` and `--image-*` options.

You can specify pool [application packages](batch-application-packages.md) and the command line for a [start task](batch-api-basics.md#start-task). To specify resource files for the start task, however, you must instead use a [JSON file](#json-files).

Delete a pool with:

    azure batch pool delete [pool-id]

>[AZURE.TIP] Check the [list of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images) for values appropriate for the `--image-*` options.

## Create a job

Usage:

    azure batch job create [options] [json-file]

Example:

    azure batch job create --id "job001" --pool-id "pool001"

Adds a job to the Batch account and specifies the pool on which its tasks execute.

Delete a job with:

    azure batch job delete [job-id]

## List pools, jobs, tasks, and other resources

Each Batch resource type supports a `list` command that queries your Batch account and lists resources of that type. For example, you can list the pools in your account and the tasks in a job:

    azure batch pool list
    azure batch task list --job-id "job001"

### Listing resources efficiently

For faster querying, you can specify **select**, **filter**, and **expand** clause options for `list` operations. Use these options to limit the amount of data returned by the Batch service. Because all filtering occurs server-side, only the data you are interested in crosses the wire. Use these clauses to save bandwidth (and therefore time) when you perform list operations.

For example, this will return only pools whose ids start with "renderTask":

    azure batch task list --job-id "job001" --filter-clause "startswith(id, 'renderTask')"

The Batch CLI supports all three clauses supported by the Batch service:

* `--select-clause [select-clause]`  Return a subset of properties for each entity
* `--filter-clause [filter-clause]`  Return only entities that match the specified OData expression
* `--expand-clause [expand-clause]`  Obtain the entity information in a single underlying REST call. The expand clause supports only the `stats` property at this time.

For details on the three clauses and performing list queries with them, see [Query the Azure Batch service efficiently](batch-efficient-list-queries.md).

## Application package management

Application packages provide a simplified way to deploy applications to the compute nodes in your pools. With the Azure CLI, you can upload application packages, manage package versions, and delete packages.

To create a new application and add a package version:

**Create** an application:

    azure batch application create "resgroup001" "batchaccount001" "MyTaskApplication"

**Add** an application package:

    azure batch application package create "resgroup001" "batchaccount001" "MyTaskApplication" "1.10-beta3" package001.zip

**Activate** the package:

    azure batch application package activate "resgroup002" "azbatch002" "MyTaskApplication" "1.10-beta3" zip

### Deploy an application package

You can specify one or more application packages for deployment when you create a new pool. When you specify a package at pool creation time, it is deployed to each node as the node joins pool. Packages are also deployed when a node is rebooted or reimaged.

This command specifies a package at pool creation, and is deployed as each node joins the new pool:

    azure batch pool create --id "pool001" --target-dedicated 1 --vm-size "small" --os-family "4" --app-package-ref "MyTaskApplication"

You can't currently specify which package version to deploy by using command-line options. You must first set a default version for the application by using the Azure portal before you can assign it to a pool. See how to set a default version in [Application deployment with Azure Batch application packages](batch-application-packages.md). You can, however, specify a default version if you use a [JSON file](#json-files) instead of command line options when you create a pool.

>[AZURE.IMPORTANT] You must [link an Azure Storage account](#linked-storage-account-autostorage) to your Batch account to use application packages.

## Troubleshooting tips

This section is intended to provide you with resources to use when troubleshooting Azure CLI issues. It won't necessarily solve all problems, but it may help you narrow down the cause and point you to help resources.

* Use `-h` to get **help text** for any CLI command

* Use `-v` and `-vv` to display **verbose** command output; `-vv` is "extra" verbose and displays the actual REST requests and responses. These switches are handy for displaying full error output.

* You can view **command output as JSON** with the `--json` option. For example, `azure batch pool show "pool001" --json` displays pool001's properties in JSON format. You can then copy and modify this output to use in a `--json-file` (see [JSON files](#json-files) earlier in this article).

* The [Batch forum on MSDN][batch_forum] is a great help resource, and is monitored closely by Batch team members. Be sure to post your questions there if you run into issues or would like help with a specific operation.

* Not every Batch resource operation is currently supported by the Azure CLI. For example, you can't currently specify an application package *version* for a pool, only the package ID. In such cases, you may need to supply a `--json-file` for your command instead of using command-line options. Be sure to stay up-to-date with the latest CLI version to pick up future enhancements.

## Next steps

*  See [Application deployment with Azure Batch application packages](batch-application-packages.md) to find out how to use this feature to manage and deploy the applications you execute on Batch compute nodes.

* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch.

[batch_forum]: https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azurebatch
[github_readme]: https://github.com/Azure/azure-xplat-cli/blob/dev/README.md
[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx