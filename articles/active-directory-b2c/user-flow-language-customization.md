---
title: Language customization in Azure Active Directory B2C
description: Learn about customizing the language experience in your user flows.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/13/2019
ms.author: mimart
ms.subservice: B2C
---

# Language customization in Azure Active Directory B2C

Language customization in Azure Active Directory B2C (Azure AD B2C) allows your user flow to accommodate different languages to suit your customer needs. Microsoft provides the translations for [36 languages](#supported-languages), but you can also provide your own translations for any language. Even if your experience is provided for only a single language, you can customize any text on the pages.

## How language customization works

You use language customization to select which languages your user flow is available in. After the feature is enabled, you can provide the query string parameter, `ui_locales`, from your application. When you call into Azure AD B2C, your page is translated to the locale that you have indicated. This type of configuration gives you complete control over the languages in your user flow and ignores the language settings of the customer's browser.

You might not need that level of control over what languages your customer sees. If you don't provide a `ui_locales` parameter, the customer's experience is dictated by their browser's settings. You can still control which languages your user flow is translated to by adding it as a supported language. If a customer's browser is set to show a language that you don't want to support, then the language that you selected as a default in supported cultures is shown instead.

* **ui-locales specified language**: After you enable language customization, your user flow is translated to the language that's specified here.
* **Browser-requested language**: If no `ui_locales` parameter was specified, your user flow is translated to the browser-requested language, *if the language is supported*.
* **Policy default language**: If the browser doesn't specify a language, or it specifies one that is not supported, the user flow is translated to the user flow default language.

> [!NOTE]
> If you're using custom user attributes, you need to provide your own translations. For more information, see [Customize your strings](#customize-your-strings).

## Support requested languages for ui_locales

Policies that were created before the general availability of language customization need to enable this feature first. Policies and user flows that were created after have language customization enabled by default.

When you enable language customization on a user flow, you can control the language of the user flow by adding the `ui_locales` parameter.

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to enable for translations.
1. Select **Languages**.
1. Select **Enable language customization**.

## Select which languages in your user flow are enabled

Enable a set of languages for your user flow to be translated to when requested by the browser without the `ui_locales` parameter.

1. Ensure that your user flow has language customization enabled from previous instructions.
1. On the **Languages** page for the user flow, select a language that you want to support.
1. In the properties pane, change **Enabled** to **Yes**.
1. Select **Save** at the top of the properties pane.

>[!NOTE]
>If a `ui_locales` parameter is not provided, the page is translated to the customer's browser language only if it is enabled.
>

## Customize your strings

Language customization enables you to customize any string in your user flow.

1. Ensure that your user flow has language customization enabled from the previous instructions.
1. On the **Languages** page for the user flow, select the language that you want to customize.
1. Under **Page-level-resources files**, select the page that you want to edit.
1. Select **Download defaults** (or **Download overrides** if you have previously edited this language).

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

```json
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

```json
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

1. After you complete the changes to your JSON file, go back to your B2C tenant.
1. Select **User flows** and click the user flow that you want to enable for translations.
1. Select **Languages**.
1. Select the language that you want to translate to.
1. Select the page where you want to provide translations.
1. Select the folder icon, and select the JSON file to upload.

The changes are saved to your user flow automatically.

## Customize the page UI by using language customization

There are two ways to localize your HTML content. One way is to turn on [language customization](user-flow-language-customization.md). Enabling this feature allows Azure AD B2C to forward the OpenID Connect parameter, `ui-locales`, to your endpoint. Your content server can use this parameter to provide customized HTML pages that are language-specific.

Alternatively, you can pull content from different places based on the locale that's used. In your CORS-enabled endpoint, you can set up a folder structure to host content for specific languages. You'll call the right one if you use the wildcard value `{Culture:RFC5646}`. For example, assume that this is your custom page URI:

```
https://wingtiptoysb2c.blob.core.windows.net/{Culture:RFC5646}/wingtip/unified.html
```

You can load the page in `fr`. When the page pulls HTML and CSS content, it's pulling from:

```
https://wingtiptoysb2c.blob.core.windows.net/fr/wingtip/unified.html
```

## Add custom languages

You can also add languages that Microsoft currently does not provide translations for. You'll need to provide the translations for all the strings in the user flow. Language and locale codes are limited to those in the ISO 639-1 standard.

1. In your Azure AD B2C tenant, select **User flows**.
2. Click the user flow where you want to add custom languages, and then click **Languages**.
3. Select **Add custom language** from the top of the page.
4. In the context pane that opens, identify which language you're providing translations for by entering a valid locale code.
5. For each page, you can download a set of overrides for English and work on the translations.
6. After you're done with the JSON files, you can upload them for each page.
7. Select **Enable**, and your user flow can now show this language for your users.
8. Save the language.

>[!IMPORTANT]
>You need to either enable the custom languages or upload overrides for it before you can save.

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

Azure AD B2C includes support for the following languages. User flow languages are provided by Azure AD B2C. The multi-factor authentication (MFA) notification languages are provided by [Azure MFA](../active-directory/authentication/concept-mfa-howitworks.md).

| Language              | Language code | User flows         | MFA notifications  |
|-----------------------| :-----------: | :----------------: | :----------------: |
| Arabic                | ar            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Bulgarian             | bg            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Bangla                | bn            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Catalan               | ca            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Czech                 | cs            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Danish                | da            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| German                | de            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Greek                 | el            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| English               | en            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Spanish               | es            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Estonian              | et            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Basque                | eu            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Finnish               | fi            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| French                | fr            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Galician              | gl            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Gujarati              | gu            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Hebrew                | he            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Hindi                 | hi            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Croatian              | hr            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Hungarian             | hu            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Indonesian            | id            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Italian               | it            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Japanese              | ja            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Kazakh                | kk            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Kannada               | kn            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Korean                | ko            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Lithuanian            | lt            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Latvian               | lv            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Malayalam             | ml            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Marathi               | mr            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Malay                 | ms            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Norwegian Bokmal      | nb            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Dutch                 | nl            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Norwegian             | no            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Punjabi               | pa            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Polish                | pl            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Portuguese - Brazil   | pt-br         | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Portuguese - Portugal | pt-pt         | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Romanian              | ro            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Russian               | ru            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Slovak                | sk            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Slovenian             | sl            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Serbian - Cyrillic    | sr-cryl-cs    | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Serbian - Latin       | sr-latn-cs    | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Swedish               | sv            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Tamil                 | ta            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Telugu                | te            | ![yes](./media/user-flow-language-customization/yes.png) | ![no](./media/user-flow-language-customization/no.png) |
| Thai                  | th            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Turkish               | tr            | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Ukrainian             | uk            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Vietnamese            | vi            | ![no](./media/user-flow-language-customization/no.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Chinese - Simplified  | zh-hans       | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
| Chinese - Traditional | zh-hant       | ![yes](./media/user-flow-language-customization/yes.png) | ![yes](./media/user-flow-language-customization/yes.png) |
