---
title: Azure Synapse Runtime for Apache Spark 3.4 
description: New runtime is in Public Preview. Try it and use Spark 3.4.1, Python 3.10, Delta Lake 2.4.
author: rajwinny
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 11/17/2023 
ms.author: rajwinny
ms.reviewer: ekote
---

# Azure Synapse Runtime for Apache Spark 3.4 (Public Preview)
Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document covers the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.4.

## Component versions

|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.4.1    |
| Operating System | Mariner 2.0  |
| Java | 11  |
| Scala | 2.12.17      |
| Delta Lake | 2.4.0        |
| Python | 3.10     |
| R | 4.2.2    |



As of now, creation of Spark 3.4 pools will be available only thru Azure Synapse Studio. In the upcoming weeks we will add the Azure Portal and ARM support.


## Libraries
The following sections present the libraries included in Azure Synapse Runtime for Apache Spark 3.4 (Public Preview).

### Scala and Java default libraries
The following table lists all the default level packages for Java/Scala and their respective versions.

| GroupID                                | ArtifactID                                  | Version                     |
|----------------------------------------|---------------------------------------------|-----------------------------|
| com.aliyun                             | aliyun-java-sdk-core                        | 4.5.10                      |
| com.aliyun                             | aliyun-java-sdk-kms                         | 2.11.0                      |
| com.aliyun                             | aliyun-java-sdk-ram                         | 3.1.0                       |
| com.aliyun                             | aliyun-sdk-oss                              | 3.13.0                      |
| com.amazonaws                          | aws-java-sdk-bundle                         | 1.12.1026                   |
| com.chuusai                            | shapeless_2.12                              | 2.3.7                       |
| com.clearspring.analytics              | stream                                      | 2.9.6                       |
| com.esotericsoftware                   | kryo-shaded                                 | 4.0.2                       |
| com.esotericsoftware                   | minlog                                      | 1.3.0                       |
| com.fasterxml.jackson                  | jackson-annotations                         | 2.13.4                      |
| com.fasterxml.jackson                  | jackson-core                                | 2.13.4                      |
| com.fasterxml.jackson                  | jackson-core-asl                            | 1.9.13                      |
| com.fasterxml.jackson                  | jackson-databind                            | 2.13.4.1                    |
| com.fasterxml.jackson                  | jackson-dataformat-cbor                     | 2.13.4                      |
| com.fasterxml.jackson                  | jackson-mapper-asl                          | 1.9.13                      |
| com.fasterxml.jackson                  | jackson-module-scala_2.12                   | 2.13.4                      |
| com.github.joshelser                   | dropwizard-metrics-hadoop-metrics2-reporter | 0.1.2                       |
| com.github.luben                       | zstd-jni                                    | 1.5.2-1                     |
| com.github.luben                       | zstd-jni                                    | 1.5.2-1                     |
| com.github.vowpalwabbit                | vw-jni                                      | 9.3.0                       |
| com.github.wendykierp                  | JTransforms                                 | 3.1                         |
| com.google.code.findbugs               | jsr305                                      | 3.0.0                       |
| com.google.code.gson                   | gson                                        | 2.8.6                       |
| com.google.crypto.tink                 | tink                                        | 1.6.1                       |
| com.google.flatbuffers                 | flatbuffers-java                            | 1.12.0                      |
| com.google.guava                       | guava                                       | 14.0.1                      |
| com.google.protobuf                    | protobuf-java                               | 2.5.0                       |
| com.googlecode.json-simple             | json-simple                                 | 1.1.1                       |
| com.jcraft                             | jsch                                        | 0.1.54                      |
| com.jolbox                             | bonecp                                      | 0.8.0.RELEASE               |
| com.linkedin.isolation-forest          | isolation-forest_3.2.0_2.12                 | 2.0.8                       |
| com.microsoft.azure                    | azure-data-lake-store-sdk                   | 2.3.9                       |
| com.microsoft.azure                    | azure-eventhubs                             | 3.3.0                       |
| com.microsoft.azure                    | azure-eventhubs-spark_2.12                  | 2.3.22                      |
| com.microsoft.azure                    | azure-keyvault-core                         | 1.0.0                       |
| com.microsoft.azure                    | azure-storage                               | 7.0.1                       |
| com.microsoft.azure                    | cosmos-analytics-spark-3.4.1-connector_2.12 | 1.8.10                      |
| com.microsoft.azure                    | qpid-proton-j-extensions                    | 1.2.4                       |
| com.microsoft.azure                    | synapseml_2.12                              | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-cognitive_2.12                    | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-core_2.12                         | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-deep-learning_2.12                | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-internal_2.12                     | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-lightgbm_2.12                     | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-opencv_2.12                       | 0.11.3-spark3.3             |
| com.microsoft.azure                    | synapseml-vw_2.12                           | 0.11.3-spark3.3             |
| com.microsoft.azure.kusto              | kusto-data                                  | 3.2.1                       |
| com.microsoft.azure.kusto              | kusto-ingest                                | 3.2.1                       |
| com.microsoft.azure.kusto              | kusto-spark_3.0_2.12                        | 3.1.16                      |
| com.microsoft.azure.kusto              | spark-kusto-synapse-connector_3.1_2.12      | 1.3.3                       |
| com.microsoft.cognitiveservices.speech | client-jar-sdk                              | 1.14.0                      |
| com.microsoft.sqlserver                | msslq-jdbc                                  | 8.4.1.jre8                  |
| com.ning                               | compress-lzf                                | 1.1                         |
| com.sun.istack                         | istack-commons-runtime                      | 3.0.8                       |
| com.tdunning                           | json                                        | 1.8                         |
| com.thoughtworks.paranamer             | paranamer                                   | 2.8                         |
| com.twitter                            | chill-java                                  | 0.10.0                      |
| com.twitter                            | chill_2.12                                  | 0.10.0                      |
| com.typesafe                           | config                                      | 1.3.4                       |
| com.univocity                          | univocity-parsers                           | 2.9.1                       |
| com.zaxxer                             | HikariCP                                    | 2.5.1                       |
| commons-cli                            | commons-cli                                 | 1.5.0                       |
| commons-codec                          | commons-codec                               | 1.15                        |
| commons-collections                    | commons-collections                         | 3.2.2                       |
| commons-dbcp                           | commons-dbcp                                | 1.4                         |
| commons-io                             | commons-io                                  | 2.11.0                      |
| commons-lang                           | commons-lang                                | 2.6                         |
| commons-logging                        | commons-logging                             | 1.1.3                       |
| commons-pool                           | commons-pool                                | 1.5.4                       |
| dev.ludovic.netlib                     | arpack                                      | 2.2.1                       |
| dev.ludovic.netlib                     | blas                                        | 2.2.1                       |
| dev.ludovic.netlib                     | lapack                                      | 2.2.1                       |
| io.airlift                             | aircompressor                               | 0.21                        |
| io.delta                               | delta-core_2.12                             | 2.2.0.9                     |
| io.delta                               | delta-storage                               | 2.2.0.9                     |
| io.dropwizard.metrics                  | metrics-core                                | 4.2.7                       |
| io.dropwizard.metrics                  | metrics-graphite                            | 4.2.7                       |
| io.dropwizard.metrics                  | metrics-jmx                                 | 4.2.7                       |
| io.dropwizard.metrics                  | metrics-json                                | 4.2.7                       |
| io.dropwizard.metrics                  | metrics-jvm                                 | 4.2.7                       |
| io.github.resilience4j                 | resilience4j-core                           | 1.7.1                       |
| io.github.resilience4j                 | resilience4j-retry                          | 1.7.1                       |
| io.netty                               | netty-all                                   | 4.1.74.Final                |
| io.netty                               | netty-buffer                                | 4.1.74.Final                |
| io.netty                               | netty-codec                                 | 4.1.74.Final                |
| io.netty                               | netty-codec-http2                           | 4.1.74.Final                |
| io.netty                               | netty-codec-http-4                          | 4.1.74.Final                |
| io.netty                               | netty-codec-socks                           | 4.1.74.Final                |
| io.netty                               | netty-common                                | 4.1.74.Final                |
| io.netty                               | netty-handler                               | 4.1.74.Final                |
| io.netty                               | netty-resolver                              | 4.1.74.Final                |
| io.netty                               | netty-tcnative-classes                      | 2.0.48                      |
| io.netty                               | netty-transport                             | 4.1.74.Final                |
| io.netty                               | netty-transport-classes-epoll               | 4.1.87.Final                |
| io.netty                               | netty-transport-classes-kqueue              | 4.1.87.Final                |
| io.netty                               | netty-transport-native-epoll                | 4.1.87.Final-linux-aarch_64 |
| io.netty                               | netty-transport-native-epoll                | 4.1.87.Final-linux-x86_64   |
| io.netty                               | netty-transport-native-kqueue               | 4.1.87.Final-osx-aarch_64   |
| io.netty                               | netty-transport-native-kqueue               | 4.1.87.Final-osx-x86_64     |
| io.netty                               | netty-transport-native-unix-common          | 4.1.87.Final                |
| io.opentracing                         | opentracing-api                             | 0.33.0                      |
| io.opentracing                         | opentracing-noop                            | 0.33.0                      |
| io.opentracing                         | opentracing-util                            | 0.33.0                      |
| io.spray                               | spray-json_2.12                             | 1.3.5                       |
| io.vavr                                | vavr                                        | 0.10.4                      |
| io.vavr                                | vavr-match                                  | 0.10.4                      |
| jakarta.annotation                     | jakarta.annotation-api                      | 1.3.5                       |
| jakarta.inject                         | jakarta.inject                              | 2.6.1                       |
| jakarta.servlet                        | jakarta.servlet-api                         | 4.0.3                       |
| jakarta.validation-api                 |                                             | 2.0.2                       |
| jakarta.ws.rs                          | jakarta.ws.rs-api                           | 2.1.6                       |
| jakarta.xml.bind                       | jakarta.xml.bind-api                        | 2.3.2                       |
| javax.activation                       | activation                                  | 1.1.1                       |
| javax.jdo                              | jdo-api                                     | 3.0.1                       |
| javax.transaction                      | jta                                         | 1.1                         |
| javax.transaction                      | transaction-api                             | 1.1                         |
| javax.xml.bind                         | jaxb-api                                    | 2.2.11                      |
| javolution                             | javolution                                  | 5.5.1                       |
| jline                                  | jline                                       | 2.14.6                      |
| joda-time                              | joda-time                                   | 2.10.13                     |
| mysql                                  | mysql-connector-java                        | 8.0.18                      |
| net.razorvine                          | pickle                                      | 1.2                         |
| net.sf.jpam                            | jpam                                        | 1.1                         |
| net.sf.opencsv                         | opencsv                                     | 2.3                         |
| net.sf.py4j                            | py4j                                        | 0.10.9.5                    |
| net.sf.supercsv                        | super-csv                                   | 2.2.0                       |
| net.sourceforge.f2j                    | arpack_combined_all                         | 0.1                         |
| org.antlr                              | ST4                                         | 4.0.4                       |
| org.antlr                              | antlr-runtime                               | 3.5.2                       |
| org.antlr                              | antlr4-runtime                              | 4.8                         |
| org.apache.arrow                       | arrow-format                                | 7.0.0                       |
| org.apache.arrow                       | arrow-memory-core                           | 7.0.0                       |
| org.apache.arrow                       | arrow-memory-netty                          | 7.0.0                       |
| org.apache.arrow                       | arrow-vector                                | 7.0.0                       |
| org.apache.avro                        | avro                                        | 1.11.0                      |
| org.apache.avro                        | avro-ipc                                    | 1.11.0                      |
| org.apache.avro                        | avro-mapred                                 | 1.11.0                      |
| org.apache.commons                     | commons-collections4                        | 4.4                         |
| org.apache.commons                     | commons-compress                            | 1.21                        |
| org.apache.commons                     | commons-crypto                              | 1.1.0                       |
| org.apache.commons                     | commons-lang3                               | 3.12.0                      |
| org.apache.commons                     | commons-math3                               | 3.6.1                       |
| org.apache.commons                     | commons-pool2                               | 2.11.1                      |
| org.apache.commons                     | commons-text                                | 1.10.0                      |
| org.apache.curator                     | curator-client                              | 2.13.0                      |
| org.apache.curator                     | curator-framework                           | 2.13.0                      |
| org.apache.curator                     | curator-recipes                             | 2.13.0                      |
| org.apache.derby                       | derby                                       | 10.14.2.0                   |
| org.apache.hadoop                      | hadoop-aliyun                               | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-annotations                          | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-aws                                  | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-azure                                | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-azure-datalake                       | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-client-api                           | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-client-runtime                       | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-cloud-storage                        | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-openstack                            | 3.3.3.5.2-106693326         |
| org.apache.hadoop                      | hadoop-shaded-guava                         | 1.1.1                       |
| org.apache.hadoop                      | hadoop-yarn-server-web-proxy                | 3.3.3.5.2-106693326         |
| org.apache.hive                        | hive-beeline                                | 2.3.9                       |
| org.apache.hive                        | hive-cli                                    | 2.3.9                       |
| org.apache.hive                        | hive-common                                 | 2.3.9                       |
| org.apache.hive                        | hive-exec                                   | 2.3.9                       |
| org.apache.hive                        | hive-jdbc                                   | 2.3.9                       |
| org.apache.hive                        | hive-llap-common                            | 2.3.9                       |
| org.apache.hive                        | hive-metastore                              | 2.3.9                       |
| org.apache.hive                        | hive-serde                                  | 2.3.9                       |
| org.apache.hive                        | hive-service-rpc                            | 2.3.9                       |
| org.apache.hive                        | hive-shims-0.23                             | 2.3.9                       |
| org.apache.hive                        | hive-shims                                  | 2.3.9                       |
| org.apache.hive                        | hive-shims-common                           | 2.3.9                       |
| org.apache.hive                        | hive-shims-scheduler                        | 2.3.9                       |
| org.apache.hive                        | hive-storage-api                            | 2.7.2                       |
| org.apache.httpcomponents              | httpclient                                  | 4.5.13                      |
| org.apache.httpcomponents              | httpcore                                    | 4.4.14                      |
| org.apache.httpcomponents              | httpmime                                    | 4.5.13                      |
| org.apache.httpcomponents.client5      | httpclient5                                 | 5.1.3                       |
| org.apache.iceberg                     | delta-iceberg                               | 2.2.0.9                     |
| org.apache.ivy                         | ivy                                         | 2.5.1                       |
| org.apache.kafka                       | kafka-clients                               | 2.8.1                       |
| org.apache.logging.log4j               | log4j-1.2-api                               | 2.17.2                      |
| org.apache.logging.log4j               | log4j-api                                   | 2.17.2                      |
| org.apache.logging.log4j               | log4j-core                                  | 2.17.2                      |
| org.apache.logging.log4j               | log4j-slf4j-impl                            | 2.17.2                      |
| org.apache.orc                         | orc-core                                    | 1.7.6                       |
| org.apache.orc                         | orc-mapreduce                               | 1.7.6                       |
| org.apache.orc                         | orc-shims                                   | 1.7.6                       |
| org.apache.parquet                     | parquet-column                              | 1.12.3                      |
| org.apache.parquet                     | parquet-common                              | 1.12.3                      |
| org.apache.parquet                     | parquet-encoding                            | 1.12.3                      |
| org.apache.parquet                     | parquet-format-structures                   | 1.12.3                      |
| org.apache.parquet                     | parquet-hadoop                              | 1.12.3                      |
| org.apache.parquet                     | parquet-jackson                             | 1.12.3                      |
| org.apache.qpid                        | proton-j                                    | 0.33.8                      |
| org.apache.spark                       | spark-avro_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-catalyst_2.12                         | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-core_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-graphx_2.12                           | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-hadoop-cloud_2.12                     | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-hive_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-kvstore_2.12                          | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-launcher_2.12                         | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-mllib_2.12                            | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-mllib-local_2.12                      | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-network-common_2.12                   | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-network-shuffle_2.12                  | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-repl_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-sketch_2.12                           | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-sql_2.12                              | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-sql-kafka-0-10_2.12                   | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-streaming_2.12                        | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-streaming-kafka-0-10-assembly_2.12    | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-tags_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-token-provider-kafka-0-10_2.12        | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-unsafe_2.12                           | 3.3.1.5.2-106693326         |
| org.apache.spark                       | spark-yarn_2.12                             | 3.3.1.5.2-106693326         |
| org.apache.thrift                      | libfb303                                    | 0.9.3                       |
| org.apache.thrift                      | libthrift                                   | 0.12.0                      |
| org.apache.velocity                    | velocity                                    | 1.5                         |
| org.apache.xbean                       | xbean-asm9-shaded                           | 4.2                         |
| org.apache.yetus                       | audience-annotations                        | 0.5.0                       |
| org.apache.zookeeper                   | zookeeper                                   | 3.6.2.5.2-106693326         |
| org.apache.zookeeper                   | zookeeper-jute                              | 3.6.2.5.2-106693326         |
| org.apache.zookeeper                   | zookeeper                                   | 3.6.2.5.2-106693326         |
| org.apache.zookeeper                   | zookeeper-jute                              | 3.6.2.5.2-106693326         |
| org.apiguardian                        | apiguardian-api                             | 1.1.0                       |
| org.codehaus.janino                    | commons-compiler                            | 3.0.16                      |
| org.codehaus.janino                    | janino                                      | 3.0.16                      |
| org.codehaus.jettison                  | jettison                                    | 1.1                         |
| org.datanucleus                        | datanucleus-api-jdo                         | 4.2.4                       |
| org.datanucleus                        | datanucleus-core                            | 4.1.17                      |
| org.datanucleus                        | datanucleus-rdbms                           | 4.1.19                      |
| org.datanucleusjavax.jdo               |                                             | 3.2.0-m3                    |
| org.eclipse.jetty                      | jetty-util                                  | 9.4.48.v20220622            |
| org.eclipse.jetty                      | jetty-util-ajax                             | 9.4.48.v20220622            |
| org.fusesource.leveldbjni              | leveldbjni-all                              | 1.8                         |
| org.glassfish.hk2                      | hk2-api                                     | 2.6.1                       |
| org.glassfish.hk2                      | hk2-locator                                 | 2.6.1                       |
| org.glassfish.hk2                      | hk2-utils                                   | 2.6.1                       |
| org.glassfish.hk2                      | osgi-resource-locator                       | 1.0.3                       |
| org.glassfish.hk2.external             | aopalliance-repackaged                      | 2.6.1                       |
| org.glassfish.jaxb                     | jaxb-runtime                                | 2.3.2                       |
| org.glassfish.jersey.containers        | jersey-container-servlet                    | 2.36                        |
| org.glassfish.jersey.containers        | jersey-container-servlet-core               | 2.36                        |
| org.glassfish.jersey.core              | jersey-client                               | 2.36                        |
| org.glassfish.jersey.core              | jersey-common                               | 2.36                        |
| org.glassfish.jersey.core              | jersey-server                               | 2.36                        |
| org.glassfish.jersey.inject            | jersey-hk2                                  | 2.36                        |
| org.ini4j                              | ini4j                                       | 0.5.4                       |
| org.javassist                          | javassist                                   | 3.25.0-GA                   |
| org.javatuples                         | javatuples                                  | 1.2                         |
| org.jdom                               | jdom2                                       | 2.0.6                       |
| org.jetbrains                          | annotations                                 | 17.0.0                      |
| org.jodd                               | jodd-core                                   | 3.5.2                       |
| org.json                               | json                                        | 20210307                    |
| org.json4s                             | json4s-ast_2.12                             | 3.7.0-M11                   |
| org.json4s                             | json4s-core_2.12                            | 3.7.0-M11                   |
| org.json4s                             | json4s-jackson_2.12                         | 3.7.0-M11                   |
| org.json4s                             | json4s-scalap_2.12                          | 3.7.0-M11                   |
| org.junit.jupiter                      | junit-jupiter                               | 5.5.2                       |
| org.junit.jupiter                      | junit-jupiter-api                           | 5.5.2                       |
| org.junit.jupiter                      | junit-jupiter-engine                        | 5.5.2                       |
| org.junit.jupiter                      | junit-jupiter-params                        | 5.5.2                       |
| org.junit.platform                     | junit-platform-commons                      | 1.5.2                       |
| org.junit.platform                     | junit-platform-engine                       | 1.5.2                       |
| org.lz4                                | lz4-java                                    | 1.8.0                       |
| org.mlflow                             | mlfow-spark                                 | 2.1.1                       |
| org.objenesis                          | objenesis                                   | 3.2                         |
| org.openpnp                            | opencv                                      | 3.2.0-1                     |
| org.opentest4j                         | opentest4j                                  | 1.2.0                       |
| org.postgresql                         | postgresql                                  | 42.2.9                      |
| org.roaringbitmap                      | RoaringBitmap                               | 0.9.25                      |
| org.roaringbitmap                      | shims                                       | 0.9.25                      |
| org.rocksdb                            | rocksdbjni                                  | 6.20.3                      |
| org.scalactic                          | scalactic_2.12                              | 3.2.14                      |
| org.scala-lang                         | scala-compiler                              | 2.12.15                     |
| org.scala-lang                         | scala-library                               | 2.12.15                     |
| org.scala-lang                         | scala-reflect                               | 2.12.15                     |
| org.scala-lang.modules                 | scala-collection-compat_2.12                | 2.1.1                       |
| org.scala-lang.modules                 | scala-java8-compat_2.12                     | 0.9.0                       |
| org.scala-lang.modules                 | scala-parser-combinators_2.12               | 1.1.2                       |
| org.scala-lang.modules                 | scala-xml_2.12                              | 1.2.0                       |
| org.scalanlp                           | breeze-macros_2.12                          | 1.2                         |
| org.scalanlp                           | breeze_2.12                                 | 1.2                         |
| org.slf4j                              | jcl-over-slf4j                              | 1.7.32                      |
| org.slf4j                              | jul-to-slf4j                                | 1.7.32                      |
| org.slf4j                              | slf4j-api                                   | 1.7.32                      |
| org.threeten                           | threeten-extra                              | 1.5.0                       |
| org.tukaani                            | xz                                          | 1.8                         |
| org.typelevel                          | algebra_2.12                                | 2.0.1                       |
| org.typelevel                          | cats-kernel_2.12                            | 2.1.1                       |
| org.typelevel                          | spire_2.12                                  | 0.17.0                      |
| org.typelevel                          | spire-macros_2.12                           | 0.17.0                      |
| org.typelevel                          | spire-platform_2.12                         | 0.17.0                      |
| org.typelevel                          | spire-util_2.12                             | 0.17.0                      |
| org.wildfly.openssl                    | wildfly-openssl                             | 1.0.7.Final                 |
| org.xerial.snappy                      | snappy-java                                 | 1.1.8.4                     |
| oro                                    | oro                                         | 2.0.8                       |
| pl.edu.icm                             | JLargeArrays                                | 1.5                         |
| stax                                   | stax-api                                    | 1.0.1                       |

