---
title: Get secure resource access to AKS by using Trusted Access
description: Learn how to use the Trusted Access feature to give Azure resources access to Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/05/2024
ms.author: schaffererin
---

# Get secure access for Azure resources in Azure Kubernetes Service by using Trusted Access

Many Azure services that integrate with Azure Kubernetes Service (AKS) need access to the Kubernetes API server. To avoid granting these services admin access or making your AKS clusters public for network access, you can use the AKS Trusted Access feature.

This feature gives services secure access to AKS API server by using the Azure back end without requiring a private endpoint. Instead of relying on identities that have [Microsoft Entra](../active-directory/fundamentals/active-directory-whatis.md) permissions, this feature can use your system-assigned managed identity to authenticate with the managed services and applications that you want to use with your AKS clusters.

This article shows you how to get secure access for your Azure services to your Kubernetes API server in AKS by using Trusted Access.

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
* Azure CLI version 2.53.0 or later. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* To learn what roles to use in different scenarios, see these articles:
  * [Azure Machine Learning access to AKS clusters with special configurations](https://github.com/Azure/AML-Kubernetes/blob/master/docs/azureml-aks-ta-support.md)
  * [What is Azure Kubernetes Service backup?][aks-azure-backup]
  * [Turn on an agentless container posture](../defender-for-cloud/concept-agentless-containers.md)

## Create an AKS cluster

In the same subscription as the Azure resource that you want to access the cluster, [create an AKS cluster](tutorial-kubernetes-deploy-cluster.md).

## Select the required Trusted Access roles

The roles that you select depend on the Azure services that you want to access the AKS cluster. Azure services help create roles and role bindings that build the connection from the Azure service to AKS.

To find the roles that you need, see the documentation for the Azure service that you want to connect to AKS. You can also use the Azure CLI to list the roles that are available for the Azure service. For example, to list the roles for Azure Machine Learning, use the following command:

```azurecli-interactive
az aks trustedaccess role list --location $LOCATION
```

## Create a Trusted Access role binding

After you confirm which role to use, use the Azure CLI to create a Trusted Access role binding in the AKS cluster. The role binding associates your selected role with the Azure service.

```azurecli
# Create a Trusted Access role binding in an AKS cluster

az aks trustedaccess rolebinding create  --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME --name $ROLE_BINDING_NAME --source-resource-id $SOURCE_RESOURCE_ID --roles $ROLE_NAME_1,$ROLE_NAME_2
```

Here's an example:

```azurecli
# Sample command

az aks trustedaccess rolebinding create --resource-group myResourceGroup --cluster-name myAKSCluster --name test-binding --source-resource-id /subscriptions/000-000-000-000-000/resourceGroups/myResourceGroup/providers/Microsoft.MachineLearningServices/workspaces/MyMachineLearning --roles Microsoft.MachineLearningServices/workspaces/mlworkload
```

## Update an existing Trusted Access role binding

For an existing role binding that has an associated source service, you can update the role binding with new roles.

> [!NOTE]
> The add-on manager updates clusters every five minutes, so the new role binding might take up to five minutes to take effect. Before the new role binding takes effect, the existing role binding still works.
>
> You can use the `az aks trusted access rolebinding list` command to check the current role binding.

```azurecli-interactive
az aks trustedaccess rolebinding update --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME --name $ROLE_BINDING_NAME --roles $ROLE_NAME_3,$ROLE_NAME_4
```

## Show a Trusted Access role binding

Show a specific Trusted Access role binding by using the `az aks trustedaccess rolebinding show` command:

```azurecli=interactive
az aks trustedaccess rolebinding show --name $ROLE_BINDING_NAME --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME
```

## List all the Trusted Access role bindings for a cluster

List all the Trusted Access role bindings for a cluster by using the `az aks trustedaccess rolebinding list` command:

```azurecli-interactive
az aks trustedaccess rolebinding list --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME
```

## Delete a Trusted Access role binding for a cluster

> [!WARNING]
> Deleting an existing Trusted Access role binding disconnects the Azure service from the AKS cluster.

Delete an existing Trusted Access role binding by using the `az aks trustedaccess rolebinding delete` command:

```azurecli-interactive
az aks trustedaccess rolebinding delete --name $ROLE_BINDING_NAME --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME
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
[azure-cli-install]: /cli/azure/install-azure-cli

