---
title: Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access
description: Learn how to use the Trusted Access feature to enable Azure resources to access Azure Kubernetes Service (AKS) clusters.
author: schaffererin
services: container-service
ms.topic: article
ms.date: 01/16/2023
ms.author: schaffererin
---

# Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access (PREVIEW)

Many Azure services that integrate with Azure Kubernetes Service (AKS) need access to the Kubernetes API server. In order to avoid granting these services admin access or having to keep your AKS clusters public for network access, you can use the AKS Trusted Access feature, which enables you to bypass the private endpoint restriction. Instead of relying on an overpowered [Microsoft Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) application, this feature can use your system-assigned MSI to authenticate with the managed services and applications you want to use on top of AKS.

Trusted Access eliminates the following concerns:

* Azure services may be unable to access your api-servers when the authorized IP range is enabled, or in private clusters unless you implement a complex private endpoint access model.

* clusterAdmin kubeconfig in Azure services creates a risks or privilege escalation and leaking kubeconfig.

  * Azure services may have to implement high-privileged service-to-service permissions.

This article shows you how to use the AKS Trusted Access feature to enable your Azure resources to access your AKS clusters.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Trusted Access feature overview

Trusted Access enables you to give explicit consent to your system-assigned MSI of allowed resources to access your AKS clusters using an Azure resource *RoleBinding*. Your Azure resources access AKS clusters through the AKS regional gateway via system-assigned MSI authentication with the appropriate Kubernetes permissions via an Azure resource *Role*. The Trusted Access feature allows you to access AKS clusters with different configurations, including but not limited to [private clusters](private-clusters.md), [clusters with local accounts disabled](https://azure.microsoft.com/updates/public-preview-create-aks-clusters-without-local-user-accounts-2/), [Azure AD clusters](azure-ad-integration-cli.md), and [authorized IP range clusters](api-server-authorized-ip-ranges.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Resource types that support [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md).
* Pre-defined roles with appropriate [AKS permissions](concepts-identity.md).
  * To learn about what roles to use in various scenarios, check out TBD.
* If you're using Azure CLI, the **aks-preview** extension version **0.5.74 or later** is required.

    Install the extension:
  
    ```azurecli
    az extension add --name aks-preview
    ```

    If you already have the extension, install any available updates:

    ```azurecli
    az extension update --name aks-preview
    ```

* You must register the appropriate feature flags.

    | Name | Version | Region availability |
    |---|---|---|
    | Control plane Role | 2022-05-02-preview | All regions |
    | Control plane Role Binding | 2022-05-02-preview | All regions |
    | Data plane | v1 | Ready in eastus2euap, centraluseuap |

## Create an AKS cluster

[Create an AKS cluster](tutorial-kubernetes-deploy-cluster.md) in the same subscription as the Azure resource you want to access the cluster.

## Select the required Trusted Access Roles

The roles you select depend on the different Azure services. Azure Machine Learning (AzureML) now supports access to AKS clusters with the Trusted Access feature. To preview this feature in AzureML, see [AzureML access to AKS clusters with special configurations](../machine-learning/azureml-aks-ta-support.md).

## Create a Trusted Access RoleBinding

After confirming which role to use, use the Azure CLI to create a Trusted Access RoleBinding under an AKS cluster. The RoleBinding associates your selected role with the partner service.

### Azure CLI

```azurecli
az aks trustedaccess rolebinding create  --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <rolebinding name> -s <connected service resource ID> --roles <role name1, rolename2>
```

### Sample Azure CLI command

```azurecli
az aks trustedaccess rolebinding create \
-g myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
-s /subscriptions/000-000-000-000-000/resourceGroups/myResourceGroup/providers/Microsoft.MachineLearningServices/workspaces/MyMachineLearning \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

---

## Update an existing Trusted Access RoleBinding

For an existing RoleBinding with associated source service, you can update the rolebinding with new roles.

> [!NOTE]
> The new RoleBinding may take up to 5 minutes to take effect as addon manager updates clusters every 5 mintes. Before new RoleBinding takes effect, the old RoleBinding still works.

### Azure CLI

```azurecli
# Update RoleBinding command

az aks trustedaccess rolebinding update --resource-group <AKS resource group> --cluster-name <AKS cluster name> -n <existing rolebinding name>  --roles <new role name1, newrolename2>

# Update RoleBinding command with sample resource group, cluster, and roles

az aks trustedaccess rolebinding update \
--resource-group myResourceGroup \
--cluster-name myAKSCluster -n test-binding \
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader,Microsoft.Compute/virtualMachineScaleSets/test-admin
```

---

## Check the Trusted Access RoleBinding for a cluster

Use the Azure CLI to check the Trusted Access RoleBindings for a cluster.

```azurecli
az aks trustedaccess rolebinding list --name <rolebinding name> --resource-group <AKS resource group>
```

---

## List the Trusted Access RoleBinding

Use the Azure CLI to list your specific Trusted Access RoleBinding.

```azurecli
az aks trustedaccess rolebinding show --name <rolebinding name> --resource-group <AKS resource group> --cluster-name <AKS cluster name>
```

## Next steps

For more information on AKS and AzureML, see:

* [Introduction to Kubernetes compute target in AzureML](../machine-learning/how-to-attach-kubernetes-anywhere.md)
* [Deploy and manage cluster extensions for AKS](/cluster-extensions.md)
* [Deploy AzureML extension on AKS or Arc Kubernetes cluster](../machine-learning/how-to-deploy-kubernetes-extension.md)
