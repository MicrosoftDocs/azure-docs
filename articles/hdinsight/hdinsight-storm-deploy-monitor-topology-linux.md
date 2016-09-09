<properties
   pageTitle="Deploy and manage Apache Storm topologies on Linux-based HDInsight | Microsoft Azure"
   description="Learn how to deploy, monitor and manage Apache Storm topologies using the Storm Dashboard on Linux-based HDInsight. Use Hadoop tools for Visual Studio."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="06/22/2016"
   ms.author="larryfr"/>

# Deploy and manage Apache Storm topologies on Linux-based HDInsight

In this document, learn the basics of managing and monitoring Storm topologies running on Linux-based Storm on HDInsight clusters.

> [AZURE.IMPORTANT] The steps in this article require a Linux-based Storm on HDInsight cluster. For information on deploying and monitoring topologies on Windows-based HDInsight, see [Deploy and manage Apache Storm topologies on Windows-based HDInsight](hdinsight-storm-deploy-monitor-topology.md)

## Prerequisites

* **A Linux-based Storm on HDInsight cluster**: see [Get started with Apache Storm on HDInsight](hdinsight-apache-storm-tutorial-get-started-linux.md) for steps on creating a cluster

* **Familiarity with SSH and SCP**: For more information on using SSH and SCP with HDInsight, see the following:

    * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)

    * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

* **An SCP client**: This is provided with all Linux, Unix, and OS X systems. For Windows clients, we recommend PSCP, which is available from the [PuTTY download page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

## Start a Storm topology

### Using SSH and the Storm command

1. Use SSH to connect to the HDInsight cluster. Replace **USERNAME** the the name of your SSH login. Replace **CLUSTERNAME** with your HDInsight cluster name:

        ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net

    For more information on using SSH to connect to your HDInsight cluster, see the following documents:
    
    * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)
    
    * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. Use the following command to start an example topology:

        storm jar /usr/hdp/current/storm-client/contrib/storm-starter/storm-starter-topologies-0.9.3.2.2.4.9-1.jar storm.starter.WordCountTopology WordCount

    This will start the example WordCount topology on the cluster. It will randomly generate sentences and count the occurrance of each word in the sentences.

    > [AZURE.NOTE] When submitting topology to the cluster, you must first copy the jar file containing the cluster before using the `storm` command. This can be accomplished using the `scp` command from the client where the file exists. For example, `scp FILENAME.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:FILENAME.jar`
    >
    > The WordCount example, and other storm starter examples, are already included on your cluster at `/usr/hdp/current/storm-client/contrib/storm-starter/`.

### Programmatically

