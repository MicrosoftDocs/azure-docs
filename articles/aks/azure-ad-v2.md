---
title: Use Azure AD in Azure Kubernetes Service
description: Learn how to use Azure AD in Azure Kubernetes Service (AKS) 
services: container-service
manager: gwallace
ms.topic: article
ms.date: 03/24/2020
---

# Integrate Azure AD in Azure Kubernetes Service (Preview)

> [!Note]
> Existing AKS v1 clusters with AD integration are not affected by the new AKS v2 experience.

Azure AD integration with AKS v2 is designed to simplify the Azure AD integration with AKS v1 experience, where users were required to create a client app, a server app, and required the Azure AD tenant to grant Directory Read permissions. In the new version, the AKS resource provider manages the client and server apps for you.

## Limitations

* You can't currently upgrade an existing Azure AD enabled AKS v1 cluster to the v2 experience.

> [!IMPORTANT]
> AKS preview features are available on a self-service, opt-in basis. Previews are provided "as-is" and "as available," and are excluded from the Service Level Agreements and limited warranty. AKS previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> - [AKS Support Policies](support-policies.md)
> - [Azure Support FAQ](faq.md)

## Before you begin

You must have the following resources installed:

- The Azure CLI, version 2.2.0 or later
- The aks-preview 0.4.38 extension
- Kubectl with a minimum version of [1.18 beta](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#client-binaries)

To install/update the aks-preview  extension or later, use the following Azure CLI commands:

```azurecli
az extension add --name aks-preview
az extension list
```

```azurecli
az extension update --name aks-preview
az extension list
```

To install kubectl, use the following:

```azurecli
sudo az aks install-cli
kubectl version --client
```

Use [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for other operating systems.

> [!CAUTION]
> After you register a feature on a subscription, you can't currently unregister that feature. When you enable some preview features, defaults might be used for all AKS clusters created afterward in the subscription. Don't enable preview features on production subscriptions. Instead, use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name AAD-V2 --namespace Microsoft.ContainerService
```

It might take several minutes for the status to show as **Registered**. You can check the registration status by using the [az feature list](https://docs.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-list) command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AAD-V2')].{Name:name,State:properties.state}"
```

When the status shows as registered, refresh the registration of the `Microsoft.ContainerService` resource provider by using the [az provider register](https://docs.microsoft.com/cli/azure/provider?view=azure-cli-latest#az-provider-register) command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster with Azure AD enabled

You can now create an AKS cluster by using the following CLI commands.

First, create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```

Then, create an AKS cluster:

```azurecli-interactive
az aks create -g MyResourceGroup -n MyManagedCluster --enable-aad
```
The above command creates a three node AKS cluster, but the user, who created the cluster, by default, is not a member of a group that has access to this cluster. This user needs to create an Azure AD group, add themselves as a member of the group, and then update the cluster as shown below. Follow instructions [here](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)

Once you've created a group and added yourself (and others) as a member, you can update the cluster with the Azure AD group using the following command

```azurecli-interactive
az aks update -g MyResourceGroup -n MyManagedCluster --enable-aad [--aad-admin-group-object-ids <id1,id2>] [--aad-tenant-id <id>]
```
Alternatively, if you first create a group and add members, you can enable the Azure AD group at create time using the following command,

```azurecli-interactive
az aks create -g MyResourceGroup -n MyManagedCluster --enable-aad [--aad-admin-group-object-ids <id1,id2>] [--aad-tenant-id <id>]
```

A successful creation of an Azure AD v2 cluster has the following section in the response body
```
"Azure ADProfile": {
    "adminGroupObjectIds": null,
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

The cluster is created within a few minutes.

## Access an Azure AD enabled cluster
To get the admin credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster --admin
```
Now use the kubectl get nodes command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes

NAME                       STATUS   ROLES   AGE    VERSION
aks-nodepool1-15306047-0   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-1   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-2   Ready    agent   102m   v1.15.10
```

To get the user credentials to access the cluster:
 
```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```
Follow the instructions to sign in.

You receive: **You must be logged in to the server (Unauthorized)**

The user above gets an error because the user is not a part of a group that has access to the cluster.

## Next steps

Learn about [Azure AD Role Based Access Control][azure-ad-rbac].

<!-- LINKS - Internal -->
[azure-ad-rbac]: azure-ad-rbac.md
