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
ms.date: 01/11/2023
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
- DDoS Protection monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this tutorial, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.     

## Configure alerts through portal

You can select any of the available Azure DDoS Protection metrics to alert you when there’s an active mitigation during an attack, using the Azure Monitor alert configuration.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.
    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-page.png" alt-text="Screenshot of Security alert in Microsoft Defender for Cloud.":::
1. Select **+ Create** on the navigation bar, then select **Alert rule**.

1. On the **Create an alert rule** page, Select **+ Select scope**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-scope.png" alt-text="Screenshot of selecting DDoS Protection attack alert scope.":::

1. Enter or select the following information in the **Select a resource** tab.

    | Setting | Value |
    |--|--|
	|Filter by subscription | Select your Azure subscription. |
	|Filter by resource type | Select **Public IP Address**.|
    | Resource | Select your Public IP address. To select all Public IP addresses in the resource group, select your *resource group*. |

1. Select **Done**, then select **Next: Condition**.
1. On the **Condition** page, select **+ Add Condition**.
1. In the *Search by signal name* search box, search and select **Under DDoS attack or not**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-add-condition.png" alt-text="Screenshot of adding DDoS Protection attack alert condition.":::

1. In the **Create an alert rule** page, enter the following information. 

    | Setting | Value |
    |--|--|
    | Threshold | Leave as default. |
    | aggregation type | Leave as default. |
    | Operator | Select **Greater than or equal to**. |
    | Unit | Leave as default. |
    | Threshold value | Enter **1**. |

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-signal.png" alt-text="Screenshot of adding DDoS Protection attack alert signal.":::

1. Select **Next: Actions** then select **+ Create action group**.
1. in the **Create action group** page, enter the following information. 

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. |
    | Region | Leave as default. |
    | Action Group | Enter **myDDoSAlertsActionGroup**. |
    | Display name | Enter **myDDoSAlerts**. |

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-action-group-basics.png" alt-text="Screenshot of adding DDoS Protection attack alert action group basics.":::

1. Select **Next: Notifications**.
1. On the *Notifications* tab, under *Notification type*, select **Email/SMS message/Push/Voice**. Under *Name*, enter **myUnderAttackEmailAlert**.
1. On the *Email/SMS message/Push/Voice* page, select the **Email** check box, then enter the required email. Select **OK**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-notification.png" alt-text="Screenshot of adding DDoS Protection attack alert notification page.":::

1. Select **Review + create** and then select **Create**.
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


## Configure alerts through Azure Monitor

With these templates, you'll be able to configure alerts for all public IP addresses that you have enabled diagnostic logging on. 

> [!NOTE]
> In order to use these alert templates, you'll first need a Log Analytics Workspace with diagnostic settings enabled. For more information, see [Create Log Analytics workspace](alerts.md#create-log-analytics-workspace).
### Azure Monitor alert rule

This Azure Monitor alert rule template will run a query against the diagnostic logs to detect when an active DDoS mitigation is occurring. This indicates a potential attack. Action groups can be used to invoke actions as a result of the alert.

#### Create Log Analytics workspace

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Log Analytics workspace**. Select **Log Analytics workspace** in the search results.
1. Select **+ Create** on the navigation bar.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-log-analytics-workspace.png" alt-text="Screenshot of configuring a log analytics workspace.":::

1. On the *Create Log Analytics workspace* page, enter the following information.

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. | 
    | Name | Enter **myLogAnalyticsWorkspace**. |
    | Region | Select **East US**. |
    
1. Select **Review + create** and then select **Create** after validation passes.
1. In the search box at the top of the portal, enter **myLogAnalyticsWorkspace**. Select **myLogAnalyticsWorkspace** in the search results.
1. Under *Monitoring* in the side tab, select **Diagnostic settings. 

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-diagnostic-settings.png" alt-text="Screenshot of log analytics workspace diagnostic settings.":::

1. On the *Diagnostic setting* page, under *Destination details*, select **Send to Log Analytics workspace**.
1. Enter the following information.

    | Setting | Value |
    |--|--|
    | Diagnostic setting name | Enter **myDiagnosticSettings**. |
    | Logs | Select **allLogs**. |
    | Metrics | Select **AllMetrics**. |
    | Subscription | Select your Azure subscription. |   
    | Log Analytics Workspace | Select **myLogAnalyticsWorkspace**. | 
    
1. Select **Save**.

For more information, see [Log Analytics workspace overview](../azure-monitor/logs/log-analytics-workspace-overview.md).

#### Deploy the template

