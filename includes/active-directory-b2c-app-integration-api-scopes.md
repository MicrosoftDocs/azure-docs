---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
1. Select the *my-api1* application you created to open its **Overview** page.
1. Under **Manage**, select **Expose an API**.
1. Next to **Application ID URI**, select the **Set** link. Replace the default value (a GUID) a unique name, such as `tasks-api`, and then select  **Save**. When your web application requests an access token for the web API, it should add this URI as the prefix for each scope that you define for the API.
1. Under **Scopes defined by this API**, select **Add a scope**.
1. Enter the following values to create a scope that defines read access to the API, then select **Add scope**:
    1. **Scope name**: `tasks.read`
    1. **Admin consent display name**: `Read access to tasks API`
    1. **Admin consent description**: `Allows read access to the tasks API`
1. Select **Add a scope**, enter the following values to add a scope that defines write access to the API, and then select **Add scope**:
    1. **Scope name**: `tasks.write`
    1. **Admin consent display name**: `Write access to tasks API`
    1. **Admin consent description**: `Allows write access to the tasks API`