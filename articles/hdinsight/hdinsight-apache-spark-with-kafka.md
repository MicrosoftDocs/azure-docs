---
title: Apache Spark streaming with Kafka - Azure HDInsight | Microsoft Docs
description: 'Learn how to use Apache Spark on HDInsight to read and write data to Apache Kafka on HDInsight. This example uses Scala in a Jupyter Notebook to write data to Kafka on HDInsight, then read it back using Spark streaming.'
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: dd8f53c1-bdee-4921-b683-3be4c46c2039
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/15/2017
ms.author: larryfr
---
# Use Apache Spark with Kafka (preview) on HDInsight

Learn how to use Spark Apache Spark can be used to stream data into or out of Apache Kafka. In this document, learn how to stream data into and out of Kafka using a Jupyter notebook from Spark on HDInsight.

> [!NOTE]
> The steps in this document create an Azure resource group that contains both a Spark on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Spark cluster to directly communicate with the Kafka cluster.
>
> When you are done with the steps in this document, remember to delete the clusters to avoid excess charges.

## Create the clusters

Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that talks to Kafka must be in the same Azure virtual network as the nodes in the Kafka cluster. For this example, both the Kafka and Spark clusters are located in an Azure virtual network. The following diagram shows how communication flows between the clusters:

![Diagram of Spark and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-spark-with-kafka/spark-kafka-vnet.png)

> [!NOTE]
> Though Kafka itself is limited to communication within the virtual network, other services on the cluster such as SSH and Ambari can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).

While you can create an Azure virtual network, Kafka, and Spark clusters manually, it's easier to use an Azure Resource Manager template. Use the following steps to deploy an Azure virtual network, Kafka, and Spark clusters to your Azure subscription.

1. Use the following button to sign in to Azure and open the template in the Azure portal.
    
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-spark-cluster-in-vnet-v2.json" target="_blank"><img src="./media/hdinsight-apache-spark-with-kafka/deploy-to-azure.png" alt="Deploy to Azure"></a>
    
    The Azure Resource Manager template is located at **https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-kafka-spark-cluster-in-vnet-v2.json**.

2. Use the following information to populate the entries on the **Custom deployment** blade:
   
    ![HDInsight custom deployment](./media/hdinsight-apache-spark-with-kafka/parameters.png)
   
    * **Resource group**: Create a group or select an existing one. This group contains the HDInsight cluster.

    * **Location**: Select a location geographically close to you.

    * **Base Cluster Name**: This value is used as the base name for the Spark and Kafka clusters. For example, entering **hdi** creates a Spark cluster named spark-hdi__ and a Kafka cluster named **kafka-hdi**.

    * **Cluster Login User Name**: The admin user name for the Spark and Kafka clusters.

    * **Cluster Login Password**: The admin user password for the Spark and Kafka clusters.

    * **SSH User Name**: The SSH user to create for the Spark and Kafka clusters.

    * **SSH Password**: The password for the SSH user for the Spark and Kafka clusters.

3. Read the **Terms and Conditions**, and then select **I agree to the terms and conditions stated above**.

4. Finally, check **Pin to dashboard** and then select **Purchase**. It takes about 20 minutes to create the clusters.

Once the resources have been created, you are redirected to a blade for the resource group that contains the clusters and web dashboard.

![Resource group blade for the vnet and clusters](./media/hdinsight-apache-spark-with-kafka/groupblade.png)

> [!IMPORTANT]
> Notice that the names of the HDInsight clusters are **spark-BASENAME** and **kafka-BASENAME**, where BASENAME is the name you provided to the template. You use these names in later steps when connecting to the clusters.

## Get the code

