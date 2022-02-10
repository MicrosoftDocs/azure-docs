---
title: 'Migrating to Azure Data Explorer | Microsoft Docs'
description: How to migrate Azure Time Series Insights environments to Azure Data Explorer.
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: 
ms.workload: big-data
ms.topic: conceptual
ms.date: 3/1/22
ms.custom: tvilutis
---

# Migrating to Azure Data Explorer

## Overview

Time Series Insights (TSI) service provides access to historical data ingested through hubs for operational analytics and reporting. Service features are:
- Data ingestion via hubs or bulk upload capability.
- Data storage on hot, limited retention, and cold, infinite retention, paths.
- Data contextualization applying hierarchies through Time Series Model.
- Data charting and operational analysis through TSI Explorer.
- Data query using TSQ through API or TSI Explorer.
- Connectors to access data with Databricks Spark or PBI.


## Feature comparison with Azure Data Explorer (ADX)

| Feature | TSI | ADX |
| ---| ---| ---|
| Data ingestion | Event hub, IoT hub limited to 1MB/s | Event hub, IoT hub, Kafka, Spark, Azure storage, Azure Stream Analytics, Azure Data Factory, Logstash, Power automate, Logic apps, Telegraf, Apache Nifi. No limits on ingestion (scalable), Ingestion benchmark is 200 MB/s/node on a 16 core machine in ADX cluster. |
| Data storage and retention | Warm store – multitenant ADX Cluster | Cold Store - Azure Blob storage in customer’s subscription	Distributed columnar store with highly optimized hot(on SSD of compute nodes) and cold(on Azure storage) store
Choose any ADX SKU so full flexibility |
| Data formats | JSON | JSON, CSV, Avro, Parquet, ORC, TXT and various others [Data formats supported by Azure Data Explorer for ingestion](../data-explorer/ingestion-supported-formats.md). |
| Data Querying | TSQ | KQL, SQL |
| Data Visualization | TSI Explorer, PBI | PBI, ADX Dashboards, Grafana, Kibana and other visualization tools using ODBC/JDBC connectors |
| Machine Learning | NA | Supports R, Python to build ML models or score data by exporting existing ML models, Native capabilities for forecasting, anomaly detection at scale, clustering capabilities for diagnostics and RCA |
| PBI Connector | Public preview | Optimized native PBI connector(GA), supports direct query or import mode, supports query parameters and filters |
| Data Export | Data is available as Parquet files in BLOB storage | Supports automatic continuous export to Azure storage, external tables to query exported data | 
| HA/DR | Storage is owned by customer so depends on selected config. | HA SLA of 99.9% availability, AZ supported, Storage is built on durable Azure Blob storage |
| Security | Private link for incoming traffic, but open for storage and hubs | VNet injection, Private Link, Encryption at rest with customer managed keys supported |
| RBAC and RLS | Limited RBAC, no RLS | Granular RBAC for functions and data access, RLS and data masking supported |

## TSI migration to ADX Steps

TSI has two offerings, Gen1 and Gen2, which have different migration steps.

### TSI Gen 1

TSI Gen1 doesn’t have cold storage or hierarchy capability. All data has fixed retention. Extracting data and mapping it to ADX would be complicated and time-consuming task for TSI developers and the customer. Suggestion migration path is to setup parallel data ingestion to ADX and after fixed data retention period passes TSI environment can be deleted as ADX will contain same data.
1.	Create ADX Cluster
1.	Set up parallel ingestion from hubs to ADX Cluster
1.	Continue ingesting data for the period of fixed retention
1.	Start using ADX Cluster
1.	Delete TSI environment

Detailed FAQ and engineering experience is outlined in [How to migrate TSI Gen1 to ADX](./how-to-tsi-gen1-migration.md)

### TSI Gen 2

TSI Gen2 stores all data on cold storage using Parquet format as a blob in customer’s subscription. To migrate data customer should take the blob and import it into ADX using bulk upload capability Lightingest. More information on lightingest can be fund here.
1.	Create ADX Cluster
1.	Redirect data ingestion to ADX Cluster
1.	Import TSI cold data using lightingest
1.	Start using ADX Cluster
1.	Delete TSI Environment 

Detailed FAQ and engineering experience is outlined in [How to migrate TSI Gen2 to ADX](./how-to-tsi-gen2-migration.md)