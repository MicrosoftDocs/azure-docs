---
title: Authenticate with on-premises Active Directory in your Azure app | Microsoft Docs
description: Learn about the different options for line-of-business apps in Azure App Service to authenticate with on-premises Active Directory
services: app-service
documentationcenter: ''
author: cephalin
manager: erikre
editor: jimbe

ms.assetid: dde6b7e6-bf6a-4fa5-8390-3a18155d21bd
ms.service: app-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 08/31/2016
ms.author: cephalin

---
# Authenticate with on-premises Active Directory in your Azure app
This article shows you how to authenticate with on-premises Active Directory (AD) in 
[Azure App Service](../app-service/app-service-value-prop-what-is.md). An Azure app is hosted in the cloud, 
but there are ways to authenticate on-premises AD users securely. 

## Authenticate through Azure Active Directory
An Azure Active Directory tenant can be directory-synced with an on-premises AD. This approach enables AD users to
access your App from the internet and authenticate using their on-premises credentials. Furthermore, Azure App 
Service provides a [turn-key solution for this method](../app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication.md). 
With a few clicks of a button, you can enable authentication with a directory-synced tenant for your Azure app. This
approach has the following advantages:

* Does not require any authentication code in your app. Let App Service do the authentication for you and spend
  your time on providing functionality in your app.
* [Azure AD Graph API](http://msdn.microsoft.com/library/azure/hh974476.aspx) enables access to directory data 
  from your Azure app.
* Provides SSO to [all applications supported by Azure Active Directory](/marketplace/active-directory/), 
  including Office 365, Dynamics CRM Online, Microsoft Intune, and thousands of non-Microsoft cloud applications. 
* Azure Active Directory supports role-based access control. You can use the [Authorize(Roles="X")] pattern 
  with minimal changes to your code.

To see how to write a line-of-business Azure app that authenticates with Azure Active Directory, see 
[Create a line-of-business Azure app with Azure Active Directory authentication](web-sites-dotnet-lob-application-azure-ad.md).

## Authenticate through an on-premises STS
If you have an on-premises secure token service (STS) like Active Directory Federation Services (AD FS), you can 
use that to federate authentication for your Azure app. This approach is best when company policy prohibits AD data 
from being stored in Azure. However, note the following:

* STS topology must be deployed on-premises, with cost and management overhead.
* Only AD FS administrators can configure 
  [relying party trusts and claim rules](http://technet.microsoft.com/library/dd807108.aspx), which may limit
  the developer's options. On the other hand, it is possible to manage and customize
  [claims](http://technet.microsoft.com/library/ee913571.aspx) on a per-application basis.
* Access to on-premises AD data requires a separate solution through the corporate firewall.

To see how to write a line-of-business Azure app that authenticates with an on-premises STS, see 
[Create a line-of-business Azure app with AD FS authentication](web-sites-dotnet-lob-application-adfs.md).

