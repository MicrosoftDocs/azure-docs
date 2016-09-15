<properties
   pageTitle="Develop Java-based topologies for Apache Storm | Microsoft Azure"
   description="Learn how to create Storm topologies in Java by creating a simple word count topology."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="jhubbard"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="09/14/2016"
   ms.author="larryfr"/>

#Develop Java-based topologies for a basic word-count application with Apache Storm and Maven on HDInsight

Learn how to create a Java-based topology for Apache Storm on HDInsight by using Maven. You will walk through the process of creating a basic word-count application using Maven and Java, where the topology is defined in Java. Then, you will learn how to define the topology using the Flux framework.

> [AZURE.NOTE] The Flux framework is available in Storm 0.10.0 or later. Storm 0.10.0 is available with HDInsight 3.3 and 3.4.

After completing the steps in this document, you will have a basic topology that you can deploy to Apache Storm on HDInsight.

> [AZURE.NOTE] A completed version of the topologies created in this document is available at [https://github.com/Azure-Samples/hdinsight-java-storm-wordcount](https://github.com/Azure-Samples/hdinsight-java-storm-wordcount).

##Prerequisites

* <a href="https://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html" target="_blank">Java Developer Kit (JDK) version 7</a>

* <a href="https://maven.apache.org/download.cgi" target="_blank">Maven</a>: Maven is a project build system for Java projects.

* A text editor such as Notepad, <a href="http://www.gnu.org/software/emacs/" target="_blank">Emacs<a>, <a href="http://www.sublimetext.com/" target="_blank">Sublime Text</a>, <a href="https://atom.io/" target="_blank">Atom.io</a>, <a href="http://brackets.io/" target="_blank">Brackets.io</a>. Or you can use an integrated development environment (IDE) such as <a href="https://eclipse.org/" target="_blank">Eclipse</a> (version Luna or later).

	> [AZURE.NOTE] Your editor or IDE may have specific functionality for working with Maven that is not addressed in this document. For information about the capabilities of your editing environment, see the documentation for the product you are using.

##Configure environment variables

The following environment variables may be set when you install Java and the JDK. However, you should check that they exist and that they contain the correct values for your system.

* **JAVA_HOME** - should point to the directory where the Java runtime environment (JRE) is installed. For example, in a Unix or Linux distribution, it should have a value similar to `/usr/lib/jvm/java-7-oracle`. In Windows, it would have a value similar to `c:\Program Files (x86)\Java\jre1.7`

* **PATH** - should contain the following paths:

	* **JAVA_HOME** (or the equivalent path)

	* **JAVA_HOME\bin** (or the equivalent path)

	* The directory where Maven is installed

##Create a new Maven project

From the command-line, use the following code to create a new Maven project named **WordCount**:

	mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.example -DartifactId=WordCount -DinteractiveMode=false

This will create a new directory named **WordCount** at the current location, which contains a basic Maven project.

The **WordCount** directory will contain the following items:

* **pom.xml**: Contains settings for the Maven project.

* **src\main\java\com\microsoft\example**: Contains your application code.

* **src\test\java\com\microsoft\example**: Contains tests for your application. For this example, we will not be creating tests.

###Remove the example code

Because we will be creating our application, delete the generated test and the application files:

*  **src\test\java\com\microsoft\example\AppTest.java**

*  **src\main\java\com\microsoft\example\App.java**

##Add properties

Maven allows you to define project-level values called properties. Add the following after the `<url>http://maven.apache.org</url>` line:

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <!--
        Storm 0.10.0 is for HDInsight 3.3 and 3.4.
        To find the version information for earlier HDInsight cluster
        versions, see https://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/
        -->
        <storm.version>0.10.0</storm.version>
    </properties>

We can now use these values in other sections. For example, when specifying the version of Storm components, we can use `${storm.version}` instead of hard coding a value.

##Add dependencies

Because this is a Storm topology, you must add a dependency for Storm components. Open the **pom.xml** file and add the following code in the **&lt;dependencies>** section:

	<dependency>
	  <groupId>org.apache.storm</groupId>
	  <artifactId>storm-core</artifactId>
      <version>${storm.version}</version>
	  <!-- keep storm out of the jar-with-dependencies -->
	  <scope>provided</scope>
	</dependency>

At compile time, Maven uses this information to look up **storm-core** in the Maven repository. It first looks in the repository on your local computer. If the files aren't there, it will download them from the public Maven repository and store them in the local repository.

> [AZURE.NOTE] Notice the `<scope>provided</scope>` line in the section we added. This tells Maven to exclude **storm-core** from any JAR files we create, because it will be provided by the system. This allows the packages you create to be a little smaller, and it ensures that they will use the **storm-core** bits that are included in the Storm on HDInsight cluster.

##Build configuration

Maven plug-ins allow you to customize the build stages of the project, such as how the project is compiled or how to package it into a JAR file. Open the **pom.xml** file and add the following code directly above the `</project>` line.

	<build>
	  <plugins>
	  </plugins>
      <resources>
      </resources>
	</build>

This section will be used to add plug-ins, resources, and other build configuration options. For a full reference of the __pom.xml__ file, see [http://maven.apache.org/pom.html](http://maven.apache.org/pom.html).

###Add plug-ins

For Storm topologies, the <a href="http://mojo.codehaus.org/exec-maven-plugin/" target="_blank">Exec Maven Plugin</a> is useful because it allows you to easily run the topology locally in your development environment. Add the following to the `<plugins>` section of the **pom.xml** file to include the Exec Maven plugin:

	<plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>exec-maven-plugin</artifactId>
      <version>1.4.0</version>
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
      </configuration>
    </plugin>

> [AZURE.NOTE] Note that the `<mainClass>` entry uses `${storm.topology}`. We didn't define this earlier in the properties section (but we could have.) Instead, we will set this value from the command-line when running the topology on your development environment in a later step.

Another useful plug-in is the <a href="http://maven.apache.org/plugins/maven-compiler-plugin/" target="_blank">Apache Maven Compiler Plugin</a>, which is used to change compilation options. The primary reason we need this is to change the Java version that Maven uses for the source and target for your application. We want version 1.7.

Add the following in the `<plugins>` section of the **pom.xml** file to include the Apache Maven Compiler plugin and set the source and target versions to 1.7.

	<plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.3</version>
      <configuration>
        <source>1.7</source>
        <target>1.7</target>
      </configuration>
    </plugin>

###Configure resources

The resources section allows you to include non-code resources such as configuration files needed by components in the topology. For this example, add the following in the `<resources>` section of the **pom.xml** file.

    <resource>
        <directory>${basedir}/resources</directory>
        <filtering>false</filtering>
        <includes>
          <include>log4j2.xml</include>
        </includes>
    </resource>

This adds the resources directory in the root of the project (`${basedir}`) as a location that contains resources, and includes the file named __log4j2.xml__. This file is used to configure what information is logged by the topology.

##Create the topology

A Java-based Storm topology consists of three components that you must author (or reference) as a dependency.

* **Spouts**: Reads data from external sources and emits streams of data into the topology.

* **Bolts**: Performs processing on streams emitted by spouts or other bolts, and emits one or more streams.

* **Topology**: Defines how the spouts and bolts are arranged, and provides the entry point for the topology.

###Create the spout

To reduce requirements for setting up external data sources, the following spout simply emits random sentences. It is a modified version of a spout that is provided with the [Storm-Starter examples](https://github.com/apache/storm/blob/0.10.x-branch/examples/storm-starter/src/jvm/storm/starter).

> [AZURE.NOTE] For an example of a spout that reads from an external data source, see one of the following examples:
>
> * [TwitterSampleSPout](https://github.com/apache/storm/blob/0.10.x-branch/examples/storm-starter/src/jvm/storm/starter/spout/TwitterSampleSpout.java): An example spout that reads from Twitter
>
> * [Storm-Kafka](https://github.com/apache/storm/tree/0.10.x-branch/external/storm-kafka): A spout that reads from Kafka

For the spout, create a new file named **RandomSentenceSpout.java** in the **src\main\java\com\microsoft\example** directory and use the following as the contents:

    /**
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

     /**
      * Original is available at https://github.com/apache/storm/blob/master/examples/storm-starter/src/jvm/storm/starter/spout/RandomSentenceSpout.java
      */

    package com.microsoft.example;

    import backtype.storm.spout.SpoutOutputCollector;
    import backtype.storm.task.TopologyContext;
    import backtype.storm.topology.OutputFieldsDeclarer;
    import backtype.storm.topology.base.BaseRichSpout;
    import backtype.storm.tuple.Fields;
    import backtype.storm.tuple.Values;
    import backtype.storm.utils.Utils;

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
        //The sentences that will be randomly emitted
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

Take a moment to read through the code comments to understand how this spout works.

> [AZURE.NOTE] Although this topology uses only one spout, others may have several that feed data from different sources into the topology.

###Create the bolts

Bolts handle the data processing. For this topology, we have two bolts:

* **SplitSentence**: Splits the sentences emitted by **RandomSentenceSpout** into individual words.

* **WordCount**: Counts how many times each word has occurred.

> [AZURE.NOTE] Bolts can do literally anything, for example, computation, persistence, or talking to external components.

Create two new files, **SplitSentence.java** and **WordCount.Java** in the **src\main\java\com\microsoft\example** directory. Use the following as the contents for the files:

**SplitSentence**

    package com.microsoft.example;

    import java.text.BreakIterator;

    import backtype.storm.topology.BasicOutputCollector;
    import backtype.storm.topology.OutputFieldsDeclarer;
    import backtype.storm.topology.base.BaseBasicBolt;
    import backtype.storm.tuple.Fields;
    import backtype.storm.tuple.Tuple;
    import backtype.storm.tuple.Values;

    //There are a variety of bolt types. In this case, we use BaseBasicBolt
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

      //Declare that emitted tuples will contain a word field
      @Override
      public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("word"));
      }
    }

**WordCount**

    package com.microsoft.example;

    import java.util.HashMap;
    import java.util.Map;
    import java.util.Iterator;

    import backtype.storm.Constants;
    import backtype.storm.topology.BasicOutputCollector;
    import backtype.storm.topology.OutputFieldsDeclarer;
    import backtype.storm.topology.base.BaseBasicBolt;
    import backtype.storm.tuple.Fields;
    import backtype.storm.tuple.Tuple;
    import backtype.storm.tuple.Values;
    import backtype.storm.Config;

    // For logging
    import org.apache.logging.log4j.Logger;
    import org.apache.logging.log4j.LogManager;

    //There are a variety of bolt types. In this case, we use BaseBasicBolt
    public class WordCount extends BaseBasicBolt {
        //Create logger for this class
        private static final Logger logger = LogManager.getLogger(WordCount.class);
        //For holding words and counts
        Map<String, Integer> counts = new HashMap<String, Integer>();
        //How often we emit a count of words
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

        //Declare that we will emit a tuple containing two fields; word and count
        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields("word", "count"));
        }
    }

