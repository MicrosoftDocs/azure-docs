---
title: Configure Azure Active Directory B2C as a SAML IdP to your applications
title-suffix: Azure Active Directory B2C
description: How to configure Azure Active Directory B2C to provide SAML protocol assertions to your applications (service providers). Azure AD B2C will act as the single identity provider (IdP) to your SAML application.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/03/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit
zone_pivot_groups: b2c-policy-type
---

# Register a SAML application in Azure AD B2C

In this article, learn how to connect your Security Assertion Markup Language (SAML) applications (service providers) to Azure Active Directory B2C (Azure AD B2C) for authentication.

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

## Overview

Organizations that use Azure AD B2C as their customer identity and access management solution might require integration with applications that authenticate using the SAML protocol. The following diagram shows how Azure AD B2C serves as an *identity provider* (IdP) to achieve single-sign-on (SSO) with SAML-based applications.

![Diagram with B2C as identity provider on left and B2C as service provider on right.](media/saml-service-provider/saml-service-provider-integration.png)

1. The application creates a SAML AuthN Request that is sent to Azure AD B2C's SAML login endpoint.
2. The user can use an Azure AD B2C local account or any other federated identity provider (if configured) to authenticate.
3. If the user signs in using a federated identity provider, a token response is sent to Azure AD B2C.
4. Azure AD B2C generates a SAML assertion and sends it to the application.

## Prerequisites

* Complete the steps in [Get started with custom policies in Azure AD B2C](custom-policy-get-started.md). You need the *SocialAndLocalAccounts* custom policy from the custom policy starter pack discussed in the article.
* Basic understanding of the SAML protocol and familiarity with the application's SAML implementation.
* A web application configured as a SAML application. For this tutorial, you can use a [SAML test application][samltest] that we provide.

## Components

There are three main components required for this scenario:

* A SAML **application** with the ability to send SAML AuthN requests and receive, decode, and verify SAML responses from Azure AD B2C. The SAML application is also known as the relying party application or service provider.
* The SAML application's publicly available SAML **metadata endpoint** or XML document.
* An [Azure AD B2C tenant](tutorial-create-tenant.md)

If you don't yet have a SAML application and an associated metadata endpoint, you can use this sample SAML application that we've made available for testing:

[SAML Test Application][samltest]

## Set up certificates

To build a trust relationship between your application and Azure AD B2C, both services must be able to create and validate each other's signatures. You configure a configure X509 certificates in Azure AD B2C, and your application.

**Application certificates**

| Usage | Required | Description |
| --------- | -------- | ----------- |
| SAML request signing  | No | A certificate with a private key stored in your web app, used by your application to sign SAML requests sent to Azure AD B2C. The web app must expose the public key through its SAML metadata endpoint. Azure AD B2C validates the SAML request signature by using the public key from the application metadata.|
| SAML assertion encryption  | No | A certificate with a private key stored in your web app. The web app must expose the public key through its SAML metadata endpoint. Azure AD B2C can encrypt assertions to your application using the public key. The application uses the private key to decrypt the assertion.|

**Azure AD B2C certificates**

| Usage | Required | Description |
| --------- | -------- | ----------- |
| SAML response signing | Yes | A certificate with a private key stored in Azure AD B2C. This certificate is used by Azure AD B2C to sign the SAML response sent to your application. Your application reads the Azure AD B2C metadata public key to validate the signature of the SAML response. |

In a production environment, we recommend using certificates issued by a public certificate authority. However, you can also complete this procedure with self-signed certificates.

### Prepare a self-signed certificate for SAML response signing

You must create a SAML response signing certificate so that your application can trust the assertion from Azure AD B2C.

[!INCLUDE [active-directory-b2c-create-self-signed-certificate](../../includes/active-directory-b2c-create-self-signed-certificate.md)]

## Enable your policy to connect with a SAML application

To connect to your SAML application, Azure AD B2C must be able to create SAML responses.

Open `SocialAndLocalAccounts\`**`TrustFrameworkExtensions.xml`** in the custom policy starter pack.

Locate the `<ClaimsProviders>` section and add the following XML snippet to implement your SAML response generator.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>

    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <Item Key="IssuerUri">https://issuerUriMyAppExpects</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="SamlAssertionSigning" StorageReferenceId="B2C_1A_SamlIdpCert"/>
      </CryptographicKeys>
      <InputClaims/>
      <OutputClaims/>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Saml-issuer"/>
    </TechnicalProfile>

    <!-- Session management technical profile for SAML based tokens -->
    <TechnicalProfile Id="SM-Saml-issuer">
      <DisplayName>Session Management Provider</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
    </TechnicalProfile>

  </TechnicalProfiles>
</ClaimsProvider>
```

