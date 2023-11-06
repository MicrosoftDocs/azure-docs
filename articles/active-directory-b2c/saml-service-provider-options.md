---
title: Configure SAML service provider options
title-suffix: Azure Active Directory B2C
description: Learn how to configure Azure Active Directory B2C SAML service provider options.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/16/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: fasttrack-edit
zone_pivot_groups: b2c-policy-type
---

# Options for registering a SAML application in Azure AD B2C

This article describes the configuration options that are available when you're connecting Azure Active Directory B2C (Azure AD B2C) with your Security Assertion Markup Language (SAML) application.

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"


## Specify a SAML response signature

You can specify a certificate to be used to sign the SAML messages. The message is the `<samlp:Response>` element within the SAML response sent to the application.

If you don't already have a policy key, [create one](saml-service-provider.md#create-a-policy-key). Then configure the `SamlMessageSigning` metadata item in the SAML Token Issuer technical profile. `StorageReferenceId` must reference the policy key name.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
        ...
      <CryptographicKeys>
        <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_SamlMessageCert"/>
        ...
      </CryptographicKeys>
    ...
    </TechnicalProfile>
```

### Signature algorithm

You can configure the signature algorithm that's used to sign the SAML assertion. Possible values are `Sha256`, `Sha384`, `Sha512`, or `Sha1`. Make sure the technical profile and application use the same signature algorithm. Use only the algorithm that your certificate supports.

Configure the signature algorithm by using the `XmlSignatureAlgorithm` metadata key within the relying party `Metadata` element.

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

## Check the SAML assertion signature

When your application expects the SAML assertion section to be signed, make sure the SAML service provider set the `WantAssertionsSigned` to `true`. If it's set to `false` or doesn't exist, the assertion section won't be signed. 

The following example shows metadata for a SAML service provider, with `WantAssertionsSigned` set to `true`.

```xml
<EntityDescriptor ID="id123456789" entityID="https://samltestapp2.azurewebsites.net" validUntil="2099-12-31T23:59:59Z" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
  <SPSSODescriptor WantAssertionsSigned="true" AuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  ...
  </SPSSODescriptor>
</EntityDescriptor>
```  

### Signature certificate

Your policy must specify a certificate to be used to sign the SAML assertions section of the SAML response. If you don't already have a policy key, [create one](saml-service-provider.md#create-a-policy-key). Then configure the `SamlAssertionSigning` metadata item in the SAML Token Issuer technical profile. `StorageReferenceId` must reference the policy key name.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
        ...
      <CryptographicKeys>
        <Key Id="SamlAssertionSigning" StorageReferenceId="B2C_1A_SamlMessageCert"/>
        ...
      </CryptographicKeys>
    ...
    </TechnicalProfile>
```

## Enable encryption in SAML assertions

When your application expects SAML assertions to be in an encrypted format, make sure that encryption is enabled in the Azure AD B2C policy.

Azure AD B2C uses the service provider's public key certificate to encrypt the SAML assertion. The public key must exist in the SAML application's metadata endpoint with the `KeyDescriptor` `use` value set to `Encryption`, as shown in the following example:

```xml
<KeyDescriptor use="encryption">
  <KeyInfo xmlns="https://www.w3.org/2000/09/xmldsig#">
    <X509Data>
      <X509Certificate>valid certificate</X509Certificate>
    </X509Data>
  </KeyInfo>
</KeyDescriptor>
```

