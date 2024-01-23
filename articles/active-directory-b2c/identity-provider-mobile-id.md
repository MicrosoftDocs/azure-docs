---
title: Set up sign-up and sign-in with Mobile ID 
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Mobile ID in your applications using Azure Active Directory B2C.

author: garrodonnell
manager: celestedg

ms.service: active-directory

ms.topic: how-to
ms.date: 04/08/2022
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with Mobile ID using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

In this article, you learn how to provide sign-up and sign-in to customers with [Mobile ID](https://www.mobileid.ch) in your applications using Azure Active Directory B2C (Azure AD B2C). The Mobile ID solution protects access to your company data and applications with a comprehensive end-to- end solution for a strong multi-factor authentication (MFA). You add the Mobile ID to your user flows or custom policy using OpenID Connect protocol. 

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create a Mobile ID application

To enable sign-in for users with Mobile ID in Azure AD B2C, you need to create an application. To create Mobile ID application, follow these steps:

1. Contact [Mobile ID support](https://www.mobileid.ch/en/contact).
1. Provide the Mobile ID the information about your Azure AD B2C tenant:


    |Key  |Note  |
    |---------|---------|
    |Redirect URI     | Provide the `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` URI. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain. |
    |Token endpoint authentication method|  `client_secret_post`|


1. After the app is registered, the following information will be provided by the Mobile ID. Use this information to configure your user flow, or custom policy.

    |Key  |Note  |
    |---------|---------|
    | Client ID | The Mobile ID client ID. For example, 11111111-2222-3333-4444-555555555555. |
    | Client Secret| The Mobile ID client secret.| 


::: zone pivot="b2c-user-flow"

## Configure Mobile ID as an identity provider

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Mobile ID*.
1. For **Metadata url**, enter the URL Mobile ID OpenId well-known configuration endpoint. For example:

    ```http
    https://openid.mobileid.ch/.well-known/openid-configuration
    ```

1. For **Client ID**, enter the Mobile ID Client ID.
1. For **Client secret**, enter the Mobile ID client secret.
1. For the **Scope**, enter the `openid, profile, phone, mid_profile`.
1. Leave the default values for **Response type** (`code`), and **Response mode** (`form_post`).
1. (Optional) For the **Domain hint**, enter `mobileid.ch`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Display name**: *name*


1. Select **Save**.

## Add Mobile ID identity provider to a user flow 

At this point, the Mobile ID identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Mobile ID identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Select the user flow that you want to add the Mobile ID identity provider.
1. Under the **Social identity providers**, select **Mobile ID**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Mobile ID** to sign in with Mobile ID.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the client secret that you received from Mobile ID in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `Mobile IDSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your Mobile ID client secret.
9. For **Key usage**, select `Signature`.
10. Select **Create**.

## Configure Mobile ID as an identity provider

To enable users to sign in using a Mobile ID, you need to define the Mobile ID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a Mobile ID as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
    <Domain>mobileid.ch</Domain>
    <DisplayName>Mobile-ID</DisplayName>
    <TechnicalProfiles>
      <TechnicalProfile Id="MobileID-OAuth2">
      <DisplayName>Mobile-ID</DisplayName>
      <Protocol Name="OAuth2" />
      <Metadata>
        <Item Key="ProviderName">Mobile-ID</Item>
         <Item Key="authorization_endpoint">https://m.mobileid.ch/oidc/authorize</Item>
          <Item Key="AccessTokenEndpoint">https://openid.mobileid.ch/token</Item>
          <Item Key="ClaimsEndpoint">https://openid.mobileid.ch/userinfo</Item>
          <Item Key="scope">openid, profile, phone, mid_profile</Item>
          <Item Key="HttpBinding">POST</Item>
          <Item Key="UsePolicyInRedirectUri">false</Item>
          <Item Key="token_endpoint_auth_method">client_secret_post</Item>
          <Item Key="BearerTokenTransmissionMethod">AuthorizationHeader</Item>
          <Item Key="client_id">Your application ID</Item>
        </Metadata>
        <CryptographicKeys>
          <Key Id="client_secret" StorageReferenceId="B2C_1A_MobileIdSecret" />
        </CryptographicKeys>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub"/>
          <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name"/>
          <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="mobileid.ch" />
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

4. Set **client_id** to the Mobile ID client ID.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="MobileIDExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="MobileIDExchange" TechnicalProfileReferenceId="MobileID-OAuth2" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Mobile ID** to sign in with Mobile ID.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.


::: zone-end

## Next steps

Learn how to [pass Mobile ID token to your application](idp-pass-through-user-flow.md).
