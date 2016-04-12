<properties
   	pageTitle="Install Hadoop applications on HDInsight | Microsoft Azure"
   	description="Learn how to install HDInsight applications on HDInsight applications."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="04/12/2016"
   	ms.author="jgao"/>

# Install HDInsight applications

HDInsight applications can be installed on existing Linux-based HDInsight clusters. These applications can be developed by Microsoft, an independent software vendor (ISV) or by yourself. In this article, you will learn how to install a published application. For the tutorial of install your own application, see [Install custom HDInsight applications](hdinsight-apps-install-published-applications.md). For packaging and deploying custom HDInsight applications, see [Package and deploy HDInsight applications](hdinsight-apps-deploy.md).

The following are the published HDInsight applications:

- **Data-Centric Security for HDInsight(Bluetalon)**: [jgao: description to be provided] 
- **Datameer powered by Azure(Datameer)**: 
- **DataTorrent RTS(DataTorrent)**: 
- **R Server for HDInsight (Microsoft)**: 

### Prerequisites

Before you begin this tutorial, you must have:

- **An HDInsight cluster**: To create one, see [Create clusters](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).

## Install HDInsight apps

HDInsight applications can be installed using the Azure portal. 

[jgao: can HDInsight applications be installed using PowerShell/CLI/.NET? Theoretically, we can use PowerShell and CLI to publish any ARM templates.]

**To install an HDInsight application**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu.  If you don't see it, click **Browse**, and then click **HDInsight Clusters**.
3. Click an HDInsight cluster.  If you don't have one, you must create one first.  see [Create clusters](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).
4. From the **Settings** blade, click **Apps** under the **General** category. The **Installed Apps** blade lists all the installed applications. 

    ![hdinsight applications portal menu](./media/hdinsight-apps-install-applications/hdinsight-apps-portal-menu.png)
5. Click **Submit New** from the blade menu. You shall see a list of existing HDInsight applications.

    ![hdinsight applications installed apps](./media/hdinsight-apps-install-applications/hdinsight-apps-installed-apps.png)
6. Click one of the applications, and then click **Select**.

You can see the installation status from the portal notifications (click the bell icon on the top of the portal). After the application is installed, the application will appear on the Installed Apps blade.

## List installed HDInsight apps and properties

The portal shows a list of the installed HDInsight applications for a cluster, and the properties of each installed application.

**To list HDInsight application and display properties**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **HDInsight Clusters** in the left menu.  If you don't see it, click **Browse**, and then click **HDInsight Clusters**.
3. Click an HDInsight cluster.
4. From the **Settings** blade, click **Apps** under the **General** category. The Installed Apps blade lists all the installed applications. 
5. Click one of the installed applications to show the property. The property blade lists:

    - App name: application name.
    - Status: application status. 
    - Webpage: The URL of the web application that you have deployed to the edge node if there is any. The credential is the same as the HTTP user credentials that you have configured for the cluster.
    - HTTP endpoint: The credential is the same as the HTTP user credentials that you have configured for the cluster. 
    - SSH endpoint: You can use [SSH](hdinsight-hadoop-linux-use-ssh-unix.md) to connect to the edge node. The SSH credentials are the same as the SSH user credentials that you have configured for the cluster.

## Connect to the edge node

You can connect to the edge node using HTTP and SSH. The endpoint information can be found from the [portal](#list-installed-hdinsight-apps-and-properties). For more information on using SSH, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md). 

The HTTP endpoint credentials are the HTTP user credentials that you have configured for the HDInsight cluster; the SSH endpoint credentials are the SSH credentials that you have configured for the HDInsight cluster.

## Troubleshoot

You can check the application installation status from the portal notification (Click the bell icon on the top of the portal). 

If an application installation failed, you can see the error messages and debug information from 3 places:

- HDInsight Applications

    Open the cluster the portal, and click Apps from the Settings blade:

    ![hdinsight applications application installation error](./media/hdinsight-apps-install-applications/hdinsight-apps-error.png)

- HDInsight script action

    Because the application installation calls a script action script, you can also find some debug information, by clicking Script Action from the Settings blade. Script action history shows the error messages

    ![hdinsight applications script action error](./media/hdinsight-apps-install-applications/hdinsight-apps-script-action-error.png)
    
- Ambari Web UI 

    For more information, see [Troubleshooting](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting).


## Next steps

- [Package and deploy HDInsight applications](hdinsight-apps-deploy.md): learn how to develop ARM templates for deploying HDInsight applications.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.
