---
title: REST APIs for search management
titleSuffix: Azure Cognitive Search
description: Create and configure an Azure Cognitive Search service with the REST Management API. You can scale a service up or down, manage admin and query api-keys, and query for system information.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/23/2022
---

# Manage your Azure Cognitive Search service with PowerShell
> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)

In this article, learn how to create and configure an Azure Cognitive Search service using using the [Management REST APIs](/rest/api/searchmanagement/). Although you can use the portal, script, or other SDKs for most management tasks, only the Management REST API is guaranteed to provide access to [preview service administration features](/rest/api/searchmanagement/management-api-versions#2021-04-01-preview).

> [!div class="checklist"]
> * [List search services](#list-search-services)
> * [Create or update a service](#create-or-update-a-service)
> * [(preview) Enable Azure role-based authentication for data plane](#enable-rbac)
> * [(preview) Enforce a customer-managed key policy](#enforce-cmk)
> * [(preview) Disable semantic search](#disable-semantic-search)
> * [(preview) Disable workloads that push data to external resources](#disable-external-access)

All of the Management REST APIs have examples. If a task isn't covered in this article, see the API reference instead.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-search/)

* [Postman](https://www.postman.com/downloads/) or another REST client that sends HTTP requests

* Azure Active Directory (Azure AD) to obtain a bearer token for request authentication

## Create a security principle

Management REST API calls are authenticated through Azure Active Directory, which means calls from the client need a security principle in Azure AD, along with permissions to create and configure a resource. This section explains how to create a security principal to generate the access token used for authenticating to Azure AD. 

The following steps are from ["How to call REST APIs with Postman"](../rest/api/azure/#how-to-call-azure-rest-apis-with-postman).

An easy way to generate the required client ID and password is using the **Try It** feature in the [Create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli#1-create-a-service-principal) article.

1. Select **Try It** and if necessary sign in to your Azure subscription.

1. In the AzureCloudShell console, paste in the following command. After replacing placeholder values with valid values, press Enter to run the command. Notice that the security principal needs "owner" permissions. This role allows you to create or update an Azure resource in the specified subscription.

    ```azurecli
    az ad sp create-for-rbac --name mySecurityPrincipalName \
                             --role owner \
                             --scopes /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName]
    ```

   Your response should look similar to the following screenshot:

   :::image type="content" source="/media/search-manage/azure-cloud-shell-create-sec-principal.png" alt-text="Screenshot of AzureCloudShell inputs and outputs.":::

   You'll use "appId", "password", and "tenantId" for the variables "clientId", "clientSecret", and "tenantId" in the next section..

1. Before closing the shell, enter the following command to get your subscription ID:

   ```azurecli
   az account show --query id -o tsv
   ````

## Set up Postman

As with the previous section, the following steps are from [this blog post](https://blog.jongallant.com/2021/02/azure-rest-apis-postman-2021/) if you need more detail.

1. Start a new Postman collection and edit its properties. In the Variables tab, create the following variables:

    | Variable | Description |
    |----------|-------------|
    | clientId | Provide the previously generated "appID" that you created in Azure AD. |
    | clientSecret | Provide the "password" that was created for your client. |
    | tenantId | Provide the "tenant" that was returned in the previous step. |
    | subscriptionId | Provide the subscription ID for your subscription. |
    | resource | Enter `https://management.azure.com/`. This is the Azure resource used for all control plane (service provisioning and management) operations. | 
    | bearerToken | (leave blank; the token is generated programmatically) |

1. In the Authorization tab, select **Bearer Token** as the type.

1. In the **Token** field, specify the variable placeholder `{{{{bearerToken}}}}`.

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

Now that Postman is set up, you can send REST calls similar to the ones described in this article. You'll update the endpoint, and request body where applicable.

## List search services

Returns all search services under the current subscription, including detailed service information:

```rest
GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2021-04-01-preview
```

## Create or update services

Creates or updates a search service under the current subscription:

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "location": "westus2",
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

<a name="enable-rbac"></a>

## (preview) Enable Azure role-based authentication for data plane

If you want to use Azure role-based access control (Azure RBAC), set "authOptions" to "aadOrApiKey" and then send the request.

If you want to use Azure RBAC exclusively, you can [turn off API key authentication](search-security-rbac.md#disable-api-key-authentication) by following up a second request, this time setting "disableLocalAuth" to "false".

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "location": "westus",
  "tags": {
    "app-name": "My e-commerce app"
  },
  "sku": {
    "name": "standard"
  },
  "properties": {
    "replicaCount": 3,
    "partitionCount": 1,
    "hostingMode": "default",
    "disableLocalAuth": false,
    "authOptions": "aadOrApiKey"
    }
  }
}
```

<a name="enforce-cmk"></a>

## (preview) Enforce a customer-managed key policy

If you're using [customer-managed encryption](search-security-manage-encryption-keys.md), you can enable "encryptionWithCMK" with "enforcement" set to "Enabled" if you want the search service to report it's compliance status.

When this policy is enabled, calls that create objects with sensitive data, such as the connection string within a data source, will fail if an encryption key is not provided: `"Error creating Data Source: "CannotCreateNonEncryptedResource: The creation of non-encrypted DataSources is not allowed when encryption policy is enforced."`


```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "location": "westus",
  "tags": {
    "app-name": "My e-commerce app"
  },
  "sku": {
    "name": "standard"
  },
  "properties": {
    "replicaCount": 3,
    "partitionCount": 1,
    "hostingMode": "default",
    "encryptionWithCmk": {
      "enforcement": "Enabled",
      "encryptionComplianceStatus": "Compliant"
    },
  }
}
```

<a name="disable-semantic search"></a>

## (preview) Disable semantic search

Although you have to [enable semantic search](semantic-search-overview#enable-semantic-search.md) before you can use it, you can also lock it down at the service level.

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "location": "{{region}}",
      "sku": {
        "name": "standard"
      },
      "properties": {
        "semanticSearch": "disabled"
      }
    }
```

<a name="disable-external-access"></a>

## (preview) Disable workloads that push data to external resources

Azure Cognitive Search makes outbound calls that [write to external data sources](search-indexer-securing-resources.md) when creating or updating a knowledge store, saving debug session state, or caching enrichments. The following example disables these workloads at the service level.

```rest
PUT https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-preview
{
  "location": "westus",
  "sku": {
    "name": "standard"
  },
  "properties": {
    "replicaCount": 3,
    "partitionCount": 1,
    "hostingMode": "default",
    "disabledDataExfiltrationOptions": [
      "All"
    ]
  }
}
```

## Next steps

After a search service is configured, next steps include [create an index](search-how-to-create-search-index.md) or [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure Cognitive Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure Cognitive Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure Cognitive Search in .NET](search-howto-dotnet-sdk.md)