---
title: Configure Azure Active Directory B2C with BindID
titleSuffix: Azure AD B2C
description: Configure Azure Active Directory B2C with BindID for passwordless strong customer authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/09/2022
ms.author: gasinh
ms.subservice: B2C
---

# Configure BindID with Azure Active Directory B2C for passwordless authentication

In this sample tutorial, learn how to integrate Azure AD B2C authentication with [BindID](https://www.transmitsecurity.com/bindid). BindID is a passwordless authentication service that uses strong FIDO2 biometric authentication for a reliable omni-channel authentication experience. The solution ensures a smooth login experience for all customers across every device and channel eliminating fraud, phishing, and credential reuse.

## Prerequisites

To get started, you'll need:

- A BindID tenant. You can [sign up for free.](https://www.transmitsecurity.com/developer?utm_signup=dev_hub#try)

- An Azure AD subscription. If you don't have one, get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) linked to your [Azure subscription](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant)

- If you haven't already done so, [register a web application](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications).

- [Signing and encryption keys for your Identity Experience Framework](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#add-signing-and-encryption-keys-for-identity-experience-framework-applications)

- [Registered Identity Experience Framework applications](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started#register-identity-experience-framework-applications)

- Follow [this document](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#custom-policy-starter-pack) to download [LocalAccounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts)

- Download the [BindID starter custom policies in GitHub](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration/tree/main/custom-policies).

## Scenario description

The following architecture diagram shows the implementation.

![Screenshot showing the bindid and Azure AD B2C architecture diagram](media/partner-bindid/partner-bindid-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. Users select sign-in/sign-up and enter username into the page.
| 2. | The application sends the user attributes to Azure AD B2C for identify verification.
| 3. | Azure AD B2C collects the user attributes and sends the attributes to BindID to authenticate the user through OpenID Connect (OIDC) request.
| 4. | BindID sends a push notification to the registered user mobile device for a Fast Identity Online (FIDO2) certified authentication. It can be a user finger print, biometric or decentralized pin.  
| 5. | After user acknowledges the push notification through a decentralized authentication response, the OIDC response is passed on to Azure AD B2C.
| 6.| User is either granted or denied access to the customer application based on the verification results.

## Onboard with BindID

To integrate BindID with your Azure AD B2C instance, you'll need to configure an application in the [BindID Admin
Portal](https://admin.bindid-sandbox.io/console/). For more information, see [Getting started guide](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal). You can either create a new application or use one that you already created.

## Integrate BindID with Azure AD B2C using custom policies

### Part 1 - Configure application in BindID

To configure your tenant application in BindID, the following information is needed

| Property | Description |
|:---------|:---------------------|
| Name | Azure AD B2C/your desired application name|
| Domain | name.onmicrosoft.com|
| Redirect URIs| https://jwt.ms |
| Redirect URLs | https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp<br>For Example: `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`<br>If you use a custom domain, enter https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp.<br>Replace your-domain-name with your custom domain, and your-tenant-name with the name of your tenant.|

BindID will provide a Client ID and a Client Secret once the application has been configured.

>[!NOTE]
>You'll need Client ID and Client secret later to configure the Identity provider in Azure AD B2C.

### Part 2 - Create a BindID policy key

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

### Part 3- Configure BindID as an Identity provider

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
       <TechnicalProfile Id="BindID-SignIn">
         <DisplayName>BindID</DisplayName>
         <Protocol Name="OpenIdConnect" />
         <Metadata>
           <Item Key="HttpBinding">POST</Item>
           <Item Key="UsePolicyInRedirectUri">false</Item>
           <Item Key="scope">openid email</Item>
           <Item Key="METADATA">https://signin.bindid-sandbox.io/.well-known/openid-configuration</Item>
           <Item Key="AccessTokenResponseFormat">json</Item>
           <Item Key="response_types">code</Item>
           <Item Key="response_mode">form_post</Item>
           <Item Key="client_id">bindid-client-id</Item>
         </Metadata>
         <CryptographicKeys>
           <Key Id="client_secret" StorageReferenceId="B2C_1A_BindIDClientSecret" />
         </CryptographicKeys>
         <OutputClaims>
           <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
           <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
           <OutputClaim ClaimTypeReferenceId="access_token" PartnerClaimType="{oauth2:access_token}" />
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

4. Set **bindid-client-id** with your BindID client ID.

5. Save the file.

The BindID starter pack contains a set of pre-built policies used to run BindID authentication flows. Before you upload these files to your Azure AD B2C tenant, you'll need to customize a few parameters based on your Azure AD B2C and BindID tenant. Sample custom policies are provided in [GitHub](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration/tree/main/custom-policies).

### Part 4 - Add a user journey

At this point, the identity provider has been set up, but it's not yet available in any of the sign-in pages. If you don't have your own custom user journey, create a duplicate of an existing template user journey, otherwise continue to the next step.

1. Open the `TrustFrameworkBase.xml` file from the starter pack.

2. Find and copy the entire contents of the **UserJourneys** element that includes `ID=SignUpOrSignIn`.

3. Open the `TrustFrameworkExtensions.xml` and find the UserJourneys element. If the element doesn't exist, add one.

4. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.

5. Rename the ID of the user journey. For example, `ID=CustomSignUpSignIn`

### Part 5 - Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey.

1. Find the orchestration step element that includes Type=`CombinedSignInAndSignUp`, or Type=`ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign-in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name, such as `BindIDExchange`.

2. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID to link the BindID button to `BindID-SignIn` action. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier.

The following XML demonstrates orchestration steps of a user journey with the identity provider:

```xml
<TrustFrameworkPolicy
  
  <UserJourneys>

    <UserJourney Id="SignUpOrSignInWithBindID">
      <OrchestrationSteps>

        <!-- Show an authentication selector with sign-in with Azure AD, sign-up with Azure AD and sign-in with BindID 
             if user select Azure AD sign-in - action will be executed in this step
             if user select Azure AD sign-up or BindID sign-in - action will be executed in the next step -->
        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="BindIDExchange" /> // Adds BindID button
            <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
          </ClaimsProviderSelections>
          <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- Execute BindID sign-in or Azure AD sign-up depending on the pervious selection 
             Skip if objectId already exist (user signed-in in previous step) -->
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="BindIDExchange" TechnicalProfileReferenceId="BindID-SignIn" />
            <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- For social IDP authentication, attempt to find the user account in the directory. -->
        <OrchestrationStep Order="3" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
              <Value>authenticationSource</Value>
              <Value>localAccountAuthentication</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadUsingAlternativeSecurityId" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId-NoError" />
          </ClaimsExchanges>
        </OrchestrationStep>
        
        <!-- If the user has authenticated using BindID and the BindID user is not binded to Azure AD user, 
             show an authentication selector the AD sign-in and sign-up.
             if user select Azure AD sign-in - action will be executed in this step
             if user select Azure AD sign-up - action will be executed in the next step -->
        <OrchestrationStep Order="4" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsProviderSelections>
            <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchangeAfterSocial" />
          </ClaimsProviderSelections>
          <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchangeAfterSocial" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
          </ClaimsExchanges>
        </OrchestrationStep>
        
        <!-- Execute Azure AD sign-up depending on the pervious selection 
             If objectId exists then user has select sign-in in the previous step -->
        <OrchestrationStep Order="5" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="SignUpWithLogonEmailExchangeAfterSocial" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
          </ClaimsExchanges>
        </OrchestrationStep>
        
        <!-- Update user with the BindID alternative security id. -->
        <OrchestrationStep Order="6" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
              <Value>newUser</Value>
              <Value>true</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
              <Value>alternativeSecurityId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="AttachBindIDAlternativeSecurityId" TechnicalProfileReferenceId="AttachBindIDAlternativeSecurityId" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- This step reads any user attributes that we may not have received when authenticating using ESTS so they can be sent 
          in the token. -->
        <OrchestrationStep Order="7" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- generate JWT -->
        <OrchestrationStep Order="8" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />

      </OrchestrationSteps>
      <ClientDefinition ReferenceId="DefaultWeb" />
    </UserJourney>

  </UserJourneys>

</TrustFrameworkPolicy>
```

### Part 6 - Configure the relying party policy

The relying party policy specifies the user journey which Azure AD B2C will execute. You can also control what claims are passed to your application by adjusting the **OutputClaims** element of the **PolicyProfile** TechnicalProfile element.  In this sample, the application will receive the user attributes such as display name, given name, surname, email, objectId, identity provider, and tenantId.  

```xml
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignInWithBindID" />
    <TechnicalProfile Id="PolicyProfile">
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

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. BindID will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Additional resources

- [Sample custom policies for BindID and Azure AD B2C integration](https://github.com/TransmitSecurity/azure-ad-b2c-bindid-integration)

- [Custom policies in Azure AD B2C
    B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C
    B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