The code for the example described in this document is available at [https://github.com/Azure-Samples/hdinsight-spark-scala-kafka](https://github.com/Azure-Samples/hdinsight-spark-scala-kafka).

## Understand the code

This example uses a Scala application in a Jupyter notebook. The code in the notebook relies on the following pieces of data:

* __Kafka brokers__: The broker process runs on each workernode on the Kafka cluster. The list of brokers is required by the producer component, which writes data to Kafka.

* __Zookeeper hosts__: The Zookeeper hosts for the Kafka cluster are used when consuming (reading) data from Kafka.

* __Topic name__: The name of the topic that data is written to and read from. This example expects a topic named `sparktest`.

See the [Kafka host information](#kafkahosts) section for information on how to obtain the Kafka broker and Zookeeper host information.

The code in the notebook performs the following tasks:

* Creates a consumer that reads data from a Kafka topic named `sparktest`, counts each word in the data, and stores the word and count into a temporary table named `wordcounts`.

* Creates a producer that writes random sentences to the Kafka topic named `sparktest`.

* Selects data from the `wordcounts` table to display the counts.

Each cell in the project contains comments or a text section that explains what the code does.

## <a id="kafkahosts"></a>Kafka host information

The first thing you should do when creating an application that works with Kafka on HDInsight is to get the Kafka broker and Zookeeper host information for the Kafka cluster. This is used by client applications to communicate with Kafka.

> [!NOTE]
> The Kafka broker and Zookeeper hosts are not directly accessible over the Internet. Any application that uses Kafka must either run on the Kafka cluster or within the same Azure Virtual Network as the Kafka cluster. In this case, the example runs on a Spark on HDInsight cluster in the same virtual network.

From your development environment, use the following commands to retrieve the broker and Zookeeper information:

* To get the __Kafka broker__ information:

    ```bash
    curl -u admin:$PASSWORD -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'
    ```

    > [!NOTE]
    > Set `$PASSWORD` to the login (admin) password you used when creating the cluster. Set `$CLUSTERNAME` to the base name you used when creating the cluster.

    ```powershell
    $creds = Get-Credential -UserName "admin" -Message "Enter the cluster login credentials"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER" `
        -Credential $creds
    $respObj = ConvertFrom-Json $resp.Content
    $brokerHosts = $respObj.host_components.HostRoles.host_name
    ($brokerHosts -join ":9092,") + ":9092"
    ```

    > [!NOTE]
    > Set `$cluterName` to the name of the HDInsight cluster. When prompted, enter the password for the cluster login (admin) account.

* To get the __Zookeeper host__ information:

    ```bash
    curl -u admin:$PASSWORD -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")'
    ```

    ```powershell
    $creds = Get-Credential -UserName "admin" -Message "Enter the cluster login credentials"
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" `
        -Credential $creds
    $respObj = ConvertFrom-Json $resp.Content
    $zookeeperHosts = $respObj.host_components.HostRoles.host_name
    ($zookeeperHosts -join ":2181,") + ":2181"
    ```

Both commands return information similar to the following text:

* __Kafka brokers__: `wn0-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:9092,wn1-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:9092`

* __Zookeeper hosts__: `zk0-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181,zk1-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181,zk2-kafka.4rf4ncirvydube02fuj0gpxp4e.ex.internal.cloudapp.net:2181`

> [!IMPORTANT]
> Save this information as it is used in several steps in this document.

## Use the Jupyter notebook

To use the example Jupyter notebook, you must upload it to the Jupyter Notebook server on the Spark cluster. Use the following steps to upload the notebook:

1. In your web browser, use the following URL to connect to the Jupyter Notebook server on the Spark cluster. Replace `CLUSTERNAME` with the name of your Spark cluster.

        https://CLUSTERNAME.azurehdinsight.net/jupyter

    When prompted, enter the cluster login (admin) and password used when you created the cluster.

2. From the upper right side of the page, use the __Upload__ button to upload the `KafkaStreaming.ipynb` file. Select the file in the file browser dialog and select __Open__.

    ![Use the upload button to select and upload a notebook](./media/hdinsight-apache-spark-with-kafka/upload-button.png)

    ![Select the KafkaStreaming.ipynb file](./media/hdinsight-apache-spark-with-kafka/select-notebook.png)

3. Find the __KafkaStreaming.ipynb__ entry in the list of notebooks, and select __Upload__ button beside it.

    ![Use the upload button beside the KafkaStreaming.ipynb entry to upload it to the notebook server](./media/hdinsight-apache-spark-with-kafka/upload-notebook.png)

4. Once the file has uploaded, select the __KafkaStreaming.ipynb__ entry to open the notebook. To complete this example, follow the instructions in the notebook.

## Delete the cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Since the steps in this document create both clusters in the same Azure resource group, you can delete the resource group in the Azure portal. Deleting the group removes all resources created by following this document, the Azure Virtual Network, and storage account used by the clusters.

## Next steps

In this document, you learned how to use Spark to read and write to Kafka. Use the following links to discover other ways to work with Kafka:

* [Get started with Apache Kafka on HDInsight](hdinsight-apache-kafka-get-started.md)
* [Use MirrorMaker to create a replica of Kafka on HDInsight](hdinsight-apache-kafka-mirroring.md)
* [Use Apache Storm with Kafka on HDInsight](hdinsight-apache-storm-with-kafka.md)

