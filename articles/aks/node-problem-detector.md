---
title:  Node Problem Detector (NPD) in Azure Kubernetes Service (AKS) nodes
description: Learn about how AKS uses Node Problem Detector to expose issues with the node.
ms.topic: conceptual
ms.date: 05/31/2023
---

# Node Problem Detector (NPD) in Azure Kubernetes Service (AKS) nodes

[Node Problem Detector (NPD)](https://github.com/kubernetes/node-problem-detector) is an open source Kubernetes component that detects node-related problems and reports on them. It runs as a systemd serviced on each node in the cluster and collects various metrics and system information, such as CPU usage, disk usage, and network connectivity. When it detects a problem, it generates *events and/or node conditions*. Azure Kubernetes Service (AKS) uses NPD to monitor and manage nodes in a Kubernetes cluster running on the Azure cloud platform. The AKS Linux extension enables NPD by default.

## Node conditions

Node conditions indicate a permanent problem that makes the node unavailable. AKS uses the following node conditions from NPD to expose permanent problems on the node. NPD also emits corresponding Kubernetes events.

|Problem Daemon type| NodeCondition | Reason |  
| --- | --- | --- |
|CustomPluginMonitor| FilesystemCorruptionProblem | FilesystemCorruptionDetected |
|CustomPluginMonitor| KubeletProblem | KubeletIsDown |
|CustomPluginMonitor| ContainerRuntimeProblem | ContainerRuntimeIsDown |
|CustomPluginMonitor| VMEventScheduled | VMEventScheduled |
|CustomPluginMonitor| FrequentUnregisterNetDevice | UnregisterNetDevice|
|CustomPluginMonitor|FrequentKubeletRestart|FrequentKubeletRestart|
|CustomPluginMonitor|FrequentContainerdRestart|FrequentContainerdRestart|
|CustomPluginMonitor|FrequentDockerRestart|FrequentDockerRestart|
|SystemLogMonitor|KernelDeadlock|DockerHung|
|SystemLogMonitor|ReadonlyFilesystem |FilesystemIsReadOnly|

## Events

NPD emits events with relevant information to help you diagnose underlying issues.

|Problem Daemon type| Reason  |
|---|---|
|CustomPluginMonitor|FilesystemCorruptionDetected|
|CustomPluginMonitor|KubeletIsDown|
|CustomPluginMonitor|ContainerRuntimeIsDown|
|CustomPluginMonitor|FreezeScheduled|
|CustomPluginMonitor|RebootScheduled|
|CustomPluginMonitor|RedeployScheduled|
|CustomPluginMonitor|TerminateScheduled|
|CustomPluginMonitor|PreemptScheduled|
|CustomPluginMonitor|DNSProblem|
|CustomPluginMonitor|PodIPProblem|
|SystemLogMonitor|OOMKilling|
|SystemLogMonitor|TaskHung|
|SystemLogMonitor|UnregisterNetDevice|
|SystemLogMonitor| KernelOops|
|SystemLogMonitor| DockerSocketCannotConnect|
|SystemLogMonitor| KubeletRPCDeadlineExceeded|
|SystemLogMonitor|KubeletRPCNoSuchContainer|
|SystemLogMonitor|CNICannotStatFS|
|SystemLogMonitor|PLEGUnhealthy|
|SystemLogMonitor|KubeletStart|
|SystemLogMonitor|DockerStart|
|SystemLogMonitor|ContainerdStart|

In certain instances, AKS automatically cordons and drains the node to minimize disruption to workloads. For more information about the events and actions, see [Node auto-drain](/azure/aks/node-auto-repair#node-auto-drain).

## Check the node conditions and events

* Check the node conditions and events using the `kubectl describe node` command.

    ```azurecli-interactive
    kubectl describe node my-aks-node
    ```

    Your output should look similar to the following example condensed output:

    ```output
    ...
    ...

    Conditions:
      Type                          Status  LastHeartbeatTime                 LastTransitionTime                Reason                          Message
      ----                          ------  -----------------                 ------------------                ------                          -------
      VMEventScheduled              False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   NoVMEventScheduled              VM has no scheduled event
      FrequentContainerdRestart     False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   NoFrequentContainerdRestart     containerd is functioning properly
      FrequentDockerRestart         False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   NoFrequentDockerRestart         docker is functioning properly
      FilesystemCorruptionProblem   False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   FilesystemIsOK                  Filesystem is healthy
      FrequentUnregisterNetDevice   False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   NoFrequentUnregisterNetDevice   node is functioning properly
      ContainerRuntimeProblem       False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:40 +0000   ContainerRuntimeIsUp            container runtime service is up
      KernelDeadlock                False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   KernelHasNoDeadlock             kernel has no deadlock
      FrequentKubeletRestart        False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   NoFrequentKubeletRestart        kubelet is functioning properly
      KubeletProblem                False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   KubeletIsUp                     kubelet service is up
      ReadonlyFilesystem            False   Thu, 01 Jun 2023 19:14:25 +0000   Thu, 01 Jun 2023 03:57:41 +0000   FilesystemIsNotReadOnly         Filesystem is not read-only
      NetworkUnavailable            False   Thu, 01 Jun 2023 03:58:39 +0000   Thu, 01 Jun 2023 03:58:39 +0000   RouteCreated                    RouteController created a route
      MemoryPressure                True    Thu, 01 Jun 2023 19:16:50 +0000   Thu, 01 Jun 2023 19:16:50 +0000   KubeletHasInsufficientMemory    kubelet has insufficient memory available
      DiskPressure                  False   Thu, 01 Jun 2023 19:16:50 +0000   Thu, 01 Jun 2023 03:57:22 +0000   KubeletHasNoDiskPressure        kubelet has no disk pressure
      PIDPressure                   False   Thu, 01 Jun 2023 19:16:50 +0000   Thu, 01 Jun 2023 03:57:22 +0000   KubeletHasSufficientPID         kubelet has sufficient PID available
      Ready                         True    Thu, 01 Jun 2023 19:16:50 +0000   Thu, 01 Jun 2023 03:57:23 +0000   KubeletReady                    kubelet is posting ready status. AppArmor enabled
    ...
    ...
    ...
    Events:
      Type    Reason                   Age                  From     Message
      ----    ------                   ----                 ----     -------
      Normal  NodeHasSufficientMemory  94s (x176 over 15h)  kubelet  Node aks-agentpool-40622340-vmss000009 status is now: NodeHasSufficientMemory
    ```

These events are also available in [Container Insights](/azure/azure-monitor/containers/container-insights-overview) through [KubeEvents](/azure/azure-monitor/reference/tables/kubeevents).

## Metrics

NPD also exposes Prometheus metrics based on the node problems, which you can use for monitoring and alerting. These metrics are exposed on port 20257 of the Node IP and Prometheus can scrape them.

The following example YAML shows a scrape config you can use with the [Azure Managed Prometheus add on as a DaemonSet](/azure/azure-monitor/essentials/prometheus-metrics-scrape-configuration#advanced-setup-configure-custom-prometheus-scrape-jobs-for-the-daemonset):

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: ama-metrics-prometheus-config-node
  namespace: kube-system
data:
  prometheus-config: |-
    global:
      scrape_interval: 1m
    scrape_configs:
    - job_name: node-problem-detector
      scrape_interval: 1m
      scheme: http
      metrics_path: /metrics
      relabel_configs:
      - source_labels: [__metrics_path__]
        regex: (.*)
        target_label: metrics_path
      - source_labels: [__address__]
        replacement: '$NODE_NAME'
        target_label: instance
      static_configs:
      - targets: ['$NODE_IP:20257']
```

The following example shows the scraped metrics:

```output
problem_gauge{reason="UnregisterNetDevice",type="FrequentUnregisterNetDevice"} 0
problem_gauge{reason="VMEventScheduled",type="VMEventScheduled"} 0
```

## Next steps

For more information on NPD, see [kubernetes/node-problem-detector](https://github.com/kubernetes/node-problem-detector).
