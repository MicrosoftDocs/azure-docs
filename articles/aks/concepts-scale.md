---
title: Concepts - Scale applications in Azure Kubernetes Services (AKS)
description: Learn about scaling in Azure Kubernetes Service (AKS), including the horizontal pod autoscaler, cluster autoscaler, and Azure Container Instances.
ms.topic: conceptual
ms.date: 03/18/2024
---

# Scaling options for applications in Azure Kubernetes Service (AKS)

When running applications in Azure Kubernetes Service (AKS), you may need to increase or decrease the amount of compute resources. As you change the number of application instances you have, you may need to change the number of underlying Kubernetes nodes. You also may need to provision a large number of other application instances.

This article introduces core AKS application scaling concepts, including [manually scaling pods or nodes](#manually-scale-pods-or-nodes), using the [Horizontal pod autoscaler](#horizontal-pod-autoscaler), using the [Cluster autoscaler](#cluster-autoscaler), and integrating with [Azure Container Instances (ACI)](#burst-to-azure-container-instances-aci).

## Manually scale pods or nodes

You can manually scale replicas, or pods, and nodes to test how your application responds to a change in available resources and state. Manually scaling resources lets you define a set amount of resources to use to maintain a fixed cost, such as the number of nodes. To manually scale, you define the replica or node count. The Kubernetes API then schedules creating more pods or the draining of nodes based on that replica or node count.

When scaling down nodes, the Kubernetes API calls the relevant Azure Compute API tied to the compute type used by your cluster. For example, for clusters built on Virtual Machine Scale Sets, Virtual Machine Scale Sets API determines which nodes to remove. To learn more about how nodes are selected for removal on scale down, see the [Virtual Machine Scale Sets FAQ](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.yml#if-i-reduce-my-scale-set-capacity-from-20-to-15--which-vms-are-removed-).

To get started with manually scaling nodes, see [manually scale nodes in an AKS cluster][aks-nodes-scale]. To manually scale the number of pods, see [kubectl scale command][kubectl-scale-reference].

## Horizontal pod autoscaler

Kubernetes uses the horizontal pod autoscaler (HPA) to monitor the resource demand and automatically scale the number of pods. By default, the HPA checks the Metrics API every 15 seconds for any required changes in replica count, and the Metrics API retrieves data from the Kubelet every 60 seconds. So, the HPA is updated every 60 seconds. When changes are required, the number of replicas is increased or decreased accordingly. HPA works with AKS clusters that deployed the Metrics Server for Kubernetes version 1.8 and higher.

![Kubernetes horizontal pod autoscaling](media/concepts-scale/horizontal-pod-autoscaling.png)

When you configure the HPA for a given deployment, you define the minimum and maximum number of replicas that can run. You also define the metric to monitor and base any scaling decisions on, such as CPU usage.

To get started with the horizontal pod autoscaler in AKS, see [Autoscale pods in AKS][aks-hpa].

### Cooldown of scaling events

As the HPA is effectively updated every 60 seconds, previous scale events may not have successfully completed before another check is made. This behavior could cause the HPA to change the number of replicas before the previous scale event could receive application workload and the resource demands to adjust accordingly.

To minimize race events, a delay value is set. This value defines how long the HPA must wait after a scale event before another scale event can be triggered. This behavior allows the new replica count to take effect and the Metrics API to reflect the distributed workload. There's [no delay for scale-up events as of Kubernetes 1.12](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-cooldown-delay), however, the default delay on scale down events is *5 minutes*.

## Cluster autoscaler

To respond to changing pod demands, the Kubernetes cluster autoscaler adjusts the number of nodes based on the requested compute resources in the node pool. By default, the cluster autoscaler checks the Metrics API server every 10 seconds for any required changes in node count. If the cluster autoscaler determines that a change is required, the number of nodes in your AKS cluster is increased or decreased accordingly. The cluster autoscaler works with Kubernetes RBAC-enabled AKS clusters that run Kubernetes 1.10.x or higher.

![Kubernetes cluster autoscaler](media/concepts-scale/cluster-autoscaler.png)

The cluster autoscaler is typically used alongside the [horizontal pod autoscaler](#horizontal-pod-autoscaler). When combined, the horizontal pod autoscaler increases or decreases the number of pods based on application demand, and the cluster autoscaler adjusts the number of nodes to run more pods.

To get started with the cluster autoscaler in AKS, see [Cluster autoscaler on AKS][aks-cluster-autoscaler].

### Scale out events

If a node doesn't have sufficient compute resources to run a requested pod, that pod can't progress through the scheduling process. The pod can't start unless more compute resources are available within the node pool.

When the cluster autoscaler notices pods that can't be scheduled because of node pool resource constraints, the number of nodes within the node pool is increased to provide extra compute resources. When the nodes are successfully deployed and available for use within the node pool, the pods are then scheduled to run on them.

If your application needs to scale rapidly, some pods may remain in a state waiting to be scheduled until more nodes deployed by the cluster autoscaler can accept the scheduled pods. For applications that have high burst demands, you can scale with virtual nodes and [Azure Container Instances](#burst-to-azure-container-instances-aci).

### Scale in events

The cluster autoscaler also monitors the pod scheduling status for nodes that haven't recently received new scheduling requests. This scenario indicates the node pool has more compute resources than required, and the number of nodes can be decreased. By default, nodes that pass a threshold for no longer being needed for 10 minutes is scheduled for deletion. When this situation occurs, pods are scheduled to run on other nodes within the node pool, and the cluster autoscaler decreases the number of nodes.

Your applications may experience some disruption as pods are scheduled on different nodes when the cluster autoscaler decreases the number of nodes. To minimize disruption, avoid applications that use a single pod instance.

## Kubernetes Event-driven Autoscaling (KEDA)

[Kubernetes Event-driven Autoscaling][keda-official-documentation] (KEDA) is an open source component for event-driven autoscaling of workloads. It scales workloads dynamically based on the number of events received. KEDA extends Kubernetes with a custom resource definition (CRD), referred to as a *ScaledObject*, to describe how applications should be scaled in response to specific traffic.

KEDA scaling is useful in scenarios where workloads receive bursts of traffic or handle high volumes of data. It is different from Horizontal Pod Autoscaler, as KEDA is event-driven and scales based on the number of events, while HPA is metrics-driven based on the resource utilization (for example, CPU and memory).

To get started with the KEDA add-on in AKS, see [KEDA overview][keda-overview].

## Burst to Azure Container Instances (ACI)

To rapidly scale your AKS cluster, you can integrate with Azure Container Instances (ACI). Kubernetes has built-in components to scale the replica and node count. However, if your application needs to rapidly scale, the [horizontal pod autoscaler](#horizontal-pod-autoscaler) may schedule more pods than can be provided by the existing compute resources in the node pool. If configured, this scenario would then trigger the [cluster autoscaler](#cluster-autoscaler) to deploy more nodes in the node pool, but it may take a few minutes for those nodes to successfully provision and allow the Kubernetes scheduler to run pods on them.

![Kubernetes burst scaling to ACI](media/concepts-scale/burst-scaling.png)

ACI lets you quickly deploy container instances without extra infrastructure overhead. When you connect with AKS, ACI becomes a secured, logical extension of your AKS cluster. The [virtual nodes][virtual-nodes-cli] component, which is based on [virtual Kubelet][virtual-kubelet], is installed in your AKS cluster that presents ACI as a virtual Kubernetes node. Kubernetes can then schedule pods that run as ACI instances through virtual nodes, not as pods on VM nodes directly in your AKS cluster.

Your application requires no modifications to use virtual nodes. Your deployments can scale across AKS and ACI and with no delay as the cluster autoscaler deploys new nodes in your AKS cluster.

Virtual nodes are deployed to another subnet in the same virtual network as your AKS cluster. This virtual network configuration secures the traffic between ACI and AKS. Like an AKS cluster, an ACI instance is a secure, logical compute resource isolated from other users.

## Next steps

To get started with scaling applications, see the following resources:

- Manually scale [pods][kubectl-scale-reference] or [nodes][aks-manually-scale-nodes]
- Use the [horizontal pod autoscaler][aks-hpa]
- Use the [cluster autoscaler][aks-cluster-autoscaler]
- Use the [Kubernetes Event-driven Autoscaling (KEDA) add-on][keda-addon]

For more information on core Kubernetes and AKS concepts, see the following articles:

- [Clusters and workloads][aks-concepts-clusters-workloads]
- [Access and identity][aks-concepts-identity]
- [Security][aks-concepts-security]
- [Virtual networks][aks-concepts-network]
- [Storage][aks-concepts-storage]

<!-- LINKS - external -->
[virtual-kubelet]: https://virtual-kubelet.io/
[kubectl-scale-reference]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/
[keda-official-documentation]: https://keda.sh/docs/2.13/concepts/

<!-- LINKS - internal -->
[aks-hpa]: tutorial-kubernetes-scale.md#autoscale-pods
[aks-nodes-scale]: scale-cluster.md
[aks-manually-scale-nodes]: scale-cluster.md
[aks-cluster-autoscaler]: ./cluster-autoscaler.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-identity]: concepts-identity.md
[aks-concepts-network]: concepts-network.md
[virtual-nodes-cli]: virtual-nodes-cli.md
[keda-overview]: keda-about.md