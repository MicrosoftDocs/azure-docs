---
title: Claim resolvers in custom policies
titleSuffix: Azure AD B2C
description: Learn how to use claims resolvers in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 02/16/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# About claim resolvers in Azure Active Directory B2C custom policies

Claim resolvers in Azure Active Directory B2C (Azure AD B2C) [custom policies](custom-policy-overview.md) provide context information about an authorization request, such as the policy name, request correlation ID, user interface language, and more.

To use a claim resolver in an input or output claim, you define a string **ClaimType**, under the [ClaimsSchema](claimsschema.md) element, and then you set the **DefaultValue** to the claim resolver in the input or output claim element. Azure AD B2C reads the value of the claim resolver and uses the value in the technical profile.

In the following example, a claim type named `correlationId` is defined with a **DataType** of `string`.

```xml
<ClaimType Id="correlationId">
  <DisplayName>correlationId</DisplayName>
  <DataType>string</DataType>
  <UserHelpText>Request correlation Id</UserHelpText>
</ClaimType>
```

In the technical profile, map the claim resolver to the claim type. Azure AD B2C populates the value of the claim resolver `{Context:CorrelationId}` into the claim `correlationId` and sends the claim to the technical profile.

```xml
<InputClaim ClaimTypeReferenceId="correlationId" DefaultValue="{Context:CorrelationId}" />
```

## Culture

The following table lists the claim resolvers with information about the language used in the authorization request:

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Culture:LanguageName} | The two letter ISO code for the language. | en |
| {Culture:LCID}   | The LCID of language code. | 1033 |
| {Culture:RegionName} | The two letter ISO code for the region. | US |
| {Culture:RFC5646} | The RFC5646 language code. | en-US |

Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver#culture) of the culture claim resolvers.

## Policy

The following table lists the claim resolvers with information about the policy used in the authorization request:

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Policy:PolicyId} | The relying party policy name. | B2C_1A_signup_signin |
| {Policy:RelyingPartyTenantId} | The tenant ID of the relying party policy. | your-tenant.onmicrosoft.com |
| {Policy:TenantObjectId} | The tenant object ID of the relying party policy. | 00000000-0000-0000-0000-000000000000 |
| {Policy:TrustFrameworkTenantId} | The tenant ID of the trust framework. | your-tenant.onmicrosoft.com |

Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver#policy) of the policy claim resolvers.

## Context

The following table lists the contextual claim resolvers of the authorization request:

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Context:BuildNumber} | The Identity Experience Framework version (build number).  | 1.0.507.0 |
| {Context:CorrelationId} | The correlation ID.  | 00000000-0000-0000-0000-000000000000 |
| {Context:DateTimeInUtc} |The date time in UTC.  | 10/10/2021 12:00:00 PM |
| {Context:DeploymentMode} |The policy deployment mode.  | Production |
| {Context:HostName} | The host name of the current request.  | contoso.b2clogin.com |
| {Context:IPAddress} | The user IP address. | 11.111.111.11 |
| {Context:KMSI} | Indicates whether [Keep me signed in](session-behavior.md?pivots=b2c-custom-policy#enable-keep-me-signed-in-kmsi) checkbox is selected. |  true |

Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver#context) of the context claim resolvers.

## Claims 

This section describes how to get a claim value as a claim resolver.

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Claim:claim type} | An identifier of a claim type already defined in the [ClaimsSchema](claimsschema.md) section in the policy file or parent policy file.  For example: `{Claim:displayName}`, or `{Claim:objectId}`. | A claim type value.|

## OpenID Connect

The following table lists the claim resolvers with information about the OpenID Connect authorization request:

| Claim | Description | Example |
| ----- | ----------- | --------|
| {OIDC:AuthenticationContextReferences} |The `acr_values` query string parameter. | N/A |
| {OIDC:ClientId} |The `client_id`  query string parameter. | 00000000-0000-0000-0000-000000000000 |
| {OIDC:DomainHint} |The `domain_hint`  query string parameter. | facebook.com |
| {OIDC:LoginHint} |  The `login_hint` query string parameter. | someone@contoso.com |
| {OIDC:MaxAge} | The `max_age`. | N/A |
| {OIDC:Nonce} |The `Nonce`  query string parameter. | defaultNonce |
| {OIDC:Password}| The [resource owner password credentials flow](add-ropc-policy.md) user's password.| password1| 
| {OIDC:Prompt} | The `prompt` query string parameter. | login |
| {OIDC:RedirectUri} |The `redirect_uri`  query string parameter. | https://jwt.ms |
| {OIDC:Resource} |The `resource`  query string parameter. | N/A |
| {OIDC:Scope} |The `scope`  query string parameter. | openid |
| {OIDC:Username}| The [resource owner password credentials flow](add-ropc-policy.md) user's username.| emily@contoso.com|

Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver#openid-connect-relying-party-application) of the OpenID Connect claim resolvers.

