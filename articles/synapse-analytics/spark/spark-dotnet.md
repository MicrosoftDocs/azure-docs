---
title: Use .NET for Apache Spark with Azure Synapse Analytics
description: Learn about using .NET and Apache Spark to do batch processing, real-time streaming, machine learning, and write ad-hoc queries in Azure Synapse Analytics notebooks.
author: mamccrea 
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.date: 04/15/2020 
ms.author: mamccrea 
ms.reviewer: jrasnick
---

<!-- # Use .NET for Apache Spark with Azure Synapse Analytics

Azure Synapse Analytics uses Spark pools (preview) for data processing. Apache Spark is a general-purpose distributed processing engine for analytics over large data sets - typically terabytes or petabytes of data. You can use Apache Spark for several popular big data scenarios, including:

* Batch processing
* Machine Learning
* Impromptu querying -->

# What is .NET for Apache Spark?

[.NET for Apache Spark](https://dot.net/spark) provides free, open-source, and cross-platform .NET support for Spark. .NET for Apache Spark provides .NET bindings for Spark that allow you to access Spark APIs through C# and F# and gives you the ability to write and execute user-defined functions for Spark using .NET.

The .NET APIs for Spark enable you to access all aspects of Spark that help you analyze your data, including Spark SQL and Structured Streaming.

## .NET for Apache Spark in Azure Synapse Analytics

You can analyze your data using .NET for Apache Spark through either Spark batch job definitions or with interactive Azure Synapse Analytics notebooks.

<!--  
### .NET for Apache Spark in Azure Synapse batch job definitions 
Jenny or someone please add details on the batch mode submission -->

### .NET for Apache Spark in Azure Synapse Analytics notebooks 

When creating a new notebook, you choose a language kernel that you wish to express your business logic. There is kernel support for several languages, including C#. 

To use .NET for Apache Spark in your Azure Synapse Analytics notebook, select **.NET Spark (C#)** as your kernel and attach the notebook to an existing Spark pool. 

The .NET Spark notebook is based on the .NET interactive experiences and provides interactive C# experiences with the ability to use .NET for Spark out of the box (with the Spark session variable `spark` already predefined). For more details on the available notebook capabilities [see below](#sparknet-c-kernel-features).

## .NET for Apache Spark scenarios

Notebooks are a great option for prototyping your .NET for Apache Spark pipelines and scenarios. You can start working with, understanding, filtering, displaying, and visualizing your data quickly and efficiently. Data engineers, data scientists, business analysts, and machine learning engineers are all able to collaborate over a shared, highly interactive document. You see immediate results from data exploration, and can visualize your data in the same notebook.

Azure Synapse Analytics notebooks provide a smooth tooling experience with minimal setup, and allow for quick prototyping of big data queries in C# as you learn and practice solving your problems with Apache Spark.

You can also develop a complete big data experience, such as reading in data, transforming it, and then exploring it through printed text or visualizing it through a plot or chart.

## Spark.NET C# kernel features

The following features are available when you use .NET for Apache Spark in the Azure Synapse Analytics notebook:

* Declarative HTML: Generate output from your cells using HTML-syntax, such as headers, bulleted lists, and even displaying images.
* Simple C# statements (such as assignments, printing to console, throwing exceptions, and so on).
* Multi-line C# code blocks (such as if statements, foreach loops, class definitions, and so on).
* Access to the standard C# library (such as System, LINQ, Enumerables, and so on).
* Support for [C# 8.0 language features](https://docs.microsoft.com/dotnet/csharp/whats-new/csharp-8).
* 'spark' as a pre-defined variable to give you access to your Apache Spark session.
* Support for defining [.NET user-defined functions that can run within Apache Spark](https://github.com/dotnet/spark/blob/master/examples/Microsoft.Spark.CSharp.Examples/Sql).
*  Support for visualizing output from your Spark jobs using different charts (such as line, bar, or histogram) and layouts (such as single, overlaid, and so on) using the `XPlot.Plotly` library. 
* Ability to include NuGet packages into your C# notebook.

## Next steps

* [.NET for Apache Spark documentation](https://docs.microsoft.com/dotnet/spark)
* [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
<!-- need link to .NET Interactive documentation -->
