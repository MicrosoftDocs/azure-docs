---
title: Apache Storm example Java topology - Azure HDInsight 
description: Learn how to create Apache Storm topologies in Java by creating an example word count topology.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: H1Hack27Feb2017,hdinsightactive,hdiseo17may2017,seoapr2020
ms.date: 04/27/2020
---

# Create an Apache Storm topology in Java

Learn how to create a Java-based topology for Apache Storm. You create a Storm topology that implements a word-count application. You use Apache Maven to build and package the project. Then, you learn how to define the topology using the Apache Storm Flux framework.

After completing the steps in this document, you can deploy the topology to Apache Storm on HDInsight.

> [!NOTE]  
> A completed version of the Storm topology examples created in this document is available at [https://github.com/Azure-Samples/hdinsight-java-storm-wordcount](https://github.com/Azure-Samples/hdinsight-java-storm-wordcount).

## Prerequisites

* [Java Developer Kit (JDK) version 8](https://aka.ms/azure-jdks)

* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.

## Test environment

The environment used for this article was a computer running Windows 10.  The commands were executed in a command prompt, and the various files were edited with Notepad.

From a command prompt, enter the commands below to create a working environment:

```cmd
mkdir C:\HDI
cd C:\HDI
```

## Create a Maven project

Enter the following command to create a Maven project named **WordCount**:

```cmd
mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.example -DartifactId=WordCount -DinteractiveMode=false

cd WordCount
mkdir resources
```

This command creates a directory named `WordCount` at the current location, which contains a basic Maven project. The second command changes the present working directory to `WordCount`. The third command creates a new directory, `resources`, which will be used later.  The `WordCount` directory contains the following items:

* `pom.xml`: Contains settings for the Maven project.
* `src\main\java\com\microsoft\example`: Contains your application code.
* `src\test\java\com\microsoft\example`: Contains tests for your application.  

### Remove the generated example code

Delete the generated test and application files `AppTest.java`, and `App.java` by entering the commands below:

```cmd
DEL src\main\java\com\microsoft\example\App.java
DEL src\test\java\com\microsoft\example\AppTest.java
```

## Add Maven repositories

HDInsight is based on the Hortonworks Data Platform (HDP), so we recommend using the Hortonworks repository to download dependencies for your Apache Storm projects.  

Open `pom.xml` by entering the command below:

```cmd
notepad pom.xml
```

Then add the following XML after the `<url>https://maven.apache.org</url>` line:

```xml
<repositories>
    <repository>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
        </releases>
        <snapshots>
            <enabled>false</enabled>
            <updatePolicy>never</updatePolicy>
            <checksumPolicy>fail</checksumPolicy>
        </snapshots>
        <id>HDPReleases</id>
        <name>HDP Releases</name>
        <url>https://repo.hortonworks.com/content/repositories/releases/</url>
        <layout>default</layout>
    </repository>
    <repository>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
        </releases>
        <snapshots>
            <enabled>false</enabled>
            <updatePolicy>never</updatePolicy>
            <checksumPolicy>fail</checksumPolicy>
        </snapshots>
        <id>HDPJetty</id>
        <name>Hadoop Jetty</name>
        <url>https://repo.hortonworks.com/content/repositories/jetty-hadoop/</url>
        <layout>default</layout>
    </repository>
</repositories>
```

## Add properties

Maven allows you to define project-level values called properties. In `pom.xml`, add the following text after the `</repositories>` line:

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <!--
    This is a version of Storm from the Hortonworks repository that is compatible with HDInsight 3.6.
    -->
    <storm.version>1.1.0.2.6.1.9-1</storm.version>
</properties>
```

You can now use this value in other sections of the `pom.xml`. For example, when specifying the version of Storm components, you can use `${storm.version}` instead of hard coding a value.

## Add dependencies

Add a dependency for Storm components. In `pom.xml`, add the following text in the `<dependencies>` section:

```xml
<dependency>
    <groupId>org.apache.storm</groupId>
    <artifactId>storm-core</artifactId>
    <version>${storm.version}</version>
    <!-- keep storm out of the jar-with-dependencies -->
    <scope>provided</scope>
</dependency>
```

At compile time, Maven uses this information to look up `storm-core` in the Maven repository. It first looks in the repository on your local computer. If the files aren't there, Maven downloads them from the public Maven repository and stores them in the local repository.

> [!NOTE]  
> Notice the `<scope>provided</scope>` line in this section. This setting tells Maven to exclude **storm-core** from any JAR files that are created, because it is provided by the system.

## Build configuration

Maven plug-ins allow you to customize the build stages of the project. For example, how the project is compiled or how to package it into a JAR file. In `pom.xml`, add the following text directly above the `</project>` line.

```xml
<build>
    <plugins>
    </plugins>
    <resources>
    </resources>
</build>
```

This section is used to add plug-ins, resources, and other build configuration options. For a full reference of the `pom.xml` file, see [https://maven.apache.org/pom.html](https://maven.apache.org/pom.html).

### Add plug-ins

* **Exec Maven Plugin**

    For Apache Storm topologies implemented in Java, the [Exec Maven Plugin](https://www.mojohaus.org/exec-maven-plugin/) is useful because it allows you to easily run the topology locally in your development environment. Add the following to the `<plugins>` section of the `pom.xml` file to include the Exec Maven plugin:

    ```xml
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>1.6.0</version>
        <executions>
            <execution>
                <goals>
                    <goal>exec</goal>
                </goals>
            </execution>
        </executions>
        <configuration>
            <executable>java</executable>
            <includeProjectDependencies>true</includeProjectDependencies>
            <includePluginDependencies>false</includePluginDependencies>
            <classpathScope>compile</classpathScope>
            <mainClass>${storm.topology}</mainClass>
            <cleanupDaemonThreads>false</cleanupDaemonThreads>
        </configuration>
    </plugin>
    ```

* **Apache Maven Compiler Plugin**

    Another useful plug-in is the [`Apache Maven Compiler Plugin`](https://maven.apache.org/plugins/maven-compiler-plugin/), which is used to change compilation options. Change the Java version that Maven uses for the source and target for your application.

  * For HDInsight __3.4 or earlier__, set the source and target Java version to __1.7__.

  * For HDInsight __3.5__, set the source and target Java version to __1.8__.

  Add the following text in the `<plugins>` section of the `pom.xml` file to include the Apache Maven Compiler plugin. This example specifies 1.8, so the target HDInsight version is 3.5.

  ```xml
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
            <source>1.8</source>
            <target>1.8</target>
    </configuration>
  </plugin>
  ```

### Configure resources

The resources section allows you to include non-code resources such as configuration files needed by components in the topology. For this example, add the following text in the `<resources>` section of the `pom.xml` file. Then save and close the file.

```xml
<resource>
    <directory>${basedir}/resources</directory>
    <filtering>false</filtering>
    <includes>
            <include>log4j2.xml</include>
    </includes>
</resource>
```

This example adds the resources directory in the root of the project (`${basedir}`) as a location that contains resources, and includes the file named `log4j2.xml`. This file is used to configure what information is logged by the topology.

## Create the topology

A Java-based Apache Storm topology consists of three components that you must author (or reference) as a dependency.

* **Spouts**: Reads data from external sources and emits streams of data into the topology.

* **Bolts**: Does processing on streams emitted by spouts or other bolts, and emits one or more streams.

* **Topology**: Defines how the spouts and bolts are arranged, and provides the entry point for the topology.

### Create the spout

To reduce requirements for setting up external data sources, the following spout simply emits random sentences. It's a modified version of a spout that is provided with the [Storm-Starter examples](https://github.com/apache/storm/blob/0.10.x-branch/examples/storm-starter/src/jvm/storm/starter).  Although this topology uses one spout, others may have several that feed data from different sources into the topology`.`

Enter the command below to create and open a new file `RandomSentenceSpout.java`:

```cmd
notepad src\main\java\com\microsoft\example\RandomSentenceSpout.java
```

Then copy and paste the java code below into the new file.  Then close the file.

```java
package com.microsoft.example;

import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichSpout;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Values;
import org.apache.storm.utils.Utils;

import java.util.Map;
import java.util.Random;

//This spout randomly emits sentences
public class RandomSentenceSpout extends BaseRichSpout {
  //Collector used to emit output
  SpoutOutputCollector _collector;
  //Used to generate a random number
  Random _rand;

  //Open is called when an instance of the class is created
  @Override
  public void open(Map conf, TopologyContext context, SpoutOutputCollector collector) {
  //Set the instance collector to the one passed in
    _collector = collector;
    //For randomness
    _rand = new Random();
  }

  //Emit data to the stream
  @Override
  public void nextTuple() {
  //Sleep for a bit
    Utils.sleep(100);
    //The sentences that are randomly emitted
    String[] sentences = new String[]{ "the cow jumped over the moon", "an apple a day keeps the doctor away",
        "four score and seven years ago", "snow white and the seven dwarfs", "i am at two with nature" };
    //Randomly pick a sentence
    String sentence = sentences[_rand.nextInt(sentences.length)];
    //Emit the sentence
    _collector.emit(new Values(sentence));
  }

  //Ack is not implemented since this is a basic example
  @Override
  public void ack(Object id) {
  }

  //Fail is not implemented since this is a basic example
  @Override
  public void fail(Object id) {
  }

  //Declare the output fields. In this case, an sentence
  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("sentence"));
  }
}
```

> [!NOTE]  
> For an example of a spout that reads from an external data source, see one of the following examples:
>
> * [TwitterSampleSPout](https://github.com/apache/storm/blob/0.10.x-branch/examples/storm-starter/src/jvm/storm/starter/spout/TwitterSampleSpout.java): An example spout that reads from Twitter.
> * [Storm-Kafka](https://github.com/apache/storm/tree/0.10.x-branch/external/storm-kafka): A spout that reads from Kafka.

### Create the bolts

Bolts handle the data processing. Bolts can do anything, for example, computation, persistence, or talking to external components. This topology uses two bolts:

* **SplitSentence**: Splits the sentences emitted by **RandomSentenceSpout** into individual words.

* **WordCount**: Counts how many times each word has occurred.

#### SplitSentence

Enter the command below to create and open a new file `SplitSentence.java`:

```cmd
notepad src\main\java\com\microsoft\example\SplitSentence.java
```

Then copy and paste the java code below into the new file.  Then close the file.

```java
package com.microsoft.example;

