---
title: Manage Hadoop clusters in HDInsight using Azure portal | Microsoft Docs
description: Learn how to create and manage HDInsight clusters using the Azure portal.
services: hdinsight
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 5a76f897-02e8-4437-8f2b-4fb12225854a
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: jgao

---
# Manage Hadoop clusters in HDInsight by using the Azure portal
[!INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Using the [Azure portal][azure-portal], you can manage Hadoop clusters in Azure HDInsight. Use the tab selector for information on managing Hadoop clusters in HDInsight using other tools.

**Prerequisites**

Before you begin this article, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

## Open the Portal
1. Sign in to [https://portal.azure.com](https://portal.azure.com).
2. After you open the portal, you can:

   * Click **New** from the left menu to create a new cluster:

       ![new HDInsight cluster button](./media/hdinsight-administer-use-portal-linux/azure-portal-new-button.png)
   * Click **HDInsight Clusters** from the left menu to list the existing clusters

       ![Azure portal HDInsight cluster button](./media/hdinsight-administer-use-portal-linux/azure-portal-hdinsight-button.png)

       If you don't see HDInsight cluster, click **More services** on the bottom of the list, and then click **HDInsight clusters** under the **Intelligence + Analytics** section.


## Create clusters
[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

HDInsight works with a wide range of Hadoop components. For the list of the components that have been verified and supported,
see [What version of Hadoop is in Azure HDInsight](hdinsight-component-versioning.md). For the general cluster creation information, see [Create Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

### Access control requirements

You must specify an Azure subscription when you create an HDInsight cluster. This cluster can be created in either a new Azure Resource group or an existing Resource group. You can use the following steps to verify your permissions for creating HDInsight clusters:

- To use an existing resource group.

    1. Sign in to the [Azure portal](https://portal.azure.com).
    2. Click **Resource groups** from the left menu to list the resource groups.
    3. Click the resource group you want to use for creating your HDInsight cluster.
    4. Click **Access control (IAM)**, and verify that you (or a group that you belong to) have at least the Contributor access to the resource group.

- To create a new resource group

    1. Sign in to the [Azure portal](https://portal.azure.com).
    2. Click **Subscription** from the left menu. It has a yellow key icon. You shall see a list of subscriptions.
    3. Click the subscription that you use to create clusters. 
    4. Click **My permissions**.  It shows your [role](../active-directory/role-based-access-control-what-is.md#built-in-roles) on the subscription. You need at least Contributor access to create HDInsight cluster.

If you recieve the NoRegisteredProviderFound error or the MissingSubscriptionRegistration error, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/resource-manager-common-deployment-errors.md).

## List and show clusters
1. Sign in to [https://portal.azure.com](https://portal.azure.com).
2. Click **HDInsight Clusters** from the left menu to list the existing clusters.
3. Click the cluster name. If the cluster list is long, you can use filter on the top of the page.
4. Click a cluster from the list to see the overview page:

    ![Azure portal HDInsight cluster essentials](./media/hdinsight-administer-use-portal-linux/hdinsight-essentials.png)

    **Overview menu:**

   * **Dashboard**: Opens the cluster dashboard, which is Ambari Web for Linux-based clusters.
   * **Secure Shell**: Shows the instructions to connect to the cluster using Secure Shell (SSH) connection.
   * **Scale Cluster**: Allows you to change the number of worker nodes for this cluster.
   * **Delete**: Deletes the cluster.

    **Left menu:**

   * **Activity logs**: Show and query activity logs.
   * **Access control (IAM)**: Use role assignments.  See [Use role assignments to manage access to your Azure subscription resources](../active-directory/role-based-access-control-configure.md).
   * **Tags**: Allows you to set key/value pairs to define a custom taxonomy of your cloud services. For example, you may create a key named **project**, and then use a common value for all services associated with a specific project.
   * **Diagnose and solve problems**: Display troubleshooting information.
   * **Locks**: Add lock to prevent the cluster being modified or deleted.
   * **Automation script**: Display and export the Azure Resource Manager template for the cluster. Currently, you can only export the dependent Azure storage account. See [Create Linux-based Hadoop clusters in HDInsight using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).
   * **Quick Start**:  Displays information that will help you get started using HDInsight.
   * **Tools for HDInsight**: Help information for HDInsight related tools.
   * **Cluster Login**: Display the cluster login information.
   * **Subscription Core Usage**: Display the used and available cores for your subscription.
   * **Scale Cluster**: Increase and decrease the number of cluster worker nodes. See[Scale clusters](hdinsight-administer-use-management-portal.md#scale-clusters).
   * **Secure Shell**: Shows the instructions to connect to the cluster using Secure Shell (SSH) connection. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).
   * **HDInsight Partner**: Add/remove the current HDInsight Partner.
   * **External Metastores**: View the Hive and Oozie metastores. The metastores can only be configured during the cluster creation process. See [use Hive/Oozie metastore](hdinsight-hadoop-provision-linux-clusters.md#use-hiveoozie-metastore).
   * **Script Actions**: Run Bash scripts on the cluster. See [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).
   * **Applications**: Add/remove HDInsight applications.  See [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).
   * **Properties**: View the cluster properties.
   * **Storage accounts**: View the storage accounts and the keys. The storage accounts are configured during the cluster creation process.
   * **Cluster AAD Identity**:
   * **New support request**: Allows you to create a support ticket with Microsoft support.

6. Click **Properties**:

    The properties are:

   * **Hostname**: Cluster name.
   * **Cluster URL**. The URL for the Ambari web interface.
   * **Status**: Include Aborted, Accepted, ClusterStorageProvisioned, AzureVMConfiguration, HDInsightConfiguration, Operational, Running, Error, Deleting, Deleted, Timedout, DeleteQueued, DeleteTimedout, DeleteError, PatchQueued, CertRolloverQueued, ResizeQueued, ClusterCustomization
   * **Region**: Azure location. For a list of supported Azure locations, see the **Region** dropdown list box on [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).
   * **Date created**.
   * **Operating system**: Either **Windows** or **Linux**.
   * **Type**: Hadoop, HBase, Storm, Spark.
   * **Version**. See [HDInsight versions](hdinsight-component-versioning.md)
   * **Subscription**: Subscription name.
   * **Default data source**: The default cluster file system.
   * **Worker nodes size**.
   * **Head node size**.

## Delete clusters
Delete a cluster will not delete the default storage account or any linked storage accounts. You can re-create the cluster by using the same storage accounts and the same metastores. It is recommended to use a new default Blob container when you re-create the cluster.

1. Sign in to the [Portal][azure-portal].
2. Click **HDInsight Clusters** from the left menu. If you don't see **HDInsight Clusters**, click **More services** first.
3. Click the cluster that you want to delete.
4. Click **Delete** from the top menu, and then follow the instructions.

See also [Pause/shut down clusters](#pauseshut-down-clusters).

## Scale clusters
The cluster scaling feature allows you to change the number of worker nodes used by a cluster that is running in Azure HDInsight without having to re-create the cluster.

> [!NOTE]
> Only clusters with HDInsight version 3.1.3 or higher are supported. If you are unsure of the version of your cluster, you can check the Properties page.  See [List and show clusters](#list-and-show-clusters).
>
>

The impact of changing the number of data nodes for each type of cluster supported by HDInsight:

* Hadoop

    You can seamlessly increase the number of worker nodes in a Hadoop cluster that is running without impacting any pending or running jobs. New jobs can also be submitted while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.

    When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. This causes all running and pending jobs to fail at the completion of the scaling operation. You can, however, resubmit the jobs once the operation is complete.
* HBase

    You can seamlessly add or remove nodes to your HBase cluster while it is running. Regional Servers are automatically balanced within a few minutes of completing the scaling operation. However, you can also manually balance the regional servers by logging into the headnode of cluster and running the following commands from a command prompt window:

        >pushd %HBASE_HOME%\bin
        >hbase shell
        >balancer

    For more information on using the HBase shell, see []
* Storm

    You can seamlessly add or remove data nodes to your Storm cluster while it is running. But after a successful completion of the scaling operation, you will need to rebalance the topology.

    Rebalancing can be accomplished in two ways:

  * Storm web UI
  * Command-line interface (CLI) tool

    Please refer to the [Apache Storm documentation](http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html) for more details.

    The Storm web UI is available on the HDInsight cluster:

    ![HDInsight Storm scale rebalance](./media/hdinsight-administer-use-portal-linux/hdinsight-portal-scale-cluster-storm-rebalance.png)

    Here is an example how to use the CLI command to rebalance the Storm topology:

        ## Reconfigure the topology "mytopology" to use 5 worker processes,
        ## the spout "blue-spout" to use 3 executors, and
        ## the bolt "yellow-bolt" to use 10 executors
        $ storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10

**To scale clusters**

1. Sign in to the [Portal][azure-portal].
2. Click **HDInsight Clusters** from the left menu.
3. Click the cluster you want to scale.
3. Click **Scale Cluster**.
4. Enter **Number of Worker nodes**. The limit on the number of cluster node varies among Azure subscriptions. You can contact billing support to increase the limit.  The cost information will reflect the changes you have made to the number of nodes.

    ![HDInsight hadoop hbase storm spark scale](./media/hdinsight-administer-use-portal-linux/hdinsight-portal-scale-cluster.png)

## Pause/shut down clusters

Most of Hadoop jobs are batch jobs that are only run occasionally. For most Hadoop clusters, there are large periods of time that the cluster is not being used for processing. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use.
You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

There are many ways you can program the process:

* User Azure Data Factory. See [Create on-demand Linux-based Hadoop clusters in HDInsight using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md) for creating on-demand HDInsight linked services.
* Use Azure PowerShell.  See [Analyze flight delay data](hdinsight-analyze-flight-delay-data.md).
* Use Azure CLI. See [Manage HDInsight clusters using Azure CLI](hdinsight-administer-use-command-line.md).
* Use HDInsight .NET SDK. See [Submit Hadoop jobs](hdinsight-submit-hadoop-jobs-programmatically.md).

For the pricing information, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/). To delete a cluster from the Portal, see [Delete clusters](#delete-clusters)

## Change passwords
An HDInsight cluster can have two user accounts. The HDInsight cluster user account (A.K.A. HTTP user account) and the SSH user account are created during the creation process. You can the Ambari web UI to change the cluster user account username and password, and script actions to change the SSH user account

### Change the cluster user password
You can use the Ambari Web UI to change the Cluster user password. To log into Ambari, you must use the existing cluster username and password.

> [!NOTE]
> If you change the cluster user (admin) password, this may cause script actions ran against this cluster to fail. If you have any persisted script actions that target worker nodes, these may fail when you add nodes to the cluster through resize operations. For more information on script actions, see [Customize HDInsight clusters using script actions](hdinsight-hadoop-customize-cluster-linux.md).
>
>

1. Sign in to the Ambari Web UI using the HDInsight cluster user credentials. The default username is **admin**. The URL is **https://&lt;HDInsight Cluster Name>azurehdinsight.net**.
2. Click **Admin** from the top menu, and then click "Manage Ambari".
3. From the left menu, click **Users**.
4. Click **Admin**.
5. Click **Change Password**.

Ambari then changes the password on all nodes in the cluster.

### Change the SSH user password
1. Using a text editor, save the following text as a file named **changepassword.sh**.

   > [!IMPORTANT]
   > You must use an editor that uses LF as the line ending. If the editor uses CRLF, then the script will not work.
   >
   >

        #! /bin/bash
        USER=$1
        PASS=$2

        usermod --password $(echo $PASS | openssl passwd -1 -stdin) $USER
2. Upload the file to a storage location that can be accessed from HDInsight using an HTTP or HTTPS address. For example, a public file store such as OneDrive or Azure Blob storage. Save the URI (HTTP or HTTPS address,) to the file, as this is needed in the next step.
3. From the Azure portal, click **HDInsight Clusters**.
4. Click your HDInsight cluster.
4. Click **Script Actions**.
4. From the **Script Actions** blade, select **Submit New**. When the **Submit script action** blade appears, enter the following information.

   | Field | Value |
   | --- | --- |
   | Name |Change ssh password |
   | Bash script URI |The URI to the changepassword.sh file |
   | Nodes (Head, Worker, Nimbus, Supervisor, Zookeeper, etc.) |✓ for all node types listed |
   | Parameters |Enter the SSH user name and then the new password. There should be one space between the user name and the password. |
   | Persist this script action ... |Leave this field unchecked. |
5. Select **Create** to apply the script. Once the script finishes, you will be able to connect to the cluster using SSH with the new password.

## Grant/revoke access
HDInsight clusters have the following HTTP web services (all of these services have RESTful endpoints):

* ODBC
* JDBC
* Ambari
* Oozie
* Templeton

By default, these services are granted for access. You can revoke/grant the access using [Azure CLI](hdinsight-administer-use-command-line.md#enabledisable-http-access-for-a-cluster) and [Azure PowerShell](hdinsight-administer-use-powershell.md#grantrevoke-access).

## Find the subscription ID

**To find your Azure subscription IDs**

1. Sign in to the [Portal][azure-portal].
2. Click **Subscriptions**. Each subscription has a name and an ID.

Each cluster is tied to an Azure subscription. The subscription ID is shown on the cluster **Essential** tile. See [List and show clusters](#list-and-show-clusters).

## Find the resource group
In the Azure Resource Manager mode, each HDInsight cluster is created with an Azure Resource Manager group. The Resource Manager group that a cluster belongs to appears in:

* The cluster list has a **Resource Group** column.
* Cluster **Essential** tile.  

See [List and show clusters](#list-and-show-clusters).

## Find the default storage account
Each HDInsight cluster has a default storage account. The default storage account and its keys for a cluster appears under **Storage Accounts**. See [List and show clusters](#list-and-show-clusters).

## Run Hive queries
You cannot run Hive job directly from the Azure portal, but you can use the Hive View on Ambari Web UI.

**To run Hive queries using Ambari Hive View**

1. Sign in to the Ambari Web UI using the HDInsight cluster user credentials. The default username is **admin**. The URL is **https://&lt;HDInsight Cluster Name>azurehdinsight.net**.
2. Open Hive View as shown in the following screenshot:  

    ![HDInsight hive view](./media/hdinsight-administer-use-portal-linux/hdinsight-hive-view.png)
3. Click **Query** from the top menu.
4. Enter a Hive query in **Query Editor**, and then click **Execute**.

## Monitor jobs
See [Manage HDInsight clusters by using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md#monitoring).

## Browse files
Using the Azure portal, you can browse the content of the default container.

1. Sign in to [https://portal.azure.com](https://portal.azure.com).
2. Click **HDInsight Clusters** from the left menu to list the existing clusters.
3. Click the cluster name. If the cluster list is long, you can use filter on the top of the page.
4. Click **Storage Accounts** from the cluster left menu.
5. click a storage account.
7. Click the **Blobs** tile.
8. Click the default container name.

## Monitor cluster usage
The **Usage** section of the HDInsight cluster blade displays information about the number of cores available to your subscription for use with HDInsight, as well as the number of cores allocated to this cluster and how they are allocated for the nodes within this cluster. See [List and show clusters](#list-and-show-clusters).

> [!IMPORTANT]
> To monitor the services provided by the HDInsight cluster, you must use Ambari Web or the Ambari REST API. For more information on using Ambari, see [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md)
>
>

## Connect to a cluster

* [Use Hive with HDInsight](hdinsight-hadoop-use-hive-ambari-view.md)
* [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)

## Next steps
In this article, you have learned how to create an HDInsight cluster by using the Portal, and how to open the Hadoop command-line tool. To learn more, see the following articles:

* [Administer HDInsight Using Azure PowerShell](hdinsight-administer-use-powershell.md)
* [Administer HDInsight Using Azure CLI](hdinsight-administer-use-command-line.md)
* [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
* [Use Hive in HDInsight](hdinsight-use-hive.md)
* [Use Pig in HDInsight](hdinsight-use-pig.md)
* [Use Sqoop in HDInsight](hdinsight-use-sqoop.md)
* [Get Started with Azure HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md)
* [What version of Hadoop is in Azure HDInsight?](hdinsight-component-versioning.md)

[azure-portal]: https://portal.azure.com
[image-hadoopcommandline]: ./media/hdinsight-administer-use-portal-linux/hdinsight-hadoop-command-line.png "Hadoop command line"
