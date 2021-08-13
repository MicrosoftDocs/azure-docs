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

Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. Azure Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and threats, such as code injection and cross-site scripting. Azure WAF can be deployed on the [Azure Application Gateway](../web-application-firewall/ag/ag-overview.md) service, the [Azure Front Door](../web-application-firewall/afds/afds-overview.md) service, and through an [Azure Content Delivery Network (CDN)](../web-application-firewall/cdn/cdn-overview.md) WAF policy (the latter currently in public preview).
You can connect Azure WAF logs to Azure Sentinel, enabling you to view log data in workbooks, use it to create custom alerts, and incorporate it to improve your investigation.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

## Connect to Azure WAF

### Instructions tab

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure web application firewall (WAF)** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. Select the link for the type of WAF resource whose logs you wish to connect – **Open Application Gateway resource >**, **Open Front Door resource >**, or **Open Content Delivery Network (CDN) WAF policy >** – and once in the resource list’s screen, choose a WAF resource from the list.

    1. From the WAF resource's navigation menu, select **Diagnostic settings**.​

    1. Select **+ Add diagnostic setting** at the bottom of the list.​

    1. In the **Diagnostic settings** screen, type a name in the **Diagnostic settings name** field.

    1. Click the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).​

    1. Click the check boxes of the rule types whose logs you want to ingest. Our recommendations for each resource type:

        | Resource | Logs to select for ingestion |
        |----------|------------------------------|
        | Application Gateway | ApplicationGatewayAccessLog<br>ApplicationGatewayFirewallLog |
        | Front Door          | FrontdoorAccessLog<br>FrontdoorWebApplicationFirewallLog |
        | CDN WAF policy      | WebApplicationFirewallLogs |
        |

    1. Select **Save**.

### Next steps tab

- See the recommended workbooks, query samples, and analytics rule templates that are bundled with the **Azure web application firewall** data connector, to get insight into your Azure WAF log data.

- To query Azure WAF data in **Logs**, type **AzureDiagnostics** in the query window.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past two weeks. Once two weeks have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps
In this document, you learned how to connect Azure WAF logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).