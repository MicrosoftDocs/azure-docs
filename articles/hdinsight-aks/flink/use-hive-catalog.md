---
title: Use Hive Catalog, Hive Read & Write demo on Apache Flink SQL
description: Learn how to use Hive Catalog, Hive Read & Write demo on Apache Flink SQL
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# How to use Hive Catalog with Apache Flink SQL

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This example uses Hive’s Metastore as a persistent catalog with Apache Flink’s HiveCatalog. We will use this functionality for storing Kafka table and MySQL table metadata on Flink across sessions. Flink uses Kafka table registered in Hive Catalog as a source, perform some lookup and sink result to MySQL database


## Prerequisites

* [HDInsight on AKS Flink 1.16.0 with Hive Metastore 3.1.2](../flink/flink-create-cluster-portal.md) 
* [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)
  * You're required to ensure the network settings are complete as described on [Using HDInsight Kafka](../flink/process-and-consume-data.md); that's to make sure HDInsight on AKS Flink and HDInsight Kafka are in the same VNet 
* MySQL 8.0.33

## Apache Hive on Flink

Flink offers a two-fold integration with Hive.

- The first step is to use Hive Metastore (HMS) as a persistent catalog with Flink’s HiveCatalog for storing Flink specific metadata across sessions.
  - For example, users can store their Kafka or ElasticSearch tables in Hive Metastore by using HiveCatalog, and reuse them later on in SQL queries. 
- The second is to offer Flink as an alternative engine for reading and writing Hive tables.
- The HiveCatalog is designed to be “out of the box” compatible with existing Hive installations. You don't need to modify your existing Hive Metastore or change the data placement or partitioning of your tables.

You may refer to this page for more details on [Apache Hive](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/hive/overview/)

## Environment preparation

### Create an Apache Flink cluster with HMS

Lets create an Apache Flink cluster with HMS on Azure portal, you can refer to the detailed instructions on [Flink cluster creation](../flink/flink-create-cluster-portal.md).

:::image type="content" source="./media/use-hive-catalog/create-flink-cluster.png" alt-text="Screenshot showing how to create Flink cluster." lightbox="./media/use-hive-catalog/create-flink-cluster.png":::

After cluster creation, check HMS is running or not on AKS side.

:::image type="content" source="./media/use-hive-catalog/check-hms-status.png" alt-text="Screenshot showing how to check HMS status in Flink cluster." lightbox="./media/use-hive-catalog/check-hms-status.png":::

### Prepare user order transaction data Kafka topic on HDInsight

Download the kafka client jar using the following command:

`wget https://archive.apache.org/dist/kafka/3.2.0/kafka_2.12-3.2.0.tgz`

Untar the tar file with 

`tar -xvf kafka_2.12-3.2.0.tgz`

Produce the messages to the Kafka topic.

:::image type="content" source="./media/use-hive-catalog/produce-messages-to-kafka-topic.png" alt-text="Screenshot showing how to produce messages to Kafka topic." lightbox="./media/use-hive-catalog/produce-messages-to-kafka-topic.png":::

Other commands:
> [!NOTE]
> You're required to replace bootstrap-server with your own kafka brokers host name or IP
```
--- delete topic
./kafka-topics.sh --delete --topic user_orders --bootstrap-server wn0-contsk:9092

--- create topic
./kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user_orders  --bootstrap-server wn0-contsk:9092

--- produce topic
./kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic user_orders

--- consumer topic
./kafka-console-consumer.sh --bootstrap-server wn0-contsk:9092 --topic user_orders --from-beginning
```

### Prepare user order master data on MySQL on Azure

Testing DB:

:::image type="content" source="./media/use-hive-catalog/test-database.png" alt-text="Screenshot showing how to test the database in Kafka." lightbox="./media/use-hive-catalog/test-database.png":::

:::image type="content" source="./media/use-hive-catalog/cloud-shell-on-portal.png" alt-text="Screenshot showing how to run Cloud Shell on the portal." lightbox="./media/use-hive-catalog/cloud-shell-on-portal.png":::

**Prepare the order table:**

