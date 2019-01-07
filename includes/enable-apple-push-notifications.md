---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 11/25/2018
ms.author: crdun
---

* [Register an app ID for your app](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingProfiles/MaintainingProfiles.html#//apple_ref/doc/uid/TP40012582-CH30-SW991). Create an explicit app ID (not a wildcard app ID) and, for **Bundle ID**, use the exact bundle ID that is in your Xcode quickstart project. It is also crucial that you select the **Push Notifications** option. 
* Next, [to prepare for configuring push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6), create either a "Development" or "Distribution" SSL certificate.