### Python libraries 
The Azure Synapse Runtime for Apache Spark 3.4 is currently in Public Preview. During this phase, the Python libraries will experience significant updates. Additionally, please note that some machine learning capabilities are not yet supported, such as the PREDICT method and Synapse ML.

### R libraries

The following table lists all the default level packages for R and their respective versions.

| Library                   | Version      | Library         | Version    | Library          | Version    |
|---------------------------|--------------|-----------------|------------|------------------|------------|
| _libgcc_mutex             | 0.1          | r-caret         | 6.0_94     | r-praise         | 1.0.0      |
| _openmp_mutex             | 4.5          | r-cellranger    | 1.1.0      | r-prettyunits    | 1.2.0      |
| _r-mutex                  | 1.0.1        | r-class         | 7.3_22     | r-proc           | 1.18.4     |
| _r-xgboost-mutex          | 2            | r-cli           | 3.6.1      | r-processx       | 3.8.2      |
| aws-c-auth                | 0.7.0        | r-clipr         | 0.8.0      | r-prodlim        | 2023.08.28 |
| aws-c-cal                 | 0.6.0        | r-clock         | 0.7.0      | r-profvis        | 0.3.8      |
| aws-c-common              | 0.8.23       | r-codetools     | 0.2_19     | r-progress       | 1.2.2      |
| aws-c-compression         | 0.2.17       | r-collections   | 0.3.7      | r-progressr      | 0.14.0     |
| aws-c-event-stream        | 0.3.1        | r-colorspace    | 2.1_0      | r-promises       | 1.2.1      |
| aws-c-http                | 0.7.10       | r-commonmark    | 1.9.0      | r-proxy          | 0.4_27     |
| aws-c-io                  | 0.13.27      | r-config        | 0.3.2      | r-pryr           | 0.1.6      |
| aws-c-mqtt                | 0.8.13       | r-conflicted    | 1.2.0      | r-ps             | 1.7.5      |
| aws-c-s3                  | 0.3.12       | r-coro          | 1.0.3      | r-purrr          | 1.0.2      |
| aws-c-sdkutils            | 0.1.11       | r-cpp11         | 0.4.6      | r-quantmod       | 0.4.25     |
| aws-checksums             | 0.1.16       | r-crayon        | 1.5.2      | r-r2d3           | 0.2.6      |
| aws-crt-cpp               | 0.20.2       | r-credentials   | 2.0.1      | r-r6             | 2.5.1      |
| aws-sdk-cpp               | 1.10.57      | r-crosstalk     | 1.2.0      | r-r6p            | 0.3.0      |
| binutils_impl_linux-64    | 2.4          | r-crul          | 1.4.0      | r-ragg           | 1.2.6      |
| bwidget                   | 1.9.14       | r-curl          | 5.1.0      | r-rappdirs       | 0.3.3      |
| bzip2                     | 1.0.8        | r-data.table    | 1.14.8     | r-rbokeh         | 0.5.2      |
| c-ares                    | 1.20.1       | r-dbi           | 1.1.3      | r-rcmdcheck      | 1.4.0      |
| ca-certificates           | 2023.7.22    | r-dbplyr        | 2.3.4      | r-rcolorbrewer   | 1.1_3      |
| cairo                     | 1.18.0       | r-desc          | 1.4.2      | r-rcpp           | 1.0.11     |
| cmake                     | 3.27.6       | r-devtools      | 2.4.5      | r-reactable      | 0.4.4      |
| curl                      | 8.4.0        | r-diagram       | 1.6.5      | r-reactr         | 0.5.0      |
| expat                     | 2.5.0        | r-dials         | 1.2.0      | r-readr          | 2.1.4      |
| font-ttf-dejavu-sans-mono | 2.37         | r-dicedesign    | 1.9        | r-readxl         | 1.4.3      |
| font-ttf-inconsolata      | 3            | r-diffobj       | 0.3.5      | r-recipes        | 1.0.8      |
| font-ttf-source-code-pro  | 2.038        | r-digest        | 0.6.33     | r-rematch        | 2.0.0      |
| font-ttf-ubuntu           | 0.83         | r-downlit       | 0.4.3      | r-rematch2       | 2.1.2      |
| fontconfig                | 2.14.2       | r-dplyr         | 1.1.3      | r-remotes        | 2.4.2.1    |
| fonts-conda-ecosystem     | 1            | r-dtplyr        | 1.3.1      | r-reprex         | 2.0.2      |
| fonts-conda-forge         | 1            | r-e1071         | 1.7_13     | r-reshape2       | 1.4.4      |
| freetype                  | 2.12.1       | r-ellipsis      | 0.3.2      | r-rjson          | 0.2.21     |
| fribidi                   | 1.0.10       | r-evaluate      | 0.23       | r-rlang          | 1.1.1      |
| gcc_impl_linux-64         | 13.2.0       | r-fansi         | 1.0.5      | r-rlist          | 0.4.6.2    |
| gettext                   | 0.21.1       | r-farver        | 2.1.1      | r-rmarkdown      | 2.22       |
| gflags                    | 2.2.2        | r-fastmap       | 1.1.1      | r-rodbc          | 1.3_20     |
| gfortran_impl_linux-64    | 13.2.0       | r-fontawesome   | 0.5.2      | r-roxygen2       | 7.2.3      |
| glog                      | 0.6.0        | r-forcats       | 1.0.0      | r-rpart          | 4.1.21     |
| glpk                      | 5            | r-foreach       | 1.5.2      | r-rprojroot      | 2.0.3      |
| gmp                       | 6.2.1        | r-forge         | 0.2.0      | r-rsample        | 1.2.0      |
| graphite2                 | 1.3.13       | r-fs            | 1.6.3      | r-rstudioapi     | 0.15.0     |
| gsl                       | 2.7          | r-furrr         | 0.3.1      | r-rversions      | 2.1.2      |
| gxx_impl_linux-64         | 13.2.0       | r-future        | 1.33.0     | r-rvest          | 1.0.3      |
| harfbuzz                  | 8.2.1        | r-future.apply  | 1.11.0     | r-sass           | 0.4.7      |
| icu                       | 73.2         | r-gargle        | 1.5.2      | r-scales         | 1.2.1      |
| kernel-headers_linux-64   | 2.6.32       | r-generics      | 0.1.3      | r-selectr        | 0.4_2      |
| keyutils                  | 1.6.1        | r-gert          | 2.0.0      | r-sessioninfo    | 1.2.2      |
| krb5                      | 1.21.2       | r-ggplot2       | 3.4.2      | r-shape          | 1.4.6      |
| ld_impl_linux-64          | 2.4          | r-gh            | 1.4.0      | r-shiny          | 1.7.5.1    |
| lerc                      | 4.0.0        | r-gistr         | 0.9.0      | r-slider         | 0.3.1      |
| libabseil                 | 20230125     | r-gitcreds      | 0.1.2      | r-sourcetools    | 0.1.7_1    |
| libarrow                  | 12.0.0       | r-globals       | 0.16.2     | r-sparklyr       | 1.8.2      |
| libblas                   | 3.9.0        | r-glue          | 1.6.2      | r-squarem        | 2021.1     |
| libbrotlicommon           | 1.0.9        | r-googledrive   | 2.1.1      | r-stringi        | 1.7.12     |
| libbrotlidec              | 1.0.9        | r-googlesheets4 | 1.1.1      | r-stringr        | 1.5.0      |
| libbrotlienc              | 1.0.9        | r-gower         | 1.0.1      | r-survival       | 3.5_7      |
| libcblas                  | 3.9.0        | r-gpfit         | 1.0_8      | r-sys            | 3.4.2      |
| libcrc32c                 | 1.1.2        | r-gt            | 0.9.0      | r-systemfonts    | 1.0.5      |
| libcurl                   | 8.4.0        | r-gtable        | 0.3.4      | r-testthat       | 3.2.0      |
| libdeflate                | 1.19         | r-gtsummary     | 1.7.2      | r-textshaping    | 0.3.7      |
| libedit                   | 3.1.20191231 | r-hardhat       | 1.3.0      | r-tibble         | 3.2.1      |
| libev                     | 4.33         | r-haven         | 2.5.3      | r-tidymodels     | 1.1.0      |
| libevent                  | 2.1.12       | r-hexbin        | 1.28.3     | r-tidyr          | 1.3.0      |
| libexpat                  | 2.5.0        | r-highcharter   | 0.9.4      | r-tidyselect     | 1.2.0      |
| libffi                    | 3.4.2        | r-highr         | 0.1        | r-tidyverse      | 2.0.0      |
| libgcc-devel_linux-64     | 13.2.0       | r-hms           | 1.1.3      | r-timechange     | 0.2.0      |
| libgcc-ng                 | 13.2.0       | r-htmltools     | 0.5.6.1    | r-timedate       | 4022.108   |
| libgfortran-ng            | 13.2.0       | r-htmlwidgets   | 1.6.2      | r-tinytex        | 0.48       |
| libgfortran5              | 13.2.0       | r-httpcode      | 0.3.0      | r-torch          | 0.11.0     |
| libgit2                   | 1.7.1        | r-httpuv        | 1.6.12     | r-triebeard      | 0.4.1      |
| libglib                   | 2.78.0       | r-httr          | 1.4.7      | r-ttr            | 0.24.3     |
| libgomp                   | 13.2.0       | r-httr2         | 0.2.3      | r-tune           | 1.1.2      |
| libgoogle-cloud           | 2.12.0       | r-ids           | 1.0.1      | r-tzdb           | 0.4.0      |
| libgrpc                   | 1.55.1       | r-igraph        | 1.5.1      | r-urlchecker     | 1.0.1      |
| libiconv                  | 1.17         | r-infer         | 1.0.5      | r-urltools       | 1.7.3      |
| libjpeg-turbo             | 3.0.0        | r-ini           | 0.3.1      | r-usethis        | 2.2.2      |
| liblapack                 | 3.9.0        | r-ipred         | 0.9_14     | r-utf8           | 1.2.4      |
| libnghttp2                | 1.55.1       | r-isoband       | 0.2.7      | r-uuid           | 1.1_1      |
| libnuma                   | 2.0.16       | r-iterators     | 1.0.14     | r-v8             | 4.4.0      |
| libopenblas               | 0.3.24       | r-jose          | 1.2.0      | r-vctrs          | 0.6.4      |
| libpng                    | 1.6.39       | r-jquerylib     | 0.1.4      | r-viridislite    | 0.4.2      |
| libprotobuf               | 4.23.2       | r-jsonlite      | 1.8.7      | r-vroom          | 1.6.4      |
| libsanitizer              | 13.2.0       | r-juicyjuice    | 0.1.0      | r-waldo          | 0.5.1      |
| libssh2                   | 1.11.0       | r-kernsmooth    | 2.23_22    | r-warp           | 0.2.0      |
| libstdcxx-devel_linux-64  | 13.2.0       | r-knitr         | 1.45       | r-whisker        | 0.4.1      |
| libstdcxx-ng              | 13.2.0       | r-labeling      | 0.4.3      | r-withr          | 2.5.2      |
| libthrift                 | 0.18.1       | r-labelled      | 2.12.0     | r-workflows      | 1.1.3      |
| libtiff                   | 4.6.0        | r-later         | 1.3.1      | r-workflowsets   | 1.0.1      |
| libutf8proc               | 2.8.0        | r-lattice       | 0.22_5     | r-xfun           | 0.41       |
| libuuid                   | 2.38.1       | r-lava          | 1.7.2.1    | r-xgboost        | 1.7.4      |
| libuv                     | 1.46.0       | r-lazyeval      | 0.2.2      | r-xml            | 3.99_0.14  |
| libv8                     | 8.9.83       | r-lhs           | 1.1.6      | r-xml2           | 1.3.5      |
| libwebp-base              | 1.3.2        | r-lifecycle     | 1.0.3      | r-xopen          | 1.0.0      |
| libxcb                    | 1.15         | r-lightgbm      | 3.3.5      | r-xtable         | 1.8_4      |
| libxgboost                | 1.7.4        | r-listenv       | 0.9.0      | r-xts            | 0.13.1     |
| libxml2                   | 2.11.5       | r-lobstr        | 1.1.2      | r-yaml           | 2.3.7      |
| libzlib                   | 1.2.13       | r-lubridate     | 1.9.3      | r-yardstick      | 1.2.0      |
| lz4-c                     | 1.9.4        | r-magrittr      | 2.0.3      | r-zip            | 2.3.0      |
| make                      | 4.3          | r-maps          | 3.4.1      | r-zoo            | 1.8_12     |
| ncurses                   | 6.4          | r-markdown      | 1.11       | rdma-core        | 28.9       |
| openssl                   | 3.1.4        | r-mass          | 7.3_60     | re2              | 2023.03.02 |
| orc                       | 1.8.4        | r-matrix        | 1.6_1.1    | readline         | 8.2        |
| pandoc                    | 2.19.2       | r-memoise       | 2.0.1      | rhash            | 1.4.4      |
| pango                     | 1.50.14      | r-mgcv          | 1.9_0      | s2n              | 1.3.46     |
| pcre2                     | 10.4         | r-mime          | 0.12       | sed              | 4.8        |
| pixman                    | 0.42.2       | r-miniui        | 0.1.1.1    | snappy           | 1.1.10     |
| pthread-stubs             | 0.4          | r-modeldata     | 1.2.0      | sysroot_linux-64 | 2.12       |
| r-arrow                   | 12.0.0       | r-modelenv      | 0.1.1      | tk               | 8.6.13     |
| r-askpass                 | 1.2.0        | r-modelmetrics  | 1.2.2.2    | tktable          | 2.1        |
| r-assertthat              | 0.2.1        | r-modelr        | 0.1.11     | ucx              | 1.14.1     |
| r-backports               | 1.4.1        | r-munsell       | 0.5.0      | unixodbc         | 2.3.12     |
| r-base                    | 4.2.3        | r-nlme          | 3.1_163    | xorg-kbproto     | 1.0.7      |
| r-base64enc               | 0.1_3        | r-nnet          | 7.3_19     | xorg-libice      | 1.1.1      |
| r-bigd                    | 0.2.0        | r-numderiv      | 2016.8_1.1 | xorg-libsm       | 1.2.4      |
| r-bit                     | 4.0.5        | r-openssl       | 2.1.1      | xorg-libx11      | 1.8.7      |
| r-bit64                   | 4.0.5        | r-parallelly    | 1.36.0     | xorg-libxau      | 1.0.11     |
| r-bitops                  | 1.0_7        | r-parsnip       | 1.1.1      | xorg-libxdmcp    | 1.1.3      |
| r-blob                    | 1.2.4        | r-patchwork     | 1.1.3      | xorg-libxext     | 1.3.4      |
| r-brew                    | 1.0_8        | r-pillar        | 1.9.0      | xorg-libxrender  | 0.9.11     |
| r-brio                    | 1.1.3        | r-pkgbuild      | 1.4.2      | xorg-libxt       | 1.3.0      |
| r-broom                   | 1.0.5        | r-pkgconfig     | 2.0.3      | xorg-renderproto | 0.11.1     |
| r-broom.helpers           | 1.14.0       | r-pkgdown       | 2.0.7      | xorg-xextproto   | 7.3.0      |
| r-bslib                   | 0.5.1        | r-pkgload       | 1.3.3      | xorg-xproto      | 7.0.31     |
| r-cachem                  | 1.0.8        | r-plotly        | 4.10.2     | xz               | 5.2.6      |
| r-callr                   | 3.7.3        | r-plyr          | 1.8.9      | zlib             | 1.2.13     |
|                           |              |                 |            | zstd             | 1.5.5      |

## Migration between Apache Spark versions - support

For guidance on migrating from older runtime versions to Azure Synapse Runtime for Apache Spark 3.4 refer to [Runtime for Apache Spark Overview](./apache-spark-version-support.md).



