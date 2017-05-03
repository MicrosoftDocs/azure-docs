---
title: Get started with Azure CLI for Batch | Microsoft Docs
description: Get a quick introduction to the Batch commands in Azure CLI for managing Azure Batch service resources
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: ''

ms.assetid: fcd76587-1827-4bc8-a84d-bba1cd980d85
ms.service: batch
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 05/02/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Manage Batch resources with Azure CLI

The Azure CLI 2.0 is Azure's new command-line experience for managing Azure resources. It can be used on macOS, Linux, and Windows. Azure CLI 2.0 is optimized for managing and administering Azure resources from the command line. You can use the Azure CLI to manage your Azure Batch accounts and to manage resources such as pools, jobs, and tasks. With the Azure CLI, you can script many of the same tasks you carry out with the Batch APIs, Azure portal, and Batch PowerShell cmdlets.

This article provides an overview of using [Azure CLI version 2.0](https://docs.microsoft.com/cli/azure/overview) with Batch. See [Get started with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli.md) for an overview of using the CLI with Azure.

> [!NOTE]
> Microsoft recommends using the latest version of the Azure CLI, version 2.0. For more information about version 2.0, see [Azure Command Line 2.0 now generally available](https://azure.microsoft.com/blog/announcing-general-availability-of-vm-storage-and-network-azure-cli-2-0/).
>
>

## Set up the Azure CLI

Before you can begin using the Azure CLI with Batch, you'll need to install it and log in to your Azure account. Follow these steps: 

* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli.md)
* [Log in to Azure](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli.md#log-in-to-azure)

> [!TIP]
> We recommend that you update your Azure CLI installation frequently to take advantage of service updates and enhancements.
> 
> 

## Command help

You can display help text for every command in the Azure CLI by appending `-h` to the command. Omit any other options. For example:

* To get help for the `az` command, enter: `az -h`
* To get a list of all Batch commands in the CLI, use: `az batch -h`
* To get help on creating a Batch account, enter: `az batch account create -h`

When in doubt, use the `-h` command-line option to get help on any Azure CLI command.

> [!NOTE]
> Earlier versions of the Azure CLI used `azure` to preface a CLI command. In version 2.0, all commands are now prefaced with `az`. Be sure to update your scripts to use the new syntax with version 2.0.
>
>  

Additionally, refer to the Azure CLI reference documentation for details about [Azure CLI commands for Batch](https://docs.microsoft.com/cli/azure/batch). 

## Sample shell scripts

The sample scripts listed in the following table show how to use Azure CLI commands with the Batch service and Batch Management service to accomplish common tasks. These sample scripts cover many of the commands available in the Azure CLI for Batch. 

| Script | Notes |
|---|---|
| [Create a Batch account](./scripts/batch-cli-sample-create-account.md) | Creates a Batch account and associates it with a storage account. |
| [Add an application](./scripts/batch-cli-sample-add-application.md) | Adds an application and uploads packaged binaries.|
| [Manage Batch pools](./scripts/batch-cli-sample-manage-pool.md) | Demonstrates creating, resizing, and managing pools. |
| [Run a job and tasks with Batch](./scripts/batch-cli-sample-run-job.md) | Demonstrates running a job and adding tasks. |

## JSON files for resource creation

When you create Batch resources like pools and jobs, you can specify a JSON file containing the new resource's configuration instead of passing its parameters as command-line options. For example:

```azurecli
az batch pool create my_batch_pool.json
```

While you can create most Batch resources using only command-line options, some features require that you specify a JSON-formatted file containing the resource details. For example, you must use a JSON file if you want to specify resource files for a start task.

To see the JSON syntax required to create a resource, refer to the [Batch REST API reference][rest_api] documentation. Each "Add *resource type*" topic in the REST API reference contains sample JSON scripts for creating that resource. You can use those sample JSON scripts as templates for JSON files to use with the Azure CLI. For example, to see the JSON syntax for pool creation, refer to [Add a pool to an account][rest_add_pool].

For a sample script that specifies a JSON file, see [Run a job and tasks with Batch](./scripts/batch-cli-sample-run-job.md).

> [!NOTE]
> If you specify a JSON file when you create a resource, any other parameters that you specify on the command line for that resource are ignored.
> 
> 

## Efficient queries for Batch resources

Each Batch resource type supports a `list` command that queries your Batch account and lists resources of that type. For example, you can list the pools in your account and the tasks in a job:

```azurecli
az batch pool list
az batch task list --job-id job001
```

When you query the Batch service with a `list` operation, you can specify an OData clause to limit the amount of data returned. Because all filtering occurs server-side, only the data you request crosses the wire. Use these clauses to save bandwidth (and therefore time) when you perform list operations.

The following table describes the OData clauses supported by the Batch service:

| Clause | Description |
|---|---|
| `--select-clause [select-clause]` | Returns a subset of properties for each entity. |
| `--filter-clause [filter-clause]` | Returns only entities that match the specified OData expression. |
| `--expand-clause [expand-clause]` | Obtains the entity information in a single underlying REST call. The expand clause currently supports only the `stats` property. |

For a sample script that shows how to use an OData clause, see [Run a job and tasks with Batch](./scripts/batch-cli-sample-run-job.md).

For more information on performing efficient list queries with OData clauses, see [Query the Azure Batch service efficiently](batch-efficient-list-queries.md).

## Troubleshooting tips

The following tips may help when you are troubleshooting Azure CLI issues:

* Use `-h` to get **help text** for any CLI command
* Use `-v` and `-vv` to display **verbose** command output. When the `-vv` flag is included, the Azure CLI displays the actual REST requests and responses. These switches are handy for displaying full error output.
* You can view **command output as JSON** with the `--json` option. For example, `az batch pool show pool001 --json` displays pool001's properties in JSON format. You can then copy and modify this output to use in a `--json-file` (see [JSON files](#json-files) earlier in this article).
* The [Batch forum][batch_forum] is monitored by Batch team members. You can post your questions there if you run into issues or would like help with a specific operation.

## Next steps

* For more information about the Azure CLI, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
* For more information about Batch resources, see [Overview of Azure Batch for developers](batch-api-basics.md).
* See [Application deployment with Azure Batch application packages](batch-application-packages.md) to find out how to use this feature to manage and deploy the applications you execute on Batch compute nodes.

[batch_forum]: https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch
[github_readme]: https://github.com/Azure/azure-xplat-cli/blob/dev/README.md
[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
