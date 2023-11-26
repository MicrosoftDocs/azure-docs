---
title: Set up sign-up and sign-in with OpenID Connect
titleSuffix: Azure AD B2C
description: Set up sign-up and sign-in with any OpenID Connect identity provider (IdP) in Azure Active Directory B2C.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 12/28/2022
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with generic OpenID Connect using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]


[OpenID Connect](openid-connect.md) is an authentication protocol built on top of OAuth 2.0 that can be used for secure user sign-in. Most identity providers that use this protocol are supported in Azure AD B2C. 

This article explains how you can add custom OpenID Connect identity providers into your user flows.

[!INCLUDE [active-directory-b2c-https-cipher-tls-requirements](../../includes/active-directory-b2c-https-cipher-tls-requirements.md)]

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Add the identity provider

::: zone pivot="b2c-user-flow"

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso*.

::: zone-end

::: zone pivot="b2c-custom-policy"

Define the OpenId Connect identity provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>contoso.com</Domain>
      <DisplayName>Login with Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Contoso-OpenIdConnect">
          <DisplayName>Contoso</DisplayName>
          <Description>Login with your Contoso account</Description>
          <Protocol Name="OpenIdConnect"/>
          <Metadata>
            <Item Key="METADATA">https://your-identity-provider.com/.well-known/openid-configuration</Item>
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <!-- <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_ContosoSecret"/>
          </CryptographicKeys> -->
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="oid"/>
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid"/>
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
            <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="oid"/>
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

::: zone-end

## Configure the identity provider

Every OpenID Connect identity provider describes a metadata document that contains most of the information required to perform sign-in. The metadata document includes information such as the URLs to use and the location of the service's public signing keys. The OpenID Connect metadata document is always located at an endpoint that ends in `.well-known/openid-configuration`. For the OpenID Connect identity provider you are looking to add, enter its metadata URL.

::: zone pivot="b2c-user-flow"

In the **Metadata url**, enter the URL of the OpenID Connect metadata document.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Item Key="METADATA">` technical profile metadata, enter the URL of the OpenID Connect metadata document.

::: zone-end

## Client ID and secret

To allow users to sign in, the identity provider requires developers to register an application in their service. This application has an ID that is referred to as the **client ID** and a **client secret**. 

The client secret is optional. However, you must provide a client secret if the [Response type](#response-type) is `code`, which uses the secret to exchange the code for the token.

::: zone pivot="b2c-user-flow"

To add the client ID and client secret, copy these values from the identity provider and enter them into the corresponding fields.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Item Key="client_id">` technical profile metadata, enter the client ID.

### Create a policy key

If client secret is required, store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the portal toolbar.
3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
4. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
5. On the Overview page, select **Identity Experience Framework**.
6. Select **Policy Keys** and then select **Add**.
7. For **Options**, choose `Manual`.
8. Enter a **Name** for the policy key. For example, `ContosoSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
9. In **Secret**, enter your client secret that you previously recorded.
10. For **Key usage**, select `Signature`.
11. Click **Create**.
12. In the `CryptographicKeys` XML element, add the following element:
    
    ```xml
    <CryptographicKeys>
      <Key Id="client_secret" StorageReferenceId="B2C_1A_ContosoSecret"/>
    </CryptographicKeys>
    ```

::: zone-end

## Scope

Scope defines the information and permissions you are looking to gather from your identity provider, for example `openid profile`. In order to receive the ID token from the identity provider, the `openid` scope must be specified. 

Without the ID token, users are not able to sign in to Azure AD B2C using the custom identity provider. Other scopes can be appended separated by space. Refer to the custom identity provider's documentation to see what other scopes may be available.

::: zone pivot="b2c-user-flow"

In the **Scope**, enter the scopes from the identity provider. For example, `openid profile`.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Item Key="scope">` technical profile metadata, enter the scopes from the identity provider. For example, `openid profile`.

::: zone-end

## Response type

The response type describes what kind of information is sent back in the initial call to the `authorization_endpoint` of the custom identity provider. The following response types can be used:

