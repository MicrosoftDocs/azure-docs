---
title: Enable LinkedIn connections integration in Azure Active Directory | Microsoft Docs
description: Explains how to enable or disable LinkedIn account connections for Microsoft apps in Azure Active Directory
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 08/28/2018
ms.author: curtand
ms.reviewer: beengen
ms.custom: it-pro
---

# LinkedIn account connections
In this article, you can learn how to enable or disable LinkedIn account connections for your tenant in the Azure Active Directory (Azure AD) admin center.

> [!IMPORTANT]
> LinkedIn account connections functionality is currently being rolled out to Azure AD tenants. It is not available for United States government customers or for organizations with Exchange Online mailboxes hosted in Australia, China, Germany, and South Africa. Support for these mailbox locations is coming soon. For an up-to-date view of rollout information,see the [Office 365 Roadmap](https://products.office.com/business/office-365-roadmap?filters=%26freeformsearch=linkedin#abc) page.
>
> The integration works only if you have it enabled *and* if you allow users to consent to apps accessing company data on their behalf. For information about the consent setting, see [How to remove a user’s access to an application](https://docs.microsoft.com/azure/active-directory/application-access-assignment-how-to-remove-assignment).

### Enable or disable LinkedIn account connection for your tenant in the Azure portal

You can enable or disable LinkedIn account connections for your entire tenant or for only selected users in your tenant.

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com/) with an account that's a global admin for the Azure AD tenant.
2. Select **Users**.
3. On the **Users** blade, select **User settings**.
4. Under **LinkedIn account connections**:
  * Select **Yes** to enable LinkedIn account connections for all users in your tenant
  * Select **Selected** to enable LinkedIn account connections for only selected tenant users
  * Select **No** to disable LinkedIn account connections for all users
  ![Enabling LinkedIn account connections](./media/linkedin-integration/linkedin-integration.png)
5. Save your settings when you're done by selecting **Save**.

### Enable or disable LinkedIn account connections for your organization's Office 2016 apps using Group Policy

1. Download the [Office 2016 Administrative Template files (ADMX/ADML)](https://www.microsoft.com/download/details.aspx?id=49030)
2. Extract the **ADMX** files and copy them to your central store.
3. Open Group Policy Management.
4. Create a Group Policy Object with the following setting: **User Configuration** > **Administrative Templates** > **Microsoft Office 2016** > **Miscellaneous** > **Show LinkedIn features in Office applications**.
5. Select **Enabled** or **Disabled**.
  * When the policy is **Enabled**, the **Show LinkedIn features in Office applications** setting found in the Office 2016 Options dialog is enabled. This also means that users in your organization can use LinkedIn features in their Office applications.
  * When the policy is **Disabled**, the **Show LinkedIn features in Office applications** setting found in the Office 2016 Options dialog is set to the disabled state, and end users can't change this setting. Users in your organization can't use LinkedIn features in their Office 2016 applications.

This group policy affects only Office 2016 apps for a local computer. Users can see LinkedIn features in profile cards throughout Office 365 even if they disable LinkedIn in their Office 2016 apps.

### Learn more

* [Integrate LinkedIn in your organization](integrate-linkedin-in-your-organization.md)

* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

## Next steps
Use the following link to see your current LinkedIn account connections setting in the Azure portal:

[Configure LinkedIn account connections](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings) 