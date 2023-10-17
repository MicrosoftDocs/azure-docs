---
title: Kubernetes on Azure tutorial - Deploy a cluster
description: In this Azure Kubernetes Service (AKS) tutorial, you create an AKS cluster and use kubectl to connect to the Kubernetes master node.
ms.topic: tutorial
ms.date: 12/01/2022

ms.custom: mvc, devx-track-azurecli, devx-track-azurepowershell

#Customer intent: As a developer or IT pro, I want to learn how to create an Azure Kubernetes Service (AKS) cluster so that I can deploy and run my own applications.
---

# Tutorial: Deploy an Azure Kubernetes Service (AKS) cluster

Kubernetes provides a distributed platform for containerized applications. With AKS, you can quickly create a production ready Kubernetes cluster. In this tutorial, part three of seven, you deploy a Kubernetes cluster in AKS. You learn how to:

> [!div class="checklist"]

> * Deploy a Kubernetes AKS cluster that can authenticate to an Azure Container Registry (ACR).
> * Install the Kubernetes CLI, `kubectl`.
> * Configure `kubectl` to connect to your AKS cluster.

In later tutorials, you'll deploy the Azure Vote application to your AKS cluster and scale and update your application.

## Before you begin

In previous tutorials, you created a container image and uploaded it to an ACR instance. If you haven't done these steps and would like to follow along, start with [Tutorial 1: Prepare an application for AKS][aks-tutorial-prepare-app].

* If you're using Azure CLI, this tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* If you're using Azure PowerShell, this tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Create a Kubernetes cluster

AKS clusters can use [Kubernetes role-based access control (Kubernetes RBAC)][k8s-rbac], which allows you to define access to resources based on roles assigned to users. If a user is assigned multiple roles, permissions are combined. Permissions can be scoped to either a single namespace or across the whole cluster.

To learn more about AKS and Kubernetes RBAC, see [Control access to cluster resources using Kubernetes RBAC and Microsoft Entra identities in AKS][aks-k8s-rbac].


### [Azure CLI](#tab/azure-cli)

Create an AKS cluster using [`az aks create`][az aks create]. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup*. This resource group was created in the [previous tutorial][aks-tutorial-prepare-acr] in the *eastus* region. The AKS cluster will also be created in the *eastus* region.

For more information about AKS resource limits and region availability, see [Quotas, virtual machine size restrictions, and region availability in AKS][quotas-skus-regions].

To allow an AKS cluster to interact with other Azure resources, a cluster identity is automatically created. In this example, the cluster identity is [granted the right to pull images][container-registry-integration] from the ACR instance you created in the previous tutorial. To execute the command successfully, you're required to have an **Owner** or **Azure account administrator** role in your Azure subscription.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --generate-ssh-keys \
    --attach-acr <acrName>
