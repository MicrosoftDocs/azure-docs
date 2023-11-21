---
title: Define a RESTful technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a RESTful technical profile in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 06/08/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a RESTful technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for integrating your own RESTful service. Azure AD B2C sends data to the RESTful service in an input claims collection and receives data back in an output claims collection. For more information, see [Integrate REST API claims exchanges in your Azure AD B2C custom policy](api-connectors-overview.md).  

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C:
`Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

The following example shows a RESTful technical profile:

```xml
<TechnicalProfile Id="REST-UserMembershipValidator">
  <DisplayName>Validate user input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
```

## Input claims

The **InputClaims** element contains a list of claims to send to the REST API. You can also map the name of your claim to the name defined in the REST API. Following example shows the mapping between your policy and the REST API. The **givenName** claim is sent to the REST API as **firstName**, while **surname** is sent as **lastName**. The **email** claim is set as is.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="email" />
  <InputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="firstName" />
  <InputClaim ClaimTypeReferenceId="surname" PartnerClaimType="lastName" />
</InputClaims>
```

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before sending to the REST API.

## Send a JSON payload

The REST API technical profile allows you to send a complex JSON payload to an endpoint.

To send a complex JSON payload:

1. Build your JSON payload with the [GenerateJson](json-transformations.md) claims transformation.
1. In the REST API technical profile:
    1. Add an input claims transformation with a reference to the `GenerateJson` claims transformation.
    1. Set the `SendClaimsIn` metadata option to `body`
    1. Set the `ClaimUsedForRequestPayload` metadata option to the name of the claim containing the JSON payload.
    1. In the input claim, add a reference to the input claim containing the JSON payload.

The following example `TechnicalProfile` sends a verification email by using a third-party email service (in this case, SendGrid).

```xml
<TechnicalProfile Id="SendGrid">
  <DisplayName>Use SendGrid's email API to send the code to the user</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://api.sendgrid.com/v3/mail/send</Item>
    <Item Key="AuthenticationType">Bearer</Item>
    <Item Key="SendClaimsIn">Body</Item>
    <Item Key="ClaimUsedForRequestPayload">sendGridReqBody</Item>
    <Item Key="DefaultUserMessageIfRequestFailed">Cannot process your request right now, please try again later.</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="BearerAuthenticationToken" StorageReferenceId="B2C_1A_SendGridApiKey" />
  </CryptographicKeys>
  <InputClaimsTransformations>
    <InputClaimsTransformation ReferenceId="GenerateSendGridRequestBody" />
  </InputClaimsTransformations>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="sendGridReqBody" />
  </InputClaims>
</TechnicalProfile>
```

## Output claims

The **OutputClaims** element contains a list of claims returned by the REST API. You may need to map the name of the claim defined in your policy to the name defined in the REST API. You can also include claims that aren't returned by the REST API, as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

The following example shows the claim returned by the REST API:

- The **MembershipId** claim that is mapped to the **loyaltyNumber** claim name.

The technical profile also returns claims, that aren't returned by the identity provider:

- The **loyaltyNumberIsNew** claim that has a default value set to `true`.

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="loyaltyNumber" PartnerClaimType="MembershipId" />
  <OutputClaim ClaimTypeReferenceId="loyaltyNumberIsNew" DefaultValue="true" />
