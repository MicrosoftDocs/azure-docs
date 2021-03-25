---
title: Issuer service communication examples (preview)
description: Details of communication between identity provider and issuer service
author: barclayn
manager: davba
ms.service: identity
ms.subservice: verifiable-credentials
ms.workload: identity
ms.topic: conceptual
ms.date: 03/24/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---


# Issuer service communication examples

Updated: June 23, 2020


The Verifiable Credential issuer service transforms security tokens output by your organization's OpenID compliant identity provider. This article instructs you on how to set up your identity provider to communicate with the issuer service.

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 


To issue a Verifiable Credential, you must allow the verifiable credential issuer service to federate with your identity provider using the OpenID Connect protocol. The claims in the resulting ID token are used to populate the contents of your Verifiable Credential.

When a request to issue a credential is received, the issuer service will federate to your identity provider to authenticate the user using the OpenID Connect authorization code flow. Your OpenID provider must support the following OpenID Connect features:

| Feature | Description |
| ------- | ----------- |
| Grant type | Must support the authorization code grant type. |
| Token format | Must produce unencrypted compact JWTs. |
| Signature algorithm | Must produce JWTs signed using RSA 256. |
| Configuration document | Must support OpenID Connect configuration document and `jwks_uri`. | 
| Client registration | Must support public client registration using a `redirect_uri` value of `portableidentity://verify`. | 
| PKCE | Recommended for security reasons, but not required. |

Examples of the HTTP requests sent to your identity provider are provided below. Your identity provider must accept and respond to these requests in accordance with the OpenID Connect authentication standard.

## Client registration

To receive the Verifiable Credential, your users will need to sign into your IDP from the Microsoft Authenticator app and accept permissions for the Verifiable Credential service.

To enable this exchange, register the Verifiable Credential service with your identity provider as a client application. If you are using Azure AD, you can find the instructions [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app). Use the following values when registering.

| Setting | Value |
| ------- | ----- |
| Application name | `<Issuer Name> Verifiable Credential Service` |
| Redirect URI | `portableidentity://verify` |

Record the client ID for the application you register with your identity provider. You'll use it in the section that follows.

## Authorization request

The authorization request sent to your identity provider will have the following form.

```HTTP
GET /authorize?client_id=<client-id>&redirect_uri=portableidentity%3A%2F%2Fverify&response_mode=query&response_type=code&scope=openid&state=12345&nonce=12345 HTTP/1.1
Host: www.contoso.com
Connection: Keep-Alive
```

| Parameter | Value |
| ------- | ----------- |
| `client_id` | The client ID obtained during the application registration process. |
| `redirect_uri` | Must use `portableidentity://verify`. |
| `response_mode` | Must support `query`. |
| `response_type` | Must support `code`. |
| `scope` | Must support `openid`. |
| `state` | Must be returned to the client according to the OpenID Connect standard. |
| `nonce` | Must be returned as a claim in the ID token according to the OpenID Connect standard. |

When it receives an authorization request, your identity provider should authenticate the user and perform any steps that must occur before a verifiable credential is issued. You may customize the credential issuance process to meet your needs. You may ask the user to provide additional information, accept terms of service, pay for their credential, and more. Once all steps have been completed, respond to the authorization request by redirecting to the redirect URI as follows.

```HTTP
portableidentity://verify?code=nbafhjbh1ub1yhbj1h4jr1&state=12345
```

| Parameter | Value |
| ------- | ----------- |
| `code` |  The authorization code returned by your identity provider. |
| `state` | Must be returned to the client according to the OpenID Connect standard. |

## Token request

The token request sent to your identity provider will have the following form.

```HTTP
POST /token HTTP/1.1
Host: www.contoso.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 291

client_id=<client-id>&redirect_uri=portableidentity%3A%2F%2Fverify&grant_type=authorization_code&code=nbafhjbh1ub1yhbj1h4jr1&scope=openid
```

| Parameter | Value |
| ------- | ----------- |
| `client_id` | The client ID obtained during the application registration process. |
| `redirect_uri` | Must use `portableidentity://verify`. |
| `scope` | Must support `openid`. |
| `grant_type` | Must support `authorization_code`. |
| `code` | The authorization code returned by your identity provider. |

Upon receiving the token request, your identity provider should respond with an ID token.

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
"id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzc
    yI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5
    NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZ
    fV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5Nz
    AKfQ.ggW8hZ1EuVLuxNuuIJKX_V8a_OMXzR0EHR9R6jgdqrOOF4daGU96Sr_P6q
    Jp6IcmD3HP99Obi1PRs-cwh3LO-p146waJ8IhehcwL7F09JdijmBqkvPeB2T9CJ
    NqeGpe-gccMg4vfKjkM8FcGvnzZUN4_KSP0aAp1tOJ1zZwgjxqGByKHiOtX7Tpd
    QyHE5lcMiKPXfEIQILVq0pc_E2DzL7emopWoaoZTF_m0_N0YzFC6g6EJbOEoRoS
    K5hoDalrcvRYLSrQAZZKflyuVCyixEoV9GfNQC3_osjzw2PAithfubEEBLuVVk4
    XUVrWOLrLl0nx7RkKU8NXNHq-rvKMzqg"
}
```

The ID token must use the JWT compact serialization format, and must not be encrypted. The ID token should contain the following claims.

| Claim | Value |
| ------- | ----------- |
| `kid` | The key identifier of the key used to sign the ID token, corresponding to an entry in the OpenID provider's `jwks_uri`. |
| `aud` | The client ID obtained during the application registration process. |
| `iss` | Must be the `issuer` value in your OpenID Connect configuration document. |
| `exp` | Must contain the expiry time of the ID token. |
| `iat` | Must contain the time at which the ID token was issued. |
| `nonce` | The value included in the authorization request. |
| Additional claims | The ID token should contain any additional claims whose values will be included in the Verifiable Credential that will be issued. This section is where you should include any attributes about the user, such as their name. |