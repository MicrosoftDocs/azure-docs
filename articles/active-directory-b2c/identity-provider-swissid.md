---
title: Set up sign-up and sign-in with a SwissID account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with SwissID accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: garrodonnell
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/07/2021
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a SwissID account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

In this article, you learn how to provide sign-up and sign-in to customers with [SwissID](https://www.swissid.ch/) accounts in your applications using Azure Active Directory B2C (Azure AD B2C). You add the SwissID to your user flows or custom policy using OpenID Connect protocol. For more information, see [SwissID Integration Guidelines – OpenID Connect](https://www.swissid.ch/dam/jcr:471f63c6-606e-4c04-be02-afc99f4d2612).

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create a SwissID application

To enable sign-in for users with a SwissID account in Azure AD B2C, you need to create an application. To create SwissID application, follow these steps:

1. Contact [SwissID Business Partner support](https://www.swissid.ch/en/b2c-kontakt.html).
1. After the sign up with SwissID, provide information about your Azure AD B2C tenant:


    |Key  |Note  |
    |---------|---------|
    |Redirect URI     | Provide the `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` URI. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain. |
    |Token endpoint authentication method|  `client_secret_post`|


1. After the app is registered, the following information will be provided by the SwissID. Use this information to configure your user flow, or custom policy.


    |Key  |Note  |
    |---------|---------|
    | Environment| The SwissID OpenId well-known configuration endpoint. For example, `https://login.sandbox.pre.swissid.ch/idp/oauth2/.well-known/openid-configuration`. |
    | Client ID | The SwissID client ID. For example, `11111111-2222-3333-4444-555555555555`. |
    | Password| The SwissID client secret.| 


::: zone pivot="b2c-user-flow"

## Configure SwissID as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *SwissID*.
1. For **Metadata url**, enter the URL SwissID OpenId well-known configuration endpoint. For example:

    ```http
    https://login.sandbox.pre.swissid.ch/idp/oauth2/.well-known/openid-configuration
    ```

1. For **Client ID**, enter the SwissID Client ID.
1. For **Client secret**, enter the SwissID client secret.
1. For the **Scope**, enter the `openid profile email`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `swissid.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.

## Add SwissID identity provider to a user flow 

At this point, the SwissID identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the SwissID identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the SwissID identity provider.
1. Under the **Social identity providers**, select **SwissID**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **SwissID** to sign in with SwissID account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the client secret that you received from SwissID in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `SwissIDSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your SwissID client secret.
9. For **Key usage**, select `Signature`.
10. Click **Create**.

## Configure SwissID as an identity provider

To enable users to sign in using a SwissID account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a SwissID account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>SwissID.com</Domain>
      <DisplayName>SwissID</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="SwissID-OpenIdConnect">
          <DisplayName>SwissID</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="METADATA">https://login.sandbox.pre.swissid.ch/idp/oauth2/.well-known/openid-configuration</Item>
            <Item Key="client_id">Your Swiss client ID</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile email</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_SwissIDSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="email" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateDisplayName" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Set **client_id** to the SwissID client ID.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="SwissIDExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="SwissIDExchange" TechnicalProfileReferenceId="SwissID-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **SwissID** to sign in with SwissID account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.


::: zone-end

## Move to production

SwissID IdP provides Pre-production and Production environments. The configuration described in this article uses the pre-production environment. To use the production environment, follow these steps:

1. Contact SwissId support for a production environment.
1. Update your user flow or custom policy with the URI of the well-known configuration endpoint. 

## Next steps

Learn how to [pass SwissID token to your application](idp-pass-through-user-flow.md).
