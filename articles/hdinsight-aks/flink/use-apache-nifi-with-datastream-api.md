---
title: Use Apache NiFi with HDInsight on AKS Apache Flink to publish into ADLS Gen2
description: Learn how to use  Apache NiFi to consume Processed Kafka topic from HDInsight Apache Flink on AKS and publish into ADLS Gen2
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Use Apache NiFi to consume processed Kafka topics from Apache Flink and publish into ADLS Gen2

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Apache NiFi is a software project from the Apache Software Foundation designed to automate the flow of data between software systems. It supports powerful and scalable directed graphs of data routing, transformation, and system mediation logic.

For more information, see [Apache NiFi](https://nifi.apache.org)

In this document, we process streaming data using HDInsight Kafka and perform some transformations on HDInsight Apache Flink on AKS, consume these topics and write the contents into ADLS Gen2 on Apache NiFi.

By combining the low latency streaming features of Apache Flink and the dataflow capabilities of Apache NiFi, you can process events at high volume. This combination helps you to trigger, enrich, filter, to enhance overall user experience. Both these technologies complement each other with their strengths in event streaming and correlation.

## Prerequisites

* [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md) 
* [HDInsight Kafka](../../hdinsight/kafka/apache-kafka-get-started.md)
    *  You're required to ensure the network settings are taken care as described on [Using HDInsight Kafka](../flink/process-and-consume-data.md); that's to make sure HDInsight on AKS Flink and HDInsight Kafka are in the same VNet 
* For this demonstration, we're using a Window VM as maven project develop env in the same VNET as HDInsight on AKS
* For this demonstration, we're using an Ubuntu VM in the same VNET as HDInsight on AKS, install Apache NiFi 1.22.0 on this VM

## Prepare HDInsight Kafka topic

For purposes of this demonstration, we're using a HDInsight Kafka Cluster, let us prepare HDInsight Kafka topic for the demo.

> [!NOTE]
> Setup a HDInsight [Kafka](../../hdinsight/kafka/apache-kafka-get-started.md) Cluster and Replace broker list with your own list before you get started for both Kafka 2.4 and 3.2.

**HDInsight Kafka 2.4.1**
```
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic click_events --zookeeper zk0-contsk:2181
```

**HDInsight Kafka 3.2.0**
```
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic click_events --bootstrap-server wn0-contsk:9092
```
## Setup Apache NiFi 1.22.0

For this demo, we install Apache NiFi 1.22.0 on an Ubuntu VM in the same VNet as HDInsight Flink on AKS, or you can also use your NiFi setup.

[Apache NiFi Downloads](https://nifi.apache.org/download.html)

```
root@contosoubuntuvm:/home/myvm/nifi-1.22.0/bin# ./nifi.sh start

Java home: /home/myvm/jdk-18.0.1.1
NiFi home: /home/myvm/nifi-1.22.0

Bootstrap Config File: /home/myvm/nifi-1.22.0/conf/bootstrap.conf


root@contosoubuntuvm:/home/myvm/nifi-1.22.0/bin# jps
454421 NiFi
454467 Jps
454396 RunNiFi
```

**Configuring NiFi UI**

Here, we configure NiFi properties in order to be accessed outside the localhost VM.

`$nifi_home/conf/nifi.properties`

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-2-configuring-nifi.png" alt-text="Screenshot showing how to define NiFi properties." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-2-configuring-nifi.png":::

## Process streaming data from HDInsight Kafka On HDInsight on AKS Flink

Let us develop the source code on Maven, to build the jar.

**SinkToKafka.java**

``` java
package contoso.example;

import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.connector.base.DeliveryGuarantee;
import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;


public class SinkToKafka {
    public static void main(String[] args) throws Exception {
        // 1. get stream env, update the broker-ips with your own
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        String brokers = "<update-brokerip>:9092,<update-brokerip>:9092,<update-brokerip>:9092";   // Replace the broker list with your own

        // 2. event data source
        DataStreamSource<Event> stream = env.addSource(new ClickSource());

        DataStream<String> dataStream = stream.map(line-> {
            String str1 = line.toString();
            return str1;
        }).returns(Types.STRING);

        // 3. sink click events to  kafka
        KafkaSink<String> sink = KafkaSink.<String>builder()
                .setBootstrapServers(brokers)
                .setRecordSerializer(KafkaRecordSerializationSchema.builder()
                        .setTopic("click_events")
                        .setValueSerializationSchema(new SimpleStringSchema())
                        .build()
                )
                .setDeliveryGuarantee(DeliveryGuarantee.AT_LEAST_ONCE)
                .build();

        dataStream.sinkTo(sink);
        env.execute("Sink click events to Kafka");
    }
}
``` 

**Event.java**
``` java
import java.sql.Timestamp;

public class Event {

    public String user;
    public String url;
    public String ts;
    public Event() {
    }

    public Event(String user, String url, String ts) {
        this.user = user;
        this.url = url;
        this.ts = ts;
    }

    @Override
    public String toString(){
        return "\"" + ts + "\"" + "," + "\"" + user +  "\"" + ","  + "\"" + url + "\"";
    }
}
```

**ClickSource.java**
``` java
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import java.util.Calendar;
import java.util.Random;

public class ClickSource implements SourceFunction<Event> {
    // declare a flag
    private Boolean running = true;

    // declare a flag
    public void run(SourceContext<Event> ctx) throws Exception{
        // generate random record
        Random random = new Random();
        String[] users = {"Mary","Alice","Bob","Cary"};
        String[] urls = {"./home","./cart","./fav","./prod?id=100","./prod?id=10"};

        // loop generate
        while (running) {
            String user = users[random.nextInt(users.length)];
            String url = urls[random.nextInt(urls.length)];
            Long timestamp = Calendar.getInstance().getTimeInMillis();
            String ts = timestamp.toString();
            ctx.collect(new Event(user,url,ts));
//            Thread.sleep(2000);
        }
    }
    @Override
    public void cancel()
    {
        running = false;
    }
}
```
**Maven pom.xml**

You can replace 2.4.1 with 3.2.0 in case you're using HDInsight Kafka 3.2.0, where applicable on the pom.xml

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>FlinkDemoKafka</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <kafka.version>2.4.1</kafka.version>     ---> Replace 2.4.1 with 3.2.0 , in case you're using HDInsight Kafka 3.2.0
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
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-files -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-files</artifactId>
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

## Submit streaming job to HDInsight on AKS - Flink

Now, lets submit streaming job as mentioned in the previous step into HDInsight on AKS - Flink

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-5-flink-ui-job-submission.png" alt-text="Screenshot showing how to submit the streaming job from FLink UI." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-5-flink-ui-job-submission.png":::

## Check the topic on HDInsight Kafka

Check the topic on HDInsight Kafka.

```
root@hn0-contos:/home/sshuser# /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --topic click_events --bootstrap-server wn0-contos:9092
"1685939238525","Cary","./home"
"1685939240527","Bob","./fav"
"1685939242528","Cary","./prod?id=10"
"1685939244528","Mary","./prod?id=100"
"1685939246529","Alice","./fav"
"1685939248530","Mary","./cart"
"1685939250530","Mary","./prod?id=100"
"1685939252530","Alice","./prod?id=100"
"1685939254530","Alice","./prod?id=10"
"1685939256530","Cary","./prod?id=100"
"1685939258531","Mary","./prod?id=10"
"1685939260531","Cary","./home"
"1685939262531","Mary","./prod?id=10"
"1685939264531","Cary","./prod?id=100"
"1685939266532","Mary","./cart"
"1685939268532","Bob","./fav"
"1685939270532","Mary","./home"
"1685939272533","Cary","./fav"
"1685939274533","Alice","./cart"
"1685939276533","Bob","./prod?id=10"
"1685939278533","Mary","./cart"
"1685939280533","Alice","./fav"
```

## Create flow on NiFi UI

> [!NOTE]
> In this example, we use Azure User Managed Identity to credentials for ADLS Gen2.

In this demonstration, we have used Apache NiFi instance installed on an Ubuntu VM. We're accessing the NiFi web interface from a Windows VM. The Ubuntu VM needs to have a managed identity assigned to it and network security group (NSG) rules configured.

To use Managed Identity authentication with the PutAzureDataLakeStorage processor in NiFi. You're required to ensure Ubuntu VM on which NiFi is installed has a managed identity assigned to it, or assign a managed identity to the Ubuntu VM.

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-nifi-ui-kafka-consumption.png" alt-text="Screenshot showing how to create a flow in Apache NiFi - Step 1." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-nifi-ui-kafka-consumption.png":::

Once you have assigned a managed identity to the Azure VM, you need to make sure that the VM can connect to the IMDS (Instance Metadata Service) endpoint. The IMDS endpoint is available at the IP address shown in this example. You need to update your network security group rules to allow outbound traffic from the Ubuntu VM to this IP address.

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-2-nifi-ui-kafka-consumption.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step2." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-2-nifi-ui-kafka-consumption.png":::

**Run the flow:**

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-3-nifi-ui-kafka-consumption-nifi-flow.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step3." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-3-nifi-ui-kafka-consumption-nifi-flow.png":::

[**Using Processor ConsumerKafka_2_0's properties setting:**](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-kafka-2-0-nar/1.22.0/org.apache.nifi.processors.kafka.pubsub.ConsumeKafka_2_0/index.html)

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-4-nifi-ui-kafka-consumption-nifi-flow.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step4." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-4-nifi-ui-kafka-consumption-nifi-flow.png":::

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-5-nifi-ui-kafka-consumption-nifi-flow.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step5." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-5-nifi-ui-kafka-consumption-nifi-flow.png":::

[**Using Processor PutAzureDataLakeStorage properties setting:**](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-azure-nar/1.22.0/org.apache.nifi.processors.azure.storage.PutAzureDataLakeStorage/index.html)

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-6-nifi-ui-kafka-consumption-nifi-flow.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step6." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-6-nifi-ui-kafka-consumption-nifi-flow.png":::

[**Using PutAzureDataLakeStorage credential setting:**](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-azure-nar/1.22.0/org.apache.nifi.services.azure.storage.ADLSCredentialsControllerService/index.html)

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-6-7-nifi-ui-kafka-consumption-nifi-flow.png" alt-text="Screenshot showing how to create a flow in Apache NiFi-Step7." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-6-7-nifi-ui-kafka-consumption-nifi-flow.png":::

### Lets check output in ADLS Gen2

:::image type="content" source="./media/use-apache-nifi-with-datastream-api/step-7-result-azure-data-lake-storage-gen2.png" alt-text="Validating the output in ADLS Gen2." border="true" lightbox="./media/use-apache-nifi-with-datastream-api/step-7-result-azure-data-lake-storage-gen2.png":::

## Reference

* [Apache NiFi](https://nifi.apache.org)
* [Apache NiFi Downloads](https://nifi.apache.org/download.html)
* [Consume Kafka](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-kafka-2-0-nar/1.11.4/org.apache.nifi.processors.kafka.pubsub.ConsumeKafka_2_0/index.html)
* [Azure Data Lake Storage](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-azure-nar/1.12.0/org.apache.nifi.processors.azure.storage.PutAzureDataLakeStorage/index.html)
* [ADLS Credentials Controller Service](https://nifi.apache.org/docs/nifi-docs/components/org.apache.nifi/nifi-azure-nar/1.12.0/org.apache.nifi.services.azure.storage.ADLSCredentialsControllerService/index.html)
* [Download IntelliJ IDEA for development](https://www.jetbrains.com/idea/download/#section=windows)