``` SQL
mysql> use mydb
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

mysql> CREATE TABLE orders (
  order_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_date DATETIME NOT NULL,
  customer_id INTEGER NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 5) NOT NULL,
  product_id INTEGER NOT NULL,
  order_status BOOLEAN NOT NULL
) AUTO_INCREMENT = 10001;


mysql> INSERT INTO orders
VALUES (default, '2023-07-16 10:08:22','0001', 'Jark', 50.00, 102, false),
       (default, '2023-07-16 10:11:09','0002', 'Sally', 15.00, 105, false),
       (default, '2023-07-16 10:11:09','000', 'Sally', 25.00, 105, false),
       (default, '2023-07-16 10:11:09','0004', 'Sally', 45.00, 105, false),
       (default, '2023-07-16 10:11:09','0005', 'Sally', 35.00, 105, false),
       (default, '2023-07-16 12:00:30','0006', 'Edward', 90.00, 106, false);

mysql> select * from orders;
+----------+---------------------+-------------+---------------+----------+------------+--------------+
| order_id | order_date          | customer_id | customer_name | price    | product_id | order_status |
+----------+---------------------+-------------+---------------+----------+------------+--------------+
|    10001 | 2023-07-16 10:08:22 |           1 | Jark          | 50.00000 |        102 |            0 |
|    10002 | 2023-07-16 10:11:09 |           2 | Sally         | 15.00000 |        105 |            0 |
|    10003 | 2023-07-16 10:11:09 |           3 | Sally         | 25.00000 |        105 |            0 |
|    10004 | 2023-07-16 10:11:09 |           4 | Sally         | 45.00000 |        105 |            0 |
|    10005 | 2023-07-16 10:11:09 |           5 | Sally         | 35.00000 |        105 |            0 |
|    10006 | 2023-07-16 12:00:30 |           6 | Edward        | 90.00000 |        106 |            0 |
+----------+---------------------+-------------+---------------+----------+------------+--------------+
6 rows in set (0.22 sec)

mysql> desc orders;
+---------------+---------------+------+-----+---------+----------------+
| Field         | Type          | Null | Key | Default | Extra          |
+---------------+---------------+------+-----+---------+----------------+
| order_id      | int           | NO   | PRI | NULL    | auto_increment |
| order_date    | datetime      | NO   |     | NULL    |                |
| customer_id   | int           | NO   |     | NULL    |                |
| customer_name | varchar(255)  | NO   |     | NULL    |                |
| price         | decimal(10,5) | NO   |     | NULL    |                |
| product_id    | int           | NO   |     | NULL    |                |
| order_status  | tinyint(1)    | NO   |     | NULL    |                |
+---------------+---------------+------+-----+---------+----------------+
7 rows in set (0.22 sec)
```

### Using SSH download required Kafka connector and MySQL Database jars


> [!NOTE] 
> Download the correct version jar according to our HDInsight kafka version and MySQL version.

```
wget https://repo1.maven.org/maven2/org/apache/flink/flink-connector-jdbc/1.16.0/flink-connector-jdbc-1.16.0.jar
wget https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
wget https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/kafka-clients-3.2.0.jar
wget https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka/1.16.0/flink-connector-kafka-1.16.0.jar
```

**Moving the planner jar**

Move the jar flink-table-planner_2.12-1.16.0-0.0.18.jar located in webssh pod's /opt to /lib and move out the jar flink-table-planner-loader-1.16.0-0.0.18.jar from /lib. Please refer to [issue](https://issues.apache.org/jira/browse/FLINK-25128) for more details. Perform the following steps to move the planner jar.

```
mv /opt/flink-webssh/opt/flink-table-planner_2.12-1.16.0-0.0.18.jar /opt/flink-webssh/lib/
mv /opt/flink-webssh/lib/flink-table-planner-loader-1.16.0-0.0.18.jar /opt/flink-webssh/opt/
```

> [!NOTE]
> **An extra planner jar moving is only needed when using Hive dialect or HiveServer2 endpoint**. However, this is the recommended setup for Hive integration.

## Validation
### Use bin/sql-client.sh to connect to Flink SQL

``` 
bin/sql-client.sh -j kafka-clients-3.2.0.jar -j flink-connector-kafka-1.16.0.jar -j flink-connector-jdbc-1.16.0.jar  -j mysql-connector-j-8.0.33.jar
```

### Create Hive catalog and connect to the hive catalog on Flink SQL

> [!NOTE]
> As we already use Flink cluster with Hive Metastore, there is no need to perform any additional configurations.

``` SQL
CREATE CATALOG myhive WITH (
    'type' = 'hive'
);

USE CATALOG myhive;
```

### Create Kafka Table on Apache Flink SQL

