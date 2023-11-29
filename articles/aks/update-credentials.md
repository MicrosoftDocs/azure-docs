---
title: Update or rotate the credentials for an Azure Kubernetes Service (AKS) cluster
description: Learn how update or rotate the service principal or Microsoft Entra Application credentials for an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/01/2023
---

# Update or rotate the credentials for an Azure Kubernetes Service (AKS) cluster

AKS clusters created with a service principal have a one-year expiration time. As you near the expiration date, you can reset the credentials to extend the service principal for an additional period of time. You might also want to update, or rotate, the credentials as part of a defined security policy. AKS clusters [integrated with Microsoft Entra ID][aad-integration] as an authentication provider have two more identities: the Microsoft Entra Server App and the Microsoft Entra Client App. This article details how to update the service principal and Microsoft Entra credentials for an AKS cluster.

> [!NOTE]
> Alternatively, you can use a managed identity for permissions instead of a service principal. Managed identities don't require updates or rotations. For more information, see [Use managed identities](use-managed-identity.md).

## Before you begin

You need the Azure CLI version 2.0.65 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Update or create a new service principal for your AKS cluster

When you want to update the credentials for an AKS cluster, you can choose to either:

* Update the credentials for the existing service principal.
* Create a new service principal and update the cluster to use these new credentials.

> [!WARNING]
> If you choose to create a *new* service principal, wait around 30 minutes for the service principal permission to propagate across all regions. Updating a large AKS cluster to use these credentials can take a long time to complete.

### Check the expiration date of your service principal

To check the expiration date of your service principal, use the [`az ad app credential list`][az-ad-app-credential-list] command. The following example gets the service principal ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group using the [`az aks show`][az-aks-show] command. The service principal ID is set as a variable named *SP_ID*.

```azurecli
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
az ad app credential list --id "$SP_ID" --query "[].endDateTime" -o tsv
```

### Reset the existing service principal credentials

To update the credentials for an existing service principal, get the service principal ID of your cluster using the [`az aks show`][az-aks-show] command. The following example gets the ID for the cluster named *myAKSCluster* in the *myResourceGroup* resource group. The variable named *SP_ID* stores the service principal ID used in the next step. These commands use the Bash command language.

> [!WARNING]
> When you reset your cluster credentials on an AKS cluster that uses Azure Virtual Machine Scale Sets, a [node image upgrade][node-image-upgrade] is performed to update your nodes with the new credential information.

```azurecli-interactive
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
```

Use the variable *SP_ID* containing the service principal ID to reset the credentials using the [`az ad app credential reset`][az-ad-app-credential-reset] command. The following example enables the Azure platform to generate a new secure secret for the service principal and store it as a variable named *SP_SECRET*.

```azurecli-interactive
SP_SECRET=$(az ad app credential reset --id "$SP_ID" --query password -o tsv)
```

Next, you [update AKS cluster with service principal credentials][update-cluster-service-principal-credentials]. This step is necessary to update the service principal on your AKS cluster.

### Create a new service principal

> [!NOTE]
> If you updated the existing service principal credentials in the previous section, skip this section and instead [update the AKS cluster with service principal credentials][update-cluster-service-principal-credentials].

To create a service principal and update the AKS cluster to use the new credential, use the [`az ad sp create-for-rbac`][az-ad-sp-create] command.

```azurecli-interactive
az ad sp create-for-rbac --role Contributor --scopes /subscriptions/mySubscriptionID
```

The output is similar to the following example output. Make a note of your own `appId` and `password` to use in the next step.

```json
{
  "appId": "7d837646-b1f3-443d-874c-fd83c7c739c5",
  "name": "7d837646-b1f3-443d-874c-fd83c7c739c",
  "password": "a5ce83c9-9186-426d-9183-614597c7f2f7",
  "tenant": "a4342dc8-cd0e-4742-a467-3129c469d0e5"
}
```

Define variables for the service principal ID and client secret using your output from running the [`az ad sp create-for-rbac`][az-ad-sp-create] command. The *SP_ID* is the *appId*, and the *SP_SECRET* is your *password*.

```console
SP_ID=7d837646-b1f3-443d-874c-fd83c7c739c5
SP_SECRET=a5ce83c9-9186-426d-9183-614597c7f2f7
```

Next, you [update AKS cluster with the new service principal credential][update-cluster-service-principal-credentials]. This step is necessary to update the AKS cluster with the new service principal credential.

## Update AKS cluster with service principal credentials

>[!IMPORTANT]
>For large clusters, updating your AKS cluster with a new service principal can take a long time to complete. Consider reviewing and customizing the [node surge upgrade settings][node-surge-upgrade] to minimize disruption during the update. For small and midsize clusters, it takes a several minutes for the new credentials to update in the cluster.

Update the AKS cluster with your new or existing credentials by running the [`az aks update-credentials`][az-aks-update-credentials] command.

```azurecli-interactive
az aks update-credentials \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --reset-service-principal \
    --service-principal "$SP_ID" \
    --client-secret "${SP_SECRET}"
```

<a name='update-aks-cluster-with-new-azure-ad-application-credentials'></a>

## Update AKS cluster with new Microsoft Entra application credentials

You can create new Microsoft Entra server and client applications by following the [Microsoft Entra integration steps][create-aad-app], or reset your existing Microsoft Entra applications following the [same method as for service principal reset][reset-existing-service-principal-credentials]. After that, you need to update your cluster Microsoft Entra application credentials using the [`az aks update-credentials`][az-aks-update-credentials] command with the *--reset-aad* variables.

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

In this article, you learned how to update or rotate service principal and Microsoft Entra application credentials. For more information on how to use a manage identity for workloads within an AKS cluster, see [Best practices for authentication and authorization in AKS][best-practices-identity].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-update-credentials]: /cli/azure/aks#az_aks_update_credentials
[best-practices-identity]: operator-best-practices-identity.md
[aad-integration]: ./azure-ad-integration-cli.md
[create-aad-app]: ./azure-ad-integration-cli.md#create-azure-ad-server-component
[az-ad-sp-create]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az-ad-app-credential-list]: /cli/azure/ad/app/credential#az_ad_app_credential_list
[az-ad-app-credential-reset]: /cli/azure/ad/app/credential#az_ad_app_credential_reset
[node-image-upgrade]: ./node-image-upgrade.md
[node-surge-upgrade]: upgrade-aks-cluster.md#customize-node-surge-upgrade
[update-cluster-service-principal-credentials]: #update-aks-cluster-with-service-principal-credentials
[reset-existing-service-principal-credentials]: #reset-the-existing-service-principal-credentials
