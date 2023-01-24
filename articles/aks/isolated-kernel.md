---
title: Pod Sandboxing (preview) with Azure Kubernetes Service (AKS)
description: Learn about and deploy Pod Sandboxing (preview), also referred to as VM Isolation, on an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 01/24/2023

---

# Pod Sandboxing (preview) with Azure Kubernetes Service (AKS)

Container workloads running on Azure Kubernetes Service (AKS) share kernel and container host resources. This exposes the cluster to untrusted or potentially malicious code. To further secure and protect your workloads, AKS now includes a mechanism called Pod Sandboxing (preview). Pod Sandboxing provides an isolation boundary between the container application, and the shared kernel and compute resources of the container host. For example CPU, memory, and networking.

Pod Sandboxing compliments other security measures or data protection controls with your overall architecture to help you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand this new feature, and how to implement it.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later to select the Mariner 2.0 operating system SKU.

- If you want to run `kubectl` locally on your Windows system, you can install it using the [Install-AzAksKubectl][install-azakskubectl] cmdlet:

    ```azurepowershell
    Install-AzAksKubectl
    ```

   To install it locally on your Linux system, see [Install and setup Kubectl on Linux][install-kubectl-linux].

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Register the 'KataVMIsolationPreview' feature flag

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

What limitations need to be specified?

## How it works

To achieve this functionality on AKS, [Kata Containers][kata-containers-overview] running on Mariner AKS Container Host (MACH) stack delivers hardware-enforced isolation. Pod Sandboxing extends the benefits of hardware isolation such as separate kernel per each Kata Container. Hardware isolation allocates resources for each pod that aren't shared with other Kata Containers or namespace containers that run on the same host.

The solution architecture is based on the following components:

* Mariner AKS Container Host
* Azure-tuned Dom0 Linux Kernel
* Open-source Cloud-Hypervisor Virtual Machine Monitor (VMM)
* Microsoft Hyper-V Hypervisor
* Integration with Kata Container framework

Deploying Pod Sandboxing using Kata Containers is similar to the standard containerd workflow to deploy containers, the deployment includes kata-runtime options that can be defined in the pod template.

For a pod to use the this feature, the only difference is to add **runtimeClassName** *kata-mshv-vm-isolation* to the pod spec.

When a pod uses the *kata-mshv-vm-isolation* runtimeClass, a VM is created to serve as the pod sandbox to host the containers. The VM's default memory is 2 GB and the default CPU is 1 core if the [Container resource manifest][container-resource-manifest] (`containers[].resources.limits`) doesn't specify a limit for CPU and memory. When the Container resource manifest limit for CPU or memory is specified, the VM has `containers[].resources.limits.cpu` with the `1` argument to use 1 CPU, and `containers[].resources.limits.memory` with the `2` argument to specify 2GB of memory. Containers can only use CPU and memory to the limits of the containers. The `containers[].resources.requests` are ignored in this preview while we work to reduce the CPU and memory overhead.

## Deploy new cluster

Perform the following steps to deploy an AKS Mariner cluster using either the Azure CLI, an Azure Resource Manager (ARM) template, or with Terraform.

# [Azure CLI](#tab/azure-cli)

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: *KataMshvVmIsolation* has to be specified. This enables the Pod Sandboxing feature on the node pool. With this parameter, these other parameters must meet the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--kubernetes-version**: Value must be 1.24.0 and higher. Earlier versions of Kubernetes aren't supported in this preview release.
    * **--os-sku**: *mariner*. Only the Mariner os-sku supports this feature in this preview release.
    * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli
    az aks create --name myAKSCluster --resource-group myResourceGroup --os-sku mariner --workload-runtime KataMshvVmIsolation --node-vm-size Standard_D4s_v3 --kubernetes-version 1.24.0

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. List all Pods in all namespaces using the [kubectl get pods][kubectl-get-pods] command.

    ```bash
    kubectl get pods --all-namespaces
    ```

# [Azure Resource Manager](#tab/arm)

To add Mariner to an existing ARM template, you need to add the following:

* **osSKU**: "mariner"
* **mode**: "System" under `agentPoolProfiles`
* **apiVersion**: Set the apiVersion to 2021-03-01 or newer. For example, `"apiVersion": "2021-03-01"`.

