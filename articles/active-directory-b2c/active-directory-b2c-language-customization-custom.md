---
title: Language customization in Azure Active Directory B2C custom policies | Microsoft Docs
description: Learn how to use localize content in custom policies for multiple languages.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/13/2017
ms.author: davidmu
ms.component: B2C
---

# Language customization in custom policies

> [!NOTE]
> This feature is in public preview.
> 

In custom policies, language customization works the same as in built-in policies.  See the built-in [documentation](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-language-customization) that describes the behavior in how a language is chosen based on the parameters and browser settings.

## Enable supported languages
If ui-locales was not specified and the user's browser asks for one of these languages, supported languages are shown to the user.  

Supported languages are defined in `<BuildingBlocks>` in the following format:

```XML
<BuildingBlocks>
  <Localization>
    <SupportedLanguages DefaultLanguage="en">
      <SupportedLanguage>qps-ploc</SupportedLanguage>
      <SupportedLanguage>en</SupportedLanguage>
    </SupportedLanguages>
  </Localization>
</BuildingBlocks>
```

Default language and supported languages behave in the same way as they do in built-in policies.

## Enable custom language strings

Creating custom language strings requires two steps:
1. Edit the `<ContentDefinition>` for the page to specify a resource ID for the desired languages
2. Create the `<LocalizedResources>` with corresponding IDs in your `<BuildingBlocks>`

Keep in mind that you can put a `<ContentDefinition>` and `<BuildingBlock>` in both your extension file or the relying policy file depending on whether you want the changes to be in all your inheriting policies or not.

### Edit the ContentDefinition for the page

For each page you want to localize, you can specify in the `<ContentDefinition>` what language resources to look for each language code.

```XML
<ContentDefinition Id="api.signuporsignin">
      <LocalizedResourcesReferences>
        <LocalizedResourcesReference Language="fr" LocalizedResourcesReferenceId="fr" />
        <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="en" />
      </LocalizedResourcesReferences>
</ContentDefinition>
```

In this sample, French (fr) and English (en) custom strings are added to the Unified sign-up or sign-in page.  The `LocalizedResourcesReferenceId` for each `LocalizedResourcesReference` is the same as their locale, but you could use any string as the ID.  For each language and page combination, you have to create a corresponding `<LocalizedResources>` shown in the following.


### Create the LocalizedResources

Your overrides are contained in your `<BuildingBlocks>` and there is a `<LocalizedResources>` for each page and language you have specified in the `<ContentDefinition>` for each page.  Each override is specified as a `<LocalizedString>` such as in the following sample:

```XML
<BuildingBlocks>
  <Localization>
    <LocalizedResources Id="en">
      <LocalizedStrings>
        <LocalizedString ElementType="ClaimsProvider" StringId="SignInWithLogonNameExchange">Local Account Sign-in</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="UserId" StringId="DisplayName">Username</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="UserId" StringId="UserHelpText">Username used for signing in.</LocalizedString>
        <LocalizedString ElementType="ClaimType" ElementId="UserId" StringId="PatternHelpText">The username you provided is not valid.</LocalizedString>
        <LocalizedString ElementType="UxElement" StringId="button_signin">Sign In Now</LocalizedString>
        <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidPassword">Your password is incorrect.</LocalizedString>
      </LocalizedStrings>
    </LocalizedResources>
  </Localization>
</BuildingBlocks>
```

There are four types of string elements on the page:

**ClaimsProvider** - Labels for your identity providers (Facebook, Google, Azure AD etc.)
**ClaimType** - Labels for your attributes and their corresponding help text, or field validation errors
**UxElement** - Other string elements on the page that are there by default, such as buttons, links, or text
**ErrorMessage** - Form validation error messages

Ensure that the `StringId`s match for the page that you are using these overrides otherwise it is blocked by policy validation on upload.  