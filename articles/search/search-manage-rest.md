---
title: Manage with REST
titleSuffix: Azure AI Search
description: Create and configure an Azure AI Search service with the Management REST API. The Management REST API is comprehensive in scope, with access to generally available and preview features.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/09/2023
---

# Manage your Azure AI Search service with REST APIs

> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)

In this article, learn how to create and configure an Azure AI Search service using the [Management REST APIs](/rest/api/searchmanagement/). Only the Management REST APIs are guaranteed to provide early access to [preview features](/rest/api/searchmanagement/management-api-versions). 

The Management REST API is available in stable and preview versions. Be sure to set a preview API version if you're accessing preview features.

> [!div class="checklist"]
> * [List search services](#list-search-services)
> * [Create or update a service](#create-or-update-a-service)
> * [Enable Azure role-based access control for data plane](#enable-rbac)
> * [(preview) Enforce a customer-managed key policy](#enforce-cmk)
> * [(preview) Disable semantic ranking](#disable-semantic-search)
> * [(preview) Disable workloads that push data to external resources](#disable-external-access)

All of the Management REST APIs have examples. If a task isn't covered in this article, see the [API reference](/rest/api/searchmanagement/) instead.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-search/).

* [Postman](https://www.postman.com/downloads/) or another REST client that sends HTTP requests.

* [Azure CLI](/cli/azure/install-azure-cli) used to set up a security principle for the client. You must have owner or administrator permissions to create  a security principle.

## Create a security principal

Management REST API calls are authenticated through Microsoft Entra ID. You'll need a security principal for your REST client, along with permissions to create and configure a resource. This section explains how to create a security principal and assign a role. 

> [!NOTE]
> The following steps are borrowed from the [Azure REST APIs with Postman](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/) blog post.

1. Open a command shell for Azure CLI.

1. Sign in to your Azure subscription.

   ```azurecli
   az login
   ```

1. First, get your subscription ID. In the console, enter the following command:

   ```azurecli
   az account show --query id -o tsv
   ````

1. Create a resource group for your security principal, specifying a location and name. This example uses the West US region.

   ```azurecli
   az group create -l westus -n MyResourceGroup
   ```

1. Create the service principal, replacing the placeholder values with valid values. You'll need a descriptive security principal name, subscription ID, resource group name.

   Notice that the security principal has "owner" permissions, necessary for creating or updating an Azure resource. If you're managing an existing search service, use contributor or "Search Service Contributor" (quote enclosed) instead.

    ```azurecli
    az ad sp create-for-rbac --name mySecurityPrincipalName \
                             --role owner \
                             --scopes /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName
    ```

   A successful response includes "appId", "password", and "tenant". You'll use these values for the variables "clientId", "clientSecret", and "tenant" in the next section.

## Set up Postman

The following steps are from [this blog post](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/) if you need more detail.

1. Start a new Postman collection and edit its properties. In the Variables tab, create the following variables:

    | Variable | Description |
    |----------|-------------|
    | clientId | Provide the previously generated "appID" that you created in Microsoft Entra ID. |
    | clientSecret | Provide the "password" that was created for your client. |
    | tenantId | Provide the "tenant" that was returned in the previous step. |
    | subscriptionId | Provide the subscription ID for your subscription. |
    | resource | Enter `https://management.azure.com/`. This Azure resource is used for all control plane operations. | 
    | bearerToken | (leave blank; the token is generated programmatically) |

1. In the Authorization tab, select **Bearer Token** as the type.

1. In the **Token** field, specify the variable placeholder `{{bearerToken}}`.

1. In the Pre-request Script tab, paste in the following script:

    ```javascript
    pm.test("Check for collectionVariables", function () {
        let vars = ['clientId', 'clientSecret', 'tenantId', 'subscriptionId'];
        vars.forEach(function (item, index, array) {
            console.log(item, index);
            pm.expect(pm.collectionVariables.get(item), item + " variable not set").to.not.be.undefined;
            pm.expect(pm.collectionVariables.get(item), item + " variable not set").to.not.be.empty; 
        });
    
        if (!pm.collectionVariables.get("bearerToken") || Date.now() > new Date(pm.collectionVariables.get("bearerTokenExpiresOn") * 1000)) {
            pm.sendRequest({
                url: 'https://login.microsoftonline.com/' + pm.collectionVariables.get("tenantId") + '/oauth2/token',
                method: 'POST',
                header: 'Content-Type: application/x-www-form-urlencoded',
                body: {
                    mode: 'urlencoded',
                    urlencoded: [
                        { key: "grant_type", value: "client_credentials", disabled: false },
                        { key: "client_id", value: pm.collectionVariables.get("clientId"), disabled: false },
                        { key: "client_secret", value: pm.collectionVariables.get("clientSecret"), disabled: false },
                        { key: "resource", value: pm.collectionVariables.get("resource") || "https://management.azure.com/", disabled: false }
                    ]
                }
            }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    let resJson = res.json();
                    pm.collectionVariables.set("bearerTokenExpiresOn", resJson.expires_on);
                    pm.collectionVariables.set("bearerToken", resJson.access_token);
                }
            });
        }
    });
    ```

1. Save the collection.

Now that Postman is set up, you can send REST calls similar to the ones described in this article. You'll update the endpoint and request body where applicable.

## List search services

Returns all search services under the current subscription, including detailed service information:

```rest
GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2023-11-01
```

## Create or update a service

Creates or updates a search service under the current subscription. This example uses variables for the search service name and region, which haven't been defined yet. Either provide the names directly, or add new variables to the collection.

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01
{
  "location": "{{region}}",
  "sku": {
    "name": "basic"
  },
  "properties": {
    "replicaCount": 1,
    "partitionCount": 1,
    "hostingMode": "default"
  }
}
```

## Create an S3HD service

To create an [S3HD](search-sku-tier.md#tier-descriptions) service, use a combination of `-Sku` and `-HostingMode` properties. Set "sku" to `Standard3` and "hostingMode" to `HighDensity`.

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01
{
  "location": "{{region}}",
  "sku": {
    "name": "Standard3"
  },
  "properties": {
    "replicaCount": 1,
    "partitionCount": 1,
    "hostingMode": "HighDensity"
  }
}
```

<a name="enable-rbac"></a>

## Configure role-based access for data plane

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token.

To use Azure role-based access control (Azure RBAC) for data plane operations, set "authOptions" to "aadOrApiKey" and then send the request.

If you want to use Azure RBAC exclusively, [turn off API key authentication](search-security-rbac.md#disable-api-key-authentication) by following up with a second request, this time setting "disableLocalAuth" to "true".

```rest
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01
{
  "properties": {
    "disableLocalAuth": false,
    "authOptions": {
      "aadOrApiKey": {
        "aadAuthFailureMode": "http401WithBearerChallenge"
      }
    }
  }
}
```

<a name="enforce-cmk"></a>

## (preview) Enforce a customer-managed key policy

If you're using [customer-managed encryption](search-security-manage-encryption-keys.md), you can enable "encryptionWithCMK" with "enforcement" set to "Enabled" if you want the search service to report its compliance status.

When you enable this policy, any REST calls that create objects containing sensitive data, such as the connection string within a data source, will fail if an encryption key isn't provided: `"Error creating Data Source: "CannotCreateNonEncryptedResource: The creation of non-encrypted DataSources is not allowed when encryption policy is enforced."`

```rest
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "properties": {
    "encryptionWithCmk": {
      "enforcement": "Enabled",
      "encryptionComplianceStatus": "Compliant"
    },
  }
}
```

<a name="disable-semantic-search"></a>

## Disable semantic ranking

Although [semantic ranking isn't enabled](semantic-how-to-enable-disable.md) by default, you could lock down the feature at the service level.

```rest
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
{
  "properties": {
    "semanticSearch": "disabled"
  }
}
```

<a name="disable-external-access"></a>

## (preview) Disable workloads that push data to external resources

Azure AI Search [writes to external data sources](search-indexer-securing-resources.md) when updating a knowledge store, saving debug session state, or caching enrichments. The following example disables these workloads at the service level.

```rest
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "properties": {
    "disabledDataExfiltrationOptions": [
      "All"
    ]
  }
}
```

## Next steps

After a search service is configured, next steps include [create an index](search-how-to-create-search-index.md) or [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure AI Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure AI Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure AI Search in .NET](search-howto-dotnet-sdk.md)
