<properties
   pageTitle="Analyze sensor data with Apache Storm and HBase | Microsoft Azure"
   description="Learn how to connect to Apache Storm with a virtual network. Use Storm with HBase to process sensor data from an event hub and visualize it with D3.js."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="09/20/2016"
   ms.author="larryfr"/>

# Analyze sensor data with Apache Storm, Event Hub, and HBase in HDInsight (Hadoop) 

Learn how to use Apache Storm on HDInsight to process sensor data from Azure Event Hub, store it into Apache HBase on HDInsight, and visualize it by using D3.js running as an Azure Web App.

The Azure Resource Manager template used in this document demonstrates how to create multiple Azure resources in a resource group. Specifically, it creates an Azure Virtual Network, two HDInsight clusters (Storm and HBase,) and an Azure Web App. A node.js implementation of a real-time web dashboard is automatically deployed to the web app.

> [AZURE.NOTE] The information in this document, and the example provided, have been tested using Linux-based HDInsight 3.3 and 3.4 cluster versions.

## Prerequisites

* An Azure subscription. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

    > [AZURE.IMPORTANT] You do not need an existing HDInsight cluster; the steps in this document will create the following resources:
    >
    > * An Azure Virtual Network
    > * A Storm on HDInsight cluster (Linux-based, 2 worker nodes)
    > * An HBase on HDInsight cluster (Linux-based, 2 worker nodes)
    > * An Azure Web App that hosts the web dashboard

