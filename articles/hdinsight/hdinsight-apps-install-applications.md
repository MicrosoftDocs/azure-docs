---
title: Install third-party applications on Azure HDInsight 
description: Learn how to install third-party Apache Hadoop applications on Azure HDInsight.
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: how-to
ms.date: 11/17/2022

---
# Install third-party Apache Hadoop applications on Azure HDInsight

Learn how to install a third-party [Apache Hadoop](https://hadoop.apache.org/) application on Azure HDInsight. For instructions on installing your own application, see [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).

An HDInsight application is an application that users can install on an HDInsight cluster. These applications can be developed by Microsoft, independent software vendors (ISV) or by yourself.  

The following list shows the published applications:

|Application |Cluster type(s) | Description |
|---|---|---|
|[AtScale Intelligence Platform](https://aws.amazon.com/marketplace/pp/AtScale-AtScale-Intelligence-Platform/B07BWWHH18) |Hadoop |AtScale turns your HDInsight cluster into a scale-out OLAP server, allowing you to query billions of rows of data interactively using the BI tools you already know, own, and love – from Microsoft Excel, Power BI, Tableau Software to QlikView. |
|[Datameer](https://azuremarketplace.microsoft.com/marketplace/apps/datameer.datameer) |Hadoop |Datameer's self-service scalable platform for preparing, exploring, and governing your data for analytics accelerates turning complex multisource data into valuable business-ready information, delivering faster, smarter insights at an enterprise-scale. |
|[Dataiku DSS on HDInsight](https://azuremarketplace.microsoft.com/marketplace/apps/dataiku.dataiku-data-science-studio) |Hadoop, Spark |Dataiku DSS in an enterprise data science platform that lets data scientists and data analysts collaborate to design and run new data products and services more efficiently, turning raw data into impactful predictions. |
|[WANdisco Fusion HDI App](https://community.wandisco.com/s/article/Use-WANdisco-Fusion-for-parallel-operation-of-ADLS-Gen1-and-Gen2) |Hadoop, Spark,HBase,Kafka |Keeping data consistent in a distributed environment is a massive data operations challenge. WANdisco Fusion, an enterprise-class software platform, solves this problem by enabling unstructured data consistency across any environment. |
|H2O SparklingWater for HDInsight |Spark |H2O Sparkling Water supports the following distributed algorithms: GLM, Naïve Bayes, Distributed Random Forest, Gradient Boosting Machine, Deep Neural Networks, Deep learning, K-means, PCA, Generalized Low Rank Models, Anomaly Detection, Autoencoders. |
|[Striim for Real-Time Data Integration to HDInsight](https://azuremarketplace.microsoft.com/marketplace/apps/striim.striimbyol) |Hadoop,HBase,Spark,Kafka |Striim (pronounced "stream") is an end-to-end streaming data integration + intelligence platform, enabling continuous ingestion, processing, and analytics of disparate data streams. |
|[Jumbune Enterprise-Accelerating BigData Analytics](https://azuremarketplace.microsoft.com/marketplace/apps/impetus-infotech-india-pvt-ltd.impetus_jumbune) |Hadoop, Spark |At a high level, Jumbune assists enterprises by, 1. Accelerating Tez, MapReduce & Spark engine based Hive, Java, Scala workload performance. 2. Proactive Hadoop Cluster Monitoring, 3. Establishing Data Quality management on distributed file system. |
|[Kyligence Enterprise](https://azuremarketplace.microsoft.com/marketplace/apps/kyligence.kyligence-cloud-saas) |Hadoop,HBase,Spark |Powered by Apache Kylin, Kyligence Enterprise Enables BI on Big Data. As an enterprise OLAP engine on Hadoop, Kyligence Enterprise empowers business analyst to architect BI on Hadoop with industry-standard data warehouse and BI methodology. |
|[StreamSets Data Collector for HDInsight Cloud](https://azuremarketplace.microsoft.com/marketplace/apps/streamsets.streamsets-data-collector-hdinsight) |Hadoop,HBase,Spark,Kafka |StreamSets Data Collector is a lightweight, powerful engine that streams data in real time. Use Data Collector to route and process data in your data streams. It comes with a 30 day trial license. |
|[Trifacta Wrangler Enterprise](https://azuremarketplace.microsoft.com/marketplace/apps/trifactainc1587522950142.trifactaazure) |Hadoop, Spark,HBase |Trifacta Wrangler Enterprise for HDInsight supports enterprise-wide data wrangling for any scale of data. The cost of running Trifacta on Azure is a combination of Trifacta subscription costs plus the Azure infrastructure costs for the virtual machines. |
|[Unifi Data Platform](https://www.crunchbase.com/organization/unifi-software) |Hadoop,HBase,Spark |The Unifi Data Platform is a seamlessly integrated suite of self-service data tools designed to empower the business user to tackle data challenges that drive incremental revenue, reduce costs or operational complexity. |

The instructions provided in this article use Azure portal. You can also export the Azure Resource Manager template from the portal or obtain a copy of the Resource Manager template from vendors, and use Azure PowerShell and Azure Classic CLI to deploy the template.  See [Create Apache Hadoop clusters on HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).

## Prerequisites
If you want to install HDInsight applications on an existing HDInsight cluster, you must have an HDInsight cluster. To create one, see [Create clusters](hadoop/apache-hadoop-linux-tutorial-get-started.md). You can also install HDInsight applications when you create an HDInsight cluster.

## Install applications to existing clusters
The following procedure shows you how to install HDInsight applications to an existing HDInsight cluster.

**Install an HDInsight application**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the left menu, navigate to **All services** > **Analytics** > **HDInsight clusters**.
3. Select an HDInsight cluster from the list.  If you don't have one, you must create one first.  see [Create clusters](hadoop/apache-hadoop-linux-tutorial-get-started.md).
4. Under the **Settings** category, select **Applications**. You can see a list of installed applications in the main window. 
   
    :::image type="content" source="./media/hdinsight-apps-install-applications/hdinsight-apps-portal-menu.png" alt-text="HDInsight applications portal menu":::
5. Select **+Add** from the menu. You can see a list of available applications.  If **+Add** is greyed out, that means there are no applications for this version of the HDInsight cluster.
   
    :::image type="content" source="./media/hdinsight-apps-install-applications/hdinsight-apps-list1.png" alt-text="HDInsight applications available applications":::
6. Select one of the available applications, and then follow the instructions to accept the legal terms.

You can see the installation status from the portal notifications (select the bell icon on the top of the portal). After the application is installed, the application  appears on the Installed Apps list.

## Install applications during cluster creation

You have the option to install HDInsight applications when you create a cluster. During the process, HDInsight applications are installed after the cluster is created and is in the running state. To install applications during cluster creation using the Azure portal, from the **Configuration + pricing** tab, select **+ Add application**.

:::image type="content" source="./media/hdinsight-apps-install-applications/azure-portal-cluster-configuration-applications.png" alt-text="Azure portal cluster configuration applications":::

## List installed HDInsight apps and properties
The portal shows a list of the installed HDInsight applications for a cluster, and the properties of each installed application.

**List HDInsight application and display properties**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the left menu, navigate to **All services** > **Analytics** > **HDInsight clusters**.
3. Select an HDInsight cluster from the list.
4. Under the **Settings** category, select **Applications**. You can see a list of installed applications in the main window. 
   
    :::image type="content" source="./media/hdinsight-apps-install-applications/hdinsight-apps-installed-apps-with-apps.png" alt-text="HDInsight applications installed apps":::
5. Select one of the installed applications to show the property. The property lists:

    |Property | Description |
    |---|---|
    |App name |Application name. |
    |Status |Application status. |
    |Webpage |The URL of the web application that you have deployed to the edge node. The credential is the same as the HTTP user credentials that you have configured for the cluster. |
    |SSH endpoint |You can use SSH to connect to the edge node. The SSH credentials are the same as the SSH user credentials that you have configured for the cluster. For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md). |
    |Description | Application description. |

6. To delete an application, right-click the application, and then click **Delete** from the context menu.

## Connect to the edge node
You can connect to the edge node using HTTP and SSH. The endpoint information can be found from the [portal](#list-installed-hdinsight-apps-and-properties). For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

The HTTP endpoint credentials are the HTTP user credentials that you have configured for the HDInsight cluster; the SSH endpoint credentials are the SSH credentials that you have configured for the HDInsight cluster.

## Troubleshoot
See [Troubleshoot the installation](hdinsight-apps-install-custom-applications.md#troubleshoot-the-installation).

## Next steps
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an unpublished HDInsight application to HDInsight.
* [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.
* [MSDN: Install an HDInsight application](/rest/api/hdinsight/hdinsight-application): Learn how to define HDInsight applications.
* [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
* [Create Linux-based Apache Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.
* [Use empty edge nodes in HDInsight](hdinsight-apps-use-edge-node.md): learn how to use an empty edge node for accessing HDInsight cluster, testing HDInsight applications, and hosting HDInsight applications.
