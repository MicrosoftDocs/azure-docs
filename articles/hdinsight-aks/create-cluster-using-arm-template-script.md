---
title: Export ARM template in Azure HDInsight on AKS
description: How to create an ARM template of a cluster in Azure HDInsight on AKS
ms.service: hdinsight-aks
ms.custom: devx-track-arm-template
ms.topic: how-to 
ms.date: 02/12/2024
---

# Export cluster ARM template - Azure portal

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to generate an ARM template for your cluster automatically. You can use the ARM template to modify, clone, or recreate a cluster starting from the existing cluster's configurations.

## Prerequisites

* An operational HDInsight on AKS cluster.
     
## Steps to generate ARM template for the cluster

1. Sign in to [Azure portal](https://portal.azure.com).

1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/cloud-portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." border="true" lightbox="./media/create-cluster-using-arm-template-script/cloud-portal-search.png":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/cloud-portal-list-view.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/create-cluster-using-arm-template-script/cloud-portal-list-view.png":::
  
1. Navigate to the "Export template" blade of your cluster and click "Download" to export the template.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/export-template-download-view.png" alt-text="Screenshot showing export template option from the Azure portal." border="true" lightbox="./media/create-cluster-using-arm-template-script/export-template-download-view.png":::
  
Now, your cluster ARM template is ready. You can update the properties of the cluster and finally deploy the ARM template to refresh the resources. To redeploy, you can either use the "Deploy" option in your cluster under "Export template" blade by replacing the existing template with the modified template or see [deploy an ARM template using Azure portal](/azure/azure-resource-manager/templates/deploy-portal#deploy-resources-from-custom-template).

> [!IMPORTANT]
> If you're cloning the cluster or creating a new cluster, you'll need to modify the `name`, `location`, and `fqdn` (the fqdn must match the cluster name).
