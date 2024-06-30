---
title: Troubleshooting Remote-write in Azure Monitor Managed Service for Prometheus
description: Describes how to troubleshoot remote-write in Azure Monitor Managed Service for Prometheus
author: EdB-MSFT
ms.service: azure-monitor
ms.subservice: essentials
ms-author: edbaynash
ms.topic: conceptual
ms.date: 4/18/2024

# customer intent: As a user of Azure Monitor Managed Service for Prometheus, I want to troubleshoot remote-write issues so that I can ensure that my data is flowing correctly.
---

# Troubleshoot remote write

This article describes how to troubleshoot remote write in Azure Monitor Managed Service for Prometheus. For more information about remote write, see [Remote write in Azure Monitor Managed Service for Prometheus](./prometheus-remote-write.md). 

## Supported versions

- Prometheus versions greater than v2.45 are required for managed identity authentication.
- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 


##  HTTP 403 error in the Prometheus log

It takes about 30 minutes for the assignment of the role to take effect. During this time, you may see an HTTP 403 error in the Prometheus log. Check that you have configured the managed identity or Microsoft Entra ID application correctly with the `Monitoring Metrics Publisher` role on the workspace's data collection rule. If the configuration is correct, wait 30 minutes for the role assignment to take effect.


## No Kubernetes data is flowing

If remote data isn't flowing, run the following command to find errors in the remote write container.

```azurecli
kubectl --namespace <Namespace> describe pod <Prometheus-Pod-Name>
```


## Container restarts repeatedly

A container regularly restarting is likely due to misconfiguration of the container. Run the following command to view the configuration values set for the container. Verify the configuration values especially `AZURE_CLIENT_ID` and `IDENTITY_TYPE`.

```azureccli
kubectl get pod <Prometheus-Pod-Name> -o json | jq -c  '.spec.containers[] | select( .name | contains("<Azure-Monitor-Side-Car-Container-Name>"))'
```

The output from this command has the following format:

```
{"env":[{"name":"INGESTION_URL","value":"https://my-azure-monitor-workspace.eastus2-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-00000000000000000/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview"},{"name":"LISTENING_PORT","value":"8081"},{"name":"IDENTITY_TYPE","value":"userAssigned"},{"name":"AZURE_CLIENT_ID","value":"00000000-0000-0000-0000-00000000000"}],"image":"mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20221012.2","imagePullPolicy":"Always","name":"prom-remotewrite","ports":[{"containerPort":8081,"name":"rw-port","protocol":"TCP"}],"resources":{},"terminationMessagePath":"/dev/termination-log","terminationMessagePolicy":"File","volumeMounts":[{"mountPath":"/var/run/secrets/kubernetes.io/serviceaccount","name":"kube-api-access-vbr9d","readOnly":true}]}
```


## Ingestion quotas and limits

When configuring Prometheus remote write to send data to an Azure Monitor workspace, you typically begin by using the remote write endpoint displayed on the Azure Monitor workspace overview page. This endpoint involves a system-generated Data Collection Rule (DCR) and Data Collection Endpoint (DCE). These resources have ingestion limits. For more information on ingestion limits, see [Azure Monitor service limits](../service-limits.md#prometheus-metrics). When setting up remote write for multiple clusters sending data to the same endpoint, you might reach these limits. Consider creating additional DCRs and DCEs to distribute the ingestion load across multiple endpoints. This approach helps optimize performance and ensures efficient data handling. For more information about creating DCRs and DCEs, see [how to create custom Data collection endpoint(DCE) and custom Data collection rule(DCR) for an existing Azure monitor workspace(AMW) to ingest Prometheus metrics](https://aka.ms/prometheus/remotewrite/dcrartifacts).
