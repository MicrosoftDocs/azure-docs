<properties
 pageTitle="Sizes for cloud services"
 description="Lists the different sizes for Azure cloud service web and worker roles."
 services="cloud-services"
 documentationCenter=""
 authors="Thraka"
 manager="timlt"
 editor=""/>
<tags
 ms.service="cloud-services"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/14/2015"
 ms.author="adegeo"/>

# Sizes for Cloud Services

This topic describes the available sizes and options for Cloud Service role instances (web roles and worker roles). It also provides deployment considerations to be aware of when planning to use these resources.

Azure Virtual Machines and Cloud Services are two of several types of compute resources offered by Azure. For explanations, see [Compute Hosting Options Provided by Azure](fundamentals-application-models.md).

> [AZURE.NOTE]To see related Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

## Sizes for web and worker role instances

The following considerations might help you decide on a size:

* D-series VM instances are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).  

* Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.2 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

* Web roles and worker roles require more temporary disk space than Azure Virtual Machines because of system requirements. The system files reserve 4 GB of space for the Windows page file, and 2 GB of space for the Windows dump file.  

* The OS disk contains the Windows guest OS and includes the Program Files folder (including installations done via startup tasks unless you specify another disk), registry changes, the System32 folder, and the .NET framework.  

* The **temporary storage disk** contains Azure logs and configuration files, Azure Diagnostics (which includes your IIS logs), and any local storage resources you define.  

* The **application disk** is where your .cspkg is extracted and includes your website, binaries, role host process, startup tasks, web.config, and so on.  

* The A8/A10 and A9/A11 virtual machine sizes have the same capacities. The A8 and A9 virtual machine instances include an additional network adapter that is connected to a remote direct memory access (RDMA) network for fast communication between virtual machines. The A8 and A9 instances are designed for high-performance computing applications that require constant and low-latency communication between nodes during execution, for example, applications that use the Message Passing Interface (MPI). The A10 and A11 virtual machine instances do not include the additional network adapter. A10 and A11 instances are designed for high-performance computing applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.

    >[AZURE.NOTE] If you're considering sizes A8 through A11, please read [this](..\virtual-machines\virtual-machines-a8-a9-a10-a11-specs.md) information.

>[AZURE.NOTE] All machine sizes provide an **application disk** that stores all the files from your cloud service package; it is around 1.5 GB in size. 

### General purpose compute: Basic tier

An economical option for development workloads, test servers, and other applications that don't require load balancing, auto-scaling, or memory-intensive virtual machines.

>[AZURE.NOTE] **ExtraSmall** through **ExtraLarge** can also be named **A0-A4** respectively. 

| Size            | CPU Cores | Memory  | Temporary storage disk |
| --------------- | --------- | ------- | --------|
| ExtraSmall      | 1         | 768 MB  | 15 GB   |
| Small           | 1         | 1.75 GB | 225 GB  |
| Medium          | 2         | 3.5 GB  | 496 GB  |
| Large           | 4         | 7 GB    | 1018 GB |
| ExtraLarge      | 8         | 14 GB   | 2083 GB |

| Size            | CPU Cores | Memory  | Temporary storage disk |
| A5              | 2         | 14 GB   | 496 GB  |
| A6              | 4         | 28 GB   | 1018 GB |
| A7              | 8         | 56 GB   | 2083 GB |
| A8              | 8         | 56 GB   | 1856 GB |
| A9              | 16        | 112 GB  | 1856 GB |
| A10             | 8         | 56 GB   | 1856 GB |
| A11             | 16        | 112 GB  | 1856 GB |
| Standard_D1     | 1         | 3.5 GB  | 46 GB   |
| Standard_D2     | 2         | 7 GB    | 97 GB   |
| Standard_D3     | 4         | 14 GB   | 199 GB  |
| Standard_D4     | 8         | 28 GB   | 404 GB  |
| Standard_D11    | 2         | 14 GB   | 97 GB   |
| Standard_D12    | 4         | 28 GB   | 199 GB  |
| Standard_D13    | 8         | 56 GB   | 404 GB  |
| Standard_D14    | 16        | 112 GB  | 814 GB  |
| Standard_D1_v2  | 1         | 3.5 GB  | 46 GB   |
| Standard_D2_v2  | 2         | 7 GB    | 97 GB   |
| Standard_D3_v2  | 4         | 14 GB   | 199 GB  |
| Standard_D4_v2  | 8         | 28 GB   | 404 GB  |
| Standard_D5_v2  | 16        | 56 GB   | 814 GB  |
| Standard_D11_v2 | 2         | 14 GB   | 97 GB   |
| Standard_D12_v2 | 4         | 28 GB   | 199 GB  |
| Standard_D13_v2 | 8         | 56 GB   | 404 GB  |
| Standard_D14_v2 | 16        | 112 GB  | 814 GB  |


## Configure sizes for Cloud Services

You can specify the Virtual Machine size of a role instance as part of the service model described by the [service definition file](cloud-services-model-and-package.md#csdef). The size of the role determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to a running instance. Choose the role size based on your application's resource requirement.

Here is an example for setting the role size to be **Standard_D2** for a Web Role instance:

```xml
<WebRole name="WebRole1" vmsize="<mark>Standard_D2</mark>">
...
</WebRole>
```

## Next steps

[Package your cloud service application](cloud-services-model-and-package.md)

[Deploy your cloud service in the portal](cloud-services-how-to-create-deploy-portal.md)

[Create a cloud service in Visual Studio](..\vs-azure-tools-cloud-service-publish-set-up-required-services-in-visual-studio.md)  
