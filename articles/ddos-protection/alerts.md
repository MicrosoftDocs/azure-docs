---
title: 'Tutorial: View and configure Azure DDoS Protection alerts'
description: Learn how to view and configure DDoS protection alerts for Azure DDoS Protection.
services: ddos-protection
documentationcenter: na
author: AbdullahBell
ms.service: ddos-protection
ms.topic: article
ms.tgt_pltfrm: na
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/12/2022
ms.author: abell
---
# Tutorial: View and configure Azure DDoS Protection alerts

Azure DDoS Protection provides detailed attack insights and visualization with DDoS Attack Analytics. Customers protecting their virtual networks against DDoS attacks have detailed visibility into attack traffic and actions taken to mitigate the attack via attack mitigation reports & mitigation flow logs. Rich telemetry is exposed via Azure Monitor including detailed metrics during the duration of a DDoS attack. Alerting can be configured for any of the Azure Monitor metrics exposed by DDoS Protection. Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Configure alerts through Azure Monitor
> * Configure alerts through portal
> * View alerts in Microsoft Defender for Cloud
> * Validate and test your alerts

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you can complete the steps in this tutorial, you must first create a [Azure DDoS Protection plan](manage-ddos-protection.md). DDoS Network Protection must be enabled on a virtual network or DDoS IP Protection must be enabled on a public IP address.  
- DDoS monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this tutorial, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.     

## Configure alerts through Azure Monitor

With these templates, you will be able to configure alerts for all public IP addresses that you have enabled diagnostic logging on. Hence in order to use these alert templates, you will first need a Log Analytics Workspace with diagnostic settings enabled. See [View and configure Azure DDoS Protection diagnostic logging](diagnostic-logging.md).

### Azure Monitor alert rule

This [Azure Monitor alert rule](https://aka.ms/DDOSmitigationstatus) will run a simple query to detect when an active DDoS mitigation is occurring. This indicates a potential attack. Action groups can be used to invoke actions as a result of the alert.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FAzure%2520Monitor%2520Alert%2520-%2520DDoS%2520Mitigation%2520Started%2FDDoSMitigationStarted.json)

### Azure Monitor alert rule with Logic App

This [DDoS Mitigation Alert Enrichment template](https://aka.ms/ddosalert) deploys the necessary components of an enriched DDoS mitigation alert: Azure Monitor alert rule, action group, and Logic App. The result of the process is an email alert with details about the IP address under attack, including information about the resource associated with the IP. The owner of the resource is added as a recipient of the email, along with the security team. A basic application availability test is also performed and the results are included in the email alert.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FDDoS%2520Mitigation%2520Alert%2520Enrichment%2FEnrich-DDoSAlert.json)

## Configure alerts through portal

You can select any of the available Azure DDoS Protection metrics to alert you when there’s an active mitigation during an attack, using the Azure Monitor alert configuration.

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your DDoS Protection Plan.

1. Under **Monitoring**, select **Alerts**.

1. Select the **+ New Alert Rule** button or select **+ Create** on the navigation bar, then select **Alert rule**.

1. Close the **Select a Signal** page.

1. On the **Create an alert rule** page, you'll see the follow tabs:

    - Scope
    - Condition
    - Actions
    - Details
    - Tags
    - Review + create
    
    For each step use the values described below:

    | Setting | Value |
    |--|--|
    | Scope | 1) Select **+ Select Scope**. <br/> 2) From the *Filter by subscription* dropdown list, select the **Subscription** that contains the public IP address you want to log. <br/> 3) From the *Filter by resource type* dropdown list, select **Public IP Address**, then select the specific public IP address you want to log metrics for. <br/> 4) Select **Done**. |
    | Condition | 1) Select the **+ Add Condition** button <br/> 2) In the *Search by signal name* search box, select **Under DDoS attack or not**. <br/> 3) Leave *Chart period* and *Alert Logic* as default. <br/> 4) From the *Operator* drop-down, select **Greater than or equal to**. <br/> 5) From the *Aggregation type* drop-down, select **Maximum**. <br/> 6) In the *Threshold value* box, enter **1**. For the *Under DDoS attack or not metric*, **0** means you're not under attack while **1** means you are under attack. <br/> 7) Select **Done**. |
    | Actions | 1) Select the **+ Create action group** button. <br/> 2) On the **Basics** tab, select your subscription, a resource group and provide the *Action group name* and *Display name*. <br/> 3) On the *Notifications* tab, under *Notification type*, select **Email/SMS message/Push/Voice**. <br/> 4) Under *Name*, enter **MyUnderAttackEmailAlert**. <br/> 5) On the *Email/SMS message/Push/Voice* page enter the **Email** and as many of the available options you require, and then select **OK**. <br/> 6) Select **Review + create** and then select **Create**. |
    | Details | 1) Under *Alert rule name*, enter *MyDdosAlert*. <br/> 2) Select **Review + create** and then select **Create**. |

Within a few minutes of attack detection, you should receive an email from Azure Monitor metrics that looks similar to the following picture:

:::image type="content" source="./media/manage-ddos-protection/ddos-alert.png" alt-text="Screenshot of a DDoS Attack Alert." lightbox="./media/manage-ddos-protection/ddos-alert.png":::

You can also learn more about [configuring webhooks](../azure-monitor/alerts/alerts-webhooks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [logic apps](../logic-apps/logic-apps-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for creating alerts.

## View alerts in Microsoft Defender for Cloud

Microsoft Defender for Cloud provides a list of [security alerts](../security-center/security-center-managing-and-responding-alerts.md), with information to help investigate and remediate problems. With this feature, you get a unified view of alerts, including DDoS attack-related alerts and the actions taken to mitigate the attack in near-time.
There are two specific alerts that you will see for any DDoS attack detection and mitigation:

- **DDoS Attack detected for Public IP**: This alert is generated when the DDoS protection service detects that one of your public IP addresses is the target of a DDoS attack.
- **DDoS Attack mitigated for Public IP**: This alert is generated when an attack on the public IP address has been mitigated.
To view the alerts, open **Defender for Cloud** in the Azure portal and select **Security alerts**. Under **Threat Protection**, select **Security alerts**. The following screenshot shows an example of the DDoS attack alerts.

:::image type="content" source="./media/manage-ddos-protection/ddos-alert-asc.png" alt-text="Screenshot of DDoS Alert in Microsoft Defender for Cloud." lightbox="./media/manage-ddos-protection/ddos-alert-asc.png":::

The alerts include general information about the public IP address that’s under attack, geo and threat intelligence information, and remediation steps.

## Validate and test

To simulate a DDoS attack to validate your alerts, see [Validate Azure DDoS Protection detection](test-through-simulations.md).

## Next steps

In this tutorial, you learned how to:

- Configure alerts through Azure Monitor
- Configure alerts through portal
- View alerts in Microsoft Defender for Cloud
- Validate and test your alerts

To learn how to test and simulate a DDoS attack, see the simulation testing guide:

> [!div class="nextstepaction"]
> [Test through simulations](test-through-simulations.md)
