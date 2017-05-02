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

You can use the cross-platform Azure Command-Line Interface (Azure CLI) to manage your Batch accounts and resources such as pools, jobs, and tasks in Linux, Mac, and Windows command shells. With the Azure CLI, you can perform and script many of the same tasks you carry out with the Batch APIs, Azure portal, and Batch PowerShell cmdlets.

This article is based on [Azure CLI version 2.0](https://docs.microsoft.com/cli/azure/overview). See [Get started with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli.md) for an overview of using the CLI with Azure.

> [NOTE]
> Microsoft recommends using the latest version of the Azure CLI, version 2.0. For more information about version 2.0, see [Azure Command Line 2.0 now generally available](https://azure.microsoft.com/blog/announcing-general-availability-of-vm-storage-and-network-azure-cli-2-0/).
>
>

## Prerequisites
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

[!INCLUDE [batch-cli-sample-scripts-include](../../includes/batch-cli-sample-scripts-include.md)]

Use the tutorials listed in the table above to learn how to use the Azure CLI to accomplish a set of related tasks.  

## Manage Batch accounts

Use the Batch Management service commands to create and delete Batch accounts and manage access keys. See [Batch accounts \- az batch account](https://docs.microsoft.com/cli/azure/batch/account) for the Azure CLI command reference for the Batch Management service. 

### Create a new resource group

To create a new Batch account, you'll need to reference an existing resource group. If you don't already have a resource group, create one before you create your Batch account. 

The command to create a new resource group is provided by Azure Resource Manager. See [Resource groups \- az group](https://docs.microsoft.com/cli/azure/group) for the Azure CLI command reference for resource groups.

#### Command

[az group create](https://docs.microsoft.com/cli/azure/group#create)

#### Example

```
az group create --name myresourcegroup --location westus
```

### Create a Batch account

Use this command to create a Batch account. When you create an account, specify a location, resource group, and account name, at a minimum. 

> [!NOTE]
> The Batch account name must be unique within the Azure region the account is created. It may contain only lowercase alphanumeric characters, and must be 3-24 characters in length. You can't use special characters like `-` or `_` in Batch account names.
> 
> 

You can (optionally) link an existing **general-purpose** Azure Storage account to your Batch account when you create it. The [application packages](batch-application-packages.md) feature of Batch uses Blob storage in a linked general-purpose storage account, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications that your Batch tasks run, and persisting the data they produce.

To link an existing Azure Storage account to a new Batch account when you create it, specify the `--storage-account` option. Provide either the name or the fully qualified resource ID of the storage account.

#### Command

[az batch account create](https://docs.microsoft.com/cli/azure/batch/account#create)

#### Example

```
az batch account create --location westus --resource-group myresourcegroup --name mybatchaccount --storage-account mystorageaccount
```

### Delete a Batch account

Use this command to delete a Batch account.

When you delete a Batch account with the Azure CLI, you can specify whether to be prompted to confirm that you want to remove the account. Note that account removal can take some time to complete.

#### Command

[az batch account delete](https://docs.microsoft.com/cli/azure/batch/account#delete)

#### Example

```
az batch account delete --name mybatchaccount --resource-group myresourcegroup
```

### List access keys

Use this command to list the account access keys associated with your Batch account. These keys are used for Shared Key authentication. See [Authenticate Requests to the Azure Batch Service](https://docs.microsoft.com/rest/api/batchservice/authenticate-requests-to-the-azure-batch-service) for more information about authenticating with Shared Key.

You can list account access keys only for Batch accounts created with a poolAllocationMode of 'BatchService'. If the Batch account was created with a poolAllocationMode of 'UserSubscription', clients cannot use access to keys to authenticate, and must use Azure Active Directory instead. In this case, listing the keys will fail.

#### Command

[az batch account keys list](https://docs.microsoft.com/cli/azure/batch/account/keys#list)

#### Example

```
azure batch account keys list --resource-group "resgroup001" "batchaccount001"
```

### Regenerate an access key

Use this command to regenerate an account key for your Batch account.

#### Command

[az batch account keys renew](https://docs.microsoft.com/cli/azure/batch/account/keys#renew)

#### Example

```
azure batch account keys renew --key-name Primary --name mybatchaccount --resource-group myresourcegroup
```



## Create and modify Batch resources

You can use the Azure CLI to create, read, update, and delete (CRUD) Batch resources like pools, compute nodes, jobs, and tasks. These CRUD operations require your Batch account name, access key, and endpoint. You can specify these with the `-a`, `-k`, and `-u` options, or set [environment variables](#credential-environment-variables) which the CLI uses automatically (if populated).

### Credential environment variables
You can set `AZURE_BATCH_ACCOUNT`, `AZURE_BATCH_ACCESS_KEY`, and `AZURE_BATCH_ENDPOINT` environment variables instead of specifying `-a`, `-k`, and `-u` options on the command line for every command you execute. The Batch CLI uses these variables (if set) so that you can omit the `-a`, `-k`, and `-u` options. The remainder of this article assumes use of these environment variables.

> [!TIP]
> List your keys with `azure batch account keys list`, and display the account's endpoint with `azure batch account show`.
> 
> 

### JSON files
When you create Batch resources like pools and jobs, you can specify a JSON file containing the new resource's configuration instead of passing its parameters as command-line options. For example:

`azure batch pool create my_batch_pool.json`

While you can perform many resource creation operations using only command-line options, some features require a JSON-formatted file containing the resource details. For example, you must use a JSON file if you want to specify resource files for a start task.

To find the JSON required to create a resource, refer to the [Batch REST API reference][rest_api] documentation on MSDN. Each "Add *resource type*" topic contains example JSON for creating the resource, which you can use as templates for your JSON files. For example, JSON for pool creation can be found in [Add a pool to an account][rest_add_pool].

> [!NOTE]
> If you specify a JSON file when you create a resource, all other parameters that you specify on the command line for that resource are ignored.
> 
> 

### Create a pool

**Command:** [az batch pool create](https://docs.microsoft.com/cli/azure/batch/pool#create)

Use this command to create a pool of compute nodes in the Batch service.

As mentioned in the [Batch feature overview](batch-api-basics.md#pool), you have two options when you select an operating system for the nodes in your pool: **Virtual Machine Configuration** and **Cloud Services Configuration**. Use the `--image` option to create Virtual Machine Configuration pools, and the `--os-family` option to create Cloud Services Configuration pools. You can specify either the `--os-family` or the `--image` option, but not both.

You can specify pool [application packages](batch-application-packages.md) and the command line for a [start task](batch-api-basics.md#start-task). To specify resource files for the start task, however, you must instead use a [JSON file](#json-files).

> [!TIP]
> Check the [list of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images) for values appropriate for the `--image` option.
> 
> 

#### Command

[az batch pool create](https://docs.microsoft.com/cli/azure/batch/pool#create)

#### Example (Virtual Machine Configuration):

```
az batch pool create \
    --id mypool-linux \
    --vm-size Standard_A1 \
    --image canonical:ubuntuserver:16.04.0-LTS \
    --node-agent-sku-id batch.node.ubuntu 16.04
```

#### Example (Cloud Services Configuration):

```
az batch pool create \
    --id mypool-windows \
    --os-family 4 \
    --target-dedicated 3 \
    --vm-size small \
    --start-task-command-line "cmd /c xcopy %AZ_BATCH_APP_PACKAGE_MYAPP% %AZ_BATCH_NODE_SHARED_DIR%" \
    --start-task-wait-for-success \
    --application-package-references myapp
```

### Delete a pool

**Command:** [az batch pool delete](https://docs.microsoft.com/cli/azure/batch/pool#delete)

Use this command to delete a pool.

#### Example

```
az batch pool delete --pool-id mypool-windows
```

### Create a job

**Command:** [az batch job create](https://docs.microsoft.com/cli/azure/batch/job#create)

Use this command to add a job to the Batch account.

#### Example

```
az batch job create --id job001 --pool-id mypool-windows
```


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
This section is intended to provide you with resources to use when troubleshooting Azure CLI issues. It won't necessarily solve all problems, but it may help you narrow down the cause and point you to help resources.

* Use `-h` to get **help text** for any CLI command
* Use `-v` and `-vv` to display **verbose** command output; `-vv` is "extra" verbose and displays the actual REST requests and responses. These switches are handy for displaying full error output.
* You can view **command output as JSON** with the `--json` option. For example, `azure batch pool show "pool001" --json` displays pool001's properties in JSON format. You can then copy and modify this output to use in a `--json-file` (see [JSON files](#json-files) earlier in this article).
* The [Batch forum on MSDN][batch_forum] is a great help resource, and is monitored closely by Batch team members. Be sure to post your questions there if you run into issues or would like help with a specific operation.
* Not every Batch resource operation is currently supported by the Azure CLI. For example, you can't currently specify an application package *version* for a pool, only the package ID. In such cases, you may need to supply a `--json-file` for your command instead of using command-line options. Be sure to stay up-to-date with the latest CLI version to pick up future enhancements.

## Next steps

* See the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview) for more information about the Azure CLI.
* See [Application deployment with Azure Batch application packages](batch-application-packages.md) to find out how to use this feature to manage and deploy the applications you execute on Batch compute nodes.
* See [Query the Batch service efficiently](batch-efficient-list-queries.md) for more about reducing the number of items and the type of information that is returned for queries to Batch.

[batch_forum]: https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch
[github_readme]: https://github.com/Azure/azure-xplat-cli/blob/dev/README.md
[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
