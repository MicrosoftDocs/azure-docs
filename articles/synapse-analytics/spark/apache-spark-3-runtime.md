---
title: Azure Synapse Runtime for Apache Spark 3.0 (preview)
description: Supported versions of Spark, Scala, Python, and .NET for Apache Spark 3.0 (preview).
services: synapse-analytics
author: midesa 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 05/26/2021 
ms.author: midesa 
---

# Azure Synapse Runtime for Apache Spark 3.0 (preview)

Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document will cover the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.0 (preview).  The runtime engine will be periodically updated with the latest features and libraries during the preview period.  Check here to see the latest updates to the libraries and their versions.

## Known Issues in Preview
* Synapse Pipeline/Dataflows support is coming soon.
* Library Management to add libraries is coming soon.
* Connectors : the following connector support are coming soon.
  * Azure Data Explorer connector
  * CosmosDB
  * SQL Server
* Hyperspace, Spark Cruise, and Dynamic Allocation Executors are coming soon.

## Component versions
|  Component   | Version   |  
| ----- | ----- |
| Apache Spark | 3.0 |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282 |
| Scala | 2.12  |
| .NET Core | 3.1 |
| .NET | 1.0.0 |
| Delta Lake | 0.8 |
| Python | 3.6 |

## Scala and Java libraries

HikariCP-2.5.1.jar

JLargeArrays-1.5.jar

JTransforms-3.1.jar

RoaringBitmap-0.7.45.jar

ST4-4.0.4.jar

TokenLibrary-assembly-1.0.jar

accessors-smart-1.2.jar

activation-1.1.1.jar

aircompressor-0.10.jar

algebra_2.12-2.0.0-M2.jar

animal-sniffer-annotations-1.17.jar

antlr-runtime-3.5.2.jar

antlr4-runtime-4.7.1.jar

aopalliance-1.0.jar

aopalliance-repackaged-2.6.1.jar

arpack_combined_all-0.1.jar

arrow-format-0.15.1.jar

arrow-memory-0.15.1.jar

arrow-vector-0.15.1.jar

avro-1.8.2.jar

avro-ipc-1.8.2.jar

avro-mapred-1.8.2-hadoop2.jar

aws-java-sdk-bundle-1.11.375.jar

azure-eventhubs-3.2.2.jar

azure-eventhubs-spark_2.12-2.3.18.jar

azure-keyvault-core-1.0.0.jar

azure-storage-7.0.1.jar

bcpkix-jdk15on-1.60.jar

bcprov-jdk15on-1.60.jar

bonecp-0.8.0.RELEASE.jar

breeze-macros_2.12-1.0.jar

breeze_2.12-1.0.jar

cats-kernel_2.12-2.0.0-M4.jar

checker-qual-2.8.1.jar

chill-java-0.9.5.jar

chill_2.12-0.9.5.jar

client-sdk-1.14.0.jar

cntk-2.4.jar

commons-beanutils-1.9.4.jar

commons-cli-1.2.jar

commons-codec-1.10.jar

commons-collections-3.2.2.jar

commons-compiler-3.0.16.jar

commons-compress-1.20.jar

commons-configuration2-2.1.1.jar

commons-crypto-1.1.0.jar

commons-daemon-1.0.13.jar

commons-dbcp-1.4.jar

commons-httpclient-3.1.jar

commons-io-2.4.jar

commons-lang-2.6.jar

commons-lang3-3.9.jar

commons-logging-1.1.3.jar

commons-math3-3.4.1.jar

commons-net-3.1.jar

commons-pool-1.5.4.jar

commons-text-1.6.jar

compress-lzf-1.0.3.jar

config-1.3.4.jar

core-1.1.2.jar

curator-client-2.12.0.jar

curator-framework-2.12.0.jar

curator-recipes-2.12.0.jar

datanucleus-api-jdo-4.2.4.jar

datanucleus-core-4.1.6.jar

datanucleus-rdbms-4.1.19.jar

delta-core_2.12-0.8.0.jar

derby-10.12.1.1.jar

dnsjava-2.1.7.jar

dropwizard-metrics-hadoop-metrics2-reporter-0.1.2.jar

