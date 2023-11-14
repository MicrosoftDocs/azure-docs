---
title: Azure Synapse Runtime for Apache Spark 2.4 (unsupported)
description: Versions of Spark, Scala, Python, and .NET for Apache Spark 2.4.
author: ekote 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 04/18/2022 
ms.author: eskot 
ms.custom: has-adal-ref, devx-track-dotnet, devx-track-extended-java, devx-track-python
---

# Azure Synapse Runtime for Apache Spark 2.4 (unsupported)

Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document will cover the runtime components and versions for the Azure Synapse Runtime for Apache Spark 2.4.

> [!WARNING]
> End of Support Notification for Azure Synapse Runtime for Apache Spark 2.4
> * Effective September 29, 2023, the Azure Synapse will discontinue official support for Spark 2.4 Runtimes. 
> * Post September 29, we will not be addressing any support tickets related to Spark 2.4. There will be no release pipeline in place for bug or security fixes for Spark 2.4. Utilizing Spark 2.4 post the support cutoff date is undertaken at one's own risk. We strongly discourage its continued use due to potential security and functionality concerns.
> * Recognizing that certain customers may need additional time to transition to a higher runtime version, we are temporarily extending the usage option for Spark 2.4, but we will not provide any official support for it.
> * We strongly advise to proactively upgrade their workloads to a more recent version of the runtime (e.g., [Azure Synapse Runtime for Apache Spark 3.3 (GA)](./apache-spark-33-runtime.md)).


## Component versions
|  Component   | Version   |  
| ----- | ----- |
| Apache Spark | 2.4.8 |
| Operating System | Ubuntu 16.04 |
| Java | 1.8.0_272 |
| Scala | 2.11  |
| .NET Core | 3.1 |
| .NET | 1.0.0 |
| Delta Lake | 0.6|
| Python | 3.6|

>[!Note]
> Following are the recent library changes for Apache Spark 2.4 Python runtime:
>
> Modifications:
>
> - conda 4.3.21 --> 4.9.2
> - libgcc-ng 9.3.0 --> 12.1.0
> - libgfortran-ng 9.3.0 --> 7.5.0
> - libgomp=9.3.0 --> 12.1.0
> - nest-asyncio 1.5.5 --> 1.5.6
>
> New additions:
> - cached_property=1.5.2
> - backports-entry-points-selectable=1.1.1

## Scala and Java libraries

HikariCP-java7-2.4.12.jar

JavaEWAH-0.3.2.jar

RoaringBitmap-0.7.45.jar

ST4-4.0.4.jar

SparkCustomEvents-2.0.0.jar

TokenLibrary-assembly-1.0.jar

VegasConnector-1.0.21.1.jar

accessors-smart-1.2.jar

activation-1.1.1.jar

aircompressor-0.10.jar

antlr-2.7.7.jar

antlr-runtime-3.4.jar

antlr4-runtime-4.7.jar

aopalliance-1.0.jar

aopalliance-repackaged-2.4.0-b34.jar

apache-log4j-extras-1.2.17.jar

apacheds-i18n-2.0.0-M15.jar

apacheds-kerberos-codec-2.0.0-M15.jar

api-asn1-api-1.0.0-M20.jar

api-util-1.0.0-M20.jar

arpack_combined_all-0.1.jar

arrow-format-0.10.0.jar

arrow-memory-0.10.0.jar

arrow-vector-0.10.0.jar

audience-annotations-0.5.0.jar

avro-1.8.2.jar

avro-ipc-1.8.2.jar

avro-mapred-1.8.2-hadoop2.jar

aws-java-sdk-bundle-1.11.271.jar

azure-eventhubs-3.2.2.jar

azure-eventhubs-spark_2.11-2.3.18.jar

azure-keyvault-core-1.0.0.jar

azure-storage-7.0.1.jar

bonecp-0.8.0.RELEASE.jar

breeze-macros_2.11-0.13.2.jar

breeze_2.11-0.13.2.jar

calcite-avatica-1.2.0-incubating.jar

calcite-core-1.2.0-incubating.jar

calcite-linq4j-1.2.0-incubating.jar

