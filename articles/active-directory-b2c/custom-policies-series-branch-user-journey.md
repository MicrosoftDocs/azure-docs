---
title: Create branching in user journey by using Azure AD B2C custom policy 
titleSuffix: Azure AD B2C
description: Learn how to enable or disable Technical Profiles based on claims values. Learn how to branch in user journeys by enabling and disabling Azure AD B2C custom policy technical profiles.      

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 11/06/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Create branching in user journey by using Azure Active Directory B2C custom policy

Different users of the same app can follow different user journeys depending on the values of the data in a custom policy. Azure Active Directory B2C (Azure AD B2C) custom policies allows you to conditionally enable or disable a technical profile to achieve this capability. For example, in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md), we used a `Precondition` to determine whether or not we should run a validation technical profile based on the value of *accountType* claim. 

A technical profile also provides a `EnabledForUserJourneys` element to allow you to specify whether or not a technical profile should run. The `EnabledForUserJourneys` element contains one of five values including *OnClaimsExistence*, which you use to specify that a technical profile should run only when a certain claim specified in the technical profile exists. Learn more about technical profile's [EnabledForUserJourneys](technicalprofiles.md#enabled-for-user-journeys) element. 

## Scenario overview

In [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md) article, a user inputs their details in a single screen. In this article, a user needs to first select their account type, *Contoso Employee Account* or *Personal Account*. A user who selects *Contoso Employee Account* can proceed to provide further details. However, a user who selects *Personal Account* need to provide a valid invitation access code before they can proceed to provide further details. Hence, users who use *Personal Account* account type see an extra user interface to complete their journey.  

:::image type="content" source="media/custom-policies-series-branch-in-user-journey-using-pre-conditions/screenshot-of-branching-in-user-journey.png" alt-text="A flowchart of branching in user journey.":::

In this article, you learn how to use `EnabledForUserJourneys` element inside a technical profile to create different user experiences based on a claim value. 
## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]

## Step 1 - Declare claims 

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


## Step 2 - Define claims transformations

Locate the `ClaimsTransformations` element, and add the following claims transformations: 

```xml
    <!---<ClaimsTransformations>-->
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
    <!---</ClaimsTransformations>-->
``` 

We've defined two claims transformations, *CheckIfIsValidAccessCode* and *ThrowIfIsNotValidAccessCode*. *CheckIfIsValidAccessCode* uses [CompareClaimToValue](string-transformations.md#compareclaimtovalue) transformation method to compare the access code input by the user against a static value 88888 (let's use this value for testing) and assigns `true` or `false` to *isValidAccessCode* claim. *ThrowIfIsNotValidAccessCode* checks whether or not two boolean values of two claims are equal, and throws an exception if they aren't. 

## Step 3 - Configure or update technical profiles 

You now need two new self-asserted technical profiles, one to collect the account type, and the other to collect access code from the user. You also need a new claims transformation type technical profile to validate the user's access code by executing the claims transformations that you defined in [step 2](#step-2---define-claims-transformations). Now that we're collecting the account type in a different self-asserted technical profile, we need to update the `UserInformationCollector` self-asserted technical profile to prevent it from collecting the account type.  

1. Locate the `ClaimsProviders` element, and then add a new claims provider using the following code:  

    ```xml
        <!--<ClaimsProviders>-->
            <ClaimsProvider>
                <DisplayName>Technical Profiles to collect user's access code</DisplayName>
                <TechnicalProfiles>
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
                </TechnicalProfiles>
            </ClaimsProvider>
        <!--</ClaimsProviders>-->
    ```

    We've configured two technical profiles, *AccessCodeInputCollector* and *CheckAccessCodeViaClaimsTransformationChecker*. We call the *CheckAccessCodeViaClaimsTransformationChecker* technical profile as a validation technical profile from within the *AccessCodeInputCollector* technical profile. The *CheckAccessCodeViaClaimsTransformationChecker* itself is of type Claims Transformation technical Profile, which executes the Claims Transformations we defined in [step 2](#step-2---define-claims-transformations). 

    *AccessCodeInputCollector* is a Self-Asserted Technical Profile used to collect an access code from the user. It includes `EnabledForUserJourneys` element that's set to *OnClaimsExistence*. Its `Metadata` element includes a claim (*accountType*) and its value (*personal*) that activates this technical profile.  

