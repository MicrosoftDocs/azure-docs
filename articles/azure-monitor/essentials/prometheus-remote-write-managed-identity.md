---
title: Remote-write in Azure Monitor Managed Service for Prometheus using managed identity (preview)
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. 
author: bwren 
ms.topic: conceptual
ms.date: 10/20/2022
---

# Azure Monitor managed service for Prometheus remote write - managed identity (preview)
Azure Monitor managed service for Prometheus is intended to be a replacement for self managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and to create a centralized view across your clusters. In this case, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into our managed service.

This article describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster using managed identity authentication. You either use an existing identity created by AKS or [create one of your own](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). Both options are described here.

## Architecture
Azure Monitor provides a reverse proxy container (Azure Monitor side car container) that provides an abstraction for ingesting Prometheus remote write metrics and helps in authenticating packets. The Azure Monitor side car container currently supports User Assigned Identity and Azure Active Directory (Azure AD) based authentication to ingest Prometheus remote write metrics to Azure Monitor workspace.


## Cluster configurations
This article applies to the following cluster configurations:

- Azure Kubernetes service (AKS)
- Azure Arc-enabled Kubernetes cluster

## Prerequisites

- You must have self-managed Prometheus running on your AKS cluster. For example, see [Using Azure Kubernetes Service with Grafana and Prometheus](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/using-azure-kubernetes-service-with-grafana-and-prometheus/ba-p/3020459).
- You used [Kube-Prometheus Stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) when you set up Prometheus on your AKS cluster.


## Create Azure Monitor workspace
Data for Azure Monitor managed service for Prometheus is stored in an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md). You must [create a new workspace](../essentials/azure-monitor-workspace-overview.md#create-an-azure-monitor-workspace) if you don't already have one.


## Locate AKS node resource group
The node resource group of the AKS cluster contains resources that you will require for other steps in this process. This resource group has the name `MC_<AKS-RESOURCE-GROUP>_<AKS-CLUSTER-NAME>_<REGION>`. You can locate it from the **Resource groups** menu in the Azure portal. Start by making sure that you can locate this resource group since other steps below will refer to it.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-groups.png" alt-text="Screenshot showing list of resource groups." lightbox="media/prometheus-remote-write-managed-identity/resource-groups.png":::

## Get the client ID of the user assigned identity
You will require the client ID of the identity that you're going to use. Note this value for use in later steps in this process.

Get the **Client ID** from the **Overview** page of your [managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

:::image type="content" source="media/prometheus-remote-write-managed-identity/client-id.png" alt-text="Screenshot showing client ID on overview page of managed identity." lightbox="media/prometheus-remote-write-managed-identity/client-id.png":::

Instead of creating your own ID, you can use one of the identities created by AKS, which are listed in [Use a managed identity in Azure Kubernetes Service](../../aks/use-managed-identity.md). This article uses the `Kubelet` identity. The name of this identity will be `<AKS-CLUSTER-NAME>-agentpool` and located in the node resource group of the AKS cluster.

:::image type="content" source="media/prometheus-remote-write-managed-identity/resource-group-details.png" alt-text="Screenshot showing list of resources in the node resource group." lightbox="media/prometheus-remote-write-managed-identity/resource-group-details.png":::



## Assign Monitoring Metrics Publisher role on the data collection rule to the managed identity
The managed identity requires the *Monitoring Metrics Publisher* role on the data collection rule associated with your Azure Monitor workspace.

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
        ##
        remoteWrite:
        - url: "http://localhost:8081/api/v1/write"

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
        readinessProbe:
            httpGet:
                path: /ready
                port: rw-port
        env:
            - name: INGESTION_URL
            value: "<INGESTION_URL>"
            - name: LISTENING_PORT
            value: "8081"
            - name: IDENTITY_TYPE
            value: "userAssigned"      
            - name: AZURE_CLIENT_ID
            value: "<MANAGED-IDENTITY-CLIENT-ID>"
            # Optional parameters
            - name: CLUSTER
            value: "<CLUSTER-NAME>"
    ```


2. Replace the following values in the YAML.

    | Value | Description |
    |:---|:---|
    | `<AKS-CLUSTER-NAME>` | Name of your AKS cluster |
    | `<CONTAINER-IMAGE-VERSION>` | `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20221012.2`<br>This is the remote write container image version.   |
    | `<INGESTION-URL>` | **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace |
    | `<MANAGED-IDENTITY-CLIENT-ID>` | **Client ID** from the **Overview** page for the managed identity |
    | `<CLUSTER-NAME>` | Name of the cluster Prometheus is running on |

    



3. Open Azure Cloud Shell and upload the YAML file.
4. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands. 

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```


## Verify remote write is working correctly

You can verify that Prometheus data is being sent into your Azure Monitor workspace in a couple of ways.

1. By viewing your container log using kubectl commands:

    ```azurecli
    kubectl logs <Prometheus-Pod-Name> <Azure-Monitor-Side-Car-Container-Name>
    # example: kubectl logs prometheus-prometheus-kube-prometheus-prometheus-0 prom-remotewrite
     ```
     Expected output: time="2022-10-19T22:11:58Z" level=info msg="Metric packets published in last 1 minute" avgBytesPerRequest=19809 avgRequestDuration=0.17153638698214294 failedPublishingToAll=0 successfullyPublishedToAll=112 successfullyPublishedToSome=0

    You can confirm that the data is flowing via remote write if the above output has non-zero value for “avgBytesPerRequest” and “avgRequestDuration”.

2. By performing PromQL queries on the data and verifying results
    This can be done via Grafana. Refer to our documentation for [getting Grafana setup with Managed Prometheus](prometheus-grafana.md).

## Troubleshooting remote write setup

1.	If the data is not flowing
You can run the following commands to view errors from the container that cause the data not flowing.

    ```azurecli
    kubectl --namespace <Namespace> describe pod <Prometheus-Pod-Name>
     ```   
These logs should indicate the errors if any in the remote write container.

2.	If the container is restarting constantly
This is likely due to misconfiguration of the container. In order to view the configuration values set for the container, run the following command: 
    ```azurecli
    kubectl get po <Prometheus-Pod-Name> -o json | jq -c  '.spec.containers[] | select( .name | contains(" <Azure-Monitor-Side-Car-Container-Name> "))'
     ``` 
Output:
{"env":[{"name":"INGESTION_URL","value":"https://my-azure-monitor-workspace.eastus2-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-00000000000000000/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview"},{"name":"LISTENING_PORT","value":"8081"},{"name":"IDENTITY_TYPE","value":"userAssigned"},{"name":"AZURE_CLIENT_ID","value":"00000000-0000-0000-0000-00000000000"}],"image":"mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20221012.2","imagePullPolicy":"Always","name":"prom-remotewrite","ports":[{"containerPort":8081,"name":"rw-port","protocol":"TCP"}],"resources":{},"terminationMessagePath":"/dev/termination-log","terminationMessagePolicy":"File","volumeMounts":[{"mountPath":"/var/run/secrets/kubernetes.io/serviceaccount","name":"kube-api-access-vbr9d","readOnly":true}]}

Verify the configuration values especially “AZURE_CLIENT_ID” and “IDENTITY_TYPE”

## Next steps

- [Setup Grafana to use Managed Prometheus as a data source](prometheus-grafana.md).
- [Learn more about Azure Monitor managed service for Prometheus](prometheus-metrics-overview.md).
