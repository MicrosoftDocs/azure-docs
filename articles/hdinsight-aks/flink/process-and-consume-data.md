---
title: Using Apache Kafka® on HDInsight with Apache Flink® on HDInsight on AKS
description: Learn how to use Apache Kafka® on HDInsight with Apache Flink® on HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---
 
# Using Apache Kafka® on HDInsight with Apache Flink® on HDInsight on AKS

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

A well known use case for Apache Flink is stream analytics. The popular choice by many users to use the data streams, which are ingested using Apache Kafka. Typical installations of Flink and Kafka start with event streams being pushed to Kafka, which can be consumed by Flink jobs.

This example uses HDInsight on AKS clusters running Flink 1.16.0 to process streaming data consuming and producing Kafka topic. 

> [!NOTE]
> FlinkKafkaConsumer is deprecated and will be removed with Flink 1.17, please use KafkaSource instead.
> FlinkKafkaProducer is deprecated and will be removed with Flink 1.15, please use KafkaSink instead.

## Prerequisites

* Both Kafka and Flink need to be in the same VNet or there should be vnet-peering between the two clusters. 
* [Creation of VNet](../../hdinsight/hdinsight-create-virtual-network.md).
* [Create a Kafka cluster in the same VNet](../../hdinsight/kafka/apache-kafka-get-started.md). You can choose Kafka 3.2 or 2.4 on HDInsight based on your current usage.

  :::image type="content" source="./media/process-consume-data/create-kafka-cluster-in-the-same-vnet.png" alt-text="Screenshot showing how to	create a Kafka cluster in the same VNet." border="true" lightbox="./media/process-consume-data/create-kafka-cluster-in-the-same-vnet.png":::
  
* Add the VNet details in the virtual network section.  
* Create a [HDInsight on AKS Cluster pool](../quickstart-create-cluster.md) with same VNet.
* Create a Flink cluster to the cluster pool created. 

## Apache Kafka Connector

Flink provides an [Apache Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/kafka/) for reading data from and writing data to Kafka topics with exactly once guarantees.

**Maven dependency**
``` xml
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>1.16.0</version>
        </dependency>
```

## Building Kafka Sink 

Kafka sink provides a builder class to construct an instance of a KafkaSink. We use the same to construct our Sink and use it along with Flink cluster running on HDInsight on AKS

**SinKafkaToKafka.java**
``` java
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.base.DeliveryGuarantee;

import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;

import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class SinKafkaToKafka {
    public static void main(String[] args) throws Exception {
        // 1. get stream execution environment
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // 2. read kafka message as stream input, update your broker IPs below
        String brokers = "X.X.X.X:9092,X.X.X.X:9092,X.X.X.X:9092";
        KafkaSource<String> source = KafkaSource.<String>builder()
                .setBootstrapServers(brokers)
                .setTopics("clicks")
                .setGroupId("my-group")
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStream<String> stream = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");
        
        // 3. transformation: 
        // https://www.taobao.com,1000 ---> 
        // Event{user: "Tim",url: "https://www.taobao.com",timestamp: 1970-01-01 00:00:01.0}
        SingleOutputStreamOperator<String> result = stream.map(new MapFunction<String, String>() {
            @Override
            public String map(String value) throws Exception {
                String[] fields = value.split(",");
                return new Event(fields[0].trim(), fields[1].trim(), Long.valueOf(fields[2].trim())).toString();
            }
        });

        // 4. sink click into another kafka events topic
        KafkaSink<String> sink = KafkaSink.<String>builder()
                .setBootstrapServers(brokers)
                .setProperty("transaction.timeout.ms","900000")
                .setRecordSerializer(KafkaRecordSerializationSchema.builder()
                        .setTopic("events")
                        .setValueSerializationSchema(new SimpleStringSchema())
                        .build())
                .setDeliveryGuarantee(DeliveryGuarantee.EXACTLY_ONCE)
                .build();

        result.sinkTo(sink);

       // 5. execute the stream
        env.execute("kafka Sink to other topic");
    }
}
```
**Writing a Java program Event.java**
``` java
import java.sql.Timestamp;

public class Event {

    public String user;
    public String url;
    public Long timestamp;

    public Event() {
    }

    public Event(String user,String url,Long timestamp) {
        this.user = user;
        this.url = url;
        this.timestamp = timestamp;
    }

    @Override
    public String toString(){
        return "Event{" +
                "user: \"" + user + "\""  +
                ",url: \"" + url + "\""  +
                ",timestamp: " + new Timestamp(timestamp) +
                "}";
    }
}
```
## Package the jar and submit the job to Flink

:::image type="content" source="./media/process-consume-data/submit-jar-flink.png" alt-text="Screenshot showing how to submit the Kafka topic packaged jar as a job to Flink.":::

:::image type="content" source="./media/process-consume-data/running-job-flink.png" alt-text="Screenshot showing job running on Flink.":::

## Produce the topic - clicks on Kafka

:::image type="content" source="./media/process-consume-data/produce-kafka-topics.png" alt-text="Screenshot showing how to produce Kafka topic." border="true" lightbox="./media/process-consume-data/produce-kafka-topics.png":::

## Consume the topic - events on Kafka

:::image type="content" source="./media/process-consume-data/consume-kafka-topics.png" alt-text="Screenshot showing how to consume Kafka topic." border="true" lightbox="./media/process-consume-data/consume-kafka-topics.png":::

## Reference

* [Apache Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.13/docs/connectors/datastream/kafka)
* Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
