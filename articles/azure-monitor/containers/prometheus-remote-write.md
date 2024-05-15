---
title: Remote-write in Azure Monitor Managed Service for Prometheus
description: Describes how to configure remote-write to send data from self-managed Prometheus running in your AKS cluster or Azure Arc-enabled Kubernetes cluster 
author: bwren 
ms.topic: conceptual
ms.date: 4/18/2024
---

# Azure Monitor managed service for Prometheus remote write
Azure Monitor managed service for Prometheus is intended to be a replacement for self managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and to create a centralized view across your clusters. In this case, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into the Azure managed service.

## Architecture
Azure Monitor provides a reverse proxy container (Azure Monitor [side car container](/azure/architecture/patterns/sidecar)) that provides an abstraction for ingesting Prometheus remote write metrics and helps in authenticating packets. The Azure Monitor side car container currently supports User Assigned Identity and Microsoft Entra ID based authentication to ingest Prometheus remote write metrics to Azure Monitor workspace.


## Supported versions

- Prometheus versions greater than v2.45 are required for managed identity authentication.
- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 


## Configure remote write

Configuring remote write depends on your cluster configuration and the type of authentication that you use.

- Managed identity is recommended for Azure Kubernetes service (AKS) and Azure Arc-enabled Kubernetes cluster. 
- Microsoft Entra ID can be used for Azure Kubernetes service (AKS) and Azure Arc-enabled Kubernetes cluster and is required for Kubernetes cluster running in another cloud or on-premises. 

See the following articles for more information on how to configure remote write for Kubernetes clusters:

- [Microsoft Entra ID authorization proxy](/azure/azure-monitor/containers/prometheus-authorization-proxy?tabs=remote-write-example)
- [Send Prometheus data from AKS to Azure Monitor by using managed identity authentication](/azure/azure-monitor/containers/prometheus-remote-write-managed-identity)
- [Send Prometheus data from AKS to Azure Monitor by using Microsoft Entra ID authentication](/azure/azure-monitor/containers/prometheus-remote-write-active-directory)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra ID pod-managed identity (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-ad-pod-identity)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra ID Workload ID (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-workload-identity)

## Remote write from Virtual Machines and Virtual Machine Scale sets 

You can send Prometheus data from Virtual Machines and Virtual Machines Scale Sets to Azure Monitor workspaces using remote write. The servers can be Azure-managed or in any other environment. For more information, see [Send Prometheus metrics from Virtual Machines to an Azure Monitor workspace](/azure/azure-monitor/essentials/prometheus-remote-write-virtual-machines).


## Verify remote write is working correctly

Use the following methods to verify that Prometheus data is being sent into your Azure Monitor workspace.

### Kubectl commands

Use the following command to view logs from the side car container. Remote write data is flowing if the output has nonzero value for `avgBytesPerRequest` and `avgRequestDuration`.

```azurecli
kubectl logs <Prometheus-Pod-Name> <Azure-Monitor-Side-Car-Container-Name> --namespace <namespace-where-Prometheus-is-running>
# example: kubectl logs prometheus-prometheus-kube-prometheus-prometheus-0 prom-remotewrite --namespace monitoring
```

The output from this command has the following format:

```
time="2022-11-02T21:32:59Z" level=info msg="Metric packets published in last 1 minute" avgBytesPerRequest=19713 avgRequestDurationInSec=0.023 failedPublishing=0 successfullyPublished=122
```


### Azure Monitor metrics explorer with PromQL

To check if the metrics are flowing to the Azure Monitor workspace, from your Azure Monitor workspace in the Azure portal, select **Metrics**. Use the metrics explorer to query the metrics that you're expecting from the self-managed Prometheus environment. For more information, see [Metrics explorer](/azure/azure-monitor/essentials/metrics-explorer).


### Prometheus explorer in Azure Monitor Workspace

Prometheus Explorer provides a convenient way to interact with Prometheus metrics within your Azure environment, making monitoring and troubleshooting more efficient. To use the Prometheus explorer, from to your Azure Monitor workspace in the Azure portal and select **Prometheus Explorer** to query the metrics that you're expecting from the self-managed Prometheus environment.
For more information, see [Prometheus explorer](/azure/azure-monitor/essentials/prometheus-workbooks).

### Grafana

Use PromQL queries in Grafana and verify that the results return expected data. For more information on configuring Grafana for Azure managed service for Prometheus, see [Use Azure Monitor managed service for Prometheus as data source for Grafana using managed system identity](../essentials/prometheus-grafana.md) 


## Troubleshoot remote write 

If remote data isn't appearing in your Azure Monitor workspace, see [Troubleshoot remote write](../containers/prometheus-remote-write-troubleshooting.md) for common issues and solutions. 


## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
- [Collect Prometheus metrics from an AKS cluster](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
