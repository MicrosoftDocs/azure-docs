<properties
   pageTitle="Azure Compute, Network & Storage Providers under Azure Resource Manager"
   description="Conceptual overview of the Compute, Network & Storage Resource Providers (CRP, NRP, and SRP)"
   services="virtual-machines"
   documentationCenter="dev-center-name"
   authors="mahthi"
   manager="timlt"
   editor=""
	tags="azure-resource-manager,azure-service-management"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/29/2015"
   ms.author="mahthi"/>

# Azure Compute, Network & Storage Providers under the Azure Resource Manager

The inclusion of Compute, Network & Storage capabilities with the Azure Resource Manager will fundamentally simplify the deployment and management of complex applications running on IaaS. Many applications require a combination of resources, including a Virtual Network, Storage Account, Virtual Machine, and a Network Interface. The Azure Resource Manager offers the ability to construct a JSON template to deploy and manage all these resources together as a single application.

## Advantages of integrating Compute, Network & Storage under the Azure Resource Manager

The Azure Resource Manager offers the ability to easily leverage pre-built application templates or construct an application template to deploy and manage compute, network, and storage resources on Azure. In this section, we’ll walk through the advantages of deploying resources through the Azure Resource Manager.

-	Complexity made simple -- Build, integrate, and collaborate on complicated applications that can include the entire gamut of Azure resources (such as Websites, SQL Databases, Virtual Machines, or Virtual Networks) from a shareable template file
-	Flexibility to have repeatable deployments for development, devOps, and system administrators when you use the same template file
-	Deep integration of VM Extensions (Custom Scripts, DSC, Chef, Puppet, etc.) with the Azure Resource Manager in a template file allows easy orchestration of in-VM setup configuration
-	Defining tags and the billing propagation of those tags for Compute, Network & Storage resources
-	Simple and precise organizational resource access management using Azure Role-Based Access Control (RBAC)
-	Simplified Upgrade/Update story by modifying the original template and then redeploying it


## Advancements of the Compute, Network & Storage APIs under Azure Resource Manager

In addition to the advantages mentioned above, there are some significant performance advancements in the APIs released.

