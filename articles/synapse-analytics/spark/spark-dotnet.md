---
title: Use .NET for Apache Spark with Azure Synapse Analytics
description: Learn about using .NET and Apache Spark to do batch processing, real-time streaming, machine learning, and write ad-hoc queries in Azure Synapse Analytics notebooks.
author: mamccrea 
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual

ms.date: 05/01/2020 
ms.author: mamccrea 
ms.reviewer: jrasnick
---

# Use .NET for Apache Spark with Azure Synapse Analytics

[.NET for Apache Spark](https://dot.net/spark) provides free, open-source, and cross-platform .NET support for Spark. 

It provides .NET bindings for Spark which allow you to access Spark APIs through C# and F#. With .NET for Apache Spark, you also have the ability to write and execute user-defined functions for Spark written in .NET. The .NET APIs for Spark enable you to access all aspects of Spark DataFrames that help you analyze your data, including Spark SQL, Delta Lake, and Structured Streaming.

You can analyze data with .NET for Apache Spark through Spark batch job definitions or with interactive Azure Synapse Analytics notebooks. In this article, you learn how to use .NET for Apache Spark with Azure Synapse using both techniques.

## Submit batch jobs using the Spark job definition

Visit the tutorial to learn how to use Azure Synapse Analytics to [create Apache Spark job definitions for Synapse Spark pools](apache-spark-job-definitions.md). If you have not packaged your app to submit to Azure Synapse, complete the following steps.

1. Run the following commands to publish your app. Be sure to replace *mySparkApp* with the path to your app.

   **On Windows:**

   ```dotnetcli
   cd mySparkApp
   dotnet publish -c Release -f netcoreapp3.1 -r ubuntu.16.04-x64
   ```

   **On Linux:**

   ```bash
   zip -r publish.zip
   ```

## .NET for Apache Spark in Azure Synapse Analytics notebooks 

Notebooks are a great option for prototyping your .NET for Apache Spark pipelines and scenarios. You can start working with, understanding, filtering, displaying, and visualizing your data quickly and efficiently. Data engineers, data scientists, business analysts, and machine learning engineers are all able to collaborate over a shared,  interactive document. You see immediate results from data exploration, and can visualize your data in the same notebook.

### How to use .NET for Apache Spark notebooks

When you create a new notebook, you choose a language kernel that you wish to express your business logic. There is kernel support for several languages, including C#.

To use .NET for Apache Spark in your Azure Synapse Analytics notebook, select **.NET Spark (C#)** as your kernel and attach the notebook to an existing Spark pool.

The .NET Spark notebook is based on the .NET interactive experiences and provides interactive C# experiences with the ability to use .NET for Spark out of the box with the Spark session variable `spark` already predefined.

### .NET for Apache Spark C# kernel features

The following features are available when you use .NET for Apache Spark in the Azure Synapse Analytics notebook:

* Declarative HTML: Generate output from your cells using HTML-syntax, such as headers, bulleted lists, and even displaying images.
* Simple C# statements (such as assignments, printing to console, throwing exceptions, and so on).
* Multi-line C# code blocks (such as if statements, foreach loops, class definitions, and so on).
* Access to the standard C# library (such as System, LINQ, Enumerables, and so on).
* Support for [C# 8.0 language features](/dotnet/csharp/whats-new/csharp-8?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).
* 'spark' as a pre-defined variable to give you access to your Apache Spark session.
* Support for defining [.NET user-defined functions that can run within Apache Spark](https://github.com/dotnet/spark/blob/master/examples/Microsoft.Spark.CSharp.Examples/Sql).
* Support for visualizing output from your Spark jobs using different charts (such as line, bar, or histogram) and layouts (such as single, overlaid, and so on) using the `XPlot.Plotly` library.
* Ability to include NuGet packages into your C# notebook.

## Next steps

* [.NET for Apache Spark documentation](/dotnet/spark?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
* [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
* [.NET Interactive](https://devblogs.microsoft.com/dotnet/creating-interactive-net-documentation/)
