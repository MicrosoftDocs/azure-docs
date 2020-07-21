---
title: Secure a Restful service in your Azure AD B2C
titleSuffix: Azure AD B2C
description: Secure your custom REST API claims exchanges in your Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2020
ms.author: mimart
ms.subservice: B2C
---

# Secure your RESTful services 

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

When integrating a REST API within an Azure AD B2C user journey, you must protect your REST API endpoint with authentication. This ensures that only services that have proper credentials, such as Azure AD B2C, can make calls to your REST API endpoint.

Learn how to integrate a REST API within your Azure AD B2C user journey in the [validate user input](custom-policy-rest-api-claims-validation.md) and [Add REST API claims exchanges to custom policies](custom-policy-rest-api-claims-exchange.md) articles.

This article will explore how to secure your REST API with either HTTP basic, client certificate or OAuth2 authentication. 

## Prerequisites

Complete the steps in one of the following 'How to' guides:

- [Integrate REST API claims exchanges in your Azure AD B2C user journey to validate user input](custom-policy-rest-api-claims-validation.md).
- [Add REST API claims exchanges to custom policies](custom-policy-rest-api-claims-exchange.md)

## HTTP basic authentication

HTTP basic authentication is defined in [RFC 2617](https://tools.ietf.org/html/rfc2617). Basic authentication works as follows: Azure AD B2C sends an HTTP request with the client credentials in the Authorization header. The credentials are formatted as the base64-encoded string "name:password".  

### Add REST API username and password policy keys

To configure a REST API technical profile with HTTP basic authentication, create the following cryptographic keys to store the username and password:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys**, and then select **Add**.
1. For **Options**, select **Manual**.
1. For **Name**, type **RestApiUsername**.
    The prefix *B2C_1A_* might be added automatically.
1. In the **Secret** box, enter the REST API username.
1. For **Key usage**, select **Encryption**.
1. Select **Create**.
1. Select **Policy Keys** again.
1. Select **Add**.
1. For **Options**, select **Manual**.
1. For **Name**, type **RestApiPassword**.
    The prefix *B2C_1A_* might be added automatically.
1. In the **Secret** box, enter the REST API password.
1. For **Key usage**, select **Encryption**.
1. Select **Create**.

### Configure your REST API technical profile to use HTTP basic authentication

After creating the necessary keys, configure your REST API technical profile metadata to reference the credentials.

1. In your working directory, open the extension policy file (TrustFrameworkExtensions.xml).
1. Search for the REST API technical profile. For example `REST-ValidateProfile`, or `REST-GetProfile`.
1. Locate the `<Metadata>` element.
1. Change the *AuthenticationType* to `Basic`.
1. Change the *AllowInsecureAuthInProduction* to `false`.
1. Immediately after the closing `</Metadata>` element, add the following XML snippet:
    ```xml
    <CryptographicKeys>
        <Key Id="BasicAuthenticationUsername" StorageReferenceId="B2C_1A_RestApiUsername" />
        <Key Id="BasicAuthenticationPassword" StorageReferenceId="B2C_1A_RestApiPassword" />
    </CryptographicKeys>
    ```

The following is an example of a RESTful technical profile configured with HTTP basic authentication:

```xml
<ClaimsProvider>
  <DisplayName>REST APIs</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="REST-GetProfile">
      <DisplayName>Get user extended profile Azure Function web hook</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://your-account.azurewebsites.net/api/GetProfile?code=your-code</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AuthenticationType">Basic</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="BasicAuthenticationUsername" StorageReferenceId="B2C_1A_RestApiUsername" />
        <Key Id="BasicAuthenticationPassword" StorageReferenceId="B2C_1A_RestApiPassword" />
      </CryptographicKeys>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## HTTPS client certificate authentication

Client certificate authentication is a mutual certificate-based authentication, where the client, Azure AD B2C, provides its client certificate to the server to prove its identity. This happens as a part of the SSL handshake. Only services that have proper certificates, such as Azure AD B2C, can access your REST API service. The client certificate is an X.509 digital certificate. In production environments, it must be signed by a certificate authority.

### Prepare a self-signed certificate (optional)

For non-production environments, if you don't already have a certificate, you can use a self-signed certificate. On Windows, you can use PowerShell's [New-SelfSignedCertificate](https://docs.microsoft.com/powershell/module/pkiclient/new-selfsignedcertificate) cmdlet to generate a certificate.

1. Execute this PowerShell command to generate a self-signed certificate. Modify the `-Subject` argument as appropriate for your application and Azure AD B2C tenant name. You can also adjust the `-NotAfter` date to specify a different expiration for the certificate.
    ```powershell
    New-SelfSignedCertificate `
        -KeyExportPolicy Exportable `
        -Subject "CN=yourappname.yourtenant.onmicrosoft.com" `
        -KeyAlgorithm RSA `
        -KeyLength 2048 `
        -KeyUsage DigitalSignature `
        -NotAfter (Get-Date).AddMonths(12) `
        -CertStoreLocation "Cert:\CurrentUser\My"
    ```    
1. Open **Manage user certificates** > **Current User** > **Personal** > **Certificates** > *yourappname.yourtenant.onmicrosoft.com*.
1. Select the certificate > **Action** > **All Tasks** > **Export**.
1. Select **Yes** > **Next** > **Yes, export the private key** > **Next**.
1. Accept the defaults for **Export File Format**.
1. Provide a password for the certificate.

### Add a client certificate policy key

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys**, and then select **Add**.
1. In the **Options** box, select **Upload**.
1. In the **Name** box, type **RestApiClientCertificate**.
    The prefix *B2C_1A_* is added automatically.
1. In the **File upload** box, select your certificate's .pfx file with a private key.
1. In the **Password** box, type the certificate's password.
1. Select **Create**.

### Configure your REST API technical profile to use client certificate authentication

After creating the necessary key, configure your REST API technical profile metadata to reference the client certificate.

1. In your working directory, open the extension policy file (TrustFrameworkExtensions.xml).
1. Search for the REST API technical profile. For example `REST-ValidateProfile`, or `REST-GetProfile`.
1. Locate the `<Metadata>` element.
1. Change the *AuthenticationType* to `ClientCertificate`.
1. Change the *AllowInsecureAuthInProduction* to `false`.
1. Immediately after the closing `</Metadata>` element, add the following XML snippet:
    ```xml
    <CryptographicKeys>
       <Key Id="ClientCertificate" StorageReferenceId="B2C_1A_RestApiClientCertificate" />
    </CryptographicKeys>
    ```

The following is an example of a RESTful technical profile configured with an HTTP client certificate:

```xml
<ClaimsProvider>
  <DisplayName>REST APIs</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="REST-GetProfile">
      <DisplayName>Get user extended profile Azure Function web hook</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://your-account.azurewebsites.net/api/GetProfile?code=your-code</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AuthenticationType">ClientCertificate</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="ClientCertificate" StorageReferenceId="B2C_1A_RestApiClientCertificate" />
      </CryptographicKeys>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## OAuth2 bearer authentication 

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

Bearer token authentication is defined in [OAuth2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt). In bearer token authentication, Azure AD B2C sends an HTTP request with a token in the authorization header.

```http
Authorization: Bearer <token>
```

A bearer token is an opaque string. It can be a JWT access token or any string that the REST API expects Azure AD B2C to send in the authorization header. Azure AD B2C supports the following types:

- **Bearer token**. To be able to send the bearer token in the Restful technical profile, your policy needs to first acquire the bearer token and then use it in the RESTful technical profile.  
- **Static bearer token**. Use this approach when your REST API issues a long-term access token. To use a static bearer token, create a policy key and make a reference from the RESTful technical profile to your policy key. 


## Using OAuth2 Bearer  

The following steps demonstrate how to use client credentials to obtain a bearer token and pass it into the Authorization header of the REST API calls.  

### Define a claim to store the bearer token

A claim provides temporary storage of data during an Azure AD B2C policy execution. The [claims schema](claimsschema.md) is the place where you declare your claims. The access token must be stored in a claim to be used later. 

1. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.
1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Locate the [ClaimsSchema](claimsschema.md) element. If the element doesn't exist, add it.
1. Add the following claims to the **ClaimsSchema** element.  

```xml
<ClaimType Id="bearerToken">
  <DisplayName>Bearer token</DisplayName>
  <DataType>string</DataType>
</ClaimType>
<ClaimType Id="grant_type">
  <DisplayName>Grant type</DisplayName>
  <DataType>string</DataType>
</ClaimType>
<ClaimType Id="scope">
  <DisplayName>scope</DisplayName>
  <DataType>string</DataType>
</ClaimType>
```

### Acquiring an access token 

You can obtain an access token in one of several ways: by obtaining it [from a federated identity provider](idp-pass-through-custom.md), by calling a REST API that returns an access token, by using an [ROPC flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc), or by using the [client credentials flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow).  

The following example uses a REST API technical profile to make a request to the Azure AD token endpoint using the client credentials passed as HTTP basic authentication. To configure this in Azure AD, see [Microsoft identity platform and the OAuth 2.0 client credentials flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow). You may need to modify this to interface with your Identity Provider. 

For the ServiceUrl, replace your-tenant-name with the name of your Azure AD tenant. See the [RESTful technical profile](restful-technical-profile.md) reference for all options available.

```xml
<TechnicalProfile Id="SecureREST-AccessToken">
  <DisplayName></DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://login.microsoftonline.com/your-tenant-name.onmicrosoft.com/oauth2/v2.0/token</Item>
    <Item Key="AuthenticationType">Basic</Item>
     <Item Key="SendClaimsIn">Form</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="BasicAuthenticationUsername" StorageReferenceId="B2C_1A_SecureRESTClientId" />
    <Key Id="BasicAuthenticationPassword" StorageReferenceId="B2C_1A_SecureRESTClientSecret" />
  </CryptographicKeys>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="grant_type" DefaultValue="client_credentials" />
    <InputClaim ClaimTypeReferenceId="scope" DefaultValue="https://secureb2cfunction.azurewebsites.net/.default" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="bearerToken" PartnerClaimType="access_token" />
  </OutputClaims>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

### Change the REST technical profile to use bearer token authentication

To support bearer token authentication in your custom policy, modify the REST API technical profile with the following:

1. In your working directory, open the *TrustFrameworkExtensions.xml* extension policy file.
1. Search for the `<TechnicalProfile>` node that includes `Id="REST-API-SignUp"`.
1. Locate the `<Metadata>` element.
1. Change the *AuthenticationType* to *Bearer*, as follows:
    ```xml
    <Item Key="AuthenticationType">Bearer</Item>
    ```
1. Change or add the *UseClaimAsBearerToken* to *bearerToken*, as follows. The *bearerToken* is the name of the claim that the bearer token will be retrieved from (the output claim from `SecureREST-AccessToken`).

    ```xml
    <Item Key="UseClaimAsBearerToken">bearerToken</Item>
    ```
    
1. Ensure you add the claim used above as an input claim:

    ```xml
    <InputClaim ClaimTypeReferenceId="bearerToken"/>
    ```    

After you add the above snippets, your technical profile should look like the following XML code:

```xml
<ClaimsProvider>
  <DisplayName>REST APIs</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="REST-GetProfile">
      <DisplayName>Get user extended profile Azure Function web hook</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://your-account.azurewebsites.net/api/GetProfile?code=your-code</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AuthenticationType">Bearer</Item>
        <Item Key="UseClaimAsBearerToken">bearerToken</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="bearerToken"/>
      </InputClaims>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Using a static OAuth2 bearer 

### Add the OAuth2 bearer token policy key

Create a policy key to store the bearer token value.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys**, and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `RestApiBearerToken`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter your client secret that you previously recorded.
1. For **Key usage**, select `Encryption`.
1. Select **Create**.

### Configure your REST API technical profile to use the bearer token policy key

After creating the necessary key, configure your REST API technical profile metadata to reference the bearer token.

1. In your working directory, open the extension policy file (TrustFrameworkExtensions.xml).
1. Search for the REST API technical profile. For example `REST-ValidateProfile`, or `REST-GetProfile`.
1. Locate the `<Metadata>` element.
1. Change the *AuthenticationType* to `Bearer`.
1. Change the *AllowInsecureAuthInProduction* to `false`.
1. Immediately after the closing `</Metadata>` element, add the following XML snippet:
    ```xml
    <CryptographicKeys>
       <Key Id="BearerAuthenticationToken" StorageReferenceId="B2C_1A_RestApiBearerToken" />
    </CryptographicKeys>
    ```

The following is an example of a RESTful technical profile configured with bearer token authentication:

```xml
<ClaimsProvider>
  <DisplayName>REST APIs</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="REST-GetProfile">
      <DisplayName>Get user extended profile Azure Function web hook</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://your-account.azurewebsites.net/api/GetProfile?code=your-code</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AuthenticationType">Bearer</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="BearerAuthenticationToken" StorageReferenceId="B2C_1A_RestApiBearerToken" />
      </CryptographicKeys>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Next steps

- Learn more about the [Restful technical profile](restful-technical-profile.md) element in the IEF reference. 
