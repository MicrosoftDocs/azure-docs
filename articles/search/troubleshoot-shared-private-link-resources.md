---
title: Troubleshooting shared private link resources
titleSuffix: Azure Cognitive Search
description: Troubleshooting guide for common problems when managing shared private link resources.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/30/2021
---

# Troubleshooting common issues with Shared Private Link Resources

Shared private link resources allow Azure Cognitive Search to make secure outbound connections to access customer resources. However, during the process of managing (create, delete, or update) these resources a few different types of errors might occur.

## Creating a shared private link resource

There are four distinct steps involved in creation of a shared private link resource:

1. Customer invokes the management plane [CreateOrUpdate API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update) on the Search Resource Provider (RP) with details of the shared private link resource to be created.

2. Search RP validates the request and if validate commences an asynchronous Azure Resource Manager operation (whose progress can be queried by the customer)

3. Search queries for the completion of the operation (which usually takes a few minutes). At this point, the shared private link resource would have a provisioning state of "Updating".

4. Once the operation completes successfully, a private endpoint (along with any DNS zones and mappings) is created. At this point, if the customer queries the state of the shared private link resource, it would have a provisioning state of "Succeeded".

![Steps involved in creating shared private link resources ](media\troubleshoot-shared-private-link-resources\shared-private-link-states.png)

Some common errors that occur during the creation phase are listed below.

### Request validation failures

+ Unsupported SKU: Shared private link resources can only be created for paid SKUs, free tier services are not supported.

+ Name validation: Shared private link resource names are restricted to only a certain set of characters. If the resource name contains any invalid characters, the request to create the resource will not be accepted.
The rules for naming a shared private link resource are:
  
  + Length should be between 1 to 60 characters.
  + Should only contain alphanumeric characters or the characters underscore (_), period (.) or hyphen (-)

+ `groupId` validation: The `groupId` specified as part of the request to create a shared private link resource should match (in both spelling and case) to the table below:

| Azure resource | Group ID | First available API version |
| --- | --- | --- |
| Azure Storage - Blob (or) ADLS Gen 2 | `blob`| `2020-08-01` |
| Azure Storage - Tables | `table`| `2020-08-01` |
| Azure Cosmos DB - SQL API | `Sql`| `2020-08-01` |
| Azure SQL Database | `sqlServer`| `2020-08-01` |
| Azure Database for MySQL (preview) | `mysqlServer`| `2020-08-01-Preview` |
| Azure Key Vault | `vault` | `2020-08-01` |
| Azure Functions (preview) | `sites` | `2020-08-01-Preview` |

Resources marked with "(preview)" are only available in preview management plane API versions and are not generally available yet. Any other `groupId` (or a `groupId` used in an API version that does not support it) would fail validation.

+ `privateLinkResourceId` type validation: Similar to `groupId`, Azure Cognitive Search validates that the "correct" resource type is specified in the `privateLinkResourceId`. The following are valid resource types:

| Azure resource | Resource type | First available API version |
| --- | --- | --- |
| Azure Storage | `Microsoft.Storage/storageAccounts`| `2020-08-01` |
| Azure Cosmos DB | `Microsoft.DocumentDb/databaseAccounts`| `2020-08-01` |
| Azure SQL Database | `Microsoft.Sql/servers`| `2020-08-01` |
| Azure Database for MySQL (preview) | `Microsoft.DBforMySQL/servers`| `2020-08-01-Preview` |
| Azure Key Vault | `Microsoft.KeyVault/vaults` | `2020-08-01` |
| Azure Functions (preview) | `Microsoft.Web/sites` | `2020-08-01-Preview` |

In addition, the specified `groupId` needs to be valid for the specified resource type. For example, `groupId` "blob" is valid for type "Microsoft.Storage/storageAccounts", it cannot be used with any other resource type. For a given search management API version, customers can find out the supported `groupId` and resource type details by utilizing the [List supported API](/rest/api/searchmanagement/2021-04-01-preview/private-link-resources/list-supported).

