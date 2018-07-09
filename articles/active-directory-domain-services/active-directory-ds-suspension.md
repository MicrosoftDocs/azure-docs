---
title: 'Azure Active Directory Domain Services: Suspended Domains | Microsoft Docs'
description: Managed domain suspension and deletion
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mtillman
editor: curtand

ms.assetid: 95e1d8da-60c7-4fc1-987d-f48fde56a8cb
ms.service: active-directory
ms.component: domains
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/09/2018
ms.author: ergreenl

---
# Suspended Domains
When Azure AD Domain Services is unable to service a managed domain for a long period of time, the managed domain is put into a suspended state. This article will explain why managed domains are suspended, the length of suspension, and how to remediate a suspended domain.


## Overview of suspended domains

![Suspended domain timeline](media\active-directory-domain-services-suspension\suspension-timeline.PNG)

The preceding graphic outlines how a domain is suspended, how long it will be suspended, and ultimately, the deletion of a managed domain. The following sections detail the reasons why a domain can be suspended and how to unsuspend a managed domain.


## Why are managed domains suspended?

Managed domains are suspended when they are in a state where Azure AD Domain Services is unable to manage the domain. This can be caused by a misconfiguration that blocks access to resources needed by Azure AD Domain Services, or an inactive Azure subscription. After 15 days of being unable to service a managed domain, Azure AD Domain Services will suspend the domain.

The exact reasons why your domain could be suspended are listed below:
* Having one or more of the following alerts present on your domain for 15 consecutive days:
   * [AADDS104: Network Error](active-directory-ds-troubleshoot-nsg).
* Your Azure subscription is expired or inactive


## What happens when a domain is suspended?

When a domain is suspended, Azure AD Domain Services stops the virtual machines that service your managed domain. This means that backups are no longer taken, users are unable to sign-in to your domain, and synchronization with Azure AD is no longer performed.

The domain will only stay in a suspension state for a maximum of 15 days. In order to ensure a timely recovery, it is recommended you address the suspension as soon as possible.

## How do I know if my domain is suspended?
The managed domain will receive an [alert]((active-directory-ds-troubleshoot-alerts) on the Azure AD Domain Services Health page in the Azure portal that declares the domain suspended. In addition, the state of the domain will be labelled "Suspended".


## Unsuspending and restoring domains

To unsuspend a domain, the following steps are needed:

1. Navigate to the [Azure AD Domain Services page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices) on the Azure portal
2. Click on the domain you wish to unsuspend
3. On the left-hand navigation, click **Health**
4. Click on the suspension alert (The Alert ID will be either AADDS503 or AADDS504, depending on the cause of suspension).
5. Click on the resolution link provided in the alert and follow the steps to resolving your suspension.

Your domain can only be restored from the date of last backup. The date of your last backup is displayed on the Health page of your managed domain. Any changes since the last backup will not be restored upon unsuspension. In addition, Azure AD Domain Services can only store backups for up to 30 days. If the latest backup is more than 30 days old, the backup must be deleted and Azure AD Domain Services will be unable to restore from a backup.

## Deleting domains

If the domain is suspended for more than 15 days, Azure AD Domain Services deletes the managed domain due to inactivity and the inability to service the domain. You will no longer be billed for Azure AD Domain Services. To restore your managed domain, you will need to recreate it.

## Contact Us

Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
