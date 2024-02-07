---
title: Incorporate Apache Flink® DataStream into Azure Databricks Delta Lake Table
description: Learn about incorporate Apache Flink® DataStream into Azure Databricks Delta Lake Table
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# Incorporate Apache Flink® DataStream into Azure Databricks Delta Lake Tables

This example shows how to sink stream data in Azure ADLS Gen2 from Apache Flink cluster on HDInsight on AKS into Delta Lake tables using Azure Databricks Auto Loader.

## Prerequisites

- [Apache Flink 1.16.0 on HDInsight on AKS](../flink/flink-create-cluster-portal.md)
- [Apache Kafka 3.2 on HDInsight](../../hdinsight/kafka/apache-kafka-get-started.md)
- [Azure Databricks](/azure/databricks/getting-started/) in the same VNET as HDInsight on AKS
- [ADLS Gen2](/azure/databricks/getting-started/connect-to-azure-storage/) and Service Principal

## Azure Databricks Auto Loader

Databricks Auto Loader makes it easy to stream data land into object storage from Flink applications into Delta Lake tables. [Auto Loader](/azure/databricks/ingestion/auto-loader/) provides a Structured Streaming source called cloudFiles.

Here are the steps how you can use data from Flink in Azure Databricks delta live tables.

### Create Apache Kafka® table on Apache Flink® SQL

In this step, you can create Kafka table and ADLS Gen2 on Flink SQL. For the purpose of this document, we are using a airplanes_state_real_time table, you can use any topic of your choice. 

You are required to update the broker IPs with your Kafka cluster in the code snippet.

```SQL
CREATE TABLE kafka_airplanes_state_real_time (
   `date` STRING,
   `geo_altitude` FLOAT,
   `icao24` STRING,
   `latitude` FLOAT,
   `true_track` FLOAT,
   `velocity` FLOAT,
   `spi` BOOLEAN,
   `origin_country` STRING,
   `minute` STRING,
   `squawk` STRING,
   `sensors` STRING,
   `hour` STRING,
   `baro_altitude` FLOAT,
   `time_position` BIGINT,
   `last_contact` BIGINT,
   `callsign` STRING,
   `event_time` STRING,
   `on_ground` BOOLEAN,
   `category` STRING,
   `vertical_rate` FLOAT,
   `position_source` INT,
   `current_time` STRING,
   `longitude` FLOAT
 ) WITH (
    'connector' = 'kafka',  
    'topic' = 'airplanes_state_real_time',  
    'scan.startup.mode' = 'latest-offset',  
    'properties.bootstrap.servers' = '10.0.0.38:9092,10.0.0.39:9092,10.0.0.40:9092', 
    'format' = 'json' 
);
```
Next, you can create ADLSgen2 table on Flink SQL.

Update the container-name and storage-account-name in the code snippet with your ADLS Gen2 details.

```SQL
CREATE TABLE adlsgen2_airplanes_state_real_time (
   `date` STRING,
   `geo_altitude` FLOAT,
   `icao24` STRING,
   `latitude` FLOAT,
   `true_track` FLOAT,
   `velocity` FLOAT,
   `spi` BOOLEAN,
   `origin_country` STRING,
   `minute` STRING,
   `squawk` STRING,
   `sensors` STRING,
   `hour` STRING,
   `baro_altitude` FLOAT,
   `time_position` BIGINT,
   `last_contact` BIGINT,
   `callsign` STRING,
   `event_time` STRING,
   `on_ground` BOOLEAN,
   `category` STRING,
   `vertical_rate` FLOAT,
   `position_source` INT,
   `current_time` STRING,
   `longitude` FLOAT
 ) WITH (
     'connector' = 'filesystem',
     'path' = 'abfs://<container-name>@<storage-account-name>/flink/airplanes_state_real_time/',
     'format' = 'json'
 );
```

Further, you can insert Kafka table into ADLSgen2 table on Flink SQL.

:::image type="content" source="media/azure-databricks/insert-kafka-table.png" alt-text="Screenshot shows insert Kafka table into ADLSgen2 table." lightbox="media/azure-databricks/insert-kafka-table.png":::

### Validate the streaming job on Flink

:::image type="content" source="media/azure-databricks/validate-streaming-job.png" alt-text="Screenshot shows validate the streaming job on Flink." lightbox="media/azure-databricks/validate-streaming-job.png":::

### Check data sink from Kafka in Azure Storage on Azure portal

:::image type="content" source="media/azure-databricks/check-data-sink.png" alt-text="Screenshot shows check data sink from Kafka on Azure Storage." lightbox="media/azure-databricks/check-data-sink.png":::

### Authentication of Azure Storage and Azure Databricks notebook

ADLS Gen2 provides OAuth 2.0 with your Microsoft Entra application service principal for authentication from an Azure Databricks notebook and then mount into Azure Databricks DBFS.

**Let's get service principle appid, tenant id and secret key.**

:::image type="content" source="media/azure-databricks/service-id.png" alt-text="Screenshot shows get service principle appid, tenant ID and secret key." lightbox="media/azure-databricks/service-id.png":::

**Grant service principle the Storage Blob Data Owner on Azure portal**

:::image type="content" source="media/azure-databricks/storage-blob-data.png" alt-text="Screenshot shows service principle the Storage Blob Data Owner on Azure portal." lightbox="media/azure-databricks/storage-blob-data.png":::

**Mount ADLS Gen2 into DBFS, on Azure Databricks notebook**

:::image type="content" source="media/azure-databricks/azure-data-lake-storage-gen-2.png" alt-text="Screenshot shows mount ADLS Gen2 into DBFS, on Azure Databricks notebook." lightbox="media/azure-databricks/azure-data-lake-storage-gen-2.png":::

**Prepare notebook**

Let's write the following code:
```SQL
%sql
CREATE OR REFRESH STREAMING TABLE airplanes_state_real_time2
AS SELECT * FROM cloud_files("dbfs:/mnt/contosoflinkgen2/flink/airplanes_state_real_time/", "json")
```

### Define Delta Live Table Pipeline and run on Azure Databricks

:::image type="content" source="media/azure-databricks/delta-live-table-pipeline.png" alt-text="Screenshot shows Delta Live Table Pipeline and run on Azure Databricks." lightbox="media/azure-databricks/delta-live-table-pipeline.png":::

:::image type="content" source="media/azure-databricks/delta-live-table-pipeline-2.png" alt-text="Screenshot shows Delta Live Table Pipeline and run on the Azure Databricks." lightbox="media/azure-databricks/delta-live-table-pipeline-2.png":::

### Check Delta Live Table on Azure Databricks Notebook

:::image type="content" source="media/azure-databricks/delta-live-table-azure.png" alt-text="Screenshot shows check Delta Live Table on Azure Databricks Notebook." lightbox="media/azure-databricks/delta-live-table-azure.png":::

### Reference

* Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
