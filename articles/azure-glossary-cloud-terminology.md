<properties
    pageTitle="Azure glossary - Azure dictionary | Microsoft Azure"
    description="Use the Azure glossary to understand cloud terminology on the Azure platform. This short Azure dictionary provides definitions for common cloud terms for Azure."
    keywords="Azure dictionary, cloud terminology, Azure glossary, terminology definitions, cloud terms"
    services="na"
    documentationCenter="na"
    authors="MonicaRush"
    manager="jhubbard"
    editor=""/>

<tags
    ms.service="multiple"
    ms.workload="na"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="08/03/2016"
    ms.author="monicar"/>


# Microsoft Azure glossary: A dictionary of cloud terminology on the Azure platform

The Microsoft Azure glossary is a short dictionary of cloud terminology for the Azure platform.

## Find service definitions and other cloud terms

* For definitions of Azure services and their AWS counterparts see [Microsoft Azure and Amazon Web Services](https://azure.microsoft.com/campaigns/azure-vs-aws/mapping/).

* For general industry cloud terms see [Cloud computing terms](https://azure.microsoft.com/overview/cloud-computing-dictionary/).

The Azure glossary with the above two references provides an end-to-end taxonomy for Azure and the cloud industry.  

## Azure glossary list


### <a name="account"></a>account  
A work or school, or personal Microsoft account that is used to access and manage an Azure subscription.  
See also [How Azure subscriptions are associated with Azure Active Directory](./active-directory/active-directory-how-subscriptions-associated-directory.md)


### <a name="availability-set"></a>availability set  
A collection of virtual machines that are managed together to provide application redundancy and reliability. The use of an availability set ensures that during either a planned or unplanned maintenance event at least one virtual machine is available.  
See also [Manage the availability of Windows virtual machines](./virtual-machines/virtual-machines-windows-manage-availability.md) or [Manage the availability of Linux virtual machines](./virtual-machines/virtual-machines-linux-manage-availability.md)


### <a name="classic-model"></a>Azure classic deployment model  
One of two [deployment models](resource-manager-deployment-model.md) used to deploy resources in Azure (the new model is Azure Resource Manager). Some Azure resources can be deployed in one model or the other, while others can be deployed in both models. Guidance for individual Azure resources detail which model(s) a resource can be deployed with.


### <a name="cli"></a>Azure command-line interface (CLI)  
A [command-line interface](xplat-cli-install.md) that can be used to manage Azure services from Windows, OSX, and Linux PCs.


### <a name="powershell"></a>Azure PowerShell  
A [command-line interface](powershell-install-configure.md) to manage Azure services via a command line from Windows PCs. Some services or service features can be managed only via PowerShell or the CLI. Guidance for each individual Azure resource details which model(s) a resource can be deployed with.   
See also [How to install and configure Azure PowerShell](powershell-install-configure.md)


### <a name="arm-model"></a>Azure Resource Manager deployment model  
One of two [deployment models](resource-manager-deployment-model.md) used to deploy resources in Microsoft Azure (the other is the classic deployment model). Some Azure resources can be deployed in one model or the other, while others can be deployed in both models. Guidance for individual Azure resources detail which model(s) a resource can be deployed with.


### <a name="fault-domain"></a>fault domain  
The collection of virtual machines in an availability set that can possibly fail at the same time. An example is a group of machines in a rack that share a common power source and network switch. In Azure, the virtual machines in an availability set are automatically separated across multiple fault domains.  
See also [Manage the availability of Windows virtual machines](./virtual-machines/virtual-machines-windows-manage-availability.md) or [Manage the availability of Linux virtual machines](./virtual-machines/virtual-machines-linux-manage-availability.md)  


### <a name="geo"></a>geo  
A defined boundary for data residency that typically contains two or more regions. The boundaries may be within or beyond national borders and are influenced by tax regulation. Every geo has at least one region. Examples of geos are Asia Pacific and Japan. Also called *geography*.  
See also [Azure Regions](best-practices-availability-paired-regions.md)


### <a name="geo-replication"></a>geo-replication  
The process of automatically replicating content such as blobs, tables, and queues within a regional pair.  
See also [Active Geo-Replication for Azure SQL Database](./sql-database/sql-database-geo-replication-overview.md)


### <a name="image"></a>image  
A file that contains the operating system and application configuration that can be used to create any number of virtual machines. In Azure there are two types of images: VM image and OS image. A VM image includes an operating system and all disks attached to a virtual machine when the image is created. An OS image contains only a generalized operating system with no data disk configurations.  
See also [Navigate and select Windows virtual machine images in Azure with PowerShell or the CLI](./virtual-machines/virtual-machines-windows-cli-ps-findimage.md)


### <a name="limits"></a>limits  
The number of resources that can be created or the performance benchmark that can be achieved. Limits are typically associated with subscriptions, services, and offerings.  
See also [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md)


### <a name="load-balancer"></a>load balancer  
A resource that distributes incoming traffic among computers in a network. In Azure, a load balancer distributes traffic to virtual machines defined in a load-balancer set. A [load balancer](./load-balancer/load-balancer-overview.md) can be internet-facing, or it can be internal.  


### <a name="offer"></a>offer  
The pricing, credits, and related terms applicable to an Azure subscription.  
See the [Azure offer details page](https://azure.microsoft.com/support/legal/offer-details/)


### <a name="portal"></a>portal  
The secure Web portal used to deploy and manage Azure services.  There are two portals: The [Azure portal](http://portal.azure.com/) and the [classic portal](http://manage.windowsazure.com/). Some services are available in both portals, whereas others are only available in one or the other. The [Azure portal availability chart](https://azure.microsoft.com/features/azure-portal/availability/) lists which services are available in which portal.  


### <a name="region"></a>region  
An area within a geo that does not cross national borders and contains one or more datacenters. Pricing, regional services, and offer types are exposed at the region level. A region is typically paired with another region, which can be up to several hundred miles away, to form a regional pair. Regional pairs can be used as a mechanism for disaster recovery and high availability scenarios. Also referred to generally as *location*.  
See also [Azure Regions](best-practices-availability-paired-regions.md)


### <a name="resource"></a>resource  
An item that is part of your Azure solution. Each Azure service enables you to deploy different types of resources, such as databases or virtual machines.   
See also [Azure Resource Manager overview](resource-group-overview.md)


### <a name="resource-group"></a>resource group  
A container in Resource Manager that holds related resources for an application. The resource group can include all of the resources for an application, or only those resources that are logically grouped together. You can decide how you want to allocate resources to resource groups based on what makes the most sense for your organization.  
See also [Azure Resource Manager overview](resource-group-overview.md)


### <a name="arm-template"></a>Resource Manager template  
A JSON file that declaratively defines one or more Azure resources and that defines dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly.  
See also [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md)


### <a name="resource-provider"></a>resource provider  
A service that supplies the resources you can deploy and manage through Resource Manager. Each resource provider offers operations for working with the resources that are deployed. Resource providers can be accessed through the Azure portal, Azure PowerShell, and several programming SDKs.  
See also [Azure Resource Manager overview](resource-group-overview.md)


### <a name="role"></a>role  
A means for controlling access that can be assigned to users, groups, and services. Roles are able to perform actions such as create, manage, and read on Azure resources.  
See also [RBAC: Built-in roles](./active-directory/role-based-access-built-in-roles.md)


### <a name="sla"></a>service level agreement (SLA)  
The agreement that describes Microsoft’s commitments for uptime and connectivity. Each Azure service has a specific SLA.  
See also [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)


### <a name="storage-account"></a>storage account  
A storage account that gives you access to the Azure Blob, Queue, Table, and File services in Azure Storage. Your storage account provides the unique namespace for your Azure Storage data objects.  
See also [About Azure storage accounts](./storage/storage-create-storage-account.md)


### <a name="subscription"></a>subscription  
A customer's agreement with Microsoft that enables them to obtain Azure services. The subscription pricing and related terms are governed by the offer chosen for the subscription. See [Microsoft Online Subscription Agreement](https://azure.microsoft.com/support/legal/subscription-agreement/).  
See also [How Azure subscriptions are associated with Azure Active Directory](./active-directory/active-directory-how-subscriptions-associated-directory.md)


### <a name="tag"></a>tag  
An indexing term that enables you to categorize resources according to your requirements for managing or billing. You can use tags when you have a complex collection of resource groups and resources, and you need to visualize those assets in the way that makes the most sense. For example, you could tag resources that serve a similar role in your organization or belong to the same department.  
See also [Using tags to organize your Azure resources](resource-group-using-tags.md)


### <a name="update-domain"></a>update domain  
The collection of virtual machines in an availability set that are updated at the same time. Virtual machines in the same update domain are restarted together during planned maintenance. Azure never restarts more than one update domain at a time. Also referred to as an upgrade domain.  
See also [Manage the availability of Windows virtual machines](./virtual-machines/virtual-machines-windows-manage-availability.md) or [Manage the availability of Linux virtual machines](./virtual-machines/virtual-machines-linux-manage-availability.md)  


### <a name="vm"></a>virtual machine  
The software implementation of a physical computer that runs an operating system. Multiple virtual machines can run simultaneously on the same hardware. In Azure, virtual machines are available in a variety of sizes.  
See also [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/)


### <a name="vm-extension"></a>virtual machine extension  
A resource that implements behaviors or features that either help other programs work or provide the ability for you to interact with a running computer. For example, you could use the VM Access extension to reset or modify remote access values on an Azure virtual machine.  
See also [About virtual machine extensions and features (Windows)](./virtual-machines/virtual-machines-windows-extensions-features.md) or [About virtual machine extensions and features (Linux)](./virtual-machines/virtual-machines-linux-extensions-features.md)


### <a name="vnet"></a>virtual network  
A network that provides connectivity between your Azure resources that is isolated from all other Azure tenants. It can be connected to other Azure virtual networks through an [Azure VPN Gateway](./vpn-gateway/vpn-gateway-about-vpngateways.md) and to your on-premises network using [multiple options](./vpn-gateway/vpn-gateway-cross-premises-options.md). You can fully control the IP address blocks, DNS settings, security policies, and route tables within this network.  
See also [Virtual Network Overview](./virtual-network/virtual-networks-overview.md)  

###**See also**  
- [Get started with Azure](https://azure.microsoft.com/get-started/)
- [Cloud resource center](https://azure.microsoft.com/resources/)  
- [Azure for your business application](https://azure.microsoft.com/overview/business-apps-on-azure/)
- [Azure in your datacenter](https://azure.microsoft.com/overview/business-apps-on-azure/) 





