---
title: Enable or disable LinkedIn integration for Office applications in Azure Active Directory | Microsoft Docs
description: Explains how to enable or disable LinkedIn integration for Microsoft apps in Azure Active Directory
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 02/28/2018
ms.author: curtand
ms.reviewer: beengen
ms.custom: it-pro
---

# LinkedIn integration for Office applications
This article tells you how to restrict the users to whom LinkedIn integration is provided in Azure Active Directory (Azure AD). LinkedIn integration is enabled by default when it is added to your tenant, which allows users to access public LinkedIn data within some of their Microsoft apps. Each user can independently choose to connect their work or school account to their LinkedIn account.

> [!IMPORTANT]
> LinkedIn integration is not being deployed to all Azure AD tenants at the same time. After it is rolled out to your Azure tenant, LinkedIn integration is enabled by default. LinkedIn integration is not available for go-local, sovereign, and government tenants. For an up-to-date view of rollout information, see the [Office 365 Roadmap](https://products.office.com/business/office-365-roadmap?filters=%26freeformsearch=linkedin#abc) page.

## LinkedIn integration from the user perspective
When users in your organization connect their LinkedIn account to their work or school account, [they allow LinkedIn to provide data](https://www.linkedin.com/help/linkedin/answer/84077) to be used in Microsoft apps and services that your organization provides. [Users can disconnect accounts](https://www.linkedin.com/help/linkedin/answer/85097), which removes permission for LinkedIn to share data with Microsoft. LinkedIn integration uses publicly available LinkedIn profile information. [Users can control how their own LinkedIn profile is viewed](https://www.linkedin.com/help/linkedin/answer/83) using LinkedIn privacy settings, including whether their profile can be viewed in Microsoft apps.

## Privacy considerations
Enabling LinkedIn integration in Azure AD enables Microsoft apps and services to access some of your users' LinkedIn information. Read the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement/) to learn more about the privacy considerations when enabling LinkedIn integration in Azure AD. 

## Manage LinkedIn integration
LinkedIn integration for enterprises is enabled by default in Azure AD. Enabling LinkedIn integration allows all users in your organization to use LinkedIn features within Microsoft services, such as viewing LinkedIn profiles in Outlook. Disabling LinkedIn integration  removes LinkedIn features from Microsoft apps and services and stops data sharing between LinkedIn and your organization via Microsoft services.

### Enable or disable LinkedIn integration for your organization in the Azure portal

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com/) with an account that's a global admin for the Azure AD tenant.
2. Select **Users**.
3. On the **Users** blade, select **User settings**.
4. Under **LinkedIn Integration**, select **Yes** or **No** to enable or disable LinkedIn integration.
   ![Enabling LinkedIn integration](./media/linkedin-integration/LinkedIn-integration.PNG)

### Enable or disable LinkedIn integration for your organization's Office 2016 apps using Group Policy

1. Download the [Office 2016 Administrative Template files (ADMX/ADML)](https://www.microsoft.com/download/details.aspx?id=49030)
2. Extract the **ADMX** files and copy them to your **central repository**.
3. Open Group Policy Management.
4. Create a Group Policy Object with the following setting: **User Configuration** > **Administrative Templates** > **Microsoft Office 2016** > **Miscellaneous** > **Allow LinkedIn Integration**.
5. Select **Enabled** or **Disabled**.
  * When the policy is **Enabled**, the **Show LinkedIn features in Office applications** setting found in the Office 2016 Options dialog is enabled. This also means that users in your organization can use LinkedIn features in their Office applications.
  * When the policy is **Disabled**, the **Show LinkedIn features in Office applications** setting found in the Office 2016 Options dialog is set to the disabled state, and end users can't change this setting. Users in your organization can't use LinkedIn features in their Office 2016 applications. 

This group policy affects only Office 2016 apps for a local computer. Users can see LinkedIn features in profile cards throughout Office 365 even if they disable LinkedIn in their Office 2016 apps. 

### Learn more 
* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

## Next steps
Use the following link to see your current LinkedIn integration setting in the Azure portal:

[Configure LinkedIn integration](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings) 