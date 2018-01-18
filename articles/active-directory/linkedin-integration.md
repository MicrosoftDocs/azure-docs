---
title: LinkedIn integration for Office applications in Azure Active Directory | Microsoft Docs
description: Explains how to enable or disable LinkedIn integration for Microsoft apps in Azure Active Directory
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 01/17/2018
ms.author: curtand
ms.reviewer: beengen
ms.custom: it-pro
---

# Enabling LinkedIn integration for Office applications 
This article tells you how to enable LinkedIn integration for your users in Azure Active Directory (Azure AD). Enable LinkedIn integration to provide users with access public LinkedIn data within Microsoft apps. They can also choose to share their personal LinkedIn network information. Each user can independently choose to connect their work account to their LinkedIn account.

> [!IMPORTANT]
> Azure AD service updates like LinkedIn integration capabilities are not deployed to all Azure AD tenants at the same time. You can enable LinkedIn integration only after it is rolled out to your Azure tenant. This feature is not available for go-local, sovereign, and government tenants. 

## LinkedIn integration from the end user perspective
When end users in your organization connect their LinkedIn accounts to their work accounts, their LinkedIn connections and profile data can be used in your organization's Microsoft apps. They can opt out by removing permission for LinkedIn to share that data. The integration also uses publicly available profile information, and users can choose whether to share their public profile and network information with Microsoft applications through LinkedIn privacy settings.

### Privacy considerations
Enabling LinkedIn integration in Azure AD enables apps and services to access some of your end users' information. Read the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement/) to learn more about the privacy considerations when enabling LinkedIn integration in Azure AD. 

## Enable LinkedIn integration
LinkedIn integration for enterprises is enabled by default in Azure AD. All users in your organization can see LinkedIn features and profiles. Enabling LinkedIn integration allows users in your organization to use LinkedIn features within Microsoft services, such as viewing profiles when receiving an email in Outlook. Disabling this feature prevents access to LinkedIn features and stops user account connections and data sharing between LinkedIn and your organization via Microsoft services.

### Enable or disable LinkedIn integration in the Azure portal

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com/) with an account that's a global admin for the Azure AD tenant.
2. Select **Users and groups**.
3. On the **Users and groups** blade, select **User settings**.
4. Under **LinkedIn Integration**, select Yes or No to enable or disable LinkedIn integration.
   ![Enabling LinkedIn integration](./media/linkedin-integration/LinkedIn-integration.PNG)

### Enable or disable LinkedIn integration using Group Policy

1. Download the [Office 2016 Administrative Template files (ADMX/ADML)](https://www.microsoft.com/download/details.aspx?id=49030)
2. Extract the **ADMX** files and copy them to your **central repository**.
3. Open Group Policy Management.
4. Create a Group Policy Object with the following setting: **User Configuration** > **Administrative Templates** > **Microsoft Office 2016** > **Miscellaneous** > **Allow LinkedIn Integration**.
5. Select **Enabled** or **Disabled**.
  * When the policy is **Enabled**, the **Show LinkedIn features in Office applications** setting found in the Office Options dialog is enabled. This also means that users in your organization can use LinkedIn features in their Office applications.
  * When the policy is **Disabled**, the **Show LinkedIn features in Office applications** setting found in the Office Options dialog is set to the disabled state, and end users can't change this setting. Users in your organization can't use LinkedIn features in their Office applications. 

The Group Policy Object with the setting affects only Office 2016 apps. The end user can turn off LinkedIn, but they can turn it off only for the local computer. Users can see LinkedIn features in profile cards throughout Office 365 even if they disable LinkedIn in an Office 2016 app. 

### Learn more 
* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

## Next steps
Use the following link to see your current LinkedIn integration setting in the Azure portal:

[Configure LinkedIn integration](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings) 