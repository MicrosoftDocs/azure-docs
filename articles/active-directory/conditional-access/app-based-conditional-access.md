---
title: Approved client apps with Conditional Access - Azure Active Directory
description: Learn how to require approved client apps for cloud app access with Conditional Access in Azure Active Directory.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 03/04/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: spunukol, rosssmi

ms.collection: M365-identity-device-management
---
# How to: Require approved client apps for cloud app access with Conditional Access

People regularly use their mobile devices for both personal and work tasks. While making sure staff can be productive, organizations also want to prevent data loss from potentially unsecure applications. With Conditional Access, organizations can restrict access to approved (modern authentication capable) client apps.

This article presents two scenarios to configure Conditional Access policies for resources like Office 365, Exchange Online, and SharePoint Online.

- [Scenario 1: Office 365 apps require an approved client app](#scenario-1-office-365-apps-require-an-approved-client-app)
- [Scenario 2: Exchange Online and SharePoint Online require an approved client app](#scenario-2-exchange-online-and-sharepoint-online-require-an-approved-client-app)

In Conditional Access, this functionality is known as requiring an approved client app. For a list of approved client apps, see [approved client app requirement](concept-conditional-access-grant.md#require-approved-client-app).

> [!NOTE]
> In order to require approved client apps for iOS and Android devices, these devices must first register in Azure AD.

## Scenario 1: Office 365 apps require an approved client app

In this scenario, Contoso has decided that users using mobile devices can access all Office 365 services as long as they use approved client apps, like Outlook mobile, OneDrive, and Microsoft Teams. All of their users already sign in with Azure AD credentials and have licenses assigned to them that include Azure AD Premium P1 or P2 and Microsoft Intune.

Organizations must complete the following three steps in order to require the use of an approved client app on mobile devices.

**Step 1: Policy for Android and iOS based modern authentication clients requiring the use of an approved client application when accessing Exchange Online.**

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users** or the specific **Users and groups** you wish to apply this policy to. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **Office 365 (preview)**.
1. Under **Conditions**, select **Device platforms**.
   1. Set **Configure** to **Yes**.
   1. Include **Android** and **iOS**.
1. Under **Conditions**, select **Client apps (preview)**.
   1. Set **Configure** to **Yes**.
   1. Select **Mobile apps and desktop clients** and **Modern authentication clients**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require approved client app**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 2: Configure an Azure AD Conditional Access policy for Exchange Online with ActiveSync (EAS)**

1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users** or the specific **Users and groups** you wish to apply this policy to. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **Office 365 Exchange Online**.
1. Under **Conditions**:
   1. **Client apps (preview)**:
      1. Set **Configure** to **Yes**.
      1. Select **Mobile apps and desktop clients** and **Exchange ActiveSync clients**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require approved client app**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 3: Configure Intune app protection policy for iOS and Android client applications.**

Review the article [How to create and assign app protection policies](/intune/apps/app-protection-policies), for steps to create app protection policies for Android and iOS. 

## Scenario 2: Exchange Online and SharePoint Online require an approved client app

In this scenario, Contoso has decided that users may only access email and SharePoint data on mobile devices as long as they use an approved client app like Outlook mobile. All of their users already sign in with Azure AD credentials and have licenses assigned to them that include Azure AD Premium P1 or P2 and Microsoft Intune.

Organizations must complete the following three steps in order to require the use of an approved client app on mobile devices and Exchange ActiveSync clients.

**Step 1: Policy for Android and iOS based modern authentication clients requiring the use of an approved client application when accessing Exchange Online and SharePoint Online.**

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users** or the specific **Users and groups** you wish to apply this policy to. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **Office 365 Exchange Online** and **Office 365 SharePoint Online**.
1. Under **Conditions**, select **Device platforms**.
   1. Set **Configure** to **Yes**.
   1. Include **Android** and **iOS**.
1. Under **Conditions**, select **Client apps (preview)**.
   1. Set **Configure** to **Yes**.
   1. Select **Mobile apps and desktop clients** and **Modern authentication clients**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require approved client app**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 2: Policy for Exchange ActiveSync clients requiring the use of an approved client app.**

1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users** or the specific **Users and groups** you wish to apply this policy to. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **Office 365 Exchange Online**.
1. Under **Conditions**:
   1. **Client apps (preview)**:
      1. Set **Configure** to **Yes**.
      1. Select **Mobile apps and desktop clients** and **Exchange ActiveSync clients**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require approved client app**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 3: Configure Intune app protection policy for iOS and Android client applications.**

Review the article [How to create and assign app protection policies](/intune/apps/app-protection-policies), for steps to create app protection policies for Android and iOS. 

## Next steps

[What is Conditional Access?](overview.md)

[Conditional access components](concept-conditional-access-policies.md)

[Common Conditional Access policies](concept-conditional-access-policy-common.md)
