---
title: Get started with Apache Kafka on HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: paulettm
editor: cgronlun

ms.assetid: 43585abf-bec1-4322-adde-6db21de98d7f
ms.service: hdinsight
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/09/2016
ms.author: larryfr
---
# Get started with Apache Kafka (preview) on HDInsight

[Apache Kafka](https://kafka.apache.org) is an open-source distributed streaming platform that is available with HDInsight. It is often used as a message broker, as it provides functionality similar to a publish-subscribe message queue. In this document, you learn how to create a Kafka on HDInsight cluster and then send and receive data from a Java application.

> [!NOTE]
> There are currently two versions of Kafka available with HDInsight; 0.9.0 (HDInsight 3.4) and 0.10.0 (HDInsight 3.5). The steps in this document assume that you are using Kafka on HDInsight 3.5.

## Prerequisite

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

You must have the following to successfully complete this Apache Storm tutorial:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

* **Familiarity with SSH and SCP**. For more information on using SSH and SCP with HDInsight, see the following documents:
  
   * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)
   
   * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

* [Java JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) or an equivalent, such as OpenJDK.

* [Apache Maven](http://maven.apache.org/) 

### Access control requirements

[!INCLUDE [access-control](../../includes/hdinsight-access-control-requirements.md)]

## Create a Kafka cluster

Use the following steps to create a Kafka on HDInsight cluster:

1. From the [Azure portal](https://portal.azure.com), select **+ NEW**, **Intelligence + Analytics**, and then select **HDInsight**.
   
    ![Create a HDInsight cluster](./media/hdinsight-apache-kafka-get-started/create-hdinsight.png)

2. From the **New HDInsight Cluster** blade, enter a **Cluster Name** and select the **Subscription** to use with this cluster.
   
    ![Select subscription](./media/hdinsight-apache-kafka-get-started/new-hdinsight-cluster-blade.png)

3. Use **Select Cluster Type** and select the following values on the **Cluster Type configuration** blade:
   
    * **Cluster Type**: Kafka

    * **Version**: Kafka 0.10.0 (HDI 3.5)

    * **Cluster Tier**: Standard
     
    Finally, use the **Select** button to save settings.
     
    ![Select cluster type](./media/hdinsight-apache-kafka-get-started/cluster-type.png)

4. Use **Credentials** to configure the cluster login and SSH user credentials.  Use the **Select** button to save settings.
   
    > [!NOTE]
    > The cluster login is used when accessing the cluster over the internet using HTTPS. The SSH user is used to connect to the cluster and interactively run commands.
   
    ![Configure cluster login](./media/hdinsight-apache-kafka-get-started/cluster-credentials.png)
   
    For more information on using SSH with HDInsight, see the following documents:
   
    * [Use SSH with HDInsight from a Linux, Unix, or MacOS client](hdinsight-hadoop-linux-use-ssh-unix.md)
   
    * [Use SSH with HDInsight from a Windows client](hdinsight-hadoop-linux-use-ssh-windows.md)

5. Use **Data Source** to configure the primary data store for the cluster. From the **Data Source** blade, use the following information to create a data store for the cluster:
   
    * Select **Create new** and then enter a name for the storage account.
    
    * Select **Location** and then select a location that is geographically close to you. This location is used to create both the storage account and the HDInsight cluster.
     
   Finally, use the **Select** button to save settings.
     
    ![Configure storage](./media/hdinsight-apache-kafka-get-started/configure-storage.png)

6. Use **Pricing**, and then set the **Number of Worker Nodes** to 2. Using 2 worker nodes helps reduce the cost of the cluster and is enough for this example. Use the **Select** button to save settings.
   
    ![Pricing](./media/hdinsight-apache-kafka-get-started/pricing.png)
   
    > [!NOTE]
    > The prices displayed in the portal may be different than the prices in the screenshot.

7. Use **Resource Group** to create a group, and enter the name in the field. Also select **Pin to dashboard**. When done, select **Create** to create the cluster.
   
    ![Resource group field](./media/hdinsight-apache-kafka-get-started/resource-group.png)
   
    > [!NOTE]
    > It can take up to 20 minutes to create the cluster.

## Connect to the cluster

From your client, use SSH to connect to the cluster. If you are using a Linux, Unix, MacOS, or Bash on Windows 10, use the following command:

    ssh SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net

Replace **SSHUSER** with the SSH username you provided during cluster creation. Replace **CLUSTERNAME** with the name of the cluster.

When prompted, enter the password you used for the SSH account.

For information on using SSH with HDInsight, see the following documents:

* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

##<a id="getkafkainfo"></a>Get the Zookeeper and Broker host information

When working with Kafka, you must know two host values; the *Zookeeper* hosts and the *Broker* hosts. These hosts are used with the Kafka API and many of the utilities that ship with Kafka.

Use the following steps to create environment variables that contain the host information. These environment variables are used in the steps in this document.

1. From an SSH connection to the cluster, use the following command to install the `jq` utility. This utility is used to parse JSON documents, and is useful in retrieving the broker host information:
   
        sudo apt -y install jq

2. use the following commands to set the environment variables with information retrieved from Ambari. Replace __KAFKANAME__ with the name of the Kafka cluster. Replace __PASSWORD__ with the login (admin) password you used when creating the cluster.

        export KAFKAZKHOSTS=`curl --silent -u admin:PASSWORD -G http://headnodehost:8080/api/v1/clusters/KAFKANAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")'`

        export KAFKABROKERS=`curl --silent -u admin:PASSWORD -G http://headnodehost:8080/api/v1/clusters/KAFKANAME/services/HDFS/components/DATANODE | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'`

        echo '$KAFKAZKHOSTS='$KAFKAZKHOSTS
        echo '$KAFKABROKERS='$KAFKABROKERS

    The following text is an example of the contents of `$KAFKAZKHOSTS`:
   
        zk0-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,zk2-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,zk3-kafka.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181
   
    The following text is an example of the contents of `$KAFKABROKERS`:
   
        wn1-kafka.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092,wn0-kafka.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092
   
    > [!WARNING]
    > Do not rely on the information returned from this session to always be accurate. If you scale the cluster, new brokers are added or removed. If a failure occurs and a node is replaced, the host name for the node may change. 
    > 
    > You should always retrieve the Zookeeper and broker hosts information shortly before you use it to ensure you have valid information.

## Create a topic

Kafka stores streams of data in categories called *topics*. From An SSH connection to a cluster headnode, use a script provided with Kafka to create a topic:

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 2 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS

This command connects to Zookeeper using the host information stored in `$KAFKAZKHOSTS`, and then create Kafka topic named **test**. You can verify that the topic was created by using the following script to list topics:

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper $KAFKAZKHOSTS

The output of this command lists Kafka topics, which contains the **test** topic.

## Produce and consume records

Kafka stores *records* in topics. Records are produced by *producers*, and consumed by *consumers*. Producers retrieve records from Kafka *brokers*. Each worker node in your HDInsight cluster is a Kafka broker.

Use the following steps to store records into the test topic you created earlier, and then read them using a consumer:

1. From the SSH session, use a script provided with Kafka to write records to the topic:
   
        /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic test
   
    You will not return to the prompt after this command. Instead, type a few text messages and then use **Ctrl + C** to stop sending to the topic. Each line is sent as a separate record.

2. Use a script provided with Kafka to read records from the topic:
   
        /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --zookeeper $KAFKAZKHOSTS --topic test --from-beginning
   
    This will retrieve the records from the topic and display them. Using `--from-beginning` tells the consumer to start from the beginning of the stream, so all records are retrieved.

3. Use __Ctrl + C__ to stop the consumer.

## Producer and consumer API

You can also programmatically produce and consume records using the [Kafka APIs](http://kafka.apache.org/documentation#api). Use the following steps to download, build a Java-based producer and consumer:

1. Download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started). For the producer/consumer example, use the project in the `Producer-Consumer` directory. Be sure to look through the code to understand how this example works. It contains the following classes:
   
    * **Run** - starts either the consumer or producer based on command line arguments.

    * **Producer** - stores 1,000,000 records to the topic.

    * **Consumer** - reads records from the topic.

2. From the command line in your development environment, change directories to the location of the `Producer-Consumer` directory of the example and then use the following command to create a jar package:
   
        mvn clean package
   
    This command creates a new directory named `target`, that contains a file named `kafka-producer-consumer-1.0-SNAPSHOT.jar`.

3. Use the following commands to copy the `kafka-producer-consumer-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
        scp ./target/kafka-producer-consumer-1.0-SNAPSHOT.jar SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net:kafka-producer-consumer.jar
   
    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. When prompted enter the password for the SSH user.

4. Once the `scp` command finishes copying the file, connect to the cluster using SSH, and then use the following to write records to the test topic you created earlier.
   
        ./kafka-producer-consumer.jar producer $KAFKABROKERS
   
    This will start the producer and write records. A counter is displayed so you can see how many records have been written.

    > [!NOTE]
    > If you receive a permission denied error, use the following command to make the file executable:
    > ```chmod +x kafka-producer-consumer.jar```

5. Once the process has finished, use the following command to read from the topic:
   
        ./kafka-producer-consumer.jar consumer $KAFKABROKERS
   
    The records read, along with a count of records, is displayed. You may see a few more than 1,000,000 logged as we sent several records to the topic using a script in an earlier step.

6. Use __Ctrl + C__ to exit the consumer.

### Multiple consumers

An important concept with Kafka is that consumers use a consumer group (defined by a group id) when reading records. Multiple consumers that use the same group load balance reads from a topic; each consumer will receive a portion of the records. To see this in action, use the following steps:

1. Open a new SSH session to the cluster, so that you have two of them. In each session, use the following to start a consumer with the same consumer group id:
   
        ./kafka-producer-consumer.jar consumer $KAFKABROKERS mygroup

    > [!NOTE]
    > Since this is a new SSH session, you will need to use the commands in the [Get the Zookeeper and Broker host information](#getkafkainfo) section to set `$KAFKABROKERS`.

2. Watch as each session counts the records it receives from the topic. The total of both sessions should be the same as you received previously from one consumer.

Consumption by clients within the same group is handled through the partitions for the topic. For the `test` topic created earlier, it has 8 partitions. If you open 8 SSH sessions and launch a consumer in all sessions, each consumer will read records from a single partition for the topic.

> [!IMPORTANT]
> There cannot be more consumer instances in a consumer group than partitions. In this example, one consumer group can contain up to 8 consumers since that is the number of partitions in the topic. Or you can have multiple consumer groups, each with no more than 8 consumers.

Records stored in Kafka are stored in the order they are received within a partition. To achieve in-ordered delivery for records *within a partition*, create a consumer group where the number of consumer instances matches the number of partitions. To achieve in-ordered delivery for records *within the topic*, create a consumer group with only one consumer instance.

## Streaming API

The streaming API was added to Kafka in version 0.10.0; earlier versions rely on Apache Spark or Storm for stream processing.

1. If you haven't already done so, download the examples from [https://github.com/Azure-Samples/hdinsight-kafka-java-get-started](https://github.com/Azure-Samples/hdinsight-kafka-java-get-started). For the streaming example, use the project in the `streaming` directory. Be sure to look through the code to understand how this example works. 
   
    This project contains only one class, `Stream`, which reads records from the `test` topic created previously. It counts the words read, and emits each word and count to a topic named `wordcounts`. The `wordcounts` topic is created in a later step in this section.

2. From the command-line in your development environment, change directories to the location of the `Streaming` directory, and then use the following command to create a jar package:
   
        mvn clean package
   
    This command creates a new directory named `target`, that contains a file named `kafka-streaming-1.0-SNAPSHOT.jar`.

3. Use the following commands to copy the `kafka-streaming-1.0-SNAPSHOT.jar` file to your HDInsight cluster:
   
        scp ./target/kafka-streaming-1.0-SNAPSHOT.jar SSHUSER@CLUSTERNAME-ssh.azurehdinsight.net:kafka-streaming.jar
   
    Replace **SSHUSER** with the SSH user for your cluster, and replace **CLUSTERNAME** with the name of your cluster. When prompted enter the password for the SSH user.

4. Once the `scp` command finishes copying the file, connect to the cluster using SSH, and then use the following to start the streaming process:
   
        ./kafka-streaming.jar $KAFKABROKERS $KAFKAZKHOSTS 2>/dev/null &
   
    This command starts the streaming process in the background.

5. Use the following to send messages to the `test` topic. These are processed by the streaming example:
   
        ./kafka-producer-consumer.jar producer $KAFKABROKERS &>/dev/null &

6. Use the following to view the output that is written to the `wordcounts` topic:
   
        /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --zookeeper $KAFKAZKHOSTS --topic wordcounts --from-beginning --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer
   
    > [!NOTE]
    > We have to tell the consumer to print the key (which contains the word value) and the deserializer to use for the key and value in order to view the data.
   
    The output is similar to the following:
   
        dwarfs  13635
        ago     13664
        snow    13636
        dwarfs  13636
        ago     13665
        a       13803
        ago     13666
        a       13804
        ago     13667
        ago     13668
        jumped  13640
        jumped  13641
        a       13805
        snow    13637
   
    Note that the count increments each time a word is encountered.

7. Use the __Ctrl + C__ to exit the consumer, then use the `fg` command to bring the streaming background task back to the foreground. Use __Ctrl + C__ to exit it also.

## Next steps

In this document, you have learned the basics of working with Apache Kafka on HDInsight. Use the following to learn more about working with Kafka:

* [Apache Kafka documentation](http://kafka.apache.org/documentation.html) at kafka.apache.org.
* [Use MirrorMaker to create a replica of Kafka on HDInsight](hdinsight-apache-kafka-mirroring.md)
* [Use Apache Storm with Kafka on HDInsight](hdinsight-apache-storm-with-kafka.md)
* [Use Apache Spark with Kafka on HDInsight](hdinsight-apache-spark-with-kafka.md)

