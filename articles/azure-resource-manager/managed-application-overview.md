---
title: Overview of Azure Managed Application | Microsoft Docs
description: Describes the concepts for Azure Managed Application
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/24/2017
ms.author: gauravbh; tomfitz

---
# Azure Managed Applications overview

Today, Azure provides a robust Marketplace where ISVs and start ups can offer their solutions to customers around the world. Azure Marketplace is a gallery that consists of hundreds of complex, multi-resource templates from first and third-party vendors. Customers can within minutes deploy and start using PaaS and SaaS applications. Although it provides a great way to quickly deploy an offering, the customer is still responsible for maintaining and updating the solution. For vendors, there is no way to charge customers for use of an application beyond the virtual machine image billing. Furthermore, vendors have no way of preventing customers from modifying critical application resources, and no way to block access to intellectual property that makes up an application. Azure Managed Applications provides a solution for these concerns. 

## Advantages of managed applications

Azure Managed Applications provides an ecosystem that enables vendors to make a PaaS or SaaS services available as self-contained applications. Customers deploy managed applications in their subscriptions, but vendors can manage them. It enables vendors to bill customers using Azure's billing system, use templates to manage the lifecycle of deployed applications. On the other side, it allows customers to automatically acquire updates, and pay for support and maintenance. They do not have to maintain or update the application themselves or diagnose and fix issues when the application fails.

Such an ecosystem in Azure would not only benefit PaaS and SaaS vendors but also corporate central platform teams and System Integrators that wish to package and resell their solutions.

## How managed applications work
There are two experiences when working with managed applications:

1. The vendor or independent software vendor (ISV) who creates a managed application, and makes it available for broader use. 
2. The customer or consumer who wishes to create and use the published application. 

This article provides an overview of both experiences. First, lets understand how a managed application works. 

A managed application is similar to a marketplace solution template with one key difference. In a managed application, the resources are provisioned to a resource group that is managed by the ISV/vendor. The resource group is present in the customer's subscription, but a user, user group, or application in the ISV's tenant has access to the resource group. To manage and service the application, the vendor's identity is added to an Active Directory Owner, Contributor, Reader, or any other built-in role. 

For more information about the vendor experience, see [Create and publish an Azure Managed Application](managed-application-publishing.md).

For more information about the consumer experience, see [Consume an Azure Managed Application](managed-application-consumption.md).

## Key concepts

### Managed resource group
The resource group where all the Azure resources being provisioned in the template are created. For example, if the appliance is creating a storage account, this resource group contains the storage account resource. It does not contain the appliance resource.

### Appliance package
The publisher creates a package that contains the template files and the createUIDefinition file. Specifically it contains the following files:

- **applianceMainTemplate.json** - The template file that defines all the resources that are provisioned by the appliance. This file is a regular template file that is used for creating resources.

- **MainTemplate.json** - Template file that defines the appliance resource (Microsoft.Solutions/appliances). One key property defined in this resource is the ManagedResourceGroupId. This property indicates which resource group is used for hosting the actual resources defined in the applianceMainTemplate.json.

- **createUIDefinition.json** - This file describes how the UI needed for the parameters defined in the template is rendered.

### Authorization
The publisher needs to specify the permissions required by the vendor to manage the resources on behalf of the customer. This permission applies to the managed resource group. You set the following values:

- **PrincipalID** - The Azure AD identifier of the user, group, or application that is used to grant access to the managed resource group. This identifier belongs to the publisher's tenant.

- **RoleDefinitionID** - The Azure AD identifier of the role assigned to the preceding principal ID. It could be any of the built-in RBAC roles in the publisher's tenant.

## Next steps

* To understand the vendor experience, see [Create and publish an Azure Managed Application](managed-application-publishing.md).
* To understand the consumer experience, see [Consume an Azure Managed Application](managed-application-consumption.md).
* To create a UI definition file, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).