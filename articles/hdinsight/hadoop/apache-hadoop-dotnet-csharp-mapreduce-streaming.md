---
title: Use C# with MapReduce on Hadoop in HDInsight - Azure 
description: Learn how to use C# to create MapReduce solutions with Apache Hadoop in Azure HDInsight.
author: hrasheed-msft
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/15/2019
ms.author: hrasheed

---
# Use C# with MapReduce streaming on Apache Hadoop in HDInsight

Learn how to use C# to create a MapReduce solution on HDInsight.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight component versioning](../hdinsight-component-versioning.md).

Apache Hadoop streaming is a utility that allows you to run MapReduce jobs using a script or executable. In this example, .NET is used to implement the mapper and reducer for a word count solution.

## .NET on HDInsight

__Linux-based HDInsight__ clusters use [Mono (https://mono-project.com)](https://mono-project.com) to run .NET applications. Mono version 4.2.1 is included with HDInsight version 3.6. For more information on the version of Mono included with HDInsight, see [HDInsight component versions](../hdinsight-component-versioning.md). 

For more information on Mono compatibility with .NET Framework versions, see [Mono compatibility](https://www.mono-project.com/docs/about-mono/compatibility/).

## How Hadoop streaming works

The basic process used for streaming in this document is as follows:

1. Hadoop passes data to the mapper (mapper.exe in this example) on STDIN.
2. The mapper processes the data, and emits tab-delimited key/value pairs to STDOUT.
3. The output is read by Hadoop, and then passed to the reducer (reducer.exe in this example) on STDIN.
4. The reducer reads the tab-delimited key/value pairs, processes the data, and then emits the result as tab-delimited key/value pairs on STDOUT.
5. The output is read by Hadoop and written to the output directory.

For more information on streaming, see [Hadoop Streaming](https://hadoop.apache.org/docs/r2.7.1/hadoop-streaming/HadoopStreaming.html).

## Prerequisites

* A familiarity with writing and building C# code that targets .NET Framework 4.5. The steps in this document use Visual Studio 2017.

* A way to upload .exe files to the cluster. The steps in this document use the Data Lake Tools for Visual Studio to upload the files to primary storage for the cluster.

* Azure PowerShell or an SSH client.

* A Hadoop on HDInsight cluster. For more information on creating a cluster, see [Create an HDInsight cluster](../hdinsight-hadoop-provision-linux-clusters.md).

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

## Upload to storage

1. In Visual Studio, open **Server Explorer**.

2. Expand **Azure**, and then expand **HDInsight**.

3. If prompted, enter your Azure subscription credentials, and then click **Sign In**.

4. Expand the HDInsight cluster that you wish to deploy this application to. An entry with the text __(Default Storage Account)__ is listed.

    ![Server Explorer showing the storage account for the cluster](./media/apache-hadoop-dotnet-csharp-mapreduce-streaming/storage.png)

    * If this entry can be expanded, you are using an __Azure Storage Account__ as default storage for the cluster. To view the files on the default storage for the cluster, expand the entry and then double-click the __(Default Container)__.

    * If this entry cannot be expanded, you are using __Azure Data Lake Storage__ as the default storage for the cluster. To view the files on the default storage for the cluster, double-click the __(Default Storage Account)__ entry.

5. To upload the .exe files, use one of the following methods:

   * If using an __Azure Storage Account__, click the upload icon, and then browse to the **bin\debug** folder for the **mapper** project. Finally, select the **mapper.exe** file and click **Ok**.

       ![upload icon](./media/apache-hadoop-dotnet-csharp-mapreduce-streaming/upload.png)
    
   * If using __Azure Data Lake Storage__, right-click an empty area in the file listing, and then select __Upload__. Finally, select the **mapper.exe** file and click **Open**.

     Once the __mapper.exe__ upload has finished, repeat the upload process for the __reducer.exe__ file.

## Run a job: Using an SSH session

1. Use SSH to connect to the HDInsight cluster. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use one of the following commands to start the MapReduce job:

   * If using __Data Lake Storage Gen2__ as default storage:

       ```bash
       yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files abfs:///mapper.exe,abfs:///reducer.exe -mapper mapper.exe -reducer reducer.exe -input /example/data/gutenberg/davinci.txt -output /example/wordcountout
       ```

   * If using __Data Lake Storage Gen1__ as default storage:

       ```bash
       yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files adl:///mapper.exe,adl:///reducer.exe -mapper mapper.exe -reducer reducer.exe -input /example/data/gutenberg/davinci.txt -output /example/wordcountout
       ```
    
   * If using __Azure Storage__ as default storage:

       ```bash
       yarn jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar -files wasb:///mapper.exe,wasb:///reducer.exe -mapper mapper.exe -reducer reducer.exe -input /example/data/gutenberg/davinci.txt -output /example/wordcountout
       ```

     The following list describes what each parameter does:

   * `hadoop-streaming.jar`: The jar file that contains the streaming MapReduce functionality.
   * `-files`: Adds the `mapper.exe` and `reducer.exe` files to this job. The `abfs:///`,`adl:///` or `wasb:///` before each file is the path to the root of default storage for the cluster.
   * `-mapper`: Specifies which file implements the mapper.
   * `-reducer`: Specifies which file implements the reducer.
   * `-input`: The input data.
   * `-output`: The output directory.

3. Once the MapReduce job completes, use the following to view the results:

    ```bash
    hdfs dfs -text /example/wordcountout/part-00000
    ```

    The following text is an example of the data returned by this command:

        you     1128
        young   38
        younger 1
        youngest        1
        your    338
        yours   4
        yourself        34
        yourselves      3
        youth   17

## Run a job: Using PowerShell

Use the following PowerShell script to run a MapReduce job and download the results.

[!code-powershell[main](../../../powershell_scripts/hdinsight/use-csharp-mapreduce/use-csharp-mapreduce.ps1?range=5-87)]

This script prompts you for the cluster login account name and password, along with the HDInsight cluster name. Once the job completes, the output is downloaded to a file named `output.txt`. The following text is an example of the data in the `output.txt` file:

    you     1128
    young   38
    younger 1
    youngest        1
    your    338
    yours   4
    yourself        34
    yourselves      3
    youth   17

## Next steps

For more information on using MapReduce with HDInsight, see [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md).

For information on using C# with Hive and Pig, see [Use a C# user-defined function with Apache Hive and Apache Pig](apache-hadoop-hive-pig-udf-dotnet-csharp.md).

For information on using C# with Storm on HDInsight, see [Develop C# topologies for Apache Storm on HDInsight](../storm/apache-storm-develop-csharp-visual-studio-topology.md).
