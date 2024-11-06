---
title: Get started with Azure Operator Service Manager cluster registry
description: Azure Operator Service Manager cluster registry provides a locally resilent edge registry service to host Nexus K8s container image artifacts.
author: msftadam
ms.author: adamdor
ms.date: 10/31/2024
ms.topic: get-started
ms.service: azure-operator-service-manager
---

# Get started with cluster registry
Improve resiliency for cloud native network functions with Azure Operator Service Manager (AOSM) cluster registry (CR)

## Document history
* Created & First Published: July 26, 2024
* Updated for HA: October 16, 2024
* Updated for GC: November 5, 2024

## Feature dependencies
This feature requires the following minimum environment:
* Minimum AOSM ARM API Version: 2023-09-01
* First version, no high availability (HA) for Network Function (NF) kubernetes extension: 1.0.2711-7
* First version, with HA for NF kubernetes extension: 2.0.2810-144
* First version, with GC for NF kubernetes extension: 2.0.2860-160

## Cluster registry overview
Azure Operator Service Manager (AOSM) cluster registry (CR) enables a local copy of container images in the Nexus K8s cluster. When the containerized network function (CNF) is installed with cluster registry enabled, the container images are pulled from the remote AOSM artifact store and saved to this local cluster registry. Using a mutating webhook, cluster registry automatically intercepts image requests and substitutes the local registry path, to avoid publisher packaging changes. With cluster register, CNF access to container images survives loss of connectivity to the remote artifact store.

### Key use cases and benefits
Cloud native network functions (CNF) need access to container images, not only during the initial deployment using AOSM artifact store, but also to keep the network function operational. Some of these scenarios include:
* Pod restarts: Stopping and starting a pod can result in a cluster node pulling container images from the registry.
* Kubernetes scheduler operations: During pod to node assignments, according to scheduler profile rules, if the new node does not have the container images locally cached, the node pulls container images from the registry.

Benefits of using AOSM cluster registry:
* Provides the necessary local images to prevent CNF disruption where connectivity to AOSM artifact store is lost.
* Decreases the number of image pulls on AOSM artifact store, since each cluster node now pulls images only from the local registry.
* Overcomes issues with malformed registry URLs, by using a mutating webhook to substitute the proper local registry URL path.

## How cluster registry works
AOSM cluster registry is enabled using the Network Function Operator (NFO) Arc K8s extension. The following CLI shows how cluster registry is enabled on a Nexus K8s cluster.
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
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence=]
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold=]
                        [--version]
