---
title: Integrate Azure Container Registry with Azure Kubernetes Service
description: Learn how to integrate Azure Kubernetes Service (AKS) with Azure Container Registry (ACR)
services: container-service
ms.topic: article
ms.date: 11/15/2022
ms.tool: azure-cli, azure-powershell
ms.devlang: azurecli
---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), you need to establish an authentication mechanism. This operation is implemented as part of the Azure CLI, PowerShell, and portal experiences by granting the required permissions to your ACR. This article provides examples for configuring authentication between these Azure services.

You can set up the AKS to ACR integration in a few simple commands with the Azure CLI or Azure PowerShell. This integration assigns the [**AcrPull** role][acr-pull] to the managed identity associated to the AKS cluster.

> [!NOTE]
> This article covers automatic authentication between AKS and ACR. If you need to pull an image from a private external registry, use an [image pull secret][image-pull-secret].

## Before you begin

* You need to have the **Owner**, **Azure account administrator**, or **Azure co-administrator** role on your **Azure subscription**.
  * To avoid needing one of these roles, you can instead use an existing managed identity to authenticate ACR from AKS. For more information, see [Use an Azure managed identity to authenticate to an Azure container registry](../container-registry/container-registry-authentication-managed-identity.md).
* If you're using Azure CLI, this article requires that you're running Azure CLI version 2.7.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* If you're using Azure PowerShell, this article requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

## Create a new AKS cluster with ACR integration

You can set up AKS and ACR integration during the initial creation of your AKS cluster. To allow an AKS cluster to interact with ACR, an Azure Active Directory (AAD) **managed identity** is used. The following command allows you to authorize an existing ACR in your subscription and configures the appropriate **AcrPull** role for the managed identity. Supply valid values for your parameters below.

### [Azure CLI](#tab/azure-cli)

```azurecli
# Set this variable to the name of your ACR. The name must be globally unique.

MYACR=myContainerRegistry

# If you don't already have an ACR, use the following command to create one.

az acr create -n $MYACR -g myContainerRegistryResourceGroup --sku basic

# Create an AKS cluster with ACR integration.

az aks create -n myAKSCluster -g myResourceGroup --generate-ssh-keys --attach-acr $MYACR
```

Alternatively, you can specify the ACR name using an ACR resource ID. The format is as follows:

`/subscriptions/\<subscription-id\>/resourceGroups/\<resource-group-name\>/providers/Microsoft.ContainerRegistry/registries/\<name\>`

> [!NOTE]
> If you're using an ACR located in a different subscription from the AKS cluster, use the ACR resource ID when attaching or detaching from the cluster.
>
> ```azurecli
> az aks create -n myAKSCluster -g myResourceGroup --generate-ssh-keys --attach-acr /subscriptions/<subscription-id>/resourceGroups/myContainerRegistryResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry
> ```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Set this variable to the name of your ACR. The name must be globally unique.

$MYACR = 'myContainerRegistry'

# If you don't already have an ACR, use the following command to create one.

New-AzContainerRegistry -Name $MYACR -ResourceGroupName myContainerRegistryResourceGroup -Sku Basic

# Create an AKS cluster with ACR integration.

New-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup -GenerateSshKey -AcrNameToAttach $MYACR
```

---

This step may take several minutes to complete.

## Configure ACR integration for existing AKS clusters

### [Azure CLI](#tab/azure-cli)

Integrate an existing ACR with existing AKS clusters by supplying valid values for **acr-name** or **acr-resource-id**.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-name>
```

or

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --attach-acr <acr-resource-id>
```

> [!NOTE]
> The `az aks update --attach-acr` command uses the permissions of the user running the command to create the role ACR assignment. This role is assigned to the kubelet managed identity. For more information on AKS managed identities, see [Summary of managed identities][summary-msi].

You can also remove the integration between an ACR and an AKS cluster.

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --detach-acr <acr-name>
```

or

```azurecli
az aks update -n myAKSCluster -g myResourceGroup --detach-acr <acr-resource-id>
```

### [Azure PowerShell](#tab/azure-powershell)

Integrate an existing ACR with existing AKS clusters by supplying valid values for **acr-name**.

```azurepowershell
Set-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup -AcrNameToAttach <acr-name>
```

> [!NOTE]
> Running the `Set-AzAksCluster -AcrNameToAttach` cmdlet uses the permissions of the user running the command to create the role ACR assignment. This role is assigned to the kubelet managed identity. For more information on AKS managed identities, see [Summary of managed identities][summary-msi].

You can also remove the integration between an ACR and an AKS cluster.

```azurepowershell
Set-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup -AcrNameToDetach <acr-name>
```

---

## Working with ACR & AKS

### Import an image into your ACR

Run the following command to import an image from Docker Hub into your ACR.

### [Azure CLI](#tab/azure-cli)

```azurecli
az acr import  -n <acr-name> --source docker.io/library/nginx:latest --image nginx:v1
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName <acr-name> -ResourceGroupName myResourceGroup -SourceRegistryUri docker.io -SourceImage library/nginx:latest
```

---

### Deploy the sample image from ACR to AKS

Ensure you have the proper AKS credentials.

### [Azure CLI](#tab/azure-cli)

```azurecli
az aks get-credentials -g myResourceGroup -n myAKSCluster
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
```

---

Create a file called **acr-nginx.yaml** using the sample YAML. Substitute the resource name of your registry for **acr-name**, such as *myContainerRegistry*.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx0-deployment
  labels:
    app: nginx0-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx0
  template:
    metadata:
      labels:
        app: nginx0
    spec:
      containers:
      - name: nginx
        image: <acr-name>.azurecr.io/nginx:v1
        ports:
        - containerPort: 80
```

After creating the file, run the following deployment in your AKS cluster.

```console
kubectl apply -f acr-nginx.yaml
```

You can monitor the deployment by running `kubectl get pods`.

```console
kubectl get pods
```

You should have two running pods.

```output
NAME                                 READY   STATUS    RESTARTS   AGE
nginx0-deployment-669dfc4d4b-x74kr   1/1     Running   0          20s
nginx0-deployment-669dfc4d4b-xdpd6   1/1     Running   0          20s
```

### Troubleshooting

* Run the [az aks check-acr](/cli/azure/aks#az-aks-check-acr) command to validate that the registry is accessible from the AKS cluster.
* Learn more about [ACR Monitoring](../container-registry/monitor-service.md)
* Learn more about [ACR Health](../container-registry/container-registry-check-health.md)

<!-- LINKS - external -->

[image-pull-secret]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
[summary-msi]: use-managed-identity.md#summary-of-managed-identities
[acr-pull]: ../role-based-access-control/built-in-roles#acrpull
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
