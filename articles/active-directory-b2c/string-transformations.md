---
title: String claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C  | Microsoft Docs
description: String claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/16/2018
ms.author: davidmu
ms.component: B2C
---

# String claims transformations

This article provides examples for using the string claims transformations of the Identity Experience Framework  schema in Azure Active Directory (Azure AD) B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## AssertStringClaimsAreEqual 

Compare two claims, and throw an exception if they are not equal according to the specified comparison inputClaim1 (String) stringComparison [ordinal, ordinalIgnoreCase].

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | inputClaim1 | string | First claim's type, which is to be compared. |
| inputClaim | inputClaim2 | string | Second claim's type, which is to be compared. |
| InputParameter | stringComparison | string | string comparison, one of the values: Ordinal, OrdinalIgnoreCase. |

You can use this claims transformation to make sure, two ClaimTypes have the same value. If not, an error message is thrown. The following example checks that the `strongAuthenticationEmailAddress` ClaimType is equal to email ClaimType. Otherwise an error message is thrown.

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
### Example

- Input claims:
    - **inputClaim1**: someone@contoso.com
    - **inputClaim2**: someone@outlook.com
    - **stringComparison**:  ordinalIgnoreCase
- Result: Error thrown

## ChangeCase 

Changes the case of the provided claim to lower or upper case depending on the operator.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | string | The ClaimType that be changed. |
| InputParameter | toCase | string | One of the following values: `LOWER` or `UPPER`. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

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
- Output claims:
    - **email**: someone@contoso.com

## CreateStringClaim 

Creates a string claim from the provided input parameter in the policy.

| Item | TransformationClaimType | Data Type | Notes |
|----- | ----------------------- | --------- | ----- |
| InputParameter | value | string | The ClaimType that specifies the social account ID (key). |
| OutputClaim | createdClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to set a string ClaimType value.

```XML
<ClaimsTransformation Id="CreateTermsOfService" TransformationMethod="CreateStringClaim">
<InputParameters>
  <InputParameter Id="value" DataType="string" Value="Contoso terms of service..." />
</InputParameters>
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="TOS" TransformationClaimType="createdClaim" />
</OutputClaims
```

### Example

- Input parameter:
    - **value**: Contoso terms of service...
- Output claims:
    - **createdClaim**: The TOS ClaimType contains the "Contoso terms of service..." value.

## CompareClaims

Determines whether a claim value is equal to the input claim value.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | inputClaim1 | string | First claim's type, which is to be compared. |
| inputClaim | inputClaim2 | string | Second claim's type, which is to be compared. |
| InputParameter | operator | string | One of the values: `Equal` or `Not Equal` OrdinalIgnoreCase. |
| InputParameter | ignoreCase | boolean | `true` or `false` |
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to check if a claim is equal to another claim. For example, the following claims transformation checks if the value of the `Email` claim is equal to the `Verified.Email` claim.

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
    - **stringComparison**:  ordinalIgnoreCase
- Result: Error thrown

## CompareClaimToValue

Determines whether a claim value is equal to the input parameter value.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | inputClaim1 | string | The claim's type, which is to be compared. |
| InputParameter | operator | string | One of the values: `Equal` or `Not Equal` OrdinalIgnoreCase. |
| InputParameter | compareTo | string | string comparison, one of the values: Ordinal, OrdinalIgnoreCase. |
| InputParameter | ignoreCase | boolean | `true` or `false` |
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

You can use this claims transformation to check if a claim is equal to a value you specified. For example, the following claims transformation checks if the value of `extension_termsOfUseConsentVersion` claim is equal to `v1`.

