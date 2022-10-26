---
title: Azure Synapse Runtime for Apache Spark 3.2
description: Supported versions of Spark, Scala, Python, and .NET for Apache Spark 3.2.
author: DaniBunny
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 06/13/2022 
ms.author: dacoelho
ms.custom: has-adal-ref, ignite-2022
ms.reviewer: martinle
---

# Azure Synapse Runtime for Apache Spark 3.2

Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document will cover the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.2. 

## Component versions

|  Component   | Version   |  
| ----- | ----- |
| Apache Spark | 3.2.1 |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282 |
| Scala | 2.12.15  |
| Hadoop | 3.3.1  |
| .NET Core | 3.1 |
| .NET | 2.0.0 |
| Delta Lake | 1.2 |
| Python | 3.8 |
| R (Preview) | 4.2 | 

## Scala and Java libraries

HikariCP-2.5.1.jar

JLargeArrays-1.5.jar

JTransforms-3.1.jar

RoaringBitmap-0.9.0.jar

ST4-4.0.4.jar

SparkCustomEvents-3.2.0-1.0.0.jar

TokenLibrary-assembly-3.0.0.jar

VegasConnector-1.1.01_2.12_3.2.0-SNAPSHOT.jar

activation-1.1.1.jar

adal4j-1.6.3.jar

aircompressor-0.21.jar

algebra_2.12-2.0.1.jar

aliyun-java-sdk-core-3.4.0.jar

aliyun-java-sdk-ecs-4.2.0.jar

aliyun-java-sdk-ram-3.0.0.jar

aliyun-java-sdk-sts-3.0.0.jar

aliyun-sdk-oss-3.4.1.jar

annotations-17.0.0.jar

antlr-runtime-3.5.2.jar

antlr4-runtime-4.8.jar

aopalliance-repackaged-2.6.1.jar

apache-log4j-extras-1.2.17.jar

apiguardian-api-1.1.0.jar

arpack-2.2.1.jar

arpack_combined_all-0.1.jar

arrow-format-2.0.0.jar

arrow-memory-core-2.0.0.jar

arrow-memory-netty-2.0.0.jar

arrow-vector-2.0.0.jar

audience-annotations-0.5.0.jar

avro-1.10.2.jar

avro-ipc-1.10.2.jar

avro-mapred-1.10.2.jar

aws-java-sdk-bundle-1.11.901.jar

azure-data-lake-store-sdk-2.3.6.jar

azure-eventhubs-3.3.0.jar

azure-eventhubs-spark_2.12-2.3.21.jar

azure-keyvault-core-1.0.0.jar

azure-storage-7.0.1.jar

azure-synapse-ml-pandas_2.12-1.0.0.jar

azure-synapse-ml-predict_2.12-1.0.jar

blas-2.2.1.jar

bonecp-0.8.0.RELEASE.jar

breeze-macros_2.12-1.2.jar

breeze_2.12-1.2.jar

cats-kernel_2.12-2.1.1.jar

chill-java-0.10.0.jar

chill_2.12-0.10.0.jar

client-sdk-1.14.0.jar

cntk-2.4.jar

commons-cli-1.2.jar

commons-codec-1.15.jar

commons-collections-3.2.2.jar

commons-compiler-3.0.16.jar

commons-compress-1.21.jar

commons-crypto-1.1.0.jar

commons-dbcp-1.4.jar

commons-io-2.8.0.jar

commons-lang-2.6.jar

commons-lang3-3.12.0.jar

commons-logging-1.1.3.jar

commons-math3-3.4.1.jar

commons-net-3.1.jar

commons-pool-1.5.4.jar

commons-pool2-2.6.2.jar

commons-text-1.6.jar

compress-lzf-1.0.3.jar

config-1.3.4.jar

core-1.1.2.jar

cos_api-bundle-5.6.19.jar

cosmos-analytics-spark-3.2.1-connector-1.6.0.jar

cudf-22.02.0-cuda11.jar

curator-client-2.13.0.jar

curator-framework-2.13.0.jar

curator-recipes-2.13.0.jar

datanucleus-api-jdo-4.2.4.jar

datanucleus-core-4.1.17.jar

datanucleus-rdbms-4.1.19.jar

delta-core_2.12-1.2.1.2.jar

derby-10.14.2.0.jar

dropwizard-metrics-hadoop-metrics2-reporter-0.1.2.jar

flatbuffers-java-1.9.0.jar

fluent-logger-jar-with-dependencies-jdk8.jar

gson-2.8.6.jar

guava-14.0.1.jar

hadoop-aliyun-3.3.1.5.0-57088972.jar

hadoop-annotations-3.3.1.5.0-57088972.jar

hadoop-aws-3.3.1.5.0-57088972.jar

hadoop-azure-3.3.1.5.0-57088972.jar

hadoop-azure-datalake-3.3.1.5.0-57088972.jar

hadoop-client-api-3.3.1.5.0-57088972.jar

hadoop-client-runtime-3.3.1.5.0-57088972.jar

hadoop-cloud-storage-3.3.1.5.0-57088972.jar

hadoop-cos-3.3.1.5.0-57088972.jar

hadoop-openstack-3.3.1.5.0-57088972.jar

hadoop-shaded-guava-1.1.0.jar

hadoop-yarn-server-web-proxy-3.3.1.5.0-57088972.jar

hdinsight-spark-metrics-3.2.0-1.0.0.jar

hive-beeline-2.3.9.jar

hive-cli-2.3.9.jar

hive-common-2.3.9.jar

hive-exec-2.3.9-core.jar

hive-jdbc-2.3.9.jar

hive-llap-common-2.3.9.jar

hive-metastore-2.3.9.jar

