---
title: ContentDefinitions - Azure Active Directory B2C | Microsoft Docs
description: Specify the ContentDefinitions element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: marsma
ms.subservice: B2C
---

# ContentDefinitions

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

You can customize the look and feel of any [self-asserted technical profile](self-asserted-technical-profile.md). Azure Active Directory (Azure AD) B2C runs code in your customer's browser and uses a modern approach called Cross-Origin Resource Sharing (CORS). 

To customize the user interface, you specify a URL in the **ContentDefinition** element with customized HTML content. In the self-asserted technical profile or **OrchestrationStep**, you point to that content definition identifier. The content definition may contain a **LocalizedResourcesReferences** element that specifies a list of localized resources to load. Azure AD B2C merges user interface elements with the HTML content that's loaded from your URL and then displays the page to the user.

The **ContentDefinitions** element contains URLs to HTML5 templates that can be used in a user journey. The HTML5 page URI is used for a specified user interface step. For example, the sign-in or sign-up, password reset, or error pages. You can modify the look and feel by overriding the LoadUri for the HTML5 file. You can create new content definitions according to your needs. This element may contain a localized resources reference, to the localization identifier specified in the [Localization](localization.md) element.

The following example shows the content definition identifier and the definition of localized resources:

```XML
<ContentDefinition Id="api.localaccountsignup">
  <LoadUri>~/tenant/default/selfAsserted.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:selfasserted:1.1.0</DataUri>
  <Metadata>
    <Item Key="DisplayName">Local account sign up page</Item>
  </Metadata>
  <LoalizedResourcesReferences MergeBehavior="Prepend">
    <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.localaccountsignup.en" />
    <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.localaccountsignup.es" />
    ...
```

The metadata of the **LocalAccountSignUpWithLogonEmail** self-asserted technical profile contains the content definition identifier **ContentDefinitionReferenceId** set to `api.localaccountsignup`

```XML
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
  <DisplayName>Email signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="ContentDefinitionReferenceId">api.localaccountsignup</Item>
    ...
  </Metadata>
  ...
```


## ContentDefinition

The **ContentDefinition** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier for a content definition. The value is one specified in the **Content definition IDs** section later in this page. |

The **ContentDefinition** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LoadUri | 1:1 | A string that contains the URL of the HTML5 page for the content definition. |
| RecoveryUri | 0:1 | A string that contains the URL of the HTML page for displaying an error relating to the content definition. | 
| DataUri | 1:1 | A string that contains the relative URL of an HTML file that provides the user experience to invoke for the step. |  
| Metadata | 1:1 | A collection of key/value pairs that contains the metadata utilized by the content definition. | 
| LocalizedResourcesReferences | 0:1 | A collection of localized resources references. Use this element to customize the localization of a user interface and claims attribute. |

### DataUri

The **DataUri** element is used to specify the page identifier. Azure AD B2C uses the page identifier to load and initiate UI elements and client side JavaScript. The format of the value is `urn:com:microsoft:aad:b2c:elements:page-name:version`.  The following table lists of the page identifiers you can use.

| Value |	Description |
| ----- | ----------- |
| `urn:com:microsoft:aad:b2c:elements:globalexception:1.1.0` | Displays an error page when an exception or an error is encountered. |
| `urn:com:microsoft:aad:b2c:elements:idpselection:1.0.0` |	Lists the identity providers that users can choose from during sign-in. | 
| `urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0`	| Displays a form for signing in with a local account that's based on an email address or a user name. This value also provides the “keep me sign-in functionality” and “Forgot your password?” link. | 
| `urn:com:microsoft:aad:b2c:elements:unifiedssd:1.0.0` | Displays a form for signing in with a local account that's based on an email address or a user name. |
| `urn:com:microsoft:aad:b2c:elements:multifactor:1.1.0` | Verifies phone numbers by using text or voice during sign-up or sign-in. |
| `urn:com:microsoft:aad:b2c:elements:selfasserted:1.1.0` |	Displays a form that enables users to create or update their profile. | 


### LocalizedResourcesReferences

The **LocalizedResourcesReferences** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| LocalizedResourcesReference | 1:n | A list of localized resource references for the content definition. | 

