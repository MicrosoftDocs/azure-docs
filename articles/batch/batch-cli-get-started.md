---
title: Get started with Azure CLI for Batch
description: Learn how to manage Azure Batch service resources using the Azure Command Line Interface (Azure CLI).
ms.topic: how-to
ms.date: 12/20/2021
ms.custom: H1Hack27Feb2017, devx-track-azurecli

---
# Manage Batch resources with Azure CLI

You can manage your Azure Batch accounts and resources using the [Azure Command-Line Interface (Azure CLI)](/cli/azure). There are commands for creating and updating Batch resources such as pools, jobs, and tasks. You can also create scripts for many of the same tasks you do through Batch APIs, PowerShell cmdlets, and the Azure portal. 

You can [run the Azure CLI in Azure Cloud Shell](../cloud-shell/overview.md) or [install the Azure CLI locally](/cli/azure/install-azure-cli). Versions are available for Windows, Mac, and Linux operating systems (OS). 

This article explains how to use the Azure CLI with Batch accounts and resources.

## Set up the Azure CLI

Choose how you want to set up the Azure CLI:
- [Run the Azure CLI in Cloud Shell](../cloud-shell/overview.md). 
- [Install the Azure CLI](/cli/azure/install-azure-cli) locally. 
    - [Install the Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
    - [Install the Azure CLI on macOS](/cli/azure/install-azure-cli-macos)
    - [Install the Azure CLI on Linux](/cli/azure/install-azure-cli-linux) for multiple Linux distributions.

If you're new to using the Azure CLI, see [Get started with the Azure CLI](/cli/azure/get-started-with-azure-cli) before you continue.

If you've previously installed the Azure CLI locally, make sure to [update your installation to the latest version](/cli/azure/update-azure-cli). 

## Authenticate with the Azure CLI

To use the Azure CLI with Batch, first [sign into your Azure account](#sign-in-to-azure-account), then [sign in to your Batch account](#sign-in-to-batch-account).
### Sign in to Azure account

To use the Azure CLI, first sign in to your Azure account. This step gives you access to Azure Resource Manager commands, which include [Batch Management service](batch-management-dotnet.md) commands. Then, you can run commands to manage Batch accounts, keys, application packages, and quotas.  

You can [authenticate your Azure account in the Azure CLI](/cli/azure/authenticate-azure-cli)) in two ways. To run commands by yourself, [sign in to the Azure CLI interactively](/cli/azure/authenticate-azure-cli). The Azure CLI caches your credentials, and can use those same credentials to [sign you into your Batch account](#sign-in-to-batch-account) after. To run commands from a script or an application, [sign in to the Azure CLI with a service principal](/cli/azure/authenticate-azure-cli).

To [sign in to the Azure CLI interactively](/cli/azure/authenticate-azure-cli#sign-in-interactively), run `az login`:

```azurecli-interactive
az login
```

### Sign in to Batch account

Next, sign in to your Batch account in the Azure CLI using the [az batch account login](/cli/azure/batch/account#az-batch-account-login) command. This step gives you access to Batch service commands. Then, you can manage Batch resources like pools, jobs, and tasks.

You can authenticate your Batch account in the Azure CLI in two ways. The default method is to [authenticate using Azure AD](#authenticate-with-azure-ad). We recommend using this method in most scenarios. Another option is to [use Shared Key authentication](#authenticate-with-shared-key).

If you're creating Azure CLI scripts to automate Batch commands, you can use either authentication method. In some scenarios, Shared Key authentication might be simpler than creating a service principal. 

#### Authenticate with Azure AD

The default method for authenticating with your Batch account is through Azure AD. When you [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli) interactively or with a service principal, you can use those same cached credentials to sign you into your Batch account with Azure AD. This authentication method also offers Azure role-based access control (Azure RBAC). With Azure RBAC, user access depends on their assigned role, not account keys. You only need to manage the Azure roles, not account keys. Azure AD then handles access and authentication. 

To sign in to your Batch account with Azure AD, run `az batch login`. Make sure to include the require parameters for your Batch account's name (`-n`), and your resource group's name (`-g`).

```azurecli-interactive
az batch account login -g <your-resource-group> -n <your-batch-account>
```

#### Authenticate with Shared Key

You can also use [Shared Key authentication](/rest/api/batchservice/authenticate-requests-to-the-azure-batch-service#authentication-via-shared-key) to sign into your Batch account. This method uses your account access keys to authenticate Azure CLI commands for the Batch service.

To sign in to your Batch account with Shared Key authentication, run `az batch login` with the parameter `--shared-key-auth`. Make sure to include the require parameters for your Batch account's name (`-n`), and your resource group's name (`-g`).

```azurecli-interactive
az batch account login -g <your-resource-group> -n <your-batch-account> --shared-key-auth
```
## Learn Batch commands

The Azure CLI reference documentation lists all [Azure CLI commands for Batch](/cli/azure/batch).

To list all Batch commands in the Azure CLI, run `az batch -h`.

There are multiple [example CLI scripts for common Batch tasks](./scripts/batch-cli-sample-create-account.md). These examples show how to use many available commands for Batch in the Azure CLI. You can learn how to create and manage Batch accounts, pools, jobs, and tasks.
### Use Batch CLI extension commands

You can [use the Batch CLI extension](batch-cli-templates.md) to run Batch jobs without writing code. The extension provides commands to use JSON templates for creating pools, jobs, and tasks with the Azure CLI. The extension also provides commands to connect to an Azure Storage account linked to your Batch account. Then, you can upload job input files, and download job input files.

### Create resources with JSON

You can create most Batch resources using only command-line parameters. Some features require you specify a JSON configuration file instead. The JSON file contains the configuration details for your new resource. For example, you have to use a JSON file to specify resource files for a start task. 

For example, to use a JSON file to configure a new Batch pool resource:

```azurecli-interactive
az batch pool <your-batch-pool-configuration>.json
```

When you specify a JSON file for a new resource, don't use other parameters in your command. The service only uses the JSON file to configure the resource. 

The [Batch REST API reference](/rest/api/batchservice/) documentation lists any JSON syntax required to create a resource. 

To see the JSON syntax required to create a resource, refer to the [Batch REST API reference](/rest/api/batchservice/) documentation. Go to the **Examples** section in the resource operation's reference page. Then, find the subsection titled **Add \<resource type>**. For example, [Add a basic task](/rest/api/batchservice/task/add#add-a-basic-task). Use the example JSON code as templates for your configuration files. 

For a sample script that specifies a JSON file, see [Run a job and tasks with Batch](./scripts/batch-cli-sample-run-job.md).

## Query Batch resources efficiently

You can query your Batch account and list all resources using the `list` command. For example, to list the pools in your account and tasks in a job:

```azurecli-interactive
az batch pool list
az batch task list --job-id <your-job-id>
```

To limit the amount of data your Batch query returns, specify an OData clause. All filtering occurs server-side, so you only receive the data you request. Use these OData clauses to save bandwidth and time with `list` operations. For more information, see [Design efficient list queries for Batch resources](batch-efficient-list-queries.md).

| Clause | Description |
|---|---|
| `--select-clause [select-clause]` | Returns a subset of properties for each entity. |
| `--filter-clause [filter-clause]` | Returns only entities that match the specified OData expression. |
| `--expand-clause [expand-clause]` | Obtains the entity information in a single underlying REST call. The expand clause currently supports only the `stats` property. |

For an example script that shows how to use these clauses, see [Run a job and tasks with Batch](./scripts/batch-cli-sample-run-job.md).

## Troubleshooting

To get help with any Batch command, add `-h` to the end of your command. Don't add other options. For example, to get help creating a Batch account, run `az batch account create -h`.

To return verbose command output, add `-v` or `-vv` to the end of your command. Use these switches to display the full error output. The `-vv` flag returns the actual REST requests and responses.

To view the command output in JSON format, add `--json` to the end of your command. For example, to display the properties of a pool named **pool001**, run `az batch pool show pool001 --json`. Then, copy and modify the output to [create Batch resources using a JSON configuration file](#create-resources-with-json).

**General Azure CLI troubleshooting**

[!INCLUDE [azure-cli-troubleshooting.md](../../includes/azure-cli-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Run your first Batch job with the Azure CLI](quick-create-cli.md)