hive-serde-2.3.9.jar

hive-service-rpc-3.1.2.jar

hive-shims-0.23-2.3.9.jar

hive-shims-2.3.9.jar

hive-shims-common-2.3.9.jar

hive-shims-scheduler-2.3.9.jar

hive-storage-api-2.7.2.jar

hive-vector-code-gen-2.3.9.jar

hk2-api-2.6.1.jar

hk2-locator-2.6.1.jar

hk2-utils-2.6.1.jar

htrace-core4-4.1.0-incubating.jar

httpclient-4.5.13.jar

httpclient-4.5.6.jar

httpcore-4.4.14.jar

httpmime-4.5.13.jar

httpmime-4.5.6.jar

hyperspace-core-spark3.2_2.12-0.5.1-synapse.jar

impulse-core_spark3.2_2.12-0.1.8.jar

impulse-telemetry-mds_spark3.2_2.12-0.1.8.jar

isolation-forest_3.2.0_2.12-2.0.8.jar

istack-commons-runtime-3.0.8.jar

ivy-2.5.0.jar

jackson-annotations-2.12.3.jar

jackson-core-2.12.3.jar

jackson-core-asl-1.9.13.jar

jackson-databind-2.12.3.jar

jackson-dataformat-cbor-2.12.3.jar

jackson-mapper-asl-1.9.13.jar

jackson-module-scala_2.12-2.12.3.jar

jakarta.annotation-api-1.3.5.jar

jakarta.inject-2.6.1.jar

jakarta.servlet-api-4.0.3.jar

jakarta.validation-api-2.0.2.jar

jakarta.ws.rs-api-2.1.6.jar

jakarta.xml.bind-api-2.3.2.jar

janino-3.0.16.jar

javassist-3.25.0-GA.jar

javatuples-1.2.jar

javax.jdo-3.2.0-m3.jar

javolution-5.5.1.jar

jaxb-api-2.2.11.jar

jaxb-runtime-2.3.2.jar

jcl-over-slf4j-1.7.30.jar

jdo-api-3.0.1.jar

jdom-1.1.jar

jersey-client-2.34.jar

jersey-common-2.34.jar

jersey-container-servlet-2.34.jar

jersey-container-servlet-core-2.34.jar

jersey-hk2-2.34.jar

jersey-server-2.34.jar

jettison-1.1.jar

jetty-util-9.4.43.v20210629.jar

jetty-util-ajax-9.4.43.v20210629.jar

jline-2.14.6.jar

joda-time-2.10.10.jar

jodd-core-3.5.2.jar

jpam-1.1.jar

jsch-0.1.54.jar

json-1.8.jar

json-20090211.jar

json-20210307.jar

json-simple-1.1.jar

json4s-ast_2.12-3.7.0-M11.jar

json4s-core_2.12-3.7.0-M11.jar

json4s-jackson_2.12-3.7.0-M11.jar

json4s-scalap_2.12-3.7.0-M11.jar

jsr305-3.0.0.jar

jta-1.1.jar

jul-to-slf4j-1.7.30.jar

junit-jupiter-5.5.2.jar

junit-jupiter-api-5.5.2.jar

junit-jupiter-engine-5.5.2.jar

junit-jupiter-params-5.5.2.jar

junit-platform-commons-1.5.2.jar

junit-platform-engine-1.5.2.jar

kafka-clients-2.8.0.jar

kryo-shaded-4.0.2.jar

kusto-data-2.7.0.jar

kusto-ingest-2.7.0.jar

kusto-spark_3.0_2.12-2.7.5.jar

lapack-2.2.1.jar

leveldbjni-all-1.8.jar

libfb303-0.9.3.jar

libshufflejni.so

libthrift-0.12.0.jar

libvegasjni.so

lightgbmlib-3.2.110.jar

log4j-1.2.17.jar

lz4-java-1.7.1.jar

macro-compat_2.12-1.1.1.jar

mdsdclientdynamic-2.0.jar

metrics-core-4.2.0.jar

metrics-graphite-4.2.0.jar

metrics-jmx-4.2.0.jar

metrics-json-4.2.0.jar

metrics-jvm-4.2.0.jar

microsoft-catalog-metastore-client-1.0.63.jar

microsoft-log4j-etwappender-1.0.jar

microsoft-spark.jar

minlog-1.3.0.jar

mmlspark-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-cognitive-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-core-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-deep-learning-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-lightgbm-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-opencv-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mmlspark-vw-1.0.0-rc3-194-14bef9b1-SNAPSHOT.jar

mssql-jdbc-8.4.1.jre8.jar

mysql-connector-java-8.0.18.jar

netty-all-4.1.68.Final.jar

notebook-utils-3.2.0-20220208.5.jar

objenesis-2.6.jar

onnxruntime_gpu-1.8.1.jar

opencsv-2.3.jar

opencv-3.2.0-1.jar

opentest4j-1.2.0.jar

orc-core-1.6.12.jar

orc-mapreduce-1.6.12.jar

orc-shims-1.6.12.jar

oro-2.0.8.jar

osgi-resource-locator-1.0.3.jar

paranamer-2.8.jar

parquet-column-1.12.2.jar

parquet-common-1.12.2.jar

parquet-encoding-1.12.2.jar

parquet-format-structures-1.12.2.jar

parquet-hadoop-1.12.2.jar

parquet-jackson-1.12.2.jar

peregrine-spark-0.10.jar

postgresql-42.2.9.jar

protobuf-java-2.5.0.jar

proton-j-0.33.8.jar

py4j-0.10.9.3.jar

pyrolite-4.30.jar

qpid-proton-j-extensions-1.2.4.jar

