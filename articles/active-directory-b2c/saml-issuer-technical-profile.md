---
title: Define a technical profile for a SAML issuer in a custom policy
titleSuffix: Azure AD B2C
description: Define a technical profile for a Security Assertion Markup Language token (SAML) issuer in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 04/08/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a technical profile for a SAML token issuer in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) emits several types of security tokens as it processes each authentication flow. A technical profile for a SAML token issuer emits a SAML token that is returned back to the relying party application (service provider). Usually this technical profile is the last orchestration step in the user journey.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `SAML2`. Set the **OutputTokenFormat** element to `SAML2`.

The following example shows a technical profile for `Saml2AssertionIssuer`:

```xml
<TechnicalProfile Id="Saml2AssertionIssuer">
  <DisplayName>Token Issuer</DisplayName>
  <Protocol Name="SAML2"/>
  <OutputTokenFormat>SAML2</OutputTokenFormat>
  <Metadata>
    <Item Key="IssuerUri">https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/B2C_1A_signup_signin_SAML</Item>
    <Item Key="TokenNotBeforeSkewInSeconds">600</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="MetadataSigning" StorageReferenceId="B2C_1A_SamlIdpCert"/>
    <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_SamlIdpCert"/>
  </CryptographicKeys>
  <InputClaims/>
  <OutputClaims/>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Saml-issuer"/>
</TechnicalProfile>
```

## Input, output, and persist claims

The **InputClaims**, **OutputClaims**, and **PersistClaims** elements are empty or absent. The **InutputClaimsTransformations** and **OutputClaimsTransformations** elements are also absent.

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| IssuerUri | No | The issuer name that appears in the SAML response. The value should be the same name as configured in the relying party application. |
| XmlSignatureAlgorithm | No | The method that Azure AD B2C uses to sign the SAML Assertion. Possible values: `Sha256`, `Sha384`, `Sha512`, or `Sha1`. Make sure you configure the signature algorithm on both sides with same value. Use only the algorithm that your certificate supports. To configure the SAML Response, see [Options for registering a SAML application](saml-service-provider.md)|
|TokenNotBeforeSkewInSeconds| No| Specifies the skew, as an integer, for the time stamp that marks the beginning of the validity period. The higher this number is, the further back in time the validity period begins with respect to the time that the claims are issued for the relying party. For example, when the TokenNotBeforeSkewInSeconds is set to 60 seconds, if the token is issued at 13:05:10 UTC, the token is valid from 13:04:10 UTC. The default value is 0. The maximum value is 3600 (one hour). |
|TokenLifeTimeInSeconds| No| Specifies the life of the SAML Assertion. This value is in seconds from the NotBefore value referenced above.The default value is 300 seconds (5 Min). |


## Cryptographic keys

The CryptographicKeys element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| MetadataSigning | Yes | The X509 certificate (RSA key set) to use to sign SAML metadata. Azure AD B2C uses this key to sign the metadata. |
| SamlMessageSigning| Yes| Specify the X509 certificate (RSA key set) to use to sign SAML messages. Azure AD B2C uses this key to signing the response `<samlp:Response>` send to the relying party.|
| SamlAssertionSigning| No| Specify the X509 certificate (RSA key set) to use to sign SAML assertion `<saml:Assertion>` element of the SAML token. If not provided, the `SamlMessageSigning` cryptographic key is used instead.|

## Session management

To configure the Azure AD B2C SAML sessions between a relying party application, the attribute of the `UseTechnicalProfileForSessionManagement` element, reference to [SamlSSOSessionProvider](custom-policy-reference-sso.md#samlssosessionprovider) SSO session.

## Next steps

See the following article for example of using a SAML issuer technical profile:

- [Register a SAML application in Azure AD B2C](saml-service-provider.md)

