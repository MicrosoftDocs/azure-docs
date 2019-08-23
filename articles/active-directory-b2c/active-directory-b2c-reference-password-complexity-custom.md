---
title: Configure password complexity using custom policies in Azure Active Directory B2C | Microsoft Docs
description: How to configure password complexity requirements using a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/13/2018
ms.author: marsma
ms.subservice: B2C
---

# Configure password complexity using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In Azure Active Directory (Azure AD) B2C, you can configure the complexity requirements for passwords that are provided by a user when creating an account. By default, Azure AD B2C uses **Strong** passwords. This article shows you how to configure password complexity in [custom policies](active-directory-b2c-overview-custom.md). It's also possible to configure password complexity in [user flows](active-directory-b2c-reference-password-complexity.md).

## Prerequisites

Complete the steps in [Get started with custom policies in Active Directory B2C](active-directory-b2c-get-started-custom.md).

## Add the elements

1. Copy the *SignUpOrSignIn.xml* file that you downloaded with the starter pack and name it *SingUpOrSignInPasswordComplexity.xml*.
2. Open the *SingUpOrSignInPasswordComplexity.xml* file and change the **PolicyId** and the **PublicPolicyUri** to a new policy name. For example, *B2C_1A_signup_signin_password_complexity*.
3. Add the following **ClaimType** elements with identifiers of `newPassword` and `reenterPassword`:

    ```XML
    <ClaimsSchema>
      <ClaimType Id="newPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
      <ClaimType Id="reenterPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
    </ClaimsSchema>
    ```

4. [Predicates](predicates.md) have method types of `IsLengthRange` or `MatchesRegex`. The `MatchesRegex` type is used to match a regular expression. The `IsLengthRange` type takes a minimum and maximum string length. Add a **Predicates** element to the **BuildingBlocks** element if it doesn't exist with the following **Predicate** elements:

    ```XML
    <Predicates>
      <Predicate Id="PIN" Method="MatchesRegex" HelpText="The password must be a pin.">
        <Parameters>
          <Parameter Id="RegularExpression">^[0-9]+$</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="Length" Method="IsLengthRange" HelpText="The password must be between 8 and 16 characters.">
        <Parameters>
          <Parameter Id="Minimum">8</Parameter>
          <Parameter Id="Maximum">16</Parameter>
        </Parameters>
      </Predicate>
    </Predicates>
    ```

5. Each **InputValidation** element is constructed by using the defined **Predicate** elements. This element allows you to perform boolean aggregations that are similar to `and` and `or`. Add an **InputValidations** element to the **BuildingBlocks** element if it doesn't exist with the following **InputValidation** element:

    ```XML
    <InputValidations>
      <InputValidation Id="PasswordValidation">
        <PredicateReferences Id="LengthGroup" MatchAtLeast="1">
          <PredicateReference Id="Length" />
        </PredicateReferences>
        <PredicateReferences Id="3of4" MatchAtLeast="3" HelpText="You must have at least 3 of the following character classes:">
          <PredicateReference Id="Lowercase" />
          <PredicateReference Id="Uppercase" />
          <PredicateReference Id="Number" />
          <PredicateReference Id="Symbol" />
        </PredicateReferences>
      </InputValidation>
    </InputValidations>
    ```

6. Make sure that the **PolicyProfile** technical profile contains the following elements:

    ```XML
    <RelyingParty>
      <DefaultUserJourney ReferenceId="SignUpOrSignIn"/>
      <TechnicalProfile Id="PolicyProfile">
        <DisplayName>PolicyProfile</DisplayName>
        <Protocol Name="OpenIdConnect"/>
        <InputClaims>
          <InputClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration, DisableStrongPassword"/>
        </InputClaims>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="displayName"/>
          <OutputClaim ClaimTypeReferenceId="givenName"/>
          <OutputClaim ClaimTypeReferenceId="surname"/>
          <OutputClaim ClaimTypeReferenceId="email"/>
          <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        </OutputClaims>
        <SubjectNamingInfo ClaimType="sub"/>
      </TechnicalProfile>
    </RelyingParty>
    ```

7. Save the policy file.

## Test your policy

When testing your applications in Azure AD B2C, it can be useful to have the Azure AD B2C token returned to `https://jwt.ms` to be able to review the claims in it.

### Upload the files

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Identity Experience Framework**.
5. On the Custom Policies page, click **Upload Policy**.
6. Select **Overwrite the policy if it exists**, and then search for and select the *SingUpOrSignInPasswordComplexity.xml* file.
7. Click **Upload**.

### Run the policy

1. Open the policy that you changed. For example, *B2C_1A_signup_signin_password_complexity*.
2. For **Application**, select your application that you previously registered. To see the token, the **Reply URL** should show `https://jwt.ms`.
3. Click **Run now**.
4. Select **Sign up now**, enter an email address, and enter a new password. Guidance is presented on password restrictions. Finish entering the user information, and then click **Create**. You should see the contents of the token that was returned.

## Next steps

- Learn how to [Configure password change using custom policies in Azure Active Directory B2C](active-directory-b2c-reference-password-change-custom.md).


