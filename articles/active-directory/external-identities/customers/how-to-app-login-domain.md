---
title: Add and verify custom domain names in CIAM
description: Learn about how to add and verify custom domain names in your CIAM tenant.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/06/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to add and verify custom domain names in my CIAM tenant.
---
<!--   The content is based on https://learn.microsoft.com/en-us/azure/active-directory/enterprise-users/domains-manage and tested in a CIAM tenant.  -->

# Customize the domain name in your CIAM app sign-in

A domain name is an important part of the identifier for resources in many Azure Active Directory (Azure AD) deployments. It's part of a user name or email address for a user, part of the address for a group, and is sometimes part of the app ID URI for an application. The domain name of a resource in Azure AD can be owned by the Azure AD organization, also known as a tenant, that holds the resource. Only a Global Administrator can manage domains in Azure AD.

## Set the primary domain name for your Azure AD organization

When your organization is created, the initial domain name, such as ‘contoso.onmicrosoft.com,’ is also the primary domain name. The primary domain is the default domain name for a new user when you create a new user. Setting a primary domain name streamlines the process for an administrator to create new users in the portal. To change the primary domain name:

1. Make sure you're using the directory that contains your customer tenant. Select the **Directories + subscriptions** icon in the toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your customer directory in the Directory name list, and then select **Switch**.
1. Go to Azure **Active Directory** > **Custom domain names**.
1. Select the name of the domain that you want to be the primary domain.
1. Select the **Make primary** command. Confirm your choice when prompted.

You can change the primary domain name for your organization to be any verified custom domain that isn't federated. Changing the primary domain for your organization won't change the user name for any existing users.


## Next steps
- [Customize the branding and end-user experience](how-to-customize-branding-customers.md)




