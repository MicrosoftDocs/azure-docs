---
title: Scans and ingestion
description: This article explains scans and ingestion in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/18/2021
---

# Scans and ingestion in Azure Purview

This article provides an overview of the Scanning and Ingestion features in Azure Purview. These features connect your Purview account to your sources to populate the data map and data catalog so you can begin exploring and managing your data through Purview.

## Scanning

After data sources are [registered](manage-data-sources.md) in your Purview account, the next step is to scan the data sources. The scanning process establishes a connection to the data source and captures technical metadata like names, file size, columns, and so on. It also extracts schema for structured data sources, applies classifications on schemas, and [applies sensitivity labels if your Purview account is connected to a Microsoft 365 Security and Compliance Center (SCC)](create-sensitivity-label.md). The scanning process can be triggered to run immediately or can be scheduled to run on a periodic basis to keep your Purview account up to date.

For each scan there are customizations you can apply so that you're only scanning your sources for the information you need.

### Scope your scan

When scanning a source, you have a choice to scan the entire data source or choose only specific entities (folders/tables) to scan. Available options depend on the source you're scanning, and can be defined for both one-time and scheduled scans.

For example, when [creating and running a scan for an Azure SQL Database](register-scan-azure-sql-database.md#creating-and-running-a-scan), you can choose which tables to scan, or select the entire database.

### Scan rule set

A scan rule set determines the kinds of information a scan will look for when it's running against one of your sources. Available rules depend on the kind of source you're scanning, but include things like the [file types](sources-and-scans.md#file-types-supported-for-scanning) you should scan, and the kinds of [classifications](supported-classifications.md) you need.

There are [system scan rule sets](create-a-scan-rule-set.md#system-scan-rule-sets) already available for many data source types, but you can also [create your own scan rule sets](create-a-scan-rule-set.md) to tailor your scans to your organization.

## Ingestion

The technical metadata or classifications identified by the scanning process are then sent to Ingestion. The ingestion process is responsible for populating the data map and is managed by Purview.  Ingestion analyses the input from scan, [applies resource set patterns](concept-resource-sets.md#how-azure-purview-detects-resource-sets), populates available [lineage](concept-data-lineage.md) information, and then loads the data map automatically. Assets/schemas can be discovered or curated only after ingestion is complete. So, if your scan is completed but you haven't seen your assets in the data map or catalog, you'll need to wait for the ingestion process to finish.

## Next steps

For more information, or for specific instructions for scanning sources, follow the links below.

* To understand resource sets, see our [resource sets article](concept-resource-sets.md).
* [How to register and scan an Azure SQL Database](register-scan-azure-sql-database.md#creating-and-running-a-scan)
* [Lineage in Azure Purview](catalog-lineage-user-guide.md)
