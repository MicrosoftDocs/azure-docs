---
title: Access a private Azure Kubernetes Service (AKS) cluster
description: Learn how to access a private Azure Kubernetes Service (AKS) cluster using the Azure CLI or Azure portal.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 09/15/2023
---

# Access a private Azure Kubernetes Service (AKS) cluster

When you access a private AKS cluster, you need to connect to the cluster from the cluster virtual network, a peered network, or a configured private endpoint. These approaches require configuring a VPN, Express Route, deploying a *jumpbox* within the cluster virtual network, or creating a private endpoint inside of another virtual network.

With the Azure CLI, you can use `command invoke` to access private clusters without the need to configure a VPN or Express Route. `command invoke` allows you to remotely invoke commands, like `kubectl` and `helm`, on your private cluster through the Azure API without directly connecting to the cluster. The `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` actions control the permissions for using `command invoke`.

With the Azure portal, you can use the `Run command` feature to run commands on your private cluster. The `Run command` feature uses the same `command invoke` functionality to run commands on your cluster.

## Before you begin

Before you begin, make sure you have the following resources and permissions:

* An existing private cluster. If you don't have one, see [Create a private AKS cluster](./private-clusters.md).
* The Azure CLI version 2.24.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* Access to the `Microsoft.ContainerService/managedClusters/runcommand/action` and `Microsoft.ContainerService/managedclusters/commandResults/read` roles on the cluster.

### Limitations

The pod created by the `run` command provides `helm` and the latest compatible version of `kubectl` for your cluster with `kustomize`.

`command invoke` runs the commands from your cluster, so any commands run in this manner are subject to your configured networking restrictions and any other configured restrictions. Make sure there are enough nodes and resources in your cluster to schedule this command pod.

> [!NOTE]
> The output for `command invoke` is limited to 512kB in size. 

## Run commands on your AKS cluster

### [Azure CLI - `command invoke`](#tab/azure-cli)

### Use `command invoke` to run a single command

* Run a command on your cluster using the `az aks command invoke --command` command. The following example command runs the `kubectl get pods -n kube-system` command on the *myPrivateCluster* cluster in *myResourceGroup*.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl get pods -n kube-system"
    ```

### Use `command invoke` to run multiple commands

* Run multiple commands on your cluster using the `az aks command invoke --command` command. The following example command runs three `helm` commands on the *myPrivateCluster* cluster in *myResourceGroup*.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update && helm install my-release bitnami/nginx"
    ```

### Use `command invoke` to run commands with an attached file or directory

* Run commands with an attached file or directory using the `az aks command invoke --command` command with the `--file` parameter. The following example command runs `kubectl apply -f deployment.yaml -n default` on the *myPrivateCluster* cluster in *myResourceGroup*. The `deployment.yaml` file is attached from the current directory on the development computer where `az aks command invoke` was run.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl apply -f deployment.yaml -n default" \
      --file deployment.yaml
    ```

#### Use `command invoke` to run commands with all files in the current directory attached

* Run commands with all files in the current directory attached using the `az aks command invoke --command` command with the `--file` parameter. The following example command runs  `kubectl apply -f deployment.yaml configmap.yaml -n default` on the *myPrivateCluster* cluster in *myResourceGroup*. The `deployment.yaml` and `configmap.yaml` files are part of the current directory on the development computer where `az aks command invoke` was run.

    ```azurecli-interactive
    az aks command invoke \
      --resource-group myResourceGroup \
      --name myPrivateCluster \
      --command "kubectl apply -f deployment.yaml configmap.yaml -n default" \
      --file .
    ```

### [Azure portal - `Run command`](#tab/azure-portal)

To get started with `Run command`, navigate to your private cluster in the Azure portal. Under the **Kubernetes resources** section, select **Run command**.

:::image type="content" source="media/access-private-cluster/azure-portal-run-command.png" alt-text="Screenshot of browsing to the Azure portal Run command feature.":::

### `Run command` commands

You can use the following kubectl commands with the `Run command` feature:

* `kubectl get nodes`
* `kubectl get deployments`
* `kubectl get pods`
* `kubectl describe nodes`
* `kubectl describe pod <pod-name>`
* `kubectl describe deployment <deployment-name>`
* `kubectl apply -f <file-name`

### Use `Run command` to run a single command

1. In the Azure portal, navigate to your private cluster.
2. Under the **Kubernetes resources** section, select **Run command**.
3. Enter the command you want to run and select **Run**.

### Use `Run command` to run commands with attached files

1. In the Azure portal, navigate to your private cluster.
2. Under the **Kubernetes resources** section, select **Run command**.
3. Select **Attach files**.
4. Select **Browse for files**.

    :::image type="content" source="media/access-private-cluster/azure-portal-run-command-attach-files.png" alt-text="Screenshot of attaching files to the Azure portal Run command.":::

5. Select the file(s) you want to attach and then select **Attach**.
6. Enter the command you want to run and select **Run**.

--

## Troubleshooting

For information on the most common issues with `az aks command invoke` and how to fix them, see [Resolve `az aks command invoke` failures][command-invoke-troubleshoot].

## Next steps

In this article, you learned how to access a private cluster and run commands on that cluster. For more information on AKS clusters, see the following articles:

* [Use a private endpoint connection in AKS](./private-clusters.md#use-a-private-endpoint-connection)
* [Virtual networking peering in AKS](./private-clusters.md#virtual-network-peering)
* [Hub and spoke with custom DNS in AKS](./private-clusters.md#hub-and-spoke-with-custom-dns)

<!-- links - internal -->

[command-invoke-troubleshoot]: /troubleshoot/azure/azure-kubernetes/resolve-az-aks-command-invoke-failures
