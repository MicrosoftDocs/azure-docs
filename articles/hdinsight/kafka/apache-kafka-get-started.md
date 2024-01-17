---
title: 'Quickstart: Set up Apache Kafka on HDInsight using Azure portal'
description: In this quickstart, you learn how to create an Apache Kafka cluster on Azure HDInsight using the Azure portal. You also learn about Kafka topics, subscribers, and consumers.
ms.service: hdinsight
ms.topic: quickstart
ms.custom: mvc, mode-ui
ms.date: 11/23/2023
#Customer intent: I need to create a Kafka cluster so that I can use it to process streaming data
---

# Quickstart: Create Apache Kafka cluster in Azure HDInsight using Azure portal

[Apache Kafka](./apache-kafka-introduction.md) is an open-source, distributed streaming platform. It's often used as a message broker, as it provides functionality similar to a publish-subscribe message queue.

In this Quickstart, you learn how to create an Apache Kafka cluster using the Azure portal. You also learn how to use included utilities to send and receive messages using Apache Kafka. For in depth explanations of available configurations, see [Set up clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md). For additional information regarding the use of the portal to create clusters, see [Create clusters in the portal](../hdinsight-hadoop-create-linux-clusters-portal.md).

[!INCLUDE [delete-cluster-warning](../includes/hdinsight-delete-cluster-warning.md)]