cardinalestimate_2.11-0.1-uber.jar

chill-java-0.9.3.jar

chill_2.11-0.9.3.jar

client-sdk-1.11.0.jar

cntk-2.4.jar

commons-beanutils-1.9.4.jar

commons-cli-1.2.jar

commons-codec-1.10.jar

commons-collections-3.2.2.jar

commons-compiler-3.0.9.jar

commons-compress-1.8.1.jar

commons-configuration-1.6.jar

commons-crypto-1.0.0.jar

commons-dbcp-1.4.jar

commons-digester-1.8.jar

commons-httpclient-3.1.jar

commons-io-2.4.jar

commons-lang-2.6.jar

commons-lang3-3.5.jar

commons-logging-1.1.3.jar

commons-math3-3.4.1.jar

commons-net-3.1.jar

commons-pool-1.5.4.jar

compress-lzf-1.0.3.jar

config-1.3.4.jar

core-1.1.2.jar

cosmos-analytics-spark-connector-assembly-1.4.5.jar

curator-client-2.7.1.jar

curator-framework-2.7.1.jar

curator-recipes-2.7.1.jar

datanucleus-api-jdo-3.2.6.jar

datanucleus-core-3.2.10.jar

datanucleus-rdbms-3.2.9.jar

delta-core_2.11-0.6.1.1.jar

derby-10.12.1.1.jar

ehcache-3.3.1.jar

eigenbase-properties-1.1.5.jar

flatbuffers-1.2.0-3f79e055.jar

fluent-logger-jar-with-dependencies.jar

geronimo-jcache_1.0_spec-1.0-alpha-1.jar

gson-2.2.4.jar

guava-14.0.1.jar

guice-3.0.jar

guice-servlet-3.0.jar

hadoop-annotations-2.9.1.2.6.99.201-34744923.jar

hadoop-auth-2.9.1.2.6.99.201-34744923.jar

hadoop-aws-2.9.1.2.6.99.201-34744923.jar

hadoop-azure-2.9.1.2.6.99.201-34744923.jar

hadoop-client-2.9.1.2.6.99.201-34744923.jar

hadoop-common-2.9.1.2.6.99.201-34744923.jar

hadoop-hdfs-client-2.9.1.2.6.99.201-34744923.jar

hadoop-mapreduce-client-app-2.9.1.2.6.99.201-34744923.jar

hadoop-mapreduce-client-common-2.9.1.2.6.99.201-34744923.jar

hadoop-mapreduce-client-core-2.9.1.2.6.99.201-34744923.jar

hadoop-mapreduce-client-jobclient-2.9.1.2.6.99.201-34744923.jar

hadoop-mapreduce-client-shuffle-2.9.1.2.6.99.201-34744923.jar

hadoop-openstack-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-api-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-client-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-common-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-registry-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-server-common-2.9.1.2.6.99.201-34744923.jar

hadoop-yarn-server-web-proxy-2.9.1.2.6.99.201-34744923.jar

hdinsight-spark-metrics_2_4-2.1.jar

hive-beeline-1.2.1.spark2.jar

hive-cli-1.2.1.spark2.jar

hive-exec-1.2.1.spark2.jar

hive-jdbc-1.2.1.spark2.jar

hive-metastore-1.2.1.spark2.jar

hk2-api-2.4.0-b34.jar

hk2-locator-2.4.0-b34.jar

hk2-utils-2.4.0-b34.jar

hppc-0.7.2.jar

htrace-core4-4.1.0-incubating.jar

httpclient-4.5.6.jar

httpcore-4.4.10.jar

hyperspace-core_2.11-0.4.0.1.jar

impulse-core_2.11-0.1.2.jar

isolation-forest_2.4.3_2.11-0.3.2.jar

ivy-2.4.0.jar

jackson-annotations-2.6.7.jar

jackson-core-2.6.7.jar

jackson-core-asl-1.9.13.jar

jackson-databind-2.6.7.3.jar

jackson-jaxrs-1.9.13.jar

jackson-mapper-asl-1.9.13.jar

jackson-module-paranamer-2.7.9.jar

