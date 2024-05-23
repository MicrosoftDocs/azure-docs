---
title: "Quickstart: Run Resource Graph query using Azure CLI"
description: In this quickstart, you run an Azure Resource Graph query using the extension for Azure CLI.
ms.date: 04/22/2024
ms.topic: quickstart
ms.custom: devx-track-azurecli
---

# Quickstart: Run Resource Graph query using Azure CLI

This quickstart describes how to run an Azure Resource Graph query using the extension for Azure CLI. The article also shows how to order (sort) and limit the query's results. You can run a query for resources in your tenant, management groups, or subscriptions. When you're finished, you can remove the extension.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) must be version 2.22.0 or higher for the Resource Graph extension.
- [Visual Studio Code](https://code.visualstudio.com/).

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

## Install the extension

To enable Azure CLI to query resources using Azure Resource Graph, the Resource Graph extension must be installed. You can manually install the extension with the following steps. Otherwise, the first time you run a query with `az graph` you're prompted to install the extension.

1. List the available extensions and versions:

   ```azurecli
   az extension list-available --output table
   ```

1. Install the extension:

   ```azurecli
   az extension add --name resource-graph
   ```

1. Verify the extension was installed:

   ```azurecli
   az extension list --output table
   ```

1. Display the extension's syntax:

   ```azurecli
   az graph query --help
   ```

   For more information about Azure CLI extensions, go to [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

## Run a query

After the Azure CLI extension is added to your environment, you can run a tenant-based query. The query in this example returns five Azure resources with the `name` and `type` of each resource. To query by [management group](../management-groups/overview.md) or subscription, use the `--management-groups` or `--subscriptions` arguments.

1. Run an Azure Resource Graph query:

   ```azurecli
   az graph query --graph-query 'Resources | project name, type | limit 5'
   ```

   This query example doesn't use a sort modifier like `order by`. If you run the query multiple times, it might yield a different set of resources for each request.

1. Update the query to `order by` the `name` property:

   ```azurecli
   az graph query --graph-query 'Resources | project name, type | limit 5 | order by name asc'
   ```

   Like the previous query, if you run this query multiple times it might yield a different set of resources for each request. The order of the query commands is important. In this example, the `order by` comes after the `limit`. The query limits the results to five resources and then orders those results by name.

1. Update the query to `order by` the `name` property and then `limit` the output to five results:

   ```azurecli
   az graph query --graph-query 'Resources | project name, type | order by name asc | limit 5'
   ```

   If this query is run several times with no changes to your environment, the results are consistent and ordered by the `name` property, but still limited to five results. The query orders the results by name and then limits the output to five resources.

## Clean up resources

To remove the Resource Graph extension, run the following command:

```azurecli
az extension remove --name resource-graph
```

To sign out of your Azure CLI session:

```azurecli
az logout
```

## Next steps

In this quickstart, you ran Azure Resource Graph queries using the extension for Azure CLI. To learn more, go to the query language details article.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
