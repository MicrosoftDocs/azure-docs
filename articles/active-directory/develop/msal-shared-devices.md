---
title: Shared Device Mode | Azure
description: Learn about shared device mode, which allows Firstline Workers to share a device 
services: active-directory
documentationcenter: dev-center-name
author: mmacy
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 3/24/2020
ms.author: brandwe
ms.reviwer: brandwe
ms.custom: aaddev, identityplatformtop40
---

# Shared Device Mode Overview


> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What Are Firstline Workers?

Firstline Workers (FLW) are retail employees, maintenance or field agents, medical personal — all categories of users who don’t sit in front of a PC or use a corporate email for collaboration. They represent the next billion or more users for your application. Microsoft provides features to enable your application to target these companies and their users.

Applying digital transformation to FLW workflows represent unique challenges vs. Information Workers because of high turnover, diverse demographics, and low familiarity with core productivity tools. To empower FLWs, organizations are adopting different strategies. Some organizations are adopting a BYOD strategy (employees use business apps on their personal phone) while others will provide their employees with shared devices such as iPads or Android tablets. 

Unfortunately, mobile devices running iOS or Android were designed for single users. As a result, most applications optimize their experience for single users as well. Part of this optimized experience means enabling single sign-on across applications and keeping users signed in on their device. When a user removes an account from an app, applications typically do not consider this a security related event. Many even continue to keep those credentials around for quick sign-in if the user wishes to sign in again. You may have even experienced times when you deleted an application on your mobile device and when you re-installed it discovered you were still signed in!

To allow customers to use these devices as part of a pool shared by employees, developers need to enable the exact opposite experience. Employees need to be able to pick a device from the pool, perform a single gesture to “make it theirs” for the duration of their shift and then perform another gesture at the end of their shift. When they do this, they should be signed out globally on the device with all their company and personal information removed so they can return it to the device pool. Furthermore, if an employee forgets to sign out, the device should be automatically signed out at the end of the employee’s shift and/or after a period of inactivity.

Azure Active Directory now supports these scenarios through a new feature called Shared Device Mode.

## What Is Shared Device Mode?

Shared Device Mode is a feature of Azure Active Directory that allows for the following:

* Build Applications So That They Can Support Firstline Workers
* Deploy Devices To Firstline Workers and Turn On Shared Device Mode


### Build Applications So That They Can Support Firstline Worker

We provide the ability to support Firstline Workers through our Microsoft Authentication Library (MSAL) and [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview) to provide a new device state called "Shared Device Mode". When a device is in shared device mode, Microsoft will provide your applications with information that will allow it to modify its behavior and protect user data depending on the state of the user on the device. 

These features in detail are:

* **Sign in a user device wide** through any supported application.
* **Sign out a user device wide** through any supported application.
* **Query the state of the device** to determine if your application is on a device that is in Shared Device mode. 
* **Query the device state of the user** on the device to determine if anything has changed since the last time your application was used.

Supporting Shared Device mode should be considered a security upgrade for your application as well as a feature upgrade. **By supporting Shared Device mode, your application is telling customers it can be used in highly regulated environments such as Healthcare and Finance.** Your users will be depending on you to ensure their data does not leak to another user. We will provide helpful signals to indicate to your application when a change has occurred you need to manage. However, you are responsible for checking on the state of the user on the device every time your app is used and clearing the previous user data. This includes if it is reloaded from the background in multi-tasking. On a user change, you should ensure both the previous user's data is cleared and that any cached data being displayed in your application is removed. We highly recommend if your company has a security review process to use it after updating your app to support Shared Device mode.

Detailed walkthroughs for how to modify your application to support Shared Device Mode for each supported platform is provided in Next Steps below.

### Deploy Devices To Firstline Worker Customers and Turn On Shared Device Mode

Once your applications support Shared Device Mode, along with all the data and security changes, you can advertise your applications as being usable for Firstline Workers. 

Device Administrators in a company are able to deploy devices and your applications to their stores and workplaces through an MDM like Intune. Part of this provisioning process will be marking the device as a "Shared Device". They configure this Shared Device mode by deploying the [Microsoft Authenticator app](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview) and setting Shared Device mode through configuration parameters. Once this is done, all the applications that can support Shared Device Mode will use the Microsoft Authenticator application to manage its user state and provide security features for the device and the organization. 

## Next Steps

We support iOS and Android platforms for Shared Device Mode. Review the documentation below for your particular platform and begin enabling your applications to target Fristline Workers.

* [Supporting Shared Device Mode for iOS](/msal-ios-shared-devices.md)
* [Supporting Shared Device Mode for Android](msal-android-shared-devices.md)

