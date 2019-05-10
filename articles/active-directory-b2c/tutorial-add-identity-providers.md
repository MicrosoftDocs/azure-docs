---
title: Tutorial - Add identity providers to your applications - Azure Active Directory B2C | Microsoft Docs
description: Learn how to add identity providers to your applications in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: davidmu1
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 02/01/2019
ms.author: davidmu
ms.subservice: B2C
---

# Tutorial: Add identity providers to your applications in Azure Active Directory B2C

In your applications, you may want to enable users to sign in with different identity providers. An *identity provider* creates, maintains, and manages identity information while providing authentication services to applications. You can add identity providers that are supported by Azure Active Directory (Azure AD) B2C to your [user flows](active-directory-b2c-reference-policies.md) using the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Create the identity provider applications
> * Add the identity providers to your tenant
> * Add the identity providers to your user flow

You typically use only one identity provider in your applications, but you have the option to add more. This tutorial shows you how to add an Azure AD identity provider and a Facebook identity provider to your application. Adding both of these identity providers to your application is optional. You can also add other identity providers, such as [Amazon](active-directory-b2c-setup-amzn-app.md), [Github](active-directory-b2c-setup-github-app.md), [Google](active-directory-b2c-setup-goog-app.md), [LinkedIn](active-directory-b2c-setup-li-app.md), [Microsoft](active-directory-b2c-setup-msa-app.md), or [Twitter](active-directory-b2c-setup-twitter-app.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application. 

## Create applications

Identity provider applications provide the identifier and key to enable communication with your Azure AD B2C tenant. In this section of the tutorial, you create an Azure AD application and a Facebook application from which you get identifiers and keys to add the identity providers to your tenant. If you're adding just one of the identity providers, you only need to create the application for that provider.

### Create an Azure Active Directory application

To enable sign-in for users from Azure AD, you need to register an application within the Azure AD tenant. The Azure AD tenant is not the same as your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your Azure AD tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **New application registration**.
5. Enter a name for your application. For example, `Azure AD B2C App`.
6. For the **Application type**, select `Web app / API`.
7. For the **Sign-on URL**, enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```
    
    For example, `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
    
    All URLs should now be using [b2clogin.com](b2clogin.md).

8. Click **Create**. Copy the **Application ID** to be used later.
9. Select the application, and then select **Settings**.
10. Select **Keys**, enter the key description, select a duration, and then click **Save**. Copy the value of the key so that you can use it later in this tutorial.

### Create a Facebook application

To use a Facebook account as an identity provider in Azure AD B2C, you need to create an application at Facebook. If you don’t already have a Facebook account, you can get it at [https://www.facebook.com/](https://www.facebook.com/).

1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
2. If you haven't already done so, you need to register as a Facebook developer. To register, select **Register** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
3. Select **My Apps** and then click **Add a New App**. 
4. Enter a **Display Name** and a valid **Contact Email**.
5. Click **Create App ID**. You may be required to accept Facebook platform policies and complete an online security check.
6. Select **Settings** > **Basic**.
7. Choose a **Category**, for example `Business and Pages`. This value is required by Facebook, but not used for Azure AD B2C.
8. At the bottom of the page, select **Add Platform**, and then select **Website**.
9. In **Site URL**, enter `https://your-tenant-name.b2clogin.com/` replacing `your-tenant-name` with the name of your tenant. Enter a URL for the **Privacy Policy URL**, for example `http://www.contoso.com`. The policy URL is a page you maintain to provide privacy information for your application.
10. Select **Save Changes**.
11. At the top of the page, copy the value of **App ID**. 
12. Click **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
13. Select **Products**, and then select **Set up** under **Facebook Login**.
14. Select **Settings** under **Facebook Login**.
15. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. Click **Save Changes** at the bottom of the page.
16. To make your Facebook application available to Azure AD B2C, click the **Status** selector at the top right of the page and set it to **On**. Click **Confirm**. At this point, the Status should change from **Development** to **Live**.

## Add the identity providers

After you create the application for the identity provider that you want to add, you add the identity provider to your tenant.

### Add the Azure Active Directory identity provider

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your Azure AD B2C tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Identity providers**, and then select **Add**.
4. Enter a **Name**. For example, enter *Contoso Azure AD*.
5. Select **Identity provider type**, select **Open ID Connect (Preview)**, and then click **OK**.
6. Click **Set up this identity provider**
7. For **Metadata url**, enter the following URL replacing `your-AD-tenant-domain` with the domain name of your Azure AD tenant.

    ```
    https://login.microsoftonline.com/your-AD-tenant-domain/.well-known/openid-configuration
    ```

    For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration`.

8. For **Client ID**, enter the application ID that you previously recorded and for **Client secret**, enter the key value that you previously recorded.
9. Optionally, enter a value for **Domain_hint**. For example, `ContosoAD`. 
10. Click **OK**.
11. Select **Map this identity provider's claims** and set the following claims:
    
    - For **User ID**, enter `oid`.
    - For **Display Name**, enter `name`.
    - For **Given name**, enter `given_name`.
    - For **Surname**, enter `family_name`.
    - For **Email**, enter `unique_name`.

12. Click **OK**, and then click **Create** to save your configuration.

### Add the Facebook identity provider

1. Select **Identity providers**, and then select **Add**.
2. Enter a **Name**. For example, enter *Facebook*.
3. Select **Identity provider type**, select **Facebook**, and click **OK**.
4. Select **Set up this identity provider** and enter the App ID that you recorded earlier as the **Client ID**. Enter the App Secret that you recorded as the **Client secret**.
5. Click **OK** and then click **Create** to save your Facebook configuration.

## Update the user flow

In the tutorial that you completed as part of the prerequisites, you created a user flow for sign-up and sign-in named *B2C_1_signupsignin1*. In this section, you add the identity providers to the *B2C_1_signupsignin1* user flow.

1. Select **User flows (policies)**, and then select the *B2C_1_signupsignin1* user flow.
2. Select **Identity providers**, select the **Facebook** and **Contoso Azure AD** identity providers that you added.
3. Select **Save**.

### Test the user flow

1. On the Overview page of the user flow that you created, select **Run user flow**.
2. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
3. Click **Run user flow**, and then sign in with an identity provider that you previously added.
4. Repeat steps 1 through 3 for the other identity providers that you added.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create the identity provider applications
> * Add the identity providers to your tenant
> * Add the identity providers to your user flow

> [!div class="nextstepaction"]
> [Customize the user interface of your applications in Azure Active Directory B2C](tutorial-customize-ui.md)