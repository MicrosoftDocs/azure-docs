---
title: Client assertions (MSAL.NET)
description: Learn about signed client assertions support for confidential client applications in the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/29/2023
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn how to use client assertions to prove the identity of my confidential client application
---

# Confidential client assertions

In order to prove their identity, confidential client applications exchange a secret with Azure AD. The secret can be:
- A client secret (application password).
- A certificate, which is used to build a signed assertion containing standard claims.

This secret can also be a signed assertion directly.

MSAL.NET has four methods to provide either credentials or assertions to the confidential client app:
- `.WithClientSecret()`
- `.WithCertificate()`
- `.WithClientAssertion()`
- `.WithClientClaims()`

> [!NOTE]
> While it is possible to use the `WithClientAssertion()` API to acquire tokens for the confidential client, we do not recommend using it by default as it is more advanced and is designed to handle very specific scenarios which are not common. Using the `.WithCertificate()` API will allow MSAL.NET to handle this for you. This api offers you the ability to customize your authentication request if needed but the default assertion created by `.WithCertificate()` will suffice for most authentication scenarios. This API can also be used as a workaround in some scenarios where MSAL.NET fails to perform the signing operation internally. The difference between the two is using the `WithCertificate()` requires the certificate and private key to be available on the machine creating the assertion, and using the `WithClientAssertion()` allows you to compute the assertion somewhere else, like inside the Azure Key Vault or from Managed Identity, or with a Hardware security module.

### Signed assertions

A signed client assertion takes the form of a signed JWT with the payload containing the required authentication claims mandated by Azure AD, Base64 encoded. To use it:

```csharp
string signedClientAssertion = ComputeAssertion();
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                                          .WithClientAssertion(signedClientAssertion)
                                          .Build();
```

You can also use the delegate form, which enables you to compute the assertion just in time:

```csharp
string signedClientAssertion = ComputeAssertion();
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                                          .WithClientAssertion(async (AssertionRequestOptions options) => {
                                            // use 'options.ClientID' or 'options.TokenEndpoint' to generate client assertion
                                            return await GetClientAssertionAsync(options.ClientID, options.TokenEndpoint, options.CancellationToken); 
                                          })
                                          .Build();
```

The [claims expected by Azure AD](active-directory-certificate-credentials.md) in the signed assertion are:

Claim type | Value | Description
---------- | ---------- | ----------
aud | `https://login.microsoftonline.com/{tenantId}/v2.0` | The "aud" (audience) claim identifies the recipients that the JWT is intended for (here Azure AD) See [RFC 7519, Section 4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).  In this case, that recipient is the login server (login.microsoftonline.com).
exp | 1601519414 | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. See [RFC 7519, Section 4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).  This allows the assertion to be used until then, so keep it short - 5-10 minutes after `nbf` at most.  Azure AD does not place restrictions on the `exp` time currently. 
iss | {ClientID} | The "iss" (issuer) claim identifies the principal that issued the JWT, in this case your client application.  Use the GUID application ID.
jti | (a Guid) | The "jti" (JWT ID) claim provides a unique identifier for the JWT. The identifier value MUST be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object; if the application uses multiple issuers, collisions MUST be prevented among values produced by different issuers as well. The "jti" value is a case-sensitive string. [RFC 7519, Section 4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7)
nbf | 1601519114 | The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing. [RFC 7519, Section 4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).  Using the current time is appropriate. 
sub | {ClientID} | The "sub" (subject) claim identifies the subject of the JWT, in this case also your application. Use the same value as `iss`. 

If you use a certificate as a client secret, the certificate must be deployed safely. We recommend that you store the certificate in a secure spot supported by the platform, such as in the certificate store on Windows or by using Azure Key Vault.

Here's an example of how to craft these claims:

```csharp
using System.Collections.Generic;
private static IDictionary<string, object> GetClaims(string tenantId, string clientId)
{
    //aud = https://login.microsoftonline.com/ + Tenant ID + /v2.0
    string aud = $"https://login.microsoftonline.com/{tenantId}/v2.0";

    string ConfidentialClientID = clientId; //client id 00000000-0000-0000-0000-000000000000
    const uint JwtToAadLifetimeInSeconds = 60 * 10; // Ten minutes
    DateTimeOffset validFrom = DateTimeOffset.UtcNow;
    DateTimeOffset validUntil = validFrom.AddSeconds(JwtToAadLifetimeInSeconds);

    return new Dictionary<string, object>()
    {
        { "aud", aud },
        { "exp", validUntil.ToUnixTimeSeconds() },
        { "iss", ConfidentialClientID },
        { "jti", Guid.NewGuid().ToString() },
        { "nbf", validFrom.ToUnixTimeSeconds() },
        { "sub", ConfidentialClientID }
    };
}
```

