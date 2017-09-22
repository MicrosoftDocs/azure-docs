---
title: Azure Active Directory Conditional Access technical reference | Microsoft Docs
description: With Conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application.
services: active-directory.
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 56a5bade-7dcc-4dcf-8092-a7d4bf5df3c1
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/01/2017
ms.author: markvi
ms.reviewer: spunukol

---
# Azure Active Directory Conditional Access technical reference

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can fine-tune how authorized users can access your resources.  
This topic provides you with support information for the following items of a conditional access policy: 

- Cloud apps assignments

- Device platform condition 

- Client apps condition

- Approved client app requirement 



## Cloud apps assignments

When you configure a conditional access policy, you need to [select the cloud apps your policy applies to](active-directory-conditional-access-azure-portal.md#who). 

![Control](./media/active-directory-conditional-access-technical-reference/09.png)


### Microsoft cloud apps

You can assign a conditional access policy to the following cloud apps from Microsoft:

- Azure Remote App

- Dynamics CRM

- Microsoft Office 365 Yammer

- Microsoft Office 365 Exchange Online

- Microsoft Office 365 SharePoint Online (includes OneDrive for Business)

- Microsoft Power BI 

- Visual Studio Team Services

- Microsoft Teams


### Other apps 

In addition to the Microsoft cloud apps, you can assign a conditional access policy to the following types of cloud apps:

- Azure Active Directory (Azure AD)-connected applications

- Pre-integrated federated software as a service (SaaS) applications

- Applications that use password single sign-on (SSO)

- Line-of-business applications

- Applications that use Azure AD Application Proxy. 


## Device platforms condition

In a conditional access policy, you can configure the device platform condition to tie the policy to the operating system that is running on a client.

![Control](./media/active-directory-conditional-access-technical-reference/41.png)

Azure AD conditional access supports the following device platforms:

- Android

- iOS

- Windows Phone

- Windows

- macOS (preview)



## Client apps condition 

When you configure a conditional access policy, you can set a [client apps condition](active-directory-conditional-access-azure-portal.md#client-apps). The client apps condition enables you to grant or block access when an access attempt was made from these types of client apps:

- Browser
- Mobile apps and desktop apps

![Control](./media/active-directory-conditional-access-technical-reference/03.png)

### Supported browsers 

If you select *Browsers* in your conditional access policy to grant access to resources, access is only granted, when the access attempt is made using a supported browser. When an access attempt is made using an unsupported browser, the attempt is blocked.

![Supported browsers](./media/active-directory-conditional-access-technical-reference/05.png)

In your conditional access policy, the following browsers are supported: 


| OS                     | Browsers                 | Support     |
| :--                    | :--                      | :-:         |
| Win 10                 | IE, Edge                 | ![Check][1] |
| Win 10                 | Chrome                   | Preview     |
| Win 8 / 8.1            | IE, Chrome               | ![Check][1] |
| Win 7                  | IE, Chrome               | ![Check][1] |
| iOS                    | Safari                   | ![Check][1] |
| Android                | Chrome                   | ![Check][1] |
| Windows Phone          | IE, Edge                 | ![Check][1] |
| Windows Server 2016    | IE, Edge                 | ![Check][1] |
| Windows Server 2016    | Chrome                   | Coming soon |
| Windows Server 2012 R2 | IE, Chrome               | ![Check][1] |
| Windows Server 2008 R2 | IE, Chrome               | ![Check][1] |
| Mac OS                 | Safari                   | ![Check][1] |
| Mac OS                 | Chrome                   | Coming soon |

> [!NOTE]
> For Chrome support, you must be using Windows 10 Creators Update and install the extension found [here](https://chrome.google.com/webstore/detail/windows-10-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji).


### Supported mobile apps and desktop clients

If you select **Mobile apps and desktop clients** in your conditional access policy to grant access to resources, access is only granted, when the access attempt was made using supported mobile apps or desktop clients. When an access attempt is made using an unsupported mobile app or desktop client, the attempt is blocked.

![Control](./media/active-directory-conditional-access-technical-reference/06.png)

The following mobile apps and desktop clients support conditional access for Office 365 and other Azure AD-connected service applications:


| Client apps| Target Service| Platform |
| --- | --- | --- |
| MFA and location policy for apps. Device based policies are not supported.| Any My Apps app service| Android and iOS|
| Azure Remote app| Azure Remote App service| Windows 10, Windows 8.1, Windows 7, iOS, Android, and Mac OS X|
| Dynamics CRM app| Dynamics CRM| Windows 10, Windows 8.1, Windows 7, iOS, and Android|
| Microsoft Teams Services - this controls all services that support Microsoft Teams and all its Client Apps - Windows Desktop, iOS, Android, WP, and web client| Microsoft Teams| Windows 10, Windows 8.1, Windows 7, iOS and Android|
| Mail/Calendar/People app, Outlook 2016, Outlook 2013 (with modern authentication), Skype for Business (with modern authentication)| Office 365 Exchange Online| Windows 10|
| Outlook 2016, Outlook 2013 (with modern authentication), Skype for Business (with modern authentication)| Office 365 Exchange Online| Windows 8.1, Windows 7|
| Outlook mobile app| Office 365 Exchange Online| iOS|
| Outlook 2016 (Office for macOS)| Office 365 Exchange Online| Mac OS X|
| Office 2016 apps, Universal Office apps, Office 2013 (with modern authentication), OneDrive sync client (see [notes](https://support.office.com/en-US/article/Azure-Active-Directory-conditional-access-with-the-OneDrive-sync-client-on-Windows-028d73d7-4b86-4ee0-8fb7-9a209434b04e)), Office Groups support is planned for the future, SharePoint app support is planned for the future| Office 365 SharePoint Online| Windows 10|
| Office 2016 apps, Office 2013 (with modern authentication), OneDrive sync client (see [notes](https://support.office.com/en-US/article/Azure-Active-Directory-conditional-access-with-the-OneDrive-sync-client-on-Windows-028d73d7-4b86-4ee0-8fb7-9a209434b04e))| Office 365 SharePoint Online| Windows 8.1, Windows 7|
| Office mobile apps| Office 365 SharePoint Online| iOS, Android|
| Office 2016 for macOS (Word, Excel, PowerPoint, OneNote only). OneDrive for Business support planned for the future| Office 365 SharePoint Online| Mac OS X|
| Office Yammer app| Office 365 Yammer| Windows 10, iOS, Android|
| PowerBI app. The Power BI app for Android does not currently support device-based conditional access.| PowerBI service| Windows 10, Windows 8.1, Windows 7, and iOS|
| Visual Studio Team Services app| Visual Studio Team Services| Windows 10, Windows 8.1, Windows 7, iOS, and Android|



## Approved client app requirement 

When you configure a conditional access policy, you can select the requirement to grant access only if a connection attempt was made by an approved client app. 

![Control](./media/active-directory-conditional-access-technical-reference/21.png)

Approved client apps for this setting are:

- Microsoft Excel

- Microsoft OneDrive

- Microsoft Outlook

- Microsoft OneNote

- Microsoft PowerPoint

- Microsoft SharePoint

- Microsoft Skype for Business

- Microsoft Teams

- Microsoft Visio

- Microsoft Word


**Remarks:**

- These apps support Microsoft Intune mobile application management (MAM).

- This requirement:

    - Only supports IOS and Android as selected [device platforms condition](#device-platforms-condition) 

    - Does not support **Browser** as selected [client app condition](#supported-browsers) 
    
    - Supersedes the **Mobile apps and desktop clients** [client app condition](#supported-mobile-apps-and-desktop-clients) if it is selected  


## Next steps

- For an overview of conditional access, see [conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)
- If you are ready to configure conditional access policies in your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md)



<!--Image references-->
[1]: ./media/active-directory-conditional-access-technical-reference/01.png


