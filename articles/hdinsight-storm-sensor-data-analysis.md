<properties
   pageTitle="Analyzing sensor data with Apache Storm on HDInsight, Event Hub, and HBase | Azure"
   description="Learn how to use Apache Storm and HBase on HDInsight to process data from Azure Event Hub."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

#Analyzing sensor data with Storm and HBase in HDInsight (Hadoop)

Learn how to use Apache Storm on HDInsight to process sensor data from Azure Event Hub, and visualize it using D3.js. This document also describes how to use Azure Virtual Network to connect Storm on HDInsight with HBase on HDInsight, and store data from the topology into HBase.

##Prerequisites

* An Azure subscription

* An <a href="../hdinsight-storm-getting-started/" target="_blank">Apache Storm on HDInsight cluster</a>

* <a href="http://nodejs.org/" target="_blank">Node.js</a> - used for the web dashboard and to send sensor data to Event Hub.

* <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html" target="_blank">Java and the JDK 1.7</a>

* <a href="http://maven.apache.org/what-is-maven.html" target="_blank">Maven</a>

* <a href="http://git-scm.com/" target="_blank">Git</a>

> [AZURE.NOTE] Java, the JDK, Maven, and Git are also available through the [Chocolatey NuGet](http://chocolatey.org/) package manager.

##Architecture

![architecture diagram](./media/hdinsight-storm-sensor-data-analysis/devicesarchitecture.png)

This example consists of the following components:

* **Azure Event Hub** - provides data collected from sensors. For this example, an application is provided that generates fake data

* **Storm on HDInsight** - provides real-time processing of data from Event Hub

* **HBase on HDInsight** (optional) - provides a persistent nosql data store

* **Azure Virtual Network** (optional, required if using HBase) - enables secure communications between the Storm on HDInsight and HBase on HDInsight clusters

* **Dashboard website** - An example dashboard that charts data in real-time

	* The website is implemented in Node.js, so can run on any client OS for testing or be deployed to Azure Websites

	* <a href="http://socket.io/" target="_blank">Socket.io</a> is used for real-time communication between the Storm topology and website

		> [AZURE.NOTE] This is an implementation detail - you can use any communications framework such as raw WebSockets or SignalR

	* <a href="http://d3js.org/" target="_blank">D3.js</a> is used to graph the data sent to the web site

The topology reads data from Event Hub using the **com.microsoft.eventhubs.spout.EventHubSpout** class, which is provided on the Storm on HDInsight cluster. Communication with the website is accomplished using <a href="https://github.com/nkzawa/socket.io-client.java" target="_blank">https://github.com/nkzawa/socket.io-client.java</a>.

Optionally, communication with HBase is accomplished using the <a href="https://storm.apache.org/javadoc/apidocs/org/apache/storm/hbase/bolt/class-use/HBaseBolt.html" target="_blank">org.apache.storm.hbase.bolt.HBaseBolt</a>, which is provided as part of Storm.

The following is a diagram of the topology.

![topology diagram](./media/hdinsight-storm-sensor-data-analysis/sensoranalysis.png)

> [AZURE.NOTE] This is a very simplified view of the topology - at runtime, an instance of each component is created for each partition for the Event Hub that is being read from. These instances are distributed across the nodes in the cluster, and data is routed between them as follows:
>
> * Data from the spout to the parser is load balanced
> * Data from the parser to the Dashboard and HBase (if used) is grouped by Device ID, so that messages from the same device always flow to the same component

###Components

* **EventHub Spout** - the spout is provided with your HDInsight cluster. Source code is not currently available

* **ParserBolt.java** - the data emitted by the spout is raw JSON, and occasionally more than one event is emitted at a time. This bolt demonstrates how to read the data emitted by the spout, and emit it to a new stream as a tuple containing multiple fields.

* **DashboardBolt.java** - this demonstrates how to use the Socket.io client library for Java to send data in real-time to the web dashboard.

##Prepare your environment

Before using this example, you must create an Azure Event Hub, which the Storm topology reads from. You must also create a Storm on HDInsight topology, as the component used to read data from Event Hub is only available on the cluster.

> [AZURE.NOTE] Eventually the Event Hub spout will be available from Maven.

###Configure Event Hub

Event Hub is the data source for this example. Use the following steps to create a new Event Hub.

1. From the [Azure Portal](https://manage.windowsazure.com), select **NEW | Service Bus | Event Hub | Custom Create**.

2. On the **Add a new Event Hub** dialog, enter an **Event Hub Name**, select the **Region** to create the hub in, and either create a new namespace or select an existing one. Finally, click the **Arrow**.

2. On the **Configure Event Hub** dialog, enter the **Partition count** and **Message Retention** values. For this example, use a partition count of 10 and a message retention of 1.

3. Once the event hub has been created, select the namespace, then select **Event Hubs**. Finally, select the event hub you created earlier.

4. Select **Configure**, then create two new access policies using the following information.

	<table>
	<tr><th>Name</th><th>Permissions</th></tr>
	<tr><td>devices</td><td>Send</td></tr>
	<tr><td>storm</td><td>Listen</td></tr>
	</table>

	After creating permissions, select the **Save** icon at the bottom of the page. This creates the shared access policies that will be used to send messages to, and read messages from, this hub.

5. After saving the policies, use the **Shared access key generator** at the bottom of the page to retrieve the key for both the **devices** and **storm** policies. Save these as they will be used later.

###Create the Storm on HDInsight cluster

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com/)

2. Click **HDInsight** on the left, and then **+NEW** in the lower left corner of the page.

3. Click on the HDInsight icon in the second column, and then select **Custom**.

4. On the **Cluster Details** page, enter the name of the new cluster, and select **Storm** for the **Cluster Type**. Select the arrow to continue.

5. Enter 1 for the number of **Data Nodes** to use for this cluster.

	> [AZURE.NOTE] To minimize the cost for the cluster used for this article, reduce the **Cluster Size** to 1, and delete the cluster after you have finished using it.

6. Enter the administrator **User Name** and **Password**, then select the arrow to continue.

4. For **Storage Account**, select **Create New Storage** or select an existing storage account. Select or enter the **Account Name** and **Default container** to use. Click on the check icon on the lower left to create the Storm cluster.

5. Once the cluster has been created, select the cluster in the portal and select **Configure** at the top of the cluster **Dashboard**.

3. At the bottom of the page, select **Enable Remote**. When prompted enter a user name, password, and a date when Remote Desktop access will expire. Click the checkmark to enable Remote Desktop.

4. Once Remote Desktop has been enabled, you can select **Connect** at the bottom of the page. Follow the prompts to connect to the cluster.

1. Once connected, copy the **%STORM_HOME%\examples\eventhubspout\eventhubs-storm-spout-0.9-jar-with-dependencies.jar** file to your local development environment. This contains the **events-storm-spout**.

7. Use the following command to install the **eventhubs-storm-spout-0.9-jar-with-dependencies.jar** file you downloaded previously into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target/eventhubs-storm-spout-0.9-jar-with-dependencies.jar -DgroupId=com.microsoft.eventhubs -DartifactId=eventhubs-storm-spout -Dversion=0.9 -Dpackaging=jar

##Download and configure the project

Use the following to download the project from GitHub.

	git clone https://github.com/Blackmist/hdinsight-eventhub-example

After the command completes, you will have the following directory structure:

	hdinsight-eventhub-example/
		TemperatureMonitor/ - this is the Java topology
			conf/
				Config.properties
				hbase-site.xml
			src/
			test/
			dashboard/ - this is the node.js web dashboard
			SendEvents/ - utilities to send fake sensor data

> [AZURE.NOTE] This document does not go into full details of the code included in this sample, however the code is fully commented.

Open the **Config.properties** file and add the information you previously used when creating the Event Hub. Save the file after adding this information.

	eventhubspout.username = storm

	eventhubspout.password = <the key of the 'storm' policy>

	eventhubspout.namespace = <the event hub namespace>

	eventhubspout.entitypath = <the event hub name>

	eventhubspout.partitions.count = <the number of partitions for the event hub>

	# if not provided, will use storm's zookeeper settings
	# zookeeper.connectionstring=localhost:2181

	eventhubspout.checkpoint.interval = 10

	eventhub.receiver.credits = 1024

##Compile and test locally

Before testing, you must start the dashboard to view the output of the topology, and generate data to store in Event Hub.

###Start the web application

1. Open a new command prompt or terminal, and change directories to the **hdinsight-eventhub-example/dashboard**, then use the following to install dependencies needed by the web application.

		npm install

2. Use the following command to start the web application.

		node server.js

	You should see a message similar to the following:

		Server listening at port 3000

2. Open a web browser and enter http://localhost:3000/ as the address. You should see a page similar to the following.

	![web dashboard](./media/hdinsight-storm-sensor-data-analysis/emptydashboard.png)

	Leave this command prompt or terminal open. After testing, use Ctrl-C to stop the web server.

###Start generating data

> [AZURE.NOTE] The steps in this section use Node.js so that they can be run on any platform. For other language examples, see the **SendEvents** directory.


1. Open a new command prompt or terminal, and change directories to the **hdinsight-eventhub-example/SendEvents/nodejs**, then use the following to install dependencies needed by the application.

		npm install

2. Open the **app.js** file in a text editor and add the Event Hub information you obtained earlier.

		// ServiceBus Namespace
		var namespace = 'servicebusnamespace';
		// Event Hub Name
		var hubname ='eventhubname';
		// Shared access Policy name and key (from Event Hub configuration)
		var my_key_name = 'devices';
		var my_key = 'key';

2. Use the following command to insert new entries in Event Hub.

		node app.js

	You should see several lines of output that contain the data sent to Event Hub. These will appear similar to the following.

		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":0,"Temperature":7}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":1,"Temperature":39}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":2,"Temperature":86}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":3,"Temperature":29}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":4,"Temperature":30}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":5,"Temperature":5}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":6,"Temperature":24}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":7,"Temperature":40}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":8,"Temperature":43}
		{"TimeStamp":"2015-02-10T14:43.05.00320Z","DeviceId":9,"Temperature":84}

