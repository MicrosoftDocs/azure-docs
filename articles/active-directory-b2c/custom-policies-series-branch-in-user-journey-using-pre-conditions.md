---
title: Create branching in user journey by using Azure AD B2C custom policy 
titleSuffix: Azure AD B2C
description: Learn how to enable or disable Technical Profiles based on claims values. Learn how to branch in user journeys by enabling and disabling Azure AD B2C custom policy technical profiles.      
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

# Create branching in user journey by using Azure AD B2C custom policy

Different users of the same app can follow different user journeys depending on the values of the data in a custom policy. Azure Active Directory B2C (Azure AD B2C) custom policies allows you to conditionally enable or disable a technical profile to achieve this capability. For example, in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md), we used a `Precondition` to determine whether or not we should run a Validation Technical Profile based on the value of *accountType* claim. 

Technical Profiles also provides a `EnabledForUserJourneys` element to allow you to specify whether or not a technical profile should run. The `EnabledForUserJourneys` element contains one of five values including *OnClaimsExistence*, which you use to specify that a technical profile should run only when a certain claim specified in the technical profile exists. Learn more about technical profile's [EnabledForUserJourneys](technicalprofiles.md#enabled-for-user-journeys) element. 

## Scenario overview

In [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md), a user needs to select either *Contoso Employee Account* or *Personal Account*. Users who select *Contoso Employee Account* can proceed without providing further information, they just need to use a valid email address. However, users who select *Personal Account* needs to provide a valid invitation access code to proceed. Hence, users who use *Personal Account* account type see an extra screen to complete their journey.  

:::image type="content" source="media/custom-policies-series-branch-in-user-journey-using-pre-conditions/screenshot-of-branching-in-user-journey.png" alt-text="A flowchart of branching in user journey.":::

In this article, you'll learn how to use `EnabledForUserJourneys` element inside a technical profile to create different user experiences based on a claim value. 

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 


## Step 1 - Declare Claims 

A user who selects *Personal Account* needs to provide a valid access code. So, we need a claim to hold this value: 

1. In VS Code, open the `ContosoCustomPolicy.XML` file. 

1. In the `ClaimsSchema` section, declare accessCode and isValidAccessCode claims by using the following code:

    ```xml    
        <ClaimType Id="accessCode">
            <DisplayName>Access Code</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Enter your invitation access code.</UserHelpText>
            <UserInputType>Password</UserInputType>
            <Restriction>
                <Pattern RegularExpression="[0-9][0-9][0-9][0-9][0-9]" HelpText="Please enter your invitation access code. It's a 5-digit number, something like 95765"/>
            </Restriction>
        </ClaimType>
        <ClaimType Id="isValidAccessCode">
            <DataType>boolean</DataType>
        </ClaimType>
    ```


## Step 2 - Define Claims Transformations

Locate the `ClaimsTransformations` element, and add the following Claims Transformations: 

```xml
    <ClaimsTransformation Id="CheckIfIsValidAccessCode" TransformationMethod="CompareClaimToValue">
        <InputClaims>
            <InputClaim ClaimTypeReferenceId="accessCode" TransformationClaimType="inputClaim1"/>
        </InputClaims>
        <InputParameters>
            <InputParameter Id="compareTo" DataType="string" Value="88888"/>
            <InputParameter Id="operator" DataType="string" Value="equal"/>
            <InputParameter Id="ignoreCase" DataType="string" Value="true"/>
        </InputParameters>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="isValidAccessCode" TransformationClaimType="outputClaim"/>
        </OutputClaims>
    </ClaimsTransformation>
    <ClaimsTransformation Id="ThrowIfIsNotValidAccessCode" TransformationMethod="AssertBooleanClaimIsEqualToValue">
        <InputClaims>
            <InputClaim ClaimTypeReferenceId="isValidAccessCode" TransformationClaimType="inputClaim"/>
        </InputClaims>
        <InputParameters>
            <InputParameter Id="valueToCompareTo" DataType="boolean" Value="true"/>
        </InputParameters>
    </ClaimsTransformation>
``` 

We've defined two Claims Transformations, *CheckIfIsValidAccessCode* and *ThrowIfIsNotValidAccessCode*. *CheckIfIsValidAccessCode* uses [CompareClaimToValue](string-transformations.md#compareclaimtovalue) transformation method to compare the access code input by the user against a static value 88888 (let's use this value for testing) and assigns `true` or `false` to *isValidAccessCode* claim. *ThrowIfIsNotValidAccessCode* checks whether or not two boolean values of two claims are equal, and throws an exception if they aren't. 