ehcache-3.3.1.jar

error_prone_annotations-2.3.2.jar

failureaccess-1.0.1.jar

flatbuffers-java-1.9.0.jar

fluent-logger-jar-with-dependencies.jar

geronimo-jcache_1.0_spec-1.0-alpha-1.jar

gson-2.2.4.jar

guava-28.0-jre.jar

guice-4.0.jar

guice-servlet-4.0.jar

hadoop-annotations-3.1.3.5.0-35628817.jar

hadoop-auth-3.1.3.5.0-35628817.jar

hadoop-aws-3.1.3.5.0-35628817.jar

hadoop-azure-3.1.3.5.0-35628817.jar

hadoop-client-3.1.3.5.0-35628817.jar

hadoop-common-3.1.3.5.0-35628817.jar

hadoop-hdfs-client-3.1.3.5.0-35628817.jar

hadoop-mapreduce-client-common-3.1.3.5.0-35628817.jar

hadoop-mapreduce-client-core-3.1.3.5.0-35628817.jar

hadoop-mapreduce-client-jobclient-3.1.3.5.0-35628817.jar

hadoop-openstack-3.1.3.5.0-35628817.jar

hadoop-yarn-api-3.1.3.5.0-35628817.jar

hadoop-yarn-client-3.1.3.5.0-35628817.jar

hadoop-yarn-common-3.1.3.5.0-35628817.jar

hadoop-yarn-registry-3.1.3.5.0-35628817.jar

hadoop-yarn-server-common-3.1.3.5.0-35628817.jar

hadoop-yarn-server-web-proxy-3.1.3.5.0-35628817.jar

hive-beeline-2.3.7.jar

hive-cli-2.3.7.jar

hive-common-2.3.7.jar

hive-exec-2.3.7-core.jar

hive-jdbc-2.3.7.jar

hive-llap-common-2.3.7.jar

hive-metastore-2.3.7.jar

hive-serde-2.3.7.jar

hive-shims-0.23-2.3.7.jar

hive-shims-2.3.7.jar

hive-shims-common-2.3.7.jar

hive-shims-scheduler-2.3.7.jar

hive-storage-api-2.7.1.jar

hive-vector-code-gen-2.3.7.jar

hk2-api-2.6.1.jar

hk2-locator-2.6.1.jar

hk2-utils-2.6.1.jar

htrace-core4-4.1.0-incubating.jar

httpclient-4.5.6.jar

httpcore-4.4.12.jar

httpmime-4.5.6.jar

isolation-forest_3.0.0_2.12-1.0.1.jar

istack-commons-runtime-3.0.8.jar

ivy-2.4.0.jar

j2objc-annotations-1.3.jar

jackson-annotations-2.10.0.jar

jackson-core-2.10.0.jar

jackson-core-asl-1.9.13.jar

jackson-databind-2.10.0.jar

jackson-dataformat-cbor-2.10.0.jar

jackson-jaxrs-base-2.10.0.jar

jackson-jaxrs-json-provider-2.10.0.jar

jackson-mapper-asl-1.9.13.jar

jackson-module-jaxb-annotations-2.10.0.jar

jackson-module-paranamer-2.10.0.jar

jackson-module-scala_2.12-2.10.0.jar

jakarta.activation-api-1.2.1.jar

jakarta.annotation-api-1.3.5.jar

jakarta.inject-2.6.1.jar

jakarta.validation-api-2.0.2.jar

jakarta.ws.rs-api-2.1.6.jar

jakarta.xml.bind-api-2.3.2.jar

janino-3.0.16.jar

javassist-3.25.0-GA.jar

javax.inject-1.jar

javax.jdo-3.2.0-m3.jar

javax.servlet-api-3.1.0.jar

javolution-5.5.1.jar

jaxb-api-2.2.11.jar

jaxb-runtime-2.3.2.jar

jcip-annotations-1.0-1.jar

jcl-over-slf4j-1.7.30.jar

jdo-api-3.0.1.jar

jersey-client-2.30.jar

jersey-common-2.30.jar

jersey-container-servlet-2.30.jar

jersey-container-servlet-core-2.30.jar