* [Node.js](http://nodejs.org/): This is used to preview the web dashboard locally on your development environment.

* [Java and the JDK 1.7](http://www.oracle.com/technetwork/java/javase/downloads/index.html): Used to develop the Storm topology.

* [Maven](http://maven.apache.org/what-is-maven.html): Used to build and compile the project.

* [Git](http://git-scm.com/): Used to download the project from GitHub.

* An __SSH__ client: Used to connect to the Linux-based HDInsight clusters. For more information on using SSH with HDInsight, see the following documents.

    * [Use SSH with HDInsight from a Windows client](hdinsight-hadoop-linux-use-ssh-windows.md)

    * [Use SSH with HDInsight from a Linux, Unix, or Mac client](hdinsight-hadoop-linux-use-ssh-unix.md)

    > [AZURE.NOTE] You must also have access to the `scp` command, which is used to copy files between your local development environment and the HDInsight cluster using SSH.

## Architecture

![architecture diagram](./media/hdinsight-storm-sensor-data-analysis/devicesarchitecture.png)

This example consists of the following components:

* **Azure Event Hubs**: Contains data that is collected from sensors. For this example, an application is provided that generates the data.

* **Storm on HDInsight**: Provides real-time processing of data from Event Hub.

* **HBase on HDInsight**: Provides a persistent NoSQL data store for data after it has been processed by Storm.

* **Azure Virtual Network service**: Enables secure communications between the Storm on HDInsight and HBase on HDInsight clusters.

    > [AZURE.NOTE] A virtual network is required in order to use the Java HBase client API, as it is not exposed over the public gateway for HBase clusters. Installing HBase and Storm clusters into the same virtual network allows the Storm cluster (or any other system on the virtual network,) to directly access HBase using client API.

* **Dashboard website**: An example dashboard that charts data in real time.

	* The website is implemented in Node.js, so it can run on any client operating system for testing, or it can be deployed to Azure Websites.

	* [Socket.io](http://socket.io/) is used for real-time communication between the Storm topology and the website.

		> [AZURE.NOTE] This is an implementation detail. You can use any communications framework, such as raw WebSockets or SignalR.

	* [D3.js](http://d3js.org/) is used to graph the data that is sent to the website.

The topology reads data from Event Hub by using the [org.apache.storm.eventhubs.spout.EventHubSpout](http://storm.apache.org/releases/0.10.1/javadocs/org/apache/storm/eventhubs/spout/class-use/EventHubSpout.html) class, and writes data into HBase using the [org.apache.storm.hbase.bolt.HBaseBolt](https://storm.apache.org/javadoc/apidocs/org/apache/storm/hbase/bolt/class-use/HBaseBolt.html) class. Communication with the website is accomplished by using [socket.io-client.java](https://github.com/nkzawa/socket.io-client.java).

The following is a diagram of the topology.

![topology diagram](./media/hdinsight-storm-sensor-data-analysis/sensoranalysis.png)

> [AZURE.NOTE] This is a very simplified view of the topology. At run time, an instance of each component is created for each partition for the Event Hub that is being read. These instances are distributed across the nodes in the cluster, and data is routed between them as follows:
>
> * Data from the spout to the parser is load balanced.
> * Data from the parser to the Dashboard and HBase is grouped by Device ID, so that messages from the same device always flow to the same component.

### Topology components

* **EventHub Spout**: The spout is provided as part of Apache Storm version 0.10.0 and higher.

    > [AZURE.NOTE] The Event Hubs spout used in this example requires a Storm on HDInsight cluster version 3.3 or 3.4. For information on how to use Event Hubs with an older version of Storm on HDInsight, see [Process events from Azure Event Hubs with Storm on HDInsight](hdinsight-storm-develop-java-event-hub-topology.md).

* **ParserBolt.java**: The data that is emitted by the spout is raw JSON, and occasionally more than one event is emitted at a time. This bolt demonstrates how to read the data emitted by the spout, and emit it to a new stream as a tuple that contains multiple fields.

* **DashboardBolt.java**: This demonstrates how to use the Socket.io client library for Java to send data in real-time to the web dashboard.

This example uses the [Flux](https://storm.apache.org/releases/0.10.0/flux.html) framework, so the topology definition is contained in YAML files. There are two:

* __no-hbase.yaml__ - Use this file when testing the topology in your development environment. It doesn't use HBase components, since you can't access the HBase Java API from outside the virtual network the cluster lives in.

* __with-hbase.yaml__ - Use this file when deploying the topology to the Storm cluster. It uses HBase components since it runs in the same virtual network as the HBase cluster.

## Prepare your environment

Before you use this example, you must create an Azure Event Hub, which the Storm topology reads from.

### Configure Event Hub

Event Hub is the data source for this example. Use the following steps to create a new Event Hub.

1. From the [Azure portal](https://portal.azure.com), select **+ New** -> __Internet of Things__ -> __Event Hubs__.

2. On the __Create Namespace__ blade, perform the following tasks:

    1. Enter a __Name__ for the namespace.
    2. Select a pricing tier. __Basic__ is sufficient for this example.
    3. Select the Azure __Subscription__ to use.
    4. Either select an existing resource group or create a new one.
    5. Select the __Location__ for the Event Hub.
    6. Select __Pin to dashboard__, and then click __Create__.

3. When the creation process completes, the Event Hubs blade for your namespace is displayed. From here, select __+ Add Event Hub__. On the __Create Event Hub__ blade, enter a name of __sensordata__ and then select __Create__. Leave the other fields at the default values.

4. From the Event Hubs blade for your namespace, select __Event Hubs__. Select the __sensordata__ entry.

5. From the blade for the sensordata Event Hub, select __Shared access policies__. Use the __+ Add__ link to add the following policies:


	| Policy name | Claims |
    | ----- | ----- |
	| devices | Send |
	| storm | Listen |

5. Select both policies and make a note of the __PRIMARY KEY__ value. You will need the value for both policies in future steps.

## Download and configure the project

Use the following to download the project from GitHub.

	git clone https://github.com/Blackmist/hdinsight-eventhub-example

After the command completes, you will have the following directory structure:

	hdinsight-eventhub-example/
		TemperatureMonitor/ - this contains the topology
			resources/
                log4j2.xml - set logging to minimal
                no-hbase.yaml - topology definition for local testing
                with-hbase.yaml - topology definition that uses HBase in a virutal network
			src/ - the Java bolts
            dev.properties - contains configuration values for your environment
		dashboard/nodejs/ - this is the node.js web dashboard
		SendEvents/ - utilities to send fake sensor data

> [AZURE.NOTE] This document does not go in to full details of the code included in this sample; however, the code is fully commented.

Open the **hdinsight-eventhub-example/TemperatureMonitor/dev.properties** file and add your Event Hub information to the following lines:

    eventhub.read.policy.name: storm
    eventhub.read.policy.key: KeyForTheStormPolicy
    eventhub.namespace: YourNamespace
    eventhub.name: sensordata

> [AZURE.NOTE] This example assumes that you used __storm__ as the name of the policy that has a __Listen__ claim, and that your Event Hub is named __sensordata__.

 Save the file after you add this information.

## Compile and test locally

Before testing, you must start the dashboard to view the output of the topology and generate data to store in Event Hub.

> [AZURE.IMPORTANT] The HBase component of this topology is not active when testing locally, as the Java API for the HBase cluster cannot be accessed from outside the Azure Virtual Network that contains the clusters.

### Start the web application

1. Open a new command prompt or terminal, and change directories to the **hdinsight-eventhub-example/dashboard**, then use the following command to install the dependencies needed by the web application:

		npm install

2. Use the following command to start the web application:

		node server.js

	You should see a message similar to the following:

		Server listening at port 3000

2. Open a web browser and enter **http://localhost:3000/** as the address. You should see a page similar to the following:

	![web dashboard](./media/hdinsight-storm-sensor-data-analysis/emptydashboard.png)

	Leave this command prompt or terminal open. After testing, use Ctrl-C to stop the web server.

### Start generating data

> [AZURE.NOTE] The steps in this section use Node.js so that they can be used on any platform. For other language examples, see the **SendEvents** directory.

1. Open a new command prompt, shell, or terminal, and change directories to **hdinsight-eventhub-example/SendEvents/nodejs**, then use the following command to install the dependencies needed by the application:

		npm install

2. Open the **app.js** file in a text editor and add the Event Hub information you obtained earlier:

		// ServiceBus Namespace
		var namespace = 'YourNamespace';
		// Event Hub Name
		var hubname ='sensordata';
		// Shared access Policy name and key (from Event Hub configuration)
		var my_key_name = 'devices';
		var my_key = 'YourKey';
    
    > [AZURE.NOTE] This example assumes that you have used __sensordata__ as the name of your Event Hub, and __devices__ as the name of the policy that has a __Send__ claim.

2. Use the following command to insert new entries in Event Hub:

		node app.js

	You should see several lines of output that contain the data sent to Event Hub. These will appear similar to the following:

		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"0","Temperature":7}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"1","Temperature":39}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"2","Temperature":86}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"3","Temperature":29}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"4","Temperature":30}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"5","Temperature":5}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"6","Temperature":24}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"7","Temperature":40}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"8","Temperature":43}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":"9","Temperature":84}

