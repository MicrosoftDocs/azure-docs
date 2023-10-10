---
title: One-click deployment for Azure HDInsight on AKS (Preview)
description: How to create cluster pool and cluster with one-click deployment on Azure HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Get started with one-click deployment (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

One-click deployments are designed for users to experience zero touch creation of HDInsight on AKS. It eliminates the need to manually perform certain steps. 
This article describes how to use readily available ARM templates to create a cluster pool and cluster in few clicks. 

> [!NOTE]
> - These ARM templates cover the basic requirements to create a cluster pool and cluster along with prerequisite resources. To explore advanced options, see [Create cluster pool and clusters](quickstart-create-cluster.md).
> - Necessary resources are created as part of the ARM template deployment in your resource group. For more information, see [Resource prerequisites](prerequisites-resources.md).  
> - The user must have permission to create new resources and assign roles to the resources in the subscription to deploy these ARM templates. 
> - Before you begin with ARM templates, please keep [object ID ready](#find-object-id-of-an-identity) for the identity you are going to use for deployment.

|Workload|Template|Description|
|---|---|---|
|Trino| [![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickTrino.json) | Creates cluster pool and cluster **without** HMS, custom VNet, and Monitoring capability.|
|Flink|[![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickFlink.json) | Creates cluster pool and cluster **without** HMS, custom VNet, and Monitoring capability.|
|Spark| [![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickSpark.json) | Creates cluster pool and cluster **without** HMS, custom VNet, and Monitoring capability.|
|Trino|[![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickTrino_WithVnet.json) | Creates cluster pool and cluster with an existing custom VNet.|
|Flink| [![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickFlink_WithVnet.json) | Creates cluster pool and cluster with an existing custom VNet.|
|Spark| [![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FoneClickSpark_WithVnet.json)| Creates cluster pool and cluster with an existing custom VNet.|

When you click on one of these templates, it launches Custom deployment page in the Azure portal. You need to provide the details for the following parameters based on the template used. 

|**Property**|**Description**|
|---|---|
|Subscription| Select the Azure subscription in which resources are to be created.|
|Resource Group|Create a new resource group, or select the resource group in your subscription from the drop-down list under which resources are to be created.|
|Region|Select the region where the resource group is deployed.|
|Cluster Pool Name| Enter the name of the cluster pool to be created. Cluster pool name length can't be more than 26 characters. It must start with an alphabet, end with an alphanumeric character, and must only contain alphanumeric characters and hyphens.|
|Cluster Pool Version| Select the HDInsight on AKS cluster pool version. |
|Cluster Pool Node VM Size|From the drop-down list, select the virtual machine size for the cluster pool based on your requirement.|
|Location|Select the region where the cluster and necessary resources are to be deployed.|
|Resource Prefix|Provide a prefix for creating necessary resources for cluster creation, resources are named as [prefix + predefined string].|
|Cluster Name |Enter the name of the new cluster.|
|HDInsight on AKS Version | Select the minor or patch version of the HDInsight on AKS of the new cluster. For more information, see [versioning](./versions.md).|
|Cluster Node VM Size |Provide the VM size for the cluster. For example: Standard_D8ds_v5.|
|Cluster OSS Version |Provide the cluster type supported OSS version in three part naming format. For example: Trino - 0.410.0, Flink - 1.16.0, Spark - 3.3.1|
|Custom VNet Name |Provide custom virtual network to be associated with the cluster pool. It should be in the same resource group as your cluster pool. |
|Subnet Name in Custom Vnet |Provide subnet name defined in your custom virtual network. |
|User Object ID| Provide user alias object ID from Microsoft Entra ID [(Azure Active Directory)](https://www.microsoft.com/security/business/identity-access/azure-active-directory).|
   
 ### Find Object ID of an identity
 
 1. In the top search bar in the Azure portal, enter your user ID. (For example, john@contoso.com)

    :::image type="content" source="./media/get-started/search-object-id.png" alt-text="Screenshot showing how to search object ID.":::
   
 2. From Azure Active Directory box, click on your user ID.
    
    :::image type="content" source="./media/get-started/view-object-id.png" alt-text="Screenshot showing how to view object ID.":::
    
 1. Copy the Object ID.
 
 ### Deploy
 
 1. Select **Next: Review + create** to continue.
 1. On the **Review + create** page, based on validation status, continue to click **Create**.

    :::image type="content" source="./media/get-started/custom-deployment-summary.png" alt-text="Screenshot showing custom deployment summary.":::

   The **Deployment is in progress** page is displayed while the resources are getting created, and the **"Your deployment is complete"**  page is displayed once the cluster pool and cluster are fully deployed and ready for use.

   :::image type="content" source="./media/get-started/custom-deployment-complete.png" alt-text="Screenshot showing custom deployment complete.":::

   

   If you navigate away from the page, you can check the status of the deployment by clicking Notifications :::image type="icon" source="./media/get-started/notifications.png" alt-text="Screenshot showing notifications icon in the Azure portal."::: in the Azure portal.
   
   > [!TIP]
   >
   > For troubleshooting any deployment errors, you can refer this [page](./create-cluster-error-dictionary.md).
    