jersey-hk2-2.30.jar

jersey-media-jaxb-2.30.jar

jersey-server-2.30.jar

jetty-util-9.4.34.v20201102.jar

jetty-util-ajax-9.3.24.v20180605.jar

jline-2.14.6.jar

joda-time-2.10.5.jar

jodd-core-3.5.2.jar

jpam-1.1.jar

jsch-0.1.54.jar

json-1.8.jar

json-20090211.jar

json-simple-1.1.jar

json-smart-2.3.jar

json4s-ast_2.12-3.6.6.jar

json4s-core_2.12-3.6.6.jar

json4s-jackson_2.12-3.6.6.jar

json4s-scalap_2.12-3.6.6.jar

jsp-api-2.1.jar

jsr305-3.0.0.jar

jta-1.1.jar

jul-to-slf4j-1.7.30.jar

kerb-admin-1.0.1.jar

kerb-client-1.0.1.jar

kerb-common-1.0.1.jar

kerb-core-1.0.1.jar

kerb-crypto-1.0.1.jar

kerb-identity-1.0.1.jar

kerb-server-1.0.1.jar

kerb-simplekdc-1.0.1.jar

kerb-util-1.0.1.jar

kerby-asn1-1.0.1.jar

kerby-config-1.0.1.jar

kerby-pkix-1.0.1.jar

kerby-util-1.0.1.jar

kerby-xdr-1.0.1.jar

kryo-shaded-4.0.2.jar

leveldbjni-all-1.8.jar

libfb303-0.9.3.jar

libthrift-0.12.0.jar

lightgbmlib-2.3.180.jar

listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar

log4j-1.2.17.jar

lz4-java-1.7.1.jar

machinist_2.12-0.6.8.jar

macro-compat_2.12-1.1.1.jar

mdsdclientdynamic-2.0.jar

metrics-core-4.1.1.jar

metrics-graphite-4.1.1.jar

metrics-jmx-4.1.1.jar

metrics-json-4.1.1.jar

metrics-jvm-4.1.1.jar

microsoft-catalog-metastore-client-1.0.44.jar

microsoft-log4j-etwappender-1.0.jar

microsoft-spark.jar

minlog-1.3.0.jar

mmlspark_2.12-1.0.0-rc3-46-3b91af32-SNAPSHOT.jar

mssql-jdbc-8.4.1.jre8.jar

netty-all-4.1.47.Final.jar

nimbus-jose-jwt-4.41.1.jar

notebook-utils-3.0.0-20210314.1.jar

objenesis-2.5.1.jar

okhttp-2.7.5.jar

okio-1.6.0.jar

opencsv-2.3.jar

opencv-3.2.0-1.jar

orc-core-1.5.10.jar

orc-mapreduce-1.5.10.jar

orc-shims-1.5.10.jar

oro-2.0.8.jar

osgi-resource-locator-1.0.3.jar

paranamer-2.8.jar

parquet-column-1.10.1.jar

parquet-common-1.10.1.jar

parquet-encoding-1.10.1.jar

parquet-format-2.4.0.jar

parquet-hadoop-1.10.1.jar

parquet-jackson-1.10.1.jar

protobuf-java-2.5.0.jar

proton-j-0.33.4.jar

py4j-0.10.9.jar

pyrolite-4.30.jar

qpid-proton-j-extensions-1.2.3.jar

re2j-1.1.jar

scala-collection-compat_2.12-2.1.1.jar

scala-compiler-2.12.10.jar

scala-java8-compat_2.12-0.9.0.jar

scala-library-2.12.10.jar

scala-parser-combinators_2.12-1.1.2.jar

scala-reflect-2.12.10.jar

scala-xml_2.12-1.2.0.jar

scalactic_2.12-3.0.5.jar

shapeless_2.12-2.3.3.jar

shims-0.7.45.jar

slf4j-api-1.7.30.jar

slf4j-log4j12-1.7.16.jar

snappy-java-1.1.8.2.jar

spark-catalyst_2.12-3.0.2.5.0-35628817.jar

spark-core_2.12-3.0.2.5.0-35628817.jar

