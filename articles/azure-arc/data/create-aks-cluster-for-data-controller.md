---
title: Create AKS cluster for Azure Arc-enabled data services
description: Demonstrates how to create a Kubernetes cluster on Azure Kubernetes Service in order to deploy a data controller.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 11/19/2021
ms.topic: how-to
---

# Create cluster on AKS

This article demonstrates how to create a 3 node Kubernetes cluster on Azure Kubernetes Service (AKS). 

You can use this cluster to demonstrate, test, and gain experience with Azure Arc-enabled data services.

## Create the resource group

Create a resource group for the cluster. For location, specify a supported region. For Azure Arc-enabled data services, supported regions are listed in the [Overview](overview.#supported-regions).

```azurecli
az group create --name <resource_group_name> --location <location>
```

To learn more about resource groups, see [What is Azure Resource Manager](../../azure-resource-manager/management/overview.md).

## Create Kubernetes cluster

Create the cluster in the resource group that you created previously.

The following example creates a 3 node cluster, with monitoring enabled, and generates public and private key files if missing.

```azurecli
az aks create --resource-group <resource_group_name> --name <cluster_name> --node-count 4 --enable-addons monitoring --generate-ssh-keys
```

For command details, see [az aks create](/cli/azure/aks?view=azure-cli-latest&preserve-view=true#az_aks_create).

For a complete demonstration, including an application on a single-node Kubernetes cluster, go to [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](../../aks/kubernetes-walkthrough.md).

## Get credentials

You will need to get credential to connect to your cluster.

Run the following command to get the credentials:

   ```azurecli
   az aks get-credentials --resource-group <resource_group_name> --name <cluster_name>
   ```

## Verify cluster

To confirm the cluster is running and that you have the current connection context, run

```console
kubectl get nodes
```

The command will return a list of nodes. For example:

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-34164736-vmss000000   Ready    agent   4h28m   v1.20.9
aks-nodepool1-34164736-vmss000001   Ready    agent   4h28m   v1.20.9
aks-nodepool1-34164736-vmss000002   Ready    agent   4h28m   v1.20.9
aks-nodepool1-34164736-vmss000003   Ready    agent   4h28m   v1.20.9
```

## Next steps

* Create a data controller. Your next step depends on if you are creating a data controller in direct connectivity mode or in indirect connectivity mode:
   * Complete the [prerequisites to deploy the data controller in direct connectivity mode](create-data-controller-direct-prerequisites.md)
   * [Create Azure Arc data controller using the CLI](create-data-controller-indirect-cli.md)
