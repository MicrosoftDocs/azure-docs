---
title: Language customization in Azure Active Directory B2C
description: Learn about customizing the language experience in your user flows in Azure Active Directory B2C.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 12/28/2022
ms.custom: 
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Language customization in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

Language customization in Azure Active Directory B2C (Azure AD B2C) allows your user flow to accommodate different languages to suit your customer needs. Microsoft provides the translations for [36 languages](#supported-languages), but you can also provide your own translations for any language. Even if your experience is provided for only a single language, you can customize any text on the pages.

## How language customization works

You use language customization to select which languages your user flow is available in. After the feature is enabled, you can provide the query string parameter, `ui_locales`, from your application. When you call into Azure AD B2C, your page is translated to the locale that you have indicated. This type of configuration gives you complete control over the languages in your user flow and ignores the language settings of the customer's browser.

You might not need that level of control over what languages your customer sees. If you don't provide a `ui_locales` parameter, the customer's experience is dictated by their browser's settings. You can still control which languages your user flow is translated to by adding it as a supported language. If a customer's browser is set to show a language that you don't want to support, then the language that you selected as a default in supported cultures is shown instead.

* **ui-locales specified language**: After you enable language customization, your user flow is translated to the language that's specified here.
* **Browser-requested language**: If no `ui_locales` parameter was specified, your user flow is translated to the browser-requested language, *if the language is supported*.
* **Policy default language**: If the browser doesn't specify a language, or it specifies one that is not supported, the user flow is translated to the user flow default language.

> [!NOTE]
> If you're using custom user attributes, you need to provide your own translations. For more information, see [Customize your strings](#customize-your-strings).

Watch this video to learn how to localize or customize language using Azure AD B2C.

>[!Video https://www.youtube.com/embed/yqrX5_tA7Ms]

::: zone pivot="b2c-custom-policy"

Localization requires three steps: 

1. Set-up the explicit list of supported languages
1. Provide language-specific strings and collections
1. Edit the [content definition](contentdefinitions.md) for the page. 

::: zone-end 

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

::: zone pivot="b2c-user-flow"

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
  ]
}
```

Replace `<ExtensionAttribute>` with the name of your custom user attribute.

Replace `<ExtensionAttributeValue>` with the new string to be displayed.

### Provide a list of values by using LocalizedCollections

If you want to provide a set list of values for responses, you need to create a `LocalizedCollections` attribute. `LocalizedCollections` is an array of `Name` and `Value` pairs. The order for the items will be the order they are displayed. To add `LocalizedCollections`, use the following format:

```json
{
  "LocalizedStrings": [...],
  "LocalizedCollections": [
    {
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
    }
  ]
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

There are two ways to localize your [HTML content](customize-ui-with-html.md). One way is to turn on [language customization](language-customization.md). Enabling this feature allows Azure AD B2C to forward the OpenID Connect parameter, `ui-locales`, to your endpoint. Your content server can use this parameter to provide customized HTML pages that are language-specific.

Alternatively, you can pull content from different places based on the locale that's used. In your CORS-enabled endpoint, you can set up a folder structure to host content for specific languages. You'll call the right one if you use the wildcard value `{Culture:RFC5646}`. For example, assume that this is your custom page URI:

```
https://wingtiptoysb2c.blob.core.windows.net/{Culture:RFC5646}/wingtip/unified.html
```

You can load the page in `fr`. When the page pulls HTML and CSS content, it's pulling from:

```
https://wingtiptoysb2c.blob.core.windows.net/fr/wingtip/unified.html
```

## Add custom languages

You can also add languages that Microsoft currently does not provide translations for. You'll need to provide the translations for all the strings in the user flow. Language and locale codes are limited to those in the ISO 639-1 standard. The locale code format should be "ISO_639-1_code"-"CountryCode", for example `en-GB`. For more information, please refer to [locale ID formats](/openspecs/office_standards/ms-oe376/6c085406-a698-4e12-9d4d-c3b0ee3dbc4a).

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

::: zone-end

::: zone pivot="b2c-custom-policy"

## Set up the list of supported languages

Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.

1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Add the `Localization` element with the supported languages: English (default) and Spanish.  


```xml
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
  </SupportedLanguages>
</Localization>
```

## Provide language-specific labels

The [LocalizedResources](localization.md#localizedresources) of the `Localization` element contains the list of localized strings. The localized resources element has an identifier that is used to uniquely identify localized resources. This identifier is used later in the [content definition](contentdefinitions.md) element.

You configure localized resources elements for the content definition and any language you want to support. To customize the unified sign-up or sign-in pages for English and Spanish, you add the following `LocalizedResources` elements after the close of the `</SupportedLanguages>` element.

> [!NOTE]
> In the following sample we added the pound `#` symbol at the beginning of each line, so you can easily find the localized labels on the screen.

```xml
<!--Local account sign-up or sign-in page English-->
<Localization Enabled="true">
  ...
 <LocalizedResources Id="api.signuporsignin.en">
        <LocalizedStrings>
          <LocalizedString ElementType="ClaimType" ElementId="signInName" StringId="DisplayName">Email Address</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="heading">Sign in</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="social_intro">Sign in with your social account</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="local_intro_generic">Sign in with your {0}</LocalizedString>
          <LocalizedString ElementType="ClaimType" ElementId="password" StringId="DisplayName">Password</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="requiredField_password">Please enter your password</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="requiredField_generic">Please enter your {0}</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="invalid_generic">Please enter a valid {0}</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="createaccount_one_link">Sign up now</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="createaccount_two_links">Sign up with {0} or {1}</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="createaccount_three_links">Sign up with {0}, {1}, or {2}</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="forgotpassword_link">Forgot your password?</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="button_signin">Sign in</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="divider_title">OR</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="createaccount_intro">Don't have an account?</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="unknown_error">We are having trouble signing you in. Please try again later.</LocalizedString>
          <!-- Uncomment the remember_me only if the keep me signed in is activated. 
          <LocalizedString ElementType="UxElement" StringId="remember_me">Keep me signed in</LocalizedString> -->
          <LocalizedString ElementType="ClaimsProvider" StringId="FacebookExchange">Facebook</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="ResourceOwnerFlowInvalidCredentials">Your password is incorrect.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidPassword">Your password is incorrect.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfPasswordExpired">Your password has expired.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalDoesNotExist">We can't seem to find your account.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfOldPasswordUsed">Looks like you used an old password.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="DefaultMessage">Invalid username or password.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountDisabled">Your account has been locked. Contact your support person to unlock it, then try again.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountLocked">Your account is temporarily locked to prevent unauthorized use. Try again later.</LocalizedString>
          <LocalizedString ElementType="ErrorMessage" StringId="AADRequestsThrottled">There are too many requests at this moment. Please wait for some time and try again.</LocalizedString>
        </LocalizedStrings>
      </LocalizedResources>
  <!--Local account sign-up or sign-in page Spanish-->
  <LocalizedResources Id="api.signuporsignin.es">
    <LocalizedStrings>
      <LocalizedString ElementType="UxElement" StringId="logonIdentifier_email">#Correo electrónico</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="requiredField_email">#Este campo es obligatorio</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="logonIdentifier_username">#Nombre de usuario</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="password">#Contraseña</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="createaccount_link">#Registrarse ahora</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="requiredField_username">#Escriba su nombre de usuario</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="createaccount_intro">#¿No tiene una cuenta?</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="forgotpassword_link">#¿Olvidó su contraseña?</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="divider_title">#O</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="cancel_message">#El usuario ha olvidado su contraseña</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="button_signin">#Iniciar sesión</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="social_intro">#Iniciar sesión con su cuenta de redes sociales</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="requiredField_password">#Escriba su contraseña</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="invalid_password">#La contraseña que ha escrito no está en el formato esperado.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="local_intro_username">#Iniciar sesión con su nombre de usuario</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="local_intro_email">#Iniciar sesión con su cuenta existente</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="invalid_email">#Escriba una dirección de correo electrónico válida</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="unknown_error">#Tenemos problemas para iniciar su sesión. Vuelva a intentarlo más tarde.  </LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="email_pattern">^[a-zA-Z0-9.!#$%&amp;'^_`\{\}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidPassword">#Su contraseña es incorrecta.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalDoesNotExist">#Parece que no podemos encontrar su cuenta.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfOldPasswordUsed">#Parece que ha usado una contraseña antigua.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="DefaultMessage">#El nombre de usuario o la contraseña no son válidos.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountDisabled">#Se bloqueó su cuenta. Póngase en contacto con la persona responsable de soporte técnico para desbloquearla y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountLocked">#Su cuenta se bloqueó temporalmente para impedir un uso no autorizado. Vuelva a intentarlo más tarde.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="AADRequestsThrottled">#Hay demasiadas solicitudes en este momento. Espere un momento y vuelva a intentarlo.</LocalizedString>
    </LocalizedStrings>
  </LocalizedResources>
  <!--Local account sign-up page English-->
  <LocalizedResources Id="api.localaccountsignup.en">
    <LocalizedStrings>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">#Email Address</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">#Email address that can be used to contact you.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">#Please enter a valid email address.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="DisplayName">#New Password</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="UserHelpText">#Enter new password</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="PatternHelpText">#8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ " ( ) ; .</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="DisplayName">#Confirm New Password</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="UserHelpText">#Confirm new password</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="PatternHelpText">#8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ " ( ) ; .</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="DisplayName">#Display Name</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="UserHelpText">#Your display name.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="DisplayName">#Surname</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="UserHelpText">#Your surname (also known as family name or last name).  </LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="DisplayName">#Given Name</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="UserHelpText">#Your given name (also known as first name).</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="button_continue">#Create</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_fieldIncorrect">#One or more fields are filled out incorrectly. Please check your entries and try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_passwordEntryMismatch">#The password entry fields do not match. Please enter the same password in both fields and try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_requiredFieldMissing">#A required field is missing. Please fill out all required fields and try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="helplink_text">#What is this?</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="initial_intro">#Please provide the following details.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="preloader_alt">#Please wait</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="required_field">#This information is required.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_edit">#Change e-mail</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_resend">#Send new code</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_send">#Send verification code</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_verify">#Verify code</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_code_expired">#That code is expired. Please request a new code.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_no_retry">#You've made too many incorrect attempts. Please try again later.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_retry">#That code is incorrect. Please try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_server">#We are having trouble verifying your email address. Please enter a valid email address and try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_throttled">#There have been too many requests to verify this email address. Please wait a while, then try again.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_info_msg">#Verification code has been sent to your inbox. Please copy it to the input box below.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_input">#Verification code</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_intro_msg">#Verification is necessary. Please click Send button.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_success_msg">#E-mail address verified. You can now continue.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="ServiceThrottled">#There are too many requests at this moment. Please wait for some time and try again.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimNotVerified">#Claim not verified: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">#A user with the specified ID already exists. Please choose a different one.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfIncorrectPattern">#Incorrect pattern for: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidInput">#{0} has invalid input.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMissingRequiredElement">#Missing required element: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfValidationError">#Error in validation by: {0}</LocalizedString>
    </LocalizedStrings>
  </LocalizedResources>
  <!--Local account sign-up page Spanish-->
  <LocalizedResources Id="api.localaccountsignup.es">
    <LocalizedStrings>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">#Dirección de correo electrónico</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">#Dirección de correo electrónico que puede usarse para ponerse en contacto con usted.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">#Introduzca una dirección de correo electrónico válida.  </LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="DisplayName">#Nueva contraseña</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="UserHelpText">#Escriba la contraseña nueva</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="PatternHelpText">#De 8 a 16 caracteres, que contengan 3 de los 4 tipos siguientes: caracteres en minúsculas, caracteres en mayúsculas, dígitos (0-9) y uno o más de los siguientes símbolos: @ # $ % ^ &amp; * - _ + = [ ] { } | \\ : ' , ? / ` ~ \" ( ) ; .</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="DisplayName">#Confirmar nueva contraseña</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="UserHelpText">#Confirmar nueva contraseña</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="PatternHelpText">#8 a 16 caracteres, que contengan 3 de los 4 tipos siguientes: caracteres en minúsculas, caracteres en mayúsculas, dígitos (0-9) y uno o más de los siguientes símbolos: @ # $ % ^ &amp; * - _ + = [ ] { } | \\ : ' , ? / ` ~ \" ( ) ; .</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="DisplayName">#Nombre para mostrar</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="UserHelpText">#Su nombre para mostrar.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="DisplayName">#Apellido</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="UserHelpText">#Su apellido.</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="DisplayName">#Nombre</LocalizedString>
      <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="UserHelpText">#Su nombre (también conocido como nombre de pila).</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="button_continue">#Crear</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_fieldIncorrect">#Hay uno o varios campos rellenados de forma incorrecta. Compruebe las entradas y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_passwordEntryMismatch">#Los campos de entrada de contraseña no coinciden. Escriba la misma contraseña en ambos campos y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="error_requiredFieldMissing">#Falta un campo obligatorio. Rellene todos los campos necesarios y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="helplink_text">#¿Qué es esto?</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="initial_intro">#Proporcione los siguientes detalles.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="preloader_alt">#Espere</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="required_field">#Esta información es obligatoria.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_edit">#Cambiar correo electrónico</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_resend">#Enviar nuevo código</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_send">#Enviar código de comprobación</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_but_verify">#Comprobar código</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_code_expired">#El código ha expirado. Solicite otro nuevo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_no_retry">#Ha realizado demasiados intentos incorrectos. Vuelva a intentarlo más tarde.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_retry">#Ese código es incorrecto. Inténtelo de nuevo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_server">#Tenemos problemas para comprobar la dirección de correo electrónico. Escriba una dirección de correo electrónico válida y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_fail_throttled">#Ha habido demasiadas solicitudes para comprobar esta dirección de correo electrónico. Espere un poco y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_info_msg">#Se ha enviado el código de verificación a su Bandeja de entrada. Cópielo en el siguiente cuadro de entrada.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_input">#Código de verificación</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_intro_msg">#La comprobación es obligatoria. Haga clic en el botón Enviar.</LocalizedString>
      <LocalizedString ElementType="UxElement" StringId="ver_success_msg">#Dirección de correo electrónico comprobada. Puede continuar.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="ServiceThrottled">#Hay demasiadas solicitudes en este momento. Espere un momento y vuelva a intentarlo.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimNotVerified">#Reclamación no comprobada: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">#Ya existe un usuario con el id. especificado. Elija otro diferente.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfIncorrectPattern">#Patrón incorrecto para: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidInput">#{0} tiene una entrada no válida.</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMissingRequiredElement">#Falta un elemento obligatorio: {0}</LocalizedString>
      <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfValidationError">#Error en la validación de: {0}</LocalizedString>
    </LocalizedStrings>
  </LocalizedResources>
</Localization>
```

## Edit the content definition with the localization

Paste the entire contents of the ContentDefinitions element that you copied as a child of the BuildingBlocks element.

In the following example, English (en) and Spanish (es) custom strings are added to the sign-up or sign-in page, and to the local account sign-up page. The **LocalizedResourcesReferenceId** for each **LocalizedResourcesReference** is the same as their locale, but you could use any string as the identifier. For each language and page combination, you point to the corresponding **LocalizedResources** you previously created.

```xml
<ContentDefinitions>
  <ContentDefinition Id="api.signuporsignin">
    <LocalizedResourcesReferences MergeBehavior="Prepend">
        <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.signuporsignin.en" />
        <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.signuporsignin.es" />
    </LocalizedResourcesReferences>
  </ContentDefinition>

  <ContentDefinition Id="api.localaccountsignup">
    <LocalizedResourcesReferences MergeBehavior="Prepend">
        <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.localaccountsignup.en" />
        <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.localaccountsignup.es" />
    </LocalizedResourcesReferences>
  </ContentDefinition>
</ContentDefinitions>
```

## Upload and test your updated custom policy

### Upload the custom policy

1. Save the extensions file.
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Upload custom policy**.
1. Upload the extensions file that you previously changed.

### Test the custom policy by using **Run now**

1. Select the policy that you uploaded, and then select **Run now**.
1. You should be able to see the localized sign-up or sign-in page.
1. Click on the sign-up link, and you should be able to see the localized sign-up page.
1. Switch your browser default language to Spanish. Or you can add the query string parameter, `ui_locales` to the authorization request. For example: 

```http
https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/B2C_1A_signup_signin/oauth2/v2.0/authorize&client_id=0239a9cc-309c-4d41-12f1-31299feb2e82&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token&prompt=login&ui_locales=es
```

::: zone-end


## Additional information

::: zone pivot="b2c-user-flow"

### Page UI customization labels as overrides

When you enable language customization, your previous edits for labels using page UI customization are persisted in a JSON file for English (en). You can continue to change your labels and other strings by uploading language resources in language customization.

::: zone-end

### Up-to-date translations

Microsoft is committed to providing the most up-to-date translations for your use. Microsoft continuously improves translations and keeps them in compliance for you. Microsoft will identify bugs and changes in global terminology and make updates that will work seamlessly in your user flow.

### Support for right-to-left languages

Microsoft currently doesn't provide support for right-to-left languages. You can accomplish this by using custom locales and using CSS to change the way the strings are displayed. If you need this feature, please vote for it on [Azure Feedback](https://feedback.azure.com/d365community/idea/10a7e89c-c325-ec11-b6e6-000d3a4f0789).

### Social identity provider translations

Microsoft provides the `ui_locales` OIDC parameter to social logins. But some social identity providers, including Facebook and Google, don't honor them.

### Browser behavior

Chrome and Firefox both request for their set language. If it's a supported language, it's displayed before the default. Microsoft Edge currently does not request a language and goes straight to the default language.

## Supported languages

Azure AD B2C includes support for the following languages by using ISO 639-1 codes. User flow languages are provided by Azure AD B2C. The multifactor authentication notification languages are provided by [Microsoft Entra multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md).

| Language              | Language code | User flows         | MFA notifications  |
|-----------------------| :-----------: | :----------------: | :----------------: |
| Arabic                | ar            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Bulgarian             | bg            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Bangla                | bn            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Catalan               | ca            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Czech                 | cs            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Danish                | da            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| German                | de            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Greek                 | el            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| English               | en            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Spanish               | es            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Estonian              | et            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Basque                | eu            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Finnish               | fi            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| French                | fr            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Galician              | gl            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Gujarati              | gu            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Hebrew                | he            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Hindi                 | hi            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Croatian              | hr            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Hungarian             | hu            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Indonesian            | id            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Italian               | it            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Japanese              | ja            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Kazakh                | kk            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Kannada               | kn            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Korean                | ko            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Lithuanian            | lt            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Latvian               | lv            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Malayalam             | ml            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Marathi               | mr            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Malay                 | ms            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Norwegian Bokmal      | nb            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Dutch                 | nl            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Norwegian             | no            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Punjabi               | pa            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Polish                | pl            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Portuguese - Brazil   | pt-br         | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Portuguese - Portugal | pt-pt         | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Romanian              | ro            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Russian               | ru            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Slovak                | sk            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Slovenian             | sl            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Serbian - Cyrillic    | sr-cryl-cs    | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Serbian - Latin       | sr-latn-cs    | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Swedish               | sv            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Tamil                 | ta            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Telugu                | te            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Thai                  | th            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Turkish               | tr            | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Ukrainian             | uk            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Vietnamese            | vi            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Welsh            | cy            | ![X indicating no.](./media/user-flow-language-customization/no.png) | ![X indicating no.](./media/user-flow-language-customization/no.png) |
| Chinese - Simplified  | zh-hans       | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |
| Chinese - Traditional | zh-hant       | ![Green check mark.](./media/user-flow-language-customization/yes.png) | ![Green check mark.](./media/user-flow-language-customization/yes.png) |


## Next steps

::: zone pivot="b2c-user-flow"

Find more information about how you can customize the user interface of your applications in [Customize the user interface of your application in Azure Active Directory B2C](customize-ui-with-html.md).

::: zone-end 

::: zone pivot="b2c-custom-policy"

- Learn more about the [localization](localization.md) element in the IEF reference.
- See the list of [localization string IDs](localization-string-ids.md) available in Azure AD B2C.

::: zone-end 
