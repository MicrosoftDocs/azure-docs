---
title: Tutorial to configure Azure Active Directory B2C with BlokSec
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with BlokSec for Passwordless authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 7/15/2021
ms.author: gasinh
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Tutorial: Configure Azure Active Directory B2C with BlokSec for passwordless authentication

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"



::: zone-end

In this sample tutorial, learn how to integrate Azure Active Directory (AD) B2C authentication with [BlokSec](https://bloksec.com/). BlokSec simplifies the end-user login experience by providing customers passwordless authentication and tokenless multifactor authentication (MFA). BlokSec protects customers against identity-centric cyber-attacks such as password stuffing, phishing, and man-in-the-middle attacks.

## Scenario description

BlokSec integration includes the following components:

- **Azure AD B2C** – Configured as the authorization server/identity provider for any B2C application.

- **BlokSec Decentralized Identity Router** – Acts as a gateway for services that wish to apply BlokSec’s DIaaS™ to route authentication and authorization requests to end users’ Personal Identity Provider (PIdP) applications; configured as an OpenID Connect (OIDC) identity provider in Azure AD B2C.

- **BlokSec SDK-based mobile app** – Acts as the users’ PIdP in the decentralized authentication scenario. The freely downloadable [BlokSec yuID](https://play.google.com/store/apps/details?id=com.bloksec) application can be used if your organization prefers not to develop your own mobile applications using the BlokSec SDKs.
The following architecture diagram shows the implementation.

![image shows the architecture diagram](./media/partner-bloksec/partner-bloksec-architecture-diagram.png)

|Steps| Description|
|:---------------|:----------------|
|1.| User attempts to log in to an Azure AD B2C application and is forwarded to Azure AD B2C’s combined sign-in and sign-up policy.|
|2.| Azure AD B2C redirects the user to the BlokSec decentralized identity router using the OIDC authorization code flow.|
|3.| The BlokSec decentralized router sends a push notification to the user’s mobile app including all context details of the authentication and authorization request.|
|4.| The user reviews the authentication challenge, if accepted the user is prompted for biometry such as fingerprint or facial scan as available on their device, proving the user’s identity.|
|5.| The response is digitally signed with the user’s unique digital key. Final authentication response provides proof of possession, presence, and consent. The respond is returned to the BlokSec decentralized identity router.|
|6.| The BlokSec decentralized identity router verifies the digital signature against the user’s immutable unique public key that is stored in a distributed ledger, then replies to Azure AD B2C with the authentication result.|
|7.| Based on the authentication result user is granted/denied access.|

## Onboard to BlokSec

Request a demo tenant with BlokSec by filling out [the form](https://bloksec.com/request-a-demo/). In the message field indicates that you would like to onboard with Azure AD B2C. Download and install the free BlokSec yuID mobile app from the app store. Once your demo tenant has been prepared, you'll receive an email. On your mobile device where the BlokSec application is installed, select the link to register your admin account with your yuID app.

::: zone pivot="b2c-user-flow"
## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that's linked to your Azure subscription.

- A BlokSec [trial account](https://bloksec.com/).

- If you haven't already done so, [register](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications) a web application, [and enable ID token implicit grant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications#enable-id-token-implicit-grant).
::: zone-end

::: zone pivot="b2c-custom-policy"
## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that's linked to your Azure subscription.

- A BlokSec [trial account](https://bloksec.com/).

- If you haven't already done so, [register](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications) a web application, [and enable ID token implicit grant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications#enable-id-token-implicit-grant).

- Complete the steps in the [**Get started with custom policies in Azure Active Directory B2C**](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy).
::: zone-end

### Part 1 - Create an application registration in BlokSec

1. Sign in to the BlokSec admin portal. A link will be included as part of your account registration email received when you onboard to BlokSec.

2. On the main dashboard, select **Add Application > Create Custom**

3. Complete the application details as follows and submit:  

   |Property  |Value  |
   |---------|---------|
   |  Name         |Azure AD B2C or your desired application name|
   |SSO type         | OIDC|
   |Logo URI     |[https://bloksec.io/assets/AzureB2C.png/](https://bloksec.io/assets/AzureB2C.png/) a link to the image of your choice|
   |Redirect URIs     | https://**your-B2C-tenant-name**.b2clogin.com/**your-B2C-tenant-name**.onmicrosoft.com/oauth2/authresp<BR>**For Example**:      'https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp' <BR><BR>If you use a custom domain, enter  https://**your-domain-name**/**your-tenant-name**.onmicrosoft.com/oauth2/authresp. <BR> Replace your-domain-name with your custom domain, and your-tenant-name with the name of your tenant.         |
   |Post log out redirect URIs  |https://**your-B2C-tenant-name**.b2clogin.com/**your-B2C-tenant-name**.onmicrosoft.com/**{policy}**/oauth2/v2.0/logout <BR> [Send a sign-out request](https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request). |

4. Once saved, select the newly created Azure AD B2C application to open the application configuration, select **Generate App Secret**.

>[!NOTE]
>You'll need application ID and application secret later to configure the Identity provider in Azure AD B2C.

::: zone pivot="b2c-user-flow"

### Part 2 - Add a new Identity provider in Azure AD B2C

1. Sign-in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C** 

4. Navigate to **Dashboard > Azure Active Directory B2C > Identity providers**

5. Select New **OpenID Connect Provider**

6. Select **Add**

### Part 3 - Configure an Identity provider

1. Select **Identity provider type > OpenID Connect**

2. Fill out the form to set up the Identity provider:

|Property  |Value  |
|:---------|:---------|
|Name     |Enter BlokSec yuID – Passwordless or a name of your choice|
|Metadata URL|https://api.bloksec.io/oidc/.well-known/openid-configuration|         
|Client ID|The application ID from the BlokSec admin UI captured in **Part 1**|
|Client Secret|The application Secret from the BlokSec admin UI captured in **Part 1**|
|Scope|OpenID email profile|
|Response type|Code|
|Domain hint|yuID|

3. Select **OK**

4. Select **Map this identity provider’s claims**.

5. Fill out the form to map the Identity provider:

|Property  |Value  |
|:---------|:---------|
|User ID|sub|
|Display name|name|
|Given name|given_name|
|Surname|family_name|
|Email|email|

6. Select **Save** to complete the setup for your new OIDC Identity provider.  

### Part 4 - User registration

1. Sign-in to BlokSec admin console with the credential provided earlier.

2. Navigate to Azure AD B2C application that was created earlier. Select the gear icon at the top-right, and then select **Create Account**.  

3. Enter the user’s information in the Create Account form, making note of the Account Name, and select **Submit**.  

The user will receive an **account registration email** at the provided email address. Have the user follow the registration link on the mobile device where the BlokSec yuID app is installed,

### Part 5 - Create a user flow policy

You should now see BlokSec as a new OIDC Identity provider listed within your B2C identity providers.  

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.  

2. Select **New user flow**

3. Select **Sign up and sign in** > **Version** > **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created BlokSec Identity provider.  

6. Select **None** for Local Accounts to disable email and password-based authentication.

7. Select **Run user flow**

8. In the form, enter the Replying URL, for example, https://jwt.ms

9. The browser will be redirected to the BlokSec login page. Enter the account name registered during User registration. The user will receive a push notification to their mobile device where the BlokSec yuID application is installed; upon opening the notification, the user will be presented with an authentication challenge

10. Once the authentication challenge is accepted, the browser will redirect the user to the replying URL.  

## Next steps 

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy)

::: zone-end

::: zone pivot="b2c-custom-policy"

>[!NOTE]
>In Azure Active Directory B2C, [**custom policies**](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview) are designed primarily to address complex scenarios. For most scenarios, we recommend that you use built-in [**user flows**](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview).

### Part 2 - Create a policy key

Store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

4. On the Overview page, select **Identity Experience Framework**.

5. Select **Policy Keys** and then select **Add**.

6. For **Options**, choose `Manual`.

7. Enter a **Name** for the policy key. For example, `BlokSecAppSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

8. In **Secret**, enter your client secret that you previously recorded.

9. For **Key usage**, select `Signature`.

10. Select **Create**.

### Part 3 - Configure BlokSec as an Identity provider

To enable users to sign in using BlokSec decentralized identity, you need to define BlokSec as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify a specific user has authenticated using biometry such as fingerprint or facial scan as available on their device, proving the user’s identity.

You can define BlokSec as a claims provider by adding it to the **ClaimsProvider** element in the extension file of your policy

1. Open the `TrustFrameworkExtensions.xml`.

2. Find the **ClaimsProviders** element. If it dosen't exist, add it under the root element.

3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>bloksec</Domain>
      <DisplayName>BlokSec</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="BlokSec-OpenIdConnect">
          <DisplayName>BlokSec</DisplayName>
          <Description>Login with your BlokSec decentriled identity</Description>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="METADATA">https://api.bloksec.io/oidc/.well-known/openid-configuration</Item>
            <!-- Update the Client ID below to the BlokSec Application ID -->
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile email</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
            <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
            <Item Key="ValidTokenIssuerPrefixes">https://api.bloksec.io/oidc</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_BlokSecAppSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Set **client_id** to the application ID from the application registration.

5. Save the file.

### Part 4 - Add a user journey

At this point, the identity provider has been set up, but it's not yet available in any of the sign-in pages. If you don't have your own custom user journey, create a duplicate of an existing template user journey, otherwise continue to the next step.  

1. Open the `TrustFrameworkBase.xml` file from the starter pack.

2. Find and copy the entire contents of the **UserJourneys** element that includes ID=`SignUpOrSignIn`.

3. Open the `TrustFrameworkExtensions.xml` and find the **UserJourneys** element. If the element doesn't exist, add one.

4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.

5. Rename the ID of the user journey. For example,  ID=`CustomSignUpSignIn`.  

### Part 5 - Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey. First add a sign-in button, then link the button to an action. The action is the technical profile you created earlier.  

1. Find the orchestration step element that includes Type=`CombinedSignInAndSignUp`, or Type=`ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign-in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name.

2. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier.

The following XML demonstrates the first two orchestration steps of a user journey with the identity provider:

```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="BlokSecExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="BlokSecExchange" TechnicalProfileReferenceId="BlokSec-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

### Part 6 - Configure the relying party policy

The relying party policy, for example [SignUpSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/SocialAndLocalAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. Find the **DefaultUserJourney** element within relying party. Update the **ReferenceId** to match the user journey ID, in which you added the identity provider.

In the following example, for the `CustomSignUpOrSignIn` user journey, the ReferenceId is set to `CustomSignUpOrSignIn`.  
```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="CustomSignUpSignIn" />
  ...
</RelyingParty>
```

### Part 7 - Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com/#home).

2. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

3. In the [Azure portal](https://portal.azure.com/#home), search for and select **Azure AD B2C**.

4. Under Policies, select **Identity Experience Framework**.
Select **Upload Custom Policy**, and then upload the two policy files that you changed, in the following order: the extension policy, for example `TrustFrameworkExtensions.xml`, then the relying party policy, such as `SignUpSignIn.xml`.

### Part 8 - Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.

2. For **Application**, select a web application that you [previously registered](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications). The **Reply URL** should show `https://jwt.ms`.

3. Select the **Run now** button.

4. From the sign-up or sign-in page, select **Google** to sign in with Google account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Next steps 

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy)

::: zone-end
