---
title: Configure data collection and cost optimization in Container insights using data collection rule
description: Describes how you can configure cost optimization and other data collection for Container insights using a data collection rule.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 12/19/2023
ms.reviewer: aul
---

# Configure data collection and cost optimization in Container insights using data collection rule

This article describes how to configure data collection in Container insights using the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) for your Kubernetes cluster. This includes preset configurations for optimizing your costs. A DCR is created when you onboard a cluster to Container insights. This DCR is used by the containerized agent to define data collection for the cluster.

The DCR is primarily used to configure data collection of performance and inventory data and to configure cost optimization.

Specific configuration you can perform with the DCR includes:

- Enable/disable collection and namespace filtering for performance and inventory data.
- Define collection interval for performance and inventory data
- Enable/disable Syslog collection
- Select log schema

> [!IMPORTANT]
> Complete configuration of data collection in Container insights may require editing of both the DCR and the ConfigMap for the cluster since each method allows configuration of a different set of settings. 
> 
> See [Configure data collection in Container insights using ConfigMap](./container-insights-data-collection-configmap.md) for a list of settings and the process to configure data collection using ConfigMap.




## Configure data collection

> [!WARNING]
> The default Container insights experience depends on all the existing data streams. Removing one or more of the default streams makes the Container insights experience unavailable, and you need to use other tools such as Grafana dashboards and log queries to analyze collected data.













## Next steps

- See [Configure data collection in Container insights using ConfigMap](container-insights-data-collection-configmap.md) to configure data collection using ConfigMap instead of the DCR.