## Step 3 - Configure Technical Profiles 

We now need a self-asserted technical profile to collect the access code from the user, and another to execute our Claims Transformation: 

1. Locate the `ClaimsProviders` element, and then add a `ClaimsProvider` element by using the following code   

    ```xml
        <ClaimsProvider>
            <DisplayName>Technical Profiles to collect user's access code</DisplayName>
            <TechnicalProfiles>
            <!--TODO-->
            </TechnicalProfiles>
        </ClaimsProvider>
    ```

1. Inside the `TechnicalProfiles` element of the `ClaimsProvider` you've just created, define the following technical profile: 

    ```xml
        <TechnicalProfile Id="AccessCodeInputCollector">
            <DisplayName>Collect Access Code Input from user Technical Profile</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
            <Metadata>
                <Item Key="ContentDefinitionReferenceId">SelfAssertedContentDefinition</Item>
                <Item Key="UserMessageIfClaimsTransformationBooleanValueIsNotEqual">The access code is invalid.</Item>
                <Item Key="ClaimTypeOnWhichToEnable">accountType</Item>
                <Item Key="ClaimValueOnWhichToEnable">personal</Item>
            </Metadata>
            <DisplayClaims>
                <DisplayClaim ClaimTypeReferenceId="accessCode" Required="true"/>
            </DisplayClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="accessCode"/>
            </OutputClaims>
            <ValidationTechnicalProfiles>
                <ValidationTechnicalProfile ReferenceId="CheckAccessCodeViaClaimsTransformationChecker"/>
            </ValidationTechnicalProfiles>
            <EnabledForUserJourneys>OnClaimsExistence</EnabledForUserJourneys>
        </TechnicalProfile>
        <TechnicalProfile Id="CheckAccessCodeViaClaimsTransformationChecker">
            <DisplayName>A Claims Transformations to check user's access code validity</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="isValidAccessCode"/>
            </OutputClaims>
            <OutputClaimsTransformations>
                <OutputClaimsTransformation ReferenceId="CheckIfIsValidAccessCode"/>
                <OutputClaimsTransformation ReferenceId="ThrowIfIsNotValidAccessCode"/>
            </OutputClaimsTransformations>
        </TechnicalProfile>
    ```

    We've configured two technical profile, *AccessCodeInputCollector* and *CheckAccessCodeViaClaimsTransformationChecker*. We call the *CheckAccessCodeViaClaimsTransformationChecker* technical profile as a validation technical profile the *AccessCodeInputCollector* technical profile. The *CheckAccessCodeViaClaimsTransformationChecker* itself is of type Claims Transformation technical Profile that execute the Claims Transformations we defined in [step 2](#step-2---define-claims-transformations). 

    *AccessCodeInputCollector* is a Self-Asserted Technical Profile used to collect an access code from the user. It includes `EnabledForUserJourneys` element that's set to *OnClaimsExistence*. It's `Metadata` element includes a claim (*accountType*) and it's value (*personal*) that activates this technical profile.    

## Step 4 - Update the User Journey Orchestration Steps

Now that you've set up your technical profile, you need to update your User Journey Orchestration Steps:

1. Locate your HelloWorldJourney user journey and add the following Orchestration Step as the second in the order: 

    ```xml
        <OrchestrationStep Order="2" Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="GetAccessCodeClaimsExchange" TechnicalProfileReferenceId="AccessCodeInputCollector" />
        </ClaimsExchanges>
        </OrchestrationStep>
    ``` 
1. Update the the *Order* of the Orchestration Steps that follows as *3* and *4*. 

## Step 5 - Upload custom policy file

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 5 - Test the custom policy

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-5---test-the-custom-policy) to test your custom policy:

1. For **Account Type**, select **Personal Account**
1. Enter the rest of the details as required, and then select **Continue**. You'll see a new screen.
1. For **Access Code**, enter *88888*, and then select **Continue**. After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. 
 

## Next steps

In [step 3](#step-3---configure-technical-profiles), we enabled or disabled the technical profile by using the `EnabledForUserJourneys` element. Alternatively, you can use [Preconditions](userjourneys.md#preconditions) inside the User Journey Orchestration Steps to execute or skip an orchestration step that runs a technical profile.

Next, learn: 

- About [User Journey Orchestration Steps Preconditions](userjourneys.md#preconditions)

-  How to [Use the TrustFrameworkPolicy schema file to validate Azure AD B2C policy files](custom-policies-series-install-xml-extensions.md) 


 