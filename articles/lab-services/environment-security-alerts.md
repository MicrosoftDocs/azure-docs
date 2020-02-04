---
title: Security alerts for environments in Azure DevTest Labs
description: This article shows you how to view security alerts for an environment in DevTest Labs and take an appropriate action. 
services: devtest-lab,lab-services
documentationcenter: na
author: spelluru

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2020
ms.author: spelluru

---

# Security alerts for environments in Azure DevTest Labs
This article shows you how to view security alerts for environments in Azure DevTest Labs. 

## Prerequisites
Currently, you can view security alerts only for environments deployed into your lab. To test or use this feature, deploy an environment into your lab. 

## View security alerts for an environment

1. On the home page for your lab, select **Security alerts** on the left menu. You should see the number of security alerts (high, medium, and low).

    ![Security alerts - overview](./media/environment-security-alerts/security-alerts-overview-page.png)
2. Right-click on three dots (...) in the last column, and select **View security alerts**. 

    ![View security alerts](./media/environment-security-alerts/view-security-alerts-menu.png)
3. You see more details about the alerts and advisor recommendations. 

    ![View security alerts](./media/environment-security-alerts/advisor-recommendations.png)


## Next steps
To learn more about environments, see the following articles:

- [Create multi-vm environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md)
- [Configure and use public environments](devtest-lab-configure-use-public-environments.md)
