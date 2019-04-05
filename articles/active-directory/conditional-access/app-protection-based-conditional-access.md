---
title: How to require app protection policy for cloud app access with conditional access in Azure Active Directory | Microsoft Docs
description: Learn how to require app protection policy for cloud app access with conditional access in Azure Active Directory.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.subservice: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 4/4/2019
ms.author: joflore
ms.reviewer: spunukol
#Customer intent: As an IT admin, I want to know how to require an app protection policy for the access to certain resources to ensure that they are accessed only from applications that meet my standards for security and compliance

ms.collection: M365-identity-device-management
---
# How To: Require app protection policy for cloud app access with conditional access (Preview)

Your employees use mobile devices for both personal and work tasks. While making sure your employees can be productive, you also want to prevent data loss. With Azure Active Directory (Azure AD) conditional access, you can protect your corporate data by restricting access to your cloud apps to client apps that have an app protection policy first.

This topic explains how to configure conditional access policies that can require app protection policy before access to data.

## Overview

With [Azure AD conditional access](overview.md), you can fine-tune how authorized users can access your resources. For example, you can limit the access to your cloud apps to trusted devices.

You can use [Intune app protection policies](https://docs.microsoft.com/intune/app-protection-policy) to help protect your company’s data. Intune app protection policies don't require mobile-device management (MDM) solution, which enables you to protect your company’s data with or without enrolling devices in a device management solution.

Azure Active Directory conditional access restricts access to your cloud apps to client applications that Intune has reported to Azure AD as receiving an app protection policy. For example, you can restrict access to Exchange Online to the Outlook app that has an Intune app protection policy.

In the conditional access terminology, these client apps are known to be policy protected with an **app protection policy**.  

![Conditional access](./media/app-protection-based-conditional-access/05.png)

For a list of policy protected client apps, see [app protection policy requirement](technical-reference.md#approved-client-app-requirement).

You can combine app-protection-based conditional access policies with other policies such as [device-based conditional access policies](require-managed-devices.md) to provide flexibility in how to protect data for both personal and corporate devices.

## Benefits of app protection-based conditional access requirement

Similar to compliance being reported by Intune for iOS and Android for managed device, Intune now reports to Azure AD if app protection policy is applied so that conditional access can use this as an access check. This new conditional access policy **App protection policy** increases security by protects admin errors such as:

- users that do not have an Intune license
- users that cannot receive an Intune app protection policy
- Intune app protection policy apps that have not been configured to receive a policy


## Before you begin

This topic assumes that you are familiar with:

- The [app protection policy requirement](technical-reference.md#app-protection-policy-requirement) technical reference.

- The [approved client app requirement](technical-reference.md#approved-client-app-requirement) technical reference.

- The basic concepts of [conditional access in Azure Active Directory](overview.md).

- How to [configure a conditional access policy](app-based-mfa.md).


## Prerequisites

To create an app protection-based conditional access policy, you must
- Have an Enterprise Mobility + Security or an Azure Active Directory premium subscription + Intune
- Ensure the users are licensed for EMS or Azure AD + Intune
- Ensure the client app has been configured in Intune to receive an app protection policy
- Ensure the users are configured in Intune to receive an Intune app protection policy

## App protection-based policy for Exchange Online

This scenario consists of an app protection-based conditional access policy for access to Exchange Online.

### Scenario playbook

This scenario assumes that a user:

- Configures email using a native mail application on iOS or Android to connect to Exchange

- Receives an email that indicates that access is only available using Outlook app

- Downloads the application with the link

- Opens the Outlook application and signs in with the Azure AD credentials

- Is prompted to install either Authenticator (iOS) or Company Portal (Android) to continue

- Installs the application and can return to the Outlook app to continue

- Is prompted to register a device

- Is able to receive an Intune app protection policy

- Is able to access email

Any Intune app protection policies must be on the application to access to corporate data and may prompt the user to restart the application, use an additional PIN etc. (if configured for the application and platform).

### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/01.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**.

    ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**:

    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-protection-based-conditional-access/03.png)

    b. As **Client apps (preview)**, select **Mobile apps and desktop apps** and **Modern authentication clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/91.png)

5. As **Access controls**, you need to have **Require app protection policy (preview)** selected.

    ![Conditional access](./media/app-protection-based-conditional-access/05.png)
 

**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/06.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.


3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**.

    ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps (preview)**. 

    a. As **Client apps (preview)**, select **Mobile apps and desktop clients** and **Exchange ActiveSync clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/92.png)

    b. As **Access controls**, you need to have **Require app protection policy (preview)** selected.

    ![Conditional access](./media/app-protection-based-conditional-access/05.png)


**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-protection-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.



## App protection-based or compliant device policy for Exchange Online

This scenario consists of an app protection-based or compliant device conditional access policy for access to Exchange Online.


### Scenario playbook

This scenario assumes that:
 
- Some user is already enrolled (with or without corporate devices)

- Users who are not enrolled and registered with Azure AD using an app protected application need to register a device to access resources

- Enrolled users using the app protected application don't have to re-register the device

- User can receive an Intune app protection policy if not enrolled

- User can access email with Outlook and an Intune app protection policy if not enrolled

- User can access email with Outlook if the device is enrolled


### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/62.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

     ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**. 
 
    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-protection-based-conditional-access/03.png)

    b. As **Client apps (preview)**, select **Mobile apps and desktop clients** and **Modern authentication clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/91.png)