### Start the topology

2. Open a new command prompt, shell, or terminal and change directories to __hdinsight-eventhub-example/TemperatureMonitor__, and then use the following command to start the topology:

        mvn compile exec:java -Dexec.args="--local -R /no-hbase.yaml --filter dev.properties"
    
    If you are using PowerShell, use the following instead:

        mvn compile exec:java "-Dexec.args=--local -R /no-hbase.yaml --filter dev.properties"

    > [AZURE.NOTE] If you are on a Linux/Unix/OS X system, and have [installed Storm in your development environment](http://storm.apache.org/releases/0.10.0/Setting-up-development-environment.html), you can use the following commands instead:
    >
    > `mvn compile package`
    > `storm jar target/WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local -R /no-hbase.yaml`

	This starts the topology defined in the __no-hbase.yaml__ file in local mode. The values contained in the __dev.properties__ file provide the connection information for Event Hubs. Once started, the topology reads entries from Event Hub, and sends them to the dashboard running on your local machine. You should see lines appear in the web dashboard, similar to the following:

	![dashboard with data](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

3. While the dashboard is running, use the `node app.js` command from the previous steps to send new data to Event Hubs. Because the temperature values are randomly generated, the graph should update to show large changes in temperature.

    > [AZURE.NOTE] You must be in the __hdinsight-eventhub-example/SendEvents/Nodejs__ directory when using the `node app.js` command.

3. After verifying that this works, stop the topology using Ctrl+C. You can use Ctrl+C to stop the local web server also.

## Create a Storm and HBase cluster

In order to run the topology on HDInsight, and to enable the HBase bolt, you must create a new Storm cluster and HBase cluster. The steps in this section use an [Azure Resource Manager template](../resource-group-template-deploy.md) to create a new Azure Virtual Network and a Storm and HBase cluster on the virtual network. The template also creates an Azure Web App and deploys a copy of the dashboard into it.

> [AZURE.NOTE] A virtual network is used so that the topology running on the Storm cluster can directly communicate with the HBase cluster using the HBase Java API.

The Resource Manager template used in this document is located in a public blob container at __https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-hbase-storm-cluster-in-vnet.json__.

1. Click the following button to sign in to Azure and open the Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hbase-storm-cluster-in-vnet.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. From the **Parameters** blade, enter the following:

    ![HDInsight parameters](./media/hdinsight-storm-sensor-data-analysis/parameters.png)
    
    * **BASECLUSTERNAME**: This value will be used as the base name for the Storm and HBase clusters. For example, entering __hdi__ will create a Storm cluster named __storm-hdi__ and an HBase cluster named __hbase-hdi__.
    * __CLUSTERLOGINUSERNAME__: The admin user name for the Storm and HBase clusters.
    * __CLUSTERLOGINPASSWORD__: The admin user password for the Storm and HBase clusters.
    * __SSHUSERNAME__: The SSH user to create for the Storm and HBase clusters.
    * __SSHPASSWORD__: The password for the SSH user for the Storm and HBase clusters.
    * __LOCATION__: The region that the clusters will be created in.
    
    Click __OK__ to save the parameters.
    
3. Use the __Resource group__ section to create a new resource group or select an existing one.

4. In the __Resource group location__ dropdown menu, select the same location as you selected for the __LOCATION__ parameter.

5. Select __Legal terms__, and then select __Create__.

6. Finally, check __Pin to dashboard__ and then select __Create__. It will take about 20 minutes to create the clusters.

Once the resources have been created, you will be redirected to a blade for the resource group that contains the clusters and web dashboard.

![Resource group blade for the vnet and clusters](./media/hdinsight-storm-sensor-data-analysis/groupblade.png)

> [AZURE.IMPORTANT] Notice that the names of the HDInsight clusters are __storm-BASENAME__ and __hbase-BASENAME__, where BASENAME is the name you provided to the template. You will use these names in later steps when connecting to the clusters. Also note that the name of the dashboard site is __basename-dashboard__. You will use this later when viewing the dashboard.

## Configure the Dashboard bolt

In order to send data to the dashboard deployed as a web app, you must modify the following line in the __dev.properties__ file:

    dashboard.uri: http://localhost:3000

Change `http://localhost:3000` to `http://BASENAME-dashboard.azurewebsites.net` and save the file. Replace __BASENAME__ with the base name you provided in the previous step. You can also use the resource group created previously to select the dashboard and view the URL.

## Create the HBase table

In order to store data in HBase, we must first create a table. You generally want to pre-create resources that Storm needs to write to, as trying to create resources from inside a Storm topology can result in multiple, distributed copies of the code trying to create the same resource. Create the resources outside the topology and just use Storm for reading/writing and analytics.

1. Use SSH to connect to the HBase cluster using the SSH user and password you supplied to the template during cluster creation. For example, if connecting using the `ssh` command, you would use the following syntax:

        ssh USERNAME@hbase-BASENAME-ssh.azurehdinsight.net
    
    In this command, replace __USERNAME__ with the SSH user name you provided when creating the cluster, and __BASENAME__ with the base name you provided. When prompted, enter the password for the SSH user.

2. From the SSH session, start the HBase shell.

    	hbase shell
	
	Once the shell has loaded, you will see an `hbase(main):001:0>` prompt.

3. From the HBase shell, enter the following command to create a table to store the sensor data:

    	create 'SensorData', 'cf'

4. Verify that the table has been created by using the following command:

    	scan 'SensorData'
		
	This returns information similar to the following example, indicating that there are 0 rows in the table.
	
		ROW                   COLUMN+CELL                                       0 row(s) in 0.1900 seconds

5. Enter the following to exit the HBase shell:

		exit

## Configure the HBase bolt

To write to HBase from the Storm cluster, you must provide the HBase bolt with the configuration details of your HBase cluster. The easiest way to do this is to download the __hbase-site.xml__ from the cluster and include it in your project. You must also uncomment several dependencies in the __pom.xml__ file, which load the storm-hbase component and required dependencies.

> [AZURE.IMPORTANT] You must also download the storm-hbase.jar file provided on your Storm on HDInsight cluster 3.3 or 3.4 cluster; this version is compiled to work with HBase 1.1.x, which is used for HBase on HDInsight 3.3 and 3.4 clusters. If you use a storm-hbase component from elsewhere, it may be compiled against an older version of HBase.

### Download the hbase-site.xml

From a command prompt, use SCP to download the __hbase-site.xml__ file from the cluster. In the following example, replace __USERNAME__ with the SSH user you provided when creating the cluster, and __BASENAME__ with the base name you provided earlier. When prompted, enter the password for the SSH user. Replace the `/path/to/TemperatureMonitor/resources/hbase-site.xml` with the path to this file in the TemperatureMonitor project.

    scp USERNAME@hbase-BASENAME-ssh.azurehdinsight.net:/etc/hbase/conf/hbase-site.xml /path/to/TemperatureMonitor/resources/hbase-site.xml

This will download the __hbase-site.xml__ to the path specified.

### Download and install the storm-hbase component

1. From a command prompt, use SCP to download the __storm-hbase.jar__ file from the Storm cluster. In the following example, replace __USERNAME__ with the SSH user you provided when creating the cluster, and __BASENAME__ with the base name you provided earlier. When prompted, enter the password for the SSH user.

        scp USERNAME@storm-BASENAME-ssh.azurehdinsight.net:/usr/hdp/current/storm-client/contrib/storm-hbase/storm-hbase*.jar .

    This will download a file named `storm-hbase-####.jar`, where #### is the version number of Storm for this cluster. Make a note of this number, as it is used later.

2. Use the following command to install this component into the local Maven repository on your development environment. This enables Maven to find the package when compiling the project. Replace __####__ with the version number included in the file name.

        mvn install:install-file -Dfile=storm-hbase-####.jar -DgroupId=org.apache.storm -DartifactId=storm-hbase -Dversion=#### -Dpackaging=jar
    
    If you are using PowerShell, use the following command:

        mvn install:install-file "-Dfile=storm-hbase-####.jar" "-DgroupId=org.apache.storm" "-DartifactId=storm-hbase" "-Dversion=####" "-Dpackaging=jar"

### Enable the storm-hbase component in the project

1. Open the __TemperatureMonitor/pom.xml__ file and delete the following lines:

        <!-- uncomment this section to enable the hbase-bolt
        end comment for hbase-bolt section -->
    
    > [AZURE.IMPORTANT] Only delete these two lines; do not delete any of the lines between them.
    
    This enables several components that are needed when communicating with HBase using the hbase bolt.

2. Find the following lines, and then replace __####__ with the version number of the storm-hbase file you downloaded earlier.

        <dependency>
            <groupId>org.apache.storm</groupId>
            <artifactId>storm-hbase</artifactId>
            <version>####</version>
        </dependency>

    > [AZURE.IMPORTANT] The version number must match the version you used when installing the component into the local Maven repository, as Maven uses this information to load the component when building the project.

2. Save the __pom.xml__ file.

## Build, package and deploy the solution to HDInsight

In your development environment, use the following steps to deploy the Storm topology to the storm cluster.

1. From the __TemperatureMonitor__ directory, use the following command to perform a new build and create a JAR package from your project:

		mvn clean compile package

	This will create a file named **TemperatureMonitor-1.0-SNAPSHOT.jar** in the **target** directory of your project.

2. Use scp to upload the __TemperatureMonitor-1.0-SNAPSHOT.jar__ file to your Storm cluster. In the following example, replace __USERNAME__ with the SSH user you provided when creating the cluster, and __BASENAME__ with the base name you provided earlier. When prompted, enter the password for the SSH user.

        scp target\TemperatureMonitor-1.0-SNAPSHOT.jar USERNAME@storm-BASENAME-ssh.azurehdinsight.net:TemperatureMonitor-1.0-SNAPSHOT.jar
    
    > [AZURE.NOTE] It may take several minutes to upload the file, as it will be several megabytes in size.

    Use scp to upload the __dev.properties__ file, as this contains the information used to connect to Event Hubs and the dashboard.

        scp dev.properties USERNAME@storm-BASENAME-ssh.azurehdinsight.net:dev.properties

3. Once the files have been uploaded, connect to the cluster using SSH.

        ssh USERNAME@storm-BASENAME-ssh.azurehdinsight.net

4. From the SSH session, use the following command to start the topology.

        storm jar TemperatureMonitor-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /with-hbase.yaml --filter dev.properties
    
    This starts the topology using the topology definition in the __with-hbase.yaml__ file, and the configuration values in the __dev.properties__ file.

3. After the topology has started, open a browser to the website you published on Azure, then use the `node app.js` command to send data to Event Hub. You should see the web dashboard update to display the information.

	![dashboard](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

## View HBase data

After you have submitted data to the topology using `node app.js`, use the following steps to connect to HBase and verify that the data has been written to the table you created earlier.

1. Use SSH to connect to the HBase cluster.

        ssh USERNAME@hbase-BASENAME-ssh.azurehdinsight.net

2. From the SSH session, start the HBase shell.

    	hbase shell
	
	Once the shell has loaded, you will see an `hbase(main):001:0>` prompt.

2. View rows from the table:

    	scan 'SensorData'
		
	This should return information similar to the following, indicating that there are 0 rows in the table.
	
		hbase(main):002:0> scan 'SensorData'
        ROW                             COLUMN+CELL
        \x00\x00\x00\x00               column=cf:temperature, timestamp=1467290788277, value=\x00\x00\x00\x04
        \x00\x00\x00\x00               column=cf:timestamp, timestamp=1467290788277, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x01               column=cf:temperature, timestamp=1467290788348, value=\x00\x00\x00M
        \x00\x00\x00\x01               column=cf:timestamp, timestamp=1467290788348, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x02               column=cf:temperature, timestamp=1467290788268, value=\x00\x00\x00R
        \x00\x00\x00\x02               column=cf:timestamp, timestamp=1467290788268, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x03               column=cf:temperature, timestamp=1467290788269, value=\x00\x00\x00#
        \x00\x00\x00\x03               column=cf:timestamp, timestamp=1467290788269, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x04               column=cf:temperature, timestamp=1467290788356, value=\x00\x00\x00>
        \x00\x00\x00\x04               column=cf:timestamp, timestamp=1467290788356, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x05               column=cf:temperature, timestamp=1467290788326, value=\x00\x00\x00\x0D
        \x00\x00\x00\x05               column=cf:timestamp, timestamp=1467290788326, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x06               column=cf:temperature, timestamp=1467290788253, value=\x00\x00\x009
        \x00\x00\x00\x06               column=cf:timestamp, timestamp=1467290788253, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x07               column=cf:temperature, timestamp=1467290788229, value=\x00\x00\x00\x12
        \x00\x00\x00\x07               column=cf:timestamp, timestamp=1467290788229, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x08               column=cf:temperature, timestamp=1467290788336, value=\x00\x00\x00\x16
        \x00\x00\x00\x08               column=cf:timestamp, timestamp=1467290788336, value=2015-02-10T14:43.05.00320Z
        \x00\x00\x00\x09               column=cf:temperature, timestamp=1467290788246, value=\x00\x00\x001
        \x00\x00\x00\x09               column=cf:timestamp, timestamp=1467290788246, value=2015-02-10T14:43.05.00320Z
        10 row(s) in 0.1800 seconds

    > [AZURE.NOTE] This scan operation will only return a maximum of 10 rows from the table.

## Delete your clusters

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

To delete the clusters, storage, and web app at one time, delete the resource group that contains them.

## Next steps

You have now learned how to use Storm to read data from Event Hubs, store it into HBase, and visualize the information on an external dashboard by using Socket.io and D3.js.

* For more examples of Storm topologies with HDInsight, see:

    * [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)

* For more information about Apache Storm, see the [Apache Storm](https://storm.incubator.apache.org/) site.

* For more information about HBase on HDInsight, see the [HBase with HDInsight Overview](hdinsight-hbase-overview.md).

* For more information about Socket.io, see the [socket.io](http://socket.io/) site.

* For more information about D3.js, see [D3.js - Data Driven Documents](http://d3js.org/).

* For information about creating topologies in Java, see [Develop Java topologies for Apache Storm on HDInsight](hdinsight-storm-develop-java-topology.md).

* For information about creating topologies in .NET, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md).

[azure-portal]: https://portal.azure.com