jackson-module-scala_2.11-2.6.7.1.jar

jackson-xc-1.9.13.jar

janino-3.0.9.jar

javassist-3.18.1-GA.jar

javax.annotation-api-1.2.jar

javax.inject-1.jar

javax.inject-2.4.0-b34.jar

javax.servlet-api-3.1.0.jar

javax.ws.rs-api-2.0.1.jar

javolution-5.5.1.jar

jaxb-api-2.2.2.jar

jcip-annotations-1.0-1.jar

jcl-over-slf4j-1.7.16.jar

jdo-api-3.0.1.jar

jersey-client-2.22.2.jar

jersey-common-2.22.2.jar

jersey-container-servlet-2.22.2.jar

jersey-container-servlet-core-2.22.2.jar

jersey-guava-2.22.2.jar

jersey-media-jaxb-2.22.2.jar

jersey-server-2.22.2.jar

jetty-6.1.26.jar

jetty-sslengine-6.1.26.jar

jetty-util-6.1.26.jar

jline-2.14.6.jar

joda-time-2.9.3.jar

jodd-core-3.5.2.jar

jpam-1.1.jar

jsch-0.1.54.jar

json-20090211.jar

json-simple-1.1.jar

json-smart-2.3.jar

json4s-ast_2.11-3.5.3.jar

json4s-core_2.11-3.5.3.jar

json4s-jackson_2.11-3.5.3.jar

json4s-scalap_2.11-3.5.3.jar

jsp-api-2.1.jar

jsr305-1.3.9.jar

jta-1.1.jar

jtransforms-2.4.0.jar

jul-to-slf4j-1.7.16.jar

kryo-shaded-4.0.2.jar

kusto-data-2.4.1.jar

kusto-ingest-2.4.1.jar

kusto-spark_2.4_2.11-2.5.1.jar

leveldbjni-all-1.8.jar

libfb303-0.9.3.jar

libthrift-0.9.3.jar

libuxsock.so

lightgbmlib-2.3.180.jar

log4j-1.2.17.jar

lz4-java-1.4.0.jar

machinist_2.11-0.6.1.jar

macro-compat_2.11-1.1.1.jar

mdsdclientdynamic-2.0.jar

metrics-core-3.1.5.jar

metrics-graphite-3.1.5.jar

metrics-json-3.1.5.jar

metrics-jvm-3.1.5.jar

microsoft-catalog-metastore-client-1.0.44.jar

microsoft-log4j-etwappender-1.0.jar

microsoft-spark.jar

minlog-1.3.0.jar

mmlspark_2.11-1.0.0-rc3-6-0a30d1ae-SNAPSHOT.jar

mssql-jdbc-8.4.1.jre8.jar

mysql-connector-java-8.0.18.jar

netty-3.9.9.Final.jar

netty-all-4.1.42.Final.jar

nimbus-jose-jwt-4.41.1.jar

notebook-utils-2.4.4-20210430.2.jar

objenesis-2.5.1.jar

okhttp-2.7.5.jar

okio-1.6.0.jar

opencsv-2.3.jar

opencv-3.2.0-1.jar

orc-core-1.5.5-nohive.jar

orc-mapreduce-1.5.5-nohive.jar

orc-shims-1.5.5.jar

oro-2.0.8.jar

osgi-resource-locator-1.0.1.jar

paranamer-2.8.jar

parquet-column-1.10.1.jar

parquet-common-1.10.1.jar

parquet-encoding-1.10.1.jar

parquet-format-2.4.0.jar

parquet-hadoop-1.10.1.jar

parquet-hadoop-bundle-1.6.0.jar

parquet-jackson-1.10.1.jar

peregrine-spark-0.5.jar

postgresql-42.2.9.jar

protobuf-java-2.5.0.jar

proton-j-0.33.4.jar

py4j-0.10.7.jar

pyrolite-4.13.jar

qpid-proton-j-extensions-1.2.3.jar

scala-compiler-2.11.12.jar

scala-java8-compat_2.11-0.9.0.jar

scala-library-2.11.12.jar

scala-parser-combinators_2.11-1.1.0.jar

