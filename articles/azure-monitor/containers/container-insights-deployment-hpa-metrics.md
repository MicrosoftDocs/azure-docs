---
title: Deployment and HPA metrics with Container insights | Microsoft Docs
description: This article describes what deployment and HPA metrics are collected with Container insights.
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Deployment and HPA metrics with Container insights

The Container insights integrated agent now collects metrics for deployments and horizontal pod autoscalers (HPAs) starting with agent version *ciprod08072020*.

## Deployment metrics

Container insights automatically starts monitoring deployments by collecting the following metrics at 60-second intervals and storing them in the **InsightMetrics** table.

|Metric name |Metric dimension (tags) |Description |
|------------|------------------------|------------|
|kube_deployment_status_replicas_ready |container.azm.ms/clusterId, container.azm.ms/clusterName, creationTime, deployment, deploymentStrategy, k8sNamespace, spec_replicas, status_replicas_available, status_replicas_updated (status.updatedReplicas) | Total number of ready pods targeted by this deployment (status.readyReplicas). The dimensions of this metric are: <ul> <li> deployment - name of the deployment </li> <li> k8sNamespace - Kubernetes namespace for the deployment </li> <li> deploymentStrategy - Deployment strategy to use to replace pods with new ones (spec.strategy.type)</li><li> creationTime - deployment creation timestamp </li> <li> spec_replicas - Number of desired pods (spec.replicas) </li> <li>status_replicas_available - Total number of available pods (ready for at least minReadySeconds) targeted by this deployment (status.availableReplicas)</li><li>status_replicas_updated - Total number of non-terminated pods targeted by this deployment that have the desired template spec (status.updatedReplicas) </li></ul>|

## HPA metrics

Container insights automatically starts monitoring HPAs by collecting the following metrics at 60-second intervals and storing them in the **InsightMetrics** table.

|Metric name |Metric dimension (tags) |Description |
|------------|------------------------|------------|
|kube_hpa_status_current_replicas |container.azm.ms/clusterId, container.azm.ms/clusterName, creationTime, hpa, k8sNamespace, lastScaleTime, spec_max_replicas, spec_min_replicas, status_desired_replicas, targetKind, targetName | Current number of replicas of pods managed by this autoscaler (status.currentReplicas). The dimensions of this metric are: <ul> <li> hpa - name of the HPA </li> <li> k8sNamespace - Kubernetes namespace for the HPA </li> <li> lastScaleTime - Last time the HPA scaled the number of pods (status.lastScaleTime)</li><li> creationTime - HPA creation timestamp </li> <li> spec_max_replicas - Upper limit for the number of pods that can be set by the autoscaler (spec.maxReplicas) </li> <li> spec_min_replicas - Lower limit for the number of replicas to which the autoscaler can scale down (spec.minReplicas) </li><li>status_desired_replicas - Desired number of replicas of pods managed by this autoscaler (status.desiredReplicas)</li><li>targetKind - Kind of the HPA's target (spec.scaleTargetRef.kind) </li><li>targetName - Name of the HPA's target (spec.scaleTargetRef.name) </li></ul>|

## Deployment and HPA charts

Container insights includes preconfigured charts for the metrics listed earlier in the table as a workbook for every cluster. You can find the deployments and HPA workbook **Deployments & HPA** directly from an Azure Kubernetes Service cluster. On the left pane, select **Workbooks** and select **View Workbooks** from the dropdown list in the insight.

## Next steps

Review [Kube-state metrics in Kubernetes](https://github.com/kubernetes/kube-state-metrics/tree/master/docs) to learn more about Kube-state metrics.