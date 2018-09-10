---
title: Azure AD Connect Health - Health service data is not up to date alert | Microsoft Docs
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

# Health service data is not up to date alert

## Overview
<li>Azure AD Connect Health generates data fresh alert when it does not receive all the data points from the server for two hours. The alert title is **Health service data is not up to date**. </li>
<li>The **Warning** status alert fires if Connect Health does not receive partial data elements sent from server for two hours. Warning status alert does not trigger email notifications to the tenant admin. </li>
<li>The **Error** status alert fires if Connect Health does not receive any data elements sent from server for two hours. Error status alert triggers email notifications to the tenant admin. </li>

>[!IMPORTANT] 
> This alert follows Connect Health [data retention policy](reference-connect-health-user-privacy.md#data-retention-policy)

## Troubleshooting steps 
* Make sure to go over and meet the [requirements section](how-to-connect-health-agent-install.md#requirements).
* Use [test connectivity tool](how-to-connect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service) to discover connectivity issues.


## Next steps
* [Azure AD Connect Health FAQ](reference-connect-health-faq.md)