scala-reflect-2.11.12.jar

scala-xml_2.11-1.0.5.jar

shapeless_2.11-2.3.2.jar

shims-0.7.45.jar

slf4j-api-1.7.16.jar

slf4j-log4j12-1.7.16.jar

snappy-0.2.jar

snappy-java-1.1.7.3.jar

spark-avro_2.11-2.4.4.2.6.99.201-34744923.jar

spark-catalyst_2.11-2.4.4.2.6.99.201-34744923.jar

spark-cdm-connector-assembly-0.19.1.jar

spark-core_2.11-2.4.4.2.6.99.201-34744923.jar

spark-enhancement_2.11-2.4.4.2.6.99.201-34744923.jar

spark-enhancementui_2.11-1.0.0.jar

spark-graphx_2.11-2.4.4.2.6.99.201-34744923.jar

spark-hive-thriftserver_2.11-2.4.4.2.6.99.201-34744923.jar

spark-hive_2.11-2.4.4.2.6.99.201-34744923.jar

spark-kusto-synapse-connector-0.11.0.jar

spark-kvstore_2.11-2.4.4.2.6.99.201-34744923.jar

spark-launcher_2.11-2.4.4.2.6.99.201-34744923.jar

spark-microsoft-telemetry_2.11-2.4.4.2.6.99.201-34744923.jar

spark-microsoft-tools_2.11-2.4.4.2.6.99.201-34744923.jar

spark-mllib-local_2.11-2.4.4.2.6.99.201-34744923.jar

spark-mllib_2.11-2.4.4.2.6.99.201-34744923.jar

spark-mssql-connector-1.0.0.jar

spark-network-common_2.11-2.4.4.2.6.99.201-34744923.jar

spark-network-shuffle_2.11-2.4.4.2.6.99.201-34744923.jar

spark-repl_2.11-2.4.4.2.6.99.201-34744923.jar

spark-sketch_2.11-2.4.4.2.6.99.201-34744923.jar

spark-sql_2.11-2.4.4.2.6.99.201-34744923.jar

spark-streaming_2.11-2.4.4.2.6.99.201-34744923.jar

spark-tags_2.11-2.4.4.2.6.99.201-34744923.jar

spark-unsafe_2.11-2.4.4.2.6.99.201-34744923.jar

spark-yarn_2.11-2.4.4.2.6.99.201-34744923.jar

spark_diagnostic_cli-1.0.3_spark-2.4.5.jar

spire-macros_2.11-0.13.0.jar

spire_2.11-0.13.0.jar

spray-json_2.11-1.3.2.jar

sqlanalyticsconnector-1.0.9.2.6.99.201-34744923.jar

stax-api-1.0-2.jar

stax-api-1.0.1.jar

stax2-api-3.1.4.jar

stream-2.7.0.jar

stringtemplate-3.2.1.jar

structuredstreamforspark_2.11-1.3.2.jar

super-csv-2.2.0.jar

synapse-spark-telemetry_2.11-0.0.4.jar

univocity-parsers-2.7.3.jar

validation-api-1.1.0.Final.jar

vw-jni-8.8.1.jar

wildfly-openssl-1.0.7.Final.jar

woodstox-core-5.0.3.jar

xbean-asm6-shaded-4.8.jar

xmlenc-0.52.jar

xz-1.5.jar

zookeeper-3.4.11.2.6.99.201-34744923.jar

zstd-jni-1.3.2-2.jar
 
## Python libraries

