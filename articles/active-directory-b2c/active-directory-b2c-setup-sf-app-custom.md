---
title: 'Azure Active Directory B2C: Adding Salesforce SAML provider using custom policies | Microsoft Docs'
description: A topic on Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: d7f4143f-cd7c-4939-91a8-231a4104dc2c
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 06/11/2017
ms.author: parakhj

---
# Azure Active Directory B2C: Log in using Salesforce accounts via SAML

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable login for users from a specific Salesforce organization by using [custom policies](active-directory-b2c-overview-custom.md).

## Prerequisites

### Azure AD B2C Setup

Ensure you have completed all of the steps that show you how to [get started with custom policies](active-directory-b2c-get-started-custom.md).

This includes:

1. Creating an Azure AD B2C tenant.
1. Creating an Azure AD B2C application.
1. Registering two policy engine applications.
1. Setting up keys.
1. Setting up the starter pack.

### Salesforce Setup

This tutorial assumes you already have:

1. Signed up for a Salesforce account. You can sign up for a [free Developer Edition](https://developer.salesforce.com/signup).
1. [Set Up a My Domain](https://help.salesforce.com/articleView?id=domain_name_setup.htm&language=en_US&type=0) for your Salesforce organization.

## Configure Salesforce to allow users to federate

To help Azure AD B2C communicate with Salesforce, you will need to obtain the Salesforce metadata URL.

### Enable Salesforce as an identity provider

>[!NOTE]
> This tutorial assumes you are using the [Salesforce Lighting Experience](https://developer.salesforce.com/page/Lightning_Experience_FAQ).

1. [Login to Salesforce](https://login.salesforce.com/) 
1. On the left menu, under **Settings**, expand **Identity** and click on **Identity Provider**
1. Click on **Enable Identity Provider**
1. **Select the certificate** you want Salesforce to use when communicating with Azure AD B2C and click **Save**. You can use the default certificate.

### Create a connected app in Salesforce

1. Under the **Identity Provider** page, scroll to the **Service Providers** section.
1. Click on **Service Providers are now created via Connected Apps. Click here.**
1. Provide the required **Basic Information** for your Connected App.
1. In the **Web App Settings** section, check **Enable SAML**.
1. Enter the following URL in the **Entity ID** field, make sure you replace the `tenantName`.
      ```
      https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_TrustFrameworkBase
      ```
1. Enter the following URL in the **ACS URL** field, make sure you replace the `tenantName`.
      ```
      https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer
      ```
1. Leave all other settings with their defaults.
1. Scroll all the way to the bottom and click on the **Save** button.

### Get the metadata URL

1. Click on **Manage** in the overview page of your connected app.
1. Copy the **Metadata Discovery Endpoint** and save it for later.

### Enable Salesforce users to federate

1. In the "Manage" page of your connected app, scroll down to the **Profiles** section.
1. Click on **Manage Profiles**.
1. Select the profiles (or groups of users) that you would like to be able to federate with Azure AD B2C. As a system administrator, you should check the box for **System Administrator** so that you can federate using your Salesforce account.

## Generate a signing certificate for Azure AD B2C

Requests sent to Salesforce need to be signed by Azure AD B2C. To generate a signing certificate, open PowerShell and run the following commands:

**Make sure to update the tenant name and password in the top two lines.**

```PowerShell
$tenantName = "<YOUR TENANT NAME>.onmicrosoft.com"
$pwdText = "<YOUR PASSWORD HERE>"

$Cert = New-SelfSignedCertificate -CertStoreLocation Cert:\CurrentUser\My -DnsName "SamlIdp.$tenantName" -Subject "B2C SAML Signing Cert" -HashAlgorithm SHA256 -KeySpec Signature -KeyLength 2048

$pwd = ConvertTo-SecureString -String $pwdText -Force -AsPlainText

Export-PfxCertificate -Cert $Cert -FilePath .\B2CSigningCert.pfx -Password $pwd
```

## Add the SAML Signing certificate to Azure AD B2C

You need to upload the signing certificate to your Azure AD B2C tenant. To do this:

1. Navigate to your Azure AD B2C tenant and open B2C **Settings > Identity Experience Framework > Policy Keys**
1. Click **+Add**
    * Select **Options > Upload**
    * Enter a **Name** (for example `SAMLSigningCert`). The prefix B2C_1A_ will be added automatically to the name of your key.
    * Use the **upload file control** to select your certificate
    * Enter the certificate's password that you set in the PowerShell script.
1. Click **Create**.
1. Confirm you've created a key (for example `B2C_1A_SAMLSigningCert`). Take note of the full name (with B2C_1A_) as you will refer to this in the policy later.

## Create the Salesforce SAML claims provider in your base policy

To allow users to log in using Salesforce, you need to define Salesforce as a claims provider. In other words, you need to specify the endpoint that Azure AD B2C will communicate with. The endpoint will *provide* a set of *claims* that are used by Azure AD B2C to verify that a specific user has authenticated. You can do this by adding a `<ClaimsProvider>` for Salesforce in the extension file of your policy.

1. Open the extension file from your working directory (TrustFrameworkExtensions.xml).
1. Find the section `<ClaimsProviders>`. If it does not exist, add it under the root node.
1. Add a new `<ClaimsProvider>` as follows:

    ```XML
    <ClaimsProvider>
      <Domain>salesforce</Domain>
      <DisplayName>Salesforce</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="salesforce">
          <DisplayName>Salesforce</DisplayName>
          <Description>Login with your Salesforce account</Description>
          <Protocol Name="SAML2"/>
          <Metadata>
            <Item Key="RequestsSigned">false</Item>
            <Item Key="WantsEncryptedAssertions">false</Item>
            <Item Key="WantsSignedAssertions">false</Item>
            <Item Key="PartnerEntity">https://contoso-dev-ed.my.salesforce.com/.well-known/samlidp.xml</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="SamlAssertionSigning" StorageReferenceId="B2C_1A_SAMLSigningCert"/>
            <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_SAMLSigningCert"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="userId"/>
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name"/>
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name"/>
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email"/>
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="username"/>
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="externalIdp"/>
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="SAMLIdp" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop"/>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

Under the `<ClaimsProvider>` node:

* Update the value for `<Domain>` to a unique value that can be used to distinguish from other identity providers.
* Update the value for `<DisplayName>` to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

In order to get a SAML token from Salesforce, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the `<TechnicalProfile>` element of the `<ClaimsProvider>`.

1. Update the id of the `<TechnicalProfile>` node. This id is used to refer to this technical profile from other parts of the policy.
1. Update the value for `<DisplayName>`. This value will be displayed on the login button in your login screen.
1. Update the value for `<Description>`.
1. Salesforce uses the SAML 2.0 protocol, so ensure that `<Protocol>` is "SAML2".

You need to update the `<Metadata>` section in the XML above to reflect the configuration settings for your specific Salesforce account. In the XML, update the metadata values as following:

1. Update the value of `<Item Key="PartnerEntity">` with the Salesforce metadata URL you copied earlier. It has the format `https://contoso-dev-ed.my.salesforce.com/.well-known/samlidp/connectedapp.xml`

1. In the `<CryptographicKeys>` section in the XML above, update the value for both `StorageReferenceId` to the name of the key of your signing certificate (e.g. B2C_1A_SAMLSigningCert).

### Upload the extension file for verification

By now, you will have configured your policy so that Azure AD B2C knows how to communicate with Salesforce. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far. To do so:

1. Go to the **All Policies** blade in your Azure AD B2C tenant.
1. Check the box for **Overwrite the policy if it exists**.
1. Upload the extension file (TrustFrameworkExtensions.xml) and ensure it does not fail the validation.

## Register the Salesforce SAML claims provider to a User Journey

You now need to add the Salesforce SAML identity provider into one of your user journeys. At this point, the identity provider has been set up, but it’s not available in any of the sign-up / sign-in screens. To do so, we will create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider.

1. Open the base file of your policy (e.g TrustFrameworkBase.xml)
1. Find the `<UserJourneys>` element and copy the entire `<UserJourney>` with Id=”SignUpOrSignIn”.
1. Open the extension file (e.g. TrustFrameworkExtensions.xml) and find the `<UserJourneys>` element. If the element doesn't exist, add one.
1. Paste the entire `<UserJourney>` that you copied as a child of the `<UserJourneys>` element.
1. Rename the id of the new `<UserJourney>` (i.e SignUpOrSignUsingContoso).

### Display the "button"

The `<ClaimsProviderSelection>` element is analogous to an identity provider button on a sign-up/sign-in screen. By adding an `<ClaimsProviderSelection>` element for Salesforce, a new button will show up when a user lands on the page. To do this:

1. Find the `<OrchestrationStep>` with `Order="1"` in the `<UserJourney>` that you just created.
1. Add the following:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
    ```

1. Set `TargetClaimsExchangeId` to an appropriate value. We recommend following the same convention as others - *\[ClaimProviderName\]Exchange*.

### Link the "button" to an action

Now that you have a "button" in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Salesforce to receive a SAML token. You can do this by linking the technical profile for your Salesforce SAML claims provider.

1. Find the `<OrchestrationStep>` with `Order="2"` in the `<UserJourney>` node
1. Add the following:

    ```XML
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="ContosoProfile" />
    ```

1. Update `Id` to the same value as that of `TargetClaimsExchangeId` above.
1. Update `TechnicalProfileReferenceId` to the `Id` of the technical profile you created earlier (e.g. ContosoProfile).

### Upload the updated extension file

You are done modifying the extension file. Save and upload this file and ensure that all validations succeed.

### Update the RP file

You now need to update the RP file that will initiate the user journey that you just created.

1. Make a copy of SignUpOrSignIn.xml in your working directory and rename it (e.g. SignUpOrSignInWithAAD.xml).
1. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with a unique value. This will be the name of your policy (e.g. SignUpOrSignInWithAAD).
1. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the id of the new user journey that you created (e.g. SignUpOrSignUsingContoso).
1. Save your changes and upload the file.

## Testing and troubleshooting

Test out the custom policy that you just uploaded by opening its blade and clicking on "Run now". In case something fails, see how to [troubleshoot](active-directory-b2c-troubleshoot-custom.md).

## Next steps

Provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).