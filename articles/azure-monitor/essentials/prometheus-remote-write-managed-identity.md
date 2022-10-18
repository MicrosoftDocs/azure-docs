---
title: Remote-write in Azure Monitor Managed Service for Prometheus (preview)
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. 
author: bwren 
ms.topic: conceptual
ms.date: 10/17/2022
---

# Azure Monitor managed service for Prometheus remote write - managed identity (preview)
Azure Monitor managed service for Prometheus is intended to be a replacement for self managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and to create a centralized view across your clusters. In this case, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into our managed service.

This article describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. You either use an existing identity created by AKS or create one of your own. Both options are described here.

## Architecture
Azure Monitor provides a reverse proxy container (Azure Monitor side car container) that provides an abstraction for ingesting Prometheus remote write metrics and helps in authenticating packets. The Azure Monitor side car container currently supports User Assigned Identity and Azure Active Directory (Azure AD) based authentication to ingest Prometheus remote write metrics to Azure Monitor workspace. Certificates required for Azure AD based authentication are downloaded to the local mount on your cluster by the [CSI driver](../../aks/csi-secrets-store-driver.md).


## Cluster configurations
This article applies to the following cluster configurations:

- Azure Kubernetes service (AKS)
- Azure Arc-enabled Kubernetes cluster

## Prerequisites

- You must have self-managed Prometheus running on your AKS cluster.