```

> [!NOTE]
> If you've already generated SSH keys, you may encounter an error similar to `linuxProfile.ssh.publicKeys.keyData is invalid`. To proceed, retry the command without the `--generate-ssh-keys` parameter.

### [Azure PowerShell](#tab/azure-powershell)

Create an AKS cluster using [`New-AzAksCluster`][new-azakscluster]. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup*. This resource group was created in the [previous tutorial][aks-tutorial-prepare-acr] in the *eastus* region. The AKS cluster will also be created in the *eastus* region.

For more information about AKS resource limits and region availability, see [Quotas, virtual machine size restrictions, and region availability in AKS][quotas-skus-regions].

To allow an AKS cluster to interact with other Azure resources, a cluster identity is automatically created. In this example, the cluster identity is [granted the right to pull images][container-registry-integration] from the ACR instance you created in the previous tutorial. To execute the command successfully, you're required to have an **Owner** or **Azure account administrator** role in your Azure subscription.

```azurepowershell
New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 2 -GenerateSshKey -AcrNameToAttach <acrName>
```

> [!NOTE]
> If you've already generated SSH keys, you may encounter an error similar to `linuxProfile.ssh.publicKeys.keyData is invalid`. To proceed, retry the command without the `-GenerateSshKey` parameter.

---

To avoid needing an **Owner** or **Azure account administrator** role, you can also manually configure a service principal to pull images from ACR. For more information, see [ACR authentication with service principals](../container-registry/container-registry-auth-service-principal.md) or [Authenticate from Kubernetes with a pull secret](../container-registry/container-registry-auth-kubernetes.md). Alternatively, you can use a [managed identity](use-managed-identity.md) instead of a service principal for easier management.

After a few minutes, the deployment completes and returns JSON-formatted information about the AKS deployment.

> [!NOTE]
> To ensure your cluster operates reliably, you should run at least two nodes.

## Install the Kubernetes CLI

Use the Kubernetes CLI, [`kubectl`][kubectl], to connect to the Kubernetes cluster from your local computer.

### [Azure CLI](#tab/azure-cli)

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [`az aks install-cli`][az aks install-cli] command.

```azurecli
az aks install-cli
```

### [Azure PowerShell](#tab/azure-powershell)

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [`Install-AzAksKubectl`][install-azakskubectl] cmdlet.

```azurepowershell
Install-AzAksKubectl
```

---

## Connect to cluster using kubectl

### [Azure CLI](#tab/azure-cli)

To configure `kubectl` to connect to your Kubernetes cluster, use the [`az aks get-credentials`][az aks get-credentials] command. The following example gets credentials for the AKS cluster named *myAKSCluster* in *myResourceGroup*.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

### [Azure PowerShell](#tab/azure-powershell)

To configure `kubectl` to connect to your Kubernetes cluster, use the [`Import-AzAksCredential`][import-azakscredential] cmdlet. The following example gets credentials for the AKS cluster named *myAKSCluster* in *myResourceGroup*.

```azurepowershell
Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
```

---

To verify connection to your cluster, run [`kubectl get nodes`][kubectl-get] to return a list of cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the list of cluster nodes.

```
$ kubectl get nodes

NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-19366578-vmss000002   Ready    agent   47h   v1.25.6
aks-nodepool1-19366578-vmss000003   Ready    agent   47h   v1.25.6
```

## Next steps

In this tutorial, you deployed a Kubernetes cluster in AKS and configured `kubectl` to connect to the cluster. You learned how to:

> [!div class="checklist"]
>
> * Deploy an AKS cluster that can authenticate to an ACR.
> * Install the Kubernetes CLI, `kubectl`.
> * Configure `kubectl` to connect to your AKS cluster.

In the next tutorial, you'll learn how to deploy an application to your cluster.

> [!div class="nextstepaction"]
> [Deploy an application in AKS][aks-tutorial-deploy-app]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[k8s-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/

<!-- LINKS - internal -->
[aks-tutorial-deploy-app]: ./tutorial-kubernetes-deploy-application.md
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az ad sp create-for-rbac]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az acr show]: /cli/azure/acr#az_acr_show
[az role assignment create]: /cli/azure/role/assignment#az_role_assignment_create
[az aks create]: /cli/azure/aks#az_aks_create
[az aks install-cli]: /cli/azure/aks#az_aks_install_cli
[az aks get-credentials]: /cli/azure/aks#az_aks_get_credentials
[azure-cli-install]: /cli/azure/install-azure-cli
[container-registry-integration]: ./cluster-container-registry-integration.md
[quotas-skus-regions]: quotas-skus-regions.md
[azure-powershell-install]: /powershell/azure/install-az-ps
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[install-azakskubectl]: /powershell/module/az.aks/install-azaksclitool
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[aks-k8s-rbac]: azure-ad-rbac.md
[preset-config]: /quotas-skus-regions.md#cluster-configuration-presets-in-the-azure-portal
[azure-managed-identities]: ../active-directory/managed-identities-azure-resources/overview.md
[az-container-insights]: ../azure-monitor/containers/container-insights-overview.md
