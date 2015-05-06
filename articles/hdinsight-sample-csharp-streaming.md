<properties
	pageTitle="The C# streaming wordcount Hadoop sample in HDInsight | Azure"
	description="How to write MapReduce programs in C# that use the Hadoop Streaming interface, and how to run them on HDInsight using PowerShell cmdlets."
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
	ms.date="03/30/2014" 
	ms.author="bradsev"/>

# The C# streaming word count MapReduce sample in Hadoop on HDInsight

Hadoop provides a streaming API to MapReduce, which enables you to write map and reduce functions in languages other than Java. This tutorial shows how to write MapReduce programs in C# by using the Hadoop Streaming interface and how to run the programs in Azure HDInsight by using Azure PowerShell cmdlets.

> [AZURE.NOTE] The steps in this tutorial apply only to Windows-based HDInsight clusters. For an example of streaming for Linux-based HDInsight clusters, see [Develop Python streaming programs for HDInsight](hdinsight-hadoop-streaming-python.md).

In the example, the mapper and the reducer are executables that read the input from [stdin][stdin-stdout-stderr] (line-by-line) and emit the output to [stdout][stdin-stdout-stderr]. The program counts all of the words in the text.

When an executable is specified for **mappers**, each mapper task launches the executable as a separate process when the mapper is initialized. As the mapper task runs, it converts its input into lines, and feeds the lines to the [stdin][stdin-stdout-stderr] of the process.

In the meantime, the mapper collects the line-oriented output from the stdout of the process. It converts each line into a key/value pair, which is collected as the output of the mapper. By default, the prefix of a line up to the first Tab character is the key, and the remainder of the line (excluding the Tab character) is the value. If there is no Tab character in the line, entire line is considered as the key, and the value is null.

When an executable is specified for **reducers**, each reducer task launches the executable as a separate process when the reducer is initialized. As the reducer task runs, it converts its input key/values pairs into lines, and it feeds the lines to the [stdin][stdin-stdout-stderr] of the process.

In the meantime, the reducer collects the line-oriented output from the [stdout][stdin-stdout-stderr] of the process. It converts each line to a key/value pair, which is collected as the output of the reducer. By default, the prefix of a line up to the first Tab character is the key, and the remainder of the line (excluding the Tab character) is the value.

For more information about the Hadoop Streaming interface, see [Hadoop Streaming][hadoop-streaming].

**In this tutorial, you will learn how to:**

* Use Azure PowerShell to run a C# streaming program to analyze data contained in a file in HDInsight.
* Write C# code that uses the Hadoop Streaming interface.


**Prerequisites**:

Before you begin, you must have the following:

- An Azure account. For options for signing up for an account, see [Try Azure for free](http://azure.microsoft.com/pricing/free-trial/) page.

- A provisioned HDInsight cluster. For instructions about the various ways in which such clusters can be created, see [Provision HDInsight Clusters](hdinsight-provision-clusters.md).

- Azure PowerShell. It must be configured for use with your account. For instructions about how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].


## <a id="run-sample"></a>Run the sample with Azure PowerShell

**To run the MapReduce job**

1.	Open **Azure PowerShell**. For instructions to open the Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

3. Set the two variables in the following commands, and then run them:

		$subscriptionName = "<SubscriptionName>"   # Azure subscription name
		$clusterName = "<ClusterName>"             # HDInsight cluster name


2. Run the following command to define the MapReduce job:

		# Create a MapReduce job definition for the streaming job.
		$streamingWC = New-AzureHDInsightStreamingMapReduceJobDefinition -Files "/example/apps/wc.exe", "/example/apps/cat.exe" -InputPath "/example/data/gutenberg/davinci.txt" -OutputPath "/example/data/StreamingOutput/wc.txt" -Mapper "cat.exe" -Reducer "wc.exe"

	The parameters, specify the mapper and reducer functions and the input file and output files.

5. Run the following commands to run the MapReduce job, wait for the job to complete, and then print the standard error message:

		# Run the C# Streaming MapReduce job.
		# Wait for the job to complete.
		# Print output and standard error file of the MapReduce job
		Select-AzureSubscription $subscriptionName
		$streamingWC | Start-AzureHDInsightJob -Cluster $clustername | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 | Get-AzureHDInsightJobOutput -Cluster $clustername -StandardError

6. Run the following commands to display the results of the word count:

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

	Note that the output files of a MapReduce job are immutable. So if you rerun this sample, you need to change the name of the output file.

##<a id="java-code"></a>The C# code for Hadoop Streaming

The MapReduce program uses the cat.exe application as a mapping interface to stream the text into the console and the wc.exe application as the reduce interface to count the number of words that are streamed from a document. Both the mapper and reducer read characters, line-by-line, from the standard input stream (stdin) and write to the standard output stream (stdout).



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



The mapper code in the cat.cs file uses a [StreamReader][streamreader] object to read the characters of the incoming stream to the console, which then writes the stream to the standard output stream with the static [Console.Writeline][console-writeline] method.


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


The reducer code in the wc.cs file uses a [StreamReader][streamreader]   object to read characters from the standard input stream that have been output by the cat.exe mapper. As it reads the characters with the [Console.Writeline][console-writeline] method, it counts the words by counting spaces and end-of-line characters at the end of each word. It then writes the total to the standard output stream with the [Console.Writeline][console-writeline] method.

##<a id="summary"></a>Summary

In this tutorial, you saw how to deploy a MapReduce job in HDInsight by using Hadoop Streaming.

##<a id="next-steps"></a>Next steps

For tutorials that run other samples and provide instructions for running Pig, Hive, and MapReduce jobs in Azure HDInsight with Azure PowerShell, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Sample: Pi Estimator][hdinsight-sample-pi-estimator]
* [Sample: Word count][hdinsight-sample-wordcount]
* [Sample: 10GB GraySort][hdinsight-sample-10gb-graysort]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[hadoop-streaming]: http://wiki.apache.org/hadoop/HadoopStreaming
[streamreader]: http://msdn.microsoft.com/library/system.io.streamreader.aspx
[console-writeline]: http://msdn.microsoft.com/library/system.console.writeline
[stdin-stdout-stderr]: http://msdn.microsoft.com/library/3x292kth(v=vs.110).aspx

[powershell-install-configure]: install-configure-powershell.md

[hdinsight-get-started]: hdinsight-get-started.md

[hdinsight-samples]: hdinsight-run-samples.md
[hdinsight-sample-10gb-graysort]: hdinsight-sample-10gb-graysort.md
[hdinsight-sample-csharp-streaming]: hdinsight-sample-csharp-streaming.md
[hdinsight-sample-pi-estimator]: hdinsight-sample-pi-estimator.md
[hdinsight-sample-wordcount]: hdinsight-sample-wordcount.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
