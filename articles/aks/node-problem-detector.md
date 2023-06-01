---
title:  Node Problem Detector(NPD) in Azure Kubernetes Service (AKS) nodes
description: Learn about how AKS uses Node Problem detector to expose issues with the node
ms.topic: conceptual
ms.date: 05/31/2023
---

## Node Problem Detector(NPD)

[Node Problem Detector (NPD)](https://github.com/kubernetes/node-problem-detector) is a Kubernetes add-on that detects node-related problems and reports them as Kubernetes events. It runs as a DaemonSet on each node in the cluster and collects various metrics and system information, such as CPU usage, disk usage, and network connectivity. When it detects a problem, it generates an Events and/or Node Conditions. NPD is used in AKS (Azure Kubernetes Service) to monitor and manage nodes in a Kubernetes cluster running on the Azure cloud platform. NPD is enabled by default as part of the AKS Linux Extension


## Node Conditions
AKS uses the following Node conditions from NPD to expose permanent problems on the node. In addition to these node conditions, corresponding kubernetes events are also emitted. Node conditions indiate a permanent problem that makes the node unavailable

| NodeCondition | Reason |  
| --- | --- | 
| FilesystemCorruptionProblem | FilesystemCorruptionDetected |
| KubeletProblem | KubeletIsDown |
| ContainerRuntimeProblem | ContainerRuntimeIsDown |
| VMEventScheduled | VMEventScheduled |
| FrequentUnregisterNetDevice | UnregisterNetDevice|
|FrequentKubeletRestart|FrequentKubeletRestart|
|FrequentContainerdRestart|FrequentContainerdRestart|
|FrequentDockerRestart|FrequentDockerRestart|
|KernelDeadlock|DockerHung|
|ReadonlyFilesystem |FilesystemIsReadOnly|

## Events 
In few temporary scenarios, |Events are emitted with relevant information to be able to diagnose the underlying issue

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

## Check the node conditions and events
 ```azurecli-interactive
    kubectl describe node aks-node
```
