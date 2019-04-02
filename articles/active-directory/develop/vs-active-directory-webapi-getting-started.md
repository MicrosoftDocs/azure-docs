---
title: Get Started with Azure AD in Visual Studio WebApi projects
description: How to get started using Azure Active Directory in WebApi projects after connecting to or creating an Azure AD using Visual Studio connected services
services: active-directory
author: ghogen
manager: douge
ms.assetid: bf1eb32d-25cd-4abf-8679-2ead299fedaa
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 03/12/2018
ms.author: ghogen
ms.custom: aaddev, vs-azure
ms.collection: M365-identity-device-management
---
# Get Started with Azure Active Directory (WebApi projects)

> [!div class="op_single_selector"]
> - [Getting Started](vs-active-directory-webapi-getting-started.md)
> - [What Happened](vs-active-directory-webapi-what-happened.md)

This article provides additional guidance after you've added Active Directory to an ASP.NET WebAPI project through the **Project > Connected Services** command of Visual Studio. If you've not already added the service to your project, you can do so at any time.

See [What happened to my WebAPI project?](vs-active-directory-webapi-what-happened.md) for the changes made to your project when adding the connected service.

## Requiring authentication to access controllers

All controllers in your project were adorned with the `[Authorize]` attribute. This attribute requires the user to be authenticated before accessing the APIs defined by these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.

## Next steps

- [Authentication scenarios for Azure Active Directory](authentication-scenarios.md)
- [Add sign-in with Microsoft to an ASP.NET web app](quickstart-v1-aspnet-webapp.md)
