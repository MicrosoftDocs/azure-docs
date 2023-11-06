---
title: Enrich the events from Apache Kafka® with the attributes from FileSystem with Apache Flink®
description: Learn how to join stream from Kafka with table from fileSystem using Apache Flink® DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Enrich the events from Apache Kafka® with attributes from ADLS Gen2 with Apache Flink®

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

In this article, you can learn how you can enrich the real time events by joining a stream from Kafka with table on ADLS Gen2 using Flink Streaming. We use Flink Streaming API to join events from HDInsight Kafka with attributes from ADLS Gen2, further we use attributes-joined events to sink into another Kafka topic.

## Prerequisites

* [Flink cluster on HDInsight on AKS](../flink/flink-create-cluster-portal.md) 
* [Kafka cluster on HDInsight](../../hdinsight/kafka/apache-kafka-get-started.md)
    *  You're required to ensure the network settings are taken care as described on [Using Kafka on HDInsight](../flink/process-and-consume-data.md); that's to make sure HDInsight on AKS and HDInsight clusters are in the same VNet 
* For this demonstration, we're using a Window VM as maven project develop environment in the same VNet as HDInsight on AKS  

## Kafka topic preparation

We're creating a topic called `user_events`. 

- The purpose is to read a stream of real-time events from a Kafka topic using Flink. We have every event with the following fields:
  ```
  user_id,
  item_id, 
  type, 
  timestamp, 
  ```

**Kafka 2.4.1**
```
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user_events --zookeeper zk0-contos:2181
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user_events_output --zookeeper zk0-contos:2181
```

**Kafka 3.2.0**
```
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user_events --bootstrap-server wn0-contsk:9092
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user_events_output --bootstrap-server wn0-contsk:9092
```

## Prepare file on ADLS Gen2

We are creating a file called `item attributes` in our storage

- The purpose is to read a batch of `item attributes` from a file on ADLS Gen2. Each item has the following fields:
  ```
  item_id, 
  brand, 
  category, 
  timestamp, 
  ```

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-2.png" alt-text="Screenshot showing Prepare a batch item attributes file on ADLS Gen2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-2.png":::

## Develop the Apache Flink job 

In this step we perform the following activities
- Enrich the `user_events` topic from Kafka by joining with `item attributes` from a file on ADLS Gen2.
- We push the outcome of this step, as an enriched user activity of events into a Kafka topic.

### Develop Maven project

**pom.xml**

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>contoso.example</groupId>
    <artifactId>FlinkKafkaJoinGen2</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <kafka.version>3.2.0</kafka.version> //replace with 2.4.1 if you are using HDInsight Kafka 2.4.1
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

**Join the Kafka topic with ADLS Gen2 File**

**KafkaJoinGen2Demo.java**