###Start the topology

2. Start the topology locally using the following command

	mvn compile exec:java -Dstorm.topology=com.microsoft.examples.Temperature

	This will start the topology, read files from Event Hub, and send them to the dashboard running in Azure Websites. You should see lines appear in the web dashboard, similar to the following:

	![dashboard with data](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

3. While the dashboard is running, use the `node app.js` command from the previous steps to send new data to the dashboard. Since the temperature values are randomly generated, the graph should update to show the new values.

3. After verifying that this works, stop the topology by entering Ctrl-C. To stop the SendEvent app, select the window and press any key. You can use Ctrl-C to stop the web server also.

##Package and deploy the topology to HDInsight

On your development environment, use the following steps to run the Temperature topology on your HDInsight Storm Cluster.

###Publish the web site dashboard

1. To deploy the dashboard to an Azure Website, follow the steps in <a href="../web-sites-nodejs-develop-deploy-mac/" target="_blank">Build and deploy a Node.js website to Azure</a>. Note the URL of the website, which will be similar to **mywebsite.azurewebsites.net**.

2. Once the Website has been created, go to the site in the Azure Portal and select the **Configure** tab. Enable **Web Sockets**, and then click **Save** at the bottom of the page.

2. Open **hdinsight-eventhub-example\TemperatureMonitor\src\main\java\com\microsoft\examples\bolts\DashboardBolt.java** and change the following line to point to the URL of the published dashboard.

		socket = IO.socket("http://mywebsite.azurewebsites.net");

3. Save the **DashboardBolt.java** file.

###Package and deploy the topology

1. Use the following command to create a JAR package from your project.

		mvn package

	This will create a file named **TemperatureMonitor-1.0-SNAPSHOT.jar** in the **target** directory of your project.

2. Follow the steps in <a href="../hdinsight-storm-deploy-monitor-topology/" target="_blank">Deploy and manage Storm topologies</a> to upload and start the topology on your Storm on HDInsight cluster using the **Storm Dashboard**.

3. Once the topology has started, open a browser to the website you published to Azure, then use the `node app.js` command to send data to Event Hub. You should see the web dashboard update to display the information.

	![dashboard](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

##Optional: Use HBase

To use Storm and HBase together, you must create an Azure Virtual Network and then create a Storm and HBase cluster within the network.

###Create an Azure Virtual Network (optional)

If you plan on using HBase with this example, you must create an Azure Virtual Network that will contain both a Storm on HDInsight, as well as HBase on HDInsight clusters.

1. Sign in to the [Azure Management portal](https://manage.windowsazure.com).

2. On the bottom of the page, click **+NEW**, click **Network Services**, click **Virtual Network**, and then click **Quick Create**.

3. Type or select the following values:

	- **Name**: The name of your virtual network.

	- **Address space**: Choose an address space for the virtual network that is large enough to provide addresses for all nodes in the cluster. Otherwise the provision will fail.

	- **Maximum VM count**: Choose one of the Maximum VM counts.

	- **Location**: The location must be the same as the HBase cluster that you will create.

	- **DNS server**: This article uses internal DNS server provided by Azure, therefore you can choose **None**. More advanced networking configuration with custom DNS servers are also supported. For the detailed guidance, see [http://msdn.microsoft.com/library/azure/jj156088.aspx](http://msdn.microsoft.com/library/azure/jj156088.aspx).

4. Click **Create a Virtual Network**. The new virtual network name will appear in the list. Wait until the Status column shows **Created**.

5. In the main pane, click the virtual network you just created.

6. On the top of the page, click **DASHBOARD**.

7. Under **quick glance**, make a note of **VIRTUAL NETWORK ID**. You will need it when provisioning the Storm and HBase clusters.

8. On the top of the page, click **CONFIGURE**.

9. On the bottom of the page, the default subnet name is **Subnet-1**. Use the **add subnet** button to add **Subnet-2**. These subnets will house the Storm and HBase clusters.

	> [AZURE.NOTE] In this article, we will be using clusters with only one node. If you are creating multi-node clusters, you must verify the **CIDR(ADDRESS COUNT)** for the subnet that will be used for the cluster. The address count must be greater than the number of worker nodes plus seven (Gateway: 2, Headnode: 2, Zookeeper: 3). For example, if you need a 10 node HBase cluster, the address count for the subnet must be greater than 17 (10+7). Otherwise the deployment will fail.
	>
	> It is highly recommended to designate a single subnet for one cluster.

11. Click **Save** on the bottom of the page.

###Create a Storm and HBase cluster on the Virtual Network

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com/)

2. Click **HDInsight** on the left, and then **+NEW** in the lower left corner of the page.

3. Click on the HDInsight icon in the second column, and then select **Custom**.

4. On the **Cluster Details** page, enter the name of the new cluster, and select **Storm** for the **Cluster Type**. Select the arrow to continue.

5. Enter 1 for the number of **Data Nodes** to use for this cluster. For **Region/Virtual Network**, select the Azure Virtual Network created earlier. For **Virtual Network Subnets**, select **Subnet-1**.

	> [AZURE.NOTE] To minimize the cost for the cluster used for this article, reduce the **Cluster Size** to 1, and delete the cluster after you have finished using it.

6. Enter the administrator **User Name** and **Password**, then select the arrow to continue.

4. For **Storage Account**, select **Create New Storage** or select an existing storage account. Select or enter the **Account Name** and **Default container** to use. Click on the check icon on the lower left to create the Storm cluster.

5. Repeat these steps to create a new **HBase** cluster. The following are the key differences:

	* **Cluster Type** - select **HBase**

	* **Virtual Network Subnets** - select **Subnet-2**

	* **Storage Account** - You should use a different container than the one used for the Storm cluster

###Discover the HBase DNS suffix

In order to write to HBase from the Storm cluster, you must use the fully qualified domain name (FQDN) for the HBase cluster. Use the following command to discover this information.

	curl -u <username>:<password> -k https://<clustername>.azurehdinsight.net/ambari/api/v1/clusters/<clustername>.azurehdinsight.net/services/hbase/components/hbrest

In the JSON data returned, find the "host_name" entry. This will contain the fully qualified domain name (FQDN) for the nodes in the cluster. For example:

	...
	"host_name": "wordkernode0.<clustername>.b1.cloudapp.net
	...

The portion of the domain name beginning with the cluster name is the DNS suffix. For example, **mycluster.b1.cloudapp.net**.

###Enable the HBase bolt

1. Open **hdinsight-eventhub-example\TemperatureMonitor\conf\hbase-site.xml** and replace the `suffix` entries in the following line with the DNS suffix obtained previously for the HBase cluster. Save the file after making these changes.

		<value>zookeeper0.suffix,zookeeper1.suffix,zookeeper2.suffix</value>

	This will be used by the HBase bolt to communicate with the HBase cluster.

1. Open **hdinsight-eventhub-example\TemperatureMonitor\src\main\java\com\microsoft\examples\bolts\** in an editor, and uncomment the following lines by removing the `//` from the beginning. Save the file after making this change.

		topologyBuilder.setBolt("HBase", new HBaseBolt("SensorData", mapper).withConfigKey("hbase.conf"), spoutConfig.getPartitionCount())
    	  .fieldsGrouping("Parser", "hbasestream", new Fields("deviceid")).setNumTasks(spoutConfig.getPartitionCount());

	This enables the HBase bolt.

	> [AZURE.NOTE] You should only enable the HBase bolt when deploying to the Storm cluster, not when testing locally.

###HBase and Storm data

Before running the topology, you must prepare HBase to accept the data.

1. Using Remote Desktop, connect to the HBase cluster.

2. From the desktop, start the HDInsight Command Line and enter the following commands.

    cd %HBASE_HOME%
    bin\hbase shell

3. From the HBase shell, enter the following command to create a table that sensor data will be stored in.

    create 'SensorData', 'cf'

4. Verify that the table contains no data by entering the following command.

    scan 'SensorData'

Once you have started the topology on the Storm cluster and processed data, you can use the `scan 'SensorData'` command again to verify that data was inserted into HBase


##Summary

You have now learned how to use Storm to read data from Event Hub and display information from Storm on an external dashboard using SignalR and D3.js. If you've used the optional steps, you've also learned how to configure HDInsight in a Virtual Network and how to communicate between a Storm topology and HBase using the HBase bolt.

* For more examples of Storm topologies with HDinsight, see:

	* [Storm on HDInsight Examples](https://github.com/hdinsight/hdinsight-storm-examples)

	* [Twitter Trending Hashtags](hdinsight-storm-twitter-trending.md)

* For more information on Apache Storm, see [https://storm.incubator.apache.org/](https://storm.incubator.apache.org/)

* For more information on HBase on HDInsight, see the [HBase with HDInsight Overview](hdinsight-hbase-overview.md)

* For more information on Socket.io, see [http://socket.io](http://socket.io/)

* For more information on D3.js, see [D3.js - Data Driven Documents](http://d3js.org/)

* for information on creating topologies in Java, see [Develop Java topologies for Apache Storm on HDInsight](hdinsight-storm-develop-java-topology.md)

* For information on creating topologies in .NET, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md)

[azure-portal]: https://manage.windowsazure.com/
