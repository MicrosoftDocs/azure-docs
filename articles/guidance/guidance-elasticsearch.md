
<properties
   pageTitle="Elasticsearch on Azure Guidance | Microsoft Azure"
   description="Elasticsearch on Azure Guidance."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="bennage"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/22/2016"
   ms.author="masashin"/>

# Elasticsearch on Azure Guidance 

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

Elasticsearch is a highly scalable open-source search engine and database. It is useful for situations that require fast analysis and discovery of information held in big datasets. This guidance looks at some key aspects to consider when designing an Elasticsearch cluster, with a focus on ways to optimize and test your configuration.

> [AZURE.NOTE] This guidance assumes some basic familiarity with Elasticsearch. For more 
> detailed information, visit the [Elasticsearch website](https://www.elastic.co/products/elasticsearch). 

- **[Running Elasticsearch on Azure][]** provides a brief introduction to the general structure of Elasticsearch, and describes how to implement an Elasticsearch cluster using Azure. 
- **[Tuning data ingestion performance for Elasticsearch on Azure][]** describes the deployment of an Elasticsearch cluster and provides in-depth analysis of the various configuration options to consider when you expect a high rate of data ingestion.
- **[Tuning data aggregation and query performance for Elasticsearch on Azure][]** provides an in-depth analysis of the options to consider when deciding how to optimize your system for query and search performance.
- **[Configuring resilience and recovery on Elasticsearch on Azure][]** describes some important features of an Elasticsearch cluster that can help minimize the chances of data loss and extended data recovery times.
- **[Creating a performance testing environment for Elasticsearch on Azure][]** describes how to set up an environment for testing the performance data ingestion and query workloads in an Elasticsearch cluster. 
- **[Implementing a JMeter test plan for Elasticsearch][]** summarizes running performance tests implemented using JMeter test plans together with Java code incorporated as a JUnit test for performing tasks such as uploading data into the Elasticsearch cluster.
- **[Deploying a JMeter JUnit sampler for testing Elasticsearch performance][]** describes how to create and use a JUnit sampler that can generate and upload data to an Elasticsearch cluster. This provides a highly flexible approach to load testing that can generate large quantities of test data without depending on external data files. 
- **[Running the automated Elasticsearch resiliency tests][]** summarizes how to run the resiliency tests used in this series. 
- **[Running the automated Elasticsearch performance tests][]** summarizes how to run the performance tests used in this series.


[Running Elasticsearch on Azure]: guidance-elasticsearch-running-on-azure.md
[Tuning Data Ingestion Performance for Elasticsearch on Azure]: guidance-elasticsearch-tuning-data-ingestion-performance.md
[Creating a Performance Testing Environment for Elasticsearch on Azure]: guidance-elasticsearch-creating-performance-testing-environment.md
[Implementing a JMeter Test Plan for Elasticsearch]: guidance-elasticsearch-implementing-jmeter-test-plan.md
[Deploying a JMeter JUnit Sampler for Testing Elasticsearch Performance]: guidance-elasticsearch-deploying-jmeter-junit-sampler.md
[Tuning Data Aggregation and Query Performance for Elasticsearch on Azure]: guidance-elasticsearch-tuning-data-aggregation-and-query-performance.md
[Configuring Resilience and Recovery on Elasticsearch on Azure]: guidance-elasticsearch-configuring-resilience-and-recovery.md
[Running the Automated Elasticsearch Resiliency Tests]: guidance-elasticsearch-running-automated-resilience-tests.md
[Running the Automated Elasticsearch Performance Tests]: guidance-elasticsearch-running-automated-performance-tests.md