</OutputClaims>
```

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ServiceUrl | Yes | The URL of the REST API endpoint. |
| AuthenticationType | Yes | The type of authentication being performed by the RESTful claims provider. Possible values: `None`, `Basic`, `Bearer`,  `ClientCertificate`, or `ApiKeyHeader`. <br /><ul><li>The `None` value indicates that the REST API is anonymous. </li><li>The `Basic` value indicates that the REST API is secured with HTTP basic authentication. Only verified users, including Azure AD B2C, can access your API. </li><li>The `ClientCertificate` (recommended) value indicates that the REST API restricts access by using client certificate authentication. Only services that have the appropriate certificates, for example Azure AD B2C, can access your API. </li><li>The `Bearer` value indicates that the REST API restricts access using client OAuth2 Bearer token. </li><li>The `ApiKeyHeader` value indicates that the REST API is secured with API key HTTP header, such as *x-functions-key*. </li></ul> |
| AllowInsecureAuthInProduction| No| Indicates whether the `AuthenticationType` can be set to `none` in production environment (`DeploymentMode` of the [TrustFrameworkPolicy](trustframeworkpolicy.md) is set to `Production`, or not specified). Possible values: true, or false (default). |
| SendClaimsIn | No | Specifies how the input claims are sent to the RESTful claims provider. Possible values: `Body` (default), `Form`, `Header`, `Url` or `QueryString`. <br /> The `Body` value is the input claim that is sent in the request body in JSON format. <br />The `Form` value is the input claim that is sent in the request body in an ampersand '&' separated key value format. <br />The `Header` value is the input claim that is sent in the request header. <br />The `Url` value is the input claim that is sent in the URL, for example, `https://api.example.com/{claim1}/{claim2}?{claim3}={claim4}`. The host name part of the URL cannot contain claims.  <br />The `QueryString` value is the input claim that is sent in the request query string. <br />The HTTP verbs invoked by each are as follows:<br /><ul><li>`Body`: POST</li><li>`Form`: POST</li><li>`Header`: GET</li><li>`Url`: GET</li><li>`QueryString`: GET</li></ul> |
| ClaimsFormat | No | Not currently used, can be ignored. |
| ClaimUsedForRequestPayload| No | Name of a string claim that contains the payload to be sent to the REST API. |
| DebugMode | No | Runs the technical profile in debug mode. Possible values: `true`, or `false` (default). In debug mode, the REST API can return more information. See the [Returning error message](#returning-validation-error-message) section. |
| IncludeClaimResolvingInClaimsHandling  | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |
| ResolveJsonPathsInJsonTokens  | No | Indicates whether the technical profile resolves JSON paths. Possible values: `true`, or `false` (default). Use this metadata to read data from a nested JSON element. In an [OutputClaim](technicalprofiles.md#output-claims), set the `PartnerClaimType` to the JSON path element you want to output. For example: `firstName.localized`, or `data[0].to[0].email`.|
| UseClaimAsBearerToken| No| The name of the claim that contains the bearer token.|

## Error handling

The following metadata can be used to configure the error messages displayed upon REST API failure. The error messages can be [localized](localization-string-ids.md#restful-service-error-messages).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| DefaultUserMessageIfRequestFailed | No | A default customized error message for all REST API exceptions.|
| UserMessageIfCircuitOpen | No | Error message when the REST API is not reachable. If not specified, the DefaultUserMessageIfRequestFailed will be returned. |
| UserMessageIfDnsResolutionFailed | No | Error message for the DNS resolution exception. If not specified, the DefaultUserMessageIfRequestFailed will be returned. | 
| UserMessageIfRequestTimeout | No | Error message when the connection is timed out. If not specified, the DefaultUserMessageIfRequestFailed will be returned. | 

## Cryptographic keys

If the type of authentication is set to `None`, the **CryptographicKeys** element is not used.

```xml
<TechnicalProfile Id="REST-API-SignUp">
  <DisplayName>Validate user's input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app-name.azurewebsites.NET/api/identity/signup</Item>
    <Item Key="AuthenticationType">None</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
</TechnicalProfile>
```

If the type of authentication is set to `Basic`, the **CryptographicKeys** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| BasicAuthenticationUsername | Yes | The username that is used to authenticate. |
| BasicAuthenticationPassword | Yes | The password that is used to authenticate. |

The following example shows a technical profile with basic authentication:

```xml
<TechnicalProfile Id="REST-API-SignUp">
  <DisplayName>Validate user's input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app-name.azurewebsites.NET/api/identity/signup</Item>
    <Item Key="AuthenticationType">Basic</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="BasicAuthenticationUsername" StorageReferenceId="B2C_1A_B2cRestClientId" />
    <Key Id="BasicAuthenticationPassword" StorageReferenceId="B2C_1A_B2cRestClientSecret" />
  </CryptographicKeys>
</TechnicalProfile>
```

If the type of authentication is set to `ClientCertificate`, the **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClientCertificate | Yes | The X509 certificate (RSA key set) to use to authenticate. |

```xml
<TechnicalProfile Id="REST-API-SignUp">
  <DisplayName>Validate user's input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app-name.azurewebsites.NET/api/identity/signup</Item>
    <Item Key="AuthenticationType">ClientCertificate</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="ClientCertificate" StorageReferenceId="B2C_1A_B2cRestClientCertificate" />
  </CryptographicKeys>
</TechnicalProfile>
```

If the type of authentication is set to `Bearer`, the **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| BearerAuthenticationToken | No | The OAuth 2.0 Bearer Token. |

```xml
<TechnicalProfile Id="REST-API-SignUp">
  <DisplayName>Validate user's input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app-name.azurewebsites.NET/api/identity/signup</Item>
    <Item Key="AuthenticationType">Bearer</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="BearerAuthenticationToken" StorageReferenceId="B2C_1A_B2cRestClientAccessToken" />
  </CryptographicKeys>
</TechnicalProfile>
```

If the type of authentication is set to `ApiKeyHeader`, the **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| The name of the HTTP header, such as `x-functions-key`, or `x-api-key`. | Yes | The key that is used to authenticate. |

> [!NOTE]
> At this time, Azure AD B2C supports only one HTTP header for authentication. If your RESTful call requires multiple headers, such as a client ID and client secret value, you will need to proxy the request in some manner.

```xml
<TechnicalProfile Id="REST-API-SignUp">
  <DisplayName>Validate user's input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://your-app-name.azurewebsites.NET/api/identity/signup</Item>
    <Item Key="AuthenticationType">ApiKeyHeader</Item>
    <Item Key="SendClaimsIn">Body</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="x-functions-key" StorageReferenceId="B2C_1A_RestApiKey" />
  </CryptographicKeys>
</TechnicalProfile>
```

## Returning validation error message

Your REST API may need to return an error message, such as 'The user was not found in the CRM system'. If an error occurs, the REST API should return an HTTP 4xx error message, such as, 400 (bad request), or 409 (conflict) response status code. The response body contains error message formatted in JSON:

```json
{
  "version": "1.0.0",
  "status": 409,
  "code": "API12345",
  "requestId": "50f0bd91-2ff4-4b8f-828f-00f170519ddb",
  "userMessage": "Message for the user",
  "developerMessage": "Verbose description of problem and how to fix it.",
  "moreInfo": "https://restapi/error/API12345/moreinfo"
}
```

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| version | Yes | Your REST API version. For example: 1.0.1 |
| status | Yes | An HTTP response status codes-like number, and must be 409 |
| code | No | An error code from the RESTful endpoint provider, which is displayed when `DebugMode` is enabled. |
| requestId | No | A request identifier from the RESTful endpoint provider, which is displayed when `DebugMode` is enabled. |
| userMessage | Yes | An error message that is shown to the user. |
| developerMessage | No | The verbose description of the problem and how to fix it, which is displayed when `DebugMode` is enabled. |
| moreInfo | No | A URI that points to additional information, which is displayed when `DebugMode` is enabled. |


The following example shows a C# class that returns an error message:

```csharp
public class ResponseContent
{
  public string version { get; set; }
  public int status { get; set; }
  public string code { get; set; }
  public string userMessage { get; set; }
  public string developerMessage { get; set; }
  public string requestId { get; set; }
  public string moreInfo { get; set; }
}
```

## Next steps

See the following articles for examples of using a RESTful technical profile:

- [Integrate REST API claims exchanges in your Azure AD B2C custom policy](api-connectors-overview.md)
- [Walkthrough: Add an API connector to a sign-up user flow](add-api-connector.md)
- [Walkthrough: Add REST API claims exchanges to custom policies in Azure Active Directory B2C](add-api-connector-token-enrichment.md)
- [Secure your REST API services](secure-rest-api.md)
