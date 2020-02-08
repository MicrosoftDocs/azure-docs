---
title: Conditional Access require managed device - Azure Active Directory
description: Learn how to configure Azure Active Directory (Azure AD) device-based Conditional Access policies that require managed devices for cloud app access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 11/22/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jairoc

#Customer intent: As an IT admin, I wan to know how to require managed devices for the access to certain resources to ensure that they are accessed only from devices that meet my standards for security and compliance
ms.collection: M365-identity-device-management
---
# How To: Require managed devices for cloud app access with Conditional Access

In a mobile-first, cloud-first world, Azure Active Directory (Azure AD) enables single sign-on to apps, and services from anywhere. Authorized users can access your cloud apps from a broad range of devices including mobile and also personal devices. However, many environments have at least a few apps that should only be accessed by devices that meet your standards for security and compliance. These devices are also known as managed devices. 

This article explains how you can configure Conditional Access policies that require managed devices to access certain cloud apps in your environment. 

## Prerequisites

Requiring managed devices for cloud app access ties **Azure AD Conditional Access** and **Azure AD device management** together. If you are not familiar with one of these areas yet, you should read the following topics, first:

- **[Conditional Access in Azure Active Directory](../active-directory-conditional-access-azure-portal.md)** - This article provides you with a conceptual overview of Conditional Access and the related terminology.
- **[Introduction to device management in Azure Active Directory](../devices/overview.md)** - This article gives you an overview of the various options you have to get devices under organizational control. 

## Scenario description

Mastering the balance between security and productivity is a challenge. The proliferation of supported devices to access your cloud resources helps to improve the productivity of your users. On the flip side, you probably don't want certain resources in your environment to be accessed by devices with an unknown protection level. For the affected resources, you should require that users can only access them using a managed device. 

With Azure AD Conditional Access, you can address this requirement with a single policy that grants access:

- To selected cloud apps
- For selected users and groups
- Requiring a managed device

## Managed devices  

In simple terms, managed devices are devices that are under *some sort* of organizational control. In Azure AD, the prerequisite for a managed device is that it has been registered with Azure AD. Registering a device creates an identity for the device in form of a device object. This object is used by Azure to track status information about a device. As an Azure AD administrator, you can already use this object to toggle (enable/disable) the state of a device.
  
![Device-based conditions](./media/require-managed-devices/32.png)

To get a device registered with Azure AD, you have three options: 

- **Azure AD registered devices** - to get a personal device registered with Azure AD
- **Azure AD joined devices** - to get an organizational Windows 10 device that is not joined to an on-premises AD registered with Azure AD. 
- **Hybrid Azure AD joined devices** - to get a Windows 10 or supported down-level device that is joined to an on-premises AD registered with Azure AD.

These three options are discussed in the article [What is a device identity?](../devices/overview.md)

To become a managed device, a registered device must be either a **Hybrid Azure AD joined device** or a **device that has been marked as compliant**.  

![Device-based conditions](./media/require-managed-devices/47.png)
 
## Require Hybrid Azure AD joined devices

In your Conditional Access policy, you can select **Require Hybrid Azure AD joined device** to state that the selected cloud apps can only be accessed using a managed device. 

![Device-based conditions](./media/require-managed-devices/10.png)

This setting only applies to Windows 10 or down-level devices such as Windows 7 or Windows 8 that are joined to an on-premises AD. You can only register these devices with Azure AD using a Hybrid Azure AD join, which is an [automated process](../devices/hybrid-azuread-join-plan.md) to get a Windows 10 device registered. 

![Device-based conditions](./media/require-managed-devices/45.png)

What makes a Hybrid Azure AD joined device a managed device?  For devices that are joined to an on-premises AD, it is assumed that the control over these devices is enforced using management solutions such as **Configuration Manager** or **group policy (GP)** to manage them. Because there is no method for Azure AD to determine whether any of these methods has been applied to a device, requiring a hybrid Azure AD joined device is a relatively weak mechanism to require a managed device. It is up to you as an administrator to judge whether the methods that are applied to your on-premises domain-joined devices are strong enough to constitute a managed device if such a device is also a Hybrid Azure AD joined device.

## Require device to be marked as compliant

The option to *require a device to be marked as compliant* is the strongest form to request a managed device.

![Device-based conditions](./media/require-managed-devices/11.png)

This option requires a device to be registered with Azure AD, and also to be marked as compliant by:
         
- Intune
- A third-party mobile device management (MDM) system that manages Windows 10 devices via Azure AD integration. Third-party MDM systems for device OS types other than Windows 10 are not supported.
 
![Device-based conditions](./media/require-managed-devices/46.png)

For a device that is marked as compliant, you can assume that: 

- The mobile devices your workforce uses to access company data are managed
- Mobile apps your workforce uses are managed
- Your company information is protected by helping to control the way your workforce accesses and shares it
- The device and its apps are compliant with company security requirements

### Known behavior

On Windows 7, iOS, Android, macOS, and some third-party web browsers Azure AD identifies the device using a client certificate that is provisioned when the device is registered with Azure AD. When a user first signs in through the browser the user is prompted to select the certificate. The end user must select this certificate before they can continue to use the browser.

## Next steps

Before configuring a device-based Conditional Access policy in your environment, you should take a look at the [best practices for Conditional Access in Azure Active Directory](best-practices.md).
