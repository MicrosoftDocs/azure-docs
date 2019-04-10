---
title: What is Azure Stack? | Microsoft Docs
description: Learn how Azure Stack lets you to run Azure services in your datacenter.  
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 03/29/2019
ms.author: jeffgilb
ms.reviewer: unknown
ms.custom: 
ms.lastreviewed: 03/29/2019

---
# Azure Stack overview

Azure Stack is an extension of Azure that provides a way to run applications in an on-premises environment and deliver Azure services in your datacenter. With a consistent cloud platform, organizations can confidently make technology decisions based on business requirements, rather than business decisions based on technology limitations.

## Why use Azure Stack?

Azure provides a rich platform for developers to build modern applications. However, some cloud-based applications face obstacles such as latency, intermittent connectivity, and regulations. Azure and Azure Stack unlock new hybrid cloud use cases for both customer-facing and internal line of business applications:

- **Edge and disconnected solutions**. Address latency and connectivity requirements by processing data locally in Azure Stack and then aggregating it in Azure for further analytics, with common application logic across both. You can even deploy Azure Stack disconnected from the internet without connectivity to Azure. Think of factory floors, cruise ships, and mine shafts as examples.

- **Cloud applications that meet varied regulations**. Develop and deploy applications in Azure, with full flexibility to deploy on-premises with Azure Stack to meet regulatory or policy requirements, with no code changes needed. Application examples include global audit, financial reporting, foreign exchange trading, online gaming, and expense reporting.

- **Cloud application model on-premises**. Use Azure services, containers, serverless, and microservice architectures to update and extend existing applications or build new ones. Use consistent DevOps processes across Azure in the cloud and Azure Stack on-premises to speed up application modernization for core mission-critical applications.

Azure Stack enables these usage scenarios by providing:

- An integrated delivery experience to get up and running quickly with purpose-built Azure Stack integrated systems from trusted hardware partners. After delivery, Azure Stack easily integrates into the datacenter with monitoring through the System Center Operations Manager Management Pack or Nagios extension.

- Flexible identity management using Azure Active Directory (Azure AD) for Azure and Azure Stack hybrid environments, and leveraging Active Directory Federation Services (AD FS) for disconnected deployments. 

- An Azure-consistent application development environment to maximize developer productivity and enable common DevOps approaches across hybrid environments.

- Azure services delivery from on-premises using hybrid cloud computing power. Adopt common operational practices across Azure and Azure Stack to deploy and operate Azure IaaS and PaaS services using the same administrative experiences and tools as Azure. Microsoft delivers continuous Azure innovation to Azure Stack, including new Azure services, updates to existing services, and additional Azure Marketplace applications and images.

## Azure Stack architecture
Azure Stack integrated systems are comprised in racks of 4-16 servers built by trusted hardware partners and delivered straight to your datacenter. After delivery, a solution provider will work with you to deploy the integrated system and ensure the Azure Stack solution meets your business requirements. You will need to prepare your datacenter by ensuring all required power and cooling, border connectivity, and other required datacenter integration requirement are in place. 

> For more information about the Azure Stack datacenter integration experience, see [Azure Stack datacenter integration](azure-stack-customer-journey.md).

Azure Stack is built on industry standard hardware and is managed using the same tools you already use for managing Azure subscriptions. As a result, you can apply consistent DevOps processes whether you are connected to Azure or not. 

The Azure Stack architecture allows you to provide Azure services at the edge for remote locations or intermittent connectivity, disconnected from the internet. You can create hybrid solutions that process data locally in Azure Stack and then aggregate it in Azure for additional processing and analytics. Finally, because Azure Stack is installed on-premises, you can meet specific regulatory or policy requirements with the flexibility of deploying cloud application on-premises without changing any code. 

## Deployment options

### Production or evaluation environments
Azure Stack is offered in two deployment options to meet your needs, Azure Stack integrated systems for production use and the Azure Stack Development Kit (ASDK) for evaluating Azure Stack:

- **Azure Stack integrated systems**. Azure Stack integrated systems are offered through a partnership of Microsoft and hardware partners, creating a solution that offers cloud-paced innovation and computing management simplicity. Because Azure Stack is offered as an integrated hardware and software system, you have the flexibility and control you need, along with the ability to innovate from the cloud. Azure Stack integrated systems range in size from 4-16 nodes, and are jointly supported by the hardware partner and Microsoft. Use Azure Stack integrated systems to create new scenarios and deploy new solutions for your production workloads.

