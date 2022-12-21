---
title: Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to configure a sign-up and sign-in flow for a local account, using email and password, by using Azure Active Directory B2C custom policy.  
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 01/30/2023
ms.author: kengaderdus
ms.subservice: B2C
---


# Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy


Refer to [Create a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md) and [Read or update a user account by using Azure Active Directory B2C custom policy](custom-policies-series-read-update-user.md) - user creates an account

In this article, user signs in or create an account if they don't already have one 

We use local account identity provider (email and passoword)


## Overview

Discuss how we use OpenIdConnect to verify credentials 
Federate authentication to Azure AD 

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Read or update a user account by using Azure Active Directory B2C custom policy](custom-policies-series-read-update-user.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).  


[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]


## Step 1 - Configure OpenID Connect Technical Profile

You require three steps 

- Declare additional claims 
- Register apps in portal
- Configure OpenID Connect Technical Profile itself


### Step 1.1 - Declare additional claims

In the `ContosoCustomPolicy.XML` Add claims in the Claims Schema section

```xml
    <ClaimType Id="grant_type">
        <DisplayName>grant_type</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>Special parameter passed for local account authentication to login.microsoftonline.com.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="scope">
        <DisplayName>scope</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>Special parameter passed for local account authentication to login.microsoftonline.com.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="nca">
        <DisplayName>nca</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>Special parameter passed for local account authentication to login.microsoftonline.com.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="client_id">
        <DisplayName>client_id</DisplayName>
        <DataType>string</DataType>
        <AdminHelpText>Special parameter passed to EvoSTS.</AdminHelpText>
        <UserHelpText>Special parameter passed to EvoSTS.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="resource_id">
        <DisplayName>resource_id</DisplayName>
        <DataType>string</DataType>
        <AdminHelpText>Special parameter passed to EvoSTS.</AdminHelpText>
        <UserHelpText>Special parameter passed to EvoSTS.</UserHelpText>
    </ClaimType>
```

### Step 1.2 - Register Identity Experience Framework applications  

Azure AD B2C requires you to register two applications that it uses to sign up and sign in users with local accounts: IdentityExperienceFramework, a web API, and ProxyIdentityExperienceFramework, a native app with delegated permission to the IdentityExperienceFramework app.

