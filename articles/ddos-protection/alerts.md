---
title: 'Tutorial: Configure Azure DDoS Protection metric alerts through portal'
description: Learn how to configure DDoS protection metric alerts for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: tutorial
ms.date: 07/17/2024
ms.author: abell
---

# Tutorial: Configure Azure DDoS Protection metric alerts through portal

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure metrics alerts through Azure Monitor.

DDoS Protection metrics alerts are an important step in alerting your team through Azure portal, email, SMS message, push, or voice notification when an attack is detected.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 
- DDoS Protection monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address.    

## Configure metric alerts through portal

You can select any of the available Azure DDoS Protection metrics to alert you when there’s an active mitigation during an attack, using the Azure Monitor alert configuration.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

1. Select **+ Create** on the navigation bar, then select **Alert rule**.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-page.png" alt-text="Screenshot of DDoS Protection creating Alerts." lightbox="./media/ddos-alerts/ddos-protection-alert-page.png":::

1. On the **Create an alert rule** page, select **+ Select scope**, then select the following information in the **Select a resource** page.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-scope.png" alt-text="Screenshot of selecting DDoS Protection attack alert scope." lightbox="./media/ddos-alerts/ddos-protection-alert-scope.png":::


    | Setting | Value |
    |--|--|
	|Filter by subscription | Select the **Subscription** that contains the public IP address you want to log. |
	|Filter by resource type | Select **Public IP Addresses**.|
    |Resource | Select the specific **Public IP address** you want to log metrics for. |

1. Select **Done**, then select **Next: Condition**.
1. On the **Condition** page, select **+ Add Condition**, then in the *Search by signal name* search box, search, and select **Under DDoS attack or not**.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-add-condition.png" alt-text="Screenshot of adding DDoS Protection attack alert condition." lightbox="./media/ddos-alerts/ddos-protection-alert-add-condition.png":::

1. In the **Create an alert rule** page, select the following information. 

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-signal.png" alt-text="Screenshot of adding DDoS Protection attack alert signal." lightbox="./media/ddos-alerts/ddos-protection-alert-signal.png":::

    | Setting | Value |
    |--|--|
    | Threshold | Leave as the default *Static*. |
    | Aggregation type | Leave as default *Maximum*. |
    | Operator | Select **Greater than or equal to**. |
    | Unit | Leave as default *Count*. |
    | Threshold value | Enter **1**. For the *Under DDoS attack or not metric*, **0** means you're not under attack while **1** means you are under attack. |
    | Check every | Choose how often the alert rule will check if the condition is met. Leave as default *1 minute*. |
    | Lookback period | This is the lookback period, or the time period to look back at each time the data is checked. For example, every 1 minute you’ll be looking at the past 5 minutes. Leave as default *5 minutes*. |
  

1. Select **Next: Actions** then select **+ Create action group**.

### Create action group

1. In the **Create action group** page, enter the following information, then select **Next: Notifications**.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-action-group-basics.png" alt-text="Screenshot of adding DDoS Protection attack alert action group basics." lightbox="./media/ddos-alerts/ddos-protection-alert-action-group-basics.png":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription that contains the public IP address you want to log. |   
    | Resource Group | Select your Resource group. |
    | Region | Choose these locations for the broadest set of Azure products and long-term capacity growth. |
    | Action Group | Provide an action group name that is unique within the resource group. For this example, enter **myDDoSAlertsActionGroup**. |
    | Display name | This display name will be shown as the action group name in email and SMS notifications. For this example, enter **myDDoSAlerts**. |

    
1. On the *Notifications* tab, under *Notification type*, select the notification type you wish to use. For this example, we select **Email/SMS message/Push/Voice**. In the *Name* tab, enter **myUnderAttackEmailAlert**.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-action-group-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification type." lightbox="./media/ddos-alerts/ddos-protection-alert-action-group-notification.png":::

1. On the *Email/SMS message/Push/Voice* page, select the **Email** check box, then enter the required email. Select **OK**.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification page." lightbox="./media/ddos-alerts/ddos-protection-alert-notification.png":::

1. Select **Review + create** and then select **Create**.

> [!NOTE]
> Review the [Action groups](../azure-monitor/alerts/action-groups.md) documentation for more information on creating action groups. 

### Continue configuring alerts through portal

1. Select **Next: Details**. 

     :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-details.png" alt-text="Screenshot of adding DDoS Protection attack alert details page." lightbox="./media/ddos-alerts/ddos-protection-alert-details.png":::

1. On the *Details* tab, under *Alert rule details*, enter the following information. 

    | Setting | Value |
    |--|--|
    | Severity | Select **2 - Warning**. |   
    | Alert rule name | Enter **myDDoSAlert**. |

1. Select **Review + create** and then select **Create** after validation passes.

Within a few minutes of attack detection, you should receive an email from Azure Monitor metrics that looks similar to the following picture:

:::image type="content" source="./media/ddos-alerts/ddos-alert.png" alt-text="Screenshot of a DDoS attack Alert after a DDoS attack." lightbox="./media/ddos-alerts/ddos-alert.png":::

You can also learn more about [configuring webhooks](../azure-monitor/alerts/alerts-webhooks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [logic apps](../logic-apps/logic-apps-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for creating alerts.

## Clean up resources
You can keep your resources for the next tutorial. If no longer needed, delete the alerts.

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

    :::image type="content" source="./media/ddos-alerts/ddos-protection-alert-rule.png" alt-text="Screenshot of Alerts page within Azure for DDoS Protection." lightbox="./media/ddos-alerts/ddos-protection-alert-rule.png":::

1. Select **Alert rules**. 

     :::image type="content" source="./media/ddos-alerts/ddos-protection-delete-alert-rules.png" alt-text="Screenshot of Alert rules page within Azure for DDoS Protection." lightbox="./media/ddos-alerts/ddos-protection-delete-alert-rules.png":::

1. In the Alert rules page, select your subscription.

1. Select the alerts created in this tutorial, then select **Delete**. 

## Next steps

In this tutorial you learned how to configure metric alerts through Azure portal.

To configure diagnostic logging, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Configure diagnostic logging](diagnostic-logging.md)
> [Test through simulations](test-through-simulations.md)
> [View alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md)
