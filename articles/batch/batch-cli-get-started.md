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
ms.date: 05/01/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Manage Batch resources with Azure CLI

You can use the cross-platform Azure Command-Line Interface (Azure CLI) to manage your Azure Batch accounts and to manage resources such as pools, jobs, and tasks in Linux, Mac, and Windows command shells. With the Azure CLI, you can script many of the same tasks you carry out with the Batch APIs, Azure portal, and Batch PowerShell cmdlets.

This article provides an overview of using [Azure CLI version 2.0](https://docs.microsoft.com/cli/azure/overview) with Batch. See [Get started with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli.md) for an overview of using the CLI with Azure.

> [NOTE]
> Microsoft recommends using the latest version of the Azure CLI, version 2.0. For more information about version 2.0, see [Azure Command Line 2.0 now generally available](https://azure.microsoft.com/blog/announcing-general-availability-of-vm-storage-and-network-azure-cli-2-0/).
>
>

## Set up the Azure CLI

Before you can begin using the Azure CLI with Batch, you'll need to install it and log into your Azure account. Follow these steps: 

* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli.md)
* [Log in to Azure](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli.md#log-in-to-azure)

> [!TIP]
> We recommend that you update your Azure CLI installation frequently to take advantage of service updates and enhancements.
> 
> 

## Command help

You can display help text for every command in the Azure CLI by appending `-h` as the only option after the command. For example:

* To get help for the `az` command, enter: `az -h`
* To get a list of all Batch commands in the CLI, use: `az batch -h`
* To get help on creating a Batch account, enter: `az batch account create -h`

When in doubt, use the `-h` command-line option to get help on any Azure CLI command.

> [NOTE]
> Earlier versions of the Azure CLI used `azure` to preface a CLI command. In version 2.0, all commands are now prefaced with `az`. Be sure to update your scripts to use the new syntax with version 2.0.
>
>  

Additionally, refer to the Azure CLI reference documentation for details about [Azure CLI commands for Batch](https://docs.microsoft.com/cli/azure/batch). 

## Sample shell scripts

The sample scripts listed in the following table show how to use Azure CLI commands with the Batch service and Batch Management service to accomplish common tasks. These sample scripts cover many of the commands available in the Azure CLI for Batch. 

| Script | Notes |
|---|---|
| [Create a Batch account](../articles/batch/scripts/batch-cli-sample-create-account.md) | Creates a Batch account and associates it with a storage account. |
| [Add an application](../articles/batch/scripts/batch-cli-sample-add-application.md) | Adds an application and uploads packaged binaries.|
| [Manage Batch pools](../articles/batch/scripts/batch-cli-sample-manage-pool.md) | Demonstrates creating, resizing, and managing pools. |
| [Run a job and tasks with Batch](../articles/batch/scripts/batch-cli-sample-run-job.md) | Demonstrates running a job and adding tasks. |

## JSON files for resource creation

When you create Batch resources like pools and jobs, you can specify a JSON file containing the new resource's configuration instead of passing its parameters as command-line options. For example:

```azurecli
az batch pool create my_batch_pool.json
```

While you can create most Batch resources using only command-line options, some features require that you specify a JSON-formatted file containing the resource details. For example, you must use a JSON file if you want to specify resource files for a start task.

To see the JSON syntax required to create a resource, refer to the [Batch REST API reference][rest_api] documentation. Each "Add *resource type*" topic in the REST API reference contains sample JSON scripts for creating that resource. You can use those sample JSON scripts as templates for JSON files to use with the Azure CLI. For example, to see the JSON syntax for pool creation, refer to [Add a pool to an account][rest_add_pool].

For a sample script that specifies a JSON file, see [Run a job and tasks with Batch](../articles/batch/scripts/batch-cli-sample-run-job.md).

> [!NOTE]
> If you specify a JSON file when you create a resource, all other parameters that you specify on the command line for that resource are ignored.
> 
> 

## List pools, jobs, tasks, and other resources

Each Batch resource type supports a `list` command that queries your Batch account and lists resources of that type. For example, you can list the pools in your account and the tasks in a job:

```azurecli
azure batch pool list
azure batch task list --job-id job001
```

To query the Batch service efficiently, you can specify the **select**, **filter**, or **expand** OData clauses for `list` operations. Use these clauses to limit the amount of data returned by the Batch service. Because all filtering occurs server-side, only the data you request crosses the wire. Use these clauses to save bandwidth (and therefore time) when you perform list operations.

For example, the following command returns only pools whose IDs start with the string "renderTask":

```azurecli
azure batch task list --job-id job001 --filter-clause startswith(id, 'renderTask')
```
The following table describes the OData clauses supported by the Batch service:

| Clause | Description |
|---|---|
| `--select-clause [select-clause]` | Returns a subset of properties for each entity. |
| `--filter-clause [filter-clause]` | Returns only entities that match the specified OData expression. |
| `--expand-clause [expand-clause]` | Obtains the entity information in a single underlying REST call. The expand clause supports only the `stats` property at this time. |

For details on performing list queries with the OData clauses, see [Query the Azure Batch service efficiently](batch-efficient-list-queries.md).

For a sample script that shows how to use an OData clause, see [Run a job and tasks with Batch](../articles/batch/scripts/batch-cli-sample-run-job.md).

## Application package management
Application packages provide a simplified way to deploy applications to the compute nodes in your pools. With the Azure CLI, you can upload application packages, manage package versions, and delete packages.

To create a new application and add a package version:

**Create** an application:

    azure batch application create "resgroup001" "batchaccount001" "MyTaskApplication"

**Add** an application package:

    azure batch application package create "resgroup001" "batchaccount001" "MyTaskApplication" "1.10-beta3" package001.zip

**Activate** the package:

    azure batch application package activate "resgroup001" "batchaccount001" "MyTaskApplication" "1.10-beta3" zip

Set the **default version** for the application:

    azure batch application set "resgroup001" "batchaccount001" "MyTaskApplication" --default-version "1.10-beta3"

### Deploy an application package
You can specify one or more application packages for deployment when you create a new pool. When you specify a package at pool creation time, it is deployed to each node as the node joins pool. Packages are also deployed when a node is rebooted or reimaged.

Specify the `--app-package-ref` option when creating a pool to deploy an application package to the pool's nodes as they join the pool. The `--app-package-ref` option accepts a semicolon-delimited list of application ids to deploy to the compute nodes.

    azure batch pool create --pool-id "pool001" --target-dedicated 1 --vm-size "small" --os-family "4" --app-package-ref "MyTaskApplication"

When you create a pool by using command-line options, you cannot currently specify *which* application package version to deploy to the compute nodes, for example "1.10-beta3". Therefore, you must first specify a default version for the application with `azure batch application set [options] --default-version <version-id>` before you create the pool (see previous section). You can, however, specify a package version for the pool if you use a [JSON file](#json-files) instead of command line options when you create the pool.

You can find more information on application packages in [Application deployment with Azure Batch application packages](batch-application-packages.md).

> [!IMPORTANT]
> You must [link an Azure Storage account](#linked-storage-account-autostorage) to your Batch account to use application packages.
> 
> 

### Update a pool's application packages
To update the applications assigned to an existing pool, issue the `azure batch pool set` command with the `--app-package-ref` option:

    azure batch pool set --pool-id "pool001" --app-package-ref "MyTaskApplication2"

To deploy the new application package to compute nodes already in an existing pool, you must restart or reimage those nodes:

    azure batch node reboot --pool-id "pool001" --node-id "tvm-3105992504_1-20160930t164509z"

> [!TIP]
> You can obtain a list of the nodes in a pool, along with their node ids, with `azure batch node list`.
> 
> 

Keep in mind that you must already have configured the application with a default version prior to deployment (`azure batch application set [options] --default-version <version-id>`).

## Troubleshooting tips

The following tips may help when you are troubleshooting Azure CLI issues:

* Use `-h` to get **help text** for any CLI command
* Use `-v` and `-vv` to display **verbose** command output; `-vv` is "extra" verbose and displays the actual REST requests and responses. These switches are handy for displaying full error output.
* You can view **command output as JSON** with the `--json` option. For example, `az batch pool show pool001 --json` displays pool001's properties in JSON format. You can then copy and modify this output to use in a `--json-file` (see [JSON files](#json-files) earlier in this article).
* The [Batch forum][batch_forum] is monitored by Batch team members. You can post your questions there if you run into issues or would like help with a specific operation.

## Next steps

* See the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview) for more information about the Azure CLI.
* See [Application deployment with Azure Batch application packages](batch-application-packages.md) to find out how to use this feature to manage and deploy the applications you execute on Batch compute nodes.
* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch.

[batch_forum]: https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch
[github_readme]: https://github.com/Azure/azure-xplat-cli/blob/dev/README.md
[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
