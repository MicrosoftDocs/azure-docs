---
title: Azure Synapse Runtime for Apache Spark 3.3
description: Supported versions of Spark, Scala, Python, and .NET for Apache Spark 3.3.
author: eskot
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 11/17/2022 
ms.author: eskot
ms.custom: has-adal-ref, ignite-2022
ms.reviewer: eskot
---

# Azure Synapse Runtime for Apache Spark 3.3 (Preview)
Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document will cover the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.3.  

> [!NOTE]
> Azure Synapse Runtime for Apache Spark 3.3 is currently in Public Preview. Please expect some major components version changes as well. 

## Component versions

|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.3.1        |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282    |
| Scala | 2.12.15      |
| Hadoop | 3.3.3        |
| .NET Core | 3.1          |
| .NET | 2.0.0        |
| Delta Lake | 2.1.0        |
| Python | 3.8          |
| R (Preview) | 4.2.2        | 

## Libraries
The following sections present the libraries included in Azure Synapse Runtime for Apache Spark 3.3.

### Scala and Java libraries
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




### Python libraries (Normal VMs)

| **Library**                   | **Version**  | **Library**          | **Version**  | **Library**                  | **Version**   |
|:-----------------------------:|:------------:|:--------------------:|:------------:|:----------------------------:|:-------------:|
| _libgcc_mutex                 | 0.1          | keras-applications   | 1.0.8        | pyparsing                    | 2.4.7         |
| _openmp_mutex                 | 4.5          | keras-preprocessing  | 1.1.2        | pyqt                         | 5.12.3        |
| _py-xgboost-mutex             | 2.0          | keras2onnx           | 1.6.5        | pyqt-impl                    | 5.12.3        |
| abseil-cpp                    | 20210324.0   | kiwisolver           | 1.3.1        | pyqt5-sip                    | 4.19.18       |
| absl-py                       | 0.13.0       | koalas               | 1.8.0        | pyqtchart                    | 5.12          |
| adal                          | 1.2.7        | krb5                 | 1.19.1       | pyqtwebengine                | 5.12.1        |
| adlfs                         | 0.7.7        | lcms2                | 2.12         | pysocks                      | 1.7.1         |
| aiohttp                       | 3.7.4.post0  | ld_impl_linux-64     | 2.36.1       | python                       | 3.8.10        |
| alsa-lib                      | 1.2.3        | lerc                 | 2.2.1        | python-dateutil              | 2.8.1         |
| appdirs                       | 1.4.4        | liac-arff            | 2.5.0        | python-flatbuffers           | 1.12          |
| arrow-cpp                     | 3.0.0        | libaec               | 1.0.5        | python_abi                   | 3.8           |
| astor                         | 0.8.1        | libblas              | 3.9.0        | pytorch                      | 1.8.1         |
| astunparse                    | 1.6.3        | libbrotlicommon      | 1.0.9        | pytz                         | 2021.1        |
| async-timeout                 | 3.0.1        | libbrotlidec         | 1.0.9        | pyu2f                        | 0.1.5         |
| attrs                         | 21.2.0       | libbrotlienc         | 1.0.9        | pywavelets                   | 1.1.1         |
| aws-c-cal                     | 0.5.11       | libcblas             | 3.9.0        | pyyaml                       | 5.4.1         |
| aws-c-common                  | 0.6.2        | libclang             | 11.1.0       | pyzmq                        | 22.1.0        |
| aws-c-event-stream            | 0.2.7        | libcurl              | 7.77.0       | qt                           | 5.12.9        |
| aws-c-io                      | 0.10.5       | libdeflate           | 1.7          | re2                          | 2021.04.01    |
| aws-checksums                 | 0.1.11       | libedit              | 3.1.20210216 | readline                     | 8.1           |
| aws-sdk-cpp                   | 1.8.186      | libev                | 4.33         | regex                        | 2021.7.6      |
| azure-datalake-store          | 0.0.51       | libevent             | 2.1.10       | requests                     | 2.25.1        |
| azure-identity                | 2021.03.15b1 | libffi               | 3.3          | requests-oauthlib            | 1.3.0         |
| azure-storage-blob            | 12.8.1       | libgcc-ng            | 9.3.0        | retrying                     | 1.3.3         |
| backcall                      | 0.2.0        | libgfortran-ng       | 9.3.0        | rsa                          | 4.7.2         |
| backports                     | 1.0          | libgfortran5         | 9.3.0        | ruamel_yaml                  | 0.15.100      |
| backports.functools_lru_cache | 1.6.4        | libglib              | 2.68.3       | s2n                          | 1.0.10        |
| beautifulsoup4                | 4.9.3        | libiconv             | 1.16         | salib                        | 1.3.11        |
| blas                          | 2.109        | liblapack            | 3.9.0        | scikit-image                 | 0.18.1        |
| blas-devel                    | 3.9.0        | liblapacke           | 3.9.0        | scikit-learn                 | 0.23.2        |
| blinker                       | 1.4          | libllvm10            | 10.0.1       | scipy                        | 1.5.3         |
| blosc                         | 1.21.0       | libllvm11            | 11.1.0       | seaborn                      | 0.11.1        |
| bokeh                         | 2.3.2        | libnghttp2           | 1.43.0       | seaborn-base                 | 0.11.1        |
| brotli                        | 1.0.9        | libogg               | 1.3.5        | setuptools                   | 49.6.0        |
| brotli-bin                    | 1.0.9        | libopus              | 1.3.1        | shap                         | 0.39.0        |
| brotli-python                 | 1.0.9        | libpng               | 1.6.37       | six                          | 1.16.0        |
| brotlipy                      | 0.7.0        | libpq                | 13.3         | skl2onnx                     | 1.8.0.1       |
| brunsli                       | 0.1          | libprotobuf          | 3.15.8       | sklearn-pandas               | 2.2.0         |
| bzip2                         | 1.0.8        | libsodium            | 1.0.18       | slicer                       | 0.0.7         |
| c-ares                        | 1.17.1       | libssh2              | 1.9.0        | smart_open                   | 5.1.0         |
| ca-certificates               | 2021.7.5     | libstdcxx-ng         | 9.3.0        | smmap                        | 3.0.5         |
| cachetools                    | 4.2.2        | libthrift            | 0.14.1       | snappy                       | 1.1.8         |
| cairo                         | 1.16.0       | libtiff              | 4.2.0        | soupsieve                    | 2.2.1         |
| certifi                       | 2021.5.30    | libutf8proc          | 2.6.1        | sqlite                       | 3.36.0        |
| cffi                          | 1.14.5       | libuuid              | 2.32.1000    | statsmodels                  | 0.12.2        |
| chardet                       | 4.0.0        | libuv                | 1.41.1       | tabulate                     | 0.8.9         |
| charls                        | 2.2.0        | libvorbis            | 1.3.7        | tenacity                     | 7.0.0         |
| click                         | 8.0.1        | libwebp-base         | 1.2.0        | tensorboard                  | 2.4.1         |
| cloudpickle                   | 1.6.0        | libxcb               | 1.14         | tensorboard-plugin-wit       | 1.8.0         |
| conda                         | 4.9.2        | libxgboost           | 1.4.0        | tensorflow                   | 2.4.1         |
| conda-package-handling        | 1.7.3        | libxkbcommon         | 1.0.3        | tensorflow-base              | 2.4.1         |
| configparser                  | 5.0.2        | libxml2              | 2.9.12       | tensorflow-estimator         | 2.4.0         |
| cryptography                  | 3.4.7        | libzopfli            | 1.0.3        | termcolor                    | 1.1.0         |
| cudatoolkit                   | 11.1.1       | lightgbm             | 3.2.1        | textblob                     | 0.15.3        |
| cycler                        | 0.10.0       | lime                 | 0.2.0.1      | threadpoolctl                | 2.1.0         |
| cython                        | 0.29.23      | llvm-openmp          | 11.1.0       | tifffile                     | 2021.4.8      |
| cytoolz                       | 0.11.0       | llvmlite             | 0.36.0       | tk                           | 8.6.10        |
| dash                          | 1.20.0       | locket               | 0.2.1        | toolz                        | 0.11.1        |
| dash-core-components          | 1.16.0       | lz4-c                | 1.9.3        | tornado                      | 6.1           |
| dash-html-components          | 1.1.3        | markdown             | 3.3.4        | tqdm                         | 4.61.2        |
| dash-renderer                 | 1.9.1        | markupsafe           | 2.0.1        | traitlets                    | 5.0.5         |
| dash-table                    | 4.11.3       | matplotlib           | 3.4.2        | typing-extensions            | 3.10.0.0      |
| dash_cytoscape                | 0.2.0        | matplotlib-base      | 3.4.2        | typing_extensions            | 3.10.0.0      |
| dask-core                     | 2021.6.2     | matplotlib-inline    | 0.1.2        | unixodbc                     | 2.3.9         |
| databricks-cli                | 0.12.1       | mkl                  | 2021.2.0     | urllib3                      | 1.26.4        |
| dataclasses                   | 0.8          | mkl-devel            | 2021.2.0     | wcwidth                      | 0.2.5         |
| dbus                          | 1.13.18      | mkl-include          | 2021.2.0     | webencodings                 | 0.5.1         |
| debugpy                       | 1.3.0        | mleap                | 0.17.0       | werkzeug                     | 2.0.1         |
| decorator                     | 4.4.2        | mlflow-skinny        | 1.18.0       | wheel                        | 0.36.2        |
| dill                          | 0.3.4        | msal                 | 2021.06.08   | wrapt                        | 1.12.1        |
| entrypoints                   | 0.3          | msal-extensions      | 2021.06.08   | xgboost                      | 1.4.0         |
| et_xmlfile                    | 1.1.0        | msrest               | 2021.06.01   | xorg-kbproto                 | 1.0.7002      |
| expat                         | 2.4.1        | multidict            | 5.1.0        | xorg-libice                  | 1.0.10        |
| fire                          | 0.4.0        | mysql-common         | 8.0.25       | xorg-libsm                   | 1.2.3         |
| flask                         | 2.0.1        | mysql-libs           | 8.0.25       | xorg-libx11                  | 1.7.2         |
| flask-compress                | 1.10.1       | ncurses              | 6.2          | xorg-libxext                 | 1.3.4         |
| fontconfig                    | 2.13.1       | networkx             | 2.5.1        | xorg-libxrender              | 0.9.10003     |
| freetype                      | 2.10.4       | ninja                | 1.10.2       | xorg-renderproto             | 0.11.1002     |
| fsspec                        | 2021.6.1     | nltk                 | 3.6.2        | xorg-xextproto               | 7.3.0002      |
| future                        | 0.18.2       | nspr                 | 4.30         | xorg-xproto                  | 7.0.31007     |
| gast                          | 0.3.3        | nss                  | 3.67         | xz                           | 5.2.5         |
| gensim                        | 3.8.3        | numba                | 0.53.1       | yaml                         | 0.2.5         |
| geographiclib                 | 1.52         | numpy                | 1.19.4       | yarl                         | 1.6.3         |
| geopy                         | 2.1.0        | oauthlib             | 3.1.1        | zeromq                       | 4.3.4         |
| gettext                       | 0.21.0       | olefile              | 0.46         | zfp                          | 0.5.5         |
| gevent                        | 21.1.2       | onnx                 | 1.9.0        | zipp                         | 3.5.0         |
| gflags                        | 2.2.2        | onnxconverter-common | 1.7.0        | zlib                         | 1.2.11010     |
| giflib                        | 5.2.1        | onnxmltools          | 1.7.0        | zope.event                   | 4.5.0         |
| gitdb                         | 4.0.7        | onnxruntime          | 1.7.2        | zope.interface               | 5.4.0         |
| gitpython                     | 3.1.18       | openjpeg             | 2.4.0        | zstd                         | 1.4.9         |
| glib                          | 2.68.3       | openpyxl             | 3.0.7        | azure-common                 | 1.1.27        |
| glib-tools                    | 2.68.3       | openssl              | 1.1.1k       | azure-core                   | 1.16.0        |
| glog                          | 0.5.0        | opt_einsum           | 3.3.0        | azure-graphrbac              | 0.61.1        |
| gobject-introspection         | 1.68.0       | orc                  | 1.6.7        | azure-mgmt-authorization     | 0.61.0        |
| google-auth                   | 1.32.1       | packaging            | 21.0         | azure-mgmt-containerregistry | 8.0.0         |
| google-auth-oauthlib          | 0.4.1        | pandas               | 1.2.3        | azure-mgmt-core              | 1.3.0         |
| google-pasta                  | 0.2.0        | parquet-cpp          | 1.5.1        | azure-mgmt-keyvault          | 2.2.0         |
| greenlet                      | 1.1.0        | parso                | 0.8.2        | azure-mgmt-resource          | 13.0.0        |
| grpc-cpp                      | 1.37.1       | partd                | 1.2.0        | azure-mgmt-storage           | 11.2.0        |
| grpcio                        | 1.37.1       | patsy                | 0.5.1        | azureml-core                 | 1.34.0        |
| gst-plugins-base              | 1.18.4       | pcre                 | 8.45         | azureml-mlflow               | 1.34.0        |
| gstreamer                     | 1.18.4       | pexpect              | 4.8.0        | azureml-opendatasets         | 1.34.0        |
| h5py                          | 2.10.0       | pickleshare          | 0.7.5        | backports-tempfile           | 1.0           |
| hdf5                          | 1.10.6       | pillow               | 8.2.0        | backports-weakref            | 1.0.post1     |
| html5lib                      | 1.1          | pip                  | 21.1.1       | contextlib2                  | 0.6.0.post1   |
| hummingbird-ml                | 0.4.0        | pixman               | 0.40.0       | docker                       | 4.4.4         |
| icu                           | 68.1         | plotly               | 4.14.3       | ipywidgets                   | 7.6.3         |
| idna                          | 2.10         | pmdarima             | 1.8.2        | jeepney                      | 0.6.0         |
| imagecodecs                   | 2021.3.31    | pooch                | 1.4.0        | jmespath                     | 0.10.0        |
| imageio                       | 2.9.0        | portalocker          | 1.7.1        | jsonpickle                   | 2.0.0         |
| importlib-metadata            | 4.6.1        | prompt-toolkit       | 3.0.19       | kqlmagiccustom               | 0.1.114.post8 |
| intel-openmp                  | 2021.2.0     | protobuf             | 3.15.8       | lxml                         | 4.6.5         |
| interpret                     | 0.2.4        | psutil               | 5.8.0        | msrestazure                  | 0.6.4         |
| interpret-core                | 0.2.4        | ptyprocess           | 0.7.0        | mypy                         | 0.780         |
| ipykernel                     | 6.0.1        | py-xgboost           | 1.4.0        | mypy-extensions              | 0.4.3         |
| ipython                       | 7.23.1       | py4j                 | 0.10.9       | ndg-httpsclient              | 0.5.1         |
| ipython_genutils              | 0.2.0        | pyarrow              | 3.0.0        | pandasql                     | 0.7.3         |
| isodate                       | 0.6.0        | pyasn1               | 0.4.8        | pathspec                     | 0.8.1         |
| itsdangerous                  | 2.0.1        | pyasn1-modules       | 0.2.8        | prettytable                  | 2.4.0         |
| jdcal                         | 1.4.1        | pycairo              | 1.20.1       | pyperclip                    | 1.8.2         |
| jedi                          | 0.18.0       | pycosat              | 0.6.3        | ruamel-yaml                  | 0.17.4        |
| jinja2                        | 3.0.1        | pycparser            | 2.20         | ruamel-yaml-clib             | 0.2.6         |
| joblib                        | 1.0.1        | pygments             | 2.9.0        | secretstorage                | 3.3.1         |
| jpeg                          | 9d           | pygobject            | 3.40.1       | sqlalchemy                   | 1.4.20        |
| jupyter_client                | 6.1.12       | pyjwt                | 2.1.0        | typed-ast                    | 1.4.3         |
| jupyter_core                  | 4.7.1        | pyodbc               | 4.0.30       | torchvision                  | 0.9.1         |
| jxrlib                        | 1.1          | pyopenssl            | 20.0.1       | websocket-client             | 1.1.0         |


