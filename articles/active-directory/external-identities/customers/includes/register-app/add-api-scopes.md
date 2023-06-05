---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
An API need to publish a minimum of one scope, also called [Delegated Permission](../../../../develop/permissions-consent-overview.md), for the client apps to obtain an access token for a user successfully. To publish a scope, follow these steps:

1. From the **App registrations** page, select the API application that you created (*ciam-ToDoList-api*) to open its **Overview** page.

1. Under **Manage**, select **Expose an API**.

1. At the top of the page, next to **Application ID URI**, select the **Set** link to generate a URI that is unique for this app.
 
1. Accept the proposed Application ID URI such as `api://{clientId}`, and select **Save**. When your web application requests an access token for the web API, it adds the URI as the prefix for each scope that you define for the API.
 
1. Under **Scopes defined by this API**, select **Add a scope**.
    
    1. For **Scope name**, enter *ToDoList.Read*.
    
    1. For **Admin consent display name**, enter **Read users ToDo list using the 'TodoListApi'**.
    
    1. For **Admin consent description**, enter **Allow the app to read the user's ToDo list using the 'TodoListApi'**.
    
    1. Keep **State** as **Enabled** and select **Add scope**.
    

1. Select **Add a scope** again, and then add a scope that defines read and write access to the API:

    1. For **Scope name**, enter *ToDoList.ReadWrite*.
    
    1. For **Admin consent display name**, enter **Read and write users ToDo list using the 'TodoListApi'**.
    
    1. For **Admin consent description**, enter **Allow the app to read and write the user's ToDo list using the 'TodoListApi'**.
    
    1. Keep **State** as **Enabled** and select **Add scope**.
    

1. Under **Manage**, select **Manifest** to open the API manifest editor.

1. Set `accessTokenAcceptedVersion` property to **2**.

1. Select **Save**.

Learn more about [the principle of least privilege when publishing permissions](/security/zero-trust/develop/protected-api-example) for a web API. 
