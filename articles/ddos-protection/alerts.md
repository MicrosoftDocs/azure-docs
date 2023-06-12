---
title: 'Configure Azure DDoS Protection metric alerts through portal'
description: Learn how to configure DDoS protection metric alerts for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 01/30/2023
ms.author: abell
---
# Configure Azure DDoS Protection metric alerts through portal

Azure DDoS Protection provides detailed attack insights and visualization with DDoS Attack Analytics. Customers protecting their virtual networks against DDoS attacks have detailed visibility into attack traffic and actions taken to mitigate the attack via attack mitigation reports & mitigation flow logs. Rich telemetry is exposed via Azure Monitor including detailed metrics during the duration of a DDoS attack. Alerting can be configured for any of the Azure Monitor metrics exposed by DDoS Protection. Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors/azure-ddos-protection.md), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

In this article, you'll learn how to configure metrics alerts through Azure Monitor.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 
- DDoS Protection monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this How-To guide, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.     

## Configure metric alerts through portal

You can select any of the available Azure DDoS Protection metrics to alert you when there’s an active mitigation during an attack, using the Azure Monitor alert configuration.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

1. Select **+ Create** on the navigation bar, then select **Alert rule**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-page.png" alt-text="Screenshot of creating Alerts.":::

1. On the **Create an alert rule** page, select **+ Select scope**, then select the following information in the **Select a resource** page.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-scope.png" alt-text="Screenshot of selecting DDoS Protection attack alert scope.":::


    | Setting | Value |
    |--|--|
	|Filter by subscription | Select the **Subscription** that contains the public IP address you want to log. |
	|Filter by resource type | Select **Public IP Addresses**.|
    |Resource | Select the specific **Public IP address** you want to log metrics for. |

1. Select **Done**, then select **Next: Condition**.
1. On the **Condition** page, select **+ Add Condition**, then in the *Search by signal name* search box, search and select **Under DDoS attack or not**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-add-condition.png" alt-text="Screenshot of adding DDoS Protection attack alert condition.":::

1. In the **Create an alert rule** page, enter or select the following information. 
  :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-signal.png" alt-text="Screenshot of adding DDoS Protection attack alert signal.":::

    | Setting | Value |
    |--|--|
    | Threshold | Leave as default. |
    | Aggregation type | Leave as default. |
    | Operator | Select **Greater than or equal to**. |
    | Unit | Leave as default. |
    | Threshold value | Enter **1**. For the *Under DDoS attack or not metric*, **0** means you're not under attack while **1** means you are under attack. |

  

1. Select **Next: Actions** then select **+ Create action group**.

### Create action group

1. In the **Create action group** page, enter the following information, then select **Next: Notifications**.
:::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-action-group-basics.png" alt-text="Screenshot of adding DDoS Protection attack alert action group basics.":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription that contains the public IP address you want to log. |   
    | Resource Group | Select your Resource group. |
    | Region | Leave as default. |
    | Action Group | Enter **myDDoSAlertsActionGroup**. |
    | Display name | Enter **myDDoSAlerts**. |

    
1. On the *Notifications* tab, under *Notification type*, select **Email/SMS message/Push/Voice**. Under *Name*, enter **myUnderAttackEmailAlert**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-action-group-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification type.":::


1. On the *Email/SMS message/Push/Voice* page, select the **Email** check box, then enter the required email. Select **OK**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification page.":::

1. Select **Review + create** and then select **Create**.
### Continue configuring alerts through portal

1. Select **Next: Details**. 

     :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-details.png" alt-text="Screenshot of adding DDoS Protection attack alert details page.":::

1. On the *Details* tab, under *Alert rule details*, enter the following information. 

    | Setting | Value |
    |--|--|
    | Severity | Select **2 - Warning**. |   
    | Alert rule name | Enter **myDDoSAlert**. |

1. Select **Review + create** and then select **Create** after validation passes.

Within a few minutes of attack detection, you should receive an email from Azure Monitor metrics that looks similar to the following picture:

:::image type="content" source="./media/manage-ddos-protection/ddos-alert.png" alt-text="Screenshot of a DDoS Attack Alert.":::

You can also learn more about [configuring webhooks](../azure-monitor/alerts/alerts-webhooks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [logic apps](../logic-apps/logic-apps-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for creating alerts.

## Clean up resources
You can keep your resources for the next tutorial. If no longer needed, delete the alerts.

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-rule.png" alt-text="Screenshot of Alerts page.":::

1. Select **Alert rules**. 

     :::image type="content" source="./media/manage-ddos-protection/ddos-protection-delete-alert-rules.png" alt-text="Screenshot of Alert rules page.":::

1. In the Alert rules page, select your subscription.
1. Select the alerts created in this tutorial, then select **Delete**. 
## Next steps

* [Test through simulations](test-through-simulations.md)
* [View alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md)