- conda:
    - _libgcc_mutex=0.1
    - _openmp_mutex=4.5
    - brotlipy=0.7.0
    - c-ares=1.16.1
    - ca-certificates=2020.6.20
    - cached-property=1.5.2
    - cached_property=1.5.2
    - certifi=2020.6.20
    - cffi=1.14.3
    - chardet=3.0.4
    - conda=4.9.2
    - conda-env=2.6.0
    - cryptography=3.1.1
    - cytoolz=0.8.2
    - gperftools=2.7
    - h5py=2.10.0
    - hdf5=1.10.6
    - idna=2.10
    - jpeg=9d
    - krb5=1.17.1
    - ld_impl_linux-64=2.35
    - libblas=3.9.0
    - libcblas=3.9.0
    - libcurl=7.71.1
    - libedit=3.1.20191231
    - libev=4.33
    - libffi=3.2.1
    - libgcc-ng=12.1.0
    - libgfortran-ng=7.5.0
    - libgfortran4=7.5.0
    - libgomp=12.1.0
    - libiconv=1.16
    - liblapack=3.9.0
    - libnghttp2=1.41.0
    - libopenblas=0.3.12
    - libssh2=1.9.0
    - libstdcxx-ng=9.3.0
    - ncurses=6.2
    - numpy=1.18.5
    - openssl=1.1.1h
    - perl=5.32.0
    - pip=20.2.4
    - pycparser=2.20
    - pygments=2.7.3
    - pyopenssl=19.1.0
    - pysocks=1.7.1
    - python=3.6.11
    - python_abi=3.6
    - readline=8.0
    - requests=2.24.0
    - sentencepiece=0.1.92
    - setuptools=41.4.0
    - six=1.15.0
    - sqlite=3.33.0
    - tk=8.6.10
    - toolz=0.11.1
    - unixodbc=2.3.9
    - urllib3=1.25.10
    - wheel=0.30.0
    - xz=5.2.5
    - yaml=0.2.5
    - zlib=1.2.11
