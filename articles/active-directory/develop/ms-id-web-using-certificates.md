---
title: Microsoft identity web - Using certificates
titleSuffix: Microsoft identity platform
description: Learn how to use certificates with Microsoft identity web for app client credentials or token decryption.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 09/27/2020
ms.author: jmprieur
ms.reviewer: marsma
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn how to build ASP.NET Core web apps and web api calling or not downstream apis.
---

# Using certificates with Microsoft.Identity.Web

Microsoft.Identity.Web uses certificates in two situations:

- In web apps and web APIs, to prove the identity of the application, instead of using a client secret.
- In web APIs, to decrypt tokens if the web API opted to get encrypted tokens.

Also certificates can be specified both by configuration, in the configuration file, or programmatically. 

This article explains both usages, and describes the certificates to use.

Table of contents:
- [Using certificates with Microsoft.Identity.Web](#using-certificates-with-microsoftidentityweb)
  - [Client certificates](#client-certificates)
    - [Describing client certificates to use by configuration](#describing-client-certificates-to-use-by-configuration)
    - [Describing client certificates to use programmatically](#describing-client-certificates-to-use-programmatically)
    - [Helping certificate rotation by sending x5c](#helping-certificate-rotation-by-sending-x5c)
  - [Decryption certificates](#decryption-certificates)
    - [Describing decryption certificates to use by configuration](#describing-decryption-certificates-to-use-by-configuration)
    - [Describing decryption certificates to use programmatically](#describing-decryption-certificates-to-use-programmatically)
      - [Specifying certificates as an X509Certificate2](#specifying-certificates-as-an-x509certificate2)
  - [Specifying certificates](#specifying-certificates)
    - [Getting certificates from Key Vault](#getting-certificates-from-key-vault)
      - [Microsoft.Identity.Web leverages Managed Identity](#microsoftidentityweb-leverages-managed-identity)
    - [Specifying certificates](#specifying-certificates-1)
    - [Microsoft Identity Web classes used for certificate management](#microsoft-identity-web-classes-used-for-certificate-management)

## Client certificates

Web apps and web APIs are confidential client applications.

They can prove their identity to Azure AD or Azure AD B2C by three means:

| Method              | Supported in Microsoft.Identity.Web |
| ------------------- | ----------------------------------- |
| Client secrets      | Yes                                 |
| Client certificates | Yes                                 |
| Client assertions   | Not yet                             |

 Microsoft.Identity.Web supports specifying client certificates. The configuration property to specify the client certificates is **ClientCertificates**. It's an array of certificate descriptions. There are several ways of describing certificates. see [Specifying certificates](#specifying-certificates) below.

### Describing client certificates to use by configuration

You can express the client certificates in the **ClientCertificates** property. **ClientCertificates** and **ClientSecret** are mutually exclusive.

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "msidentitysamplestesting.onmicrosoft.com",
    "TenantId": "7f58f645-c190-4ce5-9de4-e2b7acd2a6ab",
    "ClientId": "86699d80-dd21-476a-bcd1-7c1a3d471f75",

    "ClientCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
     ]
  }
}
```

See [Specifying certificates](#specifying-certificates) below for all the ways to describe certificates.

### Describing client certificates to use programmatically

You can also specify the certificate description programmatically. For this, you add `CertificateDescription` instances to the `ClientCertificates` property of `MicrosoftIdentityOptions`. You can then use some of the overloads of `AddMicrosoftIdentityWebApp`, `EnableTokenAcquisitionToCallDownstreamApi` using delegates to set the `MicrosoftIdentityOptions`.

```Csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromKeyVault("https://msidentitywebsamples.vault.azure.net",
                                     "MicrosoftIdentitySamplesCert")
};
```

See [Specifying certificates](#specifying-certificates) below for all the ways to describe certificates.

### Helping certificate rotation by sending x5c

It's possible to specify if the x5c claim (public key of the certificate) should be sent to the STS each
time the web app or web API calls Azure AD. Sending the x5c enables application developers to achieve easy certificate
rollover in Azure AD: this method will send the public certificate to Azure AD along with the token request,
so that Azure AD can use it to validate the subject name based on a trusted issuer policy.
This saves the application admin from the need to explicitly manage the certificate rollover
(either via portal or PowerShell/CLI operation). For details see https://aka.ms/msal-net-sni.

To specify to send the x5c claim, set the boolean `SendX5C` property of the options to true either by configuration
or programmatically.

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "msidentitysamplestesting.onmicrosoft.com",
    "TenantId": "7f58f645-c190-4ce5-9de4-e2b7acd2a6ab",
    "ClientId": "86699d80-dd21-476a-bcd1-7c1a3d471f75",

    "TokenDecryptionCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
     ],
     "SendX5C": "true"
  }
}
```

## Decryption certificates

Web APIs can request token encryption (for privacy reasons). This is even compulsory for first-party (Microsoft) web APIs that access MSA identities. The configuration property to specify the client certificates is **TokenDecryptionCertificates**. It's an array of descriptions of certificates.

### Describing decryption certificates to use by configuration

You can express the decryption certificates in the `TokenDecryptionCertificates` property.

```Json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "msidentitysamplestesting.onmicrosoft.com",
    "TenantId": "7f58f645-c190-4ce5-9de4-e2b7acd2a6ab",
    "ClientId": "86699d80-dd21-476a-bcd1-7c1a3d471f75",

    "TokenDecryptionCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
     ]
  }
}
```

See [Specifying certificates](#specifying-certificates) below for all the ways to describe certificates.

### Describing decryption certificates to use programmatically

You can also specify the certificate description programmatically:

```Csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.TokenDecryptionCertificates = new CertificateDescription[] {
 CertificateDescription.FromKeyVault("https://msidentitywebsamples.vault.azure.net",
                                     "MicrosoftIdentitySamplesCert")
};
```

See [Specifying certificates](#specifying-certificates) below for all the ways to describe certificates.

#### Specifying certificates as an X509Certificate2

You can also directly specify the certificate description as an X509Certificate2 that would you've loaded. This is only possible programmatically

```csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromCertificate(x509certificate2)
};
```

## Specifying certificates

You can describe the certificates to load, either by configuration, or programmatically:

- from the certificate store (Windows) and a thumbprint ("440A5BE6C4BE2FF02A0ADBED1AAA43D6CF12E269"),
- from the certificate store (Windows) and a distinguished name ("CN=TestCert"),
- from a path on the disk and optionally a password (probably only for debugging locally),
- directly from a Base64 representation of the certificate,
- from Azure Key Vault,
- directly providing it (programmatically only).

Describing the certificate by configuration allows for just-in-time loading, rather than paying the startup cost. For instance for a web app that signs in a user, don(t load the certificate until an access token is needed to call a web API.

When your certificate is in Key Vault, Microsoft.Identity.Web leverages Managed Identity, therefore enabling your application to have the same code when deployed (for instance on a VM or Azure app services), or locally on your developer box (using developer credentials).

The following sections show how to specify the client credential certificates, but the principle is the same for the decryption certificates. Just replace `ClientCertificates` with `TokenDecryptionCertificates`.

### Getting certificates from Key Vault

#### Microsoft.Identity.Web leverages Managed Identity

To fetch certificates from KeyVault, Microsoft.Identity.Web leverages Managed Identity through the Azure SDK
[DefaultAzureCredential](https://azure.github.io/azure-sdk/posts/2020-02-25/defaultazurecredentials.html).

This works out of the box on the developer machine using the developer credentials, and also when deployed with Service fabric or App Services in Azure
provided you've been using a System-assigned Managed identity.

However:

- If you're using a User-assigned managed identity, you'll need to set an environment variable AZURE_CLIENT_ID to be the
user-assigned managed identity clientID. You can do that through the Azure portal:
  1. Go to Azure App Service -> Settings | Configuration -> Application  Settings
  2. Add or update the `AZURE_CLIENT_ID` app setting to the user assigned managed identity ID.

- When used on your developer machine, you have several accounts in Visual Studio, you'll need to specify
  which account to use, by setting another environment variable `AZURE_USERNAME`

### Specifying certificates

<table>
<tr>
<td>How to get the certificate</td>
<td>By configuration</td>
<td>Programmatically</td>
</tr>

<tr>
<td>From KeyVault</td>
<td>

```Json
{
    "ClientCertificates": [
      {
        "SourceType": "KeyVault",
        "KeyVaultUrl": "https://msidentitywebsamples.vault.azure.net",
        "KeyVaultCertificateName": "MicrosoftIdentitySamplesCert"
      }
     ]
  }
}
```

</td>

<td>

```CSharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromKeyVault("https://msidentitywebsamples.vault.azure.net",
                                     "MicrosoftIdentitySamplesCert")
};
```

</td>
</tr>

<tr>
<td>From a path</td>
<td>

```Json
{
    "ClientCertificates": [
      {
       "SourceType": "Path",
       "CertificateDiskPath": "c:\\temp\\WebAppCallingWebApiCert.pfx",
      "CertificatePassword": "password"
      }]
}
```

</td>

<td>

```CSharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromPath(@"c:\temp\WebAppCallingWebApiCert.pfx",
                                     "password")
};
```

</td>
</tr>

<tr>
<td>By distinguished name</td>
<td>

```Json
{
    "ClientCertificates": [
      {
      "SourceType": "StoreWithDistinguishedName",
      "CertificateStorePath": "CurrentUser/My",
      "CertificateDistinguishedName": "CN=WebAppCallingWebApiCert"
      }]
}
```

</td>

<td>

```csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromStoreWithDistinguishedName(StoreLocation.CurrentUser,
                                     StoreName.My,
                                     "CN=WebAppCallingWebApiCert")
};
```

</td>
</tr>

<tr>
<td>By thumbprint</td>
<td>

```Json
{
    "ClientCertificates": [
      {
       "SourceType": "StoreWithThumbprint",
       "CertificateStorePath": "CurrentUser/My",
       "CertificateThumbprint": "962D129A859174EE8B5596985BD18EFEB6961684"
      }]
}
```

</td>

<td>

```csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromStoreWithThumbprint(StoreLocation.CurrentUser,
                                     StoreName.My,
                                     "962D129A859174EE8B5596985BD18EFEB6961684")
};
```

</td>
</tr>

<tr>
<td>By Base64 encoding</td>
<td>

```Json
{
    "ClientCertificates": [
      {
       "SourceType": "Base64Encoded",
       "Base64EncodedValue": "MIIDHzCCAgegA.....r1n8Czew8TPfab4OG37BuEMNmBpqoRrRgFnDzVtItOnhuFTa0="
      }]
}
```

</td>

<td>

```csharp
MicrosoftIdentityOptions options = new MicrosoftIdentityOptions();
options.ClientCertificates = new CertificateDescription[] {
 CertificateDescription.FromBase64Encoded("MIIDHzCCAgegA.....r1n8Czew8TPfab4OG37BuEMNmBpqoRrRgFnDzVtItOnhuFTa0=")
};
```

</td>

</tr>

</table>



### Microsoft Identity Web classes used for certificate management

This is a class diagram showing how the classes involved in certificate management in Microsoft.Identity.Web are articulated:

  ![image](https://user-images.githubusercontent.com/13203188/84315481-06f7af00-ab6a-11ea-85fd-2aa615f79520.png)
