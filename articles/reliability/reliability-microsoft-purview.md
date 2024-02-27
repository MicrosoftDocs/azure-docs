---
title: Reliability in Microsoft Purview for governance experiences
description: Find out about reliability in Microsoft Purview for governance experiences
author: whhender
ms.author: whhender
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: purview
ms.date: 01/24/2024
---

# Reliability in Microsoft Purview

This article describes reliability support in Microsoft Purview for governance experiences, and covers both regional resiliency with [availability zones](#availability-zone-support) and [disaster recovery and business continuity](#disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/well-architected/reliability/).

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

Microsoft Purview makes commercially reasonable efforts to support zone-redundant availability zones, where resources automatically replicate across zones, without any need for you to set up or configure.

### Prerequisites

- Microsoft Purview governance experience currently provides partial availablility-zone support in [a limited number of regions](#supported-regions). This partial availability-zone support covers experiences (and/or certain functionalities within an experience).
- Zone availability might or might not be available for Microsoft Purview governance experiences or features/functionalities that are in preview.

### Supported regions

Microsoft Purview makes commercially reasonable efforts to provide availability zone support in various regions as follows:

| Region | Data Map | Scan | Policy | Insights |
| ---    | ---      | ---  | ---    | ---      |
|Southeast Asia||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|East US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Australia East|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|West US 2||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Canada Central|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Central India||:::image type="icon" source="media/yes-icon.svg":::|||
|East US 2||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|France Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Germany West Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Japan East||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Korea Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|West US 3||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|North Europe||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|South Africa North||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Sweden Central|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Switzerland North||:::image type="icon" source="media/yes-icon.svg":::|||
|USGov Virginia|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|South Central US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Brazil South||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|UK South|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Qatar Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|China North 3|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|West Europe||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|

## Disaster recovery and business continuity

[!INCLUDE [next step](includes/reliability-disaster-recovery-description-include.md)]

There's some key information to consider upfront:

- It isn't advisable to back up "scanned" assets' details. You should only back up the curated data such as mapping of classifications and glossaries on assets. The only case when you need to back up assets' details is when you have custom assets via custom `typeDef`.

- The backed-up asset count should be fewer than 100,000 assets. The main driver is that you have to use the search query API to get the assets, which have limitation of 100,000 assets returned. However, if you're able to segment the search query to get smaller number of assets per API call, it's possible to back up more than 100,000 assets.

- The goal is to perform one time migration. If you wish to continuously "sync" assets between two accounts, there are other steps that won't be covered in detail by this article. You have to use [Microsoft Purview's Event Hubs to subscribe and create entities to another account](/purview/manage-kafka-dotnet). However, Event Hubs only has Atlas information. Microsoft Purview has added other capabilities such as **glossaries** and **contacts** which won't be available via Event Hubs.

### Identify key requirements

Most of enterprise organizations have critical requirement for Microsoft Purview for capabilities such as Backup, Business Continuity, and Disaster Recovery (BCDR). To get into more details of this requirement, you need to differentiate between Backup, High Availability (HA), and Disaster recovery (DR).

While they're similar, HA keeps the service operational if there was a hardware fault, for example, but it wouldn't protect you if someone accidentally or deliberately deleted all the records in your database. For that, you might need to restore the service from a backup.

### Backup

You might need to create regular backups from a Microsoft Purview account and use a backup in case a piece of data or configuration is accidentally or deliberately deleted from the Microsoft Purview account by the users.

The backup should allow saving a point in time copy of the following configurations from the Microsoft Purview account:

- Account information (for example, Friendly name)
- Collection structure and role assignments
- Custom Scan rule sets, classifications, and classification rules
- Registered data sources
- Scan information
- Create and maintain key vaults connections
- Key vault connections and Credentials and relations with current scans
- Registered SHIRs
- Glossary terms templates
- Glossary terms
- Manual asset updates (including classification and glossary assignments)
- ADF and Synapse connections and lineage

Backup strategy is determined by restore strategy, or more specifically how long it will take to restore things when a disaster occurs. To answer that, you might need to engage with the affected stakeholders (the business owners) and understand what the required recovery objectives are.

There are three main requirements to take into consideration:

- **Recover Time Objective (RTO)** – Defines the maximum allowable downtime following a disaster for which ideally the system should be back operational.
- **Recovery Point Objective (RPO)** – Defines the acceptable amount of data loss that is ok following a disaster. Normally RPO is expressed as a timeframe in hours or minutes.
- **Recovery Level Object (RLO)** – Defines the granularity of the data being restored. It could be a SQL server, a set of databases, tables, records, etc.

To implement disaster recovery for Microsoft Purview, see the [Microsoft Purview disaster recovery documentation.](/purview/concept-best-practices-migration#implementation-steps)

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/well-architected/reliability/)
