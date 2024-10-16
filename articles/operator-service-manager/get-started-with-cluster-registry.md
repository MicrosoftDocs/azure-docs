---
title: Get started with Azure Operator Service Manager cluster registry
description: Azure Operator Service Manager cluster registry provides a locally resilent edge registry service to host Nexus K8s container image artifacts.
author: msftadam
ms.author: adamdor
ms.date: 10/16/2024
ms.topic: get-started
ms.service: azure-operator-service-manager
---

# Get started with cluster registry
* Original Publish Date: July 26, 2024
* Updated for HA: October 16, 2024

## Overview
Improve resiliency for cloud native network functions with Azure Operator Service Manager cluster registry. This feature requires the following minimum environment:
* Minimum AOSM ARM API Version: 2023-09-01
* No HA Minimum AOSM CNF Arc for Kubernetes Extension Build Number: 1.0.2711-7
* With HA Minimum AOSM CNF Arc for Kubernetes Extension Build Number: 2.0.2810-144

## Introduction
Azure Operator Service Manager (AOSM) cluster registry (CR) enables a local copy of container images in the Nexus K8s cluster. When the containerized network function (CNF) is installed with cluster registry enabled, the container images are pulled from the remote AOSM artifact store and saved to a local registry. With cluster register, CNF access to container images survives loss of connectivity to the remote artifact store.

### Key use cases
Cloud native network functions (CNF) need access to container images, not only during the initial deployment using AOSM artifact store, but also to keep the network function operational. Some of these scenarios include:
* Pod restarts: Stopping and starting a pod can result in a cluster node pulling container images from the registry.
* Kubernetes scheduler operations: During pod to node assignments, according to scheduler profile rules, if the new node does not have the container images locally cached, the node pulls container images from the registry.

In the above scenarios, if there's a temporary issue with accessing the AOSM artifact store, the cluster registry provides the necessary container images to prevent disruption to the running CNF. Also, the AOSM cluster registry feature decreases the number of image pull requests on AOSM artifact store since each Nexus K8s node pulls container images from the cluster registry instead of the AOSM artifact store.

## How cluster registry works
AOSM cluster registry is enabled using the Network Function Operator Arc K8s extension. The following CLI shows how cluster registry is enabled on a Nexus K8s cluster.
```bash
az k8s-extension create --cluster-name
                        --cluster-type {connectedClusters}
                        --extension-type {Microsoft.Azure.HybridNetwork}
                        --name
                        --resource-group
                        --scope {cluster}
                        --release-namespace {azurehybridnetwork}
                        --release-train {preview, stable}
                        --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
                        [--auto-upgrade {false, true}]
                        [--config global.networkfunctionextension.enableClusterRegistry={false, true}]
                        [--config global.networkfunctionextension.enableLocalRegistry={false, true}]
                        [--config global.networkfunctionextension.enableEarlyLoading={false,true}]
                        [--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.storageClassName=]
                        [--config global.networkfunctionextension.clusterRegistry.storageSize=]
                        [--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=]
                        [--version]
```
When the cluster registry feature is enabled in the Network Function Operator Arc K8s extension, any container images deployed from AOSM artifact store are accessible locally in the Nexus K8s cluster. The user can choose the persistent storage size for the cluster registry. 

> [!NOTE]
> If the user doesn't provide any input, a default persistent volume of 100 GB is used.

## High availability and resiliency considerations 
The AOSM NF extension relies on the AOSM webhook and edge registry to offer two key features: onboarding helm charts without changes and a local registry on the cluster that speeds up pod creation during scaling and rescheduling and allows disconnection from remote registry. These components are essential for these purposes, and they need to be highly-available and resilient. Here are the design considerations for these aspects of AOSM.

### Summary of changes for HA
For high availability both cluster registry and webhook are configured with at  least 3 replicas and up to 5 replicas (when horizontal auto scaling is enabled). An upgrade strategy of gradual rollout is configured. PodDisruptionBudgets  are used for availability during voluntary disruptions. Pod Anti-affinity is used to spread pods evenly across nodes. Readiness probe is configured for cluster registry to make sure pods are ready before serving traffic. For resiliency AOSM workload pods are assigned to the system node pool. Pods are configured to scale horizontally under CPU and memory load.

#### Replicas
* Running multiple copies(replicas) of an application provides the first level of redundancy for any application. Both edge registry and webhook are defined as kind:deployment with minimum 3 replicas.
#### DeploymentStrategy
* We are using a rollingUpdate strategy which helps with zero downtime upgrade and does gradual rollout of applications, with maxUnavailable as “1” only one pod will be taken down at a time before a new pod of new version is created thereby maintaining enough replicas for redundancy.
#### Pod Disruption Budget
* A PodDisruptionBudget (PDB) protects your pods from voluntary disruption, which can happen if nodes are drained for maintenance or during upgrades. It is deployed beside your Deployment, ReplicaSet or StatefulSet increasing your application’s availability. This is done by specifying either the minAvailable or maxUnavailable setting for a PDB. For AOSM operator pods a PodDisruptionBudget with minAvailable of 2 is used.
#### Pod Anti affinity
* The PodDisruptionBudget guarantees that a certain amount of your application pods is available. A pod anti-affinity guarantees the distribution of the pods across different nodes in your Kubernetes cluster. PodAntiAffinity requires 3 parameters:
  * A scheduling mode that allows you to define how strictly the rule is enforced
    * requiredDuringSchedulingIgnoredDuringExecution(Hard): Pods must be scheduled in a way that satisfies the defined rule. If no topologies that meet the rule's requirements are available, the 
