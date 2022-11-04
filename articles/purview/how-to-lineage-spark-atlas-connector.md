---
title: Metadata and Lineage from Apache Atlas Spark connector
description: This article describes the data lineage extraction from Spark using Atlas Spark connector.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 04/28/2021
---
# How to use Apache Atlas connector to collect Spark lineage

Apache Atlas Spark Connector is a hook to track Spark SQL/DataFrame data movements and push metadata changes to Microsoft Purview Atlas endpoint. 

## Supported scenarios

This connector supports following tracking:
1.	SQL DDLs like "CREATE/ALTER DATABASE", "CREATE/ALTER TABLE".
2.	SQL DMLs like "CREATE TABLE HelloWorld AS SELECT", "INSERT INTO...", "LOAD DATA [LOCAL] INPATH", "INSERT OVERWRITE [LOCAL] DIRECTORY" and so on.
3.	DataFrame movements that have inputs and outputs.

This connector relies on query listener to retrieve query and examine the impacts. It will correlate with other systems like Hive, HDFS to track the life cycle of data in Atlas.
Since Microsoft Purview supports Atlas API and Atlas native hook, the connector can report lineage to Microsoft Purview  after configured with Spark. The connector could be configured per job or configured as the cluster default setting. 

## Configuration requirement

The connectors require a version of Spark 2.4.0+. But Spark version 3 is not supported. The Spark supports three types of listener required to be set:  

| Listener | 	Since Spark Version|
| ------------------- | ------------------- | 
| spark.extraListeners | 1.3.0 |
| spark.sql.queryExecutionListeners	| 2.3.0 |
| spark.sql.streaming.streamingQueryListeners |	2.4.0 |

>[!IMPORTANT]
> * If the Spark cluster version is below 2.4.0, Stream query lineage and most of the query lineage will not be captured.
>
> * Spark version 3 is not supported.

### Step 1. Prepare Spark Atlas connector package
The following steps are documented based on DataBricks as an example:

1.  Generate package
    1. Pull code from GitHub: https://github.com/hortonworks-spark/spark-atlas-connector
    2. [For Windows] Comment out the **maven-enforcer-plugin** in spark-atlas-connector\pom.xml to remove the dependency on Unix.

    ```web
    <requireOS>
        <family>unix</family>
    </requireOS>
    ```
    
    c. Run command **mvn package -DskipTests** in the project root to build. 
    
    d. Get jar from *~\spark-atlas-connector-assembly\target\spark-atlas-connector-assembly-0.1.0-SNAPSHOT.jar*
    
    e. Put the package where the spark cluster could access. For DataBricks cluster, the package could upload to dbfs folder, such as /FileStore/jars.

