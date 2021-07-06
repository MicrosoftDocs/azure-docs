---
title: Set up sign-in for an Azure AD organization
titleSuffix: Azure AD B2C
description: Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/17/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit, project-no-code
zone_pivot_groups: b2c-policy-type
---

# Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C

This article shows you how to enable sign-in for users from a specific Azure AD organization using a user flow in Azure AD B2C.

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Register an Azure AD app

To enable sign-in for users with an Azure AD account from a specific Azure AD organization, in Azure Active Directory B2C (Azure AD B2C), you need to create an application in [Azure portal](https://portal.azure.com). For more information, see [Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your organizational Azure AD tenant (for example, contoso.com). Select the **Directory + subscription filter** in the top menu, and then choose the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, `Azure AD B2C App`.
1. Accept the default selection of **Accounts in this organizational directory only** for this application.
1. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`.

    If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-domain-name` with your custom domain, and `your-tenant-name` with the name of your tenant.

1. Select **Register**. Record the **Application (client) ID** for use in a later step.
1. Select **Certificates & secrets**, and then select **New client secret**.
1. Enter a **Description** for the secret, select an expiration, and then select **Add**. Record the **Value** of the secret for use in a later step.

### Configuring optional claims

If you want to get the `family_name` and `given_name` claims from Azure AD, you can configure optional claims for your application in the Azure portal UI or application manifest. For more information, see [How to provide optional claims to your Azure AD app](../active-directory/develop/active-directory-optional-claims.md).

1. Sign in to the [Azure portal](https://portal.azure.com) using your organizational Azure AD tenant. Search for and select **Azure Active Directory**.
1. From the **Manage** section, select **App registrations**.
1. Select the application you want to configure optional claims for in the list.
1. From the **Manage** section, select **Token configuration**.
1. Select **Add optional claim**.
1. For the **Token type**, select **ID**.
1. Select the optional claims to add, `family_name` and `given_name`.
1. Click **Add**.

## [Optional] Verify your app authenticity

[Publisher verification](../active-directory/develop/publisher-verification-overview.md) helps your users understand the authenticity of the app you [registered](#register-an-azure-ad-app). A verified app means that the publisher of the app has [verified](/partner-center/verification-responses) their identity using their Microsoft Partner Network (MPN). Learn how to [mark your app as publisher verified](../active-directory/develop/mark-app-as-publisher-verified.md). 

::: zone pivot="b2c-user-flow"

## Configure Azure AD as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso Azure AD*.
1. For **Metadata url**, enter the following URL replacing `{tenant}` with the domain name of your Azure AD tenant:

    ```
    https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration
    ```

    For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`.
    For example, `https://login.microsoftonline.com/contoso.com/v2.0/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For **Scope**, enter `openid profile`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `contoso.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *oid*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *preferred_username*

1. Select **Save**.

## Add Azure AD identity provider to a user flow 

At this point, the Azure AD identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Azure AD identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Azure AD identity provider.
1. Under the **Social identity providers**, select **Contoso Azure AD**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`. 
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Contoso Azure AD** to sign in with Azure AD Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the application key that you created in your Azure AD B2C tenant.

1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription filter** in the top menu, and then choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `ContosoAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_ContosoAppSecret*.
1. In **Secret**, enter your client secret that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.

## Configure Azure AD as an identity provider

To enable users to sign in using an Azure AD account, you need to define Azure AD as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Azure AD as a claims provider by adding Azure AD to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml* file.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:
    ```xml
    <ClaimsProvider>
      <Domain>Contoso</Domain>
      <DisplayName>Login using Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="AADContoso-OpenIdConnect">
          <DisplayName>Contoso Employee</DisplayName>
          <Description>Login with your Contoso account</Description>
          <Protocol Name="OpenIdConnect"/>
          <Metadata>
            <Item Key="METADATA">https://login.microsoftonline.com/tenant-name.onmicrosoft.com/v2.0/.well-known/openid-configuration</Item>
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_ContosoAppSecret"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="oid"/>
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid"/>
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin"/>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Under the **ClaimsProvider** element, update the value for **Domain** to a unique value that can be used to distinguish it from other identity providers. For example `Contoso`. You don't put a `.com` at the end of this domain setting.
5. Under the **ClaimsProvider** element, update the value for **DisplayName** to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

To get a token from the Azure AD endpoint, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the **TechnicalProfile** element of  **ClaimsProvider**.

1. Update the ID of the **TechnicalProfile** element. This ID is used to refer to this technical profile from other parts of the policy, for example `AADContoso-OpenIdConnect`.
1. Update the value for **DisplayName**. This value will be displayed on the sign-in button on your sign-in screen.
1. Update the value for **Description**.
1. Azure AD uses the OpenID Connect protocol, so make sure that the value for **Protocol** is `OpenIdConnect`.
1. Set value of the **METADATA** to `https://login.microsoftonline.com/tenant-name.onmicrosoft.com/v2.0/.well-known/openid-configuration`, where `tenant-name` is your Azure AD tenant name. For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`
1. Set **client_id** to the application ID from the application registration.
1. Under **CryptographicKeys**, update the value of **StorageReferenceId** to the name of the policy key that you created earlier. For example, `B2C_1A_ContosoAppSecret`.


[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="AzureADContosoExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="AzureADContosoExchange" TechnicalProfileReferenceId="AADContoso-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Contoso Employee** to sign in with Azure AD Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

Learn how to [pass the Azure AD token to your application](idp-pass-through-user-flow.md).
