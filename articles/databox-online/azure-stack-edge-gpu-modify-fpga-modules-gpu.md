---
title: Modify IoT Edge modules on FPGA device to run on Azure Stack Edge Pro GPU device
description: Describes what modifications are needed for existing IoT Edge modules on existing FPGA devices to run on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 01/14/2021
ms.author: alkohli
---

# Run IoT Edge modules from Azure Stack Edge Pro FPGA devices on Azure Stack Edge Pro GPU device

This article describes how to deploy a Graphics Processing Unit (GPU) enabled IoT Edge module from Azure Marketplace on your Azure Stack Edge Pro device. 

## About IoT Edge implementation 

The IoT Edge implementation is different on Azure Stack Edge Pro FPGA devices vs. that on Azure Stack Edge Pro GPU devices. The differences are with respect to storage, networking, resource usage, web proxy among others.

## Storage

- Storage for containers is associated with containers using volume mounts, rather than binding paths for the FPGA devices.
- Deployment can’t have binds for associating persistent storage or host paths.
    - For persistent storage, use Mounts with type volume.
    - For host paths, use Mounts with type bind.
- For IoT Edge on Kubernetes, bind through Mounts works only for directory, and not for file.

#### Example - Storage via volume mounts 

For the FPGA devices, host path bindings are used to map the shares on the device to paths inside the container. Here are the container create options used:

{
  "HostConfig": 
  {
   "Binds": 
    [
     "<Host storage path for Edge local share>:<Module storage path>"
    ]
   }
}

<!-- is this how it will look on GPU device?-->
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

<!--need the corresponding for GPU devices for hostpaths>

<!--following example is for persistent storage where we use mounts w/ type volume-->

For the GPU devices with Kubernetes, volume mounts are used. To provision storage using shares, the value of `Mounts.Source` would be the name of the SMB or NFS share that was provisioned on your Azure Stack Edge Pro GPU device. The `/home/input` is the path at which the volume is accessible within the container. Here are the container create options used:

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
 

## Network

The following 
- `HostPort` specification is required to expose a service both inside and outside the cluster.
    - K8sExperimental options to limit exposure of service to cluster only.
- Inter module communication requires HostPort specification, and connection using mapped port (and not using the container exposed port).
- Host networking works with dnsPolicy = ClusterFirstWithHostNet, with that all containers (esp edgeHub) don’t have to be on host network as well.
- Adding port mappings for tcp, udp in same request doesn’t work.

#### Example - External access to modules 

For any IoT Edge modules that specify port bindings, an IP address is assigned using the Kubernetes external service IP range that was specified in the local UI of the device. There are no changes to the container create options as shown in the following example.  
	
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

However, to query the IP address assigned to your module, you can use the Kubernetes dashboard as described in [Get IP address for services or modules](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md#get-ip-address-for-services-or-modules). Alternatively, you can [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and use the `iotedge` list command to list all the modules running on your device. The [Command output](azure-stack-edge-gpu-connect-powershell-interface.md#debug-kubernetes-issues-related-to-iot-edge) will also indicate the external IPs associated with the module.


## Resource usage

With the Kubernetes-based IoT Edge setups on GPU devices, the resources such as hardware acceleration, memory and CPU requirements are specified differently than the FPGA devices. 

- **Specifying GPU usage**: To deploy FPGA models, you use the container create options with Device Bindings as shown in the following config: 
	
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
			
	<!--Note: The IP address assigned to your FPGA module's service can be used to send inferencing requests from outside the cluster OR your ML module can be used along with DBE Simple Module Flow by passing files to the module using an input share.-->
	
    For GPU, use resource request specifications instead of Device Bindings as shown in the following minimal configuration. You request nvidia resources instead of catapult, and there is no need for anything related to the `wireserver`. 
    	
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


- **Specifying memory usage**: To set memory usage, use processor limits for modules in the k8s-experimental section. Using shared memory for modules also requires a different way.
- **Specifying CPU usage**: The memory and CPU are not necessary but generally good practice. If `requests` isn't specified, the values set in limits are used as the minimum required. 


## Web proxy configuration

- If you have web proxy configured in your network, you will need to configure the following environment variables for the edgeHub deployment on your FPGA devices:

    - `https_proxy` : <proxy URL>
    - `UpstreamProtocol`: AmqpWs (unless the web proxy allows Amqp traffic)

    For the Kubernetes-based IoT Edge setups on GPU devices, you'll need to configure this additional variable during the deployment:

    - `no_proxy`: localhost

## Other differences:

- **Deployment strategy**: You may need to change the deployment behavior for any updates to the module. The default behavior for IoT Edge modules is rolling update. This behavior prevents the updated module from restarting if the module is using resources such as hardware acceleration or network ports. This behavior can have unexpected effects, specially when dealing with persistent volumes on Kubernetes platform for the GPU devices. To override this default behavior, you can specify a `Recreate` in the `k8s-experimental` section in your module.
    
    {
      "k8s-experimental": {
        "strategy": {
          "type": "Recreate"
        }
      }
    }

- **Create options**: Certain docker create options that worked on FPGA devices will not work in the Kubernetes environment on your GPU devices. For example: , like – EntryPoint ? (can’t recall what was it.)


## Next Steps

- Learn more about how to [Configure GPU to use a module](azure-stack-edge-j-series-configure-gpu-modules.md).
