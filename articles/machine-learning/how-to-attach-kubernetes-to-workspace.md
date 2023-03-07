---
title: Attach a Kubernetes cluster to AzureML workspace
description: Learn about how to attach a Kubernetes cluster
titleSuffix: Azure Machine Learning
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 08/31/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Attach a Kubernetes cluster to AzureML workspace

Once AzureML extension is deployed on AKS or Arc Kubernetes cluster, you can attach the Kubernetes cluster to AzureML workspace and create compute targets for ML professionals to use. 

Some key considerations when attaching Kubernetes cluster to AzureML workspace:
  * If you need to access Azure resource securely from your training script, you can specify a [managed identity](./how-to-identity-based-service-authentication.md) for Kubernetes compute target during attach operation.
  * If you plan to have different compute target for different project/team, you can specify Kubernetes namespace for the compute target to isolate workload among different teams/projects.
  * For the same Kubernetes cluster, you can attach it to the same workspace multiple times and create multiple compute targets for different project/team/workload.
  * For the same Kubernetes cluster, you can also attach it to multiple workspaces, and the multiple workspaces can share the same Kubernetes cluster.

### Prerequisite

Azure Machine Learning workspace defaults to having a system-assigned managed identity to access Azure ML resources. The steps are completed if the system assigned default setting is on. 


Otherwise, if a user-assigned managed identity is specified in Azure Machine Learning workspace creation, the following role assignments need to be granted to the managed identity manually before attaching the compute.

|Azure resource name |Role to be assigned|Description|
|--|--|--|
|Azure Relay|Azure Relay Owner|Only applicable for Arc-enabled Kubernetes cluster. Azure Relay isn't created for AKS cluster without Arc connected.|
|Azure Arc-enabled Kubernetes or AKS|Reader|Applicable for both Arc-enabled Kubernetes cluster and AKS cluster.|

Azure Relay resource is created during the extension deployment under the same Resource Group as the Arc-enabled Kubernetes cluster.


### [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The following commands show how to attach an AKS and Azure Arc-enabled Kubernetes cluster, and use it as a compute target with managed identity enabled.

**AKS cluster**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name k8s-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerService/managedclusters/<cluster-name>" --identity-type SystemAssigned --namespace <Kubernetes namespace to run AzureML workloads> --no-wait
```

**Arc Kubernetes cluster**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>" --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

Set the `--type` argument to `Kubernetes`. Use the `identity_type` argument to enable `SystemAssigned` or `UserAssigned` managed identities.

> [!IMPORTANT]
> `--user-assigned-identities` is only required for `UserAssigned` managed identities. Although you can provide a list of comma-separated user managed identities, only the first one is used when you attach your cluster.
>
> Compute attach won't create the Kubernetes namespace automatically or validate whether the kubernetes namespace existed. You need to verify that the specified namespace exists in your cluster, otherwise, any AzureML workloads submitted to this compute will fail.  

### [Studio](#tab/studio)

Attaching a Kubernetes cluster makes it available to your workspace for training or inferencing.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Attached computes** tab.
1. Select **+New > Kubernetes**

   :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/attach-kubernetes-cluster.png" alt-text="Screenshot of settings for Kubernetes cluster to make available in your workspace.":::

1. Enter a compute name and select your Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified Kubernetes namespace in the cluster. Compute attach won't create the Kubernetes namespace automatically or validate whether the kubernetes namespace exists. You need to verify that the specified namespace exists in your cluster, otherwise, any AzureML workloads submitted to this compute will fail.  

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. For more information, see the [Assign managed identity](#assign-managed-identity-to-the-compute-target) section of this article.

    :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/configure-kubernetes-cluster-2.png" alt-text="Screenshot of settings for developer configuration of Kubernetes cluster.":::

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/provision-resources.png" alt-text="Screenshot of attached settings for configuration of Kubernetes cluster.":::
   
---

## Assign managed identity to the compute target

A common challenge for developers is the management of secrets and credentials used to secure communication between different components of a solution. [Managed identities](../active-directory/managed-identities-azure-resources/overview.md) eliminate the need for developers to manage credentials.

To access Azure Container Registry (ACR) for a Docker image, and a Storage Account for training data, attach Kubernetes compute with a system-assigned or user-assigned managed identity enabled.

### Assign managed identity
- You can assign a managed identity to the compute in the compute attach step.
- If the compute has already been attached, you can update the settings to use a managed identity in Azure Machine Learning studio.
    - Go to [Azure Machine Learning studio](https://ml.azure.com). Select __Compute__, __Attached compute__, and select your attached compute.
    - Select the pencil icon to edit managed identity.

    :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/edit-identity.png" alt-text="Screenshot of updating identity of the Kubernetes compute from Azure portal.":::
    
    :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/update-identity-2.png" alt-text="Screenshot of selecting identity of the Kubernetes compute from Azure portal.":::
     


### Assign Azure roles to managed identity
Azure offers a couple of ways to assign roles to a managed identity.
- [Use Azure portal to assign roles](../role-based-access-control/role-assignments-portal.md)
- [Use Azure CLI to assign roles](../role-based-access-control/role-assignments-cli.md)
- [Use Azure PowerShell to assign roles](../role-based-access-control/role-assignments-powershell.md)

If you are using the Azure portal to assign roles and have a **system-assigned managed identity**, **Select User**, **Group Principal** or **Service Principal**, you can search for the identity name by selecting **Select members**. The identity name needs to be formatted as: `<workspace name>/computes/<compute target name>`.

If you have user-assigned managed identity, select **Managed identity** to find the target identity.

You can use Managed Identity to pull images from Azure Container Registry. Grant the __AcrPull__ role to the compute Managed Identity. For more information, see [Azure Container Registry roles and permissions](/azure/container-registry/container-registry-roles).

You can use a managed identity to access Azure Blob:
- For read-only purpose, __Storage Blob Data Reader__ role should be granted to the compute managed identity.
- For read-write purpose, __Storage Blob Data Contributor__ role should be granted to the compute managed identity.

## Next steps

- [Create and manage instance types](./how-to-manage-kubernetes-instance-types.md)
- [AzureML inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure AKS inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)