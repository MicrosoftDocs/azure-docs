---
title: Write messages to Apache HBase® with Apache Flink® DataStream API
description: Learn how to write messages to Apache HBase with Apache Flink DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Write messages to Apache HBase® with Apache Flink® DataStream API

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

In this article, learn how to write messages to HBase with Apache Flink DataStream API

## Overview

Apache Flink offers HBase connector as a sink, with this connector with Flink you can store the output of a real-time processing application in HBase. Learn how to process streaming data on HDInsight Kafka as a source, perform transformations, then sink into HDInsight HBase table. 

In a real world scenario, this example is a stream analytics layer to realize value from Internet of Things (IOT) analytics, which use live sensor data. The Flink Stream can read data from Kafka topic and write it to HBase table. If there is a  real time streaming IOT application, the information can be gathered, transformed and optimized. 


## Prerequisites

* [Apache Flink cluster on HDInsight on AKS](../flink/flink-create-cluster-portal.md) 
* [Apache Kafka cluster on HDInsight](../flink/process-and-consume-data.md)
* [Apache HBase 2.4.11 clusteron HDInsight](../../hdinsight/hbase/apache-hbase-tutorial-get-started-linux.md#create-apache-hbase-cluster)
  * You're required to ensure HDInsight on AKS cluster can connect to HDInsight cluster, with same virtual network.
* Maven project on IntelliJ IDEA for development on an Azure VM in the same VNet

## Implementation Steps

### Use pipeline to produce Kafka topic (user click event topic)

**weblog.py**

``` python
import json
import random
import time
from datetime import datetime

user_set = [
        'John',
        'XiaoMing',
        'Mike',
        'Tom',
        'Machael',
        'Zheng Hu',
        'Zark',
        'Tim',
        'Andrew',
        'Pick',
        'Sean',
        'Luke',
        'Chunck'
]

web_set = [
        'https://github.com',
        'https://www.bing.com/new',
        'https://kafka.apache.org',
        'https://hbase.apache.org',
        'https://flink.apache.org',
        'https://spark.apache.org',
        'https://trino.io',
        'https://hadoop.apache.org',
        'https://stackoverflow.com',
        'https://docs.python.org',
        'https://azure.microsoft.com/products/category/storage',
        '/azure/hdinsight/hdinsight-overview',
        'https://azure.microsoft.com/products/category/storage'
]

def main():
        while True:
                if random.randrange(13) < 4:
                        url = random.choice(web_set[:3])
                else:
                        url = random.choice(web_set)

                log_entry = {
                        'userName': random.choice(user_set),
                        'visitURL': url,
                        'ts': datetime.now().strftime("%m/%d/%Y %H:%M:%S")
                }

                print(json.dumps(log_entry))
                time.sleep(0.05)

if __name__ == "__main__":
    main()
```

**Use pipeline to produce Apache Kafka topic**

We're going to use click_events for the Kafka topic
```
python weblog.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic click_events
```

**Sample commands on Kafka**
```
-- create topic (replace with your Kafka bootstrap server)
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic click_events --bootstrap-server wn0-contsk:9092

-- delete topic (replace with your Kafka bootstrap server)
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete  --topic click_events --bootstrap-server wn0-contsk:9092

-- produce topic (replace with your Kafka bootstrap server)
python weblog.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-contsk:9092 --topic click_events

-- consume topic
/usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server wn0-contsk:9092 --topic click_events --from-beginning
{"userName": "Luke", "visitURL": "https://azure.microsoft.com/products/category/storage", "ts": "07/11/2023 06:39:43"}
{"userName": "Sean", "visitURL": "https://www.bing.com/new", "ts": "07/11/2023 06:39:43"}
{"userName": "XiaoMing", "visitURL": "https://hbase.apache.org", "ts": "07/11/2023 06:39:43"}
{"userName": "Machael", "visitURL": "https://www.bing.com/new", "ts": "07/11/2023 06:39:43"}
{"userName": "Andrew", "visitURL": "https://github.com", "ts": "07/11/2023 06:39:43"}
{"userName": "Zark", "visitURL": "https://kafka.apache.org", "ts": "07/11/2023 06:39:43"}
{"userName": "XiaoMing", "visitURL": "https://trino.io", "ts": "07/11/2023 06:39:43"}
{"userName": "Zark", "visitURL": "https://flink.apache.org", "ts": "07/11/2023 06:39:43"}
{"userName": "Mike", "visitURL": "https://kafka.apache.org", "ts": "07/11/2023 06:39:43"}
{"userName": "Zark", "visitURL": "https://docs.python.org", "ts": "07/11/2023 06:39:44"}
{"userName": "John", "visitURL": "https://www.bing.com/new", "ts": "07/11/2023 06:39:44"}
{"userName": "Mike", "visitURL": "https://hadoop.apache.org", "ts": "07/11/2023 06:39:44"}
{"userName": "Tim", "visitURL": "https://www.bing.com/new", "ts": "07/11/2023 06:39:44"}
.....
```

**Create HBase table on HDInsight cluster**

``` sql
root@hn0-contos:/home/sshuser# hbase shell
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/usr/hdp/5.1.1.3/hadoop/lib/slf4j-reload4j-1.7.35.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/usr/hdp/5.1.1.3/hbase/lib/client-facing-thirdparty/slf4j-reload4j-1.7.33.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Reload4jLoggerFactory]
HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For more information, see, http://hbase.apache.org/2.0/book.html#shell
Version 2.4.11.5.1.1.3, rUnknown, Thu Apr 20 12:31:07 UTC 2023
Took 0.0032 seconds
hbase:001:0> create 'user_click_events','user_info'
Created table user_click_events
Took 5.1399 seconds
=> Hbase::Table - user_click_events
hbase:002:0>
```

### Develop the project for submitting jar on Flink

**create maven project with following pom.xml**

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>contoso.example</groupId>
    <artifactId>FlinkHbaseDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.16.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <hbase.version>2.4.11</hbase.version>
        <kafka.version>3.2.0</kafka.version> // Replace with 2.4.0 for HDInsight Kafka 2.4
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
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-hbase-base -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-hbase-base</artifactId>
            <version>1.16.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.hbase/hbase-client -->
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>${hbase.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>3.1.1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-base -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-base</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-core</artifactId>
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

**Source code**

Writing HBase Sink program 

**HBaseWriterSink**
``` java
package contoso.example;

import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

public class HBaseWriterSink extends RichSinkFunction<Tuple3<String,String,String>> {
    String hbase_zk = "<update-hbasezk-ip>:2181,<update-hbasezk-ip>:2181,<update-hbasezk-ip>:2181";
    Connection hbase_conn;
    Table tb;
    int i = 0;
    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        org.apache.hadoop.conf.Configuration hbase_conf = HBaseConfiguration.create();
        hbase_conf.set("hbase.zookeeper.quorum", hbase_zk);
        hbase_conf.set("zookeeper.znode.parent", "/hbase-unsecure");
        hbase_conn = ConnectionFactory.createConnection(hbase_conf);
        tb = hbase_conn.getTable(TableName.valueOf("user_click_events"));
    }

    @Override
    public void invoke(Tuple3<String,String,String> value, Context context) throws Exception {
        byte[] rowKey = Bytes.toBytes(String.format("%010d", i++));
        Put put = new Put(rowKey);
        put.addColumn(Bytes.toBytes("user_info"), Bytes.toBytes("userName"), Bytes.toBytes(value.f0));
        put.addColumn(Bytes.toBytes("user_info"), Bytes.toBytes("visitURL"), Bytes.toBytes(value.f1));
        put.addColumn(Bytes.toBytes("user_info"), Bytes.toBytes("ts"), Bytes.toBytes(value.f2));
        tb.put(put);
    };

    public void close() throws Exception {
        if (null != tb) tb.close();
        if (null != hbase_conn) hbase_conn.close();
    }
}
``` 

**main:KafkaSinkToHbase**

Writing a Kafka Sink to HBase Program

``` java
package contoso.example;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.common.typeinfo.Types;

import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class KafkaSinkToHbase {
    public static void main(String[] args) throws Exception {

        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment().setParallelism(1);
        String kafka_brokers = "10.0.0.38:9092,10.0.0.39:9092,10.0.0.40:9092";

        KafkaSource<String> source = KafkaSource.<String>builder()
                .setBootstrapServers(kafka_brokers)
                .setTopics("click_events")
                .setGroupId("my-group")
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStreamSource<String> kafka = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source").setParallelism(1);
        DataStream<Tuple3<String,String,String>> dataStream = kafka.map(line-> {
            String[] fields = line.toString().replace("{","").replace("}","").
            replace("\"","").split(",");
            Tuple3<String, String,String> tuple3 = Tuple3.of(fields[0].substring(10),fields[1].substring(11),fields[2].substring(5));
            return tuple3;
        }).returns(Types.TUPLE(Types.STRING,Types.STRING,Types.STRING));

        dataStream.addSink(new HBaseWriterSink());

        env.execute("Kafka Sink To Hbase");
    }
}

```

### Submit job on Secure Shell

We use [Flink CLI](./flink-web-ssh-on-portal-to-flink-sql.md) from Azure portal to submit jobs

:::image type="content" source="./media/use-flink-to-sink-kafka-message-into-hbase/submit-job-on-web-ssh.png" alt-text="Screenshot showing how to submit job on web ssh." lightbox="./media/use-flink-to-sink-kafka-message-into-hbase/submit-job-on-web-ssh.png":::

### Monitor job on Flink UI

We can monitor the jobs on Flink Web UI

:::image type="content" source="./media/use-flink-to-sink-kafka-message-into-hbase/check-job-on-flink-ui.png" alt-text="Screenshot showing how to check job on Flink UI." lightbox="./media/use-flink-to-sink-kafka-message-into-hbase/check-job-on-flink-ui.png":::

## Validate HBase table data

```
hbase:001:0> scan 'user_click_events'
ROW                                   COLUMN+CELL
 0000000853                           column=user_info:ts, timestamp=2023-07-11T06:50:08.505, value=07/11/2023 06:39:44
 0000000853                           column=user_info:userName, timestamp=2023-07-11T06:50:08.505, value=Sean
 0000000853                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.505, value=https://kafka.apache.org
 0000000854                           column=user_info:ts, timestamp=2023-07-11T06:50:08.556, value=07/11/2023 06:39:45
 0000000854                           column=user_info:userName, timestamp=2023-07-11T06:50:08.556, value=Pick
 0000000854                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.556, value=https://www.bing.com/new
 0000000855                           column=user_info:ts, timestamp=2023-07-11T06:50:08.609, value=07/11/2023 06:39:45
 0000000855                           column=user_info:userName, timestamp=2023-07-11T06:50:08.609, value=Pick
 0000000855                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.609, value=https://kafka.apache.org
 0000000856                           column=user_info:ts, timestamp=2023-07-11T06:50:08.663, value=07/11/2023 06:39:45
 0000000856                           column=user_info:userName, timestamp=2023-07-11T06:50:08.663, value=Andrew
 0000000856                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.663, value=https://hadoop.apache.org
 0000000857                           column=user_info:ts, timestamp=2023-07-11T06:50:08.714, value=07/11/2023 06:39:45
 0000000857                           column=user_info:userName, timestamp=2023-07-11T06:50:08.714, value=Machael
 0000000857                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.714, value=https://flink.apache.org
 0000000858                           column=user_info:ts, timestamp=2023-07-11T06:50:08.767, value=07/11/2023 06:39:45
 0000000858                           column=user_info:userName, timestamp=2023-07-11T06:50:08.767, value=Luke
 0000000858                           column=user_info:visitURL, timestamp=2023-07-11T06:50:08.767, value=/azure/
                                      hdinsight/hdinsight-overview
859 row(s)
Took 0.9531 seconds
```

> [!NOTE]
> - FlinkKafkaConsumer is deprecated and removed with Flink 1.17, use KafkaSource instead.
> - FlinkKafkaProducer is deprecated and removed with Flink 1.15, use KafkaSink instead.

## References
* [Apache Kafka Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/kafka)
* [Download IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=windows)
* Apache, Apache Kafka, Kafka, Apache HBase, HBase, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
