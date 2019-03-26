---
title: 'Azure HDInsight: Python samples for the SDK'
description: Find Python examples on GitHub for common tasks using the HDInsight SDK.
author: hrasheed-msft
ms.service: hdinsight
ms.topic: sample
ms.date: 03/10/2018
ms.author: hrasheed

---
# Azure HDInsight: Python samples for the SDK

> [!div class="op_single_selector"]
> * [Python Examples](hdinsight-sdk-python-samples.md)
> * [.NET Examples](hdinsight-sdk-dotnet-samples.md)
> * [Java Examples](hdinsight-sdk-java-samples.md)
<!--> * [Go Examples](hdinsight-sdk-go-samples.md)-->


This article provides:

* Links to samples for cluster creation tasks.
* Links to API reference content for other management tasks.

For code samples for the .NET SDK Version 3.0 (Preview), see the latest samples in the [hdinsight-dotnet-sdk-samples](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples) GitHub repository. 

**Prerequisites**

* An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
* [Python](https://www.python.org/downloads/)
* [pip](https://pypi.org/project/pip/#description)

## Cluster management - creation

* [Kafka](https://github.com/Azure-Samples/hdinsight-python-sdk-samples/blob/master/samples/create_kafka_cluster_sample.py)
* [Spark](https://github.com/Azure-Samples/hdinsight-python-sdk-samples/blob/master/samples/create_spark_cluster_sample.py)
* [Spark with Enterprise Security Package (ESP)](https://github.com/Azure-Samples/hdinsight-python-sdk-samples/blob/master/samples/create_esp_cluster_sample.py)
* [Spark with Azure Data Lake Storage Gen2](https://github.com/Azure-Samples/hdinsight-python-sdk-samples/blob/master/samples/create_hadoop_cluster_with_adls_gen2_sample.py)

## Other API Functions

Code snippets for the following API functions can be found in the [HDInsight Python API reference documentation](https://docs.microsoft.com/en-us/python/api/overview/azure/hdinsight?view=azure-python):

* List clusters
* Delete clusters
* Resize clusters
* Monitoring
* Script Actions