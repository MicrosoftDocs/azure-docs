---
title: Microsoft Planetary Computer Service Usage Meters
description: This article explains the usage metering model for Microsoft Planetary Computer Pro.
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: article
ms.date: 02/11/2026
#customer intent: As a user, I want to understand the service usage meter structure for Microsoft Planetary Computer Pro so I can estimate usage.
---

# Microsoft Planetary Computer Pro service usage meters

Microsoft Planetary Computer Pro uses a pay-as-you-go pricing model. You pay for the resources you use, so you have flexibility and control over your spending. This article describes the usage meters for the different components of the service.

## Access usage metrics through the Azure portal

You can find detailed information about the utilization of your GeoCatalog resource in the Azure portal under **Monitoring** > **Metrics** in the resource view. 

[![Screenshot of the Azure portal showing the Metrics blade for a GeoCatalog resource.](./media/service-usage-metrics.png)](./media/service-usage-metrics.png#lightbox)

## Service usage meters

The service measures usage by using the following dimensions:

| Meter                       | Measured Units            | Description                                                                                                |
|----------------------------|---------------------------|------------------------------------------------------------------------------------------------------------|
| **Geospatial Storage**               | GiB-month                  | Ingested data stored after any cloud-optimization and compression.                                         |
| **Geospatial Data Operations**             | 10K operations            | Storage read and metadata retrieval operations, such as search, list, and item or asset metadata access.                   |
| **Ingestion & Transformation** | vCPU-hour                 | Compute consumed transforming data into cloud-optimized formats (for example COG generation) and ingesting data into GeoCatalog.              |
| **Bandwidth**              | GiB                 | Data transferred out of the Azure region hosting the GeoCatalog resource.                                  |

All meters use binary gigabytes (GiB), where 1 GiB equals 1,073,741,824 bytes. 

### Geospatial Storage

The service measures GiB-month of data stored in your GeoCatalog, including original data and derived or optimized forms. This measurement includes any cloud-optimized representations that the platform generates.

Geospatial storage metrics can take up to six hours to reflect additions or deletions to stored data. 

### Geospatial data operations

These operations are read operations for data that the managed storage inside a GeoCatalog resource stores. Common patterns include:
* Use the SAS API to read stored assets.
* Use the Data API to render a tile based on managed data.
* [Ingest new data](./ingestion-overview.md) into a GeoCatalog (this operation happens once).

Use of the [STAC API](./stac-overview.md) for querying or searching a catalog isn't a read operation. 

It can take up to two hours for geospatial data operations metrics to reflect new operations. 

### Ingestion and transformation

A virtual CPU (vCPU) hour reflects how much processing power the service spends on your ingestion job. While the service ingests and transforms data, Microsoft Planetary Computer Pro tracks the CPU time the workers consume as they run your job inside its managed environment. The service adds up every second of CPU usage from those workers, converts the total into hours, and reports that number as vCPU-hours for billing.

To estimate your vCPU-hours, choose a data type similar to the one you plan to ingest:
 
| Data Type | Format State | Description (Format / Bands) | Representative vCPU-hours/GiB |
|-----------|--------------|------------------------------|--------------------------|
| [Sentinel‑2 L2A](./data-visualization-samples.md#sentinel-2-l2a-collection-configuration) | Non-COG | GeoTIFF; 13 MSI spectral bands (B1–B12 incl. B8A, 10–60 m) plus QA masks | 0.50 |
| Micro COG 1000 | COG | Cloud Optimized GeoTIFFs (1000 2-10 MB files); Three bands (RGB) | 0.423 |
| Aerial Orthomosaic | Non-COG | Orthorectified GeoTIFF mosaic; Three bands (RGB); large tiles | 0.20 |
| [National Aerial Imagery Program](./data-visualization-samples.md#the-national-agriculture-imagery-program-collection-configuration) | COG | Cloud Optimized GeoTIFF; Four bands (RGB + NIR) | 0.030 |

To estimate your vCPU-hours, select a data type that's similar to the one you plan to ingest, and multiply the **Representative vCPU-hours/GiB**  value by the number of gigabytes of data you intend to ingest. 

**Example:** Suppose you're ingesting 250 GiB of [National Aerial Imagery Program](./data-visualization-samples.md#the-national-agriculture-imagery-program-collection-configuration) (NAIP) data already in Cloud Optimized GeoTIFF (COG) format. Use the representative value of 0.030 vCPU/GiB from the table:

250 GiB × 0.030 vCPU/GiB = 7.5 vCPU-hours

The ingestion and transformation metric can take up to 2 hours to reflect new activity from ingestion. 

### Bandwidth

You measure bandwidth in GiB of data that leave the GeoCatalog’s Azure region. This meter increments alongside read [operations](#geospatial-data-operations) whenever data moves to another Azure region or outside of Azure when using the SAS API to read data directly from GeoCatalog managed storage. 

> [!NOTE]
> Use of the Data/Tiler API doesn't result in any bandwidth usage.


## Cost management

Azure provides tools to help you monitor and manage your spending. Use [Microsoft Cost Management and Billing](/azure/cost-management-billing/cost-management-billing-overview) to track your Microsoft Planetary Computer Pro usage and costs, set budgets, and receive alerts.

## Next steps

- [Microsoft Planetary Computer Pro Overview](./microsoft-planetary-computer-pro-overview.md)
- [Get started with Microsoft Planetary Computer Pro](./get-started-planetary-computer.md)
