---
title: Manage security alerts in Microsoft Defender for Cloud
description: This document helps you to use Microsoft Defender for Cloud capabilities to manage and respond to security alerts.
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
ms.date: 07/14/2022
---
# Manage and respond to security alerts in Microsoft Defender for Cloud

This topic shows you how to view and process Defender for Cloud's alerts and protect your resources.

Advanced detections that trigger security alerts are only available with Microsoft Defender for Cloud's enhanced security features enabled. A free trial is available. To upgrade, see [Enable enhanced protections](enable-enhanced-security.md).

## What are security alerts?

Defender for Cloud collects, analyzes, and integrates log data from your Azure, hybrid, and multicloud resources, the network, and connected partner solutions, such as firewalls and endpoint agents. Defender for Cloud uses the log data to detect real threats and reduce false positives. A list of prioritized security alerts is shown in Defender for Cloud along with the information you need to quickly investigate the problem and the steps to take to remediate an attack.

To learn about the different types of alerts, see [Security alerts - a reference guide](alerts-reference.md).

For an overview of how Defender for Cloud generates alerts, see [How Microsoft Defender for Cloud detects and responds to threats](alerts-overview.md).


## Manage your security alerts

1. From Defender for Cloud's overview page, select the **Security alerts** tile at the top of the page, or the link from the sidebar.

    :::image type="content" source="media/managing-and-responding-alerts/overview-page-alerts-links.png" alt-text="Getting to the security alerts page from Microsoft Defender for Cloud's overview page":::

    The security alerts page opens.

    :::image type="content" source="media/managing-and-responding-alerts/alerts-page.png" alt-text="Microsoft Defender for Cloud's security alerts list":::

1. To filter the alerts list, select any of the relevant filters. You can optionally add further filters with the **Add filter** option.

    :::image type="content" source="./media/managing-and-responding-alerts/alerts-adding-filters-small.png" alt-text="Adding filters to the alerts view." lightbox="./media/managing-and-responding-alerts/alerts-adding-filters-large.png":::

    The list updates according to the filtering options you've selected. For example, you might you want to address security alerts that occurred in the last 24 hours because you are investigating a potential breach in the system.


## Respond to security alerts

1. From the **Security alerts** list, select an alert. A side pane opens and shows a description of the alert and all the affected resources. 

    :::image type="content" source="./media/managing-and-responding-alerts/alerts-details-pane.png" alt-text="Mini details view of a security alert.":::

    > [!TIP]
    > With this side pane open, you can quickly review the alerts list with the up and down arrows on your keyboard.

1. For further information, select **View full details**.

    The left pane of the security alert page shows high-level information regarding the security alert: title, severity, status, activity time, description of the suspicious activity, and the affected resource. The Azure tags for the affected resource helps you to understand the organizational context of the resource.

    The right pane includes the **Alert details** tab containing further details of the alert to help you investigate the issue: IP addresses, files, processes, and more.
     
    :::image type="content" source="./media/managing-and-responding-alerts/security-center-alert-remediate.png" alt-text="Suggestions for what to do about security alerts.":::

    Also in the right pane is the **Take action** tab. Use this tab to take further actions regarding the security alert. Actions such as:
    - *Inspect resource context* - sends you to the resource's activity logs that support the security alert
    - *Mitigate the threat* - provides manual remediation steps for this security alert
    - *Prevent future attacks* - provides security recommendations to help reduce the attack surface, increase security posture, and thus prevent future attacks
    - *Trigger automated response* - provides the option to trigger a logic app as a response to this security alert
    - *Suppress similar alerts* - provides the option to suppress future alerts with similar characteristics if the alert isn’t relevant for your organization

    :::image type="content" source="./media/managing-and-responding-alerts/alert-take-action.png" alt-text="Take action tab.":::

## Change the status of multiple security alerts at once

The alerts list includes checkboxes so you can handle multiple alerts at once. For example, for triaging purposes you might decide to dismiss all informational alerts for a specific resource.

1. Filter according to the alerts you want to handle in bulk.

    In this example, we've selected all alerts with severity of 'Informational' for the resource 'ASC-AKS-CLOUD-TALK'. 

    :::image type="content" source="media/managing-and-responding-alerts/processing-alerts-bulk-filter.png" alt-text="Screenshot of filtering the alerts to show related alerts.":::

1. Use the checkboxes to select the alerts to be processed - or use the checkbox at the top of the list to select them all. 

    In this example, we've selected all alerts. Notice that the **Change status** button is now available. 

    :::image type="content" source="media/managing-and-responding-alerts/processing-alerts-bulk-select.png" alt-text="Screenshot of selecting all alerts to handle in bulk.":::

1. Use the **Change status** options to set the desired status.

    :::image type="icon" source="media/managing-and-responding-alerts/processing-alerts-bulk-change-status.png" border="false":::

The alerts shown in the current page will have their status changed to the selected value. 
 

## See also

In this document, you learned how to view security alerts. See the following pages for related material:

- [Configure alert suppression rules](alerts-suppression-rules.md)
- [Automate responses to Defender for Cloud triggers](workflow-automation.md)
- [Security alerts - a reference guide](alerts-reference.md)
