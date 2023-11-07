---
title: Remote-write in Azure Monitor Managed Service for Prometheus using managed identity
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. 
author: EdB-MSFT 
ms.topic: conceptual
ms.date: 11/01/2022
---

# Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication

This article describes how to configure [remote-write](prometheus-remote-write.md) to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. You either use an existing identity created by AKS or [create one of your own](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). Both options are described here.

## Cluster configurations
This article applies to the following cluster configurations:

- Azure Kubernetes service (AKS)
- Azure Arc-enabled Kubernetes cluster

> [!NOTE]
> For a Kubernetes cluster running in another cloud or on-premises, see [Azure Monitor managed service for Prometheus remote write - Microsoft Entra ID](prometheus-remote-write-active-directory.md).

## Prerequisites
See prerequisites at [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#prerequisites).

## Locate AKS node resource group
The node resource group of the AKS cluster contains resources that you will require for other steps in this process. This resource group has the name `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`. You can locate it from the **Resource groups** menu in the Azure portal. Start by making sure that you can locate this resource group since other steps below will refer to it.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-groups.png" alt-text="Screenshot showing list of resource groups." lightbox="media/prometheus-remote-write-managed-identity/resource-groups.png":::

## Get the client ID of the user assigned identity
You will require the client ID of the identity that you're going to use. Note this value for use in later steps in this process.

Get the **Client ID** from the **Overview** page of your [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

:::image type="content" source="media/prometheus-remote-write-managed-identity/client-id.png" alt-text="Screenshot showing client ID on overview page of managed identity." lightbox="media/prometheus-remote-write-managed-identity/client-id.png":::

Instead of creating your own ID, you can use one of the identities created by AKS, which are listed in [Use a managed identity in Azure Kubernetes Service](../../aks/use-managed-identity.md). This article uses the `Kubelet` identity. The name of this identity is `<AKS-CLUSTER-NAME>-agentpool` and located in the node resource group of the AKS cluster.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details.png" alt-text="Screenshot showing list of resources in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details.png":::



## Assign Monitoring Metrics Publisher role on the data collection rule to the managed identity
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


## Grant AKS cluster access to the identity
This step isn't required if you're using an AKS identity since it will already have access to the cluster.

> [!IMPORTANT]
> You must have owner/user access administrator access on the cluster.

1. Identify the virtual machine scale sets in the [node resource group](#locate-aks-node-resource-group) for your AKS cluster.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png" alt-text="Screenshot showing virtual machine scale sets in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png":::

2. Run the following command in Azure CLI for each virtual machine scale set.

    ```azurecli
    az vmss identity assign -g <AKS-NODE-RESOURCE-GROUP> -n <AKS-VMSS-NAME> --identities <USER-ASSIGNED-IDENTITY-RESOURCE-ID>
    ```


## Deploy Side car and configure remote write on the Prometheus server

1. Copy the YAML below and save to a file. This YAML assumes you're using 8081 as your listening port. Modify that value if you use a different port.

    ```yml
    prometheus:
      prometheusSpec:
        externalLabels:
          cluster: <AKS-CLUSTER-NAME>
    
      ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write    
      remoteWrite:
      - url: 'http://localhost:8081/api/v1/write'
      
      ## Azure Managed Prometheus currently exports some default mixins in Grafana. 
      ## These mixins are compatible with Azure Monitor agent on your Azure Kubernetes Service cluster. 
      ## However, these mixins aren't compatible with Prometheus metrics scraped by the Kube Prometheus stack. 
      ## In order to make these mixins compatible, uncomment remote write relabel configuration below:
      
      ## writeRelabelConfigs:
      ##   - sourceLabels: [metrics_path]
      ##     regex: /metrics/cadvisor
      ##     targetLabel: job
      ##     replacement: cadvisor
      ##     action: replace
      ##   - sourceLabels: [job]
      ##     regex: 'node-exporter'
      ##     targetLabel: job
      ##     replacement: node
      ##     action: replace
      
      containers:
      - name: prom-remotewrite
        image: <CONTAINER-IMAGE-VERSION>
        imagePullPolicy: Always
        ports:
        - name: rw-port
          containerPort: 8081
        livenessProbe:
          httpGet:
            path: /health
            port: rw-port
            initialDelaySeconds: 10
            timeoutSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: rw-port
            initialDelaySeconds: 10
            timeoutSeconds: 10
        env:
        - name: INGESTION_URL
          value: <INGESTION_URL>
        - name: LISTENING_PORT
          value: '8081'
        - name: IDENTITY_TYPE
          value: userAssigned
        - name: AZURE_CLIENT_ID
          value: <MANAGED-IDENTITY-CLIENT-ID>
          # Optional parameter
        - name: CLUSTER
          value: <CLUSTER-NAME>
    ```


2. Replace the following values in the YAML.

    | Value | Description |
    |:---|:---|
    | `<AKS-CLUSTER-NAME>` | Name of your AKS cluster |
    | `<CONTAINER-IMAGE-VERSION>` | `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20230906.1`<br> The remote write container image version.   |
    | `<INGESTION-URL>` | **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace |
    | `<MANAGED-IDENTITY-CLIENT-ID>` | **Client ID** from the **Overview** page for the managed identity |
    | `<CLUSTER-NAME>` | Name of the cluster Prometheus is running on |

    



3. Open Azure Cloud Shell and upload the YAML file.
4. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands. 

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack --namespace <namespace where Prometheus pod resides> 
    ```

## Verification and troubleshooting
See [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Next steps

- [Collect Prometheus metrics from an AKS cluster](../containers/prometheus-metrics-enable.md)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote-write in Azure Monitor Managed Service for Prometheus](prometheus-remote-write.md)
- [Remote-write in Azure Monitor Managed Service for Prometheus using Microsoft Entra ID](./prometheus-remote-write-active-directory.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity (preview)](./prometheus-remote-write-azure-ad-pod-identity.md)
