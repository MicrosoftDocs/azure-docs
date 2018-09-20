---
title: Secure score in Azure Security Center | Microsoft Docs
description: " Prioritize your security recommendations using the secure score in Azure Security Center. "
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c42d02e4-201d-4a95-8527-253af903a5c6
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/21/2018
ms.author: rkarlin

---
# Improve your secure score in Azure Security Center


With so many services offering security benefits, it's often hard to know what steps to take first to secure and harden your workload. The Azure Security Center secure score reviews your security recommendations and prioritizes them for you, so you know which recommendations to perform first, helping you find the most serious security vulnerabilities so you can prioritize investigation. Secure score is a measurement tool that helps you harden your security to achieve a secure workload.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]


![Secure score dashboard](./media/security-center-secure-score/secure-score-dashboard.png)

## Secure score calculation

Security Center mimics the work of the security analyst, reviewing your security recommendations and applying advanced algorithms to determine how crucial each recommendation is.
Azure Security center constantly reviews you active recommendations and calculates your secure score based on them, the score of a recommendation is derived from it’s severity and security best practices that will affect your workload security the most.

The **secure score** is a calculation based on the ratio between your healthy resources and your total resources. If the number of healthy resources is equal to the total number of resources, you get the maximum secure score of 50. To try to get your secure score closer to the max score, fix the unhealthy resources by following the recommendations.

Security Center also provides you with an Overall secure score. 

**Overall secure score** is an accumulation of all your recommendations. You can view your overall secure score across your subscriptions or management groups, depending on what you select. The score will vary based on subscription selected and the active recommendations on these subscriptions.

 

To check which recommendations are impact your secure score most, you can view the top 3 most impactful recommendations in the Security Center dashboard or you can sort the recommendations in the recommendations list blade using the **Secure score impact** column.


To view your overall secure score:

1. In the Azure dashboard, click **Security Center** and then click **Recommendations**.
2. At the top you can see the Secure score, which represents the score per policies, per selected subscription. 
2. In the table below that lists the recommendations, you can see that for each recommendation there is a column that represents the **Secure score impact**. This number represents how much your overall secure score will improve if you follow the recommendations. For example, in the screen below, if you **Remediate vulnerabilities in container security configurations**, your secure score will increase by 35 points.

   ![secure score](./media/security-center-secure-score/security-center-secure-score1.png)

## Individual secure score

In addition, to view individual secure scores, you can find these within the individual recommendation blade.  

The **Recommendation secure score** is a calculation based on the ratio between your healthy resources and your total resources. If the number of healthy resources is equal to the total number of resources, you get the maximum secure score of the recommendation. To try to get your secure score closer to the max score, fix the unhealthy resources by following the remediation steps.

The **Recommendation impact** lets you know how much your secure score will improve if you apply the recommendation steps. For example if your secure score is 42 and the **Recommendation impact** is +3, if you perform the steps outlined in the recommendation your secure score will improve to become 45.

The recommendation shows which threats your workload is exposed to if the remediation steps are not taken.

![individual recommendation secure score](./media/security-center-secure-score/indiv-recommendation-secure-score.png)

## Next steps
This article showed you how to improve your security posture using **Secure score** in Azure Security Center. To learn more about Security Center, see the following:

* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md)--Learn how to monitor the health of your Azure resources.


