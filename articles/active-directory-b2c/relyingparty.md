---
title: RelyingParty - Azure Active Directory B2C  
description: Specify the RelyingParty element of a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 03/13/2023
ms.custom: 
ms.author: kengaderdus
ms.subservice: B2C
---

# RelyingParty

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **RelyingParty** element specifies the user journey to enforce for the current request to Azure Active Directory B2C (Azure AD B2C). It also specifies the list of claims that the relying party (RP) application needs as part of the issued token. An RP application, such as a web, mobile, or desktop application, calls the RP policy file. The RP policy file executes a specific task, such as signing in, resetting a password, or editing a profile. Multiple applications can use the same RP policy and a single application can use multiple policies. All RP applications receive the same token with claims, and the user goes through the same user journey.

The following example shows a **RelyingParty** element in the *B2C_1A_signup_signin* policy file:

```xml
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
      <SessionExpiryInSeconds>900</SessionExpiryInSeconds>
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
| Endpoints | 0:1 | A list of endpoints. For more information, see [UserInfo endpoint](userinfo-endpoint.md). |
| UserJourneyBehaviors | 0:1 | The scope of the user journey behaviors. |
| TechnicalProfile | 1:1 | A technical profile that's supported by the RP application. The technical profile provides a contract for the RP application to contact Azure AD B2C. |

You need to create the **RelyingParty** child elements in the order presented in the preceding table.

## Endpoints

The **Endpoints** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Endpoint | 1:1 | A reference to an endpoint.|

The **Endpoint** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | A unique identifier of the endpoint.|
| UserJourneyReferenceId | Yes | An identifier of the user journey in the policy. For more information, see [user journeys](userjourneys.md)  | 

The following example shows a relying party with [UserInfo endpoint](userinfo-endpoint.md):

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <Endpoints>
    <Endpoint Id="UserInfo" UserJourneyReferenceId="UserInfoJourney" />
  </Endpoints>
  ...
```

## DefaultUserJourney

The `DefaultUserJourney` element specifies a reference to the identifier of the user journey that is defined in the Base or Extensions policy. The following examples show the sign-up or sign-in user journey specified in the **RelyingParty** element:

*B2C_1A_signup_signin* policy:

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn">
  ...
```

*B2C_1A_TrustFrameWorkBase* or *B2C_1A_TrustFrameworkExtensionPolicy*:

```xml
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
| SessionExpiryInSeconds | 0:1 | The lifetime of Azure AD B2C's session cookie specified as an integer stored on the user's browser upon successful authentication. The default is 86,400 seconds (24 hours). The minimum is 900 seconds (15 minutes). The maximum is 86,400 seconds (24 hours). |
| JourneyInsights | 0:1 | The Azure Application Insights instrumentation key to be used. |
| ContentDefinitionParameters | 0:1 | The list of key value pairs to be appended to the content definition load URI. |
| JourneyFraming | 0:1| Allows the user interface of this policy to be loaded in an iframe. |
| ScriptExecution| 0:1| The supported [JavaScript](javascript-and-page-layout.md) execution modes. Possible values: `Allow` or `Disallow` (default).

When you use the above elements, you need add them to your **UserJourneyBehaviors** element in the order specified in the table. For example, the **JourneyInsights** element must be added before (above) the **ScriptExecution** element. 
 
### SingleSignOn

