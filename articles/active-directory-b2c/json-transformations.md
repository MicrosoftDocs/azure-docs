---
title: JSON claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C  | Microsoft Docs
description: JSON claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: davidmu
ms.component: B2C
---

# JSON claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides examples for using the JSON claims transformations of the Identity Experience Framework  schema in Azure Active Directory (Azure AD) B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## GetClaimFromJson

Get a specified element from a JSON data.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputJson | string | The ClaimTypes that are used by the claims transformation to get the item. |
| InputParameter | claimToExtract | string | the name of the JSON element to be extracted. |
| OutputClaim | extractedClaim | string | The ClaimType that is produced after this claims transformation has been invoked, the element value specified in the _claimToExtract_ input parameter. |

In the following example, the claims transformation extracted the `emailAddress` element from the JSON data: `{"emailAddress": "someone@example.com", "displayName": "Someone"}`

```XML
<ClaimsTransformation Id="GetEmailClaimFromJson" TransformationMethod="GetClaimFromJson">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="customUserData" TransformationClaimType="inputJson" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="claimToExtract" DataType="string" Value="emailAddress" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="extractedEmail" TransformationClaimType="extractedClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputJson**: {"emailAddress": "someone@example.com", "displayName": "Someone"}
- Input parameter:
    - **claimToExtract**: emailAddress
- Output claims: 
    - **extractedClaim**: someone@example.com


## GetClaimsFromJsonArray

Get a list of specified elements from Json data.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | jsonSourceClaim | string | The ClaimTypes that are used by the claims transformation to get the claims. |
| InputParameter | errorOnMissingClaims | boolean | Specifies whether to throw an error if one of the claims is missing. |
| InputParameter | includeEmptyClaims | string | Specify whether to include empty claims. |
| InputParameter | jsonSourceKeyName | string | Element key name |
| InputParameter | jsonSourceValueName | string | Element value name |
| OutputClaim | Collection | string, int, boolean, and datetime |List of claims to extract. The name of the claim should be equal to the one specified in _jsonSourceClaim_ input claim. |

In the following example, the claims transformation extracts the following claims: email (string), displayName (string), membershipNum (int), active (boolean) and  birthdate (datetime) from the JSON data.

```JSON
[{"key":"email","value":"someone@example.com"}, {"key":"displayName","value":"Someone"}, {"key":"membershipNum","value":6353399}, {"key":"active","value":true}, {"key":"birthdate","value":"1980-09-23T00:00:00Z"}]
```

```XML
<ClaimsTransformation Id="GetClaimsFromJson" TransformationMethod="GetClaimsFromJsonArray">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="jsonSourceClaim" TransformationClaimType="jsonSource" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="errorOnMissingClaims" DataType="boolean" Value="false" />
    <InputParameter Id="includeEmptyClaims" DataType="boolean" Value="false" />
    <InputParameter Id="jsonSourceKeyName" DataType="string" Value="key" />
    <InputParameter Id="jsonSourceValueName" DataType="string" Value="value" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" />
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="membershipNum" />
    <OutputClaim ClaimTypeReferenceId="active" />
    <OutputClaim ClaimTypeReferenceId="birthdate" />
  </OutputClaims>
</ClaimsTransformation>
```    

- Input claims:
    - **jsonSourceClaim**: [{"key":"email","value":"someone@example.com"}, {"key":"displayName","value":"Someone"}, {"key":"membershipNum","value":6353399}, {"key":"active","value": true}, {"key":"birthdate","value":"1980-09-23T00:00:00Z"}]
- Input parameters:
    - **errorOnMissingClaims**: false
    - **includeEmptyClaims**: false
    - **jsonSourceKeyName**: key
    - **jsonSourceValueName**: value
- Output claims:
    - **email**: "someone@example.com"
    - **displayName**: "Someone"
    - **membershipNum**: 6353399
    - **active**: true
    - **birthdate**: 1980-09-23T00:00:00Z

## GetNumericClaimFromJson

Gets a specified numeric (long) element from a JSON data.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputJson | string | The ClaimTypes that are used by the claims transformation to get the claim. |
| InputParameter | claimToExtract | string | The name of the JSON element to extract. |
| OutputClaim | extractedClaim | long | The ClaimType that is produced after this ClaimsTransformation has been invoked, the element's value specified in the _claimToExtract_ input parameters. |

In the following example, the claims transformation extracts the `id` element from the JSON data.

```JSON
{
    "emailAddress": "someone@example.com", 
    "displayName": "Someone", 
    "id" : 6353399
}
```

```XML
<ClaimsTransformation Id="GetIdFromResponse" TransformationMethod="GetNumericClaimFromJson">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="exampleInputClaim" TransformationClaimType="inputJson" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="claimToExtract" DataType="string" Value="id" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="membershipId" TransformationClaimType="extractedClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputJson**: {"emailAddress": "someone@example.com", "displayName": "Someone", "id" : 6353399}
- Input parameters
    - **claimToExtract**:  id
- Output claims: 
    - **extractedClaim**: 6353399

## GetSingleValueFromJsonArray

Gets the first element from a JSON data array.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputJsonClaim | string | The ClaimTypes that are used by the claims transformation to get the item from the JSON array. |
| OutputClaim | extractedClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked, the first element in the JSON array. |

In the following example, the claims transformation extracts the first element (email address) from the JSON array  `["someone@example.com", "Someone", 6353399]`.

```XML
<ClaimsTransformation Id="GetEmailFromJson" TransformationMethod="GetSingleValueFromJsonArray">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userData" TransformationClaimType="inputJsonClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="extractedClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputJsonClaim**: ["someone@example.com", "Someone", 6353399]
- Output claims: 
    - **extractedClaim**: someone@example.com

## XmlStringToJsonString

Converts XML data to JSON format.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | xml | string | The ClaimTypes that are used by the claims transformation to convert the data from XML to JSON format. |
| OutputClaim | json | string | The ClaimType that is produced after this ClaimsTransformation has been invoked, the data in JSON format. |

```XML
<ClaimsTransformation Id="ConvertXmlToJson" TransformationMethod="XmlStringToJsonString">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="intpuXML" TransformationClaimType="xml" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="outputJson" TransformationClaimType="json" />
  </OutputClaims>
</ClaimsTransformation>
```

In the following example, the claims transformation converts the following XML data to JSON format.

#### Example
Input claim:

```XML
<user>
  <name>Someone</name>
  <email>someone@example.com</email>
</user>
```

Output claim:

```JSON
{
  "user": {
    "name":"Someone",
    "email":"someone@example.com"
  }
}
```

