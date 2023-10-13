---
title: Change Data Capture (CDC) of SQL Server using Apache Flink SQL
description: Learn how to perform CDC of SQL Server using Apache Flink SQL
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Change Data Capture (CDC) of SQL Server using Apache Flink SQL

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Change Data Capture (CDC) is a technique you can use to track row-level changes in database tables in response to create, update, and delete operations. In this article, we use [CDC Connectors for Apache Flink®](https://github.com/ververica/flink-cdc-connectors), which offer a set of source connectors for Apache Flink. The connectors integrate [Debezium®](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/formats/debezium/#debezium-format) as the engine to capture the data changes.  

Flink supports to interpret Debezium JSON and Avro messages as INSERT/UPDATE/DELETE messages into Flink SQL system. 

This support is useful in many cases to:

- Synchronize incremental data from databases to other systems
- Audit logs
- Build real-time materialized views on databases
- View temporal join changing history of a database table

Now, let us learn how to use Change Data Capture (CDC) of SQL Server using Flink SQL. The SQLServer CDC connector allows for reading snapshot data and incremental data from SQLServer database. 

## Prerequisites
 * [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md) 
 * [Azure SQL Server](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview)

### Apache Flink SQLServer CDC Connector

The SQLServer CDC connector is a Flink Source connector, which reads database snapshot first and then continues to read change events with exactly once processing even failures happen. This example uses FLINK CDC to create a SQLServerCDC table on FLINK SQL

### Use SSH to use Flink SQL-client

We have already covered this section in detail on how to use [secure shell](./flink-web-ssh-on-portal-to-flink-sql.md) with Flink. 

## Prepare table and enable cdc feature on SQL Server sqldb

Let us prepare a table and enable the CDC, You can refer the detailed steps listed on [SQL Documentation](/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server?)

**Create a database**
``` SQL
CREATE DATABASE inventory;
GO
```

**Enable CDC on the SQL Server database**

``` SQL
USE inventory;
EXEC sys.sp_cdc_enable_db;  
GO
```

**Verify that the user has access to the CDC table**
``` SQL
USE inventory
GO
EXEC sys.sp_cdc_help_change_data_capture
GO
``` 

> [!NOTE]
> The query returns configuration information for each table in the database (enabled for CDC). If the result is empty, verify that the user has privileges to access both the capture instance as well as the CDC tables.


**Create and populate our products using a single insert with many rows**

``` SQL
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

-- Creating simple orders on SQL Table

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
## Download SQLServer CDC connector and its dependencies on SSH

**WSL to ubuntu on local to check all dependencies related *flink-sql-connector-sqlserver-cdc* jar**

```
myvm@MININT-481C9TJ:/mnt/c/Work/99_tools/apache-maven-3.9.0/bin$ vim pom.xml

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.dep.download</groupId>
    <artifactId>dep-download</artifactId>
    <version>1.0-SNAPSHOT</version>
<!-- https://mvnrepository.com/artifact/com.ververica/flink-sql-connector-sqlserver-cdc -->
	<dependency>
	    <groupId>com.ververica</groupId>
	    <artifactId>flink-sql-connector-sqlserver-cdc</artifactId>
	    <version>2.3.0</version>
	</dependency>
</project>

myvm@MININT-481C9TJ:/mnt/c/Work/99_tools/apache-maven-3.9.0/bin$ mkdir target

myvm@MININT-481C9TJ:/mnt/c/Work/99_tools/apache-maven-3.9.0/bin$ /mnt/c/Work/99_tools/apache-maven-3.9.0/bin/mvn -DoutputDirectory=target -f pom.xml dependency:copy-dependencies
[INFO] Scanning for projects...

myvm@MININT-481C9TJ:/mnt/c/Work/99_tools/apache-maven-3.9.0/bin$ cd target
myvm@MININT-481C9TJ:/mnt/c/Work/99_tools/apache-maven-3.9.0/bin/target$ ll
total 19436
drwxrwxrwx 1 msdata msdata     4096 Feb  9 08:39 ./
drwxrwxrwx 1 msdata msdata     4096 Feb  9 08:37 ../
-rwxrwxrwx 1 msdata msdata    85388 Feb  9 08:39 awaitility-4.0.1.jar*
-rwxrwxrwx 1 msdata msdata  3085931 Feb  9 08:39 flink-shaded-guava-30.1.1-jre-16.0.jar*
-rwxrwxrwx 1 msdata msdata 16556459 Feb  9 08:39 flink-sql-connector-sqlserver-cdc-2.3.0.jar*
-rwxrwxrwx 1 msdata msdata   123103 Feb  9 08:39 hamcrest-2.1.jar*
-rwxrwxrwx 1 msdata msdata    40502 Feb  9 08:39 slf4j-api-1.7.15.jar*
```
**Let us download jars to SSH**
```sql
wget https://repo1.maven.org/maven2/com/ververica/flink-connector-sqlserver-cdc/2.4.0/flink-connector-sqlserver-cdc-2.4.0.jar
wget https://repo1.maven.org/maven2/org/apache/flink/flink-shaded-guava/30.1.1-jre-16.0/flink-shaded-guava-30.1.1-jre-16.0.jar
wget https://repo1.maven.org/maven2/org/awaitility/awaitility/4.0.1/awaitility-4.0.1.jar
wget https://repo1.maven.org/maven2/org/hamcrest/hamcrest/2.1/hamcrest-2.1.jar
wget https://repo1.maven.org/maven2/net/java/loci/jsr308-all/1.1.2/jsr308-all-1.1.2.jar

msdata@pod-0 [ ~/jar ]$ ls -l
total 6988
-rw-r----- 1 msdata msdata   85388 Sep  6  2019 awaitility-4.0.1.jar
-rw-r----- 1 msdata msdata  107097 Jun 25 03:47 flink-connector-sqlserver-cdc-2.4.0.jar
-rw-r----- 1 msdata msdata 3085931 Sep 27  2022 flink-shaded-guava-30.1.1-jre-16.0.jar
-rw-r----- 1 msdata msdata  123103 Dec 20  2018 hamcrest-2.1.jar
-rw-r----- 1 msdata msdata 3742993 Mar 30  2011 jsr308-all-1.1.2.jar
```

### Add jar into sql-client.sh and connect to Flink SQL Client

```sql
msdata@pod-0 [ ~ ]$ bin/sql-client.sh -j jar/flink-sql-connector-sqlserver-cdc-2.4.0.jar -j jar/flink-shaded-guava-30.1.1-jre-16.0.jar -j jar/hamcrest-2.1.jar -j jar/awaitility-4.0.1.jar -j jar/jsr308-all-1.1.2.jar
```
## Create SQLServer CDC table

``` sql
SET 'sql-client.execution.result-mode' = 'tableau';

CREATE TABLE orders (
    id INT,
    order_date DATE,
    purchaser INT,
    quantity INT,
    product_id INT,
    PRIMARY KEY (id) NOT ENFORCED
) WITH (
    'connector' = 'sqlserver-cdc',
    'hostname' = '<updatehostname>.database.windows.net', //update with the host name
    'port' = '1433',
    'username' = '<update-username>', //update with the user name
    'password' = '<update-password>', //update with the password
    'database-name' = 'inventory',
    'table-name' = 'dbo.orders'
);

select * from orders;
``` 

:::image type="content" source="./media/sink-sql-server-table-using-flink-sql/flink-sql-change-data-capture-table-creation.png" alt-text="Screenshot showing Flink CDC Table creation.":::

### Perform changes on table from SQLServer side 

:::image type="content" source="./media/sink-sql-server-table-using-flink-sql/insert-sql-table.png" alt-text="Screenshot showing making changes on SQL Table.":::

## Validation

Monitor the table on Flink SQL

:::image type="content" source="./media/sink-sql-server-table-using-flink-sql/validate-change-data-capture-flink-sql.png" alt-text="Screenshot showing how to CDC monitoring on Flink SQL.":::


###  Reference
* [SQLServer CDC Connector](https://ververica.github.io/flink-cdc-connectors/master/content/connectors/sqlserver-cdc.html) is licensed under [Apache 2.0 License](https://github.com/ververica/flink-cdc-connectors/blob/master/LICENSE)