1. Locate the `ClaimsProviders` element, and then add a new claims provider using the following code:  

    ```xml
        <!--<ClaimsProviders>-->
            <ClaimsProvider>
                <DisplayName>Technical Profile to collect user's accountType</DisplayName>
                <TechnicalProfiles>
                    <TechnicalProfile Id="AccountTypeInputCollector">
                        <DisplayName>Collect User Input Technical Profile</DisplayName>
                        <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
                        <Metadata>
                            <Item Key="ContentDefinitionReferenceId">SelfAssertedContentDefinition</Item>
                        </Metadata>
                        <DisplayClaims>
                            <DisplayClaim ClaimTypeReferenceId="accountType" Required="true"/>
                        </DisplayClaims>
                        <OutputClaims>
                            <OutputClaim ClaimTypeReferenceId="accountType"/>
                        </OutputClaims>
                    </TechnicalProfile>
                </TechnicalProfiles>
            </ClaimsProvider>
        <!--</ClaimsProviders>-->
    ```   
    
    We've configured a self-asserted technical profile, `AccountTypeInputCollector`, which collect the user's account type. It's the account types's value that determines whether the `AccessCodeInputCollector` self-asserted technical profile should be activated. 

1. To prevent the `UserInformationCollector` self-asserted technical profile from collecting the account type, locate the `UserInformationCollector` self-asserted technical profile, and then: 
    
    1.  Remove the `accountType` display claim, `<DisplayClaim ClaimTypeReferenceId="accountType" Required="true"/>` from the `DisplayClaims` collection.
    
    1. Remove the `accountType` output claim, `<OutputClaim ClaimTypeReferenceId="accountType"/>`, from the `OutputClaims` collection. 


## Step 4 - Update the User journey orchestration steps

Now that you've set up your technical profiles, you need to update your user journey orchestration steps:

1. Locate your `HelloWorldJourney` user journey and add replace all the orchestration steps with the following code: 

    ```xml
        <!--<OrchestrationSteps>-->
            <OrchestrationStep Order="1" Type="ClaimsExchange">
                <ClaimsExchanges>
                    <ClaimsExchange Id="AccountTypeInputCollectorClaimsExchange" TechnicalProfileReferenceId="AccountTypeInputCollector"/>
                </ClaimsExchanges>
            </OrchestrationStep>
            <OrchestrationStep Order="2" Type="ClaimsExchange">
                <ClaimsExchanges>
                    <ClaimsExchange Id="GetAccessCodeClaimsExchange" TechnicalProfileReferenceId="AccessCodeInputCollector" />
                </ClaimsExchanges>
                </OrchestrationStep>
            <OrchestrationStep Order="3" Type="ClaimsExchange">
                <ClaimsExchanges>
                    <ClaimsExchange Id="GetUserInformationClaimsExchange" TechnicalProfileReferenceId="UserInformationCollector"/>
                </ClaimsExchanges>
            </OrchestrationStep>
            <OrchestrationStep Order="4" Type="ClaimsExchange">
                <ClaimsExchanges>
                    <ClaimsExchange Id="GetMessageClaimsExchange" TechnicalProfileReferenceId="ClaimGenerator"/>
                </ClaimsExchanges>
            </OrchestrationStep>
            <OrchestrationStep Order="5" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer"/>
        <!--</OrchestrationSteps>-->
    ``` 
     The orchestration steps shows that we call the technical profile in the order shown by the orchestration steps' `Order` attribute. However, the `AccessCodeInputCollector` technical profile is activated if the user selects *Personal Account* account type. 

## Step 5 - Upload custom policy file

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 6 - Test the custom policy

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-6---test-the-custom-policy) to test your custom policy:

1. In the first screen, for  **Account Type**, select **Personal Account**. 
1. For **Access Code**, enter *88888*, and then select **Continue**. 
1. Enter the rest of the details as required, and then select **Continue**. After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. 
1. Repeat step 5, but this time, select **Account Type**, select **Contoso Employee Account**, and then follow the prompts.  
 

## Next steps

In [step 3](#step-3---configure-or-update-technical-profiles), we enable or disable  the technical profile by using the `EnabledForUserJourneys` element. Alternatively, you can use [Preconditions](userjourneys.md#preconditions) inside the user journey orchestration steps to execute or skip an orchestration step as we learn later in this series.

Next, learn: 

- About [User Journey Orchestration Steps Preconditions](userjourneys.md#preconditions).

-  How to [Use the TrustFrameworkPolicy schema file to validate Azure AD B2C policy files](custom-policies-series-install-xml-extensions.md).