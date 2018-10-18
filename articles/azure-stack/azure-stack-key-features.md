---
title: Key features and concepts in Azure Stack | Microsoft Docs
description: Learn about the key features and concepts in Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 09ca32b7-0e81-4a27-a6cc-0ba90441d097
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer:

---
# Key features and concepts in Azure Stack
If you’re new to Microsoft Azure Stack, these terms and feature descriptions might be helpful.

## Personas
There are two varieties of users for Microsoft Azure Stack, the cloud operator (provider) and the tenant (consumer).

* A **cloud operator** can configure Azure Stack and manage offers, plans, services, quotas, and pricing to provide resources for their tenants.  Cloud operators also manage capacity and respond to alerts.  
* A **tenant** (also referred to as a user) consumes services that the cloud administrator offers. Tenants can provision, monitor, and manage services that they have subscribed to, such as Web Apps, Storage, and Virtual Machines.

## Portal
The primary methods of interacting with Microsoft Azure Stack are the administrator portal, user portal, and PowerShell.

The Azure Stack portals are each backed by separate instances of Azure Resource Manager.  A cloud operator uses the administrator portal to manage Azure Stack, and to do things like create tenant offerings.  The user portal (also referred to as the tenant portal) provides a self-service experience for consumption of cloud resources, like virtual machines, storage accounts, and Web Apps. For more information, see [Using the Azure Stack administrator and user portals](azure-stack-manage-portals.md).

## Identity 
Azure Stack uses either Azure Active Directory (AAD) or Active Directory Federation Services (AD FS) as an identity provider.  

### Azure Active Directory
Azure Active Directory is Microsoft's cloud-based, multi-tenant identity provider.  Most hybrid scenarios use Azure Active Directory as the identity store.

### Active Directory Federation Services
You may choose to use Active Directory Federation Services (AD FS) for disconnected deployments of Azure Stack.  Azure Stack, resource providers, and other applications work much the same way with AD FS as they do with Azure Active Directory. Azure Stack includes its own AD FS and Active Directory instance, and an Active Directory Graph API. Azure Stack Development Kit supports the following AD FS scenarios:

- Sign in to the deployment by using AD FS.
- Create a virtual machine with secrets in Key Vault
- Create a vault for storing/accessing secrets
- Create custom RBAC roles in subscription
- Assign users to RBAC roles on resources
- Create system-wide RBAC roles through Azure PowerShell
- Sign in as a user through Azure PowerShell
- Create service principals use them to sign in to Azure PowerShell


## Regions, services, plans, offers, and subscriptions
In Azure Stack, services are delivered to tenants using regions, subscriptions, offers, and plans. Tenants can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![](media/azure-stack-key-features/image4.png)

Example hierarchy of a tenant’s subscriptions to offers, each with varying plans and services.

### Regions
Azure Stack regions are a basic element of scale and management. An organization may have multiple regions with resources available in each region. Regions may also have different service offerings available. In Azure Stack Development Kit, only a single region is supported, and is automatically named *local*.

### Services
Microsoft Azure Stack enables providers to deliver a wide variety of services and applications, such as virtual machines, SQL Server databases, SharePoint, Exchange, and more.

### Plans
Plans are groupings of one or more services. As a provider, you create plans to offer to your tenants. In turn, your tenants subscribe to your offers to use the plans and services they include.

Each service added to a plan can be configured with quota settings to help you manage your cloud capacity. Quotas can include restrictions such as VM, RAM, and CPU limits and are applied per user subscription. Quotas can be differentiated by location. For example, a plan containing compute services from Region A could have a quota of two virtual machines, 4 GB RAM, and 10 CPU cores.

When creating an offer, the service administrator can include a **base plan**. These base plans are included by default when a tenant subscribes to that offer. When a user subscribes (and the subscription is created), the user has access to all the resource providers specified in those base plans (with the corresponding quotas).

The service administrator can also include **add-on plans** in an offer. Add-on plans are not included by default in the subscription. Add-on plans are additional plans (quotas) available in an offer that a subscription owner can add to their subscriptions.

### Offers
Offers are groups of one or more plans that providers present to tenants to buy (subscribe to). For example, Offer Alpha can contain Plan A containing a set of compute services and Plan B containing a set of storage and network services.

An offer comes with a set of base plans, and service administrators can create add-on plans that tenants can add to their subscription.

### Subscriptions
A subscription is how tenants buy your offers. A subscription is a combination of a tenant with an offer. A tenant can have subscriptions to multiple offers. Each subscription applies to only one offer. A tenant’s subscriptions determine which plans/services they can access.

