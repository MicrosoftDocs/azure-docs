<properties
	pageTitle="Key features and concepts in Azure Stack | Microsoft Azure"
	description="Learn about the key features and concepts in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# Key features and concepts in Azure Stack

If you’re new to Microsoft Azure Stack, these terms and feature descriptions might be helpful.

## Personas

There are two varieties of users for Microsoft Azure Stack, the service administrator and the tenant (customer).

| ![](media/azure-stack-key-features/image1.png) | A **service administrator** can configure and manage resource providers, tenant offers, plans, services, quotas, and pricing.                                                                                           |
|---|---|
| ![](media/azure-stack-key-features/image2.png) | A **tenant** purchases (or acquires) services that the service administrator offers. Tenants can provision, monitor, and manage services that they have subscribed to, such as Web Apps, Storage, and Virtual Machines. |

## Portal

The primary method of interacting with Microsoft Azure Stack is the portal.

![](media/azure-stack-key-features/image3.png)

The Microsoft Azure Stack portal, which is consistent with the Azure portal, is a web page that provides a self-service experience for both service administrators and tenants with role-based access control (RBAC) to resources and cloud capacity, enabling quick application and service development and deployment.

## Services, plans, offers, and subscriptions

In Azure Stack, services are delivered to tenants using subscriptions, offers, and plans. Tenants can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![](media/azure-stack-key-features/image4.png)

Example hierarchy of a tenant’s subscriptions to offers, each with varying plans and services.

### Services

Microsoft Azure Stack enables providers to deliver a wide variety of applications and services, such as virtual machines, SQL Server databases, SharePoint, Exchange, and more.

### Plans

Plans are groupings of one or more services. As a provider, you create plans to offer to your tenants. In turn, your tenants subscribe to your offers to use the plans and services they include.

Each service added to a plan can be configured with quota settings to help you manage your cloud capacity. Quotas can include restrictions such as VM, RAM, and CPU limits and are applied per user subscription. Quotas can be differentiated by location. For example, a plan containing compute services from Region A could have a quota of two virtual machines, 4GB RAM, and 10 CPU cores.

When composing an offer, the service administrator can include **base plans**. These base plans are included by default when a tenant subscribes to that offer. As soon as a user subscribes (and the subscription is created), the user has access to all the resource providers specified in those base plans (with the corresponding quotas).

The service administrator can also include **add-on plans** in an offer. Add-on plans are not included by default in the subscription. Add-on plans are additional plans (quotas) available in an offer that a subscription owner can add to their subscription.

### Offers

Offers are groups of one or more plans that providers present to tenants to buy (subscribe to). For example, Offer Alpha can contain Plan A (from Region 1 containing a set of compute services) and Plan B (from Region 2 containing a set of storage and network services).

An offer comes with a set of base plans, and service administrators can create add-on plans that tenants can add to their subscription.

### Subscriptions

A subscription is how tenants buy your offers. A subscription is a combination of a tenant with an offer. A tenant can have subscriptions to multiple offers. Each subscription applies to only one offer. A tenant’s subscriptions determine which plans/services they can access.

Subscriptions help providers organize access and use of cloud resources and services.

## Azure Resource Manager

By using Azure Resource Manager, you can work with your infrastructure resources in bulk, instead of individually. It’s a single access point that you can use to deploy, manage, and monitor your solution components, such as virtual machines, storage accounts, web apps, and databases. For full information and guidance, see the [Azure Resource Manager overview](../resource-group-overview.md).

### Resource groups

Resource groups are collections of resources, services, and applications—and each resource has a type, such as virtual machines, virtual networks, public IPs, storage accounts, and websites. Each resource must be in a resource group and so resource groups help organize resources, such as applications and virtual networks. As a tenant, it’s ultimately the use of resources that you are billed for.

Tenants who use a plan and its services create resource groups to collect and manage an application’s resources.

Here are some important things to consider when defining a resource group:

-   Each resource can only exist in one resource group.

-   You will deploy, update and delete items in a resource group together. If one resource, such as a database server, needs to exist on a different deployment cycle, it should be in another resource group.

-   You can add or remove a resource to a resource group at any time.

-   You can move a resource from one resource group to another group.

-   A resource group can contain resources that reside in different regions.

-   A resource group can be used to scope access control for administrative actions.

-   A resource can be linked to a resource in another resource group when the two resources must interact with each other but they do not share the same lifecycle. For example, multiple apps must connect to a database, but that database must not be updated or deleted at the same pace as the apps.

-   In Microsoft Azure Stack, resources such as plans and offers are also managed in resource groups.

### Azure Resource Manager templates

With Azure Resource Manager, you can create a simple template (in JSON format) that defines deployment and configuration of your application. This template is known as an Azure Resource Manager template and provides a declarative way to define deployment. By using a template, you can repeatedly deploy your application throughout the app lifecycle and have confidence your resources are deployed in a consistent state.

