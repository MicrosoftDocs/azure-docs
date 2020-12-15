---
title: How scans detect deleted assets
description: This article explains how an Azure Purview account detects deleted assets during scans.
author: yaronyg
ms.author: yarong
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 10/16/2020
---

# How scans detect deleted assets

This article describes how Azure Purview uses scan results to detect deleted assets.

## Background info

An Azure Purview catalog is aware of the state of a data store only when it  scans it. For the catalog to know if a file, table, or container was deleted, it compares the last scan output against the current scan output. For example, suppose that the last time you scanned an Azure Data Lake Storage Gen2 account, it included a folder named *folder1*. When the same account is scanned again, *folder1* is missing. Therefore, the catalog assumes the folder has been deleted.

## Detecting deleted files

The logic for detecting missing files works for multiple scans by the same user as well as by different users. For example, suppose a user runs a one-time scan on a Data Lake Storage Gen2 data store on folders A, B, and C. Later, a different user in the same account runs a different one-time scan on folders C, D, and E of the same data store. Because folder C was scanned twice, the catalog checks it for possible deletions. Folders A, B, D, and E, however, were scanned only once, and the catalog won't check them for deleted assets.

To keep deleted files out of your catalog, it's important to run regular scans. The scan interval is important, because the catalog can't detect deleted assets until another scan is run. So, if you run scans once a month on a particular store, the catalog can't detect any deleted data assets in that store until you run the next scan a month later.

When you enumerate large data stores like Data Lake Storage Gen2, there are multiple ways (including enumeration errors and dropped events) to miss information. A particular scan might miss that a file was created or deleted. So, unless the catalog is certain a file was deleted, it won't delete it from the catalog. This strategy means there can be errors when a file that doesn't exist in the scanned data store still exists in the catalog. In some cases, a data store might need to be scanned two or three times before it catches certain deleted assets.

## Next steps

To get started with Azure Purview catalogs, see [Quickstart: Create a Purview account](create-catalog-portal.md).
