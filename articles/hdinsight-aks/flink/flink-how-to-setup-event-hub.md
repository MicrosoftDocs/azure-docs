---
title: How to connect Apache Flink® on HDInsight on AKS with Azure Event Hubs for Apache Kafka®
description: Learn how to connect Apache Flink® on HDInsight on AKS with Azure Event Hubs for Apache Kafka®
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Connect Apache Flink® on HDInsight on AKS with Azure Event Hubs for Apache Kafka®

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

A well known use case for Apache Flink is stream analytics. The popular choice by many users to use the data streams, which are ingested using Apache Kafka. Typical installations of Flink and Kafka start with event streams being pushed to Kafka, which can be consumed by Flink jobs. Azure Event Hubs provides an Apache Kafka endpoint on an event hub, which enables users to connect to the event hub using the Kafka protocol.

In this article, we explore how to connect [Azure Event Hubs](/azure/event-hubs/event-hubs-about) with [Apache Flink on HDInsight on AKS](./flink-overview.md) and cover the following

> [!div class="checklist"]
> * Create an Event Hubs namespace
> * Create a HDInsight on AKS Cluster with Apache Flink
> * Run Flink producer 
> * Package Jar for Apache Flink
> * Job Submission & Validation

## Create Event Hubs namespace and Event Hubs

1. To create Event Hubs namespace and Event Hubs, see [here](/azure/event-hubs/event-hubs-quickstart-kafka-enabled-event-hubs?tabs=connection-string)

   :::image type="content" source="./media/flink-eventhub/flink-setup-event-hub.png" alt-text="Screenshot showing Event Hubs setup." border="true" lightbox="./media/flink-eventhub/flink-setup-event-hub.png":::

## Set up Flink Cluster on HDInsight on AKS

1. Using existing HDInsight on AKS Cluster pool you can create a [Flink cluster](./flink-create-cluster-portal.md)

1. Run the Flink producer adding the **bootstrap.servers** and the `producer.config` info 

   ```
   bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
   client.id=FlinkExampleProducer
   sasl.mechanism=PLAIN
   security.protocol=SASL_SSL
   sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
   username="$ConnectionString" \
   password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
   ```
   
1. Replace `{YOUR.EVENTHUBS.CONNECTION.STRING}` with the connection string for your Event Hubs namespace. For instructions on getting the connection string, see details on how to [get an Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string).

   For example, 
    ```
    sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString"
    password="Endpoint=sb://mynamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXX";
    ```   
## Packaging the JAR for Flink 
1. Package com.example.app;
   
   ```
    import org.apache.flink.api.common.functions.MapFunction;
    import org.apache.flink.api.common.serialization.SimpleStringSchema;
    import org.apache.flink.streaming.api.datastream.DataStream;
    import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
    import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer;     //v0.11.0.0
    import java.io.FileNotFoundException;
    import java.io.FileReader;
    import java.util.Properties;

    public class FlinkTestProducer {

    private static final String TOPIC = "test";
    private static final String FILE_PATH = "src/main/resources/producer.config";

    public static void main(String... args) {
        try {
            Properties properties = new Properties();
            properties.load(new FileReader(FILE_PATH));

            final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
            DataStream stream = createStream(env);
            FlinkKafkaProducer<String> myProducer = new FlinkKafkaProducer<>(
                    TOPIC,    
                    new SimpleStringSchema(),   // serialization schema
                    properties);

            stream.addSink(myProducer);
            env.execute("Testing flink print");

        } catch(FileNotFoundException e){
            System.out.println("FileNotFoundException: " + e);
        } catch (Exception e) {
            System.out.println("Failed with exception:: " + e);
        }
    }

    public static DataStream createStream(StreamExecutionEnvironment env){
        return env.generateSequence(0, 200)
            .map(new MapFunction<Long, String>() {
                @Override
                public String map(Long in) {
                    return "FLINK PRODUCE " + in;
                }
            });
      }
   }
   ```
 
1. Add the snippet to run the Flink Producer.

   :::image type="content" source="./media/flink-eventhub/testing-flink.png" alt-text="Screenshot showing how to test Flink in Event Hubs." border="true" lightbox="./media/flink-eventhub/testing-flink.png":::

1. Once the code is executed, the events are stored in the topic **“TEST”**

   :::image type="content" source="./media/flink-eventhub/events-stored-in-topic.png" alt-text="Screenshot showing Event Hubs stored in topic." border="true" lightbox="./media/flink-eventhub/events-stored-in-topic.png":::

### Reference

- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
