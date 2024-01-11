---
title: Quickstart - Create an Azure Nexus Kubernetes cluster by using Bicep
description: Learn how to create an Azure Nexus Kubernetes cluster by using Bicep.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: quickstart-bicep #Required; leave this attribute/value as-is.
ms.custom: subject-bicepqs, devx-track-azurecli, devx-track-bicep
ms.date: 05/13/2023
---

# Quickstart: Deploy an Azure Nexus Kubernetes cluster using Bicep

* Deploy an Azure Nexus Kubernetes cluster using Bicep.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

[!INCLUDE [kubernetes-cluster-prereq](./includes/kubernetes-cluster/quickstart-prereq.md)]

## Review the Bicep file

Before deploying the Kubernetes template, let's review the content to understand its structure. 

:::code language="bicep" source="includes/kubernetes-cluster/quickstart-bicep-deploy.bicep":::

Once you have reviewed and saved the template file named ```kubernetes-deploy.bicep```, proceed to the next section to deploy the template.

> [!NOTE]
> Creating multiple L3 isolation domains with the same CIDRs and custom L3 networks for each domain can lead to overlapping IP addresses when attached to a NAKS deployment. This overlap could cause issues if these networks are attached to the same pod. Currently, we prevent overlaps between L3 networks which have the `OSDevice` plugin type as such overlaps shouldn't be permitted in the Operating System Layer.
>
> For L3 networks with other plugin types: `DPDK, SRIOV, etc` we don't restrict this behavior and should they have overlapping CIDRS and attached to the same pod, there are possible issues that could occur:
> - **Routing Confusion**: When two networks have the same CIDR, the router may not know where to send packets leading to unpredictable behavior.
> - **IP Address Conflicts**: Communication between devices with the same IP address could be confusing.
> - **Troubleshooting Issues**: If L3 networks have overlapping CIDRs, it can be difficult to troubleshoot and diagnose errors.


## Deploy the Bicep file

1. Create a file named ```kubernetes-deploy-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/kubernetes-cluster/quickstart-deploy-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create \
      --resource-group myResourceGroup \
      --template-file kubernetes-deploy.bicep \
      --parameters @kubernetes-deploy-parameters.json
```

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-cli](./includes/kubernetes-cluster/quickstart-review-deployment-cli.md)]

## Connect to the cluster

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/quickstart-cluster-connect.md)]

## Add an agent pool
The cluster created in the previous step has a single node pool. Let's add a second agent pool using the Bicep template. The following example creates an agent pool named ```myNexusK8sCluster-nodepool-2```:

1. Review the template.

Before adding the agent pool template, let's review the content to understand its structure. 

:::code language="bicep" source="includes/kubernetes-cluster/quickstart-bicep-add-node-pool.bicep":::

Once you have reviewed and saved the template file named ```kubernetes-add-agentpool.bicep```, proceed to the next section to deploy the template.

1. Create a file named ```kubernetes-nodepool-parameters.json``` and add the required parameters in JSON format. You can use the following example as a starting point. Replace the values with your own.

:::code language="json" source="includes/kubernetes-cluster/quickstart-add-node-pool-params.json":::

2. Deploy the template.

```azurecli
    az deployment group create \
      --resource-group myResourceGroup \
      --template-file kubernetes-add-agentpool.bicep \
      --parameters @kubernetes-nodepool-parameters.json
```

[!INCLUDE [quickstart-review-nodepool](./includes/kubernetes-cluster/quickstart-review-nodepool.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/kubernetes-cluster/quickstart-cleanup.md)]

## Next steps

[!INCLUDE [quickstart-nextsteps](./includes/kubernetes-cluster/quickstart-nextsteps.md)]
