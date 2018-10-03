---
title: Managing connected partner solutions in Azure Security Center | Microsoft Docs
description: This document walks you through how Azure Security Center lets you monitor at a glance the health status of your partner solutions integrated with your Azure subscription.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/20/2018
ms.author: terrylan

---
# Managing connected partner solutions with Azure Security Center
This article walks you through how to manage and monitor connected security solutions in Azure Security Center.

## Monitoring partner solutions
To monitor the health status of connected security solutions and perform basic management:

1. Under **Security Center - Overview**, select **Security solutions**.

  ![Select security solutions][1]

  The **Connected solutions** section includes security solutions that are connected to Security Center and information about the health status of each solution.

  ![Partner solutions][2]

   The status of a partner solution can be:

   * Healthy (green) - there is no health issue.
   * Unhealthy (red) - there is a health issue that requires immediate attention.
   * Health issues (orange) - the solution has stopped reporting its health.
   * Not reported (gray) - the solution has not reported anything yet, a solution's status may be unreported if it has recently been connected and is still deploying, or no health data is available.

   > [!NOTE]
   > If health status data is not available, Security Center shows the date and time of the last event received to indicate whether the solution is reporting or not. If no health data is available and no alerts are received within the last 14 days, Security Center indicates that the solution is unhealthy or not reporting.
   >
   >

2. Select **VIEW** for additional information and options, which includes:

  - **Solution console**. Opens the management experience for this solution.
  - **Link VM**. Opens the Link Applications blade. Here you can connect resources to the partner solution.
  - **Delete solution**.
  - **Configure**.

   ![Partner solution detail][3]

## Next steps
In this article, you learned how to manage and monitor connected security solutions in Security Center. To learn more about Security Center, see the following:

* [Security solutions overview](security-center-partner-integration.md) — Learn how to connect and manage security solutions.
* [Connecting Microsoft Advanced Threat Analytics (ATA)](security-center-ata-integration.md) — Learn how to connect alerts from ATA.
* [Connecting Azure Active Directory (AD) Identity Protection ](security-center-aadip-integration.md) — Learn how to connect alerts from Azure AD Identity Protection.
* [Partner and solutions integration](security-center-partner-integration.md) - Get an overview of integrating other security solutions.
* [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-partner-solutions/partner-solutions-tile.png
[2]: ./media/security-center-partner-solutions/partner-solutions.png
[3]: ./media/security-center-partner-solutions/partner-solutions-detail.png
