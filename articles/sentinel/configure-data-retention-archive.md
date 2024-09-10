---
title: Configure interactive and long-term data retention in Microsoft Sentinel
description: Towards the end of your deployment procedure, you set up data retention to suit your organization's needs.
author: cwatson-cat
ms.topic: how-to
ms.date: 07/21/2024
ms.author: cwatson
#Customer intent: As a SOC analyst, I want to set up interactive and long-term data retention settings so I can retain the data that's important to my organization in the long term.
---

# Configure interactive and long-term data retention in Microsoft Sentinel

In the previous deployment step, you enabled the User and Entity Behavior Analytics (UEBA) feature to streamline your analysis process. In this article, you learn how to set up interactive and long-term data retention, to make sure your organization retains the data that's important in the long term. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Configure data retention

Retention policies define when to remove data, or mark it for long-term retention, in a Log Analytics workspace. Long-term retention lets you keep older, less used data in your workspace at a reduced cost. To set up data retention plans, consult [Log retention plans in Microsoft Sentinel](log-plans.md), and use one or both of these methods, depending on your use case:

- [Configure interactive and long-term data retention for one or more tables](../azure-monitor/logs/data-retention-configure.md) (one table at a time)
- [Configure data retention for multiple tables](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/Archive-Log-Tool) at once

## Next steps

In this article, you learned how to set up interactive and long-term data retention.

> [!div class="nextstepaction"]
>>[Perform post-deployment steps](review-fine-tune-overview.md)