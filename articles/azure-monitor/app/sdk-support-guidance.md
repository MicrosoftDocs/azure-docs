title: Application Insights SDK support guidance 
description: Support guidance for Application Insights legacy and preview SDKs
services: azure-monitor
ms.topic: conceptual
ms.date: 03/24/2022
ms.reviewer: vgorbenko

---

# Application Insights SDK support guidance

Microsoft announces feature deprecations or breaking changes at least three years in advance and strives to provide a seamless process for migration to the replacement experience. For compatible features that are enhanced in a new SDK or before a SDK is designated as legacy they follow the [Microsoft Azure SDK lifecycle policy](https://docs.microsoft.com/lifecycle/faq/azure). Microsoft strives to retain legacy SDKs functionality but newer features may not be available with the older versions. To enable support engineers to provide all customers with an optimal experience, in some cases, support engineers will instruct customers to update their SDK when they believe the issue is fixed in the newer version of the SDK. The diagnostic tools that are used by support engineers may also provide better insights into the cause of the problem when the customer is using the latest SDK version.

The support engineer will **instruct** you to update the SDK and verify the issue before proceeding:

* If you are using a Preview version of the SDK, but there is a newer Stable version available 
* If you are using a non-supported version of the SDK per the support [policy](https://docs.microsoft.com/lifecycle/faq/azure)

The support engineer will **recommend** you update the SDK and verifies the issue before proceeding:

* If you are using a Stable version of the SDK, but there is a newer Stable version 
* If you are using a Preview version of the SDK, but there is an older Stable and also a newer Preview version
* If you are using a Preview version of the SDK, there is no older Stable version but there is a newer Preview one

The support engineer will **inform** you that they cannot guarantee support for a Preview SDK before proceeding:

* If you are using a Preview version of the SDK and there is no older Stable or newer Preview version

To see the current version of Application Insights SDKs as well as previous versions release dates please reference the [release notes](release-notes.md).