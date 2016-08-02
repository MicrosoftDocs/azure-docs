<properties
	pageTitle="Azure Active Directory B2C: Application registration | Microsoft Azure"
	description="How to register your application with Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="mbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/22/2016"
	ms.author="swkrish"/>


# Azure Active Directory B2C: Register your application

## Prerequisite

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md). After you follow all the steps in that article, you will have the B2C features blade pinned to your Startboard.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Navigate to the B2C features blade

If you have the B2C features blade pinned to your Startboard, you will see the blade as soon as you sign in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant.

You can also access the blade by clicking **Browse** and then **Azure AD B2C** in the left navigation pane on the [Azure portal](https://portal.azure.com/).

> [AZURE.IMPORTANT] You need to be a Global Administrator of the B2C tenant to be able to access the B2C features blade. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure Portal.

## Register an application

1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that will describe your application to consumers. For example, you could enter "Contoso B2C app".
4. If you are writing a web-based application, toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C will return any tokens that your application requests. For example, enter `https://localhost:44321/`. If your web application will also be calling some web API secured by Azure AD B2C, you'll want to create an **Application Secret** as well by clicking the **Generate Key** button.
5. If you are writing a mobile application, toggle the **Include native client** switch to **Yes**. Copy down the default **Redirect URI** that is automatically created for you.
6. Click **Create** to register your application.
7. Click the application that you just created and copy down the globally unique **Application Client ID** that you'll use later in your code.

> [AZURE.NOTE] An **Application Secret** is an important security credential, and should be secured appropriately.

## Build a Quick Start Application

Now that you have an application registered with Azure AD B2C, you can complete one of our quick-start tutorials to get up and running. Here are a few recommendations:

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-b2c-quickstart-table.md)]
