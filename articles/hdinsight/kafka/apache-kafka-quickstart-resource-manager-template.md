---
title: 'Quickstart: Apache Kafka using Azure Resource Manager - HDInsight'
description: In this quickstart, you learn how to create an Apache Kafka cluster on Azure HDInsight using Azure Resource Manager template. You also learn about Kafka topics, subscribers, and consumers.
ms.service: hdinsight
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 09/15/2023
#Customer intent: I need to create a Kafka cluster so that I can use it to process streaming data
---

# Quickstart: Create Apache Kafka cluster in Azure HDInsight using ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an [Apache Kafka](./apache-kafka-introduction.md) cluster in Azure HDInsight. Kafka is an open-source, distributed streaming platform. It's often used as a message broker, as it provides functionality similar to a publish-subscribe message queue.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

The Kafka API can only be accessed by resources inside the same virtual network. In this quickstart, you access the cluster directly using SSH. To connect other services, networks, or virtual machines to Kafka, you must first create a virtual network and then create the resources within the network. For more information, see the [Connect to Apache Kafka using a virtual network](apache-kafka-connect-vpn-gateway.md) document.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-kafka%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-kafka/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.hdinsight/hdinsight-kafka/azuredeploy.json":::

Two Azure resources are defined in the template:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

## Deploy the template

1. Select the **Deploy to Azure** button below to sign in to Azure and open the ARM template.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-kafka%2Fazuredeploy.json":::