- pip:
    - absl-py==0.11.0
    - adal==1.2.4
    - adlfs==0.5.5
    - aiohttp==3.7.2
    - alembic==1.4.1
    - altair==4.1.0
    - appdirs==1.4.4
    - applicationinsights==0.11.9
    - argon2-cffi==21.1.0
    - asn1crypto==1.4.0
    - astor==0.8.1
    - astroid==2.4.2
    - astunparse==1.6.3
    - async-generator==1.10
    - async-timeout==3.0.1
    - attrs==20.3.0
    - azure-common==1.1.25
    - azure-core==1.15.0
    - azure-datalake-store==0.0.51
    - azure-graphrbac==0.61.1
    - azure-identity==1.4.1
    - azure-mgmt-authorization==0.61.0
    - azure-mgmt-containerregistry==2.8.0
    - azure-mgmt-keyvault==2.2.0
    - azure-mgmt-resource==12.0.0
    - azure-mgmt-storage==11.2.0
    - azure-storage-blob==12.5.0
    - azure-storage-common==2.1.0
    - azure-storage-queue==12.1.5
    - azureml-automl-core==1.32.0
    - azureml-automl-runtime==1.32.0
    - azureml-core==1.32.0
    - azureml-dataprep==2.18.0
    - azureml-dataprep-native==36.0.0
    - azureml-dataprep-rslex==1.16.1
    - azureml-dataset-runtime==1.32.0
    - azureml-defaults==1.32.0
    - azureml-interpret==1.32.0
    - azureml-mlflow==1.32.0
    - azureml-model-management-sdk==1.0.1b6.post1
    - azureml-opendatasets==1.32.0
    - azureml-pipeline==1.32.0
    - azureml-pipeline-core==1.32.0
    - azureml-pipeline-steps==1.32.0
    - azureml-sdk==1.32.0
    - azureml-telemetry==1.32.0
    - azureml-train==1.32.0
    - azureml-train-automl==1.32.0
    - azureml-train-automl-client==1.32.0
    - azureml-train-automl-runtime==1.32.0
    - azureml-train-core==1.32.0
    - azureml-train-restclients-hyperdrive==1.32.0
    - backcall==0.2.0
    - backports-datetime-fromisoformat==1.0.0
    - backports-entry-points-selectable==1.1.1
    - backports-tempfile==1.0
    - backports-weakref==1.0.post1
    - beautifulsoup4==4.9.3
    - bitarray==1.6.1
    - bleach==4.1.0
    - bokeh==2.2.3
    - boto==2.49.0
    - boto3==1.15.14
    - botocore==1.18.14
    - bottleneck==1.3.2
    - bpemb==0.3.2
    - cachetools==4.1.1
    - click==7.1.2
    - cloudpickle==1.6.0
    - configparser==3.7.4
    - contextlib2==0.6.0.post1
    - contextvars==2.4
    - cycler==0.10.0
    - cython==0.29.21
    - databricks-cli==0.14.0
    - dataclasses==0.8
    - datashape==0.5.2
    - decorator==4.4.2
    - defusedxml==0.7.1
    - deprecated==1.2.10
    - dill==0.3.2
    - distlib==0.3.6
    - distro==1.5.0
    - docker==4.3.1
    - docutils==0.16
    - dotnetcore2==2.1.17
    - entrypoints==0.3
    - et-xmlfile==1.0.1
    - fastapi==0.63.0
    - filelock==3.0.12
    - fire==0.3.1
    - flair==0.5
    - flask==1.0.3
    - flatbuffers==2.0
    - fsspec==0.8.4
    - fusepy==3.0.1
    - future==0.18.2
    - gast==0.3.3
    - gensim==3.8.3
    - geographiclib==1.50
    - geopy==2.0.0
    - gitdb==4.0.5
    - gitpython==3.1.11
    - google-api-core==1.30.0
    - google-auth==1.32.1
    - google-auth-oauthlib==0.4.2
    - google-pasta==0.2.0
    - googleapis-common-protos==1.53.0
    - gorilla==0.3.0
    - grpcio==1.33.2
    - gunicorn==20.1.0
    - h11==0.12.0
    - heapdict==1.0.1
    - html5lib==1.1
    - hummingbird-ml==0.0.6
    - hyperopt==0.2.5
    - idna-ssl==1.1.0
    - imageio==2.9.0
    - immutables==0.16
    - importlib-metadata==1.7.0
    - importlib-resources==5.4.0
    - interpret-community==0.18.1
    - interpret-core==0.2.1
    - ipykernel==5.5.3
    - ipython==7.8.0
    - ipython-genutils==0.2.0
    - ipywidgets==7.6.3
    - isodate==0.6.0
    - isort==5.6.4
    - itsdangerous==1.1.0
    - jdcal==1.4.1
    - jedi==0.18.1
    - jeepney==0.4.3
    - jinja2==2.11.2
    - jmespath==0.10.0
    - joblib==0.14.1
    - json-logging-py==0.2
    - jsonpickle==1.4.1
    - jsonschema==3.2.0
    - jupyter-client==7.1.2
    - jupyter-core==4.9.2
    - jupyterlab-pygments==0.1.2
    - jupyterlab-widgets==1.1.1
    - keras-applications==1.0.8
    - keras-preprocessing==1.1.2
    - keras2onnx==1.6.0
    - kiwisolver==1.3.1
    - koalas==1.2.0
    - langdetect==1.0.8
    - lazy-object-proxy==1.4.3
    - liac-arff==2.5.0
    - lightgbm==2.3.0
    - mako==1.1.3
    - markdown==3.3.3
    - markupsafe==1.1.1
    - matplotlib==3.2.2
    - mccabe==0.6.1
    - mistune==0.8.4
    - mleap==0.16.1
    - mlflow==1.18.0
    - mlflow-skinny==1.20.2
    - more-itertools==8.6.0
    - mpld3==0.3
    - mpmath==1.1.0
    - msal==1.5.0
    - msal-extensions==0.2.2
    - msrest==0.6.19
    - msrestazure==0.6.4
    - multidict==5.0.0
    - multipledispatch==0.6.0
    - mypy==0.780
    - mypy-extensions==0.4.3
    - nbclient==0.5.9
    - nbconvert==6.0.7
    - nbformat==5.1.3
    - ndg-httpsclient==0.5.1
    - nest-asyncio==1.5.6
    - networkx==2.5
    - nimbusml==1.7.1
    - nltk==3.5
    - nose==1.3.7
    - notebook==6.1.5
    - oauthlib==3.1.0
    - odo==0.5.0
    - olefile==0.46
    - onnx==1.7.0
    - onnxconverter-common==1.6.0
    - onnxmltools==1.4.1
    - onnxruntime==1.8.0
    - opencensus==0.7.13
    - opencensus-context==0.1.2
    - opencensus-ext-azure==1.0.8
    - openpyxl==3.0.5
    - opt-einsum==3.3.0
    - packaging==20.4
    - pandas==0.25.3
    - pandasql==0.7.3
    - pandocfilters==1.5.0
    - parso==0.8.2
    - pathspec==0.8.0
    - patsy==0.5.1
    - pexpect==4.8.0
    - pickleshare==0.7.5
    - pillow==8.0.1
    - platformdirs==2.4.0
    - plotly==4.12.0
    - pluggy==0.13.1
    - pmdarima==1.1.1
    - portalocker==1.7.1
    - prometheus-client==0.8.0
    - prometheus-flask-exporter==0.18.1
    - prompt-toolkit==2.0.10
    - protobuf==3.13.0
    - psutil==5.7.2
    - ptyprocess==0.7.0
    - py==1.9.0
    - py-cpuinfo==5.0.0
    - py4j==0.10.7
    - pyarrow==1.0.1
    - pyasn1==0.4.8
    - pyasn1-modules==0.2.8
    - pycrypto==2.6.1
    - pydantic==1.9.2
    - pyjwt==1.7.1
    - pylint==2.6.0
    - pymssql==2.1.5
    - pyodbc==4.0.30
    - pyopencl==2020.1
    - pyparsing==2.4.7
    - pyrsistent==0.17.3
    - pyspark==2.4.5
    - pytest==5.3.2
    - python-dateutil==2.8.1
    - python-editor==1.0.4
    - pytools==2021.1
    - pytz==2020.1
    - pywavelets==1.1.1
    - pyyaml==5.3.1
    - pyzmq==22.3.0
    - querystring-parser==1.2.4
    - regex==2020.10.28
    - requests-oauthlib==1.3.0
    - retrying==1.3.3
    - rsa==4.6
    - ruamel-yaml==0.16.12
    - ruamel-yaml-clib==0.2.2
    - s3transfer==0.3.3
    - sacremoses==0.0.43
    - scikit-image==0.17.2
    - scikit-learn==0.22.2.post1
    - scipy==1.5.2
    - seaborn==0.11.0
    - secretstorage==3.1.2
    - segtok==1.5.10
    - send2trash==1.8.0
    - shap==0.34.0
    - skl2onnx==1.4.9
    - sklearn-pandas==1.7.0
    - smart-open==1.9.0
    - smmap==3.0.4
    - soupsieve==2.0.1
    - sqlalchemy==1.3.13
    - sqlitedict==1.7.0
    - sqlparse==0.4.1
    - starlette==0.13.6
    - statsmodels==0.10.2
    - tabulate==0.8.7
    - tb-nightly==1.14.0a20190603
    - tensorboard==2.3.0
    - tensorboard-plugin-wit==1.7.0
    - tensorflow==2.0.1
    - tensorflow-estimator==2.3.0
    - termcolor==1.1.0
    - terminado==0.12.1
    - testpath==0.5.0
    - textblob==0.15.3
    - tf-estimator-nightly==1.14.0.dev2019060501
    - tf2onnx==1.7.2
    - tifffile==2020.9.3
    - tokenizers==0.9.2
    - toml==0.10.2
    - torch==1.7.0
    - tornado==6.1
    - tqdm==4.48.2
    - traitlets==4.3.3
    - transformers==3.4.0
    - typed-ast==1.4.1
    - typing-extensions==3.7.4.3
    - uvicorn==0.13.2
    - virtualenv==20.8.1
    - wcwidth==0.2.5
    - webencodings==0.5.1
    - websocket-client==0.57.0
    - werkzeug==1.0.1
    - widgetsnbextension==3.5.2
    - wrapt==1.11.2
    - xgboost==0.90
    - yarl==1.6.3
    - zict==1.0.0
    - zipp==3.4.1

## Next steps

- [Azure Synapse Analytics](../overview-what-is.md)
- [Apache Spark Documentation](https://spark.apache.org/docs/2.4.8/)
- [Apache Spark Concepts](apache-spark-concepts.md)
