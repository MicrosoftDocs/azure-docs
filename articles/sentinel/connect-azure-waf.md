---
title: Connect Azure Web Application Firewall (WAF) data to Azure Sentinel
description: Learn how to connect Azure WAF data to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 05/07/2020
ms.author: yelevin
---
# Connect data from Azure Web Application Firewall (WAF)

Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. Azure Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and threats, among which SQL injection and cross-site scripting are examples. Azure WAF can be deployed on the [Azure Application Gateway](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview) service (for regional HTTP/S application delivery), the [Azure Front Door](https://docs.microsoft.com/azure/web-application-firewall/afds/afds-overview) service (for global HTTP/S application delivery), and the [Azure Content Delivery Network (CDN)](https://docs.microsoft.com/azure/web-application-firewall/cdn/cdn-overview) service (the latter currently in public preview).
You can connect Azure WAF logs to Azure Sentinel, enabling you to view log data in workbooks, use it to create custom alerts, and incorporate it to improve your investigation.

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

## Connect to Azure WAF

1. From the Azure Sentinel navigation menu, select **Data connectors**.
1. From the Data connectors list, click **Azure WAF**, and then click the **Open Connector Page** button on the lower right.
1. Click the link for the type of WAF resource whose logs you wish to connect – **Open Application Gateway resource >**, **Open Front Door resource >**, or **Open CDN resource >** – and once in the resource list’s screen, choose a WAF resource from the list.
    1. From the WAF resource's navigation menu, click **Diagnostic settings**.​
    1. Click **+ Add diagnostic setting** at the bottom of the list.​
    1. In the **Diagnostic settings** screen, type a name in the **Diagnostic settings name** field.
    1. Click the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).​
    1. Click the check boxes of the rule types whose logs you want to ingest. For Application Gateway resources, we recommend: **ApplicationGatewayAccessLog** and **ApplicationGatewayFirewallLog**.​
1. To use the relevant schema in Log Analytics for Azure WAF alerts, search for **AzureDiagnostics**.

## Next steps
In this document, you learned how to connect Azure WAF logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