import java.text.BreakIterator;

import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;

//There are a variety of bolt types. In this case, use BaseBasicBolt
public class SplitSentence extends BaseBasicBolt {

  //Execute is called to process tuples
  @Override
  public void execute(Tuple tuple, BasicOutputCollector collector) {
    //Get the sentence content from the tuple
    String sentence = tuple.getString(0);
    //An iterator to get each word
    BreakIterator boundary=BreakIterator.getWordInstance();
    //Give the iterator the sentence
    boundary.setText(sentence);
    //Find the beginning first word
    int start=boundary.first();
    //Iterate over each word and emit it to the output stream
    for (int end=boundary.next(); end != BreakIterator.DONE; start=end, end=boundary.next()) {
      //get the word
      String word=sentence.substring(start,end);
      //If a word is whitespace characters, replace it with empty
      word=word.replaceAll("\\s+","");
      //if it's an actual word, emit it
      if (!word.equals("")) {
        collector.emit(new Values(word));
      }
    }
  }

  //Declare that emitted tuples contain a word field
  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("word"));
  }
}
```

#### WordCount

Enter the command below to create and open a new file `WordCount.java`:

```cmd
notepad src\main\java\com\microsoft\example\WordCount.java
```

Then copy and paste the java code below into the new file.  Then close the file.

```java
package com.microsoft.example;

