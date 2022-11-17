---
title: Create a user account by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to create a user account in Azure AD B2C storage by using a custom policy. 
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

# Create a user account by using Azure Active Directory B2C custom policy

Azure Active Directory B2C (Azure AD B2C) is built on Azure Active Directory (Azure AD), and so it uses Azure AD storage to store user accounts. Azure AD B2C directory user profile comes with a built-in set of attributes, such as given name, surname, city, postal code, and phone number, but you can extend the user profile with your own custom attributes without requiring an external data store. 

Your custom policies can access Azure AD storage by using Azure AD Technical Profile to store, update or delete user information. In this article, you'll learn how to configure the Azure AD Technical Profile to persist a user information before a JWT token is returned. 

## Scenario overview

In [Call a REST API by using Azure Active Directory B2C custom policy](custom-policies-series-call-rest-api.md) we collected information from the user, validated the data, called a REST API, and finally returned a JWT without creating a user account. We must store the user information so that we don't loose the information, when the policy finishes execution. This time, once we collect the user information and validate it, we need to store the user information in Azure AD B2C storage before we return the JWT token. However, we create a user account, and if it doesn't exist, otherwise, we return an error. 


:::image type="content" source="media/custom-policies-series-store-user/screenshot-create-user-record.png" alt-text="A flowchart of creating a user account in Azure AD.":::   


# Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Call a REST API by using Azure Active Directory B2C custom policy](custom-policies-series-call-rest-api.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

## Step 1 - Declare or update claims 

You need to update the `objectId` claim, and declare two more claims, `userPrincipalName`, `passwordText`, and `passwordPolicies`:

1. In the `ContosoCustomPolicy.XML` file, locate the `objectId` claim, and update it as shown in the following code: 

    ```xml
        <ClaimType Id="objectId">
          <DisplayName>User's Object ID</DisplayName>
          <DataType>string</DataType>
          <DefaultPartnerClaimTypes>
            <Protocol Name="OAuth2" PartnerClaimType="oid" />
            <Protocol Name="OpenIdConnect" PartnerClaimType="oid" />
            <Protocol Name="SAML2" PartnerClaimType="http://schemas.microsoft.com/identity/claims/objectidentifier" />
          </DefaultPartnerClaimTypes>
          <UserHelpText>Object identifier (ID) of the user object in Azure AD.</UserHelpText>
        </ClaimType>
    ```  
1. In the `ContosoCustomPolicy.XML` file, locate the *ClaimsSchema* element and declare `userPrincipalName`, `passwordText`, and `passwordPolicies` claims by using the following code: 

    ```xml
        <ClaimType Id="userPrincipalName">
            <DisplayName>UserPrincipalName</DisplayName>
            <DataType>string</DataType>
            <DefaultPartnerClaimTypes>
                <Protocol Name="OAuth2" PartnerClaimType="upn" />
                <Protocol Name="OpenIdConnect" PartnerClaimType="upn" />
                <Protocol Name="SAML2" PartnerClaimType="http://schemas.microsoft.com/identity/claims/userprincipalname" />
            </DefaultPartnerClaimTypes>
            <UserHelpText>Your user name as stored in the Azure Active Directory.</UserHelpText>
        </ClaimType>
        <ClaimType Id="passwordPolicies">
            <DisplayName>Password Policies</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Password policies used by Azure AD to determine password strength, expiry etc.</UserHelpText>
        </ClaimType>
        <ClaimType Id="passwordText">
            <DataType>string</DataType>
        </ClaimType>
    ```
    
    You'll learn why we need `passwordText` claims in [step 3](#step-3---create-a-copy-of-password). Also, learn more about the uses of the `userPrincipalName` and `passwordPolicies` claims in [User profile attributes](user-profile-attributes.md).

## Step 2 - Create Azure AD Technical Profile

You need to configure the [Azure AD Technical Profile](active-directory-technical-profile.md), which you use to connect to Azure AD storage, to store the user account: 

1. In the `ContosoCustomPolicy.XML` file, locate the  *ClaimsProviders* element, and add a new claims provider by using the code below. This claims provider holds the Azure AD Technical Profile:

    ```xml
        <ClaimsProvider>
            <DisplayName>Azure AD Technical Profiles</DisplayName>
            <TechnicalProfiles>
                <!--You'll add you Azure AD Technical Profiles here-->
            </TechnicalProfiles>
        </ClaimsProvider>
    ``` 
1. In the claims provider you just created, add an Azure AD Technical Profile by using the following code:

    ```xml
        <TechnicalProfile Id="AAD-UserWrite">
            <DisplayName>Write user information to AAD</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="Operation">Write</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">true</Item>
                <Item Key="UserMessageIfClaimsPrincipalAlreadyExists">The account already exists. Try to create another account</Item>
            </Metadata>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" Required="true" />
            </InputClaims>
            <PersistedClaims>
                <PersistedClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" />
        
                <PersistedClaim ClaimTypeReferenceId="displayName" />
                <PersistedClaim ClaimTypeReferenceId="givenName" />
                <PersistedClaim ClaimTypeReferenceId="surname" />
                <PersistedClaim ClaimTypeReferenceId="passwordText" PartnerClaimType="password" />
                <PersistedClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration,DisableStrongPassword" />
            </PersistedClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="objectId" />
                <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
                <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" />
            </OutputClaims>
        </TechnicalProfile>
    ```

    We've added a new Azure AD Technical Profile, *AAD-UserWrite*. You need to take note of the following characteristics: 
    
    -  *Operation*: The operation specifies the operation to be performed, in this case, *Write*.
    - 
    - *InputClaims*: The InputClaims element contains a claim, which is used to look up an account in the directory, or create a new one. There must be exactly one InputClaim element in the input claims collection for all Azure AD technical profiles.

## Step 3 - Create a copy of password 


Discuss special handling of password
## Updating the User Journey Orchestration Steps 


## Upload policy 


## Test policy 


## Next steps 


if you want to store custom attributes, provide a link to creating custom attributes with custom policies 
if you want to include a claim that you can't store in Azure AD B2C in a JWT token, you can obtain by making an REST call, and then include in the token claims.  