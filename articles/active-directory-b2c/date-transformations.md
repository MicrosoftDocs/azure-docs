---
title: Date claims transformation examples for custom policies
description: Date claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/16/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Date claims transformations

This article provides examples for using the date claims transformations of the Identity Experience Framework  schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [claims transformations](claimstransformations.md).

## AssertDateTimeIsGreaterThan

Asserts that one date is later than a second date. Determines whether the `rightOperand` is greater than the `leftOperand`. If yes, throws an exception. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#assertdatetimeisgreaterthan) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | leftOperand | string | First claim's type, which should be later than the second claim. |
| InputClaim | rightOperand | string | Second claim's type, which should be earlier than the first claim. |
| InputParameter | AssertIfEqualTo | boolean | Specifies whether this assertion should throw an error if the left operand is equal to the right operand. Possible values: `true` (default), or `false`. |
| InputParameter | AssertIfRightOperandIsNotPresent | boolean | Specifies whether this assertion should pass if the right operand is missing. |
| InputParameter | TreatAsEqualIfWithinMillseconds | int | Specifies the number of milliseconds to allow between the two date times to consider the times equal (for example, to account for clock skew). |

The **AssertDateTimeIsGreaterThan** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md). The **DateTimeGreaterThan** self-asserted technical profile metadata controls the error message that the technical profile presents to the user. The error messages can be [localized](localization-string-ids.md#claims-transformations-error-messages).

![Diagrams shows how to use the AssertStringClaimsAreEqual claims transformation.](./media/date-transformations/assert-execution.png)

### Example of AssertDateTimeIsGreaterThan

The following example compares the `currentDateTime` claim with the `approvedDateTime` claim. An error is thrown if `currentDateTime` is later than `approvedDateTime`. The transformation treats values as equal if they are within 5 minutes (30000 milliseconds) difference. It won't throw an error if the values are equal because `AssertIfEqualTo` is set to `false`.

```xml
<ClaimsTransformation Id="AssertApprovedDateTimeLaterThanCurrentDateTime" TransformationMethod="AssertDateTimeIsGreaterThan">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="approvedDateTime" TransformationClaimType="leftOperand" />
    <InputClaim ClaimTypeReferenceId="currentDateTime" TransformationClaimType="rightOperand" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="AssertIfEqualTo" DataType="boolean" Value="false" />
    <InputParameter Id="AssertIfRightOperandIsNotPresent" DataType="boolean" Value="true" />
    <InputParameter Id="TreatAsEqualIfWithinMillseconds" DataType="int" Value="300000" />
  </InputParameters>
</ClaimsTransformation>
```

> [!NOTE]
> In the example above, if you remove the `AssertIfEqualTo` input parameter, and the `currentDateTime` is equal to`approvedDateTime`, an error will be thrown. The `AssertIfEqualTo` default value is `true`.
>

- Input claims:
  - **leftOperand**: 2022-01-01T15:00:00
  - **rightOperand**: 2022-01-22T15:00:00
- Input parameters:
  - **AssertIfEqualTo**: false
  - **AssertIfRightOperandIsNotPresent**: true
  - **TreatAsEqualIfWithinMillseconds**: 300000 (30 seconds)
- Result: Error thrown

### Call the claims transformation

The following `Example-AssertDates` validation technical profile calls the `AssertApprovedDateTimeLaterThanCurrentDateTime` claims transformation.

```xml
<TechnicalProfile Id="Example-AssertDates">
  <DisplayName>Unit test</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="ComparisonResult" DefaultValue="false" />
  </OutputClaims>
  <OutputClaimsTransformations>
    <OutputClaimsTransformation ReferenceId="AssertDates" />
  </OutputClaimsTransformations>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

The self-asserted technical profile calls the validation `Example-AssertDates` technical profile.

```xml
<TechnicalProfile Id="SelfAsserted-AssertDateTimeIsGreaterThan">
  <DisplayName>User ID signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ContentDefinitionReferenceId">api.selfasserted</Item>
    <Item Key="DateTimeGreaterThan">Custom error message if the provided right operand is greater than the right operand.</Item>
  </Metadata>
  ...
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="ClaimsTransformation-AssertDateTimeIsGreaterThan" />
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```

## ConvertDateTimeToDateClaim

Converts a `DateTime` claim type to a `Date` claim type. The claims transformation removes the time format from the date. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#convertdatetimetodateclaim) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | dateTime | The claim type to be converted. |
| OutputClaim | outputClaim | date | The claim type that is produced after this claims transformation has been invoked. |

### Example of ConvertDateTimeToDateClaim

The following example demonstrates the conversion of the claim `systemDateTime` (dateTime data type) to another claim `systemDate` (date data type).

```xml
<ClaimsTransformation Id="ConvertToDate" TransformationMethod="ConvertDateTimeToDateClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="systemDateTime" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="systemDate" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 2022-01-03T11:34:22.0000000Z
- Output claims:
  - **outputClaim**: 2022-01-03

## ConvertDateToDateTimeClaim

Converts a `Date` claim type to a `DateTime` claim type. The claims transformation converts the time format and adds 12:00:00 AM to the date. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#convertdatetodatetimeclaim) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | date | The claim type to be converted. |
| OutputClaim | outputClaim | dateTime | The claim type that is produced after this claims transformation has been invoked. |

### Example of ConvertDateToDateTimeClaim

The following example demonstrates the conversion of the claim `dateOfBirth` (date data type) to another claim `dateOfBirthWithTime` (dateTime data type).

```xml
  <ClaimsTransformation Id="ConvertToDateTime" TransformationMethod="ConvertDateToDateTimeClaim">
    <InputClaims>
      <InputClaim ClaimTypeReferenceId="dateOfBirth" TransformationClaimType="inputClaim" />
    </InputClaims>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="dateOfBirthWithTime" TransformationClaimType="outputClaim" />
    </OutputClaims>
  </ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 2022-01-03
- Output claims:
  - **outputClaim**: 2022-01-03T00:00:00.0000000Z

## DateTimeComparison

Compares two dates and determines whether the first date is later, earlier, or equal to another. The result is a new Boolean claim with a value of `true` or `false`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#datetimecomparison) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | firstDateTime | dateTime | The first date to compare whether it's later, earlier, or equal to the second date. Null value throws an exception. |
| InputClaim | secondDateTime | dateTime | The second date to compare. Null value is treated as the current date and time. |
| InputParameter | timeSpanInSeconds | int | Timespan to add to the first date. Possible values: range from negative -2,147,483,648 through positive 2,147,483,647.  |
| InputParameter | operator | string | One of following values: `same`, `later than`, or `earlier than`. |
| OutputClaim | result | boolean | The claim that is produced after this claims transformation has been invoked. |

### Example of DateTimeComparison

Use this claims transformation to determine if first date plus the `timeSpanInSeconds` parameter is later, earlier, or equal to another. The following example shows that the first date (2022-01-01T00:00:00) plus 90 days is later than the second date (2022-03-16T00:00:00).

```xml
<ClaimsTransformation Id="CompareLastTOSAcceptedWithCurrentDateTime" TransformationMethod="DateTimeComparison">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="extension_LastTOSAccepted" TransformationClaimType="secondDateTime" />
    <InputClaim ClaimTypeReferenceId="currentDateTime" TransformationClaimType="firstDateTime" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="operator" DataType="string" Value="later than" />
    <InputParameter Id="timeSpanInSeconds" DataType="int" Value="7776000" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isLastTOSAcceptedGreaterThanNow" TransformationClaimType="result" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **firstDateTime**: 2022-01-01T00:00:00.100000Z
  - **secondDateTime**: 2022-03-16T00:00:00.100000Z
- Input parameters:
  - **operator**: later than
  - **timeSpanInSeconds**: 7776000 (90 days)
- Output claims:
  - **result**: true

## IsTermsOfUseConsentRequired

Determine whether a `dateTime` claim type is earlier or greater than a specific date. The result is a new Boolean claim with a value of `true` or `false`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#istermsofuseconsentrequired) of this claims transformation.

| Item | TransformationClaimType | Data type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | termsOfUseConsentDateTime | dateTime | The `dateTime` claim type to check whether it's earlier or later than the `termsOfUseTextUpdateDateTime` input parameter. Undefined value returns `true` result. |
| InputParameter | termsOfUseTextUpdateDateTime | dateTime | The `dateTime` claim type to check whether it's earlier or later than the `termsOfUseConsentDateTime` input claim. The time part of the date is optional. |
| OutputClaim | result | boolean | The claim type that's produced after this claims transformation has been invoked. |

Use this claims transformation to determine whether a `dateTime` claim type is earlier or greater than a specific date. For example, check whether a user has consented to the latest version of your terms of use (TOU) or terms of service. To check the last time a user consented, store the last time the user accepted the TOU in an [extension attribute](user-profile-attributes.md#extension-attributes). When your TOU wording changes, update the `termsOfUseTextUpdateDateTime` input parameter with the time of the change. Then, call this claims transformation to compare the dates. If the claims transformation returns `true`, the `termsOfUseConsentDateTime` value is earlier than the `termsOfUseTextUpdateDateTime` value, and you can ask the user to accept the updated TOU.

```xml
<ClaimsTransformation Id="IsTermsOfUseConsentRequired" TransformationMethod="IsTermsOfUseConsentRequired">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="extension_termsOfUseConsentDateTime" TransformationClaimType="termsOfUseConsentDateTime" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="termsOfUseTextUpdateDateTime" DataType="dateTime" Value="2021-11-15T00:00:00" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="termsOfUseConsentRequired" TransformationClaimType="result" />
  </OutputClaims>
</ClaimsTransformation>
```

### IsTermsOfUseConsentRequired example

- Input claims:
  - **termsOfUseConsentDateTime**: 2020-03-09T09:15:00
- Input parameters:
  - **termsOfUseTextUpdateDateTime**: 2021-11-15
- Output claims:
  - **result**: true

## GetCurrentDateTime

Get the current UTC date and time and add the value to a claim type. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date#getcurrentdatetime) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| OutputClaim | currentDateTime | dateTime | The claim type that is produced after this claims transformation has been invoked. |

### Example of GetCurrentDateTime

The following example shows how to get the current data and time:

```xml
<ClaimsTransformation Id="GetSystemDateTime" TransformationMethod="GetCurrentDateTime">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="systemDateTime" TransformationClaimType="currentDateTime" />
  </OutputClaims>
</ClaimsTransformation>
```

- Output claims:
  - **currentDateTime**: 2022-01-14T11:40:35.0000000Z

## Next steps

- Find more [claims transformation samples](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/date) on the Azure AD B2C community GitHub repo
