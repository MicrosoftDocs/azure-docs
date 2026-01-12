---
title: Reference Data Value in Microsoft Azure Data Manager for Energy
description: This article describes Reference Values and how Reference Data Values are automatically loaded in Azure Data Manager.
author: marielherz
ms.author: marielherzog
ms.service: azure-data-manager-energy
ms.topic: article
ms.date: 12/18/2025
ms.custom: template-concept
---

# Reference Data Values Automated Sync in Azure Data Manager for Energy

This article provides an overview of reference data values in OSDU® Data Platform, and explains how Azure Data Manager for Energy helps you synchronize them with OSDU® community standards. 

## What are reference data values and why are they important?

Within the OSDU Data Platform® framework, reference data values play a crucial role in ensuring data consistency and standardization. Reference data refers to the set of permissible values for attributes to be used across various data fields, such as master data or work product components. For example, `degree Celsius` is a permitted `UnitofMeasure`, and `Billing Address` is a permitted `AddressType`.

In addition to enabling data interpretation and collaboration, reference data is required for data ingestion via the OSDU® manifest ingestion workflow. Manifests provide a specific container for reference data values, which are then used to validate the ingested data and generate metadata for later discovery and use. To learn more about manifest-based ingestion, see [Manifest-based ingestion concepts](concepts-manifest-ingestion.md). 

The OSDU Data Platform® categorizes Reference data values into the following three buckets:
* **FIXED** values: This set of reference values is universally recognized and used across OSDU® deployments and the energy sector. These values can't be extended or changed except by OSDU® community governance updates
* **OPEN** values: The OSDU® community provides an initial list of OPEN values upon which you can extend but not otherwise change
* **LOCAL** values: The OSDU® community provides an initial list of LOCAL values that you can freely change, extend, or entirely replace

For more information about OSDU® reference data values and their different types, see [OSDU® Data Definitions / Data Definitions / Reference Data](https://community.opengroup.org/osdu/data/data-definitions/-/blob/master/Guides/Chapters/02-GroupType.md#22-reference-data).

## Configuring value syncing in Azure Data Manager for Energy

To help you maintain data integrity and facilitate interoperability, new Azure Data Manager for Energy instances are automatically created with **FIXED** and **OPEN** reference data values synced per the latest set from the OSDU® community for the [current milestone supported by Azure Data Manager for Energy](osdu-services-on-adme.md). During provisioning, you can additionally choose to have new instances create with **LOCAL** values synced or opt out.

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

## OSDU® Milestone Automated Reference Data Value Upgrades

Azure Data Manager for Energy updates Reference Data Values (RDVs) by automatically applying the latest OSDU®‑aligned FIXED, OPEN, and LOCAL values as part of each instance’s standard upgrade cycle. These updates keep instances aligned with evolving OSDU® definitions while preserving customer‑specific configurations where appropriate. This approach ensures FIXED values remain interoperable across all OSDU®‑based systems, OPEN values continue to support extensibility without losing customer intent, and LOCAL values retain the business‑specific meaning organizations depend on. Updates require no user action and occur seamlessly with no downtime — Azure Data Manager for Energy incorporates new OSDU®‑provided values, updates FIXED values to the latest standards, and preserves customer changes for OPEN and LOCAL. As RDV versioning is decoupled from OSDU® versions, Azure Data Manager for Energy applies RDV updates **only** during the all‑up OSDU® milestone upgrade, ensuring predictable, governed rollout.

### Reference Data Values Update Behavior Summary

| RDV Type | Upgrade Behavior | Rationale |
|---------|------------------|-----------|
| **FIXED** | Updated to the latest OSDU® standard; prior versions remain accessible in history. | Ensures global interoperability across OSDU®‑based systems. |
| **OPEN** | Customer‑extended or modified entries are preserved; new OSDU® baseline entries are added without overwriting user changes. | Balances shared semantics with user‑driven extensibility. |
| **LOCAL** | Behaviors follow the instance’s provisioning choice; custom values remain unchanged, and new OSDU® suggestions are added only if LOCAL was enabled. | Protects business‑specific meaning and avoids unintended modification. |

For information on the current milestone supported by and available OSDU® services in Azure Data Manager for Energy, refer [OSDU® services available in Azure Data Manager for Energy](osdu-services-on-adme.md).

## Next steps
- [Quickstart: Create Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md)
- [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)
- [OSDU® Operator Data Loading Quick Start Guide](https://community.opengroup.org/groups/osdu/platform/data-flow/data-loading/-/wikis/home#osdu-operator-data-loading-quick-start-guide)
