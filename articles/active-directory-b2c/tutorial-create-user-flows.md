---
title: Tutorial - Create user flows - Azure Active Directory B2C
description: Follow this tutorial to learn how to create user flows in the Azure portal to enable sign up, sign in, and user profile editing for your applications in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 03/22/2021
ms.author: mimart
ms.subservice: B2C
---

# Tutorial: Create user flows in Azure Active Directory B2C

In your applications you may have [user flows](user-flow-overview.md) that enable users to sign up, sign in, or manage their profile. You can create multiple user flows of different types in your Azure Active Directory B2C (Azure AD B2C) tenant and use them in your applications as needed. User flows can be reused across applications.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a sign-up and sign-in user flow
> * Enable self-service password reset
> * Create a profile editing user flow


This tutorial shows you how to create some recommended user flows by using the Azure portal. If you're looking for information about how to set up a resource owner password credentials (ROPC) flow in your application, see [Configure the resource owner password credentials flow in Azure AD B2C](add-ropc-policy.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> We've changed the way we reference user flow versions. Previously, we offered V1 (production-ready) versions, and V1.1 and V2 (preview) versions. Now, we've consolidated user flows into **Recommended** (next-generation preview) and **Standard** (generally available) versions. All V1.1 and V2 legacy preview user flows are on a path to deprecation by **August 1, 2021**. For details, see [User flow versions in Azure AD B2C](user-flow-versions.md).

## Prerequisites

[Register your applications](tutorial-register-applications.md) that are part of the user flows you want to create.

## Create a sign-up and sign-in user flow

The sign-up and sign-in user flow handles both sign-up and sign-in experiences with a single configuration. Users of your application are led down the right path depending on the context.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

    ![B2C tenant, Directory and Subscription pane, Azure portal](./media/tutorial-create-user-flows/directory-subscription-pane.png)

1. In the Azure portal, search for and select **Azure AD B2C**.
1. Under **Policies**, select **User flows**, and then select **New user flow**.

    ![User flows page in portal with New user flow button highlighted](./media/tutorial-create-user-flows/signup-signin-user-flow.png)

1. On the **Create a user flow** page, select the **Sign up and sign in** user flow.

    ![Select a user flow page with Sign up and sign in flow highlighted](./media/tutorial-create-user-flows/select-user-flow-type.png)

1. Under **Select a version**, select **Recommended**, and then select **Create**. ([Learn more](user-flow-versions.md) about user flow versions.)

    ![Create user flow page in Azure portal with properties highlighted](./media/tutorial-create-user-flows/select-version.png)

1. Enter a **Name** for the user flow. For example, *signupsignin1*.
1. For **Identity providers**, select **Email signup**.
1. For **User attributes and claims**, choose the claims and attributes that you want to collect and send from the user during sign-up. For example, select **Show more**, and then choose attributes and claims for **Country/Region**, **Display Name**, and **Postal Code**. Click **OK**.

    ![Attributes and claims selection page with three claims selected](./media/tutorial-create-user-flows/signup-signin-attributes.png)

1. Click **Create** to add the user flow. A prefix of *B2C_1* is automatically prepended to the name.

### Test the user flow

1. Select the user flow you created to open its overview page, then select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**, and then select **Sign up now**.

    ![Run user flow page in portal with Run user flow button highlighted](./media/tutorial-create-user-flows/signup-signin-run-now.PNG)

1. Enter a valid email address, click **Send verification code**, enter the verification code that you receive, then select **Verify code**.
1. Enter a new password and confirm the password.
1. Select your country and region, enter the name that you want displayed, enter a postal code, and then click **Create**. The token is returned to `https://jwt.ms` and should be displayed to you.
1. You can now run the user flow again and you should be able to sign in with the account that you created. The returned token includes the claims that you selected of country/region, name, and postal code.

> [!NOTE]
> The "Run user flow" experience is not currently compatible with the SPA reply URL type using authorization code flow. To use the "Run user flow" experience with these kinds of apps, register a reply URL of type "Web" and enable the implicit flow as described [here](tutorial-register-spa.md).

## Enable self-service password reset

To enable [self-service password reset](add-password-reset-policy.md) for the sign-up or sign-in user flow:

1. Select the sign-up or sign-in user flow  you created.
1. Under **Settings** in the left menu, select **Properties**.
1. Under **Password complexity**, select **Self-service password reset**.
1. Select **Save**.

### Test the user flow

1. Select the user flow you created to open its overview page, then select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run user flow**.
1. From the sign-up or sign-in page, select **Forgot your password?**.
1. Verify the email address of the account that you previously created, and then select **Continue**.
1. You now have the opportunity to change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

## Create a profile editing user flow

If you want to enable users to edit their profile in your application, you use a profile editing user flow.

1. In the menu of the Azure AD B2C tenant overview page, select **User flows**, and then select **New user flow**.
1. On the **Create a user flow** page, select the **Profile editing** user flow. 
1. Under **Select a version**, select **Recommended**, and then select **Create**.
1. Enter a **Name** for the user flow. For example, *profileediting1*.
1. For **Identity providers**, select **Local Account SignIn**.
2. For **User attributes**, choose the attributes that you want the customer to be able to edit in their profile. For example, select **Show more**, and then choose both attributes and claims for **Display name** and **Job title**. Click **OK**.
3. Click **Create** to add the user flow. A prefix of *B2C_1* is automatically appended to the name.

### Test the user flow

1. Select the user flow you created to open its overview page, then select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**, and then sign in with the account that you previously created.
1. You now have the opportunity to change the display name and job title for the user. Click **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create a sign-up and sign-in user flow
> * Create a profile editing user flow
> * Create a password reset user flow

Next, learn how to use Azure AD B2C to sign in and sign up users in an application. Follow the ASP.NET web application linked below, or navigate to another application in the table of contents under **Authenticate users**.

> [!div class="nextstepaction"]
> [Tutorial: Enable authentication in a web application using Azure AD B2C >](tutorial-web-app-dotnet.md)
