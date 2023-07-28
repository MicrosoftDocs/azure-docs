---
title: Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)
description: Learn how to vertically autoscale your pod on an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 03/17/2023
---

# Vertical Pod Autoscaling (preview) in Azure Kubernetes Service (AKS)

This article provides an overview of Vertical Pod Autoscaler (VPA) (preview) in Azure Kubernetes Service (AKS), which is based on the open source [Kubernetes](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) version. When configured, it automatically sets resource requests and limits on containers per workload based on past usage. VPA makes certain pods are scheduled onto nodes that have the required CPU and memory resources.  

## Benefits

Vertical Pod Autoscaler provides the following benefits:

* It analyzes and adjusts processor and memory resources to *right size* your applications. VPA isn't only responsible for scaling up, but also for scaling down based on their resource use over time.

* A Pod is evicted if it needs to change its resource requests if its scaling mode is set to *auto* or *recreate*.

* Set CPU and memory constraints for individual containers by specifying a resource policy

* Ensures nodes have correct resources for pod scheduling

* Configurable logging of any adjustments to processor or memory resources made

* Improve cluster resource utilization and frees up CPU and memory for other pods.

## Limitations

* Vertical Pod autoscaling supports a maximum of 500 `VerticalPodAutoscaler` objects per cluster.
* With this preview release, you can't change the `controlledValue` and `updateMode`  of `managedCluster` object.

## Before you begin

* AKS cluster is running Kubernetes version 1.24 and higher.

* The Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* `kubectl` should be connected to the cluster you want to install VPA.

## API Object

The Vertical Pod Autoscaler is an API resource in the Kubernetes autoscaling API group. The version supported in this preview release is 0.11 can be found in the [Kubernetes autoscaler repo][github-autoscaler-repo-v011].

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

## Register the 'AKS-VPAPreview' feature flag

Register the `AKS-VPAPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-VPAPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AKS-VPAPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Deploy, upgrade, or disable VPA on a cluster

In this section, you deploy, upgrade, or disable the Vertical Pod Autoscaler on your cluster.

1. To enable VPA on a new cluster, use `--enable-vpa` parameter with the [az aks create][az-aks-create] command.

    ```azurecli-interactive
    az aks create -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Optionally, to enable VPA on an existing cluster, use the `--enable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. Optionally, to disable VPA on an existing cluster, use the `--disable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --disable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

4. To verify that the Vertical Pod Autoscaler pods have been created successfully, use the [kubectl get][kubectl-get] command.

```bash
kubectl get pods -n kube-system
```

The output of the command includes the following results specific to the VPA pods. The pods should show a *running* status.

```output
NAME                                        READY   STATUS    RESTARTS   AGE
vpa-admission-controller-7867874bc5-vjfxk   1/1     Running   0          41m
vpa-recommender-5fd94767fb-ggjr2            1/1     Running   0          41m
vpa-updater-56f9bfc96f-jgq2g                1/1     Running   0          41m
```

## Test your Vertical Pod Autoscaler installation

The following steps create a deployment with two pods, each running a single container that requests 100 millicores and tries to utilize slightly above 500 millicores. Also created is a VPA config pointing at the deployment. The VPA observes the behavior of the pods, and after about five minutes, they're updated with a higher CPU request.

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

    ```output
    hamster-78f9dcdd4c-hf7gk   1/1     Running   0          24s
    hamster-78f9dcdd4c-j9mc7   1/1     Running   0          24s
    ```

1. Use the [kubectl describe][kubectl-describe] command on one of the pods to view its CPU and memory reservation. Replace "exampleID" with one of the pod IDs returned in your output from the previous step.

    ```bash
    kubectl describe pod hamster-exampleID
    ```

    The example output is a snippet of the information about the cluster:

    ```output
     hamster:
        Container ID:  containerd://
        Image:         k8s.gcr.io/ubuntu-slim:0.1
        Image ID:      sha256:
        Port:          <none>
        Host Port:     <none>
        Command:
          /bin/sh
        Args:
          -c
          while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done
        State:          Running
          Started:      Wed, 28 Sep 2022 15:06:14 -0400
        Ready:          True
        Restart Count:  0
        Requests:
          cpu:        100m
          memory:     50Mi
        Environment:  <none>
    ```

    The pod has 100 millicpu and 50 Mibibytes of memory reserved in this example. For this sample application, the pod needs less than 100 millicpu to run, so there's no CPU capacity available. The pods also reserves much less memory than needed. The Vertical Pod Autoscaler *vpa-recommender* deployment analyzes the pods hosting the hamster application to see if the CPU and memory requirements are appropriate. If adjustments are needed, the vpa-updater relaunches the pods with updated values.

