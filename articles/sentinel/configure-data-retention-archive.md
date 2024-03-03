---
title: Configure data retention and archive in Microsoft Sentinel
description: Towards the end of your deployment procedure, you set up data retention to suit your organization's needs.
author: limwainstein
ms.topic: how-to
ms.date: 07/05/2023
ms.author: lwainstein
#Customer intent: As a SOC analyst, I want to set up data retention and archive settings so I can retain the data that's important to my organization in the long term.
---

# Configure data retention and archive in Microsoft Sentinel

In the previous deployment step, you enabled the User and Entity Behavior Analytics (UEBA) feature to streamline your analysis process. In this article, you learn how to set up data retention and archive, to make sure your organization retains the data that's important in the long term. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Configure data retention and archive

Retention policies define when to remove or archive data in a Log Analytics workspace. Archiving lets you keep older, less used data in your workspace at a reduced cost. To set up data retention, use one or both of these methods, depending on your use case:

- [Configure data retention and archive for one or more tables](../azure-monitor/logs/data-retention-archive.md) (one table at a time)
- [Configure data retention and archive for multiple tables](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/Archive-Log-Tool) at once

## Next steps

In this article, you learned how to set up data retention and archive.

> [!div class="nextstepaction"]
>>[Perform post-deployment steps](review-fine-tune-overview.md)