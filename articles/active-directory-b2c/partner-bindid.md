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
ms.date: 02/28/2022
ms.author: gasinh
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Configure Transmit Security with Azure Active Directory B2C for passwordless authentication

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]


In this sample tutorial, learn how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with [Transmit Security](https://www.transmitsecurity.com/bindid) passwordless authentication solution **BindID**. BindID is a passwordless authentication service that uses strong Fast Identity Online (FIDO2) biometric authentication for a reliable omni-channel authentication experience. The solution ensures a smooth login experience for all customers across every device and channel eliminating fraud, phishing, and credential reuse.

## Scenario description

The following architecture diagram shows the implementation.

![Screenshot showing the bindid and Azure AD B2C architecture diagram](media/partner-bindid/partner-bindid-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User attempts to log in to an Azure AD B2C application and is forwarded to Azure AD B2C’s combined sign-in and sign-up policy.
| 2. | Azure AD B2C redirects the user to BindID using the OpenID Connect (OIDC) authorization code flow.
| 3. | BindID authenticates the user using appless FIDO2 biometrics, such as fingerprint.
| 4. | A decentralized authentication response is returned to BindID.  
| 5. | The OIDC response is passed on to Azure AD B2C.
| 6.| User is either granted or denied access to the customer application based on the verification results.

## Onboard with BindID

To integrate BindID with your Azure AD B2C instance, you'll need to configure an application in the [BindID Admin
Portal](https://admin.bindid-sandbox.io/console/). For more information, see [getting started guide](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal). You can either create a new application or use one that you already created.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md) that's linked to your Azure subscription.

- A BindID tenant. You can [sign up for free.](https://www.transmitsecurity.com/developer?utm_signup=dev_hub#try)

- If you haven't already done so, [register](./tutorial-register-applications.md) a web application, [and enable ID token implicit grant](./tutorial-register-applications.md#enable-id-token-implicit-grant).

::: zone pivot="b2c-custom-policy"

- Complete the steps in the article [Get started with custom policies in Azure Active Directory B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy).

::: zone-end

### Step 1 - Create an application registration in BindID

For [Applications](https://admin.bindid-sandbox.io/console/#/applications) to configure your tenant application in BindID, the following information is needed

| Property | Description |
|:---------|:---------------------|
| Name | Azure AD B2C/your desired application name|
| Domain | name.onmicrosoft.com|
| Redirect URIs| https://jwt.ms |
| Redirect URLs |Specify the page to which users are redirected after BindID authentication: `https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp`<br>For Example: `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`<br>If you use a custom domain, enter https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp.<br>Replace your-domain-name with your custom domain, and your-tenant-name with the name of your tenant.|

>[!NOTE]
>BindID will provide you Client ID and Client Secret, which you'll need later to configure the Identity provider in Azure AD B2C.

::: zone pivot="b2c-user-flow"

### Step 2 - Add a new Identity provider in Azure AD B2C

1. Sign-in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. Choose **All services** in the top-left corner of the Azure portal, then search for and select **Azure AD B2C**.

5. Navigate to **Dashboard** > **Azure Active Directory B2C** > **Identity providers**.

6. Select **New OpenID Connect Provider**.

7. Select **Add**.

### Step 3 - Configure an Identity provider

1. Select **Identity provider type > OpenID Connect**

2. Fill out the form to set up the Identity provider:

  |Property  |Value  |
  |:---------|:---------|
  |Name     |Enter BindID – Passwordless or a name of your choice|
  |Metadata URL| `https://signin.bindid-sandbox.io/.well-known/openid-configuration` |
  |Client ID|The application ID from the BindID admin UI captured in **Step 1**|
  |Client Secret|The application Secret from the BindID admin UI captured in **Step 1**|
  |Scope|OpenID email|
  |Response type|Code|
  |Response mode|form_post|
  |**Identity provider claims mapping**|
  |User ID|sub|
  |Email|email|

3. Select **Save** to complete the setup for your new OIDC Identity provider.  

### Step 4 - Create a user flow policy

You should now see BindID as a new OIDC Identity provider listed within your B2C identity providers.  

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.  

2. Select **New user flow**

3. Select **Sign up and sign in** > **Version Recommended** > **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created BindID Identity provider.  

6. Select **None** for Local Accounts to disable email and password-based authentication.

7. Select **Create**

8. Select the newly created User Flow

9. Select **Run user flow**

10. In the form, select the JWT Application and enter the Replying URL, such as `https://jwt.ms`.

11. Select **Run user flow**. 

12. The browser will be redirected to the BindID login page. Enter the account name registered during User registration. The user enters the registered account email and authenticates using appless FIDO2 biometrics, such as fingerprint.

13. Once the authentication challenge is accepted, the browser will redirect the user to the replying URL.

::: zone-end

::: zone pivot="b2c-custom-policy"

### Step 2 - Create a BindID policy key

Store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

5. On the Overview page, select **Identity Experience Framework**.

6. Select **Policy Keys** and then select **Add**.

7. For **Options**, choose `Manual`.

8. Enter a **Name** for the policy key. For example, `BindIDClientSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

9. In **Secret**, enter your client secret that you previously recorded.

10. For **Key usage**, select `Signature`.

11. Select **Create**.

>[!NOTE]
>In Azure Active Directory B2C, [**custom policies**](./user-flow-overview.md) are designed primarily to address complex scenarios. For most scenarios, we recommend that you use built-in [**user flows**](./user-flow-overview.md).

### Step 3- Configure BindID as an Identity provider

To enable users to sign in using BindID, you need to define BindID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify a specific user has authenticated using digital identity available on their device, proving the user’s identity.

You can define BindID as a claims provider by adding it to the **ClaimsProvider** element in the extension file of your policy

1. Open the `TrustFrameworkExtensions.xml`.

2. Find the **ClaimsProviders** element. If it dosen't exist, add it under the root element.

3. Add a new **ClaimsProvider** as follows:
  
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
           <OutputClaim ClaimTypeReferenceId="authenticationSource"
 			  DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
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

4. Set **client_id** with your BindID Application ID.

5. Save the file.

### Step 4 - Add a user journey

At this point, the identity provider has been set up, but it's not yet available in any of the sign-in pages. If you don't have your own custom user journey, create a duplicate of an existing template user journey, otherwise continue to the next step.

1. Open the `TrustFrameworkBase.xml` file from the starter pack.

2. Find and copy the entire contents of the **UserJourneys** element that includes `ID=SignUpOrSignIn`.

3. Open the `TrustFrameworkExtensions.xml` and find the UserJourneys element. If the element doesn't exist, add one.

4. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.

5. Rename the ID of the user journey. For example, `ID=CustomSignUpSignIn`

### Step 5 - Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey.

1. Find the orchestration step element that includes Type=`CombinedSignInAndSignUp`, or Type=`ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign-in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name, such as `BindIDExchange`.

2. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID to link the BindID button to `BindID-SignIn` action. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier.

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

### Step 6 - Configure the relying party policy

The relying party policy, for example [SignUpSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/SocialAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. You can also control what claims are passed to your application by adjusting the **OutputClaims** element of the **PolicyProfile** TechnicalProfile element.  In this sample, the application will receive the user attributes such as display name, given name, surname, email, objectId, identity provider, and tenantId.  

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

### Step 7 - Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com/#home).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. In the [Azure portal](https://portal.azure.com/#home), search for and select **Azure AD B2C**.

5. Under Policies, select **Identity Experience Framework**.

6. Select **Upload Custom Policy**, and then upload the two policy files that you changed, in the following order: the extension policy, for example `TrustFrameworkExtensions.xml`, then the relying party policy, such as `SignUpSignIn.xml`.


### Step 8 - Test your custom policy

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **CustomSignUpSignIn** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL** that should show `https://jwt.ms`.

   c. Select **Run now**.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)

- [Sample custom policies for BindID and Azure AD B2C integration](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration)


