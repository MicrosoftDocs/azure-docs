---
title: Pod Sandboxing (preview) with Azure Kubernetes Service (AKS)
description: Learn about and deploy Pod Sandboxing (preview), also referred to as Kernel Isolation, on an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli, build-2023, devx-track-linux
ms.date: 06/07/2023
---

# Pod Sandboxing (preview) with Azure Kubernetes Service (AKS)

To help secure and protect your container workloads from untrusted or potentially malicious code, AKS now includes a mechanism called Pod Sandboxing (preview). Pod Sandboxing provides an isolation boundary between the container application, and the shared kernel and compute resources of the container host. For example CPU, memory, and networking. Pod Sandboxing complements other security measures or data protection controls with your overall architecture to help you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand this new feature, and how to implement it.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later.

- Register the `KataVMIsolationPreview` feature in your Azure subscription.

- AKS supports Pod Sandboxing (preview) on version 1.24.0 and higher.

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

### Register the KataVMIsolationPreview feature flag

Register the `KataVMIsolationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KataVMIsolationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "KataVMIsolationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Limitations

The following are constraints with this preview of Pod Sandboxing (preview):

* Kata containers may not reach the IOPS performance limits that traditional containers can reach on Azure Files and high performance local SSD.

* [Microsoft Defender for Containers][defender-for-containers] doesn't support assessing Kata runtime pods.

* [Kata][kata-network-limitations] host-network isn't supported.

* AKS does not support [Container Storage Interface drivers][csi-storage-driver] and [Secrets Store CSI driver][csi-secret-store driver] in this preview release.

## How it works

To achieve this functionality on AKS, [Kata Containers][kata-containers-overview] running on the Azure Linux container host for AKS stack delivers hardware-enforced isolation. Pod Sandboxing extends the benefits of hardware isolation such as a separate kernel for each Kata pod. Hardware isolation allocates resources for each pod and doesn't share them with other Kata Containers or namespace containers running on the same host.

The solution architecture is based on the following components:

* The [Azure Linux container host for AKS][azurelinux-overview]
* Microsoft Hyper-V Hypervisor
* Azure-tuned Dom0 Linux Kernel
* Open-source [Cloud-Hypervisor][cloud-hypervisor] Virtual Machine Monitor (VMM)
* Integration with [Kata Container][kata-container] framework

Deploying Pod Sandboxing using Kata Containers is similar to the standard containerd workflow to deploy containers. The deployment includes kata-runtime options that you can define in the pod template.

To use this feature with a pod, the only difference is to add **runtimeClassName** *kata-mshv-vm-isolation* to the pod spec.

When a pod uses the *kata-mshv-vm-isolation* runtimeClass, it creates a VM to serve as the pod sandbox to host the containers. The VM's default memory is 2 GB and the default CPU is one core if the [Container resource manifest][container-resource-manifest] (`containers[].resources.limits`) doesn't specify a limit for CPU and memory. When you specify a limit for CPU or memory in the container resource manifest, the VM has `containers[].resources.limits.cpu` with the `1` argument to use *one + xCPU*, and `containers[].resources.limits.memory` with the `2` argument to specify *2 GB + yMemory*. Containers can only use CPU and memory to the limits of the containers. The `containers[].resources.requests` are ignored in this preview while we work to reduce the CPU and memory overhead.

## Deploy new cluster

Perform the following steps to deploy an Azure Linux AKS cluster using the Azure CLI.

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: Specify *KataMshvVmIsolation* to enable the Pod Sandboxing feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
    * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli-interactive
    az aks create --name myAKSCluster --resource-group myResourceGroup --os-sku AzureLinux --workload-runtime KataMshvVmIsolation --node-vm-size Standard_D4s_v3 --node-count 1
    ```

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. List all Pods in all namespaces using the [kubectl get pods][kubectl-get-pods] command.

    ```bash
    kubectl get pods --all-namespaces
    ```

## Deploy to an existing cluster

To use this feature with an existing AKS cluster, the following requirements must be met:

* Follow the steps to [register the KataVMIsolationPreview][register-the-katavmisolationpreview-feature-flag] feature flag.
* Verify the cluster is running Kubernetes version 1.24.0 and higher.

Use the following command to enable Pod Sandboxing (preview) by creating a node pool to host it.

1. Add a node pool to your AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--workload-runtime**: Specify *KataMshvVmIsolation* to enable the Pod Sandboxing feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in the preview release.
     * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example adds a node pool to *myAKSCluster* with one node in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --cluster-name myAKSCluster --resource-group myResourceGroup --name nodepool2 --os-sku AzureLinux --workload-runtime KataMshvVmIsolation --node-vm-size Standard_D4s_v3
    ```

2. Run the [az aks update][az-aks-update] command to enable pod sandboxing (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
    ```

## Deploy a trusted application

To demonstrate deployment of a trusted application on the shared kernel in the AKS cluster, perform the following steps.

