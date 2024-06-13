---
title: Operator best practices - Basic scheduler features in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for using basic scheduler features such as resource quotas and pod disruption budgets in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 03/09/2021

---

# Best practices for basic scheduler features in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), you often need to isolate teams and workloads. The Kubernetes scheduler lets you control the distribution of compute resources, or limit the impact of maintenance events.

This best practices article focuses on basic Kubernetes scheduling features for cluster operators. In this article, you learn how to:

> [!div class="checklist"]
> * Use resource quotas to provide a fixed amount of resources to teams or workloads
> * Limit the impact of scheduled maintenance using pod disruption budgets

## Enforce resource quotas

> **Best practice guidance** 
> 
> Plan and apply resource quotas at the namespace level. If pods don't define resource requests and limits, reject the deployment. Monitor resource usage and adjust quotas as needed.

Resource requests and limits are placed in the pod specification. Requests are used by the Kubernetes scheduler at deployment time to find an available node in the cluster. Limits and requests work at the individual pod level. For more information about how to define these values, see [Define pod resource requests and limits][resource-limits].

To provide a way to reserve and limit resources across a development team or project, you should use *resource quotas*. These quotas are defined on a namespace, and can be used to set quotas on the following basis:

* **Compute resources**, such as CPU and memory, or GPUs.
* **Storage resources**, including the total number of volumes or amount of disk space for a given storage class.
* **Object count**, such as maximum number of secrets, services, or jobs can be created.

Kubernetes doesn't overcommit resources. Once your cumulative resource request total passes the assigned quota, all further deployments will be unsuccessful.

When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications. If they don't provide these values, you can reject the deployment. Instead, you can [configure default requests and limits for a namespace][configure-default-quotas].

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

> **Best practice guidance** 
>
> To maintain the availability of applications, define Pod Disruption Budgets (PDBs) to make sure that a minimum number of pods are available in the cluster.

There are two disruptive events that cause pods to be removed:

### Involuntary disruptions

*Involuntary disruptions* are events beyond the typical control of the cluster operator or application owner. Include:
* Hardware failure on the physical machine
* Kernel panic
* Deletion of a node VM

Involuntary disruptions can be mitigated by:
* Using multiple replicas of your pods in a deployment. 
* Running multiple nodes in the AKS cluster. 

### Voluntary disruptions

*Voluntary disruptions* are events requested by the cluster operator or application owner. Include:
* Cluster upgrades
* Updated deployment template
* Accidentally deleting a pod

Kubernetes provides *pod disruption budgets* for voluntary disruptions, letting you plan for how deployments or replica sets respond when a voluntary disruption event occurs. Using pod disruption budgets, cluster operators can define a minimum available or maximum unavailable resource count. 

If you upgrade a cluster or update a deployment template, the Kubernetes scheduler will schedule extra pods on other nodes before allowing voluntary disruption events to continue. The scheduler waits to reboot a node until the defined number of pods are successfully scheduled on other nodes in the cluster.

Let's look at an example of a replica set with five pods that run NGINX. The pods in the replica set are assigned the label `app: nginx-frontend`. During a voluntary disruption event, such as a cluster upgrade, you want to make sure at least three pods continue to run. The following YAML manifest for a *PodDisruptionBudget* object defines these requirements:

```yaml
apiVersion: policy/v1
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

You can define a maximum number of unavailable instances in a replica set. Again, a percentage for the maximum unavailable pods can also be defined. The following pod disruption budget YAML manifest defines that no more than two pods in the replica set be unavailable:

```yaml
apiVersion: policy/v1
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

## Next steps

This article focused on basic Kubernetes scheduler features. For more information about cluster operations in AKS, see the following best practices:

* [Multi-tenancy and cluster isolation][aks-best-practices-cluster-isolation]
* [Advanced Kubernetes scheduler features][aks-best-practices-advanced-scheduler]
* [Authentication and authorization][aks-best-practices-identity]

<!-- EXTERNAL LINKS -->
[k8s-resource-quotas]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[configure-default-quotas]: https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/
[k8s-pdbs]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/

<!-- INTERNAL LINKS -->
[resource-limits]: developer-best-practices-resource-management.md#define-pod-resource-requests-and-limits
[aks-best-practices-cluster-isolation]: operator-best-practices-cluster-isolation.md
[aks-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[aks-best-practices-identity]: operator-best-practices-identity.md
[k8s-node-selector]: concepts-clusters-workloads.md#node-selectors
