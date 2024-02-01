---
title: Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) workloads.
ms.topic: conceptual
ms.date: 01/31/2024
---

# Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)

This article provides best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) workloads. The article is intended for cluster operators and developers who are responsible for deploying and managing applications in AKS.

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

When you create an application in AKS and choose an Azure region during resource creation, it's a single-region app. In the event of a disaster that causes the region to become unavailable, your application also becomes unavailable. If you create an identical deployment in a secondary Azure region, your application becomes less susceptible to a single-region disaster and any data replication across the regions lets you recover your last application state.

For more information, see [Recommended active-active high availability solution overview for AKS](./active-active-solution.md) and [Running Multiple Instances of your Application](https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-intro/).

## Cluster level best practices

### Availability zones

> **Best practice guidance**
>
> Use multiple availability zones to ensure high availability in zone-down scenarios.

[Availability zones](../reliability/availability-zones-overview.md) are separated groups of datacenters within a region. These zones are close enough to have low-latency connections to each other, but far enough apart to reduce the likelihood that more than one zone is affected by local outages or weather. Using availability zones helps your data stay synchronized and accessible in zone-down scenarios. For more information, see [Running in multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/).

### Premium Disks

> **Best practice guidance**
>
> Use Premium Disks to achieve 99.9% availability in one virtual machine (VM).

