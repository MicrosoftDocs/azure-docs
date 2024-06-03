---
title: Enable role-based access control
titleSuffix: Azure AI Search
description: Enable or disable role-based access control for token authentication using Microsoft Entra ID on Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/03/2024

---

# Enable or disable role-based access control in Azure AI Search

Azure AI Search supports authentication and authorization through role assignments and Microsoft Entra ID, which is built into all Azure tenants.

+ Roles for service administration (control plane) are mandatory. 

+ Roles for data plane operations are optional, but strongly recommended. The alternative is [key-based authentication](search-security-api-keys.md), which is the default. You must enable role-based access before you can assign Search Service Contributor, Search Index Data Contributor, or Search Index Data Reader roles for data operations.

In this article, configure your search service to recognize an **authorization** header on data plane requests that provide an OAuth2 access token.

> [!NOTE]
> *Data plane* refers to operations against the search service endpoint, such as indexing or queries, or any other operation specified in the [Search REST API](/rest/api/searchservice/) or equivalent client libraries.

## Prerequisites

+ **Owner**, **User Access Administrator**, or a role with [Microsoft.Authorization/roleAssignments/write](/azure/templates/microsoft.authorization/roleassignments) permissions.

+ A search service in any region, on any tier.

## Limitations

+ Role-based access control can increase the latency of some requests. Each unique combination of service resource (index, indexer, etc.) and service principal triggers an authorization check. These authorization checks can add up to 200 milliseconds of latency per request. 

+ In rare cases where requests originate from a high number of different service principals, all targeting different service resources (indexes, indexers, etc.), it's possible for the authorization checks to result in throttling. Throttling would only happen if hundreds of unique combinations of search service resource and service principal were used within a second.

## Enable role-based access for data plane operations

Use the Azure portal, Management REST API, the Azure CLI, or Azure PowerShell to configure the search service.

### [**Azure portal**](#tab/config-svc-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Settings** and then select **Keys** in the left navigation pane.

   :::image type="content" source="media/search-security-rbac/search-security-enable-roles.png" lightbox="media/search-security-rbac/search-security-enable-roles.png" alt-text="Screenshot of the keys page with authentication options." border="true":::

1. Choose **Role-based control** or **Both** if you're currently using keys and need time to transition clients to role-based access control. 

   | Option | Description |
   |--------|--------------|
   | API Key | (default). Requires [API keys](search-security-api-keys.md) on the request header for authorization. |
   | Role-based access control | Requires membership in a role assignment to complete the task. It also requires an authorization header on the request. |
   | Both | Requests are valid using either an API key or role-based access control, but if you provide both in the same request, the API key is used. |

The change is effective immediately, but wait a few seconds before assigning roles.

When you enable role-based access control, the failure mode is "http401WithBearerChallenge" if authorization fails.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API [Create or Update Service](/rest/api/searchmanagement/services/create-or-update) to configure your service for role-based access control.

All calls to the Management REST API are authenticated through Microsoft Entra ID. For help with setting up authenticated requests, see [Manage Azure AI Search using REST](search-manage-rest.md).

1. Get service settings so that you can review the current configuration.

   ```http
   GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2023-11-01
   ```

1. Use PATCH to update service configuration. The following modifications enable both keys and role-based access. If you want a roles-only configuration, see [Disable API keys](#disable-api-key-authentication).

   Under "properties", set ["authOptions"](/rest/api/searchmanagement/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey". The "disableLocalAuth" property must be false to set "authOptions".

   Optionally, set ["aadAuthFailureMode"](/rest/api/searchmanagement/services/create-or-update#aadauthfailuremode) to specify whether 401 is returned instead of 403 when authentication fails. Valid values are "http401WithBearerChallenge" or "http403".

    ```http
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

The change is effective immediately, but wait a few seconds before assigning roles. 

When you enable role-based access control, the failure mode is "http401WithBearerChallenge" if authorization fails.

---

## Disable role-based access control

Because roles aren't required, it's possible to disable role-based access control for data plane operations and use key-based authentication instead. You might want to do this as part of test worklow, for example to rule out permission issues.

Reverse the steps you followed previously to enable role-based access.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Settings** and then select **Keys** in the left navigation pane.

1. Select **API Keys**.

## Disable API key authentication

Key access, or local authentication, can be disabled on your service if you're exclusively using the built-in roles and Microsoft Entra authentication. Disabling API keys causes the search service to refuse all data-related requests that pass an API key in the header.

> [!NOTE]
> Admin API keys can only be disabled, not deleted. Query API keys can be deleted.

Owner or Contributor permissions are required to disable features.

To disable [key-based authentication](search-security-api-keys.md), use Azure portal or the Management REST API.

### [**Portal**](#tab/disable-keys-portal)

1. In the Azure portal, navigate to your search service.

1. In the left-navigation pane, select **Keys**.

1. Select **Role-based access control**.

The change is effective immediately, but wait a few seconds before testing. Assuming you have permission to assign roles as a member of Owner, service administrator, or coadministrator, you can use portal features to test role-based access.

### [**REST API**](#tab/disable-keys-rest)

To disable key-based authentication, set "disableLocalAuth" to true.

1. Get service settings so that you can review the current configuration.

   ```http
   GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2023-11-01
   ```

1. Use PATCH to update service configuration. The following modification will set "authOptions" to null.

    ```http
    PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01
    {
        "properties": {
            "disableLocalAuth": true
        }
    }
    ```

Requests that include an API key only, with no bearer token, fail with an HTTP 401.

To re-enable key authentication, rerun the last request, setting "disableLocalAuth" to false. The search service resumes acceptance of API keys on the request automatically (assuming they're specified).

---

## Next steps

> [!div class="nextstepaction"]
> [Configure a managed identity for a search service]()
