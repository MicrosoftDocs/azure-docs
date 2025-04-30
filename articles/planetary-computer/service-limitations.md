---
title: PLACEHOLDER Service Limitations for Microsoft Planetary Computer Pro Preview
description: "This article covers known limitations for Microsoft Planetary Computer Pro in the public preview release."
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: limits-and-quotas
ms.date: 04/30/2025

#customer intent: As a data scientist or geospatial analyst, I want to understand the service limitations of Microsoft Planetary Computer Pro so that I can plan my workloads and projects accordingly.

---

# PLACEHOLDER Service Limitations for Microsoft Planetary Computer Pro Preview

This article outlines the current service limitations and quotas for Microsoft Planetary Computer Pro Preview. Understanding these limitations helps you plan your geospatial data processing workloads and avoid potential issues when using the service.

The Microsoft Planetary Computer Pro service is currently in public preview, and these limitations may change as the service moves toward general availability. We update this document as service capabilities evolve.

## General information about service limitations

Microsoft Planetary Computer Pro Preview has several types of limitations to ensure service stability and performance:

- **Character and naming limitations**: Restrictions on the length and format of catalog names, collection names, and other identifiers.
- **Rate limitations**: Caps on the number of API calls and operations per time period.
- **Storage limitations**: Constraints on data redundancy, maximum file sizes, and storage capacities.
- **Quantity limitations**: Limits on the number of items that can be processed or stored.

These limitations are designed to maintain service quality while providing you with the capabilities needed for most geospatial data processing scenarios. If you have workloads that might exceed these limitations, contact Azure support to discuss your requirements.

## Character limitations

The following table outlines the naming and character limitations for Microsoft Planetary Computer Pro Preview:

| Resource | Limitation |
|----------|------------|
| Catalog Name | 3 to 24 alphanumeric characters (hyphens allowed as interior characters) |
| Collection Name | 3 to 32 alphanumeric characters (hyphens and underscores allowed) |
| SpatioTemporal Asset Catalog (STAC) Item ID | 1 to 64 alphanumeric characters (hyphens, underscores, and periods allowed) |

## Rate limitations

Microsoft Planetary Computer Pro Preview enforces the following rate limitations to ensure service stability:

| Operation | Limit |
|-----------|-------|
| Tile Operations per Second | 100 per second per subscription |
| STAC API Calls per Second | 50 per second per subscription |
| Bulk Processing Operations | Five concurrent operations per subscription |

## Storage limitations

The following table outlines storage-related limitations for Microsoft Planetary Computer Pro Preview:

| Resource | Limitation |
|----------|------------|
| Data Redundancy | All data is stored in hot storage tier with locally redundant storage (LRS) |
| Maximum Asset File Size | 5 GB per file |
| Maximum Capacity per GeoCatalog | 10 TB |

## Processing and quantity limitations

The following table outlines the quantity limitations for Microsoft Planetary Computer Pro Preview:

| Resource | Limitation |
|----------|------------|
| Maximum Items in a Bulk Ingestion | 10,000 items |
| Maximum STAC Items in a GeoCatalog | 5,000,000 items |
| Maximum Collections per Catalog | 100 |

## Related content

- [Overview of Microsoft Planetary Computer Pro](microsoft-planetary-computer-pro-overview.md)
- [Overview of getting started with Microsoft Planetary Computer Pro](get-started-planetary-computer.md)
- [Overview of ingesting data into GeoCatalog with the Bulk Ingestion API](bulk-ingestion-api.md)