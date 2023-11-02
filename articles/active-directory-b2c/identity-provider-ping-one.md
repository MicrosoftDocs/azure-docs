---
title: Set up sign-up and sign-in with a PingOne account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with PingOne accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/2/2021
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a PingOne account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]


## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create a PingOne application

To enable sign-in for users with a PingOne (Ping Identity) account in Azure Active Directory B2C (Azure AD B2C), you need to create an application in the Ping Identity Administrator Console. For more information, see [Adding or updating an OIDC application](https://docs.pingidentity.com/access/sources/dita/topic?resourceid=p14e_add_update_oidc_application) in the Ping Identity documentation. If you don't already have a PingOne account, you can sign up at [`https://admin.pingone.com/web-portal/register`](https://admin.pingone.com/web-portal/register).

1. Sign in to the Ping Identity Administrator Console with your PingOne account credentials.
1. In the left menu of the page, select **Connections**, then next to **Applications**, select **+**.
1. On the **New Application** page, select **web app**, then under **OIDC**, select **Configure**.
1. Enter an **Application name**, and select **Next**.
1. For the **Redirect URLs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-domain-name` with your custom domain, and `your-tenant-name` with the name of your tenant. Use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C. 
1. Select **Save and Continue**.
1. Under **SCOPES** select **email**, and **profile**, then select **Save and Continue**.
1. Under **OIDC attributes** page, select **Save and Close**.
1. From the list of applications, select the application you created.
1. In the application **Profile** page, do the following:
    1. Next to the application name enable the app using the switch button.
    1. Copy the values of **Client ID**.
1. Select the **Configuration** tab, and do the following:
    1. Copy the **OIDC discovery endpoint**.
    1. Show and copy the **Client secret**.
    1. Change the mode to **edit**. Then, under the **Token endpoint authentication method** change the value to **Client Secret Post**, and select **Save**

::: zone pivot="b2c-user-flow"

## Configure PingOne as an identity provider

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *PingOne*.
1. For **Metadata url**, enter the *OIDC DISCOVERY ENDPOINT* that you previously recorded. For example:

    ```
    https://auth.pingone.eu/00000000-0000-0000-0000-000000000000/as/.well-known/openid-configuration
    ```

1. For **Client ID**, enter the client ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For **Scope**, enter `openid email profile`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `pingone.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.

## Add PingOne identity provider to a user flow 

At this point, the PingOne identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the PingOne identity provider to a user flow:


1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the PingOne identity provider.
1. Under the **Social identity providers**, select **PingOne**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **PingOne** to sign in with PingOne account.

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
1. Enter a **Name** for the policy key. For example, `PingOneSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter your client secret that you previously recorded.
1. For **Key usage**, select `Signature`.
1. Click **Create**.

## Configure PingOne as an identity provider

To enable users to sign in using a PingOne account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a PingOne account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>pingone.com</Domain>
      <DisplayName>PingOne</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="PingOne-OpenIdConnect">
          <DisplayName>Ping Identity</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="METADATA">Your PingOne OIDC discovery endpoint</Item>
            <Item Key="client_id">Your PingOne client ID</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid email profile</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_PingOneSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
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

4. Set the `METADATA` metadata to your PingOne OIDC discovery endpoint.
5. Set `client_id` metadata to your PingOne client ID.
6. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="PingOneExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="PingOneExchange" TechnicalProfileReferenceId="PingOne-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **PingOne** to sign in with PingOne account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

Learn how to [pass a PingOne token to your application](idp-pass-through-user-flow.md).
