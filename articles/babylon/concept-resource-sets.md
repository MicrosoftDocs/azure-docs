---
title: Resource Sets in Azure Data Catalog (Preview)
description: This article explains what resource sets are and how we create them
author: yaronyg
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 05/08/2020
---

# Resource Sets in Azure Data Catalog

This article helps you understand the Resource Set concept in Azure Data Catalog.

## Background info

At-scale data processing systems will store a single table as many files on disk.
This concept is represented in **Azure Data Catalog** using resource sets.

For example, imagine your spark cluster has persisted a DataFrame into ADLS Gen2.
While in Spark the table looks like a single resource, in fact, on disk there  are likely thousands of Parquet files that each represent a partition of the total DataFrame's contents. The DataFrame only exists to the extent that one has software like Spark that can view those thousands of partition files as a single logical resource.

IoT data as well as web log data have the same challenge. Imagine one has a sensor that outputs log files several times a second. It doesn't take long until one has hundreds of thousands of log files from that single sensor.

What users want is a single entry for the DataFrame or IoT Sensor or Web Log source. What they don't want are 1000s of individual parquet files, IoT sensor outputs or log files.

To address the challenge of mapping large numbers of data assets to a single logical resource we have introduced the concept of resource sets. A resource set is a single object in the catalog that represents a large number of assets in storage.

For now, we only support detecting resource sets in Azure Blobs, ADLS Gen1 and ADLS Gen2. We will expand the capability to other storage systems in the future where it makes sense.

## How we detect resource sets

We automatically detect resource sets via a feature called Automated Resource Set Discovery. This feature looks at all data we ingest via scanning and compares it to a set of patterns we have defined.

For example, imagine we see a resource whose URL is `https://myaccount.blob.core.windows.net/mycontainer/machinesets/23/foo.parquet`.

We would look at the path segments and see if they match any of our built-in patterns. We have patterns for GUIDs, numbers, date formats, localization codes (e.g. en-us), etc. In this case our number pattern would match "23". So we would assume that this file is part of a resource set named:

`https://myaccount.blob.core.windows.net/mycontainer/machinesets/{N}/foo.parquet`

Or if we had a URL like: `https://myaccount.blob.core.windows.net/mycontainer/weblogs/en_au/23.json`.

We would match both our localization pattern and our number pattern, producing a resource set named: `https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`.

So this would mean that all the following resources would be mapped to the same resource set:

`https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/1004.json`

`https://myaccount.blob.core.windows.net/mycontainer/weblogs/cy_gb/234.json`

`https://myaccount.blob.core.windows.net/mycontainer/weblogs/de_Ch/23434.json`

All of these resources would be mapped to the same, single, resource set:

`https://myaccount.blob.core.windows.net/mycontainer/weblogs/{LOC}/{N}.json`.

## How we scan resource sets

When we detect resources that we think are part of a resource set we switch from a full scan to a sample scan. In a sample scan we only open  a subset of the files that we think are in the resource set. For each of the files we do open we will pull out their schema and run our classifiers. We will then find the newest resource among those opened  and use that resource's schema and classifications in the entry for the entire resource set in the catalog.

## What we store about resource sets

In addition to the single schema and classifications we store from the latest partition resource we deep scanned we also store some aggregate information about the partition resources that make up the resource set.

We store a partition count that shows how many partition resources we found.

We store a schema count that shows how many unique schemas we found in the sample set we did deep scans on. Currently this value is a number between 1-5 or 5+.

We storage a list of partition types in the case that more than a single partition type is included in the resource set. For example, an IoT sensor might output both XML and JSON files but both are logically part of the same resource set.

## Built in resource set patterns

We support the following resource set patterns, these patterns can appear as a name in a directory or as part of a file name.

| Pattern Name | Display Name | Description |
|--------------|--------------|-------------|
| Guid         | {GUID}       | A globally unique identifier as defined in [RFC 4122](https://tools.ietf.org/html/rfc4122) |
| Number       | {N}          | One or more digits |
| Date/Time Formats | {N}     | We support a variety of date/time formats but all are reduced to a series of {N}s. |
| 4ByteHex     | {HEX}        | A 4 digit HEX number. |
| Localization | {LOC}        | A language tag as defined in [BCP 47](https://tools.ietf.org/html/bcp47), both - and _ names are supported (e.g. en_ca and en-ca) |
    
## Issues with resource sets

Although we find that resource sets "just work" for most customers, we do  find some customers run into the following challenges where the catalog:

1. Marks assets as a resource set when they aren't
2. Puts assets into the wrong resource set
3. Marks assets as not being a resource set when they are

We have tools to help resolve these issues. If your catalog is having these challenges please email adcdisc@microsoft.com to get help.

## Next steps

To get started with Data Catalog, see [Quickstart: Create an Azure Data Catalog](create-catalog-portal.md).
