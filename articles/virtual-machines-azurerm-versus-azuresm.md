<properties
   pageTitle="Azure Compute, Network and Storage Providers under Azure Resource Manager"
   description="Conceptual overview of the Compute, Network, and Storage Resource Providers (CRP, NRP, and SRP)"
   services="virtual-machines"
   documentationCenter="dev-center-name"
   authors="mahti"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/29/2015"
   ms.author="mahti"/>

# Azure Compute, Network and Storage Providers under Azure Resource Manager

The introduction of Virtual Machines, Network & Storage capabilities under Azure Resource Manager will fundamentally simplify the deployment and management of complex applications running on top of Azure Virtual Machines. Most applications that are designed to run on Virtual Machines use a combination of resources (such as a Virtual Network, Storage Account, Virtual Machine or Websites) to perform as designed. Azure Resource Manager offers the ability to construct a Template makes it possible for you to deploy and manage these resources together as an application by using a JSON description of the resources and associated deployment parameters.

## Advantages of integrating Compute, Network & Storage under Azure Resource Manager

Virtual Machines, Network & Storage capabilities have been Generally Available with complete SLA on Microsoft Azure Stack for quite some time now, however, the introduction of these services under Azure Resource Manager offers the capability to easily leverage pre-built application templates or construct an application template to deploy & manage them on Azure. In this section, we’ll walk through the advantages gained by deploying Virtual Machines through Azure Resource Manager

- Build & Integrate complicated applications on Virtual Machines with the entire gamut of Azure resources (such as Websites, SQL Databases or Azure Automation) from template file
- Flexibility to have repeatable deployments for Dev & Test purposes using the same template file
- Simplified Upgrade/Update story by modifying the original template & redeploying them
- Deep integration of VM Extensions with Azure Resource Manager in a template file allows orchestration of in-VM setup configuration using Virtual Machine Extensions [Custom Scripts, DSC, Chef, Puppet etc.,]
- Defining tags and billing propagation of those tags for Compute, Network & Storage resources
- Simple and precise organizational resource access management using Azure Role-based Access control (RBAC)

## Advancements of the Compute, Network & Storage APIs under Azure Resource Manager

In addition to the advantages mentioned above, there are some significant advancements in the performance of the APIs released.

-	Enabling parallel deployment of Virtual Machines into the same Availability Set
-	Improved Custom Script extensions that allows specification of scripts from any publicly accessible custom URL
-	Provides the basic building blocks of networking through APIs to enable customers to construct complicated applications [For example: Network Interfaces, Load Balancer etc.,]
-	Floating Network Interfaces allows complicated network configuration to be sustained and reused
-	Load Balancers as a first-class resource enables  Address assignments
-	Granular Virtual Network APIs to simplify the management of individual Virtual Networks
-	Increased default limits on Storage Accounts to deploy and manage virtual machines at scale with ease

## Conceptual differences with the introduction of new APIs

In this section, we will walk through some of the most important conceptual differences between the XML based APIs and JSON based APIs for Compute, Network and Storage.  

 Item | Azure Service Management	| Compute, Network & Storage Providers 
 ---|---|--- 
