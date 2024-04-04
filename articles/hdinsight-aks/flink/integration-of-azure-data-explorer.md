---
title: Integration of Azure Data Explorer and Apache Flink® 
description: Integration of Azure Data Explorer and Apache Flink® in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 09/18/2023
---

# Integration of Azure Data Explorer and Apache Flink®  

Azure Data Explorer is a fully managed, high-performance, big data analytics platform that makes it easy to analyze high volumes of data in near real time.  

ADX helps users in analysis of large volumes of data from streaming applications, websites, IoT devices, etc. Integrating Apache Flink with ADX helps you to process real-time data and analyze it in ADX. 

## Prerequisites 
- [Create Apache Flink cluster on HDInsight on AKS](./flink-create-cluster-portal.md) 
- [Create Azure data explorer](/azure/data-explorer/create-cluster-and-database/) 

## Steps to use Azure Data Explorer as sink in Flink 

1. [Create Flink cluster](./flink-create-cluster-portal.md).

1. [Create ADX with database](/azure/data-explorer/create-cluster-and-database/) and table as required.

1. Add ingestor permissions for the managed identity in Kusto.

    ```
    .add database <DATABASE_NAME> ingestors  ('aadapp=CLIENT_ID_OF_MANAGED_IDENTITY') 
    ```
1. Run a sample program defining the Kusto cluster URI (Uniform Resource Identifier), database and managed identity used, and the table it needs to write to. 

1. Clone the flink-connector-kusto project: https://github.com/Azure/flink-connector-kusto.git 

1. Create the table in ADX using following command 
    
    ```Sample table
    .create table CryptoRatesHeartbeatTimeBatch (processing_dttm: datetime, ['type']: string, last_trade_id: string, product_id: string, sequence: long, ['time']: datetime) 
    ```
 

1. Update FlinkKustoSinkSample.java file with the right Kusto cluster URI, database and the managed identity used. 

    ```JAVA
      String database = "sdktests"; //ADX database name 

      String msiClientId = “xxxx-xxxx-xxxx”; //Provide the client id of the Managed identity which is linked to the Flink cluster 
      String cluster = "https://trdp-1665b5eybxs0tbett.z8.kusto.fabric.microsoft.com/"; //Data explorer Cluster URI 
      KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder() 
          .setManagedIdentityAppId(msiClientId).setClusterUrl(cluster).build(); 
      String defaultTable = "CryptoRatesHeartbeatTimeBatch"; //Table where the data needs to be written 
      KustoWriteOptions kustoWriteOptionsHeartbeat = KustoWriteOptions.builder() 
          .withDatabase(database).withTable(defaultTable).withBatchIntervalMs(30000) 
    ```
 

    Later build the project using “mvn clean package” 

1. Locate the JAR file named 'samples-java-1.0-SNAPSHOT-shaded.jar' under the 'sample-java/target' folder, then upload this JAR file in the Flink UI and submit the job.

1. Query the Kusto table to verify the output
   
    :::image type="content" source="./media/integration-of-azure-data-explorer/kusto-table-to-verify-output.png" alt-text="screenshot shows query the Kusto table to verify the output." lightbox="./media/integration-of-azure-data-explorer/kusto-table-to-verify-output.png":::

    There is no delay in writing the data to the Kusto table from Flink. 

### Reference

- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
