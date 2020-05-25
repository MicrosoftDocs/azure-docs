---
title: RelyingParty - Azure Active Directory B2C | Microsoft Docs
description: Specify the RelyingParty element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 04/20/2020
ms.author: mimart
ms.subservice: B2C
---

# RelyingParty

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **RelyingParty** element specifies the user journey to enforce for the current request to Azure Active Directory B2C (Azure AD B2C). It also specifies the list of claims that the relying party (RP) application needs as part of the issued token. An RP application, such as a web, mobile, or desktop application, calls the RP policy file. The RP policy file executes a specific task, such as signing in, resetting a password, or editing a profile. Multiple applications can use the same RP policy and a single application can use multiple policies. All RP applications receive the same token with claims, and the user goes through the same user journey.

The following example shows a **RelyingParty** element in the *B2C_1A_signup_signin* policy file:

```XML
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy
  xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="https://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="your-tenant.onmicrosoft.com"
  PolicyId="B2C_1A_signup_signin"
  PublicPolicyUri="http://your-tenant.onmicrosoft.com/B2C_1A_signup_signin">

  <BasePolicy>
    <TenantId>your-tenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>

  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <UserJourneyBehaviors>
      <SingleSignOn Scope="Tenant" KeepAliveInDays="7"/>
      <SessionExpiryType>Rolling</SessionExpiryType>
      <SessionExpiryInSeconds>300</SessionExpiryInSeconds>
      <JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="your-application-insights-key" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
      <ContentDefinitionParameters>
        <Parameter Name="campaignId">{OAUTH-KV:campaignId}</Parameter>
      </ContentDefinitionParameters>
    </UserJourneyBehaviors>
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Description>The policy profile</Description>
      <Protocol Name="OpenIdConnect" />
      <Metadata>collection of key/value pairs of data</Metadata>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="identityProvider" />
        <OutputClaim ClaimTypeReferenceId="loyaltyNumber" />
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
  ...
```

The optional **RelyingParty** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| DefaultUserJourney | 1:1 | The default user journey for the RP application. |
| UserJourneyBehaviors | 0:1 | The scope of the user journey behaviors. |
| TechnicalProfile | 1:1 | A technical profile that's supported by the RP application. The technical profile provides a contract for the RP application to contact Azure AD B2C. |

## DefaultUserJourney

The `DefaultUserJourney` element specifies a reference to the identifier of the user journey that is usually defined in the Base or Extensions policy. The following examples show the sign-up or sign-in user journey specified in the **RelyingParty** element:

*B2C_1A_signup_signin* policy:

```XML
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn">
  ...
```

*B2C_1A_TrustFrameWorkBase* or *B2C_1A_TrustFrameworkExtensionPolicy*:

```XML
<UserJourneys>
  <UserJourney Id="SignUpOrSignIn">
  ...
```

The **DefaultUserJourney** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of the user journey in the policy. For more information, see [user journeys](userjourneys.md) |

## UserJourneyBehaviors

The **UserJourneyBehaviors** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SingleSignOn | 0:1 | The scope of the single sign-on (SSO) session behavior of a user journey. |
| SessionExpiryType |0:1 | The authentication behavior of the session. Possible values: `Rolling` or `Absolute`. The `Rolling` value (default) indicates that the user remains signed in as long as the user is continually active in the application. The `Absolute` value indicates that the user is forced to reauthenticate after the time period specified by application session lifetime. |
| SessionExpiryInSeconds | 0:1 | The lifetime of Azure AD B2C's session cookie specified as an integer stored on the user's browser upon successful authentication. |
| JourneyInsights | 0:1 | The Azure Application Insights instrumentation key to be used. |
| ContentDefinitionParameters | 0:1 | The list of key value pairs to be appended to the content definition load URI. |
|ScriptExecution| 0:1| The supported [JavaScript](javascript-samples.md) execution modes. Possible values: `Allow` or `Disallow` (default).

### SingleSignOn

The **SingleSignOn** element contains in the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Scope | Yes | The scope of the single sign-on behavior. Possible values: `Suppressed`, `Tenant`, `Application`, or `Policy`. The `Suppressed` value indicates that the behavior is suppressed, and the user is always prompted for an identity provider selection.  The `Tenant` value indicates that the behavior is applied to all policies in the tenant. For example, a user navigating through two policy journeys for a tenant is not prompted for an identity provider selection. The `Application` value indicates that the behavior is applied to all policies for the application making the request. For example, a user navigating through two policy journeys for an application is not prompted for an identity provider selection. The `Policy` value indicates that the behavior only applies to a policy. For example, a user navigating through two policy journeys for a trust framework is prompted for an identity provider selection when switching between policies. |
| KeepAliveInDays | Yes | Controls how long the user remains signed in. Setting the value to 0 turns off KMSI functionality. For more information, see [Keep me signed in](custom-policy-keep-me-signed-in.md). |
|EnforceIdTokenHintOnLogout| No|  Force to pass a previously issued ID token to the logout endpoint as a hint about the end user's current authenticated session with the client. Possible values: `false` (default), or `true`. For more information, see [Web sign-in with OpenID Connect](openid-connect.md).  |


