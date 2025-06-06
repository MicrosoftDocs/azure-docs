---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/11/2024
ms.author: kengaderdus
# Used by the web app/web API tutorials for granting access to an API.
---

1. Select **App registrations**.
1. Select the *webapi1* application to open its **Overview** page.
1. Under **Manage**, select **Expose an API**.
1. Next to **Application ID URI**, select the **Add** link.
1. Replace the default value (a GUID) with `api`, and then select **Save**. The full URI is shown, and should be in the format `https://your-tenant-name.onmicrosoft.com/api`. When your web application requests an access token for the API, it should add this URI as the prefix for each scope that you define for the API.
1. Under **Scopes defined by this API**, select **Add a scope**.
1. Enter the following values to create a scope that defines read access to the API, then select **Add scope**:
    1. **Scope name**: `demo.read`
    1. **Admin consent display name**: `Read access to demo API`
    1. **Admin consent description**: `Allows read access to the demo API`
1. Select **Add a scope**, enter the following values to add a scope that defines write access to the API, and then select **Add scope**:
    1. **Scope name**: `demo.write`
    1. **Admin consent display name**: `Write access to demo API`
    1. **Admin consent description**: `Allows write access to the demo API`