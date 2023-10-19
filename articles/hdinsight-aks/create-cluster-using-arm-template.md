---
title: Export cluster ARM template
description: Learn how to Create cluster ARM template
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Export cluster ARM template

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to generate an ARM template from resource JSON of your cluster. 

## Prerequisites

* An operational HDInsight on AKS cluster.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

## Steps to generate ARM template for the cluster

1. Sign in to [Azure portal](https://portal.azure.com).
   
1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/create-cluster-using-arm-template/portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." border="true" lightbox="./media/create-cluster-using-arm-template/portal-search.png":::
   
1. Select your cluster name from the list page.

   :::image type="content" source="./media/create-cluster-using-arm-template/portal-search-result.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/create-cluster-using-arm-template/portal-search-result.png":::
   
1. Go to the overview blade of your cluster and click on *JSON View* at the top right.

   :::image type="content" source="./media/create-cluster-using-arm-template/view-cost-json-view.png" alt-text="Screenshot showing how to view cost and JSON View buttons from the Azure portal." border="true" lightbox="./media/create-cluster-using-arm-template/view-cost-json-view.png":::
   
1. Copy the response to an editor. For example: Visual Studio Code.
1. Modify the response with the following changes to turn it into a valid ARM template.

    * Remove the following objects-
        * `id`, `systemData`
        * `deploymentId`, `provisioningState`, and `status` under properties object.

    * Change "name" value to `<your clusterpool name>/<your cluster name>`.

      :::image type="content" source="./media/create-cluster-using-arm-template/change-cluster-name.png" alt-text="Screenshot showing how to change cluster name.":::
      
    * Add "apiversion": "2023-06-01-preview" in the same section with name, location etc.

         :::image type="content" source="./media/create-cluster-using-arm-template/api-version.png" alt-text="Screenshot showing how to modify the API version.":::

  1. Open [custom template](/azure/azure-resource-manager/templates/deploy-portal#deploy-resources-from-custom-template) from the Azure portal and select "Build your own template in the editor" option.
  
  1. Copy the modified response to the “resources” object in the ARM template format. For example:

      :::image type="content" source="./media/create-cluster-using-arm-template/modify-get-response.png" alt-text="Screenshot showing how to  modify the get response." border="true" lightbox="./media/create-cluster-using-arm-template/modify-get-response.png":::

Now, your cluster ARM template is ready. You can update the properties of the cluster and finally deploy the ARM template to refresh the resources. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
