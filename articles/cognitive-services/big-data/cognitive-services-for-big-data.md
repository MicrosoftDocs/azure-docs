---
title: Azure Cognitive Services for big data
description: The  Azure Cognitive Services for Big Data allows users to channel terabytes of data through Cognitive Services using [Apache Spark™](https://docs.microsoft.com/en-us/dotnet/spark/what-is-spark). With the Cognitive Services for Big Data, it is easy to create large-scale intelligent applications no matter where your data is stored. 
author: mhamilton723
ms.author: marhamil
ms.date: 06/20/2020
ms.topic: overview
---

# Azure Cognitive Services for Big Data


<p align="center">
<img src="assets/cog_services_for_big_data_overview.svg" alt="Azure Cognitive Services for Big Data" width="70%"/>
</p>


The  Azure Cognitive Services for Big Data allows users to channel terabytes of data through Cognitive Services using [Apache Spark™](https://docs.microsoft.com/en-us/dotnet/spark/what-is-spark). With the Cognitive Services for Big Data, it is easy to create large-scale intelligent applications no matter where your data is stored. 

Specifically, Cognitive Services on Spark allow users to embed general purpose, and continuously improving, intelligent models directly into their Apache Spark™ and SQL computations. This liberates developers from low-level networking details, so they can focus on creating intelligent, distributed applications.

## Features and benefits

### Ultra-low latency workloads

Since Cognitive Services on Spark are compatible with services from any region of the globe, with low or no connectivity, ultra-low latency is critical. In response, Cognitive Services now include [Docker Containers](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-container-support) support, which enables running Cognitive Services locally or directly on the worker nodes of your cluster for ultra-low latency workloads. Kubernetes, a popular container orchestration platform, is used so you can simply point your Cognitive Services on Spark to your container's URL.

## Supported services

### Cognitive Services

[Azure Cognitive Services](https://docs.microsoft.com/en-us/azure/cognitive-services/), accessed through APIs and SDKs, help developers build intelligent applications without having direct AI or data science skills or knowledge. The goal of Azure Cognitive Services is to help developers create applications that can see, hear, speak, understand, and even begin to reason. Your query data is sent to the service and you get an intelligent response in return.

1. Vision: Computer Vision and Face
1. Speech: Speech Services
1. Language: Text Analytics
1. Decision: Anomaly Detector
1. Search: Bing Image Search

Spark has its own SDK that utilizes many different Cognitive Services to streamline access to them. It's available in both Python and Scala.

#### Python
The Spark SDK in Python supports Cognitive Services in their `mmlspark.cognitive` package.<br>
[com. mmlspark.cognitive](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/pyspark/mmlspark.cognitive.html)

#### Scala
The Spark SDK in Scala supports Cognitive Services in their `com.microsoft.ml.spark.cognitive` package.<br>
[com.microsoft.ml.spark.cognitive](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/scala/index.html#com.microsoft.ml.spark.cognitive.package)

## Supported Platforms and Connectors

In order to facilitate Spark, choose a platform for your big data analysis. Azure Databricks or Azure Synapse Analytics will provide a secure space for taking in data, sending it through analysis and storing the results. The Azure Kubernetes Service can be useful for containerizing the services you use for your analysis, for example the Cognitive Services or other web services. 

With a platform in place, you'll want to connect data sources (connectors) to your data. Azure Databricks, for example, has a [large data source list](https://docs.microsoft.com/en-us/azure/databricks/data/data-sources/) to choose from. Some popular connectors are SQLServer, Azure Blob storage, Azure CosmosDB, and PowerBI.

### Azure Databricks

[Azure Databricks](https://docs.microsoft.com/en-us/azure/azure-databricks/what-is-azure-databricks) is an Apache Spark-based analytics platform optimized for the Microsoft Azure cloud services platform. It provides one-click setup, streamlined workflows, and an interactive workspace that enables collaboration between data scientists, data engineers, and business analysts.

### Azure Synapse Analytics

[Azure Synapse Analytics](https://docs.microsoft.com/en-us/azure/databricks/data/data-sources/azure/synapse-analytics) (formerly SQL Data Warehouse) is a cloud-based enterprise data warehouse that leverages massive parallel processing (MPP) to quickly run complex queries across petabytes of data. You can access Azure Synapse from Azure Databricks using the Azure Synapse connector.

### Azure Kubernetes Service

As application development moves towards a container-based approach, the need to orchestrate and manage resources is important. [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/) is the leading platform that provides the ability to provide reliable scheduling of fault-tolerant application workloads. AKS is a managed Kubernetes offering that further simplifies container-based application deployment and management. Although using Kubernetes is optional, as deploying services with Spark can be done in the cloud, it will simplify the handling of many services at scale.

## Concepts

### Spark

[Apache Spark™](http://spark.apache.org/) is a unified analytics engine for large-scale data processing. Its parallel processing framework boosts performance of big-data and analytic applications. Spark is a batch and stream processing system, but also can deploy models as web service.

Microsoft created the [Microsoft Machine Learning for Apache Spark](https://mmlspark.blob.core.windows.net/website/index.html#install) to act as a fault-tolerant, elastic, and RESTful machine learning framework. Cognitive Services can be utilized in Spark by adding them to an existing Spark cluster. Creating a Spark cluster is made possible through several options: [HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/spark/apache-spark-overview), [Databricks](https://docs.microsoft.com/en-us/azure/azure-databricks/), [Kubernetes](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes), or [Synapse Analytics](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/).

### Microsoft Machine Learning for Apache Spark (MMLSpark)

MMLSpark is an ecosystem of tools aimed towards expanding the distributed computing framework Apache Spark in several new directions. MMLSpark adds many deep learning and data science tools to the Spark ecosystem, including seamless integration of Spark Machine Learning pipelines with Microsoft Cognitive Toolkit (CNTK), LightGBM and OpenCV. These tools enable powerful and highly-scalable predictive and analytical models for a variety of datasources.

### HTTP on Spark

Cognitive Services on Spark are just one example of how HTTP on Spark, part of MMLSpark, can be leveraged. The web is full of HTTP(S) web services that provide useful tools and serve as one of the standard patterns for making your code accessible in any language. HTTP on Spark allows Spark developers to tap into this richness from within their existing Spark pipelines.

Intuitively speaking, a web service is a streaming pipeline where the data source and the data sink are the same HTTP request. Therefore, the ability to include web services into your Spark pipeline allows Spark clusters to operate as distributed web clients.

### Spark SQL

The basis of Spark is the Dataframe:

A Dataset is a distributed collection of data. Dataset is a new interface added in Spark 1.6 that provides the benefits of RDDs (strong typing, ability to use powerful lambda functions) with the benefits of Spark SQL’s optimized execution engine.

A DataFrame is a Dataset organized into named columns. It's conceptually equivalent to a table in a relational database or a data frame in R/Python, but with richer optimizations under the hood. DataFrames can be constructed from a wide array of sources such as: structured data files, tables in Hive, external databases, or existing RDDs.

Dataframes are distributed tabular data broken up across many machines. [Spark SQL](http://spark.apache.org/sql/) is Apache Spark's module for working with structured data.

- Spark combines SQL and Map Reduce.
    * SQL-style computations join and filter tables. 
    * Map reduce applies functions to large datasets.
- Spark can be used for Machine Learning (ML). 
    * Microsoft Machine Learning for Apache Spark™ (MMLSpark) extends Spark to cover more ML tasks and topics. 
    * We can add deep learning, gradient boosted trees, model interpretability, text analytics, and cognitive services.
- Cognitive Services are intelligent algorithms in the cloud

MMLSpark requires Scala 2.11, Spark 2.4+, and Python 3.5+. See the API documentation for [Scala](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/scala/index.html#package) and for [PySpark](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/pyspark/index.html).


## Blog posts

1. Learn more about how Cognitive Services work on Apache Spark™:  
    [Dear Spark developers: Welcome to Azure Cognitive Services](https://azure.microsoft.com/en-us/blog/dear-spark-developers-welcome-to-azure-cognitive-services/)
3. [Saving Snow Leopards with Deep Learning and Computer Vision on Spark](http://www.datawizard.io/2017/06/27/saving-snow-leopards-with-deep-learning-and-computer-vision-on-spark/)
4. Microsoft Research Podcast: [092 - MMLSpark: empowering AI for Good with Mark Hamilton](https://blubrry.com/microsoftresearch/49485070/092-mmlspark-empowering-ai-for-good-with-mark-hamilton/)

## Developer samples
- [Recipe: Predictive Maintenance](recipes/anamoly-detection.md)
- [Recipe: Intelligent Art Exploration](recipes/art-explorer.md)


## Webinars and videos

 1. [The Azure Cognitive Services on Spark: Clusters with Embedded Intelligent Services](https://databricks.com/session/the-azure-cognitive-services-on-spark-clusters-with-embedded-intelligent-services)
 2. Spark Summit Keynote: [Scalable AI for Good](https://databricks.com/session_eu19/scalable-ai-for-good)
 3. Cognitive Services and Scaling: [Demos at Ignite](https://medius.studios.ms/Embed/Video-nc/B19-BRK3004?latestplayer=true&l=2571.208093)

## Next steps

- [Getting Started with the Cognitive Services for Big Data](getting-started.md)
- [Simple Python Examples](samples-python.md)
- [Simple Scala Examples](samples-scala.md)

