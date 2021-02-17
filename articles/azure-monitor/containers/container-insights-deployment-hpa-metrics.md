---
title: Deployment & HPA metrics with Azure Monitor for containers | Microsoft Docs
description: This article describes what deployment & HPA (Horizontal pod autoscaler) metrics are collected with Azure Monitor for containers.
ms.topic: conceptual
ms.date: 08/09/2020
---

# Deployment & HPA metrics with Azure Monitor for containers

Starting with agent version *ciprod08072020*, Azure monitor for containers-integrated agent now collects metrics for Deployments & HPAs.

## Deployment metrics

Azure Monitor for containers automatically starts monitoring Deployments, by collecting the following metrics at 60 sec intervals and storing them in the **InsightMetrics** table:

|Metric name |Metric dimension (tags) |Description |
|------------|------------------------|------------|
|kube_deployment_status_replicas_ready |container.azm.ms/clusterId, container.azm.ms/clusterName, creationTime, deployment, deploymentStrategy, k8sNamespace, spec_replicas, status_replicas_available, status_replicas_updated (status.updatedReplicas) | Total number of ready pods targeted by this deployment (status.readyReplicas). Below are dimensions of this metric. <ul> <li> deployment - name of the deployment </li> <li> k8sNamespace - Kubernetes namespace for the deployment </li> <li> deploymentStrategy - Deployment strategy to use to replace pods with new ones (spec.strategy.type)</li><li> creationTime - deployment creation timestamp </li> <li> spec_replicas - Number of desired pods (spec.replicas) </li> <li>status_replicas_available - Total number of available pods (ready for at least minReadySeconds) targeted by this deployment (status.availableReplicas)</li><li>status_replicas_updated - Total number of non-terminated pods targeted by this deployment that have the desired template spec (status.updatedReplicas) </li></ul>|

## HPA metrics

Azure Monitor for containers automatically starts monitoring HPAs, by collecting the following metrics at 60 sec intervals and storing them in the **InsightMetrics** table:

|Metric name |Metric dimension (tags) |Description |
|------------|------------------------|------------|
|kube_hpa_status_current_replicas |container.azm.ms/clusterId, container.azm.ms/clusterName, creationTime, hpa, k8sNamespace, lastScaleTime, spec_max_replicas, spec_min_replicas, status_desired_replicas, targetKind, targetName | Current number of replicas of pods managed by this autoscaler (status.currentReplicas). Below are dimensions of this metric. <ul> <li> hpa - name of the HPA </li> <li> k8sNamespace - Kubernetes namespace for the HPA </li> <li> lastScaleTime - Last time the HPA scaled the number of pods (status.lastScaleTime)</li><li> creationTime - HPA creation timestamp </li> <li> spec_max_replicas - Upper limit for the number of pods that can be set by the autoscaler (spec.maxReplicas) </li> <li> spec_min_replicas - Lower limit for the number of replicas to which the autoscaler can scale down (spec.minReplicas) </li><li>status_desired_replicas - Desired number of replicas of pods managed by this autoscaler (status.desiredReplicas)</li><li>targetKind - Kind of the HPA's target(spec.scaleTargetRef.kind) </li><li>targetName - Name of the HPA's target (spec.scaleTargetRef.name) </li></ul>|

## Deployment & HPA charts 

Azure Monitor for containers includes pre-configured charts for the metrics listed earlier in the table as a workbook for every cluster. You can find the deployments & HPA workbook **Deployments & HPA** directly from an AKS cluster by selecting **Workbooks** from the left-hand pane, and from the **View Workbooks** drop-down list in the Insight.

## Next steps

- Review [Kube-state metrics in Kubernetes](https://github.com/kubernetes/kube-state-metrics/tree/master/docs) to learn more about Kube-state metrics.