---
title: Application Insights SDK support guidance 
description: Support guidance for Application Insights legacy and preview SDKs
services: azure-monitor
ms.topic: conceptual
ms.date: 03/24/2022
ms.reviewer: vgorbenko
---

# Application Insights SDK support guidance

Microsoft announces feature deprecations or breaking changes at least three years in advance and strives to provide a seamless process for migration to the replacement experience. For compatible features that are enhanced in a new SDK or before an SDK is designated as legacy they follow the [Microsoft Azure SDK lifecycle policy](https://docs.microsoft.com/lifecycle/faq/azure). Microsoft strives to retain legacy SDKs functionality but newer features may not be available with the older versions. 

To enable support engineers to provide all customers with an optimal experience, in some cases, support engineers will instruct customers to update their SDK when they believe the issue is fixed in the newer version of the SDK. The diagnostic tools that are used by support engineers may also provide better insights into the cause of the problem when the customer is using the latest SDK version.

Scenarios in which support engineers will **require** updating the SDK before proceeding:

* You're using a Preview version of the SDK, but there's a newer Stable version available
* You're using an unsupported version of the SDK per the support [policy](https://docs.microsoft.com/lifecycle/faq/azure)

Scenarios in which support engineers will **recommend** updating the SDK before proceeding:

* You're using a Stable version of the SDK, but there's a newer Stable version
* You're using a Preview version of the SDK, but there's an older Stable and also a newer Preview version
* You're using a Preview version of the SDK, there's no older Stable version but there's a newer Preview one

Scenarios in which support engineers will **inform** you that they can't guarantee support for a Preview SDK before proceeding:

* You're using a Preview version of the SDK and there's no older Stable or newer Preview version

To see the current version of Application Insights SDKs and previous versions release dates, reference the [release notes](release-notes.md).