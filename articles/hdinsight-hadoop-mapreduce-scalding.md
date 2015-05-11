<properties
 pageTitle="Develop Scalding MapReduce jobs with Maven | Microsoft Azure"
 description="Learn how to use Maven to create a Scalding MapReduce job, then deploy and run the job on a Hadoop on HDInsight cluster."
 services="hdinsight"
 documentationCenter=""
 authors="Blackmist"
 manager="paulettm"
 editor="cgronlun"/>
<tags
 ms.service="hdinsight"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="big-data"
 ms.date="04/17/2015"
 ms.author="larryfr"/>

# Develop Scalding MapReduce jobs with Apache Hadoop on HDInsight

Scalding is a Scala library that makes it easy to create Hadoop MapReduce jobs. It offers a concise syntax, as well as tight integration with Scala.

In this document, learn how to use Maven to create a basic word count MapReduce job written in Scalding. You will then learn how to deploy and run this job on an HDInsight cluster.

## Prerequisites

* An Azure Subscription

* A Windows or Linux based Hadoop on HDInsight cluster - see [Provision Linux-based Hadoop on HDInsight](hdinsight-hadoop-provision-linux-clusters.md) or [Provision Windows-based Hadoop on HDInsight](hdinsight-provision-clusters.md) for more information.

* [Maven](http://maven.apache.org/)

* [Java platform JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 7 or later

## Create and build the project

1. Use the following command to create a new Maven project:

        mvn archetype:generate -DgroupId=com.microsoft.example -DartifactId=scaldingwordcount -DarchetypeGroupId=org.scala-tools.archetypes -DarchetypeArtifactId=scala-archetype-simple -DinteractiveMode=false

    This command will create a new directory named **scaldingwordcount**, and create the scaffolding for an Scala application.

2. In the **scaldingwordcount** directory, open the **pom.xml** file and replace the contents with the following:

        <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <modelVersion>4.0.0</modelVersion>
          <groupId>com.microsoft.example</groupId>
          <artifactId>scaldingwordcount</artifactId>
          <version>1.0-SNAPSHOT</version>
          <name>${project.artifactId}</name>
          <properties>
            <maven.compiler.source>1.6</maven.compiler.source>
            <maven.compiler.target>1.6</maven.compiler.target>
            <encoding>UTF-8</encoding>
          </properties>
          <repositories>
            <repository>
              <id>conjars</id>
              <url>http://conjars.org/repo</url>
            </repository>
            <repository>
              <id>maven-central</id>
              <url>http://repo1.maven.org/maven2</url>
            </repository>
          </repositories>
          <dependencies>
            <dependency>
              <groupId>com.twitter</groupId>
              <artifactId>scalding-core_2.11</artifactId>
              <version>0.13.1</version>
            </dependency>
            <dependency>
              <groupId>org.apache.hadoop</groupId>
              <artifactId>hadoop-core</artifactId>
              <version>1.2.1</version>
              <scope>provided</scope>
            </dependency>
          </dependencies>
          <build>
            <sourceDirectory>src/main/scala</sourceDirectory
            <plugins>
              <plugin>
                <groupId>org.scala-tools</groupId>
                <artifactId>maven-scala-plugin</artifactId>
                <version>2.15.2</version>
                <executions>
                  <execution>
                    <id>scala-compile-first</id>
                    <phase>process-resources</phase>
                    <goals>
                      <goal>add-source</goal>
                      <goal>compile</goal>
                    </goals>
                  </execution>
                </executions>
              </plugin>
              <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.3</version>
                <configuration>
                  <transformers>
                    <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
                    </transformer>
                  </transformers>
                  <filters>
                    <filter>
                      <artifact>*:*</artifact>
                      <excludes>
                        <exclude>META-INF/*.SF</exclude>
                        <exclude>META-INF/*.DSA</exclude>
                        <exclude>META-INF/*.RSA</exclude>y
                      </excludes>
                    </filter>
                  </filters>
                </configuration>
                <executions>
                  <execution>
                    <phase>package</phase>
                    <goals>
                      <goal>shade</goal>
                    </goals>
                    <configuration>
                      <transformers>
                        <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                          <mainClass>com.twitter.scalding.Tool</mainClass>
                        </transformer>
                      </transformers>
                    </configuration>
                  </execution>
                </executions>
              </plugin>
            </plugins>
          </build>
        </project>

    This file describes the project, dependencies, and plugins. Here are the important entries:

    * **maven.compiler.source** and **maven.compiler.target**: sets the Java version for this project

    * **repositories**: the repositories that contain the dependency files used by this project

    * **scalding-core_2.11** and **hadoop-core**: this project depends on both Scalding and Hadoop core packages

    * **maven-scala-plugin**: plugin to compile scala applications

    * **maven-shade-plugin**: plugin to create shaded (fat) jars. This plugin applies filters and transformations; specificially:

        * **filters**: The filters applied modify the meta information included with in the jar file. To prevent signing exceptions at runtime, this excludes various signature files that may be included with dependencies.

        * **executions**: The package phase execution configuration specifies the **com.twitter.scalding.Tool** class as the main class for the package. Without this, you would need to specify com.twitter.scalding.Tool, as well as the class that contains the application logic, when running the job with the hadoop command.

3. Delete the **src/test** directory, as you will not be creating tests with this example.

4. Open the **src/main/scala/com/microsoft/example/app.scala** file and replace the contents with the following:

        package com.microsoft.example

        import com.twitter.scalding._

        class WordCount(args : Args) extends Job(args) {
          // 1. Read lines from the specified input location
          // 2. Extract individual words from each line
          // 3. Group words and count them
          // 4. Write output to the specified output location
          TextLine(args("input"))
            .flatMap('line -> 'word) { line : String => tokenize(line) }
            .groupBy('word) { _.size }
            .write(Tsv(args("output")))

          //Tokenizer to split sentance into words
          def tokenize(text : String) : Array[String] = {
            text.toLowerCase.replaceAll("[^a-zA-Z0-9\\s]", "").split("\\s+")
          }
        }

    This implements a basic word count job.

5. Save and close the files.

6. Use the following command from the **scaldingwordcount** directory to build and package the application:

        mvn package

    Once this job completes, the package containing the WordCount application can be found at **target/scaldingwordcount-1.0-SNAPSHOT.jar**.

## Run the job on a Linux-based cluster

> [AZURE.NOTE] The following steps use SSH and the Hadoop command. For other methods of running MapReduce jobs, see [Use MapReduce in Hadoop on HDInsight](hdinsight-use-mapreduce.md).

1. Use the following command to upload the package to your HDInsight cluster:

        scp target/scaldingwordcount-1.0-SNAPSHOT.jar username@clustername-ssh.azurehdinsight.net:

    This copies the files from the local system to the head node.

    > [AZURE.NOTE] If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key. For example, `scp -i /path/to/private/key target/scaldingwordcount-1.0-SNAPSHOT.jar username@clustername-ssh.azurehdinsight.net:.`

2. Use the following command to connect to the cluster head node:

        ssh username@clustername-ssh.azurehdinsight.net

    > [AZURE.NOTE] If you used a password to secure your SSH account, you will be prompted for the password. If you used an SSH key, you may have to use the `-i` parameter and the path to the private key. For example, `ssh -i /path/to/private/key username@clustername-ssh.azurehdinsight.net`

3. Once connected to the head node, use the following command to run the word cound job

        hadoop jar scaldingwordcount-1.0-SNAPSHOT.jar com.microsoft.example.WordCount --hdfs --input wasb:///example/data/gutenberg/davinci.txt --output wasb:///example/wordcountout

    This runs the WordCount class you implemented earlier. `--hdfs` instructs the job to use HDFS. `--input` specifies the input text file, while `--output` specifies the output location.

4. After the job completes, use the following to view the output.

        hadoop fs -text wasb:///example/wordcountout/part-00000

    This will display information similar to the following:

        writers 9
        writes  18
        writhed 1
        writing 51
        writings        24
        written 208
        writtenthese    1
        wrong   11
        wrongly 2
        wrongplace      1
        wrote   34
        wrotefootnote   1
        wrought 7

## Run the job on a Windows-based cluster

> [AZURE.NOTE] The following steps use Windows PowerShell. For other methods of running MapReduce jobs, see [Use MapReduce in Hadoop on HDInsight](hdinsight-use-mapreduce.md).

1. [Install and configure Azure PowerShell](install-configure-powershell.md).

2. Download [hdinsight-tools.psm1](https://github.com/Blackmist/hdinsight-tools/blob/master/hdinsight-tools.psm1) and save to a file named **hdinsight-tools.psm1**.

3. Open a new **Azure PoweShell** session and enter the following command. If hdinsight-tools.psm1 isn't in the current directory, provide the path to the file:

        import-module hdinsight-tools.psm1

    This imports several functions for working with files in HDInsight.

4. Use the following commands to upload the jar file containing the WordCount job. Replace `CLUSTERNAME` with the name of your HDInsight cluster:

        $clusterName="CLUSTERNAME"
        Add-HDInsightFile -clusterName $clusterName -localPath \path\to\scaldingwordcount-1.0-SNAPSHOT.jar -destinationPath example/jars/scaldingwordcount-1.0-SNAPSHOT.jar

5. Once the upload has completed, use the following commands to run the job:

        $jobDef=New-AzureHDInsightMapReduceJobDefinition -JobName ScaldingWordCount -JarFile wasb:///example/jars/scaldingwordcount-1.0-SNAPSHOT.jar -ClassName com.microsoft.example.WordCount -arguments "--hdfs", "--input", "wasb:///example/data/gutenberg/davinci.txt", "--output", "wasb:///example/wordcountout"
        $job = start-azurehdinsightjob -cluster $clusterName -jobdefinition $jobDef
        wait-azurehdinsightjob -Job $job -waittimeoutinseconds 3600

6. Once the job completes, use the following to download the job output:

        Get-HDInsightFile -clusterName $clusterName -remotePath example/wordcountout/part-00000 -localPath output.txt

7. The output consists of tab delimited word and count values. use the following command to display the results.

        cat output.txt

    The file should contain values similar to the following:

        writers 9
        writes  18
        writhed 1
        writing 51
        writings        24
        written 208
        writtenthese    1
        wrong   11
        wrongly 2
        wrongplace      1
        wrote   34
        wrotefootnote   1
        wrought 7

7. If the output is empty, or the file doesn't exist, you can use the following to view any errors that occurred when running the job:

        Get-AzureHdinsightJobOutput -cluster $clusterName -jobId $job.JobId -standarderror

## Next steps

Now that you have learned how to use Scalding to create MapReduce jobs for HDInsight, use the following links to explore other ways to work with Azure HDInsight.

* [Use Hive with HDInsight](hdinsight-use-hive.md)

* [Use Pig with HDInsight](hdinsight-use-pig.md)

* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
