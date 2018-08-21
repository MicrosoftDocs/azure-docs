---
title: Localization | Microsoft Docs
description: Specify the Localization element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/17/2018
ms.author: davidmu
ms.component: B2C
---

# Localization  

The `Localization` element allows you to support multiple locales or languages in the policy for the user journeys. The localization support in policies allows you to:

- Set up the explicit list of the supported languages in a policy and pick a default language.
- Provide language-specific strings and collections.

```XML
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
  </SupportedLanguages>
  <LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedResources Id="api.localaccountsignup.es">
  ...
```

The `Localization` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Enabled | No | True or False |

The `Localization` element contains following XML elements

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SupportedLanguages | 1:n | List of supported languages. | 
| LocalizedResources | 0:n | List of localized resources. |

## SupportedLanguages

The `SupportedLanguages` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| DefaultLanguage | Yes | The language to be used as the default for localized resources. |
| MergeBehavior | No | An enumeration values of values that are merged together with any ClaimType present in a parent policy with the same identifier. Use this attribute when you overwrite a claim specified in base policy. Possible values: **Append** - Specifies that the collection of data present should be appended to the end of the collection specified in the parent policy; **Prepend** -  Specifies that the collection of data present should be added before the collection specified in the parent policy; **ReplaceAll** - Specifies that the collection of data defined in the parent policy should be ignored, using instead the data defined in the current policy. |

### SupportedLanguages

The `SupportedLanguages` element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SupportedLanguage | 1:n | Displays content that conforms to a language tag per RFC 5646 - Tags for Identifying Languages. | 

## LocalizedResources

The `LocalizedResources` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier that is used to uniquely identify localized resources. |

The `LocalizedResources` element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedCollections | 0:n | Defines entire collections in various cultures. A collection can have different number of items and different strings for various cultures. Examples of collections include the enumerations that appear in claim types. For example, a country/region list is shown to the user in a drop-down list. |
| LocalizedStrings | 0:n | Defines all of the strings, except those strings that appear in collections, in various cultures. |

### LocalizedCollections

The `LocalizedCollections` element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedCollection | 1:n | List of supported languages. |

#### LocalizedCollection

The `LocalizedCollection` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ElementType | Yes | References a ClaimType element or a user interface element in the policy file. |
| ElementId | Yes | A string that contains a reference to a claim type already defined in the ClaimsSchema section that is used if `ElementType` is set to ClaimType. |
| TargetCollection | Yes | The target collection. |

The `LocalizedCollection` element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Item | 0:n | Defines an available option for the user to select for a claim in the user interface, such as a value in a dropdown. |

The `Item` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Text | Yes | The user-friendly display string that should be shown to the user in the user interface for this option. |
| Value | Yes | The string claim value associated with selecting this option. |

The following example shows the use of the `LocalizedCollections` element. It contains two `LocalizedCollection` elements, one for English and another one for Spanish. Both set the `Restriction` collection of the claim Gender with a list of items for English and Spanish.

```XML
<LocalizedResources Id="api.selfasserted.en">
 <LocalizedCollections>
   <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Female" Value="F" />
      <Item Text="Male" Value="M" />
    </LocalizedCollection>
</LocalizedCollections>

<LocalizedResources Id="api.selfasserted.es">
 <LocalizedCollections>
   <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Femenino" Value="F" />
      <Item Text="Masculino" Value="M" />
    </LocalizedCollection>
</LocalizedCollections>

```

### LocalizedStrings

The `LocalizedStrings` element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedString | 1:n | A localized string. |

