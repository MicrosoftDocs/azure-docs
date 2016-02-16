
<properties
   pageTitle="Elasticsearch on Azure Guidance | Microsoft Azure"
   description="Elasticsearch on Azure Guidance."
   services=""
   documentationCenter="na"
   authors="mabsimms"
   manager="marksou"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/05/2016"
   ms.author="mabsimms"/>

# Elasticsearch on Azure Guidance

Elasticsearch is a highly scalable open-source search engine and database. It is suitable for situations that require fast analysis and discovery of information held in big datasets. This guidance looks at some key aspects to consider when designing an Elasticsearch cluster: 

- **[General guidance][]** provides a brief introduction to the general structure of Elasticsearch, and  describes how to implement an Elasticsearch cluster using Azure.
- **[Data ingestion guidance][]** describes the deployment and configuration options to consider for an Elasticsearch cluster that expects a high rate of data ingestion.
- **[Performance testing guidance][]** describes how to set up an environment for testing the performance of an Elasticsearch cluster.
- **[JMeter guidance][]** describes how to create and use a JUnit sampler that can generate and upload data to an Elasticsearch cluster.
- **[Considerations for JMeter][]** summarizes the key experiences gained from constructing and running data ingestion and query test plans. 

  > [AZURE.NOTE] This guidance assumes some basic familiarity with Elasticsearch. For more detailed information, visit the [Elasticsearch website](https://www.elastic.co/products/elasticsearch).

[General guidance]: guidance-elasticsearch.md
[Data ingestion guidance]: guidance-elasticsearch-data-ingestion.md
[Performance testing guidance]: guidance-elasticsearch-performance-testing-environment.md
[JMeter guidance]: guidance-elasticsearch-implementing-jmeter.md
[Considerations for JMeter]:guidance-elasticsearch-deploy-jmeter-junit-sampler.md