``` java
package contoso.example;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.java.tuple.Tuple4;
import org.apache.flink.api.java.tuple.Tuple7;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;

public class KafkaJoinGen2Demo {
    public static void main(String[] args) throws Exception {
        // 1. Set up the stream execution environment
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // Kafka source configuration, update with your broker IPs
        String brokers = "<broker-ip>:9092,<broker-ip>:9092,<broker-ip>:9092";
        String inputTopic = "user_events";
        String outputTopic = "user_events_output";
        String groupId = "my_group";

        // 2. Register the cached file, update your container name and storage name
        env.registerCachedFile("abfs://<container-name>@<storagename>.dfs.core.windows.net/flink/data/item.txt", "file1");

        // 3. Read a stream of real-time user behavior event from a Kafka topic
        KafkaSource<String> kafkaSource = KafkaSource.<String>builder()
                .setBootstrapServers(brokers)
                .setTopics(inputTopic)
                .setGroupId(groupId)
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStream<String> kafkaData = env.fromSource(kafkaSource, WatermarkStrategy.noWatermarks(), "Kafka Source");

        // Parse Kafka source data
        DataStream<Tuple4<String, String, String, String>> userEvents = kafkaData.map(new MapFunction<String, Tuple4<String, String, String, String>>() {
            @Override
            public Tuple4<String, String, String, String> map(String value) throws Exception {
                // Parse the line into a Tuple4
                String[] parts = value.split(",");
                return new Tuple4<>(parts[0], parts[1], parts[2], parts[3]);
            }
        });

        // 4. Enrich the user activity events by joining the items' attributes from a file
        DataStream<Tuple7<String,String,String,String,String,String,String>> enrichedData = userEvents.map(new MyJoinFunction());

        // 5. Output the enriched user activity events to a Kafka topic
        KafkaSink<String> sink = KafkaSink.<String>builder()
                .setBootstrapServers(brokers)
                .setRecordSerializer(KafkaRecordSerializationSchema.builder()
                        .setTopic(outputTopic)
                        .setValueSerializationSchema(new SimpleStringSchema())
                        .build()
                )
                .build();

        enrichedData.map(value -> value.toString()).sinkTo(sink);

        // 6. Execute the Flink job
        env.execute("Kafka Join Batch gen2 file, sink to another Kafka Topic");
    }

    private static class MyJoinFunction extends RichMapFunction<Tuple4<String,String,String,String>, Tuple7<String,String,String,String,String,String,String>> {
        private Map<String, Tuple4<String, String, String, String>> itemAttributes;

        @Override
        public void open(Configuration parameters) throws Exception {
            super.open(parameters);

            // Read the cached file and parse its contents into a map
            itemAttributes = new HashMap<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(getRuntimeContext().getDistributedCache().getFile("file1")))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] parts = line.split(",");
                    itemAttributes.put(parts[0], new Tuple4<>(parts[0], parts[1], parts[2], parts[3]));
                }
            }
        }

        @Override
        public Tuple7<String,String,String,String,String,String,String> map(Tuple4<String,String,String,String> value) throws Exception {
            Tuple4<String, String, String, String> broadcastValue = itemAttributes.get(value.f1);
            if (broadcastValue != null) {
                return Tuple7.of(value.f0,value.f1,value.f2,value.f3,broadcastValue.f1,broadcastValue.f2,broadcastValue.f3);
            } else {
                return null;
            }
        }
    }
}
```

## Package jar and submit to Apache Flink

We're submitting the packaged jar to Flink:

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-4-1-kafka-3-2.png" alt-text="Screenshot showing Packaging the jar and submit to Flink with Kafka 3.2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-4-1-kafka-3-2.png":::


:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-4-2-kafka-3-2.png" alt-text="Screenshot showing Packaging the jar and submit to Flink as further step with Kafka 3.2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-4-2-kafka-3-2.png":::

### Produce real-time `user_events` topic on Kafka

 We are able to produce real-time user behavior event `user_events` in Kafka.

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-5-kafka-3-2.png" alt-text="Screenshot showing a real-time user behavior event on Kafka 3.2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-5-kafka-3-2.png":::

### Consume the `itemAttributes` joining with `user_events` on Kafka

We are now using `itemAttributes` on filesystem join user activity events `user_events`.

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-6-kafka-3-2.png" alt-text="Screenshot showing Consume the item attributes-joined user activity events on Kafka 3.2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-6-kafka-3-2.png":::

We continue to produce and consume the user activity and item attributes in the following images

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-7-kafka-3-2.png" alt-text="Screenshot showing how we continue to produce a real-time user behavior event on Kafka 3.2." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-7-kafka-3-2.png":::

:::image type="content" source="./media/join-stream-kafka-table-filesystem/step-8-kafka-3-2.png" alt-text="Screenshot showing how we continue to consume the item attributes-joined user activity events on Kafka." border="true" lightbox="./media/join-stream-kafka-table-filesystem/step-8-kafka-3-2.png":::

## Reference

- [Flink Examples](https://github.com/flink-extended/)
- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
