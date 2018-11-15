---
title: Deploy GPU-enabled container instances 
description: Learn how to deploy container instances to run on GPUs.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 09/24/2018
ms.author: danlep
---

# Deploy container instances that use GPU resources

[Needs intro]

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).


## Preview limitations

In preview, the following limitations apply when using GPU resources in container groups. 

**Supported** regions:

* East US (eastus)
* West US (westus)
* West US 2 (westus2)
* South Central US (southcentralus)
* West Europe (westeurope)

**Supported** OS types: Linux only

**Additional limitations**: GPU resources can't be used when deploying a container group into a [virtual network](container-instances-vnet.md).

## About GPU resources

To use GPUs in a container instance, you specify a *GPU resource* with the following information:

* **Count** - The number of GPUs [what is the maximum?]
* **SKU** - The NVIDIA Tesla GPU SKU, which is one of the following values: K80, P100, or V100. Each SKU maps to the Tesla GPU in one the following Azure GPU-enabled VM sizes:

  | SKU | Corresponding VM size |
  | --- | --- |
  | K80 | [Standard_NC6](../virtual-machines/linux/sizes-gpu.md#nc-series) |
  | P100 | [Standard_NC6s_v2](../virtual-machines/linux/sizes-gpu.md#ncv2-series) |
  | V100 | [Standard_NC6s_v3](../virtual-machines/linux/sizes-gpu.md#ncv3-series) |

### Things to know

* Creation of a container group containing GPU resources takes up to **10 minutes**. This is due to the additional time to provision and configure a GPU VM in Azure. 
* As with container groups without GPU resources, Azure bills only for the *duration* of the container group. The duration is calculated from the time to pull your first container's image until the container group terminates.
* Pricing for container group duration is greater for container groups with GPU resources than for container groups without.
* GPU resources are pre-provisioned with CUDA drivers, so you can run container images developed for CUDA workloads. 
* When deploying GPU resources in a container instance, set CPU and Memory resources appropriate for the underlying VM size. For example, for each K80 GPU SKU:

  ```JSON
  ...
  "cpu": 6,
  "memoryInGB": 56,
  ...
  ```

## Azure CLI example

[waiting for CLI support]

## YAML example

Copy the following YAML into a new file named *vnet-deploy-aci.yaml*, then save the file. This YAML creates a container group named *gpucontainer* with a K80 GPU.

```YAML
additional_properties: {}
apiVersion: '2018-10-01'
location: southcentralus
name: gpucontainer
properties:
  containers:
  - name: gpucontainer
    properties:
      environmentVariables: []
      image: k8s-gcrio.azureedge.net/cuda-vector-add:v0.1
      ports:
      - port: 80
      resources:
        requests:
          cpu: 2.0
          memoryInGB: 3.0
          gpu:
            count: 1
            sku: K80
  ipAddress:
    ports:
    - port: 80
      protocol: TCP
    type: Public
  osType: Linux
  restartPolicy: OnFailure
```

Deploy the container group with the [az container create][az-container-create] command, specifying the YAML file name for the `--file` parameter:

```azurecli
az container create --resource-group myResourceGroup --file gpu-deploy-aci.yaml
```

The deployment takes some time. Once the deployment has completed, the container starts and runs a CUDA vector addition operation. Fun the [az container logs][az-container-log] command to view the log output:

```Console
[Vector addition of 50000 elements]
Copy input data from the host memory to the CUDA device
CUDA kernel launch with 196 blocks of 256 threads
Copy output data from the CUDA device to the host memory
Test PASSED
Done
```


## Resource Manager template example











## Next steps

* Learn more about [GPU optimized VM sizes](../virtual-machines/linux/sizes-gpu.md) in Azure.
* 

<!-- IMAGES -->
[aci-vnet-01]: ./media/container-instances-vnet/aci-vnet-01.png

<!-- LINKS - External -->
https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-show]: /cli/azure/container#az-container-show
[az-container-logs]: /cli/azure/container#az-container-logs
