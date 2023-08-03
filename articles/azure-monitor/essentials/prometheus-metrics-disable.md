---
title: Disable collecting Prometheus metrics on an Azure Kubernetes Service cluster
description: Disable the collection of Prometheus metrics from an Azure Kubernetes Service cluster and remove the agent from the cluster nodes.
author: EdB-MSFT
ms.author: edbaynash
ms.custom: references_regions
ms.topic: conceptual
ms.date: 07/30/2023
ms.reviewer: aul
---

# Disable Prometheus metrics collection from an AKS cluster

Currently, the Azure CLI is the only option to remove the metrics add-on from your AKS cluster, and stop sending Prometheus metrics to Azure Monitor managed service for Prometheus.  

The `az aks update --disable-azure-monitor-metrics` command:

+ Removes the agent from the cluster nodes. 
+ Deletes the recording rules created for that cluster.  
+ Deletes the data collection endpoint (DCE).  
+ Deletes the data collection rule (DCR).
+ Deletes the DCRA and recording rules groups created as part of onboarding.

> [!NOTE]
> This action doesn't remove any existing data stored in your Azure Monitor workspace.

```azurecli
az aks update --disable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group>
```

## Next steps

- [See the default configuration for Prometheus metrics](./prometheus-metrics-scrape-default.md)
- [Customize Prometheus metric scraping for the cluster](./prometheus-metrics-scrape-configuration.md)
- [Use Azure Monitor managed service for Prometheus as the data source for Grafana](./prometheus-grafana.md)
- [Configure self-hosted Grafana to use Azure Monitor managed service for Prometheus](./prometheus-self-managed-grafana-azure-active-directory.md)
