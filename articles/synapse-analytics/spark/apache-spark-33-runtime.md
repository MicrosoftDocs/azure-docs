---
title: Azure Synapse Runtime for Apache Spark 3.3
description: Supported versions of Spark, Scala, Python, and .NET for Apache Spark 3.3.
author: Estera Kot
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 17/11/2022 
ms.author: eskot
ms.custom: has-adal-ref, ignite-2022
ms.reviewer: martinle
---

# Azure Synapse Runtime for Apache Spark 3.3 (Preview)
Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document will cover the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.3.  

> [!NOTE]
> Azure Synapse Runtime for Apache Spark 3.3 is currently in Public Preview. Please expect some major components versions changes as well. 

## Component versions

|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.3.1        |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282    |
| Scala | 2.12.15      |
| Hadoop | 3.3.1        |
| .NET Core | 3.1          |
| .NET | 2.0.0        |
| Delta Lake | 2.1          |
| Python | 3.8          |
| R (Preview) | 4.2.2        | 

# Libraries
The following sections presents the libraries included in Azure Synapse Runtime for Apache Spark 3.3.

## Scala and Java libraries
| **Library**                                 | **Version**                      | **Library**                         | **Version**                     | **Library**                                    | **Version**                     |
|:-------------------------------------------:|:--------------------------------:|:-----------------------------------:|:-------------------------------:|:----------------------------------------------:|:-------------------------------:|
| activation                                  | 1.1.1                         | httpclient5                         | 5.1.3                        | opentracing-api                                | 0.33.0                       |
| adal4j                                      | 1.6.3                         | httpcore                            | 4.4.14                       | opentracing-noop                               | 0.33.0                       |
| aircompressor                               | 0.21                          | httpmime                            | 4.5.13                       | opentracing-util                               | 0.33.0                       |
| algebra                                     | 2.12-2.0.1                    | hyperspace-core-spark3.2_2.12       | 0.5.1-synapse                | orc-core                                       | 1.7.6                        |
| aliyun-java-sdk-core                        | 4.5.10                        | impulse-core_spark3.2_2.12          | 1.0.4                        | orc-mapreduce                                  | 1.7.6                        |
| aliyun-java-sdk-kms                         | 2.11.0                        | impulse-telemetry-mds_spark3.2_2.12 | 1.0.4                        | orc-shims                                      | 1.7.6                        |
| aliyun-java-sdk-ram                         | 3.1.0                         | ini4j                               | 0.5.4                        | oro                                            | 2.0.8                        |
| aliyun-sdk-oss                              | 3.13.0                        | isolation-forest_3.2.0_2.12         | 2.0.8                        | osgi-resource-locator                          | 1.0.3                        |
| annotations                                 | 17.0.0                        | istack-commons-runtime              | 3.0.8                        | paranamer                                      | 2.8                          |
| antlr-runtime                               | 3.5.2                         | ivy                                 | 2.5.1                        | parquet-column                                 | 1.12.3                       |
| antlr4-runtime                              | 4.8                           | jackson-annotations                 | 2.13.4                       | parquet-common                                 | 1.12.3                       |
| aopalliance-repackaged                      | 2.6.1                         | jackson-core                        | 2.13.4                       | parquet-encoding                               | 1.12.3                       |
| arpack_combined_all                         | 0.1                           | jackson-core-asl                    | 1.9.13                       | parquet-format-structures                      | 1.12.3                       |
| arpack                                      | 2.2.1                         | jackson-databind                    | 2.13.4.1                     | parquet-hadoop                                 | 1.12.3                       |
| arrow-format                                | 7.0.0                         | jackson-dataformat-cbor             | 2.13.4                       | parquet-jackson                                | 1.12.3                       |
| arrow-memory-core                           | 7.0.0                         | jackson-mapper-asl                  | 1.9.13                       | peregrine-spark                                | 0.10.2                       |
| arrow-memory-netty                          | 7.0.0                         | jackson-module-scala_2.12           | 2.13.4                       | pickle                                         | 1.2                          |
| arrow-vector                                | 7.0.0                         | jakarta.annotation-api              | 1.3.5                        | postgresql                                     | 42.2.9                       |
| audience-annotations                        | 0.5.0                         | jakarta.inject                      | 2.6.1                        | protobuf-java                                  | 2.5.0                        |
| avro                                        | 1.11.0                        | jakarta.servlet-api                 | 4.0.3                        | proton-j                                       | 0.33.8                       |
| avro-ipc                                    | 1.11.0                        | jakarta.validation-api              | 2.0.2                        | py4j                                           | 0.10.9.5                     |
| avro-mapred                                 | 1.11.0                        | jakarta.ws.rs-api                   | 2.1.6                        | qpid-proton-j-extensions                       | 1.2.4                        |
| aws-java-sdk-bundle                         | 1.11.1026                     | jakarta.xml.bind-api                | 2.3.2                        | RoaringBitmap                                  | 0.9.25                       |
| azure-data-lake-store-sdk                   | 2.3.9                         | janino                              | 3.0.16                       | rocksdbjni                                     | 6.20.3                       |
| azure-eventhubs                             | 3.3.0                         | javassist                           | 3.25.0-GA                    | scala-collection-compat_2.12                   | 2.1.1                        |
| azure-eventhubs-spark_2.12                  | 2.3.22                        | javatuples                          | 1.2                          | scala-compiler                                 | 2.12.15                      |
| azure-keyvault-core                         | 1.0.0                         | javax.jdo                           | 3.2.0-m3                     | scala-java8                                    | compat_2.12-0.9.0            |
| azure-storage                               | 7.0.1                         | javolution                          | 5.5.1                        | scala-library                                  | 2.12.15                      |
| azure-synapse-ml-pandas                     | 2.12-0.1.1                    | jaxb-api                            | 2.2.11                       | scala-parser-combinators_2.12                  | 1.1.2                        |
| azure-synapse-ml-predict                    | 2.12-1.0                      | jaxb-runtime                        | 2.3.2                        | scala-reflect                                  | 2.12.15                      |
| blas                                        | 2.2.1                         | jcl-over-slf4j                      | 1.7.32                       | scala-xml_2.12                                 | 1.2.0                        |
| bonecp                                      | 0.8.0.RELEASE                 | jdo-api                             | 3.0.1                        | scalactic_2.12                                 | 3.0.5                        |
| breeze                                      | 2.12-1.2                      | jdom2                               | 2.0.6                        | shapeless_2.12                                 | 2.3.7                        |
| breeze-macros                               | 2.12-1.2                      | jersey-client                       | 2.36                         | shims                                          | 0.9.25                       |
| cats-kernel                                 | 2.12-2.1.1                    | jersey-common                       | 2.36                         | slf4j-api                                      | 1.7.32                       |
| chill                                       | 2.12-0.10.0                   | jersey-container-servlet            | 2.36                         | snappy-java                                    | 1.1.8.4                      |
| chill-java                                  | 0.10.0                        | jersey-container-servlet-core       | 2.36                         | spark_diagnostic_cli                           | 2.0.0_spark-3.3.0            |
| client-jar-sdk                              | 1.14.0                        | jersey-hk2                          | 2.36                         | spark-3.3-advisor-core_2.12                    | 1.0.14                       |
| cntk                                        | 2.4                           | jersey-server                       | 2.36                         | spark-3.3-rpc-history-server-app-listener_2.12 | 1.0.0                        |
| commons-cli                                 | 1.5.0                         | jettison                            | 1.1                          | spark-3.3-rpc-history-server-core_2.12         | 1.0.0                        |
| commons-codec                               | 1.15                          | jetty-util                          | 9.4.48.v20220622             | spark-avro_2.12                                | 3.3.1.5.2-76471634           |
| commons-collections                         | 3.2.2                         | jetty-util-ajax                     | 9.4.48.v20220622             | spark-catalyst_2.12                            | 3.3.1.5.2-76471634           |
| commons-collections4                        | 4.4                           | JLargeArrays                        | 1.5                          | spark-cdm-connector-assembly                   | 1.19.2                       |
| commons-compiler                            | 3.0.16                        | jline                               | 2.14.6                       | spark-core_2.12                                | 3.3.1.5.2-76471634           |
| commons-compress                            | 1.21                          | joda-time                           | 2.10.13                      | spark-enhancement_2.12                         | 3.3.1.5.2-76471634           |
| commons-crypto                              | 1.1.0                         | jodd-core                           | 3.5.2                        | spark-enhancementui_2.12                       | 3.0.0                        |
| commons-dbcp                                | 1.4                           | jpam                                | 1.1                          | spark-graphx_2.12                              | 3.3.1.5.2-76471634           |
| commons-io                                  | 2.11.0                        | jsch                                | 0.1.54                       | spark-hadoop-cloud_2.12                        | 3.3.1.5.2-76471634           |
| commons-lang                                | 2.6                           | json                                | 1.8                          | spark-hive_2.12                                | 3.3.1.5.2-76471634           |
| commons-lang3                               | 3.12.0                        | json                                | 20090211                     | spark-hive-thriftserver_2.12                   | 3.3.1.5.2-76471634           |
| commons-logging                             | 1.1.3                         | json-simple                         | 1.1                          | spark-kusto-synapse-connector_3.1_2.12         | 1.1.1                        |
| commons-math3                               | 3.6.1                         | json4s-ast_2.12                     | 3.7.0-M11                    | spark-kvstore_2.12                             | 3.3.1.5.2-76471634           |
| commons-pool                                | 1.5.4                         | json4s-core_2.12                    | 3.7.0-M11                    | spark-launcher_2.12                            | 3.3.1.5.2-76471634           |
| commons-pool2                               | 2.11.1                        | json4s-jackson_2.12                 | 3.7.0-M11                    | spark-lighter-contract_2.12                    | 2.0.0_spark-3.3.0            |
| commons-text                                | 1.10.0                        | json4s-scalap_2.12                  | 3.7.0-M11                    | spark-lighter-core_2.12                        | 2.0.0_spark-3.3.0            |
| compress-lzf                                | 1.1                           | jsr305                              | 3.0.0                        | spark-microsoft-tools_2.12                     | 3.3.1.5.2-76471634           |
| config                                      | 1.3.4                         | jta                                 | 1.1                          | spark-mllib_2.12                               | 3.3.1.5.2-76471634           |
| core                                        | 1.1.2                         | JTransforms                         | 3.1                          | spark-mllib-local_2.12                         | 3.3.1.5.2-76471634           |
| cos_api-bundle                              | 5.6.19                        | jul-to-slf4j                        | 1.7.32                       | spark-mssql-connector                          | 1.2.0                        |
| cosmos-analytics-spark-3.2.1-connector      | 1.6.3                         | kafka-clients                       | 2.8.1                        | spark-network-common_2.12                      | 3.3.1.5.2-76471634           |
| curator-client                              | 2.13.0                        | kryo-shaded                         | 4.0.2                        | spark-network-shuffle_2.12                     | 3.3.1.5.2-76471634           |
| curator-framework                           | 2.13.0                        | kusto-data                          | 2.8.2                        | spark-repl_2.12                                | 3.3.1.5.2-76471634           |
| curator-recipes                             | 2.13.0                        | kusto-ingest                        | 2.8.2                        | spark-sketch_2.12                              | 3.3.1.5.2-76471634           |
| datanucleus-api-jdo                         | 4.2.4                         | kusto-spark_synapse_3.0_2.12        | 2.9.3                        | spark-sql_2.12                                 | 3.3.1.5.2-76471634           |
| datanucleus-core                            | 4.1.17                        | lapack                              | 2.2.1                        | spark-sql-kafka-0-10_2.12                      | 3.3.1.5.2-76471634           |
| datanucleus-rdbms                           | 4.1.19                        | leveldbjni-all                      | 1.8                          | spark-streaming_2.12                           | 3.3.1.5.2-76471634           |
| delta-core_2.12                             | 2.1.0.2                       | libfb303                            | 0.9.3                        | spark-streaming-kafka-0-10_2.12                | 3.3.1.5.2-76471634           |
| delta-storage                               | 2.1.0.2                       | libshufflejni.so                    |                                 | spark-streaming-kafka-0-10-assembly_2.12       | 3.3.1.5.2-76471634           |
| derby                                       | 10.14.2.0                     | libthrift                           | 0.12.0                       | spark-tags_2.12                                | 3.3.1.5.2-76471634           |
| dropwizard-metrics-hadoop-metrics2-reporter | 0.1.2                         | libvegasjni.so                      |                                 | spark-token-provider-kafka-0-10_2.12           | 3.3.1.5.2-76471634           |
| flatbuffers-java                            | 1.12.0                        | lightgbmlib                         | 3.2.110                      | spark-unsafe_2.12                              | 3.3.1.5.2-76471634           |
| fluent-logger-jar-with-dependencies         | jdk8                          | log4j-1.2-api                       | 2.17.2                       | spark-yarn_2.12                                | 3.3.1.5.2-76471634           |
| genesis-client_2.12                         | 0.19.0-jar-with-dependencies  | log4j-api                           | 2.17.2                       | SparkCustomEvents                              | 3.2.0-1.0.5                  |
| gson                                        | 2.8.6                         | log4j-core                          | 2.17.2                       | sparknativeparquetwriter_2.12                  | 0.6.0-spark-3.3              |
| guava                                       | 14.0.1                        | log4j-slf4j-impl                    | 2.17.2                       | spire_2.12                                     | 0.17.0                       |
| hadoop-aliyun                               | 3.3.3.5.2-76471634            | lz4-java                            | 1.8.0                        | spire-macros_2.12                              | 0.17.0                       |
| hadoop-annotations                          | 3.3.3.5.2-76471634            | mdsdclientdynamic                   | 2.0                          | spire-platform_2.12                            | 0.17.0                       |
| hadoop-aws                                  | 3.3.3.5.2-76471634            | metrics-core                        | 4.2.7                        | spire-util_2.12                                | 0.17.0                       |
| hadoop-azure                                | 3.3.3.5.2-76471634            | metrics-graphite                    | 4.2.7                        | spray-json_2.12                                | 1.3.5                        |
| hadoop-azure-datalake                       | 3.3.3.5.2-76471634            | metrics-jmx                         | 4.2.7                        | sqlanalyticsconnector                          | 3.3.0-2.0.8                  |
| hadoop-client-api                           | 3.3.3.5.2-76471634            | metrics-json                        | 4.2.7                        | ST4                                            | 4.0.4                        |
| hadoop-client-runtime                       | 3.3.3.5.2-76471634            | metrics-jvm                         | 4.2.7                        | stax-api                                       | 1.0.1                        |
| hadoop-cloud-storage                        | 3.3.3.5.2-76471634            | microsoft-catalog-metastore-client  | 1.0.83                       | stream                                         | 2.9.6                        |
| hadoop-cos                                  | 3.3.3.5.2-76471634            | microsoft-log4j-etwappender         | 1.0                          | structuredstreamforspark_2.12                  | 3.2.0-2.3.0                  |
| hadoop-openstack                            | 3.3.3.5.2-76471634            | microsoft-spark                  |                                 | super-csv                                      | 2.2.0                        |
| hadoop-shaded-guava                         | 1.1.1                         | minlog                              | 1.3.0                        | synapseml_2.12                                 | 0.10.1-22-95f451ab-SNAPSHOT  |
| hadoop-yarn-server-web-proxy                | 3.3.3.5.2-76471634            | mssql-jdbc                          | 8.4.1.jre8                   | synapseml-cognitive_2.12                       | 0.10.1-22-95f451ab-SNAPSHOT  |
| hdinsight-spark-metrics                     | 3.2.0-1.0.5                   | mysql-connector-java                | 8.0.18                       | synapseml-core_2.12                            | 0.10.1-22-95f451ab-SNAPSHOT  |
| HikariCP                                    | 2.5.1                         | netty-all                           | 4.1.74.Final                 | synapseml-deep-learning_2.12                   | 0.10.1-22-95f451ab-SNAPSHOT  |
| hive-beeline                                | 2.3.9                         | netty-buffer                        | 4.1.74.Final                 | synapseml-internal_2.12                        | 0.0.0-99-bda3814c-SNAPSHOT   |
| hive-cli                                    | 2.3.9                         | netty-codec                         | 4.1.74.Final                 | synapseml-lightgbm_2.12                        | 0.10.1-22-95f451ab-SNAPSHOT  |
| hive-common                                 | 2.3.9                         | netty-common                        | 4.1.74.Final                 | synapseml-opencv_2.12                          | 0.10.1-22-95f451ab-SNAPSHOT  |
| hive-exec                                   | 2.3.9-core                    | netty-handler                       | 4.1.74.Final                 | synapseml-vw_2.12                              | 0.10.1-22-95f451ab-SNAPSHOT  |
| hive-jdbc                                   | 2.3.9                         | netty-resolver                      | 4.1.74.Final                 | synfs                                          | 3.3.0-20221106.6             |
| hive-llap-common                            | 2.3.9                         | netty-tcnative-classes              | 2.0.48.Final                 | threeten-extra                                 | 1.5.0                        |
| hive-metastore                              | 2.3.9                         | netty-transport                     | 4.1.74.Final                 | tink                                           | 1.6.1                        |
| hive-serde                                  | 2.3.9                         | netty-transport-classes-epoll       | 4.1.74.Final                 | TokenLibrary-assembly                          | 3.3.2                        |
| hive-service-rpc                            | 3.1.2                         | netty-transport-classes-kqueue      | 4.1.74.Final                 | transaction-api                                | 1.1                          |
| hive-shims-0.23                             | 2.3.9                         | netty-transport-native-epoll        | 4.1.74.Final-linux-aarch_64  | tridenttokenlibrary-assembly                   | 1.0.8                        |
| hive-shims                                  | 2.3.9                         | netty-transport-native-epoll        | 4.1.74.Final-linux-x86_64    | univocity-parsers                              | 2.9.1                        |
| hive-shims-common                           | 2.3.9                         | netty-transport-native-kqueue       | 4.1.74.Final-osx-aarch_64    | VegasConnector                                 | 1.2.02_2.12_3.2              |
| hive-shims-scheduler                        | 2.3.9                         | netty-transport-native-kqueue       | 4.1.74.Final-osx-x86_64      | velocity                                       | 1.5                          |
| hive-storage-api                            | 2.7.2                         | netty-transport-native-unix-common  | 4.1.74.Final                 | vw-jni                                         | 8.9.1                        |
| hive-vector-code-gen                        | 2.3.9                         | notebook-utils                      | 3.3.0-20221106.6             | wildfly-openssl                                | 1.0.7.Final                  |
| hk2-api                                     | 2.6.1                         | objenesis                           | 3.2                          | xbean-asm9-shaded                              | 4.20                         |
| hk2-locator                                 | 2.6.1                         | onnxruntime_gpu                     | 1.8.1                        | xz                                             | 1.8                          |
| hk2-utils                                   | 2.6.1                         | opencsv                             | 2.3                          | zookeeper                                      | 3.6.2.5.2-76471634           |
| httpclient                                  | 4.5.13                        | opencv                              | 3.2.0-1                      | zookeeper-jute                                 | 3.6.2.5.2-76471634           |
|                                             |                                  |                                     |                                 | zstd-jni                                       | 1.5.2-1                      |




## Python libraries (Normal VMs)

### Part of the runtime and supported

| Library | Version | Library | Version |
|---------|---------|---------|---------|
|         |         |         |         |
|         |         |         |         |
|         |         |         |         |

### Part of the runtime

| Library | Version | Library | Version | Library | Version |
|---------|---------|---------|---------|---------|---------|
|         |         |         |         |         |         |
|         |         |         |         |         |         |
|         |         |         |         |         |         |

## R libraries (Preview)

| Library | Version | Library | Version | Library | Version |
|---------|---------|---------|---------|---------|---------|
|         |         |         |         |         |         |
|         |         |         |         |         |         |
|         |         |         |         |         |         |


## Next steps
- [Manage libraries for Apache Spark pools in Azure Synapse Analytics](apache-spark-manage-pool-packages.md)
- [Install workspace packages wheel (Python), jar (Scala/Java), or tar.gz (R)](apache-spark-manage-workspace-packages.md)
- [Manage packages through Azure PowerShell and REST API](apache-spark-manage-packages-outside-UI.md)
- [Manage session-scoped packages](apache-spark-manage-session-packages.md)
- [Apache Spark 3.3.1 Documentation](https://spark.apache.org/docs/3.3.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)
