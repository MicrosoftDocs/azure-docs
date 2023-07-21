---
title: Modify IoT Edge modules on FPGA device to run on Azure Stack Edge Pro GPU device
description: Describes what modifications are needed for existing IoT Edge modules on existing FPGA devices to run on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/18/2021
ms.author: alkohli
ms.custom: ignite-fall-2021
---

# Run existing IoT Edge modules from Azure Stack Edge Pro FPGA devices on Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

> [!NOTE]
> We strongly recommend that you deploy the latest IoT Edge version in a Linux VM. The managed IoT Edge on Azure Stack Edge uses an older version of IoT Edge runtime that doesn’t have the latest features and patches. For instructions, see how to [Deploy an Ubuntu VM](azure-stack-edge-gpu-deploy-iot-edge-linux-vm.md). For more information on other supported Linux distributions that can run IoT Edge, see [Azure IoT Edge supported systems – Container engines](../iot-edge/support.md#linux-containers).

This article details the changes needed for a docker-based IoT Edge module that runs on Azure Stack Edge Pro FPGA so it can run on a Kubernetes-based IoT Edge platform on Azure Stack Edge Pro GPU device. 

## About IoT Edge implementation 

The IoT Edge implementation is different on Azure Stack Edge Pro FPGA devices vs. that on Azure Stack Edge Pro GPU devices. For the GPU devices, Kubernetes is used as a hosting platform for IoT Edge. The IoT Edge on FPGA devices uses a docker-based platform. The IoT Edge docker-based application model is automatically translated to the Kubernetes native application model. However, some changes may still be needed as only a small subset of the Kubernetes application model is supported.

If you are migrating your workloads from an FPGA device to a GPU device, you will need to make changes to the existing IoT Edge modules for those to run successfully on the Kubernetes platform. You may need to specify your storage, networking, resource usage, and web proxy requirements differently. 

## Storage

Consider the following information when specifying storage for the IoT Edge modules.

- Storage for containers on Kubernetes is specified using volume mounts.
- Deployment on Kubernetes can’t have binds for associating persistent storage or host paths.
    - For persistent storage, use `Mounts` with type `volume`.
    - For host paths, use `Mounts` with type `bind`.
- For IoT Edge on Kubernetes, bind through `Mounts` works only for directory, and not for file.

#### Example - Storage via volume mounts 

For IoT Edge on docker, host path bindings are used to map the shares on the device to paths inside the container. Here are the container create options used on FPGA devices:

```
{
  "HostConfig": 
  {
   "Binds": 
    [
     "<Host storage path for Edge local share>:<Module storage path>"
    ]
   }
}
```
<!-- is this how it will look on GPU device?-->
For host paths for IoT Edge on Kubernetes, an example of using `Mounts` with type `bind` is shown here:
```
{
    "HostConfig": {
        "Mounts": [
            {
                "Target": "<Module storage path>",
                "Source": "<Host storage path>",
                "Type": "bind"
            }
        ]
    }
}
```


<!--following example is for persistent storage where we use mounts w/ type volume-->

For the GPU devices running IoT Edge on Kubernetes, volume mounts are used to specify storage. To provision storage using shares, the value of `Mounts.Source` would be the name of the SMB or NFS share that was provisioned on your GPU device. The `/home/input` is the path at which the volume is accessible within the container. Here are the container create options used on the GPU devices:

```
{
    "HostConfig": {
        "Mounts": [
        {
            "Target": "/home/input",
            "Source": "<nfs-or-smb-share-name-here>",
            "Type": "volume"
        },
        {
            "Target": "/home/output",
            "Source": "<nfs-or-smb-share-name-here>",
            "Type": "volume"
        }]
    }
}
```



## Network

Consider the following information when specifying networking for the IoT Edge modules. 

- `HostPort` specification is required to expose a service both inside and outside the cluster.
    - K8sExperimental options to limit exposure of service to cluster only.
- Inter module communication requires `HostPort` specification, and connection using mapped port (and not using the container exposed port).
- Host networking works with `dnsPolicy = ClusterFirstWithHostNet`, with that all containers (especially `edgeHub`) don’t have to be on host network as well. <!--Need further clarifications on this one-->
- Adding port mappings for TCP, UDP in same request doesn’t work.

#### Example - External access to modules 

For any IoT Edge modules that specify port bindings, an IP address is assigned using the Kubernetes external service IP range that was specified in the local UI of the device. There are no changes to the container create options between IoT Edge on docker vs IoT Edge on Kubernetes as shown in the following example.  

```json	
{
    "HostConfig": {
        "PortBindings": {
            "5000/tcp": [
                {
                    "HostPort": "5000"
                }
            ]
        }
    }
}
```

However, to query the IP address assigned to your module, you can use the Kubernetes dashboard as described in [Get IP address for services or modules](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md#get-ip-address-for-services-or-modules). 

Alternatively, you can [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and use the `iotedge` list command to list all the modules running on your device. The [Command output](azure-stack-edge-gpu-connect-powershell-interface.md#debug-kubernetes-issues-related-to-iot-edge) will also indicate the external IPs associated with the module.


## Resource usage 

With the Kubernetes-based IoT Edge setups on GPU devices, the resources such as hardware acceleration, memory, and CPU requirements are specified differently than on the FPGA devices. 

#### Compute acceleration usage

To deploy modules on FPGA, use the container create options <!--with Device Bindings--> as shown in the following config: <!--not sure where are device bindings in this config--> 

```json
{
    "HostConfig": {
    "Privileged": true,
    "PortBindings": {
        "50051/tcp": [
        {
            "HostPort": "50051"
        }
        ]
    }
    },
    "k8s-experimental": {
    "resources": {
        "limits": {
        "microsoft.com/fpga_catapult": 2
        },
        "requests": {
        "microsoft.com/fpga_catapult": 2
        }
    }
    },
    "Env": [
    "WIRESERVER_ADDRESS=10.139.218.1"
    ]
}
```	

	
<!--Note: The IP address assigned to your FPGA module's service can be used to send inferencing requests from outside the cluster OR your ML module can be used along with DBE Simple Module Flow by passing files to the module using an input share.-->
	
For GPU, use resource request specifications instead of Device Bindings as shown in the following minimal configuration. You request nvidia resources instead of catapult, and you needn't specify the `wireserver`. 

```json    	
{
    "HostConfig": {
    "Privileged": true,
    "PortBindings": {
        "50051/tcp": [
        {
            "HostPort": "50051"
        }
        ]
    }
    },
    "k8s-experimental": {
    "resources": {
        "limits": {
        "nvidia.com/gpu": 2
        }    
    }
}
```

#### Memory and CPU usage
 
To set memory and CPU usage, use processor limits for modules in the `k8s-experimental` section. <!--can we verify if this is how we set limits of memory and CPU-->

```json
    "k8s-experimental": {
    "resources": {
        "limits": {
            "memory": "128Mi",
            "cpu": "500m",
            "nvidia.com/gpu": 2
        },
        "requests": {
            "nvidia.com/gpu": 2
        }
}
```
The memory and CPU specification are not necessary but generally good practice. If `requests` isn't specified, the values set in limits are used as the minimum required. 

Using shared memory for modules also requires a different way. For example, you can use the Host IPC mode for shared memory access between Live Video Analytics and Inference solutions as described in [Deploy Live Video Analytics on Azure Stack Edge](/previous-versions/azure/azure-video-analyzer/video-analyzer-docs/articles/azure-video-analyzer/video-analyzer-docs/overview).

## Web proxy 

Consider the following information when configuring web proxy:

If you have web proxy configured in your network, configure the following environment variables for the `edgeHub` deployment on your docker-based IoT Edge setup on FPGA devices:

- `https_proxy : <proxy URL>`
- `UpstreamProtocol : AmqpWs` (unless the web proxy allows `Amqp` traffic)

For the Kubernetes-based IoT Edge setups on GPU devices, you'll need to configure this additional variable during the deployment:

- `no_proxy`: localhost

- IoT Edge proxy on Kubernetes platform uses port 35000 and 35001. Make sure that your module does not run at these ports or it could cause port conflicts. 

## Other differences

- **Deployment strategy**: You may need to change the deployment behavior for any updates to the module. The default behavior for IoT Edge modules is rolling update. This behavior prevents the updated module from restarting if the module is using resources such as hardware acceleration or network ports. This behavior can have unexpected effects, specially when dealing with persistent volumes on Kubernetes platform for the GPU devices. To override this default behavior, you can specify a `Recreate` in the `k8s-experimental` section in your module.

    ```    
    {
      "k8s-experimental": {
        "strategy": {
          "type": "Recreate"
        }
      }
    }
    ```

- **Modules names**: Module names should follow Kubernetes naming conventions. You may need to rename the modules running on IoT Edge with Docker when you  move those modules to IoT Edge with Kubernetes. For more information on naming, see [Kubernetes naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/).
- **Other options**: 
    - Certain docker create options that worked on FPGA devices will not work in the Kubernetes environment on your GPU devices. For example: , like – EntryPoint.<!--can we confirm what exactly is required here-->
    - Environment variables such as `:` need to be replaced by `__`.
    - **Container Creating** status for a Kubernetes pod leads to **backoff** status for a module on the IoT Hub resource. While there are a number of reasons for the pod to be in this status, a common reason is when a large container image is being pulled over a low network bandwidth connection. When the pod is in this state, the status of the module appears as **backoff** in IOT Hub though the module is just starting up.


## Next steps

- Learn more about how to [Configure GPU to use a module](./azure-stack-edge-gpu-configure-gpu-modules.md).
