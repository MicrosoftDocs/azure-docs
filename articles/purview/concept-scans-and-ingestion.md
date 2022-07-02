---
title: Scans and ingestion
description: This article explains scans and ingestion in Microsoft Purview.
author: heniot
ms.author: shjia
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 08/18/2021
ms.custom: ignite-fall-2021
---

# Scans and ingestion in Microsoft Purview

This article provides an overview of the Scanning and Ingestion features in Microsoft Purview. These features connect your Microsoft Purview account to your sources to populate the data map and data catalog so you can begin exploring and managing your data through Microsoft Purview.

## Scanning

After data sources are [registered](manage-data-sources.md) in your Microsoft Purview account, the next step is to scan the data sources. The scanning process establishes a connection to the data source and captures technical metadata like names, file size, columns, and so on. It also extracts schema for structured data sources, applies classifications on schemas, and [applies sensitivity labels if your Microsoft Purview Data Map is connected to a Microsoft Purview compliance portal](create-sensitivity-label.md). The scanning process can be triggered to run immediately or can be scheduled to run on a periodic basis to keep your Microsoft Purview account up to date.

For each scan there are customizations you can apply so that you're only scanning your sources for the information you need.

### Choose an authentication method for your scans

Microsoft Purview is secure by default. No passwords or secrets are stored directly in Microsoft Purview, so you’ll need to choose an authentication method for your sources. There are several possible ways to authenticate your Microsoft Purview account, but not all methods are supported for each data source.
 - Managed Identity
 - Service Principal
 - SQL Authentication
 - Windows Authentication
 - Role ARN
 - Delegated Authentication
 - Consumer Key
 - Account Key or Basic Authentication

Whenever possible, a Managed Identity is the preferred authentication method because it eliminates the need for storing and managing credentials for individual data sources. This can greatly reduce the time you and your team spend setting up and troubleshooting authentication for scans. When you enable a managed identity for your Microsoft Purview account, an identity is created in Azure Active Directory and is tied to the lifecycle of your account. 

### Scope your scan

When scanning a source, you have a choice to scan the entire data source or choose only specific entities (folders/tables) to scan. Available options depend on the source you're scanning, and can be defined for both one-time and scheduled scans.

For example, when [creating and running a scan for an Azure SQL Database](register-scan-azure-sql-database.md#creating-the-scan), you can choose which tables to scan, or select the entire database.

### Scan rule set

A scan rule set determines the kinds of information a scan will look for when it's running against one of your sources. Available rules depend on the kind of source you're scanning, but include things like the [file types](sources-and-scans.md#file-types-supported-for-scanning) you should scan, and the kinds of [classifications](supported-classifications.md) you need.

There are [system scan rule sets](create-a-scan-rule-set.md#system-scan-rule-sets) already available for many data source types, but you can also [create your own scan rule sets](create-a-scan-rule-set.md) to tailor your scans to your organization.

### Schedule your scan

Microsoft Purview gives you a choice of scanning weekly or monthly at a specific time you choose. Weekly scans may be appropriate for data sources with structures that are actively under development or frequently change. Monthly scanning is more appropriate for data sources that change infrequently. A good best practice is to work with the administrator of the source you want to scan to identify a time when compute demands on the source are low.

### How scans detect deleted assets

A Microsoft Purview catalog is only aware of the state of a data store when it runs a scan. For the catalog to know if a file, table, or container was deleted, it compares the last scan output against the current scan output. For example, suppose that the last time you scanned an Azure Data Lake Storage Gen2 account, it included a folder named *folder1*. When the same account is scanned again, *folder1* is missing. Therefore, the catalog assumes the folder has been deleted.

#### Detecting deleted files

The logic for detecting missing files works for multiple scans by the same user as well as by different users. For example, suppose a user runs a one-time scan on a Data Lake Storage Gen2 data store on folders A, B, and C. Later, a different user in the same account runs a different one-time scan on folders C, D, and E of the same data store. Because folder C was scanned twice, the catalog checks it for possible deletions. Folders A, B, D, and E, however, were scanned only once, and the catalog won't check them for deleted assets.

To keep deleted files out of your catalog, it's important to run regular scans. The scan interval is important, because the catalog can't detect deleted assets until another scan is run. So, if you run scans once a month on a particular store, the catalog can't detect any deleted data assets in that store until you run the next scan a month later.

When you enumerate large data stores like Data Lake Storage Gen2, there are multiple ways (including enumeration errors and dropped events) to miss information. A particular scan might miss that a file was created or deleted. So, unless the catalog is certain a file was deleted, it won't delete it from the catalog. This strategy means there can be errors when a file that doesn't exist in the scanned data store still exists in the catalog. In some cases, a data store might need to be scanned two or three times before it catches certain deleted assets.

> [!NOTE]
> Assets that are marked for deletion are deleted after a successful scan. Deleted assets might continue to be visible in your catalog for some time before they are processed and removed.

## Ingestion

The technical metadata or classifications identified by the scanning process are then sent to Ingestion. The ingestion process is responsible for populating the data map and is managed by Microsoft Purview.  Ingestion analyses the input from scan, [applies resource set patterns](concept-resource-sets.md#how-microsoft-purview-detects-resource-sets), populates available [lineage](concept-data-lineage.md) information, and then loads the data map automatically. Assets/schemas can be discovered or curated only after ingestion is complete. So, if your scan is completed but you haven't seen your assets in the data map or catalog, you'll need to wait for the ingestion process to finish.

## Next steps

For more information, or for specific instructions for scanning sources, follow the links below.

* To understand resource sets, see our [resource sets article](concept-resource-sets.md).
* [How to register and scan an Azure SQL Database](register-scan-azure-sql-database.md#creating-the-scan)
* [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
