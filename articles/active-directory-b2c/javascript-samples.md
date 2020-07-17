---
title: JavaScript samples
titleSuffix: Azure AD B2C
description: Learn about using JavaScript in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/10/2020
ms.author: mimart
ms.subservice: B2C
---

# JavaScript samples for use in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

You can add your own JavaScript client-side code to your Azure Active Directory B2C (Azure AD B2C) applications.

To enable JavaScript for your applications:

* Add an element to your [custom policy](custom-policy-overview.md)
* Select a [page layout](page-layout.md)
* Use [b2clogin.com](b2clogin.md) in your requests

This article describes how you can change your custom policy to enable script execution.

> [!NOTE]
> If you want to enable JavaScript for user flows, see [JavaScript and page layout versions in Azure Active Directory B2C](user-flow-javascript-overview.md).

## Prerequisites

### Select a page layout

* Select a [page layout](contentdefinitions.md#select-a-page-layout) for the user interface elements of your application.

    If you intend to use JavaScript, you need to [define a page layout version](contentdefinitions.md#migrating-to-page-layout) with page `contract` version for *all* of the content definitions in your custom policy.

## Add the ScriptExecution element

You enable script execution by adding the **ScriptExecution** element to the [RelyingParty](relyingparty.md) element.

1. Open your custom policy file. For example, *SignUpOrSignin.xml*.
2. Add the **ScriptExecution** element to the **UserJourneyBehaviors** element of **RelyingParty**:

    ```xml
    <RelyingParty>
      <DefaultUserJourney ReferenceId="B2CSignUpOrSignInWithPassword" />
      <UserJourneyBehaviors>
        <ScriptExecution>Allow</ScriptExecution>
      </UserJourneyBehaviors>
      ...
    </RelyingParty>
    ```
3. Save and upload the file.

[!INCLUDE [active-directory-b2c-javascript-guidelines](../../includes/active-directory-b2c-javascript-guidelines.md)]

## JavaScript samples

### Show or hide a password

A common way to help your customers with their sign-up success is to allow them to see what they’ve entered as their password. This option helps users sign up by enabling them to easily see and make corrections to their password if needed. Any field of type password has a checkbox with a **Show password** label.  This enables the user to see the password in plain text. Include this code snippet into your sign-up or sign-in template for a self-asserted page:

```Javascript
function makePwdToggler(pwd){
  // Create show-password checkbox
  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  var id = pwd.id + 'toggler';
  checkbox.setAttribute('id', id);

  var label = document.createElement('label');
  label.setAttribute('for', id);
  label.appendChild(document.createTextNode('show password'));

  var div = document.createElement('div');
  div.appendChild(checkbox);
  div.appendChild(label);

  // Add show-password checkbox under password input
  pwd.insertAdjacentElement('afterend', div);

  // Add toggle password callback
  function toggle(){
    if(pwd.type === 'password'){
      pwd.type = 'text';
    } else {
      pwd.type = 'password';
    }
  }
  checkbox.onclick = toggle;
  // For non-mouse usage
  checkbox.onkeydown = toggle;
}

function setupPwdTogglers(){
  var pwdInputs = document.querySelectorAll('input[type=password]');
  for (var i = 0; i < pwdInputs.length; i++) {
    makePwdToggler(pwdInputs[i]);
  }
}

setupPwdTogglers();
```

### Add terms of use

Include the following code into your page where you want to include a **Terms of Use** checkbox. This checkbox is typically needed in your local account sign-up and social account sign-up pages.

```Javascript
function addTermsOfUseLink() {
    // find the terms of use label element
    var termsOfUseLabel = document.querySelector('#api label[for="termsOfUse"]');
    if (!termsOfUseLabel) {
        return;
    }

    // get the label text
    var termsLabelText = termsOfUseLabel.innerHTML;

    // create a new <a> element with the same inner text
    var termsOfUseUrl = 'https://docs.microsoft.com/legal/termsofuse';
    var termsOfUseLink = document.createElement('a');
    termsOfUseLink.setAttribute('href', termsOfUseUrl);
    termsOfUseLink.setAttribute('target', '_blank');
    termsOfUseLink.appendChild(document.createTextNode(termsLabelText));

    // replace the label text with the new element
    termsOfUseLabel.replaceChild(termsOfUseLink, termsOfUseLabel.firstChild);
}
```

In the code, replace `termsOfUseUrl` with the link to your terms of use agreement. For your directory, create a new user attribute called **termsOfUse** and then include **termsOfUse** as a user attribute.

## Next steps

Find more information about how you can customize the user interface of your applications in [Customize the user interface of your application using a custom policy in Azure Active Directory B2C](custom-policy-ui-customization.md).