1. Create a file named *marineraksarm.json* on your system, and then paste the following manifest.

    ```yml
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.1",
      "parameters": {
        "clusterName": {
          "type": "string",
          "defaultValue": "marinerakscluster",
          "metadata": {
            "description": "The name of the Managed Cluster resource."
          }
        },
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]",
          "metadata": {
            "description": "The location of the Managed Cluster resource."
          }
        },
        "dnsPrefix": {
          "type": "string",
          "metadata": {
            "description": "Optional DNS prefix to use with hosted Kubernetes API server FQDN."
          }
        },
        "osDiskSizeGB": {
          "type": "int",
          "defaultValue": 0,
          "minValue": 0,
          "maxValue": 1023,
          "metadata": {
            "description": "Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize."
          }
        },
        "agentCount": {
          "type": "int",
          "defaultValue": 3,
          "minValue": 1,
          "maxValue": 50,
          "metadata": {
            "description": "The number of nodes for the cluster."
          }
        },
        "agentVMSize": {
          "type": "string",
          "defaultValue": "Standard_D4s_v3",
          "metadata": {
            "description": "The size of the Virtual Machine."
          }
        },
        "linuxAdminUsername": {
          "type": "string",
          "metadata": {
            "description": "User name for the Linux Virtual Machines."
          }
        },
        "sshRSAPublicKey": {
          "type": "string",
          "metadata": {
            "description": "Configure all linux machines with the SSH RSA public key string. Your key should include three parts, for example 'ssh-rsa AAAAB...snip...UcyupgH azureuser@linuxvm'"
          }
        },
        "osType": {
          "type": "string",
          "defaultValue": "Linux",
          "allowedValues": [
            "Linux"
          ],
          "metadata": {
            "description": "The type of operating system."
          }
        },
        "osSKU": {
          "type": "string",
          "defaultValue": "mariner",
          "allowedValues": [
            "mariner",
            "Ubuntu",
          ],
          "metadata": {
            "description": "The Linux SKU to use."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.ContainerService/managedClusters",
          "apiVersion": "2021-03-01",
          "name": "[parameters('clusterName')]",
          "location": "[parameters('location')]",
          "properties": {
            "dnsPrefix": "[parameters('dnsPrefix')]",
            "agentPoolProfiles": [
              {
                "name": "agentpool",
                "mode": "System",
                "osDiskSizeGB": "[parameters('osDiskSizeGB')]",
                "count": "[parameters('agentCount')]",
                "vmSize": "[parameters('agentVMSize')]",
                "osType": "[parameters('osType')]",
                "osSKU": "[parameters('osSKU')]",
                "storageProfile": "ManagedDisks",
                "workload-runtime": "KataMshvVmIsolation"
              }
            ],
            "linuxProfile": {
              "adminUsername": "[parameters('linuxAdminUsername')]",
              "ssh": {
                "publicKeys": [
                  {
                    "keyData": "[parameters('sshRSAPublicKey')]"
                  }
                ]
              }
            }
          },
          "identity": {
              "type": "SystemAssigned"
          }
        }
      ],
      "outputs": {
        "controlPlaneFQDN": {
          "type": "string",
          "value": "[reference(parameters('clusterName')).fqdn]"
        }
      }
    }
    ```

2. Create an AKS cluster using the [az deployment group create][az-deployment-group-create] command from a local template file. Provide the following values in the command:

    * **resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
    * **clusterName**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
    * **dnsPrefix**: Enter a unique DNS prefix for your cluster, such as *myakscluster*.
    * **linuxAdminUsername**: Enter a username to connect using SSH, such as *azureuser*.
    * **sshRSAPublicKey**: Copy and paste the *public* part of your SSH key pair (by default, the contents of *~/.ssh/id_rsa.pub*). If you don't have a SSH key pair created and are unfamiliar with how to create one, see [Create and use an SSH public-private key pair for Linux VMs in Azure][create-ssh-public-key-linux].

    ```azurecli
    az deployment group create --resource-group myResourceGroup --template-file marineraksarm.yml --parameters clusterName=myAKSCluster dnsPrefix=myakscluster linuxAdminUsername=azureuser sshRSAPublicKey='<contents of your id_rsa.pub>'
    ```

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. List all Pods in all namespaces using the [kubectl get pods][kubectl-get-pods] command.

    ```bash
    kubectl get pods --all-namespaces
    ```

