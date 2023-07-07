---
title: "Azure AI services for big data"
description: Learn how to leverage Azure AI services on large datasets using Python, Java, and Scala. With Azure AI services for big data you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations.
services: cognitive-services
author: mhamilton723
manager: nitinme
ms.service: cognitive-services
ms.custom: ignite-2022, devx-track-extended-java, devx-track-python
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: marhamil
---

# Azure AI services for big data

![Azure AI services for big data](media/cognitive-services-big-data-overview.svg)

Azure AI services for big data lets users channel terabytes of data through Azure AI services using [Apache Spark&trade;](/dotnet/spark/what-is-spark) and open source libraries for distributed machine learning workloads. With Azure AI services for big data, it's easy to create large-scale intelligent applications with any datastore.

Using the resources and libraries described in this article, you can embed continuously improving, intelligent models directly into Apache Spark&trade; and SQL computations. These tools liberate developers from low-level networking details, so that they can focus on creating smart, distributed applications.

## Features and benefits

Azure AI services for big data can use resources from any [supported region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services), as well as [containerized Azure AI services](../cognitive-services-container-support.md). Containers support low or no connectivity deployments with ultra-low latency responses. Containerized Azure AI services can be run locally, directly on the worker nodes of your Spark cluster, or on an external orchestrator like Kubernetes.

## Supported services

[Azure AI services](../index.yml), accessed through APIs and SDKs, help developers build intelligent applications without having AI or data science skills. With Azure AI services you can make your applications see, hear, speak, and understand. To use Azure AI services, your application must send data to the service over the network. Once received, the service sends an intelligent response in return. The following Azure AI services resources are available for big data workloads:

### Vision

|Service Name|Service Description|
|:-----------|:------------------|
|[Vision](../computer-vision/index.yml "Vision")| The Azure AI Vision service provides you with access to advanced algorithms for processing images and returning information. |
|[Face](../computer-vision/overview-identity.md "Face")| The Face service provides access to advanced face algorithms, enabling face attribute detection and recognition. |

### Speech

|Service Name|Service Description|
|:-----------|:------------------|
|[Speech](../speech-service/index.yml "Speech")|The Speech service provides access to features like speech recognition, speech synthesis, speech translation, and speaker verification and identification.|

### Decision

|Service Name|Service Description|
|:-----------|:------------------|
|[Anomaly Detector](../anomaly-detector/index.yml "Anomaly Detector") | The Anomaly Detector service allows you to monitor and detect abnormalities in your time series data.|

### Language

|Service Name|Service Description|
|:-----------|:------------------|
|[Language](../language-service/index.yml "Language")| The Language service provides natural language processing over raw text for sentiment analysis, key-phrase extraction, and language detection.|

### Search

|Service Name|Service Description|
|:-----------|:------------------|
|[Bing Image Search](/azure/cognitive-services/bing-image-search "Bing Image Search")|The Bing Image Search service returns a display of images determined to be relevant to the user's query.|

## Supported programming languages for Azure AI services for big data