rapids-4-spark_2.12-22.02.0-SNAPSHOT.jar

rocksdbjni-6.20.3.jar

scala-collection-compat_2.12-2.1.1.jar

scala-compiler-2.12.15.jar

scala-java8-compat_2.12-0.9.0.jar

scala-library-2.12.15.jar

scala-parser-combinators_2.12-1.1.2.jar

scala-reflect-2.12.15.jar

scala-xml_2.12-1.2.0.jar

scalactic_2.12-3.0.5.jar

shapeless_2.12-2.3.3.jar

shims-0.9.0.jar

slf4j-api-1.7.30.jar

slf4j-log4j12-1.7.16.jar

snappy-java-1.1.8.4.jar

spark-3.2-rpc-history-server-app-listener_2.12-1.0.0.jar

spark-3.2-rpc-history-server-core_2.12-1.0.0.jar

spark-avro_2.12-3.2.1.5.0-57088972.jar

spark-catalyst_2.12-3.2.1.5.0-57088972.jar

spark-cdm-connector-assembly-1.19.2.jar

spark-core_2.12-3.2.1.5.0-57088972.jar

spark-enhancement_2.12-3.2.1.5.0-57088972.jar

spark-enhancementui_2.12-3.0.0.jar

spark-graphx_2.12-3.2.1.5.0-57088972.jar

spark-hadoop-cloud_2.12-3.2.1.5.0-57088972.jar

spark-hive-thriftserver_2.12-3.2.1.5.0-57088972.jar

spark-hive_2.12-3.2.1.5.0-57088972.jar

spark-kusto-synapse-connector_3.1_2.12-1.0.0.jar

spark-kvstore_2.12-3.2.1.5.0-57088972.jar

spark-launcher_2.12-3.2.1.5.0-57088972.jar

spark-microsoft-tools_2.12-3.2.1.5.0-57088972.jar

spark-mllib-local_2.12-3.2.1.5.0-57088972.jar

spark-mllib_2.12-3.2.1.5.0-57088972.jar

spark-mssql-connector-1.2.0.jar

spark-network-common_2.12-3.2.1.5.0-57088972.jar

spark-network-shuffle_2.12-3.2.1.5.0-57088972.jar

spark-repl_2.12-3.2.1.5.0-57088972.jar

spark-sketch_2.12-3.2.1.5.0-57088972.jar

spark-sql-kafka-0-10_2.12-3.2.1.5.0-57088972.jar

spark-sql_2.12-3.2.1.5.0-57088972.jar

spark-streaming-kafka-0-10-assembly_2.12-3.2.1.5.0-57088972.jar

spark-streaming-kafka-0-10_2.12-3.2.1.5.0-57088972.jar

spark-streaming_2.12-3.2.1.5.0-57088972.jar

spark-tags_2.12-3.2.1.5.0-57088972.jar

spark-token-provider-kafka-0-10_2.12-3.2.1.5.0-57088972.jar

spark-unsafe_2.12-3.2.1.5.0-57088972.jar

spark-yarn_2.12-3.2.1.5.0-57088972.jar

spark_diagnostic_cli-1.0.11_spark-3.2.0.jar

spire-macros_2.12-0.17.0.jar

spire-platform_2.12-0.17.0.jar

spire-util_2.12-0.17.0.jar

spire_2.12-0.17.0.jar

spray-json_2.12-1.3.2.jar

sqlanalyticsconnector_3.2.0-1.0.0.jar

stax-api-1.0.1.jar

stream-2.9.6.jar

structuredstreamforspark_2.12-3.0.1-2.1.3.jar

super-csv-2.2.0.jar

synapse-spark-telemetry_2.12-0.0.6.jar

synfs-3.2.0-20220208.5.jar

threeten-extra-1.5.0.jar

tink-1.6.0.jar

transaction-api-1.1.jar

univocity-parsers-2.9.1.jar

velocity-1.5.jar

vw-jni-8.9.1.jar

wildfly-openssl-1.0.7.Final.jar

xbean-asm9-shaded-4.20.jar

xz-1.8.jar

zookeeper-3.6.2.5.0-57088972.jar

zookeeper-jute-3.6.2.5.0-57088972.jar

zstd-jni-1.5.0-4.jar

## Python libraries (Normal VMs)

_libgcc_mutex=0.1

_openmp_mutex=4.5
_py-xgboost-mutex=2.0

abseil-cpp=20210324.0

absl-py=0.13.0

adal=1.2.7

adlfs=0.7.7

aiohttp=3.7.4.post0

alsa-lib=1.2.3

appdirs=1.4.4

arrow-cpp=3.0.0
 
astor=0.8.1

astunparse=1.6.3

async-timeout=3.0.1

attrs=21.2.0

aws-c-cal=0.5.11

aws-c-common=0.6.2

aws-c-event-stream=0.2.7

aws-c-io=0.10.5

aws-checksums=0.1.11

aws-sdk-cpp=1.8.186

azure-datalake-store=0.0.51

azure-identity=2021.03.15b1

azure-storage-blob=12.8.1

backcall=0.2.0

backports=1.0

backports.functools_lru_cache=1.6.4

beautifulsoup4=4.9.3

blas=2.109

blas-devel=3.9.0

blinker=1.4

blosc=1.21.0

bokeh=2.3.2

brotli=1.0.9

brotli-bin=1.0.9

brotli-python=1.0.9

brotlipy=0.7.0

brunsli=0.1

bzip2=1.0.8

c-ares=1.17.1

ca-certificates=2021.7.5

cachetools=4.2.2

cairo=1.16.0

certifi=2021.5.30

cffi=1.14.5

chardet=4.0.0

charls=2.2.0

click=8.0.1