1. Select **Deploy to Azure** to sign in to Azure and open the template. 

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FAlert%2520-%2520DDOS%2520Mitigation%2520started%2520azure%2520monitor%2520alert%2FDDoSMitigationStarted.json)

    :::image type="content" source="./media/manage-ddos-protection/ddos-deploy-alert.png" alt-text="Screenshot of Azure Monitor alert rule template.":::

1. On the *Custom deployment* page, under *Project details*, enter the following information. 

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. | 
    | Region | Select your Region. |
    | Workspace Name | Enter **myLogAnalyticsWorkspace**. | 
    | Location | Enter **East US**. |

    > [!NOTE]
    > *Location* must match the location of the workspace.
        
1. Select **Review + create** and then select **Create** after validation passes.


### Azure Monitor alert rule with Logic App

This DDoS Mitigation Alert Enrichment template deploys the necessary components of an enriched DDoS mitigation alert: Azure Monitor alert rule, action group, and Logic App. The result of the process is an email alert with details about the IP address under attack, including information about the resource associated with the IP. The owner of the resource is added as a recipient of the email, along with the security team. A basic application availability test is also performed and the results are included in the email alert.


1.  Select **Deploy to Azure** to sign in to Azure and open the template. 

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FAutomation%2520-%2520DDoS%2520Mitigation%2520Alert%2520Enrichment%2FEnrich-DDoSAlert.json)

    :::image type="content" source="./media/manage-ddos-protection/ddos-deploy-alert-logic-app.png" alt-text="Screenshot of DDoS Mitigation Alert Enrichment template.":::
    
1. On the *Custom deployment* page, under *Project details*, enter the following information. 

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. | 
    | Region | Select your Region. |
    | Alert Name | Leave as default. | 
    | Security Team Email | Enter the required email address. |
    | Company Domain | Enter the required domain. |
    | Workspace Name | Enter **myLogAnalyticsWorkspace**. |

1. Select **Review + create** and then select **Create** after validation passes. 

## View alerts in Microsoft Defender for Cloud

Microsoft Defender for Cloud provides a list of [security alerts](../security-center/security-center-managing-and-responding-alerts.md), with information to help investigate and remediate problems. With this feature, you get a unified view of alerts, including DDoS attack-related alerts and the actions taken to mitigate the attack in near-time.
There are two specific alerts that you'll see for any DDoS attack detection and mitigation:

- **DDoS Attack detected for Public IP**: This alert is generated when the DDoS protection service detects that one of your public IP addresses is the target of a DDoS attack.
- **DDoS Attack mitigated for Public IP**: This alert is generated when an attack on the public IP address has been mitigated.
To view the alerts, open **Defender for Cloud** in the Azure portal and select **Security alerts**. Under **Threat Protection**, select **Security alerts**. The following screenshot shows an example of the DDoS attack alerts.

:::image type="content" source="./media/manage-ddos-protection/ddos-alert-asc.png" alt-text="Screenshot of DDoS Alert in Microsoft Defender for Cloud." lightbox="./media/manage-ddos-protection/ddos-alert-asc.png":::

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Microsoft Defender for Cloud**. Select **Microsoft Defender for Cloud** in the search results.
1. Under *General* in the side tab, select **Security alerts**. 

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-security-alerts.png" alt-text="Screenshot of Security alert in Microsoft Defender for Cloud.":::
1. To filter the alerts list, select any of the relevant filters. You can optionally add further filters with the **Add filter** option.

The alerts include general information about the public IP address that’s under attack, geo and threat intelligence information, and remediation steps.

## Clean up resources
You can keep your resources for the next tutorial. If no longer needed, delete the alerts.

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

    :::image type="content" source="./media/manage-ddos-protection/ddos-protection-alert-rule.png" alt-text="Screenshot of Security alert in Microsoft Defender for Cloud.":::

1. Select **Alert rules**. 

     :::image type="content" source="./media/manage-ddos-protection/ddos-protection-delete-alert-rules.png" alt-text="Screenshot of Security alert in Microsoft Defender for Cloud.":::

1. In the Alert rules page, select your subscription.
1. Select the alerts created in this tutorial, then select **Delete**. 
## Next steps

In this tutorial, you learned how to:

- Configure alerts through Azure Monitor
- Configure alerts through portal
- View alerts in Microsoft Defender for Cloud
- View and delete created alerts

To learn how to test and simulate a DDoS attack, see the simulation testing guide:

> [!div class="nextstepaction"]
> [Test through simulations](test-through-simulations.md)
