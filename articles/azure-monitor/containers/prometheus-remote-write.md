---
title: Remote-write in Azure Monitor Managed Service for Prometheus
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster 
author: bwren 
ms.topic: conceptual
ms.date: 11/01/2022
---

# Azure Monitor managed service for Prometheus remote write
Azure Monitor managed service for Prometheus is intended to be a replacement for self managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and to create a centralized view across your clusters. In this case, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into the Azure managed service.

## Architecture
Azure Monitor provides a reverse proxy container (Azure Monitor [side car container](/azure/architecture/patterns/sidecar)) that provides an abstraction for ingesting Prometheus remote write metrics and helps in authenticating packets. The Azure Monitor side car container currently supports User Assigned Identity and Microsoft Entra ID based authentication to ingest Prometheus remote write metrics to Azure Monitor workspace.


## Prerequisites

- You must have self-managed Prometheus running on your AKS cluster. For example, see [Using Azure Kubernetes Service with Grafana and Prometheus](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/using-azure-kubernetes-service-with-grafana-and-prometheus/ba-p/3020459).
- You used [Kube-Prometheus Stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) when you set up Prometheus on your AKS cluster.
- Data for Azure Monitor managed service for Prometheus is stored in an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md). You must [create a new workspace](../essentials/azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace) if you don't already have one.

## Configure remote write
The process for configuring remote write depends on your cluster configuration and the type of authentication that you use.

- **Managed identity** is recommended for Azure Kubernetes service (AKS) and Azure Arc-enabled Kubernetes cluster. See [Azure Monitor managed service for Prometheus remote write - managed identity](prometheus-remote-write-managed-identity.md)
- **Microsoft Entra ID** can be used for Azure Kubernetes service (AKS) and Azure Arc-enabled Kubernetes cluster and is required for Kubernetes cluster running in another cloud or on-premises. See [Azure Monitor managed service for Prometheus remote write - Microsoft Entra ID](prometheus-remote-write-active-directory.md)

> [!NOTE]
> Whether you use Managed Identity or Microsoft Entra ID to enable permissions for ingesting data, these settings take some time to take effect. When following the steps below to verify that the setup is working please allow up to 10-15 minutes for the authorization settings needed to ingest data to complete.

## Verify remote write is working correctly

Use the following methods to verify that Prometheus data is being sent into your Azure Monitor workspace.

### kubectl commands

Use the following command to view your container log. Remote write data is flowing if the output has non-zero value for `avgBytesPerRequest` and `avgRequestDuration`.

```azurecli
kubectl logs <Prometheus-Pod-Name> <Azure-Monitor-Side-Car-Container-Name>
# example: kubectl logs prometheus-prometheus-kube-prometheus-prometheus-0 prom-remotewrite --namespace <namespace>
```

The output from this command should look similar to the following:

```
time="2022-11-02T21:32:59Z" level=info msg="Metric packets published in last 1 minute" avgBytesPerRequest=19713 avgRequestDurationInSec=0.023 failedPublishing=0 successfullyPublished=122
```


### PromQL queries
Use PromQL queries in Grafana and verify that the results return expected data. See [getting Grafana setup with Managed Prometheus](../essentials/prometheus-grafana.md) to configure Grafana 

## Troubleshoot remote write

### No data is flowing
If remote data isn't flowing, run the following command which will indicate the errors if any in the remote write container.

```azurecli
kubectl --namespace <Namespace> describe pod <Prometheus-Pod-Name>
```


### Container keeps restarting
A container regularly restarting is likely due to misconfiguration of the container. Run the following command to view the configuration values set for the container. Verify the configuration values especially `AZURE_CLIENT_ID` and `IDENTITY_TYPE`.

```azureccli
kubectl get pod <Prometheus-Pod-Name> -o json | jq -c  '.spec.containers[] | select( .name | contains("<Azure-Monitor-Side-Car-Container-Name>"))'
```

The output from this command should look similar to the following:

```
{"env":[{"name":"INGESTION_URL","value":"https://my-azure-monitor-workspace.eastus2-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-00000000000000000/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview"},{"name":"LISTENING_PORT","value":"8081"},{"name":"IDENTITY_TYPE","value":"userAssigned"},{"name":"AZURE_CLIENT_ID","value":"00000000-0000-0000-0000-00000000000"}],"image":"mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20221012.2","imagePullPolicy":"Always","name":"prom-remotewrite","ports":[{"containerPort":8081,"name":"rw-port","protocol":"TCP"}],"resources":{},"terminationMessagePath":"/dev/termination-log","terminationMessagePolicy":"File","volumeMounts":[{"mountPath":"/var/run/secrets/kubernetes.io/serviceaccount","name":"kube-api-access-vbr9d","readOnly":true}]}
```

### Hitting your ingestion quota limit
With remote write you will typically get started using the remote write endpoint shown on the Azure Monitor workspace overview page. Behind the scenes, this uses a system Data Collection Rule (DCR) and system Data Collection Endpoint (DCE). These resources have an ingestion limit covered in the [Azure Monitor service limits](../service-limits.md#prometheus-metrics) document. You may hit these limits if you setup remote write for several clusters all sending data into the same endpoint in the same Azure Monitor workspace. If this is the case you can [create additional DCRs and DCEs](https://aka.ms/prometheus/remotewrite/dcrartifacts) and use them to spread out the ingestion loads across a few ingestion endpoints.

The INGESTION-URL uses the following format: 
https\://\<Metrics-Ingestion-URL>/dataCollectionRules/\<DCR-Immutable-ID>/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview 

Metrics-Ingestion-URL: can be obtained by viewing DCE JSON body with API version 2021-09-01-preview or newer. 

DCR-Immutable-ID: can be obtained by viewing DCR JSON body or running the following command in the Azure CLI: 

```azureccli
az monitor data-collection rule show --name "myCollectionRule" --resource-group "myResourceGroup" 
```
  
## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
- [Collect Prometheus metrics from an AKS cluster](../containers/prometheus-metrics-enable.md)
- [Remote-write in Azure Monitor Managed Service for Prometheus using Microsoft Entra ID](./prometheus-remote-write-active-directory.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using Azure Workload Identity (preview)](./prometheus-remote-write-azure-workload-identity.md)
- [Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Entra pod identity (preview)](./prometheus-remote-write-azure-ad-pod-identity.md)
