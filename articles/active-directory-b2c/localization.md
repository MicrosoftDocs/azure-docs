---
title: Localization - Azure Active Directory B2C
description: Specify the Localization element of a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 03/06/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Localization element

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **Localization** element allows you to support multiple locales or languages in the policy for the user journeys. The localization support in policies allows you to:

- Set up the explicit list of the supported languages in a policy and pick a default language.
- Provide language-specific strings and collections.

```xml
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
  </SupportedLanguages>
  <LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedResources Id="api.localaccountsignup.es">
  ...
```

The **Localization** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Enabled | No | Possible values: `true` or `false`. |

The **Localization** element contains following XML elements

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SupportedLanguages | 1:n | List of supported languages. |
| LocalizedResources | 0:n | List of localized resources. |

## SupportedLanguages

The **SupportedLanguages** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| DefaultLanguage | Yes | The language to be used as the default for localized resources. |
| MergeBehavior | No | An enumeration values of values that are merged together with any ClaimType present in a parent policy with the same identifier. Use this attribute when you overwrite a claim specified in base policy. Possible values: `Append`, `Prepend`, or `ReplaceAll`. The `Append` value specifies that the collection of data present should be appended to the end of the collection specified in the parent policy. The `Prepend` value specifies that the collection of data present should be added before the collection specified in the parent policy. The `ReplaceAll` value specifies that the collection of data defined in the parent policy should be ignored, using instead the data defined in the current policy. |

### SupportedLanguages

The **SupportedLanguages** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SupportedLanguage | 1:n | Displays content that conforms to a language tag per RFC 5646 - Tags for Identifying Languages. |

## LocalizedResources

The **LocalizedResources** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier that is used to uniquely identify localized resources. |

The **LocalizedResources** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedCollections | 0:n | Defines entire collections in various cultures. A collection can have different number of items and different strings for various cultures. Examples of collections include the enumerations that appear in claim types. For example, a country/region list is shown to the user in a drop-down list. |
| LocalizedStrings | 0:n | Defines all of the strings, except those strings that appear in collections, in various cultures. |

### LocalizedCollections

The **LocalizedCollections** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedCollection | 1:n | List of supported languages. |

#### LocalizedCollection

The **LocalizedCollection** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ElementType | Yes | References a ClaimType element or a user interface element in the policy file. |
| ElementId | Yes | A string that contains a reference to a claim type already defined in the ClaimsSchema section that is used if **ElementType** is set to a ClaimType. |
| TargetCollection | Yes | The target collection. |

The **LocalizedCollection** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Item | 0:n | Defines an available option for the user to select for a claim in the user interface, such as a value in a dropdown. |

The **Item** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Text | Yes | The user-friendly display string that should be shown to the user in the user interface for this option. |
| Value | Yes | The string claim value associated with selecting this option. |
| SelectByDefault | No | Indicates whether or not this option should be selected by default in the UI. Possible values: True or False. |

