<properties title="Develop Storm topologies for HDInsight (Hadoop)" pageTitle="Develop Storm topologies for Microsoft Azure HDInsight (Hadoop) using Java and Maven" description="Learn how to use Maven to develop a Java-based Storm topology for use with HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure storm java maven" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr" />

#Developing for Storm in HDInsight

[What] - Developing Storm topologies is a pain. You need:
* A data source. This is usually something outside Hadoop, like a queue or API.
* A spout to talk to the data source.
* One or more bolts to process the data.
* One or more bolts to act on the data (raise alerts, send e-mail, or just save it somewhere.)
* If you want to visualize the data in real-time, you have to build some sort of real-time dashboard. You also have to find some communication channel that is common between Java and your dashboard. For example, websockets, signalr, etc.


##In this article, you will learn

- [Concepts](#concepts)
- [Languages, DSLs, and abstractions]
	- Java
	- Trident
	- Clojure
- [Common patterns](#)
	- [Guaranteed message processing]
	- [BasicBolt]
	- [Joins]
	- [Batching]
	- [Caching]
	- [Streaming top N]
	- [Distributed RPC]



##Concepts

* **HDInsight Storm** - HDInsight Storm clusters process **topologies** instead of the MapReduce jobs that you may be familiar with from HDInsight or Hadoop. A Storm cluster contains two types of nodes, head nodes that run **Nimbus** and worker nodes that run **Supervisor**

	* **Nimbus** - Similar to the JobTracker in Hadoop, it is responsible for distributing code throughout the cluster, assigning tasks to machines, and monitoring for failure. HDInsight provides two Nimbus nodes, so there is no single point of failure for a Storm cluster

	* **Supervisior** - The supervisor for each worker node is responsible for starting and stopping **worker processes** on the node

		* **Worker process** - A worker process runs a subset of a **topology**. A running topology is distributed across many worker processes throughout the cluster.

* **Topology** - Defines a graph of computation that processes **streams** of data. Unlike MapReduce jobs, topologies run until you stop them

* **Stream** - An unbound collection of **tuples**. Streams are produced by **spouts** and **bolts**, and consumed by **bolts**

* **Tuple** - A named list of dynamically typed values

* **Spout** - Consumes data from a data source and emits one or more **streams**

	> [WACOM.NOTE] In many cases, data is read from a queue such as Kafka, Azure ServiceBus Queues or Event Hubs. The queue ensures that data is persisted in case of an outage.

* **Bolt** - Consumes **streams**, performs processing on **tuples**, and may emit **streams**. Bolts are also responsible for writing data to external storage, such as a queue, HDInsight HBase, a blob, or other data store

* **Thrift** - Apache Thrift is a software framework for scalable cross-language service development. It allows you to build services that work between C++, Java, Python, PHP, Ruby, Erlang, Perl, Haskell, C#, Cocoa, JavaScript, Node.js, Smalltalk, and other languages.

	* **Nimbus** is a Thrift service, and a **topology** is a Thrift definition, so it is possible to develop topologies using a variety of programming languages 

For more information on Storm components, see the [Storm tutorial][apachetutorial] at apache.org.

##Development languages

While Storm was created to be used with multiple programming languages, you will most often see examples written in Java. While there is [support for multiple languages](https://storm.incubator.apache.org/about/multi-language.html), many of these will require you to install an additional programming language on the HDInsight cluster. 

The HDInsight Storm cluster only provide language support Java, Python, and .NET.

###.NET

SCP is a project that enables .NET developers to design and implement a topology (including spouts and bolts.) Support for SCP is provided by default with HDInsight Storm clusters.

For more information on developing with SCP, see [Link TBD](tbd).

###Java

Most examples you encounter will be either plain Java, or Trident. Trident is a high-level abstraction that makes it easier to do things such as joins, aggregations, grouping, and filtering. However, Trident acts on batches of tuples, where a raw Java solution will process a stream one tuple at a time.

For more information on Trident, see the [Trident tutorial](https://storm.incubator.apache.org/documentation/Trident-tutorial.html) at apache.org.

For examples of both raw Java and Trident topologies, see the **%storm_home%\contrib\storm-starter** directory on your HDInsight Storm cluster.

##Common patterns

See https://storm.incubator.apache.org/documentation/Common-patterns.html



<!-- old -->
- [Create the application project](#create)
- [Write the code](#code)
- [Build and test locally](#build)
- [Deploy and run on HDInsight](#deploy)
- [Next steps](#next)

##Prerequisites

* [Java platform JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 7 or higher

* [Maven](http://maven.apache.org/)

* [An Azure HDInsight cluster with Storm](/en-us/documentation/articles/hdinsight-storm-getting-started)

##<a id="create"></a>Create the application project

Use the following steps to create the scaffolding for the application.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

2. Change directories to the location you wish to create this project. For example, if you have a directory you store all your code projects.

3. Use the following Maven command to create basic scaffolding for your application.

		mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.examples -DartifactId=StormApp -DinteractiveMode=false

	This command will...

	* Create a new directory using the specified *artifactId*. In this case, **StormApp**.
	* Create a **pom.xml** file, which contains Maven information for this project.
	* Create a **src** directory structure, which contains some basic code and tests.

###Add dependencies and plugins

1. Using a text editor, open the **pom.xml** file, and add the following to the **&lt;dependencies>** section. You can add them at the end of the section, after the dependency for junit.

		<dependency>
	      <groupId>org.apache.storm</groupId>
	      <artifactId>storm-core</artifactId>
	      <version>0.9.1-incubating</version>
	      <!-- keep storm out of the jar-with-dependencies -->
	      <scope>provided</scope>
	    </dependency>
	    <dependency>
	      <groupId>org.slf4j</groupId>
	      <artifactId>slf4j-api</groupId>
	      <version>1.7.7</version>
	      <!-- keep slf4j out of the jar-with-dependencies -->
	      <scope>provided</scope>
	    </dependency>

	This adds dependencies for...

	* storm-core - provides core functionality for Storm applications
	* slf4j - provides logging capabilities

	> [WACOM.NOTE] Both of these dependencies are marked with a scope of **provided** to indicate that these dependencies should be downloaded from the Maven repository and used to build the application, but that they will also be available in your runtime environment and do not need to be compiled and included in the JAR created by this project. Both are provided as part of your HDInsight cluster.

2. At the end of the **pom.xml** file, right before the **&lt;/project>** entry, add the following.

		  <build>
		    <plugins>
		      <plugin>
		        <groupId>org.apache.maven.plugins</groupId>
		        <artifactId>maven-compiler-plugin</artifactId>
		        <version>2.3.2</version>
		        <configuration>
		          <source>1.7</source>
		          <target>1.7</target>
		        </configuration>
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
		        <groupId>org.codehaus.mojo</groupId>
		        <artifactId>exec-maven-plugin</artifactId>
		        <version>1.2.1</version>
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
		    </plugins>
		  </build>

	This tells Maven to use the following plugins:

	* maven-compiler-plugin - used to compile the Java application
	* maven-shade-plugin - used to produce an uber jar (sometimes called a fat jar) package
	* exec-maven-plugin - used to run the topology locally

##<a id="write"></a>Write the application code

###Create the spout

1. In the **\stormapp\src\main\java\com\microsoft\examples\stormapp** directory, create a new directory named **spouts**.

2. In the **spouts** directory, create a new file named [TBD]. Use the following as the file contents.

	[tbd]

3. Save the file.

###Create the bolts

1. In the **\stormapp\src\main\java\com\microsoft\examples\stormapp** directory, create a new directory named **bolts**.

2. In the **bolts** directory, create the following new files.

	[tbd]

###Create the topology

1. In the **\stormapp\src\main\java\com\microsoft\examples\stormapp** directory, create a new file named **DifferenceTopology.java**.

2. Open the **DifferenceTopology.java** file and use the following as the contents.

##<a id="build"></a>Build and test the topology

1. From the command line, use the following to build the topology.

		mvn compile

2. If no errors were reported, use the following to run the topology locally.

		mvn compile exec:java -Dstorm.topology=com.microsoft.examples.[tbd]

	This will run the topology locally, and write output to stdout.

##<a id="deploy"></a>Deploy and run on HDInsight
