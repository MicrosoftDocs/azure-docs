---
title: Common questions for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about commonly asked questions and answers for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: 
author: chackdan
ms.author: chackdan
ms.date: 4/23/2019
ms.topic: troubleshooting
ms.service: service-fabric-mesh
manager: jeanpaul.connock
---
# Commonly asked Service Fabric Mesh questions

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. This article has answers to commonly asked questions.

## How do I report an issue or ask a question?

Ask questions, get answers from Microsoft engineers, and report issues in the [service-fabric-mesh-preview GitHub repo](https://aka.ms/sfmeshissues).

## Quota and Cost

### What is the cost of participating in the preview?

There are currently no charges for deploying applications or containers to the Mesh preview. Please watch for updates in May for enablement for billing. However, we encourage you to delete the resources you deploy and not leave them running unless you're actively testing them.

### Is there a quota limit of the number of cores and RAM?

Yes. The quotas for each subscription are:

- Number of applications: 5
- Cores per application: 12
- Total RAM per application: 48 GB
- Network and Ingress end points: 5
- Azure Volumes that you can attach: 10
- Number of Service replicas: 3
- The largest container you can deploy is limited to 4 cores and 16GB RAM.
- You can allocate partial cores to your containers in increments of 0.5 cores, up to a maximum of 6 cores.

### How long can I leave my application deployed?

We have currently limited the lifetime of an application to two days. This is in order to maximize the use of the free cores allocated to the preview. 
As a result, you are only allowed to run a given deployment continuously for 48 hours, after which time it will be shut down.

If you see this happen, you can validate that the system shut it down by running the `az mesh app show` command in the Azure CLI. Check to see if it returns `"status": "Failed", "statusDetails": "Stopped resource due to max lifetime policies for an application during preview. Delete the resource to continue."` 

For example: 

```cli
~$ az mesh app show --resource-group myResourceGroup --name helloWorldApp
{
  "debugParams": null,
  "description": "Service Fabric Mesh HelloWorld Application!",
  "diagnostics": null,
  "healthState": "Ok",
  "id": "/subscriptions/1134234-b756-4979-84re-09d671c0c345/resourcegroups/myResourceGroup/providers/Microsoft.ServiceFabricMesh/applications/helloWorldApp",
  "location": "eastus",
  "name": "helloWorldApp",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "serviceNames": [
    "helloWorldService"
  ],
  "services": null,
  "status": "Failed",
  "statusDetails": "Stopped resource due to max lifetime policies for an application during preview. Delete the resource to continue.",
  "tags": {},
  "type": "Microsoft.ServiceFabricMesh/applications",
  "unhealthyEvaluation": null
}
```

To delete the resource group, use the `az group delete <nameOfResourceGroup>` command.

## Deployments

### What container images are supported?

If you are developing on a Windows Fall Creators Update (version 1709) machine, you can only use Windows version 1709 docker images.

If you are developing on a Windows 10 April 2018 update (version 1803) machine, you can use either Windows version 1709 or Windows version 1803 docker images.

The following container OS images can be used to deploy services:

- Windows - windowsservercore and nanoserver
    - Windows Server 1709
    - Windows Server 1803
    - Windows Server 1809
    - Windows Server 2019 LTSC
- Linux
    - No known limitations

> [!NOTE]
> Visual Studio tooling for Mesh does not yet support deploying into Windows Server 2019 and 1809 containers.

### What types of applications can I deploy? 

You can deploy anything that runs in containers that fit within the restrictions placed on an application resource (see above for more info on quotas). If we detect that you are using Mesh for running illegal workloads or abusing the system (i.e. mining), then we reserve the right to terminate your deployments and blocklist your subscription from running on the service. Please reach out to us if you have any questions on running a specific workload. 

## Developer experience issues

### DNS resolution from a container doesn't work

Outgoing DNS queries from a container to the Service Fabric DNS service may fail under certain circumstances. This is being investigated. To mitigate:

- Use Windows Fall Creators update (version 1709) or higher as your base container image.
- If the service name alone doesn't work, try the fully qualified name: ServiceName.ApplicationName.
- In the Docker file for your service, add `EXPOSE <port>` where port is the port you are exposing your service on. For example:

```Dockerfile
EXPOSE 80
```

### DNS does not work the same as it does for Service Fabric development clusters and in Mesh

You may need to reference services differently in your local development cluster than in Azure Mesh.

In your local development cluster use `{serviceName}.{applicationName}`. In Azure Service Fabric Mesh, use `{servicename}`. 

Azure Mesh does not currently support DNS resolution across applications.

For other known DNS issues with running a Service Fabric development cluster on Windows 10, see: [Debug Windows containers](/azure/service-fabric/service-fabric-how-to-debug-windows-containers) and [known DNS issues](https://docs.microsoft.com/azure/service-fabric/service-fabric-dnsservice#known-issues).

### Networking

The ServiceFabric network NAT may disappear while using running your app on your local machine. To diagnose whether this has happened, run the following from a command prompt:

`docker network ls` and note whether `servicefabric_nat` is listed.  If not, then run the following command:
`docker network create -d=nat --subnet 10.128.0.0/24 --gateway 10.128.0.1 servicefabric_nat`

This will address the issue even if app is already deployed locally and in an unhealthy state.

### Issues running multiple apps

You might encounter CPU availability and limits being fixed across all applications. To mitigate:
- Create a five node cluster.
- Reduce CPU usage in services across the app that is deployed. For example, in your service's service.yaml file, change `cpu: 1.0` to `cpu: 0.5`

Multiple applications can't be deployed to a one-node cluster. To mitigate:
- Use a five node cluster when deploying multiple apps to a local cluster.
- Remove apps that you are not currently testing.

### VS Tooling has limited support for Windows containers

The Visual Studio tooling only supports deploying Windows Containers with a base OS version of Windows Server 1709 and 1803 today. 

## Feature gaps and other known issues

### After deploying my application, the network resource associated with it does not have an IP address

There is a known issue in which the IP address doesn't become available immediately. Check the status of the network resource in a few minutes to see the associated IP address.

### My application fails to access the right network/volume resource

In your application model, use the full resource ID for networks and volumes to be able to access the associated resource. Here is an example from the quickstart sample:

```json
"networkRefs": [
    {
    "name":  "[resourceId('Microsoft.ServiceFabric/networks', 'SbzVotingNetwork')]" 
    }
]
```

### When I scale out, all of my containers are affected, including running ones

This is a bug and a fix is being implemented.

## Next steps

To learn more about Service Fabric Mesh, read the [overview](service-fabric-mesh-overview.md).
