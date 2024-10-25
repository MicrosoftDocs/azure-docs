---
title: 'Collecting resource logs for Azure Network Security Perimeter'
description: Learn the options for collecting resource logs for Azure Network Security Perimeter and how to enable logging through the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: conceptual
ms.date: 09/16/2024
#CustomerIntent: As a network administrator, I want to collect resource logging for Azure Network Security Perimeter, so that I can monitor and analyze the network traffic to and from my resources.
---

# Collecting resource logs for Azure Network Security Perimeter

In this article, you learn about the resource logs for network security perimeter and how to enable logging. You learn access logs categories used. Then, you discover the options for storing resource logs and how to enable logging through the Azure portal.

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Access logs categories

Network security perimeter access logs categories are based on the results of access rules evaluation. The log categories chosen in the diagnostic settings are sent to the customer chosen storage location. The following are the descriptions for each of the access log categories including the modes in which they're applicable:

| **Log category** | **Description** | **Applicable to Modes** |
| --- | --- | --- |
| **network security perimeterPublicInboundPerimeterRulesAllowed** | Inbound access is allowed based on network security perimeter access rules | Learning/Enforced |
| **network security perimeterPublicInboundPerimeterRulesDenied** | Public inbound access denied by network security perimeter | Enforced |
| **network security perimeterPublicOutboundPerimeterRulesAllowed** | Outbound access is allowed based on network security perimeter access rules | Learning/Enforced |
| **network security perimeterPublicOutboundPerimeterRulesDenied** | Public outbound access denied by network security perimeter | Enforced |
| **network security perimeterOutboundAttempt** | Outbound attempt within network security perimeter or between two 'linked' network security perimeters | Learning/Enforced |
| **network security perimeterIntraPerimeterInboundAllowed** | Inbound access within perimeter | Learning/Enforced |
| **network security perimeterPublicInboundResourceRulesAllowed** | When network security perimeter rules deny, and Inbound access allowed based on PaaS resource rules | Learning |
| **network security perimeterPublicInboundResourceRulesDenied** | When network security perimeter rules deny, Inbound access denied by PaaS resource rules | Learning |
| **network security perimeterPublicOutboundResourceRulesAllowed** | When network security perimeter rules deny, Outbound access allowed based on PaaS resource rules | Learning |
| **network security perimeterPublicOutboundResourceRulesDenied** | When network security perimeter rules deny, Outbound access denied by PaaS resource rules | Learning |
| **network security perimeterCrossPerimeterInboundAllowed** | Inbound access based on 'Link' rules | Learning/Enforced |
| **network security perimeterCrossPerimeterOutboundAllowed** | Outbound access based on 'Link' rules | Learning/Enforced |
| **network security perimeterPrivateInboundAllowed** | Private endpoint traffic | Learning/Enforced |

## Storage options for access logs

You can store the resource logs in the following locations:

| **Service** | **Description** |
| --- | --- |
| **Log Analytic workspace** | Log Analytic workspaces are recommended since they all you to use the predefined queries, visualizations, and set alerts based on specific log conditions. |
|**Azure Storage account** | Storage accounts are best used for logs when logs are stored for a longer duration and reviewed when needed. |
| **Azure Event Hubs** | Event hubs are a great option for integrating with other security information and event management (SIEM) tools to get alerts on your resources. |

## Enable logging through the Azure portal

You can enable resource logging for network security perimeter by using the Azure portal under **Diagnostic settings**. When adding a diagnostic setting, you can choose the log categories you want to collect and the destination where you want to store the logs.

:::image type="content" source="media/network-security-perimeter-diagnostic-logs/network-security-perimeter-diagnostic-settings.png" alt-text="Screenshot of diagnostic settings options for network security perimeter.":::
  
> [!NOTE]
> The Diagnostics settings page provides the settings for the resource logs. You can use Log Analytics, storage account and/or event hubs to save the resource logs. 

## Activity log

Azure generates the activity log by default. The logs are preserved for 90 days in the Azure event logs store. Learn more about these logs with [Use the Azure Monitor activity log and activity log insights](/azure/azure-monitor/essentials/activity-log-insights).

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./network-security-perimeter-collect-resource-logs.md)