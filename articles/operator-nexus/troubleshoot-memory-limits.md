---
title: Troubleshoot container memory limits
description: Learn how to troubleshoot Kubernetes container limits.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 11/01/2024
ms.author: matthewernst
author: matternst7258
---

# Troubleshoot container memory limits

Learn about troubleshooting for container memory limits in this article.

## Alerts for memory limits

We recommend that you have alerts set up for the Azure Operator Nexus cluster to look for Kubernetes pods that restart from `OOMKill` errors. These alerts let you know if a component on a server is working appropriately.

The following table lists the metrics that are exposed to identify memory limits.

| Metric name                          | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| Container Restarts                   | `kube_pod_container_status_restarts_total`       |
| Container Status Terminated Reason   | `kube_pod_container_status_terminated_reason`    |
| Container Resource Limits            | `kube_pod_container_resource_limits`             |

The `Container Status Terminated Reason` metric displays the `OOMKill` reason for pods that are affected.

## Identify Out of Memory (OOM) pods

Start by identifying any components that are restarting or show `OOMKill`.

```azcli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl get',arguments:[pods,-n,nc-system]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

When components are identified, a `describe pod` command can determine the status and restart count.

```azcli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl describe',arguments:[pod,<podName>,-n,nc-system]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

At the same time, a `get events` command can provide history so that you can see the frequency of pod restarts.

```azcli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl get',arguments:[events,-n,nc-system,|,grep,<podName>]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

The data from these commands identifies whether a pod is restarting because of `OOMKill`.

## Patch memory limits

Raise a Microsoft support request for all memory limit changes for adjustments and support.

> [!WARNING]
> Patching memory limits to a pod aren't permanent and can be overwritten if the pod restarts.

## Confirm memory limit changes

When memory limits change, the pods should return to the `Ready` state and stop restarting.

Use the following commands to confirm the behavior.

```azcli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl get',arguments:[pods,-n,nc-system]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

```azcli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl describe',arguments:[pod,<podName>,-n,nc-system]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

## Known services susceptible to OOM issues

* cdi-operator
* vulnerability-operator
* cluster-metadata-operator
