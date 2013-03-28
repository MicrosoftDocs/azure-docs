<properties linkid="manage-services-hdinsight-using-mapreduce" urlDisplayName="Using MapReduce" pageTitle="Using MapReduce with HDInsight - Windows Azure tutorial" metaKeywords="using mapreduce, mapreduce hdinsight, mapreduce azure" metaDescription="Learn how to use MapReduce with HDInsight" metaCanonical="" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# Using MapReduce with HDInsight#

In this tutorial, you will execute a Hadoop MapReduce job to process a semi-structured Apache *log4j* log file on a Windows Azure HDInsight cluster. [Apache Log4j](http://en.wikipedia.org/wiki/Log4j) is a Java-based logging utility. Each log inside a file contains a log level field to show the log level type and the severity. This MapReduce job takes a log4j log file as input, and generates an output file that contains the log level along with its frequency count. 

**Estimated time to complete:** 30 minutes

## In this Article
* Big Data and Hadoop MapReduce
* Procedures
* Next Steps

## Big Data and Hadoop MapReduce
Generally, all applications save errors, exceptions and other coded issues in a log file. These log files can get quite large in size, containing a wealth of data that must be processed and mined. Log files are a good example of big data. Working with big data is difficult using relational databases with statistics and visualization packages. Due to the large amounts of data and the computation of this data, parallel software running on tens, hundreds, or even thousands of servers is often required to compute this data in a reasonable time. Hadoop provides a MapReduce framework for writing applications that process large amounts of structured and semi-structured data in parallel across large clusters of machines in a very reliable and fault-tolerant manner.

The following figure is the visual representation of what you will accomplish in this tutorial:

![HDI.VisualObjective](../media/HDI.VisualObject.gif "Visual Objective")


The input data consists of a semi-structured log4j file:


	2012-02-03 20:26:41 SampleClass3 [TRACE] verbose detail for id 1527353937
	java.lang.Exception: 2012-02-03 20:26:41 SampleClass9 [ERROR] incorrect format for id 324411615
            at com.osa.mocklogger.MockLogger#2.run(MockLogger.java:83)
	2012-02-03 20:26:41 SampleClass2 [TRACE] verbose detail for id 191364434
	2012-02-03 20:26:41 SampleClass1 [DEBUG] detail for id 903114158
	2012-02-03 20:26:41 SampleClass8 [TRACE] verbose detail for id 1331132178
	2012-02-03 20:26:41 SampleClass8 [INFO] everything normal for id 1490351510
	2012-02-03 20:32:47 SampleClass8 [TRACE] verbose detail for id 1700820764
	2012-02-03 20:32:47 SampleClass2 [DEBUG] detail for id 364472047
	2012-02-03 20:32:47 SampleClass7 [TRACE] verbose detail for id 1006511432
	2012-02-03 20:32:47 SampleClass4 [TRACE] verbose detail for id 1252673849
	2012-02-03 20:32:47 SampleClass0 [DEBUG] detail for id 881008264
	2012-02-03 20:32:47 SampleClass0 [TRACE] verbose detail for id 1104034268
	2012-02-03 20:32:47 SampleClass6 [TRACE] verbose detail for id 1527612691
	java.lang.Exception: 2012-02-03 20:32:47 SampleClass7 [WARN] problem finding id 484546105
            at com.osa.mocklogger.MockLogger#2.run(MockLogger.java:83)
	2012-02-03 20:32:47 SampleClass0 [DEBUG] detail for id 2521054
	2012-02-03 21:05:21 SampleClass6 [FATAL] system problem at id 1620503499

In the square brackets are the log levels. For example *[DEBUG]*, *[FATAL]*. 
 
The output data will be put into a file showing the various log4j log levels along with its frequency occurrence:

	[TRACE] 8
	[DEBUG] 4
	[INFO]  1
	[WARN]  1
	[ERROR] 1
	[FATAL] 1

## Procedures 
You will complete the following tasks in this tutorial:

1. Connect to an HDInsight Cluster
2. Import data into HDFS
3. Create a MapReduce job
4. Run the MapReduce job
5. Tutorial Clean Up
 

### Connect to an HDInsight Cluster
You must have an HDInsight cluster previsioned before you can work on this tutorial. For information on prevision an HDInsight cluster see [How to Administer HDInsight Service](/en-us/manage/services/hdinsight/howto-administer-hdinsight/) or [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/).

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT** on the left. You shall see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to and run the MapReduce job.
4. Click **Connect** on the bottom to connect to the remote desktop.
5. Click **Open**.
6. Click **Connect**.
7. Click **Yes**.
8. Enter your credentials, and then press **ENTER**.
9. From Desktop, click **Hadoop Command Line**. You will use Hadoop command prompt to execute all of the commands in this tutorial. Most of the commands can be run from the [Interactive JavaScript Console](/en-us/manage/services/hdinsight/interactive-javascript-and-hive-consoles/).

### Import data into HDFS

MapReduce job can read data from either *Hadoop Distributed File system (HDFS)* or *Windows Azure Blob Storage*. For more information, see [How to: Upload data to HDInsight](/en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/). In this task, you will place the log file data into HDFS where MapReduce will read it and run the job. 

1. From Hadoop command prompt, run the following commands to create a directory on the C drive:

		c:	
		cd \ 
		mkdir Tutorials

2. Run the following commands to create log file in the C:\Tutorials folder:

		cd \Tutorials
		notepad sample.log
 
	You can also download the [sample.log](http://go.microsoft.com/fwlink/?LinkID=286223 "Sample.log") file and put it into the C:\Tutorials folder.

3. Click **Yes** to create a new file.
4. Copy and Paste the input data shown earlier in the article into Notepad.
5. Press **CTRL+S** to save the file, and then close Notepad.

5. From Hadoop command prompt, create an input directory in HDFS:

		hadoop fs -mkdir Tutorials/input/
 
6. Verify that the input directory has been created in the Hadoop file system:

		hadoop fs -ls Tutorials/

	![](../media/HDI-MR3.png)
 
3. Load the sample.log input file into HDFS, and create the input directory:

		hadoop fs -put sample.log Tutorials/input/

4. Verify that the sample.log has been loaded into HDFS:

		hadoop fs -ls Tutorials/input/

	![](../media/HDI-MR4.png)

### Create the MapReduce job ##
The Java programming language is used in this sample. Hadoop Streaming allows developers to use virtually any programming language to create MapReduces jobs.  For a Hadoop Streaming sample using C#, see [Hadoop on Windows Azure - Working With Data](/en-us/develop/net/tutorials/hadoop-and-data/).

1. From Hadoop command prompt, run the following commands to change directory to the C:\Tutorials folder:

	c: [ENTER]
	cd \Tutorials [ENTER]

2. run the following command to create a java file in the C:\Tutorials folder:

	notepad log4jMapReduce.java [ENTER]

	Note: the class name is hard-coded in the program. If you want to change the file name,  you must update the java program accordingly.

4. Click **Yes** to create a new file.

5. Copy and paste the following java program into the Notepad window.

		import java.io.IOException;
		import java.util.Iterator;
		import java.util.regex.Matcher;
		import java.util.regex.Pattern;
	
		import org.apache.hadoop.fs.Path;
		import org.apache.hadoop.io.IntWritable;
		import org.apache.hadoop.io.LongWritable;
		import org.apache.hadoop.io.Text;
		import org.apache.hadoop.mapred.FileInputFormat;
		import org.apache.hadoop.mapred.FileOutputFormat;
		import org.apache.hadoop.mapred.JobClient;
		import org.apache.hadoop.mapred.JobConf;
		import org.apache.hadoop.mapred.MapReduceBase;
		import org.apache.hadoop.mapred.Mapper;
		import org.apache.hadoop.mapred.OutputCollector;
		import org.apache.hadoop.mapred.Reducer;
		import org.apache.hadoop.mapred.Reporter;
		import org.apache.hadoop.mapred.TextInputFormat;
		import org.apache.hadoop.mapred.TextOutputFormat;
	
		public class log4jMapReduce
		{
	
			//The Mapper
	      	public static class Map extends MapReduceBase implements Mapper<LongWritable, Text, Text, IntWritable>
	      	{     
		        private static final Pattern pattern = Pattern.compile("(TRACE)|(DEBUG)|(INFO)|(WARN)|(ERROR)|(FATAL)"); 
	        	private static final IntWritable accumulator = new IntWritable(1); 
	        	private Text logLevel = new Text();
	
	        	public void map(LongWritable key, Text value, OutputCollector<Text, IntWritable> collector, Reporter reporter) throws IOException 
				{
		     		// split on space, '[', and ']'
		        	final String[] tokens = value.toString().split("[ \\[\\]]"); 
		
		        	if(tokens != null)
		        	{
			            //now find the log level token
		            	for(final String token : tokens) 
		            	{
			                final Matcher matcher = pattern.matcher(token);
		                	//log level found
		                	if(matcher.matches()) 
		                	{
			                    logLevel.set(token);
								//Create the key value pairs
								collector.collect(logLevel, accumulator);
		                	}                                                           
		            	}
		        	}                       
	        	}
	      	}
	 
	  		//The Reducer
	    	public static class Reduce extends MapReduceBase implements Reducer<Text, IntWritable, Text, IntWritable>
	    	{
			    public void reduce(Text key, Iterator<IntWritable> values, OutputCollector<Text, IntWritable> collector,Reporter reporter) throws IOException
		    	{
			        int count = 0;
					//code to aggregate the occurrence
		        	while(values.hasNext())
		        	{
		                    	count += values.next().get();
		        	}
			
		        	System.out.println(key +  "\t" + count);
		        	collector.collect(key, new IntWritable(count));
		    	}
	   		}
	
			//The java main method to execute the MapReduce job
			public static void main(String[] args) throws Exception
			{
				//Code to create a new Job specifying the MapReduce class
		    	final JobConf conf = new JobConf(log4JMapReduce.class);
		    	conf.setOutputKeyClass(Text.class);
		    	conf.setOutputValueClass(IntWritable.class);
		    	conf.setMapperClass(Map.class);
		
				// Combiner is commented out – to be used in bonus activity
		
			    //conf.setCombinerClass(Reduce.class);
		    	conf.setReducerClass(Reduce.class);
		    	conf.setInputFormat(TextInputFormat.class);
		    	conf.setOutputFormat(TextOutputFormat.class);
		
				//File Input argument passed as a command line argument
		    	FileInputFormat.setInputPaths(conf, new Path(args[0]));
		
				//File Output argument passed as a command line argument
			    FileOutputFormat.setOutputPath(conf, new Path(args[1]));
		
				//statement to execute the job 
			    JobClient.runJob(conf);
			}
		}

6. Press **CTRL+S** to save the file.

7. Compile the java file using the following command:

		C:\apps\dist\java\bin\javac -classpath C:\apps\dist\hadoop-1.1.0-SNAPSHOT\hadoop-core-*.jar log4jMapReduce.java
 
	Make sure there is no compilation errors.

6. Create a log4jMapReduce.jar file containing the Hadoop class files:

		C:\apps\dist\java\bin\jar -cvf log4jMapReduce.jar *.class
 
Notice the results before and after executing the jar command, including verifying the existence of the sample.log file in the non-HDFS directory structure (used later).

![](../media/HDI-MR1.png)

![](../media/HDI-MR2.png)




### Run the MapReduce job
Until now, you have uploaded a log4j log files to HDFS, and compiled the MapReduce job.  The next step is to run the job.

1. From Hadoop command prompt, execute the following command to run the Hadoop MapReduce job:

		hadoop jar log4jMapReduce.jar log4jMapReduce Tutorials/input/sample.log Tutorials/output

	This command does a number of things: 
	
	- Calling the Hadoop program
	- Specifying the jar file (log4jMapReduce.jar)
	- Indicating the class file (log4jMapReduce)
	- Specifying the input file (Tutorials/input/sample.log), and output directory (Tutorials/output) 
	- Running the MapReduce job 
 
	The Reduce programs begin to process the data when the Map programs are 100% complete. Prior to that, the Reducer(s) queries the Mappers for intermediate data and gathers the data, but waits to process. This is shown in the following screenshot. 
	
	![](../media/HDI-MR5.png)
	
	The next screen output shows Reduce input records (that correspond to the six log levels) and Map output records (that contain key value pairs). As you can see, the Reduce program condensed the set of intermediate values that share the same key (DEBUG, ERROR, FATAL, and so on) to a smaller set of values.    
	
	![](../media/HDI-MR6.png)

2. View the output of the MapReduce job in HDFS:

		hadoop fs -cat Tutorials/output/part-00000
 
	**Note:** By default, Hadoop creates files begin with the following naming convention: “part-00000”. Additional files created by the same job will have the number increased.

	After executing the command, you should see the following output:
	
	![](../media/HDI-MR7.png)
	
	Notice that after running MapReduce that the data types are now totaled and in a structured format.  

### Tutorial Clean Up ##

The clean up task applies to this tutorial only; it is not performed in the actual deployment. In this task, you will delete input and output directories so that if you like, you can run the tutorial again.  

1. Delete the input directory and recursively delete files within the directory:

		hadoop fs -rmr Tutorials/input/
 
2. Delete the output directory and recursively delete files within the directory:

		hadoop fs –rmr Tutorials/output/
 
Congratulations! You have successfully completed this tutorial.

##Next Steps

While MapReduce provides powerful diagnostic abilities, it can be a bit challenging to master. Other languages such as Pig and Hive provide an easier way to work with data stored in your HDInsight Service. To learn more, see the following articles:

* [Using Pig with HDInsight][hdinsight-pig] 

* [Using Hive with HDInsight][hdinsight-hive]

[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[hdinsight-hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/