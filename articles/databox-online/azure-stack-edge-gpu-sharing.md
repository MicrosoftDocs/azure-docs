---
title: GPU sharing on Azure Stack Edge Pro GPU device
description: Describes the approaches to sharing GPUs on Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/01/2021
ms.author: alkohli
---

# GPU sharing on your Azure Stack Edge Pro GPU device

Graphics processing unit (GPU) is a specialized processor designed to accelerate graphics rendering. GPUs can process many pieces of data simultaneously, making them useful for machine learning, video editing, and gaming applications. In addition to CPU for general purpose compute, your Azure Stack Edge Pro GPU devices can contain one or two Nvidia Tesla T4 GPUs for compute-intensive workloads such as hardware accelerated inferencing. For more information, see [Nvidia's Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/).


## About GPU sharing

Many machine learning or other compute workloads may not need a dedicated GPU. GPUs can be shared and sharing GPUs among containerized or VM workloads helps increase the GPU utilization without significantly affecting the performance benefits of GPU.

## Using GPU with VMs

On your Azure Stack Edge Pro device, a GPU can't be shared when deploying VM workloads. A GPU can only be mapped to one VM. This implies that you can only have one GPU VM on a device with one GPU and two VMs on a device that is equipped with two GPUs. There are other factors that must also be considered when using GPU VMs on a device that has Kubernetes configured for containerized workloads. For more information, see [GPU VMs and Kubernetes](azure-stack-edge-gpu-overview-gpu-virtual-machines.md#gpu-vms-and-kubernetes).


## Using GPU with containers

If you are deploying containerized workloads, a GPU can be shared in more than one ways at the hardware and software layer. With the Tesla T4 GPU on your Azure Stack Edge Pro device, we are limited to software sharing. On your device, the following two approaches for software sharing of GPU are used:

- The first approach involves using environment variables to specify the number of GPUs that can be time shared. Consider the following caveats when using this approach:

    - You can specify one or both or no GPUs with this method. It is not possible to specify fractional usage.
    - Multiple modules can map to one GPU but the same module cannot be mapped to more than one GPU.
    - With the Nvidia SMI output, you can see the overall GPU utilization including the memory utilization.

    For more information, see how to [Deploy an IoT Edge module that uses GPU](azure-stack-edge-gpu-configure-gpu-modules.md) on your device.

- The second approach requires you to enable the Multi-Process Service on your Nvidia GPUs. MPS  is  a runtime service that lets multiple processes using CUDA to run concurrently on a single shared GPU. MPS allows overlapping of kernel and memcopy operations from different processes on the GPU to achieve maximum utilization. For more information, see [Multi-Process Service](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf).

    Consider the following caveats when using this approach:

    - MPS allows you to specify more flags in GPU deployment.
    - You can specify fractional usage via MPS thereby limiting the usage of each application deployed on the device. You can specify the GPU percentage to use for each app under the `env` section of the `deployment.yaml` by adding the following parameter:

    ```yml
    // Example: application wants to limit gpu percentage to 20%

        env:
            - name: CUDA_MPS_ACTIVE_THREAD_PERCENTAGE
                value: "20"
    ```

## GPU utilization

When you share GPU on containerized workloads deployed on your device, you can use the Nvidia System Management Interface (nvidia-smi). Nvidia-smi is a command-line utility that helps you manage and monitor Nvidia GPU devices. For more information, see [Nvidia System Management Interface](https://developer.nvidia.com/nvidia-system-management-interface).

To view GPU usage, first connect to the PowerShell interface of the device. Run the `Get-HcsNvidiaSmi` command and view the Nvidia SMI output. You can also view how the GPU utilization changes by enabling MPS and then deploying multiple workloads on the device. For more information, see [Enable Multi-Process Service](azure-stack-edge-gpu-connect-powershell-interface.md#enable-multi-process-service-mps).


## Next steps

- [GPU sharing for Kubernetes deployments on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-kubernetes-gpu-sharing.md).
- [GPU sharing for IoT deployments on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-iot-edge-gpu-sharing.md).
