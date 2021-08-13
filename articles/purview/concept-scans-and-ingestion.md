---
title: Scans and ingestion
description: This article explains scans and ingestion in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/16/2021
---

# Scans and ingestion in Azure Purview

This article provides an overview of Scanning and Ingestion features in Azure Purview.

## Scanning

After the data sources are registered in Purview account, the next step is to scan the data sources. Scanning process establishes a connection to the data source and captures technical metadata like names, file size etc., extracts schema for structure data sources, applies classifications on schemas and also applies sensitivity labels if your Purview account is connected to Microsoft 365 Security and Compliance Center (SCC) [Apply Sensitivity Label](create-sensitivity-label.md). Scanning process can be triggered to run immediately or can be scheduled to run on a periodic basis.

## Scope your scan

You have a choice to scan the entire data source or select the entities (folders/tables) you want to scan. This is determined in scope your scan section.

## Scan rule set

A scan rule determines the rules, which are associated to a scan and applied to the data source during scanning process. It contains a list of classifications that can be applied on schemas discovered during scanning or file types to be included for file based sources.

> [!Note]
> Scoping the scans or Scan rule sets are not available to all data sources. See [Scan Rule Sets](create-a-scan-rule-set.md).

## Ingestion
Ingestion process is responsible for populating the data map. The tech metadata or classifications identified by scanning process is then sent to Ingestion. Ingestion analyses the input from scan, applies resource set patterns and policies and then loads the data map automatically. The assets/schemas can be discovered or curated only after ingestion is complete. A resource set is a single representation in Purview for a large number of data assets on data source. Ingestion process also populates lineage graph from external connections  like Azure Data Factory and Synapse. Ingested assets are discoverable and consumable within the data catalog.

## Next steps

To understand about resource sets, see our [resource sets article](concept-resource-sets.md).


