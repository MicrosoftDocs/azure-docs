---
title: Using Azure Cosmos DB (Apache Cassandra) with HDInsight on AKS - Flink
description: Learn how to Sink HDInsight Kafka message into Azure Cosmos DB for Apache Cassandra, with Apache Flink running on HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Sink Kafka messages into Azure Cosmos DB for Apache Cassandra, with HDInsight on AKS - Flink

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This example uses [HDInsight on AKS Flink 1.16.0](../flink/flink-overview.md) to sink [HDInsight Kafka 3.2.0](/azure/hdinsight/kafka/apache-kafka-introduction) messages into [Azure Cosmos DB for Apache Cassandra](/azure/cosmos-db/cassandra/introduction)

## Prerequisites

* [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* [HDInsight 5.1 Kafka 3.2](../../hdinsight/kafka/apache-kafka-get-started.md)
* [Azure Cosmos DB for Apache Cassandra](../../cosmos-db/cassandra/index.yml)
* Prepare an Ubuntu VM as maven project development env in the same VNet as HDInsight on AKS.

## Azure Cosmos DB for Apache Cassandra

Azure Cosmos DB for Apache Cassandra can be used as the data store for apps written for Apache Cassandra. This compatibility means that by using existing Apache drivers compliant with CQLv4, your existing Cassandra application can now communicate with the API for Cassandra.

For more information, see the following links.

* [Azure Cosmos DB for Apache Cassandra](../../cosmos-db/cassandra/introduction.md).
* [Create a API for Cassandra account in Azure Cosmos DB](../../cosmos-db/cassandra/create-account-java.md).

:::image type="content" source="./media/cosmos-db-for-apache-cassandra/create-cosmos-db-account.png" alt-text="Screenshot showing how to create Azure Cosmos DB for Apache Cassandra on Azure portal." border="true" lightbox="./media/cosmos-db-for-apache-cassandra/create-cosmos-db-account.png":::

Get credentials uses it on Stream source code:

:::image type="content" source="./media/cosmos-db-for-apache-cassandra/get-credentials.png" alt-text="Screenshot showing how to get credentials on stream source code." border="true" lightbox="./media/cosmos-db-for-apache-cassandra/get-credentials.png":::

## Implementation

**On an Ubuntu VM, let's prepare the development environment** 

### Cloning repository of Azure Samples

Refer GitHub readme to download maven, clone this repository using `Azure-Samples/azure-cosmos-db-cassandra-java-getting-started.git` from 
[Azure Samples ](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-java-getting-started)

### Updating maven project for Cassandra

Go to maven project folder **azure-cosmos-db-cassandra-java-getting-started-main** and update the changes required for this example

**maven pom.xml**
``` xml

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.azure.cosmosdb.cassandra</groupId>
    <artifactId>cosmosdb-cassandra-examples</artifactId>
    <version>1.0-SNAPSHOT</version>
   <dependencies>
             <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-java</artifactId>
            <version>1.16.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java</artifactId>
            <version>1.16.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-clients -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-clients</artifactId>
            <version>1.16.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-files</artifactId>
            <version>1.16.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>1.16.0</version>
        </dependency>
        <dependency>
            <groupId>com.datastax.cassandra</groupId>
            <artifactId>cassandra-driver-core</artifactId>
            <version>3.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.datastax.cassandra</groupId>
            <artifactId>cassandra-driver-mapping</artifactId>
            <version>3.1.4</version>
        </dependency>
        <dependency>
            <groupId>com.datastax.cassandra</groupId>
            <artifactId>cassandra-driver-extras</artifactId>
            <version>3.1.4</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.5</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <finalName>cosmosdb-cassandra-examples</finalName>
                    <appendAssemblyId>false</appendAssemblyId>
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
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```
**Cosmos DB for Apache Cassandra's connection configuration**

You're required to update your host-name and user-name, and keys in the below snippet.

```
root@flinkvm:/home/flinkvm/azure-cosmos-db-cassandra-java-getting-started-main/src/main/resources# cat config.properties
###Cassandra endpoint details on cosmosdb
cassandra_host=<update-host-name>.cassandra.cosmos.azure.com
cassandra_port = 10350
cassandra_username=<update-user-name>
cassandra_password=mxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#ssl_keystore_file_path=<SSL key store file location>
#ssl_keystore_password=<SSL key store password>
```

**source structure**

```
root@flinkvm:/home/flinkvm/azure-cosmos-db-cassandra-java-getting-started-main/src/main/java/com/azure/cosmosdb/cassandra# ll
total 24
drwxr-xr-x 5 root root 4096 May 12 12:46 ./
drwxr-xr-x 3 root root 4096 Apr  9  2020 ../
-rw-r--r-- 1 root root 1105 Apr  9  2020 User.java
drwxr-xr-x 2 root root 4096 May 15 03:53 examples/
drwxr-xr-x 2 root root 4096 Apr  9  2020 repository/
drwxr-xr-x 2 root root 4096 May 15 02:43 util/
```

**util folder**  
**CassandraUtils.java**

> [!NOTE]
> Change ssl_keystore_file_path depends on the java cert location. On HDInsight on AKS Apache Flink, the path is `/usr/lib/jvm/msopenjdk-11-jre/lib/security`

``` java
package com.azure.cosmosdb.cassandra.util;

import com.datastax.driver.core.*;

import javax.net.ssl.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.security.*;

/**
 * Cassandra utility class to handle the Cassandra Sessions
 */
public class CassandraUtils {

    private Cluster cluster;
    private Configurations config = new Configurations();
    private String cassandraHost = "<cassandra-host-ip>";
    private int cassandraPort = 10350;
    private String cassandraUsername = "localhost";
    private String cassandraPassword = "<cassandra-password>";
    private File sslKeyStoreFile = null;
    private String sslKeyStorePassword = "<keystore-password>";


    /**
     * This method creates a Cassandra Session based on the the end-point details given in config.properties.
     * This method validates the SSL certificate based on ssl_keystore_file_path & ssl_keystore_password properties.
     * If ssl_keystore_file_path & ssl_keystore_password are not given then it uses 'cacerts' from JDK.
     * @return Session Cassandra Session
     */
    public Session getSession() {

        try {
            //Load cassandra endpoint details from config.properties
            loadCassandraConnectionDetails();

            final KeyStore keyStore = KeyStore.getInstance("JKS");
            try (final InputStream is = new FileInputStream(sslKeyStoreFile)) {
                keyStore.load(is, sslKeyStorePassword.toCharArray());
            }

            final KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory
                    .getDefaultAlgorithm());
            kmf.init(keyStore, sslKeyStorePassword.toCharArray());
            final TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory
                    .getDefaultAlgorithm());
            tmf.init(keyStore);

            // Creates a socket factory for HttpsURLConnection using JKS contents.
            final SSLContext sc = SSLContext.getInstance("TLSv1.2");
            sc.init(kmf.getKeyManagers(), tmf.getTrustManagers(), new java.security.SecureRandom());

            JdkSSLOptions sslOptions = RemoteEndpointAwareJdkSSLOptions.builder()
                    .withSSLContext(sc)
                    .build();
            cluster = Cluster.builder()
                    .addContactPoint(cassandraHost)
                    .withPort(cassandraPort)
                    .withCredentials(cassandraUsername, cassandraPassword)
                    .withSSL(sslOptions)
                    .build();

            return cluster.connect();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public Cluster getCluster() {
        return cluster;
    }

    /**
     * Closes the cluster and Cassandra session
     */
    public void close() {
        cluster.close();
    }

    /**
     * Loads Cassandra end-point details from config.properties.
     * @throws Exception
     */
    private void loadCassandraConnectionDetails() throws Exception {
        cassandraHost = config.getProperty("cassandra_host");
        cassandraPort = Integer.parseInt(config.getProperty("cassandra_port"));
        cassandraUsername = config.getProperty("cassandra_username");
        cassandraPassword = config.getProperty("cassandra_password");
        String ssl_keystore_file_path = config.getProperty("ssl_keystore_file_path");
        String ssl_keystore_password = config.getProperty("ssl_keystore_password");

        // If ssl_keystore_file_path, build the path using JAVA_HOME directory.
        if (ssl_keystore_file_path == null || ssl_keystore_file_path.isEmpty()) {
            String javaHomeDirectory = System.getenv("JAVA_HOME");
            if (javaHomeDirectory == null || javaHomeDirectory.isEmpty()) {
                throw new Exception("JAVA_HOME not set");
            }
            ssl_keystore_file_path = new StringBuilder(javaHomeDirectory).append("/lib/security/cacerts").toString();
        }

        sslKeyStorePassword = (ssl_keystore_password != null && !ssl_keystore_password.isEmpty()) ?
                ssl_keystore_password : sslKeyStorePassword;

        sslKeyStoreFile = new File(ssl_keystore_file_path);

        if (!sslKeyStoreFile.exists() || !sslKeyStoreFile.canRead()) {
            throw new Exception(String.format("Unable to access the SSL Key Store file from %s", ssl_keystore_file_path));
        }
    }
}
```

**Configurations.java**

``` java
package com.azure.cosmosdb.cassandra.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Configuration utility to read the configurations from properties file
 */
public class Configurations {
    private static final Logger LOGGER = LoggerFactory.getLogger(Configurations.class);
    private static String PROPERTY_FILE = "config.properties";
    private static Properties prop = null;

    private void loadProperties() throws IOException {
        InputStream input = getClass().getClassLoader().getResourceAsStream(PROPERTY_FILE);
        if (input == null) {
            LOGGER.error("Sorry, unable to find {}", PROPERTY_FILE);
            return;
        }
        prop = new Properties();
        prop.load(input);
    }

    public String getProperty(String propertyName) throws IOException {
        if (prop == null) {
            loadProperties();
        }
        return prop.getProperty(propertyName);

    }
}
```

**Examples folder**  

**CassandraSink.java**
``` java
package com.azure.cosmosdb.cassandra.examples;

import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import com.azure.cosmosdb.cassandra.repository.UserRepository;
import com.azure.cosmosdb.cassandra.util.CassandraUtils;

public class CassandraSink implements SinkFunction<Tuple3<Integer, String, String>> {

    @Override
    public void invoke(Tuple3<Integer, String, String> value, Context context) throws Exception {

            CassandraUtils utils = new CassandraUtils();
            Session cassandraSession = utils.getSession();
            try {
                UserRepository repository = new UserRepository(cassandraSession);

                //Insert rows into user table
                PreparedStatement preparedStatement = repository.prepareInsertStatement();
                repository.insertUser(preparedStatement, value.f0, value.f1, value.f2);

                } finally {
                        if (null != utils) utils.close();
                        if (null != cassandraSession) cassandraSession.close();
                        }
            }
}
```

**main class: CassandraDemo.java**

> [!Note] 
> * Replace Kafka Broker IPs with your cluster broker IPs
> * Prepare topic
>   * user `/usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 3 --topic user --bootstrap-server wn0-flinkd:9092`

``` java
package com.azure.cosmosdb.cassandra.examples;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.api.java.tuple.Tuple3;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class CassandraDemo {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment().setParallelism(1);

        // 1. read kafka message as stream input, update the broker IPs from your Kafka setup
        String brokers = "<update-broker-ips>:9092,<update-broker-ips>:9092,<update-broker-ips>:9092";

        KafkaSource<String> source = KafkaSource.<String>builder()
                .setBootstrapServers(brokers)
                .setTopics("user")
                .setGroupId("my-group")
                .setStartingOffsets(OffsetsInitializer.earliest())
                .setValueOnlyDeserializer(new SimpleStringSchema())
                .build();

        DataStream<String> kafka = env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source");
        kafka.print();

        DataStream<Tuple3<Integer,String,String>> dataStream = kafka.map(line-> {
            String[] fields = line.split(",");
            int v1 = Integer.parseInt(fields[0]);
            Tuple3<Integer,String,String> tuple3 = Tuple3.of(v1,fields[1],fields[2]);
            return tuple3;
        }).returns(Types.TUPLE(Types.INT,Types.STRING,Types.STRING));


        dataStream.addSink(new CassandraSink());

        // 4. run stream
        env.execute("sink Kafka to Cosmos DB for Apache Cassandra");
    }
}
```

### Building the project

Run **mvn clean install** from azure-cosmos-db-cassandra-java-getting-started-main folder to build the project. This command generates cosmosdb-cassandra-examples.jar under target folder

```
root@flinkvm:/home/flinkvm/azure-cosmos-db-cassandra-java-getting-started-main/target# ll
total 91156
drwxr-xr-x 7 root root     4096 May 15 03:54 ./
drwxr-xr-x 7 root root     4096 May 15 03:54 ../
drwxr-xr-x 2 root root     4096 May 15 03:54 archive-tmp/
drwxr-xr-x 3 root root     4096 May 15 03:54 classes/
-rw-r--r-- 1 root root    15542 May 15 03:54 cosmosdb-cassandra-examples-1.0-SNAPSHOT.jar
-rw-r--r-- 1 root root 93290819 May 15 03:54 cosmosdb-cassandra-examples.jar
drwxr-xr-x 3 root root     4096 May 15 03:54 generated-sources/
drwxr-xr-x 2 root root     4096 May 15 03:54 maven-archiver/
drwxr-xr-x 3 root root     4096 May 15 03:54 maven-status/
```

### Uploading the jar for Apache Flink Job submission

Upload jar into Azure storage and wget into webssh

```
msdata@pod-0 [ ~ ]$ ls -l cosmosdb-cassandra-examples.jar
-rw-r----- 1 msdata msdata 93290819 May 15 04:02 cosmosdb-cassandra-examples.jar
```

## Preparing Cosmos DB KeyStore and Table

Run UserProfile class in /azure-cosmos-db-cassandra-java-getting-started-main/src/main/java/com/azure/cosmosdb/cassandra/examples to create Azure Cosmos DB's keystore and table.

```
bin/flink run -c com.azure.cosmosdb.cassandra.examples.UserProfile -j cosmosdb-cassandra-examples.jar
```

## Sink Kafka Topics into Cosmos DB (Apache Cassandra)

Run CassandraDemo class to sink Kafka topic into  Cosmos DB for Apache Cassandra

```
bin/flink run -c com.azure.cosmosdb.cassandra.examples.CassandraDemo -j cosmosdb-cassandra-examples.jar
```

:::image type="content" source="./media/cosmos-db-for-apache-cassandra/run-cassandra-demo.png" alt-text="Screenshot showing how to run  Cassandra Demo." border="true" lightbox="./media/cosmos-db-for-apache-cassandra/run-cassandra-demo.png":::

## Validate Apache Flink Job Submission

Check job on HDInsight on AKS Flink UI

:::image type="content" source="./media/cosmos-db-for-apache-cassandra/check-output-on-flink-ui.png" alt-text="Screenshot showing how to check the job on HDInsight on AKS Flink UI." lightbox="./media/cosmos-db-for-apache-cassandra/check-output-on-flink-ui.png":::

## Producing Messages in Kafka

Produce message into Kafka topic

``` python
sshuser@hn0-flinkd:~$ cat user.py
import time
from datetime import datetime
import random

user_set = [
        'John',
        'Mike',
        'Lucy',
        'Tom',
        'Machael',
        'Lily',
        'Zark',
        'Tim',
        'Andrew',
        'Pick',
        'Sean',
        'Luke',
        'Chunck'
]

city_set = [
        'Atmore',
        'Auburn',
        'Bessemer',
        'Birmingham',
        'Chickasaw',
        'Clanton',
        'Decatur',
        'Florence',
        'Greenville',
        'Jasper',
        'Huntsville',
        'Homer',
        'Homer'
]

def main():
        while True:
                unique_id = str(int(time.time()))
                if random.randrange(10) < 4:
                        city = random.choice(city_set[:3])
                else:
                        city = random.choice(city_set)
                user = random.choice(user_set)
                print(unique_id + "," + user + "," + city )
                time.sleep(1)

if __name__ == "__main__":
    main()
```

```
sshuser@hn0-flinkd:~$ python user.py | /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --bootstrap-server wn0-flinkd:9092 --topic user &
[2] 11516
```

## Check table on Cosmos DB for Apache Cassandra on Azure portal

:::image type="content" source="./media/cosmos-db-for-apache-cassandra/check-tables-on-cosmos-db.png" alt-text="Screenshot showing Cosmos DB for Apache Cassandra on Azure portal." lightbox="./media/cosmos-db-for-apache-cassandra/check-tables-on-cosmos-db.png":::

### Preferences

* [Azure Cosmos DB for Apache Cassandra](../../cosmos-db/cassandra/introduction.md).
* [Create a API for Cassandra account in Azure Cosmos DB](../../cosmos-db/cassandra/create-account-java.md)
* [Azure Samples ](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-java-getting-started)
