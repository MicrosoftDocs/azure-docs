---
title: Available metadata for Power BI in the Microsoft Purview governance portal
description: This reference article provides a list of metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: reference
ms.date: 08/02/2022
---

# Available metadata

This article has a list of the metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.

## Power BI

| Metadata              | Population method | Source of truth   | Asset type         | Editable | Upstream metadata               |
|-----------------------|-------------------|-------------------|--------------------|----------|---------------------------------|
| Classification        | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Sensitivity Labels    | Automatic         | Microsoft Purview | All types          | No       |                                 |
| Glossary terms        | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Collection            | Automatic         | Microsoft Purview | All types          |          | N/A                             |
| Hierarchy             | Automatic         | Microsoft Purview | All types          | No       | N/A                             |
| qualifiedName         | Automatic         | Microsoft Purview | All types          | No       |                                 |
| Asset Description     | Automatic/Manual* | Microsoft Purview | All types          | Yes      | N/A                             |
| Contacts - Expert     | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| Contacts - Owner      | Manual            | Microsoft Purview | All types          | Yes      | N/A                             |
| name                  | Automatic         | Power BI          | Power BI Dashboard | Yes      | dashboard.DisplayName           |
| isReadOnly            | Automatic         | Power BI          | Power BI Dashboard | No       | dashboard.IsReadOnly            |
| EmbedUrl              | Automatic         | Power BI          | Power BI Dashboard | No       | dashboard.EmbedUrl              |
| tileNames             | Automatic         | Power BI          | Power BI Dashboard | No       | TileTitles                      |
| Lineage               | Automatic         | Power BI          | Power BI Dashboard | No       | N/A                             |
| name                  | Automatic         | Power BI          | Power BI dataflow  | Yes      | dataflow.Name                   |
| configured by         | Automatic         | Power BI          | Power BI dataflow  | No       | dataflow.ConfiguredBy           |
| description           | Automatic         | Power BI          | Power BI dataflow  | Yes      | dataflow.Description            |
| ModelUrl              | Automatic         | Power BI          | Power BI dataflow  | No       | dataflow.ModelUrl               |
| ModifiedBy            | Automatic         | Power BI          | Power BI dataflow  | No       | dataflow.ModifiedBy             |
| ModifiedDateTime      | Automatic         | Power BI          | Power BI dataflow  | No       | dataflow.ModifiedDateTime       |
| Endorsement           | Automatic         | Power BI          | Power BI dataflow  | No       | dataflow.EndorsementDetails     |
| name                  | Automatic         | Power BI          | Power BI Dataset   | Yes      | dataset.Name                    |
| IsRefreshable         | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.IsRefreshable           |
| configuredBy          | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.ConfiguredBy            |
| contentProviderType   | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.ContentProviderType     |
| createdDate           | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.CreatedDateTime         |
| targetStorageMode     | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.TargetStorageMode       |
| Schema                | Automatic/Manual  | Power BI          | Power BI Dataset   |          |                                 |
| Lineage               | Automatic         | Microsoft Purview | Power BI Dataset   | No       |                                 |
| description           | Automatic         | Power BI          | Power BI Dataset   | Yes      | dataset.Description             |
| Endorsement           | Automatic         | Power BI          | Power BI Dataset   | No       | dataset.EndorsementDetails      |
| name                  | Automatic         | Power BI          | Power BI Report    | Yes      | report.Name                     |
| description           | Automatic         | Power BI          | Power BI Report    | Yes      | report.Description              |
| createdDateTime       | Automatic         | Power BI          | Power BI Report    | No       | report.CreatedDateTime          |
| WebUrl                | Automatic         | Power BI          | Power BI Report    | No       | report.WebUrl                   |
| EmbedUrl              | Automatic         | Power BI          | Power BI Report    | No       | report.EmbedUrl                 |
| PBIDatasetId          | Automatic         | Power BI          | Power BI Report    | No       | report.DatasetId;               |
| modifiedBy            | Automatic         | Power BI          | Power BI Report    | No       | report.ModifiedBy               |
| modifiedDateTime      | Automatic         | Power BI          | Power BI Report    | No       | report.ModifiedDateTime         |
| reportType            | Automatic         | Power BI          | Power BI Report    | No       | report.ReportType               |
| Endorsement           | Automatic         | Power BI          | Power BI Report    | No       | report.EndorsementDetails       |
| Lineage               | Automatic         | Microsoft Purview | Power BI Report    | No       | N/A                             |
| name                  | Automatic         | Power BI          | Power BI Workspace | Yes      | workspace.Name                  |
| Description           | Automatic         | Power BI          | Power BI Workspace | Yes      | workspace.Description           |
| state                 | Automatic         | Power BI          | Power BI Workspace | No       | workspace.State                 |
| type                  | Automatic         | Power BI          | Power BI Workspace | No       | ResourceType.Workspace          |
| IsReadOnly            | Automatic         | Power BI          | Power BI Workspace | No       | workspace.IsReadOnly            |
| IsOnDedicatedCapacity | Automatic         | Power BI          | Power BI Workspace | No       | workspace.IsOnDedicatedCapacity |


## Next steps

- [Register and scan a Power BI tenant](register-scan-power-bi-tenant.md)
- [Register and scan Power BI across tenants](register-scan-power-bi-tenant-cross-tenant.md)
- [Register and scan Power BI troubleshooting](register-scan-power-bi-tenant-troubleshoot.md)
