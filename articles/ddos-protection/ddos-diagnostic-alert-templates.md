---
title: 'Configure Azure DDoS Protection diagnostic logging alerts'
description: Learn how to configure DDoS protection diagnostic alerts for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 08/07/2023
ms.author: abell
---

# Configure Azure DDoS Protection diagnostic logging alerts

DDoS Protection diagnostic logging alerts provide visibility into DDoS attacks and mitigation actions. You can configure alerts for all DDoS protected public IP addresses that you have enabled diagnostic logging on.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure diagnostic logging alerts through Azure Monitor and Logic App.
## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 
- In order to use diagnostic logging, you must first create a [Log Analytics workspace with diagnostic settings enabled](ddos-configure-log-analytics-workspace.md). 
- DDoS Protection monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this guide, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. 

## Configure diagnostic logging alerts through Azure Monitor

With these templates, you'll be able to configure alerts for all public IP addresses that you have enabled diagnostic logging on. 

### Create Azure Monitor alert rule

The Azure Monitor alert rule template will run a query against the diagnostic logs to detect when an active DDoS mitigation is occurring. The alert indicates a potential attack. Action groups can be used to invoke actions as a result of the alert.


#### Deploy the template

1. Select **Deploy to Azure** to sign in to Azure and open the template. 

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FAlert%2520-%2520DDOS%2520Mitigation%2520started%2520azure%2520monitor%2520alert%2FDDoSMitigationStarted.json)

1. On the *Custom deployment* page, under *Project details*, enter the following information. 

    :::image type="content" source="./media/ddos-diagnostic-alert-templates/ddos-deploy-alert.png" alt-text="Screenshot of Azure Monitor alert rule template." lightbox="./media/ddos-diagnostic-alert-templates/ddos-deploy-alert.png":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. | 
    | Region | Select your Region. |
    | Workspace Name | Enter your workspace name. In this example the *Workspace name* is **myLogAnalyticsWorkspace**. | 
    | Location | Enter **East US**. |

    > [!NOTE]
    > *Location* must match the location of the workspace.
        
1. Select **Review + create** and then select **Create** after validation passes.


### Create Azure Monitor diagnostic logging alert rule with Logic App

This DDoS Mitigation Alert Enrichment template deploys the necessary components of an enriched DDoS mitigation alert: Azure Monitor alert rule, action group, and Logic App. The result of the process is an email alert with details about the IP address under attack, including information about the resource associated with the IP. The owner of the resource is added as a recipient of the email, along with the security team. A basic application availability test is also performed and the results are included in the email alert.
#### Deploy the template 

1.  Select **Deploy to Azure** to sign in to Azure and open the template. 

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%2520DDoS%2520Protection%2FAutomation%2520-%2520DDoS%2520Mitigation%2520Alert%2520Enrichment%2FEnrich-DDoSAlert.json)
    
1. On the *Custom deployment* page, under *Project details*, enter the following information. 

    :::image type="content" source="./media/ddos-diagnostic-alert-templates/ddos-deploy-alert-logic-app.png" alt-text="Screenshot of DDoS Mitigation Alert Enrichment template." lightbox="./media/ddos-diagnostic-alert-templates/ddos-deploy-alert-logic-app.png":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your Resource group. | 
    | Region | Select your Region. |
    | Alert Name | Leave as default. | 
    | Security Team Email | Enter the required email address. |
    | Company Domain | Enter the required domain. |
    | Workspace Name | Enter your workspace name. In this example the *Workspace name* is **myLogAnalyticsWorkspace**. |

1. Select **Review + create** and then select **Create** after validation passes. 

## Clean up resources
You can keep your resources for the next guide. If no longer needed, delete the alerts.

1. In the search box at the top of the portal, enter **Alerts**. Select **Alerts** in the search results.

    :::image type="content" source="./media/ddos-diagnostic-alert-templates/ddos-protection-alert-rule.png" alt-text="Screenshot of Alerts page." lightbox="./media/ddos-diagnostic-alert-templates/ddos-protection-alert-rule.png":::

1. Select **Alert rules**, then in the Alert rules page, select your subscription.

     :::image type="content" source="./media/ddos-diagnostic-alert-templates/ddos-protection-delete-alert-rules.png" alt-text="Screenshot of Alert rules page." lightbox="./media/ddos-diagnostic-alert-templates/ddos-protection-delete-alert-rules.png":::

1. Select the alerts created in this guide, then select **Delete**. 

## Next steps

In this tutorial you learned how to configure diagnostic alerts through Azure portal.

To test DDoS Protection through simulations, continue to the next guide.

> [!div class="nextstepaction"]
> [Test through simulations](test-through-simulations.md)
> [View alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md)
