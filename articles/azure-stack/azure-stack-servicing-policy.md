---
title: Azure Stack servicing policy | Microsoft Docs
description: Learn about the Azure Stack servicing policy, and how to keep an integrated system in a supported state.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: caac3d2f-11cc-4ff2-82d6-52b58fee4c39
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/07/2019
ms.author: sethm
ms.reviewer: harik
ms.lastreviewed: 01/11/2019

---
# Azure Stack servicing policy

This article describes the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state.

## Download update packages for integrated systems

Microsoft will release both full monthly update packages as well as hotfix packages to address specific issues.

Monthly update packages are hosted in a secure Azure endpoint. You can download them manually using the [Azure Stack Updates downloader tool](https://aka.ms/azurestackupdatedownload). If your scale unit is connected, the update appears automatically in the Administrator portal as **Update available**. Full, monthly update packages are well documented at each release. For more information about each release, you can click any release from the [Update package release cadence](#update-package-release-cadence) section of this article.

Hotfix update packages are hosted in the same secure Azure endpoint. You can download them manually using the embedded links in each of the respective hotfix KB articles; for example, [Azure Stack Hotfix 1.1809.12.114](https://support.microsoft.com/help/4481548/azure-stack-hotfix-1-1809-12-114). Similar to the full, monthly update packages, Azure Stack operators can download the .xml, .bin and .exe files and import them using the procedure in [Apply updates in Azure Stack](azure-stack-apply-updates.md). Azure Stack operators with connected scale units will see the hotfixes automatically appear in the Administrator portal with the message **Update available**.

If your scale unit is not connected and you would like to be notified about each hotfix release, subscribe to the [RSS](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss) or [ATOM](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom) feed noted in each release.  

## Update package types

There are two types of update packages for integrated systems:

- **Microsoft software updates**. Microsoft is responsible for the end-to-end servicing lifecycle for the Microsoft software update packages. These packages can include the latest Windows Server security updates, non-security updates, and Azure Stack feature updates. You can download theses update packages directly from Microsoft.

- **OEM hardware vendor-provided updates**. Azure Stack hardware partners are responsible for the end-to-end servicing lifecycle (including guidance) for the hardware-related firmware and driver update packages. In addition, Azure Stack hardware partners own and maintain guidance for all software and hardware on the hardware lifecycle host. The OEM hardware vendor hosts these update packages on their own download site.

## Update package release cadence

Microsoft expects to release software update packages on a monthly cadence. However, it’s possible to have multiple, or no update releases in a month. OEM hardware vendors release their updates on an as-needed basis.

Find documentation on how to plan for and manage updates, and how to determine your current version in [Manage updates overview](azure-stack-updates.md).

For information about a specific update, including how to download it, see the release notes for that update:

- [Azure Stack 1902 update](azure-stack-update-1902.md)
- [Azure Stack 1901 update](azure-stack-update-1901.md)
- [Azure Stack 1811 update](azure-stack-update-1811.md)
- [Azure Stack 1809 update](azure-stack-update-1809.md)

## Hotfixes

Occasionally, Microsoft provides hotfixes for Azure Stack that address a specific issue that is often preventative or time-sensitive.  Each hotfix is released with a corresponding Microsoft Knowledge Base article that details the issue, cause, and resolution.

Hotfixes are downloaded and installed just like the regular full update packages for Azure Stack. However, unlike a full update, hotfixes can install in minutes. We recommend Azure Stack Operators set maintenance windows when installing hotfixes. Hotfixes update the version of your Azure Stack cloud so you can easily determine if the hotfix has been applied. A separate hotfix is provided for each version of Azure Stack that is still in support. Each fix for a specific iteration is cumulative and includes the previous updates for that same version. You can read more about the applicability of a specific hotfix in a fixes corresponding Knowledge Base article.  

## Keep your system under support

To continue to receive support, you must keep your Azure Stack deployment current. The deferral policy for updates is: For your Azure Stack deployment to remain in support, it must run the most recently released update version or run either of the two preceding update versions. Hotfixes are not considered major update versions. If your Azure Stack cloud is behind by *more than two updates*, it's considered out of compliance and must update to at least the minimum supported version to receive support.

For example, if the most recently available update version is 1805, and the previous two update packages were versions 1804 and 1803, both 1803 and 1804 remain in support. However, 1802 is out of support. The policy holds true when there is no release for a month or two. For example, if the current release is 1805 and there was no 1804 release, the previous two update packages of 1803 and 1802 remain in support.

Microsoft software update packages are non-cumulative and require the previous update package or hotfix as a prerequisite. If you decide to defer one or more updates, consider the overall runtime if you want to get  to the latest version.

## Get support

Azure Stack follows the same support process as Azure. Enterprise customers can follow the process described in [How to create an Azure support request](/azure/azure-supportability/how-to-create-azure-support-request). If you are a customer of a Cloud Service Provider (CSP), contact your CSP for support.  For more information, see the [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

## Next steps

- [Manage updates in Azure Stack](azure-stack-updates.md)