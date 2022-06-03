---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 04/26/2022
ms.author: danlep
---

The following example policy, when added to the `<inbound>` policy section, checks the value of the audience claim in an access token obtained from Azure AD that is presented in the Authorization header. It returns an error message if the token is not valid. Configure this policy at a policy scope that's appropriate for your scenario.

* In `openid-config`, the `aad-tenant` is the tenant ID in Azure AD. Find this value in the Azure portal, for example, on the **Overview** page of your Azure AD resource.
* The value of the `claim` is the client ID of the backend-app you registered in Azure AD.


```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/{aad-tenant}/v2.0/.well-known/openid-configuration" />
    <required-claims>
        <claim name="aud">
            <value>{backend-app-client-id}</value>
        </claim>
    </required-claims>
</validate-jwt>
```

> [!NOTE]
> The preceding `openid-config` URL corresponds to the v2 endpoint. For the v1 `openid-config`endpoint, use `https://login.microsoftonline.com/{aad-tenant}/.well-known/openid-configuration`.

For information on how to configure policies, see [Set or edit policies](../articles/api-management/set-edit-policies.md).