## OAuth2 key-value parameters

Any parameter name included as part of an OIDC or OAuth2 request can be mapped to a claim in the user journey. For example, the request from the application might include a query string parameter with a name of `app_session`, `loyalty_number`, or any custom query string.

| Claim | Description | Example |
| ----- | ----------------------- | --------|
| {OAUTH-KV:campaignId} | A query string parameter. | Hawaii |
| {OAUTH-KV:app_session} | A query string parameter. | A3C5R |
| {OAUTH-KV:loyalty_number} | A query string parameter. | 1234 |
| {OAUTH-KV:any custom query string} | A query string parameter. | N/A |

## SAML

The following table lists the claim resolvers  with information about the SAML authorization request:

| Claim | Description | Example |
| ----- | ----------- | --------|
| {SAML:AuthnContextClassReferences} | The `AuthnContextClassRef` element value, from the SAML request. | urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport |
| {SAML:NameIdPolicyFormat} | The `Format` attribute, from the `NameIDPolicy` element of the SAML request. | urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress |
| {SAML:Issuer} |  The SAML `Issuer` element value of the SAML request.| `https://contoso.com` |
| {SAML:AllowCreate} | The `AllowCreate` attribute value, from the `NameIDPolicy` element of the SAML request. | True |
| {SAML:ForceAuthn} | The `ForceAuthN` attribute value, from the `AuthnRequest` element of the SAML request. | True |
| {SAML:ProviderName} | The `ProviderName` attribute value, from the `AuthnRequest` element of the SAML request.| Contoso.com |
| {SAML:RelayState} | The `RelayState` query string parameter.| 
| {SAML:Subject} | The `Subject` from the NameId element of the SAML AuthN request.| 
| {SAML:Binding} | The `ProtocolBinding` attribute value, from the `AuthnRequest` element of the SAML request. | urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST |

Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver#saml-service-provider) of the SAML claim resolvers.

## OAuth2 identity provider

The following table lists the [OAuth2 identity provider](oauth2-technical-profile.md) claim resolvers:

| Claim | Description | Example |
| ----- | ----------------------- | --------|
| {oauth2:access_token} | The OAuth2 identity provider access token. The `access_token` attribute. | `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni...` |
| {oauth2:token_type}   | The type of the access token. The `token_type` attribute. | Bearer  |
| {oauth2:expires_in}   | The length of time that the access token is valid in seconds. The `expires_in` attribute. The output claim [DataType](claimsschema.md#datatype) must be `int` or `long`. | 960000 |
| {oauth2:refresh_token} | The OAuth2 identity provider refresh token. The `refresh_token` attribute. | `eyJraWQiOiJacW9pQlp2TW5pYVc2MUY...` |

To use the OAuth2 identity provider claim resolvers, set the output claim's `PartnerClaimType` attribute to the claim resolver.  The following example demonstrates how the get the external identity provider claims:

```xml
<ClaimsProvider>
  <DisplayName>Contoso</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Contoso-OAUTH">
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="identityProviderAccessToken" PartnerClaimType="{oauth2:access_token}" />
        <OutputClaim ClaimTypeReferenceId="identityProviderAccessTokenType" PartnerClaimType="{oauth2:token_type}" />
        <OutputClaim ClaimTypeReferenceId="identityProviderAccessTokenExpiresIn" PartnerClaimType="{oauth2:expires_in}" />
        <OutputClaim ClaimTypeReferenceId="identityProviderRefreshToken" PartnerClaimType="{oauth2:refresh_token}" />
      </OutputClaims>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Using claim resolvers

You can use claims resolvers with the following elements:

| Item | Element | Settings |
| ----- | ----------------------- | --------|
|Application Insights technical profile |`InputClaim` | |
|[Microsoft Entra](active-directory-technical-profile.md) technical profile| `InputClaim`, `OutputClaim`| 1, 2|
|[OAuth2](oauth2-technical-profile.md) technical profile| `InputClaim`, `OutputClaim`| 1, 2|
|[OpenID Connect](openid-connect-technical-profile.md) technical profile| `InputClaim`, `OutputClaim`| 1, 2|
|[Claims transformation](claims-transformation-technical-profile.md) technical profile| `InputClaim`, `OutputClaim`| 1, 2|
|[RESTful provider](restful-technical-profile.md) technical profile| `InputClaim`| 1, 2|
|[SAML identity provider](identity-provider-generic-saml.md)  technical profile| `OutputClaim`| 1, 2|
|[Self-Asserted](self-asserted-technical-profile.md) technical profile| `InputClaim`, `OutputClaim`| 1, 2|
|[ContentDefinition](contentdefinitions.md)| `LoadUri`| |
|[ContentDefinitionParameters](relyingparty.md#contentdefinitionparameters)| `Parameter` | |
|[RelyingParty](relyingparty.md#technicalprofile) technical profile| `OutputClaim`| 2 |

Settings:
1. The `IncludeClaimResolvingInClaimsHandling` metadata must be set to `true`.
1. The input or output claims attribute `AlwaysUseDefaultValue` must be set to `true`.

## Claim resolvers samples

### RESTful technical profile

In a [RESTful](restful-technical-profile.md) technical profile, you may want to send the user language, policy name, scope, and client ID. Based on the claims the REST API can run custom business logic, and if necessary raise a localized error message.

The following example shows a RESTful technical profile with this scenario:

```xml
<TechnicalProfile Id="REST">
  <DisplayName>Validate user input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app.azurewebsites.net/api/identity</Item>
    <Item Key="AuthenticationType">None</Item>
    <Item Key="SendClaimsIn">Body</Item>
    <Item Key="IncludeClaimResolvingInClaimsHandling">true</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userLanguage" DefaultValue="{Culture:LCID}" AlwaysUseDefaultValue="true" />
    <InputClaim ClaimTypeReferenceId="policyName" DefaultValue="{Policy:PolicyId}" AlwaysUseDefaultValue="true" />
    <InputClaim ClaimTypeReferenceId="scope" DefaultValue="{OIDC:Scope}" AlwaysUseDefaultValue="true" />
    <InputClaim ClaimTypeReferenceId="clientId" DefaultValue="{OIDC:ClientId}" AlwaysUseDefaultValue="true" />
  </InputClaims>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

### Direct sign-in

Using claim resolvers, you can prepopulate the sign-in name or direct sign-in to a specific social identity provider, such as Facebook, LinkedIn, or a Microsoft account. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md).

