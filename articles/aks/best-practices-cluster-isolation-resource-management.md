---
title: Best practices - Cluster and resources in Azure Kubernetes Services (AKS)
description: Learn the best practices for cluster isolation and resource management in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: iainfou
---

# Best practices for cluster isolation and resource management in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how to run your cluster and workloads. You learn:

> [!div class="checklist"]
> * How and why to use physical or logical cluster isolation
> * What are pod resource requests and limits
> * How to set resource quotas for a namespace
> * Ways to develop and deploy applications with Dev Spaces and Visual Studio Code
> * How to use the `kube-advisor` to check for issues with deployments

## Logically isolate clusters

Kubernetes offers logical isolation using *Namespaces*. With a namespace, you can safely isolate tenants for the following components:

* **Scheduler** - You can use resource quotas, discussed in the following sections, to define and enforce limits for the amount of CPU, memory, or storage that each tenant can consume within the cluster.
* **Authentication and authorization** - You can use Kubernetes role-based access controls (RBAC) to assign permissions to users and groups. As a best practice, you should also integrate with Azure Active Directory (AD) to provide a central way to manage those users, groups, permissions, and credentials.

![Logical isolation of a Kubernetes cluster in AKS](media/best-practices-cluster-isolation-resource-management/logical-isolation.png)

With logical isolation using namespaces, a single AKS cluster can be used for multiple development teams and a staging environment. Pods from these different teams can run on the same hosts as each other, but are logically separate and with their own resource quotas and access permissions in place. For production use, you can use a single AKS cluster to support multiple application teams, all logically separated from each other.

Logical separation of clusters usually provides a higher pod density than physically isolated clusters. There is less excess compute capacity that sits idle in the cluster. When combined with the Kubernetes cluster autoscaler, you can scale the number of nodes up or down to meet demands. This best practice approach to autoscaling lets you run only the number of nodes required and minimizes costs.

**Best practice guidance** - Use logical isolation to separate teams and projects. You can use logical isolation alongside physical isolation, but try to minimize the number of physical AKS clusters you deploy just to separate teams or applications.

## Physically isolate clusters

A common alternative approach to cluster isolation is to use physically separate AKS clusters. In this isolation model, teams or projects are assigned their own AKS cluster. This approach often looks like the easiest way to isolate development teams, but adds additional management and financial overhead. You now have to maintain these multiple clusters, are billed for all the individual nodes, and have to individually provide access and assign permissions.

![Physical isolation of individual Kubernetes clusters in AKS](media/best-practices-cluster-isolation-resource-management/physical-isolation.png)

Physically separate clusters usually have a low pod density. As each team or project has their own AKS cluster, the cluster is often over-provisioned with compute resources, with a small number of pods scheduled on those nodes. Unused capacity on the nodes cannot be used for applications or services in development by other teams. These excess resources contribute to the additional costs in physically separate clusters.

**Best practice guidance** - Minimize the use of physical isolation for each separate team or application deployment. Instead, use *logical* isolation, as discussed in the previous section.

## Define pod resource requests and limits

A primary way to manage the compute resources within an AKS cluster is to use pod requests and limits. These requests and limits let the Kubernetes scheduler know what compute resources a pod should be assigned.

* **Pod requests** define a set amount of CPU and memory that the pod needs. These requests should be the amount of compute resources the pod needs to provide the desired level of performance.
    * When the Kubernetes scheduler tries to place a pod on a node, the pod requests are used to determine which node has sufficient resources available.
    * Monitor the performance of your application to adjust these requests to make sure you don't define less resources that required to maintain an acceptable level of performance.
* **Pod limits** are the maximum amount of CPU and memory that a pod can use. These limits help prevent one or two runaway pods from taking too much CPU and memory from the node, reducing the performance of the node and other pods that run on it.
    * Don't set a pod limit higher than your nodes can support. Each AKS node reserves a set amount of CPU and memory for the core Kubernetes components. Your application may try to consume too many resources on the node for other pods to successfully run.
    * Again, monitor the performance of your application at different times during the day or week. Determine when the peak demand is, and align the pod limits to the resources required to meet the application's needs.

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

