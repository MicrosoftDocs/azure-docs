---
title: Available Metadata for Power BI in the Microsoft Purview governance portal
description: This reference article provides a list of metadata that is available for a Power BI tenant in the Microsoft Purview governance portal.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: reference
ms.date: 07/13/2022
---

# Available Metadata for Power BI in the Microsoft Purview governance portal

|Metadata|Population method|Source of truth|Type|Asset type|Editable|Example|Upstream metadata|
|--------------|------|---------|-----------------|----------|------|-----------------|-----------------|
|Classification|	Manual|	Purview|	Business metadata|	All types|	Yes|	U.S. Social Security Number (SSN)|	N/A|
|Sensitivity Labels|	Automatic|	Purview|	Business metadata|	All types|	No|	Confidential|	See notes|
|Glossary terms|	Manual|	Purview|	Business metadata|	All types|	Yes|	Customer|	N/A|
|Collection|	Automatic|	Purview|	N/A|	All types|	|	NinjaSales|	N/A|
|Hierarchy|	Automatic|	Purview|	Technical metadata|	All types|	No|	|	N/A|
|qualifiedName|	Automatic|	Purview|	Technical metadata|	All types|	No|	https://app.powerbi.com/groups/657d261d-247b-4234-9c2d-515b0bbdd328/datasets/0a0ca805-3934-4265-be58-3afc833d8ac5|	N/A|
|Asset Description|	Automatic/Manual*|	Purview|	Business metadata|	All types|	Yes|	This is a description|	N/A|
|Contacts - Expert|	Manual|	Purview|	Business metadata|	All types|	Yes|	johnsmith@contoso.com|	N/A|
|Contacts - Owner|	Manual|	Purview|	Business metadata|	All types|	Yes|	Janedoe@contoso.com|	N/A|
|name|	Automatic|	Power BI|	Technical metadata|	Power BI Dashboard|	Yes|	Sales Dashboard|	dashboard.DisplayName|
|isReadOnly|	Automatic|	Power BI|	Technical metadata|	Power BI Dashboard|	No|	FALSE|	dashboard.IsReadOnly|
|EmbedUrl|	Automatic|	Power BI|	Technical metadata|	Power BI Dashboard|	No|	|	dashboard.EmbedUrl|
|tileNames|	Automatic|	Power BI|	Technical metadata|	Power BI Dashboard|	No|	"Count of ConcertId Count of CardType|"	TileTitles|
|Lineage|	Automatic|	Power BI|	Technical metadata|	Power BI Dashboard|	No|	N/A|	N/A|
|name|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	Yes|	Sales Dataflow|	dataflow.Name|
|configured by|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	No|	johnsmith@contoso.com|	dataflow.ConfiguredBy|
|description|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	Yes|	This is a Power BI data flow.|	dataflow.Description|
|ModelUrl|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	No|	|	dataflow.ModelUrl|
|ModifiedBy|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	No|	|	dataflow.ModifiedBy|
|ModifiedDateTime|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	No|	|	dataflow.ModifiedDateTime|
|Endorsement|	Automatic|	Power BI|	Technical metadata|	Power BI dataflow|	No|	Certified|	dataflow.EndorsementDetails|
|name|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	Yes|	Customer Profitability Sample|	dataset.Name|
|IsRefreshable|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	No|	TRUE|	dataset.IsRefreshable|
|configuredBy|	Automatic|	Power BI|	Business metadata|	Power BI Dataset|	No|	johnsmith@contoso.com|	dataset.ConfiguredBy|
|contentProviderType|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	No|	PbixInImportMode|	dataset.ContentProviderType|
|createdDate|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	No|	Wed Mar 10 2021 10:14:45 GMT-0500 (Eastern Standard Time)|	dataset.CreatedDateTime|
|targetStorageMode|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	No|	Abf|	dataset.TargetStorageMode|
|Schema|	Automatic/Manual|	Power BI|	Technical metadata|	Power BI Dataset|	| Field Name: CountryName, Column Level Classification: Country/Region, Glossary Term: Customer Country, Data Type: String. Asset description:Customer country |	N/A|
|Lineage|	Automatic|	Purview|	Technical metadata|	Power BI Dataset|	No|	|	N/A|
|description|	Automatic|	Power BI|	Business metadata|	Power BI Dataset|	Yes|	This is a Power BI Dataset.|	dataset.Description|
|Endorsement|	Automatic|	Power BI|	Technical metadata|	Power BI Dataset|	No|	Public|	dataset.EndorsementDetails|
|name|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	Yes|	Human Resources Sample|	report.Name|
|description|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	Yes|	This is a Power BI Report.|	report.Description|
|createdDateTime|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	Fri Feb 12 2021 20:27:34 GMT-0500 (Eastern Standard Time)|	report.CreatedDateTime|
|WebUrl|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	|	report.WebUrl|
|EmbedUrl|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	|	report.EmbedUrl|
|PBIDatasetId|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	|	report.DatasetId;|
|modifiedBy|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	Janedoe@contoso.com|	report.ModifiedBy|
|modifiedDateTime|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	Wed Mar 10 2021 13:50:33 GMT-0500 (Eastern Standard Time)|	report.ModifiedDateTime|
|reportType|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	PowerBIReport|	report.ReportType|
|Endorsement|	Automatic|	Power BI|	Technical metadata|	Power BI Report|	No|	Sensitive|	report.EndorsementDetails|
|Lineage|	Automatic|	Purview|	Technical metadata|	Power BI Report|	No|	N/A|	N/A|
|name|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	Yes|	SalesNA|	workspace.Name|
|Description|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	Yes|	This is a Power BI Workspace.|	workspace.Description|
|state|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	No|	Active|	workspace.State|
|type|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	No|	workspace|	ResourceType.Workspace|
|IsReadOnly|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	No|	FALSE|	workspace.IsReadOnly|
|IsOnDedicatedCapacity|	Automatic|	Power BI|	Technical metadata|	Power BI Workspace|	No|	TRUE|	workspace.IsOnDedicatedCapacity|


## Next steps

- [Register and scan a Power BI tenant](register-scan-power-bi-tenant.md)
- [Register and scan Power BI across tenants](register-scan-power-bi-cross-tenant.md)
- [Register and scan Power BI troubleshooting](register-scan-power-bi-troubleshoot.md)
