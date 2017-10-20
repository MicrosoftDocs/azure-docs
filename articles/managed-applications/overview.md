---
title: Overview of Azure managed applications | Microsoft Docs
description: Describes the concepts for Azure managed applications
services: azure-resource-manager
author: tfitzmac
manager: timlt

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/20/2017
ms.author: tomfitz
---

# Azure managed applications overview

Azure managed applications enable you to offer cloud solutions that are easy for consumers to deploy and operate. You implement the infrastructure and provide ongoing support. To make a managed application available to all customers, publish it in the Azure marketplace. To make it available to only users in your organization, publish it to an internal catalog. 

A managed application is similar to a solution template in the Marketplace, with one key difference. In a managed application, the resources are provisioned to a resource group that's managed by the publisher of the app. The resource group is present in the consumer's subscription, but an identity in the publisher's tenant has access to the resource group. As the publisher, you specify the cost for ongoing support of the solution.

## Advantages of managed applications

Managed applications reduce barriers to consumers using your solutions. They do not need expertise in cloud infrastructure to use your solution. Consumers have limited access to the critical resources. They do not need to worry about making a mistake when managing it. 

Managed applications enable you to establish an ongoing relationship with your consumers. You define terms for managing the application, and all charges are handled through Azure billing.

Although customers deploy these managed applications in their subscriptions, they don't have to maintain, update, or service them. You can ensure that all customers are using approved versions. Customers don't have to develop application-specific domain knowledge to manage these applications. Customers automatically acquire application updates without the need to worry about troubleshooting and diagnosing issues with the applications. 

For IT teams, managed applications enable you to offer pre-approved solutions to users in the organization. You ensure these solutions are compliant with organizational standards.

## Key concepts

You can publish your managed application either externally or internally.

![Publish internally or externally](./media/overview/manage_app_options.png)

### Service catalog

The service catalog is an internal catalog of approved solutions for users in an organization. You use the catalog to ensure compliance with certain organizational standards while they providing solutions for the organizations. Employees use the catalog to easily discover the rich set of applications that are recommended and approved by their IT departments. They see the managed applications that other people in their organization share with them.

For information about publishing a Service Catalog managed application, see [Create service catalog application](publish-service-catalog-app.md).

### Marketplace

Vendors wishing to bill for their services can make a managed application available through the Azure marketplace. After the vendor publishes an application, it's available to users outside the organization. With this approach, managed service providers (MSPs), independent software vendors (ISVs), and system integrators (SIs) can offer their solutions to all Azure customers. 

For information about publishing a managed application to the Marketplace, see [Create marketplace application](publish-marketplace-app.md).

### Managed resource group

The managed resource group is where all the Azure resources that are provisioned in the template are created. For example, if the application is used to create a storage account, this resource group contains the storage account resource. It doesn't contain the application resource.

### Application package

The publisher creates a package that contains the template file and the createUIDefinition file. Specifically, it contains the following files:

- **mainTemplate.json**: This template file defines all the resources that are provisioned by the application. This file is a regular template file that's used to create resources.

- **createUIDefinition.json**: This file describes how the UI needed for the parameters defined in the template is rendered.

## Next steps

* For information about publishing managed applications to the Marketplace, see [Create marketplace application](publish-marketplace-app.md).
* For information about publishing an internal application, see [Create service catalog application](publish-service-catalog-app.md).

