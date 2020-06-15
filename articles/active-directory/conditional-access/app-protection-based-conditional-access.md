---
title: App protection policies with Conditional Access - Azure Active Directory
description: Learn how to require app protection policy for cloud app access with Conditional Access in Azure Active Directory.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 05/08/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: spunukol, rosssmi

ms.collection: M365-identity-device-management
---
# How to: Require app protection policy and an approved client app for cloud app access with Conditional Access

People regularly use their mobile devices for both personal and work tasks. While making sure staff can be productive, organizations also want to prevent data loss from potentially unsecure applications. With Conditional Access, organizations can restrict access to approved (modern authentication capable) client apps with Intune app protection policies applied to them.

This article presents three scenarios to configure Conditional Access policies for resources like Office 365, Exchange Online, and SharePoint Online.

- [Scenario 1: Office 365 apps require approved apps with app protection policies](#scenario-1-office-365-apps-require-approved-apps-with-app-protection-policies)
- [Scenario 2: Browser apps require approved apps with app protection policies](#scenario-2-browser-apps-require-approved-apps-with-app-protection-policies)
- [Scenario 3: Exchange Online and SharePoint Online require an approved client app and app protection policy](#scenario-3-exchange-online-and-sharepoint-online-require-an-approved-client-app-and-app-protection-policy)

In the Conditional Access, these client apps are known to be protected with an app protection policy. More information about app protection policies can be found in the article, [App protection policies overview](/intune/apps/app-protection-policy)

For a list of eligible client apps, see [App protection policy requirement](concept-conditional-access-grant.md).

> [!NOTE]
>    The or clause is used within the policy to enable users to utilize apps that support either the **Require app protection policy** or **Require approved client app** grant controls. For more information on which apps support the **Require app protection policy** grant control, see [App protection policy requirement](concept-conditional-access-grant.md).

## Scenario 1: Office 365 apps require approved apps with app protection policies

In this scenario, Contoso has decided that all mobile access to Office 365 resources must use approved client apps, like Outlook mobile and OneDrive, protected by an app protection policy prior to receiving access. All of their users already sign in with Azure AD credentials and have licenses assigned to them that include Azure AD Premium P1 or P2 and Microsoft Intune.

Organizations must complete the following steps in order to require the use of an approved client app on mobile devices.

**Step 1: Configure an Azure AD Conditional Access policy for Office 365**

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
1. Under **Access controls** > **Grant**, select the following options:
   - **Require approved client app**
   - **Require app protection policy (preview)**
   - **Require all the selected controls**
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 2: Configure an Azure AD Conditional Access policy for Exchange Online with ActiveSync (EAS)**

For the Conditional Access policy in this step, configure the following components:

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
1. Under **Access controls** > **Grant**, select **Grant access**, **Require app protection policy**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 3: Configure Intune app protection policy for iOS and Android client applications**

Review the article [How to create and assign app protection policies](/intune/apps/app-protection-policies), for steps to create app protection policies for Android and iOS. 

## Scenario 2: Browser apps require approved apps with app protection policies

In this scenario, Contoso has decided that all mobile web browsing access to Office 365 resources must use an approved client app, like Edge for iOS and Android, protected by an app protection policy prior to receiving access. All of their users already sign in with Azure AD credentials and have licenses assigned to them that include Azure AD Premium P1 or P2 and Microsoft Intune.

Organizations must complete the following steps in order to require the use of an approved client app on mobile devices.

**Step 1: Configure an Azure AD Conditional Access policy for Office 365**

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
   1. Select **Browser**.
1. Under **Access controls** > **Grant**, select the following options:
   - **Require approved client app**
   - **Require app protection policy (preview)**
   - **Require all the selected controls**
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 2: Configure Intune app protection policy for iOS and Android client applications**

Review the article [How to create and assign app protection policies](/intune/apps/app-protection-policies), for steps to create app protection policies for Android and iOS. 

## Scenario 3: Exchange Online and SharePoint Online require an approved client app and app protection policy

In this scenario, Contoso has decided that users may only access email and SharePoint data on mobile devices as long as they use an approved client app like Outlook mobile protected by an app protection policy prior to receiving access. All of their users already sign in with Azure AD credentials and have licenses assigned to them that include Azure AD Premium P1 or P2 and Microsoft Intune.

Organizations must complete the following three steps in order to require the use of an approved client app on mobile devices and Exchange ActiveSync clients.

**Step 1: Policy for Android and iOS based modern authentication clients requiring the use of an approved client app and app protection policy when accessing Exchange Online and SharePoint Online.**

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
1. Under **Access controls** > **Grant**, select the following options:
   - **Require approved client app**
   - **Require app protection policy (preview)**
   - **Require one of the selected controls**
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
1. Under **Access controls** > **Grant**, select **Grant access**, **Require app protection policy**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create and enable your policy.

**Step 3: Configure Intune app protection policy for iOS and Android client applications.**

Review the article [How to create and assign app protection policies](/intune/apps/app-protection-policies), for steps to create app protection policies for Android and iOS. 

## Next steps

[What is Conditional Access?](overview.md)

[Conditional access components](concept-conditional-access-policies.md)

[Common Conditional Access policies](concept-conditional-access-policy-common.md)