Azure AI services for big data are built on Apache Spark. Apache Spark is a distributed computing library that supports Java, Scala, Python, R, and many other languages. See [SynapseML](https://microsoft.github.io/SynapseML) for documentation, samples, and blog posts.

The following languages are currently supported.

### Python

We provide a PySpark API for current and legacy libraries:

* [`synapseml.cognitive`](https://mmlspark.blob.core.windows.net/docs/0.10.0/pyspark/synapse.ml.cognitive.html)

* [`mmlspark.cognitive`](https://mmlspark.blob.core.windows.net/docs/0.18.1/pyspark/modules.html)

For more information, see the [Python Developer API](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/pyspark/mmlspark.cognitive.html). For usage examples, see the [Python Samples](samples-python.md).

### Scala and Java

We provide a Scala and Java-based Spark API for current and legacy libraries:

* [`com.microsoft.synapseml.cognitive`](https://mmlspark.blob.core.windows.net/docs/0.10.0/scala/com/microsoft/azure/synapse/ml/cognitive/index.html)

* [`com.microsoft.ml.spark.cognitive`](https://mmlspark.blob.core.windows.net/docs/0.18.1/scala/index.html#com.microsoft.ml.spark.cognitive.package)

For more information, see the [Scala Developer API](https://mmlspark.blob.core.windows.net/docs/1.0.0-rc1/scala/index.html#package). For usage examples, see the [Scala Samples](samples-scala.md).

## Supported platforms and connectors

Big data scenarios require Apache Spark. There are several Apache Spark platforms that support Azure AI services for big data.

### Azure Databricks

[Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks) is an Apache Spark-based analytics platform optimized for the Microsoft Azure cloud services platform. It provides one-click setup, streamlined work-flows, and an interactive workspace that supports collaboration between data scientists, data engineers, and business analysts.

### Azure Synapse Analytics

[Azure Synapse Analytics](/azure/databricks/data/data-sources/azure/synapse-analytics) is as enterprise data warehouse that uses massive parallel processing. With Synapse Analytics, you can quickly run complex queries across petabytes of data. Azure Synapse Analytics provides managed Spark Pools to run Spark Jobs with an intuitive Jupyter Notebook Interface.

### Azure Kubernetes Service

[Azure Kubernetes Service (AKS)](../../aks/index.yml) orchestrates Docker Containers and distributed applications at massive scales. AKS is a managed Kubernetes offering that simplifies using Kubernetes in Azure. Kubernetes can enable fine-grained control of Cognitive Service scale, latency, and networking. However, we recommend using Azure Databricks or Azure Synapse Analytics if you're unfamiliar with Apache Spark.

### Data Connectors

Once you have a Spark Cluster, the next step is connecting to your data. Apache Spark has a broad collection of database connectors. These connectors allow applications to work with large datasets no matter where they're stored. For more information about supported databases and connectors, see the [list of supported datasources for Azure Databricks](/azure/databricks/data/data-sources/).

## Concepts

### Spark

[Apache Spark&trade;](http://spark.apache.org/) is a unified analytics engine for large-scale data processing. Its parallel processing framework boosts performance of big data and analytic applications. Spark can operate as both a batch and stream processing system, without changing core application code.

The basis of Spark is the DataFrame: a tabular collection of data distributed across the Apache Spark worker nodes. A Spark DataFrame is like a table in a relational database or a data frame in R/Python, but with limitless scale. DataFrames can be constructed from many sources such as: structured data files, tables in Hive, or external databases. Once your data is in a Spark DataFrame, you can:

   - Do SQL-style computations such as join and filter tables.
   - Apply functions to large datasets using MapReduce style parallelism.
   - Apply Distributed Machine Learning using Microsoft Machine Learning for Apache Spark.
   - Use Azure AI services for big data to enrich your data with ready-to-use intelligent services.

### Microsoft Machine Learning for Apache Spark (MMLSpark)

[Microsoft Machine Learning for Apache Spark](https://mmlspark.blob.core.windows.net/website/index.html#install) (MMLSpark) is an open-source, distributed machine learning library (ML) built on Apache Spark. Azure AI services for big data is included in this package. Additionally, MMLSpark contains several other ML tools for Apache Spark, such as LightGBM, Vowpal Wabbit, OpenCV, LIME, and more. With MMLSpark, you can build powerful predictive and analytical models from any Spark datasource.

### HTTP on Spark

Azure AI services for big data is an example of how we can integrate intelligent web services with big data. Web services power many applications across the globe and most services communicate through the Hypertext Transfer Protocol (HTTP). To work with *arbitrary* web services at large scales, we provide HTTP on Spark. With HTTP on Spark, you can pass terabytes of data through any web service. Under the hood, we use this technology to power Azure AI services for big data.

## Developer samples

- [Recipe: Predictive Maintenance](recipes/anomaly-detection.md)
- [Recipe: Intelligent Art Exploration](recipes/art-explorer.md)

## Blog posts

- [Learn more about how Azure AI services work on Apache Spark&trade;](https://azure.microsoft.com/blog/dear-spark-developers-welcome-to-azure-cognitive-services/)
- [Saving Snow Leopards with Deep Learning and Azure AI Vision on Spark](/archive/blogs/machinelearning/saving-snow-leopards-with-deep-learning-and-computer-vision-on-spark)
- [Microsoft Research Podcast: MMLSpark, empowering AI for Good with Mark Hamilton](https://blubrry.com/microsoftresearch/49485070/092-mmlspark-empowering-ai-for-good-with-mark-hamilton/)
- [Academic Whitepaper: Large Scale Intelligent Microservices](https://arxiv.org/abs/2009.08044)

## Webinars and videos

- [the Azure AI services on Spark: Clusters with Embedded Intelligent Services](https://databricks.com/session/the-azure-cognitive-services-on-spark-clusters-with-embedded-intelligent-services)
- [Spark Summit Keynote: Scalable AI for Good](https://databricks.com/session_eu19/scalable-ai-for-good)
- [Azure AI services for big data in Azure Cosmos DB](https://medius.studios.ms/Embed/Video-nc/B19-BRK3004?latestplayer=true&l=2571.208093)
- [Lightning Talk on Large Scale Intelligent Microservices](https://www.youtube.com/watch?v=BtuhmdIy9Fk&t=6s)

## Next steps

- [Getting Started with Azure AI services for big data](getting-started.md)
- [Simple Python Examples](samples-python.md)
- [Simple Scala Examples](samples-scala.md)
