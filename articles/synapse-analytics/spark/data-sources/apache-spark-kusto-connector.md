---
title: Azure Data Explorer (Kusto) 
description: This article provides information on how to use the  connector for moving data between Azure Data Explorer (Kusto) and serverless Apache Spark pools.
services: synapse-analytics 
ms.author: midesa 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: spark
ms.date: 05/19/2020 
ms.reviewer: ManojRaheja
author: midesa
---

# Azure Data Explorer (Kusto) connector for Apache Spark
The Azure Data Explorer (Kusto) connector for Apache Spark is designed to efficiently transfer data between Kusto clusters and Spark. This connector is available in Python, Java, and .NET.

## Authentication
When using Azure Synapse Notebooks or Apache Spark job definitions, the authentication between systems is made seamless with the linked service. The Token Service connects with Microsoft Entra ID to obtain security tokens for use when accessing the Kusto cluster.

For Azure Synapse Pipelines, the authentication uses the service principal name. Currently, managed identities aren't supported with the Azure Data Explorer connector.

## Prerequisites 
  - [Connect to Azure Data Explorer](../../quickstart-connect-azure-data-explorer.md): You need to set up a Linked Service to connect to an existing Kusto cluster.

## Limitations
  - The Azure Data Explorer linked service can only be configured with the Service Principal Name.
  - Within Azure Synapse Notebooks or Apache Spark Job Definitions, the Azure Data Explorer connector uses Microsoft Entra pass-through to connect to the Kusto Cluster.


## Use the Azure Data Explorer (Kusto) connector
The following section provides a simple example of how to write data to a Kusto table and read data from a Kusto table. See the [Azure Data Explorer (Kusto) connector project](https://github.com/Azure/azure-kusto-spark) for detailed documentation. 

### Read data

```python
kustoDf  = spark.read \
            .format("com.microsoft.kusto.spark.synapse.datasource") \
            .option("spark.synapse.linkedService", "<link service name>") \
            .option("kustoDatabase", "<Database name>") \
            .option("kustoQuery", "<KQL Query>") \
            .load()

display(kustoDf)
```

You can also batch read with forced distribution mode and other advanced options. For additional information, you can refer to [Kusto source options reference](https://github.com/Azure/azure-kusto-spark/blob/master/connector/src/main/scala/com/microsoft/kusto/spark/datasource/KustoSourceOptions.scala).

```python
crp = sc._jvm.com.microsoft.azure.kusto.data.ClientRequestProperties()
crp.setOption("norequesttimeout",True)
crp.toString()

kustoDf  = spark.read \
            .format("com.microsoft.kusto.spark.synapse.datasource") \
            .option("spark.synapse.linkedService", "<link service name>") \
            .option("kustoDatabase", "<Database name>") \
            .option("kustoQuery", "<KQL Query>") \
            .option("clientRequestPropertiesJson", crp.toString()) \
            .option("readMode", 'ForceDistributedMode') \
            .load()

display(kustoDf) 
```
### Write data

```python
df.write \
    .format("com.microsoft.kusto.spark.synapse.datasource") \
    .option("spark.synapse.linkedService", "<link service name>") \
    .option("kustoDatabase", "<Database name>") \
    .option("kustoTable", "<Table name>") \
    .mode("Append") \
    .save()
```
In addition, you can also batch write data by providing additional ingestion properties. For more info on the supported ingestion properties, you can visit the [Kusto ingestion properties reference material](/azure/data-explorer/ingestion-properties).


```python
extentsCreationTime = sc._jvm.org.joda.time.DateTime.now().plusDays(1)
csvMap = "[{\"Name\":\"ColA\",\"Ordinal\":0},{\"Name\":\"ColB\",\"Ordinal\":1}]"
# Alternatively use an existing csv mapping configured on the table and pass it as the last parameter of SparkIngestionProperties or use none

sp = sc._jvm.com.microsoft.kusto.spark.datasink.SparkIngestionProperties(
        False, ["dropByTags"], ["ingestByTags"], ["tags"], ["ingestIfNotExistsTags"], extentsCreationTime, csvMap, None)

df.write \
    .format("com.microsoft.kusto.spark.synapse.datasource") \
    .option("spark.synapse.linkedService", "<link service name>") \
    .option("kustoDatabase", "<Database name>") \
    .option("kustoTable", "<Table name>") \
    .option("sparkIngestionPropertiesJson", sp.toString()) \
    .option("tableCreateOptions","CreateIfNotExist") \
    .mode("Append") \
    .save()
```

## Next steps
- [Connect to Azure Data Explorer](../../quickstart-connect-azure-data-explorer.md)
- [Azure Data Explorer (Kusto) Apache Spark connector](https://github.com/Azure/azure-kusto-spark)
