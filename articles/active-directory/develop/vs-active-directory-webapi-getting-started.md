---
title: Get Started with Azure AD in Visual Studio WebApi projects | Microsoft Docs
description: How to get started using Azure Active Directory in WebApi projects after connecting to or creating an Azure AD using Visual Studio connected services
services: active-directory
documentationcenter: ''
author: TomArcher
manager: douge
editor: ''

ms.assetid: bf1eb32d-25cd-4abf-8679-2ead299fedaa
ms.service: active-directory
ms.workload: web
ms.tgt_pltfrm: vs-getting-started
ms.devlang: na
ms.topic: article
ms.date: 03/19/2017
ms.author: tarcher
ms.custom: aaddev

---
# Get Started with Azure Active Directory and Visual Studio connected services (WebApi projects)
> [!div class="op_single_selector"]
> * [Getting Started](vs-active-directory-webapi-getting-started.md)
> * [What Happened](vs-active-directory-webapi-what-happened.md)
> 
> 

## Requiring authentication to access controllers
All controllers in your project were adorned with the **Authorize** attribute. This attribute requires the user to be authenticated before accessing the APIs defined by these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.

## Next steps
[Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory/)

