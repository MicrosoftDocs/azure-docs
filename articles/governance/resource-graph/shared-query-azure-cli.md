---
title: "Quickstart: Create a shared query with Azure CLI"
description: In this quickstart, you follow the steps to enable the Resource Graph extension for Azure CLI and create a shared query.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-azurecli
---
# Quickstart: Create a Resource Graph shared query using Azure CLI

The first step to using Azure Resource Graph with [Azure CLI](/cli/azure/) is to check that the
extension is installed. This quickstart walks you through the process of adding the extension to
your Azure CLI installation. You can use the extension with Azure CLI installed locally or through
the [Azure Cloud Shell](https://shell.azure.com).

At the end of this process, you'll have added the extension to your Azure CLI installation of choice
and create a Resource Graph shared query.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

<!-- [!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)] -->

## Add the Resource Graph extension

To enable Azure CLI to work with Azure Resource Graph, the extension must be added. This extension
works wherever Azure CLI can be used, including [bash on Windows 10](/windows/wsl/install-win10),
[Cloud Shell](https://shell.azure.com) (both standalone and inside the portal), the [Azure CLI
Docker image](https://hub.docker.com/_/microsoft-azure-cli), or locally installed.

1. Check that the latest Azure CLI is installed (at least **2.8.0**). If it isn't yet installed,
   follow [these instructions](/cli/azure/install-azure-cli-windows).

1. In your Azure CLI environment of choice, use
   [az extension add](/cli/azure/extension#az-extension-add) to import the Resource Graph extension
   with the following command:

   ```azurecli
   # Add the Resource Graph extension to the Azure CLI environment
   az extension add --name resource-graph
   ```

1. Validate that the extension has been installed and is the expected version (at least **1.1.0**)
   with [az extension list](/cli/azure/extension#az-extension-list):

   ```azurecli
   # Check the extension list (note that you may have other extensions installed)
   az extension list

   # Run help for graph query options
   az graph query -h
   ```

## Create a Resource Graph shared query

With the Azure CLI extension added to your environment of choice, it's time to a Resource Graph
shared query. The shared query is an Azure Resource Manager object that you can grant permission to
or run in Azure Resource Graph Explorer. The query summarizes the count of all resources grouped by
_location_.

1. Create a resource group with [az group create](/cli/azure/group#az-group-create) to store the
   Azure Resource Graph shared query. This resource group is named `resource-graph-queries` and the
   location is `westus2`.

   ```azurecli
   # Login first with az login if not using Cloud Shell

   # Create the resource group
   az group create --name 'resource-graph-queries' --location 'westus2'
   ```

1. Create the Azure Resource Graph shared query using the `graph` extension and
   [az graph shared-query create](/cli/azure/graph/shared-query#az-graph-shared-query-create)
   command:

   ```azurecli
   # Create the Azure Resource Graph shared query
   az graph shared-query create --name 'Summarize resources by location' \
      --description 'This shared query summarizes resources by location for a pinnable map graphic.' \
      --graph-query 'Resources | summarize count() by location' \
      --resource-group 'resource-graph-queries'
   ```

1. List the shared queries in the new resource group. The
   [az graph shared-query list](/cli/azure/graph/shared-query#az-graph-shared-query-list)
   command returns an array of values.

   ```azurecli
   # List all the Azure Resource Graph shared queries in a resource group
   az graph shared-query list --resource-group 'resource-graph-queries'
   ```

1. To get just a single shared query result, use the
   [az graph shared-query show](/cli/azure/graph/shared-query#az-graph-shared-query-show)
   command.

   ```azurecli
   # Show a specific Azure Resource Graph shared query
   az graph shared-query show --resource-group 'resource-graph-queries' \
      --name 'Summarize resources by location'
   ```

1. Run the shared query in Azure CLI with the `{{shared-query-uri}}` syntax in an
   [az graph query](/cli/azure/graph#az-graph-query) command.
   First, copy the `id` field from the result of the previous `show` command. Replace
   `shared-query-uri` text in the example with the value from the `id` field, but leave the
   surrounding `{{` and `}}` characters.

   ```azurecli
   # Run a Azure Resource Graph shared query
   az graph query --graph-query "{{shared-query-uri}}"
   ```

   > [!NOTE]
   > The `{{shared-query-uri}}` syntax is a **Preview** feature.

Another way to find Resource Graph shared queries is through the Azure portal. In the portal, use
the search bar to search for "Resource Graph queries". Select the shared query. On the **Overview**
page, the **Query** tab displays the saved query. The **Edit** button opens it in
[Resource Graph Explorer](./first-query-portal.md).

## Clean up resources

If you wish to remove the Resource Graph shared query, resource group, and extension from your Azure
CLI environment, you can do so by using the following commands:

- [az graph shared-query delete](/cli/azure/graph/shared-query#az-graph-shared-query-delete)
- [az group delete](/cli/azure/group#az-group-delete)
- [az extension remove](/cli/azure/extension#az-extension-remove)

```azurecli
# Delete the Azure Resource Graph shared query
az graph shared-query delete --resource-group 'resource-graph-queries' \
   --name 'Summarize resources by location'

# Remove the resource group
# WARNING: This command deletes ALL resources you've added to this resource group without prompting for confirmation
az group delete --resource-group 'resource-graph-queries' --yes

# Remove the Azure Resource Graph extension from the Azure CLI environment
az extension remove -n resource-graph
```

## Next steps

In this quickstart, you've added the Resource Graph extension to your Azure CLI environment and
created a shared query. To learn more about the Resource Graph language, continue to the query
language details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
