---
title: Connect using Azure roles
titleSuffix: Azure Cognitive Search
description: Use Azure role-based access control for granular permissions on service administration and content tasks.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/14/2023
ms.custom: subject-rbac-steps, references_regions
---

# Connect to Azure Cognitive Search using Azure role-based access control (Azure RBAC)

Azure provides a global [role-based access control authorization system](../role-based-access-control/role-assignments-portal.md) for all services running on the platform. In Cognitive Search, you can:

+ Use generally available roles for service administration.

+ Use new preview roles for data requests, including creating, loading, and querying indexes.

Per-user access over search results (sometimes referred to as row-level security or document-level security) isn't supported. As a workaround, [create security filters](search-security-trimming-for-azure-search.md) that trim results by user identity, removing documents for which the requestor shouldn't have access.

## Built-in roles used in Search

Built-in roles include generally available and preview roles. If these roles are insufficient, [create a custom role](#create-a-custom-role) instead.

| Role | Description and availability |
| ---- | ---------------------------- |
| [Owner](../role-based-access-control/built-in-roles.md#owner) | (Generally available) Full access to the search resource, including the ability to assign Azure roles. Subscription administrators are members by default.</br></br> (Preview) This role has the same access as the Search Service Contributor role on the data plane. It includes access to all data plane actions except the ability to query the search index or index documents. |
| [Contributor](../role-based-access-control/built-in-roles.md#contributor) | (Generally available) Same level of access as Owner, minus the ability to assign roles or change authorization options. </br></br> (Preview) This role has the same access as the Search Service Contributor role on the data plane. It includes access to all data plane actions except the ability to query the search index or index documents. |
| [Reader](../role-based-access-control/built-in-roles.md#reader) | (Generally available) Limited access to partial service information. In the portal, the Reader role can access information in the service Overview page, in the Essentials section and under the Monitoring tab. All other tabs and pages are off limits. </br></br>This role has access to service information: service name, resource group, service status, location, subscription name and ID, tags, URL, pricing tier, replicas, partitions, and search units. This role also has access to service metrics: search latency, percentage of throttled requests, average queries per second. </br></br>This role doesn't allow access to API keys, role assignments, content (indexes or synonym maps), or content metrics (storage consumed, number of objects). </br></br> (Preview) When you enable the RBAC preview for the data plane, the Reader role has read access across the entire service. This allows you to read search metrics, content metrics (storage consumed, number of objects), and the definitions of data plane resources (indexes, indexers, etc.). The Reader role still won't have access to read API keys or read content within indexes. |
| [Search Service Contributor](../role-based-access-control/built-in-roles.md#search-service-contributor) | (Generally available) This role is identical to the Contributor role and applies to control plane operations. </br></br>(Preview) When you enable the RBAC preview for the data plane, this role also provides full access to all data plane actions on indexes, synonym maps, indexers, data sources, and skillsets as defined by [`Microsoft.Search/searchServices/*`](../role-based-access-control/resource-provider-operations.md#microsoftsearch). This role doesn't give you access to query search indexes or index documents. This role is for search service administrators who need to manage the search service and its objects, but without the ability to view or access object data. </br></br>Like Contributor, members of this role can't make or manage role assignments or change authorization options. To use the preview capabilities of this role, your service must have the preview feature enabled, as described in this article. |
| [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) | (Preview) Provides full data plane access to content in all indexes on the search service. This role is for developers or index owners who need to import, refresh, or query the documents collection of an index. |
| [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) | (Preview) Provides read-only data plane access to search indexes on the search service. This role is for apps and users who run queries. |

> [!NOTE]
> Azure resources have the concept of [control plane and data plane](../azure-resource-manager/management/control-plane-and-data-plane.md) categories of operations. In Cognitive Search, "control plane" refers to any operation supported in the [Management REST API](/rest/api/searchmanagement/) or equivalent client libraries. The "data plane" refers to operations against the search service endpoint, such as indexing or queries, or any other operation specified in the [Search REST API](/rest/api/searchservice/) or equivalent client libraries.

<a name="preview-limitations"></a>

## Preview capabilities and limitations

+ Role-based access control for data plane operations, such as creating an index or querying an index, is currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

+ There are no regional, tier, or pricing restrictions for using Azure RBAC preview, but your search service must be in the Azure public cloud. The preview isn't available in Azure Government, Azure Germany, or Azure China 21Vianet.

+ If you migrate your Azure subscription to a new tenant, the Azure RBAC preview will need to be re-enabled. 

+ Adoption of role-based access control might increase the latency of some requests. Each unique combination of service resource (index, indexer, etc.) and service principal used on a request will trigger an authorization check. These authorization checks can add up to 200 milliseconds of latency to a request. 

+ In rare cases where requests originate from a high number of different service principals, all targeting different service resources (indexes, indexers, etc.), it's possible for the authorization checks to result in throttling. Throttling would only happen if hundreds of unique combinations of search service resource and service principal were used within a second.

+ Role-based access control is supported in Azure portal and in the following search clients: 

  + [Search REST APIs](/rest/api/searchservice/) (all supported versions)
  + [azure.search.documents (Azure SDK for .NET) version 11.4](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md)
  + [azure.search.documents (Azure SDK for Python) version 11.3](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/search/azure-search-documents/CHANGELOG.md)
  + [azure-search-documents (Azure SDK for Java) beta versions of 11.5 and 11.6](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/search/azure-search-documents/CHANGELOG.md),
  + [@azure/search-documents (Azure SDK for JavaScript), version 11.3 (see change log)](https://www.npmjs.com/package/@azure/search-documents?activeTab=explore).

## Configure role-based access for data plane

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token. 

### [**Azure portal**](#tab/config-svc-portal)

1. [Sign in to Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Keys** in the left navigation pane.

   :::image type="content" source="media/search-create-service-portal/set-authentication-options.png" lightbox="media/search-create-service-portal/set-authentication-options.png" alt-text="Screenshot of the keys page with authentication options." border="true":::

1. Choose an **API access control** option. We recommend **Both** if you want flexibility or need to migrate apps. 

   | Option | Status | Description |
   |--------|--------|-------------|
   | API Key | Generally available (default) | Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Preview | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. |
   | Both | Preview | Requests are valid using either an API key or role-based access control. |

The change is effective immediately, but wait a few seconds before testing. 

All network calls for search service operations and content will respect the option you select: API keys, bearer token, or either one if you select **Both**.

When you enable role-based access control in the portal, the failure mode will be "http401WithBearerChallenge" if authorization fails.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API version 2021-04-01-Preview, [Create or Update Service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update), to configure your service.

All calls to the Management REST API are authenticated through Azure Active Directory, with Contributor or Owner permissions. For help setting up authenticated requests in Postman, see [Manage Azure Cognitive Search using REST](search-manage-rest.md).

1. Get service settings so that you can review the current configuration.

   ```http
   GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2021-04-01-preview
   ```

1. Use PATCH to update service configuration. The following modifications enable both keys and role-based access. If you want a roles-only configuration, see [Disable API keys](#disable-api-key-authentication).

   Under "properties", set ["authOptions"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey". The "disableLocalAuth" property must be false to set "authOptions".

   Optionally, set ["aadAuthFailureMode"](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#aadauthfailuremode) to specify whether 401 is returned instead of 403 when authentication fails. Valid values are "http401WithBearerChallenge" or "http403".

    ```http
    PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
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

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor (preview for data plane requests)
   + Search Index Data Contributor (preview)
   + Search Index Data Reader (preview)

1. On the **Members** tab, select the Azure AD user or group identity.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

### [**PowerShell**](#tab/roles-powershell)

When [using PowerShell to assign roles](../role-based-access-control/role-assignments-powershell.md), call [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

Before you start, make sure you load the Az and AzureAD modules and connect to Azure:

```powershell
Import-Module -Name Az
Import-Module -Name AzureAD
Connect-AzAccount
```

Scoped to the service, your syntax should look similar to the following example:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>"
```

Scoped to an individual index:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
```

Recall that you can only scope access to top-level resources, such as indexes, synonym maps, indexers, data sources, and skillsets. You can't control access to search documents (index content) with Azure roles.

---

## Test role assignments

When testing roles, remember that roles are cumulative and inherited roles that are scoped to the subscription or resource group can't be deleted or denied at the resource (search service) level. 

### [**Azure portal**](#tab/test-portal)

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. On the Overview page, select the **Indexes** tab:

   + Members of the Contributor role can view and create any object, but can't query an index using Search Explorer.

   + Members of Search Index Data Reader can use Search Explorer to query the index. You can use any API version to check for access. You should be able to issue queries and view results, but you shouldn't be able to view the index definition.

   + Members of Search Index Data Contributor can select **New Index** to create a new index. Saving a new index will verify write access on the service.

### [**REST API**](#tab/test-rest)

This approach assumes Postman as the REST client and uses a Postman collection and variables to provide the bearer token. You'll need Azure CLI or another tool to create a security principal for the REST client.

1. Open a command shell for Azure CLI and sign in to your Azure subscription.

   ```azurecli
   az login
   ```

1. Get your subscription ID. You'll provide this value as variable in a future step. 

   ```azurecli
   az account show --query id -o tsv
   ````

1. Create a resource group for your security principal, specifying a location and name. This example uses the West US region. You'll provide this value as variable in a future step. The role you'll create will be scoped to the resource group.

   ```azurecli
   az group create -l westus -n MyResourceGroup
   ```

1. Create the service principal, replacing the placeholder values with valid values. You'll need a descriptive security principal name, subscription ID, and resource group name. This example uses the "Search Index Data Reader" (quote enclosed) role.

    ```azurecli
    az ad sp create-for-rbac --name mySecurityPrincipalName --role "Search Index Data Reader" --scopes /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName
    ```

   A successful response includes "appId", "password", and "tenant". You'll use these values for the variables "clientId", "clientSecret", and "tenant".

1. Start a new Postman collection and edit its properties. In the Variables tab, create the following variables:

    | Variable | Description |
    |----------|-------------|
    | clientId | Provide the previously generated "appID" that you created in Azure AD. |
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

### [**.NET SDK**](#tab/test-csharp)

See [Authorize access to a search app using Azure Active Directory](search-howto-aad.md) for instructions that create an identity for your client app, assign a role, and call [DefaultAzureCredential()](/dotnet/api/azure.identity.defaultazurecredential).

The Azure SDK for .NET supports an authorization header in the [NuGet Gallery | Azure.Search.Documents 11.4.0](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0) package. Configuration is required to register an application with Azure Active Directory, and to obtain and pass authorization tokens:

+ When obtaining the OAuth token, the scope is "https://search.azure.com/.default". The SDK requires the audience to be "https://search.azure.com". The ".default" is an Azure AD convention.

+ The SDK validates that the user has the "user_impersonation" scope, which must be granted by your app, but the SDK itself just asks for "https://search.azure.com/.default".

Example of using [client secret credential](/dotnet/api/azure.core.tokencredential):

```csharp
var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, tokenCredential);
```

More details about using [Azure AD authentication with the Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity) are available in the SDK's GitHub repo.

> [!NOTE]
> If you get a 403 error, verify that your search service is enrolled in the preview program and that your service is configured for preview role assignments.

---

## Test as current user

If you're already a Contributor or Owner of your search service, you can present a bearer token for your user identity for authentication to Azure Cognitive Search. The following instructions explain how to set up a Postman collection to send requests as the current user.

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

API keys can't be deleted, but they can be disabled on your service if you're using the Search Service Contributor, Search Index Data Contributor, and Search Index Data Reader roles and Azure AD authentication. Disabling API keys causes the search service to refuse all data-related requests that pass an API key in the header.

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
   GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2021-04-01-preview
   ```

1. Use PATCH to update service configuration. The following modification will set "authOptions" to null.

    ```http
    PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
        "properties": {
            "disableLocalAuth": true
        }
    }
    ```

Requests that include an API key only, with no bearer token, will fail with an HTTP 401.

To re-enable key authentication, rerun the last request, setting "disableLocalAuth" to false. The search service will resume acceptance of API keys on the request automatically (assuming they're specified).

---

## Conditional Access

[Conditional Access](../active-directory/conditional-access/overview.md) is a tool in Azure Active Directory used to enforce organizational policies. By using Conditional Access policies, you can apply the right access controls when needed to keep your organization secure. When accessing an Azure Cognitive Search service using role-based access control, Conditional Access can enforce organizational policies.

To enable a Conditional Access policy for Azure Cognitive Search, follow the below steps:

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. Search for **Azure AD Conditional Access**.

1. Select **Policies**.

1. Select **+ New policy**.

1. In the **Cloud apps or actions** section of the policy, add **Azure Cognitive Search** as a cloud app depending on how you want to set up your policy.

1. Update the remaining parameters of the policy. For example, specify which users and groups this policy applies to. 

1. Save the policy.

> [!IMPORTANT]
> If your search service has a managed identity assigned to it, the specific search service will show up as a cloud app that can be included or excluded as part of the Conditional Access policy. Conditional Access policies can't be enforced on a specific search service. Instead make sure you select the general **Azure Cognitive Search** cloud app.
