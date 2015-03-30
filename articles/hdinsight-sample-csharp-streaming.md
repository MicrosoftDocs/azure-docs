<properties
	pageTitle="The C# streaming wordcount Hadoop sample in HDInsight | Azure"
	description="How to write MapReduce programs in C# that use the Hadoop streaming interface, and how to run them on HDInsight using PowerShell cmdlets."
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	documentationCenter=""
	authors="bradsev"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="03/30/2015" 
	ms.author="bradsev"/>

# The C# streaming wordcount MapReduce sample in Hadoop on HDInsight

Hadoop provides a streaming API to MapReduce that enables you to write map and reduce functions in languages other than Java. This tutorial shows how to write MapReduce programs in C# that uses the Hadoop streaming interface and how to run the programs on Azure HDInsight using Azure PowerShell cmdlets.

> [AZURE.NOTE] The steps in this article only apply to Windows-based HDInsight clusters. For an example of streaming for Linux-based HDInsight, see [Develop Python streaming programs for HDInsight](hdinsight-hadoop-streaming-python.md).

In the example, both the mapper and the reducer are executables that read the input from [stdin][stdin-stdout-stderr] (line by line) and emit the output to [stdout][stdin-stdout-stderr]. The program counts all of the words in the text.

When an executable is specified for **mappers**, each mapper task launches the executable as a separate process when the mapper is initialized. As the mapper task runs, it converts its inputs into lines and feeds the lines to the [stdin][stdin-stdout-stderr] of the process. In the meantime, the mapper collects the line-oriented outputs from the stdout of the process and converts each line into a key/value pair, which is collected as the output of the mapper. By default, the prefix of a line up to the first tab character is the key and the rest of the line (excluding the tab character) is the value. If there is no tab character in the line, then entire line is considered as key and the value is null.

When an executable is specified for **reducers**, each reducer task launches the executable as a separate process when the reducer is initialized. As the reducer task runs, it converts its input key/values pairs into lines and feeds the lines to the [stdin][stdin-stdout-stderr] of the process. In the meantime, the reducer collects the line-oriented outputs from the [stdout][stdin-stdout-stderr] of the process, converts each line into a key/value pair, which is collected as the output of the reducer. By default, the prefix of a line up to the first tab character is the key and the rest of the line (excluding the tab character) is the value.

For more information on the Hadoop streaming interface, see [Hadoop Streaming][hadoop-streaming].

**You will learn:**

* How to use Azure PowerShell to run a C# streaming program to analyze data contained in a file on HDInsight.
* How to write C# code that uses the Hadoop Streaming interface.


**Prerequisites**:

- You must have an Azure Account. For options on signing up for an account see [Try Azure out for free](http://azure.microsoft.com/pricing/free-trial/) page.

- You must have provisioned an HDInsight cluster. For instructions on the various ways in which such clusters can be created, see [Provision HDInsight Clusters](hdinsight-provision-clusters.md)

- You must have installed Azure PowerShell, and have configured them for use with your account. For instructions on how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].


<h2><a id="run-sample"></a>Run the sample with Azure PowerShell</h2>

**To run the MapReduce job**

1.	Open **Azure PowerShell**. For instructions of opening Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

3. Set the two variables in the following commands, and then run them:

		$subscriptionName = "<SubscriptionName>"   # Azure subscription name
		$clusterName = "<ClusterName>"             # HDInsight cluster name


2. Run the following command to define the MapReduce job.

		# Create a MapReduce job definition for the streaming job.
		$streamingWC = New-AzureHDInsightStreamingMapReduceJobDefinition -Files "/example/apps/wc.exe", "/example/apps/cat.exe" -InputPath "/example/data/gutenberg/davinci.txt" -OutputPath "/example/data/StreamingOutput/wc.txt" -Mapper "cat.exe" -Reducer "wc.exe"

	The parameters specify the mapper and reducer functions and the input file and output files.

5. Run the following commands to run the MapReduce job, wait for the job to complete, and then print the standard error:

		# Run the C# Streaming MapReduce job.
		# Wait for the job to complete.
		# Print output and standard error file of the MapReduce job
		Select-AzureSubscription $subscriptionName
		$streamingWC | Start-AzureHDInsightJob -Cluster $clustername | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | Get-AzureHDInsightJobOutput -Cluster $clustername -StandardError

