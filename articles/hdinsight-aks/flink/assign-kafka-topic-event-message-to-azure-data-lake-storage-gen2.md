---
title: Write event messages into Azure Data Lake Storage Gen2 with DataStream API
description: Learn how to write event messages into Azure Data Lake Storage Gen2 with DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Write event messages into Azure Data Lake Storage Gen2 with DataStream API

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Apache Flink uses file systems to consume and persistently store data, both for the results of applications and for fault tolerance and recovery. In this article, learn how to write event messages into Azure Data Lake Storage Gen2 with DataStream API. 

## Prerequisites

* [HDInsight on AKS Apache Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)
  * You're  required to ensure the network settings are taken care as described on [Using HDInsight Kafka](../flink/process-and-consume-data.md); that's to make sure HDInsight on AKS Flink and HDInsight Kafka are in the same Virtual Network 
* Use MSI to access ADLS Gen2 
* IntelliJ for development on an Azure VM in HDInsight on AKS Virtual Network 

## Apache Flink FileSystem connector

This filesystem connector provides the same guarantees for both BATCH and STREAMING and is designed to provide exactly once semantics for STREAMING execution. For more information, see [Flink DataStream Filesystem](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/filesystem)

## Apache Kafka Connector

Flink provides an Apache Kafka connector for reading data from and writing data to Kafka topics with exactly once guarantees. For more information, see [Apache Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/kafka)

## Build the project for Apache Flink

**pom.xml on IntelliJ IDEA**

``` xml
<properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <kafka.version>3.2.0</kafka.version>
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
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-files -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-files</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
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

**Program for ADLS Gen2 Sink**

*abfsGen2.java*

> [!Note]
> Replace [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)bootStrapServers with your own brokers for Kafka 2.4 or 3.2

``` java
package contoso.example;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringEncoder;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.configuration.MemorySize;
import org.apache.flink.connector.file.sink.FileSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.core.fs.Path;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.filesystem.rollingpolicies.DefaultRollingPolicy;

import java.time.Duration;

public class KafkaSinkToGen2 {
    public static void main(String[] args) throws Exception {
        // 1. get stream execution env
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // 1. read kafka message as stream input, update your broker ip's
        String brokers = "<update-broker-ip>:9092,<update-broker-ip>:9092,<update-broker-ip>:9092";
        KafkaSource<String> source = KafkaSource.<String>builder()
                .setBootstrapServers(brokers)
                .setTopics("click_events")
                .setGroupId("my-group")
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStream<String> stream = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");
        stream.print();

        // 3. sink to gen2, update container name and storage path
        String outputPath  = "abfs://<container-name>@<storage-path>.dfs.core.windows.net/flink/data/click_events";
        final FileSink<String> sink = FileSink
                .forRowFormat(new Path(outputPath), new SimpleStringEncoder<String>("UTF-8"))
                .withRollingPolicy(
                        DefaultRollingPolicy.builder()
                                .withRolloverInterval(Duration.ofMinutes(2))
                                .withInactivityInterval(Duration.ofMinutes(3))
                                .withMaxPartSize(MemorySize.ofMebiBytes(5))
                                .build())
                .build();

        stream.sinkTo(sink);

        // 4. run stream
        env.execute("Kafka Sink To Gen2");
    }
}

```

**Submit the job on Flink Dashboard UI**

We are using Maven to package a jar onto local and submitting to Flink, and using Kafka to sink into ADLS Gen2

:::image type="content" source="./media/assign-kafka-topic-event-message-to-azure-data-lake-storage-gen2/submit-the-job-flink-ui.png" alt-text="Screenshot showing jar submission to Flink dashboard.":::
:::image type="content" source="./media/assign-kafka-topic-event-message-to-azure-data-lake-storage-gen2/submit-the-job-flink-ui-2.png" alt-text="Screenshot showing job running on Flink dashboard.":::

**Validate streaming data on ADLS Gen2**

We are seeing the `click_events` streaming into ADLS Gen2

:::image type="content" source="./media/assign-kafka-topic-event-message-to-azure-data-lake-storage-gen2/validate-stream-azure-data-lake-storage-gen2-1.png" alt-text="Screenshot showing ADLS Gen2 output.":::
:::image type="content" source="./media/assign-kafka-topic-event-message-to-azure-data-lake-storage-gen2/validate-stream-azure-data-lake-storage-gen2-2.png" alt-text="Screenshot showing Flink click event output.":::

You can specify a rolling policy that rolls the in-progress part file on any of the following three conditions:

``` java
.withRollingPolicy(
                        DefaultRollingPolicy.builder()
                                .withRolloverInterval(Duration.ofMinutes(5))
                                .withInactivityInterval(Duration.ofMinutes(3))
                                .withMaxPartSize(MemorySize.ofMebiBytes(5))
                                .build())
```

## Reference
- [Apache Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/kafka)
- [Flink DataStream Filesystem](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/filesystem)

