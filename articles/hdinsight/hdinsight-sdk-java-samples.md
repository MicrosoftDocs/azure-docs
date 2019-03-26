---
title: 'Azure HDInsight: Java samples for the SDK'
description: Find Java examples on GitHub for common tasks using the HDInsight SDK.
author: hrasheed-msft
ms.service: hdinsight
ms.topic: sample
ms.date: 03/10/2018
ms.author: hrasheed

---
# Azure HDInsight: Java samples for the SDK

> [!div class="op_single_selector"]
> * [Java Examples](hdinsight-sdk-java-samples.md)
> * [Python Examples](hdinsight-sdk-python-samples.md)
> * [.NET Examples](hdinsight-sdk-dotnet-samples.md)
<!-- * [Go Examples](hdinsight-sdk-dotnet-samples.md)-->

This article provides:

* Links to samples for cluster creation tasks.
* Links to API reference content for other management tasks.

For code samples for the .NET SDK Version 3.0 (Preview), see the latest samples in the [hdinsight-dotnet-sdk-samples](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples) GitHub repository. 

**Prerequisites**

* An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Maven](https://maven.apache.org/install.html)

## Cluster management - creation

* [Kafka](https://github.com/Azure-Samples/hdinsight-java-sdk-samples/blob/master/management/src/main/java/com/microsoft/azure/hdinsight/samples/CreateKafkaClusterSample.java)
* [Spark](https://github.com/Azure-Samples/hdinsight-java-sdk-samples/blob/master/management/src/main/java/com/microsoft/azure/hdinsight/samples/CreateSparkClusterSample.java)
* [Spark with Enterprise Security Package (ESP)](https://github.com/Azure-Samples/hdinsight-java-sdk-samples/blob/master/management/src/main/java/com/microsoft/azure/hdinsight/samples/CreateEspClusterSample.java)
* [Spark with Azure Data Lake Storage Gen2](https://github.com/Azure-Samples/hdinsight-java-sdk-samples/blob/master/management/src/main/java/com/microsoft/azure/hdinsight/samples/CreateHadoopClusterWithAdlsGen2Sample.java)

## Other API functions

Code snippets for the following API functions can be found in the [HDInsight Java API reference documentation](https://docs.microsoft.com/java/api/overview/azure/hdinsight?view=azure-java-preview):

* List clusters
* Delete clusters
* Resize clusters
* Monitoring
* Script Actions