```XML
<ClaimsTransformation Id="IsTermsOfUseConsentRequiredForVersion" TransformationMethod="CompareClaimToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="inputClaim1" />
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
    - **compareTo**: V2
    - **operator**: not equal 
    - **ignoreCase**:  true
- Output claims:
    - **outputClaim**: true

## CreateRandomString

Creates a random string using the random number generator. If the random number generator is of type “integer”, optionally a seed parameter and a maximum number may be provided. An optional string format parameter allows the output to be formatted using it, and an optional base64 parameter specifies whether the output is base64 encoded randomGeneratorType [guid, integer] outputClaim (String).

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputParameter | randomGeneratorType | string | Specifies the random value to be generated, GUID (global unique ID) or Integer (a number). |
| InputParameter | stringFormat | string | [Optional] Format the random value. |
| InputParameter | base64 | boolean | [Optional] Convert the random value to base64. If string format is applied, the value after string format is encoded to base64. |
| InputParameter | maximumNumber | int | [Optional] For `Integer` randomGeneratorType only. Specify the maximute number. |
| InputParameter | seed  | int | [Optional] For `Integer` randomGeneratorType only. Specify the seed for the random value. Note: same seed yields same sequence of random numbers. |
| OutputClaim | outputClaim | string | The ClaimTypes that will be produced after this ClaimsTransformation has been invoked. The first random value. |

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

- Input claims:
    - **randomGeneratorType**: GUID
- Output claims: 
    - **outputClaim**: bc8bedd2-aaa3-411e-bdee-2f1810b73dfc

Following example generates an integer random value between 0 and 1000. The value is formatted to OTP_{random value}.

```XML
<ClaimsTransformation Id="SetRandomNumber" TransformationMethod="CreateRandomString">
  <InputParameters>
    <InputParameter Id="randomGeneratorType" DataType="string" Value="integer" />
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

- Input claims:
    - **randomGeneratorType**: integer
    - **maximumNumber**: 1000
    - **stringFormat**: OTP_{0}
    - **base64**: false
- Output claims: 
    - **outputClaim**: OTP_853


## FormatStringClaim

Format a claim according to the provided format string. This transformation uses the C# **String.Format** method.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |string |The ClaimType that acts as string format {0} parameter. |
| InputParameter | stringFormat | string | The string format, including the {0} and {1} parameters. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to format any string with one parameter {0}. The following XML example creates a `userPrincipalName`. All social identity provider technical profiles, such as `Facebook-OAUTH` calls the `CreateUserPrincipalName` to generate a `userPrincipalName`.   

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
- Output claims:
    - **outputClaim**: cpim_5164db16-3eee-4629-bfda-dcc3326790e9@b2cdemo.onmicrosoft.com

## FormatStringMultipleClaims

Format a claim according to the provided format string. This transformation uses the C# **String.Format** method.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |string | The ClaimType that acts as string format {0} parameter. |
| InputClaim | inputClaim | string | The ClaimType that acts as string format {1} parameter. |
| InputParameter | stringFormat | string | The string format, including the {0} and {1} parameters. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to format any string with two parameters, {0} and {1}. The following XML example creates an `exampleOutputClaim` with the specified format.

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
- Output claims:
    - **outputClaim**: Joe Fernando

## GetMappedValueFromLocalizedCollection

Looking up an item from a claim LocalizedCollection Restriction collection.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | mapFromClaim | string | The claim that contains the LocalizedCollection Restriction collection. |
| OutputClaim | inputParameterId | string | The ClaimTypes that will be produced after this ClaimsTransformation has been invoked. The value of the matching key. |

The following example looks up the error message description based on the error key. The `responseMsg` claim contains a collection of error messages to present to the end user or to be sent to the relying party.

```XML
<ClaimType Id="responseMsg">
  <DisplayName>Error message: </DisplayName>
  <DataType>string</DataType>
  <UserInputType>Paragraph</UserInputType>
  <Restriction>
    <Enumeration Text="B2C_V1_90001" Value="You cant sign in because you are a minor" />
    <Enumeration Text="B2C_V1_90002" Value="This action can only be performed by gold members" />
    <Enumeration Text="B2C_V1_90003" Value="You have not been enabled for this operation" />
  </Restriction>
</ClaimType>
```
The claims transformation looks up the item `Text` and returns its `Value`. If the  `<Restriction>` is localized, using `<LocalizedCollection>`, the claims transformation returns the localized value.

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
    - **restrictionValueClaim**: You cant sign in because you are a minor.

## LookupValue

Look up a claim value from a list of values based on the value of another claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputParameterId | string | The claim that contains the lookup value |
| InputParameter | |string | Collection of inputParameters. |
| InputParameter | errorOnFailedLookup | boolean | Controlling whether an error is returned when no matching lookup. |
| OutputClaim | inputParameterId | string | The ClaimTypes that will be produced after this ClaimsTransformation has been invoked. The value of the matching Id. |

The following example looks up the domain name in one of the inpuParameters collections. The claims transformation looks up the domain name in the `Id` and returns its `value` (an application ID).

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
    - **contoso.com**: 13c15f79-8fb1-4e29-a6c9-be0d36ff19f1
    - **microsoft.com**: 0213308f-17cb-4398-b97e-01da7bd4804e
    - **test.com**: c7026f88-4299-4cdb-965d-3f166464b8a9
    - **errorOnFailedLookup**: false
