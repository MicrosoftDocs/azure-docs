---
title: Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Azure AD B2C accounts from another tenant in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/11/2023
ms.author: godonnell
ms.subservice: B2C
ms.custom: fasttrack-edit, project-no-code
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Overview

This article describes how to set up a federation with another Azure AD B2C tenant. When your applications are protected with your Azure AD B2C, this allows users from other Azure AD B2C’s to login with their existing accounts. In the following diagram, users are able to sign in to an application protected by *Contoso*’s Azure AD B2C, with an account managed by *Fabrikam*’s Azure AD B2C tenant. In this case, user account must be present in *Fabrikam*’s tenant before an application protected by *Contoso*’s Azure AD B2C can attempt to sign in. 

![Azure AD B2C federation with another Azure AD B2C tenant](./media/identity-provider-azure-ad-b2c/azure-ad-b2c-federation.png)


## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

### Verify the application's publisher domain
As of November 2020, new application registrations show up as unverified in the user consent prompt unless [the application's publisher domain is verified](../active-directory/develop/howto-configure-publisher-domain.md) ***and*** the company’s identity has been verified with the Microsoft Partner Network and associated with the application. ([Learn more](../active-directory/develop/publisher-verification-overview.md) about this change.) Note that for Azure AD B2C user flows, the publisher’s domain appears only when using a [Microsoft account](../active-directory-b2c/identity-provider-microsoft-account.md) or other Microsoft Entra tenant as the identity provider. To meet these new requirements, do the following:

1. [Verify your company identity using your Microsoft Partner Network (MPN) account](/partner-center/verification-responses). This process verifies information about your company and your company’s primary contact.
1. Complete the publisher verification process to associate your MPN account with your app registration using one of the following options:
   - If the app registration for the Microsoft account identity provider is in a Microsoft Entra tenant, [verify your app in the App Registration portal](../active-directory/develop/mark-app-as-publisher-verified.md).
   - If your app registration for the Microsoft account identity provider is in an Azure AD B2C tenant, [mark your app as publisher verified using Microsoft Graph APIs](../active-directory/develop/troubleshoot-publisher-verification.md#making-microsoft-graph-api-calls) (for example, using Graph Explorer). The UI for setting an app’s verified publisher is currently disabled for Azure AD B2C tenants.

## Create an Azure AD B2C application

To enable sign-in for users with an account from another Azure AD B2C tenant (for example, Fabrikam), in your Azure AD B2C (for example, Contoso):

1. Create a [user flow](tutorial-create-user-flows.md?pivots=b2c-user-flow), or a [custom policy](tutorial-create-user-flows.md?pivots=b2c-custom-policy).
1. Then create an application in the Azure AD B2C, as describe in this section. 

To create an application.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your other Azure AD B2C tenant (for example, Fabrikam.com).
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *ContosoApp*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
1. Under **Redirect URI**, select **Web**, and then enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant (for example, Contoso).

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.

    If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-domain-name` with your custom domain, and `your-tenant-name` with the name of your tenant.

1. Under Permissions, select the **Grant admin consent to openid and offline_access permissions** check box.
1. Select **Register**.
1. In the **Azure AD B2C - App registrations** page, select the application you created, for example *ContosoApp*.
1. Record the **Application (client) ID** shown on the application Overview page. You need this when you configure the identity provider in the next section.
1. In the left menu, under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value**. You need this when you configure the identity provider in the next section.


::: zone pivot="b2c-user-flow"

## Configure Azure AD B2C as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains the Azure AD B2C tenant you want to configure the federation (for example, Contoso). Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Fabrikam*.
1. For **Metadata url**, enter the following URL replacing `{tenant}` with the domain name of your Azure AD B2C tenant (for example, Fabrikam). Replace the `{policy}` with the policy name you configure in the other tenant:

    ```
    https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/B2C_1_susi/v2.0/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For the **Scope**, enter the `openid`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter the domain name you want to use for the [direct sign-in](direct-signin.md#redirect-sign-in-to-a-social-provider). For example, *fabrikam.com*.
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.

## Add Azure AD B2C identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Azure AD B2C identity provider.
1. Under the **Social identity providers**, select **Fabrikam**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Fabrikam** to sign in with the other Azure AD B2C tenant.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the application key that you created earlier in your Azure AD B2C tenant.

1. Make sure you're using the directory that contains the Azure AD B2C tenant you want to configure the federation (for example, Contoso). Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `FabrikamAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_FabrikamAppSecret*.
1. In **Secret**, enter your client secret that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.

## Configure Azure AD B2C as an identity provider

To enable users to sign in using an account from another Azure AD B2C tenant (Fabrikam), you need to define the other Azure AD B2C as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Azure AD B2C as a claims provider by adding Azure AD B2C to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml* file.
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:
    ```xml
    <ClaimsProvider>
      <Domain>fabrikam.com</Domain>
      <DisplayName>Federation with Fabrikam tenant</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="AzureADB2CFabrikam-OpenIdConnect">
        <DisplayName>Fabrikam</DisplayName>
        <Protocol Name="OpenIdConnect"/>
        <Metadata>
          <!-- Update the Client ID below to the Application ID -->
          <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
          <!-- Update the metadata URL with the other Azure AD B2C tenant name and policy name -->
          <Item Key="METADATA">https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration</Item>
          <Item Key="UsePolicyInRedirectUri">false</Item>
          <Item Key="response_types">code</Item>
          <Item Key="scope">openid</Item>
          <Item Key="response_mode">form_post</Item>
          <Item Key="HttpBinding">POST</Item>
        </Metadata>
        <CryptographicKeys>
          <Key Id="client_secret" StorageReferenceId="B2C_1A_FabrikamAppSecret"/>
        </CryptographicKeys>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
          <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
          <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
          <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
          <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
          <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss"  />
          <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
          <OutputClaim ClaimTypeReferenceId="otherMails" PartnerClaimType="emails"/>    
        </OutputClaims>
        <OutputClaimsTransformations>
          <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
          <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
          <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
        </OutputClaimsTransformations>
        <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin"/>
      </TechnicalProfile>
     </TechnicalProfiles>
    </ClaimsProvider>
    ```

1. Update the following XML elements with the relevant value:

    |XML element  |Value  |
    |---------|---------|
    |ClaimsProvider\Domain  | The domain name that is used for [direct sign-in](direct-signin.md?pivots=b2c-custom-policy#redirect-sign-in-to-a-social-provider). Enter the domain name you want to use in the direct sign-in. For example, *fabrikam.com*. |
    |TechnicalProfile\DisplayName|This value will be displayed on the sign-in button on your sign-in screen. For example, *Fabrikam*. |
    |Metadata\client_id|The application identifier of the identity provider. Update the Client ID with the Application ID you created earlier in the other Azure AD B2C tenant.|
    |Metadata\METADATA|A URL that points to an OpenID Connect identity provider configuration document, which is also known as OpenID well-known configuration endpoint. Enter the following URL replacing `{tenant}` with the domain name of the other Azure AD B2C tenant (Fabrikam). Replace the `{tenant}` with the policy name you configure in the other tenant, and `{policy]` with the policy name: `https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration`. For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/B2C_1_susi/v2.0/.well-known/openid-configuration`.|
    |CryptographicKeys| Update the value of **StorageReferenceId** to the name of the policy key that you created earlier. For example, `B2C_1A_FabrikamAppSecret`.| 
    

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="AzureADB2CFabrikamExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="AzureADB2CFabrikamExchange" TechnicalProfileReferenceId="AzureADB2CFabrikam-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]


## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Fabrikam** to sign in with the other Azure AD B2C tenant.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

Learn how to [pass the other Azure AD B2C token to your application](idp-pass-through-user-flow.md).
