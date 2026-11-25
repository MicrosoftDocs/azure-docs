---
title: Configure deviation notifications - Azure Workload Center for SAP
description: Setting Up Configuration Deviation Notifications
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Setting up configuration deviation notifications 

Configuration Validation checks your workloads every hour. Configuration deviation notifications proactively tell the right people when a high-impact configuration deviation appears on a workload virtual instance (WVI), so you no longer need to open the portal or ask the agent to find out. Every notification takes you straight to remediation, and you are told again when the deviation is resolved.

## Prerequisites 

- Notification recipients are provided for the WVI.

- An action group with the notification recipients’ email addresses. You either select an existing action group or create a new one.

- Enable a custom [notification profile](configuration-validation.md#notification-profiles) for the WVI that includes both **Deviation detected** and **Deviation resolved** notifications.

> [!NOTE]
> Use a distribution list so notifications keep reaching the right people through role changes.

## Configure notification recipients by using an action group

Configuration Deviation Notifications are delivered to the email recipients defined in an Azure Monitor action group. An action group is a reusable collection of notification preferences that you can share across WVIs.

- For an existing WVI, select the deviation alert option.  
  :::image type="content" source="media/setting-up-configuration-deviation-notifications/deviation-alert-disabled.png" lightbox="media/setting-up-configuration-deviation-notifications/deviation-alert-disabled.png" alt-text="Screenshot of Azure WVI overview page with Deviation alert status shown as Disabled, highlighted.":::

<!-- -->

- In the notification settings for your WVI, choose **Select action group** to use an existing action group, or **Create action group** to create a new one.  
  :::image type="content" source="media/setting-up-configuration-deviation-notifications/set-deviation-notification-panel.png" lightbox="media/setting-up-configuration-deviation-notifications/set-deviation-notification-panel.png" alt-text="Screenshot of Set deviation notification panel with enabled notifications, Default level, and SV Action Group selected.":::

- If you're creating a new action group, on the **Notifications** tab, select the **Email/SMS message/Push/Voice** notification type, select **Email**, and enter the recipient email address (repeat for each recipient, or use a distribution list). Select **Review + create**, and then **Create**.

- Confirm that the action group is selected for the WVI and save the notification settings.

For more information, see [Create and manage action groups in the Azure portal](/azure/azure-monitor/alerts/action-groups).

## Acting on a notification 

When you receive a deviation notification, follow these steps to resolve it: 

1.  Open the notification email. It lists the deviations detected along with the link to see the complete list in portal. 

<!-- -->

2.  Select the link to open the **Check results** page for that WVI with all deviations listed. Select the Copilot nudge icon to get the remediation steps. 

<!-- -->

3.  Use this Azure Copilot Run SAP Agent to get workload-aware remediation steps. 

<!-- -->

4.  Apply the fix. The next hourly validation run automatically rechecks the configuration.

<!-- -->

5.  When the fix is confirmed in the next validation run, you receive a **Deviation resolved** notification. 

> [!NOTE]
> Every notification includes an option to unsubscribe.
