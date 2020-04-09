---
title: Use-cases for built-in analytics with Azure Cosmos DB.
description: Learn how to use built-in analytics with Azure Cosmos DB in different use cases. 
author: markjbrown
ms.author: mjbrown
ms.topic: conceptual
ms.service: cosmos-db
ms.date: 09/26/2019
ms.reviewer: sngun
---

# Use-cases for built-in analytics with Azure Cosmos DB

The following use-cases can be achieved by using the built-in analytics with Apache Spark in Azure Cosmos DB:

## HTAP scenarios

Built-in analytics in Azure Cosmos DB can be used to:

* Detect fraud during transaction processing.
* Provide recommendations to shoppers as they browse an ECommerce store.
* Alert operators to the impending failure of a critical piece of manufacturing equipment.
* Create fast, actionable insight by embedding real-time analytics directly on operational data.

Azure Cosmos DB supports Hybrid Transactional/Analytical Processing (HTAP) scenarios by using the natively built-in Apache Spark. Azure Cosmos DB removes the operational and analytical separation that comes with the traditional systems.

## Globally distributed data lake without requiring any ETL

With natively built-in Apache Spark, Azure Cosmos DB provides a fast, simple, and scalable way to build a globally distributed data lake that provides a single system image. The globally distributed multi-model data eliminates the need to invest in expensive ETL pipelines and scales on-demand, revolutionizing the way data teams analyze their data sets.

## Time series analytics over historic data

In some cases, you may need to answer questions based on data as at a specific point in time over events completed in the past. For example, to get the count of CRM activity statuses at a certain date. If you ran the report a week ago, the count of the statuses would be as per the statuses of each activity at that point in time. Running the same report today will give you the count of the activities whose statuses are as they are today, which may have changed since last week, as they go through their life cycle from open to close. So, you need to report on the snapshot at each stage of the case’s life cycle.

In traditional data warehouse scenarios, the concept of snapshot isn’t possible because the data warehouses aren’t designed to incorporate it and the data only provides a current view of what’s happening. With Azure Cosmos DB, users have the possibility to implement the concept of time travel, being able to query and run analytics on the data retrospectively and ask for how the data looked at a specific point of time in the history. This means users can easily view both the current and historic views of the data and run analytics on it.

## Globally distributed machine learning and AI

As businesses contend with quickly growing volumes of data and an expanding variety of data types and formats, the ability to gain deeper and more accurate insights becomes near impossible at petabyte scale across the globe. With natively built-in Apache Spark, Azure Cosmos DB provides a globally distributed analytics platform that offers extensive library of machine learning algorithms. You can use interactive Jupyter notebooks to build and train models, and cluster management capabilities. These capabilities enable you to provision highly tuned and auto-elastic Spark clusters on-demand.

## Deep Learning on multi-model globally distributed data

Deep learning is the ideal way to provide big data predictive analytics solutions as data volume and complexity continues to grow. With deep learning, businesses can harness the power of unstructured and semi-structured data to deliver use cases that leverage techniques like AI, natural language processing, and more.

## Reporting (integrating with Power Apps, Power BI)

Power BI provides interactive visualizations with self-service business intelligence capabilities, enabling end users to create reports and dashboards on their own. By using the built-in Spark connector, you can connect Power BI Desktop to Apache Spark clusters in Azure Cosmos DB. This connector lets you use direct query to offload processing to Apache Spark in Azure Cosmos DB, which is great when you have a massive amount of data that you don’t want to load into Power BI or when you want to perform near real-time analysis.

## IoT analytics at global scale

The data generated from increasing network sensors brings an unprecedented visibility into previously opaque systems and processes. The key is to find actionable insights in this torrent of information regardless of where IoT devices are distributed around the globe. Azure Cosmos DB allows IOT companies to analyze high-velocity sensor, and time-series data in real-time anywhere around the world. It allows you to harness the true value of an interconnected world to deliver improved customer experiences, operational efficiencies, and new revenue opportunities.

## Stream processing and event analytics 

From log files to sensor data, businesses increasingly have the need to cope with "streams" of data. This data arrives in a steady stream, often from multiple sources simultaneously. While it is feasible to store these data streams on disk and analyze them retrospectively, it can sometimes be sensible or important to process and act upon the data as it arrives. For example, streams of data related to financial transactions can be processed in real time to identify and refuse potentially fraudulent transactions.

## Interactive analytics

In addition to running pre-defined queries to create static dashboards for sales, productivity or stock prices, you may want to explore the data interactively. Interactive analytics allow you to ask questions, view the results, alter the initial question based on the response or drill deeper into results. Apache Spark in Azure Cosmos DB supports interactive queries by responding and adapting quickly.

## Data exploration using Jupyter notebooks

When you have a new dataset, before you dive into running models and tests, you need to inspect your data. In other words, you need to perform exploratory data analysis. Data exploration can inform several decisions. For example, you can find details such as the methods that are appropriate to use on your data, whether the data meets certain modeling assumptions, whether the data should be cleaned, restructured etc. By using the Azure Cosmos DB’s natively built-in Jupyter notebooks and Apache Spark, you can do quick and effective exploratory data analysis on transactional and analytical data.

## Next steps

To get started with these use cases on go to the following articles:

* [Built-in Jupyter notebooks in Azure Cosmos DB](cosmosdb-jupyter-notebooks.md)
* [How to enable notebooks for Azure Cosmos accounts](enable-notebooks.md)
* [Create a notebook to analyze and visualize data](create-notebook-visualize-data.md)