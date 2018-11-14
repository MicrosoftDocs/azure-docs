---
title: Create a page contract in Azure Active Directory B2C | Microsoft Docs
description: Learn about the versions of user flows available in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/09/2018
ms.author: davidmu
ms.component: B2C
---

# Create a page contract in Azure Active Directory B2C using custom policies

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article describes the steps you need to take to set up a page contract in Azure Active Directory B2C using custom policies. 

## Replace DataUri values

In your custom policies, you may have [ContentDefinitions](contentdefinitions.md) that define the HTML templates used in the user journey. The **ContentDefinition** contains a **DataUri** refers to the page elements provided by Azure AD B2C. The **LoadUri** is the relative path to the HTML and CSS content that you provide.

```XML
<ContentDefinition Id="api.idpselections">
  <LoadUri>~/tenant/default/idpSelector.cshtml</LoadUri>
  <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
  <DataUri>urn:com:microsoft:aad:b2c:elements:contract:providerselection:1.0.0</DataUri>
  <Metadata>
    <Item Key="DisplayName">Idp selection page</Item>
    <Item Key="language.intro">Sign in</Item>
  </Metadata>
</ContentDefinition>
```

To set up a page contract, you use the following table to find **DataUri** values that might need to be changed in your [ContentDefinitions](contentdefinitions.md). By switching from the old **DataUri** values to the new values, you're selecting an immutable package. The benefit of using this package is that you’ll know it won't change and cause unexpected behavior on your page.

| Old DataUri value | New DataUri value |
| ----------------- | ----------------- |
| urn:com:microsoft:aad:b2c:elements:idpselection:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:providerselection:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:unifiedssd:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:unifiedssd:1.0.0 | 
| urn:com:microsoft:aad:b2c:elements:claimsconsent:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:claimsconsent:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:multifactor:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:multifactor:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:multifactor:1.1.0 | urn:com:microsoft:aad:b2c:elements:contract:multifactor:1.1.0 |
| urn:com:microsoft:aad:b2c:elements:selfasserted:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:selfasserted:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:selfasserted:1.1.0 | urn:com:microsoft:aad:b2c:elements:contract:selfasserted:1.1.0 | 
| urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0 | urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:1.1.0 |
| urn:com:microsoft:aad:b2c:elements:globalexception:1.0.0 | urn:com:microsoft:aad:b2c:elements:contract:globalexception:1.0.0 |
| urn:com:microsoft:aad:b2c:elements:globalexception:1.1.0 | urn:com:microsoft:aad:b2c:elements:contract:globalexception:1.1.0 |

## Enable JavaScript

After you select a page contract version for each page, you enable it for the policy. Javascript isn't enabled until you've defined a package version for each page. To enable script execution, add the **ScriptExecution** element to the [RelyingParty](relyingparty.md) element:

```XML
<RelyingParty>
  <DefaultUserJourney ReferenceId="B2CSignUpOrSignInWithPassword" />
  <UserJourneyBehaviors>
    <ScriptExecution>Allow</ScriptExecution>
  </UserJourneyBehaviors>
  ...
</RelyingParty>
```

You can add your own JavaScript client side code to your page contract. Use the following guidelines when you customize the Azure AD B2C UI using JavaScript:

-	Don't bind a click event on `<a>` HTML elements. 
- Don’t take a dependency on Azure AD B2C code or comments.
- Don't change the order or hierarchy of Azure AD B2C HTML elements. Use an Azure AD B2C policy to control the order of the UI elements.
- You can call any RESTful service with these considerations:
    - You may need to set your RESTful service CORS to allow client side HTTP calls.
    - Make sure your RESTful service is secure and uses only the HTTPS protocol.
    - Don't use JavaScript directly to call Azure AD B2C endpoints.
- You can embed your JavaScript or you can link to external JavaScript files. When using an external JavaScript file, make sure to use the absolute URL and not a relative URL.
- JavaScript frameworks:
    - Azure AD B2C uses a specific version of jQuery. Don’t include another version of jQuery. Using multiple versions on the same page causes issues.
    - Using RequireJS is not supported.
    - Most JavaScript frameworks are not supported by Azure AD B2C. Such as AngularJS, Django, Knockout, ReactJS, Meteor.js, Ember.js, Backbone.js etc.
- Azure AD B2C settings can be read by calling `window.SETTINGS`, `window.CONTENT` objects, such as the current UI language. Don’t change the value of these objects.
- To customize the Azure AD B2C error message, use localization in a policy.
- If anything can be achieved by using a policy, generally it's the recommended way.


