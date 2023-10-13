---
title: DataStream API for MongoDB as a source and sink on Apache Flink
description: Learn how to use DataStream API for MongoDB as a source and sink on Apache Flink
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# DataStream API for MongoDB as a source and sink on Apache Flink

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Apache Flink provides a MongoDB connector for reading and writing data from and to MongoDB collections with at-least-once guarantees.

This example demonstrates on how to use HDInsight on AKS Apache Flink 1.16.0 along with your existing MongoDB as Sink and Source with Flink DataStream API MongoDB connector.

MongoDB is a non-relational document database that provides support for JSON-like storage that helps store complex structures easily.

In this example, you learn how to use MongoDB to source and sink with DataStream API.

## Prerequisites

* [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* For this demonstration, use a Window VM as maven project develop env in the same VNET as HDInsight on AKS.
* We use the [Apache Flink - MongoDB Connector](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/datastream/mongodb/)
* For this demonstration, use an Ubuntu VM in the same VNET as HDInsight on AKS, install a MongoDB on this VM.

## Installation of MongoDB on Ubuntu VM

[Install MongoDB on Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

[MongoDB Shell commands](https://www.mongodb.com/docs/mongodb-shell/run-commands/)

**Prepare MongoDB environment**:
```
root@contosoubuntuvm:/var/lib/mongodb# vim /etc/mongod.conf

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0

-- Start mongoDB
root@contosoubuntuvm:/var/lib/mongodb# systemctl start mongod
root@contosoubuntuvm:/var/lib/mongodb# systemctl status mongod
● mongod.service - MongoDB Database Server
     Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
     Active: active (running) since Fri 2023-06-16 00:07:39 UTC; 5s ago
       Docs: https://docs.mongodb.org/manual
   Main PID: 415775 (mongod)
     Memory: 165.4M
     CGroup: /system.slice/mongod.service
             └─415775 /usr/bin/mongod --config /etc/mongod.conf

Jun 16 00:07:39 contosoubuntuvm systemd[1]: Started MongoDB Database Server.
Jun 16 00:07:39 contosoubuntuvm mongod[415775]: {"t":{"$date":"2023-06-16T00:07:39.091Z"},"s":"I",  "c":"CONTROL",  "id":7484500, "ctx":"-","msg">

-- check connectivity
root@contosoubuntuvm:/var/lib/mongodb# telnet 10.0.0.7 27017
Trying 10.0.0.7...
Connected to 10.0.0.7.
Escape character is '^]'.

-- Use mongosh to connect to mongodb
root@contosoubuntuvm:/var/lib/mongodb# mongosh "mongodb://10.0.0.7:27017/test"
Current Mongosh Log ID: 648bccc3b8a6b0885614b2dc
Connecting to:          mongodb://10.0.0.7:27017/test?directConnection=true&appName=mongosh+1.10.0
Using MongoDB:          6.0.6
Using Mongosh:          1.10.0

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2023-06-16T00:07:39.103+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2023-06-16T00:07:40.108+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2023-06-16T00:07:40.108+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
   2023-06-16T00:07:40.108+00:00: vm.max_map_count is too low
------

- Check `click_events` collection

test> db.click_events.count()
0
```

> [!NOTE]
> To ensure the MongoDB setup can be accessed outside, change bindIp to `0.0.0.0`.

```
vim /etc/mongod.conf
# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0
```

## Get started

### Create a maven project on IdeaJ, to prepare the pom.xml for MongoDB Collection

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

<groupId>org.example</groupId>
<artifactId>MongoDBDemo</artifactId>
<version>1.0-SNAPSHOT</version>
<properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <flink.version>1.16.0</flink.version>
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
        <artifactId>flink-connector-mongodb</artifactId>
        <version>1.0.1-1.16</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-common -->
    <dependency>
        <groupId>org.apache.flink</groupId>
        <artifactId>flink-table-common</artifactId>
        <version>${flink.version}</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-api-java -->
    <dependency>
        <groupId>org.apache.flink</groupId>
        <artifactId>flink-table-api-java</artifactId>
        <version>${flink.version}</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/net.java.loci/jsr308-all -->
    <dependency>
        <groupId>net.java.loci</groupId>
        <artifactId>jsr308-all</artifactId>
        <version>1.1.2</version>
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

###  Generate a stream source and sink to the MongoDB collection:click_events
**MongoDBSinkDemo.java**
``` java
package contoso.example;

import com.mongodb.client.model.InsertOneModel;
import org.apache.flink.connector.base.DeliveryGuarantee;
import org.apache.flink.connector.mongodb.sink.MongoSink;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.bson.BsonDocument;

public class MongoDBSinkDemo {
    public static void main(String[] args) throws Exception {
        // 1. get stream env
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // 2. event data source, update the ip address from 10.0.0.7 to your MongoDB IP
        DataStreamSource<Event> stream = env.addSource(new ClickSource());
        stream.print();

        MongoSink<Event> sink = MongoSink.<Event>builder()
                .setUri("mongodb://10.0.0.7:27017")
                .setDatabase("test")
                .setCollection("click_events")
                .setBatchSize(1000)
                .setBatchIntervalMs(1000)
                .setMaxRetries(3)
                .setDeliveryGuarantee(DeliveryGuarantee.AT_LEAST_ONCE)
                .setSerializationSchema(
                        (input, context) -> new InsertOneModel<>(BsonDocument.parse(String.valueOf(input))))
                .build();

        stream.sinkTo(sink);

        env.execute("Sink click events to MongoDB");
    }
}
```
**Stream click event source:**
**ClickSource.java**
``` java
package contoso.example;
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
            Thread.sleep(2000);
        }
    }
    @Override
    public void cancel()
    {
        running = false;
    }
}
```

**Event.java**
``` java
package contoso.example;
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
        return "{" +
                "user: \"" + user + "\""  +
                ",url: \"" + url + "\""  +
                ",ts: " + ts +
                "}";
    }
}
```
### Use MongoDB as a source and sink to ADLS Gen2

Write a program for MongoDB as a source and sink to ADLS Gen2

**MongoDBSourceDemo.java**
``` java
package contoso.example;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringEncoder;
import org.apache.flink.api.common.typeinfo.BasicTypeInfo;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.configuration.MemorySize;
import org.apache.flink.connector.file.sink.FileSink;
import org.apache.flink.connector.mongodb.source.MongoSource;
import org.apache.flink.connector.mongodb.source.enumerator.splitter.PartitionStrategy;
import org.apache.flink.connector.mongodb.source.reader.deserializer.MongoDeserializationSchema;
import org.apache.flink.core.fs.Path;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.filesystem.rollingpolicies.DefaultRollingPolicy;
import org.bson.BsonDocument;

import java.time.Duration;

public class MongoDBSourceDemo {
    public static void main(String[] args) throws Exception {

        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        MongoSource<String> mongoSource = MongoSource.<String>builder()
                .setUri("mongodb://10.0.0.7:27017") // update with the correct IP address
                .setDatabase("test")
                .setCollection("click_events")
                .setFetchSize(2048)
                .setLimit(10000)
                .setNoCursorTimeout(true)
                .setPartitionStrategy(PartitionStrategy.SAMPLE)
                .setPartitionSize(MemorySize.ofMebiBytes(64))
                .setSamplesPerPartition(10)
                .setDeserializationSchema(new MongoDeserializationSchema<String>() {
                    @Override
                    public String deserialize(BsonDocument document) {
                        return document.toJson();
                    }

                    @Override
                    public TypeInformation<String> getProducedType() {
                        return BasicTypeInfo.STRING_TYPE_INFO;
                    }
                })
                .build();

        DataStream stream = env.fromSource(mongoSource, WatermarkStrategy.noWatermarks(), "MongoDB-Source");
        stream.print();
        // 3. sink to gen2, update with your container name and storage path
        String outputPath  = "abfs://<update-container>@<storage-path>.dfs.core.windows.net/flink/mongo_click_events";
        FileSink<String> gen2 = FileSink
                .forRowFormat(new Path(outputPath), new SimpleStringEncoder<String>("UTF-8"))
                .withRollingPolicy(
                        DefaultRollingPolicy.builder()
                                .withRolloverInterval(Duration.ofMinutes(5))
                                .withInactivityInterval(Duration.ofMinutes(3))
                                .withMaxPartSize(MemorySize.ofMebiBytes(5))
                                .build())
                .build();

        stream.sinkTo(gen2);

        env.execute("MongoDB as a Source Sink to Gen2");
    }
}
```
### Package the maven jar, and submit to Apache Flink UI

Package the maven jar, upload it to Storage and then wget it to [Flink CLI](./flink-web-ssh-on-portal-to-flink-sql.md) or directly upload to Flink UI to run.

:::image type="content" source="./media/datastream-api-mongodb/step-3-1-maven-jar-upload-abfs.png" alt-text="Screenshot displays how to upload package to storage." border="true" lightbox="./media/datastream-api-mongodb/step-3-1-maven-jar-upload-abfs.png":::

**Check Flink UI**

:::image type="content" source="./media/datastream-api-mongodb/step-3-2-flink-webui-jar-upload.png" alt-text="Screenshot displays jar submission success and monitoring the Flink Web UI." border="true" lightbox="./media/datastream-api-mongodb/step-3-2-flink-webui-jar-upload.png":::

### Validate results

**Sink click events to Mongo DB's admin.click_events collection**
```
test> db.click_events.count()
24

test> db.click_events.find()
[
  {
    _id: ObjectId("648bc933a68ca7614e1f87a2"),
    user: 'Alice',
    url: './prod?id=10',
    ts: Long("1686882611148")
  },
  {
    _id: ObjectId("648bc935a68ca7614e1f87a3"),
    user: 'Bob',
    url: './prod?id=10',
    ts: Long("1686882613148")
  },
…….

```
**Use Mongo DB's admin.click_events collection as a source, and sink to ADLS Gen2**

:::image type="content" source="./media/datastream-api-mongodb/step-5-mongodb-collection-adls-gen2.png" alt-text="Screenshot displays How to create a node and connect to web SSH." border="true" lightbox="./media/datastream-api-mongodb/step-5-mongodb-collection-adls-gen2.png":::