Take a moment to read through the code comments to understand how each bolt works.

###Define the topology

The topology ties the spouts and bolts together into a graph, which defines how data flows between the components. It also provides parallelism hints that Storm uses when creating instances of the components within the cluster.

The following is a basic diagram of the graph of components for this topology.

![diagram showing the spouts and bolts arrangement](./media/hdinsight-storm-develop-java-topology/wordcount-topology.png)

To implement the topology, create a new file named **WordCountTopology.java** in the **src\main\java\com\microsoft\example** directory. Use the following as the contents for the file:

	package com.microsoft.example;

    import backtype.storm.Config;
    import backtype.storm.LocalCluster;
    import backtype.storm.StormSubmitter;
    import backtype.storm.topology.TopologyBuilder;
    import backtype.storm.tuple.Fields;

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
        //Set to false to disable debug information
        // when running in production mode.
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

Take a moment to read through the code comments to understand how the topology is defined and then submitted to the cluster.

###Configure logging

Storm uses Apache Log4j to log information. If you do not configure logging, the topology will emit a lot of diagnostic information, which can be difficult to read. To control what is logged, create a file named __log4j2.xml__ in the __resources__ directory. Use the following as the contents of the file.

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

This configures a new logger for the __com.microsoft.example__ class, which includes the components in this example topology. The level is set to trace for this logger, which will capture any logging information emitted by components in this topology. If you look back through the code for this project, you'll notice that only the WordCount.java file implements logging; it will log the count of each word.

