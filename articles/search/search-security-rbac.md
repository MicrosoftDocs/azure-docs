---
title: Connect using Azure roles
titleSuffix: Azure AI Search
description: Use Azure role-based access control for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/16/2023
ms.custom: subject-rbac-steps, references_regions
---

# Connect to Azure AI Search using Azure role-based access control (Azure RBAC)

Azure provides a global [role-based access control authorization system](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Azure AI Search, you can use Azure roles for:

+ Control plane operations (service administration tasks through Azure Resource Manager).

+ Data plane operations, such as creating, loading, and querying indexes.

Per-user access over search results (sometimes referred to as row-level security or document-level security) isn't supported. As a workaround, [create security filters](search-security-trimming-for-azure-search.md) that trim results by user identity, removing documents for which the requestor shouldn't have access.

> [!NOTE]
> In Azure AI Search, "control plane" refers to operations supported in the [Management REST API](/rest/api/searchmanagement/) or equivalent client libraries. The "data plane" refers to operations against the search service endpoint, such as indexing or queries, or any other operation specified in the [Search REST API](/rest/api/searchservice/) or equivalent client libraries.

## Built-in roles used in Search

The following roles are built in. If these roles are insufficient, [create a custom role](#create-a-custom-role). 

| Role | Plane | Description  |
| ---- | ------|--------------------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | Control & Data | Full access to the control plane of the search resource, including the ability to assign Azure roles. Only the Owner role can enable or disable authentication options or manage roles for other users. Subscription administrators are members by default. </br></br>On the data plane, this role has the same access as the Search Service Contributor role. It includes access to all data plane actions except the ability to query or index documents.|
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | Control & Data |  Same level of control plane access as Owner, minus the ability to assign roles or change authentication options. </br></br>On the data plane, this role has the same access as the Search Service Contributor role. It includes access to all data plane actions except the ability to query or index documents.|
| [Reader](../role-based-access-control/built-in-roles.md#reader) | Control & Data | Read access across the entire service, including search metrics, content metrics (storage consumed, number of objects), and the object definitions of data plane resources (indexes, indexers, and so on). However, it can't read API keys or read content within indexes. |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | Control & Data | Read-write access to object definitions (indexes, synonym maps, indexers, data sources, and skillsets). See [`Microsoft.Search/searchServices/*`](../role-based-access-control/resource-provider-operations.md#microsoftsearch) for the permissions list. This role can't access content in an index, so no querying or indexing, but it can create, delete, and list indexes, return index definitions and statistics, and test analyzers. This role is for search service administrators who need to manage the search service and its objects, but without content access. |
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | Data | Read-write access to content in all indexes on the search service. This role is for developers or index owners who need to import, refresh, or query the documents collection of an index. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | Data |  Read-only access to all search indexes on the search service. This role is for apps and users who run queries. |

> [!NOTE]
> If you disable Azure role-based access, built-in roles for the control plane (Owner, Contributor, Reader) continue to be available. Disabling Azure RBAC removes just the data-related permissions associated with those roles. In a disabled-RBAC scenario, Search Service Contributor is equivalent to control-plane Contributor.

## Limitations

+ Adoption of role-based access control might increase the latency of some requests. Each unique combination of service resource (index, indexer, etc.) and service principal used on a request triggers an authorization check. These authorization checks can add up to 200 milliseconds of latency to a request. 

+ In rare cases where requests originate from a high number of different service principals, all targeting different service resources (indexes, indexers, etc.), it's possible for the authorization checks to result in throttling. Throttling would only happen if hundreds of unique combinations of search service resource and service principal were used within a second.

## Configure role-based access for data plane

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token. 

### [**Azure portal**](#tab/config-svc-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Keys** in the left navigation pane.

   :::image type="content" source="media/search-create-service-portal/set-authentication-options.png" lightbox="media/search-create-service-portal/set-authentication-options.png" alt-text="Screenshot of the keys page with authentication options." border="true":::

1. Choose an **API access control** option. We recommend **Both** if you want flexibility or need to migrate apps. 

   | Option | Description |
   |--------|--------------|
   | API Key | (default). Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. |
   | Both | Requests are valid using either an API key or role-based access control. |

The change is effective immediately, but wait a few seconds before testing. 

All network calls for search service operations and content respect the option you select: API keys, bearer token, or either one if you select **Both**.

When you enable role-based access control in the portal, the failure mode is "http401WithBearerChallenge" if authorization fails.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API [Create or Update Service](/rest/api/searchmanagement/services/create-or-update) to configure your service for role-based access control.

All calls to the Management REST API are authenticated through Microsoft Entra ID, with Contributor or Owner permissions. For help with setting up authenticated requests in Postman, see [Manage Azure AI Search using REST](search-manage-rest.md).

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

1. Follow the instructions in the next step to assign roles for data plane operations.

---

## Assign roles

Role assignments are cumulative and pervasive across all tools and client libraries. You can assign roles using any of the [supported approaches](../role-based-access-control/role-assignments-steps.md) described in Azure role-based access control documentation.

You must be an **Owner** or have [Microsoft.Authorization/roleAssignments/write](/azure/templates/microsoft.authorization/roleassignments) permissions to manage role assignments.

### [**Azure portal**](#tab/roles-portal)

Role assignments in the portal are service-wide. If you want to [grant permissions to a single index](#rbac-single-index), use PowerShell or the Azure CLI instead.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor
   + Search Index Data Contributor
   + Search Index Data Reader

1. On the **Members** tab, select the Microsoft Entra user or group identity.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

### [**PowerShell**](#tab/roles-powershell)

When [using PowerShell to assign roles](../role-based-access-control/role-assignments-powershell.md), call [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

Before you start, make sure to load the **Az** and **AzureAD** modules and connect to Azure:

```powershell
Import-Module -Name Az
Import-Module -Name AzureAD
Connect-AzAccount
```

This example creates a role assignment scoped to a search service:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>"
```

This example creates a role assignment scoped to a specific index:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
```

Recall that you can only scope access to top-level resources, such as indexes, synonym maps, indexers, data sources, and skillsets. You can't control access to search documents (index content) with Azure roles.

---

## Test role assignments

Use a client to test role assignments. Remember that roles are cumulative and inherited roles that are scoped to the subscription or resource group can't be deleted or denied at the resource (search service) level. 

Make sure that you [register your client application with Microsoft Entra ID](search-howto-aad.md) and have role assignments in place before testing access. 

### [**Azure portal**](#tab/test-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + Contributors can view and create any object, but can't query an index using Search Explorer.

   + Search Index Data Readers can use Search Explorer to query the index. You can use any API version to check for access. You should be able to send queries and view results, but you shouldn't be able to view the index definition.

   + Search Index Data Contributors can select **New Index** to create a new index. Saving a new index verifies write access on the service.

### [**REST API**](#tab/test-rest)

This approach assumes Postman as the REST client and uses a Postman collection and variables to provide the bearer token. Use Azure CLI or another tool to create a security principal for the REST client.

1. Open a command shell for Azure CLI and sign in to your Azure subscription.

   ```azurecli
   az login
   ```

1. Get your subscription ID. The ID is used as a variable in a future step. 

   ```azurecli
   az account show --query id -o tsv
   ````

1. Create a resource group for your security principal. This example uses the West US region. You provide this value as a variable in a future step. The role that you create is scoped to the resource group.

   ```azurecli
   az group create -l westus -n MyResourceGroup
   ```

1. Create the service principal, replacing the placeholder values with valid values for a security principal name, subscription ID, and resource group name. This example uses the "Search Index Data Reader" (quote enclosed) role.

    ```azurecli
    az ad sp create-for-rbac --name mySecurityPrincipalName --role "Search Index Data Reader" --scopes /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName
    ```

   A successful response includes "appId", "password", and "tenant". You use these values for the variables "clientId", "clientSecret", and "tenant".

1. Start a new Postman collection and edit its properties. In the Variables tab, create the following variables:

    | Variable | Description |
    |----------|-------------|
    | clientId | Provide the previously generated "appID" that you created in Microsoft Entra ID. |
    | clientSecret | Provide the "password" that was created for your client. |
    | tenantId | Provide the "tenant" that was returned in the previous step. |
    | subscriptionId | Provide the subscription ID for your subscription. |
    | resource | Enter `https://search.azure.com`. | 
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
                        { key: "resource", value: pm.collectionVariables.get("resource") || "https://search.azure.com", disabled: false }
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

1. Send a request that uses the variables you've specified. For the "Search Index Data Reader" role, you can query an index (remember to provide a valid search service name on the URI). You can use any [supported API version](/rest/api/searchservice/search-service-api-versions).

   ```http
   POST https://<service-name>.search.windows.net/indexes/hotels-quickstart/docs/search?api-version=2020-06-30
   {
    "queryType": "simple",
    "search": "motel",
    "filter": "",
    "select": "HotelName,Description,Category,Tags",
    "count": true
    }
   ```

For more information on how to acquire a token for a specific environment, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

### [**.NET**](#tab/test-csharp)

1. Use the [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents) package.

1. Use [Azure.Identity for .NET](/dotnet/api/overview/azure/identity-readme) for token authentication. Microsoft recommends [`DefaultAzureCredential()`](/dotnet/api/azure.identity.defaultazurecredential) for most scenarios.

   + When obtaining the OAuth token, the scope is "https://search.azure.com/.default". The SDK requires the audience to be "https://search.azure.com". The ".default" is a Microsoft Entra convention.

   + The SDK validates that the user has the "user_impersonation" scope, which must be granted by your app, but the SDK itself just asks for "https://search.azure.com/.default".

1. Here's an example of a client connection using `DefaultAzureCredential()`.

    ```csharp
    // Create a SearchIndexClient to send create/delete index commands
    SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, new DefaultAzureCredential());

    // Create a SearchClient to load and query documents
    SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, new DefaultAzureCredential());
    ```

1. Here's another example of using [client secret credential](/dotnet/api/azure.core.tokencredential):

    ```csharp
    var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
    SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, tokenCredential);
    ```

### [**Python**](#tab/test-python)

1. Use [azure.search.documents (Azure SDK for Python) version 11.3](https://pypi.org/project/azure-search-documents/).

1. Use [Azure.Identity for Python](/python/api/overview/azure/identity-readme) for token authentication.

1. Use [DefaultAzureCredential](/python/api/overview/azure/identity-readme?view=azure-python#authenticate-with-defaultazurecredential&preserve-view=true) if the Python client is an application that executes server-side. Enable [interactive authentication](/python/api/overview/azure/identity-readme?view=azure-python#enable-interactive-authentication-with-defaultazurecredential&preserve-view=true) if the app runs in a browser.

1. Here's an example:

    ```python
    from azure.search.documents import SearchClient
    from azure.identity import DefaultAzureCredential
    
    credential = DefaultAzureCredential()
    endpoint = "https://<mysearch>.search.windows.net"
    index_name = "myindex"
    client = SearchClient(endpoint=endpoint, index_name=index_name, credential=credential)
    ```

### [**JavaScript**](#tab/test-javascript)

1. Use [@azure/search-documents (Azure SDK for JavaScript), version 11.3](https://www.npmjs.com/package/@azure/search-documents).

1. Use [Azure.Identity for JavaScript](/javascript/api/overview/azure/identity-readme) for token authentication.

1. If you're using React, use `InteractiveBrowserCredential` for Microsoft Entra authentication to Search. See [When to use `@azure/identity`](/javascript/api/overview/azure/identity-readme?view=azure-node-latest#when-to-use&preserve-view=true) for details.

### [**Java**](#tab/test-java)

1. Use [azure-search-documents (Azure SDK for Java)](https://central.sonatype.com/artifact/com.azure/azure-search-documents).

1. Use [Azure.Identity for Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true) for token authentication.

1. Microsoft recommends [DefaultAzureCredential](/java/api/overview/azure/identity-readme?view=azure-java-stable#defaultazurecredential&preserve-view=true) for apps that run on Azure.

---

## Test as current user

If you're already a Contributor or Owner of your search service, you can present a bearer token for your user identity for authentication to Azure AI Search. The following instructions explain how to set up a Postman collection to send requests as the current user.

1. Get a bearer token for the current user:

    ```azurecli
    az account get-access-token https://search.azure.com/.default
    ```

1. Start a new Postman collection and edit its properties. In the **Variables** tab, create the following variable:

    | Variable | Description |
    |----------|-------------|
    | bearerToken | (copy-paste from get-access-token output on the command line) |

1. In the Authorization tab, select **Bearer Token** as the type.

1. In the **Token** field, specify the variable placeholder `{{bearerToken}}`.

1. Save the collection.

1. Send a request to confirm access. Here's one that queries the hotels-quickstart index:

   ```http
   POST https://<service-name>.search.windows.net/indexes/hotels-quickstart/docs/search?api-version=2020-06-30
   {
    "queryType": "simple",
    "search": "motel",
    "filter": "",
    "select": "HotelName,Description,Category,Tags",
    "count": true
    }
   ```

<a name="rbac-single-index"></a>

## Grant access to a single index

In some scenarios, you may want to limit application's access to a single resource, such as an index. 

The portal doesn't currently support role assignments at this level of granularity, but it can be done with [PowerShell](../role-based-access-control/role-assignments-powershell.md) or the [Azure CLI](../role-based-access-control/role-assignments-cli.md).

In PowerShell, use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

1. Load the Azure and AzureAD modules and connect to your Azure account:

   ```powershell
   Import-Module -Name Az
   Import-Module -Name AzureAD
   Connect-AzAccount
   ```

1. Add a role assignment scoped to an individual index:

   ```powershell
   New-AzRoleAssignment -ObjectId <objectId> `
       -RoleDefinitionName "Search Index Data Contributor" `
       -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
   ```

## Create a custom role

If [built-in roles](#built-in-roles-used-in-search) don't provide the right combination of permissions, you can create a [custom role](../role-based-access-control/custom-roles.md) to support the operations you require

This example clones **Search Index Data Reader** and then adds the ability to list indexes by name. Normally, listing the indexes on a search service is considered an administrative right.

### [**Azure portal**](#tab/custom-role-portal)

These steps are derived from [Create or update Azure custom roles using the Azure portal](../role-based-access-control/custom-roles-portal.md). Cloning from an existing role is supported in a search service page.

These steps create a custom role that augments search query rights to include listing indexes by name. Typically, listing indexes is considered an admin function.

1. In the Azure portal, navigate to your search service.

1. In the left-navigation pane, select **Access Control (IAM)**.

1. In the action bar, select **Roles**.

1. Right-click **Search Index Data Reader** (or another role) and select **Clone** to open the **Create a custom role** wizard.

1. On the Basics tab, provide a name for the custom role, such as "Search Index Data Explorer", and then select **Next**.

1. On the Permissions tab, select **Add permission**.

1. On the Add permissions tab, search for and then select the **Microsoft Search** tile.

1. Set the permissions for your custom role. At the top of the page, using the default **Actions** selection:

   + Under Microsoft.Search/operations, select **Read : List all available operations**. 
   + Under Microsoft.Search/searchServices/indexes, select **Read : Read Index**.

1. On the same page, switch to **Data actions** and under Microsoft.Search/searchServices/indexes/documents, select **Read : Read Documents**.

   The JSON definition looks like the following example:

   ```json
   {
    "properties": {
        "roleName": "search index data explorer",
        "description": "",
        "assignableScopes": [
            "/subscriptions/a5b1ca8b-bab3-4c26-aebe-4cf7ec4791a0/resourceGroups/heidist-free-search-svc/providers/Microsoft.Search/searchServices/demo-search-svc"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Search/operations/read",
                    "Microsoft.Search/searchServices/indexes/read"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.Search/searchServices/indexes/documents/read"
                ],
                "notDataActions": []
            }
        ]
      }
    }
    ```

1. Select **Review + create** to create the role. You can now assign users and groups to the role.

### [**Azure PowerShell**](#tab/custom-role-ps)

The PowerShell example shows the JSON syntax for creating a custom role that's a clone of **Search Index Data Reader**, but withe ability to list all indexes by name.

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need. For this example, you'll need the following:

   ```json
   "Microsoft.Search/operations/read",
   "Microsoft.Search/searchServices/read",
   "Microsoft.Search/searchServices/indexes/read"
   ```

1. Set up a PowerShell session to create the custom role. For detailed instructions, see [Azure PowerShell](../role-based-access-control/custom-roles-powershell.md)

1. Provide the role definition as a JSON document. The following example shows the syntax for creating a custom role with PowerShell.

```json
{
  "Name": "Search Index Data Explorer",
  "Id": "88888888-8888-8888-8888-888888888888",
  "IsCustom": true,
  "Description": "List all indexes on the service and query them.",
  "Actions": [
      "Microsoft.Search/operations/read",
      "Microsoft.Search/searchServices/read"
  ],
  "NotActions": [],
  "DataActions": [
      "Microsoft.Search/searchServices/indexes/read"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}"
  ]
}
```

> [!NOTE]
> If the assignable scope is at the index level, the data action should be `"Microsoft.Search/searchServices/indexes/documents/read"`.

### [**REST API**](#tab/custom-role-rest)

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need.

1. See [Create or update Azure custom roles using the REST API](../role-based-access-control/custom-roles-rest.md) for steps.

1. Clone or create a role, or use JSON to specify the custom role (see the PowerShell tab for JSON syntax).

### [**Azure CLI**](#tab/custom-role-cli)

1. Review the [list of atomic permissions](../role-based-access-control/resource-provider-operations.md#microsoftsearch) to determine which ones you need.

1. See [Create or update Azure custom roles using Azure CLI](../role-based-access-control/custom-roles-cli.md) for steps.

1. Clone or create a role, or use JSON to specify the custom role (see the PowerShell tab for JSON syntax).

---

## Disable API key authentication

API keys can't be deleted, but they can be disabled on your service if you're using the Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader roles and Microsoft Entra authentication. Disabling API keys causes the search service to refuse all data-related requests that pass an API key in the header.

Owner or Contributor permissions are required to disable features.

To disable [key-based authentication](search-security-api-keys.md), use Azure portal or the Management REST API.

### [**Portal**](#tab/disable-keys-portal)

1. In the Azure portal, navigate to your search service.

1. In the left-navigation pane, select **Keys**.

1. Select **Role-based access control**.

The change is effective immediately, but wait a few seconds before testing. Assuming you have permission to assign roles as a member of Owner, service administrator, or co-administrator, you can use portal features to test role-based access.

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

## Conditional Access

[Conditional Access](../active-directory/conditional-access/overview.md) is a tool in Microsoft Entra ID used to enforce organizational policies. By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure. When accessing an Azure AI Search service using role-based access control, Conditional Access can enforce organizational policies.

To enable a Conditional Access policy for Azure AI Search, follow the below steps:

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. Search for **Microsoft Entra Conditional Access**.

1. Select **Policies**.

1. Select **+ New policy**.

1. In the **Cloud apps or actions** section of the policy, add **Azure AI Search** as a cloud app depending on how you want to set up your policy.

1. Update the remaining parameters of the policy. For example, specify which users and groups this policy applies to. 

1. Save the policy.

> [!IMPORTANT]
> If your search service has a managed identity assigned to it, the specific search service will show up as a cloud app that can be included or excluded as part of the Conditional Access policy. Conditional Access policies can't be enforced on a specific search service. Instead make sure you select the general **Azure AI Search** cloud app.
