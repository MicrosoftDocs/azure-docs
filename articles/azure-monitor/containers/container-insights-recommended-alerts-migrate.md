---
title: Migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview) 
description: Describes how to migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview) .
ms.topic: conceptual
ms.date: 03/07/2023
ms.reviewer: aul
---

# Migrate from Container insights recommended alerts to Prometheus recommended alert rules (preview) 
Container insights recommended alerts (custom metrics) (preview) will retire on 14 March 2026. If you are using this feature to monitor your Kubernetes cluster and would like to continue proactively identifying issues related to your Kubernetes cluster, transition to Prometheus recommended alert rules (preview) before 14 March 2026.

This guide walks through migrating from Container insights recommended alerts (custom metrics) (preview) to Prometheus recommended alert rules (preview) and retire Container insights recommended alerts (custom metrics) (preview) from  Kubernetes clusters. 

## Configure Prometheus recommended alert rules (preview) 

Follow the steps at [Enable alert rules](container-insights-metric-alerts.md#enable-alert-rules) provides step-by-step instructions to configure Prometheus recommended alert rules (preview). 

## Remove Container insights recommended alerts (custom metrics) (preview) from clusters
Once you have configured Prometheus metric alerts, offboard from Container insights recommended alerts (custom metrics) (preview) to avoid duplicate alerts. Follow the steps at [Disable alert rules](container-insights-metric-alerts.md#disable-alert-rules) to remove Container insights recommended alerts (custom metrics) (preview) feature from your clusters. 


## Next steps

- Read about the [different alert rule types in Azure Monitor](../alerts/alerts-types.md).
- Read about [alerting rule groups in Azure Monitor managed service for Prometheus](../essentials/prometheus-rule-groups.md).