import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;

import org.apache.storm.Constants;
import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.apache.storm.Config;

// For logging
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;

//There are a variety of bolt types. In this case, use BaseBasicBolt
public class WordCount extends BaseBasicBolt {
  //Create logger for this class
  private static final Logger logger = LogManager.getLogger(WordCount.class);
  //For holding words and counts
  Map<String, Integer> counts = new HashMap<String, Integer>();
  //How often to emit a count of words
  private Integer emitFrequency;

  // Default constructor
  public WordCount() {
      emitFrequency=5; // Default to 60 seconds
  }

  // Constructor that sets emit frequency
  public WordCount(Integer frequency) {
      emitFrequency=frequency;
  }

  //Configure frequency of tick tuples for this bolt
  //This delivers a 'tick' tuple on a specific interval,
  //which is used to trigger certain actions
  @Override
  public Map<String, Object> getComponentConfiguration() {
      Config conf = new Config();
      conf.put(Config.TOPOLOGY_TICK_TUPLE_FREQ_SECS, emitFrequency);
      return conf;
  }

  //execute is called to process tuples
  @Override
  public void execute(Tuple tuple, BasicOutputCollector collector) {
    //If it's a tick tuple, emit all words and counts
    if(tuple.getSourceComponent().equals(Constants.SYSTEM_COMPONENT_ID)
            && tuple.getSourceStreamId().equals(Constants.SYSTEM_TICK_STREAM_ID)) {
      for(String word : counts.keySet()) {
        Integer count = counts.get(word);
        collector.emit(new Values(word, count));
        logger.info("Emitting a count of " + count + " for word " + word);
      }
    } else {
      //Get the word contents from the tuple
      String word = tuple.getString(0);
      //Have we counted any already?
      Integer count = counts.get(word);
      if (count == null)
        count = 0;
      //Increment the count and store it
      count++;
      counts.put(word, count);
    }
  }