spark-enhancement_2.12-3.0.2.5.0-35628817.jar

spark-enhancementui_2.12-1.1.0.jar

spark-graphx_2.12-3.0.2.5.0-35628817.jar

spark-hadoop-cloud_2.12-3.0.2.5.0-35628817.jar

spark-hive-thriftserver_2.12-3.0.2.5.0-35628817.jar

spark-hive_2.12-3.0.2.5.0-35628817.jar

spark-kvstore_2.12-3.0.2.5.0-35628817.jar

spark-launcher_2.12-3.0.2.5.0-35628817.jar

spark-microsoft-telemetry_2.12-3.0.2.5.0-35628817.jar

spark-microsoft-tools_2.12-3.0.2.5.0-35628817.jar

spark-mllib-local_2.12-3.0.2.5.0-35628817.jar

spark-mllib_2.12-3.0.2.5.0-35628817.jar

spark-network-common_2.12-3.0.2.5.0-35628817.jar

spark-network-shuffle_2.12-3.0.2.5.0-35628817.jar

spark-repl_2.12-3.0.2.5.0-35628817.jar

spark-sketch_2.12-3.0.2.5.0-35628817.jar

spark-sql_2.12-3.0.2.5.0-35628817.jar

spark-streaming_2.12-3.0.2.5.0-35628817.jar

spark-tags_2.12-3.0.2.5.0-35628817.jar

spark-unsafe_2.12-3.0.2.5.0-35628817.jar

spark-yarn_2.12-3.0.2.5.0-35628817.jar

spark_diagnostic_cli-1.0.2_spark-3.0.0.jar

spire-macros_2.12-0.17.0-M1.jar

spire-platform_2.12-0.17.0-M1.jar

spire-util_2.12-0.17.0-M1.jar

spire_2.12-0.17.0-M1.jar

spray-json_2.12-1.3.2.jar

sqlanalyticsconnector-1.1.jar

stax-api-1.0.1.jar

stax2-api-3.1.4.jar

stream-2.9.6.jar

structuredstreamforspark_2.12-3.0.0-2.1.1.jar

super-csv-2.2.0.jar

synapse-spark-telemetry_2.12-0.0.4.jar

threeten-extra-1.5.0.jar

token-provider-1.0.1.jar

transaction-api-1.1.jar

univocity-parsers-2.9.0.jar

velocity-1.5.jar

vw-jni-8.9.1.jar

wildfly-openssl-1.0.7.Final.jar

woodstox-core-5.0.3.jar

xbean-asm7-shaded-4.15.jar

xz-1.5.jar

zookeeper-3.4.8.5.0-35628817.jar

zstd-jni-1.4.4-3.jar

## Python libraries 

_libgcc_mutex=0.1

_openmp_mutex=4.5

c-ares=1.16.1

ca-certificates=2020.6.20

certifi=2020.6.20

cffi=1.14.3

chardet=3.0.4

cryptography=3.1.1

conda=4.3.21

conda-env=2.6.0

cytoolz=0.8.2

gperftools=2.7

h5py=2.10.0

hdf5=1.10.6

jpeg=9d

krb5=1.17.1

ld_impl_linux-64=2.35

libblas=3.9.0

libcblas=3.9.0

libcurl=7.71.1

libedit=3.1.20191231

libev=4.33

libffi=3.2.1

libgcc-ng=9.3.0

libgfortran-ng=9.3.0

libgfortran4=7.5.0

libgfortran5=9.3.0

libgomp=9.3.0

libiconv=1.16

liblapack=3.9.0

libnghttp2=1.41.0

libopenblas=0.3.12

libssh2=1.9.0

libstdcxx-ng=9.3.0

numpy=1.18.5

ncurses=6.2

openssl=1.1.1

perl=5.32.0

pip=20.2.4

pygments=2.7.3

pyopenssl=19.1.0

python=3.6.11

python_abi=3.6

readline=8.0

requests=2.24.0

sentencepiece=0.1.9

setuptools=41.4.0

six=1.15.0

sqlite=3.33.0

tk=8.6.1

toolz=0.11.1

urllib3=1.25.10

unixodbc=2.3.9

