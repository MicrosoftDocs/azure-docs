---
title: Embed Azure Active Directory B2C user interface into your app with a custom policy
titleSuffix: Azure AD B2C
description: Learn how to embed Azure Active Directory B2C user interface into your app with a custom policy
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/25/2020
ms.author: mimart
ms.subservice: B2C
---

# Embedded login experience

Embedded login allows you to embed the Azure AD B2C user interface into your application. With the embedded experience, users sign into your applications without being redirected or seeing a pop-up window.

## Web application

In a web application, you can using an HTML inline frame element to embed the Azure B2C user interface into a web application page by . You can use an inline frame, or `<iframe>`, to embed a document, in this case the Azure AD B2C user interface, within an HTML5 document.

![Login with hovering DIV experience](media/embedded-login/login-hovering.png)

When using iframe, consider the following:

- Embedded logging supports only local account. Most of the social identity providers (e.g. Google, Facebook) block their login pages from being rendered in inline frames.
- Since Azure AD B2C session cookies within an iframe are considered third party cookies, certain browsers (e.g. Safari, Chrome in incognito mode) either block or clear these cookies leading to undesired impact to the user experience.  Your application domain name must be on the **same origin** as Azure AD B2C. For example, the app is hosted on https://app.contoso.com, while the Azure AD B2C runs under the https://login.contoso.com 
 
## Configure your policy

To allow your Azure AD B2C user interface to be embedded in an iframe, a content security policy `Content-Security-Policy`, and frame options `X-Frame-Options` must be included in the Azure AD B2C HTTP response headers. These headers allow the Azure AD B2C user interface to run under your application domain name.

Add a **JourneyFraming** element inside of the [RelyingParty](relyingparty.md) element.  The **UserJourneyBehaviors** element must immediately follow the **DefaultUserJourney**. Your **UserJourneyBehavors** element should look like this example:


```xml
<UserJourneyBehaviors> 
  <JourneyFraming Enabled="true" Sources="https://somesite.com https://anothersite.com" /> 
</UserJourneyBehaviors> 
```

The **sources** attribute contains the URI of your web application. Use space between URIs. Each URI must meet the following requirements: 

- Be trusted and owned by your application.
- Use the https scheme.  
- Full URI of the web app. Wildcards are not supported. 

In addition, we recommend that you also block your own domain name from being embedded in an iframe by setting the Content-Security-Policy and X-Frame-Options headers respectively on your application pages. This will mitigate security concerns around older browsers related to nested embedding of iframes. 

## Adjust policy user interface

With Azure AD B2C [user interface customization](custom-policy-ui-customization.md), you get nearly full control of the HTML and CSS content that's presented to users. Follow the steps how to use a custom HTML page, using content definitions. To fits the Azure AD B2C user interface can into the iframe size, provide clean HTML page, without background and extra spaces.  

The following CSS code hides the the Azure AD B2C HTML elements, and adjust the size of the panel to accommodate the iframe full size.

```css
div.social, div.divider {
    display: none;
}

div.api_container{
    padding-top:0;
}

.panel {
    width: 100%!important
}
```

In some cases you may want to inform your application which Azure AD B2C page is presented now. For example, inform your application that a user selects the sign-up option. The application can respond by hiding the sign-in with social account links, or adjust the iframe size accordingly.

To notify your application about the current Azure AD B2C page, [enable your policy to JavaScript](javascript-samples.md), the use HTML5 post massages. The following JavaScript code sends a post massage to the app with `signUp`.

```javascript
window.parent.postMessage("signUp", '*');
```

## Configure a web application

When a user clicks on the sign-in button, the [app](code-samples.md#web-apps-and-apis) generates an authorization request that takes the user to Azure AD B2C to sign-in. After the sign-in is completed Azure AD B2C returns an ID token, or authorization code to the configured redirect URI within your application.

To support embedded login, the iframe **src** property is pointing to sign-in controller, such as `/account/SignUpSignIn`, which generates the authorization request, and redirect the user to Azure AD B2C policy.

```html
<iframe id="loginframe" frameborder="0" src="/account/SignUpSignIn"></iframe>
``` 

After the ID token is received and validated by the application. The authorization flow is completed, and the application recognizes and trusts the user. Since the authorization flow happens inside th iframe, you need to reload the main page. After the page is reloaded the sign-in button is changed to sign-out, and the username is presented to the UI.  

Following is an example how the sign-in redirect URI can refresh the main page.

```javascript
window.top.location.reload();
```

### Add sign-in with social accounts to a web app

Social identity providers block their login pages from being rendered in inline frames. You can use a septate policy for the social account, or a single policy, for both both sign-in and sign-up with local and social account. Then use the `domain_hint` query string parameter. The domain hint parameter takes the user directly to the social identity provider sign-in page. 

In your application, add the sign-in with social account buttons. When a user clicks one of the social account button, the control need to change the policy name, or set the domain hint parameter. 

TBD: add a diagram

The redirect URI can be the same one, used by the iframe. Just skip the page reload.

## Configure a single page application

A single page application must have a second HTML page "the login page" that is loaded in the iframe. The login page hosts the authentication library code which generates the authorization code and get the token back.

When the single page applications needs the access token, use a JavaScript code to access in iframe and it's object the contain the access token.

>Note!
> MSAL 2.0 currently doesn't support running inside an iframe.

The following example is a code that runs on the main page, calling some iframe's JavaScript code;

```javascript
function getToken()
{
  var token = document.getElementById("loginframe").contentWindow.getToken("adB2CSignInSignUp");

  if (token === "LoginIsRequired")
    document.getElementById("tokenTextarea").value = "Please login!!!"
  else
    document.getElementById("tokenTextarea").value = token.access_token;
}

function logOut()
{
  document.getElementById("loginframe").contentWindow.policyLogout("adB2CSignInSignUp", "B2C_1A_SignUpOrSignIn");
}
```
 