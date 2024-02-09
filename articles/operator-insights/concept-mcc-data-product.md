---
title: Quality of Experience - Affirmed MCC Data Products - Azure Operator Insights
description: This article gives an overview of the Azure Operator Insights Data Products provided to monitor the Quality of Experience for the Affirmed Mobile Content Cloud (MCC).
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As an MCC operator, I want to understand the capabilities of the relevant Quality of Experience Data Product, in order to provide insights to my network.
---

# Quality of Experience - Affirmed MCC Data Product overview

The *Quality of Experience - Affirmed MCC* Data Products support data analysis and insight for operators of the Affirmed Networks Mobile Content Cloud (MCC). They ingest Event Data Records (EDRs) from MCC network elements, and then digest and enrich this data to provide a range of visualizations for the operator. Operator data scientists have access to the underlying enriched data to support further data analysis.

## Background

The Affirmed Networks Mobile Content Cloud (MCC) is a virtualized Evolved Packet Core (vEPC) that can provide the following functionality.

- Serving Gateway (SGW) routes and forwards user data packets between the RAN and the core network.
- Packet Data Network Gateway (PGW) provides interconnect between the core network and external IP networks.
- Gi-LAN Gateway (GIGW) provides subscriber-aware or subscriber-unaware value-added services (VAS) without enabling MCC gateway services, allowing operators to take advantage of VAS while still using their incumbent gateway.
- Gateway GPRS support node (GGSN) provides interworking between the GPRS network and external packet switched networks.
- Serving GPRS support node and MME (SGSN/MME) is responsible for the delivery of data packets to and from the mobile stations within its geographical service area.
- Control and User Plane Separation (CUPS), an LTE enhancement that separates control and user plane function to allow independent scaling of functions.

The data produced by the MCC varies according to the functionality. This variation affects the enrichments and visualizations that are relevant. Azure Operator Insights provides the following Quality of Experience Data Products to support specific MCC functions.

- **Quality of Experience - Affirmed MCC GIGW**
- **Quality of Experience - Affirmed MCC PGW/GGSN**

## Data types

The following data types are provided for all Quality of Experience - Affirmed MCC Data Products.

- `edr`: This data type handles EDRs from the MCC.
- `edr-sanitized`: This data type contains the same information as `edr` but with personal data suppressed to support operators' compliance with privacy legislation.
- `edr-validation`: This data type contains a subset of performance management statistics and provides you with the ability to optionally ingest a minimum number of PMstats tables for a data quality check.
- `device`: This optional data type contains device data (for example, device model, make and capabilities) that the Data Product can use to enrich the MCC Event Data Records. To use this data type, you must upload the device reference data in a CSV file. The CSV must conform to the [Device reference schema for the Quality of Experience Affirmed MCC Data Product](device-reference-schema.md).
- `enrichment`: This data type holds the enriched Event Data Records and covers multiple sub data types for precomputed aggregations targeted to accelerate specific dashboards, granularities, and queries. These multiple sub data types include:
    - `agg-enrichment-5m`: contains enriched Event Data Records aggregated over five-minute intervals.
    - `agg-enrichment-1h`: contains enriched Event Data Records aggregated over one-hour intervals.
    - `enriched-flow-dcount`: contains precomputed counts used to report the unique IMSIs, MCCs, and Applications over time.
- `location`: This optional data type contains data enriched with location information, if you have a source of location data. This covers the following sub data types.
    - `agg-location-1h`: contains enriched location data aggregated over one-hour intervals.
    - `enriched-loc-dcount`: contains precomputed counts used to report location data over time.

## Setup

To use the Quality of Experience - Affirmed MCC Data Product:

1. Deploy the Data Product by following [Create an Azure Operator Insights Data Product](data-product-create.md).
1. Configure your network to provide data by setting up an MCC EDR Ingestion Agent. The MCC EDR Ingestion Agent uploads EDRs from your network to Azure Operator Insights. See [Create and configure MCC EDR Ingestion Agents for Azure Operator Insights](how-to-install-mcc-edr-agent.md). Alternatively, you can provide your own ingestion agent.

## Related content

- [Data Quality Monitoring](concept-data-quality-monitoring.md)
- [Azure Operator Insights Data Types](concept-data-types.md)
- [Monitoring - Affirmed MCC Data Product](concept-monitoring-mcc-data-product.md)
- [Affirmed Networks MCC documentation](https://manuals.metaswitch.com/MCC) 

> [!NOTE]
> Affirmed Networks login credentials are required to access the MCC product documentation.
