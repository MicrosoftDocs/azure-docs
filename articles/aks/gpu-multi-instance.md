---
title: Multi-instance GPU Node pool
description: Learn how to create a Multi-instance GPU Node pool and schedule tasks on it
ms.topic: article
ms.date: 1/24/2022
ms.author: juda
---

# Multi-instance GPU Node pool

Nvidia's A100 GPU can be divided in up to seven independent instances. Each instance has their own memory and Stream Multiprocessor (SM). For more information on the Nvidia A100, follow [Nvidia A100 GPU][Nvidia A100 GPU]. 

This article will walk you through how to create a multi-instance GPU node pool on Azure Kubernetes Service clusters and schedule tasks.

## GPU Instance Profile 

GPU Instance Profiles define how a GPU will be partitioned. The following table shows the available GPU Instance Profile for the `Standard_ND96asr_v4`


| Profile Name | Fraction of SM |Fraction of Memory  | Number of Instances created |
|--|--|--|--|
| MIG 1g.5gb | 1/7 | 1/8 | 7 |
| MIG 2g.10gb | 2/7 | 2/8 | 3 |
| MIG 3g.20gb | 3/7 | 4/8 | 2 |
| MIG 4g.20gb | 4/7 | 4/8 | 1 |
| MIG 7g.40gb | 7/7 | 8/8 | 1 |

As an example, the GPU Instance Profile of `MIG 1g.5gb` indicates that each GPU instance will have 1g SM(Computing resource) and 5gb memory. In this case, the GPU will be partitioned into seven instances.

The available GPU Instance Profiles available for this instance size are `MIG1g`, `MIG2g`, `MIG3g`, `MIG4g`, `MIG7g`

> [!IMPORTANT]
> The applied GPU Instance Profile cannot be changed after node pool creation. 


## Create an AKS cluster
To get started, create a resource group and an AKS cluster. If you already have a cluster, you can skip this step. Follow the example below to the resource group name `myresourcegroup` in the `southcentralus` region:

```azurecli-interactive
az group create --name myresourcegroup --location southcentralus
```

```azurecli-interactive
az aks create \
    --resource-group myresourcegroup \
    --name migcluster\
    --node-count 1
```

## Create a multi-instance GPU node pool

You can choose to either use the `az` command line or http request to the ARM API to create the node pool

### Azure CLI
If you're using command line, use the `az aks nodepool add` command to create the node pool and specify the GPU instance profile through `--gpu-instance-profile`
```

az aks nodepool add \
    --name mignode \
    --resource-group myresourcegroup \
    --cluster-name migcluster \
    --node-vm-size Standard_ND96asr_v4 \
    --gpu-instance-profile MIG1g
```

### HTTP request

If you're using http request, you can place GPU instance profile in the request body:
```
{
    "properties": {
        "count": 1,
        "vmSize": "Standard_ND96asr_v4",
        "type": "VirtualMachineScaleSets",
        "gpuInstanceProfile": "MIG1g"
    }
}
```




## Run tasks using kubectl 

### MIG strategy 
Before you install the Nvidia plugins, you need to specify which strategy to use for GPU partitioning. 

The two strategies "Single" and "Mixed" won't affect how you execute CPU workloads, but how GPU resources will be displayed.

- Single Strategy

  The single strategy treats every GPU instance as a GPU. If you're using this strategy, the GPU resources will be displayed as:

  ```
  nvidia.com/gpu: 1
  ```

- Mixed Strategy

  The mixed strategy will expose the GPU instances and the GPU instance profile. If you use this strategy, the GPU resource will be displayed as:

  ```
  nvidia.com/mig1g.5gb: 1
  ```

### Install the NVIDIA device plugin and GPU feature discovery

Set your MIG Strategy
```
export MIG_STRATEGY=single
```
or
```
export MIG_STRATEGY=mixed
```

Install the Nvidia device plugin and GPU feature discovery using helm  

```
helm repo add nvdp https://nvidia.github.io/k8s-device-plugin
helm repo add nvgfd https://nvidia.github.io/gpu-feature-discovery
helm repo update #do not forget to update the helm repo
```

```
helm install \
--version=0.7.0 \
--generate-name \
--set migStrategy=${MIG_STRATEGY} \
nvdp/nvidia-device-plugin
```

