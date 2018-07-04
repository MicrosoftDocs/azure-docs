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
| [AddItemToStringCollection](#additemtostringcollection) | Claims |  Adds a single value claim to a collection based claim. |
| [AddParameterToStringCollection](#addparametertostringcollection) | Claims | Add the provided string parameter to a claim that contains collection of strings |
| [AndClaims](#andclaims) | Claims | Produces a boolean claim based on the result of two Boolean claim inputs. |
| [AssertBooleanClaimIsEqualToValue](#assertbooleanclaimisequaltovalue)  | Assert | Compare two claims, and throws an exception if they are not equal according to the specified comparison  |
| [AssertDateTimeIsGreaterThan](#assertdatetimeisgreaterthan) | Assert | Compares two date claims and throws an exception if one is greater than the other. |
| [AssertStringClaimsAreEqual](#assertstringclaimsareequal) | Assert | Compares two claims according to the specifieds comparison paramaater and throws an error if they are not the same  |
| [ChangeCase](#changecase)| Claims | Converts a claims value to either upper case or lower case. |
| [CompareClaimToValue](#compareclaimtovalue) | Claims | Compares a claims value to a static value and then returns a True or False. |
| [CompareClaims](#compareclaims) | Claims | Compares two claims and then returns a True or False if they are the same or not. |
| [ConvertNumberToStringClaim](#convertNumbertostringclaim) | Claims | Converts a number based claim to a string based claim.  |
| [CreateAlternativeSecurityId](#createalternativesecurityid) | Claims |Creates a JSON representation of the user’s alternativeSecurityId property that can be used in calls to Graph API  |
| [CreateRandomString](#createrandomstring) | Claims | Creates a random GUID or integer and returns it to a String Claim. |
| [CreateStringClaim](#createstringclaim) | Claims | Creates a string claim from a specified string value. |
| [DoesClaimExist](#doesclaimexist)| Claims |  Returns a boolean value depending on if the claim has a value or not.  |
| [FormatStringClaim](#formatstringclaim) | Claims | Format a given claim according to the provided format string. |
| [FormatStringMultipleClaims](#formatstringmultipleclaims) | Claims | Used to combine two claims according to the provided format string. |
| [GetAgeGroupAndConsentProvided](#getagegroupandconsentprovided) | Claims | Takes a Date of Birth, Country code and if consent is provided fro Minors and returns and age group, if consent is required by regulations (eg GDPR)   |
| [GetClaimFromJSON](#getclaimfromjson)| Claims | Extracts a claim from a json objects key value pairs.   |
| [GetCurrentDateTime](#getcurrentdatetime)| Claims | Returns an output claim of type DateTime with the current date and time.  |
| [GetMappedValueFromLocalizedCollection](#getmappedvaluefromlocalizedcollection) | Claims | Returns the value from a claims restriction enumeration based off the text value passed in from a claim. |
| [GetSingleItemFromStringCollection](#getsingleitemfromstringcollection) | Claims | Gets a single claim from a Collection based claim.  |
| [Hash](#hash)| Claims | Creates a Hash of a plain text claim using the supplied salt and secret.  |
| [IsTermsOfUseConsentRequired](#istermsofuseconsentrequired) | Claims | Returns True or False depending on if the input claims datetime value is less than the provided statis datetime value |
| [NullClaim](#nullclaim)| Claims | Removes a value from a claim. |
| [OrClaims](#orclaims) | Claims | Produces a boolean claim based on the ??? result of two Boolean claim inputs. |
| [SetClaimsIfStringsMatch](#setclaimsifstringsmatch) | Claims | Sets a string claim to a static value and a boolean identifying if the input cliam matched a static value. |


For more information on Claims transformation please see 
[Features Part 6 - Claims Transformaitons](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/blob/master/Documentation/Features%20part%206.md#specifying-the-claims-transformation)


---

# Claims Transformation Method Examples



### AddItemToStringCollection

The AddItemToStringCollection transformation adds a single string claims defined in the policy schema to a string collection claim also defined in the policy schema.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | item (String) | A singel valued claimd. |
| | collection (stringcollection) | A collection claim to add the claim to. |
| **Input Paramaters** | N/A | 
| **Output Claims** | outputClaim (stringcollection) | The collection claim with the new claim value added. | 

The example below defines a ClaimsTransformation of the ‘AddItemToStringCollection’ type called ‘CreateEmailsFromOtherMailsAndSignInNamesInfo’. A policy schema’s ‘signInNamesInfo.emailAddress’ claim will be added to the ‘otherMails’ claim. The result will be returned in the ‘emails’ claim from the policy schema.

```XML
<ClaimsTransformation Id="CreateEmailsFromOtherMailsAndSignInNamesInfo" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="signInNamesInfo.emailAddress" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="emails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetSingleItemFromStringCollection

The GetSingleItemFromStringCollection transformation will retrieves a single string claim from a string collection claim defined in the policy schema to a string.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | collection (stringcollection) | A string collection claim to extract a value from. |
| **Input Paramaters** | N/A | 
| **Output Claims** | extractedItem (string) | The extracted claim. | 

The example below defines a ClaimsTransformation of the ‘GetSingleItemFromStringCollection’ type called ‘CreateEmailFromOtherMails’. The first value from the policy schema’s ‘otherMails’ claim will be retrieved and saved to the  ‘email’ policy schema’svclaim. T.


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

The AssertBooleanClaimIsEqualToValue transformation will compare a Boolean claim from the policy schema to against the provided boolean value.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim (boolean) | A boolean claim to compare to. |
| **Input Paramaters** | valueToCompareTo (boolean) | The boolean value to compare the claim to. |
| **Output Claims** | N/A |  | 


The example below defines a ClaimsTransformation of the ‘AssertBooleanClaimIsEqualToValue’ type called ‘AssertAccountEnabledIsTrue’. The value from the policy schema’s ‘accountEnable’ claim will be compared to the boolean input paramater ‘valueToCompareTo’. If the claims are equal then the user will continue on the user journet. If the values are not equal an error will be thrown. 

>[!NOTE]
> This claim will throw an error value based on the  `UserMessageIfClaimsTransformationBooleanValueIsNotEqual` metadata item.

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

The CreateRandomString transformation will generate a random integer or GUID and store the result in an output cliam in the policy schema. Depending on the Generator type specified, a maximum value can be provided as well as a boolean to determine if the output value is base64 encoded or not.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | N/A  | |
| **Input Paramaters** | randomGeneratorType (string) | GUID or INTEGER | 
|| maximumNumber (int) | The maximim Number used when Type is INTEGER | 
|| base64 (boolean) | Determines if the output value is base64 encoded or not | 
|| stringFormat (string) | The output string format | 
|| seed (int) | A random Seed value to supply to the Generator | 
| **Output Claims** | outputClaim (string) | The collection claim to output to | 

The example below defines a ClaimsTransformation of the ‘CreateRandomString’ type called ‘CreateOTPCode’. A paramater called ‘randomGeneratorType’ determines that the transform will be an integer value. The Maximum value this integr can be will be 9999 as specified by the ‘maximumNumber’ paramater. The result will be returned in the ‘itpCOde’ claim from the policy schema and will not be base64 decoded .

```XML
 <ClaimsTransformation Id="CreateOTPCode" TransformationMethod="CreateRandomString">
  <InputParameters>
    <InputParameter Id="randomGeneratorType" DataType="string" Value="INTEGER" />
    <InputParameter Id="maximumNumber" DataType="int" Value="9999" />
    <InputParameter Id="base64" DataType="boolean" Value="false" />
    <InputParameter Id="stringFormat" DataType="string" Value="{0}" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otpCode" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### FormatStringClaim

The FormatStringClaim transformation formats a claim defined in the policy schema by using a format string defined as an input parameter.  The format string is applied using the .NET System.String Format method. The formatted claim is returned as the transformation’s output claim.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim (String) | The claim whose value is to be formatted |
| **Input Paramaters** | formatString (string) |A string in which ‘{0}’ will be replaced by the value of the claim being formatted| 
| **Output Claims** | outputClaim (string) | The formatted claim | 

The example below defines a ClaimsTransformation of the ‘FormatStringClaim’ type called ‘CreateUserPrincipalName’. A claim called ‘userId’ in the policy Schema is formatted using a format string in which {0} will be replaced the claim being formatted .  The result will be returned in the ‘userPrincipalName’ claim from the policy schema.

```XML
<ClaimsTransformation Id="CreateUserPrincipalName" TransformationMethod="FormatStringClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userId" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="stringFormat" DataType="string" Value="cpim_{0}@mydomain.com.au" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="userPrincipalName" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CreateStringClaim

The CreateStringClaim transformation will copy the value from the "value" input paramater to a claim defined in the policy schema.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | | |
| **Input Paramaters** | value (string) | A string value parmater to copy to the claim |
| **Output Claims** | outputClaim (string) | The destination claim | 

The example below defines a ClaimsTransformation of the ‘CreateStringClaim’ type called ‘CreateSubjectClaimFromObjectID’. A policy schema’s  ‘sub’ claim will be set to the value "Not supported currently. Use oid claim.".

```XML
<ClaimsTransformation Id="CreateSubjectClaimFromObjectID" TransformationMethod="CreateStringClaim">
  <InputParameters>
    <InputParameter Id="value" DataType="string" Value="Not supported currently. Use oid claim." />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="sub" TransformationClaimType="createdClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### FormatStringMultipleClaims

The FormatStringMultipleClaims transformation formats two claims defined in the policy schema by using a format string defined as an input parameter. The format string is applied using the .NET System.String Format method. The formatted result is returned as the transformation’s output claim.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim1 (String) | The first claim whose value is to be formatted |
| | inputClaim2 (string) | The second claim whose value is to be formatted |
| **Input Paramaters** | formatString (string) | A string in which ‘{0}’ will be replaced by the value of ‘inputClaim1’, and ‘{1}’ will be replaced by the value of ‘inputClaim2’ | 
| **Output Claims** | outputClaim (string) | The formatted claim | 

The example below defines a ClaimsTransformation of the ‘FormatStringMultipleClaims’ type called ‘CreateDisplayName’. A policy schema’s  ‘givenName’ and ‘surname’ claims are formatted using a format string in which ‘{0}’ will be replaced by ‘givenName’ and ‘{1}’ will be replaced by ‘surname’ . The result will be returned in the ‘displayName’ claim from the policy schema.

```XML
<ClaimsTransformation Id="CreateDisplayName" TransformationMethod="FormatStringMultipleClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="surname" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="formatString" DataType="string" Value="{0} {1}" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### CreateAlternativeSecurityId

A CreateAlternativeSecurityId transformation is used to create an ‘AlternativeSecurityId’ – a two-part identifier widely used in AAD and consisting of:
the name of an identity provider; and
a unique naming claim identifying objects within that identity provider’s namespace.
An example would be Microsoft Account (MSA) as an identity provider and ‘john@hotmail.com’ as a unique name (called a ‘key’) inside the MSA’s namespace.  Although its actual encoding would be different, one can think of it as being:
```
{
"identityProvider" : "MSA",
"key" : "john@hotmail.com"
"type" : 6
}
```
This construct is important because John might, for example, use his email address at Hotmail or Google as his account name at facebook…  The AlternativeSecurityIds would then distinguish the various accounts, since in the facebook case the AlternativeSecurityId can be thought of as:
```
{
"identityProvider" : "facebook",
"key" : "john@hotmail.com"
"type" : 6
}
```

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | key (String) | The unique account name within the identity provider’s namespace |
| | identityProvider (string) | The identity provider asserting an account name |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection (string) | The encoded alternativeSecurityId | 

The example below defines a ClaimsTransformation of the ‘CreateAlternativeSecurityId’ type called ‘CreateALternativeSecurityId’ . The policy schema’s ‘userId’ and ‘identityProvider’ claims are transformed into an encoded AlternativeSecurityId which is returned as alternativeSecurityId claim.

```XML
<ClaimsTransformation Id="CreateAlternativeSecurityId" TransformationMethod="CreateAlternativeSecurityId">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userId" TransformationClaimType="key" />
    <InputClaim ClaimTypeReferenceId="identityProvider" TransformationClaimType="identityProvider" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="alternativeSecurityId" TransformationClaimType="alternativeSecurityId" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### AssertStringClaimsAreEqual

The AssertStringClaimsAreEqual transformation will compare two string claim from the policy schema based on the string comparison type specified.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim1 (string) | A string claim to compare. |
|| inputClaim2 (string) | The string claim to compare to. |
| **Input Paramaters** | stringComparison (string) | The type of compare method (ordinal or ordinalIgnoreCase). |
| **Output Claims** | N/A |  | 


The example below defines a ClaimsTransformation of the ‘AssertStringClaimsAreEqual’ type called ‘AssertEmailAndStrongAuthenticationEmailAddressAreEqual’. The value from the policy schema’s ‘strongAuthenticationEmailAddress’ claim will be compared to the  policy schema’s ‘email’ claim. If the claims are equal then the user will continue on the user journey. If the values are not equal an exception will be thrown. 

>[!NOTE]
> This claim will throw an error value based on the  `UserMessageIfClaimsTransformationStringsAreNotEqual` metadata item.

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


---
### AssertDateTimeIsGreaterThan

The AssertDateTimeIsGreaterThan transformation will compare two string  claim as dates from the policy schema and throw an error if the left date is greater than the right date. Seetings are also available for clock skew (TreatAsEqualIfWithinMillseconds) as well as if the right operator is not present.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | leftOperand (string) | A string claim to compare. |
|| rightOperand (string)  | The string claim to compare to. |
| **Input Paramaters** | AssertIfEqualTo (boolean) | . |
|  | AssertIfRightOperandIsNotPresent (boolean) | . |
|  | TreatAsEqualIfWithinMillseconds (int) | . |
| **Output Claims** | N/A |  | 


The example below defines a ClaimsTransformation of the ‘AssertDateTimeIsGreaterThan’ type called ‘AssertRefreshTokenIssuedLaterThanValidFromDate’. The value from the policy schema’s ‘refreshTokenIssuedOnDateTime’ claim will be compared to the  policy schema’s ‘refreshTokensValidFromDateTime’ claim. If the first claim is NOT greater than the second claim or the second claim does not exist an exception will be thrown. 

>[!NOTE]
> This claim will throw an error value based on the  `[???TODO: NEED TO CONFM ???]` metadata item.

```XML
<ClaimsTransformation Id="AssertRefreshTokenIssuedLaterThanValidFromDate" TransformationMethod="AssertDateTimeIsGreaterThan">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="refreshTokenIssuedOnDateTime" TransformationClaimType="leftOperand" />
    <InputClaim ClaimTypeReferenceId="refreshTokensValidFromDateTime" TransformationClaimType="rightOperand" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="AssertIfEqualTo" DataType="boolean" Value="false" />
    <InputParameter Id="AssertIfRightOperandIsNotPresent" DataType="boolean" Value="true" />
    <InputParameter Id="TreatAsEqualIfWithinMillseconds" DataType="int" Value="300000" />
  </InputParameters>
</ClaimsTransformation>
```



---
### ConvertNumberToStringClaim

The ConvertNumberToStringClaim claims transformation will convert a numeric claims from the policy schema and save it to a string based claims.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim (long or int) | A numeric claim to convert. |
| **Input Paramaters** | N/A | |
| **Output Claims** | outputClaim (string) | The output claim as a string | 

The example below defines a ClaimsTransformation of the ‘ConvertNumberToStringClaim’ type called ‘CreateUserId’. This transform will convert the claim called ‘numericUserId’ in the policy schema to a string claim called ‘UserId’.


```XML
<ClaimsTransformation Id="CreateUserId" TransformationMethod="ConvertNumberToStringClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="numericUserId" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="UserId" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetClaimFromJSON

The GetClaimFromJSON claims transformation will retrive a single claim from a JSON object int the value of a claim in the policy schema and save it to a string based claim provided.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputJson (string) | A string claim holding a JSON object. |
| **Input Paramaters** | claimToExtract (string) | The claim within the JSON to extract |
| **Output Claims** | extractedClaim (string) | The output claim to store the extracted claim. | 

The example below defines a ClaimsTransformation of the ‘GetClaimFromJSON’ type called ‘GetEmailFromJsonTransformation’. This transform will extract an 'email' claim from the JSON stored within the StrJSON cliam in the policy schema and save it to the string claim called ‘email’.


```XML
<ClaimsTransformation Id="GetEmailFromJsonTransformation" TransformationMethod="GetClaimFromJSON">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="StrJSON" TransformationClaimType="inputJson" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="claimToExtract" DataType="string" Value="email" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="extractedClaim" />
  </OutputClaims>
</ClaimsTransformation>
```
The following is the example JSON contained within the 'StrJSON' claim above.
```JSON
{
  "name": "Phil",
  "phone": "+610411222333",
  "email": "phil@emailaddress.com"
}
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

The ChangeCase claims transformation will transform the value of the policy schema claim to either uppercase or lowercase.  The result of the comparison is returned as a Boolean claim..

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim1 (String) | A single value claim to compare the value of |
| **Input Paramaters** | compareTo (string) | The static string value to compare to |
|| ignoreCase(string) | A string of either "true" or "false" to determine if case is compared |
|| operator(string) | Either ‘EQUAL’ or ‘NOT EQUAL’
| **Output Claims** | outputClaim (boolean) | The boolean result of the comparison | 

The example below defines a ClaimsTransformation of the 'CompareClaimToValue' type called ‘isFaceBookUser’. A claim called ‘identityProvider’ in the policy Schema  is compared to a ‘compareTo’ parameter configured to be ‘facebook.com’.  The comparison will not be case-sensitive.  If the input claim equals the configured parameter, the transform will return a Boolean claim called ‘facebookuser’ with the string value ‘true’;  otherwise it returns ‘false’


```XML
 <ClaimsTransformation Id="ChangeCaseUpper" TransformationMethod="ChangeCase">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userId" TransformationClaimType="inputClaim1" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="toCase" DataType="string" Value="upper" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="BobUpper" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### NullClaim

A NullClaim claims transformation will clear the value from a claim in the policy schema (Set it to Null).

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | N/A | |
| **Input Paramaters** | N/A |  |
| **Output Claims** | claim_to_null (N/A) | The claim to set to Null | 

The example below defines a ClaimsTransformation of the 'NullClaim' type called ‘ClearUserId’. A claim called ‘userId’ in the policy Schema  will be set to Null.

```XML
<ClaimsTransformation Id="ClearUserId" TransformationMethod="NullClaim">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="userId" TransformationClaimType="claim_to_null" />
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

A CompareClaims claims transformation compares the value of one claim defined in the policy schema to that of a second claim defined there. Other parameters control whether the comparison should be case sensitive and whether to test for equality or inequality. The result of the comparison is returned as a Boolean claim.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | inputClaim1 (String) | A single value claim to compare |
| | inputClaim2 (string) | Another claim |
| **Input Paramaters**| ignoreCase(string) | A string of either "true" or "false" to determine if case is compared |
|| operator(string) | Either ‘EQUAL’ or ‘NOT EQUAL’
| **Output Claims** | outputClaim (boolean) |The boolean result of the comparison | 

The example below defines a ClaimsTransformation of the 'CompareClaims' type called ‘HasAgeGroupValueChanged’. Two claims called ‘ageGroup’ and ‘ageGroup_new’ in the policy Schema are compared to each other.  The comparison will not be case-sensitive.  If the claims are equals, the transform will return a Boolean claim called ‘ageGroupValueChanged’ with the value ‘true’;  otherwise it returns ‘false’

```XML
<ClaimsTransformation Id="HasAgeGroupValueChanged" TransformationMethod="CompareClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="ageGroup" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="ageGroup_new" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="ignoreCase" DataType="string" Value="true" />
    <InputParameter Id="operator" DataType="string" Value="NOT EQUAL" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="ageGroupValueChanged" TransformationClaimType="outputClaim"/>
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetAgeGroupAndConsentProvided

The GetAgeGroupAndConsentProvided claims transformation evaluates three claims to fdermine if the user is allowed access based on GDPR, COPPA, and PIPA regulations.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | dateOfBirth (String) | The users birth date. |
|  | legalCountry (String) | The country the user is in. |
| | consentProvidedForMinor (string) | A consent claim to allow minors access. |
| **Input Paramaters**| N/A |  |
| **Output Claims** | ageGroup (string) | Will return null, Undefined, Minor, Adult, or NotAdult | 
|  | doRegulationsRequireParentalConsent (boolean) | Will return a boolean if the country is subject to GDPR, COPPA, and PIPA  |
|  | consentProvidedForMinor (String) | returns the consent claim to allow minors access or not. |

The example below defines a ClaimsTransformation of the 'GetAgeGroupAndConsentProvided' type called ‘CalculateAgeGroupAndConsent’. Three claims called ‘dateOfBirth’, ‘legalCountry’ and ‘consentProvidedForMinor’ in the policy Schema are evaluated.  The information is then evaluated and three claims will be returned based on the country and the relevent regulation (GDPR, COPPA, and PIPA).

```XML
<ClaimsTransformation Id="CalculateAgeGroupAndConsentCalculateAgeGroupAndConsent" TransformationMethod="GetAgeGroupAndConsentProvided">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="dateOfBirth" TransformationClaimType="dateOfBirth" />
    <InputClaim ClaimTypeReferenceId="legalCountry" TransformationClaimType="countryCode" />
    <InputClaim ClaimTypeReferenceId="consentProvidedForMinor" TransformationClaimType="consentProvidedForMinor" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="ageGroup" TransformationClaimType="ageGroup" />
    <OutputClaim ClaimTypeReferenceId="doRegulationsRequireParentalConsent" TransformationClaimType="doRegulationsRequireParentalConsent" />
    <OutputClaim ClaimTypeReferenceId="consentProvidedForMinor" TransformationClaimType="consentProvidedForMinor" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### SetClaimsIfStringsMatch

The SetClaimsIfStringsMatch claims transformation compares the value of one claim defined in the policy schema to that of a staic paramater. If the values match according to the String comparison method then a boolean flag will be set to identify the match and a claims restiction value will be used to retrive the value based ont eh provided Key.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | claimToMatch (String) | A single value claim to compare against |
| **Input Paramaters**| matchTo(string) | A string value to compare to the claim value. |
|| stringComparison(string) | Either ordinal or ordinalIgnoreCase |
|| outputClaimIfMatched(string) | The static value to add to a claim if there is a match |
| **Output Claims** | outputClaim (string) |The claim to store the static value | 
|| stringCompareResultClaim(boolean) | The Boolean field if there was a match |

The example below defines a ClaimsTransformation of the 'SetClaimsIfStringsMatchs' type called ‘SetIsMinor’. If the 'ageGroup' claim matches the value "Minor" then a true boolean value will be set for the "isMinor" claimm, and the Value "B2C_V1_90001" will be set within the ‘responseCode’ claim.

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
    <OutputClaim ClaimTypeReferenceId="responseCode" TransformationClaimType="outputClaim" />
    <OutputClaim ClaimTypeReferenceId="isMinor" TransformationClaimType="stringCompareResultClaim" />
  </OutputClaims>
</ClaimsTransformation>
```



---
### GetMappedValueFromLocalizedCollection

The GetMappedValueFromLocalizedCollection claims transformation will retrive a value from another claims schema definition from the restriction enumeration.

| Variable | Paramater | Description 
| - | - | - |
| **Input Claims** | mapFromClaim (String) | A single value claim to lookup |
| **Input Paramaters**| N/A | |
| **Output Claims** | restrictionValueClaim (string) |The claim to to retrive the restriction enumeration from and store the result to.  | 


The example below defines a ClaimsTransformation of the 'GetMappedValueFromLocalizedCollection' type called ‘GetResponseMsgMappedToResponseCode’. This will retrived the value from the 'responseCode' claim and use it as the lookup for the value on the 'responseMsg' claim. The lookup value returned will be stored on the 'responseMsg' claim.


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

Below isthe Schema definition used in the example above.
```XML
<ClaimType Id="responseMsg">
  <DisplayName>
  </DisplayName>
  <DataType>string</DataType>
  <AdminHelpText>A claim responsible for holding response messages to send to the relying party</AdminHelpText>
  <UserHelpText>A claim responsible for holding response messages to send to the relying party</UserHelpText>
  <UserInputType>Paragraph</UserInputType>
  <Restriction>
    <Enumeration Text="B2C_V1_90001" Value="Unfortunately, your sign on has been blocked. Privacy and online safety laws in your country prevent access to accounts belonging to children." />
  </Restriction>
</ClaimType>
```

---
### DoesClaimExist

***[TODO: Still need to complete this transform]***

```XML
<ClaimsTransformation Id="IsDateOfBirthPresent" TransformationMethod="DoesClaimExist">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="dateOfBirth" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isDoBPresent" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### GetCurrentDateTime

***[TODO: Still need to complete this transform]***

```XML
<ClaimsTransformation Id="GetCurrentDateTimeTest" TransformationMethod="GetCurrentDateTime">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="currDate" TransformationClaimType="currentDateTime" />
  </OutputClaims>
</ClaimsTransformation>
```

---
### IsTermsOfUseConsentRequired

***[TODO: Still need to complete this transform]***

---
### AndClaims

***[TODO: Still need to complete this transform]***

```XML
<ClaimsTransformation Id="EvaluateSkipProgressiveProfilePage" TransformationMethod="AndClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="isDoBPresent" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="isLegalCountryPresent" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="skipProgressiveProfilePage" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```


---
### OrClaims

***[TODO: Still need to complete this transform]***

```XML
<ClaimsTransformation Id="CalculateIsUserMinorAndRequireParentalConsent" TransformationMethod="OrClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="islegalAgeGroupClassificationUndefined" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="isLegalAgeGroupClassificationMinorWithoutConsent" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isMinorAndRequiresParentalConsent" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```



## Next steps

We love feedback and suggestions! If you have any difficulties with this topic, post on Stack Overflow using the tag ['azure-ad-b2c'](https://stackoverflow.com/questions/tagged/azure-ad-b2c). For feature requests, vote for them in our [feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c).
