<properties linkid="manage-services-hdinsight-sample-wordcount" urlDisplayName="HDInsight Samples" pageTitle="Samples topic title TBD - Windows Azure" metaKeywords="hdinsight, hdinsight sample, mapreduce" metaDescription="Learn how to run a simple MapReduce sample on HDInsight." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# The HDInsight WordCount Sample
 
This sample topic shows how to run a MapREduce program that counts word occurences in a text with the Windows Azure HDinsight service using Windows Azure PowerShell. The WordCount MapReduce program is written in Java and runs on a Hadoop cluster created and managed by the HDinsight service. The text file analyzed here is the Project Gutenberg eBook edition of The Notebooks of Leonardo Da Vinci. 

The Hadoop MapReduce program reads the text file and counts how often each word occurs. The output is a new text file that consists of lines, each of which contains a word and the count (a key/value tab-separated pair) of how often that word occurred in the document. This process is done in two stages. The mapper (the cat.exe in this sample) takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a work occurs of the word followed by a 1. The reducer (the wc.exe in this sample) then sums these individual counts for each word and emits a single key/value pair that contains the word followed by the sum of its occurrences.

The JAR file that contains the files needed by the Windows Azure HDInsight service to deploy the application to its Hadoop cluster is a .zip file and is available for download.

 
**You will learn:**
		
* How to use Windows Azure PowerShell to run a MapReduce program on the Windows Azure HDInsight service that analyzes data contained in a file.
* How MapReduce programs are written in Java.


**Prerequisites**:	
You have a Windows Azure Account and have enabled the HDInsight Service for your subscription. You have installed Windows Azure PowerShell and the Powershell tools for Windows Azure HDInsight, and have configured them for use with your account. For instructions on how to do this, see [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)

**Outline**		
This topic shows you how to run the sample, presents the Java code for the MapReduce program, summarizes what you have learned, and outlines some next steps. It has the following sections.
	
1. [Run the Sample with Windows Azure PowerShell](#run-sample)	
2. [The Java Code for the WordCount MapReduce Program](#java-code)
3. [Summary](#summary)	
4. [Next Steps](#next-steps)	

<h2><a id="run-sample"></a>Run the Sample with Windows Azure PowerShell</h2>

**The command for running the Wordcount job**	
Hadoop jar hadoop-examples.jar wordcount wasb:///example/data/gutenberg/davinci.txt wasb:///DaVinciAllTopWords

**The parameters for the Wordcount job**	
Parameter0 is just the name of the program, *wordcount*. Parameter1 specifies, respectively, the path/name of the input file (*/example/data/gutenberg/davinci.txt*) and the output directory where the results are saved *(DaVinciAllTopWords*). Note the output directory assumes a default path relative to the /user/ folder. 

1. Open Notepad.
2. Copy and paste the following code into Notepad. (TBD: edit to apply to wordcount)

		Import-Module "C:\Program Files (x86)\PowerShell tools for Windows Azure HDInsight\Microsoft.WindowsAzure.Management.HDInsight.Cmdlet" 
		
		### Provide the Windows Azure subscription name and the HDInsight cluster name.
		$subscriptionName = "myAzureSubscriptionName"   
		$clusterName = "myClusterName"                 
		
		### Provide the HDInsight user credentials that will be used to run the script.
		$creds = Get-Credential 
		
		### Create a MapReduce job definition. The jar file contains several examples.
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" 
 
		### There is one argument that specifies two numbers. 
		### The first number indicates how many maps to create (default is 16). 
		### The second number indicates how many samples are generated per map (10 million by default). 
		### So this program uses 160 million random points to make its estimate of Pi.
		$wordCountJobDefinition.Arguments.Add("pi 16 10000000") 

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

<h2><a id="java-code"></a>The Java Code for the WordCount MapReduce Program</h2>

<code>
 
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

</code>  

<h2><a id="summary"></a>Summary</h2>

In this tutorial, you saw how to deploy a MapReduce job on an Hadoop cluster hosted on the Windows Azure HDinsight Service and how to use Monte Carlo methods that require and generare large datasets that can be managed by this service.

<h2><a id="next-steps"></a>Next Steps</h2>

For tutorials runnng other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Windows Azure HDInsight with Windows Azure PowerShell, see the following topics:

* [Sample: 10GB GraySort][10gb-graysort]

* [Sample: Pi Estimator][pi-estimator]

* [Sample: C# Steaming][cs-streaming]

* [Sample: Scoop Import/Export][scoop]

* [Tutorial: Using Pig][pig]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using MapReduce][mapreduce]


[getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[10gb-graysort]: /en-us/manage/services/hdinsight/sample-10gb-graysort/
[pi-estimator]: /en-us/manage/services/hdinsight/sample-pi-estimator/
[cs-streaming]: /en-us/manage/services/hdinsight/sample-csharp-streaming/
[scoop]: /en-us/manage/services/hdinsight/sample-sqoop-import-export/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
 

