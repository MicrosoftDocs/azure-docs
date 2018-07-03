---
title: Claims Transformations using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Learn how to use Claims Transformations within custom policies in Azure AD B2C.
services: active-directory-b2c
author: whippsp
manager: 

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 07/03/2018
ms.author: whippsp
ms.component: B2C
---

# Azure AD B2C: Claims Transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

<a name="top"></a>

This article describes how to configure and use Claims transformations within Azure AD B2C Policies.

## Overview

There are two types of Claims transformations. The first will return a claim based on certain logic. The other will throw an error based on the logic provided.

## How does it work?

Claims Transformations are located within the BuildingBlocks section of a cusotm Azure AD B2C Policy. They are then referenced by either InputClaimsTransformations or OutputClaimsTransformations.

Input Claims Transformations should be put before the InputClaims element in a custom policy.
```XML
<InputClaimsTransformations>
  <InputClaimsTransformation ReferenceId="CreateOtherMailsFromEmail" />
</InputClaimsTransformations>
```

Output Claims Transformations should be put after the OutClaims element in a custom policy.
```XML
<OutputClaimsTransformations>
  <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromObjectID" />
</OutputClaimsTransformations>
```
The *ReferenceId* attribute as shown above will point to the *Id* attribute of the ClaimsTransformaiton

Azure AD B2C has defined a number of Claims Transformations, however you can also create your own. The format for Claims transformatin should be

```XML
<ClaimsTransformation Id="[Name of the transformation in your policy]" TransformationMethod="[Type of transformation]">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="[Claim name in your policy schema]" TransformationClaimType="[Claim name in the transformation]" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="[Parameter name in the transformation]" DataType="[Some primitive type]" Value="[The value of the parameter]" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="[Claim name in your policy schema]" TransformationClaimType="Claim name in the transformation]" />
  </OutputClaims>
</ClaimsTransformation>
```

The table below and subsequent section outline a list of Claims Trasnformation Methods available:


