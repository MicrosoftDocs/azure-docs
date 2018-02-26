---
title: 'Health service data is not up to date | Microsoft Docs'
description: This document describes the cause of "Health service data is not up to date" alert and how to troubleshoot it.
services: active-directory
documentationcenter: ''
author: zhiweiw
manager: maheshu
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2018
ms.author: zhiweiw
---

# "Health service data is not up to date" alert

## Overview
Azure AD Connect Health generates data fresh alert when it does not receive all the data points from the server for two hours. The alert title is **Health service data is not up to date**. 
The **Warning** status alert will fire in if Connect Health does not receive partial data elements sent from server for 2 hours. Warning status alert will not trigger email notifications to the tenant admin. 
The **Error** status alert will fire if Connect Health does not receive all data elements sent from server for 2 hours. Error status alert will trigger email notifications to the tenant admin.

>[!IMPORTANT] 
> This alert follows Connect Health [data retention policy](active-directory-aadconnect-health-gdpr.md#data-retention-policy)

## Troubleshooting steps 
* Make sure to go over and meet the [requirements section](active-directory-aadconnect-health-agent-install.md#requirements).
* Use [test connectivity tool](active-directory-aadconnect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service) to discover connectivity issues.


## Next steps
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
