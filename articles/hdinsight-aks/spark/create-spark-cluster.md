---
title: How to create Spark cluster in HDInsight on AKS
description: Learn how to create Spark cluster in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Create Spark cluster in HDInsight on AKS (Preview)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Once the [prerequisite](../prerequisites-resources.md) steps are complete, and you have a cluster pool deployed, continue to use the Azure portal to create a Spark cluster. 
You can use the Azure portal to create an Apache Spark cluster in cluster pool. You then create a Jupyter Notebook and use it to run Spark SQL queries against Apache Hive tables.

1. In the Azure portal, type cluster pools, and select cluster pools to go to the cluster pools page. On the cluster pools page, select the cluster pool in which you can add a new Spark cluster.
1. On the specific cluster pool page, click **+ New cluster**.

    :::image type="content" source="./media/create-spark-cluster/create-new-spark-cluster.png" alt-text="Screenshot showing how to create new spark cluster." border="true" lightbox="./media/create-spark-cluster/create-new-spark-cluster.png":::
    
    This step opens the cluster create page.
    
    :::image type="content" source="./media/create-spark-cluster/create-cluster-basic-page-1.png" alt-text="Screenshot showing create cluster basic page 1." border="true" lightbox="./media/create-spark-cluster/create-cluster-basic-page-1.png":::
    
    :::image type="content" source="./media/create-spark-cluster/create-cluster-basic-page-2.png" alt-text="Screenshot showing create cluster basic page 2." border="true" lightbox="./media/create-spark-cluster/create-cluster-basic-page-2.png":::
    
    :::image type="content" source="./media/create-spark-cluster/create-cluster-basic-page-3.png" alt-text="Screenshot showing create cluster basic page 3." border="true" lightbox="./media/create-spark-cluster/create-cluster-basic-page-3.png":::
    
    |Property |	Description |
    |-|-|
    |Subscription 	|The Azure subscription that was registered for use with HDInsight on AKS in the Prerequisites section with be prepopulated|
    |Resource Group 	|The same resource group as the cluster pool will be pre populated |
    |Region 	|The same region as the cluster pool and virtual will  be pre populated| 
    |Cluster pool 	|The name of the cluster pool will be pre populated|
    |HDInsight Pool version	|The cluster pool version will be pre populated from the pool creation selection|
    |HDInsight on AKS version|	Specify the HDI on AKS version|
    |Cluster type 	|From the drop-down list, select Spark|
    |Cluster Version |	Select the version of the image version to use|
    |Cluster name 	|Enter the name of the new cluster|
    |User-assigned managed identity	|Select the user assigned managed identity which will work as a connection string with the storage|
    |Storage Account	|Select the pre created storage account which is to be used as primary storage for the cluster|
    |Container name	|Select the container name(unique) if pre created or create a new container|
    |Hive Catalog (optional)	|Select the pre created Hive metastore(Azure SQL DB) |
    |SQL Database for Hive 	|From the drop-down list, select the SQL Database in which to add hive-metastore tables. |
    |SQL admin username |Enter the SQL admin username|
    |Key vault 	|From the drop-down list, select the Key Vault, which contains a secret with password for SQL admin username|
    |SQL password secret name |Enter the secret name from the Key Vault where the SQL DB password is stored| 
    |Virtual Network |Virtual Network is prepopulated as selected during the time of cluster pool creation|
    |Subnet|Subnet is pre populated|
   
    > [!NOTE]
    > * Currently HDInsight support only MS SQL Server databases.
    > * Due to Hive limitation, "-" (hyphen) character in metastore database name is not supported.
    
1. Select **Next: Configuration + pricing** to continue.

    :::image type="content" source="./media/create-spark-cluster/create-cluster-pricing-tab-1.png" alt-text="Screenshot showing pricing tab 1." border="true" lightbox="./media/create-spark-cluster/create-cluster-pricing-tab-1.png":::
   
    :::image type="content" source="./media/create-spark-cluster/create-cluster-pricing-tab-2.png" alt-text="Screenshot showing pricing tab 2." border="true" lightbox="./media/create-spark-cluster/create-cluster-pricing-tab-2.png":::
    
    :::image type="content" source="./media/create-spark-cluster/create-cluster-ssh-tab.png" alt-text="Screenshot showing ssh tab." border="true" lightbox="./media/create-spark-cluster/create-cluster-ssh-tab.png":::

    |Property| Description |
    |-|-|
    |Node size| 	Select the node size to use for the Spark nodes|
    |Number of worker nodes| 	Select the number of nodes for Spark cluster. Out of those, three nodes are reserved for coordinator and system services, remaining nodes are dedicated to Spark workers, one worker per node. For example, in a five-node cluster there are two workers|
    |Autoscale|	Click on the toggle button to enable Autoscale|
    |Autoscale Type	|Select from either load based or schedule based autoscale|
    |Graceful decomission timeout	|Specify Graceful decommission timeout|
    |No of default worker node	|Select the number of nodes for autoscale|
    |Time Zone	|Select the time zone|
    |Autoscale Rules	|Select the day, start time, end time, no. of worker nodes|
    |Enable SSH 	|If enabled, allows you to define Prefix and Number of SSH nodes|
1. Click **Next : Integrations** to enable and select Log Analytics for Logging.

    Azure Prometheus for monitoring and metrics can be enabled post cluster creation.
   
    :::image type="content" source="./media/create-spark-cluster/integration-tab.png" alt-text="Screenshot showing integration tab." border="true" lightbox="./media/create-spark-cluster/integration-tab.png":::

1. Click **Next: Tags**  to continue to the next page.
   
    :::image type="content" source="./media/create-spark-cluster/tags-tab.png" alt-text="Screenshot showing tags tab." border="true" lightbox="./media/create-spark-cluster/tags-tab.png":::
   
1. On the **Tags** page, enter any tags you wish to add to your resource.
   
    |Property| Description |
    |-|-|
    |Name 	|Optional. Enter a name such as HDInsight on AKSPrivatePreview to easily identify all resources associated with your resources|
    |Value 	|Leave this blank|
    |Resource |Select All resources selected|
   
1. Click **Next: Review + create**.
1. On the **Review + create page**, look for the Validation succeeded message at the top of the page and then click **Create**.
1. The **Deployment is in process** page is displayed which the cluster is created. It takes 5-10 minutes to create the cluster. Once the cluster is created, **Your deployment is complete" message is displayed**. If you navigate away from the page, you can check your Notifications for the status.
1. Go to the **cluster overview page**, you can see endpoint links there.

    :::image type="content" source="./media/create-spark-cluster/cluster-overview.png" alt-text="Screenshot showing cluster overview page."border="true" lightbox="./media/create-spark-cluster/cluster-overview.png":::
