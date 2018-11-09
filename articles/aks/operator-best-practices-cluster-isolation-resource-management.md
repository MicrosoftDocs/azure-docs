---
title: Operator best practices - Cluster and resources in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for isolation and resource management in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/08/2018
ms.author: iainfou
---

# Best practices for cluster operators to manage resources in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how to run your cluster and workloads from a cluster operator perspective. For information about developer best practices, see [Application developer best practices for resource management in Azure Kubernetes Service (AKS)][developer-best-practices-resources]. In this article, you learn:

> [!div class="checklist"]
> * Ways to logical isolate access to resource in multi-tenant clusters
> * How and why to use physical or logical cluster isolation
> * How to set resource quotas for a namespace
> * What disruption events occur in a cluster and how to budget for them
> * Ways to control scheduling of resources with taints and tolerations or node selectors and affinity
> * How to use the `kube-advisor` tool to check for issues with deployments

## Design clusters for multi-tenancy

**Best practice guidance** - Logically isolate clusters using [Namespaces][k8s-namespaces], then use additional Kubernetes features to isolate scheduling, networking, and authentication and authorization.

Kubernetes provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. A Namespace in Kubernetes creates a logical isolation boundary. Additional kubernetes features and considerations for isolation and multi-tenancy include the following areas:

* **Scheduling** includes the use of resource quotas, pod disruption budgets, taints and tolerations, node selectors, and node and pod affinity or anti-affinity. These scheduling features are discussed in this best practices guide.
* **Networking** includes the use of network policies to control the flow of traffic in and out of pods.
* **Authentication and authorization** includes the user of role-based access control (RBAC) and Azure Active Directory (AD) integration, pod identities, and secrets in Azure Key Vault.
* **Containers** includes pod security policies, pod security contexts, scanning images and runtimes for vulnerabilities, and App Armor or Seccomp (Secure Computing) to restrict container access to the underlying node.

## Logically isolate clusters

**Best practice guidance** - Use logical isolation to separate teams and projects. You can use logical isolation alongside physical isolation, but try to minimize the number of physical AKS clusters you deploy just to separate teams or applications.

With logical isolation, a single AKS cluster can be used for multiple workloads, teams, or environments. Kubernetes [Namespaces][k8s-namespaces] form the logical isolation boundary for workloads and resources.

![Logical isolation of a Kubernetes cluster in AKS](media/best-practices-cluster-isolation-resource-management/logical-isolation.png)

Logical separation of clusters usually provides a higher pod density than physically isolated clusters. There is less excess compute capacity that sits idle in the cluster. When combined with the Kubernetes cluster autoscaler, you can scale the number of nodes up or down to meet demands. This best practice approach to autoscaling lets you run only the number of nodes required and minimizes costs.

### Physically isolated clusters

**Best practice guidance** - Minimize the use of physical isolation for each separate team or application deployment. Instead, use *logical* isolation, as discussed in the previous section.

A common approach to cluster isolation is to use physically separate AKS clusters. In this isolation model, teams or workloads are assigned their own AKS cluster. This approach often looks like the easiest way to isolate workloads or teams, but adds additional management and financial overhead. You now have to maintain these multiple clusters, are billed for all the individual nodes, and have to individually provide access and assign permissions.

![Physical isolation of individual Kubernetes clusters in AKS](media/best-practices-cluster-isolation-resource-management/physical-isolation.png)

Physically separate clusters usually have a low pod density. As each team or workload has their own AKS cluster, the cluster is often over-provisioned with compute resources, with a small number of pods scheduled on those nodes. Unused capacity on the nodes cannot be used for applications or services in development by other teams. These excess resources contribute to the additional costs in physically separate clusters.

## Enforce resource quotas

**Best practice guidance** - Plan and apply resource quotas at the namespace level. If pods don't define resource requests and limits, reject the deployment. Monitor resource usage and adjust quotas as needed.

