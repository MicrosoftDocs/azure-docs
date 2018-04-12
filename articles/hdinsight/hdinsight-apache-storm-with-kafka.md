---
title: Use Apache Kafka with Storm on HDInsight - Azure | Microsoft Docs
description: Learn how to create a streaming pipeline using Apache Storm and Apache Kafka on HDInsight. In this tutorial, you use the KafkaBolt and KafkaSpout components to stream data from Kafka.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: cgronlun
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: java
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/06/2018
ms.author: larryfr
#Customer intent: As a developer, I want to learn how to build a streaming pipeline that uses Storm and Kafka to process streaming data.
---
# Tutorial: Use Apache Storm with Kafka on HDInsight

This tutorial demonstrates how to use an Apache Storm topology to read and write data with Apache Kafka on HDInsight. This tutorial also demonstrates how to persist data to the HDFS-compatible storage on the Storm cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create Kafka and Storm clusters
> * Configure development environment
> * Understand the code
> * Create Kafka topic
> * Start the reader topology
> * Start the writer topology
> * Stop the topologies
> * Clean up resources

> [!IMPORTANT]
> The steps in this document require an Azure resource group that contains both a Storm on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Storm cluster to directly communicate with the Kafka cluster.
> 
> If you already have a virtual network that contains a Kafka cluster, you can create a Storm cluster in the same virtual network. For your convenience, this document also provides a template that can create all the required Azure resources.

## Create the clusters

Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that uses Kafka must be in the same Azure virtual network. In this tutorial, both the Kafka and Storm clusters are located in the same Azure virtual network. 

The following diagram shows how communication flows between Storm and Kafka:

![Diagram of Storm and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-storm-with-kafka/storm-kafka-vnet.png)

> [!NOTE]
> Other services on the cluster such as SSH and Ambari can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).

To create an Azure Virtual Network, and then create the Kafka and Storm clusters within it, use the following steps:

1. Use the following button to sign in to Azure and open the template in the Azure portal.
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-storm-java-kafka%2Fmaster%2Fcreate-kafka-storm-clusters-in-vnet.json" target="_blank"><img src="./media/hdinsight-apache-storm-with-kafka/deploy-to-azure.png" alt="Deploy to Azure"></a>
   
    The Azure Resource Manager template is located at **https://github.com/Azure-Samples/hdinsight-storm-java-kafka/blob/master/create-kafka-storm-clusters-in-vnet.json**. It creates the following resources:
    
    * Azure resource group
    * Azure Virtual Network
    * Azure Storage account
    * Kafka on HDInsight version 3.6 (three worker nodes)
    * Storm on HDInsight version 3.6 (three worker nodes)

  > [!WARNING]
  > To guarantee availability of Kafka on HDInsight, your cluster must contain at least three worker nodes. This template creates a Kafka cluster that contains three worker nodes.

2. Use the following guidance to populate the entries on the **Custom deployment** section:

    2. Use the following information to populate the entries on the **Customized template** section:

    | Setting | Value |
    | --- | --- |
    | Subscription | Your Azure subscription |
    | Resource group | The resource group that contains the resources. |
    | Location | The Azure region that the resources are created in. |
    | Kafka Cluster Name | The name of the Kafka cluster. |
    | Storm Cluster Name | The name of the Storm cluster. |
    | Cluster Login User Name | The admin user name for the clusters. |
    | Cluster Login Password | The admin user password for the clusters. |
    | SSH User Name | The SSH user to create for the clusters. |
    | SSH Password | The password for the SSH user. |
   
    ![Picture of the template parameters](./media/hdinsight-apache-storm-with-kafka/storm-kafka-template.png)

3. Read the **Terms and Conditions**, and then select **I agree to the terms and conditions stated above**.

4. Finally, check **Pin to dashboard** and then select **Purchase**.

> [!NOTE]
> It can take up to 20 minutes to create the clusters.

## Configure development environment

