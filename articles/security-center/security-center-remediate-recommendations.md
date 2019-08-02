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
ms.date: 07/31/2019
ms.author: v-mohabe

---
# Remediate recommendations in Azure Security Center

Recommendations give you suggestions on how to better secure your resources.  You implement a recommendation by following the [remediation steps](#remediation-steps) provided in the recommendation. For several recommendations, Security Center provides a ["One-click fix" option](#one-click) that automatically runs some of the steps for you.

## Remediation steps <a name="remediation-steps"></a>

After reviewing all the recommendations, decide which one to remediate first. We recommend that you use the [secure score impact](security-center-recommendations.md#monitor-recommendations) to help prioritize the recommendations.

1. From the list, click on the recommendation.
1. Follow the instructions in the **Remediation steps** section. Each recommendation has its own set of instructions. The following shows remediation steps for configuring applications to only allow traffic over HTTPS.

    ![Recommendation details](./media/security-center-remediate-recommendations/security-center-remediate-recommendation.png)

5. Once completed, a notification appears informing you if the remediation succeeded.


## One-click fix remediation <a name="one-click"></a>

One-click fix enables you to remediate a recommendation on a bulk of resources, with a single click. It is an option only available for specific recommendations. One-click fix simplifies remediation and enables you to quickly improve your secure score and increase the security in your environment.

To implement one-click remediation:

1. From the list of recommendations that have the **1-Click-fix** label, click on the recommendation.  

   ![Select one-click fix](./media/security-center-remediate-recommendations/one-click-fix-select.png)

2. From the **Unhealthy resources** tab, select the resources that you want to implement the recommendation on, and click **Remediate**. 

    > [!NOTE]
    > Some of the listed resources might be disabled, because you do not have the appropriate permissions to modify them.

3. In the confirmation box, read the remediation details and implications. 

   ![One-click fix](./media/security-center-remediate-recommendations/security-center-one-click-fix.png)

    > [!NOTE]
    > The implications are listed in the grey box in the **Remediate resources** window that opens after clicking **Remediate**. They list what changes happen when proceeding with the 1-click remediation.

4. Insert the relevant parameters if necessary, and approve the remediation.

    > [!NOTE]
    > -It can take several minutes after remediation completes to see the resources in the **Healthy resources** tab. To view the the remediation actions, check the activity log where they are logged.

5. Once completed, a notification appears informing you if the remediation succeeded.

## Next steps

In this document, you were shown how to remediate recommendations in Security Center. To learn more about Security Center, see the following topics:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
