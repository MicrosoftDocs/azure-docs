---
title: Set up sign-in with a Salesforce SAML provider by using custom policies
titleSuffix: Azure AD B2C
description: Set up sign-in with a Salesforce SAML provider by using custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/27/2020
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-in with a Salesforce SAML provider by using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users from a Salesforce organization using [custom policies](custom-policy-overview.md) in Azure Active Directory B2C (Azure AD B2C). You enable sign-in by adding a [SAML identity provider technical profile](saml-identity-provider-technical-profile.md) to a custom policy.

## Prerequisites

- Complete the steps in [Get started with custom policies in Azure Active Directory B2C](custom-policy-get-started.md).
- If you haven't already done so, sign up for a [free Developer Edition account](https://developer.salesforce.com/signup). This article uses the [Salesforce Lightning Experience](https://developer.salesforce.com/page/Lightning_Experience_FAQ).
- [Set up a My Domain](https://help.salesforce.com/articleView?id=domain_name_setup.htm&language=en_US&type=0) for your Salesforce organization.

### Set up Salesforce as an identity provider

1. [Sign in to Salesforce](https://login.salesforce.com/).
2. On the left menu, under **Settings**, expand **Identity**, and then select **Identity Provider**.
3. Select **Enable Identity Provider**.
4. Under **Select the certificate**, select the certificate you want Salesforce to use to communicate with Azure AD B2C. You can use the default certificate.
5. Click **Save**.

### Create a connected app in Salesforce

1. On the **Identity Provider** page, select **Service Providers are now created via Connected Apps. Click here.**
2. Under **Basic Information**,  enter the required values for your connected app.
3. Under **Web App Settings**, check the **Enable SAML** box.
4. In the **Entity ID** field, enter the following URL. Make sure that you replace the value for `your-tenant` with the name of your Azure AD B2C tenant.

      ```
      https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase
      ```

6. In the **ACS URL** field, enter the following URL. Make sure that you replace the value for `your-tenant` with the name of your Azure AD B2C tenant.

      ```
      https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer
      ```
7. Scroll to the bottom of the list, and then click **Save**.

### Get the metadata URL

1. On the overview page of your connected app, click **Manage**.
2. Copy the value for **Metadata Discovery Endpoint**, and then save it. You'll use it later in this article.

### Set up Salesforce users to federate

1. On the **Manage** page of your connected app, click **Manage Profiles**.
2. Select the profiles (or groups of users) that you want to federate with Azure AD B2C. As a system administrator, select the **System Administrator** check box, so that you can federate by using your Salesforce account.

## Generate a signing certificate

Requests sent to Salesforce need to be signed by Azure AD B2C. To generate a signing certificate, open Azure PowerShell, and then run the following commands.

> [!NOTE]
> Make sure that you update the tenant name and password in the top two lines.

```powershell
$tenantName = "<YOUR TENANT NAME>.onmicrosoft.com"
$pwdText = "<YOUR PASSWORD HERE>"

$Cert = New-SelfSignedCertificate -CertStoreLocation Cert:\CurrentUser\My -DnsName "SamlIdp.$tenantName" -Subject "B2C SAML Signing Cert" -HashAlgorithm SHA256 -KeySpec Signature -KeyLength 2048

$pwd = ConvertTo-SecureString -String $pwdText -Force -AsPlainText

Export-PfxCertificate -Cert $Cert -FilePath .\B2CSigningCert.pfx -Password $pwd
```

## Create a policy key

You need to store the certificate that you created in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Upload`.
7. Enter a **Name** for the policy. For example, SAMLSigningCert. The prefix `B2C_1A_` is automatically added to the name of your key.
8. Browse to and select the B2CSigningCert.pfx certificate that you created.
9. Enter the **Password** for the certificate.
3. Click **Create**.

## Add a claims provider

If you want users to sign in using a Salesforce account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a Salesforce account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy. For more information, see [define a SAML identity provider technical profile](saml-identity-provider-technical-profile.md).

1. Open the *TrustFrameworkExtensions.xml*.
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>salesforce</Domain>
      <DisplayName>Salesforce</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="salesforce">
          <DisplayName>Salesforce</DisplayName>
          <Description>Login with your Salesforce account</Description>
          <Protocol Name="SAML2"/>
          <Metadata>
            <Item Key="WantsEncryptedAssertions">false</Item>
            <Item Key="WantsSignedAssertions">false</Item>
            <Item Key="PartnerEntity">https://contoso-dev-ed.my.salesforce.com/.well-known/samlidp.xml</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="SamlAssertionSigning" StorageReferenceId="B2C_1A_SAMLSigningCert"/>
            <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_SAMLSigningCert"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="userId"/>
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name"/>
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name"/>
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email"/>
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="username"/>
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication"/>
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="SAMLIdp" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Saml-idp"/>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

1. Update the value of **PartnerEntity** with the Salesforce metadata URL you copied earlier.
1. Update the value of both instances of **StorageReferenceId** to the name of the key of your signing certificate. For example, B2C_1A_SAMLSigningCert.
1. Locate the `<ClaimsProviders>` section and add the following XML snippet. If your policy already contains the `SM-Saml-idp` technical profile, skip to the next step. For more information, see [single sign-on session management](custom-policy-reference-sso.md).

    ```xml
    <ClaimsProvider>
      <DisplayName>Session Management</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="SM-Saml-idp">
          <DisplayName>Session Management Provider</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
          <Metadata>
            <Item Key="IncludeSessionIndex">false</Item>
            <Item Key="RegisterServiceProviders">false</Item>
          </Metadata>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```
1. Save the file.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Salesforce account. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
2. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
3. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it’s not available in any of the sign-up or sign-in screens. To make it available, you create a duplicate of an existing template user journey, and then modify it so that it also has the Salesforce identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
2. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
3. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Rename the ID of the user journey. For example, `SignUpSignInSalesforce`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up or sign-in screen. If you add a **ClaimsProviderSelection** element for a LinkedIn account, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you just created.
2. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `SalesforceExchange`:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="SalesforceExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with a Salesforce account to receive a token.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
2. Add the following **ClaimsExchange** element making sure that you use the same value for **ID** that you used for **TargetClaimsExchangeId**:

    ```xml
    <ClaimsExchange Id="SalesforceExchange" TechnicalProfileReferenceId="salesforce" />
    ```

    Update the value of **TechnicalProfileReferenceId** to the **ID** of the technical profile you created earlier. For example, `salesforce` or `LinkedIn-OAUTH`.

3. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

## Create an Azure AD B2C application

Communication with Azure AD B2C occurs through an application that you register in your B2C tenant. This section lists optional steps you can complete to create a test application if you haven't already done so.

[!INCLUDE [active-directory-b2c-appreg-idp](../../includes/active-directory-b2c-appreg-idp.md)]

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you just created:

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInSalesforce.xml*.
2. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInSalesforce`.
3. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_salesforce`
4. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the new user journey that you created (SignUpSignInSalesforce).
5. Save your changes, upload the file, and then select the new policy in the list.
6. Make sure that Azure AD B2C application that you created is selected in the **Select application** field, and then test it by clicking **Run now**.