5. As **Access controls**, you need to have the following selected:

   - **Require device to be marked as compliant**

   - **Require app protection policy (preview)**

   - **Require one of the selected controls**   
 
     ![Conditional access](./media/app-protection-based-conditional-access/11.png)



**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/06.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

    ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps**. 

    As **Client apps (preview)**, select **Mobile apps and desktop clients** and **Exchange ActiveSync clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/92.png)

5. As **Access controls**, you need to have the following selected:

   - **Require device to be marked as compliant**

   - **Require app protection policy (preview)**

   - **Require one of the selected controls**   
    ![Conditional access](./media/app-protection-based-conditional-access/11.png)



**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-protection-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.





## App protection-based and compliant device policy for Exchange Online

This scenario consists of an app-protection-based and compliant device conditional access policy for access to Exchange Online.


### Scenario playbook

This scenario assumes that a user:
 
-	Configures email using a native mail application on iOS or Android to connect to Exchange
-	Receives an email that indicates that access requires your device to be enrolled
-	Downloads the company portal and signs in to company portal
-	Checks mail and is asked to use the Outlook app
-	Downloads the Outlook app
-	Opens the Outlook app and enters the credentials used in the enrollment
-   Is able to receive to receive an Intune app protection policy
-	Is able to access email with Outlook and an Intune app protection policy

Any Intune app protection policies are activated before access to the corporate data and may prompt the user to restart the application, use an additional PIN etc. (if configured for the application and platform)


### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/01.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

     ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**. 
 
    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-protection-based-conditional-access/03.png)

    b. As **Client apps (preview)**, select **Mobile apps and desktop apps** and **Modern authentication clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/91.png)

5. As **Access controls**, you need to have the following selected:

   - **Require device to be marked as compliant**

   - **Require app protection policy (preview)**

   - **Require all the selected controls**   
 
     ![Conditional access](./media/app-protection-based-conditional-access/13.png)



**Step 2 - Configure an Azure AD conditional access policy for Exchange Online with Active Sync (EAS)**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/06.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

    ![Conditional access](./media/app-protection-based-conditional-access/07.png)

4. **Conditions:** As **Conditions**, you need to configure **Client apps (preview)**. 

    As **Client apps (preview)**, select **Mobile apps and desktop clients** and **Exchange ActiveSync clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/92.png)

5. As **Access controls**, you need to have the following selected:

   - **Require device to be marked as compliant**

   - **Require approved client app (preview)**

   - **Require all the selected controls**   
 
     ![Conditional access](./media/app-protection-based-conditional-access/13.png)




**Step 3 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-protection-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.


## App protection-based or app-based policy for Exchange Online and SharePoint Online

This scenario consists of an app protection-based or approved apps policy for access to Exchange Online and SharePoint Online.


### Scenario playbook

This scenario assumes that a user:

- Configures either client applications that are either on the list of apps that support the app protection policy requirement or the approved apps requirement.  
- User uses client applications that meet the app protection policy requirement can receive an Intune app protection policy
- User uses client applications that meet the approved apps policy requirement that supports Intune app protection policy
- Opens the application to access email or documents
- Opens the Outlook application and signs in with the Azure AD credentials
- Is prompted to install either Authenticator (iOS) or Company Portal (Android) to continue (if not installed)
- Installs the application and can return to the Outlook app to continue
- Is prompted to register a device
- Is able to receive an Intune app protection policy
- Is able to access email with Outlook and an Intune app protection policy
- Is able to access sites/documents with an app not on the app protection policy requirement but listed in the approved app requirement.

Any Intune app protection policies are required before access to the corporate data and may prompt the user to restart the application, use an additional PIN etc. (if configured for the application and platform)

**Remarks**

- You can use this scenario if you want to support both app protection-based and app-based conditional access policies.

- In this *OR* policy, apps with **app protection policy** requirement are evaluated for access first before **approved client apps** requirement.

### Configuration

**Step 1 - Configure an Azure AD conditional access policy for Exchange Online**

For the conditional access policy in this step, you need to configure the following components:

![Conditional access](./media/app-protection-based-conditional-access/62.png)

1. The **Name** of your conditional access policy.

2. **Users and groups**: Each conditional access policy must have at least one user or group selected.

3. **Cloud apps:** As cloud apps, you need to select **Office 365 Exchange Online**. 

     ![Conditional access](./media/app-protection-based-conditional-access/02.png)

4. **Conditions:** As **Conditions**, you need to configure **Device platforms** and **Client apps**. 
 
    a. As **Device platforms**, select **Android** and **iOS**.

    ![Conditional access](./media/app-protection-based-conditional-access/03.png)

    b. As **Client apps (preview)**, select **Mobile apps and desktop apps** and **Modern authentication clients**.

    ![Conditional access](./media/app-protection-based-conditional-access/91.png)

5. As **Access controls**, you need to have the following selected:

   - **Require approved client app**

   - **Require app protection policy (preview)**

   - **Require one of the selected controls**   
 
     ![Conditional access](./media/app-protection-based-conditional-access/12.png)


**Step 2 - Configure Intune app protection policy for iOS and Android client applications**


![Conditional access](./media/app-protection-based-conditional-access/09.png)

See [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune-classic/deploy-use/protect-apps-and-data-with-microsoft-intune) for more information.




## Next steps

If you want to know how to configure a conditional access policy, see [Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).

If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](best-practices.md). 