xz=5.2.5

wheel=0.30.0

yaml=0.2.5

zlib=1.2.11

absl-py=0.11.0

adal=1.2.4

adlfs=0.5.5

aiohttp=3.7.2

alembic=1.4.1

altair=4.1.0

appdirs=1.4.4

applicationinsights=0.11.9

asn1crypto=1.4.0

astor=0.8.1

astroid=2.4.2

astunparse=1.6.3

async-timeout=3.0.1

attrs=20.3.0

azure-common=1.1.25

azure-core=1.8.2

azure-datalake-store=0.0.51

azure-graphrbac=0.61.1

azure-identity=1.4.1

azure-mgmt-authorization=0.61.0

azure-mgmt-containerregistry=2.8.0

azure-mgmt-keyvault=2.2.0

azure-mgmt-resource=12.0.0

azure-mgmt-storage=11.2.0

azure-storage-blob=12.5.0

azure-storage-common=2.1.0

azure-storage-queue=12.1.5

azureml-automl-core=1.22.0

azureml-automl-runtime=1.22.0

azureml-core=1.22.0

azureml-dataprep=2.9.0

azureml-dataprep-native=29.0.0

azureml-dataprep-rslex=1.7.0

azureml-dataset-runtime=1.22.0

azureml-defaults=1.22.0

azureml-interpret=1.22.0

azureml-mlflow=1.16.0

azureml-model-management-sdk=1.0.1b6.post1

azureml-opendatasets=1.18.0

azureml-pipeline=1.22.0

azureml-pipeline-core=1.22.0

azureml-pipeline-steps=1.22.0

azureml-sdk=1.22.0

azure-storage-blob=12.5.0

azureml-telemetry=1.22.0

azureml-train=1.22.0

azureml-train-automl=1.22.0

azureml-train-automl-client=1.22.0.post1

azureml-train-automl-runtime=1.22.0.post1

azureml-train-core=1.22.0

azureml-train-restclients-hyperdrive=1.22.0

backports.tempfile=1.0

backports.weakref=1.0.post1

beautifulsoup4=4.9.3

bitarray=1.6.1

bokeh=2.2.3

boto=2.49.0

boto3=1.15.14

botocore=1.18.14

Bottleneck=1.3.2

bpemb=0.3.2

cachetools=4.1.1

certifi=2020.6.20

click=7.1.2

cloudpickle=1.6.0

configparser=3.7.4

contextlib2=0.6.0.post1

cycler=0.10.0

cython=0.29.21

cytoolz=0.8.2

databricks-cli=0.14.0

dataclasses=0.8

datashape=0.5.2

decorator=4.4.2

Deprecated=1.2.10

dill=0.3.2

distro=1.5.0

docker=4.3.1

docutils=0.16

dotnetcore2=2.1.17

entrypoints=0.3

et-xmlfile=1.0.1

filelock=3.0.12

fire=0.3.1

flair=0.5

Flask=1.0.3

fsspec=0.8.4

fusepy=3.0.1

future=0.18.2

gast=0.3.3

gensim=3.8.3

geographiclib=1.50

geopy=2.0.0

gitdb=4.0.5

GitPython=3.1.11

google-auth=1.23.0

google-auth-oauthlib=0.4.2

google-pasta=0.2.0

gorilla=0.3.0

grpcio=1.33.2

gunicorn=19.9.0

html5lib=1.1

hummingbird-ml=0.0.6

hyperopt=0.2.5

idna=2.10

idna-ssl=1.1.0

imageio=2.9.0

importlib-metadata=1.7.0

interpret-community=0.16.0

interpret-core=0.2.1

ipykernel=5.5.3

ipython=7.8.0

ipython-genutils=0.2.0

ipywidgets=7.6.3

isodate=0.6.0

isort=5.6.4

itsdangerous=1.1.0

jdcal=1.4.1

jeepney=0.4.3

Jinja2=2.11.2

jmespath=0.10.0

joblib=0.14.1

json-logging-py=0.2

jsonpickle=1.4.1

jsonschema=3.2.0

Keras-Applications=1.0.8

Keras-Preprocessing=1.1.2

