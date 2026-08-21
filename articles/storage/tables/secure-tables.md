---
title: Secure your Azure Table Storage
description: Learn how to secure Azure Table Storage, with best practices specific to tables, entities, and access authorization.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-table-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/19/2026
ai-usage: ai-assisted
# Customer intent: As a developer using Azure Table Storage, I want to implement table-specific security best practices.
---

# Secure your Azure Table Storage

Azure Table Storage provides a NoSQL key-value store for structured, non-relational data. Table security shares fundamentals with the other Azure Storage data services but has a few specifics - including a distinct Microsoft Entra ID authorization surface and an overlap with the Azure Cosmos DB for Table API - that deserve attention.

> [!NOTE]
> This article covers security practices specific to Azure Table Storage. For account-level security guidance, see [Secure your Azure Storage account](../common/secure-storage.md).

## Service-specific security

Both Azure Table Storage and the Azure Cosmos DB for Table API expose a similar table data model, but their security capabilities differ significantly. Choose the platform that meets your security requirements at project inception. Data migration between them is nontrivial.

- **Use Azure Cosmos DB for Table when you need dedicated throughput, global distribution, or finer-grained network isolation per table workload**: The Cosmos DB for Table API is a distinct resource with its own private endpoints, firewall, and IAM configuration, independent of any storage account. This gives you an isolated blast radius when the Table workload has different network or governance requirements than the workloads sharing your general-purpose storage account. For more information, see [Introduction to Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction).

- **Use Azure Table Storage when you need account-level co-location with blobs, files, and queues**: Table Storage lives inside a general-purpose storage account, so a single set of network rules, private endpoints, and identity policies apply across all four data services. Cosmos DB for Table is a separate resource with independent security configuration.

## Identity and access management

- **Use Microsoft Entra ID to authorize table data operations**: Entra ID authorization removes the need for account keys in application code and provides identity-based audit trails. Assign the built-in **Storage Table Data Reader** or **Storage Table Data Contributor** roles at the table scope where possible. For more information, see [Authorize access to tables using Microsoft Entra ID](authorize-access-azure-active-directory.md).

- **Scope role assignments to specific tables**: Table-level scope is supported for the built-in table data roles. When a service needs access to only one table, assign the role at the table resource rather than at the account.

- **Scope SAS tokens to specific partition and row key ranges**: Table SAS supports partition-key and row-key range restrictions. Use them to limit a token to a single tenant's rows in a multi-tenant table, or to a specific data slice. For more information, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).

- **Grant only the specific table operations required**: Table SAS supports `query`, `add`, `update`, and `delete` permissions separately. A reader-style caller should hold `query` only, never `update` or `delete`.

## Data protection

Table Storage stores entities as flat property bags without per-entity ACLs. Consider security in your partitioning strategy rather than trying to retrofit access control.

- **Partition tables to align with access boundaries**: When a table serves multiple tenants or classification levels, choose a partition key that groups entities by tenant or classification. Combine this with SAS partition-key range restrictions to enforce tenant isolation without a separate table per tenant.

- **Don't store secrets or unnecessary personal data in entity properties**: Entities are visible to any principal with `query` or `read` access to the table or partition. Store secrets in Azure Key Vault with references in the entity, and minimize the personal data you place in queryable properties.

- **Encrypt sensitive property values at the application layer**: For property values that must remain confidential, encrypt the value in the client with a key from Key Vault before insert or update. This encryption is independent of the storage-side encryption applied to the whole table. For more information, see [About keys](/azure/key-vault/keys/about-keys).

## Logging and monitoring

- **Enable diagnostic settings for table operations**: Send `StorageRead`, `StorageWrite`, and `StorageDelete` categories to Log Analytics. Alert on unexpected authorization methods, particularly Shared Key access on accounts where it should be disabled. For more information, see [Monitoring Azure Table Storage](../tables/monitor-table-storage.md).

- **Alert on high-volume delete or update operations**: Bulk `DeleteEntity` or `UpdateEntity` activity that deviates from the table's baseline can indicate data destruction or tampering. Establish a baseline and alert on deviations.

## Related security articles

- [Secure your Azure Storage account](../common/secure-storage.md) - Cross-cutting Azure Storage security guidance.
- [Secure your Azure Blob Storage](../blobs/secure-blobs.md) - Blob-specific security.
- [Secure your Azure Files](../files/secure-files.md) - File share security.
- [Secure your Azure Queue Storage](../queues/secure-queues.md) - Queue-specific security.

## Next steps

- [Introduction to Azure Table Storage](../tables/table-storage-overview.md)
- [Authorize access to tables using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Design scalable and performant tables](../tables/table-storage-design.md)