The following example shows the use of the **LocalizedCollections** element. It contains two **LocalizedCollection** elements, one for English and another one for Spanish. Both set the **Restriction** collection of the claim `Gender` with a list of items for English and Spanish. For more samples, check out the [Claim restriction enumeration live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims#restriction-enumeration).

```xml
<LocalizedResources Id="api.selfasserted.en">
  <LocalizedCollections>
    <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Female" Value="F" />
      <Item Text="Male" Value="M" />
    </LocalizedCollection>
  </LocalizedCollections>
</LocalizedResources>

<LocalizedResources Id="api.selfasserted.es">
 <LocalizedCollections>
   <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Femenino" Value="F" />
      <Item Text="Masculino" Value="M" />
    </LocalizedCollection>
  </LocalizedCollections>
</LocalizedResources>
```

### LocalizedStrings

The **LocalizedStrings** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedString | 1:n | A localized string. |

The **LocalizedString** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ElementType | Yes | Possible values: [ClaimsProvider](#claimsprovider), [ClaimType](#claimtype), [ErrorMessage](#errormessage), [GetLocalizedStringsTransformationClaimType](#getlocalizedstringstransformationclaimtype), [FormatLocalizedStringTransformationClaimType](#formatlocalizedstringtransformationclaimtype), [Predicate](#predicate), [PredicateValidation](#predicatevalidation), or [UxElement](#uxelement).   | 
| ElementId | Yes | If **ElementType** is set to `ClaimType`, `Predicate`, or `PredicateValidation`, this element contains a reference to a claim type already defined in the ClaimsSchema section. |
| StringId | Yes | If **ElementType** is set to `ClaimType`, this element contains a reference to an attribute of a claim type. Possible values: `DisplayName`, `AdminHelpText`, or `PatternHelpText`. The `DisplayName` value is used to set the claim display name. The `AdminHelpText` value is used to set the help text name of the claim user. The `PatternHelpText` value is used to set the claim pattern help text. If **ElementType** is set to `UxElement`, this element contains a reference to an attribute of a user interface element. If **ElementType** is set to `ErrorMessage`, this element specifies the identifier of an error message. See [Localization string IDs](localization-string-ids.md) for a complete list of the `UxElement` identifiers.|

## ElementType

The ElementType reference to a claim type, a claim transformation, or a user interface element in the policy to be localized.

| Element to localize | ElementType | ElementId |StringId |
| --------- | -------- | ----------- |----------- |
| Identity provider name |`ClaimsProvider`| | The ID of the ClaimsExchange element|
| Claim type attributes|`ClaimType`|Name of the claim type| The attribute of the claim to be localized. Possible values: `AdminHelpText`, `DisplayName`, `PatternHelpText`, and `UserHelpText`.|
|Error message|`ErrorMessage`||The ID of the error message |
|Copies localized strings into claims|`GetLocalizedStringsTra nsformationClaimType`||The name of the output claim|
|Predicate user message|`Predicate`|The name of the predicate| The attribute of the predicate to be localized. Possible values: `HelpText`.|
|Predicate group user message|`PredicateValidation`|The ID of the PredicateValidation element.|The ID of the PredicateGroup element. The predicate group must be a child of the predicate validation element as defined in the ElementId.|
|User interface elements |`UxElement` | | The ID of the user interface element to be localized.|
|[Display Control](display-controls.md) |`DisplayControl` |The ID of the display control. | The ID of the user interface element to be localized.|

## Examples

### ClaimsProvider

The ClaimsProvider value is used to localize one of the claim providers display name. 

```xml
<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="FacebookExchange" TechnicalProfileReferenceId="Facebook-OAUTH" />
    <ClaimsExchange Id="GoogleExchange" TechnicalProfileReferenceId="Google-OAUTH" />
    <ClaimsExchange Id="LinkedInExchange" TechnicalProfileReferenceId="LinkedIn-OAUTH" />
  </ClaimsExchanges>
</OrchestrationStep>

```

The following example shows how to localize claim providers' display name.

```xml
<LocalizedString ElementType="ClaimsProvider" StringId="FacebookExchange">Facebook</LocalizedString>
<LocalizedString ElementType="ClaimsProvider" StringId="GoogleExchange">Google</LocalizedString>
<LocalizedString ElementType="ClaimsProvider" StringId="LinkedInExchange">LinkedIn</LocalizedString>
```

### ClaimType

The ClaimType value is used to localize one of the claim attributes. 

```xml
<ClaimType Id="email">
  <DisplayName>Email Address</DisplayName>
  <DataType>string</DataType>
  <UserHelpText>Email address that can be used to contact you.</UserHelpText>
  <UserInputType>TextBox</UserInputType>
</ClaimType>
```

The following example shows how to localize the DisplayName, UserHelpText, and PatternHelpText attributes of the email claim type.

```xml
<LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email</LocalizedString>
<LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Please enter your email</LocalizedString>
<LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Please enter a valid email address</LocalizedString>
```

### ErrorMessage

The ErrorMessage value is used to localize one of the system error messages. 

```xml
<TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">
  <Metadata>
    <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">true</Item>
    <Item Key="UserMessageIfClaimsPrincipalAlreadyExists">You are already registered, please press the back button and sign in instead.</Item>
  </Metadata>
  ...
</TechnicalProfile>
```

The following example shows how to localize the UserMessageIfClaimsPrincipalAlreadyExists error message.


```xml
<LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">The account you are trying to create already exists, please sign-in.</LocalizedString>
```

### FormatLocalizedStringTransformationClaimType

The FormatLocalizedStringTransformationClaimType value is used to format claims into a localized string. For more information, see [FormatLocalizedString claims transformation](string-transformations.md#formatlocalizedstring)


```xml
<ClaimsTransformation Id="SetResponseMessageForEmailAlreadyExists" TransformationMethod="FormatLocalizedString">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="stringFormatId" DataType="string" Value="ResponseMessge_EmailExists" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="responseMsg" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

The following example shows how to localize string format of the FormatLocalizedStringTransformationClaimType claims transformation.

```xml
<LocalizedString ElementType="FormatLocalizedStringTransformationClaimType" StringId="ResponseMessge_EmailExists">The email '{0}' is already an account in this organization. Click Next to sign in with that account.</LocalizedString>
```

### GetLocalizedStringsTransformationClaimType

The GetLocalizedStringsTransformationClaimType value is used to copy localized strings into claims. For more information, see [GetLocalizedStringsTransformation claims transformation](string-transformations.md#getlocalizedstringstransformation)


```xml
<ClaimsTransformation Id="GetLocalizedStringsForEmail" TransformationMethod="GetLocalizedStringsTransformation">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="subject" TransformationClaimType="email_subject" />
    <OutputClaim ClaimTypeReferenceId="message" TransformationClaimType="email_message" />
    <OutputClaim ClaimTypeReferenceId="codeIntro" TransformationClaimType="email_code" />
    <OutputClaim ClaimTypeReferenceId="signature" TransformationClaimType="email_signature" />
   </OutputClaims>
</ClaimsTransformation>
```

The following example shows how to localize output claims of the GetLocalizedStringsTransformation claims transformation.

```xml
<LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_subject">Contoso account email verification code</LocalizedString>
<LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_message">Thanks for verifying your account!</LocalizedString>
<LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_code">Your code is</LocalizedString>
<LocalizedString ElementType="GetLocalizedStringsTransformationClaimType" StringId="email_signature">Sincerely</LocalizedString>
```

### Predicate

The Predicate value is used to localize one of the [Predicate](predicates.md) error messages. 

```xml
<Predicates>
  <Predicate Id="LengthRange" Method="IsLengthRange"  HelpText="The password must be between 6 and 64 characters.">
    <Parameters>
      <Parameter Id="Minimum">6</Parameter>
      <Parameter Id="Maximum">64</Parameter>
    </Parameters>
  </Predicate>
  <Predicate Id="Lowercase" Method="IncludesCharacters" HelpText="a lowercase letter">
    <Parameters>
      <Parameter Id="CharacterSet">a-z</Parameter>
    </Parameters>
  </Predicate>
  <Predicate Id="Uppercase" Method="IncludesCharacters" HelpText="an uppercase letter">
    <Parameters>
      <Parameter Id="CharacterSet">A-Z</Parameter>
    </Parameters>
  </Predicate>
</Predicates>
```

The following example shows how to localize predicates help text.

```xml
<LocalizedString ElementType="Predicate" ElementId="LengthRange" StringId="HelpText">The password must be between 6 and 64 characters.</LocalizedString>
<LocalizedString ElementType="Predicate" ElementId="Lowercase" StringId="HelpText">a lowercase letter</LocalizedString>
<LocalizedString ElementType="Predicate" ElementId="Uppercase" StringId="HelpText">an uppercase letter</LocalizedString>
```

### PredicateValidation

The PredicateValidation value is used to localize one of the [PredicateValidation](predicates.md) group error messages. 

```xml
<PredicateValidations>
  <PredicateValidation Id="CustomPassword">
    <PredicateGroups>
      <PredicateGroup Id="LengthGroup">
        <PredicateReferences MatchAtLeast="1">
          <PredicateReference Id="LengthRange" />
        </PredicateReferences>
      </PredicateGroup>
      <PredicateGroup Id="CharacterClasses">
        <UserHelpText>The password must have at least 3 of the following:</UserHelpText>
        <PredicateReferences MatchAtLeast="3">
          <PredicateReference Id="Lowercase" />
          <PredicateReference Id="Uppercase" />
          <PredicateReference Id="Number" />
          <PredicateReference Id="Symbol" />
        </PredicateReferences>
      </PredicateGroup>
    </PredicateGroups>
  </PredicateValidation>
</PredicateValidations>
```

The following example shows how to localize a predicate validation group help text.

```xml
<LocalizedString ElementType="PredicateValidation" ElementId="CustomPassword" StringId="CharacterClasses">The password must have at least 3 of the following:</LocalizedString>
```

### UxElement

The UxElement value is used to localize one of the user interface elements. The following example shows how to localize the continue and cancel buttons.

```xml
<LocalizedString ElementType="UxElement" StringId="button_continue">Create new account</LocalizedString>
<LocalizedString ElementType="UxElement" StringId="button_cancel">Cancel</LocalizedString>
```

### DisplayControl

The DisplayControl value is used to localize one of the [display Control](display-controls.md) user interface elements. When enabled, the display control localizedStrings takes the ***precedence*** over some of the **UxElement** StringIDs like **ver_but_send**, **ver_but_edit**, **ver_but_resend** and **ver_but_verify**. The following example shows how to localize the send and verify buttons. 

```xml
<LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_send_code">Send verification code</LocalizedString>
<LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_verify_code">Verify code</LocalizedString>
```

In the Metadata section of a self-asserted technical profile, the referenced ContentDefinition needs to have DataUri set to [page layout version](page-layout.md) 2.1.0 or higher. For example:

```xml
<ContentDefinition Id="api.selfasserted">
  <DataUri>urn:com:microsoft:aad:b2c:elements:selfasserted:2.1.0</DataUri>
  ...
```

## Next steps

See the following articles for localization examples:

- [Language customization with custom policy in Azure Active Directory B2C](language-customization.md)
- [Language customization with user flows in Azure Active Directory B2C](language-customization.md)
