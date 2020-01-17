---
title: Define a RESTful technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a RESTful technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/10/2019
ms.author: marsma
ms.subservice: B2C
---

# Define a RESTful technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for your own RESTful service. Azure AD B2C sends data to the RESTful service in an input claims collection and receives data back in an output claims collection. With RESTful service integration, you can:

- **Validate user input data** - Prevents malformed data from persisting into Azure AD B2C. If the value from the user is not valid, your RESTful service returns an error message that instructs the user to provide an entry. For example, you can verify that the email address provided by the user exists in your customer's database.
- **Overwrite input claims** - Enables you to reformat values in input claims. For example, if a user enters the first name in all lowercase or all uppercase letters, you can format the name with only the first letter capitalized.
- **Enrich user data** - Enables you to further integrate with corporate line-of-business applications. For example, your RESTful service can receive the user's email address, query the customer's database, and return the user's loyalty number to Azure AD B2C. The return claims can be stored, evaluated in the next Orchestration Steps, or included in the access token.
- **Run custom business logic** - Enables you to send push notifications, update corporate databases, run a user migration process, manage permissions, audit databases, and perform other actions.

Your policy may send input claims to your REST API. The REST API may also return output claims that you can use later in your policy, or it can throw an error message. You can design the integration with the RESTful services in the following ways:

- **Validation technical profile** - A validation technical profile calls the RESTful service. The validation technical profile validates the user-provided data before the user journey continues. With the validation technical profile, an error message is display on a self-asserted page and returned in output claims.
- **Claims exchange** - A call is made to the RESTful service through an orchestration step. In this scenario, there is no user-interface to render the error message. If your REST API returns an error, the user is redirected back to the relying party application with the error message.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C:
`Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

The following example shows a RESTful technical profile:

```XML
<TechnicalProfile Id="REST-UserMembershipValidator">
  <DisplayName>Validate user input data and return loyaltyNumber claim</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
```

## Input claims

The **InputClaims** element contains a list of claims to send to the REST API. You can also map the name of your claim to the name defined in the REST API. Following example shows the mapping between your policy and the REST API. The **givenName** claim is sent to the REST API as **firstName**, while **surname** is sent as **lastName**. The **email** claim is set as is.

```XML
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

```XML
<TechnicalProfile Id="SendGrid">
  <DisplayName>Use SendGrid's email API to send the code the the user</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://api.sendgrid.com/v3/mail/send</Item>
    <Item Key="AuthenticationType">Bearer</Item>
    <Item Key="SendClaimsIn">Body</Item>
    <Item Key="ClaimUsedForRequestPayload">sendGridReqBody</Item>
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

The **OutputClaims** element contains a list of claims returned by the REST API. You may need to map the name of the claim defined in your policy to the name defined in the REST API. You can also include claims that aren't returned by the REST API identity provider, as long as you set the `DefaultValue` attribute.

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
| AuthenticationType | Yes | The type of authentication being performed by the RESTful claims provider. Possible values: `None`, `Basic`, `Bearer`, or `ClientCertificate`. The `None` value indicates that the REST API is not anonymous. The `Basic` value indicates that the REST API is secured with HTTP basic authentication. Only verified users, including Azure AD B2C, can access your API. The `ClientCertificate` (recommended) value indicates that the REST API restricts access by using client certificate authentication. Only services that have the appropriate certificates, for example Azure AD B2C, can access your API. The `Bearer` value indicates that the REST API restricts access using client OAuth2 Bearer token. |
| SendClaimsIn | No | Specifies how the input claims are sent to the RESTful claims provider. Possible values: `Body` (default), `Form`, `Header`, or `QueryString`. The `Body` value is the input claim that is sent in the request body in JSON format. The `Form` value is the input claim that is sent in the request body in an ampersand '&' separated key value format. The `Header` value is the input claim that is sent in the request header. The `QueryString` value is the input claim that is sent in the request query string. The HTTP verbs invoked by each are as follows:<br /><ul><li>`Body`: POST</li><li>`Form`: POST</li><li>`Header`: GET</li><li>`QueryString`: GET</li></ul> |
| ClaimsFormat | No | Specifies the format for the output claims. Possible values: `Body` (default), `Form`, `Header`, or `QueryString`. The `Body` value is the output claim that is sent in the request body in JSON format. The `Form` value is the output claim that is sent in the request body in an ampersand '&' separated key value format. The `Header` value is the output claim that is sent in the request header. The `QueryString` value is the output claim that is sent in the request query string. |
| ClaimUsedForRequestPayload| No | Name of a string claim that contains the payload to be sent to the REST API. |
| DebugMode | No | Runs the technical profile in debug mode. In debug mode, the REST API can return more information. See the returning error message section. |

## Cryptographic keys

If the type of authentication is set to `None`, the **CryptographicKeys** element is not used.

```XML
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

```XML
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

```XML
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

```XML
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

## Returning error message

Your REST API may need to return an error message, such as 'The user was not found in the CRM system'. In an error occurs, the REST API should return an HTTP 409 error message (Conflict response status code) with following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| version | Yes | 1.0.0 |
| status | Yes | 409 |
| code | No | An error code from the RESTful endpoint provider, which is displayed when `DebugMode` is enabled. |
| requestId | No | A request identifier from the RESTful endpoint provider, which is displayed when `DebugMode` is enabled. |
| userMessage | Yes | An error message that is shown to the user. |
| developerMessage | No | The verbose description of the problem and how to fix it, which is displayed when `DebugMode` is enabled. |
| moreInfo | No | A URI that points to additional information, which is displayed when `DebugMode` is enabled. |

The following example shows a REST API that returns an error message formatted in JSON:

```JSON
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

- [Integrate REST API claims exchanges in your Azure AD B2C user journey as validation of user input](active-directory-b2c-custom-rest-api-netfw.md)
- [Secure your RESTful services by using HTTP basic authentication](active-directory-b2c-custom-rest-api-netfw-secure-basic.md)
- [Secure your RESTful service by using client certificates](active-directory-b2c-custom-rest-api-netfw-secure-cert.md)
- [Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as validation on user input](active-directory-b2c-rest-api-validation-custom.md)
