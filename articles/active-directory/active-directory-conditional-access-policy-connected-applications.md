---
title: Set device-based conditional access policy for Azure Active Directory-connected applications | Microsoft Docs
description: Set device-based conditional access policies for Azure AD-connected applications.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: a27862a6-d513-43ba-97c1-1c0d400bf243
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/16/2017
ms.author: markvi

---
# Set device-based conditional access policy for Azure Active Directory-connected applications
Azure Active Directory (Azure AD) device-based conditional access can help you protect organization resources from:

* Access attempts from unknown or unmanaged devices.
* Devices that don’t meet the security policies of your organization.

For an overview of conditional access, see [Azure Active Directory conditional access](active-directory-conditional-access.md).

You can set device-based conditional access policies to protect these applications:

* Office 365 SharePoint Online, to protect your organization's sites and documents
* Office 365 Exchange Online, to protect your organization's email
* Software as a service (SaaS) applications that are connected to Azure AD for authentication
* On-premises applications that are published by using Azure AD Application Proxy services

To set a device-based conditional access policy, in the Azure portal, go to the specific application in the directory.

  ![List of applications in the Azure portal directory](./media/active-directory-conditional-access-policy-connected-applications/01.png "Applications")

Select the application, and then click the **Configure** tab to set the conditional access policy.  

  ![Configure the application](./media/active-directory-conditional-access-policy-connected-applications/02.png "Device based access rules")

To set a device-based conditional access policy, in the **Device based access rules** section, in **Enable Access Rules**, select **On**.

A device-based conditional access policy has three components:

* **Apply To**. The scope of users the policy applies to.
* **Device Rules**. The conditions a device must meet before it can access the application.
* **Application Enforcement**. The client applications (native versus browser) the policy applies to.
  
  ![The three components of a device-based access policy](./media/active-directory-conditional-access-policy-connected-applications/03.png "Device based access rules")

## Select the users the policy applies to
In the **Apply To** section, you can select the scope of users this policy applies to.

You have two options when you create an access policy scope for users:

* **All Users**. Apply the policy to all users who access the application.
* **Groups**. Limit the policy to users who are a member of a specific group.

![Apply policy to all users or to a group](./media/active-directory-conditional-access-policy-connected-applications/11.png "Apply to")

 To exclude a user from a policy, select the **Except** check box. This is helpful when you need to give permissions to a specific user to temporarily access the application. Select this option, for example, if some of your users have devices that are not ready for conditional access. The devices might not be registered yet, or they are about to be out of compliance.

## Select the conditions that devices must meet
Use **Device Rules** to set the conditions a device must meet to access the application.

You can set device-based conditional access for these device types:

* Windows 10 Anniversary Update, Windows 8.1, and Windows 7
* Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, and Windows Server 2008 R2
* iOS devices (iPad, iPhone)
* Android devices

Support for Mac is coming soon.

  ![Apply policy to devices](./media/active-directory-conditional-access-policy-connected-applications/04.png "Applications")

> [!NOTE]
> For information about the differences between domain-joined and Azure AD-joined devices, see [Using Windows 10 devices in your workplace](active-directory-azureadjoin-windows10-devices.md).
> 
> 

You have two options for device rules:

* **All devices must be compliant**. All device platforms that access the application must be compliant. Devices that run on platforms that don't support device-based conditional access are denied access.
* **Only selected devices must be compliant**. Only specific device platforms must be compliant. Other platforms, or other platforms that can access the application, have access.
  
  ![Set the scope for device rules](./media/active-directory-conditional-access-policy-connected-applications/05.png "Applications")

Azure AD-joined devices are compliant if they are marked as **compliant** in the directory by Intune or by a third-party mobile device management system that integrates with Azure AD.

A domain-joined device is compliant if:

* It is registered with Azure AD. Many organizations treat domain-joined devices as trusted devices.
* It is marked as **compliant** in Azure AD by System Center Configuration Manager.
  
  ![Domain-joined devices that are compliant](./media/active-directory-conditional-access-policy-connected-applications/06.png "Device Rules")

Windows personal devices are compliant if they are marked as **compliant** in the directory by Intune or by a third-party mobile device management system that integrates with Azure AD.

Non-Windows devices are compliant if they are marked as **compliant** in the directory by Intune.

> [!NOTE]
> For more information about how to set up Azure AD for device compliance in different management systems, see [Azure Active Directory conditional access](active-directory-conditional-access.md).
> 
> 

You can select one or multiple device platforms for a device-based access policy. This includes Android, iOS, Windows Mobile (Windows 8.1 phones and tablets), and Windows (all other Windows devices, including all Windows 10 devices).
Policy evaluation occurs only on the selected platforms. If a device that attempts access is not running one of the selected platforms, the device can access the application if the user has access. No device policy is evaluated.

![Select platforms for device rules](./media/active-directory-conditional-access-policy-connected-applications/07.png "Device Rules")

## Set policy evaluation for a type of application
In the **Application Enforcement** section, set the type of applications the policy will evaluate for user or device access.

You have two options for the type of application to include:

* Browser and native applications
* Native applications only

![Choose browser or native applications](./media/active-directory-conditional-access-policy-connected-applications/08.png "Applications")

To enforce access policy for applications, select **For browser and native applications**. Then, you can include:

* Browsers (for example, Microsoft Edge in Windows 10 or Safari in iOS).
* Applications that use the Active Directory Authentication Library (ADAL) on any platform, or that use the WebAccountManager (WAM) API in Windows 10.

> [!NOTE]
> For more information about browser support and other considerations for a user who is accessing a device-based, certificate authority-protected application, see [Azure Active Directory conditional access](active-directory-conditional-access.md).
> 
> 

## Help protect email access from Exchange ActiveSync-based applications
In Office 365 Exchange Online applications, you can use Exchange ActiveSync to block email access to Exchange ActiveSync-based mail applications.

![Exchange ActiveSync compliance options](./media/active-directory-conditional-access-policy-connected-applications/09.png "Applications")

![Require a compliant device to access email](./media/active-directory-conditional-access-policy-connected-applications/10.png "Applications")

## Next steps
* [Azure Active Directory conditional access](active-directory-conditional-access.md)

