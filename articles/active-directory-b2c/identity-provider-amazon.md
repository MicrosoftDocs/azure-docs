---
title: Set up sign-up and sign-in with an Amazon account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Amazon accounts in your applications using Azure Active Directory B2C.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.custom: project-no-code
ms.date: 09/16/2021
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create an app in the Amazon developer console

To enable sign-in for users with an Amazon account in Azure Active Directory B2C (Azure AD B2C), you need to create an application in [Amazon Developer Services and Technologies](https://developer.amazon.com). For more information, see [Register for Login with Amazon](https://developer.amazon.com/docs/login-with-amazon/register-web.html). If you don't already have an Amazon account, you can sign up at [https://www.amazon.com/](https://www.amazon.com/).

1. Sign in to the [Amazon Developer Console](https://developer.amazon.com/dashboard) with your Amazon account credentials.
1. If you have not already done so, select **Sign Up**, follow the developer registration steps, and then accept the policy.
1. From the Dashboard, select **Login with Amazon**.
1. Select **Create a New Security Profile**.
1. Enter a **Security Profile Name**, **Security Profile Description**, and **Consent Privacy Notice URL**, for example `https://www.contoso.com/privacy` The privacy notice URL is a page you manage that provides privacy information to users. Then click **Save**.
1. In the **Login with Amazon Configurations** section, select the **Security Profile Name** you created, select the **Manage** icon, and then select **Web Settings**.
1. In the **Web Settings** section, copy the values of **Client ID**. Select **Show Secret** to get the client secret, and then copy it. You need both values to configure an Amazon account as an identity provider in your tenant. **Client Secret** is an important security credential.
1. In the **Web Settings** section, select **Edit**. 
    1. In **Allowed Origins**, enter `https://your-tenant-name.b2clogin.com`. Replace `your-tenant-name` with the name of your tenant. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name`.
    1.  **Allowed Return URLs** , enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`.  If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`.  Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain.
1. Select **Save**.

::: zone pivot="b2c-user-flow"

## Configure Amazon as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Amazon**.
1. Enter a **Name**. For example, *Amazon*.
1. For the **Client ID**, enter the Client ID of the Amazon application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.

## Add Amazon identity provider to a user flow 

At this point, the Amazon identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Amazon identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Amazon identity provider.
1. Under the **Social identity providers**, select **Amazon**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Amazon** to sign in with Amazon account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `AmazonSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter your client secret that you previously recorded.
1. For **Key usage**, select `Signature`.
1. Click **Create**.

## Configure Amazon as an identity provider

To enable users to sign in using a Amazon account, you need to define the account as a claims provider. that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define an Amazon account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.


1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>amazon.com</Domain>
      <DisplayName>Amazon</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Amazon-OAuth2">
        <DisplayName>Amazon</DisplayName>
        <Protocol Name="OAuth2" />
        <Metadata>
          <Item Key="ProviderName">amazon</Item>
          <Item Key="authorization_endpoint">https://www.amazon.com/ap/oa</Item>
          <Item Key="AccessTokenEndpoint">https://api.amazon.com/auth/o2/token</Item>
          <Item Key="ClaimsEndpoint">https://api.amazon.com/user/profile</Item>
          <Item Key="scope">profile</Item>
          <Item Key="HttpBinding">POST</Item>
          <Item Key="UsePolicyInRedirectUri">false</Item>
          <Item Key="client_id">Your Amazon application client ID</Item>
        </Metadata>
        <CryptographicKeys>
          <Key Id="client_secret" StorageReferenceId="B2C_1A_AmazonSecret" />
        </CryptographicKeys>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="user_id" />
          <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
          <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
          <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="amazon.com" />
          <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
        </OutputClaims>
          <OutputClaimsTransformations>
          <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
          <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
          <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
        </OutputClaimsTransformations>
        <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Set **client_id** to the application ID from the application registration.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="AmazonExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="AmazonExchange" TechnicalProfileReferenceId="Amazon-OAuth2" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Amazon** to sign in with Amazon account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end
