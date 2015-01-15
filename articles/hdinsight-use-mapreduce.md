<properties urlDisplayName="MapReduce with Hadoop in HDInsight" pageTitle="Use Hadoop MapReduce in HDInsight | Azure" metaKeywords="" description="Learn how to use HDInsight to execute a simple Hadoop MapReduce job." metaCanonical="" services="hdinsight" documentationCenter="" title="" authors="mumian" solutions="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/12/2014" ms.author="jgao" />



# Use Hadoop MapReduce in HDInsight

Hadoop MapReduce is a software framework for writing applications which process vast amounts of data. In this tutorial, you will use Azure PowerShell from your workstation to submit a MapReduce program that counts word occurrences in a text to an HDInsight cluster. The word counting program is written in Java and the program comes with the HDInsight cluster.


**Prerequisites:**

Before you begin this tutorial, you must have the following:

- An HDInsight cluster. For instructions on the various ways in which such clusters can be created, see [Provision HDInsight Clusters][hdinsight-provision].

- A workstation with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].

##In this tutorial
1. [Understand the scenario](#scenario)
2. [Run the Sample with Azure PowerShell](#run-sample)	
3. [The Java Code for the word counting MapReduce Program](#java-code)
4. [Next Steps](#next-steps)	

##<a id="scenario"></a>Understand the scenario

The following diagram illustrates how MapReduce works for the word count scenario:

![HDI.WordCountDiagram][image-hdi-wordcountdiagram]



The output of the MapReduce job is a set of key-value pairs. The key is a string that specifies a word and the value is an integer that specifies the total number of occurrences of that word in the text. This is done in two stages: 

* The mapper takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a work occurs of the word followed by a 1. The output will be sorted before sending to reducer. 

* The reducer then sums these individual counts for each word and emits a single key/value pair containing the word followed by the sum of its occurrences.

Running a MapReduce job requires the following elements:

* A MapReduce program. In this tutorial, you will use the word counting sample that comes with HDInsight clusters so you don't need to write your own. It is located on */example/jars/hadoop-examples.jar*. The file name is *hadoop-mapreduce-examples.jar* on version 3.0 HDInsight clusters. For instructions on writing your own MapReduce job, see [Develop Java MapReduce programs for HDInsight][hdinsight-develop-MapReduce-jobs].
* An input file. You will use */example/data/gutenberg/davinci.txt* as the input file. For information on upload files, see [Upload Data to HDInsight][hdinsight-upload-data].
* An output file folder. You will use */example/data/WordCountOutput* as the output file folder. The system will create the folder if it doesn't exist. The MapReduce job will fail if the folder exists.  If you want to run the MapReduce job for the second time, make sure to delete the output folder or specify another output folder.

	
##<a id="run-sample"></a>Run the Sample with Azure PowerShell

1.	Open **Azure PowerShell**. For instructions of opening Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

3. Set the two variables in the following commands, and then run them:
		
		$subscriptionName = "<SubscriptionName>"   # Azure subscription name
		$clusterName = "<ClusterName>"             # HDInsight cluster name
4. Run the following command and provide your Azure account information:

		Add-AzureAccount
		
5. Run the following commands to create a MapReduce job definition:

		# Define the MapReduce job
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///example/data/WordCountOutput" 

	> [AZURE.NOTE] *hadoop-examples.jar* comes with version 2.1 HDInsight clusters. The file has been renamed to *hadoop-mapreduce.jar* on version 3.0 HDInsight clusters.
	
	The hadoop-examples.jar file comes with the HDInsight cluster distribution. There are two arguments for the MapReduce job. The first one is the source file name, and the second is the output file path. The source file comes with the HDInsight cluster distribution, and the output file path will be created at the run-time.

6. Run the following command to submit the MapReduce job:

		# Submit the job
		Select-AzureSubscription $subscriptionName
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition | Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600  

	In addition to the MapReduce job definition, you also provide the HDInsight cluster name where you want to run the MapReduce job, and the credentials. The Start-AzureHDInsightJob is an asynchronized call. To check the completion of the job, use the *Wait-AzureHDInsightJob* cmdlet.

7. Run the following command to check the completion of the MapReduce job:

		Wait-AzureHDInsightJob -Job $wordCountJob -WaitTimeoutInSeconds 3600 

8. Run the following command to check any errors with running the MapReduce job:	
	
		# Get the job output
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError 
		
**To retrieve the results of the MapReduce job**

1. Open **Azure PowerShell**.
2. Run the following command to change directory to c:\ root:

		cd \

	The default Azure Powershell directory is *C:\Windows\System32\WindowsPowerShell\v1.0*. By default, you don't have the write permission on this folder. You must change directory to either the C:\ root directory or a folder where you have write permission.

2. Set the three variables in the following commands, and then run them:

		$subscriptionName = "<SubscriptionName>"       # Azure subscription name
		
		$storageAccountName = "<StorageAccountName>"   # Azure storage account name
		$containerName = "<ContainerName>"			   # Blob storage container name

		The Azure Storage account is the one you created earlier in the tutorial. The storage account is used to host the Blob container that is used as the default HDInsight cluster file system.  The Blob storage container name usually share the same name as the HDInsight cluster unless you specify a different name when you provision the cluster.

3. Run the following commands to create an Azure storage context object:
		
		# Select the current subscription
		Select-AzureSubscription $subscriptionName

		# Create the storage account context object
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	The *Select-AzureSubscription* is used to set the current subscription in case you have multiple subscriptions, and the default subscription is not the one to use. 

4. Run the following command to download the MapReduce job output from the Blob container to the workstation:

		# Download the job output to the workstation
		Get-AzureStorageBlobContent -Container $ContainerName -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force

	The */example/data/WordCountOutput* folder is the output folder specified when you run the MapReduce job. *part-r-00000* is the default file name for MapReduce job output.  The file will be downloaded to the same folder structure on the local folder. For example, in the following screenshot, the current folder is the C root folder.  The file will be downloaded to the *C:\example\data\WordCountOutput\* folder. 

5. Run the following command to print the MapReduce job output file:

		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"


	The MapReduce job produces a file named *part-r-00000* with the words and the counts.  The script uses the findstr command to list all of the words that contains *"there"*.


Note that the output files of a MapReduce job are immutable. So if you rerun this sample you will need to change the name of the output file.

##<a id="java-code"></a>The Java Code for the word counting MapReduce Program

The following is the source code for the word counting Java MapReduce program:
 
	package org.apache.hadoop.examples;
	
	import java.io.IOException;
	import java.util.StringTokenizer;
	
	import org.apache.hadoop.conf.Configuration;
	import org.apache.hadoop.fs.Path;
	import org.apache.hadoop.io.IntWritable;
	import org.apache.hadoop.io.Text;
	import org.apache.hadoop.mapreduce.Job;
	import org.apache.hadoop.mapreduce.Mapper;
	import org.apache.hadoop.mapreduce.Reducer;
	import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
	import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
	import org.apache.hadoop.util.GenericOptionsParser;
	
	public class WordCount {
	
	  public static class TokenizerMapper 
	       extends Mapper<Object, Text, Text, IntWritable>{
	    
	    private final static IntWritable one = new IntWritable(1);
	    private Text word = new Text();
	      
	    public void map(Object key, Text value, Context context
	                    ) throws IOException, InterruptedException {
	      StringTokenizer itr = new StringTokenizer(value.toString());
	      while (itr.hasMoreTokens()) {
	        word.set(itr.nextToken());
	        context.write(word, one);
	      }
	    }
	  }
	  
	  public static class IntSumReducer 
	       extends Reducer<Text,IntWritable,Text,IntWritable> {
	    private IntWritable result = new IntWritable();
	
	    public void reduce(Text key, Iterable<IntWritable> values, 
	                       Context context
	                       ) throws IOException, InterruptedException {
	      int sum = 0;
	      for (IntWritable val : values) {
	        sum += val.get();
	      }
	      result.set(sum);
	      context.write(key, result);
	    }
	  }
	
	  public static void main(String[] args) throws Exception {
	    Configuration conf = new Configuration();
	    String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
	    if (otherArgs.length != 2) {
	      System.err.println("Usage: wordcount <in> <out>");
	      System.exit(2);
	    }
	    Job job = new Job(conf, "word count");
	    job.setJarByClass(WordCount.class);
	    job.setMapperClass(TokenizerMapper.class);
	    job.setCombinerClass(IntSumReducer.class);
	    job.setReducerClass(IntSumReducer.class);
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(IntWritable.class);
	    FileInputFormat.addInputPath(job, new Path(otherArgs[0]));
	    FileOutputFormat.setOutputPath(job, new Path(otherArgs[1]));
	    System.exit(job.waitForCompletion(true) ? 0 : 1);
	  }
	}
 


##<a id="nextsteps"></a>Next steps
While MapReduce provides powerful diagnostic abilities, it can be a bit challenging to master. Other languages such as Pig and Hive provide an easier way to work with data stored in HDInsight. To learn more, see the following articles:

* [Get Started with Azure HDInsight][hdinsight-get-started]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-MapReduce-jobs]
* [Develop C# Hadoop streaming MapReduce programs for HDInsight][hdinsight-develop-streaming]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig] 
* [Run the HDInsight Samples][hdinsight-samples]


[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-develop-mapreduce-jobs]: ../hdinsight-develop-deploy-java-mapreduce/
[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-samples]: ../hdinsight-run-samples/
[hdinsight-provision]: ../hdinsight-provision-clusters/

[powershell-install-configure]: ../install-and-configure-powershell/

[image-hdi-wordcountdiagram]: ./media/hdinsight-get-started/HDI.WordCountDiagram.gif





