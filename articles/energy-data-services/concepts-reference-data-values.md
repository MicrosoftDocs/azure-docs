---
title: Reference Data Value Syncing in Microsoft Azure Data Manager for Energy
description: This article describes Reference Values and syncing of Reference Values with Azure Data Manager for Energy data partitions.
author: sharad4u
ms.author: sharadag
ms.service: azure-data-manager-energy
ms.topic: conceptual
ms.date: 08/28/2024
ms.custom: template-concept
---

# Syncing Reference Data Values

> [!IMPORTANT]
> The feature to sync reference values in your Azure Data Manager for Energy data partition is currently in **Limited Preview**. If you are interested in having this feature enabled for your Azure subscription, then please reach out to either your Microsoft Sales contact or open a support ticket for assistance.
>

This article provides an overview of reference data values in OSDU Data Platform, and explains how Azure Data Manager for Energy helps you synchronize them with OSDU community standards. 

## What are reference data values and why are they important?

Within the OSDU Data Platform framework, reference data values play a crucial role in ensuring data consistency and standardization. Reference data refers to the set of permissible values for attributes to be used across various data fields, such as master data or work product components. For example, `degree Celsius` is a permitted `UnitofMeasure`, and `Billing Address` is a permitted `AddressType`.

In addition to enabling data interpretation and collaboration, reference data is required for data ingestion via the OSDU manifest ingestion workflow. Manifests provide a specific container for reference data values, which are then used to validate the ingested data and generate metadata for later discovery and use. To learn more about manifest-based ingestion, see [Manifest-based ingestion concepts](concepts-manifest-ingestion.md). 

The OSDU Data Platform categorizes Reference data values into the following three buckets:
* **FIXED** values: This set of reference values is universally recognized and used across OSDU deployments and the energy sector. These values can't be extended or changed except by OSDU community governance updates
* **OPEN** values: The OSDU community provides an initial list of OPEN values upon which you can extend but not otherwise change
* **LOCAL** values: The OSDU community provides an initial list of LOCAL values that you can freely change, extend, or entirely replace

For more information about OSDU reference data values and their different types, see [OSDU Data Definitions / Data Definitions / Reference Data](https://community.opengroup.org/osdu/data/data-definitions/-/blob/master/Guides/Chapters/02-GroupType.md#22-reference-data).

## Configuring value syncing in Azure Data Manager for Energy

To help you maintain data integrity and facilitate interoperability, new Azure Data Manager for Energy instances are automatically created with **FIXED** and **OPEN** reference data values synced per the latest set from the OSDU community for the [current milestone supported by Azure Data Manager for Energy](osdu-services-on-adme.md). You can additionally choose to have new instances create with **LOCAL** values synced as well.

Later, if you create new data partitions in the Azure Data Manager for Energy instance, they'll also be created with FIXED and OPEN reference values synced. If you had chosen to additionally sync LOCAL values when you first created the instance, new partitions will also sync LOCAL values from the community.

As covered in the [Quickstart: Create an Azure Data Manager for Energy instance article](quickstart-create-microsoft-energy-data-services-instance.md), you can choose to enable LOCAL value syncing when creating a new Azure Data Manager for Energy instance. When deploying through the Azure portal, you can enable LOCAL syncing in the "Advanced Settings" tab. FIXED and OPEN reference values will always be synced when new instances are created.

When deploying through ARM templates, you can enable LOCAL syncing by setting the `ReferenceDataProperties` property to `All`. To restrict syncing to only FIXED and OPEN values, set its value to `NonLocal`.

## Legal Tags and Entitlements for synced reference values
Azure Data Manager for Energy automatically sets **Legal Tags** and **Entitlements** for reference data values as they're synced.

For all synced reference data values, whether FIXED, OPEN, or LOCAL, **Legal Tags** are set to `{data-partition-id}-referencedata-legal`, where `{data-partition-id}` corresponds to the data partition name you provided when configuring new data partition creation. 

For **Entitlements**, Azure Data Manager for Energy automatically creates entitlement groups that you can then use for access controls. Groups are created for OWNERS and VIEWERS across FIXED, OPEN, and LOCAL values:

| Governance Set | OWNERS Group | VIEWERS Group |
| --- | --- | --- |
| FIXED | data.referencedata.owners@{data_partition_id}.{osdu_domain} | data.referencedata.viewers@{data_partition_id}.{osdu_domain} |
| OPEN | data.referencedata.owners@{data_partition_id}.{osdu_domain} | data.referencedata.viewers@{data_partition_id}.{osdu_domain} |
| LOCAL | data.referencedata-local.owners@{data_partition_id}.{osdu_domain} | data.referencedata-local.viewers@{data_partition_id}.{osdu_domain} |

The above LOCAL groups are only created if you chose to sync LOCAL values.

If you extend OPEN values after instance creation, we recommend creating and using different access control  lists (ACLs) to govern their access. For example, `data.referencedata-{ORG}.owners@{data_partition_id}.{osdu_domain}` and `data.referencedata-{ORG}.viewers@{data_partition_id}.{osdu_domain}`, where `{ORG}` differentiates the ACL from the one used for standard OPEN values synced at creation.

**NameAlias updates** don't require a separate entitlement. Updates to the `NameAlias` field are governed by the same access control mechanisms as updates to any other part of a storage record. In effect, OWNER access confers the entitlement to update the `NameAlias` field.

## Current scope of Azure Data Manager for Energy reference data value syncing
Currently, Azure Data Manager for Energy syncs reference data values at instance creation and at new partition creation for newly created instances after feature enablement. Reference values are synced to those from the OSDU community, corresponding to the OSDU milestone supported by Azure Data Manager for Energy at the time of instance or partition creation. For information on the current milestone supported by and available OSDU service in Azure Data Manager for Energy, refer [OSDU services available in Azure Data Manager for Energy](osdu-services-on-adme.md).

## Next steps
- [Quickstart: Create Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md)
- [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)
- [OSDU Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide)
