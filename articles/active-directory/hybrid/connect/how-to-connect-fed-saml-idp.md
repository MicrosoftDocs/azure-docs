---
title: 'Microsoft Entra Connect: Use a SAML 2.0 Identity Provider for Single Sign On - Azure'
description: This document describes using a SAML 2.0 compliant Idp for single sign on.
services: active-directory
author: billmath
manager: amycolannino
ms.custom: it-pro, has-azure-ad-ps-ref
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

#  Use a SAML 2.0 Identity Provider (IdP) for Single Sign On

This document contains information on using a SAML 2.0 compliant SP-Lite profile-based Identity Provider as the preferred Security Token Service (STS) / identity provider. This scenario is useful when you already have a user directory and password store on-premises that can be accessed using SAML 2.0. This existing user directory can be used for sign-on to Microsoft 365 and other Microsoft Entra ID-secured resources. The SAML 2.0 SP-Lite profile is based on the widely used Security Assertion Markup Language (SAML) federated identity standard to provide a sign-on and attribute exchange framework.

>[!NOTE]
>For a list of 3rd party Idps that have been tested for use with Microsoft Entra ID see the [Microsoft Entra federation compatibility list](how-to-connect-fed-compatibility.md)

Microsoft supports this sign-on experience as the integration of a Microsoft cloud service, such as Microsoft 365, with your properly configured SAML 2.0 profile-based IdP. SAML 2.0 identity providers are third-party products and therefore Microsoft does not provide support for the deployment, configuration, troubleshooting best practices regarding them. Once properly configured, the integration with the SAML 2.0 identity provider can be tested for proper configuration by using the Microsoft Connectivity Analyzer Tool, which is described in more detail below. For more information about your SAML 2.0 SP-Lite profile-based identity provider, ask the organization that supplied it.

> [!IMPORTANT]
> Only a limited set of clients are available in this sign-on scenario with SAML 2.0 identity providers, this includes:
> 
> - Web-based clients such as Outlook Web Access and SharePoint Online
> - Email-rich clients that use basic authentication and a supported Exchange access method such as IMAP, POP, Active Sync, MAPI, etc. (the Enhanced Client Protocol end point is required to be deployed), including:
>     - Microsoft Outlook 2010/Outlook 2013/Outlook 2016, Apple iPhone (various iOS versions)
>     - Various Google Android Devices
>     - Windows Phone 7, Windows Phone 7.8, and Windows Phone 8.0
>     - Windows 8 Mail Client and Windows 8.1 Mail Client
>     - Windows 10 Mail Client

All other clients are not available in this sign-on scenario with your SAML 2.0 Identity Provider. For example, the Lync 2010 desktop client is not able to sign in to the service with your SAML 2.0 Identity Provider configured for single sign-on.

<a name='azure-ad-saml-20-protocol-requirements'></a>

## Microsoft Entra SAML 2.0 protocol requirements
This document contains detailed requirements on the protocol and message formatting that your SAML 2.0 identity provider must implement to federate with Microsoft Entra ID to enable sign-on to one or more Microsoft cloud services (such as Microsoft 365). The SAML 2.0 relying party (SP-STS) for a Microsoft cloud service used in this scenario is Microsoft Entra ID.

It is recommended that you ensure your SAML 2.0 identity provider output messages be as similar to the provided sample traces as possible. Also, use specific attribute values from the supplied Microsoft Entra metadata where possible. Once you are happy with your output messages, you can test with the Microsoft Connectivity Analyzer as described below.

