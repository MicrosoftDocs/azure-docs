---
title: Microsoft Fabric with Apache Flink in HDInsight on AKS
description: An introduction to lakehouse on Microsoft Fabric with Apache Flink over HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---
# Connect to OneLake in Microsoft Fabric with HDInsight on AKS cluster for Apache Flink

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This example demonstrates on how to use HDInsight on AKS Apache Flink with [Microsoft Fabric](/fabric/get-started/microsoft-fabric-overview).

[Microsoft Fabric](/fabric/get-started/microsoft-fabric-overview) is an all-in-one analytics solution for enterprises that covers everything from data movement to data science, Real-Time Analytics, and business intelligence. It offers a comprehensive suite of services, including data lake, data engineering, and data integration, all in one place. 
With Fabric, you don't need to piece together different services from multiple vendors. Instead, you can enjoy a highly integrated, end-to-end, and easy-to-use product that is designed to simplify your analytics needs. 

In this example, you learn how to connect to OneLake in Microsoft Fabric with HDInsight on AKS cluster for Apache Flink.

## Prerequisites
* [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* Create a License Mode of at least Premium Capacity Workspace on [Power BI](https://app.powerbi.com/)
* [Create a Lake House](/fabric/data-engineering/tutorial-build-lakehouse) on this workspace

## Connect to One Lake Storage 

### Microsoft Fabric and Lakehouse

**Lakehouse in Microsoft Fabric**

[Microsoft Fabric Lakehouse](/fabric/data-engineering/lakehouse-overview) is a data architecture platform for storing, managing, and analyzing structured and unstructured data in a single location. 

> [!Note]
> [Microsoft Fabric](/fabric/get-started/microsoft-fabric-overview) is in [preview](/fabric/get-started/preview)

#### Managed identity access to the Fabric workspace

In this step, we provide access to the *user managed identity* to Fabric. You're required to type the *user assigned managed identity* and add to your Fabric workspace. 

 :::image type="content" source="./media/fabric-lakehouse-flink-datastream-api/managed-identity-access-fabric.png" alt-text="Screenshot showing how to provide access to the user managed identity to Fabric." border="true" lightbox="./media/fabric-lakehouse-flink-datastream-api/managed-identity-access-fabric.png":::

#### Prepare a Delta table under LakeHouse Files folder

In this step, you see how we prepare a Delta table on the lakehouse on Microsoft Fabric; Flink developers can build into broader Lakehouse architecture with this setup.

:::image type="content" source="./media/fabric-lakehouse-flink-datastream-api/delta-table-under-lakehouse.png" alt-text="Screenshot showing preparation of a Delta table on the lakehouse on Microsoft Fabric." border="true" lightbox="./media/fabric-lakehouse-flink-datastream-api/delta-table-under-lakehouse.png":::

### Apache Flink DataStream Source code

In this step, we prepare the jar to submit to the HDInsight on AKS, Apache Flink cluster. 

This step illustrates, that we package dependencies needed for onelakeDemo

**maven pom.xml**
``` xml
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
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
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-core</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-clients -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-clients</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-avro -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-avro</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-api-java-bridge -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table-api-java-bridge</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-files -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-files</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table</artifactId>
            <version>${flink.version}</version>
            <type>pom</type>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-parquet</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.parquet</groupId>
            <artifactId>parquet-avro</artifactId>
            <version>1.12.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-core</artifactId>
            <version>1.2.1</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <appendAssemblyId>false</appendAssemblyId>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

**main: onelakeDemo**

In this step, we read parquet file on Fabric lakehouse and then sink to another file in the same folder:

``` java
package contoso.example;

import org.apache.avro.Schema;
import org.apache.avro.generic.GenericRecord;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.connector.file.src.FileSource;
import org.apache.flink.core.fs.Path;

import org.apache.flink.formats.parquet.avro.AvroParquetReaders;
import org.apache.flink.formats.parquet.avro.ParquetAvroWriters;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.apache.flink.streaming.api.functions.sink.filesystem.StreamingFileSink;

public class onelakeDemo {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        Path sourcePath = new Path("abfss://contosoworkspace1@msit-onelake.dfs.fabric.microsoft.com/contosolakehouse.Lakehouse/Files/delta/tab1/");
        Path sinkPath = new Path("abfss://contosoworkspace1@msit-onelake.dfs.fabric.microsoft.com/contosolakehouse.Lakehouse/Files/delta/tab1_out/");

        Schema avroSchema = new Schema.Parser()
                .parse("{\"type\":\"record\",\"name\":\"example\",\"fields\":[{\"name\":\"Date\",\"type\":\"string\"},{\"name\":\"Time\",\"type\":\"string\"},{\"name\":\"TargetTemp\",\"type\":\"string\"},{\"name\":\"ActualTemp\",\"type\":\"string\"},{\"name\":\"System\",\"type\":\"string\"},{\"name\":\"SystemAge\",\"type\":\"string\"},{\"name\":\"BuildingID\",\"type\":\"string\"}]}");

        FileSource<GenericRecord> source =
                FileSource.forRecordStreamFormat(
                                AvroParquetReaders.forGenericRecord(avroSchema), sourcePath)
                        .build();

        StreamingFileSink<GenericRecord> sink =
                StreamingFileSink.forBulkFormat(
                                sinkPath,
                                ParquetAvroWriters.forGenericRecord(avroSchema))
                        .build();

        env.enableCheckpointing(10L);

        DataStream<GenericRecord> stream =
                env.fromSource(source, WatermarkStrategy.noWatermarks(), "file-source");

        stream.addSink((SinkFunction<GenericRecord>) sink);
        env.execute();
    }
}
```
### Package the jar and submit to Flink

Here, we use the packaged jar and submit to Flink cluster 

:::image type="content" source="./media/fabric-lakehouse-flink-datastream-api/jar-submit-flink-step-1.png" alt-text="Screenshot showing How to submit packaged jar and submitting to Flink cluster - step 1." border="true" lightbox="./media/fabric-lakehouse-flink-datastream-api/jar-submit-flink-step-1.png":::

:::image type="content" source="./media/fabric-lakehouse-flink-datastream-api/jar-submit-flink-step-2.png" alt-text="Screenshot showing How to submit packaged jar and submitting to Flink cluster - step 2." border="true" lightbox="./media/fabric-lakehouse-flink-datastream-api/jar-submit-flink-step-2.png":::

### Results on Microsoft Fabric 

Let's check the output on Microsoft Fabric

:::image type="content" source="./media/fabric-lakehouse-flink-datastream-api/output-on-fabric.png" alt-text="Screenshot showing the output on Microsoft Fabric." border="true" lightbox="./media/fabric-lakehouse-flink-datastream-api/output-on-fabric.png":::


### References
* [Microsoft Fabric](/fabric/get-started/microsoft-fabric-overview)
* [Microsoft Fabric Lakehouse](/fabric/data-engineering/lakehouse-overview)