| Cloud Service for Virtual Machines |	Cloud Service was a container for holding the virtual machines that required Availability from the platform & Load Balancing.	| Cloud Service is not required for creating a Virtual Machine using the new model.| 
| Availability Sets	| Availability to the platform was indicated by configuring the same “AvailabilitySetName” on the Virtual Machines. | Availability Set is a resource exposed by Microsoft.Compute Provider. Virtual Machines that needs to belong to the same Availability Set needs to be created referencing the same availability set. |
| Affinity Groups |	Affinity Groups were required for creating Virtual Networks. However, with the introduction of Regional Virtual Networks, that was not required anymore |	Affinity Groups concept doesn’t exist in the APIs exposed through Azure Resource Manager. |
| Load Balancing	| Creation of a Cloud Service provides an implicit load balancer | Load Balancer is a resource exposed by Microsoft.Network provider. The primary network interface of the Virtual Machines that needs to be load balanced should be referencing the load balancer. Load Balancers can be internal or external. You can read more about it here.
|Virtual IP Address	| Cloud Services will get a default VIP (Virtual IP Address) when a VM is added to a cloud service. The Virtual IP Address is the address associated with the implicit load balancer.	| Public IP address is a resource exposed by Microsoft.Network provider. Public IP Address can be Static (Reserved) or Dynamic. Dynamic Public IPs can be assigned to a Load Balancer.|
|Reserved IP Address|	You can reserve an IP Address in Azure and associate it with a Cloud Service to ensure that the IP Address is sticky.	| Public IP Address can be created in “Static” mode and it offers the same capability as “Reserved IP Address”. Static Public IPs can only be assigned to a Load balancer.|
|Public IP Address (PIP) per VM	| Public IP Addresses can also associated to a VM directly | Public IP address is a resource exposed by Microsoft.Network provider. Public IP Address can be Static (Reserved) or Dynamic. However, only dynamic Public IPs can be assigned to a Network Interface to get a Public IP per VM.|
|Endpoints| Input Endpoints needed to be configured on a Virtual Machine to be open up connectivity for certain ports.| Inbound NAT Rules can be configured on Load Balancers to achieve the same capability of opening up specific ports for connecting to the VMs.|
|Connectivity to Virtual Machines| One of the common modes of connecting to virtual machines was done by setting up input endpoints. | To achieve connectivity, you can either setup Inbound NAT Rules through the Load balancer or attach a Public IP Address on the Network Interface used by the VM. |
|DNS Name| A cloud service would get an implicit globally unique DNS Name. For example: mycoffeeshop.cloudapp.net	| DNS Names are optional parameters that can be specified on a Public IP Address resource. The fqdn will be in the following format - <domainlabel>.<region>.cloudapp.azure.com |
|Network Interfaces	| Primary & Secondary Network Interface and its properties were defined as network configuration of a Virtual machine. | 	Network Interface is a resource exposed by Microsoft.Network Provider. The lifecycle of the Network Interface is not tied to a Virtual Machine. |

## Getting Started with Azure Templates for Virtual Machines

You can get started on the Azure Templates by leveraging the various tools that we have for developing & deploying to the Platform.

### Azure Portal

Azure Portal will continue have the option to deploy Virtual Machines & Virtual Machines (Preview) simultaneously. You can see screenshots of the experiences below.

<Add Screenshots>

In addition to the above deployment model, Azure Portal also allows the deployment Custom Template deployments. You can read more about it here.

### PowerShell

PowerShell tools will have two modes of deployment – AzureServiceManagement & AzureResourceManager mode. The AzureResourceManager mode will now also contain the cmdlets to manage Virtual Machines, Virtual Networks etc., You can read more about it here

### Cross Platform Tools

PowerShell tools will have two modes of deployment – AzureServiceManagement & AzureResourceManager mode. The AzureResourceManager mode will now also contain the cmdlets to manage Virtual Machines, Virtual Networks etc., You can read more about it here

### Visual Studio

With the latest Azure SDK release for Visual Studio, you can author and deploy Virtual Machines & complex applications right from Visual Studio. Visual Studio offers the capability to deploy from a pre-built list of templates or start from an empty template.

### REST APIs

You can find the detailed REST API documentation for Compute, Network & Storage Providers here.

## Frequently Asked Questions

Q: Can I create a Virtual Machine in a Virtual Network or Storage Account created using the Azure Service Management APIs?

A: This capability is not supported at the moment. You cannot deploy a Virtual Machine into a Virtual Network created using the Service Management APIs.

Q: Can I create a Virtual Machine from a user image created using the Azure Service Management APIs?

A: This capability is not supported at the moment. However, you can definitely copy the VHD files from the storage account into a Storage Account created through the Microsoft.Compute Provider and deploy from that.

Q: What is the impact on the quota that I currently have for my subscription?

A: The Quotas for the Virtual Machines, Virtual Networks created through Compute, Network & Storage providers are separate from the quotas that you currently have. Each Subscription gets additional quotas to create the resources in this model. You can read more about the additional quotas that a subscription has here

Q: Can I continue to use my automated scripts for provisioning of Virtual Machines, Virtual Networks etc., through the new model?

A: All the automation & scripts that you’ve built will continue to work for creating Virtual Machines, Virtual Networks etc., created under the Azure Service Management mode. However, the scripts have to be updated to use the new schema for creating the same resources through the Compute, Network & Storage providers.

Q: Can the Virtual Networks created through the Microsoft.Network provider be connected to my Express Route circuit?

A: This is not supported at the moment. You cannot connect the Virtual Networks created through the Microsoft.Network provider with Express Route Circuit. This support will be announced in the future.
