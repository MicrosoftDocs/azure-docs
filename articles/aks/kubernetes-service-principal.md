---
title: Service principals for Azure Kubernetes Services (AKS)
description: Create and manage an Azure Active Directory service principal for a cluster in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: get-started-article
ms.date: 09/26/2018
ms.author: iainfou
---

# Service principals with Azure Kubernetes Service (AKS)

To interact with Azure APIs, an AKS cluster requires an [Azure Active Directory (AD) service principal][aad-service-principal]. The service principal is needed to dynamically create and manage other Azure resources such as an Azure load balancer or container registry (ACR).

This article shows how to create and use a service principal for your AKS clusters.

## Before you begin

To create an Azure AD service principal, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your subscription. If you don't have the necessary permissions, you might need to ask your Azure AD or subscription administrator to assign the necessary permissions, or pre-create a service principal for you to use with the AKS cluster.

You also need the Azure CLI version 2.0.46 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Automatically create and use a service principal

When you create an AKS cluster in the Azure portal or using the [az aks create][az-aks-create] command, Azure can automatically generate a service principal.

In the following Azure CLI example, a service principal is not specified. In this scenario, the Azure CLI creates a service principal for the AKS cluster. To successfully complete the operation, your Azure account must have the proper rights to create a service principal.

```azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup --generate-ssh-keys
```

## Manually create a service principal

To manually create a service principal with the Azure CLI, use the [az ad sp create-for-rbac][az-ad-sp-create] command. In the following example, the `--skip-assignment` parameter prevents any additional default assignments being assigned:

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example. Make a note of your own `appId` and `password`. These values are used when you create an AKS cluster in the next section.

```json
{
  "appId": "559513bd-0c19-4c1a-87cd-851a26afd5fc",
  "displayName": "azure-cli-2018-09-25-21-10-19",
  "name": "http://azure-cli-2018-09-25-21-10-19",
  "password": "e763725a-5eee-40e8-a466-dc88d980f415",
  "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db48"
}
```

## Specify a service principal for an AKS cluster

To use an existing service principal when you create an AKS cluster using the [az aks create][az-aks-create] command, use the `--service-principal` and `--client-secret` parameters to specify the `appId` and `password` from the output of the [az ad sp create-for-rbac][az-ad-sp-create] command:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --service-principal <appId> \
    --client-secret <password>
```

If you deploy an AKS cluster using the Azure portal, on the *Authentication* page of the **Create Kubernetes cluster** dialog, choose to **Configure service principal**. Select **Use existing**, and specify the following values:

- **Service principal client ID** is your *appId*
- **Service principal client secret** is the *password* value

![Image of browsing to Azure Vote](media/kubernetes-service-principal/portal-configure-service-principal.png)

## Additional considerations

When using AKS and Azure AD service principals, keep the following considerations in mind.

- The service principal for Kubernetes is a part of the cluster configuration. However, don't use the identity to deploy the cluster.
- Every service principal is associated with an Azure AD application. The service principal for a Kubernetes cluster can be associated with any valid Azure AD application name (for example: *https://www.contoso.org/example*). The URL for the application doesn't have to be a real endpoint.
- When you specify the service principal **Client ID**, use the value of the `appId`.
- On the master and node VMs in the Kubernetes cluster, the service principal credentials are stored in the file `/etc/kubernetes/azure.json`
- When you use the [az aks create][az-aks-create] command to generate the service principal automatically, the service principal credentials are written to the file `~/.azure/aksServicePrincipal.json` on the machine used to run the command.
- When you delete an AKS cluster that was created by [az aks create][az-aks-create], the service principal that was created automatically is not deleted.
    - To delete the service principal, first get the ID for the service principal with [az ad app list][az-ad-app-list]. The following example queries for the cluster named *myAKSCluster* and then deletes the app ID with [az ad app delete][az-ad-app-delete]. Replace these names with your own values:

        ```azurecli
        az ad app list --query "[?displayName=='myAKSCluster'].{Name:displayName,Id:appId}" --output table
        az ad app delete --id <appId>
        ```

## Next steps

For more information about Azure Active Directory service principals, see [Application and service principal objects][service-principal]

<!-- LINKS - internal -->
[aad-service-principal]:../active-directory/develop/app-objects-and-service-principals.md
[acr-intro]: ../container-registry/container-registry-intro.md
[az-ad-sp-create]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[azure-load-balancer-overview]: ../load-balancer/load-balancer-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[service-principal]:../active-directory/develop/app-objects-and-service-principals.md
[user-defined-routes]: ../load-balancer/load-balancer-overview.md
[az-ad-app-list]: /cli/azure/ad/app#az-ad-app-list
[az-ad-app-delete]: /cli/azure/ad/app#az-ad-app-delete
[az-aks-create]: /cli/azure/aks#az-aks-create
