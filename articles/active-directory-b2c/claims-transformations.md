---
title: ClaimsTransformations element in the Identity Experience Framework Schema of Azure Active Directory B2C  | Microsoft Docs
description: Definition of the ClaimsTransformations element in the Identity Experience Framework Schema of Azure Active Directory B2C.
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

# ClaimsTransformations

The `ClaimsTransformations` element contains a list of claims transformation functions that can be used in user journeys as part of a [custom policy](active-directory-b2c-overview-custom.md). A claims transformation converts a given claim into another one. In the claims transformation, you specify the transform method, for example adding an item to a string collection or changing the case of a string.

To include the list of claims transformation functions that can be used in the user journeys, a ClaimsTransformations XML element must be declared under the BuildingBlocks section of the policy XML file.

```xml
<ClaimsTransformations Id="<identifier>" TransformationMethod="<method>">
  ...
</ClaimsTransformation>
```

| Attribute | Description |
| --------- | ----------- |
| **Id** | An identifier that is used to uniquely identify the claim transformation. The identifier is referenced from other XML elements in the policy XML file. |
| **TransformationMethod** | The transform method to use in the claims transformation. Possible value: `AddItemToStringCollection`, `AddParameterToStringCollection`, `AssertStringClaimsAreEqual`, or `ChangeCase`. |

## ClaimsTransformation

The ClaimsTransformation XML elements contain the following child XML elements:

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

| Element | Required | Description |
| ------- | -------- | ----------- |
| **InputClaims** | No | A list of `InputClaim` elements that specify claim types which are taken as input to the claims transformation. Each of these elements contains a reference to a ClaimType already defined in the ClaimsSchema section in the policy XML file. |
| **InputParameters** | No | A list of `InputParameter` elements that are provided as input to the claims transformation.  
| **OutputClaims** | No | A list of `OutputClaim` elements that specify claim types which are produced after the ClaimsTransformation has been invoked. Each of these elements contains reference to a ClaimType already defined in the ClaimsSchema section. |


### InputClaim

| Attribute | Description |
| --------- | ----------- |
| **ClaimTypeReferenceId** | A reference to a ClaimType already defined in the ClaimsSchema section in the policy XML file. |
| **TransformationClaimType** | An identifier to reference a transformation claim type. Each claim transformation has its own values. |

### InputParameter

| Attribute | Description |
| --------- | ----------- |
| **id** | An identifier that is a reference to a parameter of the claims transformation method. Each claims transformation method has its own values. See the claims transformation table for a complete list of the available values. |
| **DataType** | The type of data of the parameter, such as String, Boolean, Int, or DateTime as per the DataType enumeration in the custom policy XML schema. This type is used to perform arithmetic operations correctly. Each claim transformation method has its own values. See the claims transformation table for a complete list of the available values. |
| **Value** | A value that is passed verbatim to the transformation. Some of the values are arbitrary, some of them you select from the claims transformation method. |

### OutputParameter

| Attribute | Description |
| --------- | ----------- |
| **ClaimTypeReferenceId** | A reference to a ClaimType already defined in the ClaimsSchema section in the policy XML file.
| **TransformationClaimType** | An identifier to reference a transformation claim type. Each claim transformation has its own values. See the claims transformation table for a complete list of the available values. |
 
If input claim and the output claim are the same type (string, or boolean), you can use the same input claim as the output claim. In this case, the claims transformation changes the input claim with the output value.

For examples of claims tranformations, see the following reference pages:

- [Boolean](boolean-transformations.md)
- [Date](date-transformations.md)
- [Integer](integer-transformations.md)
- [JSON](json-transformations.md)
- [General](general-transformations.md)
- [Social account](social-transformations.md)
- [String](string-transformations.md)
- [StringCollection](stringcollection-transformation.md)

