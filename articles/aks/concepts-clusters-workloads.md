---
title: Azure Kubernetes Services (AKS) core concepts
description: Learn about the core components that make up workloads and clusters in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.custom: build-2023
ms.date: 04/16/2024
author: schaffererin
ms.author: schaffererin
---

# Core Kubernetes concepts for Azure Kubernetes Service (AKS)

This article describes core concepts of Azure Kubernetes Service (AKS), a managed Kubernetes service that you can use to deploy and operate containerized applications at scale on Azure. It helps you learn about the infrastructure components of Kubernetes and obtain a deeper understanding of how Kubernetes works in AKS.

## What is Kubernetes?

Kubernetes is a rapidly evolving platform that manages container-based applications and their associated networking and storage components. Kubernetes focuses on the application workloads and not the underlying infrastructure components. Kubernetes provides a declarative approach to deployments, backed by a robust set of APIs for management operations.

You can build and run modern, portable, microservices-based applications using Kubernetes to orchestrate and manage the availability of the application components. Kubernetes supports both stateless and stateful applications.

As an open platform, Kubernetes allows you to build your applications with your preferred programming language, OS, libraries, or messaging bus. Existing continuous integration and continuous delivery (CI/CD) tools can integrate with Kubernetes to schedule and deploy releases.

AKS provides a managed Kubernetes service that reduces the complexity of deployment and core management tasks. The Azure platform manages the AKS control plane, and you only pay for the AKS nodes that run your applications.

## Kubernetes cluster architecture

A Kubernetes cluster is divided into two components:

* The ***control plane***, which provides the core Kubernetes services and orchestration of application workloads, and
* ***Nodes***, which run your application workloads.

![Kubernetes control plane and node components](media/concepts-clusters-workloads/control-plane-and-nodes.png)

## Control plane

When you create an AKS cluster, the Azure platform automatically creates and configures its associated control plane. This single-tenant control plane is provided at no cost as a managed Azure resource abstracted from the user. You only pay for the nodes attached to the AKS cluster. The control plane and its resources reside only in the region where you created the cluster.

The control plane includes the following core Kubernetes components:

| Component | Description |  
| ----------------- | ------------- |  
| *kube-apiserver* | The API server exposes the underlying Kubernetes APIs and provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. |  
| *etcd* | etcd is a highly available key-value store within Kubernetes that helps maintain the state of your Kubernetes cluster and configuration. |  
| *kube-scheduler* | When you create or scale applications, the scheduler determines what nodes can run the workload and starts the identified nodes. |  
| *kube-controller-manager* | The controller manager oversees a number of smaller controllers that perform actions such as replicating pods and handling node operations. |  

Keep in mind that you can't directly access the control plane. Kubernetes control plane and node upgrades are orchestrated through the Azure CLI or Azure portal. To troubleshoot possible issues, you can review the control plane logs using Azure Monitor.

> [!NOTE]
> If you want to configure or directly access a control plane, you can deploy a self-managed Kubernetes cluster using [Cluster API Provider Azure][cluster-api-provider-azure].

## Nodes

To run your applications and supporting services, you need a Kubernetes *node*. Each AKS cluster has at least one node, an Azure virtual machine (VM) that runs the Kubernetes node components, and container runtime.

Nodes include the following core Kubernetes components:

