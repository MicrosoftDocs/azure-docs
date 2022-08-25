---
title: Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access
description: Learn how to use the Trusted Access feature to enable Azure resources to access Azure Kubernetes Service (AKS) clusters.
author: schaffererin
services: container-service
ms.topic: article
ms.date: 08/24/2022
ms.author: schaffererin
---

# Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access (PREVIEW)

Many Azure services depend on clusterAdmin kubeconfig and the publicly accessible kube-apiserver endpoint to access AKS clusters.

The AKS Trusted Access feature enables you to bypass the private endpoint restriction. Instead of relying on an overpowered [Microsoft Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) application, this feature can use your system-assigned MSI to authenticate with the managed services and applications you want to use on top of AKS.

Trusted Access eliminates the following concerns:

* Azure services may not have stable access to customer api-servers.

  * Unable to access when the authorized IP range is enabled.

  * Unable to access in private clusters unless Azure services implement a complex private endpoint access model.

* clusterAdmin kubeconfig in Azure services creates a risks or privilege escalation and leaking kubeconfig.

* Azure services have to be able to call the `listClusterAdminCredential` API when depending on clusterAdmin kubeconfig.

  * Customers may have to take extra steps to grant role access.

  * Azure services may have to implement high-privileged service-to-service permissions.

This article shows you how to use the AKS Trusted Access feature to enable your Azure resources to access your AKS clusters.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Trusted Access feature overview

Trusted Access enables you to give explicit consent to your system-assigned MSI of allowed resources to access your AKS clusters using an Azure resource *RoleBinding*. Your Azure resources access AKS clusters through the AKS regional gateway via system-assigned MSI authentication with the appropriate Kubernetes permissions via an Azure resource *Role*. The Trusted Access feature allows you to access AKS clusters with different configurations, including but not limited to [private clusters](private-clusters.md), [clusters with local accounts disabled](https://azure.microsoft.com/updates/public-preview-create-aks-clusters-without-local-user-accounts-2/), [Azure AD clusters](azure-ad-integration-cli.md), and [authorized IP range clusters](api-server-authorized-ip-ranges.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Resource type(s) that support [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md).
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

[Create an AKS cluster](tutorial-kubernetes-deploy-cluster.md) in the same subscription as the Azure resource you want to allow to access the cluster.

## Select the required Trusted Access Roles

The roles you select depend on the different Azure services.

* Links to partner docs - add later

## Create a Trusted Access RoleBinding

After confirming which role to use, use the Azure CLI to create a Trusted Access RoleBinding under an AKS cluster. The RoleBinding associates your selected role with the partner service.

### Azure CLI

```azurecli
az aks trustedaccess rolebinding create az aks trustedaccess rolebinding create 
-g
--cluster-name -n
-s
--roles
```

### Sample Azure CLI command

```azurecli
az aks trustedaccess rolebinding create
-g myResourceGroup
--cluster-name myAKSCluster -n test-binding
-s /subscriptions/000-000-000-000-000/resourceGroups/myResourceGroup/providers/Microsoft.MachineLearningServices/workspaces/MyMachineLearning
--roles Microsoft.Compute/virtualMachineScaleSets/test-node-reader Microsoft.Compute/virtualMachineScaleSets/test-admin
```

---

| Property | Description | Required |
|---|---|---|
| sourceResourceId | The resource ID that needs to access the AKS cluster | Yes |
| roles | A list of the roles in the form of `<source resource type>/<role name>` | Yes |

## List the Trusted Access Role

Use the Azure CLI to list your available Trusted Access Roles.

### Azure CLI

```azurecli
az aks trustedaccess role list -l <location>
```

---

## List the Trusted Access RoleBinding

Use the Azure CLI to list your specific Trusted Access RoleBinding.

### Azure CLI

```azurecli
az aks trustedaccess rolebinding show --name <bindingName> --resource-group <clusterResourceGroup> --cluster-name <clusterName>
```

You can also use kubectl to list the RoleBinding:

```azurecli
az aks get-credentials --resource-group <resourceGroup> --name <clusterName> --kubectl get clusterrolebinding |grep trustedaccess
```

---

## Next steps

For more information on TBD.
