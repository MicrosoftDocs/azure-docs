---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2018
ms.author: rkarlin

---
# Collecting data from Office 365 Logs

You can stream audit logs from [Office 365](https://docs.microsoft.com/en-us/office365/admin/admin-home?view=o365-worldwide) into Security Insights with a single click.

You can stream audit logs from multiple tenants to a single workspace in Security Insights.


## Prerequisites

- Your must be a global administrator or security administrator on your tenant


## Connect to Azure AD Information Protection

If you already have Azure AD Information Protection, make sure it is [enabled on your network](../information-protection/activate-service.md).


1. In Azure Security Insights, select **Data collection** and then click the **Office 365** tile.

2. You will be prompted to authenticate with a global admin user on the tenant from which you want to connect to Security Insights.
3. When asked, provide permissions to Security Insights to gather logs. 

4. Click **Connect**.



## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Center. To learn more about Security Center, see the following articles:

