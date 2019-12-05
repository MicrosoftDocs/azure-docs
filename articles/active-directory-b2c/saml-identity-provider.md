---
title: Configure Azure AD B2C as a SAML IdP to your applications
title-suffix: Azure AD B2C
description: How to configure Azure AD B2C to provide SAML (protocol) assertions to applications (aka Service Providers). Azure AD B2C will act as the single Identity Provider to your SAML application (aka relying party).
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/10/2019
ms.author: marsma
ms.subservice: B2C
---

# Define a SAML technical profile in an Azure AD B2C custom policy

This article explains how to configure Azure Active Directory B2C (Azure AD B2C) to provide SAML (protocol) assertions to applications (aka Service Providers).  Azure AD B2C will act as the single Identity Provider to your SAML application (aka relying party).

## Scenario overview

Organizations using Azure AD B2C to secure access from their users (typically customers or citizens) to their own applications, may have a need to interact with identity providers or applications that are configured to authenticate using the SAML protocol.  Azure AD B2C achieves this interoperability by (A) interacting with SAML-based identity providers and/or (B) achieving single-sign-on with SAML-based service providers.

![Diagram with B2C as identity provider on left and B2C as service provider on right](media/saml-identity-provider/saml-idp-diagram-01.jpg)

Summarizing the two non-exclusive core scenarios with SAML:

| Scenario | Azure AD B2C role | How-to |
| -------- | ----------------- | ------- |
| My application expects a SAML assertion to complete an authentication.  | **B2C acts as Identity Provider (IdP)**<br />AAD B2C service acts as a SAML Identity Provider to the applications.  | This article.  |
| My users need to single-sign-on with a SAML compliant Identity Provider. (e.g. ADFS, Salesforce, Shibboleth)  | **B2C acts as Service Provider (SP)**<br />AAD B2C service acts as a Service Provider when connecting to the SAML Identity Provider. It is a Federation Proxy between your application and the SAML Identity Provider  | [Add ADFS as a SAML IdP using custom policies in Azure AD B2C](active-directory-b2c-custom-setup-adfs2016-idp.md) |

## Prerequisites

