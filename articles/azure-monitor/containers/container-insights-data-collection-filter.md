---
title: Configure Container insights data collection using ConfigMap
description: 
ms.topic: conceptual
ms.date: 05/14/2024
ms.reviewer: aul
---

# Filtering data in Container insights

Kubernetes clusters generate a large amount of logging information. You can collect all of this data in Container insights, but since you're charged for the ingestion and retention of this data, this may result in charges for data that you don't use. You can significantly reduce your monitoring cost by filtering out data that you don't need and also by optimizing the configuration of the Log Analytics workspace where you're storing your data.

## Filtering options
There are multiple ways to filter data in Container insights using different methods of configuration. 


| Data | Description | Filtering method |
|:---|:---|:---|
| Container logs | Includes stdout and stderr logs from each monitored cluster. | - Use `[log_collection_settings]` in ConfigMap to either disable collection of stdout/stderr logs or exclude specific namespaces from collection.<br>- Use  |

## ConfigMap

    - [log_collection_settings]
      - enable/disable stdout/stderr
      - exclude specific namespaces for stdout/stderr

## DCR

    - Cost presets
      - Syslog
      - Exlude specific tables
      - 


## Data collected by Container insights

| Table | Contents | Filtering method |
|:---|:---|:---|
| ContainerLog | Contains stdout and stderr logs from each monitored cluster | - Use `[log_collection_settings]` in ConfigMap to either disable collection of stdout/stderr logs or exclude specific namespaces from collection.<br>- Use data collection rules (DCRs) to exclude specific tables from collection. |



## Next steps

- See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to configure data collection using DCR instead of ConfigMap.

