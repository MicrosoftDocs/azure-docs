---
title: Security alerts for environments
description: This article shows you how to view security alerts for an environment in DevTest Labs and take an appropriate action. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.custom: UpdateFrequency2
---

# Security alerts for environments in Azure DevTest Labs
As a lab user, you can view Microsoft Defender for Cloud alerts for your labs. Defender for Cloud automatically collects, analyzes, and integrates log data. Data comes from Azure resources, the network, and connected solutions, like firewall and endpoint protection. Defender for Cloud detects real threats and reduces false positives. Defender for Cloud:

- Lists prioritized security alerts.
- Provides information to quickly investigate problems.
- Recommends how to remediate attacks.

[Learn more about security alerts in Microsoft Defender for Cloud](../security-center//security-center-alerts-overview.md).


## Prerequisites
Currently, you can view security alerts only for platform as a service (PaaS) environments deployed into your lab. To test or use this feature, [deploy an environment into your lab](devtest-lab-create-environment-from-arm.md). 

## View security alerts for an environment

1. On the home page for your lab, select **Security alerts** on the left menu. You should see the number of security alerts (high, medium, and low). Learn more on [how alerts are classified](../security-center/security-center-alerts-overview.md#how-are-alerts-classified).

    ![Security alerts - overview](./media/environment-security-alerts/security-alerts-overview-page.png)
2. Right-click on three dots (...) in the last column, and select **View security alerts**. 

    ![Screenshot that shows the Security alerts page with "View security alerts" selected.](./media/environment-security-alerts/view-security-alerts-menu.png)
    
3. You see more details about the alerts and advisor recommendations. Learn more on [managing and responding to security alerts in Microsoft Defender for Cloud](../security-center/security-center-managing-and-responding-alerts.md).

    ![View security alerts](./media/environment-security-alerts/advisor-recommendations.png)


## Next steps
To learn more about environments, see the following articles:

- [Create multi-vm environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md)
- [Configure and use public environments](devtest-lab-configure-use-public-environments.md)