2. Prepare Connector config
    1. Get Kafka Endpoint and credential in Azure portal of the Microsoft Purview Account
        1. Provide your account with *“Microsoft Purview Data Curator”* permission 

        :::image type="content" source="./media/how-to-lineage-spark-atlas-connector/assign-purview-data-curator-role.png" alt-text="Screenshot showing data curator role assignment" lightbox="./media/how-to-lineage-spark-atlas-connector/assign-purview-data-curator-role.png":::

        1. Endpoint: Get from *Atlas Kafka endpoint primary connection string*. Endpoint part
        1. Credential: Entire *Atlas Kafka endpoint primary connection string*
        
        :::image type="content" source="./media/how-to-lineage-spark-atlas-connector/atlas-kafka-endpoint.png" alt-text="Screenshot showing atlas kafka endpoint" lightbox="./media/how-to-lineage-spark-atlas-connector/atlas-kafka-endpoint.png":::        
        
    1. Prepare *atlas-application.properties* file,  replace the *atlas.kafka.bootstrap.servers* and the password value in *atlas.kafka.sasl.jaas.config*

    ```script
    atlas.client.type=kafka
    atlas.kafka.sasl.mechanism=PLAIN
    atlas.kafka.security.protocol=SASL_SSL
    atlas.kafka.bootstrap.servers= atlas-46c097e6-899a-44aa-9a30-6ccd0b2a2a91.servicebus.windows.net:9093
    atlas.kafka.sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="<connection string got from your Microsoft Purview account>";
    ```
    
    c.	Make sure the atlas configuration file is in the Driver’s classpath  generated in [step 1 Generate package section above](../purview/how-to-lineage-spark-atlas-connector.md#step-1-prepare-spark-atlas-connector-package). In cluster mode, ship this config file to the remote Drive *--files atlas-application.properties*


### Step 2. Prepare your Microsoft Purview account
After the Atlas Spark model definition is successfully created, follow below steps
1. Get spark type definition from GitHub https://github.com/apache/atlas/blob/release-2.1.0-rc3/addons/models/1000-Hadoop/1100-spark_model.json

2. Assign role:
    1. Navigate to your Microsoft Purview account and select Access control (IAM) 
    1. Add Users and grant your service principal *Microsoft Purview Data source administrator* role
3. Get auth token:
    1. Open "postman" or similar tools 
    1. Use the service principal used in previous step to get the bearer token:
        * Endpoint: https://login.windows.net/microsoft.com/oauth2/token
        * grant_type: client_credentials
        * client_id: {service principal ID}
        * client_secret: {service principal key}
        * resource: `https://purview.azure.net`

        :::image type="content" source="./media/how-to-lineage-spark-atlas-connector/postman-examples.png" alt-text="Screenshot showing postman example" lightbox="./media/how-to-lineage-spark-atlas-connector/postman-examples.png":::      

4. Post Spark Atlas model definition to Microsoft Purview Account:
    1.  Get Atlas Endpoint of the Microsoft Purview account from properties section of Azure portal.
    1. Post Spark type definition into the Microsoft Purview account:
       * Post: {{endpoint}}/api/atlas/v2/types/typedefs
       * Use the generated access token 
       * Body: choose raw and copy all content from GitHub https://github.com/apache/atlas/blob/release-2.1.0-rc3/addons/models/1000-Hadoop/1100-spark_model.json

:::image type="content" source="./media/how-to-lineage-spark-atlas-connector/postman-example-type-definition.png" alt-text="Screenshot showing postman example for type definition" lightbox="./media/how-to-lineage-spark-atlas-connector/postman-example-type-definition.png":::

### Step 3. Prepare Spark job
1. Write your Spark job as normal
2. Add connector settings in your Spark job’s source code. 
Set *'atlas.conf'* system property value in code like below to make sure  *atlas-application.properties* file could be found.

    **System.setProperty("atlas.conf", "/dbfs/FileStore/jars/")**

3. Build your spark job source code to generate jar file. 
4. Put the Spark application jar file in a location where your cluster could access. For example, put the jar file in *"/dbfs/FileStore/jars/"DataBricks* 

### Step 4. Prepare to run job
 
1. Below instructions are for each job Setting:
To capture specific jobs’ lineage, use spark-submit to kick off a job with their parameter. 

    In the job parameter set:
* Path of the connector Jar file. 
* Three listeners: extraListeners, queryExecutionListeners, streamingQueryListeners as the connector. 

| Listener | Details |
| ------------------- | ------------------- | 
| spark.extraListeners	| com.hortonworks.spark.atlas.SparkAtlasEventTracker|
| spark.sql.queryExecutionListeners	| com.hortonworks.spark.atlas.SparkAtlasEventTracker
| spark.sql.streaming.streamingQueryListeners | com.hortonworks.spark.atlas.SparkAtlasStreamingQueryEventTracker |

* The path of your Spark job application Jar file.

Setup Databricks job: Key part is to use spark-submit to run a job with listeners setup properly. Set the listener info in task parameter.   

Below is an example parameter for the spark job.

```script
["--jars","dbfs:/FileStore/jars/spark-atlas-connector-assembly-0.1.0-SNAPSHOT.jar ","--conf","spark.extraListeners=com.hortonworks.spark.atlas.SparkAtlasEventTracker","--conf","spark.sql.queryExecutionListeners=com.hortonworks.spark.atlas.SparkAtlasEventTracker","--conf","spark.sql.streaming.streamingQueryListeners=com.hortonworks.spark.atlas.SparkAtlasStreamingQueryEventTracker","--class","com.microsoft.SparkAtlasTest","dbfs:/FileStore/jars/08cde51d_34d8_4913_a930_46f376606d7f-sparkatlas_1_6_SNAPSHOT-17452.jar"]
```

Below is an example of spark submit from command line:

```script
spark-submit --class com.microsoft.SparkAtlasTest --master yarn --deploy-mode --files /data/atlas-application.properties --jars /data/ spark-atlas-connector-assembly-0.1.0-SNAPSHOT.jar 
--conf spark.extraListeners=com.hortonworks.spark.atlas.SparkAtlasEventTracker 
--conf spark.sql.queryExecutionListeners=com.hortonworks.spark.atlas.SparkAtlasEventTracker 
--conf spark.sql.streaming.streamingQueryListeners=com.hortonworks.spark.atlas.SparkAtlasEventTracker
/data/worked/sparkApplication.jar
```

2. Below instructions are for Cluster Setting:
The connector jar and listener’s setting should be put in Spark clusters’: *conf/spark-defaults.conf*. Spark-submit will read the options in *conf/spark-defaults.conf* and pass them to your application. 
 
### Step 5. Run and Check lineage in Microsoft Purview account
Kick off The Spark job and check the lineage info in your Microsoft Purview account. 

:::image type="content" source="./media/how-to-lineage-spark-atlas-connector/purview-with-spark-lineage.png" alt-text="Screenshot showing purview with spark lineage" lightbox="./media/how-to-lineage-spark-atlas-connector/purview-with-spark-lineage.png":::

## Known limitations with the connector for Spark lineage
1. Supports SQL/DataFrame API (in other words, it does not support RDD). This connector relies on query listener to retrieve query and examine the impacts.
    
2. All "inputs" and "outputs" from multiple queries are combined into single "spark_process" entity.
    
    "spark_process" maps to an "applicationId" in Spark. It allows admin to track all changes that occurred as part of an application. But also causes lineage/relationship graph in "spark_process" to be complicated and less meaningful.
3. Only part of inputs is tracked in Streaming query.

* Kafka source supports subscribing with "pattern" and this connector does not enumerate all existing matching topics, or even all possible topics 
 
* The "executed plan" provides actual topics with (micro) batch reads and processes. As a result, only inputs that participate in (micro) batch are included as "inputs" of "spark_process" entity.
    
4. This connector doesn't support columns level lineage.

5. It doesn't track tables that are dropped (Spark models).

    The "drop table" event from Spark only provides db and table name, which is NOT sufficient to create the unique key to recognize the table.

    The connector depends on reading the Spark Catalog to get table information. Spark have already dropped the table when this connector notices the table is dropped, so drop table will not work.


## Next steps

- [Learn about Data lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)
