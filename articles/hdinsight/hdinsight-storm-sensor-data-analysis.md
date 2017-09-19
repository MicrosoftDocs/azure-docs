---
title: Analyze sensor data with Apache Storm and HBase | Microsoft Docs
description: Learn how to connect to Apache Storm with a virtual network. Use Storm with HBase to process sensor data from an event hub and visualize it with D3.js.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: a9a1ac8e-5708-4833-b965-e453815e671f
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 08/09/2017
ms.author: larryfr

---
# Analyze sensor data with Apache Storm, Event Hub, and HBase in HDInsight (Hadoop)

Learn how to use Apache Storm on HDInsight to process sensor data from Azure Event Hub. The data is then stored into Apache HBase on HDInsight, and visualized using D3.js.

The Azure Resource Manager template used in this document demonstrates how to create multiple Azure resources in a resource group. The template creates an Azure Virtual Network, two HDInsight clusters (Storm and HBase) and an Azure Web App. A node.js implementation of a real-time web dashboard is automatically deployed to the web app.

> [!NOTE]
> The information in this document and example in this document require HDInsight version 3.6.
>
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## Prerequisites

* An Azure subscription.
* [Node.js](http://nodejs.org/): Used to preview the web dashboard locally on your development environment.
* [Java and the JDK 1.7](http://www.oracle.com/technetwork/java/javase/downloads/index.html): Used to develop the Storm topology.
* [Maven](http://maven.apache.org/what-is-maven.html): Used to build and compile the project.
* [Git](http://git-scm.com/): Used to download the project from GitHub.
* An **SSH** client: Used to connect to the Linux-based HDInsight clusters. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).


> [!IMPORTANT]
> You do not need an existing HDInsight cluster. The steps in this document create the following resources:
> 
> * An Azure Virtual Network
> * A Storm on HDInsight cluster (Linux-based, two worker nodes)
> * An HBase on HDInsight cluster (Linux-based, two worker nodes)
> * An Azure Web App that hosts the web dashboard

## Architecture

![architecture diagram](./media/hdinsight-storm-sensor-data-analysis/devicesarchitecture.png)

This example consists of the following components:

* **Azure Event Hubs**: Contains data that is collected from sensors.
* **Storm on HDInsight**: Provides real-time processing of data from Event Hub.
* **HBase on HDInsight**: Provides a persistent NoSQL data store for data after it has been processed by Storm.
* **Azure Virtual Network service**: Enables secure communications between the Storm on HDInsight and HBase on HDInsight clusters.
  
  > [!NOTE]
  > A virtual network is required when using the Java HBase client API. It is not exposed over the public gateway for HBase clusters. Installing HBase and Storm clusters into the same virtual network allows the Storm cluster (or any other system on the virtual network) to directly access HBase using client API.

* **Dashboard website**: An example dashboard that charts data in real time.
  
  * The website is implemented in Node.js.
  * [Socket.io](http://socket.io/) is used for real-time communication between the Storm topology and the website.
    
    > [!NOTE]
    > Using Socket.io for communication is an implementation detail. You can use any communications framework, such as raw WebSockets or SignalR.

  * [D3.js](http://d3js.org/) is used to graph the data that is sent to the website.

> [!IMPORTANT]
> Two clusters are required, as there is no supported method to create one HDInsight cluster for both Storm and HBase.

The topology reads data from Event Hub by using the [org.apache.storm.eventhubs.spout.EventHubSpout](http://storm.apache.org/releases/0.10.1/javadocs/org/apache/storm/eventhubs/spout/class-use/EventHubSpout.html) class, and writes data into HBase using the [org.apache.storm.hbase.bolt.HBaseBolt](https://storm.apache.org/releases/1.0.1/javadocs/org/apache/storm/hbase/bolt/HBaseBolt.html) class. Communication with the website is accomplished by using [socket.io-client.java](https://github.com/nkzawa/socket.io-client.java).

The following diagram explains the layout of the topology:

![topology diagram](./media/hdinsight-storm-sensor-data-analysis/sensoranalysis.png)

> [!NOTE]
> This diagram is a simplified view of the topology. An instance of each component is created for each partition in your Event Hub. These instances are distributed across the nodes in the cluster, and data is routed between them as follows:
> 
> * Data from the spout to the parser is load balanced.
> * Data from the parser to the Dashboard and HBase is grouped by Device ID, so that messages from the same device always flow to the same component.

### Topology components

* **Event Hub Spout**: The spout is provided as part of Apache Storm version 0.10.0 and higher.
  
  > [!NOTE]
  > The Event Hub spout used in this example requires a Storm on HDInsight cluster version 3.5 or 3.6.

* **ParserBolt.java**: The data that is emitted by the spout is raw JSON, and occasionally more than one event is emitted at a time. This bolt reads the data emitted by the spout and parses the JSON message. The bolt then emits the data as a tuple that contains multiple fields.
* **DashboardBolt.java**: This component demonstrates how to use the Socket.io client library for Java to send data in real time to the web dashboard.
* **no-hbase.yaml**: The topology definition used when running in local mode. It does not use HBase components.
* **with-hbase.yaml**: The topology definition used when running the topology on the cluster. It does use HBase components.
* **dev.properties**: The configuration information for the Event Hub spout, HBase bolt, and dashboard components.

## Prepare your environment

Before you use this example, you must create an Azure Event Hub, which the Storm topology reads from.

### Configure Event Hub

Event Hub is the data source for this example. Use the following steps to create an Event Hub.

1. From the [Azure portal](https://portal.azure.com), select **+ New** -> **Internet of Things** -> **Event Hubs**.
2. In the **Create Namespace** section, perform the following tasks:
   
   1. Enter a **Name** for the namespace.
   2. Select a pricing tier. **Basic** is sufficient for this example.
   3. Select the Azure **Subscription** to use.
   4. Either select an existing resource group or create a new one.
   5. Select the **Location** for the Event Hub.
   6. Select **Pin to dashboard**, and then click **Create**.

3. When the creation process completes, the Event Hubs information for your namespace is displayed. From here, select **+ Add Event Hub**. In the **Create Event Hub** section, enter a name of **sensordata**, and then select **Create**. Leave the other fields at the default values.
4. From the Event Hubs view for your namespace, select **Event Hubs**. Select the **sensordata** entry.
5. From the sensordata Event Hub, select **Shared access policies**. Use the **+ Add** link to add the following policies:

    | Policy name | Claims |
    | ----- | ----- |
    | devices | Send |
    | storm | Listen |

1. Select both policies and make a note of the **PRIMARY KEY** value. You need the value for both policies in future steps.

## Download and configure the project

Use the following to download the project from GitHub.

    git clone https://github.com/Blackmist/hdinsight-eventhub-example

After the command completes, you have the following directory structure:

    hdinsight-eventhub-example/
        TemperatureMonitor/ - this contains the topology
            resources/
                log4j2.xml - set logging to minimal.
                no-hbase.yaml - topology definition without hbase components.
                with-hbase.yaml - topology definition with hbase components.
            src/main/java/com/microsoft/examples/bolts/
                ParserBolt.java - parses JSON data into tuples
                DashboardBolt.java - sends data over Socket.IO to the web dashboard.
        dashboard/nodejs/ - this is the node.js web dashboard.
        SendEvents/ - utilities to send fake sensor data.

> [!NOTE]
> This document does not go in to full details of the code included in this example. However, the code is fully commented.

To configure the project to read from Event Hub, open the `hdinsight-eventhub-example/TemperatureMonitor/dev.properties` file and add your Event Hub information to the following lines:

```bash
eventhub.read.policy.name: your_read_policy_name
eventhub.read.policy.key: your_key_here
eventhub.namespace: your_namespace_here
eventhub.name: your_event_hub_name
eventhub.partitions: 2
```

## Compile and test locally

> [!IMPORTANT]
> Using the topology locally requires a working Storm development environment. For more information, see [Setting up a Storm development environment](http://storm.apache.org/releases/1.1.0/Setting-up-development-environment.html) at Apache.org.

> [!WARNING]
> If you are using a Windows development environment, you may receive a `java.io.IOException` when running the topology locally. If so, move on to running the topology on HDInsight.

Before testing, you must start the dashboard to view the output of the topology and generate data to store in Event Hub.

> [!IMPORTANT]
> The HBase component of this topology is not active when testing locally. The Java API for the HBase cluster cannot be accessed from outside the Azure Virtual Network that contains the clusters.

### Start the web application

1. Open a command prompt and change directories to `hdinsight-eventhub-example/dashboard`. Use the following command to install the dependencies needed by the web application:
   
    ```bash
    npm install
    ```

2. Use the following command to start the web application:
   
    ```bash
    node server.js
    ```
   
    You see a message similar to the following text:
   
        Server listening at port 3000

3. Open a web browser and enter `http://localhost:3000/` as the address. A page similar to the following image is displayed:
   
    ![web dashboard](./media/hdinsight-storm-sensor-data-analysis/emptydashboard.png)
   
    Leave this command prompt open. After testing, use Ctrl-C to stop the web server.

### Generate data

> [!NOTE]
> The steps in this section use Node.js so that they can be used on any platform. For other language examples, see the `SendEvents` directory.

1. Open a new prompt, shell, or terminal, and change directories to `hdinsight-eventhub-example/SendEvents/nodejs`. To install the dependencies needed by the application, use the following command:

    ```bash
    npm install
    ```

2. Open the `app.js` file in a text editor and add the Event Hub information you obtained earlier:
   
    ```javascript
    // ServiceBus Namespace
    var namespace = 'YourNamespace';
    // Event Hub Name
    var hubname ='sensordata';
    // Shared access Policy name and key (from Event Hub configuration)
    var my_key_name = 'devices';
    var my_key = 'YourKey';
    ```
   
   > [!NOTE]
   > This example assumes that you have used `sensordata` as the name of your Event Hub. And that `devices` as the name of the policy that has a `Send` claim.

3. Use the following command to insert new entries in Event Hub:
   
    ```bash
    node app.js
    ```
   
    You see several lines of output that contain the data sent to Event Hub:
   
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

### Build and start the topology

1. Open a new command prompt and change directories to `hdinsight-eventhub-example/TemperatureMonitor`. To build and package the topology, use the following command: 

    ```bash
    mvn clean package
    ```

2. To start the topology in local mode, use the following command:

    ```bash
    storm jar target/TemperatureMonitor-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local --filter dev.properties resources/no-hbase.yaml
    ```

    * `--local` starts the topology in local mode.
    * `--filter` uses the `dev.properties` file to populate parameters in the topology definition.
    * `resources/no-hbase.yaml` uses the `no-hbase.yaml` topology definition.
 
   Once started, the topology reads entries from Event Hub, and sends them to the dashboard running on your local machine. You should see lines appear in the web dashboard, similar to the following image:
   
    ![dashboard with data](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

2. While the dashboard is running, use the `node app.js` command from the previous steps to send new data to Event Hubs. Because the temperature values are randomly generated, the graph should update to show large changes in temperature.
   
   > [!NOTE]
   > You must be in the **hdinsight-eventhub-example/SendEvents/Nodejs** directory when using the `node app.js` command.

3. After verifying that the dashboard updates, stop the topology using Ctrl+C. You can use Ctrl+C to stop the local web server also.

## Create a Storm and HBase cluster

The steps in this section use an [Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md) to create an Azure Virtual Network and a Storm and HBase cluster on the virtual network. The template also creates an Azure Web App and deploys a copy of the dashboard into it.

> [!NOTE]
> A virtual network is used so that the topology running on the Storm cluster can directly communicate with the HBase cluster using the HBase Java API.

The Resource Manager template used in this document is located in a public blob container at **https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-hbase-storm-cluster-in-vnet-3.6.json**.

1. Click the following button to sign in to Azure and open the Resource Manager template in the Azure portal.
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hbase-storm-cluster-in-vnet-3.6.json" target="_blank"><img src="./media/hdinsight-storm-sensor-data-analysis/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. From the **Custom deployment** section, enter the following values:
   
    ![HDInsight parameters](./media/hdinsight-storm-sensor-data-analysis/parameters.png)
   
   * **Base Cluster Name**: This value is used as the base name for the Storm and HBase clusters. For example, entering **abc** creates a Storm cluster named **storm-abc** and an HBase cluster named **hbase-abc**.
   * **Cluster Login User Name**: The admin user name for the Storm and HBase clusters.
   * **Cluster Login Password**: The admin user password for the Storm and HBase clusters.
   * **SSH User Name**: The SSH user to create for the Storm and HBase clusters.
   * **SSH Password**: The password for the SSH user for the Storm and HBase clusters.
   * **Location**: The region that the clusters are created in.
     
     Click **OK** to save the parameters.

3. Use the **Basics** section to create a resource group or select an existing one.
4. In the **Resource group location** dropdown menu, select the same location as you selected for the **Location** parameter in the **Settings** section.
5. Read the terms and conditions, and then select **I agree to the terms and conditions stated above**.
6. Finally, check **Pin to dashboard** and then select **Purchase**. It takes about 20 minutes to create the clusters.

Once the resources have been created, information about the resource group is displayed.

![Resource group for the vnet and clusters](./media/hdinsight-storm-sensor-data-analysis/groupblade.png)

> [!IMPORTANT]
> Notice that the names of the HDInsight clusters are **storm-BASENAME** and **hbase-BASENAME**, where BASENAME is the name you provided to the template. You use these names in a later step when connecting to the clusters. Also note that the name of the dashboard site is **basename-dashboard**. This value is used later in this document.

## Configure the Dashboard bolt

To send data to the dashboard deployed as a web app, you must modify the following line in the `dev.properties`file:

```yaml
dashboard.uri: http://localhost:3000
```

Change `http://localhost:3000` to `http://BASENAME-dashboard.azurewebsites.net` and save the file. Replace **BASENAME** with the base name you provided in the previous step. You can also use the resource group created previously to select the dashboard and view the URL.

## Create the HBase table

To store data in HBase, we must first create a table. Pre-create resources that Storm needs to write to, as trying to create resources from inside a Storm topology can result in multiple instances trying to create the same resource. Create the resources outside the topology and use Storm for reading/writing and analytics.

1. Use SSH to connect to the HBase cluster using the SSH user and password you supplied to the template during cluster creation. For example, if connecting using the `ssh` command, you would use the following syntax:
   
    ```bash
    ssh sshuser@clustername-ssh.azurehdinsight.net
    ```
   
    Replace `sshuser` with the SSH user name you provided when creating the cluster. Replace `clustername` with the HBase cluster name.

2. From the SSH session, start the HBase shell.
   
    ```bash
    hbase shell
    ```
   
    Once the shell has loaded, you see an `hbase(main):001:0>` prompt.

3. From the HBase shell, enter the following command to create a table to store the sensor data:
   
    ```hbase
    create 'SensorData', 'cf'
    ```

4. Verify that the table has been created by using the following command:
   
    ```hbase
    scan 'SensorData'
    ```
   
    This returns information similar to the following example, indicating that there are 0 rows in the table.
   
        ROW                   COLUMN+CELL                                       0 row(s) in 0.1900 seconds

5. Enter `exit` to exit the HBase shell:

## Configure the HBase bolt

To write to HBase from the Storm cluster, you must provide the HBase bolt with the configuration details of your HBase cluster.

1. Use one of the following examples to retrieve the Zookeeper quorum for your HBase cluster:

    ```bash
    CLUSTERNAME='your_HDInsight_cluster_name'
    curl -u admin -sS -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/HBASE/components/HBASE_MASTER" | jq '.metrics.hbase.master.ZookeeperQuorum'
    ```

    > [!NOTE]
    > Replace `your_HDInsight_cluster_name` with the name of your HDInsight cluster. For more information on installing the `jq` utility, see [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/).
    >
    > When prompted, enter the password for the HDInsight admin login.

    ```powershell
    $clusterName = 'your_HDInsight_cluster_name`
    $creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/HBASE/components/HBASE_MASTER" -Credential $creds
    $respObj = ConvertFrom-Json $resp.Content
    $respObj.metrics.hbase.master.ZookeeperQuorum
    ```

    > [!NOTE]
    > Replace `your_HDInsight_cluster_name with the name of your HDInsight cluster. When prompted, enter the password for the HDInsight admin login.
    >
    > This example requires Azure PowerShell. For more information on using Azure PowerShell, see [Get started with Azure PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/Getting-Started-with-Windows-PowerShell?view=powershell-6)

    The information returned by these examples is similar to the following text:

    `zk2-hbase.mf0yeg255m4ubit1auvj1tutvh.ex.internal.cloudapp.net:2181,zk0-hbase.mf0yeg255m4ubit1auvj1tutvh.ex.internal.cloudapp.net:2181,zk3-hbase.mf0yeg255m4ubit1auvj1tutvh.ex.internal.cloudapp.net:2181`

    This information is used by Storm to communicate with the HBase cluster.

2. Modify the `dev.properties` file and add the Zookeeper quorum information to the following line:

    ```yaml
    hbase.zookeeper.quorum: your_hbase_quorum
    ```

## Build, package, and deploy the solution to HDInsight

In your development environment, use the following steps to deploy the Storm topology to the storm cluster.

1. From the `TemperatureMonitor` directory, use the following command to perform a new build and create a JAR package from your project:
   
        mvn clean package
   
    This command creates a file named `TemperatureMonitor-1.0-SNAPSHOT.jar in the `target` directory of your project.

2. Use scp to upload the `TemperatureMonitor-1.0-SNAPSHOT.jar` and `dev.properties` files to your Storm cluster. In the following example, replace `sshuser` with the SSH user you provided when creating the cluster, and `clustername` with the name of your Storm cluster. When prompted, enter the password for the SSH user.
   
    ```bash
    scp target/TemperatureMonitor-1.0-SNAPSHOT.jar dev.properties sshuser@clustername-ssh.azurehdinsight.net:
    ```

   > [!NOTE]
   > It may take several minutes to upload the files.

    For more information on using the `scp` and `ssh` commands with HDInsight, see [Use SSH with HDInsight](./hdinsight-hadoop-linux-use-ssh-unix.md)

3. Once the file has been uploaded, connect to the Storm cluster using SSH.
   
    ```bash
    ssh sshuser@clustername-ssh.azurehdinsight.net
    ```

    Replace `sshuser` with the SSH user name. Replace `clustername` with the Storm cluster name.

4. To start the topology, use the following command from the SSH session:
   
    ```bash
    storm jar TemperatureMonitor-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote --filter dev.properties -R /with-hbase.yaml
    ```

    * `--remote` submits the topology to the Nimbus service, which distributes it to the supervisor nodes in the cluster.
    * `--filter` uses the `dev.properties` file to populate parameters in the topology definition.
    * `-R /with-hbase.yaml` uses the `with-hbase.yaml` topology included in the package.

5. After the topology has started, open a browser to the website you published on Azure, then use the `node app.js` command to send data to Event Hub. You should see the web dashboard update to display the information.
   
    ![dashboard](./media/hdinsight-storm-sensor-data-analysis/datadashboard.png)

## View HBase data

Use the following steps to connect to HBase and verify that the data has been written to the table:

1. Use SSH to connect to the HBase cluster.
   
    ```bash
    ssh sshuser@clustername-ssh.azurehdinsight.net
    ```

    Replace `sshuser` with the SSH user name. Replace `clustername` with the HBase cluster name.

2. From the SSH session, start the HBase shell.
   
    ```bash
    hbase shell
    ```
   
    Once the shell has loaded, you see an `hbase(main):001:0>` prompt.

3. View rows from the table:
   
    ```hbase
    scan 'SensorData'
    ```
   
    This command returns information similar to the following text, indicating that there is data in the table.
   
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
   
   > [!NOTE]
   > This scan operation returns a maximum of 10 rows from the table.

## Delete your clusters

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

To delete the clusters, storage, and web app at one time, delete the resource group that contains them.

## Next steps

For more examples of Storm topologies with HDInsight, see [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)

For more information about Apache Storm, see the [Apache Storm](https://storm.incubator.apache.org/) site.

For more information about HBase on HDInsight, see the [HBase with HDInsight Overview](hdinsight-hbase-overview.md).

For more information about Socket.io, see the [socket.io](http://socket.io/) site.

For more information about D3.js, see [D3.js - Data Driven Documents](http://d3js.org/).

For information about creating topologies in Java, see [Develop Java topologies for Apache Storm on HDInsight](hdinsight-storm-develop-java-topology.md).

For information about creating topologies in .NET, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md).

[azure-portal]: https://portal.azure.com