  //Declare that this emits a tuple containing two fields; word and count
  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("word", "count"));
  }
}
```

### Define the topology

The topology ties the spouts and bolts together into a graph. The graph defines how data flows between the components. It also provides parallelism hints that Storm uses when creating instances of the components within the cluster.

The following image is a basic diagram of the graph of components for this topology.

![diagram showing the spouts and bolts arrangement](./media/apache-storm-develop-java-topology/word-count-topology1.png)

To implement the topology, enter the command below to create and open a new file `WordCountTopology.java`:

```cmd
notepad src\main\java\com\microsoft\example\WordCountTopology.java
```

Then copy and paste the java code below into the new file.  Then close the file.

```java
package com.microsoft.example;

import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.StormSubmitter;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.tuple.Fields;

import com.microsoft.example.RandomSentenceSpout;

public class WordCountTopology {

  //Entry point for the topology
  public static void main(String[] args) throws Exception {
  //Used to build the topology
    TopologyBuilder builder = new TopologyBuilder();
    //Add the spout, with a name of 'spout'
    //and parallelism hint of 5 executors
    builder.setSpout("spout", new RandomSentenceSpout(), 5);
    //Add the SplitSentence bolt, with a name of 'split'
    //and parallelism hint of 8 executors
    //shufflegrouping subscribes to the spout, and equally distributes
    //tuples (sentences) across instances of the SplitSentence bolt
    builder.setBolt("split", new SplitSentence(), 8).shuffleGrouping("spout");
    //Add the counter, with a name of 'count'
    //and parallelism hint of 12 executors
    //fieldsgrouping subscribes to the split bolt, and
    //ensures that the same word is sent to the same instance (group by field 'word')
    builder.setBolt("count", new WordCount(), 12).fieldsGrouping("split", new Fields("word"));

    //new configuration
    Config conf = new Config();
    //Set to false to disable debug information when
    // running in production on a cluster
    conf.setDebug(false);

    //If there are arguments, we are running on a cluster
    if (args != null && args.length > 0) {
      //parallelism hint to set the number of workers
      conf.setNumWorkers(3);
      //submit the topology
      StormSubmitter.submitTopology(args[0], conf, builder.createTopology());
    }
    //Otherwise, we are running locally
    else {
      //Cap the maximum number of executors that can be spawned
      //for a component to 3
      conf.setMaxTaskParallelism(3);
      //LocalCluster is used to run locally
      LocalCluster cluster = new LocalCluster();
      //submit the topology
      cluster.submitTopology("word-count", conf, builder.createTopology());
      //sleep
      Thread.sleep(10000);
      //shut down the cluster
      cluster.shutdown();
    }
  }
}
```

### Configure logging

Storm uses [Apache Log4j 2](https://logging.apache.org/log4j/2.x/) to log information. If you don't configure logging, the topology emits diagnostic information. To control what is logged, create a file named `log4j2.xml` in the `resources` directory by entering the command below:

```cmd
notepad resources\log4j2.xml
```

Then copy and paste the XML text below into the new file.  Then close the file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <Appenders>
        <Console name="STDOUT" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>
    <Loggers>
        <Logger name="com.microsoft.example" level="trace" additivity="false">
            <AppenderRef ref="STDOUT"/>
        </Logger>
        <Root level="error">
            <Appender-Ref ref="STDOUT"/>
        </Root>
    </Loggers>
</Configuration>
```

This XML configures a new logger for the `com.microsoft.example` class, which includes the components in this example topology. The level is set to trace for this logger, which captures any logging information emitted by components in this topology.

The `<Root level="error">` section configures the root level of logging (everything not in `com.microsoft.example`) to only log error information.

