---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Used by the web app/web API tutorials for granting access to an API
---
#### [Applications](#tab/portal/)

1. Select **Applications**.
1. Select the *webapi1* application to open its **Properties** page.
1. Select **Published scopes**. Published scopes can be used to grant a client application certain permissions to the web API.
1. For **SCOPE**, enter `demo.read`, and for **DESCRIPTION**, enter `Read access to the web API`.
1. For **SCOPE**, enter `demo.write`, and for **DESCRIPTION**, enter `Write access to the web API`.
1. Select **Save**.

#### [App registrations (Preview)](#tab/portal-preview/)

1. Select **Applications (Preview)**.
1. Select the *webapi1* application to open its **Overview** page.
1. Under **Manage**, select **Expose an API**.
1. Next to **Application ID URI**, select the **Set** link.
1. Replace the default value with a unique URI that identifies your API. For example, `https://contosob2c.onmicrosoft.com/api`. Replace "contosob2c" with the name of your B2C tenant. When your web application requests an access token for the API, it should add this URI as the prefix for each scope that you define for the API.
1. Select **Save**.
1. Under **Scopes defined by this API**, select **Add a scope**.
1. Enter the following values to create a scope that defines read access to the API, then select **Add scope**:
    1. **Scope name**: `demo.read`
    1. **Admin consent display name**: `Read access to demo API`
    1. **Admin consent description**: `Allows read access to the demo API`
1. Select **Add a scope**, enter the following values to add a scope that defines write access to the API, and then select **Add scope**:
    1. **Scope name**: `demo.write`
    1. **Admin consent display name**: `Write access to demo API`
    1. **Admin consent description**: `Allows write access to the demo API`