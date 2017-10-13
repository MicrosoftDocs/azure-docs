---
title: Apache Spark Structured Streaming with Kafka - Azure HDInsight | Microsoft Docs
description: Learn how to use Apache Spark streaming (DStream) to get data into or out of Apache Kafka. In this example, you stream data using a Jupyter notebook from Spark on HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/09/2017
ms.author: larryfr
---

# Use Spark Structured Streaming with Kafka (preview) on HDInsight

Learn how to use Spark Structured Streaming to read data from Apache Kafka on Azure HDInsight.

Spark structured streaming is a stream processing engine built on Spark SQL. It allows you to express streaming computations the same as batch computation on static data. For more information on Structured Streaming, see the [Structured Streaming Programming Guide [Alpha]](http://spark.apache.org/docs/2.1.0/structured-streaming-programming-guide.html) at Apache.org.

> [!IMPORTANT]
> This example used Spark 2.1 on HDInsight 3.6. Structured Streaming is considered __alpha__ on Spark 2.1.
>
> The steps in this document create an Azure resource group that contains both a Spark on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Spark cluster to directly communicate with the Kafka cluster.
>
> When you are done with the steps in this document, remember to delete the clusters to avoid excess charges.

## Create the clusters

Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that talks to Kafka must be in the same Azure virtual network as the nodes in the Kafka cluster. For this example, both the Kafka and Spark clusters are located in an Azure virtual network. The following diagram shows how communication flows between the clusters:

![Diagram of Spark and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-spark-with-kafka/spark-kafka-vnet.png)

> [!NOTE]
> The Kafka service is limited to communication within the virtual network. Other services on the cluster, such as SSH and Ambari, can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).

While you can create an Azure virtual network, Kafka, and Spark clusters manually, it's easier to use an Azure Resource Manager template. Use the following steps to deploy an Azure virtual network, Kafka, and Spark clusters to your Azure subscription.

1. Use the following button to sign in to Azure and open the template in the Azure portal.
    
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-kafka-spark-cluster-in-vnet-v4.1.json" target="_blank"><img src="./media/hdinsight-apache-spark-with-kafka/deploy-to-azure.png" alt="Deploy to Azure"></a>
    
    The Azure Resource Manager template is located at **https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-kafka-spark-cluster-in-vnet-v4.1.json**.

    This template creates the following resources:

    * A Kafka on HDInsight 3.5 cluster.
    * A Spark on HDInsight 3.6 cluster.
    * An Azure Virtual Network, which contains the HDInsight clusters.

    > [!IMPORTANT]
    > The structured streaming notebook used in this example requires Spark on HDInsight 3.6. If you use an earlier version of Spark on HDInsight, you receive errors when using the notebook.

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

Once the resources have been created, you are redirected to the resource group blade.

![Resource group blade for the vnet and clusters](./media/hdinsight-apache-spark-with-kafka/groupblade.png)

> [!IMPORTANT]
> Notice that the names of the HDInsight clusters are **spark-BASENAME** and **kafka-BASENAME**, where BASENAME is the name you provided to the template. You use these names in later steps when connecting to the clusters.

## Get the Kafka brokers

The code in this example connects to the Kafka broker hosts in the Kafka cluster. To find the Kafka broker hosts, use the following PowerShell or Bash example:

```powershell
$creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
$clusterName = Read-Host -Prompt "Enter the Kafka cluster name"
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER" `
    -Credential $creds
$respObj = ConvertFrom-Json $resp.Content
$brokerHosts = $respObj.host_components.HostRoles.host_name
($brokerHosts -join ":9092,") + ":9092"
```

```bash
curl -u admin:$PASSWORD -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/services/KAFKA/components/KAFKA_BROKER" | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")'
```

> [!NOTE]
> This example expects `$PASSWORD` to contain the password for the cluster login, and `$CLUSTERNAME` to contain the name of the Kafka cluster.
>
> This example uses the [jq](https://stedolan.github.io/jq/) utility to parse data out of the JSON document.

The output is similar to the following text:

`wn0-kafka.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net:9092,wn1-kafka.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net:9092,wn2-kafka.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net:9092,wn3-kafka.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net:9092`

Save this information, as it is used in the following sections of this document.

## Get the notebooks

The code for the example described in this document is available at [https://github.com/Azure-Samples/hdinsight-spark-kafka-structured-streaming](https://github.com/Azure-Samples/hdinsight-spark-kafka-structured-streaming).

## Upload the notebooks

Use the following steps to upload the notebooks from the project to your Spark on HDInsight cluster:

1. In your web browser, connect to the Jupyter notebook on your Spark cluster. In the following URL, replace `CLUSTERNAME` with the name of your Kafka cluster:

        https://CLUSTERNAME.azurehdinsight.net/jupyter

    When prompted, enter the cluster login (admin) and password used when you created the cluster.

2. From the upper right side of the page, use the __Upload__ button to upload the __Stream-Tweets-To_Kafka.ipynb__ file to the cluster. Select __Open__ to start the upload.

    ![Use the upload button to select and upload a notebook](./media/hdinsight-apache-kafka-spark-structured-streaming/upload-button.png)

    ![Select the KafkaStreaming.ipynb file](./media/hdinsight-apache-kafka-spark-structured-streaming/select-notebook.png)

3. Find the __Stream-Tweets-To_Kafka.ipynb__ entry in the list of notebooks, and select __Upload__ button beside it.

    ![Use the upload button beside the KafkaStreaming.ipynb entry to upload it to the notebook server](./media/hdinsight-apache-kafka-spark-structured-streaming/upload-notebook.png)

4. Repeat steps 1-3 to load the __Spark-Structured-Streaming-From-Kafka.ipynb__ notebook.

## Load tweets into Kafka

Once the files have been uploaded, select the __Stream-Tweets-To_Kafka.ipynb__ entry to open the notebook. Follow the steps in the notebook to load tweets into Kafka.

## Process tweets using Spark Structured Streaming

From the Jupyter Notebook home page, select the __Spark-Structured-Streaming-From-Kafka.ipynb__ entry. Follow the steps in the notebook to load tweets from Kafka using Spark Structured Streaming.

## Next steps

Now that you have learned how to use Spark Structured Streaming, see the following documents to learn more about working with Spark and Kafka:

* [How to use Spark streaming (DStream) with Kafka](hdinsight-apache-spark-with-kafka.md).
* [Start with Jupyter Notebook and Spark on HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md)