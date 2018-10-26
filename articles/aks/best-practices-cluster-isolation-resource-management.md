---
title: Best practices - Cluster and resources in Azure Kubernetes Services (AKS)
description: Learn the best practices for cluster isolation and resource management in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 10/26/2018
ms.author: iainfou
---

# Best practices for cluster isolation and resource management in Azure Kubernetes Service (AKS)


## Physical isolation

The most common approach to cluster isolation is to use physically separate AKS clusters. In this model, teams or projects are assigned their own AKS cluster. This approach often looks like the easiest way to isolate development teams, but adds additional overhead. You now have to maintain these multiple clusters, are billed for all the individual nodes, and have to individually provide access and assign permissions.

![Physical isolation of individual Kubernetes clusters in AKS](media/best-practices-cluster-isolation-resource-management/physical-isolation.png)

Physically separate clusters usually have a low pod density. As each team or project has their own AKS cluster, the cluster is often over-provisioned with compute resources, with a small number of pods scheduled on those nodes. Unused capacity on the nodes cannot be used for applications or services in development by other teams. These excess resources contribute to the additional costs in physically separate clusters.

## Logical isolation

Kubernetes offers logical isolation using *Namespaces*. With a namespace, you can safely isolate tenants for the following components:

- **Scheduler** - You can use resource quotas, discussed in the following sections, to define and enforce limits for the amount of CPU, memory, or storage that each tenant can consume within the cluster.
- **Authentication and authorization** - You can use Kubernetes role-based access controls (RBAC) to assign permissions to users and groups. As a best practice, you should also integrate with Azure Active Directory (AD) to provide a central way to manage those users, groups, permissions, and credentials.

![Logical isolation of a Kubernetes cluster in AKS](media/best-practices-cluster-isolation-resource-management/logical-isolation.png)

With logical isolation using namespaces, a single AKS cluster can be used for multiple development teams and a staging environment. Pods from these different teams can run on the same hosts as each other, but are logically separate and with their own resource quotas and access permissions in place. For production use, again you can use a single AKS cluster to support multiple application teams, all logically separated from each other.

Logical separation of clusters usually provides a higher pod density than physically isolated clusters. There is less execess compute capacity that sits idle in the cluster. When combined with the Kubernetes cluster autoscaler, you can scale the number of nodes up or down to meet demands. This best practice approach to autoscaling lets you run only the number of nodes required and minimizes costs.

## Resource requests and limits

A primary way to manage the compute resources within an AKS cluster is to use pod requests and limits. These requests and limits let the Kubernetes scheduler know what compute resources a pod should be assigned.

- **Pod requests** define a set amount of CPU and memory that the pod needs. These requests should be the amount of compute resources the pod needs to provide the desired level of performance.
    - When the Kubernetes scheduler tries to place a pod on a node, the pod requests are used to determine which node has sufficient resources available.
    - Monitor the performance of your application to adjust these requests to make sure you don't define less resources that required to maintain an acceptable level of performance.
- **Pod limits** are the maximum amount of CPU and memory that a pod can use. These limits help prevent one or two runaway pods from taking too much CPU and memory from the node, reducing the performance of the node and other pods that run on it.
    - Don't set a pod limit higher than your nodes can support. Each AKS node reserves a set amount of CPU and memory for the core Kubernetes components. Your application may try to consume too many resources on the node for other pods to successfully run.
    - Again, monitor the performance of your application at different times during the day or week. Determine when the peak demand is, and align the pod limits to the resources required to meet the application's needs.

In your pod specifications, it's best practice to define these requests and limits. Without these values, the Kubernetes scheduler doesn't understand what resources are needed, and may schedule the pod on a node without sufficient resources to provide acceptable application performance. You can also force pod specifications to include resource requests or limits by using resource quotas, discussed in the next section.

When you define a CPU request or limit, the value is measured in CPU units. In AKS, *1.0* CPU equates to one underlying virtual CPU core on the node. The same measurement is used for GPUs. You can also define a fractional request or limit, typically in millicpu. For example, *100m* is *0.1* of an underlying virtual CPU core.

In the following basic example for a single NGINX pod, the pod requests *100m* of CPU time, and *128Mi* of memory. The resource limits for the pod are set to *250m* CPU and *256Mi* memory:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: nginx:1.15.5
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
```

For more information about resource measurements and assignments, see [Managing compute resources for containers][k8s-resource-limits].

## Resource quotas

Resource requests and limits are placed in the pod specification and used at deployment time for the Kubernetes scheduler to find an available node in the cluster. These limits and requests work at the individual pod level. To provide a way to reserve and limit resources across a development team or project, you should also use *resource quotas*. These quotas are defined on a namespace, and can be used to set quotas on the following basis:

- **Compute resources**, such as CPU and memory, or GPUs.
- **Storage resources**, including the total number of volumes, persistent volume claims, or amount of disk space for a given storage class.
- **Object count**, such as maximum number of secrets, services, or jobs can be created.

Kubernetes does not overcommit resources. Once the cumulative total of resource requests or limits passes the assigned quota, no further deployments are successful.

When you define resource quotas, all pods created in the namespace must provide limits or requests in their pod specifications. If they don't provide these values, you can reject the deployment. Alternatively, you can [configure default requests and limits for a namespace][configure-default-quotas].

The following example YAML manifest named *dev-app-team-quotas.yaml* sets a hard limit of *10* CPUs and *20Gi* or memory:

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

For more information about available resource objects, scopes, and priorities, see [Resource quotas in Kubernetes][k8s-resource-quotas].

## kube-advisor

The [kube-advisor][kube-advisor] tool scans a Kubernetes cluster and reports on any issues that it finds. This tool helps identify pods that do not have resource requests and limits in place, for example.

Especially in an AKS cluster that hosts multiple development teams and applications, it can be hard to track pods without these resource requests and limits set. As a best practice, regularly run `kube-advisor` on your AKS clusters, especially if you don't assign resource quotas to namespaces.

## Visual Studio Code extension for Kubernetes

The [Visual Studio Code extension for Kubernetes][vscode-kubernetes] helps you develop and deploy applications to AKS. The extension provides intellisense for Kubernetes resources, as well as Helm charts and templates. You can also browse, deploy, and edit Kubernetes resources from within VS Code.

As a best practice, install the extension in VS Code and develop your YAML manifests using the editor. The extension also provides an intellisense check for resource requests or limits being set in the pod specifications.

## Azure Dev Spaces



## Next steps

<!-- EXTERNAL LINKS -->
[k8s-resource-limits]: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
[k8s-resource-quotas]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[configure-default-quotas]: https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/
[vscode-kubernetes]: https://github.com/Azure/vscode-kubernetes-tools
[kube-advisor]: https://github.com/Azure/kube-advisor

<!-- INTERNAL LINKS -->
