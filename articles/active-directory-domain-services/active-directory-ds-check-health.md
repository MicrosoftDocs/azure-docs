---
title: Azure Active Directory (AD) Domain Services - Check the health of your managed domain | Microsoft Docs
description: Check the health of your managed domain using the health page in the Azure portal.
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mtillman
editor: curtand

ms.assetid: 8999eec3-f9da-40b3-997a-7a2587911e96
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/266/2018
ms.author: ergreenl

---
# Azure Active Directory (AD) Domain Services - Check the health of your managed domain

## Your domain's health

Using the [Health page]() on your Azure portal, you are able to keep up to date on what is happening on your managed domain. This article will step through all of the elements of the Health page and teach you how to make sure your domain is in tip-top shape.

>[!NOTE]
> Your domain's health is evaluated around every hour. After making changes to your managed domain, you must wait until the next evaluation cycle to view your domain's updated health. You can check when your domain was last evaluated by using the "Last evaluated" timestamp located to the right of your domain name.
>

### Status of your managed domain

The status in the top right of your health page indicates the overall health of your domain. This factors in all of the existing alerts on your domain. You can also view the status of your domain on the [overview page]() of Azure AD Domain Services.

Statuses of a managed domain:

| Status | Icon | Explanation |
| --- | --- | --- |
| Running | ![Running Icon](.\media\active-directory-domain-services-alerts\running-icon.png) | Your managed domain is running smoothly and does not have any critical or warning alerts. This domain may have informational alerts. |
| Needs attention (Warning) | ![Warning Icon](.\media\active-directory-domain-services-alerts\warning-icon.png) | There are no critical alerts on your managed domain, but there are one or more warning alerts that need to be addressed. |
| Needs attention (Critical) | ![Critical Icon](.\media\active-directory-domain-services-alerts\critical-icon.png) | There are one or more critical alerts on your managed domain. You may also have warning and/or informational alerts. |
| Deploying | | Your domain is in the process of being deployed.  |

## Monitors
Monitors detail certain aspects about your managed domain that Azure AD Domain Services supervises.

Currently, the aspects monitored are:
* Sync with Azure AD
* Backups

For each monitor you can see details about what we monitor. For example, the backup monitor detail will show when backups were last taken for your managed domain.


## Alerts

Alerts are issues on your managed domain that need to be addressed in order for Azure AD Domain Services to run. Each alert explains the issue and provides a URL that outlines specific steps to resolving the issue. To view all alerts and their resolutions, visit the [Troubleshoot alerts](active-directory-ds-troubleshoot-alerts.md) article.

### Severity
Alerts are categorized into three different levels of severity: critical, warning, and informational.

 * **Critical alerts** are issues that severely impact your managed domain. These alerts should be addressed immediately, as Microsoft cannot monitor, manage, patch, and synchronize your managed domain.
 * **Warning alerts** can be issues that may impact your domain in the future, but are not necessarily "breaking" your service. These alerts usually will outline best practices and give suggestions to protect your managed domain.
 * **Informational alerts** are notifications that are not negatively impacting your domain. Informational alerts are designed to keep you knowledgeable about what is happening in your domain and with our service.

## Next steps
- [Resolve alerts on your managed domain](active-directory-ds-troubleshoot-alerts.md)
- [Read more about Azure AD Domain Services](active-directory-ds-features.md)
- [Contact Us](active-directory-contact-us.md)
