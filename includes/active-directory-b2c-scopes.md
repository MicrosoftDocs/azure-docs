---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/09/2019
ms.author: marsma
# Used by the web app/web API tutorials for granting access to an API
---
1. Select **Applications (Preview)**.
1. Select the *webapi1* application to open its **Overview** page.
1. Under **Manage**, select **Expose an API**.
1. Under **Scopes defined by this API**, select **Add a scope**.
1. On the **Add a scope** page, accept the default **Application ID URI**, and then select **Save and continue**.
1. Enter the following values to create a scope that defines read access to the API, then select **Add scope**:
    1. **Scope name**: `demo.read`
    1. **Admin consent display name**: `Read access to demo API`
    1. **Admin consent description**: `Allows read access to the demo API`
1. Select **Add a scope**, enter the following values to add a scope that defines write access to the API, and then select **Add scope**:
    1. **Scope name**: `demo.write`
    1. **Admin consent display name**: `Write access to demo API`
    1. **Admin consent description**: `Allows write access to the demo API`