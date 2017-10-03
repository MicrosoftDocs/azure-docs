---
title: Overview of Azure managed applications | Microsoft Docs
description: Describes the concepts for Azure managed applications
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 09/19/2017
ms.author: gauravbh
---

# Azure managed applications overview

Vendors that use Azure can offer solutions to customers around the world. Azure Marketplace is a gallery that consists of hundreds of complex, multiresource templates from first-party and third-party vendors. Within minutes, customers can deploy and start using platform as a service (PaaS) and software as a service (SaaS) applications. 

Although the Marketplace provides a great way for customers to quickly deploy an offering, the customer is responsible for maintaining and updating the solution. Beyond the virtual machine image billing, vendors can't charge customers for the use of an application. Furthermore, vendors can't prevent customers from modifying critical application resources. Vendors also can't block access to intellectual property that makes up an application. Azure managed applications provide solutions for these concerns. 

A managed application is similar to a solution template in the Marketplace, with one key difference. In a managed application, the resources are provisioned to a resource group that's managed by the vendor. The resource group is present in the customer's subscription, but an identity in the vendor's tenant has access to the resource group.

## Advantages of managed applications

Managed service providers (MSPs), ISVs, and corporate central IT teams can use managed applications to deliver solutions through the Marketplace or the Service Catalog. Although customers deploy these managed applications in their subscriptions, they don't have to maintain, update, or service them. Because vendors manage and support the applications, customers don't have to develop application-specific domain knowledge to manage these applications. Customers can automatically acquire application updates without the need to worry about troubleshooting and diagnosing issues with the applications.

For vendors and providers, managed applications create a channel to sell infrastructure and software through the Marketplace. Managed applications also provide a way to attach services and operational support to Azure customers. Vendors can bill customers by using the Azure billing system. They can use templates to manage the lifecycle of deployed applications. These solutions are self-contained and sealed to the customer, so vendors can provide high-quality service. This approach benefits PaaS and SaaS vendors. It also helps corporate central platform teams and system integrators (SIs) who want to package and resell their solutions.

## Managed application types
Azure managed applications come in two types: Service Catalog and Marketplace.
 
### Service Catalog  

With the Service Catalog, customers can create a catalog of approved solutions for Azure to be used by people in their organization. Maintaining such a catalog of solutions is helpful for central IT teams in enterprises. They can use the catalog to ensure compliance with certain organizational standards while they provide solutions for their organizations. They can control, update, and maintain these applications. Employees can use the catalog to easily discover the rich set of applications that are recommended and approved by their IT departments. Customers see the Service Catalog managed applications that they created. They also can see the managed applications that other people in their organization share with them.
 
For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](managed-application-publishing.md).
 
For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
 
### Marketplace

Managed applications are available through the Marketplace in the Azure portal. After the vendor publishes these applications, they're available for everyone inside or outside an organization to consume. With this approach, MSPs, ISVs, and SIs can offer their solutions to all Azure customers. Customers get the benefit of using these complex solutions without the need to invest in understanding and maintaining the solutions. 

Currently, publishers can make their offers available as a managed application or as a solution template that's unmanaged. The main components of publishing a managed application include the template file and the UI definition file. The template file describes the resources that are provisioned. The UI definition file describes how the required inputs for provisioning these resources are displayed in the portal. The required files are packaged in a .zip file and uploaded through the publishing portal.
 
For information about publishing a managed application to the Marketplace, see [Azure managed applications in the Marketplace](managed-application-author-marketplace.md).

For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).

## Key concepts

### Managed resource group
The managed resource group is where all the Azure resources that are provisioned in the template are created. For example, if the application is used to create a storage account, this resource group contains the storage account resource. It doesn't contain the application resource.

### Application package
The publisher creates a package that contains the template file and the createUIDefinition file. Specifically, it contains the following files:

- **mainTemplate.json**: This template file defines all the resources that are provisioned by the application. This file is a regular template file that's used to create resources.

- **createUIDefinition.json**: This file describes how the UI needed for the parameters defined in the template is rendered.

### Authorization
The publisher must specify the permissions required by the vendor to manage the resources on behalf of the customer. This permission applies to the managed resource group. Set the following values:

- **PrincipalID**: The Azure Active Directory (Azure AD) identifier of the user, group, or application that's used to grant access to the managed resource group. This identifier belongs to the publisher's tenant.

- **RoleDefinitionID**: The Azure AD identifier of the role assigned to the preceding principal ID. It can be any of the built-in Role-Based Access Control roles in the publisher's tenant. For more information, see [Built-in roles for Azure Role-Based Access Control](../active-directory/role-based-access-built-in-roles.md).

## Next steps

* For information about publishing managed applications to the Marketplace, see [Azure managed applications in the Marketplace](managed-application-author-marketplace.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](managed-application-publishing.md).
* For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
* To create a UI definition file, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
