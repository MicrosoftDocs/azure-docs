<properties
 pageTitle="Sizes for cloud services"
 description="Lists the different virtual machine sizes for Azure cloud service web and worker roles."
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
 ms.date="08/10/2016"
 ms.author="adegeo"/>

# Sizes for Cloud Services

This topic describes the available sizes and options for Cloud Service role instances (web roles and worker roles). It also provides deployment considerations to be aware of when planning to use these resources.

Cloud Services is one of several types of compute resources offered by Azure. Click [here](cloud-services-choose-me.md) for more information about Cloud Services.

> [AZURE.NOTE]To see related Azure limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

## Sizes for web and worker role instances

The following considerations might help you decide on a size:

* D-series VM instances are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).  

* Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

* Web roles and worker roles require more temporary disk space than Azure Virtual Machines because of system requirements. The system files reserve 4 GB of space for the Windows page file, and 2 GB of space for the Windows dump file.  

* The OS disk contains the Windows guest OS and includes the Program Files folder (including installations done via startup tasks unless you specify another disk), registry changes, the System32 folder, and the .NET framework.  

* The **temporary storage disk** contains Azure logs and configuration files, Azure Diagnostics (which includes your IIS logs), and any local storage resources you define.  

* The **application disk** is where your .cspkg is extracted and includes your website, binaries, role host process, startup tasks, web.config, and so on.  

* The A8/A10 and A9/A11 virtual machine sizes have the same capacities. The A8 and A9 virtual machine instances include an additional network adapter that is connected to a remote direct memory access (RDMA) network for fast communication between virtual machines. The A8 and A9 instances are designed for high-performance computing applications that require constant and low-latency communication between nodes during execution, for example, applications that use the Message Passing Interface (MPI). The A10 and A11 virtual machine instances do not include the additional network adapter. A10 and A11 instances are designed for high-performance computing applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.

    >[AZURE.NOTE] If you're considering sizes A8 through A11, please read [this](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md) information.

>[AZURE.NOTE] All machine sizes provide an **application disk** that stores all the files from your cloud service package; it is around 1.5 GB in size. 

