---
title: Recommended security practices
description: When using Azure delegated resource management, it's important to consider security and access control.
ms.date: 03/24/2020
ms.topic: conceptual
---

# Recommended security practices

When using [Azure delegated resource management](azure-delegated-resource-management.md), it's important to consider security and access control. Users in your tenant will have direct access to customer subscriptions and resource groups, so you'll want to take steps to maintain your tenant's security. You'll also want to make sure you only allow the access that's needed to effectively manage your customers' resources. This topic provides recommendations to help you do so.

## Require Azure Multi-Factor Authentication

[Azure Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) (also known as two-step verification) helps prevent attackers from gaining access to an account by requiring multiple authentication steps. You should require Multi-Factor Authentication for all users in your service provider tenant, including any users who will have access to customer resources.

We suggest that you ask your customers to implement Azure Multi-Factor Authentication in their tenants as well.

## Assign permissions to groups, using the principle of least privilege

To make management easier, we recommend using Azure AD user groups for each role required to manage your customers' resources. This lets you add or remove individual users to the group as needed, rather than assigning permissions directly to that user.

> [!IMPORTANT]
> In order to add permissions for an Azure AD group, the **Group type** must be **Security** and not **Office 365**. This option is selected when the group is created. For more information, see [Create a basic group and add members using Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

When creating your permission structure, be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job, helping to reduce the chance of inadvertent errors.

For example, you may want to use a structure like this:

|Group name  |Type  |principalId  |Role definition  |Role definition ID  |
|---------|---------|---------|---------|---------|
|Architects     |User group         |\<principalId\>         |Contributor         |b24988ac-6180-42a0-ab88-20f7382dd24c  |
|Assessment     |User group         |\<principalId\>         |Reader         |acdd72a7-3385-48ef-bd42-f606fba81ae7  |
|VM Specialists     |User group         |\<principalId\>         |VM Contributor         |9980e02c-c2be-4d73-94e8-173b1dc7cf3c  |
|Automation     |Service principal name (SPN)         |\<principalId\>         |Contributor         |b24988ac-6180-42a0-ab88-20f7382dd24c  |

Once you've created these groups, you can assign users as needed. Only add the users who truly need to have access. Be sure to review group membership regularly and remove any users that are no longer appropriate or necessary to include.

Keep  in mind that when you [onboard customers through a public managed service offer](../how-to/publish-managed-services-offers.md), any group (or user or service principal) that you include will have the same permissions for every customer who purchases the plan. To assign different groups to work with each customer, you'll need to publish a separate private plan that is exclusive to each customer, or onboard customers individually by using Azure Resource Manager templates. For example, you could publish a public plan that has very limited access, then work with the customer directly to onboard their resources for additional access using a customized Azure Resource Template granting additional access as needed.


## Next steps

- [Deploy Azure Multi-Factor Authentication](../../active-directory/authentication/howto-mfa-getstarted.md).
- Learn about [cross-tenant management experiences](cross-tenant-management-experience.md).
