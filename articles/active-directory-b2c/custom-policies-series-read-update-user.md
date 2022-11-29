---
title: Read or update a user account by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to read or update a user account by using Azure Active Directory B2C custom policy. You use Azure Active Directory storage.  
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 10/30/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Read or update a user account by using Azure Active Directory B2C custom policy 

<Introduction goes here>

Refer to [Create a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md)


in this tutorial, Create a new user or update an existing one



## Step 1 - Create Azure AD Technical Profiles 



1. Add the Azure AD Technical Profiles to read *AAD-UserRead*


    ```xml
        <TechnicalProfile Id="AAD-UserRead">
            <DisplayName>Read user from AAD storage</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="Operation">Read</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">false</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">false</Item>
            </Metadata>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" Required="true" />
            </InputClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="objectId" />
                <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
                <!---<OutputClaim ClaimTypeReferenceId="originalDisplayName" PartnerClaimType="displayName" />-->
            </OutputClaims>
        </TechnicalProfile>
    ``` 
1. Add Azure AD Technical Profiles for update   *AAD-UserUpdate*

    ```xml
        <TechnicalProfile Id="AAD-UserUpdate">
            <DisplayName>Update user information for an exiting user in AAD</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="Operation">Write</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">false</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
                <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">The account doesn't exist.</Item>
            </Metadata>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
            </InputClaims>
            <PersistedClaims>
                <PersistedClaim ClaimTypeReferenceId="objectId" />
                <PersistedClaim ClaimTypeReferenceId="displayName" />
                <PersistedClaim ClaimTypeReferenceId="givenName" />
                <PersistedClaim ClaimTypeReferenceId="surname" />
                <PersistedClaim ClaimTypeReferenceId="passwordText" PartnerClaimType="password" />
                <PersistedClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration,DisableStrongPassword" />
            </PersistedClaims>
            <OutputClaims>
            </OutputClaims>
        </TechnicalProfile>
    ```

## Step 2 - Update the User Journey Orchestration Steps  

Now that you've the Azure AD Technical Profiles ready, you need to update your user journey orchestration steps to use the technical profile. 
   
1. In your policy file, locate the *AADUserWriterExchange* orchestration step, and then replace it with new orchestration steps by using the following code:  

    ```xml
        <OrchestrationStep Order="4" Type="ClaimsExchange">
            <ClaimsExchanges>
                <ClaimsExchange Id="AADUserReaderExchange" TechnicalProfileReferenceId="AAD-UserRead"/>
            </ClaimsExchanges>
            </OrchestrationStep>
            
            <OrchestrationStep Order="5" Type="ClaimsExchange">
            <Preconditions>
                <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
                <Value>userPrincipalName</Value>
                <Action>SkipThisOrchestrationStep</Action>
                </Precondition>
            </Preconditions>
            <ClaimsExchanges>
                <ClaimsExchange Id="AADUserUpdaterExchange" TechnicalProfileReferenceId="AAD-UserUpdate"/>
            </ClaimsExchanges>
            </OrchestrationStep>
            
            <OrchestrationStep Order="6" Type="ClaimsExchange">
            <Preconditions>
                <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
                <Value>userPrincipalName</Value>
                <Action>SkipThisOrchestrationStep</Action>
                </Precondition>
            </Preconditions>
            <ClaimsExchanges>
                <ClaimsExchange Id="AADUserWriterExchange" TechnicalProfileReferenceId="AAD-UserWrite"/>
            </ClaimsExchanges>
        </OrchestrationStep>
    ```
    Orchestration step `Order="4"` executes *AAD-UserRead* technical profile. Orchestration step `Order="5"` then examines *userPrincipalName* claim. If the claim (*userPrincipalName*) doesn't exist, this step is skipped, and orchestration step `Order="6"` executes instead. 

1. Update the order of the *SendClaims* orchestration step to `7`.

## Step 3 - Upload policy


## Step 4 - Test policy 


## Next steps 