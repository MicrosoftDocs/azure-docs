---
title: 'Azure Active Directory B2C: Application registration | Microsoft Docs'
description: How to register your application with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: swkrish
manager: mbaldwin
editor: bryanla

ms.assetid: 20e92275-b25d-45dd-9090-181a60c99f69
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/06/2016
ms.author: swkrish

---
# Azure Active Directory B2C: Register your application
## Prerequisite
To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md). After you follow all the steps in that article, you will have the B2C features blade pinned to your Startboard.

[!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Navigate to the B2C features blade
If you have the B2C features blade pinned to your Startboard, you will see the blade as soon as you sign in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant.

You can also access the blade by clicking **More services** and then searching **Azure AD B2C** in the left navigation pane on the [Azure portal](https://portal.azure.com/).

> [!IMPORTANT]
> You need to be a Global Administrator of the B2C tenant to be able to access the B2C features blade. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure Portal.
> 
> 

## Register a web application
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C app".
4. Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C will return any tokens that your application requests. For example, enter `https://localhost:44316/`.
5. Click **Create** to register your application.
6. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.

> [!IMPORTANT]
> Applications created in the B2C features blade have to be managed in the same location. If you edit B2C applications using PowerShell or another portal, they become unsupported and will likely not work with Azure AD B2C.
> 
> 

## Register a mobile application
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C app".
4. Toggle the **Include native client** switch to **Yes**. Copy down the default **Redirect URI** that is automatically created for you.
5. Click **Create** to register your application.
6. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.

> [!IMPORTANT]
> Applications created in the B2C features blade have to be managed in the same location. If you edit B2C applications using PowerShell or another portal, they become unsupported and will likely not work with Azure AD B2C.
> 
> 

## Register a web api
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C api".
4. Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C will return any tokens that your application requests. For example, enter `https://localhost:44316/`.
5. Enter an **App ID URI**. This is the identifier used for your web API. For example, enter 'notes'. It will generate the full identifier URI underneath. 
6. Click **Create** to register your application.
7. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.
8. Click on **Published scopes**. This is where you define the permissions (scopes) that can be granted to other applications.
9. Add more scopes as necessary. By default, the "user_impersonation" scope will be defined. This gives other applications the ability to access this api on behalf of the signed-in user. This can be removed if you wish. 
10. Click **Save**.

> [!IMPORTANT]
> Applications created in the B2C features blade have to be managed in the same location. If you edit B2C applications using PowerShell or another portal, they become unsupported and will likely not work with Azure AD B2C.
> 
> 

## Build a Quick Start Application
Now that you have an application registered with Azure AD B2C, you can complete one of our quick-start tutorials to get up and running. Here are a few recommendations:

[!INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-b2c-quickstart-table.md)]

