---
title: Configure IDEMIA with Azure Active Directory B2C for relying party to consume IDEMIA or US State issued mobile IDs
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with IDEMIA
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/21/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure IDEMIA with Azure Active Directory B2C for relying party to consume IDEMIA or US State issued mobile identity credentials

In this sample tutorial, learn how to integrate Azure Active Directory (Azure AD) B2C with [IDEMIA](https://www.idemia.com/). IDEMIA is a passwordless authentication provider, which provides real-time consent-based services with biometric authentication like faceID and fingerprinting eliminating fraud and credential reuse. IDEMIA’s Mobile ID allows citizens to benefit from a government-issued trusted digital ID, as a complement to their physical ID. This application is used to verify identity by using a self-selected PIN or touchID/faceID. Mobile ID allows citizens to control their identities by allowing them to share only the information needed for a transaction and enables fraud protection.

## Prerequisites

To get started, you'll need:

- Access to end users that have an IDEMIA - US state issued Mobile ID credential (mID) or during the test phase, the mID demo application provided by [IDEMIA](https://www.idemia.com/).

- An Azure AD subscription. If you don't have one, get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that is linked to your Azure subscription.

- Your business web application registered in Azure AD B2C tenant. For testing purposes you can configure https://jwt.ms, a Microsoft-owned web application that displays the decoded contents of a token.

>[!NOTE]
>The contents of the token never leave your browser.

## Scenario description

IDEMIA integration includes the following components:

- **Azure AD B2C** – The authorization server, responsible for verifying the user’s credentials, also known as the identity provider.

- **IDEMIA mID** - OpenID Connect (OIDC) provider configured as [Azure AD B2C external provider](https://docs.microsoft.com/azure/active-directory-b2c/add-identity-provider)

- **[IDEMIA mID application](https://idemia-mobile-id.com/)** - A trusted, government-issued digital identity. Mobile ID is a digital version of your driver’s license or state-issued ID that lives in an app on your phone. [IDEMIA](https://idemia-mobile-id.com/).

IDEMIA provides mID for many US State departments of motor vehicles (DMVs).

The mID is a digitizing of an identification document into a strong mobile identity token that is highly portable for verification and that serves as an index for authorization **mID Services**. The mID Service allows the DMVs to proof identities of individuals by using credential document authentication using their issued drivers licenses and biometric **selfie**-to-credential facial recognition matching services.  

Once created, the mID is stored on the end user's mobile phone as a digitally signed **identity on the edge**. The end users are now able to use that signed credential for access to other identity sensitive services such as proof of age, financial know your customer, account access’s where security is paramount.

The offer to Microsoft is the support of these services as the Relying party (RP) that will use a State issued mID as a means of providing services using the attributes sent by the owner of the mID.

The following diagrams show how this would be enabled for web or on-premises scenarios.

![Screenshot shows the on-premises verification](./media/partner-idemia/idemia-architecture-diagram.png)

| Step | Description |
|:--------|:--------|
| 1. | User visits the Azure AD B2C login page, which is the replying party in this case on their device to conduct a transaction and logs in via their mID app. |
| 2. | Azure AD B2C requires an ID check and so redirects the user to the IDEMIA router using the OIDC authorization code flow|
| 3. | The IDEMIA router sends a biometric challenge to the user’s mobile app including all context details of the authentication and authorization request.|
| 4. | Depending on the level of security needed, the user may require to provide additional details, input their PIN, take a live selfie, or both.|
| 5. | Final authentication response provides proof of possession, presence, and consent. The response is returned to the IDEMIA router.
| 6. | IDEMIA router verifies the information provided by the user and replies to Azure AD B2C with the authentication result.
|7. | Based on the authentication result user is granted/denied access. |

## Onboard with IDEMIA

Get in touch with [IDEMIA](https://www.idemia.com/get-touch/) to request a demo for mID filling out the contact form. In the message field indicate that you would like to onboard with Azure AD B2C.

## Integrate IDEMIA with Azure AD B2C

### Step 1 - Submit a Relying Party application on-boarding for mID

As part of your integration with IDEMIA, you will be provided with the following information:

| Property | Description |
|:---------|:----------|
| Application Name | Azure AD B2C or your desired application name |
| Client_ID | This is the unique identifier provided by the Identity Provider |
| Client Secret | Password the relying party application will use to authenticate with the IDEMIA Identity Provider |
| Metadata endpoint | A URL that points to a token issuer configuration document, which is also known as an OpenID well-known configuration endpoint. |
|Redirect URIs | `https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp`<br>For  example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`<br><br>If you use a custom domain, enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`.<br>Replace your-domain-name with your custom domain, and your-tenant-name with the name of your tenant. |
|Post log out redirect URIs | `https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/{policy}/oauth2/v2.0/logout`<br>Send a sign-out request. |

>[!NOTE]
>You'll need IDEMIA client ID and client secret later to configure the Identity Provider in Azure AD B2C.

### Step 2 - Create a policy key

Store the IDEMIA client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

5. On the **Overview** page, select **Identity Experience Framework**.

6. Select **Policy Keys** and then select **Add**.

7. For **Options**, choose **Manual**.

8. Enter a **Name** for the policy key. For example, IdemiaAppSecret. The prefix B2C_1A_ is added automatically to the name of your key.

9. In **Secret**, enter your client secret that you previously recorded.

10. For **Key** usage, select **Signature**.

11. Select **Create**.

### Step 3 - Configure IDEMIA as an External Identity Provider

To enable users to sign in using IDEMIA MobileID Passwordless identity, you need to define IDEMIA as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify a specific user has authenticated using biometry such as fingerprint or facial scan as available on their device, proving the user’s identity.
You can define IDEMIA as a claims provider by adding it to the **ClaimsProvider** element in the extension file of your policy

```PowerShell
     <TechnicalProfile Id="Idemia-Oauth2">
          <DisplayName>IDEMIA</DisplayName>
          <Description>Login with your IDEMIA identity</Description>
          <Protocol Name="OAuth2" />
          <Metadata>
            <Item Key="METADATA">https://idp.XXXX.net/oxauth/.well-known/openid-configuration</Item>
            <!-- Update the Client ID below to the Application ID -->
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid id_basic mt_scope</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
            <Item Key="token_endpoint_auth_method">client_secret_basic</Item>
            <Item Key="ClaimsEndpoint">https://idp.XXXX.net/oxauth/restv1/userinfo</Item>
            <Item Key="ValidTokenIssuerPrefixes">https://login.microsoftonline.com/</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_IdemiaAppSecret" />
</CryptographicKeys>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="acr" PartnerClaimType="acr_values" DefaultValue="loa-2" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="firstName1" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="lastName1" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="idemia" />
            <OutputClaim ClaimTypeReferenceId="documentId" />
            <OutputClaim ClaimTypeReferenceId="address1" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
        <!-- End IDEMIA -->
           
```

Set client_id to the application ID from the application registration.

|Property | Description|
|:------|:-------|
|Scope| For OpenID Connect (OIDC) the minimum requirement is that the scope parameter be set to **openid**. Additional scopes may be appended as a space-delimited list.|
|redirect_uri | This defines where the User Agent sends the authorization code back to Azure AD B2C.|
|response_type| For the Authorization Code Flow, this is set to **code**|
|acr_values| This parameter controls the authentication methods that the user is required to perform during the authentication process. |

One of the following values must be selected:

|Parameter value| Effect on user authentication process |
|:------|:-------|
|`loa-2`|  Crypto-based Multi-Factor Authentication only|
|`loa-3`| Crypto-based Multi-Factor Authentication plus one additional factor|
| `loa-4`| Crypto-based Multi-Factor Authentication with the requirement that the user must also perform pin-based and biometric authentication |

>[!NOTE]
>Additional parameter values may be added in the future to provide additional clarity and flexibility for RPs. For example, MFA, pin, faceID, in place of `loa-x`. When that happens, the new values will be published in the “acr_values_supported” section of discovery API referenced earlier in this document.

## Next steps

- [Learn more about IDEMIA mID](https://www.idemia.com/mobile-id)
