---
title: Attach a Kubernetes cluster to Azure Machine Learning workspace
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

# Attach a Kubernetes cluster to Azure Machine Learning workspace

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Once Azure Machine Learning extension is deployed on AKS or Arc Kubernetes cluster, you can attach the Kubernetes cluster to Azure Machine Learning workspace and create compute targets for ML professionals to use. 

## Prerequisites

Attaching a Kubernetes cluster to Azure Machine Learning workspace can flexibly support many different scenarios, such as the shared scenarios with multiple attachments, model training scripts accessing Azure resources, and the authentication configuration of the workspace. But you need to pay attention to the following prerequisites.

#### Multi-attach and workload isolation

**One cluster to one workspace, creating multiple compute targets**
  * For the same Kubernetes cluster, you can attach it to the same workspace multiple times and create multiple compute targets for different projects/teams/workloads.

**One cluster to multiple workspaces**
  * For the same Kubernetes cluster, you can also attach it to multiple workspaces, and the multiple workspaces can share the same Kubernetes cluster.


If you plan to have different compute targets for different projects/teams, you can specify the existed **Kubernetes namespace** in your cluster for the compute target to **isolate workload** among different teams/projects. 

> [!IMPORTANT]
>
> The namespace you plan to specify when attaching the cluster to Azure Machine Learning workspace should be previously created in your cluster.

#### Securely access Azure resource from training script

 If you need to access Azure resource securely from your training script, you can specify a [managed identity](./how-to-identity-based-service-authentication.md) for Kubernetes compute target during attach operation.

#### Attach to workspace with user-assigned managed identity

Azure Machine Learning workspace defaults to having a system-assigned managed identity to access Azure Machine Learning resources. The steps are completed if the system assigned default setting is on. 

