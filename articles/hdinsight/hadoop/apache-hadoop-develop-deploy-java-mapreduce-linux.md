---
title: Create Java MapReduce for Apache Hadoop - Azure HDInsight 
description: Learn how to use Apache Maven to create a Java-based MapReduce application, then run it with Hadoop on Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, hdiseo17may2017, devx-track-java, devx-track-extended-java
ms.date: 06/22/2023
---

# Develop Java MapReduce programs for Apache Hadoop on HDInsight

Learn how to use Apache Maven to create a Java-based MapReduce application, then run it with Apache Hadoop on Azure HDInsight.

## Prerequisites

* [Java Developer Kit (JDK) version 8](/azure/developer/java/fundamentals/java-support-on-azure).

* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.

## Configure development environment

The environment used for this article was a computer running Windows 10. The commands were executed in a command prompt, and the various files were edited with Notepad. Modify accordingly for your environment.

From a command prompt, enter the commands below to create a working environment:

```cmd
IF NOT EXIST C:\HDI MKDIR C:\HDI
cd C:\HDI
```

## Create a Maven project

1. Enter the following command to create a Maven project named **wordcountjava**:

   ```bash
   mvn archetype:generate -DgroupId=org.apache.hadoop.examples -DartifactId=wordcountjava -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
   ```

    This command creates a directory with the name specified by the `artifactID` parameter (**wordcountjava** in this example.) This directory contains the following items:

    * `pom.xml` - The [Project Object Model (POM)](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html) that contains information and configuration details used to build the project.
    * src\main\java\org\apache\hadoop\examples: Contains your application code.
    * src\test\java\org\apache\hadoop\examples: Contains tests for your application.

1. Remove the generated example code. Delete the generated test and application files `AppTest.java`, and `App.java` by entering the commands below:

    ```cmd
    cd wordcountjava
    DEL src\main\java\org\apache\hadoop\examples\App.java
    DEL src\test\java\org\apache\hadoop\examples\AppTest.java
    ```

## Update the Project Object Model

For a full reference of the pom.xml file, see https://maven.apache.org/pom.html. Open `pom.xml` by entering the command below:

```cmd
notepad pom.xml
```

### Add dependencies

In `pom.xml`, add the following text in the `<dependencies>` section:

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

This defines required libraries (listed within &lt;artifactId\>) with a specific version (listed within &lt;version\>). At compile time, these dependencies are downloaded from the default Maven repository. You can use the [Maven repository search](https://search.maven.org/#artifactdetails%7Corg.apache.hadoop%7Chadoop-mapreduce-examples%7C2.5.1%7Cjar) to view more.

The `<scope>provided</scope>` tells Maven that these dependencies should not be packaged with the application, as they are provided by the HDInsight cluster at run-time.

> [!IMPORTANT]
> The version used should match the version of Hadoop present on your cluster. For more information on versions, see the [HDInsight component versioning](../hdinsight-component-versioning.md) document.

### Build configuration

Maven plug-ins allow you to customize the build stages of the project. This section is used to add plug-ins, resources, and other build configuration options.

Add the following code to the `pom.xml` file, and then save and close the file. This text must be inside the `<project>...</project>` tags in the file, for example, between `</dependencies>` and `</project>`.

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

This section  configures the Apache Maven Compiler Plugin and Apache Maven Shade Plugin. The compiler plug-in is used to compile the topology. The shade plug-in is used to prevent license duplication in the JAR package that is built by Maven. This plugin is used to prevent a "duplicate license files" error at run time on the HDInsight cluster. Using maven-shade-plugin with the `ApacheLicenseResourceTransformer` implementation prevents the error.

The maven-shade-plugin also produces an uber jar that contains all the dependencies required by the application.

Save the `pom.xml` file.

## Create the MapReduce application

1. Enter the command below to create and open a new file `WordCount.java`. Select **Yes** at the prompt to create a new file.

    ```cmd
    notepad src\main\java\org\apache\hadoop\examples\WordCount.java
    ```

2. Then copy and paste the Java code below into the new file. Then close the file.

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

## Build and package the application

From the `wordcountjava` directory, use the following command to build a JAR file that contains the application:

```cmd
mvn clean package
```

This command cleans any previous build artifacts, downloads any dependencies that have not already been installed, and then builds and package the application.

Once the command finishes, the `wordcountjava/target` directory contains a file named `wordcountjava-1.0-SNAPSHOT.jar`.

> [!NOTE]
> The `wordcountjava-1.0-SNAPSHOT.jar` file is an uberjar, which contains not only the WordCount job, but also dependencies that the job requires at runtime.

## Upload the JAR and run jobs (SSH)

The following steps use `scp` to copy the JAR to the primary head node of your Apache HBase on HDInsight cluster. The `ssh` command is then used to connect to the cluster and run the example directly on the head node.

1. Upload the jar to the cluster. Replace `CLUSTERNAME` with your HDInsight cluster name and then enter the following command:

    ```cmd
    scp target/wordcountjava-1.0-SNAPSHOT.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:
    ```

1. Connect to the cluster. Replace `CLUSTERNAME` with your HDInsight cluster name and then enter the following command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From the SSH session, use the following command to run the MapReduce application:

   ```bash
   yarn jar wordcountjava-1.0-SNAPSHOT.jar org.apache.hadoop.examples.WordCount /example/data/gutenberg/davinci.txt /example/data/wordcountout
   ```

    This command starts the WordCount MapReduce application. The input file is `/example/data/gutenberg/davinci.txt`, and the output directory is `/example/data/wordcountout`. Both the input file and output are stored to the default storage for the cluster.

1. Once the job completes, use the following command to view the results:

   ```bash
   hdfs dfs -cat /example/data/wordcountout/*
   ```

    You should receive a list of words and counts, with values similar to the following text:

    ```output
    zeal    1
    zelus   1
    zenith  2
    ```

## Next steps

In this document, you have learned how to develop a Java MapReduce job. See the following documents for other ways to work with HDInsight.

* [Use Apache Hive with HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)
* [Java Developer Center](https://azure.microsoft.com/develop/java/)