**Best practice guidance** - Set pod requests and limits on all pods in your YAML manifests. If the AKS cluster uses *resource quotas*, discussed in the next section, you can reject deployments that don't define these values.

## Enforce resource quotas

Resource requests and limits are placed in the pod specification and used at deployment time for the Kubernetes scheduler to find an available node in the cluster. These limits and requests work at the individual pod level. To provide a way to reserve and limit resources across a development team or project, you should also use *resource quotas*. These quotas are defined on a namespace, and can be used to set quotas on the following basis:

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

For more information about available resource objects, scopes, and priorities, see [Resource quotas in Kubernetes][k8s-resource-quotas].

**Best practice guidance** - Plan and apply resource quotas at the namespace level. If pods don't define resource requests and limits, reject the deployment. Monitor resource usage and adjust quotas as needed.

## Develop and debug applications against an AKS cluster

With Azure Dev Spaces, you can develop, debug, and test applications directly against an AKS cluster. Developers within a team can work together to build and test throughout the application lifecycle. You can continue to use existing tools such as Visual Studio or Visual Studio Code. An extension is installed for Dev Spaces that gives an option to run and debug the application in an AKS cluster:

![Debug applications in an AKS cluster with Dev Spaces](media/best-practices-cluster-isolation-resource-management/dev-spaces-debug.png)

This integrated development and test process with Dev Spaces reduces the need for local test environments, such as [minikube][minikube]. Instead, you develop and test against an AKS cluster, which can also be secured and isolated as noted in previous section on the use of namespaces to logically isolate a cluster. When your apps are ready to deploy to production, you can confidently deploy as your development was all done against a real AKS cluster.

**Best practice guidance** - Development teams should deploy and debug against an AKS cluster using Dev Spaces. This development model ensures that role-based access controls, network, or storage needs are implemented before the app is deployed to production.

## Regularly check for cluster issues with kube-advisor

The [kube-advisor][kube-advisor] tool scans a Kubernetes cluster and reports on issues that it finds. This tool helps identify pods that do not have resource requests and limits in place, for example.

Especially in an AKS cluster that hosts multiple development teams and applications, it can be hard to track pods without these resource requests and limits set. As a best practice, regularly run `kube-advisor` on your AKS clusters, especially if you don't assign resource quotas to namespaces.

**Best practice guidance** - Regularly run the latest version of `kube-advisor` to detect issues in your cluster. If you apply resource quotas on an existing AKS cluster, run `kube-advisor` first to find pods that don't have resource requests and limits defined. Check for issues with kube-advisor][aks-kubeadvisor]

## Use the Visual Studio Code extension for Kubernetes

The [Visual Studio Code extension for Kubernetes][vscode-kubernetes] helps you develop and deploy applications to AKS. The extension provides intellisense for Kubernetes resources, as well as Helm charts and templates. You can also browse, deploy, and edit Kubernetes resources from within VS Code. The extension also provides an intellisense check for resource requests or limits being set in the pod specifications:

![VS Code extension for Kubernetes warning about missing memory limits](media/best-practices-cluster-isolation-resource-management/vs-code-kubernetes-extension.png)

**Best practice guidance** - Install and use the VS Code extension for Kubernetes when you write YAML manifests. You can also use the extension for integrated deployment solution, which may help application owners that infrequently interact with the AKS cluster.

## Next steps

This best practices article focused on how to run your cluster and workloads. To implement some of these best practices, see the following articles:

- [Enable Azure Active Directory (AD) integration][aks-azuread]
- [Check for issues with kube-advisor][aks-kubeadvisor]
- [Develop with Dev Spaces][dev-spaces]

<!-- EXTERNAL LINKS -->
[k8s-resource-limits]: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
[k8s-resource-quotas]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[configure-default-quotas]: https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/
[vscode-kubernetes]: https://github.com/Azure/vscode-kubernetes-tools
[kube-advisor]: https://github.com/Azure/kube-advisor
[minikube]: https://kubernetes.io/docs/setup/minikube/

<!-- INTERNAL LINKS -->
[aks-azuread]: aad-integration.md
[aks-kubeadvisor]: kube-advisor-tool.md
[dev-spaces]: ../dev-spaces/get-started-netcore.md
