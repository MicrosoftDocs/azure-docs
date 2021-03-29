---
title: Configure SAML service provider options
title-suffix: Azure Active Directory B2C
description: How to configure Azure Active Directory B2C SAML service provider options
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/15/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit
zone_pivot_groups: b2c-policy-type
---

# Options for registering a SAML application in Azure AD B2C

This article describes the configuration options that are available when connecting Azure Active Directory (Azure AD B2C) with your SAML application.

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

## Encrypted SAML assertions

When your application expects SAML assertions to be in an encrypted format, you need to make sure that encryption is enabled in the Azure AD B2C policy.

Azure AD B2C uses the service provider's public key certificate to encrypt the SAML assertion. The public key must exist in the SAML application's metadata endpoint with the KeyDescriptor 'use' set to 'Encryption', as shown in the following example:

```xml
<KeyDescriptor use="encryption">
  <KeyInfo xmlns="https://www.w3.org/2000/09/xmldsig#">
    <X509Data>
      <X509Certificate>valid certificate</X509Certificate>
    </X509Data>
  </KeyInfo>
</KeyDescriptor>
```

To enable Azure AD B2C to send encrypted assertions, set the **WantsEncryptedAssertion** metadata item to `true` in the [relying party technical profile](relyingparty.md#technicalprofile). You can also configure the algorithm used to encrypt the SAML assertion.

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <TechnicalProfile Id="PolicyProfile">
    <DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="SAML2"/>
    <Metadata>
      <Item Key="WantsEncryptedAssertions">true</Item>
    </Metadata>
   ..
  </TechnicalProfile>
</RelyingParty>
```

### Encryption method

To configure the encryption method used to encrypt the SAML assertion data, set the `DataEncryptionMethod` metadata key within the relying party. Possible values are `Aes256` (default), `Aes192`, `Sha512`, or `Aes128`. The metadata controls the value of the `<EncryptedData>` element in the SAML response.

To configure the encryption method used to encrypt the copy of the key, that was used to encrypt the SAML assertion data, set the `KeyEncryptionMethod` metadata key within the relying party. Possible values are `Rsa15` (default) - RSA Public Key Cryptography Standard (PKCS) Version 1.5 algorithm, and `RsaOaep` - RSA Optimal Asymmetric Encryption Padding (OAEP) encryption algorithm.  The metadata controls the value of the  `<EncryptedKey>` element in the SAML response.

The following example shows the `EncryptedAssertion` section of a SAML assertion. The encrypted data method is `Aes128`, and the encrypted key method is `Rsa15`.

```xml
<saml:EncryptedAssertion>
  <xenc:EncryptedData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#"
    xmlns:dsig="http://www.w3.org/2000/09/xmldsig#" Type="http://www.w3.org/2001/04/xmlenc#Element">
    <xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc" />
    <dsig:KeyInfo>
      <xenc:EncryptedKey>
        <xenc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-1_5" />
        <xenc:CipherData>
          <xenc:CipherValue>...</xenc:CipherValue>
        </xenc:CipherData>
      </xenc:EncryptedKey>
    </dsig:KeyInfo>
    <xenc:CipherData>
      <xenc:CipherValue>...</xenc:CipherValue>
    </xenc:CipherData>
  </xenc:EncryptedData>
</saml:EncryptedAssertion>
```

You can change the format of the encrypted assertions. To configure the encryption format, set the `UseDetachedKeys` metadata key within the relying party. Possible values: `true`, or `false` (default). When the value is set to `true`, the detached keys add the encrypted assertion as a child of the `EncrytedAssertion` as opposed to the `EncryptedData`.

Configure the encryption method and format, use the metadata keys within the [relying party technical profile](relyingparty.md#technicalprofile):

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <TechnicalProfile Id="PolicyProfile">
    <DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="SAML2"/>
    <Metadata>
      <Item Key="DataEncryptionMethod">Aes128</Item>
      <Item Key="KeyEncryptionMethod">Rsa15</Item>
      <Item Key="UseDetachedKeys">false</Item>
    </Metadata>
   ..
  </TechnicalProfile>
</RelyingParty>
```

## Identity provider-initiated flow

When your application expects to receive a SAML assertion without first sending a SAML AuthN request to the identity provider, you must configure Azure AD B2C for identity provider-initiated flow.

In identity provider-initiated flow, the sign-in process is initiated by the identity provider (Azure AD B2C), which sends an unsolicited SAML response to the service provider (your relying party application).

We don't currently support scenarios where the initiating identity provider is an external identity provider federated with Azure AD B2C, for example [AD-FS](identity-provider-adfs.md), or [Salesforce](identity-provider-salesforce-saml.md). It is only supported for Azure AD B2C local account authentication.

To enable identity provider-initiated flow, set the **IdpInitiatedProfileEnabled** metadata item to `true` in the [relying party technical profile](relyingparty.md#technicalprofile).

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <TechnicalProfile Id="PolicyProfile">
    <DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="SAML2"/>
    <Metadata>
      <Item Key="IdpInitiatedProfileEnabled">true</Item>
    </Metadata>
   ..
  </TechnicalProfile>
</RelyingParty>
```

To sign in or sign up a user through identity provider-initiated flow, use the following URL:

```
https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/generic/login?EntityId=app-identifier-uri 
```

Replace the following values:

* **tenant-name** with your tenant name
* **policy-name** with your SAML relying party policy name
* **app-identifier-uri** with the `identifierUris` in the metadata file, such as `https://contoso.onmicrosoft.com/app-name`

### Sample policy

We provide a complete sample policy that you can use for testing with the SAML test app.

1. Download the [SAML-SP-initiated login sample policy](https://github.com/azure-ad-b2c/saml-sp/tree/master/policy/SAML-SP-Initiated).
1. Update `TenantId` to match your tenant name, for example *contoso.b2clogin.com*.
1. Keep the policy name *B2C_1A_signup_signin_saml*.

## SAML response signature algorithm

You can configure the signature algorithm used to sign the SAML assertion. Possible values are `Sha256`, `Sha384`, `Sha512`, or `Sha1`. Make sure the technical profile and application use the same signature algorithm. Use only the algorithm that your certificate supports.

Configure the signature algorithm using the `XmlSignatureAlgorithm` metadata key within the relying party Metadata element.

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <TechnicalProfile Id="PolicyProfile">
    <DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="SAML2"/>
    <Metadata>
      <Item Key="XmlSignatureAlgorithm">Sha256</Item>
    </Metadata>
   ..
  </TechnicalProfile>
</RelyingParty>
```

## SAML response lifetime

You can configure the length of time the SAML response remains valid. Set the lifetime using the `TokenLifeTimeInSeconds` metadata item within the SAML Token Issuer technical profile. This value is the number of seconds that can elapse from the `NotBefore` timestamp calculated at the token issuance time. The default lifetime is 300 seconds (5 minutes).

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <Item Key="TokenLifeTimeInSeconds">400</Item>
      </Metadata>
      ...
    </TechnicalProfile>
```

## SAML response valid from skew

You can configure the time skew applied to the SAML response `NotBefore` timestamp. This configuration ensures that if the times between two platforms aren't in sync, the SAML assertion will still be deemed valid when within this time skew.

Set the time skew using the `TokenNotBeforeSkewInSeconds` metadata item within the SAML Token Issuer technical profile. The skew value is given in seconds, with a default value of 0. The maximum value is 3600 (one hour).

For example, when the `TokenNotBeforeSkewInSeconds` is set to `120` seconds:

- The token is issued at 13:05:10 UTC
- The token is valid from 13:03:10 UTC

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <Item Key="TokenNotBeforeSkewInSeconds">120</Item>
      </Metadata>
      ...
    </TechnicalProfile>
```

## Remove milliseconds from date and time

You can specify whether the milliseconds will be removed from datetime values within the SAML response (these include IssueInstant, NotBefore, NotOnOrAfter, and AuthnInstant). To remove the milliseconds, set the `RemoveMillisecondsFromDateTime
` metadata key within the relying party. Possible values: `false` (default) or `true`.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <Item Key="RemoveMillisecondsFromDateTime">true</Item>
      </Metadata>
      ...
    </TechnicalProfile>
```

## Azure AD B2C issuer ID

If you have multiple SAML applications that depend on different `entityID` values, you can override the `issueruri` value in your relying party file. To override the issuer URI, copy the technical profile with the "Saml2AssertionIssuer" ID from the base file and override the `issueruri` value.

> [!TIP]
> Copy the `<ClaimsProviders>` section from the base and preserve these elements within the claims provider: `<DisplayName>Token Issuer</DisplayName>`, `<TechnicalProfile Id="Saml2AssertionIssuer">`, and `<DisplayName>Token Issuer</DisplayName>`.
 
Example:

```xml
   <ClaimsProviders>   
    <ClaimsProvider>
      <DisplayName>Token Issuer</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Saml2AssertionIssuer">
          <DisplayName>Token Issuer</DisplayName>
          <Metadata>
            <Item Key="IssuerUri">customURI</Item>
          </Metadata>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
  </ClaimsProviders>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpInSAML" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="SAML2" />
      <Metadata>
     …
```

## Session management

You can manage the session between Azure AD B2C and the SAML relying party application using the `UseTechnicalProfileForSessionManagement` element and the [SamlSSOSessionProvider](custom-policy-reference-sso.md#samlssosessionprovider).

## Force users to re-authenticate 

To force users to re-authenticate, the application can include the `ForceAuthn` attribute in the SAML authentication request. The `ForceAuthn` attribute is a Boolean value. When set to true, the users session will be invalidated at Azure AD B2C, and the user is forced to re-authenticate. The following SAML authentication request demonstrates how to set the `ForceAuthn` attribute to true. 


```xml
<samlp:AuthnRequest 
       Destination="https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_SAML2_signup_signin/samlp/sso/login"
       ForceAuthn="true" ...>
    ...
</samlp:AuthnRequest>
```

## Debug the SAML protocol

To help configure and debug the integration with your service provider, you can use a browser extension for the SAML protocol, for example, [SAML DevTools extension](https://chrome.google.com/webstore/detail/saml-devtools-extension/jndllhgbinhiiddokbeoeepbppdnhhio) for Chrome, [SAML-tracer](https://addons.mozilla.org/es/firefox/addon/saml-tracer/) for FireFox, or [Edge or IE Developer tools](https://techcommunity.microsoft.com/t5/microsoft-sharepoint-blog/gathering-a-saml-token-using-edge-or-ie-developer-tools/ba-p/320957).

Using these tools, you can check the integration between your application and Azure AD B2C. For example:

* Check whether the SAML request contains a signature and determine what algorithm is used to sign in the authorization request.
* Check if Azure AD B2C returns an error message.
* Check it the assertion section is encrypted.

## Next steps

- Find more information about the [SAML protocol on the OASIS website](https://www.oasis-open.org/).
- Get the SAML test web app from the [Azure AD B2C GitHub community repo](https://github.com/azure-ad-b2c/saml-sp-tester).

<!-- LINKS - External -->
[samltest]: https://aka.ms/samltestapp

::: zone-end
