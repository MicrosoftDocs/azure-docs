---
title: 'Azure Active Directory B2C: Adding a Salesforce SAML provider by using custom policies | Microsoft Docs'
description: Learn about how to create and manage Azure Active Directory B2C custom policies.
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
# Azure Active Directory B2C: Sign in by using Salesforce accounts via SAML

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to use [custom policies](active-directory-b2c-overview-custom.md) to set up sign-in for users from a specific Salesforce organization.

## Prerequisites

### Azure AD B2C setup

Ensure that you have completed all of the steps that show you how to [get started with custom policies](active-directory-b2c-get-started-custom.md) in Azure Active Directory B2C (Azure AD B2C).

These include:

* Create an Azure AD B2C tenant.
* Create an Azure AD B2C application.
* Register two policy engine applications.
* Set up keys.
* Set up the starter pack.

### Salesforce setup

In this article, we assume that you have already done the following:

* Signed up for a Salesforce account. You can sign up for a [free Developer Edition account](https://developer.salesforce.com/signup).
* [Set up a My Domain](https://help.salesforce.com/articleView?id=domain_name_setup.htm&language=en_US&type=0) for your Salesforce organization.

## Set up Salesforce so users can federate

To help Azure AD B2C communicate with Salesforce, you need to get the Salesforce metadata URL.

### Set up Salesforce as an identity provider

> [!NOTE]
> In this article, we assume you are using [Salesforce Lightning Experience](https://developer.salesforce.com/page/Lightning_Experience_FAQ).

1. [Sign in to Salesforce](https://login.salesforce.com/). 
2. On the left menu, under **Settings**, expand **Identity**, and then click **Identity Provider**.
3. Click **Enable Identity Provider**.
4. Under **Select the certificate**, select the certificate you want Salesforce to use to communicate with Azure AD B2C. (You can use the default certificate.) Click **Save**. 

### Create a connected app in Salesforce

1. On the **Identity Provider** page, go to **Service Providers**.
2. Click **Service Providers are now created via Connected Apps. Click here.**
3. Under **Basic Information**,  enter the required values for your connected app.
4. Under **Web App Settings**, select the **Enable SAML** check box.
5. In the **Entity ID** field, enter the following URL. Ensure that you replace the value for `tenantName`.
      ```
      https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_TrustFrameworkBase
      ```
6. In the **ACS URL** field, enter the following URL. Ensure that you replace the value for `tenantName`.
      ```
      https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer
      ```
7. Leave the default values for all other settings.
8. Scroll to the bottom of the list, and then click **Save**.

### Get the metadata URL

1. On the overview page of your connected app, click **Manage**.
2. Copy the value for **Metadata Discovery Endpoint**, and then save it. You'll use it later in this article.

### Set up Salesforce users to federate

1. On the **Manage** page of your connected app, go to **Profiles**.
2. Click **Manage Profiles**.
3. Select the profiles (or groups of users) that you want to federate with Azure AD B2C. As a system administrator, select the **System Administrator** check box, so that you can federate by using your Salesforce account.

## Generate a signing certificate for Azure AD B2C

Requests sent to Salesforce need to be signed by Azure AD B2C. To generate a signing certificate, open Azure PowerShell, and then run the following commands.

> [!NOTE]
> Make sure that you update the tenant name and password in the top two lines.

```PowerShell
$tenantName = "<YOUR TENANT NAME>.onmicrosoft.com"
$pwdText = "<YOUR PASSWORD HERE>"

$Cert = New-SelfSignedCertificate -CertStoreLocation Cert:\CurrentUser\My -DnsName "SamlIdp.$tenantName" -Subject "B2C SAML Signing Cert" -HashAlgorithm SHA256 -KeySpec Signature -KeyLength 2048

$pwd = ConvertTo-SecureString -String $pwdText -Force -AsPlainText

Export-PfxCertificate -Cert $Cert -FilePath .\B2CSigningCert.pfx -Password $pwd
```

## Add the SAML signing certificate to Azure AD B2C

Upload the signing certificate to your Azure AD B2C tenant: 

1. Go to your Azure AD B2C tenant. Click **Settings** > **Identity Experience Framework** > **Policy Keys**.
2. Click **+Add**
    1. Click **Options** > **Upload**.
    2. Enter a **Name** (for example, SAMLSigningCert). The prefix *B2C_1A_* is automatically added to the name of your key.
    3. To select your certificate, select **upload file control**. 
    4. Enter the certificate's password that you set in the PowerShell script.
3. Click **Create**.
4. Verify that you've created a key (for example, B2C_1A_SAMLSigningCert). Take note of the full name (including *B2C_1A_*). You will refer to this key later in the policy.

## Create the Salesforce SAML claims provider in your base policy

You need to define Salesforce as a claims provider so users can sign in by using Salesforce. In other words, you need to specify the endpoint that Azure AD B2C will communicate with. The endpoint will *provide* a set of *claims* that Azure AD B2C uses to verify that a specific user has authenticated. To do this, add a `<ClaimsProvider>` for Salesforce in the extension file of your policy:

1. In your working directory, open the extension file (TrustFrameworkExtensions.xml).
2. Find the `<ClaimsProviders>` section. If it does not exist, create it under the root node.
3. Add a new `<ClaimsProvider>`:

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

1. Change the value for `<Domain>` to a unique value that distinguishes `<ClaimsProvider>` from other identity providers.
2. Update the value for `<DisplayName>` to a display name for the claims provider. Currently, this value is not used.

### Update the technical profile

To get a SAML token from Salesforce, define the protocols that Azure AD B2C will use to communicate with Azure AD. Do this in the `<TechnicalProfile>` element of `<ClaimsProvider>`:

1. Update the ID of the `<TechnicalProfile>` node. This ID is used to refer to this technical profile from other parts of the policy.
2. Update the value for `<DisplayName>`. This value is displayed on the sign-in button on your sign-in page.
3. Update the value for `<Description>`.
4. Salesforce uses the SAML 2.0 protocol. Ensure that the value for `<Protocol>` is **SAML2**.

Update the `<Metadata>` section in the preceding XML to reflect the settings for your specific Salesforce account. In the XML, update the metadata values:

1. Update the value of `<Item Key="PartnerEntity">` with the Salesforce metadata URL you copied earlier. It has the following format: 

    `https://contoso-dev-ed.my.salesforce.com/.well-known/samlidp/connectedapp.xml`

2. In the `<CryptographicKeys>` section, update the value for both instances of `StorageReferenceId` to the name of the key of your signing certificate (for example, B2C_1A_SAMLSigningCert).

### Upload the extension file for verification

Your policy is now configured so that Azure AD B2C knows how to communicate with Salesforce. Try uploading the extension file of your policy, to verify that there aren't any issues so far. To upload the extension file of your policy:

1. In your Azure AD B2C tenant, go to the **All Policies** blade.
2. Select the **Overwrite the policy if it exists** check box.
3. Upload the extension file (TrustFrameworkExtensions.xml). Ensure that it doesn't fail validation.

## Register the Salesforce SAML claims provider to a user journey

Next, add the Salesforce SAML identity provider to one of your user journeys. At this point, the identity provider has been set up, but it’s not available on any of the user sign-up or sign-in pages. To add the identity provider to a sign-in page, first, create a duplicate of an existing template user journey. Then, modify the template so that it also has the Azure AD identity provider.

1. Open the base file of your policy (for example, TrustFrameworkBase.xml).
2. Find the `<UserJourneys>` element, and then copy the entire `<UserJourney>` value, including Id=”SignUpOrSignIn”.
3. Open the extension file (for example, TrustFrameworkExtensions.xml). Find the `<UserJourneys>` element. If the element doesn't exist, create one.
4. Paste the entire copied `<UserJourney>` as a child of the `<UserJourneys>` element.
5. Rename the ID of the new `<UserJourney>` (for example, SignUpOrSignUsingContoso).

### Display the identity provider button

The `<ClaimsProviderSelection>` element is analogous to an identity provider button on a sign-up or sign-in page. By adding an `<ClaimsProviderSelection>` element for Salesforce, a new button appears when a user goes to this page. To display the identity provider button:

1. In the `<UserJourney>` that you created, find the `<OrchestrationStep>` with `Order="1"`.
2. Add the following XML:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
    ```

3. Set `TargetClaimsExchangeId` to a logical value. We recommend following the same convention as others (for example, *\[ClaimProviderName\]Exchange*).

### Link the identity provider button to an action

Now that you have an identity provider button in place, link it to an action. In this case, the action is for Azure AD B2C to communicate with Salesforce to receive a SAML token. You can do this by linking the technical profile for your Salesforce SAML claims provider:

1. In the `<UserJourney>` node, find the `<OrchestrationStep>` with `Order="2"`.
2. Add the following XML:

    ```XML
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="ContosoProfile" />
    ```

3. Update `Id` to the same value that you used earlier for `TargetClaimsExchangeId`.
4. Update `TechnicalProfileReferenceId` to the `Id` of the technical profile you created earlier (for example, ContosoProfile).

### Upload the updated extension file

You are done modifying the extension file. Save and upload this file. Ensure that all validations succeed.

### Update the relying party file

Next, update the relying party (RP) file that initiates the user journey that you created:

1. Make a copy of SignUpOrSignIn.xml in your working directory. Then, rename it (for example, SignUpOrSignInWithAAD.xml).
2. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with a unique value. This is the name of your policy (for example, SignUpOrSignInWithAAD).
3. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the `Id` of the new user journey that you created (for example, SignUpOrSignUsingContoso).
4. Save your changes, and then upload the file.

## Test and troubleshoot

To test the custom policy that you just uploaded, in the Azure portal, go to the policy blade, and then click **Run now**. If it fails, see [Troubleshoot custom policies](active-directory-b2c-troubleshoot-custom.md).

## Next steps

Provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).