- Output claims:
    - **outputClaim**:	c7026f88-4299-4cdb-965d-3f166464b8a9

## ParseDomain

Gets the domain portion of an email address.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string | The ClaimType that acts as the email address parameter. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked - the domain. |

Use this claims transformation to parse the domain name after the @ symbol of the user. This can be helpful in removing Personally identifiable information (PII) from audit data. The following claims transformation demonstrates how to parse the domain name from an 'email' claim.

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
    - **inputClaim1**: joe@outlook.com
- Output claims:
    - **outputClaim**: outlook.com

## SetClaimsIfStringsAreEqual

Checks that string values of two claims are equal, and sets the output claim with the value present in InputParameter if they are not.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | inputClaim | string | The claim type, which is to be compared. |
| InputParameter | matchTo | string | The string to be compared with inputClaim. |
| InputParameter | stringComparison | string | One of the values: `Ordinal` or `OrdinalIgnoreCase`. |
| InputParameter | stringMatchMsg | string | First value to be set if strings are equal. |
| InputParameter | stringMatchMsgCode | string | Second value to be set if strings are equal. |
| OutputClaim | outputClaim1 | string | If strings are equals, this output claim contains the value of `stringMatchMsg` input parameter. |
| OutputClaim | outputClaim2 | string | If strings are equals, this output claim contains the value of `stringMatchMsgCode` input parameter. |
| OutputClaim | stringCompareResultClaim | boolean | The compare Result output claim's type, which is to be set as `true` or `false` based on the result of comparison. |

You can use this claims transformation to check if a claim is equal to value you specified. For example, the following claims transformation checks if the value of the `extension_termsOfUseConsentVersion` claim is equal to `v1`. If yes, change the value to `v2`. 

```XML
<ClaimsTransformation Id="CheckTheTOS" TransformationMethod="SetClaimsIfStringsAreEqual">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="matchTo" DataType="string" Value="v1" />
    <InputParameter Id="stringComparison" DataType="string" Value="ordinalIgnoreCase" />
    <InputParameter Id="stringMatchMsg" DataType="string" Value="v2" />
    <InputParameter Id="stringMatchMsgCode" DataType="string" Value="The TOS is upgraded to v2" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="outputClaim1" />
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentVersionUpgradeCode" TransformationClaimType="outputClaim2" />
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentVersionUpgradeResult" TransformationClaimType="stringCompareResultClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
### Example

- Input claims:
    - **inputClaim**: v1
    - **matchTo**: v1
    - **stringComparison**: ordinalIgnoreCase 
    - **stringMatchMsg**:  v2
    - **stringMatchMsgCode**:  The TOS is upgraded to v2
- Output claims:
    - **outputClaim1**: v2
    - **outputClaim2**: The TOS is upgraded to v2
    - **stringCompareResultClaim**: true

## SetClaimsIfStringsMatch

Checks that string values of two claims are equal, and sets output claim with value present in InputParameter if they are not.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| inputClaim | claimToMatch | string | The claim type, which is to be compared. |
| InputParameter | matchTo | string | The string to be compared with inputClaim. |
| InputParameter | stringComparison | string | One of the values: `Ordinal` or `OrdinalIgnoreCase`. |
| InputParameter | outputClaimIfMatched | string | First value to be set if strings are equal. |
| OutputClaim | outputClaim | string | If strings are equals, this output claim contains the value of `outputClaimIfMatched` input parameter. |
| OutputClaim | stringCompareResultClaim | boolean | The compare Result output claim's type, which is to be set as `true` or `false` based on the result of comparison. |

You can use this claims transformation to check if a user `ageGroup` is equal to the value you specified as `Minor`. For example, the following claims transformation checks if the value of `ageGroup` claim is equal to `Minor`. If yes, return the value to `B2C_V1_90001`. 

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
    - **matchTo**: Minor
    - **stringComparison**: ordinalIgnoreCase 
    - **outputClaimIfMatched**:  B2C_V1_90001
- Output claims:
    - **isMinor**: B2C_V1_90001
    - **isMinorResponseCode**: true

- Input claims:
    - **claimToMatch**: Empty string
    - **matchTo**: Minor
    - **stringComparison**: ordinalIgnoreCase 
    - **outputClaimIfMatched**:  B2C_V1_90001
- Output claims:
    - **isMinor**: NULL
    - **isMinorResponseCode**: false

