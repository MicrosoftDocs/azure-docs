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
ms.date: 12/07/2020
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

::: zone pivot="b2c-user-flow"

* [Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application.
* If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md).

::: zone-end

::: zone pivot="b2c-custom-policy"

* Complete the steps in the [Get started with custom policies in Active Directory B2C](custom-policy-get-started.md).
* If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md).

::: zone-end

## Create a Facebook application

To use a Facebook account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a Facebook account, you can sign up at [https://www.facebook.com/](https://www.facebook.com/).

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
1. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. Select **Save Changes** at the bottom of the page.
1. To make your Facebook application available to Azure AD B2C, select the Status selector at the top right of the page and turn it **On** to make the Application public, and then select **Switch Mode**.  At this point, the Status should change from **Development** to **Live**.

::: zone pivot="b2c-user-flow"

## Configure a Facebook account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Facebook**.
1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the App ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Add Facebook as an identity provider

1. In the `SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`** file, replace the value of `client_id` with the Facebook application ID:

   ```xml
   <TechnicalProfile Id="Facebook-OAUTH">
     <Metadata>
     <!--Replace the value of client_id in this technical profile with the Facebook app ID"-->
       <Item Key="client_id">00000000000000</Item>
   ```

::: zone-end

::: zone pivot="b2c-user-flow"

## Add Facebook identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to the Facebook identity provider.
1. Under the **Social identity providers**, select **Facebook**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**

::: zone-end

::: zone pivot="b2c-custom-policy"

## Upload and test the policy

Update the relying party (RP) file that initiates the user journey that you created.

1. Upload the *TrustFrameworkExtensions.xml* file to your tenant.
1. Under **Custom policies**, select **B2C_1A_signup_signin**.
1. For **Select Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run now** and select Facebook to sign in with Facebook and test the custom policy.

::: zone-end