| Component | Description |  
| ----------------- | ------------- |  
| `kubelet` | The Kubernetes agent that processes the orchestration requests from the control plane along with scheduling and running the requested containers. |  
| *kube-proxy* | The proxy handles virtual networking on each node, routing network traffic and managing IP addressing for services and pods. |  
| *container runtime* | The container runtime allows containerized applications to run and interact with other resources, such as the virtual network or storage. For more information, see [Container runtime configuration](#container-runtime-configuration). |  

![Azure virtual machine and supporting resources for a Kubernetes node](media/concepts-clusters-workloads/aks-node-resource-interactions.png)

The Azure VM size for your nodes defines CPUs, memory, size, and the storage type available, such as high-performance SSD or regular HDD. Plan the node size around whether your applications might require large amounts of CPU and memory or high-performance storage. Scale out the number of nodes in your AKS cluster to meet demand. For more information on scaling, see [Scaling options for applications in AKS](concepts-scale.md).

In AKS, the VM image for your cluster's nodes is based on Ubuntu Linux, [Azure Linux](use-azure-linux.md), or Windows Server 2022. When you create an AKS cluster or scale out the number of nodes, the Azure platform automatically creates and configures the requested number of VMs. Agent nodes are billed as standard VMs, so any VM size discounts, including [Azure reservations][reservation-discounts], are automatically applied.

For managed disks, default disk size and performance are assigned according to the selected VM SKU and vCPU count. For more information, see [Default OS disk sizing](cluster-configuration.md#default-os-disk-sizing).

> [!NOTE]
> If you need advanced configuration and control on your Kubernetes node container runtime and OS, you can deploy a self-managed cluster using [Cluster API Provider Azure][cluster-api-provider-azure].

### OS configuration

AKS supports Ubuntu 22.04 and Azure Linux 2.0 as the node operating system (OS) for clusters with Kubernetes 1.25 and higher. Ubuntu 18.04 can also be specified at node pool creation for Kubernetes versions 1.24 and below.

AKS supports Windows Server 2022 as the default OS for Windows node pools in clusters with Kubernetes 1.25 and higher. Windows Server 2019 can also be specified at node pool creation for Kubernetes versions 1.32 and below. Windows Server 2019 is being retired after Kubernetes version 1.32 reaches end of life and isn't supported in future releases. For more information about this retirement, see the [AKS release notes][aks-release-notes].

### Container runtime configuration

A container runtime is software that executes containers and manages container images on a node. The runtime helps abstract away sys-calls or OS-specific functionality to run containers on Linux or Windows. For Linux node pools, `containerd` is used on Kubernetes version 1.19 and higher. For Windows Server 2019 and 2022 node pools, `containerd` is generally available and is the only runtime option on Kubernetes version 1.23 and higher. As of May 2023, Docker is retired and no longer supported. For more information about this retirement, see the [AKS release notes][aks-release-notes].

[`Containerd`](https://containerd.io/) is an [OCI](https://opencontainers.org/) (Open Container Initiative) compliant core container runtime that provides the minimum set of required functionality to execute containers and manage images on a node. With`containerd`-based nodes and node pools, the kubelet talks directly to `containerd` using the CRI (container runtime interface) plugin, removing extra hops in the data flow when compared to the Docker CRI implementation. As such, you see better pod startup latency and less resource (CPU and memory) usage.

`Containerd` works on every GA version of Kubernetes in AKS, in every Kubernetes version starting from v1.19, and supports all Kubernetes and AKS features.

> [!IMPORTANT]
> Clusters with Linux node pools created on Kubernetes v1.19 or higher default to the `containerd` container runtime. Clusters with node pools on an earlier supported Kubernetes versions receive Docker for their container runtime. Linux node pools will be updated to `containerd` once the node pool Kubernetes version is updated to a version that supports `containerd`.
>
> `containerd` is generally available for clusters with Windows Server 2019 and 2022 node pools and is the only container runtime option for Kubernetes v1.23 and higher. You can continue using Docker node pools and clusters on versions earlier than 1.23, but Docker is no longer supported as of May 2023. For more information, see [Add a Windows Server node pool with `containerd`](./create-node-pools.md#windows-server-node-pools-with-containerd).
>
> We highly recommend testing your workloads on AKS node pools with `containerd` before using clusters with a Kubernetes version that supports `containerd` for your node pools.

#### `containerd` limitations/differences

* For `containerd`, we recommend using [`crictl`](https://kubernetes.io/docs/tasks/debug-application-cluster/crictl) as a replacement for the Docker CLI for *troubleshooting pods, containers, and container images on Kubernetes nodes*. For more information on `crictl`, see [general usage][general-usage] and [client configuration options][client-config-options].
  * `Containerd` doesn't provide the complete functionality of the Docker CLI. It's available for troubleshooting only.
  * `crictl` offers a more Kubernetes-friendly view of containers, with concepts like pods, etc. being present.

* `Containerd` sets up logging using the standardized `cri` logging format. Your logging solution needs to support the `cri` logging format, like [Azure Monitor for Containers](../azure-monitor/containers/container-insights-enable-new-cluster.md).
* You can no longer access the Docker engine, `/var/run/docker.sock`, or use Docker-in-Docker (DinD).
  * If you currently extract application logs or monitoring data from Docker engine, use [Container Insights](../azure-monitor/containers/container-insights-enable-new-cluster.md) instead. AKS doesn't support running any out of band commands on the agent nodes that could cause instability.
  * We don't recommend building images or directly using the Docker engine. Kubernetes isn't fully aware of those consumed resources, and those methods present numerous issues as described [here](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) and [here](https://securityboulevard.com/2018/05/escaping-the-whale-things-you-probably-shouldnt-do-with-docker-part-1/).

* When building images, you can continue to use your current Docker build workflow as normal, unless you're building images inside your AKS cluster. In this case, consider switching to the recommended approach for building images using [ACR Tasks](../container-registry/container-registry-quickstart-task-cli.md), or a more secure in-cluster option like [Docker Buildx](https://github.com/docker/buildx).

### Resource reservations

AKS uses node resources to help the node function as part of your cluster. This usage can create a discrepancy between your node's total resources and the allocatable resources in AKS. Remember this information when setting requests and limits for user deployed pods.

To find a node's allocatable resource, you can use the `kubectl describe node` command:

```kubectl
kubectl describe node [NODE_NAME]
```

To maintain node performance and functionality, AKS reserves two types of resources, CPU and memory, on each node. As a node grows larger in resources, the resource reservation grows due to a higher need for management of user-deployed pods. Keep in mind that the resource reservations can't be changed.

> [!NOTE]
> Using AKS add-ons, such as Container Insights (OMS), consumes extra node resources.

#### CPU

Reserved CPU is dependent on node type and cluster configuration, which may cause less allocatable CPU due to running extra features. The following table shows CPU reservation in millicores:

| CPU cores on host          | 1  | 2   | 4   | 8   | 16  | 32  | 64  |
|----------------------------|----|-----|-----|-----|-----|-----|-----|
| Kube-reserved (millicores) | 60 | 100 | 140 | 180 | 260 | 420 | 740 |

#### Memory

Reserved memory in AKS includes the sum of two values:

> [!IMPORTANT]
> AKS 1.29 previews in January 2024 and includes certain changes to memory reservations. These changes are detailed in the following section.

**AKS 1.29 and later**

1. **`kubelet` daemon** has the *memory.available<100Mi* eviction rule by default. This rule ensures that a node has at least 100Mi allocatable at all times. When a host is below that available memory threshold, the `kubelet` triggers the termination of one of the running pods and frees up memory on the host machine.
2. **A rate of memory reservations** set according to the lesser value of: *20MB * Max Pods supported on the Node + 50MB* or *25% of the total system memory resources*.

    **Examples**:
   * If the VM provides 8GB of memory and the node supports up to 30 pods, AKS reserves *20MB * 30 Max Pods + 50MB = 650MB* for kube-reserved. `Allocatable space = 8GB - 0.65GB (kube-reserved) - 0.1GB (eviction threshold) = 7.25GB or 90.625% allocatable.`
   * If the VM provides 4GB of memory and the node supports up to 70 pods, AKS reserves *25% * 4GB = 1000MB* for kube-reserved, as this is less than *20MB * 70 Max Pods + 50MB = 1450MB*.

    For more information, see [Configure maximum pods per node in an AKS cluster][maximum-pods].

**AKS versions prior to 1.29**

1. **`kubelet` daemon** has the *memory.available<750Mi* eviction rule by default. This rule ensures that a node has at least 750Mi allocatable at all times. When a host is below that available memory threshold, the `kubelet` triggers the termination of one of the running pods and free up memory on the host machine.
2. **A regressive rate of memory reservations** for the kubelet daemon to properly function (*kube-reserved*).
   * 25% of the first 4GB of memory
   * 20% of the next 4GB of memory (up to 8GB)
   * 10% of the next 8GB of memory (up to 16GB)
   * 6% of the next 112GB of memory (up to 128GB)
   * 2% of any memory more than 128GB

> [!NOTE]
> AKS reserves an extra 2GB for system processes in Windows nodes that isn't part of the calculated memory.

Memory and CPU allocation rules are designed to:

* Keep agent nodes healthy, including some hosting system pods critical to cluster health.
* Cause the node to report less allocatable memory and CPU than it would report if it weren't part of a Kubernetes cluster.

For example, if a node offers 7 GB, it will report 34% of memory not allocatable including the 750Mi hard eviction threshold.

`0.75 + (0.25*4) + (0.20*3) = 0.75GB + 1GB + 0.6GB = 2.35GB / 7GB = 33.57% reserved`

In addition to reservations for Kubernetes itself, the underlying node OS also reserves an amount of CPU and memory resources to maintain OS functions.

For associated best practices, see [Best practices for basic scheduler features in AKS][operator-best-practices-scheduler].

## Node pools

> [!NOTE]
> The Azure Linux node pool is now generally available (GA). To learn about the benefits and deployment steps, see the [Introduction to the Azure Linux Container Host for AKS][intro-azure-linux].

Nodes of the same configuration are grouped together into *node pools*. Each Kubernetes cluster contains at least one node pool. You define the initial number of nodes and sizes when you create an AKS cluster, which creates a *default node pool*. This default node pool in AKS contains the underlying VMs that run your agent nodes.

> [!NOTE]
> To ensure your cluster operates reliably, you should run at least two nodes in the default node pool.

You scale or upgrade an AKS cluster against the default node pool. You can choose to scale or upgrade a specific node pool. For upgrade operations, running containers are scheduled on other nodes in the node pool until all the nodes are successfully upgraded.

For more information, see [Create node pools](./create-node-pools.md) and [Manage node pools](./manage-node-pools.md).

### Default OS disk sizing

When you create a new cluster or add a new node pool to an existing cluster, the number for vCPUs by default determines the OS disk size. The number of vCPUs is based on the VM SKU. The following table lists the default OS disk size for each VM SKU:

|VM SKU Cores (vCPUs)| Default OS Disk Tier | Provisioned IOPS | Provisioned Throughput (Mbps) |
|--|--|--|--|
| 1 - 7 | P10/128G | 500 | 100 |
| 8 - 15 | P15/256G | 1100 | 125 |
| 16 - 63 | P20/512G | 2300 | 150 |
| 64+ | P30/1024G | 5000 | 200 |

> [!IMPORTANT]
> Default OS disk sizing is only used on new clusters or node pools when Ephemeral OS disks aren't supported and a default OS disk size isn't specified. The default OS disk size might impact the performance or cost of your cluster. You can't change the OS disk size after cluster or node pool creation. This default disk sizing affects clusters or node pools created on July 2022 or later.

### Node selectors

In an AKS cluster with multiple node pools, you might need to tell the Kubernetes Scheduler which node pool to use for a given resource. For example, ingress controllers shouldn't run on Windows Server nodes. You use node selectors to define various parameters, like node OS, to control where a pod should be scheduled.

The following basic example schedules an NGINX instance on a Linux node using the node selector *"kubernetes.io/os": linux*:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx
spec:
  containers:
    - name: myfrontend
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.12-alpine
  nodeSelector:
    "kubernetes.io/os": linux
```

For more information, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

### Node resource group

When you create an AKS cluster, you specify an Azure resource group to create the cluster resources in. In addition to this resource group, the AKS resource provider creates and manages a separate resource group called the *node resource group*. The *node resource group* contains the following infrastructure resources:

* The virtual machine scale sets and VMs for every node in the node pools
* The virtual network for the cluster
* The storage for the cluster

The node resource group is assigned a name by default with the following format: *MC_resourceGroupName_clusterName_location*. During cluster creation, you can specify the name assigned to your node resource group. When using an Azure Resource Manager template, you can define the name using the `nodeResourceGroup` property. When using Azure CLI, you use the `--node-resource-group` parameter with the `az aks create` command, as shown in the following example:

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup --node-resource-group myNodeResourceGroup
```

When you delete your AKS cluster, the AKS resource provider automatically deletes the node resource group.

The node resource group has the following limitations:

* You can't specify an existing resource group for the node resource group.
* You can't specify a different subscription for the node resource group.
* You can't change the node resource group name after the cluster has been created.
* You can't specify names for the managed resources within the node resource group.
* You can't modify or delete Azure-created tags of managed resources within the node resource group.

Modifying any **Azure-created tags** on resources under the node resource group in the AKS cluster is an unsupported action, which breaks the service-level objective (SLO). If you modify or delete Azure-created tags or other resource properties in the node resource group, you might get unexpected results, such as scaling and upgrading errors. AKS manages the infrastructure lifecycle in the node resource group, so making any changes moves your cluster into an [unsupported state][aks-support]. For more information, see [Does AKS offer a service-level agreement?][aks-service-level-agreement]

AKS allows you to create and modify tags that are propagated to resources in the node resource group, and you can add those tags when [creating or updating][aks-tags] the cluster. You might want to create or modify custom tags to assign a business unit or cost center, for example. You can also create Azure Policies with a scope on the managed resource group.

To reduce the chance of changes in the node resource group affecting your clusters, you can enable *node resource group lockdown* to apply a deny assignment to your AKS resources. for more information, see [Fully managed resource group (preview)][fully-managed-resource-group].

> [!WARNING]
> If you don't have node resource group lockdown enabled, you can directly modify any resource in the node resource group. Directly modifying resources in the node resource group can cause your cluster to become unstable or unresponsive.

## Pods

Kubernetes uses *pods* to run instances of your application. A single pod represents a single instance of your application.

Pods typically have a 1:1 mapping with a container. In advanced scenarios, a pod might contain multiple containers. Multi-container pods are scheduled together on the same node and allow containers to share related resources.

When you create a pod, you can define *resource requests* for a certain amount of CPU or memory. The Kubernetes Scheduler tries to meet the request by scheduling the pods to run on a node with available resources. You can also specify maximum resource limits to prevent a pod from consuming too much compute resource from the underlying node. Our recommended best practice is to include resource limits for all pods to help the Kubernetes Scheduler identify necessary, permitted resources.

For more information, see [Kubernetes pods][kubernetes-pods] and [Kubernetes pod lifecycle][kubernetes-pod-lifecycle].

A pod is a logical resource, but application workloads run on the containers. Pods are typically ephemeral, disposable resources. Individually scheduled pods miss some of the high availability and redundancy Kubernetes features. Instead, Kubernetes *Controllers*, such as the Deployment Controller, deploys and manages pods.

## Deployments and YAML manifests

A *deployment* represents identical pods managed by the Kubernetes Deployment Controller. A deployment defines the number of pod *replicas* to create. The Kubernetes Scheduler ensures that extra pods are scheduled on healthy nodes if pods or nodes encounter problems. You can update deployments to change the configuration of pods, the container image, or the attached storage.

The Deployment Controller manages the deployment lifecycle and performs the following actions:

* Drains and terminates a given number of replicas.
* Creates replicas from the new deployment definition.
* Continues the process until all replicas in the deployment are updated.

Most stateless applications in AKS should use the deployment model rather than scheduling individual pods. Kubernetes can monitor deployment health and status to ensure that the required number of replicas run within the cluster. When scheduled individually, pods aren't restarted if they encounter a problem, and they aren't rescheduled on healthy nodes if their current node encounters a problem.

You don't want to disrupt management decisions with an update process if your application requires a minimum number of available instances. *Pod Disruption Budgets* define how many replicas in a deployment can be taken down during an update or node upgrade. For example, if you have *five* replicas in your deployment, you can define a pod disruption of *four* to only allow one replica to be deleted or rescheduled at a time. As with pod resource limits, our recommended best practice is to define pod disruption budgets on applications that require a minimum number of replicas to always be present.

Deployments are typically created and managed with `kubectl create` or `kubectl apply`. You can create a deployment by defining a manifest file in the YAML format. The following example shows a basic deployment manifest file for an NGINX web server:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
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
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.2-alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 250m
            memory: 64Mi
          limits:
            cpu: 500m
            memory: 256Mi
```

A breakdown of the deployment specifications in the YAML manifest file is as follows:

| Specification | Description |  
| ----------------- | ------------- |  
| `.apiVersion` | Specifies the API group and API resource you want to use when creating the resource. |  
| `.kind` | Specifies the type of resource you want to create. |  
| `.metadata.name` | Specifies the name of the deployment. This example YAML file runs the *nginx* image from Docker Hub. |  
| `.spec.replicas` | Specifies how many pods to create. This example YAML file creates three duplicate pods. |  
| `.spec.selector` | Specifies which pods will be affected by this deployment. |
| `.spec.selector.matchLabels` | Contains a map of *{key, value}* pairs that allow the deployment to find and manage the created pods. |  
| `.spec.selector.matchLabels.app` | Has to match `.spec.template.metadata.labels`. |  
| `.spec.template.labels` | Specifies the *{key, value}* pairs attached to the object. |  
| `.spec.template.app` | Has to match `.spec.selector.matchLabels`. |  
| `.spec.spec.containers` | Specifies the list of containers belonging to the pod. |  
| `.spec.spec.containers.name` | Specifies the name of the container specified as a DNS label. |
| `.spec.spec.containers.image` | Specifies the container image name. |
| `.spec.spec.containers.ports` | Specifies the list of ports to expose from the container. |  
| `.spec.spec.containers.ports.containerPort` | Specifies the number of ports to expose on the pod's IP address. |  
| `.spec.spec.resources` | Specifies the compute resources required by the container. |
| `.spec.spec.resources.requests` | Specifies the minimum amount of compute resources required. |
| `.spec.spec.resources.requests.cpu` | Specifies the minimum amount of CPU required. |
| `.spec.spec.resources.requests.memory` | Specifies the minimum amount of memory required. |
| `.spec.spec.resources.limits` | Specifies the maximum amount of compute resources allowed. The kubelet enforces this limit. |
| `.spec.spec.resources.limits.cpu` | Specifies the maximum amount of CPU allowed. The kubelet enforces this limit. |
| `.spec.spec.resources.limits.memory` | Specifies the maximum amount of memory allowed. The kubelet enforces this limit. |

More complex applications can be created by including services, such as load balancers, within the YAML manifest.

For more information, see [Kubernetes deployments][kubernetes-deployments].

### Package management with Helm

[Helm][helm] is commonly used to manage applications in Kubernetes. You can deploy resources by building and using existing public *Helm charts* that contain a packaged version of application code and Kubernetes YAML manifests. You can store Helm charts either locally or in a remote repository, such as an [Azure Container Registry Helm chart repo][acr-helm].

To use Helm, install the Helm client on your computer, or use the Helm client in the [Azure Cloud Shell][azure-cloud-shell]. Search for or create Helm charts, and then install them to your Kubernetes cluster. For more information, see [Install existing applications with Helm in AKS][aks-helm].

## StatefulSets and DaemonSets

The Deployment Controller uses the Kubernetes Scheduler and runs replicas on any available node with available resources. While this approach might be sufficient for stateless applications, the Deployment Controller isn't ideal for applications that require the following specifications:

* A persistent naming convention or storage.
* A replica to exist on each select node within a cluster.

Two Kubernetes resources, however, let you manage these types of applications: *StatefulSets* and *DaemonSets*.

*StatefulSets* maintain the state of applications beyond an individual pod lifecycle. *DaemonSets* ensure a running instance on each node early in the Kubernetes bootstrap process.

### StatefulSets

Modern application development often aims for stateless applications. For stateful applications, like those that include database components, you can use *StatefulSets*. Like deployments, a StatefulSet creates and manages at least one identical pod. Replicas in a StatefulSet follow a graceful, sequential approach to deployment, scale, upgrade, and termination operations. The naming convention, network names, and storage persist as replicas are rescheduled with a StatefulSet.

You can define the application in YAML format using `kind: StatefulSet`. From there, the StatefulSet Controller handles the deployment and management of the required replicas. Data writes to persistent storage, provided by Azure Managed Disks or Azure Files. The underlying persistent storage remains even when the StatefulSet is deleted, unless the `spec.persistentVolumeClaimRetentionPolicy` is set to `Delete`. For more information, see [Kubernetes StatefulSets][kubernetes-statefulsets].

> [!IMPORTANT]
> Replicas in a StatefulSet are scheduled and run across any available node in an AKS cluster. To ensure at least one pod in your set runs on a node, you should use a DaemonSet instead.

### DaemonSets

For specific log collection or monitoring, you might need to run a pod on all nodes or a select set of nodes. You can use *DaemonSets* to deploy to one or more identical pods. The DaemonSet Controller ensures that each node specified runs an instance of the pod.

The DaemonSet Controller can schedule pods on nodes early in the cluster boot process before the default Kubernetes scheduler starts. This ability ensures that the pods in a DaemonSet state before traditional pods in a Deployment or StatefulSet are scheduled.

Like StatefulSets, you can define a DaemonSet as part of a YAML definition using `kind: DaemonSet`.

For more information, see [Kubernetes DaemonSets][kubernetes-daemonset].

> [!NOTE]
> If you're using the [virtual Nodes add-on](virtual-nodes-cli.md#enable-the-virtual-nodes-addon), DaemonSets don't create pods on the virtual node.

## Namespaces

Kubernetes resources, such as pods and deployments, are logically grouped into *namespaces* to divide an AKS cluster and create, view, or manage access to resources. For example, you can create namespaces to separate business groups. Users can only interact with resources within their assigned namespaces.

![Kubernetes namespaces to logically divide resources and applications](media/concepts-clusters-workloads/namespaces.png)

The following namespaces are available when you create an AKS cluster:

| Namespace | Description |  
| ----------------- | ------------- |  
| *default* | Where pods and deployments are created by default when none is provided. In smaller environments, you can deploy applications directly into the default namespace without creating additional logical separations. When you interact with the Kubernetes API, such as with `kubectl get pods`, the default namespace is used when none is specified.  |  
| *kube-system* | Where core resources exist, such as network features like DNS and proxy, or the Kubernetes dashboard. You typically don't deploy your own applications into this namespace. |  
| *kube-public* | Typically not used, you can use it for resources to be visible across the whole cluster, and can be viewed by any user. |  

For more information, see [Kubernetes namespaces][kubernetes-namespaces].

## Next steps

For more information on core Kubernetes and AKS concepts, see the following articles:

* [AKS access and identity][aks-concepts-identity]
* [AKS security][aks-concepts-security]
* [AKS virtual networks][aks-concepts-network]
* [AKS storage][aks-concepts-storage]
* [AKS scale][aks-concepts-scale]

<!-- EXTERNAL LINKS -->
[cluster-api-provider-azure]: https://github.com/kubernetes-sigs/cluster-api-provider-azure
[kubernetes-pods]: https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/
[kubernetes-pod-lifecycle]: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
[kubernetes-deployments]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[kubernetes-statefulsets]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
[kubernetes-daemonset]: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
[kubernetes-namespaces]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[helm]: https://helm.sh/
[azure-cloud-shell]: https://shell.azure.com
[aks-release-notes]: https://github.com/Azure/AKS/releases
[general-usage]: https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/#general-usage
[client-config-options]: https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md#client-configuration-options

<!-- INTERNAL LINKS -->
[aks-concepts-identity]: concepts-identity.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-network]: concepts-network.md
[acr-helm]: ../container-registry/container-registry-helm-repos.md
[aks-helm]: kubernetes-helm.md
[operator-best-practices-scheduler]: operator-best-practices-scheduler.md
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[reservation-discounts]:../cost-management-billing/reservations/save-compute-costs-reservations.md
[aks-service-level-agreement]: faq.md#does-aks-offer-a-service-level-agreement
[aks-tags]: use-tags.md
[aks-support]: support-policies.md#user-customization-of-agent-nodes
[intro-azure-linux]: ../azure-linux/intro-azure-linux.md
[fully-managed-resource-group]: ./node-resource-group-lockdown.md
[maximum-pods]: concepts-network-ip-address-planning.md#maximum-pods-per-node

