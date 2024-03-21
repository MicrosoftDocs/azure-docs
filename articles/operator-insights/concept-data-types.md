---
title: Data types - Azure Operator Insights
description: This article provides an overview of the data types used by Azure Operator Insights Data Products.
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As a Data Product user, I want to understand the concept of Data Types so that I can use Data Product(s) effectively.
---

# Data types overview

A Data Product ingests data from one or more sources, digests and enriches this data, and presents this data to provide domain-specific insights and to support further data analysis.

A data type is used to refer to an individual data source. Data types can be from outside the Data Product, such as from a network element. Data types can also be created within the Data Product itself by aggregating or enriching information from other data types.

Data Product operators can choose the data retention period for each data type.

## Data type contents

Each data type contains data from a specific source. The primary source for a data type might be a network element within the subject domain. Some data types are derived by aggregating or enriching information from other data types.

- The **Quality of Experience – Affirmed MCC** Data Product includes the following data types.
  - `edr`: This data type handles Event Data Records (EDRs) from the MCC.
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
 
- The **Monitoring – Affirmed MCC** Data Product includes the `pmstats` datatype. This data type contains performance management statistics from the MCC EMS.

## Data type settings

Data types are presented as child resources of the Data Product within the Azure portal as shown in the Data Types page. Relevant settings can be controlled independently for each individual data type.

:::image type="content" source="media/concept-data-types/data-types.png" alt-text="Screenshot of Data Types portal page.":::

Data Product operators can configure different data retention periods for each data type as shown in the Data Retention page. For example, data types containing personal data are typically configured with a shorter retention period to comply with privacy legislation.

  :::image type="content" source="media/concept-data-types/data-types-data-retention.png" alt-text="Screenshot of Data Types Data Retention portal page.":::
