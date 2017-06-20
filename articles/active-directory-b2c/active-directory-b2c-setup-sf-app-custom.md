---
title: 'Azure Active Directory B2C: Adding Salesforce SAML provider using custom policies | Microsoft Docs'
description: A topic on Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: gsacavdm
manager: krassk
editor: gsacavdm

ms.assetid: d7f4143f-cd7c-4939-91a8-231a4104dc2c
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/30/2017
ms.author: gsacavdm

---
# Azure Active Directory B2C: Log in using Salesforce accounts via SAML

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable login for users from a specific Salesforce organization through the use of [custom policies](active-directory-b2c-overview-custom.md).

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

## Get the Salesforce SAML metadata
>[!NOTE]
> This tutorial assumes you are using the [Salesforce Lighting Experience](https://developer.salesforce.com/page/Lightning_Experience_FAQ).

1. [Login to Salesforce](https://login.salesforce.com/) 
1. On the left menu, under **Settings**, expand **Identity** and click on **Identity Provider**
1. Click on **Enable Identity Provider**
1. **Select the certificate** you want Salesforce to use when communicating with Azure AD B2C and click **Save**. You can use the default certificate.
1. Click on the now available **Download Metadata** button and save the metadata file which you'll use in a later step.

## Add a SAML Signing certificate to Azure AD B2C
You need to store upload the Salesforce certificate to your Azure AD B2C tenant. To do this:

1. Open PowerShell and navigate to the working directory `active-directory-b2c-advanced-policies`.
1. Switch into the folder with the ExploreAdmin tool.

    ```powershell
    cd active-directory-b2c-advanced-policies\ExploreAdmin
    ```

1. Import the ExploreAdmin tool into powershell.

    ```powershell
    Import-Module .\ExploreAdmin.dll
    ```

1. In the following command, replace `tenantName` with the name of your Azure AD B2C tenant (e.g. fabrikamb2c.onmicrosoft.com), `certificateId` with a name for the certificate that will use to reference it in the policy later on (e.g. ContosoSalesforceCert) and finally `pathToCert` and `password` with the path and password of the certificate. Run the command.

    ```PowerShell
    Set-CpimCertificate -TenantId {tenantName} -CertificateId {certificateId} -CertificateFileName {pathToCert} - CertificatePassword {password}
    ```

    When you run the command, make sure you sign in with the onmicrosoft.com admin account local to the Azure AD B2C tenant. 

1. Close PowerShell.

## Create the Salesforce SAML claims provider in your base policy

In order to allow users to log in using Salesforce, you need to define Salesforce as a claims provider. In other words, you need to specify the endpoint that Azure AD B2C will communicate with. The endpoint will *provide* a set of *claims* that are used by Azure AD B2C to verify that a specific user has authenticated. You can do this by adding a `<ClaimsProvider>` for Salesforce in the extension file of your policy.

1. Open the extension file from your working directory (TrustFrameworkExtensions.xml).
1. Find the section `<ClaimsProviders>`. If it does not exist, add it under the root node.
1. Add a new `<ClaimsProvider>` as follows:

    ```XML
    <ClaimsProvider>
      <Domain>contoso</Domain>
      <DisplayName>Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Contoso">
          <DisplayName>Contoso</DisplayName>
          <Description>Login with your Contoso account</Description>
          <Protocol Name="SAML2"/>
          <Metadata>
            <Item Key="RequestsSigned">false</Item>
            <Item Key="WantsEncryptedAssertions">false</Item>
            <Item Key="PartnerEntity">
    <![CDATA[ <md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://contoso.com" validUntil="2026-10-05T23:57:13.854Z" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:KeyDescriptor use="signing"><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIErDCCA….qY9SjVXdu7zy8tZ+LqnwFSYIJ4VkE9UR1vvvnzO</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor><md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://contoso.com/idp/endpoint/HttpPost"/><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://contoso.com/idp/endpoint/HttpRedirect"/></md:IDPSSODescriptor></md:EntityDescriptor>]]>
            </Item>
          </Metadata>       
          <CryptographicKeys>
            <Key Id="SamlAssertionSigning" StorageReferenceId="ContosoIdpSamlCert"/>
            <Key Id="SamlMessageSigning" StorageReferenceId="ContosoIdpSamlCert "/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="userId" PartnerClaimType="userId"/>
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="SAML Idp" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name"/>
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name"/>
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email"/>
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name"/>
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="externalIdp"/>
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

1. Under the `<ClaimsProvider>` node, update the value for `<Domain>` to an unique value that can be used to distinguish from other identity providers.
1. Under the `<ClaimsProvider>` node, update the value for `<DisplayName>` to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

In order to get a SAML token from Salesforce, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the `<TechnicalProfile>` element of the `<ClaimsProvider>`.

1. Update the id of the `<TechnicalProfile>` node. This id is used to refer to this technical profile from other parts of the policy.
1. Update the value for `<DisplayName>`. This value will be displayed on the login button in your login screen.
1. Update the value for `<Description>`.
1. Azure AD uses the OpenID Connect protocol, so ensure that `<Protocol>` is "SAML2".

You need to update the `<Metadata>` section in the XML above to reflect the configuration settings for your specific Azure AD tenant. In the XML, update the metadata values as following:

1. Update the value of the `<Item Key="PartnerEntity">`, with the contents of the Metadata.xml you downloaded from Salesforce. **Make sure you encapsulate it with <![CDATA[ …metadata… ]]>**.

1. In the `<CryptographicKeys>` section in the XML above, update the value for both `StorageReferenceId` to the certificate ID that you defined (e.g. ContosoSalesforceCert).

### Upload the extension file for verification

By now, you will have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far. To do so:

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

The `<ClaimsProviderSelection>` element is analagous to an identity provider button on a sign-up/sign-in screen. By adding an `<ClaimsProviderSelection>` element for Salesforce, a new button will show up when a user lands on the page. To do this:

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
1. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with an unique value. This will be the name of your policy (e.g. SignUpOrSignInWithAAD).
1. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the id of the new user journey that you created (e.g. SignUpOrSignUsingContoso).
1. Save your changes and upload the file.

## Create a Connected App in Salesforce
You’ll need to register Azure AD B2C as a Connected App in Salesforce.

1. [Login to Salesforce](https://login.salesforce.com/) 
1. On the left menu, under **Settings**, expand **Identity** and click on **Identity Provider**
1. On the bottom **Service Providers** section, click on **Service Providers are now created via Connected Apps. Click here.**
1. Provide the required **Basic Information** for your Connected App.
1. Now, in the **Web App Settings** section:
    1. Check **Enable SAML**
    1. Enter the following URL in the **Entity ID** field, make sure your replace the `tenantName`. 
    
        ```
        https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_base
        ```

    1. Enter the following URL in the **ACS URL** field, make sure your replace the `tenantName`. 
        ```
        https://login.microsoftonline.com/te/tenantName.onmicrosoft.com/B2C_1A_base/samlp/sso/assertionconsumer
        ```

    1. Leave all other settings with their defaults
1. Scroll all the way to the bottom and click on the **Save** button


## Troubleshooting

Test out the custom policy that you just uploaded by opening its blade and clicking on "Run now". In case something fails, see how to [troubleshoot](active-directory-b2c-troubleshoot-custom.md).

## Next steps
 
Provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).

