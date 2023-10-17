---
title: How to perform Change Data Capture of SQL Server with DataStream API and DataStream Source.
description: Learn how to perform Change Data Capture of SQL Server with DataStream API and DataStream Source.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Change Data Capture of SQL Server with DataStream API and DataStream Source

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Change Data Capture (CDC) is a technique you can use to track row-level changes in database tables in response to create, update, and delete operations. In this article, we use [CDC Connectors for Apache Flink®](https://github.com/ververica/flink-cdc-connectors), which offer a set of source connectors for Apache Flink. The connectors integrate [Debezium®](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/formats/debezium/#debezium-format) as the engine to capture the data changes. 

In this article, learn how to perform Change Data Capture of SQL Server using Datastream API. The SQLServer CDC connector can also be a DataStream source.

## Prerequisites

* [HDInsight on AKS Apache Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)
  * You're required to ensure the network settings are taken care as described on [Using HDInsight Kafka](../flink/process-and-consume-data.md); that's to make sure HDInsight on AKS Flink and HDInsight Kafka are in the same VNet 
* Azure SQLServer 
* HDInsight Kafka cluster and HDInsight on AKS Flink clusters are located in the same VNet
* Install [IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=windows) for development on an Azure VM, which locates in HDInsight VNet

### SQLServer CDC Connector

The SQLServer CDC connector is a Flink source connector, which reads database snapshot first and then continues to read change events with exactly once processing even failures happen. The SQLServer CDC connector can also be a DataStream source.

### Single Thread Reading

The SQLServer CDC source can’t work in parallel reading, because there's only one task, which can receive change events. For more information, refer [SQLServer CDC Connector](https://ververica.github.io/flink-cdc-connectors/master/content/connectors/sqlserver-cdc.html).

### DataStream Source

The SQLServer CDC connector can also be a DataStream source. You can create a SourceFunction.

## How the SQLServer CDC connector works?

To optimize, configure and run a Debezium SQL Server connector. It's helpful to understand how the connector performs snapshots, streams change events, determines Kafka topic names, and uses metadata.

- **Snapshots** :  SQL Server CDC isn't designed to store a complete history of database changes. For the Debezium SQL Server connector, to establish a baseline for the current state of the database, it uses a process called *snapshotting*.


## Apache Flink on HDInsight on AKS

Apache Flink is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. Apache Flink has been designed to run in all common cluster environments, perform computations at in-memory speed and at any scale.

For more information, refer

* [Apache Flink®—Stateful Computations over Data Streams](https://flink.apache.org/)
* [What is Apache Flink in HDInsight on AKS](./flink-overview.md)

## Apache Kafka on HDInsight

Apache Kafka is an open-source distributed streaming platform that can be used to build real-time streaming data pipelines and applications. Kafka also provides message broker functionality similar to a message queue, where you can publish and subscribe to named data streams.

For more information, refer [Apache Kafka in Azure HDInsight](../../hdinsight/kafka/apache-kafka-introduction.md)

## Perform a test

#### Prepare DB and table on Sqlserver

```
CREATE DATABASE inventory;
GO
```
**CDC is enabled on the SQL Server database**

```
USE inventory;
EXEC sys.sp_cdc_enable_db;  
GO
```

**Verify that the user has access to the CDC table**

```
USE inventory
GO
EXEC sys.sp_cdc_help_change_data_capture
GO
```
> [!NOTE]
> The query returns configuration information for each table in the database that is enabled for CDC and that contains change data that the caller is authorized to access. If the result is empty, verify that the user has privileges to access both the capture instance and the CDC tables.

**Create and populate products with single insert with many rows**

```
CREATE TABLE products (
id INTEGER IDENTITY(101,1) NOT NULL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description VARCHAR(512),
weight FLOAT
);

INSERT INTO products(name,description,weight)
VALUES ('scooter','Small 2-wheel scooter',3.14);
INSERT INTO products(name,description,weight)
VALUES ('car battery','12V car battery',8.1);
INSERT INTO products(name,description,weight)
VALUES ('12-pack drill bits','12-pack of drill bits with sizes ranging from #40 to #3',0.8);
INSERT INTO products(name,description,weight)
VALUES ('hammer','12oz carpenter''s hammer',0.75);
INSERT INTO products(name,description,weight)
VALUES ('hammer','14oz carpenter''s hammer',0.875);
INSERT INTO products(name,description,weight)
VALUES ('hammer','16oz carpenter''s hammer',1.0);
INSERT INTO products(name,description,weight)
VALUES ('rocks','box of assorted rocks',5.3);
INSERT INTO products(name,description,weight)
VALUES ('jacket','water resistent black wind breaker',0.1);
INSERT INTO products(name,description,weight)
VALUES ('spare tire','24 inch spare tire',22.2);

EXEC sys.sp_cdc_enable_table @source_schema = 'dbo', @source_name = 'products', @role_name = NULL, @supports_net_changes = 0;

-- Create some very simple orders
CREATE TABLE orders (
id INTEGER IDENTITY(10001,1) NOT NULL PRIMARY KEY,
order_date DATE NOT NULL,
purchaser INTEGER NOT NULL,
quantity INTEGER NOT NULL,
product_id INTEGER NOT NULL,
FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO orders(order_date,purchaser,quantity,product_id)
VALUES ('16-JAN-2016', 1001, 1, 102);
INSERT INTO orders(order_date,purchaser,quantity,product_id)
VALUES ('17-JAN-2016', 1002, 2, 105);
INSERT INTO orders(order_date,purchaser,quantity,product_id)
VALUES ('19-FEB-2016', 1002, 2, 106);
INSERT INTO orders(order_date,purchaser,quantity,product_id)
VALUES ('21-FEB-2016', 1003, 1, 107);

EXEC sys.sp_cdc_enable_table @source_schema = 'dbo', @source_name = 'orders', @role_name = NULL, @supports_net_changes = 0;
GO
```
##### Maven source code on IdeaJ

In the below snippet, we use HDInsight Kafka 2.4.1. Based on your usage, update the version of Kafka on `<kafka.version>`. 

**maven pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>FlinkDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
     <properties>
         <maven.compiler.source>1.8</maven.compiler.source>
         <maven.compiler.target>1.8</maven.compiler.target>
         <flink.version>1.16.0</flink.version>
         <java.version>1.8</java.version>
         <scala.binary.version>2.12</scala.binary.version>
         <kafka.version>2.4.1</kafka.version> // Replace with 3.2 if you're using HDInsight Kafka 3.2
     </properties>
     <dependencies>
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-java</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-streaming-java</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-clients -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-clients</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-connector-kafka</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-base -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-connector-base</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-core</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-sql-connector-elasticsearch7 -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-sql-connector-elasticsearch7</artifactId>
             <version>${flink.version}</version>
             <scope>provided</scope>
         </dependency>
         <!-- https://mvnrepository.com/artifact/com.ververica/flink-sql-connector-sqlserver-cdc -->
         <dependency>
             <groupId>com.ververica</groupId>
             <artifactId>flink-sql-connector-sqlserver-cdc</artifactId>
             <version>2.2.1</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-common -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-table-common</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-planner -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-table-planner_2.12</artifactId>
             <version>${flink.version}</version>
         </dependency>
         <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-api-scala -->
         <dependency>
             <groupId>org.apache.flink</groupId>
             <artifactId>flink-table-api-scala_2.12</artifactId>
             <version>${flink.version}</version>
         </dependency>
     </dependencies>
</project>
```

**mssqlSinkToKafka.java**

```java
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.base.DeliveryGuarantee;
import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;

import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.source.SourceFunction;

import com.ververica.cdc.debezium.JsonDebeziumDeserializationSchema;
import com.ververica.cdc.connectors.sqlserver.SqlServerSource;

public class mssqlSinkToKafka {

    public static void main(String[] args) throws Exception {
        // 1: Stream execution environment, update the kafka brokers below.
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment().setParallelism(1); //use parallelism 1 for sink to keep message ordering

        String kafka_brokers = "wn0-sampleka:9092,wn1-sampleka:9092,wn2-sampleka:9092";

        // 2. sql server source - Update your sql server name, username, password
        SourceFunction<String> sourceFunction = SqlServerSource.<String>builder()
                .hostname("<samplehilosqlsever>.database.windows.net")
                .port(1433)
                .database("inventory") // monitor sqlserver database
                .tableList("dbo.orders") // monitor products table
                .username("username")  // username 
                .password("password") // password 
                .deserializer(new JsonDebeziumDeserializationSchema()) // converts SourceRecord to JSON String
                .build();

        DataStream<String> stream = env.addSource(sourceFunction); 
        stream.print();

        // 3. sink order table transaction to kafka
        KafkaSink<String> sink = KafkaSink.<String>builder()
                .setBootstrapServers(kafka_brokers)
                .setRecordSerializer(KafkaRecordSerializationSchema.builder()
                        .setTopic("mssql_order")
                        .setValueSerializationSchema(new SimpleStringSchema())
                        .build()
                )
                .setDeliveryGuarantee(DeliveryGuarantee.AT_LEAST_ONCE)
                .build();
        stream.sinkTo(sink);

        // 4. run stream
        env.execute();
    }
}
```

### Validation

- Insert four rows into table order on sqlserver, then check on Kafka

   :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/check-kafka-output.png" alt-text="Screenshot showing how to check Kafka output.":::
  
- Insert more rows on sqlserver

   :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/insert-more-rows-on-sql-server.png" alt-text="Screenshot showing how to insert more rows on sqlserver.":::

- Check changes on Kafka

   :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/check-changes-on-kafka.png" alt-text="Screenshot showing changes made in Kafka after inserting four rows.":::
 
-  Update `product_id=107` on sqlserver
 
    :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/update-product-id-107.png" alt-text="Screenshot showing update for product ID 107.":::
 
 -  Check changes on Kafka for the updated ID 107
 
    :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/check-changes-on-kafka-for-id-107.png" alt-text="Screenshot showing changes in Kafka for updated ID 107.":::
  
  -  Delete `product_id=107` on sqlserver

     :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/delete-product-id-107-on-sql-server.png" alt-text="Screenshot showing how to delete product ID 107.":::
 
     :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/delete-product-id-107-output.png" alt-text="Screenshot showing deleted items on SQL Server.":::
 
 -  Check changes on Kafka for the deleted `product_id=107`
 
    :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/check-changes-on-kafka-for-deleted-records.png" alt-text="Screenshot showing in Kafka for deleted items.":::
 
 -  The following JSON message on Kafka shows the change event in JSON format.
    
    :::image type="content" source="./media/change-data-capture-connectors-for-apache-flink/json-output.png" alt-text="Screenshot showing JSON output.":::
   
### Reference

* [SQLServer CDC Connector](https://github.com/ververica/flink-cdc-connectors/blob/master/docs/content/connectors/sqlserver-cdc.md) is licensed under [Apache 2.0 License](https://github.com/ververica/flink-cdc-connectors/blob/master/LICENSE)
* [Apache Kafka in Azure HDInsight](../../hdinsight/kafka/apache-kafka-introduction.md)
* [Flink Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/kafka/#behind-the-scene)
