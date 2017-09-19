---

title: Configure LinkedIn integration in Azure AD | Microsoft Docs
description: Explains how to enable or disable LinkedIn integration for Microsoft apps in Azure Active Directory.
services: active-directory
author: jeffgilb
manager: femila
ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: jeffgilb
ms.reviewer: jsnow
ms.custom: it-pro

---
# Enabling LinkedIn integration in Azure Active Directory
Enabling LinkedIn integration lets your users access both public LinkedIn data and, if they choose to, their personal LinkedIn network from within Microsoft apps. Each user can independently choose to connect their work account to their LinkedIn account.

### LinkedIn integration from your end users’ perspective
When end users in your organization connect their LinkedIn accounts to their work accounts, they are able to better identify the people they work with inside and outside the organization. Connecting the two accounts shares the user’s LinkedIn connections and profile with your organization, and they can always opt out by removing permission for LinkedIn to share that data. The integration also uses publicly available profile information, and users can choose whether to share their public profile and network information with Microsoft applications through LinkedIn privacy settings.

>[!NOTE]
> Enabling LinkedIn integration in Azure AD enables apps and services to access some of your end users' information. Read the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement/) to learn more about the privacy considerations when enabling LinkedIn integration in Azure AD. 

## Enable LinkedIn integration
LinkedIn integration for enterprises is enabled by default in Azure AD. So, when this feature is made available for your tenant, all users in your organization can see LinkedIn features and profiles. Enabling LinkedIn integration allows users in your organization to use LinkedIn features within Microsoft services, such as viewing profiles when receiving an email in Outlook. Disabling this feature stops data sharing between LinkedIn and your organization via Microsoft services. 

> [!IMPORTANT]
> This feature is not available for go-local, sovereign, and government tenants. In addition, Azure AD service updates, such as LinkedIn integration capabilities, are not deployed to all Azure tenants at the same time. You cannot enable LinkedIn integration with Azure AD until this capability has been rolled out to your Azure tenant.

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com/) with an account that's a global admin for the directory.
2. Select **Users and groups**.
3. On the **Users and groups** blade, select **User settings**.
4. Under **LinkedIn Integration**, select Yes or No to enable or disable LinkedIn integration.
   ![Enabling LinkedIn integration](./media/linkedin-integration/LinkedIn-integration.PNG)

### Learn more 
* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

## Next steps
You can use the following link to enable or disable LinkedIn integration with Azure AD from the Azure portal:

[Configure LinkedIn integration](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings) 