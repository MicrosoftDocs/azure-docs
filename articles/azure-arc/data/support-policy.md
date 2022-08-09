---
description: "Explains the support policy for Azure Arc-enabled data services"
title: "Azure Arc-enabled data services support policy"
ms.date: "08/08/2022"
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.reviewer: "MikeRayMSFT"
ms.topic: conceptual
author: "dnethi"
ms.author: "dinethi"
---
# Azure Arc-enabled data services support policy. 

This article explains the support policy for Azure Arc-enabled data services.

## Support policy
- Azur Arc-enabled data services follows [Microsoft Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy).
- Read the original [Modern Lifecycle Policy announcement](https://support.microsoft.com/help/447912/announcing-microsoft-modern-lifecycle-policy).
- For additional information, see [Modern Policy FAQs](https://support.microsoft.com/help/30882/modern-lifecycle-policy-faq).

## Supported updates

Microsoft supports Azure Arc-enabled data services for one year from the date of the release. This support applies to the data controller, and any supported data services. For example, this support also applies to Azure Arc-enabled SQL Managed Instance.

Microsoft releases new versions periodically. [Version log](version-log.md) shows the history of releases.

Each release contains an image tag. Use the image tag to identify when Microsoft released the component. Microsoft supports the component for 1 full year after the release.

### Example

For example, a complete image tag for the release in June, 2022 is: `v1.8.0_2022-06-1`.

The image tag follows this pattern, *\<version\>_\<date\>-#*.  
- \<version\> identifies the data services major and minor version numbers. The pattern is: **v**#.#.#
- \<date\> identifies the year, month, and day of the release. The pattern is: YYYY-MM-DD-#. 
- -# identifies an internal build number.

The example image released on June 6th, 2022. 

Microsoft supports this release through June 5th, 2023.

> [!NOTE]
> The latest current branch version is always in the **Full Support** servicing phase. This support statement means that if you encounter a code defect that warrants a critical update, you must have the latest current branch version installed in order to receive a fix.