``` SQL
CREATE TABLE kafka_user_orders (
  `user_id` BIGINT,
  `user_name` STRING,
  `user_email` STRING,
  `order_date` TIMESTAMP(3) METADATA FROM 'timestamp',
  `price` DECIMAL(10,5),
  `product_id` BIGINT,
  `order_status` BOOLEAN
) WITH (
    'connector' = 'kafka',  
    'topic' = 'user_orders',  
    'scan.startup.mode' = 'latest-offset',  
    'properties.bootstrap.servers' = '10.0.0.38:9092,10.0.0.39:9092,10.0.0.40:9092', 
    'format' = 'json' 
);

select * from kafka_user_orders;
```
:::image type="content" source="./media/use-hive-catalog/create-kafka-table.png" alt-text="Screenshot showing how to create Kafka table." lightbox="./media/use-hive-catalog/create-kafka-table.png":::

### Create MySQL Table on Apache Flink SQL

``` SQL
CREATE TABLE mysql_user_orders (
  `order_id` INT,
  `order_date` TIMESTAMP,
  `customer_id` INT,
  `customer_name` STRING,
  `price` DECIMAL(10,5),
  `product_id` INT,
  `order_status` BOOLEAN
) WITH (
  'connector' = 'jdbc',
  'url' = 'jdbc:mysql://<servername>.mysql.database.azure.com/mydb',
  'table-name' = 'orders',
  'username' = '<username>',
  'password' = '<password>'
);

select * from mysql_user_orders;
```
:::image type="content" source="./media/use-hive-catalog/create-my-sql-table.png" alt-text="Screenshot showing how to create mysql table." lightbox="./media/use-hive-catalog/create-my-sql-table.png":::

### Check tables registered in above Hive catalog on Flink SQL

:::image type="content" source="./media/use-hive-catalog/show-tables.png" alt-text="Screenshot showing table output." lightbox="./media/use-hive-catalog/show-tables.png":::


### Sink user transaction order info into master order table in MySQL on Flink SQL

``` SQL
INSERT INTO mysql_user_orders (order_date, customer_id, customer_name, price, product_id, order_status)
 SELECT order_date, CAST(user_id AS INT), user_name, price, CAST(product_id AS INT), order_status
 FROM kafka_user_orders;
```
:::image type="content" source="./media/use-hive-catalog/sink-user-transaction.png" alt-text="Screenshot showing how to sink user transaction." lightbox="./media/use-hive-catalog/sink-user-transaction.png":::

:::image type="content" source="./media/use-hive-catalog/flink-ui.png" alt-text="Screenshot showing Flink UI." lightbox="./media/use-hive-catalog/flink-ui.png":::

### Check if user transaction order data on Kafka is added in master table order in MySQL on Azure Cloud Shell


:::image type="content" source="./media/use-hive-catalog/check-user-transaction.png" alt-text="Screenshot showing how to check user transaction." lightbox="./media/use-hive-catalog/check-user-transaction.png":::

### Creating three more user orders on Kafka

```
sshuser@hn0-contsk:~$ /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic user_orders
>{"user_id": null,"user_name": "Lucy","user_email": "user8@example.com","order_date": "07/17/2023 21:33:44","price": "90.00000","product_id": "102","order_status": false}
>{"user_id": "0009","user_name": "Zark","user_email": "user9@example.com","order_date": "07/17/2023 21:52:07","price": "80.00000","product_id": "103","order_status": true}
>{"user_id": "0010","user_name": "Alex","user_email": "user10@example.com","order_date": "07/17/2023 21:52:07","price": "70.00000","product_id": "104","order_status": true}
```

### Check Kafka table data on Flink SQL 
``` SQL
Flink SQL> select * from kafka_user_orders;
```

:::image type="content" source="./media/use-hive-catalog/check-kafka-table-data.png" alt-text="Screenshot showing how to check Kafka table data." lightbox="./media/use-hive-catalog/check-kafka-table-data.png":::

### Insert `product_id=104` into orders table on MySQL on Flink SQL

``` SQL
INSERT INTO mysql_user_orders (order_date, customer_id, customer_name, price, product_id, order_status)
SELECT order_date, CAST(user_id AS INT), user_name, price, CAST(product_id AS INT), order_status
FROM kafka_user_orders where product_id = 104;
```
:::image type="content" source="./media/use-hive-catalog/orders-table.png" alt-text="Screenshot showing how to check orders table." lightbox="./media/use-hive-catalog/orders-table.png"

### Check `product_id = 104` record is added in order table on MySQL on Azure Cloud Shell

:::image type="content" source="./media/use-hive-catalog/record-added-to-order-table.png" alt-text="Screenshot showing the records added to the order table." lightbox="./media/use-hive-catalog/record-added-to-order-table.png":::

### Reference
* [Apache Hive](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/hive/overview/)
