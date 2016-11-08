---
title: Use Apache Spark with Kafka on HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: dd8f53c1-bdee-4921-b683-3be4c46c2039
ms.service: hdinsight
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/27/2016
ms.author: larryfr
---
# Use Apache Spark with Kafka (preview) on HDInsight

Apache Spark can be used to stream data into or out of Apache Kafka. In this document, learn how to create a basic Spark application in Scala that writes to and reads from Kafka on HDInsight.

> [!NOTE]
> The steps in this document create a new Azure resource group that contains both a Spark on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Storm cluster to directly communicate with the Kafka cluster.
> 
> When you are done with the steps in this document, please remeber to delete the clusters to avoid excess charges.

## Prerequisites

* An Azure subscription

* [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 1.8 or higher. Or an equivalent such as [OpenJDK](http://openjdk.java.net/).
  
    > [!NOTE]
    > The steps in this document use an HDInsight 3.5 cluster, which uses Java 8.

* [Maven 3.x](http://maven.apache.org/) - A build management package for Java applications.

* A text editor or Java IDE

* An SSH client (you need the `ssh` and `scp` commands) - For more information on using SSH with HDInsight, see the following documents:

    * [Use SSH with Linux-based HDInsight from Linux, Unix, and Mac OS](hdinsight-hadoop-linux-use-ssh-unix.md)

    * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

## Create the clusters

Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that talks to Kafka must be in the same Azure virtual network as the nodes in the Kafka cluster. For this example, both the Kafka and Spark clusters are located in an Azure virtual network. The following diagram shows how communication flows between the clusters:

![Diagram of Spark and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-spark-with-kafka/spark-kafka-vnet.png)

> [!NOTE]
> Though Kafka itself is limited to communication within the virtual network, other services on the cluster such as SSH and Ambari can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).

While you can create an Azure virtual network, Kafka, and Spark clusters manually, it's easier to use an Azure Resource Manager template. Use the following steps to deploy an Azure virtual network, Kafka, and Spark clusters to your Azure subscription.

1. Use the following button to sign in to Azure and open the template in the Azure portal.
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-spark-cluster-in-vnet.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>
   
    The Azure Resource Manager template is located at **https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-kafka-spark-cluster-in-vnet.json**.

2. From the **Parameters** blade, enter the following:
   
    ![HDInsight parameters](./media/hdinsight-apache-spark-with-kafka/parameters.png)
   
    **BASICS** section:
   
    * **Resource group**: Create a new group or select an existing one. This group will contain the HDInsight cluster.

    * **Location_: Select a location geographically close to you. This must match the location in the __SETTINGS** section.
     
        **SETTINGS** section:
   
        * **Base Cluster Name**: This value is used as the base name for the Spark and Kafka clusters. For example, entering **hdi** creates a Spark cluster named spark-hdi__ and a Kafka cluster named **kafka-hdi**.

        * **Cluster Login User Name**: The admin user name for the Spark and Kafka clusters.

        * **Cluster Login Password**: The admin user password for the Spark and Kafka clusters.

        * **SSH User Name**: The SSH user to create for the Spark and Kafka clusters.

        * **SSH Password**: The password for the SSH user for the Spark and Kafka clusters.

        * **Location**: The region that the clusters are created in.

3. Read the **Terms and Conditions**, and then select **I agree to the terms and conditions stated above**.

4. Finally, check **Pin to dashboard** and then select **Create**. It takes about 20 minutes to create the clusters.

Once the resources have been created, you are redirected to a blade for the resource group that contains the clusters and web dashboard.

![Resource group blade for the vnet and clusters](./media/hdinsight-apache-spark-with-kafka/groupblade.png)

> [!IMPORTANT]
> Notice that the names of the HDInsight clusters are **storm-BASENAME** and **kafka-BASENAME**, where BASENAME is the name you provided to the template. You use these names in later steps when connecting to the clusters.

## Get the code

The code for the example described in this document is available at [https://github.com/Azure-Samples/hdinsight-spark-java-kafka](https://github.com/Azure-Samples/hdinsight-spark-java-kafka).

## Understand the code

There are two projects contained in the code repository; a Jupyter notebook and a standalone Scala project that can be ran using Livy or `spark-submit`. 

Both projects rely on the following pieces of data:

* __Kafka brokers__: The broker process runs on each workernode on the Kafka cluster. The list of brokers is required by the producer component, which writes data to Kafka.

* __Zookeeper hosts__: The Zookeeper hosts for the Kafka cluster are used when consuming (reading) data from Kafka.

* __Topic name__: The name of the topic that data will be written to and read from. This example expects a topic named `sparktest`.

See [Kafka host information](#kafkahosts) for information on how to obtain the Kafka broker and Zookeeper host information.

### Jupyter notebook

The Jupyter notebook contains Scala code that performs the following tasks:

* Creates a consumer that reads data from a Kafka topic named `sparktest`, counts each word in the data, and stores the word and count into a temporary table named `wordcounts`.

* Creates a producer that writes wrandom sentences to the Kafka topic named `sparktest`.

* Selects data from the `wordcounts` table to display the counts.

Each cell in the project contains comments or a text section that explains what the code does.

### Scala project

This project contains two pieces that do all the work:

* **KafkaWordProducer**: This emits random sentences to a Kafka topic every second.

* **KafkaWordCount**: This reads data from one or more Kafka topics, and maintains a count of how many times individual words occur.

## Kafka host information

The first thing you should do when working with Kafka on HDInsight is to get the Kafka broker and Zookeeper host information for the Kafka cluster. This is used by client applications in order to communicate with Kafka.

From your development environment, use the following commands to retrieve the broker and Zookeeper information. Replace __PASSWORD__ with the login (admin) password you used when creating the cluster. Replace __BASENAME__ with the base name you used when creating the cluster.

* To get the __Kafka broker__ information:

        curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/KAFKA/components/KAFKA_BROKER" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'

    > [!IMPORTANT]
    > When using this command from Windows PowerShell, you may receive an error about shell quoting issues. If so, use the following command:
    > `curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/KAFKA/components/KAFKA_BROKER" | jq -r '["""\(.host_components[].HostRoles.host_name):9092"""] | join(""",""")'

* To get the __Zookeeper host__ information:

        curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")'
    
    > [!IMPORTANT]
    > When using this command from Windows PowerShell, you may receive an error about shell quoting issues. If so, use the following command:
    > `curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["""\(.host_components[].HostRoles.host_name):2181"""] | join(""",""")'`

Both commands return information similar to the following:

    * __Kafka brokers__: `wn0-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:9092,wn1-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:9092`

    * __Zookeeper hosts__: `zk0-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181,zk1-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181,zk2-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181`

> [!IMPORTANT]
> Save this information as it is used in several steps in this document.

## Create a Kafka topic

1. Connect to the Kafka cluster using SSH. Replace **USERNAME** with the SSH user name used when creating the cluster. Replace **BASENAME** with the base name used when creating the cluster.
   
        ssh USERNAME@kafka-BASENAME-ssh.azurehdinsight.net
   
    When prompted, enter the password you used when creating the clusters.
   
    For more information on using SSH with HDInsight, see the following documents:
   
    * [Use SSH with Linux-based HDInsight from Linux, Unix, and Mac OS](hdinsight-hadoop-linux-use-ssh-unix.md)
    
    * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. From the SSH connection, use the following command to create a topic in Kafka. Replace __KAFKA_ZKHOSTS__ with the Zookeeper hosts information you obtained earlier.
   
        /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 8 --topic sparktest --zookeeper KAFKA_ZKHOSTS

    This command connects to Zookeeper, and then creates a Kafka topic named **stormtest**. You can verify that the topic was created by using the following command to list topics. As previously, replace __KAFKA_ZKHOSTS__ with the Zookeeper host information for the Kafka cluster.
   
        /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper KAFKA_ZKHOSTS
   
    The output of this command lists Kafka topics, which should contain the new **sparktest** topic.

Close the SSH connection to the Kafka cluster, as it is not needed for the rest of this document.

## Upload the Jupyter notebook

1. In your web browser, use the following URL to connect to the Jupyter Notebook server on the Spark cluster. Replace __BASENAME__ with the base name used when you created the cluster.

        https://spark-BASENAME.azurehdinsight.net/jupyter

    When prompted, enter the cluster login (admin) and password used when you created the cluster.

2. From the upper right side of the page, use the __Upload__ button to upload the `KafkaStreaming.ipynb` file. Select the file in the file browser dialog and select __Open__. 

3. Find the __KafkaStreaming.ipynb__ entry in the list of notebooks, and select __Upload__ button beside it.



## Download and compile the project
1. On your development environment, download the project from [https://github.com/Azure-Samples/hdinsight-spark-scala-kafka](https://github.com/Azure-Samples/hdinsight-spark-scala-kafka), open a command-line, and change directories to the location that you downloaded the project.
   
    Take a few moments to look over the code and understand how the project works.
2. From the **hdinsight-spark-scala-kafka** directory, use the following command to compile the project and create a package for deployment:
   
        mvn clean package
   
    The package process creates a file named `KafkaExample-1.0-SNAPSHOT.jar` in the `target` directory.
3. Use the following commands to copy the package to your Storm on HDInsight cluster. Replace **USERNAME** with the SSH user name for the cluster. Replace **BASENAME** with the base name you used when creating the cluster.
   
        cd target
        scp KafkaExample-1.0-SNAPSHOT.jar USERNAME@storm-BASENAME-ssh.azurehdinsight.net:
   
    When prompted, enter the password you used when creating the clusters.

## Start the producer
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
   
        export KAFKABROKERS=`curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/HDFS/components/DATANODE" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'`
        export ZKHOSTS=`curl -u admin:PASSWORD -G "https://kafka-BASENAME.azurehdinsight.net/api/v1/clusters/kafka-BASENAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")'`
   
    For **KAFKABROKERS** and **ZKHOSTS** cURL is used to retrieve wokernode and Zookeeper host name information from Ambari on the Kafka cluster. This information allows the Storm topology to communicate with Kafka on the remote cluster.
   
   > [!NOTE]
   > `export` is used so that these variables are available to processes launched from this SSH session, such as the Storm topology.
   > 
   > 
4. From the SSH connection to the Storm cluster, use the following command to start writing sentences to the `sparktest` topic created earlier:
   
        spark-submit --class com.microsoft.example.KafkaWordProducer KafkaExample-1.0-SNAPSHOT.jar $KAFKABROKERS sparktest 3
   
    This will start sending three sentences per second to the `sparktest` topic created earlier.
5. Let the producer run for a bit, then use **Ctrl + C** to exit it. Use the following command to start the consumer:
   
        spark-submit --class com.microsoft.example.KafkaWordCount KafkaExample-1.0-SNAPSHOT.jar $ZKHOSTS mygroup sparktest 3
   
    This will start reading from the topic using 3 streams. All streams will be part of the `mygroup` consumer group.
   
    As sentences are read from the topic, output similar to the following is displayed:
   
        -------------------------------------------
        Time: 1477595590000 ms
        -------------------------------------------
        (score,8)
        (two,7)
        (away,4)
        (am,7)
        (with,7)
        (day,4)
        (keeps,4)
        (apple,4)
        (over,5)
        (four,8)
        ...
6. Use **Ctrl + C** to stop the consumer.

## Delete the cluster
[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Since the steps in this document create both clusters in the same Azure resource group, you can delete the resource group in the Azure portal. This removes all resources created by following this document, as well as the Azure Virtual Network and storage account used by the clusters.

## Next steps
In this document, you learned how to use Spark to read and write to Kafka. Use the following links to discover other ways to work with Kafka:

* [Get started with Apache Kafka on HDInsight](hdinsight-apache-kafka-get-started.md)
* [Use MirrorMaker to create a replica of Kafka on HDInsight](hdinsight-apache-kafka-mirroring.md)
* [Use Apache Storm with Kafka on HDInsight](hdinsight-apache-storm-with-kafka.md)