[Azure Premium Disks](../virtual-machines/disks-types.md#premium-ssd-v2) offer a consistent submillisecond disk latency and high IOPS and throughout. Premium Disks are designed to provide low-latency, high-performance, and consistent disk performance for VMs.

The following example YAML manifest shows a [storage class definition](https://kubernetes.io/docs/concepts/storage/storage-classes/) for a premium disk:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
   name: premium2-disk-sc
parameters:
   cachingMode: None
   skuName: PremiumV2_LRS
   DiskIOPSReadWrite: "4000"
   DiskMBpsReadWrite: "1000"
provisioner: disk.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

For more information, see [Use Azure Premium SSD v2 disks on AKS](./use-premium-v2-disks.md).

### Application dependencies

???

### Cluster autoscaling

> **Best practice guidance**
>
> Use cluster autoscaling to ensure that your cluster can handle increased load and to reduce costs during low load.

To keep up with application demands in AKS, you might need to adjust the number of nodes that run your workloads. The cluster autoscaler component watches for pods in your cluster that can't be scheduled because of resource constraints. When the cluster autoscaler detects issues, it scales up the number of nodes in the node pool to meet the application demand. It also regularly checks nodes for a lack of running pods and scales down the number of nodes as needed. For more information, see [Cluster autoscaling in AKS](./cluster-autoscaler-overview.md).

You can use the `--enable-cluster-autoscaler` parameter when creating an AKS cluster to enable the cluster autoscaler, as shown in the following example:

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --enable-cluster-autoscaler  --min-count 1 --max-count 3
```

You can configure more granular details of the cluster autoscaler by changing the default values in the cluster-wide autoscaler profile.

For more information, see [Use the cluster autoscaler in AKS](./cluster-autoscaler.md).

### Image versions

> **Best practice guidance**
>
> Images shouldn't use the `latest` tag.

Using the `latest` tag for [container images](https://kubernetes.io/docs/concepts/containers/images/) can lead to unpredictable behavior and makes it difficult to track which version of the image is running in your cluster. You can minimize these risks by integrating and running scan and remediation tools in your containers at build and runtime. For more information, see [Best practices for container image management in AKS](./operator-best-practices-container-image-management.md).

AKS provides multiple auto-upgrade channels for node OS image upgrades. You can use these channels to control the timing of upgrades. For more information, see [Auto-upgrade node OS images in AKS](./auto-upgrade-node-os-image.md).

### Standard tier for production workloads

> **Best practice guidance**
>
> Use the standard tier for product workloads for greater cluster reliability and resources, support for up to 5,000 nodes in a cluster, and Uptime SLA enabled by default.

The standard tier for Azure Kubernetes Service (AKS) provides a financially backed 99.9% uptime service-level agreement (SLA) for your production workloads. The standard tier also provides greater cluster reliability and resources, support for up to 5,000 nodes in a cluster, and Uptime SLA enabled by default. For more information, see [Standard pricing tier for AKS cluster management](./free-standard-pricing-tiers.md).

### maxUnavailable

> **Best practice guidance**
>
> Define the maximum number of pods that can be unavailable during a rolling upgrade using the `maxUnavailable` field in your deployment to ensure that a minimum number of pods remain available during the upgrade.

The `maxUnavailable` field specifies the maximum number of pods that can be unavailable during the upgrade process. The value can be an absolute number (for example, *five*) or a percentage of the desired number of pods (for example, *10%*).

The following example deployment manifest uses the `minAvailable` field to set the minimum number of pods that must remain available during voluntary disruptions:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: nginx-deployment
 labels:
   app: nginx
spec:
 replicas: 3
 selector:
   matchLabels:
     app: nginx
 template:
   metadata:
     labels:
       app: nginx
   spec:
     containers:
     - name: nginx
       image: nginx:1.14.2
       ports:
       - containerPort: 80
 strategy:
   type: RollingUpdate
   rollingUpdate:
     maxUnavailable: 1 # Maximum number of pods that can be unavailable during the upgrade
```

For more information, see [Max Unavailable](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-unavailable).

### Accelerated Networking

> **Best practice guidance**
>
> Use Accelerated Networking to provide lower latency, reduced jitter, and decreased CPU utilization on your VMs.

Accelerated Networking enables [single root I/O virtualization (SR-IOV)](/windows-hardware/drivers/network/overview-of-single-root-i-o-virtualization--sr-iov-) on supported VM types, greatly improving networking performance.

The following diagram illustrates how two VMs communicate with and without Accelerated Networking:

:::image type="content" source="../virtual-network/media/create-vm-accelerated-networking/accelerated-networking.png" alt-text="Screenshot that shows communication between Azure VMs with and without Accelerated Networking.":::

For more information, see [Accelerated Networking overview](../virtual-network/accelerated-networking-overview.md).

### Standard Load Balancer

> **Best practice guidance**
>
> Use the Standard Load Balancer to provide greater reliability and resources, support for multiple availability zones, HTTP probes, and functionality across multiple data centers.

In Azure, the [Standard Load Balancer](../load-balancer/skus.md) SKU is designed to be equipped for load balancing network layer traffic when high performance and low latency are needed. The Standard Load Balancer routes traffic within and across regions and to availability zones for high resiliency. The Standard SKU is the recommended and default SKU to use when creating an AKS cluster.

The following example shows a `LoadBalancer` service manifest that uses the Standard Load Balancer:

```yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-ipv4 # Service annotation for an IPv4 address
  name: azure-load-balancer
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-load-balancer
```

For more information, see [Use a standard load balancer in AKS](./load-balancer-standard.md).

### Azure CNI for dynamic IP allocation

> **Best practice guidance**
>
> Configure Azure CNI for dynamic IP allocation for better IP utilization and to prevent IP exhaustion for AKS clusters.

The dynamic IP allocation capability in Azure CNI allocates pod IPs from a subnet separate from the subnet hosting the AKS cluster and offers the following benefits:

* **Better IP utilization**: IPs are dynamically allocated to cluster Pods from the Pod subnet. This leads to better utilization of IPs in the cluster compared to the traditional CNI solution, which does static allocation of IPs for every node.
* **Scalable and flexible**: Node and pod subnets can be scaled independently. A single pod subnet can be shared across multiple node pools of a cluster or across multiple AKS clusters deployed in the same VNet. You can also configure a separate pod subnet for a node pool.  
* **High performance**: Since pod are assigned virtual network IPs, they have direct connectivity to other cluster pod and resources in the VNet. The solution supports very large clusters without any degradation in performance.
* **Separate VNet policies for pods**: Since pods have a separate subnet, you can configure separate VNet policies for them that are different from node policies. This enables many useful scenarios such as allowing internet connectivity only for pods and not for nodes, fixing the source IP for pod in a node pool using an Azure NAT Gateway, and using NSGs to filter traffic between node pools.  
* **Kubernetes network policies**: Both the Azure Network Policies and Calico work with this solution.

For more information, see [Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support](./configure-azure-cni-dynamic-ip-allocation.md).

### Container Insights

> **Best practice guidance**
>
> Enable Container Insights to monitor and diagnose the performance of your containerized applications.

[Container Insights](../azure-monitor/containers/container-insights-overview.md) is a feature of Azure Monitor that collects and analyzes container logs from AKS. You can analyze the collected data with a collection of [views](../azure-monitor/containers/container-insights-analyze.md) and prebuilt [workbooks](../azure-monitor/containers/container-insights-reports.md).

You can enable Container Insights monitoring on your AKS cluster using various methods. The following example shows how to enable Container Insights monitoring on an existing cluswter using the Azure CLI:

```azurecli-interactive
az aks enable-addons -a monitoring --name myAKSCluster --resource-group myResourceGroup
```

For more information, see [Enable monitoring for Kubernetes clusters](../azure-monitor/containers/kubernetes-monitoring-enable.md).

### Scale-down mode

> **Best practice guidance**
>
> Use scale-down mode to control the delete and deallocate behavior of nodes in your AKS cluster upon scaling down.

By default, scale up operations performed manually or by the cluster autoscaler require the allocation and provisioning of new nodes, and scale down operations delete nodes. Scale-down mode allows you to decide whether you want to delete or deallocate the nodes in your AKS clusters upon scaling down.

You can use the `--scale-down-mode` parameter to set the scale-down mode to `Deallocate` or `Delete`, as shown in the following examples:

```azurecli-interactive
# Set the scale-down mode to Deallocate
az aks nodepool add --node-count 20 --scale-down-mode Deallocate --node-osdisk-type Managed --max-pods 10 --name nodepool2 --cluster-name myAKSCluster --resource-group myResourceGroup

# Set the scale-down mode to Delete
az aks nodepool add --enable-cluster-autoscaler --min-count 1 --max-count 10 --max-pods 10 --node-osdisk-type Managed --scale-down-mode Delete --name nodepool3 --cluster-name myAKSCluster --resource-group myResourceGroup
```

For more information, see [Use scale-down mode to delete or deallocate nodes in AKS](./scale-down-mode.md).

### Azure policies

> **Best practice guidance**
>
> Apply and enforce security and compliance requirements for your AKS clusters using Azure policies.

You can apply and enforce built-in security policies on your AKS clusters using [Azure Policy](../governance/policy/overview.md). Azure Policy helps enforce organizational standards and assess compliance at-scale. After you install the [Azure Policy add-on for AKS](/azure/governance/policy/concepts/policy-for-kubernetes), you can apply individual policy definitions or groups of policy definitions called initiatives to your clusters.

For more information, see [Secure your AKS clusters with Azure Policy](./use-azure-policy.md).

### System node pools

#### Do *not* use taints

> **Best practice guidance**
>
> Don't add taints to system node pools to help ensure that system pods can be scheduled on the nodes.

[Taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) allow a node to repel a set of pods. We recommend that you ***don't add taints to system node pools*** to help ensure that system pods can be scheduled on the nodes.

#### Autoscaling for system node pools

> **Best practice guidance**
>
> Configure the autoscaler for system node pools to set minimum and maximum scale limits for the node pool.

Use the autoscaler on node pools to configure the minimum and maximum scale limits for the node pool. For more information, see [Use the cluster autoscaler on node pools](./cluster-autoscaler.md#use-the-cluster-autoscaler-on-node-pools).

#### At least two nodes per system node pool

> **Best practice guidance**
>
> Ensure that system node pools have at least two nodes to ensure resiliency for node-down scenarios.

System node pools are used to run system pods, such as the kube-proxy, coredns, and the Azure CNI plugin. We recommend that you ***ensure that system node pools have at least two nodes*** to ensure resiliency for node-down scenarios. For more information, see [Manage system node pools in AKS](./use-system-pools.md).

### Container images

> **Best practice guidance**
>
> Only use allowed images and authenticated image pulls in your AKS clusters to ensure that your container images are secure and compliant.

[Container images](https://kubernetes.io/docs/concepts/containers/images/) are executable software bundles that can run standalone and that make well-defined assumptions about their runtime environment. It's important to only use allowed images in our AKS clusters to minimize security risks and possible attack vectors.

In AKS, you can secure your containers by scanning for and remediating image vulnerabilities and automatically triggering and redeploying container images when a base image is updated. For more information, see [Best practices for container image management in AKS](./operator-best-practices-container-image-management.md). AKS also offers the Image Integrity feature, which provides a way to validate signed images before deploying them to your clusters. For more information, see [Use Image Integrity to validate signed images before deploying them to your AKS clusters](./image-integrity.md).

### v5 SKU VMs

> **Best practice guidance**
>
> Use v5 SKU VMs for better reliability and less impact of updates.

For system node pools in AKS, use v5 SKU VMs or an equivalent core/memory VM SKU with ephemeral OS disks to provide sufficient compute resources for kube-system pods. For more information, see [Best practices for creating and running AKS clusters at scale](./operator-best-practices-run-at-scale.md) and [Best practices for performance and scaling for large workloads in AKS](./best-practices-performance-scale-large.md).

### Do *not* use B series VMs

> **Best practice guidance**
>
> Don't use B series VMs for AKS clusters because they're low performance and don't work well with AKS.

B series VMs are low performance and don't work well with AKS. Instead, we recommend using [v5 SKU VMs](#v5-sku-vms).

## Next steps

This article focused on best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) clusters. For more best practices, see the following articles:

* [High availability and disaster recovery overview for AKS](./ha-dr-overview.md)
* [Run AKS clusters at scale](./operator-best-practices-run-at-scale.md)
* [Baseline architecture for an AKS cluster](/azure/architecture/reference-architectures/containers/aks/baseline-aks)