## Resource providers (RPs)—Network RP, Compute RP, Storage RP

Resource providers are web services that form the foundation for all Azure-based IaaS and PaaS services. Azure Resource Manager relies on different RPs to provide access to a hoster’s services.

There are three main RPs: Network, Storage, and Compute. Each of these RPs helps you configure and control its respective resources. Administrators can also add new custom resource providers.

### Compute RP

The Compute Resource Provider (CRP) allows Azure Stack tenants to create their own virtual machines. It also provides functionality for the administrator to setup and configure the resource provider for tenants. The CRP includes the ability to create virtual machines as well as Virtual Machine extensions. The Virtual Machine extension service helps provide IaaS capabilities for Windows and Linux virtual machines.

### Network RP

The Network Resource Provider (NRP) delivers a series of Software Defined Networking (SDN) and Network Function Virtualization (NFV) features for the private cloud. These features are consistent with the Azure public cloud so that application templates can be written once and deployed both in the Azure public cloud or on-premises Microsoft Azure Stack. The Network RP gives you more granular network control, metadata tags, faster configuration, rapid and repeatable customization, and multiple control interfaces (including PowerShell, .NET SDK, Node.JS SDK, REST-based API). You can use the NRP to create software load balancers, public IPs, network security groups, virtual networks, among others.

### Storage RP

The Storage RP delivers three Azure-consistent storage services: blob, table, and account management. It also offers a storage cloud administration service to facilitate service provider administration of Azure-consistent Storage services. Azure Storage provides the flexibility to store and retrieve large amounts of unstructured data, such as documents and media files with Azure Blobs, and structured NoSQL based data with Azure Tables. For more information on Azure Storage, see [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md) on Azure.com or [download the Azure Stack Azure-consistent Storage Validation Guide](http://aka.ms/azurestacktp1doc).

#### Blob storage

Blob storage stores any data set. A blob can be any type of text or binary data, such as a document, media file, or application installer. Table storage stores structured datasets. Table storage is a NoSQL key-attribute data store, which allows for rapid development and fast access to large quantities of data. Queue storage provides reliable messaging for workflow processing and for communication between components of cloud services.

Every blob is organized under a container. Containers also provide a useful way to assign security policies to groups of objects. A storage account can contain any number of containers, and a container can contain any number of blobs, up to the 500 TB capacity limit of the storage account. Blob storage offers three types of blobs, block blobs, append blobs, and page blobs (disks). Block blobs are optimized for streaming and storing cloud objects, and are a good choice for storing documents, media files, backups etc. Append blobs are similar to block blobs, but are optimized for append operations. An append blob can be updated only by adding a new block to the end. Append blobs are a good choice for scenarios such as logging, where new data needs to be written only to the end of the blob. Page blobs are optimized for representing IaaS disks and supporting random writes, and may be up to 1 TB in size. An Azure virtual machine network attached IaaS disk is a VHD stored as a page blob.

#### Table storage

Table storage is Microsoft’s NoSQL key/attribute store – it has a design without schemas, making it different from traditional relational databases. Since data stores lack schemas, it's easy to adapt your data as the needs of your application evolve. Table storage is easy to use, so developers can create applications quickly. Table storage is a key-attribute store, meaning that every value in a table is stored with a typed property name. The property name can be used for filtering and specifying selection criteria. A collection of properties and their values comprise an entity. Since Table storage lack schemas, two entities in the same table can contain different collections of properties, and those properties can be of different types. You can use Table storage to store flexible datasets, such as user data for web applications, address books, device information, and any other type of metadata that your service requires. You can store any number of entities in a table, and a storage account may contain any number of tables, up to the capacity limit of the storage account.

## Role Based Access Control (RBAC)

You can use RBAC to grant system access to authorized users, groups, and services by assigning them roles at a subscription, resource group, or individual resource level. Each role defines the access level a user, group, or service has over Microsoft Azure Stack resources.

Azure RBAC has three basic roles that apply to all resource types: Owner, Contributor and Reader. Owner has full access to all resources including the right to delegate access to others. Contributor can create and manage all types of Azure resources but can’t grant access to others. Reader can only view existing Azure resources. The rest of the RBAC roles in Azure allow management of specific Azure resources. For instance, the Virtual Machine Contributor role allows creation and management of virtual machines but does not allow management of the virtual network or the subnet that the virtual machine connects to.

## Usage data

Microsoft Azure Stack collects and aggregates usage data across all resource providers to provide a concise report per user. Data can be as simple as consumed resource count, or as complex as individual performance and scale counters. The data is available via REST API. There is an Azure-consistent Tenant API as well as Provider and Delegated Provider APIs to get usage data across all tenant subscriptions. This data can be used to integrate with an external tool or service for billing or chargeback.

## Next steps

[Deploy Azure Stack Technical Preview 1 (POC)](azure-stack-deploy.md)
