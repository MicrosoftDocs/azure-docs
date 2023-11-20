---
title: Add AD FS as a SAML identity provider by using custom policies
titleSuffix: Azure AD B2C
description: Set up AD FS 2016 using the SAML protocol and custom policies in Azure Active Directory B2C

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 09/16/2021
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Add AD FS as a SAML identity provider using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for an AD FS user account by using [custom policies](custom-policy-overview.md) in Azure Active Directory B2C (Azure AD B2C). You enable sign-in by adding a [SAML identity provider](identity-provider-generic-saml.md) to a custom policy.

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites-custom-policy](../../includes/active-directory-b2c-customization-prerequisites-custom-policy.md)]

## Create a self-signed certificate

[!INCLUDE [active-directory-b2c-create-self-signed-certificate](../../includes/active-directory-b2c-create-self-signed-certificate.md)]

## Create a policy key

You need to store your certificate in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Upload`.
1. Enter a **Name** for the policy key. For example, `SAMLSigningCert`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. Browse to and select your certificate .pfx file with the private key.
1. Click **Create**.

## Add a claims provider

If you want users to sign in using an AD FS account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define an AD FS account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy. For more information, see [define a SAML identity provider](identity-provider-generic-saml.md).

1. Open the *TrustFrameworkExtensions.xml*.
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>contoso.com</Domain>
      <DisplayName>Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Contoso-SAML2">
          <DisplayName>Contoso</DisplayName>
          <Description>Login with your AD FS account</Description>
          <Protocol Name="SAML2"/>
          <Metadata>
            <Item Key="WantsEncryptedAssertions">false</Item>
            <Item Key="PartnerEntity">https://your-AD-FS-domain/federationmetadata/2007-06/federationmetadata.xml</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="SamlMessageSigning" StorageReferenceId="B2C_1A_SAMLSigningCert"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="userPrincipalName" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name"/>
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name"/>
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email"/>
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name"/>
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="contoso.com" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication"/>
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

1. Replace `your-AD-FS-domain` with the name of your AD FS domain and replace the value of the **identityProvider** output claim with your DNS (Arbitrary value that indicates your domain).

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

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]

```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="Contoso-SAML2" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Configure an AD FS relying party trust

To use AD FS as an identity provider in Azure AD B2C, you need to create an AD FS Relying Party Trust with the Azure AD B2C SAML metadata. The following example shows a URL address to the SAML metadata of an Azure AD B2C technical profile:

```
https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/your-policy/samlp/metadata?idptp=your-technical-profile
```

When using a [custom domain](custom-domain.md), use the following format:

```
https://your-domain-name/your-tenant-name.onmicrosoft.com/your-policy/samlp/metadata?idptp=your-technical-profile
```

Replace the following values:

- **your-tenant-name** with your tenant name, such as your-tenant.onmicrosoft.com.
- **your-domain-name** with your custom domain name, such as login.contoso.com.
- **your-policy** with your policy name. For example, B2C_1A_signup_signin_adfs.
- **your-technical-profile** with the name of your SAML identity provider technical profile. For example, Contoso-SAML2.

Open a browser and navigate to the URL. Make sure you type the correct URL and that you have access to the XML metadata file. To add a new relying party trust by using the AD FS Management snap-in and manually configure the settings, perform the following procedure on a federation server. Membership in **Administrators** or equivalent on the local computer is the minimum required to complete this procedure.

1. In Server Manager, select **Tools**, and then select **AD FS Management**.
2. Select **Add Relying Party Trust**.
3. On the **Welcome** page, choose **Claims aware**, and then select **Start**.
4. On the **Select Data Source** page, select **Import data about the relying party publish online or on a local network**, provide your Azure AD B2C metadata URL, and then select **Next**.
5. On the **Specify Display Name** page, enter a **Display name**, under **Notes**, enter a description for this relying party trust, and then select **Next**.
6. On the **Choose Access Control Policy** page, select a policy, and then select **Next**.
7. On the **Ready to Add Trust** page, review the settings, and then select **Next** to save your relying party trust information.
8. On the **Finish** page, select **Close**, this action automatically displays the **Edit Claim Rules** dialog box.
9. Select **Add Rule**.
10. In **Claim rule template**, select **Send LDAP attributes as claims**.
11. Provide a **Claim rule name**. For the **Attribute store**, select **Select Active Directory**, add the following claims, then select **Finish** and **OK**.

    | LDAP attribute | Outgoing claim type |
    | -------------- | ------------------- |
    | User-Principal-Name | userPrincipalName |
    | Surname | family_name |
    | Given-Name | given_name |
    | E-Mail-Address | email |
    | Display-Name | name |

    Note some of the names will not display in the outgoing claim type dropdown. You need to manually type them in. (The dropdown is editable).