For more information on configuring logging for Log4j 2, see [https://logging.apache.org/log4j/2.x/manual/configuration.html](https://logging.apache.org/log4j/2.x/manual/configuration.html).

> [!NOTE]  
> Storm version 0.10.0 and higher use Log4j 2.x. Older versions of storm used Log4j 1.x, which used a different format for log configuration. For information on the older configuration, see [https://cwiki.apache.org/confluence/display/LOGGINGLOG4J/Log4jXmlFormat](https://cwiki.apache.org/confluence/display/LOGGINGLOG4J/Log4jXmlFormat).

## Test the topology locally

After you save the files, use the following command to test the topology locally.

```cmd
mvn compile exec:java -Dstorm.topology=com.microsoft.example.WordCountTopology
```

As it runs, the topology displays startup information. The following text is an example of the word count output:

    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word snow
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word white
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 112 for word seven
    17:33:27 [Thread-16-count] INFO  com.microsoft.example.WordCount - Emitting a count of 195 for word the
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 113 for word and
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word dwarfs
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word snow

This example log indicates that the word 'and' has been emitted 113 times. The count continues to increase as long as the topology runs. This increase is because the spout continuously emits the same sentences.

There's a 5-second interval between emission of words and counts. The **WordCount** component is configured to only emit information when a tick tuple arrives. It requests that tick tuples are only delivered every five seconds.

## Convert the topology to Flux

[Flux](https://storm.apache.org/releases/2.0.0/flux.html) is a new framework available with Storm 0.10.0 and higher. Flux allows you to separate configuration from implementation. Your components are still defined in Java, but the topology is defined using a YAML file. You can package a default topology definition with your project, or use a standalone file when submitting the topology. When submitting the topology to Storm, use environment variables or configuration files to populate YAML topology definition values.

The YAML file defines the components to use for the topology and the data flow between them. You can include a YAML file as part of the jar file. Or you can use an external YAML file.

For more information on Flux, see [Flux framework (https://storm.apache.org/releases/current/flux.html)](https://storm.apache.org/releases/current/flux.html).

> [!WARNING]  
> Due to a [bug (https://issues.apache.org/jira/browse/STORM-2055)](https://issues.apache.org/jira/browse/STORM-2055) with Storm 1.0.1, you may need to install a [Storm development environment](https://storm.apache.org/releases/current/Setting-up-development-environment.html) to run Flux topologies locally.

1. Previously, `WordCountTopology.java` defined the topology, but isn't needed with Flux. Delete the file with the following command:

    ```cmd
    DEL src\main\java\com\microsoft\example\WordCountTopology.java
    ```

1. Enter the command below to create and open a new file `topology.yaml`:

    ```cmd
    notepad resources\topology.yaml
    ```

    Then copy and paste the text below into the new file.  Then close the file.

    ```yaml
    name: "wordcount"       # friendly name for the topology

    config:                 # Topology configuration
           topology.workers: 1     # Hint for the number of workers to create
  
    spouts:                 # Spout definitions
    - id: "sentence-spout"
           className: "com.microsoft.example.RandomSentenceSpout"
           parallelism: 1      # parallelism hint

    bolts:                  # Bolt definitions
    - id: "splitter-bolt"
           className: "com.microsoft.example.SplitSentence"
           parallelism: 1

    - id: "counter-bolt"
           className: "com.microsoft.example.WordCount"
           constructorArgs:
             - 10
           parallelism: 1

    streams:                # Stream definitions
    - name: "Spout --> Splitter" # name isn't used (placeholder for logging, UI, etc.)
           from: "sentence-spout"       # The stream emitter
           to: "splitter-bolt"          # The stream consumer
           grouping:                    # Grouping type
             type: SHUFFLE

    - name: "Splitter -> Counter"
           from: "splitter-bolt"
           to: "counter-bolt"
           grouping:
             type: FIELDS
             args: ["word"]           # field(s) to group on
    ```

1. Enter the command below to open `pom.xml` to make the described revisions below:

    ```cmd
    notepad pom.xml
    ```

   1. Add the following new dependency in the `<dependencies>` section:

        ```xml
        <!-- Add a dependency on the Flux framework -->
        <dependency>
            <groupId>org.apache.storm</groupId>
            <artifactId>flux-core</artifactId>
            <version>${storm.version}</version>
        </dependency>
        ```

   1. Add the following plugin to the `<plugins>` section. This plugin handles the creation of a package (jar file) for the project, and applies some transformations specific to Flux when creating the package.

        ```xml
        <!-- build an uber jar -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.2.1</version>
            <configuration>
                <transformers>
                    <!-- Keep us from getting a "can't overwrite file error" -->
                    <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer" />
                    <transformer implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer" />
                    <!-- We're using Flux, so refer to it as main -->
                    <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                        <mainClass>org.apache.storm.flux.Flux</mainClass>
                    </transformer>
                </transformers>
                <!-- Keep us from getting a bad signature error -->
                <filters>
                    <filter>
                        <artifact>*:*</artifact>
                        <excludes>
                            <exclude>META-INF/*.SF</exclude>
                            <exclude>META-INF/*.DSA</exclude>
                            <exclude>META-INF/*.RSA</exclude>
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
                </execution>
            </executions>
        </plugin>
        ```

   1. For the Exec Maven Plugin section, navigate to `<configuration>` > `<mainClass>` and change `${storm.topology}` to `org.apache.storm.flux.Flux`. This setting allows Flux to handle running the topology locally in development.

   1. In the `<resources>` section, add the following to `<includes>`. This XML includes the YAML file that defines the topology as part of the project.

        ```xml
        <include>topology.yaml</include>
        ```

## Test the flux topology locally

1. Enter the following command to compile and execute the Flux topology using Maven:

    ```cmd
    mvn compile exec:java -Dexec.args="--local -R /topology.yaml"
    ```

    > [!WARNING]  
    > If your topology uses Storm 1.0.1 bits, this command fails. This failure is caused by [https://issues.apache.org/jira/browse/STORM-2055](https://issues.apache.org/jira/browse/STORM-2055). Instead, [install Storm in your development environment](https://storm.apache.org/releases/current/Setting-up-development-environment.html) and use the following steps:
    >
    > If you have [installed Storm in your development environment](https://storm.apache.org/releases/current/Setting-up-development-environment.html), you can use the following commands instead:
    >
    > ```cmd
    > mvn compile package
    > storm jar target/WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local -R /topology.yaml
    > ```

    The `--local` parameter runs the topology in local mode on your development environment. The `-R /topology.yaml` parameter uses the `topology.yaml` file resource from the jar file to define the topology.

    As it runs, the topology displays startup information. The following text is an example of the output:

    ```
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word snow
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word white
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 112 for word seven
    17:33:27 [Thread-16-count] INFO  com.microsoft.example.WordCount - Emitting a count of 195 for word the
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 113 for word and
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word dwarfs
    ```

    There's a 10-second delay between batches of logged information.

2. Create a new topology yaml from the project.

    1. Enter the command below to open `topology.xml`:

    ```cmd
    notepad resources\topology.yaml
    ```

    1. Find the following section and change the value of `10` to `5`. This modification changes the interval between emitting batches of word counts from 10 seconds to 5.  

    ```yaml
    - id: "counter-bolt"
           className: "com.microsoft.example.WordCount"
           constructorArgs:
             - 5
           parallelism: 1  
    ```

    1. Save file as `newtopology.yaml`.

3. To run the topology, enter the following command:

    ```cmd
    mvn exec:java -Dexec.args="--local resources/newtopology.yaml"
    ```

    Or, if you have Storm on your development environment:

    ```cmd
    storm jar target/WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local resources/newtopology.yaml
    ```

    This command uses the `newtopology.yaml` as the topology definition. Since we didn't include the `compile` parameter, Maven uses the version of the project built in previous steps.

    Once the topology starts, you should notice that the time between emitted batches has changed to reflect the value in `newtopology.yaml`. So you can see that you can change your configuration through a YAML file without having to recompile the topology.

For more information on these and other features of the Flux framework, see [Flux (https://storm.apache.org/releases/current/flux.html)](https://storm.apache.org/releases/current/flux.html).

## Trident

[Trident](https://storm.apache.org/releases/current/Trident-API-Overview.html) is a high-level abstraction that is provided by Storm. It supports stateful processing. The primary advantage of Trident is that it guarantees that every message that enters the topology is processed only once. Without using Trident, your topology can only guarantee that messages are processed at least once. There are also other differences, such as built-in components that can be used instead of creating bolts. Bolts are replaced by less-generic components, such as filters, projections, and functions.

Trident applications can be created by using Maven projects. You use the same basic steps as presented earlier in this article—only the code is different. Trident also can't (currently) be used with the Flux framework.

For more information about Trident, see the [Trident API Overview](https://storm.apache.org/releases/current/Trident-API-Overview.html).

## Next Steps

You've learned how to create an Apache Storm topology by using Java. Now learn how to:

* [Deploy and manage Apache Storm topologies on HDInsight](apache-storm-deploy-monitor-topology-linux.md)

* [Develop topologies using Python](apache-storm-develop-python-topology.md)

You can find more example Apache Storm topologies by visiting [Example topologies for Apache Storm on HDInsight](apache-storm-example-topology.md).
