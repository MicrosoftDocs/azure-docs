---
title: Recommended security practices
description: Managed services offers allow service providers to sell resource management offers to customers in Azure Marketplace.
author: JnHs
ms.service: lighthouse
ms.author: jenhayes
ms.date: 06/28/2019
ms.topic: overview
manager: carmonm
---

# Recommended security practices

When using Azure delegated resource management, it’s important to consider security and access control. Users in your tenant will have direct access to customer subscriptions and resource groups, so you’ll want to take steps to maintain your tenant’s security. You’ll also want to make sure you only allow the access that’s needed to effectively manage your customers’ resources. This topic provides recommendations to help you do so.

## Require Azure Multi-Factor Authentication

[Azure Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md)  (also known as two-step verification) helps prevent attackers from gaining access to an account by requiring multiple authentication steps. You should require Multi-Factor Authentication for all users in your service provider tenant, including any users who will have access to customer resources.

We suggest that you ask your customers to implement Azure Multi-Factor Authentication in their tenants as well.

## Assign permissions to groups, using the principle of least privilege

To make management easier, we recommend using Azure AD user groups for each role required to manage your customers’ resources. This lets you add or remove individual users to the group as needed, rather than assigning permissions directly to that user.

When creating your permission structure, be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job, helping to reduce the chance of inadvertent errors.

For example, you may want to use a structure like this:

|Group name  |Type  |principalId  |Role definition  |Role definition ID  |
|---------|---------|---------|---------|---------|
|Architects     |User group         |\<principalId\>         |Contributor         |b24988ac-6180-42a0-ab88-20f7382dd24c  |
|Assessment     |User group         |\<principalId\>         |Reader         |acdd72a7-3385-48ef-bd42-f606fba81ae7  |
|VM Specialists     |User group         |\<principalId\>         |VM Contributor         |9980e02c-c2be-4d73-94e8-173b1dc7cf3c  |
|Automation     |Service principal name (SPN)         |\<principalId\>         |Contributor         |b24988ac-6180-42a0-ab88-20f7382dd24c  |

## Next steps

- [Deploy Azure Multi-Factor Authentication](../../active-directory/authentication/howto-mfa-getstarted.md)
- Learn about the [cross-tenant management experience](cross-tenant-management-experience.md).
