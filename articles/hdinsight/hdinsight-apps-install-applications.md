---
title: Install third-party Hadoop applications on Azure HDInsight 
description: Learn how to install third-party Hadoop applications on Azure HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/14/2018
ms.author: jasonh

---
# Install third-party Hadoop applications on Azure HDInsight

Learn how to install a third-party Hadoop application on Azure HDInsight. For instructions on installing your own application, see [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).

An HDInsight application is an application that users can install on an HDInsight cluster. These applications can be developed by Microsoft, independent software vendors (ISV) or by yourself.  

The following list shows the published applications:

* **AtScale Intelligence Platform** turns your HDInsight cluster into a scale-out OLAP server. The application allows you to query billions of rows of data interactively using the BI tools from Microsoft Excel, PowerBI, Tableau Software to QlikView.
* **Cask CDAP for HDInsight** provides the first unified integration platform for big data that cuts down the time to production for data applications and data lakes by 80%. This application only supports Standard HBase 3.4 clusters.
* **DATAIKU DDS on HDInsight** allows data professionals to prototype, build, and deploy highly specific services that transform raw data into impactful business predictions.
* **H2O Artificial Intelligence for HDInsight (Beta)** H2O Sparkling Water supports the following distributed algorithms: GLM, Naïve Bayes, Distributed Random Forest, Gradient Boosting Machine, Deep Neural Networks, Deep learning, K-means, PCA, Generalized Low Rank Models, Anomaly Detection, and Autoencoders.
* **Kyligence Analytics Platform** Kyligence Analytics Platform (KAP) is an enterprise-ready data warehouse powered by Apache Kylin and Apache Hadoop; it provides sub-second query latency on massive scale dataset, and simplifies data analytics for business users and analysts. 
* **Paxata Self-service Data Preparation**
* **Spark Job Server for KNIME Spark Executor** Spark Job Server for KNIME Spark Executor is used to connect the KNIME Analytics Platform to HDInsight clusters.
* **Streamsets Data Collector for HDnsight** provides a full-featured integrated development environment (IDE) that lets you design, test, deploy, and manage any-to-any ingest pipelines that mesh stream and batch data, and include a variety of in-stream transformations—all without having to write custom code. 
* **[Trifacta](http://www.trifacta.com/)** enables data engineers and analysts to more efficiently explore and prepare the diverse data of today by utilizing machine learning to provide a breakthrough user experience, workflow and architecture.
* **WANdisco Fusion HDI App** enables continuous consistent connectivity to data as it changes wherever it is located. It provides you with access to your data anytime and anywhere with no downtime and no disruption.

The instructions provided in this article use Azure portal. You can also export the Azure Resource Manager template from the portal or obtain a copy of the Resource Manager template from vendors, and use Azure PowerShell and Azure Classic CLI to deploy the template.  See [Create Hadoop clusters on HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).

## Prerequisites
If you want to install HDInsight applications on an existing HDInsight cluster, you must have an HDInsight cluster. To create one, see [Create clusters](hadoop/apache-hadoop-linux-tutorial-get-started.md#create-cluster). You can also install HDInsight applications when you create an HDInsight cluster.

## Install applications to existing clusters
The following procedure shows you how to install HDInsight applications to an existing HDInsight cluster.

**Install an HDInsight application**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu.
3. Click an HDInsight cluster.  If you don't have one, you must create one first.  see [Create clusters](hadoop/apache-hadoop-linux-tutorial-get-started.md#create-cluster).
4. Click **Applications** under the **Configurations** category. You can see a list of installed applications. If you cannot find Applications, that means there is no applications for this version of the HDInsight cluster.
   
    ![HDInsight applications portal menu](./media/hdinsight-apps-install-applications/hdinsight-apps-portal-menu.png)
5. Click **Add** from the menu. You can see a list of existing HDInsight applications.
   
    ![HDInsight applications available applications](./media/hdinsight-apps-install-applications/hdinsight-apps-list.png)
6. Click one of the available applications, and then follow the instructions to accept the legal terms.

You can see the installation status from the portal notifications (click the bell icon on the top of the portal). After the application is installed, the application  appears on the Installed Apps list.

## Install applications during cluster creation
You have the option to install HDInsight applications when you create a cluster. During the process, HDInsight applications are installed after the cluster is created and is in the running state. To install applications during cluster creation using the Azure portal, you use the --Custom-- option instead of the default --Quick create-- option.

## List installed HDInsight apps and properties
The portal shows a list of the installed HDInsight applications for a cluster, and the properties of each installed application.

**List HDInsight application and display properties**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu. 
3. Click an HDInsight cluster.
4. From **Settings**, click **Applications** under the **Configuration** category. The Installed Apps are listed on the right. 
   
    ![HDInsight applications installed apps](./media/hdinsight-apps-install-applications/hdinsight-apps-installed-apps-with-apps.png)
5. Click one of the installed applications to show the property. The property lists:
   
   * App name: application name.
   * Status: application status. 
   * Webpage: The URL of the web application that you have deployed to the edge node. The credential is the same as the HTTP user credentials that you have configured for the cluster.
   * HTTP endpoint: The credential is the same as the HTTP user credentials that you have configured for the cluster. 
   * SSH endpoint: You can use SSH to connect to the edge node. The SSH credentials are the same as the SSH user credentials that you have configured for the cluster. For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).
6. To delete an application, right-click the application, and then click **Delete** from the context menu.

## Connect to the edge node
You can connect to the edge node using HTTP and SSH. The endpoint information can be found from the [portal](#list-installed-hdinsight-apps-and-properties). For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

The HTTP endpoint credentials are the HTTP user credentials that you have configured for the HDInsight cluster; the SSH endpoint credentials are the SSH credentials that you have configured for the HDInsight cluster.

## Troubleshoot
See [Troubleshoot the installation](hdinsight-apps-install-custom-applications.md#troubleshoot-the-installation).

## Next steps
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an unpublished HDInsight application to HDInsight.
* [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.
* [MSDN: Install an HDInsight application](https://msdn.microsoft.com/library/mt706515.aspx): Learn how to define HDInsight applications.
* [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
* [Create Linux-based Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.
* [Use empty edge nodes in HDInsight](hdinsight-apps-use-edge-node.md): learn how to use an empty edge node for accessing HDInsight cluster, testing HDInsight applications, and hosting HDInsight applications.

