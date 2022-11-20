---
title: Manage Apache Hadoop clusters in HDInsight using Azure portal 
description: Learn how to create and manage Azure HDInsight clusters using the Azure portal.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 11/11/2022
---

# Manage Apache Hadoop clusters in HDInsight by using the Azure portal

[!INCLUDE [selector](includes/hdinsight-portal-management-selector.md)]

Using the [Azure portal](https://portal.azure.com), you can manage [Apache Hadoop](https://hadoop.apache.org/) clusters in Azure HDInsight. Use the tab selector above for information on managing Hadoop clusters in HDInsight using other tools.

## Prerequisites

An existing Apache Hadoop cluster in HDInsight.  See [Create Linux-based clusters in HDInsight using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

## Getting Started

Sign in to [https://portal.azure.com](https://portal.azure.com).

## <a name="showClusters"></a> List and show clusters

The **HDInsight clusters** page will list your existing clusters.  From the portal:
1. Select **All services** from the left menu.
2. Select **HDInsight clusters** under **ANALYTICS**.

## <a name="homePage"></a> Cluster home page

Select your cluster name from the [**HDInsight clusters**](#showClusters) page.  This will open the **Overview** view, which looks similar to the following image:

:::image type="content" source="./media/hdinsight-administer-use-portal-linux/hdinsight-essentials2.png" alt-text="Azure portal HDInsight cluster essentials":::

**Top menu:**  

| Item| Description |
|---|---|
|Move|Moves the cluster to another resource group or to another subscription.|
|Delete|Deletes the cluster. |
|Refresh|Refreshes the view.|

**Left menu:**  

  - **Top-left menu**

    | Item| Description |
    |---|---|
    |Overview|Provides general information for your cluster.|
    |Activity log|Show and query activity logs.|
    |Access control (IAM)|Use role assignments.  See [Assign Azure roles to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md).|
    |Tags|Allows you to set key/value pairs to define a custom taxonomy of your cloud services. For example, you may create a key named **project**, and then use a common value for all services associated with a specific project.|
    |Diagnose and solve problems|Display troubleshooting information.|
    |Quickstart|Displays information that helps you get started using HDInsight.|
    |Tools|Help information for HDInsight related tools.|

  - **Settings menu**  

    | Item| Description |
    |---|---|
    |Cluster size|Check, increase, and decrease the number of cluster worker nodes. See [Scale clusters](hdinsight-administer-use-portal-linux.md#scale-clusters).|
    |Quota limits|Display the used and available cores for your subscription.|
    |SSH + Cluster login|Shows the instructions to connect to the cluster using Secure Shell (SSH) connection. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).|
    |Data Lake Storage Gen1|Configure access Data Lake Storage Gen1.  See [Quickstart: Set up clusters in HDInsight](./hdinsight-hadoop-provision-linux-clusters.md).|
    |Storage accounts|View the storage accounts and the keys. The storage accounts are configured during the cluster creation process.|
    |Applications|Add/remove HDInsight applications.  See [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).|
    |Script actions|Run Bash scripts on the cluster. See [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).|
    |External metastores|View the [Apache Hive](https://hive.apache.org/) and [Apache Oozie](https://oozie.apache.org/) metastores. The metastores can only be configured during the cluster creation process.|
    |HDInsight partner|Add/remove the current HDInsight Partner.|
    |Properties|View the [cluster properties](#properties).|
    |Locks|Add a lock to prevent the cluster being modified or deleted.|
    |Export template|Display and export the Azure Resource Manager template for the cluster. Currently, you can only export the dependent Azure storage account. See [Create Linux-based Apache Hadoop clusters in HDInsight using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).|

  - **Monitoring menu**

    | Item| Description |
    |---|---|
    |Alerts|Manage the alerts and actions.|
    |Metrics|Monitor the cluster metrics in Azure Monitor logs.|
    |Diagnosis settings|Settings on where to store the diagnosis metrics.|
    |Azure Monitor|Monitor your cluster in Azure Monitor.|

  - **Support + troubleshooting menu**

    | Item| Description |
    |---|---|
    |Resource health|See [Azure resource health overview](../service-health/resource-health-overview.md).|
    |New support request|Allows you to create a support ticket with Microsoft support.|

## <a name="properties"></a> Cluster Properties

From the [cluster home page](#homePage),  under **Settings** select **Properties**.

|Item | Description |
|---|---|
|HOSTNAME|Cluster name.|
|CLUSTER URL|The URL for the Ambari web interface.|
|Private Endpoint|The private endpoint for the cluster.|
|Secure shell (SSH)|The username and host name to use in accessing the cluster via SSH.|
|STATUS|One of: Aborted, Accepted, ClusterStorageProvisioned, AzureVMConfiguration, HDInsightConfiguration, Operational, Running, Error, Deleting, Deleted, Timedout, DeleteQueued, DeleteTimedout, DeleteError, PatchQueued, CertRolloverQueued, ResizeQueued, or ClusterCustomization.|
|REGION|Azure location. For a list of supported Azure locations, see the **Region** drop-down list box on [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).|
|DATE CREATED|The date the cluster was deployed.|
|OPERATING SYSTEM|Either **Windows** or **Linux**.|
|TYPE|Hadoop, HBase, Spark.|
|Version|See [HDInsight versions](hdinsight-component-versioning.md).|
|Minimum TLS version|The TLS version.|
|SUBSCRIPTION|Subscription name.|
|DEFAULT DATA SOURCE|The default cluster file system.|
|Worker nodes sizes|The selected VM size of the worker nodes.|
|Head node size|The selected VM size of the head nodes.|
|Virtual network|The name of the Virtual Network, which the cluster is deployed, if one was selected at deployment time.|

## Move clusters

You can move an HDInsight cluster to another Azure resource group or another subscription.

From the [cluster home page](#homePage):

1. Select **Move** from the top menu.
2. Select **Move to another resource group** or **Move to another subscription**.
3. Follow the instructions from the new page.

## Delete clusters

Deleting a cluster doesn't delete the default storage account nor any linked storage accounts. You can re-create the cluster by using the same storage accounts and the same metastores. We recommend using a new default Blob container when you re-create the cluster.

From the [cluster home page](#homePage):

1. Select **Delete** from the top menu.
2. Follow the instructions from the new page.

See also [Pause/shut down clusters](#pauseshut-down-clusters).

## Add additional storage accounts

You can add additional Azure Storage accounts and Azure Data Lake Storage accounts after a cluster is created. For more information, see [Add additional storage accounts to HDInsight](./hdinsight-hadoop-add-storage.md).

## Scale clusters

The cluster scaling feature allows you to change the number of worker nodes used by an Azure HDInsight cluster, without having to re-create the cluster.

See [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md) for complete information.

## Pause/shut down clusters

Most of Hadoop jobs are batch jobs that are only run occasionally. For most Hadoop clusters, there are large periods of time that the cluster isn't being used for processing. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use.
You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

There are many ways you can program the process:

- User Azure Data Factory. See [Create on-demand Linux-based Apache Hadoop clusters in HDInsight using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md) for creating on-demand HDInsight linked services.
- Use Azure PowerShell.  See [Analyze flight delay data](./interactive-query/interactive-query-tutorial-analyze-flight-data.md).
- Use Azure CLI. See [Manage Azure HDInsight clusters using Azure CLI](hdinsight-administer-use-command-line.md).
- Use HDInsight .NET SDK. See [Submit Apache Hadoop jobs](hadoop/submit-apache-hadoop-jobs-programmatically.md).

For the pricing information, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/). To delete a cluster from the Portal, see [Delete clusters](#delete-clusters)

## Upgrade clusters

See [Upgrade HDInsight cluster to a newer version](./hdinsight-upgrade-cluster.md).

## Open the Apache Ambari web UI

Ambari provides an intuitive, easy-to-use Hadoop management web UI backed by its RESTful APIs. Ambari enables system administrators to manage and monitor Hadoop clusters.

From the [cluster home page](#homePage):

1. Select **Cluster dashboards**.

    :::image type="content" source="./media/hdinsight-administer-use-portal-linux/hdinsight-azure-portal-cluster-menu2.png" alt-text="HDInsight Apache Hadoop cluster menu":::

1. Select **Ambari home** from the new page.
1. Enter the cluster username and password.  The default cluster username is _admin_.

For more information, see [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md).

## Change passwords

An HDInsight cluster can have two user accounts. The HDInsight cluster user account (HTTP user account) and the SSH user account are created during the creation process. You can use the portal to change the cluster user account password, and script actions to change the SSH user account.

### Change the cluster user password

> [!NOTE]  
> Changing the cluster user (admin) password may cause script actions run against this cluster to fail. If you have any persisted script actions that target worker nodes, these scripts may fail when you add nodes to the cluster through resize operations. For more information on script actions, see [Customize HDInsight clusters using script actions](hdinsight-hadoop-customize-cluster-linux.md).

From the [cluster home page](#homePage):
1. Select **SSH + Cluster login** under **Settings**.
2. Select **Reset credential**.
3. Enter and confirm new password in the text boxes.
4. Select **OK**.

The password is changed on all nodes in the cluster.

### Change the SSH user password or public key

1. Using a text editor, save the following text as a file named **changecredentials.sh**.

    > [!IMPORTANT]  
    > You must use an editor that uses LF as the line ending. If the editor uses CRLF, then the script does not work.

    ```bash
    #! /bin/bash
    USER=$1
    PASS=$2
    usermod --password $(echo $PASS | openssl passwd -1 -stdin) $USER
    ```

2. Upload the file to a storage location that can be accessed from HDInsight using an HTTP or HTTPS address. For example, a public file store such as OneDrive or Azure Blob storage. Save the URI (HTTP or HTTPS address) to the file, as this URI is needed in the next step.
3. From the [cluster home page](#homePage), select **Script actions** under **Settings**.
4. From the **Script actions** page, select **Submit new**.
5. From the **Submit script action** page, enter the following information:

> [!NOTE]
> SSH passwords cannot contain the following characters:
>
> ``` " ' ` / \ < % ~ | $ & ! ```

   | Field | Value |
   | --- | --- |
   | Script type | Select **- Custom** from the drop-down list.|
   | Name |"Change ssh credentials" |
   | Bash script URI |The URI to the changecredentials.sh file |
   | Node type(s): (Head, Worker, Nimbus, Supervisor, or Zookeeper.) |✓ for all node types listed |
   | Parameters |Enter the SSH user name and then the new password. There should be one space between the user name and the password. |
   | Persist this script action ... |Leave this field unchecked. |

6. Select **Create** to apply the script. Once the script finishes, you're able to connect to the cluster using SSH with the new credentials.

## Find the subscription ID

Each cluster is tied to an Azure subscription.  The Azure subscription ID is visible from the [cluster home page](#homePage).

## Find the resource group

In the Azure Resource Manager mode, each HDInsight cluster is created with an Azure Resource Manager group. The Resource Manager group is visible from the [cluster home page](#homePage).

## Find the storage accounts

HDInsight clusters use either an Azure Storage account or Azure Data Lake Storage to store data. Each HDInsight cluster can have one default storage account and a number of linked storage accounts. To list the storage accounts, from the [cluster home page](#homePage) under **Settings**, select **Storage accounts**.

## Monitor jobs

See [Manage HDInsight clusters by using the Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md#monitoring).

## Cluster size

The **Cluster size** tile from the [cluster home page](#homePage) displays the number of cores allocated to this cluster and how they're allocated for the nodes within this cluster.

> [!IMPORTANT]  
> To monitor the services provided by the HDInsight cluster, you must use Ambari Web or the Ambari REST API. For more information on using Ambari, see [Manage HDInsight clusters using Apache Ambari](hdinsight-hadoop-manage-ambari.md)

## Connect to a cluster

- [Use Apache Hive with HDInsight](hadoop/apache-hadoop-use-hive-ambari-view.md)
- [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)

## Next steps

In this article, you learned some basic administrative functions. To learn more, see the following articles:

- [Administer HDInsight Using Azure PowerShell](hdinsight-administer-use-powershell.md)
- [Administer HDInsight Using Azure CLI](hdinsight-administer-use-command-line.md)
- [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
- [Details on using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
- [Use Apache Hive in HDInsight](hadoop/hdinsight-use-hive.md)
- [Use Apache Sqoop in HDInsight](hadoop/hdinsight-use-sqoop.md)
- [Use Python User Defined Functions (UDF) with Apache Hive and Apache Pig in HDInsight](hadoop/python-udf-hdinsight.md)
- [What version of Apache Hadoop is in Azure HDInsight?](hdinsight-component-versioning.md)
