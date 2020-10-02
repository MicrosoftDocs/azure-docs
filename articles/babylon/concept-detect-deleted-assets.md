---
title: How scans detect deleted assets in Azure Data Catalog (Preview)
description: This article explains how Azure Data Catalog (Preview) detects deleted assets during scans.
author: yaronyg
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 05/08/2020
---

# How scanning detects deleted assets

This article helps you understand how Babylon detects deleted assets during scanning.

## Background info

Right now the catalog only talks to stores via scanning. So if we want to know if a file or table or container has been deleted, we have to check our last scan output against our current scan output and see if anything is missing.

In other words, imagine that the last time we scanned Azure Data Lake Storage Gen2, we saw a folder named "foo." In a later scan, we don't see a folder named "foo." Then we can assume the folder has been deleted.

## Detecting deleted files

Our logic for detecting missing files even works across completely different scans. For example, imagine that a user runs a one-time scan on a Data Lake Storage Gen2 account on folders A, B, and C. Later, a different user who's using the same catalog runs a different one-time scan on the same Data Lake Storage Gen2 account on folders C, D, and E. Now the catalog has had a chance to scan folder C twice. So now the catalog can check for deletions on folder C. Folders A, B, D, and E would not be checked for deleted assets because they have been scanned only once.

To keep deleted files out of your catalog, it's important to run regular scans. But remember, we can't detect deleted assets until another scan is run. So if scans are run once a month on a particular store, then we won't detect any deleted data assets in that store until the next scan a month later.

When we're enumerating large data stores like Data Lake Storage Gen2, there are multiple ways (including enumeration errors and dropped events) to miss information. We can miss that a file was created. We can also miss that a file was deleted. 

If we aren't 100 percent sure a file has been deleted, then we won't delete it in the catalog. This means we'll have errors where a file that doesn't exist in the underlying store might still exist in the catalog. In some cases, a store might have to be scanned two or three times before we catch some deleted assets.

In the long term, we can use a system  like Azure Event Grid with Azure Storage support for reliable notifications of file deletions.

## Next steps

To get started with Data Catalog, see [Quickstart: Create a Babylon Account](create-catalog-portal.md).
