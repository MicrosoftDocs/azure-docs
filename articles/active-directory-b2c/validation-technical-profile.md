---
title: Define a validation technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Validate claims by using a validation technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 03/16/2020
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a validation technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A validation technical profile is an ordinary technical profile from any protocol, such as [Microsoft Entra ID](active-directory-technical-profile.md) or a [REST API](restful-technical-profile.md). The validation technical profile returns output claims, or returns 4xx HTTP status code, with the following data. For more information, see [returning error message](restful-technical-profile.md#returning-validation-error-message)

```json
{
    "version": "1.0.0",
    "status": 409,
    "userMessage": "Your error message"
}
```

The scope of the output claims of a validation technical profile is limited to the [self-asserted technical profile](self-asserted-technical-profile.md) that invokes the validation technical profile, and its validation technical profiles. If you want to use the output claims in the next orchestration step, add the output claims to the self-asserted technical profile that invokes the validation technical profile.

Validation technical profiles are executed in the sequence that they appear in the **ValidationTechnicalProfiles** element. You can configure in a validation technical profile whether the execution of any subsequent validation technical profiles should continue if the validation technical profile raises an error or is successful.

A validation technical profile can be conditionally executed based on preconditions defined in the **ValidationTechnicalProfile** element. For example, you can check whether a specific claim exists, or if a claim is equal or not to the specified value.

A self-asserted technical profile may define a validation technical profile to be used for validating some or all of its output claims. All of the input claims of the referenced technical profile must appear in the output claims of the referencing validation technical profile.

> [!NOTE]
> Only self-asserted technical profiles can use validation technical profiles. If you need to validate the output claims from non-self-asserted technical profiles, consider using an additional orchestration step in your user journey to accommodate the technical profile in charge of the validation.

## ValidationTechnicalProfiles

The **ValidationTechnicalProfiles** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ValidationTechnicalProfile | 1:n | A technical profile to be used for validating some or all of the output claims of the referencing technical profile. |

The **ValidationTechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a technical profile already defined in the policy or parent policy. |
|ContinueOnError|No| Indicating whether validation of any subsequent validation technical profiles should continue if this validation technical profile raises an error. Possible values: `true` or `false` (default, processing of further validation profiles will stop and an error returned). |
|ContinueOnSuccess | No | Indicating whether validation of any subsequent validation profiles should continue if this validation technical profile succeeds. Possible values: `true` or `false`. The default is `true`, meaning that the processing of further validation profiles will continue. |

The **ValidationTechnicalProfile** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Preconditions | 0:1 | A list of preconditions that must be satisfied for the validation technical profile to execute. |

The **Precondition** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Type` | Yes | The type of check or query to perform for the precondition. Either `ClaimsExist` is specified to ensure that actions should be performed if the specified claims exist in the user's current claim set, or `ClaimEquals` is specified that the actions should be performed if the specified claim exists and its value is equal to the specified value. |
| `ExecuteActionsIf` | Yes | Indicates whether the actions in the precondition should be performed if the test is true or false. |

The **Precondition** element contains following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Value | 1:n | The data that is used by the check. If the type of this check is `ClaimsExist`, this field specifies a ClaimTypeReferenceId to query for. If the type of check is `ClaimEquals`, this field specifies a ClaimTypeReferenceId to query for. While another value element contains the value to be checked.|
| Action | 1:1 | The action that should be taken if the precondition check within an orchestration step is true. The value of the **Action** is set to `SkipThisValidationTechnicalProfile`. Specifies that the associated validation technical profile should not be executed. |

### Example

Following example uses these validation technical profiles:

1. The first validation technical profile checks user credentials and doesn't continue if an error occurs, such as invalid username or bad password.
2. The next validation technical profile, doesn't execute if the userType claim does not exist, or if the value of the userType is `Partner`. The validation technical profile tries to read the user profile from the internal customer database and continue if an error occurs, such as REST API service not available, or any internal error.
3. The last validation technical profile, doesn't execute if the userType claim has not existed, or if the value of the userType is `Customer`. The validation technical profile tries to read the user profile from the internal partner database and continues if an error occurs, such as REST API service not available, or any internal error.

```xml
<ValidationTechnicalProfiles>
  <ValidationTechnicalProfile ReferenceId="login-NonInteractive" ContinueOnError="false" />
  <ValidationTechnicalProfile ReferenceId="REST-ReadProfileFromCustomersDatabase" ContinueOnError="true" >
    <Preconditions>
      <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
        <Value>userType</Value>
        <Action>SkipThisValidationTechnicalProfile</Action>
      </Precondition>
      <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
        <Value>userType</Value>
        <Value>Partner</Value>
        <Action>SkipThisValidationTechnicalProfile</Action>
      </Precondition>
    </Preconditions>
  </ValidationTechnicalProfile>
  <ValidationTechnicalProfile ReferenceId="REST-ReadProfileFromPartnersDatabase" ContinueOnError="true" >
    <Preconditions>
      <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
        <Value>userType</Value>
        <Action>SkipThisValidationTechnicalProfile</Action>
      </Precondition>
      <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
        <Value>userType</Value>
        <Value>Customer</Value>
        <Action>SkipThisValidationTechnicalProfile</Action>
      </Precondition>
    </Preconditions>
  </ValidationTechnicalProfile>
</ValidationTechnicalProfiles>
```
