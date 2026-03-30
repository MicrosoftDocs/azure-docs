---
title: The Advanced Security Information Model (ASIM) Asset Entity normalization schema reference | Microsoft Docs
description: This article displays the Microsoft Sentinel Asset Entity normalization schema.
author: derricklee
ms.topic: reference
ms.date: 03/04/2026
ms.author: derricklee



#Customer intent: As a security analyst, I want to understand the ASIM Asset Entity normalization schema so that I can accurately create snapshots of my assets in my source system, enabling consistent and comprehensive monitoring across security platforms and improving threat detection and response efforts.

---

# The Advanced Security Information Model (ASIM) asset entity schema reference

The Microsoft Sentinel Asset Entity Schema is designed to normalize assets from various products into a standardized format within Microsoft Advanced Security Information Model (ASIM). This schema focuses exclusively on assets in non-Microsoft data sources, ensuring consistent and efficient analysis.

An asset is any data resource that an organization stores, processes, or manages, such as a file, or site. Each asset carries security-relevant metadata including ownership, permissions, sensitivity classifications, and risk indicators. Assets can originate from a wide range of platforms, databases, cloud storage services, SaaS applications, and on-premises systems and are collected as either full inventory snapshots or incremental change feeds.

By normalizing asset data into a common schema, Microsoft Sentinel enables security teams to analyze and correlate asset information across diverse data sources in a consistent way. Key fields in the schema include `EntityId` and `EntityName` for uniquely identifying assets, `AssetType` for distinguishing between asset kinds such as File or Site, `AssetOwnerId` for tracking ownership, `AssetSensitivityLabel` and `AssetOriginalDataClassificationType` for data classification context, and `EntityFeedType` for indicating whether a record is a full inventory snapshot or an incremental change. This unified representation powers downstream scenarios such as identifying overshared sensitive files, tracking permission changes, detecting unprotected assets, and surfacing risk across the entire data estate through integrations like Microsoft Purview Data Security Posture Management (DSPM).

Usage of the schema allows Microsoft Purview DSPM to manage data security posture across Microsoft and partner platforms. For more information, see the [Ignite 2025 announcement](https://aka.ms/newpurviewdspm) introducing the DSPM partner ecosystem.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

## Parsers

For more information about ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).

### Unifying parsers

To use parsers that unify all ASIM out-of-the-box parsers and ensure that your analysis runs across all the configured sources, use the `_Im_AssetEntity` parser.


### Add your own normalized parsers

When [developing custom parsers](normalization-develop-parsers.md) for the Asset Entity schema, name your KQL functions using the following syntax:
- `vimAssetEntity<vendor><Product>` for parameterized parsers
- `ASimAssetEntity<vendor><Product>` for regular parsers

Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the unifying parsers.

### Filtering parser parameters