## JourneyInsights

The **JourneyInsights** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| TelemetryEngine | Yes | The value must be `ApplicationInsights`. |
| InstrumentationKey | Yes | The string that contains the instrumentation key for the application insights element. |
| DeveloperMode | Yes | Possible values: `true` or `false`. If `true`, Application Insights expedites the telemetry through the processing pipeline. This setting is good for development, but constrained at high volumes The detailed activity logs are designed only to aid in development of custom policies. Do not use development mode in production. Logs collect all claims sent to and from the identity providers during development. If used in production, the developer assumes responsibility for PII (Privately Identifiable Information) collected in the App Insights log that they own. These detailed logs are only collected when this value is set to `true`.|
| ClientEnabled | Yes | Possible values: `true` or `false`. If `true`, sends the Application Insights client-side script for tracking page view and client-side errors. |
| ServerEnabled | Yes | Possible values: `true` or `false`. If `true`, sends the existing UserJourneyRecorder JSON as a custom event to Application Insights. |
| TelemetryVersion | Yes | The value must be `1.0.0`. |

For more information, see [Collecting Logs](troubleshoot-with-application-insights.md)

## ContentDefinitionParameters

By using custom policies in Azure AD B2C, you can send a parameter in a query string. By passing the parameter to your HTML endpoint, you can dynamically change the page content. For example, you can change the background image on the Azure AD B2C sign-up or sign-in page, based on a parameter that you pass from your web or mobile application. Azure AD B2C passes the query string parameters to your dynamic HTML file, such as aspx file.

The following example passes a parameter named `campaignId` with a value of `hawaii` in the query string:

`https://login.microsoft.com/contoso.onmicrosoft.com/oauth2/v2.0/authorize?pB2C_1A_signup_signin&client_id=a415078a-0402-4ce3-a9c6-ec1947fcfb3f&nonce=defaultNonce&redirect_uri=http%3A%2F%2Fjwt.io%2F&scope=openid&response_type=id_token&prompt=login&campaignId=hawaii`

The **ContentDefinitionParameters** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ContentDefinitionParameter | 0:n | A string that contains the key value pair that's appended to the query string of a content definition load URI. |

The **ContentDefinitionParameter** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Name | Yes | The name of the key value pair. |

For more information, see [Configure the UI with dynamic content by using custom policies](custom-policy-ui-customization.md#configure-dynamic-custom-page-content-uri)

## TechnicalProfile

The **TechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | The value must be `PolicyProfile`. |

The **TechnicalProfile** contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| DisplayName | 1:1 | The string that contains the name of the technical profile. |
| Description | 0:1 | The string that contains the description of the technical profile. |
| Protocol | 1:1 | The protocol used for the federation. |
| Metadata | 0:1 | The collection of *Item* of key/value pairs utilized by the protocol for communicating with the endpoint in the course of a transaction to configure interaction between the relying party and other community participants. |
| OutputClaims | 1:1 | A list of claim types that are taken as output in the technical profile. Each of these elements contains reference to a **ClaimType** already defined in the **ClaimsSchema** section or in a policy from which this policy file inherits. |
| SubjectNamingInfo | 1:1 | The subject name used in tokens. |

The **Protocol** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Name | Yes | The name of a valid protocol supported by Azure AD B2C that is used as part of the technical profile. Possible values: `OpenIdConnect` or `SAML2`. The `OpenIdConnect` value represents the OpenID Connect 1.0 protocol standard as per OpenID foundation specification. The `SAML2` represents the SAML 2.0 protocol standard as per OASIS specification. |

## OutputClaims

The **OutputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OutputClaim | 0:n | The name of an expected claim type in the supported list for the policy to which the relying party subscribes. This claim serves as an output for the technical profile. |

The **OutputClaim** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimTypeReferenceId | Yes | A reference to a **ClaimType** already defined in the **ClaimsSchema** section in the policy file. |
| DefaultValue | No | A default value that can be used if the claim value is empty. |
| PartnerClaimType | No | Sends the claim in a different name as configured in the ClaimType definition. |

### SubjectNamingInfo

With the **SubjectNameingInfo** element, you control the value of the token subject:
- **JWT token** - the `sub` claim. This is a principal about which the token asserts information, such as the user of an application. This value is immutable and cannot be reassigned or reused. It can be used to perform safe authorization checks, such as when the token is used to access a resource. By default, the subject claim is populated with the object ID of the user in the directory. For more information, see [Token, session and single sign-on configuration](session-behavior.md).
- **SAML token** - the `<Subject><NameID>` element which identifies the subject element.

The **SubjectNamingInfo** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimType | Yes | A reference to an output claim's **PartnerClaimType**. The output claims must be defined in the relying party policy **OutputClaims** collection. |

The following example shows how to define an OpenID Connect relying party. The subject name info is configured as the `objectId`:

```XML
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
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" />
  </TechnicalProfile>
</RelyingParty>
```
The JWT token includes the `sub` claim with the user objectId:

```JSON
{
  ...
  "sub": "6fbbd70d-262b-4b50-804c-257ae1706ef2",
  ...
}
```
