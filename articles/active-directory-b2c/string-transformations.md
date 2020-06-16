---
title: String claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: String claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 04/21/2020
ms.author: mimart
ms.subservice: B2C
---

# String claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides examples for using the string claims transformations of the Identity Experience Framework  schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [ClaimsTransformations](claimstransformations.md).

## AssertStringClaimsAreEqual

Compare two claims, and throw an exception if they are not equal according to the specified comparison inputClaim1, inputClaim2 and stringComparison.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | string | First claim's type, which is to be compared. |
| InputClaim | inputClaim2 | string | Second claim's type, which is to be compared. |
| InputParameter | stringComparison | string | string comparison, one of the values: Ordinal, OrdinalIgnoreCase. |

The **AssertStringClaimsAreEqual** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md), or a [DisplayConrtol](display-controls.md). The `UserMessageIfClaimsTransformationStringsAreNotEqual` metadata of a self-asserted technical profile controls the error message that is presented to the user. The error messages can be [localized](localization-string-ids.md#claims-transformations-error-messages).


![AssertStringClaimsAreEqual execution](./media/string-transformations/assert-execution.png)

You can use this claims transformation to make sure, two ClaimTypes have the same value. If not, an error message is thrown. The following example checks that the **strongAuthenticationEmailAddress** ClaimType is equal to **email** ClaimType. Otherwise an error message is thrown.

```XML
<ClaimsTransformation Id="AssertEmailAndStrongAuthenticationEmailAddressAreEqual" TransformationMethod="AssertStringClaimsAreEqual">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="strongAuthenticationEmailAddress" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="stringComparison" DataType="string" Value="ordinalIgnoreCase" />
  </InputParameters>
</ClaimsTransformation>
```


The **login-NonInteractive** validation technical profile calls the **AssertEmailAndStrongAuthenticationEmailAddressAreEqual** claims transformation.
```XML
<TechnicalProfile Id="login-NonInteractive">
  ...
  <OutputClaimsTransformations>
    <OutputClaimsTransformation ReferenceId="AssertEmailAndStrongAuthenticationEmailAddressAreEqual" />
  </OutputClaimsTransformations>
</TechnicalProfile>
```

The self-asserted technical profile calls the validation **login-NonInteractive** technical profile.

```XML
<TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
  <Metadata>
    <Item Key="UserMessageIfClaimsTransformationStringsAreNotEqual">Custom error message the email addresses you provided are not the same.</Item>
  </Metadata>
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="login-NonInteractive" />
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```

### Example

- Input claims:
  - **inputClaim1**: someone@contoso.com
  - **inputClaim2**: someone@outlook.com
- Input parameters:
  - **stringComparison**:  ordinalIgnoreCase
- Result: Error thrown

## ChangeCase

Changes the case of the provided claim to lower or upper case depending on the operator.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | string | The ClaimType to be changed. |
| InputParameter | toCase | string | One of the following values: `LOWER` or `UPPER`. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this claims transformation has been invoked. |

Use this claim transformation to change any string ClaimType to lower or upper case.

```XML
<ClaimsTransformation Id="ChangeToLower" TransformationMethod="ChangeCase">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="inputClaim1" />
  </InputClaims>
<InputParameters>
  <InputParameter Id="toCase" DataType="string" Value="LOWER" />
</InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **email**: SomeOne@contoso.com
- Input parameters:
    - **toCase**: LOWER
- Output claims:
  - **email**: someone@contoso.com

## CreateStringClaim

Creates a string claim from the provided input parameter in the transformation.

| Item | TransformationClaimType | Data Type | Notes |
|----- | ----------------------- | --------- | ----- |
| InputParameter | value | string | The string to be set. This input parameter supports [string claims transformation expressions](string-transformations.md#string-claim-transformations-expressions). |
| OutputClaim | createdClaim | string | The ClaimType that is produced after this claims transformation has been invoked, with the value specified in the input parameter. |

Use this claims transformation to set a string ClaimType value.

```XML
<ClaimsTransformation Id="CreateTermsOfService" TransformationMethod="CreateStringClaim">
  <InputParameters>
    <InputParameter Id="value" DataType="string" Value="Contoso terms of service..." />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="TOS" TransformationClaimType="createdClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input parameter:
    - **value**: Contoso terms of service...
- Output claims:
    - **createdClaim**: The TOS ClaimType contains the "Contoso terms of service..." value.

## CompareClaims

Determine whether one string claim is equal to another. The result is a new boolean ClaimType with a value of `true` or `false`.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | string | First claim type, which is to be compared. |
| InputClaim | inputClaim2 | string | Second claim type, which is to be compared. |
| InputParameter | operator | string | Possible values: `EQUAL` or `NOT EQUAL`. |
| InputParameter | ignoreCase | boolean | Specifies whether this comparison should ignore the case of the strings being compared. |
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this claims transformation has been invoked. |

Use this claims transformation to check if a claim is equal to another claim. For example, the following claims transformation checks if the value of the **email** claim is equal to the **Verified.Email** claim.

```XML
<ClaimsTransformation Id="CheckEmail" TransformationMethod="CompareClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="Email" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="Verified.Email" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="operator" DataType="string" Value="NOT EQUAL" />
    <InputParameter Id="ignoreCase" DataType="string" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="SameEmailAddress" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **inputClaim1**: someone@contoso.com
  - **inputClaim2**: someone@outlook.com
- Input parameters:
    - **operator**:  NOT EQUAL
    - **ignoreCase**: true
- Output claims:
    - **outputClaim**: true

## CompareClaimToValue

Determines whether a claim value is equal to the input parameter value.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | string | The claim's type, which is to be compared. |
| InputParameter | operator | string | Possible values: `EQUAL` or `NOT EQUAL`. |
| InputParameter | compareTo | string | string comparison, one of the values: Ordinal, OrdinalIgnoreCase. |
| InputParameter | ignoreCase | boolean | Specifies whether this comparison should ignore the case of the strings being compared. |
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this claims transformation has been invoked. |

You can use this claims transformation to check if a claim is equal to a value you specified. For example, the following claims transformation checks if the value of the **termsOfUseConsentVersion** claim is equal to `v1`.

```XML
<ClaimsTransformation Id="IsTermsOfUseConsentRequiredForVersion" TransformationMethod="CompareClaimToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="termsOfUseConsentVersion" TransformationClaimType="inputClaim1" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="compareTo" DataType="string" Value="V1" />
    <InputParameter Id="operator" DataType="string" Value="not equal" />
    <InputParameter Id="ignoreCase" DataType="string" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentRequired" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example
- Input claims:
    - **inputClaim1**: v1
- Input parameters:
    - **compareTo**: V1
    - **operator**: EQUAL
    - **ignoreCase**:  true
- Output claims:
    - **outputClaim**: true

## CreateRandomString

Creates a random string using the random number generator. If the random number generator is of type `integer`, optionally a seed parameter and a maximum number may be provided. An optional string format parameter allows the output to be formatted using it, and an optional base64 parameter specifies whether the output is base64 encoded randomGeneratorType [guid, integer] outputClaim (String).

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputParameter | randomGeneratorType | string | Specifies the random value to be generated, `GUID` (global unique ID) or `INTEGER` (a number). |
| InputParameter | stringFormat | string | [Optional] Format the random value. |
| InputParameter | base64 | boolean | [Optional] Convert the random value to base64. If string format is applied, the value after string format is encoded to base64. |
| InputParameter | maximumNumber | int | [Optional] For `INTEGER` randomGeneratorType only. Specify the maximum number. |
| InputParameter | seed  | int | [Optional] For `INTEGER` randomGeneratorType only. Specify the seed for the random value. Note: same seed yields same sequence of random numbers. |
| OutputClaim | outputClaim | string | The ClaimTypes that will be produced after this claims transformation has been invoked. The random value. |

Following example generates a global unique ID. This claims transformation is used to create the random UPN (user principle name).

```XML
<ClaimsTransformation Id="CreateRandomUPNUserName" TransformationMethod="CreateRandomString">
  <InputParameters>
    <InputParameter Id="randomGeneratorType" DataType="string" Value="GUID" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="upnUserName" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
### Example

- Input parameters:
    - **randomGeneratorType**: GUID
- Output claims:
    - **outputClaim**: bc8bedd2-aaa3-411e-bdee-2f1810b73dfc

Following example generates an integer random value between 0 and 1000. The value is formatted to OTP_{random value}.

```XML
<ClaimsTransformation Id="SetRandomNumber" TransformationMethod="CreateRandomString">
  <InputParameters>
    <InputParameter Id="randomGeneratorType" DataType="string" Value="INTEGER" />
    <InputParameter Id="maximumNumber" DataType="int" Value="1000" />
    <InputParameter Id="stringFormat" DataType="string" Value="OTP_{0}" />
    <InputParameter Id="base64" DataType="boolean" Value="false" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="randomNumber" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input parameters:
    - **randomGeneratorType**: INTEGER
    - **maximumNumber**: 1000
    - **stringFormat**: OTP_{0}
    - **base64**: false
- Output claims:
    - **outputClaim**: OTP_853


## FormatStringClaim

Format a claim according to the provided format string. This transformation uses the C# `String.Format` method.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |string |The ClaimType that acts as string format {0} parameter. |
| InputParameter | stringFormat | string | The string format, including the {0}  parameter. This input parameter supports [string claims transformation expressions](string-transformations.md#string-claim-transformations-expressions).  |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this claims transformation has been invoked. |

Use this claims transformation to format any string with one parameter {0}. The following example creates a **userPrincipalName**. All social identity provider technical profiles, such as `Facebook-OAUTH` calls the **CreateUserPrincipalName** to generate a **userPrincipalName**.

```XML
<ClaimsTransformation Id="CreateUserPrincipalName" TransformationMethod="FormatStringClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="upnUserName" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="stringFormat" DataType="string" Value="cpim_{0}@{RelyingPartyTenantId}" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="userPrincipalName" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputClaim**: 5164db16-3eee-4629-bfda-dcc3326790e9
- Input parameters:
    - **stringFormat**:  cpim_{0}@{RelyingPartyTenantId}
- Output claims:
  - **outputClaim**: cpim_5164db16-3eee-4629-bfda-dcc3326790e9@b2cdemo.onmicrosoft.com

## FormatStringMultipleClaims

Format two claims according to the provided format string. This transformation uses the C# `String.Format` method.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |string | The ClaimType that acts as string format {0} parameter. |
| InputClaim | inputClaim | string | The ClaimType that acts as string format {1} parameter. |
| InputParameter | stringFormat | string | The string format, including the {0} and {1} parameters. This input parameter supports [string claims transformation expressions](string-transformations.md#string-claim-transformations-expressions).   |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this claims transformation has been invoked. |

Use this claims transformation to format any string with two parameters, {0} and {1}. The following example creates a **displayName** with the specified format:

```XML
<ClaimsTransformation Id="CreateDisplayNameFromFirstNameAndLastName" TransformationMethod="FormatStringMultipleClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="surName" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="stringFormat" DataType="string" Value="{0} {1}" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputClaim1**: Joe
    - **inputClaim2**: Fernando
- Input parameters:
    - **stringFormat**: {0} {1}
- Output claims:
    - **outputClaim**: Joe Fernando

## GetLocalizedStringsTransformation

Copies localized strings into claims.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| OutputClaim | The name of the localized string | string | List of claim types that are produced after this claims transformation has been invoked. |

To use the GetLocalizedStringsTransformation claims transformation:

1. Define a [localization string](localization.md) and associate it with a [self-asserted-technical-profile](self-asserted-technical-profile.md).
1. The `ElementType` of the `LocalizedString` element must be set to `GetLocalizedStringsTransformationClaimType`.
1. The `StringId` is a unique identifier that you define, and use it later in your claims transformation.
1. In the claims transformation, specify the list of claims to be set with the localized string. The `ClaimTypeReferenceId` is a reference to a ClaimType already defined in the ClaimsSchema section in the policy. The `TransformationClaimType` is the name of the localized string as defined in the `StringId` of the `LocalizedString` element.
1. In a [self-asserted technical profile](self-asserted-technical-profile.md), or a [display control](display-controls.md) input or output claims transformation, make a reference to your claims transformation.

![GetLocalizedStringsTransformation](./media/string-transformations/get-localized-strings-transformation.png)

The following example looks up the email subject, body, your code message, and the signature of the email, from localized strings. These claims later used by custom email verification template.

Define localized strings for English (default) and Spanish.

```XML
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="Append">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
   </SupportedLanguages>

  <LocalizedResources Id="api.localaccountsignup.en">
    <LocalizedStrings>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_subject">Contoso account email verification code</LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_message">Thanks for verifying your account!</LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_code">Your code is</LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_signature">Sincerely</LocalizedString>
     </LocalizedStrings>
   </LocalizedResources>
   <LocalizedResources Id="api.localaccountsignup.es">
     <LocalizedStrings>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_subject">Código de verificación del correo electrónico de la cuenta de Contoso</LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_message">Gracias por comprobar la cuenta de </LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_code">Su código es</LocalizedString>
      <LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_signature">Atentamente</LocalizedString>
    </LocalizedStrings>
  </LocalizedResources>
</Localization>
```

The claims transformation sets the value of the claim type *subject* with the value of the `StringId` *email_subject*.

```XML
<ClaimsTransformation Id="GetLocalizedStringsForEmail" TransformationMethod="GetLocalizedStringsTransformation">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="subject" TransformationClaimType="email_subject" />
    <OutputClaim ClaimTypeReferenceId="message" TransformationClaimType="email_message" />
    <OutputClaim ClaimTypeReferenceId="codeIntro" TransformationClaimType="email_code" />
    <OutputClaim ClaimTypeReferenceId="signature" TransformationClaimType="email_signature" />
   </OutputClaims>
</ClaimsTransformation>
```

### Example

- Output claims:
  - **subject**: Contoso account email verification code
  - **message**: Thanks for verifying your account!
  - **codeIntro**: Your code is
  - **signature**: Sincerely


## GetMappedValueFromLocalizedCollection

Looking up an item from a claim **Restriction** collection.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | mapFromClaim | string | The claim that contains the text to be looked up in the **restrictionValueClaim** claims with the **Restriction** collection.  |
| OutputClaim | restrictionValueClaim | string | The claim that contains the **Restriction** collection. After the claims transformation has been invoked, the value of this claim contains the value of the selected item. |

The following example looks up the error message description based on the error key. The **responseMsg** claim contains a collection of error messages to present to the end user or to be sent to the relying party.

```XML
<ClaimType Id="responseMsg">
  <DisplayName>Error message: </DisplayName>
  <DataType>string</DataType>
  <UserInputType>Paragraph</UserInputType>
  <Restriction>
    <Enumeration Text="B2C_V1_90001" Value="You cannot sign in because you are a minor" />
    <Enumeration Text="B2C_V1_90002" Value="This action can only be performed by gold members" />
    <Enumeration Text="B2C_V1_90003" Value="You have not been enabled for this operation" />
  </Restriction>
</ClaimType>
```
The claims transformation looks up the text of the item and returns its value. If the restriction is localized using `<LocalizedCollection>`, the claims transformation returns the localized value.

```XML
<ClaimsTransformation Id="GetResponseMsgMappedToResponseCode" TransformationMethod="GetMappedValueFromLocalizedCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="responseCode" TransformationClaimType="mapFromClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="responseMsg" TransformationClaimType="restrictionValueClaim" />        
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **mapFromClaim**: B2C_V1_90001
- Output claims:
    - **restrictionValueClaim**: You cannot sign in because you are a minor.

## LookupValue

Look up a claim value from a list of values based on the value of another claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputParameterId | string | The claim that contains the lookup value |
| InputParameter | |string | Collection of inputParameters. |
| InputParameter | errorOnFailedLookup | boolean | Controlling whether an error is returned when no matching lookup. |
| OutputClaim | inputParameterId | string | The ClaimTypes that will be produced after this claims transformation has been invoked. The value of the matching `Id`. |

The following example looks up the domain name in one of the inputParameters collections. The claims transformation looks up the domain name in the identifier and returns its value (an application ID).

```XML
 <ClaimsTransformation Id="DomainToClientId" TransformationMethod="LookupValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="domainName" TransformationClaimType="inputParameterId" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="contoso.com" DataType="string" Value="13c15f79-8fb1-4e29-a6c9-be0d36ff19f1" />
    <InputParameter Id="microsoft.com" DataType="string" Value="0213308f-17cb-4398-b97e-01da7bd4804e" />
    <InputParameter Id="test.com" DataType="string" Value="c7026f88-4299-4cdb-965d-3f166464b8a9" />
    <InputParameter Id="errorOnFailedLookup" DataType="boolean" Value="false" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="domainAppId" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputParameterId**: test.com
- Input parameters:
    - **contoso.com**: 13c15f79-8fb1-4e29-a6c9-be0d36ff19f1
    - **microsoft.com**: 0213308f-17cb-4398-b97e-01da7bd4804e
    - **test.com**: c7026f88-4299-4cdb-965d-3f166464b8a9
    - **errorOnFailedLookup**: false
- Output claims:
    - **outputClaim**:    c7026f88-4299-4cdb-965d-3f166464b8a9

When `errorOnFailedLookup` input parameter is set to `true`, the **LookupValue** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md), or a [DisplayConrtol](display-controls.md). The `LookupNotFound` metadata of a self-asserted technical profile controls the error message that is presented to the user.

![AssertStringClaimsAreEqual execution](./media/string-transformations/assert-execution.png)

The following example looks up the domain name in one of the inputParameters collections. The claims transformation looks up the domain name in the identifier and returns its value (an application ID), or raises an error message.

```XML
 <ClaimsTransformation Id="DomainToClientId" TransformationMethod="LookupValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="domainName" TransformationClaimType="inputParameterId" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="contoso.com" DataType="string" Value="13c15f79-8fb1-4e29-a6c9-be0d36ff19f1" />
    <InputParameter Id="microsoft.com" DataType="string" Value="0213308f-17cb-4398-b97e-01da7bd4804e" />
    <InputParameter Id="test.com" DataType="string" Value="c7026f88-4299-4cdb-965d-3f166464b8a9" />
    <InputParameter Id="errorOnFailedLookup" DataType="boolean" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="domainAppId" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputParameterId**: live.com
- Input parameters:
    - **contoso.com**: 13c15f79-8fb1-4e29-a6c9-be0d36ff19f1
    - **microsoft.com**: 0213308f-17cb-4398-b97e-01da7bd4804e
    - **test.com**: c7026f88-4299-4cdb-965d-3f166464b8a9
    - **errorOnFailedLookup**: true
- Error:
    - No match found for the input claim value in the list of input parameter ids and errorOnFailedLookup is true.


## NullClaim

Clean the value of a given claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| OutputClaim | claim_to_null | string | The claim's value is set to NULL. |

Use this claim transformation to remove unnecessary data from the claims property bag so the session cookie will be smaller. The following example removes the value of the `TermsOfService` claim type.

```XML
<ClaimsTransformation Id="SetTOSToNull" TransformationMethod="NullClaim">
  <OutputClaims>
  <OutputClaim ClaimTypeReferenceId="TermsOfService" TransformationClaimType="claim_to_null" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
    - **outputClaim**: Welcome to Contoso App. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions...
- Output claims:
    - **outputClaim**: NULL

## ParseDomain

Gets the domain portion of an email address.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | emailAddress | string | The ClaimType that contains the email address. |
| OutputClaim | domain | string | The ClaimType that is produced after this claims transformation has been invoked - the domain. |

Use this claims transformation to parse the domain name after the @ symbol of the user. The following claims transformation demonstrates how to parse the domain name from an **email** claim.

```XML
<ClaimsTransformation Id="SetDomainName" TransformationMethod="ParseDomain">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="emailAddress" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="domainName" TransformationClaimType="domain" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **emailAddress**: joe@outlook.com
- Output claims:
    - **domain**: outlook.com

## SetClaimsIfRegexMatch

Checks that a string claim `claimToMatch` and `matchTo` input parameter are equal, and sets the output claims with the value present in `outputClaimIfMatched` input parameter, along with  compare result output claim, which is to be set as `true` or `false` based on the result of comparison.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | claimToMatch | string | The claim type, which is to be compared. |
| InputParameter | matchTo | string | The regular expression to match. |
| InputParameter | outputClaimIfMatched | string | The value to be set if strings are equal. |
| InputParameter | extractGroups | boolean | [Optional] Specifies whether the Regex match should extract groups values. Possible values: `true`, or `false` (default). | 
| OutputClaim | outputClaim | string | If regular expression is match, this output claim contains the value of `outputClaimIfMatched` input parameter. Or null, if no match. |
| OutputClaim | regexCompareResultClaim | boolean | The regular expression match result output claim type, which is to be set as `true` or `false` based on the result of matching. |
| OutputClaim| The name of the claim| string | If the extractGroups input parameter set to true, list of claim types that are produced after this claims transformation has been invoked. The name of the claimType must match the Regex group name. | 

### Example 1

Checks whether the provided phone number is valid, based on phone number regular expression pattern.

```XML
<ClaimsTransformation Id="SetIsPhoneRegex" TransformationMethod="SetClaimsIfRegexMatch">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="phone" TransformationClaimType="claimToMatch" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="matchTo" DataType="string" Value="^[0-9]{4,16}$" />
    <InputParameter Id="outputClaimIfMatched" DataType="string" Value="isPhone" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="validationResult" TransformationClaimType="outputClaim" />
    <OutputClaim ClaimTypeReferenceId="isPhoneBoolean" TransformationClaimType="regexCompareResultClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
    - **claimToMatch**: "64854114520"
- Input parameters:
    - **matchTo**: "^[0-9]{4,16}$"
    - **outputClaimIfMatched**:  "isPhone"
- Output claims:
    - **outputClaim**: "isPhone"
    - **regexCompareResultClaim**: true

### Example 2

Checks whether the provided email address is valid, and return the email alias.

```XML
<ClaimsTransformation Id="GetAliasFromEmail" TransformationMethod="SetClaimsIfRegexMatch">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="claimToMatch" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="matchTo" DataType="string" Value="(?&lt;mailAlias&gt;.*)@(.*)$" />
    <InputParameter Id="outputClaimIfMatched" DataType="string" Value="isEmail" />
    <InputParameter Id="extractGroups" DataType="boolean" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="validationResult" TransformationClaimType="outputClaim" />
    <OutputClaim ClaimTypeReferenceId="isEmailString" TransformationClaimType="regexCompareResultClaim" />
    <OutputClaim ClaimTypeReferenceId="mailAlias" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
    - **claimToMatch**: "emily@contoso.com"
- Input parameters:
    - **matchTo**: `(?&lt;mailAlias&gt;.*)@(.*)$`
    - **outputClaimIfMatched**:  "isEmail"
    - **extractGroups**: true
- Output claims:
    - **outputClaim**: "isEmail"
    - **regexCompareResultClaim**: true
    - **mailAlias**: emily
    
## SetClaimsIfStringsAreEqual

Checks that a string claim and `matchTo` input parameter are equal, and sets the output claims with the value present in `stringMatchMsg` and `stringMatchMsgCode` input parameters, along with  compare result output claim, which is to be set as `true` or `false` based on the result of comparison.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | The claim type, which is to be compared. |
| InputParameter | matchTo | string | The string to be compared with `inputClaim`. |
| InputParameter | stringComparison | string | Possible values: `Ordinal` or `OrdinalIgnoreCase`. |
| InputParameter | stringMatchMsg | string | First value to be set if strings are equal. |
| InputParameter | stringMatchMsgCode | string | Second value to be set if strings are equal. |
| OutputClaim | outputClaim1 | string | If strings are equals, this output claim contains the value of `stringMatchMsg` input parameter. |
| OutputClaim | outputClaim2 | string | If strings are equals, this output claim contains the value of `stringMatchMsgCode` input parameter. |
| OutputClaim | stringCompareResultClaim | boolean | The compare result output claim type, which is to be set as `true` or `false` based on the result of comparison. |

You can use this claims transformation to check if a claim is equal to value you specified. For example, the following claims transformation checks if the value of the **termsOfUseConsentVersion** claim is equal to `v1`. If yes, change the value to `v2`.

```XML
<ClaimsTransformation Id="CheckTheTOS" TransformationMethod="SetClaimsIfStringsAreEqual">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="termsOfUseConsentVersion" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="matchTo" DataType="string" Value="v1" />
    <InputParameter Id="stringComparison" DataType="string" Value="ordinalIgnoreCase" />
    <InputParameter Id="stringMatchMsg" DataType="string" Value="B2C_V1_90005" />
    <InputParameter Id="stringMatchMsgCode" DataType="string" Value="The TOS is upgraded to v2" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentVersion" TransformationClaimType="outputClaim1" />
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentVersionUpgradeCode" TransformationClaimType="outputClaim2" />
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentVersionUpgradeResult" TransformationClaimType="stringCompareResultClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
### Example

- Input claims:
    - **inputClaim**: v1
- Input parameters:
    - **matchTo**: V1
    - **stringComparison**: ordinalIgnoreCase
    - **stringMatchMsg**:  B2C_V1_90005
    - **stringMatchMsgCode**:  The TOS is upgraded to v2
- Output claims:
    - **outputClaim1**: B2C_V1_90005
    - **outputClaim2**: The TOS is upgraded to v2
    - **stringCompareResultClaim**: true

## SetClaimsIfStringsMatch

Checks that a string claim and `matchTo` input parameter are equal, and sets the output claims with the value present in `outputClaimIfMatched` input parameter, along with  compare result output claim, which is to be set as `true` or `false` based on the result of comparison.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | claimToMatch | string | The claim type, which is to be compared. |
| InputParameter | matchTo | string | The string to be compared with inputClaim. |
| InputParameter | stringComparison | string | Possible values: `Ordinal` or `OrdinalIgnoreCase`. |
| InputParameter | outputClaimIfMatched | string | The value to be set if strings are equal. |
| OutputClaim | outputClaim | string | If strings are equals, this output claim contains the value of `outputClaimIfMatched` input parameter. Or null, if the strings aren't match. |
| OutputClaim | stringCompareResultClaim | boolean | The compare result output claim type, which is to be set as `true` or `false` based on the result of comparison. |

For example, the following claims transformation checks if the value of **ageGroup** claim is equal to `Minor`. If yes, return the value to `B2C_V1_90001`.

```XML
<ClaimsTransformation Id="SetIsMinor" TransformationMethod="SetClaimsIfStringsMatch">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="ageGroup" TransformationClaimType="claimToMatch" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="matchTo" DataType="string" Value="Minor" />
    <InputParameter Id="stringComparison" DataType="string" Value="ordinalIgnoreCase" />
    <InputParameter Id="outputClaimIfMatched" DataType="string" Value="B2C_V1_90001" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isMinor" TransformationClaimType="outputClaim" />
    <OutputClaim ClaimTypeReferenceId="isMinorResponseCode" TransformationClaimType="stringCompareResultClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **claimToMatch**: Minor
- Input parameters:
    - **matchTo**: Minor
    - **stringComparison**: ordinalIgnoreCase
    - **outputClaimIfMatched**:  B2C_V1_90001
- Output claims:
    - **isMinorResponseCode**: B2C_V1_90001
    - **isMinor**: true


## StringContains

Determine whether a specified substring occurs within the input claim. The result is a new boolean ClaimType with a value of `true` or `false`. `true` if the value parameter occurs within this string,  otherwise, `false`.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | The claim type, which is to be searched. |
|InputParameter|contains|string|The value to search.|
|InputParameter|ignoreCase|string|Specifies whether this comparison should ignore the case of the string being compared.|
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. A boolean indicator if the substring occurs within the input claim. |

Use this claims transformation to check if a string claim type contains a substring. Following example, checks whether the `roles` string claim type contains the value of **admin**.

```XML
<ClaimsTransformation Id="CheckIsAdmin" TransformationMethod="StringContains">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="roles" TransformationClaimType="inputClaim"/>
  </InputClaims>
  <InputParameters>
    <InputParameter  Id="contains" DataType="string" Value="admin"/>
    <InputParameter  Id="ignoreCase" DataType="string" Value="true"/>
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isAdmin" TransformationClaimType="outputClaim"/>
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputClaim**: "Admin, Approver, Editor"
- Input parameters:
    - **contains**: "admin,"
    - **ignoreCase**: true
- Output claims:
    - **outputClaim**: true

## StringSubstring

Extracts parts of a string claim type, beginning at the character at the specified position, and returns the specified number of characters.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | The claim type, which contains the string. |
| InputParameter | startIndex | int | The zero-based starting character position of a substring in this instance. |
| InputParameter | length | int | The number of characters in the substring. |
| OutputClaim | outputClaim | boolean | A string that is equivalent to the substring of length that begins at startIndex in this instance, or Empty if startIndex is equal to the length of this instance and length is zero. |

For example, get the phone number country/region prefix.


```XML
<ClaimsTransformation Id="GetPhonePrefix" TransformationMethod="StringSubstring">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="phoneNumber" TransformationClaimType="inputClaim" />
  </InputClaims>
<InputParameters>
  <InputParameter Id="startIndex" DataType="int" Value="0" />
  <InputParameter Id="length" DataType="int" Value="2" />
</InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="phonePrefix" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
### Example

- Input claims:
    - **inputClaim**: "+1644114520"
- Input parameters:
    - **startIndex**: 0
    - **length**:  2
- Output claims:
    - **outputClaim**: "+1"

## StringReplace

Searches a claim type string for a specified value, and returns a new claim type string in which all occurrences of a specified string in the current string are replaced with another specified string.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | The claim type, which contains the string. |
| InputParameter | oldValue | string | The string to be searched. |
| InputParameter | newValue | string | The string to replace all occurrences of `oldValue` |
| OutputClaim | outputClaim | boolean | A string that is equivalent to the current string except that all instances of oldValue are replaced with newValue. If oldValue is not found in the current instance, the method returns the current instance unchanged. |

For example, normalize a phone number, by removing the `-` characters


```XML
<ClaimsTransformation Id="NormalizePhoneNumber" TransformationMethod="StringReplace">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="phoneNumber" TransformationClaimType="inputClaim" />
  </InputClaims>
<InputParameters>
  <InputParameter Id="oldValue" DataType="string" Value="-" />
  <InputParameter Id="newValue" DataType="string" Value="" />
</InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="phoneNumber" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
### Example

- Input claims:
    - **inputClaim**: "+164-411-452-054"
- Input parameters:
    - **oldValue**: "-"
    - **length**:  ""
- Output claims:
    - **outputClaim**: "+164411452054"

## StringJoin

Concatenates the elements of a specified string collection claim type, using the specified separator between each element or member.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | stringCollection | A collection that contains the strings to concatenate. |
| InputParameter | delimiter | string | The string to use as a separator, such as comma `,`. |
| OutputClaim | outputClaim | string | A string that consists of the members of the `inputClaim` string collection, delimited by the `delimiter` input parameter. |

The following example takes a string collection of user roles, and converts it to a comma delimiter string. You can use this method to store a string collection in Azure AD user account. Later, when you read the account from the directory, use the `StringSplit` to convert the comma delimiter string back to string collection.

```XML
<ClaimsTransformation Id="ConvertRolesStringCollectionToCommaDelimiterString" TransformationMethod="StringJoin">
  <InputClaims>
   <InputClaim ClaimTypeReferenceId="roles" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter DataType="string" Id="delimiter" Value="," />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="rolesCommaDelimiterConverted" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **inputClaim**: [ "Admin", "Author", "Reader" ]
- Input parameters:
  - **delimiter**: ","
- Output claims:
  - **outputClaim**: "Admin,Author,Reader"


## StringSplit

Returns a string array that contains the substrings in this instance that are delimited by elements of a specified string.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | A string claim type that contains the sub strings to split. |
| InputParameter | delimiter | string | The string to use as a separator, such as comma `,`. |
| OutputClaim | outputClaim | stringCollection | A string collection whose elements contain the substrings in this string that are delimited by the `delimiter` input parameter. |

The following example takes a comma delimiter string of user roles, and converts it to a string collection.

```XML
<ClaimsTransformation Id="ConvertRolesToStringCollection" TransformationMethod="StringSplit">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="rolesCommaDelimiter" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
  <InputParameter DataType="string" Id="delimiter" Value="," />
    </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="roles" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **inputClaim**: "Admin,Author,Reader"
- Input parameters:
  - **delimiter**: ","
- Output claims:
  - **outputClaim**: [ "Admin", "Author", "Reader" ]

## String claim transformations expressions
Claim transformations expressions in Azure AD B2C custom policies provide context information about the tenant ID and technical profile ID.

  | Expression | Description | Example |
 | ----- | ----------- | --------|
 | `{TechnicalProfileId}` | The technical profileId name. | Facebook-OAUTH |
 | `{RelyingPartyTenantId}` | The tenant ID of the relying party policy. | your-tenant.onmicrosoft.com |
 | `{TrustFrameworkTenantId}` | The tenant ID of the trust framework. | your-tenant.onmicrosoft.com |
