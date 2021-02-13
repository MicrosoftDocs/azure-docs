---
title: Use .NET for Apache Spark
description: Learn about using .NET and Apache Spark to do batch processing, real-time streaming, machine learning, and write ad-hoc queries in Azure Synapse Analytics notebooks.
author: luisquintanilla 
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: spark
ms.date: 05/01/2020 
ms.author: luquinta 
ms.reviewer: jrasnick
---

# Use .NET for Apache Spark with Azure Synapse Analytics

[.NET for Apache Spark](https://dot.net/spark) provides free, [open-source](https://github.com/dotnet/spark), and cross-platform .NET support for Spark. 

It provides .NET bindings for Spark, which allows you to access Spark APIs through C# and F#. With .NET for Apache Spark, you can also write and execute user-defined functions for Spark written in .NET. The .NET APIs for Spark enable you to access all aspects of Spark DataFrames that help you analyze your data, including Spark SQL, Delta Lake, and Structured Streaming.

You can analyze data with .NET for Apache Spark through Spark batch job definitions or with interactive Azure Synapse Analytics notebooks. In this article, you learn how to use .NET for Apache Spark with Azure Synapse using both techniques.

## Submit batch jobs using the Spark job definition

Visit the tutorial to learn how to use Azure Synapse Analytics to [create Apache Spark job definitions for Synapse Spark pools](apache-spark-job-definitions.md). If you haven't packaged your app to submit to Azure Synapse, complete the following steps.

1. Run the following commands to publish your app. Be sure to replace *mySparkApp* with the path to your app.

   **On Windows:**

   ```dotnetcli
   cd mySparkApp
   dotnet publish -c Release -f netcoreapp3.1 -r win-x64
   ```
   
   **On Linux:**

   ```dotnetcli
   cd mySparkApp
   dotnet publish -c Release -f netcoreapp3.1 -r ubuntu.16.04-x64
   ```

2. Zip the contents of the publish folder, `publish.zip` for example, that was created as a result of Step 1. All the assemblies should be in the first layer of the ZIP file and there should be no intermediate folder layer. This means when you unzip `publish.zip`, all assemblies are extracted into your current working directory.

    **On Windows:**

    Use an extraction program, like [7-Zip](https://www.7-zip.org/) or [WinZip](https://www.winzip.com/), to extract the file into the bin directory with all the published binaries.

    **On Linux:**

    Open a bash shell and cd into the bin directory with all the published binaries and run the following command.

    ```bash
    zip -r publish.zip
    ```

## .NET for Apache Spark in Azure Synapse Analytics notebooks 

Notebooks are a great option for prototyping your .NET for Apache Spark pipelines and scenarios. You can start working with, understanding, filtering, displaying, and visualizing your data quickly and efficiently. 

Data engineers, data scientists, business analysts, and machine learning engineers are all able to collaborate over a shared,  interactive document. You see immediate results from data exploration, and can visualize your data in the same notebook.

### How to use .NET for Apache Spark notebooks

When you create a new notebook, you choose a language kernel that you wish to express your business logic. Kernel support is available for several languages, including C#.

To use .NET for Apache Spark in your Azure Synapse Analytics notebook, select **.NET Spark (C#)** as your kernel and attach the notebook to an existing serverless Apache Spark pool.

The .NET Spark notebook is based on the [.NET interactive](https://github.com/dotnet/interactive) experiences and provides interactive C# experiences with the ability to use .NET for Spark out of the box with the Spark session variable `spark` already predefined.

### Install NuGet packages in notebooks

You can install NuGet packages of your choice into your notebook by using the `#r nuget` magic command before the name of the NuGet package. The following diagram shows an example:

![Screenshot that shows using #r to install a Spark .NET notebook NuGet package](./media/apache-spark-development-using-notebooks/synapse-spark-dotnet-notebook-nuget.png)

To learn more about how to work with NuGet packages in notebooks, see the [.NET Interactive Documentation](https://github.com/dotnet/interactive/blob/main/docs/nuget-overview.md).

### .NET for Apache Spark C# kernel features

The following features are available when you use .NET for Apache Spark in the Azure Synapse Analytics notebook:

* Declarative HTML: Generate output from your cells using HTML-syntax, such as headers, bulleted lists, and even displaying images.
* Simple C# statements (such as assignments, printing to console, throwing exceptions, and so on).
* Multi-line C# code blocks (such as if statements, foreach loops, class definitions, and so on).
* Access to the standard C# library (such as System, LINQ, Enumerables, and so on).
* Support for C# 8.0 language features.
* `spark` as a pre-defined variable to give you access to your Apache Spark session.
* Support for defining [.NET user-defined functions that can run within Apache Spark](/dotnet/spark/how-to-guides/udf-guide). We recommend [Write and call UDFs in .NET for Apache Spark Interactive environments](/dotnet/spark/how-to-guides/dotnet-interactive-udf-issue) for learning how to use UDFs in .NET for Apache Spark Interactive experiences.
* Support for visualizing output from your Spark jobs using different charts (such as line, bar, or histogram) and layouts (such as single, overlaid, and so on) using the `XPlot.Plotly` library.
* Ability to include NuGet packages into your C# notebook.

## Next steps

* [.NET for Apache Spark documentation](/dotnet/spark/)
* [.NET for Apache Spark Interactive guides](/dotnet/spark/how-to-guides/dotnet-interactive-udf-issue)
* [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/)
* [.NET Interactive](https://devblogs.microsoft.com/dotnet/creating-interactive-net-documentation/)
