---
title: Azure glossary - Azure dictionary | Microsoft Docs
description: Use the Azure glossary to understand cloud terminology on the Azure platform. This short Azure dictionary provides definitions for common cloud terms for Azure.
keywords: Azure dictionary, cloud terminology, Azure glossary, terminology definitions, cloud terms
services: na
documentationcenter: na
author: MonicaRush
manager: jhubbard
editor: ''

ms.assetid: d7ac12f7-24b5-4bcd-9e4d-3d76fbd8d297
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2017
ms.author: monicar

---
# Microsoft Azure glossary: A dictionary of cloud terminology on the Azure platform

The Microsoft Azure glossary is a short dictionary of cloud terminology for the Azure platform. See also:

* [Microsoft Azure and Amazon Web Services](https://azure.microsoft.com/campaigns/azure-vs-aws/mapping/) - Definitions of Azure services and their AWS counterparts.<!-- I propose to link to https://azure.microsoft.com/services/ instead of this -->
* [Cloud computing terms](https://azure.microsoft.com/overview/cloud-computing-dictionary/) - General industry cloud terms.

## account
An account that's used to access and manage an Azure subscription. It's often referred to as an Azure account although an account can be any of these: an existing work, school, or personal Microsoft account, or an Office 365 user name and password. You can also create an account to manage an Azure subscription when you sign up for the [free trial](https://azure.microsoft.com).  
See [Sign up for an Azure subscription with your Office 365 account](billing/billing-use-existing-office-365-account-azure-subscription.md) and [Accounts you can use to sign in](active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## API app
Another name for [App Service app](#app-service-app).

## App Service app
The compute resources that [Azure App Service](app-service/app-service-web-overview.md) provides for hosting a website or web application, web API, or [mobile app backend](app-service-mobile/app-service-mobile-value-prop.md). App Service apps are also referred to as *App Services*, *web apps*, *API apps*, and *mobile apps*.

## availability set
A collection of virtual machines that are managed together to provide application redundancy and reliability. The use of an availability set ensures that during either a planned or unplanned maintenance event at least one virtual machine is available.  
See [Manage the availability of Windows virtual machines](virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and [Manage the availability of Linux virtual machines](virtual-machines/linux/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## <a name="classic-model"></a>Azure classic deployment model
One of two [deployment models](resource-manager-deployment-model.md) used to deploy resources in Azure (the new model is Azure Resource Manager). Some Azure services support only the Resource Manager deployment model, some support only the classic deployment model, and some support both. The documentation for each Azure service specifies which model(s) they support.

## <a name="cli"></a>Azure command-line interface (CLI)
A command-line interface that can be used to manage Azure services from Windows, macOS, and Linux.  Some services or service features can be managed only via PowerShell or the CLI. See [Azure CLI](/cli/azure)

## <a name="powershell"></a>Azure PowerShell
A command-line interface to manage Azure services via a command line from Windows PCs. Some services or service features can be managed only via PowerShell or the CLI.
See [How to install and configure Azure PowerShell](/powershell/azure/overview)

## <a name="arm-model"></a>Azure Resource Manager deployment model
One of two [deployment models](resource-manager-deployment-model.md) used to deploy resources in Microsoft Azure (the other is the classic deployment model). Some Azure services support only the Resource Manager deployment model, some support only the classic deployment model, and some support both. The documentation for each Azure service specifies which model(s) they support.

## fault domain
The collection of virtual machines in an availability set that can possibly fail at the same time. An example is a group of machines in a rack that share a common power source and network switch. In Azure, the virtual machines in an availability set are automatically separated across multiple fault domains.  
See [Manage the availability of Windows virtual machines](virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [Manage the availability of Linux virtual machines](virtual-machines/linux/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)  

## geo
A defined boundary for data residency that typically contains two or more regions. The boundaries may be within or beyond national borders and are influenced by tax regulation. Every geo has at least one region. Examples of geos are Asia Pacific and Japan. Also called *geography*.  
See [Azure Regions](best-practices-availability-paired-regions.md)

## geo-replication
The process of automatically replicating content such as blobs, tables, and queues within a regional pair.  
See [Active Geo-Replication for Azure SQL Database](sql-database/sql-database-geo-replication-overview.md)
<!-- The meaning of "geo" in this term seems to be different than the meaning provided in the "geo" entry -->

## image
A file that contains the operating system and application configuration that can be used to create any number of virtual machines. In Azure there are two types of images: VM image and OS image. A VM image includes an operating system and all disks attached to a virtual machine when the image is created. An OS image contains only a generalized operating system with no data disk configurations.  
See [Navigate and select Windows virtual machine images in Azure with PowerShell or the CLI](virtual-machines/windows/cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## limits
The number of resources that can be created or the performance benchmark that can be achieved. Limits are typically associated with subscriptions, services, and offerings.  
See [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md)

## load balancer
A resource that distributes incoming traffic among computers in a network. In Azure, a load balancer distributes traffic to virtual machines defined in a load-balancer set. A [load balancer](load-balancer/load-balancer-overview.md) can be internet-facing, or it can be internal.  

## mobile app
Another name for [App Service App](#app-service-app).

## offer
The pricing, credits, and related terms applicable to an Azure subscription.  
See the [Azure offer details page](https://azure.microsoft.com/support/legal/offer-details/)

## portal
The secure web portal used to deploy and manage Azure services.

## region
An area within a geo that does not cross national borders and contains one or more datacenters. Pricing, regional services, and offer types are exposed at the region level. A region is typically paired with another region, which can be up to several hundred miles away. Regional pairs can be used as a mechanism for disaster recovery and high availability scenarios. Also referred to as *location*.  
See [Azure Regions](best-practices-availability-paired-regions.md)

## resource
An item that is part of your Azure solution. Each Azure service enables you to deploy different types of resources, such as databases or virtual machines.   
See [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md)

## resource group
A container in Resource Manager that holds related resources for an application. The resource group can include all of the resources for an application, or only those resources that are logically grouped together. You can decide how you want to allocate resources to resource groups based on what makes the most sense for your organization.  
See [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md)

## <a name="arm-template"></a>Resource Manager template
A JSON file that declaratively defines one or more Azure resources and that defines dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly.  
See [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md)

## resource provider
A service that supplies the resources you can deploy and manage through Resource Manager. Each resource provider offers operations for working with the resources that are deployed. Resource providers can be accessed through the Azure portal, Azure PowerShell, and several programming SDKs.  
See [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md)

## role
A means for controlling access that can be assigned to users, groups, and services. Roles are able to perform actions such as create, manage, and read on Azure resources.  
See [RBAC: Built-in roles](role-based-access-control/built-in-roles.md)

## <a name="sla"></a>service level agreement (SLA)
The agreement that describes Microsoft’s commitments for uptime and connectivity. Each Azure service has a specific SLA.  
See [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)

## <a name="sas"></a>shared access signature (SAS)
A signature that enables you to grant limited access to a resource, without exposing your account key. For example, [Azure Storage uses SAS](storage/common/storage-dotnet-shared-access-signature-part-1.md) to grant client access to objects such as blobs. [IoT Hub uses SAS](iot-hub/iot-hub-devguide-security.md#security-tokens) to grant devices permission to send telemetry.

## storage account
An account that gives you access to the Azure Blob, Queue, Table, and File services in Azure Storage. The storage account name defines the unique namespace for Azure Storage data objects.  
See [About Azure storage accounts](storage/common/storage-create-storage-account.md)

## subscription
A customer's agreement with Microsoft that enables them to obtain Azure services. The subscription pricing and related terms are governed by the offer chosen for the subscription.
See [Microsoft Online Subscription Agreement](https://azure.microsoft.com/support/legal/subscription-agreement/) and [How Azure subscriptions are associated with Azure Active Directory](active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)

## tag
An indexing term that enables you to categorize resources according to your requirements for managing or billing. When you have a complex collection of resources, you can use tags to visualize those assets in the way that makes the most sense. For example, you could tag resources that serve a similar role in your organization or belong to the same department.  
See [Using tags to organize your Azure resources](resource-group-using-tags.md)

## update domain
The collection of virtual machines in an availability set that are updated at the same time. Virtual machines in the same update domain are restarted together during planned maintenance. Azure never restarts more than one update domain at a time. Also referred to as an upgrade domain.  
See [Manage the availability of Windows virtual machines](virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and [Manage the availability of Linux virtual machines](virtual-machines/linux/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## <a name="vm"></a>virtual machine
The software implementation of a physical computer that runs an operating system. Multiple virtual machines can run simultaneously on the same hardware. In Azure, virtual machines are available in a variety of sizes.  
See [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/)

## <a name="vm-extension"></a>virtual machine extension
A resource that implements behaviors or features that either help other programs work or provide the ability for you to interact with a running computer. For example, you could use the VM Access extension to reset or modify remote access values on an Azure virtual machine.
<!-- This definition seems obscure to me; maybe a list of examples would work better than a conceptual definition? -->
See [About virtual machine extensions and features (Windows)](virtual-machines/windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [About virtual machine extensions and features (Linux)](virtual-machines/linux/extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## <a name="vnet"></a>virtual network
A network that provides connectivity between your Azure resources that is isolated from all other Azure tenants. An [Azure VPN Gateway](vpn-gateway/vpn-gateway-about-vpngateways.md) lets you establish connections between virtual networks and [between a virtual network and an on-premises network](vpn-gateway/vpn-gateway-plan-design.md). You can fully control the IP address blocks, DNS settings, security policies, and route tables within a virtual network.  
See [Virtual Network Overview](virtual-network/virtual-networks-overview.md)  

## Web app
Another name for [App Service App](#app-service-app).

## See also

* [Get started with Azure](https://azure.microsoft.com/get-started/)
* [Cloud resource center](https://azure.microsoft.com/resources/)  
* [Azure for your business application](https://azure.microsoft.com/overview/business-apps-on-azure/)
* [Azure in your datacenter](https://azure.microsoft.com/overview/business-apps-on-azure/)