The `LocalizedString` element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ElementType | Yes | References to a ClaimType element or a user interface element in the policy. Possible values: **ClaimType** - To localize one of the claim attributes, as specify in the StringId; **UxElement** - To localize one of the user interface elements, as specify in the StringId; **ErrorMessage** - To localize one of the system error messages, as specify in the StringId. |
| ElementId | Yes | If `ElementType` is set to **ClaimType**, this element contains a reference to a claim type already defined in the ClaimsSchema section. |
| StringId | Yes | If `ElementType` is set to **ClaimType**, this element specifies the attribute of a particular claim type. Possible values: **DisplayName** - to set the claim display name; **AdminHelpText** - to set the claim user help text name; **PatternHelpText** - to set the claim pattern help text. <br/>&nbsp;<br/>If `ElementType` is set to **UxElement**, this element specifies the attribute of a particular user interface element id. If `ElementType` is set to **ErrorMessage**, this element specifies the ID of a particular error message. Following document describes the list of supported [localiztion Ids](localization-string-ids) |


The following example shows a localized sign-up page. The first 3 `LocalizedString` values set the claim attribute. The third changes the value of the continue button. The last one changes the error message.

```XML
<LocalizedResources Id="api.selfasserted.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Please enter your email</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Please enter a valid email address</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_continue">Create new account</LocalizedString>
   <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">The account you try to create already exists, please sign-in.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Localization step by step
This tutorial shows you how to support multiple locales or languages in the policy for the user journeys requires three steps:

### Step 1 Set-up the explicit list of the supported languages

Under the `BuildingBlocks` element add the `Localization` with the list of supported languages. The following XML snippet illustrates how to define the localization support for both English (default) and Spanish:

```XML
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
  </SupportedLanguages>
</Localization>
```

### Step 2 Provide language-specific strings and collections
Add `LocalizedResources` elements inside the `Localization` element, medially after the close of the `</SupportedLanguages>` element. You add `LocalizedResources` for each page (content definition) and any language you want to support. To customize the unified sign-up or sign-in page, sign-up and multi-factor authentication (MFA) pages for English, Spanish, and France, you add following `LocalizedResources` elements. 
- Unified sign-up or sign-in page, English `<LocalizedResources Id="api.api.signuporsignin.en">`
- Unified sign-up or sign-in page, Spanish `<LocalizedResources Id="api.api.signuporsignin.es">`
- Unified sign-up or sign-in page, France `<LocalizedResources Id="api.api.signuporsignin.fr">` 
- Sign-Up, English `<LocalizedResources Id="api.localaccountsignup.es">`
- Sign-Up, Spanish `<LocalizedResources Id="api.localaccountsignup.en">`
- Sign-Up, France `<LocalizedResources Id="api.localaccountsignup.fr">`
- MFA, English `<LocalizedResources Id="api.phonefactor.es">`
- MFA, Spanish `<LocalizedResources Id="api.phonefactor.en">`
- MFA, France `<LocalizedResources Id="api.phonefactor.fr">`

Each `LocalizedResources` contains all of the required  `LocalizedStrings` with multiple `LocalizedString` elements and `LocalizedCollections` with multiple `LocalizedCollection` elements.  Following example, adds the sign-up page English localization. 

Note: This example makes a reference to `Gender` and `City` claim types. To use this example, make sure you define those claims. For more information, read [claimsschema](ClaimsSchema)

```XML
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Please enter your email</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Please enter a valid email address</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_continue">Create new account</LocalizedString>
   <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">The account you try to create already exists, please sign-in.</LocalizedString>
  </LocalizedStrings>
 <LocalizedCollections>
   <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Female" Value="F" />
      <Item Text="Male" Value="M" />
    </LocalizedCollection>
   <LocalizedCollection ElementType="ClaimType" ElementId="City" TargetCollection="Restriction">
      <Item Text="New York" Value="NY" />
      <Item Text="Paris" Value="Paris" />
      <Item Text="London" Value="London" />
    </LocalizedCollection>
  </LocalizedCollections>
</LocalizedResources>
```

The sign-up page localization for Spanish.

```XML
<LocalizedResources Id="api.localaccountsignup.es">
  <LocalizedStrings>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Dirección de correo electrónico</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Dirección de correo electrónico que puede usarse para ponerse en contacto con usted.</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Introduzca una dirección de correo electrónico.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_continue">Crear</LocalizedString>
   <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">Ya existe un usuario con el id. especificado. Elija otro diferente.</LocalizedString>
  </LocalizedStrings>
 <LocalizedCollections>
   <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
      <Item Text="Femenino" Value="F" />
      <Item Text="Masculino" Value="M" />
    </LocalizedCollection>
   <LocalizedCollection ElementType="ClaimType" ElementId="City" TargetCollection="Restriction">
      <Item Text="Nueva York" Value="NY" />
      <Item Text="París" Value="Paris" />
      <Item Text="Londres" Value="London" />
    </LocalizedCollection>
  </LocalizedCollections>
