---
title: Create an Apache Flink® cluster in HDInsight on AKS using Azure portal
description: Creating an Apache Flink cluster in HDInsight on AKS with Azure portal.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# Create an Apache Flink® cluster in HDInsight on AKS with Azure portal

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Complete the following steps to create an Apache Flink cluster on Azure portal.

## Prerequisites

Complete the prerequisites in the following sections:
* [Resource prerequisites](../prerequisites-resources.md)
* [Create a cluster pool](../quickstart-create-cluster.md#create-a-cluster-pool)

> [!IMPORTANT]
> * For creating a cluster in new cluster pool, assign AKS agentpool MSI "Managed Identity Operator" role on the user-assigned managed identity created as part of resource prerequisite. In case you have required permissions, this step is automated during creation.
> * AKS agentpool managed identity gets created during cluster pool creation. You can identify the AKS agentpool managed identity by **(your clusterpool name)-agentpool**. Follow these steps to [assign the role](../../role-based-access-control/role-assignments-portal.md#step-2-open-the-add-role-assignment-page).

## Create an Apache Flink cluster

Flink clusters can be created once cluster pool deployment has been completed, let us go over the steps in case you're getting started with an existing cluster pool

1. In the Azure portal, type *HDInsight cluster pools/HDInsight/HDInsight on AKS* and select Azure HDInsight on AKS cluster pools to go to the cluster pools page. On the HDInsight on AKS cluster pools page, select the cluster pool in which you want to create a new Flink cluster.
   
   :::image type="content" source="./media/create-flink-cluster/search-bar.png" alt-text="Diagram showing search bar in Azure portal.":::

1. On the specific cluster pool page, click [**+ New cluster**](../quickstart-create-cluster.md) and provide the following information:

   | Property| Description|
   |---|---|
   |Subscription | This field is autopopulated with the Azure subscription that was registered for the Cluster Pool.|
   |Resource Group|This field is autopopulated and shows the resource group on the cluster pool.|
   |Region|This field is autopopulated and shows the region selected on the cluster pool.|
   |Cluster Pool|This field is autopopulated and shows the cluster pool name on which the cluster is now getting created.To create a cluster in a different pool, find that cluster pool in the portal and click **+ New cluster**.|
   |HDInsight on AKS Pool Version|This field is autopopulated and shows the cluster pool version on which the cluster is now getting created.|
   |HDInsight on AKS Version | Select the minor or patch version of the HDInsight on AKS of the new cluster.|
   |Cluster type | From the drop-down list, select Flink.|
   |Cluster name|Enter the name of the new cluster.|
   |User-assigned managed identity | From the drop-down list, select the managed identity to use with the cluster. If you're the owner of the Managed Service Identity (MSI), and the MSI doesn't have Managed Identity Operator role on the cluster, click the link below the box to assign the permission needed from the AKS agent pool MSI. If the MSI already has the correct permissions, no link is shown. See the [Prerequisites](#prerequisites) for other role assignments required for the MSI.|
   |Storage account|From the drop-down list, select the storage account to associate with the Flink cluster and specify the container name. The managed identity is further granted access to the specified storage account, using the 'Storage Blob Data Owner' role during cluster creation.|
   |Virtual network | The virtual network for the cluster.|
   |Subnet|The virtual subnet for the cluster.|

1. Enabling **Hive catalog** for Flink SQL.

   |Property| Description|
   |---|---|
   |Use Hive catalog|Enable this option to use an external Hive metastore. |
   |SQL Database for Hive|From the drop-down list, select the SQL Database in which to add hive-metastore tables.|
   |SQL admin username|Enter the SQL server admin username. This account is used by metastore to communicate to SQL database.|
   |Key vault|From the drop-down list, select the Key Vault, which contains a secret with password for SQL server admin username. You are required to set up an access policy with all required permissions such as key permissions, secret permissions and certificate permissions to the MSI, which is being used for the cluster creation. The MSI needs a Key Vault Administrator role, add the required permissions using IAM.|
   |SQL password secret name|Enter the secret name from the Key Vault where the SQL database password is stored.|

   :::image type="content" source="./media/create-flink-cluster/flink-basics-page.png" alt-text="Screenshot showing basic tab.":::
   > [!NOTE]
   >  By default we use the **Storage account** for Hive catalog same as the storage account and container used during cluster creation.

1. Select **Next: Configuration** to continue.

1. On the **Configuration** page, provide the following information:

   |Property|Description|
   |---|---|
   |Node size|Select the node size to use for the Flink nodes both head and worker nodes.|
   |Number of nodes|Select the number of nodes for Flink cluster; by default head nodes are two. The worker nodes sizing helps determine the task manager configurations for the Flink. The job manager and history server are on head nodes.|

1. On the **Service Configuration** section, provide the following information:

   |Property|Description|
   |---|---|
   |Task manager CPU|Integer. Enter the size of the Task manager CPUs (in cores).|
   |Task manager memory in MB|Enter the Task manager memory size in MB. Min of 1800 MB.|
   |Job manager CPU|Integer. Enter the number of CPUs for the Job manager (in cores).|
   |Job manager memory in MB | Enter the memory size in MB. Minimum of 1800 MB.|
   |History server CPU|Integer. Enter the number of CPUs for the Job manager (in cores).|
   |History server memory in MB | Enter the memory size in MB. Minimum of 1800 MB.|

   :::image type="content" source="./media/create-flink-cluster/flink-configuration-page.png" alt-text="screenshot showing configurations tab.":::

     > [!NOTE]
     > * History server can be enabled/disabled as required.
     > * Schedule based autoscale is supported in Flink. You can schedule number of worker nodes as required. For example, it is enabled a schedule based autoscale with default worker node count as 3. And during weekdays from 9:00 UTC to 20:00 UTC, the worker nodes are scheduled to be 10. Later in the day, it needs to be defaulted to 3 nodes ( between 20:00 UTC to next day 09:00 UTC ). During weekends from 9:00 UTC to 20:00 UTC, worker nodes are 4.

1. On the **Auto Scale & SSH** section, update the following:

   |Property|Description|
   |---|---|
   |Auto Scale|Upon selection, you would be able to choose the schedule based autoscale to configure the schedule for scaling operations.|
   |Enable SSH|Upon selection, you can opt for total number of SSH nodes required, which are the access points for the Flink CLI using Secure Shell. The maximum SSH nodes allowed is 5.|
   
   :::image type="content" source="./media/create-flink-cluster/service-configuration.png" alt-text="Screenshot showing autoscale service configuration.":::
   
   :::image type="content" source="./media/create-flink-cluster/autoscale-rules.png" alt-text="Screenshot showing auto scale rules.":::
1. Click the **Next: Integration** button to continue to the next page.

1. On the **Integration** page, provide the following information:

   |Property|Description|
   |---|---|
   |Log analytics| This feature is available only if the cluster pool has associated log analytics workspace, once enabled the logs to collect can be selected.|
   |Azure Prometheus | This feature is to view Insights and Logs directly in your cluster by sending metrics and logs to Azure Monitor workspace.|

   :::image type="content" source="./media/create-flink-cluster/flink-integrations-page.png" alt-text="screenshot showing integrations tab.":::
   
1. Click the **Next: Tags** button to continue to the next page.
     
1. On the **Tags** page, provide the following information:

   | Property | Description|
   |---|---|
   |Name | Optional. Enter a name such as HDInsight on AKS to easily identify all resources associated with your cluster resources.|
   | Value | You can leave this blank.|
   | Resource | Select All resources selected.|

1. Select **Next: Review + create** to continue.
     
1. On the **Review + create** page, look for the **Validation succeeded** message at the top of the page and then click **Create**.

The **Deployment is in process** page is displayed which the cluster is created. It takes 5-10 minutes to create the cluster. Once the cluster is created, the **"Your deployment is complete"** message is displayed. If you navigate away from the page, you can check your Notifications for the current status.

> [!NOTE]
> Apache, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
