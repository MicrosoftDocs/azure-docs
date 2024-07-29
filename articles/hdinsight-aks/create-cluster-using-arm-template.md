---
title: Export cluster ARM template
description: Learn how to Create cluster ARM template using Azure CLI
ms.service: hdinsight-aks
ms.custom: devx-track-arm-template, devx-track-azurecli
ms.topic: how-to
ms.date: 02/12/2024
---

# Export cluster ARM template - Azure CLI

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to generate an ARM template using Azure CLI. 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]
* An operational HDInsight on AKS cluster.
  

## Steps to generate ARM template for the cluster
    
1. Run the following command.

   ```azurecli-interactive

   az group export --resource-group "{cluster-rg}" --resource-ids "{resource_id}" --include-parameter-default-value --include-comments

   # cluster-rg = Resource group of your cluster
   # resource_id = Cluster resource id. You can get it from "JSON view" in the overview blade of your cluster in the Azure portal.
   ```

   :::image type="content" source="./media/create-cluster-using-arm-template/command-execution-output.png" alt-text="Screenshot showing output of the command executed to get the ARM template of the HDInsight on AKS Cluster." border="true" lightbox="./media/create-cluster-using-arm-template/command-execution-output.png":::
   

Now, your cluster ARM template is ready. You can update the properties of the cluster and finally deploy the ARM template to refresh the resources. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
