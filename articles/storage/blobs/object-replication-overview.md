---
title: Object replication overview
titleSuffix: Azure Storage
description: Object replication asynchronously copies block blobs between a source storage account and a destination account. Use object replication to minimize latency on read requests, to increase efficiency for compute workloads, to optimize data distribution, and to minimize costs.
author: normesta

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 05/04/2023
ms.author: normesta
ms.custom: engagement-fy23
---

# Object replication for block blobs

Object replication asynchronously copies block blobs between a source storage account and a destination account. Some scenarios supported by object replication include:

- **Minimizing latency.** Object replication can reduce latency for read requests by enabling clients to consume data from a region that is in closer physical proximity.
- **Increase efficiency for compute workloads.** With object replication, compute workloads can process the same sets of block blobs in different regions.
- **Optimizing data distribution.** You can process or analyze data in a single location and then replicate just the results to additional regions.
- **Optimizing costs.** After your data has been replicated, you can reduce costs by moving it to the archive tier using life cycle management policies.

The following diagram shows how object replication replicates block blobs from a source storage account in one region to destination accounts in two different regions.

:::image type="content" source="media/object-replication-overview/object-replication-diagram.svg" alt-text="Diagram showing how object replication works":::

To learn how to configure object replication, see [Configure object replication](object-replication-configure.md).

## Prerequisites and caveats for object replication

Object replication requires that the following Azure Storage features are also enabled:

- [Change feed](storage-blob-change-feed.md): Must be enabled on the source account. To learn how to enable change feed, see [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed).
- [Blob versioning](versioning-overview.md): Must be enabled on both the source and destination accounts. To learn how to enable versioning, see [Enable and manage blob versioning](versioning-enable.md).

Enabling change feed and blob versioning may incur additional costs. For more information, see the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/).

Object replication is supported for general-purpose v2 storage accounts and premium block blob accounts. Both the source and destination accounts must be either general-purpose v2 or premium block blob accounts. Object replication supports block blobs only; append blobs and page blobs aren't supported.

Object replication is supported for accounts that are encrypted with either microsoft-managed keys or customer-managed keys. For more information about customer-managed keys, see [Customer-managed keys for Azure Storage encryption](../common/customer-managed-keys-overview.md).

Object replication isn't supported for blobs in the source account that are encrypted with a customer-provided key. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md).

Customer-managed failover isn't supported for either the source or the destination account in an object replication policy.

Object replication is not supported for blobs that are uploaded by using [Data Lake Storage Gen2](/rest/api/storageservices/data-lake-storage-gen2) APIs.

## How object replication works

Object replication asynchronously copies block blobs in a container according to rules that you configure. The contents of the blob, any versions associated with the blob, and the blob's metadata and properties are all copied from the source container to the destination container.

> [!IMPORTANT]
> Because block blob data is replicated asynchronously, the source account and destination account are not immediately in sync. There's currently no SLA on how long it takes to replicate data to the destination account. You can check the replication status on the source blob to determine whether replication is complete. For more information, see [Check the replication status of a blob](object-replication-configure.md#check-the-replication-status-of-a-blob).

### Blob versioning

