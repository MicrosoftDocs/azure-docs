---
title: 'Azure Active Directory B2C: Using language customization | Microsoft Docs'
description: 
services: active-directory-b2c
documentationcenter: ''
author: sama

ms.assetid: eec4d418-453f-4755-8b30-5ed997841b56
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/25/2017
ms.author: sama

---
# Azure Active Directory B2C: Using language customization

>[!NOTE] 
>This feature is in public preview.  It is recommended that you use a test tenant when using this feature.  We don't plan on any breaking changes from the preview to the general availability release, but we reserve the right to make such changes to improve the feature.  Once you've had a chance to try feature, please provide feedback on your experiences and how we can make it better.  You can provide feedback through the Azure portal with the smiley face tool on the top right.   If there is a business requirement for you to go live using this feature during the preview phase, let us know your scenarios and we can provide you with the proper guidance and assistance.  You can contact us at [aadb2cpreview@microsoft.com](mailto:aadb2cpreview@microsoft.com).

Language customization allows you to change your user journey to a different language to suit your customer needs.  We provide translations for 36 languages (see [Additional information](#additional-information)).  Even if your experience is only provided for a single language, you can customize any text on the pages to suit your needs.  

## How does Language customization work?
Language customization allows you to select which languages your user journey is available in.  Once the feature is enabled, you can provide the query string parameter, ui_locales, from your application.  When you call into Azure AD B2C, we translate your page to the locale that you have indicated.  Using type of configuration gives you complete control over the languages in your user journey and ignores the language settings of the customer's browser. Alternatively, you may not need that level of control over what languages your customer see.  If you don't provide a ui_locales parameter, the customer's experience is dictated by their browser's settings.  You can still control which languages your user journey is translated to by adding it as a supported language.  If a customer's browser is set to show a language you don't want to support, then the language you selected as a default in supported cultures is shown instead.

1. **ui-locales specified language** - Once you enable Language customization, your user journey is translated to the language specified here
2. **Browser requested language** - If no ui-locales was specified, it translates to the browser requested language, **if it was included in Supported languages**
3. **Policy default language** - If the browser doesn't specify a language, or it specifies one that is not supported, it translates to the policy default language

>[!NOTE]
>If you are using custom user attributes, you need to provide your own translations. See '[Customize your strings](#customize-your-strings)' for details.
>

## Support ui_locales requested languages 
By enabling 'Language customization' on a policy, you can now control the language of the user journey by adding the ui_locales parameter.
1. [Follow these steps to navigate to the B2C features blade on the Azure portal.](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-app-registration#navigate-to-the-b2c-features-blade)
2. Navigate to a policy that you want to enable for translations.
3. Click **Language customization**.
4. Read the warning carefully.  Once enabled, you cannot turn off 'Language customization'.
5. Turn on the feature and click **OK**.
6. Save your policy on the upper left corner of your **Edit policy** blade.

## Select which languages your user journey supports 
Create a list of allowed languages for your user journey to be translated in when the ui_locales parameter is not provided.
1. Ensure your policy has 'Language customization' enabled from previous instructions.
2. From your **Edit policy** blade, select **Language customization**.
3. You are taken to your **Supported languages** blade.  From here, you can select **Add resource**.
4. Select all the languages that you would like to be supported.  

>[!NOTE]
>If a ui_locales parameter is not provided, then the page is translated to the customer's browser language only if it is on this list
>

5. Click **Ok** at the bottom
6. Close the **Language customization** blade and **save** your policy.

## Customize your strings
'Language customization' allows you to customize any string in your user journey.
1. Ensure your policy has 'Language customization' enabled from the previous instructions.
2. From your **Edit policy** blade, select **Language customization**.
3. From the left-hand navigation menu, select **Download content**.
4. Select the page you want to edit.
5. In the dropdown, select the language you want to edit for.
6. Click **Download**. 

These steps give you a JSON file that you can use to start editing your strings.

### Changing any string on the page
1. Open the JSON file downloaded from previous instructions in a JSON editor.
2. Find the element you want to change.  You can find the `StringId` of the string you are looking for, or look for the `Value` you want to change.
3. Update the `Value` attribute with what you want displayed.
4. Save the file and upload your changes.

### Changing extension attributes
If you are looking to change the string for a custom user attribute, or want to add one to the JSON, it is in the following format:
```JSON
{
  "LocalizedStrings": [
    {
      "ElementType": "ClaimType",
      "ElementId": "extension_<ExtensionAttribute>",
      "StringId": "DisplayName",
      "Override": false,
      "Value": "<ExtensionAttributeValue>"
    }
    [...]
}
```
>[!IMPORTANT]
>If you need to override a string, make sure to set the `Override` value to `true`.  If the value isn't changed, the entry is ignored. 
>

Replace `<ExtensionAttribute>` with the name of your custom user attribute.  
Replace `<ExtensionAttributeValue>` with the new string to be displayed.

### Using LocalizedCollections
If you want to provide a set list of values for responses, you need to create a `LocalizedCollections`.  A `LocalizedCollections` is an array of `Name` and `Value` pairs.  The `Name` is what is displayed and the `Value` is what is returned in the claim.  To add a `LocalizedCollections`, it has the following format:

```JSON
{
  "LocalizedStrings": [...],
  "LocalizedCollections": [{
      "ElementType":"ClaimType", 
      "ElementId":"<UserAttribute>",
      "TargetCollection":"Restriction",
      "Override": false,
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
>[!IMPORTANT]
>If you need to override a string, make sure to set the `Override` value to `true`.  If the value isn't changed, the entry is ignored. 
>

* `ElementId` is the user attribute that this `LocalizedCollections` is a response to
* `Name` is the value shown to the user
* `Value` is what is returned in the claim when this option is selected

### Upload your changes
1. Once you have completed the changes to your JSON file, navigate back to your B2C tenant.
2. From your **Edit policy** blade, select **Language customization**.
3. From the left-hand navigation menu, select **Upload content**.
4. Select the page you want to upload your changes for.
5. If you want to upload a language that you've previously provided a JSON for, you need to delete the previous entry.  You can delete it by clicking the `...` on the right of that language and select **Delete**.
6. Click **Add** on the upper left.
7. Select the language of your JSON file.
8. Click the folder button on the right and browse for your JSON file.
9. Click the **Upload** button on the bottom of the blade.
10. Go back to your **Edit policy** blade and click **Save**.

## Additional information
### Recommendations for 'Language customization'
We recommend only putting in entries to your Language resources for strings you explicitly want to replace.  We enforce a size limit to the file that is compiled out of all your JSON translations.  If your files get too large, it impacts the performance of your user journey.
### Page UI customization labels are removed once 'Language customization' is enabled
When you enable 'Language customization', your previous edits for labels using Page UI customization are removed except for custom user attributes.  This change is done to avoid conflicts in where you can edit your strings.  You can continue to change your labels and other strings by uploading language resources in 'Language customization'.
### Microsoft is committed to provide the most up-to-date translations for your use
We will continuously improve translations and keep them in compliance for you.  We will identify bugs and changes in global terminology and make the updates that will work seamlessly in your user journey.
### Support for right-to-left languages
There is no support for right-to-left languages, if you require this feature please vote for this feature on [Azure Feedback](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/19393000-provide-language-support-for-right-to-left-languag).
### Social Identity provider translations
We provide the ui_locales OIDC parameter to social logins but they are not honored by some social identity providers, including Facebook and Google. 
### Browser behavior
Chrome and Firefox both request for their set language and if it is a supported language, it is displayed before the default.  Edge currently does not request a language and goes straight to the default language.
### Known issues
* Uploading language resources for the MFA page in a Profile Edit policy is currently unavailable.
* `LocalizedCollections` aren't generated for values when it is required by the response type
### What if I want a language that isn't supported?
We are planning to provide an extension of this feature that allows you to upload a JSON resource towards 'custom languages'.  The feature allows you to specify the name and language code for any language and provide *all* the translations for that language.  If you need this feature, send us your scenario at [aadb2cpreview@microsoft.com](mailto:aadb2cpreview@microsoft.com).  

### What languages are supported?

| Language              | Language code |
|-----------------------|---------------|
| Bangla                | bn            |
| Czech                 | cs            |
| Danish                | da            |
| German                | de            |
| Greek                 | el            |
| English               | en            |
| Spanish               | es            |
| Finnish               | fi            |
| French                | fr            |
| Gujarati              | gu            |
| Hindi                 | hi            |
| Croatian              | hr            |
| Hungarian             | hu            |
| Italian               | it            |
| Japanese              | ja            |
| Kannada               | kn            |
| Korean                | ko            |
| Malayalam             | ml            |
| Marathi               | mr            |
| Malay                 | ms            |
| Norwegian Bokmal      | nb            |
| Dutch                 | nl            |
| Punjabi               | pa            |
| Polish                | pl            |
| Portuguese - Brazil   | pt-br         |
| Portuguese - Portugal | pt-pt         |
| Romanian              | ro            |
| Russian               | ru            |
| Slovak                | sk            |
| Swedish               | sv            |
| Tamil                 | ta            |
| Telugu                | te            |
| Thai                  | th            |
| Turkish               | tr            |
| Chinese - Simplified  | zh-hans       |
| Chinese - Traditional | zh-hant       |