## Create Azure Monitor workspace
Data for Azure Monitor managed service for Prometheus is stored in an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md). You must [create a new workspace](../essentials/azure-monitor-workspace-overview.md#create-an-azure-monitor-workspace) if you don't already have one.


## Locate AKS node resource group
The node resource group of the AKS contains resources that you will require for other steps in this process. This resource group has the name `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`. You can locate it from the **Resource groups** menu in the Azure portal. Start by making sure that you can locate this resource group since other steps below will refer to it.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-groups.png" alt-text="Screenshot showing list of resource groups." lightbox="media/prometheus-remote-write-managed-identity/resource-groups.png":::

## Get the client ID of the user assigned identity
You will require the client ID of the identity that you're going to use. Note this value for use in later steps in this process.

### [AKS identity](#tab/aks)
The identities created by AKS are listed in [Use a managed identity in Azure Kubernetes Service](../../aks/use-managed-identity.md). This procedure will use the `Kubelet` identity. The name of this identity will be `<AKS-CLUSTER-NAME>-agentpool` and located in the node resource group of the AKS cluster. 

1. From the **Resource groups** menu in the Azure portal, locate the resource group `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/resource-groups.png" alt-text="Screenshot showing list of resource groups." lightbox="media/prometheus-remote-write-managed-identity/resource-groups.png":::

2. From the list of resources in the resource group, locate the Managed Identity with the name `<AKS-CLUSTER-NAME>-agentpool`.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details.png" alt-text="Screenshot showing list of resources in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details.png":::

3. Note the **Client ID** on the **Overview** page of the managed identity.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/client-id.png" alt-text="Screenshot showing client ID on overview page of managed identity." lightbox="media/prometheus-remote-write-managed-identity/client-id.png":::

### [Own identity](#tab/own)

1. Note the **Client ID** on the **Overview** page of the managed identity.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/client-id.png" alt-text="Screenshot showing client ID on overview page of managed identity." lightbox="media/prometheus-remote-write-managed-identity/client-id.png":::

---

## Add Monitoring Metrics Publisher role assignment to the data collection rule
The data collection rule associated with your Azure Monitor workspace requires the *Monitoring Metrics Publisher* role.

1. From the menu of your Azure Monitor Workspace account, click the **Data collection rule** to open the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png" alt-text="Screenshot showing data collection rule used by Azure Monitor workspace." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png":::

2. Click on **Access control (IAM)** in the **Overview** page for the data collection rule.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png" alt-text="Screenshot showing Access control (IAM) menu item on the data collection rule Overview page." lightbox="media/prometheus-remote-write-managed-identity/azure-monitor-account-access-control.png":::

3. Click **Add** and then **Add role assignment**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png" alt-text="Screenshot showing adding a role assignment on Access control pages." lightbox="media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png":::

4. Select **Monitoring Metrics Publisher** role and click **Next**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/add-role-assignment.png" alt-text="Screenshot showing list of role assignments." lightbox="media/prometheus-remote-write-managed-identity/add-role-assignment.png":::

5. Select **Managed Identity** and then click **Select members**. Choose the subscription the user assigned identity is located in and then select **User-assigned managed identity**. Select the User Assigned Identity that you're going to use and click **Select**.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/select-managed-identity.png" alt-text="Screenshot showing selection of managed identity." lightbox="media/prometheus-remote-write-managed-identity/select-managed-identity.png":::

6. Click **Review + assign** to complete the role assignment.


## Grant AKS cluster access to the identity

### [AKS identity](#tab/aks)

This step isn't required if you're using an AKS identity. This identity already has access to the cluster.
### [Own identity](#tab/own)


> [!IMPORTANT]
> You must have owner/user access administrator access on the cluster.

1. Identify the virtual machine scale sets in the node resource group for your AKS cluster.

    :::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png" alt-text="Screenshot showing virtual machine scale sets in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png":::

2. Run the following command in Azure CLI for each virtual machine scale set.

    ```azurecli
    az vmss identity assign -g <AKS-NODE-RESOURCE-GROUP> -n <AKS-VMSS-NAME> --identities <USER-ASSIGNED-IDENTITY-RESOURCE-ID>
    ```

---

## Deploy Side car and configure remote write on the Prometheus server

1. Copy the YAML below and save to a file, replacing the following values. This YAML assumes you're using 8081 as your listening port. Modify that value if you use a different port.

    `<AKS-CLUSTER-NAME>`: Name of your AKS cluster
    `<CONTAINER-IMAGE-VERSION>`: `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20221012.2`. This is the remote write container image version.
    `<INGESTION-URL>`: **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace.
    `<MANAGED-IDENTITY-CLIENT-ID>`: - **Client ID** from the **Overview** page for the managed identity
    `<CLUSTER-NAME>`: Name of the cluster Prometheus is running on

    ```yml
    prometheus: 
    prometheusSpec: 
        externalLabels: 
        cluster: <AKS-CLUSTER-NAME> 
    
        remoteWrite: 
        - url: "http://localhost:8081/api/v1/write" 
    
        containers: 
        - name: prom-remotewrite 
        Image <CONTAINER-IMAGE-VERSION> 
        imagePullPolicy: Always 
        
        ports: 
            - name: rw-port 
            containerPort: 8081 
    livenessProbe: 
    httpGet: 
        path: /health 
        port: rw-port 
    readinessProbe: 
    httpGet: 
        path: /ready 
        port: rw-port 
    resources: 
    limits: 
    cpu: 500mc 
    memory: 200Mi 
    requests: 
    cpu: 350mc 
    memory: 150Mi 
        env: 
            - name: INGESTION_URL 
            value: “<INGESTION-URL>" 
            - name: LISTENING_PORT 
            value: "8081" 
            - name: IDENTITY_TYPE 
            value: "userAssigned"       
            - name: AZURE_CLIENT_ID 
            value: "<MANAGED-IDENTITY-CLIENT-ID>" 
    # Optional parameters 
    - name: CLUSTER 
    value: “<CLUSTER-NAME>” 
    ```

2. Open Azure Cloud Shell and upload the YAML file.
3. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands. This assumes you used Kube-Prometheus Stack when you setup Prometheus on your AKS cluster. 

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```



## Next steps

- [Use preconfigured alert rules for your Kubernetes cluster](../containers/container-insights-metric-alerts.md).
- [Learn more about the Azure alerts](../alerts/alerts-types.md).
- [Prometheus documentation for recording rules](https://aka.ms/azureprometheus-promio-recrules).
- [Prometheus documentation for alerting rules](https://aka.ms/azureprometheus-promio-alertrules).
