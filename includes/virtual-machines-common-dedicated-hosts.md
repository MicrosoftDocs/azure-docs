---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/07/2019
 ms.author: cynthn
 ms.custom: include file
---


Microsoft Azure Dedicated Host is a new Azure Compute service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure customer (subscription). 

Azure virtual machines are deployed in multiple datacenters around the world.  While it is up to the user to specify the region and availability zone (optional), they do not have control of  

 

other settings are set by the Azure runtime to optimize additional requirements such as the utilization and fragmentation in the Azure datacenter. This article provides you with an overview of a way to allocate resources in proximity.  

What are Dedicated Hosts? 

Dedicated hosts are nothing but the same physical servers we have in our data centers used to host Azure Virtual Machines, With ADH we surface the host as a manageable resource so that you can place VMs directly into your provisioned hosts. 

 

## Benefits 

With Azure Dedicated Hosts you have the benefits of: 

Owning the entire host guarantees that no other VMs will be placed in your hosts 

Owning the entire host enables you to control the platform maintenance at the level of the host (impacting all of the hosted VMs at the same time) 



## Groups, hosts, and VMs  

![View of the new resources for dedicated hosts.](./media/virtual-machines-common-dedicated-hosts/host-group.png)

A **host group** is a new ARM resource representing a collection of dedicated hosts. You create a host group in a region and an availability zone, and later provision hosts in it. 

A **host** is a new ARM resource which is mapped to a physical server in our data center. The physical server is allocated with the creation of the host. A host is created within a host group and could be later used when creating VMs. A host has a SKU describing which VMs sizes could be created. Each host can host multiple VMs from different sizes as long as they are from the same family (e.g. DSv3, ESv3, FSv2). 

When provisioning a virtual machine (VM) in Azure, you may use one of your already deployed hosts to place the VM. In this way you have full control as to which VMs are placed within your hosts.  


## Capacity considerations and reservations 

Once a host is provisioned, Azure assigns a physical server to it. In turn, this guarantees the availability of the capacity when you need to provision your VM. Azure uses the entire capacity in the region (or zone) to pick a physical server for your host. It also means that customers can expect to be able to grow their dedicated host footprint without the concern of running out of space in the cluster.  

## High Availability considerations 

To deliver high availability, you are expected to have multiple VMs spreading on multiple hosts (minimum of 2). With Azure Dedicated Hosts you can choose several options to provision your infrastructure which will shape your fault isolation boundaries:  

### Use Availability Zones for fault isolation 

A Host group could be created in a single AZ. Once created, all underlying hosts will follow and be placed anywhere within the zone. Unlike VMs, hosts within a host group are not limited to a single Fabric Cluster (unit of management for VMs).  If you chose to use availability zones, you are forced to create your virtual machines in the same zone. In other words, you can’t have a host group in a zone and try deploy ‘regional VMs’ into it.  


### Use Fault Domains for fault isolation 

A host could be created with a specified fault domain property. Unlike virtual machine in an availability set or scale set where you specify the fault domain count, when creating a host you specify the exact fault domain for the host. This way you can create unbalanced topologies and have full control of the fault isolation of your VMs (through dedicated hosts).  

Up to 3 logical fault domains are supported within a single host group. Fault domains are mapped to physical racks in the data center. So that two hosts in the same group with different fault domain, will be placed to different racks. Note that fault domains is not a collocation construct. Having the same fault domain for two hosts does not mean they are in any proximity.  

Fault domains are scoped to the same host groups. You should not make any assumption on anti-affinity between two host groups. 

VMs deployed to hosts with different fault domains, will have their underlying managed disks services from multiple storage stamps to increase the fault isolation protection to the underlying storage system.  However, at the beginning of the preview program, this storage alignment is not yet fully operational. As a result, a customer who wishes to achieve the same high availability promise provided with availability set will have to redeploy her or his VMs before dedicated hosts are declared as GA.  

### Using Availability Zones and Fault Domains  

You can use both capabilities to achieve even more fault isolation domains. In each availability zone you may use up to 3 FDs bringing it up to a potential for 9 fault isolation units within a single region.  

 
## VM families and Hardware generations 
A dedicated host has a SKU and a type. A host SKU captures the supported VM sizes on that host. The type matches the hardware generation currently available in the region. 

During the preview, we will support the following host SKUs:

 
 
 | Host SKU   | Supported Family | CPU                                                 | Max occupancy    | VM Count |
|------------|------------------|-----------------------------------------------------|------------------|----------|
| DSv3_Type1 | Standard_Ds_v3   | 2 x E5-2673 v4 2.3 GHz (40 cores) – 64 usable vCPUs |                  |          |
|            |                  |                                                     | Standard_D2s_v3  | 32       |
|            |                  |                                                     | Standard_D4s_v3  | 16       |
|            |                  |                                                     | Standard_D8s_v3  | 8        |
|            |                  |                                                     | Standard_D16s_v3 | 4        |
|            |                  |                                                     | Standard_D32s_v3 | 2        |
|            |                  |                                                     | Standard_D64s_v3 | 1        |
| ESv3_Type1 | Standard_Es_v3   | 2 x E5-2673 v4 2.3 GHz (40 cores) – 64 usable vCPUs |                  |          |
|            |                  |                                                     | Standard_E2s_v3  | 28       |
|            |                  |                                                     | Standard_E4s_v3  | 14       |
|            |                  |                                                     | Standard_E8s_v3  | 7        |
|            |                  |                                                     | Standard_E16s_v3 | 3        |
|            |                  |                                                     | Standard_E32s_v3 | 1        |
|            |                  |                                                     | Standard_E64s_v3 | 1        |
| FSv2_Type2 | Standard_Fs_v2   | 2 x 2.7Ghz Skylake (48 core) – 72 usable vCPUs      |                  |          |
|            |                  |                                                     | Standard_F2s_v2  | 32       |
|            |                  |                                                     | Standard_F4s_v2  | 18       |
|            |                  |                                                     | Standard_F8s_v2  | 9        |
|            |                  |                                                     | Standard_F16s_v2 | 4        |
|            |                  |                                                     | Standard_F32s_v2 | 2        |
|            |                  |                                                     | Standard_F64s_v2 | 1        |
|            |                  |                                                     | Standard_F72s_v2 | 1        |


