---
title: Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS
description: How to integrate Azure IoT Hub and Apache Flink®.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 04/04/2024
---

# Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS

Azure IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communication between an IoT application and its attached devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT hub.

In this example, the code processes real-time IoT data on Apache Flink® with Azure HDInsight on AKS and sinks to ADLS gen2 storage.

## Prerequisites

* [Create an Azure IoTHub](/azure/iot-hub/iot-hub-create-through-portal/)
* [Create Flink cluster 1.17.0 on HDInsight on AKS](./flink-create-cluster-portal.md)
* Use MSI to access ADLS Gen2
* IntelliJ for development

> [!NOTE]
> For this demonstration, we are using a Window VM as maven project develop env in the same VNET as HDInsight on AKS.

## Flink cluster 1.17.0 on HDInsight on AKS

:::image type="content" source="./media/azure-iot-hub/configuration-management.png" alt-text="Diagram showing search bar in Azure portal." lightbox="./media/azure-iot-hub/configuration-management.png":::

## Azure IOT Hub on Azure portal

Within the connection string, you can find a service bus URL (URL of the underlying event hub namespace), which you need to add as a bootstrap server in your Kafka source. In this example, it's `iothub-ns-contosoiot-55642726-4642a54853.servicebus.windows.net:9093`.

:::image type="content" source="./media/azure-iot-hub/built-in-endpoint.png" alt-text="Screenshot shows built-in endpoints." lightbox="./media/azure-iot-hub/built-in-endpoint.png":::

## Prepare message into Azure IOT device

Each IoT hub comes with built-in system endpoints to handle system and device messages.

For more information, see [How to use VS Code as IoT Hub Device Simulator](https://devblogs.microsoft.com/iotdev/use-vs-code-as-iot-hub-device-simulator-say-hello-to-azure-iot-hub-in-5-minutes/).


:::image type="content" source="./media/azure-iot-hub/send-messages.png" alt-text="Screenshot shows how to send messages." lightbox="./media/azure-iot-hub/send-messages.png":::

## Code in Flink

`IOTdemo.java`

- KafkaSource:
IoTHub is build on top of event hub and hence supports a kafka-like API. So in our Flink job, we can define a KafkaSource with appropriate parameters to consume messages from IoTHub.

- FileSink:
Define the ABFS sink.


```
package contoso.example
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringEncoder;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.client.program.StreamContextEnvironment;
import org.apache.flink.configuration.MemorySize;
import org.apache.flink.connector.file.sink.FileSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.core.fs.Path;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.filesystem.rollingpolicies.DefaultRollingPolicy;
import org.apache.kafka.clients.consumer.OffsetResetStrategy;

import java.time.Duration;
public class IOTdemo {

    public static void main(String[] args) throws Exception {

        // create execution environment
        StreamExecutionEnvironment env = StreamContextEnvironment.getExecutionEnvironment();

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

        String outputPath  = "abfs://<container>@<account_name>.dfs.core.windows.net/flink/data/azureiothubmessage/";

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

        env.execute("Sink Azure IOT hub to ADLS gen2");
    }
}
```


**Maven pom.xml**
```xml
    <groupId>contoso.example</groupId>
    <artifactId>FlinkIOTDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.17.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
    </properties>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
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

## Package the jar and submit the job in Flink cluster

Upload the jar into webssh pod and submit the jar.

```
user@sshnode-0 [ ~ ]$ bin/flink run -c IOTdemo -j FlinkIOTDemo-1.0-SNAPSHOT.jar 
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
Job has been submitted with JobID de1931b1c1179e7530510b07b7ced858
```
## Check job on Flink Dashboard UI

:::image type="content" source="./media/azure-iot-hub/flink-ui-dashboard.png" alt-text="Screenshot showing the Flink UI dashboard." lightbox="./media/azure-iot-hub/flink-ui-dashboard.png":::

## Check Result on ADLS gen2 on Azure portal

:::image type="content" source="./media/azure-iot-hub/check-results.png" alt-text="Screenshot showing the results." lightbox="./media/azure-iot-hub/check-results.png":::

### Reference

- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).