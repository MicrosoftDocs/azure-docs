---
title: 'Azure Active Directory B2C: Application registration | Microsoft Docs'
description: How to register your application with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 20e92275-b25d-45dd-9090-181a60c99f69
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 6/13/2017
ms.author: parakhj


---
# Azure Active Directory B2C: Register your application

> [!IMPORTANT]
> Applications created from the Azure AD B2C blade in the Azure portal must be managed from the same location. If you edit the B2C applications using PowerShell or another portal, they become unsupported and will not work with Azure AD B2C. Read more [below](#faulted-apps).
>

## Prerequisite

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md). After you follow all the steps in that article, you will have the B2C features blade pinned to your Startboard.

[!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Navigate to the B2C features blade

If you have the B2C features blade pinned to your Startboard, you will see the blade as soon as you sign in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant.

You can also access the blade by clicking **More services** and then searching **Azure AD B2C** in the left navigation pane on the [Azure portal](https://portal.azure.com/).

> [!IMPORTANT]
> You need to be a Global Administrator of the B2C tenant to be able to access the B2C features blade. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure portal.
>
>

## Register a web application

1. On the B2C features blade on the Azure portal, click **Applications**.
1. Click **+Add** at the top of the blade.
1. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C app".
1. Toggle the **Include web app / web API** switch to **Yes**.
1. Enter [a proper](#limitations) value for the **Reply URLs**, which are endpoints where Azure AD B2C will return any tokens that your application requests. For example, enter `https://localhost:44316/`.
1. Click **Create** to register your application.
1. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.
1. If your web application will also be calling a web API secured by Azure AD B2C, you'll want to:
    1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
    1. Click on **API Access**, click on **Add** and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
>

## Register a web api

1. On the B2C features blade on the Azure portal, click **Applications**.
1. Click **+Add** at the top of the blade.
1. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C api".
1. Toggle the **Include web app / web API** switch to **Yes**.
1. Enter [a proper](#choosing-a-web-app/api-reply-url) value for the **Reply URLs**, which are endpoints where Azure AD B2C will return any tokens that your application requests. For example, enter `https://localhost:44316/`.
1. Enter an **App ID URI**. This is the identifier used for your web API. For example, enter 'notes'. It will generate the full identifier URI underneath.
1. Click **Create** to register your application.
1. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.
1. Click on **Published scopes**. This is where you define the permissions (scopes) that can be granted to other applications.
1. Add more scopes as necessary. By default, the "user_impersonation" scope will be defined. This gives other applications the ability to access this api on behalf of the signed-in user. This can be removed if you wish.
1. Click **Save**.

## Register a mobile/native application

1. On the B2C features blade on the Azure portal, click **Applications**.
1. Click **+Add** at the top of the blade.
1. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C app".
1. Toggle the **Include native client** switch to **Yes**.
1. Enter a **Redirect URI** with a custom scheme. For example, com.onmicrosoft.contoso.appname://redirect/path. Make sure you choose a [good redirect URI](#choosing-a-native-application-redirect-uri) and do not include special characters such as underscores.
1. Click **Save** to register your application.
1. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.
1. If your native application will also be calling a web API secured by Azure AD B2C, you'll want to:
    1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
    1. Click on **API Access**, click on **Add** and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
>

## Limitations

### Choosing a web app/api reply URL

Currently, apps that are registered with Azure AD B2C are restricted to a limited set of reply URL values. The reply URL for web apps and services must begin with the scheme `https`, and all reply URL values must share a single DNS domain. For example, you cannot register a web app that has one of these reply URLs:

`https://login-east.contoso.com`

`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing reply URL to the DNS name of the reply URL that you are adding. The request to add the DNS name will fail if either of the following conditions is true:

* The whole DNS name of the new reply URL does not match the DNS name of the existing reply URL.
* The whole DNS name of the new reply URL is not a subdomain of the existing reply URL.

For example, if the app has this reply URL:

`https://login.contoso.com`

You can add to it, like this:

`https://login.contoso.com/new`

In this case, the DNS name matches exactly. Or, you can do this:

`https://new.login.contoso.com`

In this case, you're referring to a DNS subdomain of login.contoso.com. If you want to have an app that has login-east.contoso.com and login-west.contoso.com as reply URLs, you must add those reply URLs in this order:

`https://contoso.com`

`https://login-east.contoso.com`

`https://login-west.contoso.com`

You can add the latter two because they are subdomains of the first reply URL, contoso.com.

### Choosing a native application redirect URI

There are two important considerations when choosing a redirect URI for mobile/native applications:

* **Unique**: The scheme of the redirect URI should be unique for every application. In our example (com.onmicrosoft.contoso.appname://redirect/path), we use com.onmicrosoft.contoso.appname as the scheme. We recommend following this pattern. If two applications share the same scheme, the user will see a "choose app" dialog. If the user makes an incorrect choice, the login will fail.
* **Complete**: Redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain (for example, //contoso/ will work and //contoso will fail).

Ensure there are no special characters like underscores in the redirect uri.

### Faulted apps

B2C applications should NOT be edited:

* On other application management portals such as the [Azure classic portal](https://manage.windowsazure.com/) & the [Application Registration Portal](https://apps.dev.microsoft.com/).
* Using Graph API or PowerShell

If you edit the B2C application as described above and try to edit it again in the Azure AD B2C features blade on the Azure portal, it will become a faulted app, and your application will no longer be usable with Azure AD B2C. You will have to delete the application and create it again.

To delete the app, go to the [Application Registration Portal](https://apps.dev.microsoft.com/) and delete the application there. In order for the application to be visible, you need to be the owner of the application (and not just an admin of the tenant).

## Next steps

Now that you have an application registered with Azure AD B2C, you can complete one of [our quick-start tutorials](active-directory-b2c-overview.md#get-started) to get up and running.