The `<Root level="error">` section configures the root level of logging (everything not in __com.microsoft.example__,) to only log error information.

> [AZURE.IMPORTANT] While this greatly reduces the information logged when testing a topology in your development environment, it does not remove all the debug information produced when running on a cluster in production. To reduce that information, you must also set debugging to false in the configuration submitted to the cluster. See the WordCountTopology.java code in this document for an example. 

For more information on configuring logging for Log4j, see [http://logging.apache.org/log4j/2.x/manual/configuration.html](http://logging.apache.org/log4j/2.x/manual/configuration.html).

> [AZURE.NOTE] Storm version 0.10.0 uses Log4j 2.x. Older versions of storm used Log4j 1.x, which used a different format for log configuration. For information on the older configuration, see [http://wiki.apache.org/logging-log4j/Log4jXmlFormat](http://wiki.apache.org/logging-log4j/Log4jXmlFormat).

##Test the topology locally

After you save the files, use the following command to test the topology locally.

	mvn compile exec:java -Dstorm.topology=com.microsoft.example.WordCountTopology

As it runs, the topology will display startup information. Then it begins to display lines similar to the following as sentences are emitted from the spout and processed by the bolts.

    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word snow
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word white
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 112 for word seven
    17:33:27 [Thread-16-count] INFO  com.microsoft.example.WordCount - Emitting a count of 195 for word the
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 113 for word and
    17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word dwarfs
    17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word snow

By looking at the logging emitted by the WordCount bolt, we can see that 'and' has been emitted 113 times. The count will continue to go up as long as the topology runs because the spout continuously emits the same sentences.

There will also be a 5 second interval between emission of words and counts. This occurs because the __WordCount__ component is configured to only emit information when a tick tuple arrives, and it requests that such tuples are only delivered every 5 seconds by default.

## Convert the topology to Flux

Flux is a new framework available with Storm 0.10.0, which allows you to separate configuration from implementation. Your components (bolts and spouts,) are still defined in Java, but the topology is defined using a YAML file.

The YAML file defines the components to use for the topology, how data flows between them, and what values to use when initializing the components. You can include a YAML file as part of the jar file containing your project when you deploy it, or you can use an external YAML file when you start the topology.

1. Move the __WordCountTopology.java__ file out of the project. Previously, this defined the topology, but we won't be using it for Flux.

2. In the __resources__ directory, create a new file named __topology.yaml__. Use the following as the contents of this file.

        # topology definition

        # name to be used when submitting. This is what shows up...
        # in the Storm UI/storm command-line tool as the topology name
        # when submitted to Storm
        name: "wordcount"

        # Topology configuration
        config:
        # Hint for the number of workers to create
        topology.workers: 1

        # Spout definitions
        spouts:
        - id: "sentence-spout"
            className: "com.microsoft.example.RandomSentenceSpout"
            # parallelism hint
            parallelism: 1

        # Bolt definitions
        bolts:
        - id: "splitter-bolt"
            className: "com.microsoft.example.SplitSentence"
            parallelism: 1

        - id: "counter-bolt"
            className: "com.microsoft.example.WordCount"
            constructorArgs:
            - 10
            parallelism: 1

        # Stream definitions
        streams:
        - name: "Spout --> Splitter" # name isn't used (placeholder for logging, UI, etc.)
            # The stream emitter
            from: "sentence-spout"
            # The stream consumer
            to: "splitter-bolt"
            # Grouping type
            grouping:
            type: SHUFFLE

        - name: "Splitter -> Counter"
            from: "splitter-bolt"
            to: "counter-bolt"
            grouping:
            type: FIELDS
            # field(s) to group on
            args: ["word"]

    Take a moment to read through and understand what each section does and how it relates to the Java-based definition in the __WordCountTopology.java__ file.

3. Make the following changes to the __pom.xml__ file.

    * Add the following new dependency in the `<dependencies>` section:

            <!-- Add a dependency on the Flux framework -->
            <dependency>
                <groupId>org.apache.storm</groupId>
                <artifactId>flux-core</artifactId>
                <version>${storm.version}</version>
            </dependency>

    * Add the following plugin to the `<plugins>` section. This plugin handles the creation of a package (jar file) for the project, and applies some transformations specific to Flux when creating the package.

            <!-- build an uber jar -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.3</version>
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

    * In the __exec-maven-plugin__ `<configuration>` section, change the value for `<mainClass>` to `org.apache.storm.flux.Flux`. This allows Flux to handle running the topology when we run it locally in development.

    * In the `<resources>` section, add the following to the `<includes>`. This includes the YAML file that defines the topology as part of the project.
    
            <include>topology.yaml</include>

## Test the flux topology locally

1. Use the following to compile and execute the Flux topology using Maven.

        mvn compile exec:java -Dexec.args="--local -R /topology.yaml"
    
    If you are using PowerShell, use the following:
    
        mvn compile exec:java "-Dexec.args=--local -R /topology.yaml"

    If you are on a Linux/Unix/OS X system, and have [installed Storm in your development environment](http://storm.apache.org/releases/0.10.0/Setting-up-development-environment.html), you can use the following commands instead:

        mvn compile package
        storm jar target/WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local -R /topology.yaml

    The `--local` parameter runs the topology in local mode on your development environment. The `-R /topology.yaml` parameter uses the `topology.yaml` file resource from the jar file to define the topology.

    As it runs, the topology will display startup information. Then it begins to display lines similar to the following as sentences are emitted from the spout and processed by the bolts.

        17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word snow
        17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 56 for word white
        17:33:27 [Thread-12-count] INFO  com.microsoft.example.WordCount - Emitting a count of 112 for word seven
        17:33:27 [Thread-16-count] INFO  com.microsoft.example.WordCount - Emitting a count of 195 for word the
        17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 113 for word and
        17:33:27 [Thread-30-count] INFO  com.microsoft.example.WordCount - Emitting a count of 57 for word dwarfs
    
    There will be a 10 second delay between batches of logged information, as the `topology.yaml` file passes a value of `10` when the WordCount component is created. This sets the delay interval for the tick tuple to 10 seconds.

2.  Make a copy of the `topology.yaml` file from the project. Call it something like `newtopology.yaml`. In the file, find the following section and change the value of `10` to `5`. This changes the interval between emitting batches of word counts from 10 seconds to 5.

          - id: "counter-bolt"
            className: "com.microsoft.example.WordCount"
            constructorArgs:
            - 5
            parallelism: 1

3. To run the topology, use the following command:

        mvn exec:java -Dexec.args="--local /path/to/newtopology.yaml"

    Or, if you have Storm on your Linux/Unix/OS X development environment:

        storm jar target/WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local /path/to/newtopology.yaml

    Change the `/path/to/newtopology.yaml` to the path to the newtopology.yaml file you created in the previous step. This command will use the newtopology.yaml as the topology definition. Since we didn't include the `compile` parameter, Maven will reuse the version of the project built in previous steps.

    Once the topology starts, you should notice that the time between emitted batches has changed to reflect the value in newtopology.yaml. So you can see that you can change your configuration through a YAML file without having to recompile the topology.

There are several other features that Flux provides that are not discussed here, such as variable substitution in the YAML file based on parameters passed at run-time, or from environment variables. For more information on these and other features of the Flux framework, see [Flux (https://storm.apache.org/releases/0.10.0/flux.html)](https://storm.apache.org/releases/0.10.0/flux.html).

##Trident

Trident is a high-level abstraction that is provided by Storm. It supports stateful processing. The primary advantage of Trident is that it can guarantee that every message that enters the topology is processed only once. This is difficult to achieve in a raw Java topology, which guarantee's that messages will be processed at least once. There are also other differences, such as built-in components that can be used instead of creating bolts. In fact, bolts are completely replaced by less-generic components, such as filters, projections, and functions.

Trident applications can be created by using Maven projects. You use the same basic steps as presented earlier in this article—only the code is different. Trident also cannot (currently) be used with the Flux framework.

For more information about Trident, see the <a href="http://storm.apache.org/documentation/Trident-API-Overview.html" target="_blank">Trident API Overview</a>.

For an example of a Trident application, see [Twitter trending topics with Apache Storm on HDInsight](hdinsight-storm-twitter-trending.md).

##Next Steps

You have learned how to create a Storm topology by using Java. Now learn how to:

* [Deploy and manage Apache Storm topologies on HDInsight](hdinsight-storm-deploy-monitor-topology.md)

* [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md)

You can find more example Storm topologies by visiting [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md).
