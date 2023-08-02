---
title: Use GPUs on Azure Kubernetes Service (AKS)
description: Learn how to use GPUs for high performance compute or graphics-intensive workloads on Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.date: 04/10/2023
#Customer intent: As a cluster administrator or developer, I want to create an AKS cluster that can use high-performance GPU-based VMs for compute-intensive workloads.
---

# Use GPUs for compute-intensive workloads on Azure Kubernetes Service (AKS)

Graphical processing units (GPUs) are often used for compute-intensive workloads, such as graphics and visualization workloads. AKS supports GPU-enabled Linux node pools to run compute-intensive Kubernetes workloads. For more information on available GPU-enabled VMs, see [GPU-optimized VM sizes in Azure][gpu-skus]. For AKS node pools, we recommend a minimum size of *Standard_NC6*. The NVv4 series (based on AMD GPUs) aren't supported with AKS.

This article helps you provision nodes with schedulable GPUs on new and existing AKS clusters.

> [!NOTE]
> GPU-enabled VMs contain specialized hardware subject to higher pricing and region availability. For more information, see the [pricing][azure-pricing] tool and [region availability][azure-availability].

## Before you begin

* This article assumes you have an existing AKS cluster. If you don't have a cluster, create one using the [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal].
* You also need the Azure CLI version 2.0.64 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

> [!NOTE]
> If using an Azure Linux GPU node pool, automatic security patches aren't applied, and the default behavior for the cluster is *Unmanaged*. For more information, see [Using node OS auto-upgrade](./auto-upgrade-node-image.md#using-node-os-auto-upgrade).

## Get the credentials for your cluster

* Get the credentials for your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following example command gets the credentials for the *myAKSCluster* in the *myResourceGroup* resource group:

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Add the NVIDIA device plugin

There are two ways to add the NVIDIA device plugin:

