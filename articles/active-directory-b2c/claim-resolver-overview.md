---
title: About claim resolvers in Azure Active Directory B2C custom policies | Microsoft Docs
description: Learn about how claims resolvers are used in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 10/08/2018
ms.author: davidmu
ms.component: B2C
---

# About claim resolvers in Azure Active Directory B2C custom policies

Claim resolvers in Azure Active Directory (Azure AD) B2C [custom policies](active-directory-b2c-overview-custom.md) provide context information about an authorization request, such as the policy name, request correlation ID, user interface language, and more.

To use a claim resolver in an input or output claim, you define a string **ClaimType**, under the [ClaimsSchema](claimsschema.md) element, and then you set the **DefaultValue** to the claim resolver in the input or output claim element. Azure AD B2C reads the value of the claim resolver and uses the value in the technical profile. 

In the following example, a claim type named `correlationId` is defined with a **DataType** of `string`.  

```XML
<ClaimType Id="correlationId">
  <DisplayName>correlationId</DisplayName>
  <DataType>string</DataType>
  <UserHelpText>Request correlation Id</UserHelpText>
</ClaimType>
```

In the technical profile, map the claim resolver to the claim type. Azure AD B2C populates the value of the claim resolver `{context:corelationId}` into the claim `correlationId` and sends the claim to the technical profile.

```XML
<InputClaim ClaimTypeReferenceId="correlationId" DefaultValue="{context:corelationId}" />
```

## Claim resolver types

The following sections list available claim resolvers.

### Culture

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Culture:LanguageName} | The two letter ISO code for the language. | en |
| {Culture:LCID}   | The LCID of language code. | 1033 |
| {Culture:RegionName} | The two letter ISO code for the region. | US |
| {Culture:RFC5646} | The RFC5646 language code. | en-US |

### Policy

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Policy:PolicyId} | The relying party policy name. | B2C_1A_signup_signin |
| {Policy:RelyingPartyTenantId} | The tenant ID of the relying party policy. | your-tenant.onmicrosoft.com |
| {Policy:TenantObjectId} | The tenant object ID of the relying party policy. | 00000000-0000-0000-0000-000000000000 |
| {Policy:TrustFrameworkTenantId} | The tenant ID of the trust framework. | your-tenant.onmicrosoft.com |

### OpenID Connect

| Claim | Description | Example |
| ----- | ----------- | --------|
| {OIDC:AuthenticationContextReferences} |The `acr_values` query string parameter. | N/A |
| {OIDC:ClientId} |The `client_id`  query string parameter. | 00000000-0000-0000-0000-000000000000 |
| {OIDC:DomainHint} |The `domain_hint`  query string parameter. | facebook.com |
| {OIDC:LoginHint} |  The `login_hint` query string parameter. | someone@contoso.com |
| {OIDC:MaxAge} | The `max_age`. | N/A |
| {OIDC:Nonce} |The `Nonce`  query string parameter. | defaultNonce |
| {OIDC:Prompt} | The `prompt` query string parameter. | login |
| {OIDC:Resource} |The `resource`  query string parameter. | N/A |
| {OIDC:scope} |The `scope`  query string parameter. | openid |

### Context

| Claim | Description | Example |
| ----- | ----------- | --------|
| {Context:BuildNumber} | The Identity Experience Framework version (build number).  | 1.0.507.0 |
| {Context:CorrelationId} | The correlation ID.  | 00000000-0000-0000-0000-000000000000 |
| {Context:DateTimeInUtc} |The date time in UTC.  | 10/10/2018 12:00:00 PM |
| {Context:DeploymentMode} |The policy deployment mode.  | Production |
| {Context:IPAddress} | The user IP address. | 11.111.111.11 |


### Non-protocol parameters

Any parameter name included as part of an OIDC or OAuth2 request can be mapped to a claim in the user journey. For example, the request from the application might include a query string parameter with a name of `app_session`, `loyalty_number`, or any custom query string.

| Claim | Description | Example |
| ----- | ----------------------- | --------|
| {OAUTH-KV:campaignId} | A query string parameter. | hawaii |
| {OAUTH-KV:app_session} | A query string parameter. | A3C5R |
| {OAUTH-KV:loyalty_number} | A query string parameter. | 1234 |
| {OAUTH-KV:any custom query string} | A query string parameter. | N/A |


## How to use claim resolvers

### RESTful technical profile

In a [RESTful](restful-technical-profile.md) technical profile, you may want to send the user language, policy name, scope, and client ID. Based on these claims the REST API can run custom business logic, and if necessary raise a localized error message. 

The following example shows a RESTful technical profile:

```XML
<TechnicalProfile Id="REST">
  <DisplayName>Validate user input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app.azurewebsites.net/api/identity</Item>
    <Item Key="AuthenticationType">None</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userLanguage" DefaultValue="{Culture:LCID}" />
    <InputClaim ClaimTypeReferenceId="policyName" DefaultValue="{Policy:PolicyId}" />
    <InputClaim ClaimTypeReferenceId="scope" DefaultValue="{OIDC:scope}" />
    <InputClaim ClaimTypeReferenceId="clientId" DefaultValue="{OIDC:ClientId}" />
  </InputClaims>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

### Direct sign-in

Using claim resolvers, you can prepopulate the sign-in name or direct sign-in to a specific social identity provider, such as Facebook, LinkedIn, or a Microsoft account. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md).

### Dynamic UI customization

Azue AD B2C enables you to pass query string parameters to your HTML content definition endpoints so that you can dynamically render the page content. For example, you can change the background image on the Azure AD B2C sign-up or sign-in page based on a custom parameter that you pass from your web or mobile application. For more information, see [Dynamically configure the UI by using custom policies in Azure Active Directory B2C](active-directory-b2c-ui-customization-custom-dynamic.md). You can also localize your HTML page based on a language parameter, or you can change the content based on the client ID.

The following example passes in the query string a parameter named **campaignId** with a value of `hawaii`, a **language** code of `en-US`, and **app** representing the client ID:

```XML
<UserJourneyBehaviors>
  <ContentDefinitionParameters>
    <Parameter Name="campaignId">{OAUTH-KV:campaignId}</Parameter>
    <Parameter Name="language">{Culture:RFC5646}</Parameter>
    <Parameter Name="app">{OIDC:ClientId}</Parameter>
  </ContentDefinitionParameters>
</UserJourneyBehaviors>
```

As a result Azure AD B2C sends the above parameters to the HTML content page:

```
/selfAsserted.aspx?campaignId=hawaii&language=en-US&app=0239a9cc-309c-4d41-87f1-31288feb2e82
```

### Application Insights technical profile

With Azure Application Insights and claim resolvers you can gain insights on user behavior. In the Application Insights technical profile, you send input claims that are persisted to Azure Application Insights. For more information, see [Track user behavior in Azure AD B2C journeys by using Application Insights](active-directory-b2c-custom-guide-eventlogger-appins.md). The following example sends the policy ID, correlation ID, language, and the client ID to Azure Application Insights.

```XML
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