Please make sure you review the [pricing](https://azure.microsoft.com/pricing/details/cloud-services/) of each Cloud Service size.

## General purpose

For websites, small-to-medium databases, and other everyday applications.

>[AZURE.NOTE] Storage capacity is represented by using 1024^3 bytes as the unit of measurement for GB. This is sometimes referred to as gibibyte, or base 2 definition. When comparing sizes that use different base systems, remember that base 2 sizes may appear smaller than base 10 but for any specific size (such as 1 GB) a base 2 system provides more capacity than a base 10 system, because 1024^3 is greater than 1000^3. 

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | -------: |
| ExtraSmall      | 1         | 0.75 GB | Low           | 19 GB    |
| Small           | 1         | 1.75 GB | Moderate      | 224 GB   |
| Medium          | 2         | 3.5 GB  | Moderate      | 489 GB   |
| Large           | 4         | 7 GB    | High          | 999 GB   |
| ExtraLarge      | 8         | 14 GB   | High          | 2,039 GB |

>[AZURE.NOTE] **ExtraSmall** through **ExtraLarge** can also be named **A0-A4** respectively.

## Memory intensive

For large databases, SharePoint server farms, and high-throughput applications.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------:  |
| A5              | 2         | 14 GB   | Moderate      | 489 GB   |
| A6              | 4         | 28 GB   | High          | 999 GB   |
| A7              | 8         | 56 GB   | High          | 2,039 GB |

## Network optimized with InfiniBand support

Available in select data centers. A8 and A9 virtual machines feature [Intel® Xeon® E5 processors](http://www.intel.com/content/www/us/en/processors/xeon/xeon-processor-e5-family.html). Adds a 32 Gbit/s **InfiniBand** network with remote direct memory access (RDMA) technology. Ideal for Message Passing Interface (MPI) applications, high-performance clusters, modeling and simulations, video encoding, and other compute or network intensive scenarios.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------: |
| A8              | 8         | 56 GB   | High          | 382 GB  |
| A9              | 16        | 112 GB  | Very High     | 382 GB  |

## Compute intensive

Available in select data centers. A10 and A11 virtual machines feature [Intel® Xeon® E5 processors](http://www.intel.com/content/www/us/en/processors/xeon/xeon-processor-e5-family.html). For high-performance clusters, modeling and simulations, video encoding, and other compute or network intensive scenarios. Similar to A8 and A9 instance configuration without the InfiniBand network and RDMA technology.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------: |
| A10             | 8         | 56 GB   | High          | 382 GB  |
| A11             | 16        | 112 GB  | Very High     | 382 GB  |

## D-series: Optimized compute

D-series virtual machines feature solid state drives (SSDs) and faster processors than the A-series (60% faster) and is also available for web or worker roles in Azure Cloud Services. This series is ideal for applications that demand faster CPUs, better local disk performance, or higher memory.

## General purpose (D)

For websites, small-to-medium databases, and other everyday applications.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------: |
| Standard_D1     | 1         | 3.5 GB  | Moderate      | 50 GB   |
| Standard_D2     | 2         | 7 GB    | High          | 100 GB  |
| Standard_D3     | 4         | 14 GB   | High          | 200 GB  |
| Standard_D4     | 8         | 28 GB   | High          | 400 GB  |

## Memory intensive (D)

For large databases, SharePoint server farms, and high-throughput applications.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------: |
| Standard_D11    | 2         | 14 GB   | High          | 100 GB  |
| Standard_D12    | 4         | 28 GB   | High          | 200 GB  |
| Standard_D13    | 8         | 56 GB   | High          | 400 GB  |
| Standard_D14    | 16        | 112 GB  | Very High     | 800 GB  |

## Dv2-series: Optimized compute

Dv2-series instances are the next generation of D-series instances that can be used as Virtual Machines or Cloud Services. Dv2-series instances will carry more powerful CPUs which are on average about 35% faster than D-series instances, and carry the same memory and disk configurations as the D-series. Dv2-series instances are based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with Intel Turbo Boost Technology 2.0 can go to 3.1 GHz. Dv2-series and D-series are ideal for applications that demand faster CPUs, better local disk performance, or higher memories and offer a powerful combination for many enterprise-grade applications.

## General purpose (Dv2)

For websites, small-to-medium databases, and other everyday applications.

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | ------: |
| Standard_D1_v2  | 1         | 3.5 GB  | Moderate      | 50 GB   |
| Standard_D2_v2  | 2         | 7 GB    | High          | 100 GB  |
| Standard_D3_v2  | 4         | 14 GB   | High          | 200 GB  |
| Standard_D4_v2  | 8         | 28 GB   | High          | 400 GB  |
| Standard_D5_v2  | 16        | 56 GB   | Very High     | 800 GB  |

## Memory intensive (Dv2)

For large databases, SharePoint server farms, and high-throughput applications

| Size (id)       | Cores     | Ram     | Net Bandwidth | Total disk size |
| --------------- | :-------: | ------: | :-----------: | -------: |
| Standard_D11_v2 | 2         | 14 GB   | High          | 100 GB   |
| Standard_D12_v2 | 4         | 28 GB   | High          | 200 GB   |
| Standard_D13_v2 | 8         | 56 GB   | High          | 400 GB   |
| Standard_D14_v2 | 16        | 112 GB  | Very High     | 800 GB   |

## Configure sizes for Cloud Services

You can specify the Virtual Machine size of a role instance as part of the service model described by the [service definition file](cloud-services-model-and-package.md#csdef). The size of the role determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to a running instance. Choose the role size based on your application's resource requirement.

Here is an example for setting the role size to be [Standard_D2](#general-purpose-d) for a Web Role instance:

```xml
<WebRole name="WebRole1" vmsize="<mark>Standard_D2</mark>">
...
</WebRole>
```