12.  Based on your certificate type, you may need to set the HASH algorithm. On the relying party trust (B2C Demo) properties window, select the **Advanced** tab and change the **Secure hash algorithm** to `SHA-256`, and select **Ok**.
13. In Server Manager, select **Tools**, and then select **AD FS Management**.
14. Select the relying party trust you created, select **Update from Federation Metadata**, and then select **Update**.

## Test your custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**
1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Contoso AD FS** to sign in with Contoso AD FS identity provider.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Troubleshooting AD FS service  

AD FS is configured to use the Windows application log. If you experience challenges setting up AD FS as a SAML identity provider using custom policies in Azure AD B2C, you may want to check the AD FS event log:

1. On the Windows **Search bar**, type **Event Viewer**, and then select the **Event Viewer** desktop app.
1. To view the log of a different computer, right-click **Event Viewer (local)**. Select **Connect to another computer**, and fill in the fields to complete the **Select Computer** dialog box.
1. In **Event Viewer**, open the **Applications and Services Logs**.
1. Select **AD FS**, then select **Admin**. 
1. To view more information about an event, double-click the event.  

### SAML request is not signed with expected signature algorithm event

This error indicates that the SAML request sent by Azure AD B2C is not signed with the expected signature algorithm configured in AD FS. For example, the SAML request is signed with the signature algorithm `rsa-sha256`, but the expected signature algorithm is `rsa-sha1`. To fix this issue, make sure both Azure AD B2C and AD FS are configured with the same signature algorithm.

#### Option 1: Set the signature algorithm in Azure AD B2C  

You can configure how to sign the SAML request in Azure AD B2C. The [XmlSignatureAlgorithm](identity-provider-generic-saml.md) metadata controls the value of the `SigAlg` parameter (query string or post parameter) in the SAML request. The following example configures Azure AD B2C to use the `rsa-sha256` signature algorithm.

```xml
<Metadata>
  <Item Key="WantsEncryptedAssertions">false</Item>
  <Item Key="PartnerEntity">https://your-AD-FS-domain/federationmetadata/2007-06/federationmetadata.xml</Item>
  <Item Key="XmlSignatureAlgorithm">Sha256</Item>
</Metadata>
```

#### Option 2: Set the signature algorithm in AD FS 

Alternatively, you can configure the expected SAML request signature algorithm in AD FS.

1. In Server Manager, select **Tools**, and then select **AD FS Management**.
1. Select the **Relying Party Trust** you created earlier.
1. Select **Properties**, then select **Advance**
1. Configure the **Secure hash algorithm**, and select **OK** to save the changes.

### The HTTP-Redirect request does not contain the required parameter 'Signature' for a signed request (AADB2C90168)

#### Option 1: Set the ResponsesSigned to false in Azure AD B2C

You can disable the requirement of signed message in Azure AD B2C. The following example configures Azure AD B2C to not require 'Signature' parameter for the signed request.

```xml
<Metadata>
  <Item Key="WantsEncryptedAssertions">false</Item>
  <Item Key="PartnerEntity">https://your-AD-FS-domain/federationmetadata/2007-06/federationmetadata.xml</Item>
  <Item Key="ResponsesSigned">false</Item>
</Metadata>
```

#### Option 2: Set the relying party in AD FS to sign both Message and Assertion

Alternatively, you can configure the relying party in AD FS as mentioned below:

1. Open PowerShell as Administrator and run ```Set-AdfsRelyingPartyTrust -TargetName <RP Name> -SamlResponseSignature MessageAndAssertion``` cmdlet to sign both Message and Assertion.
2. Run  ```Set-AdfsRelyingPartyTrust -TargetName <RP Name>``` and confirm the **SamlResponseSignature** property is set as **MessageAndAssertion**.

::: zone-end