keras2onnx=1.6.0

kiwisolver=1.3.1

koalas=1.2.0

langdetect=1.0.8

lazy-object-proxy=1.4.3

liac-arff=2.5.0

lightgbm=2.3.0

Mako=1.1.3

Markdown=3.3.3

MarkupSafe=1.1.1

matplotlib=3.2.2

mccabe=0.6.1

mistune=0.8.4

mleap=0.16.1

mlflow=1.11.0

more-itertools=8.6.0

mpld3=0.3

mpmath=1.1.0

msal=1.5.0

msal-extensions=0.2.2

msrest=0.6.19

msrestazure=0.6.4

multidict=5.0.0

multipledispatch=0.6.0

mypy=0.780

mypy-extensions=0.4.3

ndg-httpsclient=0.5.1

networkx=2.5

nimbusml=1.7.1

nltk=3.5

nose=1.3.7

oauthlib=3.1.0

odo=0.5.0

olefile=0.46

onnx=1.6.0

onnxconverter-common=1.6.0

onnxmltools=1.4.1

onnxruntime=1.3.0

openpyxl=3.0.5

opt-einsum=3.3.0

packaging=20.4

pandas=0.25.3

pandasql=0.7.3

pathspec=0.8.0

patsy=0.5.1

pickleshare=0.7.5

Pillow=8.0.1

plotly=4.12.0

pluggy=0.13.1

pmdarima=1.1.1

portalocker=1.7.1

prometheus-client=0.8.0

prometheus-flask-exporter=0.18.1

protobuf=3.13.0

psutil=5.7.2

py=1.9.0

py-cpuinfo=5.0.0

py4j=0.10.7

pyarrow=1.0.1

pyasn1=0.4.8

pyasn1-modules=0.2.8

pycrypto=2.6.1

pycparser=2.20

PyJWT=1.7.1

pylint=2.6.0

pymssql=2.1.5

pyodbc=4.0.30

pyopencl=2020.1

pyparsing=2.4.7

pyrsistent=0.17.3

pyspark=3.0.1

pytest=5.3.2

python-dateutil=2.8.1

python-editor=1.0.4

pytools=2021.1

pytz=2020.1

PyWavelets=1.1.1

PyYAML=5.3.1

querystring-parser=1.2.4

regex=2020.10.28

requests-oauthlib=1.3.0

retrying=1.3.3

rsa=4.6

ruamel.yaml=0.16.12

ruamel.yaml.clib=0.2.2

s3transfer=0.3.3

sacremoses=0.0.43

scikit-image=0.17.2

scikit-learn=0.22.2.post1

scipy=1.5.2

seaborn=0.11.0

SecretStorage=3.1.2

segtok=1.5.10

shap=0.34.0

skl2onnx=1.4.9

sklearn-pandas=1.7.0

smart-open=1.9.0

smmap=3.0.4

soupsieve=2.0.1

SQLAlchemy=1.3.13

sqlitedict=1.7.0

sqlparse=0.4.1

statsmodels=0.10.2

tabulate=0.8.7

tb-nightly=1.14.0a20190603

tensorboard=2.3.0

tensorboard-plugin-wit=1.7.0

tensorflow=2.0.0b1

tensorflow-estimator=2.3.0

termcolor=1.1.0

textblob=0.15.3

tf-estimator-nightly=1.14.0.dev2019060501

tf2onnx=1.7.2

tifffile=2020.9.3

tokenizers=0.9.2

toml=0.10.2

torch=1.7.0

tornado=6.1

tqdm=4.48.2

transformers=3.4.0

typed-ast=1.4.1

typing-extensions=3.7.4.3

urllib3=1.25.10

wcwidth=0.2.5

webencodings=0.5.1

websocket-client=0.57.0

Werkzeug=1.0.1

wheel=0.30.0

wrapt=1.11.2

xgboost=0.90

zict=1.0.0

zipp=0.6.0

## Next steps

- [Azure Synapse Analytics](../overview-what-is.md)
- [Apache Spark Documentation](https://spark.apache.org/docs/3.0.2/)
- [Apache Spark Concepts](apache-spark-concepts.md)
