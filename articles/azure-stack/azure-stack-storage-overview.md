# Introduction to Azure-consistent Storage



Azure-consistent Storage (ACS) is the set of storage cloud services in
Microsoft Azure Stack. ACS provides blob, table, queue, and account
management functionality with Azure-consistent semantics. Additionally,
ACS also provides storage cloud service administration functionality to
help a cloud administrator manage ACS services. This article introduces
ACS storage services and discusses how storage cloud services in Azure
Stack nicely complement the rich [Software-defined Storage (SDS)
capabilities in Windows Server
2016](https://blogs.technet.microsoft.com/windowsserver/2016/04/14/ten-reasons-youll-love-windows-server-2016-5-software-defined-storage/).

ACS delivers the following broad categories of functionality:

1)  **Blobs**: page blobs, block blobs, and append blobs with
    [Azure-consistent
    blob](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_1)
    behavior

2)  **Tables**: entities, partitions, and other table properties with
    [Azure-consistent
    table](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_3)
    behavior

3)  **Queues**: reliable and persistent messages and queues with
    [Azure-consistent
    queue](https://msdn.microsoft.com/en-us/library/azure/dd179355.aspx#Anchor_2)
    behavior

4)  **Accounts**: storage account resource management with
    [Azure-consistent
    account](https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/)
    behavior for general-purpose storage accounts provisioned via [Azure
    Resource Manager deployment
    model](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-deployment-model/)

5)  **Administration**: management of tenant-facing and ACS-internal
    storage services (discussed in other articles)

<span id="_Toc386544160" class="anchor"><span id="_Toc389466733" class="anchor"><span id="_Toc433223833" class="anchor"></span></span></span>
## ACS Architecture

![Azure-consistent
Storage: Solution View](./media/azure-stack-storage-overview/acs-solution-view.png)

<span id="_Ref428549771" class="anchor"></span>Figure 1 Azure-consistent
Storage: Solution View

## ACS Virtualized Services and Clusters

In the ACS architecture, all tenant or administrator-accessible ACS
services are virtualized, that is, run in service provider-managed
highly available VMs based on
[Hyper-V](https://technet.microsoft.com/en-us/library/dn765471.aspx)
functionality in [Windows Server
2016](http://www.microsoft.com/en-us/server-cloud/products/windows-server-2016/).
While the VMs are highly available based on [Windows Server Failover
Clustering](https://technet.microsoft.com/en-us/library/dn765474.aspx)
technology, the ACS virtualized services themselves are guest-clustered
highly available services based on [Azure Service Fabric
technology](http://azure.microsoft.com/en-us/campaigns/service-fabric/).

ACS employs two Service Fabric clusters in an Azure Stack deployment.
The Storage Resource Provider (SRP) service is deployed on a Service Fabric
cluster (“RP cluster”) that is also shared by other foundational
Resource Provider services. The rest of ACS virtualized data path
services – including the blob, table, and queue services – are hosted on
a second Service Fabric cluster (“ACS cluster”).

## ACS Blob Service and SDS

ACS Blob service back-end on the other hand runs directly on the
[Scale-out File Server
(SOFS)](https://technet.microsoft.com/en-us/library/hh831349.aspx)
cluster nodes. In the Azure Stack solution architecture, this SOFS is
based on the [Storage Spaces Direct
(S2D)](https://technet.microsoft.com/en-us/library/mt126109.aspx)-based
shared-nothing failover cluster. Figure 1 depicts the major ACS
component services and their distributed deployment model. As you see in
this diagram, ACS simply dovetails on top of existing Windows Server
2016-based Software-defined Storage (SDS) platform features. No special
hardware is required for ACS beyond these Windows Server platform
requirements.

## Storage Farm

Storage Farm is the collection of storage infrastructure, resources, and
back-end services that together provide tenant and administrator-facing
ACS storage services in an Azure Stack deployment. Specifically, the
Storage Farm includes the following:

-   Storage hardware (for example, SOFS nodes, disks),

-   Storage fabric resources (for example, SMB Shares),

-   Storage-related Service Fabric services (for example, blob end-point service
    off ACS cluster), and,

-   Storage-related services running on SOFS nodes (for example, blob service)

## IaaS and PaaS Storage Usage Scenarios

ACS page blobs, as in Azure, provide the virtual disks in all
Infrastructure as a Service (IaaS) usage scenarios –

1) Create a VM using the custom OS disk in a page blob

2) Create a VM using the custom OS image in a page blob

3) Create a VM using a Marketplace image onto a new page blob

4) Create a VM using a blank disk onto a new page blob

Similarly, for Platform as a Service (PaaS) scenarios, ACS block blobs,
append blobs, queues, and tables work as in Azure.

## User Roles


ACS is valuable for two user roles:

-   Application owners – developers and enterprise IT included – no
    longer have to maintain and/or deploy two versions of an application
    and scripts that accomplish the same job across public cloud and
    hosted/private cloud in a data center. ACS provides Azure-consistent
    storage services via REST API, SDK, cmdlet, and Azure Stack portal.

-   Service providers – including enterprise IT – who deploy and manage
    Microsoft Azure Stack-based secure multi-tenant storage cloud
    services

## Next Steps


-   <span id="Concepts" class="anchor"></span> [Azure-consistent Storage:
    Differences and Considerations] (azure-stack-acs-differences-tp2.md)