You can programmatically deploy a topology to Storm on HDInsight by communicating with the Nimbus service hosted in your cluster. [https://github.com/Azure-Samples/hdinsight-java-deploy-storm-topology](https://github.com/Azure-Samples/hdinsight-java-deploy-storm-topology) provides an example Java application that demonstrates how to deploy and start a topology through the Nimbus service.

##Monitor and manage using the storm command

The `storm` utility allows you to work with running topologies from the command line. The following is a list of commonly used commands. Use `storm -h` for a full list of commands.

###List topologies

Use the following command to list all running topologies:

    storm list
    
This will return information similar to the following:

    Topology_name        Status     Num_tasks  Num_workers  Uptime_secs
    -------------------------------------------------------------------
    WordCount            ACTIVE     29         2            263

###Deactivate and reactivate

Deactivating a topology pauses it until it is killed or reactivated. Use the following to deactivate and reactivate:

    storm Deactivate TOPOLOGYNAME
    
    storm Activate TOPOLOGYNAME

###Kill a running topology

Storm topologies, once started, will continue running until stopped. To stop a topology, use the following command:

    storm stop TOPOLOGYNAME

###Rebalance

Rebalancing a topology allows the system to revise the parallelism of the topology. For example, if you have resized the cluster to add more notes, rebalancing will allow a running topology to make use of the new nodes.

> [AZURE.WARNING] Rebalancing a topology first deactivates the topology, then redistributes workers evenly across the cluster, then finally returns the topology to the state it was in before rebalancing occurred. So if the topology was active, it will become active again. If it was deactivated, it will remain deactivated.

    storm rebalance TOPOLOGYNAME

##Monitor and manage using the Storm UI

The Storm UI provides a web interface for working with running topologies, and is included on your HDInsight cluster. To view the Storm UI, use a web browser to open __https://CLUSTERNAME.azurehdinsight.net/stormui__, where __CLUSTERNAME__ is the name of your cluster.

> [AZURE.NOTE] If asked to provide a user name and password, enter the cluster administrator (admin) and password that you used when creating the cluster.


### Main page

The main page of the Storm UI provides the following information:

* **Cluster summary**: Basic information about the Storm cluster.

* **Topology summary**: A list of running topologies. Use the links in this section to view more information about specific topologies.

* **Supervisor summary**: Information about the Storm supervisor.

* **Nimbus configuration**: Nimbus configuration for the cluster.

### Topology summary

Selecting a link from the **Topology summary** section displays the following information about the topology:

* **Topology summary**: Basic information about the topology.

* **Topology actions**: Management actions that you can perform for the topology.

  * **Activate**: Resumes processing of a deactivated topology.

  * **Deactivate**: Pauses a running topology.

  * **Rebalance**: Adjusts the parallelism of the topology. You should rebalance running topologies after you have changed the number of nodes in the cluster. This allows the topology to adjust parallelism to compensate for the increased or decreased number of nodes in the cluster.

    For more information, see <a href="http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html" target="_blank">Understanding the parallelism of a Storm topology</a>.

  * **Kill**: Terminates a Storm topology after the specified timeout.

* **Topology stats**: Statistics about the topology. Use the links in the **Window** column to set the timeframe for the remaining entries on the page.

* **Spouts**: The spouts used by the topology. Use the links in this section to view more information about specific spouts.

* **Bolts**: The bolts used by the topology. Use the links in this section to view more information about specific bolts.

* **Topology configuration**: The configuration of the selected topology.

### Spout and Bolt summary

Selecting a spout from the **Spouts** or **Bolts** sections displays the following information about the selected item:

* **Component summary**: Basic information about the spout or bolt.

* **Spout/Bolt stats**: Statistics about the spout or bolt. Use the links in the **Window** column to set the timeframe for the remaining entries on the page.

* **Input stats** (bolt only): Information about the input streams consumed by the bolt.

* **Output stats**: Information about the streams emitted by this spout or bolt.

* **Executors**: Information about the instances of the spout or bolt. Select the **Port** entry for a specific executor to view a log of diagnostic information produced for this instance.

* **Errors**: Any error information for this spout or bolt.

## REST API

The Storm UI is built on top of the REST API, so you can perform similar management and monitoring functionality by using the REST API. You can use the REST API to create custom tools for managing and monitoring Storm topologies.

For more information, see [Storm UI REST API](http://storm.apache.org/releases/0.9.6/STORM-UI-REST-API.html). The following information is specific to using the REST API with Apache Storm on HDInsight.

> [AZURE.IMPORTANT] The Storm REST API is not publicly available over the internet, and must be accessed using an SSH tunnel to the HDInsight cluster head node. For information on creating and using an SSH tunnel, see [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md).

### Base URI

The base URI for the REST API on Linux-based HDInsight clusters is available on the head node at **https://HEADNODEFQDN:8744/api/v1/**; however, the domain name of the head node is generated during cluster creation and is not static.

You can find the fully qualified domain name (FQDN) for the cluster head node in several different ways:

* __From an SSH session__: Use the command `headnode -f` from an SSH session to the cluster.

* __From Ambari Web__: Select __Services__ from the top of the page, then select __Storm__. From the __Summary__ tab, select __Storm UI Server__. The FQDN of the node that the Storm UI and REST API is running on will be at the top of the page.

* __From Ambari REST API__: Use the command `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/STORM/components/STORM_UI_SERVER"` to retrieve information about the node that the Storm UI and REST API are running on. Replace __PASSWORD__ with the admin password for the cluster. Replace __CLUSTERNAME__ with the cluster name. In the response, the "host_name" entry contains the FQDN of the node.

### Authentication

Requests to the REST API must use **basic authentication**, so you use the HDInsight cluster administrator name and password.

> [AZURE.NOTE] Because basic authentication is sent by using clear text, you should **always** use HTTPS to secure communications with the cluster.

### Return values

Information that is returned from the REST API may only be usable from within the cluster or virtual machines on the same Azure Virtual Network as the cluster. For example, the fully qualified domain name (FQDN) returned for Zookeeper servers will not be accessible from the Internet.

## Next Steps

Now that you've learned how to deploy and monitor topologies by using the Storm Dashboard, learn how to [Develop Java-based topologies using Maven](hdinsight-storm-develop-java-topology.md).

For a list of more example topologies, see [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md).