cloudpickle=1.6.0

conda=4.9.2

conda-package-handling=1.7.3

configparser=5.0.2

cryptography=3.4.7

cudatoolkit=11.1.1

cycler=0.10.0

cython=0.29.23

cytoolz=0.11.0

dash=1.20.0

dash-core-components=1.16.0

dash-html-components=1.1.3

dash-renderer=1.9.1

dash-table=4.11.3

dash_cytoscape=0.2.0

dask-core=2021.6.2

databricks-cli=0.12.1

dataclasses=0.8

dbus=1.13.18

debugpy=1.3.0

decorator=4.4.2

dill=0.3.4

entrypoints=0.3

et_xmlfile=1.1.0

expat=2.4.1

fire=0.4.0

flask=2.0.1

flask-compress=1.10.1

fontconfig=2.13.1

freetype=2.10.4

fsspec=2021.6.1

future=0.18.2

gast=0.3.3

gensim=3.8.3

geographiclib=1.52

geopy=2.1.0

gettext=0.21.0

gevent=21.1.2

gflags=2.2.2

giflib=5.2.1

gitdb=4.0.7

gitpython=3.1.18

glib=2.68.3

glib-tools=2.68.3

glog=0.5.0

gobject-introspection=1.68.0

google-auth=1.32.1

google-auth-oauthlib=0.4.1

google-pasta=0.2.0

greenlet=1.1.0

grpc-cpp=1.37.1

grpcio=1.37.1

gst-plugins-base=1.18.4

gstreamer=1.18.4

h5py=2.10.0

hdf5=1.10.6

html5lib=1.1

hummingbird-ml=0.4.0

icu=68.1=h58526e2_0

idna=2.10

imagecodecs=2021.3.31

imageio=2.9.0

importlib-metadata=4.6.1

intel-openmp=2021.2.0

interpret=0.2.4

interpret-core=0.2.4

ipykernel=6.0.1

ipython=7.23.1

ipython_genutils=0.2.0

isodate=0.6.0

itsdangerous=2.0.1

jdcal=1.4.1

jedi=0.18.0

jinja2=3.0.1

joblib=1.0.1

jpeg=9d

jupyter_client=6.1.12

jupyter_core=4.7.1

jxrlib=1.1

keras-applications=1.0.8

keras-preprocessing=1.1.2

keras2onnx=1.6.5

kiwisolver=1.3.1

koalas=1.8.0

krb5=1.19.1

lcms2=2.12

ld_impl_linux-64=2.36.1

lerc=2.2.1

liac-arff=2.5.0

libaec=1.0.5

libblas=3.9.0

libbrotlicommon=1.0.9

libbrotlidec=1.0.9

libbrotlienc=1.0.9

libcblas=3.9.0

libclang=11.1.0

libcurl=7.77.0

libdeflate=1.7

libedit=3.1.20210216

libev=4.33

libevent=2.1.10

libffi=3.3

libgcc-ng=9.3.0

libgfortran-ng=9.3.0

libgfortran5=9.3.0

libglib=2.68.3

libiconv=1.16

liblapack=3.9.0

liblapacke=3.9.0

libllvm10=10.0.1

libllvm11=11.1.0

libnghttp2=1.43.0

libogg=1.3.5

libopus=1.3.1

libpng=1.6.37

libpq=13.3

libprotobuf=3.15.8

libsodium=1.0.18

libssh2=1.9.0

libstdcxx-ng=9.3.0

libthrift=0.14.1

libtiff=4.2.0

libutf8proc=2.6.1

libuuid=2.32.1000

libuv=1.41.1

libvorbis=1.3.7

libwebp-base=1.2.0

libxcb=1.14

libxgboost=1.4.0

libxkbcommon=1.0.3

libxml2=2.9.12

libzopfli=1.0.3

lightgbm=3.2.1

lime=0.2.0.1

llvm-openmp=11.1.0

llvmlite=0.36.0

locket=0.2.1

lz4-c=1.9.3

markdown=3.3.4

markupsafe=2.0.1

matplotlib=3.4.2

matplotlib-base=3.4.2

matplotlib-inline=0.1.2

mkl=2021.2.0

mkl-devel=2021.2.0

mkl-include=2021.2.0

mleap=0.17.0

mlflow-skinny=1.18.0

msal=2021.06.08

msal-extensions=2021.06.08

msrest=2021.06.01

multidict=5.1.0

mysql-common=8.0.25

mysql-libs=8.0.25

ncurses=6.2

networkx=2.5.1

ninja=1.10.2

nltk=3.6.2

nspr=4.30

nss=3.67

numba=0.53.1

numpy=1.19.4

oauthlib=3.1.1

olefile=0.46

onnx=1.9.0

onnxconverter-common=1.7.0

onnxmltools=1.7.0

onnxruntime=1.7.2

openjpeg=2.4.0

openpyxl=3.0.7

openssl=1.1.1k

opt_einsum=3.3.0

orc=1.6.7=heec2584_1

packaging=21.0

pandas=1.2.3

parquet-cpp=1.5.1

parso=0.8.2

partd=1.2.0

patsy=0.5.1

pcre=8.45

pexpect=4.8.0

pickleshare=0.7.5

pillow=8.2.0

pip=21.1.1

pixman=0.40.0

plotly=4.14.3

pmdarima=1.8.2

pooch=1.4.0

portalocker=1.7.1

prompt-toolkit=3.0.19

protobuf=3.15.8

psutil=5.8.0

ptyprocess=0.7.0

py-xgboost=1.4.0

py4j=0.10.9

pyarrow=3.0.0

pyasn1=0.4.8

pyasn1-modules=0.2.8

pycairo=1.20.1

