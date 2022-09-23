---
title: Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)
description: Learn how to vertically autoscale your pod on an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/22/2022
---

# Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)

This article provides an overview of Vertical Pod Autoscaler (VPA) (preview) in Azure Kubernetes Service (AKS), which is based on the open source [Kubernetes](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) version. When configured, it automatically sets resource requests and limits on containers per workload based on past usage. This ensures pods are scheduled onto nodes that have the required CPU and memory resources.  

## Benefits

Vertical Pod Autoscaler provides the following benefits:

* It analyzes and adjusts processor and memory resources to *right size* your applications. VPA is not only responsible for scaling up, but also for scaling down based on their resource use  over time.

* A Pod is evicted if it needs to change its resource requests based on if its scaling mode is set to *auto*

* Set CPU and memory constraints for individual containers by specifying a resource policy

* Ensures nodes have correct resources for pod scheduling

* Configurable logging of any adjustments to processor or memory resources made

* Improve cluster resource utilization and frees up CPU and memory for other pods.

## Limitations

* Vertical Pod autoscaling supports a maximum of 500 `VerticalPodAutoscaler` objects per cluster.
* With this preview release, you cannot change the `controllerValue` and `updateMode` fields.

## Before you begin

* You have an existing AKS cluster. If you don't, see [Getting started with Azure Kubernetes Service][get-started-with-aks].

* The Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* `kubectl` should be connected to the cluster you want to install VPA.

## API Object

The Virtical Pod Autoscaler is an API resource in the Kubernetes autoscaling API group. The version supported in this preview release is 0.11 can be found in the [Kubernetes autoscaler repo][github-autoscaler-repo-v011].

## Register the VPA provider feature

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-vpapreview preview feature, run the following command:

```azurecli
az feature register Microsoft.ContainerService/AKS-VPAPreview
```

## Deploy, upgrade, or disable VPA on a cluster

In this section, you deploy, upgrade, or disable the Vertical Pod Autoscaler on your cluster.

1. To enable VPA on a new cluster, use `--enable-vpa` parameter with the [az aks create][az-aks-create] command.

    ```azurecli
    az aks create -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Optionally, to enable VPA on an existing cluster, use the `--enable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. Optionally, to disable VPA on an existing cluster, use the `--disable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli
    az aks update -n myAKSCluster -g myResourceGroup --disable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

4. To verify that the Vertical Pod Autoscaler pods have been created successfully, use the [kubectl get][kubectl-get] command.

```bash
kubectl get pods -n kube-system
```

## Test your Vertical Pod Autoscaler installation

The following steps create a deployment with two pods, each running a single container that requests 100 millicores and tries to utilize slightly above 500 millicores. Also created is a VPA config pointing at the deployment. The VPA observes the behavior of the pods, and after about five minutes, they are updated with a higher CPU request.

1. Create a file named `hamster.yaml` and copy in the following manifest of the Vertical Pod Autoscaler example from the [kubernetes/autoscaler][kubernetes-autoscaler-github-repo] GitHub repository.

1. Deploy the `hamster.yaml` Vertical Pod Autoscaler example using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

    ```bash
    kubectl apply -f hamster.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

1. Run the following [kubectl get][kubectl-get] command to get the pods from the hamster example application:

    ```bash
    kubectl get pods -l app=hamster
    ```

    The example output resembles the following:

    ```bash
    hamster-c7d89d6db-rglf5   1/1     Running   0          48s
    hamster-c7d89d6db-znvz5   1/1     Running   0          48s
    ```

1. Use the [kubectl describe][kubectl-describe] command on one of the pods to view its CPU and memory reservation. Replace "example ID" with one of the IDs returned in your output from the previous step.

    ```bash
    kubectl describe pod hamster-<exampleID>
    ```

    The example output resembles the following:

    ```bash
    
    ```

    The pod has 100 millicpu and 50 Mibibytes of memory reserved in this example. For this sample application, the pod needs less than 100 millicpu to run, so there is no CPU capacity available. The pods also reserves much less memory than needed. The Vertical Pod Autoscaler *vpa-recommender* deployment analyzes the pods hosting the hamster application to see if the CPU and memory requirements are appropriate. If adjustments are needed, the vpa-updater relaunches the pods with updated values.

1. Wait for the vpa-updater to launch a new hamster pod. This should take a minute or two. You can monitor the pods using the [kubectl get][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ```

1. When a new hamster pod is started, describe the pod running the [kubectl describe][kubectl-describe] command and view the updated CPU and memory reservations.

    ```bash
    kubectl describe pod hamster-<exampleID>
    ```

    The example output resembles the following:

    ```bash
    
    ```

    In the previous output, you can see that the CPU reservation increased to 587 millicpu, which is over five times the original value. The memory increased to 262,144 Kilobytes, which is around 250 Mibibytes, or five times the original value. This pod was under-resourced, and the Vertical Pod Autoscaler corrected the estimate with a much more appropriate value.

1. To view updated recommendations from VPA, run the [kubectl describe][kubectl-describe] command to describe the hamster-vpa resource information.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

    The example output resembles the following:

    ```bash
    
    ```

## Set Pod Autoscaler requests automatically

Vertical Pod autoscaling uses the `VerticalPodAutoscaler` object to automatically set resource requests on Pods when the updateMode is set to **Auto**.

1. Enable VPA for your cluster by running the following command. Replace cluster name `myAKSCluster` with the name of your AKS cluster and replace `myResourceGroup` with the name of the resource group the cluster is hosted in.

    ```azurecli
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

2. Create a file named `azure-autodeploy.yaml`, and copy in the following manifest.

    ```yml
    apiVersion: apps/v1
kind: Deployment
metadata:
  name: azure-autodeploy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: azure-autodeploy
  template:
    metadata:
      labels:
        app: azure-autodeploy
    spec:
      containers:
      - name: mycontainer
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
        resources:
          requests:
            cpu: 100m
            memory: 50Mi
        command: ["/bin/sh"]
        args: ["-c", "while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done"]
    ```
    This manifest describes a deployment that has two Pods. Each Pod has one container that requests 100 milliCPU and 50 MiB of memory.

3. Create the pod with the [kubectl create][kubectl-create] command, as shown in the following example:

    ```bash
    kubectl create -f azure-autodeploy.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

4. Run the following [kubectl get][kubectl-get] command to get the pods:

    ```bash
    kubectl get pods
    ```

    The output resembles the following example showing the name and status of the pods:

    ```output
    ```

## Next steps

This article showed you how to automatically scale resource utilization, such as CPU and memory, of cluster nodes to match application requirements. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][scale-applications-in-aks].

<!-- EXTERNAL LINKS -->
[kubernetes-autoscaler-github-repo]: https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/examples/hamster.yaml
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[github-autoscaler-repo-v011]: https://github.com/kubernetes/autoscaler/blob/vpa-release-0.11/vertical-pod-autoscaler/pkg/apis/autoscaling.k8s.io/v1/types.go

<!-- INTERNAL LINKS -->
[get-started-with-aks]: /azure/architecture/reference-architectures/containers/aks-start-here
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[horizontal-pod-autoscaling]: concepts-scale.md#horizontal-pod-autoscaler
[scale-applications-in-aks]: tutorial-kubernetes-scale.md