1. Create a file named *trusted-app.yaml* to describe a trusted pod, and then paste the following manifest.

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: trusted
    spec:
      containers:
      - name: trusted
        image: mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
        command: ["/bin/sh", "-ec", "while :; do echo '.'; sleep 5 ; done"]
    ```

2. Deploy the Kubernetes pod by running the [kubectl apply][kubectl-apply] command and specify your *trusted-app.yaml* file:

    ```bash
    kubectl apply -f trusted-app.yaml
    ```

   The output of the command resembles the following example:

    ```output
    pod/trusted created
    ```

## Deploy an untrusted application

To demonstrate the deployment of an untrusted application into the pod sandbox on the AKS cluster, perform the following steps.

1. Create a file named *untrusted-app.yaml* to describe an untrusted pod, and then paste the following manifest.

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: untrusted
    spec:
      runtimeClassName: kata-mshv-vm-isolation
      containers:
      - name: untrusted
        image: mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
        command: ["/bin/sh", "-ec", "while :; do echo '.'; sleep 5 ; done"]
    ```

   The value for **runtimeClassNameSpec** is `kata-mhsv-vm-isolation`.

2. Deploy the Kubernetes pod by running the [kubectl apply][kubectl-apply] command and specify your *untrusted-app.yaml* file:

    ```bash
    kubectl apply -f untrusted-app.yaml
    ```

   The output of the command resembles the following example:

    ```output
    pod/untrusted created
    ```

## Verify Kernel Isolation configuration

1. To access a container inside the AKS cluster, start a shell session by running the [kubectl exec][kubectl-exec] command. In this example, you're accessing the container inside the *untrusted* pod.

    ```bash
    kubectl exec -it untrusted -- /bin/bash
    ```

   Kubectl connects to your cluster, runs `/bin/sh` inside the first container within the *untrusted* pod, and forward your terminal's input and output streams to the container's process. You can also start a shell session to the container hosting the *trusted* pod.

2. After starting a shell session to the container of the *untrusted* pod, you can run commands to verify that the *untrusted* container is running in a pod sandbox. You'll notice that it has a different kernel version compared to the *trusted* container outside the sandbox.

   To see the kernel version run the following command:

    ```bash
    uname -r
    ```

   The following example resembles output from the pod sandbox kernel:

    ```output
    root@untrusted:/# uname -r
    5.15.48.1-8.cm2
    ```

3. Start a shell session to the container of the *trusted* pod to verify the kernel output:

    ```bash
    kubectl exec -it trusted -- /bin/bash
    ```

   To see the kernel version run the following command:

    ```bash
    uname -r
    ```

   The following example resembles output from the VM that is running the *trusted* pod, which is a different kernel than the *untrusted* pod running within the pod sandbox:

    ```output
    5.15.80.mshv2-hvl1.m2
    ```

## Cleanup

When you're finished evaluating this feature, to avoid Azure charges, clean up your unnecessary resources. If you deployed a new cluster as part of your evaluation or testing, you can delete the cluster using the [az aks delete][az-aks-delete] command.

```azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster
```

If you enabled Pod Sandboxing (preview) on an existing cluster, you can remove the pod(s) using the [kubectl delete pod][kubectl-delete-pod] command.

```bash
kubectl delete pod pod-name
```

## Next steps

Learn more about [Azure Dedicated hosts][azure-dedicated-hosts] for nodes with your AKS cluster to use hardware isolation and control over Azure platform maintenance events.

<!-- EXTERNAL LINKS -->
[kata-containers-overview]: https://katacontainers.io/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[azurerm-azurelinux]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_node_pool#os_sku
[kubectl-get-pods]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[container-resource-manifest]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/
[kubectl-delete-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kata-network-limitations]: https://github.com/kata-containers/kata-containers/blob/main/docs/Limitations.md#host-network
[cloud-hypervisor]: https://www.cloudhypervisor.org
[kata-container]: https://katacontainers.io 

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[connect-to-aks-cluster-nodes]: node-access.md
[dv3-series]: ../virtual-machines/dv3-dsv3-series.md#dsv3-series
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[create-ssh-public-key-linux]: ../virtual-machines/linux/mac-create-ssh-keys.md
[az-aks-delete]: /cli/azure/aks#az-aks-delete
[cvm-on-aks]: use-cvm.md
[azure-dedicated-hosts]: use-azure-dedicated-hosts.md
[container-insights]: ../azure-monitor/containers/container-insights-overview.md
[defender-for-containers]: ../defender-for-cloud/defender-for-containers-introduction.md
[az-aks-install-cmd]: /cli/azure/aks#az-aks-install-cli
[azurelinux-overview]: use-azure-linux.md
[csi-storage-driver]: csi-storage-drivers.md
[csi-secret-store driver]: csi-secrets-store-driver.md
[az-aks-update]: /cli/azure/aks#az-aks-update
[azurelinux-cluster-config]: cluster-configuration.md#azure-linux-container-host-for-aks
[register-the-katavmisolationpreview-feature-flag]: #register-the-katavmisolationpreview-feature-flag
