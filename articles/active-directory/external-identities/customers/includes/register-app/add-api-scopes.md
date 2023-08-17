---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---

An API needs to publish a minimum of one scope, also called [Delegated Permission](../../../../develop/permissions-consent-overview.md), for the client apps to obtain an access token for a user successfully. To publish a scope, follow these steps:

1. From the **App registrations** page, select the API application that you created (*ciam-ToDoList-api*) to open its **Overview** page.
1. Under **Manage**, select **Expose an API**.
1. At the top of the page, next to **Application ID URI**, select the **Add** link to generate a URI that is unique for this app.
1. Accept the proposed Application ID URI such as `api://{clientId}`, and select **Save**. When your web application requests an access token for the web API, it adds the URI as the prefix for each scope that you define for the API.

1. Under **Scopes defined by this API**, select **Add a scope**.

1. Enter the following values that define a read access to the API, then select **Add scope** to save your changes:
    

    | Property | Value |
    |----------|-------|
    | Scope name | *ToDoList.Read* |
    | Who can consent | **Admins only** |
    | Admin consent display name | *Read users ToDo list using the 'TodoListApi'* |
    | Admin consent description | *Allow the app to read the user's ToDo list using the 'TodoListApi'*. |
    | State | **Enabled** |
    
1. Select **Add a scope** again, and enter the following values that define a read and write access scope to the API. Select **Add scope** to save your changes:
    
    | Property | Value |
    |----------|-------|
    | Scope name | *ToDoList.ReadWrite* |
    | Who can consent | **Admins only** |
    | Admin consent display name | *Read and write users ToDo list using the 'ToDoListApi'* |
    | Admin consent description | *Allow the app to read and write the user's ToDo list using the 'ToDoListApi'* |
    | State | **Enabled** |
    
1. Under **Manage**, select **Manifest** to open the API manifest editor.
1. Set `accessTokenAcceptedVersion` property to `2`.
1. Select **Save**.

Learn more about [the principle of least privilege when publishing permissions](/security/zero-trust/develop/protected-api-example) for a web API. 