### R libraries (Preview)

| **Library**    | **Version** | **Library**   | **Version**      | **Library**   | **Version** |
|:--------------:|:-----------:|:-------------:|:----------------:|:-------------:|:-----------:|
| abind          | 1.4-5       | gtools        | 3.8.2            | RColorBrewer  | 1.1-3       |
| anomalize      | 0.2.2       | hardhat       | 0.2.0            | Rcpp          | 1.0.8.3     |
| anytime        | 0.3.9       | haven         | 2.5.0            | RcppArmadillo | 0.11.0.0.0  |
| arrow          | 7.0.0       | highr         | 0.9              | RcppEigen     | 0.3.3.9.2   |
| askpass        | 1.1         | hms           | 1.1.1            | RcppParallel  | 5.1.5       |
| assertthat     | 0.2.1       | htmltools     | 0.5.2            | RcppRoll      | 0.3.0       |
| backports      | 1.4.1       | htmlwidgets   | 1.5.4            | readr         | 2.1.2       |
| base64enc      | 0.1-3       | httr          | 1.4.3            | readxl        | 1.4.0       |
| BH             | 1.78.0-0    | hwriter       | 1.3.2.1          | recipes       | 0.2.0       |
| bit            | 4.0.4       | ids           | 1.0.1            | rematch       | 1.0.1       |
| bit64          | 4.0.5       | ini           | 0.3.1            | rematch2      | 2.1.2       |
| blob           | 1.2.3       | inline        | 0.3.19           | remotes       | 2.4.2       |
| brew           | 1.0-7       | ipred         | 0.9-12           | reprex        | 2.0.1       |
| brio           | 1.1.3       | isoband       | 0.2.5            | reshape2      | 1.4.3       |
| broom          | 0.8.0       | iterators     | 1.0.14           | reticulate    | 1.18        |
| bslib          | 0.3.1       | jquerylib     | 0.1.4            | rex           | 1.2.1       |
| cachem         | 1.0.6       | jsonlite      | 1.7.2            | rlang         | 1.0.2       |
| callr          | 3.7.0       | knitr         | 1.39             | rmarkdown     | 2.14        |
| car            | 3.0-13      | labeling      | 0.4.2            | RODBC         | 1.3-19      |
| carData        | 3.0-5       | lambda.r      | 1.2.4            | roxygen2      | 7.1.2       |
| caret          | 6.0-86      | later         | 1.3.0            | rprojroot     | 2.0.3       |
| cellranger     | 1.1.0       | lava          | 1.6.10           | rsample       | 0.1.1       |
| checkmate      | 2.1.0       | lazyeval      | 0.2.2            | RSQLite       | 2.2.13      |
| chron          | 2.3-56      | lifecycle     | 1.0.1            | rstan         | 2.21.5      |
| cli            | 3.3.0       | listenv       | 0.8.0            | rstantools    | 2.2.0       |
| clipr          | 0.8.0       | lme4          | 1.1-29           | rstatix       | 0.7.0       |
| colorspace     | 2.0-3       | lmtest        | 0.9-40           | rstudioapi    | 0.13        |
| commonmark     | 1.8.0       | loo           | 2.5.1            | rversions     | 2.1.1       |
| config         | 0.3.1       | lubridate     | 1.8.0            | rvest         | 1.0.2       |
| corrplot       | 0.92        | magrittr      | 2.0.3            | sass          | 0.4.1       |
| covr           | 3.5.1       | maptools      | 1.1-4            | scales        | 1.2.0       |
| cpp11          | 0.4.2       | markdown      | 1.1              | selectr       | 0.4-2       |
| crayon         | 1.5.1       | MatrixModels  | 0.5-0            | sessioninfo   | 1.2.2       |
| credentials    | 1.3.2       | matrixStats   | 0.62.0           | shape         | 1.4.6       |
| crosstalk      | 1.2.0       | memoise       | 2.0.1            | slider        | 0.2.2       |
| curl           | 4.3.2       | mime          | 0.12             | sourcetools   | 0.1.7       |
| data.table     | 1.14.2      | minqa         | 1.2.4            | sp            | 1.4-7       |
| DBI            | 1.1.2       | ModelMetrics  | 1.2.2.2          | sparklyr      | 1.5.2       |
| dbplyr         | 2.1.1       | modelr        | 0.1.8            | SparseM       | 1.81        |
| desc           | 1.4.1       | munsell       | 0.5.0            | sqldf         | 0.4-11      |
| devtools       | 2.3.2       | nloptr        | 2.0.1            | SQUAREM       | 2021.1      |
| diffobj        | 0.3.5       | notebookutils | 3.1.2-20220721.3 | StanHeaders   | 2.21.0-7    |
| digest         | 0.6.29      | numDeriv      | 2016.8-1.1       | stringi       | 1.7.6       |
| dplyr          | 1.0.9       | openssl       | 2.0.0            | stringr       | 1.4.0       |
| DT             | 0.22        | padr          | 0.6.0            | sweep         | 0.2.3       |
| dtplyr         | 1.2.1       | parallelly    | 1.31.1           | sys           | 3.4         |
| dygraphs       | 1.1.1.6     | pbkrtest      | 0.5.1            | testthat      | 3.1.4       |
| ellipsis       | 0.3.2       | pillar        | 1.7.0            | tibble        | 3.1.7       |
| evaluate       | 0.15        | pkgbuild      | 1.3.1            | tibbletime    | 0.1.6       |
| extraDistr     | 1.9.1       | pkgconfig     | 2.0.3            | tidyr         | 1.2.0       |
| fansi          | 1.0.3       | pkgload       | 1.2.4            | tidyselect    | 1.1.2       |
| farver         | 2.1.0       | plogr         | 0.2.0            | tidyverse     | 1.3.1       |
| fastmap        | 1.1.0       | plotly        | 4.10.0           | timeDate      | 3043.102    |
| forcats        | 0.5.1       | plotrix       | 3.8-1            | timetk        | 2.8.0       |
| foreach        | 1.5.2       | plyr          | 1.8.7            | tinytex       | 0.38        |
| forecast       | 8.13        | praise        | 1.0.0            | tseries       | 0.10-51     |
| forge          | 0.2.0       | prettyunits   | 1.1.1            | tsfeatures    | 1.0.2       |
| formatR        | 1.12        | pROC          | 1.18.0           | TTR           | 0.24.3      |
| fracdiff       | 1.5-1       | processx      | 3.5.3            | tzdb          | 0.3.0       |
| fs             | 1.5.2       | prodlim       | 2019.11.13       | urca          | 1.3-0       |
| furrr          | 0.3.0       | progress      | 1.2.2            | usethis       | 2.1.5       |
| futile.logger  | 1.4.3       | progressr     | 0.10.0           | utf8          | 1.2.2       |
| futile.options | 1.0.1       | promises      | 1.2.0.1          | uuid          | 1.1-0       |
| future         | 1.25.0      | prophet       | 0.6.1            | vctrs         | 0.4.1       |
| future.apply   | 1.9.0       | proto         | 1.0.0            | viridisLite   | 0.4.0       |
| gargle         | 1.2.0       | ps            | 1.7.0            | vroom         | 1.5.7       |
| generics       | 0.1.2       | purrr         | 0.3.4            | waldo         | 0.4.0       |
| gert           | 1.6.0       | quadprog      | 1.5-8            | warp          | 0.2.0       |
| ggplot2        | 3.3.6       | quantmod      | 0.4.20           | whisker       | 0.4         |
| gh             | 1.3.0       | quantreg      | 5.93             | withr         | 2.5.0       |
| gitcreds       | 0.1.1       | R.methodsS3   | 1.8.1            | xfun          | 0.30        |
| glmnet         | 4.1-4       | R.oo          | 1.24.0           | xml2          | 1.3.3       |
| globals        | 0.14.0      | R.utils       | 2.12.0           | xopen         | 1.0.0       |
| glue           | 1.6.2       | r2d3          | 0.2.6            | xtable        | 1.8-4       |
| gower          | 1.0.0       | R6            | 2.5.1            | xts           | 0.12.1      |
| gridExtra      | 2.3         | randomForest  | 4.7-1            | yaml          | 2.3.5       |
| gsubfn         | 0.7         | rappdirs      | 0.3.3            | zip           | 2.2.0       |
| gtable         | 0.3.0       | rcmdcheck     | 1.4.0            | zoo           | 1.8-10      |

## Next steps
- [Manage libraries for Apache Spark pools in Azure Synapse Analytics](apache-spark-manage-pool-packages.md)
- [Install workspace packages wheel (Python), jar (Scala/Java), or tar.gz (R)](apache-spark-manage-workspace-packages.md)
- [Manage packages through Azure PowerShell and REST API](apache-spark-manage-packages-outside-UI.md)
- [Manage session-scoped packages](apache-spark-manage-session-packages.md)
- [Apache Spark 3.3.1 Documentation](https://spark.apache.org/docs/3.3.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)
