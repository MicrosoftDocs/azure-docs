---
title: ClaimsTransformations - Azure Active Directory B2C | Microsoft Docs
description: Definition of the ClaimsTransformations element in the Identity Experience Framework Schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: mimart
ms.subservice: B2C
---

# ClaimsTransformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **ClaimsTransformations** element contains a list of claims transformation functions that can be used in user journeys as part of a [custom policy](custom-policy-overview.md). A claims transformation converts a given claim into another one. In the claims transformation, you specify the transform method, for example adding an item to a string collection or changing the case of a string.

To include the list of claims transformation functions that can be used in the user journeys, a ClaimsTransformations XML element must be declared under the BuildingBlocks section of the policy.

```xml
<ClaimsTransformations>
  <ClaimsTransformation Id="<identifier>" TransformationMethod="<method>">
    ...
  </ClaimsTransformation>
</ClaimsTransformations>
```

The **ClaimsTransformation** element contains the following attributes:

| Attribute |Required | Description |
| --------- |-------- | ----------- |
| Id |Yes | An identifier that is used to uniquely identify the claim transformation. The identifier is referenced from other XML elements in the policy. |
| TransformationMethod | Yes | The transform method to use in the claims transformation. Each claim transformation has its own values. See the [claims transformation reference](#claims-transformations-reference) for a complete list of the available values. |

## ClaimsTransformation

The **ClaimsTransformation** element contains the following elements:

```xml
<ClaimsTransformation Id="<identifier>" TransformationMethod="<method>">
  <InputClaims>
    ...
  </InputClaims>
  <InputParameters>
    ...
  </InputParameters>
  <OutputClaims>
    ...
  </OutputClaims>
</ClaimsTransformation>
```


| Element | Occurrences | Description |
| ------- | -------- | ----------- |
| InputClaims | 0:1 | A list of **InputClaim** elements that specify claim types that are taken as input to the claims transformation. Each of these elements contains a reference to a ClaimType already defined in the ClaimsSchema section in the policy. |
| InputParameters | 0:1 | A list of **InputParameter** elements that are provided as input to the claims transformation.
| OutputClaims | 0:1 | A list of **OutputClaim** elements that specify claim types that are produced after the ClaimsTransformation has been invoked. Each of these elements contains reference to a ClaimType already defined in the ClaimsSchema section. |

### InputClaims

The **InputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputClaim | 1:n | An expected input claim type. |

#### InputClaim

The **InputClaim** element contains the following attributes:

| Attribute |Required | Description |
| --------- | ----------- | ----------- |
| ClaimTypeReferenceId |Yes | A reference to a ClaimType already defined in the ClaimsSchema section in the policy. |
| TransformationClaimType |Yes | An identifier to reference a transformation claim type. Each claim transformation has its own values. See the [claims transformation reference](#claims-transformations-reference) for a complete list of the available values. |

### InputParameters

The **InputParameters** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputParameter | 1:n | An expected input parameter. |

#### InputParameter

| Attribute | Required |Description |
| --------- | ----------- |----------- |
| Id | Yes | An identifier that is a reference to a parameter of the claims transformation method. Each claims transformation method has its own values. See the claims transformation table for a complete list of the available values. |
| DataType | Yes | The type of data of the parameter, such as String, Boolean, Int, or DateTime as per the DataType enumeration in the custom policy XML schema. This type is used to perform arithmetic operations correctly. Each claim transformation has its own values. See the [claims transformation reference](#claims-transformations-reference) for a complete list of the available values. |
| Value | Yes | A value that is passed verbatim to the transformation. Some of the values are arbitrary, some of them you select from the claims transformation method. |

### OutputClaims

The **OutputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OutputClaim | 0:n | An expected output claim type. |

#### OutputClaim

The **OutputClaim** element contains the following attributes:

| Attribute |Required | Description |
| --------- | ----------- |----------- |
| ClaimTypeReferenceId | Yes | A reference to a ClaimType already defined in the ClaimsSchema section in the policy.
| TransformationClaimType | Yes | An identifier to reference a transformation claim type. Each claim transformation has its own values. See the [claims transformation reference](#claims-transformations-reference) for a complete list of the available values. |

If input claim and the output claim are the same type (string, or boolean), you can use the same input claim as the output claim. In this case, the claims transformation changes the input claim with the output value.

## Example

For example, you may store the last version of your terms of services that the user accepted. When you update the terms of services, you can ask the user to accept the new version. In the following example, the **HasTOSVersionChanged** claims transformation compares the value of the **TOSVersion** claim with the value of the **LastTOSAcceptedVersion** claim and then returns the boolean **TOSVersionChanged** claim.

```XML
<BuildingBlocks>
  <ClaimsSchema>
    <ClaimType Id="TOSVersionChanged">
      <DisplayName>Indicates if the TOS version accepted by the end user is equal to the current version</DisplayName>
      <DataType>boolean</DataType>
    </ClaimType>
    <ClaimType Id="TOSVersion">
      <DisplayName>TOS version</DisplayName>
      <DataType>string</DataType>
    </ClaimType>
    <ClaimType Id="LastTOSAcceptedVersion">
      <DisplayName>TOS version accepted by the end user</DisplayName>
      <DataType>string</DataType>
    </ClaimType>
  </ClaimsSchema>

  <ClaimsTransformations>
    <ClaimsTransformation Id="HasTOSVersionChanged" TransformationMethod="CompareClaims">
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="TOSVersion" TransformationClaimType="inputClaim1" />
        <InputClaim ClaimTypeReferenceId="LastTOSAcceptedVersion" TransformationClaimType="inputClaim2" />
      </InputClaims>
      <InputParameters>
        <InputParameter Id="operator" DataType="string" Value="NOT EQUAL" />
      </InputParameters>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="TOSVersionChanged" TransformationClaimType="outputClaim" />
      </OutputClaims>
    </ClaimsTransformation>
  </ClaimsTransformations>
</BuildingBlocks>
```

## Claims transformations reference

For examples of claims transformations, see the following reference pages:

- [Boolean](boolean-transformations.md)
- [Date](date-transformations.md)
- [Integer](integer-transformations.md)
- [JSON](json-transformations.md)
- [Phone number](phone-number-claims-transformations.md)
- [General](general-transformations.md)
- [Social account](social-transformations.md)
- [String](string-transformations.md)
- [StringCollection](stringcollection-transformations.md)

