---
title: Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) workloads.
ms.topic: conceptual
ms.date: 01/31/2024
---

# Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)

## Deployment level best practices

### Pod Disruption Budgets (PDBs)

> **Best practice guidance**
>
> Use Pod Disruption Budgets (PDBs) to ensure that a minimum number of pods remain available during *voluntary disruptions*, such as upgrade operations or accidental pod deletions.

[Pod Disruption Budgets (PDBs)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) allow you to define how deployments or replica sets respond during voluntary disruptions, such as upgrade operations or accidental pod deletions. Using PDBs, you can define a minimum or maximum unavailable resource count.

For example, let's say you need to perform a cluster upgrade and already have a PDB defined. Before performing the cluster upgrade, the Kubernetes scheduler ensures that the minimum number of pods defined in the PDB are available. If the upgrade would cause the number of available pods to fall below the minimum defined in the PDS, the scheduler schedules extra pods on other nodes before allowing the upgrade to proceed.

In the following example PDB definition file, the `minAvailable` field sets the minimum number of pods that must remain available during voluntary disruptions:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
   name: mypdb
spec:
   minAvailable: 3 # Minimum number of pods that must remain available
   selector:
    matchLabels:
      app: myapp
```

For more information, see [Plan for availability using PDBs](./operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets) and [Specifying a Disruption Budget for your Application](https://kubernetes.io/docs/tasks/run-application/configure-pdb/).

### Pod CPU and memory limits

> **Best practice guidance**
>
> Set pod CPU and memory limits for all pods to ensure that pods don't consume all resources on a node and to provide protection during service threats, such as DDoS attacks.

Pod CPU and memory limits define the maximum amount of CPU and memory a pod can use. When a pod exceeds its defined limits, it gets marked for removal. For more information, see [CPU resource units in Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) and [Memory resource units in Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory).

Setting CPU and memory limits helps you maintain node health and minimizes impact to other pods on the node. Avoid setting a pod limit higher than your nodes can support. Each AKS node reserves a set amount of CPU and memory for the core Kubernetes components. If you set a pod limit higher than the node can support, your application might try to consume too many resources and negatively impact other pods on the node. Cluster administrators need to set resource quotas on a namespace that requires setting resource requests and limits. For more information, see [Enforce resource quotas in AKS](./operator-best-practices-scheduler.md#enforce-resource-quotas).

In the following example pod definition file, the `resources` section sets the CPU and memory limits for the pod:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
```

For more information, see [Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) and [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/).

### Pod anti-affinity

> **Best practice guidance**
>
> Use pod anti-affinity to ensure that pods are spread across nodes for node-down scenarios.