pycosat=0.6.3

pycparser=2.20

pygments=2.9.0

pygobject=3.40.1

pyjwt=2.1.0

pyodbc=4.0.30

pyopenssl=20.0.1

pyparsing=2.4.7

pyqt=5.12.3

pyqt-impl=5.12.3

pyqt5-sip=4.19.18

pyqtchart=5.12

pyqtwebengine=5.12.1

pysocks=1.7.1

python=3.8.10

python-dateutil=2.8.1

python-flatbuffers=1.12

python_abi=3.8

pytorch=1.8.1

pytz=2021.1

pyu2f=0.1.5

pywavelets=1.1.1

pyyaml=5.4.1

pyzmq=22.1.0

qt=5.12.9

re2=2021.04.01

readline=8.1

regex=2021.7.6

requests=2.25.1

requests-oauthlib=1.3.0

retrying=1.3.3

rsa=4.7.2

ruamel_yaml=0.15.100

s2n=1.0.10

salib=1.3.11

scikit-image=0.18.1

scikit-learn=0.23.2

scipy=1.5.3

seaborn=0.11.1

seaborn-base=0.11.1

setuptools=49.6.0

shap=0.39.0

six=1.16.0

skl2onnx=1.8.0.1

sklearn-pandas=2.2.0

slicer=0.0.7

smart_open=5.1.0

smmap=3.0.5

snappy=1.1.8

soupsieve=2.2.1

sqlite=3.36.0

statsmodels=0.12.2

tabulate=0.8.9

tenacity=7.0.0

tensorboard=2.4.1

tensorboard-plugin-wit=1.8.0

tensorflow=2.4.1

tensorflow-base=2.4.1

tensorflow-estimator=2.4.0

termcolor=1.1.0

textblob=0.15.3

threadpoolctl=2.1.0

tifffile=2021.4.8

tk=8.6.10

toolz=0.11.1

tornado=6.1

tqdm=4.61.2

traitlets=5.0.5

typing-extensions=3.10.0.0

typing_extensions=3.10.0.0

unixodbc=2.3.9

urllib3=1.26.4

wcwidth=0.2.5

webencodings=0.5.1

werkzeug=2.0.1

wheel=0.36.2

wrapt=1.12.1

xgboost=1.4.0

xorg-kbproto=1.0.7002

xorg-libice=1.0.10

xorg-libsm=1.2.3

xorg-libx11=1.7.2

xorg-libxext=1.3.4

xorg-libxrender=0.9.10003

xorg-renderproto=0.11.1002

xorg-xextproto=7.3.0002

xorg-xproto=7.0.31007

xz=5.2.5

yaml=0.2.5

yarl=1.6.3

zeromq=4.3.4

zfp=0.5.5

zipp=3.5.0

zlib=1.2.11010

zope.event=4.5.0

zope.interface=5.4.0

zstd=1.4.9

azure-common==1.1.27

azure-core==1.16.0

azure-graphrbac==0.61.1

azure-mgmt-authorization==0.61.0

azure-mgmt-containerregistry==8.0.0

azure-mgmt-core==1.3.0

azure-mgmt-keyvault==2.2.0

azure-mgmt-resource==13.0.0

azure-mgmt-storage==11.2.0

azureml-core==1.34.0

azureml-mlflow==1.34.0

azureml-opendatasets==1.34.0

backports-tempfile==1.0

backports-weakref==1.0.post1

contextlib2==0.6.0.post1

docker==4.4.4

ipywidgets==7.6.3

jeepney==0.6.0

jmespath==0.10.0

jsonpickle==2.0.0

kqlmagiccustom==0.1.114.post8

lxml==4.6.5

msrestazure==0.6.4

mypy==0.780

mypy-extensions==0.4.3

ndg-httpsclient==0.5.1

pandasql==0.7.3

pathspec==0.8.1    

prettytable==2.4.0

pyperclip==1.8.2

ruamel-yaml==0.17.4

ruamel-yaml-clib==0.2.6

secretstorage==3.3.1

sqlalchemy==1.4.20

typed-ast==1.4.3

torchvision==0.9.1

websocket-client==1.1.0

## Python libraries (GPU Accelerated VMs)

_libgcc_mutex=0.1

_openmp_mutex=4.5

_py-xgboost-mutex=2.0

_tflow_select=2.3.0

abseil-cpp=20210324.1

absl-py=0.13.0

adal=1.2.7

adlfs=0.7.7

aiohttp=3.7.4.post0

appdirs=1.4.4

arrow-cpp=3.0.0

astor=0.8.1

astunparse=1.6.3

async-timeout=3.0.1

attrs=21.2.0

aws-c-cal=0.5.11

aws-c-common=0.6.2

aws-c-event-stream=0.2.7

aws-c-io=0.10.5

aws-checksums=0.1.11

aws-sdk-cpp=1.8.186

azure-datalake-store=0.0.51

azure-storage-blob=12.9.0

backcall=0.2.0

backports=1.0

backports.functools_lru_cache=1.6.4

beautifulsoup4=4.9.3

blas=2.111

blas-devel=3.9.0

blinker=1.4

bokeh=2.3.2

brotli=1.0.9

brotli-bin=1.0.9

brotli-python=1.0.9

brotlipy=0.7.0

bzip2=1.0.8

c-ares=1.17.2

ca-certificates=2021.5.30

cachetools=4.2.2

cairo=1.16.0

certifi=2021.5.30

cffi=1.14.6

chardet=4.0.0

click=8.0.1

colorama=0.4.4

conda=4.9.2

conda-package-handling=1.7.3

configparser=5.0.2

cryptography=3.4.7

cudatoolkit=11.1.1