* Basic understanding of custom policies by completing [Get started with custom policies in Azure AD B2C](active-directory-b2c-get-started-custom.md).
* Basic understanding of SAML.
* "SocialAndLocalAccounts" custom policy starterpack configured and working in your tenant from the "Getting Started" article. We will make changes to the pack to add SAML RP functionality, use a local "working directory" to make these changes.
* An application configured as a SAML service provider (SP). For this tutorial you can use the [simulator application](https://samltestapp2.azurewebsites.net/SP).

## Components of the solution

* Your SAML application, or more generally, the ability to receive, decode and respond to SAML assertions from Azure AD B2C.  For this walk-through, we will use the following SAML Application simulator to interact with B2C: https://samltestapp2.azurewebsites.net/SP
* Publicly available Metadata endpoint for your application.  (or simulator provides one)
* Azure AD B2C tenant

## 1. Setup the certificates

To build a trust between your relying party application and Azure AD B2C, you need to provide valid X509 certificates (with the private key).

1. Certificate with private key stored on the Web App. This is used to sign the SAML Request sent to Azure AD B2C.
1. Certificate with private key provided to Azure AD B2C. This is used to sign and/or encrypt the SAML Response that Azure AD B2C provides back to the SAML Relying Party.

### 1.1 Preparing self-signed certificate

If you don’t have a certificate already, you can create a self-signed certificate using makecert.

1. Run this command to generate a self signed certificate:

    ```Console
    makecert -r -pe -n "CN=yourappname.yourtenant.onmicrosoft.com" -a sha256 -sky signature -len 2048 -e 12/12/2025 -sr CurrentUser -ss My YourAppNameSamlCert.cer
    ```

1. Go to the certificate store > Manage User Certificates > Current User > Personal > Certificates > yourappname.yourtenant.onmicrosoft.com
1. Right click the certificate > All Tasks > Export
1. Select Yes, export the private key
1. Select the defaults for Export File Format
1. Provide a password for the certificate

### 1.2 Upload the certificate

Whether you have a valid certificate issued by certificate authority, or a self-signed certificate, you need to upload the certificate to the Azure AD B2C Policy Keys area. To do so:

1. Go to your Azure AD B2C tenant. Click Settings > Identity Experience Framework > Policy Keys.
1. Click +Add, and then click Options > Upload.
1. Enter a Name (for example, YourAppNameSamlCert). The prefix B2C_1A_ is automatically added to the name of your key.
1. Upload your certificate using the upload file control.
1. Enter the certificate's password.
1. Click Create.
1. Verify that you've created a key (for example, B2C_1A_YourAppNameSamlCert).

## 2. Prepare your policy

### 2.1 Create the SAML token issuer

Now let’s go ahead and add the capability for your tenant to issue SAML tokens.

Open the TrustFrameworkExtensions.xml policy from the starterpack policy. Locate the section with the `<ClaimsProviders>` and add the following XML snippet.

```XML
<ClaimsProvider>
  <DisplayName>Token Issuer</DisplayName>
  <TechnicalProfiles>
    <!-- SAML Token Issuer technical profile -->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>Token Issuer</DisplayName>
      <Protocol Name="None"/>
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      <Metadata>
        <!-- The issuer contains the policy name, should the same one as configured in the relying party application we will use B2C_1A_signup_wignin_SAML below-->
        <Item Key="IssuerUri">https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/B2C_1A_signup_signin_SAML</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="MetadataSigning" StorageReferenceId="B2C_1A_YourAppNameSamlCert"/>
        <Key Id="SamlAssertionSigning" StorageReferenceId="B2C_1A_YourAppNameSamlCert"/>
        <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_YourAppNameSamlCert"/>
      </CryptographicKeys>
      <InputClaims/>
      <OutputClaims/>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Saml"/>
    </TechnicalProfile>
    <!-- Session management technical profile for SAML based tokens -->
    <TechnicalProfile Id="SM-Saml">
      <DisplayName>Session Management Provider</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

`IssuerUri`: This is the Issuer Uri that will be returned in the SAML Response from Azure AD B2C. Your relying party will be configured to accept an Issuer URI during SAML Assertion validation. This Issuer URI must be provided in the above XML snippet.

### 2.2 Setup the user journey

At this point, the SAML issuer has been set up, but it’s not available in any of the user journeys. To make it available, you create a duplicate of an existing templated user journey, and then modify it so that it issues an SAML token instead of JWT.

1. Open the TrustFrameworkBase.xml file from the starter pack.
1. Find and copy the entire contents of the UserJourney element that includes `Id="SignUpOrSignIn"`.
1. Open the TrustFrameworkExtensions.xml and find the UserJourneys element. If the element doesn't exist, add one by adding element open and closing nodes

    ```XML
    <UserJourneys>
      <!-- Copy the entire contents of the "SingUpOrSignIn" User journey here outside the comments -->
    </UserJourneys>
    ```

1. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.
1. Rename the ID of the user journey from SignUpOrSignIn to SignUpSignInSAML.

    ```XML
    <UserJourneyId="SignUpOrSignInSAML">
    ```

1. In the last orchestration step, change the value of CpimIssuerTechnicalProfileReferenceId property, from JwtIssuer to Saml2AssertionIssuer.

    ```XML
    <OrchestrationStepOrder="4"Type="SendClaims"CpimIssuerTechnicalProfileReferenceId="Saml2AssertionIssuer"/>
    ```

Save your changes and upload the updated policy. This time, make sure you check the Overwrite the policy if it exists checkbox. At this point, this will not have any effect, the intent of uploading is to confirm that what you’ve added thus far doesn’t have any syntactical issues.

## 3. Add the SAML Relying Party policy

Now that your tenant can issue SAML tokens, we need to create the SAML relying party policy

### 3.1 Create sign-up or sign-in policy

1. Copy the SignUpOrSignin.xml file from your starterpack working directory, rename it to match the Id of the new journey you created i.e. SignUpOrSigninSAML.xml.  This is your relying party policy file.
1. Open the SignUpOrSigninSAML.xml file
1. Replace the policy name B2C_1A_signup_signin to B2C_1A_signup_signin_SAML
1. Replace the entire `<TechnicalProfile>` element in the `<RelyingParty>` element with the following:

```XML
<TechnicalProfile Id="PolicyProfile">
  <DisplayName>PolicyProfile</DisplayName>
  <Protocol Name="SAML2"/>
  <Metadata>
    <Item Key="IssuerUri">https://tenant-name.b2clogin/tenant-name.b2clogin.com/saml_client_d</Item>
  </Metadata>
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

### 3.2 Update the metadata

The metadata can be configured (in both parties) as "Static Metadata", or "Dynamic Metadata". In static mode, you copy the entire metadata from one party and set it in the other party. In dynamic mode, you set the URL to the metadata, while the other party reads the configuration dynamically. The principle is the same, you provide the Azure B2C policy's metadata in your service provider (relying party). And provide your service provider's metadata to Azure AD B2C.

Each SAML relying party application has different steps to set and read the identity provider metadata. Azure AD B2C can read the service providers metadata. Look at your relying party application’s documentation for guidance on how to do so. You need your relying party applications' metadata URL or XML document to set in Azure AD B2C relying party policy file.

We will use  dynamic metadata for this example. Update the `<Item>` with `Key="PartnerEntity"` by adding the URL of the SAML RP’s metadata, if such exists:

```XML
<Item Key="PartnerEntity">https://app.com/metadata</Item>
```

> [!TIP]
> The Service Provider metadata should be publicly available. If your app is running under https://localhost, copy and upload the metadata file to an anonymous web server.

### 3.3 Upload and test your policy metadata

Save your changes and upload this new policy. After you uploaded both policies (the extension and the relying party), open a web browser and navigate to the policy metadata. The Azure AD B2C policy metadata is available in following URL address, replace the:

* tenant-name with your tenant name
* policy-name with your policy name

https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/policy-name/Samlp/metadata

Your custom policy and Azure AD B2C tenant are now ready. Next, create an application registration in Azure AD B2C.

## 4. Setup application in the Azure AD B2C Directory

### 4.1 Register your application in Azure Active Directory

1. In your Azure AD B2C directory navigate to Azure AD B2C > App Registrations (Preview) >
1. Select + New registration
1. Name your application (e.g. mySAMLApp)
1. Supported account types: "Accounts for any organizational directory or any identity provider"
1. The Redirect URI will be addressed later in the manifest. For now choose https://localhost
1. Permissions: Make sure the box is checked to "Grant consent to openid and off_line access"
Select Register
1. Select your application from the menu to open its registration and click on "Manifest"

### 4.2 Update the app manifest

For SAML Apps we need to read following properties

#### ReplyUrlWithType (only with type ‘Web’)

For the walkthrough with the SAML App Simulator use:

```JSON
"replyUrlsWithType":[
  {
    "url":"https://samltestapp2.azurewebsites.net/SP/AssertionConsumer",
    "type":"Web"
  }
],
```

This represents to AssertionConsumerServiceUrl (SingleSignOnService Url in RP metadata) and BindingType for this is assumed to be `Http-PoST`.

#### LogoutUrl

```JSON
logoutUrl":null,
```

BindingType for this is assumed to be HttpDirect. Logout url (SingleLogoutService url in rp metadata)

For the SAML App Simulator leave this as null

#### SamlMetadataUrl

This Url represents RP’s meta data. (http://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf specifies the contents in the url)

The metadata Url can be a file uploaded to blob storage.

For the walkthrough with the SAML Simulator use:

```JSON
"samlMetadataUrl":"https://samltestapp2.azurewebsites.net/Metadata",
```

#### IdentifierUri

This field is used to uniquely identify the application in the tenant.

This value corresponds to Identifier (EntityId) while configuring Azure AD applications.

In this case application lookup happens with `IdentifierUri` https://cpim3.ccsctp.net/samlAPPUITest

NOTE: Inheritance rule... When some properties are represented both in Saml Metadata Url and in Application Object(the manifest), they are merged together. The one’s in the metadata url are processed first and take precedence.

When a AuthnRequest is made with AssertionConsumerServiceIndex, only values from metadataUrl are considered.

## 5. Update your application code

You’ll need to setup B2C as a SAML IdP in the SAML RP / application. Each application has different steps to do so, look at your app’s documentation for guidance on how to do so. You will be required to provide some or all the following data points:

* **Metadata**: https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/policy-name/Samlp/metadata
* **Issuer**: https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/policy-name
* **Login URL / SAML Endpoint / SAML URL**: Look and the metadata file
* **Certificate**: This is the B2C_1A_YourAppNameSamlCert, but without the private key. To get the public key of the certificate do the following:

    1. Go to the metadata URL specified above.
    1. Copy the value in the <X509Certificate> element
    1. Paste it into a text file
    1. Save the text file as a .cer file

### 5.1 Test with the simulator (optional)

To complete this walkthrough with our SAML App simulator (SAMLTEST) use: https://samltestapp2.azurewebsites.net/SP

* Update Tenant Name
* Update B2C policy name. (e.g. B2C_1A_signup_signin_SAML)
* Issuer Uri as: https://cpim3.ccsctp.net/samlAPPUITest

Select LOGIN  and you should be presented with an end user login screen, which upon completion will issue a SAML Assertion back to the sample application...

## Sample policy

A complete sample policy that works with the SAML App simulator (SAMLTEST) is located here:

1. Download The SAML-SP-initiated login sample here: https://github.com/azure-ad-b2c/saml-sp/tree/master/policy/SAML-SP-Initiated
1. Update TenantID to match your tenant name (e.g. contoso.b2clogin.com)
1. Keep the policy name as:   B2C_1A_SAML2_signup_signin

## Supported and unsupported SAML modalities

* IdP Initiated logins are not supported in this iteration
* The following SAML RP scenarios are supported via your own metadata endpoint:
  * Supporting multiple logout urls or POST binding for logout url in application/service principal object. ( Supported via metadata url)
  * Support specifying signing key to verify RP requests in application/service principal object. (Supported via metadata url)
  * Support for specifying token encryption key in application/service principal. (Supported via metadata url)

## Next steps

The code for the SAML Application simulator is here: TBD

For more information about SAML and Azure AD B2C, see the following articles:

* [Define a SAML technical profile in an Azure Active Directory B2C custom policy](saml-technical-profile.md)
* [Add ADFS as a SAML identity provider using custom policies in Azure Active Directory B2C](active-directory-b2c-custom-setup-adfs2016-idp.md)
* [Set up sign-in with a Salesforce SAML provider by using custom policies in Azure Active Directory B2C](active-directory-b2c-setup-sf-app-custom.md)
