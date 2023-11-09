---
title: Create Apache Hadoop clusters using web browser, Azure HDInsight
description: Learn to create Apache Hadoop, Apache HBase, and Apache Spark clusters on HDInsight. Using web browser and the Azure portal.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 10/20/2022
---

# Create Linux-based clusters in HDInsight by using the Azure portal

[!INCLUDE [selector](includes/hdinsight-create-linux-cluster-selector.md)]

The Azure portal is a web-based management tool for services and resources hosted in the Microsoft Azure cloud. In this article, you learn how to create Linux-based Azure HDInsight clusters by using the portal. Additional details are available from [Create HDInsight clusters](./hdinsight-hadoop-provision-linux-clusters.md).

[!INCLUDE [delete-cluster-warning](includes/hdinsight-delete-cluster-warning.md)]

The Azure portal exposes most of the cluster properties. By using Azure Resource Manager templates, you can hide many details. For more information, see [Create Apache Hadoop clusters in HDInsight by using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create clusters

[!INCLUDE [secure-transfer-enabled-storage-account](includes/hdinsight-secure-transfer.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the top menu, select **+ Create a resource**.

    :::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-portal-create-resource.png" alt-text="Create a new cluster in the Azure portal":::

1. Select **Analytics** > **Azure HDInsight** to go to the **Create HDInsight cluster** page.

## Basics

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-hdinsight-40-portal-cluster-basics.png" alt-text="Screenshot showing HDInsight 4.0 create cluster basics.":::


From the **Basics** tab, provide the following information:

|Property |Description |
|---|---|
|Subscription|From the drop-down list, select the Azure subscription that's used for the cluster.|
|Resource group|From the drop-down list, select your existing resource group, or select **Create new**.|
|Cluster name|Enter a globally unique name.|
|Region|From the drop-down list, select a region where the cluster is created.|
|Availability zone|Optionally specify an availability zone in which to deploy your cluster.|
|Cluster type|Click **Select cluster type** to open a list. From the list, select the wanted cluster type. HDInsight clusters come in different types. They correspond to the workload or technology that the cluster is tuned for. There's no supported method to create a cluster that combines multiple types.|
|Version|From the drop-down list, select a **version**. Use the default version if you don't know what to choose. For more information, see [HDInsight cluster versions](hdinsight-component-versioning.md).|
|Cluster login username|Provide the username, default is **admin**.|
|Cluster login password|Provide the password.|
|Confirm cluster login password|Reenter the password|
|Secure Shell (SSH) username|Provide the username, default is **sshuser**|
|Use cluster login password for SSH|If you want the same SSH password as the admin password you specified earlier, select the **Use cluster login password for SSH** check box. If not, provide either a **PASSWORD** or **PUBLIC KEY** to authenticate the SSH user. A public key is the approach we recommend. Choose **Select** at the bottom to save the credentials configuration.  For more information, see [Connect to HDInsight (Apache Hadoop) by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).|

Select **Next: Storage >>** to advance to the next tab.

## Storage

> [!WARNING] 
> Starting June 15th, 2020 customers will not be able to create new service principal using HDInsight. See [Create Service Principal and Certificates](../active-directory/develop/howto-create-service-principal-portal.md) using Microsoft Entra ID.

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-portal-cluster-storage.png" alt-text="HDInsight create cluster storage":::

### Primary storage

From the drop-down list for **Primary storage type**, select your default storage type. The later fields to complete will vary based upon your selection. For **Azure Storage**:

1. For **Selection method**, choose either **Select from list**, or **Use access key**.
    * For **Select from list**, then select your **Primary storage account** from the drop-down list, or select **Create new**.
    * For **Use access key**, enter your **Storage account name**. Then provide the **Access key**.

1. For **Container**, accept the default value, or enter a new one.

### Additional Azure Storage

Optional: Select **Add Azure Storage** for additional cluster storage. Using an additional storage account in a different region than the HDInsight cluster isn't supported.

### Metastore Settings

Optional: Specify an existing SQL Database to save Apache Hive, Apache Oozie, and, or Apache Ambari metadata outside of the cluster. The Azure SQL Database that's used for the metastore must allow connectivity to other Azure services, including Azure HDInsight. When you create a metastore, don't name a database with dashes or hyphens. These characters can cause the cluster creation process to fail.

> [!IMPORTANT]
> For cluster shapes that support metastores, the default metastore provides an Azure SQL Database with a **basic tier 5 DTU limit (not upgradeable)**! Suitable for basic testing purposes. For large or production workloads, we recommend migrating to an external metastore.

Select **Next: Security + networking >>** to advance to the next tab.

## Security + networking

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-portal-cluster-security-networking.png" alt-text="HDInsight create cluster security networking":::

From the **Security + networking** tab, provide the following information:

|Property |Description |
|---|---|
|Enterprise security package|Optional: Select the check box to use **Enterprise Security Package**. For more information, see [Configure a HDInsight cluster with Enterprise Security Package by using Microsoft Entra Domain Services](./domain-joined/apache-domain-joined-configure-using-azure-adds.md).|
|TLS|Optional: Select a TLS version from the drop-down list. For more information, see [Transport Layer Security](./transport-layer-security.md).|
|Virtual network|Optional: Select an existing virtual network and subnet from the drop-down list. For information, see [Plan a virtual network deployment for Azure HDInsight clusters](hdinsight-plan-virtual-network-deployment.md). The article includes specific configuration requirements for the virtual network.|
|Disk encryption settings|Optional: Select the check box to use encryption. For more information, see [Customer-managed key disk encryption](./disk-encryption.md).|
|Kafka REST proxy|This setting is only available for cluster type Kafka. For more information, see [Using a REST proxy](./kafka/rest-proxy.md).|
|Identity|Optional: Select an existing user-assigned service identity from the drop-down list. For more information, see [Managed identities in Azure HDInsight](./hdinsight-managed-identities.md).|

Select **Next: Configuration + pricing >>** to advance to the next tab.

## Configuration + pricing

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-portal-cluster-configuration.png" alt-text="HDInsight create cluster configuration":::

From the **Configuration + pricing** tab, provide the following information:

|Property |Description |
|---|---|
|+ Add application|Optional: Select any applications that you want. Microsoft, independent software vendors (ISVs), or you can develop these applications. For more information, see [Install applications during cluster creation](hdinsight-apps-install-applications.md#install-applications-during-cluster-creation).|
|Node size|Optional: Select a different-sized node.|
|Number of nodes|Optional: Enter the number of nodes for the specified node type. If you plan on more than 32 worker nodes, select a head node size with at least eight cores and 14-GB RAM. Plan the nodes either at cluster creation or by scaling the cluster after creation.|
|Enable autoscale|Optional: Select the checkbox to enable the feature. For more information, see [Automatically scale Azure HDInsight clusters](./hdinsight-autoscale-clusters.md).|
|+ Add script action|Optional: This option works if you want to use a custom script to customize a cluster, as the cluster is being created. For more information about script actions, see [Customize Linux-based HDInsight clusters by using script actions](hdinsight-hadoop-customize-cluster-linux.md).|

Select **Review + create >>** to validate the cluster configuration and advance to the final tab.

## Tags

On the **Tags** page, provide the following information:

| Property | Description|
|---|---|
|Name | Optional. Enter a name of your choice to easily identify all resources.|
| Value | Leave this blank.|
| Resource | Select All resources selected.|     

## Review + create

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-hdinsight-40-portal-cluster-review-create-hadoop.png" alt-text="Screenshot showing HDInsight 4.0 create cluster summary.":::


Review the settings. Select **Create** to create the cluster.

It takes some time for the cluster to be created, usually around 20 minutes. Monitor **Notifications** to check on the provisioning process.

## Post creation

After the creation process finishes, select **Go to Resource** from the **Deployment succeeded** notification. The cluster window provides the following information.

:::image type="content" source="./media/hdinsight-hadoop-create-linux-clusters-portal/azure-hdinsight-40-create-cluster-completed.png" alt-text="Screenshot showing Azure HDInsight portal cluster overview.":::


Some of the icons in the window are explained as follows:

|Property | Description |
|---|---|
|Overview|Provides all the essential information about the cluster. Examples are the name, the resource group it belongs to, the location, the operating system, and the URL for the cluster dashboard.|
|Cluster dashboards|Directs you to the Ambari portal associated with the cluster.|
|SSH + Cluster login|Provides information needed to access the cluster by using SSH.|
|Delete|Deletes the HDInsight cluster.|

## Delete the cluster

See [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](./hdinsight-delete-cluster.md).

## Troubleshoot

If you run into issues with creating HDInsight clusters, see [access control requirements](./hdinsight-hadoop-customize-cluster-linux.md#access-control).

## Next steps

You've successfully created an HDInsight cluster. Now learn how to work with your cluster.

* [Use Apache Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Get started with Apache HBase on HDInsight](hbase/apache-hbase-tutorial-get-started-linux.md)
* [Customize Linux-based HDInsight clusters by using script actions](hdinsight-hadoop-customize-cluster-linux.md)