Resource requests and limits are placed in the pod specification and used at deployment time for the Kubernetes scheduler to find an available node in the cluster. These limits and requests work at the individual pod level. For more information about how to define these values, see [Define pod resource requests and limits][resource-limits]

To provide a way to reserve and limit resources across a development team or project, you should use *resource quotas*. These quotas are defined on a namespace, and can be used to set quotas on the following basis:

* **Compute resources**, such as CPU and memory, or GPUs.
* **Storage resources**, including the total number of volumes, persistent volume claims, or amount of disk space for a given storage class.
* **Object count**, such as maximum number of secrets, services, or jobs can be created.

Kubernetes does not overcommit resources. Once the cumulative total of resource requests or limits passes the assigned quota, no further deployments are successful.

When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications. If they don't provide these values, you can reject the deployment. Alternatively, you can [configure default requests and limits for a namespace][configure-default-quotas].

The following example YAML manifest named *dev-app-team-quotas.yaml* sets a hard limit of a total of *10* CPUs, *20Gi* of memory, and *10* pods:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-app-team
spec:
  hard:
    cpu: "10"
    memory: 20Gi
    pods: "10"
```

This resource quota can be applied by specifying the namespace, such as *dev-apps*:

```console
kubectl apply -f dev-app-team-quotas.yaml --namespace dev-apps
```

Work with your application developers and owners to understand their needs and apply the appropriate resource quotas.

For more information about available resource objects, scopes, and priorities, see [Resource quotas in Kubernetes][k8s-resource-quotas].

## Plan for availability using pod disruption budgets

**Best practice guidance** - To maintain the availability of applications, define Pod Disruption Budgets (PDBs) to ensure that a minimum number of pods are available in the cluster.

There are two disruptive events that cause pods to be removed:

* *Involuntary disruptions* are events beyond the typical control of the cluster operator or application owner.
  * These involuntary disruptions include a hardware failure on the physical machine, a kernel panic, or the deletion of a node VM
* *Voluntary disruptions* are events requested by the cluster operator or application owner.
  * These voluntary disruptions include cluster upgrades, an updated deployment template, or accidentally deleting a pod.

The involuntary disruptions can be mitigated using multiple replicas of your pods in a deployment and running multiple nodes in the AKS cluster. For voluntary disruptions, Kubernetes provides *pod disruption budgets* that let the cluster operator define a minimum available or maximum unavailable resource count. These pod disruption budgets let you plan for how deployments or replica sets respond when a voluntary disruption event occurs.

If a cluster is to be upgraded or a deployment template updated, the Kubernetes scheduler makes sure additional pods are scheduled on other nodes before the voluntary disruption events can continue. During a cluster upgrade process, for example, the Kubernetes scheduler may wait before a node is upgraded until the defined number of pods are successfully scheduled on the other nodes in the cluster.

Let's look at an example of a replica set with five pods that run NGINX. The pods in the replica set as assigned the label `app: nginx-frontend`. During a voluntary disruption event, such as a cluster upgrade, you want to make sure at least three pods continue to run. The following YAML manifest for a *PodDisruptionBudget* object defines these requirements:

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
   name: nginx-pdb
spec:
   minAvailable: 3
   selector:
   matchLabels:
      app: nginx-frontend
```

You can also define a percentage, such as *60%*, which allows you to automatically compensate for the replica set scaling up the number of pods.

If you want to define a maximum number of instances that can become unavailable in a replica set, you can also do that. Again, a percentage for the maximum unavailable pods can also be defined. The following pod disruption budget YAML manifest defines that no more than two pods in the replica set can be unavailable:

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
   name: nginx-pdb
spec:
   maxUnavailable: 2
   selector:
   matchLabels:
      app: nginx-frontend
