---
title: Enable Azure Static Web App authentication options using Azure Active Directory B2C
description:  This article discusses several ways to enable Azure Static Web App authentication options.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/28/2022
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication options in an Azure Static Web App by using Azure AD B2C 

This article describes how to enable, customize, and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your Azure Static Web Apps. 

Before you start, it's important to familiarize yourself with the [Configure authentication in an Azure Static Web App by using Azure AD B2C](configure-authentication-in-azure-static-app.md) article.

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Open the [configuration file](../static-web-apps/configuration.md). This file contains information about your Azure AD B2C identity provider.

In the configuration file, follow these steps:

1. Under the `customOpenIdConnectProviders` locate the `wellKnownOpenIdConfiguration` element.
1. Update the URL of your Azure AD B2C well-Known configuration endpoint with your custom domain and [tenant ID]( tenant-management-read-tenant-name.md#get-your-tenant-id). For more information, see [Use tenant ID](custom-domain.md#optional-use-tenant-id).

The following JSON shows the app settings before the change: 

```JSON
"openIdConnectConfiguration": {
    "wellKnownOpenIdConfiguration": "https://contoso.b2clogin.com/contoso.onmicrosoft.com/<POLICY_NAME>/v2.0/.well-known/openid-configuration"
    }
}
```  

The following JSON shows the app settings after the change: 

```JSON
"openIdConnectConfiguration": {
    "wellKnownOpenIdConfiguration": "https://login.contoso.com/00000000-0000-0000-0000-000000000000/<POLICY_NAME>/v2.0/.well-known/openid-configuration"
    }
``` 


[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Open the [configuration file](../static-web-apps/configuration.md).
1. Under the `login` element, locate the `loginParameterNames`.
1. Add the domain_hint parameter with its corresponding value, such as facebook.com. 

The following code snippets demonstrate how to pass the domain hint parameter. It uses facebook.com as the attribute value.
    
```json
"login": {
    "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    "scopes": [],
    "loginParameterNames": ["domain_hint=facebook.com"]
}
```


[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure language customization](language-customization.md).
1. Open the [configuration file](../static-web-apps/configuration.md).
1. Under the `login` element, locate the `loginParameterNames`.
1. Add the ui_locales parameter with its corresponding value, such as `es-es`. 

The following code snippets demonstrate how to pass the `ui_locales` parameter. It uses `es-es` as the attribute value.

```json
"login": {
    "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    "scopes": [],
    "loginParameterNames": ["ui_locales=es-es"]
}
```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Open the [configuration file](../static-web-apps/configuration.md).
1. Under the `login` element, locate the `loginParameterNames`.
1. Add the custom parameter, such as `campaignId`. 

The following code snippets demonstrate how to pass the `campaignId` custom query string parameter. It uses `germany-promotion` as the attribute value.

```json
"login": {
    "nameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    "scopes": [],
    "loginParameterNames": ["campaignId=germany-promotion"]
}
```

## Next steps

- Check out the [Azure Static App configuration overview](../static-web-apps/configuration-overview.md) article.