- **Azure Stack Development Kit**. The [Azure Stack Development Kit (ASDK)](./asdk/asdk-what-is.md) is a free, single-node deployment of Azure Stack that you can use to evaluate and learn about Azure Stack. You can also use the ASDK as a developer environment to build apps using the APIs and tooling that's consistent with Azure. However, the ASDK isn't intended to be used as a production environment and has the following limitations as compared to the full integrated systems production deployment:

    - The ASDK can only be associated with a single Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) identity provider.
    - Because Azure Stack components are deployed on a single host computer, there are limited physical resources available for tenant resources. This configuration is not intended to scale or for performance evaluation.
    - Networking scenarios are limited because of the single host and NIC deployment requirements.

### Connection models
You can choose to deploy Azure Stack either **connected** to the internet (and to Azure) or **disconnected** from it. This choice defines which options are available for your identity store (Azure AD or AD FS) and billing model (Pay as you use-based billing or capacity-based billing).

> For more information, see the considerations for [connected](azure-stack-connected-deployment.md) and [disconnected](azure-stack-disconnected-deployment.md) deployment models. 

### Identity provider 
Azure Stack uses either Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) as an identity provider to establish Azure Stack identities. 

> [!IMPORTANT]
> This is a key decision point! Choosing Azure AD or AD FS as your identity provider is a one-time decision that you must make at deployment time. You can’t change this later without re-deploying the entire system.

Azure AD is Microsoft's cloud-based, multi-tenant identity provider. Most hybrid scenarios with internet-connected deployments use Azure AD as the identity store. However, you may choose to use Active Directory Federation Services (AD FS) for disconnected deployments of Azure Stack. Azure Stack resource providers, and other applications, work much the same way with AD FS as they do with Azure AD. Azure Stack includes its own Active Directory instance and an Active Directory Graph API. 

> You can learn more about Azure Stack identity considerations at [Overview of identity for Azure Stack](azure-stack-identity-overview.md).

## How is Azure Stack managed?
After Azure Stack has been deployed in either an integrated systems deployment or an ASDK installation, the primary methods of interacting with Azure Stack are the administration portal, user portal, and PowerShell. The Azure Stack portals are each backed by separate instances of Azure Resource Manager. An **Azure Stack Operator** uses the administration portal to manage Azure Stack, and to do things like create tenant offerings, and maintain the health and monitor status of the integrated system. The user portal (also referred to as the tenant portal) provides a self-service experience for consumption of cloud resources, like virtual machines, storage accounts, and web apps. 

> For more information about managing Azure Stack using the administration portal, see the use the [Azure Stack administration portal quickstart](azure-stack-manage-portals.md).

