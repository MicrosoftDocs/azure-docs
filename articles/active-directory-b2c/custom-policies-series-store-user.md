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


## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Call a REST API by using Azure Active Directory B2C custom policy](custom-policies-series-call-rest-api.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

## Step 1 - Declare and update claims 

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

    We've added a new Azure AD Technical Profile, *AAD-UserWrite*. You need to take note of the following important parts of the technical profile: 
    
    -  *Operation*: The operation specifies the operation to be performed, in this case, *Write*. Learn more about other [operations in an Azure AD technical provider](active-directory-technical-profile.md#azure-ad-technical-provider-operations).
    
    - *Persisted claims*: The *PersistedClaims* element contains all of the values that should be stored into Azure AD storage.
    
    - *InputClaims*: The InputClaims element contains a claim, which is used to look up an account in the directory, or create a new one There must be exactly one InputClaim element in the input claims collection for all Azure AD technical profiles. This technical profile uses the *email* claim, as the key identifier for the user account. Learn more about [other key identifiers you can use uniquely identify a user account](active-directory-technical-profile.md#inputclaims).   

## Step 3 - Create a copy of password 

Azure AD B2C treats the *password* claim as a special value. When you collect the password claim value in the Self-Asserted Technical Profile, that value is only available within the same technical profile or within Validation Technical Profiles that are referenced by that same Self-Asserted Technical Profile. Once execution completes, and moves to another technical profile, the value is lost. 

In our [Scenario overview](#scenario-overview), after we collect user inputs, we need to validate the *accessCode* by running another technical profile, before we finally store the values in Azure AD storage. By this time, we would've lost the password value. 

To address this behavior, we create a copy of our password in another claim. The copy of password claim name is *passwordText*, which we declared in [step 1](#step-1---declare-and-update-claims).

Follow these steps to create a copy of the password: 

1. Add the following code inside the `ClaimsTransformations` element:

    ```xml
        <ClaimsTransformation Id="CopyPasswordClaimsTransformation" TransformationMethod="CopyClaim">
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="password" TransformationClaimType="inputClaim" />
            </InputClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="passwordText" TransformationClaimType="outputClaim" />
            </OutputClaims>
        </ClaimsTransformation>
    ```   
    We've defined a claims transformation, *CopyPasswordClaimsTransformation*. The claims transformation uses the [CopyClaim](general-transformations.md#copyclaim) method copy a value from one claim to another claim.  

1. Locate the *UserInformationCollector* technical profile, and then add the following Claims Transformation Technical Profile after it:

    ```xml
        <TechnicalProfile Id="CreatePasswordCopy">
            <DisplayName>Copy Password Profile</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <InputClaimsTransformations>
                <InputClaimsTransformation ReferenceId="CopyPasswordClaimsTransformation" />
            </InputClaimsTransformations>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="passwordText" Required="true" />
            </OutputClaims>
        </TechnicalProfile> 
    ```

   The *CreatePasswordCopy* technical profile executes the *CopyPasswordClaimsTransformation*, that's, it copies *password* claim value to *passwordText* claim.   

1.  Add the *CreatePasswordCopy* as a Validation Technical Profile (in the ValidationTechnicalProfiles element) in the UserInformationCollector Self-Asserted Technical Profile by using the following code:

    ```xml
        <ValidationTechnicalProfile ReferenceId="CreatePasswordCopy"/>
    ```  

1. In the *UserInformationCollector* Technical Profile, add *passwordText* as a output claim by using the following code:   

    ```xml
        <OutputClaim ClaimTypeReferenceId="passwordText"/>
    ```

## Step 4 - Update the User Journey Orchestration Steps 

Now that your *AAD-UserWrite* Technical Profile is ready, you can update the user journey orchestration steps to call the *AAD-UserWrite* Technical Profile as one of the steps. 

1. In the *UserJourney* element, add an orchestration step just before the *SendClaims* step by using the following code: 

    ```xml
        <OrchestrationStep Order="4" Type="ClaimsExchange">
            <ClaimsExchanges>
                <ClaimsExchange Id="AADUserWriterExchange" TechnicalProfileReferenceId="AAD-UserWrite" />
            </ClaimsExchanges>
        </OrchestrationStep>
    ```

1. Update the Order of the *SendClaims* step to `5`.

## Step 5 - Upload policy 

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 6 - Test policy 

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-5---test-the-custom-policy) to test your custom policy.

After the policy finishes execution, and you receive your ID token, check that the user record has been stored: 

1. Sign in to the [Azure portal](https://portal.azure.com/) with Global Administrator or Privileged Role Administrator permissions.

1. Make sure you're using the directory that contains your Azure AD B2C tenant:
    
    1.  Select the **Directories + subscriptions** icon in the portal toolbar.

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the Directory name list, and then select Switch.

1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.

1. Under **Manage**, select **Users**.

1. Locate the user account that you just created, and select it. The account profile looks similar to the screenshot below:

    :::image type="content" source="media/custom-policies-series-store-user/screenshot-of-create-users-custom-policy.png" alt-text="A screenshot of creating a user account in Azure AD.":::   


In our *AAD-UserWrite* Azure AD Technical Profile, we specify that if the user already exists, we raise an error.

Test your custom policy again by using the same *Email Address*. Instead of an ID token, you should see an error similar to the screenshot below.

:::image type="content" source="media/custom-policies-series-store-user/screenshot-of-error-account-already-exists.png" alt-text="A screenshot of error as account already exists.":::  

> [!NOTE]
> The *password* claim value is a very important piece of information, so be very careful how you handle it in your custom policy.   

## Next steps 

- Learn how to [Read or update a user account by using Azure Active Directory B2C custom policy](custom-policies-series-read-update-user.md).

- Learn how to [define custom attributes in your custom policy](user-flow-custom-attributes.md?pivots=b2c-custom-policy).
 
- Learn how to [add password expiration to custom policy](https://github.com/azure-ad-b2c/samples/tree/master/policies/force-password-reset-after-90-days).

- Learn more [about Azure AD Technical Profile](active-directory-technical-profile.md). 