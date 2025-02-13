---
title: Set up sign-in for multitenant Microsoft Entra ID using custom policies
titleSuffix: Azure AD B2C
description: Add a multitenant Microsoft Entra identity provider using custom policies in Azure Active Directory B2C.
author: garrodonnell
manager: CelesteDG
ms.service: azure-active-directory
ms.topic: how-to
ms.date: 11/16/2024
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: b2c
zone_pivot_groups: b2c-policy-type

#Customer Intent: As a developer using Azure Active Directory B2C, I want to set up sign-in for multi-tenant Microsoft Entra ID, so that users from multiple Entra tenants can sign in without configuring an identity provider for each tenant.


---

# Set up sign-in for multitenant Microsoft Entra ID using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

This article shows you how to enable sign-in for users using the multitenant endpoint for Microsoft Entra ID, allowing users from multiple Microsoft Entra tenants to sign in using Azure AD B2C, without you having to configure an identity provider for each tenant. However, guest members in any of these tenants **will not** be able to sign in. For that, you need to [individually configure each tenant](identity-provider-azure-ad-single-tenant.md).

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

> [!NOTE]
> In this article, it is assumed that the **SocialAndLocalAccounts** starter pack is used in the previous steps mentioned in the pre-requisite.  

## Register a Microsoft Entra app

To enable users to sign in to Azure AD B2C with a Microsoft Entra account, you first need to create an application in the Microsoft Entra tenant from the [Azure portal](https://portal.azure.com). For more information, see [Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Microsoft Entra tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, `Azure AD B2C App`.
1. Select **Accounts in any organizational directory (Any Microsoft Entra directory – Multitenant)** for this application.
1. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`.

    If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-domain-name` with your custom domain, and `your-tenant-name` with the name of your tenant.

1. Select **Register**. Record the **Application (client) ID** for use in a later step.
1. Select **Certificates & secrets**, and then select **New client secret**.
1. Enter a **Description** for the secret, select an expiration, and then select **Add**. Record the **Value** of the secret for use in a later step.

> [!NOTE]
> The client secret will not be shown again after this point. If you do not make a record of it, you will have to create a new one.

### [Optional] Configuring optional claims

If you want to get the `family_name`, and `given_name` claims from Microsoft Entra ID, you can configure optional claims for your application in the Azure portal UI or application manifest. For more information, see [How to provide optional claims to your Microsoft Entra app](../active-directory/develop/optional-claims.md).

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Microsoft Entra ID**.
1. From the **Manage** section, select **App registrations**.
1. Select the application you want to configure optional claims for in the list.
1. From the **Manage** section, select **Token configuration**.
1. Select **Add optional claim**.
1. For the **Token type**, select **ID**.
1. Select the optional claims to add, `family_name`, and `given_name`.
1. Select **Add**. If **Turn on the Microsoft Graph email permission (required for claims to appear in token)** appears, enable it, and then select **Add** again.

## [Optional] Verify your app authenticity

[Publisher verification](/entra/identity-platform/publisher-verification-overview) helps your users understand the authenticity of the app you registered. A verified app means that the publisher of the app has [verified](/partner-center/verification-responses) their identity using their Microsoft Partner Network (MPN). Learn how to [mark your app as publisher verified](/entra/identity-platform/mark-app-as-publisher-verified). 

## Create a policy key

You now need to store the application key that you created in your Azure AD B2C tenant.

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `AADAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_AADAppSecret*.
1. In **Secret**, enter your client secret that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.


## Configure Microsoft Entra ID as an identity provider

To enable users to sign in using a Microsoft Entra account, you need to define Microsoft Entra ID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Microsoft Entra ID as a claims provider by adding Microsoft Entra ID to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *SocialAndLocalAccounts/**TrustFrameworkExtensions.xml*** file (see the files you've used in the prerequisites).
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>commonaad</Domain>
      <DisplayName>Common AAD</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="AADCommon-OpenIdConnect">
          <DisplayName>Multi-Tenant AAD</DisplayName>
          <Description>Login with your Contoso account</Description>
          <Protocol Name="OpenIdConnect"/>
          <Metadata>
            <Item Key="METADATA">https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration</Item>
            <!-- Update the Client ID below to the Application ID -->
            <Item Key="client_id">00001111-aaaa-2222-bbbb-3333cccc4444</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
            <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
            <!-- The key below allows you to specify each of the Azure AD tenants that can be used to sign in. Update the GUIDs below for each tenant. -->
            <Item Key="ValidTokenIssuerPrefixes">https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000,https://login.microsoftonline.com/11111111-1111-1111-1111-111111111111</Item>
            <!-- The commented key below specifies that users from any tenant can sign-in. Uncomment if you would like anyone with an Azure AD account to be able to sign in. -->
            <!-- <Item Key="ValidTokenIssuerPrefixes">https://login.microsoftonline.com/</Item> -->
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_AADAppSecret"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="oid"/>
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

1. Under the **ClaimsProvider** element, update the value for **Domain** to a unique value that can be used to distinguish it from other identity providers.
1. Under the **TechnicalProfile** element, update the value for **DisplayName**, for example, `Multi-Tenant AAD`. This value is displayed on the sign-in button on your sign-in page.
1. Set **client_id** to the application ID of the Microsoft Entra multitenant application that you registered earlier.
1. Under **CryptographicKeys**, update the value of **StorageReferenceId** to the name of the policy key that you created earlier. For example, `B2C_1A_AADAppSecret`.

### Restrict access

Using `https://login.microsoftonline.com/` as the value for **ValidTokenIssuerPrefixes** allows all Microsoft Entra users to sign in to your application. Update the list of valid token issuers and restrict access to a specific list of Microsoft Entra tenant users who can sign in.

To obtain the values, look at the OpenID Connect discovery metadata for each of the Microsoft Entra tenants that you would like to have users sign in from. The format of the metadata URL is similar to `https://login.microsoftonline.com/your-tenant/v2.0/.well-known/openid-configuration`, where `your-tenant` is your Microsoft Entra tenant name. For example:

`https://login.microsoftonline.com/fabrikam.onmicrosoft.com/v2.0/.well-known/openid-configuration`

Perform these steps for each Microsoft Entra tenant that should be used to sign in:

1. Open your browser and go to the OpenID Connect metadata URL for the tenant. Find the `issuer` object and record its value. It should look similar to `https://login.microsoftonline.com/ aaaabbbb-0000-cccc-1111-dddd2222eeee/v2.0`.
1. Copy and paste the value into the **ValidTokenIssuerPrefixes** key. Separate multiple issuers with a comma. An example with two issuers appears in the previous `ClaimsProvider` XML sample.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="AzureADCommonExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="AzureADCommonExchange" TechnicalProfileReferenceId="AADCommon-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Common Microsoft Entra ID** to sign in with Microsoft Entra account.

To test the multitenant sign-in capability, perform the last two steps using the credentials for a user that exists with another Microsoft Entra tenant. Copy the **Run now endpoint** and open it in a private browser window, for example, Incognito Mode in Google Chrome or an InPrivate window in Microsoft Edge. Opening in a private browser window allows you to test the full user journey by not using any currently cached Microsoft Entra credentials.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## See also

- Learn how to [pass the Microsoft Entra token to your application](idp-pass-through-user-flow.md).
- Check out the Microsoft Entra multitenant federation [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/Identity-providers#azure-active-directory), and how to pass Microsoft Entra access token [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/Identity-providers#azure-active-directory-with-access-token)

::: zone-end