cycler=0.10.0

cython=0.29.24

cytoolz=0.11.0

dash=1.21.0

dash-core-components=1.17.1

dash-html-components=1.1.4

dash-renderer=1.9.1

dash-table=4.12.0

dash_cytoscape=0.2.0

dask-core=2021.9.1

databricks-cli=0.12.1

dataclasses=0.8

dbus=1.13.18

debugpy=1.4.1

decorator=5.1.0

dill=0.3.4

entrypoints=0.3

et_xmlfile=1.0.1001

expat=2.4.1

ffmpeg=4.3

fire=0.4.0

flask=2.0.1

flask-compress=1.10.1

fontconfig=2.13.1

freetype=2.10.4

fsspec=2021.8.1

future=0.18.2

g-ir-build-tools=1.68.0

g-ir-host-tools=1.68.0

gensim=3.8.3

geographiclib=1.52

geopy=2.1.0

gettext=0.19.8.1

gevent=21.8.0

gflags=2.2.2

gitdb=4.0.7

gitpython=3.1.23

glib=2.68.4

glib-tools=2.68.4

glog=0.5.0

gmp=6.2.1

gnutls=3.6.13

gobject-introspection=1.68.0

google-auth=1.35.0

google-auth-oauthlib=0.4.6

google-pasta=0.2.0

greenlet=1.1.1

grpc-cpp=1.37.1

gst-plugins-base=1.14.0

gstreamer=1.14.0

h5py=2.10.0

hdf5=1.10.6

html5lib=1.1

hummingbird-ml=0.4.0

icu=58.2

idna=2.10

imagecodecs-lite=2019.12.3

imageio=2.9.0

importlib-metadata=4.8.1

interpret=0.2.4

interpret-core=0.2.4

ipykernel=6.4.1

ipython=7.23.1

ipython_genutils=0.2.0

isodate=0.6.0

itsdangerous=2.0.1

jdcal=1.4.1

jedi=0.18.0

jinja2=3.0.1

joblib=1.0.1

jpeg=9b

jupyter_client=7.0.3

jupyter_core=4.8.1

keras=2.4.3

keras-applications=1.0.8

keras-preprocessing=1.1.2

keras2onnx=1.6.5

kiwisolver=1.3.2

koalas=1.8.0

krb5=1.19.2

lame=3.100

ld_impl_linux-64=2.36.1

liac-arff=2.5.0

libblas=3.9.0

libbrotlicommon=1.0.9

libbrotlidec=1.0.9

libbrotlienc=1.0.9

libcblas=3.9.0

libcurl=7.79.1

libedit=3.1.20191231

libev=4.33

libevent=2.1.10

libffi=3.4.2

libgcc-ng=11.2.0

libgfortran-ng=11.2.0

libgfortran5=11.2.0

libgirepository=1.68.0

libglib=2.68.4

libiconv=1.16

liblapack=3.9.0

liblapacke=3.9.0

libllvm11=11.1.0

libnghttp2=1.43.0

libpng=1.6.37

libprotobuf=3.16.0

libsodium=1.0.18

libssh2=1.10.0

libstdcxx-ng=11.2.0

libthrift=0.14.1

libtiff=4.2.0

libutf8proc=2.6.1

libuuid=2.32.1

libuv=1.42.0

libwebp-base=1.2.1

libxcb=1.13

libxgboost=1.4.0

libxml2=2.9.9

lightgbm=3.2.1

lime=0.2.0.1

llvm-openmp=12.0.1

llvmlite=0.37.0

locket=0.2.0

lz4-c=1.9.3

markdown=3.3.4

markupsafe=2.0.1

matplotlib=3.4.2

matplotlib-base=3.4.2

matplotlib-inline=0.1.3

mkl=2021.3.0

mkl-devel=2021.3.0

mkl-include=2021.3.0

mleap=0.17.0

mlflow-skinny=1.18.0

msal=2021.09.01

msrest=2021.09.01

multidict=5.1.0

multiprocess=0.70.12.2

ncurses=6.2

nest-asyncio=1.5.1

nettle=3.6

networkx=2.5

ninja=1.10.2

nltk=3.6.2

numba=0.54.0

numpy=1.19.4

oauthlib=3.1.1

olefile=0.46

onnx=1.9.0

onnxconverter-common=1.7.0

onnxmltools=1.7.0

onnxruntime=1.7.2

openh264=2.1.1

openpyxl=3.0.7

openssl=1.1.1l

opt_einsum=3.3.0

orc=1.6.7

packaging=21.0

pandas=1.2.3

parquet-cpp=1.5.1

parso=0.8.2

partd=1.2.0

pathos=0.2.8

patsy=0.5.1

pcre=8.45

pexpect=4.8.0

pickleshare=0.7.5003

pillow=7.1.2

pip=21.1.1

pixman=0.38.0

pkg-config=0.29.2

plotly=4.14.3

pmdarima=1.8.2

pooch=1.5.1

portalocker=1.7.1

pox=0.3.0

ppft=1.6.6.4

prompt-toolkit=3.0.20

protobuf=3.16.0

psutil=5.8.0

pthread-stubs=0.4

ptyprocess=0.7.0

py-xgboost=1.4.0

py4j=0.10.9

pyarrow=3.0.0

pyasn1=0.4.8

pyasn1-modules=0.2.7

pycairo=1.20.1

pycosat=0.6.3

pycparser=2.20

pydeprecate=0.3.1

pygments=2.10.0

pygobject=3.40.1

pyjwt=2.1.0

pyodbc=4.0.30

pyopenssl=20.0.1

pyparsing=2.4.7

pyqt=5.9.2

pysocks=1.7.1

pyspark=3.1.2

