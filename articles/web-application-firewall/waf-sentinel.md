---
title: Using Azure Sentinel with Azure Web Application Firewall 
description: This article shows you how to use Azure Sentinel with Azure Web Application Firewall (WAF)
services: web-application-firewall
author: TreMansdoerfer
ms.service: web-application-firewall
ms.date: 10/12/2020
ms.author: victorh
ms.topic: how-to
---

# Using Azure Sentinel with Azure Web Application Firewall

Azure Web Application Firewall (WAF) combined with Azure Sentinel can provide security information event management for WAF resources. Azure Sentinel provides security analytics using Log Analytics, which allows you to easily break down and view your WAF data. Using Sentinel, you can access pre-built workbooks and modify them to best fit your organization's needs. The workbook can show analytics for WAF on Azure Content Delivery Network (CDN), WAF on Azure Front Door, and WAF on Application Gateway across several subscriptions and workspaces.

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

1. Select Diagnostic settings
2. Select + Add diagnostic setting. 
3. In the Diagnostic setting page:
   1. Type a name. 
   1. Select **Send to Log Analytics**. 
   1. Choose the log destination workspace. 
   1. Select the log types that you want to analyze:
      1. Application Gateway: ‘ApplicationGatewayAccessLog’ and ‘ApplicationGatewayFirewallLog’
      1. Azure Front Door: ‘FrontDoorAccessLog’ and ‘FrontDoorFirewallLog’
      1. CDN: ‘AzureCdnAccessLog’
   1. Select **Save**.

:::image type="content" source="media//waf-sentinel/diagnostics-setting.png" alt-text="Diagnostic setting":::

4. On the Azure home page, type **Azure Sentinel** in the search bar and select the **Azure Sentinel** resource. 
2. Select an already active workspace or create a new workspace in Sentinel. 
3. On the left side panel under **Configuration** select **Data Connectors**.
4. Search for **Microsoft web application firewall** and select **Microsoft web application firewall (WAF)**. Select **Open connector** page on the bottom right.

:::image type="content" source="media//waf-sentinel/data-connectors.png" alt-text="Data connectors":::

8. Follow the instructions under **Configuration** for each WAF resource that you want to have log analytic data for if you haven't done so previously.
6. Once finished configuring individual WAF resources, select the **Next steps** tab. Select one of the recommended workbooks. This workbook will use all log analytic data that was enabled previously. A working WAF workbook should now exist for your WAF resources.

:::image type="content" source="media//waf-sentinel/waf-workbooks.png" alt-text="WAF workbooks":::


## Next steps

- [Learn more about Azure Sentinel](../sentinel/overview.md)
- [Learn more about Azure Monitor Workbooks](../azure-monitor/platform/workbooks-overview.md)