Here's how to craft a signed client assertion:

```csharp
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
...
static string Base64UrlEncode(byte[] arg)
{
    char Base64PadCharacter = '=';
    char Base64Character62 = '+';
    char Base64Character63 = '/';
    char Base64UrlCharacter62 = '-';
    char Base64UrlCharacter63 = '_';

    string s = Convert.ToBase64String(arg);
    s = s.Split(Base64PadCharacter)[0]; // RemoveAccount any trailing padding
    s = s.Replace(Base64Character62, Base64UrlCharacter62); // 62nd char of encoding
    s = s.Replace(Base64Character63, Base64UrlCharacter63); // 63rd char of encoding

    return s;
}

static string GetSignedClientAssertion(X509Certificate2 certificate, string tenantId, string clientId)
{
    // Get the RSA with the private key, used for signing.
    var rsa = certificate.GetRSAPrivateKey();

    //alg represents the desired signing algorithm, which is SHA-256 in this case
    //x5t represents the certificate thumbprint base64 url encoded
    var header = new Dictionary<string, string>()
    {
        { "alg", "RS256"},
        { "typ", "JWT" },
        { "x5t", Base64UrlEncode(certificate.GetCertHash()) }
    };

    //Please see the previous code snippet on how to craft claims for the GetClaims() method
    var claims = GetClaims(tenantId, clientId);

    var headerBytes = JsonSerializer.SerializeToUtf8Bytes(header);
    var claimsBytes = JsonSerializer.SerializeToUtf8Bytes(claims);
    string token = Base64UrlEncode(headerBytes) + "." + Base64UrlEncode(claimsBytes);

    string signature = Base64UrlEncode(rsa.SignData(Encoding.UTF8.GetBytes(token), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1));
    string signedClientAssertion = string.Concat(token, ".", signature);
    return signedClientAssertion;
}
```

### Alternative method

You also have the option of using [Microsoft.IdentityModel.JsonWebTokens](https://www.nuget.org/packages/Microsoft.IdentityModel.JsonWebTokens/) to create the assertion for you. The code will be more elegant as shown in the example below:

```csharp
        string GetSignedClientAssertionAlt(X509Certificate2 certificate)
        {
            //aud = https://login.microsoftonline.com/ + Tenant ID + /v2.0
            string aud = $"https://login.microsoftonline.com/{tenantID}/v2.0";

            // client_id
            string confidentialClientID = "00000000-0000-0000-0000-000000000000";

            // no need to add exp, nbf as JsonWebTokenHandler will add them by default.
            var claims = new Dictionary<string, object>()
            {
                { "aud", aud },
                { "iss", confidentialClientID },
                { "jti", Guid.NewGuid().ToString() },
                { "sub", confidentialClientID }
            };

            var securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Claims = claims,
                SigningCredentials = new X509SigningCredentials(certificate)
            };

            var handler = new JsonWebTokenHandler();
            var signedClientAssertion = handler.CreateToken(securityTokenDescriptor);
        }
```

Once you have your signed client assertion, you can use it with the MSAL apis as shown below.

```csharp
            X509Certificate2 certificate = ReadCertificate(config.CertificateName);
            string signedClientAssertion = GetSignedClientAssertion(certificate, tenantId, ConfidentialClientID)
            // OR
            //string signedClientAssertion = GetSignedClientAssertionAlt(certificate);

            var confidentialApp = ConfidentialClientApplicationBuilder
                .Create(ConfidentialClientID)
                .WithClientAssertion(signedClientAssertion)
                .Build();
```

### WithClientClaims

`WithClientClaims(X509Certificate2 certificate, IDictionary<string, string> claimsToSign, bool mergeWithDefaultClaims = true)` by default will produce a signed assertion containing the claims expected by Azure AD plus additional client claims that you want to send. Here is a code snippet on how to do that.

```csharp
string ipAddress = "192.168.1.2";
X509Certificate2 certificate = ReadCertificate(config.CertificateName);
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                                          .WithAuthority(new Uri(config.Authority))
                                          .WithClientClaims(certificate, 
                                                                      new Dictionary<string, string> { { "client_ip", ipAddress } })
                                          .Build();

```

If one of the claims in the dictionary that you pass in is the same as one of the mandatory claims, the additional claim's value will be taken into account. It will override the claims computed by MSAL.NET.

If you want to provide your own claims, including the mandatory claims expected by Azure AD, pass in `false` for the `mergeWithDefaultClaims` parameter.
