---
title: External storage solutions overview
description: Learn about external storage solutions for Azure VMware Solution private cloud.
ms.topic: how-to
author: soderholmd
ms.author: dsoderholm
ms.service: azure-vmware
ms.date: 12/09/2024
ms.custom: engagement-fy23
---
 
# External storage solutions

Azure VMware Solution is a Hyperconverged Infrastructure (HCI) service that offers VMware vSAN as the primary storage option. VMware vSAN provides high-performance NVMe storage for virtual machines. However, it has a limited capacity. The exact amount of storage available in vSAN depends on several factors, including the number and type of nodes in the cluster type; the RAID and FTT (Failures To Tolerate) settings; and the deduplication and compression performance of a particular workload. 

Some virtual machine workloads require more storage than is available in vSAN. When you reach the capacity limit of vSAN, you can either add more Azure VMware Solution nodes to increase the capacity of vSAN, or you can use an external storage solution. Adding external storage is a good option when you need to scale storage capacity without adding more CPU and memory to the cluster.

Azure VMware Solution external storage is deployed into an Azure virtual network, and connected to the Azure VMware Solution private cloud via ExpressRoute. The storage is mounted on the Azure VMware Solution ESXi hosts using NFS or iSCSI, and used as a datastore for virtual machines.

It's also possible to map storage directly to Azure VMware Solutions virtual machines, which can reduce the amount of datastore capacity required in the cluster. A wide range of storage options is available, including Azure Files, Azure blob storage, and Azure NetApp Files.

When you choose an external storage service for Azure VMware Solution, there are different options to consider. Your requirements depend on your workloads and business needs. For example, you should consider:

- Performance
- Cost
- Availability and service SLAs
- Scalability and maximum capacity
- Data protection, such as backup, snapshots, and replication
- Storage efficiency, such as deduplication and compression
- Management capabilities, such as monitoring and provisioning

You should review the external storage solutions available for Azure VMware Solution, and choose the one that best meets your requirements.

When you combine Azure VMware Solution with an external storage service, remember that vSAN and the external storage have different performance and availability characteristics. You should make sure that each virtual machine is located on the appropriate storage solution for its performance and availability requirements.

## External storage solutions for Azure VMware Solution 

|Service|Description|Service type|Storage type|Protocol|More information|
|-|-|-|-|-|-|
|[Azure NetApp Files](./attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)|NetApp bare-metal hardware with all-flash performance|Azure native|File|NFS|[What is Azure NetApp Files?](../azure-netapp-files/azure-netapp-files-introduction.md)|
|[Azure Elastic SAN](./configure-azure-elastic-san.md)|Provides a familiar SAN resource hierarchy and industry-standard iSCSI block interface|Azure native|Block|iSCSI|[Introduction to Azure Elastic SAN](../storage/elastic-san/elastic-san-introduction.md)|
|[Pure Cloud Block Store](./configure-pure-cloud-block-store.md)|Enterprise-grade performance and reliability using Pure Storage technology in Azure|Partner|Block|iSCSI|[Pure Cloud Block Store on Azure](https://support.purestorage.com/bundle/m_cbs_for_azure/page/Pure_Cloud_Block_Store/topics/concept/c_introduction_121.html)|
|[Azure Native Pure Storage Cloud](./configure-azure-native-pure-storage-cloud.md)|Enterprise-grade performance and reliability using Pure Storage technology in Azure with Azure Native experience|Azure native experience|Block|iSCSI|[Pure Storage Cloud on Azure](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Production/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/topics/c_azure_native_pure_storage_cloud.html)|

### Azure storage solutions

#### Azure NetApp Files

Azure NetApp Files is an Azure native, first-party, enterprise-class, high-performance file storage service. It provides _Volumes as a service_, which you can create within a NetApp account and a capacity pool, and share to Azure VMware Solution hosts using NFS. Azure NetApp Files is built on NetApp bare-metal hardware, with fast and reliable all-flash performance for sub-millisecond latency. Azure NetApp Files volumes are mounted to Azure VMware Solution hosts using NFS. Azure NetApp Files has three performance tiers to choose from, each with different performance characteristics. You can also use Azure NetApp Files for data protection, such as backup, snapshots, and replication. 

#### Azure Elastic SAN

Azure Elastic SAN a fully integrated solution that simplifies deploying, scaling, managing, and configuring a virtual storage area network (SAN), while also offering built-in cloud capabilities like high availability. Elastic SAN is interoperable with Azure VMware Solution. You can create Elastic SAN volumes and mount them on Azure VMware Solution hosts using [iSCSI](https://wikipedia.org/wiki/ISCSI). Elastic SAN volumes can provide high performance, in the tens of thousands of IOPS. For details on Elastic SAN performance, see [Storage and performance](../storage/elastic-san/elastic-san-planning.md#storage-and-performance) in Elastic SAN's planning article.

### Partner storage solutions

Providing the same consistent external block storage architecture in the cloud is crucial for some customers. Some workloads can't be migrated or deployed to the cloud without consistent external block storage. As a key principle of Azure VMware Solution is to enable customers to continue to use their investments and their favorite VMware solutions running on Azure, we engaged storage providers with similar goals. 

#### Pure Cloud Block Store

[Pure Cloud Block Store](../azure-vmware/configure-pure-cloud-block-store.md) is a software-delivered service offered by Pure Storage, designed to provide a consistent storage experience for VMware workloads running in Azure. Pure Cloud Block Store runs the Purity Operating Environment on Azure virtual machines, and can be used with Azure VMware Solution to provide external block storage. You can create volumes in Pure Cloud Block Store and mount them on Azure VMware Solution hosts using iSCSI. Pure Cloud Block Store also offers data protection features such as snapshots and replication; storage efficiency using data deduplication and compression; and familiar management capabilities to administrators who are already using Pure Storage solutions.

## Next steps

- Learn about [Azure NetApp Files](./attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)
- Learn about [Azure Elastic SAN](./configure-azure-elastic-san.md)
- Learn about [Pure Cloud Block Store](./configure-pure-cloud-block-store.md)
- Learn about [Azure Native Pure Storage Cloud](./configure-azure-native-pure-storage-cloud.md)