The Asset Entity parsers support various [filtering parameters](normalization-about-parsers.md#optimizing-parsing-using-parameters) to improve query performance. These parameters are optional but can enhance your query performance. The following filtering parameters are available:

| Name | Type | Description |
|------|------|-------------|
| **starttime** | datetime | Filter only assets that were ingested at or after this time. This parameter filters on the `EntityIngestionTime` field, which is the standard designator for the time of the asset. |
| **endtime** | datetime | Filter only assets that were ingested at or before this time. This parameter filters on the `EntityIngestionTime` field, which is the standard designator for the time of the asset. |
| **entityid_has_any** | dynamic | Filter only assets for which the **'EntityId'** field is in one of the listed values. |
| **entityname_has_any** | dynamic | Filter only assets for which the **'EntityName'** field is in one of the listed values. |
| **assettype_in** | string | Filter only assets for which the **'AssetType'** field is equal to the parameter value. |
| **path_has_any** | dynamic | Filter only assets for which the **'FilePath'** or **'SitePath'** field is in one of the listed values. |
| **assetowner_has_any** | dynamic | Filter only assets for which the **'AssetOwner'** or **'AdditionalAssetOwners'** field is in one of the listed values. |
| **entitysource_has_any** | dynamic | Filter only assets for which the **'EntitySource'** field is in one of the listed values. |

## Schema details

### <a id="common-entity-fields">Common ASIM Entity Fields</a>

The following list mentions fields for an Entity schema alongside their specific guidelines for Asset entities:

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **EntityUpdatedTime** | Mandatory | datetime | The timestamp (UTC) of when the Entity was updated or collected at the source. |
| **EntityIngestionTime** | Optional | datetime | The timestamp (UTC) of when the ingestion pipeline receives the asset log. |
| **EntityId** | Mandatory | string | The unique identifier of the asset. |
| **EntityOriginalId** | Optional | string | The unique identifier of the asset at the source if it is different from **'EntityId'**. |
| **EntityName** | Mandatory | string | The name of the entity. |
| **EntityNameType** | Recommended | string | The type of the entity name. |
| **EntityVendor** | Mandatory | string | The vendor or provider that reported the entity. |
| **EntitySource** | Mandatory | string | The data source or connector that provided the entity record. |
| **EntityProduct** | Mandatory | string | The product name associated with the source that reported the entity. |
| **EntitySubProduct** | Mandatory | string | The sub-product or component name associated with the source that reported the entity. |
| **EntityCreatedTime** | Mandatory | datetime | The timestamp (UTC) of when the entity was originally created in the source system. |
| **EntityLastAccessedTime** | Optional | datetime | The timestamp (UTC) of when the entity was last accessed. |
| **EntityLastModifiedTime** | Mandatory | datetime | The timestamp (UTC) of when the entity was last modified in the source system. |
| **EntityIsDeleted** | Optional | bool | Indicates whether the entity has been deleted in the source system. |
| **EntityFeedType** | Mandatory | Enumerated | The type or category of the data feed that provided the entity record. The allowed values are: `Snapshot` or `Changefeed`. |
| **EntitySchema** | Mandatory | Enumerated | The schema used for the entity. The schema documented here is `Asset`. |
| **EntitySchemaVersion** | Mandatory | SchemaVersion (String) | The version of the schema. The version of the schema documented here is `0.1.0`. |

### <a id="asset-owner-fields">Asset owner fields</a>

This section defines information about the asset owner. If your asset has multiple owners, populate both fields `AssetOwnerId` and `AdditionalAssetOwners`. `AdditionalAssetOwners` should be an array of strings and the strings must be in the same format as `AssetOwnerId`.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AssetOwnerId** | Mandatory | string | A machine-readable, alphanumeric, unique representation of the Actor. For more information, and for alternative fields for other IDs, see [The User entity](normalization-entity-user.md). |
| **AssetOwnerIdType** | Recommended | string | The type or format of the asset owner identifier. This is analogous to `UserIdType` in Event schemas. For more information and list of allowed values, see [UserIdType](normalization-entity-user.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md). |
| **AssetOwnerType** | Optional | string | The type of the Asset Owner. For more information, and list of allowed values, see [UserType](normalization-entity-user.md#usertype) in the [Schema Overview article](normalization-about-schemas.md). |
| **AssetOwnerScope** | Optional | string | The organizational or administrative scope to which the asset owner belongs. |
| **AssetOwnerScopeId** | Optional | string | The identifier of the scope to which the asset owner belongs. |
| **AdditionalAssetOwners** | Optional | dynamic | A dynamic collection of additional owners or co-owners associated with the asset. This must be an **array of strings**. |

### <a id="asset-metadata-fields">Asset metadata fields</a>

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AADTenantId** | Mandatory | string | The Azure Active Directory tenant identifier associated with the asset or entity. |
| **IdentityDirectoryName** | Optional | string | The name of the identity directory, such as Azure AD, GCP, AWS, associated with the entity. |
| **IdentityDirectoryId** | Mandatory | string | The identifier of the identity directory associated with the entity. |
| **AdditionalFields** | Optional | dynamic | Additional information about the entity that is not captured by other fields in the schema. |

### <a id="asset-type-fields">Asset type fields</a>

This section defines information about the asset type. The current types supported are [`File`](#file-fields) and [`Site`](#site-fields). The asset's type's additional properties should be populated.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AssetType** | Mandatory | string | The high-level type of the asset. The allowed and supported values are: `File`, `Site`. |
| **AssetOriginalType** | Recommended | string | The original name of the high-level type of the asset at the source. |

### <a id="asset-security-fields">Asset security fields</a>

This section captures the asset's security posture and exposure context, including source permissions, sensitivity and data-classification details, DLP protection status, related threat indicators, and the last classification scan time. It also includes internal and external user access counts to help assess potential exposure.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AssetOriginalPermissions** | Optional | dynamic | The original permission set assigned to the asset as reported by the source system. |
| **AssetSensitivityLabel** | Mandatory | string | The sensitivity label applied to the asset. The allowed values are: `Personal`, `Public`, `General`, `Confidential`, `Highly Confidential`. |
| **AssetOriginalSensitivityLevel** | Optional | string | The sensitivity level as reported by the source system, before normalization. |
| **AssetIsProtectedByDlp** | Optional | bool | Indicates whether the asset is protected by a Data Loss Prevention (DLP) policy. |
| **AssetRelatedIndicators** | Optional | dynamic | A dynamic collection of threat indicators or signals related to the asset. |
| **AssetOriginalDataClassificationType** | Mandatory | dynamic | The original data classification type(s) assigned to the asset as reported by the source system. This must be an *array of strings**. |
| **AssetClassificationLastScanDateTime** | Mandatory | datetime | The timestamp (UTC) of when the asset was last scanned for data classification. |
| **InternalUsersCount** | Optional | int | The number of internal users associated with or having access to the asset. |
| **ExternalUsersCount** | Optional | int | The number of external users associated with or having access to the asset. |

### <a id="asset-risk-fields">Asset risk fields</a>

This section captures risk context for the asset, including normalized and source-reported risk names and levels, first and last report timestamps, and provider-specific risk details.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AssetRiskName** | Optional | string | The normalized name of the risk or threat associated with the asset. |
| **AssetRiskLevel** | Optional | Enumerated | The normalized risk level assigned to the asset. The allowed values are: `Info`, `Low`, `Medium`, `High`, `Critical`, `Other`. |
| **AssetOriginalRiskLevel** | Optional | string | The risk level assigned to the asset as reported by the source system, before normalization. |
| **AssetRiskFirstReportedTime** | Optional | datetime | The timestamp (UTC) of when the risk associated with the asset was first reported. |
| **AssetRiskLastReportedTime** | Optional | datetime | The timestamp (UTC) of when the risk associated with the asset was most recently reported. |
| **AssetOriginalRiskDetails** | Optional | dynamic | The full risk details for the asset as provided by the source system. |

### <a id="file-fields">File (asset type) fields</a>

This section captures file-specific asset properties. The properties should be populated if the `AssetType` is **File**.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **FilePath** | Optional | string | The full path of the file associated with the asset. |
| **FileSize** | Optional | long | The size of the file in bytes. |
| **FileMD5** | Optional | string | The MD5 hash of the file associated with the asset. |
| **FileSHA1** | Optional | string | The SHA-1 hash of the file associated with the asset. |
| **FileSHA256** | Optional | string | The SHA-256 hash of the file associated with the asset. |
| **FileSHA512** | Optional | string | The SHA-512 hash of the file associated with the asset. |
| **FileExtension** | Optional | string | The file extension of the file associated with the asset, such as .exe or .pdf. |
| **FileIsSignatureValid** | Optional | bool | Indicates whether the digital signature of the file is valid. |
| **FileSignatureDetails** | Optional | string | Details about the digital signature of the file, such as the signer or certificate information. |

### <a id="site-fields">Site (asset type) fields</a>

This section captures site-specific location properties for sharepoint site assets. The properties should be populated if the `AssetType` is **Site**.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **SitePath** | Optional | string | The path of the site or storage location associated with the asset. |
| **SitePrimaryUri** | Optional | string | The primary URI of the site or storage location associated with the asset. |

### Aliases

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **AssetPath** | Alias | string | The alias for either `FilePath` or `SitePath` |
| **User** | Alias | string | The alias for `AssetOwnerId`. |

## Schema updates

The following are the changes in various versions of the schema:

- **Version 0.1.0**: Initial release.

## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