The code for the example used in this document is available at [https://github.com/Azure-Samples/hdinsight-storm-java-kafka](https://github.com/Azure-Samples/hdinsight-storm-java-kafka).

To compile this project, you need the following configuration for your development environment:

* [Java JDK 1.8](http://www.oracle.com/technetwork/pt/java/javase/downloads/jdk8-downloads-2133151.html) or higher. HDInsight 3.5 or higher require Java 8.

* [Maven 3.x](https://maven.apache.org/download.cgi)

* An SSH client (you need the `ssh` and `scp` commands) - For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

* A text editor or IDE.

The following environment variables may be set when you install Java and the JDK on your development workstation. However, you should check that they exist and that they contain the correct values for your system.

* `JAVA_HOME` - should point to the directory where the JDK is installed.
* `PATH` - should contain the following paths:
  
    * `JAVA_HOME` (or the equivalent path).
    * `JAVA_HOME\bin` (or the equivalent path).
    * The directory where Maven is installed.

## Understanding the code

This project contains two topologies:

* **KafkaWriter**: Defined by the **writer.yaml** file, this topology writes random sentences to Kafka using the KafkaBolt provided with Apache Storm.

    This topology uses a custom **SentenceSpout** component to generate random sentences.

* **KafkaReader**: Defined by the **reader.yaml** file, this topology reads data from Kafka using the KafkaSpout provided with Apache Storm. It then uses the HDFSBolt component from Storm to write the data to the HDFS compatible storage of the Storm cluster.

* **HDFSBolt**: The HDFSBolt component is provided with Apache Storm. To enable the HDFSBolt component to work with the HDFS compatible storage used by HDInsight, a script action is required. The script installs several jar files to the `extlib` path for Storm. The template in this tutorial automatically uses the script during cluster creation.

    > [!WARNING]
    > If you did not use the template in this document to create the Storm cluster, then you must manually apply the script action to your cluster.

    The script action is located at `https://hdiconfigactions2.blob.core.windows.net/stormextlib/stormextlib.sh` and is applied to the supervisor and nimbus nodes of the Storm cluster.

    For more information on using script actions, see the [Customize HDInsight using script actions](hdinsight-hadoop-customize-cluster-linux.md) document.

### Flux

The topologies are defined using [Flux](https://storm.apache.org/releases/1.1.2/flux.html). Flux was introduced in Storm 0.10.x and allows you to separate the topology configuration from the code. For Topologies that use the Flux framework, the topology is defined in a YAML file. The YAML file can be included as part of the topology. It can also be a standalone file used when you submit the topology. Flux also supports variable substitution at run-time, which is used in this example.

The following parameters are set at run time for these topologies:

* `${kafka.topic}`: The name of the Kafka topic that the topologies read/write to.

* `${kafka.broker.hosts}`: The hosts that the Kafka brokers run on. The broker information is used by the KafkaBolt when writing to Kafka.

* `${kafka.zookeeper.hosts}`: The hosts that Zookeeper runs on in the Kafka cluster.

* `${hdfs.url}`: The file system URL for the HDFSBolt component. Indicates whether the data is written to an Azure Storage account or Azure Data Lake Store.

* `${hdfs.write.dir}`: The directory that data is written to.

For more information on Flux topologies, see [https://storm.apache.org/releases/1.1.2/flux.html](https://storm.apache.org/releases/1.1.2/flux.html).

## Build the topology

1. On your development environment, download the project from [https://github.com/Azure-Samples/hdinsight-storm-java-kafka](https://github.com/Azure-Samples/hdinsight-storm-java-kafka), open a command-line, and change directories to the location that you downloaded the project.

2. From the **hdinsight-storm-java-kafka** directory, use the following command to compile the project and create a package for deployment:

  ```bash
  mvn clean package
  ```

    The package process creates a file named `KafkaTopology-1.0-SNAPSHOT.jar` in the `target` directory.

3. Use the following commands to copy the package to your Storm on HDInsight cluster. Replace **sshuser** with the SSH user name for the cluster. Replace **stormclustername** with the name of the __Storm__ cluster.

  ```bash
  scp ./target/KafkaTopology-1.0-SNAPSHOT.jar sshuser@stormclustername-ssh.azurehdinsight.net:KafkaTopology-1.0-SNAPSHOT.jar
  ```

    When prompted, enter the password you used when creating the clusters.

## Configure the topology

1. Use one of the following methods to discover the Kafka broker hosts for the **Kafka** on HDInsight cluster:

    ```powershell
    $creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
    $clusterName = Read-Host -Prompt "Enter the Kafka cluster name"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER" `
        -Credential $creds `
        -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $brokerHosts = $respObj.host_components.HostRoles.host_name[0..1]
    ($brokerHosts -join ":9092,") + ":9092"
    ```

    > [!IMPORTANT]
    > The following Bash example assumes that `$CLUSTERNAME` contains the name of the __Kafka__ cluster name. It also assumes that [jq](https://stedolan.github.io/jq/) version 1.5 or greater is installed. When prompted, enter the password for the cluster login account.

    ```bash
    curl -su admin -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2
    ```

    The value returned is similar to the following text:

        wn0-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:9092,wn1-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:9092

    > [!IMPORTANT]
    > While there may be more than two broker hosts for your cluster, you do not need to provide a full list of all hosts to clients. One or two is enough.

2. Use one of the following methods to discover the Zookeeper hosts for the __Kafka__ on HDInsight cluster:

    ```powershell
    $creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
    $clusterName = Read-Host -Prompt "Enter the Kafka cluster name"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" `
        -Credential $creds `
        -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $zookeeperHosts = $respObj.host_components.HostRoles.host_name[0..1]
    ($zookeeperHosts -join ":2181,") + ":2181"
    ```

    > [!IMPORTANT]
    > The following Bash example assumes that `$CLUSTERNAME` contains the name of the __Kafka__ cluster. It also assumes that [jq](https://stedolan.github.io/jq/) is installed. When prompted, enter the password for the cluster login account.

    ```bash
    curl -su admin -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2
    ```

    The value returned is similar to the following text:

        zk0-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:2181,zk2-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:2181

    > [!IMPORTANT]
    > While there are more than two Zookeeper nodes, you do not need to provide a full list of all hosts to clients. One or two is enough.

    Save this value, as it is used later.

3. Edit the `dev.properties` file in the root of the project. Add the Broker and Zookeeper hosts information for the __Kafka__ cluster to the matching lines in this file. The following example is configured using the sample values from the previous steps:

        kafka.zookeeper.hosts: zk0-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:2181,zk2-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:2181
        kafka.broker.hosts: wn0-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:9092,wn1-kafka.53qqkiavjsoeloiq3y1naf4hzc.ex.internal.cloudapp.net:9092
        kafka.topic: stormtopic

    > [!IMPORTANT]
    > The `hdfs.url` entry is configured for a cluster that uses an Azure Storage account. To use this topology with a Storm cluster that uses Data Lake Store, change this value from `wasb` to `adl`.

4. Save the `dev.properties` file and then use the following command to upload it to the **Storm** cluster:

     ```bash
    scp dev.properties USERNAME@storm-BASENAME-ssh.azurehdinsight.net:dev.properties
    ```

    Replace **USERNAME** with the SSH user name for the cluster. Replace **BASENAME** with the base name you used when creating the cluster.

## Create the Kafka topic

Kafka stores data into a _topic_. You need to create the topic before starting the Storm topologies. To create the topology, use the following steps:

1. Connect to the __Kafka__ cluster through SSH by using the following command. Replace **sshuser** with the SSH user name used when creating the cluster. Replace **kafkaclustername** with the name of the Kafka cluster:

    ```bash
    ssh sshuser@kafkaclustername-ssh.azurehdinsight.net
    ```

    When prompted, enter the password you used when creating the clusters.
   
    For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. To create the Kafka topic, use the following command. Replace `$KAFKAZKHOSTS` with the Zookeeper host information you used when configuring the topology:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic stormtopic --zookeeper $KAFKAZKHOSTS
    ```

    This command connects to Zookeeper for the Kafka cluster and creates a new topic named `stormtopic`. This topic is used by the Storm topologies.

## Start the writer

1. Use the following to connect to the **Storm** cluster using SSH. Replace **sshuser** with the SSH user name used when creating the cluster. Replace **stormclustername** with the name the Storm cluster:

    ```bash
    ssh sshuser@stormclustername-ssh.azurehdinsight.net
    ```

    When prompted, enter the password you used when creating the clusters.
   
    For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. From the SSH connection to the Storm cluster, use the following command to start the writer topology:

    ```bash
    storm jar KafkaTopology-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /writer.yaml --filter dev.properties
    ```

    The parameters used with this command are:

    * `org.apache.storm.flux.Flux`: Use Flux to configure and run this topology.

    * `--remote`: Submit the topology to Nimbus. The topology is distributed across the worker nodes in the cluster.

    * `-R /writer.yaml`: Use the `writer.yaml` file to configure the topology. `-R` indicates that this resource is included in the jar file. It's in the root of the jar, so `/writer.yaml` is the path to it.

    * `--filter`: Populate entries in the `writer.yaml` topology using values in the `dev.properties` file. For example, the value of the `kafka.topic` entry in the file is used to replace the `${kafka.topic}` entry in the topology definition.

## Start the reader

1. From the SSH session to the Storm cluster, use the following command to start the reader topology:

  ```bash
  storm jar KafkaTopology-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux --remote -R /reader.yaml --filter dev.properties
  ```

2. Wait a minute and then use the following command to view the files created by the reader topology:

    ```bash
    hdfs dfs -ls /stormdata
    ```

    The output is similar to the following text:

        Found 173 items
        -rw-r--r--   1 storm supergroup       5137 2018-04-09 19:00 /stormdata/hdfs-bolt-4-0-1523300453088.txt
        -rw-r--r--   1 storm supergroup       5128 2018-04-09 19:00 /stormdata/hdfs-bolt-4-1-1523300453624.txt
        -rw-r--r--   1 storm supergroup       5131 2018-04-09 19:00 /stormdata/hdfs-bolt-4-10-1523300455170.txt
        ...

3. To view the contents of the file, use the following command. Replace `filename.txt` with the name of a file:

    ```bash
    hdfs dfs -cat /stormdata/filename.txt
    ```

    The following text is an example of the file contents:

        four score and seven years ago
        snow white and the seven dwarfs
        i am at two with nature
        snow white and the seven dwarfs
        i am at two with nature
        four score and seven years ago
        an apple a day keeps the doctor away

## Stop the topologies

From an SSH session to the Storm cluster, use the following commands to stop the Storm topologies:

  ```bash
  storm kill kafka-writer
  storm kill kafka-reader
  ```

## Clean up resources

To clean up the resources created by this tutorial, you can delete the resource group. Deleting the resource group also deletes the associated HDInsight cluster, and any other resources associated with the resource group.

To remove the resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and then choose __Resource Groups__ to display the list of your resource groups.
2. Locate the resource group to delete, and then right-click the __More__ button (...) on the right side of the listing.
3. Select __Delete resource group__, and then confirm.

> [!WARNING]
> HDInsight cluster billing starts once a cluster is created and stops when the cluster is deleted. Billing is pro-rated per minute, so you should always delete your cluster when it is no longer in use.
> 
> Deleting a Kafka on HDInsight cluster deletes any data stored in Kafka.

## Next steps

In this tutorial, you learned how to use a Storm topology to write to and read from Kafka on HDInsight. You also learned how to store data to the HDFS compatible storage used by HDInsight.

To learn more about using Kafka on HDInsight, see the [Use Kafka Producer and Consumer API](kafka/apache-kafka-producer-consumer-api.md) document.

For information on deploying and monitoring topologies on Linux-based HDInsight, see [Deploy and manage Apache Storm topologies on Linux-based HDInsight](storm/apache-storm-deploy-monitor-topology-linux.md)
