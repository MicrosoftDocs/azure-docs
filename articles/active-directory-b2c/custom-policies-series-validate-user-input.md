---
title: Validate user inputs by using Azure AD B2C custom policy 
titleSuffix: Azure AD B2C
description: Learn how to validate user inputs by using by using Azure Active Directory B2C custom policy  
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

#  Validate user inputs by using Azure AD B2C custom policy 

Azure Active Directory B2C (Azure AD B2C) custom policy not only allows you to make user inputs mandatory but also to validate them. You can mark user inputs as *required*, such as `<DisplayClaim ClaimTypeReferenceId="givenName" Required="true"/>`, but it doesn't mean your users will enter valid data. Azure AD B2C provides various ways to validate a user input. In this article, you'll learn how to write a custom policy that collects the user inputs and validates them by using the following approaches: 

- Restrict the data a user enters by providing a list of options to pick from. This approach uses *Enumerated Values*.
 
- Define a pattern that a user input must match. This approach uses *Regular Expressions*. 

- Define a set of rules and require that a user input obeys one or more of the rules. This approach uses *Predicates*. 

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Collect and manipulate user inputs by using Azure AD B2C custom policy](custom-policies-series-collect-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

## Validate by providing user input options 

If you know all the possible values that a user can enter for a given input, you can provide a finite set of values that a user must select from. Custom policy provides *DropdownSinglSelect*, *CheckboxMultiSelect*, and *RadioSingleSelect* [UserInputType](claimsschema.md#userinputtype) for this purpose. In this article, you'll use a *RadioSingleSelect* input type:

1. In VS Code, open the file `ContosoCustomPolicy.XML`. 

1. In the `ClaimsSchema` elements of the `ContosoCustomPolicy.XML` file, declare the following Claim Type:
  
    ```xml
        <ClaimType Id="accountType">
            <DisplayName>Account Type</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>The type of account usd by the user</UserHelpText>
            <UserInputType>RadioSingleSelect</UserInputType>
            <Restriction>
                <Enumeration Text="Contoso Employee Account" Value="work" SelectByDefault="true"/>
                <Enumeration Text="Personal Account" Value="personal" SelectByDefault="false"/>
            </Restriction>
        </ClaimType>
    ```

    We've declared *accountType* claim. When the claim's value is collected from the user, the user must select either *Contoso Employee Account* for a value *work* or *Personal Account* for a value *personal*. 

1. Locate the technical profile with `Id="UserInformationCollector"`, add the *accountType* display claim by using the following code: 

    ```xml
        <DisplayClaim ClaimTypeReferenceId="accountType" Required="true"/>
    ```  
1. In the technical profile with `Id="UserInformationCollector"`, add the *accountType* output claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="accountType"/>
    ```

1. Locate the `RelyingParty` element, add the *accountType* token claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="accountType" />
    ```