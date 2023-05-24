---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
An API need to publish a minimum of one app role for applications, also called [Application Permission](../../../../develop/permissions-consent-overview.md), for the client apps to obtain an access token as themselves. Application permissions are the type of permissions that APIs should publish when they want to enable client applications to successfully authenticate as themselves and not need to sign-in users. To publish an application permission, follow these steps:

1. From the **App registrations** page, select the application that you created (such as *ciam-ToDoList-api*) to open its **Overview** page.

1. Under **Manage**, select **App roles**.
 
1. Select **Create app role**.
    
    1. For **Display name**, enter a suitable name for your application permission, such as **ToDoList.Read.All**.
     
    1. For **Allowed member types**, choose **Application** to ensure other applications can be granted this permission.
     
    1. For **Value**, enter **ToDoList.Read.All**.
     
    1. For **Description**, enter **Allow the app to read every user's ToDo list using the 'TodoListApi'**.
     
    1. Select **Apply** to save your changes.
    
1.  Select **Create app role** again:

    1. For **Display name**, enter a suitable name for your application permission, such as **ToDoList.ReadWrite.All**.
     
    1. For **Allowed member types**, choose **Application** to ensure other applications can be granted this permission.
     
    1. For **Value**, enter **ToDoList.ReadWrite.All**.
     
    1. For **Description**, enter **Allow the app to read and write every user's ToDo list using the 'TodoListApi'**.
     
    1. Select **Apply** to save your changes.