---
title: Connect Salesforce Service Cloud data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Salesforce Service Cloud data connector to pull Salesforce logs into Azure Sentinel. View Salesforce data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/17/2021
ms.author: yelevin

---
# Connect your Salesforce Service Cloud to Azure Sentinel

> [!IMPORTANT]
> The Salesforce Service Cloud connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Salesforce Service Cloud solution to Azure Sentinel. The Salesforce Service Cloud data connector allows you to easily connect your Salesforce data with Azure Sentinel, so that you can view it in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Salesforce Service Cloud and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permission on the Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

- You must have read and write permissions to Azure Functions in order to create a Function App. [Learn more about Azure Functions](../azure-functions/index.yml).

- You must have the following Salesforce REST API credentials: **Salesforce API Username**, **Salesforce API Password**, **Salesforce Security Token**, **Salesforce Consumer Key**, **Salesforce Consumer Secret**. [Learn more about Salesforce REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/quickstart.htm).

## Configure and connect Salesforce Service Cloud

Salesforce Service Cloud can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Salesforce Service Cloud (Preview)** and then **Open connector page**.

1. Follow the steps described in the **Configuration** section of the connector page.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **CustomLogs** section, in the `SalesforceServiceCloud_CL` table.

See the **Next steps** tab in the connector page for some useful sample queries.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Salesforce Service Cloud to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.