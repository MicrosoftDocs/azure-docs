---
title: Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) workloads.
ms.topic: conceptual
ms.date: 03/11/2024
---

# Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)

This article provides best practices for cluster reliability implemented both at a deployment and cluster level for your Azure kubernetes Service (AKS) workloads. The article is intended for cluster operators and developers who are responsible for deploying and managing applications in AKS.

The best practices in this article are organized into the following categories:

| Category | Best practices |
| -------- | -------------- |
| [Deployment level best practices](#deployment-level-best-practices) | • [Pod Disruption Budgets (PDBs)](#pod-disruption-budgets-pdbs) <br/> • [Pod CPU and memory limits](#pod-cpu-and-memory-limits) <br/> • [Pre-stop hooks](#pre-stop-hooks) <br/> • [maxUnavailable](#maxunavailable) <br/> • [Pod anti-affinity](#pod-anti-affinity) <br/> • [Readiness, liveness, and startup probes](#readiness-liveness-and-startup-probes) <br/> • [Multi-replica applications](#multi-replica-applications) |
| [Cluster and node pool level best practices](#cluster-and-node-pool-level-best-practices) | • [Availability zones](#availability-zones) <br/> • [Cluster autoscaling](#cluster-autoscaling) <br/> • [Standard Load Balancer](#standard-load-balancer) <br/> • [System node pools](#system-node-pools) <br/> • [Accelerated Networking](#accelerated-networking) <br/> • [Image versions](#image-versions) <br/> • [Azure CNI for dynamic IP allocation](#azure-cni-for-dynamic-ip-allocation) <br/> • [v5 SKU VMs](#v5-sku-vms) <br/> • [Do *not* use B series VMs](#do-not-use-b-series-vms) <br/> • [Premium Disks](#premium-disks) <br/> • [Container Insights](#container-insights) <br/> • [Azure Policy](#azure-policy) |

## Deployment level best practices

The following deployment level best practices help ensure high availability and reliability for your AKS workloads. These best practices are local configurations that you can implement in the YAML files for your pods and deployments.

> [!NOTE]
> Make sure you implement these best practices every time you deploy an update to your application. If not, you might experience issues with your application's availability and reliability, such as unintentional application downtime.

### Pod Disruption Budgets (PDBs)

> **Best practice guidance**
>
> Use Pod Disruption Budgets (PDBs) to ensure that a minimum number of pods remain available during *voluntary disruptions*, such as upgrade operations or accidental pod deletions.

[Pod Disruption Budgets (PDBs)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) allow you to define how deployments or replica sets respond during voluntary disruptions, such as upgrade operations or accidental pod deletions. Using PDBs, you can define a minimum or maximum unavailable resource count. PDBs only affect the Eviction API for voluntary disruptions.

For example, let's say you need to perform a cluster upgrade and already have a PDB defined. Before performing the cluster upgrade, the Kubernetes scheduler ensures that the minimum number of pods defined in the PDB are available. If the upgrade would cause the number of available pods to fall below the minimum defined in the PDBs, the scheduler schedules extra pods on other nodes before allowing the upgrade to proceed. If you don't set a PDB, the scheduler doesn't have any constraints on the number of pods that can be unavailable during the upgrade, which can lead to a lack of resources and potential cluster outages.

In the following example PDB definition file, the `minAvailable` field sets the minimum number of pods that must remain available during voluntary disruptions. The value can be an absolute number (for example, *3*) or a percentage of the desired number of pods (for example, *10%*).

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
   name: mypdb
spec:
   minAvailable: 3 # Minimum number of pods that must remain available during voluntary disruptions
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

> [!TIP]
> You can use the `kubectl describe node` command to view the CPU and memory capacity of your nodes, as shown in the following example:
>
> ```bash
> kubectl describe node <node-name>
>
> # Example output
> Capacity:
>  cpu:                8
>  ephemeral-storage:  129886128Ki
>  hugepages-1Gi:      0
>  hugepages-2Mi:      0
>  memory:             32863116Ki
>  pods:               110
> Allocatable:
>  cpu:                7820m
>  ephemeral-storage:  119703055367
>  hugepages-1Gi:      0
>  hugepages-2Mi:      0
>  memory:             28362636Ki
>  pods:               110
> ```

For more information, see [Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) and [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/).

### Pre-stop hooks

> **Best practice guidance**
>
> When applicable, use pre-stop hooks to ensure graceful termination of a container.

A `PreStop` hook is called immediately before a container is terminated due to an API request or management event, such as preemption, resource contention, or a liveness/startup probe failure. A call to the `PreStop` hook fails if the container is already in a terminated or completed state, and the hook must complete before the TERM signal to stop the container is sent. The pod's termination grace period countdown begins before the `PreStop` hook is executed, so the container eventually terminates within the termination grace period.

The following example pod definition file shows how to use a `PreStop` hook to ensure graceful termination of a container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: lifecycle-demo
spec:
  containers:
  - name: lifecycle-demo-container
    image: nginx
    lifecycle:
      postStart:
        exec:
          command: ["/bin/sh", "-c", "echo Hello from the postStart handler > /usr/share/message"]
      preStop:
        exec:
          command: ["/bin/sh","-c","nginx -s quit; while killall -0 nginx; do sleep 1; done"]
```

For more information, see [Container lifecycle hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks) and [Termination of Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### maxUnavailable

> **Best practice guidance**
>
> Define the maximum number of pods that can be unavailable during a rolling update using the `maxUnavailable` field in your deployment to ensure that a minimum number of pods remain available during the upgrade.

The `maxUnavailable` field specifies the maximum number of pods that can be unavailable during the update process. The value can be an absolute number (for example, *3*) or a percentage of the desired number of pods (for example, *10%*). `maxUnavailable` pertains to the Delete API, which is used during rolling updates.

The following example deployment manifest uses the `maxAvailable` field to set the maximum number of pods that can be unavailable during the update process:

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

### Pod anti-affinity

> **Best practice guidance**
>
> Use pod anti-affinity to ensure that pods are spread across nodes for node-down scenarios.

You can use the `nodeSelector` field in your pod specification to specify the node labels you want the target node to have. Kubernetes only schedules the pod onto nodes that have the specified labels. Anti-affinity expands the types of constraints you can define and gives you more control over the selection logic. Anti-affinity allows you to constrain pods against labels on other pods.

The following example pod definition file shows how to use pod anti-affinity to ensure that pods are spread across nodes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multi-zone-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp-container
        image: nginx
        ports:
        - containerPort: 80
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - myapp
            topologyKey: topology.kubernetes.io/zone
```

For more information, see [Affinity and anti-affinity in Kubernetes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

> [!TIP]
> Use pod anti-affinity across availability zones to ensure that pods are spread across availability zones for zone-down scenarios.
>
> You can think of availability zones as backups for your application. If one zone goes down, your application can continue to run in another zone. You use affinity and anti-affinity rules to schedule specific pods on specific nodes. For example, let's say you have a memory/CPU-intensive pod, you might want to schedule it on a larger VM SKU to give the pod the capacity it needs to run.
>
> When you deploy your application across multiple availability zones, you can use pod anti-affinity to ensure that pods are spread across availability zones. This practice helps ensure that your application remains available in the event of a zone-down scenario.
>
> For more information, see [Best practices for multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/) and [Overview of availability zones for AKS clusters](./availability-zones.md#overview-of-availability-zones-for-aks-clusters).

### Readiness, liveness, and startup probes

> **Best practice guidance**
>
> Configure readiness, liveness, and startup probes when applicable to improve resiliency for high loads and lower container restarts.

#### Readiness probes

In Kubernetes, the kubelet uses readiness probes to know when a container is ready to start accepting traffic. A pod is considered *ready* when all of its containers are ready. When a pod is *not ready*, it's removed from service load balancers. For more information, see [Readiness Probes in Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes).

The following example pod definition file shows a readiness probe configuration:

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

The following example pod definition file shows a liveness probe configuration:

```yaml
livenessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
```

Another kind of liveness probe uses an HTTP GET request. The following example pod definition file shows an HTTP GET request liveness probe configuration:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - name: liveness
    image: registry.k8s.io/liveness
    args:
    - /server
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
        httpHeaders:
        - name: Custom-Header
          value: Awesome
      initialDelaySeconds: 3
      periodSeconds: 3
```

For more information, see [Configure liveness probes](../container-instances/container-instances-liveness-probe.md) and [Define a liveness HTTP request](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-http-request).

#### Startup probes

In Kubernetes, the kubelet uses startup probes to know when a container application has started. When you configure a startup probe, readiness and liveness probes don't start until the startup probe succeeds, ensuring the readiness and liveness probes don't interfere with application startup. For more information, see [Startup Probes in Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes).

The following example pod definition file shows a startup probe configuration:

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

### Multi-replica applications

> **Best practice guidance**
>
> Deploy at least two replicas of your application to ensure high availability and resiliency in node-down scenarios.

In Kubernetes, you can use the `replicas` field in your deployment to specify the number of pods you want to run. Running multiple instances of your application helps ensure high availability and resiliency in node-down scenarios. If you have [availability zones](#availability-zones) enabled, you can use the `replicas` field to specify the number of pods you want to run across multiple availability zones.

The following example pod definition file shows how to use the `replicas` field to specify the number of pods you want to run:

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

```

For more information, see [Recommended active-active high availability solution overview for AKS](./active-active-solution.md) and [Replicas in Deployment Specs](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#replicas).

## Cluster and node pool level best practices

The following cluster and node pool level best practices help ensure high availability and reliability for your AKS clusters. You can implement these best practices when creating or updating your AKS clusters.

### Availability zones

> **Best practice guidance**
>
> Use multiple availability zones when creating an AKS cluster to ensure high availability in zone-down scenarios. Keep in mind that you can't change the availability zone configuration after creating the cluster.

[Availability zones](../reliability/availability-zones-overview.md) are separated groups of datacenters within a region. These zones are close enough to have low-latency connections to each other, but far enough apart to reduce the likelihood that more than one zone is affected by local outages or weather. Using availability zones helps your data stay synchronized and accessible in zone-down scenarios. For more information, see [Running in multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/).

### Cluster autoscaling

> **Best practice guidance**
>
> Use cluster autoscaling to ensure that your cluster can handle increased load and to reduce costs during low load.

To keep up with application demands in AKS, you might need to adjust the number of nodes that run your workloads. The cluster autoscaler component watches for pods in your cluster that can't be scheduled because of resource constraints. When the cluster autoscaler detects issues, it scales up the number of nodes in the node pool to meet the application demand. It also regularly checks nodes for a lack of running pods and scales down the number of nodes as needed. For more information, see [Cluster autoscaling in AKS](./cluster-autoscaler-overview.md).

You can use the `--enable-cluster-autoscaler` parameter when creating an AKS cluster to enable the cluster autoscaler, as shown in the following example:

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --enable-cluster-autoscaler  --min-count 1 --max-count 3
```

You can also enable the cluster autoscaler on an existing node pool and configure more granular details of the cluster autoscaler by changing the default values in the cluster-wide autoscaler profile.

For more information, see [Use the cluster autoscaler in AKS](./cluster-autoscaler.md).

### Standard Load Balancer

> **Best practice guidance**
>
> Use the Standard Load Balancer to provide greater reliability and resources, support for multiple availability zones, HTTP probes, and functionality across multiple data centers.

In Azure, the [Standard Load Balancer](../load-balancer/skus.md) SKU is designed to be equipped for load balancing network layer traffic when high performance and low latency are needed. The Standard Load Balancer routes traffic within and across regions and to availability zones for high resiliency. The Standard SKU is the recommended and default SKU to use when creating an AKS cluster.

> [!IMPORTANT]
> On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). We recommend that you use the Standard Load Balancer for new deployments and upgrade existing deployments to the Standard Load Balancer. For more information, see [Upgrading from Basic Load Balancer](../load-balancer/load-balancer-basic-upgrade-guidance.md).

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

> [!TIP]
> You can also use an [ingress controller](./app-routing.md) or a [service mesh](./istio-deploy-ingress.md) to manage network traffic, with each option providing different features and capabilities.

### System node pools

#### Use dedicated system node pools

> **Best practice guidance**
>
> Use system node pools to ensure no other user applications run on the same nodes, which can cause resource scarcity and impact system pods.

Use dedicated system node pools to ensure no other user application runs on the same nodes, which can cause scarcity of resources and potential cluster outages because of race conditions. To use a dedicated system node pool, you can use the `CriticalAddonsOnly` taint on the system node pool. For more information, see [Use system node pools in AKS](./use-system-pools.md#system-and-user-node-pools).

#### Autoscaling for system node pools

> **Best practice guidance**
>
> Configure the autoscaler for system node pools to set minimum and maximum scale limits for the node pool.

Use the autoscaler on node pools to configure the minimum and maximum scale limits for the node pool. The system node pool should always be able to scale to meet the demands of system pods. If the system node pool is unable to scale, the cluster runs out of resources to help manage scheduling, scaling, and load balancing, which can lead to an unresponsive cluster.

For more information, see [Use the cluster autoscaler on node pools](./cluster-autoscaler.md#use-the-cluster-autoscaler-on-node-pools).

#### At least three nodes per system node pool

> **Best practice guidance**
>
> Ensure that system node pools have at least three nodes to ensure resiliency against freeze/upgrade scenarios, which can lead to nodes being restarted or shut down.

System node pools are used to run system pods, such as the kube-proxy, coredns, and the Azure CNI plugin. We recommend that you ***ensure that system node pools have at least three nodes*** to ensure resiliency against freeze/upgrade scenarios, which can lead to nodes being restarted or shut down. For more information, see [Manage system node pools in AKS](./use-system-pools.md).

### Accelerated Networking

> **Best practice guidance**
>
> Use Accelerated Networking to provide lower latency, reduced jitter, and decreased CPU utilization on your VMs.

Accelerated Networking enables [single root I/O virtualization (SR-IOV)](/windows-hardware/drivers/network/overview-of-single-root-i-o-virtualization--sr-iov-) on [supported VM types](../virtual-network/accelerated-networking-overview.md#supported-vm-instances), greatly improving networking performance.

The following diagram illustrates how two VMs communicate with and without Accelerated Networking:

:::image type="content" source="../virtual-network/media/create-vm-accelerated-networking/accelerated-networking.png" alt-text="Screenshot that shows communication between Azure VMs with and without Accelerated Networking.":::

For more information, see [Accelerated Networking overview](../virtual-network/accelerated-networking-overview.md).

### Image versions

> **Best practice guidance**
>
> Images shouldn't use the `latest` tag.

#### Container image tags

Using the `latest` tag for [container images](https://kubernetes.io/docs/concepts/containers/images/) can lead to unpredictable behavior and makes it difficult to track which version of the image is running in your cluster. You can minimize these risks by integrating and running scan and remediation tools in your containers at build and runtime. For more information, see [Best practices for container image management in AKS](./operator-best-practices-container-image-management.md).

#### Node image upgrades

AKS provides multiple auto-upgrade channels for node OS image upgrades. You can use these channels to control the timing of upgrades. We recommend joining these auto-upgrade channels to ensure that your nodes are running the latest security patches and updates. For more information, see [Auto-upgrade node OS images in AKS](./auto-upgrade-node-os-image.md).

### Standard tier for production workloads

> **Best practice guidance**
>
> Use the Standard tier for product workloads for greater cluster reliability and resources, support for up to 5,000 nodes in a cluster, and Uptime SLA enabled by default. If you need LTS, consider using the Premium tier.

The Standard tier for Azure Kubernetes Service (AKS) provides a financially backed 99.9% uptime [service-level agreement (SLA)](https://www.azure.cn/en-us/support/sla/kubernetes-service/) for your production workloads. The standard tier also provides greater cluster reliability and resources, support for up to 5,000 nodes in a cluster, and Uptime SLA enabled by default. For more information, see [Pricing tiers for AKS cluster management](./free-standard-pricing-tiers.md).

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

### v5 SKU VMs

> **Best practice guidance**
>
> Use v5 VM SKUs for improved performance during and after updates, less overall impact, and a more reliable connection for your applications.

For node pools in AKS, use v5 SKU VMs with ephemeral OS disks to provide sufficient compute resources for kube-system pods. For more information, see [Best practices for performance and scaling large workloads in AKS](./best-practices-performance-scale-large.md).

### Do *not* use B series VMs

> **Best practice guidance**
>
> Don't use B series VMs for AKS clusters because they're low performance and don't work well with AKS.

B series VMs are low performance and don't work well with AKS. Instead, we recommend using [v5 SKU VMs](#v5-sku-vms).

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

### Container Insights

> **Best practice guidance**
>
> Enable Container Insights to monitor and diagnose the performance of your containerized applications.

[Container Insights](../azure-monitor/containers/container-insights-overview.md) is a feature of Azure Monitor that collects and analyzes container logs from AKS. You can analyze the collected data with a collection of [views](../azure-monitor/containers/container-insights-analyze.md) and prebuilt [workbooks](../azure-monitor/containers/container-insights-reports.md).

You can enable Container Insights monitoring on your AKS cluster using various methods. The following example shows how to enable Container Insights monitoring on an existing cluster using the Azure CLI:

```azurecli-interactive
az aks enable-addons -a monitoring --name myAKSCluster --resource-group myResourceGroup
```

For more information, see [Enable monitoring for Kubernetes clusters](../azure-monitor/containers/kubernetes-monitoring-enable.md).

### Azure Policy

> **Best practice guidance**
>
> Apply and enforce security and compliance requirements for your AKS clusters using Azure Policy.

You can apply and enforce built-in security policies on your AKS clusters using [Azure Policy](../governance/policy/overview.md). Azure Policy helps enforce organizational standards and assess compliance at-scale. After you install the [Azure Policy add-on for AKS](/azure/governance/policy/concepts/policy-for-kubernetes), you can apply individual policy definitions or groups of policy definitions called initiatives to your clusters.

For more information, see [Secure your AKS clusters with Azure Policy](./use-azure-policy.md).

## Next steps

This article focused on best practices for deployment and cluster reliability for Azure Kubernetes Service (AKS) clusters. For more best practices, see the following articles:

* [High availability and disaster recovery overview for AKS](./ha-dr-overview.md)
* [Run AKS clusters at scale](./best-practices-performance-scale-large.md)
* [Baseline architecture for an AKS cluster](/azure/architecture/reference-architectures/containers/aks/baseline-aks)