python=3.8.12

python-dateutil=2.8.2

python_abi=3.8

pytorch=1.8.1

pytorch-lightning=1.4.2

pytz=2021.1

pyu2f=0.1.5

pywavelets=1.1.1

pyyaml=5.4.1

pyzmq=22.3.0

qt=5.9.7

re2=2021.04.01

readline=8.1

regex=2021.8.28

requests=2.25.1

requests-oauthlib=1.3.0

retrying=1.3.3

rsa=4.7.2

ruamel_yaml=0.15.80

s2n=1.0.10

salib=1.4.5

scikit-image=0.18.1

scikit-learn=0.23.2

scipy=1.7.1

seaborn=0.11.1

seaborn-base=0.11.1

setuptools=49.6.0

shap=0.39.0

sip=4.19.13

skl2onnx=1.8.0.1

sklearn-pandas=2.2.0

slicer=0.0.7

smart_open=5.2.1

smmap=3.0.5

snappy=1.1.8

soupsieve=2.0.1

sqlite=3.36.0

statsmodels=0.12.2

tabulate=0.8.9

tbb=2021.3.0

tenacity=8.0.1

tensorboard=2.6.0

tensorboard-data-server=0.6.0

tensorboard-plugin-wit=1.8.0

tensorflow=2.4.1

tensorflow-base=2.4.1

termcolor=1.1.0

textblob=0.15.3

threadpoolctl=2.2.0

tifffile=2020.6.3

tk=8.6.11

toolz=0.11.1

torchaudio=0.8.1

torchmetrics=0.5.1

torchvision=0.9.1

tornado=6.1

tqdm=4.62.3

traitlets=5.1.0

unixodbc=2.3.9

urllib3=1.26.4

wcwidth=0.2.5

webencodings=0.5.1

werkzeug=2.0.1

wheel=0.37.0

wrapt=1.12.1

xgboost=1.4.0

xorg-kbproto=1.0.7

xorg-libice=1.0.10

xorg-libsm=1.2.3

xorg-libx11=1.7.2

xorg-libxau=1.0.9

xorg-libxdmcp=1.1.3

xorg-libxext=1.3.4

xorg-libxrender=0.9.10

xorg-renderproto=0.11.1

xorg-xextproto=7.3.0

xorg-xproto=7.0.31

xz=5.2.5

yaml=0.2.5

yarl=1.6.3

zeromq=4.3.4

zipp=3.5.0

zlib=1.2.11

zope.event=4.5.0

zope.interface=5.4.0

zstd=1.4.9

applicationinsights==0.11.10

argon2-cffi==21.1.0

azure-common==1.1.27

azure-core==1.18.0

azure-graphrbac==0.61.1

azure-identity==1.4.1

azure-mgmt-authorization==0.61.0

azure-mgmt-containerregistry==8.1.0

azure-mgmt-core==1.3.0

azure-mgmt-keyvault==9.1.0

azure-mgmt-resource==13.0.0

azure-mgmt-storage==11.2.0

azureml-core==1.34.0

azureml-dataprep==2.22.2

azureml-dataprep-native==38.0.0

azureml-dataprep-rslex==1.20.2

azureml-dataset-runtime==1.34.0

azureml-mlflow==1.34.0

azureml-opendatasets==1.34.0

azureml-telemetry==1.34.0

backports-tempfile==1.0

backports-weakref==1.0.post1

bleach==4.1.0

cloudpickle==1.6.0

contextlib2==21.6.0

defusedxml==0.7.1

diskcache==5.2.1

distro==1.6.0

docker==5.0.2

dotnetcore2==2.1.21

flatbuffers==1.12

fusepy==3.0.1

gast==0.3.3

grpcio==1.32.0

ipywidgets==7.6.5

jeepney==0.7.1

jmespath==0.10.0

jsonpickle==2.0.0

jsonschema==4.1.2

jupyterlab-pygments==0.1.2

jupyterlab-widgets==1.0.2

kqlmagiccustom==0.1.114.post8

lxml==4.7.1

mistune==0.8.4

msal-extensions==0.2.2

msrestazure==0.6.4

mypy==0.780

mypy-extensions==0.4.3

nbclient==0.5.4

nbconvert==6.2.0

nbformat==5.1.3

ndg-httpsclient==0.5.1

notebook==6.4.5

opencv-python==4.5.3.56

pandasql==0.7.3

pandocfilters==1.5.0

pathspec==0.9.0

petastorm==0.11.3

prettytable==3.0.0

prometheus-client==0.12.0

pyperclip==1.8.2

pyrsistent==0.18.0

ruamel-yaml==0.17.4

ruamel-yaml-clib==0.2.6

secretstorage==3.3.1

send2trash==1.8.0

six==1.15.0

sqlalchemy==1.4.25

tensorflow-estimator==2.4.0

tensorflow-gpu==2.4.1

terminado==0.12.1

testpath==0.5.0

typed-ast==1.4.3

typing-extensions==3.7.4.3

websocket-client==1.2.1

widgetsnbextension==3.5.2

## R libraries (Preview)

abind	1.4-5

anomalize	0.2.2

anytime	0.3.9

arrow	7.0.0

askpass	1.1

assertthat	0.2.1

backports	1.4.1

base64enc	0.1-3

BH	1.78.0-0

bit	4.0.4

bit64	4.0.5

blob	1.2.3

brew	1.0-7

brio	1.1.3

broom	0.8.0

bslib	0.3.1

cachem	1.0.6

callr	3.7.0

car	3.0-13

carData	3.0-5

caret	6.0-86

cellranger	1.1.0

checkmate	2.1.0

chron	2.3-56

cli	3.3.0