The Microsoft Entra metadata can be downloaded from this URL: [https://nexus.microsoftonline-p.com/federationmetadata/saml20/federationmetadata.xml](https://nexus.microsoftonline-p.com/federationmetadata/saml20/federationmetadata.xml).
For customers in China using the China-specific instance of Microsoft 365, the following federation endpoint should be used: [https://nexus.partner.microsoftonline-p.cn/federationmetadata/saml20/federationmetadata.xml](https://nexus.partner.microsoftonline-p.cn/federationmetadata/saml20/federationmetadata.xml).

## SAML protocol requirements
This section details how the request and response message pairs are put together in order to help you to format your messages correctly.

Microsoft Entra ID can be configured to work with identity providers that use the SAML 2.0 SP Lite profile with some specific requirements as listed below. Using the sample SAML request and response messages along with automated and manual testing, you can work to achieve interoperability with Microsoft Entra ID.

## Signature block requirements
Within the SAML Response message, the Signature node contains information about the digital signature for the message itself. The signature block has the following requirements:

1. The assertion node itself must be signed
2. The RSA-sha1 algorithm must be used as the DigestMethod. Other digital signature algorithms are not accepted.
   `<ds:DigestMethod Algorithm="https://www.w3.org/2000/09/xmldsig#sha1"/>`
3. You may also sign the XML document. 
4. The Transform Algorithm must match the values in the following sample:
       `<ds:Transform Algorithm="https://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
       <ds:Transform Algorithm="https://www.w3.org/2001/10/xml-exc-c14n#"/>`
9. The SignatureMethod Algorithm must match the following sample:
      `<ds:SignatureMethod Algorithm="https://www.w3.org/2000/09/xmldsig#rsa-sha1"/>`

>[!NOTE]
>In order to improve the security SHA-1 algorithm is deprecated. Ensure to use a more secure algorithm like SHA-256. More information [can be found](/lifecycle/announcements/sha-1-signed-content-retired).

## Supported bindings
Bindings are the transport-related communications parameters that are required. The following requirements apply to the bindings

1. HTTPS is the required transport.
2. Microsoft Entra ID will require HTTP POST for token submission during sign-in.
3. Microsoft Entra ID will use HTTP POST for the authentication request to the identity provider and REDIRECT for the sign out message to the identity provider.

## Required attributes
This table shows requirements for specific attributes in the SAML 2.0 message.
 
|Attribute|Description|
| ----- | ----- |
|NameID|The value of this assertion must be the same as the Microsoft Entra user’s ImmutableID. It can be up to 64 alpha numeric characters. Any non-html safe characters must be encoded, for example a “+” character is shown as “.2B”.|
|IDPEmail|The User Principal Name (UPN) is listed in the SAML response as an element with the name IDPEmail The user’s UserPrincipalName (UPN) in Microsoft Entra ID / Microsoft 365. The UPN is in email address format. UPN value in Windows Microsoft 365 (Microsoft Entra ID).|
|Issuer|Required to be a URI of the identity provider. Do not reuse the Issuer from the sample messages. If you have multiple top-level domains in your Microsoft Entra tenants the Issuer must match the specified URI setting configured per domain.|

>[!IMPORTANT]
>Microsoft Entra ID currently supports the following NameID Format URI for SAML 2.0:urn:oasis:names:tc:SAML:2.0:nameid-format:persistent.

## Sample SAML request and response messages
A request and response message pair is shown for the sign-on message exchange.
The following is a sample request message that is sent from Microsoft Entra ID to a sample SAML 2.0 identity provider. The sample SAML 2.0 identity provider is Active Directory Federation Services (AD FS) configured to use SAML-P protocol. Interoperability testing has also been completed with other SAML 2.0 identity providers.

```xml
  <samlp:AuthnRequest 
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" 
    ID="_7171b0b2-19f2-4ba2-8f94-24b5e56b7f1e" 
    IssueInstant="2014-01-30T16:18:35Z" 
    Version="2.0" 
    AssertionConsumerServiceIndex="0" >
        <saml:Issuer>urn:federation:MicrosoftOnline</saml:Issuer>
        <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"/>
  </samlp:AuthnRequest>
```

The following is a sample response message that is sent from the sample SAML 2.0 compliant identity provider to Microsoft Entra ID / Microsoft 365.

```xml
    <samlp:Response ID="_592c022f-e85e-4d23-b55b-9141c95cd2a5" Version="2.0" IssueInstant="2014-01-31T15:36:31.357Z" Destination="https://login.microsoftonline.com/login.srf" Consent="urn:oasis:names:tc:SAML:2.0:consent:unspecified" InResponseTo="_049917a6-1183-42fd-a190-1d2cbaf9b144" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">http://WS2012R2-0.contoso.com/adfs/services/trust</Issuer>
    <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success" />
    </samlp:Status>
    <Assertion ID="_7e3c1bcd-f180-4f78-83e1-7680920793aa" IssueInstant="2014-01-31T15:36:31.279Z" Version="2.0" xmlns="urn:oasis:names:tc:SAML:2.0:assertion">
    <Issuer>http://WS2012R2-0.contoso.com/adfs/services/trust</Issuer>
    <ds:Signature xmlns:ds="https://www.w3.org/2000/09/xmldsig#">
      <ds:SignedInfo>
        <ds:CanonicalizationMethod Algorithm="https://www.w3.org/2001/10/xml-exc-c14n#" />
        <ds:SignatureMethod Algorithm="https://www.w3.org/2000/09/xmldsig#rsa-sha1" />
        <ds:Reference URI="#_7e3c1bcd-f180-4f78-83e1-7680920793aa">
          <ds:Transforms>
            <ds:Transform Algorithm="https://www.w3.org/2000/09/xmldsig#enveloped-signature" />
            <ds:Transform Algorithm="https://www.w3.org/2001/10/xml-exc-c14n#" />
          </ds:Transforms>
          <ds:DigestMethod Algorithm="https://www.w3.org/2000/09/xmldsig#sha1" />
          <ds:DigestValue>CBn/5YqbheaJP425c0pHva9PhNY=</ds:DigestValue>
        </ds:Reference>
      </ds:SignedInfo>
      <ds:SignatureValue>TciWMyHW2ZODrh/2xrvp5ggmcHBFEd9vrp6DYXp+hZWJzmXMmzwmwS8KNRJKy8H7XqBsdELA1Msqi8I3TmWdnoIRfM/ZAyUppo8suMu6Zw+boE32hoQRnX9EWN/f0vH6zA/YKTzrjca6JQ8gAV1ErwvRWDpyMcwdYCiWALv9ScbkAcebOE1s1JctZ5RBXggdZWrYi72X+I4i6WgyZcIGai/rZ4v2otoWAEHS0y1yh1qT7NDPpl/McDaTGkNU6C+8VfjD78DrUXEcAfKvPgKlKrOMZnD1lCGsViimGY+LSuIdY45MLmyaa5UT4KWph6dA==</ds:SignatureValue>
      <KeyInfo xmlns="https://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIC7jCCAdagAwIBAgIQRrjsbFPaXIlOG3GTv50fkjANBgkqhkiG9w0BAQsFADAzMTEwLwYDVQQDEyhBREZTIFNpZ25pbmcgLSBXUzIwMTJSMi0wLnN3aW5mb3JtZXIuY29tMB4XDTE0MDEyMDE1MTY0MFoXDTE1MDEyMDE1MTY0MFowMzExMC8GA1UEAxMoQURGUyBTaWduaW5nIC0gV1MyMDEyUjItMC5zd2luZm9ybWVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKe+rLVmXy1QwCwZwqgbbp1/+3ZWxd9T/jV0hpLIIWr+LCOHqq8n8beJvlivgLmDJo8f+EITnAxWcsJUvVai/35AhHCUq9tc9sqMp5PWtabAEMb2AU72/QlX/72D2/NbGQq1BWYbqUpgpCZ2nSgvlWDHlCiUo//UGsvfox01kjTFlmqQInsJVfRxF5AcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAi8c6C4zaTEc7aQiUgvnGQgCbMZbhUXXLGRpjvFLKaQzkwa9eq7WLJibcSNyGXBa/SfT5wJgsm3TPKgSehGAOTirhcqHheZyvBObAScY7GOT+u9pVYp6raFrc7ez3c+CGHeV/tNvy1hJNs12FYH4X+ZCNFIT9tprieR25NCdi5SWUbPZL0tVzJsHc1y92b2M2FxqRDohxQgJvyJOpcg2mSBzZZIkvDg7gfPSUXHVS1MQs0RHSbwq/XdQocUUhl9/e/YWCbNNxlM84BxFsBUok1dH/gzBySx+Fc8zYi7cOq9yaBT3RLT6cGmFGVYZJW4FyhPZOCLVNsLlnPQcX3dDg9A==</ds:X509Certificate>
        </ds:X509Data>
      </KeyInfo>
    </ds:Signature>
    <Subject>
      <NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">ABCDEG1234567890</NameID>
      <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <SubjectConfirmationData InResponseTo="_049917a6-1183-42fd-a190-1d2cbaf9b144" NotOnOrAfter="2014-01-31T15:41:31.357Z" Recipient="https://login.microsoftonline.com/login.srf" />
      </SubjectConfirmation>
    </Subject>
    <Conditions NotBefore="2014-01-31T15:36:31.263Z" NotOnOrAfter="2014-01-31T16:36:31.263Z">
      <AudienceRestriction>
        <Audience>urn:federation:MicrosoftOnline</Audience>
      </AudienceRestriction>
    </Conditions>
    <AttributeStatement>
      <Attribute Name="IDPEmail">
        <AttributeValue>administrator@contoso.com</AttributeValue>
      </Attribute>
    </AttributeStatement>
    <AuthnStatement AuthnInstant="2014-01-31T15:36:30.200Z" SessionIndex="_7e3c1bcd-f180-4f78-83e1-7680920793aa">
      <AuthnContext>
        <AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</AuthnContextClassRef>
      </AuthnContext>
    </AuthnStatement>
    </Assertion>
    </samlp:Response>
```

## Configure your SAML 2.0 compliant identity provider
This section contains guidelines on how to configure your SAML 2.0 identity provider to federate with Microsoft Entra ID to enable single sign-on access to one or more Microsoft cloud services (such as Microsoft 365) using the SAML 2.0 protocol. The SAML 2.0 relying party for a Microsoft cloud service used in this scenario is Microsoft Entra ID.

<a name='add-azure-ad-metadata'></a>

## Add Microsoft Entra metadata
Your SAML 2.0 identity provider needs to adhere to information about the Microsoft Entra ID relying party. Microsoft Entra ID publishes metadata at https://nexus.microsoftonline-p.com/federationmetadata/saml20/federationmetadata.xml.

It is recommended that you always import the latest Microsoft Entra metadata when configuring your SAML 2.0 identity provider.

>[!NOTE]
>Microsoft Entra ID does not read metadata from the identity provider.

<a name='add-azure-ad-as-a-relying-party'></a>

## Add Microsoft Entra ID as a relying party

You must enable communication between your SAML 2.0 identity provider and Microsoft Entra ID. This configuration will be dependent on your specific identity provider and you should refer to documentation for it. You would typically set the relying party ID to the same as the entityID from the Microsoft Entra metadata.

>[!NOTE]
>Verify the clock on your SAML 2.0 identity provider server is synchronized to an accurate time source. An inaccurate clock time can cause federated logins to fail.

## Install PowerShell for sign-on with SAML 2.0 identity provider

After you have configured your SAML 2.0 identity provider for use with Microsoft Entra sign-on, the next step is to download and install the Azure AD PowerShell module. Once installed, you will use these cmdlets to configure your Microsoft Entra domains as federated domains.

The Azure AD PowerShell module is a download for managing your organizations data in Microsoft Entra ID. This module installs a set of cmdlets to PowerShell; you run those cmdlets to set up single sign-on access to Microsoft Entra ID and in turn to all of the cloud services you are subscribed to. For instructions about how to download and install the cmdlets, see [/previous-versions/azure/jj151815(v=azure.100)](/previous-versions/azure/jj151815(v=azure.100))

<a name='set-up-a-trust-between-your-saml-identity-provider-and-azure-ad'></a>

## Set up a trust between your SAML identity provider and Microsoft Entra ID
Before configuring federation on a Microsoft Entra domain, it must have a custom domain configured. You cannot federate the default domain that is provided by Microsoft. The default domain from Microsoft ends with `onmicrosoft.com`.
You will run a series of PowerShell cmdlets to add or convert domains for single sign-on.

Each Microsoft Entra domain that you want to federate using your SAML 2.0 identity provider must either be added as a single sign-on domain or converted to be a single sign-on domain from a standard domain. Adding or converting a domain sets up a trust between your SAML 2.0 identity provider and Microsoft Entra ID.

The following procedure walks you through converting an existing standard domain to a federated domain using SAML 2.0 SP-Lite. 

>[!NOTE]
>Your domain may experience an outage that impacts users up to 2 hours after you take this step.

<a name='configuring-a-domain-in-your-azure-ad-directory-for-federation'></a>

## Configuring a domain in your Microsoft Entra Directory for federation


1. Connect to your Microsoft Entra Directory as a tenant administrator:

  ```powershell
  Connect-MsolService
  ```
  
2. Configure your desired Microsoft 365 domain to use federation with SAML 2.0:

  ```powershell
  $dom = "contoso.com" 
  $BrandName = "Sample SAML 2.0 IDP" 
  $LogOnUrl = "https://WS2012R2-0.contoso.com/passiveLogon" 
  $LogOffUrl = "https://WS2012R2-0.contoso.com/passiveLogOff" 
  $ecpUrl = "https://WS2012R2-0.contoso.com/PAOS" 
  $MyURI = "urn:uri:MySamlp2IDP" 
  $MySigningCert = "MIIC7jCCAdagAwIBAgIQRrjsbFPaXIlOG3GTv50fkjANBgkqhkiG9w0BAQsFADAzMTEwLwYDVQQDEyh BREZTIFNpZ25pbmcgLSBXUzIwMTJSMi0wLnN3aW5mb3JtZXIuY29tMB4XDTE0MDEyMDE1MTY0MFoXDT E1MDEyMDE1MTY0MFowMzExMC8GA1UEAxMoQURGUyBTaWduaW5nIC0gV1MyMDEyUjItMC5zd2luZm9yb WVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKe+rLVmXy1QwCwZwqgbbp1/kupQ VcjKuKLitVDbssFyqbDTjP7WRjlVMWAHBI3kgNT7oE362Gf2WMJFf1b0HcrsgLin7daRXpq4Qi6OA57 sW1YFMj3sqyuTP0eZV3S4+ZbDVob6amsZIdIwxaLP9Zfywg2bLsGnVldB0+XKedZwDbCLCVg+3ZWxd9 T/jV0hpLIIWr+LCOHqq8n8beJvlivgLmDJo8f+EITnAxWcsJUvVai/35AhHCUq9tc9sqMp5PWtabAEM b2AU72/QlX/72D2/NbGQq1BWYbqUpgpCZ2nSgvlWDHlCiUo//UGsvfox01kjTFlmqQInsJVfRxF5AcC AwEAATANBgkqhkiG9w0BAQsFAAOCAQEAi8c6C4zaTEc7aQiUgvnGQgCbMZbhUXXLGRpjvFLKaQzkwa9 eq7WLJibcSNyGXBa/SfT5wJgsm3TPKgSehGAOTirhcqHheZyvBObAScY7GOT+u9pVYp6raFrc7ez3c+ CGHeV/tNvy1hJNs12FYH4X+ZCNFIT9tprieR25NCdi5SWUbPZL0tVzJsHc1y92b2M2FxqRDohxQgJvy JOpcg2mSBzZZIkvDg7gfPSUXHVS1MQs0RHSbwq/XdQocUUhl9/e/YWCbNNxlM84BxFsBUok1dH/gzBy Sx+Fc8zYi7cOq9yaBT3RLT6cGmFGVYZJW4FyhPZOCLVNsLlnPQcX3dDg9A==" 
  $uri = "http://WS2012R2-0.contoso.com/adfs/services/trust" 
  $Protocol = "SAMLP" 
  Set-MsolDomainAuthentication `
    -DomainName $dom `
    -FederationBrandName $BrandName `
    -Authentication Federated `
    -PassiveLogOnUri $LogOnUrl `
    -ActiveLogOnUri $ecpUrl `
    -SigningCertificate $MySigningCert `
    -IssuerUri $MyURI `
    -LogOffUri $LogOffUrl `
    -PreferredAuthenticationProtocol $Protocol
  ``` 

3.  You can obtain the signing certificate base64 encoded string from your IDP metadata file. An example of this location has been provided but may differ slightly based on your implementation.

  ```xml
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="https://www.w3.org/2000/09/xmldsig#">
       <X509Data>
         <X509Certificate> MIIC5jCCAc6gAwIBAgIQLnaxUPzay6ZJsC8HVv/QfTANBgkqhkiG9w0BAQsFADAvMS0wKwYDVQQDEyRBREZTIFNpZ25pbmcgLSBmcy50ZWNobGFiY2VudHJhbC5vcmcwHhcNMTMxMTA0MTgxMzMyWhcNMTQxMTA0MTgxMzMyWjAvMS0wKwYDVQQDEyRBREZTIFNpZ25pbmcgLSBmcy50ZWNobGFiY2VudHJhbC5vcmcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCwMdVLTr5YTSRp+ccbSpuuFeXMfABD9mVCi2wtkRwC30TIyPdORz642MkurdxdPCWjwgJ0HW6TvXwcO9afH3OC5V//wEGDoNcI8PV4enCzTYFe/h//w51uqyv48Fbb3lEXs+aVl8155OAj2sO9IX64OJWKey82GQWK3g7LfhWWpp17j5bKpSd9DBH5pvrV+Q1ESU3mx71TEOvikHGCZYitEPywNeVMLRKrevdWI3FAhFjcCSO6nWDiMqCqiTDYOURXIcHVYTSof1YotkJ4tG6mP5Kpjzd4VQvnR7Pjb47nhIYG6iZ3mR1F85Ns9+hBWukQWNN2hcD/uGdPXhpdMVpBAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAK7h7jF7wPzhZ1dPl4e+XMAr8I7TNbhgEU3+oxKyW/IioQbvZVw1mYVCbGq9Rsw4KE06eSMybqHln3w5EeBbLS0MEkApqHY+p68iRpguqa+W7UHKXXQVgPMCpqxMFKonX6VlSQOR64FgpBme2uG+LJ8reTgypEKspQIN0WvtPWmiq4zAwBp08hAacgv868c0MM4WbOYU0rzMIR6Q+ceGVRImlCwZ5b7XKp4mJZ9hlaRjeuyVrDuzBkzROSurX1OXoci08yJvhbtiBJLf3uPOJHrhjKRwIt2TnzS9ElgFZlJiDIA26Athe73n43CT0af2IG6yC7e6sK4L3NEXJrwwUZk=</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
  </IDPSSODescriptor>
  ``` 

For more information about “Set-MsolDomainAuthentication”, see: [/previous-versions/azure/dn194112(v=azure.100)](/previous-versions/azure/dn194112(v=azure.100)).

>[!NOTE]
>You must use `$ecpUrl = "https://WS2012R2-0.contoso.com/PAOS"` only if you set up an ECP extension for your identity provider. Exchange Online clients, excluding Outlook Web Application (OWA), rely on a POST based active end point. If your SAML 2.0 STS implements an active end point similar to Shibboleth’s ECP implementation of an active end point it may be possible for these rich clients to interact with the Exchange Online service.

Once federation has been configured you can switch back to “non-federated” (or “managed”), however this change takes up to two hours to complete and it requires assigning new random passwords for cloud-based sign-in to each user. Switching back to “managed” may be required in some scenarios to reset an error in your settings. For more information on Domain conversion see: [/previous-versions/azure/dn194122(v=azure.100)](/previous-versions/azure/dn194122(v=azure.100)).

<a name='provision-user-principals-to-azure-ad--microsoft-365'></a>

## Provision user principals to Microsoft Entra ID / Microsoft 365
Before you can authenticate your users to Microsoft 365, you must provision Microsoft Entra ID with user principals that correspond to the assertion in the SAML 2.0 claim. If these user principals are not known to Microsoft Entra ID in advance, then they cannot be used for federated sign-in. Either Microsoft Entra Connect or PowerShell can be used to provision user principals.

Microsoft Entra Connect can be used to provision principals to your domains in your Microsoft Entra Directory from the on-premises Active Directory. For more detailed information, see [Integrate your on-premises directories with Microsoft Entra ID](../whatis-hybrid-identity.md).

PowerShell can also be used to automate adding new users to Microsoft Entra ID and to synchronize changes from the on-premises directory. To use the PowerShell cmdlets, you must download the [Azure Active Directory PowerShell module](/powershell/azure/active-directory/install-adv2).

This procedure shows how to add a single user to Microsoft Entra ID.


1. Connect to your Microsoft Entra Directory as a tenant administrator: Connect-MsolService.
2. Create a new user principal:

    ```powershell
    New-MsolUser `
      -UserPrincipalName elwoodf1@contoso.com `
      -ImmutableId ABCDEFG1234567890 `
      -DisplayName "Elwood Folk" `
      -FirstName Elwood `
      -LastName Folk `
      -AlternateEmailAddresses "Elwood.Folk@contoso.com" `
      -UsageLocation "US" 
    ```

For more information about “New-MsolUser” checkout, [/previous-versions/azure/dn194096(v=azure.100)](/previous-versions/azure/dn194096(v=azure.100))

>[!NOTE]
>The “UserPrincipalName” value must match the value that you will send for “IDPEmail” in your SAML 2.0 claim and the “ImmutableID” value must match the value sent in your “NameID” assertion.

## Verify single sign-on with your SAML 2.0 IDP
As the administrator, before you verify and manage single sign-on (also called identity federation), review the information and perform the steps in the following articles to set up single sign-on with your SAML 2.0 SP-Lite based identity provider:

1. You have reviewed the Microsoft Entra SAML 2.0 Protocol Requirements
2. You have configured your SAML 2.0 identity provider
3. Install PowerShell for single sign-on with SAML 2.0 identity provider
4. Set up a trust between SAML 2.0 identity provider and Microsoft Entra ID
5. Provisioned a known test user principal to Microsoft Entra ID (Microsoft 365) via either PowerShell or Microsoft Entra Connect.
6. Configure directory synchronization using [Microsoft Entra Connect](../whatis-hybrid-identity.md).

After setting up single sign-on with your SAML 2.0 SP-Lite based identity Provider, you should verify that it is working correctly.

>[!NOTE]
>If you converted a domain, rather than adding one, it may take up to 24 hours to set up single sign-on.
Before you verify single sign-on, you should finish setting up Active Directory synchronization, synchronize your directories, and activate your synced users.

### Use the tool to verify that single sign-on has been set up correctly
To verify that single sign-on has been set up correctly, you can perform the following procedure to confirm that you are able to sign-in to the cloud service with your corporate credentials.

Microsoft has provided a tool that you can use to test your SAML 2.0 based identity provider. Before running the test tool, you must have configured a Microsoft Entra tenant to federate with your identity provider.

>[!NOTE]
>The Connectivity Analyzer requires Internet Explorer 10 or later.



1. Download the [Connectivity Analyzer](https://testconnectivity.microsoft.com/?tabid=Client).
2. Click Install Now to begin downloading and installing the tool.
3. Select “I can’t set up federation with Office 365, Azure, or other services that use Microsoft Entra ID”.
4. Once the tool is downloaded and running, you will see the Connectivity Diagnostics window. The tool will step you through testing your federation connection.
5. The Connectivity Analyzer will open your SAML 2.0 IDP for you to sign-in, enter the credentials for the user principal you are testing:

    ![Screenshot that shows the sign-in window for your SAML 2.0 IDP.](./media/how-to-connect-fed-saml-idp/saml1.png)

6.  At the Federation test sign-in window, you should enter an account name and password for the Microsoft Entra tenant that is configured to be federated with your SAML 2.0 identity provider. The tool will attempt to sign-in using those credentials and detailed results of tests performed during the sign-in attempt will be provided as output.

    ![SAML](./media/how-to-connect-fed-saml-idp/saml2.png)

7. This window shows a failed result of testing. Clicking on Review detailed results will show information about the results for each test that was performed. You can also save the results to disk in order to share them.
 
> [!NOTE]
> The Connectivity analyzer also tests Active Federation using the WS*-based and ECP/PAOS protocols. If you are not using these you can disregard the following error: Testing the Active sign-in flow using your identity provider’s Active federation endpoint.

### Manually verify that single sign-on has been set up correctly

Manual verification provides additional steps that you can take to ensure that your SAML 2.0 identity Provider is working properly in many scenarios.
To verify that single sign-on has been set up correctly, complete the following steps:

1. On a domain-joined computer, sign-in to your cloud service using the same sign-in name that you use for your corporate credentials.
2. Click inside the password box. If single sign-on is set up, the password box will be shaded, and you will see the following message: “You are now required to sign-in at &lt;your company&gt;.”
3. Click the Sign-in at &lt;your company&gt; link. If you are able to sign-in, then single sign-on has been set up.

## Next Steps

- [Active Directory Federation Services management and customization with Microsoft Entra Connect](how-to-connect-fed-management.md)
- [Microsoft Entra federation compatibility list](how-to-connect-fed-compatibility.md)
- [Microsoft Entra Connect Custom Installation](how-to-connect-install-custom.md)