| Method | Type | Description |
| --- | --- | --- |
| [AddItemToStringCollection](#AddItemToStringCollection) | Claims |  Adds a single value claim to a collection based claim. |
| [GetSingleItemFromStringCollection](#GetSingleItemFromStringCollection) | Claims | Gets a single claim from a Collection based claim.  |
| [AssertBooleanClaimIsEqualToValue](#AssertBooleanClaimIsEqualToValue)  | Assert | Compare two claims, and throws an exception if they are not equal according to the specified comparison  |
| [CreateRandomString](#CreateRandomString) | Claims | Creates a random string using the random number generator used |
| [FormatStringClaim](#FormatStringClaim) | Claims | Format a given claim according to the provided format string. |
| [CreateStringClaim](#CreateStringClaim) | Claims | Creates a string claim from a specified string value. |
| [CreateAlternativeSecurityId](#CreateAlternativeSecurityId) | Claims |Creates a JSON representation of the user’s alternativeSecurityId property that can be used in calls to Graph API  |
| [FormatStringMultipleClaims](#FormatStringMultipleClaims) | Claims | Used to combine two claims according to the provided format string. |
| [AssertStringClaimsAreEqual](#AssertStringClaimsAreEqual) | Assert | Compares two claims according to the specifieds comparison paramaater and throws an error if they are not the same  |
| [AssertDateTimeIsGreaterThan](#AssertDateTimeIsGreaterThan) | Assert | Compares two date claims and throws an exception if one is greater than the other. |
| [ConvertNumberToStringClaim](#ConvertNumberToStringClaim) | Claims | Converts a number based claim to a string based claim.  |
| [GetClaimFromJSON](#GetClaimFromJSON)| Claims | Extracts a claim from a json objects key value pairs.   |
| [Hash](#Hash)| Claims | Creates a Hash of a plain text claim using the supplied salt and secret.  |
| [AddParameterToStringCollection](#AddParameterToStringCollection) | Claims | Add the provided string parameter to a claim that contains collection of strings |
| [ChangeCase](#ChangeCase)| Claims | Converts a claims value to either upper case or lower case. |
| [NullClaim](#NullClaim)| Claims | Removes a value from a claim. |
| [CompareClaimToValue](#CompareClaimToValue) | Claims | Compares a claims value to a static value and then returns a True or False. |
| [CompareClaims](#CompareClaims) | Claims | Compares two claims and then returns a True or False if they are the same or not. |
| [CreateRandomString](#CreateRandomString) | Claims | Creates a random GUID or integer and returns it to a String Claim. |
| [GetAgeGroupAndConsentProvided](#GetAgeGroupAndConsentProvided) | Claims | Takes a Date of Birth, Country code and if consent is provided fro Minors and returns and age group, if consent is required by regulations (eg GDPR)   |
| [SetClaimsIfStringsMatch](#SetClaimsIfStringsMatch) | Claims | Sets a string claim to a static value and a boolean identifying if the input cliam matched a static value. |
| [GetMappedValueFromLocalizedCollection](#GetMappedValueFromLocalizedCollection) | Claims | Returns the value from a claims restriction enumeration based off the text value passed in from a claim. |
| [DoesClaimExist](#DoesClaimExist)| Claims |  Returns a boolean value depending on if the claim has a value or not.  |
| [GetCurrentDateTime](#GetCurrentDateTime)| Claims | Returns an output claim of type DateTime with the current date and time.  |
| [IsTermsOfUseConsentRequired](#IsTermsOfUseConsentRequired) | Claims | Returns True or False depending on if the input claims datetime value is less than the provided statis datetime value |


For more information on Claims transformation please see 
[Features Part 6 - Claims Transformaitons](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/blob/master/Documentation/Features%20part%206.md#specifying-the-claims-transformation)


---

# Claims Transformation Method Examples



### AddItemToStringCollection

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetSingleItemFromStringCollection

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. 


| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 




```XML
<ClaimsTransformation Id="CreateEmailFromOtherMails" TransformationMethod="GetSingleItemFromStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="extractedItem" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### AssertBooleanClaimIsEqualToValue

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. 

```XML
<ClaimsTransformation Id="AssertAccountEnabledIsTrue" TransformationMethod="AssertBooleanClaimIsEqualToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="accountEnabled" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="valueToCompareTo" DataType="boolean" Value="true" />
  </InputParameters>
</ClaimsTransformation>
```
---
### CreateRandomString

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### FormatStringClaim

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CreateStringClaim

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CreateAlternativeSecurityId

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### AssertStringClaimsAreEqual

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### AssertDateTimeIsGreaterThan

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### ConvertNumberToStringClaim

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

<div style="text-align: right"><a href="#top">To Top</a></div>

---
### GetClaimFromJSON

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### Hash

The Hash claims transformation provides the ability to create an output claim which is the hash of an input claim. Salt must be added using a second input claim and an input parameter.  The input parameter must be the name of a secret key belonging to the tenant so that publication of the policy doesn’t allow an attacker to predict the value of the hash by virtue of knowing the input claims.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | plaintext (String) | A string claim to create a hash from. |
| | salt (string) | The Salt Claim to use |
| **Input Paramaters** | randomizerSecret (string) | A Secret value used for randomization. 
| **Output Claims** | hash (string) | The output claim as a hash | 

The example below defines a ClaimsTransformation of the ‘Hash’ type called ‘HashPasswordWithUserId’. A claim called ‘password’ in the policy schema is hashed using a claim called ‘userId’ as salt. Because the hash is salted this way, two users with different userIds but the same password always end up with different hashes. This makes it impossible for an evil insider to insert the hash of a password he knows into another user’s record and successfully log in as the second user.

```xml
<ClaimsTransformation Id="HashPasswordWithUserId" TransformationMethod="Hash">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="password" TransformationClaimType="plaintext" />
    <InputClaim ClaimTypeReferenceId="userId" TransformationClaimType="salt" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="randomizerSecret" DataType="string" Value="B2C_1A_randomizerSecret" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="hashedPassword" TransformationClaimType="hash" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### ChangeCase

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### NullClaim

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CompareClaimToValue

A CompareClaimToValue claims transformation compares a claim defined in the policy schema to a fixed value expressed in a ‘CompareTo’ parameter that is part of its policy definition.  Other parameters control whether the comparison should be case sensitive and whether to test for equality or inequality.  The result of the comparison is returned as a Boolean claim..

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim1 (String) | A single value claim to compare the value of |
| **Input Paramaters** | compareTo (string) | The static string value to compare to |
|| ignoreCase(string) | A string of either "true" or "false" to determine if case is compared |
|| operator(string) | Either ‘EQUAL’ or ‘NOT EQUAL’
| **Output Claims** | outputClaim (boolean) | The boolean result of the comparison | 

The example below defines a ClaimsTransformation of the 'CompareClaimToValue' type called ‘isFaceBookUser’. A claim called ‘identityProvider’ in the policy Schema  is compared to a ‘compareTo’ parameter configured to be ‘facebook.com’.  The comparison will not be case-sensitive.  If the input claim equals the configured parameter, the transform will return a Boolean claim called ‘facebookuser’ with the string value ‘true’;  otherwise it returns ‘false’

```XML
<ClaimsTransformation Id="isFaceBookUser" TransformationMethod="CompareClaimToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="identityProvider" TransformationClaimType="inputClaim1" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="compareTo" DataType="string" Value="facebook.com" />
    <InputParameter Id="ignoreCase" DataType="string" Value="true" />
    <InputParameter Id="operator" DataType="string" Value="EQUAL" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="facebookuser" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CompareClaims

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetAgeGroupAndConsentProvided

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### SetClaimsIfStringsMatch

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetMappedValueFromLocalizedCollection

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### DoesClaimExist

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetCurrentDateTime

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### IsTermsOfUseConsentRequired

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A single value claim to add to the collection |
| | collection (stringCollection) | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (stringCollection) | The collection claim to output to | 



```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```



## Next steps

We love feedback and suggestions! If you have any difficulties with this topic, post on Stack Overflow using the tag ['azure-ad-b2c'](https://stackoverflow.com/questions/tagged/azure-ad-b2c). For feature requests, vote for them in our [feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c).