1. Wait for the vpa-updater to launch a new hamster pod, which should take a few minutes. You can monitor the pods using the [kubectl get][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ```

1. When a new hamster pod is started, describe the pod running the [kubectl describe][kubectl-describe] command and view the updated CPU and memory reservations.

    ```bash
    kubectl describe pod hamster-<exampleID>
    ```

    The example output is a snippet of the information describing the pod:

    ```output
    State:          Running
      Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    ```

    In the previous output, you can see that the CPU reservation increased to 587 millicpu, which is over five times the original value. The memory increased to 262,144 Kilobytes, which is around 250 Mibibytes, or five times the original value. This pod was under-resourced, and the Vertical Pod Autoscaler corrected the estimate with a much more appropriate value.

1. To view updated recommendations from VPA, run the [kubectl describe][kubectl-describe] command to describe the hamster-vpa resource information.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

    The example output is a snippet of the information about the resource utilization:

    ```output
     State:          Running
      Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    ```

## Set Pod Autoscaler requests automatically

Vertical Pod autoscaling uses the `VerticalPodAutoscaler` object to automatically set resource requests on Pods when the updateMode is set to **Auto** or **Recreate**.

1. Enable VPA for your cluster by running the following command. Replace cluster name `myAKSCluster` with the name of your AKS cluster and replace `myResourceGroup` with the name of the resource group the cluster is hosted in.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

2. Create a file named `azure-autodeploy.yaml`, and copy in the following manifest.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: vpa-auto-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: vpa-auto-deployment
      template:
        metadata:
          labels:
            app: vpa-auto-deployment
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
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-kchc5   1/1     Running   0          52s
    vpa-auto-deployment-54465fb978-nhtmj   1/1     Running   0          52s
    ```

5. Create a file named `azure-vpa-auto.yaml`, and copy in the following manifest that describes a `VerticalPodAutoscaler`:

    ```yml
    apiVersion: autoscaling.k8s.io/v1
    kind: VerticalPodAutoscaler
    metadata:
      name: vpa-auto
    spec:
      targetRef:
        apiVersion: "apps/v1"
        kind:       Deployment
        name:       vpa-auto-deployment
      updatePolicy:
        updateMode: "Auto"
    ```

    The `targetRef.name` value specifies that any Pod that is controlled by a deployment named `vpa-auto-deployment` belongs to this `VerticalPodAutoscaler`. The `updateMode` value of `Auto` means that the Vertical Pod Autoscaler controller can delete a Pod, adjust the CPU and memory requests, and then start a new Pod.

6. Apply the manifest to the cluster using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl create -f azure-vpa-auto.yaml
    ```

7. Wait a few minutes, and view the running Pods again by running the following [kubectl get][kubectl-get] command:

    ```bash
    kubectl get pods
    ```

    The output resembles the following example showing the pod names have changed and status of the pods:

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-qbhc4   1/1     Running   0          2m49s
    vpa-auto-deployment-54465fb978-vbj68   1/1     Running   0          109s
    ```

8. Get detailed information about one of your running Pods by using the [Kubectl get][kubectl-get] command. Replace `podName` with the name of one of your Pods that you retrieved in the previous step.

    ```bash
    kubectl get pod podName --output yaml
    ```

    The output resembles the following example, showing that the Vertical Pod Autoscaler controller has increased the memory request to 262144k and CPU request to 25 milliCPU.

    ```output
    apiVersion: v1
    kind: Pod
    metadata:
      annotations:
        vpaObservedContainers: mycontainer
        vpaUpdates: 'Pod resources updated by vpa-auto: container 0: cpu request, memory
          request'
      creationTimestamp: "2022-09-29T16:44:37Z"
      generateName: vpa-auto-deployment-54465fb978-
      labels:
        app: vpa-auto-deployment

    spec:
      containers:
      - args:
        - -c
        - while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done
        command:
        - /bin/sh
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
        imagePullPolicy: IfNotPresent
        name: mycontainer
        resources:
          requests:
            cpu: 25m
            memory: 262144k
    ```

9. To get detailed information about the Vertical Pod Autoscaler and its recommendations for CPU and memory, use the [kubectl get][kubectl-get] command:

    ```bash
    kubectl get vpa vpa-auto --output yaml
    ```

    The output resembles the following example:

    ```output
     recommendation:
      containerRecommendations:
      - containerName: mycontainer
        lowerBound:
          cpu: 25m
          memory: 262144k
        target:
          cpu: 25m
          memory: 262144k
        uncappedTarget:
          cpu: 25m
          memory: 262144k
        upperBound:
          cpu: 230m
          memory: 262144k
    ```

    The results show the `target` attribute specifies that for the container to run optimally, it doesn't need to change the CPU or the memory target. Your results may vary where the target CPU and memory recommendation are higher.

    The Vertical Pod Autoscaler uses the `lowerBound` and `upperBound` attributes to decide whether to delete a Pod and replace it with a new Pod. If a Pod has requests less than the lower bound or greater than the upper bound, the Vertical Pod Autoscaler deletes the Pod and replaces it with a Pod that meets the target attribute.

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
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