-	Enabling massive and parallel deployment of Virtual Machines
-	Support for 3 Fault Domains in Availability Sets
-	Improved Custom Script extension that allows specification of scripts from any publicly accessible custom URL
- Integration of Virtual Machines with the Azure Key Vault for highly secure storage and private deployment of secrets from [FIPS-validated](http://wikipedia.org/wiki/FIPS_140-2) [Hardware Security Modules](http://wikipedia.org/wiki/Hardware_security_module)
-	Provides the basic building blocks of networking through APIs to enable customers to construct complicated applications that include Network Interfaces, Load Balancers, and Virtual Networks
-	Network Interfaces as a new object allows complicated network configuration to be sustained and reused for Virtual Machines
-	Load Balancers as a first-class resource enables IP Address assignments
-	Granular Virtual Network APIs allow you to simplify the management of individual Virtual Networks

## Conceptual differences with the introduction of new APIs

In this section, we will walk through some of the most important conceptual differences between the XML based APIs available today and JSON based APIs available through the Azure Resource Manager for Compute, Network & Storage.

 Item | Azure Service Management (XML-based)	| Compute, Network & Storage Providers (JSON-based)
 ---|---|---
| Cloud Service for Virtual Machines |	Cloud Service was a container for holding the virtual machines that required Availability from the platform and Load Balancing.	| Cloud Service is no longer an object required for creating a Virtual Machine using the new model. |
| Availability Sets	| Availability to the platform was indicated by configuring the same “AvailabilitySetName” on the Virtual Machines. The maximum count of fault domains was 2. | Availability Set is a resource exposed by Microsoft.Compute Provider. Virtual Machines that require high availability must be included in the Availability Set. The maximum count of fault domains is now 3. |
| Affinity Groups |	Affinity Groups were required for creating Virtual Networks. However, with the introduction of Regional Virtual Networks, that was not required anymore. |To simplify, the Affinity Groups concept doesn’t exist in the APIs exposed through Azure Resource Manager. |
| Load Balancing	| Creation of a Cloud Service provides an implicit load balancer for the Virtual Machines deployed. | The Load Balancer is a resource exposed by the Microsoft.Network provider. The primary network interface of the Virtual Machines that needs to be load balanced should be referencing the load balancer. Load Balancers can be internal or external. [Read more.](resource-groups-networking.md) |
|Virtual IP Address	| Cloud Services will get a default VIP (Virtual IP Address) when a VM is added to a cloud service. The Virtual IP Address is the address associated with the implicit load balancer.	| Public IP address is a resource exposed by the Microsoft.Network provider. Public IP Address can be Static (Reserved) or Dynamic. Dynamic Public IPs can be assigned to a Load Balancer. Public IPs can be secured using Security Groups. |
|Reserved IP Address|	You can reserve an IP Address in Azure and associate it with a Cloud Service to ensure that the IP Address is sticky.	| Public IP Address can be created in “Static” mode and it offers the same capability as a “Reserved IP Address”. Static Public IPs can only be assigned to a Load balancer right now. |
|Public IP Address (PIP) per VM	| Public IP Addresses can also associated to a VM directly. | Public IP address is a resource exposed by the Microsoft.Network provider. Public IP Address can be Static (Reserved) or Dynamic. However, only dynamic Public IPs can be assigned to a Network Interface to get a Public IP per VM right now. |
|Endpoints| Input Endpoints needed to be configured on a Virtual Machine to be open up connectivity for certain ports. One of the common modes of connecting to virtual machines done by setting up input endpoints. | Inbound NAT Rules can be configured on Load Balancers to achieve the same capability of enabling endpoints on specific ports for connecting to the VMs. |
|DNS Name| A cloud service would get an implicit globally unique DNS Name. For example: `mycoffeeshop.cloudapp.net`. | DNS Names are optional parameters that can be specified on a Public IP Address resource. The FQDN will be in the following format - `<domainlabel>.<region>.cloudapp.azure.com`. |
|Network Interfaces	| Primary and Secondary Network Interface and its properties were defined as network configuration of a Virtual machine. | Network Interface is a resource exposed by Microsoft.Network Provider. The lifecycle of the Network Interface is not tied to a Virtual Machine. |

## Getting Started with Azure Templates for Virtual Machines

You can get started with the Azure Templates by leveraging the various tools that we have for developing and deploying to the platform.

### Azure Portal

The Azure Portal will continue to have the option to deploy Virtual Machines and Virtual Machines (Preview) simultaneously. The Azure Portal will also allow custom template deployments.

### Azure PowerShell

Azure PowerShell will have two modes of deployment – **AzureServiceManagement** mode and **AzureResourceManager** mode.  AzureResourceManager mode will now also contain the cmdlets to manage Virtual Machines, Virtual Networks, and Storage Accounts. You can read more about it [here](../powershell-azure-resource-manager.md).

### Azure CLI

The Azure Command-line Interface (Azure CLI) will have two modes of deployment – **AzureServiceManagement** mode and **AzureResourceManager** mode. The AzureResourceManager mode will now also contain commands to manage Virtual Machines, Virtual Networks, and Storage Accounts. You can read more about it [here](xplat-cli-azure-resource-manager.md).

### Visual Studio

With the latest Azure SDK release for Visual Studio, you can author and deploy Virtual Machines and complex applications right from Visual Studio. Visual Studio offers the ability to deploy from a pre-built list of templates or start from an empty template.

### REST APIs

You can find the detailed REST API documentation for the Compute, Network & Storage Resource Providers [here](https://msdn.microsoft.com/library/azure/dn790568.aspx).

## Frequently Asked Questions

**Can I create a Virtual Machine using the new Azure Resource Manager to deploy in a Virtual Network or Storage Account created using the Azure Service Management APIs?**

This is not supported at the moment. You cannot deploy using the new Azure Resource Manager APIs to deploy a Virtual Machine into a Virtual Network that was created using the Service Management APIs.

**Can I create a Virtual Machine using the new Azure Resource Manager APIs from a user image that was created using the Azure Service Management APIs?**

This is not supported at the moment. However, you can copy the VHD files from a Storage Account that was created using the Service Management APIs and copy it to a new account created using the using the new Azure Resource Manager APIs.

**What is the impact on the quota for my subscription?**

The quotas for the Virtual Machines, Virtual Networks, and Storage Accounts created through the new Azure Resource Manager APIs  are separate from the quotas that you currently have. Each subscription gets new quotas to create the resources using the new APIs. You can read more about the additional quotas [here](../azure-subscription-service-limits.md).

**Can I continue to use my automated scripts for provisioning Virtual Machines, Virtual Networks, Storage Accounts etc. through the new Azure Resource Manager APIs?**

All the automation and scripts that you’ve built will continue to work for the existing Virtual Machines, Virtual Networks created under the Azure Service Management mode. However, the scripts have to be updated to use the new schema for creating the same resources through the new Azure Resource Manager mode. Read more about how to modify your [Azure CLI scripts](xplat-cli-azure-manage-vm-asm-arm.md).

**Can the Virtual Networks created using the new Azure Resource Manager APIs be connected to my Express Route circuit?**

This is not supported at the moment. You cannot connect the Virtual Networks created using the new Azure Resource Manager APIs with an Express Route Circuit. This will be supported in the future.
 