1. Follow the steps in [Register the IdentityExperienceFramework application](tutorial-create-user-flows.md?pivots=b2c-custom-policy#register-the-identityexperienceframework-application) to register the Identity Experience Framework application. Copy the **Application (client) ID**, *appID*, for the Identity Experience Framework application registration for use on the next step.  

1. For low the steps in [Register the ProxyIdentityExperienceFramework application](tutorial-create-user-flows.md?pivots=b2c-custom-policy#register-the-proxyidentityexperienceframework-application) to register Proxy Identity Experience Framework application. Copy the **Application (client) ID**, *proxyAppID*, for the Proxy Identity Experience Framework application registration for use on the next step.  


### Step 1.3 - Configure OpenID Connect Technical Profile

In the `ContosoCustomPolicy.XML`, add [OpenID Connect Technical Profile](openid-connect-technical-profile.md) in the ClaimsProviders section by using the following code: 

```xml
    <ClaimsProvider>
        <DisplayName>OpenID Connect Technical Profiles</DisplayName>
        <TechnicalProfiles>
            <TechnicalProfile Id="SignInUser">
                <DisplayName>Sign in with Local Account</DisplayName>
                <Protocol Name="OpenIdConnect" />
                <Metadata>
                    <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">We didn't find this account</Item>
                    <Item Key="UserMessageIfInvalidPassword">Your password or username is incorrect</Item>
                    <Item Key="UserMessageIfOldPasswordUsed">You've used an old password.</Item>
                    <Item Key="ProviderName">https://sts.windows.net/</Item>
                    <Item Key="METADATA">https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration</Item>
                    <Item Key="authorization_endpoint">https://login.microsoftonline.com/{tenant}/oauth2/token</Item>
                    <Item Key="response_types">id_token</Item>
                    <Item Key="response_mode">query</Item>
                    <Item Key="scope">email openid</Item>
                    <!-- Policy Engine Clients -->
                    <Item Key="UsePolicyInRedirectUri">false</Item>
                    <Item Key="HttpBinding">POST</Item>
                    <Item Key="client_id">proxyAppID</Item>
                    <Item Key="IdTokenAudience">appID</Item>
                </Metadata>
                <InputClaims>
                    <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="username" Required="true" />
                    <InputClaim ClaimTypeReferenceId="password" PartnerClaimType="password" Required="true" />
                    <InputClaim ClaimTypeReferenceId="grant_type" DefaultValue="password" />
                    <InputClaim ClaimTypeReferenceId="scope" DefaultValue="openid" />
                    <InputClaim ClaimTypeReferenceId="nca" PartnerClaimType="nca" DefaultValue="1" />
                    <InputClaim ClaimTypeReferenceId="client_id" DefaultValue="proxyAppID" />
                    <InputClaim ClaimTypeReferenceId="resource_id" PartnerClaimType="resource" DefaultValue="appID" />
                </InputClaims>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="oid" />
                </OutputClaims>
            </TechnicalProfile>
        </TechnicalProfiles>
    </ClaimsProvider>
``` 

Replace both instances of: 

- *appID* with **Application (client) ID** of the Identity Experience Framework application registration you copied in [step 1.2](#step-12---register-identity-experience-framework-applications). 

- *proxyAppID* with **Application (client) ID** of the Proxy Identity Experience Framework application registration you copied in [step 1.2](#step-12---register-identity-experience-framework-applications).  

## Step 2 - Configure the sign-in interface 

You need to: 
- configure a self-asserted TP 
- add content definition for the sign-in interface 


### Step 2.1 - Sign-in user interface Technical Profile 

Add after `SignInUser` TP

```xml
    <TechnicalProfile Id="UserSignInCollector">
        <DisplayName>Local Account Signin</DisplayName>
        <Protocol Name="Proprietary"
            Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
        <Metadata>
            <Item Key="setting.operatingMode">Email</Item>
            <Item Key="SignUpTarget">SignUpWithLogonEmailExchange</Item>
        </Metadata>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="email" Required="true" />
            <OutputClaim ClaimTypeReferenceId="password" Required="true" />
            <OutputClaim ClaimTypeReferenceId="objectId" />
        </OutputClaims>
        <ValidationTechnicalProfiles>
            <ValidationTechnicalProfile ReferenceId="SignInUser" />
        </ValidationTechnicalProfiles>
    </TechnicalProfile>
```

<Explain the items in the metadata>

### Step 2.2 - Add sign-in Content Definition

Locate the *ContentDefinitions* section, and the sign-in [Content Definition](contentdefinitions.md) by using the following code: 

```xml
    <ContentDefinition Id="SignupOrSigninContentDefinition">
        <LoadUri>~/tenant/default/unified.cshtml</LoadUri>
        <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
        <DataUri>urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:2.1.7</DataUri>
        <Metadata>
            <Item Key="DisplayName">Signin and Signup</Item>
        </Metadata>
    </ContentDefinition>
``` 
We'll specify that the sign-in user interface SelfAsserted Technical Profile uses this content definition later in the orchestration steps. 

## Step 3 - Update the ClaimGenerator Technical Profile

currently, it runs three **ClaimsTransformations**,  *GenerateRandomObjectIdTransformation*, *CreateDisplayNameTransformation* and *CreateMessageTransformation*.

We remove *GenerateRandomObjectIdTransformation* as the objectId is returned after an account is created, so we don't need to generate it within the policy 


Separate CreateDisplayNameTransformation* and *CreateMessageTransformation* so that they're executed by separate technical profiles.

Replace the *ClaimGenerator* technical profile with the following code: 
 

```xml
    <TechnicalProfile Id="UserInputMessageClaimGenerator">
        <DisplayName>User Message Claim Generator Technical Profile</DisplayName>
        <Protocol Name="Proprietary"
            Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="message" />
        </OutputClaims>
        <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateMessageTransformation" />
        </OutputClaimsTransformations>
    </TechnicalProfile>

    <TechnicalProfile Id="UserInputDisplayNameGenerator">
        <DisplayName>Display Name Claim Generator Technical Profile</DisplayName>
        <Protocol Name="Proprietary"
            Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="displayName" />
        </OutputClaims>
        <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateDisplayNameTransformation" />
        </OutputClaimsTransformations>
    </TechnicalProfile>
```

## Step 4 - Update AAD-UserRead Technical Profile 

When users sign in, they don't input all the details they input when they sign up. But we need to return more account details in the token. 

We need to add more output claims in out *AAD-UserRead* technical profile. At the moment, we only have *objectId* and *userPrincipalName* as output claims.     

Locate the *AAD-UserRead* technical profile, and add three more output claims, *givenName*, *surname* and *displayName* by using the following code:

```xml
    <OutputClaim ClaimTypeReferenceId="givenName"/>
    <OutputClaim ClaimTypeReferenceId="surname"/>
    <OutputClaim ClaimTypeReferenceId="displayName"/>
```

## Step 5 - Update the User Journey Orchestration Steps

Locate your *HelloWorldJourney* user journey and replace all it's Orchestration Steps with the following code: 

```xml
    <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="SignupOrSigninContentDefinition">
        <ClaimsProviderSelections>
            <ClaimsProviderSelection
                ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
        </ClaimsProviderSelections>
        <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="UserSignInCollector" />
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
            <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="UserInformationCollector" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <OrchestrationStep Order="3" Type="ClaimsExchange">
        <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
                <Value>objectId</Value>
                <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
        </Preconditions>
        <ClaimsExchanges>
            <ClaimsExchange Id="GetAccessCodeClaimsExchange" TechnicalProfileReferenceId="AccessCodeInputCollector" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <OrchestrationStep Order="4" Type="ClaimsExchange">
        <Preconditions>
        <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
            <Value>objectId</Value>
            <Action>SkipThisOrchestrationStep</Action>
        </Precondition>
        </Preconditions>     
        <ClaimsExchanges>
        <ClaimsExchange Id="GenerateDisplayNameExchange" TechnicalProfileReferenceId="UserInputDisplayNameGenerator"/>
        </ClaimsExchanges>
    </OrchestrationStep>
    
    <OrchestrationStep Order="5" Type="ClaimsExchange">
        <Preconditions>
        <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
            <Value>objectId</Value>
            <Action>SkipThisOrchestrationStep</Action>
        </Precondition>
        </Preconditions>
        <ClaimsExchanges>
        <ClaimsExchange Id="AADUserWriterExchange" TechnicalProfileReferenceId="AAD-UserWrite"/>
        </ClaimsExchanges>
    </OrchestrationStep>                
    
    <OrchestrationStep Order="6" Type="ClaimsExchange">
        <ClaimsExchanges>
        <ClaimsExchange Id="AADUserReaderExchange" TechnicalProfileReferenceId="AAD-UserRead"/>
        </ClaimsExchanges>
    </OrchestrationStep>                
    
    <OrchestrationStep Order="7" Type="ClaimsExchange">
        <ClaimsExchanges>
        <ClaimsExchange Id="GetMessageClaimsExchange" TechnicalProfileReferenceId="UserInputMessageClaimGenerator"/>
        </ClaimsExchanges>          
    </OrchestrationStep>                
    
    <OrchestrationStep Order="8" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
```

## Step 6 - Upload policy

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 7 - Test policy 

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-5---test-the-custom-policy) to test your custom policy. Once the policy runs, you'll see an interface similar to the screenshot below:

:::image type="content" source="media/custom-policies-series-sign-up-or-sign-in/screenshot-sign-up-or-sign-in-interface.png" alt-text="screenshot of sign up or sign in interface."::: 

You can sign in by entering the **Email Address** and **Password** of an existing account. If you don't have an account, you need to select the **Sign up now** link to create a new user account. 

## Next steps

- Learn how to [](). 

- Learn more about [OpenID Connect technical profile](openid-connect-technical-profile.md).