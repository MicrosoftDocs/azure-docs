<properties linkid="manage-services-hdinsight-sample-10gb-graysort" urlDisplayName="HDInsight Samples" pageTitle="Samples topic title TBD - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to run a sample TBD." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# The 10GB GraySort Sample
 
This sample topic shows how to run a general purpose GraySort on a file using Windows Azure PowerShell on the Windows Azure HDInsight Service. A GraySort is a benchmark sort whose metric is the sort rate (TB/minute) that is achieved while sorting very large amounts of data, usually a 100 TB minimum. 

This sample uses a modest 10 GB of data so that it can be run relatively quickly. It uses the MapReduce applications developed by Owen O'Malley and Arun Murthy that won the annual general purpose ("daytona") terabyte sort benchmark in 2009 with a rate of 0.578 TB/min (100 TB in 173 minutes). 

For more information on this and other sorting benchmarks, see the [Sortbenchmark](http://sortbenchmark.org/)   site.

This sample uses three sets of MapReduce programs:	
 
1. **TeraGen** is a MapReduce program that you can use to generate the rows of data to sort.
2. **TeraSort** samples the input data and uses MapReduce to sort the data into a total order. TeraSort is a standard sort of MapReduce functions, except for a custom partitioner that uses a sorted list of N-1 sampled keys that define the key range for each reduce. In particular, all keys such that sample[i-1] <= key < sample[i] are sent to reduce i. This guarantees that the output of reduce i are all less than the output of reduce i+1.
3. **TeraValidate** is a MapReduce program that validates the output is globally sorted. It creates one map per a file in the output directory and each map ensures that each key is less than or equal to the previous one. The map function also generates records of the first and last keys of each file and the reduce function ensures that the first key of file i is greater than the last key of file i-1. Any problems are reported as output of the reduce with the keys that are out of order.

The input and output format, used by all three applications, read and write the text files in the right format. The output of the reduce has replication set to 1, instead of the default 3, because the benchmark contest does not require the output data be replicated on to multiple nodes.

The source code for these three MapReduce programs is provided in the org.apache.hadoop.examples.terasort.zip file available ... location TBD.

 
**You will learn:**		
* How to use Windows Azure PowerShell to run a series of MapReduce programs on Windows Azure HDInsight.
* What a MapReduce program written in Java looks like.


**Prerequisites**:	
You have a Windows Azure Account and have enabled the HDInsight Service for your subscription. You have installed Windows Azure PowerShell and the Powershell tools for Windows Azure HDInsight, and have configured them for use with your account. For instructions on how to do this, see [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)

**Outline**		
This topic shows you how to run the series of MapReduce programs that make up the Sample, presents the Java code for the MapReduce program, summarizes what you have learned, and outlines some next steps. It has the following sections.
	
1. [Run the Sample with Windows Azure PowerShell](#run-sample)	
2. [The Java Code for the Pi Estimator MapReduce Program](#java-code)
3. [Summary](#summary)	
4. [Next Steps](#next-steps)	

<h2><a id="run-sample"></a>Run the Sample with Windows Azure PowerShell</h2>

Three tasks are required by the sample, each corresponding to one of the MapReduce programs decribed in the introduction:	

1. Generate the data for sorting by running the **TeraGen** MapReduce job.	
2. Sort the data by running the **TeraSort** MapReduce job.		
3. Confirm that the data has been correctly sorted by running the **TeraValidate** MapReduce job.	

TBD: Information on runing the three progams (from the portal: update for PS)

**The command for running the Teragen program**		
 hadoop jar hadoop-examples.jar teragen "-Dmapred.map.tasks=50" 100000000 /example/data/10GB-sort-input

**The parameters for the TeraGen job.**		
The first parameter (Parameter 0) value is *teragen*, the name of the job. The second parameter (Parameter 1) value is *"-Dmapred.map.tasks=50"*, which specifies that 50 maps will be created to execute the job. The third parameter (Parameter 2) value, *100000000*, specifies the amount of data to generate. The forth parameter (Parameter 3) value, */example/data/10GB-sort-input*, specifies the output directory to which it is saved (which contains the input for the following sort stage).

**The command for running the TeraSort program**			
Hadoop jar hadoop-examples-1.1.0-SNAPSHOT.jar terasort "-Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25" /example/data/10GB-sort-input /example/data/10GB-sort-output 

**The parameters for the TeraSort job**		
The first parameter (Parameter 0) value should be *terasort*, the name of this job. The second parameter (Parameter 1) value is *"-Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25"*, which specifies that 50 maps and 25 reduces will be created to execute the job. Set the third parameter (Parameter 2) value to */example/data/10GB-sort-input /example/data/10GB-sort-output* to specify the input directory from which data will be read and the output directory to which the results will be saved. The Final Command is automatically constructed for you from the specified parameters and jar file:

**The command for running the TeraValidate program**		 		
Hadoop jar hadoop-examples-1.1.0-SNAPSHOT.jar teravalidate "-Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25" /example/data/10GB-sort-output /example/data/10GB-sort-validate. 

**The parameters for the TeraValidate job**		
The first parameter (Parameter 0) value should be *teravalidate*, the name of this job. The second parameter (Parameter 1) value should be* "-Dmapred.map.tasks=50 -Dmapred.reduce.tasks=25"*, which specifies that 50 maps and 25 reduces will be created to execute the job. Set the third parameter (Parameter 2) value to */example/data/10GB-sort-output /example/data/10GB-sort-validate* to specify the input directory from which data will be read and the output directory to which the results will be saved.


TBD The following Instructions need editing for this sample.

1. Open Notepad.
2. Copy and paste the following code into Notepad.

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
 
TBD: Debug script, add the above screenshot, and add instructuibs on how to get the result.


<h2><a id="java-code"></a>The Java Code for the TerraSort MapReduce Program</h2>

The code for the TerraSort MapReduce program is presented for inspection in this section. The Java code for this and the other MapReduce programs used in this sample can be downloaded from the HDInsight cluster. Source is provided via org.apache.hadoop.examples.terasort.zip file. (TBD instuctions)

<code> 
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

</code>  

<h2><a id="summary"></a>Summary</h2>

This sample has demonstrated how to run a series of MapReduce jobs using Windows Azure HDInsight, where the data output for one job becomes the input for the next job in the series.

<h2><a id="next-steps"></a>Next Steps</h2>

For tutorials runnng other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Windows Azure HDInsight with Windows Azure PowerShell, see the following topics:

* [Sample: Pi Estimator][pi-estimator]

* [Sample: Wordcount][wordcount]

* [Sample: C# Steaming][cs-streaming]

* [Sample: Scoop Import/Export][scoop]

* [Tutorial: Using Pig][pig]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using MapReduce][mapreduce]


[getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[pi-estimator]: /en-us/manage/services/hdinsight/sample-pi-estimator/
[wordcount]: /en-us/manage/services/hdinsight/sample-wordcount/
[cs-streaming]: /en-us/manage/services/hdinsight/sample-csharp-streaming/
[scoop]: /en-us/manage/services/hdinsight/sample-sqoop-import-export/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/

[Image1]: media/imageName.png