* `code`: As per the [authorization code flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth), a code will be returned back to Azure AD B2C. Azure AD B2C proceeds to call the `token_endpoint` to exchange the code for the token.
* `id_token`: An ID token is returned back to Azure AD B2C from the custom identity provider.

::: zone pivot="b2c-user-flow"

In the **Response type**, select `code`, or `id_token`,  according to your identity provider settings.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Item Key="response_types">` technical profile metadata, select `code`, or `id_token` according to your identity provider settings.

::: zone-end

## Response mode

The response mode defines the method that should be used to send the data back from the custom identity provider to Azure AD B2C. The following response modes can be used:

* `form_post`: This response mode is recommended for best security. The response is transmitted via the HTTP `POST` method, with the code or token being encoded in the body using the `application/x-www-form-urlencoded` format.
* `query`: The code or token is returned as a query parameter.

::: zone pivot="b2c-user-flow"

In the **Response mode**, select `form_post`, or `query`,  according to your identity provider settings.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Item Key="response_mode">` technical profile metadata, select `form_post`, or `query`, according to your identity provider settings.

::: zone-end

## Domain hint

The [domain hint](direct-signin.md) can be used to skip directly to the sign in page of the specified identity provider, instead of having the user make a selection among the list of available identity providers. 

To allow this kind of behavior, enter a value for the domain hint. To jump to the custom identity provider, append the parameter `domain_hint=<domain hint value>` to the end of your request when calling Azure AD B2C for sign in.

::: zone pivot="b2c-user-flow"

In the **Domain hint**, enter a domain name used in the domain hint.

::: zone-end

::: zone pivot="b2c-custom-policy"

In the `<Domain>contoso.com</Domain>` technical profile XML element, enter a domain name used in the domain hint. For example, `contoso.com`.

::: zone-end

## Claims mapping

After the custom identity provider sends an ID token back to Azure AD B2C, Azure AD B2C needs to be able to map the claims from the received token to the claims that Azure AD B2C recognizes and uses. For each of the following mappings, refer to the documentation of the custom identity provider to understand the claims that are returned back in the identity provider's tokens:

::: zone pivot="b2c-user-flow"

* **User ID**: Enter the claim that provides the *unique identifier* for the signed-in user.
* **Display Name**: Enter the claim that provides the *display name* or *full name* for the user.
* **Given Name**: Enter the claim that provides the *first name* of the user.
* **Surname**: Enter the claim that provides the *last name* of the user.
* **Email**: Enter the claim that provides the *email address* of the user.


::: zone-end

::: zone pivot="b2c-custom-policy"

The `OutputClaims` element contains a list of claims returned by your identity provider. Map the name of the claim defined in your policy to the name defined in the identity provider. Under the `<OutputClaims>` element, configure the `PartnerClaimType` attribute with the corresponding claim name as defined by your identity provider. 

|ClaimTypeReferenceId  |PartnerClaimType  |
|---------|---------|
| `issuerUserId`| Enter the claim that provides the *unique identifier* for the signed-in user.|
| `displayName`| Enter the claim that provides the *display name* or *full name* for the user. |
| `givenName`| Enter the claim that provides the *first name* of the user.|
| `surName`| Enter the claim that provides the *last name* of the user.|
| `email`| Enter the claim that provides the *email address* of the user.|
| `identityProvider` | Enter the claim that provides the token issuer name. For example, `iss`. If the identity provider doesn't include the issuer claim in the token, set the `DefaultValue` attribute with a unique identifier of your identity provider. For example, `DefaultValue="contoso.com"`.|


::: zone-end

::: zone pivot="b2c-user-flow"

## Add the identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the identity provider. 
1. Under the **Social identity providers**, select the identity provider you added. For example, *Contoso*.
1. Select **Save**.

## Test your user flow

1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select the identity provider you want to sign-in. For example, *Contoso*.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="Contoso-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Contoso** to sign in with Google account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Known Issues
* Azure AD B2C does not support JWE (JSON Web Encryption) for exchanging encrypted tokens with OpenID connect identity providers. 

## Next steps

Find more information see the [OpenId Connect technical profile](openid-connect-technical-profile.md) reference guide.

::: zone-end
