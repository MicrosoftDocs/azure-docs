---
title: Resource management best practices for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the application developer best practices for resource management in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 05/25/2023
---

# Best practices for application developers to manage resources in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. The way you manage your application deployments can negatively impact the end-user experience of services you provide.

This article focuses on running your clusters and workloads from an application developer perspective. For information about administrative best practices, see [Cluster operator best practices for isolation and resource management in Azure Kubernetes Service (AKS)][operator-best-practices-isolation].

This article covers the following topics:

> [!div class="checklist"]
>
> * Pod resource requests and limits.
> * Ways to develop, debug, and deploy applications with Bridge to Kubernetes and Visual Studio Code.

## Define pod resource requests and limits

> **Best practice guidance**
>
> Set pod requests and limits on all pods in your YAML manifests. If the AKS cluster uses *resource quotas* and you don't define these values, your deployment may be rejected.

Use pod requests and limits to manage compute resources within an AKS cluster. Pod requests and limits inform the Kubernetes scheduler of the compute resources to assign to a pod.

### Pod CPU/Memory requests

*Pod requests* define a set amount of CPU and memory the pod needs regularly.

In your pod specifications, it's important you define these requests and limits based on the above information. If you don't include these values, the Kubernetes scheduler can't consider the resources your applications requires to help with scheduling decisions.

Monitor the performance of your application to adjust pod requests. If you underestimate pod requests, your application may receive degraded performance due to over-scheduling a node. If requests are overestimated, your application may have increased scheduling difficulty.

### Pod CPU/Memory limits

*Pod limits* set the maximum amount of CPU and memory a pod can use. *Memory limits* define which pods should be removed when nodes are unstable due to insufficient resources. Without proper limits set, pods are removed until resource pressure is lifted. While a pod may exceed the *CPU limit* periodically, the pod isn't removed for exceeding the CPU limit.

Pod limits define when a pod loses control of resource consumption. When it exceeds the limit, the pod is marked for removal. This behavior maintains node health and minimizes impact to pods sharing the node. If you don't set a pod limit, it defaults to the highest available value on a given node.

Avoid setting a pod limit higher than your nodes can support. Each AKS node reserves a set amount of CPU and memory for the core Kubernetes components. Your application may try to consume too many resources on the node for other pods to successfully run.

Monitor the performance of your application at different times during the day or week. Determine peak demand times and align the pod limits to the resources required to meet maximum needs.

> [!IMPORTANT]
>
> In your pod specifications, define these requests and limits based on the above information. Failing to include these values prevents the Kubernetes scheduler from accounting for resources your applications requires to help with scheduling decisions.

If the scheduler places a pod on a node with insufficient resources, application performance is degraded. Cluster administrators **must set *resource quotas*** on a namespace that requires you to set resource requests and limits. For more information, see [resource quotas on AKS clusters][resource-quotas].

When you define a CPU request or limit, the value is measured in CPU units.

* *1.0* CPU equates to one underlying virtual CPU core on the node.
  * The same measurement is used for GPUs.
* You can define fractions measured in millicores. For example, *100 m* is *0.1* of an underlying vCPU core.

In the following basic example for a single NGINX pod, the pod requests *100 m* of CPU time and *128Mi* of memory. The resource limits for the pod are set to *250 m* CPU and *256Mi* memory.

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

For more information about resource measurements and assignments, see [Managing compute resources for containers][k8s-resource-limits].

## Develop and debug applications against an AKS cluster

> **Best practice guidance**
>
> Development teams should deploy and debug against an AKS cluster using Bridge to Kubernetes.

With Bridge to Kubernetes, you can develop, debug, and test applications directly against an AKS cluster. Developers within a team collaborate to build and test throughout the application lifecycle. You can continue to use existing tools such as Visual Studio or Visual Studio Code with the Bridge to Kubernetes extension.

Using integrated development and test process with Bridge to Kubernetes reduces the need for local test environments like [minikube][minikube]. Instead, you develop and test against an AKS cluster, even in secured and isolated clusters.

> [!NOTE]
> Bridge to Kubernetes is intended for use with applications running on Linux pods and nodes.

## Use the Visual Studio Code (VS Code) extension for Kubernetes

> **Best practice guidance**
>
> Install and use the VS Code extension for Kubernetes when you write YAML manifests. You can also use the extension for integrated deployment solution, which may help application owners that infrequently interact with the AKS cluster.

The [Visual Studio Code extension for Kubernetes][vscode-kubernetes] helps you develop and deploy applications to AKS. The extension provides the following features:

* Intellisense for Kubernetes resources, Helm charts, and templates.
* The ability to browse, deploy, and edit capabilities for Kubernetes resources from within VS Code.
* Intellisense checks for resource requests or limits being set in the pod specifications:

    ![VS Code extension for Kubernetes warning about missing memory limits](media/developer-best-practices-resource-management/vs-code-kubernetes-extension.png)

## Next steps

This article focused on how to run your cluster and workloads from a cluster operator perspective. For information about administrative best practices, see [Cluster operator best practices for isolation and resource management in Azure Kubernetes Service (AKS)][operator-best-practices-isolation].

To implement some of these best practices, see [Develop with Bridge to Kubernetes][btk].

<!-- EXTERNAL LINKS -->
[k8s-resource-limits]: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
[vscode-kubernetes]: https://github.com/Azure/vscode-kubernetes-tools
[minikube]: https://kubernetes.io/docs/setup/minikube/

<!-- INTERNAL LINKS -->
[btk]: /visualstudio/containers/overview-bridge-to-kubernetes
[operator-best-practices-isolation]: operator-best-practices-cluster-isolation.md
[resource-quotas]: operator-best-practices-scheduler.md#enforce-resource-quotas
