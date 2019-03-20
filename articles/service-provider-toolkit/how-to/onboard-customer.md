---
title: Onboard a customer to Azure Delegated Resource Management
description: Learn how to onboard a customer to Azure Delegated Resource Management, allowing their resources to be accessed and managed through your own tenant. 
author: JnHs
ms.author: jenhayes
ms.service: service-provider-toolkit
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# Onboard a customer to Azure Delegated Resource Management

This article explains how you, as a service provider, can onboard a customer to Azure Delegated Resource Management, allowing their resources to be accessed and managed through your own tenant. While we’ll refer to service providers and customers here, enterprises managing multiple tenants can use the same process to consolidate their management experience.

You can repeat this process if you are managing resources for multiple customers. Then, when an authorized user signs in to your own Azure AD tenant, that user can be authorized across customer tenancy scopes to perform management operations without having to log in to every individual customer tenant.

> [!NOTE]
> Customers can be onboarded automatically when they purchase a managed services offer that you published to Azure Marketplace. For more info, see [Publish Managed Services offers to Azure Marketplace](publish-managed-services-offers.md).

The onboarding process requires actions to be taken from within both the service provider’s tenant and from the customer’s tenant. All of these steps are described in this article. Once the onboarding process 
