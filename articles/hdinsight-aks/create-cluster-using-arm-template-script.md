---
title: Export ARM template in Azure HDInsight on AKS
description: How to create an ARM template to cluster using script in Azure HDInsight on AKS
ms.service: hdinsight-aks
ms.custom: devx-track-arm-template
ms.topic: how-to 
ms.date: 08/29/2023
---

# Export cluster ARM template using script

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to generate an ARM template for your cluster automatically using a script. You can use the ARM template to modify, clone, or recreate a cluster starting from the existing cluster's configurations.

## Prerequisites

* An operational HDInsight on AKS cluster.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).
     
## Steps to generate ARM template for the cluster

1. Sign in to [Azure portal](https://portal.azure.com).

2. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/cloud-portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." border="true" lightbox="./media/create-cluster-using-arm-template-script/cloud-portal-search.png":::
  
6. Select your cluster name from the list page.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/cloud-portal-list-view.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/create-cluster-using-arm-template-script/cloud-portal-list-view.png":::
  
2. Navigate to the overview blade of your cluster and click on *JSON View* at the top right.
  
   :::image type="content" source="./media/create-cluster-using-arm-template-script/view-cost-json-view.png" alt-text="Screenshot showing how to view cost and JSON View buttons from the Azure portal." border="true" lightbox="./media/create-cluster-using-arm-template-script/view-cost-json-view.png":::
  
2. Copy the "Resource JSON" and save it to a local JSON file. For example, `template.json`.

3. Click the following button at the top right in the Azure portal to launch Azure Cloud Shell.

   :::image type="content" source="./media/create-cluster-using-arm-template-script/cloud-shell.png" alt-text="Screenshot screenshot showing Cloud Shell icon.":::
  
5. Make sure Cloud Shell is set to "Bash" on the top left and upload your `template.json` file.

   :::image type="content" source="./media/create-cluster-using-arm-template-script/azure-cloud-shell-template-upload.png" alt-text="Screenshot showing how to upload your template.json file." border="true" lightbox="./media/create-cluster-using-arm-template-script/azure-cloud-shell-template-upload.png":::
   
2. Execute the following command to generate the ARM template.

   ```azurecli
      wget https://hdionaksresources.blob.core.windows.net/common/arm_transform.py

      python arm_transform.py template.json
   ```
   
    :::image type="content" source="./media/create-cluster-using-arm-template-script/azure-cloud-shell-script-output.png" alt-text="Screenshot showing results after running the script."  border="true" lightbox="./media/create-cluster-using-arm-template-script/azure-cloud-shell-script-output.png":::

This script creates an ARM template with name `template-modified.json` for your cluster and generates a command to deploy the ARM template.

Now, your cluster ARM template is ready. You can update the properties of the cluster and finally deploy the ARM template to refresh the resources. To redeploy, you can either use the Azure CLI command output by the script or [deploy an ARM template using Azure portal](/azure/azure-resource-manager/templates/deploy-portal#deploy-resources-from-custom-template).

> [!IMPORTANT]
> If you're cloning the cluster or creating a new cluster, you'll need to modify the `name`, `location`, and `fqdn` (the fqdn must match the cluster name).
