---
title: Set up basic authentication to developer portal
titleSuffix: Azure API Management
description: Learn how to set up user accounts with username and password authentication to the developer portal in Azure API Management.

author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 08/30/2022
ms.author: danlep
---

# Configure users of the developer portal to authenticate using usernames and passwords 

In the developer portal for Azure API Management, the default authentication method for users is to provide a username and password. In this article, learn how to set up users with basic authentication credentials to the developer portal.

For an overview of options to secure the developer portal, see [Secure access to the API Management developer portal](secure-developer-portal-access.md). 


## Prerequisites

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.

[!INCLUDE [premium-dev-standard.md](../../includes/api-management-availability-premium-dev-standard.md)]

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]


## Confirm the username and password provider

By default, the username and password *identity provider* is enabled in the developer portal. To confirm this setting:

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. In the **Provider type** list, confirm that **Username and password** appears.

If the provider isn't already enabled, you can add it:

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities** > **+ Add**.
1. Under **Type**, select **Username and password**, and then select **Add**.

## Add a username and password

There are two ways to add a username and password for authentication to the developer portal:

* An API publisher can add a user through the Azure portal, or with equivalent Azure tools such as the [New-AzApiManagementUser](/powershell/module/az.apimanagement/new-azapimanagementuser) Azure PowerShell cmdlet. For steps to use the portal, see [How to manage user accounts in Azure API Management](api-management-howto-create-or-invite-developers.md).

    :::image type="content" source="media/developer-portal-basic-authentication/add-user-portal.png" alt-text="Screenshot showing how to add a user in the Azure portal.":::    

* An API consumer (developer) can sign up directly in the developer portal, using the **Sign up** page.

    :::image type="content" source="media/developer-portal-basic-authentication/developer-portal-sign-up-page.png" alt-text="Screenshot of the sign-up page in the developer portal.":::

> [!NOTE]
> API Management enforces password strength requirements including password length. When you add a user in the Azure portal, the password must be at least 6 characters long. When a developer signs up or resets a password through the developer portal, the password must be at least 8 characters long.

## Delete the username and password provider

If you've configured another identity provider for the developer portal such as [Azure AD](api-management-howto-aad.md) or [Azure AD B2C](api-management-howto-aad-b2c.md), you might want to delete the username and password provider. 

Deleting the identity provider prevents adding users to use username and password authentication. Existing users configured for basic authentication are also prevented from signing into the developer portal.

1. In the left menu of your API Management instance, under **Developer portal**, select **Identities**.
1. In the **Provider type** list, select **Username and password**. In the context menu (**...**), select **Delete**.

> [!TIP]
> If you want to disable all sign up or sign in functionality in the developer portal, see [How do I disable sign up in the developer portal?](developer-portal-faq.md#how-do-i-disable-sign-up-in-the-developer-portal)


## Next steps

For steps to add other identity providers for developer sign-up to the developer portal, see:

- [Authorize developer accounts by using Azure Active Directory in Azure API Management](api-management-howto-aad.md)
- [Authorize developer accounts by using Azure Active Directory B2C in Azure API Management](api-management-howto-aad-b2c.md)