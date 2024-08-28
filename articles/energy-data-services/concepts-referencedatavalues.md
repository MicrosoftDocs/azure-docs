---
title: Reference Data Value Syncing in Microsoft Azure Data Manager for Energy
description: This article describes how Azure Data Manager for Energy instances and partitions are created with Reference Data Values that are synced with those from the OSDU community.
author: sharad4u
ms.author: sharadag
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 08/28/2024
ms.custom: template-concept
---

# Syncing Reference Data Values

> [!IMPORTANT]
> This feature is currently in **Limited Preview**. If you're interested in trying out this feature, please reach out to your Microsoft Sales contact or open a support ticket for assistance.
>

This article provides an overview of reference data values in the OSDU framework, and explains how and why Azure Data Manager for Energy helps you synchronize them with OSDU community standards. 

## What are reference data values and why are they important?

Within the OSDU framework, reference data values play a crucial role in ensuring data consistency and standardization. Reference data refers to the set of permissible values for attributes to be used across various data fields, such as master data or work product components. For example, `degree Celsius` is a permitted `UnitofMeasure`, and `Billing Address` is a permitted `AddressType`.

In addition to enabling data interpretation and collaboration, reference data is required for data ingestion via the OSDU manifest ingestion workflow. Manifests provide a specific container for reference data values, which are then used to validate the ingested data and generate metadata for later discovery and use. To learn more about manifest-based ingestion, see [Manifest-based ingestion concepts](https://learn.microsoft.com/en-us/azure/energy-data-services/concepts-manifest-ingestion). 

Reference data values fall into one of three categories:
* **FIXED** values, which are universally recognized and used across OSDU deployments and the energy sector. These values cannot be extended or changed except by OSDU community governance updates
* **OPEN** values. The OSDU community provides an initial list of OPEN values upon which you can extend but not otherwise change
* **LOCAL** values. The OSDU community provides an initial list of LOCAL values that you can freely change, extend, or entirely replace

For more information about OSDU reference data values and their different types, see [OSDU Software / OSDU Data Definitions / Data Definitions](https://community.opengroup.org/osdu/data/data-definitions).

## Configuring value syncing in Azure Data Manager for Energy

To help you maintain data integrity and facilitate interoperability, new Azure Data Manager for Energy instances are automatically created with **FIXED** and **OPEN** reference data values synced to those from the OSDU community. You can additionally choose to have new instances create with **LOCAL** values synced as well.

When you create new partitions in existing Azure Data Manager for Energy instances, they'll similarly be created with FIXED and OPEN reference values synced. If you chose to additionally sync LOCAL values when you first created the instance, new partitions will also sync LOCAL values from the community.

As covered in the [Quickstart: Create an Azure Data Manager for Energy instance article](quickstart-create-microsoft-energy-data-services-instance.md), you can choose to enable LOCAL value syncing when creating a new Azure Data Manager for Energy instance. When deploying through the Azure portal, you can enable LOCAL syncing in the "Advanced Settings" tab. FIXED and OPEN reference values will always be synced when new instances are created.

When deploying through ARM templates, you can enable LOCAL syncing by setting the `ReferenceDataProperties` property to `All`. To restrict syncing to only FIXED and OPEN values, set its value to `NonLocal`.

## Legal Tags and Entitlements for synced values
Azure Data Manager for Energy automatically sets **Legal Tags** and **Entitlements** for reference data values as they're synced.

For all synced reference data values—whether FIXED, OPEN, or LOCAL—**Legal Tags** are set to `{data-partition-id}-referencedata-legal`, where `{data-partition-id}` corresponds to the partition name(s) you entered for instance creation. 

For **Entitlements**, Azure Data Manager for Energy automatically creates entitlement groups that you can then use for access controls. Groups are created for OWNERS and VIEWERS across FIXED, OPEN, and LOCAL values:

| Governance Set | OWNERS Group | VIEWERS Group |
| --- | --- | --- |
| FIXED | data.referencedata.owners@{data_partition_id}.{osdu_domain} | data.referencedata.viewers@{data_partition_id}.{osdu_domain} |
| OPEN | data.referencedata.owners@{data_partition_id}.{osdu_domain} | data.referencedata.viewers@{data_partition_id}.{osdu_domain} |
| LOCAL | data.referencedata-local.owners@{data_partition_id}.{osdu_domain} | data.referencedata-local.viewers@{data_partition_id}.{osdu_domain} |

The above LOCAL groups are only created if you chose to sync LOCAL values.

If you extend OPEN values after instance creation, we recommend creating and using different access control  lists (ACLs) to govern their access. For example, `data.referencedata-{ORG}.owners@{data_partition_id}.{osdu_domain}` and `data.referencedata-{ORG}.viewers@{data_partition_id}.{osdu_domain}`, where `{ORG}` differentiates the ACL from the one used for standard OPEN values synced at creation.

**NameAlias updates** don't require a separate entitlement. Updates to the `NameAlias` field are governed by the same access control mechanisms as updates to any other part of a storage record. In effect, OWNER access confers the entitlement to update the `NameAlias` field without needing any additional permissions.

## Current scope of Azure Data Manager for Energy reference data value syncing
At present, Azure Data Manager for Energy syncs reference data values at instance creation and at new partition creation. Reference values are synced to those from the OSDU community, corresponding to the OSDU milestone supported by Azure Data Manager for Energy at the time of instance or partition creation. For information on what milestone Azure Data Manager for Energy currently supports, see the [Release notes for Microsoft Azure Data Manager for Energy](https://learn.microsoft.com/en-us/azure/energy-data-services/release-notes).