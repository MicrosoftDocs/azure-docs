---
title: Reset the credentials for a cluster
titleSuffix: Azure Kubernetes Service
description: Learn how update or reset the service principal or AAD Application credentials for an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 03/11/2019

---

# Update or rotate the credentials for Azure Kubernetes Service (AKS)

AKS clusters created with a service principal have a one-year expiration time. As you near the expiration date, you can reset the credentials to extend the service principal for an additional period of time. You may also want to update, or rotate, the credentials as part of a defined security policy. This article details how to update these credentials for an AKS cluster.

You may also have [integrated your AKS cluster with Azure Active Directory][aad-integration], and use it as an authentication provider for your cluster. In that case you will have 2 more identities created for your cluster, the AAD Server App and the AAD Client App, you may also reset those credentials.

Alternatively, you can use a managed identity for permissions instead of a service principal. Managed identities are easier to manage than service principals and do not require updates or rotations. For more information, see [Use managed identities](use-managed-identity.md).

## Before you begin

You need the Azure CLI version 2.0.65 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Update or create a new service principal for your AKS cluster

When you want to update the credentials for an AKS cluster, you can choose to either:

* Update the credentials for the existing service principal.
* Create a new service principal and update the cluster to use these new credentials. 

> [!WARNING]
> If you choose to create a *new* service principal, updating a large AKS cluster to use these credentials may take a long time to complete.

### Check the expiration date of your service principal

To check the expiration date of your service principal, use the [az ad sp credential list][az-ad-sp-credential-list] command. The following example gets the service principal ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group using the [az aks show][az-aks-show] command. The service principal ID is set as a variable named *SP_ID* for use with the [az ad sp credential list][az-ad-sp-credential-list] command.

```azurecli
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
az ad sp credential list --id $SP_ID --query "[].endDate" -o tsv
```

### Reset the existing service principal credential

To update the credentials for the existing service principal, get the service principal ID of your cluster using the [az aks show][az-aks-show] command. The following example gets the ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group. The service principal ID is set as a variable named *SP_ID* for use in additional command. These commands use Bash syntax.

> [!WARNING]
> When you reset your cluster credentials on an AKS cluster that uses Azure Virtual Machine Scale Sets, a [node image upgrade][node-image-upgrade] is performed to update your nodes with the new credential information.

```azurecli-interactive
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
```

With a variable set that contains the service principal ID, now reset the credentials using [az ad sp credential reset][az-ad-sp-credential-reset]. The following example lets the Azure platform generate a new secure secret for the service principal. This new secure secret is also stored as a variable.

```azurecli-interactive
SP_SECRET=$(az ad sp credential reset --name $SP_ID --query password -o tsv)
```

Now continue on to [update AKS cluster with new service principal credentials](#update-aks-cluster-with-new-service-principal-credentials). This step is necessary for the Service Principal changes to reflect on the AKS cluster.

### Create a new service principal

If you chose to update the existing service principal credentials in the previous section, skip this step. Continue to [update AKS cluster with new service principal credentials](#update-aks-cluster-with-new-service-principal-credentials).

To create a service principal and then update the AKS cluster to use these new credentials, use the [az ad sp create-for-rbac][az-ad-sp-create] command. In the following example, the `--skip-assignment` parameter prevents any additional default assignments being assigned:

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example. Make a note of your own `appId` and `password`. These values are used in the next step.

```json
{
  "appId": "7d837646-b1f3-443d-874c-fd83c7c739c5",
  "name": "7d837646-b1f3-443d-874c-fd83c7c739c",
  "password": "a5ce83c9-9186-426d-9183-614597c7f2f7",
  "tenant": "a4342dc8-cd0e-4742-a467-3129c469d0e5"
}
```

Now define variables for the service principal ID and client secret using the output from your own [az ad sp create-for-rbac][az-ad-sp-create] command, as shown in the following example. The *SP_ID* is your *appId*, and the *SP_SECRET* is your *password*:

```console
SP_ID=7d837646-b1f3-443d-874c-fd83c7c739c5
SP_SECRET=a5ce83c9-9186-426d-9183-614597c7f2f7
```

Now continue on to [update AKS cluster with new service principal credentials](#update-aks-cluster-with-new-service-principal-credentials). This step is necessary for the Service Principal changes to reflect on the AKS cluster.

## Update AKS cluster with new service principal credentials

> [!IMPORTANT]
> For large clusters, updating the AKS cluster with a new service principal may take a long time to complete.

Regardless of whether you chose to update the credentials for the existing service principal or create a service principal, you now update the AKS cluster with your new credentials using the [az aks update-credentials][az-aks-update-credentials] command. The variables for the *--service-principal* and *--client-secret* are used:

```azurecli-interactive
az aks update-credentials \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --reset-service-principal \
    --service-principal $SP_ID \
    --client-secret $SP_SECRET
```

For small and midsize clusters, it takes a few moments for the service principal credentials to be updated in the AKS.

## Update AKS Cluster with new AAD Application credentials

You may create new AAD Server and Client applications by following the [AAD integration steps][create-aad-app]. Or reset your existing AAD Applications following the [same method as for service principal reset](#reset-the-existing-service-principal-credential). After that you just need to update your cluster AAD Application credentials using the same [az aks update-credentials][az-aks-update-credentials] command but using the *--reset-aad* variables.

```azurecli-interactive
az aks update-credentials \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --reset-aad \
    --aad-server-app-id <SERVER APPLICATION ID> \
    --aad-server-app-secret <SERVER APPLICATION SECRET> \
    --aad-client-app-id <CLIENT APPLICATION ID>
```


## Next steps

In this article, the service principal for the AKS cluster itself and the AAD Integration Applications were updated. For more information on how to manage identity for workloads within a cluster, see [Best practices for authentication and authorization in AKS][best-practices-identity].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-update-credentials]: /cli/azure/aks#az_aks_update_credentials
[best-practices-identity]: operator-best-practices-identity.md
[aad-integration]: ./azure-ad-integration-cli.md
[create-aad-app]: ./azure-ad-integration-cli.md#create-azure-ad-server-component
[az-ad-sp-create]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az-ad-sp-credential-list]: /cli/azure/ad/sp/credential#az_ad_sp_credential_list
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az_ad_sp_credential_reset
[node-image-upgrade]: ./node-image-upgrade.md
