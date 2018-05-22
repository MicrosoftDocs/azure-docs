---
title: Run virtual kubelete in an Azure Kubernetes Service (AKS) cluster
description: Use virtual kubelet to run Kubernetes containers on Azure Container Instances.
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 05/28/2018
ms.author: nepeters
---

# Kubernetes ACI connector with AKS

Azure Container Instances (ACI) provide a hosted environment for running containers in Azure. When using ACI, there is no need to manage the underlying compute infrastructure, Azure handles this management for you. When running containers in ACI, you are charged by the second for each running container.

The Azure Container Instances connector for Kubernetes configures an ACI instance as a node in any Kubernetes cluster. When using the ACI connector for Kubernetes, pods can be scheduled on an ACI instance as if the ACI instance is a standard Kubernetes node. This configuration allows you to take advantage of both the capabilities of Kubernetes and the management value and cost benefit of ACI.

This document details configuring the ACI connector for Kubernetes on an Azure Container Service (AKS) cluster.

## Prerequisite

The steps detailed in this document assume that you have created an AKS Kubernetes cluster and have established a kubectl connection with the cluster. If you need these items see, the [Azure Container Service (AKS) quickstart][aks-quick-start].

You also need the Azure CLI version **2.0.22** or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Installation

To install the ACI connector for an AKS cluster, run the following  Azure CLI command. Replace the values for the following arguments:

- resource-group - the resource group of the AKS cluster.
- name - the name of the AKS cluster.
- connector-name - the name given to the ACI connector.

```azurecli-interactive
az aks install-connector --resource-group myResourceGroup --name myAKSCluster --connector-name myaciconnector
```

Output:

```
NAME:   myaciconnector
LAST DEPLOYED: Tue Dec  5 21:12:33 2017
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Secret
NAME                          TYPE    DATA  AGE
myaciconnector-aci-connector  Opaque  4     1s

==> v1beta1/Deployment
NAME                          DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
myaciconnector-aci-connector  1        1        1           0          1s

==> v1/Pod(related)
NAME                                           READY  STATUS             RESTARTS  AGE
myaciconnector-aci-connector-1218204046-cn81d  0/1    ContainerCreating  0         1s


NOTES:
The aci-connector is getting deployed on your cluster.

To verify that aci-connector has started, run:

  kubectl --namespace=default get pods -l "app=myaciconnector-aci-connector"
```

## Validate the ACI connector

To validate that the ACI connector has been installed, return a list of Kubernetes nodes using the [kubectl get nodes][kubectl-get] command. You should see a node that matches the name given to the ACI connector.

```azurecli-interactive
kubectl get nodes
```

Output:

```console
NAME                       STATUS    ROLES     AGE       VERSION
aci-connector              Ready     <none>    2m        v1.6.6
aks-nodepool1-39289454-0   Ready     agent     22h       v1.7.7
aks-nodepool1-39289454-1   Ready     agent     22h       v1.7.7
aks-nodepool1-39289454-2   Ready     agent     22h       v1.7.7
```

## Schedule a pod in ACI

Create a file named `aci-connector-test.yaml` and copy in the following YAML. Replace the `nodeName` value with the name given to the ACI connector.

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
      nodeName: aci-connector
```

Run the application with the [kubectl create][kubectl-create] command.

```azurecli-interactive
kubectl create -f aci-connector-test.yml
```

Use the [kubectl get pods][kubectl-get] command with the `-o wide` argument to output a list of pods with the scheduled node.

```azurecli-interactive
kubectl get pods -o wide
```

Notice that the `kube-aci-demo` pod is running on the `myACIConnector` node.

```console
NAME                                            READY     STATUS    RESTARTS   AGE       IP             NODE
aci-helloworld-2559879000-8vmjw                 1/1       Running   0          39s       52.179.3.180   aci-connector
```

To validate that the container is running in an Azure Container Instance, use the [az container list][az-container-list] Azure CLI command.

```azurecli-interactive
az container list -o table
```

Output:

```console
Name                             ResourceGroup    ProvisioningState    Image                     IP:ports         CPU/Memory       OsType    Location
-------------------------------  ---------------  -------------------  ------------------------  ---------------  ---------------  --------  ----------
aci-helloworld-2559879000-8vmjw  myAKSCluster2    Succeeded            microsoft/aci-helloworld  52.179.3.180:80  1.0 core/1.5 gb  Linux     eastus
```

## Remove the ACI connector

To remove the ACI connector, run the following command. Replace the argument values with the name of the connector, AKS cluster, and the AKS cluster resource group.

```azurecli-interactive
az aks remove-connector --resource-group myResourceGroup --name myAKSCluster --connector-name myaciconnector
```

<!-- LINKS -->
[aks-quick-start]: https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.6/#create
[kubectl-get]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#get
[az-container-list]: https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az_aks_list