6. Run the following commands to display the results of the word count.

		$subscriptionName = "<SubscriptionName>"
		$storageAccountName = "<StorageAccountName>"
		$containerName = "<ContainerName>"

		# Select the current subscription
		Select-AzureSubscription $subscriptionName

		# Blob storage container and account name
      $storageAccountKey = Get-AzureStorageKey -StorageAccountName $storageAccountName | %{ $_.Primary }
      $storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey

		# Retrieve the output
		Get-AzureStorageBlobContent -Container $containerName -Blob "example/data/StreamingOutput/wc.txt/part-00000" -Context $storageContext -Force

		# The number of words in the text is:
		cat ./example/data/StreamingOutput/wc.txt/part-00000

	Note that the output files of a MapReduce job are immutable. So if you rerun this sample you will need to change the name of the output file.

<h2><a id="java-code"></a>The C# code for Hadoop Streaming</h2>

The MapReduce program uses the cat.exe application as a mapping interface to stream the text into the console and wc.exe application as the reduce interface to count the number of words that are streamed from a document. Both the mapper and reducer read characters, line by line, from the standard input stream (stdin) and write to the standard output stream (stdout).



	// The source code for the cat.exe (Mapper).

	using System;
	using System.IO;

	namespace cat
	{
	    class cat
	    {
	        static void Main(string[] args)
	        {
	            if (args.Length > 0)
	            {
	                Console.SetIn(new StreamReader(args[0]));
	            }

	            string line;
	            while ((line = Console.ReadLine()) != null)
	            {
	                Console.WriteLine(line);
	            }
	        }
	    }
	}



The mapper code in the cat.cs file uses a StreamReader object to read the characters of the incoming stream into the console, which in turn writes the stream to the standard output stream with the static Console.Writeline method.


	// The source code for wc.exe (Reducer) is:

	using System;
	using System.IO;
	using System.Linq;

	namespace wc
	{
	    class wc
	    {
	        static void Main(string[] args)
	        {
	            string line;
	            var count = 0;

	            if (args.Length > 0){
	                Console.SetIn(new StreamReader(args[0]));
	            }

	            while ((line = Console.ReadLine()) != null) {
	                count += line.Count(cr => (cr == ' ' || cr == '\n'));
	            }
	            Console.WriteLine(count);
	        }
	    }
	}


The reducer code in the wc.cs file uses a [StreamReader][streamreader]   object to read characters from the standard input stream that have been output by the cat.exe mapper. As it reads the characters with the [Console.Writeline][console-writeline] method, it counts the words by counting space and end-of-line characters at the end of each word, and then it writes the total to the standard output stream with the [Console.Writeline][console-writeline] method.

<h2><a id="summary"></a>Summary</h2>

In this tutorial, you saw how to deploy a MapReduce job on HDInsight using Hadoop Streaming.

<h2><a id="next-steps"></a>Next steps</h2>

For tutorials running other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Azure HDInsight with Azure PowerShell, see the following topics:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Sample: Pi Estimator][hdinsight-sample-pi-estimator]
* [Sample: Wordcount][hdinsight-sample-wordcount]
* [Sample: 10GB GraySort][hdinsight-sample-10gb-graysort]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[hadoop-streaming]: http://wiki.apache.org/hadoop/HadoopStreaming
[streamreader]: http://msdn.microsoft.com/library/system.io.streamreader.aspx
[console-writeline]: http://msdn.microsoft.com/library/system.console.writeline
[stdin-stdout-stderr]: http://msdn.microsoft.com/library/3x292kth(v=vs.110).aspx

[Powershell-install-configure]: install-configure-powershell.md

[hdinsight-get-started]: hdinsight-get-started.md

[hdinsight-samples]: hdinsight-run-samples.md
[hdinsight-sample-10gb-graysort]: hdinsight-sample-10gb-graysort.md
[hdinsight-sample-csharp-streaming]: hdinsight-sample-csharp-streaming.md
[hdinsight-sample-pi-estimator]: hdinsight-sample-pi-estimator.md
[hdinsight-sample-wordcount]: hdinsight-sample-wordcount.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