clipr	0.8.0

colorspace	2.0-3

commonmark	1.8.0

config	0.3.1

corrplot	0.92

covr	3.5.1

cpp11	0.4.2

crayon	1.5.1

credentials	1.3.2

crosstalk	1.2.0

curl	4.3.2

data.table	1.14.2

DBI	1.1.2

dbplyr	2.1.1

desc	1.4.1

devtools	2.3.2

diffobj	0.3.5

digest	0.6.29

dplyr	1.0.9

DT	0.22

dtplyr	1.2.1

dygraphs	1.1.1.6

ellipsis	0.3.2

evaluate	0.15

extraDistr	1.9.1

fansi	1.0.3

farver	2.1.0

fastmap	1.1.0

forcats	0.5.1

foreach	1.5.2

forecast	8.13

forge	0.2.0

formatR	1.12

fracdiff	1.5-1

fs	1.5.2

furrr	0.3.0

futile.logger	1.4.3

futile.options	1.0.1

future	1.25.0

future.apply	1.9.0

gargle	1.2.0

generics	0.1.2

gert	1.6.0

ggplot2	3.3.6

gh	1.3.0

gitcreds	0.1.1

glmnet	4.1-4

globals	0.14.0

glue	1.6.2

gower	1.0.0

gridExtra	2.3

gsubfn	0.7

gtable	0.3.0

gtools	3.8.2

hardhat	0.2.0

haven	2.5.0

highr	0.9

hms	1.1.1

htmltools	0.5.2

htmlwidgets	1.5.4

httr	1.4.3

hwriter	1.3.2.1

ids	1.0.1

ini	0.3.1

inline	0.3.19

ipred	0.9-12

isoband	0.2.5

iterators	1.0.14

jquerylib	0.1.4

jsonlite	1.7.2

knitr	1.39

labeling	0.4.2

lambda.r	1.2.4

later	1.3.0

lava	1.6.10

lazyeval	0.2.2

lifecycle	1.0.1

listenv	0.8.0

lme4	1.1-29

lmtest	0.9-40

loo	2.5.1

lubridate	1.8.0

magrittr	2.0.3

maptools	1.1-4

markdown	1.1

MatrixModels	0.5-0

matrixStats	0.62.0

memoise	2.0.1

mime	0.12

minqa	1.2.4

ModelMetrics	1.2.2.2

modelr	0.1.8

munsell	0.5.0

nloptr	2.0.1

notebookutils	3.1.2-20220721.3

numDeriv	2016.8-1.1

openssl	2.0.0

padr	0.6.0

parallelly	1.31.1

pbkrtest	0.5.1

pillar	1.7.0

pkgbuild	1.3.1

pkgconfig	2.0.3

pkgload	1.2.4

plogr	0.2.0

plotly	4.10.0

plotrix	3.8-1

plyr	1.8.7

praise	1.0.0

prettyunits	1.1.1

pROC	1.18.0

processx	3.5.3

prodlim	2019.11.13

progress	1.2.2

progressr	0.10.0

promises	1.2.0.1

prophet	0.6.1

proto	1.0.0

ps	1.7.0

purrr	0.3.4

quadprog	1.5-8

quantmod	0.4.20

quantreg	5.93

R.methodsS3	1.8.1

R.oo	1.24.0

R.utils	2.12.0

r2d3	0.2.6

R6	2.5.1

randomForest	4.7-1

rappdirs	0.3.3

rcmdcheck	1.4.0

RColorBrewer	1.1-3

Rcpp	1.0.8.3

RcppArmadillo	0.11.0.0.0

RcppEigen	0.3.3.9.2

RcppParallel	5.1.5

RcppRoll	0.3.0

readr	2.1.2

readxl	1.4.0

recipes	0.2.0

rematch	1.0.1

rematch2	2.1.2

remotes	2.4.2

reprex	2.0.1

reshape2	1.4.3

reticulate	1.18

rex	1.2.1

rlang	1.0.2

rmarkdown	2.14

RODBC	1.3-19

roxygen2	7.1.2

rprojroot	2.0.3

rsample	0.1.1

RSQLite	2.2.13

rstan	2.21.5

rstantools	2.2.0

rstatix	0.7.0

rstudioapi	0.13

rversions	2.1.1

rvest	1.0.2

sass	0.4.1

scales	1.2.0

selectr	0.4-2

sessioninfo	1.2.2

shape	1.4.6

slider	0.2.2

sourcetools	0.1.7

sp	1.4-7

sparklyr	1.5.2

SparseM	1.81

sqldf	0.4-11

SQUAREM	2021.1

StanHeaders	2.21.0-7

stringi	1.7.6

stringr	1.4.0

sweep	0.2.3

sys	3.4

testthat	3.1.4

tibble	3.1.7

tibbletime	0.1.6

tidyr	1.2.0

tidyselect	1.1.2

tidyverse	1.3.1

timeDate	3043.102

timetk	2.8.0

tinytex	0.38

tseries	0.10-51

tsfeatures	1.0.2

TTR	0.24.3

tzdb	0.3.0

urca	1.3-0

usethis	2.1.5

utf8	1.2.2

uuid	1.1-0

vctrs	0.4.1

viridisLite	0.4.0

vroom	1.5.7

waldo	0.4.0

warp	0.2.0

whisker	0.4

withr	2.5.0

xfun	0.30

xml2	1.3.3

xopen	1.0.0

xtable	1.8-4

xts	0.12.1

yaml	2.3.5

zip	2.2.0

zoo	1.8-10

## Next steps

- [Azure Synapse Analytics](../overview-what-is.md)
- [Apache Spark Documentation](https://spark.apache.org/docs/3.2.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)
