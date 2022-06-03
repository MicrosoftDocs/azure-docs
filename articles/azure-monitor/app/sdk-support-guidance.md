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

Support engineers will provide SDK update guidance according to the following scenario table.

|SDK Version in use |Alternative available |Update policy |
|---------|---------|---------|
|Preview                                                                        | Stable version                                 | **UPDATE REQUIRED**                 |
|Unsupported ([support policy](https://docs.microsoft.com/lifecycle/faq/azure)) | Any supported version                          | **UPDATE REQUIRED**                 |
|Stable                                                                         | Newer supported version                        | **UPDATE RECOMMENDED**              |
|Preview                                                                        | Older stable version                           | **UPDATE RECOMMENDED**              |
|Preview                                                                        | Newer preview version, no older stable version | **UPDATE RECOMMENDED**              |
|Preview                                                                        | Newer preview version, no older stable version | **UPDATE RECOMMENDED**              |

> [!WARNING]
> Only commercially reasonable support is provided for Preview versions of the SDK. If the support incident requires escalation to development for further guidance, requires a non-security update, or requires a security update, customers will be asked to use a fully supported SDK version to continue support. Commercially reasonable support does not include an option to engage Microsoft product development resources; technical workarounds may be limited or not possible.

To see the current version of Application Insights SDKs and previous versions release dates, reference the [release notes](release-notes.md).