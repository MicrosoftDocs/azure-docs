---
title: Use Apache Kafka with Storm on HDInsight | Microsoft Docs
description: Apache Kafka is installed with Apache Storm on HDInsight. Learn how to write to Kafka, and then read from it, using the KafkaBolt and KafkaSpout components provided with Storm. Also learn how to use the Flux framework to define and submit Storm topologies.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: paulettm
editor: cgronlun

ms.assetid: e4941329-1580-4cd8-b82e-a2258802c1a7QQWERTYms.service: hdinsight
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/18/2016
ms.author: larryfr
---
# Use Apache Kafka (preview) with Storm on HDInsight
Apache Kafka is a publish-subscribe messaging solution that is available with HDInsight. Apache Storm is a distributed system that can be used to analyze data in realtime. This document demonstrates how you can use Storm on HDInsight to read and process data from Kafka on HDInsight. The example in this document uses a Java-based Storm topology that relies on the Kafka spout and bolt components available with Apache Storm.

> [!NOTE]
> The steps in this document create a new Azure resource group that contains both a Storm on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Storm cluster to directly communicate with the Kafka cluster.
> 
> When you are done with the steps in this document, please remeber to delete the clusters to avoid excess charges.
> 
> 

## Prerequisites
* An Azure subscription
* [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 1.7 or higher. Or an equivalent such as [OpenJDK](http://openjdk.java.net/).
  
  > [!NOTE]
  > The steps in this document use an HDInsight 3.4 cluster, which uses Java 7.
  > 
  > 
* [Maven 3.x](http://maven.apache.org/) - A build management package for Java applications.
* A text editor or Java IDE
* An SSH client (you need the `ssh` and `scp` commands) - For more information on using SSH with HDInsight, see the following documents:
  
  * [Use SSH with Linux-based HDInsight from Linux, Unix, and Mac OS](hdinsight-hadoop-linux-use-ssh-unix.md)
  * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

## Create the clusters
Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that talks to Kafka must be in the same Azure virtual network as the nodes in the Kafka cluster. For this example, both the Kafka and Storm clusters are located in an Azure virtual network. The following diagram shows how communication flows between the clusters:

![Diagram of Storm and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-storm-with-kafka/storm-kafka-vnet.png)

> [!NOTE]
> Though Kafka itself is limited to communication within the virtual network, other services on the cluster such as SSH and Ambari can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).
> 
> 

While you can create an Azure virtual network, Kafka, and Storm clusters manually, it's easier to use an Azure Resource Manager template. Use the following steps to deploy an Azure virtual network, Kafka, and Storm clusters to your Azure subscription.

1. Use the following button to sign in to Azure and open the template in the Azure portal.
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-storm-cluster-in-vnet.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>
   
    The Azure Resource Manager template is located at **https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-kafka-storm-cluster-in-vnet.json**.
2. From the **Parameters** blade, enter the following:
   
    ![HDInsight parameters](./media/hdinsight-apache-storm-with-kafka/parameters.png)
   
    **BASICS** section:
   
   * **Resource group**: Create a new group or select an existing one. This group will contain the HDInsight cluster.
   * **Location_: Select a location geographically close to you. This must match the location in the __SETTINGS** section.
     
     **SETTINGS** section:
   * **Base Cluster Name**: This value is used as the base name for the Storm and Kafka clusters. For example, entering **hdi** creates a Storm cluster named **storm-hdi** and a Kafka cluster named **kafka-hdi**.
   * **Cluster Login User Name**: The admin user name for the Storm and Kafka clusters.
   * **Cluster Login Password**: The admin user password for the Storm and Kafka clusters.
   * **SSH User Name**: The SSH user to create for the Storm and Kafka clusters.
   * **SSH Password**: The password for the SSH user for the Storm and Kafka clusters.
   * **Location**: The region that the clusters are created in.
3. Read the **Terms and Conditions**, and then select **I agree to the terms and conditions stated above**.
4. Finally, check **Pin to dashboard** and then select **Create**. It takes about 20 minutes to create the clusters.

Once the resources have been created, you are redirected to a blade for the resource group that contains the clusters and web dashboard.

![Resource group blade for the vnet and clusters](./media/hdinsight-apache-storm-with-kafka/groupblade.png)

> [!IMPORTANT]
> Notice that the names of the HDInsight clusters are **storm-BASENAME** and **kafka-BASENAME**, where BASENAME is the name you provided to the template. You use these names in later steps when connecting to the clusters.
> 
> 

## Get the code
The code for the example described in this document is available at [https://github.com/Azure-Samples/hdinsight-storm-java-kafka](https://github.com/Azure-Samples/hdinsight-storm-java-kafka).

## Understanding the code
This project contains two topologies:

* **KafkaWriter**: Defined by the **writer.yaml** file, this topology writes random sentences to Kafka using the KafkaBolt provided with Apache Storm.
  
    This topology uses a custom **SentenceSpout** component to generate random sentences.
* **KafkaReader**: Defined by the **reader.yaml** file, this topology reads data from Kafka using the KafkaSpout provided with Apache Storm, then logs the data to stdout.
  
    This topology uses a custom **PrinterBolt** component to log data read from Kafka.

### Flux
The topologies are defined using [Flux](https://storm.apache.org/releases/1.0.1/flux.html). Flux was introduced in Storm 0.10.x and allows you to separate the topology configuration from the code. For Topologies that use the Flux framework, the topology is defined in a YAML file. The YAML file can be included as part of the topology, or can be specified when you submit the topology to the Storm server. Flux also supports variable substitution at run-time, which is used in this example.

Both topologies expect the following environment variables:

* **KAFKATOPIC**: The name of the Kafka topic that the topologies read/write to.
* **KAFKABROKERS**: The hosts that the Kafka brokers run on. This is used by the KafkaBolt when writing to Kafka.
* **ZKHOSTS**: The hosts that Zookeeper runs on.

The steps in this document demonstrate how to set these environment variables.

## Create a Kafka topic
1. Connect to the Kafka cluster using SSH. Replace **USERNAME** with the SSH user name used when creating the cluster. Replace **BASENAME** with the base name used when creating the cluster.
   
        ssh USERNAME@kafka-BASENAME-ssh.azurehdinsight.net
   
    When prompted, enter the password you used when creating the clusters.
   
    For more information on using SSH with HDInsight, see the following documents:
   
   * [Use SSH with Linux-based HDInsight from Linux, Unix, and Mac OS](hdinsight-hadoop-linux-use-ssh-unix.md)
   * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
2. From the SSH connection to the Kafka cluster, use the following command to get the zookeeper nodes:
   
        ZKHOSTS=`grep -R zk /etc/hadoop/conf/yarn-site.xml | grep 2181 | grep -oPm1 "(?<=<value>)[^<]+"`
   
    This reads the values for the Zookeeper hosts from the yarn-site.xml file, and store them into the ZKHOSTS variable. Use the following to see these values:
   
        echo $ZKHOSTS
   
    The output of this command is similar to the following example:
   
        zk0-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,zk2-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,zk3-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181
   
    Save the values returned from this command, as these are used when starting the topology on the Storm cluster.
3. Use the following command to create a topic in Kafka:
   
        /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 8 --topic stormtest --zookeeper $ZKHOSTS
   
    This command connects to Zookeeper using the host information stored in `$ZKHOSTS`, and then creates a Kafka topic named **stormtest**. You can verify that the topic was created by using the following command to list topics:
   
        /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper $ZKHOSTS
   
    The output of this command lists Kafka topics, which should contain the new **stormtest** topic.

Leave the SSH connection to the Kafka cluster active, as you can use it to verify that the Storm topology is writing messages to the topic.

## Download and compile the project
1. On your development environment, download the project from [https://github.com/Azure-Samples/hdinsight-storm-java-kafka](https://github.com/Azure-Samples/hdinsight-storm-java-kafka), open a command-line, and change directories to the location that you downloaded the project.
   
    Take a few moments to look over the code and understand how the project works.
2. From the **hdinsight-storm-java-kafka** directory, use the following command to compile the project and create a package for deployment:
   
        mvn clean package
   
    The package process creates a file named `KafkaTopology-1.0-SNAPSHOT.jar` in the `target` directory.
3. Use the following commands to copy the package to your Storm on HDInsight cluster. Replace **USERNAME** with the SSH user name for the cluster. Replace **BASENAME** with the base name you used when creating the cluster.
   
        cd target
        scp KafkaTopology-1.0-SNAPSHOT.jar USERNAME@storm-BASENAME-ssh.azurehdinsight.net:
   
    When prompted, enter the password you used when creating the clusters.

## Start the writer
1. Use the following to connect to the Storm cluster using SSH. Replace **USERNAME** with the SSH user name used when creating the cluster. Replace **BASENAME** with the base name used when creating the cluster.
   
        ssh USERNAME@storm-BASENAME-ssh.azurehdinsight.net
   
    When prompted, enter the password you used when creating the clusters.
   
    For more information on using SSH with HDInsight, see the following documents:
   
   * [Use SSH with Linux-based HDInsight from Linux, Unix, and Mac OS](hdinsight-hadoop-linux-use-ssh-unix.md)
   * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
2. From the SSH connection to the Storm cluster, use the following commands to install the jq utility on the cluster. This utility makes it much easier to parse the JSON documents for the information we need in the next step.
   
        wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64
        chmod +x jq-linux64
        mv jq-linux64 /usr/bin/jq
3. Use the following to set the **KAFKATOPIC** and **KAFKABROKERS** environment variables. Replace **BASENAME** and **PASSWORD** with the base name and login password used when creating the clusters.
   
        export KAFKATOPIC=stormtest
        export KAFKABROKERS=`curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/HDFS/components/DATANODE" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'`
        export ZKHOSTS=`curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")'`
   
    For **KAFKABROKERS** and **ZKHOSTS** cURL is used to retrieve wokernode and Zookeeper host name information from Ambari on the Kafka cluster. This information allows the Storm topology to communicate with Kafka on the remote cluster.
   
   > [!NOTE]
   > `export` is used so that these variables are available to processes launched from this SSH session, such as the Storm topology.
   > 
   > 
4. From the SSH connection to the Storm cluster, use the following command to start the writer topology:
   
        storm jar KafkaTopology-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /writer.yaml -e
   
    The parameters used with this command are:
   
   * **org.apache.storm.flux.Flux**: Use Flux to configure and run this topology.
   * **--remote**: Submit the topology to Nimbus. The topology is ran in a distributed fashion using the worker nodes in the cluster.
   * **-R /writer.yaml**: Use the **writer.yaml** to configure the topology. `-R` indicates that this resource is included in the jar file. It's in the root of the jar, so `/writer.yaml` is the path to it.
   * **-e**: Use environment variable substitution. Flux picks up the $KAFKABROKERS and $KAFKATOPIC values you set previously, and uses them in the reader.yaml file in place of the `${ENV-KAFKABROKER}` and `${ENV-KAFKATOPIC}` entries.
5. Once the topology has started, switch to the SSH connection to the Kafka cluster and use the following command to view messages written to the **stormtest** topic:
   
         /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --zookeeper $ZKHOSTS --from-beginning --topic stormtest
   
    This command uses a script shipped with Kafka to monitor the topic. After a moment, it should start returning random sentences that have been written to the topic. The output is similar to the following example:
   
        i am at two with nature             
        an apple a day keeps the doctor away
        snow white and the seven dwarfs     
        the cow jumped over the moon        
        an apple a day keeps the doctor away
        an apple a day keeps the doctor away
        the cow jumped over the moon        
        an apple a day keeps the doctor away
        an apple a day keeps the doctor away
        four score and seven years ago      
        snow white and the seven dwarfs     
        snow white and the seven dwarfs     
        i am at two with nature             
        an apple a day keeps the doctor away
   
    Use Ctrl+c to stop the script.

## Start the reader
1. From the SSH session to the Storm cluster, use the following command to start the reader topology:
   
        storm jar KafkaTopology-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --local -R /reader.yaml -e
   
    The parameters used with this command are:
   
   * **org.apache.storm.flux.Flux**: Use Flux to configure and run this topology.
   * **--local**: Submit the topology to in local mode. The topology runs locally on the head node. This parameter is often used for testing. In this example, it is used so that we can easily see the data that the topology logs to stdout.
   * **-R /reader.yaml**: Use the **writer.yaml** to configure the topology. `-R` indicates that this resource is included in the jar file. It's in the root of the jar, so `/writer.yaml` is the path to it.
   * **-e**: Use environment variable substitution. Flux picks up the $ZKHOSTS and $KAFKATOPIC values you set previously, and uses them in the writer.yaml file in place of the `${ENV-ZKHOSTS}` and `${ENV-KAFKATOPIC}` entries.
2. Once the topology starts, it should start logging information similar to the following:
   
        18:15:22.521 [Thread-24-printerbolt] INFO  c.m.e.PrinterBolt - Received data: i am at two with nature
        18:15:22.528 [Thread-24-printerbolt] INFO  c.m.e.PrinterBolt - Received data: four score and seven years ago
        18:15:22.530 [Thread-24-printerbolt] INFO  c.m.e.PrinterBolt - Received data: the cow jumped over the moon
        18:15:22.531 [Thread-36-printerbolt] INFO  c.m.e.PrinterBolt - Received data: four score and seven years ago
        18:15:22.533 [Thread-24-printerbolt] INFO  c.m.e.PrinterBolt - Received data: four score and seven years ago
        18:15:22.535 [Thread-36-printerbolt] INFO  c.m.e.PrinterBolt - Received data: i am at two with nature
        18:15:22.537 [Thread-16-printerbolt] INFO  c.m.e.PrinterBolt - Received data: the cow jumped over the moon
        18:15:22.538 [Thread-16-printerbolt] INFO  c.m.e.PrinterBolt - Received data: four score and seven years ago
3. Use Ctrl+c to stop the topology.

## Stop the writer
Since the writer was distributed across the cluster, it has to be stopped using the following command:

    storm kill kafka-writer

## Delete the cluster
[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Since the steps in this document create both clusters in the same Azure resource group, you can delete the resource group in the Azure portal. This removes all resources created by following this document, as well as the Azure Virtual Network and storage account used by the clusters.

## Next steps
For more example topologies that can be used with Storm on HDInsight, see [Example Storm topologies and components](hdinsight-storm-example-topology.md).

For information on deploying and monitoring topologies on Linux-based HDInsight, see [Deploy and manage Apache Storm topologies on Linux-based HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)

