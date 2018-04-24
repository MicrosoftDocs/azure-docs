---
title: Apache Spark Structured Streaming with Kafka - Azure HDInsight | Microsoft Docs
description: Learn how to use Apache Spark streaming (DStream) to get data into or out of Apache Kafka. In this example, you stream data using a Jupyter notebook from Spark on HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: cgronlun
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: ''
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/04/2018
ms.author: larryfr
---
# Use Spark Structured Streaming with Kafka on HDInsight

Learn how to use Spark Structured Streaming to read data from Apache Kafka on Azure HDInsight.

Spark structured streaming is a stream processing engine built on Spark SQL. It allows you to express streaming computations the same as batch computation on static data. For more information on Structured Streaming, see the [Structured Streaming Programming Guide [Alpha]](http://spark.apache.org/docs/2.2.0/structured-streaming-programming-guide.html) at Apache.org.

> [!IMPORTANT]
> This example uses Spark 2.2 on HDInsight 3.6.
>
> The steps in this document create an Azure resource group that contains both a Spark on HDInsight and a Kafka on HDInsight cluster. These clusters are both located within an Azure Virtual Network, which allows the Spark cluster to directly communicate with the Kafka cluster.
>
> When you are done with the steps in this document, remember to delete the clusters to avoid excess charges.

## Create the clusters

Apache Kafka on HDInsight does not provide access to the Kafka brokers over the public internet. Anything that uses Kafka must be in the same Azure virtual network. In this tutorial, both the Kafka and Spark clusters are located in the same Azure virtual network. 

The following diagram shows how communication flows between Spark and Kafka:

![Diagram of Spark and Kafka clusters in an Azure virtual network](./media/hdinsight-apache-spark-with-kafka/spark-kafka-vnet.png)

> [!NOTE]
> The Kafka service is limited to communication within the virtual network. Other services on the cluster, such as SSH and Ambari, can be accessed over the internet. For more information on the public ports available with HDInsight, see [Ports and URIs used by HDInsight](hdinsight-hadoop-port-settings-for-services.md).

For your convenience, the following steps use an Azure Resource Manager template to create Kafka and Spark clusters inside a virtual network.

1. Use the following button to sign in to Azure and open the template in the Azure portal.
    
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-spark-kafka-structured-streaming%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-apache-spark-with-kafka/deploy-to-azure.png" alt="Deploy to Azure"></a>
    
    The Azure Resource Manager template is located at **https://raw.githubusercontent.com/Azure-Samples/hdinsight-spark-kafka-structured-streaming/master/azuredeploy.json**.

    This template creates the following resources:

    * A Kafka on HDInsight 3.6 cluster.
    * A Spark 2.2.0 on HDInsight 3.6 cluster.
    * An Azure Virtual Network, which contains the HDInsight clusters.

    > [!IMPORTANT]
    > The structured streaming notebook used in this example requires Spark on HDInsight 3.6. If you use an earlier version of Spark on HDInsight, you receive errors when using the notebook.

2. Use the following information to populate the entries on the **Customized template** section:

    | Setting | Value |
    | --- | --- |
    | Subscription | Your Azure subscription |
    | Resource group | The resource group that contains the resources. |
    | Location | The Azure region that the resources are created in. |
    | Spark Cluster Name | The name of the Spark cluster. |
    | Kafka Cluster Name | The name of the Kafka cluster. |
    | Cluster Login User Name | The admin user name for the clusters. |
    | Cluster Login Password | The admin user password for the clusters. |
    | SSH User Name | The SSH user to create for the clusters. |
    | SSH Password | The password for the SSH user. |
   
    ![Screenshot of the customized template](./media/hdinsight-apache-kafka-spark-structured-streaming/spark-kafka-template.png)

4. Finally, check **Pin to dashboard** and then select **Purchase**. 

> [!NOTE]
> It can take up to 20 minutes to create the clusters.

## Get the notebook

The code for the example described in this document is available at [https://github.com/Azure-Samples/hdinsight-spark-kafka-structured-streaming](https://github.com/Azure-Samples/hdinsight-spark-kafka-structured-streaming).

## Upload the notebooks

To upload the notebook from the project to your Spark on HDInsight cluster, use the following steps:

1. In your web browser, connect to the Jupyter notebook on your Spark cluster. In the following URL, replace `CLUSTERNAME` with the name of your __Spark__ cluster:

        https://CLUSTERNAME.azurehdinsight.net/jupyter

    When prompted, enter the cluster login (admin) and password used when you created the cluster.

2. From the upper right side of the page, use the __Upload__ button to upload the __spark-structured-streaming-kafka.ipynb__ file to the cluster. Select __Open__ to start the upload.

    ![Use the upload button to select and upload a notebook](./media/hdinsight-apache-kafka-spark-structured-streaming/upload-button.png)

    ![Select the KafkaStreaming.ipynb file](./media/hdinsight-apache-kafka-spark-structured-streaming/select-notebook.png)

3. Find the __spark-structured-streaming-kafka.ipynb__ entry in the list of notebooks, and select __Upload__ button beside it.

    ![To upload the notebook, use the upload button for the KafkaStreaming.ipynb entry](./media/hdinsight-apache-kafka-spark-structured-streaming/upload-notebook.png)


## Use the notebook

Once the files have been uploaded, select the __spark-structured-streaming-kafka.ipynb__ entry to open the notebook. To learn how to use Spark structured streaming with Kafka on HDInsight, follow the instructions in the notebook.

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

Now that you have learned how to use Spark Structured Streaming, see the following documents to learn more about working with Spark and Kafka:

* [How to use Spark streaming (DStream) with Kafka](hdinsight-apache-spark-with-kafka.md).
* [Start with Jupyter Notebook and Spark on HDInsight](spark/apache-spark-jupyter-spark-sql.md)