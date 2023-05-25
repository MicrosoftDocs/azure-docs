---
title: Available metadata for Power BI in the Microsoft Purview governance portal
description: This reference article provides a list of metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: reference
ms.date: 01/31/2023
---

# Available metadata for Power BI in the Microsoft Purview Data Catalog

This article has a list of the metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.

## Power BI

| Metadata              | Population method | Source of truth   | Asset type         | Editable | Upstream metadata               |
| --------------------- | ----------------- | ----------------- | ------------------ | -------- | ------------------------------- |
| Classification        | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Sensitivity Labels    | Automatic         | Microsoft Purview | All types          | No       |                                 |
| Glossary terms        | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Collection            | Automatic         | Microsoft Purview | All types          | Yes      | N/A                             |
| Hierarchy             | Automatic         | Microsoft Purview | All types          | No       | N/A                             |
| qualifiedName         | Automatic         | Microsoft Purview | All types          | No       | N/A                             |
| Asset Description     | Automatic/Manual* | Microsoft Purview | All types          | Yes      | N/A                             |
| Contacts - Expert     | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Contacts - Owner      | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| name                  | Automatic         | Power BI          | Power BI Dashboard | Yes      | dashboard.DisplayName           |
| isReadOnly            | Automatic         | Power BI          | Power BI Dashboard | No       | dashboard.IsReadOnly            |
| embedUrl              | Automatic         | Power BI          | Power BI Dashboard | No       | dashboard.EmbedUrl              |
| tileNames             | Automatic         | Power BI          | Power BI Dashboard | No       | TileTitles                      |
| users                 | Automatic         | Power BI          | Power BI Dashboard | No       | dashboard.Users                 |
| Lineage               | Automatic         | Power BI          | Power BI Dashboard | No       | N/A                             |
| name                  | Automatic         | Power BI          | Power BI Dataflow  | Yes      | dataflow.Name                   |
| description           | Automatic         | Power BI          | Power BI Dataflow  | Yes      | dataflow.Description            |
| configuredBy          | Automatic         | Power BI          | Power BI Dataflow  | No       | dataflow.ConfiguredBy           |
| modifiedBy            | Automatic         | Power BI          | Power BI Dataflow  | No       | dataflow.ModifiedBy             |
| modifiedDateTime      | Automatic         | Power BI          | Power BI Dataflow  | No       | dataflow.ModifiedDateTime       |
| Endorsement           | Automatic         | Power BI          | Power BI Dataflow  | No       | dataflow.EndorsementDetails     |
| users                 | Automatic         | Power BI          | Power BI Dataflow  | No       | dataflow.Users                  |
| Lineage               | Automatic         | Microsoft Purview | Power BI Dataflow  | No       |                                 |
| name                  | Automatic         | Power BI          | Power BI Datamart  | Yes      | datamart.Name                   |
| description           | Automatic         | Power BI          | Power BI Datamart  | Yes      | datamart.Description            |
| configuredBy          | Automatic         | Power BI          | Power BI Datamart  | No       | datamart.ConfiguredBy           |
| modifiedBy            | Automatic         | Power BI          | Power BI Datamart  | No       | datamart.ModifiedBy             |
| modifiedDateTime      | Automatic         | Power BI          | Power BI Datamart  | No       | datamart.ModifiedDateTime       |
| Endorsement           | Automatic         | Power BI          | Power BI Datamart  | No       | datamart.EndorsementDetails     |
| users                 | Automatic         | Power BI          | Power BI Datamart  | No       | datamart.Users                  |
| Lineage               | Automatic         | Microsoft Purview | Power BI Datamart  | No       |                                 |
| name                  | Automatic         | Power BI          | Power BI Dataset   | Yes      | dataset.Name                    |
| description           | Automatic         | Power BI          | Power BI Dataset   | Yes      | dataset.Description             |
| isRefreshable         | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.IsRefreshable           |
| configuredBy          | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.ConfiguredBy            |
| contentProviderType   | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.ContentProviderType     |
| createdDate           | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.CreatedDateTime         |
| targetStorageMode     | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.TargetStorageMode       |
| Schema                | Automatic/Manual  | Power BI          | Power BI Dataset   |          | tables & columns                |
| Endorsement           | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.EndorsementDetails      |
| users                 | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.Users                   |
| Lineage               | Automatic         | Microsoft Purview | Power BI Dataset   | No       |                                 |
| name                  | Automatic         | Power BI          | Power BI Report    | Yes      | report.Name                     |
| description           | Automatic         | Power BI          | Power BI Report    | Yes      | report.Description              |
| createdDateTime       | Automatic         | Power BI          | Power BI Report    | No       | report.CreatedDateTime          |
| webUrl                | Automatic         | Power BI          | Power BI Report    | No       | report.WebUrl                   |
| embedUrl              | Automatic         | Power BI          | Power BI Report    | No       | report.EmbedUrl                 |
| PBIDatasetId          | Automatic         | Power BI          | Power BI Report    | No       | report.DatasetId                |
| modifiedBy            | Automatic         | Power BI          | Power BI Report    | No       | report.ModifiedBy               |
| modifiedDateTime      | Automatic         | Power BI          | Power BI Report    | No       | report.ModifiedDateTime         |
| reportType            | Automatic         | Power BI          | Power BI Report    | No       | report.ReportType               |
| Endorsement           | Automatic         | Power BI          | Power BI Report    | No       | report.EndorsementDetails       |
| users                 | Automatic         | Power BI          | Power BI Report    | No       | report.Users                    |
| Lineage               | Automatic         | Microsoft Purview | Power BI Report    | No       | N/A                             |
| name                  | Automatic         | Power BI          | Power BI Workspace | Yes      | workspace.Name                  |
| description           | Automatic         | Power BI          | Power BI Workspace | Yes      | workspace.Description           |
| state                 | Automatic         | Power BI          | Power BI Workspace | No       | workspace.State                 |
| type                  | Automatic         | Power BI          | Power BI Workspace | No       | ResourceType.Workspace          |
| IsReadOnly            | Automatic         | Power BI          | Power BI Workspace | No       | workspace.IsReadOnly            |
| IsOnDedicatedCapacity | Automatic         | Power BI          | Power BI Workspace | No       | workspace.IsOnDedicatedCapacity |
| users                 | Automatic         | Power BI          | Power BI Workspace | No       | workspace.Users                 |

## Next steps

- [Connect to and manage a Power BI tenant](register-scan-power-bi-tenant.md)
- [Connect to and manage Power BI across tenants](register-scan-power-bi-tenant-cross-tenant.md)
- [Connect to and manage Power BI troubleshooting](register-scan-power-bi-tenant-troubleshoot.md)