1. [Using the AKS GPU image](#update-your-cluster-to-use-the-aks-gpu-image-preview)
2. [Manually installing the NVIDIA device plugin](#manually-install-the-nvidia-device-plugin)

> [!WARNING]
> We don't recommend manually installing the NVIDIA device plugin daemon set with clusters using the AKS GPU image.

### Update your cluster to use the AKS GPU image (preview)

> [!NOTE]
> If using an Azure Linux GPU node pool, automatic security patches aren't applied, and the default behavior for the cluster is *Unmanaged*. For more information, see [Using node OS auto-upgrade](./auto-upgrade-node-image.md#using-node-os-auto-upgrade).

AKS provides a fully configured AKS image containing the [NVIDIA device plugin for Kubernetes][nvidia-github].

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the `aks-preview` Azure CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

3. Register the `GPUDedicatedVHDPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "GPUDedicatedVHDPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

4. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "GPUDedicatedVHDPreview"
    ```

5. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

#### Add a node pool for GPU nodes

Now that you updated your cluster to use the AKS GPU image, you can add a node pool for GPU nodes to your cluster.

* Add a node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name gpunp \
        --node-count 1 \
        --node-vm-size Standard_NC6 \
        --node-taints sku=gpu:NoSchedule \
        --aks-custom-headers UseGPUDedicatedVHD=true \
        --enable-cluster-autoscaler \
        --min-count 1 \
        --max-count 3
    ```

  The previous example command adds a node pool named *gpunp* to *myAKSCluster* in *myResourceGroup* and uses parameters to configure the following node pool settings:

  * `--node-vm-size`: Sets the VM size for the node in the node pool to *Standard_NC6*.
  * `--node-taints`: Specifies a *sku=gpu:NoSchedule* taint on the node pool.
  * `--aks-custom-headers`: Specifies a specialized AKS GPU image, *UseGPUDedicatedVHD=true*. If your GPU sku requires generation 2 VMs, use *--aks-custom-headers UseGPUDedicatedVHD=true,usegen2vm=true* instead.
  * `--enable-cluster-autoscaler`: Enables the cluster autoscaler.
  * `--min-count`: Configures the cluster autoscaler to maintain a minimum of one node in the node pool.
  * `--max-count`: Configures the cluster autoscaler to maintain a maximum of three nodes in the node pool.

    > [!NOTE]
    > Taints and VM sizes can only be set for node pools during node pool creation, but you can update autoscaler settings at any time.

### Manually install the NVIDIA device plugin

You can deploy a DaemonSet for the NVIDIA device plugin, which runs a pod on each node to provide the required drivers for the GPUs.

1. Add a node pool to your cluster using the  [`az aks nodepool add`][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name gpunp \
        --node-count 1 \
        --node-vm-size Standard_NC6 \
        --node-taints sku=gpu:NoSchedule \
        --enable-cluster-autoscaler \
        --min-count 1 \
        --max-count 3
    ```

    The previous example command adds a node pool named *gpunp* to *myAKSCluster* in *myResourceGroup* and uses parameters to configure the following node pool settings:

    * `--node-vm-size`: Sets the VM size for the node in the node pool to *Standard_NC6*.
    * `--node-taints`: Specifies a *sku=gpu:NoSchedule* taint on the node pool.
    * `--enable-cluster-autoscaler`: Enables the cluster autoscaler.
    * `--min-count`: Configures the cluster autoscaler to maintain a minimum of one node in the node pool.
    * `--max-count`: Configures the cluster autoscaler to maintain a maximum of three nodes in the node pool.

    > [!NOTE]
    > Taints and VM sizes can only be set for node pools during node pool creation, but you can update autoscaler settings at any time.

2. Create a namespace using the [`kubectl create namespace`][kubectl-create] command.

    ```console
    kubectl create namespace gpu-resources
    ```

3. Create a file named *nvidia-device-plugin-ds.yaml* and paste the following YAML manifest provided as part of the [NVIDIA device plugin for Kubernetes project][nvidia-github]:

    ```yaml
    apiVersion: apps/v1
    kind: DaemonSet
    metadata:
      name: nvidia-device-plugin-daemonset
      namespace: gpu-resources
    spec:
      selector:
        matchLabels:
          name: nvidia-device-plugin-ds
      updateStrategy:
        type: RollingUpdate
      template:
        metadata:
          # Mark this pod as a critical add-on; when enabled, the critical add-on scheduler
          # reserves resources for critical add-on pods so that they can be rescheduled after
          # a failure.  This annotation works in tandem with the toleration below.
          annotations:
            scheduler.alpha.kubernetes.io/critical-pod: ""
          labels:
            name: nvidia-device-plugin-ds
        spec:
          tolerations:
          # Allow this pod to be rescheduled while the node is in "critical add-ons only" mode.
          # This, along with the annotation above marks this pod as a critical add-on.
          - key: CriticalAddonsOnly
            operator: Exists
          - key: nvidia.com/gpu
            operator: Exists
            effect: NoSchedule
          - key: "sku"
            operator: "Equal"
            value: "gpu"
            effect: "NoSchedule"
          containers:
          - image: mcr.microsoft.com/oss/nvidia/k8s-device-plugin:1.11
            name: nvidia-device-plugin-ctr
            securityContext:
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            volumeMounts:
              - name: device-plugin
                mountPath: /var/lib/kubelet/device-plugins
          volumes:
            - name: device-plugin
              hostPath:
                path: /var/lib/kubelet/device-plugins
    ```

4. Create the DaemonSet and confirm the NVIDIA device plugin is created successfully using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl apply -f nvidia-device-plugin-ds.yaml
    ```

## Confirm that GPUs are schedulable

After creating your cluster, confirm that GPUs are schedulable in Kubernetes.

1. List the nodes in your cluster using the [`kubectl get nodes`][kubectl-get] command.

    ```console
    kubectl get nodes
    ```

    Your output should look similar to the following example output:

    ```console
    NAME                   STATUS   ROLES   AGE   VERSION
    aks-gpunp-28993262-0   Ready    agent   13m   v1.20.7
    ```

2. Confirm the GPUs are schedulable using the [`kubectl describe node`][kubectl-describe] command.

    ```console
    kubectl describe node aks-gpunp-28993262-0
    ```

    Under the *Capacity* section, the GPU should list as `nvidia.com/gpu:  1`. Your output should look similar to the following condensed example output:

    ```console
    Name:               aks-gpunp-28993262-0
    Roles:              agent
    Labels:             accelerator=nvidia

    [...]

    Capacity:
    [...]
     nvidia.com/gpu:                 1
    [...]
    ```

## Run a GPU-enabled workload

To see the GPU in action, you can schedule a GPU-enabled workload with the appropriate resource request. In this example, we'll run a [Tensorflow](https://www.tensorflow.org/) job against the [MNIST dataset](http://yann.lecun.com/exdb/mnist/).

1. Create a file named *samples-tf-mnist-demo.yaml* and paste the following YAML manifest, which includes a resource limit of `nvidia.com/gpu: 1`:

    > [!NOTE]
    > If you receive a version mismatch error when calling into drivers, such as "CUDA driver version is insufficient for CUDA runtime version", review the [NVIDIA driver matrix compatibility chart](https://docs.nvidia.com/deploy/cuda-compatibility/index.html).

    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      labels:
        app: samples-tf-mnist-demo
      name: samples-tf-mnist-demo
    spec:
      template:
        metadata:
          labels:
            app: samples-tf-mnist-demo
        spec:
          containers:
          - name: samples-tf-mnist-demo
            image: mcr.microsoft.com/azuredocs/samples-tf-mnist-demo:gpu
            args: ["--max_steps", "500"]
            imagePullPolicy: IfNotPresent
            resources:
              limits:
               nvidia.com/gpu: 1
          restartPolicy: OnFailure
          tolerations:
          - key: "sku"
            operator: "Equal"
            value: "gpu"
            effect: "NoSchedule"
    ```

2. Run the job using the [`kubectl apply`][kubectl-apply] command, which parses the manifest file and creates the defined Kubernetes objects.

    ```console
    kubectl apply -f samples-tf-mnist-demo.yaml
    ```

## View the status of the GPU-enabled workload

1. Monitor the progress of the job using the [`kubectl get jobs`][kubectl-get] command with the `--watch` flag. It may take a few minutes to first pull the image and process the dataset.

    ```console
    kubectl get jobs samples-tf-mnist-demo --watch
    ```

    When the *COMPLETIONS* column shows *1/1*, the job has successfully finished, as shown in the following example output:

    ```console
    NAME                    COMPLETIONS   DURATION   AGE

    samples-tf-mnist-demo   0/1           3m29s      3m29s
    samples-tf-mnist-demo   1/1   3m10s   3m36s
    ```

2. Exit the `kubectl --watch` process with *Ctrl-C*.

3. Get the name of the pod using the [`kubectl get pods`][kubectl-get] command.

    ```console
    kubectl get pods --selector app=samples-tf-mnist-demo
    ```

4. View the output of the GPU-enabled workload using the [`kubectl logs`][kubectl-logs] command.

    ```console
    kubectl logs samples-tf-mnist-demo-smnr6
    ```

    The following condensed example output of the pod logs confirms that the appropriate GPU device, `Tesla K80`, has been discovered:

    ```console
    2019-05-16 16:08:31.258328: I tensorflow/core/platform/cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
    2019-05-16 16:08:31.396846: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1030] Found device 0 with properties: 
    name: Tesla K80 major: 3 minor: 7 memoryClockRate(GHz): 0.8235
    pciBusID: 2fd7:00:00.0
    totalMemory: 11.17GiB freeMemory: 11.10GiB
    2019-05-16 16:08:31.396886: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1120] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: Tesla K80, pci bus id: 2fd7:00:00.0, compute capability: 3.7)
    2019-05-16 16:08:36.076962: I tensorflow/stream_executor/dso_loader.cc:139] successfully opened CUDA library libcupti.so.8.0 locally
    Successfully downloaded train-images-idx3-ubyte.gz 9912422 bytes.
    Extracting /tmp/tensorflow/input_data/train-images-idx3-ubyte.gz
    Successfully downloaded train-labels-idx1-ubyte.gz 28881 bytes.
    Extracting /tmp/tensorflow/input_data/train-labels-idx1-ubyte.gz
    Successfully downloaded t10k-images-idx3-ubyte.gz 1648877 bytes.
    Extracting /tmp/tensorflow/input_data/t10k-images-idx3-ubyte.gz
    Successfully downloaded t10k-labels-idx1-ubyte.gz 4542 bytes.
    Extracting /tmp/tensorflow/input_data/t10k-labels-idx1-ubyte.gz
    Accuracy at step 0: 0.1081
    Accuracy at step 10: 0.7457
    Accuracy at step 20: 0.8233
    Accuracy at step 30: 0.8644
    Accuracy at step 40: 0.8848
    Accuracy at step 50: 0.8889
    Accuracy at step 60: 0.8898
    Accuracy at step 70: 0.8979
    Accuracy at step 80: 0.9087
    Accuracy at step 90: 0.9099
    Adding run metadata for 99
    Accuracy at step 100: 0.9125
    Accuracy at step 110: 0.9184
    Accuracy at step 120: 0.922
    Accuracy at step 130: 0.9161
    Accuracy at step 140: 0.9219
    Accuracy at step 150: 0.9151
    Accuracy at step 160: 0.9199
    Accuracy at step 170: 0.9305
    Accuracy at step 180: 0.9251
    Accuracy at step 190: 0.9258
    Adding run metadata for 199
    [...]
    Adding run metadata for 499
    ```

## Use Container Insights to monitor GPU usage

[Container Insights with AKS][aks-container-insights] monitors the following GPU usage metrics:

| Metric name | Metric dimension (tags) | Description |
|-------------|-------------------------|-------------|
| containerGpuDutyCycle | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `containerName`, `gpuId`, `gpuModel`, `gpuVendor`| Percentage of time over the past sample period (60 seconds) during which GPU was busy/actively processing for a container. Duty cycle is a number between 1 and 100. |
| containerGpuLimits | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `containerName` | Each container can specify limits as one or more GPUs. It is not possible to request or limit a fraction of a GPU. |
| containerGpuRequests | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `containerName` | Each container can request one or more GPUs. It is not possible to request or limit a fraction of a GPU. |
| containerGpumemoryTotalBytes | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `containerName`, `gpuId`, `gpuModel`, `gpuVendor` | Amount of GPU Memory in bytes available to use for a specific container. |
| containerGpumemoryUsedBytes | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `containerName`, `gpuId`, `gpuModel`, `gpuVendor` | Amount of GPU Memory in bytes used by a specific container. |
| nodeGpuAllocatable | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `gpuVendor` | Number of GPUs in a node that can be used by Kubernetes. |
| nodeGpuCapacity | `container.azm.ms/clusterId`, `container.azm.ms/clusterName`, `gpuVendor` | Total Number of GPUs in a node. |

## Clean up resources

* Remove the associated Kubernetes objects you created in this article using the [`kubectl delete job`][kubectl delete] command.

    ```console
    kubectl delete jobs samples-tf-mnist-demo
    ```

## Next steps

* To run Apache Spark jobs, see [Run Apache Spark jobs on AKS][aks-spark].
* For more information on features of the Kubernetes scheduler, see [Best practices for advanced scheduler features in AKS][advanced-scheduler-aks].
* For more information on Azure Kubernetes Service and Azure Machine Learning, see:
  * [Configure a Kubernetes cluster for ML model training or deployment][azureml-aks].
  * [Deploy a model with an online endpoint][azureml-deploy].
  * [High-performance serving with Triton Inference Server][azureml-triton].
  * [Labs for Kubernetes and Kubeflow][kubeflow].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubeflow]: https://github.com/Azure/kubeflow-labs
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[kubectl delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[azure-pricing]: https://azure.microsoft.com/pricing/
[azure-availability]: https://azure.microsoft.com/global-infrastructure/services/
[nvidia-github]: https://github.com/NVIDIA/k8s-device-plugin

<!-- LINKS - internal -->
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-spark]: spark-job.md
[gpu-skus]: ../virtual-machines/sizes-gpu.md
[install-azure-cli]: /cli/azure/install-azure-cli
[azureml-aks]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[azureml-deploy]: ../machine-learning/how-to-deploy-managed-online-endpoints.md
[azureml-triton]: ../machine-learning/how-to-deploy-with-triton.md
[aks-container-insights]: monitor-aks.md#integrations
[advanced-scheduler-aks]: operator-best-practices-advanced-scheduler.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
