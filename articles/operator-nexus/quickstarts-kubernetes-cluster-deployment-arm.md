---
title: Create an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template)
description: Learn how to create an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template).
ms.service: azure-operator-nexus
author: dramasamy
ms.author: dramasamy
ms.topic: quickstart-arm
ms.custom: subject-armqs, devx-track-arm-template, devx-track-azurecli
ms.date: 05/14/2023
---

# Quickstart: Deploy an Azure Nexus Kubernetes cluster by using Azure Resource Manager template (ARM template)

* Deploy an Azure Nexus Kubernetes cluster using an Azure Resource Manager template.

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create Azure Nexus Kubernetes cluster.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]


## Prerequisites

[!INCLUDE [kubernetes-cluster-prereq](./includes/kubernetes-cluster/quickstart-prereq.md)]

## Review the template

Before deploying the Kubernetes template, let's review the content to understand its structure. 

:::code language="json" source="includes/kubernetes-cluster/quickstart-arm-deploy.json":::

Once you have reviewed and saved the template file named ```kubernetes-deploy.json```, proceed to the next section to deploy the template.

## Deploy the template

1. Create a file named ```kubernetes-deploy-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/kubernetes-cluster/quickstart-deploy-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create \
      --resource-group myResourceGroup \
      --template-file kubernetes-deploy.json \
      --parameters @kubernetes-deploy-parameters.json
```

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-cli](./includes/kubernetes-cluster/quickstart-review-deployment-cli.md)]

## Connect to the cluster

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/quickstart-cluster-connect.md)]

## Add an agent pool
The cluster created in the previous step has a single node pool. Let's add a second agent pool using the ARM template. The following example creates an agent pool named ```myNexusAKSCluster-nodepool-2```:

1. Review the template.

Before adding the agent pool template, let's review the content to understand its structure. 

:::code language="json" source="includes/kubernetes-cluster/quickstart-arm-add-node-pool.json":::

Once you have reviewed and saved the template file named ```kubernetes-add-agentpool.json```, proceed to the next section to deploy the template.

1. Create a file named ```kubernetes-nodepool-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/kubernetes-cluster/quickstart-add-node-pool-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create \
      --resource-group myResourceGroup \
      --template-file kubernetes-add-agentpool.json \
      --parameters @kubernetes-nodepool-parameters.json
```

[!INCLUDE [quickstart-review-nodepool](./includes/kubernetes-cluster/quickstart-review-nodepool.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/kubernetes-cluster/quickstart-cleanup.md)]

## Next steps

[!INCLUDE [quickstart-nextsteps](./includes/kubernetes-cluster/quickstart-nextsteps.md)]
