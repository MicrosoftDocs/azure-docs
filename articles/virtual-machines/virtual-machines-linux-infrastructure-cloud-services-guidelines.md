<properties
	pageTitle="Azure Cloud Services Infrastructure Guidelines"
	description="Learn about the key design and implementation guidelines for deploying Cloud Services in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="v-livech"/>

# Azure Cloud Services Infrastructure Guidelines

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.

## Cloud services

Cloud services are a fundamental building block in Azure service management, both for PaaS and IaaS services. For PaaS, cloud services represent an association of roles whose instances can communicate among each other. Cloud services are associated to a public virtual IP (VIP) address and a load balancer, which takes incoming traffic from the Internet and load balances it to the roles configured to receive that traffic.

In the case of IaaS, cloud services offer similar functionality, although in most cases, the load balancer functionality is used to forward traffic to specific TCP or UDP ports from the Internet to the many virtual machines within that cloud service.

> [AZURE.NOTE] Cloud services do not exist in Azure Resource Manager. For an introduction to the advantages of Resource Manager, see [Azure compute, network and storage providers under Azure Resource Manager](virtual-machines-windows-compare-deployment-models.md).

Cloud service names are especially important in IaaS because Azure uses them as part of the default naming convention for disks. The cloud service name can contain only letters, numbers, and hyphens. The first and last character in the field must be a letter or number.

Azure exposes the cloud service names, because they are associated to the VIP, in the domain “cloudapp.net”. For a better user experience of the application, a vanity name should be configured as needed to replace the fully qualified cloud service name. This is typically done with a CNAME record in your public DNS that maps the public DNS name of your resource (for example, www.contoso.com) to the DNS name of the cloud service hosting the resource (for example, the cloud service hosting the web servers for www.contoso.com).

In addition, the naming convention used for cloud services might need to tolerate exceptions because the cloud service names must be unique among all other Microsoft Azure cloud services, regardless of the Microsoft Azure tenant.

One important limitation of cloud services to consider is that only one virtual machine management operation can be performed at a time for all the virtual machines in the cloud service. When you perform a virtual machine management operation on one virtual machine in the cloud service, you must wait until it is finished before you can perform a new management operation on another virtual machine. Therefore, you should keep the number of virtual machines in a cloud service low.

Azure subscriptions can support a maximum of 200 cloud services.

## Implementation guidelines recap for cloud services

Decision:

- What set of cloud services do you need to host your IT workload or infrastructure?

Task:

- Create the set of cloud services using your naming convention. You can use the Azure classic portal or the **New-AzureService** PowerShell cmdlet.
