---
title: Remediate recommendations in Azure Security Center  | Microsoft Docs
description: This document explains how to remediate recommendations in Azure Security Center to help you protect your Azure resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: 8be947cc-cc86-421d-87a6-b1e23077fd50
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/04/2019
ms.author: v-mohabe

---
# Remediate recommendations in Azure Security Center

Recommendations give you suggestions on how to better secure your resources.  You implement a recommendation by following the remediation steps provided in the recommendation. 

## Remediation steps <a name="remediation-steps"></a>

After reviewing all the recommendations, decide which one to remediate first. We recommend that you use the [secure score impact](security-center-recommendations.md#monitor-recommendations) to help prioritize what to do first.

1. From the list, click on the recommendation.
1. Follow the instructions in the **Remediation steps** section. Each recommendation has its own set of instructions. The following shows remediation steps for configuring applications to only allow traffic over HTTPS.

    ![Recommendation details](./media/security-center-remediate-recommendations/security-center-remediate-recommendation.png)

1. Once completed, a notification appears informing you if the remediation succeeded.

## Next steps

In this document, you were shown how to remediate recommendations in Security Center. To learn more about Security Center, see the following topics:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
