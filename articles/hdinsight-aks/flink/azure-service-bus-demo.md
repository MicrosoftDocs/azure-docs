---
title: DStreamAPI AzureServiceBusDemo
description: DStreamAPI AzureServiceBusDemo
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 11/27/2023
---
# DStreamAPI AzureServiceBusDemo

This Flink job demo reads messages from an Azure Service Bus topic and writes them to ADLS gen2.

Here’s a breakdown of what each part does!

**Main code: ServiceBusToAdlsgen2.java**

1. **Setting up the execution environment**: The StreamExecutionEnvironment.getExecutionEnvironment() method is used to set up the execution environment for the Flink job.

1. **Creating a source function for Azure Service Bus**: A SessionBasedServiceBusSource object is created with the connection string, topic name, and subscription name for your Azure Service Bus. This object is a source function that can be used to create a data stream.

1. **Creating a data stream**: The env.addSource(sourceFunction) method is used to create a data stream from the source function. Each message from the Azure Service Bus topic becomes an element in this stream.

1. **Processing the data**: The stream.map(value -> processValue(value)) method is used to process each element in the stream. In this case, the processValue method is applied to each element. This is where you’d put your processing logic.

1. **Creating a sink for Azure Data Lake Storage Gen2**: A FileSink object is created with the output path and a SimpleStringEncoder. The withRollingPolicy method is used to set a rolling policy for the sink.

1. **Adding the sink function to the processed stream**: The processedStream.sinkTo(sink) method is used to add the sink function to the processed stream. Each processed element is written to a file in Azure Data Lake Storage Gen2.

1. **Executing the job**: Finally, the env.execute("ServiceBusToDataLakeJob") method is used to execute the Flink job. This starts reading messages from the Azure Service Bus topic, process them, and write them to Azure Data Lake Storage Gen2.

### Flink source function: SessionBasedServiceBusSource.java

1. **Class Definition**: The SessionBasedServiceBusSource class extends `RichParallelSourceFunction<String>`, which is a base class for implementing a parallel data source in Flink.

1. **Instance Variables**: The connectionString, topicName, and subscriptionName variables hold the connection string, topic name, and subscription name for your Azure Service Bus. The isRunning flag is used to control the execution of the source function. The sessionReceiver is an instance of ServiceBusSessionReceiverAsyncClient, which is used to receive messages from the Service Bus.

1. **Constructor**: The constructor initializes the instance variables with the provided values.

1. **run() Method**: This method is where the source function starts to emit data to Flink. It creates a ServiceBusSessionReceiverAsyncClient, accepts the next available session, and starts receiving messages from that session. Each message’s body is then collected into the Flink source context.

1. **cancel() Method**: This method is called when the source function needs to be stopped. It sets the isRunning flag to false and closes the sessionReceiver.

## Requirements

### Azure HDInsight Flink 1.16 on AKS

:::image type="content" source="./media/azure-service-bus-demo/azure-hdinsight-flink-1-16-aks.png" alt-text="Screenshot shows Azure HDInsight Flink 1.16 on AKS." lightbox="./media/azure-service-bus-demo/azure-hdinsight-flink-1-16-aks.png":::

### Azure Service Bus

Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics (in a namespace). Service Bus is used to decouple applications and services from each other, providing the following benefits:

- Load-balancing work across competing workers
- Safely routing and transferring data and control across service and application boundaries
- Coordinating transactional work that requires a high-degree of reliability

### Reference

[What is Azure Service Bus?](/azure/service-bus-messaging/service-bus-messaging-overview)

Refer below doc to create Topic and Subscription preparation 

[Use Service Bus Explorer](/azure/service-bus-messaging/explorer)

:::image type="content" source="./media/azure-service-bus-demo/subscription-topic-1.png" alt-text="Screenshot shows subscription." lightbox="./media/azure-service-bus-demo/subscription-topic-1.png":::

Getting the connection string, topic name, and subscription name for your Azure Service Bus

:::image type="content" source="./media/azure-service-bus-demo/subscription-name.png" alt-text="Screenshot shows getting the connection string, topic name, and subscription name for your Azure Service Bus." lightbox="./media/azure-service-bus-demo/subscription-name.png":::


## Running

### Submit the jar into Azure HDInsight Flink 1.16 on AKS to run

In this case, we used webssh to submit
```
bin/flink run -c contoso.example.ServiceBusToAdlsGen2 -j AzureServiceBusDemo-1.0-SNAPSHOT.jar
Job has been submitted with JobID fc5793361a914821c968b5746a804570
```

### Confirm job on Flink UI:

:::image type="content" source="./media/azure-service-bus-demo/confirm-job-flink-ui.png" alt-text="Screenshot shows confirm job on Flink UI." lightbox="./media/azure-service-bus-demo/confirm-job-flink-ui.png":::

### Sending message from Azure portal Serice Bus Explorer

:::image type="content" source="./media/azure-service-bus-demo/sending-message-azure-portal.png" alt-text="Screenshot shows sending message from Azure portal Serice Bus Explorer." lightbox="./media/azure-service-bus-demo/sending-message-azure-portal.png":::


