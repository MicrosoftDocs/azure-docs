---
title: Run Azure Resource Graph query using REST API
description: In this quickstart, you run an Azure Resource Graph query using REST API and Azure CLI.
ms.date: 07/18/2024
ms.topic: quickstart
---

# Quickstart: Run Resource Graph query using REST API

This quickstart describes how to run an Azure Resource Graph query with REST API and view the results. The REST API elements are a URI that includes the API version and request body that contains the query. The examples use Azure CLI to sign into Azure and that authenticates your account to run `az rest` commands.

If you're unfamiliar with REST API, start by reviewing [Azure REST API Reference](/rest/api/azure/)
to get a general understanding of REST API, specifically request URI and request body. For the Azure Resource Graph specifications, see [Azure Resource Graph REST API](/rest/api/azureresourcegraph/resourcegraph/operation-groups).

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Latest version of [PowerShell](/powershell/scripting/install/installing-powershell) or Bash shell like Git Bash.
- Latest version of [Azure CLI](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/).

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `{subscriptionID}` with your Azure subscription ID.

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription {subscriptionID}
```

Use `az login` even if you're using PowerShell because the examples use Azure CLI [az rest](/cli/azure/reference-index#az-rest) commands.

## Review the REST API syntax

There are two elements to run REST API commands: the REST API URI and the request body. For information, go to [Resources](/rest/api/azureresourcegraph/resourcegraph/resources/resources). To query by [management group](../management-groups/overview.md), use `managementGroups` instead of `subscriptions`. To query the entire tenant, omit both the `managementGroups` and `subscriptions` properties from the request body.

The following example shows the REST API URI syntax to run a query for an Azure subscription.

```http
POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01
```

A request body is needed to run a query with REST API. The following example is the JSON to create a request body file.

```json
{
  "subscriptions": [
    "{subscriptionID}"
  ],
  "query": "Resources | project name, type | limit 5"
}
```

## Run Resource Graph query

The examples use the same `az rest` command but you change the request body to get different results. The examples list resources, order resources by the `name` property, and order resources by the `name` property and limit the number of results.

To run all the query examples, use the following `az rest` command for your shell environment:

# [PowerShell](#tab/powershell)

```powershell
az rest --method post --uri https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01 --body `@request-body.json
```

In PowerShell, the backtick (``` ` ```) is needed to escape the `at sign` (`@`) to specify a filename for the request body.

# [Bash](#tab/bash)

```bash
az rest --method post --uri https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01 --body @request-body.json
```

In a Bash shell like Git Bash, the backtick isn't needed to escape the `at sign` (`@`)  to specify a filename for the request body.

---

In each request body example, replace `{subscriptionID}` with your Azure subscription ID. Run the following command to get your Azure subscription ID for the request body:

```azurecli
az account show --query id --output tsv
```

### List resources

In Visual Studio Code, create a new file named _request-body.json_. Copy and paste the following JSON into the file and save the file.

The query returns five Azure resources with the `name` and `resource type` of each resource.

```json
{
  "subscriptions": [
    "{subscriptionID}"
  ],
  "query": "Resources | project name, type | limit 5"
}
```

Because this query example doesn't provide a sort modifier like `order by`, running this query multiple times yields a different set of resources per request.

### Order by name property

Update _request-body.json_ with the following code that changes the query to `order by` the `name` property. Save the file and use the `az rest` command to run the query.

```json
{
  "subscriptions": [
    "{subscriptionID}"
  ],
  "query": "Resources | project name, type | limit 5 | order by name asc"
}
```

If you run this query multiple times, it yields a different set of resources per request.

The order of the query commands is important. In this example, the `order by` comes after the `limit`. This command order limits the query results to five resources and then orders them.

### Order by name property and limit results

Update _request-body.json_ with the following code to `order by` the `name` property and then `limit` to the top five results. Save the file and use the same `az rest` command to run the query.


```json
{
  "subscriptions": [
    "{subscriptionID}"
  ],
  "query": "Resources | project name, type | order by name asc | limit 5"
}
```

If the query is run several times, assuming that nothing in your environment changed, the results returned are consistent and ordered by the `name` property, but limited to the top five results.

## Clean up resources

Sign out of your Azure CLI session.

```azurecli
az logout
```

## Next steps

In this quickstart, you used the Azure Resource Graph REST API endpoint to run a query. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
