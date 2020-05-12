---
title: Localize the user interface of your app with a custom policy
description: Learn about localization a user interface using a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 05/12/2020
ms.author: mimart
ms.subservice: B2C
---

# Localize the user interface of your application using a custom policy in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Language customization in Azure Active Directory B2C (Azure AD B2C) allows you to accommodate different languages to suit your customer' needs. Microsoft provides the translations for [36 languages](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-language-customization#supported-languages), but you can also provide your own translations for any language. Even if your experience is provided for only a single language, you can customize any text on the pages. 

This article shows you how to support multiple locales or languages in the policy for user journeys. Localization requires three steps: set-up the explicit list of supported languages, provide language-specific strings and collections, and edit the [content definition](contentdefinitions.md) for the page. 

## Set up the list of supported languages

Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.

1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Add the `Localization` element with the supported languages: English (default) and Spanish.  


```XML
<Localization Enabled="true">
  <SupportedLanguages DefaultLanguage="en" MergeBehavior="ReplaceAll">
    <SupportedLanguage>en</SupportedLanguage>
    <SupportedLanguage>es</SupportedLanguage>
  </SupportedLanguages>
</Localization>
```

## Provide language-specific labels

The [LocalizedResources](localization.md#localizedresources) of the `Localization` element contains the list of localized strings. The localized resources element has an identifier that is used to uniquely identify localized resources. This identifer is used later in the [content definition](contentdefinitions.md) element.

You configure localized resources elements for the content definition and any language you want to support. To customize the unified sign-up or sign-in pages for English and Spanish, you add the following `LocalizedResources` elements after the close of the `</SupportedLanguages>` element.

> [!NOTE]
> In the following sample we added the pound `#` symbol at the begging of each line, so you can easly find the localized labels on the screen.

```XML
<!--Local account sign-up or sign-in page English-->
<LocalizedResources Id="api.signuporsignin.en">
  <LocalizedStrings>
    <LocalizedString ElementType="UxElement" StringId="logonIdentifier_email">#Email Address</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_email">#Please enter your email</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="logonIdentifier_username">#Username</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="password">#Password</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="createaccount_link">#Sign up now</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_username">#Please enter your user name</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="createaccount_intro">#Don't have an account?</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="forgotpassword_link">#Forgot your password?</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="divider_title">#OR</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="cancel_message">#The user has forgotten their password</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_signin">#Sign in</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="social_intro">#Sign in with your social account</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_password">#Please enter your password</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="invalid_password">#The password you entered is not in the expected format.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="local_intro_username">#Sign in with your user name</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="local_intro_email">#Sign in with your existing account</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="invalid_email">#Please enter a valid email address</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="unknown_error">#We are having trouble signing you in. Please try again later.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="email_pattern">^[a-zA-Z0-9.!#$%&amp;''+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidPassword">#Your password is incorrect.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalDoesNotExist">#We can't seem to find your account.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfOldPasswordUsed">#Looks like you used an old password.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="DefaultMessage">#Invalid username or password.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountDisabled">#Your account has been locked. Contact your support person to unlock it, then try again.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountLocked">#Your account is temporarily locked to prevent unauthorized use. Try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="AADRequestsThrottled">#There are too many requests at this moment. Please wait for some time and try again.</LocalizedString>
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
    <LocalizedString ElementType="UxElement" StringId="unknown_error">#Tenemos problemas para iniciar su sesión. Vuelva a intentarlo más tarde.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="email_pattern">^[a-zA-Z0-9.!#$%&amp;'*'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$</LocalizedString>
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
    <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="UserHelpText">#Your surname (also known as family name or last name).</LocalizedString>
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
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">#Introduzca una dirección de correo electrónico válida.</LocalizedString>
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
```

## Edit the content definition with the localization

Paste the entire contents of the ContentDefinitions element that you copied as a child of the BuildingBlocks element.

In the following example, English (en) and Spanish (es) custom strings are added to the sign-up or sign-in page, and to the local account sign-up page. The **LocalizedResourcesReferenceId** for each **LocalizedResourcesReference** is the same as their locale, but you could use any string as the identifier. For each language and page combination, you point to the corresponding **LocalizedResources** you previously created.

```XML
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

##  Upload and test your updated custom policy

### Upload the custom policy

1. Save the extensions file.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
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

## Next steps

- Learn more about the [localization](localization.md) element in the IEF reference.
- See the list of [localization string IDs](localization-string-ids.md) available in Azure AD B2C.

