---
title: Set up Prometheus remote write by using managed identity authentication
description: Learn how to set up remote write in Azure Monitor managed service for Prometheus. Use managed identity authentication to send data from a self-managed Prometheus server running in your Azure Kubernetes Server (AKS) cluster or Azure Arc-enabled Kubernetes cluster. 
author: EdB-MSFT 
ms.topic: conceptual
ms.date: 11/01/2022
---

# Send data to your Azure Monitor workspace from a Prometheus server by using managed identity authentication

This article describes how to set up [remote write](prometheus-remote-write.md) to send data from a self-managed Prometheus server running in your Azure Kubernetes Service (AKS) cluster or Azure Arc-enabled Kubernetes cluster by using managed identity authentication. You either use an existing identity that's created by AKS or [create one of your own](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). Both options are described here.

## Cluster configurations

This article applies to the following cluster configurations:

- An Azure Kubernetes Service cluster
- An Azure Arc-enabled Kubernetes cluster

> [!NOTE]
> For a Kubernetes cluster running in a different cloud or on-premises, see [Send data to your Azure Monitor workspace from a Prometheus server by using Microsoft Entra authentication](prometheus-remote-write-active-directory.md).

## Prerequisites

See the prerequisites that are listed at [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#prerequisites).

## Set up an application to use Microsoft Entra authentication for Prometheus remote write

The process to set up Prometheus remote write for an application by using Microsoft Entra authentication involves completing the following tasks:

1. Locate the AKS node resource group.
1. Get the client ID of the user-assigned managed identity.
1. Assign the Monitoring Metrics Publisher role on the data collection rule to the managed identity.
1. Give the AKS cluster access to the managed identity.
1. Deploy a sidecar container to set up remote write on the Prometheus server.

The tasks are described in the following sections.

### Locate the AKS node resource group

The node resource group of the AKS cluster contains resources that you use in other steps in this process. This resource group has the name `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`. You can locate it from the **Resource groups** menu in the Azure portal. Start by making sure that you can locate this resource group since other steps below will refer to it.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-groups.png" alt-text="Screenshot showing list of resource groups." lightbox="media/prometheus-remote-write-managed-identity/resource-groups.png":::

### Get the client ID of the user-assigned managed identity

You will require the client ID of the identity that you're going to use. Note this value for use in later steps in this process.

Instead of creating your own ID, you can use one of the identities created by AKS, which are listed in [Use a managed identity in Azure Kubernetes Service](../../aks/use-managed-identity.md). This article uses the `Kubelet` identity. The name of this identity is `<AKS-CLUSTER-NAME>-agentpool` and is located in the node resource group of the AKS cluster.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details.png" alt-text="Screenshot showing list of resources in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details.png":::

Click on the `<AKS-CLUSTER-NAME>-agentpool` managed identity and copy the **Client ID** from the **Overview** page. To learn more about managed identity, visit [Managed Identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

:::image type="content" source="media/prometheus-remote-write-managed-identity/client-id.png" alt-text="Screenshot showing client ID on overview page of managed identity." lightbox="media/prometheus-remote-write-managed-identity/client-id.png":::

### Assign the Monitoring Metrics Publisher role on the data collection rule to the managed identity

The managed identity requires the *Monitoring Metrics Publisher* role on the data collection rule associated with your Azure Monitor workspace.

1. From the menu of your Azure Monitor Workspace account, select the **Data collection rule** to open the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png" alt-text="Screenshot showing data collection rule used by Azure Monitor workspace." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png":::

2. Select **Access control (IAM)** in the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png" alt-text="Screenshot showing Access control (IAM) menu item on the data collection rule Overview page." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png":::

3. Select **Add** and then **Add role assignment**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png" alt-text="Screenshot showing adding a role assignment on Access control pages." lightbox="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png":::

4. Select **Monitoring Metrics Publisher** role and select **Next**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/add-role-assignment.png" alt-text="Screenshot showing list of role assignments." lightbox="media/prometheus-remote-write-managed-identity/add-role-assignment.png":::

5. Select **Managed Identity** and then select **Select members**. Choose the subscription the user assigned identity is located in and then select **User-assigned managed identity**. Select the User Assigned Identity that you're going to use and click **Select**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/select-managed-identity.png" alt-text="Screenshot showing selection of managed identity." lightbox="media/prometheus-remote-write-managed-identity/select-managed-identity.png":::

6. Select **Review + assign** to complete the role assignment.

### Give the AKS cluster access to the managed identity

This step isn't required if you're using an AKS identity since it will already have access to the cluster.

> [!IMPORTANT]
> You must have owner/user access administrator access on the cluster.

1. Identify the virtual machine scale sets in the [node resource group](#locate-the-aks-node-resource-group) for your AKS cluster.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png" alt-text="Screenshot showing virtual machine scale sets in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png":::

2. Run the following command in Azure CLI for each virtual machine scale set.

    ```azurecli
    az vmss identity assign -g <AKS-NODE-RESOURCE-GROUP> -n <AKS-VMSS-NAME> --identities <USER-ASSIGNED-IDENTITY-RESOURCE-ID>
    ```

### Deploy a sidecar container to set up remote write on the Prometheus server

1. Copy the following YAML and save it to a file. The YAML uses port 8081 as the listening port. If you use a different port, modify that value in the YAML.

    [!INCLUDE[managed-identity-yaml](../includes/prometheus-sidecar-remote-write-managed-identity-yaml.md)]

1. Replace the following values in the YAML:

    | Value | Description |
    |:---|:---|
    | `<AKS-CLUSTER-NAME>` | The name of your Azure Kubernetes Service (AKS) cluster. |
    | `<CONTAINER-IMAGE-VERSION>` | `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20230906.1`<br> The remote write container image version.   |
    | `<INGESTION-URL>` | The value for **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace. |
    | `<MANAGED-IDENTITY-CLIENT-ID>` | The value for **Client ID** from the **Overview** page for the managed identity |
    | `<CLUSTER-NAME>` | Name of the cluster that Prometheus is running on |

|> [!IMPORTANT]
> For Azure Government cloud, add the following environment variables in the "env" section of the yaml: - name: INGESTION_AAD_AUDIENCE value: `https://monitor.azure.us/`

1. Open Azure Cloud Shell and upload the YAML file.
1. Use Helm to apply the YAML file and update your Prometheus configuration:

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack --namespace <namespace where Prometheus pod resides> 
    ```

## Verification and troubleshooting

See [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Related content

- [Collect Prometheus metrics from an AKS cluster](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote write in Azure Monitor Managed Service for Prometheus](prometheus-remote-write.md)
- [Set up remote write in Azure Monitor managed dervice for Prometheus by using Microsoft Entra authentication](./prometheus-remote-write-active-directory.md)
- [Set up remote write for Azure Monitor managed service for Prometheus by using Microsoft Entra Workload ID (preview) authentication](./prometheus-remote-write-azure-workload-identity.md)
- [Set up remote write for Azure Monitor managed service for Prometheus by using Microsoft Entra pod-managed identity (preview) authentication](./prometheus-remote-write-azure-ad-pod-identity.md)
