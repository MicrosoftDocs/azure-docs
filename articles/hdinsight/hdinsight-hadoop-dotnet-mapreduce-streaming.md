---
title: Use C# with MapReduce on Hadoop in HDInsight | Microsoft Docs
description: Learn how to use C# to create MapReduce solutions with Hadoop in Azure HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: d83def76-12ad-4538-bb8e-3ba3542b7211
ms.service: hdinsight
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/23/2017
ms.author: larryfr

---
# Use C# with MapReduce streaming on Hadoop in HDInsight

Learn how to use C# to create a MapReduce solution on HDInsight.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight Deprecation on Windows](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

Hadoop streaming is a utility that allows you to run MapReduce jobs using a script or executable. In this example, .NET is used to implement the mapper and reducer for a word count solution.

## .NET on HDInsight

__Linux-based HDInsight__ clusters use [Mono (https://mono-project.com)](https://mono-project.com) to run .NET applications. For more information on Mono compatibility with .NET Framework versions, see [Mono compatibility](http://www.mono-project.com/docs/about-mono/compatibility/).

## How Hadoop streaming works

The basic process used for streaming in this document is as follows:

1. Hadoop passes data to the mapper (mapper.exe in this example) on STDIN.
2. The mapper processes the data, and emits tab-delimited key/value pairs to STDOUT.
3. The output is read by Hadoop, and then passed to the reducer (reducer.exe in this example) on STDIN.
4. The reducer reads the tab-delimited key/value pairs, processes the data, and then emits the result as tab-delimited key/value pairs on STDOUT.
5. The output is read by Hadoop and written to the output directory.

For more information on streaming, see [Hadoop Streaming (https://hadoop.apache.org/docs/r2.7.1/hadoop-streaming/HadoopStreaming.html)](https://hadoop.apache.org/docs/r2.7.1/hadoop-streaming/HadoopStreaming.html).

## Prerequisites

* A familiarity with writing and building C# code that targets .NET Framework 4.5.

    * Use whatever IDE you want. We recommend [Visual Studio](https://www.visualstudio.com/vs) 2015, 2017, or [Visual Studio Code](https://code.visualstudio.com/). The steps in this document use Visual Studio 2017.

* A way to upload .exe files to the cluster. The steps in this document use the Data Lake Tools for Visual Studio to upload the files to primary storage for the cluster.

* A Hadoop on HDInsight cluster. For more information on creating a cluster, see [Create an HDInsight cluster](hdinsight-provision-clusters.md).

## Create the mapper

In Visual Studio, create a new __Console application__ named __mapper__. Use the following code for the application:

```csharp
using System;
using System.Text.RegularExpressions;

namespace mapper
{
    class Program
    {
        static void Main(string[] args)
        {
            string line;
            //Hadoop passes data to the mapper on STDIN
            while((line = Console.ReadLine()) != null)
            {
                // We only want words, so strip out punctuation, numbers, etc.
                var onlyText = Regex.Replace(line, @"\.|;|:|,|[0-9]|'", "");
                // Split at whitespace.
                var words = Regex.Matches(onlyText, @"[\w]+");
                // Loop over the words
                foreach(var word in words)
                {
                    //Emit tab-delimited key/value pairs.
                    //In this case, a word and a count of 1.
                    Console.WriteLine("{0}\t1",word);
                }
            }
        }
    }
}
```

After creating the application, build it to produce the `/bin/Debug/mapper.exe` file in the project directory.

## Create the reducer

In Visual Studio, create a new __Console application__ named __reducer__. Use the following code for the application:

```csharp
using System;
using System.Collections.Generic;

namespace reducer
{
    class Program
    {
        static void Main(string[] args)
        {
            //Dictionary for holding a count of words
            Dictionary<string, int> words = new Dictionary<string, int>();

            string line;
            //Read from STDIN
            while ((line = Console.ReadLine()) != null)
            {
                // Data from Hadoop is tab-delimited key/value pairs
                var sArr = line.Split('\t');
                // Get the word
                string word = sArr[0];
                // Get the count
                int count = Convert.ToInt32(sArr[1]);

                //Do we already have a count for the word?
                if(words.ContainsKey(word))
                {
                    //If so, increment the count
                    words[word] += count;
                } else
                {
                    //Add the key to the collection
                    words.Add(word, count);
                }
            }
            //Finally, emit each word and count
            foreach (var word in words)
            {
                //Emit tab-delimited key/value pairs.
                //In this case, a word and a count of 1.
                Console.WriteLine("{0}\t{1}", word.Key, word.Value);
            }
        }
    }
}
```

After creating the application, build it to produce the `/bin/Debug/reducer.exe` file in the project directory.

## Run a job: Using an SSH session


## Run a job: Using PowerShell

Use the following PowerShell script to run a MapReduce job and download the results.

[normal powershell mapreduce EXCEPT for storage. Need to figure out storage based on ADL/WASB]

