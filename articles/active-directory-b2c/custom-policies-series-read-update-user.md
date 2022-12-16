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

In [Create a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md) article, the custom policy doesn't handle a scenario of trying to create an account of a user who already exists. You can write an Azure Active Directory B2C (Azure AD B2C) Technical Profile that checks if a users exists before a new user account is added. The Azure AD Technical Profile can use the *email* claim as a unique identifier to query Azure AD storage.     

In this article, you'll learn how to write an Azure AD B2C custom policy to create a new user account or update an existing one.

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Create a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).  


[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]


## Step 1 - Create Azure AD Technical Profiles 

You need to define two Azure AD Technical Profiles. One technical profile makes a read operation to check if an email of user account you're about to create exists. The other technical profile creates a new user account if it doesn't exist, otherwise, it updates the use account.

1. In the `ContosoCustomPolicy.XML` file, locate the `AAD-UserWrite` technical profile, and then add a new technical profile after it by using the following code: 

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

    We've added a new Azure AD Technical Profile, *AAD-UserRead*. We've configured this technical profile to perform a read operation, and to return `objectId` and `userPrincipalName` claims if a user account with the email in the `InputClaim` is found. 
     
1. In the `ContosoCustomPolicy.XML` file, just after the *AAD-UserRead* technical profile, add another Azure AD Technical Profile by using the following code: 

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
    
    We've added a new Azure AD Technical Profile, *AAD-UserUpdate*. We've configured this technical profile to perform a a *write* operation. However, it will update (not create a new one) a user account that matches its input claim value (`objectId`) as we've configured it to throw an error if the specified user account doesn't already exist. Also, notice that we've used the `objectId` to identify the user account that will be updated (see the input claim).

## Step 2 - Update the User Journey Orchestration Steps  

Now that you've the configures the Azure AD Technical Profiles, you need to update your user journey orchestration steps to use the technical profiles. 
   
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
    Orchestration step `4` (`Order="4"`) executes *AAD-UserRead* technical profile. Orchestration step `5` (`Order="5"`) then examines *userPrincipalName* claim. If the claim (*userPrincipalName*) doesn't exist, this step (step 5) is skipped, and orchestration step `6` (`Order="6"`) executes instead. 

1. Update the order of the *SendClaims* orchestration step to `7`.

## Step 3 - Upload policy

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 4 - Test policy 

1. Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-5---test-the-custom-policy) to test your custom policy.

1. Test your custom policy again by using the same **Email Address** you used in your previous user account, and a different **Surname** or **Display Name**. This time, instead of seeing an error, the policy completes execution, and that user account is updated.

## Next steps

- Learn how to [Reuse Technical Profile in Azure Active Directory B2C custom policy](custom-policies-series-reuse-custom-policy.md). 
- Learn more about [Azure AD Technical Profile](active-directory-technical-profile.md).  
