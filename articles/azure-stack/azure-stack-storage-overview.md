# Introduction to Azure-consistent Storage



Azure-consistent Storage (ACS) is the set of storage cloud services in
Microsoft Azure Stack. ACS provides blob, table, queue, and account
management functionality with Azure-consistent semantics. ACS also provides functionality to
help a cloud administrator manage ACS services. This article introduces
ACS storage services and discusses how storage cloud services in Azure
Stack nicely complement the rich [software-defined storage
capabilities in Windows Server
2016](https://blogs.technet.microsoft.com/windowsserver/2016/04/14/ten-reasons-youll-love-windows-server-2016-5-software-defined-storage/).

ACS delivers the following broad categories of functionality:

- **Blobs**: page blobs, block blobs, and append blobs with
    [Azure-consistent
    blob](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_1)
    behavior

- **Tables**: entities, partitions, and other table properties with
    [Azure-consistent
    table](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_3)
    behavior

- **Queues**: reliable and persistent messages and queues with
    [Azure-consistent
    queue](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_2)
    behavior

- **Accounts**: storage account resource management with
    [Azure-consistent
    account](https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/)
    behavior for general-purpose storage accounts provisioned via the [Azure
    Resource Manager deployment
    model](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-deployment-model/)

- **Administration**: management of tenant-facing and ACS-internal
    storage services (discussed in other articles)

<span id="_Toc386544160" class="anchor"><span id="_Toc389466733" class="anchor"><span id="_Toc433223833" class="anchor"></span></span></span>
## ACS architecture

![Azure-consistent
Storage: solution view](./media/azure-stack-storage-overview/acs-solution-view.png)

<span id="_Ref428549771" class="anchor"></span>Figure 1. Azure-consistent
Storage: solution view

## ACS virtualized services and clusters

In the ACS architecture, all tenant or administrator-accessible ACS
services are virtualized. That is, they run in service provider-managed,
highly available VMs based on
[Hyper-V](https://technet.microsoft.com/en-us/library/dn765471.aspx)
functionality in [Windows Server
2016](http://www.microsoft.com/en-us/server-cloud/products/windows-server-2016/).
Although the VMs are highly available based on [Windows Server Failover
Clustering](https://technet.microsoft.com/en-us/library/dn765474.aspx)
technology, the ACS virtualized services themselves are guest-clustered,
highly available services based on [Azure Service Fabric
technology](http://azure.microsoft.com/en-us/campaigns/service-fabric/).

ACS employs two Service Fabric clusters in an Azure Stack deployment.
The Storage Resource Provider service is deployed on a Service Fabric
cluster (“RP cluster”) that is also shared by other foundational
resource provider services. The rest of ACS virtualized data path
services--including the Blob, Table, and Queue services--are hosted on
a second Service Fabric cluster (“ACS cluster”).

## Blob service and software-defined storage

The Blob service back end, on the other hand, runs directly on the
[Scale-Out File Server](https://technet.microsoft.com/en-us/library/hh831349.aspx)
cluster nodes. In the Azure Stack solution architecture, Scale-Out File Server is
based on the [Storage Spaces Direct](https://technet.microsoft.com/en-us/library/mt126109.aspx)-based,
shared-nothing failover cluster. Figure 1 depicts the major ACS
component services and their distributed deployment model. As you see in
the diagram, ACS dovetails with existing software-defined storage features in Windows Server 2016. No special
hardware is required for ACS beyond these Windows Server platform
requirements.

## Storage Farm

Storage Farm is the collection of storage infrastructure, resources, and
back-end services that together provide tenant-facing and administrator-facing
ACS storage services in an Azure Stack deployment. Specifically, Storage Farm includes the following:

- Storage hardware (for example, Scale-Out File Server nodes, disks)

- Storage fabric resources (for example, SMB shares)

- Storage-related Service Fabric services (for example, Blob endpoint service
    off the ACS cluster)

- Storage-related services that run on Scale-Out File Server nodes (for example, the Blob service)

## IaaS and PaaS storage usage scenarios

ACS page blobs, as in Azure, provide the virtual disks in all
infrastructure as a service (IaaS) usage scenarios:

- Create a VM by using the custom OS disk in a page blob

- Create a VM by using the custom OS image in a page blob

- Create a VM by using an Azure Marketplace image in a new page blob

- Create a VM by using a blank disk in a new page blob

Similarly, for platform as a service (PaaS) scenarios, ACS block blobs,
append blobs, queues, and tables work as they do in Azure.

## User roles


ACS is valuable for two user roles:

- Application owners, including developers and enterprise IT. They no
    longer have to maintain or deploy two versions of an application
    and scripts that accomplish the same job across a public cloud and
    a hosted/private cloud in a datacenter. ACS provides storage services via REST API, SDK, cmdlet, and Azure Stack portal.

- Service providers, including enterprise IT, who deploy and manage
    Microsoft Azure Stack-based, multitenant storage cloud
    services.

## Next steps


- <span id="Concepts" class="anchor"></span> [Azure-consistent Storage:
    Differences and considerations] (azure-stack-acs-differences-tp2.md)