### Checking job running details on Flink UI:

:::image type="content" source="./media/azure-service-bus-demo/checking-job-running-details.png" alt-text="Screenshot shows checking job running details on Flink UI." lightbox="./media/azure-service-bus-demo/checking-job-running-details.png":::

### Confirm output file in ADLS gen2 on Portal

:::image type="content" source="./media/azure-service-bus-demo/confirm-output-file.png" alt-text="Screenshot shows confirm output file in ADLS gen2 on Portal." lightbox="./media/azure-service-bus-demo/confirm-output-file.png":::

## Source Code

```Maven Pom.xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>contoso.example</groupId>
    <artifactId>AzureServiceBusDemo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-java</artifactId>
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
            <groupId>com.azure</groupId>
            <artifactId>azure-core</artifactId>
            <version>1.26.0</version>
        </dependency>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-identity</artifactId>
            <version>1.4.1</version>
        </dependency>
<!--        <dependency>-->
<!--            <groupId>com.microsoft.azure</groupId>-->
<!--            <artifactId>azure-servicebus</artifactId>-->
<!--            <version>3.6.0</version>-->
<!--        </dependency>-->
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-messaging-servicebus</artifactId>
            <version>7.5.0</version>
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
**main function: ServiceBusToAdlsGen2.java**
```
package contoso.example;

import org.apache.flink.api.common.serialization.SimpleStringEncoder;
import org.apache.flink.configuration.MemorySize;
import org.apache.flink.connector.file.sink.FileSink;
import org.apache.flink.core.fs.Path;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.filesystem.rollingpolicies.DefaultRollingPolicy;

import java.time.Duration;

public class ServiceBusToAdlsGen2 {

    public static void main(String[] args) throws Exception {

        // Set up the execution environment
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        final String connectionString = "Endpoint=sb://contososervicebus.servicebus.windows.net/;SharedAccessKeyName=policy1;SharedAccessKey=<key>";
        final String topicName = "topic1";
        final String subName = "subscription1";

        // Create a source function for Azure Service Bus
        SessionBasedServiceBusSource sourceFunction = new SessionBasedServiceBusSource(connectionString, topicName, subName);

        // Create a data stream using the source function
        DataStream<String> stream = env.addSource(sourceFunction);

        // Process the data (this is where you'd put your processing logic)
        DataStream<String> processedStream = stream.map(value -> processValue(value));
        processedStream.print();

        // 3. sink to gen2
        String outputPath = "abfs://<container>@<account>.dfs.core.windows.net/data/ServiceBus/Topic1";
//        String outputPath = "src/ServiceBugOutput/";

        final FileSink<String> sink = FileSink
                .forRowFormat(new Path(outputPath), new SimpleStringEncoder<String>("UTF-8"))
                .withRollingPolicy(
                        DefaultRollingPolicy.builder()
                                .withRolloverInterval(Duration.ofMinutes(2))
                                .withInactivityInterval(Duration.ofMinutes(3))
                                .withMaxPartSize(MemorySize.
                                        ofMebiBytes(5))
                                .build())
                .build();
        // Add the sink function to the processed stream
        processedStream.sinkTo(sink);

        // Execute the job
        env.execute("ServiceBusToDataLakeJob");
    }

    private static String processValue(String value) {
        // Implement your processing logic here
        return value;
    }
}
```

**input source: SessionBasedServiceBusSource.java**
```
package contoso.example;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusSessionReceiverAsyncClient;
import org.apache.flink.streaming.api.functions.source.RichParallelSourceFunction;
import org.apache.flink.streaming.api.functions.source.SourceFunction;

public class SessionBasedServiceBusSource extends RichParallelSourceFunction<String> {

    private final String connectionString;
    private final String topicName;
    private final String subscriptionName;
    private volatile boolean isRunning = true;
    private ServiceBusSessionReceiverAsyncClient sessionReceiver;

    public SessionBasedServiceBusSource(String connectionString, String topicName, String subscriptionName) {
        this.connectionString = connectionString;
        this.topicName = topicName;
        this.subscriptionName = subscriptionName;
    }

    @Override
    public void run(SourceFunction.SourceContext<String> ctx) throws Exception {
        ServiceBusSessionReceiverAsyncClient sessionReceiver = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sessionReceiver()
                .topicName(topicName)
                .subscriptionName(subscriptionName)
                .buildAsyncClient();

        sessionReceiver.acceptNextSession()
                .flatMapMany(session -> session.receiveMessages())
                .doOnNext(message -> {
                    try {
                        ctx.collect(message.getBody().toString());
                    } catch (Exception e) {
                        System.out.printf("An error occurred: %s.", e.getMessage());
                    }
                })
                .doOnError(error -> System.out.printf("An error occurred: %s.", error.getMessage()))
                .blockLast();
    }

    @Override
    public void cancel() {
        isRunning = false;
        if (sessionReceiver != null) {
            sessionReceiver.close();
        }
    }
}
```






