---
title: Use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster
description: Learn how to use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 1/14/2022
---

# Use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster

Accessing a private AKS cluster requires that you connect to that cluster either from the cluster virtual network, from a peered network, or via a configured private endpoint. These approaches require configuring a VPN, Express Route, deploying a *jumpbox* within the cluster virtual network, or creating a private endpoint inside of another virtual network. Alternatively, you can use `command invoke` to access private clusters without having to configure a VPN or Express Route. Using `command invoke` allows you to remotely invoke commands like `kubectl` and `helm` on your private cluster through the Azure API without directly connecting to the cluster. Permissions for using `command invoke` are controlled through the `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` roles.

## Prerequisites

* An existing private cluster.
* The Azure CLI version 2.24.0 or later.
* Access to the `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` roles on the cluster.

### Limitations

The pod created by the `run` command provides the following binaries:

* The latest compatible version of `kubectl` for your cluster with `kustomize`.
* `helm`

In addition, `command invoke` runs the commands from your cluster so any commands run in this manner are subject to networking and other restrictions you have configured on your cluster. Also make sure that there are enough nodes and resources in your cluster to schedule this command pod. 

## Use `command invoke` to run a single command

Use `az aks command invoke --command` to run a command on your cluster. For example:

```azurecli-interactive
az aks command invoke \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --command "kubectl get pods -n kube-system"
```

The above example runs the `kubectl get pods -n kube-system` command on the *myAKSCluster* cluster in *myResourceGroup*.

## Use `command invoke` to run multiple commands

Use `az aks command invoke --command` to run multiple commands on your cluster. For example:

```azurecli-interactive
az aks command invoke \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --command "helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update && helm install my-release bitnami/nginx"
```

The above example runs three `helm` commands on the *myAKSCluster* cluster in *myResourceGroup*.

## Use `command invoke` to run commands with an attached file or directory

Use `az aks command invoke --command` to run commands on your cluster and `--file` to attach a file or directory for use by those commands. For example:

```azurecli-interactive
az aks command invoke \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --command "kubectl apply -f deployment.yaml -n default" \
  --file deployment.yaml
```

The above runs `kubectl apply -f deployment.yaml -n default` on the *myAKSCluster* cluster in *myResourceGroup*. The `deployment.yaml` file used by that command is attached from the current directory on the development computer where `az aks command invoke` was run.

You can also attach all files in the current directory. For example:

```azurecli-interactive
az aks command invoke \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --command "kubectl apply -f deployment.yaml configmap.yaml -n default" \
  --file .
```

The above runs `kubectl apply -f deployment.yaml configmap.yaml -n default` on the *myAKSCluster* cluster in *myResourceGroup*. The `deployment.yaml` and `configmap.yaml` files used by that command are part of the current directory on the development computer where `az aks command invoke` was run.


## Troubleshooting

The following link describes the most common issues with `az aks command invoke` and how to fix them:

https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/resolve-az-aks-command-invoke-failures