# [Terraform](#tab/terraform)

1. To deploy a Mariner cluster with Terraform, you first need to set your `azurerm` provider to version 2.76 or higher.

    ```
    required_providers {
      azurerm = {
        source = "hashicorp/azurerm"
        version = "~> 2.76"
      }
    }
    ```

2. After you've updated your `azurerm` provider, you can specify the Mariner `os_sku` in `default_node_pool`.

    ```
    default_node_pool {
      name = "default"
      node_count = 2
      vm_size = "Standard_D2_v2"
      os_sku = "CBLMariner"
    }
    ```

You can also specify the Mariner `os_sku` in [`azurerm_kubernetes_cluster_node_pool`][azurerm-mariner].

---

## Deploy to an existing cluster

To update an existing AKS cluster, if the cluster is running version 1.24.0 and higher, you can use the following command to enable Pod Sandboxing (preview).

1. Create an AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command and specifying the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters nodepool, such as *nodepool2*.
   * **--workload-runtime**: *KataMshvVmIsolation* has to be specified. This enables the Pod Sandboxing feature on the node pool. When using the `--workload-runtime` parameter, these additional parameters must meet the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: *mariner*. Only the Mariner os-sku supports this feature in the preview release.
     * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli
    az aks create --cluster-name myAKSCluster --resource-group myResourceGroup --name nodepool2 --os-sku mariner --workload-runtime KataMshvVmIsolation --node-vm-size Standard_D4s_v3 --kubernetes-version 1.24.0
    ```

## Deploy a trusted application

To demonstrate the isolation of an application on the AKS cluster, perform the following steps.

1. Create a file named *trusted-app.yaml* to describe a trusted DaemonSet, and then paste the following manifest.

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

2. Deploy the Kubernetes DaemonSet by running the [kubectl apply][kubectl-apply] command and specify your *trusted-app.yaml* file:

    ```bash
    kubectl apply -f trusted-app.yaml
    ```

   The output of the command resembles the following example:

    ```output
    pod/trusted created
    ```

3. To verify the deployment and that the kernel is isolated, run the following command.

    ```bash
    kubectl get nodes
    ```

    The output resembles the following for an isolated node:

    ```output
    blah
    ```

## Deploy an untrusted application

To demonstrate the deployed application on the AKS cluster isn't isolated and is on the untrusted shim, perform the following steps.

1. Create a file named *untrusted-app.yaml* to describe an untrusted DaemonSet, and then paste the following manifest.

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

   The value for **runtimeClassNameSpec** can be `kata-qemu` or `kata-mhsv`.

2. Deploy the Kubernetes DaemonSet by running the [kubectl apply][kubectl-apply] command and specify your *untrusted-app.yaml* file:

    ```bash
    kubectl apply -f untrusted-app.yaml
    ```

   The output of the command resembles the following example:

    ```output
    pod/untrusted created
    ```

## Verify isolation configuration

1. To access a container inside the AKS cluster, start a shell session by running the [kubectl exec][kubectl-exec] command.

    ```bash
    kubectl exec -it trusted -- /bin/bash
    ```

   Kubectl connects to your cluster, runs `/bin/sh` inside the first container within the *trusted* pod, and forward your terminal's input and output streams to the container's process. You can also start a shell session to the container hosting the *untrusted* pod.

2. After starting a shell to the container to either the *untrusted* or *trusted* pod, you can run the following commands to verify that the untrusted container is running in a VM that has different number of CPUs and memory from the trusted container.

   To see the number of CPUs available, run:

    ```bash
    cat /proc/cpuinfo
    ```

   To see the how much memory is available, run:

    ```bash
    cat /proc/meminfo
    ```

<!-- EXTERNAL LINKS -->
[kata-containers-overview]: https://katacontainers.io/
[azurerm-mariner]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_node_pool#os_sku
[kubectl-get-pods]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[install-kubectl-linux]: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[container-resource-manifest]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[connect-to-aks-cluster-nodes]: node-access.md
[dv3-series]: ../virtual-machines/dv3-dsv3-series.md#dsv3-series
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[create-ssh-public-key-linux]: ../virtual-machines/linux/mac-create-ssh-keys.md