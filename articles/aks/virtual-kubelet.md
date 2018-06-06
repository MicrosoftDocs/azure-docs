---
title: Run virtual kubelete in an Azure Kubernetes Service (AKS) cluster
description: Use virtual kubelet to run Kubernetes containers on Azure Container Instances.
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/13/2018
ms.author: nepeters
---

# Virtual Kubelet with AKS

Azure Container Instances (ACI) provide a hosted environment for running containers in Azure. When using ACI, there is no need to manage the underlying compute infrastructure, Azure handles this management for you. When running containers in ACI, you are charged by the second for each running container.

When using the Virtual Kubelet provider for Azure Container Instances, pods can be scheduled on a container instance as if it is a standard Kubernetes node. This configuration allows you to take advantage of both the capabilities of Kubernetes and the management value and cost benefit of Container Instances.

This document details configuring the Virtual Kubelet Azure Container Instance provider on an Azure Container Service (AKS) cluster.

> [!NOTE]
> Virtual Kubelet is an experimental open source project and should be used as such. To contribute, file issues, and read more about virtual kubelet, see the [Virtual Kubelet GitHub project][vk-github].

## Prerequisite

This document assumes that you have an AKS cluster. If you need an AKS cluster, see the [Azure Kubernetes Service (AKS) quickstart][aks-quick-start].

You also need the Azure CLI version **2.0.33** or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Installation

Use the [az aks install-connector][aks-install-connector] command to install Virtual Kubelet.

```azurecli-interactive
az aks install-connector --resource-group myAKSCluster --name myAKSCluster --connector-name virtual-kubelet --os-type linux
```

The following arguments are r

| Argument: | Description | Required |
|---|---|:---:|
| `--connector-name` | Name of the ACI Connector.| Yes |
| `--name` `-n` | Name of the managed cluster. | Yes |
| `--resource-group` `-g` | Name of resource group. | Yes |
| `--aci-resource-group` | The resource group to create the ACI container groups. Use the MC_* resource group if it is not specified. | No |
| `--chart-url` | URL of a Helm chart that installs ACI Connector.  Default: https://github.com/virtual-kubelet/virtual- kubelet/raw/master/charts/virtual-kubelet-for-aks-0.1.3.tgz.. | No |
| `--client-secret` | Secret associated with the service principal. This argument is required if `--service-principal` is specified. | No |
| `--image-tag` | The image tag of the virtual kubelet. Use 'latest' if it is not specified. | No |
| `--location` `-l` | The location to create the ACI container groups. Use the location of the MC_* resource group if it is not specified. | No |
| `--os-type` | Install support for deploying ACIs of this operating system type.  Allowed values: Both, Linux, Windows. Default: Linux. | No |
| `--service-principal` | Service principal used for authentication to Azure APIs. If not specified, use the AKS service principal defined in the file /etc/kubernetes/azure.json on the node that runs the virtual kubelet pod. | No |

## Validate Virtual Kubelet

To validate that Virtual Kubelet has been installed, return a list of Kubernetes nodes using the [kubectl get nodes][kubectl-get] command. You should see a node that has a name similar to the name given to the Virtual Kubelet.

```azurecli-interactive
kubectl get nodes
```

Output:

```console
NAME                                    STATUS    ROLES     AGE       VERSION
aks-nodepool1-42032720-0                Ready     agent     1d        v1.9.6
aks-nodepool1-42032720-1                Ready     agent     1d        v1.9.6
aks-nodepool1-42032720-2                Ready     agent     1d        v1.9.6
virtual-kubelet-virtual-kubelet-linux   Ready     agent     42s       v1.8.3
```

## Schedule a pod in ACI

Create a file named `virtual-kubelete-test.yaml` and copy in the following YAML. Replace the `kubernetes.io/hostname` value with the name given to the Virtual Kubelet node. Take note that a `nodeSelector` and `toleration` are being used to schedule the container on the Virtual Kubelet node.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: aci-helloworld
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: aci-helloworld
    spec:
      containers:
      - name: aci-helloworld
        image: microsoft/aci-helloworld
        ports:
        - containerPort: 80
      nodeSelector:
        kubernetes.io/hostname: virtual-kubelet-virtual-kubelet-linux
      tolerations:
      - key: azure.com/aci
        effect: NoSchedule
```

Run the application with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f virtual-kubelete-test.yaml
```

Use the [kubectl get pods][kubectl-get] command with the `-o wide` argument to output a list of pods with the scheduled node.

```azurecli-interactive
kubectl get pods -o wide
```

Notice that the `aci-helloworld` pod has been scheduled on the `virtual-kubelet-virtual-kubelet-linux` node.

```console
NAME                                            READY     STATUS    RESTARTS   AGE       IP             NODE
aci-helloworld-2559879000-8vmjw                 1/1       Running   0          39s       52.179.3.180   virtual-kubelet-virtual-kubelet-linux
```

## Remove Virtual Kubelet

To remove Virtual Kubelet, run the following command. Replace the argument values with the name of the connector, AKS cluster, and the AKS cluster resource group.

```azurecli-interactive
az aks remove-connector --resource-group myAKSCluster --name myAKSCluster --connector-name virtual-kubelet
```

## Next steps

Read more about Virtual Kubelet at the [Virtual Kubelet Github projet][vk-github].

<!-- LINKS - internal -->
[aks-quick-start]: ./kubernetes-walkthrough.md
[az-container-list]: /cli/azure/aks#az_aks_list
[aks-install-connector]: /cli/azure/aks#az-aks-install-connector

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.6/#create
[kubectl-get]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#get
[vk-github]: https://github.com/virtual-kubelet/virtual-kubelet