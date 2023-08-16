---
title: Using Microsoft Sentinel with Azure Web Application Firewall 
description: This article shows you how to use Microsoft Sentinel with Azure Web Application Firewall (WAF)
services: web-application-firewall
author: TreMansdoerfer
ms.service: web-application-firewall
ms.date: 06/19/2023
ms.author: victorh
ms.topic: how-to
---

# Using Microsoft Sentinel with Azure Web Application Firewall

Azure Web Application Firewall (WAF) combined with Microsoft Sentinel can provide security information event management for WAF resources. Microsoft Sentinel provides security analytics using Log Analytics, which allows you to easily break down and view your WAF data. Using Microsoft Sentinel, you can access pre-built workbooks and modify them to best fit your organization's needs. The workbook can show analytics for WAF on Azure Content Delivery Network (CDN), WAF on Azure Front Door, and WAF on Application Gateway across several subscriptions and workspaces.

## WAF log analytics categories

WAF log analytics are broken down into the following categories:  

- All WAF actions taken 
- Top 40 blocked request URI addresses 
- Top 50 event triggers,  
- Messages over time 
- Full message details 
- Attack events by messages  
- Attack events over time 
- Tracking ID filter 
- Tracking ID messages 
- Top 10 attacking IP addresses 
- Attack messages of IP addresses 

## WAF workbook examples

The following WAF workbook examples show sample data:

:::image type="content" source="media//waf-sentinel/waf-actions-filter.png" alt-text="WAF actions filter":::

:::image type="content" source="media//waf-sentinel/top-50-event-trigger.png" alt-text="Top 50 events":::

:::image type="content" source="media//waf-sentinel/attack-events.png" alt-text="Attack events":::

:::image type="content" source="media//waf-sentinel/top-10-attacking-ip-address.png" alt-text="Top 10 attacking IP addresses":::

## Launch a WAF workbook

The WAF workbook works for all Azure Front Door, Application Gateway, and CDN WAFs. Before connecting the data from these resources, log analytics must be enabled on your resource. 

To enable log analytics for each resource, go to your individual Azure Front Door, Application Gateway, or CDN resource:

1. Select **Diagnostic settings**.

1. Select **+ Add diagnostic setting**. 

1. In the Diagnostic setting page:
   1. Type a name. 
   1. Select **Send to Log Analytics**. 
   1. Choose the log destination workspace. 
   1. Select the log types that you want to analyze:
      1. Application Gateway: ‘ApplicationGatewayAccessLog’ and ‘ApplicationGatewayFirewallLog’
      1. Azure Front Door Standard/Premium: ‘FrontDoorAccessLog’ and ‘FrontDoorFirewallLog’
      1. Azure Front Door classic: ‘FrontdoorAccessLog’ and ‘FrontdoorFirewallLog’
      1. CDN: ‘AzureCdnAccessLog’
   1. Select **Save**.

   :::image type="content" source="media//waf-sentinel/diagnostics-setting.png" alt-text="Diagnostic setting":::

1. On the Azure home page, type *Microsoft Sentinel* in the search bar and select the **Microsoft Sentinel** resource. 

1. Select an already active workspace or create a new workspace. 

1. In Microsoft Sentinel, under **Content management**, select **Content hub**.
 
1. Find and select the **Azure Web Application Firewall** solution.

1. On the toolbar at the top of the page, select **Install/Update**.

1. In Microsoft Sentinel, on the left-hand side under **Configuration**, select **Data Connectors**.

1. Search for and select **Azure Web Application Firewall (WAF)**. Select **Open connector page** on the bottom right.

   :::image type="content" source="media//waf-sentinel/web-application-firewall-data-connector.png" alt-text="Screenshot of the data connector in Microsoft Sentinel.":::

1. Follow the instructions under **Configuration** for each WAF resource that you want to have log analytic data for if you haven't done so previously.

1. Once finished configuring individual WAF resources, select the **Next steps** tab. Select one of the recommended workbooks. This workbook will use all log analytic data that was enabled previously. A working WAF workbook should now exist for your WAF resources.

   :::image type="content" source="media//waf-sentinel/waf-workbooks.png" alt-text="WAF workbooks" lightbox="media//waf-sentinel/waf-workbooks.png":::
   
## Automatically detect and respond to threats

Using Sentinel ingested WAF logs, you can use Sentinel analytics rules to automatically detect security attacks, create security incident, and automatically respond to security incident using playbooks. Learn more [Use playbooks with automation rules in Microsoft Sentinel](../sentinel/tutorial-respond-threats-playbook.md?tabs=LAC).

Azure WAF also comes in with built-in Sentinel detection rules templates for SQLi, XSS, and Log4J attacks. These templates can be found under the Analytics tab in the 'Rule Templates' section of Sentinel. You can use these templates or define your own templates based on the WAF logs. 

:::image type="content" source="media//waf-sentinel/waf-detections-1.png" alt-text="WAF Detections" lightbox="media//waf-sentinel/waf-detections-1.png":::

The automation section of these rules can help you automatically respond to the incident by running a playbook. An example of such a playbook to respond to attack can be found in network security GitHub repository [here](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Playbook%20-%20WAF%20Sentinel%20Playbook%20Block%20IP%20-%20New). This playbook automatically creates WAF policy custom rules to block the source IPs of the attacker as detected by the WAF analytics detection rules.


## Next steps

- [Learn more about Microsoft Sentinel](../sentinel/overview.md)
- [Learn more about Azure Monitor Workbooks](../azure-monitor/visualize/workbooks-overview.md)
