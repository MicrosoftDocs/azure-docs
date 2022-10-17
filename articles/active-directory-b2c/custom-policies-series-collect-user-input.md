---
title: Collect and manipulate user inputs by using Azure AD B2C custom policy 
titleSuffix: Azure AD B2C
description: Learn how to collect user inputs from a user and manipulate them by using Azure Active Directory B2C's custom policy  
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

# Collect and manipulate user inputs by using Azure AD B2C custom policy

Azure Active Directory B2C (Azure AD B2C) custom policy custom policies allows you to collect user inputs. You can then use inbuilt methods to manipulate the user inputs.  

In this article, you'll learn how to write a custom policy that collects user inputs via a graphical user interface. You'll then access the inputs, process then, and finally return them as claims in a JWT token. To complete this task, you'll: 

- Declare Claims. 
- Define TechnicalProfiles.
- Configure ClaimsTransformations to manipulate the Claims you declare.
- Configure ContentDefinitions.
- Configure and show user interfaces to the user by using Self-Asserted Technical Profiles and DisplayControls.
- Call Technical Profiles in a given sequence by using Orchestration Steps.    

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.
- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 
- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 
- Complete the steps in [Write your first custom policy - Hello World!](custom-policies-series-overview.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 


## Step 1 - Declare Claims

Declare additional claims alongside *objectId* and *message*: 

1. In VS Code, open the file `ContosoCustomPolicy.XML`. 
1. In the `ClaimsSchema` section, add the following [ClaimType](claimsschema.md) declarations: 

    ```xml
        <ClaimType Id="givenName">
            <DisplayName>Given Name</DisplayName>
            <DataType>string</DataType>
            <DefaultPartnerClaimTypes>
                <Protocol Name="OAuth2" PartnerClaimType="given_name" />
                <Protocol Name="OpenIdConnect" PartnerClaimType="given_name" />
                <Protocol Name="SAML2" PartnerClaimType="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname" />
            </DefaultPartnerClaimTypes>
            <UserHelpText>Your given name (also known as first name).</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
        
        <ClaimType Id="surname">
            <DisplayName>Surname</DisplayName>
            <DataType>string</DataType>
            <DefaultPartnerClaimTypes>
                <Protocol Name="OAuth2" PartnerClaimType="family_name" />
                <Protocol Name="OpenIdConnect" PartnerClaimType="family_name" />
                <Protocol Name="SAML2" PartnerClaimType="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname" />
            </DefaultPartnerClaimTypes>
            <UserHelpText>Your surname (also known as family name or last name).</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
        <ClaimType Id="displayName">
            <DisplayName>Display Name</DisplayName>
            <DataType>string</DataType>
            <DefaultPartnerClaimTypes>
                <Protocol Name="OAuth2" PartnerClaimType="unique_name" />
                <Protocol Name="OpenIdConnect" PartnerClaimType="name" />
                <Protocol Name="SAML2" PartnerClaimType="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" />
            </DefaultPartnerClaimTypes>
            <UserHelpText>Your display name.</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
    ```  

  We've declared three Claim Types, *givenName*, *surname*, and *displayName*. These declarations include `DataType`, `UserInputType` and `DisplayName` elements: 

- **DataType** specifies the data type of the value that the claims holds. Learn more about the data types tha the [DataType elements supports](claimsschema.md#datatype).  
- **UserInputType** specifies the UI control that appears on the user interface if you want to collect the value of the claim from the user. Learn more about the user [input types that Azure AD B2C supports](claimsschema.md#userinputtype).   
- **DisplayName** specifies the label for the UI control that appears on the user interface if you want to collect the value of the claim from the user.


## Step 2 - Configure Claims Transformations 

A [ClaimsTransformation](claimstransformations.md) contains a function that you use to convert a given claim into another one. For instance, you can change a string claim from lower case to upper case. Leant more about [Claims transformations supported by Azure AD B2C](claimstransformations.md#claims-transformations-reference). 

1. In the `ContosoCustomPolicy.XML` file, add a `<ClaimsTransformations>` element as a child of the `BuildingBlocks` section. 
    ```xml
        <ClaimsTransformations>
        
        </ClaimsTransformations>
    ```
1. Add the following code inside the `ClaimsTransformations` element:

    ```xml
        <ClaimsTransformation Id="GenerateRandomObjectIdTransformation" TransformationMethod="CreateRandomString">
            <InputParameters>
            <InputParameter Id="randomGeneratorType" DataType="string" Value="GUID"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation>
    
        <ClaimsTransformation Id="CreateDisplayNameTransformation" TransformationMethod="FormatStringMultipleClaims">
            <InputClaims>
            <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="inputClaim1"/>
            <InputClaim ClaimTypeReferenceId="surname" TransformationClaimType="inputClaim2"/>
            </InputClaims>
            <InputParameters>
            <InputParameter Id="stringFormat" DataType="string" Value="{0} {1}"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation>
    
        <ClaimsTransformation Id="CreateMessageTransformation" TransformationMethod="FormatStringClaim">
            <InputClaims>
            <InputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="inputClaim"/>
            </InputClaims>
            <InputParameters>
            <InputParameter Id="stringFormat" DataType="string" Value="Hello {0}"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="message" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation> 
    ```

    We've configured three claims transformations: 
    - *GenerateRandomObjectIdTransformation* generates a random string as specified by the *CreateRandomString* method. The *objectId* claims is updated with the generated string as specified by the `OutputClaim` element. 
        
    - *CreateDisplayNameTransformation* concatenates *givenName* and *surname* to form *displayName*. 
    
    -  *CreateMessageTransformation* concatenates *Hello* and *displayName* to form *message*. 

## Step 3 - Configure Content Definitions

[ContentDefinitions](contentdefinitions.md) allow you to specify URL to HTML templates that control the layout of the web pages you show to your users. You can specify specific user interfaces for each step, such as sign-in or sign-up, password reset, or error pages.

To add content definition, add the following code in `BuildingBlocks` section of the `ContosoCustomPolicy.XML` file:

```xml
    <ContentDefinitions>
        <ContentDefinition Id="SelfAssertedContentDefinition">
            <LoadUri>~/tenant/templates/AzureBlue/selfAsserted.cshtml</LoadUri>
            <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
            <DataUri>urn:com:microsoft:aad:b2c:elements:contract:selfasserted:2.1.7</DataUri>
        </ContentDefinition>
    </ContentDefinitions>
```   

## Step 4 - Configure Technical Profiles  

In a custom policy, a [TechnicalProfile](technicalprofiles.md) is the element that implements functionality. Now that you've made declarations such as Claims and Claims Transformations, you need Technical Profiles to execute your declarations. A technical profile are declared inside the `ClaimsProvider` elements.

Azure AD B2C provides a set of technical profiles. Each technical profile performs a specific role. For instance, you use a [REST technical profile](restful-technical-profile.md) to make an HTTP call to a service endpoint. Learn more about the [types of technical profiles](technicalprofiles.md) that Azure AD B2C custom policies provide.      
