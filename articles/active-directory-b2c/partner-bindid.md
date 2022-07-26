---
title: Configure Azure Active Directory B2C with Transmit Security
titleSuffix: Azure AD B2C
description: Configure Azure Active Directory B2C with Transmit Security for passwordless strong customer authentication
services: active-directory-b2c
author: gargi-sinha
manager: CelesteDG
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/20/2022
ms.author: gasinh
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Configure Transmit Security with Azure Active Directory B2C for passwordless authentication

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]



In this sample tutorial, learn how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with [Transmit Security's](https://www.transmitsecurity.com/bindid) passwordless authentication solution **BindID**. BindID is a passwordless authentication service that uses strong Fast Identity Online (FIDO2) biometric authentication for a reliable omni-channel authentication experience. The solution ensures a smooth sign in experience for all customers across every device and channel, and it eliminates fraud, phishing, and credential reuse.


## Scenario description

The following architecture diagram shows the implementation.

![Screenshot showing the bindid and Azure AD B2C architecture diagram](media/partner-bindid/partner-bindid-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User opens Azure AD B2C's sign in page, and then signs in or signs up by entering their username.
| 2. | Azure AD B2C redirects the user to BindID using an OpenID Connect (OIDC) request.
| 3. | BindID authenticates the user using appless FIDO2 biometrics, such as fingerprint.
| 4. | A decentralized authentication response is returned to BindID.  
| 5. | The OIDC response is passed on to Azure AD B2C.
| 6. |  User is either granted or denied access to the customer application based on the verification results.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md) that's linked to your Azure subscription.

- A BindID tenant. You can [sign up for free.](https://www.transmitsecurity.com/developer?utm_signup=dev_hub#try)

- If you haven't already done so, [register](./tutorial-register-applications.md) a web application in the Azure portal.

::: zone pivot="b2c-custom-policy"

- Ability to use Azure AD B2C custom policies. If you can't, complete the steps in [Get started with custom policies in Azure Active Directory B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy) to learn how to use custom policies.

::: zone-end

## Step 1: Register an app in BindID 

Follow the steps in [Configure Your Application](https://developer.bindid.io/docs/guides/quickstart/topics/quickstart_web#step-1-configure-your-application) to add you an application in [BindID Admin Portal](https://admin.bindid-sandbox.io/console/). The following information is needed:

| Property | Description |
|:---------|:---------------------|
| Name | Name of your application such as `Azure AD B2C BindID app`| 
| Domain | Enter `your-B2C-tenant-name.onmicrosoft.com`. Replace `your-B2C-tenant` with the name of your Azure AD B2C tenant.|
| Redirect URIs | [https://jwt.ms/](https://jwt.ms/)
| Redirect URLs | Enter `https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-B2C-tenant` with the name of your Azure AD B2C tenant. If you use a custom domain, replace `your-B2C-tenant-name.b2clogin.com` with your custom domain such as `contoso.com`.|


After you register the app in BindID, you'll get a **Client ID** and a **Client Secret**. Record the values as you'll need them later to configure BindID as an identity provider in Azure AD B2C.

::: zone pivot="b2c-user-flow"

## Step 2: Configure BindID as an identity provider in Azure AD B2C

1. Sign in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

1. Make sure you're using the directory that contains your Azure AD B2C tenant: 

    1. Select the **Directories + subscriptions** icon in the portal toolbar.

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

1. In the top-left corner of the Azure portal, select **All services**, and then search for and select **Azure AD B2C**.

1. Select **Identity providers**, and then select **New OpenID Connect provider**.

1. Enter a **Name**. For example, enter `Login with BindID`.

1. For **Metadata url**, enter `https://signin.bindid-sandbox.io/.well-known/openid-configuration`.

1. For **Client ID**, enter the client ID that you previously recorded in [step 1](#step-1-register-an-app-in-bindid).

1. For **Client secret**, enter the Client secret that you previously recorded in [step 1](#step-1-register-an-app-in-bindid).

1. For the **Scope**, enter the `openid email`.

1. For **Response type**, select **code**.

1. For **Response mode**, select **form_post**.

1. Under **Identity provider claims mapping**, select the following claims:
 
    1. **User ID**: `sub`
    1. **Email**: `email`

1. Select **Save**. 

## Step 3: Create a user flow

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.  

1. Select **New user flow**.

1. Select **Sign up and sign in** user flow type,and then select **Create**.

1. Enter a **Name** for your user flow such as `signupsignin`.

1. Under **Identity providers**:
   
    1. For **Local Accounts**, select **None** to disable email and password-based authentication.
    
    1. For **Custom identity providers**, select your newly created BindID Identity provider such as **Login with BindID**.  

1. Select **Create**

## Step 4: Test your user flow

1. In your Azure AD B2C tenant, select **User flows**.

1. Select the newly created user flow such as **B2C_1_signupsignin**.

1. For **Application**, select the web application that you previously registered as part of this article's prerequisites. The **Reply URL** should show `https://jwt.ms`.

1. Select the **Run user flow** button. Your browser should be redirected to the BindID sign in page. 

1. Enter the registered account email and authenticates using appless FIDO2 biometrics, such as fingerprint. Once the authentication challenge is accepted, your browser should be redirect to `https://jwt.ms` which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Step 2: Create a BindID policy key

Add your BindID application's client Secret as a policy key:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Make sure you're using the directory that contains your Azure AD B2C tenant: 
    1. Select the **Directories + subscriptions** icon in the portal toolbar.

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

1. On the Overview page, under **Policies**, select **Identity Experience Framework**.

1. Select **Policy Keys** and then select **Add**.

1. For **Options**, choose `Manual`.

1. Enter a **Name** for the policy key. For example, `BindIDClientSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

1. In **Secret**, enter your client secret that you previously recorded in [step 1](#step-1-register-an-app-in-bindid).

1. For **Key usage**, select `Signature`.

1. Select **Create**.

## Step 3: Configure BindID as an Identity provider

To enable users to sign in using BindID, you need to define BindID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated using digital identity available on their device, proving the user’s identity.

Use the following steps to add BindID as a claims provider: 

1. Get the custom policy starter packs from GitHub, then update the XML files in the SocialAndLocalAccounts starter pack with your Azure AD B2C tenant name:
    
    1. [Download the .zip file](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or clone the repository:
        ```
            git clone https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack
        ```
    
    1. In all of the files in the **LocalAccounts** directory, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is `contoso`, all instances of `yourtenant.onmicrosoft.com` become `contoso.onmicrosoft.com`. 

1. Open the `LocalAccounts/ TrustFrameworkExtensions.xml`.

1. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element.

1. Add a new **ClaimsProvider** similar to the one shown below:
  
    ```xml
     <ClaimsProvider>
         <Domain>signin.bindid-sandbox.io</Domain>
         <DisplayName>BindID</DisplayName>
         <TechnicalProfiles>
           <TechnicalProfile Id="BindID-OpenIdConnect">
             <DisplayName>BindID</DisplayName>
             <Protocol Name="OpenIdConnect" />
             <Metadata>
               <Item Key="METADATA">https://signin.bindid-sandbox.io/.well-known/openid-configuration</Item>
                <!-- Update the Client ID below to the BindID Application ID -->
               <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
               <Item Key="response_types">code</Item>
               <Item Key="scope">openid email</Item>
               <Item Key="response_mode">form_post</Item>
               <Item Key="HttpBinding">POST</Item>
               <Item Key="UsePolicyInRedirectUri">false</Item>
               <Item Key="AccessTokenResponseFormat">json</Item>
             </Metadata>
             <CryptographicKeys>
               <Key Id="client_secret" StorageReferenceId="B2C_1A_BindIDClientSecret" />
             </CryptographicKeys>
             <OutputClaims>
               <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
               <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
               <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
               <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
             </OutputClaims>
             <OutputClaimsTransformations>
               <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
               <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
               <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
             </OutputClaimsTransformations>
             <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
           </TechnicalProfile>
         </TechnicalProfiles>
       </ClaimsProvider>    
    ```

1. Set **client_id** with the BindID Application ID that you previously recorded in [step 1](#step-1-register-an-app-in-bindid).

1. Save the changes.

## Step 4: Add a user journey

At this point, you've set up the identity provider, but it's not yet available in any of the sign in pages. If you've your own custom user journey continue to [step 5](#step-5-add-the-identity-provider-to-a-user-journey), otherwise, create a duplicate of an existing template user journey as follows:

1. Open the `LocalAccounts/ TrustFrameworkBase.xml` file from the starter pack.

1. Find and copy the entire contents of the **UserJourney** element that includes `Id=SignUpOrSignIn`.

1. Open the `LocalAccounts/ TrustFrameworkExtensions.xml` and find the **UserJourneys** element. If the element doesn't exist, add one.

1. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.

1. Rename the `Id` of the user journey. For example, `Id=CustomSignUpSignIn`

## Step 5: Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey.

1. Find the orchestration step element that includes `Type=CombinedSignInAndSignUp`, or `Type=ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name, such as `BindIDExchange`.

1. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID to link the BindID button to `BindID-SignIn` action. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier while adding the claims provider.

The following XML demonstrates orchestration steps of a user journey with the identity provider:

```xml
    <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
      <ClaimsProviderSelections>
        ...
        <ClaimsProviderSelection TargetClaimsExchangeId="BindIDExchange" />
      </ClaimsProviderSelections>
      ...
    </OrchestrationStep>
    
    <OrchestrationStep Order="2" Type="ClaimsExchange">
      ...
      <ClaimsExchanges>
        <ClaimsExchange Id="BindIDExchange" TechnicalProfileReferenceId="BindID-OpenIdConnect" />
      </ClaimsExchanges>
    </OrchestrationStep>
```

## Step 6: Configure the relying party policy

The relying party policy, for example [SignUpOrSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/LocalAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. You can also control what claims are passed to your application by adjusting the **OutputClaims** element of the **PolicyProfile** TechnicalProfile element.  In this sample, the application receives the user attributes such as display name, given name, surname, email, objectId, identity provider, and tenantId.  

```xml
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignInWithBindID" />
    <TechnicalProfile Id="BindID-OpenIdConnect">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="identityProvider" />
        <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
```

## Step 7: Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Make sure you're using the directory that contains your Azure AD B2C tenant: 

    1. Select the **Directories + subscriptions** icon in the portal toolbar.

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure AD B2C**.

1. Under **Policies**, select **Identity Experience Framework**.

1. Select **Upload Custom Policy**, and then upload the files in the **LocalAccounts** starter pack in the following order: the base policy, for example `TrustFrameworkBase.xml`, the localization policy, for example `TrustFrameworkLocalization.xml`, the extension policy, for example `TrustFrameworkExtensions.xml`, and the relying party policy, such as `SignUpOrSignIn.xml`.


## Step 8: Test your custom policy


1. In your Azure AD B2C tenant blade, and under **Policies**, select **Identity Experience Framework**.
 
1. Under **Custom policies**, select **B2C_1A_signup_signin**.


1. For **Application**, select the web application that you previously registered as part of this article's prerequisites. The **Reply URL** should show `https://jwt.ms`.

1. Select **Run now**. Your browser should be redirected to the BindID sign in page. 

1. Enter the registered account email and authenticates using appless FIDO2 biometrics, such as fingerprint. Once the authentication challenge is accepted, your browser should be redirect to `https://jwt.ms` which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)

- [Sample custom policies for BindID and Azure AD B2C integration](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration)