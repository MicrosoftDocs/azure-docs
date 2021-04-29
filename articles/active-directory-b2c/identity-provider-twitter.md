---
title: Set up sign-up and sign-in with a Twitter account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/06/2021
ms.custom: project-no-code
ms.author: mimart
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

To enable sign-in for users with a Twitter account in Azure AD B2C, you need to create a Twitter application. If you don't already have a Twitter account, you can sign up at [https://twitter.com/signup](https://twitter.com/signup). You also need to [Apply for a developer account](https://developer.twitter.com/en/apply/user.html). For more information, see [Apply for access](https://developer.twitter.com/en/apply-for-access).

1. Sign in to the [Twitter Developer Portal](https://developer.twitter.com/portal/projects-and-apps) with your Twitter account credentials.
1. Under **Standalone Apps**, select **+Create App**.
1. Enter an **App name**, and then select **Complete**.
1. Copy the value of the **App key**, and **API key secret**.  You use both of them to configure Twitter as an identity provider in your tenant. 
1. Under **Setup your App**, select **App settings**.
1. Under **Authentication settings**, select **Edit**
    1. Select **Enable 3-legged OAuth** checkbox.
    1. Select **Request email address from users** checkbox.
    1. For the **Callback URLs**, enter `https://your-tenant.b2clogin.com/your-tenant-name.onmicrosoft.com/your-user-flow-Id/oauth1/authresp`.  If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/your-user-flow-Id/oauth1/authresp`. Use all lowercase letters when entering your tenant name and user flow ID even if they are defined with uppercase letters in Azure AD B2C. Replace:
        - `your-tenant-name` with the name of your tenant name.
        - `your-domain-name` with your custom domain.
        - `your-user-flow-Id` with the identifier of your user flow. For example, `b2c_1a_signup_signin_twitter`. 
    
    1. For the **Website URL**, enter `https://your-tenant.b2clogin.com`. Replace `your-tenant` with the name of your tenant. For example, `https://contosob2c.b2clogin.com`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name`.
    1. Enter a URL for the **Terms of service**, for example `http://www.contoso.com/tos`. The policy URL is a page you maintain to provide terms and conditions for your application.
    1. Enter a URL for the **Privacy policy**, for example `http://www.contoso.com/privacy`. The policy URL is a page you maintain to provide privacy information for your application.
    1. Select **Save**.

::: zone pivot="b2c-user-flow"

## Configure Twitter as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
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
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Twitter** to sign in with Twitter account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the secret key that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `TwitterSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your client secret that you previously recorded.
9. For **Key usage**, select `Encryption`.
10. Click **Create**.

## Configure Twitter as an identity provider

To enable users to sign in using a Twitter account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a Twitter account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

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

4. Replace the value of **client_id** with the *API key secret* that you previously recorded.
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

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end