Otherwise, if a [user-assigned managed identity is specified in Azure Machine Learning workspace creation](../machine-learning/how-to-identity-based-service-authentication.md#user-assigned-managed-identity), the following role assignments need to be granted to the managed identity manually before attaching the compute.

|Azure resource name |Roles to be assigned|Description|
|--|--|--|
|Azure Relay|Azure Relay Owner|Only applicable for Arc-enabled Kubernetes cluster. Azure Relay isn't created for AKS cluster without Arc connected.|
|Kubernetes - Azure Arc or Azure Kubernetes Service|Reader <br> Kubernetes Extension Contributor <br> Azure Kubernetes Service Cluster Admin |Applicable for both Arc-enabled Kubernetes cluster and AKS cluster.|


> [!TIP]
>
> Azure Relay resource is created during the extension deployment under the same Resource Group as the Arc-enabled Kubernetes cluster.

> [!NOTE]
>
> * If the "Kubernetes Extension Contributor" role permission is not available, the cluster attachment fails with "extension not installed" error.
> * If the "Azure Kubernetes Service Cluster Admin" role permission is not available, the cluster attachment fails with "internal server" error.

## How to attach a Kubernetes cluster to Azure Machine Learning workspace

We support two ways to attach a Kubernetes cluster to Azure Machine Learning workspace, using Azure CLI or studio UI.

### [Azure CLI](#tab/cli)

The following CLI v2 commands show how to attach an AKS and Azure Arc-enabled Kubernetes cluster, and use it as a compute target with managed identity enabled.

**AKS cluster**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name k8s-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerService/managedclusters/<cluster-name>" --identity-type SystemAssigned --namespace <Kubernetes namespace to run Azure Machine Learning workloads> --no-wait
```

**Arc Kubernetes cluster**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>" --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

Set the `--type` argument to `Kubernetes`. Use the `identity_type` argument to enable `SystemAssigned` or `UserAssigned` managed identities.

> [!IMPORTANT]
>
> `--user-assigned-identities` is only required for `UserAssigned` managed identities. Although you can provide a list of comma-separated user managed identities, only the first one is used when you attach your cluster.
>
> Compute attach won't create the Kubernetes namespace automatically or validate whether the kubernetes namespace existed. You need to verify that the specified namespace exists in your cluster, otherwise, any Azure Machine Learning workloads submitted to this compute will fail.  

### [Studio](#tab/studio)

Attaching a Kubernetes cluster makes it available to your workspace for training or inferencing.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Kubernetes clusters** tab.
1. Select **+New > Kubernetes**

   :::image type="content" source="media/how-to-attach-arc-kubernetes/kubernetes-attach.png" alt-text="Screenshot of settings for Kubernetes cluster to make available in your workspace.":::

1. Enter a compute name and select your Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified Kubernetes namespace in the cluster. Compute attach won't create the Kubernetes namespace automatically or validate whether the kubernetes namespace exists. You need to verify that the specified namespace exists in your cluster, otherwise, any Azure Machine Learning workloads submitted to this compute will fail.  

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. For more information, see the [Assign managed identity](#assign-managed-identity-to-the-compute-target) section of this article.

    :::image type="content" source="media/how-to-attach-kubernetes-to-workspace/configure-kubernetes-cluster-2.png" alt-text="Screenshot of settings for developer configuration of Kubernetes cluster.":::

1. Select **Attach**

    In the Kubernetes clusters tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    :::image type="content" source="media/how-to-attach-arc-kubernetes/kubernetes-creating.png" alt-text="Screenshot of attached settings for configuration of Kubernetes cluster.":::

### [Azure SDK](#tab/sdk)

The following python SDK v2 code shows how to attach an AKS and Azure Arc-enabled Kubernetes cluster, and use it as a compute target with managed identity enabled.

**AKS cluster**

```python
from azure.ai.ml import load_compute

# for AKS cluster, the resource_id should be something like '/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerService/managedClusters/<CLUSTER_NAME>''
compute_params = [
    {"name": "<COMPUTE_NAME>"},
    {"type": "kubernetes"},
    {
        "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerService/managedClusters/<CLUSTER_NAME>"
    },
]
k8s_compute = load_compute(source=None, params_override=compute_params)
ml_client.begin_create_or_update(k8s_compute).result()
```

**Arc Kubernetes cluster**

```python
from azure.ai.ml import load_compute

# for arc connected cluster, the resource_id should be something like '/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerService/connectedClusters/<CLUSTER_NAME>''
compute_params = [
    {"name": "<COMPUTE_NAME>"},
    {"type": "kubernetes"},
    {
        "resource_id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerService/connectedClusters/<CLUSTER_NAME>"
    },
]
k8s_compute = load_compute(source=None, params_override=compute_params)
ml_client.begin_create_or_update(k8s_compute).result()

```
   
---

## Assign managed identity to the compute target

A common challenge for developers is the management of secrets and credentials used to secure communication between different components of a solution. [Managed identities](../active-directory/managed-identities-azure-resources/overview.md) eliminate the need for developers to manage credentials.

To access Azure Container Registry (ACR) for a Docker image, and a Storage Account for training data, attach Kubernetes compute with a system-assigned or user-assigned managed identity enabled.

### Assign managed identity
- You can assign a managed identity to the compute in the compute attach step.
- If the compute has already been attached, you can update the settings to use a managed identity in Azure Machine Learning studio.
    - Go to [Azure Machine Learning studio](https://ml.azure.com). Select **Compute**, **Attached compute**, and select your attached compute.
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

You can use Managed Identity to pull images from Azure Container Registry. Grant the **AcrPull** role to the compute Managed Identity. For more information, see [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md).

You can use a managed identity to access Azure Blob:
- For read-only purpose, **Storage Blob Data Reader** role should be granted to the compute managed identity.
- For read-write purpose, **Storage Blob Data Contributor** role should be granted to the compute managed identity.

## Next steps

- [Create and manage instance types](./how-to-manage-kubernetes-instance-types.md)
- [Azure Machine Learning inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure AKS inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)