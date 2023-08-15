---
title: Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access
description: Learn how to use the Trusted Access feature to enable Azure resources to access Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 05/23/2023
ms.author: schaffererin
---

# Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access (Preview)

Many Azure services that integrate with Azure Kubernetes Service (AKS) need access to the Kubernetes API server. In order to avoid granting these services admin access or having to keep your AKS clusters public for network access, you can use the AKS Trusted Access feature.

This feature allows services to securely connect to AKS and Kubernetes via the Azure backend without requiring private endpoint. Instead of relying on identities with [Microsoft Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) permissions, this feature can use your system-assigned managed identity to authenticate with the managed services and applications you want to use on top of AKS.

Trusted Access addresses the following scenarios:

* Azure services may be unable to access the Kubernetes API server when the authorized IP range is enabled, or in private clusters unless you implement a private endpoint access model.

* Providing admin access to the Kubernetes API to an Azure service doesn't follow the least privileged access best practices and could lead to privilege escalations or risks of credential leakage.

  * For example, you may have to implement high-privileged service-to-service permissions, which aren't ideal during audit reviews.

This article shows you how to enable secure access from your Azure services to your Kubernetes API server in AKS using Trusted Access.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Trusted Access feature overview

Trusted Access enables you to give explicit consent to your system-assigned MSI of allowed resources to access your AKS clusters using an Azure resource *RoleBinding*. Your Azure resources access AKS clusters through the AKS regional gateway via system-assigned managed identity authentication with the appropriate Kubernetes permissions via an Azure resource *Role*. The Trusted Access feature allows you to access AKS clusters with different configurations, including but not limited to [private clusters](private-clusters.md), [clusters with local accounts disabled](manage-local-accounts-managed-azure-ad.md#disable-local-accounts), [Azure AD clusters](azure-ad-integration-cli.md), and [authorized IP range clusters](api-server-authorized-ip-ranges.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Resource types that support [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md).
* * If you're using Azure CLI, the **aks-preview** extension version **0.5.74 or later** is required.
* To learn about what Roles to use in various scenarios, see:
  *  [AzureML access to AKS clusters with special configurations](https://github.com/Azure/AML-Kubernetes/blob/master/docs/azureml-aks-ta-support.md).
  *  [Using Azure Backup][aks-azure-backup]
  *  [Enable Agentless Container Posture](../defender-for-cloud/concept-agentless-containers.md)


First, install the aks-preview extension by running the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

Then register the `TrustedAccessPreview` feature flag by using the [`az feature register`][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [`az feature show`][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [`az provider register`][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster

[Create an AKS cluster](tutorial-kubernetes-deploy-cluster.md) in the same subscription as the Azure resource you want to access the cluster.

## Select the required Trusted Access Roles

The Roles you select depend on the different Azure services. These services help create Roles and RoleBindings, which build the connection from the Azure service to AKS.

## Create a Trusted Access RoleBinding

After confirming which Role to use, use the Azure CLI to create a Trusted Access RoleBinding in an AKS cluster. The RoleBinding associates your selected Role with the Azure service.

```azurecli
# Create a Trusted Access RoleBinding in an AKS cluster

az aks trustedaccess rolebinding create  --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <rolebinding name> -s <connected service resource ID> --roles <roleName1, roleName2>

# Sample command

az aks trustedaccess rolebinding create \
-g myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
--source-resource-id /subscriptions/000-000-000-000-000/resourceGroups/myResourceGroup/providers/Microsoft.MachineLearningServices/workspaces/MyMachineLearning \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

---

## Update an existing Trusted Access RoleBinding with new roles

For an existing RoleBinding with associated source service, you can update the RoleBinding with new Roles.

> [!NOTE]
> The new RoleBinding may take up to 5 minutes to take effect as addon manager updates clusters every 5 minutes. Before the new RoleBinding takes effect, the old RoleBinding still works.
>
> You can use `az aks trusted access rolebinding list --name <rolebinding name> --resource-group <resource group>` to check the current RoleBinding.

```azurecli
# Update RoleBinding command

az aks trustedaccess rolebinding update --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <existing rolebinding name>  --roles <newRoleName1, newRoleName2>

# Update RoleBinding command with sample resource group, cluster, and Roles

az aks trustedaccess rolebinding update \
--resource-group myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

---

## Show the Trusted Access RoleBinding

Use the Azure CLI to show a specific Trusted Access RoleBinding.

```azurecli
az aks trustedaccess rolebinding show --name <rolebinding name> --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

---

## List all the Trusted Access RoleBindings for a cluster

Use the Azure CLI to list all the Trusted Access RoleBindings for a cluster.

```azurecli
az aks trustedaccess rolebinding list --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## Delete the Trusted Access RoleBinding for a cluster

> [!WARNING]
> Deleting the existing Trusted Access RoleBinding will cause disconnection from AKS cluster to the Azure service.

Use the Azure CLI to delete an existing Trusted Access RoleBinding.

```azurecli
az aks trustedaccess rolebinding delete --name <rolebinding name> --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## Next steps

For more information on AKS, see:

* [Deploy and manage cluster extensions for AKS](cluster-extensions.md)
* [Deploy AzureML extension on AKS or Arc Kubernetes cluster](../machine-learning/how-to-deploy-kubernetes-extension.md)
* [Deploy Azure Backup on AKS cluster](../backup/azure-kubernetes-service-backup-overview.md)
* [Enable Agentless Container Posture on AKS cluster](../defender-for-cloud/concept-agentless-containers.md)

<!-- LINKS -->

[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[aks-azure-backup]: ../backup/azure-kubernetes-service-backup-overview.md
