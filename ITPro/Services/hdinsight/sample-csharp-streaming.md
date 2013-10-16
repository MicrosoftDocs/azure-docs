<properties linkid="manage-services-hdinsight-sample-csharp-streaming" urlDisplayName="HDInsight Samples" pageTitle="Samples topic title TBD - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to run a sample TBD." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# The HDInsight C# Streaming WordCount Sample
 
Hadoop provides a streaming API to MapReduce that enables you to write map and reduce functions in languages other than Java. This tutorial shows how to write the C# code for MapReduce progams that uses the Hadoop streaming interface and how to run the programs using Windows Azure PowerShell. 

In the example, both the mapper and the reducer are executables that read the input from [stdin][stdin-stdout-stderr] (line by line) and emit the output to [stdout][stdin-stdout-stderr].

When an executable is specified for **mappers**, each mapper task launches the executable as a separate process when the mapper is initialized. As the mapper task runs, it converts its inputs into lines and feeds the lines to the [stdin][stdin-stdout-stderr] of the process. In the meantime, the mapper collects the line-oriented outputs from the stdout of the process and converts each line into a key/value pair, which is collected as the output of the mapper. By default, the prefix of a line up to the first tab character is the key and the rest of the line (excluding the tab character) is the value. If there is no tab character in the line, then entire line is considered as key and the value is null. 

When an executable is specified for **reducers**, each reducer task launches the executable as a separate process when the reducer is initialized. As the reducer task runs, it converts its input key/values pairs into lines and feeds the lines to the [stdin][stdin-stdout-stderr] of the process. In the meantime, the reducer collects the line-oriented outputs from the [stdout][stdin-stdout-stderr] of the process, converts each line into a key/value pair, which is collected as the output of the reducer. By default, the prefix of a line up to the first tab character is the key and the rest of the line (excluding the tab character) is the value. 

For more information on the Hadoop streaming interface, see [Hadoop Streaming][hadoop-streaming]. 
 
**You will learn:**		
* How to use Windows Azure PowerShell to run a C# streaming program on the Windows Azure HDInsight service that analyzes data contained in a file.		
* How to write C# code that uses the Hadoop Streaming interface.


**Prerequisites**:	

- You must have a Windows Azure Account. For options on signing up for an account see [Try Windows Azure out for free](http://www.windowsazure.com/en-us/pricing/free-trial/) page.

- You must have provisioned an HDInsight cluster. For instructions on the various ways in which such clusters can be created, see [Provision HDInsight Clusters](/en-us/manage/services/hdinsight/provision-hdinsight-clusters/)

- You must have installed Windows Azure PowerShell and the HDInsight PowerShell Tools, and have configured them for use with your account. For instructions on how to do this, see [Install and configure PowerShell for HDInsight](/en-us/manage/services/hdinsight/configure-powershell-for-hdinsight/)


**Outline**		
This topic shows you how to run the sample, presents the Java code for the MapReduce program, summarizes what you have learned, and outlines some next steps. It has the following sections.
	
1. [Run the Sample with Windows Azure PowerShell](#run-sample)	
2. [The C# Code for Hadoop Streaming](#java-code)
3. [Summary](#summary)	
4. [Next Steps](#next-steps)	

<h2><a id="run-sample"></a>Run the Sample with Windows Azure PowerShell</h2>

1. Open Windows Azure PowerShell and Notepad.

2. Define the streaming job using the `New-AzureHDInsightStreamingMapReduceJobDefinition` cmdlet. The parameters specify the mapper and reducer functions and the input file and output files. Copy and paste the following code into PowerShell.
 
		### Create a MapReduce job definition for the streaming job.
		### Parameter 0 is the path and the file name of the mapper and reducer.
		### Parameter 1 is the input file and output file path and name.
		### Parameter 2 designates mapper and reducer executables.
		$streamingWC = New-AzureHDInsightStreamingMapReduceJobDefinition -Files "/example/apps/wc.exe", "/example/apps/cat.exe" -InputPath "/example/data/gutenberg/davinci.txt" -OutputPath "/example/data/StreamingOutput/wc.txt" -Mapper "cat.exe" -Reducer "wc.exe" 

3. Copy and paste the following code into Notepad.
	
		### Provide the Windows Azure subscription name and the HDInsight cluster name.
		$subscriptionName = "myAzureSubscriptionName"   
		$clusterName = "myClusterName"
                 
4. Set the values for the two variables: $subscriptionname, $clustername to the subscription and cluster you are using. Copy and paste this modified code into PowerShell and then press **Enter** to run.                 

5. The C# Streaming MapReduce job is run by piping the job definition with the `Start-AzureHDInsightJob`, which requires the cluster and subscription names with the `Wait-AzureHDInsightJob` to get status on the run, and the `Get-AzureHDInsightJobOutput` to display the results in PowerShell. Copy and paste the following code into PowerShell and press **Enter** to see the run the job and get the result.

		### Run the C# Streaming MapReduce job.
		### Wait for the job to complete.
		### Print output and standard error file of the MapReduce job
		$streamingWC | Start-AzureHDInsightJob -Subscription $subid -Cluster $clustername | Wait-AzureHDInsightJob -Subscription $subid -WaitTimeoutInSeconds 3600 | Get-AzureHDInsightJobOutput -Cluster $clustername -Subscription $subid -StandardError 


<h2><a id="java-code"></a>The C# Code for Hadoop Streaming</h2>

The MapReduce program uses the cat.exe application as a mapping interface to stream the text into the console and wc.exe application as the reduce interface to count the number of words that are streamed from a document. Both the mapper and reducer read characters, line by line, from the standard input stream (stdin) and write to the standard output stream (stdout). 


<code>
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

</code>  

The mapper code in the cat.cs file uses a StreamReader object to read the characters of the incoming stream into the console, which in turn writes the stream to the standard output stream with the static Console.Writeline method.

<code>
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

</code>

The reducer code in the wc.cs file uses a [StreamReader][streamreader]   object to read characters from the standard input stream that have been output by the cat.exe mapper. As it reads the characters with the [Console.Writeline][console-writeline] method, it counts the words by counting space and end-of-line characters at the end of each word, and then it writes the total to the standard output stream with the [Console.Writeline][console-writeline] method. 

<h2><a id="summary"></a>Summary</h2>

In this tutorial, you saw how to deploy a MapReduce job on an Hadoop cluster hosted on the Windows Azure HDInsight Service using C# Streaming.

<h2><a id="next-steps"></a>Next Steps</h2>

For tutorials running other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Windows Azure HDInsight with Windows Azure PowerShell, see the following topics:


* [Sample: Pi Estimator][pi-estimator]

* [Sample: Wordcount][wordcount]

* [Sample: 10GB GraySort][10gb-graysort]

* [Sample: Scoop Import/Export][scoop]

* [Tutorial: Using Pig][pig]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using MapReduce][mapreduce]


[getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hadoop-streaming]: http://wiki.apache.org/hadoop/HadoopStreaming
[streamreader]: http://msdn.microsoft.com/en-us/library/system.io.streamreader.aspx
[console-writeline]: http://msdn.microsoft.com/en-us/library/system.console.writeline
[stdin-stdout-stderr]: http://msdn.microsoft.com/en-us/library/3x292kth(v=vs.110).aspx
[pi-estimator]: /en-us/manage/services/hdinsight/sample-pi-estimator/
[wordcount]: /en-us/manage/services/hdinsight/sample-wordcount/
[10gb-graysort]: /en-us/manage/services/hdinsight/sample-10gb-graysort/
[scoop]: /en-us/manage/services/hdinsight/sample-sqoop-import-export/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
 
