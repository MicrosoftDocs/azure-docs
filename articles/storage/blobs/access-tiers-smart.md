---
title: Optimize Azure Blob Storage costs with smart tier (preview)
description: Optimize your Azure Blob Storage costs with smart tier, automatically moving data between access tiers based on usage patterns.
author: beber-msft
ms.author: normesta
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/03/2025

#CustomerIntent: As a storage administrator, I want to optimize costs for blob storage so that I can reduce expenses while maintaining performance.
---
# Optimize Azure Blob Storage costs with smart tier (preview)

> [!IMPORTANT]
> Smart tier is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Smart tier automatically moves your data between the hot, cool, and cold access tiers based on usage patterns, optimizing your costs for these access tiers without setting up supplementary rulesets or policies. Smart tier is ideal for storing data on standard online tiers when access patterns are unclear and you don’t want to manage transitions.

By default, new data is stored in the hot tier. Any object that isn't accessed for 30 days is moved to the cool tier; after 90 days of inactivity, it transitions to the cold tier. If any of those objects are later accessed, they're transitioned back to the hot tier automatically and restart their tiering cycle. The automatic movement of inactive data to cooler tiers can lead to large cost savings over time.
Access behavior, performance characteristics, and SLAs of the underlying capacity tier do apply to objects in smart tier.


## Known issues and considerations

- Smart tier is currently in Public Preview for account level tiering for zone redundancy (ZRS, GZRS, and RA-GZRS) for both flat and hierarchical namespaces including ADLS (Azure Data Lake Storage). 

- Redundancy conversions to non-zone redundant (LRS or GRS) accounts aren't supported. 
- When a GZRS account fails over, convert the LRS account to zone-redundant within 60 days to continue Smart tier support. 
- Smart tier characteristics might change during or after the public preview phase.
- Smart tier monitoring operations are billed **at $0.04 (USD) per 10K Monitoring Operations**. This **pricing will go** into effect starting **January 1, 2026**.

## Enabling smart tier
Enable access to the smart tier public preview by registering the "Smart Tier (account level)" preview feature in the Azure portal [preview features blade](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal/).
After you enable smart tier on existing storage accounts, all blobs in the account that don't have an explicitly set access tier will move to smart tier.
Smart tier is configured on the [default account access tier](access-tiers-overview.md#default-account-access-tier-setting). Smart tier doesn't support legacy account types such as Standard general-purpose v1 (GPv1). After enabling smart tier on existing storage accounts, all blobs in the account for which an access tier hasn't been explicitly set, will be moved to smart tier. Blobs with an explicit tier set don't move to smart tier. A monitoring fee is billed for each group of 10,000 objects managed by smart tier.
You can move objects out of smart tier by setting a different online tier or changing the default account access tier to another tier. Once moved to an explicit tier, objects can't be tiered back to smart tier.
To set the default access tier setting for a storage account, see [Set a blob's access tier](access-tiers-online-manage.md)


## Working with smart tier
All smart tiered objects are automatically managed across the underlying capacity tiers - hot, cool, and cold. Smart tier leverages the regular hot, cool, and cold access tiers in the background. These tiers are called the capacity tier. Smart tier doesn't support the archive tier or premium storage accounts. It works only on block blobs, page blobs aren't supported. 
All objects created or moved onto smart tier–enabled accounts are stored in the hot capacity tier initially. Small objects in smart tier, below 128 KiB in size, don't move across capacity tiers and stay on the hot tier for efficiency. No monitoring fee is billed for those objects under 128 KiB in size. All other objects remain in hot tier for 30 days and move to the cool tier if no access operation occurs. 

The Get Blob and Put Blob operations are access operations and update the last access time of an object. However, the Get Blob Properties, Get Blob Metadata, and Get Blob Tags aren't access operations. Those operations won't update the last access time of an object or impact the tiering behavior of smart tier objects. After 60 more days without accessing objects on smart tier, they transition to the cold tier. No further transitions occur unless the object is accessed. The data always stays on online tiers, delivering you the regular availability, scale, and performance targets of Azure Blob storage. 

Access operations against smart tier objects reset the tier transition timer and immediately move the object to hot tier.
Blob lifecycle management doesn't impact objects on smart tier. Storage actions can't be used to influence tiering operations for objects on smart tier. Soft deleted objects continue to transition to cooler tiers until their deletion expiry period is met. Append blobs don't tier to other capacity tiers.


## Billing details
Objects on smart tier are billed for the capacity meters and connected prices of the underlying capacity tier (hot, cool, or cold tier). there's no smart tier specific capacity meter or price. All capacity under smart tier is billed at pay-as-you-go rates. there's no reserved capacity applicable.
Smart tier charges a monthly monitoring operation for each object over 128KiB managed by smart tier.
Objects in smart tier aren't charged for tier transitions within smart tier, early deletion fees, or data retrieval operations.

All access operations billed for smart tier objects occur against the hot tier. This transaction includes the initial move to the hot tier for any object on other capacity tiers. Moving existing objects into smart tier doesn't trigger any tier transition transaction, moving blobs out of smart tier triggers a cool write operation per object.
Versions and snapshots are billed full content length in current public preview phase. Storage account metrics show how smart tier objects are spread across the underlying tiers by blob count and capacity. Objects smaller than 128KiB is displayed under the regular hot tier metric.


## Client Tooling
The Azure portal supports the current smart tier public preview. Smart tier requires the following minimum versions of REST, SDKs, and tools.

| Environment | Minimum version |
|---|---|
| [REST API](/rest/api/storageservices/blob-service-rest-api)| 2025-06-01 |


## Next steps

- Share your feedback about smart tier with us at smartblob@microsoft.com. We're excited to hear from you how we can improve smart tier even further.
- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)

- [Best practices for using blob access tiers](access-tiers-best-practices.md)