Subscriptions help providers organize and access cloud resources and services.

For the administrator, a Default Provider Subscription is created during deployment. This subscription can be used to manage Azure Stack, deploy further resource providers, and create plans and offers for tenants. It should not be used to run customer workloads and applications. Beginning with version 1804, two additional subscriptions supplement the Default Provider subscription; a Metering subscription, and a Consumption subscription. These additions facilitate separating the management of core infrastructure, additional resource providers, and workloads.  

## Azure Resource Manager
By using Azure Resource Manager, you can work with your infrastructure resources in a template-based, declarative model.   It provides a single interface that you can use to deploy and manage your solution components. For full information and guidance, see the [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

### Resource groups
Resource groups are collections of resources, services, and applications—and each resource has a type, such as virtual machines, virtual networks, public IPs, storage accounts, and websites. Each resource must be in a resource group and so resource groups help logically organize resources, such as by workload or location.  In Microsoft Azure Stack, resources such as plans and offers are also managed in resource groups.

Unlike [Azure](../azure-resource-manager/resource-group-move-resources.md), you cannot move resources between resource groups. When you view the properties of a resource or resource group in the Azure Stack admin portal, the *Move* button is grayed-out and unavailable. 
 
### Azure Resource Manager templates
With Azure Resource Manager, you can create a template (in JSON format) that defines deployment and configuration of your application. This template is known as an Azure Resource Manager template and provides a declarative way to define deployment. By using a template, you can repeatedly deploy your application throughout the app lifecycle and have confidence your resources are deployed in a consistent state.

## Resource providers (RPs)
Resource providers are web services that form the foundation for all Azure-based IaaS and PaaS services. Azure Resource Manager relies on different RPs to provide access to services.

There are four foundational RPs: Network, Storage, Compute, and KeyVault. Each of these RPs helps you configure and control its respective resources. Service administrators can also add new custom resource providers.

### Compute RP
The Compute Resource Provider (CRP) allows Azure Stack tenants to create their own virtual machines. The CRP includes the ability to create virtual machines as well as Virtual Machine extensions. The Virtual Machine extension service helps provide IaaS capabilities for Windows and Linux virtual machines.  As an example, you can use the CRP to provision a Linux virtual machine and run Bash scripts during deployment to configure the VM.

### Network RP
The Network Resource Provider (NRP) delivers a series of Software Defined Networking (SDN) and Network Function Virtualization (NFV) features for the private cloud.  You can use the NRP to create resources like software load balancers, public IPs, network security groups, virtual networks.

### Storage RP
The Storage RP delivers four Azure-consistent storage services: blob, table, queue, and account management. It also offers a storage cloud administration service to facilitate service provider administration of Azure-consistent Storage services. Azure Storage provides the flexibility to store and retrieve large amounts of unstructured data, such as documents and media files with Azure Blobs, and structured NoSQL based data with Azure Tables. For more information on Azure Storage, see [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md).

#### Blob storage
Blob storage stores any data set. A blob can be any type of text or binary data, such as a document, media file, or application installer. Table storage stores structured datasets. Table storage is a NoSQL key-attribute data store, which allows for rapid development and fast access to large quantities of data. Queue storage provides reliable messaging for workflow processing and for communication between components of cloud services.

Every blob is organized under a container. Containers also provide a useful way to assign security policies to groups of objects. A storage account can contain any number of containers, and a container can contain any number of blobs, up to the 500-TB capacity limit of the storage account. Blob storage offers three types of blobs, block blobs, append blobs, and page blobs (disks). Block blobs are optimized for streaming and storing cloud objects, and are a good choice for storing documents, media files, backups etc. Append blobs are similar to block blobs, but are optimized for append operations. An append blob can be updated only by adding a new block to the end. Append blobs are a good choice for scenarios such as logging, where new data needs to be written only to the end of the blob. Page blobs are optimized for representing IaaS disks and supporting random writes, and may be up to 1 TB. An Azure virtual machine network attached IaaS disk is a VHD stored as a page blob.

#### Table storage
Table storage is Microsoft’s NoSQL key/attribute store – it has a design without schemas, making it different from traditional relational databases. Since data stores lack schemas, it's easy to adapt your data as the needs of your application evolve. Table storage is easy to use, so developers can create applications quickly. Table storage is a key-attribute store, meaning that every value in a table is stored with a typed property name. The property name can be used for filtering and specifying selection criteria. A collection of properties and their values comprise an entity. Since Table storage lack schemas, two entities in the same table can contain different collections of properties, and those properties can be of different types. You can use Table storage to store flexible datasets, such as user data for web applications, address books, device information, and any other type of metadata that your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

#### Queue Storage
Azure Queue storage provides cloud messaging between application components. In designing applications for scale, application components are often decoupled, so that they can scale independently. Queue storage delivers asynchronous messaging for communication between application components, whether they are running in the cloud, on the desktop, on an on-premises server, or on a mobile device. Queue storage also supports managing asynchronous tasks and building process work flows.

### KeyVault
The KeyVault RP provides management and auditing of secrets, such as passwords and certificates. As an example, a tenant can use the KeyVault RP to provide administrator passwords or keys during VM deployment.

## High availability for Azure Stack
*Applies to: Azure Stack 1802 or higher versions*

To achieve high availability of a multi-VM production system in Azure, VMs are placed in an availability set that spreads them across multiple fault domains and update domains. In this way, [VMs deployed in availability sets](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets) are physically isolated from each other on separate server racks to allow for failure resiliency as shown in the following diagram:

  ![Azure Stack high availability](media/azure-stack-key-features/high-availability.png)

### Availability sets in Azure Stack
While the infrastructure of Azure Stack is already resilient to failures, the underlying technology (failover clustering) still incurs some downtime for VMs on an impacted physical server if there is a hardware failure. Azure Stack supports having an availability set with a maximum of three fault domains to be consistent with Azure.

- **Fault domains**. VMs placed in an availability set will be physically isolated from each other by spreading them as evenly as possible over multiple fault domains (Azure Stack nodes). If there is a hardware failure, VMs from the failed fault domain will be restarted in other fault domains, but, if possible, kept in separate fault domains from the other VMs in the same availability set. When the hardware comes back online, VMs will be rebalanced to maintain high availability. 
 
- **Update domains**. Update domains are another Azure concept that provides high availability in availability sets. An update domain is a logical group of underlying hardware that can undergo maintenance at the same time. VMs located in the same update domain will be restarted together during planned maintenance. As tenants create VMs within an availability set, the Azure platform automatically distributes VMs across these update domains. In Azure Stack, VMs are live migrated across the other online hosts in the cluster before their underlying host is updated. Since there is no tenant downtime during a host update, the update domain feature on Azure Stack only exists for template compatibility with Azure. 

### Upgrade scenarios 
VMs in availability sets that were created before Azure Stack version 1802 are given a default number of fault and update domains (1 and 1 respectively). To achieve high availability for VMs in these pre-existing availability sets, you must first delete the existing VMs and then redeploy them into a new availability set with the correct fault and update domain counts as described in [Change the availability set for a Windows VM](https://docs.microsoft.com/azure/virtual-machines/windows/change-availability-set). 

For virtual machine scale sets, an availability set is created internally with a default fault domain and update domain count (3 and 5 respectively). Any virtual machine scale sets created before the 1802 update will be placed in an availability set with the default fault and update domain counts (1 and 1 respectively). To update these virtual machine scale set instances to achieve the newer spread, scale out the virtual machine scale sets by the number of instances that were present before the 1802 update and then delete the older instances of the virtual machine scale sets. 

## Role Based Access Control (RBAC)
You can use RBAC to grant system access to authorized users, groups, and services by assigning them roles at a subscription, resource group, or individual resource level. Each role defines the access level a user, group, or service has over Microsoft Azure Stack resources.

Azure RBAC has three basic roles that apply to all resource types: Owner, Contributor, and Reader. Owner has full access to all resources including the right to delegate access to others. Contributor can create and manage all types of Azure resources but can’t grant access to others. Reader can only view existing Azure resources. The rest of the RBAC roles in Azure allow management of specific Azure resources. For instance, the Virtual Machine Contributor role allows creation and management of virtual machines but does not allow management of the virtual network or the subnet that the virtual machine connects to.

## Usage data
Microsoft Azure Stack collects and aggregates usage data across all resource providers, and transmits it to Azure for processing by Azure commerce. The usage data collected on Azure Stack can be viewed via a REST API. There is an Azure-consistent Tenant API as well as Provider and Delegated Provider APIs to get usage data across all tenant subscriptions. This data can be used to integrate with an external tool or service for billing or chargeback. Once usage has been processed by Azure commerce, it can be viewed in the Azure billing portal.

## In-development build of Azure Stack Development Kit
In-development builds let early-adopters evaluate the most recent version of the Azure Stack Development Kit. They’re incremental builds based on the most recent major release. While major versions will continue to be released every few months, the in-development builds will release intermittently between the major releases.

In-development builds will provide the following benefits:
- Bug fixes
- New features
- Other improvements

## Next steps
[Administration basics](azure-stack-manage-basics.md)

