---
title: Change Data Capture (CDC) of PostgreSQL table using Apache FlinkSQL
description: Learn how to perform CDC on PostgreSQL table using Apache FlinkSQL CDC
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Change Data Capture (CDC) of PostgreSQL table using Apache FlinkSQL

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Change Data Capture (CDC) is a technique you can use to track row-level changes in database tables in response to create, update, and delete operations. In this article, we use [CDC Connectors for Apache Flink®](https://github.com/ververica/flink-cdc-connectors), which offer a set of source connectors for Apache Flink. The connectors integrate [Debezium®](https://nightlies.apache.org/flink/flink-docs-master/docs/connectors/table/formats/debezium/#debezium-format) as the engine to capture the data changes.  

Flink supports to interpret Debezium JSON and Avro messages as INSERT/UPDATE/DELETE messages into Apache Flink SQL system. 

This support is useful in many cases to:

- Synchronize incremental data from databases to other systems
- Audit logs
- Build real-time materialized views on databases
- View temporal join changing history of a database table


Now, let's learn how to monitor changes on PostgreSQL table using Flink-SQL CDC. The PostgreSQL CDC connector allows for reading snapshot data and incremental data from PostgreSQL database. 

## Prerequisites

* [Azure PostgresSQL flexible server Version 14.7](/azure/postgresql/flexible-server/overview)
* [HDInsight on AKS Flink 1.16.0](./flink-create-cluster-portal.md) 
* Linux virtual Machine to use PostgreSQL client
* Add the NSG rule that allows inbound and outbound connections on port 5432 in HDInsight on AKS pool subnet.

## Prepare PostgreSQL table & Client

- Using a Linux virtual machine, install PostgreSQL client using below commands

    ```
    sudo apt-get update
    sudo apt-get install postgresql-client
    ```

- Install the certificate to connect to PostgreSQL server using SSL

    `wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem`

- Connect to the server (replace host, username and database name accordingly)

    ```
    psql --host=flinkpostgres.postgres.database.azure.com --port=5432 --username=admin --dbname=postgres --set=sslmode=require --set=sslrootcert=DigiCertGlobalRootCA.crt.pem
    ```
- After connecting to the database successfully, create a sample table
   ``` 
   CREATE TABLE shipments (
      shipment_id SERIAL NOT NULL PRIMARY KEY,
      order_id SERIAL NOT NULL,
      origin VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      is_arrived BOOLEAN NOT NULL
    );
    ALTER SEQUENCE public.shipments_shipment_id_seq RESTART WITH 1001;
    ALTER TABLE public.shipments REPLICA IDENTITY FULL;
    INSERT INTO shipments
    VALUES (default,10001,'Beijing','Shanghai',false),
       (default,10002,'Hangzhou','Shanghai',false),
       (default,10003,'Shanghai','Hangzhou',false);
    ``` 

- To enable CDC on PostgreSQL database, you're required to make the following changes.
    
    - WAL level must be changed to **logical**. This value can be changed in server parameters section on Azure portal.

        :::image type="content" source="./media/monitor-changes-postgres-table-flink/enable-cdc-on-postgres-database.png" alt-text="Screenshot showing how to enable-cdc-on-postgres-database." border="true" lightbox="./media/monitor-changes-postgres-table-flink/enable-cdc-on-postgres-database.png":::

    - User accessing the table must have 'REPLICATION' role added

         ALTER USER `<username>` WITH REPLICATION;

## Create Apache Flink PostgreSQL CDC table

- To create Flink PostgreSQL CDC table,  download all the dependent jars. Use the `pom.xml` file with the following contents.

    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0  http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.dep.download</groupId>
        <artifactId>dep-download</artifactId>
        <version>1.0-SNAPSHOT</version>
            <!-- https://mvnrepository.com/artifact/com.ververica/flink-sql-connector-sqlserver-cdc -->
        <dependencies>
        <dependency>
            <groupId>com.ververica</groupId>
            <artifactId>flink-sql-connector-postgres-cdc</artifactId>
            <version>2.3.0</version>
        </dependency>
        </dependencies>
    </project>
    ```
-  Use maven command to download all the dependent jars

    ```
       mvn -DoutputDirectory=target -f pom.xml dependency:copy-dependencies -X
    ```

    > [!NOTE]
    > * If your web ssh pod does not contain maven please follow the links to download and install it.
    >     * https://maven.apache.org/download.cgi
    >     * https://maven.apache.org/install.html
    > * In order to download jsr jar file use the following command
    >     * `wget https://repo1.maven.org/maven2/net/java/loci/jsr308-all/1.1.2/jsr308-all-1.1.2.jar`

-  Once the dependent jars are downloaded start the [Flink SQL client](./flink-web-ssh-on-portal-to-flink-sql.md), with these jars to be imported into the session. Complete command as follows,

    ```sql
    /opt/flink-webssh/bin/sql-client.sh -j
    /opt/flink-webssh/target/flink-sql-connector-postgres-cdc-2.3.0.jar -j
    /opt/flink-webssh/target/slf4j-api-1.7.15.jar -j
    /opt/flink-webssh/target/hamcrest-2.1.jar -j
    /opt/flink-webssh/target/flink-shaded-guava-30.1.1-jre-16.0.jar -j
    /opt/flink-webssh/target/awaitility-4.0.1.jar -j
    /opt/flink-webssh/target/jsr308-all-1.1.2.jar
    ```
    These commands start the sql client with the dependencies as,

     :::image type="content" source="./media/monitor-changes-postgres-table-flink/start-the-sql-client.png" alt-text="Screenshot showing start-the-sql-client." border="true" lightbox="./media/monitor-changes-postgres-table-flink/start-the-sql-client.png":::

     :::image type="content" source="./media/monitor-changes-postgres-table-flink/sql-client-status.png" alt-text="Screenshot showing sql-client-status."    border="true" lightbox="./media/monitor-changes-postgres-table-flink/sql-client-status.png":::


- Create a Flink PostgreSQL CDC table using CDC connector

    ``` 
    CREATE TABLE shipments (
       shipment_id INT,
       order_id INT,
       origin STRING,
       destination STRING,
       is_arrived BOOLEAN,
       PRIMARY KEY (shipment_id) NOT ENFORCED
     ) WITH (
       'connector' = 'postgres-cdc',
       'hostname' = 'flinkpostgres.postgres.database.azure.com',
       'port' = '5432',
       'username' = 'username',
       'password' = 'admin',
       'database-name' = 'postgres',
       'schema-name' = 'public',
       'table-name' = 'shipments',
       'decoding.plugin.name' = 'pgoutput'
     );
    ```
## Validation

- Run 'select *' command to monitor the changes.
  
    `select * from shipments;`

     :::image type="content" source="./media/monitor-changes-postgres-table-flink/run-select-command.png" alt-text="Screenshot showing how to run-select-command." border="true" lightbox="./media/monitor-changes-postgres-table-flink/run-select-command.png":::

### Reference

[PostgreSQL CDC Connector](https://ververica.github.io/flink-cdc-connectors/release-2.1/content/connectors/postgres-cdc.html) is licensed under [Apache 2.0 License](https://github.com/ververica/flink-cdc-connectors/blob/master/LICENSE)
