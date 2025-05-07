---
title: How to manage user accounts in Azure API Management
description: Learn how to create or invite users and manage developer accounts in Azure API Management. View additional resources to use after creating a developer account.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/04/2024
ms.author: danlep
---
# How to manage user accounts in Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

In API Management, developers are the users of the APIs that you expose using API Management. This guide shows how to create and invite developers to use the APIs and products that you make available to them with your API Management instance. For information on managing user accounts programmatically, see the [User entity](/rest/api/apimanagement/user) documentation in the [API Management REST API](/rest/api/apimanagement/) reference.

## Prerequisites

* Complete tasks in this article: [Create an Azure API Management instance](get-started-create-service-instance.md).
* If you created your instance in a v2 tier, enable the developer portal. For more information, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create a new developer

To add a new user, follow the steps in this section:

1. In the left menu, under **Developer portal**, select **Users**.
1. Select **+ Add**.
1. Enter appropriate information for the user.
1. Select **Add**.

    :::image type="content" source="media/api-management-howto-create-or-invite-developers/api-management-create-developer.png" alt-text="Screenshot of adding a user in the portal.":::

By default, newly created developer accounts are **Active**, and associated with the **Developers** group. Developer accounts that are in an **Active** state can be used to access the developer portal and all of the APIs for which they have subscriptions. To associate the newly created developer with additional groups, see [How to associate groups with developers][How to associate groups with developers].

## Invite a developer

To invite a developer, follow the steps in this section:

1. In the left menu, under **Developer portal**, select **Users**.
1. Select **+ Invite**.
1. Enter appropriate information for the user, including the email address.
1. Select **Send invitation**.

When a developer is invited, by default an email is sent to the developer. This email is generated using a template and is customizable. For more information, see [Configure email templates][Configure email templates].

The developer can accept the invitation by following the instructions in the email. Once the invitation is accepted, the account becomes **Active**.

The invitation link is active for 2 days.

## Deactivate or reactivate a developer account

To deactivate a developer account in the **Active** state, select **Block**. To reactivate a blocked developer account, select **Activate**. A blocked developer account can't access the developer portal or call any APIs. To delete a user account, select **Delete**.

To block a user, follow the following steps.

1. In the left menu, under **Developer portal**, select **Users**.
1. Select the user that you want to block.
1. In the top bar, select **Block**.

## Reset a user password

When you create a developer account or a developer is invited, a password is set. You can send an email to a user to reset the password:

1. In the left menu, under **Developer portal**, select **Users**.
1. Select the user whose password you want to reset.
1. In the top bar, select **Reset password**.
1. To send a password reset email, select **Yes**.

Like the invitation email, this email is generated using a template and is customizable.

The developer can reset their password by following the instructions in the email.

To programmatically work with user accounts, see the User entity documentation in the [API Management REST API](/rest/api/apimanagement/) reference. To reset a user account password to a specific value, you can use the [Update a user](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-user-entity#UpdateUser) operation and specify the desired password.

## Related content

Once a developer account is created, you can associate it with roles and subscribe it to products and APIs. For more information, see [How to create and use groups][How to create and use groups].

[How to create and use groups]: api-management-howto-create-groups.md
[How to associate groups with developers]: api-management-howto-create-groups.md#associate-group-developer

[Get started with Azure API Management]: get-started-create-service-instance.md
[Create an API Management service instance]: get-started-create-service-instance.md
[Configure email templates]: api-management-howto-configure-notifications.md#email-templates
