<properties
	pageTitle="Run the Hadoop samples in HDInsight | Microsoft Azure"
	description="Get started using the Azure HDInsight service with the samples provided. Use PowerShell scripts that run MapReduce programs on data clusters."
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="mumian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="jgao"/>

#Run Hadoop MapReduce samples in Windows-based HDInsight

[AZURE.INCLUDE [samples-selector](../../includes/hdinsight-run-samples-selector.md)]

A set of samples are provided to help you get started running MapReduce jobs on Hadoop clusters using Azure HDInsight. These samples are made available on each of the HDInsight managed clusters that you create. Running these samples will familiarize you with using Azure PowerShell cmdlets to run jobs on Hadoop clusters.

- [**Word count**][hdinsight-sample-wordcount]: Counts word occurrences in a text file.
- [**C# streaming word count**][hdinsight-sample-csharp-streaming]: Counts word occurrences in a text file using the Hadoop streaming interface.
- [**Pi estimator**][hdinsight-sample-pi-estimator]: Uses a statistical (quasi-Monte Carlo) method to estimate the value of pi.
- [**10-GB Graysort**][hdinsight-sample-10gb-graysort]: Run a general purpose GraySort on a 10 GB file by using HDInsight. There are three jobs to run: Teragen to generate the data, Terasort to sort the data, and Teravalidate to confirm that the data has been properly sorted.

>[AZURE.NOTE] The source code can be found in the Appendix. 

Much additional documentation exists on the web for Hadoop-related technologies, such as Java-based MapReduce programming and streaming, and documentation about the cmdlets that are used in Windows PowerShell scripting. For more information about these resources, see:

- [Develop Java MapReduce programs for Hadoop in HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md)
- [Submit Hadoop jobs in HDInsight](hdinsight-submit-hadoop-jobs-programmatically.md)
- [Introduction to Azure HDInsight][hdinsight-introduction]

Nowadays, a lot of people choose Hive and Pig over MapReduce.  For more information, see :

- [Use Hive in HDInsight](hdinsight-use-hive.md)
- [Use Pig in HDInsight](hdinsight-use-pig.md)
 
**Prerequisites**:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **an HDInsight cluster**. For instructions on the various ways in which such clusters can be created, see [Create Hadoop clusters in HDInsight](hdinsight-provision-clusters.md).
- **A workstation with Azure PowerShell**.

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

## <a name="hdinsight-sample-wordcount"></a>Word count - Java 

To submit a MapReduce project, you first create a MapReduce job definition. In the job definition, you specify the MapReduce program jar file and the location of the jar file, which is **wasbs:///example/jars/hadoop-mapreduce-examples.jar**, the class name, and the arguments.  The wordcount MapReduce program takes two arguments: the source file that will be used to count words, and the location for output.

The source code can be found in the [Appendix A](#apendix-a---the-word-count-MapReduce-program-in-java).

For the procedure of developing a Java MapReduce program, see - [Develop Java MapReduce programs for Hadoop in HDInsight](hdinsight-develop-deploy-java-mapreduce-linux.md)
 
**To submit a word count MapReduce job**

1. Open **Windows PowerShell ISE**. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
2. Paste the following PowerShell script:

		$subscriptionName = "<Azure Subscription Name>"
		$resourceGroupName = "<Resource Group Name>"
		$clusterName = "<HDInsight cluster name>"             # HDInsight cluster name
		
		Select-AzureRmSubscription -SubscriptionName $subscriptionName
		
		# Define the MapReduce job
		$mrJobDefinition = New-AzureRmHDInsightMapReduceJobDefinition `
									-JarFile "wasbs:///example/jars/hadoop-mapreduce-examples.jar" `
									-ClassName "wordcount" `
									-Arguments "wasbs:///example/data/gutenberg/davinci.txt", "wasbs:///example/data/WordCountOutput1"
		
		# Submit the job and wait for job completion
		$cred = Get-Credential -Message "Enter the HDInsight cluster HTTP user credential:" 
		$mrJob = Start-AzureRmHDInsightJob `
							-ResourceGroupName $resourceGroupName `
							-ClusterName $clusterName `
							-HttpCredential $cred `
							-JobDefinition $mrJobDefinition 
		
		Wait-AzureRmHDInsightJob `
			-ResourceGroupName $resourceGroupName `
			-ClusterName $clusterName `
			-HttpCredential $cred `
			-JobId $mrJob.JobId 
		
		# Get the job output
		$cluster = Get-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $clusterName
		$defaultStorageAccount = $cluster.DefaultStorageAccount -replace '.blob.core.windows.net'
		$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccount)[0].Value
		$defaultStorageContainer = $cluster.DefaultStorageContainer
		
		Get-AzureRmHDInsightJobOutput `
			-ResourceGroupName $resourceGroupName `
			-ClusterName $clusterName `
			-HttpCredential $cred `
			-DefaultStorageAccountName $defaultStorageAccount `
			-DefaultStorageAccountKey $defaultStorageAccountKey `
			-DefaultContainer $defaultStorageContainer  `
			-JobId $mrJob.JobId `
			-DisplayOutputType StandardError

		# Download the job output to the workstation
		$storageContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccount -StorageAccountKey $defaultStorageAccountKey 
		Get-AzureStorageBlobContent -Container $defaultStorageContainer -Blob example/data/WordCountOutput/part-r-00000 -Context $storageContext -Force
		
		# Display the output file
		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

	The MapReduce job produces a file named *part-r-00000*, which contains words and the counts. The script uses the **findstr** command to list all of the words that contains *"there"*.

3. Set the first 3 variables, and run the script.

## <a name="hdinsight-sample-csharp-streaming"></a>Word count - C# streaming

Hadoop provides a streaming API to MapReduce, which enables you to write map and reduce functions in languages other than Java.

> [AZURE.NOTE] The steps in this tutorial apply only to Windows-based HDInsight clusters. For an example of streaming for Linux-based HDInsight clusters, see [Develop Python streaming programs for HDInsight](hdinsight-hadoop-streaming-python.md).

In the example, the mapper and the reducer are executables that read the input from [stdin][stdin-stdout-stderr] (line-by-line) and emit the output to [stdout][stdin-stdout-stderr]. The program counts all of the words in the text.

When an executable is specified for **mappers**, each mapper task launches the executable as a separate process when the mapper is initialized. As the mapper task runs, it converts its input into lines, and feeds the lines to the [stdin][stdin-stdout-stderr] of the process.

In the meantime, the mapper collects the line-oriented output from the stdout of the process. It converts each line into a key/value pair, which is collected as the output of the mapper. By default, the prefix of a line up to the first Tab character is the key, and the remainder of the line (excluding the Tab character) is the value. If there is no Tab character in the line, entire line is considered as the key, and the value is null.

When an executable is specified for **reducers**, each reducer task launches the executable as a separate process when the reducer is initialized. As the reducer task runs, it converts its input key/values pairs into lines, and it feeds the lines to the [stdin][stdin-stdout-stderr] of the process.

In the meantime, the reducer collects the line-oriented output from the [stdout][stdin-stdout-stderr] of the process. It converts each line to a key/value pair, which is collected as the output of the reducer. By default, the prefix of a line up to the first Tab character is the key, and the remainder of the line (excluding the Tab character) is the value.

For more information about the Hadoop Streaming interface, see [Hadoop Streaming][hadoop-streaming].

**To submit a C# streaming word count job**

- Follow the procdure in [Word count - Java](#word-count-java), and replace the job definition with the following:

		$mrJobDefinition = New-AzureRmHDInsightStreamingMapReduceJobDefinition `
    							-Files "/example/apps/cat.exe","/example/apps/wc.exe" `
    							-Mapper "cat.exe" `
    							-Reducer "wc.exe" `
    							-InputPath "/example/data/gutenberg/davinci.txt" `
    							-OutputPath "/example/data/StreamingOutput/wc.txt"  


	The output file shall be:
	
		example/data/StreamingOutput/wc.txt/part-00000		
								
## <a name="hdinsight-sample-pi-estimator"></a>PI estimator

The pi estimator uses a statistical (quasi-Monte Carlo) method to estimate the value of pi. Points placed at random inside of a unit square also fall within a circle inscribed within that square with a probability equal to the area of the circle, pi/4. The value of pi can be estimated from the value of 4R, where R is the ratio of the number of points that are inside the circle to the total number of points that are within the square. The larger the sample of points used, the better the estimate is.

The script provided for this sample submits a Hadoop jar job and is set up to run with a value 16 maps, each of which is required to compute 10 million sample points by the parameter values. These parameter values can be changed to improve the estimated value of pi. For reference, the first 10 decimal places of pi are 3.1415926535.

**To submit a pi estimator job**

- Follow the procdure in [Word count - Java](#word-count-java), and replace the job definition with the following:

		$mrJobJobDefinition = New-AzureRmHDInsightMapReduceJobDefinition `
									-JarFile "wasbs:///example/jars/hadoop-mapreduce-examples.jar" `
									-ClassName "pi" `
									-Arguments "16", "10000000"

## <a name="hdinsight-sample-10gb-graysort"></a>10-GB Graysort

This sample uses a modest 10GB of data so that it can be run relatively quickly. It uses the MapReduce applications developed by Owen O'Malley and Arun Murthy that won the annual general-purpose ("daytona") terabyte sort benchmark in 2009 with a rate of 0.578TB/min (100TB in 173 minutes). For more information on this and other sorting benchmarks, see the [Sortbenchmark](http://sortbenchmark.org/) site.

This sample uses three sets of MapReduce programs:

1. **TeraGen** is a MapReduce program that you can use to generate the rows of data to sort.
2. **TeraSort** samples the input data and uses MapReduce to sort the data into a total order. TeraSort is a standard sort of MapReduce functions, except for a custom partitioner that uses a sorted list of N-1 sampled keys that define the key range for each reduce. In particular, all keys such that sample[i-1] <= key < sample[i] are sent to reduce i. This guarantees that the outputs of reduce i are all less than the output of reduce i+1.
3. **TeraValidate** is a MapReduce program that validates that the output is globally sorted. It creates one map per file in the output directory, and each map ensures that each key is less than or equal to the previous one. The map function also generates records of the first and last keys of each file, and the reduce function ensures that the first key of file i is greater than the last key of file i-1. Any problems are reported as an output of the reduce with the keys that are out of order.

The input and output format, used by all three applications, reads and writes the text files in the right format. The output of the reduce has replication set to 1, instead of the default 3, because the benchmark contest does not require that the output data be replicated on to multiple nodes.

Three tasks are required by the sample, each corresponding to one of the MapReduce programs described in the introduction:

1. Generate the data for sorting by running the **TeraGen** MapReduce job.
2. Sort the data by running the **TeraSort** MapReduce job.
3. Confirm that the data has been correctly sorted by running the **TeraValidate** MapReduce job.

**To submit the jobs**

- Follow the procdure in [Word count - Java](#word-count-java), and use the following job definitions:

	$teragen = New-AzureRmHDInsightMapReduceJobDefinition `
								-JarFile "/example/jars/hadoop-mapreduce-examples.jar" `
								-ClassName "teragen" `
								-Arguments "-Dmapred.map.tasks=50", "100000000", "/example/data/10GB-sort-input"
	
	$terasort = New-AzureRmHDInsightMapReduceJobDefinition `
								-JarFile "/example/jars/hadoop-mapreduce-examples.jar" `
								-ClassName "terasort" `
								-Arguments "-Dmapred.map.tasks=50", "-Dmapred.reduce.tasks=25", "/example/data/10GB-sort-input", "/example/data/10GB-sort-output"
	
	$teravalidate = New-AzureRmHDInsightMapReduceJobDefinition `
								-JarFile "/example/jars/hadoop-mapreduce-examples.jar" `
								-ClassName "teravalidate" `
								-Arguments "-Dmapred.map.tasks=50", "-Dmapred.reduce.tasks=25", "/example/data/10GB-sort-output", "/example/data/10GB-sort-validate"


##Next steps 

From this article and the articles in each of the samples, you learned how to run the samples included with the HDInsight clusters by using Azure PowerShell. For tutorials about using Pig, Hive, and MapReduce with HDInsight, see the following topics:

* [Get started using Hadoop with Hive in HDInsight to analyze mobile handset use][hdinsight-get-started]
* [Use Pig with Hadoop on HDInsight][hdinsight-use-pig]
* [Use Hive with Hadoop on HDInsight][hdinsight-use-hive]
* [Submit Hadoop Jobs in HDInsight] [hdinsight-submit-jobs]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]
* [Debug Hadoop in HDInsight: Error messages] [hdinsight-errors]


## Appendix A - The Word count source code

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


## Appendix B - The word count streaming source code

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





## Appendix C - The Pi estimator source code

The pi estimator Java code that contains the mapper and reducer functions is available for inspection below. The mapper program generates a specified number of points placed at random inside of a unit square and then counts the number of those points that are inside the circle. The reducer program accumulates points counted by the mappers and then estimates the value of pi from the formula 4R, where R is the ratio of the number of points counted inside the circle to the total number of points that are within the square.

 	/**
 	* Licensed to the Apache Software Foundation (ASF) under one
 	* or more contributor license agreements. See the NOTICE file
 	* distributed with this work for additional information
 	* regarding copyright ownership. The ASF licenses this file
 	* to you under the Apache License, Version 2.0 (the
 	* "License"); you may not use this file except in compliance
 	* with the License. You may obtain a copy of the License at
 	*
	* http://www.apache.org/licenses/LICENSE-2.0
 	*
 	* Unless required by applicable law or agreed to in writing, software
 	* distributed under the License is distributed on an "AS IS" BASIS,
 	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 	implied.
 	* See the License for the specific language governing permissions and
 	* limitations under the License.
 	*/

 	package org.apache.hadoop.examples;

 	import java.io.IOException;
 	import java.math.BigDecimal;
 	import java.util.Iterator;

 	import org.apache.hadoop.conf.Configured;
 	import org.apache.hadoop.fs.FileSystem;
 	import org.apache.hadoop.fs.Path;
 	import org.apache.hadoop.io.BooleanWritable;
 	import org.apache.hadoop.io.LongWritable;
 	import org.apache.hadoop.io.SequenceFile;
 	import org.apache.hadoop.io.Writable;
 	import org.apache.hadoop.io.WritableComparable;
 	import org.apache.hadoop.io.SequenceFile.CompressionType;
 	import org.apache.hadoop.mapred.FileInputFormat;
 	import org.apache.hadoop.mapred.FileOutputFormat;
 	import org.apache.hadoop.mapred.JobClient;
 	import org.apache.hadoop.mapred.JobConf;
 	import org.apache.hadoop.mapred.MapReduceBase;
 	import org.apache.hadoop.mapred.Mapper;
 	import org.apache.hadoop.mapred.OutputCollector;
 	import org.apache.hadoop.mapred.Reducer;
 	import org.apache.hadoop.mapred.Reporter;
 	import org.apache.hadoop.mapred.SequenceFileInputFormat;
 	import org.apache.hadoop.mapred.SequenceFileOutputFormat;
 	import org.apache.hadoop.util.Tool;
 	import org.apache.hadoop.util.ToolRunner;


	//A Map-reduce program to estimate the value of Pi
	//using quasi-Monte Carlo method.
	//
	//Mapper:
	//Generate points in a unit square
	//and then count points inside/outside of the inscribed circle of the square.
	//
	//Reducer:
	//Accumulate points inside/outside results from the mappers.
	//Let numTotal = numInside + numOutside.
	//The fraction numInside/numTotal is a rational approximation of
	//the value (Area of the circle)/(Area of the square),
	//where the area of the inscribed circle is Pi/4
	//and the area of unit square is 1.
	//Then, Pi is estimated value to be 4(numInside/numTotal).
	//

 	public class PiEstimator extends Configured implements Tool {
	//tmp directory for input/output
 	static private final Path TMP_DIR = new Path(
 	PiEstimator.class.getSimpleName() + "_TMP_3_141592654");

	//2-dimensional Halton sequence {H(i)},
	//where H(i) is a 2-dimensional point and i >= 1 is the index.
	//Halton sequence is used to generate sample points for Pi estimation.
 	private static class HaltonSequence {
	// Bases
 	static final int[] P = {2, 3};
	//Maximum number of digits allowed
 	static final int[] K = {63, 40};

 	private long index;
 	private double[] x;
 	private double[][] q;
 	private int[][] d;

	//Initialize to H(startindex),
	//so the sequence begins with H(startindex+1).
 	HaltonSequence(long startindex) {
 	index = startindex;
 	x = new double[K.length];
 	q = new double[K.length][];
 	d = new int[K.length][];
 	for(int i = 0; i < K.length; i++) {
 	q[i] = new double[K[i]];
 	d[i] = new int[K[i]];
 	}

 	for(int i = 0; i < K.length; i++) {
 	long k = index;
 	x[i] = 0;

 	for(int j = 0; j < K[i]; j++) {
 	q[i][j] = (j == 0? 1.0: q[i][j-1])/P[i];
 	d[i][j] = (int)(k % P[i]);
 	k = (k - d[i][j])/P[i];
 	x[i] += d[i][j] * q[i][j];
 	}
 	}
 	}

	//Compute next point.
	//Assume the current point is H(index).
	//Compute H(index+1).
	//@return a 2-dimensional point with coordinates in [0,1)^2
 	double[] nextPoint() {
 	index++;
 	for(int i = 0; i < K.length; i++) {
 	for(int j = 0; j < K[i]; j++) {
 	d[i][j]++;
 	x[i] += q[i][j];
 	if (d[i][j] < P[i]) {
 	break;
 	}
 	d[i][j] = 0;
 	x[i] -= (j == 0? 1.0: q[i][j-1]);
 	}
 	}
 	return x;
 	}
 	}

	//Mapper class for Pi estimation.
	//Generate points in a unit square and then
	//count points inside/outside of the inscribed circle of the square.
 	public static class PiMapper extends MapReduceBase
 	implements Mapper<LongWritable, LongWritable, BooleanWritable, LongWritable> {

	//Map method.
	//@param offset samples starting from the (offset+1)th sample.
	//@param size the number of samples for this map
	//@param out output {ture->numInside, false->numOutside}
	//@param reporter
 	public void map(LongWritable offset,
 	LongWritable size,
 	OutputCollector<BooleanWritable, LongWritable> out,
 	Reporter reporter) throws IOException {

 	final HaltonSequence haltonsequence = new HaltonSequence(offset.get());
 	long numInside = 0L;
 	long numOutside = 0L;

 	for(long i = 0; i < size.get(); ) {
 	//generate points in a unit square
 	final double[] point = haltonsequence.nextPoint();

 	//count points inside/outside of the inscribed circle of the square
 	final double x = point[0] - 0.5;
 	final double y = point[1] - 0.5;
 	if (x*x + y*y > 0.25) {
 	numOutside++;
 	} else {
 	numInside++;
 	}

 	//report status
 	i++;
 	if (i % 1000 == 0) {
 	reporter.setStatus("Generated " + i + " samples.");
 	}
 	}

 	//output map results
 	out.collect(new BooleanWritable(true), new LongWritable(numInside));
 	out.collect(new BooleanWritable(false), new LongWritable(numOutside));
 	}
 	}


	//Reducer class for Pi estimation.
	//Accumulate points inside/outside results from the mappers.
 	public static class PiReducer extends MapReduceBase
 	implements Reducer<BooleanWritable, LongWritable, WritableComparable<?>, Writable> {

 	private long numInside = 0;
 	private long numOutside = 0;
 	private JobConf conf; //configuration for accessing the file system

	//Store job configuration.
 	@Override
 	public void configure(JobConf job) {
 	conf = job;
 	}


	// Accumulate number of points inside/outside results from the mappers.
	// @param isInside Is the points inside?
	// @param values An iterator to a list of point counts
	// @param output dummy, not used here.
	// @param reporter

 	public void reduce(BooleanWritable isInside,
 	Iterator<LongWritable> values,
 	OutputCollector<WritableComparable<?>, Writable> output,
 	Reporter reporter) throws IOException {
 	if (isInside.get()) {
 	for(; values.hasNext(); numInside += values.next().get());
 	} else {
 	for(; values.hasNext(); numOutside += values.next().get());
 	}
 	}

 	//Reduce task done, write output to a file.
 	@Override
 	public void close() throws IOException {
 	//write output to a file
 	Path outDir = new Path(TMP_DIR, "out");
 	Path outFile = new Path(outDir, "reduce-out");
 	FileSystem fileSys = FileSystem.get(conf);
 	SequenceFile.Writer writer = SequenceFile.createWriter(fileSys, conf,
 	outFile, LongWritable.class, LongWritable.class,
 	CompressionType.NONE);
 	writer.append(new LongWritable(numInside), new LongWritable(numOutside));
 	writer.close();
 	}
 	}

	//Run a map/reduce job for estimating Pi.
	//@return the estimated value of Pi.
 	public static BigDecimal estimate(int numMaps, long numPoints, JobConf jobConf
 	)
 	throws IOException {
 	//setup job conf
 	jobConf.setJobName(PiEstimator.class.getSimpleName());

 	jobConf.setInputFormat(SequenceFileInputFormat.class);

 	jobConf.setOutputKeyClass(BooleanWritable.class);
 	jobConf.setOutputValueClass(LongWritable.class);
 	jobConf.setOutputFormat(SequenceFileOutputFormat.class);

 	jobConf.setMapperClass(PiMapper.class);
 	jobConf.setNumMapTasks(numMaps);

 	jobConf.setReducerClass(PiReducer.class);
 	jobConf.setNumReduceTasks(1);

 	// turn off speculative execution, because DFS doesn't handle
 	// multiple writers to the same file.
 	jobConf.setSpeculativeExecution(false);

 	//setup input/output directories
 	final Path inDir = new Path(TMP_DIR, "in");
 	final Path outDir = new Path(TMP_DIR, "out");
 	FileInputFormat.setInputPaths(jobConf, inDir);
 	FileOutputFormat.setOutputPath(jobConf, outDir);

 	final FileSystem fs = FileSystem.get(jobConf);
 	if (fs.exists(TMP_DIR)) {
	 throw new IOException("Tmp directory " + fs.makeQualified(TMP_DIR)
	 + " already exists. Please remove it first.");
	 }
	 if (!fs.mkdirs(inDir)) {
	 throw new IOException("Cannot create input directory " + inDir);
	 }

	 //generate an input file for each map task
	 try {
	 for(int i=0; i < numMaps; ++i) {
	 final Path file = new Path(inDir, "part"+i);
	 final LongWritable offset = new LongWritable(i * numPoints);
	 final LongWritable size = new LongWritable(numPoints);
	 final SequenceFile.Writer writer = SequenceFile.createWriter(
	 fs, jobConf, file,
	 LongWritable.class, LongWritable.class, CompressionType.NONE);
	 try {
	 writer.append(offset, size);
	 } finally {
	 writer.close();
	 }
	 System.out.println("Wrote input for Map #"+i);
	 }

	 //start a map/reduce job
	 System.out.println("Starting Job");
	 final long startTime = System.currentTimeMillis();
	 JobClient.runJob(jobConf);
	 final double duration = (System.currentTimeMillis() - startTime)/1000.0;
	 System.out.println("Job Finished in " + duration + " seconds");

	 //read outputs
	 Path inFile = new Path(outDir, "reduce-out");
	 LongWritable numInside = new LongWritable();
	 LongWritable numOutside = new LongWritable();
	 SequenceFile.Reader reader = new SequenceFile.Reader(fs, inFile, jobConf);
	 try {
	 reader.next(numInside, numOutside);
	 } finally {
	 reader.close();
	 }

	 //compute estimated value
	 return BigDecimal.valueOf(4).setScale(20)
	 .multiply(BigDecimal.valueOf(numInside.get()))
	 .divide(BigDecimal.valueOf(numMaps))
	 .divide(BigDecimal.valueOf(numPoints));
	 } finally {
	 fs.delete(TMP_DIR, true);
	 }
	 }

	//Parse arguments and then runs a map/reduce job.
	//Print output in standard out.
	//@return a non-zero if there is an error. Otherwise, return 0.
	 public int run(String[] args) throws Exception {
	 if (args.length != 2) {
	 System.err.println("Usage: "+getClass().getName()+" <nMaps> <nSamples>");
	 ToolRunner.printGenericCommandUsage(System.err);
	 return -1;
	 }

	 final int nMaps = Integer.parseInt(args[0]);
	 final long nSamples = Long.parseLong(args[1]);

	 System.out.println("Number of Maps = " + nMaps);
	 System.out.println("Samples per Map = " + nSamples);

	 final JobConf jobConf = new JobConf(getConf(), getClass());
	 System.out.println("Estimated value of Pi is "
	 + estimate(nMaps, nSamples, jobConf));
	 return 0;
	 }

	 //main method for running it as a stand alone command.
	 public static void main(String[] argv) throws Exception {
	 System.exit(ToolRunner.run(null, new PiEstimator(), argv));
	 }
	 }
	 
## Appendix D - The 10gb graysort source code

The code for the TeraSort MapReduce program is presented for inspection in this section.


	/**
	 * Licensed to the Apache Software Foundation (ASF) under one
	 * or more contributor license agreements.  See the NOTICE file
	 * distributed with this work for additional information
	 * regarding copyright ownership.  The ASF licenses this file
	 * to you under the Apache License, Version 2.0 (the
	 * "License"); you may not use this file except in compliance
	 * with the License.  You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	package org.apache.hadoop.examples.terasort;

	import java.io.IOException;
	import java.io.PrintStream;
	import java.net.URI;
	import java.util.ArrayList;
	import java.util.List;

	import org.apache.commons.logging.Log;
	import org.apache.commons.logging.LogFactory;
	import org.apache.hadoop.conf.Configured;
	import org.apache.hadoop.filecache.DistributedCache;
	import org.apache.hadoop.fs.FileSystem;
	import org.apache.hadoop.fs.Path;
	import org.apache.hadoop.io.NullWritable;
	import org.apache.hadoop.io.SequenceFile;
	import org.apache.hadoop.io.Text;
	import org.apache.hadoop.mapred.FileOutputFormat;
	import org.apache.hadoop.mapred.JobClient;
	import org.apache.hadoop.mapred.JobConf;
	import org.apache.hadoop.mapred.Partitioner;
	import org.apache.hadoop.util.Tool;
	import org.apache.hadoop.util.ToolRunner;

	/**
	 * Generates the sampled split points, launches the job,
	 * and waits for it to finish.
	 * <p>
	 * To run the program:
	 * <b>bin/hadoop jar hadoop-examples-*.jar terasort in-dir out-dir</b>
	 */

	public class TeraSort extends Configured implements Tool {
	  private static final Log LOG = LogFactory.getLog(TeraSort.class);

	  /**
	   * A partitioner that splits text keys into roughly equal
	   * partitions in a global sorted order.
	   */

	  static class TotalOrderPartitioner implements Partitioner<Text,Text>{
	    private TrieNode trie;
	    private Text[] splitPoints;

	    /**
	     * A generic trie node
	     */
	    static abstract class TrieNode {
	      private int level;
	      TrieNode(int level) {
	        this.level = level;
	      }
	      abstract int findPartition(Text key);
	      abstract void print(PrintStream strm) throws IOException;
	      int getLevel() {
	        return level;
	      }
	    }

	    /**
	     * An inner trie node that contains 256 children based on the next
	     * character.
	     */
	    static class InnerTrieNode extends TrieNode {
	      private TrieNode[] child = new TrieNode[256];

	      InnerTrieNode(int level) {
	        super(level);
	      }
	      int findPartition(Text key) {
	        int level = getLevel();
	        if (key.getLength() <= level) {
	          return child[0].findPartition(key);
	        }
	        return child[key.getBytes()[level]].findPartition(key);
	      }
	      void setChild(int idx, TrieNode child) {
	        this.child[idx] = child;
	      }
	      void print(PrintStream strm) throws IOException {
	        for(int ch=0; ch < 255; ++ch) {
	          for(int i = 0; i < 2*getLevel(); ++i) {
	            strm.print(' ');
	          }
	          strm.print(ch);
	          strm.println(" ->");
	          if (child[ch] != null) {
	            child[ch].print(strm);
	          }
	        }
	      }
	    }

	    /**
	     * A leaf trie node that does string compares to figure out where the given
	     * key belongs between lower..upper.
	     */
	    static class LeafTrieNode extends TrieNode {
	      int lower;
	      int upper;
	      Text[] splitPoints;
	      LeafTrieNode(int level, Text[] splitPoints, int lower, int upper) {
	        super(level);
	        this.splitPoints = splitPoints;
	        this.lower = lower;
	        this.upper = upper;
	      }
	      int findPartition(Text key) {
	        for(int i=lower; i<upper; ++i) {
	          if (splitPoints[i].compareTo(key) >= 0) {
	            return i;
	          }
	        }
	        return upper;
	      }
	      void print(PrintStream strm) throws IOException {
	        for(int i = 0; i < 2*getLevel(); ++i) {
	          strm.print(' ');
	        }
	        strm.print(lower);
	        strm.print(", ");
	        strm.println(upper);
	      }
	    }


	    /**
	     * Read the cut points from the given sequence file.
	     * @param fs the file system
	     * @param p the path to read
	     * @param job the job config
	     * @return the strings to split the partitions on
	     * @throws IOException
	     */
	    private static Text[] readPartitions(FileSystem fs, Path p,
	                                         JobConf job) throws IOException {
	      SequenceFile.Reader reader = new SequenceFile.Reader(fs, p, job);
	      List<Text> parts = new ArrayList<Text>();
	      Text key = new Text();
	      NullWritable value = NullWritable.get();
	      while (reader.next(key, value)) {
	        parts.add(key);
	        key = new Text();
	      }
	      reader.close();
	      return parts.toArray(new Text[parts.size()]);  
	    }

	    /**
	     * Given a sorted set of cut points, build a trie that will find the correct
	     * partition quickly.
	     * @param splits the list of cut points
	     * @param lower the lower bound of partitions 0..numPartitions-1
	     * @param upper the upper bound of partitions 0..numPartitions-1
	     * @param prefix the prefix that we have already checked against
	     * @param maxDepth the maximum depth we will build a trie for
	     * @return the trie node that will divide the splits correctly
	     */
	    private static TrieNode buildTrie(Text[] splits, int lower, int upper,
	                                      Text prefix, int maxDepth) {
	      int depth = prefix.getLength();
	      if (depth >= maxDepth || lower == upper) {
	        return new LeafTrieNode(depth, splits, lower, upper);
	      }
	      InnerTrieNode result = new InnerTrieNode(depth);
	      Text trial = new Text(prefix);
	      // append an extra byte on to the prefix
	      trial.append(new byte[1], 0, 1);
	      int currentBound = lower;
	      for(int ch = 0; ch < 255; ++ch) {
	        trial.getBytes()[depth] = (byte) (ch + 1);
	        lower = currentBound;
	        while (currentBound < upper) {
	          if (splits[currentBound].compareTo(trial) >= 0) {
	            break;
	          }
	          currentBound += 1;
	        }
	        trial.getBytes()[depth] = (byte) ch;
	        result.child[ch] = buildTrie(splits, lower, currentBound, trial,
	                                     maxDepth);
	      }
	      // pick up the rest
	      trial.getBytes()[depth] = 127;
	      result.child[255] = buildTrie(splits, currentBound, upper, trial,
	                                    maxDepth);
	      return result;
	    }

	    public void configure(JobConf job) {
	      try {
	        FileSystem fs = FileSystem.getLocal(job);
	        Path partFile = new Path(TeraInputFormat.PARTITION_FILENAME);
	        splitPoints = readPartitions(fs, partFile, job);
	        trie = buildTrie(splitPoints, 0, splitPoints.length, new Text(), 2);
	      } catch (IOException ie) {
	        throw new IllegalArgumentException("can't read paritions file", ie);
	      }
	    }

	    public TotalOrderPartitioner() {
	    }

	    public int getPartition(Text key, Text value, int numPartitions) {
	      return trie.findPartition(key);
	    }

	  }

	  public int run(String[] args) throws Exception {
	    LOG.info("starting");
	    JobConf job = (JobConf) getConf();
	    Path inputDir = new Path(args[0]);
	    inputDir = inputDir.makeQualified(inputDir.getFileSystem(job));
	    Path partitionFile = new Path(inputDir, TeraInputFormat.PARTITION_FILENAME);
	    URI partitionUri = new URI(partitionFile.toString() +
	                               "#" + TeraInputFormat.PARTITION_FILENAME);
	    TeraInputFormat.setInputPaths(job, new Path(args[0]));
	    FileOutputFormat.setOutputPath(job, new Path(args[1]));
	    job.setJobName("TeraSort");
	    job.setJarByClass(TeraSort.class);
	    job.setOutputKeyClass(Text.class);
	    job.setOutputValueClass(Text.class);
	    job.setInputFormat(TeraInputFormat.class);
	    job.setOutputFormat(TeraOutputFormat.class);
	    job.setPartitionerClass(TotalOrderPartitioner.class);
	    TeraInputFormat.writePartitionFile(job, partitionFile);
	    DistributedCache.addCacheFile(partitionUri, job);
	    DistributedCache.createSymlink(job);
	    job.setInt("dfs.replication", 1);
	    TeraOutputFormat.setFinalSync(job, true);
	    JobClient.runJob(job);
	    LOG.info("done");
	    return 0;
	  }

	  /**
	   * @param args
	   */

	  public static void main(String[] args) throws Exception {
	    int res = ToolRunner.run(new JobConf(), new TeraSort(), args);
	    System.exit(res);
	  }
	}














 




[hdinsight-errors]: hdinsight-debug-jobs.md

[hdinsight-sdk-documentation]: https://msdn.microsoft.com/library/azure/dn479185.aspx

[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-introduction]: hdinsight-hadoop-introduction.md


[powershell-install-configure]: ../powershell-install-configure.md

[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md

[hdinsight-samples]: hdinsight-run-samples.md
[hdinsight-sample-10gb-graysort]: #hdinsight-sample-10gb-graysort
[hdinsight-sample-csharp-streaming]: #hdinsight-sample-csharp-streaming
[hdinsight-sample-pi-estimator]: #hdinsight-sample-pi-estimator
[hdinsight-sample-wordcount]: #hdinsight-sample-wordcount

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md

[streamreader]: http://msdn.microsoft.com/library/system.io.streamreader.aspx
[console-writeline]: http://msdn.microsoft.com/library/system.console.writeline
[stdin-stdout-stderr]: https://msdn.microsoft.com/library/3x292kth.aspx