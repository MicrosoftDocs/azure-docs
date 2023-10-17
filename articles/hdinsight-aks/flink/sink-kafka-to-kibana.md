---
title: Use Elasticsearch along with HDInsight on AKS - Apache Flink
description: Learn how to use Elasticsearch along HDInsight on AKS - Apache Flink
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Using Elasticsearch with HDInsight on AKS - Apache Flink

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Flink for real-time analytics can be used to build a dashboard application that visualizes the streaming data using Elasticsearch and Kibana. 

Flink can be used to analyze a stream of taxi ride events and compute metrics. Metrics can include number of rides per hour, the average fare per ride, or the most popular pickup locations. You can write these metrics to an Elasticsearch index using a Flink sink and use Kibana to connect and create charts or dashboards to display metrics in real-time.

In this article, learn how to Use Elastic along HDInsight Flink.

## Elasticsearch and Kibana

Elasticsearch is a distributed, free and open search and analytics engine for all types of data, including 
* Textual
* Numerical
* Geospatial
* Structured
* Unstructured.

Kibana is a free and open frontend application that sits on top of the elastic stack, providing search and data visualization capabilities for data indexed in Elasticsearch.

For more information, refer 
* [Elasticsearch](https://www.elastic.co)
* [Kibana](https://www.elastic.co/what-is/kibana)


## Prerequisites

* [HDInsight on AKS Flink 1.16.0](./flink-create-cluster-portal.md) 
* Elasticsearch-7.13.2 
* Kibana-7.13.2 
* [HDInsight 5.0 - Kafka 2.4.1](../../hdinsight/kafka/apache-kafka-get-started.md)
* IntelliJ IDEA for development on an Azure VM which in the same Vnet


### How to Install Elasticsearch on Ubuntu 20.04

- APT Update & Install OpenJDK
- Add Elastic Search GPG key and Repository
    - Steps for adding the GPG key
    ```
    sudo apt-get install apt-transport-https
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
    ```
    - Add Repository
    ```
    echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
    ```
- Run system update
```
sudo apt update
```

- Install ElasticSearch on Ubuntu 20.04 Linux
```
sudo apt install elasticsearch
```
-  Start ElasticSearch Services
  
    - Reload Daemon:
    ```
    sudo systemctl daemon-reload
    ```
    - Enable
    ```
    sudo systemctl enable elasticsearch
    ```
    - Start
    ```
    sudo systemctl start elasticsearch
    ```
    - Check Status 
    ```
    sudo systemctl status elasticsearch
    ```
    - Stop 
    ```
    sudo systemctl stop elasticsearch
    ```

### How to Install Kibana on Ubuntu 20.04

For installing and configuring Kibana Dashboard, we don’t need to add any other repository because the packages are available through the already added ElasticSearch. 

We use the following command to install Kibana

```
sudo apt install kibana
```

- Reload daemon
    ```
    sudo systemctl daemon-reload
    ```
  - Start and Enable:
    ```
    sudo systemctl enable kibana
    sudo systemctl start kibana
    ```
  - To check the status:
    ```
    sudo systemctl status kibana
    ```
### Access the Kibana Dashboard web interface

In order to make Kibana accessible from output, need to set network.host to 0.0.0.0 

configure /etc/kibana/kibana.yml  on Ubuntu VM

> [!NOTE]
> 10.0.1.4 is a local private IP, that we have used which can be accessed in maven project develop Windows VM. You're required to make modifications according to your network security requirements. We use the same IP later to demo for performing analytics on Kibana.

```
server.host: "0.0.0.0"
server.name: "elasticsearch"
server.port: 5601
elasticsearch.hosts: ["http://10.0.1.4:9200"]
```
:::image type="content" source="./media/sink-kafka-to-kibana/kibana-test-setup.png" alt-text="Screenshot showing Kibana UI test successful." lightbox="./media/sink-kafka-to-kibana/kibana-test-setup.png":::


## Prepare Click Events on HDInsight Kafka

We use python output as input to produce the streaming data

```
sshuser@hn0-contsk:~$ python weblog.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic click_events
```
Now, lets check messages in this topic

```
sshuser@hn0-contsk:~$ /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server wn0-contsk:9092 --topic click_events
```
```
{"userName": "Tim", "visitURL": "https://www.bing.com/new", "ts": "07/31/2023 05:47:12"}
{"userName": "Luke", "visitURL": "https://github.com", "ts": "07/31/2023 05:47:12"}
{"userName": "Zark", "visitURL": "https://github.com", "ts": "07/31/2023 05:47:12"}
{"userName": "Zark", "visitURL": "https://docs.python.org", "ts": "07/31/2023 05:47:12"}
```


## Creating Kafka Sink to Elastic

Let us write maven source code on the Windows VM

**Main: kafkaSinkToElastic.java**
``` java
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.connector.elasticsearch.sink.Elasticsearch7SinkBuilder;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Requests;

import java.util.HashMap;
import java.util.Map;

public class kafkaSinkToElastic {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment().setParallelism(1);

        // 1. read kafka message
        String kafka_brokers = "<broker1 IP>:9092,<broker2 IP>:9092,<broker3 IP>:9092";
        KafkaSource<String> source = KafkaSource.<String>builder()
                .setBootstrapServers(kafka_brokers)
                .setTopics("click_events")
                .setGroupId("my-group")
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStream<String> kafka = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");

        // 2. sink to elasticsearch
        kafka.sinkTo(
                new Elasticsearch7SinkBuilder<String>()
                        .setBulkFlushMaxActions(1)
                        .setHosts(new HttpHost("10.0.1.4", 9200, "http"))
                        .setEmitter(
                                (element, context, indexer) -> indexer.add(createIndexRequest(element)))
                        .build());

        // 3. execute stream
        env.execute("Kafka Sink To Elastic");

    }
    private static IndexRequest createIndexRequest(String element) {
        String[] logContent =element.replace("{","").replace("}","").split(",");
        Map<String, String> esJson = new HashMap<>();
        esJson.put("username", logContent[0]);
        esJson.put("visitURL", logContent[1]);
        esJson.put("ts", logContent[2]);
        return Requests.indexRequest()
                .index("kafka_user_clicks")
                .id(element)
                .source(esJson);
    }
}
```

**Creating a pom.xml on Maven**

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>contoso.example</groupId>
    <artifactId>FlinkElasticSearch</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <kafka.version>3.2.0</kafka.version>
    </properties>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-core -->
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
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-kafka -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-elasticsearch-base -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-elasticsearch7</artifactId>
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

**Package the jar and submit to Flink to run on WebSSH**

On [Secure Shell for Flink](./flink-web-ssh-on-portal-to-flink-sql.md), you can use the following commands

```
msdata@pod-0 [ ~ ]$ ls -l FlinkElasticSearch-1.0-SNAPSHOT.jar 
-rw-r----- 1 msdata msdata 114616575 Jul 31 06:09 FlinkElasticSearch-1.0-SNAPSHOT.jar
msdatao@pod-0 [ ~ ]$ bin/flink run -c contoso.example.kafkaSinkToElastic -j FlinkElasticSearch-1.0-SNAPSHOT.jar
Job has been submitted with JobID e0eba72d5143cea53bcf072335a4b1cb
```
## Start Elasticsearch and Kibana to perform analytics on Kibana

**startup Elasticsearch and Kibana on Ubuntu VM and Using Kibana to Visualize Results**

- Access Kibana at IP, which you have set earlier.
- Configure an index pattern by clicking **Stack Management** in the left-side toolbar and find **Index Patterns**, then click **Create Index Pattern** and enter the full index name kafka_user_clicks to create the index pattern. 

:::image type="content" source="./media/sink-kafka-to-kibana/kibana-index-pattern-setup.png" alt-text="Screenshot showing Kibana index pattern set-up." lightbox="./media/sink-kafka-to-kibana/kibana-index-pattern-setup.png":::

- Once the index pattern is set up, you can explore the data in Kibana
    - Click "Discover" in the left-side toolbar.
      
      :::image type="content" source="./media/sink-kafka-to-kibana/kibana-discover.png" alt-text="Screenshot showing how to navigate to discover button." lightbox="./media/sink-kafka-to-kibana/kibana-discover.png":::
          
    - Kibana lists the content of the created index with kafka-click-events
      
      :::image type="content" source="./media/sink-kafka-to-kibana/elastic-discover-kafka-click-events.png" alt-text="Screenshot showing elastic with the created index with the kafka-click-events." lightbox="./media/sink-kafka-to-kibana/elastic-discover-kafka-click-events.png" :::
        
- Let us create a dashboard to display various views.
  
:::image type="content" source="./media/sink-kafka-to-kibana/elastic-dashboard-selection.png" alt-text="Screenshot showing elastic to select dashboard and start creating views." lightbox="./media/sink-kafka-to-kibana/elastic-dashboard-selection.png" :::
- Let's use a  **Area** (area graph), then select the **kafka_click_events** index and edit the Horizontal axis and Vertical axis to illustrate the events
  
:::image type="content" source="./media/sink-kafka-to-kibana/elastic-dashboard.png" alt-text="Screenshot showing elastic plot with the Kafka click event." lightbox="./media/sink-kafka-to-kibana/elastic-dashboard.png" :::

- If we set an auto refresh or click **Refresh**, the plot is updating real time as we have created a Flink Streaming job

:::image type="content" source="./media/sink-kafka-to-kibana/elastic-dashboard-2.png" alt-text="Screenshot showing elastic plot with the Kafka click event after refresh." lightbox="./media/sink-kafka-to-kibana/elastic-dashboard-2.png" :::


## Validation on Apache Flink Job UI

You can find the job in running state on your Flink Web UI

:::image type="content" source="./media/sink-kafka-to-kibana/flink-elastic-job.png" alt-text="Screenshot showing Kibana UI to start Elasticsearch and Kibana and perform analytics on Kibana." lightbox="./media/sink-kafka-to-kibana/flink-elastic-job.png":::

## Reference
* [Apache Kafka SQL Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/kafka)
* [Elasticsearch SQL Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/elasticsearch)