```

Once your pod disruption budget is defined, you create it in your AKS cluster as with any other Kubernetes object:

```console
kubectl apply -f nginx-pdb.yaml
```

Work with your application developers and owners to understand their needs and apply the appropriate pod disruption budgets.

For more information about using pod disruption budgets, see [Specify a disruption budget for your application][k8s-pdbs].

## Provide dedicated nodes using taints and tolerations

**Best practice guidance** - Limit access to nodes or specialized hardware such as GPU support. Keep those node resources available for workloads that require them, and don't allow scheduling of other workloads on the nodes.

When you create your AKS cluster, you can deploy nodes with GPU support or a large number of powerful CPUs. These nodes are often used for large data processing workloads such as machine learning (ML) or artificial intelligence (AI). As this type of hardware is typically an expensive node resource to provision, limit the workloads that can be scheduled on these nodes. You may instead wish to dedicate some nodes in the cluster to run ingress services, and prevent other workloads.

The Kubernetes scheduler can use taints and tolerations to restrict what workloads can run on nodes.

* A **taint** is applied to a node that indicates only specific pods can be scheduled on them.
* A **toleration** is then applied to a pod that allows them to *tolerate* a node's taint.

When you deploy a pod to an AKS cluster, Kubernetes only schedules pods on nodes where a toleration is aligned with the taint. As an example, assume you have a nodepool in your AKS cluster for nodes with GPU support. You define name, such as *gpu*, then a value for scheduling. If you set this value to *NoSchedule*, the Kubernetes scheduler can't schedule pods on the node if the pod doesn't define the appropriate toleration.

```console
kubectl taint node aks-nodepool1 gpu:NoSchedule
```

With a taint applied to nodes, you then define a toleration in the pod specification that allows scheduling on the nodes. The following example defines the `key: gpu` and `effect: NoSchedule` to tolerate the taint applied to the node in the previous step:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: microsoft/samples-tf-mnist-demo:gpu
  resources:
    requests:
      cpu: 0.5
      memory: 2Gi
    limits:
      cpu: 4.0
      memory: 16Gi
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
```

When this pod is deployed, such as using `kubectl apply -f gpu-toleration.yaml`, Kubernetes can successfully schedule the pod on the nodes with the taint applied. This logical isolation lets you control access to resources within a cluster.

When you apply taints, work with your application developers and owners to allow them to define the required tolerations in their deployments.

For more information about taints and tolerations, see [applying taints and tolerations][k8s-taints-tolerations].

## Control pod scheduling using node selectors and affinity

**Best practice guidance** - Control the scheduling of pods on nodes using node selectors, node affinity, or inter-pod affinity. These settings allow the Kubernetes scheduler to logically isolate workloads, such as by hardware in the node.

Taints and tolerations are used to logically isolate resources with a hard cut-off - if the pod doesn't tolerate a node's taint, it isn't scheduled on the node. An alternate approach is to use node selectors. You label nodes, such as to indicate locally attached SSD storage or a large amount of memory, and then define in the pod specification a node selector. Kubernetes then schedules those pods on a matching node. Unlike tolerations, pods without a matching node selector can be scheduled on labeled nodes. This behavior allows unused resources on the nodes to consume, but gives priority to pods that define the matching node selector.

Let's look at an example of nodes with a high amount of memory. These nodes can give preference to pods that request a high amount of memory, but also allow other pods to run so the resources don't sit idle.

```console
kubectl label node aks-nodepool1 hardware:highmem
```

A pod specification then adds the `nodeSelector` property to define a node selector that matches the label set on a node:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: microsoft/samples-tf-mnist-demo:gpu
    resources:
      requests:
        cpu: 0.5
        memory: 2Gi
      limits:
        cpu: 4.0
        memory: 16Gi
    nodeSelector:
      hardware: highmem
