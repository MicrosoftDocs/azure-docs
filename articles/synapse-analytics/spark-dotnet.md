---
title: Use .NET for Apache Spark with Azure Synapse Analytics
description: Learn about how you can interface with Apache Spark using .NET languages in Azure Synapse Analytics notebooks.
services: synapse-analytics 
author: mamccrea 
ms.service: synapse-analytics 
ms.topic: concepts
ms.subservice:  #leave blank
ms.date: 10/21/2019 
ms.author: mamccrea 
ms.reviewer: jrasnick
---

# Use .NET for Apache Spark with Azure Synapse Analytics

Azure Synapse Analytics uses Apache Spark Pools for data processing. Apache Spark is a general-purpose distributed processing engine for analytics over large data sets - typically terabytes or petabytes of data. You can use Apache Spark for several popular big data scenarios, including: 

* Batch processing
* Real-time streaming data processing
* Machine Learning
* Impromptu querying

## What is .NET for Apache Spark?

.NET for Apache Spark is free, open-source, and cross-platform .NET support for Spark. .NET for Apache Spark provides .NET bindings for Spark that allow you to access Spark APIs through C# and F#.

The .NET APIs for Spark enable you to access all aspects of Spark that help you analyze your data, including Spark SQL and Structured Streaming.

## .NET for Apache Spark in Azure Synapse Analytics

You can analyze your data using .NET for Apache Spark through interactive Azure Synapse Analytics notebooks. When creating a new Azure Synapse Analytics notebook, you choose a kernel that interacts with and processes the code you write. There is kernel support for several languages, including C#.

To use .NET for Apache Spark in your Azure Synapse Analytics notebook, select .NET as your kernel and attach a Spark pool to the notebook.

## .NET for Apache Spark scenarios

Notebooks are a great option for prototyping your .NET for Apache Spark queries. You can start working with, understanding, filtering, and displaying your data quickly and efficiently. Data engineers, data scientists, business analysts, and machine learning engineers are all able to collaborate over a shared, highly interactive document. You see immediate results from data exploration, and can visualize your data in the same notebook. 

Azure Synapse Analytics notebooks provide a smooth tooling experience with minimal setup, and allow for quick prototyping of big data queries as you learn and practice with Spark.

You can also develop a complete big data experience, such as reading in data, transforming it, and then exploring it through printed text or visualizing it through a plot or chart. 

## C# kernel features

The following features are available when you use .NET for Apache Spark in the Azure Synapse Analytics notebook: 

* Declarative HTML - generate output from your cells using HTML-syntax, such as headers, bulleted lists, and even displaying images.
* Simple statements - variable assignments, Console.WriteLine(), exceptions.
* Multiline statements, including Class definitions 
* Built-in libraries/functions - for example, Enumerable.Range 
* C# 8.0 support 
* text/plain and text/html MIMETYPE support 
* Default formatter for types 
* Custom formatters for types 
* User-defined function (UDF) Support 
* Visualizations, such as line charts, histograms, custom coloring/fonts of DataFrame and the chart visuals 


## Next steps

* [.NET for Apache Spark documentation](/dotnet/spark)
* [Azure Synape Analytics documentation](index.md)
