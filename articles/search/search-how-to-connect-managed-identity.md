---
title: Create a managed identity
titleSuffix: Azure Cognitive Search
description: Create a managed identity for your search service for Azure Active Directory authentication to other cloud services.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 02/08/2022
---

# Connect a search service to other Azure resources using a managed identity

You can configure an Azure Cognitive Search service to connect to other Azure resources under a [system-assigned or user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) that's assigned to a role on the remote service.

## Prerequisites

+ A search service at the [Basic tier or above](search-sku-tier.md).

+ Azure resources that accept requests from a managed identity having a valid role assignment

## Supported scenarios

Connections using a user-assigned managed identity require an "identity" property. Currently, only indexer data sources support this property.

| Scenario | System managed identity | User managed identity (preview) |
|----------|-------------------------|---------------------------------|
| Indexer connections to supported Azure data sources | Yes | Yes |
| Azure Key Vault for customer-managed keys | Yes | No |
| [Debug sessions](cognitive-search-debug-session.md) in Azure Storage | Yes | No |
| Enrichment cache in Azure Storage | Yes <sup>1</sup>| No |
| Knowledge Store in Azure Storage | Yes | No |
| Custom skills | Yes | No |

<sup>1</sup> The Import data wizard doesn't currently accept a system managed identity connection string for incremental enrichment, but after the wizard completes, you can update the indexer JSON definition to include the connection string, and then rerun the indexer.

## Create a system managed identity

A system-assigned managed identity is unique to your search service and bound to the service for its lifetime.

1. [Sign in to Azure portal](https://portal.azure.com) and [find your search service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. Under **Settings**, select **Identity**.

1. On the **System assigned** tab, under **Status**, select **On**.

1. Select **Save**.

   :::image type="content" source="media/search-managed-identities/turn-on-system-assigned-identity.png" alt-text="Screenshot of the Identity page in Azure portal." border="true":::

   After saving, you'll see an object identifier that's been assigned to your search service.

   :::image type="content" source="media/search-managed-identities/system-assigned-identity-object-id.png" alt-text="Screenshot of a system identity object identifier." border="true":::

## Create a user managed identity (preview)

A user-assigned managed identity is useful if you need more precision in role assignments. You can create separate identifies for different applications and scenarios.

> [!IMPORTANT]
>This feature is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The REST API version 2021-04-30-Preview and [Management REST API 2021-04-01-Preview](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) provide this feature.

### [**Azure portal**](#tab/portal)

1. [Sign in to Azure portal](https://portal.azure.com/)

1. Select **+ Create a resource**.

1. In the "Search services and marketplace" search bar, search for "User Assigned Managed Identity" and then select **Create**.

   :::image type="content" source="media/search-managed-identities/user-assigned-managed-identity.png" alt-text="Screenshot of the user assigned managed identity tile in Azure marketplace.":::

1. Select the subscription, resource group, and region. Give the identity a descriptive name.

1. Select **Create** and wait for the resource to finish deploying. 

   In the next several steps, you'll assign the user managed identity to your search service.

1. In your search service page, under **Settings**, select **Identity**.

1. On the **User assigned** tab, select **Add**.

1. Choose the subscription and then select the user-assigned managed resource that you created in the previous step.

### [**REST API**](#tab/rest)

You can use the Management REST API instead of the portal to assign a managed identity. Be sure to use the [2021-04-01-preview management API](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update) for this task.

1. Formulate a request to [Create or Update a search service](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update).

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

If your Azure resource is behind a firewall, make sure there's an exception for connections from a trusted service.

The following steps are for Azure Storage. If your resource is Cosmos DB or Azure SQL, the steps will be similar.

1. [Sign in to Azure portal](https://portal.azure.com) and [find your storage account](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. Under **Security + networking**, select **Networking**.

1. On the **Firewalls and virtual networks** tab, allow access from **Selected networks**.

1. Scroll down to the **Exceptions** section.

1. Make sure the checkbox is selected for **Allow Azure services on the trusted services list to access this storage account**.

   :::image type="content" source="media\search-indexer-howto-secure-access\exception.png" alt-text="Screenshot of the firewall and networking page for Azure Storage in the portal." border="true":::

1. Select **Save** at the top of the page.

## Assign a role

A managed identity must be paired with an Azure role that determines permissions on the Azure resource. 

+ For indexer data connections and Azure Key Vault, the role must grant data reader rights. 

+ For AI enrichment features, the search service submits data for processing or storage on the Azure resource. Write permissions are required for AI enrichment. 

The following steps are for Azure Storage. If your resource is Cosmos DB or Azure SQL, the steps will be similar.

1. [Sign in to Azure portal](https://portal.azure.com) and [find your Azure resource](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) to which the search service must have access.

1. In Azure Storage, select **Access control** on the left navigation pane.

1. Select **Add role assignment**.

1. On the **Role** page, choose a role:

   + **Storage Blob Data Contributor** grants write permissions necessary for debug sessions, knowledge store, and enrichment cache.
   + **Storage Blob Data Reader** grants read permissions for indexer access to content in Blob Storage and Azure Data Lake Storage Gen2.
   + **Reader and Data Access** grants read permissions for indexer access to content in Azure Table Storage and Azure File Storage.

1. On the **Members** page, select **Managed Identity**.

1. Select members. In the **Select managed identity** page, choose your subscription and then filter by service type, and then select the service. Only those services that have a managed identity will be available to select.

   :::image type="content" source="media/search-managed-identities/add-role-assignment-storage-managed-identity.png" alt-text="Screenshot of the select managed identity pane in the role assignment wizard." border="true":::

1. Select **Review + assign**.

## Connection strings for managed identities

Once a managed identity is defined and given a role assignment, outbound connections use it in connection strings. Here are some examples of connection strings for various scenarios.

**Blob data source (system):**

A container name is specified in the "container" property (not shown), not the connection string.

```json
"credentials": {
    "connectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name};"
    }
```

**Blob data source (user):**

A user-assigned managed identity is specified in the "identity" property, currently only supported for indexer data sources.

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

**Knowledge store:**

Container and table names are part of a projection definition, not the connection string.

```json
"knowledgeStore": {
  "storageConnectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/storage-account-name};",
```

**Enrichment cache:**

An indexer creates, uses, and remembers the container used for the cache. It's not necessary to include the container in the connection string.

```json
"cache": {
  "id": "{object-id}",
  "enableReprocessing": true,
  "storageConnectionString": "ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/storage-account-name};"
},
```

**Debug session:**

A debug session targets a container. Be sure to include the name of an existing container in the connection string. You can paste a string similar to the following example in the debug session that you start up in the portal.

```json
"ResourceId=/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}/{container-name};",
```

## See also

+ [Security overview](search-security-overview.md)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Indexers overview](search-indexer-overview.md)
