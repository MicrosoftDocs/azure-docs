---
title: Connect using a managed identity
titleSuffix: Azure AI Search
description: Create a managed identity for your search service and use Microsoft Entra authentication and role-based-access controls for connections to other cloud services.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 12/18/2023
---

# Connect a search service to other Azure resources using a managed identity

You can configure an Azure AI Search service to connect to other Azure resources using a [system-assigned or user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) and an Azure role assignment. Managed identities and role assignments eliminate the need for passing secrets and credentials in a connection string or code.

## Prerequisites

+ A search service at the [Basic tier or above](search-sku-tier.md).

+ An Azure resource that accepts incoming requests from a Microsoft Entra login that has a valid role assignment.

## Supported scenarios

Azure AI Search can use a system-assigned or user-assigned managed identity on outbound connections to Azure resources. A system managed identity is indicated when a connection string is the unique resource ID of a Microsoft Entra ID-aware service or application. A user-assigned managed identity is specified through an "identity" property.

A search service uses Azure Storage as an indexer data source and as a data sink for debug sessions, enrichment caching, and knowledge store. For search features that write back to storage, the managed identity needs a contributor role assignment as described in the ["Assign a role"](#assign-a-role) section. 

| Scenario | System managed identity | User-assigned managed identity (preview) |
|----------|-------------------------|---------------------------------|
| [Indexer connections to supported Azure data sources](search-indexer-overview.md) <sup>1</sup><sup>3</sup>| Yes | Yes |
| [Azure Key Vault for customer-managed keys](search-security-manage-encryption-keys.md) | Yes | Yes |
| [Debug sessions (hosted in Azure Storage)](cognitive-search-debug-session.md)	<sup>1</sup> | Yes | No |
| [Enrichment cache (hosted in Azure Storage)](search-howto-incremental-index.md) <sup>1,</sup> <sup>2</sup> | Yes | Yes |
| [Knowledge Store (hosted in Azure Storage)](knowledge-store-create-rest.md) <sup>1</sup>| Yes | Yes |
| [Custom skills (hosted in Azure Functions or equivalent)](cognitive-search-custom-skill-interface.md) | Yes | Yes |

<sup>1</sup> For connectivity between search and storage, your network security configuration imposes constraints on which type of managed identity you can use. Only a system managed identity can be used for a same-region connection to storage via the trusted service exception or resource instance rule. See [Access to a network-protected storage account](search-indexer-securing-resources.md#access-to-a-network-protected-storage-account) for details.

<sup>2</sup> One method for specifying an enrichment cache is in the Import data wizard. Currently, the wizard doesn't accept a managed identity connection string for enrichment cache. However, after the wizard completes, you can update the connection string in the indexer JSON definition to specify either a system or user-assigned managed identity, and then rerun the indexer.

<sup>3</sup> Note that [disabling keys in the Azure storage account](/storage/common/shared-key-authorization-prevent) is not currently supported for Azure Table used as a data source. Although managed identity is used to not provide the storage keys explicitly, the AI search service still uses the keys for this implementation. 

## Create a system managed identity

When a system-assigned managed identity is enabled, Azure creates an identity for your search service that can be used to authenticate to other Azure services within the same tenant and subscription. You can then use this identity in Azure role-based access control (Azure RBAC) assignments that allow access to data during indexing.

A system-assigned managed identity is unique to your search service and bound to the service for its lifetime.

### [**Azure portal**](#tab/portal-sys)

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. Under **Settings**, select **Identity**.

1. On the **System assigned** tab, under **Status**, select **On**.

1. Select **Save**.

   :::image type="content" source="media/search-managed-identities/turn-on-system-assigned-identity.png" alt-text="Screenshot of the Identity page in Azure portal." border="true":::

   After saving, you'll see an object identifier that's been assigned to your search service. 

   :::image type="content" source="media/search-managed-identities/system-assigned-identity-object-id.png" alt-text="Screenshot of a system identity object identifier." border="true":::

### [**REST API**](#tab/rest-sys)

See [Create or Update Service (Management REST API)](/rest/api/searchmanagement/services/create-or-update#searchcreateorupdateservicewithidentity).

You can use the Management REST API instead of the portal to assign a user-assigned managed identity.

1. Formulate a request to [Create or Update a search service](/rest/api/searchmanagement/services/create-or-update).

    ```http
    PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Search/searchServices/mysearchservice?api-version=2023-11-01
    {
      "location": "[region]",
      "sku": {
        "name": "[sku]"
      },
      "properties": {
        "replicaCount": [replica count],
        "partitionCount": [partition count],
        "hostingMode": "default"
      },
      "identity": {
        "type": "SystemAssigned"
      }
    } 
    ```

1. Confirmation and an object identifier for the system managed identity is returned in the response.

### [**Azure PowerShell**](#tab/ps-sys)

See [Create a search service with a system-assigned managed identity (Azure PowerShell](search-manage-powershell.md#create-a-service-with-a-system-assigned-managed-identity).

### [**Azure CLI**](#tab/cli-sys)

See [Create a search service with a system-assigned managed identity (Azure CLI)](search-manage-azure-cli.md#create-a-service-with-a-system-assigned-managed-identity).

---

## Create a user-assigned managed identity (preview)

A user-assigned managed identity is a resource on Azure. It's useful if you need more granularity in role assignments because you can create separate identities for different applications and scenarios.

> [!IMPORTANT]
> This feature is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). User-assigned managed identities aren't currently supported for connections to a network-protected storage account. The search request currently requires a public IP address.

### [**Azure portal**](#tab/portal-user)

1. Sign in to the [Azure portal](https://portal.azure.com)

1. Select **+ Create a resource**.

1. In the "Search services and marketplace" search bar, search for "User Assigned Managed Identity" and then select **Create**.

   :::image type="content" source="media/search-managed-identities/user-assigned-managed-identity.png" alt-text="Screenshot of the user assigned managed identity tile in Azure Marketplace.":::

1. Select the subscription, resource group, and region. Give the identity a descriptive name.

1. Select **Create** and wait for the resource to finish deploying. 

   In the next several steps, you'll assign the user-assigned managed identity to your search service.

1. In your search service page, under **Settings**, select **Identity**.

1. On the **User assigned** tab, select **Add**.

1. Choose the subscription and then select the user-assigned managed resource that you created in the previous step.

### [**REST API**](#tab/rest-user)

You can use the Management REST API instead of the portal to assign a user-assigned managed identity. Be sure to use the 2021-04-01-preview version for this task.

1. Formulate a request to [Create or Update a search service](/rest/api/searchmanagement/services/create-or-update).

    ```http
    PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Search/searchServices/mysearchservice?api-version=2021-04-01-preview
    {
      "location": "[region]",
      "sku": {
        "name": "[sku]"
      },
      "properties": {
        "replicaCount": [replica count],
        "partitionCount": [partition count],
        "hostingMode": "default"
      },
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[name of managed identity]": {}
        }
      }
    } 
    ```

1. Set the "identity" property to specify a fully qualified managed identity:

   + "type" is the type of identity. Valid values are "SystemAssigned", "UserAssigned", or "SystemAssigned, UserAssigned" for both. A value of "None" will clear any previously assigned identities from the search service.

   + "userAssignedIdentities" includes the details of the user assigned managed identity. This identity [must already exist](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) before you can specify it in the Create or Update Service request.

---

## Allow firewall access

If your Azure resource is behind a firewall, make sure there's an inbound rule that admits requests from your search service. 

+ For same-region connections to Azure Blob Storage or Azure Data Lake Storage Gen2, use a system managed identity and the [trusted service exception](search-indexer-howto-access-trusted-service-exception.md). Optionally, you can configure a [resource instance rule](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances) to admit requests.

+ For all other resources and connections, [configure an IP firewall rule](search-indexer-howto-access-ip-restricted.md) that admits requests from Search. See [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md) for details.

## Assign a role

A managed identity must be paired with an Azure role that determines permissions on the Azure resource. 

+ Data reader permissions are needed for indexer data connections and for accessing a customer-managed key in Azure Key Vault.

+ Contributor (write) permissions are needed for AI enrichment features that use Azure Storage for hosting debug session data, enrichment caching, and long-term content storage in a knowledge store. 

The following steps are for Azure Storage. If your resource is Azure Cosmos DB or Azure SQL, the steps are similar.

1. Sign in to the [Azure portal](https://portal.azure.com) and [find your Azure resource](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) to which the search service must have access.

1. In Azure Storage, select **Access control (AIM)** on the left navigation pane.

1. Select **Add role assignment**.

1. On the **Role** page, select the roles needed for your search service:

   | Task | Role assignment |
   |------|-----------------|
   | Blob indexing using an indexer | Add **Storage Blob Data Reader** |
   | ADLS Gen2 indexing using an indexer | Add **Storage Blob Data Reader** |
   | Table indexing using an indexer | Add **Reader and Data Access** |
   | File indexing using an indexer | Add **Reader and Data Access** |
   | Write to a knowledge store | Add **Storage Blob DataContributor** for object and file projections, and **Reader and Data Access** for table projections. |
   | Write to an enrichment cache | Add **Storage Blob Data Contributor**  |
   | Save debug session state | Add **Storage Blob Data Contributor**  |

1. On the **Members** page, select **Managed Identity**.

1. Select members. In the **Select managed identity** page, choose your subscription and then filter by service type, and then select the service. Only those services that have a managed identity will be available to select.

   :::image type="content" source="media/search-managed-identities/add-role-assignment-storage-managed-identity.png" alt-text="Screenshot of the select managed identity pane in the role assignment wizard." border="true":::

1. Select **Review + assign**.

## Connection string examples

Once a managed identity is defined for the search service and given a role assignment, outbound connections can be modified to use the unique resource ID of the other Azure resource. Here are some examples of connection strings for various scenarios.

[**Blob data source (system):**](search-howto-managed-identities-storage.md)

An indexer data source includes a "credentials" property that determines how the connection is made to the data source. The following example shows a connection string specifying the unique resource ID of a storage account. Microsoft Entra ID will authenticate the request using the system managed identity of the search service. Notice that the connection string doesn't include a container. In a data source definition, a container name is specified in the "container" property (not shown), not the connection string.

```json
"credentials": {
    "connectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name};"
    }
```

[**Blob data source (user):**](search-howto-managed-identities-storage.md)

A search request to Azure Storage can also be made under a user-assigned managed identity, currently in preview. The search service user identity is specified in the "identity" property. You can use either the portal or the REST API preview version 2021-04-30-Preview to set the identity.

```json
"credentials": {
    "connectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name};"
    },
  . . .
"identity": {
    "@odata.type": "#Microsoft.Azure.Search.DataUserAssignedIdentity",
    "userAssignedIdentity": "/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user-assigned-managed-identity-name}"
  }
```

[**Knowledge store:**](knowledge-store-create-rest.md)

A knowledge store definition includes a connection string to Azure Storage. On Azure Storage, a knowledge store will create projections as blobs and tables. The connection string is the unique resource ID of your storage account. Notice that the string doesn't include containers or tables in the path. These are defined in the embedded projection definition, not the connection string.

```json
"knowledgeStore": {
  "storageConnectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/storage-account-name};"
}
```

[**Enrichment cache:**](search-howto-incremental-index.md)

An indexer creates, uses, and remembers the container used for the cached enrichments. It's not necessary to include the container in the cache connection string. You can find the object ID on the **Identity** page of your search service in the portal.

```json
"cache": {
  "enableReprocessing": true,
  "storageConnectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name};"
}
```

[**Debug session:**](cognitive-search-debug-session.md)

A debug session runs in the portal and takes a connection string when you start the session. You can paste a string similar to the following example.

```json
"ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}/{container-name};",
```

[**Custom skill:**](cognitive-search-custom-skill-interface.md)

A custom skill targets the endpoint of an Azure function or app hosting custom code. The endpoint is specified in the [custom skill definition](cognitive-search-custom-skill-web-api.md). The presence of the "authResourceId" tells the search service to connect using a managed identity, passing the application ID of the target function or app in the property.

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
  "description": "A custom skill that can identify positions of different phrases in the source text",
  "uri": "https://contoso.count-things.com",
  "authResourceId": "<Azure-AD-registered-application-ID>",
  "batchSize": 4,
  "context": "/document",
  "inputs": [ ... ],
  "outputs": [ ...]
}
```

## See also

+ [Security overview](search-security-overview.md)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Indexers overview](search-indexer-overview.md)
+ [Authenticate with Microsoft Entra ID](/azure/architecture/framework/security/design-identity-authentication)
+ [About managed identities (Microsoft Entra ID)](../active-directory/managed-identities-azure-resources/overview.md)