```
When the cluster registry feature is enabled in the Network Function Operator Arc K8s extension, any container images deployed from AOSM artifact store are accessible locally in the Nexus K8s cluster. The user can choose the persistent storage size for the cluster registry. 

> [!NOTE]
> If the user doesn't provide any input, a default persistent volume of 100 GB is used.

### Cluster registry components
The cluster registry feature deploys helper pods on the target edge cluster to assist the NFO extension.

#### Component reconciler
* This main pod takes care of reconciling component Custom Resource Objects (CROs) created by K8sBridge with the help of the Microsoft.Kubernetes resource provider (RP), Hybrid Relay, and Arc agent running on the cluster.

#### Pod mutating webhook
* These pods implement Kubernetes mutating admission webhooks, serving an instance of the mutate API. The mutate API does two things:
  * It modifies the image registry path to the local registry IP, substituting out the AOSM artifact store Azure container registry (ACR).
  * It creates an Artifact CR on the edge cluster.

#### Artifact reconciler
* This pod reconciles artifact CROs created by the mutating webhook.

#### Registry
* This pod stores and retrieves container images for CNF.

### Cluster registry garbage collection
AOSM cluster extension runs a background garbage collection (GC) job to regularly clean up container images. This job will run based on a schedule, check if the cluster registry usage has reached the specified threshold, and if so, initiate the garbage collection process. The job schedule and threshold is configured by the end-user, but by default the job runs once per day at a 0% utilization threshold. 

#### Clean up garbage image manifests
AOSM maintains references between pod owner resource and consuming images in cluster registry. Upon initiating the images cleanup process, images will be identified which are not linked to any pods, issuing a soft delete to remove them from cluster registry. This type of soft delete doesn't immediately free cluster registry storage space. Actual image files removal depends on the CNCF distribution registry garbage collection outlined below.

> [!NOTE]
> The reference between a pod's owner and its container images ensures that AOSM does not mistakenly delete images. For example, if a replicaset pod goes down, AOSM will not dereference the container images. AOSM only dereferences container images when the replicaset is deleted. The same principle applies to pods managed by Kubernetes jobs and daemonsets.

#### CNCF garbage collection distribution
AOSM sets up the cluster registry using open source [CNCF distribution registry](https://distribution.github.io/distribution/). Therefore, AOSM relies on garbage collection capabilities that provided by [Garbage collection | CNCF Distribution](https://distribution.github.io/distribution/about/garbage-collection/#:~:text=About%20garbage%20collection,considerable%20amounts%20of%20disk%20space.). Overall, it follows standard 2 phase “mark and sweep” process to delete image files to free registry storage space.

> [!NOTE]
> This process requires the cluster registry in read-only mode. If images are uploaded when registry not in read-only mode, there is the risk that images layers are mistakenly deleted leading to a corrupted image. Registry requires lock in read-only mode for a duration of up to 1 minute. Consequently, AOSM will defer other NF deployment when cluster registry in read-only mode.

#### Garbage collection configuration parameters
The following parameters configure the schedule and threshold for the garbage collection job.
* global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence
* global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold
* For more configuration details, please refer to the latest [Network function extension installation instructions](manage-network-function-operator.md)

## High availability and resiliency considerations 
The AOSM NF extension relies uses a mutating webhook and edge registry to support key features. 
* Onboarding helm charts without requiring customization of image path.
* A local cluster registry to accelerate pod operations and enable disconnected-moded support.
These essential components need to be highly available and resilient.

### Summary of changes for HA
With HA, cluster registry and webhook pods now support a replicaset with a minimum of three replicas and a maximum of five replicas. The replicaset key configuration is as follows:  
* Gradual rollout upgrade strategy is used.
* PodDisruptionBudgets (PDB) are used for availability during voluntary disruptions.
* Pod Anti-affinity is used to spread pods evenly across nodes.
* Readiness probe are used to make sure pods are ready before serving traffic.
* AOSM workload pods are assigned only to the system node pool.
* Pods scale horizontally under CPU and memory load.

#### Replicas
* A cluster running multiple copies, or replicas, of an application provides the first level of redundancy. Both cluster registry and webhook are defined as 'kind:deployment' with a minimum of three replicas.
#### DeploymentStrategy
* A rollingUpdate strategy is used to help achieve zero downtime upgrades and support gradual rollout of applications. Default maxUnavailable configuration allows only one pod to be taken down at a time, until enough pods are created to satisfying redundancy policy.
#### Pod Disruption Budget
* A policy disruption budget (PDB) protects pods from voluntary disruption and is deployed alongside Deployment, ReplicaSet, or StatefulSet objects. For AOSM operator pods, a PDB with minAvailable parameter of 2 is used.
#### Pod anti-affinity
* Pod anti-affinity controls distribution of application pods across multiple nodes in your cluster. With HA, AOSM pod anti-affinity using the following parameters:
  * A scheduling mode is used to define how strictly the rule is enforced.
    * requiredDuringSchedulingIgnoredDuringExecution(Hard): Pods must be scheduled in a way that satisfies the defined rule. If no topologies that meet the rule's requirements are available, the pod is not scheduled. 
    * preferredDuringSchedulingIgnoredDuringExecution(Soft): This rule type expresses a preference for scheduling pods but doesn't enforce a strict requirement. If topologies that meet the preference criteria are available, Kubernetes schedules the pod. If no such topologies are available, the pod can still be scheduled on other nodes that do not meet the preference. 
  * A Label Selector is used to target specific pods for which the affinity is applied.
  * A Topology Key is used to define the node needs. 
* Nexus node placement is spread evenly across zones by design, so spreading the pods across nodes also gives zonal redundancy.
* AOSM operator pods use a soft anti-affinity with weight 100 and topology key based on node hostnames is used.

#### Storage
* Since AOSM edge registry has multiple replicas which are spread across nodes, the persistent volume must support ReadWriteMany (RWX) access mode. PVC “nexus-shared” volume is available on Nexus clusters and supports RWX access mode.
  
#### Monitoring via Readiness Probes
* AOSM uses http readiness probes to know when a container is ready to start accepting traffic. A pod is considered ready when all containers are ready. When a Pod is not ready, it is removed from the service load balancers. 

#### System node pool
* All AOSM operator pods are assigned to the system node pool. This pool prevents misconfigured or rouge application pods from impacting system pods.

#### Horizontal scaling
* In Kubernetes, a HorizontalPodAutoscaler (HPA) automatically updates a workload resource with the aim of automatically scaling the workload to match demand. AOSM operator pods have the following HPA policy parameters configured;
  * A minimum replica of three.
  * A maximum replica of five.
  * A targetAverageUtilization for cpu and memory of 80%.
  
#### Resource limits
* Resources limits are used to prevent a resource overload on the nodes where AOSM pods are running. AOSM uses two resource parameters to limit both CPU and memory consumption.
  * **Resource request** - The minimum amount that should be reserved for a pod. This value should be set to resource usage under normal load for your application.
  * **Resource limit** - The maximum amount that a pod should ever use, if usage reaches the limit it is terminated.
All AOSM operator containers are configured with appropriate request, limit for CPU and memory.

#### Known HA Limitations
* Nexus AKS (NAKS) clusters with single active node in system agent pool are not suitable for highly available. Nexus production topology must use at least three active nodes in system agent pool.
* The nexus-shared storage class is a network file system (NFS) storage service. This NFS storage service is available per Cloud Service Network (CSN). Any Nexus Kubernetes cluster attached to the CSN can provision persistent volume from this shared storage pool. The storage pool is currently limited to a maximum size of 1 TiB as of Network Cloud (NC) 3.10 where-as NC 3.12 has a 16-TiB option.
* Pod Anti affinity only deals with the initial placement of pods, subsequent pod scaling, and repair, follows standard K8s scheduling logic.

## Frequently Asked Questions
#### Can I use AOSM cluster registry with a CNF application previously deployed?
If there's a CNF application already deployed without cluster registry, the container images are not available automatically. The cluster registry must be enabled before deploying the network function with AOSM.

#### Can I change the storage size after a deployment?
Storage size can't be modified after the initial deployment. We recommend configuring the volume size by 3x to 4x of the starting size.

#### Can I list the files presently stored in the cluster repository?
The following command can be used to list files in a human readable format:
```bash
 kubectl get artifacts -A -o jsonpath='{range .items[*]}{.spec.sourceArtifact}'
```
This command should produce output similar to the following:
```bash
 ppleltestpublisheras2f88b55037.azurecr.io/nginx:1.0.0
```
