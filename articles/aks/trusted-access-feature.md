---
title: Get secure resource access to AKS by using Trusted Access
description: Learn how to use the Trusted Access feature to give Azure resources access to Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 12/04/2023
ms.author: schaffererin
---

# Get secure access for Azure resources in Azure Kubernetes Service by using Trusted Access (preview)

Many Azure services that integrate with Azure Kubernetes Service (AKS) need access to the Kubernetes API server. To avoid granting these services admin access or making your AKS clusters public for network access, you can use the AKS Trusted Access feature.

This feature gives services secure access to AKS and Kubernetes via the Azure back end without requiring a private endpoint. Instead of relying on identities that have [Microsoft Entra](../active-directory/fundamentals/active-directory-whatis.md) permissions, this feature can use your system-assigned managed identity to authenticate with the managed services and applications that you want to use with your AKS clusters.

This article shows you how to get secure access for your Azure services to your Kubernetes API server in AKS by using Trusted Access.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> The Trusted Access API is generally available. We provide general availability (GA) support for the Azure CLI, but it's still in preview and requires using the aks-preview extension.

## Trusted Access feature overview

Trusted Access addresses the following scenarios:

* If an authorized IP range is set or in a private cluster, Azure services might not be able to access the Kubernetes API server unless you implement a private endpoint access model.

* Giving an Azure service admin access to the Kubernetes API doesn't follow the least privilege access best practice and can lead to privilege escalations or risk of credentials leakage. For example, you might have to implement high-privileged service-to-service permissions, and they aren't ideal in an audit review.

You can use Trusted Access to give explicit consent to your system-assigned managed identity of allowed resources to access your AKS clusters by using an Azure resource called a *role binding*. Your Azure resources access AKS clusters through the AKS regional gateway via system-assigned managed identity authentication. The appropriate Kubernetes permissions are assigned via an Azure resource called a *role*. Through Trusted Access, you can access AKS clusters with different configurations including but not limited to [private clusters](private-clusters.md), [clusters that have local accounts turned off](manage-local-accounts-managed-azure-ad.md#disable-local-accounts), [Microsoft Entra clusters](azure-ad-integration-cli.md), and [authorized IP range clusters](api-server-authorized-ip-ranges.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Resource types that support [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md).
  * If you're using the Azure CLI, the aks-preview extension version 0.5.74 or later is required.
* To learn what roles to use in different scenarios, see these articles:
  * [Azure Machine Learning access to AKS clusters with special configurations](https://github.com/Azure/AML-Kubernetes/blob/master/docs/azureml-aks-ta-support.md)
  * [What is Azure Kubernetes Service backup?][aks-azure-backup]
  * [Turn on an agentless container posture](../defender-for-cloud/concept-agentless-containers.md)

## Get started

First, install the aks-preview extension:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension:

```azurecli
az extension update --name aks-preview
```

Then, register the TrustedAccessPreview feature flag by using the [az feature register][az-feature-register] command.

Here's an example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
```

It takes a few minutes for the status to appear as **Registered**. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
```

When the status is **Registered**, refresh the registration of the Microsoft.ContainerService resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster

In the same subscription as the Azure resource that you want to access the cluster, [create an AKS cluster](tutorial-kubernetes-deploy-cluster.md).

## Select the required Trusted Access roles

The roles that you select depend on the Azure services that you want to access the AKS cluster. Azure services help create roles and role bindings that build the connection from the Azure service to AKS.

## Create a Trusted Access role binding

After you confirm which role to use, use the Azure CLI to create a Trusted Access role binding in the AKS cluster. The role binding associates your selected role with the Azure service.

```azurecli
# Create a Trusted Access role binding in an AKS cluster

az aks trustedaccess rolebinding create  --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <role binding name> -s <connected service resource ID> --roles <roleName1, roleName2>

# Sample command

az aks trustedaccess rolebinding create \
-g myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
--source-resource-id /subscriptions/000-000-000-000-000/resourceGroups/myResourceGroup/providers/Microsoft.MachineLearningServices/workspaces/MyMachineLearning \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

## Update an existing Trusted Access role binding

For an existing role binding that has an associated source service, you can update the role binding with new roles.

> [!NOTE]
> The new role binding might take up to 5 minutes to take effect. The add-on manager updates clusters every 5 minutes. Before the new role binding takes effect, the existing role binding still works.
>
> You can use `az aks trusted access rolebinding list --name <role binding name> --resource-group <resource group>` to check the current role binding.

```azurecli
# Update the RoleBinding command

az aks trustedaccess rolebinding update --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <existing role binding name>  --roles <newRoleName1, newRoleName2>

# Update the RoleBinding command with sample resource group, cluster, and roles

az aks trustedaccess rolebinding update \
--resource-group myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

## Show a Trusted Access role binding

Use the Azure CLI to show a specific Trusted Access role binding:

```azurecli
az aks trustedaccess rolebinding show --name <role binding name> --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## List all the Trusted Access role bindings for a cluster

Use the Azure CLI to list all the Trusted Access role bindings for a cluster:

```azurecli
az aks trustedaccess rolebinding list --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## Delete a Trusted Access role binding for a cluster

> [!WARNING]
> Deleting an existing Trusted Access role binding disconnects the Azure service from the AKS cluster.

Use the Azure CLI to delete an existing Trusted Access role binding:

```azurecli
az aks trustedaccess rolebinding delete --name <role binding name> --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## Related content

* [Deploy and manage cluster extensions for AKS](cluster-extensions.md)
* [Deploy the Azure Machine Learning extension on an AKS or Azure Arc&#8211;enabled Kubernetes cluster](../machine-learning/how-to-deploy-kubernetes-extension.md)
* [Deploy Azure Backup on an AKS cluster](../backup/azure-kubernetes-service-backup-overview.md)
* [Set agentless container posture in Microsoft Defender for Cloud for an AKS cluster](../defender-for-cloud/concept-agentless-containers.md)

<!-- LINKS -->

[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[aks-azure-backup]: ../backup/azure-kubernetes-service-backup-overview.md
