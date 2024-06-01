---
title: 'Migrating to Azure Data Explorer | Microsoft Docs'
Description: How to migrate Azure Time Series Insights environments to Azure Data Explorer.
ms.service: time-series-insights
author: tedvilutis
ms.author: atributes
ms.topic: conceptual
ms.date: 3/15/2022
ms.custom: atributes
---

# Migrating to Azure Data Explorer

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview

Time Series Insights (TSI) service provides access to historical data ingested through hubs for operational analytics and reporting. Service features are:
- Data ingestion via hubs or bulk upload capability.
- Data storage on hot, limited retention, and cold, infinite retention, paths.
- Data contextualization applying hierarchies through the Time Series Model.
- Data charting and operational analysis through TSI Explorer.
- Data query using TSQ through API or TSI Explorer.
- Connectors to access data with Databricks Spark or PBI.


## Feature Comparison with Azure Data Explorer (ADX)

| Feature | TSI | ADX |
| ---| ---| ---|
| Data ingestion | Event Hubs, IoT hub limited to 1 MB/s | Event Hubs, IoT hub, Kafka, Spark, Azure storage, Azure Stream Analytics, Azure Data Factory, Logstash, Power automate, Logic apps, Telegraf, Apache Nifi. No limits on ingestion (scalable), Ingestion benchmark is 200 MB/s/node on a 16 core machine in ADX cluster. |
| Data storage and retention | Warm store – multitenant ADX Cluster | Cold Store - Azure Blob storage in customer’s subscription	Distributed columnar store with highly optimized hot(on SSD of compute nodes) and cold(on Azure storage) store. Choose any ADX SKU for full flexibility |
| Data formats | JSON | JSON, CSV, Avro, Parquet, ORC, TXT, and various others [Data formats supported by Azure Data Explorer for ingestion](/azure/data-explorer/ingestion-supported-formats). |
| Data Querying | TSQ | KQL, SQL |
| Data Visualization | TSI Explorer, PBI | PBI, ADX Dashboards, Grafana, Kibana, and other visualization tools using ODBC/JDBC connectors |
| Machine Learning | NA | Supports R and Python in building ML models or scoring data by exporting existing models. Native capabilities for forecasting. Anomaly detection at scale. Clustering capabilities for diagnostics and RCA |
| PBI Connector | Public preview | Optimized native PBI connector(GA), supports direct query or import mode, supports query parameters and filters |
| Data Export | Data is available as Parquet files in BLOB storage | Supports automatic continuous export to Azure storage, external tables to query exported data | 
| Customer owns HA/DR | Storage, so it depends on the selected config. | HA SLA of 99.9% availability, AZ supported, Storage is built on durable Azure Blob storage |
| Security | Private link for incoming traffic, but open for storage and hubs | VNet injection, Private Link, Encryption at rest with customer-managed keys supported |
| RBAC role and RLS | Limited RBAC role, no RLS | Granular RBAC role for functions and data access, RLS and data masking supported |

## TSI Migration to ADX Steps

TSI has two offerings, Gen1 and Gen2, with different migration steps.

### TSI Gen1

TSI Gen1 doesn’t have cold Storage or hierarchy capability. All data has fixed retention. Extracting data and mapping it to ADX would be complicated and time-consuming for TSI developers and the customer. The suggested migration path is to set up parallel data ingestion to ADX. After the fixed data retention period passes, the TSI environment can be deleted, as ADX will contain the same data.
1.	Create ADX Cluster
1.	Set up parallel ingestion from hubs to ADX Cluster
1.	Continue ingesting data for the period of fixed retention
1.	Start using ADX Cluster
1.	Delete TSI environment

Detailed FAQ and engineering experience are outlined in [How to migrate TSI Gen1 to ADX](./how-to-tsi-gen1-migration.md)

### TSI Gen2

TSI Gen2 stores all data on cold storage using Parquet format as a blob in the customer’s subscription. To migrate data, the customer should take the blob and import it into ADX using the bulk upload capability Lightingest. More information on lighting can be found here.
1.	Create ADX Cluster
1.	Redirect data ingestion to ADX Cluster
1.	Import TSI cold data using lighting
1.	Start using ADX Cluster
1.	Delete TSI Environment 

Detailed FAQ and engineering experience are outlined in [How to migrate TSI Gen2 to ADX](./how-to-tsi-gen2-migration.md)

> [!NOTE]
> Your Time Series Insights resources will be automatically deleted if you cannot migrate from Time Series Insights to Azure Data Explorer by 7 July 2024. You’ll be able to access Gen2 data in your storage account. However, you can only perform management operations (such as updating storage account settings, getting storage account properties/keys, and deleting storage accounts) through Azure Resource Manager. 
