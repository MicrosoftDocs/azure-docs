---
title: Use compute acceleration GPU or VPU on Azure Stack Edge devices for Kubernetes deployments| Microsoft Docs
description: Describes how to use compute acceleration GPU or VPU on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R or Azure Stack Edge Mini Ri for Kubernetes deployments.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 11/05/2020
ms.author: alkohli
---

# Use compute acceleration on Azure Stack Edge Pro GPU for Kubernetes deployment

This article describes how to use compute acceleration on Azure Stack Edge devices when using Kubernetes deployments. The article applies to Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices.


## About compute acceleration 

In computing, hardware acceleration refers to the use of specialized computer hardware to perform some functions more efficiently than is possible to run the same functions in a general-purpose central processing unit (CPU). The implementation of computing tasks in specialized hardware aims to decrease the latency and increase throughput.

Compute acceleration is a term used specifically for Azure Stack Edge devices where a Graphical Processing (GPU), a Vision Processing Unit (VPU), or a Field Programmable Gate Array (FPGA) are used for hardware acceleration. 

The article will discuss compute acceleration only using GPU or VPU for the following devices:

- **Azure Stack Edge Pro GPU** - These devices can have 1 or 2 Nvidia T4 Tensor Core GPU. For more information, see [NVIDIA T4](https://www.nvidia.com/en-us/data-center/tesla-t4/)
- **Azure Stack Edge Pro R** - These devices have 1 Nvidia T4 Tensor Core GPU. For more information, see [NVIDIA T4](https://www.nvidia.com/en-us/data-center/tesla-t4/)
- **Azure Stack Edge Mini R** - These devices have 1 Intel Movidius Myriad X VPU. For more information, see [Intel Movidius Myriad X VPU](https://www.movidius.com/MyriadX).


## Use GPU for Kubernetes deployment

The following example `yaml` can be used for an Azure Stack Edge Pro GPU or an Azure Stack Edge Pro R device with a GPU.

<!--In a production scenario, Pods are not used directly and these are wrapped around higher level constructs like Deployment, ReplicaSet which maintain the desired state in case of pod restarts, failures.-->

```yml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  containers:
    - name: cuda-container
      image: nvidia/cuda:9.0-devel
      resources:
        limits:
          nvidia.com/gpu: 1 # requesting 1 GPU
    - name: digits-container
      image: nvidia/digits:6.0
      resources:
        limits:
          nvidia.com/gpu: 1 # requesting 1 GPU
```


## Use VPU for Kubernetes deployment

The following example `yaml` can be used for an Azure Stack Edge Mini R device that has a VPU.

```yml
apiVersion: batch/v1
kind: Job
metadata:
 name: intelvpu-demo-job
 labels:
   jobgroup: intelvpu-demo
spec:
 template:
   metadata:
     labels:
       jobgroup: intelvpu-demo
   spec:
     restartPolicy: Never
     containers:
       -
         name: intelvpu-demo-job-1
         image: ubuntu-demo-openvino:devel
         imagePullPolicy: IfNotPresent
         command: [ "/do_classification.sh" ]
         resources:
           limits:
             vpu.intel.com/hddl: 1
```


## Next steps

Learn how to [Use kubectl to run a Kubernetes stateful application with a PersistentVolume on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-stateful-application-static-provision-kubernetes.md).