```
helm install \
--version=0.2.0 \
--generate-name \
--set migStrategy=${MIG_STRATEGY} \
nvgfd/gpu-feature-discovery
```


### Confirm multi-instance GPU capability
As an example, if you used MIG1g as the GPU instance profile, confirm the node has multi-instance GPU capability by running:
```
kubectl describe node mignode
```
If you're using single strategy, you'll see:
```
Allocatable:
    nvidia.com/gpu: 56
```
If you're using mixed strategy, you'll see:
```
Allocatable:
    nvidia.com/mig-1g.5gb: 56
```

### Schedule work

The following examples are based on cuda base image version 12.1.1 for Ubuntu22.04, tagged as `12.1.1-base-ubuntu22.04`.

- Single strategy

1. Create a file named `single-strategy-example.yaml` and copy in the following manifest.

    ```yaml 
    apiVersion: v1
    kind: Pod
    metadata:
      name: nvidia-single
    spec:
      containers:
      - name: nvidia-single
        image: nvidia/cuda:12.1.1-base-ubuntu22.04
        command: ["/bin/sh"]
        args: ["-c","sleep 1000"]
        resources:
          limits:
            "nvidia.com/gpu": 1
    ```

2. Deploy the application using the `kubectl apply` command and specify the name of your YAML manifest.

    ```
    kubectl apply -f single-strategy-example.yaml
    ```
    
3. Verify the allocated GPU devices using the `kubectl exec` command. This command returns a list of the cluster nodes.

    ```
    kubectl exec nvidia-single -- nvidia-smi -L
    ```

    The following example resembles output showing successfully created deployments and services.

    ```output
    GPU 0: NVIDIA A100 40GB PCIe (UUID: GPU-48aeb943-9458-4282-da24-e5f49e0db44b)
    MIG 1g.5gb     Device  0: (UUID: MIG-fb42055e-9e53-5764-9278-438605a3014c)
    MIG 1g.5gb     Device  1: (UUID: MIG-3d4db13e-c42d-5555-98f4-8b50389791bc)
    MIG 1g.5gb     Device  2: (UUID: MIG-de819d17-9382-56a2-b9ca-aec36c88014f)
    MIG 1g.5gb     Device  3: (UUID: MIG-50ab4b32-92db-5567-bf6d-fac646fe29f2)
    MIG 1g.5gb     Device  4: (UUID: MIG-7b6b1b6e-5101-58a4-b5f5-21563789e62e)
    MIG 1g.5gb     Device  5: (UUID: MIG-14549027-dd49-5cc0-bca4-55e67011bd85)
    MIG 1g.5gb     Device  6: (UUID: MIG-37e055e8-8890-567f-a646-ebf9fde3ce7a)
    ```

- Mixed mode strategy

1. Create a file named `mixed-strategy-example.yaml` and copy in the following manifest.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nvidia-mixed
    spec:
      containers:
      - name: nvidia-mixed
        image: nvidia/cuda:12.1.1-base-ubuntu22.04
        command: ["/bin/sh"]
        args: ["-c","sleep 100"]
        resources:
          limits:
            "nvidia.com/mig-1g.5gb": 1
    ```

2. Deploy the application using the `kubectl apply` command and specify the name of your YAML manifest.

    ```
    kubectl apply -f mixed-strategy-example.yaml
    ```
    
3. Verify the allocated GPU devices using the `kubectl exec` command. This command returns a list of the cluster nodes.

    ```
    kubectl exec nvidia-mixed -- nvidia-smi -L
    ```

    The following example resembles output showing successfully created deployments and services.

    ```output
    GPU 0: NVIDIA A100 40GB PCIe (UUID: GPU-48aeb943-9458-4282-da24-e5f49e0db44b)
    MIG 1g.5gb     Device  0: (UUID: MIG-fb42055e-9e53-5764-9278-438605a3014c)
    ```

> [!IMPORTANT]
> The "latest" tag for CUDA images has been deprecated on Docker Hub.
> Please refer to [NVIDIA's repository](https://hub.docker.com/r/nvidia/cuda/tags) for the latest images and corresponding tags

## Troubleshooting
- If you do not see multi-instance GPU capability after the node pool has been created, confirm the API version is not older than 2021-08-01.

<!-- LINKS - internal -->


<!-- LINKS - external-->
[Nvidia A100 GPU]:https://www.nvidia.com/en-us/data-center/a100/