#### Configure the IssuerUri of the SAML response

You can change the value of the `IssuerUri` metadata item in the SAML token issuer technical profile. This change will be reflected in the `issuerUri` attribute returned in the SAML response from Azure AD B2C. Your application should be configured to accept the same `issuerUri` during SAML response validation.

```xml
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <Item Key="IssuerUri">https://issuerUriMyAppExpects</Item>
      </Metadata>
      ...
    </TechnicalProfile>
```

#### Sign the Azure AD B2C IdP SAML Metadata (optional)

You can instruct Azure AD B2C to sign its SAML IdP metadata document, if required by the application. To do so, generate and upload a SAML IdP metadata signing policy key as shown in [Prepare a self-signed certificate for SAML response signing](#prepare-a-self-signed-certificate-for-saml-response-signing). Then configure the `MetadataSigning` metadata item in the SAML token issuer technical profile. The `StorageReferenceId` must reference the policy key name.

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

#### Sign the Azure AD B2C IdP SAML response element (optional)

You can specify a certificate to be used to sign the SAML messages. The message is the `<samlp:Response>` element within the SAML response sent to the application.

To specify a certificate, generate and upload a policy key as shown in [Prepare a self-signed certificate for SAML response signing](#prepare-a-self-signed-certificate-for-saml-response-signing). Then configure the `SamlMessageSigning` Metadata item in the SAML Token Issuer technical profile. The `StorageReferenceId` must reference the Policy Key name.

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
## Configure your policy to issue a SAML Response

Now that your policy can create SAML responses, you must configure the policy to issue a SAML response instead of the default JWT response to your application.

### Create a sign-up or sign-in policy configured for SAML

1. Create a copy of the *SignUpOrSignin.xml* file in your starter pack working directory and save it with a new name. For example, *SignUpOrSigninSAML.xml*. This file is your relying party policy file, and it is configured to issue a JWT response by default.

1. Open the *SignUpOrSigninSAML.xml* file in your preferred editor.

1. Change the `PolicyId` and `PublicPolicyUri` of the policy to _B2C_1A_signup_signin_saml_ and `http://<tenant-name>.onmicrosoft.com/B2C_1A_signup_signin_saml` as seen below.

    ```xml
    <TrustFrameworkPolicy
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
    PolicySchemaVersion="0.3.0.0"
    TenantId="tenant-name.onmicrosoft.com"
    PolicyId="B2C_1A_signup_signin_saml"
    PublicPolicyUri="http://<tenant-name>.onmicrosoft.com/B2C_1A_signup_signin_saml">
    ```

1. At the end of the User Journey, Azure AD B2C contains a `SendClaims` step. This step references the Token Issuer Technical Profile. To issue a SAML response rather than the default JWT response, modify the `SendClaims` step to reference the new SAML Token issuer technical profile, `Saml2AssertionIssuer`.

Add the following XML snippet just before the `<RelyingParty>` element. This XML overwrites orchestration step number 7 in the _SignUpOrSignIn_ user journey. If you started from a different folder in the starter pack or you customized the user journey by adding or removing orchestration steps, make sure the number in the `order` element corresponds to the number specified in the user journey for the token issuer step. For example, in the other starter pack folders, the corresponding step number is 4 for `LocalAccounts`, 6 for `SocialAccounts` and 9 for `SocialAndLocalAccountsWithMfa`).

```xml
<UserJourneys>
  <UserJourney Id="SignUpOrSignIn">
    <OrchestrationSteps>
      <OrchestrationStep Order="7" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="Saml2AssertionIssuer"/>
    </OrchestrationSteps>
  </UserJourney>
</UserJourneys>
```

The relying party element determines which protocol your application uses. The default is `OpenId`. The `Protocol` element must be changed to `SAML`. The Output Claims will create the claims mapping to the SAML assertion.

Replace the entire `<TechnicalProfile>` element in the `<RelyingParty>` element with the following technical profile XML. Update `tenant-name` with the name of your Azure AD B2C tenant.

```xml
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" DefaultValue="" />
        <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="objectId"/>
      </OutputClaims>
      <SubjectNamingInfo ClaimType="objectId" ExcludeAsClaim="true"/>
    </TechnicalProfile>
```

Your final relying party policy file should look like the following XML code:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="contoso.onmicrosoft.com"
  PolicyId="B2C_1A_signup_signin_saml"
  PublicPolicyUri="http://contoso.onmicrosoft.com/B2C_1A_signup_signin_saml">

  <BasePolicy>
    <TenantId>contoso.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>

  <UserJourneys>
    <UserJourney Id="SignUpOrSignIn">
      <OrchestrationSteps>
        <OrchestrationStep Order="7" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="Saml2AssertionIssuer"/>
      </OrchestrationSteps>
    </UserJourney>
  </UserJourneys>

  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="SAML2"/>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" DefaultValue="" />
        <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="objectId"/>
      </OutputClaims>
      <SubjectNamingInfo ClaimType="objectId" ExcludeAsClaim="true"/>
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```

> [!NOTE]
> You can follow this same process to implement other types of user flows (for example sign-in, password reset, or profile editing flows).

### Upload your policy

Save your changes and upload the new **TrustFrameworkExtensions.xml** and **SignUpOrSigninSAML.xml** policy files to the Azure portal.

### Test the Azure AD B2C IdP SAML Metadata

After the policy files are uploaded, Azure AD B2C uses the configuration information to generate the identity provider’s SAML metadata document to be used by the application. The SAML metadata document contains the locations of services, such as sign-in and logout methods, certificates, and so on.

The Azure AD B2C policy metadata is available at the following URL:

`https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/samlp/metadata`

Replace `<tenant-name>` with the name of your Azure AD B2C tenant and `<policy-name>` with the name (ID) of the policy, for example:

`https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_signup_signin_saml/samlp/metadata`

## Register your SAML application in Azure AD B2C

For Azure AD B2C to trust your application, you create an Azure AD B2C application registration, which contains configuration information such as the application's metadata endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *SAMLApp1*.
1. Under **Supported account types**, select **Accounts in this organizational directory only**.
1. Under **Redirect URI**, select **Web**, and then enter `https://localhost`. You'll modify this value later in the application registration's manifest.
1. Select **Register**.

### Configure your application in Azure AD B2C

For SAML apps, you'll need to configure several properties in the application registration's manifest.

1. In the [Azure portal](https://portal.azure.com), navigate to the application registration that you created in the previous section.
1. Under **Manage**, select **Manifest** to open the manifest editor, and then modify the properties described in the following sections.

#### Add the identifier

When your SAML application makes a request to Azure AD B2C, the SAML AuthN request includes an `Issuer` attribute, which is typically the same value as the application's metadata `entityID`. Azure AD B2C uses this value to look up the application registration in the directory and read the configuration. For this lookup to succeed, the `identifierUri` in the application registration must be populated with a value that matches the `Issuer` attribute.

In the registration manifest, locate the `identifierURIs` parameter and add the appropriate value. This value will be same value that is configured in the SAML AuthN requests for EntityId at the application, and the `entityID` value in the application's metadata.

The following example shows the `entityID` in the SAML metadata:

```xml
<EntityDescriptor ID="id123456789" entityID="https://samltestapp2.azurewebsites.net" validUntil="2099-12-31T23:59:59Z" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
```

The `identifierUris` property will only accept URLs on the domain `tenant-name.onmicrosoft.com`.

```json
"identifierUris":"https://samltestapp2.azurewebsites.net",
```

#### Share the application's metadata with Azure AD B2C

After the application registration has been loaded by its `identifierUri`, Azure AD B2C uses the application's metadata to validate the SAML AuthN request and determine how to respond.

It's recommended that your application exposes a publicly accessible metadata endpoint.

If there are properties specified in *both* the SAML metadata URL and the application registration's manifest, they are *merged*. The properties specified in the metadata URL are processed first and take precedence.

Using the SAML test application as an example, you'd use the following value for `samlMetadataUrl` in the application manifest:

```json
"samlMetadataUrl":"https://samltestapp2.azurewebsites.net/Metadata",
```

#### Override or set the assertion consumer URL (optional)

You can configure the reply URL to which Azure AD B2C sends SAML responses. Reply URLs can be configured within the application manifest. This configuration is useful when your application doesn't expose a publicly accessible metadata endpoint.

The reply URL for a SAML application is the endpoint at which the application expects to receive SAML responses. The application usually provides this URL in the metadata document under the `AssertionConsumerServiceUrl` attribute, as shown below:

```xml
<SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    ...
    <AssertionConsumerService index="0" isDefault="true" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://samltestapp2.azurewebsites.net/SP/AssertionConsumer" />        
</SPSSODescriptor>
```

If you want to override the metadata provided in the `AssertionConsumerServiceUrl` attribute or the URL isn't present in the metadata document, you can configure the URL in the manifest under the `replyUrlsWithType` property. The `BindingType` will be set to `HTTP POST`.

Using the SAML test application as an example, you'd set the `url` property of `replyUrlsWithType` to the value shown in the following JSON snippet.

```json
"replyUrlsWithType":[
  {
    "url":"https://samltestapp2.azurewebsites.net/SP/AssertionConsumer",
    "type":"Web"
  }
],
```

#### Override or set the logout URL (optional)

You can configure the logout URL to which Azure AD B2C will send the user after a logout request. Reply URLs can be configured within the Application Manifest.

If you want to override the metadata provided in the `SingleLogoutService` attribute or the URL isn't present in the metadata document, you can configure it in the manifest under the `Logout` property. The `BindingType` will be set to `Http-Redirect`.

The application usually provides this URL in the metadata document under the `AssertionConsumerServiceUrl` attribute, as shown below:

```xml
<IDPSSODescriptor WantAuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://samltestapp2.azurewebsites.net/logout" ResponseLocation="https://samltestapp2.azurewebsites.net/logout" />

</IDPSSODescriptor>
```

Using the SAML test application as an example, you'd, leave `logoutUrl` set to `https://samltestapp2.azurewebsites.net/logout`:

```json
"logoutUrl": "https://samltestapp2.azurewebsites.net/logout",
```

> [!NOTE]
> If you choose to configure the reply URL and logout URL in the application manifest without populating the application's metadata endpoint via the `samlMetadataUrl` property, Azure AD B2C will not validate the SAML request signature, nor will it encrypt the SAML response.

## Configure Azure AD B2C as a SAML IdP in your SAML application

The last step is to enable Azure AD B2C as a SAML IdP in your SAML application. Each application is different and the steps vary. Consult your app's documentation for details.

The metadata can be configured in your application as *static metadata* or *dynamic metadata*. In static mode, copy all or part of the metadata from the Azure AD B2C policy metadata. In dynamic mode, provide the URL to the metadata and to allow your application to read the metadata dynamically.

Some or all the following are typically required:

* **Metadata**: Use the format `https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<policy-name>/Samlp/metadata`.
* **Issuer**:  The SAML request `issuer` value must match one of the URIs configured in the `identifierUris` element of the application registration manifest. If the SAML request `issuer` name doesn't exist in the `identifierUris` element, [add it to the application registration manifest](#add-the-identifier). For example, `https://contoso.onmicrosoft.com/app-name`. 
* **Login Url/SAML endpoint/SAML Url**: Check the value in the Azure AD B2C SAML policy metadata file for the `<SingleSignOnService>` XML element.
* **Certificate**: This certificate is *B2C_1A_SamlIdpCert*, but without the private key. To get the public key of the certificate:

    1. Go to the metadata URL specified above.
    1. Copy the value in the `<X509Certificate>` element.
    1. Paste it into a text file.
    1. Save the text file as a *.cer* file.

### Test with the SAML test app

You can use our [SAML Test Application][samltest] to test your configuration:

* Update the tenant name.
* Update the policy name, for example *B2C_1A_signup_signin_saml*.
* Specify this issuer URI. Use one of the URIs found in the `identifierUris` element in the application registration manifest, for example `https://contoso.onmicrosoft.com/app-name`.

Select **Login** and you should be presented with a user sign-in screen. Upon sign-in, a SAML response is issued back to the sample application.

## Supported and unsupported SAML modalities

The following SAML application scenarios are supported via your own metadata endpoint:

* Multiple logout URLs or POST binding for logout URL in the application/service principal object.
* Specify a signing key to verify relying party (RP) requests in the application/service principal object.
* Specify a token encryption key in the application/service principal object.
* Identity provider-initiated sign-on, where the identity provider is Azure AD B2C.

## Next steps

- Get the SAML test web app from [Azure AD B2C GitHub community repo](https://github.com/azure-ad-b2c/saml-sp-tester).
- See the [options for registering a SAML application in Azure AD B2C](saml-service-provider-options.md)

<!-- LINKS - External -->
[samltest]: https://aka.ms/samltestapp

::: zone-end
