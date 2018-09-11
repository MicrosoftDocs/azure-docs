---
title: Create Java MapReduce for Hadoop - Azure HDInsight 
description: Learn how to use Apache Maven to create a Java-based MapReduce application, then run it with Hadoop on Azure HDInsight.
services: hdinsight
ms.reviewer: jasonh
author: jasonwhowell

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

---
# Develop Java MapReduce programs for Hadoop on HDInsight

Learn how to use Apache Maven to create a Java-based MapReduce application, then run it with Hadoop on Azure HDInsight.

> [!NOTE]
> This example was most recently tested on HDInsight 3.6.

## <a name="prerequisites"></a>Prerequisites

* [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/) 8 or later (or an equivalent, such as OpenJDK).
    
    > [!NOTE]
    > HDInsight versions 3.4 and earlier use Java 7. HDInsight 3.5 and greater uses Java 8.

* [Apache Maven](http://maven.apache.org/)

## Configure development environment

The following environment variables may be set when you install Java and the JDK. However, you should check that they exist and that they contain the correct values for your system.

* `JAVA_HOME` - should point to the directory where the Java runtime environment (JRE) is installed. For example, on an OS X, Unix or Linux system, it should have a value similar to `/usr/lib/jvm/java-7-oracle`. In Windows, it would have a value similar to `c:\Program Files (x86)\Java\jre1.7`

* `PATH` - should contain the following paths:
  
  * `JAVA_HOME` (or the equivalent path)

  * `JAVA_HOME\bin` (or the equivalent path)

  * The directory where Maven is installed

## Create a Maven project

1. From a terminal session, or command line in your development environment, change directories to the location you want to store this project.

2. Use the `mvn` command, which is installed with Maven, to generate the scaffolding for the project.

   ```bash
   mvn archetype:generate -DgroupId=org.apache.hadoop.examples -DartifactId=wordcountjava -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
   ```

    > [!NOTE]
    > If you are using PowerShell, you must enclose the `-D` parameters in double quotes.
    >
    > `mvn archetype:generate "-DgroupId=org.apache.hadoop.examples" "-DartifactId=wordcountjava" "-DarchetypeArtifactId=maven-archetype-quickstart" "-DinteractiveMode=false"`

    This command creates a directory with the name specified by the `artifactID` parameter (**wordcountjava** in this example.) This directory contains the following items:

   * `pom.xml` - The [Project Object Model (POM)](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html) that contains information and configuration details used to build the project.

   * `src` - The directory that contains the application.

3. Delete the `src/test/java/org/apache/hadoop/examples/apptest.java` file. It is not used in this example.

## Add dependencies

1. Edit the `pom.xml` file and add the following text inside the `<dependencies>` section:
   
   ```xml
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-mapreduce-examples</artifactId>
        <version>2.7.3</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-mapreduce-client-common</artifactId>
        <version>2.7.3</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.hadoop</groupId>
        <artifactId>hadoop-common</artifactId>
        <version>2.7.3</version>
        <scope>provided</scope>
    </dependency>
   ```

    This defines required libraries (listed within &lt;artifactId\>) with a specific version (listed within &lt;version\>). At compile time, these dependencies are downloaded from the default Maven repository. You can use the [Maven repository search](http://search.maven.org/#artifactdetails%7Corg.apache.hadoop%7Chadoop-mapreduce-examples%7C2.5.1%7Cjar) to view more.
   
    The `<scope>provided</scope>` tells Maven that these dependencies should not be packaged with the application, as they are provided by the HDInsight cluster at run-time.

    > [!IMPORTANT]
    > The version used should match the version of Hadoop present on your cluster. For more information on versions, see the [HDInsight component versioning](../hdinsight-component-versioning.md) document.

2. Add the following to the `pom.xml` file. This text must be inside the `<project>...</project>` tags in the file; for example, between `</dependencies>` and `</project>`.

   ```xml
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
            <version>3.6.1</version>
            <configuration>
            <source>1.8</source>
            <target>1.8</target>
            </configuration>
        </plugin>
        </plugins>
    </build>
   ```

    The first plugin configures the [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/), which is used to build an uberjar (sometimes called a fatjar), which contains dependencies required by the application. It also prevents duplication of licenses within the jar package, which can cause problems on some systems.

    The second plugin configures the target Java version.

    > [!NOTE]
    > HDInsight 3.4 and earlier use Java 7. HDInsight 3.5 and greater uses Java 8.

3. Save the `pom.xml` file.

## Create the MapReduce application

1. Go to the `wordcountjava/src/main/java/org/apache/hadoop/examples` directory and rename the `App.java` file to `WordCount.java`.

2. Open the `WordCount.java` file in a text editor and replace the contents with the following text:
   
    ```java
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
    ```
   
    Notice the package name is `org.apache.hadoop.examples` and the class name is `WordCount`. You use these names when you submit the MapReduce job.

3. Save the file.

## Build the application

1. Change to the `wordcountjava` directory, if you are not already there.

2. Use the following command to build a JAR file containing the application:

   ```
   mvn clean package
   ```

    This command cleans any previous build artifacts, downloads any dependencies that have not already been installed, and then builds and package the application.

3. Once the command finishes, the `wordcountjava/target` directory contains a file named `wordcountjava-1.0-SNAPSHOT.jar`.
   
   > [!NOTE]
   > The `wordcountjava-1.0-SNAPSHOT.jar` file is an uberjar, which contains not only the WordCount job, but also dependencies that the job requires at runtime.

## <a id="upload"></a>Upload the jar

Use the following command to upload the jar file to the HDInsight headnode:

   ```bash
   scp target/wordcountjava-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:
   ```

    Replace __USERNAME__ with your SSH user name for the cluster. Replace __CLUSTERNAME__ with the HDInsight cluster name.

This command copies the files from the local system to the head node. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## <a name="run"></a>Run the MapReduce job on Hadoop

1. Connect to HDInsight using SSH. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. From the SSH session, use the following command to run the MapReduce application:
   
   ```bash
   yarn jar wordcountjava-1.0-SNAPSHOT.jar org.apache.hadoop.examples.WordCount /example/data/gutenberg/davinci.txt /example/data/wordcountout
   ```
   
    This command starts the WordCount MapReduce application. The input file is `/example/data/gutenberg/davinci.txt`, and the output directory is `/example/data/wordcountout`. Both the input file and output are stored to the default storage for the cluster.

3. Once the job completes, use the following command to view the results:
   
   ```bash
   hdfs dfs -cat /example/data/wordcountout/*
   ```

    You should receive a list of words and counts, with values similar to the following text:
   
        zeal    1
        zelus   1
        zenith  2

## <a id="nextsteps"></a>Next steps

In this document, you have learned how to develop a Java MapReduce job. See the following documents for other ways to work with HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

For more information, see also the [Java Developer Center](https://azure.microsoft.com/develop/java/).

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-use-sqoop]:hdinsight-use-sqoop.md
[hdinsight-ODBC]: hdinsight-connect-excel-hive-ODBC-driver.md
[hdinsight-power-query]:apache-hadoop-connect-excel-power-query.md

[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-power-query]:apache-hadoop-connect-excel-power-query.md

[powershell-PSCredential]: http://social.technet.microsoft.com/wiki/contents/articles/4546.working-with-passwords-secure-strings-and-credentials-in-windows-powershell.aspx