Object replication requires that blob versioning is enabled on both the source and destination accounts. When a replicated blob in the source account is modified, a new version of the blob is created in the source account that reflects the previous state of the blob, before modification. The current version in the source account reflects the most recent updates. Both the current version and any previous versions are replicated to the destination account. For more information about how write operations affect blob versions, see [Versioning on write operations](versioning-overview.md#versioning-on-write-operations).

If your storage account has object replication policies in effect, you cannot disable blob versioning for that account. You must delete any object replication policies on the account before disabling blob versioning.

### Deleting a blob in the source account

When a blob in the source account is deleted, the current version of the blob becomes a previous version, and there's no longer a current version. All existing previous versions of the blob are preserved. This state is replicated to the destination account. For more information about how to delete operations affect blob versions, see [Versioning on delete operations](versioning-overview.md#versioning-on-delete-operations).

### Snapshots

Object replication doesn't support blob snapshots. Any snapshots on a blob in the source account aren't replicated to the destination account.

## Blob index tags

Object replication does not copy the source blob's index tags to the destination blob.

### Blob tiering

Object replication is supported when the source and destination accounts are in the hot or cool tier. The source and destination accounts may be in different tiers. However, object replication will fail if a blob in either the source or destination account has been moved to the archive tier. For more information on blob tiers, see [Access tiers for blob data](access-tiers-overview.md).

### Immutable blobs

Immutability policies for Azure Blob Storage include time-based retention policies and legal holds. When an immutability policy is in effect on the destination account, object replication may be affected. For more information about immutability policies, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

If a container-level immutability policy is in effect for a container in the destination account, and an object in the source container is updated or deleted, then the operation on the source container may succeed, but replication of that operation to the destination container will fail. For more information about which operations are prohibited with an immutability policy that is scoped to a container, see [Scenarios with container-level scope](immutable-storage-overview.md#scenarios-with-container-level-scope).

If a version-level immutability policy is in effect for a blob version in the destination account, and a delete or update operation is performed on the blob version in the source container, then the operation on the source object may succeed, but replication of that operation to the destination object will fail. For more information about which operations are prohibited with an immutability policy that is scoped to a container, see [Scenarios with version-level scope](immutable-storage-overview.md#scenarios-with-version-level-scope).

## Object replication policies and rules

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

After you configure object replication, Azure Storage checks the change feed for the source account periodically and asynchronously replicates any write or delete operations to the destination account. Replication latency depends on the size of the block blob being replicated.

### Replication policies

When you configure object replication, you create a replication policy on the destination account via the Azure Storage resource provider. After the replication policy is created, Azure Storage assigns it a policy ID. You must then associate that replication policy with the source account by using the policy ID. The policy ID on the source and destination accounts must be the same in order for replication to take place.

A source account can replicate to no more than two destination accounts, with one policy for each destination account. Similarly, an account may serve as the destination account for no more than two replication policies.

The source and destination accounts may be in the same region or in different regions. They may also reside in the same subscription or in different subscriptions. Optionally, the source and destination accounts may reside in different Azure Active Directory (Azure AD) tenants. Only one replication policy may be created for each source account/destination account pair.

### Replication rules

Replication rules specify how Azure Storage will replicate blobs from a source container to a destination container. You can specify up to 1000 replication rules for each replication policy. Each replication rule defines a single source and destination container, and each source and destination container can be used in only one rule, meaning that a maximum of 1000 source containers and 1000 destination containers may participate in a single replication policy.

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

You can also specify one or more filters as part of a replication rule to filter block blobs by prefix. When you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.

The source and destination containers must both exist before you can specify them in a rule. After you create the replication policy, write operations to the destination container aren't permitted. Any attempts to write to the destination container fail with error code 409 (Conflict). To write to a destination container for which a replication rule is configured, you must either delete the rule that is configured for that container, or remove the replication policy. Read and delete operations to the destination container are permitted when the replication policy is active.

You can call the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation on a blob in the destination container to move it to the archive tier. For more information about the archive tier, see [Access tiers for blob data](access-tiers-overview.md#archive-access-tier).

> [!NOTE]
> Changing the access tier of a blob in the source account won't change the access tier of that blob in the destination account. 

## Policy definition file

An object replication policy is defined by JSON file. You can get the policy definition file from an existing object replication policy. You can also create an object replication policy by uploading a policy definition file.

### Sample policy definition file

The following example defines a replication policy on the destination account with a single rule that matches the prefix *b* and sets the minimum creation time for blobs that are to be replicated. Remember to replace values in angle brackets with your own values:

```json
{
  "properties": {
    "policyId": "default",
    "sourceAccount": "/subscriptions/<subscriptionId>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>",
    "destinationAccount": "/subscriptions/<subscriptionId>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>",
    "rules": [
      {
        "ruleId": "",
        "sourceContainer": "<source-container>",
        "destinationContainer": "<destination-container>",
        "filters": {
          "prefixMatch": [
            "b"
          ],
          "minCreationTime": "2021-08-028T00:00:00Z"
        }
      }
    ]
  }
}
```

### Specify full resource IDs for the source and destination accounts

When you create the policy definition file, specify the full Azure Resource Manager resource IDs for the **sourceAccount** and **destinationAccount** entries, as shown in the example in the previous section. To learn how to locate the resource ID for a storage account, see [Get the resource ID for a storage account](../common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account).

The full resource ID is in the following format:

```http
/subscriptions/<subscriptionId>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

The policy definition file previously required only the account name, instead of the full resource ID for the storage account. With the introduction of the **AllowCrossTenantReplication** security property in version 2021-02-01 of the Azure Storage resource provider REST API, you must now provide the full resource ID for any object replication policies that are created when cross-tenant replication is disallowed for a storage account that participates in the replication policy. Azure Storage uses the full resource ID to verify whether the source and destination accounts reside within the same tenant. To learn more about disallowing cross-tenant replication policies, see [Prevent replication across Azure AD tenants](#prevent-replication-across-azure-ad-tenants).

While providing only the account name is still supported when cross-tenant replication is allowed for a storage account, Microsoft recommends always providing the full resource ID as a best practice. All previous versions of the Azure Storage resource provider REST API support using the full resource ID path in object replication policies.

The following table describes what happens when you create a replication policy with the full resource ID specified, versus the account name, in the scenarios where cross-tenant replication is allowed or disallowed for the storage account.

| Storage account identifier in policy definition | Cross-tenant replication allowed | Cross-tenant replication disallowed |
|--|--|--|
| Full resource ID | Same-tenant policies can be created.<br /><br /> Cross-tenant policies can be created. | Same-tenant policies can be created.<br /><br /> Cross-tenant policies can't be created. |
| Account name only | Same-tenant policies can be created.<br /><br /> Cross-tenant policies can be created. | Neither same-tenant nor cross-tenant policies can be created. An error occurs, because Azure Storage can't verify that source and destination accounts are in the same tenant. The error indicates that you must specify the full resource ID for the **sourceAccount** and **destinationAccount** entries in the policy definition file. |

### Specify the policy and rule IDs

The following table summarizes which values to use for the **policyId** and **ruleId** entries in the policy definition file in each scenario.

| When you're creating the policy definition file for this account... | Set the policy ID to this value | Set rule IDs to this value |
|-|-|-|
| Destination account | The string value *default*. Azure Storage will create the policy ID value for you. | An empty string. Azure Storage will create the rule ID values for you. |
| Source account | The value of the policy ID returned when you download the policy definition file for the destination account. | The values of the rule IDs returned when you download the policy definition file for the destination account. |

## Prevent replication across Azure AD tenants

An Azure Active Directory (Azure AD) tenant is a dedicated instance of Azure AD that represents an organization for identity and access management. Each Azure subscription has a trust relationship with a single Azure AD tenant. All resources in a subscription, including storage accounts, are associated with the same Azure AD tenant. For more information, see [What is Azure Active Directory?](../../active-directory/fundamentals/active-directory-whatis.md)

By default, a user with appropriate permissions can configure object replication with a source storage account that is in one Azure AD tenant and a destination account that is in a different tenant. If your security policies require that you restrict object replication to storage accounts that reside within the same tenant only, you can disallow replication across tenants by setting a security property, the **AllowCrossTenantReplication** property (preview). When you disallow cross-tenant object replication for a storage account, then for any object replication policy that is configured with that storage account as the source or destination account, Azure Storage requires that both the source and destination accounts reside within the same Azure AD tenant. For more information about disallowing cross-tenant object replication, see [Prevent object replication across Azure Active Directory tenants](object-replication-prevent-cross-tenant-policies.md).

To disallow cross-tenant object replication for a storage account, set the **AllowCrossTenantReplication** property to *false*. If the storage account doesn't currently participate in any cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* prevents future configuration of cross-tenant object replication policies with this storage account as the source or destination.

If the storage account currently participates in one or more cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* isn't permitted. You must delete the existing cross-tenant policies before you can disallow cross-tenant replication.

By default, the **AllowCrossTenantReplication** property isn't set for a storage account, and its value is *null*, which is equivalent to *true*. When the value of the **AllowCrossTenantReplication** property for a storage account is *null* or *true*, then authorized users can configure cross-tenant object replication policies with this account as the source or destination. For more information about how to configure cross-tenant policies, see [Configure object replication for block blobs](object-replication-configure.md).

You can use Azure Policy to audit a set of storage accounts to ensure that the **AllowCrossTenantReplication** property is set to prevent cross-tenant object replication. You can also use Azure Policy to enforce governance for a set of storage accounts. For example, you can create a policy with the deny effect to prevent a user from creating a storage account where the **AllowCrossTenantReplication** property is set to *true*, or from modifying an existing storage account to change the property value to *true*.

## Replication status

You can check the replication status for a blob in the source account. For more information, see [Check the replication status of a blob](object-replication-configure.md#check-the-replication-status-of-a-blob).

> [!NOTE]
>  While replication is in progress, there's no way to determine the percentage of data that has been replicated. 

If the replication status for a blob in the source account indicates failure, then investigate the following possible causes:

- Make sure that the object replication policy is configured on the destination account.
- Verify that the destination account still exists.
- Verify that the destination container still exists.
- Verify that the destination container is not in the process of being deleted, or has not just been deleted. Deleting a container may take up to 30 seconds.
- Verify that the destination container is still participating in the object replication policy.
- If the source blob has been encrypted with a customer-provided key as part of a write operation, then object replication will fail. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md).
- Check whether the source or destination blob has been moved to the archive tier. Archived blobs cannot be replicated via object replication. For more information about the archive tier, see [Access tiers for blob data](access-tiers-overview.md).
- Verify that destination container or blob is not protected by an immutability policy. Keep in mind that a container or blob can inherit an immutability policy from its parent. For more information about immutability policies, see [Overview of immutable storage for blob data](immutable-storage-overview.md).

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Billing

There is no cost to configure object replication. This includes the task of enabling change feed, enabling versioning, as well as adding replication policies. However, object replication incurs costs on read and write transactions against the source and destination accounts, as well as egress charges for the replication of data from the source account to the destination account and read charges to process change feed. 

Here's a breakdown of the costs. To find the price of each cost component, see [Azure Blob Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

| Cost to update a blob in the source account | Cost to replicate data in the destination account |
|---|---|
|Transaction cost of a write operation|Transaction cost to read a change feed record|
|Storage cost of the blob and each blob version<sup>1</sup>|Transaction cost to read the blob and blob versions<sup>2</sup>|
|Cost to add a change feed record|Transaction cost to write the blob and blob versions<sup>2</sup>|
||Storage cost of the blob and each blob version<sup>1</sup>|
||Cost of network egress<sup>2</sup>|



<sup>1</sup>    See [Blob versioning pricing and Billing](versioning-overview.md#pricing-and-billing).

<sup>2</sup>    This includes only blob versions created since the last replication completed.

<sup>3</sup>    See [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).



## Next steps

- [Configure object replication](object-replication-configure.md)
- [Prevent object replication across Azure Active Directory tenants](object-replication-prevent-cross-tenant-policies.md)
- [Blob versioning](versioning-overview.md)
- [Change feed support in Azure Blob Storage](storage-blob-change-feed.md)


