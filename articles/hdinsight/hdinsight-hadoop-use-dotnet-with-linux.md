---
title: Use .NET with Hadoop MapReduce on Linux-based HDInsight - Azure | Microsoft Docs
description: Learn how to use .NET applications for streaming MapReduce on Linux-based HDInsight.
services: hdinsight
documentationCenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.devlang: 'dotnet'
ms.topic: article
ms.tgt_pltfrm: 'na'
ms.workload: big-data
ms.date: 03/17/2017
ms.author: larryfr

---
# Learn how to use .NET for MapReduce on Linux-based HDInsight

Linux-based HDInsight clusters use [Mono (https://mono-project.com)](https://mono-project.com) to run .NET applications. This allows you to use .NET for MapReduce applications...

## Planning

* Target .NET Framework 4.5, as this is most compatible with Mono. For more information, see the [Mono compatibility (http://www.mono-project.com/docs/about-mono/compatibility/)](http://www.mono-project.com/docs/about-mono/compatibility/) document.

* MapReduce applications read data from STDIN and emit data to STDOUT.

* Hadoop emits and expects data as tab-delimited key/value pairs.

## Migrate existing solutions

To verify that your existing solutions work with Mono, use the [.NET Portability Analyzer](https://marketplace.visualstudio.com/items?itemName=ConnieYau.NETPortabilityAnalyzer). Use the following steps to configure the analyzer:

1. Install the [.NET Portability Analyzer](https://marketplace.visualstudio.com/items?itemName=ConnieYau.NETPortabilityAnalyzer). During installation, select the version of Visual Studio to use.

2. From Visual Studio 2015, select __Analyze__, __Portability Analyzer Settings__, and make sure that __4.5__ is checked in the __Mono__ section.

    Select __OK__ to save the configuration.

3. Select __Analyze__, __Analyze Assembly Portability__. Select a .exe or .dll assembly, and then select __Open__ to begin analysis.

4. Once analysis is complete, select __Analyze__, and then __View analysis reports__. In __Portability Analysis Results__, select __Open report__ to open a report.

