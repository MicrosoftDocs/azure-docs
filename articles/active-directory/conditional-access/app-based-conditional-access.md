---
title: Azure Active Directory app-based conditional access | Microsoft Docs
description: Learn how Azure Active Directory app-based conditional access works.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.component: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/13/2018
ms.author: markvi
ms.reviewer: spunukol

---
# Azure Active Directory app-based conditional access  

Your employees use mobile devices for both personal and work tasks. While making sure your employees can be productive, you also want to prevent data loss. With Azure Active Directory (Azure AD) app-based conditional access, you can restrict access to your cloud apps to client apps that can protect your corporate data.  

This topic explains how to configure Azure AD app-based conditional access.

## Overview

With [Azure AD conditional access](overview.md), you can fine-tune how authorized users can access your resources. For example, you can limit the access to your cloud apps to trusted devices.

You can use [Intune app protection policies](https://docs.microsoft.com/intune/app-protection-policy) to help protect your company’s data. Intune app protection policies don't require mobile-device management (MDM) solution, which enables you to protect your company’s data with or without enrolling devices in a device management solution.

Azure Active Directory app-based conditional access enables you limit access to your cloud apps to client apps that support Intune app protection policies. For example, you can restrict access to Exchange Online to the Outlook app.

In the conditional access terminology, these client apps are known as **approved client apps**.  


![Conditional access](./media/app-based-conditional-access/05.png)


For a list of approved client apps, see [approved client app requirement](technical-reference.md#approved-client-app-requirement).


You can combine app-based conditional access policies with other policies such as [device-based conditional access policies](require-managed-devices.md) to provide flexibility in how to protect data for both personal and corporate devices.

 


## Before you begin

This topic assumes that you are familiar with:

- The [approved client app requirement](technical-reference.md#approved-client-app-requirement) technical reference.


- The basic concepts of [conditional access in Azure Active Directory](overview.md).

- How to [configure a conditional access policy](app-based-mfa.md).

- The [migration of conditional access policies](best-practices.md#policy-migration).
 

## Prerequisites

To create an app-based conditional access policy, you must have an Enterprise Mobility + Security or an Azure Active Directory premium subscription, and the users must be licensed for EMS or Azure AD. 


## Exchange Online policy 

This scenario consists of an app-based conditional access policy for access to Exchange Online.


### Scenario playbook

This scenario assumes that a user:

- Configures email using a native mail application on iOS or Android to connect to Exchange

- Receives an email that indicates that access is only available using Outlook app

- Downloads the application with the link

- Opens the Outlook application and signs in with the Azure AD credentials

- Is prompted to install either Authenticator (iOS) or Company Portal (Android) to continue

- Installs the application and can return to the Outlook app to continue

- Is prompted to register a device

- Is able to access email

Any Intune app protection policies are activated at the time the access corporate data and may prompt the user to restart the application, use an additional PIN etc (if configured for the application and platform).

### Configuration 

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/01.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**.

    ![Conditional access](./media/app-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**:

    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-based-conditional-access/03.png)

    b. As **Client apps**, select **Mobile apps and desktop apps**.

    ![Conditional access](./media/app-based-conditional-access/04.png)

5. As **Access controls**, you need to have **Require approved client app (preview)** selected.

    ![Conditional access](./media/app-based-conditional-access/05.png)
 

**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/06.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.


3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**.

    ![Conditional access](./media/app-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps**. 

    a. As **Client apps**, select **Exchange Active Sync**.

    ![Conditional access](./media/app-based-conditional-access/08.png)

    b. As **Access controls**, you need to have **Require approved client app (preview)** selected.

    ![Conditional access](./media/app-based-conditional-access/05.png)


**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.


## Exchange Online and SharePoint Online policy

This scenario consists of a conditional access with mobile app management policy for access to Exchange Online and SharePoint Online with approved apps.

### Scenario playbook

This scenario assumes that a user:

- Tries to use the SharePoint app to connect and also to view their corporate sites

- Attempt to sign-in with the same credentials as the Outlook app credentials

- Does not have to re-register and can get access to the resources


### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online and SharePoint Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/71.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.


3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online** and **Office 365 SharePoint Online**. 

    ![Conditional access](./media/app-based-conditional-access/02.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**:

    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-based-conditional-access/03.png)

    b. As **Client apps**, select **Mobile apps and desktop apps**.

    ![Conditional access](./media/app-based-conditional-access/04.png)

5. As **Access controls**, you need to have **Require approved client app (preview)** selected.

    ![Conditional access](./media/app-based-conditional-access/05.png)




**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/06.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. Online 

    ![Conditional access](./media/app-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps**:

    a. As **Client apps**, select **Exchange Active Sync**.

    ![Conditional access](./media/app-based-conditional-access/08.png)

    b. As **Access controls**, you need to have **Require approved client app (preview)** selected.

    ![Conditional access](./media/app-based-conditional-access/05.png)




**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.


## App-based or compliant device policy for Exchange Online and SharePoint Online

This scenario consists of an app-based or compliant device conditional access policy for access to Exchange Online.


### Scenario playbook

This scenario assumes that:
 
- Some user are already enrolled (with or without corporate devices)

- Users who are not enrolled and registered with Azure AD using an app protected application need to register a device to access resources

- Enrolled users using the app protected application don't have to re-register the device


### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online and SharePoint Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/62.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online** and **Office 365 SharePoint Online**. 

     ![Conditional access](./media/app-based-conditional-access/02.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**. 
 
    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-based-conditional-access/03.png)

    b. As **Client apps**, select **Mobile apps and desktop apps**.

    ![Conditional access](./media/app-based-conditional-access/04.png)

5. As **Access controls**, you need to have the following selected:

    - **Require device to be marked as compliant**

    - **Require approved client app (preview)**

    - **Require one of the selected controls**   
 
    ![Conditional access](./media/app-based-conditional-access/11.png)



**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/61.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

    ![Conditional access](./media/app-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps**. 

    As **Client apps*, select **Exchange Active Sync**.

    ![Conditional access](./media/app-based-conditional-access/08.png)

5. As **Access controls**, you need to have **Require approved client app (preview)** selected.
 
    ![Conditional access](./media/app-based-conditional-access/11.png)




**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.





## App-based and compliant device policy for Exchange Online and SharePoint Online

This scenario consists of an app-based and compliant device conditional access policy for access to Exchange Online.


### Scenario playbook

This scenario assumes that a user:
 
-	Configures email using a native mail application on iOS or Android to connect to Exchange
-	Receives an email that indicates that access requires your device to be enrolled
-	Downloads the company portal and signs in to company portal
-	Checks mail and is asked to use the Outlook app
-	Downloads the Outlook app
-	Opens the Outlook app and enters the credentials used in the enrollment
-	User is able to access email

Any Intune app protection policies are activated at the time of access to the corporate data and may prompt the user to restart the application, use an additional PIN etc. (if configured for the application and platform)


### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online and SharePoint Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/62.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online** and **Office 365 SharePoint Online**. 

     ![Conditional access](./media/app-based-conditional-access/02.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**. 
 
    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-based-conditional-access/03.png)

    b. As **Client apps**, select **Mobile apps and desktop apps**.

    ![Conditional access](./media/app-based-conditional-access/04.png)

5. As **Access controls**, you need to have the following selected:

    - **Require device to be marked as compliant**

    - **Require approved client app (preview)**

    - **Require all the selected controls**   
 
    ![Conditional access](./media/app-based-conditional-access/13.png)



**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-based-conditional-access/61.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

    ![Conditional access](./media/app-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps**. 

    As **Client apps**, select **Exchange Active Sync**.

    ![Conditional access](./media/app-based-conditional-access/08.png)

5. As **Access controls**, you need to have the following selected:

    - **Require device to be marked as compliant**

    - **Require approved client app (preview)**

    - **Require all the selected controls**   
 
    ![Conditional access](./media/app-based-conditional-access/64.png)




**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.






## Next steps

If you want to know how to configure a conditional access policy, see [Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).

If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](best-practices.md). 
