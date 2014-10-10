<properties title="Analyzing sensor data with Storm and HDInsight" pageTitle="Analyzing sensor data with Apache Storm and Microsoft Azure HDInsight (Hadoop)" description="Learn how to use  Apache Storm to process sensor data in realtime with HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hadoop real-time, azure hdinsight real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#Analyzing sensor data with Storm and HDInsight (Hadoop)

Learn how to use build a solution that uses an HDInsight Storm cluster to process sensor data from Azure Event Hub. During processing, the Storm topology will store all data into an HDInsight HBase cluster. The topology will also use SignalR to provide information to a web-based dashboard.

For this scenario, two temperature values will be stored into Event Hub - one represents the ambient outdoor temperature, and the other represents the temperature in a greenhouse. 

##Prerequisites

* An Azure subscription

* [Java]

* [Maven]

* [Git]

> [WACOM.NOTE] A complete version of this project is available at [github location].

##Architecture

![An architecture diagram][tbd]

##Configure Event Hub

Event Hub is used to receive sensor data from on-site sensors. Since not everyone has access to temperature sensors, or the expertiese to hook them up to Event Hub, use one of the following applications to create and store sensor data into Event Hub.

[needs:]
* create
* delete
* send
* send-error

###.NET application

###Python application

##Create the dashboard

The dashboard is used to display near-real time sensor information. In this case, the dashboard is an ASP.NET application hosted in an Azure Website. The application's primary purpose is to serve as a SignalR hub that receives information from the Storm topology as it processes messages.

The website also contains a static index.html file, which also connects to SignalR, and uses D3.js to graph the data transmitted by the Storm topology.

