---
title: "Quickstart: Your first Azure CLI query"
description: In this quickstart, you follow the steps to enable the Resource Graph extension for Azure CLI and run your first query.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-azurecli
---
# Quickstart: Run your first Resource Graph query using Azure CLI

The first step to using Azure Resource Graph is to check that the extension for [Azure
CLI](/cli/azure/) is installed. This quickstart walks you through the process of adding the
extension to your Azure CLI installation. You can use the extension with Azure CLI installed locally
or through the [Azure Cloud Shell](https://shell.azure.com).

At the end of this process, you'll have added the extension to your Azure CLI installation of choice
and run your first Resource Graph query.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

<!-- [!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)] -->

## Add the Resource Graph extension

To enable Azure CLI to query Azure Resource Graph, the extension must be added. This extension
works wherever Azure CLI can be used, including [bash on Windows 10](/windows/wsl/install-win10),
[Cloud Shell](https://shell.azure.com) (both standalone and inside the portal), the [Azure CLI
Docker image](https://hub.docker.com/_/microsoft-azure-cli), or locally installed.

1. Check that the latest Azure CLI is installed (at least **2.0.76**). If it isn't yet installed,
   follow [these instructions](/cli/azure/install-azure-cli-windows).

1. In your Azure CLI environment of choice, import it with the following command:

   ```azurecli
   # Add the Resource Graph extension to the Azure CLI environment
   az extension add --name resource-graph
   ```

1. Validate that the extension has been installed and is the expected version (at least **1.0.0**):

   ```azurecli
   # Check the extension list (note that you may have other extensions installed)
   az extension list

   # Run help for graph query options
   az graph query -h
   ```

## Run your first Resource Graph query

With the Azure CLI extension added to your environment of choice, it's time to try out a simple
tenant-based Resource Graph query. The query returns the first five Azure resources with the
**Name** and **Resource Type** of each resource. To query by
[management group](../management-groups/overview.md) or subscription, use the `--managementgroups`
or `--subscriptions` arguments.

1. Run your first Azure Resource Graph query using the `graph` extension and `query` command:

   ```azurecli
   # Login first with az login if not using Cloud Shell

   # Run Azure Resource Graph query
   az graph query -q 'Resources | project name, type | limit 5'
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Update the query to `order by` the **Name** property:

   ```azurecli
   # Run Azure Resource Graph query with 'order by'
   az graph query -q 'Resources | project name, type | limit 5 | order by name asc'
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Update the query to first `order by` the **Name** property and then `limit` to the top five
   results:

   ```azurecli
   # Run Azure Resource Graph query with `order by` first, then with `limit`
   az graph query -q 'Resources | project name, type | order by name asc | limit 5'
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the Resource Graph extension from your Azure CLI environment, you can do so by
using the following command:

```azurecli
# Remove the Resource Graph extension from the Azure CLI environment
az extension remove -n resource-graph
```

## Next steps

In this quickstart, you've added the Resource Graph extension to your Azure CLI environment and run
your first query. To learn more about the Resource Graph language, continue to the query language
details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
