---
title: Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS
description: How to integrate Azure IoT Hub and Apache Flink®
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/03/2023
---

# Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS

Azure IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communication between an IoT application and its attached devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT hub.

## Prerequisites

1. [Create an Azure IoTHub](/azure/iot-hub/iot-hub-create-through-portal/)
2. [Create Flink cluster on HDInsight on AKS](./flink-create-cluster-portal.md)

## Configure Flink cluster

Add ABFS storage account keys in your Flink cluster's configuration.

Add the following configurations:

`fs.azure.account.key.<your storage account's dfs endpoint> = <your storage account's shared access key>`

:::image type="content" source="./media/azure-iot-hub/configuration-management.png" alt-text="Diagram showing search bar in Azure portal." lightbox="./media/azure-iot-hub/configuration-management.png":::

## Writing the Flink job

### Set up configuration for ABFS

```java
Properties props = new Properties();
props.put(
        "fs.azure.account.key.<your storage account's dfs endpoint>",
        "<your storage account's shared access key>"
);

Configuration conf = ConfigurationUtils.createConfiguration(props);

StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment(conf);

```


This set up is required for Flink to authenticate with your ABFS storage account to write data to it.

### Defining the IoT Hub source

IoTHub is build on top of event hub and hence supports a kafka-like API. So in our Flink job, we can define a `KafkaSource` with appropriate parameters to consume messages from IoTHub.

```java
String connectionString  = "<your iot hub connection string>";

KafkaSource<String> source = KafkaSource.<String>builder()
        .setBootstrapServers("<your iot hub's service bus url>:9093")
        .setTopics("<name of your iot hub>")
        .setGroupId("$Default")
        .setProperty("partition.discovery.interval.ms", "10000")
        .setProperty("security.protocol", "SASL_SSL")
        .setProperty("sasl.mechanism", "PLAIN")
        .setProperty("sasl.jaas.config", String.format("org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$ConnectionString\" password=\"%s\";", connectionString))
        .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
        .setValueOnlyDeserializer(new SimpleStringSchema())
        .build();

DataStream<String> kafka = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");
kafka.print();
```

The connection string for IoT Hub can be found here -

:::image type="content" source="./media/azure-iot-hub/built-in-endpoint.png" alt-text="Screenshot shows built-in endpoints." lightbox="./media/azure-iot-hub/built-in-endpoint.png":::

Within the connection string, you can find a service bus URL (URL of the underlying event hub namespace), which you need to add as a bootstrap server in your kafka source. In this case, it is:  `iothub-ns-sagiri-iot-25146639-20dff4e426.servicebus.windows.net:9093`

### Defining the ABFS sink

```java
String outputPath  = "abfs://<container name>@<your storage account's dfs endpoint>";

final FileSink<String> sink = FileSink
                .forRowFormat(new Path(outputPath), new SimpleStringEncoder<String>("UTF-8"))
                .withRollingPolicy(
                                DefaultRollingPolicy.builder()
                                                .withRolloverInterval(Duration.ofMinutes(2))
                                                .withInactivityInterval(Duration.ofMinutes(3))
                                                .withMaxPartSize(MemorySize.ofMebiBytes(5))
                                                .build())
                .build();

kafka.sinkTo(sink);
```

### Flink job code

```java
package org.example;

import java.time.Duration;
import java.util.Properties;
import org.apache.flink.api.common.serialization.SimpleStringEncoder;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.configuration.ConfigurationUtils;
import org.apache.flink.configuration.MemorySize;
import org.apache.flink.connector.file.sink.FileSink;
import org.apache.flink.core.fs.Path;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.streaming.api.functions.sink.filesystem.rollingpolicies.DefaultRollingPolicy;
import org.apache.kafka.clients.consumer.OffsetResetStrategy;

public class StreamingJob {
		public static void main(String[] args) throws Throwable {

			Properties props = new Properties();
			props.put(
                "fs.azure.account.key.<your storage account's dfs endpoint>",
                "<your storage account's shared access key>"
            );

			Configuration conf = ConfigurationUtils.createConfiguration(props);

			StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment(conf);

			String connectionString  = "<your iot hub connection string>";

			
            KafkaSource<String> source = KafkaSource.<String>builder()
                    .setBootstrapServers("<your iot hub's service bus url>:9093")
                    .setTopics("<name of your iot hub>")
                    .setGroupId("$Default")
                    .setProperty("partition.discovery.interval.ms", "10000")
                    .setProperty("security.protocol", "SASL_SSL")
                    .setProperty("sasl.mechanism", "PLAIN")
                    .setProperty("sasl.jaas.config", String.format("org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$ConnectionString\" password=\"%s\";", connectionString))
                    .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
                    .setValueOnlyDeserializer(new SimpleStringSchema())
                    .build();


			DataStream<String> kafka = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");
			kafka.print();

			String outputPath  = "abfs://<container name>@<your storage account's dfs endpoint>";

			final FileSink<String> sink = FileSink
					.forRowFormat(new Path(outputPath), new SimpleStringEncoder<String>("UTF-8"))
					.withRollingPolicy(
							DefaultRollingPolicy.builder()
									.withRolloverInterval(Duration.ofMinutes(2))
									.withInactivityInterval(Duration.ofMinutes(3))
									.withMaxPartSize(MemorySize.ofMebiBytes(5))
									.build())
					.build();

			kafka.sinkTo(sink);

			env.execute("Azure-IoTHub-Flink-ABFS");
	}
}

```

#### Maven dependencies

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-java</artifactId>
    <version>${flink.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-streaming-java</artifactId>
    <version>${flink.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-streaming-scala_2.12</artifactId>
    <version>${flink.version}</version>
</dependency>
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
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-files</artifactId>
    <version>${flink.version}</version>
</dependency>
```


### Submit job

Submit job using HDInsight on AKS's [Flink job submission API](./flink-job-management.md)

:::image type="content" source="./media/azure-iot-hub/create-new-job.png" alt-text="Screenshot shows create a new job." lightbox="./media/azure-iot-hub/create-new-job.png":::

### Reference

- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