The **SingleSignOn** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Scope | Yes | The scope of the single sign-on behavior. Possible values: `Suppressed`, `Tenant`, `Application`, or `Policy`. The `Suppressed` value indicates that the behavior is suppressed, and the user is always prompted for an identity provider selection.  The `Tenant` value indicates that the behavior is applied to all policies in the tenant. For example, a user navigating through two policy journeys for a tenant is not prompted for an identity provider selection. The `Application` value indicates that the behavior is applied to all policies for the application making the request. For example, a user navigating through two policy journeys for an application is not prompted for an identity provider selection. The `Policy` value indicates that the behavior only applies to a policy. For example, a user navigating through two policy journeys for a trust framework is prompted for an identity provider selection when switching between policies. |
| KeepAliveInDays | No | Controls how long the user remains signed in. Setting the value to 0 turns off KMSI functionality. The default is `0` (disabled). The minimum is `1` day. The maximum is `90` days. For more information, see [Keep me signed in](session-behavior.md?pivots=b2c-custom-policy#enable-keep-me-signed-in-kmsi). |
|EnforceIdTokenHintOnLogout| No|  Force to pass a previously issued ID token to the logout endpoint as a hint about the end user's current authenticated session with the client. Possible values: `false` (default), or `true`. For more information, see [Web sign-in with OpenID Connect](openid-connect.md).  |


## JourneyInsights

The **JourneyInsights** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| TelemetryEngine | Yes | The value must be `ApplicationInsights`. |
| InstrumentationKey | Yes | The string that contains the instrumentation key for the application insights element. |
| DeveloperMode | Yes | Possible values: `true` or `false`. If `true`, Application Insights expedites the telemetry through the processing pipeline. This setting is good for development, but constrained at high volumes. The detailed activity logs are designed only to aid in development of custom policies. Do not use development mode in production. Logs collect all claims sent to and from the identity providers during development. If used in production, the developer assumes responsibility for personal data collected in the App Insights log that they own. These detailed logs are only collected when this value is set to `true`.|
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

For more information, see [Configure the UI with dynamic content by using custom policies](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri)

### JourneyFraming

The **JourneyFraming** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Enabled | Yes | Enables this policy to be loaded within an iframe. Possible values: `false` (default), or `true`. |
| Sources | Yes | Contains the domains that will load host the iframe. For more information, see [Loading Azure B2C in an iframe](embedded-login.md). |

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
| InputClaims | 1:1 | A list of claim types that are taken as input in the technical profile. Each of these elements contains reference to a **ClaimType** already defined in the **ClaimsSchema** section or in a policy from which this policy file inherits. |
| OutputClaims | 1:1 | A list of claim types that are taken as output in the technical profile. Each of these elements contains reference to a **ClaimType** already defined in the **ClaimsSchema** section or in a policy from which this policy file inherits. |
| SubjectNamingInfo | 1:1 | The subject name used in tokens. |

The **Protocol** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Name | Yes | The name of a valid protocol supported by Azure AD B2C that is used as part of the technical profile. Possible values: `OpenIdConnect` or `SAML2`. The `OpenIdConnect` value represents the OpenID Connect 1.0 protocol standard as per OpenID foundation specification. The `SAML2` represents the SAML 2.0 protocol standard as per OASIS specification. |

### Metadata

When the protocol is `SAML`, a metadata element contains the following elements. For more information, see [Options for registering a SAML application in Azure AD B2C](saml-service-provider-options.md).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| IdpInitiatedProfileEnabled | No | Indicates whether the IDP initiated flow is supported. Possible values: `true` or `false` (default). | 
| XmlSignatureAlgorithm | No | The method that Azure AD B2C uses to sign the SAML Response. Possible values: `Sha256`, `Sha384`, `Sha512`, or `Sha1`. Make sure you configure the signature algorithm on both sides with same value. Use only the algorithm that your certificate supports. To configure the SAML Assertion, see [SAML issuer technical profile metadata](saml-issuer-technical-profile.md#metadata). |
| DataEncryptionMethod | No | Indicates the method that Azure AD B2C uses to encrypt the data, using Advanced Encryption Standard (AES) algorithm. The metadata controls the value of the `<EncryptedData>` element in the SAML response. Possible values: `Aes256` (default), `Aes192`, `Sha512`, or ` Aes128`. |
| KeyEncryptionMethod| No | Indicates the method that Azure AD B2C uses to encrypt the copy of the key that was used to encrypt the data. The metadata controls the value of the  `<EncryptedKey>` element in the SAML response. Possible values: ` Rsa15` (default) - RSA Public Key Cryptography Standard (PKCS) Version 1.5 algorithm, ` RsaOaep` - RSA Optimal Asymmetric Encryption Padding (OAEP) encryption algorithm. |
| UseDetachedKeys | No |  Possible values: `true`, or `false` (default). When the value is set to `true`, Azure AD B2C changes the format of the encrypted assertions. Using detached keys adds the encrypted assertion as a child of the EncrytedAssertion as opposed to the EncryptedData. |
| WantsSignedResponses| No | Indicates whether Azure AD B2C signs the `Response` section of the SAML response. Possible values: `true` (default) or `false`.  |
| RemoveMillisecondsFromDateTime| No | Indicates whether the milliseconds will be removed from datetime values within the SAML response (these include IssueInstant, NotBefore, NotOnOrAfter, and AuthnInstant). Possible values: `false` (default) or `true`.  |
| RequestContextMaximumLengthInBytes| No | Indicates the maximum length of the [SAML applications](saml-service-provider.md) `RelayState` parameter. The default is 1000. The maximum is 2048.| 

### InputClaims

The **InputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputClaim | 0:n | An expected input claim type. |

The **InputClaim** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimTypeReferenceId | Yes | A reference to a **ClaimType** already defined in the **ClaimsSchema** section in the policy file. |
| DefaultValue | No | A default value that can be used if the claim value is empty. |
| PartnerClaimType | No | Sends the claim in a different name as configured in the ClaimType definition. |

### OutputClaims

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
- **SAML token** - the `<Subject><NameID>` element, which identifies the subject element. The NameId format can be modified.

The **SubjectNamingInfo** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimType | Yes | A reference to an output claim's **PartnerClaimType**. The output claims must be defined in the relying party policy **OutputClaims** collection with a **PartnerClaimType**. For example, `<OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" />`, or `<OutputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="signInName" />`. |
| Format | No | Used for SAML Relying parties to set the **NameId format** returned in the SAML Assertion. |

The following example shows how to define an OpenID Connect relying party. The subject name info is configured as the `objectId`:

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
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" />
  </TechnicalProfile>
</RelyingParty>
```
The JWT token includes the `sub` claim with the user objectId:

```json
{
  ...
  "sub": "6fbbd70d-262b-4b50-804c-257ae1706ef2",
  ...
}
```

The following example shows how to define a SAML relying party. The subject name info is configured as the `objectId`, and the NameId `format` has been provided:

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <TechnicalProfile Id="PolicyProfile">
    <DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="SAML2" />
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="displayName" />
      <OutputClaim ClaimTypeReferenceId="givenName" />
      <OutputClaim ClaimTypeReferenceId="surname" />
      <OutputClaim ClaimTypeReferenceId="email" />
      <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
      <OutputClaim ClaimTypeReferenceId="identityProvider" />
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient"/>
  </TechnicalProfile>
</RelyingParty>
```
