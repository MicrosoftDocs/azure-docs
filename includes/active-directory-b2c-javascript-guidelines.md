---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 02/11/2020
ms.author: mimart
---
## Guidelines for using JavaScript

Follow these guidelines when you customize the interface of your application using JavaScript:

- Don't bind a click event on `<a>` HTML elements.
- Don’t take a dependency on Azure AD B2C code or comments.
- Don't change the order or hierarchy of Azure AD B2C HTML elements. Use an Azure AD B2C policy to control the order of the UI elements.
- You can call any RESTful service with these considerations:
    - You may need to set your RESTful service CORS to allow client-side HTTP calls.
    - Make sure your RESTful service is secure and uses only the HTTPS protocol.
    - Don't use JavaScript directly to call Azure AD B2C endpoints.
- You can embed your JavaScript or you can link to external JavaScript files. When using an external JavaScript file, make sure to use the absolute URL and not a relative URL.
- JavaScript frameworks:
    - Azure AD B2C uses a specific version of jQuery. Don’t include another version of jQuery. Using more than one version on the same page causes issues.
    - Using RequireJS isn't supported.
    - Most JavaScript frameworks are not supported by Azure AD B2C.
- Azure AD B2C settings can be read by calling `window.SETTINGS`, `window.CONTENT` objects, such as the current UI language. Don’t change the value of these objects.
- To customize the Azure AD B2C error message, use localization in a policy.
- If anything can be achieved by using a policy, generally it's the recommended way.
