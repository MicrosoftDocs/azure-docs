---
title: Manage Apache Hadoop clusters in HDInsight by using the Azure portal
description: Learn how to create and manage Azure HDInsight clusters by using the Azure portal.
ms.service: azure-hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive, linux-related-content
author: hareshg
ms.author: hgowrisankar
ms.reviewer: nijelsf
ms.date: 07/23/2024
---

# Manage Apache Hadoop clusters in HDInsight by using the Azure portal

[!INCLUDE [selector](includes/hdinsight-portal-management-selector.md)]

By using the [Azure portal](https://portal.azure.com), you can manage [Apache Hadoop](https://hadoop.apache.org/) clusters in Azure HDInsight. Use the tab selector for information on managing Hadoop clusters in HDInsight by using other tools.

## Prerequisites

An existing Apache Hadoop cluster in HDInsight. For more information, see [Create Linux-based clusters in HDInsight by using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

## Get started

Sign in to the [portal](https://portal.azure.com).

## <a name="showClusters"></a> List and show clusters

The **HDInsight clusters** page lists your existing clusters. From the portal:

1. On the left menu, select **All services**.
1. Under **ANALYTICS**, select **HDInsight clusters**.

## <a name="homePage"></a> Cluster home page

On the [HDInsight clusters](#showClusters) page, select your cluster name. The **Overview** pane opens and looks similar to the following image.

:::image type="content" source="./media/hdinsight-administer-use-portal-linux/hdinsight-essentials2.png" alt-text="Screenshot that shows the Azure portal HDInsight cluster essentials.":::

### Top menu

| Item| Description |
|---|---|
|**Move**|Moves the cluster to another resource group or to another subscription.|
|**Delete**|Deletes the cluster. |
|**Refresh**|Refreshes the view.|

### Left menu

The left menu has multiple sections.

#### Upper-left menu

| Item| Description |
|---|---|
|**Overview**|Provide general information for your cluster.|
|**Activity log**|Show and query activity logs.|
|**Access control (IAM)**|Use role assignments. See [Assign Azure roles to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.yml).|
|**Tags**|Set key/value pairs to define a custom taxonomy of your cloud services. For example, you might create a key named **project**, and then use a common value for all services associated with a specific project.|
|**Diagnose and solve problems**|Display troubleshooting information.|
|**Quickstart**|Display information that helps you get started using HDInsight.|
|**Tools**|Help information for HDInsight-related tools.|

#### Settings menu  

| Item| Description |
|---|---|
|**Cluster size**|Check, increase, and decrease the number of cluster worker nodes. See [Scale clusters](hdinsight-administer-use-portal-linux.md#scale-clusters).|
|**Quota limits**|Display the used and available cores for your subscription.|
|**SSH + Cluster login**|Show the instructions to connect to the cluster by using a Secure Shell (SSH) connection. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).|
|**Azure Data Lake Storage Gen2**|Configure access to Data Lake Storage Gen2. See [Quickstart: Set up clusters in HDInsight](./hdinsight-hadoop-use-data-lake-storage-gen2-portal.md).|
|**Storage accounts**|View the storage accounts and the keys. The storage accounts are configured during the cluster creation process.|
|**Applications**|Add or remove HDInsight applications. See [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).|
|**Script actions**|Run Bash scripts on the cluster. See [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).|
|**External metastores**|View the [Apache Hive](https://hive.apache.org/) and [Apache Oozie](https://oozie.apache.org/) metastores. You can configure the metastores only during the cluster creation process.|
|**HDInsight partner**|Add or remove the current HDInsight partner.|
|**Properties**|View the [cluster properties](#properties).|
|**Locks**|Add a lock to prevent the cluster from being modified or deleted.|
|**Export template**|Display and export the Azure Resource Manager template for the cluster. Currently, you can export only the dependent Azure Storage account. See [Create Linux-based Apache Hadoop clusters in HDInsight by using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).|

#### Monitoring menu

| Item| Description |
|---|---|
|**Alerts**|Manage the alerts and actions.|
|**Metrics**|Monitor the cluster metrics in Azure Monitor logs.|
|**Diagnosis settings**|Set where to store the diagnosis metrics.|
|**Azure Monitor**|Monitor your cluster in Azure Monitor.|

#### Support + troubleshooting menu

| Item| Description |
|---|---|
|**Resource health**|See [Azure resource health overview](/azure/service-health/resource-health-overview).|
|**New support request**|Create a support ticket with Microsoft Support.|

## <a name="properties"></a> Cluster properties

On the [cluster home page](#homePage), under **Settings**, select **Properties**.

|Item | Description |
|---|---|
|**HOSTNAME**|Cluster name.|
|**CLUSTER URL**|The URL for the Ambari web interface.|
|**Private Endpoint**|The private endpoint for the cluster.|
|**Secure Shell** |The username and host name to use to access the cluster via SSH.|
|**STATUS**|One of Aborted, Accepted, ClusterStorageProvisioned, AzureVMConfiguration, HDInsightConfiguration, Operational, Running, Error, Deleting, Deleted, Timeout, DeleteQueued, DeleteTimeout, DeleteError, PatchQueued, CertRolloverQueued, ResizeQueued, or ClusterCustomization.|
|**REGION**|Azure location. For a list of supported Azure locations, see the **Region** dropdown list on [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).|
|**DATE CREATED**|The date the cluster was deployed.|
|**OPERATING SYSTEM**|Either Windows or Linux.|
|**TYPE**|Hadoop, HBase, or Spark.|
|**Version**|See [HDInsight versions](hdinsight-component-versioning.md).|
|**Minimum TLS version**|The Transport Layer Security (TLS) version.|
|**SUBSCRIPTION**|Subscription name.|
|**DEFAULT DATA SOURCE**|The default cluster file system.|
|**Worker nodes sizes**|The selected virtual machine (VM) size of the worker nodes.|
|**Head node size**|The selected VM size of the head nodes.|
|**Virtual network**|The name of the virtual network, where the cluster is deployed, if one was selected at deployment time.|

## Move clusters

You can move an HDInsight cluster to another Azure resource group or another subscription.

On the [cluster home page](#homePage):

1. On the top menu, select **Move**.


1. Select **Move to another resource group** or **Move to another subscription**.
1. Follow the instructions on the new page.

## Delete clusters

Deleting a cluster doesn't delete the default storage account or any linked storage accounts. You can re-create the cluster by using the same storage accounts and the same metastores. We recommend that you use a new default blob container when you re-create the cluster.

On the [cluster home page](#homePage):

1. On the top menu, select **Delete**.
1. Follow the instructions on the new page.

For more information, see [Pause or shut down clusters](#pause-or-shut-down-clusters).

## Add more storage accounts

You can add more Azure Storage accounts and Azure Data Lake Storage accounts after a cluster is created. For more information, see [Add additional storage accounts to HDInsight](./hdinsight-hadoop-add-storage.md).

## Scale clusters

You can use the cluster scaling feature to change the number of worker nodes that are used by an HDInsight cluster, without having to re-create the cluster.

For more information, see [Scale HDInsight clusters](./hdinsight-scaling-best-practices.md).

## Pause or shut down clusters

Most Hadoop jobs are batch jobs that run only occasionally. For most Hadoop clusters, there are large periods of time when the cluster isn't used for processing. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Because the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

You can program the process in many ways. You can use:

- **Azure Data Factory**: See [Create on-demand Linux-based Apache Hadoop clusters in HDInsight by using Azure Data Factory](hdinsight-hadoop-create-linux-clusters-adf.md) for creating on-demand HDInsight linked services.
- **Azure PowerShell**: See [Analyze flight delay data](./interactive-query/interactive-query-tutorial-analyze-flight-data.md).
- **Azure CLI**: See [Manage Azure HDInsight clusters by using the Azure CLI](hdinsight-administer-use-command-line.md).
- **HDInsight .NET SDK**: See [Submit Apache Hadoop jobs](hadoop/submit-apache-hadoop-jobs-programmatically.md).

For pricing information, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/). To delete a cluster from the portal, see [Delete clusters](#delete-clusters).

## Upgrade clusters

For more information, see [Upgrade an HDInsight cluster to a newer version](./hdinsight-upgrade-cluster.md).

## Open the Apache Ambari web UI

Ambari provides an intuitive, easy-to-use Hadoop management web UI that's backed by its RESTful APIs. With Ambari, system administrators can manage and monitor Hadoop clusters.

On the [cluster home page](#homePage):

1. Select **Cluster dashboards**.

    :::image type="content" source="./media/hdinsight-administer-use-portal-linux/hdinsight-azure-portal-cluster-menu2.png" alt-text="Screenshot that shows the HDInsight Apache Hadoop cluster menu.":::

1. On the new page, select **Ambari home**.
1. Enter the cluster username and password. The default cluster username is **admin**.

For more information, see [Manage HDInsight clusters by using the Apache Ambari web UI](hdinsight-hadoop-manage-ambari.md).

## Change passwords

An HDInsight cluster can have two user accounts. The HDInsight cluster user account (HTTP user account) and the SSH user account are created during the creation process. You can use the portal to change the cluster user account password and use script actions to change the SSH user account.

### Change the cluster user password

> [!NOTE]  
> Changing the cluster user (admin) password might cause script actions that run against this cluster to fail. If you have any persisted script actions that target worker nodes, these scripts might fail when you add nodes to the cluster through resize operations. For more information on script actions, see [Customize HDInsight clusters by using script actions](hdinsight-hadoop-customize-cluster-linux.md).

On the [cluster home page](#homePage):

1. Under **Settings**, select **SSH + Cluster login**.
1. Select **Reset credential**.
1. Enter and confirm a new password in the text boxes.
1. Select **OK**.

The password changes on all nodes in the cluster.

### Change the SSH user password or public key

1. Use a text editor to save the following text as a file named `changecredentials.sh`.

    > [!IMPORTANT]  
    > You must use an editor that uses `LF` as the line ending. If the editor uses `CRLF`, the script doesn't work.

    ```bash
    #! /bin/bash
    USER=$1
    PASS=$2
    usermod --password $(echo $PASS | openssl passwd -1 -stdin) $USER
    ```

1. Upload the file to a storage location that you can access from HDInsight by using an HTTP or HTTPS address. An example is a public file store such as OneDrive or Azure Blob Storage. Save the URI (HTTP or HTTPS address) to the file. The URI is needed in the next step.
1. On the [cluster home page](#homePage), under **Settings**, select **Script actions**.
1. On the **Script actions** page, select **Submit new**.
1. On the **Submit script action** page, enter the information in the following table.

    > [!NOTE]
    > SSH passwords can't contain the following characters: " ' ` / \ < % ~ | $ & ! #
    
    | Field | Value |
    | --- | --- |
    | **Script type** | Select **- Custom** from the dropdown list.|
    | **Name** |"Change ssh credentials." |
    | **Bash script URI** |The URI to the `changecredentials.sh` file. |
    | **Node types: Head, Worker, Nimbus, Supervisor, or ZooKeeper** |Select ✓ for all node types listed. |
    | **Parameters** |Enter the SSH username, and then enter the new password. There should be only one space between the username and the password. |
    | **Persist this script action ...** |Leave this field clear. |

1. Select **Create** to apply the script. After the script finishes, you can connect to the cluster by using SSH with the new credentials.

## Find the subscription ID

Each cluster is tied to an Azure subscription. The Azure subscription ID is visible on the [cluster home page](#homePage).

## Find the resource group

In the Resource Manager mode, each HDInsight cluster is created with a Resource Manager group. The Resource Manager group is visible on the [cluster home page](#homePage).

## Find the storage accounts

HDInsight clusters use either an Azure Storage account or Data Lake Storage to store data. Each HDInsight cluster can have one default storage account and many linked storage accounts. To list the storage accounts, on the [cluster home page](#homePage), under **Settings**, select **Storage accounts**.

## Monitor jobs

For more information, see [Manage HDInsight clusters by using the Apache Ambari web UI](hdinsight-hadoop-manage-ambari.md#monitoring).

## Cluster size

The **Cluster size** tile on the [cluster home page](#homePage) displays the number of cores allocated to this cluster and how they're allocated for the nodes within this cluster.

> [!IMPORTANT]  
> To monitor the services provided by the HDInsight cluster, you must use the Ambari web UI or the Ambari REST API. For more information on using Ambari, see [Manage HDInsight clusters by using Apache Ambari](hdinsight-hadoop-manage-ambari.md).

## Connect to a cluster

- [Use Apache Hive with HDInsight](hadoop/apache-hadoop-use-hive-ambari-view.md)
- [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)

## Related content

In this article, you learned some basic administrative functions. To learn more, see the following articles:

- [Administer HDInsight by using Azure PowerShell](hdinsight-administer-use-powershell.md)
- [Administer HDInsight by using the Azure CLI](hdinsight-administer-use-command-line.md)
- [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md)
- [Details on using the Apache Ambari REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
- [Use Apache Hive in HDInsight](hadoop/hdinsight-use-hive.md)
- [Use Apache Sqoop in HDInsight](hadoop/hdinsight-use-sqoop.md)
- [Use Python user-defined functions (UDFs) with Apache Hive and Apache Pig in HDInsight](hadoop/python-udf-hdinsight.md)
- [What version of Apache Hadoop is in Azure HDInsight?](hdinsight-component-versioning.md)