+ Quota limit enforcement: Search services have quotas imposed on the distinct number of shared private link resources that can be created and the number of various target resource types that are being used (based on `groupId`). These are documented in the [Shared private link resource limits section](search-limits-quotas-capacity.md#shared-private-link-resource-limits) of the Azure Cognitive Search service limits page.

### Azure Resource Manager deployment failures

A search service initiates the request to create a shared private link, but Azure Resource Manager performs the actual work. You can [check the deployment's status](search-indexer-howto-access-private.md#step-3-check-the-status-of-the-private-endpoint-creation) in the portal or by query, and address any errors that might occur.

Shared private link resources that have failed Azure Resource Manager deployment will show up in [List](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/list-by-service) and [Get](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/get) API calls, but will have a "Provisioning State" of `Failed`. Once the reason of the Azure Resource Manager deployment failure has been ascertained, delete the `Failed` resource and re-create it after applying the appropriate resolution from the following table.

| Deployment failure reason | Description | Resolution |
| --- | --- | --- |
| Network resource provider not registered on target resource's subscription | A private endpoint (and associated DNS mappings) is created for the target resource (Storage Account, CosmosDB, SQL server etc.,) via the `Microsoft.Network` resource provider (RP). If the subscription that hosts the target resource ("target subscription") is not registered with `Microsoft.Network` RP, then the Azure Resource Manager deployment can fail. | Customers need to register this RP in their target subscription. Typically, this can be done either via the Azure portal, PowerShell, or CLI as documented in [this guide](../azure-resource-manager/management/resource-providers-and-types.md) |
| Invalid `groupId` for the target resource | When CosmosDB accounts are created, customers can specify the API type for the database account. While CosmosDB offers several different API types, Azure Cognitive Search only supports "Sql" as the `groupId` for shared private link resources. When a "Sql" shared private link resource is created for a `privateLinkResourceId` that points to a non-Sql database account, the Azure Resource Manager deployment will fail because of the `groupId` mismatch. The Azure resource ID of a CosmosDB account is not sufficient to determine the API type that is being used. Azure Cognitive Search tries to create the private endpoint, which is then denied by CosmosDb. | Customers should ensure that the `privateLinkResourceId` of the specified CosmosDb resource is for a database account of "Sql" API type |
| Target resource not found | Existence of the target resource specified in `privateLinkResourceId` is checked only during the commencement of the Azure Resource Manager deployment. If the target resource is no longer available, then the deployment will fail. | Customer should ensure that the target resource is present in the specified subscription and resource group and is not moved/deleted |
| Transient/other errors | The Azure Resource Manager deployment can fail if there is an infrastructure outage or because of other unexpected reasons. This should be rare and usually indicates a transient state. | Retry creating this resource at a later time. If the problem persists reach out to Azure Support. |

### Resource stuck in "Updating" or "Incomplete" state

Typically, a shared private link resource should go a terminal state (`Succeeded` or `Failed`) in a few minutes after the request has been accepted by the search RP.

In rare circumstances, Azure Cognitive Search can fail to correctly mark the state of the shared private link resource to a terminal state (`Succeeded` or `Failed`). This usually occurs due to an unexpected or catastrophic failure in the search RP. Shared private link resources are automatically transitioned to a `Failed` state if it has been "stuck" in a non-terminal state for more than 8 hours.

If you observe that the shared private link resource has not transitioned to a terminal state, wait for 8 hours to ensure that it becomes `Failed` before you can delete it and re-create it. Alternatively, instead of waiting you can try to create another shared private link resource with a different name (keeping all other parameters the same).

## Updating a shared private link resource

An existing shared private link resource can be updated using the [Create or Update API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update). Search RP only allows for narrow updates to the shared private link resource - only the request message can be modified via this API.

+ It is not possible to update any of the "core" properties of an existing shared private link resource (such as `privateLinkResourceId` or `groupId`) and this will always be unsupported. If any other property besides the request message needs to be changed, we advise customers to delete and re-create the shared private link resource.

+ Attempt to update the request message of a shared private link resource is only possible if it has reached the provisioning state of `Succeeded`.

## Deleting a shared private link resource

Customers can delete an existing shared private link resource via the [Delete API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/delete). Similar to the process of creation (or update), this is also an asynchronous operation with four steps:

1. Customer requests search RP to delete the shared private link resource.

2. Search RP validates that the resource exists and is in a state valid for deletion. If so, it initiates an Azure Resource Manager delete operation to remove the resource.

3. Search queries for the completion of the operation (which usually takes a few minutes). At this point, the shared private link resource would have a provisioning state of "Deleting".

4. Once the operation completes successfully, the backing private endpoint and any associated DNS mappings are removed. The resource will not show up as part of [List](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/list-by-service) operation and attempting a [Get](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/get) operation on this resource will result in a 404 Not Found.

![Steps involved in deleting shared private link resources ](media\troubleshoot-shared-private-link-resources\shared-private-link-delete-states.png)

Some common errors that occur during the deletion phase are listed below.

| Failure Type | Description | Resolution |
| --- | --- | --- |
| Resource is in non-terminal state | A shared private link resource that's not in a terminal state (`Succeeded` or `Failed`) cannot be deleted. It is possible (rare) for a shared private link resource to be stuck in a non-terminal state for up to 8 hours. | Wait until the resource has reached a terminal state and retry the delete request. |
| Delete operation failed with error "Conflict" | The Azure Resource Manager operation to delete a shared private link resource reaches out to the resource provider of the target resource specified in `privateLinkResourceId` ("target RP") before it can remove the private endpoint and DNS mappings. Customers can utilize [Azure resource locks](../azure-resource-manager/management/lock-resources.md) to prevent any changes to their resources. When Azure Resource Manager reaches out to the target RP, it requires the target RP to modify the state of the target resource (to remove details about the private endpoint from its metadata). When the target resource has a lock configured on it (or its resource group/subscription), the Azure Resource Manager operation fails with a "Conflict" (and appropriate details). The shared private link resource will not be deleted. | Customers should remove the lock on the target resource before retrying the deletion operation. **Note**: This problem can also occur when customers try to delete a search service with shared private link resources that point to "locked" target resources |
| Delete operation failed | The asynchronous Azure Resource Manager delete operation can fail in rare cases. When this operation fails, querying the state of the asynchronous operation will present customers with an error message and appropriate details. | Retry the operation at a later time, or reach out to Azure Support if the problem persists.
| Resource stuck in "Deleting" state | In rare cases, a shared private link resource might be stuck in "Deleting" state for up to 8 hours, likely due to some catastrophic failure on the search RP. | Wait for 8 hours, after which the resource would transition to `Failed` state and then reissue the request.|

## Next steps

Learn more about shared private link resources and how to use it for secure access to protected content.

+ [Accessing protected content via indexers](search-indexer-howto-access-private.md)
+ [REST API reference](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources)