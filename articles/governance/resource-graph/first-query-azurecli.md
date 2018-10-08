---
title: Run your first Resource Graph query using Azure CLI
description: This article walks you through the steps to enable the Resource Graph extension for Azure CLI and run your first query.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: resource-graph
ms.custom: mvc
manager: carmonm
---
# Run your first Resource Graph query using Azure CLI

The first step to using Azure Resource Graph is to ensure the extension for [Azure
CLI](/cli/azure/) is installed. This quickstart walks you through the process of adding the
extension to your Azure CLI installation. You can use the extension with Azure CLI installed
locally or through the [Azure Cloud Shell](https://shell.azure.com).

At the end of this process, you will have added the extension to your Azure CLI installation of
choice and run your very first Resource Graph query.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Add the Resource Graph extension

To enable Azure CLI to query Azure Resource Graph, the extension must be added. This extension
works wherever Azure CLI can be used, including [bash on Windows 10](/windows/wsl/install-win10),
[Cloud Shell](https://shell.azure.com) (both standalone and inside the portal), the [Azure CLI
Docker image](https://hub.docker.com/r/microsoft/azure-cli/), or locally installed.

1. Ensure the latest Azure CLI is installed (at least **2.0.45**). If it is not yet installed, follow [these instructions](/cli/azure/install-azure-cli-windows?view=azure-cli-latest).

1. In your Azure CLI environment of choice, import it with the following command:

   ```azurecli-interactive
   # Add the Resource Graph extension to the Azure CLI environment
   az extension add --name resource-graph
   ```

1. Validate that the extension has been installed and is the expected version (at least **0.1.7**):

   ```azurecli-interactive
   # Check the extension list (note that you may have other extensions installed)
   az extension list

   # Run help for graph query options
   az graph query -h
   ```

## Run your first Resource Graph query

Now that the Azure CLI extension has been added to your environment of choice, it is time to try
out a simple Resource Graph query. The query will return the first five Azure resources with the
**Name** and **Resource Type** of each resource.

1. Run your first Azure Resource Graph query using the `graph` extension and `query` command:

   ```azurecli-interactive
   # Login first with az login if not using Cloud Shell

   # Run Azure Resource Graph query
   az graph query -q 'project name, type | limit 5'
   ```

   > [!NOTE]
   > As this query example does not provide a sort modifier such as `order by`, running this query multiple
   > times is likely to yield a different set of resources per request.

1. Update the query to `order by` the **Name** property:

   ```azurecli-interactive
   # Run Azure Resource Graph query with 'order by'
   az graph query -q 'project name, type | limit 5 | order by name asc'
   ```

  > [!NOTE]
  > Just as with the first query, running this query multiple times is likely to yield a different
  > set of resources per request. The order of the query commands is important. In this example, the
  > `order by` comes after the `limit`. This will first limit the query results and then order them.

1. Update the query to first `order by` the **Name** property and then `limit` to the top 5 results:

   ```azurecli-interactive
   # Run Azure Resource Graph query with `order by` first, then with `limit`
   az graph query -q 'project name, type | order by name asc | limit 5'
   ```

When the final query is run multiple times, assuming that nothing in your environment is changing,
the results returned will be consistent and as expected -- ordered by the **Name** property, but
still limited to the top 5 results.

## Cleanup

If you wish to remove the Resource Graph extension from your Azure CLI environment, you can do so by
using the following command:

```azurecli-interactive
# Remove the Resource Graph extension from the Azure CLI environment
az extension remove -n resource-graph
```

> [!NOTE]
> This does not delete the extension file downloaded earlier. It only removes it from the running
> Azure CLI environment.

## Next steps

- Get more information about the [query language](./concepts/query-language.md)
- Learn to [explore resources](./concepts/explore-resources.md)
- Run your first query with [Azure PowerShell](first-query-powershell.md)
- See samples of [Starter queries](./samples/starter.md)
- See samples of [Advanced queries](./samples/advanced.md)
- Provide feedback on [UserVoice](https://feedback.azure.com/forums/915958-azure-governance)