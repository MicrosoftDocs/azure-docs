<properties
   pageTitle="Resource Manager and Service Management (classic) deployment modes | Microsoft Azure"
   description="Learn the differences between Resource Manager and classic deployment models."
   services="virtual-network"
   documentationCenter=""
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager,azure-service-management"/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/11/2016"
   ms.author="telmos"/>

# Azure Deployment Models

The Azure platform is in transition.  Whether you're new to Azure or have been using it for years, it's important to understand some of the key changes we're making to the platform during this transition.

All Azure resources support one or both of the following deployment models:

- **Resource Manager:** This is the newest deployment model for Azure resources. Most newer resources already support this deployment model and eventually all resources will.   
 
- **Classic:** This model is supported by most existing Azure resources today. New resources added to Azure will not support this model.

The documentation for each Azure resource details which service models it can be created with.

## Why does this matter? 

It matters for the following reasons:

- The Azure platform features that you use are different across these two models.  For example, resources created using the Resource Manager deployment model (or just Resource Manager) can be created with [Azure Resource Manager templates](resource-group-overview.md/#template-deployment), whereas resources created with the Classic deployment model cannot.
- The individual Azure resource features or behaviors can be different across the two models, or only exist in one model or the other.  For example, load balancing traffic across virtual machines created with the Classic deployment model is *implicit* because virtual machines are members of an Azure Cloud Service, and load is automatically balanced across virtual machines within a cloud service. Virtual machines created using Resource Manager are not members of a cloud service, and a separate Azure Load Balancer resource must be *explicitly* created to load balance traffic across multiple virtual machines.  
- How you create, configure, and manage your Azure resources is different between these two models.
- Resources created using one deployment model can't necessarily interoperate with resources created using a different deployment model. For example, Azure Virtual Machines created using one deployment model can only be connected to Azure Virtual Networks created using the same deployment model.    

Underlying each of the deployment models is an application programming interface (API) for each resource.  There's a [Resource Manager API](https://msdn.microsoft.com/library/azure/dn948464.aspx) for the Resource Manager deployment model and a [Service Management API](https://msdn.microsoft.com/library/azure/ee460799.aspx) for the Classic deployment model. Developers can write code to interact with these APIs *directly*.  

IT pros however, typically interact with these APIs *indirectly* by using a graphical portal in a web browser, by using Azure PowerShell cmdlets on a Windows computer, or by using the Azure Command Line Interface (CLI) on either a Windows, OS X, or Linux computer. All three of these indirect methods used by the IT pro interact directly with the APIs. This means that when new functionality is introduced to the Azure platform or resources, it's always directly available through the API first, with the indirect methods gaining support for the new resources and features after the API is made available.  

The sections below explain how Azure resources are configured using the different deployment models through the three indirect methods.

## Portals
Azure has two portals:

- **[Azure portal](https://manage.windowsazure.com):** If you've been using Azure for a while, you've used this portal. It is used to create and configure older Azure resources that support the classic deployment model. You cannot use it to create or configure resources that only support Resource Manager. 
- **[Azure preview portal](https://azure.microsoft.com/overview/preview-portal/):** If you're using a newer Azure resource, you've likely used this portal. It can be used to create and configure some Azure resources. You'll eventually be able to create and configure all Azure resources with it. For some resources that support both deployment models, this portal can be used to create and configure a resource using either deployment model. 

Some resources and features can only be created and configured in one portal or the other. Some resources or features can't (yet) be created or configured in either portal, and can only be configured with PowerShell, the CLI, or both. The documentation for each Azure resource details which method it can be created with. 

## PowerShell
With [PowerShell](powershell-install-configure.md) you can use a command line or author scripts to create and configure Azure resources from a Windows computer.  Individual Azure resources have [Resource Manager cmdlets](https://msdn.microsoft.com/library/azure/mt125356.aspx), [Service Management cmdlets](https://msdn.microsoft.com/library/azure/dn708504.aspx), or both.  Some resources and features can only be created and/or configured using PowerShell or the CLI. Depending on the resource, when using Resource Manager PowerShell cmdlets you may have two options for creating and configuring Azure resources:

- **PowerShell cmdlets only:** You can create and configure each Azure resource individually using the cmdlets for each resource. You can do this from a command line, or by including multiple commands in a PowerShell script that you can store and version.

- **PowerShell cmdlets with an Azure Resource Manager template:** You can use PowerShell to create Azure resources using an Azure Resource Manager template. Templates can be saved and versioned. Learn more by reading the [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md) article. Several [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) exist for common solutions that can be downloaded and modified too.

## CLI
You can create and configure Azure resources from Windows, OS X, or Linux computers using the CLI.  Read the [Install the Azure CLI](xplat-cli-install.md) article to install the CLI on your operating system of choice. Like PowerShell, there are different commands that must be used depending on whether you're creating resources using [Resource Manager](xplat-cli-azure-resource-manager.md) or the [Classic (Service Management)](./virtual-machines/virtual-machines-linux-classic-manage-visual-studio.md) deployment models.

## Next steps

- Learn more about [Resource Manager](resource-group-overview.md).
- Understand how to [design templates](best-practices-resource-manager-design-templates.md).
