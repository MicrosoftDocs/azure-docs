---
title: Set up sign-in for a Microsoft Entra organization
titleSuffix: Azure AD B2C
description: Set up sign-in for a specific Microsoft Entra organization in Azure Active Directory B2C.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 02/07/2023
ms.author: godonnell
ms.subservice: B2C
ms.custom: fasttrack-edit, project-no-code
zone_pivot_groups: b2c-policy-type
---

# Set up sign-in for a specific Microsoft Entra organization in Azure Active Directory B2C

This article shows you how to enable sign-in for users from a specific Microsoft Entra organization using a user flow in Azure AD B2C.

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

### Verify the application's publisher domain
As of November 2020, new application registrations show up as unverified in the user consent prompt unless [the application's publisher domain is verified](../active-directory/develop/howto-configure-publisher-domain.md) ***and*** the company’s identity has been verified with the Microsoft Partner Network and associated with the application. ([Learn more](../active-directory/develop/publisher-verification-overview.md) about this change.) Note that for Azure AD B2C user flows, the publisher’s domain appears only when using a [Microsoft account](../active-directory-b2c/identity-provider-microsoft-account.md) or other Microsoft Entra tenant as the identity provider. To meet these new requirements, do the following:

1. [Verify your company identity using your Microsoft Partner Network (MPN) account](/partner-center/verification-responses). This process verifies information about your company and your company’s primary contact.
1. Complete the publisher verification process to associate your MPN account with your app registration using one of the following options:
   - If the app registration for the Microsoft account identity provider is in a Microsoft Entra tenant, [verify your app in the App Registration portal](../active-directory/develop/mark-app-as-publisher-verified.md).
   - If your app registration for the Microsoft account identity provider is in an Azure AD B2C tenant, [mark your app as publisher verified using Microsoft Graph APIs](../active-directory/develop/troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) (for example, using Graph Explorer). The UI for setting an app’s verified publisher is currently disabled for Azure AD B2C tenants.

<a name='register-an-azure-ad-app'></a>

## Register a Microsoft Entra app

To enable sign-in for users with a Microsoft Entra account from a specific Microsoft Entra organization, in Azure Active Directory B2C (Azure AD B2C), you need to create an application in the [Azure portal](https://portal.azure.com). For more information, see [Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Microsoft Entra ID tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Microsoft Entra ID**. 
1. In the left menu, under **Manage**, select **App registrations**.
1. Select **+ New registration**.
1. Enter a **Name** for your application. For example, `Azure AD B2C App`.
1. Accept the default selection of **Accounts in this organizational directory only (Default Directory only - Single tenant)** for this application.
1. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`.

    If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-domain-name` with your custom domain, and `your-tenant-name` with the name of your tenant.

1. Select **Register**. Record the **Application (client) ID** for use in a later step.
1. Select **Certificates & secrets**, and then select **New client secret**.
1. Enter a **Description** for the secret, select an expiration, and then select **Add**. Record the **Value** of the secret for use in a later step.

::: zone pivot="b2c-user-flow"

<a name='configure-azure-ad-as-an-identity-provider'></a>

## Configure Microsoft Entra ID as an identity provider

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso Microsoft Entra ID*.
1. For **Metadata url**, enter the following URL replacing `{tenant}` with the domain name of your Microsoft Entra tenant:

    ```
    https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration
    ```

 For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`. If you use a custom domain, replace `contoso.com` with your custom domain in `https://login.microsoftonline.com/contoso.com/v2.0/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret value that you previously recorded.
1. For **Scope**, enter `openid profile`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `contoso.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *oid*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.

<a name='add-azure-ad-identity-provider-to-a-user-flow-'></a>

## Add Microsoft Entra identity provider to a user flow 

At this point, the Microsoft Entra identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the Microsoft Entra identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Microsoft Entra identity provider.
1. Under **Settings**, select **Identity providers**
1. Under **Custom identity providers**, select **Contoso Microsoft Entra ID**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`. 
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Contoso Microsoft Entra ID** to sign in with Microsoft Entra Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the application key that you created in your Azure AD B2C tenant.

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `ContosoAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_ContosoAppSecret*.
1. In **Secret**, enter your client secret value that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.

<a name='configure-azure-ad-as-an-identity-provider'></a>

## Configure Microsoft Entra ID as an identity provider

To enable users to sign in using a Microsoft Entra account, you need to define Microsoft Entra ID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Microsoft Entra ID as a claims provider by adding Microsoft Entra ID to the **ClaimsProvider** element in the extension file of your policy.

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

To get a token from the Microsoft Entra endpoint, you need to define the protocols that Azure AD B2C should use to communicate with Microsoft Entra ID. This is done inside the **TechnicalProfile** element of  **ClaimsProvider**.

1. Update the ID of the **TechnicalProfile** element. This ID is used to refer to this technical profile from other parts of the policy, for example `AADContoso-OpenIdConnect`.
1. Update the value for **DisplayName**. This value will be displayed on the sign-in button on your sign-in screen.
1. Update the value for **Description**.
1. Microsoft Entra ID uses the OpenID Connect protocol, so make sure that the value for **Protocol** is `OpenIdConnect`.
1. Set value of the **METADATA** to `https://login.microsoftonline.com/tenant-name.onmicrosoft.com/v2.0/.well-known/openid-configuration`, where `tenant-name` is your Microsoft Entra tenant name. For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`
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
1. From the sign-up or sign-in page, select **Contoso Employee** to sign in with Microsoft Entra Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

### [Optional] Configuring optional claims

If you want to get the `family_name` and `given_name` claims from Microsoft Entra ID, you can configure optional claims for your application in the Azure portal UI or application manifest. For more information, see [How to provide optional claims to your Microsoft Entra app](../active-directory/develop/optional-claims.md).

1. Sign in to the [Azure portal](https://portal.azure.com) using your organizational Microsoft Entra tenant. Or if you're already signed in, make sure you're using the directory that contains your organizational Microsoft Entra tenant (for example, Contoso):
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    2. On the **Portal settings | Directories + subscriptions** page, find your Microsoft Entra directory in the **Directory name** list, and then select **Switch**. 
1. In the Azure portal, search for and select **Microsoft Entra ID**.
1. In the left menu, under **Manage**, select **App registrations**.
1. Select the application you want to configure optional claims for in the list, such as `Azure AD B2C App`. 
1. From the **Manage** section, select **Token configuration**.
1. Select **Add optional claim**.
1. For the **Token type**, select **ID**.
1. Select the optional claims to add, `family_name` and `given_name`.
1. Select **Add**. If **Turn on the Microsoft Graph profile permission (required for claims to appear in token)** appears, enable it, and then select **Add** again.

## [Optional] Verify your app authenticity

[Publisher verification](../active-directory/develop/publisher-verification-overview.md) helps your users understand the authenticity of the app you [registered](#register-an-azure-ad-app). A verified app means that the publisher of the app has [verified](/partner-center/verification-responses) their identity using their Microsoft Partner Network (MPN). Learn how to [mark your app as publisher verified](../active-directory/develop/mark-app-as-publisher-verified.md). 

## Next steps

Learn how to [pass the Microsoft Entra token to your application](idp-pass-through-user-flow.md).
