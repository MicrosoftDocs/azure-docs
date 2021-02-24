---
title: Deploy Kubernetes workload using GPU sharing on Azure Stack Edge Pro GPU device
description: Describes how you can deploy a GPU shared workload via Kubernetes on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/19/2021
ms.author: alkohli
---
# Deploy a Kubernetes workload using GPU sharing on your Azure Stack Edge Pro

This article describes how containerized workloads can share the GPUs on your Azure Stack Edge Pro GPU device. In this article, you will run two deployments, one when the Multi-Process Service (MPS) is enabled on the device and the second, when the service is disabled. For more information, see the [Benefits of Multi-Process Service](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf).

## Prerequisites

Before you begin, make sure that:

1. You've access to an Azure Stack Edge Pro GPU device that is activated as described in [Activate Azure Stack Edge Pro GPU](azure-stack-edge-gpu-deploy-activate.md).

1. You've enabled compute role on the device. A Kubernetes cluster was also created on the device when you configured compute on the device as per the instructions in [Configure compute on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-configure-compute.md).

1. You have the Kubernetes API endpoint from the **Device** page of your local web UI. For more information, see the instructions in [Get Kubernetes API endpoint](azure-stack-edge-gpu-deploy-configure-compute.md#get-kubernetes-endpoints). You have added this Kubernetes API endpoint to the `hosts` file on your client that will be accessing the device.


1. You've access to a client system with a [Supported operating system](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device). If using a Windows client, the system should run PowerShell 5.0 or later to access the device.

    1. If you want to pull and push your own container images, make sure that the system has Docker client installed. If using a Windows client, [Install Docker Desktop on Windows](https://docs.docker.com/docker-for-windows/install/).  

1. You have created a namespace and a user. You have also granted user the access to this namespace. You have the kubeconfig file of this namespace installed on the client system that you'll use to access your device. For detailed instructions, see [Connect to and manage a Kubernetes cluster via kubectl on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-create-kubernetes-cluster.md#configure-cluster-access-via-kubernetes-rbac). 

1. Save the following deployment `yaml` on your local system. You'll use this file to run Kubernetes deployment. This deployment is based on [Simple CUDA containers](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#running-simple-containers) that are publicly available from Nvidia. 

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: cuda-sample1
      labels:
        app: nbody1
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nbody1
      template:
        metadata:
          labels:
            app: nbody1
        spec:
          hostPID: true
          hostIPC: true
          containers:
            - name: cuda-sample-container1
              image: nvcr.io/nvidia/k8s/cuda-sample:nbody
              env:
              - name: NVIDIA_VISIBLE_DEVICES
                value: "0"
    
    ---
    
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: cuda-sample2
      labels:
        app: nbody2
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nbody2
      template:
        metadata:
          labels:
            app: nbody2
        spec:
          hostPID: true
          hostIPC: true
          containers:
            - name: cuda-sample-container2
              image: nvcr.io/nvidia/k8s/cuda-sample:nbody
              env:
              - name: NVIDIA_VISIBLE_DEVICES
                value: "0"
    ```

## Verify GPU driver, CUDA version

The first step is to verify that your device is running required GPU driver and CUDA versions.

1. [Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

1. Run the following command:

    `Get-HcsGpuNvidiaSmi`

1. In the Nvidia smi output, make a note of the GPU version and the CUDA version on your device. If you are running Azure Stack Edge 2102 software, this version would correspond to the following driver versions:

    - GPU driver version: 460.32.03
    - CUDA version: 11.2
    
    Here is an example output:

    ```powershell
    [10.57.51.94]: PS>Get-HcsGpuNvidiaSmi
	K8S-1HXQG13CL-1HXQG13:
	
	Tue Feb 16 15:51:05 2021
	+-----------------------------------------------------------------------------+
	| NVIDIA-SMI 460.32.03    Driver Version: 460.32.03    CUDA Version: 11.2     |
	|-------------------------------+----------------------+----------------------+
	| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
	| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
	|                               |                      |               MIG M. |
	|===============================+======================+======================|
	|   0  Tesla T4            On   | 0000191E:00:00.0 Off |                    0 |
	| N/A   34C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
	|                               |                      |                  N/A |
	+-------------------------------+----------------------+----------------------+
	
	+-----------------------------------------------------------------------------+
	| Processes:                                                                  |
	|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
	|        ID   ID                                                   Usage      |
	|=============================================================================|
	|  No running processes found                                                 |
	+-----------------------------------------------------------------------------+
	[10.57.51.94]: PS>    
    ```


1. Keep this session open as you will use it to view the Nvidia smi output throughout the article.


## Example deployment 1

In deployment 1, you will deploy an application on your device in the namespace `mynamesp1` when the Multi-Process Service is not running. 

1. List all the pods running in the namespace. Run the following command: 

    `kubectl get pods -n <Name of the namespace>`

    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl get pods -n mynamesp1
    No resources found.
    ```
1. To create the deployment on your device, run the following command: 

    `kubectl apply -f <Path to the deployment .yaml> -n <Name of the namespace>`   

    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl apply -f 'C:\GPU-sharing\gpushare_k8_deployment_with_nbody.yaml' -n mynamesp1
    deployment.apps/cuda-sample1 created
    deployment.apps/cuda-sample2 created
    PS C:\WINDOWS\system32>
    ```

1. Run the `kubectl get deployment -n <Name of the namespace>` to check if the deployment was created in the specified namespace.
			
    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl get deployment -n mynamesp1
    NAME           READY   UP-TO-DATE   AVAILABLE   AGE
    cuda-sample1   1/1     1            1           39s
    cuda-sample2   1/1     1            1           39s
    PS C:\WINDOWS\system32>
    ```
    When you inspect the deployments in your cluster, the following fields are displayed:

    - NAME lists the names of the containers running in the namespace.
    - READY displays how many replicas of the application are available to your users. It follows the pattern ready/desired.
    - UP-TO-DATE displays the number of replicas that have been updated to achieve the desired state.
    - AVAILABLE displays how many replicas of the application are available to your users.
    - AGE displays the amount of time that the application has been running.

1. To list the pods started in the deployment, run the following command:

    `kubectl get pods -n <Name of the namespace>`   

    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl get pods -n mynamesp1
    NAME                            READY   STATUS    RESTARTS   AGE
    cuda-sample1-cf979886d-xcwsq    1/1     Running   0          56s
    cuda-sample2-68b4899948-vcv68   1/1     Running   0          56s
    PS C:\WINDOWS\system32>
    ```

    There are two pods, `cuda-sample1-cf979886d-xcwsq` and `cuda-sample2-68b4899948-vcv68` running on your device.

1. Get a shell to the first running pod. Run the following command:

    `kubectl exec -it <Name of the pod> -n <Name of the namespace> -- bash `   

    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl exec -it cuda-sample1-cf979886d-xcwsq -n mynamesp1 -- bash
    root@cuda-sample1-cf979886d-xcwsq:/#
    ```

    Repeat this command to get a shell to the second pod running on your device. Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> kubectl exec -it cuda-sample2-68b4899948-vcv68 -n mynamesp1 -- bash
    root@cuda-sample2-68b4899948-vcv68:/#
    ```

1. Run n-body simulation on both the pods that you are connected to. For more information, see [N-body simulation](https://physics.princeton.edu//~fpretori/Nbody/intro.htm).

    Here is an example output from the first container:

    ```powershell
    root@cuda-sample1-cf979886d-xcwsq:/# nbody -benchmark -i=1000
    Run "nbody -benchmark [-numbodies=<numBodies>]" to measure performance.
    ============snipped==========snipped==================================
    > Windowed mode
    > Simulation data stored in video memory
    > Single precision floating point simulation
    > 1 Devices used for simulation
    MapSMtoCores for SM 7.5 is undefined.  Default to use 64 Cores/SM
    GPU Device 0: "Tesla T4" with compute capability 7.5
    
    > Compute 7.5 CUDA device: [Tesla T4]
    40960 bodies, total time for 1000 iterations: 34524.770 ms
    = 48.595 billion interactions per second
    = 971.894 single-precision GFLOP/s at 20 flops per interaction
    root@cuda-sample1-cf979886d-xcwsq:/#
    ```

    Here is an example output from the second container:

    ```powershell
    root@cuda-sample2-68b4899948-vcv68:/# nbody -benchmark -i=1000
    Run "nbody -benchmark [-numbodies=<numBodies>]" to measure performance.
    ============snipped==========snipped==================================
    
    > Windowed mode
    > Simulation data stored in video memory
    > Single precision floating point simulation
    > 1 Devices used for simulation
    MapSMtoCores for SM 7.5 is undefined.  Default to use 64 Cores/SM
    GPU Device 0: "Tesla T4" with compute capability 7.5
    
    > Compute 7.5 CUDA device: [Tesla T4]
    40960 bodies, total time for 1000 iterations: 26075.754 ms
    = 64.340 billion interactions per second
    = 1286.806 single-precision GFLOP/s at 20 flops per interaction
    ```

1. While both the containers are running the n-body simulation, view the GPU utilization from the Nvidia smi output. Go to the PowerShell interface of the device and run `Get-HcsGpuNvidiaSmi`.

    Here is an example output when both the containers are running the n-body simulation:

    ```powershell
    [10.57.51.94]: PS>Get-HcsGpuNvidiaSmi
    K8S-1HXQG13CL-1HXQG13:
    
    Tue Feb 16 16:59:59 2021
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 460.32.03    Driver Version: 460.32.03    CUDA Version: 11.2     |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |                               |                      |               MIG M. |
    |===============================+======================+======================|
    |   0  Tesla T4            On   | 0000191E:00:00.0 Off |                    0 |
    | N/A   69C    P0    69W /  70W |    439MiB / 15109MiB |    100%      Default |
    |                               |                      |                  N/A |
    +-------------------------------+----------------------+----------------------+
    
    +-----------------------------------------------------------------------------+
    | Processes:                                                                  |
    |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
    |        ID   ID                                                   Usage      |
    |=============================================================================|
    |    0   N/A  N/A     69272      C   /usr/local/bin/nbody              109MiB |
    |    0   N/A  N/A     69362      C   /usr/local/bin/nbody              109MiB |
    |    0   N/A  N/A     85161      C   nbody                             109MiB |
    |    0   N/A  N/A     85165      C   nbody                             109MiB |
    +-----------------------------------------------------------------------------+
    
    [10.57.51.94]: PS>    
    ```
    As you can see, there are two containers (Type = C) running with n-body simulation on GPU 0. You can also view their corresponding GPU memory usage.

## Example deployment 2

In deployment 2, you'll deploy the n-body simulation on two CUDA containers when MPS is running on your device. First, you'll enable MPS on the device.

1. [Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md).

1. To enable MPS on your device, run the `Start-HcsGpuMPS` command.

    ```powershell
    [10.57.51.94]: PS>Start-HcsGpuMPS
    K8S-1HXQG13CL-1HXQG13:
    Set compute mode to EXCLUSIVE_PROCESS for GPU 0000191E:00:00.0.
    All done.
    Created nvidia-mps.service
    [10.57.51.94]: PS>    
    ```
1. Run the deployment using the same deployment `yaml` you used earlier. You may need to delete the existing deployment. See [Delete deployment](#delete-deployment).

    Here is an example output:

    ```yml
    PS C:\WINDOWS\system32> kubectl apply -f 'C:\GPU-sharing\gpushare_k8_deployment_with_nbody.yaml' -n mynamesp1
    deployment.apps/cuda-sample1 created
    deployment.apps/cuda-sample2 created
    PS C:\WINDOWS\system32> kubectl get deployment -n mynamesp1
    NAME           READY   UP-TO-DATE   AVAILABLE   AGE
    cuda-sample1   1/1     1            1           47s
    cuda-sample2   1/1     1            1           47s
    PS C:\WINDOWS\system32> kubectl get pods -n mynamesp1
    NAME                            READY   STATUS    RESTARTS   AGE
    cuda-sample1-cf979886d-tqlg5    1/1     Running   0          59s
    cuda-sample2-68b4899948-pthsg   1/1     Running   0          59s
    PS C:\WINDOWS\system32>
    ```

1. Get the Nvidia smi output from the PowerShell interface of the device. You can see the `nvidia-cuda-mps-server` process running in addition to the two processes corresponding to the CUDA containers created by the deployment.

    Here is an example output:

    ```yml
    [10.57.51.94]: PS>Get-HcsGpuNvidiaSmi
    K8S-1HXQG13CL-1HXQG13:
    
    Thu Feb 18 16:16:42 2021
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 460.32.03    Driver Version: 460.32.03    CUDA Version: 11.2     |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |                               |                      |               MIG M. |
    |===============================+======================+======================|
    |   0  Tesla T4            On   | 0000191E:00:00.0 Off |                    0 |
    | N/A   70C    P0    70W /  70W |    242MiB / 15109MiB |    100%   E. Process |
    |                               |                      |                  N/A |
    +-------------------------------+----------------------+----------------------+
    
    +-----------------------------------------------------------------------------+
    | Processes:                                                                  |
    |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
    |        ID   ID                                                   Usage      |
    |=============================================================================|
    |    0   N/A  N/A    132009    M+C   /usr/local/bin/nbody              107MiB |
    |    0   N/A  N/A    132013      C   nvidia-cuda-mps-server             25MiB |
    |    0   N/A  N/A    132031    M+C   /usr/local/bin/nbody              107MiB |
    +-----------------------------------------------------------------------------+
    ```

1. Run n-body simulation on the first container. Here is an example output:

    ```powershell
    root@cuda-sample1-cf979886d-tqlg5:/# nbody -benchmark -i=1000
    Run "nbody -benchmark [-numbodies=<numBodies>]" to measure performance.
    ============snipped==========snipped==================================
    > Windowed mode
    > Simulation data stored in video memory
    > Single precision floating point simulation
    > 1 Devices used for simulation
    MapSMtoCores for SM 7.5 is undefined.  Default to use 64 Cores/SM
    GPU Device 0: "Tesla T4" with compute capability 7.5
    
    > Compute 7.5 CUDA device: [Tesla T4]
    40960 bodies, total time for 1000 iterations: 26452.020 ms
    = 63.425 billion interactions per second
    = 1268.502 single-precision GFLOP/s at 20 flops per interaction
    root@cuda-sample1-cf979886d-tqlg5:/#
    ```
1. Run n-body simulation on the second container. Here is an example output:

    ```powershell
    root@cuda-sample2-68b4899948-pthsg:/# nbody -benchmark -i=1000
    Run "nbody -benchmark [-numbodies=<numBodies>]" to measure performance.
    ============snipped==========snipped==================================
    > Windowed mode
    > Simulation data stored in video memory
    > Single precision floating point simulation
    > 1 Devices used for simulation
    MapSMtoCores for SM 7.5 is undefined.  Default to use 64 Cores/SM
    GPU Device 0: "Tesla T4" with compute capability 7.5
    
    > Compute 7.5 CUDA device: [Tesla T4]
    40960 bodies, total time for 1000 iterations: 26463.982 ms
    = 63.396 billion interactions per second
    = 1267.928 single-precision GFLOP/s at 20 flops per interaction
    root@cuda-sample2-68b4899948-pthsg:/#    
    ```

1. Get the Nvidia smi output from the PowerShell interface of the device when both the containers are running the n-body simulation. You can also see that nvidia-cuda-mps-server is running in parallel with all the other processes (2 corresponding to the container, 2 corresponding to the simulation workload)

    ```powershell
    [10.57.51.94]: PS>Get-HcsGpuNvidiaSmi
    K8S-1HXQG13CL-1HXQG13:
    Thu Feb 18 16:33:17 2021
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 460.32.03    Driver Version: 460.32.03    CUDA Version: 11.2     |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |                               |                      |               MIG M. |
    |===============================+======================+======================|
    |   0  Tesla T4            On   | 0000191E:00:00.0 Off |                    0 |
    | N/A   69C    P0    68W /  70W |    456MiB / 15109MiB |    100%   E. Process |
    |                               |                      |                  N/A |
    +-------------------------------+----------------------+----------------------+
    
    +-----------------------------------------------------------------------------+
    | Processes:                                                                  |
    |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
    |        ID   ID                                                   Usage      |
    |=============================================================================|
    |    0   N/A  N/A    132009    M+C   /usr/local/bin/nbody              107MiB |
    |    0   N/A  N/A    132013      C   nvidia-cuda-mps-server             25MiB |
    |    0   N/A  N/A    132031    M+C   /usr/local/bin/nbody              107MiB |
    |    0   N/A  N/A    165829    M+C   nbody                             107MiB |
    |    0   N/A  N/A    166019    M+C   nbody                             107MiB |
    +-----------------------------------------------------------------------------+
    [10.57.51.94]: PS>    
    ```

## Delete deployment

You may need to delete deployments when running with MPS enabled and with MPS disable on your device.

To delete the deployment on your device, run the following command: 

`kubectl delete -f <Path to the deployment .yaml> -n <Name of the namespace>`  

Here is an example output:

```powershell
PS C:\WINDOWS\system32> kubectl delete -f 'C:\GPU-sharing\gpushare_k8_deployment_with_nbody.yaml' -n mynamesp1
deployment.apps "cuda-sample1" deleted
deployment.apps "cuda-sample2" deleted
PS C:\WINDOWS\system32>
```
    
## Next steps

- [Deploy an IoT Edge workload with GPU sharing on your Azure Stack Edge Pro](azure-stack-edge-gpu-placeholder.md).