```

When you use node selectors, affinity, or inter-pod affinity and anti-affinity, work with your application developers and owners to allow them to correctly define their pod specifications.

For more information about using node selectors, see [Assigning Pods to Nodes][k8s-node-selector].

## Node affinity

A node selector is a basic way to assign pods to a given node. More flexibility is available using *node affinity*. With node affinity, you can define what happens if the pod can't be matched with a node. You can *require* that Kubernetes scheduler matches a pod with a labeled host, or that you *prefer* a match but allow the pod to be scheduled on a different host if not match is available.

The following example sets the node affinity to *requiredDuringSchedulingIgnoredDuringExecution*. This affinity requires the Kubernetes schedule to use a node with a matching label. If no node is available, the pod has to wait for scheduling to proceed. To allow the pod to be scheduled on a different node, you can instead set the value to *preferredDuringScheduledIgnoreDuringExecution*:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: microsoft/samples-tf-mnist-demo:gpu
    resources:
      requests:
        cpu: 0.5
        memory: 2Gi
      limits:
        cpu: 4.0
        memory: 16Gi
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: hardware
          operator: In
          values: highmem
```

The *IgnoredDuringExecution* part of the setting indicates that if the node labels change, the pod shouldn't be evicted from the node. The Kubernetes scheduler only uses the updated node labels for new pods being scheduled, not pods already scheduled on the nodes.

For more information, see [Affinity and anti-affinity][k8s-affinity].

## Inter-pod affinity and anti-affinity

One final approach for the Kubernetes scheduler to logically isolate workloads is using inter-pod affinity or anti-affinity. The settings define either that pods *shouldn't* be scheduled on a node that has an existing matching pod, or that they *should* be scheduled. By default, the Kubernetes scheduler tries to schedule multiple pods in a replica set across nodes, but you can define more specific rules around this behavior.

A good example is a web application that also uses a Redis cache. You can use pod anti-affinity rules to request that the Kubernetes scheduler distributes replicas across nodes, and then affinity rules to ensure that each web app component is scheduled on the same host as a corresponding cache. The distribution of pods across nodes looks like the following example:

| **Node 1** | **Node 2** | **Node 3** |
|------------|------------|------------|
| webapp-1   | webapp-2   | webapp-3   |
| cache-1    | cache-2    | cache-3    |

This example is a more complex deployment than the use of node selectors or node affinity, but gives you control over how Kubernetes schedules pods on nodes and can logically isolate resources. For a complete example of this web application with Redis cache example, see [Colocate pods on the same node][k8s-pod-affinity].

## Regularly check for cluster issues with kube-advisor

**Best practice guidance** - Regularly run the latest version of `kube-advisor` to detect issues in your cluster. If you apply resource quotas on an existing AKS cluster, run `kube-advisor` first to find pods that don't have resource requests and limits defined.

The [kube-advisor][kube-advisor] tool scans a Kubernetes cluster and reports on issues that it finds. One useful check is to identify pods that do not have resource requests and limits in place.

In an AKS cluster that hosts multiple development teams and applications, it can be hard to track pods without these resource requests and limits set. As a best practice, regularly run `kube-advisor` on your AKS clusters, especially if you don't assign resource quotas to namespaces.

## Next steps

This best practices article focused on how to run your cluster and workloads from a cluster operator perspective. For information about developer best practices, see [Application developer best practices for resource management in Azure Kubernetes Service (AKS)][developer-best-practices-resources].

To implement some of these best practices, see the following articles:

* [Enable Azure Active Directory (AD) integration][aks-azuread]
* [Check for issues with kube-advisor][aks-kubeadvisor]

<!-- EXTERNAL LINKS -->
[k8s-resource-quotas]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[configure-default-quotas]: https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/
[kube-advisor]: https://github.com/Azure/kube-advisor
[k8s-pdbs]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/
[k8s-taints-tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[k8s-node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[k8s-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity
[k8s-pod-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#always-co-located-in-the-same-node

<!-- INTERNAL LINKS -->
[aks-azuread]: aad-integration.md
[aks-kubeadvisor]: kube-advisor-tool.md
[developer-best-practices-resources]: developer-best-practices-resource-management.md
[resource-limits]: developer-best-practices-resource-management.md#define-pod-resource-requests-and-limits
[k8s-namespaces]: concepts-clusters-workloads.md#namespaces