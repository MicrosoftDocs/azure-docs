---
title: "Quickstart: Your first REST API query"
description: In this quickstart, you follow the steps to call the Resource Graph endpoint for REST API and run your first query.
ms.date: 07/09/2021
ms.topic: quickstart
---
# Quickstart: Run your first Resource Graph query using REST API

The first step to using Azure Resource Graph with REST API is to check that you have a tool for
calling REST APIs available. This quickstart then walks you through the process of running a query
and retrieving the results by calling the Azure Resource Graph REST API endpoint.

At the end of this process, you'll have the tools for calling REST API endpoints and run your first
Resource Graph query.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Getting started with REST API

If you're unfamiliar with REST API, start by reviewing [Azure REST API Reference](/rest/api/azure/)
to get a general understanding of REST API, specifically request URI and request body. This article
uses these concepts to provide directions for working with Azure Resource Graph and assumes a
working knowledge of them. Tools such as [ARMClient](https://github.com/projectkudu/ARMClient) and
others may handle authorization automatically and are recommended for beginners.

For the Azure Resource Graph specs, see
[Azure Resource Graph REST API](/rest/api/azure-resourcegraph/).

### REST API and PowerShell

If you don't already have a tool for making REST API calls, consider using PowerShell for these
instructions. The following code sample gets a header for authenticating with Azure. Generate an
authentication header, sometimes called a **Bearer token**, and provide the REST API URI to connect
to with any parameters or a **Request Body**:

```azurepowershell-interactive
# Log in first with Connect-AzAccount if not using Cloud Shell

$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

# Invoke the REST API
$restUri = "https://management.azure.com/subscriptions/$($azContext.Subscription.Id)?api-version=2020-01-01"
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader
```

The `$response` variable holds the result of the `Invoke-RestMethod` cmdlet, which can be parsed
with cmdlets such as
[ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json). If the REST
API service endpoint expects a **Request Body**, provide a JSON formatted variable to the `-Body`
parameter of `Invoke-RestMethod`.

## Run your first Resource Graph query

With the REST API tools added to your environment of choice, it's time to try out a simple
subscription-based Resource Graph query. The query returns the first five Azure resources with the
**Name** and **Resource Type** of each resource. To query by
[management group](../management-groups/overview.md), use `managementgroups` instead of
`subscriptions`. To query the entire tenant, omit both the `managementgroups` and `subscriptions`
properties from the request body.

In the request body of each REST API call, there's a variable that is used that you need to replace
with your own value:

- `{subscriptionID}` - Replace with your subscription ID

1. Run your first Azure Resource Graph query using the REST API and the `resources` endpoint:

   - REST API URI

     ```http
     POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01
     ```

   - Request Body

     ```json
     {
         "subscriptions": [
             "{subscriptionID}"
         ],
         "query": "Resources | project name, type | limit 5"
     }
     ```

   > [!NOTE]
   > As this query example doesn't provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Update the call to the `resouces` endpoint and change the **query** to `order by` the **Name**
   property:

   - REST API URI

     ```http
     POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01
     ```

   - Request Body

     ```json
     {
         "subscriptions": [
             "{subscriptionID}"
         ],
         "query": "Resources | project name, type | limit 5 | order by name asc"
     }
     ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Update the call to the `resources` endpoint and change the **query** to first `order by` the
   **Name** property and then `limit` to the top five results:

   - REST API URI

     ```http
     POST https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01
     ```

   - Request Body

     ```json
     {
         "subscriptions": [
             "{subscriptionID}"
         ],
         "query": "Resources | project name, type | order by name asc | limit 5"
     }
     ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

For more examples of REST API calls for Azure Resource Graph, see the
[Azure Resource Graph REST Examples](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources#examples).

## Clean up resources

REST API has no libraries or modules to uninstall. If you installed a tool such as _ARMClient_ or
_Postman_ to make the calls and no longer need it, you may uninstall the tool now.

## Next steps

In this quickstart, you've called the Resource Graph REST API endpoint and run your first query. To
learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