You can use the `nodeSelector` field in your pod specification to specify the node labels you want the target node to have. Kubernetes only schedules the pod onto nodes that have the specified labels. Anti-affinity expands the types of constraints you can define and gives you more control over the selection logic. Anti-affinity allows you to constrain pods against labels on other pods. For more information, see [Affinity and anti-affinity in Kubernetes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

### Pod anti-affinity across availability zones

> **Best practice guidance**
>
> Use pod anti-affinity across availability zones to ensure that pods are spread across availability zones for zone-down scenarios.

When you deploy your application across multiple availability zones, you can use pod anti-affinity to ensure that pods are spread across availability zones. This practice helps ensure that your application remains available in the event of a zone-down scenario. For more information, see [Best practices for multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/) and [Overview of availability zones for AKS clusters](./availability-zones.md#overview-of-availability-zones-for-aks-clusters).

### Readiness and liveness probes

> **Best practice guidance**
>
> Configure readiness and liveness probes to improve resiliency for high load and lower container restarts.

#### Readiness probes

In Kubernetes, the kubelet uses readiness probes to know when a container is ready to start accepting traffic. A pod is considered *ready* when all of its containers are ready. When a pod is *not ready*, it's removed from service load balancers. For more information, see [Readiness Probes in Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes).

For containerized applications that serve traffic, you should verify that your container is ready to handle incoming requests. [Azure Container Instances](../container-instances/container-instances-overview.md) supports readiness probes to include configurations so that your container can't be accessed under certain conditions.

The following example YAML snipped shows a readiness probe configuration:

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

For more information, see [Configure readiness probes](../container-instances/container-instances-readiness-probe.md).

#### Liveness probes

In Kubernetes, the kubelet uses liveness probes to know when to restart a container. If a container fails its liveness probe, the container is restarted. For more information, see [Liveness Probes in Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

Containerized applications can run for extended periods of time, resulting in broken states in need of repair by restarting the container. [Azure Container Instances](../container-instances/container-instances-overview.md) supports liveness probes to include configurations so that your container can be restarted under certain conditions.

The following example YAML snipped shows a liveness probe configuration:

```yaml
    livenessProbe:
      exec:
        command:
        - cat
        - /tmp/healthy
```

For more information, see [Configure liveness probes](../container-instances/container-instances-liveness-probe.md).

### Pre-stop hooks

> **Best practice guidance**
>
> Use pre-stop hooks to ensure graceful termination during SIGTERM.

A `PreStop` hook is called immediately before a container is terminated due to an API request or management event, such as a liveness probe failure. The pod's termination grace period countdown begins before the `PreStop` hook is executed, so the container will eventually terminate within the termination grace period. For more information, see [Container lifecycle hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks) and [Termination of Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### Multi-replica applications

> **Best practice guidance**
>
> Deploy at least two replicas of your application to ensure high availability and resiliency in node-down scenarios.

When you create an application in AKS  and choose an Azure region during resource creation, it's a single-region app. In the event of a disaster that causes the region to become unavailable, your application also becomes unavailable. If you create an identical deployment in a secondary Azure region, your application becomes less susceptible to a single-region disaster and any data replication across the regions lets you recover your last application state.

For more information, see [Recommended active-active high availability solution overview for AKS](./active-active-solution.md) and [Running Multiple Instances of your Application](https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-intro/).

## Cluster level best practices

### Availability zones

Require at least two for zone-down scenarios.

https://kubernetes.io/docs/setup/best-practices/multiple-zones/

### Premium Disks

Needed to achieve 99.9% availability in one VM.

https://learn.microsoft.com/en-us/azure/aks/use-premium-v2-disks

### Application dependencies

Such as databases, warn customers if they use dependencies that aren't AZ resilient.

### Auto-scale imbalance

Auto scale requires one node pool in each zone to balance load.

https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/
https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

### Image versions

Images shouldn't use the latest tag.

https://kubernetes.io/docs/concepts/containers/images/

### Standard tier for production

Use standard tier for production workloads.

https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers

### maxUnavailable

Minimum number of pods for rolling upgrades.

https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-unavailable

### Accelerated Networking

Provides lower latency, reduced jitter, and decreased CPU utilization on the VMs.

https://learn.microsoft.com/en-us/azure/virtual-network/accelerated-networking-overview?tabs=redhat

### Standard Load Balancer

Supports multiple availability zones, HTTP probes, and it works in multiple data centers.

https://learn.microsoft.com/en-us/azure/aks/load-balancer-standard

### Dynamic IP for Azure CNI

Prevents IP exhaustion for AKS clusters if using Azure CNI.

https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni-dynamic-ip-allocation

### Container insights

Use Prometheus or other tools to track cluster performance.

https://learn.microsoft.com/en-us/azure/azure-monitor/containers/kubernetes-monitoring-enable?tabs=cli

### Scale-down mode

Use scale-down to delete/deallocate nodes.

https://learn.microsoft.com/en-us/azure/aks/scale-down-mode

### Azure policies

Ensures compliance of cluster.

https://learn.microsoft.com/en-us/azure/aks/use-azure-policy

### System node pools

#### Do not use taints

Don't add taints to system node pools.

https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli

#### Autoscaler for system node pools

Use the autoscaler for system node pools.

https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli
https://learn.microsoft.com/en-us/azure/aks/keda-about

#### At least two nodes in system node pools

Ensures resiliency for node-down scenarios.

https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli

### Container images

Only use allowed images.

https://learn.microsoft.com/en-us/azure/aks/operator-best-practices-container-image-management
https://learn.microsoft.com/en-us/azure/aks/image-integrity?tabs=azure-cli

### Image pulls

No unauthenticated image pulls.

https://learn.microsoft.com/en-us/azure/aks/artifact-streaming

### v5 SKU VMs

v4/v5 SKUs have better reliability and less impact of updates.

https://learn.microsoft.com/en-us/azure/aks/best-practices-performance-scale
https://learn.microsoft.com/en-us/azure/aks/best-practices-performance-scale-large
https://learn.microsoft.com/en-us/azure/aks/operator-best-practices-run-at-scale

#### Do not use B series VMs

B series VMs are low performance and don't work well with AKS.
