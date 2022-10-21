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

- Restrict the data a user enters by providing a list of options to pick from. This approach uses *Enumerated Values*, which add when you declare a claim.
 
- Define a pattern that a user input must match. This approach uses *Regular Expressions*, which add when you declare a claim. 

- Define a set of rules and require that a user input obeys one or more of the rules. This approach uses *Predicates*,which add when you declare a claim.

- If your business rules are complex to be defined at claim declaration level, custom policies allow you to configure a [Validation Technical](validation-technical-profile.md) to define the rules. For example, you collect a user input, which need to be validated against a set of other values.      

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Collect and manipulate user inputs by using Azure AD B2C custom policy](custom-policies-series-collect-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

## Validate by providing user input options 

If you know all the possible values that a user can enter for a given input, you can provide a finite set of values that a user must select from. You can use *DropdownSinglSelect*, *CheckboxMultiSelect*, and *RadioSingleSelect* [UserInputType](claimsschema.md#userinputtype) for this purpose. In this article, you'll use a *RadioSingleSelect* input type:

1. In VS Code, open the file `ContosoCustomPolicy.XML`. 

1. In the `ClaimsSchema` element of the `ContosoCustomPolicy.XML` file, declare the following Claim Type:
  
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

1. Locate the technical profile with `Id="UserInformationCollector"`, add the *accountType* claim as display claim by using the following code: 

    ```xml
        <DisplayClaim ClaimTypeReferenceId="accountType" Required="true"/>
    ```  
1. In the technical profile with `Id="UserInformationCollector"`, add the *accountType* claim as an output claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="accountType"/>
    ```

1. Locate the `RelyingParty` element, add the *accountType* claim as a token claim by using the following code:  

    ```xml
        <OutputClaim ClaimTypeReferenceId="accountType" />
    ```

## Validate user input by using Regular Expressions

When it's not possible to know all possible user input values in advance, you allow the user to input the data themselves. In this case, you can use *regular expressions (regex)* or [pattern](claimsschema.md#pattern) to dictate how a user input need to be formatted. For instance, an email must have the *at (@)* symbol and a *period (.)* somewhere in its text. 

When you declare a claim, custom policy allows you to define a regex, which the user input must match. You can optionally provide a message, which is shown to the user, if their input doesn't match the expression. 

1.  Locate the `ClaimsSchema` element, and declare the *email* claim by using the following code: 

    ```xml
        <ClaimType Id="email">
            <DisplayName>Email Address</DisplayName>
            <DataType>string</DataType>
            <DefaultPartnerClaimTypes>
                <Protocol Name="OpenIdConnect" PartnerClaimType="email"/>
            </DefaultPartnerClaimTypes>
            <UserHelpText>Your email address. </UserHelpText>
            <UserInputType>TextBox</UserInputType>
            <Restriction>
                <Pattern RegularExpression="^[a-zA-Z0-9.!#$%&amp;&apos;^_`{}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" HelpText="Please enter a valid email address something like maurice@contoso.com"/>
            </Restriction>
        </ClaimType>
    ``` 

1. Locate the technical profile with `Id="UserInformationCollector"`, add the *email* claim as display claim by using the following code: 

    ```xml
        <DisplayClaim ClaimTypeReferenceId="email" Required="true"/>
    ```

1. In the technical profile with `Id="UserInformationCollector"`, add the *email* claim as an output claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="email"/>
    ```

1. Locate the `RelyingParty` element, add the *email* as a token claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="email" />
    ```

## Validate user input by using Predicates

You've used regex to validate user inputs. However, regex have one weakness, that's, the error message displays until you correct input without showing you the specific requirement the input is missing. 

Predicates validations allow you to address this problem by allowing you to define a set of rules (predicates) and independent error message for each rule. In custom policies, a predicate has an inbuilt method, which defines the checks that you want to make. For example, you can use [IsLengthRange](predicates.md#islengthrange) predicate method to check whether a user *password* is within the range of minimum and maximum parameters (values) specified. 

While the *Predicates* define the validation to check against a claim type, the *PredicateValidations* group a set of predicates to form a user input validation that can be applied to a claim type. Both *Predicates* and *PredicateValidations* elements are child elements of `BuildingBlocks` section of your policy file. 


1. Locate the `ClaimsSchema` element, and declare the *password* claim by using the following code: 

    ```xml
        <ClaimType Id="password">
          <DisplayName>Password</DisplayName>
          <DataType>string</DataType>
          <AdminHelpText>Enter password</AdminHelpText>
          <UserHelpText>Enter password</UserHelpText>
          <UserInputType>Password</UserInputType>
        </ClaimType>
    ``` 

1. Add a `Predicates` element as a child of `BuildingBlocks` section by using the following code: 

    ```xml
        <Predicates>
        
        </Predicates>
    ```

1. Inside the `Predicates` element, define predicates by using the following code:

    ```xml
      <Predicate Id="IsLengthBetween8And64" Method="IsLengthRange" HelpText="The password must be between 8 and 64 characters.">
        <Parameters>
          <Parameter Id="Minimum">8</Parameter>
          <Parameter Id="Maximum">64</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="Lowercase" Method="IncludesCharacters" HelpText="a lowercase letter">
        <Parameters>
          <Parameter Id="CharacterSet">a-z</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="Uppercase" Method="IncludesCharacters" HelpText="an uppercase letter">
        <Parameters>
          <Parameter Id="CharacterSet">A-Z</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="Number" Method="IncludesCharacters" HelpText="a digit">
        <Parameters>
          <Parameter Id="CharacterSet">0-9</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="Symbol" Method="IncludesCharacters" HelpText="a symbol">
        <Parameters>
          <Parameter Id="CharacterSet">@#$%^&amp;*\-_+=[]{}|\\:',.?/`~"();!</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="PIN" Method="MatchesRegex" HelpText="The password must be numbers only.">
        <Parameters>
          <Parameter Id="RegularExpression">^[0-9]+$</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="AllowedAADCharacters" Method="MatchesRegex" HelpText="An invalid character was provided.">
        <Parameters>
          <Parameter Id="RegularExpression">(^([0-9A-Za-z\d@#$%^&amp;*\-_+=[\]{}|\\:',?/`~"();! ]|(\.(?!@)))+$)|(^$)</Parameter>
        </Parameters>
      </Predicate>
    
      <Predicate Id="DisallowedWhitespace" Method="MatchesRegex" HelpText="The password must not begin or end with a whitespace character.">
        <Parameters>
          <Parameter Id="RegularExpression">(^\S.*\S$)|(^\S+$)|(^$)</Parameter>
        </Parameters>
      </Predicate>
    ```

    We've defined several rules, which when put together described an acceptable password. Next, you can group predicates, to form a set of password policies that you can use in your policy.  

1. Add a `PredicateValidations` element as a child of `BuildingBlocks` section by using the following code: 

    ```xml
        <PredicateValidations>
        
        </PredicateValidations>
    ``` 
1. Inside the `PredicateValidations` element, define PredicateValidations by using the following code:

    ```xml
        <PredicateValidation Id="SimplePassword">
            <PredicateGroups>
                <PredicateGroup Id="DisallowedWhitespaceGroup">
                    <PredicateReferences>
                        <PredicateReference Id="DisallowedWhitespace"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="AllowedCharactersGroup">
                    <PredicateReferences>
                        <PredicateReference Id="AllowedCharacters"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="LengthGroup">
                    <PredicateReferences>
                        <PredicateReference Id="IsLengthBetween8And64"/>
                    </PredicateReferences>
                </PredicateGroup>
            </PredicateGroups>
        </PredicateValidation>
        <PredicateValidation Id="StrongPassword">
            <PredicateGroups>
                <PredicateGroup Id="DisallowedWhitespaceGroup">
                    <PredicateReferences>
                        <PredicateReference Id="DisallowedWhitespace"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="AllowedCharactersGroup">
                    <PredicateReferences>
                        <PredicateReference Id="AllowedCharacters"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="LengthGroup">
                    <PredicateReferences>
                        <PredicateReference Id="IsLengthBetween8And64"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="CharacterClasses">
                    <UserHelpText>The password must have at least 3 of the following:</UserHelpText>
                    <PredicateReferences MatchAtLeast="3">
                        <PredicateReference Id="Lowercase"/>
                        <PredicateReference Id="Uppercase"/>
                        <PredicateReference Id="Number"/>
                        <PredicateReference Id="Symbol"/>
                    </PredicateReferences>
                </PredicateGroup>
            </PredicateGroups>
        </PredicateValidation>
        <PredicateValidation Id="CustomPassword">
            <PredicateGroups>
                <PredicateGroup Id="DisallowedWhitespaceGroup">
                    <PredicateReferences>
                        <PredicateReference Id="DisallowedWhitespace"/>
                    </PredicateReferences>
                </PredicateGroup>
                <PredicateGroup Id="AllowedCharactersGroup">
                    <PredicateReferences>
                        <PredicateReference Id="AllowedCharacters"/>
                    </PredicateReferences>
                </PredicateGroup>
            </PredicateGroups>
        </PredicateValidation>
    ```
    We've three defined Predicate Validation, *StrongPassword*, *CustomPassword* and *SimplePassword*. Depending on the characteristics of the password you want your users to input, you can use any on the Predicate Validations. In this article, we'll use a strong password. 

1. Locate the *password* Claim Type declaration and add the *StrongPassword* Predicate Validation just after the UserInputType element declaration it contains byt using the following code: 

    ```xml
        <PredicateValidationReference Id="StrongPassword" />
    ``` 
1. Locate the technical profile with `Id="UserInformationCollector"`, add the *password* claim as display claim by using the following code: 

    ```xml
        <DisplayClaim ClaimTypeReferenceId="password" Required="true"/>
    ```

1. In the technical profile with `Id="UserInformationCollector"`, add the *password* claim as an output claim by using the following code: 

    ```xml
        <OutputClaim ClaimTypeReferenceId="password"/>
    ``` 

> [!NOTE]    
> For security reasons, we'll not add a users's password as a claim in the token generated by your policy. 

##  Upload custom policy file 

At this point, you've built your policy to address the first three approaches to user input validation. 

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file). If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Test the custom policy

1. Under **Custom policies**, select **B2C_1A_CONTOSOCUSTOMPOLICY**.
1. For **Select application** on the overview page of the custom policy, select the web application such as *webapp1* that you previously registered. Make sure that the **Select reply URL** value is set to`https://jwt.ms`.
1. Select **Run now** button.
1. Enter **Given Name** and **Surname**. 
1. Select **Account Type**.
1. For **Email Address**, enter an email values that's not well formatted such as *maurice.paulet@contoso*. 
1. For **Password**, enter password value that does'nt obey all the characteristics of a strong password as set. 
1. Select **Continue** button. You'll see a screen similar to the one shown below:

    :::image type="content" source="media/custom-policies-series-validate-user-input/screenshot-of-user-input-validation.png" alt-text="screenshot of validating user inputs.":::

    You must correct your inputs before you continue.

1. Enter correct values as suggested by the error messages, and select **Continue** button again. After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. The token looks similar to the following JSON snippet: 

```json
    {
      "typ": "JWT",
      "alg": "RS256",
      "kid": "pxLOMWFg...."
    }.{
      ...
      "sub": "c7ae4515-f7a7....",
      ...
      "acr": "b2c_1a_contosocustompolicy",
      "accountType": "work",
      ...
      "email": "maurice.paulet@contoso.com",
      "name": "Maurice Paulet",
      "message": "Hello Maurice Paulet"
    }.[Signature]
``` 

## Validate user input by using Validation Technical Profiles