1. Enter or select the following values:

    |Property |Description |
    |---|---|
    |Subscription|From the drop-down list, select the Azure subscription that's used for the cluster.|
    |Resource group|From the drop-down list, select your existing resource group, or select **Create new**.|
    |Location|The value will autopopulate with the location used for the resource group.|
    |Cluster Name|Enter a globally unique name. For this template, use only lowercase letters, and numbers.|
    |Cluster Login User Name|Provide the username, default is `admin`.|
    |Cluster Login Password|Provide a password. The password must be at least 10 characters in length and must contain at least one digit, one uppercase, and one lower case letter, one non-alphanumeric character (except characters ```' ` "```). |
    |Ssh User Name|Provide the username, default is `sshuser`.|
    |Ssh Password|Provide the password.|

    :::image type="content" source="./media/apache-kafka-quickstart-resource-manager-template/resource-manager-template-kafka.png" alt-text="A screenshot of the template properties." border="false":::

1. Review the **TERMS AND CONDITIONS**. Then select **I agree to the terms and conditions stated above**, then **Purchase**. You'll receive a notification that your deployment is in progress. It takes about 20 minutes to create a cluster.

## Review deployed resources

Once the cluster is created, you'll receive a **Deployment succeeded** notification with a **Go to resource** link. Your Resource group page will list your new HDInsight cluster and the default storage associated with the cluster. Each cluster has an [Azure Blob Storage](../hdinsight-hadoop-use-blob-storage.md) account, an [Azure Data Lake Storage Gen1](../hdinsight-hadoop-use-data-lake-storage-gen1.md), or an  [`Azure Data Lake Storage Gen2`](../hdinsight-hadoop-use-data-lake-storage-gen2.md) dependency. It's referred as the default storage account. The HDInsight cluster and its default storage account must be colocated in the same Azure region. Deleting clusters doesn't delete the storage account.

## Get the Apache Zookeeper and Broker host information

When working with Kafka, you must know the *Apache Zookeeper* and *Broker* hosts. These hosts are used with the Kafka API and many of the utilities that ship with Kafka.

In this section, you get the host information from the Ambari REST API on the cluster.

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From the SSH connection, use the following command to install the `jq` utility. This utility is used to parse JSON documents, and is useful in retrieving the host information:

    ```bash
    sudo apt -y install jq
    ```

1. To set an environment variable to the cluster name, use the following command:

    ```bash
    read -p "Enter the Kafka on HDInsight cluster name: " CLUSTERNAME
    ```

    When prompted, enter the name of the Kafka cluster.

1. To set an environment variable with Zookeeper host information, use the command below. The command retrieves all Zookeeper hosts, then returns only the first two entries. This is because you want some redundancy in case one host is unreachable.

    ```bash
    export KAFKAZKHOSTS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2`
    ```

    When prompted, enter the password for the cluster login account (not the SSH account).

1. To verify that the environment variable is set correctly, use the following command:

    ```bash
     echo '$KAFKAZKHOSTS='$KAFKAZKHOSTS
    ```

    This command returns information similar to the following text:

    `<zookeepername1>.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181,<zookeepername2>.eahjefxxp1netdbyklgqj5y1ud.ex.internal.cloudapp.net:2181`

1. To set an environment variable with Kafka broker host information, use the following command:

    ```bash
    export KAFKABROKERS=`curl -sS -u admin -G https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`
    ```

    When prompted, enter the password for the cluster login account (not the SSH account).

1. To verify that the environment variable is set correctly, use the following command:

    ```bash
    echo '$KAFKABROKERS='$KAFKABROKERS
    ```

    This command returns information similar to the following text:

    `<brokername1>.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092,<brokername2>.eahjefxxp1netdbyklgqj5y1ud.cx.internal.cloudapp.net:9092`

## Manage Apache Kafka topics

Kafka stores streams of data in *topics*. You can use the `kafka-topics.sh` utility to manage topics.

* **To create a topic**, use the following command in the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic test --zookeeper $KAFKAZKHOSTS
    ```

    This command connects to Zookeeper using the host information stored in `$KAFKAZKHOSTS`. It then creates a Kafka topic named **test**.

    * Data stored in this topic is partitioned across eight partitions.

    * Each partition is replicated across three worker nodes in the cluster.

        If you created the cluster in an Azure region that provides three fault domains, use a replication factor of 3. Otherwise, use a replication factor of 4.
        
        In regions with three fault domains, a replication factor of 3 allows replicas to be spread across the fault domains. In regions with two fault domains, a replication factor of four spreads the replicas evenly across the domains.
        
        For information on the number of fault domains in a region, see the [Availability of Linux virtual machines](../../virtual-machines/availability.md) document.

        Kafka isn't aware of Azure fault domains. When creating partition replicas for topics, it may not distribute replicas properly for high availability.

        To ensure high availability, use the [Apache Kafka partition rebalance tool](https://github.com/hdinsight/hdinsight-kafka-tools). This tool must be ran from an SSH connection to the head node of your Kafka cluster.

        For the highest availability of your Kafka data, you should rebalance the partition replicas for your topic when:

        * You create a new topic or partition

        * You scale up a cluster

* **To list topics**, use the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper $KAFKAZKHOSTS
    ```

    This command lists the topics available on the Kafka cluster.

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

Kafka stores *records* in topics. Records are produced by *producers*, and consumed by *consumers*. Producers and consumers communicate with the *Kafka broker* service. Each worker node in your HDInsight cluster is a Kafka broker host.

To store records into the test topic you created earlier, and then read them using a consumer, use the following steps:

1. To write records to the topic, use the `kafka-console-producer.sh` utility from the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic test
    ```

    After this command, you arrive at an empty line.

1. Type a text message on the empty line and hit enter. Enter a few messages this way, and then use **Ctrl + C** to return to the normal prompt. Each line is sent as a separate record to the Kafka topic.

1. To read records from the topic, use the `kafka-console-consumer.sh` utility from the SSH connection:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-consumer.sh --bootstrap-server $KAFKABROKERS --topic test --from-beginning
    ```

    This command retrieves the records from the topic and displays them. Using `--from-beginning` tells the consumer to start from the beginning of the stream, so all records are retrieved.

    If you're using an older version of Kafka, replace `--bootstrap-server $KAFKABROKERS` with `--zookeeper $KAFKAZKHOSTS`.

1. Use __Ctrl + C__ to stop the consumer.

You can also programmatically create producers and consumers. For an example of using this API, see the [Apache Kafka Producer and Consumer API with HDInsight](apache-kafka-producer-consumer-api.md) document.

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

From the Azure portal, navigate to your cluster, and select **Delete**.

:::image type="content" source="./media/apache-kafka-quickstart-resource-manager-template/azure-portal-delete-kafka.png" alt-text="Resource Manager template HBase." border="false":::

You can also select the resource group name to open the resource group page, and then select **Delete resource group**. By deleting the resource group, you delete both the HDInsight cluster, and the default storage account.

## Next steps

In this quickstart, you learned how to create an Apache Kafka cluster in HDInsight using an ARM template. In the next article, you learn how to create an application that uses the Apache Kafka Streams API and run it with Kafka on HDInsight.

> [!div class="nextstepaction"]
> [Use Apache Kafka streams API in Azure HDInsight](./apache-kafka-streams-api.md)
