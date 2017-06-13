---
title: 'Azure Active Directory B2C: Application registration | Microsoft Docs'
description: How to register your application with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: PatAltimore

ms.assetid: 20e92275-b25d-45dd-9090-181a60c99f69
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/13/2017
ms.author: parakhj


---
# Azure Active Directory B2C: Register your application

This Quickstart helps you register an application in a Microsoft Azure Active Directory (Azure AD) B2C tenant in a few minutes. When you're finished, your application is registered for use in the Azure B2C tenant.

## Prerequisites

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

Applications created from the Azure AD B2C blade in the Azure portal must be managed from the same management tool. If you edit the B2C applications using PowerShell or another tool, they become unsupported and may not work with Azure AD B2C. 

## Navigate to B2C settings

Log in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant. 

[!INCLUDE [active-directory-b2c-find-service-settings](../../includes/active-directory-b2c-find-service-settings.md)]

Choose next steps based on the application type you are registering:

* [Register a web application](#register-a-web-application)
* [Register a web API](#register-a-web-api)
* [Register a mobile or native application](#register-a-mobile-or-native-application)
 
## Register a web application

[!INCLUDE [active-directory-b2c-register-web-app](../../includes/active-directory-b2c-register-web-app.md)]

[Jump to **Next steps**](#next-steps)

## Register a web API

[!INCLUDE [active-directory-b2c-register-web-api](../../includes/active-directory-b2c-register-web-api.md)]

[Jump to **Next steps**](#next-steps)

## Register a mobile or native application

[!INCLUDE [active-directory-b2c-register-mobile-or-native-app](../../includes/active-directory-b2c-register-mobile-or-native-app.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET web app with sign-up, sign-in, and password reset](active-directory-b2c-devquickstarts-web-dotnet-susi.md)

