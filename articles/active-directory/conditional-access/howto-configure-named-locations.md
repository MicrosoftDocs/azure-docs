---
title: Configure named locations in Azure Active Directory | Microsoft Docs
description: Learn how to configure named locations.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 04/28/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, olhuan

ms.collection: M365-identity-device-management
---
# Create named locations in Azure Active Directory

With named locations, you can label trusted IP address ranges in your organization. Azure AD uses named locations to:
- Detect false positives in [risk detections](../identity-protection/overview-identity-protection.md). Signing in from a trusted location lowers a user's sign-in risk.   
- Configure [location-based Conditional Access](../conditional-access/location-condition.md).

In this quickstart, you learn how to configure named locations in your environment.

## Prerequisites

To complete this quickstart, you need:

* An Azure AD tenant. Sign up for a [free trial](https://azure.microsoft.com/trial/get-started-active-directory/). 
* A user, who is a global administrator for the tenant.
* An IP range that is established and credible in your organization. The IP range needs to be in **Classless Interdomain Routing (CIDR)** format.

## Configure named locations

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left pane, select **Azure Active Directory**, then select **Conditional Access** from the **Security** section.
1.	On the Conditional Access page, selected Named locations. Then, access the named location preview by using the banner at the top of the current named location blade. Locations can be created based on country or IP range.
   1. To create an IP ranges location, fill out the form on the new page.
      1. In the Name box, type a name for your named location.
      1. In the IP ranges box, type the IP range in CIDR format.
      1. Click Create.
   1. To create a Countries location, fill out the form on the new page.
      1. In the Name box, type a name for your named location.
      1. Select if you want to determine location by IP address or GPS coordinates. If you select IP address, the system will collect the IP address of the device the user is signing into. If you select GPS coordinates, the user will need to have Microsoft Authenticator installed on their mobile device. The system will contact the user’s Microsoft Authenticator app to collect the GPS location of the user’s mobile device.
      1. Click Create.

## Next steps

For more information, see:

- [Location as a condition in Conditional Access](../conditional-access/concept-conditional-access-conditions.md#locations).
