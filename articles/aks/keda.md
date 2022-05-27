---
title: KEDA add-on on Azure Kubernetes Service (AKS) (Preview)
description: Use the KEDA add-on to deploy a managed KEDA instance on Azure Kubernetes Service (AKS).
services: container-service
author: jahabibi
ms.topic: article
ms.custom: event-tier1-build-2022
ms.date: 05/24/2021
ms.author: jahabibi
---

# Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on (Preview)

Kubernetes Event-driven Autoscaling (KEDA) is a single-purpose and lightweight component that strives to make application autoscaling simple and is a CNCF Incubation project.

The KEDA add-on makes it even easier by deploying a managed KEDA installation, providing you with [a rich catalog of 40+ KEDA scalers](https://keda.sh/docs/latest/scalers/) that you can scale your applications with on your Azure Kubernetes Services (AKS) cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## KEDA add-on overview

[KEDA][keda] provides two main components:

- **KEDA operator** allows end-users to scale workloads in/out from 0 to N instances with support for Kubernetes Deployments, Jobs, StatefulSets or any custom resource that defines `/scale` subresource.
- **Metrics server** exposes external metrics to HPA in Kubernetes for autoscaling purposes such as messages in a Kafka topic, or number of events in an Azure event hub. Due to upstream limitations, this must be the only installed metric adapter.

## Prerequisites

> [!NOTE]
> KEDA is currently only available in the `westcentralus` region.

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).

### Register the `AKS-KedaPreview` feature flag

To use the KEDA, you must enable the `AKS-KedaPreview` feature flag on your subscription. 

```azurecli
az feature register --name AKS-KedaPreview --namespace Microsoft.ContainerService
```

You can check on the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-KedaPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Deploy the KEDA add-on with Azure Resource Manager (ARM) templates

The KEDA add-on can be enabled by deploying an AKS cluster with an Azure Resource Manager template and specifying the `workloadAutoScalerProfile` field:

```json
    "workloadAutoScalerProfile": {
        "keda": {
            "enabled": true
        }
    }
```

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][az aks install-cli] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][az aks get-credentials] command. The following example gets credentials for the AKS cluster named *MyAKSCluster* in the *MyResourceGroup*:

```azurecli
az aks get-credentials --resource-group MyResourceGroup --name MyAKSCluster
```

## Example deployment

The following snippet is a sample deployment that creates a cluster with KEDA enabled with a single node pool comprised of three `DS2_v5` nodes.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "apiVersion": "2022-05-02-preview",
            "dependsOn": [],
            "type": "Microsoft.ContainerService/managedClusters",
            "location": "westcentralus",
            "name": "myAKSCluster",
            "properties": {
                "kubernetesVersion": "1.23.5",
                "enableRBAC": true,
                "dnsPrefix": "myAKSCluster",
                "agentPoolProfiles": [
                    {
                        "name": "agentpool",
                        "osDiskSizeGB": 200,
                        "count": 3,
                        "enableAutoScaling": false,
                        "vmSize": "Standard_D2S_v5",
                        "osType": "Linux",
                        "storageProfile": "ManagedDisks",
                        "type": "VirtualMachineScaleSets",
                        "mode": "System",
                        "maxPods": 110,
                        "availabilityZones": [],
                        "nodeTaints": [],
                        "enableNodePublicIP": false
                    }
                ],
                "networkProfile": {
                    "loadBalancerSku": "standard",
                    "networkPlugin": "kubenet"
                },
                "workloadAutoScalerProfile": {
                    "keda": {
                        "enabled": true
                    }
                }
            },
            "identity": {
                "type": "SystemAssigned"
            }
        }
    ]
}
```

## Use KEDA

KEDA scaling will only work once a custom resource definition has been defined (CRD). To learn more about KEDA CRDs, follow the official [KEDA documentation][keda-scalers] to define your scaler.

## Clean Up

To remove the resource group, and all related resources, use the [az group delete][az-group-delete] command:

```azurecli
az group delete --name MyResourceGroup
```

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks update]: /cli/azure/aks#az-aks-update
[az-group-delete]: /cli/azure/group#az-group-delete

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda]: https://keda.sh/
[keda-scalers]: https://keda.sh/docs/scalers/
