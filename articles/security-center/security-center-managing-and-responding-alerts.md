---
title: Manage security alerts in Azure Security Center | Microsoft Docs
description: This document helps you to use Azure Security Center capabilities to manage and respond to security alerts.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: b88a8df7-6979-479b-8039-04da1b8737a7
ms.service: security-center
ms.topic: how-to
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/17/2021
ms.author: memildin

---
# Manage and respond to security alerts in Azure Security Center

This topic shows you how to view and process Security Center's alerts and protect your resources.

Advanced detections that trigger security alerts are only available with Azure Defender. A free trial is available. To upgrade, see [Enable Azure Defender](enable-azure-defender.md).

## What are security alerts?
Security Center automatically collects, analyzes, and integrates log data from your Azure resources, the network, and connected partner solutions, like firewall and endpoint protection solutions, to detect real threats and reduce false positives. A list of prioritized security alerts is shown in Security Center along with the information you need to quickly investigate the problem and recommendations for how to remediate an attack.

To learn about the different types of alerts, see [Security alerts - a reference guide](alerts-reference.md).

For an overview of how Security Center generates alerts, see [how Azure Security Center detects and responds to threats](security-center-alerts-overview.md).


## Manage your security alerts

1. From Security Center's overview page, select the **Security alerts** tile at the top of the page, or the link from the sidebar..

    :::image type="content" source="media/security-center-managing-and-responding-alerts/overview-page-alerts-links.png" alt-text="Getting to the security alerts page from Azure Security Center's overview page":::

    The security alerts page opens.

    :::image type="content" source="media/security-center-managing-and-responding-alerts/alerts-page.png" alt-text="Azure Security Center's security alerts list":::

1. To filter the alerts list, select any of the relevant filters. You can optionally add further filters with the **Add filter** option.

    :::image type="content" source="./media/security-center-managing-and-responding-alerts/alerts-adding-filters-small.png" alt-text="Adding filters to the alerts view" lightbox="./media/security-center-managing-and-responding-alerts/alerts-adding-filters-large.png":::

    The list updates according to the filtering options you've selected. Filtering can be very helpful. For example, you might you want to address security alerts that occurred in the last 24 hours because you are investigating a potential breach in the system.


## Respond to security alerts

1. From the **Security alerts** list, select an alert. A side pane opens and shows a description of the alert and all the affected resources. 

    :::image type="content" source="./media/security-center-managing-and-responding-alerts/alerts-details-pane.png" alt-text="Mini details view of a security alert":::

    > [!TIP]
    > With this side pane open, you can quickly review the alerts list with the up and down arrows on your keyboard.

1. For further information, select **View full details**.

    The left pane of the security alert page shows high-level information regarding the security alert: title, severity, status, activity time, description of the suspicious activity, and the affected resource. Alongside the affected resource are the Azure tags relevant to the resource. Use these to infer the organizational context of the resource when investigating the alert.

    The right pane includes the **Alert details** tab containing further details of the alert to help you investigate the issue: IP addresses, files, processes, and more.
     
    ![Suggestions for what to do about security alerts](./media/security-center-managing-and-responding-alerts/security-center-alert-remediate.png)

    Also in the right pane is the **Take action** tab. Use this tab to take further actions regarding the security alert. Actions such as:
    - *Mitigate the threat* - provides manual remediation steps for this security alert
    - *Prevent future attacks* - provides security recommendations to help reduce the attack surface, increase security posture, and thus prevent future attacks
    - *Trigger automated response* - provides the option to trigger a logic app as a response to this security alert
    - *Suppress similar alerts* - provides the option to suppress future alerts with similar characteristics if the alert isn’t relevant for your organization

    ![Take action tab](./media/security-center-managing-and-responding-alerts/alert-take-action.png)




## See also

In this document, you learned how to view security alerts. See the following pages for related material:

- [Configure alert suppression rules](alerts-suppression-rules.md)
- [Automate responses to Security Center triggers](workflow-automation.md)
- [Security alerts - a reference guide](alerts-reference.md)
