---
title: 'Azure Active Directory B2C: Self-service password change| Microsoft Docs'
description: A topic demonstrating how to set up 'keep me signed in'
services: active-directory-b2c
documentationcenter: ''
author: vigunase
manager: ajalexander

ms.assetid: 
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2016
ms.author: vigunase

---
# Azure Active Directory B2C: Enable 'Keep Me Signed In'  
[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure AD B2C now allows your web and native applications to enable the 'keep me signed in' functionality. This feature grants access to returning users to application without prompting to re-enter the username and password. This access will be revoked when the user logs out. 

We recommend against users checking this option on public computers. 

![img](images/kmsi.PNG). 

## Prerequisites

An Azure AD B2C tenant configured to complete a local account sign-up/sign-in, as described in [Getting started](active-directory-b2c-get-started-custom.md).

## How to enable keep me signed in

Make the following changes in your trust framework extensions policy, 

## Content definition 

Define a new `ContentDefinition` with ID `api.signuporsigninwithkmsi` that defines a `DataUri` `urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0`. This is a machine understandable identifier that brings up a keep me signed in check box in the sign-in pages. 

```XML
  <BuildingBlocks>
    <ContentDefinitions>
      <ContentDefinition Id="api.signuporsigninwithkmsi">
        <LoadUri>~/tenant/default/unified.cshtml</LoadUri>
        <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
        <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0</DataUri>
        <Metadata>
          <Item Key="DisplayName">Signin and Signup</Item>
        </Metadata>
      </ContentDefinition>
    </ContentDefinitions>
  </BuildingBlocks>                       
```



## Add a  local account sign in claims provider 

Add the following sign in claims provider to your extensions policy. 

```XML
<ClaimsProviders>
    <ClaimsProvider>
      <DisplayName>Local Account SignIn</DisplayName>
      <TechnicalProfiles>
         <TechnicalProfile Id="login-NonInteractive">
           <Metadata>
            <Item Key="client_id">ProxyIdentityExperienceFrameworkAppId</Item>
            <Item Key="IdTokenAudience">IdentityExperienceFrameworkAppId</Item>
           </Metadata>
            <InputClaim ClaimTypeReferenceId="client_id" DefaultValue="ProxyIdentityExperienceFrameworkAppID" />
            <InputClaim ClaimTypeReferenceId="resource_id" PartnerClaimType="resource" DefaultValue="IdentityExperienceFrameworkAppID" />
           </InputClaims>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
 </ClaimsProviders>
```

### Add the application IDs to your custom policy

Add the application IDs to the extensions file (`TrustFrameworkExtensions.xml`):

1. In the extensions file (TrustFrameworkExtensions.xml), find the element `<TechnicalProfile Id="login-NonInteractive">` and `<TechnicalProfile Id="login-NonInteractive-PasswordChange">`

2. Replace all instances of `IdentityExperienceFrameworkAppId` with the application ID of the Identity Experience Framework application as described in [Getting started](active-directory-b2c-get-started-custom.md). Here is an example:

   ```
   <Item Key="client_id">8322dedc-cbf4-43bc-8bb6-141d16f0f489</Item>
   ```

3. Replace all instances of `ProxyIdentityExperienceFrameworkAppId` with the application ID of the Proxy Identity Experience Framework application as described in [Getting started](active-directory-b2c-get-started-custom.md).

4. Save your extensions file.

   ​

## Create a keep me signed in enabled user journey

Create a sign in/up user journey with the content defined earlier with ID `api.signuporsigninwithkmsi`. This enables the keep me signed in option. 

```XML
<UserJourneys>
    <UserJourney Id="SignUpOrSignInWithKmsi">
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsigninwithkmsi">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
          </ClaimsProviderSelections>
          <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <!-- This step reads any user attributes that we may not have received when in the token. -->
        <OrchestrationStep Order="3" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="4" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
      </OrchestrationSteps>
      <ClientDefinition ReferenceId="DefaultWeb" />
    </UserJourney>
  </UserJourneys>
```

You are done modifying the extension file. Save and upload this file. Ensure that all validations succeed.



## Create a relying party (RP) file

Next, update the relying party (RP) file that initiates the user journey that you created:

1. Make a copy of SignUpOrSignIn.xml in your working directory. Then, rename it (for example, SignUpOrSignInWithKmsi.xml).

2. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with a unique value. This is the name of your policy (for example, SignUpOrSignInWithKmsi).

3. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the `Id` of the new user journey that you created (for example, SignUpOrSignInWithKmsi).

4. Configure keep me signed settings in `UserJourneyBehaviors`. 

   1. **`KeepAliveInDays`** controls how long the user remains signed in. In the following example, keep me signed in session automatically expires after 14 days regardless of how often the user performs silent authentication. Setting `KeepAliveInDays`  value to 0 turns off keep me signed in functionality and is the default behavior if not specified. 
   2. If **`SessionExpiryType`** is *Rolling*, then the keep me signed in session is extended by 14 days every time the user performs silent authentication. We recommend you to keep the number of days low if *Rolling* is selected. 

       <RelyingParty>
       <DefaultUserJourney ReferenceId="SignUpOrSignInWithKmsi" />
       <UserJourneyBehaviors>
         <SingleSignOn Scope="Tenant" KeepAliveInDays="14" />
         <SessionExpiryType>Absolute</SessionExpiryType>
         <SessionExpiryInSeconds>1200</SessionExpiryInSeconds>
       </UserJourneyBehaviors>
       <TechnicalProfile Id="PolicyProfile">
         <DisplayName>PolicyProfile</DisplayName>
         <Protocol Name="OpenIdConnect" />
         <OutputClaims>
           <OutputClaim ClaimTypeReferenceId="displayName" />
           <OutputClaim ClaimTypeReferenceId="givenName" />
           <OutputClaim ClaimTypeReferenceId="surname" />
           <OutputClaim ClaimTypeReferenceId="email" />
           <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
         </OutputClaims>
         <SubjectNamingInfo ClaimType="sub" />
       </TechnicalProfile>
       </RelyingParty>

5. Save your changes, and then upload the file.

6. To test the custom policy that you uploaded, in the Azure portal, go to the policy blade, and then click **Run now**.


## Link to sample policy

You can find the sample policy here: 

```
https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/keep%20me%20signed%20in
```