As an Azure Stack Operator, you can deliver a wide variety of services and applications, such as [virtual machines](azure-stack-tutorial-tenant-vm.md), [web applications](azure-stack-app-service-overview.md), highly available [SQL Server](azure-stack-tutorial-sql.md), and [MySQL Server](azure-stack-tutorial-mysql.md) databases. You can also use [Azure Stack quickstart Azure Resource Manager templates](https://github.com/Azure/AzureStack-QuickStart-Templates) to deploy SharePoint, Exchange, and more. 

Using the administration portal, you can [configure Azure Stack to deliver services](azure-stack-plan-offer-quota-overview.md) to tenants using plans, quotas, offers, and subscriptions. Tenant users can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services. Operators also manage capacity and respond to alerts. 

When Azure Stack is configured, an **Azure Stack User** (also referred to as a tenant) consumes services that the Operator offers. Users can provision, monitor, and manage services that they have subscribed to, such as web apps, storage, and virtual machines.

> To learn more about managing Azure Stack, including what accounts to use where, typical Operator responsibilities, what to tell your users, and how to get help, review [Azure Stack administration basics](azure-stack-manage-basics.md).

## Resource providers 
Resource providers are web services that form the foundation for all Azure Stack IaaS and PaaS services. Azure Resource Manager relies on different resource providers to provide access to services. Each resource provider helps you configure and control its respective resources. Service administrators can also add new custom resource providers. 

### Foundational resource providers 
There are three foundational IaaS resource providers: Compute, Network, and Storage:

- **Compute**. The Compute Resource Provider allows Azure Stack tenants to create their own virtual machines. The Compute Resource Provider includes the ability to create virtual machines as well as Virtual Machine extensions. The Virtual Machine extension service helps provide IaaS capabilities for Windows and Linux virtual machines.  As an example, you can use the Compute Resource Provider to provision a Linux virtual machine and run Bash scripts during deployment to configure the VM.
- **Network Resource Provider**. The Network Resource Provider delivers a series of Software Defined Networking (SDN) and Network Function Virtualization (NFV) features for the private cloud. You can use the Network Resource Provider to create resources like software load balancers, public IPs, network security groups, and virtual networks.
- **Storage Resource Provider**. The Storage Resource Provider delivers four Azure-consistent storage services: [blob](https://docs.microsoft.com/azure/storage/common/storage-introduction#blob-storage), [queue](https://docs.microsoft.com/azure/storage/common/storage-introduction#queue-storage), [table](https://docs.microsoft.com/azure/storage/common/storage-introduction#table-storage), and KeyVault account management providing management and auditing of secrets, such as passwords and certificates. The storage resource provider also offers a storage cloud administration service to facilitate service provider administration of Azure-consistent Storage services. Azure Storage provides the flexibility to store and retrieve large amounts of unstructured data, such as documents and media files with Azure Blobs, and structured NoSQL based data with Azure Tables. 

### Optional resource providers
There are three optional PaaS resource providers that you can deploy and use with Azure Stack: App Service, SQL Server, and MySQL Server resource providers:

- **App Service**. [Azure App Service on Azure Stack](azure-stack-app-service-overview.md) is a platform-as-a-service (PaaS) offering of Microsoft Azure available to Azure Stack. The service enables your internal or external customers to create web, API, and Azure Functions applications for any platform or device. 
- **SQL Server**. Use the [SQL Server resource provider](azure-stack-sql-resource-provider.md) to offer SQL databases as a service of Azure Stack. After you install the resource provider, and connect it to one or more SQL Server instances, you and your users can create databases for cloud-native apps, Websites that use SQL, and other workloads that use SQL.
- **MySQL Server**. Use the [MySQL Server resource provider](azure-stack-mysql-resource-provider-deploy.md) to expose MySQL databases as an Azure Stack service. The MySQL resource provider runs as a service on a Windows Server 2016 Server Core virtual machine (VM).

## Providing high availability
To achieve high availability of a multi-VM production system in Azure, VMs are placed in an [availability set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) that spreads them across multiple fault domains and update domains. In the smaller scale of Azure Stack, a fault domain in an availability set is defined as a single node in the scale unit.  

While the infrastructure of Azure Stack is already resilient to failures, the underlying technology (failover clustering) still incurs some downtime for VMs on an impacted physical server if there is a hardware failure. Azure Stack supports having an availability set with a maximum of three fault domains to be consistent with Azure.

- **Fault domains**. VMs placed in an availability set will be physically isolated from each other by spreading them as evenly as possible over multiple fault domains (Azure Stack nodes). If there is a hardware failure, VMs from the failed fault domain will be restarted in other fault domains, but, if possible, kept in separate fault domains from the other VMs in the same availability set. When the hardware comes back online, VMs will be rebalanced to maintain high availability. 
 
- **Update domains**. Update domains are another Azure concept that provides high availability in availability sets. An update domain is a logical group of underlying hardware that can undergo maintenance at the same time. VMs located in the same update domain will be restarted together during planned maintenance. As tenants create VMs within an availability set, the Azure platform automatically distributes VMs across these update domains. In Azure Stack, VMs are live migrated across the other online hosts in the cluster before their underlying host is updated. Since there is no tenant downtime during a host update, the update domain feature on Azure Stack only exists for template compatibility with Azure. 

## Role Based Access Control
You can use Role Based Access Control (RBAC) to grant system access to authorized users, groups, and services by assigning them roles at a subscription, resource group, or individual resource level. Each role defines the access level a user, group, or service has over Microsoft Azure Stack resources.

Azure Stack RBAC has three basic roles that apply to all resource types: Owner, Contributor, and Reader. Owner has full access to all resources including the right to delegate access to others. Contributor can create and manage all types of Azure resources but can’t grant access to others. Reader can only view existing resources. The rest of the RBAC roles allow management of specific Azure resources. For instance, the Virtual Machine Contributor role allows creation and management of virtual machines but does not allow management of the virtual network or the subnet that the virtual machine connects to.

> See [Manage Role-Based Access Control](azure-stack-manage-permissions.md) for more information. 

## Reporting usage data
Microsoft Azure Stack collects and aggregates usage data across all resource providers, and transmits it to Azure for processing by Azure commerce. The usage data collected on Azure Stack can be viewed via a REST API. There is an Azure-consistent Tenant API as well as Provider and Delegated Provider APIs to get usage data across all tenant subscriptions. This data can be used to integrate with an external tool or service for billing or chargeback. Once usage has been processed by Azure commerce, it can be viewed in the Azure billing portal.

> Learn more about [reporting Azure Stack usage data to Azure](azure-stack-usage-reporting.md).

## Next steps

[Compare Azure Stack and global Azure](compare-azure-azure-stack.md)

[Administration basics](azure-stack-manage-basics.md)

[Quickstart: use the Azure Stack administration portal](azure-stack-manage-portals.md)