### Dynamic UI customization

Azure AD B2C enables you to pass query string parameters to your HTML content definition endpoints to dynamically render the page content. For example, this feature allows the ability to modify the background image on the Azure AD B2C sign-up or sign-in page based on a custom parameter that you pass from your web or mobile application. For more information, see [Dynamically configure the UI by using custom policies in Azure Active Directory B2C](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri). You can also localize your HTML page based on a language parameter, or you can change the content based on the client ID.

The following example passes in the query string parameter named **campaignId** with a value of `Hawaii`, a **language** code of `en-US`, and **app** representing the client ID:

```xml
<UserJourneyBehaviors>
  <ContentDefinitionParameters>
    <Parameter Name="campaignId">{OAUTH-KV:campaignId}</Parameter>
    <Parameter Name="language">{Culture:RFC5646}</Parameter>
    <Parameter Name="app">{OIDC:ClientId}</Parameter>
  </ContentDefinitionParameters>
</UserJourneyBehaviors>
```

As a result, Azure AD B2C sends the above parameters to the HTML content page:

```
/selfAsserted.aspx?campaignId=hawaii&language=en-US&app=0239a9cc-309c-4d41-87f1-31288feb2e82
```

### Content definition

In a [ContentDefinition](contentdefinitions.md) `LoadUri`, you can send claim resolvers to pull content from different places, based on the parameters used.

```xml
<ContentDefinition Id="api.signuporsignin">
  <LoadUri>https://contoso.blob.core.windows.net/{Culture:LanguageName}/myHTML/unified.html</LoadUri>
  ...
</ContentDefinition>
```

### Application Insights technical profile

With Azure Application Insights and claim resolvers you can gain insights on user behavior. In the Application Insights technical profile, you send input claims that are persisted to Azure Application Insights. For more information, see [Track user behavior in Azure AD B2C journeys by using Application Insights](analytics-with-application-insights.md). The following example sends the policy ID, correlation ID, language, and the client ID to Azure Application Insights.

```xml
<TechnicalProfile Id="AzureInsights-Common">
  <DisplayName>Alternate Email</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.Insights.AzureApplicationInsightsProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="PolicyId" PartnerClaimType="{property:Policy}" DefaultValue="{Policy:PolicyId}" />
    <InputClaim ClaimTypeReferenceId="CorrelationId" PartnerClaimType="{property:CorrelationId}" DefaultValue="{Context:CorrelationId}" />
    <InputClaim ClaimTypeReferenceId="language" PartnerClaimType="{property:language}" DefaultValue="{Culture:RFC5646}" />
    <InputClaim ClaimTypeReferenceId="AppId" PartnerClaimType="{property:App}" DefaultValue="{OIDC:ClientId}" />
  </InputClaims>
</TechnicalProfile>
```

### Relying party policy

In a [Relying party](relyingparty.md) policy technical profile, you may want to send the tenant ID, or correlation ID to the relying party application within the JWT.

```xml
<RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="identityProvider" />
        <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
        <OutputClaim ClaimTypeReferenceId="correlationId" AlwaysUseDefaultValue="true" DefaultValue="{Context:CorrelationId}" />
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
```

## Next steps

- Find more [claims resolvers samples](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-resolver) on the Azure AD B2C community GitHub repo
