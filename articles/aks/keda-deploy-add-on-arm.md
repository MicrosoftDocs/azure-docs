---
title: Install the Kubernetes Event-driven Autoscaling (KEDA) add-on by using an ARM template
description: Use an ARM template to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS).
services: container-service
author: jahabibi
ms.topic: article
ms.date: 10/10/2022
ms.author: jahabibi
---

# Install the Kubernetes Event-driven Autoscaling (KEDA) add-on by using ARM template

This article shows you how to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS) by using an [ARM](../azure-resource-manager/templates/index.yml) template.

[!INCLUDE [Current version callout](./includes/keda/current-version-callout.md)]

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- Firewall rules are configured to allow access to the Kubernetes API server. ([learn more][aks-firewall-requirements])

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

## Install the KEDA add-on with Azure Resource Manager (ARM) templates

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

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][] command. The following example gets credentials for the AKS cluster named *MyAKSCluster* in the *MyResourceGroup*:

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

## Start scaling apps with KEDA

Now that KEDA is installed, you can start autoscaling your apps with KEDA by using its custom resource definition has been defined (CRD).

To learn more about KEDA CRDs, follow the official [KEDA documentation][keda-scalers] to define your scaler.

## Clean Up

To remove the resource group, and all related resources, use the [Az PowerShell module group delete][az-group-delete] command:

```azurecli
az group delete --name MyResourceGroup
```

## Next steps

This article showed you how to install the KEDA add-on on an AKS cluster, and then verify that it's installed and running. With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps.

You can troubleshoot KEDA add-on problems in [this article][keda-troubleshoot].

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks update]: /cli/azure/aks#az-aks-update
[az-group-delete]: /cli/azure/group#az-group-delete
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: limit-egress-traffic.md#azure-global-required-network-rules

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda]: https://keda.sh/
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
