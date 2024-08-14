---
title: "Quickstart: Create Resource Graph shared query using Azure CLI"
description: In this quickstart, you create an Azure Resource Graph shared query using Azure CLI and the resource-graph extension.
ms.date: 06/27/2024
ms.topic: quickstart
ms.custom: devx-track-azurecli
---

# Quickstart: Create Resource Graph shared query using Azure CLI

This quickstart describes how to create an Azure Resource Graph shared query with Azure CLI and the Resource Graph extension. The [az graph shared-query](/cli/azure/graph/shared-query) commands are an _experimental_ feature of [az graph query](/cli/azure/graph#az-graph-query).

A shared query can be run from Azure CLI with the _experimental_ feature's commands, or you can run the shared query from the Azure portal. A shared query is an Azure Resource Manager object that you can grant permission to or run in Azure Resource Graph Explorer. When you finish, you can remove the Resource Graph extension.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) must be version 2.22.0 or higher for the Resource Graph extension.
- A Bash shell environment where you can run Azure CLI commands. For example, Git Bash in a [Visual Studio Code](https://code.visualstudio.com/) terminal session.

## Install the extension

To enable Azure CLI to query resources using Azure Resource Graph, the Resource Graph extension must be installed. The first time you run a query with `az graph` a prompt is displayed to install the extension. Otherwise, use the following steps to do a manual installation.

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

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

## Create a shared query

Create a resource group and a shared that summarizes the count of all resources grouped by location.

1. Create a resource group to store the Azure Resource Graph shared query. 

   ```azurecli
   az group create --name "demoSharedQuery" --location westus2
   ```

1. Create the shared query.

   ```azurecli
   az graph shared-query create --name "Summarize resources by location" \
     --description "This shared query summarizes resources by location for a pinnable map graphic." \
     --graph-query "Resources | summarize count() by location" \
     --resource-group demoSharedQuery
   ```

1. List all shared queries in the resource group. 

   ```azurecli
   az graph shared-query list --resource-group demoSharedQuery
   ```

1. Limit the results to a specific shared query.

   ```azurecli
   az graph shared-query show --resource-group "demoSharedQuery" \
     --name "Summarize resources by location"
   ```

## Run the shared query

You can use the Azure CLI experimental feature syntax or the Azure portal to run the shared query. 

### Use experimental feature to run shared query

Run the shared query in Azure CLI with the `{{shared-query-uri}}` syntax in an `az graph query` command. You get the resource ID of your shared query and store it in a variable. The variable is used when you run the shared query.

```azurecli
sharedqueryid=$(az graph shared-query show --resource-group "demoSharedQuery" \
  --name "Summarize resources by location" \
  --query id \
  --output tsv)

az graph query --graph-query "{{$sharedqueryid}}"
```

You can use the `subscriptions` parameter to limit the results. 

```azurecli
az graph query --graph-query "{{$sharedqueryid}}" --subscriptions 11111111-1111-1111-1111-111111111111
```

### Run the shared query from portal

You can verify the shared query works using Azure Resource Graph Explorer. To change the scope, use the **Scope** menu on the left side of the page. 

1. Sign in to [Azure portal](https://portal.azure.com).
1. Enter _resource graph_ into the search field at the top of the page.
1. Select **Resource Graph Explorer**.
1. Select **Open query**.
1. Change **Type** to _Shared queries_.
1. Select the query _Count VMs by OS_.
1. Select **Run query** and the view output in the **Results** tab.
1. Select **Charts** and then select **Map** to view the location map.

You can also run the query from your resource group. 

1. In Azure, go to the resource group, _demoSharedQuery_.
1. From the **Overview** tab, select the query _Count VMs by OS_.
1. Select the **Results** tab.
1. Select **Charts** and then select **Map** to view the location map.

## Clean up resources

To remove the shared query:

```azurecli
az graph shared-query delete --name "Summarize resources by location" --resource-group demoSharedQuery
```

When a resource group is deleted, the resource group and all its resources are deleted. To remove the resource group:

```azurecli
az group delete --name demoSharedQuery
```

To remove the Resource Graph extension, run the following command:

```azurecli
az extension remove --name resource-graph
```

To sign out of your Azure CLI session:

```azurecli
az logout
```

## Next steps

In this quickstart, you added the Resource Graph extension to your Azure CLI environment and created a shared query. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
