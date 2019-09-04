---
title: Client assertions in Microsoft Authentication Library for .NET | Azure
description: Learn about signed client assertions support for confidential client applications in Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/16/2019
ms.author: jmprieur
ms.reviewer: 
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to use client assertions to prove the identity of my confidential client application
ms.collection: M365-identity-device-management
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

### Signed assertions

A signed client assertion takes the form of a signed JWT with the payload containing the required authentication claims mandated by Azure AD, Base64 encoded. To use it:

```CSharp
string signedClientAssertion = ComputeAssertion();
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                                          .WithClientAssertion(signedClientAssertion)
                                          .Build();
```

The claims expected by Azure AD are:

Claim type | Value | Description
---------- | ---------- | ----------
aud | https://login.microsoftonline.com/{tenantId}/v2.0 | The "aud" (audience) claim identifies the recipients that the JWT is intended for (here Azure AD) See [RFC 7519, Section 4.1.3]
exp | Thu Jun 27 2019 15:04:17 GMT+0200 (Romance Daylight Time) | The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. See [RFC 7519, Section 4.1.4]
iss | {ClientID} | The "iss" (issuer) claim identifies the principal that issued the JWT. The processing of this claim is application-specific. The "iss" value is a case-sensitive string containing a StringOrURI value. [RFC 7519, Section 4.1.1]
jti | (a Guid) | The "jti" (JWT ID) claim provides a unique identifier for the JWT. The identifier value MUST be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object; if the application uses multiple issuers, collisions MUST be prevented among values produced by different issuers as well. The "jti" claim can be used to prevent the JWT from being replayed. The "jti" value is a case-sensitive string. [RFC 7519, Section 4.1.7]
nbf | Thu Jun 27 2019 14:54:17 GMT+0200 (Romance Daylight Time) | The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing. [RFC 7519, Section 4.1.5]
sub | {ClientID} | The "sub" (subject) claim identifies the subject of the JWT. The claims in a JWT are normally statements about the subject. The subject value MUST either be scoped to be locally unique in the context of the issuer or be globally unique. The See [RFC 7519, Section 4.1.2]

Here is an example of how to craft these claims:

```CSharp
private static IDictionary<string, string> GetClaims()
{
      //aud = https://login.microsoftonline.com/ + Tenant ID + /v2.0
      string aud = "https://login.microsoftonline.com/72f988bf-86f1-41af-hd4m-2d7cd011db47/v2.0";

      string ConfidentialClientID = "61dab2ba-145d-4b1b-8569-bf4b9aed5dhb" //client id
      const uint JwtToAadLifetimeInSeconds = 60 * 10; // Ten minutes
      DateTime validFrom = DateTime.UtcNow;
      var nbf = ConvertToTimeT(validFrom);
      var exp = ConvertToTimeT(validFrom + TimeSpan.FromSeconds(JwtToAadLifetimeInSeconds));

      return new Dictionary<string, string>()
           {
                { "aud", aud },
                { "exp", exp.ToString() },
                { "iss", ConfidentialClientID },
                { "jti", Guid.NewGuid().ToString() },
                { "nbf", nbf.ToString() },
                { "sub", ConfidentialClientID }
            };
}
```

Here is how to craft a signed client assertion:

```CSharp
string Encode(byte[] arg)
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

string GetAssertion()
{
    //Signing with SHA-256
    string rsaSha256Signature = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    X509Certificate2 certificate = ReadCertificate(config.CertificateName);

    //Create RSACryptoServiceProvider
    var x509Key = new X509AsymmetricSecurityKey(certificate);
    var privateKeyXmlParams = certificate.PrivateKey.ToXmlString(true);
    var rsa = new RSACryptoServiceProvider();
    rsa.FromXmlString(privateKeyXmlParams);

    //alg represents the desired signing algorithm, which is SHA-256 in this case
    //kid represents the certificate thumbprint
    var header = new Dictionary<string, string>()
         {
              { "alg", "RS256"},
              { "kid", Encode(Certificate.GetCertHash()) }
         };

    //Please see the previous code snippet on how to craft claims for the GetClaims() method
    string token = Encode(Encoding.UTF8.GetBytes(JObject.FromObject(header).ToString())) + "." + Encode(Encoding.UTF8.GetBytes(JObject.FromObject(GetClaims())));

    string signature = Encode(rsa.SignData(Encoding.UTF8.GetBytes(token), new SHA256Cng()));
    string SignedAssertion = string.Concat(token, ".", signature);
    return SignedAssertion;
}
```

### WithClientClaims

`WithClientClaims(X509Certificate2 certificate, IDictionary<string, string> claimsToSign, bool mergeWithDefaultClaims = true)` by default will produce a signed assertion containing the claims expected by Azure AD plus additional client claims that you want to send. Here is a code snippet on how to do that.

```CSharp
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
