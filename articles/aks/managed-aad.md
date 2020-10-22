---
title: Use Azure AD in Azure Kubernetes Service
description: Learn how to use Azure AD in Azure Kubernetes Service (AKS) 
services: container-service
ms.topic: article
ms.date: 08/26/2020
ms.author: thomasge
---

# AKS-managed Azure Active Directory integration

AKS-managed Azure AD integration is designed to simplify the Azure AD integration experience, where users were previously required to create a client app, a server app, and required the Azure AD tenant to grant Directory Read permissions. In the new version, the AKS resource provider manages the client and server apps for you.

## Azure AD authentication overview

Cluster administrators can configure Kubernetes role-based access control (RBAC) based on a user's identity or directory group membership. Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

Learn more about the Azure AD integration flow on the [Azure Active Directory integration concepts documentation](concepts-identity.md#azure-active-directory-integration).

## Region availability

AKS-managed Azure Active Directory integration is available in public regions where [AKS is supported](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service).

* Azure Government isn't currently supported.
* Azure China 21Vianet isn't currently supported.

## Limitations 

* AKS-managed Azure AD integration can't be disabled
* non-RBAC enabled clusters aren't supported for AKS-managed Azure AD integration
* Changing the Azure AD tenant associated with AKS-managed Azure AD integration isn't supported

## Prerequisites

* The Azure CLI version 2.11.0 or later
* Kubectl with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [kubelogin](https://github.com/Azure/kubelogin)
* If you are using [helm](https://github.com/helm/helm), minimum version of helm 3.3.

> [!Important]
> You must use Kubectl with a minimum version of 1.18.1 or kubelogin. If you don't use the correct version, you will notice authentication issues.

To install kubectl and kubelogin, use the following commands:

```azurecli-interactive
sudo az aks install-cli
kubectl version --client
kubelogin --version
```

Use [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for other operating systems.


## Before you begin

For your cluster, you need an Azure AD group. This group is needed as admin group for the cluster to grant cluster admin permissions. You can use an existing Azure AD group, or create a new one. Record the object ID of your Azure AD group.

```azurecli-interactive
# List existing groups in the directory
az ad group list --filter "displayname eq '<group-name>'" -o table
```

To create a new Azure AD group for your cluster administrators, use the following command:

```azurecli-interactive
# Create an Azure AD group
az ad group create --display-name myAKSAdminGroup --mail-nickname myAKSAdminGroup
```

## Create an AKS cluster with Azure AD enabled

Create an AKS cluster by using the following CLI commands.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```

Create an AKS cluster, and enable administration access for your Azure AD group

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful creation of an AKS-managed Azure AD cluster has the following section in the response body
```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

Once the cluster is created, you can start accessing it.

## Access an Azure AD enabled cluster

You'll need the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role to do the following steps.

Get the user credentials to access the cluster:
 
```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```
Follow the instructions to sign in.

Use the kubectl get nodes command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes

NAME                       STATUS   ROLES   AGE    VERSION
aks-nodepool1-15306047-0   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-1   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-2   Ready    agent   102m   v1.15.10
```
Configure [Azure role-based access control (Azure RBAC)](./azure-ad-rbac.md) to configure additional security groups for your clusters.

## Troubleshooting access issues with Azure AD

> [!Important]
> The steps described below are bypassing the normal Azure AD group authentication. Use them only in an emergency.

If you're permanently blocked by not having access to a valid Azure AD group with access to your cluster, you can still obtain the admin credentials to access the cluster directly.

To do these steps, you'll need to have access to the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) built-in role.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster --admin
```

## Enable AKS-managed Azure AD Integration on your existing cluster

You can enable AKS-managed Azure AD Integration on your existing RBAC enabled cluster. Ensure to set your admin group to keep access on your cluster.

```azurecli-interactive
az aks update -g MyResourceGroup -n MyManagedCluster --enable-aad --aad-admin-group-object-ids <id-1> [--aad-tenant-id <id>]
```

A successful activation of an AKS-managed Azure AD cluster has the following section in the response body

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

Download user credentials again to access your cluster by following the steps [here][access-cluster].

## Upgrading to AKS-managed Azure AD Integration

If your cluster uses legacy Azure AD integration, you can upgrade to AKS-managed Azure AD Integration.

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful migration of an AKS-managed Azure AD cluster has the following section in the response body

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

If you want to access the cluster, follow the steps [here][access-cluster].

## Non-interactive sign in with kubelogin

There are some non-interactive scenarios, such as continuous integration pipelines, that aren't currently available with kubectl. You can use [`kubelogin`](https://github.com/Azure/kubelogin) to access the cluster with non-interactive service principal sign-in.

## Next steps

* Learn about [Azure RBAC integration for Kubernetes Authorization][azure-rbac-integration]
* Learn about [Azure AD integration with Kubernetes RBAC][azure-ad-rbac].
* Use [kubelogin](https://github.com/Azure/kubelogin) to access features for Azure authentication that aren't available in kubectl.
* Learn more about [AKS and Kubernetes identity concepts][aks-concepts-identity].
* Use [Azure Resource Manager (ARM) templates ][aks-arm-template] to create AKS-managed Azure AD enabled clusters.

<!-- LINKS - external -->
[kubernetes-webhook]:https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[aks-arm-template]: /azure/templates/microsoft.containerservice/managedclusters

<!-- LINKS - Internal -->
[azure-rbac-integration]: manage-azure-rbac.md
[aks-concepts-identity]: concepts-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-group-create]: /cli/azure/group#az-group-create
[open-id-connect]:../active-directory/develop/v2-protocols-oidc.md
[az-ad-user-show]: /cli/azure/ad/user#az-ad-user-show
[rbac-authorization]: concepts-identity.md#role-based-access-controls-rbac
[operator-best-practices-identity]: operator-best-practices-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[azure-ad-cli]: azure-ad-integration-cli.md
[access-cluster]: #access-an-azure-ad-enabled-cluster
[aad-migrate]: #upgrading-to-aks-managed-azure-ad-integration
