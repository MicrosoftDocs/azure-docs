---
title: Confidence score in Azure Security Center | Microsoft Docs
description: " Learn how to work with the Azure Security Center confidence score. "
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: e88198f8-2e16-409d-a0b0-a62e68c2f999
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/23/2018
ms.author: rkarlin

---
# Alert confidence score 

Azure Security Center provides you with visibility across the resources you run in Azure, and alerts you when it detects potential issues. The volume of alerts can be challenging for a security operations team to individually address, and it becomes necessary to prioritize which alerts to investigate. Investigating alerts can be complex and time consuming, and as a result, some alerts are ignored.

The confidence score in Security Center can help your team triage and prioritize alerts. Security Center automatically applies industry best practices, intelligent algorithms, and processes used by analysts to determine whether a threat is legitimate and provides you with meaningful insights in the form of a confidence score.

## How the confidence score is triggered

Alerts are generated when suspicious processes are detected running on your virtual machines. Security Center reviews and analyzes these alerts on Windows virtual machines running in Azure. It performs automated checks and correlations using advanced algorithms across multiple entities and data sources across the organization, and all your Azure resources, and presents with a confidence score which is a measure of how confident Security Center is that the alert is genuine and needs to be investigated.

## Understanding the confidence score

The confidence score ranges between 1 and 100 and represents the confidence Security Center has that the alert needs to be investigated. The higher the score is, the more confident Security Center is that the alert indicates genuine malicious activity. The confidence score includes a list of the top reasons why the alert received its confidence score. The confidence score makes it easier for security analysts to prioritize their response to alerts and address the most pressing attacks first, ultimately reducing the amount of time it takes to respond to attacks and breaches.

To view the confidence score:
- In the Security Center portal, open the Security alerts blade.
-  The alerts and incidents are organized from highest to lowest, meaning the more confident Security Center is that an alert represents a threat, the closer it is to the top of the page. 


 ![Confidence score][1]

To view the data that contributed to Security Center's confidence in an alert:
- In the Security alert blade, under **Confidence**, view the observations that contributed to the confidence score and gain insights related to the alert. This provides you with more insight into the nature of the activities that caused the alert.

 ![Suspicious confidence score][2]

Use Security Center’s confidence score to prioritize alert triage in your environment. The confidence score saves you time and effort by automatically investigating alerts, applying industry best practices and intelligent algorithms, and acting as a virtual analyst to determine which threats are real and where you need to focus your attention.


## Next steps
This article explained how to use the confidence score to prioritize alert investigation. To learn more about Security Center, see the following:

* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.



<!--Image references-->
[1]: ./media/security-center-confidence-score/confidence-score.png
[2]: ./media/security-center-confidence-score/suspicious-confidence-score.png
