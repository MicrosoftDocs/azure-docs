---
title: 'Quickstart: Create and assign a user account'
description: Create a user account in your Azure Active Directory tenant and assign it to an application.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 03/23/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: mode-other, enterprise-apps
#Customer intent: As an administrator of an Azure AD tenant, I want to assign a user to an enterprise application.
---

# Quickstart: Create and assign a user account

In this quickstart, you use the Azure portal to create a user account in your Azure Active Directory (Azure AD) tenant. After you create the account, you can assign it to the enterprise application that you added to your tenant.

It's recommended that you use a nonproduction environment to test the steps in this quickstart.

## Prerequisites

To create a user account and assign it to an enterprise application, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, or owner of the service principal.
- Completion of the steps in [Quickstart: Add an enterprise application](add-application-portal.md).

## Create a user account

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To create a user account in your Azure AD tenant:

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. Browse to **Azure Active Directory** and select **Users**.
1. Select **New user** at the top of the pane.

    :::image type="content" source="media/add-application-portal-assign-users/new-user.png" alt-text="Add a new user account to your Azure AD tenant.":::
    
1. In the **User name** field, enter the username of the user account. For example, `contosouser1@contoso.com`. Be sure to change `contoso.com` to the name of your tenant domain.
1. In the **Name** field, enter the name of the user of the account. For example, `contosouser1`.
1. Enter the details required for the user under the **Groups and roles**, **Settings**, and **Job info** sections.
1. Select **Create**.

## Assign a user account to an enterprise application

To assign a user account to an enterprise application:

1. Sign in to the [Azure portal](https://portal.azure.com), then browse to **Azure Active Directory** and select **Enterprise applications**.
1. Search for and select the application to which you want to assign the user account. For example, the application that you created in the previous quickstart named **Azure AD SAML Toolkit 1**.
1. In the left pane, select **Users and groups**, and then select **Add user/group**.

    :::image type="content" source="media/add-application-portal-assign-users/assign-user.png" alt-text="Assign user account to an application in your Azure AD tenant.":::

1. On the **Add Assignment** pane, select **None Selected** under **Users and groups**.
1. Search for and select the user that you want to assign to the application. For example, `contosouser1@contoso.com`.
1. Select **Select**.
1. On the **Add Assignment** pane, select **Assign** at the bottom of the pane.

## Clean up resources

If you're planning to complete the next quickstart, keep the application that you created. Otherwise, you can consider deleting it to clean up your tenant.

## Next steps

Learn how to set up single sign-on for an enterprise application.
> [!div class="nextstepaction"]
> [Enable single sign-on](what-is-single-sign-on.md)
