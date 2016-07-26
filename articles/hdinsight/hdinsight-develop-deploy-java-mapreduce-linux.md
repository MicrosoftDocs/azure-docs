<properties
	pageTitle="Develop Java MapReduce programs for Linux-based HDInsight | Microsoft Azure"
	description="Learn how to develop Java MapReduce programs and deploy them to Linux-based HDInsight."
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	authors="Blackmist"
	documentationCenter=""
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="larryfr"/>

# Develop Java MapReduce programs for Hadoop on HDInsight Linux

This documents walks you through using Apache Maven to create a MapReduce application, then deploy and run it on a Linux-based Hadoop on HDInsight cluster.

##<a name="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/) 7 or later (or an equivalent, such as OpenJDK)

- [Apache Maven](http://maven.apache.org/)

- **An Azure subscription**

- **Azure CLI**

	[AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)]

##Configure environment variables

The following environment variables may be set when you install Java and the JDK. However, you should check that they exist and that they contain the correct values for your system.

* **JAVA_HOME** - should point to the directory where the Java runtime environment (JRE) is installed. For example, in a OS X, Unix or Linux system, it should have a value similar to `/usr/lib/jvm/java-7-oracle`. In Windows, it would have a value similar to `c:\Program Files (x86)\Java\jre1.7`

* **PATH** - should contain the following paths:

	* **JAVA_HOME** (or the equivalent path)

	* **JAVA_HOME\bin** (or the equivalent path)

	* The directory where Maven is installed

##Create a new Maven project

1. From a terminal session, or command line in your development environment, change directories to the location you want to store this project.

3. Use the __mvn__ command, which is installed with Maven, to generate the scaffolding for the project.

		mvn archetype:generate -DgroupId=org.apache.hadoop.examples -DartifactId=wordcountjava -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

	This will create a new directory in the current directory, with the name specified by the __artifactID__ parameter (**wordcountjava** in this example.) This directory will contain the following items:

	* __pom.xml__ - The [Project Object Model (POM)](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html) that contains information and configuration details used to build the project.

	* __src__ - The directory that contains the __main/java/org/apache/hadoop/examples__ directory, where you will author the application.

3. Delete the __src/test/java/org/apache/hadoop/examples/apptest.java__ file, as it will not be used in this example.

##Add dependencies

1. Edit the __pom.xml__ file and add the following inside the `<dependencies>` section:

		<dependency>
		  <groupId>org.apache.hadoop</groupId>
	      <artifactId>hadoop-mapreduce-examples</artifactId>
	      <version>2.5.1</version>
		  <scope>provided</scope>
	    </dependency>
		<dependency>
	  	  <groupId>org.apache.hadoop</groupId>
	  	  <artifactId>hadoop-mapreduce-client-common</artifactId>
	  	  <version>2.5.1</version>
		  <scope>provided</scope>
		</dependency>
		<dependency>
	  	  <groupId>org.apache.hadoop</groupId>
	  	  <artifactId>hadoop-common</artifactId>
	  	  <version>2.5.1</version>
		  <scope>provided</scope>
		</dependency>

	This tells Maven that the project requires the libraries (listed within &lt;artifactId\>) with a specific version (listed within &lt;version\>). At compile time, this will be downloaded from the default Maven repository. You can use the [Maven repository search](http://search.maven.org/#artifactdetails%7Corg.apache.hadoop%7Chadoop-mapreduce-examples%7C2.5.1%7Cjar) to view more.

	The `<scope>provided</scope>` tells Maven that these dependencies should not be packaged with the application, as they will be provided by the HDInsight cluster at run-time.

2. Add the following to the __pom.xml__ file. This must be inside the `<project>...</project>` tags in the file; for example, between `</dependencies>` and `</project>`.

		<build>
  		  <plugins>
    		<plugin>
      		  <groupId>org.apache.maven.plugins</groupId>
      		  <artifactId>maven-shade-plugin</artifactId>
      		  <version>2.3</version>
      		  <configuration>
        		<transformers>
          		  <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
		          </transformer>
        		</transformers>
      		  </configuration>
      		  <executions>
        		<execution>
          		  <phase>package</phase>
          			<goals>
            		  <goal>shade</goal>
          			</goals>
        	    </execution>
      		  </executions>
      	    </plugin>
			<plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-compiler-plugin</artifactId>
              <configuration>
               <source>1.7</source>
               <target>1.7</target>
              </configuration>
            </plugin>
  		  </plugins>
	    </build>

	The first plugin configures the [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/), which is used to build an uberjar (sometimes called a fatjar), which contains dependencies required by the application. It also prevents duplication of licenses within the jar package, which can cause problems on some systems.

	The second plugin configures the Maven compiler, which is used to set the version of Java required by this application to the version used on the HDInsight cluster.

3. Save the __pom.xml__ file.

##Create the MapReduce application

1. Go to the __wordcountjava/src/main/java/org/apache/hadoop/examples__ directory and rename the __App.java__  file to __WordCount.java__.

2. Open the __WordCount.java__ file in a text editor and replace the contents with the following:

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

	Notice the package name is **org.apache.hadoop.examples** and the class name is **WordCount**. You will use these names when you submit the MapReduce job.

3. Save the file.

##Build the application

1. Change to the __wordcountjava__ directory, if you are not already there.

2. Use the following command to build a JAR file containing the application:

		mvn clean package

	This will clean any previous build artifacts, download any dependencies that have not already been installed, and then build and package the application.

3. Once the command finishes, the __wordcountjava/target__ directory will contain a file named __wordcountjava-1.0-SNAPSHOT.jar__.

	> [AZURE.NOTE] The __wordcountjava-1.0-SNAPSHOT.jar__ file is an uberjar, which contains not only the WordCount job, but also dependencies that the job requires at runtime.


##<a id="upload"></a>Upload the jar

Use the following command to upload the jar file to the HDInsight headnode:

	scp wordcountjava-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:

	Replace __USERNAME__ with your SSH user name for the cluster. Replace __CLUSTERNAME__ with the HDInsight cluster name.

This copies the files from the local system to the head node.

> [AZURE.NOTE] If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key. For example, `scp -i /path/to/private/key wordcountjava-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:`.

##<a name="run"></a>Run the MapReduce job

1. Connect to HDInsight using SSH as described in the following articles:

    - [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

    - [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. From the SSH session, use the following command to run the MapReduce application:

		yarn jar wordcountjava.jar org.apache.hadoop.examples.WordCount wasbs:///example/data/gutenberg/davinci.txt wasbs:///example/data/wordcountout

	This will use the WordCount MapReduce application to count the words in the davinci.txt file, and store the results to __wasbs:///example/data/wordcountout__. Both the input file and output are stored to the default storage for the cluster.

3. Once the job completes, use the following to view the results:

		hdfs dfs -cat wasbs:///example/data/wordcountout/*

	You should receive a list of words and counts, with values similar to the following:

		zeal    1
		zelus   1
		zenith  2

##<a id="nextsteps"></a>Next steps

In this document, you have learned how to develop a Java MapReduce job. See the following documents for other ways to work with HDInsight.

- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

For more information, see also the [Java Developer Center](https://azure.microsoft.com/develop/java/).

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-ODBC]: hdinsight-connect-excel-hive-ODBC-driver.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md

[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md

[powershell-PSCredential]: http://social.technet.microsoft.com/wiki/contents/articles/4546.working-with-passwords-secure-strings-and-credentials-in-windows-powershell.aspx

