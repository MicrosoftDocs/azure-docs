---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
An API needs to publish a minimum of one app role for applications, also called [Application Permission](../../../../develop/permissions-consent-overview.md), for the client apps to obtain an access token as themselves. Application permissions are the type of permissions that APIs should publish when they want to enable client applications to successfully authenticate as themselves and not need to sign-in users. To publish an application permission, follow these steps:

1. From the **App registrations** page, select the application that you created (such as *ciam-ToDoList-api*) to open its **Overview** page.
1. Under **Manage**, select **App roles**.
1. Select **Create app role**, then enter the following values, then select **Apply** to save your changes:

    | Property | Value |
    |----------|-------| 
    | Display name | *ToDoList.Read.All* |
    | Allowed member types | **Applications** |
    | Value | *ToDoList.Read.All* |
    | Description | *Allow the app to read every user's ToDo list using the 'TodoListApi'* |
    
1. Select **Create app role** again, then enter the following values for the second app role, then select **Apply** to save your changes:

    | Property | Value |
    |----------|-------| 
    | Display name | *ToDoList.ReadWrite.All* |
    | Allowed member types | **Applications** |
    | Value | *ToDoList.ReadWrite.All* |
    | Description | *Allow the app to read and write every user's ToDo list using the 'ToDoListApi'* |