To enable Azure AD B2C to send encrypted assertions, set the `WantsEncryptedAssertion` metadata item to `true` in the [relying party technical profile](relyingparty.md#technicalprofile). You can also configure the algorithm that's used to encrypt the SAML assertion.

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

To configure the encryption method that's used to encrypt the SAML assertion data, set the `DataEncryptionMethod` metadata key within the relying party. Possible values are `Aes256` (default), `Aes192`, `Sha512`, or `Aes128`. The metadata controls the value of the `<EncryptedData>` element in the SAML response.

To configure the encryption method for encrypting the copy of the key that was used to encrypt the SAML assertion data, set the `KeyEncryptionMethod` metadata key within the relying party. Possible values are:

- `Rsa15` (default): RSA Public Key Cryptography Standard (PKCS) Version 1.5 algorithm.
- `RsaOaep`: RSA Optimal Asymmetric Encryption Padding (OAEP) encryption algorithm.  

The metadata controls the value of the `<EncryptedKey>` element in the SAML response.

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

You can change the format of the encrypted assertions. To configure the encryption format, set the `UseDetachedKeys` metadata key within the relying party. Possible values: `true` or `false` (default). When the value is set to `true`, the detached keys add the encrypted assertion as a child of `EncryptedAssertion` instead of `EncryptedData`.

Configure the encryption method and format by using the metadata keys within the [relying party technical profile](relyingparty.md#technicalprofile):

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

## Configure IdP-initiated flow

When your application expects to receive a SAML assertion without first sending a SAML AuthN request to the identity provider (IdP), you must configure Azure AD B2C for IdP-initiated flow.

In IdP-initiated flow, the identity provider (Azure AD B2C) starts the sign-in process. The identity provider sends an unsolicited SAML response to the service provider (your relying party application).

We don't currently support scenarios where the initiating identity provider is an external identity provider federated with Azure AD B2C, such as [Active Directory Federation Services](identity-provider-adfs.md) or [Salesforce](identity-provider-salesforce-saml.md). IdP-initiated flow is supported only for local account authentication in Azure AD B2C.

To enable IdP-initiated flow, set the `IdpInitiatedProfileEnabled` metadata item to `true` in the [relying party technical profile](relyingparty.md#technicalprofile).

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

To sign in or sign up a user through IdP-initiated flow, use the following URL:

```http
https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/generic/login?EntityId=<app-identifier-uri>&RelayState=<relay-state> 
```

Replace the following values:

* Replace `<tenant-name>` with your tenant name.
* Replace `<policy-name>` with the name of your SAML relying party policy.
* Replace `<app-identifier-uri>` with the `identifierUris` value in the metadata file, such as `https://contoso.onmicrosoft.com/app-name`.
* [Optional] replace `<relay-state>` with a value included in the authorization request that also is returned in the token response. The `relay-state` parameter is used to encode information about the user's state in the app before the authentication request occurred, such as the page they were on.

### Sample policy

You can use a complete sample policy for testing with the SAML test app:

1. Download the [SAML-SP-initiated login sample policy](https://github.com/azure-ad-b2c/saml-sp/tree/master/policy/SAML-IdP-Initiated-LocalAccounts).
1. Update `TenantId` to match your tenant name. This article uses the example *contoso.b2clogin.com*.
1. Keep the policy name *B2C_1A_signup_signin_saml*.

## Configure the SAML response lifetime

You can configure the length of time that the SAML response remains valid. Set the lifetime by using the `TokenLifeTimeInSeconds` metadata item within the SAML Token Issuer technical profile. This value is the number of seconds that can elapse from the `NotBefore` time stamp, calculated at the token issuance time. The default lifetime is 300 seconds (five minutes).

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

## Configure the time skew of a SAML response

You can configure the time skew applied to the SAML response `NotBefore` time stamp. This configuration ensures that if the times between two platforms aren't in sync, the SAML assertion will still be deemed valid when it's within this time skew.

Set the time skew by using the `TokenNotBeforeSkewInSeconds` metadata item within the SAML Token Issuer technical profile. The skew value is given in seconds, with a default value of 0. The maximum value is 3600 (one hour).

For example, when `TokenNotBeforeSkewInSeconds` is set to `120` seconds:

- The token is issued at 13:05:10 UTC.
- The token is valid from 13:03:10 UTC.

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

## Remove milliseconds from the date and time

You can specify whether milliseconds will be removed from date and time values within the SAML response. (These values include `IssueInstant`, `NotBefore`, `NotOnOrAfter`, and `AuthnInstant`.) To remove the milliseconds, set the `RemoveMillisecondsFromDateTime` metadata key within the relying party. Possible values: `false` (default) or `true`.

```xml
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="SAML2" />
      <Metadata>
        <Item Key="RemoveMillisecondsFromDateTime">true</Item>
      </Metadata>
      <OutputClaims>
             ...
      </OutputClaims>
      <SubjectNamingInfo ClaimType="objectId" ExcludeAsClaim="true" />
    </TechnicalProfile>
  </RelyingParty>
```

## Use an issuer ID to override an issuer URI

If you have multiple SAML applications that depend on different `entityID` values, you can override the `IssuerUri` value in your relying party file. To override the issuer URI, copy the technical profile with the `Saml2AssertionIssuer` ID from the base file and override the `IssuerUri` value.

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

## Manage a session

You can manage the session between Azure AD B2C and the SAML relying party application by using the `UseTechnicalProfileForSessionManagement` element and the [SamlSSOSessionProvider](custom-policy-reference-sso.md#samlssosessionprovider).

## Force users to reauthenticate 

To force users to reauthenticate, the application can include the `ForceAuthn` attribute in the SAML authentication request. The `ForceAuthn` attribute is a Boolean value. When it's set to `true`, the user's session will be invalidated at Azure AD B2C, and the user is forced to reauthenticate. 

The following SAML authentication request demonstrates how to set the `ForceAuthn` attribute to `true`. 

```xml
<samlp:AuthnRequest 
       Destination="https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_SAML2_signup_signin/samlp/sso/login"
       ForceAuthn="true" ...>
    ...
</samlp:AuthnRequest>
```

## Sign the Azure AD B2C IdP SAML metadata

You can instruct Azure AD B2C to sign its metadata document for the SAML identity provider, if the application requires it. If you don't already have a policy key, [create one](saml-service-provider.md#create-a-policy-key). Then configure the `MetadataSigning` metadata item in the SAML Token Issuer technical profile. `StorageReferenceId` must reference the policy key name.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
        ...
      <CryptographicKeys>
        <Key Id="MetadataSigning" StorageReferenceId="B2C_1A_SamlMetadataCert"/>
        ...
      </CryptographicKeys>
    ...
    </TechnicalProfile>
```

## Debug the SAML protocol

To help configure and debug the integration with your service provider, you can use a browser extension for the SAML protocol. Browser extensions include the [SAML DevTools extension for Chrome](https://chrome.google.com/webstore/detail/saml-devtools-extension/jndllhgbinhiiddokbeoeepbppdnhhio), [SAML-tracer for Firefox](https://addons.mozilla.org/es/firefox/addon/saml-tracer/), and [Developer tools for Edge or Internet Explorer](https://techcommunity.microsoft.com/t5/microsoft-sharepoint-blog/gathering-a-saml-token-using-edge-or-ie-developer-tools/ba-p/320957).

By using these tools, you can check the integration between your application and Azure AD B2C. For example:

* Check whether the SAML request contains a signature and determine what algorithm is used to sign in the authorization request.
* Check if Azure AD B2C returns an error message.
* Check if the assertion section is encrypted.

## Next steps

- Find more information about the SAML protocol on the [OASIS website](https://www.oasis-open.org/).
- Get the SAML test web app from the [Azure AD B2C GitHub community repository](https://github.com/azure-ad-b2c/saml-sp-tester).

<!-- LINKS - External -->
[samltest]: https://aka.ms/samltestapp

::: zone-end
