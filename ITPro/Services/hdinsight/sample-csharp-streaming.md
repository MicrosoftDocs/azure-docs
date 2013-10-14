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
You have a Windows Azure Account and have enabled the HDInsight Service for your subscription. You have installed Windows Azure PowerShell and the Powershell tools for Windows Azure HDInsight, and have configured them for use with your subscription account and cluster. For instructions on how to do this, see [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)

**Outline**		
This topic shows you how to run the sample, presents the Java code for the MapReduce program, summarizes what you have learned, and outlines some next steps. It has the following sections.
	
1. [Run the Sample with Windows Azure PowerShell](#run-sample)	
2. [The C# Code for Hadoop Streaming](#java-code)
3. [Summary](#summary)	
4. [Next Steps](#next-steps)	

<h2><a id="run-sample"></a>Run the Sample with Windows Azure PowerShell</h2>

**The command for running the C# Streaming Wordcount job**	
Hadoop jar hadoop-streaming.jar -files "wasb:///example/apps/wc.exe,wasb:///example/apps/cat.exe" -input "wasb:///example/data/gutenberg/davinci.txt" -output "wasb:///example/data/StreamingOutput/wc.txt" -mapper "cat.exe" -reducer "wc.exe"


**The parameters for the C# Streaming Wordcount job**	
Parameter 0 is the path and the file name of the mapper and reducer; parameter 1 is the input file and output file path and name; and parameter 2 designates mapper and reducer executables. 

1. Open Notepad.
2. Copy and paste the following code into Notepad. (TBD: edit to apply to wordcount)

		Import-Module "C:\Program Files (x86)\PowerShell tools for Windows Azure HDInsight\Microsoft.WindowsAzure.Management.HDInsight.Cmdlet" 
		
		### Provide the Windows Azure subscription name and the HDInsight cluster name.
		$subscriptionName = "myAzureSubscriptionName"   
		$clusterName = "myClusterName"                 
		
		### Provide the HDInsight user credentials that will be used to run the script.
		$creds = Get-Credential 
		
		### Create a MapReduce job definition. The jar file contains several examples.
		$piEstimatorJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" 
 
		### There is one argument that specifies two numbers. 
		### The first number indicates how many maps to create (default is 16). 
		### The second number indicates how many samples are generated per map (10 million by default). 
		### So this program uses 160 million random points to make its estimate of Pi.
		$piEstimatorJobDefinition.Arguments.Add("pi 16 10000000") 

		### Run the MapReduce job.
		$wordCountJob = $wordCountJobDefinition | Start-AzureHDInsightJob -Credentials $creds -Cluster $clusterName  
		
		### Wait for the job to complete.  
		$wordCountJob | Wait-AzureHDInsightJob -Credentials $creds -WaitTimeoutInSeconds 3600  
		
		### Print the standard error file of the MapReduce job
		Get-AzureHDInsightJobOutput -Cluster $clusterName -Subscription $subscriptionName -JobId $wordCountjob.JobId -StandardError
		
3. Set the values for the two variable at the begining of the script: $subscriptionname, $clustername.
4. Open Windows Azure PowerShell.
5. Copy and paste the modified code into the Windows Azure PowerShell window, and then press **ENTER**. The following screenshot shows the end of the output:

	![HDI.Sample.PiEstimator.RunMRJob][image-hdi-sample-piestimator-runmrjob]
 
TBD: Debug script, add the above screenshot, and add instructions on how to get the result.

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

In this tutorial, you saw how to deploy a MapReduce job on an Hadoop cluster hosted on the Windows Azure HDinsight Service using C# Streaming.

<h2><a id="next-steps"></a>Next Steps</h2>

For tutorials runnng other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Windows Azure HDInsight with Windows Azure PowerShell, see the following topics:


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
 