</LocalizedResources>
```

### Step 3 Edit the ContentDefinition for the page
For each page you want to localize, you can specify in the `ContentDefinition` what language resources to look for each language code.

In following sample, English (en) and Spanish (es) custom strings are added to the sign-up page. The `LocalizedResourcesReferenceId` for each `LocalizedResourcesReference` is the same as their locale, but you could use any string as the ID. For each language and page combination, you point to the  corresponding `<LocalizedResources>` you created earlier.

```XML
<ContentDefinition Id="api.localaccountsignup">
...
  <LocalizedResourcesReferences MergeBehavior="Prepend">
    <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.localaccountsignup.en" />
    <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.localaccountsignup.es" />
  </LocalizedResourcesReferences>
</ContentDefinition>
```

The final XML should look like  XML snippet:
```XML
<BuildingBlocks>
  <ContentDefinitions>
    <ContentDefinition Id="api.localaccountsignup">
      <!-- Other content definitions elements... -->
      <LocalizedResourcesReferences MergeBehavior="Prepend">
         <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.localaccountsignup.en" />
         <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.localaccountsignup.es" />
      </LocalizedResourcesReferences>
    </ContentDefinition>
    <!-- More content definitions... -->
  </ContentDefinitions>

  <Localization Enabled="true">

    <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
      <SupportedLanguage>en</SupportedLanguage>
      <SupportedLanguage>es</SupportedLanguage>
      <!-- More supported language... -->
    </SupportedLanguages>

    <LocalizedResources Id="api.localaccountsignup.en">
      <LocalizedStrings>
        <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Please enter your email</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Please enter a valid email address</LocalizedString>
        <LocalizedString ElementType="UxElement" StringId="button_continue">Create new account</LocalizedString>
       <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">The account you try to create already exists, please sign-in.</LocalizedString>
        <!-- More localized strings... -->
      </LocalizedStrings>
      <LocalizedCollections>
        <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
          <Item Text="Female" Value="F" />
          <Item Text="Male" Value="M" />
          <!-- More items... -->
        </LocalizedCollection>
        <LocalizedCollection ElementType="ClaimType" ElementId="City" TargetCollection="Restriction">
          <Item Text="New York" Value="NY" />
          <Item Text="Paris" Value="Paris" />
          <Item Text="London" Value="London" />
        </LocalizedCollection>
        <!-- More localized collections... -->
      </LocalizedCollections>
    </LocalizedResources>

    <LocalizedResources Id="api.localaccountsignup.es">
      <LocalizedStrings>
        <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Dirección de correo electrónico</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Dirección de correo electrónico que puede usarse para ponerse en contacto con usted.</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Introduzca una dirección de correo electrónico.</LocalizedString>
        <LocalizedString ElementType="UxElement" StringId="button_continue">Crear</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">Ya existe un usuario con el id. especificado. Elija otro diferente.</LocalizedString>
      </LocalizedStrings>
      <LocalizedCollections>
       <LocalizedCollection ElementType="ClaimType" ElementId="Gender" TargetCollection="Restriction">
          <Item Text="Femenino" Value="F" />
          <Item Text="Masculino" Value="M" />
        </LocalizedCollection>
        <LocalizedCollection ElementType="ClaimType" ElementId="City" TargetCollection="Restriction">
          <Item Text="Nueva York" Value="NY" />
          <Item Text="París" Value="Paris" />
          <Item Text="Londres" Value="London" />
        </LocalizedCollection>
      </LocalizedCollections>
    </LocalizedResources>
    <!-- More localized resources... -->
  </Localization>
</BuildingBlocks>
```




