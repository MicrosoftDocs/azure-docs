---
title: Manage cluster access
description: How to manage cluster access in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/4/2023
---

# Manage cluster access

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article provides an overview of the mechanisms available to manage access for HDInsight on AKS cluster pools and clusters. 
It also covers how to assign permission to users, groups, user-assigned managed identity, and service principals to enable access to cluster data plane.

When a user creates a cluster, then that user is authorized to perform the operations with data accessible to the cluster. However, to allow other users to execute queries and jobs on the cluster, access to cluster data plane is required.


## Manage cluster pool or cluster access (Control plane)

The following HDInsight on AKS and Azure built-in roles are available for cluster management to manage the cluster pool or cluster resources.

|Role|Description|
|-|-|
|Owner |Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.|
|Contributor |Grants full access to manage all resources but doesn't allow you to assign roles in Azure RBAC.|
|Reader |View all resources but doesn't allow you to make any changes.|
|HDInsight on AKS Cluster Pool Admin |Grants full access to manage a cluster pool including ability to delete the cluster pool.|
|HDInsight on AKS Cluster Admin |Grants full access to manage a cluster including ability to delete the cluster.|

You can use Access control (IAM) blade to manage the access for cluster pool’s and  control plane.

Refer: [Grant a user access to Azure resources using the Azure portal - Azure RBAC](/azure/role-based-access-control/quickstart-assign-role-user-portal).

## Manage cluster access (Data plane)

This access enables you to do the following actions:
* View clusters and manage jobs.
* All the monitoring and management operations.
* To enable auto scale and update the node count.
  
The access is restricted for:
* Cluster deletion.

To assign permission to users, groups, user-assigned managed identity, and service principals to enable access to cluster’s data plane, the following options are available:

 * [Azure portal](#using-azure-portal)
 * [ARM template](#using-arm-template)

### Using Azure portal

#### How to grant access
 
The following steps describe how to provide access to other users, groups, user-assigned managed identity, and service principals.

1. Navigate to the **Cluster access** blade of your cluster in the Azure portal and click **Add**.

   :::image type="content" source="./media/hdinsight-on-aks-manage-authorization-profile/cluster-access.png" alt-text="Screenshot showing how to provide access to a user for cluster access.":::

1. Search for the user/group/user-assigned managed identity/service principal to grant access and click **Add**.

   :::image type="content" source="./media/hdinsight-on-aks-manage-authorization-profile/add-members.png" alt-text="Screenshot showing how to add member for cluster access.":::

#### How to remove access

1. Select the members to be removed and click **Remove**.

   :::image type="content" source="./media/hdinsight-on-aks-manage-authorization-profile/remove-access.png" alt-text="Screenshot showing how to remove cluster access for a member.":::

### Using ARM template

#### Prerequisites

* An operational HDInsight on AKS cluster.
* [ARM template](./create-cluster-using-arm-template-script.md) for your cluster.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).
 
Follow the steps to update `authorizationProfile` object under `clusterProfile` section in your cluster ARM template.

1. In the Azure portal search bar, search for user/group/user-assigned managed identity/service principal.

   :::image type="content" source="./media/hdinsight-on-aks-manage-authorization-profile/search-object-id.png" alt-text="Screenshot showing how to search object ID.":::
   
1. Copy the **Object ID** or **Principal ID**.

   :::image type="content" source="./media/hdinsight-on-aks-manage-authorization-profile/view-object-id.png" alt-text="Screenshot showing how to view object ID.":::

1. Modify the `authorizationProfile` section in your cluster ARM template.

    1. Add user/user-assigned managed identity/service principal Object ID or Principal ID under `userIds` property.
    
    1. Add groups Object ID under `groupIds` property.
       
       ```json
       "authorizationProfile": {
       "userIds": [
                    "abcde-12345-fghij-67890",
                    "a1b1c1-12345-abcdefgh-12345"
                ],
       "groupIds": []
            },
       ```
      
 1. Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