pod will not be scheduled at all. It will remain in a pending state until a suitable node becomes available. Combined with a PDB this can also lead to a deadlock
    * preferredDuringSchedulingIgnoredDuringExecution(Soft): This rule type is more flexible. It expresses a preference for scheduling pods based on the defined rule but doesn't enforce a strict requirement. If topologies that meet the preference criteria are available, Kubernetes will try to schedule the pod there. However, if no such topologies are available, the pod can still be scheduled on other nodes that do not meet the preference. When using this parameter, you also have to pass a weight parameter (a number between 1-100 ,1 being lowest and 100 highest) that defines affinity priority when you specify multiple rules.
  * A Label Selector used to target specific pods for which the affinity will be applied.
  * A Topology Key that defines the key that the node needs to share to define a Topology. You can use any node label for this parameter. Common examples of topology keys are:
    * kuberetes.io/hostname - Pods scheduling is based on node hostnames.
    * kubernetes.io/arch - Pods scheduling is based on node CPU architectures.
    * topology.kubernetes.io/zone - Pods scheduling is based on availability zones.
    * topology.kubernetes.io/region - Pods scheduling is based on node regions.
  * Nexus node placement is spread evenly across zones(racks) by design so spreading the pods across nodes will also give zonal redundancy.( conceptsnexus-kubernetes-placement). For AOSM operator pods a soft anti-affinity with weight 100 and topologyKe based on node hostnames is used
#### Storage
* Since AOSM edge registry has multiple replicas which are spread across  nodes the persistent volume needs to support “ReadWriteMany” access mode (pods from multiple nodes can read and write), we are using “nexusshared” volume which is available on Nexus clusters and supports RWX access mode.
#### Monitoring via Readiness Probes
* The kubelet uses readiness probes to know when a container is ready to start accepting traffic. A Pod is considered ready when all containers are ready. When a Pod is not ready, it is removed from Service load balancers. Cluster registry is configured with readiness probe (http probe) to prevent taking traffic when pod is not ready.
#### System node pool
* All AOSM operator pods are assigned to system node pools which host critical system pods. This prevents misconfigured or rouge application pods from impacting system pods.
#### Horizontal scaling
* In Kubernetes, a HorizontalPodAutoscaler automatically updates a workload resource (such as a Deployment or StatefulSet), with the aim of automatically scaling the workload to match demand. Horizontal scaling means that the response to increased load is to deploy more pods. If the load decreases, and the number of Pods is above the configured minimum, the HorizontalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet, or other similar resource) to scale back down. AOSM operator pods have a HPA configured with minimum replicas of 3 and maximum replicas of 5 with targetAverageUtilization of cpu and memory as 80%.
#### Resource limits
* A very important factor in HA is to not overload the nodes your pods are running on. If you do not take preventative steps, a memory leak in one of your applications for example could bring down your entire production environment. Because there is no way for the Kubernetes scheduler to know how much resource your application is going to use before it is scheduled, you need to provide this information beforehand. If you do not, there is nothing stopping a pod from using all the available resources on a node. There are two pieces of information that must be provided for both CPU and memory:
  * **Resource request** - The minimum amount that should be reserved for a pod. This should be set to resource usage under normal load for your application.
  * **Resource limit** - The maximum amount that a pod should ever use, if usage reaches the limit it will be terminated.
All AOSM operator containers are configured with appropriate request, limit for CPU and memory.
#### Known HA Limitations
* NAKS clusters with single active system agent pool may not be suitable for highly available edge registry and webhook due to single system node crash bringing down all pods at the same time. Recommendation from Nexus for production workloads is to use at least 3 nodes for system agent pool.
* The nexus-shared storage class is backed by an NFS storage service. This NFS storage service is available per Cloud Service Network (CSN). Any Nexus Kubernetes cluster attached to the CSN can provision persistent volume from this shared storage pool. The storage pool is currently limited to a maximum size of 1TiB as of NC 3.10, NC 3.12 will have a 16TiB option.
* Pod Anti affinity only deals with the initial placement of pods and ubsequent pod scaling and repair follows standard k8s scheduling logic.

## Frequently Asked Questions
* Can I use AOSM cluster registry with a CNF application previously deployed?
  * If there's a CNF application already deployed without cluster registry, the container images are not available automatically. The cluster registry must be enabled before deploying the network function with AOSM.
* Can I change the storage size after a deployment?
  * Storage size can't be modified after the initial deployment. We recommend configuring the volume size by 3x to 4x of the starting size.