The **LocalizedResourcesReferences** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Language | Yes | A string that contains a supported language for the policy per RFC 5646 - Tags for Identifying Languages. |
| LocalizedResourcesReferenceId | Yes | The identifier of the **LocalizedResources** element. |

The following example shows a sign-up or sign-in content definition:

```XML
<ContentDefinition Id="api.signuporsignin">
  <LoadUri>~/tenant/default/unified.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0</DataUri>
  <Metadata>
    <Item Key="DisplayName">Signin and Signup</Item>
  </Metadata>
</ContentDefinition>
```

The following example shows a sign-up or sign-in content definition with a reference to localization for English, French and Spanish:

```XML
<ContentDefinition Id="api.signuporsignin">
  <LoadUri>~/tenant/default/unified.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0</DataUri>
  <Metadata>
    <Item Key="DisplayName">Signin and Signup</Item>
  </Metadata>
  <LocalizedResourcesReferences MergeBehavior="Prepend">
    <LocalizedResourcesReference Language="en" LocalizedResourcesReferenceId="api.signuporsignin.en" />
    <LocalizedResourcesReference Language="fr" LocalizedResourcesReferenceId="api.signuporsignin.rf" />
    <LocalizedResourcesReference Language="es" LocalizedResourcesReferenceId="api.signuporsignin.es" />
</LocalizedResourcesReferences>
</ContentDefinition>
```

To learn how to add localization support to your content definitions, see [Localization](localization.md).

## Content definition IDs

The ID attribute of the **ContentDefinition** element specifies the type of page that relates to the content definition. The element defines the context that a custom HTML5/CSS template is going to apply. The following table describes the set of content definition IDs that is recognized by the Identity Experience Framework, and the page types that relate to them. You can create your own content definitions with an arbitrary ID.

| ID | Default template | Description | 
| -- | ---------------- | ----------- |
| **api.error** | [exception.cshtml](https://login.microsoftonline.com/static/tenant/default/exception.cshtml) | **Error page** - Displays an error page when an exception or an error is encountered. |
| **api.idpselections** | [idpSelector.cshtml](https://login.microsoftonline.com/static/tenant/default/idpSelector.cshtml) | **Identity provider selection page** - Lists identity providers that users can choose from during sign-in. The options are usually enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| **api.idpselections.signup** | [idpSelector.cshtml](https://login.microsoftonline.com/static/tenant/default/idpSelector.cshtml) | **Identity provider selection for sign-up** - Lists identity providers that users can choose from during sign-up. The options are usually enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| **api.localaccountpasswordreset** | [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) | **Forgot password page** - Displays a form that users must complete to initiate a password reset. |
| **api.localaccountsignin** | [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) | **Local account sign-in page** - Displays a form for signing in with a local account that's based on an email address or a user name. The form can contain a text input box and password entry box. |
| **api.localaccountsignup** | [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) | **Local account sign-up page** - Displays a form for signing up for a local account that's based on an email address or a user name. The form can contain various input controls, such as: a text input box, a password entry box, a radio button, single-select drop-down boxes, and multi-select check boxes. |
| **api.phonefactor** | [multifactor-1.0.0.cshtml](https://login.microsoftonline.com/static/tenant/default/multifactor-1.0.0.cshtml) | **Multi-factor authentication page** - Verifies phone numbers, by using text or voice, during sign-up or sign-in. |
| **api.selfasserted** | [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) | **Social account sign-up page** - Displays a form that users must complete when they sign up by using an existing account from a social identity provider. This page is similar to the preceding social account sign up page, except for the password entry fields. |
| **api.selfasserted.profileupdate** | [updateprofile.html](https://login.microsoftonline.com/static/tenant/default/updateProfile.cshtml) | **Profile update page** - Displays a form that users can access to update their profile. This page is similar to the social account sign up page, except for the password entry fields. |
| **api.signuporsignin** | [unified.html](https://login.microsoftonline.com/static/tenant/default/unified.cshtml) | **Unified sign-up or sign-in page** - Handles the user sign-up and sign-in process. Users can use enterprise identity providers, social identity providers such as Facebook or Google+, or local accounts. |
 