The Apache Kafka API can only be accessed by resources inside the same virtual network. In this Quickstart, you access the cluster directly using SSH. To connect other services, networks, or virtual machines to Apache Kafka, you must first create a virtual network and then create the resources within the network. For more information, see the [Connect to Apache Kafka using a virtual network](apache-kafka-connect-vpn-gateway.md) document. For more general information on planning virtual networks for HDInsight, see [Plan a virtual network for Azure HDInsight](../hdinsight-plan-virtual-network-deployment.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Create an Apache Kafka cluster

To create an Apache Kafka cluster on HDInsight, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the top menu, select **+ Create a resource**.

    :::image type="content" source="./media/apache-kafka-get-started/azure-portal-create-resource.png" alt-text="Azure portal create resource HDInsight" border="true":::

1. Select **Analytics** > **Azure HDInsight** to go to the **Create HDInsight cluster** page.

1. From **the Basics** tab, provide the following information:

    |Property  |Description  |
    |---------|---------|
    |Subscription    |  From the drop-down list, select the Azure subscription that's used for the cluster. |
    |Resource group     | Create a resource group or select an existing resource group.  A resource group is a container of Azure components.  In this case, the resource group contains the HDInsight cluster and the dependent Azure Storage account. |
    |Cluster name   | Enter a globally unique name. The name can consist of up to 59 characters including letters, numbers, and hyphens. The first and last characters of the name cannot be hyphens. |
    |Region    | From the drop-down list, select a region where the cluster is created.  Choose a region closer to you for better performance. |
    |Cluster type| Select **Select cluster type** to open a list. From the list, select **Kafka** as the cluster type.|
    |Version|The default version for the cluster type will be specified. Select from the drop-down list if you wish to specify a different version.|
    |Cluster login username and password    | The default login name is `admin`. The password must be at least 10 characters in length and must contain at least one digit, one uppercase, and one lowercase letter, one non-alphanumeric character (except characters ```' ` "```). Make sure you **do not provide** common passwords such as `Pass@word1`.|
    |Secure Shell (SSH) username | The default username is `sshuser`.  You can provide another name for the SSH username. |
    |Use cluster login password for SSH| Select this check box to use the same password for SSH user as the one you provided for the cluster login user.|

   :::image type="content" source="./media/apache-kafka-get-started/azure-portal-cluster-basics.png" alt-text="Azure portal create cluster basics" border="true":::

    Each Azure region (location) provides _fault domains_. A fault domain is a logical grouping of underlying hardware in an Azure data center. Each fault domain shares a common power source and network switch. The virtual machines and managed disks that implement the nodes within an HDInsight cluster are distributed across these fault domains. This architecture limits the potential impact of physical hardware failures.

    For high availability of data, select a region (location) that contains __three fault domains__. For information on the number of fault domains in a region, see the [Availability of Linux virtual machines](../../virtual-machines/availability.md) document.

    Select the **Next: Storage >>** tab to advance to the storage settings.

1. From the **Storage** tab, provide the following values:

    |Property  |Description  |
    |---------|---------|
    |Primary storage type|Use the default value **Azure Storage**.|
    |Selection method|Use the default value **Select from list**.|
    |Primary storage account|Use the drop-down list to select an existing storage account, or select **Create new**. If you create a new account, the name must be between 3 and 24 characters in length, and can include numbers and lowercase letters only|
    |Container|Use the auto-populated value.|

    :::image type="content" source="./media/apache-kafka-get-started/azure-portal-cluster-storage.png " alt-text="HDInsight Linux get started provide cluster storage values" border="true":::

    Select the **Security + networking** tab.

1. For this Quickstart, leave the default security settings. To learn more about Enterprise Security package, visit [Configure a HDInsight cluster with Enterprise Security Package by using Microsoft Entra Domain Services](../domain-joined/apache-domain-joined-configure-using-azure-adds.md). To learn how to use your own key for Apache Kafka Disk Encryption, visit [Customer-managed key disk encryption](../disk-encryption.md)

   If you would like to connect your cluster to a virtual network, select a virtual network from the **Virtual network** dropdown.

   :::image type="content" source="./media/apache-kafka-get-started/azure-portal-cluster-security-networking-kafka-vnet.png" alt-text="Add cluster to a virtual network" border="true":::

    Select the **Configuration + pricing** tab.

1. To guarantee availability of Apache Kafka on HDInsight, the __number of nodes__ entry for **Worker node** must be set to 3 or greater. The default value is 4.

    The **Standard disks per worker node** entry configures the scalability of Apache Kafka on HDInsight. Apache Kafka on HDInsight uses the local disk of the virtual machines in the cluster to store data. Apache Kafka is I/O heavy, so [Azure Managed Disks](../../virtual-machines/managed-disks-overview.md) are used to provide high throughput and more storage per node. The type of managed disk can be either __Standard__ (HDD) or __Premium__ (SSD). The type of disk depends on the VM size used by the worker nodes (Apache Kafka brokers). Premium disks are used automatically with DS and GS series VMs. All other VM types use standard.

   :::image type="content" source="./media/apache-kafka-get-started/azure-portal-cluster-configuration-pricing-kafka.png" alt-text="Set the Apache Kafka cluster size" border="true":::

    Select the **Review + create** tab.

1. Review the configuration for the cluster. Change any settings that are incorrect. Finally, select **Create** to create the cluster.

    :::image type="content" source="./media/apache-kafka-get-started/azure-hdinsight-50-portal-cluster-review-create-kafka.png" alt-text="Screenshot showing kafka cluster configuration summary for HDI version 5.0." border="true":::


    It can take up to 20 minutes to create the cluster.

## Connect to the cluster

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. When prompted, enter the password for the SSH user.

    Once connected, you see information similar to the following text:

    ```output
    Authorized uses only. All activity may be monitored and reported.
    Welcome to Ubuntu 16.04.4 LTS (GNU/Linux 4.13.0-1011-azure x86_64)

     * Documentation:  https://help.ubuntu.com
     * Management:     https://landscape.canonical.com
     * Support:        https://ubuntu.com/advantage

      Get cloud support with Ubuntu Advantage Cloud Guest:
        https://www.ubuntu.com/business/services/cloud

    83 packages can be updated.
    37 updates are security updates.


    Welcome to Apache Kafka on HDInsight.

    Last login: Thu Mar 29 13:25:27 2018 from 108.252.109.241
    ```

## <a id="getkafkainfo"></a>Get the Apache Zookeeper and Broker host information

When working with Kafka, you must know the *Apache Zookeeper* and *Broker* hosts. These hosts are used with the Apache Kafka API and many of the utilities that ship with Kafka.

In this section, you get the host information from the Apache Ambari REST API on the cluster.

1. Install [jq](https://stedolan.github.io/jq/), a command-line JSON processor. This utility is used to parse JSON documents, and is useful in parsing the host information. From the open SSH connection, enter following command to install `jq`:

    ```bash
    sudo apt -y install jq
    ```

1. Set up password variable. Replace `PASSWORD` with the cluster login password, then enter the command:

    ```bash
    export PASSWORD='PASSWORD'
    ```

1. Extract the correctly cased cluster name. The actual casing of the cluster name may be different than you expect, depending on how the cluster was created. This command will obtain the actual casing, and then store it in a variable. Enter the following command:

    ```bash
    export CLUSTER_NAME=$(curl -u admin:$PASSWORD -sS -G "http://headnodehost:8080/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')
    ```

    > [!Note]  
    > If you're doing this process from outside the cluster, there is a different procedure for storing the cluster name. Get the cluster name in lower case from the Azure portal. Then, substitute the cluster name for `<clustername>` in the following command and execute it: `export clusterName='<clustername>'`.


1. To set an environment variable with Zookeeper host information, use the command below. The command retrieves all Zookeeper hosts, then returns only the first two entries. This is because you want some redundancy in case one host is unreachable.

    ```bash
    export KAFKAZKHOSTS=$(curl -sS -u admin:$PASSWORD -G https://$CLUSTER_NAME.azurehdinsight.net/api/v1/clusters/$CLUSTER_NAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2);
    ```

    > [!Note]  
    > This command requires Ambari access. If your cluster is behind an NSG, run this command from a machine that can access Ambari.

1. To verify that the environment variable is set correctly, use the following command:

    ```bash
    echo $KAFKAZKHOSTS
    ```

    This command returns information similar to the following text:

    `<zookeepername1>.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,<zookeepername2>.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181`

1. To set an environment variable with Apache Kafka broker host information, use the following command:

    ```bash
    export KAFKABROKERS=$(curl -sS -u admin:$PASSWORD -G https://$CLUSTER_NAME.azurehdinsight.net/api/v1/clusters/$CLUSTER_NAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2);
    ```

    > [!Note]  
    > This command requires Ambari access. If your cluster is behind an NSG, run this command from a machine that can access Ambari.

1. To verify that the environment variable is set correctly, use the following command:

    ```bash
    echo $KAFKABROKERS
    ```

    This command returns information similar to the following text:

    `<brokername1>.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092,<brokername2>.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092`

## Manage Apache Kafka topics

Kafka stores streams of data in *topics*. You can use the `kafka-topics.sh` utility to manage topics.

* **To create a topic**, use the following command in the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS
    ```

    This command connects to Zookeeper using the host information stored in `$KAFKAZKHOSTS`. It then creates an Apache  Kafka topic named **test**.

    * Data stored in this topic is partitioned across eight partitions.

    * Each partition is replicated across three worker nodes in the cluster.

        * If you created the cluster in an Azure region that provides three fault domains, use a replication factor of 3. Otherwise, use a replication factor of 4.
        
        * In regions with three fault domains, a replication factor of 3 allows replicas to be spread across the fault domains. In regions with two fault domains, a replication factor of four spreads the replicas evenly across the domains.
        
        * For information on the number of fault domains in a region, see the [Availability of Linux virtual machines](../../virtual-machines/availability.md) document.

        * Apache Kafka is not aware of Azure fault domains. When creating partition replicas for topics, it may not distribute replicas properly for high availability.

        * To ensure high availability, use the [Apache Kafka partition rebalance tool](https://github.com/hdinsight/hdinsight-kafka-tools). This tool must be ran from an SSH connection to the head node of your Apache Kafka cluster.

        * For the highest availability of your Apache Kafka data, you should rebalance the partition replicas for your topic when:

            * You create a new topic or partition

            * You scale up a cluster

* **To list topics**, use the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper $KAFKAZKHOSTS
    ```

    This command lists the topics available on the Apache Kafka cluster.

* **To delete a topic**, use the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --delete --topic topicname --zookeeper $KAFKAZKHOSTS
    ```

    This command deletes the topic named `topicname`.

    > [!WARNING]  
    > If you delete the `test` topic created earlier, then you must recreate it. It is used by steps later in this document.

For more information on the commands available with the `kafka-topics.sh` utility, use the following command:

```bash
/usr/hdp/current/kafka-broker/bin/kafka-topics.sh
```

## Produce and consume records

Kafka stores *records* in topics. Records are produced by *producers*, and consumed by *consumers*. Producers and consumers communicate with the *Kafka broker* service. Each worker node in your HDInsight cluster is an Apache  Kafka broker host.

To store records into the test topic you created earlier, and then read them using a consumer, use the following steps:

1. To write records to the topic, use the `kafka-console-producer.sh` utility from the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic test
    ```

    After this command, you arrive at an empty line.

2. Type a text message on the empty line and hit enter. Enter a few messages this way, and then use **Ctrl + C** to return to the normal prompt. Each line is sent as a separate record to the Apache Kafka topic.

3. To read records from the topic, use the `kafka-console-consumer.sh` utility from the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic test --from-beginning
    ```

    This command retrieves the records from the topic and displays them. Using `--from-beginning` tells the consumer to start from the beginning of the stream, so all records are retrieved.

    If you are using an older version of Kafka, replace `--bootstrap-server $KAFKABROKERS` with `--zookeeper $KAFKAZKHOSTS`.

4. Use __Ctrl + C__ to stop the consumer.

You can also programmatically create producers and consumers. For an example of using this API, see the [Apache Kafka Producer and Consumer API with HDInsight](apache-kafka-producer-consumer-api.md) document.

## Clean up resources

To clean up the resources created by this quickstart, you can delete the resource group. Deleting the resource group also deletes the associated HDInsight cluster, and any other resources associated with the resource group.

To remove the resource group using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and then choose __Resource Groups__ to display the list of your resource groups.
2. Locate the resource group to delete, and then right-click the __More__ button (...) on the right side of the listing.
3. Select __Delete resource group__, and then confirm.

> [!WARNING]  
> Deleting an Apache Kafka cluster on HDInsight deletes any data stored in Kafka.

## Next steps

> [!div class="nextstepaction"]
> [Use Apache Spark with Apache Kafka](../hdinsight-apache-kafka-spark-structured-streaming.md)
