---
title: Secure a Restful service in your Azure AD B2C
titleSuffix: Azure AD B2C
description: Secure your custom REST API claims exchanges in your Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/24/2020
ms.author: mimart
ms.subservice: B2C
---
# Secure your RESTful services 

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In the integrate REST API claims exchanges in your Azure AD B2C user journey to [validate user input](custom-policy-rest-api-claims-validation.md), and [Add REST API claims exchanges to custom policies](custom-policy-rest-api-claims-exchange.md) articles, you use a RESTful service (web API) that integrates with Azure Active Directory B2C (Azure AD B2C) user journeys without authentication. In this article, you learn how to configure Azure AD B2C to authenticate itself to a RESTful service that is protected by HTTP basic authentication, client certificate, or an OAuth2 bearer toke.

## Prerequisites

Complete the steps in one of the following how to guides:

- [Integrate REST API claims exchanges in your Azure AD B2C user journey to validate user input](custom-policy-rest-api-claims-validation.md).
- [Add REST API claims exchanges to custom policies](custom-policy-rest-api-claims-exchange.md)

## HTTP Basic Authentication

Basic authentication is defined in [RFC 2617](https://tools.ietf.org/html/rfc2617). Basic authentication works as follows, Azure AD B2C sends an HTTP request, with the client credentials in the Authorization header. The credentials are formatted as the string "name:password", base64-encoded. The credentials are not encrypted. The username is stored in BasicAuthenticationPassword cryptographic key. The password is stored in cryptographic key.

### Add REST API username and password policy keys

To configure a REST API technical profile with HTTP Basic Authentication, you create the cryptographic keys:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
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

After you created the necessary keys, you need to configure your REST API technical profile metadata

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

The following is an example of a RESTful technical profile configure with HTTP basic authentication:

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

Client Certificate Authentication is a mutual certificate based authentication, where the client, Azure AD B2C provides its Client Certificate to the Server to prove its identity. This happens as a part of the SSL Handshake. Only services that have proper certificates, such as Azure AD B2C, can access your REST API service. The Client Certificate is a X.509 digital certificate.

### Prepare a self-signed certificate (optional)

If you don't already have a certificate, you can use a self-signed certificate for this tutorial. On Windows, you can use PowerShell's [New-SelfSignedCertificate](https://docs.microsoft.com/powershell/module/pkiclient/new-selfsignedcertificate) cmdlet to generate a certificate.

1. Execute this PowerShell command to generate a self-signed certificate. Modify the `-Subject` argument as appropriate for your application and Azure AD B2C tenant name. You can also adjust the `-NotAfter` date to specify a different expiration for the certificate.
    ```PowerShell
    New-SelfSignedCertificate `
        -KeyExportPolicy Exportable `
        -Subject "CN=yourappname.yourtenant.onmicrosoft.com" `
        -KeyAlgorithm RSA `
        -KeyLength 2048 `
        -KeyUsage DigitalSignature `
        -NotAfter (Get-Date).AddMonths(12) `
        -CertStoreLocation "Cert:\CurrentUser\My"
    ```    
1. Open **Manage user certificates** > **Current User** > **Personal** > **Certificates** > *yourappname.yourtenant.onmicrosoft.com*
1. Select the certificate > **Action** > **All Tasks** > **Export**
1. Select **Yes** > **Next** > **Yes, export the private key** > **Next**
1. Accept the defaults for **Export File Format**
1. Provide a password for the certificate

### Add client certificate policy key

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. In the **Options** box, select **Upload**.
1. In the **Name** box, type **RestApiClientCertificate**.
    The prefix *B2C_1A_* is added automatically.
1. In the **File upload** box, select your certificate's .pfx file with a private key.
1. In the **Password** box, type the certificate's password.
1. Select **Create**.

### Configure your REST API technical profile to use client certificate authentication

After you created the necessary policy key, you need to configure your REST API technical profile metadata

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

The following is an example of a RESTful technical profile configure with HTTP client certificate:

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

## OAuth2 Bearer authentication 

Bearer token authentication is defined in [OAuth2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](https://www.rfc-editor.org/rfc/rfc6750.txt). Bearer token authentication works as follows, Azure AD B2C sends an HTTP request, with a token in the Authorization header. 

```http
Authorization: Bearer <token>
```

A Bearer Token is an opaque string. It can be a JWT access token or any string the REST API expecting Azure AD B2C to send in the Authorization header. Azure AD B2C supports:

- A bearer token - To be able to send the bearer token in the Restful technical profile, your policy needs first to acquire the bearer token and then use it in the Restful technical profile. 
- A static bearer token - Use this approach when your REST API issued a log term access token. To use a static bearer token, create a policy key and make a reference from the Restful technical profile to your policy key. 

## Using OAuth2 Bearer  

Demonstrate how to obtain a token using client credential flow then send the token to a REST API service.

### Step 1: Configure a web app for OAuth2

To set up **Azure App Service** to require OAUTH2, in the Azure portal, open your web app page (If using an Azure Function change to the Platform Features Tab and select All Settings). In the left navigation, under **Settings** select **Authentication / Authorization**. Turn on the **App Service Authentication** option. Under `Action to take when request is not authenticated` change the option to **Log in with Azure Active Directory**.
Under **Authentication Providers** select **Azure Active Directory**. Change the management mode to **Express**. Leave the default Management mode of **Create new AD App** selected, give it a name and leave the default (Off) for Grant common data service permissions. Then click OK. Click **Save**

### Step 2: Set a Client Secret on the AAD Application Object

Change to the Azure Active Directory Blade and select **App Registrations** from the left pane under Manage.
You should see your Application with the name you gave above in the **Owned application** section. Select that application, select **Certificates & Secrets** on the left under Manage. Click **New CLient Secret** under Client Secrets, give it a description and set your desired expiration time. On the secret you just created copy the Value for later. Change to the Overview section on the left, and also take a copy of the **Application (client) ID** you will use both of these later to retrieve an access token.

### Step 3: Upload your Client ID and Secret to Azure AD B2C policy keys

After you set `Action to take when request is not authenticated` to *Log in with Azure Active Directory*, the communication with your RESTful API requires a Bearer token (OAUTH2). To store the ClientId and Secret used to obtain the Bearer token within B2C do the following:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. In the **Options** box, select **Manual**.
1. In the **Name** box, type **SecureRESTClientId**.
    The prefix *B2C_1A_* is added automatically.
1. In the **Secret** box, enter the Client Id you created in the previous step.
1. For **Key usage**, select Signature.
1. Select **Create**.
1. Follow the steps (1 - 8) above to create another key to store the client secret you obtained in the last step. Call this key **SecureRESTClientSecret**
1. To view the keys that are available in your tenant and confirm that you've created the `B2C_1A_SecureRESTClientId` and `B2C_1A_SecureRESTClientSecret` keys, select **Policy Keys**.

### Step 4: Create a technical profile to retrive the Access Token

To support OAUTH2 authentication in your custom policy, add the following technical profile:

```xml
<TechnicalProfile Id="SecureREST-AccessToken">
  <DisplayName></DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ServiceUrl">https://login.microsoftonline.com/microsoft.com/oauth2/v2.0/token</Item>
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

### Step 5: Change the REST technical profile to use Bearer Token Authentication

To support Bearer Token authentication in your custom policy, change the technical profile by doing the following:

1. In your working directory, open the *TrustFrameworkExtensions.xml* extension policy file.
1. Search for the `<TechnicalProfile>` node that includes `Id="REST-API-SignUp"`.
1. Locate the `<Metadata>` element.
1. Change the *AuthenticationType* to *Bearer*, as follows:
    ```xml
    <Item Key="AuthenticationType">Bearer</Item>
    ```
1. Change the *UseClaimAsBearerToken* to *bearerToken*, as follows:

    ```xml
    <Item Key="UseClaimAsBearerToken">bearerToken</Item>
    ```
    (bearerToken is the name of the claim the Bearer token will be retrieved from)
    
1. Ensure you add the claim used above as an input claim:

    ```xml
    <InputClaim ClaimTyeRefernceId="bearerToken"/>
    ```    

After you add the above snippets, your technical profile should look like the following XML code:

```XML
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
        <InputClaim ClaimTyeRefernceId="bearerToken"/>
      </InputClaims>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Using static OAuth2 Bearer 

### Add OAuth2 bearer token policy key

Create a policy key to store the bearer token value.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose your Azure AD B2C directory.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `RestApiBearerToken`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter your client secret that you previously recorded.
1. For **Key usage**, select `Encryption`.
1. Select **Create**.

### Configure your REST API technical profile to use bearer token policy key

After you created the necessary policy key, you need to configure your REST API technical profile metadata

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

The following is an example of a RESTful technical profile configure with HTTP client certificate:

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
        <Key Id="ClientCertificate" StorageReferenceId="B2C_1A_RestApiBearerToken" />
      </CryptographicKeys>
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Next steps

- Learn more about [Restful technical profile](restful-technical-profile.md) element in the IEF reference. 