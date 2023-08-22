---
title: Azure Synapse Runtime for Apache Spark 3.3 
description: New runtime is GA and ready for production workloads. Spark 3.3.1, Python 3.10, Delta Lake 2.2.
author: ekote
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 11/17/2022 
ms.author: eskot
ms.custom: has-adal-ref, ignite-2022, devx-track-python
ms.reviewer: ekote
---

# Azure Synapse Runtime for Apache Spark 3.3 (GA)
Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document covers the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.3. 

## Component versions

|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.3.1        |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282    |
| Scala | 2.12.15      |
| Hadoop | 3.3.3        |
| Delta Lake | 2.2.0        |
| Python | 3.10         |
| R (Preview) | 4.2.2        |

>[!IMPORTANT]
> .NET for Apache Spark
> * The [.NET for Apache Spark](https://github.com/dotnet/spark) is an open-source project under the .NET Foundation that currently requires the .NET 3.1 library, which has reached the out-of-support status. We would like to inform users of Azure Synapse Spark of the removal of the .NET for Apache Spark library in the Azure Synapse Runtime for Apache Spark version 3.3. Users may refer to the [.NET Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) for more details on this matter.
>
> * As a result, it will no longer be possible for users to utilize Apache Spark APIs via C# and F#, or execute C# code in notebooks within Synapse or through Apache Spark Job definitions in Synapse. It is important to note that this change affects only Azure Synapse Runtime for Apache Spark 3.3 and above. 
> 
> * We will continue to support .NET for Apache Spark in all previous versions of the Azure Synapse Runtime according to [their lifecycle stages](runtime-for-apache-spark-lifecycle-and-supportability.md). However, we do not have plans to support .NET for Apache Spark in Azure Synapse Runtime for Apache Spark 3.3 and future versions. We recommend that users with existing workloads written in C# or F# migrate to Python or Scala. Users are advised to take note of this information and plan accordingly.

## Libraries
The following sections present the libraries included in Azure Synapse Runtime for Apache Spark 3.3.

### Scala and Java libraries
| Library                                         | Version                          |        Library                         | Version                         |        Library                                     | Version                               |
|-------------------------------------------------|----------------------------------|----------------------------------------|---------------------------------|----------------------------------------------------|---------------------------------------|
| activation                                      |     1.1.1                        | httpclient5                            |     5.1.3                       | opencsv                                            | 2.3                                   |
| adal4j                                          |     1.6.3                        | httpcore                               |     4.4.14                      | opencv                                             | 3.2.0-1                               |
| aircompressor                                   |     0.21                         | httpmime                               |     4.5.13                      | opentest4j                                         | 1.2.0                                 |
| algebra_2.12                                    |     2.0.1                        | impulse-core_spark3.3_2.12             |     1.0.6                       | opentracing-api                                    | 0.33.0                                |
| aliyun-java-sdk-core                            |     4.5.10                       | impulse-telemetry                      |     mds_spark3.3_2.12-1.0.6     | opentracing-noop                                   | 0.33.0                                |
| aliyun-java-sdk-kms                             |     2.11.0                       | ini4j                                  |     0.5.4                       | opentracing-util                                   | 0.33.0                                |
| aliyun-java-sdk-ram                             |     3.1.0                        | isolation                              |     forest_3.2.0_2.12-2.0.8     | orc-core                                           | 1.7.6                                 |
| aliyun-sdk-oss                                  |     3.13.0                       | istack-commons-runtime                 |     3.0.8                       | orc-mapreduce                                      | 1.7.6                                 |
| annotations                                     |     17.0.0                       | ivy                                    |     2.5.1                       | orc-shims                                          | 1.7.6                                 |
| antlr-runtime                                   |     3.5.2                        | jackson-annotations                    |     2.13.4                      | oro                                                | 2.0.8                                 |
| antlr4-runtime                                  |     4.8                          | jackson-core                           |     2.13.4                      | osgi-resource-locator                              | 1.0.3                                 |
| aopalliance-repackaged                          |     2.6.1                        | jackson-core-asl                       |     1.9.13                      | paranamer                                          | 2.8                                   |
| apiguardian-api                                 |     1.1.0                        | jackson-databind                       |     2.13.4.1                    | parquet-column                                     | 1.12.3                                |
| arpack                                          |     2.2.1                        | jackson-dataformat-cbor                |     2.13.4                      | parquet-common                                     | 1.12.3                                |
| arpack_combined_all                             |     0.1                          | jackson-mapper-asl                     |     1.9.13                      | parquet-encoding                                   | 1.12.3                                |
| arrow-format                                    |     7.0.0                        | jackson-module-scala_2.12              |     2.13.4                      | parquet-format-structures                          | 1.12.3                                |
| arrow-memory-core                               |     7.0.0                        | jakarta.annotation-api                 |     1.3.5                       | parquet-hadoop                                     | 1.12.3                                |
| arrow-memory-netty                              |     7.0.0                        | jakarta.inject                         |     2.6.1                       | parquet-jackson                                    | 1.12.3                                |
| arrow-vector                                    |     7.0.0                        | jakarta.servlet-api                    |     4.0.3                       | peregrine-spark_3.3.0                              | 0.10.3                                |
| audience-annotations                            |     0.5.0                        | jakarta.validation-api                 |     2.0.2                       | pickle                                             | 1.2                                   |
| autotune-client_2.12                            |     1.0.0-3.3                    | jakarta.ws.rs-api                      |     2.1.6                       | postgresql                                         | 42.2.9                                |
| autotune-common_2.12                            |     1.0.0-3.3                    | jakarta.xml.bind-api                   |     2.3.2                       | protobuf-java                                      | 2.5.0                                 |
| avro                                            |     1.11.0                       | janino                                 |     3.0.16                      | proton-j                                           | 0.33.8                                |
| avro-ipc                                        |     1.11.0                       | javassist                              |     3.25.0-GA                   | py4j                                               | 0.10.9.5                              |
| avro-mapred                                     |     1.11.0                       | javatuples                             |     1.2                         | qpid-proton-j-extensions                           | 1.2.4                                 |
| aws-java-sdk-bundle                             |     1.11.1026                    | javax.jdo                              |     3.2.0-m3                    | RoaringBitmap                                      | 0.9.25                                |
| azure-data-lake-store-sdk                       |     2.3.9                        | javolution                             |     5.5.1                       | rocksdbjni                                         | 6.20.3                                |
| azure-eventhubs                                 |     3.3.0                        | jaxb-api                               |     2.2.11                      | scala-collection-compat_2.12                       | 2.1.1                                 |
| azure-eventhubs                                 |     spark_2.12-2.3.22            | jaxb-runtime                           |     2.3.2                       | scala-compiler                                     | 2.12.15                               |
| azure-keyvault-core                             |     1.0.0                        | jcl-over-slf4j                         |     1.7.32                      | scala-java8-compat_2.12                            | 0.9.0                                 |
| azure-storage                                   |     7.0.1                        | jdo-api                                |     3.0.1                       | scala-library                                      | 2.12.15                               |
| azure-synapse-ml-pandas_2.12                    |     0.1.1                        | jdom2                                  |     2.0.6                       | scala-parser-combinators_2.12                      | 1.1.2                                 |
| azure-synapse-ml-predict_2.12                   |     1.0                          | jersey-client                          |     2.36                        | scala-reflect                                      | 2.12.15                               |
| blas                                            |     2.2.1                        | jersey-common                          |     2.36                        | scala-xml_2.12                                     | 1.2.0                                 |
| bonecp                                          |     0.8.0.RELEASE                | jersey-container-servlet               |     2.36                        | scalactic_2.12                                     | 3.2.14                                |
| breeze_2.12                                     |     1.2                          | jersey-container-servlet-core          |     2.36                        | shapeless_2.12                                     | 2.3.7                                 |
| breeze-macros_2.12                              |     1.2                          | jersey-hk2                             |     2.36                        | shims                                              | 0.9.25                                |
| cats-kernel_2.12                                |     2.1.1                        | jersey-server                          |     2.36                        | slf4j-api                                          | 1.7.32                                |
| chill_2.12                                      |     0.10.0                       | jettison                               |     1.1                         | snappy-java                                        | 1.1.8.4                               |
| chill-java                                      |     0.10.0                       | jetty-util                             |     9.4.48.v20220622            | spark_diagnostic_cli                               | 2.0.1_spark-3.3.0                     |
| client-jar-sdk                                  |     1.14.0                       | jetty-util-ajax                        |     9.4.48.v20220622            | spark-3.3-advisor-core_2.12                        | 1.0.14                                |
| cntk                                            |     2.4                          | JLargeArrays                           |     1.5                         | spark-3.3-rpc-history-server-app-listener_2.12     | 1.0.0                                 |
| commons                                         |     compiler-3.0.16              | jline                                  |     2.14.6                      | spark-3.3-rpc-history-server-core_2.12             | 1.0.0                                 |
| commons-cli                                     |     1.5.0                        | joda-time                              |     2.10.13                     | spark-avro_2.12                                    | 3.3.1.5.2-82353445                    |
| commons-codec                                   |     1.15                         | jodd-core                              |     3.5.2                       | spark-catalyst_2.12                                | 3.3.1.5.2-82353445                    |
| commons-collections                             |     3.2.2                        | jpam                                   |     1.1                         | spark-cdm-connector-assembly-spark3.3              | 1.19.4                                |
| commons-collections4                            |     4.4                          | jsch                                   |     0.1.54                      | spark-core_2.12                                    | 3.3.1.5.2-82353445                    |
| commons-compress                                |     1.21                         | json                                   |     1.8                         | spark-enhancement_2.12                             | 3.3.1.5.2-82353445                    |
| commons-crypto                                  |     1.1.0                        | json                                   | 20090211                        | spark-enhancementui_2.12                           | 3.0.0                                 |
| commons-dbcp                                    |     1.4                          | json                                   | 20210307                        | spark-graphx_2.12                                  | 3.3.1.5.2-82353445                    |
| commons-io                                      |     2.11.0                       | json                                   |     simple-1.1.1                | spark-hadoop-cloud_2.12                            | 3.3.1.5.2-82353445                    |
| commons-lang                                    |     2.6                          | json                                   |     simple-1.1                  | spark-hive_2.12                                    | 3.3.1.5.2-82353445                    |
| commons-lang3                                   |     3.12.0                       | json4s-ast_2.12                        |     3.7.0-M11                   | spark-hive-thriftserver_2.12                       | 3.3.1.5.2-82353445                    |
| commons-logging                                 |     1.1.3                        | json4s-core_2.12                       |     3.7.0-M11                   | spark-kusto-synapse-connector_3.1_2.12             | 1.1.1                                 |
| commons-math3                                   |     3.6.1                        | json4s-jackson_2.12                    |     3.7.0-M11                   | spark-kvstore_2.12                                 | 3.3.1.5.2-82353445                    |
| commons-pool                                    |     1.5.4                        | json4s-scalap_2.12                     |     3.7.0-M11                   | spark-launcher_2.12                                | 3.3.1.5.2-82353445                    |
| commons-pool2                                   |     2.11.1                       | jsr305                                 |     3.0.0                       | spark-lighter-contract_2.12                        | 2.0.0_spark-3.3.0                     |
| commons-text                                    |     1.10.0                       | jta                                    |     1.1                         | spark-lighter-core_2.12                            | 2.0.0_spark-3.3.0                     |
| compress-lzf                                    |     1.1                          | JTransforms                            |     3.1                         | spark-microsoft-tools_2.12                         | 3.3.1.5.2-82353445                    |
| config                                          |     1.3.4                        | jul-to-slf4j                           |     1.7.32                      | spark-mllib_2.12                                   | 3.3.1.5.2-82353445                    |
| core                                            |     1.1.2                        | junit-jupiter                          |     5.5.2                       | spark-mllib-local_2.12                             | 3.3.1.5.2-82353445                    |
| cos_api-bundle                                  |     5.6.19                       | junit-jupiter-api                      |     5.5.2                       | spark-mssql-connector                              | 1.2.0 - Removed                                |
| cosmos-analytics-spark-3.3.0-connector          |     1.6.4                        | junit-jupiter-engine                   |     5.5.2                       | spark-network-common_2.12                          | 3.3.1.5.2-82353445                    |
| curator-client                                  |     2.13.0                       | junit-jupiter-params                   |     5.5.2                       | spark-network-shuffle_2.12                         | 3.3.1.5.2-82353445                    |
| curator-framework                               |     2.13.0                       | junit-platform-commons                 |     1.5.2                       | spark-repl_2.12                                    | 3.3.1.5.2-82353445                    |
| curator-recipes                                 |     2.13.0                       | junit-platform-engine                  |     1.5.2                       | spark-sketch_2.12                                  | 3.3.1.5.2-82353445                    |
| datanucleus-api-jdo                             |     4.2.4                        | kafka-clients                          |     2.8.1                       | spark-sql_2.12                                     | 3.3.1.5.2-82353445                    |
| datanucleus-core                                |     4.1.17                       | kryo-shaded                            |     4.0.2                       | spark-sql-kafka                                    | 0-10_2.12-3.3.1.5.2-82353445          |
| datanucleus-rdbms                               |     4.1.19                       | kusto-data                             |     2.8.2                       | spark-streaming_2.12                               | 3.3.1.5.2-82353445                    |
| delta-core_2.12                                 |     2.2.0.1                      | kusto-ingest                           |     2.8.2                       | spark-streaming-kafka                              | 0-10-assembly_2.12-3.3.1.5.2-82353445 |
| delta-iceberg_2.12                              |     2.2.0.1                      | kusto-spark_synapse_3.0_2.12           |     2.9.3                       | spark-streaming-kafka                              | 0-10_2.12-3.3.1.5.2-82353445          |
| delta-storage                                   |     2.2.0.1                      | lapack                                 |     2.2.1                       | spark-tags_2.12                                    | 3.3.1.5.2-82353445                    |
| derby                                           |     10.14.2.0                    | leveldbjni-all                         |     1.8                         | spark-token-provider-kafka                         | 0-10_2.12-3.3.1.5.2-82353445          |
| dropwizard-metrics-hadoop-metrics2-reporter     |     0.1.2                        | libfb303                               |     0.9.3                       | spark-unsafe_2.12                                  | 3.3.1.5.2-82353445                    |
| flatbuffers-java                                |     1.12.0                       | libshufflejni.so N/A                   |                                 | spark-yarn_2.12                                    | 3.3.1.5.2-82353445                    |
| fluent-logger-jar-with-dependencies             |     jdk8                         | libthrift                              |     0.12.0                      | SparkCustomEvents                                  | 3.2.0-1.0.5                           |
| genesis-client_2.12                             |     0.21.0-jar-with-dependencies | libvegasjni.so                         |                                 | sparknativeparquetwriter_2.12                      | 0.6.0-spark-3.3                       |
| gson                                            |     2.8.6                        | lightgbmlib                            |     3.2.110                     | spire_2.12                                         | 0.17.0                                |
| guava                                           |     14.0.1                       | log4j-1.2-api                          |     2.17.2                      | spire-macros_2.12                                  | 0.17.0                                |
| hadoop-aliyun                                   |     3.3.3.5.2-82353445           | log4j-api                              |     2.17.2                      | spire-platform_2.12                                | 0.17.0                                |
| hadoop-annotations                              |     3.3.3.5.2-82353445           | log4j-core                             |     2.17.2                      | spire-util_2.12                                    | 0.17.0                                |
| hadoop-aws                                      |     3.3.3.5.2-82353445           | log4j-slf4j-impl                       |     2.17.2                      | spray-json_2.12                                    | 1.3.5                                 |
| hadoop-azure                                    |     3.3.3.5.2-82353445           | lz4-java                               |     1.8.0                       | sqlanalyticsconnector                              | 3.3.0-2.0.8                           |
| hadoop-azure-datalake                           |     3.3.3.5.2-82353445           | mdsdclientdynamic                      |     2.0                         | ST4                                                | 4.0.4                                 |
| hadoop-azure-trident                            |     1.0.8                        | metrics-core                           |     4.2.7                       | stax-api                                           | 1.0.1                                 |
| hadoop-client-api                               |     3.3.3.5.2-82353445           | metrics-graphite                       |     4.2.7                       | stream                                             | 2.9.6                                 |
| hadoop-client-runtime                           |     3.3.3.5.2-82353445           | metrics-jmx                            |     4.2.7                       | structuredstreamforspark_2.12                      | 3.2.0-2.3.0                           |
| hadoop-cloud-storage                            |     3.3.3.5.2-82353445           | metrics-json                           |     4.2.7                       | super-csv                                          | 2.2.0                                 |
| hadoop-cos                                      |     3.3.3.5.2-82353445           | metrics-jvm                            |     4.2.7                       | synapseml_2.12                                     | 0.10.1-69-84f5b579-SNAPSHOT           |
| hadoop-openstack                                |     3.3.3.5.2-82353445           | microsoft-catalog-metastore-client     |     1.1.2                       | synapseml-cognitive_2.12                           | 0.10.1-69-84f5b579-SNAPSHOT           |
| hadoop-shaded-guava                             |     1.1.1                        | microsoft-log4j-etwappender            |     1.0                         | synapseml-core_2.12                                | 0.10.1-69-84f5b579-SNAPSHOT           |
| hadoop-yarn-server-web-proxy                    |     3.3.3.5.2-82353445           | minlog                                 |     1.3.0                       | synapseml-deep-learning_2.12                       | 0.10.1-69-84f5b579-SNAPSHOT           |
| hdinsight-spark-metrics                         |     3.2.0-1.0.5                  | mssql-jdbc                             |     8.4.1.jre8                  | synapseml-internal_2.12                            | 0.0.0-105-28644623-SNAPSHOT           |
| HikariCP                                        |     2.5.1                        | mysql-connector-java                   |     8.0.18                      | synapseml-lightgbm_2.12                            | 0.10.1-69-84f5b579-SNAPSHOT           |
| hive-beeline                                    |     2.3.9                        | netty-all                              |     4.1.74.Final                | synapseml-opencv_2.12                              | 0.10.1-69-84f5b579-SNAPSHOT           |
| hive-cli                                        |     2.3.9                        | netty-buffer                           |     4.1.74.Final                | synapseml-vw_2.12                                  | 0.10.1-69-84f5b579-SNAPSHOT           |
| hive-common                                     |     2.3.9                        | netty-codec                            |     4.1.74.Final                | synfs                                              | 3.3.0-20230110.6                      |
| hive-exec                                       |     2.3.9-core                   | netty-common                           |     4.1.74.Final                | threeten-extra                                     | 1.5.0                                 |
| hive-jdbc                                       |     2.3.9                        | netty-handler                          |     4.1.74.Final                | tink                                               | 1.6.1                                 |
| hive-llap-common                                |     2.3.9                        | netty-resolver                         |     4.1.74.Final                | TokenLibrary                                       | assembly-3.4.1                        |
| hive-metastore                                  |     2.3.9                        | netty-tcnative-classes                 |     2.0.48.Final                | transaction-api                                    | 1.1                                   |
| hive-serde                                      |     2.3.9                        | netty-transport                        |     4.1.74.Final                | trident-core                                       | 1.1.16                                |
| hive-service-rpc                                |     3.1.2                        | netty-transport-classes-epoll          |     4.1.74.Final                | tridenttokenlibrary-assembly                       | 1.2.3                                 |
| hive-shims                                      |     0.23-2.3.9                   | netty-transport-classes-kqueue         |     4.1.74.Final                | univocity-parsers                                  | 2.9.1                                 |
| hive-shims                                      |     2.3.9                        | netty-transport-native-epoll           |     4.1.74.Final-linux-aarch_64 | VegasConnector                                     | 1.2.02_2.12_3.2                       |
| hive-shims-common                               |     2.3.9                        | netty-transport-native-epoll           |     4.1.74.Final-linux-x86_64   | velocity                                           | 1.5                                   |
| hive-shims-scheduler                            |     2.3.9                        | netty-transport-native-kqueue          |     4.1.74.Final-osx-aarch_64   | vw-jni                                             | 8.9.1                                 |
| hive-storage-api                                |     2.7.2                        | netty-transport-native-kqueue          |     4.1.74.Final-osx-x86_64     | wildfly-openssl                                    | 1.0.7.Final                           |
| hive-vector-code-gen                            |     2.3.9                        | netty-transport-native-unix-common     |     4.1.74.Final                | xbean-asm9-shaded                                  | 4.20                                  |
| hk2-api                                         |     2.6.1                        | notebook-utils-3.3.0                   |     20230110.6                  | xz                                                 | 1.8                                   |
| hk2-locator                                     |     2.6.1                        | objenesis                              |     3.2                         | zookeeper                                          | 3.6.2.5.2-82353445                    |
| hk2-utils                                       |     2.6.1                        | onnx-protobuf_2.12                     |     0.9.1-assembly              | zookeeper-jute                                     | 3.6.2.5.2-82353445                    |
| httpclient                                      |     4.5.13                       | onnxruntime_gpu                        |     1.8.1                       | zstd-jni                                           | 1.5.2-1                               |

### Python libraries (Normal VMs)
| Library                            | Version                           |        Library            | Version                         |        Library                    | Version                         |
|------------------------------------|-----------------------------------|---------------------------|---------------------------------|-----------------------------------|---------------------------------|
| _libgcc_mutex                      |     0.1=conda_forge               | hdf5                      |     1.12.2=nompi_h2386368_100   | parquet-cpp                       |     g1.5.1=2                    |
| _openmp_mutex                      |     4.5=2_kmp_llvm                | html5lib                  |     1.1=pyh9f0ad1d_0            | parso                             |     g0.8.3=pyhd8ed1ab_0         |
| _py-xgboost-mutex                  |     2.0=cpu_0                     | humanfriendly             |     10.0=py310hff52083_4        | partd                             |     g1.3.0=pyhd8ed1ab_0         |
| _tflow_select                      |     2.3.0=mkl                     | hummingbird-ml            |     0.4.0=pyhd8ed1ab_0          | pathos                            |     g0.3.0=pyhd8ed1ab_0         |
| absl-py                            |     1.3.0=pyhd8ed1ab_0            | icu                       |     58.2=hf484d3e_1000          | pathspec                          |     0.10.1                      |
| adal                               |     1.2.7=pyhd8ed1ab_0            | idna                      |     3.4=pyhd8ed1ab_0            | patsy                             |     g0.5.3=pyhd8ed1ab_0         |
| adlfs                              |     0.7.7=pyhd8ed1ab_0            | imagecodecs               |     2022.9.26=py310h90cd304_3   | pcre2                             |     g10.40=hc3806b6_0           |
| aiohttp                            |     3.8.3=py310h5764c6d_1         | imageio                   |     2.9.0=py_0                  | pexpect                           |     g4.8.0=pyh1a96a4e_2         |
| aiosignal                          |     1.3.1=pyhd8ed1ab_0            | importlib-metadata        |     5.0.0=pyha770c72_1          | pickleshare                       |     g0.7.5=py_1003              |
| anyio                              |     3.6.2                         | interpret                 |     0.2.4=py37_0                | pillow                            |     g9.2.0=py310h454ad03_3      |
| aom                                |     3.5.0=h27087fc_0              | interpret-core            |     0.2.4=py37h21ff451_0        | pip                               |     g22.3.1=pyhd8ed1ab_0        |
| applicationinsights                |     0.11.10                       | ipykernel                 |     6.17.0=pyh210e3f2_0         | pkginfo                           |     1.8.3                       |
| argcomplete                        |     2.0.0                         | ipython                   |     8.6.0=pyh41d4057_1          | platformdirs                      |     2.5.3                       |
| argon2-cffi                        |     21.3.0                        | ipython-genutils          |     0.2.0                       | plotly                            |     g4.14.3=pyh44b312d_0        |
| argon2-cffi-bindings               |     21.2.0                        | ipywidgets                |     7.7.0                       | pmdarima                          |     g2.0.1=py310h5764c6d_0      |
| arrow-cpp                          |     9.0.0=py310he7aa4d3_2_cpu     | isodate                   |     0.6.0=py_1                  | portalocker                       |     g2.6.0=py310hff52083_1      |
| asttokens                          |     2.1.0=pyhd8ed1ab_0            | itsdangerous              |     2.1.2=pyhd8ed1ab_0          | pox                               |     g0.3.2=pyhd8ed1ab_0         |
| astunparse                         |     1.6.3=pyhd8ed1ab_0            | jdcal                     |     1.4.1=py_0                  | ppft                              |     g1.7.6.6=pyhd8ed1ab_0       |
| async-timeout                      |     4.0.2=pyhd8ed1ab_0            | jedi                      |     0.18.1=pyhd8ed1ab_2         | prettytable                       |     3.2.0                       |
| attrs                              |     22.1.0=pyh71513ae_1           | jeepney                   |     0.8.0                       | prometheus-client                 |     0.15.0                      |
| aws-c-cal                          |     0.5.11=h95a6274_0             | jinja2                    |     3.1.2=pyhd8ed1ab_1          | prompt-toolkit                    |     g3.0.32=pyha770c72_0        |
| aws-c-common                       |     0.6.2=h7f98852_0              | jmespath                  |     1.0.1                       | protobuf                          |     g3.20.1=py310hd8f1fbe_0     |
| aws-c-event-stream                 |     0.2.7=h3541f99_13             | joblib                    |     1.2.0=pyhd8ed1ab_0          | psutil                            |     g5.9.4=py310h5764c6d_0      |
| aws-c-io                           |     0.10.5=hfb6a706_0             | jpeg                      |     9e=h166bdaf_2               | pthread-stubs                     |     g0.4=h36c2ea0_1001          |
| aws-checksums                      |     0.1.11=ha31a3da_7             | jsonpickle                |     2.2.0                       | ptyprocess                        |     g0.7.0=pyhd3deb0d_0         |
| aws-sdk-cpp                        |     1.8.186=hecaee15_4            | jsonschema                |     4.17.0                      | pure_eval                         |     g0.2.2=pyhd8ed1ab_0         |
| azure-common                       |     1.1.28                        | jupyter_client            |     7.4.4=pyhd8ed1ab_0          | py-xgboost                        |     g1.7.1=cpu_py310hd1aba9c_0  |
| azure-core                         |     1.26.1=pyhd8ed1ab_0           | jupyter_core              |     4.11.2=py310hff52083_0      | py4j                              |     g0.10.9.5=pyhd8ed1ab_0      |
| azure-datalake-store               |     0.0.51=pyh9f0ad1d_0           | jupyter-server            |     1.23.0                      | pyarrow                           |     g9.0.0=py310h9be7b57_2_cpu  |
| azure-graphrbac                    |     0.61.1                        | jupyterlab-pygments       |     0.2.2                       | pyasn1                            |     g0.4.8=py_0                 |
| azure-identity                     |     1.7.0                         | jupyterlab-widgets        |     3.0.3                       | pyasn1-modules                    |     g0.2.7=py_0                 |
| azure-mgmt-authorization           |     2.0.0                         | jxrlib                    |     1.1=h7f98852_2              | pycosat                           |     g0.6.4=py310h5764c6d_1      |
| azure-mgmt-containerregistry       |     10.0.0                        | keras                     |     2.8.0                       | pycparser                         |     g2.21=pyhd8ed1ab_0          |
| azure-mgmt-core                    |     1.3.2                         | keras-applications        |     1.0.8                       | pygments                          |     g2.13.0=pyhd8ed1ab_0        |
| azure-mgmt-keyvault                |     10.1.0                        | keras-preprocessing       |     1.1.2                       | pyjwt                             |     g2.6.0=pyhd8ed1ab_0         |
| azure-mgmt-resource                |     21.2.1                        | keras2onnx                |     1.6.5=pyhd8ed1ab_0          | pynacl                            |     1.5.0                       |
| azure-mgmt-storage                 |     20.1.0                        | keyutils                  |     1.6.1=h166bdaf_0            | pyodbc                            |     g4.0.34=py310hd8f1fbe_1     |
| azure-storage-blob                 |     12.13.0                       | kiwisolver                |     1.4.4=py310hbf28c38_1       | pyopenssl                         |     g22.1.0=pyhd8ed1ab_0        |
| azureml-core                       |     1.47.0                        | knack                     |     0.10.0                      | pyparsing                         |     g3.0.9=pyhd8ed1ab_0         |
| azureml-dataprep                   |     4.5.7                         | kqlmagiccustom            |     0.1.114.post16              | pyperclip                         |     1.8.2                       |
| azureml-dataprep-native            |     38.0.0                        | krb5                      |     1.19.3=h3790be6_0           | pyqt                              |     g5.9.2=py310h295c915_6      |
| azureml-dataprep-rslex             |     2.11.4                        | lcms2                     |     2.14=h6ed2654_0             | pyrsistent                        |     0.19.2                      |
| azureml-dataset-runtime            |     1.47.0                        | ld_impl_linux-64          |     2.39=hc81fddc_0             | pysocks                           |     g1.7.1=pyha2e5f31_6         |
| azureml-mlflow                     |     1.47.0                        | lerc                      |     4.0.0=h27087fc_0            | pyspark                           |     g3.3.1=pyhd8ed1ab_0         |
| azureml-opendatasets               |     1.47.0                        | liac-arff                 |     2.5.0=pyhd8ed1ab_1          | python                            |     g3.10.6=h582c2e5_0_cpython  |
| azureml-telemetry                  |     1.47.0                        | libabseil                 |     20220623.0=cxx17_h48a1fff_5 | python_abi                        |     g3.10=2_cp310               |
| backcall                           |     0.2.0=pyh9f0ad1d_0            | libaec                    |     1.0.6=h9c3ff4c_0            | python-dateutil                   |     g2.8.2=pyhd8ed1ab_0         |
| backports                          |     1.0=py_2                      | libavif                   |     0.11.1=h5cdd6b5_0           | python-flatbuffers                |     g2.0=pyhd8ed1ab_0           |
| backports-tempfile                 |     1.0                           | libblas                   |     3.9.0=16_linux64_mkl        | pytorch                           |     g1.13.0=py3.10_cpu_0        |
| backports-weakref                  |     1.0.post1                     | libbrotlicommon           |     1.0.9=h166bdaf_8            | pytorch-mutex                     |     g1.0=cpu                    |
| backports.functools_lru_cache      |     1.6.4=pyhd8ed1ab_0            | libbrotlidec              |     1.0.9=h166bdaf_8            | pytz                              |     g2022.6=pyhd8ed1ab_0        |
| bcrypt                             |     4.0.1                         | libbrotlienc              |     1.0.9=h166bdaf_8            | pyu2f                             |     g0.1.5=pyhd8ed1ab_0         |
| beautifulsoup4                     |     4.9.3=pyhb0f4dca_0            | libcblas                  |     3.9.0=16_linux64_mkl        | pywavelets                        |     g1.3.0=py310hde88566_2      |
| blas                               |     2.116=mkl                     | libclang                  |     14.0.6                      | pyyaml                            |     g6.0=py310h5764c6d_5        |
| blas-devel                         |     3.9.0=16_linux64_mkl          | libcrc32c                 |     1.1.2=h9c3ff4c_0            | pyzmq                             |     g24.0.1=py310h330234f_1     |
| bleach                             |     5.0.1                         | libcurl                   |     7.86.0=h7bff187_1           | qt                                |     g5.9.7=h5867ecd_1           |
| blinker                            |     1.5=pyhd8ed1ab_0              | libdeflate                |     1.14=h166bdaf_0             | re2                               |     g2022.06.01=h27087fc_0      |
| blosc                              |     1.21.1=h83bc5f7_3             | libedit                   |     3.1.20191231=he28a2e2_2     | readline                          |     g8.1.2=h0f457ee_0           |
| bokeh                              |     3.0.1=pyhd8ed1ab_0            | libev                     |     4.33=h516909a_1             | regex                             |     g2022.10.31=py310h5764c6d_0 |
| brotli                             |     1.0.9=h166bdaf_8              | libevent                  |     2.1.10=h9b69904_4           | requests                          |     g2.28.1=pyhd8ed1ab_1        |
| brotli-bin                         |     1.0.9=h166bdaf_8              | libffi                    |     3.4.2=h7f98852_5            | requests-oauthlib                 |     g1.3.1=pyhd8ed1ab_0         |
| brotli-python                      |     1.0.9=py310hd8f1fbe_8         | libgcc-ng                 |     12.2.0=h65d4601_19          | retrying                          |     g1.3.3=py_2                 |
| brotlipy                           |     0.7.0=py310h5764c6d_1005      | libgfortran-ng            |     12.2.0=h69a702a_19          | rsa                               |     g4.9=pyhd8ed1ab_0           |
| brunsli                            |     0.1=h9c3ff4c_0                | libgfortran5              |     12.2.0=h337968e_19          | ruamel_yaml                       |     g0.15.80=py310h5764c6d_1008 |
| bzip2                              |     1.0.8=h7f98852_4              | libglib                   |     2.74.1=h606061b_1           | ruamel-yaml                       |     0.17.4                      |
| c-ares                             |     1.18.1=h7f98852_0             | libgoogle-cloud           |     2.1.0=hf2e47f9_1            | ruamel-yaml-clib                  |     0.2.6                       |
| c-blosc2                           |     2.4.3=h7a311fb_0              | libiconv                  |     1.17=h166bdaf_0             | s2n                               |     g1.0.10=h9b69904_0          |
| ca-certificates                    |     2022.9.24=ha878542_0          | liblapack                 |     3.9.0=16_linux64_mkl        | salib                             |     g1.4.6.1=pyhd8ed1ab_0       |
| cached_property                    |     1.5.2=pyha770c72_1            | liblapacke                |     3.9.0=16_linux64_mkl        | scikit-image                      |     g0.19.3=py310h769672d_2     |
| cached-property                    |     1.5.2=hd8ed1ab_1              | libllvm11                 |     11.1.0=he0ac6c6_5           | scikit-learn                      |     g1.1.3=py310h0c3af53_1      |
| cachetools                         |     5.2.0=pyhd8ed1ab_0            | libnghttp2                |     1.47.0=hdcd2b5c_1           | scipy                             |     g1.9.3=py310hdfbd76f_2      |
| certifi                            |     2022.9.24=pyhd8ed1ab_0        | libnsl                    |     2.0.0=h7f98852_0            | seaborn                           |     g0.11.1=hd8ed1ab_1          |
| cffi                               |     1.15.1=py310h255011f_2        | libpng                    |     1.6.38=h753d276_0           | seaborn-base                      |     g0.11.1=pyhd8ed1ab_1        |
| cfitsio                            |     4.1.0=hd9d235c_0              | libprotobuf               |     3.20.1=h6239696_4           | secretstorage                     |     3.3.3                       |
| charls                             |     2.3.4=h9c3ff4c_0              | libsodium                 |     1.0.18=h36c2ea0_1           | send2trash                        |     1.8.0                       |
| charset-normalizer                 |     2.1.1=pyhd8ed1ab_0            | libsqlite                 |     3.39.4=h753d276_0           | setuptools                        |     g65.5.1=pyhd8ed1ab_0        |
| click                              |     8.1.3=unix_pyhd8ed1ab_2       | libssh2                   |     1.10.0=haa6b8db_3           | shap                              |     g0.39.0=py310hb5077e9_1     |
| cloudpickle                        |     2.2.0=pyhd8ed1ab_0            | libstdcxx-ng              |     12.2.0=h46fd767_19          | sip                               |     g4.19.13=py310h295c915_0    |
| colorama                           |     0.4.6=pyhd8ed1ab_0            | libthrift                 |     0.16.0=h491838f_2           | six                               |     g1.16.0=pyh6c4a22f_0        |
| coloredlogs                        |     15.0.1=pyhd8ed1ab_3           | libtiff                   |     4.4.0=h55922b4_4            | skl2onnx                          |     g1.8.0.1=pyhd8ed1ab_1       |
| conda-package-handling             |     1.9.0=py310h5764c6d_1         | libutf8proc               |     2.8.0=h166bdaf_0            | sklearn-pandas                    |     g2.2.0=pyhd8ed1ab_0         |
| configparser                       |     5.3.0=pyhd8ed1ab_0            | libuuid                   |     2.32.1=h7f98852_1000        | slicer                            |     g0.0.7=pyhd8ed1ab_0         |
| contextlib2                        |     21.6.0                        | libuv                     |     1.44.2=h166bdaf_0           | smart_open                        |     g6.2.0=pyha770c72_0         |
| contourpy                          |     1.0.6=py310hbf28c38_0         | libwebp-base              |     1.2.4=h166bdaf_0            | smmap                             |     g3.0.5=pyh44b312d_0         |
| cryptography                       |     38.0.3=py310h597c629_0        | libxcb                    |     1.13=h7f98852_1004          | snappy                            |     g1.1.9=hbd366e4_2           |
| cycler                             |     0.11.0=pyhd8ed1ab_0           | libxgboost                |     1.7.1=cpu_ha3b9936_0        | sniffio                           |     1.3.0                       |
| cython                             |     0.29.32=py310hd8f1fbe_1       | libxml2                   |     2.9.9=h13577e0_2            | soupsieve                         |     g2.3.2.post1=pyhd8ed1ab_0   |
| cytoolz                            |     0.12.0=py310h5764c6d_1        | libzlib                   |     1.2.13=h166bdaf_4           | sqlalchemy                        |     1.4.43                      |
| dash                               |     1.21.0=pyhd8ed1ab_0           | libzopfli                 |     1.0.3=h9c3ff4c_0            | sqlite                            |     g3.39.4=h4ff8645_0          |
| dash_cytoscape                     |     0.2.0=pyhd8ed1ab_1            | lightgbm                  |     3.2.1=py310h295c915_0       | sqlparse                          |     g0.4.3=pyhd8ed1ab_0         |
| dash-core-components               |     1.17.1=pyhd8ed1ab_0           | lime                      |     0.2.0.1=pyhd8ed1ab_1        | stack_data                        |     g0.6.0=pyhd8ed1ab_0         |
| dash-html-components               |     1.1.4=pyhd8ed1ab_0            | llvm-openmp               |     15.0.4=he0ac6c6_0           | statsmodels                       |     g0.13.5=py310hde88566_2     |
| dash-renderer                      |     1.9.1=pyhd8ed1ab_0            | llvmlite                  |     0.39.1=py310h58363a5_1      | sympy                             |     g1.11.1=py310hff52083_2     |
| dash-table                         |     4.12.0=pyhd8ed1ab_0           | locket                    |     1.0.0=pyhd8ed1ab_0          | tabulate                          |     g0.9.0=pyhd8ed1ab_1         |
| dask-core                          |     2022.10.2=pyhd8ed1ab_0        | lxml                      |     4.8.0                       | tbb                               |     g2021.6.0=h924138e_1        |
| databricks-cli                     |     0.17.3=pyhd8ed1ab_0           | lz4-c                     |     1.9.3=h9c3ff4c_1            | tensorboard                       |     2.8.0                       |
| dav1d                              |     1.0.0=h166bdaf_1              | markdown                  |     3.3.4=gpyhd8ed1ab_0         | tensorboard-data-server           |     g0.6.0=py310h597c629_3      |
| dbus                               |     1.13.6=h5008d03_3             | markupsafe                |     g2.1.1=py310h5764c6d_2      | tensorboard-plugin-wit            |     g1.8.1=pyhd8ed1ab_0         |
| debugpy                            |     1.6.3=py310hd8f1fbe_1         | matplotlib                |     g3.6.2=py310hff52083_0      | tensorflow                        |     2.8.0                       |
| decorator                          |     5.1.1=pyhd8ed1ab_0            | matplotlib-base           |     g3.6.2=py310h8d5ebf3_0      | tensorflow-base                   |     g2.10.0=mkl_py310hb9daa73_0 |
| defusedxml                         |     0.7.1                         | matplotlib-inline         |     g0.1.6=pyhd8ed1ab_0         | tensorflow-estimator              |     2.8.0                       |
| dill                               |     0.3.6=pyhd8ed1ab_1            | mistune                   |     2.0.4                       | tensorflow-io-gcs-filesystem      |     0.27.0                      |
| distlib                            |     0.3.6                         | mkl                       |     g2022.1.0=h84fe81f_915      | termcolor                         |     g2.1.0=pyhd8ed1ab_0         |
| distro                             |     1.8.0                         | mkl-devel                 |     g2022.1.0=ha770c72_916      | terminado                         |     0.17.0                      |
| docker                             |     6.0.1                         | mkl-include               |     g2022.1.0=h84fe81f_915      | textblob                          |     g0.15.3=py_0                |
| dotnetcore2                        |     3.1.23                        | mleap                     |     g0.17.0=pyhd8ed1ab_0        | tf-estimator-nightly              |     2.8.0.dev2021122109         |
| entrypoints                        |     0.4=pyhd8ed1ab_0              | mlflow-skinny             |     g1.30.0=py310h1d0e22c_0     | threadpoolctl                     |     g3.1.0=pyh8a188c0_0         |
| et_xmlfile                         |     1.0.1=py_1001                 | mpc                       |     g1.2.1=h9f54685_0           | tifffile                          |     g2022.10.10=pyhd8ed1ab_0    |
| executing                          |     1.2.0=pyhd8ed1ab_0            | mpfr                      |     g4.1.0=h9202a9a_1           | tinycss2                          |     1.2.1                       |
| expat                              |     2.5.0=h27087fc_0              | mpmath                    |     g1.2.1=pyhd8ed1ab_0         | tk                                |     g8.6.12=h27826a3_0          |
| fastjsonschema                     |     2.16.2                        | msal                      |     g2022.09.01=py_0            | toolz                             |     g0.12.0=pyhd8ed1ab_0        |
| filelock                           |     3.8.0                         | msal-extensions           |     0.3.1                       | torchvision                       |     0.14.0                      |
| fire                               |     0.4.0=pyh44b312d_0            | msrest                    |     0.7.1                       | tornado                           |     g6.2=py310h5764c6d_1        |
| flask                              |     2.2.2=pyhd8ed1ab_0            | msrestazure               |     0.6.4                       | tqdm                              |     g4.64.1=pyhd8ed1ab_0        |
| flask-compress                     |     1.13=pyhd8ed1ab_0             | multidict                 |     g6.0.2=py310h5764c6d_2      | traitlets                         |     g5.5.0=pyhd8ed1ab_0         |
| flatbuffers                        |     2.0.7=h27087fc_0              | multiprocess              |     g0.70.14=py310h5764c6d_3    | typed-ast                         |     1.4.3                       |
| fontconfig                         |     2.14.1=hc2a2eb6_0             | munkres                   |     g1.1.4=pyh9f0ad1d_0         | typing_extensions                 |     g4.4.0=pyha770c72_0         |
| fonttools                          |     4.38.0=py310h5764c6d_1        | mypy                      |     0.780                       | typing-extensions                 |     g4.4.0=hd8ed1ab_0           |
| freetype                           |     2.12.1=hca18f0e_0             | mypy-extensions           |     0.4.3                       | tzdata                            |     g2022fgh191b570_0           |
| frozenlist                         |     1.3.3=py310h5764c6d_0         | nbclassic                 |     0.4.8                       | unicodedata2                      |     g15.0.0gpy310h5764c6d_0     |
| fsspec                             |     2022.10.0=pyhd8ed1ab_0        | nbclient                  |     0.7.0                       | unixodbc                          |     g2.3.10gh583eb01_0          |
| fusepy                             |     3.0.1                         | nbconvert                 |     7.2.3                       | urllib3                           |     g1.26.4=pyhd8ed1ab_0        |
| future                             |     0.18.2=pyhd8ed1ab_6           | nbformat                  |     5.7.0                       | virtualenv                        |     20.14.0                     |
| gast                               |     0.4.0=pyh9f0ad1d_0            | ncurses                   |     g6.3=h27087fc_1             | wcwidth                           |     g0.2.5=pyh9f0ad1d_2         |
| gensim                             |     4.2.0=py310h769672d_0         | ndg-httpsclient           |     0.5.1                       | webencodings                      |     g0.5.1=py_1                 |
| geographiclib                      |     1.52=pyhd8ed1ab_0             | nest-asyncio              |     g1.5.6=pyhd8ed1ab_0         | websocket-client                  |     1.4.2                       |
| geopy                              |     2.1.0=pyhd3deb0d_0            | networkx                  |     g2.8.8=pyhd8ed1ab_0         | werkzeug                          |     g2.2.2=pyhd8ed1ab_0         |
| gettext                            |     0.21.1=h27087fc_0             | nltk                      |     g3.6.2=pyhd8ed1ab_0         | wheel                             |     g0.38.3=pyhd8ed1ab_0        |
| gevent                             |     22.10.1=py310hab16fe0_1       | notebook                  |     6.5.2                       | widgetsnbextension                |     3.6.1                       |
| gflags                             |     2.2.2=he1b5a44_1004           | notebook-shim             |     0.2.2                       | wrapt                             |     g1.14.1=py310h5764c6d_1     |
| giflib                             |     5.2.1=h36c2ea0_2              | numba                     |     g0.56.3=py310ha5257ce_0     | xgboost                           |     g1.7.1=cpu_py310hd1aba9c_0  |
| gitdb                              |     4.0.9=pyhd8ed1ab_0            | numpy                     |     g1.23.4=py310h53a5b5f_1     | xorg-libxau                       |     g1.0.9=h7f98852_0           |
| gitpython                          |     3.1.29=pyhd8ed1ab_0           | oauthlib                  |     g3.2.2=pyhd8ed1ab_0         | xorg-libxdmcp                     |     g1.1.3=h7f98852_0           |
| glib                               |     2.74.1=h6239696_1             | onnx                      |     g1.12.0=py310h3d64581_0     | xyzservices                       |     g2022.9.0=pyhd8ed1ab_0      |
| glib-tools                         |     2.74.1=h6239696_1             | onnxconverter-common      |     g1.7.0=pyhd8ed1ab_0         | xz                                |     g5.2.6=h166bdaf_0           |
| glog                               |     0.6.0=h6f12383_0              | onnxmltools               |     g1.7.0=pyhd8ed1ab_0         | yaml                              |     g0.2.5=h7f98852_2           |
| gmp                                |     6.2.1=h58526e2_0              | onnxruntime               |     g1.13.1=py310h00a7d45_1     | yarl                              |     g1.8.1=py310h5764c6d_0      |
| gmpy2                              |     2.1.2=py310h3ec546c_1         | openjpeg                  |     g2.5.0=h7d73246_1           | zeromq                            |     g4.3.4=h9c3ff4c_1           |
| google-auth                        |     2.14.0=pyh1a96a4e_0           | openpyxl                  |     g3.0.7=pyhd8ed1ab_0         | zfp                               |     g1.0.0=h27087fc_3           |
| google-auth-oauthlib               |     0.4.6=pyhd8ed1ab_0            | openssl                   |     g1.1.1s=h166bdaf_0          | zipp                              |     g3.10.0=pyhd8ed1ab_0        |
| google-pasta                       |     0.2.0=pyh8c360ce_0            | opt_einsum                |     g3.3.0=pyhd8ed1ab_1         | zlib                              |     g1.2.13=h166bdaf_4          |
| greenlet                           |     1.1.3.post0=py310hd8f1fbe_0   | orc                       |     g1.7.6=h6c59b99_0           | zlib-ng                           |     g2.0.6=h166bdaf_0           |
| grpc-cpp                           |     1.46.4=hbad87ad_7             | packaging                 |     g21.3=pyhd8ed1ab_0          | zope.event                        |     g4.5.0gpyh9f0ad1d_0         |
| grpcio                             |     1.46.4=py310h946def9_7        | pandas                    |     g1.5.1=py310h769672d_1      | zope.interface                    |     g5.5.1=py310h5764c6d_0      |
| gst-plugins-base                   |     1.14.0=hbbd80ab_1             | pandasql                  |     0.7.3                       | zstd                              |     g1.5.2=h6239696_4           |
| gstreamer                          |     1.14.0=h28cd5cc_2             | pandocfilters             |     1.5.0                       |                                   |                                 |
| h5py                               |     3.7.0=nompi_py310h416281c_102 | paramiko                  |     2.12.0                      |                                   |                                 |

### R libraries (Preview)

|  **Library**  | **Version** | **       Library** | **Version** | **       Library** | **Version** |
|:-------------:|:-----------:|:------------------:|:-----------:|:------------------:|:-----------:|
| askpass       | 1.1         | highcharter        | 0.9.4       | readr              | 2.1.3       |
| assertthat    | 0.2.1       | highr              | 0.9         | readxl             | 1.4.1       |
| backports     | 1.4.1       | hms                | 1.1.2       | recipes            | 1.0.3       |
| base64enc     | 0.1-3       | htmltools          | 0.5.3       | rematch            | 1.0.1       |
| bit           | 4.0.5       | htmlwidgets        | 1.5.4       | rematch2           | 2.1.2       |
| bit64         | 4.0.5       | httpcode           | 0.3.0       | remotes            | 2.4.2       |
| blob          | 1.2.3       | httpuv             | 1.6.6       | reprex             | 2.0.2       |
| brew          | 1.0-8       | httr               | 1.4.4       | reshape2           | 1.4.4       |
| brio          | 1.1.3       | ids                | 1.0.1       | rjson              | 0.2.21      |
| broom         | 1.0.1       | igraph             | 1.3.5       | rlang              | 1.0.6       |
| bslib         | 0.4.1       | infer              | 1.0.3       | rlist              | 0.4.6.2     |
| cachem        | 1.0.6       | ini                | 0.3.1       | rmarkdown          | 2.18        |
| callr         | 3.7.3       | ipred              | 0.9-13      | RODBC              | 1.3-19      |
| caret         | 6.0-93      | isoband            | 0.2.6       | roxygen2           | 7.2.2       |
| cellranger    | 1.1.0       | iterators          | 1.0.14      | rprojroot          | 2.0.3       |
| cli           | 3.4.1       | jquerylib          | 0.1.4       | rsample            | 1.1.0       |
| clipr         | 0.8.0       | jsonlite           | 1.8.3       | rstudioapi         | 0.14        |
| clock         | 0.6.1       | knitr              | 1.41        | rversions          | 2.1.2       |
| colorspace    | 2.0-3       | labeling           | 0.4.2       | rvest              | 1.0.3       |
| commonmark    | 1.8.1       | later              | 1.3.0       | sass               | 0.4.4       |
| config        | 0.3.1       | lava               | 1.7.0       | scales             | 1.2.1       |
| conflicted    | 1.1.0       | lazyeval           | 0.2.2       | selectr            | 0.4-2       |
| coro          | 1.0.3       | lhs                | 1.1.5       | sessioninfo        | 1.2.2       |
| cpp11         | 0.4.3       | lifecycle          | 1.0.3       | shiny              | 1.7.3       |
| crayon        | 1.5.2       | lightgbm           | 3.3.3       | slider             | 0.3.0       |
| credentials   | 1.3.2       | listenv            | 0.8.0       | sourcetools        | 0.1.7       |
| crosstalk     | 1.2.0       | lobstr             | 1.1.2       | sparklyr           | 1.7.8       |
| crul          | 1.3         | lubridate          | 1.9.0       | SQUAREM            | 2021.1      |
| curl          | 4.3.3       | magrittr           | 2.0.3       | stringi            | 1.7.8       |
| data.table    | 1.14.6      | maps               | 3.4.1       | stringr            | 1.4.1       |
| DBI           | 1.1.3       | memoise            | 2.0.1       | sys                | 3.4.1       |
| dbplyr        | 2.2.1       | mime               | 0.12        | systemfonts        | 1.0.4       |
| desc          | 1.4.2       | miniUI             | 0.1.1.1     | testthat           | 3.1.5       |
| devtools      | 2.4.5       | modeldata          | 1.0.1       | textshaping        | 0.3.6       |
| dials         | 1.1.0       | modelenv           | 0.1.0       | tibble             | 3.1.8       |
| DiceDesign    | 1.9         | ModelMetrics       | 1.2.2.2     | tidymodels         | 1.0.0       |
| diffobj       | 0.3.5       | modelr             | 0.1.10      | tidyr              | 1.2.1       |
| digest        | 0.6.30      | munsell            | 0.5.0       | tidyselect         | 1.2.0       |
| downlit       | 0.4.2       | numDeriv           | 2016.8-1.1  | tidyverse          | 1.3.2       |
| dplyr         | 1.0.10      | openssl            | 2.0.4       | timechange         | 0.1.1       |
| dtplyr        | 1.2.2       | parallelly         | 1.32.1      | timeDate           | 4021.106    |
| e1071         | 1.7-12      | parsnip            | 1.0.3       | tinytex            | 0.42        |
| ellipsis      | 0.3.2       | patchwork          | 1.1.2       | torch              | 0.9.0       |
| evaluate      | 0.18        | pillar             | 1.8.1       | triebeard          | 0.3.0       |
| fansi         | 1.0.3       | pkgbuild           | 1.4.0       | TTR                | 0.24.3      |
| farver        | 2.1.1       | pkgconfig          | 2.0.3       | tune               | 1.0.1       |
| fastmap       | 1.1.0       | pkgdown            | 2.0.6       | tzdb               | 0.3.0       |
| fontawesome   | 0.4.0       | pkgload            | 1.3.2       | urlchecker         | 1.0.1       |
| forcats       | 0.5.2       | plotly             | 4.10.1      | urltools           | 1.7.3       |
| foreach       | 1.5.2       | plyr               | 1.8.8       | usethis            | 2.1.6       |
| forge         | 0.2.0       | praise             | 1.0.0       | utf8               | 1.2.2       |
| fs            | 1.5.2       | prettyunits        | 1.1.1       | uuid               | 1.1-0       |
| furrr         | 0.3.1       | pROC               | 1.18.0      | vctrs              | 0.5.1       |
| future        | 1.29.0      | processx           | 3.8.0       | viridisLite        | 0.4.1       |
| future.apply  | 1.10.0      | prodlim            | 2019.11.13  | vroom              | 1.6.0       |
| gargle        | 1.2.1       | profvis            | 0.3.7       | waldo              | 0.4.0       |
| generics      | 0.1.3       | progress           | 1.2.2       | warp               | 0.2.0       |
| gert          | 1.9.1       | progressr          | 0.11.0      | whisker            | 0.4         |
| ggplot2       | 3.4.0       | promises           | 1.2.0.1     | withr              | 2.5.0       |
| gh            | 1.3.1       | proxy              | 0.4-27      | workflows          | 1.1.2       |
| gistr         | 0.9.0       | pryr               | 0.1.5       | workflowsets       | 1.0.0       |
| gitcreds      | 0.1.2       | ps                 | 1.7.2       | xfun               | 0.35        |
| globals       | 0.16.2      | purrr              | 0.3.5       | xgboost            | 1.6.0.1     |
| glue          | 1.6.2       | quantmod           | 0.4.20      | XML                | 3.99-0.12   |
| googledrive   | 2.0.0       | r2d3               | 0.2.6       | xml2               | 1.3.3       |
| googlesheets4 | 1.0.1       | R6                 | 2.5.1       | xopen              | 1.0.0       |
| gower         | 1.0.0       | ragg               | 1.2.4       | xtable             | 1.8-4       |
| GPfit         | 1.0-8       | rappdirs           | 0.3.3       | xts                | 0.12.2      |
| gtable        | 0.3.1       | rbokeh             | 0.5.2       | yaml               | 2.3.6       |
| hardhat       | 1.2.0       | rcmdcheck          | 1.4.0       | yardstick          | 1.1.0       |
| haven         | 2.5.1       | RColorBrewer       | 1.1-3       | zip                | 2.2.2       |
| hexbin        | 1.28.2      | Rcpp               | 1.0.9       | zoo                | 1.8-11      |

## Next steps
- [Manage libraries for Apache Spark pools in Azure Synapse Analytics](apache-spark-manage-pool-packages.md)
- [Install workspace packages wheel (Python), jar (Scala/Java), or tar.gz (R)](apache-spark-manage-workspace-packages.md)
- [Manage packages through Azure PowerShell and REST API](apache-spark-manage-packages-outside-UI.md)
- [Manage session-scoped packages](apache-spark-manage-session-packages.md)
- [Apache Spark 3.3.1 Documentation](https://spark.apache.org/docs/3.3.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)
