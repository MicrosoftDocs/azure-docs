---
title: Connect Google Workspace (G Suite) data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Google Workspace (G Suite) data connector to ingest Google Workspace activity events into Azure Sentinel. View Google Workspace data in workbooks, create alerts, and improve investigation.
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
ms.date: 02/28/2021
ms.author: yelevin

---
# Connect your Google Workspace to Azure Sentinel

> [!IMPORTANT]
> The Google Workspace connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The [Google Workspace (formerly G Suite)](https://workspace.google.com/) data connector provides the capability to ingest Google Workspace Activity events into Azure Sentinel through the REST API. The connector gives these [events](https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities) visibility in your SOC, which helps you examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems, track who signs in and when, analyze administrator activity, understand how users create and share content, and review more events in your organization.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

To collect Google Workspace data, you must have the following permissions and credentials:

- Read and write permissions on your Azure Sentinel workspace.

- Read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

- Read and write permissions to Azure Functions to create a Function App. [Learn more about Azure Functions](../azure-functions/index.yml).

- The **GooglePickleString** credential is required for REST API. [Learn more about Google REST API](https://developers.google.com/admin-sdk/reports/v1/reference/activities). [Learn how to obtain credentials](https://developers.google.com/admin-sdk/reports/v1/quickstart/python).

## Configure and connect Google Workspace

Google Workspace can integrate and export logs directly to Azure Sentinel using an Azure Function App.

> [!NOTE]
> This connector uses Azure Functions to connect to the Google Reports API to pull activity events into Azure Sentinel. This may result in additional data ingestion costs. Check the [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/) page for details.

1. In the Azure Sentinel portal, click **Data connectors**. 

1. Select **Google Workspace (G Suite) (Preview)** from the connectors gallery, and select **Open connector page**.

1. Follow the steps described in the **Configuration** section of the connector page.

## Validate connectivity and find your data

It may take up to 20 minutes until you're able to see ingested data in Azure Sentinel.

After a successful connection is established, the data appears in **Logs**, under the **Custom Logs** section, in the following tables:
- `GWorkspace_ReportsAPI_admin_CL`
- `GWorkspace_ReportsAPI_calendar_CL`
- `GWorkspace_ReportsAPI_drive_CL`
- `GWorkspace_ReportsAPI_login_CL`
- `GWorkspace_ReportsAPI_mobile_CL`
- `GWorkspace_ReportsAPI_token_CL`
- `GWorkspace_ReportsAPI_user_accounts_CL`

This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-GWorkspaceReportsAPI-parser) to create the **GWorkspaceActivityReports** Kusto functions alias.

See the **Next steps** tab in the connector page for some useful sample queries.

## Next steps

In this document, you learned how to connect Google Workspace to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.