---
title: Adding an Azure Active Directory by using Connected Services in Visual Studio | Microsoft Docs
description: Add an Azure Active Directory by using the Visual Studio Add Connected Services dialog box
services: visual-studio-online
documentationcenter: na
author: TomArcher
manager: douge
editor: ''

ms.assetid: f599de6b-e369-436f-9cdc-48a0165684cb
ms.service: active-directory
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/01/2017
ms.author: tarcher

---
# Adding an Azure Active Directory by using Connected Services in Visual Studio
By using Azure Active Directory (Azure AD), you can support Single Sign-On (SSO) for ASP.NET MVC web applications, or Active Directory Authentication in Web API services. With Azure Active Directory Authentication, your users can use their accounts from Azure Active Directory to connect to your web applications. The advantages of Azure Active Directory Authentication with Web API include enhanced data security when exposing an API from a web application. With Azure AD, you do not have to manage a separate authentication system with its own account and user management.

## Prerequisites
- Azure account - If you don't have an Azure account, you can [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

### Connect to Azure Active Directory using the Connected Services dialog
1. In Visual Studio, create or open an ASP.NET MVC project, or an ASP.NET Web API project.

1. From the Solution Explorer, right-click the **Connected Services** node, and, from the context menu, select **Add Connected Services**.

1. On the **Connected Services** page, select **Authentication with Azure Active Directory**.
   
    ![Connected Services page](./media/vs-azure-tools-connected-services-add-active-directory/connected-services-add-active-directory.png)

1. On the **Introduction** page of the **Configure Azure AD Authentication** wizard, select **Next**.
   
    ![Introduction page](./media/vs-azure-tools-connected-services-add-active-directory/configure-azure-ad-wizard-1.png)

1. On the **Single-Sign On** page of the **Configure Azure AD Authentication** wizard, select a domain from the **Domain** drop-down list. The list of domains contains all domains accessible by the accounts listed in the Account Settings dialog. As an alternative, you can enter a domain name if you don’t find the one you’re looking for, such as `mydomain.onmicrosoft.com`. You can choose the option to create an Azure Active Directory app or use the settings from an existing Azure Active Directory app. Select **Next** when done.
   
	![Single-sign on page](./media/vs-azure-tools-connected-services-add-active-directory/configure-azure-ad-wizard-2.png)

1. On the **Directory Access** page of the **Configure Azure AD Authentication** wizard, ensure that the **Read directory data** option is checked. 
   
    ![Directory access page](./media/vs-azure-tools-connected-services-add-active-directory/configure-azure-ad-wizard-3.png)

1. Select **Finish** to add the necessary configuration code and references to enable your project for Azure AD authentication. You can see the Active Directory domain on the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Visual Studio will display a [What Happened](#how-your-project-is-modified) article to show you how your project was modified. If you want to check that everything worked, open one of the modified configuration files and verify that the settings mentioned in the article are there. 

## How your project is modified
When you run the wizard, Visual Studio adds Azure Active Directory and associated references to your project. Configuration files and code files in your project are also modified to add support for Azure AD. The specific modifications that Visual Studio makes depend on the project type. For detailed information about how ASP.NET MVC projects are modified, see [What happened– MVC Projects](http://go.microsoft.com/fwlink/p/?LinkID=513809). For Web API projects, see [What happened – Web API Projects](http://go.microsoft.com/fwlink/p/?LinkId=513810).

## Next steps
* [MSDN Forum for Azure Active Directory](https://social.msdn.microsoft.com/forums/azure/home?forum=WindowsAzureAD)
* [Azure Active Directory Documentation](https://azure.microsoft.com/documentation/services/active-directory/)
* [Blog Post: Intro to Azure Active Directory](http://blogs.msdn.com/b/brunoterkaly/archive/2014/03/03/introduction-to-windows-azure-active-directory.aspx)

