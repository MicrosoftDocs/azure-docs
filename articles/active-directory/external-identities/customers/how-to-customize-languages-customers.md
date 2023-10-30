---
title: Customize the browser language for authentication
description: Learn about how to customize the browser language of your app's authentication experience.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 09/25/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to add customized browser languages to my app's authentication experience.
---
# Customize the language of the authentication experience

You can create a personalized sign-in experience for users who sign in using a specific browser language by customizing the branding elements for that browser language. This customization overrides any configurations made to the default branding. If you don't make any changes to the elements, the default elements are displayed.

## Prerequisites

- If you haven't already created your own Microsoft Entra customer tenant, create one now.
- [Register an application](how-to-register-ciam-app.md).  
- [Create a user flow](how-to-user-flow-sign-up-sign-in-customers.md).
- Review the file size requirements for each image you want to add. You may need to use a photo editor to create the right-sized images. The preferred image type for all images is PNG, but JPG is accepted.

## Add browser language under Company branding

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](/azure/active-directory/roles/permissions-reference#global-administrator).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the customer tenant you created earlier.
1. Browse to **Company branding** > **Browser language customizations** > **Add browser language**. 

   :::image type="content" source="media/how-to-customize-languages-customers/company-branding-add-browser-language.png" alt-text="Screenshot of the browser language customizations tab." lightbox="media/how-to-customize-languages-customers/company-branding-add-browser-language.png":::

4. On the **Basics** tab, under **Language specific UI Customization**, select the browser language you want to customize from the menu. 

   :::image type="content" source="media/how-to-customize-languages-customers/language-selection.png" alt-text="Screenshot of selecting a language." lightbox="media/how-to-customize-languages-customers/language-selection.png":::

The following languages are supported in the customer tenant: 

   - Arabic (Saudi Arabia)
   - Basque (Basque)
   - Bulgarian (Bulgaria)
   - Catalan (Catalan)
   - Chinese (China)
   - Chinese (Hong Kong SAR)
   - Croatian (Croatia)
   - Czech (Czechia)
   - Danish (Denmark)
   - Dutch (Netherlands)
   - English (United States)
   - Estonian (Estonia)
   - Finnish (Finland)
   - French (France)
   - Galician (Galician)
   - German (Germany)
   - Greek (Greece)
   - Hebrew (Israel)
   - Hungarian (Hungary)
   - Italian (Italy)
   - Japanese (Japan)
   - Kazakh (Kazakhstan)
   - Korean (Korea)
   - Latvian (Latvia)
   - Lithuanian (Lithuania)
   - Norwegian Bokmål (Norway)
   - Polish (Poland)
   - Portuguese (Brazil)
   - Portuguese (Portugal)
   - Romanian (Romania)
   - Russian (Russia)
   - Serbian (Latin, Serbia)
   - Slovak (Slovakia)
   - Slovenian (Sierra Leone)
   - Spanish (Spain)
   - Swedish (Sweden)
   - Thai (Thailand)
   - Turkish (Türkiye)
   - Ukrainian (Ukraine)
   
6. Customize the elements on the **Basics**, **Layout**, **Header**, **Footer**, **Sign-in form**, and **Text** tabs. For detailed instructions, see [Customize the branding and end-user experience](how-to-customize-branding-customers.md).
7. When you’re finished, select the **Review** tab and go over all of your language customizations. Then select **Add** if you would like to save your changes or **Previous** if you would like to continue editing.

## Add language customization to a user flow

Language customization in the customer tenant allows your user flow to accommodate different languages to suit your customer's needs.  You can use languages to modify the strings displayed to your customers as part of the attribute collection process during sign-up.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](/azure/active-directory/roles/permissions-reference#global-administrator).  
2. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the customer tenant you created earlier.
3. Browse to **Identity** > **External Identities** > **User flows**.
4. Select the user flow that you want to enable for translations.
5. Select **Languages**.
6. On the **Languages** page for the user flow, select the language that you want to customize.
7. Expand **Sign up and sign in (Preview)**.
8. Select **Download defaults** (or **Download overrides** if you have previously edited this language).

   :::image type="content" source="media/how-to-customize-languages-customers/language-customization-flow.png" alt-text="Screenshot the shows how to add languages under a user flow." lightbox="media/how-to-customize-languages-customers/language-customization-flow.png":::

The downloaded file is in JSON format and includes both built-in and custom attributes, as well as other page-level and error strings:

```http
{
	"AttributeCollection_Description": "Wir benötigen nur ein paar weitere Informationen, um Ihr Konto einzurichten.",
	"AttributeCollection_Title": "Details hinzufügen",
	"Attribute_City": "Ort",
	"Attribute_Country": "Land/Region",
	"Attribute_DisplayName": "Anzeigename",
	"Attribute_Email": "E-Mail-Adresse",
	"Attribute_Generic_ConfirmationLabel": "{0} erneut eingeben",
	"Attribute_GivenName": "Vorname",
	"Attribute_JobTitle": "Position",
	"Attribute_Password": "Kennwort",
	"Attribute_Password_MismatchErrorString": "Kennwörter stimmen nicht überein.",
	"Attribute_PostalCode": "Postleitzahl",
	"Attribute_State": "Bundesland/Kanton",
	"Attribute_StreetAddress": "Straße",
	"Attribute_Surname": "Nachname",
	"SignIn_Description": "Melden Sie sich an, um auf {0} zuzugreifen.",
	"SignIn_Title": "Anmelden",
	"SignUp_Description": "Registrieren Sie sich, um auf {0} zuzugreifen.",
	"SignUp_Title": "Konto erstellen",
	"SisuOtc_Title": "Code eingeben",
	"Attribute_extension_a235ca9a0a7c4d33bd69e07bed81c8b1_Shoesize": "Shoe size"
}  
```

You can modify any or all of these attributes in the downloaded file. For example, you can modify the built-in attribute, **City** and the custom attribute, **Shoesize**:  


```http
{
	"AttributeCollection_Description": "Wir benötigen nur ein paar weitere Informationen, um Ihr Konto einzurichten.",
	"AttributeCollection_Title": "Details hinzufügen",
	"Attribute_City": "Ort2",
	"Attribute_Country": "Land/Region",
	"Attribute_DisplayName": "Anzeigename",
	"Attribute_Email": "E-Mail-Adresse",
	"Attribute_Generic_ConfirmationLabel": "{0} erneut eingeben",
	"Attribute_GivenName": "Vorname",
	"Attribute_JobTitle": "Position",
	"Attribute_Password": "Kennwort",
	"Attribute_Password_MismatchErrorString": "Kennwörter stimmen nicht überein.",
	"Attribute_PostalCode": "Postleitzahl",
	"Attribute_State": "Bundesland/Kanton",
	"Attribute_StreetAddress": "Straße",
	"Attribute_Surname": "Nachname",
	"SignIn_Description": "Melden Sie sich an, um auf {0} zuzugreifen.",
	"SignIn_Title": "Anmelden",
	"SignUp_Description": "Registrieren Sie sich, um auf {0} zuzugreifen.",
	"SignUp_Title": "Konto erstellen",
	"SisuOtc_Title": "Code eingeben",
	"Attribute_extension_a235ca9a0a7c4d33bd69e07bed81c8b1_Shoesize": "Schuhgröße"
}  
```

9. After making the necessary changes, you can upload the new overrides file. The changes are saved to your user flow automatically. The override appears under the **Configured** tab.
10. To double-check your changes, select the language under the **Configured** tab and expand the **Sign up and sign in (Preview)** option. You can view your customized language file by selecting Download overrides. To remove your customized override file, select **Remove overrides**.

   :::image type="content" source="media/how-to-customize-languages-customers/remove-download-override-file.png" alt-text="Screenshot the shows how to remove or download the modified JSON file." lightbox="media/how-to-customize-languages-customers/remove-download-override-file.png":::
   
11. Go to the sign-in page of your customer tenant. Make sure you have the right locale and market in your URLs, for example: ui_locales=de-DE and  mkt=de-DE. The updated attributes on the sign-up page appear as follows:

   :::image type="content" source="media/how-to-customize-languages-customers/customized-attributes.png" alt-text="Screenshot of the modified sign-up page attributes.":::

> [!IMPORTANT] 
> In the customer tenant, we have two options to add custom text to the sign-up and sign-in experience. The function is available under each user flow during language customization and under [Company Branding](/azure/active-directory/external-identities/customers/how-to-customize-branding-customers). Although we have to ways to customize strings (via Company branding and via User flows), both ways modify the same JSON file. The most recent change made either via User flows or via Company branding will always override the previous one.

## Right-to-left language support

Languages that are read right-to-left, such as Arabic and Hebrew, are displayed in the opposite direction compared to languages that are read left-to-right. The customer tenant supports right-to-left functionality and features for languages that work in a right-to-left environment for entering, and displaying data. Right-to-left readers can interact in a natural reading manner. 

:::image type="content" source="media/how-to-customize-languages-customers/right-to-left-language-support.png" alt-text="Screenshot showing the right-to-left language support." lightbox="media/how-to-customize-languages-customers/right-to-left-language-support.png":::

## Remove the browser language customization

When no longer needed, you can remove the language customization from your customer tenant in the admin center or with the Microsoft Graph API. 

### Remove the language customization in the admin center

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Company branding** > **Browser language customizations**

1. Select the language you want to delete and then select **Delete** and **OK**.

   :::image type="content" source="media/how-to-customize-languages-customers/company-branding-delete-browser-language.png" alt-text="Screenshot of the browser language customizations tab and the delete button." lightbox="media/how-to-customize-languages-customers/company-branding-delete-browser-language.png":::

### Remove the language customization with the Microsoft Graph API

1. Sign in to the [MS Graph explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) with your customer tenant account:  `https://developer.microsoft.com/en-us/graph/graph-explorer?tenant=<your-tenant-name.onmicrosoft.com>`.

1. Query the default branding object using the Microsoft Graph API: `https://graph.microsoft.com/v1.0/organization/<your-tenant-ID>/branding/localizations`. To confirm that you're signed in to your customer tenant, verify the tenant name on the right side of the screen.
1. [Remove the localized branding object](/graph/api/organizationalbrandinglocalization-delete).

   :::image type="content" source="media/how-to-customize-branding-customers/msgraph-ciam-branding.png" alt-text="Screenshot of MS Graph API with CIAM tenant logged in." lightbox="media/how-to-customize-branding-customers/msgraph-ciam-branding.png":::

1. Wait a few minutes for the changes to take effect.

## Next steps

- [Customize the branding and end-user experience](how-to-customize-branding-customers.md) 
