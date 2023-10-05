---
title: Enable Python web application options by using Azure Active Directory B2C
description:  This article shows you how to enable the use of Python web application options.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/05/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: b2c-support, devx-track-python
---

# Enable authentication options in a Python web app by using Azure AD B2C 

This article describes how to enable, customize, and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Python web application. 

Before you start, it's important to familiarize yourself with how to [Configure authentication in a sample Python web app by using Azure AD B2C](configure-authentication-sample-python-web-app.md).

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL: 

1. Follow the guidance in [Enable custom domains](custom-domain.md).
1. In the *app_config.py* file, update the `authority_template` class member with your custom domain.

The following Python code shows the app settings before the change:

```python
authority_template = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{user_flow}"
```

The following Python code shows the app settings after the change:

```python
authority_template = "https://custom.domain.com/00000000-0000-0000-0000-000000000000/{user_flow}" 
```

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you're using a custom policy, add the required input claim as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Find the `initiate_auth_code_flow` method, and then add the `login_hint` parameter with the identity provider domain name (for example, *facebook.com*).

```python
def _build_auth_code_flow(authority=None, scopes=None):
    return _build_msal_app(authority=authority).initiate_auth_code_flow(
        scopes or [],
        redirect_uri=url_for("authorized", _external=True),
        login_hint="bob@contoso.com")
```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Find the `initiate_auth_code_flow` method, and then add the `domain_hint` parameter with the login hint.

    ```python
    def _build_auth_code_flow(authority=None, scopes=None):
        return _build_msal_app(authority=authority).initiate_auth_code_flow(
            scopes or [],
            redirect_uri=url_for("authorized", _external=True),
            domain_hint="facebook.com")
    ```


## Next steps

- To learn more, see [MSAL for Python configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-python/wiki).
