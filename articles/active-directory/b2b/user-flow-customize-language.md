---
title: Language customization in Azure AD user flows
description: Learn about customizing the language experience in your user flows.
services: active-directory
author: msmimart
manager: celestedg

ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: mimart
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Language customization in Azure Active Directory (Preview)
|     |
| --- |
| Self-service sign-up is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).|
|     |

Language customization in Azure Active Directory (Azure AD) allows your user flow to accommodate different languages to suit your user's needs. Microsoft provides the translations for [36 languages](#supported-languages). Even if your experience is provided for only a single language, you can customize the attribute names on the attribute collection page.

## How language customization works

By default, language customization is enabled for users signing up to ensure a consistent sign up experience. You can use languages to modify the strings displayed to users as part of the attribute collection process during sign up.

> [!NOTE]
> If you're using custom user attributes, you need to provide your own translations. For more information, see [Customize your strings](#customize-your-strings).

## Customize your strings

Language customization enables you to customize any string in your user flow.

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **User flows (Preview)**.
3. Select the user flow that you want to enable for translations.
4. Select **Languages**.
5. On the **Languages** page for the user flow, select the language that you want to customize.
6. Expand **Attribute collection page**.
7. Select **Download defaults** (or **Download overrides** if you have previously edited this language).

These steps give you a JSON file that you can use to start editing your strings.

### Change any string on the page

1. Open the JSON file downloaded from previous instructions in a JSON editor.
1. Find the element that you want to change. You can find `StringId` for the string you're looking for, or look for the `Value` attribute that you want to change.
1. Update the `Value` attribute with what you want displayed.
1. For every string that you want to change, change `Override` to `true`.
1. Save the file and upload your changes. (You can find the upload control in the same place as where you downloaded the JSON file.)

> [!IMPORTANT]
> If you need to override a string, make sure to set the `Override` value to `true`. If the value isn't changed, the entry is ignored.

### Change extension attributes

If you want to change the string for a custom user attribute, or you want to add one to the JSON, it's in the following format:

```JSON
{
  "LocalizedStrings": [
    {
      "ElementType": "ClaimType",
      "ElementId": "extension_<ExtensionAttribute>",
      "StringId": "DisplayName",
      "Override": true,
      "Value": "<ExtensionAttributeValue>"
    }
    [...]
}
```

Replace `<ExtensionAttribute>` with the name of your custom user attribute.

Replace `<ExtensionAttributeValue>` with the new string to be displayed.

### Provide a list of values by using LocalizedCollections

If you want to provide a set list of values for responses, you need to create a `LocalizedCollections` attribute. `LocalizedCollections` is an array of `Name` and `Value` pairs. The order for the items will be the order they are displayed. To add `LocalizedCollections`, use the following format:

```JSON
{
  "LocalizedStrings": [...],
  "LocalizedCollections": [{
      "ElementType":"ClaimType",
      "ElementId":"<UserAttribute>",
      "TargetCollection":"Restriction",
      "Override": true,
      "Items":[
           {
                "Name":"<Response1>",
                "Value":"<Value1>"
           },
           {
                "Name":"<Response2>",
                "Value":"<Value2>"
           }
     ]
  }]
}
```

* `ElementId` is the user attribute that this `LocalizedCollections` attribute is a response to.
* `Name` is the value that's shown to the user.
* `Value` is what is returned in the claim when this option is selected.

### Upload your changes

1. After you complete the changes to your JSON file, go back to your tenant.
1. Select **User flows** and click the user flow that you want to enable for translations.
1. Select **Languages**.
1. Select the language that you want to translate to.
1. Select **Attribute collection page**.
1. Select the folder icon, and select the JSON file to upload.

The changes are saved to your user flow automatically.

## Additional information

### Page UI customization labels as overrides

When you enable language customization, your previous edits for labels using page UI customization are persisted in a JSON file for English (en). You can continue to change your labels and other strings by uploading language resources in language customization.

### Up-to-date translations

Microsoft is committed to providing the most up-to-date translations for your use. Microsoft continuously improves translations and keeps them in compliance for you. Microsoft will identify bugs and changes in global terminology and make updates that will work seamlessly in your user flow.

### Support for right-to-left languages

Microsoft currently doesn't provide support for right-to-left languages. You can accomplish this by using custom locales and using CSS to change the way the strings are displayed. If you need this feature, please vote for it on [Azure Feedback](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/19393000-provide-language-support-for-right-to-left-languag).

### Social identity provider translations

Microsoft provides the `ui_locales` OIDC parameter to social logins. But some social identity providers, including Facebook and Google, don't honor them.

### Browser behavior

Chrome and Firefox both request for their set language. If it's a supported language, it's displayed before the default. Microsoft Edge currently does not request a language and goes straight to the default language.

## Supported languages

Azure AD includes support for the following languages. User flow languages are provided by Azure AD. The multi-factor authentication (MFA) notification languages are provided by [Azure MFA](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks).

| Language              | Language code | User flows         | MFA notifications  |
|-----------------------| :-----------: | :----------------: | :----------------: |
| Arabic                | ar            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Bulgarian             | bg            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Bangla                | bn            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Catalan               | ca            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Czech                 | cs            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Danish                | da            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| German                | de            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Greek                 | el            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| English               | en            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Spanish               | es            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Estonian              | et            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Basque                | eu            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Finnish               | fi            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| French                | fr            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Galician              | gl            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Gujarati              | gu            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Hebrew                | he            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Hindi                 | hi            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Croatian              | hr            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Hungarian             | hu            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Indonesian            | id            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Italian               | it            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Japanese              | ja            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Kazakh                | kk            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Kannada               | kn            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Korean                | ko            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Lithuanian            | lt            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Latvian               | lv            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Malayalam             | ml            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Marathi               | mr            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Malay                 | ms            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Norwegian Bokmal      | nb            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Dutch                 | nl            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Norwegian             | no            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Punjabi               | pa            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Polish                | pl            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Portuguese - Brazil   | pt-br         | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Portuguese - Portugal | pt-pt         | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Romanian              | ro            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Russian               | ru            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Slovak                | sk            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Slovenian             | sl            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Serbian - Cyrillic    | sr-cryl-cs    | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Serbian - Latin       | sr-latn-cs    | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Swedish               | sv            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Tamil                 | ta            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Telugu                | te            | ![yes](./media/user-flow-customize-language/yes.png) | ![no](./media/user-flow-customize-language/no.png) |
| Thai                  | th            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Turkish               | tr            | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Ukrainian             | uk            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Vietnamese            | vi            | ![no](./media/user-flow-customize-language/no.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Chinese - Simplified  | zh-hans       | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |
| Chinese - Traditional | zh-hant       | ![yes](./media/user-flow-customize-language/yes.png) | ![yes](./media/user-flow-customize-language/yes.png) |