---
title: GPU sharing on Azure Stack Edge Pro GPU device
description: Describes the approaches to sharing GPUs on Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/18/2021
ms.author: alkohli
---

# GPU sharing on your Azure Stack Edge Pro GPU device

Graphics processing unit (GPU) is a specialized processor designed to accelerate graphics rendering. GPUs can process many pieces of data simultaneously, making them useful for machine learning, video editing, and gaming applications. In addition to CPU for general purpose compute, your Azure Stack Edge Pro GPU devices can contain one or two Nvidia Tesla T4 GPUs for compute-intensive workloads such as hardware accelerated inferencing. For more information, see [Nvidia's Tesla T4 GPU](https://www.nvidia.com/data-center/tesla-t4/).


## About GPU sharing

Many machine learning or other compute workloads may not need a dedicated GPU. GPUs can be shared and sharing GPUs among containerized or VM workloads helps increase the GPU utilization without significantly affecting the performance benefits of GPU.  

## Using GPU with VMs

On your Azure Stack Edge Pro device, a GPU can't be shared when deploying VM workloads. A GPU can only be mapped to one VM. This implies that you can only have one GPU VM on a device with one GPU and two VMs on a device that is equipped with two GPUs. There are other factors that must also be considered when using GPU VMs on a device that has Kubernetes configured for containerized workloads. For more information, see [GPU VMs and Kubernetes](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#gpu-vms-and-kubernetes).


## Using GPU with containers

If you are deploying containerized workloads, a GPU can be shared and can be mapped to multiple containers. GPUs can be shared in two different ways:

- The first approach involves using environment variables to specify the number of GPUs that can be time shared. Consider the following caveats when using this approach:

    - You can specify one or both or no GPUs with this method. It is not possible to specify fractional usage.
    - Multiple modules can map to one GPU but the same module cannot be mapped to more than one GPU.
    - There is no easy way to monitor how much GPU memory is consumed by one module. With the Nvidia SMI output, you can see the overall GPU utilization.
    
    For more information, see how to [Deploy an IoT Edge module that uses GPU](azure-stack-edge-j-series-configure-gpu-modules.md) on your device.

- The second approach requires you to enable the Multi-Process Service on your Nvidia GPUs. MPS  is  a runtime service that lets multiple processes using CUDA to run concurrently on a single shared GPU. MPS allows overlapping of kernel and memory copy operations from different processes on the GPU to achieve maximum utilization. For more information, see [Multi-Process Service](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf).

    Consider the following caveats when using this approach:
    
    - MPS allows you to specify more flags in GPU deployment.
    - You can specify fractional usage via MPS. (TBD)


## GPU utilization
 
When you share GPU on containerized workloads deployed on your device, you can use the Nvidia System Management Interface (nvidia-smi). Nvidia-smi is a command-line utility that helps you manage and monitor Nvidia GPU devices. For more information, see [Nvidia System Management Interface](https://developer.nvidia.com/nvidia-system-management-interface).

To view GPU usage, first connect to the PowerShell interface of the device. Run the `Get-HcsNvidiaSmi` command and view the Nvidia SMI output. You can also view how the GPU utilization changes by enabling MPS and then deploying multiple workloads on the device. For more information, see [Enable Multi-Process Service](azure-stack-edge-gpu-connect-powershell-interface.md#enable-multi-process-service-mps).


## Next steps

- [Enable GPU sharing for Kubernetes deployments on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-kubernetes-gpu-sharing.md).
- [Enable GPU sharing for IoT deployments on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-iot-edge-gpu-sharing.md).