> [WACOM.NOTE] While you could also use raw WebSockets instead of SignalR, WebSockets does not provide a built-in scaling mechanism if you need to scale out the web site. SignalR can be scaled using [link TBD].
>
> For an example of using a Storm topology to communicate with a website using raw WebSockets, see the [Storm Tweet Sentiment D3 Visualization](https://github.com/P7h/StormTweetsSentimentD3Viz) project.

##Create the virtual network

An Azure Virtual Network allows the Storm cluster to communicate directly with the HBase cluster, without having to go through public gateways into and out of the Azure datacenter. This reduces latency between the systems.

[PowerShell]

##Create the Storm and HBase clusters

Now that the virtual network has been created, use the following PowerShell to create a new Storm and HBase cluster on the same virtual network.

[PowerShell]

> [WACOM.NOTE] The clusters created by this script have only one node each, in order to minimize costs. In a production scenario, each cluster would have multiple nodes.

After running the script, it should return the following information. Save this, as it will be used when developing and deploying the Storm topology.

	* DNS suffix for each cluster

##Develop the Storm topology

> [WACOM.NOTE] The steps in this section should be performed on your local development environment.

###Download and build external dependencies

One of the nice things provided by Maven is the ability to declare dependencies that are automatically downloaded from the Maven repository. However not everything is available through the repository. For this project, two of the dependencies must be downloaded and built locally. After that, they can be added to a local Maven repository for the project.

####Download and build the Event Hub spout

In order to receive data from Event Hub, we will use the [name-tbd] spout. Since this spout is contained in a separate project, we will need to download and build it. Later, we will include this in our topology project as a dependency.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

[include steps to download the spout

5. Use the following to build the spout and create a new JAR file containing the spout and dependencies.

	mvn package

6. Use the following command to install the package into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target\eventhubs-storm-spout-0.9-jar-with-dependencies.jar -DgroupId=com.microsoft.eventhubs -DartifactId=eventhubs-storm-spout -Dversion=0.9 -Dpackaging=jar

####Download and build the SignalR client

In order to send data to the dashboard, we will use the SignalR client SDK for Java. Since this is contained in a separate project, we will need to download and build it. Later, we will include this in our topology project as a dependency.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

2. Change directories to where you want to download and store the SignalR client SDK project.

3. Use the following command to download the project from GitHub.

	git clone https://github.com/SignalR/java-client

4. Change directories into the **java-client\signalr-client-sdk** directory and compile the project into a JAR file using the following commands.

		cd java-client\signalr-client-sdk
		mvn package

	> [WACOM.NOTE] If you receive an error that the **gson** dependency cannot be downloaded, remove the following lines from the **java-client\signalr-client-sdk\pom.xml** file.
	> ```<repositories>
<repository>
<id>central</id>
<name>Central</name>
<url>http://maven.eclipse.org/build</url>
</repository>
</repositories>
```
	> Removing these lines will cause Maven to pull the file from the central repository (the default behavior.) To force Maven to retry the repository, use the `-U` command. For example, `mvn package -U`

6. Use the following command to install the package into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target\signalr-client-sdk-1.0.jar -DgroupId=microsoft.aspnet.signalr -DartifactId=signalr-client-sdk -Dversion=1.0 -Dpackaging=jar

###Scaffold the Storm topology project

Now that we have installed the Event Hub spout and SignalR client into the local repository, use Maven to create the scaffolding for the Storm topology project.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

2. Change directories to the location you wish to create this project. For example, if you have a directory you store all your code projects.

3. Use the following Maven command to create basic scaffolding for your application.

		mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.examples -DartifactId=Temperature -DinteractiveMode=false

	This command will...

	* Create a new directory using the specified *artifactId*. In this case, **Temperature**.
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
		<dependency>
          <groupId>com.microsoft.eventhubs</groupId>
          <artifactId>eventhubs-storm-spout</artifactId>
          <version>0.9</version>
    	</dependency>
		<dependency>
	      <groupId>microsoft.aspnet.signalr</groupId>
	      <artifactId>signalr-client-sdk</artifactId>
	      <version>1.0</version>
	    </dependency>
	    <dependency>
	      <groupId>com.google.code.gson</groupId>
	      <artifactId>gson</artifactId>
	      <version>2.2.2</version>
	    </dependency>

	[finalize list of dependencies]

	This adds dependencies for...

	* eventhubs-storm-spout - the Event Hub spout we compiled earlier
	* signalr-client-sdk - the SignalR client we compiled earlier
	* gson - this is a dependency of the SignalR client, and will also be used to create JSON when writing to SignalR.
	* storm-core - provides core functionality for Storm applications
	* slf4j - provides logging capabilities

	> [WACOM.NOTE] Note that some dependencies are marked with a scope of **provided** to indicate that these dependencies should be downloaded from the Maven repository and used to build and test the application locally, but that they will also be available in your runtime environment and do not need to be compiled and included in the JAR created by this project.

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
		    <resources>
		      <resource>
		        <directory>${basedir}/conf</directory>
		        <filtering>false</filtering>
		        <includes>
		          <include>Config.properties</include>
		        </includes>
		      </resource>
		    </resources>
		  </build>

	[finalize plugins list]

	This tells Maven to do the following when building the project:

	* Include the **/conf/Config.properties** file. This file will be created later, but it will contain configuration information for connecting to Azure Event Hub.
	* Use the **maven-compiler-plugin** to compile the application.
	* Use the **maven-shade-plugin** to build an uberjar or fat jar, which contains this project and any required dependencies.
	* Use the **exec-maven-plugin**, which allows you to run the application locally without a Hadoop cluster.

###Add the Event Hub spout configuration file

1. In the **Temperature** directory, create a new directory named **conf**.

2. In the **conf** directory, create a new file named **Config.properties** and add the following as the file contents.

		eventhubspout.username = <the policy name>

		eventhubspout.password = <the policy SAS key>
		
		eventhubspout.namespace = <the namespace of your event hub>
		
		eventhubspout.entitypath = temperature
		
		eventhubspout.partitions.count = < the number of partitions>
		
		# if not provided, will use storm's zookeeper settings
		# zookeeper.connectionstring=localhost:2181
		
		eventhubspout.checkpoint.interval = 10
		
		eventhub.receiver.credits = 1024

	[add text about getting the values above from the create event hub steps]

3. Save the file.

###Add the bolts



###Define the topology

1. In the **\temperature\src\main\java\com\microsoft\examples\temperature** directory, create a new file named **TemperatureTopology.java**.

2. Open the **TemperatureTopology.java** file and use the following as the contents.

		[code goes here]

##Test locally

mvn compile exec:java -Dstorm.topology=com.microsoft.examples.Temperature