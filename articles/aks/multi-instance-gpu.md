---
title: Multi-instance GPU Nodepool
description: Learn how to create a Multi-instance GPU Nodepool and schedule tasks on it
services: container-service
ms.topic: article
ms.date: ???
ms.author: ???
---

# Multi-instance GPU Nodepool

The new Nvidia A100 GPU can be divided to up to 7 independent instances, each  has their own memory and stream multiprocessor. For more information on Nvidia A100 please follow [Nvidia A100 GPU][Nvidia A100 GPU]. This article will introduce you how to create multi-instance multi-instance GPU nodepool on Azure Kubernetes clusters and schedule task on it. 

## GPU Instance Profile

GPU Instance Profile defines how a GPU will be partitioned. The following table shows the available GPU Instance Profile for vm size of `Standard_ND96asr_v4`. GPU Instance Profile of `MIG 1g.5gb` indicates each GPU instance will have 1g SM(Computing resource) and 5gb memory. So each GPU will be partitioned into 7 GPU instances.
| Profile Name | Fraction of SM |Fraction of Memory  | Number of Instances created |
|--|--|--|--|
| MIG 1g.5gb | 1/7 | 1/8 | 7 |
| MIG 2g.10gb | 2/7 | 2/8 | 3 |
| MIG 3g.20gb | 3/7 | 4/8 | 2 |
| MIG 4g.20gb | 4/7 | 4/8 | 1 |
| MIG 7g.40gb | 7/7 | 8/8 | 1 |


Now, the only vm size that supports multi-instance GPU is `Standard_ND96asr_v4`
And all the GPU Instance Profile available for this vm size are `MIG1g`, `MIG2g`, `MIG3g`, `MIG4g`, `MIG7g`
> [!IMPORTANT]
> GPU Instance Profile is currently immutable after nodepool creation. Please think carefully and pick a GPU Instance Profile based on your need. 


## Create a cluster on AKS
First, if you do not have a cluster, create a resource group and a cluster. If you already have a cluster, you can skip this step. Follow the example below to a resource group name `myresourcegroup` in the `southcentralus` region:

```azurecli-interactive
az group create --name myresourcegroup --location southcentralus
```

```azurecli-interactive
az aks create \
    --resource-group myresourcegroup \
    --name migcluster\
    --node-count 1
```

## Create the multi-instance GPU nodepool

You can choose either command line or http request to create the nodepool
###Use azure cli
If you are using command line, use az aks nodepool add command to create the nodepool, specify the GPU instance profile through `--gpu-instance-profile`
```
az aks nodepool add \
    --name mignode \
    --resourcegroup myresourcegroup \
    --cluster-name migcluster \
    --node-size Standard_ND96asr_v4 \
    --gpu-instance-profile mig1g
```

###Use request
If you are using http request, you can put GPU instance profile in the request body
```
{
    "properties": {
        "count": 1,
        "vmSize": "Standard_ND96asr_v4",
        "type": "VirtualMachineScaleSets",
        "gpuInstanceProfile": "mig1g"
    }
}
```




## Run tasks using kubectl 

###Identify strategy 
Before we install the plugins, we need to specify which strategy do we want. The two strategies "Single" and "Mixed" will not affect the functionality. It will only affect how the GPU resources will be displayed. 
- Single Strategy

The single strategy treats every GPU instance as a GPU. If we are using this strategy, the GPU resources will be displayed as:
```
nvidia.com/gpu: 1
```
- Mixed Strategy

The mixed strategy will expose the GPU instances using the new syntax. It will also show the GPU instance profile. If we are using this strategy, the GPU resource will be displayed as:
```
nvidia.com/mig1g.5gb: 1
```

###Install NVIDIA device plugin and GPU feature discovery using helm
First, identify your strategy by 
```
export MIG_STRATEGY=single
```
or
```
export MIG_STRATEGY=mixed
```
Install Nvidia device plugin and GPU feature discovery using helm  
```
helm repo add nvdp https://nvidia.github.io/k8s-device-plugin
helm repo add nvgfd https://nvidia.github.io/gpu-feature-discovery
helm repo update #do not forget to update the helm repo
```


```
helm install
--version=0.7.0
--generate-name
--set migStrategy=${MIG_STRATEGY}
nvdp/nvidia-device-plugin
```

```
helm install
--version=0.2.0
--generate-name
--set migStrategy=${MIG_STRATEGY}
nvgfd/gpu-feature-discovery
```


###Confirm multi-instance GPU capability
Assume we are using mig1g as GPU instance profile, to confirm the node has multi-instance GPU capability, run
```
kubectl describe mignode
```
If you are using single strategy, you will see
```
Allocable:
    nvidia.com/gpu: 56
```
If you are using mixed strategy, you will see
```
Allocable:
    nvidia.com/mig-1g.5gb: 56
```

###Schedule work
Use kubectl run command to schedule work

example of using single strategy 
```
kubectl run -it --rm
--image=nvidia/cuda:11.0-base
--restart=Never
--limits=nvidia.com/mig-1g.5gb=1 
mixed-strategy-example -- nvidia-smi -L
```

example of using mixed strategy 
```
kubectl run -it --rm
--image=nvidia/cuda:11.0-base
--restart=Never
--limits=nvidia.com/gpu=1 
single-strategy-example -- nvidia-smi -L
```


##Troubleshooting
- If you do not see multi-instance GPU capability after the nodepool is created, check your api version, it cannot be older than version 2021-08-01

<!-- LINKS - internal -->


<!-- LINKS - external-->
[Nvidia A100 GPU]:https://www.nvidia.com/en-us/data-center/a100/

