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
ms.date: 3/4/2019
ms.author: rkarlin

---
# Collecting data from Azure Security Center


Azure Security Insights enables you to collect alerts from [Azure Security Center](../security-center/security-center-intro.md) and stream them into Security Insights. 

## Prerequisites

- If you want to export alerts from Azure Security Center, you must be a contributor on the subscription whose logs you stream.

- You must have the [Azure Security Center Standard tier](../security-center/security-center-pricing.md) running on the subscription. If not, [upgrade your subscription to standard](https://azure.microsoft.com/en-us/pricing/details/security-center/).


## Connect to Azure AD

1. In Azure Security Insights, select **Data collection** and then click the **Azure Security Center** tile.
2. In the blade that opens, click **Connect** next to each subscription whose alerts you want to stream into Security Insights.


## Next steps
In this document, you learned how to connect Azure Security Center to Security Insights. To learn more about Security Insights, see the following articles:

*