---
title: Enable or disable LinkedIn integration using Group Policy in an Azure Active Directory tenant | Microsoft Docs
description: Explains how to turn on LinkedIn integration for Microsoft apps in Azure Active Directory.
services: active-directory
author: curtand
manager: mtillman
ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/11/2018
ms.author: curtand
ms.reviewer: beengen
ms.custom: it-pro
---

# Use Group Policy to enable or disable LinkedIn integration
This article explains how to use a Group Policy Object (GPO) to disable the features that integrate LinkedIn profile and activity data in Office applications. LinkedIn integration for enterprises is enabled by default in Azure Active Directory (Azure AD).

>[!NOTE]
> Enabling LinkedIn integration in Azure AD enables apps and services to access some of your end users' information. Read the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement/) to learn more about the privacy considerations when enabling LinkedIn integration in Azure AD.

To create a GPO that disables the LinkedIn integration, use the following steps:

1.  Download the [Office 2016 Administrative Template files (ADMX/ADML)](https://www.microsoft.com/download/details.aspx?id=49030)
2.  Extract the **ADMX** files and copy them to your **central repository**.
3.  Open Group Policy Management.
4.  Create a GPO with the following setting: User Configuration > Administrative Templates > Microsoft Office 2016 > Miscellaneous > Allow LinkedIn Integration
5.  Select **Enabled** or **Disabled**.
  * **Enabled**: The **Show LinkedIn features in Office applications** setting found in Office Options is set to the enabled state.   
  * **Disabled**: The **Show LinkedIn features in Office applications** setting found in Office Options is defaulted to the disabled state. End users cannot change this setting. All LinkedIn Features related to profiles and activity data are disabled in the product. 

## Learn more 
* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

## Next steps
You can use the following link to enable or disable LinkedIn integration with Azure AD in the Azure portal:

[Configure LinkedIn integration](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings) 