---
title: Set up sign-up and sign-in with a Twitter account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 07/20/2022
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]
::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create an application

To enable sign-in for users with a Twitter account in Azure AD B2C, you need to create a Twitter application. If you don't already have a Twitter account, you can sign up at [`https://twitter.com/signup`](https://twitter.com/signup). You also need to [Apply for a developer account](https://developer.twitter.com/). For more information, see [Apply for access](https://developer.twitter.com/en/apply-for-access).

::: zone pivot="b2c-custom-policy"
1. Sign in to the [Twitter Developer Portal](https://developer.twitter.com/portal/projects-and-apps) with your Twitter account credentials.
1. Select **+ Create Project** button. 
1. Under **Project name** tab, enter a preferred name of your project, and then select **Next** button.
1. Under **Use case** tab, select your preferred use case, and then select **Next**. 
1. Under **Project description** tab, enter your project description, and then select **Next** button. 
1. Under **App name** tab, enter a name for your app, such as *azureadb2c*, and the select **Next** button.
1. Under **Keys & Tokens** tab, copy the value of **API Key** and **API Key Secret**. You will use these for configuration later. 
1. Select **App settings** to open the app settings. 
1. At the lower part of the page, under **User authentication settings**, select **Set up**. 
1. Under **Type of app**, select your appropriate app type such as *Web App*. 
1. Under **App Info**:
    1. For the **Callback URI/Redirect URL**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/your-policy-id/oauth1/authresp`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/your-user-flow-Id/oauth1/authresp`. Use all lowercase letters when entering your tenant name and user flow ID even if they are defined with uppercase letters in Azure AD B2C. Replace:
        - `your-tenant-name` with the name of your tenant name.
        - `your-domain-name` with your custom domain.
        - `your-policy-id` with the identifier of your user flow. For example, `b2c_1a_signup_signin_twitter`.  
    1. For the **Website URL**, enter `https://your-tenant.b2clogin.com`. Replace `your-tenant` with the name of your tenant. For example, `https://contosob2c.b2clogin.com`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name`.
    1. (Optional) Enter a URL for the **Terms of service**, for example `http://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. (Optional) Enter a URL for the **Privacy policy**, for example `http://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
1. Select **Save**. 
 ::: zone-end


::: zone pivot="b2c-user-flow"

1. Sign in to the [Twitter Developer Portal](https://developer.twitter.com/portal/projects-and-apps) with your Twitter account credentials.
1. Select **+ Create Project** button. 
1. Under **Project name** tab, enter a preferred name of your project, and then select **Next** button.
1. Under **Use case** tab, select your preferred use case, and then select **Next**. 
1. Under **Project description** tab, enter your project description, and then select **Next** button. 
1. Under **App name** tab, enter a name for your app, such as *azureadb2c*, and the select **Next** button.
1. Under **Keys & Tokens** tab, copy the value of **API Key** and **API Key Secret** for later. You use both of them to configure Twitter as an identity provider in your Azure AD B2C tenant. 
1. Select **App settings** to open the app settings. 
1. At the lower part of the page, under **User authentication settings**, select **Set up**.
1. Under **Type of app**, select your appropriate app type such as *Web App*. 
1. Under **App Info**:
    1. For the **Callback URI/Redirect URL**, enter `https://your-tenant.b2clogin.com/your-tenant-name.onmicrosoft.com/your-user-flow-name/oauth1/authresp`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/your-user-flow-Id/oauth1/authresp`. Use all lowercase letters when entering your tenant name and user flow ID even if they are defined with uppercase letters in Azure AD B2C. Replace:
        - `your-tenant-name` with the name of your tenant name.
        - `your-domain-name` with your custom domain.
        - `your-user-flow-name` with the identifier of your user flow. For example, `b2c_1_signup_signin_twitter`. 
    1. For the **Website URL**, enter `https://your-tenant.b2clogin.com`. Replace `your-tenant` with the name of your tenant. For example, `https://contosob2c.b2clogin.com`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name`.
    1. Enter a URL for the **Terms of service**, for example `http://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. Enter a URL for the **Privacy policy**, for example `http://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
1. Select **Save**. 
 
::: zone-end

::: zone pivot="b2c-user-flow"

## Configure Twitter as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant. 
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Twitter**.
1. Enter a **Name**. For example, *Twitter*.
1. For the **Client ID**, enter the *API Key* of the Twitter application that you created earlier.
1. For the **Client secret**, enter the *API key secret* that you recorded.
1. Select **Save**.

## Add Twitter identity provider to a user flow 

At this point, the Twitter identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Twitter identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Select the user flow that you want to add the Twitter identity provider.
1. Under the **Social identity providers**, select **Twitter**.
1. Select **Save**.

## Test your User Flow

1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Twitter** to sign in with Twitter account.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the secret key that you previously recorded for Twitter app in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. 
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. On the left menu, under **Policies**, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `TwitterSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. For **Secret**, enter your *API key secret* value that you previously recorded.
1. For **Key usage**, select `Signature`.
1. Click **Create**.

## Configure Twitter as an identity provider

To enable users to sign in using a Twitter account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a Twitter account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy. Refer to the custom policy starter pack that you downloaded in the Prerequisites of this article.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>twitter.com</Domain>
      <DisplayName>Twitter</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Twitter-OAuth1">
          <DisplayName>Twitter</DisplayName>
          <Protocol Name="OAuth1" />
          <Metadata>
            <Item Key="ProviderName">Twitter</Item>
            <Item Key="authorization_endpoint">https://api.twitter.com/oauth/authenticate</Item>
            <Item Key="access_token_endpoint">https://api.twitter.com/oauth/access_token</Item>
            <Item Key="request_token_endpoint">https://api.twitter.com/oauth/request_token</Item>
            <Item Key="ClaimsEndpoint">https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true</Item>
            <Item Key="ClaimsResponseFormat">json</Item>
            <Item Key="client_id">Your Twitter application API key</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_TwitterSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="user_id" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="screen_name" />
            <OutputClaim ClaimTypeReferenceId="email" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="twitter.com" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Replace the value of **client_id** with the *API key* that you previously recorded.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="TwitterExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="TwitterExchange" TechnicalProfileReferenceId="Twitter-OAuth1" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Twitter** to sign in with Twitter account.
::: zone-end

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

> [!TIP]
>  If you're facing `unauthorized` error while testing this identity provider, make sure you use the correct Twitter API Key and API Key Secret, or try to apply for [elevated](https://developer.twitter.com/en/portal/products/elevated) access. Also, we recommend you've a look at [Twitter's projects structure](https://developer.twitter.com/en/docs/projects/overview), if you registered your app before the feature was available.
