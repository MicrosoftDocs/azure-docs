---
title: Scale an Azure Container Service (AKS) cluster | Microsoft Docs
description: Scale an Azure Container Service (AKS) cluster.
services: container-service
documentationcenter: ''
author: gabrtv
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: Kubernetes, Docker, Containers, Microservices, Azure

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: gamonroy
ms.custom: mvc

---

# Scale an Azure Container Service (AKS) cluster

It is easy to scale an AKS cluster to a different number of nodes.  Select the desired number of nodes and run the `az aks scale` command.  When scaling down, nodes will be carefully [cordoned and drained](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) to minimize disruption to running applications.  When scaling up, the `az` command waits until nodes are marked `Ready` by the Kubernetes cluster.

## Scale the cluster nodes

Use the `az aks scale` command to scale the cluster nodes. The following example scales a cluster named *myK8SCluster* to a single node.

```azurecli-interactive
az aks scale --name myK8sCluster --resource-group myResourceGroup --agent-count 1
```

Output:

```json
{
  "id": "/subscriptions/4f48eeae-9347-40c5-897b-46af1b8811ec/resourcegroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/myK8sCluster",
  "location": "westus2",
  "name": "myK8sCluster",
  "properties": {
    "accessProfiles": {
      "clusterAdmin": {
        "kubeConfig": "..."
      },
      "clusterUser": {
        "kubeConfig": "..."
      }
    },
    "agentPoolProfiles": [
      {
        "count": 1,
        "dnsPrefix": null,
        "fqdn": null,
        "name": "myK8sCluster",
        "osDiskSizeGb": null,
        "osType": "Linux",
        "ports": null,
        "storageProfile": "ManagedDisks",
        "vmSize": "Standard_D2_v2",
        "vnetSubnetId": null
      }
    ],
    "dnsPrefix": "myK8sClust-myResourceGroup-4f48ee",
    "fqdn": "myk8sclust-myresourcegroup-4f48ee-406cc140.hcp.westus2.azmk8s.io",
    "kubernetesVersion": "1.7.7",
    "linuxProfile": {
      "adminUsername": "azureuser",
      "ssh": {
        "publicKeys": [
          {
            "keyData": "..."
          }
        ]
      }
    },
    "provisioningState": "Succeeded",
    "servicePrincipalProfile": {
      "clientId": "e70c1c1c-0ca4-4e0a-be5e-aea5225af017",
      "keyVaultSecretRef": null,
      "secret": null
    }
  },
  "resourceGroup": "myResourceGroup",
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters"
}
```

## Next steps

Learn more about deploying and managing AKS with the AKS tutorials.

> [!div class="nextstepaction"]
> [AKS Tutorial](./tutorial-kubernetes-prepare-app.md)
