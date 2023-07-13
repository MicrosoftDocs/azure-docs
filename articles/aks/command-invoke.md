---
title: Use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster
description: Learn how to use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster
ms.topic: article
ms.date: 05/03/2023
---

# Use `command invoke` to access a private Azure Kubernetes Service (AKS) cluster

When you access a private AKS cluster, you must connect to the cluster from the cluster virtual network, from a peered network, or via a configured private endpoint. These approaches require configuring a VPN, Express Route, deploying a *jumpbox* within the cluster virtual network, or creating a private endpoint inside of another virtual network. You can also use `command invoke` to access private clusters without the need to configure a VPN or Express Route. `command invoke` allows you to remotely invoke commands, like `kubectl` and `helm`, on your private cluster through the Azure API without directly connecting to the cluster. The `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` actions control the permissions for using `command invoke`.

## Prerequisites

* An existing private cluster.
* The Azure CLI version 2.24.0 or later.
* Access to the `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` roles on the cluster.

### Limitations

The pod created by the `run` command provides `helm` and the latest compatible version of `kubectl` for your cluster with `kustomize`.

`command invoke` runs the commands from your cluster, so any commands run in this manner are subject to your configured networking restrictions and any other configured restrictions. Make sure there are enough nodes and resources in your cluster to schedule this command pod.

## Use `command invoke` to run a single command

* Run a command on your cluster using the `az aks command invoke --command` command. The following example command runs the `kubectl get pods -n kube-system` command on the *myPrivateCluster* cluster in *myResourceGroup*.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl get pods -n kube-system"
    ```

## Use `command invoke` to run multiple commands

* Run multiple commands on your cluster using the `az aks command invoke --command` command. The following example command runs three `helm` commands on the *myPrivateCluster* cluster in *myResourceGroup*.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update && helm install my-release bitnami/nginx"
    ```

## Use `command invoke` to run commands with an attached file or directory

* Run commands with an attached file or directory using the `az aks command invoke --command` command with the `--file` parameter. The following example command runs `kubectl apply -f deployment.yaml -n default` on the *myPrivateCluster* cluster in *myResourceGroup*. The `deployment.yaml` file is attached from the current directory on the development computer where `az aks command invoke` was run.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl apply -f deployment.yaml -n default" \
      --file deployment.yaml
    ```

### Use `command invoke` to run commands with all files in the current directory attached

* Run commands with all files in the current directory attached using the `az aks command invoke --command` command with the `--file` parameter. The following example command runs  `kubectl apply -f deployment.yaml configmap.yaml -n default` on the *myPrivateCluster* cluster in *myResourceGroup*. The `deployment.yaml` and `configmap.yaml` files are part of the current directory on the development computer where `az aks command invoke` was run.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl apply -f deployment.yaml configmap.yaml -n default" \
      --file .
    ```

## Troubleshooting

For information on the most common issues with `az aks command invoke` and how to fix them, see [Resolve `az aks command invoke` failures][command-invoke-troubleshoot].

## Next steps

In this article, you learned how to use `command invoke` to access a private cluster and run commands on that cluster. For more information on AKS clusters, see the following articles:

* [Use a private endpoint connection in AKS](./private-clusters.md#use-a-private-endpoint-connection)
* [Virtual networking peering in AKS](./private-clusters.md#virtual-network-peering)
* [Hub and spoke with custom DNS in AKS](./private-clusters.md#hub-and-spoke-with-custom-dns)

<!-- links - internal -->

[command-invoke-troubleshoot]: /troubleshoot/azure/azure-kubernetes/resolve-az-aks-command-invoke-failures
