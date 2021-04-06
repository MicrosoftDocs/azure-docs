---
title: Set up sign-up and sign-in with a Facebook account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Facebook accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/17/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a Facebook account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create a Facebook application

To enable sign-in for users with a Facebook account in Azure Active Directory B2C (Azure AD B2C), you need to create an application in [Facebook App Dashboard](https://developers.facebook.com/). For more information, see [App Development](https://developers.facebook.com/docs/development). If you don't already have a Facebook account, you can sign up at [https://www.facebook.com/](https://www.facebook.com/).

1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
1. If you have not already done so, you need to register as a Facebook developer. To do this, select **Get Started** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
1. Select **My Apps** and then **Create App**.
1. Select **Build Connected Experiences**.
1. Enter a **Display Name** and a valid **Contact Email**.
1. Select **Create App ID**. This may require you to accept Facebook platform policies and complete an online security check.
1. Select **Settings** > **Basic**.
    1. Choose a **Category**, for example `Business and Pages`. This value is required by Facebook, but not used for Azure AD B2C.
    1. Enter a URL for the **Terms of Service URL**, for example `http://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. Enter a URL for the **Privacy Policy URL**, for example `http://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
1. At the bottom of the page, select **Add Platform**, and then select **Website**.
1. In **Site URL**, enter the address of your website, for example `https://contoso.com`. 
1. Select **Save Changes**.
1. At the top of the page, copy the value of **App ID**.
1. Select **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
1. From the menu, select the **plus** sign next to **PRODUCTS**. Under the **Add Products to Your App**, select **Set up** under **Facebook Login**.
1. From the menu, select **Facebook Login**, select **Settings**.
1. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain. 
1. Select **Save Changes** at the bottom of the page.
1. To make your Facebook application available to Azure AD B2C, select the Status selector at the top right of the page and turn it **On** to make the Application public, and then select **Switch Mode**.  At this point, the Status should change from **Development** to **Live**.

::: zone pivot="b2c-user-flow"

## Configure Facebook as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Facebook**.
1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the App ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.

## Add Facebook identity provider to a user flow 

At this point, the Facebook identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Facebook identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Facebook identity provider.
1. Under the **Social identity providers**, select **Facebook**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Facebook** to sign in with Facebook account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.


::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the App Secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `FacebookSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your App Secret that you previously recorded.
9. For **Key usage**, select `Signature`.
10. Click **Create**.

## Configure a Facebook account as an identity provider

1. In the `SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`** file, replace the value of `client_id` with the Facebook application ID:

   ```xml
   <TechnicalProfile Id="Facebook-OAUTH">
     <Metadata>
     <!--Replace the value of client_id in this technical profile with the Facebook app ID"-->
       <Item Key="client_id">00000000000000</Item>
   ```

## Upload and test the policy

Update the relying party (RP) file that initiates the user journey that you created.

1. Upload the *TrustFrameworkExtensions.xml* file to your tenant.
1. Under **Custom policies**, select **B2C_1A_signup_signin**.
1. For **Select Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Facebook** to sign in with Facebook account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

Learn how to [pass Facebook token to your application](idp-pass-through-user-flow.md).
