---
title: Available metadata for Power BI in the Microsoft Purview governance portal
description: This reference article provides a list of metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: reference
ms.date: 08/02/2022
---

# Available metadata for Power BI

This article has a list of the metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.

| Metadata              | Population method | Source of truth | Asset type         | Editable  | Upstream metadata               |
|-----------------------|-------------------|-----------------|--------------------|-----------|---------------------------------|
| Asset Description     | Automatic/Manual* | Purview         | All types          | Yes       | N/A                             |
| Classification        | Manual            | Purview         | All types          | Yes       | N/A                             |
| Collection            | Automatic         | Purview         | N/A                | All types | N/A                             |
| configured by         | Automatic         | Power BI        | Power BI dataflow  | No        | dataflow.ConfiguredBy           |
| configuredBy          | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.ConfiguredBy            |
| Contacts - Expert     | Manual            | Purview         | All types          | Yes       | N/A                             |
| Contacts - Owner      | Manual            | Purview         | All types          | Yes       | N/A                             |
| contentProviderType   | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.ContentProviderType     |
| createdDate           | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.CreatedDateTime         |
| createdDateTime       | Automatic         | Power BI        | Power BI Report    | No        | report.CreatedDateTime          |
| description           | Automatic         | Power BI        | Power BI dataflow  | Yes       | dataflow.Description            |
| description           | Automatic         | Power BI        | Power BI Dataset   | Yes       | dataset.Description             |
| description           | Automatic         | Power BI        | Power BI Report    | Yes       | report.Description              |
| Description           | Automatic         | Power BI        | Power BI Workspace | Yes       | workspace.Description           |
| EmbedUrl              | Automatic         | Power BI        | Power BI Dashboard | No        | dashboard.EmbedUrl              |
| EmbedUrl              | Automatic         | Power BI        | Power BI Report    | No        | report.EmbedUrl                 |
| Endorsement           | Automatic         | Power BI        | Power BI dataflow  | No        | dataflow.EndorsementDetails     |
| Endorsement           | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.EndorsementDetails      |
| Endorsement           | Automatic         | Power BI        | Power BI Report    | No        | report.EndorsementDetails       |
| Glossary terms        | Manual            | Purview         | All types          | Yes       | N/A                             |
| Hierarchy             | Automatic         | Purview         | All types          | No        | N/A                             |
| IsOnDedicatedCapacity | Automatic         | Power BI        | Power BI Workspace | No        | workspace.IsOnDedicatedCapacity |
| isReadOnly            | Automatic         | Power BI        | Power BI Dashboard | No        | dashboard.IsReadOnly            |
| IsReadOnly            | Automatic         | Power BI        | Power BI Workspace | No        | workspace.IsReadOnly            |
| IsRefreshable         | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.IsRefreshable           |
| Lineage               | Automatic         | Power BI        | Power BI Dashboard | No        | N/A                             |
| Lineage               | Automatic         | Purview         | Power BI Dataset   | No        | N/A                             |
| Lineage               | Automatic         | Purview         | Power BI Report    | No        | N/A                             |
| ModelUrl              | Automatic         | Power BI        | Power BI dataflow  | No        | dataflow.ModelUrl               |
| ModifiedBy            | Automatic         | Power BI        | Power BI dataflow  | No        | dataflow.ModifiedBy             |
| modifiedBy            | Automatic         | Power BI        | Power BI Report    | No        | report.ModifiedBy               |
| ModifiedDateTime      | Automatic         | Power BI        | Power BI dataflow  | No        | dataflow.ModifiedDateTime       |
| modifiedDateTime      | Automatic         | Power BI        | Power BI Report    | No        | report.ModifiedDateTime         |
| name                  | Automatic         | Power BI        | Power BI Dashboard | Yes       | dashboard.DisplayName           |
| name                  | Automatic         | Power BI        | Power BI dataflow  | Yes       | dataflow.Name                   |
| name                  | Automatic         | Power BI        | Power BI Dataset   | Yes       | dataset.Name                    |
| name                  | Automatic         | Power BI        | Power BI Report    | Yes       | report.Name                     |
| name                  | Automatic         | Power BI        | Power BI Workspace | Yes       | workspace.Name                  |
| PBIDatasetId          | Automatic         | Power BI        | Power BI Report    | No        | report.DatasetId;               |
| qualifiedName         | Automatic         | Purview         | All types          | No        | N/A                             |
| reportType            | Automatic         | Power BI        | Power BI Report    | No        | report.ReportType               |
| Schema                | Automatic/Manual  | Power BI        | Power BI Dataset   |           | N/A                             |
| Sensitivity Labels    | Automatic         | Purview         | All types          | No        | See notes                       |
| state                 | Automatic         | Power BI        | Power BI Workspace | No        | workspace.State                 |
| targetStorageMode     | Automatic         | Power BI        | Power BI Dataset   | No        | dataset.TargetStorageMode       |
| tileNames             | Automatic         | Power BI        | Power BI Dashboard | No        | TileTitles                      |
| type                  | Automatic         | Power BI        | Power BI Workspace | No        | ResourceType.Workspace          |
| WebUrl                | Automatic         | Power BI        | Power BI Report    | No        | report.WebUrl                   |

## Next steps

- [Register and scan a Power BI tenant](register-scan-power-bi-tenant.md)
- [Register and scan Power BI across tenants](register-scan-power-bi-tenant-cross-tenant.md)
- [Register and scan Power BI troubleshooting](register-scan-power-bi-tenant-troubleshoot.md)
